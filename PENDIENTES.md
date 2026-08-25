# Pendientes

Anotado el 14 ago 2026, al cierre de la v12.
Ampliado el 15 ago 2026, al cierre de la auditoría (v22).
Reordenado el 24 ago 2026, tras el critique dual (28/40) y el pivote a producto.

> **Pivote (24 ago 2026).** La app ya no enseña ningún plan de serie: alta local
> → cuestionario obligatorio → reveal → tour (v43). Todo el mundo — el autor
> incluido — pasa por el mismo embudo. El plan base de `data.js` queda como
> semilla del motor, nunca como vista.

## Estado del ciclo de arreglos del critique (24 ago 2026)

Hecho:
- **v43 — Puerta de entrada** (P0 + pico-final + puerta médica): alta local con
  nombre e idioma, quiz forzado, gate médica inmediata con pausa honesta,
  REVEAL con las decisiones del motor (`__decisiones`), tour de 5 paradas.
- **v44 — Superficies del dueño → perfil** (P1 contradicción): checkpoints,
  fotos, corredor de la gráfica de peso, meta de cintura (mitad de estatura si
  no se declaró), regla 4 y ciencia con `{p}`, título de carrera, escalera de
  logros a medida (bajada/subida) y logros de cintura generados, sin marcas del
  dueño, aviso legal neutro, fechas de preplan/plan/check de salida del plan
  generado, `histRetoma` y logros sin género marcado.

- **v45 — Motor cableado** (P2 + decisión «cablear las cuatro»): `duracionSem`
  real (12/24/48; 0 = bloque de 12 renovable) con fases, calendario, hitos,
  checkpoints, nutrición y gráficas escalados; `minSesion` recorta bloques y la
  duración anunciada dice la verdad; `franja` ordena la comida del día;
  `evento` en el reveal; mazo y recetario filtrados por dieta (`recetaVale`
  exportado); likes de deporte → sesión «Cardio: {deportes}»; `esBW` vivo
  (sin campo kg en peso corporal); toma nocturna vegetal para vegano/sin
  lactosa; diet break solo si el plan recorta, en su semana y a su kcal.

- **v46 — Menores del critique**: etiquetas de 10,5→11 px (5 selectores),
  `.cuest-bar` anima transform, em-dashes de prosa fuera (los «—» de dato
  vacío se quedan: son convención, no prosa), «Borrar todos» se desarma solo a
  los 4 s, cartas del mazo sin taxonomía entre paréntesis, el mazo retoma
  donde ibas (no finge 0/30), y Ajustes estrena «Crear / rehacer mi plan».
  El aviso de re-mapeo del import ya no aplica: la copia lleva el perfil y el
  plan regenerado es idéntico.

Ciclo del critique CERRADO (24 ago 2026).

## Ronda 2 (25 ago 2026), tras el re-critique (25 → 28 → 27, con perfil de
## hallazgos nuevo: los 9 problemas de las rondas previas quedaron resueltos)

- **v48 — Progreso direccional + estado robusto** (P0 + 2×P1): alertas por el
  corredor del perfil (bajar/subir/mantener) con textos propios; listener de
  `storage` (dos pestañas ya no se machacan los datos); reveal sin mentiras
  (sustituciones del calendario real, redondeo a 25, recetario con descartes);
  sin insignias de cintura para quien gana sin declararla; recorte a 30′
  conserva `elev-talones`; activos al trote desde el día 1; reps de semanas 3+
  heredan la última definida + nota de progresión en circuitos.
- **v49 — Rehacer con memoria + micro**: cuestionario prefill desde el perfil
  con Cerrar visible; mazo intercalado; resumen etiquetado; «Ganado +x»;
  insignias de checkpoint con semana real; vitrina al día al entrar; kcal de
  Comida por fase real; tipografía (11 px, 1.3, 10, .tw, 16 px, 44 px).
- **v50 — LA PROSA obedece al perfil** (P1 grande, decidido «variantes
  completas»): reglas 1/8, intro y temas de Ciencia (con temas propios por
  historial y «Superávit que construye»), nombres y objetivos de fase, cierre
  por objetivo con fecha real (+ renovación en bloques sin fecha y botón
  «Crear / rehacer mi plan» en Plan completado), «El plato» y el suplemento
  proteico por dieta, «De dónde salen los números» y el ritmo esperado por
  dirección con el corredor real, Caminar-trotar sin semanas del dueño,
  hábito de proteína con {q}, protocolo rotuliano de F1 solo para quien
  vuelve o empieza. ~220 cadenas nuevas ×5 idiomas (1.382 rutas validadas).

Quedan anotados (menores de la ronda 2, sin hacer): compra por pasillo en
planes generados, rotación de desayunos que favorece al plato original,
«fases» con periodización real de volumen/reps (pregunta provocadora 2).

