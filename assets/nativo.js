/* ============================================================
   BACK2PRIME · nativo.js — lo que cambia dentro de la app de tienda

   En el navegador este fichero no hace nada: sale por la puerta en la
   primera línea. Dentro del contenedor (Capacitor) se ocupa de las cuatro
   cosas que una web no necesita y una app sí.
   ============================================================ */
window.B2P_NATIVO = (function () {
  const C = window.Capacitor;
  const nativo = !!(C && C.isNativePlatform && C.isNativePlatform());
  const plug = n => (C && C.Plugins && C.Plugins[n]) || null;
  if (!nativo) return { nativo: false, espeja() {} };

  const plataforma = (C.getPlatform && C.getPlatform()) || '';
  const KEY = 'b2p_v1';

  /* ---------- 1. el dato no se pierde ----------
     Todo el plan vive en localStorage y solo en el dispositivo. En iOS el
     sistema puede vaciar el almacenamiento de un WKWebView cuando aprieta el
     espacio, y ahí se iría el plan entero de alguien que lleva ocho semanas.
     Preferences escribe en UserDefaults (iOS) y SharedPreferences (Android),
     que no se purgan: se mantiene un espejo y se restaura si hace falta. */
  const Pref = plug('Preferences');
  let pendiente = null;
  function espeja(estado) {
    if (!Pref) return;
    clearTimeout(pendiente);                      // se guarda en cada toque: se agrupa
    pendiente = setTimeout(() => {
      try { Pref.set({ key: KEY, value: JSON.stringify(estado) }); } catch (e) {}
    }, 400);
  }

  async function rescataSiHaceFalta() {
    if (!Pref) return;
    let local = null;
    try { local = localStorage.getItem(KEY); } catch (e) {}
    if (local && local.length > 2) return;         // hay datos: nada que hacer
    let copia = null;
    try { copia = (await Pref.get({ key: KEY })).value; } catch (e) { return; }
    if (!copia || copia.length <= 2) return;       // tampoco hay copia: usuario nuevo
    try { JSON.parse(copia); } catch (e) { return; }   // copia corrupta: no se toca nada
    try { localStorage.setItem(KEY, copia); } catch (e) { return; }
    /* Se recarga porque app.js ya leyó el localStorage vacío al arrancar. Pasa
       una vez, después de una purga del sistema, y es preferible a arrancar con
       el plan en blanco. */
    location.reload();
  }

  /* ---------- 2. el botón atrás de Android ----------
     Sin esto, el botón físico cierra la app de golpe desde cualquier pantalla,
     incluso con una hoja abierta encima. */
  const App = plug('App');
  if (App && plataforma === 'android') {
    App.addListener('backButton', () => {
      const buscador = document.querySelector('.buscador-wrap, .buscador');
      const hoja = document.querySelector('.sheet.abierta, .sheet[open], dialog[open]');
      const cerrar = (hoja || buscador || {}).querySelector
        ? (hoja || buscador).querySelector('.cerrar, [aria-label="Cerrar"], [aria-label="Fechar"], [aria-label="Close"]')
        : null;
      if (cerrar) { cerrar.click(); return; }        // primero, cerrar lo que esté encima
      if (hoja || buscador) { document.body.click(); return; }
      const r = (location.hash || '').replace(/^#\/?/, '');
      if (r && r !== 'hoy') { location.hash = '#/hoy'; return; }   // volver a la portada
      App.exitApp();                                  // ya en la portada: salir
    });
  }

  /* ---------- 3. los enlaces externos salen fuera ----------
     Un vídeo de técnica abierto DENTRO del webview deja al usuario atrapado en
     una página sin barra de direcciones ni botón de volver. Va al navegador del
     sistema, que es además lo que las dos tiendas esperan. */
  const Browser = plug('Browser');
  if (Browser) {
    document.addEventListener('click', ev => {
      const a = ev.target && ev.target.closest && ev.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (!/^https?:\/\//i.test(href)) return;
      ev.preventDefault();
      Browser.open({ url: href }).catch(() => {});
    }, true);
  }

  /* ---------- 4. el marco: barra de estado y splash ----------
     La app es oscura de nacimiento: iconos claros sobre el fondo del plan. */
  const Status = plug('StatusBar');
  if (Status) {
    try {
      Status.setStyle({ style: 'DARK' });            // DARK = contenido claro
      if (plataforma === 'android') Status.setBackgroundColor({ color: '#0B0D10' });
    } catch (e) {}
  }
  const Splash = plug('SplashScreen');
  if (Splash) {
    // se esconde cuando la app ya ha pintado, no por temporizador a ciegas
    const fuera = () => { try { Splash.hide(); } catch (e) {} };
    if (document.readyState === 'complete') setTimeout(fuera, 120);
    else addEventListener('load', () => setTimeout(fuera, 120));
  }

  rescataSiHaceFalta();
  return { nativo: true, plataforma, espeja };
})();
