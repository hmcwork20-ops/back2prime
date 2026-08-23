# REVAMP · de plan personal a producto

**La respuesta primero: el revamp y el producto del cuestionario son el mismo
proyecto.** La puerta de entrada es un cuestionario tipo Tinder que genera tu
plan; la piel pasa de contar a mostrar. Tres fases construibles hoy sin
backend, y un aparcadero explícito para lo que sí lo necesita.

Situación: la app funciona, está auditada (12/12 hallazgos cerrados) y pesa
493 KB. Complicación: tiene 30.951 caracteres de prosa visible y 0 imágenes
—para el gran público parece complicada— y todo el contenido está calculado
para una sola persona. Decidido el 22-ago: cada usuario responde y recibe su
plan.

Se conserva: el nombre, la oferta (entreno + dieta con recetas + progreso +
logros), el Liquid Glass y la privacidad (datos solo en el dispositivo).

---

## Fase 1 · La puerta: cuestionario modo Tinder

Un mazo de tarjetas de cristal; desliza derecha = me gusta, izquierda = no.
Responde en 2-3 minutos lo que un formulario pregunta en 15 pantallas.

**Qué se pregunta con swipe** (gustos, una idea por tarjeta):
ejercicios (¿burpees? ¿correr? ¿pesas?), deportes (calistenia, yoga, pádel),
comidas mostradas como foto (aquí muere la aceituna).

**Qué NO se pregunta con swipe** (datos, no gustos): cuerpo (sexo, edad,
altura, peso, cintura), objetivo y evento (boda, oposición, bikini, siempre),
días/horas disponibles y franja, material (nada / casa / gym), duración
(3/6/12 meses o always-on), historial (nunca / retomador / activo — la
variable que más cambia el plan), lesiones, intolerancias y dieta
(vegetariano, gluten…). Van en pasos normales con selectores grandes.

**Reglas de la skill de UX que lo gobiernan**: swipe con botones visibles
equivalentes (`gesture-alternative`), pista de gesto la primera vez
(`swipe-clarity`), indicador de progreso + atrás + saltar
(`multi-step-progress`, `User Freedom`), borrador autoguardado
(`form-autosave`), nada que ya hayas respondido se repite (`redundant-entry`).

**La física ya existe**: velocidad en ventana de 90 ms, proyección de
inercia y resistencia en límites se construyeron para la hoja inferior (v24).
El mazo las reutiliza; sale un prototipo funcional, no una maqueta.

**Hecho en v29**: el motor vive en assets/gen.js y corre en el arranque: si
hay perfil guardado, sustituye window.B2P entero antes de que la app lo lea.
Banco de pruebas en Node con 4 perfiles (numeros a mano, calendario, subs,
menu, puertas). Desde v30 el recetario tiene 22 recetas (12 nuevas, veganas salvo una,
todas sin gluten/lactosa/frutos secos) etiquetadas con slot y tags
independientes del idioma: cualquier dieta del cuestionario sale con menu
completo y 0 avisos en los 5 idiomas. Desde v31 la lista de la compra y el meal prep tambien se derivan del menu
generado: cantidades sumadas por repeticion y pasos del domingo solo de las
recetas batch.
Antes de v30: con 10 recetas, dietas restrictivas se quedaban
sin alternativas — se cuenta y se avisa en COMIDA; el recetario ampliado es el
siguiente contenido a producir.

**Salida**: un objeto `perfil` → `generarPlan(perfil)` devuelve el mismo
contrato que hoy exporta `data.js`. El mecanismo está demostrado: el sistema
de idiomas ya sustituye `window.B2P` entero. Motor determinista, sin IA en
los números (reglas Mifflin-St Jeor, déficit acotado, cargas al 50% de
marcas, protocolo tendón para retomadores). Puertas duras tipo PAR-Q (el cuestionario
estándar de aptitud para el ejercicio) que derivan a un profesional: menores,
embarazo, trastornos de conducta alimentaria, cardiopatía, índice de masa
corporal extremo.

## Fase 2 · La piel: mostrar, no contar

