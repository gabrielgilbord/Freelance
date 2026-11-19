-- Facturación: datos de cobro en las cuotas, facturas con estado y aviso diario.
-- Ya aplicada en el proyecto Supabase "cuentas". El valor real del secreto 'cron'
-- está en Supabase y en la variable CRON_SECRET de Vercel (no se guarda aquí).

alter table public.subscriptions
  add column billing_interval text not null default 'monthly' check (billing_interval in ('monthly','quarterly','yearly')),
  add column billing_day int not null default 1 check (billing_day between 1 and 28),
  add column billing_emails text;

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  period_date date,
  number text not null,
  client text not null,
  billing_emails text,
  concept text not null,
  amount numeric(12,2) not null check (amount >= 0),
  issue_date date not null default current_date,
  due_date date,
  status text not null default 'pending' check (status in ('pending','processing','paid','cancelled')),
  paid_date date,
  notes text,
  created_at timestamptz not null default now(),
  unique (subscription_id, period_date)
);
create index on public.invoices(project_id);
create index on public.invoices(status);

alter table public.movements add column invoice_id uuid references public.invoices(id) on delete cascade;
create index on public.movements(invoice_id);

alter table public.invoices enable row level security;
create policy "members_all" on public.invoices for all to authenticated using ((select private.is_member())) with check ((select private.is_member()));

create table private.app_secrets (name text primary key, value text not null);
-- insert into private.app_secrets values ('cron', '<mismo valor que CRON_SECRET>');

create or replace function public.billing_reminder_data(p_secret text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if p_secret is null or p_secret <> (select value from private.app_secrets where name = 'cron') then
    raise exception 'No autorizado';
  end if;
  return jsonb_build_object(
    'projects', (select coalesce(jsonb_agg(jsonb_build_object('id', id, 'name', name, 'status', status)), '[]') from projects),
    'subscriptions', (select coalesce(jsonb_agg(to_jsonb(s)), '[]') from subscriptions s),
    'invoices', (select coalesce(jsonb_agg(jsonb_build_object('id', id, 'project_id', project_id, 'subscription_id', subscription_id, 'period_date', period_date, 'number', number, 'client', client, 'amount', amount, 'due_date', due_date, 'status', status)), '[]') from invoices),
    'recipients', (select coalesce(jsonb_agg(email), '[]') from members where role in ('superadmin','admin'))
  );
end; $$;
revoke execute on function public.billing_reminder_data(text) from public;
grant execute on function public.billing_reminder_data(text) to anon, authenticated;
