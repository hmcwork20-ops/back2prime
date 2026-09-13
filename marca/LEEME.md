# Marca

## Qué hay aquí

- **`imagotipo.svg`** — isotipo + logotipo, para fondo oscuro (letra `#F2F4F0`).
- **`imagotipo-claro.svg`** — el mismo, para fondo claro (letra `#0B0D10`).
- El **isotipo suelto** vive en `../icons/favicon.svg`: es el mismo anillo y el
  mismo monograma, sobre su placa oscura. Es lo que va en el icono de la app.

Los dos llevan la Barlow Condensed 700 incrustada en base64. Por eso pesan 31 KB
en vez de 1: a cambio, el fichero se basta solo y la marca sale igual en un
navegador, en Figma o en el visor de imágenes de cualquiera, sin instalar nada.
Fondo transparente los dos.

## Cuál usar

Manda el contraste, no el gusto: `imagotipo.svg` sobre fondos por debajo de
`#3A4048` aproximadamente, `imagotipo-claro.svg` por encima. El verde volt
(`#C8F24E`) no cambia nunca: es el mismo en las dos versiones y es lo que
identifica la marca de lejos.

En un recorte redondo (avatar de WhatsApp, Instagram, Slack) el imagotipo
horizontal se queda pequeño: el logotipo baja de tamaño legible en cuanto la
foto se ve a 50 px. Para eso va mejor el isotipo solo.

## De dónde salen las medidas

Los dos SVG, el favicon y el módulo `assets/marca.js` los escribe
`python tools/marca.py` a partir de `tools/marca-glifos.json` (la B y la P de
la Barlow Condensed 700 como trazados, sacadas con fontTools) y de la geometría
del 2-flecha que vive en ese script. No se editan a mano: si cambia algo,
cambia el script y vuelve a generar.

El monograma B2P va en un marco donde la altura de mayúscula es 100: la B en
x=0, el 2-flecha (la caja de A1 «Pulido» estilizada, 39×65 con trazo 10, un
12 % más alto que las mayúsculas y con la punta enrasada con la curva) con la
tinta de 73,7 a 145,3, y la P desde 155,3; huecos de 10 a cada lado del 2.
Dentro del anillo el monograma mide 32 de tinta sobre los 42 interiores.

En el logotipo, BACK y PRIME siguen siendo texto en Barlow Condensed 700
(incrustada) y el 2 es el mismo trazado con el trazo 11, un pelo más compacto:
BACK en x=85, la tinta del 2 desde 167,5 y PRIME en x=188,3.

El anillo y el destello (abajo a la izquierda, de 113° a 137° desde las 3 en
punto, en sentido horario, como arco explícito) son idénticos a los de
`icons/favicon.svg`: salen de la misma función.

## PNG

`imagotipo.png` e `imagotipo-claro.png` son el mismo dibujo rasterizado a 4×
(1148 × 288, fondo transparente) para donde no entra un SVG: correo, WhatsApp,
tiendas. Se regeneran desde los SVG; no se retocan a mano.
