# Pendientes

Anotado el 14 ago 2026, al cierre de la v12.

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

## 2 · Síntesis profunda del texto

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
