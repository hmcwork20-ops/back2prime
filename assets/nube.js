/* ============================================================
   BACK2PRIME · nube.js — la cuenta y la sincronización

   Diseño: el localStorage sigue siendo la copia de trabajo (la app va
   igual de rápida y funciona sin cobertura); la nube es la verdad entre
   dispositivos. Cada guardado local programa una subida agrupada, y al
   arrancar se comparan la copia local y la de la nube (decide, abajo):
   un estado sin plan nunca pisa a uno con plan, y entre dos planes manda
   el reloj pero los registros del otro se conservan. Hasta que esa
   comparación no se ha hecho, nada sube.

   Sin configuración (nube-config.js con nulls) todo esto se apaga y la
   app queda en modo local puro: ni un fetch.
   ============================================================ */
window.B2P_NUBE = (function () {
  const CFG = window.B2P_NUBE_CFG || {};
  const activo = !!(CFG.url && CFG.anon && window.supabase);
  const nada = () => null;

  /* ---------- qué copia manda ----------
     Antes decidía el reloj a secas: «la más nueva gana y la otra se pisa».
     Y un estado VACÍO recién guardado tiene el reloj más nuevo de todos. Al
     añadir la app a la pantalla de inicio de un iPhone, el almacenamiento es
     otro: la copia vacía entraba con la cuenta, la puerta la guardaba (reloj
     de ahora), ganaba por reloj y pisaba en la nube el plan y los registros
     de la víspera; el navegador de siempre bajaba después esa nube vacía y lo
     perdía todo también. Pasó de verdad el 7 de septiembre de 2026.

     Ahora, por este orden:
       1. un estado SIN plan nunca pisa a uno CON plan, diga lo que diga el reloj;
       2. con dos planes manda el reloj, pero los registros diarios, los logros
          y las marcas del que pierde se conservan (unión): un registro no
          sobra nunca, y perderlo es lo único irreversible de esta app;
       3. si de la unión sale algo distinto de lo que había en un lado, ese
          lado se actualiza (los dos, si hace falta).
     Es una función pura y va expuesta también sin nube: así la prueba de
     humo la ejercita sin Supabase. */
  const tienePlan = e => !!(e && e.perfil);
  /* Igualdad de contenido, no de texto: el orden de las claves cambia con
     cada unión (los días del que pierde se ponen delante) y JSON.stringify
     lo daría por distinto, con una subida y una recarga de regalo en cada
     arranque. El reloj (_mod) tampoco cuenta como contenido. */
  const canon = v => {
    if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']';
    if (v && typeof v === 'object') {
      return '{' + Object.keys(v).filter(k => v[k] !== undefined).sort()
        .map(k => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}';
    }
    return JSON.stringify(v === undefined ? null : v);
  };
  const sinReloj = e => { if (!e) return null; const c = Object.assign({}, e); delete c._mod; return c; };
  const mismo = (a, b) => canon(sinReloj(a)) === canon(sinReloj(b));

  function fusiona(gana, pierde) {
    if (!pierde) return gana;
    const out = Object.assign({}, gana);
    /* Solo se escribe una clave si el ganador ya la tenía o si la unión
       trae algo: inventarle un `logros: {}` a una copia de una versión
       vieja contaría como cambio, con subida y recarga en cada arranque. */
    const pon = (k, u) => { if (k in gana || Object.keys(u).length) out[k] = u; };
    pon('dias', Object.assign({}, pierde.dias || {}, gana.dias || {}));
    pon('logros', Object.assign({}, pierde.logros || {}, gana.logros || {}));
    const prs = Object.assign({}, pierde.prs || {});
    Object.keys(gana.prs || {}).forEach(k => {
      const g = gana.prs[k], p = prs[k];
      if (!p || !g || (g.kg || 0) >= (p.kg || 0)) prs[k] = g;
    });
    pon('prs', prs);
    if ((pierde.prCount || 0) > (out.prCount || 0)) out.prCount = pierde.prCount;
    return out;
  }

  function decide(local, nube) {
    if (!local && !nube) return { accion: 'nada' };
    const planL = tienePlan(local), planN = tienePlan(nube);
    let gana, pierde, motivo;
    if (!nube) { gana = local; pierde = null; motivo = planL ? 'nube vacía' : 'nada que subir'; }
    else if (!local) { gana = nube; pierde = null; motivo = 'sin copia local'; }
    else if (planN && !planL) { gana = nube; pierde = local; motivo = 'el vacío no pisa'; }
    else if (planL && !planN) { gana = local; pierde = nube; motivo = 'el vacío no pisa'; }
    else if ((nube._mod || 0) > (local._mod || 0)) { gana = nube; pierde = local; motivo = 'reloj'; }
    else { gana = local; pierde = nube; motivo = 'reloj'; }

    // sin plan en ningún sitio no hay nada que proteger ni que subir
    if (!tienePlan(gana)) return { accion: 'nada', motivo: 'sin plan' };

    const estado = fusiona(gana, pierde);
    const subeNube = !mismo(estado, nube);
    const guardaLocal = !mismo(estado, local);
    /* Lo que sube tiene que ganar también por reloj, que es lo único que
       mira el servidor: si la unión trae algo nuevo, o si la nube iba por
       delante en reloj (el vacío recién guardado de la avería), se sella
       con «ahora». Sin esto el servidor rechazaría la recuperación por
       «mod retrocede». */
    if (subeNube && nube && (!mismo(estado, gana) || (estado._mod || 0) <= (nube._mod || 0))) estado._mod = Date.now();
    return { accion: subeNube && guardaLocal ? 'fusiona' : subeNube ? 'sube' : guardaLocal ? 'baja' : 'nada',
      estado, subeNube, guardaLocal, motivo };
  }

  if (!activo) {
    return { activo: false, sesion: nada, programa: () => {}, arranca: async () => ({}), fuerza: async () => {}, decide };
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
  /* Cerrojo: en esta carga de página NADA sube hasta que arranca() haya
     hablado con el servidor y decidido qué copia manda. Sin él, el save()
     de la puerta de entrada (que guarda el uid sobre un estado aún vacío)
     dejaba una subida pendiente, y el «empujón» de pagehide la soltaba
     justo antes del reload: la nube recibía un estado sin plan. */
  let listo = false;

  async function sube() {
    if (!sesion || !listo || !pendiente || subiendo) return;
    const S = pendiente;
    /* Un estado sin plan no sube nunca: no hay nada que guardar y sí mucho
       que pisar. El servidor lo rechaza también (migración 0003), pero la
       primera línea de defensa es no intentarlo. */
    if (!tienePlan(S)) { pendiente = null; return; }
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
    if (!listo || timer) return;                     // antes de sincronizar solo se apunta
    const espera = Math.max(1500, CADA_MS - (Date.now() - ultimo));
    timer = setTimeout(() => { timer = null; sube(); }, espera);
  }

  // al esconderse la app (cambio de pestaña, bloqueo del móvil), empujón final
  document.addEventListener('visibilitychange', () => { if (document.hidden) sube(); });
  addEventListener('pagehide', () => { sube(); });
  /* Arrancó sin red: la comparación quedó sin hacer y el cerrojo cerrado.
     Al volver la conexión se compara entonces; si de ahí sale una copia
     nueva para este dispositivo, se recarga (raro: hace falta haber
     arrancado sin red Y que otro dispositivo haya subido algo). */
  addEventListener('online', () => {
    if (listo || !sesion) return;
    arranca().then(r => { if (r && r.reemplazado) location.reload(); }).catch(() => {});
  });

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

    const nube = data ? Object.assign({}, data.estado || {}, { _mod: data.mod || (data.estado || {})._mod || 0 }) : null;
    const r = decide(local, nube);
    listo = true;                                   // ya se sabe qué manda: desde aquí sí se sube
    pendiente = null;                               // lo apuntado antes de decidir es de antes de decidir
    if (!r.estado || (!r.subeNube && !r.guardaLocal)) return {};
    r.estado.config = r.estado.config || {}; r.estado.config.uid = sesion.user.id;
    localStorage.setItem(KEY, JSON.stringify(r.estado));   // con el reloj sellado, si lo hay
    if (r.subeNube) { pendiente = r.estado; sube(); }
    return r.guardaLocal ? { reemplazado: true } : {};     // el llamante recarga si cambió el contenido
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
    /* el correo de confirmacion vuelve a confirmado.html y no a la raiz:
       alli la persona aterrizaba en la puerta de entrada sin que nada le
       dijera que habia confirmado */
    const vuelta = new URL('confirmado.html', location.href).href;
    const { data, error } = await sb.auth.signUp({ email: correo, password: clave,
      options: { data: { nombre }, emailRedirectTo: vuelta } });
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
    /* a clave.html y no a la raiz: el enlace pedia cargar la app entera
       (datos, motor y vistas) para un solo campo, y ahi el token competia
       con el router de hash y con la puerta de entrada. new URL() resuelve
       relativo al documento y deja fuera el hash, que es lo que queremos. */
    const destino = new URL('clave.html', location.href).href;
    const { error } = await sb.auth.resetPasswordForEmail(correo, { redirectTo: destino });
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
    if (t.length < 4) return { err: 'corto' };
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
    arranca, programa, fuerza: sube, decide,
    registra, entra, olvide, nuevaClave, sale, borraCuenta, reporta,
    compartePlan, descomparte, planCompartido, estadisticas };
})();
