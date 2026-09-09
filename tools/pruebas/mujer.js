/* Lote mujer: embarazo, posparto y ciclo menstrual.

   Tres cosas que el motor promete y que aqui se comprueban con fechas fijas
   (nada depende del dia en que corra la suite):

   · EMBARAZO: la semana de gestacion sale de la fecha probable de parto, las
     sesiones no llevan nada de lo que las guias sacan (boca arriba desde la
     16, saltos, flexion cargada, inversiones), el trote solo sigue en quien
     ya corria y hasta la 28, no hay deficit ni marcas, y la bascula tiene un
     corredor de GANANCIA (IOM 2009) en vez de uno de perdida.
   · POSPARTO: los tramos van por semanas desde el parto (dos mas con cesarea),
     el impacto no entra antes de la 12 ni sin la lista superada, y con
     lactancia el deficit espera a la semana 6, no pasa de 500 y respeta un
     suelo de 1.800 kcal.
   · CICLO: prediccion por mediana de los ultimos ciclos, ovulacion estimada
     hacia atras desde la regla prevista, sin prediccion con anticonceptivo
     hormonal ni con ciclos irregulares, y aviso a los 90 dias sin regla.

   Fuentes en el informe de evidencia (9-9-2026) y en los comentarios de gen.js. */
const fs = require('fs'), vm = require('vm');
const A = (c, m) => { if (!c) { console.error('FALLO: ' + m); process.exitCode = 1; } };

function carga(lang) {
  const ctx = { window: {}, localStorage: { getItem: () => null, setItem: () => {} }, console };
  vm.createContext(ctx);
  const data = lang === 'es' ? 'assets/data.js' : 'assets/data.' + lang + '.js';
  for (const f of [data, 'assets/gen.js']) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });
  return { B: ctx.window.B2P, G: ctx.window.B2P_GEN };
}
const { B, G } = carga('es');

const BASE = { sexo: 'm', edad: 32, alturaCm: 166, pesoKg: 64, cinturaCm: 78, objetivo: 'recomp', evento: 'siempre',
  duracionSem: 12, historial: 'retomador', diasSemana: 4, minSesion: 45, franja: 'manana', material: 'casa',
  lesiones: [], medico: false, dieta: 'normal', sin: [], gustos: { like: [], no: [] }, creado: '2026-09-09', inicio: 'hoy' };
const con = extra => G.generarPlan(Object.assign({}, BASE, extra), B);
const sesionesUsadas = P => { const u = new Set(); P.CAL.forEach(w => w.dias.forEach(x => { const s = typeof x === 'object' ? x.s : x; if (s && s !== 'libre') u.add(s); })); return [...u]; };
const fuerzasSemana = wk => wk.dias.filter(x => { const s = typeof x === 'object' ? x.s : x; return s && s !== 'libre' && (B.SESIONES[s] || {}).tipo === 'fuerza'; }).length;

