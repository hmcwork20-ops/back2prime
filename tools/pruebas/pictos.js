/* Lote pictos: el dibujo de la fila dice «esto es lo que haces».

   Lo reporto un usuario: encima de sus FLEXIONES aparecia un press de banca
   con su barra. La causa: el pictograma es del PATRON de movimiento (empuje
   horizontal), y el patron se dibuja con el material tipico de ese patron. En
   la ficha eso es honesto —lleva al lado el rotulo «Empuje horizontal»—, pero
   en la fila de la sesion el dibujo se lee como el ejercicio, y una barra que
   no tienes es una promesa falsa. Pasaba en 9 de los 15 ejercicios de suelo, y
   tambien con bandas: el remo se dibuja con barra olimpica.

   La regla (gen.js · pictoDeFila): pictograma propio si lo hay; si no, el del
   patron, y solo mientras no dibuje MAS material del que el ejercicio pide.
   Vive en gen.js y no en app.js para poder probarla sin navegador. */
const fs = require('fs'), vm = require('vm');
const A = (c, m) => { if (!c) { console.error('FALLO: ' + m); process.exitCode = 1; } };

function carga(lang) {
  const ctx = { window: {}, localStorage: { getItem: () => null, setItem: () => {} }, console };
  vm.createContext(ctx);
  const data = lang === 'es' ? 'assets/data.js' : 'assets/data.' + lang + '.js';
  for (const f of [data, 'assets/gen.js', 'assets/pictos.js']) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });
  return { B: ctx.window.B2P, G: ctx.window.B2P_GEN, P: ctx.window.B2P_PICTOS || [], N: ctx.window.B2P_PICTOS_NIV || {} };
}
const { B, G, P, N } = carga('es');
const NIV = { nada: 0, casa: 1, gym: 2 };
const picto = id => G.pictoDeFila(B, id, P, N);
const pide = id => G.equipoValeId(B, id, 'nada') ? 0 : G.equipoValeId(B, id, 'casa') ? 1 : 2;

// --- 1. el manifiesto declara cuanto material dibuja cada pictograma ---
A(Object.keys(N).length > 0, 'el manifiesto publica B2P_PICTOS_NIV (regenera con tools/pictos.py)');
A(P.every(k => N[k] !== undefined), 'todo pictograma del manifiesto declara su nivel (' + P.filter(k => N[k] === undefined).join(', ') + ')');
A(Object.values(N).every(v => v in NIV), 'los niveles son nada/casa/gym');

// --- 2. a nadie se le pinta mas material del que su ejercicio pide ---
const ids = Object.keys(B.EJERCICIOS);
const mienten = ids.filter(id => { const c = picto(id); return c && NIV[N[c]] > pide(id); });
A(mienten.length === 0, 'ningun ejercicio recibe un pictograma con mas material del que pide ('
  + mienten.map(id => id + '→' + picto(id)).join(', ') + ')');

// --- 3. y el que tiene dibujo propio, lo usa ---
/* Los 29 que se dibujaron a proposito: todo ejercicio de suelo, de banda, de
   toalla o de mochila tiene el suyo. La lista puede crecer; lo que no puede es
   encoger sin querer, que es como se colo el press de banca. */
