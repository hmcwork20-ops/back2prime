/* Lote material/menú/evento: bandas reales, banco fuera de casa, evento con
   fecha que manda, y el menú diciendo su desfase. */
const fs = require('fs'), vm = require('vm');
const ctx = { window: {}, localStorage: { getItem: () => null, setItem: () => {} }, console };
vm.createContext(ctx);
for (const f of ['assets/data.js', 'assets/gen.js']) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });
const B = ctx.window.B2P, G = ctx.window.B2P_GEN;
const A = (c, m) => { if (!c) { console.error('FALLO: ' + m); process.exitCode = 1; } };

// --- equipoVale: banco fuera de casa, banda dentro ---
A(!G.equipoVale('Mancuernas + banco', 'casa'), 'banco fuera en casa');
A(!G.equipoVale('Mancuernas + banco 30°', 'casa'), 'banco inclinado fuera');
A(G.equipoVale('Banda', 'casa'), 'banda vale en casa');
A(G.equipoVale('Mancuernas', 'casa'), 'mancuernas valen en casa');
A(!G.equipoVale('Banda', 'nada'), 'banda NO vale sin material');
A(G.equipoVale('Mancuernas + banco', 'gym'), 'gym lo acepta todo');

// --- los 4 ejercicios de banda existen y son coherentes ---
['banda-remo', 'banda-jalon', 'banda-rotacion', 'banda-abduccion'].forEach(id => {
  const e = B.EJERCICIOS[id];
  A(e && e.nombre && e.pat && e.zona && e.equipo, 'ejercicio ' + id + ' completo');
  A(/banda|band|bande|elastico|elástico/i.test(e.equipo), id + ': equipo de banda (' + (e && e.equipo) + ')');
  A(G.equipoVale(e.equipo, 'casa'), id + ': disponible en casa');
});

// --- Ana en casa: sin banco en su plan, con banda posible ---
const ana = { sexo: 'm', edad: 38, alturaCm: 168, pesoKg: 74, objetivo: 'recomp', evento: 'verano', duracionSem: 12, historial: 'nunca', diasSemana: 4, minSesion: 45, franja: 'mediodia', material: 'casa', lesiones: ['hombro'], medico: false, dieta: 'vegetariano', sin: [], gustos: { like: [], no: [] } };
let plan = G.generarPlan(ana, B);
const usados = new Set();
plan.CAL.forEach(w => w.dias.forEach(x => { const s = typeof x === 'object' ? x.s : x; if (s && s !== 'libre') usados.add(s); }));
const ejsPlan = new Set();
usados.forEach(sid => (plan.SESIONES[sid] && plan.SESIONES[sid].bloques || []).forEach(b => ejsPlan.add(b.e)));
const conBanco = [...ejsPlan].filter(id => /banco/i.test((B.EJERCICIOS[id] || {}).equipo || ''));
A(conBanco.length === 0, 'ana: ningún ejercicio con banco (' + conBanco.join(',') + ')');
const conBarra = [...ejsPlan].filter(id => /barra(?! de dominadas)/i.test((B.EJERCICIOS[id] || {}).equipo || ''));
A(conBarra.length === 0, 'ana: ningún ejercicio con barra (' + conBarra.join(',') + ')');
console.log('ana en casa: ' + ejsPlan.size + ' ejercicios, 0 banco, 0 barra');

// --- evento con fecha: manda sobre la duración elegida ---
const hoy = new Date(); hoy.setHours(12, 0, 0, 0);
const dow = (hoy.getDay() + 6) % 7;
const lunes = new Date(hoy); lunes.setDate(lunes.getDate() + (dow === 0 ? 7 : 7 - dow));
const en20 = new Date(lunes); en20.setDate(en20.getDate() + 20 * 7);
const isoF = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const conFecha = Object.assign({}, ana, { duracionSem: 12, eventoFecha: isoF(en20) });
const pf = G.generarPlan(conFecha, B);
A(pf.META.semanas === 20, 'evento manda: 20 semanas pese a elegir 12 (son ' + pf.META.semanas + ')');
A(pf.META.eventoManda === true && pf.META.eventoFecha === isoF(en20), 'META lleva la fecha');
A(pf.CAL.length === 20 && pf.CHECKPOINTS[2].sem === 20, 'calendario y checkpoints a 20');
const decEv = pf.__decisiones.find(d => d.k === 'evento');
A(decEv && decEv.manda === true && decEv.f === isoF(en20), 'reveal: la fila del evento lleva fecha');
console.log('evento con fecha: ' + pf.META.semanas + ' semanas · fin ' + pf.META.finISO);

// --- fecha fuera de rango: manda la duración elegida ---
const lejos = new Date(lunes); lejos.setDate(lejos.getDate() + 60 * 7);
const pl = G.generarPlan(Object.assign({}, ana, { duracionSem: 24, eventoFecha: isoF(lejos) }), B);
A(pl.META.semanas === 24, 'fecha lejana: manda la duración (son ' + pl.META.semanas + ')');
A(pl.META.eventoManda === false, 'fecha lejana: eventoManda false');

// --- sin fecha: el reveal no promete ---
const sf = G.generarPlan(ana, B).__decisiones.find(d => d.k === 'evento');
A(sf && !sf.manda, 'sin fecha: la fila del evento no manda');

// --- menú: el desfase de kcal se calcula ---
A(plan.__kcalMenu > 800 && plan.__kcalMenu < 4000, 'kcalMenu razonable (' + plan.__kcalMenu + ')');
A(plan.__protMenu > 40, 'protMenu razonable (' + plan.__protMenu + ')');
console.log('menú de Ana: ~' + plan.__kcalMenu + ' kcal · ' + plan.__protMenu + ' g prot · objetivo ' + plan.NUTRI.fases[0].kcal + ' / ' + plan.META.perfil.proteinaDia);
console.log(process.exitCode ? 'CON FALLOS' : 'HUMO MATERIAL OK');
