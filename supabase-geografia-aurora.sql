alter table public.am_services
add column if not exists origin_city text,
add column if not exists origin_state text,
add column if not exists origin_country text default 'Brasil',
add column if not exists destination_city text,
add column if not exists destination_state text,
add column if not exists destination_country text default 'Brasil';

create index if not exists idx_am_services_origin_city
on public.am_services(origin_city);

create index if not exists idx_am_services_origin_state
on public.am_services(origin_state);

create index if not exists idx_am_services_destination_city
on public.am_services(destination_city);

create index if not exists idx_am_services_destination_state
on public.am_services(destination_state);