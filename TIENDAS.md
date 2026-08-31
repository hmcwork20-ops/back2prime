# Publicar BACK2PRIME en las tiendas

La app de tienda es la misma web, envuelta con Capacitor. No hay dos códigos:
lo que se arregla en `assets/` llega a las tres superficies (web, Android, iOS).

## El ciclo de trabajo

```bash
npm run build     # copia index.html, assets/, icons/ y el manifest a www/
npm run sync      # build + cap sync: lleva www/ y los plugins a android/ e ios/
npm run android   # sync + abre el proyecto en Android Studio
npm run ios       # sync + abre el proyecto en Xcode (solo en macOS)
```

`www/` se genera y no se versiona. `android/` e `ios/` sí: llevan permisos,
iconos y configuración de firma, y sin ellos el build no es reproducible.

Los iconos y splash nativos se regeneran así, partiendo de `icons/icon-512.png`:

```bash
python tools/assets-nativos.py
npx @capacitor/assets generate --assetPath resources --iconBackgroundColor '#0B0D10' --iconBackgroundColorDark '#0B0D10' --splashBackgroundColor '#0B0D10' --splashBackgroundColorDark '#0B0D10'
```

## Lo que falta, por plataforma

### Android — se puede hacer entero desde este Windows

1. **Instalar Android Studio** (trae el SDK y el JDK 21 que Capacitor 8 pide).
2. `npm run android` y compilar desde el IDE: *Build → Generate Signed App Bundle*.
3. **Crear el keystore la primera vez y no perderlo jamás**: es lo que
   identifica a la app. Sin él no se puede publicar una actualización nunca
   más, y no hay forma de recuperarlo. Guardar el `.jks` y su contraseña fuera
   del repo y con copia.
4. **Cuenta de Google Play Console**: 25 $, pago único.
5. En la ficha hacen falta: descripción, capturas de teléfono, icono 512,
   gráfico destacado 1024×500, política de privacidad (URL pública), el
   cuestionario de contenido y la sección *Data safety*.

Para *Data safety* la respuesta es corta y honesta: la app **no recoge ni
transmite ningún dato**. Todo vive en el dispositivo y no hay servidor.

### iOS — necesita un Mac

Xcode solo existe en macOS: desde Windows no hay forma de compilar ni de subir
el binario. Las opciones son un Mac (propio o prestado), un runner macOS en
GitHub Actions (gratis en repos públicos), o un servicio tipo Ionic Appflow.

1. **Cuenta Apple Developer**: 99 €/año.
2. `npm run ios`, firmar con el equipo y subir con Xcode o Transporter.
3. Política de privacidad (URL) y el cuestionario de privacidad de App Store.

**El riesgo de revisión que hay que tener presente** es la guideline 4.2 de
Apple: rechazan apps que son solo el envoltorio de una web. Lo que separa a
esta de ese caso es que funciona entera sin conexión, genera el plan en el
dispositivo y no consulta ningún servidor — conviene decirlo así en las notas
para el revisor, y que las capturas enseñen la app funcionando en avión.

## Versión

Al subir una versión nueva hay que tocar tres sitios:

| Dónde | Qué |
|---|---|
| `android/app/build.gradle` | `versionCode` (entero, siempre +1) y `versionName` |
| `ios/App/App/Info.plist` | `CFBundleShortVersionString` y `CFBundleVersion` |
| `sw.js` | `const V` — solo afecta a la web |

## El identificador

`com.back2prime.app`, en `capacitor.config.json`. **Se puede cambiar hasta la
primera publicación y nunca después**: es la identidad de la app en las dos
tiendas. Para cambiarlo: editarlo en el config, borrar `android/` e `ios/` y
volver a lanzar `npx cap add android` y `npx cap add ios`.

## Qué cambia dentro del contenedor

Todo vive en `assets/nativo.js`, que en el navegador sale por la puerta en la
primera línea:

- **El plan no se pierde.** Los datos viven en `localStorage` y solo en el
  dispositivo. iOS puede vaciar el almacenamiento de un WKWebView cuando
  aprieta el espacio, y ahí se iría el plan de alguien con ocho semanas encima.
  Se mantiene un espejo en Preferences —UserDefaults en iOS, SharedPreferences
  en Android, que no se purgan— y se restaura al arrancar si el `localStorage`
  aparece vacío.
- **El botón atrás de Android** cierra primero lo que esté abierto encima,
  luego vuelve a Hoy, y solo entonces sale de la app.
- **Los enlaces de vídeo** se abren en el navegador del sistema, no dentro del
  webview donde el usuario se quedaba sin barra ni botón de volver.
- **El service worker no se registra**: los ficheros ya son locales, y
  cache-first encima solo podría servir una versión vieja después de que la
  tienda actualice la app.
