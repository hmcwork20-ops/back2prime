/* Menores: likes en el menú, sin repetir plato, duración honesta, cardio sin
   material asumido. */
const fs = require('fs'), vm = require('vm');
const ctx = { window: {}, localStorage: { getItem: () => null, setItem: () => {} }, console };
vm.createContext(ctx);
for (const f of ['assets/data.js', 'assets/gen.js']) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });
const B = ctx.window.B2P, G = ctx.window.B2P_GEN;
const A = (c, m) => { if (!c) { console.error('FALLO: ' + m); process.exitCode = 1; } };

const base = { sexo: 'm', edad: 38, alturaCm: 168, pesoKg: 74, objetivo: 'recomp', evento: 'siempre', duracionSem: 12, historial: 'nunca', diasSemana: 4, minSesion: 45, franja: 'mediodia', material: 'casa', lesiones: [], medico: false, dieta: 'vegetariano', sin: [] };

// --- los «me gusta» de comida entran en el menú ---
const veg = B.RECETAS.filter(r => r.slot === 'de' && G.recetaVale(r, { dieta: 'vegetariano', sin: [] }, new Set()));
A(veg.length >= 3, 'hay desayunos vegetarianos (' + veg.length + ')');
const favorito = veg[veg.length - 1].id;      // el último de la cola sin likes
const conLike = G.generarPlan(Object.assign({}, base, { gustos: { like: ['com:' + favorito], no: [] } }), B);
const desayunos = conLike.MENU.map(f => f.de);
A(desayunos.includes(favorito), 'el desayuno marcado «me gusta» entra en el menú (' + favorito + ' en ' + [...new Set(desayunos)].join(',') + ')');

// --- variedad: no repite mientras haya alternativas ---
const sinLike = G.generarPlan(Object.assign({}, base, { gustos: { like: [], no: [] } }), B);
const cuenta = {};
sinLike.MENU.forEach(f => { cuenta[f.de] = (cuenta[f.de] || 0) + 1; });
const maxRep = Math.max(...Object.values(cuenta));
const distintos = Object.keys(cuenta).length;
A(distintos >= Math.min(veg.length, 5), 'variedad de desayunos: ' + distintos + ' distintos en 7 días (pool ' + veg.length + ')');
A(maxRep <= Math.ceil(7 / Math.min(veg.length, 7)) + 1, 'ninguno se repite de más (máx ' + maxRep + ')');
console.log('menú: ' + distintos + ' desayunos distintos, máx repetición ' + maxRep);

// --- duración anunciada = la pedida, con y sin recorte ---
[30, 45, 60, 75].forEach(min => {
  const p = G.generarPlan(Object.assign({}, base, { minSesion: min, gustos: { like: [], no: [] } }), B);
  const usados = new Set();
  p.CAL.forEach(w => w.dias.forEach(x => { const s = typeof x === 'object' ? x.s : x; if (s && s !== 'libre') usados.add(s); }));
  [...usados].forEach(sid => {
    const ses = p.SESIONES[sid];
    if (!ses || ses.tipo !== 'fuerza') return;
    A(String(ses.dur).includes(String(min)), min + '′: la sesión ' + sid + ' anuncia ' + ses.dur);
  });
});
console.log('duración: 30/45/60/75 anunciadas correctamente');

// --- cardio: natación y ciclismo no generan sesión propia (piden material) ---
const soloAgua = G.generarPlan(Object.assign({}, base, { gustos: { like: ['dep:natacion', 'dep:ciclismo'], no: [] } }), B);
A(!soloAgua.SESIONES['cardio-libre'], 'natación+ciclismo: sin sesión de cardio libre (piden material)');
const conYoga = G.generarPlan(Object.assign({}, base, { gustos: { like: ['dep:yoga', 'dep:natacion'], no: [] } }), B);
A(conYoga.SESIONES['cardio-libre'], 'yoga: sí hay cardio libre');
A(!/Nataci|Ciclis/i.test(conYoga.SESIONES['cardio-libre'].nombre), 'el nombre no cita natación ni ciclismo (' + conYoga.SESIONES['cardio-libre'].nombre + ')');
console.log('cardio con yoga: ' + conYoga.SESIONES['cardio-libre'].nombre);
console.log(process.exitCode ? 'CON FALLOS' : 'HUMO MENORES OK');