// ===================== 1. embarazo =====================
{
  // cuestionario en la semana 12: la FPP sale de ahi y no se mueve
  const fpp = G.fppDe('2026-09-09', 12);
  A(fpp === '2027-03-24', 'fppDe: semana 12 el 9-9-2026 → FPP 24-3-2027 (da ' + fpp + ')');
  A(G.semanaGestacion(fpp, '2026-09-09') === 12 && G.semanaGestacion(fpp, '2026-12-01') === 24 && G.semanaGestacion(fpp, '2027-03-24') === 40,
    'semanaGestacion: 12 hoy, 24 el 1-12, 40 en la FPP');
  const E = con({ etapa: 'embarazo', fpp, pesoPre: 62 });
  A(E.META.etapa === 'embarazo' && E.META.gInicio === 12, 'META lleva la etapa y la semana de inicio');
  A(E.META.semanas === 28 && E.META.finISO <= fpp, 'el plan dura hasta la FPP sin pasarse (' + E.META.semanas + ' semanas, fin ' + E.META.finISO + ')');
  // fases por semana de gestacion, no por cortes del plan
  A(E.FASES.length === 4 && E.FASES[0].semanas.length === 2 && E.FASES[1].semanas.length === 14 && E.FASES[2].semanas.length === 9 && E.FASES[3].semanas.length === 3,
    'fases: 2 semanas de T1 (12-13), 14 de T2, 9 de T3 y 3 de recta final (' + E.FASES.map(f => f.semanas.length).join('/') + ')');
  A(E.CAL[0].g === 12 && E.CAL[9].g === 21 && E.CAL[19].g === 31, 'cada semana del calendario sabe su semana de gestacion');
  // nada prohibido, en ninguna sesion usada, y la plantilla de la fase que toca
  const malos = [];
  sesionesUsadas(E).forEach(sid => { const s = E.SESIONES[sid]; if (!s.bloques) return; const fase = +((/^emb(\d)/.exec(sid) || [])[1] || 3);
    s.bloques.forEach(b => { if (G.tocaEmbarazo(B, b.e, fase)) malos.push(sid + ':' + b.e); }); });
  A(malos.length === 0, 'ninguna sesion del embarazo lleva un ejercicio que su fase prohibe (' + malos.join(', ') + ')');
  A(E.CAL[0].dias[0] === 'emb1-a' && E.CAL[9].dias[0] === 'emb2-a' && E.CAL[19].dias[0] === 'emb3-a', 'la plantilla cambia con el trimestre');
  A(E.CAL.every(wk => fuerzasSemana(wk) <= 4), 'nunca mas de 4 sesiones de fuerza por semana');
  A(!E.CAL.some(wk => wk.descarga) && !Object.values(E.HITOS_SEMANA).some(h => h.tipo === 'descarga' || h.tipo === 'dietbreak' || h.tipo === 'cribado'),
    'sin descarga, diet break ni cribado: los hitos son los del embarazo');
  const hitosG = Object.keys(E.HITOS_SEMANA).map(w => E.CAL[w - 1].g).sort((a, b) => a - b);
  A(JSON.stringify(hitosG) === JSON.stringify([14, 16, 28, 36]), 'hitos en las semanas 14, 16, 28 y 36 de gestacion (' + hitosG.join(',') + ')');
  // sin trote salvo quien ya corria, y solo hasta la 28
  A(!sesionesUsadas(E).some(s => /^(wj|trote)/.test(s)), 'sin impacto: quien no corria no trota');
  const EA = con({ etapa: 'embarazo', fpp: G.fppDe('2026-09-09', 20), historial: 'activo', gustos: { like: ['dep:running'], no: [] } });
  A(EA.CAL[0].dias.includes('trote25') && !EA.CAL.filter(wk => wk.g >= 28).some(wk => wk.dias.includes('trote25')),
    'la que corria sigue trotando (test del habla) y pasa a caminar desde la semana 28');
  // deportes con contacto o caida, fuera del cardio libre
  const EP = con({ etapa: 'embarazo', fpp, gustos: { like: ['dep:padel', 'dep:futbol'], no: [] } });
  A(!sesionesUsadas(EP).includes('cardio-libre'), 'padel y futbol no fabrican un cardio libre en el embarazo');
  // calentamiento sin saltos, senales de las guias, suelo pelvico en el sitio del tendon
  A(!E.CALENTAMIENTO.pasos.some(s => /jumping/i.test(s)) && E.CALENTAMIENTO.pasos.length === 6, 'el calentamiento del embarazo no salta');
  A(E.SENALES === B.SENALES_EMB && E.TENDON.titulo === B.SUELO_PELVICO.titulo, 'senales de alarma y bloque de suelo pelvico propios');
  // nutricion: sin deficit, tramos EFSA, proteina sobre el peso previo
  A(JSON.stringify(E.NUTRI.filaDeFase) === '[0,1,2,2]', 'las fases leen la fila de su trimestre');
  const t = E.__mantenimiento;
  A(E.NUTRI.fases.every(f => f.kcal > 0) && E.NUTRI.fases[0].kcal >= E.__decisiones.find(x => x.k === 'kcal').v - E.__decisiones.find(x => x.k === 'kcal').delta + 65
    && E.NUTRI.fases[2].kcal - E.NUTRI.fases[0].kcal === 430, 'kcal: +70 / +260 / +500 sobre el gasto (T3 − T1 = 430; da ' + (E.NUTRI.fases[2].kcal - E.NUTRI.fases[0].kcal) + ')');
  A(E.NUTRI.fases[0].p === Math.round(62 * 1.4) && E.NUTRI.fases[2].p === Math.round(62 * 1.6), 'proteina 1,4 g/kg y 1,6 en el tercero, sobre 62 kg previos');
  A(E.NUTRI.suplementos.map(s => s.id).join(',') === 'folico,yodo,omega-3,vitamina-d,hierro,cafeina,no', 'suplementos del embarazo, sin creatina');
  A(/2,3 litros/.test(E.NUTRI.hidratacion) && /ninguno/.test(E.NUTRI.hidratacion), 'hidratacion del embarazo: agua y alcohol cero');
  // bascula: corredor de ganancia IOM sobre el peso previo; sin cintura, sin marcas
  A(E.META.pesoPre === 62 && E.META.imcPre === 22.5 && E.META.ganancia[0] === 11.5 && E.META.ganancia[1] === 16, 'IMC previo 22,5 → 11,5-16 kg (IOM 2009)');
  A(E.META.perfil.objetivoKg[0] === 73.5 && E.META.perfil.objetivoKg[1] === 78, 'objetivo de peso = peso previo + ganancia al termino');
  A(E.CHECKPOINTS.every(c => c.dir === 'sube' && c.rango[0] < c.rango[1] && c.rango[0] > 62), 'checkpoints de ganancia, crecientes');
  A(E.CHECKPOINTS[0].rango[0] < E.CHECKPOINTS[2].rango[0], 'el corredor sube con las semanas');
  A(E.META.perfil.cinturaMetaCm === null && !E.LOGROS.some(l => /^(kg-|kgup-|cint-|pr-)/.test(l.id) || l.id === 'dominada-libre'),
    'sin meta de cintura ni insignias de kilos, cintura, marcas o dominada');
  A(E.REGLAS.length === 8 && /11,5-16 kg/.test(E.REGLAS[7].d), 'las reglas son las del embarazo, con la ganancia real dentro');
  A(E.CIENCIA.temas.length === 4 && /0,62/.test(E.CIENCIA.temas[0].d), 'la ciencia es la del embarazo');
  A(E.__decisiones[0].k === 'etapa' && E.__decisiones[0].s === 12 && E.__decisiones.find(x => x.k === 'kcal').etapa === 'embarazo', 'el reveal recibe la etapa');
  // sin peso previo declarado, se estima descontando la ganancia esperada
  const E30 = con({ etapa: 'embarazo', fpp: G.fppDe('2026-09-09', 30) });
  A(E30.META.pesoPre > 50 && E30.META.pesoPre < 60 && E30.FASES[0].semanas.length === 0 && E30.FASES[2].semanas.length === 7,
    'semana 30 sin peso previo: se estima (' + E30.META.pesoPre + ') y las fases pasadas quedan vacias');
  A(E30.CAL[0].dias[0] === 'emb3-a' && E30.META.semanas === 10, 'en la semana 30 el plan arranca en la plantilla del tercer trimestre y dura hasta la FPP (' + E30.META.semanas + ')');
  // placebo: el mismo perfil SIN etapa usa lo que el embarazo prohibe
  const S = con({});
  const usaProhibido = sesionesUsadas(S).some(sid => (S.SESIONES[sid].bloques || []).some(b => G.tocaEmbarazo(B, b.e, 2)));
  A(usaProhibido && S.CALENTAMIENTO.pasos.some(s => /jumping/i.test(s)) && S.META.etapa === null,
    'placebo: el plan normal lleva boca arriba y saltos, y no tiene etapa');
}

