/* ============================================================
   BACK2PRIME · views.js — vistas PLAN · COMIDA · PROGRESO · LOGROS
   Gráficas SVG a mano (sin librerías), mono-serie por gráfica.
   Nota dataviz: la paleta de fases es identidad física (discos
   olímpicos 10/15/20/25). Nunca comparten plot; cada gráfica usa
   UNA serie + banda neutra, con etiqueta directa, tooltip y vista
   tabla (codificación secundaria). Contraste vs superficie: PASS.
   ============================================================ */
(function () {
  'use strict';
  const D = window.B2P, U = window.UI;
  const el = U.el, TX = U.TX, tpl = U.tpl;
  const SVGNS = 'http://www.w3.org/2000/svg';
  const SEMANAS = D.META.semanas || 12;   // duración real del plan cargado
  const EJE_PASO = SEMANAS <= 12 ? 2 : SEMANAS <= 24 ? 4 : 8;
  const COL = { peso: '#C8F24E', cintura: '#66A0E8', banca: '#E5B63E', sent: '#E5685A', rdl: '#4CC07E', pasos: '#66A0E8' };

  /* Ejes y etiquetas de las gráficas: se leen DEL TOKEN, no de un hex copiado.
     Tenerlos duplicados a mano fue justo lo que dejó las gráficas en 3,80:1
     cuando --ink3 se corrigió por contraste. Se resuelve en cada pintada. */
  const tok = (n, alt) => getComputedStyle(document.documentElement).getPropertyValue(n).trim() || alt;
  const EJE = () => tok('--ink3', '#7E8793');
  const EJE2 = () => tok('--ink2', '#A7AFB9');

  function sv(tag, attrs) {
    const n = document.createElementNS(SVGNS, tag);
    if (attrs) for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }
  const diaIdx = f => Math.floor((U.fromISO(f) - U.fromISO(D.META.inicioISO)) / 864e5);

  /* ---- chips-ancla con scroll-spy (secciones largas) ----
     Misma pantalla: el chip desliza hasta el bloque y, al scrollear, se
     ilumina solo el del bloque que tienes delante. */
  let spyLock = 0;
  function chipNav(defs) {
    const nav = el('div', { class: 'chipnav' });
    const off = () => ((parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hdr-h')) || 59) + nav.offsetHeight + 16);
    const setOn = btn => {
      nav.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === btn));
      nav.scrollTo({ left: btn.offsetLeft - nav.clientWidth / 2 + btn.offsetWidth / 2, behavior: 'smooth' });
    };
    defs.forEach(([id, label], i) => nav.append(el('button', { class: i === 0 ? 'on' : '', onclick: ev => {
      const t = document.getElementById(id); if (!t) return;
      spyLock = Date.now() + 750;
      setOn(ev.currentTarget);
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - off() - 2, behavior: 'smooth' });
    } }, label)));
    window.__b2pSpy = () => {
      if (!document.contains(nav)) { window.__b2pSpy = null; return; }
      if (Date.now() < spyLock) return;
      let best = 0;
      defs.forEach(([id], i) => { const t = document.getElementById(id); if (t && t.getBoundingClientRect().top <= off() + 42) best = i; });
      const btn = nav.children[best];
      if (btn && !btn.classList.contains('on')) setOn(btn);
    };
    return nav;
  }
  addEventListener('scroll', () => { if (window.__b2pSpy) window.__b2pSpy(); }, { passive: true });

  /* ==================== PLAN (4 sub-secciones) ==================== */
  /* ==================== PLAN: EL CALENDARIO ====================
     Un calendario de pared: meses reales, cada dia tenido del color de su
     fase. Tocas un dia y su pop-up trae el entreno (cada ejercicio abre su
     ficha) y las comidas (cada plato abre su receta). Las fases van arriba
     como leyenda desplegable con su objetivo y su tope de RPE, y los hitos
     (diet break, descarga, cribado) se marcan en su semana y se cuentan en
     el pop-up: "Fases al detalle" vive ahora repartido donde se usa. */
  function renderPlan(root) {
    const hoy = U.hoyISO();

    // — la leyenda de fases: color, semanas, RPE; el objetivo se despliega —
    const ley = el('div', { class: 'fases-leyenda' });
    D.FASES.forEach(f => {
      const sem = f.semanas || [];
      ley.append(el('details', { class: 'fase-banda' },
        el('summary', null,
          el('span', { class: 'fase-punto f' + f.id, 'aria-hidden': 'true' }),
          el('b', null, f.nombre),
          el('span', { class: 'mini', style: 'margin-left:auto' },
            'S' + sem[0] + '\u2013S' + sem[sem.length - 1] + ' \u00b7 RPE ' + f.rpe)),
        el('div', { class: 'fase-obj mini' }, f.objetivo)));
    });
    root.append(el('div', { class: 'sec-h' }, el('h2', null, TX.vCalendario)), ley);

    // — los meses, del primero al ultimo del plan —
    const d0 = U.fromISO(D.META.inicioISO), d1 = U.fromISO(D.META.finISO);
    const cursor = new Date(d0.getFullYear(), d0.getMonth(), 1);
    const tope = new Date(d1.getFullYear(), d1.getMonth(), 1);
    /* Un mes por pantalla: visor horizontal con snap. Abre en el mes de hoy
       (acotado al plan: antes de empezar ensena el primero; acabado, el
       ultimo) y se navega con el dedo o con las flechas. */
    const tarjetasMes = [];
    let mesInicial = 0;
    const hoyD = U.fromISO(hoy);
    const refD = hoyD < d0 ? d0 : hoyD > d1 ? d1 : hoyD;
    while (cursor <= tope) {
      const y = cursor.getFullYear(), mo = cursor.getMonth();
      const card = el('div', { class: 'card mes' });
      card.append(el('div', { class: 'mes-t' }, (TX.meses[mo] || '').toUpperCase() + ' ' + y));
      const grid = el('div', { class: 'cal-grid' });
      (TX.diasIni || []).forEach(dn => grid.append(el('span', { class: 'cal-dn mini' }, dn)));
      const hueco = (new Date(y, mo, 1).getDay() + 6) % 7;      // lunes = 0
      for (let k = 0; k < hueco; k++) grid.append(el('span'));
      const nDias = new Date(y, mo + 1, 0).getDate();
      for (let dd = 1; dd <= nDias; dd++) {
        const iso = y + '-' + U.pad(mo + 1) + '-' + U.pad(dd);
        const w = U.semanaDe(iso);
        if (!(w >= 1 && w <= SEMANAS)) { grid.append(el('span', { class: 'cal-d off' }, String(dd))); continue; }
        const cal = D.CAL[w - 1];
        const dow = U.dowMon(iso);
        const slot = cal.dias[dow];
        const sid = typeof slot === 'object' ? slot.s : slot;
        const ses = D.SESIONES[sid];
        const fuerza = !!(ses && ses.tipo === 'fuerza');
        const hito = dow === 0 && D.HITOS_SEMANA[w];
        grid.append(el('button', {
          class: 'cal-d f' + cal.fase + (iso === hoy ? ' hoyd' : '') + (fuerza ? ' con-f' : '') + (hito ? ' con-h' : ''),
          type: 'button', 'aria-label': U.fmtFecha(iso), onclick: () => abreDia(iso)
        }, String(dd)));
      }
      card.append(grid);
      if (y === refD.getFullYear() && mo === refD.getMonth()) mesInicial = tarjetasMes.length;
      tarjetasMes.push(card);
      cursor.setMonth(cursor.getMonth() + 1);
    }
    const visor = el('div', { class: 'cal-visor' }, tarjetasMes);
    const envuelve = el('div', { class: 'cal-envoltura' }, visor);
    if (tarjetasMes.length > 1) {
      /* por indice y con scrollTo: scrollBy suave se lleva mal con el snap
         obligatorio (el gesto puede quedarse en el mes de partida) */
      const mueve = dir => {
        const w = visor.clientWidth || 1;
        const i = Math.max(0, Math.min(tarjetasMes.length - 1, Math.round(visor.scrollLeft / w) + dir));
        const suave = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
        visor.scrollTo({ left: i * w, behavior: suave });
      };
      envuelve.append(
        el('button', { class: 'cal-nav izq plano', type: 'button', 'aria-label': '‹', onclick: () => mueve(-1) }, '‹'),
        el('button', { class: 'cal-nav der plano', type: 'button', 'aria-label': '›', onclick: () => mueve(1) }, '›'));
    }
    root.append(envuelve);
    // colocar el visor en su mes ANTES del primer pintado visible
    requestAnimationFrame(() => { visor.scrollLeft = mesInicial * visor.clientWidth; });

    // — el pop-up del dia —
    function abreDia(iso) {
      const w = U.semanaDe(iso), dow = U.dowMon(iso);
      const cal = D.CAL[w - 1], fase = D.FASES[cal.fase - 1] || {};
      // abrir una ficha DESDE el pop-up: se cierra este y se abre la otra
      const relevo = fn => { U.closeSheet(); setTimeout(fn, 230); };
      U.openSheet(sh => {
        sh.append(el('h3', null, U.fmtFecha(iso)));
        sh.append(el('div', { class: 'mini', style: 'margin:2px 0 10px' },
          tpl(TX.semanaLinea, { w, t: SEMANAS, f: fase.id, n: fase.nombre, r: fase.rpe })));
        if (D.HITOS_SEMANA[w]) {
          const h = D.HITOS_SEMANA[w];
          sh.append(el('div', { class: 'banner' + (cal.descarga ? ' warn' : ''), style: 'margin:0 0 10px' },
            el('div', null, el('b', null, 'S' + w + ' \u00b7 ' + h.t), el('div', null, h.d))));
        }

        // el entreno del dia
        const slot = cal.dias[dow];
        const opc = typeof slot === 'object';
        const sid = opc ? slot.s : slot;
        const ses = D.SESIONES[sid];
        if (sid === 'libre' || !ses) {
          sh.append(el('div', { class: 'dia-quieto' }, el('b', null, dow === 6 ? TX.domingoPrep : TX.descanso)));
        } else if (ses.tipo === 'fuerza') {
          sh.append(el('div', { class: 'mini', style: 'margin:0 0 6px' },
            el('b', null, ses.nombre + (ses.dur ? ' \u00b7 ' + ses.dur : ''))));
          const lista = el('div', { class: 'dia-lista' });
          (ses.bloques || []).forEach(b => {
            const e = D.EJERCICIOS[b.e]; if (!e) return;
            const reps = b.rW ? Object.values(b.rW).join(' \u2192 ') : b.r;
            const desc = b.d >= 60 ? Math.floor(b.d / 60) + '\u2032' + (b.d % 60 ? (b.d % 60) + '\u2033' : '') : b.d + '\u2033';
            lista.append(el('button', { class: 'toca plano', type: 'button',
              onclick: () => relevo(() => U.fichaEjercicio(b.e, {})) },
              el('span', { class: 'toca-tx' }, el('b', null, e.nombre),
                b.n ? el('span', { class: 'mini' }, b.n) : null),
              el('span', { class: 'toca-num sr' }, b.s + '\u00d7' + reps),
              el('span', { class: 'toca-num sr' }, desc),
              el('span', { class: 'toca-chev', 'aria-hidden': 'true' }, '\u203a')));
          });
          sh.append(lista);
        } else {
          sh.append(el('div', { class: 'dia-quieto' },
            el('b', null, ses.nombre + (opc ? ' (' + TX.opcional + ')' : '')),
            ses.detalle ? el('div', { class: 'mini', style: 'margin-top:4px' }, ses.detalle) : null));
        }

        // las comidas del dia, cada plato a su receta
        sh.append(el('h4', null, TX.calComidas));
        const menu = D.MENU[dow] || {};
        [['de', TX.desayuno], ['co', TX.comidaLbl], ['ce', TX.cena]].forEach(par => {
          const id = menu[par[0]];
          if (!id) return;
          if (id === 'LIBRE') {
            sh.append(el('div', { class: 'meal-row' },
              el('span', { class: 'ml' }, par[1]),
              el('span', { class: 'mn' }, TX.comidaLibreTitulo),
              el('span', { class: 'mk' }, TX.comidaLibreTag)));
            return;
          }
          const r = D.RECETAS.find(x => x.id === id); if (!r) return;
          const f = U.foto(r.id);
          sh.append(el('button', { class: 'toca plano', type: 'button',
            onclick: () => relevo(() => { if (window.UI.sheetReceta) window.UI.sheetReceta(r); }) },
            f ? el('img', { class: 'mf', src: f, alt: '', loading: 'lazy' }) : null,
            el('span', { class: 'toca-tx' },
              el('span', { class: 'ml' }, par[1]),
              el('b', null, r.nombre),
              r.macros ? el('span', { class: 'mini' }, r.macros.kcal + ' kcal \u00b7 P ' + r.macros.p + ' g') : null),
            el('span', { class: 'toca-chev', 'aria-hidden': 'true' }, '\u203a')));
        });
      });
    }
  }

  /* ==================== EJERCICIOS: LA BIBLIOTECA ====================
     Como el recetario: tarjetas. Primero las cuatro zonas, cada una con el
     mapa muscular encendido con TODO lo que se trabaja dentro; al tocar una,
     sus ejercicios, cada uno con su propio mapa. Lo descartado o sin tu
     material sigue consultable, pero avisa de que no esta en tu plan. */
  let zonaEj = null;
  function renderEjercicios(root) {
    const ZONAS = [['empuje', TX.zonas.empuje], ['tiron', TX.zonas.tiron],
      ['pierna', TX.zonas.pierna], ['core', TX.zonas.core]];
    const G3 = window.B2P_GEN;
    const fueraDe = id => {
      if (!D.__gen) return null;
      if ((D.META.gustosNo || []).includes('ej:' + id)) return TX.libDescartado;
      if (G3 && G3.equipoVale && !G3.equipoVale((D.EJERCICIOS[id] || {}).equipo, D.META.material)) return TX.libSinMaterial;
      return null;
    };
    const porZona = z => Object.keys(D.EJERCICIOS).filter(id => D.EJERCICIOS[id].zona === z);
    const cont = el('div');
    root.append(cont);

    const pintaZonas = () => {
      cont.replaceChildren(el('div', { class: 'sec-h' },
        el('h2', null, TX.vBiblioteca), el('span', { class: 'mini' }, TX.vTocaCualquiera)));
      const grid = el('div', { class: 'ej-zonas' });
      ZONAS.forEach(par => {
        const z = par[0], zt = par[1];
        const ids = porZona(z);
        if (!ids.length) return;
        /* el mapa de la zona: la union de todo lo que ahi se trabaja */
        const P = new Set(), Sx = new Set();
        ids.forEach(id => { const mm = D.EJERCICIOS[id].mm || {};
          (mm.p || []).forEach(x => P.add(x)); (mm.s || []).forEach(x => Sx.add(x)); });
        P.forEach(x => Sx.delete(x));
        grid.append(el('button', { class: 'ej-zcard plano', type: 'button',
          onclick: () => { zonaEj = z; pintaLista(); scrollTo(0, 0); } },
          window.B2P_MAPA ? el('div', { class: 'ej-zmapa mapa', 'aria-hidden': 'true',
            html: window.B2P_MAPA.svg({ p: [...P], s: [...Sx] }, { mini: true }) }) : null,
          el('b', null, zt),
          el('span', { class: 'mini' }, String(ids.length))));
      });
      cont.append(grid);
    };

    const pintaLista = () => {
      const z = zonaEj;
      const zt = (ZONAS.find(par => par[0] === z) || [])[1] || '';
      const ids = porZona(z);
      cont.replaceChildren(el('div', { class: 'ej-atras' },
        el('button', { class: 'plano qaux', type: 'button',
          onclick: () => { zonaEj = null; pintaZonas(); } }, '\u2039 ' + TX.vBiblioteca),
        el('b', null, zt), el('span', { class: 'mini' }, String(ids.length))));
      const grid = el('div', { class: 'ej-lista' });
      ids.forEach(id => {
        const e = D.EJERCICIOS[id];
        const tag = fueraDe(id);
        grid.append(el('button', { class: 'ej-card plano' + (tag ? ' fuera' : ''), type: 'button',
          onclick: () => U.fichaEjercicio(id, {}) },
          window.B2P_MAPA && e.mm ? el('div', { class: 'ej-mapa mapa', 'aria-hidden': 'true',
            html: window.B2P_MAPA.svg(e.mm, { mini: true }) }) : null,
          el('b', { class: 'ej-nom' }, e.nombre),
          el('span', { class: 'mini' }, e.musc[0]),
          tag ? el('span', { class: 'fuera-tag' }, tag) : null));
      });
      cont.append(grid);
    };

    if (zonaEj) pintaLista(); else pintaZonas();
  }

  const cap = t => t ? t.charAt(0).toUpperCase() + t.slice(1) : t;

  /* ---- zoom de imagen: para reconocer el producto en el super ----
     Capa propia y no una hoja: esto es un vistazo, no una vista. Se cierra
     tocando donde sea o con Escape. */
  function abreZoom(src, titulo) {
    const esc = ev => { if (ev.key === 'Escape') cierra(); };
    const cierra = () => { document.removeEventListener('keydown', esc); capa.remove(); };
    const capa = el('div', { class: 'zoom-capa', role: 'dialog', 'aria-modal': 'true', 'aria-label': titulo, onclick: cierra },
      el('img', { class: 'zoom-img', src, alt: titulo }),
      el('div', { class: 'zoom-cap' }, titulo));
    document.addEventListener('keydown', esc);
    document.body.append(capa);
  }

  /* ==================== NUTRICIÓN ==================== */
  /* ---- el desfase del menu: una linea, bajo las cifras que desmiente ----
     El menu se arma con recetas de tamano fijo, asi que casi nunca cuadra al
     digito con el objetivo. Antes eso eran dos parrafos bajo la tarjeta y
     convertian la portada de Comida en una lectura; ahora es una linea con
     los dos huecos y su signo. Que hacer con ellos se explica en Mi perfil >
     Detras del plan: aqui va el tamano del hueco, alli el remedio.

     Va bajo la FILA y no dentro de cada celda porque dentro no cabe: con
     cuatro columnas en un movil de 375 px la celda da 45 px de contenido y
     «menu -200» pide 49 incluso a 10 px. Se recortaba sin avisar, y en
     aleman o con cuatro digitos, mas.

     De la proteina solo se avisa del defecto: pasarse no es un problema que
     arreglar, y decirlo seria ruido. */
  function lineaMenu(fn) {
    if (!D.__gen) return null;
    const partes = [];
    if (D.__kcalMenu && fn.kcal) {
      const d = D.__kcalMenu - fn.kcal;
      if (Math.abs(d) >= 100) partes.push((d < 0 ? '-' : '+') + Math.abs(d) + ' ' + TX.kcalLbl);
    }
    if (D.__protMenu && fn.p && fn.p - D.__protMenu >= 16)
      partes.push('-' + (fn.p - D.__protMenu) + ' g ' + TX.nProteLbl);
    return partes.length
      ? el('div', { class: 'dmenu' }, (TX.nMenuLbl || 'menu') + ' ' + partes.join(' · '))
      : null;
  }

  let grupoRec = null;         // el grupo abierto del recetario (de/co/ce/supl)
  function renderNutricion(root) {
    const w = U.semanaDe(U.hoyISO());
    // la fila de kcal sigue a la FASE real del calendario, no a semanas fijas
    const faseN = (w >= 1 && w <= SEMANAS) ? D.CAL[w - 1].fase : 1;
    const fi = faseN === 4 ? 2 : faseN === 3 ? 1 : 0;
    const fn = D.NUTRI.fases[fi];

    // «El plato» vive en Mi Perfil → Detrás del plan
    const IDS_N = [['n-obj', TX.chipsNutri[0]], ['n-rec', TX.chipsNutri[2]],
      ['n-compra', TX.chipsNutri[4]]];
    root.append(chipNav(IDS_N));

    root.append(el('div', { id: 'n-obj', class: 'card fase-card pn' },
      el('div', { class: 'card-title' }, el('div', null, el('h2', null, TX.nObjetivo), el('div', { class: 'sub' }, fn.f + (w >= 1 && w <= SEMANAS ? ' · ' + tpl(TX.nSemana, { w }) : '')))),
      /* fila y desfase van juntos en un hijo: el gap de la tarjeta separa
         bloques, y el pie de las cifras no es un bloque, es su pie */
      el('div', { class: 'obj-cifras' },
        el('div', { class: 'statrow', style: 'grid-template-columns:repeat(4,1fr);margin:0' },
          el('div', { class: 'stat' }, el('div', { class: 'sl' }, TX.kcalLbl), el('div', { class: 'sv num' }, fn.kcal.toLocaleString(TX.lang || 'es'))),
          el('div', { class: 'stat' }, el('div', { class: 'sl' }, TX.nProteLbl), el('div', { class: 'sv num' }, fn.p + ' g')),
          el('div', { class: 'stat' }, el('div', { class: 'sl' }, TX.nGrasaLbl), el('div', { class: 'sv num' }, fn.g + ' g')),
          el('div', { class: 'stat' }, el('div', { class: 'sl' }, TX.nCarbosLbl), el('div', { class: 'sv num' }, fn.c + ' g'))),
        lineaMenu(fn)),
      ((D.HITOS_SEMANA[w] || {}).tipo === 'dietbreak' || (!D.__gen && w === 7))
        ? el('div', { class: 'banner', style: 'margin:8px 0 2px' }, el('div', null, el('b', null, TX.nDietBreakTitulo),
            el('div', null, tpl(TX.nDietBreakTxt, { k: (D.__mantenimiento || 2800).toLocaleString(TX.lang || 'es') })))) : null,
      el('p', { class: 'mini', style: 'margin-top:8px' }, D.NUTRI.tomas)));

    // «De dónde salen los números» vive ahora en Mi Perfil → Detrás del plan

    /* Aqui solo queda lo que es una ALERTA: platos del menu que no encajan
       con la dieta declarada. Los desfases de kcal y proteina, y la nota de
       la toma nocturna, se leen en Mi perfil > Detras del plan: son metodo,
       y aqui convertian la cabecera en un muro de texto. */
    if (D.__menuAvisos && TX.gen && TX.gen.menuAviso)
      root.append(el('div', { class: 'banner warn', style: 'margin:8px 0' },
        el('div', null, U.tpl(TX.gen.menuAviso, { n: D.__menuAvisos }))));

    /* ---- recetario por comidas: grupos primero, dentro los platos ----
       Como Ejercicios: cuatro tarjetas (Desayuno, Comida, Cena y Suplementos)
       y al tocar una, sus fichas. La toma pre-sueno (slot snack) vive en
       Cena: es la toma de la noche. */
    root.append(el('div', { id: 'n-rec', class: 'sec-h' }, el('h2', null, TX.nRecetario), el('span', { class: 'mini' }, TX.nToca)));
    const misRecetas = (D.__gen && window.B2P_GEN)
      ? D.RECETAS.filter(r => window.B2P_GEN.recetaVale(r, { dieta: D.META.dieta, sin: D.META.sin || [] }, new Set(D.META.gustosNo || [])))
      : D.RECETAS;
    const IMGV2 = '?v=' + (window.B2P_IMG_V || 1);
    const deGrupo = (r, gid) => gid === 'ce' ? (r.slot === 'ce' || r.slot === 'snack') : r.slot === gid;
    const supls = (D.NUTRI.suplementos || []).filter(x => x.id && x.id !== 'no');
    const imgSupl = id => (window.B2P_SUPL || []).includes(id) ? 'assets/supl/' + id + '.webp' + IMGV2 : null;
    const GRUPOS_R = [['de', TX.desayuno], ['co', TX.comidaLbl], ['ce', TX.cena], ['supl', TX.nSupl]];
    const recCont = el('div');
    root.append(recCont);

    const cartaReceta = r => el('button', { class: 'rec-card plano' + (U.foto(r.id) ? ' con-foto' : ''), type: 'button', onclick: () => sheetReceta(r) },
      U.foto(r.id) ? el('img', { class: 'rfoto', src: U.foto(r.id), alt: '', loading: 'lazy', decoding: 'async', width: '640', height: '640' }) : null,
      el('div', { class: 'rtipo' }, r.tipo),
      el('h3', null, r.nombre),
      el('div', { class: 'rmacros' }, el('span', { class: 'rkcal' }, r.macros.kcal), ' kcal \u00b7 P', r.macros.p, ' G', r.macros.g, ' C', r.macros.c));

    const pintaGruposR = () => {
      const g = el('div', { class: 'rec-grupos' });
      GRUPOS_R.forEach(par => {
        const gid = par[0], gt = par[1];
        const n = gid === 'supl' ? supls.length : misRecetas.filter(r => deGrupo(r, gid)).length;
        if (!n) return;
        let cover = null;
        if (gid === 'supl') cover = imgSupl('creatina');
        else { const conFoto = misRecetas.find(r => deGrupo(r, gid) && U.foto(r.id)); if (conFoto) cover = U.foto(conFoto.id); }
        g.append(el('button', { class: 'rg-card plano', type: 'button', onclick: () => { grupoRec = gid; pintaR(); } },
          cover ? el('img', { class: 'rg-img', src: cover, alt: '', loading: 'lazy' })
                : el('div', { class: 'rg-ph' }, U.icono(gid === 'supl' ? 'matraz' : 'cubiertos', 30)),
          el('b', null, gt), el('span', { class: 'mini' }, String(n))));
      });
      recCont.replaceChildren(g);
    };
    const pintaListaR = () => {
      const gt = (GRUPOS_R.find(x => x[0] === grupoRec) || [])[1] || '';
      const atras = el('div', { class: 'ej-atras' },
        el('button', { class: 'plano qaux', type: 'button', onclick: () => { grupoRec = null; pintaR(); } }, '\u2039 ' + TX.nRecetario),
        el('b', null, gt));
      if (grupoRec === 'supl') {
        const g = el('div', { class: 'rec-grid' });
        supls.forEach(x => g.append(el('button', { class: 'rec-card plano' + (imgSupl(x.id) ? ' con-foto' : ''), type: 'button', onclick: () => sheetSupl(x) },
          imgSupl(x.id) ? el('img', { class: 'rfoto', src: imgSupl(x.id), alt: '', loading: 'lazy' })
                        : el('div', { class: 'rg-ph chica' }, U.icono('matraz', 24)),
          el('h3', null, x.t))));
        const no = (D.NUTRI.suplementos || []).find(x => x.id === 'no');
        recCont.replaceChildren(atras, g,
          no ? el('div', { class: 'banner warn', style: 'margin:10px 0 4px' }, el('div', null, el('b', null, no.t), el('div', null, no.d))) : el('span'),
          el('p', { class: 'mini', style: 'margin:10px 2px 0' }, D.NUTRI.hidratacion));
      } else {
        const g = el('div', { class: 'rec-grid' });
        misRecetas.filter(r => deGrupo(r, grupoRec)).forEach(r => g.append(cartaReceta(r)));
        recCont.replaceChildren(atras, g);
      }
    };
    const pintaR = () => { if (grupoRec) pintaListaR(); else pintaGruposR(); };
    pintaR();

    /* ---- la compra: cada grupo plegable con su progreso; cada producto
       con su imagen a la izquierda, el nombre en el centro y la cantidad
       semanal a la derecha; y lo marcado cae al final de SU grupo, para que
       lo pendiente quede siempre arriba ---- */
    root.append(el('div', { id: 'n-compra', class: 'sec-h' }, el('h2', null, TX.nCompra),
      el('button', { class: 'tbl-toggle', onclick: () => {
        U.S.shop = {}; U.save();
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      } }, TX.nReiniciar)));
    const imgProd = pid => (pid && (window.B2P_PRODUCTOS || []).includes(pid)) ? 'assets/productos/' + pid + '.webp' + IMGV2 : null;
    const TICK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    D.COMPRA.forEach((c, ci) => {
      const kDe = (it, ii) => 'c' + ci + ':' + (it.pid || 'x') + ':' + ii;
      const cuerpo = el('div', { class: 'shoplista' });
      const prog = el('span', { class: 'mini', style: 'margin-left:auto' });
      const pinta = () => {
        const orden = c.items.map((it, ii) => [it, ii])
          .sort((a, b) => (U.S.shop[kDe(a[0], a[1])] ? 1 : 0) - (U.S.shop[kDe(b[0], b[1])] ? 1 : 0) || a[1] - b[1]);
        cuerpo.replaceChildren(...orden.map(par => {
          const it = par[0], ii = par[1], k = kDe(it, ii), on = !!U.S.shop[k];
          const src = imgProd(it.pid);
          return el('button', { class: 'shopitem' + (on ? ' on' : '') + ' plano', type: 'button', 'aria-pressed': on ? 'true' : 'false',
            onclick: () => { U.S.shop[k] = !U.S.shop[k]; U.save(); pinta(); } },
            src ? el('img', { class: 'pimg', src, alt: '', loading: 'lazy',
                onclick: ev => { ev.stopPropagation(); abreZoom(src, cap(it.i)); } })
                : el('span', { class: 'pimg ph', 'aria-hidden': 'true' }, (it.i || '?').charAt(0).toUpperCase()),
            el('span', { class: 'si' }, cap(it.i) + (it.opc ? TX.opcionalParen : '')),
            el('span', { class: 'sq' }, it.q),
            el('span', { class: 'tick', html: TICK }));
        }));
        const hechos = c.items.filter((it, ii) => U.S.shop[kDe(it, ii)]).length;
        prog.textContent = hechos + '/' + c.items.length;
      };
      pinta();
      root.append(el('details', { class: 'fold shopfold', open: '' },
        el('summary', null, el('b', null, c.cat), prog),
        el('div', { class: 'fold-in' }, cuerpo)));
    });


  }

  function sheetReceta(r) {
    U.openSheet(sh => {
      // la foto abre la ficha: se ve antes de leer
      if (U.foto(r.id)) sh.append(el('img', { class: 'rhero', src: U.foto(r.id), alt: '', decoding: 'async', width: '640', height: '640' }));
      sh.append(el('h2', null, r.nombre),
        el('div', { class: 'stag' }, r.tipo + ' · ' + r.tiempo + ' · ' + r.cocina),
        el('div', { class: 'statrow', style: 'grid-template-columns:repeat(4,1fr)' },
          el('div', { class: 'stat' }, el('div', { class: 'sl' }, TX.kcalLbl), el('div', { class: 'sv num' }, r.macros.kcal)),
          el('div', { class: 'stat' }, el('div', { class: 'sl' }, TX.nProteLbl), el('div', { class: 'sv num' }, r.macros.p)),
          el('div', { class: 'stat' }, el('div', { class: 'sl' }, TX.nGrasaLbl), el('div', { class: 'sv num' }, r.macros.g)),
          el('div', { class: 'stat' }, el('div', { class: 'sl' }, TX.nCarbosLbl), el('div', { class: 'sv num' }, r.macros.c))));
      /* Cada ingrediente con su foto: reconocer el producto es media receta
         la primera vez que la haces. Tocarla amplia, como en la compra. Si
         aun no hay foto, una inicial ocupa el hueco y la fila no baila. */
      sh.append(el('h4', null, TX.nIngredientes));
      const IMGV3 = '?v=' + (window.B2P_IMG_V || 1);
      const lista = el('div', { class: 'ing-lista' });
      r.ing.forEach(ig => {
        const src = (ig.pid && (window.B2P_PRODUCTOS || []).includes(ig.pid))
          ? 'assets/productos/' + ig.pid + '.webp' + IMGV3 : null;
        lista.append(el('div', { class: 'ing-fila' },
          src
            ? el('img', { class: 'ing-img', src, alt: '', loading: 'lazy', decoding: 'async',
                width: '46', height: '46', onclick: () => abreZoom(src, cap(ig.i)) })
            : el('span', { class: 'ing-img ph', 'aria-hidden': 'true' }, cap((ig.i || '?').charAt(0))),
          el('span', { class: 'ing-tx' }, cap(ig.i), ig.n ? el('span', { class: 'mini' }, ig.n) : null),
          el('span', { class: 'ing-q' }, ig.q)));
      });
      sh.append(lista);
      sh.append(el('h4', null, TX.nPasos));
      sh.append(el('ol', { style: 'padding-left:20px;font-size:14px' }, r.pasos.map(p => el('li', { style: 'margin:6px 0' }, p))));
      if (r.tips) sh.append(el('div', { class: 'alt', style: 'margin-top:12px' }, r.tips));
    });
  }
  function sheetSupl(x) {
    U.openSheet(sh => {
      const src = (window.B2P_SUPL || []).includes(x.id) ? 'assets/supl/' + x.id + '.webp?v=' + (window.B2P_IMG_V || 1) : null;
      if (src) sh.append(el('img', { class: 'rhero', src, alt: '', decoding: 'async' }));
      sh.append(el('h2', null, x.t), el('p', { style: 'margin-top:8px' }, x.d));
    });
  }

  U.sheetReceta = sheetReceta;   // la usa la tarjeta «La comida de hoy» (app.js)

  /* ==================== PROGRESO ==================== */
  function renderProgreso(root) {
    const S = U.S, hoy = U.hoyISO(), w = U.semanaDe(hoy);
    const ms = U.mediasSemanales();
    const pesoAhora = ms.length ? ms[ms.length - 1].m : null;
    const cint = ultimaCintura();
    const adh = adherenciaGlobal();
    const metaCint = D.META.perfil.cinturaMetaCm || 91;   // la meta de cintura sale del perfil

    const IDS_P = ['p-res', 'p-peso', 'p-cint', 'p-carg', 'p-adh', 'p-chk'];
    root.append(chipNav(IDS_P.map((id, i) => [id, TX.chipsProg[i]])));

    // stats
    /* ---- la barra del plan: cada fase es un disco olímpico ----
       Sólido si la fase terminó; el actual se llena de abajo arriba con tu
       adherencia de fuerza en esa fase; fantasma los que vienen. Vista lateral
       de la barra, discos espejados en las dos mangas. */
    function barraPlan() {
      const H = 132, CY = 66, ALT = { 10: 52, 15: 66, 20: 80, 25: 94 };
      const fases = D.FASES.map(f => {
        let ok = 0, tot = 0, terminada = true;
        f.semanas.forEach(wk => {
          const fs = U.fechasSemana(wk);
          if (fs.fin >= hoy) terminada = false;
          U.sesionesFuerzaSemana(wk).forEach(x => { if (x.f <= hoy) { tot++; if (x.hecho) ok++; } });
        });
        const activa = f.semanas.includes(w);
        return { f, terminada: terminada, activa, pct: tot ? ok / tot : 0 };
      });
      const cargados = fases.filter(x => x.terminada).length + (fases.some(x => x.activa) ? 0 : 0);
      let sv = '<svg viewBox="0 0 640 ' + H + '" role="img" aria-label="' + TX.pBarraT + '">';
      sv += '<rect x="24" y="' + (CY - 4) + '" width="592" height="8" rx="4" class="bp-barra"/>';
      sv += '<rect x="150" y="' + (CY - 7) + '" width="12" height="14" rx="3" class="bp-tope"/>';
      sv += '<rect x="478" y="' + (CY - 7) + '" width="12" height="14" rx="3" class="bp-tope"/>';
      // discos: del tope hacia fuera, en las dos mangas
      fases.forEach((x, i) => {
        const alto = ALT[x.f.disco] || 60, wD = 20, sep = 26;
        const xL = 150 - 14 - i * sep - wD, xR = 478 + 14 + i * sep;
        [xL, xR].forEach(xx => {
          sv += '<g class="bp-disco f' + x.f.id + (x.terminada ? ' lleno' : x.activa ? ' activo' : ' futuro') + '">';
          sv += '<rect x="' + xx + '" y="' + (CY - alto / 2) + '" width="' + wD + '" height="' + alto + '" rx="7" class="bp-aro"/>';
          if (x.activa && x.pct > 0) {
            const hF = Math.max(4, alto * Math.min(1, x.pct));
            sv += '<rect x="' + xx + '" y="' + (CY - alto / 2 + (alto - hF)) + '" width="' + wD + '" height="' + hF + '" rx="6" class="bp-lleno"/>';
          }
          sv += '</g>';
        });
      });
      sv += '</svg>';
      const hechas = fases.filter(x => x.terminada).length;
      return el('div', { class: 'card bp-card' },
        el('div', { class: 'card-title' }, el('h2', null, TX.pBarraT),
          el('span', { class: 'sub' }, tpl(TX.pBarraSub, { a: hechas, b: fases.length }))),
        el('div', { class: 'bp', html: sv }));
    }

    /* ---- tres anillos: fuerza, peso, cintura ---- */
    function anillo(pct, clase, centro, etiqueta) {
      const R = 30, C = 2 * Math.PI * R;
      const p2 = pct === null ? 0 : Math.max(0, Math.min(1, pct));
      const sv = '<svg viewBox="0 0 76 76" aria-hidden="true">'
        + '<circle cx="38" cy="38" r="' + R + '" class="an-fondo"/>'
        + '<circle cx="38" cy="38" r="' + R + '" class="an-arco ' + clase + '" stroke-dasharray="' + (C * p2) + ' ' + C + '" transform="rotate(-90 38 38)"/>'
        + '</svg>';
      return el('div', { class: 'an' }, el('div', { class: 'an-svg', html: sv }),
        el('div', { class: 'an-centro num' }, centro),
        el('div', { class: 'an-l' }, etiqueta));
    }
    function anillos() {
      const objKg = (D.META.perfil.objetivoKg[0] + D.META.perfil.objetivoKg[1]) / 2;
      const salida = D.META.perfil.pesoSalida;
      const pPeso = (pesoAhora !== null && salida !== objKg) ? (salida - pesoAhora) / (salida - objKg) : null;
      const base = S.config.cinturaBase, metaC = D.META.perfil.cinturaMetaCm;
      const pCint = (cint && base && metaC && base !== metaC) ? (base - cint.v) / (base - metaC) : null;
      const pFue = adh.tot ? adh.ok / adh.tot : null;
      return el('div', { class: 'an-fila' },
        anillo(pFue, 'an-volt', adh.tot ? Math.round(adh.ok / adh.tot * 100) + '%' : '—', TX.fuerzaLbl),
        anillo(pPeso, 'an-f1', pesoAhora ? U.kg1(pesoAhora) : '—', TX.pPeso),
        anillo(pCint, 'an-f3', cint ? U.kg1(cint.v) : '—', TX.pCintura));
    }

    const resumen = el('div', { id: 'p-res' });
    resumen.append(barraPlan());
    resumen.append(anillos());
    root.append(resumen);
    resumen.append(el('div', { class: 'statrow' },
      stat(TX.pPeso, pesoAhora ? U.kg1(pesoAhora) : '—', pesoAhora ? tpl(TX.pMediaS, { w: ms[ms.length - 1].w }) : TX.pSinDatos),
      // la báscula se cuenta en la dirección del objetivo: quien gana ve «Ganado»
      (() => {
        const gana = D.META.objetivo === 'ganar';
        const dif = pesoAhora ? (gana ? pesoAhora - D.META.perfil.pesoSalida : D.META.perfil.pesoSalida - pesoAhora) : 0;
        return stat(gana ? (TX.pGanado || TX.pPerdido) : TX.pPerdido,
          pesoAhora ? (dif > 0.04 ? (gana ? '+' : '−') + U.kg1(dif) : '0,0') : '—',
          tpl(TX.pDesde, { v: U.kg1(D.META.perfil.pesoSalida) }));
      })(),
      stat(TX.pCintura, cint ? U.kg1(cint.v) : '—', cint ? tpl(TX.pCinturaSub, { f: U.fmtCorta(cint.f), m: metaCint }) : TX.pCinturaLunes),
      stat(TX.pAdh, adh.tot ? Math.round(adh.ok / adh.tot * 100) + '%' : '—', tpl(TX.pFuerzas, { a: adh.ok, b: adh.tot })),
      stat(TX.pSesiones, String(U.totalFuerza()), TX.pDeFuerza),
      stat(TX.pRacha, String(U.racha(hoy)), TX.pDiasCumplidos)));

    // alertas inteligentes
    alertas().forEach(a => root.append(a));

    // ---- gráfica de peso ----
    const cardP = el('div', { id: 'p-peso', class: 'card chart-card' });
    const headP = el('div', { class: 'card-title' },
      el('div', null, el('h2', null, TX.pPesoTitulo), el('div', { class: 'sub' }, TX.pPesoSub)),
      el('button', { class: 'tbl-toggle', onclick: ev => { const t = cardP.querySelector('.ptable'); t.hidden = !t.hidden; ev.target.textContent = t.hidden ? TX.pTabla : TX.pGrafica; } }, TX.pTabla));
    cardP.append(headP, chartPeso());
    const pt = el('div', { class: 'ptable', hidden: '' });
    const tbl = el('table', null, el('tr', null, el('th', null, TX.pFecha), el('th', null, 'kg')));
    Object.keys(S.dias).filter(f => S.dias[f].peso).sort().reverse().slice(0, 30).forEach(f =>
      tbl.append(el('tr', null, el('td', null, U.fmtFecha(f)), el('td', { class: 'sr' }, U.kg1(S.dias[f].peso)))));
    pt.append(el('div', { class: 'tw' }, tbl));
    cardP.append(pt);
    root.append(cardP);

    // ---- cintura ----
    root.append(el('div', { id: 'p-cint', class: 'card chart-card' },
      el('div', { class: 'card-title' }, el('div', null, el('h2', null, TX.pCinturaTitulo), el('div', { class: 'sub' }, tpl(TX.pCinturaTituloSub, { m: metaCint })))),
      chartCintura()));

    // ---- cargas ----
    const cardC = el('div', { id: 'p-carg', class: 'card chart-card' });
    cardC.append(el('div', { class: 'card-title' }, el('div', null, el('h2', null, TX.pCargas), el('div', { class: 'sub' }, TX.pCargasSub))));
    /* las gráficas de cargas siguen a TU plan: los tres ejercicios cargables
       más presentes en tu calendario, no los tres del plan original */
    let LIFTS;
    if (D.__gen) {
      const cuenta = {};
      const usados = new Set();
      D.CAL.forEach(wk => wk.dias.forEach(x => { const s = typeof x === 'object' ? x.s : x; if (s && s !== 'libre') usados.add(s); }));
      usados.forEach(id => ((D.SESIONES[id] || {}).bloques || []).forEach(b => {
        const eq = (D.EJERCICIOS[b.e] || {}).equipo || '';
        if (!/^(nada|toalla)/i.test(eq) || /mochila/i.test(eq)) cuenta[b.e] = (cuenta[b.e] || 0) + 1;
      }));
      const cols = [COL.banca, COL.sent, COL.rdl];
      LIFTS = Object.entries(cuenta).sort((a, b) => b[1] - a[1]).slice(0, 3)
        .map(([id], i) => [id, (D.EJERCICIOS[id].nombre || id).replace(/\s*\([^)]*\)\s*$/, '').split(' ').slice(0, 2).join(' '), cols[i]]);
    }
    if (!LIFTS || !LIFTS.length)
      LIFTS = [['press-banca', TX.pLifts['press-banca'], COL.banca], ['sentadilla-barra', TX.pLifts['sentadilla-barra'], COL.sent], ['rdl-barra', TX.pLifts['rdl-barra'], COL.rdl]];
    let liftSel = LIFTS.some(l => l[0] === S.ui.lift) ? S.ui.lift : LIFTS[0][0];
    const seg = el('div', { class: 'seg' });
    const chartHolder = el('div');
    LIFTS.forEach(([id, n]) => {
      seg.append(el('button', { class: id === liftSel ? 'on' : '', onclick: ev => {
        liftSel = id; S.ui.lift = id; U.save();
        seg.querySelectorAll('button').forEach(b => b.classList.remove('on'));
        ev.target.classList.add('on');
        chartHolder.innerHTML = ''; chartHolder.append(chartCargas(liftSel));
      } }, n));
    });
    chartHolder.append(chartCargas(liftSel));
    cardC.append(seg, chartHolder);
    root.append(cardC);

    // ---- adherencia semanal ----
    root.append(el('div', { id: 'p-adh', class: 'card chart-card' },
      el('div', { class: 'card-title' }, el('div', null, el('h2', null, TX.pAdhTitulo), el('div', { class: 'sub' }, TX.pAdhSub))),
      chartAdherencia()));

    // checkpoints
    root.append(el('div', { id: 'p-chk', class: 'sec-h' }, el('h2', null, TX.pChk)));
    const tc = el('table', null, el('tr', null, el('th', null, TX.pFecha), el('th', null, TX.pEsperado), el('th', null, TX.pReal), el('th', null, TX.pSiDesvias)));
    D.CHECKPOINTS.forEach(c => {
      const m = U.mediaSemana(c.sem);
      /* el corredor es un corredor: se comprueban LOS DOS lados. Antes, quien
         bajaba de más recibía un ✓ verde mientras la alerta de ritmo le decía
         que frenara — dos componentes de la misma pantalla en contra. */
      const G = TX.gen || {};
      const fuera = m === null ? null : (m < c.rango[0] ? 'bajo' : m > c.rango[1] ? 'alto' : null);
      const estado = m === null ? '—' : (!fuera ? '✓ ' + U.kg1(m) : (fuera === 'bajo' ? '↓ ' : '↑ ') + U.kg1(m));
      const glosa = m === null ? null : (!fuera ? G.chkDentro : fuera === 'bajo' ? G.chkBajo : G.chkAlto);
      tc.append(el('tr', w === c.sem ? { class: 'now' } : null,
        el('td', null, 'S' + c.sem + ' · ' + U.fmtCorta(c.fecha)),
        el('td', { class: 'sr' }, U.kg1(c.rango[0]) + '–' + U.kg1(c.rango[1])),
        el('td', { class: 'sr' }, estado, glosa ? el('div', { class: 'mini' }, glosa) : null),
        el('td', { class: 'mini' }, c.si)));
    });
    root.append(el('div', { class: 'tw' }, tc));

    function stat(l, v, d) { return el('div', { class: 'stat' }, el('div', { class: 'sl' }, l), el('div', { class: 'sv num' }, v), el('div', { class: 'sd' }, d)); }
    function ultimaCintura() {
      const fs = Object.keys(S.dias).filter(f => S.dias[f].cintura).sort();
      return fs.length ? { f: fs[fs.length - 1], v: S.dias[fs[fs.length - 1]].cintura } : null;
    }
    function adherenciaGlobal() {
      let ok = 0, tot = 0;
      for (let i = 1; i <= Math.min(w || 0, SEMANAS); i++) U.sesionesFuerzaSemana(i).forEach(s => { if (s.f <= hoy) { tot++; if (s.hecho) ok++; } });
      return { ok, tot };
    }
    function alertas() {
      const out = [];
      /* Ritmo con DIRECCIÓN: el corredor del perfil dice hacia dónde y a qué
         velocidad debe moverse la báscula. Reñir a quien gana músculo por «no
         perder» era heredar la lógica del plan original. Los deltas ignoran
         las semanas de diet break (y la siguiente), estén donde estén. */
      const G = TX.gen || {};
      const objv = D.META.perfil.objetivoKg || [D.META.perfil.pesoSalida, D.META.perfil.pesoSalida];
      const ritmo = (D.META.perfil.pesoSalida - (Math.min(objv[0], objv[1]) + Math.max(objv[0], objv[1])) / 2) / SEMANAS;
      const esBreak = wk => { const h = D.HITOS_SEMANA[wk]; return h && (h.tipo === 'dietbreak' || (!D.__gen && wk === 7)); };
      const deltas = [];
      for (let i = 1; i < ms.length; i++) {
        if (ms[i].w - ms[i - 1].w === 1 && !esBreak(ms[i].w) && !esBreak(ms[i].w - 1)) deltas.push(ms[i - 1].m - ms[i].m);
      }
      const d2 = deltas.slice(-2);
      if (d2.length === 2) {
        if (ritmo > 0.05) {          // el plan baja: delta positivo = pérdida
          if (d2.every(x => x > Math.max(1.0, 2 * ritmo))) out.push(el('div', { class: 'banner hot' }, el('div', null, el('b', null, TX.pRapido), el('div', null, G.alRapidoBaja || D.AJUSTES[0].accion))));
          else if (d2.every(x => x < 0.5 * ritmo) && w > 3) out.push(el('div', { class: 'banner warn' }, el('div', null, el('b', null, TX.pLento), el('div', null, G.alLentoBaja || D.AJUSTES[1].accion))));
        } else if (ritmo < -0.05) {  // el plan sube: se vigila la ganancia
          const g = -ritmo;
          if (d2.every(x => -x > Math.max(0.35, 2.5 * g))) out.push(el('div', { class: 'banner hot' }, el('div', null, el('b', null, TX.pRapido), el('div', null, G.alRapidoSube))));
          else if (d2.every(x => -x < 0.4 * g) && w > 3) out.push(el('div', { class: 'banner warn' }, el('div', null, el('b', null, TX.pLento), el('div', null, G.alLentoSube))));
        } else if (G.alMantenT) {    // mantener: solo la deriva sostenida avisa
          if ((d2.every(x => x > 0.4) || d2.every(x => x < -0.4)) && w > 3)
            out.push(el('div', { class: 'banner warn' }, el('div', null, el('b', null, G.alMantenT), el('div', null, G.alMantenD))));
        }
      }
      // checkpoint de esta semana
      const cp = D.CHECKPOINTS.find(c => c.sem === w);
      if (cp) { const m = U.mediaSemana(w); out.push(el('div', { class: 'banner' }, el('div', null, el('b', null, TX.pCheckpointSemana), el('div', null, tpl(TX.pEsperadoRango, { a: U.kg1(cp.rango[0]), b: U.kg1(cp.rango[1]) }) + (m ? tpl(TX.pLlevas, { v: U.kg1(m) }) : TX.pSinPesajes))))); }
      // ACWR del trote
      if (w >= 4 && w <= SEMANAS) {
        const carga = wk => { let m = 0; const fs = U.fechasSemana(wk); for (let i = 0; i < 7; i++) { const f = U.addDays(fs.ini, i), dd = S.dias[f], sl = U.slotDe(f); if (dd && dd.sesionOk && sl && sl.ses.tipo === 'cardio' && sl.ses.icono === 'run') m += dd.cardioMin || 28; } return m; };
        const prev = []; for (let i = Math.max(3, w - 4); i < w; i++) prev.push(carga(i));
        const media = prev.length ? prev.reduce((a, b) => a + b, 0) / prev.length : 0;
        const acwr = media > 0 ? carga(w) / media : 0;
        if (acwr > 1.3) out.push(el('div', { class: 'banner warn' }, el('div', null, el('b', null, TX.pFrenaTrote), el('div', null, tpl(TX.pFrenaTxt, { r: Math.round(acwr * 100) / 100 })))));
      }
      return out;
    }
  }

  /* ---- motor de gráficas mono-serie ---- */
  function baseSVG(W, H, rotulo) {
    const svg = sv('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img' });
    // Sin nombre accesible, un role="img" deja toda la vista Progreso invisible
    // para un lector de pantalla (WCAG 1.1.1).
    if (rotulo) svg.setAttribute('aria-label', rotulo);
    svg.style.touchAction = 'pan-y';
    return svg;
  }
  /* El rótulo lleva el resumen del dato, no solo el título: es lo que da un
     vistazo a la gráfica y lo que un "Gráfica de peso" a secas no dice. */
  function rotulo(titulo, valores, unidad) {
    if (!valores || !valores.length) return titulo + ': ' + TX.gSinDatos;
    const a = nice(Math.min(...valores)), b = nice(Math.max(...valores));
    // con un solo punto no hay rango que dar, y "1 registros" chirría
    if (valores.length === 1) return titulo + ': ' + tpl(TX.gUnico, { a, u: unidad });
    return titulo + ': ' + tpl(TX.gRango, { n: valores.length, a, b, u: unidad });
  }
  function nice(v) { return String(Math.round(v * 10) / 10).replace('.', ','); }

  function chartPeso() {
    const S = U.S, W = 640, H = 260, L = 40, R = 14, T = 16, B = 28;
    const dias = SEMANAS * 7;
    const pesos = Object.keys(S.dias).filter(f => S.dias[f].peso).sort()
      .map(f => ({ x: diaIdx(f), y: S.dias[f].peso, f })).filter(p => p.x >= -7 && p.x <= dias);
    const ms = U.mediasSemanales().map(m => ({ x: (m.w - 1) * 7 + 3, y: m.m, w: m.w }));
    /* dominio y corredor: del perfil del plan (salida → objetivo), pasando por
       los checkpoints generados — la banda del dueño murió con el revamp */
    const salida = D.META.perfil.pesoSalida;
    const objv = D.META.perfil.objetivoKg || [salida - 1, salida + 1];
    const objLo = Math.min(objv[0], objv[1]), objHi = Math.max(objv[0], objv[1]);
    const ys = pesos.map(p => p.y).concat([salida, objLo, objHi]);
    const yMin = Math.floor(Math.min(...ys) - 1), yMax = Math.ceil(Math.max(...ys) + 0.5);
    const sx = x => L + (x + 7) / (dias + 7) * (W - L - R);
    const sy = y => T + (yMax - y) / (yMax - yMin) * (H - T - B);
    const svg = baseSVG(W, H, rotulo(TX.gPeso, pesos.map(p => p.y), 'kg'));
    // corredor esperado (banda neutra)
    const cor = [[0, salida + 0.5, salida - 0.5]].concat((D.CHECKPOINTS || [])
      .filter(c => c.rango).map(c => [c.sem * 7 - 1, Math.max(c.rango[0], c.rango[1]), Math.min(c.rango[0], c.rango[1])]));
    const up = cor.map(c => sx(c[0]) + ',' + sy(c[1])).join(' ');
    const lo = cor.slice().reverse().map(c => sx(c[0]) + ',' + sy(c[2])).join(' ');
    svg.append(sv('polygon', { points: up + ' ' + lo, fill: 'rgba(255,255,255,.055)' }));
    svg.append(sv('polyline', { points: up, fill: 'none', stroke: 'rgba(255,255,255,.16)', 'stroke-dasharray': '3 4', 'stroke-width': 1 }));
    svg.append(sv('polyline', { points: cor.map(c => sx(c[0]) + ',' + sy(c[2])).join(' '), fill: 'none', stroke: 'rgba(255,255,255,.16)', 'stroke-dasharray': '3 4', 'stroke-width': 1 }));
    // zona de agua de las primeras semanas: solo cuando el plan baja
    if (objLo < salida) {
      svg.append(sv('rect', { x: sx(0), y: T, width: sx(14) - sx(0), height: H - T - B, fill: 'rgba(102,160,232,.05)' }));
      const zc = sv('text', { x: sx(7), y: T + 11, 'text-anchor': 'middle', 'font-size': 11, fill: 'rgba(167,175,185,.9)' }); zc.textContent = TX.pAguaCreatina; svg.append(zc);
    }
    // grid Y
    for (let y = yMin + 1; y < yMax; y += 2) {
      svg.append(sv('line', { x1: L, x2: W - R, y1: sy(y), y2: sy(y), stroke: 'rgba(255,255,255,.05)' }));
      const t = sv('text', { x: L - 6, y: sy(y) + 3.5, 'text-anchor': 'end', 'font-size': 10, fill: EJE() }); t.textContent = y; svg.append(t);
    }
    // eje X: S1..S12 (cada 2)
    for (let wk = 1; wk <= SEMANAS; wk += EJE_PASO) {
      const x = sx((wk - 1) * 7 + 3);
      const t = sv('text', { x, y: H - 8, 'text-anchor': 'middle', 'font-size': 10, fill: EJE() }); t.textContent = 'S' + wk; svg.append(t);
    }
    // pesajes (puntos suaves)
    pesos.forEach(p => svg.append(sv('circle', { cx: sx(p.x), cy: sy(p.y), r: 3, fill: COL.peso, opacity: .38 })));
    // media semanal (línea + marcadores)
    if (ms.length) {
      svg.append(sv('polyline', { points: ms.map(p => sx(p.x) + ',' + sy(p.y)).join(' '), fill: 'none', stroke: COL.peso, 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
      ms.forEach(p => svg.append(sv('circle', { cx: sx(p.x), cy: sy(p.y), r: 4, fill: COL.peso, stroke: '#14171B', 'stroke-width': 2 })));
      const last = ms[ms.length - 1];
      const lb = sv('text', { x: Math.min(sx(last.x) + 8, W - 44), y: sy(last.y) - 8, 'font-size': 11.5, 'font-weight': 700, fill: COL.peso }); lb.textContent = nice(last.y); svg.append(lb);
    } else {
      const t = sv('text', { x: W / 2, y: H / 2, 'text-anchor': 'middle', 'font-size': 12, fill: EJE() }); t.textContent = TX.pVacioPeso; svg.append(t);
    }
    return conTooltip(svg, pesos.concat(ms.map(m => ({ x: m.x, y: m.y, w: m.w }))), sx, sy, p => (p.w ? tpl(TX.pMediaSemana, { w: p.w }) : U.fmtFecha(p.f)) + ' · ' + nice(p.y) + ' kg');
  }

  function chartCintura() {
    const S = U.S, W = 640, H = 200, L = 40, R = 14, T = 14, B = 28, dias = SEMANAS * 7;
    const pts = Object.keys(S.dias).filter(f => S.dias[f].cintura).sort().map(f => ({ x: diaIdx(f), y: S.dias[f].cintura, f }));
    if (U.S.config.cinturaBase && !pts.some(p => p.x <= 0)) pts.unshift({ x: -3, y: U.S.config.cinturaBase, base: true });
    const M = D.META.perfil.cinturaMetaCm || 91;          // la meta sale del perfil
    const ys = pts.map(p => p.y).concat([M - 1, U.S.config.cinturaBase || M + 9]);
    const yMin = Math.floor(Math.min(...ys, M - 2) - 1), yMax = Math.ceil(Math.max(...ys) + 1);
    const sx = x => L + (x + 7) / (dias + 7) * (W - L - R);
    const sy = y => T + (yMax - y) / (yMax - yMin) * (H - T - B);
    const svg = baseSVG(W, H, rotulo(TX.gCintura, pts.map(p => p.y), 'cm'));
    // línea de meta
    svg.append(sv('line', { x1: L, x2: W - R, y1: sy(M), y2: sy(M), stroke: 'rgba(255,255,255,.22)', 'stroke-dasharray': '5 4' }));
    const mt = sv('text', { x: W - R, y: sy(M) - 5, 'text-anchor': 'end', 'font-size': 10, fill: EJE2() }); mt.textContent = tpl(TX.pMeta91, { m: M }); svg.append(mt);
    for (let wk = 1; wk <= SEMANAS; wk += EJE_PASO) { const t = sv('text', { x: sx((wk - 1) * 7 + 3), y: H - 8, 'text-anchor': 'middle', 'font-size': 10, fill: EJE() }); t.textContent = 'S' + wk; svg.append(t); }
    for (let y = yMin + 1; y < yMax; y += 2) { svg.append(sv('line', { x1: L, x2: W - R, y1: sy(y), y2: sy(y), stroke: 'rgba(255,255,255,.05)' })); const t = sv('text', { x: L - 6, y: sy(y) + 3.5, 'text-anchor': 'end', 'font-size': 10, fill: EJE() }); t.textContent = y; svg.append(t); }
    if (pts.length) {
      svg.append(sv('polyline', { points: pts.map(p => sx(p.x) + ',' + sy(p.y)).join(' '), fill: 'none', stroke: COL.cintura, 'stroke-width': 2, 'stroke-linejoin': 'round' }));
      pts.forEach(p => svg.append(sv('circle', { cx: sx(p.x), cy: sy(p.y), r: 4, fill: COL.cintura, stroke: '#14171B', 'stroke-width': 2 })));
      const last = pts[pts.length - 1];
      const lb = sv('text', { x: Math.min(sx(last.x) + 8, W - 40), y: sy(last.y) - 8, 'font-size': 11.5, 'font-weight': 700, fill: COL.cintura }); lb.textContent = nice(last.y); svg.append(lb);
    } else {
      const t = sv('text', { x: W / 2, y: H / 2, 'text-anchor': 'middle', 'font-size': 12, fill: EJE() }); t.textContent = TX.pVacioCintura; svg.append(t);
    }
    return conTooltip(svg, pts, sx, sy, p => (p.base ? TX.pLineaBase : U.fmtFecha(p.f)) + ' · ' + nice(p.y) + ' cm');
  }

  function chartCargas(ejId) {
    const col = ejId === 'press-banca' ? COL.banca : ejId === 'sentadilla-barra' ? COL.sent : COL.rdl;
    const hist = U.historial(ejId, 40);
    const W = 640, H = 200, L = 40, R = 16, T = 16, B = 26;
    const svg = baseSVG(W, H, rotulo(TX.gCargas + ' · ' + D.EJERCICIOS[ejId].nombre, hist.map(h => h.kg), 'kg'));
    if (!hist.length) {
      const t = sv('text', { x: W / 2, y: H / 2, 'text-anchor': 'middle', 'font-size': 12, fill: EJE() }); t.textContent = TX.pVacioCargas; svg.append(t);
      return svg;
    }
    const marca = D.HISTORICO[ejId];
    const pts = hist.map((h, i) => ({ x: i, y: h.kg, f: h.fecha, falta: h.falta }));
    const ys = pts.map(p => p.y);
    const yMin = Math.max(0, Math.floor(Math.min(...ys) - 5));
    const yMax = Math.ceil(Math.max(...ys, marca ? marca.kg : 0) + 5);
    const sx = x => L + (pts.length === 1 ? .5 : x / (pts.length - 1)) * (W - L - R);
    const sy = y => T + (yMax - y) / (yMax - yMin || 1) * (H - T - B);
    for (let y = Math.ceil(yMin / 10) * 10; y <= yMax; y += 10) { svg.append(sv('line', { x1: L, x2: W - R, y1: sy(y), y2: sy(y), stroke: 'rgba(255,255,255,.05)' })); const t = sv('text', { x: L - 6, y: sy(y) + 3.5, 'text-anchor': 'end', 'font-size': 10, fill: EJE() }); t.textContent = y; svg.append(t); }
    // diana: la marca de su etapa anterior
    if (marca) {
      svg.append(sv('line', { x1: L, x2: W - R, y1: sy(marca.kg), y2: sy(marca.kg), stroke: 'rgba(242,244,240,.34)', 'stroke-dasharray': '6 4', 'stroke-width': 1.5 }));
      const mt = sv('text', { x: W - R, y: sy(marca.kg) - 6, 'text-anchor': 'end', 'font-size': 10, fill: EJE2() });
      mt.textContent = tpl(TX.pTuMarca, { v: marca.kg }); svg.append(mt);
    }
    svg.append(sv('polyline', { points: pts.map(p => sx(p.x) + ',' + sy(p.y)).join(' '), fill: 'none', stroke: col, 'stroke-width': 2, 'stroke-linejoin': 'round' }));
    const maxY = Math.max(...ys);
    pts.forEach(p => {
      svg.append(sv('circle', { cx: sx(p.x), cy: sy(p.y), r: 4, fill: p.falta ? '#14171B' : col, stroke: col, 'stroke-width': 2 }));
      if (p.y === maxY && !p.falta) { const s = sv('text', { x: sx(p.x), y: sy(p.y) - 9, 'text-anchor': 'middle', 'font-size': 12 }); s.textContent = '⭐'; svg.append(s); }
    });
    const last = pts[pts.length - 1];
    const lb = sv('text', { x: Math.min(sx(last.x) + 8, W - 40), y: sy(last.y) + 4, 'font-size': 11.5, 'font-weight': 700, fill: col }); lb.textContent = nice(last.y); svg.append(lb);
    return conTooltip(svg, pts, sx, sy, p => U.fmtFecha(p.f) + ' · ' + nice(p.y) + ' kg' + (p.falta ? ' · ' + TX.repsAMediasTag : ''));
  }

  function chartAdherencia() {
    const hoy = U.hoyISO(), wNow = U.semanaDe(hoy);
    const W = 640, H = 190, L = 34, R = 10, T = 16, B = 26;
    const wMax = wNow >= 1 && wNow <= SEMANAS ? wNow : (wNow === 99 ? SEMANAS : 0);
    const svg = baseSVG(W, H, TX.gAdherencia + ': ' + (wMax ? tpl(TX.gSemanas, { n: wMax, t: SEMANAS }) : TX.gSinDatos));
    if (!wMax) { const t = sv('text', { x: W / 2, y: H / 2, 'text-anchor': 'middle', 'font-size': 12, fill: EJE() }); t.textContent = TX.pVacioAdh; svg.append(t); return svg; }
    const bw = (W - L - R) / SEMANAS;
    const sy = v => T + (1 - v) * (H - T - B);
    [.5, 1].forEach(v => { svg.append(sv('line', { x1: L, x2: W - R, y1: sy(v), y2: sy(v), stroke: 'rgba(255,255,255,.05)' })); const t = sv('text', { x: L - 5, y: sy(v) + 3.5, 'text-anchor': 'end', 'font-size': 10, fill: EJE() }); t.textContent = v * 100 + '%'; svg.append(t); });
    const tips = [];
    for (let i = 1; i <= SEMANAS; i++) {
      const x = L + (i - 1) * bw + 3, wdt = bw - 6;
      const t = sv('text', { x: x + wdt / 2, y: H - 8, 'text-anchor': 'middle', 'font-size': 10, fill: i === wNow ? '#F2F4F0' : EJE() }); t.textContent = 'S' + i; svg.append(t);
      if (i > wMax) { svg.append(sv('rect', { x, y: sy(0) - 2, width: wdt, height: 2, rx: 1, fill: 'rgba(255,255,255,.07)' })); continue; }
      const ses = U.sesionesFuerzaSemana(i).filter(s => s.f <= hoy);
      const tot = U.sesionesFuerzaSemana(i).length;
      const done = ses.filter(s => s.hecho).length;
      const v = tot ? done / tot : 0;
      const hgt = Math.max(3, (H - T - B) * v);
      svg.append(sv('rect', { x, y: sy(0) - hgt, width: wdt, height: hgt, rx: 4, fill: COL.peso, opacity: i === wNow ? 1 : .78 }));
      if (v > 0) { const pt = sv('text', { x: x + wdt / 2, y: sy(0) - hgt - 5, 'text-anchor': 'middle', 'font-size': 10, fill: i === wNow ? '#F2F4F0' : EJE() }); pt.textContent = done + '/' + tot; svg.append(pt); }
      tips.push({ x: i, y: v, cx: x + wdt / 2, cy: sy(0) - hgt, txt: 'S' + i + ' · ' + done + ' de ' + tot + ' fuerzas' });
    }
    return svg;
  }

  // tooltip táctil/ratón compartido (crosshair al punto más cercano)
  function conTooltip(svg, pts, sx, sy, fmt) {
    const wrap = el('div', { class: 'chart-wrap' });
    wrap.append(svg);
    if (!pts.length) return wrap;
    const tip = el('div', { class: 'ctip' });
    wrap.append(tip);
    const marker = sv('circle', { r: 7, fill: 'none', stroke: '#F2F4F0', 'stroke-width': 1.5, opacity: 0 });
    svg.append(marker);
    function move(ev) {
      const r = svg.getBoundingClientRect();
      const px = (ev.touches ? ev.touches[0].clientX : ev.clientX) - r.left;
      const vx = px / r.width * 640;
      let best = null, bd = 1e9;
      pts.forEach(p => { const d = Math.abs(sx(p.x) - vx); if (d < bd) { bd = d; best = p; } });
      if (!best || bd > 60) { hide(); return; }
      marker.setAttribute('cx', sx(best.x)); marker.setAttribute('cy', sy(best.y)); marker.setAttribute('opacity', .9);
      tip.style.display = 'block';
      tip.innerHTML = fmt(best);
      const tx = sx(best.x) / 640 * r.width;
      tip.style.left = Math.min(Math.max(tx - 40, 4), r.width - 130) + 'px';
      tip.style.top = Math.max(sy(best.y) / (svg.viewBox.baseVal.height) * r.height - 44, 2) + 'px';
    }
    function hide() { tip.style.display = 'none'; marker.setAttribute('opacity', 0); }
    svg.addEventListener('pointermove', move);
    svg.addEventListener('pointerdown', move);
    svg.addEventListener('pointerleave', hide);
    return wrap;
  }

  /* ==================== LOGROS ==================== */
  function renderLogros(root) {
    const S = U.S;
    // la vitrina se pone al día al entrar: un checkpoint ganado no espera al siguiente toggle
    U.evaluaLogros();
    root.append(el('div', { class: 'sec-h' }, el('h2', null, TX.lDiscos), el('span', { class: 'mini' }, TX.lDiscosSub)));
    const vit = el('div', { class: 'vitrina' });
    [['disco-10', '10', TX.fase + ' 1'], ['disco-15', '15', TX.fase + ' 2'], ['disco-20', '20', TX.fase + ' 3'], ['disco-25', '25', TX.fase + ' 4']].forEach(([id, kg, f]) => {
      const won = !!S.logros[id];
      const slot = el('div', { class: 'vslot' + (won ? ' won' : '') });
      const caja = el('div', { class: 'vdisc' });
      if (won) caja.append(U.discoSVG(kg, 60));
      else caja.append(el('span', { class: 'disco big locked' }, kg));
      slot.append(caja, el('div', { class: 'vn' }, f));
      vit.append(slot);
    });
    root.append(vit);

    // stats
    const mejor = U.mejorRacha();
    root.append(el('div', { class: 'statrow' },
      st(TX.lFuerzas, String(U.totalFuerza())), st(TX.lPRs, String(S.prCount || 0)),
      st(TX.lPerdido, U.bajadaMax() > 0 ? '−' + U.kg1(U.bajadaMax()) : '—'),
      st(TX.lMejorRacha, String(mejor)),
      st(TX.lLogrosN, Object.keys(S.logros).length + '/' + D.LOGROS.length),
      st(TX.lFotos, D.FOTOS.filter(f => S.dias[f] && S.dias[f].foto).length + '/' + D.FOTOS.length)));

    root.append(el('div', { class: 'sec-h' }, el('h2', null, TX.lLogros)));
    const grid = el('div', { class: 'badges' });
    D.LOGROS.filter(l => !l.disco).forEach(l => {
      const won = S.logros[l.id];
      grid.append(el('div', { class: 'b2-badge' + (won ? '' : ' locked') },
        el('div', { class: 'bi' }, U.icoLogro ? U.icoLogro(l, 30) : l.icon),
        el('div', { class: 'bn' }, l.nombre),
        el('div', { class: 'bd' }, l.desc),
        won ? el('div', { class: 'bwhen' }, '✓ ' + U.fmtCorta(won)) : null));
    });
    root.append(grid);
    root.append(el('div', { class: 'banner ok', style: 'margin-top:16px' }, el('div', null, el('b', null, TX.recuerda), el('div', null, D.CIERRE))));

    function st(l, v) { return el('div', { class: 'stat' }, el('div', { class: 'sl' }, l), el('div', { class: 'sv num' }, v)); }
  }

  /* registro de vistas */
  function render() { location.hash = location.hash; dispatchEvent(new HashChangeEvent('hashchange')); }
  /* ---- QUIZ: prototipo del cuestionario modo Tinder (Fase 1 del revamp) ----
     Sin enlazar desde la barra a proposito: se entra por #/quiz. Solo el mazo
     de gustos de ejercicios; los pasos de datos vendran despues. La fisica es
     la misma familia que la hoja inferior: velocidad en ventana de 90 ms,
     proyeccion de inercia, y el compromiso se decide por DONDE VA el gesto,
     no por donde sueltas. Botones equivalentes al gesto y deshacer, por regla
     de accesibilidad y por cortesia. */
  /* ---- CUESTIONARIO (Fase 1): pasos de datos -> mazo de gustos -> perfil ----
     Una pregunta por pantalla. Las de opcion avanzan solas al tocar (el toque
     ES la respuesta); numeros y multiseleccion piden Continuar. Borrador en
     S.ui.cuest: puedes salir y volver donde ibas. El resultado es S.perfil,
     el contrato que consumira generarPlan(). */
  function renderQuiz(root) {
    const TX = U.TX, C = TX.cuest, S = U.S, tpl = U.tpl;
    const borr = S.ui.cuest = S.ui.cuest || { paso: 0, d: {} };
    const d = borr.d;
    /* Rehacer no es re-empezar: con perfil guardado, el borrador arranca
       relleno con tus respuestas (mazo incluido) — cambiar un dato son dos
       toques, no 16 pantallas. */
    if (S.perfil && !Object.keys(d).length) {
      ['sexo', 'edad', 'alturaCm', 'pesoKg', 'cinturaCm', 'objetivo', 'evento', 'duracionSem', 'historial',
        'diasSemana', 'minSesion', 'franja', 'material', 'lesiones', 'medico', 'dieta', 'sin'].forEach(k => {
        if (S.perfil[k] !== undefined) d[k] = Array.isArray(S.perfil[k]) ? S.perfil[k].slice() : S.perfil[k];
      });
      if (d.medico === true) d.medicoOk = 1;      // el visto bueno ya se dio una vez
      /* los gustos previos solo se siembran cuando el mazo NO se re-juega
         («solo datos» o entrada directa); en «solo gustos» y «todo» el mazo
         empieza de cero a propósito */
      if (!S.ui.quiz && borr.solo !== 'gustos' && borr.solo !== 'todo') {
        const g = S.perfil.gustos || {};
        S.ui.quiz = { like: {}, no: {} };
        (g.like || []).forEach(k => S.ui.quiz.like[k] = 1);
        (g.no || []).forEach(k => S.ui.quiz.no[k] = 1);
      }
      U.save();
    }

    const PASOS_TODOS = [
      { id: 'sexo', t: C.sexoT, p: C.sexoP, tipo: 'uno', ops: [['h', C.sexoH], ['m', C.sexoM], ['x', C.sexoX]] },
      { id: 'medidas', t: C.medidasT, tipo: 'nums', campos: [
        ['edad', C.edadL, 16, 90, false], ['alturaCm', C.alturaL, 120, 230, false],
        ['pesoKg', C.pesoL, 35, 250, false], ['cinturaCm', C.cinturaL, 50, 200, true]] },
      { id: 'objetivo', t: C.objT, tipo: 'uno', ops: [['perder', C.objPerder], ['recomp', C.objRecomp], ['ganar', C.objGanar], ['mantener', C.objMantener]] },
      { id: 'evento', t: C.evT, tipo: 'uno', ops: [['boda', C.evBoda], ['oposicion', C.evOpo], ['verano', C.evVerano], ['siempre', C.evSiempre]] },
      // la fecha solo se pregunta si el evento la tiene: «para siempre» no la tiene
      { id: 'eventoFecha', t: C.evFechaT, p: C.evFechaP, tipo: 'fecha', si: d => d.evento && d.evento !== 'siempre' },
      { id: 'duracionSem', t: C.durT, tipo: 'uno', ops: [[12, C.dur3], [24, C.dur6], [48, C.dur12], [0, C.durAlways]] },
      { id: 'historial', t: C.histT, p: C.histP, tipo: 'uno', ops: [['nunca', C.histNunca], ['retomador', C.histRetoma], ['activo', C.histActivo]] },
      { id: 'diasSemana', t: C.diasL, tipo: 'uno', fila: true, ops: [[2, '2'], [3, '3'], [4, '4'], [5, '5'], [6, '6']] },
      { id: 'minSesion', t: C.minL, tipo: 'uno', fila: true, ops: [[30, '30'], [45, '45'], [60, '60'], [75, '75+']] },
      { id: 'franja', t: C.franjaT, tipo: 'uno', ops: [['manana', C.franjaM], ['mediodia', C.franjaMd], ['tarde', C.franjaT2]] },
      { id: 'material', t: C.matT, tipo: 'uno', ops: [['nada', C.matNada], ['casa', C.matCasa], ['gym', C.matGym]] },
      { id: 'lesiones', t: C.lesT, tipo: 'multi', ops: [['rodilla', C.lesRodilla], ['hombro', C.lesHombro], ['lumbar', C.lesLumbar]], nada: C.lesNo },
      { id: 'medico', t: C.medT, tipo: 'uno', fila: true, ops: [[true, C.si], [false, C.no]] },
      { id: 'dieta', t: C.dietaT, tipo: 'uno', ops: [['normal', C.dietaNormal], ['vegetariano', C.dietaVegetariano], ['vegano', C.dietaVegano]] },
      { id: 'sin', t: C.sinT, tipo: 'multi', ops: [['gluten', C.sinGluten], ['lactosa', C.sinLactosa], ['frutos', C.sinFrutos]], nada: C.sinNada },
      { id: 'mazo', tipo: 'mazo' },
      { id: 'resumen', tipo: 'resumen' }
    ];
    /* Los pasos VIVOS se recalculan en cada pintado: un paso condicional
       (la fecha del evento) depende de una respuesta anterior, así que
       filtrar una sola vez al montar lo dejaba fuera para siempre. */
    const pasosVivos = () => PASOS_TODOS
      .filter(x => !x.si || x.si(d))
      .filter(x => borr.solo === 'gustos' ? (x.tipo === 'mazo' || x.tipo === 'resumen')
        : borr.solo === 'datos' ? x.tipo !== 'mazo'
        : true);

    function guarda() { U.save(); }
    function avanza() { if (borr.paso < pasosVivos().length - 1) { borr.paso++; guarda(); pintaPaso(); } }
    function atras() { if (borr.paso > 0) { borr.paso--; guarda(); pintaPaso(); } }

    function pintaPaso() {
      root.innerHTML = '';
      const PASOS = pasosVivos();
      const paso = PASOS[borr.paso];
      // cabecera: titulo + barra de progreso (el mazo cuenta como un paso)
      root.append(el('div', { class: 'sec-h' }, el('h2', null, C.titulo),
        el('span', { class: 'mini' }, (borr.paso + 1) + '/' + PASOS.length),
        // con un plan ya generado, el cuestionario siempre tiene puerta de salida
        S.perfil ? el('button', { class: 'plano qaux', type: 'button', style: 'margin-left:10px',
          onclick: () => { location.hash = '#/hoy'; } }, TX.cerrarPanel) : null));
      const barra = el('div', { class: 'cuest-bar', role: 'progressbar',
        'aria-valuemin': '0', 'aria-valuemax': String(PASOS.length), 'aria-valuenow': String(borr.paso + 1) },
        // scaleX y no width: el progreso anima transform, nunca layout
        el('i', { style: 'transform:scaleX(' + ((borr.paso + 1) / PASOS.length).toFixed(4) + ')' }));
      root.append(barra);

      if (paso.tipo === 'mazo') { montaMazo(root, avanza, borr.paso > 0 ? atras : null); return; }
      if (paso.tipo === 'resumen') { pintaResumen(root); return; }

      root.append(el('div', { class: 'cuest-t' }, paso.t));
      if (paso.p) root.append(el('div', { class: 'cuest-p' }, paso.p));

      if (paso.tipo === 'uno') {
        const caja = el('div', { class: 'cuest-ops' + (paso.fila ? ' fila' : '') });
        paso.ops.forEach(op => {
          const val = op[0], txt = op[1];
          caja.append(el('button', { class: 'copt plano' + (d[paso.id] === val ? ' on' : ''), type: 'button',
            onclick: ev => {
              d[paso.id] = val; guarda();
              [...caja.children].forEach(x => x.classList.toggle('on', x === ev.currentTarget));
              /* La puerta médica salta AQUÍ, en el momento de la respuesta —
                 no cuatro pantallas después, cuando ya no se sabe qué la
                 activó. Y responder de nuevo resetea el visto bueno. */
              if (paso.id === 'medico') {
                delete d.medicoOk;
                if (val === true) { guarda(); setTimeout(pintaGate, 170); return; }
              }
              // el toque ES la respuesta: se marca y avanza solo
              setTimeout(avanza, 170);
            } }, txt));
        });
        root.append(caja);
      }

      if (paso.tipo === 'multi') {
        const arr = d[paso.id] = Array.isArray(d[paso.id]) ? d[paso.id] : [];
        const caja = el('div', { class: 'cuest-ops' });
        paso.ops.forEach(op => {
          const val = op[0], txt = op[1];
          caja.append(el('button', { class: 'copt plano' + (arr.includes(val) ? ' on' : ''), type: 'button',
            'aria-pressed': arr.includes(val) ? 'true' : 'false',
            onclick: ev => {
              const i = arr.indexOf(val);
              if (i >= 0) arr.splice(i, 1); else arr.push(val);
              guarda();
              ev.currentTarget.classList.toggle('on', arr.includes(val));
              ev.currentTarget.setAttribute('aria-pressed', arr.includes(val) ? 'true' : 'false');
            } }, txt));
        });
        // "ninguna": vacia y avanza — responder que no tambien es responder
        caja.append(el('button', { class: 'copt plano', type: 'button', onclick: () => {
          arr.length = 0; guarda(); setTimeout(avanza, 120);
        } }, paso.nada));
        root.append(caja);
        root.append(el('div', { class: 'cuest-pie' },
          el('button', { class: 'plano qaux', type: 'button', onclick: atras }, C.atras),
          el('button', { class: 'btn-b2p', type: 'button', onclick: avanza }, C.sigue)));
        return;
      }

      if (paso.tipo === 'fecha') {
        /* fecha del evento: el input nativo de fecha ya trae calendario,
           idioma y validación del sistema. Acotada a 2-12 meses porque es
           donde el motor sabe periodizar; saltarla es una opción de primera. */
        const hoy = new Date(); hoy.setHours(12, 0, 0, 0);
        const iso = dd => dd.getFullYear() + '-' + String(dd.getMonth() + 1).padStart(2, '0') + '-' + String(dd.getDate()).padStart(2, '0');
        const min = new Date(hoy); min.setDate(min.getDate() + 56);
        const max = new Date(hoy); max.setDate(max.getDate() + 350);
        const inp = el('input', { type: 'date', id: 'cuest-fecha', min: iso(min), max: iso(max),
          value: d[paso.id] || '' });
        root.append(el('div', { class: 'cuest-nums' }, el('div', { class: 'cnum' }, inp)));
        root.append(el('div', { class: 'cuest-pie' },
          el('button', { class: 'plano qaux', type: 'button', onclick: atras }, C.atras),
          el('button', { class: 'plano qaux', type: 'button', onclick: () => { delete d[paso.id]; guarda(); avanza(); } }, C.evFechaSaltar),
          el('button', { class: 'btn-b2p', type: 'button', onclick: () => {
            const val = (inp.value || '').trim();
            if (!val) { U.toast(C.evFechaMal); return; }
            if (val < iso(min) || val > iso(max)) { U.toast(C.evFechaMal); return; }
            d[paso.id] = val; guarda(); avanza();
          } }, C.sigue)));
        return;
      }

      if (paso.tipo === 'nums') {
        const caja = el('div', { class: 'cuest-nums' });
        const entradas = {};
        paso.campos.forEach(campo => {
          const id = campo[0], lbl = campo[1];
          const inp = el('input', { type: 'text', inputmode: 'decimal', id: 'cuest-' + id,
            value: d[id] !== undefined ? String(d[id]).replace('.', ',') : '' });
          entradas[id] = inp;
          caja.append(el('div', { class: 'cnum' }, el('label', { for: 'cuest-' + id }, lbl), inp));
        });
        root.append(caja);
        root.append(el('div', { class: 'cuest-pie' },
          borr.paso > 0 ? el('button', { class: 'plano qaux', type: 'button', onclick: atras }, C.atras) : el('span'),
          el('button', { class: 'btn-b2p', type: 'button', onclick: () => {
            for (const campo of paso.campos) {
              const id = campo[0], lbl = campo[1], min = campo[2], max = campo[3], opcional = campo[4];
              const bruto = (entradas[id].value || '').trim();
              if (!bruto) {
                if (opcional) { delete d[id]; continue; }
                U.toast(tpl(C.valNum, { c: lbl, a: min, b: max })); entradas[id].focus(); return;
              }
              const v = parseFloat(bruto.replace(',', '.'));
              if (!(v >= min && v <= max)) {
                U.toast(tpl(C.valNum, { c: lbl, a: min, b: max })); entradas[id].focus(); return;
              }
              d[id] = v;
            }
            guarda(); avanza();
          } }, C.sigue)));
        return;
      }

      // pie de las de opcion: solo Atras (avanzan solas)
      if (borr.paso > 0) root.append(el('div', { class: 'cuest-pie' },
        el('button', { class: 'plano qaux', type: 'button', onclick: atras }, C.atras), el('span')));
    }

    /* La pausa médica: qué respuesta la activó, qué llevarle al médico y las
       dos salidas honestas — seguir con el visto bueno, o salir con todo
       guardado. Nunca un callejón sin salida. */
    function pintaGate() {
      root.innerHTML = '';
      root.append(el('div', { class: 'sec-h' }, el('h2', null, C.titulo)));
      root.append(el('div', { class: 'cuest-t' }, C.gateT));
      root.append(el('div', { class: 'cuest-p' }, tpl(C.gateTxt, { d: d.diasSemana || 3 })));
      root.append(el('div', { class: 'banner warn' }, el('div', null, C.gateGuardado)));
      root.append(el('div', { class: 'cuest-pie' },
        el('button', { class: 'plano qaux', type: 'button', onclick: () => {
          S.ui.gate = 1; guarda(); location.hash = '#/hoy';   // el router la convierte en la pausa
        } }, C.gateSalir),
        el('button', { class: 'btn-b2p', type: 'button', onclick: () => { d.medicoOk = 1; guarda(); avanza(); } }, C.gateOk)));
    }

    function pintaResumen(cont) {
      const est = S.ui.quiz || { like: {}, no: {} };
      const apto = d.medico === false || d.medicoOk === 1;   // la edad ya la acota el propio campo (16–90)
      cont.append(el('div', { class: 'cuest-t' }, C.resT));
      cont.append(el('div', { class: 'cuest-p' }, C.resP));
      const dame = (id, val) => {
        const paso = pasosVivos().find(x => x.id === id); if (!paso || !paso.ops) return String(val);
        const op = paso.ops.find(o => o[0] === val); return op ? op[1] : String(val);
      };
      /* cada fila con su etiqueta: «Frutos secos» a secas no dice si te gustan
         o los evitas — el resumen es un contrato y se lee sin adivinar */
      const filas = [];
      if (d.edad) filas.push([null, d.edad + ' · ' + (d.alturaCm || '—') + ' cm · ' + (d.pesoKg || '—') + ' kg' + (d.sexo !== undefined ? ' · ' + dame('sexo', d.sexo) : ''), 'medidas']);
      [['objetivo', C.resLObj], ['evento', C.resLEv], ['eventoFecha', C.resLEv], ['duracionSem', C.resLDur], ['historial', C.resLHist],
       ['material', C.resLMat], ['dieta', C.resLDieta], ['franja', C.resLFranja]].forEach(par => {
        if (d[par[0]] !== undefined) filas.push([par[1], dame(par[0], d[par[0]]), par[0]]);
      });
      if (d.diasSemana) filas.push([null, d.diasSemana + '×' + (d.minSesion || '—') + '′', 'diasSemana']);
      if (Array.isArray(d.lesiones) && d.lesiones.length) filas.push([C.resLLes, d.lesiones.map(x => dame('lesiones', x)).join(' · '), 'lesiones']);
      if (Array.isArray(d.sin) && d.sin.length) filas.push([C.resLSin, d.sin.map(x => dame('sin', x)).join(' · '), 'sin']);
      filas.push([null, tpl(C.resGustos, { a: Object.keys(est.like || {}).length, b: Object.keys(est.no || {}).length }), 'mazo']);
      const tarjeta = el('div', { class: 'card', style: 'gap:8px' });
      /* cada fila salta a su paso: el resumen es el único sitio donde se ven
         los 14 datos juntos, o sea donde se detecta el error — y ahí hay que
         poder corregirlo sin rehacer el cuestionario entero */
      filas.forEach(f => {
        const iPaso = f[2] !== undefined ? pasosVivos().findIndex(x => x.id === f[2]) : -1;
        if (iPaso < 0) { tarjeta.append(el('div', { class: 'cres' }, f[0] ? el('span', { class: 'cres-l' }, f[0]) : null, f[1])); return; }
        tarjeta.append(el('button', { class: 'cres cres-btn plano', type: 'button',
          onclick: () => { borr.paso = iPaso; guarda(); pintaPaso(); } },
          f[0] ? el('span', { class: 'cres-l' }, f[0]) : null,
          el('span', { style: 'flex:1' }, f[1]),
          el('span', { class: 'mini', style: 'color:var(--ink3)' }, '›')));
      });
      cont.append(tarjeta);

      if (!apto) {
        // puerta dura: sin visto bueno no se genera nada, y se dice con salida
        cont.append(el('div', { class: 'banner warn' }, el('div', null, C.resProfesional)));
        cont.append(el('div', { class: 'cuest-pie' },
          el('button', { class: 'plano qaux', type: 'button', onclick: atras }, C.atras),
          el('button', { class: 'btn-b2p', type: 'button', onclick: () => {
            S.ui.gate = 1; guarda(); location.hash = '#/hoy';
          } }, C.gateSalir)));
        return;
      }
      cont.append(el('div', { class: 'cuest-pie' },
        el('button', { class: 'plano qaux', type: 'button', onclick: atras }, C.atras),
        el('button', { class: 'btn-b2p', type: 'button', onclick: () => {
          S.perfil = Object.assign({ v: 1, creado: U.hoyISO() }, d,
            { gustos: { like: Object.keys(est.like || {}), no: Object.keys(est.no || {}) } });
          // la cintura del cuestionario ES la línea base: no se pregunta dos veces
          if (d.cinturaCm && !S.config.cinturaBase) S.config.cinturaBase = d.cinturaCm;
          S.ui.reveal = 1;     // el plan se presenta antes de soltarte en HOY
          S.ui.tour = 1;       // y después, el paseo por la app
          delete S.ui.cuest;   // borrador fuera: la proxima visita empieza limpia
          U.save(); U.toast(C.resGen || C.resGuardado);
          /* Recarga real: gen.js corre en el arranque y sustituye el plan
             entero, y el router fuerza #/reveal él solo desde S.ui.reveal.
             Nada de tocar location.href antes: el hashchange llegaba a
             renderizar el reveal EN LA PÁGINA VIEJA (plan base, sin __gen),
             su guarda borraba la bandera y la persistía antes del reload. */
          setTimeout(() => location.reload(), 450);
        } }, C.resCta || C.resGuardar)));
    }

    pintaPaso();
  }

  /* ---- el mazo de gustos, ahora como pieza del flujo ---- */
  function montaMazo(root, alFinal, alAtras) {
    const TX = U.TX, S = U.S, tpl = U.tpl;
    const menosMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const deseo = ['press-banca', 'sentadilla-barra', 'dominadas', 'remo-barra', 'rdl-barra',
      'flexiones', 'fondos', 'plancha', 'burpees', 'zancadas'];
    /* las cartas se puntúan sobre lo que TU plan puede proponerte: dos pasos
       antes declaraste material y lesiones, así que no se pregunta por barra
       a quien entrena en casa ni por press a quien declaró hombro */
    const bd0 = (S.ui.cuest && S.ui.cuest.d) || {};
    const mat = bd0.material || (S.perfil && S.perfil.material) || 'gym';
    const lesD = Array.isArray(bd0.lesiones) ? bd0.lesiones : ((S.perfil && S.perfil.lesiones) || []);
    const G2 = window.B2P_GEN;
    const cartaVale = id => {
      const e = D.EJERCICIOS[id]; if (!e) return false;
      if (G2 && G2.equipoVale && !G2.equipoVale(e.equipo, mat)) return false;
      if (G2 && G2.tocaLesion && lesD.some(z => G2.tocaLesion(D, z, id))) return false;
      return true;
    };
    const idsEj = deseo.filter(id => D.EJERCICIOS[id] && cartaVale(id));
    for (const k of Object.keys(D.EJERCICIOS)) { if (idsEj.length >= 10) break; if (!idsEj.includes(k) && cartaVale(k)) idsEj.push(k); }
    for (const k of Object.keys(D.EJERCICIOS)) { if (idsEj.length >= 10) break; if (!idsEj.includes(k)) idsEj.push(k); }
    const ejs = [], deps = [], coms = [];
    // las cartas llevan imagen: pictograma del patrón (ejercicios), foto del
    // plato (comidas) y emoji grande (deportes) — una carta se lee en 1 s
    const DEP_EMOJI = { running: '🏃', natacion: '🏊', ciclismo: '🚴', padel: '🎾', futbol: '⚽', baloncesto: '🏀', volley: '🏐', yoga: '🧘', calistenia: '🤸', boxeo: '🥊' };
    const IMGV = '?v=' + (window.B2P_IMG_V || 1);
    idsEj.forEach(id => { const e = D.EJERCICIOS[id];
      const patPic = (e.pic && window.B2P_PICTOS && window.B2P_PICTOS.includes(e.pic)) ? e.pic : e.pat;
      const img = (window.B2P_PICTOS && patPic && window.B2P_PICTOS.includes(patPic)) ? 'assets/pictos/' + patPic + '.webp' + IMGV : null;
      // en la carta, el nombre a secas: la taxonomía «(asistidas → libres…)» no se lee en un segundo
      ejs.push({ k: 'ej:' + id, cls: 'ej', cat: TX.quizCatEj, t: e.nombre.replace(/\s*\([^)]*\)\s*$/, ''), sub: (TX.zonas && TX.zonas[e.zona]) || e.zona, mm: e.mm, img }); });
    (D.QUIZ_DEP || []).forEach(dep => deps.push({ k: 'dep:' + dep.id, cls: 'dep', cat: TX.quizCatDep, t: dep.n, sub: '',
      img: (window.B2P_DEPORTES || []).includes(dep.id) ? 'assets/deportes/' + dep.id + '.webp' + IMGV : null,
      emoji: DEP_EMOJI[dep.id] || '🏅' }));
    /* La dieta se declaró dos pasos antes: una vegana no puntúa diez platos
       de carne. Se filtra con el mismo criterio que usará el motor. */
    const bd = (S.ui.cuest && S.ui.cuest.d) || {};
    const pd = { dieta: bd.dieta || 'normal', sin: Array.isArray(bd.sin) ? bd.sin : [] };
    (D.RECETAS || [])
      .filter(r => r.slot !== 'snack' && (!window.B2P_GEN || window.B2P_GEN.recetaVale(r, pd, new Set())))
      .slice(0, 10).forEach(r => coms.push({ k: 'com:' + r.id, cls: 'com', cat: TX.quizCatCom, t: r.nombre,
        sub: r.macros ? (r.macros.kcal + ' kcal · P ' + r.macros.p + ' g') : '', img: U.foto(r.id) }));
    /* Por bloques: deportes, ejercicios y comidas. Comparar diez cosas del
       mismo tipo seguidas es más fácil que saltar de una sentadilla a un plato
       de lentejas y volver, y el chip de categoría de la carta dice siempre en
       cuál vas. Los deportes abren porque son la decisión más rápida. */
    const mazo = deps.concat(ejs, coms);

    const est = S.ui.quiz = S.ui.quiz || { like: {}, no: {} };
    // al volver (Atrás desde el resumen, o salir y entrar), lo contestado no se
    // re-pregunta: el contador retoma donde ibas en vez de fingir 0/30
    let resto = mazo.filter(it => !est.like[it.k] && !est.no[it.k]), historia = [], volando = false;

    root.append(el('div', { class: 'cuest-t' }, TX.quizTitulo,
      el('span', { class: 'mini', id: 'qCuenta', style: 'margin-left:8px' })));
    const zona = el('div', { class: 'quiz-zona' });
    root.append(zona);
    const fila = el('div', { class: 'quiz-botones' },
      el('button', { class: 'qbtn no plano', type: 'button', 'aria-label': TX.quizNo, onclick: () => resolver(false, null) }, '\u2715'),
      el('button', { class: 'qbtn si plano', type: 'button', 'aria-label': TX.quizSi, onclick: () => resolver(true, null) }, '\u2713'));
    root.append(fila);
    root.append(el('div', { class: 'quiz-aux' },
      // el mazo también tiene puerta de salida hacia atrás: sin ella, un dato
      // mal puesto en los pasos previos no se podía corregir antes de generar
      alAtras ? el('button', { class: 'plano qaux', type: 'button', onclick: alAtras }, (TX.cuest && TX.cuest.atras) || '') : null,
      el('button', { class: 'plano qaux', type: 'button', onclick: deshacer }, TX.quizDeshacer),
      el('button', { class: 'plano qaux', type: 'button', onclick: alFinal }, TX.quizSaltar)));

    const HUECO = ['', 'scale(.95) translateY(12px)', 'scale(.9) translateY(24px)', 'scale(.86) translateY(34px)'];

    function pinta(avanzando) {
      zona.innerHTML = '';
      const cuenta = root.querySelector('#qCuenta');
      if (cuenta) cuenta.textContent = (mazo.length - resto.length) + '/' + mazo.length;
      if (!resto.length) {
        /* el cierre del mazo es un cierre, no una carta más: check de la casa,
           el balance en dos stats y un CTA a su tamaño */
        const nSi = Object.keys(est.like).length, nNo = Object.keys(est.no).length;
        const fin = el('div', { class: 'qcard qfin' },
          el('div', { class: 'qfin-ico' }, U.icono ? U.icono('hecho', 46) : '✓'),
          el('div', { class: 'qn' }, TX.quizListo),
          el('div', { class: 'statrow qfin-stats' },
            el('div', { class: 'stat' }, el('div', { class: 'sl' }, TX.quizSi), el('div', { class: 'sv num' }, String(nSi))),
            el('div', { class: 'stat' }, el('div', { class: 'sl' }, TX.quizNo), el('div', { class: 'sv num' }, String(nNo)))),
          TX.quizAfinara ? el('div', { class: 'mini' }, TX.quizAfinara) : null,
          el('button', { class: 'btn-b2p qfin-cta', type: 'button', onclick: alFinal }, (TX.cuest && TX.cuest.sigue) || TX.quizListo));
        zona.append(fin);
        if (!menosMovimiento) {
          const ic = fin.querySelector('.qfin-ico');
          if (ic) ic.animate(
            [{ transform: 'scale(.5)', opacity: 0 }, { transform: 'scale(1.12)', opacity: 1, offset: .7 }, { transform: 'scale(1)' }],
            { duration: 360, easing: 'cubic-bezier(.2,1.4,.4,1)', fill: 'backwards' });
        }
        fila.hidden = true;
        return;
      }
      fila.hidden = false;
      const cartas = [];
      resto.slice(0, 3).forEach((it, i) => {
        const c = el('div', { class: 'qcard' + (i === 1 ? ' detras' : i === 2 ? ' detras2' : '') },
          el('span', { class: 'qsi' }, TX.quizSi), el('span', { class: 'qno' }, TX.quizNo),
          el('div', { class: 'qcat qcat-' + it.cls }, it.cat),
          it.img ? el('img', { class: 'qimg', src: it.img, alt: '', decoding: 'async' })
            : it.emoji ? el('div', { class: 'qemoji', 'aria-hidden': 'true' }, it.emoji)
            : it.mm && window.B2P_MAPA ? el('div', { class: 'mapa mapa-carta', html: window.B2P_MAPA.svg(it.mm, { mini: true }) }) : null,
          el('div', { class: 'qn' }, it.t),
          it.sub ? el('div', { class: 'qz' }, it.sub) : null,
          historia.length === 0 && i === 0 ? el('div', { class: 'mini', style: 'margin-top:6px' }, TX.quizPista) : null);
        zona.prepend(c);
        cartas.push([c, i]);
        if (i === 0) engancha(c);
      });
      if (avanzando && !menosMovimiento) {
        cartas.forEach(par => {
          const c = par[0], i = par[1];
          c.style.transition = 'none';
          c.style.transform = HUECO[i + 1];
          if (i === 2) c.style.opacity = '0';
        });
        void zona.offsetHeight;
        setTimeout(() => cartas.forEach(par => {
          const c = par[0];
          c.style.transition = 'transform var(--t-corto) var(--ease-sale), opacity var(--t-corto) linear';
          c.style.transform = ''; c.style.opacity = '';
        }), 0);
      }
    }

    function resolver(gusta, velAbs) {
      if (volando) return;
      const it = resto[0]; if (!it) return;
      if (gusta) { est.like[it.k] = 1; delete est.no[it.k]; } else { est.no[it.k] = 1; delete est.like[it.k]; }
      historia.push(it.k); U.save();
      const carta = zona.querySelector('.qcard:not(.detras):not(.detras2)');
      if (carta && !menosMovimiento) {
        volando = true;
        carta.style.pointerEvents = 'none';
        const sello = carta.querySelector(gusta ? '.qsi' : '.qno');
        if (sello) { sello.style.transition = 'opacity 90ms linear'; sello.style.opacity = '1'; }
        const W = zona.getBoundingClientRect().width || 320;
        const vel = Math.max(Math.abs(velAbs || 0), .6);
        const ms = Math.round(Math.max(140, Math.min(300, (W * 1.2) / vel)));
        carta.style.transition = 'transform ' + ms + 'ms cubic-bezier(.32,.72,0,1), opacity ' + Math.round(ms * .45) + 'ms linear ' + Math.round(ms * .55) + 'ms';
        carta.style.transform = 'translateX(' + (gusta ? 1 : -1) * (W + 160) + 'px) rotate(' + (gusta ? 14 : -14) + 'deg)';
        carta.style.opacity = '0';
        setTimeout(() => { resto.shift(); volando = false; pinta(true); }, ms);
      } else { resto.shift(); pinta(false); }
    }

    function deshacer() {
      if (volando) return;
      const k = historia.pop(); if (!k) return;
      delete est.like[k]; delete est.no[k]; U.save();
      resto.unshift(mazo.find(x => x.k === k));
      pinta(false);
    }

    function engancha(carta) {
      let x0 = 0, dx = 0, hist = [], arrastrando = false;
      const proyecta = (v, dcy) => v * (dcy || 0.998) / (1 - (dcy || 0.998));
      const velocidad = () => {
        if (hist.length < 2) return 0;
        const f = hist[hist.length - 1]; let i0 = 0;
        for (let i = hist.length - 1; i >= 0; i--) { if (f.t - hist[i].t > 90) break; i0 = i; }
        const dt = f.t - hist[i0].t;
        return dt > 0 ? (f.x - hist[i0].x) / dt : 0;
      };
      const sellos = () => [carta.querySelector('.qsi'), carta.querySelector('.qno')];
      carta.addEventListener('pointerdown', ev => {
        if (volando) return;
        arrastrando = true; x0 = ev.clientX; dx = 0; hist = [{ x: ev.clientX, t: Date.now() }];
        try { carta.setPointerCapture(ev.pointerId); } catch (e) { /* sintetico */ }
        carta.style.transition = 'none';
        sellos().forEach(x => { if (x) x.style.transition = 'none'; });
      });
      carta.addEventListener('pointermove', ev => {
        if (!arrastrando) return;
        dx = ev.clientX - x0;
        hist.push({ x: ev.clientX, t: Date.now() }); if (hist.length > 12) hist.shift();
        carta.style.transform = 'translateX(' + dx + 'px) rotate(' + (dx / 18) + 'deg)';
        const ss = sellos();
        if (ss[0]) ss[0].style.opacity = String(Math.min(1, Math.max(0, dx) / 80));
        if (ss[1]) ss[1].style.opacity = String(Math.min(1, Math.max(0, -dx) / 80));
      });
      const suelta = () => {
        if (!arrastrando) return; arrastrando = false;
        const vel = velocidad();
        const W = zona.getBoundingClientRect().width || 320;
        const destino = dx + proyecta(vel);
        if (Math.abs(destino) > W * .45 || Math.abs(vel) > .11) {
          resolver(destino > 0, Math.abs(vel));
        } else {
          carta.style.transition = 'transform var(--t-medio) var(--ease-muelle)';
          carta.style.transform = '';
          sellos().forEach(x => { if (x) { x.style.transition = ''; x.style.opacity = '0'; } });
        }
      };
      carta.addEventListener('pointerup', suelta);
      carta.addEventListener('pointercancel', suelta);
    }

    pinta(false);
  }

  window.B2P_REG('quiz', renderQuiz);
  window.B2P_REG('plan', renderPlan);
  window.B2P_REG('ejercicios', renderEjercicios);
  window.B2P_REG('nutricion', renderNutricion);
  window.B2P_REG('progreso', renderProgreso);
  window.B2P_REG('logros', renderLogros);
})();
