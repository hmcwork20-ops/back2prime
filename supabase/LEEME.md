# Encender la nube (Supabase)

Todo el código de la app ya está preparado. Mientras `assets/nube-config.js`
tenga los dos valores a `null`, la app funciona en modo local puro (como
siempre) y no hace ni una llamada de red. Al rellenarlos, la cuenta pasa a ser
obligatoria y el estado vive en la nube.

## Los pasos, en orden

**1. Crear el proyecto.** En `supabase.com` → New project. El plan gratuito
sobra para empezar (500 MB de base de datos, 50.000 usuarios activos al mes).
Elige región de la UE (p. ej. Frankfurt): tus usuarios son europeos y esto es
lo correcto también de cara a RGPD. Apunta la contraseña de la base de datos
donde guardes las demás — no hace falta a diario, pero la pedirá alguna vez.

En el apartado *Security* de esa misma pantalla:

| Opción | Cómo | Por qué |
|---|---|---|
| Enable Data API | marcada | Es por donde habla `supabase-js` |
| Automatically expose new tables | **desmarcada** | Una tabla nueva no debe quedar expuesta sola: los permisos los da la migración, uno a uno |
| Enable automatic RLS | **marcada** | Red de seguridad: si algún día se crea una tabla y se olvida activarle RLS, se activa sola |

**2. Ejecutar la migración.** Panel → SQL Editor → pegar entero el contenido de
`supabase/migracion-0001.sql` → Run. Crea las dos tablas, las políticas RLS
(cada uno solo lo suyo), las funciones del plan compartido y las estadísticas
anónimas, el borrado de cuenta y el freno de escrituras. Es idempotente:
ejecutarla dos veces no rompe nada.

**3. Ajustar la autenticación.** Panel → Authentication:

- *Sign In / Up → Email*: activado (viene así).
- *Confirm email*: decide. Activado = más fricción pero sin cuentas con
  correos ajenos; desactivado = entrar a la primera. Para arrancar,
  desactivado es razonable; actívalo cuando haya tráfico real.
- *URL Configuration → Site URL*: `https://back2prime.app/`
  (y en *Redirect URLs*, `https://back2prime.app/**`. Este es el destino
  de los enlaces de confirmar cuenta y de cambiar contraseña: si se queda
  apuntando al dominio viejo, los correos llevan a un 404.)
- El enlace de recuperar contraseña va a `https://back2prime.app/clave.html`,
  que es una página propia y no una pantalla de la app: pesa 200 KB en vez
  de 3 MB y no compite con el router de hash. Lo fija `redirectTo` desde
  `nube.js`, así que basta con que `Redirect URLs` cubra el dominio con `/**`.
- El de confirmar el correo va a `https://back2prime.app/confirmado.html`, por
  lo mismo: en la raíz la persona aterrizaba en la puerta de entrada sin que
  nada le dijera que había confirmado. Lo fija `emailRedirectTo` en el alta.
  (imprescindible para que el enlace de «olvidé la contraseña» vuelva a la app).
- *Rate limits*: revisa la pestaña — Supabase ya trae límites de serie para
  envío de correos, intentos de login y refrescos de token. Los valores por
  defecto valen; súbelos solo si algún día un usuario legítimo se topa con
  ellos. Del lado de datos, el freno está en la base (dos escrituras del
  estado a menos de 2 s se rechazan) y el cliente agrupa a una subida cada
  20 s.

**4. Pegar las señas en la app.** Panel → Settings → API:

- *Project URL* → `url` en `assets/nube-config.js`
- *anon public* → `anon` en el mismo fichero, y en esa línea añade al final
  el comentario `// guardia:permitir — anon key: pública por diseño, la
  seguridad la ponen las políticas RLS`

Sin ese comentario, el guardián de secretos tumbará el build a propósito:
la anon key es un JWT y los caza todos.

**5. Desplegar y probar.** `git push` (Pages) y `npm run sync` (apps). La
prueba de fuego, en dos navegadores distintos:

- crear cuenta en uno, rellenar el cuestionario, marcar algo en HOY;
- entrar con la misma cuenta en el otro: debe aparecer el mismo plan;
- y el candado de verdad: en las DevTools de un navegador logueado, pedir
  `estados` sin filtro (la API REST) debe devolver SOLO tu fila. Eso es la
  RLS trabajando.

## Qué puede ver cada cual (decidido y aplicado)

| Quién | Qué ve | Cómo se garantiza |
|---|---|---|
| Un usuario | Solo su fila de `estados` | Política RLS por `user_id` en las cuatro operaciones |
| Un usuario | Números agregados (cuántos, cuántos activos) | La función `estadisticas()` devuelve totales, nunca filas |
| Cualquiera con un enlace compartido | El resumen que el dueño publicó | `planes_compartidos` no tiene política de SELECT: la única lectura es la función por token exacto |
| Nadie | El estado, peso o correo de otro | No existe ninguna ruta: ni URL, ni API a mano, ni token adivinable (12 bytes aleatorios) |

## Las reglas de la casa que esto materializa

- **Claves**: la anon key es pública por diseño y viaja en el cliente; la de
  servicio no existe fuera del panel. El guardián de secretos rompe el build
  si alguna clave real aparece en el código.
- **Límites**: los de auth los pone Supabase; los de datos, el freno en la
  base + la subida agrupada del cliente. Un bucle con un bug se estrella
  contra el freno del servidor en vez de machacar la base de datos.
- **Validación**: el servidor no se fía del cliente — tamaño máximo del
  estado (1 MB) y del plan compartido (64 KB) como restricción de la tabla,
  reloj monótono, y token saneado antes de tocar la RPC.