// ===================== 2. posparto =====================
{
  // semana 1, cesarea, lactancia, quiere perder
  const P = con({ etapa: 'posparto', parto: '2026-09-02', partoTipo: 'cesarea', lactancia: true, objetivo: 'perder' });
  A(P.META.wpInicio === 1 && JSON.stringify(P.META.cortesPP) === '[4,8,14]', 'cesarea: cortes en 4, 8 y 14 semanas desde el parto');
  A(P.META.semanas === 25, 'plan hasta la semana 14 mas 12 de construccion = 25 (da ' + P.META.semanas + ')');
  A(P.FASES.map(f => f.semanas.length).join('/') === '3/4/6/12', 'fases: 3 + 4 + 6 + 12 semanas (' + P.FASES.map(f => f.semanas.length).join('/') + ')');
  A(P.CAL[0].dias.filter(x => x === 'pp-a').length === 3 && P.CAL[0].dias.includes('pp-paseo'), 'recuperacion: tres sesiones cortas y paseos');
  A(P.CAL[4].dias[0] === 'pp-b' && P.CAL[8].dias[0] === 'c-a' && P.CAL[14].dias[0] === 'torso-a', 'reconexion → circuitos → split del perfil');
  A(!sesionesUsadas(P).some(s => /^(wj|trote)/.test(s)), 'sin la lista superada no hay trote en todo el plan');
  const hitosWp = Object.keys(P.HITOS_SEMANA).map(w => P.CAL[w - 1].wp).sort((a, b) => a - b);
  A(JSON.stringify(hitosWp) === JSON.stringify([6, 8, 14]), 'hitos en las semanas 6 (revision), 8 (cicatriz) y 14 (impacto) desde el parto (' + hitosWp.join(',') + ')');
  // nutricion: lactancia +450, deficit desde la semana 6 y acotado a 500, proteina 1,6 g/kg
  const f = P.NUTRI.fases;
  A(JSON.stringify(P.NUTRI.filaDeFase) === '[0,0,1,2]' && f[0].kcal - f[1].kcal === 500, 'antes de la revision sin deficit; despues, 500 exactos (da ' + (f[0].kcal - f[1].kcal) + ')');
  A(f[0].kcal === P.__mantenimiento + 450 || Math.abs(f[0].kcal - (P.__mantenimiento + 450)) <= 100, 'la primera fila es el gasto mas 450 de lactancia (' + f[0].kcal + ' vs ' + P.__mantenimiento + ')');
  A(f.every(x => x.p === Math.round(64 * 1.6)), 'proteina 1,6 g/kg con lactancia');
  A(P.NUTRI.suplementos[0].id === 'yodo' && !P.NUTRI.suplementos.some(s => s.id === 'creatina'), 'suplementos de lactancia, sin creatina');
  A(P.TENDON.titulo === B.SUELO_PELVICO.titulo && P.SENALES === B.SENALES_PP && P.REGLAS.length === 8, 'suelo pelvico, senales y reglas del posparto');
  // suelo de 1.800 con lactancia
  const P50 = con({ etapa: 'posparto', parto: '2026-09-02', partoTipo: 'vaginal', lactancia: true, objetivo: 'perder', pesoKg: 50, alturaCm: 158, diasSemana: 2 });
  A(P50.NUTRI.fases.every(x => x.kcal >= 1800), 'con lactancia ninguna fila baja de 1.800 kcal (' + P50.NUTRI.fases.map(x => x.kcal).join('/') + ')');
  // parto vaginal: cortes 2/6/12; semana 20: plan normal, y el trote solo con la lista
  const PV = con({ etapa: 'posparto', parto: '2026-09-02', partoTipo: 'vaginal', lactancia: false });
  A(JSON.stringify(PV.META.cortesPP) === '[2,6,12]' && PV.META.semanas === 23, 'vaginal: cortes 2/6/12 y 23 semanas de plan');
  // a las 20 semanas, con ganas de correr: el plan normal, y el trote solo con la lista
  const corre = { like: ['dep:running'], no: [] };
  const P20 = con({ etapa: 'posparto', parto: '2026-04-22', partoTipo: 'vaginal', lactancia: false, objetivo: 'perder', gustos: corre });
  A(P20.META.semanas === 12 && P20.FASES[0].nombre === B.FASES[0].nombre, 'a las 20 semanas del parto el plan es el de siempre');
  A(!sesionesUsadas(P20).some(s => /^(wj|trote)/.test(s)) && P20.CAL[5].dias.includes('cam60'), 'sin lista superada, el cardio es caminar aunque el plan normal trotara');
  const P20ok = con({ etapa: 'posparto', parto: '2026-04-22', partoTipo: 'vaginal', lactancia: false, objetivo: 'perder', correrOk: true, gustos: corre });
  A(sesionesUsadas(P20ok).some(s => /^(wj|trote)/.test(s)), 'con la lista superada vuelve el trote');
  A(P20.NUTRI.fases[0].kcal === P20.__mantenimiento - 500 || P20.NUTRI.fases[0].kcal >= P20.__mantenimiento - 500, 'sin lactancia el deficit se acota a 500 (' + P20.NUTRI.fases[0].kcal + ' vs ' + P20.__mantenimiento + ')');
  A(P20ok.__decisiones[0].k === 'etapa' && P20ok.__decisiones[0].v === 'posparto', 'el reveal recibe el posparto');
}

