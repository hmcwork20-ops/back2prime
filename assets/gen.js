/* BACK2PRIME · generarPlan(perfil, base) — el motor determinista de la Fase 1.
   Recombina el contenido YA localizado del idioma cargado (window.B2P) con los
   números del perfil. Regla de oro: aquí no se escribe ni una frase de cara al
   usuario — cualquier texto nuevo vive en UI.gen de los 5 data.*.js. Sin IA en
   los números: Mifflin-St Jeor, factores de actividad clásicos, déficit
   acotado y proteína por kg. Reproducible y auditable. */
window.B2P_GEN = (function () {

  /* ---------- números ---------- */
  function mifflin(p) {
    // h: +5 · m: −161 · x/no dicho: punto medio (−78)
    const base = 10 * p.pesoKg + 6.25 * p.alturaCm - 5 * p.edad;
    return base + (p.sexo === 'h' ? 5 : p.sexo === 'm' ? -161 : -78);
  }
  function tdee(p) {
    // factores clásicos por días de fuerza; el NEAT fino no se puede saber
    const f = p.diasSemana <= 3 ? 1.375 : p.diasSemana <= 5 ? 1.55 : 1.725;
    return mifflin(p) * f;
  }
  function kcalObjetivo(p) {
    const t = tdee(p);
    let k = t;
    if (p.objetivo === 'perder') k = t - 600;
    else if (p.objetivo === 'recomp') k = t - 400;
    else if (p.objetivo === 'ganar') k = t + 250;
    // suelo de seguridad: nunca por debajo del basal ni un recorte >25%
    k = Math.max(k, mifflin(p) * 1.05, t * 0.75);
    return Math.round(k / 5) * 5;
  }
  function macros(p, kcal) {
    const prot = Math.round(p.pesoKg * (p.objetivo === 'ganar' || p.objetivo === 'mantener' ? 1.8 : 2.2));
    const grasa = Math.round(p.pesoKg * 0.9);
    const carbo = Math.max(0, Math.round((kcal - prot * 4 - grasa * 9) / 4));
    return { p: prot, g: grasa, c: carbo };
  }

  /* ---------- fechas ---------- */
  function proximoLunes() {
    const d = new Date(); d.setHours(12, 0, 0, 0);
    const dow = (d.getDay() + 6) % 7;             // 0 = lunes
    d.setDate(d.getDate() + (dow === 0 ? 7 : 7 - dow));
    return d;
  }
  const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  function addD(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function corta(d, meses) { return d.getDate() + ' ' + meses[d.getMonth()]; }

  /* ---------- material y sustituciones ---------- */
  function equipoVale(txt, material) {
    const t = (txt || '').toLowerCase();
    if (material === 'gym') return true;
    if (/polea|máquina|maquina|multipower|rack|prensa/.test(t)) return false;
    if (/barra(?! de dominadas)/.test(t)) return false;       // barra olímpica no; dominadas depende
    if (material === 'casa') return !/barra de dominadas/.test(t) || true;
    // nada: solo cuerpo, toalla, escalón, mochila
    return /^nada|toalla|escalón|escalon|mochila/.test(t);
  }
  function eligeSub(base, id, p, noQuiero) {
    const e = base.EJERCICIOS[id]; if (!e) return id;
    for (const k of Object.keys(base.EJERCICIOS)) {
      if (k === id) continue;
      const c = base.EJERCICIOS[k];
      if (c.zona !== e.zona) continue;
      if (!equipoVale(c.equipo, p.material)) continue;
      if (noQuiero.has('ej:' + k)) continue;
      return k;
    }
    return id;                                    // sin candidato: honestidad, se queda
  }

  /* ---------- lesiones: qué ejercicios piden cuidado ---------- */
  const RIESGO = {
    rodilla: ['sentadilla-barra', 'zancadas', 'prensa', 'sentadilla-copa', 'extension-cuadriceps', 'sentadilla-peso'],
    hombro: ['press-banca', 'press-militar', 'fondos', 'press-inclinado', 'press-mancuernas'],
    lumbar: ['rdl-barra', 'remo-barra', 'peso-muerto', 'buenos-dias']
  };

  function sesionesGen(base, p) {
    const G = base.UI.gen || {};
    const tpl = (s, o) => String(s || '').replace(/\{(\w+)\}/g, (m, k) => o[k] !== undefined ? o[k] : m);
    const noQuiero = new Set((p.gustos && p.gustos.no) || []);
    const lesionTxt = { rodilla: base.UI.cuest.lesRodilla, hombro: base.UI.cuest.lesHombro, lumbar: base.UI.cuest.lesLumbar };
    const S = {};
    for (const id of Object.keys(base.SESIONES)) {
      const s = base.SESIONES[id];
      if (!s.bloques) { S[id] = s; continue; }
      const c = Object.assign({}, s);
      c.bloques = s.bloques.map(b => {
        const nb = Object.assign({}, b);
        const necesitaSub = !equipoVale((base.EJERCICIOS[b.e] || {}).equipo, p.material) || noQuiero.has('ej:' + b.e);
        if (necesitaSub) {
          const sub = eligeSub(base, b.e, p, noQuiero);
          if (sub !== b.e) { nb.e = sub; nb.n = null; }   // la nota vieja hablaba del ejercicio viejo
        }
        // chip de cuidado por lesión declarada
        for (const z of (p.lesiones || [])) {
          if ((RIESGO[z] || []).includes(nb.e)) {
            const aviso = tpl(G.cuida, { a: lesionTxt[z] || z });
            nb.n = nb.n ? nb.n + ' · ' + aviso : aviso;
          }
        }
        return nb;
      });
      S[id] = c;
    }
    return S;
  }

  /* ---------- calendario por días/semana ---------- */
  function calGen(base, p) {
    const gustaCorrer = ((p.gustos && p.gustos.like) || []).includes('dep:running');
    const cardio = fase => gustaCorrer
      ? (fase <= 1 ? 'wj3' : fase === 2 ? 'wj4' : fase === 3 ? 'trote25' : 'trote30')
      : (fase <= 2 ? 'cam40' : 'cam60');
    const SPLITS = {
      2: ['fb-a', 'fb-b'],
      3: ['fb-a', 'fb-b', 'fb-a'],
      4: ['torso-a', 'pierna-a', 'torso-b', 'pierna-b'],
      5: ['push-a', 'pull-a', 'legs', 'push-b', 'pull-b'],
      6: ['push-a', 'pull-a', 'legs', 'push-b', 'pull-b', 'legs']
    };
    const dias = Math.min(6, Math.max(2, p.diasSemana || 4));
    const split = SPLITS[dias];
    // patrón semanal: dónde caen fuerza (F), cardio (C), opcional (O) y libre
    const PATRON = {
      2: ['F0', 'C', 'libre', 'F1', 'C', 'O', 'libre'],
      3: ['F0', 'C', 'F1', 'C', 'F2', 'O', 'libre'],
      4: ['F0', 'F1', 'C', 'F2', 'F3', 'C', 'libre'],
      5: ['F0', 'F1', 'C', 'F2', 'F3', 'F4', 'libre'],
      6: ['F0', 'F1', 'F2', 'F3', 'F4', 'F5', 'libre']
    }[dias];
    const CAL = [];
    for (let w = 1; w <= 12; w++) {
      const fase = w <= 2 ? 1 : w <= 5 ? 2 : w <= 9 ? 3 : 4;
      // reactivación en casa las 2 primeras semanas, salvo quien ya entrena
      const enCasa = fase === 1 && p.historial !== 'activo';
      const soloCuerpo = p.material === 'nada';
      let fIdx = 0;
      const diasSemana = PATRON.map(slot => {
        if (slot === 'libre') return 'libre';
        if (slot === 'C') return cardio(fase);
        if (slot === 'O') return { s: cardio(fase), opt: true };
        const i = fIdx++;
        if (enCasa || soloCuerpo) return i % 2 === 0 ? 'c-a' : 'c-b';
        return split[i % split.length];
      });
      CAL.push({ n: w, fase, descarga: w === 9 || undefined, dias: diasSemana });
    }
    return CAL;
  }

  /* ---------- nutrición ---------- */
  function nutriGen(base, p) {
    const N = JSON.parse(JSON.stringify(base.NUTRI));
    const G = base.UI.gen || {};
    const tpl = (s, o) => String(s || '').replace(/\{(\w+)\}/g, (m, k) => o[k] !== undefined ? o[k] : m);
    const bmr = Math.round(mifflin(p) / 10) * 10;
    const t = Math.round(tdee(p) / 10) * 10;
    const k = kcalObjetivo(p);
    const m = macros(p, k);
    const fmt = n => n.toLocaleString(base.UI.lang || 'es');
    if (N.calorias && N.calorias.length >= 3) {
      N.calorias[0].v = '~' + fmt(bmr) + ' kcal';
      N.calorias[0].n = tpl(G.datos, { p: Math.round(p.pesoKg), a: Math.round(p.alturaCm), e: p.edad });
      N.calorias[1].v = fmt(t - 80) + '–' + fmt(t + 80) + ' kcal';
      N.calorias[2].v = fmt(k - 75) + '–' + fmt(k + 75) + ' kcal';
    }
    if (N.fases && N.fases.length) {
      N.fases.forEach((f, i) => {
        const kf = i === 0 ? k : i === 1 ? k + 50 : k + 100;   // leve subida con el volumen
        f.kcal = kf; f.p = m.p; f.g = m.g;
        f.c = Math.max(0, Math.round((kf - m.p * 4 - m.g * 9) / 4));
      });
    }
    return { NUTRI: N, kcal: k, prot: m.p, tdee: t };
  }

  /* ---------- comidas: filtro por dieta, intolerancias y gustos ----------
     Se decide con `tags` y `slot`, campos idénticos en los 5 idiomas. La
     versión anterior buscaba «pollo» en los ingredientes: en inglés son
     «chicken» y el filtro no hacía nada en 4 de 5 idiomas. */
  const VETO = {
    vegetariano: ['carne', 'pescado'],
    vegano: ['carne', 'pescado', 'huevo', 'lacteo', 'miel'],
    gluten: ['gluten'], lactosa: ['lacteo'], frutos: ['frutos']
  };
  function recetaVale(r, p, noQuiero) {
    if (noQuiero.has('com:' + r.id)) return false;
    const tags = r.tags || [];
    const prohibidas = [].concat(VETO[p.dieta] || [], ...(p.sin || []).map(s => VETO[s] || []));
    return !prohibidas.some(t => tags.includes(t));
  }
  function menuGen(base, p) {
    let avisos = 0;                               // platos que quedan sin encajar
    const noQuiero = new Set((p.gustos && p.gustos.no) || []);
    const pool = { de: [], co: [], ce: [] };
    base.RECETAS.forEach(r => { if (pool[r.slot] && recetaVale(r, p, noQuiero)) pool[r.slot].push(r.id); });
    const idx = { de: 0, co: 0, ce: 0 };
    const MENU = base.MENU.map(fila => {
      const f = Object.assign({}, fila);
      ['de', 'co', 'ce'].forEach(slot => {
        const id = f[slot];
        if (id === 'LIBRE') return;
        const r = base.RECETAS.find(x => x.id === id);
        if (r && recetaVale(r, p, noQuiero)) return;         // la de serie vale
        const alt = pool[slot];
        if (alt.length) { f[slot] = alt[idx[slot] % alt.length]; idx[slot]++; }
        else avisos++;   // se queda la original, pero se cuenta y se avisa
      });
      return f;
    });
    return { MENU, avisos };
  }

  /* ---------- compra y meal prep, derivados del menú generado ----------
     La lista de serie era la de una persona concreta. Aquí se recorre el menú
     de la semana, se cuenta cuántas veces sale cada plato y se suman las
     cantidades de sus ingredientes cuando son sumables («250 g» ×3 = 750 g;
     «al gusto» se deja tal cual, una vez). Agrupado por toma, que es lo único
     que se puede agrupar sin una taxonomía de productos por idioma. */
  function parseQ(q) {
    const m = /^\s*([\d]+(?:[.,]\d+)?)\s*(kg|g|ml|l|ud)?\s*$/i.exec(q || '');
    if (!m) return null;
    let n = parseFloat(m[1].replace(',', '.'));
    let u = (m[2] || '').toLowerCase();
    if (u === 'kg') { n *= 1000; u = 'g'; }
    if (u === 'l') { n *= 1000; u = 'ml'; }
    return { n, u };
  }
  function fmtQ(n, u, lang) {
    const loc = lang || 'es';
    if (u === 'g' && n >= 1000) return (Math.round(n / 100) / 10).toLocaleString(loc) + ' kg';
    if (u === 'ml' && n >= 1000) return (Math.round(n / 100) / 10).toLocaleString(loc) + ' l';
    const v = Math.round(n * 10) / 10;
    return v.toLocaleString(loc) + (u ? ' ' + u : '');
  }
  function compraGen(base, MENU) {
    const lang = base.UI.lang;
    const veces = {};
    MENU.forEach(f => ['de', 'co', 'ce'].forEach(sl => { if (f[sl] !== 'LIBRE') veces[f[sl]] = (veces[f[sl]] || 0) + 1; }));
    const porSlot = { de: {}, co: {}, ce: {} };
    Object.keys(veces).forEach(id => {
      const r = base.RECETAS.find(x => x.id === id); if (!r || !porSlot[r.slot]) return;
      (r.ing || []).forEach(ing => {
        const clave = (ing.i || '').trim().toLowerCase();
        const q = parseQ(ing.q);
        const bolsa = porSlot[r.slot];
        if (!bolsa[clave]) bolsa[clave] = { i: ing.i, n: 0, u: null, texto: null, sumable: !!q };
        const e = bolsa[clave];
        if (q && e.sumable) { e.n += q.n * veces[id]; e.u = q.u; }
        else { e.sumable = false; e.texto = ing.q; e.n += veces[id]; }
      });
    });
    const cats = [['de', base.UI.desayuno], ['co', base.UI.comidaLbl], ['ce', base.UI.cena]];
    return cats.map(par => ({
      cat: par[1],
      items: Object.values(porSlot[par[0]]).map(e => ({
        q: e.sumable ? fmtQ(e.n, e.u, lang) : (e.texto + (e.n > 1 ? ' ×' + e.n : '')),
        i: e.i
      }))
    })).filter(c => c.items.length);
  }
  function mealprepGen(base, MENU) {
    const vistos = new Set(), pasos = [];
    MENU.forEach(f => ['de', 'co', 'ce'].forEach(sl => {
      const id = f[sl]; if (id === 'LIBRE' || vistos.has(id)) return;
      const r = base.RECETAS.find(x => x.id === id); if (!r) return;
      if (!/batch/i.test(r.tipo || '')) return;          // «batch» sobrevive en los 5 idiomas
      vistos.add(id);
      (r.pasos || []).forEach((paso, i) => pasos.push({ min: String(pasos.length + 1) + '.', paso: (i === 0 ? r.nombre + ' — ' : '') + paso }));
    }));
    return pasos;
  }

  /* ---------- META y FASES ---------- */
  function metaGen(base, p, prot) {
    const M = JSON.parse(JSON.stringify(base.META));
    const ini = proximoLunes();
    M.inicioISO = iso(ini);
    M.finISO = iso(addD(ini, 12 * 7 - 1));
    M.semanas = 12;
    M.perfil.pesoSalida = p.pesoKg;
    M.perfil.alturaCm = p.alturaCm;
    M.perfil.proteinaDia = prot;
    const kg = p.pesoKg;
    M.perfil.objetivoKg = p.objetivo === 'perder' ? [Math.round(kg * 0.92 - 1), Math.round(kg * 0.92)]
      : p.objetivo === 'recomp' ? [Math.round(kg - 4), Math.round(kg - 2)]
      : p.objetivo === 'ganar' ? [Math.round(kg + 1), Math.round(kg + 3)]
      : [Math.round(kg - 1), Math.round(kg + 1)];
    if (p.cinturaCm) M.perfil.cinturaMetaCm = Math.round(p.cinturaCm - (p.objetivo === 'ganar' ? 2 : 6));
    return { META: M, ini };
  }
  function fasesGen(base, ini) {
    const meses = base.UI.meses;
    return base.FASES.map(f => {
      const c = Object.assign({}, f);
      const a = addD(ini, (f.semanas[0] - 1) * 7);
      const b = addD(ini, f.semanas[f.semanas.length - 1] * 7 - 1);
      c.fechas = corta(a, meses) + ' – ' + corta(b, meses);
      return c;
    });
  }

  function generarPlan(perfil, base) {
    // sin los mínimos, no hay números fiables: se sirve el plan base
    if (!perfil || !perfil.pesoKg || !perfil.alturaCm || !perfil.edad) return base;
    const nutri = nutriGen(base, perfil);
    const menu = menuGen(base, perfil);
    const meta = metaGen(base, perfil, nutri.prot);
    return Object.assign({}, base, {
      META: meta.META,
      FASES: fasesGen(base, meta.ini),
      CAL: calGen(base, perfil),
      SESIONES: sesionesGen(base, perfil),
      NUTRI: nutri.NUTRI,
      MENU: menu.MENU,
      COMPRA: compraGen(base, menu.MENU),
      MEALPREP: mealprepGen(base, menu.MENU),
      MEALPREP_NOTA: (base.UI.gen && base.UI.gen.prepNota) || base.MEALPREP_NOTA,
      __menuAvisos: menu.avisos || 0,
      HISTORICO: {},          // las marcas del plan original eran de una persona
      ARRANQUE: null,         // su tabla de cargas también; la vista lo guarda
      __gen: true
    });
  }

  return { generarPlan };
})();

/* Si hay perfil guardado, el plan del arranque ES el generado: se sustituye
   window.B2P entero antes de que app.js lo lea — el mismo mecanismo que ya
   usa el sistema de idiomas. */
(function () {
  try {
    const S = JSON.parse(localStorage.getItem('b2p_v1') || '{}');
    if (S.perfil && window.B2P) window.B2P = window.B2P_GEN.generarPlan(S.perfil, window.B2P);
  } catch (e) { /* estado corrupto: plan base */ }
})();
