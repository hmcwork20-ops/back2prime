/* Cobertura de patrones por material. La regla que se protege: si un plan de
   casa o sin material pide un patrón de movimiento, eligeSub tiene que
   encontrar un candidato de ese nivel — si no, se queda el original y al
   usuario le sale un ejercicio de polea en el salón. */
const fs = require('fs'), vm = require('vm');

const IDIOMAS = ['data.js', 'data.en.js', 'data.fr.js', 'data.de.js', 'data.it.js', 'data.pt.js'];
function carga(f) {
  const c = { window: {}, localStorage: { getItem: () => null, setItem: () => {} }, console };
  vm.createContext(c);
  for (const x of ['assets/' + f, 'assets/gen.js']) vm.runInContext(fs.readFileSync(x, 'utf8'), c, { filename: x });
  return { B: c.window.B2P, G: c.window.B2P_GEN };
}
const ok = (c, m) => { if (!c) { console.error('FALLO: ' + m); process.exit(1); } };

const { B, G } = carga('data.js');

// --- 1. todo patrón tiene salida en casa; el que se usa sin material, también ---
const porPat = {};
Object.keys(B.EJERCICIOS).forEach(id => {
  const p = B.EJERCICIOS[id].pat || '(sin)';
  porPat[p] = porPat[p] || { nada: [], casa: [] };
  if (G.equipoValeId(B, id, 'nada')) porPat[p].nada.push(id);
  if (G.equipoValeId(B, id, 'casa')) porPat[p].casa.push(id);
});
Object.keys(porPat).forEach(p => {
  ok(porPat[p].casa.length > 0, 'el patrón «' + p + '» no tiene NI UN ejercicio disponible en casa');
  ok(porPat[p].nada.length > 0, 'el patrón «' + p + '» no tiene NI UN ejercicio a peso corporal');
});
console.log('  los ' + Object.keys(porPat).length + ' patrones tienen salida en casa Y a peso corporal');

// --- 2. ningún plan de casa/nada cuela material que el usuario no tiene ---
const PROHIBIDO = /polea|máquina|maquina|multipower|rack|prensa|banco|barra(?! de dominadas)/i;
const PERFILES = [];
for (const material of ['casa', 'nada'])
  for (const historial of ['nunca', 'retomador', 'activo'])
    for (const dias of [2, 3, 4, 5])
      PERFILES.push({ n: material + '/' + historial + '/' + dias + 'd', p: {
        sexo: 'h', edad: 34, alturaCm: 176, pesoKg: 88, objetivo: 'perder', evento: 'siempre',
        duracionSem: 12, historial, diasSemana: dias, minSesion: 60, franja: 'tarde', material,
        lesiones: [], medico: false, dieta: 'normal', sin: [], gustos: { like: [], no: [] } } });

const ejerciciosDe = (W, p) => {
  const plan = W.G.generarPlan(p, W.B);
  const usados = new Set();
  plan.CAL.forEach(w => w.dias.forEach(x => { const s = typeof x === 'object' ? x.s : x; if (s && s !== 'libre') usados.add(s); }));
  const ids = new Set();
  usados.forEach(sid => ((plan.SESIONES[sid] || {}).bloques || []).forEach(b => ids.add(b.e)));
  return [...ids].sort();
};

const W = {}; IDIOMAS.forEach(l => W[l] = carga(l));

// la sesión sustituida tiene que conservar el reparto de patrones del original:
// si el plan pedía 2 empujes y 2 tríceps, no puede acabar con 1 y 4.
const patronesDe = (Wl, p) => {
  const plan = Wl.G.generarPlan(p, Wl.B);
  const out = {};
  Object.keys(plan.SESIONES || {}).forEach(sid => {
    const cuenta = {};
    ((plan.SESIONES[sid] || {}).bloques || []).forEach(b => {
      const q = (Wl.B.EJERCICIOS[b.e] || {}).pat || '?';
      cuenta[q] = (cuenta[q] || 0) + 1;
    });
    out[sid] = cuenta;
  });
  return out;
};

