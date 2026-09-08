/* Lote nube: qué copia manda al arrancar, y que un estado vacío no pise
   nunca a un plan.

   El 7 de septiembre de 2026 varios usuarios perdieron el plan y los
   registros del primer día. Habían añadido la app a la pantalla de inicio
   del iPhone: eso arranca con un almacenamiento propio, vacío. Entraban con
   la cuenta, la puerta guardaba ese vacío (con reloj de «ahora») y la regla
   de entonces —«la más nueva gana y la otra se pisa»— lo subía a la nube. El
   navegador de siempre bajaba después esa nube vacía. Todo perdido en los
   dos sitios, sin que nadie hubiera pulsado «borrar».

   Se prueba nube.js entero dentro de un vm con un Supabase de mentira que
   apunta lo que sube. Sin red y sin navegador. */
const fs = require('fs'), vm = require('vm');
const A = (c, m) => { if (!c) { console.error('FALLO: ' + m); process.exitCode = 1; } };
/* B2P_NUBE_SRC=otro/nube.js prueba otra versión del fichero: sirve para
   comprobar que la suite CAZA el fallo (con la versión anterior a la regla,
   el escenario 1 sube el vacío y la suite falla). */
const SRC = process.env.B2P_NUBE_SRC || 'assets/nube.js';
const KEY = 'b2p_v1';

/* nube.js dentro de un vm: window, localStorage, document y un Supabase de
   mentira. Los temporizadores se apuntan en vez de correr, y se disparan a
   mano. Todo lo que el cliente sube queda en `subidas`. */
function monta({ local, nube, uid = 'u1' }) {
  const subidas = [], timers = [], oidos = {}, store = {};
  if (local) store[KEY] = JSON.stringify(local);
  const fila = nube ? { estado: JSON.parse(JSON.stringify(nube)), mod: nube._mod || 0 } : null;
  const sb = {
    auth: { onAuthStateChange: () => {}, getSession: async () => ({ data: { session: uid ? { user: { id: uid } } : null } }) },
    from: () => ({
      select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: fila, error: null }) }) }),
      upsert: async f => { subidas.push(JSON.parse(JSON.stringify(f))); return { error: null }; },
    }),
  };
  const oye = (ev, fn) => { (oidos[ev] = oidos[ev] || []).push(fn); };
  const ctx = {
    window: { B2P_NUBE_CFG: { url: 'https://x.supabase.co', anon: 'k' }, supabase: { createClient: () => sb } },
    localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
    document: { addEventListener: oye, dispatchEvent: () => {}, hidden: true },
    addEventListener: oye,
    setTimeout: (fn, ms) => { timers.push({ fn, ms }); return timers.length; },
    location: { reload: () => { ctx.recargas++; }, href: 'https://back2prime.app/' },
    recargas: 0, console,
  };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(SRC, 'utf8'), ctx, { filename: SRC });
  const N = ctx.window.B2P_NUBE;
  A(N && N.activo, 'nube.js arranca en modo nube con la configuración de mentira');
  return {
    N, subidas, timers, ctx,
    guardado: () => (store[KEY] ? JSON.parse(store[KEY]) : null),
    dispara: ev => (oidos[ev] || []).forEach(f => f()),
    vacia: () => { const t = timers.splice(0); t.forEach(x => x.fn()); return t.length; },
  };
}
// las promesas de dentro del vm se resuelven en microtareas: dos vueltas y todo está
const respira = () => new Promise(r => setTimeout(r, 0));

const AYER = Date.now() - 864e5;
const PERFIL = { v: 1, creado: '2026-09-06', sexo: 'h', edad: 40, alturaCm: 178, pesoKg: 84, objetivo: 'recomp',
  inicio: 'hoy', duracionSem: 12, diasSemana: 4, material: 'casa', dieta: 'normal', sin: [], gustos: { like: [], no: [] } };
const base = (extra, uid = 'u1') => Object.assign({ v: 1, usuario: { nombre: 'Ana', creado: '2026-09-06' },
  config: { cinturaBase: 92, creado: '2026-09-06', onboarded: true, lang: 'es', uid },
  dias: {}, logros: {}, prs: {}, prCount: 0, flags: {}, shop: {}, prep: {}, ui: {} }, extra);
