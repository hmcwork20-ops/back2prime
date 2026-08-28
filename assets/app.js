/* ============================================================
   BACK2PRIME · app.js — núcleo
   Estado (localStorage) · calendario · vista HOY · timer ·
   rachas · motor de logros · celebración · ajustes/backup.
   Las vistas Plan/Comida/Progreso/Logros viven en views.js.
   ============================================================ */
(function () {
  'use strict';
  const D = window.B2P;

  /* ---------------- utilidades ---------------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  function el(tag, attrs, ...kids) {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== null && attrs[k] !== undefined) n.setAttribute(k, attrs[k]);
    }
    for (const kid of kids.flat()) {
      if (kid === null || kid === undefined || kid === false) continue;
      n.append(kid.nodeType ? kid : document.createTextNode(kid));
    }
    return n;
  }
  /* iconos de línea de la casa (assets/iconos.js): nada de emojis en el cromo */
  const icono = (n, s) => el('span', { class: 'ico', 'aria-hidden': 'true',
    html: '<svg viewBox="0 0 24 24" width="' + (s || 18) + '" height="' + (s || 18) + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + ((window.B2P_ICO || {})[n] || '') + '</svg>' });
  // las insignias siguen declarando su emoji en los datos; aquí se traduce a icono
  const ICO_LOGRO = { '⚡': 'rayo', '🔟': 'diana', '🎯': 'diana', '🏛️': 'medalla', '💎': 'diamante', '🛡️': 'escudo', '🔥': 'flame', '🌋': 'flame', '👟': 'actividad', '📉': 'baja', '📈': 'sube', '🏔️': 'montana', '📏': 'cinta', '👑': 'corona', '🥇': 'medalla', '🏆': 'trofeo', '🔓': 'abierto', '🦍': 'barra', '🍱': 'caja', '🔁': 'repetir', '📸': 'camara', '✅': 'hecho', '🏁': 'bandera' };
  const icoLogro = (l, s) => icono(ICO_LOGRO[l.icon] || 'medalla', s || 30);
  const pad = n => String(n).padStart(2, '0');
  const iso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const fromISO = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (s, n) => { const d = fromISO(s); d.setDate(d.getDate() + n); return iso(d); };
  const TX = D.UI;                                   // textos de interfaz (idioma cargado)
  const tpl = (s, o) => s.replace(/\{(\w+)\}/g, (m, k) => o[k] !== undefined ? o[k] : m);
  const DIAS_L = TX.dias, MES_L = TX.meses;
  const dowMon = s => (fromISO(s).getDay() + 6) % 7; // 0=lunes
  const fmtFecha = s => { const d = fromISO(s); return DIAS_L[dowMon(s)] + ' ' + d.getDate() + ' ' + MES_L[d.getMonth()]; };
  const fmtCorta = s => { const d = fromISO(s); return d.getDate() + ' ' + MES_L[d.getMonth()]; };
  const kg1 = v => (Math.round(v * 10) / 10).toLocaleString(D.UI.lang || 'es', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  // hoy real (override para pruebas: ?d=2026-08-20)
  const qd = new URLSearchParams(location.search).get('d');
  const hoyISO = () => qd || iso(new Date());

  /* ---------------- estado ---------------- */
  const KEY = 'b2p_v1';
  let S;
  function defState() {
    return { v: 1, usuario: null, config: { cinturaBase: null, creado: hoyISO(), onboarded: false },
      dias: {}, logros: {}, prs: {}, prCount: 0, flags: {}, shop: {}, prep: {}, ui: {} };
  }
  function load() { try { S = Object.assign(defState(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { S = defState(); } }
  function save() { localStorage.setItem(KEY, JSON.stringify(S)); }
  function dia(d) { return S.dias[d] || (S.dias[d] = {}); }

  /* ---------------- calendario del plan ---------------- */
  const INICIO = D.META.inicioISO, FIN = D.META.finISO;
  const SEMANAS = D.META.semanas || 12;      // duración real del plan cargado
  function semanaDe(d) { // 1..SEMANAS · 0 = antes · 99 = después
    const diff = Math.floor((fromISO(d) - fromISO(INICIO)) / 864e5);
    if (diff < 0) return 0;
    const w = Math.floor(diff / 7) + 1;
    return w > SEMANAS ? 99 : w;
  }
  function slotDe(d) {
    const w = semanaDe(d);
    if (w < 1 || w > SEMANAS) return null;
    const cal = D.CAL[w - 1];
    let s = cal.dias[dowMon(d)], opt = false;
    if (typeof s === 'object') { opt = !!s.opt; s = s.s; }
    return { sid: s, ses: D.SESIONES[s], opt, w, cal, fase: D.FASES[cal.fase - 1] };
  }
  function fechasSemana(w) { const a = addDays(INICIO, (w - 1) * 7); return { ini: a, fin: addDays(a, 6) }; }

  /* ---------------- registro de sesión ---------------- */
  function logEj(d, ejId) { const dd = dia(d); dd.ej = dd.ej || {}; return dd.ej[ejId] || (dd.ej[ejId] = {}); }
  function ultimoLog(ejId, antesDe) {
    const fechas = Object.keys(S.dias).filter(f => f < antesDe && S.dias[f].ej && S.dias[f].ej[ejId] && S.dias[f].ej[ejId].kg).sort();
    if (!fechas.length) return null;
    const f = fechas[fechas.length - 1];
    return Object.assign({ fecha: f }, S.dias[f].ej[ejId]);
  }
  function historial(ejId, n) {
    return Object.keys(S.dias).filter(f => S.dias[f].ej && S.dias[f].ej[ejId] && S.dias[f].ej[ejId].kg).sort().slice(-(n || 5))
      .map(f => Object.assign({ fecha: f }, S.dias[f].ej[ejId]));
  }
  const GRANDES = { 'sentadilla-barra': 5, 'rdl-barra': 5 };
  // Arranque derivado de las marcas históricas: solo la primera vez del ejercicio.
  const ARR0 = {};
  ((D.ARRANQUE || {}).tabla || []).forEach(r => { ARR0[r.ej] = parseFloat(r.s3.replace(',', '.')); });
  function sugerencia(ejId, d) {
    const u = ultimoLog(ejId, d);
    if (!u || !u.kg) {
      return ARR0[ejId] ? { kg: ARR0[ejId], txt: tpl(TX.sugEmpieza, { v: kg1(ARR0[ejId]) }), inicio: true } : null;
    }
    if (u.falta) return { kg: u.kg, txt: tpl(TX.sugRepite, { v: kg1(u.kg) }), rep: true };
    const inc = GRANDES[ejId] || 2.5;
    return { kg: u.kg + inc, txt: '▲ ' + kg1(u.kg) + ' → ' + kg1(u.kg + inc), rep: false };
  }

  /* ---------------- pesajes ---------------- */
  function pesosSemana(w) {
    const { ini } = fechasSemana(w); const out = [];
    for (let i = 0; i < 7; i++) { const f = addDays(ini, i); const p = S.dias[f] && S.dias[f].peso; if (p) out.push(p); }
    return out;
  }
  function mediaSemana(w) { const p = pesosSemana(w); return p.length ? p.reduce((a, b) => a + b, 0) / p.length : null; }
  function mediasSemanales() { const out = []; for (let w = 1; w <= SEMANAS; w++) { const m = mediaSemana(w); if (m) out.push({ w, m }); } return out; }

  /* ---------------- adherencia ---------------- */
  function sesionesFuerzaSemana(w) {
    const { ini } = fechasSemana(w); const out = [];
    for (let i = 0; i < 7; i++) {
      const f = addDays(ini, i), sl = slotDe(f);
      if (sl && sl.ses && sl.ses.tipo === 'fuerza') out.push({ f, hecho: !!(S.dias[f] && S.dias[f].sesionOk) });
    }
    return out;
  }
  function cardioHechoSemana(w) {
    const { ini } = fechasSemana(w); let n = 0;
    for (let i = 0; i < 7; i++) {
      const f = addDays(ini, i), sl = slotDe(f);
      if (sl && sl.ses && sl.ses.tipo === 'cardio' && S.dias[f] && S.dias[f].sesionOk) n++;
    }
    return n;
  }
  function cumplido(f) {
    const dd = S.dias[f]; if (!dd) return false;
    const sl = slotDe(f);
    if (sl && sl.ses && sl.ses.tipo === 'fuerza') return !!dd.sesionOk;
    if (sl && sl.ses && sl.ses.tipo === 'cardio' && !sl.opt) return !!(dd.sesionOk || dd.pasos);
    return !!(dd.pasos || dd.sesionOk || dd.cerrado);
  }
  /* La racha cuenta DÍAS DE PLAN: solo los días con sesión programada (fuerza
     o cardio no opcional) exigen y suman; los libres ni rompen ni inflan. Un
     producto de 3 días por semana premia cumplir SU plan, no abrir la app a
     diario — con la métrica vieja, el mejor usuario posible veía «racha 0». */
  function exigeSesion(f) {
    const sl = slotDe(f);
    return !!(sl && sl.ses && (sl.ses.tipo === 'fuerza' || (sl.ses.tipo === 'cardio' && !sl.opt)));
  }
  function racha(hasta) {
    let f = hasta;
    if (exigeSesion(f) && !cumplido(f)) f = addDays(f, -1);   // el día en curso aún no rompe
    let n = 0, guard = 0;
    while (guard++ < 400 && f >= INICIO) {
      if (exigeSesion(f)) { if (!cumplido(f)) break; n++; }
      f = addDays(f, -1);
    }
    return n;
  }
  // La racha se rompe de verdad, pero lo conseguido no se borra: esto es lo que
  // sobrevive a un día fallado, y la cabecera y el cierre lo enseñan.
  function mejorRacha() {
    let best = 0, run = 0, f = INICIO;
    const hoy = hoyISO();
    while (f <= hoy) {
      if (exigeSesion(f)) { if (cumplido(f)) { run++; if (run > best) best = run; } else run = 0; }
      f = addDays(f, 1);
    }
    return best;
  }

  /* ---------------- logros ---------------- */
  function totalFuerza() { return Object.keys(S.dias).filter(f => { const sl = slotDe(f); return sl && sl.ses && sl.ses.tipo === 'fuerza' && S.dias[f].sesionOk; }).length; }
  function faseCompleta(fid) {
    const fase = D.FASES[fid - 1];
    const finF = fechasSemana(fase.semanas[fase.semanas.length - 1]).fin;
    if (hoyISO() < finF) return false;
    let tot = 0, ok = 0;
    fase.semanas.forEach(w => sesionesFuerzaSemana(w).forEach(s => { tot++; if (s.hecho) ok++; }));
    return tot > 0 && ok / tot >= 0.8;
  }
  const COND = {
    'primera': () => totalFuerza() >= 1,
    'sesiones-10': () => totalFuerza() >= 10,
    'sesiones-25': () => totalFuerza() >= 25,
    'sesiones-50': () => totalFuerza() >= 50,
    'semana-perfecta': () => { for (let w = 1; w <= SEMANAS; w++) { const s = sesionesFuerzaSemana(w); if (s.length && s.every(x => x.hecho) && fechasSemana(w).ini <= hoyISO()) return true; } return false; },
    'minimo-3': () => { let run = 0; for (let w = 1; w <= SEMANAS; w++) { if (fechasSemana(w).fin > hoyISO()) break; const f = sesionesFuerzaSemana(w).filter(x => x.hecho).length; if (f >= 2 && cardioHechoSemana(w) >= 1) { run++; if (run >= 3) return true; } else run = 0; } return false; },
    'racha-7': () => racha(hoyISO()) >= 7,
    'racha-14': () => racha(hoyISO()) >= 14,
    'racha-30': () => racha(hoyISO()) >= 30,
    'pasos-7': () => { let f = hoyISO(), n = 0; while (S.dias[f] && S.dias[f].pasos) { n++; f = addDays(f, -1); } return n >= 7; },
    'disco-10': () => faseCompleta(1), 'disco-15': () => faseCompleta(2),
    'disco-20': () => faseCompleta(3), 'disco-25': () => faseCompleta(4),
    'kg-2': () => bajadaMax() >= 2, 'kg-4': () => bajadaMax() >= 4, 'kg-6': () => bajadaMax() >= 6,
    'kg-8': () => bajadaMax() >= 8, 'kg-10': () => bajadaMax() >= 10,
    'cintura-95': () => cinturaMin() !== null && cinturaMin() < 95,
    'cintura-93': () => cinturaMin() !== null && cinturaMin() < 93,
    'cintura-91': () => cinturaMin() !== null && cinturaMin() < 91,
    'pr-1': () => S.prCount >= 1, 'pr-5': () => S.prCount >= 5, 'pr-15': () => S.prCount >= 15,
    // con plan generado no hay marcas previas: el logro queda inalcanzable, no roto
    'marca-banca': () => !!D.HISTORICO['press-banca'] && (S.prs['press-banca'] || {}).kg >= D.HISTORICO['press-banca'].kg,
    'marca-sentadilla': () => !!D.HISTORICO['sentadilla-barra'] && (S.prs['sentadilla-barra'] || {}).kg >= D.HISTORICO['sentadilla-barra'].kg,
    'dominada-libre': () => !!S.flags.dominadaLibre,
    'mealprep-4': () => { let n = 0, f = hoyISO(); while (dowMon(f) !== 6) f = addDays(f, -1); while (S.dias[f] && S.dias[f].prep) { n++; f = addDays(f, -7); } return n >= 4; },
    'comeback': () => !!S.flags.comeback,
    'fotos-4': () => D.FOTOS.every(f => S.dias[f] && S.dias[f].foto),
    'checkpoint-s4': () => checkpointOk(0), 'checkpoint-s8': () => checkpointOk(1),
    'plan-completo': () => { if (hoyISO() < FIN) return false; let t = 0, k = 0; for (let w = 1; w <= SEMANAS; w++) sesionesFuerzaSemana(w).forEach(s => { t++; if (s.hecho) k++; }); return t && k / t >= 0.8; }
  };
  function bajadaMax() { const ms = mediasSemanales(); if (!ms.length) return 0; return D.META.perfil.pesoSalida - Math.min(...ms.map(x => x.m)); }
  function subidaMax() { const ms = mediasSemanales(); if (!ms.length) return 0; return Math.max(...ms.map(x => x.m)) - D.META.perfil.pesoSalida; }
  function cinturaMin() { const cs = Object.values(S.dias).map(d => d.cintura).filter(Boolean); return cs.length ? Math.min(...cs) : null; }
  function checkpointOk(i) {
    const cp = D.CHECKPOINTS[i]; if (!cp || hoyISO() < cp.fecha) return false;
    const m = mediaSemana(cp.sem); if (m === null) return false;
    // «dentro o mejor» depende de hacia dónde va el plan
    return cp.dir === 'sube' ? m >= cp.rango[0] : m <= cp.rango[1];
  }

  /* Los logros generados traen umbrales a medida (kg-5, kgup-2, cint-83…):
     las condiciones con número en el id se resuelven aquí, sin lista fija. */
  function condDe(id) {
    if (COND[id]) return COND[id];
    let m;
    if ((m = /^kg-(\d+)$/.exec(id))) return () => bajadaMax() >= +m[1];
    if ((m = /^kgup-(\d+)$/.exec(id))) return () => subidaMax() >= +m[1];
    if ((m = /^cint-(\d+)$/.exec(id))) return () => cinturaMin() !== null && cinturaMin() < +m[1];
    return null;
  }

  function evaluaLogros() {
    const nuevos = [];
    D.LOGROS.forEach(l => {
      if (S.logros[l.id]) return;
      const fn = condDe(l.id);
      try { if (fn && fn()) { S.logros[l.id] = hoyISO(); nuevos.push(l); } } catch (e) { /* nunca romper por un logro */ }
    });
    if (nuevos.length) { save(); celebraCola(nuevos); }
    return nuevos;
  }

  /* ---------------- celebración ---------------- */
  let cola = [];
  function celebraCola(ls) { cola.push(...ls); if (cola.length === ls.length) celebraNext(); }
  function celebraNext() {
    const l = cola.shift(); if (!l) return;
    const bg = $('#celebraBg');
    const ic = $('#celebraIcon');
    ic.innerHTML = '';
    ic.append(l.disco ? discoSVG(l.id.split('-')[1], 76) : icoLogro(l, 58));
    $('#celebraNombre').textContent = l.nombre;
    $('#celebraDesc').textContent = l.desc;
    bg.classList.add('on');
    confetti();
    if (navigator.vibrate) navigator.vibrate([60, 40, 120]);
  }
  $('#celebraOk') && ($('#celebraOk').onclick = () => { $('#celebraBg').classList.remove('on'); setTimeout(celebraNext, 250); });
  function discoSVG(kgTxt, size) {
    const col = { '10': 'var(--f1)', '15': 'var(--f2)', '20': 'var(--f3)', '25': 'var(--f4)' }[kgTxt] || 'var(--volt)';
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 64 64'); s.setAttribute('width', size); s.setAttribute('height', size);
    s.innerHTML = '<circle cx="32" cy="32" r="28" fill="none" stroke="' + col + '" stroke-width="9"/>' +
      '<circle cx="32" cy="32" r="12" fill="none" stroke="' + col + '" stroke-width="2.5" opacity=".5"/>' +
      '<text x="32" y="37" text-anchor="middle" font-family="var(--mono)" font-weight="700" font-size="14" fill="' + col + '">' + kgTxt + '</text>';
    return s;
  }
  /* Un solo sitio donde se pregunta por el movimiento reducido. El CSS ya lo
     respeta por su cuenta; esto es para lo que se dibuja desde JS, que las
     media queries no alcanzan. */
  const reduceMovimiento = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  function confetti() {
    // 130 partículas cayendo es exactamente lo que alguien con sensibilidad al
    // movimiento no quiere ver. El logro se celebra igual, sin la lluvia.
    if (reduceMovimiento()) return;
    const c = $('#confetti'); if (!c) return;
    c.hidden = false; c.width = innerWidth; c.height = innerHeight;
    const ctx = c.getContext('2d');
    const cols = ['#C8F24E', '#4CC07E', '#E5B63E', '#66A0E8', '#E5685A', '#F2F4F0'];
    const ps = Array.from({ length: 130 }, () => ({
      x: Math.random() * c.width, y: -20 - Math.random() * c.height * .4,
      vx: (Math.random() - .5) * 2.4, vy: 2.2 + Math.random() * 3.4,
      w: 5 + Math.random() * 6, h: 8 + Math.random() * 7,
      r: Math.random() * Math.PI, vr: (Math.random() - .5) * .25,
      col: cols[Math.floor(Math.random() * cols.length)]
    }));
    let t = 0;
    (function tick() {
      ctx.clearRect(0, 0, c.width, c.height);
      ps.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.col; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
      });
      if (++t < 210) requestAnimationFrame(tick); else { ctx.clearRect(0, 0, c.width, c.height); c.hidden = true; }
    })();
  }

  /* ---------------- toast ---------------- */
  let toastT;
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2600);
  }

  /* ---------------- timer de descanso ---------------- */
  let tInt = null, tEnd = 0;
  function beep() {
    try {
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      [0, .22].forEach((d, i) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = 'sine'; o.frequency.value = i ? 1180 : 880;
        g.gain.setValueAtTime(.22, ac.currentTime + d);
        g.gain.exponentialRampToValueAtTime(.001, ac.currentTime + d + .18);
        o.connect(g); g.connect(ac.destination); o.start(ac.currentTime + d); o.stop(ac.currentTime + d + .2);
      });
    } catch (e) { }
  }
  function timerStart(sec) {
    tEnd = Date.now() + sec * 1000;
    const t = $('#timer'); t.classList.add('on'); t.classList.remove('fin');
    clearInterval(tInt); tInt = setInterval(timerTick, 250); timerTick();
  }
  function timerTick() {
    const left = Math.ceil((tEnd - Date.now()) / 1000);
    const t = $('#timer');
    if (left <= 0) {
      $('#timerT').textContent = TX.ya; t.classList.add('fin');
      clearInterval(tInt); beep(); if (navigator.vibrate) navigator.vibrate([180, 90, 180]);
      setTimeout(() => t.classList.remove('on'), 4200);
      return;
    }
    $('#timerT').textContent = Math.floor(left / 60) + ':' + pad(left % 60);
  }
  $('#timerPlus').onclick = () => { tEnd += 30000; timerTick(); };
  $('#timerX').onclick = () => { clearInterval(tInt); $('#timer').classList.remove('on'); };

  /* ---------------- bottom sheet ----------------
     Es un diálogo modal de verdad, no solo un div que se declara modal:
     `aria-modal="true"` esconde el resto de la página al lector de pantalla,
     así que si el foco no entra aquí el usuario se queda en una página sin
     nada que leer y sin salida. De ahí el foco, el Escape, el fondo inerte
     y el tirador convertido en botón de cerrar.                          */
  let focoPrevio = null;      // a dónde devolver el foco al cerrar
  let arrastroReciente = false;  // un arrastre no debe contar como clic en el tirador

  /* Vuelve inerte lo que queda POR DEBAJO de la hoja en el apilado, y deja en
     paz lo que flota por encima: el cronómetro de descanso (85), el toast (90)
     y la celebración (95). Si se inertizara todo, abrir una ficha a mitad de
     serie dejaría el cronómetro sin poder pararse. La regla la marca el propio
     z-index, no una lista de excepciones que se quedaría desfasada. */
  function fondoInerte(on) {
    const zHoja = parseInt(getComputedStyle($('#sheet')).zIndex, 10) || 81;
    for (const n of document.body.children) {
      if (n.id === 'sheet' || n.id === 'sheetBg' || n.tagName === 'SCRIPT') continue;
      if (!on) { n.removeAttribute('inert'); continue; }   // al cerrar, limpiar sin condiciones
      const z = parseInt(getComputedStyle(n).zIndex, 10);
      if (Number.isFinite(z) && z >= zHoja) continue;
      n.setAttribute('inert', '');
    }
  }

  function openSheet(builder) {
    const sh = $('#sheet'), bg = $('#sheetBg');
    focoPrevio = document.activeElement;
    sh.style.transition = ''; sh.style.transform = ''; bg.style.opacity = '';
    sh.scrollTop = 0;
    sh.innerHTML = '';
    sh.append(el('button', {
      class: 'grip', type: 'button', 'aria-label': TX.cerrarPanel,
      onclick: () => { if (!arrastroReciente) closeSheet(); }
    }));
    builder(sh);
    // Nombre accesible: cada hoja ya abre con su h2, así que se reutiliza en
    // vez de duplicar el título en un aria-label que se quedaría desfasado.
    const tit = sh.querySelector('h2');
    if (tit) {
      tit.id = tit.id || 'sheet-tit';
      sh.setAttribute('aria-labelledby', tit.id);
      sh.removeAttribute('aria-label');
    } else {
      sh.removeAttribute('aria-labelledby');
      sh.setAttribute('aria-label', TX.panelSinTitulo);
    }
    bg.hidden = false;
    fondoInerte(true);
    // setTimeout y no requestAnimationFrame: rAF no se dispara si la pestaña
    // no está componiendo frames y la hoja se quedaría sin abrir.
    setTimeout(() => { document.body.classList.add('sheet-open'); sh.focus(); }, 0);
    bg.onclick = closeSheet;
  }

  function closeSheet() {
    if (!document.body.classList.contains('sheet-open')) return;
    document.body.classList.remove('sheet-open');
    fondoInerte(false);
    // el foco se devuelve DESPUÉS de quitar inert: si no, el destino sigue
    // siendo inerte y el navegador ignora el focus()
    if (focoPrevio && focoPrevio.focus && document.contains(focoPrevio)) {
      try { focoPrevio.focus({ preventScroll: true }); } catch (e) { /* nodo ya inservible */ }
    }
    focoPrevio = null;
    setTimeout(() => {
      const sh = $('#sheet'), bg = $('#sheetBg');
      bg.hidden = true; bg.style.opacity = '';
      sh.style.transition = ''; sh.style.transform = '';
    }, 300);
  }

  document.addEventListener('keydown', ev => {
    if (ev.key === 'Escape' && document.body.classList.contains('sheet-open')) {
      ev.preventDefault(); closeSheet();
    }
  });

  /* ---------------- aviso de versión nueva ----------------
     El SW nuevo se instala MIENTRAS miras la página vieja (skipWaiting +
     clients.claim), así que sin esto los cambios solo se ven cerrando la app
     y volviéndola a abrir — pasó de verdad al mover el repositorio.
     controllerchange HABIENDO un controlador previo significa «la versión
     nueva ya está activa»: se ofrece recargar, nunca se fuerza. */
  if ('serviceWorker' in navigator) {
    const habiaSW = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!habiaSW) return;                    // primera instalación: nada que avisar
      const p = $('#updPill'); if (!p || p.classList.contains('on')) return;
      p.textContent = TX.versionNueva;
      p.hidden = false;
      setTimeout(() => p.classList.add('on'), 0);   // setTimeout, no rAF: el panel puede no componer
      p.onclick = () => location.reload();
    });
  }

  /* ---------------- arrastrar la hoja para cerrarla ----------------
     Gesto de las hojas de iOS: el contenido scrollea con normalidad, pero si
     tiras hacia abajo DESDE LA CABECERA de la hoja, o estando ya arriba del
     todo, la hoja sigue al dedo y se cierra al soltar.

     Tres cosas que hacen que se sienta físico y que antes no estaban:
     1) Al tirar HACIA ARRIBA no se para en seco: resiste cada vez más. Un tope
        duro se lee como «se ha colgado»; la resistencia se lee como «responde,
        pero aquí no hay más».
     2) La velocidad se mide en los últimos 90 ms, no promediando todo el gesto.
        Antes, si colocabas la hoja despacio y luego dabas un golpe seco, la
        media salía baja y el golpe no se detectaba.
     3) La decisión de cerrar no mira dónde SUELTAS sino dónde ACABARÍA el
        gesto si siguiera frenando solo, y la salida arranca al ritmo del dedo
        para que no haya costura entre arrastrar y animar.                  */
  (function arrastreHoja() {
    const sh = $('#sheet'), bg = $('#sheetBg');
    let y0 = 0, x0 = 0, dy = 0, evaluando = false, activo = false, permitido = false;
    let hist = [];                                   // {y, t} recientes
    const alto = () => sh.getBoundingClientRect().height || 1;

    // Resistencia progresiva en el límite: cuanto más insistes, menos se mueve.
    const gomilla = (exceso, dim, c = 0.55) => (exceso * dim * c) / (dim + c * Math.abs(exceso));

    // Velocidad instantánea (px/ms) de la última ventana de 90 ms.
    function velocidad() {
      if (hist.length < 2) return 0;
      const f = hist[hist.length - 1];
      let i0 = 0;
      for (let i = hist.length - 1; i >= 0; i--) { if (f.t - hist[i].t > 90) break; i0 = i; }
      const dt = f.t - hist[i0].t;
      return dt > 0 ? (f.y - hist[i0].y) / dt : 0;
    }

    // Proyección de inercia: a dónde llegaría el gesto desacelerando solo.
    // Es la misma curva exponencial que usa el scroll del sistema.
    const proyecta = (vPxMs, d = 0.998) => vPxMs * d / (1 - d);

    function inicio(y, x, target) {
      if (activo) return;
      y0 = y; x0 = x; dy = 0; hist = [{ y, t: Date.now() }]; evaluando = true; activo = false;
      const r = sh.getBoundingClientRect();
      const enCabecera = (y - r.top) < 64 || !!(target && target.closest && target.closest('.grip'));
      permitido = enCabecera || sh.scrollTop <= 0;
    }
    function mover(y, x) {
      if (!evaluando && !activo) return;
      dy = y - y0;
      hist.push({ y, t: Date.now() });
      if (hist.length > 12) hist.shift();
      if (!activo) {
        const dx = x - x0;
        if (Math.abs(dy) < 6 && Math.abs(dx) < 6) return;          // aún no es gesto
        if (dy > 0 && permitido && Math.abs(dy) > Math.abs(dx)) {
          activo = true; evaluando = false; sh.style.transition = 'none';
        } else { evaluando = false; return; }                       // es scroll: no tocar
      }
      // Hacia abajo, 1:1 con el dedo. Hacia arriba no hay recorrido, pero en vez
      // de clavarse en 0 cede un poco y cada vez menos.
      const v = dy >= 0 ? dy : -gomilla(-dy, alto());
      sh.style.transform = 'translateY(' + v + 'px)';
      bg.style.opacity = String(Math.max(0, 1 - Math.max(0, v) / (alto() * .85)));
    }
    function fin() {
      if (!activo) { evaluando = false; return; }
      const v = Math.max(0, dy), vel = velocidad(), h = alto();
      activo = false; evaluando = false;
      // Hubo arrastre: el clic sintético que viene detrás no debe cerrar una
      // hoja que se ha quedado a medio camino y ha vuelto a su sitio.
      arrastroReciente = true;
      setTimeout(() => { arrastroReciente = false; }, 350);

      // Decide por dónde VA el gesto, no por dónde lo sueltas: un golpe corto y
      // rápido cierra igual que un arrastre largo y lento. 0,11 px/ms es el
      // umbral con el que un descarte por impulso se siente natural; el 0,55 de
      // antes exigía un manotazo, y encima se medía sobre la media del gesto.
      const destino = v + proyecta(Math.max(0, vel));
      if (destino > h * .5 || vel > .11) {
        /* Traspaso de velocidad: lo que queda de recorrido se recorre al ritmo
           al que iba el dedo, acotado al presupuesto de UI. Sin esto se ve la
           costura: sueltas rápido y la hoja cambia de golpe a una curva fija.
           Y NO se limpia el transform antes de cerrar: al hacerlo, la hoja
           tiraba un instante hacia ARRIBA (hacia su sitio) antes de bajar. */
        const queda = Math.max(0, h - v);
        const ms = Math.round(Math.max(140, Math.min(300, queda / Math.max(vel, .45))));
        sh.style.transition = 'transform ' + ms + 'ms cubic-bezier(.32,.72,0,1)';
        bg.style.opacity = '';
        closeSheet();
        sh.style.transform = '';        // suelta el inline: manda el CSS, que ya apunta abajo
      } else {
        sh.style.transition = ''; sh.style.transform = ''; bg.style.opacity = '';
      }
    }

    sh.addEventListener('touchstart', ev => { if (ev.touches.length === 1) inicio(ev.touches[0].clientY, ev.touches[0].clientX, ev.target); }, { passive: true });
    sh.addEventListener('touchmove', ev => {
      if (ev.touches.length !== 1) return;
      mover(ev.touches[0].clientY, ev.touches[0].clientX);
      if (activo) ev.preventDefault();     // ya es nuestro: que no scrollee además
    }, { passive: false });
    sh.addEventListener('touchend', fin);
    sh.addEventListener('touchcancel', fin);
    // ratón, para poder probarlo en escritorio
    sh.addEventListener('pointerdown', ev => { if (ev.pointerType === 'mouse' && ev.button === 0) inicio(ev.clientY, ev.clientX, ev.target); });
    sh.addEventListener('pointermove', ev => { if (ev.pointerType === 'mouse') mover(ev.clientY, ev.clientX); });
    sh.addEventListener('pointerup', ev => { if (ev.pointerType === 'mouse') fin(); });
    sh.addEventListener('pointercancel', ev => { if (ev.pointerType === 'mouse') fin(); });
  })();

  /* ---------------- ficha de ejercicio ---------------- */
  function fichaEjercicio(ejId, ctx) {
    const e = D.EJERCICIOS[ejId]; if (!e) return;
    openSheet(sh => {
      sh.append(
        el('h2', null, e.nombre),
        el('div', { class: 'stag' }, e.musc.join(' · ') + ' — ' + e.equipo + (ctx && ctx.dosis ? ' · hoy: ' + ctx.dosis : ''))
      );
      // el mapa muscular: lo que trabaja, encendido; sin una sola imagen externa
      if (window.B2P_MAPA && e.mm) sh.append(el('div', { class: 'mapa', html: window.B2P_MAPA.svg(e.mm, { label: e.nombre + ' · ' + e.musc.join(', ') }) }));
      // el patron de movimiento: que se HACE, junto a que trabaja
      if (e.pat && TX.patrones && TX.patrones[e.pat]) {
        /* pictograma como imagen si está importado; `pic` permite a un
           ejercicio su dibujo propio (fondos ≠ press militar) sin tocar el
           patrón lógico. El ?v= invalida SW y caché HTTP al re-procesar. */
        const patPic = (e.pic && window.B2P_PICTOS && window.B2P_PICTOS.includes(e.pic)) ? e.pic : e.pat;
        const conImg = window.B2P_PICTOS && window.B2P_PICTOS.includes(patPic);
        const ico = conImg
          ? el('img', { class: 'pat-img', src: 'assets/pictos/' + patPic + '.webp?v=' + (window.B2P_IMG_V || 1), alt: '', loading: 'lazy', decoding: 'async', width: '256', height: '256' })
          : (window.B2P_MAPA && window.B2P_MAPA.svgPat ? el('span', { class: 'pat-ico', html: window.B2P_MAPA.svgPat(e.pat) }) : null);
        if (ico) sh.append(el('div', { class: 'pat-fila' }, ico,
          el('span', { class: 'pat-txt' }, TX.patrones[e.pat])));
      }
      const hist = D.HISTORICO[ejId];
      if (hist) {
        // Sin registro previo, `falta` valía la marca ENTERA y el mensaje decía
        // «te faltan 100,0 kg»: falso —no estás 100 kg por debajo, es que aún no
        // has anotado nada— y desmoralizante el primer día.
        const pr = S.prs[ejId];
        const falta = pr ? hist.kg - pr.kg : null;
        sh.append(el('div', { class: 'alt destaca', style: 'margin-top:10px' },
          el('b', null, tpl(TX.fMarca, { t: hist.txt })),
          el('div', { class: 'mini', style: 'margin-top:2px' },
            falta === null ? TX.fSinRegistro
              : falta > 0 ? tpl(TX.fFaltan, { v: kg1(falta) })
              : TX.fRecuperada)));
      }
      const h = historial(ejId, 5);
      if (h.length) {
        const pr = S.prs[ejId];
        sh.append(el('h4', null, TX.fHistorial + (pr ? ' · ' + tpl(TX.fMejor, { v: kg1(pr.kg) }) : '')));
        sh.append(el('div', { class: 'mini', html: h.map(x => fmtCorta(x.fecha) + ': <b class="num">' + kg1(x.kg) + '</b> kg' + (x.falta ? ' (' + TX.repsAMediasTag + ')' : '')).join(' · ') }));
      } else if (ARR0[ejId]) {
        sh.append(el('h4', null, TX.fArranque));
        sh.append(el('div', { class: 'mini' }, tpl(TX.fArranqueTxt, { v: kg1(ARR0[ejId]) }) + ' ' + ((((D.ARRANQUE || {}).tabla || []).find(r => r.ej === ejId) || {}).n || '')));
      }
      sh.append(el('h4', null, TX.fComo));
      sh.append(el('ul', null, e.cues.map(c => el('li', null, c))));
      sh.append(el('h4', null, TX.fErrores));
      sh.append(el('ul', null, e.err.map(c => el('li', null, c))));
      if (e.alt && e.alt.length) {
        sh.append(el('h4', null, TX.fAlt));
        e.alt.forEach(a => sh.append(el('div', { class: 'alt' }, el('b', null, a.n), ' — ' + a.por)));
      }
      if (e.mol) sh.append(el('div', { class: 'mol' }, e.mol));
      if (ejId === 'dominadas') {
        const on = !!S.flags.dominadaLibre;
        sh.append(el('button', {
          class: on ? 'btn-ghost' : 'btn-b2p', style: 'width:100%;margin-top:14px',
          onclick: ev => { S.flags.dominadaLibre = true; save(); ev.target.textContent = TX.fDomiOk; evaluaLogros(); }
        }, on ? TX.fDomiYa : TX.fDomiBtn));
      }
      /* Logo oficial de YouTube (pastilla + triángulo), transcrito del SVG de
         youtube.com. Se usa tal cual como enlace a YouTube, que es el uso que
         sus propias guías de marca contemplan. */
      const ytIco = '<svg viewBox="0 0 29 20" aria-hidden="true" focusable="false">'
        + '<path d="M14.4848 20C14.4848 20 23.5695 20 25.8229 19.4C27.0917 19.06 28.0459 18.08 28.3808 16.87C29 14.65 29 9.98 29 9.98C29 9.98 29 5.34 28.3808 3.14C28.0459 1.9 27.0917 0.94 25.8229 0.61C23.5695 0 14.4848 0 14.4848 0C14.4848 0 5.42037 0 3.17711 0.61C1.9286 0.94 0.954148 1.9 0.59888 3.14C0 5.34 0 9.98 0 9.98C0 9.98 0 14.65 0.59888 16.87C0.954148 18.08 1.9286 19.06 3.17711 19.4C5.42037 20 14.4848 20 14.4848 20Z" fill="#FF0033"/>'
        + '<path d="M19 10L11.5 5.75V14.25L19 10Z" fill="#FFFFFF"/></svg>';
      sh.append(el('a', {
        href: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(e.nombre.replace(/\s*\([^)]*\)\s*$/, '') + ' ' + (TX.lang === 'es' ? 'técnica' : 'technique')),
        target: '_blank', rel: 'noopener', class: 'yt-link'
      }, el('span', { class: 'yt-ico', html: ytIco }), TX.fVideo));
    });
  }

  /* ---------------- comida del día (menú → recetas) ---------------- */
  function cardComida(d) {
    const menu = D.MENU[dowMon(d)];
    if (!menu) return null;
    const rec = id => D.RECETAS.find(r => r.id === id);
    const w = semanaDe(d);
    const enPlan = w >= 1 && w <= SEMANAS;
    const fase = enPlan ? D.CAL[w - 1].fase : 1;
    const fn = D.NUTRI.fases[fase === 4 ? 2 : fase === 3 ? 1 : 0];
    const sl = enPlan ? slotDe(d) : null;
    // la franja elegida en el cuestionario ordena el día: se dice donde se come
    const franjaNota = (D.__gen && D.META.franja && sl && sl.ses && (sl.ses.tipo === 'fuerza' || sl.ses.tipo === 'cardio') && TX.gen)
      ? TX.gen[{ manana: 'franjaM', mediodia: 'franjaMd', tarde: 'franjaT' }[D.META.franja]] : null;

    const card = el('div', { class: 'card' });
    card.append(el('div', { class: 'card-title' }, el('div', null,
      el('h2', null, TX.comidaHoy),
      el('div', { class: 'sub' }, tpl(TX.comidaHoySub, { kcal: fn.kcal.toLocaleString(TX.lang || 'es'), p: fn.p })))));

    const fila = (icono, etiqueta, recetaId) => {
      if (recetaId === 'LIBRE') {
        return el('button', { class: 'meal-row libre plano', type: 'button', onclick: () => openSheet(sh => {
          sh.append(el('h2', null, TX.comidaLibreTitulo), el('div', { class: 'stag' }, TX.comidaLibreTag),
            el('p', { style: 'font-size:14px' }, D.NUTRI.comidaLibre));
        }) }, el('span', { class: 'mi' }, icono), el('span', { class: 'ml' }, etiqueta),
          el('span', { class: 'mn' }, TX.comidaLibreMn), el('span', { class: 'mk' }, TX.tuya));
      }
      const r = rec(recetaId);
      if (!r) return null;
      return el('button', { class: 'meal-row plano', type: 'button', onclick: () => { if (window.UI && window.UI.sheetReceta) window.UI.sheetReceta(r); } },
        foto(r.id) ? el('img', { class: 'mfoto', src: foto(r.id), alt: '', loading: 'lazy', decoding: 'async', width: '640', height: '640' }) : null,
        el('span', { class: 'mi' }, icono), el('span', { class: 'ml' }, etiqueta),
        el('span', { class: 'mn' }, r.nombre), el('span', { class: 'mk' }, r.macros.kcal + ' kcal'));
    };
    // la toma láctea de la noche no se le planta a quien no toma lácteos
    const vetaLacteo = D.__gen && (D.META.dieta === 'vegano' || (D.META.sin || []).includes('lactosa'));
    /* append nativo con null pinta la palabra «null»: se filtra antes */
    [fila(icono('taza', 18), TX.desayuno, menu.de),
      fila(icono('cubiertos', 18), TX.comidaLbl, menu.co),
      fila(icono('pez', 18), TX.cena, menu.ce),
      vetaLacteo ? null : fila(icono('luna', 18), TX.presueno, 'toma-noche')
    ].filter(Boolean).forEach(x => card.append(x));
    if (vetaLacteo && TX.gen) card.append(el('div', { class: 'mini', style: 'margin-top:6px' }, icono('luna', 13), ' ' + TX.gen.tomaNocheAlt));
    if (franjaNota) card.append(el('div', { class: 'mini', style: 'margin-top:6px' }, franjaNota));

    // el diet break cae donde lo puso el motor, no en la semana 7 de nadie
    const esBreak = enPlan && (((D.HITOS_SEMANA[w] || {}).tipo === 'dietbreak') || (!D.__gen && w === 7));
    if (esBreak) card.append(el('div', { class: 'banner', style: 'margin:10px 0 2px' }, el('div', null, TX.dietBreakChip)));
    else if (enPlan && (fase === 4 || (fase === 3 && sl && sl.ses && sl.ses.tipo === 'fuerza')))
      card.append(el('div', { class: 'mini', style: 'margin-top:8px' }, tpl(TX.extraChip, { f: fase })));
    else if (!enPlan && w === 0)
      card.append(el('div', { class: 'mini', style: 'margin-top:8px' }, tpl(TX.practicaMenu, { f: fmtFecha(INICIO) })));
    return card;
  }

  /* Rangos válidos en UN solo sitio: el aviso los lee de aquí, así que no puede
     decir un límite distinto del que comprueba el código. */
  const RANGO = { peso: [30, 200, 'kg'], cintura: [50, 200, 'cm'] };
  /* Devuelve el número si es válido; si no, avisa con el rango y devuelve null.
     Vacío es "borrar", no un error. */
  function valida(bruto, cual) {
    const [a, b, u] = RANGO[cual];
    const t = String(bruto || '').trim();
    if (!t) return { vacio: true };
    const v = parseFloat(t.replace(',', '.'));
    if (!(v > a && v < b)) { toast(tpl(TX.valFuera, { a, b, u })); return { malo: true }; }
    return { v };
  }

  /* ---------------- vista HOY ---------------- */
  let selDia = hoyISO();

  function renderHoy(root) {
    const d = selDia, dd = dia(d), w = semanaDe(d), sl = slotDe(d);
    const hoy = hoyISO();

    /* — cabecera de día con navegación — */
    const nav = el('div', { class: 'hero' },
      el('div', { style: 'display:flex;align-items:center;gap:8px' },
        el('button', { class: 'icon-btn', 'aria-label': TX.diaAnterior, onclick: () => { selDia = addDays(selDia, -1); render(); } }, '‹'),
        el('div', { class: 'fecha', style: 'flex:1;text-align:center' }, fmtFecha(d) + (d === hoy ? ' · ' + TX.hoyTag : '')),
        el('button', { class: 'icon-btn', 'aria-label': TX.diaSiguiente, style: d >= hoy ? 'visibility:hidden' : '', onclick: () => { selDia = addDays(selDia, 1); render(); } }, '›')
      )
    );
    root.append(nav);
    // el plan que ves salió de tu perfil, y se dice
    if (D.__gen && TX.gen) root.append(el('div', { class: 'mini', style: 'text-align:center;color:var(--volt);margin-top:2px' }, TX.gen.marca));
    /* pausa médica declarada CON plan vigente: no se esconde el plan (eso lo
       decide su médico), pero el estado queda a la vista con su salida */
    if (S.ui.gate && S.perfil && TX.cuest && TX.cuest.gateHoyT) {
      root.append(el('div', { class: 'banner warn' }, el('div', null,
        el('b', null, TX.cuest.gateHoyT),
        el('div', { style: 'margin-top:2px' }, TX.cuest.gateHoyTxt),
        el('button', { class: 'plano qaux', type: 'button', style: 'margin-top:6px;padding:0',
          onclick: () => { delete S.ui.gate; save(); location.hash = '#/quiz'; } }, TX.cuest.gateVolver))));
    }

    /* — antes del plan — */
    if (w === 0) {
      const falta = Math.ceil((fromISO(INICIO) - fromISO(hoy)) / 864e5);
      root.append(el('h1', { style: 'font-size:30px;padding:0 2px' }, falta > 1 ? tpl(TX.empiezaEnDias, { n: falta }) : falta === 1 ? TX.empiezaEn1 : TX.empiezaLunes),
        el('p', { class: 'mut', style: 'padding:0 2px' }, tpl(TX.preplanSub, { f: fmtFecha(INICIO) })));
      const prep = [
        ['cintura', TX.prepCintura],
        ['foto', TX.prepFotos],
        ['compra', TX.prepCompra],
        ['bascula', TX.prepBascula]
      ];
      const c = el('div', { class: 'card' });
      prep.forEach(([k, txt]) => {
        const on = !!(S.flags.prep && S.flags.prep[k]);
        c.append(el('button', { class: 'habit wide' + (on ? ' on' : '') + ' plano', type: 'button', style: 'margin:5px 0',
          'aria-pressed': on ? 'true' : 'false', onclick: ev => {
            S.flags.prep = S.flags.prep || {}; S.flags.prep[k] = !S.flags.prep[k]; save();
            const v = !!S.flags.prep[k];
            ev.currentTarget.classList.toggle('on', v);
            ev.currentTarget.setAttribute('aria-pressed', v ? 'true' : 'false');
            ev.currentTarget.querySelector('.hicon').textContent = v ? '✓' : '○';
          } }, el('div', { class: 'hicon' }, on ? '✓' : '○'), el('div', null, el('div', { class: 'ht' }, txt))));
      });
      root.append(c);
      // el camino por delante: los 4 discos
      const strip = el('div', { class: 'card', style: 'display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;text-align:center' });
      D.FASES.forEach(f => strip.append(el('div', null,
        el('span', { class: 'disco d' + f.id, style: 'margin:0 auto' }, String(f.disco)),
        el('div', { class: 'mini', style: 'margin-top:5px;font-weight:600' }, 'F' + f.id),
        el('div', { class: 'mini', style: 'font-size:11px' }, f.fechas))));
      root.append(strip);
      const cc0 = cardComida(d); if (cc0) root.append(cc0);
    }

    /* — después del plan — */
    if (w === 99) {
      root.append(el('div', { class: 'card', style: 'text-align:center;padding:26px 18px' },
        el('div', { style: 'margin-bottom:4px' }, icono('bandera', 44)),
        el('h2', null, TX.planCompletado),
        el('p', { class: 'mut' }, D.CIERRE),
        // el final nunca es un callejón: el siguiente bloque está a un toque
        TX.ajRehacer ? el('button', { class: 'btn-b2p', style: 'margin-top:14px', type: 'button',
          onclick: hojaRehacer }, TX.ajRehacer) : null));
      /* el cierre recapitula con los datos que la app ya tiene: el único
         momento con derecho a números propios no puede ser el más seco */
      const ms = mediasSemanales();
      const gana = D.META.objetivo === 'ganar';
      const dif = ms.length ? (gana ? ms[ms.length - 1].m - D.META.perfil.pesoSalida : D.META.perfil.pesoSalida - ms[ms.length - 1].m) : 0;
      const recap = el('div', { class: 'card' });
      if (TX.gen && TX.gen.finRecapT) recap.append(el('div', { class: 'card-title' }, el('div', null, el('h2', null, TX.gen.finRecapT))));
      const st = (l, v) => el('div', { class: 'stat' }, el('div', { class: 'sl' }, l), el('div', { class: 'sv num' }, v));
      recap.append(el('div', { class: 'statrow' },
        st(gana ? (TX.pGanado || TX.pPerdido) : TX.pPerdido, ms.length && dif > 0.04 ? (gana ? '+' : '−') + kg1(dif) : '—'),
        st(TX.pSesiones, String(totalFuerza())),
        st('PRs', String(S.prCount || 0)),
        st(TX.pRacha, String(mejorRacha())),
        st(TX.lFotos, D.FOTOS.filter(f => S.dias[f] && S.dias[f].foto).length + '/' + D.FOTOS.length)));
      root.append(recap);
      const ccFin = cardComida(d); if (ccFin) root.append(ccFin);   // el menú sigue siendo válido
    }

    /* — semana del plan — */
    if (w >= 1 && w <= SEMANAS && sl) {
      const fase = sl.fase;
      root.append(el('h1', { style: 'font-size:30px;padding:0 2px' }, sl.ses ? sl.ses.nombre : TX.descanso),
        el('div', { class: 'sub', style: 'padding:0 2px;color:var(--ink2)' },
          tpl(TX.semanaLinea, { w, t: SEMANAS, f: fase.id, n: fase.nombre, r: fase.rpe })));

      // banner de semana especial
      const hito = D.HITOS_SEMANA[w];
      if (hito) root.append(el('div', { class: 'banner' + (hito.tipo === 'descarga' || w === 9 ? ' warn' : hito.tipo === 'dietbreak' ? '' : w === 10 ? ' hot' : '') },
        el('div', null, el('b', null, hito.t), el('div', { style: 'margin-top:2px' }, hito.d))));

      /* sesión de fuerza */
      if (sl.ses && sl.ses.tipo === 'fuerza') {
        const card = el('div', { class: 'card fase-card p' + fase.id });
        card.append(el('div', { class: 'card-title' },
          el('span', { class: 'disco d' + fase.id }, String(fase.disco)),
          el('div', null, el('h2', null, sl.ses.nombre), el('div', { class: 'sub' }, tpl(TX.sesionSub, { d: sl.ses.dur })))));

        // calentamiento
        const cal = el('details', { class: 'fold' },
          el('summary', null, TX.calentamiento),
          el('div', { class: 'fold-in' },
            el('ul', { style: 'margin:4px 0;padding-left:18px' }, D.CALENTAMIENTO.pasos.map(p => el('li', null, p))),
            w >= 3 ? el('div', { class: 'mini' }, D.CALENTAMIENTO.gym) : null));
        card.append(cal);

        // ejercicios
        sl.ses.bloques.forEach(b => {
          const e = D.EJERCICIOS[b.e]; if (!e) return;
          const lg = (dd.ej && dd.ej[b.e]) || {};
          /* rW define reps por semana; más allá de la última definida se
             conserva LA ÚLTIMA (no la primera): las semanas 3+ de un circuito
             heredaban las reps de la semana 1 y mataban la progresión */
          const reps = b.rW ? (b.rW[w] || (() => {
            const ks = Object.keys(b.rW).map(Number).filter(k => k <= w);
            return ks.length ? b.rW[Math.max(...ks)] : Object.values(b.rW)[0];
          })()) : b.r;
          /* La semana de descarga decía una cosa arriba y otra abajo: el banner
             pedía «la MITAD de series» y la dosis seguía marcando las series
             completas. La bandera del calendario no la consumía nadie.
             Redondeo hacia arriba: la mitad de 3 series no es 1, que sería un
             tercio; con 2 se conserva el estímulo, que es de lo que trata una
             descarga (mantener tejido, no cesar). */
          const enDescarga = !!(D.CAL[w - 1] && D.CAL[w - 1].descarga);
          const series = enDescarga ? Math.ceil(b.s / 2) : b.s;
          const dosis = series + '×' + reps;
          /* Sin carga externa no hay campo de kg: pedir un peso en la plancha
             es pedir un dato sin respuesta. La mochila opcional sí carga. */
          const esBW = /^(nada|toalla)/i.test(e.equipo || '') && !/mochila/i.test(e.equipo || '');
          const sug = esBW ? null : sugerencia(b.e, d);

          // El placeholder NUNCA es la sugerencia: en gris se lee como valor ya
          // puesto y la gente marca ✓ sin registrar nada. La sugerencia vive en
          // su chip (tocable) y se compromete sola al marcar ✓.
          const kgIn = el('input', { type: 'text', inputmode: 'decimal', placeholder: 'kg',
            'aria-label': e.nombre + ' · kg',
            value: lg.kg ? String(lg.kg).replace('.', ',') : '',
            onchange: ev => {
              const v = parseFloat(ev.target.value.replace(',', '.'));
              const L = logEj(d, b.e);
              if (v > 0) L.kg = v; else delete L.kg;
              save();
              if (v > 0 && chipSug) chipSug.remove();
            } });

          // La dosis vuelve a ser lo que parece: una etiqueta.
          const doseChip = el('span', { class: 'dose' + (enDescarga ? ' descarga' : '') },
            dosis + (enDescarga ? ' · ' + TX.descargaDosis : ''));

          // «Reps a medias» decide el peso de la próxima sesión, así que ahora
          // se dice con palabras y solo aparece cuando el ejercicio está hecho:
          // antes era un ✂ escondido en un title que en táctil nunca sale.
          const repWrap = el('span', { class: 'repwrap' });
          function pintaRep() {
            repWrap.innerHTML = '';
            const L = (dd.ej && dd.ej[b.e]) || {};
            if (!L.done) return;
            const corto = !!L.falta;
            repWrap.append(el('button', {
              class: 'repchip' + (corto ? ' corto' : ''), 'aria-pressed': corto ? 'true' : 'false',
              onclick: ev => {
                ev.stopPropagation();
                const X = logEj(d, b.e); X.falta = !X.falta; save();
                pintaRep();
                toast(X.falta ? TX.repsAMediasToast : TX.repsLimpiasToast);
              }
            }, corto ? '✂ ' + TX.repsCortas : '✓ ' + TX.repsLimpias));
          }

          // Chip de sugerencia: tocarlo escribe el peso como valor real.
          const chipSug = (sug && !lg.kg) ? el('span', { class: 'sugg', role: 'button', tabindex: '0',
            title: TX.usarPeso, 'aria-label': TX.usarPeso + ': ' + kg1(sug.kg) + ' kg',
            onclick: ev => { ev.stopPropagation(); aceptaSug(); },
            onkeydown: ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); ev.stopPropagation(); aceptaSug(); } }
          }, sug.txt) : null;

          function aceptaSug() {
            if (!sug) return;
            const L = logEj(d, b.e); L.kg = sug.kg; save();
            kgIn.value = kg1(sug.kg);
            if (chipSug) chipSug.remove();
          }

          const check = el('button', { class: 'checkbtn' + (lg.done ? ' on' : ''), 'aria-pressed': lg.done ? 'true' : 'false',
            'aria-label': TX.marcarHecho + ': ' + e.nombre, onclick: ev => {
            const L = logEj(d, b.e); L.done = !L.done; save();
            ev.currentTarget.classList.toggle('on', L.done);
            ev.currentTarget.setAttribute('aria-pressed', L.done ? 'true' : 'false');
            const inVal = parseFloat((kgIn.value || '').replace(',', '.'));
            // Marcar hecho SIN peso congelaba la progresión para siempre: si hay
            // valor tecleado se guarda, y si no lo hay se acepta la sugerencia.
            if (L.done && !L.kg) {
              if (inVal > 0) { L.kg = inVal; save(); if (chipSug) chipSug.remove(); }
              else if (sug) aceptaSug();
            }
            pintaRep();
            actualizaCerrar();
          }, html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' });

          const row = el('div', { class: 'exrow' },
            el('div', { class: 'exmain' },
              // El botón es SOLO el nombre, no todo el bloque: dentro de .exmain
              // viven el cronómetro y los chips de reps, y un <button> no puede
              // contener otros botones.
              el('button', { class: 'exname plano', type: 'button', onclick: () => fichaEjercicio(b.e, { dosis }) },
                e.nombre, el('span', { class: 'info', html: ' ⓘ' })),
              el('div', { class: 'exmeta' },
                doseChip,
                el('button', { class: 'rest plano', type: 'button', onclick: ev => { ev.stopPropagation(); timerStart(b.d); } }, icono('reloj', 13), ' ' + (b.d >= 60 ? Math.floor(b.d / 60) + '′' + (b.d % 60 ? (b.d % 60) + '″' : '') : b.d + '″')),
                chipSug, repWrap),
              b.n ? el('div', { class: 'exnote' }, b.n) : null),
            esBW ? null : el('div', { class: 'kgbox' }, kgIn, el('span', { class: 'u' }, 'kg')),
            check);
          pintaRep();
          card.append(row);
        });

        // bloque tendón contextual
        const tb = [];
        // el bloque rotuliano de F1 es del que vuelve o empieza; quien entrena ya no reactiva nada
        if (sl.ses.tendon === 'rodilla' || (fase.id === 1 && D.META.historial !== 'activo')) tb.push(D.TENDON.bloques[0]);
        if (['torso-a', 'torso-b', 'fb-a', 'fb-b', 'push-a', 'pull-a', 'push-b', 'pull-b'].includes(sl.sid)) tb.push(D.TENDON.bloques[3]);
        if (tb.length) {
          const on = !!dd.tendon;
          card.append(el('button', { class: 'habit wide' + (on ? ' on' : '') + ' plano', type: 'button', style: 'margin-top:10px',
            'aria-pressed': on ? 'true' : 'false',
            onclick: ev => {
              dd.tendon = !dd.tendon; save();
              ev.currentTarget.classList.toggle('on', !!dd.tendon);
              ev.currentTarget.setAttribute('aria-pressed', dd.tendon ? 'true' : 'false');
            } },
            el('div', { class: 'hicon' }, icono('escudo', 19)),
            el('div', { style: 'flex:1' }, el('div', { class: 'ht' }, TX.tendonNombre + ' · ' + tb.map(x => x.nombre.split(' ·')[0]).join(' + ')),
              el('div', { class: 'hs' }, tb.map(x => x.detalle.split('.')[0]).join(' · ')))));
        }
        root.append(card);
      }

      /* sesión de cardio */
      if (sl.ses && sl.ses.tipo === 'cardio') {
        const card = el('div', { class: 'card fase-card p' + fase.id });
        card.append(el('div', { class: 'card-title' },
          el('span', { class: 'disco d' + fase.id }, String(fase.disco)),
          el('div', null, el('h2', null, sl.ses.nombre + (sl.opt ? ' · ' + TX.opcional : '')),
            el('div', { class: 'sub' }, sl.ses.icono === 'run' ? TX.cadenciaSub : TX.recuperacionSub))));
        card.append(el('p', { style: 'font-size:14px' }, sl.ses.detalle));
        if (sl.ses.icono === 'run') card.append(el('div', { class: 'mini', style: 'margin-top:4px' }, TX.tibialisAviso));
        const on = !!dd.sesionOk;
        card.append(el('button', { class: 'cerrar' + (on ? ' hecho' : ''), style: 'margin:12px 0 4px', onclick: ev => {
          dd.sesionOk = !dd.sesionOk; if (dd.sesionOk) dd.sesionTipo = 'cardio'; save();
          ev.currentTarget.classList.toggle('hecho', !!dd.sesionOk);
          ev.currentTarget.textContent = dd.sesionOk ? TX.cardioHecho : TX.cardioMarcar;
          evaluaLogros();
        } }, on ? TX.cardioHecho : TX.cardioMarcar));
        const minIn = el('input', { type: 'text', inputmode: 'numeric', placeholder: 'min', 'aria-label': TX.minutosReales, value: dd.cardioMin || '', style: 'width:70px;min-height:44px;text-align:center;font-family:var(--mono);background:var(--surface2);border:1px solid var(--line);border-radius:8px;padding:7px', onchange: ev => { const v = parseInt(ev.target.value); if (v > 0) dd.cardioMin = v; else delete dd.cardioMin; save(); } });
        card.append(el('div', { style: 'display:flex;align-items:center;gap:8px;font-size:13px;color:var(--ink2)' }, TX.minutosReales, minIn));
        root.append(card);
      }

      /* día libre */
      if (sl.ses && sl.ses.tipo === 'libre') {
        root.append(el('div', { class: 'card' },
          el('div', { class: 'card-title' }, el('div', null, el('h2', null, dowMon(d) === 6 ? TX.domingoPrep : TX.descanso),
            el('div', { class: 'sub' }, sl.ses.detalle)))));
      }

      /* la comida del día */
      const cc = cardComida(d); if (cc) root.append(cc);

      /* hábitos del día */
      root.append(el('div', { class: 'sec-h' }, el('h2', null, TX.diaADia)));
      const hb = el('div', { class: 'habits' });
      const mkHabit = (key, icon, titulo, sub, wide) => {
        const on = !!dd[key];
        // toggle en el sitio (sin re-render): así la página no salta arriba
        return el('button', { class: 'habit' + (on ? ' on' : '') + (wide ? ' wide' : '') + ' plano', type: 'button',
          'aria-pressed': on ? 'true' : 'false',
          onclick: ev => {
            dd[key] = !dd[key]; save();
            ev.currentTarget.classList.toggle('on', !!dd[key]);
            ev.currentTarget.setAttribute('aria-pressed', dd[key] ? 'true' : 'false');
            evaluaLogros();
          } },
          el('div', { class: 'hicon' }, icon),
          el('div', null, el('div', { class: 'ht' }, titulo), sub ? el('div', { class: 'hs' }, sub) : null));
      };
      hb.append(mkHabit('pasos', icono('actividad', 20), TX.hPasos, TX.hPasosSub));
      hb.append(mkHabit('prote', icono('capas', 20), TX.hProte, tpl(TX.hProteSub, { q: D.__qMin || 40 })));

      const dow = dowMon(d);
      if ([0, 2, 4].includes(dow)) {
        const pIn = el('input', { type: 'text', inputmode: 'decimal', placeholder: '—', 'aria-label': TX.hPeso + ' · kg', value: dd.peso ? String(dd.peso).replace('.', ',') : '', onchange: ev => {
          // Antes, un 250 mal tecleado borraba en silencio el peso que ya tenías
          // guardado. Ahora se avisa con el rango y se conserva lo anterior.
          const r = valida(ev.target.value, 'peso');
          if (r.malo) { ev.target.value = dd.peso ? String(dd.peso).replace('.', ',') : ''; return; }
          if (r.vacio) { delete dd.peso; save(); ev.target.closest('.habit').classList.remove('on'); return; }
          dd.peso = r.v; save(); toast(tpl(TX.pesoGuardado, { v: kg1(r.v) }));
          ev.target.closest('.habit').classList.add('on'); evaluaLogros();
        } });
        hb.append(el('div', { class: 'habit wide' + (dd.peso ? ' on' : '') },
          el('div', { class: 'hicon' }, icono('bascula', 20)),
          el('div', null, el('div', { class: 'ht' }, TX.hPeso), el('div', { class: 'hs' }, TX.hPesoSub)),
          pIn, el('span', { class: 'u mini' }, 'kg')));
      }
      if (dow === 0) {
        const cIn = el('input', { type: 'text', inputmode: 'decimal', placeholder: '—', 'aria-label': TX.hCintura + ' · cm', value: dd.cintura ? String(dd.cintura).replace('.', ',') : '', onchange: ev => {
          const r = valida(ev.target.value, 'cintura');
          if (r.malo) { ev.target.value = dd.cintura ? String(dd.cintura).replace('.', ',') : ''; return; }
          if (r.vacio) { delete dd.cintura; save(); ev.target.closest('.habit').classList.remove('on'); return; }
          dd.cintura = r.v; save(); toast(tpl(TX.cinturaGuardada, { v: kg1(r.v) }));
          ev.target.closest('.habit').classList.add('on'); evaluaLogros();
        } });
        hb.append(el('div', { class: 'habit wide' + (dd.cintura ? ' on' : '') },
          el('div', { class: 'hicon' }, icono('cinta', 20)),
          el('div', null, el('div', { class: 'ht' }, TX.hCintura), el('div', { class: 'hs' }, TX.hCinturaSub)),
          cIn, el('span', { class: 'u mini' }, 'cm')));
      }
      if (dow === 6) hb.append(mkHabit('prep', icono('caja', 20), TX.hPrep, TX.hPrepSub, true));
      if (D.FOTOS.includes(d)) hb.append(mkHabit('foto', icono('camara', 20), TX.hFoto, TX.hFotoSub, true));
      root.append(hb);

      /* cerrar el día — la regla del 60% se enseña ANTES del toque, la etiqueta
         no miente cuando no hubo sesión, y el cierre se puede deshacer.      */
      const esFuerza = !!(sl.ses && sl.ses.tipo === 'fuerza');
      const totalEj = esFuerza ? sl.ses.bloques.length : 0;
      const minEj = esFuerza ? Math.ceil(totalEj * 0.6) : 0;
      const hechosAhora = () => esFuerza ? sl.ses.bloques.filter(b => dd.ej && dd.ej[b.e] && dd.ej[b.e].done).length : 0;
      const cuentaAhora = () => !esFuerza || hechosAhora() >= minEj;

      const nota = esFuerza && !dd.cerrado ? el('div', { class: 'cierre-nota' }) : null;
      if (nota) root.append(nota);

      const btn = el('button', { class: 'cerrar' + (dd.cerrado ? ' hecho' : ''), id: 'btnCerrar', onclick: () => {
        if (esFuerza) {
          dd.sesionOk = cuentaAhora();
          if (dd.sesionOk) dd.sesionTipo = 'fuerza';
        }
        // PRs del día
        if (dd.ej) Object.keys(dd.ej).forEach(ejId => {
          const L = dd.ej[ejId];
          if (L.kg && L.done && !L.falta) {
            const pr = S.prs[ejId];
            if (!pr || L.kg > pr.kg) { S.prs[ejId] = { kg: L.kg, fecha: d }; if (pr) { S.prCount++; toast(tpl(TX.prToast, { e: (D.EJERCICIOS[ejId] || {}).nombre, v: kg1(L.kg) })); } }
          }
        });
        // comeback: hueco de ≥3 días. El plan solo deja libre el domingo, así que
        // 3 días ya es un parón real — a 4 el logro llegaba cuando ya se había ido.
        const previos = Object.keys(S.dias).filter(f => f < d && (S.dias[f].cerrado || S.dias[f].sesionOk)).sort();
        // el logro dice «4 o más días»: el código dispara donde dice el texto
        if (previos.length) { const ult = previos[previos.length - 1]; if ((fromISO(d) - fromISO(ult)) / 864e5 >= 4) S.flags.comeback = true; }
        const huboSesion = cuentaAhora();
        dd.cerrado = true; save();
        const nuevos = evaluaLogros();
        render();
        if (!nuevos.length) {
          if (esFuerza && !huboSesion) toast(TX.sinSesionToast);
          else if (cumplido(d)) toast(tpl(TX.diaCerradoToast, { n: racha(d) }));
          else toast(TX.diaCerradoSolo);
        }
      } }, dd.cerrado
        ? (racha(d) >= 1 ? tpl(TX.diaCerradoBtn, { n: racha(d) }) : TX.diaCerradoSinRacha)
        : TX.cerrarDia);
      root.append(btn);

      // El hook que estaba vacío: mantiene nota y etiqueta al día sin re-render
      // (re-renderizar en cada ✓ mandaba la página al principio).
      function actualizaCerrar() {
        if (nota) nota.textContent = tpl(TX.hechosDe, { a: hechosAhora(), b: totalEj, c: minEj });
        if (!dd.cerrado && esFuerza) {
          const ok = cuentaAhora();
          btn.textContent = ok ? TX.cerrarDia : TX.cerrarSinSesion;
          btn.classList.toggle('flojo', !ok);
        }
      }
      actualizaCerrar();

      if (dd.cerrado) {
        const rk = racha(d), mej = mejorRacha();
        const notas = [];
        // Estricto pero digno: la racha se rompe de verdad, pero nunca se pinta
        // «racha 0» junto a un ✓, y lo conseguido no desaparece.
        if (rk < 1) { notas.push(TX.sinRachaHoy); if (mej >= 2) notas.push(tpl(TX.mejorRachaNota, { n: mej })); }
        notas.push(TX.sigueEditando);
        root.append(el('div', { class: 'mini', style: 'text-align:center;margin-top:6px' }, notas.join(' ')));
        root.append(el('button', { class: 'reabrir', onclick: () => {
          delete dd.cerrado; delete dd.sesionOk; delete dd.sesionTipo; save();
          render(); toast(TX.diaReabierto);
        } }, TX.reabrirDia));
      }
    }
  }

  /* ---------------- ajustes / backup ---------------- */
  const IDIOMAS = [
    ['es', '🇪🇸', 'Español'], ['en', '🇬🇧', 'English'], ['fr', '🇫🇷', 'Français'],
    ['de', '🇩🇪', 'Deutsch'], ['it', '🇮🇹', 'Italiano']
  ];
  /* ---------------- buscador global ----------------
     Una burbuja flotante abre un buscador que lleva a cualquier parte:
     secciones y apartados, cada ejercicio (su ficha) y cada plato (su
     receta). El índice se construye al abrir, del plan YA generado. */
  const sinAcentos = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  function irA(hash, id, folds) {
    closeSheet();
    const salto = () => setTimeout(() => {
      (folds || []).forEach(fid => { const f = $('#' + fid); if (f) f.open = true; });
      const t = id && document.getElementById(id);
      if (t) scrollTo({ top: t.getBoundingClientRect().top + scrollY - 78, behavior: 'smooth' });
    }, 380);
    if (location.hash === hash) salto(); else { location.hash = hash; salto(); }
  }
  function construyeIndice() {
    const IDX = [];
    const secc = (t, hash, id, folds) => t && IDX.push({ t, sub: null, go: () => irA(hash, id, folds) });
    const rutas = ['hoy', 'plan', 'nutricion', 'progreso', 'logros'];
    TX.tabs.forEach((t, i) => secc(t, '#/' + rutas[i]));
    secc(TX.perfilT, '#/perfil');
    // apartados de Plan
    secc(TX.vCalendario, '#/plan', 'pl-cal');
    secc(TX.chipFases || TX.vFasesDetalle, '#/plan', 'pl-fases');
    secc(TX.segPlan[2], '#/plan', 'pl-ej');
    secc(TX.vBiblioteca, '#/plan', 'pl-ej');
    secc(TX.vSeguros, '#/perfil', 'pf-seguros', ['pf-detras', 'pf-seguros']);
    // apartados de Comida (el plato vive en Detrás del plan)
    [['n-obj', 0], ['n-rec', 2], ['n-menu', 3], ['n-compra', 4], ['n-prep', 5], ['n-supl', 6]]
      .forEach(([id, i]) => secc(TX.chipsNutri[i], '#/nutricion', id));
    secc(TX.nPlato, '#/perfil', 'pf-plato', ['pf-detras', 'pf-plato']);
    // apartados de Progreso
    [['p-res', 0], ['p-peso', 1], ['p-cint', 2], ['p-carg', 3], ['p-adh', 4], ['p-chk', 5]]
      .forEach(([id, i]) => secc(TX.chipsProg[i], '#/progreso', id));
    // Mi Perfil y su sala de máquinas
    secc(TX.ajustes, '#/perfil', 'pf-ajustes', ['pf-ajustes']);
    secc(TX.ajIdioma, '#/perfil', 'pf-ajustes', ['pf-ajustes']);
    secc(TX.ajCopia, '#/perfil', 'pf-ajustes', ['pf-ajustes']);
    secc(TX.cerrarSesion, '#/perfil');
    secc(TX.perfilDetrasT, '#/perfil', 'pf-detras', ['pf-detras']);
    secc(TX.vReglas8, '#/perfil', 'pf-reglas', ['pf-detras', 'pf-reglas']);
    secc(TX.nNumeros, '#/perfil', 'pf-numeros', ['pf-detras', 'pf-numeros']);
    secc(TX.vCiencia, '#/perfil', 'pf-ciencia', ['pf-detras', 'pf-ciencia']);
    secc(TX.ajRehacer, '#/perfil');
    // cada ejercicio, a su ficha
    Object.keys(D.EJERCICIOS).forEach(id => {
      const e = D.EJERCICIOS[id];
      IDX.push({ t: e.nombre.replace(/\s*\([^)]*\)\s*$/, ''), sub: TX.quizCatEj,
        go: () => { closeSheet(); setTimeout(() => fichaEjercicio(id, {}), 230); } });
    });
    // cada plato (los tuyos), a su receta
    const recetas = (D.__gen && window.B2P_GEN)
      ? D.RECETAS.filter(r => window.B2P_GEN.recetaVale(r, { dieta: D.META.dieta, sin: D.META.sin || [] }, new Set(D.META.gustosNo || [])))
      : D.RECETAS;
    recetas.forEach(r => IDX.push({ t: r.nombre, sub: TX.quizCatCom,
      go: () => { closeSheet(); setTimeout(() => { if (window.UI.sheetReceta) window.UI.sheetReceta(r); }, 230); } }));
    return IDX;
  }
  function abreBuscador() {
    openSheet(sh => {
      sh.append(el('h2', null, TX.buscarT));
      const inp = el('input', { type: 'search', id: 'bsq', placeholder: TX.buscarPH, autocomplete: 'off', enterkeyhint: 'go' });
      sh.append(el('div', { class: 'field', style: 'margin-top:8px' }, inp));
      const res = el('div', { class: 'bsq-res' });
      sh.append(res);
      const IDX = construyeIndice();
      const pinta = () => {
        const q = sinAcentos(inp.value.trim());
        res.innerHTML = '';
        const hits = q ? IDX.filter(x => sinAcentos(x.t).includes(q) || (x.sub && sinAcentos(x.sub).includes(q))).slice(0, 12)
          : IDX.slice(0, 6);   // sin escribir: las puertas principales
        if (!hits.length) { res.append(el('p', { class: 'mini' }, TX.buscarNada)); return; }
        hits.forEach(x => res.append(el('button', { class: 'habit wide plano', type: 'button', style: 'margin:4px 0', onclick: x.go },
          el('div', { class: 'hicon' }, icono(x.sub === TX.quizCatEj ? 'mancuerna' : x.sub === TX.quizCatCom ? 'cubiertos' : 'pin', 19)),
          el('div', { style: 'flex:1' }, el('div', { class: 'ht' }, x.t), x.sub ? el('div', { class: 'hs' }, x.sub) : null))));
      };
      inp.addEventListener('input', pinta);
      inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') { const b = res.querySelector('button'); if (b) b.click(); } });
      pinta();
      setTimeout(() => inp.focus(), 120);
    });
  }

  /* Rehacer no es una sola puerta: eliges qué rehacer. Solo los datos (el
     mazo no se toca), solo el mazo (desde cero), o el cuestionario entero. */
  function hojaRehacer() {
    openSheet(sh => {
      sh.append(el('h2', null, TX.ajRehacer), el('div', { class: 'stag' }, TX.rehacerSub));
      const opcion = (icono, t, sub, solo) => el('button', { class: 'habit wide plano', type: 'button', style: 'margin:5px 0',
        onclick: () => {
          delete S.ui.cuest;
          /* el estado del mazo se limpia SIEMPRE: el prefill del cuestionario
             lo re-siembra desde el perfil solo cuando el mazo no se re-juega
             («solo datos») — así un intento abandonado no pisa tus gustos */
          delete S.ui.quiz;
          S.ui.cuest = { paso: 0, d: {}, solo };    // el prefill rellena los datos al entrar
          save(); closeSheet(); location.hash = '#/quiz';
        } },
        el('div', { class: 'hicon' }, icono),
        el('div', { style: 'flex:1' }, el('div', { class: 'ht' }, t), el('div', { class: 'hs' }, sub)));
      sh.append(
        opcion(icono('portapapeles', 20), TX.rehacerDatos, TX.rehacerDatosSub, 'datos'),
        opcion(icono('cartas', 20), TX.rehacerGustos, TX.rehacerGustosSub, 'gustos'),
        opcion(icono('repetir', 20), TX.rehacerTodo, TX.rehacerTodoSub, 'todo'));
      sh.append(el('p', { class: 'mini', style: 'margin-top:8px' }, TX.ajRehacerNota));
    });
  }

  /* Añadir la cintura a posteriori: SOLO el dato que falta, en su hoja.
     No toca ejercicios ni dieta (solo activa la meta y los logros de
     cintura), así que se aplica sin preguntar y el plan se regenera solo. */
  function hojaCintura() {
    const C = TX.cuest || {};
    openSheet(sh => {
      sh.append(el('h2', null, (C.cinturaL || '').replace(/\s*·.*$/, '')));
      sh.append(el('p', { class: 'mini' }, TX.perfilCinturaNota));
      const inp = el('input', { type: 'text', inputmode: 'decimal', id: 'perfil-cint', placeholder: '100' });
      sh.append(el('div', { class: 'field' }, el('label', { for: 'perfil-cint' }, C.cinturaL || 'cm'), inp));
      sh.append(el('button', { class: 'btn-b2p', style: 'width:100%', type: 'button', onclick: () => {
        const r = valida(inp.value, 'cintura');
        if (r.malo || r.vacio) { if (r.vacio) toast(tpl(TX.valFuera, { a: RANGO.cintura[0], b: RANGO.cintura[1], u: RANGO.cintura[2] })); return; }
        S.perfil.cinturaCm = r.v;
        if (!S.config.cinturaBase) S.config.cinturaBase = r.v;
        save(); toast(TX.ajGuardado); closeSheet();
        setTimeout(() => location.reload(), 350);
      } }, TX.ajGuardar));
    });
  }

  /* ---------------- MI PERFIL ----------------
     Deja de ser una hoja de «configuración»: primero quién eres y qué plan
     tienes (con la puerta de rehacerlo), después los ajustes, y la ciencia
     como lectura extra para quien quiera investigar. */
  function renderPerfil(root) {
    const sh = root;                              // mismo cuerpo, ahora como vista
    const C = TX.cuest || {};
    // identidad
    sh.append(el('div', { class: 'card perfil-hero' },
      el('div', { class: 'ph-nombre' }, (S.usuario && S.usuario.nombre) || 'BACK2PRIME'),
      S.usuario ? el('div', { class: 'mini' }, tpl(TX.pDesde || 'desde {v}', { v: fmtCorta(S.usuario.creado) })) : null,
      el('div', { class: 'mini', style: 'margin-top:4px' }, TX.ajustesSub)));

    // tus respuestas: el contrato del cuestionario, siempre a la vista
    if (S.perfil && C.titulo) {
      const P = S.perfil;
      const M = {
        objetivo: { perder: C.objPerder, recomp: C.objRecomp, ganar: C.objGanar, mantener: C.objMantener },
        evento: { boda: C.evBoda, oposicion: C.evOpo, verano: C.evVerano, siempre: C.evSiempre },
        duracionSem: { 12: C.dur3, 24: C.dur6, 48: C.dur12, 0: C.durAlways },
        historial: { nunca: C.histNunca, retomador: C.histRetoma, activo: C.histActivo },
        material: { nada: C.matNada, casa: C.matCasa, gym: C.matGym },
        dieta: { normal: C.dietaNormal, vegetariano: C.dietaVegetariano, vegano: C.dietaVegano },
        franja: { manana: C.franjaM, mediodia: C.franjaMd, tarde: C.franjaT2 },
        les: { rodilla: C.lesRodilla, hombro: C.lesHombro, lumbar: C.lesLumbar },
        sin: { gluten: C.sinGluten, lactosa: C.sinLactosa, frutos: C.sinFrutos }
      };
      const sx = { h: C.sexoH, m: C.sexoM, x: C.sexoX }[P.sexo];
      /* la cintura es un dato más de tus respuestas: si falta, un «+» al lado
         deja añadir SOLO ese dato (los iniciales, en los que se basó el plan,
         no se tocan aquí: para eso está rehacer). Añadirla no varía plan ni
         dieta — solo activa su meta y sus logros — así que no hay pop-up. */
      const medidas = P.edad + ' · ' + P.alturaCm + ' cm · ' + P.pesoKg + ' kg' + (sx ? ' · ' + sx : '')
        + (P.cinturaCm ? ' · ' + P.cinturaCm + ' cm' : '');
      const filas = [[null, medidas, !P.cinturaCm]];
      [['objetivo', C.resLObj], ['evento', C.resLEv], ['duracionSem', C.resLDur], ['historial', C.resLHist],
       ['material', C.resLMat], ['dieta', C.resLDieta], ['franja', C.resLFranja]].forEach(par => {
        const v = M[par[0]] && M[par[0]][P[par[0]]];
        if (v) filas.push([par[1], v]);
      });
      if (P.diasSemana) filas.push([null, P.diasSemana + '×' + (P.minSesion || '—') + '′']);
      if ((P.lesiones || []).length) filas.push([C.resLLes, P.lesiones.map(x => M.les[x] || x).join(' · ')]);
      if ((P.sin || []).length) filas.push([C.resLSin, P.sin.map(x => M.sin[x] || x).join(' · ')]);
      const tarj = el('div', { class: 'card', style: 'gap:8px' });
      tarj.append(el('div', { class: 'card-title' }, el('div', null, el('h2', null, TX.perfilDatosT || C.titulo))));
      filas.forEach(f => tarj.append(el('div', { class: 'cres' },
        f[0] ? el('span', { class: 'cres-l' }, f[0]) : null, f[1],
        f[2] && TX.perfilCinturaAdd ? el('button', { class: 'addchip plano', type: 'button',
          onclick: hojaCintura }, TX.perfilCinturaAdd) : null)));
      tarj.append(el('button', { class: 'btn-b2p', style: 'width:100%;margin-top:8px', type: 'button',
        onclick: hojaRehacer }, TX.ajRehacer));
      tarj.append(el('p', { class: 'mini', style: 'margin:6px 0 0' }, TX.ajRehacerNota));
      sh.append(tarj);
    }

    // tu plan, en corto
    if (D.__gen && TX.perfilPlanT) {
      const st = (l, v) => el('div', { class: 'stat' }, el('div', { class: 'sl' }, l), el('div', { class: 'sv num' }, v));
      sh.append(el('div', { class: 'card' },
        el('div', { class: 'card-title' }, el('div', null, el('h2', null, TX.perfilPlanT),
          el('div', { class: 'sub' }, fmtCorta(D.META.inicioISO) + ' – ' + fmtCorta(D.META.finISO) + ' · ' + (D.FASES[1] ? D.FASES[1].sub : '')))),
        el('div', { class: 'statrow' },
          st(TX.sem, String(SEMANAS)),
          st(TX.kcalLbl, String((D.NUTRI.fases[0] || {}).kcal || '—')),
          st(TX.nProteLbl, D.META.perfil.proteinaDia + ' g'))));
    }

    /* ---- 🧠 Detrás del plan: reglas, números y ciencia — la sala de
       máquinas, plegada para quien quiera mirar dentro ---- */
    const foldSub = (id2, titulo, ...kids) => el('details', { class: 'fold', id: id2 },
      el('summary', null, titulo), el('div', { class: 'fold-in' }, ...kids));
    const wP = semanaDe(hoyISO());
    const faseNP = (wP >= 1 && wP <= SEMANAS) ? D.CAL[wP - 1].fase : 1;
    const fiN = faseNP === 4 ? 2 : faseNP === 3 ? 1 : 0;
    sh.append(el('details', { class: 'fold', id: 'pf-detras', style: 'margin-top:14px' },
      el('summary', null, icono('cerebro', 15), ' ' + TX.perfilDetrasT),
      el('div', { class: 'fold-in' },
        foldSub('pf-reglas', TX.vReglas8,
          el('div', { class: 'mini', style: 'margin-bottom:6px' }, TX.vReglasSub),
          el('div', { class: 'regla-g' }, D.REGLAS.map(r => el('div', { class: 'regla' }, el('b', null, r.n + ' · ' + r.t), r.d))),
          el('div', { class: 'banner hot', style: 'margin-top:12px' }, el('div', null, el('b', null, TX.senalesTitulo), el('div', null, D.SENALES))),
          el('div', { class: 'banner ok' }, el('div', null, el('b', null, TX.objetivoReal), el('div', null, D.CIERRE)))),
        foldSub('pf-seguros', TX.vSeguros,
          el('div', { class: 'regla destaca', style: 'margin-bottom:8px' }, el('b', null, D.TENDON.titulo), el('div', { style: 'margin-top:3px' }, D.TENDON.intro)),
          D.TENDON.bloques.map(b => el('div', { class: 'regla', style: 'margin:8px 0' }, el('b', null, b.nombre), el('div', { class: 'mini', style: 'margin-bottom:3px' }, b.donde), b.detalle)),
          el('p', { class: 'mini' }, D.TENDON.nota),
          D.CARRERA ? el('div', { class: 'regla', style: 'margin-top:10px' }, el('b', null, D.CARRERA.titulo),
            el('ul', { style: 'font-size:13px;padding-left:17px;margin:6px 0 0' }, D.CARRERA.reglas.map(r => el('li', null, r)))) : null),
        foldSub('pf-plato', TX.nPlato,
          el('div', { class: 'regla-g' }, D.NUTRI.plato.map(pp => el('div', { class: 'regla' }, el('b', null, pp.t), pp.d)))),
        foldSub('pf-numeros', TX.nNumeros,
          el('div', { class: 'tw' }, el('table', null, D.NUTRI.calorias.map(c => el('tr', null, el('td', null, c.c, el('div', { class: 'mini' }, c.n)), el('td', { class: 'sr' }, c.v))))),
          el('div', { class: 'tw' }, el('table', null,
            el('tr', null, el('th', null, TX.fase), el('th', null, TX.kcalLbl), el('th', null, 'P'), el('th', null, 'G'), el('th', null, 'C')),
            D.NUTRI.fases.map((f, i) => el('tr', i === fiN ? { class: 'now' } : null, el('td', null, f.f), el('td', { class: 'sr' }, f.kcal.toLocaleString(TX.lang || 'es')), el('td', { class: 'sr' }, f.p), el('td', { class: 'sr' }, f.g), el('td', { class: 'sr' }, f.c))))),
          el('p', { style: 'font-size:13px' }, D.NUTRI.escalado)),
        foldSub('pf-ciencia', TX.vCiencia,
          el('p', { class: 'mini' }, D.CIENCIA.intro),
          D.CIENCIA.temas.map(t => el('div', { class: 'regla', style: 'margin:8px 0' },
            el('b', null, t.t), el('div', { style: 'margin:3px 0' }, t.d),
            el('div', { class: 'mini' }, t.ref)))))));

    /* ---- ⚙️ Ajustes: plegado — solo el título hasta que lo pides ---- */
    const aj = el('div', { class: 'fold-in' });
    sh.append(el('details', { class: 'fold', id: 'pf-ajustes' }, el('summary', null, icono('engranaje', 15), ' ' + TX.ajustes), aj));
    const sh2 = aj;
    sh2.append(el('div', { class: 'mini', style: 'margin:2px 0 6px' }, icono('globo', 13), ' ' + TX.ajIdioma));
      const actual = S.config.lang || 'es';
      const fila = el('div', { class: 'langrow' });
      IDIOMAS.forEach(([code, flag, nombre]) => {
        fila.append(el('button', { class: 'langbtn' + (code === actual ? ' on' : ''), onclick: async ev => {
          if (code === actual) return;
          // El fichero del idioma ya no viene precargado. Se trae AHORA, que es
          // cuando se supone que hay conexión, para que el service worker lo
          // guarde antes de recargar. Si falla (sin red y nunca usado), NO se
          // cambia: más vale seguir en el idioma actual que quedarse a medias,
          // con la interfaz en español y la preferencia diciendo otra cosa.
          if (code !== 'es') {
            // Son ~90 KB: con mala cobertura la espera se nota. La bandera pasa
            // a reloj mientras tanto — nada de atenuar con opacidad, que es lo
            // que hundió el contraste de la insignia bloqueada.
            const btn = ev.currentTarget, lf = btn.querySelector('.lf'), bandera = lf.textContent;
            btn.disabled = true; btn.setAttribute('aria-busy', 'true'); lf.textContent = '⏳';
            let ok = false;
            try { ok = (await fetch('./assets/data.' + code + '.js')).ok; } catch (e) { ok = false; }
            btn.disabled = false; btn.removeAttribute('aria-busy'); lf.textContent = bandera;
            if (!ok) { toast(TX.ajIdiomaSinRed); return; }
          }
          S.config.lang = code; save();
          location.reload();
        } }, el('span', { class: 'lf' }, flag), el('span', { class: 'ln' }, nombre)));
      });
      sh2.append(fila, el('p', { class: 'mini' }, TX.ajIdiomaNota));
      /* copia de seguridad: imprescindible en una app sin nube (es el ÚNICO
         salvavidas al cambiar de móvil), pero plegada — no merece escaparate */
      const row = el('div', { class: 'btnrow' });
      row.append(el('button', { class: 'btn-b2p', onclick: () => {
        const blob = new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' });
        const a = el('a', { href: URL.createObjectURL(blob), download: 'back2prime-' + hoyISO() + '.json' });
        document.body.append(a); a.click(); a.remove();
      } }, TX.ajExportar));
      const fileIn = el('input', { type: 'file', accept: '.json,application/json', style: 'display:none', onchange: ev => {
        const f = ev.target.files[0]; if (!f) return;
        const r = new FileReader();
        r.onload = () => {
          try {
            const j = JSON.parse(r.result);
            if (!j || typeof j !== 'object' || !j.dias) throw 0;
            // la copia trae el perfil: recargar regenera el plan entero con él
            S = Object.assign(defState(), j); save(); toast(TX.ajImportOk);
            setTimeout(() => location.reload(), 400);
          } catch (e) { toast(TX.ajImportErr); }
        };
        r.readAsText(f);
      } });
      row.append(fileIn, el('button', { class: 'btn-ghost', onclick: () => fileIn.click() }, TX.ajImportar));
      sh2.append(el('details', { class: 'fold', style: 'margin-top:12px' },
        el('summary', null, icono('guardar', 15), ' ' + TX.ajCopia),
        el('div', { class: 'fold-in' }, el('p', { class: 'mini' }, TX.ajCopiaTxt), row)));
      /* cerrar sesión: sales a la puerta; el plan y los registros se quedan
         en el dispositivo (al volver a entrar con tu nombre, sigues donde ibas) */
      // eliminar perfil y datos (armado con desarme: sigue siendo la puerta seria)
      sh2.append(el('button', { class: 'btn-ghost', style: 'width:100%;margin-top:12px;color:var(--danger)', onclick: ev => {
        if (ev.target.dataset.arm) { localStorage.removeItem(KEY); location.reload(); }
        else {
          ev.target.dataset.arm = '1'; ev.target.textContent = TX.ajBorrarConfirma;
          // armado con caducidad: si no confirmas en 4 s, el botón se desarma solo
          setTimeout(() => { if (ev.target.isConnected) { delete ev.target.dataset.arm; ev.target.textContent = TX.ajBorrar; } }, 4000);
        }
      } }, TX.ajBorrar));
      sh.append(el('p', { class: 'mini', style: 'margin-top:16px' }, D.AVISO_LEGAL));

    /* cerrar sesión cierra la vista, no vive escondido en Ajustes: sales a la
       puerta y tu plan y tus registros se quedan en el dispositivo */
    if (S.usuario && TX.cerrarSesion) {
      sh.append(el('button', { class: 'btn-ghost', style: 'width:100%;margin-top:18px', type: 'button', onclick: () => {
        delete S.usuario; save(); location.reload();
      } }, TX.cerrarSesion));
      sh.append(el('p', { class: 'mini', style: 'margin:6px 0 0;text-align:center' }, TX.cerrarSesionNota));
    }
  }

  /* La hoja de bienvenida de la primera época (pedía la cintura y poco más)
     murió con la puerta de entrada: el alta y el cuestionario son ahora el
     único embudo, y la cintura se pregunta una sola vez, dentro del quiz. */

  /* ---------------- router ---------------- */
  const VIEWS = {};
  window.B2P_REG = (name, fn) => { VIEWS[name] = fn; };
  function ruta() { return (location.hash.replace('#/', '') || 'hoy'); }
  const ORDEN_VISTAS = ['hoy', 'plan', 'nutricion', 'progreso', 'logros'];
  let rutaPrevia = null, primerRender = true, rachaPrevia = null;

  function render() {
    let r = ruta();
    /* Puerta de entrada. Sin usuario no hay app; sin perfil, lo primero es el
       cuestionario (o su pausa médica); y el plan recién generado se presenta
       en el reveal antes de soltarte en HOY. Se fuerza la RUTA, no la vista:
       así título, foco y pestañas siguen saliendo del mismo sitio. */
    const forzada = !S.usuario ? 'alta'
      : !S.perfil ? (S.ui.gate ? 'gate' : 'quiz')
      : S.ui.reveal ? 'reveal' : null;
    if (forzada && r !== forzada) { history.replaceState(null, '', '#/' + forzada); r = forzada; }
    else if (!forzada && (r === 'alta' || r === 'reveal' || r === 'gate')) { history.replaceState(null, '', '#/hoy'); r = 'hoy'; }
    const enOnb = r === 'alta' || r === 'quiz' || r === 'reveal' || r === 'gate';
    document.body.classList.toggle('onb', enOnb);
    const root = $('#view');
    // render() se llama al navegar PERO también al marcar una casilla, cerrar
    // el día o importar. Solo lo primero es un cambio de vista, y solo ahí
    // procede mover el foco: hacerlo en un repintado te sacaría del control
    // que acabas de pulsar.
    const cambioDeVista = r !== rutaPrevia;
    rutaPrevia = r;
    root.innerHTML = '';
    $$('.tab').forEach(t => t.classList.toggle('on', t.dataset.r === r));
    // chip de cabecera
    const w = semanaDe(hoyISO());
    const chip = $('#chipSem'), st = $('#streak');
    if (!enOnb && w >= 1 && w <= SEMANAS) {
      const f = D.FASES[D.CAL[w - 1].fase - 1];
      chip.hidden = false;
      $('#chipDot').style.background = 'var(--f' + f.id + ')';
      $('#chipTxt').textContent = 'S' + w + ' · F' + f.id;
      // Racha activa en llama; si se rompió, la mejor no desaparece — pasa a un
      // chip apagado. Que 11 días se esfumen sin decir nada era el castigo real.
      const rk = racha(hoyISO()), mej = mejorRacha();
      if (rk >= 2) { st.hidden = false; st.classList.remove('best'); $('#streakIco').replaceChildren(icono('flame', 13)); $('#streakN').textContent = rk; }
      else if (mej >= 3) { st.hidden = false; st.classList.add('best'); $('#streakIco').textContent = TX.mejorLbl; $('#streakN').textContent = mej; }
      else st.hidden = true;
      /* La racha subiendo es de los poquísimos momentos de esta app con derecho
         a fantasía: pasa una vez al día como mucho. Hasta ahora el 4 se
         convertía en 5 sin que nadie se enterara. Solo cuando SUBE de verdad,
         nunca al repintar. */
      if (rachaPrevia !== null && rk > rachaPrevia && !reduceMovimiento()) {
        $('#streakN').animate(
          [{ transform: 'scale(1)' }, { transform: 'scale(1.45)' }, { transform: 'scale(1)' }],
          { duration: 420, easing: 'cubic-bezier(.2,1.4,.4,1)' });
      }
      rachaPrevia = rk;
    } else { chip.hidden = true; st.hidden = true; }

    if (r === 'hoy') renderHoy(root);
    else if (r === 'perfil') renderPerfil(root);
    else if (VIEWS[r]) VIEWS[r](root);
    else renderHoy(root);
    // instalada scrollea #scroller; en navegador scrollea el documento
    const sc = $('#scroller'); if (sc) sc.scrollTop = 0;
    scrollTo(0, 0);
    moveBubble();

    /* La burbuja se deslizaba y el contenido cambiaba de golpe: era la costura
       más visible de la app. Solo opacidad y solo 140 ms — navegar es de lo que
       más se repite en el día, y ahí el movimiento se paga caro: cualquier
       desplazamiento acabaría estorbando. WAAPI para que vaya fuera del hilo
       principal y no bloquee el foco que se mueve justo después. */
    if (cambioDeVista && !primerRender && !reduceMovimiento()) {
      root.animate([{ opacity: 0 }, { opacity: 1 }],
        { duration: 140, easing: 'cubic-bezier(.23,1,.32,1)' });
    }

    /* Encabezado de página y aviso del cambio de vista.
       HOY ya trae su h1 visible (el nombre de la sesión, que es de verdad el
       titular de esa pantalla). Las otras cuatro empezaban en h2 sin nada por
       encima: se les antepone un h1 invisible con el nombre de la sección,
       porque su equivalente visual es la pestaña activa. */
    const nombreVista = r === 'quiz' ? TX.cuest.titulo
      : r === 'perfil' ? (TX.perfilT || TX.ajustes)
      : r === 'alta' ? (TX.alta ? TX.alta.t : 'BACK2PRIME')
      : r === 'reveal' ? (TX.rev ? TX.rev.tAnon : 'BACK2PRIME')
      : r === 'gate' ? TX.cuest.gateHoyT
      : (TX.tabs[ORDEN_VISTAS.indexOf(r)] || TX.tabs[0]);
    document.title = nombreVista + ' · BACK2PRIME';
    let h1 = root.querySelector('h1');
    if (!h1) { h1 = el('h1', { class: 'sr-only' }, nombreVista); root.prepend(h1); }
    h1.tabIndex = -1;
    if (cambioDeVista && !primerRender) h1.focus({ preventScroll: true });
    primerRender = false;
    // el tour de bienvenida arranca cuando HOY existe de verdad (onb.js)
    if (window.B2P_ONB) window.B2P_ONB.tick(r);
  }

  /* ---------------- burbuja deslizante + arrastre (Liquid Glass) ----------
     Una sola burbuja que viaja entre pestañas con rebote; si mantienes el
     dedo y lo deslizas por la barra, te sigue y al soltar selecciona.      */
  const barEl = $('.tabbar'), barIn = $('.tabbar-in');
  const bubble = el('div', { class: 'tab-bubble' });
  barIn.style.position = 'relative';
  barIn.prepend(bubble);
  function situaBurbuja(t) {
    bubble.style.width = (t.offsetWidth - 10) + 'px';   // sin transición: solo cambia al redimensionar
    bubble.style.transform = 'translateX(' + (t.offsetLeft + 5) + 'px)';
  }
  function moveBubble() {
    const on = $('.tab.on', barIn);
    // en vistas sin pestaña (Mi perfil), la burbuja no finge estar en «Hoy»
    bubble.style.opacity = on ? '' : '0';
    const t = on || $('.tab', barIn);
    if (t) situaBurbuja(t);
  }
  let dragStart = null, realDrag = false, dragTab = null;
  function nearestTab(x) {
    let best = null, bd = 1e9;
    $$('.tab', barIn).forEach(t => {
      const r = t.getBoundingClientRect(), c = r.left + r.width / 2, d = Math.abs(c - x);
      if (d < bd) { bd = d; best = t; }
    });
    return best;
  }
  barIn.addEventListener('pointerdown', ev => {
    if (ev.pointerType === 'mouse' && ev.button !== 0) return;
    dragStart = ev.clientX; realDrag = false; dragTab = null;
    try { barIn.setPointerCapture(ev.pointerId); } catch (e) { }
  });
  barIn.addEventListener('pointermove', ev => {
    if (dragStart === null) return;
    if (!realDrag && Math.abs(ev.clientX - dragStart) < 7) return;  // un toque no es arrastre
    if (!realDrag) { realDrag = true; barEl.classList.add('dragging'); }
    const t = nearestTab(ev.clientX);
    if (t && t !== dragTab) {
      dragTab = t;
      situaBurbuja(t);
      $$('.tab', barIn).forEach(x => x.classList.toggle('on', x === t));
      if (navigator.vibrate) navigator.vibrate(8);
    }
  });
  function dragEnd() {
    if (dragStart === null) return;
    const fue = realDrag, elegido = dragTab;
    dragStart = null; realDrag = false; dragTab = null;
    barEl.classList.remove('dragging');
    if (fue && elegido) {
      const destino = '#/' + elegido.dataset.r;
      if (location.hash === destino) render(); else location.hash = destino;
    }
  }
  barIn.addEventListener('pointerup', dragEnd);
  barIn.addEventListener('pointercancel', () => { const habia = realDrag; dragStart = null; realDrag = false; dragTab = null; barEl.classList.remove('dragging'); if (habia) render(); });
  addEventListener('resize', () => setTimeout(moveBubble, 60));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => setTimeout(moveBubble, 0));

  /* Altura real de la cabecera → --hdr-h. La usa el min-height de #view para
     dejar el documento justo 2 px por encima de la pantalla: lo justo para que
     Safari repliegue su barra en todas las vistas, sin hueco muerto al final. */
  function medirCabecera() {
    const h = $('.hdr');
    if (h) document.documentElement.style.setProperty('--hdr-h', h.offsetHeight + 'px');
  }
  addEventListener('resize', medirCabecera);
  addEventListener('orientationchange', () => setTimeout(medirCabecera, 120));
  addEventListener('hashchange', render);
  $$('.tab').forEach(t => t.onclick = () => { location.hash = '#/' + t.dataset.r; });
  $('#btnAjustes').onclick = () => { location.hash = '#/perfil'; };
  $('#brand').onclick = () => {
    if (document.body.classList.contains('onb')) return;   // en la puerta de entrada, la marca no navega
    selDia = hoyISO(); location.hash = '#/hoy'; render();
  };

  /* ---------------- API compartida para views.js ---------------- */
  /* foto de un plato, si existe en el manifiesto (assets/fotos.js). Las fotos
     no van al precache: entran con carga perezosa y el SW las guarda al verlas. */
  const foto = id => (window.B2P_FOTOS && window.B2P_FOTOS.includes(id)) ? 'assets/fotos/' + id + '.webp' : null;
  window.UI = { $, $$, el, iso, fromISO, addDays, dowMon, fmtFecha, fmtCorta, kg1, pad, TX, tpl, foto, IDIOMAS, icono, icoLogro,
    hoyISO, semanaDe, slotDe, fechasSemana, dia, save, get S() { return S; },
    mediaSemana, mediasSemanales, pesosSemana, sesionesFuerzaSemana, cardioHechoSemana,
    racha, mejorRacha, cumplido, totalFuerza, openSheet, closeSheet, fichaEjercicio, toast, discoSVG,
    historial, cinturaMin, bajadaMax, evaluaLogros, timerStart };

  /* ---------------- relevo de día ----------------
     hoyISO() se recalcula en cada render, así que abrir la app siempre da el
     día correcto. Esto cubre el otro caso: la app queda abierta (o en segundo
     plano, típico en PWA) y cruza la medianoche. Al volver a ella, salta sola
     al día nuevo — salvo que estés navegando otro día a mano.            */
  let diaMontado = hoyISO();
  function relevoDia() {
    if (qd) return;                       // ?d= : modo simulación, no tocar
    const h = hoyISO();
    if (h === diaMontado) return;
    const estabaEnHoy = selDia === diaMontado;
    diaMontado = h;
    if (estabaEnHoy) selDia = h;          // respeta si estabas mirando otro día
    render();
    if (estabaEnHoy) toast(tpl(TX.nuevoDia, { f: fmtFecha(h) }));
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) relevoDia(); });
  addEventListener('focus', relevoDia);
  setInterval(relevoDia, 60000);

  /* ---------------- dos pestañas, una verdad ----------------
     localStorage ES la base de datos: si otra pestaña escribe, esta recarga su
     estado en vez de machacarlo con su copia vieja en el siguiente save().
     Si además cambió el perfil, el usuario o el idioma, el plan en memoria ya
     no vale y toca recargar la página entera. */
  addEventListener('storage', ev => {
    if (ev.key !== KEY || ev.newValue === null) return;
    const antes = JSON.stringify([S.perfil, S.usuario, S.config.lang]);
    load();
    if (JSON.stringify([S.perfil, S.usuario, S.config.lang]) !== antes) { location.reload(); return; }
    render();
  });

  /* ---------------- arranque ----------------
     El primer render se aplaza a DOMContentLoaded: views.js se carga DESPUÉS
     que app.js y es quien registra Plan/Comida/Progreso/Logros. Si renderizo
     aquí mismo, VIEWS aún está vacío y una URL con #/logros (justo lo que
     reabre una PWA instalada) caería al fallback de HOY con la pestaña
     equivocada marcada.                                                    */
  function arrancar() {
    load();
    // textos estáticos de index.html al idioma cargado
    $$('.tab span').forEach((s, i) => { if (TX.tabs[i]) s.textContent = TX.tabs[i]; });
    if (TX.perfilT) $('#btnAjustes').setAttribute('aria-label', TX.perfilT);
    const cOk = $('#celebraOk'); if (cOk) cOk.textContent = TX.celebraOk;
    document.documentElement.lang = TX.lang;
    medirCabecera();
    // la burbuja de búsqueda flota sobre todo menos las hojas (se esconde en la puerta de entrada vía CSS)
    const fab = el('button', { class: 'fab', type: 'button', 'aria-label': TX.buscarT || 'Buscar',
      onclick: abreBuscador,
      html: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16.2" y2="16.2"/></svg>' });
    document.body.append(fab);
    render();
  }
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', arrancar, { once: true });
  else setTimeout(arrancar, 0);
})();
