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

  function sesionesGen(base, p, stats, usados) {
    const G = base.UI.gen || {};
    const tpl = (s, o) => String(s || '').replace(/\{(\w+)\}/g, (m, k) => o[k] !== undefined ? o[k] : m);
    const noQuiero = new Set((p.gustos && p.gustos.no) || []);
    const lesionTxt = { rodilla: base.UI.cuest.lesRodilla, hombro: base.UI.cuest.lesHombro, lumbar: base.UI.cuest.lesLumbar };
    const S = {};
    const cambiados = new Set();                  // ids sustituidos EN SESIONES DEL CALENDARIO, para el reveal
    /* «30 minutos» significa 30 minutos: se quedan los primeros bloques (los
       básicos van primero por diseño) y la duración anunciada dice la verdad.
       Excepción: el bloque de gemelo lento (elev-talones) es el seguro del
       tendón — si el corte lo dejaba fuera, entra en el último puesto. */
    const maxBloques = p.minSesion <= 30 ? 4 : p.minSesion <= 45 ? 5 : 99;
    for (const id of Object.keys(base.SESIONES)) {
      const s = base.SESIONES[id];
      if (!s.bloques) { S[id] = s; continue; }
      const c = Object.assign({}, s);
      if (s.bloques.length > maxBloques) {
        c.bloques = s.bloques.slice(0, maxBloques);
        const tendon = s.bloques.find(b => b.e === 'elev-talones');
        if (tendon && !c.bloques.includes(tendon)) c.bloques[c.bloques.length - 1] = tendon;
        c.dur = plantilla(G.durAprox || c.dur, { m: p.minSesion });
        if (stats) stats.recorte = p.minSesion;
      }
      c.bloques = c.bloques.map(b => {
        const nb = Object.assign({}, b);
        const necesitaSub = !equipoVale((base.EJERCICIOS[b.e] || {}).equipo, p.material) || noQuiero.has('ej:' + b.e);
        if (necesitaSub) {
          const sub = eligeSub(base, b.e, p, noQuiero);
          // la nota vieja hablaba del ejercicio viejo; el contador solo cuenta lo que el calendario usa
          if (sub !== b.e) { nb.e = sub; nb.n = null; if (!usados || usados.has(id)) cambiados.add(b.e); }
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
      /* los circuitos de casa viven 12+ semanas con las mismas reps escritas:
         la progresión se prescribe con palabras, en el primer bloque */
      if ((id === 'c-a' || id === 'c-b') && G.circProg && c.bloques.length) {
        c.bloques[0] = Object.assign({}, c.bloques[0], {
          n: c.bloques[0].n ? c.bloques[0].n + ' · ' + G.circProg : G.circProg });
      }
      S[id] = c;
    }
    if (stats) stats.subs = cambiados.size;
    /* el cardio del calendario puede ser «lo tuyo»: la sesión se fabrica aquí
       con los deportes que gustaron en el mazo, con textos ya localizados */
    const deps = deportesGustados(base, p).filter(n => n !== ((base.QUIZ_DEP || []).find(x => x.id === 'running') || {}).n);
    if (deps.length) {
      S['cardio-libre'] = {
        nombre: plantilla(G.cardioLibreT, { d: deps.slice(0, 2).join(' · ') }),
        tipo: 'cardio', icono: 'walk',
        detalle: plantilla(G.cardioLibreD, { m: '30-40' })
      };
    }
    return S;
  }

  /* ---------- duración y calendario por días/semana ----------
     El plan dura lo que se pidió: 12, 24 o 48 semanas (0 = «sin fecha», que
     internamente es un bloque de 12 renovable). Las 4 fases se estiran en
     proporción y la descarga cae cada 9 semanas, que es a lo que el tejido
     conectivo llega antes de pedir vacaciones. */
  function semanasDe(p) {
    return p.duracionSem === 24 ? 24 : p.duracionSem === 48 ? 48 : 12;
  }
  function cortesDe(ST) {
    // fin de F1, F2 y F3 (F4 llega hasta ST); mismas fracciones que el 2/5/9 de 12
    return [Math.max(2, Math.round(ST * 2 / 12)), Math.round(ST * 5 / 12), Math.round(ST * 9 / 12)];
  }
  function faseDe(w, cortes) { return w <= cortes[0] ? 1 : w <= cortes[1] ? 2 : w <= cortes[2] ? 3 : 4; }

  function deportesGustados(base, p) {
    const likes = ((p.gustos && p.gustos.like) || []).filter(k => k.startsWith('dep:')).map(k => k.slice(4));
    return likes.map(id => { const dep = (base.QUIZ_DEP || []).find(x => x.id === id); return dep && dep.n; }).filter(Boolean);
  }
  function calGen(base, p) {
    const gustaCorrer = ((p.gustos && p.gustos.like) || []).includes('dep:running');
    const otrosDeportes = deportesGustados(base, p).length > (gustaCorrer ? 1 : 0);
    /* quien ya entrena no pasa por el sofá-a-5k: entra directo al trote */
    const cardio = fase => gustaCorrer
      ? (p.historial === 'activo' ? (fase <= 2 ? 'trote25' : 'trote30')
        : (fase <= 1 ? 'wj3' : fase === 2 ? 'wj4' : fase === 3 ? 'trote25' : 'trote30'))
      : otrosDeportes && fase >= 2 ? 'cardio-libre'
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
    const ST = semanasDe(p), cortes = cortesDe(ST);
    const CAL = [];
    for (let w = 1; w <= ST; w++) {
      const fase = faseDe(w, cortes);
      // reactivación en casa al principio, salvo quien ya entrena
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
      CAL.push({ n: w, fase, descarga: (w % 9 === 0 && w < ST) || undefined, dias: diasSemana });
    }
    return CAL;
  }

  /* ---------- hitos de semana: regenerados y honestos ----------
     El cribado solo si se vuelve de años parado; el diet break solo si el plan
     recorta; la descarga siempre que toque. La transición a 5 días del plan
     original no existe aquí: el split no cambia a mitad de camino. */
  function hitosGen(base, p, nutri) {
    const G = base.UI.gen || {};
    const ST = semanasDe(p), cortes = cortesDe(ST);
    const fmt = n => n.toLocaleString(base.UI.lang || 'es');
    const H = {};
    if (p.historial !== 'activo') {
      const w = Math.min(cortes[1], Math.max(3, Math.round(ST * 5 / 12)));
      H[w] = { t: G.hitoCribadoT, d: G.hitoCribadoD, tipo: 'cribado' };
    }
    const recorta = p.objetivo === 'perder' || p.objetivo === 'recomp';
    if (recorta) {
      for (let w = Math.round(ST * 7 / 12); w <= ST; w += 12) {
        H[Math.min(w, ST)] = { t: G.hitoDietT, d: plantilla(G.hitoDietD, { k: fmt(Math.round(nutri.tdee / 100) * 100) }), tipo: 'dietbreak' };
      }
    }
    for (let w = 9; w < ST; w += 9) {
      H[w] = { t: G.hitoDescargaT, d: G.hitoDescargaD, tipo: 'descarga' };
    }
    return H;
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
    // la toma mínima por comida sale de TU proteína, no de la del dueño
    const qMin = Math.max(20, Math.round(m.p / 4 * 0.85 / 5) * 5);
    if (N.tomas) N.tomas = tpl(N.tomas, { q: qMin });
    if (N.calorias && N.calorias.length >= 3) {
      N.calorias[0].v = '~' + fmt(bmr) + ' kcal';
      N.calorias[0].n = tpl(G.datos, { p: Math.round(p.pesoKg), a: Math.round(p.alturaCm), e: p.edad });
      N.calorias[1].v = fmt(t - 80) + '–' + fmt(t + 80) + ' kcal';
      N.calorias[2].v = fmt(k - 75) + '–' + fmt(k + 75) + ' kcal';
    }
    if (N.fases && N.fases.length) {
      const ST = semanasDe(p), cortes = cortesDe(ST);
      const recorta = p.objetivo === 'perder' || p.objetivo === 'recomp';
      const wBreak = Math.round(ST * 7 / 12);
      N.fases.forEach((f, i) => {
        const kf = i === 0 ? k : i === 1 ? k + 50 : k + 100;   // leve subida con el volumen
        f.kcal = kf; f.p = m.p; f.g = m.g;
        f.c = Math.max(0, Math.round((kf - m.p * 4 - m.g * 9) / 4));
        // las etiquetas de rango dicen las semanas REALES de este plan
        f.f = tpl(G['nf' + (i + 1)] || f.f, { a: cortes[1], b: cortes[1] + 1, c: cortes[2], d: cortes[2] + 1, e: ST });
        // la nota del diet break: solo si el plan recorta, y en su semana real
        if (i === 1) {
          if (recorta) f.nota = tpl(G.dietBreakNota || f.nota, { w: wBreak, k: fmt(t - t % 100) });
          else delete f.nota;
        }
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
    const ST = semanasDe(p);
    M.inicioISO = iso(ini);
    M.finISO = iso(addD(ini, ST * 7 - 1));
    M.semanas = ST;
    M.abierto = p.duracionSem === 0 || undefined;   // «sin fecha»: bloque renovable
    M.evento = p.evento || null;
    M.franja = p.franja || null;
    M.dieta = p.dieta || 'normal';
    M.sin = (p.sin || []).slice();
    M.objetivo = p.objetivo || 'mantener';
    M.historial = p.historial || 'retomador';
    M.gustosNo = ((p.gustos && p.gustos.no) || []).slice();
    M.cinturaDeclarada = !!p.cinturaCm;
    M.perfil.pesoSalida = p.pesoKg;
    M.perfil.alturaCm = p.alturaCm;
    M.perfil.proteinaDia = prot;
    /* el objetivo escala con la duración real, con techos sensatos:
       perder ~0,67%/sem hasta el 20%; ganar despacio; recomp acotada */
    const kg = p.pesoKg, f = ST / 12;
    const pctPerder = Math.min(0.20, 0.0067 * ST);
    M.perfil.objetivoKg = p.objetivo === 'perder' ? [Math.round(kg * (1 - pctPerder) - 1), Math.round(kg * (1 - pctPerder))]
      : p.objetivo === 'recomp' ? [Math.round(kg - 4 * Math.min(2, f)), Math.round(kg - 2 * Math.min(2, f))]
      : p.objetivo === 'ganar' ? [Math.round(kg + 1 * f), Math.round(kg + Math.min(10, 3 * f))]
      : [Math.round(kg - 1), Math.round(kg + 1)];
    /* La métrica reina siempre tiene meta: con cintura declarada, bajar 6 cm
       sin pasar de la mitad de la estatura (que es el umbral con evidencia);
       sin cintura declarada, la mitad de la estatura a secas. */
    const mitad = Math.round(p.alturaCm / 2);
    M.perfil.cinturaMetaCm = p.cinturaCm
      ? Math.min(Math.round(p.cinturaCm) - 2, Math.max(mitad, Math.round(p.cinturaCm) - 6))
      : mitad;
    return { META: M, ini };
  }
  function fasesGen(base, ini, p) {
    const meses = base.UI.meses, G = base.UI.gen || {};
    const ST = semanasDe(p), cortes = cortesDe(ST);
    const dias = Math.min(6, Math.max(2, p.diasSemana || 4));
    const splitTxt = dias <= 3 ? G.splitFbC : dias === 4 ? G.splitTpC : G.splitPplC;
    const rangos = [[1, cortes[0]], [cortes[0] + 1, cortes[1]], [cortes[1] + 1, cortes[2]], [cortes[2] + 1, ST]];
    return base.FASES.map((f, i) => {
      const c = Object.assign({}, f);
      const semanas = [];
      for (let w = rangos[i][0]; w <= rangos[i][1]; w++) semanas.push(w);
      c.semanas = semanas;
      const a = addD(ini, (semanas[0] - 1) * 7);
      const b = addD(ini, semanas[semanas.length - 1] * 7 - 1);
      c.fechas = corta(a, meses) + ' – ' + corta(b, meses);
      /* el sub deja de describir la progresión del dueño: F1 conserva su
         «en casa» solo si de verdad se reactiva en casa; el resto lleva el
         split real del perfil */
      const enCasa = i === 0 && p.historial !== 'activo';
      if (!enCasa) c.sub = plantilla(G.faseSub, { s: splitTxt, d: dias });
      c.objetivo = plantilla(c.objetivo, { d: dias });
      return c;
    });
  }

  /* ---------- superficies que eran del dueño: ahora salen del perfil ----------
     Todo lo que enseñe un número tiene que poder defenderlo: checkpoints,
     fotos, reglas, ciencia, carrera y logros se regeneran con tus datos. */
  const plantilla = (s, o) => String(s || '').replace(/\{(\w+)\}/g, (m, k) => o[k] !== undefined ? o[k] : m);

  function checkpointsGen(base, M, ini) {
    const G = base.UI.gen || {};
    const salida = M.perfil.pesoSalida, obj = M.perfil.objetivoKg;
    const lo = Math.min(obj[0], obj[1]), hi = Math.max(obj[0], obj[1]);
    const sube = (lo + hi) / 2 > salida;
    const st = M.semanas || 12;
    const semanas = [Math.round(st / 3), Math.round(st * 2 / 3), st];
    const r1 = v => Math.round(v * 10) / 10;
    const textos = [G.chk1, G.chk2, G.chk3];
    return semanas.map((s, i) => {
      const t = s / st;
      const a = r1(salida + (lo - salida) * t), b = r1(salida + (hi - salida) * t);
      return { sem: s, fecha: iso(addD(ini, s * 7 - 1)), rango: [Math.min(a, b), Math.max(a, b)],
        si: textos[i] || '', dir: sube ? 'sube' : 'baja' };
    });
  }
  function fotosGen(M, ini) {
    const st = M.semanas || 12;
    return [iso(ini), iso(addD(ini, Math.round(st / 3) * 7 - 1)),
      iso(addD(ini, Math.round(st * 2 / 3) * 7 - 1)), iso(addD(ini, st * 7 - 1))];
  }
  function reglasGen(base, prot) {
    const q = Math.max(20, Math.round(prot / 4 * 0.85 / 5) * 5);   // toma mínima útil
    return base.REGLAS.map(r => Object.assign({}, r, {
      t: plantilla(r.t, { p: prot, q }), d: plantilla(r.d, { p: prot, q }) }));
  }
  function cienciaGen(base, prot) {
    const C = JSON.parse(JSON.stringify(base.CIENCIA));
    if (C.temas) C.temas.forEach(x => { x.d = plantilla(x.d, { p: prot }); });
    return C;
  }
  function carreraGen(base, p) {
    const C = Object.assign({}, base.CARRERA);
    C.titulo = plantilla(C.titulo, { p: Math.round(p.pesoKg) });
    return C;
  }
  function logrosGen(base, M, chks) {
    const G = base.UI.gen || {};
    const salida = M.perfil.pesoSalida, obj = M.perfil.objetivoKg;
    const media = (Math.min(obj[0], obj[1]) + Math.max(obj[0], obj[1])) / 2;
    const delta = Math.round(salida - media);          // + pierde · − gana
    const escalera = [];
    if (delta >= 2) {
      const vs = [];
      [0.25, 0.5, 0.75, 1].forEach(f => { const v = Math.max(1, Math.round(delta * f)); if (!vs.includes(v)) vs.push(v); });
      vs.forEach((v, i) => escalera.push({ id: 'kg-' + v, icon: i === vs.length - 1 ? '🏔️' : '📉',
        nombre: plantilla(G.lKgN, { v }), desc: plantilla(G.lKgD, { v }) }));
    } else if (delta <= -1) {
      const vs = [];
      [0.5, 1].forEach(f => { const v = Math.max(1, Math.round(-delta * f)); if (!vs.includes(v)) vs.push(v); });
      vs.forEach(v => escalera.push({ id: 'kgup-' + v, icon: '📈',
        nombre: plantilla(G.lKgUpN, { v }), desc: plantilla(G.lKgUpD, { v }) }));
    }
    /* a quien quiere CRECER y no declaró cintura no se le cuelgan insignias de
       encogerla: su vitrina ya tiene la escalera de subida y los PRs */
    const meta = (M.objetivo === 'ganar' && !M.cinturaDeclarada) ? null : M.perfil.cinturaMetaCm;
    const cinturas = meta ? [
      { id: 'cint-' + (meta + 4), icon: '📏', nombre: plantilla(G.lCintN, { v: meta + 4 }), desc: plantilla(G.lCintD, { v: meta + 4 }) },
      { id: 'cint-' + (meta + 2), icon: '📏', nombre: plantilla(G.lCintN, { v: meta + 2 }), desc: plantilla(G.lCintD, { v: meta + 2 }) },
      { id: 'cint-' + meta, icon: '👑', nombre: plantilla(G.lReinaN, { v: meta }), desc: plantilla(G.lReinaD, { v: meta }) }
    ] : [];
    const out = [];
    let kgHecho = false, cintHecho = false;
    for (const l of base.LOGROS) {
      if (l.id === 'marca-banca' || l.id === 'marca-sentadilla') continue;   // sin marcas previas no hay nada que recuperar
      if (/^kg-/.test(l.id)) { if (!kgHecho) { out.push.apply(out, escalera); kgHecho = true; } continue; }
      if (/^cintura-/.test(l.id)) { if (!cintHecho) { out.push.apply(out, cinturas); cintHecho = true; } continue; }
      if (l.id === 'plan-completo') { out.push(Object.assign({}, l, { desc: plantilla(G.lFinDesc || l.desc, { s: M.semanas }) })); continue; }
      // las insignias de checkpoint nombran SU semana (S8/S16 en un plan de 24)
      if ((l.id === 'checkpoint-s4' || l.id === 'checkpoint-s8') && chks) {
        const c = chks[l.id === 'checkpoint-s4' ? 0 : 1];
        if (c && G.lChkN) { out.push(Object.assign({}, l, { nombre: plantilla(G.lChkN, { s: c.sem }), desc: plantilla(G.lChkD, { s: c.sem }) })); continue; }
      }
      out.push(l);
    }
    return out;
  }

  /* Las decisiones del motor, en datos: el reveal las enseña una a una.
     Solo hechos que el plan generado cumple de verdad — nada de prometer. */
  function decisionesGen(perfil, nutri, meta, menu, stats) {
    const dias = Math.min(6, Math.max(2, perfil.diasSemana || 4));
    const dec = [];
    dec.push({ k: 'split', d: dias, tipo: dias <= 3 ? 'fb' : dias === 4 ? 'tp' : 'ppl' });
    dec.push({ k: 'kcal', v: nutri.kcal, delta: nutri.kcal - nutri.tdee, obj: perfil.objetivo });
    dec.push({ k: 'prot', v: nutri.prot, kg: Math.round(nutri.prot / perfil.pesoKg * 10) / 10 });
    dec.push({ k: 'dur', s: meta.META.semanas, a: meta.META.inicioISO, b: meta.META.finISO });
    if (stats.subs) dec.push({ k: 'subs', n: stats.subs });
    if ((perfil.lesiones || []).length) dec.push({ k: 'cuida', zonas: perfil.lesiones.slice() });
    if ((perfil.dieta && perfil.dieta !== 'normal') || (perfil.sin || []).length)
      dec.push({ k: 'menu', avisos: menu.avisos || 0 });
    const g = perfil.gustos || {};
    if ((g.no || []).length) dec.push({ k: 'gustos', likes: (g.like || []).length, nos: g.no.length });
    if (stats.recorte) dec.push({ k: 'min', v: stats.recorte });
    if (perfil.evento && perfil.evento !== 'siempre') dec.push({ k: 'evento', v: perfil.evento });
    if (perfil.duracionSem === 0) dec[dec.findIndex(x => x.k === 'dur')].abierto = true;
    return dec;
  }

  function generarPlan(perfil, base) {
    // sin los mínimos, no hay números fiables: se sirve el plan base
    if (!perfil || !perfil.pesoKg || !perfil.alturaCm || !perfil.edad) return base;
    const nutri = nutriGen(base, perfil);
    const menu = menuGen(base, perfil);
    const meta = metaGen(base, perfil, nutri.prot);
    const stats = { subs: 0 };
    // el calendario primero: las sesiones que de verdad usa acotan el contador de sustituciones
    const cal = calGen(base, perfil);
    const usados = new Set();
    cal.forEach(wk => wk.dias.forEach(x => { const sid = typeof x === 'object' ? x.s : x; if (sid && sid !== 'libre') usados.add(sid); }));
    const chks = checkpointsGen(base, meta.META, meta.ini);   // los logros nombran sus semanas
    return Object.assign({}, base, {
      META: meta.META,
      FASES: fasesGen(base, meta.ini, perfil),
      CAL: cal,
      HITOS_SEMANA: hitosGen(base, perfil, nutri),
      SESIONES: sesionesGen(base, perfil, stats, usados),
      NUTRI: nutri.NUTRI,
      MENU: menu.MENU,
      COMPRA: compraGen(base, menu.MENU),
      MEALPREP: mealprepGen(base, menu.MENU),
      MEALPREP_NOTA: (base.UI.gen && base.UI.gen.prepNota) || base.MEALPREP_NOTA,
      CHECKPOINTS: chks,
      FOTOS: fotosGen(meta.META, meta.ini),
      REGLAS: reglasGen(base, nutri.prot),
      CIENCIA: cienciaGen(base, nutri.prot),
      CARRERA: carreraGen(base, perfil),
      LOGROS: logrosGen(base, meta.META, chks),
      __menuAvisos: menu.avisos || 0,
      __mantenimiento: Math.round(nutri.tdee / 100) * 100,
      __decisiones: decisionesGen(perfil, nutri, meta, menu, stats),
      HISTORICO: {},          // las marcas del plan original eran de una persona
      ARRANQUE: null,         // su tabla de cargas también; la vista lo guarda
      __gen: true
    });
  }

  // recetaVale se exporta para que el mazo y el recetario filtren en vivo
  return { generarPlan, recetaVale };
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