// ===================== 3. ciclo =====================
{
  const c = (ciclo, inicios, hoy) => G.cicloEstado(ciclo, inicios, hoy);
  const base = { modo: 'natural', ultima: '2026-08-20', dur: 28 };
  A(c(base, [], '2026-09-09').dia === 21 && c(base, [], '2026-09-09').fase === 'lutea' && c(base, [], '2026-09-09').proxima === '2026-09-17', 'dia 21 de 28: lutea, regla prevista el 17-9');
  A(c(base, [], '2026-08-22').fase === 'regla' && c(base, [], '2026-09-02').fase === 'ovulatoria' && c(base, [], '2026-08-28').fase === 'folicular' && c(base, [], '2026-09-14').fase === 'premenstrual',
    'fases por dia: regla (3), folicular (9), ovulatoria (14 = 28−14), premenstrual (26)');
  // con registros, manda la mediana de los ultimos ciclos y la ovulacion se mueve con ella
  const conLogs = c({ modo: 'natural', ultima: '2026-05-01', dur: 28 }, ['2026-05-30', '2026-06-27', '2026-07-26', '2026-08-24'], '2026-09-09');
  A(conLogs.dur === 29 && conLogs.ciclos === 4 && conLogs.proxima === '2026-09-22' && conLogs.margen === 2, 'cuatro ciclos de 29: prediccion el 22-9 con ±2');
  A(c({ modo: 'natural', ultima: '2026-05-01', dur: 28 }, ['2026-05-30', '2026-06-27', '2026-07-26', '2026-08-24'], '2026-09-08').fase === 'ovulatoria', 'con ciclo de 29 la ovulacion estimada es el dia 15, no el 14');
  // irregular: no se predice
  const irr = c({ modo: 'natural', ultima: '2026-05-01' }, ['2026-05-22', '2026-06-28', '2026-07-20', '2026-08-30'], '2026-09-09');
  A(irr.irregular === true && irr.margen >= 5, 'mas de 9 dias de variacion: irregular, sin prediccion util');
  // sin regla 90 dias, hormonal, sin regla
  const s90 = c({ modo: 'natural', ultima: '2026-05-01', dur: 28 }, [], '2026-09-09');
  A(s90.sinRegla90 === true && s90.fase === 'retraso', 'mas de 90 dias sin regla: aviso');
  A(c({ modo: 'hormonal' }, [], '2026-09-09').modo === 'hormonal' && c({ modo: 'sin' }, [], '2026-09-09') === null && c({ modo: 'no' }, [], '2026-09-09') === null && c(null, [], '2026-09-09') === null,
    'hormonal sin fases; «sin regla», «no» y sin ciclo → nada');
  // la ultima regla registrada manda sobre la declarada
  A(c({ modo: 'natural', ultima: '2026-08-01', dur: 28 }, ['2026-08-29'], '2026-09-09').dia === 12, 'un registro posterior a la fecha declarada es el nuevo dia 1');
  // placebo: sin registro ni fecha no hay dia
  A(c({ modo: 'natural' }, [], '2026-09-09').sinDatos === true, 'placebo: sin fecha ni registros no se inventa un dia');
}

