/* ============================================================
   BACK2PRIME · nube-config.js — las señas del proyecto de Supabase

   Mientras url y anon sean null, la app funciona en modo local (como
   siempre) y no intenta hablar con ningún servidor. Al rellenar los dos
   valores, la cuenta pasa a ser obligatoria y el estado vive en la nube.

   La anon key es PÚBLICA POR DISEÑO: viaja en cada cliente de Supabase
   del mundo y no da acceso a nada por sí sola — cada fila la protege su
   política RLS en el servidor (ver supabase/migracion-0001.sql). La que
   JAMÁS puede aparecer aquí ni en ningún fichero del repo es la clave de
   servicio del panel: esa vive solo en el servidor, y el guardián de
   secretos la caza por nombre si alguien la pega.
   ============================================================ */
window.B2P_NUBE_CFG = {
  url: null,    // p. ej. 'https://abcdefghijkl.supabase.co'
  anon: null    // la anon key del panel (Settings → API) — pública por diseño; al pegarla, añade al final de su línea:  guardia:permitir
};
