create table if not exists public.am_financial (
  id uuid primary key default gen_random_uuid(),

  service_id uuid,
  service_code text,
  service_type text,

  client_name text,
  driver_name text,

  client_amount numeric default 0,
  driver_amount numeric default 0,
  expenses numeric default 0,
  commission numeric default 0,
  platform_amount numeric default 0,

  status text default 'pendente',
  payment_method text,
  payment_reference text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_am_financial_service_id
on public.am_financial(service_id);

create index if not exists idx_am_financial_service_code
on public.am_financial(service_code);

create index if not exists idx_am_financial_status
on public.am_financial(status);

create index if not exists idx_am_financial_service_type
on public.am_financial(service_type);