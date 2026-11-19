-- Acceso cerrado y jerárquico: sin registro público; superadmin > admin > miembro.
-- Ya aplicada en el proyecto Supabase "cuentas". El superadmin inicial se creó a mano.

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.bootstrap_first_member();

alter table public.members
  add column role text not null default 'member' check (role in ('superadmin','admin','member')),
  add column created_by text;

create or replace function private.my_role() returns text
language sql stable security definer set search_path = public as $$
  select m.role from public.members m where lower(m.email) = lower(auth.jwt() ->> 'email');
$$;
revoke execute on function private.my_role() from public, anon;
grant execute on function private.my_role() to authenticated;

drop policy "members_all" on public.members;
create policy "members_read" on public.members for select to authenticated using ((select private.is_member()));

-- Registro cerrado: auth.users solo acepta altas hechas desde create_panel_user
create or replace function private.block_open_signups() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if coalesce(current_setting('app.allow_user_create', true), '') <> 'on' then
    raise exception 'El registro está cerrado. Pide acceso a un administrador.';
  end if;
  return new;
end; $$;
revoke execute on function private.block_open_signups() from public, anon, authenticated;
create trigger block_open_signups before insert on auth.users
for each row execute function private.block_open_signups();

create or replace function private.rank(r text) returns int language sql immutable as $$
  select case r when 'superadmin' then 3 when 'admin' then 2 when 'member' then 1 else 0 end;
$$;

create or replace function public.create_panel_user(p_email text, p_password text, p_role text default 'member')
returns void language plpgsql security definer set search_path = public, extensions as $$
declare
  me text := private.my_role();
  v_email text := lower(trim(p_email));
  v_id uuid := gen_random_uuid();
begin
  if me is null then raise exception 'No tienes acceso.'; end if;
  if p_role not in ('admin','member') then raise exception 'Rol no válido.'; end if;
  if private.rank(me) <= private.rank(p_role) then raise exception 'No puedes crear usuarios con ese rol.'; end if;
  if length(coalesce(p_password,'')) < 8 then raise exception 'La contraseña debe tener al menos 8 caracteres.'; end if;
  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'Email no válido.'; end if;
  if exists (select 1 from auth.users where lower(email) = v_email) then raise exception 'Ya existe un usuario con ese email.'; end if;

  perform set_config('app.allow_user_create', 'on', true);
  insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
  values ('00000000-0000-0000-0000-000000000000', v_id, 'authenticated', 'authenticated', v_email,
    crypt(p_password, gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
  insert into auth.identities (id, user_id, provider_id, identity_data, provider, created_at, updated_at, last_sign_in_at)
  values (gen_random_uuid(), v_id, v_id::text, jsonb_build_object('sub', v_id::text, 'email', v_email, 'email_verified', true), 'email', now(), now(), now());
  perform set_config('app.allow_user_create', 'off', true);

  insert into public.members(email, role, created_by) values (v_email, p_role, lower(auth.jwt() ->> 'email'))
  on conflict (email) do update set role = excluded.role, created_by = excluded.created_by;
end; $$;

create or replace function public.remove_panel_user(p_email text)
returns void language plpgsql security definer set search_path = public as $$
declare me text := private.my_role(); target text;
begin
  select role into target from public.members where email = lower(p_email);
  if me is null or target is null then raise exception 'No encontrado.'; end if;
  if private.rank(me) <= private.rank(target) then raise exception 'No puedes quitar el acceso a este usuario.'; end if;
  delete from public.members where email = lower(p_email);
  delete from auth.users where lower(email) = lower(p_email);
end; $$;

create or replace function public.set_panel_role(p_email text, p_role text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if private.my_role() <> 'superadmin' then raise exception 'Solo el superadmin cambia roles.'; end if;
  if p_role not in ('admin','member') then raise exception 'Rol no válido.'; end if;
  update public.members set role = p_role where email = lower(p_email) and role <> 'superadmin';
end; $$;

create or replace function public.reset_panel_password(p_email text, p_password text)
returns void language plpgsql security definer set search_path = public, extensions as $$
declare me text := private.my_role(); target text;
begin
  select role into target from public.members where email = lower(p_email);
  if me is null or target is null then raise exception 'No encontrado.'; end if;
  if private.rank(me) <= private.rank(target) then raise exception 'No puedes cambiar la contraseña de este usuario.'; end if;
  if length(coalesce(p_password,'')) < 8 then raise exception 'La contraseña debe tener al menos 8 caracteres.'; end if;
  update auth.users set encrypted_password = crypt(p_password, gen_salt('bf')), updated_at = now() where lower(email) = lower(p_email);
end; $$;

revoke execute on function public.create_panel_user(text,text,text) from public, anon;
revoke execute on function public.remove_panel_user(text) from public, anon;
revoke execute on function public.set_panel_role(text,text) from public, anon;
revoke execute on function public.reset_panel_password(text,text) from public, anon;
grant execute on function public.create_panel_user(text,text,text) to authenticated;
grant execute on function public.remove_panel_user(text) to authenticated;
grant execute on function public.set_panel_role(text,text) to authenticated;
grant execute on function public.reset_panel_password(text,text) to authenticated;
