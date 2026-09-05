/* Banco de humo del portugués: carga data.pt.js + gen.js y genera planes
   reales para varios perfiles. Comprueba que el motor da los MISMOS números
   en los dos idiomas (no depende del texto) y que la prosa sale en portugués. */
const fs = require('fs'), vm = require('vm');

function carga(fichero) {
  const ctx = { window: {}, localStorage: { getItem: () => null, setItem: () => {} }, console };
  vm.createContext(ctx);
  for (const f of ['assets/' + fichero, 'assets/gen.js']) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });
  return { B: ctx.window.B2P, G: ctx.window.B2P_GEN };
}

const ES = carga('data.js'), PT = carga('data.pt.js');
const ok = (c, m) => { if (!c) { console.error('FALLO: ' + m); process.exit(1); } };
ok(typeof PT.G.generarPlan === 'function', 'gen.js no arranca sobre data.pt.js');

const PERFILES = [
  { n: 'gym perder',   p: { sexo: 'h', edad: 30, alturaCm: 183, pesoKg: 95, objetivo: 'perder', evento: 'verano', duracionSem: 12, historial: 'retomador', diasSemana: 4, minSesion: 60, franja: 'manana', material: 'gym', lesiones: [], medico: false, dieta: 'normal', sin: [], gustos: { like: [], no: [] } } },
  { n: 'casa recomp',  p: { sexo: 'm', edad: 41, alturaCm: 165, pesoKg: 68, objetivo: 'recomp', evento: 'siempre', duracionSem: 24, historial: 'nunca', diasSemana: 3, minSesion: 45, franja: 'tarde', material: 'casa', lesiones: ['hombro'], medico: false, dieta: 'vegetariano', sin: ['lactosa'], gustos: { like: [], no: [] } } },
  { n: 'nada ganar',   p: { sexo: 'h', edad: 24, alturaCm: 178, pesoKg: 62, objetivo: 'ganar', evento: 'boda', duracionSem: 16, historial: 'activo', diasSemana: 5, minSesion: 75, franja: 'mediodia', material: 'nada', lesiones: ['rodilla', 'lumbar'], medico: false, dieta: 'vegano', sin: ['gluten', 'frutos'], gustos: { like: [], no: [] } } },
  { n: 'gym mantener', p: { sexo: 'x', edad: 55, alturaCm: 172, pesoKg: 80, objetivo: 'mantener', evento: 'siempre', duracionSem: 12, historial: 'activo', diasSemana: 2, minSesion: 30, franja: 'manana', material: 'gym', lesiones: [], medico: false, dieta: 'normal', sin: [], gustos: { like: [], no: [] } } }
];

// Marcadores que SOLO existen en castellano (nada de «semana», que vale en pt).
const CASTELLANO = /\b(ejercicios?|entreno|desayuno|mancuernas?|repeticiones?|carbohidratos?|también|después|por delante|por debajo|pollo|lentejas)\b/;

const junta = r => [
  r.CIERRE, r.CIENCIA.intro, r.NUTRI.escalado, r.NUTRI.tomas,
  ...r.REGLAS.map(x => x.t + ' ' + x.d),
  ...r.FASES.map(f => f.nombre + ' ' + f.obj),
  ...r.CIENCIA.temas.map(t => t.t + ' ' + t.d),
  ...r.CHECKPOINTS.map(c => c.si)
].join(' \n ');

const ejerciciosDe = plan => {
  const usados = new Set();
  plan.CAL.forEach(w => w.dias.forEach(x => { const s = typeof x === 'object' ? x.s : x; if (s && s !== 'libre') usados.add(s); }));
  const ejs = [];
  usados.forEach(sid => ((plan.SESIONES[sid] || {}).bloques || []).forEach(b => ejs.push(sid + '/' + b.e)));
  return ejs.sort();
};

for (const { n, p } of PERFILES) {
  const rEs = ES.G.generarPlan(p, ES.B), rPt = PT.G.generarPlan(p, PT.B);

  // 1. Mismos números y mismos ejercicios: el motor no depende del idioma.
  ok(rEs.CAL.length === rPt.CAL.length, n + ': calendario de distinta longitud');
  ok(rEs.NUTRI.fases.length === rPt.NUTRI.fases.length, n + ': distinto número de fases');
  rEs.NUTRI.fases.forEach((a, i) => {
    const b = rPt.NUTRI.fases[i];
    ok(a.kcal === b.kcal && a.p === b.p && a.g === b.g && a.c === b.c, n + ': macros distintas en fase ' + i);
  });
  ok(rEs.LOGROS.length === rPt.LOGROS.length, n + ': distinto número de logros');
  rEs.LOGROS.forEach((l, i) => ok(l.id === rPt.LOGROS[i].id, n + ': logro ' + i + ' con id distinto'));
  ok(rEs.CHECKPOINTS.length === rPt.CHECKPOINTS.length, n + ': distintos checkpoints');
  rEs.CHECKPOINTS.forEach((c, i) => ok(c.sem === rPt.CHECKPOINTS[i].sem && String(c.rango) === String(rPt.CHECKPOINTS[i].rango), n + ': checkpoint ' + i + ' distinto'));
  const eEs = ejerciciosDe(rEs), ePt = ejerciciosDe(rPt);
  ok(eEs.length > 0, n + ': el plan español no tiene ejercicios (perfil mal formado)');
  ok(eEs.join('|') === ePt.join('|'), n + ': el plan portugués elige otros ejercicios');

  // 2. La prosa generada tiene que estar en portugués…
  const prosa = junta(rPt), m = prosa.match(CASTELLANO);
  ok(!m, n + ': prosa en castellano dentro del plan portugués → "' + (m && m[0]) + '"');
  // …y no dejar NI UNA plantilla más pendiente que el español (las {p}/{q}/{s}
  // que sobreviven al motor las rellena app.js al pintar).
  const pend = s => (s.match(/\{[a-z]+\}/g) || []).sort().join(',');
  ok(pend(prosa) === pend(junta(rEs)), n + ': plantillas pendientes distintas → pt[' + pend(prosa) + '] vs es[' + pend(junta(rEs)) + ']');
  ok(rPt.UI.lang === 'pt', n + ': UI.lang no es pt tras generar');

  console.log('  ' + n + ': ' + rPt.CAL.length + ' semanas · ' + eEs.length + ' huecos de ejercicio · ' + rPt.NUTRI.fases[0].kcal + ' kcal · ' + rPt.LOGROS.length + ' logros');
}

// 3. El menú portugués usa ids que existen en su propio recetario.
const rPt = PT.G.generarPlan(PERFILES[0].p, PT.B);
const ids = new Set(rPt.RECETAS.map(r => r.id));
rPt.MENU.forEach(d => ['de', 'co', 'ce'].forEach(s => ok(d[s] === 'LIBRE' || ids.has(d[s]), 'menú pt: receta inexistente ' + d[s])));
console.log('  menú pt: ' + rPt.MENU.length + ' días, ' + rPt.RECETAS.length + ' recetas, todas resueltas');

// 4. Interfaz y días traducidos, con las longitudes que la app da por hechas.
ok(rPt.MENU[0].d === 'Seg', 'el menú portugués no empieza en Seg');
ok(PT.B.UI.tabs[0] === 'Hoje', 'pestañas sin traducir');
ok(PT.B.UI.dias.length === 7 && PT.B.UI.meses.length === 12, 'días o meses con longitud mala');
ok(PT.B.UI.tour.pasos.length === ES.B.UI.tour.pasos.length, 'el tour tiene otro número de pasos');

console.log('HUMO PORTUGUÉS OK');
