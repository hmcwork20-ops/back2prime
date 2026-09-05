/* Lote suplementos: la dieta declarada manda, y el ID manda sobre la foto.

   Nace de un fallo real: el motor cambiaba el titulo y el texto del
   suplemento proteico para veganos, pero heredaba el id 'whey'. Como la
   ficha busca su foto en assets/supl/<id>.webp, el resultado habria sido
   «proteina de guisante o soja» junto a un bote de suero de leche. No se
   veia porque aun no hay fotos de suplemento: habria aparecido el dia de
   generarlas, que es cuando ya nadie lo busca. */
const fs = require('fs'), vm = require('vm');
const ctx = { window: {}, localStorage: { getItem: () => null, setItem: () => {} }, console };
vm.createContext(ctx);
for (const f of ['assets/data.js', 'assets/gen.js']) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });
const B = ctx.window.B2P, G = ctx.window.B2P_GEN;
const A = (c, m) => { if (!c) { console.error('FALLO: ' + m); process.exitCode = 1; } };

const BASE = { sexo: 'h', edad: 34, alturaCm: 178, pesoKg: 84, cinturaCm: 92,
  objetivo: 'recomp', evento: 'siempre', duracionSem: 12, historial: 'retomador',
  diasSemana: 4, minSesion: 60, franja: 'tarde', material: 'gym',
  lesiones: [], medico: false, dieta: 'normal', sin: [], gustos: { like: [], no: [] } };
const con = extra => G.generarPlan(Object.assign({}, BASE, extra), B).NUTRI.suplementos;
const prote = sup => sup[1];

// --- 1. quien come de todo sigue viendo whey ---
const normal = prote(con({}));
A(normal.id === 'whey', 'dieta normal: el suplemento proteico sigue siendo whey (id=' + normal.id + ')');
A(/whey/i.test(normal.t), 'dieta normal: el titulo lo dice');

// --- 2. vegano e intolerante a la lactosa: cambia el TEXTO ---
['vegano'].forEach(d => {
  const s = prote(con({ dieta: d }));
  A(!/whey/i.test(s.t + ' ' + s.d), d + ': el texto ya no menciona whey');
  A(/vegetal|guisante|soja/i.test(s.t + ' ' + s.d), d + ': el texto ofrece proteina vegetal');
});
const lact = prote(con({ sin: ['lactosa'] }));
A(!/whey/i.test(lact.t + ' ' + lact.d), 'sin lactosa: el texto ya no menciona whey');

// --- 3. y cambia el ID, que es lo que decide la FOTO ---
/* Esta es la asercion que importa: sin ella, el fallo original pasaba
   inadvertido porque el texto ya estaba bien. */
['vegano'].forEach(d => {
  const s = prote(con({ dieta: d }));
  A(s.id !== 'whey', d + ': el id NO puede seguir siendo whey, la foto sale de ahi (id=' + s.id + ')');
  A(s.id === 'prote-vegetal', d + ': el id es prote-vegetal (id=' + s.id + ')');
});
A(lact.id === 'prote-vegetal', 'sin lactosa: el id tambien cambia (id=' + lact.id + ')');

// --- 4. el vegetariano SI puede tomar whey: no debe cambiarse ---
const veget = prote(con({ dieta: 'vegetariano' }));
A(veget.id === 'whey', 'vegetariano: el whey es lacteo pero no carne, se queda (id=' + veget.id + ')');

// --- 5. todos los suplementos tienen id y texto, sea cual sea la dieta ---
['normal', 'vegetariano', 'vegano'].forEach(d => {
  con({ dieta: d }).forEach((s, i) => {
    A(!!s.id, d + ': el suplemento ' + i + ' tiene id');
    A(!!s.t && !!s.d, d + ': el suplemento ' + i + ' tiene titulo y texto');
  });
});

// --- 6. cada id de suplemento tiene su prompt de imagen ---
/* Si el motor puede devolver un id, tools/productos.py tiene que saber
   generarle foto; si no, esa ficha se queda muda para siempre. */
const py = fs.readFileSync('tools/productos.py', 'utf8');
const bloque = py.slice(py.indexOf('SUPLEMENTOS = {'), py.indexOf('}', py.indexOf('SUPLEMENTOS = {')));
const ids = new Set();
['normal', 'vegetariano', 'vegano'].forEach(d => con({ dieta: d }).forEach(s => ids.add(s.id)));
con({ sin: ['lactosa'] }).forEach(s => ids.add(s.id));
[...ids].filter(id => id && id !== 'no').forEach(id => {
  A(bloque.includes("'" + id + "'"), 'productos.py tiene prompt para el suplemento ' + id);
});

console.log('  ids posibles: ' + [...ids].join(', '));
console.log('  normal=whey · vegetariano=whey · vegano y sin lactosa=prote-vegetal');
if (!process.exitCode) console.log('HUMO SUPLEMENTOS OK');
