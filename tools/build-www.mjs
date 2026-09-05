/* Prepara www/ para Capacitor.
   El proyecto no tiene bundler y no lo necesita: la "compilación" es copiar los
   ficheros que sirve GitHub Pages. Se hace en una carpeta aparte y no en la raíz
   porque Capacitor copia el webDir ENTERO al proyecto nativo, y la raíz lleva
   node_modules, android/, ios/ y .git.

   Lo que NO viaja a la app:
   - sw.js: dentro del contenedor los assets ya son locales. Un service worker
     cache-first sobre ellos solo añade una capa que puede servir una versión
     vieja tras actualizar desde la tienda.
   - tools/, *.md, .git, node_modules: no son la app.                        */
import { cp, rm, mkdir, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WWW = path.join(RAIZ, 'www');

const COPIAR = ['index.html', 'privacidad.html', 'clave.html', 'manifest.webmanifest', 'assets', 'icons'];

async function pesa(dir) {
  let total = 0, n = 0;
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { const r = await pesa(p); total += r.total; n += r.n; }
    else { total += (await stat(p)).size; n++; }
  }
  return { total, n };
}

await rm(WWW, { recursive: true, force: true });
await mkdir(WWW, { recursive: true });

for (const item of COPIAR) {
  const origen = path.join(RAIZ, item);
  if (!existsSync(origen)) { console.error('FALTA: ' + item); process.exit(1); }
  await cp(origen, path.join(WWW, item), { recursive: true });
}

// El make-icons.html es una herramienta de desarrollo, no parte de la app.
await rm(path.join(WWW, 'icons', 'make-icons.html'), { force: true });

const { total, n } = await pesa(WWW);
console.log('www/ listo: ' + n + ' ficheros · ' + (total / 1024 / 1024).toFixed(1) + ' MB');
