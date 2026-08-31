/* ============================================================
   BACK2PRIME · nube.js — la cuenta y la sincronización

   Diseño: el localStorage sigue siendo la copia de trabajo (la app va
   igual de rápida y funciona sin cobertura); la nube es la verdad entre
   dispositivos. Cada guardado local programa una subida agrupada, y al
   arrancar se compara el reloj de la copia local con el de la nube: la
   más nueva gana y la otra se pisa.

   Sin configuración (nube-config.js con nulls) todo esto se apaga y la
   app queda en modo local puro: ni un fetch.
   ============================================================ */
window.B2P_NUBE = (function () {
  const CFG = window.B2P_NUBE_CFG || {};
  const activo = !!(CFG.url && CFG.anon && window.supabase);
  const nada = () => null;
  if (!activo) {
    return { activo: false, sesion: nada, programa: () => {}, arranca: async () => ({}), fuerza: async () => {} };
  }

  const sb = window.supabase.createClient(CFG.url, CFG.anon, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  const KEY = 'b2p_v1';
  let sesion = null;
  let recuperando = false;         // llegó por enlace de «olvidé la contraseña»

  sb.auth.onAuthStateChange((ev, s) => {
    sesion = s;
    if (ev === 'PASSWORD_RECOVERY') { recuperando = true; document.dispatchEvent(new CustomEvent('b2p-recupera')); }
  });

  /* ---------- subida agrupada, con freno ----------
     La app guarda en cada toque; subir en cada toque sería un bombardeo
     (y el servidor además rechaza escrituras a <2s). Se agrupa a una
     subida cada 20 s como mucho, más un empujón al esconderse la app,
     que es cuando de verdad importa no perder nada. */
  const CADA_MS = 20000;
  let timer = null, pendiente = null, subiendo = false, ultimo = 0;

  async function sube() {
    if (!sesion || !pendiente || subiendo) return;
    const S = pendiente;
    subiendo = true;
    try {
      const { error } = await sb.from('estados')
        .upsert({ user_id: sesion.user.id, estado: S, mod: S._mod || Date.now() });
      if (!error) { pendiente = null; ultimo = Date.now(); }
      // con error (sin red, freno del servidor…) se queda pendiente: el
      // siguiente programa() o el cierre volverán a intentarlo
    } catch (e) { /* sin red: reintento en el siguiente ciclo */ }
    subiendo = false;
  }

  function programa(S) {
    if (!sesion) return;
    pendiente = S;
    if (timer) return;
    const espera = Math.max(1500, CADA_MS - (Date.now() - ultimo));
    timer = setTimeout(() => { timer = null; sube(); }, espera);
  }

  // al esconderse la app (cambio de pestaña, bloqueo del móvil), empujón final
  document.addEventListener('visibilitychange', () => { if (document.hidden) sube(); });
  addEventListener('pagehide', () => { sube(); });

  /* ---------- arranque: decidir qué copia manda ---------- */
  async function arranca() {
    const { data: { session } } = await sb.auth.getSession();
    sesion = session;
    if (!sesion) return { entra: true };            // sin sesión: a la puerta

    let local = null;
    try { local = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}

    /* otra persona en este dispositivo: su copia local no es la tuya.
       Se aparta y se arranca de la nube (o de cero). */
    if (local && local.config && local.config.uid && local.config.uid !== sesion.user.id) {
      localStorage.removeItem(KEY);
      local = null;
    }

    const { data, error } = await sb.from('estados')
      .select('estado, mod').eq('user_id', sesion.user.id).maybeSingle();
    if (error) return { sinRed: true };             // sin red: se sigue en local

    const modLocal = (local && local._mod) || 0;
    const modNube = (data && data.mod) || 0;
    if (data && modNube > modLocal) {
      const e = data.estado || {};
      e.config = e.config || {}; e.config.uid = sesion.user.id;
      localStorage.setItem(KEY, JSON.stringify(e));
      return { reemplazado: true };                  // el llamante recarga
    }
    if (local && modLocal > modNube) { pendiente = local; sube(); }
    return {};
  }

  /* ---------- cuentas ---------- */
  const mapaError = e => {
    const m = (e && e.message || '').toLowerCase();
    if (m.includes('invalid login')) return 'errCred';
    if (m.includes('not confirmed')) return 'confirmaCorreo';
    if (m.includes('at least') || m.includes('password')) return 'errClaveCorta';
    if (m.includes('already registered')) return 'yaExiste';
    if (m.includes('rate') || m.includes('seconds')) return 'errRitmo';
    return 'errRed';
  };

  /* La sesion se fija AQUI, no se espera a onAuthStateChange: ese evento
     llega despues y quien acaba de entrar leeria sesion() en null, con lo
     que la marca de dueno del dispositivo se guardaria como undefined. */
  async function registra(correo, clave, nombre) {
    const { data, error } = await sb.auth.signUp({ email: correo, password: clave, options: { data: { nombre } } });
    if (error) return { err: mapaError(error) };
    if (data && data.session) sesion = data.session;
    return sesion ? {} : { confirma: true };        // sin sesión: falta confirmar correo
  }
  async function entra(correo, clave) {
    const { data, error } = await sb.auth.signInWithPassword({ email: correo, password: clave });
    if (error) return { err: mapaError(error) };
    if (data && data.session) sesion = data.session;
    return {};
  }
  async function olvide(correo) {
    const { error } = await sb.auth.resetPasswordForEmail(correo, { redirectTo: location.origin + location.pathname });
    return error ? { err: mapaError(error) } : {};
  }
  async function nuevaClave(clave) {
    const { error } = await sb.auth.updateUser({ password: clave });
    if (!error) recuperando = false;
    return error ? { err: mapaError(error) } : {};
  }
  async function sale() { await sube(); try { await sb.auth.signOut(); } catch (e) {} }
  async function borraCuenta() {
    const { error } = await sb.rpc('borra_cuenta');
    if (error) return { err: mapaError(error) };
    try { await sb.auth.signOut(); } catch (e) {}
    return {};
  }

  /* ---------- reportar un fallo o una idea ----------
     El contexto lo arma la app, no la persona: sin version ni plataforma,
     «no me funciona» no se puede arreglar. Va acotado y sin un solo dato
     del entrenamiento. */
  async function reporta(tipo, texto, ctx) {
    if (!sesion) return { err: 'errRed' };
    const t = String(texto || '').trim().slice(0, 2000);
    if (t.length < 4) return { err: 'repCorto' };
    const { error } = await sb.from('reportes')
      .insert({ user_id: sesion.user.id, tipo, texto: t, ctx: ctx || null });
    if (!error) return {};
    const m = (error.message || '').toLowerCase();
    if (m.includes('demasiados')) return { err: 'repRitmo' };
    return { err: mapaError(error) };
  }

  /* ---------- compartir el plan ---------- */
  async function compartePlan(plan) {
    const { data, error } = await sb.rpc('comparte_plan', { p: plan });
    return error ? { err: mapaError(error) } : { token: data };
  }
  async function descomparte() {
    const { error } = await sb.rpc('descomparte_plan');
    return error ? { err: mapaError(error) } : {};
  }
  async function planCompartido(token) {
    const t = String(token || '').replace(/[^a-f0-9]/gi, '').slice(0, 64);
    if (!t) return { err: 'noExiste' };
    const { data, error } = await sb.rpc('plan_compartido', { t });
    if (error) return { err: mapaError(error) };
    return data ? { plan: data } : { err: 'noExiste' };
  }
  const estadisticas = async () => {
    const { data, error } = await sb.rpc('estadisticas');
    return error ? null : data;
  };

  return { activo: true, sesion: () => sesion, enRecuperacion: () => recuperando,
    arranca, programa, fuerza: sube,
    registra, entra, olvide, nuevaClave, sale, borraCuenta, reporta,
    compartePlan, descomparte, planCompartido, estadisticas };
})();
