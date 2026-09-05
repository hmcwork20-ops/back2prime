/* Lote compra: una lista para ir al super, no un volcado de las recetas.

   Lo que vigila, en el orden en que dolia:
   - cada producto aparece UNA vez en toda la lista (antes: el tomate salia
     en desayuno, comida y cena, y ademas como «tomate», «tomate en rodajas»
     y «tomate rallado»);
   - el nombre que se pinta es el del producto, sin palabras de preparacion
     (lo de «en rodajas» va en la receta, no en el carrito);
   - las cantidades se suman entre recetas y comidas, y si un producto llega
     en gramos y en piezas, se convierte a un solo numero;
   - lo de despensa (sal, especias, aceite...) sale una vez y sin cantidad;
   - nada se pierde: todo pid de toda receta del menu esta en la compra,
     incluida la toma pre-sueño, que antes ni entraba;
   - y los seis idiomas producen la misma lista (mismos pids, misma forma). */
const fs = require('fs'), vm = require('vm');
const A = (c, m) => { if (!c) { console.error('FALLO: ' + m); process.exitCode = 1; } };

function carga(lang) {
  const ctx = { window: {}, localStorage: { getItem: () => null, setItem: () => {} }, console };
  vm.createContext(ctx);
  const data = lang === 'es' ? 'assets/data.js' : 'assets/data.' + lang + '.js';
  for (const f of [data, 'assets/gen.js']) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });
  return { B: ctx.window.B2P, G: ctx.window.B2P_GEN };
}
const BASE = { sexo: 'h', edad: 34, alturaCm: 178, pesoKg: 84, cinturaCm: 92,
  objetivo: 'recomp', evento: 'siempre', inicio: 'hoy', duracionSem: 12, historial: 'retomador',
  diasSemana: 4, minSesion: 60, franja: 'tarde', material: 'gym',
  lesiones: [], medico: false, dieta: 'normal', sin: [], gustos: { like: [], no: [] } };

/* Palabras de PREPARACION, no de producto: «cocidas» (las legumbres se
   compran cocidas en bote) y «en polvo» (la proteina ES polvo) son nombres
   legitimos de lo que se compra, y no entran aqui. */