const conPlan = (extra, uid) => base(Object.assign({ perfil: PERFIL }, extra), uid);
/* el estado que deja la puerta de entrada en una instalación nueva: sin
   plan, con el uid y —en la versión anterior de app.js— con reloj de ahora */
const vacio = (mod, uid) => base({ usuario: { nombre: 'Ana', creado: '2026-09-07' }, _mod: mod,
  config: { cinturaBase: null, creado: '2026-09-07', onboarded: false, uid: uid || 'u1' } }, uid);
const D1 = { ej: { flexiones: { kg: 0, reps: 12 } }, pasos: 8000 }, D2 = { pasos: 9000 }, D3 = { peso: 83.4 };

(async () => {
  // --- 1. LA AVERÍA: pantalla de inicio vacía contra la nube con el plan ---
  {
    const local = vacio(AYER + 60e3), nube = conPlan({ dias: { '2026-09-06': D1 }, logros: { 'primer-dia': '2026-09-06' }, _mod: AYER });
    A(local._mod > nube._mod, 'placebo: por reloj, el vacío ES el más nuevo (la trampa es real)');
    const m = monta({ local, nube });
    const r = await m.N.arranca(); await respira();
    A(r.reemplazado === true, 'avería: el dispositivo nuevo baja el plan de la nube (reemplazado)');
    const g = m.guardado();
    A(g && g.perfil && g.dias['2026-09-06'] && g.logros['primer-dia'], 'avería: el plan y el registro del primer día quedan en el dispositivo');
    A(g && g.config.uid === 'u1', 'avería: la copia bajada lleva la marca de dueño');
    A(m.subidas.length === 0, 'avería: NO sube nada (subió ' + m.subidas.length + ')');
    m.dispara('pagehide'); m.dispara('visibilitychange'); m.vacia(); await respira();
    A(m.subidas.length === 0, 'avería: tampoco sube en el empujón de cierre');
    A(m.N.decide(local, nube).accion === 'baja', 'decide: vacío nuevo contra plan viejo → baja');
    /* una nube de una versión vieja sin las claves logros/prs: la unión no
       debe inventárselas vacías y contarlo como cambio (subida y recarga
       de regalo en cada arranque) */
    const escueta = { v: 1, usuario: nube.usuario, config: nube.config, perfil: PERFIL, dias: { '2026-09-06': D1 }, _mod: AYER };
    const re = m.N.decide(local, escueta);
    A(re.accion === 'baja', 'decide: nube sin claves logros/prs → baja, no fusiona (da: ' + re.accion + ')');
  }

  // --- 2. la otra mitad de la avería: el navegador con el plan contra una nube ya vaciada ---
  {
    const local = conPlan({ dias: { '2026-09-06': D1 }, _mod: AYER }), nube = base({ _mod: AYER + 60e3 });
    const m = monta({ local, nube });
    const r = await m.N.arranca(); await respira();
    A(!r.reemplazado, 'nube vaciada: el plan local no se pisa');
    A(m.subidas.length === 1 && m.subidas[0].estado.perfil && m.subidas[0].estado.dias['2026-09-06'], 'nube vaciada: el plan local vuelve a subir');
    A(m.subidas.length === 1 && m.subidas[0].mod > nube._mod, 'nube vaciada: la subida va sellada con reloj más nuevo que el vacío (el servidor rechazaría «mod retrocede»)');
    A(m.subidas.length === 1 && m.subidas[0].user_id === 'u1', 'nube vaciada: sube a la fila de la cuenta');
    A(m.guardado()._mod === m.subidas[0].mod, 'nube vaciada: el reloj sellado se guarda también en local');
  }

  // --- 3. sin nube todavía: el plan local sube; el vacío, no ---
  {
    const m = monta({ local: conPlan({ dias: { '2026-09-06': D1 }, _mod: AYER }), nube: null });
    const r = await m.N.arranca(); await respira();
    A(!r.reemplazado && m.subidas.length === 1 && m.subidas[0].mod === AYER, 'primera subida: el plan local sube tal cual, con su reloj');
    const v = monta({ local: vacio(AYER), nube: null });
    const rv = await v.N.arranca(); await respira();
    A(!rv.reemplazado && v.subidas.length === 0, 'cuenta recién creada: un estado sin plan no sube');
    // y en cuanto hay plan (cuestionario hecho), sube por el camino normal
    v.N.programa(conPlan({ _mod: Date.now() }));
    A(v.timers.length === 1, 'tras decidir, programa() sí arma el temporizador');
    v.vacia(); await respira();
    A(v.subidas.length === 1 && v.subidas[0].estado.perfil, 'con plan ya sube');
  }

  // --- 4. dos dispositivos: la unión conserva los registros de los dos ---
  {
    // la nube va por delante y trae un día que aquí no está; aquí hay otro que allí falta
    const local = conPlan({ dias: { '2026-09-05': D1, '2026-09-06': D2 }, prs: { 'press-banca': { kg: 60, fecha: '2026-09-05' } }, prCount: 1, _mod: AYER });
    const nube = conPlan({ dias: { '2026-09-05': D1, '2026-09-07': D3 }, logros: { 'primer-dia': '2026-09-05' },
      prs: { 'press-banca': { kg: 55, fecha: '2026-09-03' }, 'sentadilla': { kg: 80, fecha: '2026-09-07' } }, prCount: 2, _mod: AYER + 3600e3 });
    const m = monta({ local, nube });
    const r = await m.N.arranca(); await respira();
    A(r.reemplazado === true, 'unión: este dispositivo recibe la copia unida');
    const g = m.guardado();
    A(g && ['2026-09-05', '2026-09-06', '2026-09-07'].every(d => g.dias[d]), 'unión: los tres días están (' + Object.keys(g.dias).join(', ') + ')');
    A(g && g.logros['primer-dia'], 'unión: el logro de la nube se conserva');
    A(g && g.prs['press-banca'].kg === 60 && g.prs['sentadilla'].kg === 80, 'unión: en las marcas se queda la mayor de cada ejercicio');
    A(g && g.prCount === 2, 'unión: el contador de marcas no baja');
    A(m.subidas.length === 1 && Object.keys(m.subidas[0].estado.dias).length === 3, 'unión: la copia unida sube también');
    A(m.subidas.length === 1 && m.subidas[0].mod > nube._mod, 'unión: sellada con reloj nuevo');
    A(m.N.decide(local, nube).accion === 'fusiona', 'decide: nube delante con día propio aquí → fusiona');
    // al revés: aquí va por delante y la nube tiene un día que aquí falta
    const r2 = m.N.decide(conPlan({ dias: { '2026-09-06': D2 }, _mod: AYER + 7200e3 }), conPlan({ dias: { '2026-09-05': D1 }, _mod: AYER }));
    A(r2.accion === 'fusiona' && r2.estado.dias['2026-09-05'] && r2.estado.dias['2026-09-06'], 'decide: local delante con día ajeno en la nube → fusiona');
    // mismo día en los dos: manda el del reloj más nuevo
    const r3 = m.N.decide(conPlan({ dias: { '2026-09-06': { pasos: 1 } }, _mod: AYER }), conPlan({ dias: { '2026-09-06': { pasos: 2 } }, _mod: AYER + 1 }));
    A(r3.estado.dias['2026-09-06'].pasos === 2, 'decide: el mismo día en los dos lados lo resuelve el reloj');
  }

  // --- 5. en sincronía: ni sube ni baja ni recarga, aunque las claves vengan en otro orden ---
  {
    const a = conPlan({ dias: { '2026-09-05': D1, '2026-09-06': D2 }, _mod: AYER });
    const b = conPlan({ dias: { '2026-09-06': D2, '2026-09-05': D1 }, _mod: AYER });
    const m = monta({ local: a, nube: b });
    const r = await m.N.arranca(); await respira();
    A(!r.reemplazado && m.subidas.length === 0, 'en sincronía: nada que hacer');
    A(m.N.decide(a, b).accion === 'nada', 'decide: mismo contenido con otro orden de claves → nada');
    // la copia local va por delante (se cerró la app antes de subir): sube y no recarga
    const c = conPlan({ dias: { '2026-09-05': D1, '2026-09-06': D2, '2026-09-07': D3 }, _mod: AYER + 60e3 });
    const m2 = monta({ local: c, nube: b });
    const r2 = await m2.N.arranca(); await respira();
    A(!r2.reemplazado && m2.subidas.length === 1 && m2.subidas[0].mod === c._mod, 'local por delante: sube con su reloj y no recarga');
  }

  // --- 6. otra cuenta en este dispositivo: su copia se aparta y no se mezcla ---
  {
    const ajena = conPlan({ dias: { '2026-09-01': D1 }, _mod: Date.now() }, 'otra-persona');
    const nube = conPlan({ dias: { '2026-09-06': D2 }, _mod: AYER });
    const m = monta({ local: ajena, nube });
    const r = await m.N.arranca(); await respira();
    const g = m.guardado();
    A(r.reemplazado === true && g && g.config.uid === 'u1' && !g.dias['2026-09-01'], 'copia ajena: se aparta y se baja la propia, sin mezclar días');
    A(m.subidas.length === 0, 'copia ajena: no sube nada de la otra persona');
    const m2 = monta({ local: ajena, nube: null });
    const r2 = await m2.N.arranca(); await respira();
    A(!r2.reemplazado && m2.guardado() === null && m2.subidas.length === 0, 'copia ajena sin nube: se aparta y se arranca de cero');
  }

  // --- 7. el cerrojo: antes de decidir no sube nada, ni lo apuntado antes ---
  {
    const local = vacio(AYER + 60e3), nube = conPlan({ dias: { '2026-09-06': D1 }, _mod: AYER });
    const m = monta({ local, nube });
    m.N.programa(local);                      // la puerta guarda antes de que arranca() decida
    A(m.timers.length === 0, 'cerrojo: programa() antes de decidir no arma temporizador');
    m.dispara('pagehide'); await respira();
    A(m.subidas.length === 0, 'cerrojo: el empujón de cierre antes de decidir no sube');
    await m.N.arranca(); await respira();
    m.dispara('pagehide'); m.vacia(); await respira();
    A(m.subidas.length === 0, 'cerrojo: lo apuntado antes de decidir no sube después de decidir');
    // sin sesión no hay ni comparación ni subida
    const s = monta({ local: conPlan({ _mod: AYER }), nube: null, uid: null });
    const rs = await s.N.arranca(); s.N.programa(conPlan({ _mod: Date.now() })); s.vacia(); await respira();
    A(rs.entra === true && s.subidas.length === 0, 'sin sesión: a la puerta, y nada sube');
  }

  // --- 8. sin red al arrancar: el cerrojo sigue cerrado, y se abre al volver la conexión ---
  {
    const m = monta({ local: conPlan({ dias: { '2026-09-06': D1 }, _mod: AYER }), nube: conPlan({ _mod: AYER - 60e3 }) });
    const sb = m.ctx.window.supabase.createClient();
    const bien = sb.from;
    sb.from = () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: { message: 'Failed to fetch' } }) }) }) });
    const r = await m.N.arranca(); await respira();
    A(r.sinRed === true, 'sin red: arranca() lo dice y la app sigue en local');
    m.N.programa(conPlan({ dias: { '2026-09-06': D1, '2026-09-07': D3 }, _mod: Date.now() }));
    A(m.timers.length === 0, 'sin red: sin comparar, nada se programa');
    sb.from = bien;
    m.dispara('online'); await respira(); await respira();
    A(m.subidas.length === 1 && m.subidas[0].estado.dias['2026-09-06'], 'al volver la red se compara y sube lo local, que iba por delante');
    A(m.ctx.recargas === 0, 'al volver la red no recarga si la copia local no cambia');
  }

  // --- 9. modo local puro: decide sigue expuesta y el resto no hace nada ---
  {
    const ctx = { window: { B2P_NUBE_CFG: { url: null, anon: null } }, console };
    vm.createContext(ctx);
    vm.runInContext(fs.readFileSync(SRC, 'utf8'), ctx, { filename: SRC });
    const N = ctx.window.B2P_NUBE;
    A(N && N.activo === false && typeof N.decide === 'function', 'sin nube: decide() está expuesta igualmente');
    A(N.decide(null, null).accion === 'nada' && N.decide(vacio(1), null).accion === 'nada', 'decide: sin plan en ningún sitio → nada');
  }

  if (!process.exitCode) console.log('HUMO NUBE OK');
})().catch(e => { console.error('FALLO: excepción ' + (e && e.stack || e)); process.exit(1); });
