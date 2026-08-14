/* ============================================================
   BACK2PRIME · validate_lang.js
   Auditoría de un data.<lang>.js contra el data.js español.

   Uso:  node tools/validate_lang.js assets/data.pt.js

   Comprueba lo que de verdad puede romper la app: además de la
   estructura, los valores ENUM de los que depende la lógica deben
   ser IDÉNTICOS al original, porque app.js/views.js los COMPARAN
   como cadenas. Traducir un 'fuerza' o un id de receta deja la
   app en blanco sin dar error.
   ============================================================ */
const path = process.argv[2];
if (!path) { console.log('uso: node tools/validate_lang.js <ruta data.xx.js>'); process.exit(2); }
const abs = p => require('path').resolve(p);
const load = p => { global.window = {}; delete require.cache[require.resolve(abs(p))]; require(abs(p)); return global.window.B2P; };

const es = load('assets/data.js');
const tr = load(path);
const errs = [];
const eq = (a, b, ctx) => { if (JSON.stringify(a) !== JSON.stringify(b)) errs.push(ctx + ': ' + JSON.stringify(b) + ' ≠ ' + JSON.stringify(a)); };

// 1) Estructura: mismas rutas de clave y mismos tipos
const rutas = (o, p) => { let out = []; for (const k in o) { const v = o[k]; out.push(p + k + ':' + (Array.isArray(v) ? 'A' + v.length : typeof v)); if (v && typeof v === 'object' && !Array.isArray(v)) out = out.concat(rutas(v, p + k + '.')); } return out; };
const ra = rutas(es, ''), rb = rutas(tr, '');
ra.filter(x => !rb.includes(x)).slice(0, 10).forEach(x => errs.push('falta ruta ' + x));
rb.filter(x => !ra.includes(x)).slice(0, 10).forEach(x => errs.push('ruta sobrante ' + x));

// 2) SESIONES: tipo/icono/tendon y los bloques (ids, series, descansos)
for (const k of Object.keys(es.SESIONES)) {
  const a = es.SESIONES[k], b = tr.SESIONES[k];
  if (!b) { errs.push('falta SESIONES.' + k); continue; }
  eq(a.tipo, b.tipo, 'SESIONES.' + k + '.tipo');
  eq(a.icono, b.icono, 'SESIONES.' + k + '.icono');
  eq(a.tendon, b.tendon, 'SESIONES.' + k + '.tendon');
  (a.bloques || []).forEach((x, i) => {
    const y = (b.bloques || [])[i] || {};
    eq(x.e, y.e, 'SESIONES.' + k + '.bloques[' + i + '].e');
    eq(x.s, y.s, 'SESIONES.' + k + '.bloques[' + i + '].s');
    eq(x.d, y.d, 'SESIONES.' + k + '.bloques[' + i + '].d');
  });
}
// 3) EJERCICIOS: mismas claves y misma zona (agrupa la biblioteca)
eq(Object.keys(es.EJERCICIOS), Object.keys(tr.EJERCICIOS), 'claves EJERCICIOS');
for (const k of Object.keys(es.EJERCICIOS)) eq(es.EJERCICIOS[k].zona, (tr.EJERCICIOS[k] || {}).zona, 'EJERCICIOS.' + k + '.zona');
// 4) MENU: ids de receta + centinela 'LIBRE'
es.MENU.forEach((m, i) => { eq(m.de, tr.MENU[i].de, 'MENU[' + i + '].de'); eq(m.co, tr.MENU[i].co, 'MENU[' + i + '].co'); eq(m.ce, tr.MENU[i].ce, 'MENU[' + i + '].ce'); });
// 5) Números y fechas que mueven la lógica
es.RECETAS.forEach((r, i) => { eq(r.id, tr.RECETAS[i].id, 'RECETAS[' + i + '].id'); eq(r.macros, tr.RECETAS[i].macros, 'RECETAS[' + i + '].macros'); });
eq(es.CAL, tr.CAL, 'CAL');
es.FASES.forEach((f, i) => { eq(f.id, tr.FASES[i].id, 'FASES.id'); eq(f.disco, tr.FASES[i].disco, 'FASES.disco'); eq(f.semanas, tr.FASES[i].semanas, 'FASES.semanas'); });
eq(es.CHECKPOINTS.map(c => [c.sem, c.fecha, c.rango]), tr.CHECKPOINTS.map(c => [c.sem, c.fecha, c.rango]), 'CHECKPOINTS');
eq(Object.keys(es.HISTORICO), Object.keys(tr.HISTORICO), 'HISTORICO claves');
eq(es.ARRANQUE.tabla.map(x => x.ej), tr.ARRANQUE.tabla.map(x => x.ej), 'ARRANQUE ids');
eq(es.LOGROS.map(l => l.id), tr.LOGROS.map(l => l.id), 'LOGROS ids');
eq(es.FOTOS, tr.FOTOS, 'FOTOS');
eq(es.META.inicioISO, tr.META.inicioISO, 'META.inicioISO');
// 6) UI: lang correcto, placeholders {x} conservados, arrays de igual longitud
eq(Object.keys(es.UI), Object.keys(tr.UI), 'UI claves');
const esperado = (path.match(/data\.(\w+)\.js/) || [])[1];
if (esperado && tr.UI.lang !== esperado) errs.push('UI.lang=' + tr.UI.lang + ' ≠ ' + esperado);
for (const k of Object.keys(es.UI)) {
  const a = es.UI[k], b = tr.UI[k];
  if (typeof a === 'string') {
    const ph = s => (String(s).match(/\{\w+\}/g) || []).sort().join(',');
    if (ph(a) !== ph(b)) errs.push('UI.' + k + ' placeholders: "' + ph(a) + '" vs "' + ph(b) + '"');
  }
  if (Array.isArray(a) && (!Array.isArray(b) || a.length !== b.length)) errs.push('UI.' + k + ' longitud de array');
}

if (errs.length) { console.log('FALLOS (' + errs.length + '):'); errs.slice(0, 20).forEach(e => console.log(' - ' + e)); process.exit(1); }
console.log('VALIDACIÓN OK: ' + path + '  ·  ' + ra.length + ' rutas de clave');
