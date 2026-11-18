-- Cuentas: contabilidad de proyectos, reparto de beneficios y fondos.
-- Ejecutar en el SQL editor de Supabase (o con `supabase db push`).

-- Acceso: solo los emails de `members` pueden ver y editar.
create table public.members (
  email text primary key,
  created_at timestamptz not null default now()
);

create schema if not exists private;
grant usage on schema private to authenticated;

create or replace function private.is_member() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.members m where lower(m.email) = lower(auth.jwt() ->> 'email'));
$$;
revoke execute on function private.is_member() from public, anon;
grant execute on function private.is_member() to authenticated;

-- El primer usuario que se registra queda como miembro automáticamente.
create or replace function public.bootstrap_first_member() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.members) then
    insert into public.members(email) values (lower(new.email));
  end if;
  return new;
end; $$;
revoke execute on function public.bootstrap_first_member() from anon, authenticated, public;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.bootstrap_first_member();

create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text not null default '#2F5D8A',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.funds (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  color text not null default '#8A6A2F',
  covers_deficits boolean not null default false,
  priority int not null default 1,
  created_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  client text,
  color text not null default '#2F7D5B',
  status text not null default 'active' check (status in ('active','paused','archived')),
  expense_policy text not null default 'recurring_first' check (expense_policy in ('recurring_first','one_off_first','proportional')),
  notes text,
  created_at timestamptz not null default now()
);

-- Recursos / infraestructura (gastos recurrentes del proyecto)
create table public.resources (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  provider text,
  category text not null default 'otro' check (category in ('hosting','dominio','base_datos','api','software','marketing','otro')),
  cost numeric(12,2) not null default 0 check (cost >= 0),
  billing text not null default 'monthly' check (billing in ('monthly','yearly','free')),
  start_date date not null default current_date,
  end_date date,
  url text,
  notes text,
  created_at timestamptz not null default now()
);

-- Cuotas mensuales (ingresos recurrentes)
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  client text not null,
  description text,
  amount numeric(12,2) not null check (amount >= 0),
  start_date date not null default current_date,
  end_date date,
  created_at timestamptz not null default now()
);

-- Movimientos puntuales: ingresos de pago único (landing, setup) y gastos sueltos
create table public.movements (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  kind text not null check (kind in ('income','expense')),
  amount numeric(12,2) not null check (amount >= 0),
  date date not null default current_date,
  description text not null,
  created_at timestamptz not null default now()
);

-- Reglas de reparto: por proyecto y por tipo de ingreso
create table public.distribution_rules (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  stream text not null check (stream in ('one_off','recurring')),
  partner_id uuid references public.partners(id) on delete cascade,
  fund_id uuid references public.funds(id) on delete cascade,
  percent numeric(6,2) not null check (percent > 0 and percent <= 100),
  created_at timestamptz not null default now(),
  check ((partner_id is null) <> (fund_id is null))
);

-- Movimientos manuales de fondos: aportes, pagos o retiradas a un socio
create table public.fund_movements (
  id uuid primary key default gen_random_uuid(),
  fund_id uuid not null references public.funds(id) on delete cascade,
  amount numeric(12,2) not null, -- positivo = entra, negativo = sale
  date date not null default current_date,
  partner_id uuid references public.partners(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

create index on public.resources(project_id);
create index on public.subscriptions(project_id);
create index on public.movements(project_id, date);
create index on public.distribution_rules(project_id);
create index on public.distribution_rules(partner_id);
create index on public.distribution_rules(fund_id);
create index on public.fund_movements(fund_id, date);
create index on public.fund_movements(partner_id);

do $$
declare t text;
begin
  foreach t in array array['members','partners','funds','projects','resources','subscriptions','movements','distribution_rules','fund_movements'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "members_all" on public.%I for all to authenticated using ((select private.is_member())) with check ((select private.is_member()))', t);
  end loop;
end $$;
