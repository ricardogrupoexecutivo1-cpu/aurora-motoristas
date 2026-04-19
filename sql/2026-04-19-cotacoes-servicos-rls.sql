-- ============================================================================
-- Aurora Motoristas
-- Camada isolada de cotações e serviços com RLS forte
-- Regras:
-- 1) cliente nao ve dados de outro cliente
-- 2) motorista ve apenas servicos dele
-- 3) motorista so ve servico dele ate receber
-- 4) admin tem acesso total
-- ============================================================================

begin;

-- ============================================================================
-- EXTENSOES
-- ============================================================================

create extension if not exists pgcrypto;

-- ============================================================================
-- FUNCOES AUXILIARES
-- ============================================================================

create or replace function public.current_user_email()
returns text
language sql
stable
as $$
  select lower(coalesce(auth.jwt() ->> 'email', ''));
$$;

create or replace function public.is_admin_master()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and lower(coalesce(p.role, '')) in ('admin', 'admin_master', 'master', 'super_admin')
  );
$$;

create or replace function public.current_company_id()
returns uuid
language sql
stable
as $$
  select p.company_id
  from public.profiles p
  where p.id = auth.uid()
  limit 1;
$$;

create or replace function public.user_is_same_client(p_client_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.am_clients c
    where c.id = p_client_id
      and (
        c.user_id = auth.uid()
        or lower(coalesce(c.email, '')) = public.current_user_email()
      )
  );
$$;

create or replace function public.user_is_same_motorista(p_motorista_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.am_motoristas m
    where m.id = p_motorista_id
      and (
        m.user_id = auth.uid()
        or lower(coalesce(m.email, '')) = public.current_user_email()
      )
  );
$$;

create or replace function public.user_can_view_service_as_motorista(
  p_motorista_id uuid,
  p_status text,
  p_payment_status text
)
returns boolean
language sql
stable
as $$
  select
    public.user_is_same_motorista(p_motorista_id)
    and lower(coalesce(p_payment_status, 'pendente')) not in ('recebido', 'pago', 'baixado')
    and lower(coalesce(p_status, '')) not in ('cancelado', 'arquivado');
$$;

-- ============================================================================
-- TABELA DE CLIENTES
-- ============================================================================

