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

Las posiciones del logotipo no están puestas a ojo: son los anchos reales de los
glifos de la Barlow Condensed 700, leídos de la fuente. `BACK` mide 76,28 a
cuerpo 40; el `2` mide 19,71 a cuerpo 45; `PRIME` mide 86,08. Con el
interletraje de 1,2 px salen las x de cada bloque. Si algún día se cambia la
tipografía hay que recalcularlas, no moverlas hasta que cuadre.

El anillo y el monograma son copia literal de `icons/favicon.svg`, desplazados
4 unidades para centrarlos en la caja de 72 de alto. No se tocan: si cambia el
icono de la app, cambia aquí igual.

El destello del anillo va abajo a la izquierda (de 113° a 137° desde las 3 en
punto, en sentido horario) y está dibujado como arco explícito, no como trazo
discontinuo desplazado: el `stroke-dashoffset` negativo no lo pintan igual todos
los visores y el arco sí.

## PNG

`imagotipo.png` e `imagotipo-claro.png` son el mismo dibujo rasterizado a 4×
(1148 × 288, fondo transparente) para donde no entra un SVG: correo, WhatsApp,
tiendas. Se regeneran desde los SVG; no se retocan a mano.