| Pieza | Hoy | Pasa a |
|---|---|---|
| Ejercicios | ficha de texto | **Hecho en v32**: mapa muscular SVG dibujado por código (frente y espalda, 15 regiones, claves `mm` neutras en los 5 idiomas) en ficha, biblioteca (40 px) y cartas del mazo. Pendiente: pictograma del patrón de movimiento |
| Recetas | lista de texto | **Hecho en v35**: foto en tarjeta, ficha y HOY (22 WebP de ~50 KB, carga perezosa, fuera del precache) |
| Progreso | números | **Hecho en v36**: la barra del plan (un disco por fase, el actual se llena con tu adherencia) + tres anillos Fuerza/Peso/Cintura |
| Hoy | lista | tablero de tarjetas: sesión, comida, hábitos como anillos |
| Iconos | emoji (hábitos, discos, banderas) | set SVG único, un solo grosor de trazo (`no-emoji-icons`) |
| Técnica | texto | enlaces a vídeo (0 KB); clips propios después |

Presupuesto de peso: precarga ≤ 600 KB; las fotos van con carga perezosa y
NUNCA al precache del service worker.

## Fase 3 · El texto: sintetizar y resincronizar

Con la piel visual, la prosa baja de contar todo a titular + desplegable.
Objetivo −40% de caracteres visibles (30.951 → ~18.000): CIENCIA −25% (la
mejor candidata, 10,3% del total), EJERCICIOS y RECETAS a esquema. Los textos
personalizados («50% de tus 95») pasan a plantillas con marcadores, como ya
se hizo con la capa UI. Congelar el modelo de contenido ANTES de tocar los 4
idiomas: cada cadena española tocada se resincroniza una sola vez (validador
de 925 rutas listo).

---

## Aparcadero: necesita backend o decisión de negocio

| Idea (de tu lista) | Qué le falta |
|---|---|
| Comunidad (gymbro, muro, volley), Playtomic | cuentas + moderación |
| Health/Fitness API, smartwatch | no accesible desde web: Capacitor |
| Push (racha en riesgo, X días sin cumplir) | servicio de push; en local solo aviso al abrir |
| Cesta automática (supermercado/delivery) | v1 posible con enlaces profundos; API después |
| Freemium, memberships (ejercicios/comidas/ambos) | pagos + cuentas; choca con «datos solo en tu móvil»: decidir postura antes |
| Ads (higgsfield: bodas, oposiciones, bikini) | son ángulos de campaña, no features; después de tener producto |
| Blog / SEO | páginas estáticas: se puede ya, es contenido, no código |

Legal (ya anotado en PENDIENTES): dietista-nutricionista es profesión
regulada en España; asesoría antes de cobrar, disclaimers, puertas de
exclusión.

## Pipeline de ejecución con las skills

| Fase | Skills |
|---|---|
| Diseñar cada superficie | impeccable `shape` → construir |
| Evaluar | impeccable `critique` (agentes duales) → `audit` (medición) |
| Rematar | `polish` + `harden` (i18n, errores) + emil-design-eng + apple-design (movimiento del mazo) |
| Copy | c-level en todo el texto de la app y del cuestionario |
| Gráficas nuevas | dataviz (validador de paleta incluido) |

Cada fase termina desplegada y probada en tu móvil antes de abrir la
siguiente.

## Decisiones tomadas (22 ago 2026)

1. **Primero el cuestionario** (Fase 1). Flujo completo en `#/quiz` desde la
   v28: 14 pasos de datos (una pregunta por pantalla, borrador autoguardado,
   validación con aviso, puerta dura tipo PAR-Q que deriva a un profesional)
   → mazo de 30 gustos → resumen que guarda `S.perfil`, el contrato de
   `generarPlan()`. El mazo: 30 tarjetas en tres bloques (ejercicios,
   deportes, comidas), swipe con física completa, botones equivalentes,
   deshacer, saltar y persistencia en `S.ui.quiz`.
2. **Imagen híbrida**: SVG propio para ejercicios (mapa muscular), foto IA solo
   en platos, con carga perezosa y fuera del precache.
