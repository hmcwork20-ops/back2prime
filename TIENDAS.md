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

Iconos y splash nativos, partiendo de `icons/icon-512.png`:

```bash
python tools/assets-nativos.py
npx @capacitor/assets generate --assetPath resources --iconBackgroundColor '#0B0D10' --iconBackgroundColorDark '#0B0D10' --splashBackgroundColor '#0B0D10' --splashBackgroundColorDark '#0B0D10'
```

---

## El identificador

`app.back2prime`, en `capacitor.config.json`. Android lo llama
`applicationId` y Apple, Bundle ID. Es la misma idea en las dos tiendas.

**Qué es.** La identidad de la app, no su nombre. El nombre visible
(«BACK2PRIME») se puede cambiar cuando quieras; el identificador no.

**Qué implica.**

- **Es para siempre.** Cambiarlo después de publicar no actualiza la app: crea
  una app distinta, con cero instalaciones y cero reseñas, y quien tuviera la
  vieja no recibe nunca la nueva. Es la decisión menos reversible de todo esto.
- **Es único en el mundo.** Si otro lo registró antes, se acabó. Estaba libre
  al elegirlo, igual que `com.back2prime.app` y `com.back2prime`.
- **Se ve.** Sale en la URL de la ficha
  (`play.google.com/store/apps/details?id=app.back2prime`), en los ajustes de
  Android y en los informes de fallos. Por eso no lleva tu nombre.
- **No influye en el posicionamiento.** No es un dominio ni una señal de
  ranking: dentro de las tiendas mandan el título, la descripción, las palabras
  clave, las reseñas y las instalaciones. El `com.` de la convención habitual no
  significa tener un `.com`, y por eso aquí sobra.
- **No hace falta ser dueño del dominio.** Ni Google ni Apple comprueban que
  `back2prime.app` sea tuyo. Se eligió pensando en que, si algún día hay
  dominio, el natural sea ese. La convención de dominio invertido es solo eso,
  una convención para evitar choques. Lo que sí exige controlar el dominio es
  otra cosa distinta: los enlaces profundos (que tocar un enlace de tu web
  abra la app), y eso se configura aparte y más tarde.
- **En Android es también el paquete Java**: la clase principal vive en
  `android/app/src/main/java/app/back2prime/`.

**Para cambiarlo** (solo tiene sentido antes de publicar): editarlo en
`capacitor.config.json`, borrar `android/` e `ios/`, y volver a lanzar
`npx cap add android` y `npx cap add ios`. Después hay que regenerar los
iconos, porque las plataformas se crean vacías.

---

## a) Android: de cero al APK

Se puede hacer entero desde Windows. Ahora mismo esta máquina no tiene ni Java
ni el SDK, así que el primer paso es obligatorio.

**1. Instalar Android Studio.** Descargar de `developer.android.com/studio` e
instalar con las opciones por defecto. Trae el SDK y el JDK 21 que pide
Capacitor 8, así que no hay que instalar Java aparte. Al abrirlo la primera vez,
el asistente descarga el SDK: son unos 8 GB y un rato largo.

**2. Abrir el proyecto.**

```bash
npm run android
```

Sincroniza `www/` y abre Android Studio en la carpeta correcta. La primera vez,
Gradle descarga dependencias durante varios minutos; hay que esperar a que la
barra de estado deje de moverse.

**3. Probarla ya, sin firmar.** Con un móvil conectado por USB y la depuración
USB activada (Ajustes → Opciones de desarrollador), o con un emulador creado
desde *Device Manager*: botón ▶ Run. La app se instala y arranca.

Si solo quieres el fichero: *Build → Build Bundle(s)/APK(s) → Build APK(s)*.
Aparece en `android/app/build/outputs/apk/debug/app-debug.apk`. Ese APK vale
para instalarlo tú a mano, no para la tienda.

**4. Crear el keystore.** Es el fichero que demuestra que una actualización
viene de ti. *Build → Generate Signed App Bundle / APK → Android App Bundle →
Create new…* y rellenar ruta, contraseña, alias, contraseña del alias, validez
(pon 30 años) y los datos de la organización.

> **Si pierdes el keystore no puedes volver a actualizar la app. Nunca. No hay
> soporte que lo arregle.** Guárdalo fuera del repo, con copia en otro sitio, y
> apunta las dos contraseñas donde guardes las demás.

**5. Generar el AAB firmado.** El mismo diálogo, eligiendo el keystore recién
creado y la variante **release**. Sale en
`android/app/release/app-release.aab`. Para Play se sube el **AAB**, no el APK:
Google genera desde él el APK concreto de cada móvil.

Por línea de comandos, una vez configurada la firma en `build.gradle`, el
equivalente es `cd android && ./gradlew bundleRelease`.

**6. Publicar.** Cuenta de Google Play Console: 25 $, pago único de por vida.
La ficha pide descripción, capturas de teléfono, icono de 512, gráfico
destacado de 1024×500, una **política de privacidad con URL pública**, el
cuestionario de contenido y la sección *Data safety*.

La política ya está publicada y es la misma para las dos tiendas:

    https://back2prime.app/privacidad.html