create table if not exists public.am_clients (
  id uuid primary key default gen_random_uuid(),
  company_id uuid,
  user_id uuid,
  nome text not null,
  tipo_pessoa text default 'juridica',
  documento text,
  email text,
  telefone text,
  endereco text,
  cidade text,
  estado text,
  cep text,
  financeiro_email text,
  responsavel_financeiro text,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_am_clients_company_id on public.am_clients(company_id);
create index if not exists idx_am_clients_user_id on public.am_clients(user_id);
create index if not exists idx_am_clients_email on public.am_clients(lower(email));
create index if not exists idx_am_clients_documento on public.am_clients(documento);

-- ============================================================================
-- TABELA DE MOTORISTAS
-- ============================================================================

create table if not exists public.am_motoristas (
  id uuid primary key default gen_random_uuid(),
  company_id uuid,
  user_id uuid,
  nome text not null,
  cpf text,
  email text,
  telefone text,
  cidade text,
  estado text,
  base_operacional text,
  status text not null default 'ativo',
  ativo boolean not null default true,
  bloqueado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_am_motoristas_company_id on public.am_motoristas(company_id);
create index if not exists idx_am_motoristas_user_id on public.am_motoristas(user_id);
create index if not exists idx_am_motoristas_email on public.am_motoristas(lower(email));
create index if not exists idx_am_motoristas_status on public.am_motoristas(status);

-- ============================================================================
-- TABELA DE COTACOES
-- ============================================================================

create table if not exists public.am_quotes (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  client_id uuid references public.am_clients(id) on delete set null,
  motorista_id uuid references public.am_motoristas(id) on delete set null,

  tipo text not null default 'transfer',
  modalidade text default 'transfer',
  status text not null default 'enviada', -- enviada | aceita | recusada | cancelada

  contratante text not null,
  cliente_final text,
  empresa_operadora text,
  telefone_contratante text,
  email_contratante text,
  forma_pagamento text default 'a combinar',

  data_servico date,
  horario_servico time,
  horario_apresentacao time,
  local_apresentacao text,
  origem text,
  destino text,
  observacao_apresentacao text,

  quantidade numeric(12,2) not null default 1,
  unidade_quantidade text not null default 'servico',
  valor_unitario_cliente numeric(12,2) not null default 0,
  valor_unitario_motorista numeric(12,2) not null default 0,

  km_ida numeric(12,2) not null default 0,
  km_retorno numeric(12,2) not null default 0,
  valor_km_sem_reembolso numeric(12,2) not null default 2.9,
  valor_km_com_reembolso numeric(12,2) not null default 2.1,
  reembolso_ida boolean not null default false,
  reembolso_retorno boolean not null default false,

  horas_espera numeric(12,2) not null default 0,
  cobrar_diaria_extra boolean not null default true,
  valor_diaria_extra numeric(12,2) not null default 0,
  quantidade_diarias_extras numeric(12,2) not null default 0,
  motivo_diaria_extra text,

  total_despesas numeric(12,2) not null default 0,
  total_operacional numeric(12,2) not null default 0,
  total_cliente numeric(12,2) not null default 0,
  total_motorista numeric(12,2) not null default 0,
  subtotal_custos numeric(12,2) not null default 0,
  acrescimo_urgente numeric(12,2) not null default 0,
  acrescimo_emergencial numeric(12,2) not null default 0,
  total_cotacao numeric(12,2) not null default 0,
  margem_bruta numeric(12,2) not null default 0,

  tipo_pessoa_cliente text default 'juridica',
  cnpj_cliente text,
  inscricao_estadual text,
  inscricao_municipal text,
  endereco_cliente text,
  cidade_cliente text,
  estado_cliente text,
  cep_cliente text,
  email_financeiro_cliente text,
  responsavel_financeiro_cliente text,

  tipo_faturamento text default 'por servico',
  competencia_faturamento text,
  periodo_referencia text,
  agrupar_fechamento_mensal boolean not null default false,

  tipo_documento_cobranca text default 'nota de debito',
  prazo_pagamento_dias integer default 7,
  data_futura_emissao date,
  data_futura_vencimento date,

  emitente_nome text,
  emitente_documento text,
  emitente_inscricao text,
  emitente_endereco text,
  emitente_cidade_estado text,
  emitente_telefone text,
  emitente_email text,
  emitente_pagamento text,
  observacoes_financeiras text,

  fluxo_formal boolean not null default true,
  visivel_motorista boolean not null default false,
  pronta_para_virar_servico boolean not null default false,

  observacoes_cliente text,
  observacoes_internas text,

  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_am_quotes_company_id on public.am_quotes(company_id);
create index if not exists idx_am_quotes_client_id on public.am_quotes(client_id);
create index if not exists idx_am_quotes_motorista_id on public.am_quotes(motorista_id);
create index if not exists idx_am_quotes_status on public.am_quotes(status);
create index if not exists idx_am_quotes_data_servico on public.am_quotes(data_servico);

-- ============================================================================
-- TABELA DE DESPESAS DA COTACAO
-- ============================================================================

create table if not exists public.am_quote_expenses (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.am_quotes(id) on delete cascade,
  company_id uuid not null,
  tipo text not null,
  descricao text,
  valor numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_am_quote_expenses_quote_id on public.am_quote_expenses(quote_id);
create index if not exists idx_am_quote_expenses_company_id on public.am_quote_expenses(company_id);

-- ============================================================================
-- TABELA DE SERVICOS
-- ============================================================================

create table if not exists public.am_services (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  quote_id uuid references public.am_quotes(id) on delete set null,
  client_id uuid references public.am_clients(id) on delete set null,
  motorista_id uuid references public.am_motoristas(id) on delete set null,

  tipo text not null default 'transfer',
  status text not null default 'pendente', -- pendente | aceito | em_andamento | aguardando_pagamento | pago | cancelado | arquivado
  payment_status text not null default 'pendente', -- pendente | aguardando | recebido | pago | baixado

  contratante text not null,
  cliente_final text,
  telefone_contratante text,
  email_contratante text,
  data_servico date,
  horario_servico time,
  origem text,
  destino text,
  local_apresentacao text,

  valor_cliente numeric(12,2) not null default 0,
  valor_motorista numeric(12,2) not null default 0,
  total_despesas numeric(12,2) not null default 0,
  total_servico numeric(12,2) not null default 0,

  visivel_motorista boolean not null default true,
  observacoes_cliente text,
  observacoes_internas text,

  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_am_services_company_id on public.am_services(company_id);
create index if not exists idx_am_services_quote_id on public.am_services(quote_id);
create index if not exists idx_am_services_client_id on public.am_services(client_id);
create index if not exists idx_am_services_motorista_id on public.am_services(motorista_id);
create index if not exists idx_am_services_status on public.am_services(status);
create index if not exists idx_am_services_payment_status on public.am_services(payment_status);
create index if not exists idx_am_services_data_servico on public.am_services(data_servico);

-- ============================================================================
-- UPDATED_AT AUTOMATICO
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_am_clients_updated_at on public.am_clients;
create trigger trg_am_clients_updated_at
before update on public.am_clients
for each row
execute function public.set_updated_at();

drop trigger if exists trg_am_motoristas_updated_at on public.am_motoristas;
create trigger trg_am_motoristas_updated_at
before update on public.am_motoristas
for each row
execute function public.set_updated_at();

drop trigger if exists trg_am_quotes_updated_at on public.am_quotes;
create trigger trg_am_quotes_updated_at
before update on public.am_quotes
for each row
execute function public.set_updated_at();

drop trigger if exists trg_am_services_updated_at on public.am_services;
create trigger trg_am_services_updated_at
before update on public.am_services
for each row
execute function public.set_updated_at();

-- ============================================================================
-- FUNCAO PARA VIRAR COTACAO EM SERVICO
-- REGRA:
-- - precisa estar aceita
-- - precisa ter motorista preenchido
-- - precisa estar pronta_para_virar_servico = true
-- ============================================================================

create or replace function public.am_quote_to_service(p_quote_id uuid)
returns uuid
language plpgsql
security definer
as $$
declare
  v_quote public.am_quotes%rowtype;
  v_service_id uuid;
begin
  select *
    into v_quote
  from public.am_quotes
  where id = p_quote_id;

  if not found then
    raise exception 'Cotação não encontrada.';
  end if;

  if lower(coalesce(v_quote.status, '')) <> 'aceita' then
    raise exception 'A cotação precisa estar aceita para virar serviço.';
  end if;

  if v_quote.motorista_id is null then
    raise exception 'A cotação precisa ter motorista vinculado para virar serviço.';
  end if;

  if coalesce(v_quote.pronta_para_virar_servico, false) is not true then
    raise exception 'Marque a cotação como pronta para virar serviço.';
  end if;

  insert into public.am_services (
    company_id,
    quote_id,
    client_id,
    motorista_id,
    tipo,
    status,
    payment_status,
    contratante,
    cliente_final,
    telefone_contratante,
    email_contratante,
    data_servico,
    horario_servico,
    origem,
    destino,
    local_apresentacao,
    valor_cliente,
    valor_motorista,
    total_despesas,
    total_servico,
    visivel_motorista,
    observacoes_cliente,
    observacoes_internas,
    created_by,
    updated_by
  )
  values (
    v_quote.company_id,
    v_quote.id,
    v_quote.client_id,
    v_quote.motorista_id,
    v_quote.tipo,
    'pendente',
    'pendente',
    v_quote.contratante,
    v_quote.cliente_final,
    v_quote.telefone_contratante,
    v_quote.email_contratante,
    v_quote.data_servico,
    v_quote.horario_servico,
    v_quote.origem,
    v_quote.destino,
    v_quote.local_apresentacao,
    v_quote.total_cliente,
    v_quote.total_motorista,
    v_quote.total_despesas,
    v_quote.total_cotacao,
    true,
    v_quote.observacoes_cliente,
    v_quote.observacoes_internas,
    auth.uid(),
    auth.uid()
  )
  returning id into v_service_id;

  return v_service_id;
end;
$$;

revoke all on function public.am_quote_to_service(uuid) from public;
grant execute on function public.am_quote_to_service(uuid) to authenticated;

-- ============================================================================
-- RLS
-- ============================================================================

alter table public.am_clients enable row level security;
alter table public.am_motoristas enable row level security;
alter table public.am_quotes enable row level security;
alter table public.am_quote_expenses enable row level security;
alter table public.am_services enable row level security;

-- ============================================================================
-- POLICIES - CLIENTES
-- ============================================================================

drop policy if exists "am_clients_select_admin" on public.am_clients;
create policy "am_clients_select_admin"
on public.am_clients
for select
to authenticated
using (
  public.is_admin_master()
  or company_id = public.current_company_id()
  or public.user_is_same_client(id)
);

drop policy if exists "am_clients_insert_admin" on public.am_clients;
create policy "am_clients_insert_admin"
on public.am_clients
for insert
to authenticated
with check (
  public.is_admin_master()
  or company_id = public.current_company_id()
);

drop policy if exists "am_clients_update_admin" on public.am_clients;
create policy "am_clients_update_admin"
on public.am_clients
for update
to authenticated
using (
  public.is_admin_master()
  or company_id = public.current_company_id()
)
with check (
  public.is_admin_master()
  or company_id = public.current_company_id()
);

drop policy if exists "am_clients_delete_admin" on public.am_clients;
create policy "am_clients_delete_admin"
on public.am_clients
for delete
to authenticated
using (
  public.is_admin_master()
  or company_id = public.current_company_id()
);

-- ============================================================================
-- POLICIES - MOTORISTAS
-- ============================================================================

drop policy if exists "am_motoristas_select" on public.am_motoristas;
create policy "am_motoristas_select"
on public.am_motoristas
for select
to authenticated
using (
  public.is_admin_master()
  or company_id = public.current_company_id()
  or public.user_is_same_motorista(id)
);

drop policy if exists "am_motoristas_insert_admin" on public.am_motoristas;
create policy "am_motoristas_insert_admin"
on public.am_motoristas
for insert
to authenticated
with check (
  public.is_admin_master()
  or company_id = public.current_company_id()
);

drop policy if exists "am_motoristas_update_admin" on public.am_motoristas;
create policy "am_motoristas_update_admin"
on public.am_motoristas
for update
to authenticated
using (
  public.is_admin_master()
  or company_id = public.current_company_id()
)
with check (
  public.is_admin_master()
  or company_id = public.current_company_id()
);

drop policy if exists "am_motoristas_delete_admin" on public.am_motoristas;
create policy "am_motoristas_delete_admin"
on public.am_motoristas
for delete
to authenticated
using (
  public.is_admin_master()
  or company_id = public.current_company_id()
);

-- ============================================================================
-- POLICIES - COTACOES
-- Cliente so ve as cotacoes dele
-- Motorista pode ver apenas as cotacoes dele e somente quando visivel_motorista=true
-- Admin ve tudo da empresa / master ve tudo
-- ============================================================================

drop policy if exists "am_quotes_select" on public.am_quotes;
create policy "am_quotes_select"
on public.am_quotes
for select
to authenticated
using (
  public.is_admin_master()
  or company_id = public.current_company_id()
  or public.user_is_same_client(client_id)
  or (
    visivel_motorista = true
    and public.user_is_same_motorista(motorista_id)
  )
);

drop policy if exists "am_quotes_insert_admin" on public.am_quotes;
create policy "am_quotes_insert_admin"
on public.am_quotes
for insert
to authenticated
with check (
  public.is_admin_master()
  or company_id = public.current_company_id()
);

drop policy if exists "am_quotes_update_admin" on public.am_quotes;
create policy "am_quotes_update_admin"
on public.am_quotes
for update
to authenticated
using (
  public.is_admin_master()
  or company_id = public.current_company_id()
)
with check (
  public.is_admin_master()
  or company_id = public.current_company_id()
);

drop policy if exists "am_quotes_delete_admin" on public.am_quotes;
create policy "am_quotes_delete_admin"
on public.am_quotes
for delete
to authenticated
using (
  public.is_admin_master()
  or company_id = public.current_company_id()
);

-- ============================================================================
-- POLICIES - DESPESAS DAS COTACOES
-- Apenas admin/empresa
-- ============================================================================

drop policy if exists "am_quote_expenses_select_admin" on public.am_quote_expenses;
create policy "am_quote_expenses_select_admin"
on public.am_quote_expenses
for select
to authenticated
using (
  public.is_admin_master()
  or company_id = public.current_company_id()
);

drop policy if exists "am_quote_expenses_insert_admin" on public.am_quote_expenses;
create policy "am_quote_expenses_insert_admin"
on public.am_quote_expenses
for insert
to authenticated
with check (
  public.is_admin_master()
  or company_id = public.current_company_id()
);

drop policy if exists "am_quote_expenses_update_admin" on public.am_quote_expenses;
create policy "am_quote_expenses_update_admin"
on public.am_quote_expenses
for update
to authenticated
using (
  public.is_admin_master()
  or company_id = public.current_company_id()
)
with check (
  public.is_admin_master()
  or company_id = public.current_company_id()
);

drop policy if exists "am_quote_expenses_delete_admin" on public.am_quote_expenses;
create policy "am_quote_expenses_delete_admin"
on public.am_quote_expenses
for delete
to authenticated
using (
  public.is_admin_master()
  or company_id = public.current_company_id()
);

-- ============================================================================
-- POLICIES - SERVICOS
-- Regra principal:
-- 1) admin ve tudo
-- 2) cliente ve so os servicos dele
-- 3) motorista ve so os servicos dele e apenas ate receber
-- ============================================================================

drop policy if exists "am_services_select" on public.am_services;
create policy "am_services_select"
on public.am_services
for select
to authenticated
using (
  public.is_admin_master()
  or company_id = public.current_company_id()
  or public.user_is_same_client(client_id)
  or (
    visivel_motorista = true
    and public.user_can_view_service_as_motorista(motorista_id, status, payment_status)
  )
);

drop policy if exists "am_services_insert_admin" on public.am_services;
create policy "am_services_insert_admin"
on public.am_services
for insert
to authenticated
with check (
  public.is_admin_master()
  or company_id = public.current_company_id()
);

drop policy if exists "am_services_update_admin" on public.am_services;
create policy "am_services_update_admin"
on public.am_services
for update
to authenticated
using (
  public.is_admin_master()
  or company_id = public.current_company_id()
)
with check (
  public.is_admin_master()
  or company_id = public.current_company_id()
);

drop policy if exists "am_services_delete_admin" on public.am_services;
create policy "am_services_delete_admin"
on public.am_services
for delete
to authenticated
using (
  public.is_admin_master()
  or company_id = public.current_company_id()
);

-- ============================================================================
-- VIEW ADMINISTRATIVA
-- ============================================================================

create or replace view public.am_services_admin_view as
select
  s.id,
  s.company_id,
  s.quote_id,
  s.client_id,
  c.nome as client_nome,
  s.motorista_id,
  m.nome as motorista_nome,
  s.tipo,
  s.status,
  s.payment_status,
  s.contratante,
  s.cliente_final,
  s.data_servico,
  s.horario_servico,
  s.origem,
  s.destino,
  s.valor_cliente,
  s.valor_motorista,
  s.total_despesas,
  s.total_servico,
  s.visivel_motorista,
  s.created_at,
  s.updated_at
from public.am_services s
left join public.am_clients c on c.id = s.client_id
left join public.am_motoristas m on m.id = s.motorista_id;

commit;