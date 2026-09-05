/* ============================================================
   BACK2PRIME · lanza las cinco suites de humo y devuelve un solo veredicto.

   Existe para que probar sea un comando y no cinco: una suite que hay que
   acordarse de ejecutar es una suite que no se ejecuta. Con `npm test` no
   hay excusa, y el codigo de salida sirve para un hook o un CI el dia que
   haga falta.

   Cada suite corre en su propio proceso a proposito. Todas cargan data.js
   y gen.js en un contexto de vm y las manosean a gusto; compartiendo
   proceso, lo que una ensucia se lo encuentra la siguiente y el fallo
   aparece o desaparece segun el orden. Aisladas, lo que falla es lo que
   esta roto.
   ============================================================ */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..');

/* El orden va de lo general a lo concreto: si el motor esta roto de raiz,
   material falla primero y el resto es ruido. */
const SUITES = [
  ['material',  'bandas y banco, evento con fecha, desfase del menu'],
  ['menores',   'variedad del menu, duracion anunciada, cardio'],
  ['patrones',  'los 13 patrones en casa y a peso corporal, escalera de dificultad'],
  ['portugues', 'los seis idiomas generan plan completo'],
  ['inicio',    'cuando empieza el plan: hoy, semana, lunes, dia exacto'],
];

console.log('');
let fallos = 0;

for (const [nombre, que] of SUITES) {
  const t0 = Date.now();
  const r = spawnSync(process.execPath, [path.join(AQUI, nombre + '.js')], {
    cwd: RAIZ,            // las suites leen assets/*.js relativo a la raiz
    encoding: 'utf8',
  });
  const ms = Date.now() - t0;
  const salida = ((r.stdout || '') + (r.stderr || '')).trimEnd();
  const bien = r.status === 0;
  if (!bien) fallos++;

  console.log((bien ? '  OK   ' : '  FALLA') + '  ' + nombre.padEnd(10) + '  ' + que + '  (' + ms + ' ms)');
  /* En verde se resume; en rojo se enseña TODO, que es cuando hace falta. */
  if (!bien && salida) console.log(salida.split('\n').map(l => '         ' + l).join('\n'));
}

console.log('');
if (fallos) {
  console.log('  ' + fallos + ' de ' + SUITES.length + ' suites FALLAN');
  process.exit(1);
}
console.log('  las ' + SUITES.length + ' suites pasan');
