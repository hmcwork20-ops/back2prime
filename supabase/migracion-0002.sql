-- ============================================================
-- BACK2PRIME · migración 0002 — reportes de fallos y sugerencias
--
-- Se pega en el editor SQL del panel y se ejecuta una vez, igual que la
-- 0001. Es idempotente.
--
-- El modelo: los usuarios ESCRIBEN, nadie LEE desde la app.
--   · authenticated puede insertar su propio reporte y nada más
--   · no hay política de SELECT: ni el autor puede releerlos. Se leen
--     desde el panel de Supabase (Table editor), que es donde vas a
--     mirarlos tú
--   · freno de spam: un reporte por minuto y por persona
-- ============================================================

create table if not exists public.reportes (
  id      bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  -- 'bug' | 'idea' | 'otro'; se valida aquí y no solo en el cliente
  tipo    text not null check (tipo in ('bug', 'idea', 'otro')),
  -- lo que escribe la persona, acotado: un reporte no es un ensayo
  texto   text not null check (char_length(texto) between 4 and 2000),
  /* Contexto técnico que adjunta la app sola (versión, plataforma, idioma,
     pantalla, tamaño). Sin esto, «no me funciona» es inservible. Nunca
     lleva el peso, el plan ni nada del entrenamiento: solo el entorno. */
  ctx     jsonb,
  creado  timestamptz not null default now(),
  -- estado para tu triaje desde el panel: nuevo → visto → resuelto
  estado  text not null default 'nuevo' check (estado in ('nuevo', 'visto', 'resuelto')),
  constraint ctx_tamano check (ctx is null or pg_column_size(ctx) < 4096)
);

create index if not exists reportes_creado on public.reportes (creado desc);

alter table public.reportes enable row level security;

drop policy if exists reportes_crear on public.reportes;
-- La única puerta: insertar lo tuyo. Sin SELECT, sin UPDATE, sin DELETE.
create policy reportes_crear on public.reportes
  for insert with check (auth.uid() = user_id);

-- Freno de spam: uno por minuto y por persona. Sin esto, un botón flotante
-- es una invitación a llenar la tabla desde la consola del navegador.
create or replace function public.frena_reportes() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from reportes
             where user_id = new.user_id and creado > now() - interval '1 minute') then
    raise exception 'demasiados reportes seguidos';
  end if;
  return new;
end $$;

drop trigger if exists frena_reportes on public.reportes;
create trigger frena_reportes before insert on public.reportes
  for each row execute function public.frena_reportes();

-- Permisos de tabla: el proyecto no expone tablas nuevas por su cuenta.
revoke all on public.reportes from anon, authenticated;
grant insert on public.reportes to authenticated;
