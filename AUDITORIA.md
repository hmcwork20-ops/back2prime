# Auditoría técnica · BACK2PRIME v17

**Fecha:** 15 de agosto de 2026 · **Método:** medición en navegador (no inspección visual) · **Alcance:** las 5 vistas, el panel emergente y los 5 idiomas.

Este documento **no arregla nada**: mide y deja constancia. Las correcciones se deciden después.

---

## Estado de las correcciones · v18

Cerrados en la ronda del 15 de agosto (cada uno verificado midiendo, no mirando):

| | Hallazgo | Resultado medido |
|---|---|---|
| ✅ | P0 · Etiquetas de los botones de día | Vía capa `UI`: 910 → 913 claves en los 5 idiomas |
| ✅ | P1 · Diálogo modal | Nombre desde el `h2`, foco de ida y vuelta, Escape, fondo inerte por `z-index` |
| ✅ | P1 · 169 clicables no semánticos | **169 → 0** en las 5 vistas; 0 dianas < 44 px |
| ✅ | P1 · Inputs sin etiqueta | **Eran 5, no 2** → 0 en vistas, Ajustes y bienvenida |
| ✅ | P1 · 5 fallos de contraste | 0 fallos. Los 4 valores derivados, no elegidos |
| ✅ | P1 · Basecoat | Retirado: −213 KB, **0 diferencias de píxel** en las 5 vistas |
| ✅ | P1 · Idiomas precargados | −368 KB; se descargan al elegirlos y quedan en caché |

**Peso precargado: 1.511 KB → 944 KB (−37,5 %).**

Hallazgos **nuevos** que aparecieron al verificar y no estaban en este informe:

- El icono de Ajustes caía a **2,65:1** con el volt debajo (por debajo incluso del umbral de iconos). Mismo origen que la pestaña, misma cura.
- Las gráficas llevaban `#6B7480` **escrito a mano 13 veces**: corregir el token no las habría alcanzado. Ahora leen del token.
- `.card` heredaba de Basecoat `display:flex`, `gap:24px` y `font-size:14px` **sin que nadie lo hubiera escrito**. Retirarlo a ciegas habría descuadrado la app entera.

Pendientes: los cuatro P2 (iconos, gráficas sin nombre, `h1`, cambio de vista mudo) y el P3 del escritorio.

---

## Puntuación

| Dimensión | Nota | Resumen |
|---|---|---|
| Accesibilidad | **1**/4 | Un diálogo que se declara modal sin serlo, 169 controles no operables por teclado, 5 fallos de contraste |
| Rendimiento | **2**/4 | 1.511 KB precargados, de los que ~1.000 KB no se usan nunca |
| Responsive | **4**/4 | Cero desbordes de 320 a 1280, cero dianas bajo 44 px |
| Semántica | **2**/4 | Sin `h1` en 4 de 5 vistas, `td` y `div` haciendo de botón, cambio de ruta mudo |
| Robustez | **3**/4 | SW versionado, i18n validado en 3 capas, reduced-motion y fallback sin blur resueltos |
| **Total** | **12**/20 | |

### Integridad de la implementación

**La capa visual cumple el diseño; la capa accesible lo declara y no lo cumple.**

El caso que lo resume: el panel emergente lleva `role="dialog"` y `aria-modal="true"`, pero no tiene nombre, no mueve el foco, no cierra con Escape y no vuelve inerte el fondo. `aria-modal="true"` **oculta el resto de la página** a un lector de pantalla. Como el foco se queda fuera del panel, el usuario acaba en una página donde ya no hay nada que leer y sin forma de salir. Aquí el atributo declarado es **peor que no haberlo puesto**: sin él, al menos el fondo seguiría siendo legible.

Lo demás es coherente: lo que se prometió del responsive, del movimiento y del offline se cumple y se ha verificado.

---

## Hallazgos

### P0 · Los botones de día no tienen nombre

`assets/app.js:466` y `assets/app.js:468`

```js
'aria-label': '<'   // y '>'
```

Un lector de pantalla anuncia «menor que, botón» y «mayor que, botón». Antes decían «Día anterior» y «Día siguiente»: **lo rompí yo en el pase de `harden`**, sustituyendo las etiquetas por los glifos. Es una regresión propia y por eso encabeza la lista.

