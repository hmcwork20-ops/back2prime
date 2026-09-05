# Las suites de humo

```bash
npm test
```

Cinco suites que ejercitan el motor de verdad: generan planes completos y
comprueban el resultado. No son tests unitarios, son humo: no miran funciones
sueltas, miran que el plan que sale sea el que debe salir.

| Suite | Qué vigila |
|---|---|
| `material.js` | Bandas y banco por material, evento con fecha que manda sobre el plazo, desfase del menú |
| `menores.js` | Variedad del menú, duración anunciada, cardio con yoga |
| `patrones.js` | Los 13 patrones tienen salida en casa y a peso corporal, escalera de dificultad, 6 idiomas |
| `portugues.js` | Los seis idiomas generan un plan completo y resuelto |
| `inicio.js` | Cuándo arranca el plan: hoy, esta semana, el lunes, un día exacto |

## Por qué existen

El motor es determinista y tiene mucha superficie: material, lesiones, dieta,
duración, idioma, fecha de arranque. Un cambio en `eligeSub` o en `fechaInicio`
puede romper una combinación que nadie mira. Ya ha pasado: el filtro de material
dejaba pasar barras y poleas a los planes de casa en los cinco idiomas que no
eran español, y estuvo en producción hasta que una suite lo cazó.

## Cómo se escriben

Cada suite carga `assets/data.js` y `assets/gen.js` en un contexto de `vm`,
genera planes y afirma sobre el resultado. Sin dependencias, sin framework.

Dos reglas que valen más que el resto:

**Comprueba que la aserción caza el fallo.** Rompe a propósito lo que dices que
vigilas y mira que la suite falle. Una aserción que no falla nunca no vigila
nada, y da una confianza que es peor que no tener nada. `inicio.js` tiene una
aserción explícita para esto (la de «placebo»).

**Cada suite corre en su proceso.** Todas manosean `window.B2P` a gusto;
compartiendo proceso, lo que una ensucia se lo encuentra la siguiente y el fallo
aparece o desaparece según el orden.

## Cuándo pasarlas

Siempre que se toque `assets/gen.js` o `assets/data*.js`. Y antes de cualquier
publicación, junto con los validadores de idioma y el guardia de secretos:

```bash
npm test
node tools/validate_lang.js assets/data.en.js
npm run guardia
```
