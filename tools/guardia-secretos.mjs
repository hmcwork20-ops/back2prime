/* Guardia de secretos: falla si una clave de API, token o clave privada
   aparece en el codigo que se publica. La regla de la casa es que los
   secretos viven en el servidor (o en los secretos del CI), jamas en el
   cliente: este script la convierte en una comprobacion que corre en cada
   build de CI y a mano con `npm run guardia`.

   Si algun dia hay un valor publico por diseno (p. ej. la anon key de
   Supabase, que es publica y se protege con RLS), se marca en su misma
   linea con el comentario `guardia:permitir` y se documenta al lado. */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Lo que viaja al usuario o al repo. node_modules y www/ (generado) no.
const DONDE = ['assets', 'icons', 'tools', 'index.html', 'sw.js', 'manifest.webmanifest',
  'capacitor.config.json', 'package.json', '.github',
  'android/app/src', 'ios/App/App'];
const EXT = new Set(['.js', '.mjs', '.html', '.json', '.webmanifest', '.yml', '.yaml',
  '.xml', '.plist', '.gradle', '.properties', '.java', '.swift', '.md', '.css', '.py']);

const PATRONES = [
  ['clave privada PEM', /-----BEGIN (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/],
  ['token de GitHub', /\bgh[pousr]_[A-Za-z0-9]{20,}\b/],
  ['clave estilo OpenAI/Stripe (sk-)', /\bsk-[A-Za-z0-9_-]{20,}\b/],
  ['clave de Google (AIza)', /\bAIza[0-9A-Za-z_-]{35}\b/],
  ['clave de AWS (AKIA)', /\bAKIA[0-9A-Z]{16}\b/],
  ['token de Slack', /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/],
  ['JWT incrustado', /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/],
  ['rol de servicio de Supabase', /service_role/],
  ['secreto asignado en claro', /(?:api[_-]?key|secret|password|contrasena)\s*[:=]\s*['"][A-Za-z0-9+/_-]{16,}['"]/i],
];

const hallazgos = [];

function mira(fichero) {
  const rel = path.relative(RAIZ, fichero).replace(/\\/g, '/');
  if (rel.includes('node_modules') || rel.startsWith('www/')) return;
  if (!EXT.has(path.extname(fichero))) return;
  let t;
  try { t = readFileSync(fichero, 'utf8'); } catch (e) { return; }
  const lineas = t.split('\n');
  lineas.forEach((linea, i) => {
    if (linea.includes('guardia:permitir')) return;         // excepcion documentada en la propia linea
    if (rel === 'tools/guardia-secretos.mjs') return;        // los patrones de este fichero no son secretos
    for (const [nombre, re] of PATRONES) {
      if (re.test(linea)) hallazgos.push(rel + ':' + (i + 1) + '  [' + nombre + ']  ' + linea.trim().slice(0, 90));
    }
  });
}

function recorre(ruta) {
  const st = statSync(ruta, { throwIfNoEntry: false });
  if (!st) return;
  if (st.isFile()) return mira(ruta);
  for (const e of readdirSync(ruta)) recorre(path.join(ruta, e));
}

for (const d of DONDE) recorre(path.join(RAIZ, d));

if (hallazgos.length) {
  console.error('GUARDIA DE SECRETOS: ' + hallazgos.length + ' hallazgo(s). Nada de esto puede publicarse:\n');
  hallazgos.forEach(h => console.error('  ' + h));
  console.error('\nSi un valor es publico por diseno, marca su linea con `guardia:permitir` y explica por que al lado.');
  process.exit(1);
}
console.log('guardia de secretos: limpio (' + DONDE.length + ' rutas revisadas)');