> **Marco de trabajo (15 ago 2026).** La app se construye para **cualquier
> persona**, aunque de momento los únicos datos cargados sean los del autor.
> Consecuencia práctica: no se diseña nada a partir de un historial personal.
> Se descartó por eso una intervención de retención en la semana 5 que la
> crítica proponía sobre la premisa —falsa— de que fuera su semana de abandono.
> El cribado de salud se queda donde está: es sensato antes de la Fase 3 para
> cualquiera que lleve años parado. Esto refuerza el punto 2 (producto).

---

## Decisiones ya tomadas (15 ago 2026), para no reabrirlas

- **Descarga de la semana 9**: se queda como está. La dosis muestra la mitad de
  series marcada («2×8 · descarga»), coherente con el banner.
- **+119 px de scroll en HOY**: aprobado. Es el precio de que el nombre del
  ejercicio pase de 21 a 44 px de zona táctil.

---

## 1 · Añadir portugués

Mismo proceso y mismas validaciones que inglés, francés, alemán e italiano.

**Decisión previa**: por defecto **portugués de Portugal (pt-PT)**, para ser coherente con el resto (inglés británico, francés de Francia, italiano). Si se prefiere pt-BR, cambiar solo el encargo del traductor; el resto es idéntico.

**Checklist**

1. `assets/data.pt.js` — traducción completa de `assets/data.js` (contenido + interfaz), estructura idéntica: mismas claves, ids, números y fechas; solo cambian los valores de texto.
   - `UI.lang: 'pt'`, `UI.dias` = segunda-feira…domingo, `UI.meses` = jan…dez.
   - Comas decimales en prosa (portugués las usa). Terminología de gimnasio nativa: *Supino reto*, *Levantamento terra romeno*, *Agachamento com barra*, *Puxada alta*, *Elevações* (dominadas).
   - **Crítico**: no traducir los valores de los que depende la lógica — `tipo` (`fuerza`/`cardio`/`libre`), `icono` (`walk`/`run`/`rest`), `zona` (`empuje`/`tiron`/`pierna`/`core`), `tendon` (`rodilla`), los ids de receta de `MENU` y el centinela `'LIBRE'`. Sus versiones visibles viven en `UI.zonas` y `UI.comidaLibreMn`.
2. `index.html` — añadir `'pt'` a la lista blanca del cargador de idioma.
3. `assets/app.js` — añadir `['pt', '🇵🇹', 'Português']` a la constante `IDIOMAS`.
4. `sw.js` — añadir `'./assets/data.pt.js'` a `CORE` y subir la versión `V`.
5. `assets/styles.css` — `.langrow` está a 5 columnas; con 6 idiomas pasar a 3×2 (`repeat(3, minmax(0,1fr))`).
6. **Validar** (las dos, hasta que pasen):
   ```
   node --check assets/data.pt.js
   node tools/validate_lang.js assets/data.pt.js
   ```
7. Probar el cambio de idioma en la preview (tocando la bandera, no forzando `localStorage`) y desplegar.

---

## 2 · Convertirlo en producto: cuestionario → plan generado

**Decidido el 22 ago 2026: esto deja de ser una idea y pasa a ser la dirección
del proyecto.** La app no debe seguir basada en los datos de una sola persona;
cada quien la abre, responde un cuestionario y se le configura su plan. Se hará
más adelante, pero todo lo que se toque desde ahora debería ir en esa dirección.

### Qué hay hoy metido a fuego (inventario, para cuando toque)

No son solo constantes: **la prosa también está personalizada**, y eso es lo que
más trabajo dará.

| Dónde | Qué es personal |
|---|---|
| `META.inicioISO` / `finISO` | fechas fijas del bloque de 12 semanas |
| `META.perfil` | peso de salida 95,1 · altura 183 · objetivo 86-88 kg · cintura meta 91 · grasa estimada · proteína/día 190 |
| `HISTORICO` | las dos marcas previas (banca 95×8, sentadilla 100×8) de las que cuelga todo |
| `ARRANQUE` | cargas de las semanas 3-5, derivadas al 50% de esas marcas |
| `NUTRI` | kcal y macros por fase, calculados sobre ese cuerpo |
| **Textos** | escritos en segunda persona citando sus números: «50% de tus 95», «≈45% de tu banca antigua». Hay que convertirlos en plantillas con marcadores, como ya se hizo con `UI` |

El mecanismo para sustituirlo **ya está demostrado**: el sistema de idiomas
reemplaza `window.B2P` entero por otro objeto de la misma forma. Un plan
generado es exactamente el mismo mecanismo, con `generarPlan(perfil)` en vez de
un fichero por idioma. Ojo al cruce: el plan generado y los 5-6 idiomas se
multiplican entre sí.

---

### Notas originales (14 ago 2026)

Sacarlo como app y monetizarlo: cada usuario responde un cuestionario y se le genera su plan de entreno y alimentación, como el que se hizo a mano aquí.

**Veredicto: viable.** El plan original no fue creativo, fue la aplicación de reglas (Mifflin-St Jeor, déficit acotado a 550-700 kcal, pérdida al 0,7% del peso/semana, proteína a 2,5 g/kg de masa magra, cargas de arranque al 50% de la marca previa, protocolo de tendón por ser retomador). Todo eso es parametrizable.