const PREP = /rodaja|picad|rallad|desmenuz|en dados|trocead|lamin|gajo|en tiras|\(del batch\)|\(parte de|asad[oa]s? /i;

const { B, G } = carga('es');
const plan = extra => G.generarPlan(Object.assign({}, BASE, extra), B);

for (const dieta of ['normal', 'vegetariano', 'vegano']) {
  const P = plan({ dieta });
  const C = P.COMPRA;
  const items = C.flatMap(g => g.items);
  const pids = items.map(it => it.pid);

  // --- 1. cada producto, una sola vez en TODA la lista ---
  const repetidos = pids.filter((p, i) => p && pids.indexOf(p) !== i);
  A(repetidos.length === 0, dieta + ': ningun producto repetido (' + [...new Set(repetidos)].join(', ') + ')');
  A(items.every(it => it.pid), dieta + ': toda linea de la compra lleva pid');

  // --- 2. el nombre es el del producto, sin preparacion ---
  const conPrep = items.filter(it => PREP.test(it.i));
  A(conPrep.length === 0, dieta + ': ningun nombre con palabra de preparacion (' + conPrep.map(it => it.i).join(' | ') + ')');
  const conParen = items.filter(it => /\(/.test(it.i));
  A(conParen.length === 0, dieta + ': ningun nombre con parentesis de receta (' + conParen.map(it => it.i).join(' | ') + ')');

  // --- 3. nada se pierde: todo pid de toda receta del menu esta en la compra ---
  const enMenu = new Set();
  P.MENU.forEach(f => ['de', 'co', 'ce'].forEach(sl => { if (f[sl] !== 'LIBRE') enMenu.add(f[sl]); }));
  const esperados = new Set();
  enMenu.forEach(id => { const r = B.RECETAS.find(x => x.id === id); (r.ing || []).forEach(ing => esperados.add(ing.pid)); });
  const perdidos = [...esperados].filter(p => !pids.includes(p));
  A(perdidos.length === 0, dieta + ': todo ingrediente del menu esta en la compra (faltan: ' + perdidos.join(', ') + ')');

  // --- 4. la toma pre-sueño entra, x7, con lo que toca a cada dieta ---
  const vetaLacteo = dieta === 'vegano';
  if (!vetaLacteo) {
    const skyr = items.find(it => it.pid === 'skyr');
    A(skyr && /kg|g/.test(skyr.q), dieta + ': el skyr de las 7 noches esta y en gramos (' + (skyr && skyr.q) + ')');
    A(pids.includes('whey'), dieta + ': el whey de la toma nocturna esta en la compra');
  } else {
    A(!pids.includes('skyr') && !pids.includes('whey'), 'vegano: ni skyr ni whey en la compra');
    A(pids.includes('yogur-soja') && pids.includes('prote-vegetal'), 'vegano: la toma nocturna vegana (yogur de soja + proteina vegetal) esta en la compra');
  }

  // --- 5. despensa: una linea, sin cantidad ---
  ['sal', 'especias', 'aove'].forEach(p => {
    const it = items.find(x => x.pid === p);
    if (it) { A(it.despensa === true, dieta + ': ' + p + ' marcado como despensa'); A(!it.q, dieta + ': ' + p + ' sin cantidad (' + it.q + ')'); }
  });
  const conMultiplicador = items.filter(it => /×\d/.test(it.q || ''));
  A(conMultiplicador.length === 0, dieta + ': ninguna cantidad tipo «al gusto ×7» (' + conMultiplicador.map(it => it.i + ' ' + it.q).join(' | ') + ')');

  // --- 6. gramos y piezas se funden en un numero, con ayuda al lado ---
  const tomate = items.find(it => it.pid === 'tomate');
  if (tomate) A(/\d[\d.,]*\s*(g|kg)\b/.test(tomate.q) && /\d+\s*ud/.test(tomate.q), dieta + ': el tomate suma gramos y piezas en un numero con las unidades al lado (' + tomate.q + ')');

  // --- 7. secciones del super, no comidas ---
  A(C.length >= 4, dieta + ': la compra va por secciones (' + C.map(g => g.cat).join(', ') + ')');
  A(C.every(g => g.sec && g.cat), dieta + ': cada seccion tiene clave y etiqueta');
  A(!C.some(g => /desayuno|comida|cena/i.test(g.cat)), dieta + ': ya no se agrupa por comida');
}

// --- 8. las cantidades escalan con las veces que sale la receta ---
{
  const P = plan({});
  const veces = {};
  P.MENU.forEach(f => ['de', 'co', 'ce'].forEach(sl => { veces[f[sl]] = (veces[f[sl]] || 0) + 1; }));
  const avena = P.COMPRA.flatMap(g => g.items).find(it => it.pid === 'avena');
  if (avena) {
    let g = 0;
    Object.keys(veces).forEach(id => { const r = B.RECETAS.find(x => x.id === id); if (!r) return;
      (r.ing || []).forEach(ing => { if (ing.pid === 'avena') g += parseFloat(ing.q) * veces[id]; }); });
    A(new RegExp('^' + g + ' g$').test(avena.q), 'la avena suma las veces que sale su receta: esperado ' + g + ' g, hay ' + avena.q);
  }
}

// --- 9. los seis idiomas dan la misma lista ---
/* Se compara el CONJUNTO de pids por seccion, no el orden: dentro de cada
   seccion se ordena alfabeticamente por el nombre en ese idioma, y el orden
   cambia de un idioma a otro a proposito. */
const firmaDe = C => C.map(g => g.sec + ':' + g.items.map(it => it.pid).sort().join(',')).join('|');
const ref = firmaDe(plan({}).COMPRA);
for (const L of ['en', 'fr', 'de', 'it', 'pt']) {
  const { B: Bl, G: Gl } = carga(L);
  const Cl = Gl.generarPlan(Object.assign({}, BASE), Bl).COMPRA;
  const firma = firmaDe(Cl);
  A(firma === ref, L + ': misma estructura de compra que el español');
  const nombres = Cl.flatMap(g => g.items).map(it => it.i);
  A(nombres.every(n => n && !/\{|\}/.test(n)), L + ': todos los productos tienen nombre');
}

// --- 10. placebo: la prueba distingue de verdad ---
/* Si el tomate no estuviera en el menu, las aserciones de gramos+piezas no
   comprobarian nada. Se exige que este, y si un dia deja de estar, que se
   sepa y se cambie el producto de referencia en vez de dejar la prueba muda. */
A(plan({}).COMPRA.flatMap(g => g.items).some(it => it.pid === 'tomate'), 'placebo: el tomate esta en el menu normal (si no, cambia el producto de referencia)');

const n = plan({}).COMPRA.flatMap(g => g.items).length;
console.log('  perfil normal: ' + n + ' productos en ' + plan({}).COMPRA.length + ' secciones');
if (!process.exitCode) console.log('HUMO COMPRA OK');