WCAG 4.1.2 Nombre, función, valor (A).

---

### P1 · El diálogo se declara modal sin la maquinaria de un modal

| Comprobación | Resultado |
|---|---|
| `role="dialog"` | ✅ |
| `aria-modal="true"` | ✅ |
| Nombre accesible | ❌ ninguno |
| El foco entra al abrir | ❌ se queda en `body` |
| Escape cierra | ❌ |
| Botón de cerrar | ❌ (solo tocar fuera o arrastrar) |
| Fondo inerte | ❌ |

Verificado en el fuente: en `app.js` + `views.js` **no existe ni un `Escape`, ni un `.focus()`, ni un `inert`**. El único `keydown` de todo el proyecto es el del chip de sugerencia de peso.

WCAG 2.1.2 (A), 2.4.3 (A), 4.1.2 (A).

---

### P1 · 169 elementos clicables que no son controles

| Vista | Cuántos | Qué son |
|---|---|---|
| Plan | 82 | `td` (abren la ficha del ejercicio) |
| Comida | 68 | 29 `div.shopitem`, 20 `td`, 10 `div.rec-card`, 9 `div.prep-step` |
| Hoy | 19 | 6 `div.exmain`, 6 `span.rest`, 4 `div.meal-row`, 3 `div.habit` |
| Progreso, Logros | 0 | — |

Ninguno es enfocable ni tiene `role`. Con teclado la app es inoperable en sus tres vistas principales: la lista de la compra, las fichas de ejercicio y el registro diario.

Nota de método: `[onclick]` no los encuentra porque los manejadores se atan con `addEventListener`. Se midieron instrumentando `EventTarget.prototype.addEventListener`.

WCAG 2.1.1 Teclado (A).

---

### P1 · Los dos campos de seguimiento corporal no tienen etiqueta

De los 8 `input` de HOY, 6 llevan `aria-label` correcto (`"Press banca · kg"`). Los dos que no son precisamente:

- **Peso en ayunas**
- **Cintura (lunes)** — la que el propio plan llama «la métrica reina»

Se anuncian como «campo de texto, en blanco». No tienen `placeholder` ni `<label>` asociado; el texto visible es un hermano, no una etiqueta.

WCAG 3.3.2 (A), 4.1.2 (A).

---

### P1 · Cinco fallos de contraste

Medidos resolviendo el color real sobre lienzo (`getComputedStyle` devuelve `color(srgb …)` y no sirve).

| Elemento | Ratio | Exige | |
|---|---|---|---|
| Pestaña inactiva sobre contenido volt | **1,83**:1 | 4,5:1 | ❌ |
| `.hs` sobre superficie 2 | **3,46**:1 | 4,5:1 | ❌ |
| Insignia bloqueada (opacidad .42) | **3,79**:1 | 4,5:1 | ❌ |
| `--ink3` sobre tarjeta | **3,80**:1 | 4,5:1 | ❌ |
| Etiquetas de las gráficas | **3,80**:1 | 4,5:1 | ❌ |
| Texto de cuerpo | 16,24:1 | 4,5:1 | ✅ |
| `--ink2` | 8,11:1 | 4,5:1 | ✅ |

Agravante: `--ink3` es el tono que lleva **la nota de seguridad de carga**. El texto que advierte sobre lesionarse es el que peor se lee.

WCAG 1.4.3 Contraste mínimo (AA).

---

### P1 · Basecoat: 213 KB para un 1,6 % de uso

De las **1.221 reglas** de `basecoat.min.css`, **20 casan con algún elemento** de la app. Es el 14 % del peso total a cambio del 1,6 % de utilidad, y encima es la fuente de las colisiones de clase que ya costaron el renombrado de `.badge` a `.b2-badge`.

---

### P1 · Se precargan 4 idiomas que nunca se leen

`sw.js` mete los cinco `data.<lang>.js` en `CORE` (~457 KB). Una instalación usa uno: **~366 KB muertos** en la caché desde el primer arranque.

Tiene una razón — permite cambiar de idioma sin cobertura — pero es una decisión que hoy no está escrita en ninguna parte y cuesta un cuarto del peso.

---

### P2 · Los iconos pesan 491 KB

`icon-512.png` 243 KB + `maskable-512.png` 248 KB. Son PNG generados con canvas, sin comprimir. Para un logo plano de dos colores es entre 15 y 30 veces lo razonable.