### El cambio de arquitectura

`data.js` deja de ser una constante y pasa a ser `generarPlan(perfil) → { FASES, SESIONES, EJERCICIOS, NUTRI, RECETAS… }`.

**Ya está demostrado que la app lo aguanta**: el sistema de idiomas de la v12 sustituye `window.B2P` entero por otro objeto de la misma forma y todo se adapta solo. Un plan generado es el mismo mecanismo.

Se reutiliza tal cual (>40% del producto, y la parte pulida): las 5 vistas, registro diario, progresión doble, gráficas, logros, cristal, PWA, los 5-6 idiomas.

### Decisión clave: motor de reglas, NO IA

Los números los calcula un motor determinista: reproducible, auditable, testeable, gratis, offline y sin riesgo de alucinar un déficit peligroso. La IA, si acaso, solo en la capa de redacción (tono de los textos), **nunca en los números**.

Hace falta ampliar contenido con atributos: base de ejercicios (~150-200, etiquetados por patrón de movimiento, material, nivel, estrés articular, alternativas) y recetario (~60, filtrable por alergias, vegetariano, tiempo de cocina y macros).

### El cuestionario

Cuerpo (sexo, edad, altura, peso, cintura) · objetivo y plazo · **historial** (nunca ha entrenado / retomador / entrena ahora — la variable que más cambia el plan) · disponibilidad (días, duración, franja) · material (nada / casa básico / gimnasio) · lesiones y patologías · comida (alergias, intolerancias, vegetariano, aversiones, tiempo de cocina) · marcas previas opcionales para calibrar cargas.

**Puertas duras que NO generan plan y derivan a un profesional** (tipo PAR-Q+): menores, embarazo, historial de TCA, patología cardíaca, IMC extremo.

### Infraestructura y monetización

Empezar **sin backend**: el generador corre en el navegador y los datos no salen del dispositivo — cero infraestructura y se evita que los datos de salud entren en el artículo 9 del RGPD (categoría especial). Para las tiendas, envolver con **Capacitor** (ya usado en el proyecto de visitas territoriales).

Modelos: pago único · freemium (generar gratis, cobrar seguimiento y adaptación) · suscripción (exige backend y valor recurrente real) · **white-label a gimnasios y entrenadores**, probablemente el más rentable y el menos saturado.

### Lo que de verdad decide si gana dinero: el nicho

El mercado de fitness genérico está saturado. La ventaja diferencial ya está en el ADN del plan: *«el que vuelve no es un novato — el tendón marca el ritmo»*. Perfil de 35-45 años que hizo deporte, lleva años parado y vuelve. Hoy las apps o lo tratan como principiante (se aburre) o le dejan entrenar como antes (se lesiona). **Posicionar el producto explícitamente ahí.**

### Riesgos

1. **Legal**: en España el dietista-nutricionista es profesión regulada; dar dietas individualizadas es terreno delicado. Asesoría antes de cobrar, disclaimer serio y las puertas de exclusión.
2. **Contenido**: pasar de 50 a ~200 ejercicios y de 10 a ~60 recetas con macros fiables es trabajo real y hay que revisarlo con un profesional.
3. **Mantenimiento**: 6 idiomas × contenido generado, cada cambio se multiplica.

### Primer paso (antes de escribir código)

Coger **5 conocidos con perfiles distintos**, pasarles el cuestionario en papel y generar sus planes a mano. Si las reglas aguantan cinco perfiles reales, el motor es correcto; si no, ahí se ve qué falta — y cuesta una tarde en vez de tres meses.

---

## 3 · Síntesis profunda del texto

El repaso del 13 ago redujo la prosa visible un **1,1%** (331 caracteres de 31.282); tocó 11 de 362 cadenas, con recortes reales del 21-26% en las 7 más densas. La ortografía y el español de España sí se revisaron por completo.

**Dónde queda margen** (prosa visible, 30.951 car.):

| Sección | % | Comentario |
|---|---|---|
| EJERCICIOS | 35,1% | Se leen de una en una. Recortar cuesta detalle técnico. Poco valor. |
| RECETAS | 10,9% | Igual: se abren de una en una. |
| **CIENCIA** | **10,3%** | **La mejor candidata**: 10 bloques de ~280 car. de lectura corrida. ~−25% viable. |
| NUTRI | 7,7% | Alguna cadena larga (`NUTRI.escalado`, 301 car.). |
| resto | 36% | Ya podado donde se lee seguido. |

**Coste añadido desde la v12**: cada cadena española que se toque hay que re-sincronizarla en los ficheros de los demás idiomas, o quedan desfasados.

Para medir de nuevo antes y después, comparar con la versión previa del fichero:
`git show <commit>:assets/data.js` y contar caracteres de las cadenas comunes (excluyendo `UI.`, que se añadió en la v12).
