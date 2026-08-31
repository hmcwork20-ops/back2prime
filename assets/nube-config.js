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

   OJO con la url: es la Project URL a secas, SIN /rest/v1. El cliente
   añade él la ruta de cada servicio (rest, auth, realtime); con el
   sufijo puesto construiría direcciones dobles y nada respondería.
   ============================================================ */
window.B2P_NUBE_CFG = {
  url: 'https://uvxzbwmlyjrurlduzxwq.supabase.co',
  anon: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2eHpid21seWpydXJsZHV6eHdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNzg5NzMsImV4cCI6MjEwMzc1NDk3M30.oUhg-uQJELMnnFCaZtIWnyHPpjWfJPzgQ1Z7Lv_qdR8'   // guardia:permitir — anon key: pública por diseño, la seguridad la ponen las políticas RLS
};
