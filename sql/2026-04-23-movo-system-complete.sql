-- ============================================================================
-- MOVO - Sistema Completo de Mobilidade e Entregas
-- www.appmotoristas.com.br
-- Taxa de 5% - A menor do mercado
-- Seguranca maxima, pontuacao, IA e monetizacao
-- ============================================================================

begin;

-- ============================================================================
-- TABELA DE PERFIS (ADMIN MASTER)
-- ============================================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  phone text,
  avatar_url text,
  role text not null default 'user', -- user | driver | admin | admin_master | super_admin
  company_id uuid,
  is_verified boolean not null default false,
  is_blocked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_email on public.profiles(lower(email));
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_company_id on public.profiles(company_id);

-- ============================================================================
-- TABELA DE VEÍCULOS DOS MOTORISTAS
-- ============================================================================

create table if not exists public.am_vehicles (
  id uuid primary key default gen_random_uuid(),
  motorista_id uuid not null references public.am_motoristas(id) on delete cascade,
  marca text not null,
  modelo text not null,
  ano integer not null,
  cor text not null,
  placa text not null unique,
  renavam text,
  categoria text not null default 'sedan', -- sedan | suv | executivo | van | moto
  capacidade_passageiros integer not null default 4,
  ar_condicionado boolean not null default true,
  wifi boolean not null default false,
  agua_disponivel boolean not null default false,
  foto_url text,
  documento_url text,
  ativo boolean not null default true,
  verificado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_am_vehicles_motorista_id on public.am_vehicles(motorista_id);
create index if not exists idx_am_vehicles_placa on public.am_vehicles(placa);
create index if not exists idx_am_vehicles_categoria on public.am_vehicles(categoria);

-- ============================================================================
-- TABELA DE DOCUMENTOS (VERIFICAÇÃO SEGURA)
-- ============================================================================

create table if not exists public.am_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  motorista_id uuid references public.am_motoristas(id) on delete cascade,
  client_id uuid references public.am_clients(id) on delete cascade,
  tipo text not null, -- cnh | rg | cpf | comprovante_residencia | antecedentes | foto_perfil | crlv
  numero_documento text,
  data_emissao date,
  data_validade date,
  arquivo_url text not null,
  status text not null default 'pendente', -- pendente | aprovado | rejeitado | expirado
  verificado_por uuid,
  verificado_em timestamptz,
  motivo_rejeicao text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_am_documents_user_id on public.am_documents(user_id);
create index if not exists idx_am_documents_motorista_id on public.am_documents(motorista_id);
create index if not exists idx_am_documents_status on public.am_documents(status);

-- ============================================================================
-- TABELA DE CORRIDAS (MOVO RIDE)
-- ============================================================================

create table if not exists public.am_rides (
  id uuid primary key default gen_random_uuid(),
  company_id uuid,
  client_id uuid references public.am_clients(id) on delete set null,
  motorista_id uuid references public.am_motoristas(id) on delete set null,
  vehicle_id uuid references public.am_vehicles(id) on delete set null,
  
  -- Status da corrida
  status text not null default 'solicitada', 
  -- solicitada | aceita | motorista_a_caminho | em_andamento | finalizada | cancelada
  
  -- Origem e Destino
  origem_endereco text not null,
  origem_lat numeric(10,7),
  origem_lng numeric(10,7),
  destino_endereco text not null,
  destino_lat numeric(10,7),
  destino_lng numeric(10,7),
  
  -- Paradas intermediárias (JSON array)
  paradas jsonb default '[]'::jsonb,
  
  -- Tempo e distância
  distancia_km numeric(10,2) not null default 0,
  duracao_estimada_min integer not null default 0,
  duracao_real_min integer,
  
  -- Valores
  valor_base numeric(12,2) not null default 0,
  valor_km numeric(12,2) not null default 0,
  valor_tempo numeric(12,2) not null default 0,
  valor_pedagio numeric(12,2) not null default 0,
  valor_adicional numeric(12,2) not null default 0,
  desconto numeric(12,2) not null default 0,
  valor_total numeric(12,2) not null default 0,
  
  -- Taxa da plataforma (5%)
  taxa_plataforma_percentual numeric(5,2) not null default 5.00,
  taxa_plataforma_valor numeric(12,2) not null default 0,
  valor_motorista numeric(12,2) not null default 0,
  
  -- Forma de pagamento
  forma_pagamento text not null default 'dinheiro', -- dinheiro | pix | cartao | saldo
  pagamento_status text not null default 'pendente', -- pendente | processando | pago | estornado
  
  -- Categoria
  categoria text not null default 'padrao', -- padrao | conforto | executivo | van | moto
  
  -- Timestamps importantes
  solicitado_em timestamptz not null default now(),
  aceito_em timestamptz,
  iniciado_em timestamptz,
  finalizado_em timestamptz,
  cancelado_em timestamptz,
  cancelado_por text, -- cliente | motorista | sistema
  motivo_cancelamento text,
  
  -- Segurança
  codigo_verificacao char(4),
  compartilhamento_rota_ativo boolean not null default false,
  link_compartilhamento text,
  emergencia_acionada boolean not null default false,
  
  -- Observações
  observacoes_cliente text,
  observacoes_motorista text,
  observacoes_admin text,
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_am_rides_client_id on public.am_rides(client_id);
create index if not exists idx_am_rides_motorista_id on public.am_rides(motorista_id);
create index if not exists idx_am_rides_status on public.am_rides(status);
create index if not exists idx_am_rides_solicitado_em on public.am_rides(solicitado_em);
create index if not exists idx_am_rides_pagamento_status on public.am_rides(pagamento_status);

-- ============================================================================
-- TABELA DE AVALIAÇÕES (SISTEMA DE PONTUAÇÃO)
-- ============================================================================

create table if not exists public.am_ratings (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid not null references public.am_rides(id) on delete cascade,
  service_id uuid references public.am_services(id) on delete set null,
  
  -- Quem avaliou quem
  avaliador_tipo text not null, -- cliente | motorista
  avaliador_client_id uuid references public.am_clients(id) on delete set null,
  avaliador_motorista_id uuid references public.am_motoristas(id) on delete set null,
  avaliado_client_id uuid references public.am_clients(id) on delete set null,
  avaliado_motorista_id uuid references public.am_motoristas(id) on delete set null,
  
  -- Avaliação
  nota integer not null check (nota >= 1 and nota <= 5),
  comentario text,
  
  -- Tags de avaliação
  tags jsonb default '[]'::jsonb, -- ["pontual", "educado", "veiculo_limpo", etc]
  
  -- Resposta
  resposta text,
  respondido_em timestamptz,
  
  -- Moderação
  visivel boolean not null default true,
  moderado boolean not null default false,
  moderado_por uuid,
  moderado_em timestamptz,
  motivo_moderacao text,
  
  created_at timestamptz not null default now()
);

create index if not exists idx_am_ratings_ride_id on public.am_ratings(ride_id);
create index if not exists idx_am_ratings_avaliado_motorista_id on public.am_ratings(avaliado_motorista_id);
create index if not exists idx_am_ratings_avaliado_client_id on public.am_ratings(avaliado_client_id);

-- ============================================================================
-- TABELA DE CARTEIRA DIGITAL (WALLET)
-- ============================================================================

create table if not exists public.am_wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  motorista_id uuid references public.am_motoristas(id) on delete cascade,
  client_id uuid references public.am_clients(id) on delete cascade,
  
  saldo_disponivel numeric(12,2) not null default 0,
  saldo_bloqueado numeric(12,2) not null default 0,
  total_ganhos numeric(12,2) not null default 0,
  total_saques numeric(12,2) not null default 0,
  total_corridas numeric(12,2) not null default 0,
  
  -- Dados bancários para saque
  banco_codigo text,
  banco_nome text,
  agencia text,
  conta text,
  tipo_conta text, -- corrente | poupanca
  cpf_titular text,
  nome_titular text,
  chave_pix text,
  tipo_chave_pix text, -- cpf | cnpj | email | telefone | aleatoria
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_am_wallets_user_id on public.am_wallets(user_id);
create unique index if not exists idx_am_wallets_motorista_id on public.am_wallets(motorista_id);
create unique index if not exists idx_am_wallets_client_id on public.am_wallets(client_id);

-- ============================================================================
-- TABELA DE TRANSAÇÕES FINANCEIRAS
-- ============================================================================

create table if not exists public.am_transactions (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid not null references public.am_wallets(id) on delete cascade,
  ride_id uuid references public.am_rides(id) on delete set null,
  service_id uuid references public.am_services(id) on delete set null,
  
  tipo text not null, -- credito | debito | saque | taxa | bonus | estorno | recarga
  categoria text not null, -- corrida | servico | taxa_plataforma | saque | bonus_indicacao | promocao
  
  valor numeric(12,2) not null,
  saldo_anterior numeric(12,2) not null,
  saldo_posterior numeric(12,2) not null,
  
  descricao text not null,
  referencia text, -- ID externo, comprovante, etc
  
  status text not null default 'confirmada', -- pendente | confirmada | cancelada | estornada
  
  metadata jsonb default '{}'::jsonb,
  
  created_at timestamptz not null default now()
);

create index if not exists idx_am_transactions_wallet_id on public.am_transactions(wallet_id);
create index if not exists idx_am_transactions_ride_id on public.am_transactions(ride_id);
create index if not exists idx_am_transactions_tipo on public.am_transactions(tipo);
create index if not exists idx_am_transactions_created_at on public.am_transactions(created_at);

-- ============================================================================
-- TABELA DE SAQUES
-- ============================================================================

create table if not exists public.am_withdrawals (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid not null references public.am_wallets(id) on delete cascade,
  transaction_id uuid references public.am_transactions(id) on delete set null,
  
  valor numeric(12,2) not null,
  taxa numeric(12,2) not null default 0,
  valor_liquido numeric(12,2) not null,
  
  -- Dados bancários no momento do saque
  banco_nome text not null,
  agencia text not null,
  conta text not null,
  tipo_conta text not null,
  cpf_titular text not null,
  nome_titular text not null,
  chave_pix text,
  
  status text not null default 'pendente', -- pendente | processando | concluido | rejeitado | cancelado
  
  processado_por uuid,
  processado_em timestamptz,
  comprovante_url text,
  motivo_rejeicao text,
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_am_withdrawals_wallet_id on public.am_withdrawals(wallet_id);
create index if not exists idx_am_withdrawals_status on public.am_withdrawals(status);

-- ============================================================================
-- TABELA DE LOCALIZAÇÃO EM TEMPO REAL
-- ============================================================================

create table if not exists public.am_locations (
  id uuid primary key default gen_random_uuid(),
  motorista_id uuid not null references public.am_motoristas(id) on delete cascade,
  ride_id uuid references public.am_rides(id) on delete set null,
  
  lat numeric(10,7) not null,
  lng numeric(10,7) not null,
  heading numeric(5,2), -- Direção em graus
  speed numeric(6,2), -- Velocidade em km/h
  accuracy numeric(8,2), -- Precisão em metros
  
  status text not null default 'online', -- online | ocupado | offline
  
  created_at timestamptz not null default now()
);

create index if not exists idx_am_locations_motorista_id on public.am_locations(motorista_id);
create index if not exists idx_am_locations_ride_id on public.am_locations(ride_id);
create index if not exists idx_am_locations_created_at on public.am_locations(created_at desc);

-- ============================================================================
-- TABELA DE PROMOÇÕES E CUPONS
-- ============================================================================

create table if not exists public.am_promotions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid,
  
  codigo text unique not null,
  nome text not null,
  descricao text,
  
  tipo text not null, -- percentual | valor_fixo | primeira_corrida | indicacao
  valor numeric(12,2) not null,
  valor_minimo_corrida numeric(12,2) default 0,
  valor_maximo_desconto numeric(12,2),
  
  uso_limite integer, -- NULL = ilimitado
  uso_atual integer not null default 0,
  uso_por_usuario integer default 1,
  
  valido_de timestamptz not null default now(),
  valido_ate timestamptz,
  
  apenas_novos_usuarios boolean not null default false,
  categorias_validas jsonb default '[]'::jsonb, -- ["padrao", "conforto"]
  
  ativo boolean not null default true,
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_am_promotions_codigo on public.am_promotions(upper(codigo));
create index if not exists idx_am_promotions_ativo on public.am_promotions(ativo);

-- ============================================================================
-- TABELA DE USO DE CUPONS
-- ============================================================================

create table if not exists public.am_promotion_usage (
  id uuid primary key default gen_random_uuid(),
  promotion_id uuid not null references public.am_promotions(id) on delete cascade,
  client_id uuid references public.am_clients(id) on delete set null,
  ride_id uuid references public.am_rides(id) on delete set null,
  
  valor_desconto numeric(12,2) not null,
  
  created_at timestamptz not null default now()
);

create index if not exists idx_am_promotion_usage_promotion_id on public.am_promotion_usage(promotion_id);
create index if not exists idx_am_promotion_usage_client_id on public.am_promotion_usage(client_id);

-- ============================================================================
-- TABELA DE INDICAÇÕES (PROGRAMA DE REFERÊNCIA)
-- ============================================================================

create table if not exists public.am_referrals (
  id uuid primary key default gen_random_uuid(),
  
  referrer_client_id uuid references public.am_clients(id) on delete set null,
  referrer_motorista_id uuid references public.am_motoristas(id) on delete set null,
  
  referred_client_id uuid references public.am_clients(id) on delete set null,
  referred_motorista_id uuid references public.am_motoristas(id) on delete set null,
  
  codigo_referencia text not null,
  
  status text not null default 'pendente', -- pendente | qualificado | pago | expirado
  
  bonus_referrer numeric(12,2) default 0,
  bonus_referred numeric(12,2) default 0,
  
  qualificado_em timestamptz,
  pago_em timestamptz,
  
  created_at timestamptz not null default now()
);

create index if not exists idx_am_referrals_codigo_referencia on public.am_referrals(codigo_referencia);
create index if not exists idx_am_referrals_referrer_client_id on public.am_referrals(referrer_client_id);
create index if not exists idx_am_referrals_referrer_motorista_id on public.am_referrals(referrer_motorista_id);

-- ============================================================================
-- TABELA DE NOTIFICAÇÕES
-- ============================================================================

create table if not exists public.am_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  motorista_id uuid references public.am_motoristas(id) on delete cascade,
  client_id uuid references public.am_clients(id) on delete cascade,
  
  tipo text not null, -- corrida | pagamento | promocao | sistema | avaliacao | documento
  titulo text not null,
  mensagem text not null,
  
  data jsonb default '{}'::jsonb,
  
  lida boolean not null default false,
  lida_em timestamptz,
  
  acao_url text,
  
  created_at timestamptz not null default now()
);

create index if not exists idx_am_notifications_user_id on public.am_notifications(user_id);
create index if not exists idx_am_notifications_motorista_id on public.am_notifications(motorista_id);
create index if not exists idx_am_notifications_client_id on public.am_notifications(client_id);
create index if not exists idx_am_notifications_lida on public.am_notifications(lida);
create index if not exists idx_am_notifications_created_at on public.am_notifications(created_at desc);

-- ============================================================================
-- TABELA DE EMERGÊNCIAS
-- ============================================================================

create table if not exists public.am_emergencies (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid references public.am_rides(id) on delete set null,
  
  acionado_por_client_id uuid references public.am_clients(id) on delete set null,
  acionado_por_motorista_id uuid references public.am_motoristas(id) on delete set null,
  
  tipo text not null, -- panico | acidente | assalto | outro
  descricao text,
  
  lat numeric(10,7),
  lng numeric(10,7),
  
  status text not null default 'ativo', -- ativo | atendido | resolvido | falso_alarme
  
  atendido_por uuid,
  atendido_em timestamptz,
  resolucao text,
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_am_emergencies_ride_id on public.am_emergencies(ride_id);
create index if not exists idx_am_emergencies_status on public.am_emergencies(status);

-- ============================================================================
-- TABELA DE CHAT (MENSAGENS)
-- ============================================================================

create table if not exists public.am_messages (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid references public.am_rides(id) on delete cascade,
  service_id uuid references public.am_services(id) on delete cascade,
  
  sender_tipo text not null, -- cliente | motorista | sistema
  sender_client_id uuid references public.am_clients(id) on delete set null,
  sender_motorista_id uuid references public.am_motoristas(id) on delete set null,
  
  mensagem text not null,
  tipo text not null default 'texto', -- texto | imagem | audio | localizacao
  arquivo_url text,
  
  lida boolean not null default false,
  lida_em timestamptz,
  
  created_at timestamptz not null default now()
);

create index if not exists idx_am_messages_ride_id on public.am_messages(ride_id);
create index if not exists idx_am_messages_service_id on public.am_messages(service_id);

-- ============================================================================
-- TABELA DE REGRAS DE PREÇO
-- ============================================================================

create table if not exists public.am_pricing_rules (
  id uuid primary key default gen_random_uuid(),
  company_id uuid,
  
  nome text not null,
  categoria text not null, -- padrao | conforto | executivo | van | moto
  
  valor_base numeric(12,2) not null default 5.00,
  valor_por_km numeric(12,2) not null default 2.00,
  valor_por_minuto numeric(12,2) not null default 0.50,
  valor_minimo numeric(12,2) not null default 10.00,
  
  -- Multiplicadores dinâmicos
  multiplicador_pico numeric(5,2) default 1.5,
  multiplicador_madrugada numeric(5,2) default 1.3,
  multiplicador_feriado numeric(5,2) default 1.5,
  multiplicador_chuva numeric(5,2) default 1.2,
  
  -- Horários de pico
  horario_pico_manha_inicio time default '07:00',
  horario_pico_manha_fim time default '09:00',
  horario_pico_tarde_inicio time default '17:00',
  horario_pico_tarde_fim time default '20:00',
  
  ativo boolean not null default true,
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_am_pricing_rules_categoria on public.am_pricing_rules(categoria);
create index if not exists idx_am_pricing_rules_ativo on public.am_pricing_rules(ativo);

-- ============================================================================
-- TABELA DE LOGS DE AUDITORIA (ADMIN)
-- ============================================================================

create table if not exists public.am_audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  
  acao text not null,
  tabela text not null,
  registro_id uuid,
  
  dados_anteriores jsonb,
  dados_novos jsonb,
  
  ip_address text,
  user_agent text,
  
  created_at timestamptz not null default now()
);

create index if not exists idx_am_audit_logs_user_id on public.am_audit_logs(user_id);
create index if not exists idx_am_audit_logs_tabela on public.am_audit_logs(tabela);
create index if not exists idx_am_audit_logs_created_at on public.am_audit_logs(created_at desc);

-- ============================================================================
-- TABELA DE CONFIGURAÇÕES DO SISTEMA
-- ============================================================================

create table if not exists public.am_settings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid,
  
  chave text not null,
  valor jsonb not null,
  descricao text,
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  unique(company_id, chave)
);

-- Configurações padrão
insert into public.am_settings (chave, valor, descricao) values
  ('taxa_plataforma', '5.00', 'Taxa da plataforma em percentual'),
  ('valor_minimo_saque', '50.00', 'Valor mínimo para saque'),
  ('taxa_saque', '0.00', 'Taxa de saque'),
  ('bonus_indicacao_motorista', '50.00', 'Bônus por indicar motorista'),
  ('bonus_indicacao_cliente', '20.00', 'Bônus por indicar cliente'),
  ('tempo_cancelamento_gratis', '5', 'Minutos para cancelar sem taxa'),
  ('taxa_cancelamento', '5.00', 'Taxa de cancelamento'),
  ('distancia_maxima_busca_km', '15', 'Raio máximo para buscar motoristas'),
  ('tempo_aceitar_corrida_seg', '30', 'Tempo para motorista aceitar corrida'),
  ('nota_minima_motorista', '4.0', 'Nota mínima para motorista continuar ativo'),
  ('nota_minima_cliente', '3.0', 'Nota mínima para cliente usar plataforma')
on conflict do nothing;

-- ============================================================================
-- TABELA DE CONVERSAS COM IA
-- ============================================================================

create table if not exists public.am_ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  motorista_id uuid references public.am_motoristas(id) on delete cascade,
  client_id uuid references public.am_clients(id) on delete cascade,
  
  titulo text,
  contexto text, -- suporte | cotacao | duvida | reclamacao | outro
  
  status text not null default 'ativo', -- ativo | resolvido | escalado
  
  escalado_para_humano boolean not null default false,
  atendido_por uuid,
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.am_ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.am_ai_conversations(id) on delete cascade,
  
  role text not null, -- user | assistant | system
  content text not null,
  
  tokens_used integer,
  
  created_at timestamptz not null default now()
);

create index if not exists idx_am_ai_conversations_user_id on public.am_ai_conversations(user_id);
create index if not exists idx_am_ai_messages_conversation_id on public.am_ai_messages(conversation_id);

-- ============================================================================
-- TRIGGERS DE UPDATED_AT
-- ============================================================================

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_am_vehicles_updated_at on public.am_vehicles;
create trigger trg_am_vehicles_updated_at before update on public.am_vehicles
for each row execute function public.set_updated_at();

drop trigger if exists trg_am_documents_updated_at on public.am_documents;
create trigger trg_am_documents_updated_at before update on public.am_documents
for each row execute function public.set_updated_at();

drop trigger if exists trg_am_rides_updated_at on public.am_rides;
create trigger trg_am_rides_updated_at before update on public.am_rides
for each row execute function public.set_updated_at();

drop trigger if exists trg_am_wallets_updated_at on public.am_wallets;
create trigger trg_am_wallets_updated_at before update on public.am_wallets
for each row execute function public.set_updated_at();

drop trigger if exists trg_am_withdrawals_updated_at on public.am_withdrawals;
create trigger trg_am_withdrawals_updated_at before update on public.am_withdrawals
for each row execute function public.set_updated_at();

drop trigger if exists trg_am_promotions_updated_at on public.am_promotions;
create trigger trg_am_promotions_updated_at before update on public.am_promotions
for each row execute function public.set_updated_at();

drop trigger if exists trg_am_emergencies_updated_at on public.am_emergencies;
create trigger trg_am_emergencies_updated_at before update on public.am_emergencies
for each row execute function public.set_updated_at();

drop trigger if exists trg_am_pricing_rules_updated_at on public.am_pricing_rules;
create trigger trg_am_pricing_rules_updated_at before update on public.am_pricing_rules
for each row execute function public.set_updated_at();

drop trigger if exists trg_am_settings_updated_at on public.am_settings;
create trigger trg_am_settings_updated_at before update on public.am_settings
for each row execute function public.set_updated_at();

drop trigger if exists trg_am_ai_conversations_updated_at on public.am_ai_conversations;
create trigger trg_am_ai_conversations_updated_at before update on public.am_ai_conversations
for each row execute function public.set_updated_at();

-- ============================================================================
-- FUNÇÕES DE CÁLCULO
-- ============================================================================

-- Calcular nota média do motorista
create or replace function public.am_motorista_rating(p_motorista_id uuid)
returns numeric
language sql
stable
as $$
  select coalesce(round(avg(nota)::numeric, 2), 5.0)
  from public.am_ratings
  where avaliado_motorista_id = p_motorista_id
    and visivel = true;
$$;

-- Calcular nota média do cliente
create or replace function public.am_client_rating(p_client_id uuid)
returns numeric
language sql
stable
as $$
  select coalesce(round(avg(nota)::numeric, 2), 5.0)
  from public.am_ratings
  where avaliado_client_id = p_client_id
    and visivel = true;
$$;

-- Calcular total de corridas do motorista
create or replace function public.am_motorista_total_rides(p_motorista_id uuid)
returns integer
language sql
stable
as $$
  select count(*)::integer
  from public.am_rides
  where motorista_id = p_motorista_id
    and status = 'finalizada';
$$;

-- Calcular ganhos do mês do motorista
create or replace function public.am_motorista_ganhos_mes(p_motorista_id uuid)
returns numeric
language sql
stable
as $$
  select coalesce(sum(valor_motorista), 0)
  from public.am_rides
  where motorista_id = p_motorista_id
    and status = 'finalizada'
    and finalizado_em >= date_trunc('month', now());
$$;

-- ============================================================================
-- RLS PARA NOVAS TABELAS
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.am_vehicles enable row level security;
alter table public.am_documents enable row level security;
alter table public.am_rides enable row level security;
alter table public.am_ratings enable row level security;
alter table public.am_wallets enable row level security;
alter table public.am_transactions enable row level security;
alter table public.am_withdrawals enable row level security;
alter table public.am_locations enable row level security;
alter table public.am_promotions enable row level security;
alter table public.am_promotion_usage enable row level security;
alter table public.am_referrals enable row level security;
alter table public.am_notifications enable row level security;
alter table public.am_emergencies enable row level security;
alter table public.am_messages enable row level security;
alter table public.am_pricing_rules enable row level security;
alter table public.am_audit_logs enable row level security;
alter table public.am_settings enable row level security;
alter table public.am_ai_conversations enable row level security;
alter table public.am_ai_messages enable row level security;

-- ============================================================================
-- POLICIES SIMPLIFICADAS
-- ============================================================================

-- Profiles
create policy "profiles_select" on public.profiles for select to authenticated
using (id = auth.uid() or public.is_admin_master());

create policy "profiles_update" on public.profiles for update to authenticated
using (id = auth.uid() or public.is_admin_master());

-- Vehicles
create policy "vehicles_select" on public.am_vehicles for select to authenticated
using (public.is_admin_master() or motorista_id in (
  select id from public.am_motoristas where user_id = auth.uid() or lower(email) = public.current_user_email()
));

create policy "vehicles_insert" on public.am_vehicles for insert to authenticated
with check (public.is_admin_master() or motorista_id in (
  select id from public.am_motoristas where user_id = auth.uid() or lower(email) = public.current_user_email()
));

create policy "vehicles_update" on public.am_vehicles for update to authenticated
using (public.is_admin_master() or motorista_id in (
  select id from public.am_motoristas where user_id = auth.uid() or lower(email) = public.current_user_email()
));

-- Rides
create policy "rides_select" on public.am_rides for select to authenticated
using (
  public.is_admin_master()
  or public.user_is_same_client(client_id)
  or public.user_is_same_motorista(motorista_id)
);

create policy "rides_insert" on public.am_rides for insert to authenticated
with check (public.is_admin_master() or public.user_is_same_client(client_id));

create policy "rides_update" on public.am_rides for update to authenticated
using (
  public.is_admin_master()
  or public.user_is_same_client(client_id)
  or public.user_is_same_motorista(motorista_id)
);

-- Ratings
create policy "ratings_select" on public.am_ratings for select to authenticated
using (visivel = true or public.is_admin_master());

create policy "ratings_insert" on public.am_ratings for insert to authenticated
with check (true);

-- Wallets
create policy "wallets_select" on public.am_wallets for select to authenticated
using (
  user_id = auth.uid()
  or public.is_admin_master()
  or public.user_is_same_motorista(motorista_id)
  or public.user_is_same_client(client_id)
);

-- Transactions
create policy "transactions_select" on public.am_transactions for select to authenticated
using (
  public.is_admin_master()
  or wallet_id in (select id from public.am_wallets where user_id = auth.uid())
);

-- Notifications
create policy "notifications_select" on public.am_notifications for select to authenticated
using (
  user_id = auth.uid()
  or public.is_admin_master()
  or public.user_is_same_motorista(motorista_id)
  or public.user_is_same_client(client_id)
);

create policy "notifications_update" on public.am_notifications for update to authenticated
using (
  user_id = auth.uid()
  or public.user_is_same_motorista(motorista_id)
  or public.user_is_same_client(client_id)
);

-- Messages
create policy "messages_select" on public.am_messages for select to authenticated
using (
  public.is_admin_master()
  or sender_client_id in (select id from public.am_clients where user_id = auth.uid())
  or sender_motorista_id in (select id from public.am_motoristas where user_id = auth.uid())
);

create policy "messages_insert" on public.am_messages for insert to authenticated
with check (true);

-- Locations (motoristas podem inserir sua localização)
create policy "locations_select" on public.am_locations for select to authenticated
using (
  public.is_admin_master()
  or public.user_is_same_motorista(motorista_id)
  -- Clientes podem ver localização do motorista durante corrida ativa
  or ride_id in (select id from public.am_rides where public.user_is_same_client(client_id) and status in ('aceita', 'motorista_a_caminho', 'em_andamento'))
);

create policy "locations_insert" on public.am_locations for insert to authenticated
with check (public.user_is_same_motorista(motorista_id));

-- Promotions (todos podem ver promoções ativas)
create policy "promotions_select" on public.am_promotions for select to authenticated
using (ativo = true or public.is_admin_master());

-- Settings (admin only)
create policy "settings_select" on public.am_settings for select to authenticated
using (public.is_admin_master());

create policy "settings_all" on public.am_settings for all to authenticated
using (public.is_admin_master());

-- Audit Logs (admin only)
create policy "audit_logs_select" on public.am_audit_logs for select to authenticated
using (public.is_admin_master());

-- Emergencies
create policy "emergencies_select" on public.am_emergencies for select to authenticated
using (public.is_admin_master());

create policy "emergencies_insert" on public.am_emergencies for insert to authenticated
with check (true);

-- AI Conversations
create policy "ai_conversations_select" on public.am_ai_conversations for select to authenticated
using (
  user_id = auth.uid()
  or public.is_admin_master()
  or public.user_is_same_motorista(motorista_id)
  or public.user_is_same_client(client_id)
);

create policy "ai_conversations_insert" on public.am_ai_conversations for insert to authenticated
with check (user_id = auth.uid());

create policy "ai_messages_select" on public.am_ai_messages for select to authenticated
using (
  conversation_id in (
    select id from public.am_ai_conversations 
    where user_id = auth.uid() or public.is_admin_master()
  )
);

create policy "ai_messages_insert" on public.am_ai_messages for insert to authenticated
with check (
  conversation_id in (
    select id from public.am_ai_conversations 
    where user_id = auth.uid()
  )
);

-- Documents
create policy "documents_select" on public.am_documents for select to authenticated
using (
  user_id = auth.uid()
  or public.is_admin_master()
  or public.user_is_same_motorista(motorista_id)
  or public.user_is_same_client(client_id)
);

create policy "documents_insert" on public.am_documents for insert to authenticated
with check (user_id = auth.uid() or public.is_admin_master());

-- Withdrawals
create policy "withdrawals_select" on public.am_withdrawals for select to authenticated
using (
  public.is_admin_master()
  or wallet_id in (select id from public.am_wallets where user_id = auth.uid())
);

create policy "withdrawals_insert" on public.am_withdrawals for insert to authenticated
with check (wallet_id in (select id from public.am_wallets where user_id = auth.uid()));

-- Pricing Rules (admin)
create policy "pricing_rules_select" on public.am_pricing_rules for select to authenticated
using (true);

create policy "pricing_rules_admin" on public.am_pricing_rules for all to authenticated
using (public.is_admin_master());

-- Referrals
create policy "referrals_select" on public.am_referrals for select to authenticated
using (
  public.is_admin_master()
  or public.user_is_same_client(referrer_client_id)
  or public.user_is_same_motorista(referrer_motorista_id)
);

-- Promotion Usage
create policy "promotion_usage_select" on public.am_promotion_usage for select to authenticated
using (public.is_admin_master() or public.user_is_same_client(client_id));

commit;