Vive en `privacidad.html`, en la raíz del repo, en los seis idiomas de la
app y con un `?lang=xx` por si alguna ficha pide la versión de un idioma
concreto. La escribe el repo, no un generador: si cambia lo que se recoge,
se cambia ahí y se cambia la fecha. La dirección de contacto está en una
sola línea del fichero, la constante `CONTACTO`.

Para *Data safety*, con la nube activa la respuesta honesta es: la app
recoge **correo electrónico** (autenticación) y **datos de salud y forma
física** (el plan y los registros), asociados a la cuenta, cifrados en
tránsito, sin venta ni compartición con terceros, y **con borrado dentro de
la app** (Mi perfil → eliminar cuenta borra servidor y dispositivo). Mientras
`nube-config.js` siga a null, la respuesta antigua sigue valiendo: nada sale
del dispositivo.

La primera versión pasa por una revisión que suele tardar de unas horas a unos
días. Cuentas nuevas pueden tener que hacer además una prueba cerrada con
testers antes de publicar en abierto.

---

## b) iOS: el .ipa con un Mac de GitHub

Xcode solo existe en macOS, así que desde Windows no hay forma de compilar. La
salida es un runner macOS de GitHub Actions: **este repo es público, y en repos
públicos esos runners son gratis**. El workflow ya está escrito en
`.github/workflows/ios.yml`.

Funciona en dos modos según haya secretos o no, y ese orden es el bueno:

### Primero, sin gastar un euro

**1. Subir el workflow.** Empujar `.github/workflows/` necesita un permiso que
el token de `gh` no trae por defecto:

```bash
gh auth refresh -s workflow
```

Abre el navegador, pide un código y amplía el permiso. Después, `git push`
normal.

**2. Lanzarlo.** En GitHub: pestaña **Actions → iOS → Run workflow**. O desde
la consola:

```bash
gh workflow run ios.yml
gh run watch
```

Sin certificados, compila **sin firmar**. No produce nada instalable, y ese no
es el objetivo: responde gratis a la única pregunta que importa antes de pagar
los 99 €/año, que es si el proyecto compila en un Mac de verdad.

### Después, con la cuenta Apple

**3. Cuenta Apple Developer**: 99 €/año, en `developer.apple.com`. La
verificación de identidad puede tardar un par de días.

**4. Registrar el Bundle ID.** En *Certificates, Identifiers & Profiles →
Identifiers*, crear uno con `app.back2prime`.

**5. Sacar los dos ficheros que el runner necesita.** Esto se hace una vez, y
requiere un Mac prestado un rato (o generar la petición de firma con OpenSSL):

- Un **certificado de distribución** exportado como `.p12` con contraseña.
- Un **provisioning profile** de distribución para ese Bundle ID
  (`.mobileprovision`).

**6. Convertirlos a texto** para poder guardarlos como secretos:

```bash
base64 -i certificado.p12 | pbcopy        # en Mac
base64 -w0 certificado.p12                # en Linux/Git Bash
```

**7. Guardar los secretos** en el repo, *Settings → Secrets and variables →
Actions → New repository secret*:

| Secreto | Qué es |
|---|---|
| `IOS_CERTIFICATE_P12` | el `.p12` en base64 |
| `IOS_CERTIFICATE_PASSWORD` | la contraseña con la que exportaste el `.p12` |
| `IOS_PROVISION_PROFILE` | el `.mobileprovision` en base64 |
| `IOS_TEAM_ID` | el identificador de equipo, 10 caracteres, está en el portal |

**8. Volver a lanzar el workflow.** Al detectar el certificado cambia de modo
solo: crea un llavero temporal, importa el certificado y el perfil, archiva,
exporta y deja el **`.ipa` como artefacto descargable** en la página de la
ejecución. El llavero se borra al terminar, pase lo que pase.

**9. Subirlo a App Store Connect.** Con Transporter (gratis en el Mac App
Store) o con `xcrun altool`. A partir de ahí, TestFlight y revisión.

> **El riesgo de revisión que hay que tener presente** es la guideline 4.2 de
> Apple: rechazan apps que son solo el envoltorio de una web. Lo que separa a
> esta de ese caso: el plan se genera en el dispositivo, la app entera
> funciona sin conexión una vez dentro (la nube solo sincroniza), y trae
> capas nativas propias (botón atrás, Preferences, enlaces al navegador).
> Conviene decirlo así en las notas para el revisor.

---

## Versión

Al subir una versión nueva hay que tocar tres sitios:

| Dónde | Qué |
|---|---|
| `android/app/build.gradle` | `versionCode` (entero, siempre +1) y `versionName` |
| `ios/App/App/Info.plist` | `CFBundleShortVersionString` y `CFBundleVersion` |
| `sw.js` | `const V` — solo afecta a la web |

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
- **Los enlaces de vídeo** se abren en el navegador del sistema y no dentro del
  webview, donde el usuario se quedaba sin barra ni botón de volver.
- **El service worker no se registra**: los ficheros ya son locales, y
  cache-first encima solo podría servir una versión vieja después de que la
  tienda actualice la app.
