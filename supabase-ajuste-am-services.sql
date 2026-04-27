alter table public.am_services
add column if not exists service_code text,
add column if not exists title text,
add column if not exists service_type text,
add column if not exists client_name text,
add column if not exists client_phone text,
add column if not exists company_name text,
add column if not exists driver_id uuid,
add column if not exists driver_name text,
add column if not exists driver_phone text,
add column if not exists origin text,
add column if not exists destination text,
add column if not exists service_date date,
add column if not exists service_time text,
add column if not exists passenger_name text,
add column if not exists passenger_phone text,
add column if not exists client_amount numeric default 0,
add column if not exists driver_amount numeric default 0,
add column if not exists expenses numeric default 0,
add column if not exists commission numeric default 0,
add column if not exists operational_profit numeric default 0,
add column if not exists notes text,
add column if not exists status text default 'agendado',
add column if not exists driver_status text default 'pendente',
add column if not exists client_token text,
add column if not exists driver_token text,
add column if not exists client_link text,
add column if not exists driver_link text,
add column if not exists client_confirmed_at timestamptz,
add column if not exists updated_at timestamptz default now();

create index if not exists idx_am_services_client_token
on public.am_services(client_token);

create index if not exists idx_am_services_driver_token
on public.am_services(driver_token);

create index if not exists idx_am_services_driver_id
on public.am_services(driver_id);