/* Lote «cuándo empiezo»: la fecha de arranque sale del cuestionario, el lunes
   queda de reserva, y un perfil viejo sin la pregunta sigue funcionando. */
const fs = require('fs'), vm = require('vm');
const ctx = { window: {}, localStorage: { getItem: () => null, setItem: () => {} }, console };
vm.createContext(ctx);
for (const f of ['assets/data.js', 'assets/gen.js']) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });
const B = ctx.window.B2P, G = ctx.window.B2P_GEN;
const A = (c, m) => { if (!c) { console.error('FALLO: ' + m); process.exitCode = 1; } };

const pad = n => String(n).padStart(2, '0');
const iso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const mas = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

const hoy = new Date(); hoy.setHours(12, 0, 0, 0);
const HOY = iso(hoy);
const dow = (hoy.getDay() + 6) % 7;                       // 0 = lunes
const lunesQueViene = iso(mas(hoy, dow === 0 ? 7 : 7 - dow));

const BASE = { sexo: 'h', edad: 34, alturaCm: 178, pesoKg: 84, cinturaCm: 92,
  objetivo: 'recomp', evento: 'siempre', duracionSem: 12, historial: 'retomador',
  diasSemana: 4, minSesion: 60, franja: 'tarde', material: 'gym',
  lesiones: [], medico: false, dieta: 'normal', sin: [], gustos: { like: [], no: [] } };
const con = extra => G.generarPlan(Object.assign({}, BASE, extra), B);

// --- 1. las cuatro respuestas ---
A(con({ inicio: 'hoy' }).META.inicioISO === HOY, 'hoy: arranca hoy');
A(con({ inicio: 'lunes' }).META.inicioISO === lunesQueViene, 'lunes: arranca el lunes que viene');

const finDeSemana = iso(mas(hoy, dow === 6 ? 0 : 6 - dow));   // domingo de esta semana
A(con({ inicio: 'semana', inicioFecha: finDeSemana }).META.inicioISO === finDeSemana,
  'esta semana: arranca el dia elegido (' + finDeSemana + ')');

const dentroDe40 = iso(mas(hoy, 40));
A(con({ inicio: 'exacto', inicioFecha: dentroDe40 }).META.inicioISO === dentroDe40,
  'dia concreto: arranca el dia elegido (' + dentroDe40 + ')');

// --- 2. compatibilidad: un perfil de antes de esta pregunta no se rompe ---
const viejo = con({});
A(viejo.META.inicioISO === lunesQueViene, 'perfil sin la pregunta: sigue siendo el lunes que viene');
A(viejo.CAL.length === 12 && viejo.SESIONES && Object.keys(viejo.SESIONES).length > 0,
  'perfil sin la pregunta: plan completo igualmente');

// --- 3. una fecha ya pasada NO arranca el plan en el pasado ---
const ayer = iso(mas(hoy, -1));
A(con({ inicio: 'exacto', inicioFecha: ayer }).META.inicioISO === lunesQueViene,
  'fecha pasada: se ignora y cae al lunes');
A(con({ inicio: 'semana', inicioFecha: iso(mas(hoy, -3)) }).META.inicioISO === lunesQueViene,
  'fecha pasada en modo semana: tambien cae al lunes');
// basura en el campo tampoco tumba nada
A(con({ inicio: 'exacto', inicioFecha: 'no-es-una-fecha' }).META.inicioISO === lunesQueViene,
  'fecha ilegible: cae al lunes sin romperse');
A(con({ inicio: 'exacto' }).META.inicioISO === lunesQueViene, 'sin fecha elegida: cae al lunes');

// --- 4. el plan entero se mueve con la fecha, no solo la etiqueta ---
[['hoy', HOY], ['exacto', dentroDe40]].forEach(par => {
  const p = par[0] === 'hoy' ? con({ inicio: 'hoy' }) : con({ inicio: 'exacto', inicioFecha: par[1] });
  const ini = new Date(par[1] + 'T12:00:00');
  const finEsperado = iso(mas(ini, p.META.semanas * 7 - 1));
  A(p.META.inicioISO === par[1], par[0] + ': META.inicioISO');
  A(p.META.finISO === finEsperado, par[0] + ': el final se corre con el arranque (' + p.META.finISO + ' vs ' + finEsperado + ')');
  A(p.CAL.length === p.META.semanas, par[0] + ': el calendario tiene las semanas del plan');
});

// --- 5. arrancar a mitad de semana no descuadra la semana 1 ---
/* La app cuenta semanas desde el arranque, sea el dia que sea, y coloca las
   sesiones por dia real de la semana. Empezando un miercoles, la semana 1 va
   de miercoles a martes y debe seguir teniendo los mismos entrenos. */
const miercoles = (() => { const x = new Date(hoy); while (((x.getDay() + 6) % 7) !== 2) x.setDate(x.getDate() + 1); return iso(x); })();
const pMie = con({ inicio: 'exacto', inicioFecha: miercoles });
const pLun = con({ inicio: 'lunes' });
const cuenta = p => p.CAL[0].dias.filter(x => { const s = typeof x === 'object' ? x.s : x; return s && s !== 'libre'; }).length;
A(cuenta(pMie) === cuenta(pLun),
  'arranque a mitad de semana: la semana 1 conserva los entrenos (' + cuenta(pMie) + ' vs ' + cuenta(pLun) + ')');

// --- 6. el evento cuenta sus semanas desde el arranque REAL ---
const bodaEn = iso(mas(hoy, 7 * 20));
const pEv = con({ inicio: 'hoy', evento: 'boda', eventoFecha: bodaEn });
const semEsperadas = Math.round((new Date(bodaEn + 'T12:00:00') - hoy) / (7 * 864e5));
A(pEv.META.semanas === semEsperadas,
  'evento: las semanas se cuentan desde el arranque elegido (' + pEv.META.semanas + ' vs ' + semEsperadas + ')');

// --- 7. placebo: la prueba distingue de verdad ---
/* Si «hoy» y «lunes» cayeran en el mismo dia, las aserciones de arriba
   pasarian sin comprobar nada. Solo puede coincidir si hoy ES lunes, y ni
   asi: proximoLunes salta siete dias. */
A(HOY !== lunesQueViene, 'placebo: hoy y el lunes que viene son fechas distintas');

console.log('  hoy=' + HOY + '  lunes=' + lunesQueViene + '  domingo=' + finDeSemana);
console.log('  cuatro respuestas, perfil viejo, fecha pasada, fecha ilegible y evento: correctos');
if (!process.exitCode) console.log('HUMO INICIO OK');