// ===================== 4. los seis idiomas generan las tres etapas =====================
for (const L of ['en', 'fr', 'de', 'it', 'pt']) {
  const o = carga(L);
  const fpp = o.G.fppDe('2026-09-09', 12);
  const E = o.G.generarPlan(Object.assign({}, BASE, { etapa: 'embarazo', fpp, pesoPre: 62 }), o.B);
  const P = o.G.generarPlan(Object.assign({}, BASE, { etapa: 'posparto', parto: '2026-09-02', partoTipo: 'cesarea', lactancia: true }), o.B);
  A(E.SESIONES['emb1-a'] && E.SESIONES['emb1-a'].bloques.every(b => o.B.EJERCICIOS[b.e]) && E.FASES[0].nombre !== B.FASES[0].nombre,
    L + ': el embarazo genera con sus sesiones, ejercicios y fases (' + (E.SESIONES['emb1-a'] ? 'ok' : 'sin emb1-a') + ')');
  A(P.SESIONES['pp-a'] && P.TENDON.titulo && o.B.UI.cuest.etapaT && o.B.UI.gen.ciclo && o.B.UI.mujer,
    L + ': el posparto genera y los textos del cuestionario, el ciclo y HOY existen');
  A(E.CAL[0].dias[0] === 'emb1-a' && E.META.semanas === 28 && P.META.semanas === 25, L + ': mismos calendarios que el español');
}

if (!process.exitCode) console.log('HUMO MUJER OK');