const PROPIO = {
  'flexiones': 'flexiones', 'flexion-declinada': 'flexiones', 'flexion-diamante': 'flexiones',
  'sentadilla-pc': 'sentadilla-pc', 'pistol-asistida': 'sentadilla-pc',
  'puente-gluteo': 'puente', 'puente-1p': 'puente',
  'zancada-alterna': 'zancada-pc', 'zancada-bulgara-pc': 'zancada-pc',
  'banda-remo': 'banda', 'banda-jalon': 'banda', 'banda-rotacion': 'banda',
  'banda-abduccion': 'banda', 'ext-triceps-banda': 'banda',
  /* y los 15 que heredaban una barra o una polea: su clave es su propio id */
  'remo-toalla': 'remo-toalla', 'remo-mesa': 'remo-mesa', 'jalon-toalla': 'jalon-toalla',
  'pike-flexiones': 'pike-flexiones', 'pino-pared': 'pino-pared', 'elev-laterales': 'elev-laterales',
  'fondos-silla': 'fondos-silla', 'press-frances-mc': 'press-frances-mc', 'rdl-1p': 'rdl-1p',
  'curl-mochila': 'curl-mochila', 'curl-toalla': 'curl-toalla', 'abduccion-lado': 'abduccion-lado',
  'elev-y-suelo': 'elev-y-suelo', 'curl-nordico': 'curl-nordico', 'encogimiento-mochila': 'encogimiento-mochila'
};
for (const [id, pic] of Object.entries(PROPIO)) {
  A(B.EJERCICIOS[id], 'existe el ejercicio ' + id);
  A((B.EJERCICIOS[id] || {}).pic === pic, id + ' declara pic «' + pic + '» (tiene: ' + (B.EJERCICIOS[id] || {}).pic + ')');
  /* Mientras el .webp no este generado, el manifiesto no lo lista y la regla
     cae al del patron: null si ese dibuja de mas (un hueco es mejor que un
     dibujo falso), y si no, el del patron, que al menos no promete material
     que no hay. En cuanto exista la imagen propia, tiene que salir ESA. */
  if (P.includes(pic)) A(picto(id) === pic, id + ' usa su pictograma propio (usa: ' + picto(id) + ')');
  else A(picto(id) === null || NIV[N[picto(id)]] <= pide(id),
    id + ': sin imagen propia, el sustituto no puede pedir mas material (da: ' + picto(id) + ')');
}

// --- 4. lo de gimnasio no pierde su dibujo ---
const gym = ids.filter(id => pide(id) === 2);
const sinDibujo = gym.filter(id => !picto(id));
A(sinDibujo.length === 0, 'los ejercicios de gimnasio conservan su pictograma (' + sinDibujo.join(', ') + ')');

// --- 5. el pictograma no depende del idioma ---
/* `pic` y `pat` son claves, no texto: los seis idiomas deben pintar lo mismo.
   Antes de la tabla por id, el filtro de material leia el campo `equipo`, que
   SI se traduce, y en ingles dejaba pasar barras a un plan de casa. */
const firma = ids.map(id => id + ':' + picto(id)).join('|');
for (const L of ['en', 'fr', 'de', 'it', 'pt']) {
  const o = carga(L);
  const f = Object.keys(o.B.EJERCICIOS).map(id => id + ':' + o.G.pictoDeFila(o.B, id, o.P, o.N)).join('|');
  A(f === firma, L + ': mismos pictogramas que el espanol');
}

// --- 6. placebo: la regla sigue viva aunque ya no le toque descartar nada ---
/* Los 34 ejercicios tienen ya su dibujo propio, asi que la regla no le quita
   el suyo a nadie: no hay ningun caso real que observar. Se comprueba sobre
   uno construido — unas flexiones a las que se les borra el `pic` — porque la
   regla sigue haciendo falta el dia que se anada un ejercicio sin pictograma o
   alguien retire uno. La trampa no ha desaparecido: el patron de las flexiones
   es «eh», que se dibuja con barra y banco. */
const pat = B.EJERCICIOS['flexiones'].pat;
A(NIV[N[pat]] > pide('flexiones'), 'placebo: el patron de las flexiones sigue dibujando material (' + pat + ')');
const sinPic = { EJERCICIOS: Object.assign({}, B.EJERCICIOS,
  { flexiones: Object.assign({}, B.EJERCICIOS['flexiones'], { pic: undefined }) }) };
A(G.pictoDeFila(sinPic, 'flexiones', P, N) === null,
  'placebo: sin dibujo propio, las flexiones NO reciben el press de banca (dan: ' + G.pictoDeFila(sinPic, 'flexiones', P, N) + ')');
A(picto('press-banca') === pat, 'placebo: y ese mismo dibujo SI se pinta para quien tiene el material (press-banca → ' + picto('press-banca') + ')');

const conDibujo = ids.filter(id => picto(id)).length;
console.log('  ' + ids.length + ' ejercicios · ' + P.length + ' pictogramas · ' + conDibujo + ' filas con dibujo'
  + (conDibujo === ids.length ? ' (todas)' : ' · ' + (ids.length - conDibujo) + ' sin dibujo'));
if (!process.exitCode) console.log('HUMO PICTOS OK');
