-- ============================================================
-- BACK2PRIME · migración 0003 — el vacío no pisa, y hay historial
--
-- Se pega entera en el editor SQL del panel y se ejecuta una vez, igual
-- que la 0001 y la 0002. Es idempotente.
--
-- Por qué existe: el 7 de septiembre de 2026 varios usuarios perdieron el
-- plan y los registros de su primer día. Habían añadido la app a la
-- pantalla de inicio del iPhone, que arranca con un almacenamiento propio
-- y vacío. Entraban con la cuenta, la puerta guardaba ese vacío con reloj
-- de «ahora», el cliente lo subía y el servidor lo aceptaba: el reloj
-- avanzaba, que era lo único que se miraba. El navegador de siempre bajaba
-- después esa nube vacía. Todo perdido en los dos sitios.
--
-- El cliente ya no lo hace (nube.js desde la v111), pero los clientes con
-- la versión anterior en caché siguen por ahí unos días, y el servidor es
-- el único sitio que los vigila a todos. Dos cosas:
--
--   1. el freno de `estados` rechaza además cualquier escritura que QUITE
--      el plan: si la fila tiene perfil y la nueva no, no pasa. Ningún
--      flujo legítimo hace eso: rehacer el cuestionario conserva los
--      registros, y «eliminar perfil y todos los datos» borra la cuenta
--      entera (la fila cae en cascada, no se actualiza).
--   2. historial de versiones: antes de actualizar la fila se guarda la
--      versión anterior. Con freno (una cada 24 h por persona, y siempre
--      que la nueva pierda algún día registrado) y con retención (30 días
--      y 12 versiones por persona). Nadie lo lee por la API: solo desde el
--      panel, para restaurar. La receta está al final.
-- ============================================================

-- ---------- 1. el freno: el reloj no retrocede, y el vacío no pisa ----------
create or replace function public.frena_estados() returns trigger
language plpgsql as $$
begin
  if new.mod < old.mod then
    raise exception 'mod retrocede: escritura descartada';
  end if;
  if now() - old.actualizado < interval '2 seconds' then
    raise exception 'demasiadas escrituras seguidas';
  end if;
  -- un estado con plan no se sustituye por uno sin plan, diga lo que diga el reloj
  if jsonb_typeof(old.estado -> 'perfil') = 'object'
     and jsonb_typeof(new.estado -> 'perfil') is distinct from 'object' then
    raise exception 'el estado nuevo no trae plan: escritura descartada';
  end if;
  new.actualizado := now();
  return new;
end $$;

drop trigger if exists frena_estados on public.estados;
create trigger frena_estados before update on public.estados
  for each row execute function public.frena_estados();

-- ---------- 2. historial de versiones ----------
create table if not exists public.estados_historial (
  id       bigint generated always as identity primary key,
  user_id  uuid not null references auth.users (id) on delete cascade,
  estado   jsonb not null,
  mod      bigint not null,
  guardado timestamptz not null default now(),
  -- por qué se guardó: 'periodico' (24 h) o 'pierde-dias' (la nueva trae menos días)
  motivo   text not null,
  -- resumen para leerlo de un vistazo en el panel sin abrir el json
  con_plan boolean not null,
  n_dias   int not null
);

create index if not exists estados_historial_persona
  on public.estados_historial (user_id, guardado desc);

alter table public.estados_historial enable row level security;
-- SIN políticas a propósito: ni el dueño lee su historial por la API. Se
-- escribe desde el trigger (que corre como dueño de la tabla) y se lee
-- desde el panel. Un historial legible por la app sería otra puerta al
-- estado, y no hace falta ninguna.
revoke all on public.estados_historial from anon, authenticated;

create or replace function public.guarda_historial() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  dias_viejo jsonb := case when jsonb_typeof(old.estado -> 'dias') = 'object' then old.estado -> 'dias' else '{}'::jsonb end;
  dias_nuevo jsonb := case when jsonb_typeof(new.estado -> 'dias') = 'object' then new.estado -> 'dias' else '{}'::jsonb end;
  pierde     boolean;
  ultimo     timestamptz;
begin
  -- ¿la versión nueva pierde algún día que la vieja tenía? Ningún flujo de
  -- la app quita días: si pasa, es justo lo que hay que poder deshacer.
  pierde := exists (select 1 from jsonb_object_keys(dias_viejo) k where not (dias_nuevo ? k));
  select max(guardado) into ultimo from estados_historial where user_id = old.user_id;
  if pierde or ultimo is null or ultimo < now() - interval '24 hours' then
    insert into estados_historial (user_id, estado, mod, motivo, con_plan, n_dias)
      values (old.user_id, old.estado, old.mod,
              case when pierde then 'pierde-dias' else 'periodico' end,
              jsonb_typeof(old.estado -> 'perfil') = 'object',
              (select count(*) from jsonb_object_keys(dias_viejo)));
    -- retención: 30 días y 12 versiones por persona
    delete from estados_historial
     where user_id = old.user_id
       and (guardado < now() - interval '30 days'
            or id not in (select id from estados_historial
                           where user_id = old.user_id order by guardado desc limit 12));
  end if;
  return new;
end $$;

-- Va DESPUÉS del freno (los triggers before del mismo evento corren por
-- orden alfabético: frena_estados < guarda_historial): una escritura
-- rechazada no deja versión, y no hace falta, porque la vieja sigue ahí.
drop trigger if exists guarda_historial on public.estados;
create trigger guarda_historial before update on public.estados
  for each row execute function public.guarda_historial();

revoke execute on function public.guarda_historial() from public, anon, authenticated;

-- ---------- 3. la receta para restaurar (no se ejecuta sola) ----------
-- Solo desde el panel (SQL Editor), a mano, cuando alguien escribe diciendo
-- que ha perdido el plan.
--
-- a) ver qué versiones hay de esa persona, por correo:
--
--   select h.id, h.guardado, h.motivo, h.con_plan, h.n_dias
--     from public.estados_historial h
--     join auth.users u on u.id = h.user_id
--    where u.email = 'correo@ejemplo.com'
--    order by h.guardado desc;
--
-- b) restaurar la que toque (el id de la lista). El reloj se pone a «ahora»
--    para que todos sus dispositivos la acepten como la más nueva: con la
--    regla del cliente (v111+), un dispositivo que tenga registros que esta
--    versión no tenga los unirá en vez de perderlos.
--
--   update public.estados e
--      set estado = h.estado || jsonb_build_object('_mod', (extract(epoch from now()) * 1000)::bigint),
--          mod    = (extract(epoch from now()) * 1000)::bigint
--     from public.estados_historial h
--    where h.id = 123 and e.user_id = h.user_id;
--
-- c) si la persona ya no tiene fila en `estados` (borró la cuenta y la creó
--    de nuevo), el historial también cayó en cascada: ahí solo queda la
--    copia de seguridad del proyecto (Panel → Database → Backups, de pago).
