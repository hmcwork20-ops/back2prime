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
  const pad = n => String(n).padStart(2, '0');
  const iso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const fromISO = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (s, n) => { const d = fromISO(s); d.setDate(d.getDate() + n); return iso(d); };
  const DIAS_L = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  const MES_L = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const dowMon = s => (fromISO(s).getDay() + 6) % 7; // 0=lunes
  const fmtFecha = s => { const d = fromISO(s); return DIAS_L[dowMon(s)] + ' ' + d.getDate() + ' ' + MES_L[d.getMonth()]; };
  const fmtCorta = s => { const d = fromISO(s); return d.getDate() + ' ' + MES_L[d.getMonth()]; };
  const kg1 = v => (Math.round(v * 10) / 10).toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  // hoy real (override para pruebas: ?d=2026-08-20)
  const qd = new URLSearchParams(location.search).get('d');
  const hoyISO = () => qd || iso(new Date());

  /* ---------------- estado ---------------- */
  const KEY = 'b2p_v1';
  let S;
  function defState() {
    return { v: 1, config: { cinturaBase: null, creado: hoyISO(), onboarded: false },
      dias: {}, logros: {}, prs: {}, prCount: 0, flags: {}, shop: {}, prep: {}, ui: {} };
  }
  function load() { try { S = Object.assign(defState(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { S = defState(); } }
  function save() { localStorage.setItem(KEY, JSON.stringify(S)); }
  function dia(d) { return S.dias[d] || (S.dias[d] = {}); }

  /* ---------------- calendario del plan ---------------- */
  const INICIO = D.META.inicioISO, FIN = D.META.finISO;
  function semanaDe(d) { // 1..12 · 0 = antes · 99 = después
    const diff = Math.floor((fromISO(d) - fromISO(INICIO)) / 864e5);
    if (diff < 0) return 0;
    const w = Math.floor(diff / 7) + 1;
    return w > 12 ? 99 : w;
  }
  function slotDe(d) {
    const w = semanaDe(d);
    if (w < 1 || w > 12) return null;
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
  (D.ARRANQUE.tabla || []).forEach(r => { ARR0[r.ej] = parseFloat(r.s3.replace(',', '.')); });
  function sugerencia(ejId, d) {
    const u = ultimoLog(ejId, d);
    if (!u || !u.kg) {
      return ARR0[ejId] ? { kg: ARR0[ejId], txt: 'empieza en ' + kg1(ARR0[ejId]), inicio: true } : null;
    }
    if (u.falta) return { kg: u.kg, txt: 'repite ' + kg1(u.kg), rep: true };
    const inc = GRANDES[ejId] || 2.5;
    return { kg: u.kg + inc, txt: kg1(u.kg) + ' → ' + kg1(u.kg + inc), rep: false };
  }

  /* ---------------- pesajes ---------------- */
  function pesosSemana(w) {
    const { ini } = fechasSemana(w); const out = [];
    for (let i = 0; i < 7; i++) { const f = addDays(ini, i); const p = S.dias[f] && S.dias[f].peso; if (p) out.push(p); }
    return out;
  }
  function mediaSemana(w) { const p = pesosSemana(w); return p.length ? p.reduce((a, b) => a + b, 0) / p.length : null; }
  function mediasSemanales() { const out = []; for (let w = 1; w <= 12; w++) { const m = mediaSemana(w); if (m) out.push({ w, m }); } return out; }

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
  function racha(hasta) {
    let n = 0, f = hasta;
    while (cumplido(f)) { n++; f = addDays(f, -1); if (n > 400) break; }
    return n;
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
    'semana-perfecta': () => { for (let w = 1; w <= 12; w++) { const s = sesionesFuerzaSemana(w); if (s.length && s.every(x => x.hecho) && fechasSemana(w).ini <= hoyISO()) return true; } return false; },
    'minimo-3': () => { let run = 0; for (let w = 1; w <= 12; w++) { if (fechasSemana(w).fin > hoyISO()) break; const f = sesionesFuerzaSemana(w).filter(x => x.hecho).length; if (f >= 2 && cardioHechoSemana(w) >= 1) { run++; if (run >= 3) return true; } else run = 0; } return false; },
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
    'marca-banca': () => (S.prs['press-banca'] || {}).kg >= D.HISTORICO['press-banca'].kg,
    'marca-sentadilla': () => (S.prs['sentadilla-barra'] || {}).kg >= D.HISTORICO['sentadilla-barra'].kg,
    'dominada-libre': () => !!S.flags.dominadaLibre,
    'mealprep-4': () => { let n = 0, f = hoyISO(); while (dowMon(f) !== 6) f = addDays(f, -1); while (S.dias[f] && S.dias[f].prep) { n++; f = addDays(f, -7); } return n >= 4; },
    'comeback': () => !!S.flags.comeback,
    'fotos-4': () => D.FOTOS.every(f => S.dias[f] && S.dias[f].foto),
    'checkpoint-s4': () => checkpointOk(0), 'checkpoint-s8': () => checkpointOk(1),
    'plan-completo': () => { if (hoyISO() < FIN) return false; let t = 0, k = 0; for (let w = 1; w <= 12; w++) sesionesFuerzaSemana(w).forEach(s => { t++; if (s.hecho) k++; }); return t && k / t >= 0.8; }
  };
  function bajadaMax() { const ms = mediasSemanales(); if (!ms.length) return 0; return D.META.perfil.pesoSalida - Math.min(...ms.map(x => x.m)); }
  function cinturaMin() { const cs = Object.values(S.dias).map(d => d.cintura).filter(Boolean); return cs.length ? Math.min(...cs) : null; }
  function checkpointOk(i) { const cp = D.CHECKPOINTS[i]; if (hoyISO() < cp.fecha) return false; const m = mediaSemana(cp.sem); return m !== null && m <= cp.rango[1]; }

  function evaluaLogros() {
    const nuevos = [];
    D.LOGROS.forEach(l => {
      if (S.logros[l.id]) return;
      try { if (COND[l.id] && COND[l.id]()) { S.logros[l.id] = hoyISO(); nuevos.push(l); } } catch (e) { /* nunca romper por un logro */ }
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
    if (l.disco) { ic.innerHTML = ''; ic.append(discoSVG(l.id.split('-')[1], 76)); } else ic.textContent = l.icon;
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
  function confetti() {
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
      $('#timerT').textContent = '¡YA!'; t.classList.add('fin');
      clearInterval(tInt); beep(); if (navigator.vibrate) navigator.vibrate([180, 90, 180]);
      setTimeout(() => t.classList.remove('on'), 4200);
      return;
    }
    $('#timerT').textContent = Math.floor(left / 60) + ':' + pad(left % 60);
  }
  $('#timerPlus').onclick = () => { tEnd += 30000; timerTick(); };
  $('#timerX').onclick = () => { clearInterval(tInt); $('#timer').classList.remove('on'); };

  /* ---------------- bottom sheet ---------------- */
  function openSheet(builder) {
    const sh = $('#sheet'), bg = $('#sheetBg');
    sh.innerHTML = ''; sh.append(el('div', { class: 'grip' }));
    builder(sh);
    bg.hidden = false;
    requestAnimationFrame(() => document.body.classList.add('sheet-open'));
    bg.onclick = closeSheet;
  }
  function closeSheet() {
    document.body.classList.remove('sheet-open');
    setTimeout(() => { $('#sheetBg').hidden = true; }, 280);
  }

  /* ---------------- ficha de ejercicio ---------------- */
  function fichaEjercicio(ejId, ctx) {
    const e = D.EJERCICIOS[ejId]; if (!e) return;
    openSheet(sh => {
      sh.append(
        el('h2', null, e.nombre),
        el('div', { class: 'stag' }, e.musc.join(' · ') + ' — ' + e.equipo + (ctx && ctx.dosis ? ' · hoy: ' + ctx.dosis : ''))
      );
      const hist = D.HISTORICO[ejId];
      if (hist) {
        const pr = S.prs[ejId];
        const falta = pr ? hist.kg - pr.kg : hist.kg;
        sh.append(el('div', { class: 'alt', style: 'border-left:3px solid var(--volt);margin-top:10px' },
          el('b', null, '🔓 Tu marca de entonces: ' + hist.txt),
          el('div', { class: 'mini', style: 'margin-top:2px' },
            falta > 0 ? 'Te faltan ' + kg1(falta) + ' kg para recuperarla. Hay logro esperándote.' : 'Recuperada. Ese peso vuelve a ser tuyo.')));
      }
      const h = historial(ejId, 5);
      if (h.length) {
        const pr = S.prs[ejId];
        sh.append(el('h4', null, 'Tu historial' + (pr ? ' · mejor ' + kg1(pr.kg) + ' kg' : '')));
        sh.append(el('div', { class: 'mini', html: h.map(x => fmtCorta(x.fecha) + ': <b class="num">' + kg1(x.kg) + '</b> kg' + (x.falta ? ' (reps a medias)' : '')).join(' · ') }));
      } else if (ARR0[ejId]) {
        sh.append(el('h4', null, 'Arranque sugerido'));
        sh.append(el('div', { class: 'mini' }, kg1(ARR0[ejId]) + ' kg en la semana 3. ' + (D.ARRANQUE.tabla.find(r => r.ej === ejId) || {}).n));
      }
      sh.append(el('h4', null, 'Cómo se hace'));
      sh.append(el('ul', null, e.cues.map(c => el('li', null, c))));
      sh.append(el('h4', null, 'Errores que te robarán progreso'));
      sh.append(el('ul', null, e.err.map(c => el('li', null, c))));
      if (e.alt && e.alt.length) {
        sh.append(el('h4', null, 'Alternativas equivalentes'));
        e.alt.forEach(a => sh.append(el('div', { class: 'alt' }, el('b', null, a.n), ' — ' + a.por)));
      }
      if (e.mol) sh.append(el('div', { class: 'mol' }, '⚠ ' + e.mol));
      if (ejId === 'dominadas') {
        const on = !!S.flags.dominadaLibre;
        sh.append(el('button', {
          class: on ? 'btn-ghost' : 'btn-b2p', style: 'width:100%;margin-top:14px',
          onclick: ev => { S.flags.dominadaLibre = true; save(); ev.target.textContent = '🦍 Registrada'; evaluaLogros(); }
        }, on ? '🦍 Dominada libre ya registrada' : '🦍 ¡Hoy salió mi primera dominada SIN asistencia!'));
      }
      sh.append(el('a', { href: 'https://www.youtube.com/results?search_query=' + encodeURIComponent('técnica ' + e.nombre), target: '_blank', rel: 'noopener', class: 'mini', style: 'display:inline-block;margin-top:14px' }, '▶ Ver técnica en vídeo'));
    });
  }

  /* ---------------- vista HOY ---------------- */
  let selDia = hoyISO();

  function renderHoy(root) {
    const d = selDia, dd = dia(d), w = semanaDe(d), sl = slotDe(d);
    const hoy = hoyISO();

    /* — cabecera de día con navegación — */
    const nav = el('div', { class: 'hero' },
      el('div', { style: 'display:flex;align-items:center;gap:8px' },
        el('button', { class: 'icon-btn', 'aria-label': 'Día anterior', onclick: () => { selDia = addDays(selDia, -1); render(); } }, '‹'),
        el('div', { class: 'fecha', style: 'flex:1;text-align:center' }, fmtFecha(d) + (d === hoy ? ' · HOY' : '')),
        el('button', { class: 'icon-btn', 'aria-label': 'Día siguiente', style: d >= hoy ? 'visibility:hidden' : '', onclick: () => { selDia = addDays(selDia, 1); render(); } }, '›')
      )
    );
    root.append(nav);

    /* — antes del plan — */
    if (w === 0) {
      const falta = Math.ceil((fromISO(INICIO) - fromISO(hoy)) / 864e5);
      root.append(el('h1', { style: 'font-size:30px;padding:0 2px' }, falta > 0 ? 'Empieza en ' + falta + (falta === 1 ? ' día' : ' días') : 'Empieza el lunes'),
        el('p', { class: 'mut', style: 'padding:0 2px' }, 'Lunes 17 de agosto · Fase 1 en casa. Mientras tanto, deja lista la línea base:'));
      const prep = [
        ['cintura', 'Mídete la cintura en ayunas (a la altura del ombligo)'],
        ['foto', 'Hazte las fotos día-0: frente y perfil, misma luz que usarás siempre'],
        ['compra', 'Compra de la semana 1 (lista en Comida)'],
        ['bascula', 'Decide dónde y cuándo te pesas: lunes-miércoles-viernes en ayunas']
      ];
      const c = el('div', { class: 'card' });
      prep.forEach(([k, txt]) => {
        const on = !!(S.flags.prep && S.flags.prep[k]);
        c.append(el('div', { class: 'habit wide' + (on ? ' on' : ''), style: 'margin:5px 0', onclick: ev => {
          S.flags.prep = S.flags.prep || {}; S.flags.prep[k] = !S.flags.prep[k]; save(); render();
        } }, el('div', { class: 'hicon' }, on ? '✓' : '○'), el('div', null, el('div', { class: 'ht' }, txt))));
      });
      root.append(c);
    }

    /* — después del plan — */
    if (w === 99) {
      root.append(el('div', { class: 'card', style: 'text-align:center;padding:26px 18px' },
        el('div', { style: 'font-size:44px' }, '🏁'),
        el('h2', null, 'Plan completado'),
        el('p', { class: 'mut' }, D.CIERRE)));
    }

    /* — semana del plan — */
    if (w >= 1 && w <= 12 && sl) {
      const fase = sl.fase;
      root.append(el('h1', { style: 'font-size:30px;padding:0 2px' }, sl.ses ? sl.ses.nombre : 'Descanso'),
        el('div', { class: 'sub', style: 'padding:0 2px;color:var(--ink2)' },
          'Semana ' + w + ' de 12 · Fase ' + fase.id + ' · ' + fase.nombre + ' · RPE tope ' + fase.rpe));

      // banner de semana especial
      const hito = D.HITOS_SEMANA[w];
      if (hito) root.append(el('div', { class: 'banner' + (w === 9 ? ' warn' : w === 10 ? ' hot' : '') },
        el('div', null, el('b', null, hito.t), el('div', { style: 'margin-top:2px' }, hito.d))));

      /* sesión de fuerza */
      if (sl.ses && sl.ses.tipo === 'fuerza') {
        const card = el('div', { class: 'card fase-card p' + fase.id });
        card.append(el('div', { class: 'card-title' },
          el('span', { class: 'disco d' + fase.id }, String(fase.disco)),
          el('div', null, el('h2', null, sl.ses.nombre), el('div', { class: 'sub' }, sl.ses.dur + ' · descansos en cada fila (toca para cronometrar)'))));

        // calentamiento
        const cal = el('details', { class: 'fold' },
          el('summary', null, '🔥 Calentamiento · 6′'),
          el('div', { class: 'fold-in' },
            el('ul', { style: 'margin:4px 0;padding-left:18px' }, D.CALENTAMIENTO.pasos.map(p => el('li', null, p))),
            w >= 3 ? el('div', { class: 'mini' }, D.CALENTAMIENTO.gym) : null));
        card.append(cal);

        // ejercicios
        sl.ses.bloques.forEach(b => {
          const e = D.EJERCICIOS[b.e]; if (!e) return;
          const lg = (dd.ej && dd.ej[b.e]) || {};
          const reps = b.rW ? (b.rW[w] || Object.values(b.rW)[0]) : b.r;
          const dosis = b.s + '×' + reps;
          const esBW = !ultimoLog(b.e, '9999') && !lg.kg && (fase.id === 1 || ['plancha', 'plancha-lastre', 'dead-bug', 'superman', 'elev-piernas', 'rueda-abdominal', 'crunch-polea', 'fondos', 'dominadas'].includes(b.e) === false && fase.id === 1);
          const sug = sugerencia(b.e, d);

          const kgIn = el('input', { type: 'text', inputmode: 'decimal', placeholder: sug ? kg1(sug.kg) : 'kg',
            value: lg.kg ? String(lg.kg).replace('.', ',') : '',
            onchange: ev => {
              const v = parseFloat(ev.target.value.replace(',', '.'));
              const L = logEj(d, b.e);
              if (v > 0) L.kg = v; else delete L.kg;
              save();
            } });

          const doseChip = el('span', { class: 'dose', title: 'Toca si NO completaste todas las reps', onclick: ev => {
            const L = logEj(d, b.e); L.falta = !L.falta; save();
            ev.target.style.color = L.falta ? 'var(--f2)' : '';
            ev.target.textContent = dosis + (L.falta ? ' ✂' : '');
            toast(L.falta ? 'Marcado: faltaron reps (repetirás peso)' : 'Todas las reps limpias');
          } }, dosis + (lg.falta ? ' ✂' : ''));
          if (lg.falta) doseChip.style.color = 'var(--f2)';

          const check = el('button', { class: 'checkbtn' + (lg.done ? ' on' : ''), 'aria-label': 'Hecho', onclick: ev => {
            const L = logEj(d, b.e); L.done = !L.done; save();
            ev.currentTarget.classList.toggle('on', L.done);
            const inVal = parseFloat(kgIn.value.replace(',', '.'));
            if (L.done && !L.kg && inVal > 0) { L.kg = inVal; save(); }
            actualizaCerrar();
          }, html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' });

          const row = el('div', { class: 'exrow' },
            el('div', { class: 'exmain', onclick: () => fichaEjercicio(b.e, { dosis }) },
              el('div', { class: 'exname' }, e.nombre, el('span', { class: 'info', html: ' ⓘ' })),
              el('div', { class: 'exmeta' },
                doseChip,
                el('span', { class: 'rest', onclick: ev => { ev.stopPropagation(); timerStart(b.d); }, title: 'Cronometrar descanso' }, '⏱ ' + (b.d >= 60 ? (b.d / 60).toLocaleString('es-ES') + '′' : b.d + '″')),
                sug && !lg.kg ? el('span', { class: 'sugg' }, (sug.inicio ? '◆ ' : sug.rep ? '↻ ' : '▲ ') + sug.txt) : null),
              b.n ? el('div', { class: 'exnote' }, b.n) : null),
            el('div', { class: 'kgbox' }, kgIn, el('span', { class: 'u' }, 'kg')),
            check);
          card.append(row);
        });

        // bloque tendón contextual
        const tb = [];
        if (sl.ses.tendon === 'rodilla' || fase.id === 1) tb.push(D.TENDON.bloques[0]);
        if (['torso-a', 'torso-b', 'fb-a', 'fb-b', 'push-a', 'pull-a', 'push-b', 'pull-b'].includes(sl.sid)) tb.push(D.TENDON.bloques[3]);
        if (tb.length) {
          const on = !!dd.tendon;
          card.append(el('div', { class: 'habit wide' + (on ? ' on' : ''), style: 'margin-top:10px', onclick: () => { dd.tendon = !dd.tendon; save(); render(); } },
            el('div', { class: 'hicon' }, '🛡'),
            el('div', { style: 'flex:1' }, el('div', { class: 'ht' }, 'Protocolo tendón · ' + tb.map(x => x.nombre.split(' ·')[0]).join(' + ')),
              el('div', { class: 'hs' }, tb.map(x => x.detalle.split('.')[0]).join(' · ')))));
        }
        root.append(card);
      }

      /* sesión de cardio */
      if (sl.ses && sl.ses.tipo === 'cardio') {
        const card = el('div', { class: 'card fase-card p' + fase.id });
        card.append(el('div', { class: 'card-title' },
          el('span', { class: 'disco d' + fase.id }, String(fase.disco)),
          el('div', null, el('h2', null, sl.ses.nombre + (sl.opt ? ' · opcional' : '')),
            el('div', { class: 'sub' }, sl.ses.icono === 'run' ? 'Cadencia 170-180 · zancada corta' : 'Recuperación activa'))));
        card.append(el('p', { style: 'font-size:13.5px' }, sl.ses.detalle));
        if (sl.ses.icono === 'run') card.append(el('div', { class: 'mini', style: 'margin-top:4px' }, '🛡 Antes: tibialis raises 2×20 (protocolo tendón).'));
        const on = !!dd.sesionOk;
        card.append(el('button', { class: 'cerrar' + (on ? ' hecho' : ''), style: 'margin:12px 0 4px', onclick: () => { dd.sesionOk = !dd.sesionOk; if (dd.sesionOk) dd.sesionTipo = 'cardio'; save(); render(); } },
          on ? '✓ Cardio hecho' : 'Marcar cardio hecho'));
        const minIn = el('input', { type: 'text', inputmode: 'numeric', placeholder: 'min', value: dd.cardioMin || '', style: 'width:70px;text-align:center;font-family:var(--mono);background:var(--surface2);border:1px solid var(--line);border-radius:8px;padding:7px', onchange: ev => { const v = parseInt(ev.target.value); if (v > 0) dd.cardioMin = v; else delete dd.cardioMin; save(); } });
        card.append(el('div', { style: 'display:flex;align-items:center;gap:8px;font-size:13px;color:var(--ink2)' }, 'Minutos reales:', minIn));
        root.append(card);
      }

      /* día libre */
      if (sl.ses && sl.ses.tipo === 'libre') {
        root.append(el('div', { class: 'card' },
          el('div', { class: 'card-title' }, el('div', null, el('h2', null, dowMon(d) === 6 ? 'Domingo: descanso + meal prep' : 'Descanso'),
            el('div', { class: 'sub' }, sl.ses.detalle)))));
      }

      /* hábitos del día */
      root.append(el('div', { class: 'sec-h' }, el('h2', null, 'El día a día')));
      const hb = el('div', { class: 'habits' });
      const mkHabit = (key, icon, titulo, sub, wide) => {
        const on = !!dd[key];
        return el('div', { class: 'habit' + (on ? ' on' : '') + (wide ? ' wide' : ''), onclick: () => { dd[key] = !dd[key]; save(); render(); evaluaLogros(); } },
          el('div', { class: 'hicon' }, icon),
          el('div', null, el('div', { class: 'ht' }, titulo), sub ? el('div', { class: 'hs' }, sub) : null));
      };
      hb.append(mkHabit('pasos', '👟', '8-10k pasos', 'Todos los días'));
      hb.append(mkHabit('prote', '🥩', 'Proteína 4/4', '4 tomas ≥40 g'));

      const dow = dowMon(d);
      if ([0, 2, 4].includes(dow)) {
        const pIn = el('input', { type: 'text', inputmode: 'decimal', placeholder: '—', value: dd.peso ? String(dd.peso).replace('.', ',') : '', onclick: ev => ev.stopPropagation(), onchange: ev => {
          const v = parseFloat(ev.target.value.replace(',', '.'));
          if (v > 30 && v < 200) { dd.peso = v; save(); toast('Peso guardado: ' + kg1(v) + ' kg'); evaluaLogros(); } else { delete dd.peso; save(); }
        } });
        hb.append(el('div', { class: 'habit wide' + (dd.peso ? ' on' : '') },
          el('div', { class: 'hicon' }, '⚖️'),
          el('div', null, el('div', { class: 'ht' }, 'Peso en ayunas'), el('div', { class: 'hs' }, 'Media semanal, no el día suelto')),
          pIn, el('span', { class: 'u mini' }, 'kg')));
      }
      if (dow === 0) {
        const cIn = el('input', { type: 'text', inputmode: 'decimal', placeholder: '—', value: dd.cintura ? String(dd.cintura).replace('.', ',') : '', onclick: ev => ev.stopPropagation(), onchange: ev => {
          const v = parseFloat(ev.target.value.replace(',', '.'));
          if (v > 50 && v < 200) { dd.cintura = v; save(); toast('Cintura: ' + kg1(v) + ' cm'); evaluaLogros(); } else { delete dd.cintura; save(); }
        } });
        hb.append(el('div', { class: 'habit wide' + (dd.cintura ? ' on' : '') },
          el('div', { class: 'hicon' }, '📏'),
          el('div', null, el('div', { class: 'ht' }, 'Cintura (lunes)'), el('div', { class: 'hs' }, 'La métrica reina · al ombligo, sin apretar')),
          cIn, el('span', { class: 'u mini' }, 'cm')));
      }
      if (dow === 6) hb.append(mkHabit('prep', '🍱', 'Meal prep', '~90′ y semana resuelta', true));
      if (D.FOTOS.includes(d)) hb.append(mkHabit('foto', '📸', 'Fotos de progreso', 'Frente y perfil, misma luz', true));
      root.append(hb);

      /* cerrar el día */
      const btn = el('button', { class: 'cerrar' + (dd.cerrado ? ' hecho' : ''), id: 'btnCerrar', onclick: () => {
        if (sl.ses && sl.ses.tipo === 'fuerza') {
          const hechos = sl.ses.bloques.filter(b => dd.ej && dd.ej[b.e] && dd.ej[b.e].done).length;
          dd.sesionOk = hechos >= Math.ceil(sl.ses.bloques.length * 0.6);
          if (dd.sesionOk) dd.sesionTipo = 'fuerza';
        }
        // PRs del día
        if (dd.ej) Object.keys(dd.ej).forEach(ejId => {
          const L = dd.ej[ejId];
          if (L.kg && L.done && !L.falta) {
            const pr = S.prs[ejId];
            if (!pr || L.kg > pr.kg) { S.prs[ejId] = { kg: L.kg, fecha: d }; if (pr) { S.prCount++; toast('🥇 PR en ' + (D.EJERCICIOS[ejId] || {}).nombre + ': ' + kg1(L.kg) + ' kg'); } }
          }
        });
        // comeback: hueco de ≥4 días antes de hoy
        const previos = Object.keys(S.dias).filter(f => f < d && (S.dias[f].cerrado || S.dias[f].sesionOk)).sort();
        if (previos.length) { const ult = previos[previos.length - 1]; if ((fromISO(d) - fromISO(ult)) / 864e5 >= 4) S.flags.comeback = true; }
        dd.cerrado = true; save();
        const nuevos = evaluaLogros();
        render();
        if (!nuevos.length) toast(cumplido(d) ? '✓ Día cerrado. Racha: ' + racha(d) : 'Día cerrado.');
      } }, dd.cerrado ? '✓ Día cerrado · racha ' + racha(d) : 'Cerrar el día');
      root.append(btn);
      function actualizaCerrar() { /* el botón siempre está activo; hook para futuro */ }

      if (dd.cerrado) root.append(el('div', { class: 'mini', style: 'text-align:center;margin-top:4px' }, 'Puedes seguir editando: todo se guarda solo.'));
    }
  }

  /* ---------------- ajustes / backup ---------------- */
  function sheetAjustes() {
    openSheet(sh => {
      sh.append(el('h2', null, 'Ajustes'), el('div', { class: 'stag' }, 'BACK2PRIME · tus datos viven SOLO en este dispositivo'));
      // datos base
      sh.append(el('h4', null, 'Línea base'));
      const cIn = el('input', { type: 'text', inputmode: 'decimal', value: S.config.cinturaBase || '', placeholder: 'p. ej. 100' });
      sh.append(el('div', { class: 'field' }, el('label', null, 'Cintura inicial (cm)'), cIn));
      sh.append(el('button', { class: 'btn-ghost', style: 'width:100%', onclick: () => {
        const v = parseFloat(cIn.value.replace(',', '.'));
        if (v > 50 && v < 200) { S.config.cinturaBase = v; save(); toast('Guardado'); } } }, 'Guardar línea base'));
      // backup
      sh.append(el('h4', null, 'Copia de seguridad'));
      sh.append(el('p', { class: 'mini' }, 'Los datos no salen del móvil. Haz una copia de vez en cuando (o antes de cambiar de dispositivo) y guárdala donde quieras.'));
      const row = el('div', { class: 'btnrow' });
      row.append(el('button', { class: 'btn-b2p', onclick: () => {
        const blob = new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' });
        const a = el('a', { href: URL.createObjectURL(blob), download: 'back2prime-' + hoyISO() + '.json' });
        document.body.append(a); a.click(); a.remove();
      } }, '⬇ Exportar'));
      const fileIn = el('input', { type: 'file', accept: '.json,application/json', style: 'display:none', onchange: ev => {
        const f = ev.target.files[0]; if (!f) return;
        const r = new FileReader();
        r.onload = () => {
          try {
            const j = JSON.parse(r.result);
            if (!j || typeof j !== 'object' || !j.dias) throw 0;
            S = Object.assign(defState(), j); save(); toast('Copia restaurada'); closeSheet(); render();
          } catch (e) { toast('Ese archivo no parece una copia de BACK2PRIME'); }
        };
        r.readAsText(f);
      } });
      row.append(fileIn, el('button', { class: 'btn-ghost', onclick: () => fileIn.click() }, '⬆ Importar'));
      sh.append(row);
      // reset
      sh.append(el('h4', null, 'Zona peligrosa'));
      sh.append(el('button', { class: 'btn-ghost', style: 'width:100%;color:var(--danger)', onclick: ev => {
        if (ev.target.dataset.arm) { localStorage.removeItem(KEY); location.reload(); }
        else { ev.target.dataset.arm = '1'; ev.target.textContent = '¿Seguro? Toca otra vez para borrar TODO'; }
      } }, 'Borrar todos los datos'));
      sh.append(el('p', { class: 'mini', style: 'margin-top:16px' }, D.AVISO_LEGAL));
    });
  }

  /* ---------------- onboarding ---------------- */
  function onboarding() {
    openSheet(sh => {
      sh.append(el('h2', null, 'Bienvenido a BACK2PRIME'),
        el('div', { class: 'stag' }, '12 semanas · 17 ago → 8 nov · de 95 a tu mejor versión'),
        el('p', { style: 'font-size:14px' }, 'Esta app es tu cuaderno de entreno, tu plan y tu nutrición en un solo sitio. Cada día marcas lo que haces, la app te sugiere los pesos, vigila tu ritmo de pérdida y va soltando logros. Todo se guarda en tu móvil: nada sale de aquí.'),
        el('p', { class: 'mini' }, 'Consejo: añádela a la pantalla de inicio (Compartir → Añadir a pantalla de inicio) para que sea una app de verdad, con icono y a pantalla completa.'));
      const cIn = el('input', { type: 'text', inputmode: 'decimal', placeholder: 'cm (opcional, puedes hacerlo luego)' });
      sh.append(el('div', { class: 'field' }, el('label', null, 'Cintura inicial — tu métrica reina'), cIn));
      sh.append(el('button', { class: 'btn-b2p', style: 'width:100%', onclick: () => {
        const v = parseFloat((cIn.value || '').replace(',', '.'));
        if (v > 50 && v < 200) S.config.cinturaBase = v;
        S.config.onboarded = true; save(); closeSheet();
      } }, 'Empezamos'));
    });
  }

  /* ---------------- router ---------------- */
  const VIEWS = {};
  window.B2P_REG = (name, fn) => { VIEWS[name] = fn; };
  function ruta() { return (location.hash.replace('#/', '') || 'hoy'); }
  function render() {
    const r = ruta(), root = $('#view');
    root.innerHTML = '';
    $$('.tab').forEach(t => t.classList.toggle('on', t.dataset.r === r));
    // chip de cabecera
    const w = semanaDe(hoyISO());
    const chip = $('#chipSem'), st = $('#streak');
    if (w >= 1 && w <= 12) {
      const f = D.FASES[D.CAL[w - 1].fase - 1];
      chip.hidden = false;
      $('#chipDot').style.background = 'var(--f' + f.id + ')';
      $('#chipTxt').textContent = 'S' + w + ' · F' + f.id;
      const rk = racha(hoyISO());
      st.hidden = rk < 2; $('#streakN').textContent = rk;
    } else { chip.hidden = true; st.hidden = true; }

    if (r === 'hoy') renderHoy(root);
    else if (VIEWS[r]) VIEWS[r](root);
    else renderHoy(root);
    // instalada scrollea #scroller; en navegador scrollea el documento
    const sc = $('#scroller'); if (sc) sc.scrollTop = 0;
    scrollTo(0, 0);
  }

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
  $('#btnAjustes').onclick = sheetAjustes;
  $('#brand').onclick = () => { selDia = hoyISO(); location.hash = '#/hoy'; render(); };

  /* ---------------- API compartida para views.js ---------------- */
  window.UI = { $, $$, el, iso, fromISO, addDays, dowMon, fmtFecha, fmtCorta, kg1, pad,
    hoyISO, semanaDe, slotDe, fechasSemana, dia, save, get S() { return S; },
    mediaSemana, mediasSemanales, pesosSemana, sesionesFuerzaSemana, cardioHechoSemana,
    racha, cumplido, totalFuerza, openSheet, closeSheet, fichaEjercicio, toast, discoSVG,
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
    if (estabaEnHoy) toast('Nuevo día: ' + fmtFecha(h));
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) relevoDia(); });
  addEventListener('focus', relevoDia);
  setInterval(relevoDia, 60000);

  /* ---------------- arranque ----------------
     El primer render se aplaza a DOMContentLoaded: views.js se carga DESPUÉS
     que app.js y es quien registra Plan/Comida/Progreso/Logros. Si renderizo
     aquí mismo, VIEWS aún está vacío y una URL con #/logros (justo lo que
     reabre una PWA instalada) caería al fallback de HOY con la pestaña
     equivocada marcada.                                                    */
  function arrancar() {
    load();
    medirCabecera();
    render();
    if (!S.config.onboarded) setTimeout(onboarding, 350);
  }
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', arrancar, { once: true });
  else setTimeout(arrancar, 0);
})();
