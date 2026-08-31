-- ============================================================
-- BACK2PRIME · migración 0001 — estado en la nube con RLS
--
-- Se pega entera en el editor SQL del panel de Supabase y se ejecuta
-- una vez. Es idempotente: volver a ejecutarla no rompe nada.
--
-- El modelo de visibilidad decidido:
--   · cada usuario ve y toca SOLO lo suyo (RLS por user_id en todo)
--   · estadísticas agregadas y anónimas, servidas por una función que
--     devuelve números totales, jamás filas
--   · compartir el plan por enlace: token aleatorio, solo lectura, sin
--     registros; la tabla no tiene política de SELECT, así que la única
--     puerta de lectura es la función del token
-- ============================================================

-- ---------- 1. el estado de cada usuario: una fila, un dueño ----------
create table if not exists public.estados (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  estado      jsonb not null,
  -- reloj del cliente (ms) para decidir quién gana entre dispositivos
  mod         bigint not null default 0,
  actualizado timestamptz not null default now(),
  -- un estado real pesa decenas de KB; 1 MB ya no es un estado
  constraint estado_tamano check (pg_column_size(estado) < 1048576)
);

alter table public.estados enable row level security;

drop policy if exists estados_leer    on public.estados;
drop policy if exists estados_crear   on public.estados;
drop policy if exists estados_cambiar on public.estados;
drop policy if exists estados_borrar  on public.estados;

-- La política entera del producto en cuatro líneas: tu fila y ninguna más.
-- Da igual qué URL toque el cliente o qué pida a la API a mano: PostgREST
-- aplica esto ANTES de devolver o escribir nada.
create policy estados_leer    on public.estados for select using (auth.uid() = user_id);
create policy estados_crear   on public.estados for insert with check (auth.uid() = user_id);
create policy estados_cambiar on public.estados for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy estados_borrar  on public.estados for delete using (auth.uid() = user_id);

-- Freno de bucles (regla 6): el reloj solo avanza, y dos escrituras no
-- pueden llegar a menos de 2 segundos. Un cliente con un bug en bucle se
-- estrella aquí en vez de machacar la base de datos.
create or replace function public.frena_estados() returns trigger
language plpgsql as $$
begin
  if new.mod < old.mod then
    raise exception 'mod retrocede: escritura descartada';
  end if;
  if now() - old.actualizado < interval '2 seconds' then
    raise exception 'demasiadas escrituras seguidas';
  end if;
  new.actualizado := now();
  return new;
end $$;

drop trigger if exists frena_estados on public.estados;
create trigger frena_estados before update on public.estados
  for each row execute function public.frena_estados();

-- ---------- 2. planes compartidos por enlace ----------
create table if not exists public.planes_compartidos (
  token   text primary key default encode(gen_random_bytes(12), 'hex'),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  plan    jsonb not null,
  creado  timestamptz not null default now(),
  constraint plan_tamano check (pg_column_size(plan) < 65536)
);

alter table public.planes_compartidos enable row level security;

drop policy if exists comp_crear  on public.planes_compartidos;
drop policy if exists comp_borrar on public.planes_compartidos;
-- SIN política de select a propósito: ni el dueño lee por la tabla.
-- Leer es solo posible con el token, por la función de abajo.
create policy comp_crear  on public.planes_compartidos for insert with check (auth.uid() = user_id);
create policy comp_borrar on public.planes_compartidos for delete using (auth.uid() = user_id);

-- Crear (o renovar) el enlace propio. Devuelve el token.
create or replace function public.comparte_plan(p jsonb) returns text
language plpgsql security definer set search_path = public as $$
declare t text;
begin
  if auth.uid() is null then raise exception 'sin sesión'; end if;
  if pg_column_size(p) >= 65536 then raise exception 'plan demasiado grande'; end if;
  delete from planes_compartidos where user_id = auth.uid();
  insert into planes_compartidos (user_id, plan) values (auth.uid(), p) returning token into t;
  return t;
end $$;

create or replace function public.descomparte_plan() returns void
language sql security definer set search_path = public as $$
  delete from planes_compartidos where user_id = auth.uid();
$$;

-- La única lectura: con el token exacto. Sin token no hay listado posible.
create or replace function public.plan_compartido(t text) returns jsonb
language sql security definer set search_path = public stable as $$
  select plan from planes_compartidos where token = t;
$$;

-- ---------- 3. estadísticas agregadas y anónimas ----------
-- Devuelve NÚMEROS, nunca filas: cuántas cuentas y cuántas activas.
create or replace function public.estadisticas() returns jsonb
language sql security definer set search_path = public stable as $$
  select jsonb_build_object(
    'usuarios',   count(*),
    'activos7d',  count(*) filter (where actualizado > now() - interval '7 days')
  ) from estados;
$$;

-- ---------- 4. borrar la cuenta entera, a petición del dueño ----------
-- Borra el usuario de auth; las tablas caen en cascada. Es lo que exige
-- la ficha de Play (petición de borrado) y lo honesto con el usuario.
create or replace function public.borra_cuenta() returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'sin sesión'; end if;
  delete from auth.users where id = auth.uid();
end $$;

-- ---------- 5. quién puede llamar a qué ----------
revoke execute on all functions in schema public from public, anon, authenticated;
grant execute on function public.comparte_plan(jsonb)  to authenticated;
grant execute on function public.descomparte_plan()    to authenticated;
grant execute on function public.borra_cuenta()        to authenticated;
grant execute on function public.estadisticas()        to authenticated;
-- el visor del enlace funciona sin cuenta: es la única puerta anónima
grant execute on function public.plan_compartido(text) to anon, authenticated;