**Peso total precargado: 1.511 KB.** Aproximadamente **1.000 KB no se usan nunca** (Basecoat sin usar + 4 idiomas + exceso de iconos).

---

### P2 · Las 4 gráficas no tienen nombre accesible

`4/4` SVG con `role="img"` y sin `aria-label` ni `<title>`, y sin alternativa en tabla. Toda la vista Progreso es invisible para un lector de pantalla.

WCAG 1.1.1 (A).

---

### P2 · Sin `h1` en 4 de 5 vistas

| Vista | Jerarquía | `h1` |
|---|---|---|
| Hoy | `h1 > h2 > h2 > h2` | ✅ |
| Plan | `h2 > h2 > h2` | ❌ |
| Comida | `h2 > h2 > h2 > h3 ×10 > h2 ×4` | ❌ |
| Progreso | `h2 ×5` | ❌ |
| Logros | `h2 ×2` | ❌ |

No hay saltos de nivel (bien), pero cuatro vistas empiezan en `h2` sin que exista un `h1` que las cuelgue.

---

### P2 · El cambio de vista es mudo

Al navegar no se mueve el foco, no cambia el `<title>` y no hay región `aria-live`. Con lector de pantalla no hay forma de saber que la vista cambió.

WCAG 4.1.3 Mensajes de estado (AA).

---

### P3 · Sin ancho máximo en escritorio

A 1280 px el contenido ocupa 1265 px y la medida de línea llega a **~114 caracteres**, frente a los 45–75 recomendados. Es P3 a conciencia: la app es para el móvil y ahí funciona.

---

## Patrones de fondo

1. **El atributo sin la conducta.** `aria-modal` sin foco ni Escape, `role="img"` sin nombre. Se puso la marca ARIA y se dio por hecho el comportamiento. Es el patrón que más daño hace, porque parece resuelto en una revisión rápida.
2. **La accesibilidad se aplicó donde se tocó.** Los ejercicios de HOY tienen `aria-label` compuesto y `aria-pressed`; peso y cintura, que se escribieron en otro momento, no tienen nada. No fue una pasada sistemática sino un arreglo por zonas.
3. **`--ink3` está por debajo del umbral y se usa para lo importante.** No son cinco fallos sueltos: es un token mal calibrado que arrastra a todo lo que lo usa. Se arregla en el token, no en los cinco sitios.
4. **El peso viene de la opcionalidad.** Los cinco idiomas y Basecoat entero se cargan por si acaso. Ninguna de las dos decisiones está documentada.

---

## Lo que está bien

- **Responsive: impecable.** Cero desbordes horizontales en 320, 375, 768 y 1280 en las cinco vistas. El letterbox de iOS, que costó cinco iteraciones, está resuelto de raíz.
- **Dianas táctiles: cero por debajo de 44 px** en las cinco vistas, contando la ampliación por `::after`. El pase de `harden` aguanta la medición.
- **Movimiento reducido bien resuelto:** `*{animation:none;transition:none}` global, que es la forma segura y no la selectiva que siempre se deja algo.
- **Degradación sin `backdrop-filter`:** `@supports not` con superficies sólidas ya derivadas.
- **CSS disciplinado:** 629 líneas, **2 `!important`**, escala de `z-index` coherente (5→96).
- **i18n con red:** 908 rutas de clave por idioma y un validador de 3 capas (estructura, enumerados, marcadores) en `tools/validate_lang.js`.
- **Service worker versionado** con network-first en localhost.

---

## Qué haría después

| Orden | Comando | Cubre |
|---|---|---|
| 1 | `harden` | P0 (etiquetas de día), el diálogo completo, los 169 controles, peso y cintura |
| 2 | `colorize` o retoque de tokens | Recalibrar `--ink3` y los otros 4 contrastes |
| 3 | `optimize` | Basecoat, idiomas precargados, iconos |
| 4 | `clarify` | Lo que quedó abierto de la crítica: `descarga:true` de la semana 9, «Te faltan 100,0 kg», funciones vacías |

Lo de la semana 5 sigue sin decidir: hoy hay una tarea de revisión de salud justo en la semana en la que históricamente abandonas. Eso es una decisión de diseño, no un defecto medible, y necesita una respuesta tuya.