let planes = 0;
for (const { n, p } of PERFILES) {
  const ids = ejerciciosDe(W['data.js'], p);
  ok(ids.length > 0, n + ': plan vacío');
  const malos = ids.filter(id => PROHIBIDO.test((B.EJERCICIOS[id] || {}).equipo || ''));
  ok(!malos.length, n + ': el plan pide material que no tiene → ' + malos.join(', '));
  // el mismo plan en los seis idiomas: el motor no puede depender del texto
  const ref = ids.join('|');
  for (const l of IDIOMAS) ok(ejerciciosDe(W[l], p).join('|') === ref, n + ': ' + l + ' genera otro plan');

  // ninguna sustitución cambia de zona: «aislamiento» agrupa hombro, trapecio,
  // glúteo e isquios, y sin esta regla el curl femoral acababa siendo una
  // rotación de hombro en el día de pierna
  const planGym = W['data.js'].G.generarPlan(Object.assign({}, p, { material: 'gym' }), W['data.js'].B);
  const planSuyo = W['data.js'].G.generarPlan(p, W['data.js'].B);
  Object.keys(planSuyo.SESIONES || {}).forEach(sid => {
    const a = ((planGym.SESIONES[sid] || {}).bloques || []), b = ((planSuyo.SESIONES[sid] || {}).bloques || []);
    if (a.length !== b.length) return;
    a.forEach((bl, i) => {
      const o = B.EJERCICIOS[bl.e] || {}, nu = B.EJERCICIOS[b[i].e] || {};
      if (bl.e === b[i].e) return;
      ok(o.zona === nu.zona, n + '/' + sid + ': ' + bl.e + ' (' + o.zona + ') sustituido por ' + b[i].e + ' (' + nu.zona + ')');
      // si existe un candidato del mismo músculo primario y disponible, se usa ese
      const musc = ((o.mm || {}).p || [])[0];
      if (!musc) return;
      const mejor = Object.keys(B.EJERCICIOS).some(k => k !== b[i].e && B.EJERCICIOS[k].zona === o.zona
        && B.EJERCICIOS[k].pat === o.pat && (((B.EJERCICIOS[k].mm || {}).p || [])[0] === musc)
        && W['data.js'].G.equipoValeId(B, k, p.material));
      const suyoMusc = ((nu.mm || {}).p || [])[0];
      ok(!(mejor && suyoMusc !== musc),
        n + '/' + sid + ': ' + bl.e + ' (' + musc + ') fue a ' + b[i].e + ' (' + suyoMusc + ') habiendo equivalente del mismo músculo');
    });
  });

  // mismo perfil con gimnasio = las sesiones originales, sin sustituir
  const conGym = patronesDe(W['data.js'], Object.assign({}, p, { material: 'gym' }));
  const suyo = patronesDe(W['data.js'], p);
  Object.keys(suyo).forEach(sid => {
    if (!conGym[sid] || /^cam|^c-/.test(sid)) return;   // el cardio y los circuitos no se sustituyen
    Object.keys(conGym[sid]).forEach(q => {
      ok(suyo[sid][q] === conGym[sid][q],
        n + '/' + sid + ': el patrón «' + q + '» pasó de ' + conGym[sid][q] + ' a ' + (suyo[sid][q] || 0) + ' bloques al sustituir');
    });
  });
  planes++;
}
console.log('  ' + planes + ' perfiles de casa/nada × 6 idiomas: cero material imposible, planes idénticos');
console.log('  el reparto de patrones de cada sesión sobrevive a la sustitución');

// --- 3. las fichas nuevas están completas en los seis idiomas ---
const NUEVOS = {
  'fondos-silla': 'ext', 'flexion-diamante': 'ext', 'ext-triceps-banda': 'ext', 'press-frances-mc': 'ext',
  'pike-flexiones': 'ev', 'jalon-toalla': 'tv', 'abduccion-lado': 'ais', 'crunch-inverso': 'flex', 'curl-mochila': 'curl',
  'flexion-declinada': 'eh', 'pino-pared': 'ev', 'remo-mesa': 'th', 'pistol-asistida': 'rod', 'curl-toalla': 'curl',
  'zancada-bulgara-pc': 'zan', 'puente-1p': 'bis', 'elev-piernas-suelo': 'flex', 'elev-talon-1p': 'gem',
  'plancha-lateral': 'core'
};

// --- la escalera de dificultad: quien nunca entrenó no recibe variantes duras ---
const AVANZADOS = ['pino-pared'];
for (const dias of [2, 3, 4, 5]) {
  const p = { sexo: 'h', edad: 34, alturaCm: 176, pesoKg: 88, objetivo: 'perder', evento: 'siempre',
    duracionSem: 12, historial: 'nunca', diasSemana: dias, minSesion: 60, franja: 'tarde', material: 'nada',
    lesiones: [], medico: false, dieta: 'normal', sin: [], gustos: { like: [], no: [] } };
  const ids = ejerciciosDe(W['data.js'], p);
  const duros = ids.filter(id => AVANZADOS.includes(id));
  ok(!duros.length, 'principiante a ' + dias + ' días recibe variante avanzada: ' + duros.join(', '));
}
// y a quien sí entrena, la progresión le llega
const activo = { sexo: 'h', edad: 34, alturaCm: 176, pesoKg: 88, objetivo: 'perder', evento: 'siempre',
  duracionSem: 12, historial: 'activo', diasSemana: 5, minSesion: 60, franja: 'tarde', material: 'nada',
  lesiones: [], medico: false, dieta: 'normal', sin: [], gustos: { like: [], no: [] } };
const suyos = ejerciciosDe(W['data.js'], activo);
['flexiones', 'flexion-declinada', 'pike-flexiones', 'pino-pared'].forEach(id =>
  ok(suyos.includes(id), 'el plan sin material de quien entrena no incluye ' + id));
console.log('  escalera de dificultad: base para el principiante, progresión para quien ya entrena');
for (const l of IDIOMAS) {
  for (const id of Object.keys(NUEVOS)) {
    const e = W[l].B.EJERCICIOS[id];
    ok(e, l + ': falta la ficha ' + id);
    ok(e.pat === NUEVOS[id], l + '/' + id + ': patrón cambiado (' + e.pat + ')');
    ok(e.nombre && e.equipo && e.mol, l + '/' + id + ': ficha incompleta');
    ok(e.cues.length >= 3 && e.err.length >= 2 && e.alt.length >= 1, l + '/' + id + ': ficha corta');
    ok(e.zona === W['data.js'].B.EJERCICIOS[id].zona, l + '/' + id + ': zona distinta del español');
    ok(e.mm && e.mm.p && e.mm.p.length, l + '/' + id + ': sin músculo primario para el mapa');
  }
}
// cada ficha nueva pinta un pictograma que existe de verdad
const PICTOS = new Set(fs.readdirSync('assets/pictos').map(f => f.replace('.webp', '')));
for (const id of Object.keys(NUEVOS)) {
  const e = W['data.js'].B.EJERCICIOS[id];
  const usa = (e.pic && PICTOS.has(e.pic)) ? e.pic : e.pat;
  ok(PICTOS.has(usa), id + ': el pictograma «' + usa + '» no está en assets/pictos');
}
console.log('  ' + Object.keys(NUEVOS).length + ' fichas nuevas completas en los 6 idiomas, con pictograma en disco');

console.log('HUMO PATRONES OK');
