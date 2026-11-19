-- Email del socio (para invitarle al panel) y qué socios participan en cada proyecto.
alter table public.partners add column email text;

create table public.project_partners (
  project_id uuid not null references public.projects(id) on delete cascade,
  partner_id uuid not null references public.partners(id) on delete cascade,
  primary key (project_id, partner_id)
);
create index on public.project_partners(partner_id);
alter table public.project_partners enable row level security;
create policy "members_all" on public.project_partners for all to authenticated using ((select private.is_member())) with check ((select private.is_member()));

insert into public.project_partners (project_id, partner_id)
select distinct project_id, partner_id from public.distribution_rules where partner_id is not null
on conflict do nothing;
