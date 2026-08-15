# BACK2PRIME

Web-app personal (PWA) para un plan de recomposición corporal de 12 semanas: entrenos, nutrición, seguimiento diario y logros. Contenido revisado contra evidencia científica (metaanálisis y ensayos 2010-2025).

**5 idiomas**: español (por defecto), English, français, Deutsch e italiano — selector con banderas en Ajustes. Cada idioma es un `assets/data.<lang>.js` completo (contenido + interfaz) que sustituye a `window.B2P`; `index.html` carga el elegido antes de `app.js` y el cambio recarga la app.

**100% estática y privada**: los datos que registras viven solo en `localStorage` de tu dispositivo. No hay backend, ni cuentas, ni analítica. Copia de seguridad manual desde Ajustes (exportar/importar JSON).

## Uso

Publicada con GitHub Pages. En el móvil: abrir la URL → Compartir → **Añadir a pantalla de inicio** → se instala como app (funciona offline gracias al service worker).

Para desarrollo local: cualquier servidor estático, p. ej. `python -m http.server 8641` en esta carpeta. En localhost el service worker es network-first para no pelearte con la caché.

Truco de pruebas: añade `?d=2026-09-04` a la URL para simular cualquier fecha del plan.

## Estructura

```
index.html            shell (header, tabs, overlays)
assets/data.js        TODO el contenido del plan (fases, sesiones, fichas, nutrición, logros)
assets/app.js         núcleo: estado, calendario, vista HOY, timer, rachas, motor de logros
assets/views.js       vistas Plan / Comida / Progreso (SVG a mano) / Logros
assets/styles.css     capa propia (dark-first, mobile-first) sobre Basecoat
assets/basecoat.min.css  Basecoat CSS (shadcn portado a HTML puro)
assets/fonts/         Barlow Condensed (estructura) + Public Sans (prosa), autoalojadas (offline)
sw.js                 service worker cache-first (network-first en localhost)
manifest.webmanifest  metadatos PWA
icons/                favicon + iconos PWA (make-icons.html es el taller que los genera)
```

## Ideas de diseño

- Los colores de fase siguen el código de **discos olímpicos**: 10 kg verde, 15 amarillo, 20 azul, 25 rojo. Completar una fase desbloquea su disco.
- La progresión doble está automatizada: si completaste todas las reps limpias, la app te sugiere +2,5 kg (+5 en sentadilla y rumano); si marcaste «reps a medias», te pide repetir peso.
- Las gráficas son SVG artesanales mono-serie con banda de corredor esperado, anotación del agua de la creatina y alertas según las reglas del plan.

Aviso: esta app no sustituye consejo médico.
