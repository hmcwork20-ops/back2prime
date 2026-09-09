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
    /* la proteína se calcula sobre el peso de REFERENCIA: en déficit, el peso
       objetivo (2,2 g/kg del peso actual con IMC alto da objetivos irreales
       e inalcanzables con la propia ingesta) */
    const o = objetivoKgDe(p);
    const ref = (p.objetivo === 'perder' || p.objetivo === 'recomp') ? (o[0] + o[1]) / 2 : p.pesoKg;
    const prot = Math.round(ref * (p.objetivo === 'ganar' || p.objetivo === 'mantener' ? 1.8 : 2.2));
    const grasa = Math.round(p.pesoKg * 0.9);
    const carbo = Math.max(0, Math.round((kcal - prot * 4 - grasa * 9) / 4));
    return { p: prot, g: grasa, c: carbo };
  }

  /* ---------- fechas ---------- */
  const mediodia = d => { const x = new Date(d); x.setHours(12, 0, 0, 0); return x; };
  const fecha = s => { const d = new Date(String(s) + 'T12:00:00'); return isNaN(d) ? null : d; };
  function proximoLunes(desde) {
    const d = mediodia(desde || new Date());
    const dow = (d.getDay() + 6) % 7;             // 0 = lunes
    d.setDate(d.getDate() + (dow === 0 ? 7 : 7 - dow));
    return d;
  }
  const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  /* Cuando arranca el plan. Antes era SIEMPRE el lunes siguiente: una decision
     de la app, no de quien entrena, que obligaba a esperar hasta seis dias
     mirando un plan que aun no habia empezado. Ahora lo dice el cuestionario y
     el lunes queda de reserva, que es lo que respondia todo el mundo antes.

     La fecha se ancla al dia en que se RESPONDIO el cuestionario
     (perfil.creado), nunca a hoy. El plan entero se regenera en cada arranque
     de la app, asi que mirar el reloj aqui hacia que la fecha huyera hacia
     adelante con el: «hoy» volvia a ser hoy cada dia, y «el lunes que viene»
     era el lunes que viene DE ESTA semana. El plan no llegaba a empezar nunca.
     Reportado el 8 de septiembre de 2026: cuestionario el domingo 6 pidiendo
     el lunes, y el martes 8 la app anunciaba el lunes 14.

     Un dia elegido que ya paso se respeta: eso es un plan en marcha y sus
     semanas se cuentan desde el. Descartarlo por estar en el pasado, que es lo
     que se hacia, era la otra mitad de la fuga: en cuanto llegaba tu dia, el
     plan saltaba al lunes siguiente. */
  function fechaInicio(p) {
    const ancla = mediodia(fecha((p || {}).creado) || new Date());
    if (p && p.inicio === 'hoy') return ancla;
    if (p && (p.inicio === 'semana' || p.inicio === 'exacto') && p.inicioFecha) {
      const f = fecha(p.inicioFecha);
      if (f) return f;
    }
    return proximoLunes(ancla);
  }
  function addD(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function corta(d, meses) { return d.getDate() + ' ' + meses[d.getMonth()]; }

  /* ---------- etapa: embarazo y posparto ----------
     Las dos se anclan a una fecha guardada en el perfil (la fecha probable
     de parto o la del parto), nunca al reloj: el plan se regenera en cada
     arranque y todo lo que se recalcule desde «hoy» se mueve solo. */
  const ETAPA = p => (p && (p.etapa === 'embarazo' || p.etapa === 'posparto')) ? p.etapa : null;
  const diasEntre = (a, b) => Math.round((mediodia(b) - mediodia(a)) / 864e5);
  // semana de gestación en la fecha d: 40 menos las semanas que faltan para la FPP
  function semanaGestacion(fpp, d) { const f = fecha(fpp); return f ? 40 - Math.floor(diasEntre(d, f) / 7) : null; }
  function semanasPosparto(parto, d) { const f = fecha(parto); return f ? Math.floor(diasEntre(f, d) / 7) : null; }
  function fppDe(creado, semana) { const c = fecha(creado); return (c && semana) ? iso(addD(c, (40 - semana) * 7)) : null; }
  // fase del plan por semana de gestación: 1-13, 14-27, 28-36, 37+
  const faseEmb = g => g <= 13 ? 1 : g <= 27 ? 2 : g <= 36 ? 3 : 4;
  // cortes del posparto en semanas desde el parto; la cesárea suma dos a cada uno
  const cortesPP = p => (p && p.partoTipo === 'cesarea') ? [4, 8, 14] : [2, 6, 12];
  /* Ganancia de peso esperada por IMC previo (IOM 2009, en kg): total al
     término y, de ahí, el ritmo que lo cumple desde la semana 13 (0,5-2 kg
     en el primer trimestre, según la propia tabla). */
  const IOM = [[18.5, 12.5, 18], [25, 11.5, 16], [30, 7, 11.5], [Infinity, 5, 9]];
  const iomDe = imc => IOM.find(r => imc < r[0]) || IOM[3];
  function gananciaEsperada(imc, g) {
    const r = iomDe(imc), w = Math.min(40, Math.max(0, g));
    if (w <= 13) return [0.5 * w / 13, 2 * w / 13];
    return [0.5 + (r[1] - 0.5) * (w - 13) / 27, 2 + (r[2] - 2) * (w - 13) / 27];
  }
  const ritmoIOM = imc => { const r = iomDe(imc); return [(r[1] - 0.5) / 27, (r[2] - 2) / 27]; };
  /* peso previo al embarazo: el declarado, o el actual descontando la
     ganancia media esperada hasta la semana en que se respondió */
  function pesoPreDe(p) {
    if (p.pesoPre) return p.pesoPre;
    const g = semanaGestacion(p.fpp, fecha(p.creado) || new Date());
    if (!g || g <= 13) return p.pesoKg;
    const imc = p.pesoKg / Math.pow(p.alturaCm / 100, 2);
    const e = gananciaEsperada(imc, g);
    return Math.round((p.pesoKg - (e[0] + e[1]) / 2) * 10) / 10;
  }
  /* Qué no se hace en el embarazo, y desde cuándo. Por id, no por patrón:
     el patrón «core» tiene versiones tumbadas y versiones de pie.
       · nunca: flexión de tronco cargada, inversiones, equilibrio a una
         pierna sin apoyo, nórdico, plancha con lastre, colgarse;
       · desde la fase 2 (semana 14; la guía dice 16): tumbada boca arriba
         o boca abajo, y el pike (cabeza por debajo del corazón);
       · desde la fase 3 (semana 28): plancha y flexiones en el suelo, que
         pasan a inclinadas. */
  const EMB_NUNCA = ['crunch-polea', 'crunch-inverso', 'elev-piernas', 'elev-piernas-suelo', 'rueda-abdominal',
    'pino-pared', 'pistol-asistida', 'zancada-bulgara', 'zancada-bulgara-pc', 'curl-nordico', 'plancha-lastre',
    'dominadas', 'flexion-declinada', 'hip-thrust'];
  const EMB_DESDE2 = ['press-banca', 'press-plano-mc', 'puente-gluteo', 'puente-1p', 'dead-bug', 'curl-femoral-tumbado',
    'superman', 'elev-y-suelo', 'pike-flexiones', 'press-frances'];
  const EMB_DESDE3 = ['plancha', 'plancha-lateral', 'flexiones', 'flexion-diamante'];
  function tocaEmbarazo(base, ejId, fase) {
    if (EMB_NUNCA.includes(ejId)) return true;
    if (fase >= 2 && EMB_DESDE2.includes(ejId)) return true;
    if (fase >= 3 && EMB_DESDE3.includes(ejId)) return true;
    return false;
  }
  // los deportes del mazo que el embarazo deja fuera: contacto, raqueta, caída
  const EMB_DEP_NO = ['padel', 'futbol', 'baloncesto', 'volley', 'boxeo', 'calistenia'];

  /* ---------- material y sustituciones ----------
     El material se decide por ID, no por el texto del campo `equipo`: ese
     texto se traduce («Polea alta» → «Lat pulldown» → «Polia alta») y con él
     el filtro dejaba pasar barras y poleas a un plan de casa en cuanto la app
     no estaba en español. Los ids no se traducen nunca. La tabla se generó
     del español, así que en castellano el plan sale idéntico a antes. */
  const EQ_NIVEL = { nada: 0, casa: 1, gym: 2 };
  const EQ_ID = {};
  [
    ['nada',
      'sentadilla-pc', 'flexiones', 'puente-gluteo', 'plancha', 'elev-talones',
      'zancada-alterna', 'remo-toalla', 'rdl-1p', 'superman', 'dead-bug',
      'fondos-silla', 'flexion-diamante', 'pike-flexiones', 'jalon-toalla', 'abduccion-lado',
      'crunch-inverso', 'curl-mochila', 'flexion-declinada', 'pino-pared', 'remo-mesa',
      'pistol-asistida', 'curl-toalla', 'zancada-bulgara-pc', 'puente-1p', 'elev-piernas-suelo',
      'elev-talon-1p', 'plancha-lateral', 'elev-y-suelo', 'curl-nordico',
      'encogimiento-mochila'],
    ['casa',
      'plancha-lastre', 'banda-remo', 'banda-jalon', 'banda-rotacion', 'banda-abduccion',
      'elev-laterales', 'encogimientos', 'zancada-mc', 'elev-piernas', 'rueda-abdominal',
      'curl-martillo', 'ext-triceps-banda', 'press-frances-mc'],
    ['gym',
      'press-banca', 'press-inclinado-mc', 'press-inclinado-barra', 'press-plano-mc',
      'press-militar', 'press-militar-mc', 'laterales-polea', 'fondos', 'ext-triceps-polea',
      'ext-triceps-cabeza', 'press-frances', 'remo-barra', 'remo-polea', 'remo-mancuerna',
      'jalon-pecho', 'jalon-estrecho', 'dominadas', 'pullover-polea', 'face-pull',
      'sentadilla-barra', 'prensa', 'rdl-barra', 'hip-thrust', 'zancada-bulgara',
      'ext-cuadriceps', 'curl-femoral-tumbado', 'curl-femoral-sentado', 'gemelo-pie',
      'gemelo-sentado', 'crunch-polea', 'curl-barra-z', 'curl-inclinado', 'curl-polea']
  ].forEach(fila => fila.slice(1).forEach(id => { EQ_ID[id] = fila[0]; }));

  /* Peso corporal puro: sirve para avisar de que una sustitución bajó a suelo.
     Va aparte porque «mochila» y «escalón» son nivel nada pero no son corporal. */
  const EQ_CORPORAL = new Set(['sentadilla-pc', 'flexiones', 'puente-gluteo', 'plancha',
    'zancada-alterna', 'superman', 'dead-bug', 'fondos-silla', 'flexion-diamante',
    'pike-flexiones', 'jalon-toalla', 'abduccion-lado', 'crunch-inverso',
    'flexion-declinada', 'pino-pared', 'remo-mesa', 'pistol-asistida', 'curl-toalla',
    'zancada-bulgara-pc', 'puente-1p', 'elev-piernas-suelo', 'elev-talon-1p', 'plancha-lateral',
    'elev-y-suelo', 'curl-nordico']);

  /* Dificultad: 1 base · 2 progresión · 3 avanzada. Solo se anota lo que NO es
     base, que es la excepción. Sin material la carga sube cambiando la palanca,
     así que estas son las «pesas» de quien entrena en el salón. */
  const EJ_NIVEL = {
    'flexion-diamante': 2, 'flexion-declinada': 2, 'pino-pared': 3, 'remo-mesa': 2,
    'pistol-asistida': 2, 'zancada-bulgara-pc': 2, 'puente-1p': 2, 'elev-piernas-suelo': 2,
    'elev-talon-1p': 2, 'curl-nordico': 2
  };
  /* Quien nunca ha entrenado no recibe variantes avanzadas: antes que un pino
     contra la pared, repite la versión base. */
  const nivelTope = p => (p && p.historial === 'nunca') ? 2 : 3;

  /* Un ejercicio que no esté en la tabla (añadido nuevo) cae en el filtro por
     texto de siempre: en español acierta, y así nunca desaparece del plan. */
  function equipoValeId(base, id, material) {
    const n = EQ_ID[id];
    if (n === undefined) return equipoVale(((base.EJERCICIOS || {})[id] || {}).equipo, material);
    return EQ_NIVEL[n] <= (EQ_NIVEL[material] !== undefined ? EQ_NIVEL[material] : 2);
  }
  const esCorporalId = id => EQ_CORPORAL.has(id);

  function equipoVale(txt, material) {
    const t = (txt || '').toLowerCase();
    if (material === 'gym') return true;
    if (/polea|máquina|maquina|multipower|rack|prensa/.test(t)) return false;
    if (/barra(?! de dominadas)/.test(t)) return false;       // barra olímpica no; dominadas depende
    /* el banco tampoco: «casa: mancuernas y bandas» no incluye banco, y casi
       toda la sesión de torso colgaba de él. Un ejercicio que lo pide se
       sustituye por su pariente de suelo (mismo patrón). */
    if (/banco/.test(t)) return false;
    if (material === 'casa') return true;                     // mancuernas, bandas, toalla, suelo
    // nada: solo cuerpo, toalla, escalón, mochila
    return /^nada|toalla|escalón|escalon|mochila/.test(t);
  }
  /* El pictograma que representa AL EJERCICIO, no a su patrón. En la fila de la
     sesión el dibujo promete «esto es lo que haces», y el del patrón dibuja el
     material típico de ese patrón: encima de unas flexiones salía un press de
     banca con su barra, y encima de un remo con banda, una barra olímpica.
     La regla: el dibujo no puede enseñar MÁS material del que el ejercicio
     pide. Si el único disponible se pasa, ninguno — un hueco no engaña.
     Devuelve la clave del pictograma, o null. */
  function pictoDeFila(base, id, pictos, nivelPicto) {
    const e = (base.EJERCICIOS || {})[id];
    if (!e) return null;
    const lista = pictos || [];
    const clave = (e.pic && lista.indexOf(e.pic) >= 0) ? e.pic
      : (lista.indexOf(e.pat) >= 0 ? e.pat : null);
    if (!clave) return null;
    const dibuja = EQ_NIVEL[(nivelPicto || {})[clave]];
    if (dibuja === undefined) return clave;                 // pictograma sin nivel declarado: se respeta
    const pide = equipoValeId(base, id, 'nada') ? 0 : equipoValeId(base, id, 'casa') ? 1 : 2;
    return dibuja > pide ? null : clave;
  }

  /* La sustitución respeta el PATRÓN de movimiento (una bisagra se cambia por
     otra bisagra, no por una sentadilla más), no repite ejercicio dentro de la
     sesión, y tus «me gusta» del mazo van primero en la cola de candidatos. */
  function eligeSub(base, id, p, noQuiero, likes, ocupados, excluye) {
    const e = base.EJERCICIOS[id]; if (!e) return id;
    /* Cuántas veces sale ya ese ejercicio en la sesión. Acepta el Map con
       cuentas y, por compatibilidad, un Set de toda la vida. */
    const veces = k => !ocupados ? 0
      : (typeof ocupados.get === 'function' ? (ocupados.get(k) || 0) : (ocupados.has(k) ? 1 : 0));
    const cands = [];
    for (const k of Object.keys(base.EJERCICIOS)) {
      if (k === id) continue;
      const c = base.EJERCICIOS[k];
      if (!equipoValeId(base, k, p.material)) continue;
      if (noQuiero.has('ej:' + k)) continue;
      if (excluye && excluye(k)) continue;           // lo que la etapa no permite
      /* El mismo patrón no basta si cambia la zona: «aislamiento» agrupa
         rotación de hombro, encogimientos, abducción de cadera y curl femoral,
         y sin esta condición el hueco del curl femoral se llenaba con una
         rotación externa de hombro en pleno día de pierna. Es el único patrón
         que cruza zonas, así que esto no toca a ningún otro. */
      if (c.zona !== e.zona) continue;
      const mismoPat = !!(e.pat && c.pat === e.pat);
      const niv = EJ_NIVEL[k] || 1;
      if (niv > nivelTope(p)) continue;
      /* Dentro del patrón manda el músculo: el hueco del curl femoral pide
         isquiotibiales, y entre abducción de cadera (fácil) y curl nórdico
         (duro) el que sirve es el segundo. La dificultad desempata después. */
      const mismoMusc = ((e.mm && e.mm.p) || [])[0] && ((c.mm && c.mm.p) || [])[0] === ((e.mm && e.mm.p) || [])[0];
      const n = veces(k);
      /* Sin material no hay treinta variantes de cada patrón: con cinco días
         se piden más huecos de bíceps o tríceps de los que existen. Antes que
         devolver el original —una polea a quien entrena en el salón— se repite,
         pero repetir el PATRÓN que la sesión pedía va antes que coger otro
         patrón solo porque esté libre: así la sesión conserva su equilibrio. */
      cands.push([k, mismoPat ? (n ? 1 : 0) : (n ? 3 : 2), mismoMusc ? 0 : 1, niv, n]);
    }
    /* El primer hueco del patrón se lleva la versión base; el segundo, la
       progresión sin usar antes que repetir la base. Así una sesión de empuje
       sin material es flexiones y luego flexiones declinadas: la misma escalera
       que en el gimnasio hacen los kilos. */
    cands.sort((a, b) => (a[1] - b[1])            // preferencia de patrón/zona
      || (a[2] - b[2])                            // el que trabaja el mismo músculo
      || (a[3] - b[3])                            // la variante más fácil primero
      || (a[4] - b[4])                            // a igualdad, la menos repetida
      || ((likes && likes.has('ej:' + b[0]) ? 1 : 0) - (likes && likes.has('ej:' + a[0]) ? 1 : 0)));
    return cands.length ? cands[0][0] : id;       // sin nada que ofrecer: se queda
  }

  /* ---------- lesiones: qué ejercicios piden cuidado ----------
     Por PATRÓN de movimiento (la lesión no distingue barra de mancuerna),
     con listas de ids como refuerzo para los casos sin patrón claro. */
  const RIESGO_PAT = { rodilla: ['rod', 'zan'], hombro: ['ev', 'eh'], lumbar: ['bis', 'th'] };
  const RIESGO_ID = { lumbar: ['superman'] };
  const RIESGO = {
    rodilla: ['sentadilla-barra', 'zancadas', 'prensa', 'sentadilla-copa', 'extension-cuadriceps', 'sentadilla-peso'],
    hombro: ['press-banca', 'press-militar', 'fondos', 'press-inclinado', 'press-mancuernas'],
    lumbar: ['rdl-barra', 'remo-barra', 'peso-muerto', 'buenos-dias']
  };
  function tocaLesion(base, zona, ejId) {
    const e = base.EJERCICIOS[ejId] || {};
    return (RIESGO_PAT[zona] || []).includes(e.pat)
      || (RIESGO_ID[zona] || []).includes(ejId)
      || (RIESGO[zona] || []).includes(ejId);
  }
  const esCorporal = eq => /^(nada|toalla)/i.test(eq || '') && !/mochila/i.test(eq || '');

  function sesionesGen(base, p, stats, usados, sinTrote) {
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
    /* el nombre del cardio ya no cita semanas del plan del dueño:
       «Caminar-trotar S3» pasa a I/II/III */
    const wjNombre = { wj3: G.wjN1, wj4: G.wjN2, wj5: G.wjN3 };
    const et = ETAPA(p);
    for (const id of Object.keys(base.SESIONES)) {
      const s = base.SESIONES[id];
      if (!s.bloques) {
        S[id] = wjNombre[id] ? Object.assign({}, s, { nombre: wjNombre[id] }) : s;
        continue;
      }
      const c = Object.assign({}, s);
      /* En el embarazo, una sustitución (por material, lesión o gusto) no
         puede caer en algo que la etapa prohíbe: el hueco del press militar
         sin material iba al pino en la pared. La fase la dice el id de la
         sesión (emb1/emb2/emb3), que es como se sabe la semana sin reloj. */
      const faseEmbS = et === 'embarazo' ? (/^emb(\d)/.exec(id) ? +RegExp.$1 : 3) : 0;
      const excluye = et === 'embarazo' ? (k => tocaEmbarazo(base, k, faseEmbS)) : null;
      if (s.bloques.length > maxBloques) {
        c.bloques = s.bloques.slice(0, maxBloques);
        const tendon = s.bloques.find(b => b.e === 'elev-talones');
        if (tendon && !c.bloques.includes(tendon)) c.bloques[c.bloques.length - 1] = tendon;
        if (stats) stats.recorte = p.minSesion;
      }
      /* La duración anunciada es la que el usuario pidió, siempre: sin
         recorte se conservaba la del plan base («~35′» a quien pidió 45,
         justo lo contrario de lo que promete el reveal). */
      if (p.minSesion && G.durAprox) c.dur = plantilla(G.durAprox, { m: p.minSesion });
      const likes = new Set((p.gustos && p.gustos.like) || []);
      /* con cuentas, no solo presencia: el reparto de repeticiones lo necesita */
      const enSesion = new Map();
      c.bloques.forEach(b => enSesion.set(b.e, (enSesion.get(b.e) || 0) + 1));
      c.bloques = c.bloques.map(b => {
        const nb = Object.assign({}, b);
        const necesitaSub = !equipoValeId(base, b.e, p.material) || noQuiero.has('ej:' + b.e);
        if (necesitaSub) {
          const quedan = (enSesion.get(b.e) || 1) - 1;   // este bloque deja de ocupar
          if (quedan > 0) enSesion.set(b.e, quedan); else enSesion.delete(b.e);
          const sub = eligeSub(base, b.e, p, noQuiero, likes, enSesion, excluye);
          // la nota vieja hablaba del ejercicio viejo; el contador solo cuenta lo que el calendario usa
          if (sub !== b.e) {
            nb.e = sub; nb.n = null;
            if (!usados || usados.has(id)) cambiados.add(b.e);
            // de barra a peso corporal: la dosis se lee distinto y se dice
            if (esCorporalId(sub) && !esCorporalId(b.e) && G.subCorporal)
              nb.n = G.subCorporal;
            // segunda vuelta: el patrón ya salió antes en esta misma sesión
            if (enSesion.has(sub) && G.subRepe) nb.n = G.subRepe;
          }
          enSesion.set(nb.e, (enSesion.get(nb.e) || 0) + 1);
        }
        // chip de cuidado por lesión declarada (por patrón de movimiento)
        for (const z of (p.lesiones || [])) {
          if (tocaLesion(base, z, nb.e)) {
            const aviso = tpl(G.cuida, { a: lesionTxt[z] || z });
            nb.n = nb.n ? nb.n + ' · ' + aviso : aviso;
            if (stats && (!usados || usados.has(id))) stats.cuida = (stats.cuida || 0) + 1;
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
      /* sin trote en el plan, la nota del gemelo no habla de prepararlo */
      if (sinTrote && G.gemNota) {
        c.bloques = c.bloques.map(b => (b.e === 'elev-talones' && b.n)
          ? Object.assign({}, b, { n: G.gemNota }) : b);
      }
      S[id] = c;
    }
    if (stats) stats.subs = cambiados.size;
    /* el cardio del calendario puede ser «lo tuyo»: la sesión se fabrica aquí
       con los deportes que gustaron en el mazo, con textos ya localizados */
    /* natación y ciclismo piden piscina y bici, que nunca se preguntaron:
       si no hay más deportes, el cardio se queda en caminata (cam*) */
    const CON_MATERIAL = ['natacion', 'ciclismo'];
    const idsGustados = ((p.gustos && p.gustos.like) || []).filter(k => k.startsWith('dep:')).map(k => k.slice(4));
    // en el embarazo no hay «lo tuyo» con contacto, raqueta o riesgo de caída
    const idsCardio = idsGustados.filter(id => id !== 'running' && !CON_MATERIAL.includes(id)
      && !(et === 'embarazo' && EMB_DEP_NO.includes(id)));
    const deps = idsCardio.map(id => ((base.QUIZ_DEP || []).find(x => x.id === id) || {}).n).filter(Boolean);
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
  /* Semanas del plan. Si declaraste un EVENTO con fecha, manda el evento:
     el plan termina lo más cerca posible de ella (acotado a 8-48 semanas,
     que es donde el motor sabe periodizar). Antes se preguntaba el evento,
     se enseñaba en el reveal con «la fecha manda»… y no movía ni un número. */
  function semanasDe(p) {
    const et = ETAPA(p);
    if (et === 'embarazo') {
      // hasta la fecha probable de parto sin pasarse de ella, de 2 a 40 semanas
      const f = fecha(p.fpp);
      const w = f ? Math.floor((diasEntre(fechaInicio(p), f) + 1) / 7) : 12;
      return Math.min(40, Math.max(2, w));
    }
    if (et === 'posparto') {
      /* con menos de 12 semanas desde el parto (14 con cesárea) el plan es
         la recuperación hasta ahí más un bloque de 12 de construcción; con
         más, el plan de siempre */
      const wp0 = semanasPosparto(p.parto, fechaInicio(p)), c = cortesPP(p);
      if (wp0 !== null && wp0 < c[2]) return (c[2] - wp0) + 12;
    }
    const w = semanasHastaEvento(p);
    if (w) return w;
    return p.duracionSem === 24 ? 24 : p.duracionSem === 48 ? 48 : 12;
  }
  function semanasHastaEvento(p) {
    if (!p.eventoFecha) return 0;
    const ini = fechaInicio(p);
    const f = new Date(p.eventoFecha + 'T12:00:00');
    if (isNaN(f)) return 0;
    const w = Math.round((f - ini) / (7 * 864e5));
    return (w >= 8 && w <= 48) ? w : 0;      // fuera de rango: manda la duración elegida
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
    const et = ETAPA(p);
    const gustaCorrer = ((p.gustos && p.gustos.like) || []).includes('dep:running');
    // mismo criterio que la sesión: solo deportes que no exigen material extra
    const CON_MAT = ['running', 'natacion', 'ciclismo'];
    const otrosDeportes = ((p.gustos && p.gustos.like) || [])
      .filter(k => k.startsWith('dep:') && !CON_MAT.includes(k.slice(4)) && !(et === 'embarazo' && EMB_DEP_NO.includes(k.slice(4)))).length > 0;
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
    // el embarazo se queda en 2-4 días de fuerza: más no lo pide ninguna guía
    const dias = Math.min(et === 'embarazo' ? 4 : 6, Math.max(2, p.diasSemana || 4));
    const split = SPLITS[dias];
    // patrón semanal: dónde caen fuerza (F), cardio (C), opcional (O) y libre
    const PATRON_DE = {
      2: ['F0', 'C', 'libre', 'F1', 'C', 'O', 'libre'],
      3: ['F0', 'C', 'F1', 'C', 'F2', 'O', 'libre'],
      4: ['F0', 'F1', 'C', 'F2', 'F3', 'C', 'libre'],
      5: ['F0', 'F1', 'C', 'F2', 'F3', 'F4', 'libre'],
      6: ['F0', 'F1', 'F2', 'F3', 'F4', 'F5', 'libre']
    };
    const PATRON = PATRON_DE[dias];
    const ST = semanasDe(p), cortes = cortesDe(ST);
    const CAL = [];
    const ini = fechaInicio(p);
    /* Embarazo: cada semana del plan sabe su semana de gestación (por la FPP,
       no por el reloj) y de ahí salen la fase y la plantilla. El trote solo
       sigue en quien ya corría, y hasta la semana 28. */
    if (et === 'embarazo') {
      for (let w = 1; w <= ST; w++) {
        const g = semanaGestacion(p.fpp, addD(ini, (w - 1) * 7));
        const fase = faseEmb(g);
        const templ = 'emb' + Math.min(3, fase);
        const cardioEmb = (gustaCorrer && p.historial === 'activo' && g < 28) ? 'trote25' : 'cam40';
        let fIdx = 0;
        const diasSemana = PATRON.map(slot => {
          if (slot === 'libre') return 'libre';
          if (slot === 'C') return cardioEmb;
          if (slot === 'O') return { s: 'cam40', opt: true };
          return templ + (fIdx++ % 2 === 0 ? '-a' : '-b');
        });
        CAL.push({ n: w, fase, g, dias: diasSemana });
      }
      return CAL;
    }
    /* Posparto: las semanas desde el parto mandan. Recuperación (0-2),
       Reconexión (2-6) y Base (6-12) con dos semanas más por tramo si hubo
       cesárea; después, construcción con el split del perfil. El trote solo
       entra con la lista de comprobación superada. */
    if (et === 'posparto') {
      const c = cortesPP(p);
      const wp0 = semanasPosparto(p.parto, ini);
      const largo = wp0 !== null && wp0 < c[2];
      for (let w = 1; w <= ST; w++) {
        const wp = wp0 + w - 1;
        let fase, fuerza, cardioPP;
        if (largo && wp < c[0]) { fase = 1; fuerza = () => 'pp-a'; cardioPP = 'pp-paseo'; }
        else if (largo && wp < c[1]) { fase = 2; fuerza = () => 'pp-b'; cardioPP = 'cam40'; }
        else if (largo && wp < c[2]) { fase = 3; fuerza = i => i % 2 === 0 ? 'c-a' : 'c-b'; cardioPP = 'cam40'; }
        else {
          fase = largo ? 4 : faseDe(w, cortes);
          const enCasa = !largo && fase === 1 && p.historial !== 'activo';
          fuerza = i => enCasa ? (i % 2 === 0 ? 'c-a' : 'c-b') : split[i % split.length];
          const base2 = cardio(largo ? 3 : fase);
          cardioPP = (p.correrOk || !/^(wj|trote)/.test(base2)) ? base2 : (fase <= 2 ? 'cam40' : 'cam60');
        }
        let fIdx = 0;
        // en recuperación, tres sesiones cortas como mucho; el resto, lo pedido
        const patron = (largo && fase === 1) ? PATRON_DE[Math.min(3, dias)] : PATRON;
        const diasSemana = patron.map(slot => {
          if (slot === 'libre') return 'libre';
          if (slot === 'C') return cardioPP;
          if (slot === 'O') return { s: cardioPP, opt: true };
          return fuerza(fIdx++);
        });
        CAL.push({ n: w, fase, wp, dias: diasSemana, descarga: (!largo && w % 9 === 0 && w < ST) || undefined });
      }
      return CAL;
    }
    for (let w = 1; w <= ST; w++) {
      const fase = faseDe(w, cortes);
      // reactivación en casa al principio, salvo quien ya entrena
      const enCasa = fase === 1 && p.historial !== 'activo';
      let fIdx = 0;
      const diasSemana = PATRON.map(slot => {
        if (slot === 'libre') return 'libre';
        if (slot === 'C') return cardio(fase);
        if (slot === 'O') return { s: cardio(fase), opt: true };
        const i = fIdx++;
        /* Los circuitos son la REACTIVACIÓN (fase 1), no el plan entero: sin
           material se quedaban puestos las doce semanas, con siete patrones de
           trece y la app anunciando cuatro fases. Ahora sube al mismo reparto
           que los demás y cada ejercicio se sustituye por su versión corporal. */
        if (enCasa) return i % 2 === 0 ? 'c-a' : 'c-b';
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
  function hitosGen(base, p, nutri, cal) {
    const G = base.UI.gen || {};
    const ST = semanasDe(p), cortes = cortesDe(ST);
    const fmt = n => n.toLocaleString(base.UI.lang || 'es');
    const H = {};
    const et = ETAPA(p);
    /* Las etapas tienen hitos propios, por semana de gestación o desde el
       parto, y ninguno de los del plan normal: ni descarga, ni diet break,
       ni cribado (ese ya lo lleva su obstetra). */
    if (et === 'embarazo') {
      const E = G.emb || {};
      (cal || []).forEach(wk => {
        [[14, 'hito14'], [16, 'hito16'], [28, 'hito28'], [36, 'hito36']].forEach(par => {
          if (wk.g === par[0] && E[par[1] + 'T']) H[wk.n] = { t: E[par[1] + 'T'], d: E[par[1] + 'D'], tipo: 'emb' };
        });
      });
      return H;
    }
    if (et === 'posparto') {
      const P = G.pp || {}, c = cortesPP(p);
      (cal || []).forEach(wk => {
        if (wk.wp === 6 && P.hito6T) H[wk.n] = { t: P.hito6T, d: P.hito6D, tipo: 'pp' };
        if (wk.wp === 8 && p.partoTipo === 'cesarea' && P.hito8T) H[wk.n] = { t: P.hito8T, d: P.hito8D, tipo: 'pp' };
        if (wk.wp === c[2] && P.hito12T) H[wk.n] = { t: P.hito12T, d: P.hito12D, tipo: 'pp' };
      });
      return H;
    }
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
    const fmt = n => n.toLocaleString(base.UI.lang || 'es');
    const et = ETAPA(p);
    /* Etapa: el gasto se calcula sobre el peso que toca (el previo al
       embarazo) y las tres filas de la tabla no son fases del plan sino
       tramos de la etapa. `filaDeFase` dice qué fila lee cada fase. */
    const pRef = et === 'embarazo' ? Object.assign({}, p, { pesoKg: pesoPreDe(p) }) : p;
    const bmr = Math.round(mifflin(pRef) / 10) * 10;
    const t = Math.round(tdee(pRef) / 10) * 10;
    let k = kcalObjetivo(p);
    let m = macros(p, k);
    let filas = [k, k + 50, k + 100].map(v => ({ kcal: v, p: m.p, g: m.g }));   // leve subida con el volumen
    let filaDeFase = [0, 0, 1, 2], etiquetas = null, notas = null;
    const E = G.emb || {}, P = G.pp || {};
    let extraPP = 0, defPP = 0, lact = false;
    if (et === 'embarazo') {
      /* EFSA 2013: +70, +260 y +500 kcal por trimestre sobre el gasto previo.
         Proteína: 1,4 g/kg de peso previo y 1,6 en el tercero, por encima de
         la necesidad media medida (1,22 y 1,52; Stephens 2015). Sin déficit. */
      const pp = pesoPreDe(p);
      filas = [70, 260, 500].map((v, i) => ({ kcal: Math.round((t + v) / 5) * 5, p: Math.round(pp * (i === 2 ? 1.6 : 1.4)), g: Math.round(pp * 0.9), inc: v }));
      filaDeFase = [0, 1, 2, 2];
      const g0 = semanaGestacion(p.fpp, fechaInicio(p)) || 1;
      const i0 = filaDeFase[faseEmb(g0) - 1];
      k = filas[i0].kcal; m = { p: filas[i0].p, g: filas[i0].g, c: 0 };
      etiquetas = [E.fila1, E.fila2, E.fila3]; notas = [E.nota1, E.nota2, E.nota3];
    } else if (et === 'posparto') {
      /* Lactancia: +450 kcal los seis primeros meses (entre EFSA +500 y NASEM
         +400) y +300 después; proteína 1,6 g/kg. El déficit, si lo hay,
         espera a la semana 6 y no pasa de 500 (Lovelady 2000), con suelo de
         1.800 kcal mientras dure la lactancia. */
      const c = cortesPP(p);
      const wp0 = semanasPosparto(p.parto, fechaInicio(p)) || 0;
      lact = !!p.lactancia;
      extraPP = lact ? (wp0 < 26 ? 450 : 300) : 0;
      defPP = p.objetivo === 'perder' ? 500 : p.objetivo === 'recomp' ? 400 : 0;
      const suelo = v => Math.max(v, lact ? 1800 : Math.max(mifflin(p) * 1.05, t * 0.75));
      const conDef = Math.round(suelo(t + extraPP - defPP) / 5) * 5, sinDef = Math.round(suelo(t + extraPP) / 5) * 5;
      const prot = lact ? Math.round(p.pesoKg * 1.6) : m.p;
      const largo = wp0 < c[2];
      filas = (largo ? [sinDef, conDef, conDef + 50] : [conDef, conDef + 50, conDef + 100]).map(v => ({ kcal: v, p: prot, g: m.g }));
      k = filas[0].kcal; m = { p: prot, g: m.g, c: 0 };
      if (largo) etiquetas = [P.fila1, P.fila2, P.fila3];
    }
    N.filaDeFase = filaDeFase;
    // la toma mínima por comida sale de TU proteína, no de la del dueño
    const qMin = Math.max(20, Math.round(m.p / 4 * 0.85 / 5) * 5);
    if (N.tomas) N.tomas = tpl(N.tomas, { q: qMin });
    // las dos plantillas que se colaban crudas o con el 12 del dueño
    if (N.escalado) N.escalado = tpl((et === 'embarazo' && E.escalado) || (et === 'posparto' && lact && P.escalado) || N.escalado, { p: m.p });
    if (N.comidaLibre) N.comidaLibre = tpl((et === 'embarazo' && E.comidaLibre) || (et === 'posparto' && P.comidaLibre) || N.comidaLibre, { s: semanasDe(p) });
    if (et === 'embarazo' && E.hidratacion) N.hidratacion = E.hidratacion;
    if (et === 'posparto' && P.hidratacion) N.hidratacion = P.hidratacion;
    /* la guía del plato y el suplemento proteico respetan la dieta declarada:
       a un vegano no se le receta pollo ni whey con skyr */
    if (N.plato && N.plato.length) {
      if (p.dieta === 'vegano' && G.platoVegano) N.plato[0].d = G.platoVegano;
      else if (p.dieta === 'vegetariano' && G.platoVegetariano) N.plato[0].d = G.platoVegetariano;
      else if (et === 'embarazo' && E.plato) N.plato[0].d = E.plato;
    }
    if (N.suplementos && N.suplementos.length > 1 && (p.dieta === 'vegano' || (p.sin || []).includes('lactosa')) && G.suplVegT) {
      /* el id cambia TAMBIEN, no solo el texto: la foto de la ficha se busca
         por id (assets/supl/<id>.webp), asi que heredando el de whey el texto
         diria «proteina de guisante» junto a un bote de suero de leche */
      N.suplementos[1] = Object.assign({}, N.suplementos[1],
        { id: 'prote-vegetal', t: G.suplVegT, d: G.suplVegD });
    }
    // en el embarazo y con lactancia la lista de suplementos es otra (y la creatina, fuera)
    if (et === 'embarazo' && Array.isArray(E.supl) && E.supl.length) N.suplementos = E.supl.map(x => Object.assign({}, x));
    if (et === 'posparto' && lact && Array.isArray(P.supl) && P.supl.length) N.suplementos = P.supl.map(x => Object.assign({}, x));
    if (N.calorias && N.calorias.length >= 3) {
      N.calorias[0].v = '~' + fmt(bmr) + ' kcal';
      N.calorias[0].n = tpl(G.datos, { p: Math.round(pRef.pesoKg), a: Math.round(p.alturaCm), e: p.edad });
      N.calorias[1].v = fmt(t - 80) + '–' + fmt(t + 80) + ' kcal';
      N.calorias[2].v = fmt(k - 75) + '–' + fmt(k + 75) + ' kcal';
      /* «Déficit ~550-700» era la fila del dueño: la nota y el ritmo esperado
         hablan del objetivo REAL, con el corredor real */
      if (et === 'embarazo' && E.kcalNota) N.calorias[2].n = tpl(E.kcalNota, { t: etiquetas[filaDeFase[faseEmb(semanaGestacion(p.fpp, fechaInicio(p)) || 1) - 1]] || '', k: filas.find(f => f.kcal === k).inc });
      else if (et === 'posparto' && lact && P.kcalNotaLact) N.calorias[2].n = tpl(P.kcalNotaLact, { k: extraPP, d: defPP ? tpl(P.defTxt, { v: defPP }) : '' });
      else if (et === 'posparto' && P.kcalNota) N.calorias[2].n = tpl(P.kcalNota, { d: defPP ? tpl(P.defTxt, { v: defPP }).replace(/^,\s*/, '') : (P.mantTxt || '') });
      else if (p.objetivo === 'recomp' && G.numRecomp) N.calorias[2].n = G.numRecomp;
      else if (p.objetivo === 'ganar' && G.numSup) N.calorias[2].n = G.numSup;
      else if (p.objetivo === 'mantener' && G.numMan) N.calorias[2].n = G.numMan;
      if (N.calorias.length >= 4 && et === 'embarazo') {
        /* la fila del ritmo es de ganancia: la de IOM 2009 para el IMC previo */
        const pp = pesoPreDe(p), imc = pp / Math.pow(p.alturaCm / 100, 2);
        const r = ritmoIOM(imc), g = iomDe(imc);
        const r05 = v => (Math.round(v * 20) / 20).toLocaleString(base.UI.lang || 'es');
        if (E.ritmoT) N.calorias[3].c = E.ritmoT;
        N.calorias[3].v = tpl(E.ritmoV || '+{a}–{b} kg/sem', { a: r05(r[0]), b: r05(r[1]) });
        if (E.ritmoN) N.calorias[3].n = tpl(E.ritmoN, { imc: (Math.round(imc * 10) / 10).toLocaleString(base.UI.lang || 'es'), g: g[1].toLocaleString(base.UI.lang || 'es') + '–' + g[2].toLocaleString(base.UI.lang || 'es') });
      } else if (N.calorias.length >= 4) {
        const obj = objetivoKgDe(p), ST = semanasDe(p);
        const r = (p.pesoKg - (Math.min(obj[0], obj[1]) + Math.max(obj[0], obj[1])) / 2) / ST;
        const r05 = v => (Math.round(Math.abs(v) * 20) / 20).toLocaleString(base.UI.lang || 'es');
        if (r > 0.05) {
          N.calorias[3].v = r05(r * 0.85) + '–' + r05(r * 1.15) + ' kg/sem';
        } else if (r < -0.05) {
          if (G.ritmoSubeT) N.calorias[3].c = G.ritmoSubeT;
          N.calorias[3].v = '+' + r05(r * 0.8) + '–' + r05(r * 1.2) + ' kg/sem';
          if (G.ritmoSubeN) N.calorias[3].n = G.ritmoSubeN;
        } else {
          if (G.ritmoManT) N.calorias[3].c = G.ritmoManT;
          N.calorias[3].v = '±' + r05(0.3) + ' kg/sem';
          if (G.ritmoManN) N.calorias[3].n = G.ritmoManN;
        }
      }
    }
    if (N.fases && N.fases.length) {
      const ST = semanasDe(p), cortes = cortesDe(ST);
      const recorta = !et && (p.objetivo === 'perder' || p.objetivo === 'recomp');
      const wBreak = Math.round(ST * 7 / 12);
      N.fases.forEach((f, i) => {
        const fila = filas[Math.min(i, filas.length - 1)];
        f.kcal = fila.kcal; f.p = fila.p; f.g = fila.g;
        f.c = Math.max(0, Math.round((fila.kcal - fila.p * 4 - fila.g * 9) / 4));
        // las etiquetas de rango dicen las semanas REALES de este plan (o el tramo de la etapa)
        f.f = (etiquetas && etiquetas[i]) || tpl(G['nf' + (i + 1)] || f.f, { a: cortes[1], b: cortes[1] + 1, c: cortes[2], d: cortes[2] + 1, e: ST });
        // la nota del diet break: solo si el plan recorta, y en su semana real
        if (notas && notas[i]) f.nota = notas[i];
        else if (i === 1) {
          if (recorta) f.nota = tpl(G.dietBreakNota || f.nota, { w: wBreak, k: fmt(t - t % 100) });
          else delete f.nota;
        } else delete f.nota;
      });
    }
    return { NUTRI: N, kcal: k, prot: m.p, tdee: t, qMin, extra: extraPP, deficit: defPP };
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
    const like = new Set((p.gustos && p.gustos.like) || []);
    /* Los «me gusta» del mazo pesan: los platos que marcaste van primero en
       la cola de sustitución. Antes el mazo pedía 10 decisiones de comida y
       el menú solo usaba los descartes — la mitad del gesto se perdía. */
    const pool = { de: [], co: [], ce: [] };
    base.RECETAS.forEach(r => { if (pool[r.slot] && recetaVale(r, p, noQuiero)) pool[r.slot].push(r.id); });
    ['de', 'co', 'ce'].forEach(sl => pool[sl].sort((a, b) =>
      (like.has('com:' + b) ? 1 : 0) - (like.has('com:' + a) ? 1 : 0)));
    const idx = { de: 0, co: 0, ce: 0 };
    // y un plato no se repite mientras queden alternativas sin usar esa semana
    const usados = { de: new Set(), co: new Set(), ce: new Set() };
    const MENU = base.MENU.map(fila => {
      const f = Object.assign({}, fila);
      ['de', 'co', 'ce'].forEach(slot => {
        const id = f[slot];
        if (id === 'LIBRE') return;
        const r = base.RECETAS.find(x => x.id === id);
        const alt = pool[slot];
        const sirve = r && recetaVale(r, p, noQuiero);
        // la de serie vale y no está repetida: se queda
        if (sirve && !usados[slot].has(id)) { usados[slot].add(id); return; }
        const libres = alt.filter(x => !usados[slot].has(x));
        const cola = libres.length ? libres : alt;
        if (cola.length) { const el2 = cola[idx[slot] % cola.length]; f[slot] = el2; usados[slot].add(el2); idx[slot]++; }
        else if (!sirve) avisos++;   // se queda la original, pero se cuenta y se avisa
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
  /* Lee la cantidad tal como la escriben las recetas, que no es un numero y
     una unidad y ya: «1 ud (120 g)», «2 latas (120 g escurrido)», «250 g
     crudo (~200 g hecho)», «170-180 g», «½ ud», «1 cazo (30 g)», «3».
     Reglas, en orden:
       · un rango «170-180 g» se lee por arriba: se compra para que llegue;
       · «N ud/pieza/diente» al principio manda sobre lo que venga entre
         parentesis («2 ud (o 100 ml envasadas)» son 2 unidades);
       · «N latas/rebanadas/cazos» se leen por los gramos del parentesis,
         que es lo que pesa de verdad;
       · si no, el primer «N g/ml» que aparezca («250 g crudo (~200 g hecho)»
         son 250 g: se compra crudo);
       · un numero a secas son piezas («3» huevos);
       · lo demas («al gusto», «pizca», «bol») no se suma. */
  function parseQ(q) {
    const s = String(q || '').replace(/,/g, '.').replace(/½/g, '0.5').replace(/¼/g, '0.25').replace(/¾/g, '0.75').trim();
    const norm = (n, u) => { u = u.toLowerCase(); if (u === 'kg') { n *= 1000; u = 'g'; } if (u === 'l') { n *= 1000; u = 'ml'; } return { n, u }; };
    const rango = /^(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*(kg|g|ml|l)\b/i.exec(s);
    if (rango) return norm(parseFloat(rango[2]), rango[3]);
    const pieza = /^(\d+(?:\.\d+)?)\s*(ud|uds|pieza|piezas|diente|dientes|lata|latas|cazo|cazos|rebanada|rebanadas)?\s*(\(|$)/i.exec(s);
    const gramos = /(\d+(?:\.\d+)?)\s*(kg|g|ml|l)\b/i.exec(s);
    if (pieza && pieza[2]) {
      if (/lata|rebanada|cazo/i.test(pieza[2]) && gramos) return norm(parseFloat(gramos[1]), gramos[2]);
      return { n: parseFloat(pieza[1]), u: 'ud' };
    }
    if (gramos) return norm(parseFloat(gramos[1]), gramos[2]);
    if (pieza) return { n: parseFloat(pieza[1]), u: 'ud' };
    return null;
  }
  function fmtQ(n, u, lang) {
    const loc = lang || 'es';
    if (u === 'g' && n >= 1000) return (Math.round(n / 100) / 10).toLocaleString(loc) + ' kg';
    if (u === 'ml' && n >= 1000) return (Math.round(n / 100) / 10).toLocaleString(loc) + ' l';
    const v = Math.round(n * 10) / 10;
    return v.toLocaleString(loc) + (u ? ' ' + u : '');
  }
  /* ---------- la compra de la semana ----------
     Una lista para ir al super, no un volcado de las recetas. Se agrupa por
     PRODUCTO (pid) en toda la semana, no por texto ni por comida: el tomate
     es un tomate salga en rodajas en la cena o rallado en el desayuno, y se
     compra una vez con la suma de todo. Lo de «en rodajas» es cosa de la
     receta, y en su ficha se queda.

     Lo que llega en gramos se suma con gramos; lo que llega en piezas, con
     piezas; y si un producto llega de las dos formas, las piezas pasan a
     gramos con PESO_UD y se enseña un numero con las piezas al lado, que es
     lo que un comprador entiende («≈ 900 g · 6 ud»).

     La despensa (sal, especias, aceite...) sale una vez y sin cantidad:
     nadie compra 43 g de aceite, se compra una botella cuando se acaba.

     Y la toma pre-sueño, que es diaria y antes ni entraba, entra por siete. */
  const PESO_UD = { tomate: 150, platano: 120, huevos: 60, claras: 35, cebolla: 150, pimiento: 180,
    limon: 100, zanahoria: 100, fruta: 150, skyr: 150, aguacate: 200, calabacin: 250, patata: 150,
    pepino: 300, atun: 60 };
  const DESPENSA = new Set(['sal', 'especias', 'aove', 'canela', 'salsa-soja', 'tamari', 'levadura', 'ajo']);
  const SECCION_DE = {};
  [['fresco', ['aguacate', 'ajo', 'brocoli', 'calabacin', 'calabaza', 'cebolla', 'champinones', 'cilantro', 'espinacas',
      'fruta', 'hummus', 'lechuga', 'limon', 'patata', 'pepino', 'pimiento', 'platano', 'tomate', 'verduras', 'zanahoria']],
   ['prote', ['pollo', 'ternera', 'merluza', 'salmon', 'atun', 'huevos', 'claras', 'tofu', 'tempeh', 'soja-text']],
   ['lacteo', ['skyr', 'yogur-soja', 'bebida-soja']],
   ['despensa', ['arroz', 'quinoa', 'pasta-lentejas', 'lentejas', 'lentejas-rojas', 'garbanzos', 'alubias', 'avena',
      'harina-garbanzo', 'pan', 'pan-sg', 'nueces', 'pipas', 'sesamo', 'chia', 'aceitunas', 'tomate-triturado', 'caldo',
      'leche-coco', 'salsa-soja', 'tamari', 'levadura', 'canela', 'especias', 'sal', 'aove']],
   ['congelado', ['gambas', 'edamame', 'frutos-rojos']],
   ['supl', ['whey', 'prote-vegetal']]
  ].forEach(par => par[1].forEach(pid => { SECCION_DE[pid] = par[0]; }));
  const ORDEN_SEC = ['fresco', 'prote', 'lacteo', 'despensa', 'congelado', 'supl'];

  function compraGen(base, MENU, vetaLacteo) {
    const lang = base.UI.lang;
    const nombres = base.PRODUCTOS || {};
    const veces = {};
    MENU.forEach(f => ['de', 'co', 'ce'].forEach(sl => { if (f[sl] !== 'LIBRE') veces[f[sl]] = (veces[f[sl]] || 0) + 1; }));
    const bolsa = {};                       // pid -> acumulador
    const mete = (ing, n) => {
      const pid = ing.pid; if (!pid) return;
      const e = bolsa[pid] || (bolsa[pid] = { pid, g: 0, ml: 0, ud: 0, texto: null, primer: ing.i });
      const q = parseQ(ing.q);
      if (!q) { if (!e.texto) e.texto = ing.q; return; }
      if (q.u === 'g') e.g += q.n * n;
      else if (q.u === 'ml') e.ml += q.n * n;
      else e.ud += q.n * n;
    };
    Object.keys(veces).forEach(id => {
      const r = base.RECETAS.find(x => x.id === id); if (!r) return;
      (r.ing || []).forEach(ing => mete(ing, veces[id]));
    });
    /* la toma pre-sueño: diaria, luego por siete. Con lacteos vetados, el plan
       receta yogur de soja y proteina vegetal (suplVegD), y eso es lo que se
       compra; no hay receta aparte porque no hay nada que cocinar. */
    const noche = base.RECETAS.find(x => x.id === 'toma-noche');
    if (noche && !vetaLacteo) (noche.ing || []).forEach(ing => mete(ing, 7));
    else if (vetaLacteo) { mete({ pid: 'yogur-soja', q: '250 g', i: '' }, 7); mete({ pid: 'prote-vegetal', q: '30 g', i: '' }, 7); }

    /* Las piezas se redondean hacia ARRIBA y a enteros: nadie compra medio
       limon, y quedarse corto es peor que sobrar una pieza. Los gramos que
       salen de convertir piezas se redondean a decenas: «322,5 g» de cebolla
       es una precision que la bascula del super no tiene. */
    const fmtUd = n => Math.ceil(n - 1e-9).toLocaleString(lang || 'es') + ' ud';
    const cantidad = e => {
      if (DESPENSA.has(e.pid)) return '';
      const peso = PESO_UD[e.pid];
      if (e.ud > 0 && e.g > 0 && peso) {
        const total = Math.round((e.g + e.ud * peso) / 10) * 10;
        return '≈ ' + fmtQ(total, 'g', lang) + ' · ' + fmtUd(total / peso);
      }
      const partes = [];
      if (e.g > 0) partes.push(fmtQ(e.g, 'g', lang));
      if (e.ml > 0) partes.push(fmtQ(e.ml, 'ml', lang));
      if (e.ud > 0) partes.push(fmtUd(e.ud));
      if (partes.length) return partes.join(' + ');
      return e.texto || '';
    };
    const nombre = e => nombres[e.pid] || e.primer || e.pid;

    const porSec = {};
    Object.values(bolsa).forEach(e => {
      const sec = SECCION_DE[e.pid] || 'despensa';
      (porSec[sec] = porSec[sec] || []).push({ pid: e.pid, i: nombre(e), q: cantidad(e), despensa: DESPENSA.has(e.pid) });
    });
    const etiquetas = base.UI.secCompra || {};
    return ORDEN_SEC.filter(sec => porSec[sec] && porSec[sec].length).map(sec => ({
      sec, cat: etiquetas[sec] || sec,
      // lo que se compra primero; la despensa, al final de su seccion
      items: porSec[sec].sort((a, b) => (a.despensa - b.despensa) || a.i.localeCompare(b.i, lang || 'es'))
    }));
  }
  /* cuánta proteína REAL da el menú medio del día: el hueco hasta el objetivo
     se enseña con su puente, en vez de fingir que las cifras cuadran solas */
  function protMenuMedia(base, MENU, vetaLacteo) {
    let total = 0;
    MENU.forEach(f => ['de', 'co', 'ce'].forEach(sl => {
      const r = base.RECETAS.find(x => x.id === f[sl]);
      if (r && r.macros) total += r.macros.p;
      else if (f[sl] === 'LIBRE') total += 35;    // estimación honesta de la comida libre
    }));
    const noche = base.RECETAS.find(x => x.id === 'toma-noche');
    total += 7 * (vetaLacteo ? 40 : (noche && noche.macros ? noche.macros.p : 45));
    return Math.round(total / 7);
  }

  /* Media de kcal del día según los platos prescritos: el menú se arma con
     recetas de tamaño fijo, así que casi nunca cuadra al dígito con el
     objetivo. En vez de callarlo (el usuario suma y ve el desfase), se
     calcula y la vista lo enseña con su puente. */
  function kcalMenuMedia(base, MENU, vetaLacteo) {
    let total = 0;
    MENU.forEach(f => ['de', 'co', 'ce'].forEach(sl => {
      const r = base.RECETAS.find(x => x.id === f[sl]);
      if (r && r.macros) total += r.macros.kcal;
      else if (f[sl] === 'LIBRE') total += 800;    // estimación honesta de la comida libre
    }));
    const noche = base.RECETAS.find(x => x.id === 'toma-noche');
    total += 7 * (vetaLacteo ? 230 : (noche && noche.macros ? noche.macros.kcal : 270));
    return Math.round(total / 7 / 5) * 5;
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
  /* El corredor de peso en un solo sitio: lo usan metaGen (la meta), nutriGen
     (el ritmo esperado) y las gráficas a través de META. */
  function objetivoKgDe(p) {
    const ST = semanasDe(p);
    if (ETAPA(p) === 'embarazo') {
      // el objetivo es el corredor de ganancia de IOM 2009 al final del plan
      const pp = pesoPreDe(p), imc = pp / Math.pow(p.alturaCm / 100, 2);
      const gFin = semanaGestacion(p.fpp, addD(fechaInicio(p), ST * 7 - 1)) || 40;
      const e = gananciaEsperada(imc, gFin);
      return [Math.round((pp + e[0]) * 10) / 10, Math.round((pp + e[1]) * 10) / 10];
    }
    const kg = p.pesoKg, f = ST / 12;
    const pctPerder = Math.min(0.20, 0.0067 * ST);
    return p.objetivo === 'perder' ? [Math.round(kg * (1 - pctPerder) - 1), Math.round(kg * (1 - pctPerder))]
      : p.objetivo === 'recomp' ? [Math.round(kg - 4 * Math.min(2, f)), Math.round(kg - 2 * Math.min(2, f))]
      : p.objetivo === 'ganar' ? [Math.round(kg + 1 * f), Math.round(kg + Math.min(10, 3 * f))]
      : [Math.round(kg - 1), Math.round(kg + 1)];
  }

  function metaGen(base, p, prot) {
    const M = JSON.parse(JSON.stringify(base.META));
    const ini = fechaInicio(p);
    const ST = semanasDe(p);
    M.inicioISO = iso(ini);
    M.finISO = iso(addD(ini, ST * 7 - 1));
    M.semanas = ST;
    M.abierto = p.duracionSem === 0 || undefined;   // «sin fecha»: bloque renovable
    M.evento = p.evento || null;
    M.eventoFecha = p.eventoFecha || null;
    M.eventoManda = !!semanasHastaEvento(p);
    M.franja = p.franja || null;
    M.dieta = p.dieta || 'normal';
    M.sin = (p.sin || []).slice();
    M.objetivo = p.objetivo || 'mantener';
    M.historial = p.historial || 'retomador';
    M.material = p.material || 'gym';
    M.gustosNo = ((p.gustos && p.gustos.no) || []).slice();
    M.cinturaDeclarada = !!p.cinturaCm;
    M.perfil.pesoSalida = p.pesoKg;
    M.perfil.alturaCm = p.alturaCm;
    M.perfil.proteinaDia = prot;
    // el objetivo escala con la duración real, con techos sensatos (objetivoKgDe)
    M.perfil.objetivoKg = objetivoKgDe(p);
    /* La métrica reina siempre tiene meta: con cintura declarada, bajar 6 cm
       sin pasar de la mitad de la estatura (que es el umbral con evidencia);
       sin cintura declarada, la mitad de la estatura a secas. */
    const mitad = Math.round(p.alturaCm / 2);
    M.perfil.cinturaMetaCm = p.cinturaCm
      ? Math.min(Math.round(p.cinturaCm) - 2, Math.max(mitad, Math.round(p.cinturaCm) - 6))
      : mitad;
    /* Etapa: lo que las vistas necesitan saber sin volver a calcular. En el
       embarazo la cintura no mide nada durante nueve meses: sin meta. */
    const et = ETAPA(p);
    M.etapa = et;
    if (et === 'embarazo') {
      const pp = pesoPreDe(p), imc = pp / Math.pow(p.alturaCm / 100, 2), r = iomDe(imc);
      M.fpp = p.fpp; M.pesoPre = pp; M.imcPre = Math.round(imc * 10) / 10;
      M.ganancia = [r[1], r[2]];
      M.ritmo = ritmoIOM(imc).map(v => Math.round(v * 100) / 100);
      M.gInicio = semanaGestacion(p.fpp, ini);
      M.perfil.cinturaMetaCm = null; M.cinturaDeclarada = false;
    }
    if (et === 'posparto') {
      M.parto = p.parto; M.cesarea = p.partoTipo === 'cesarea'; M.lactancia = !!p.lactancia;
      M.wpInicio = semanasPosparto(p.parto, ini); M.cortesPP = cortesPP(p);
      M.correrOk = !!p.correrOk; M.spSintomas = Array.isArray(p.sp) && p.sp.length > 0;
    }
    M.ciclo = (p.ciclo && p.ciclo.modo) ? Object.assign({}, p.ciclo) : null;
    return { META: M, ini };
  }
  function fasesGen(base, ini, p, cal) {
    const meses = base.UI.meses, G = base.UI.gen || {};
    const ST = semanasDe(p), cortes = cortesDe(ST);
    /* Etapa: las cuatro fases son las de la etapa y sus semanas las dice el
       calendario (por semana de gestación o desde el parto). Una fase que el
       plan ya no pisa se queda sin semanas y sin fechas, y las vistas la
       tratan como pasada. */
    const et = ETAPA(p);
    const largoPP = et === 'posparto' && (semanasPosparto(p.parto, ini) || 0) < cortesPP(p)[2];
    const src = et === 'embarazo' ? base.FASES_EMB : largoPP ? base.FASES_PP : null;
    if (src && src.length === 4) {
      return src.map((f, i) => {
        const c = Object.assign({}, f);
        c.semanas = (cal || []).filter(wk => wk.fase === i + 1).map(wk => wk.n);
        if (c.semanas.length) {
          const a = addD(ini, (c.semanas[0] - 1) * 7), b = addD(ini, c.semanas[c.semanas.length - 1] * 7 - 1);
          c.fechas = corta(a, meses) + ' – ' + corta(b, meses);
        } else c.fechas = '—';
        return c;
      });
    }
    const dias = Math.min(6, Math.max(2, p.diasSemana || 4));
    const splitTxt = dias <= 3 ? G.splitFbC : dias === 4 ? G.splitTpC : G.splitPplC;
    const rangos = [[1, cortes[0]], [cortes[0] + 1, cortes[1]], [cortes[1] + 1, cortes[2]], [cortes[2] + 1, ST]];
    /* nombre y objetivo de fase por historial: «Reactivación» y la memoria
       muscular son del que vuelve; quien empieza construye cimientos y quien
       ya entrena hace base. La fase 4 es común (ya lleva {d}). */
    const VAR = p.historial === 'nunca' ? [
      { n: G.f1nNunca, o: G.f1oNunca }, { n: G.f2nNunca, o: G.f2oNunca }, { o: G.f3oNunca }, {}
    ] : p.historial === 'activo' ? [
      { n: G.f1nActivo, o: G.f1oActivo }, { n: G.f2nActivo, o: G.f2oActivo }, { o: G.f3oActivo }, {}
    ] : [{}, {}, {}, {}];
    /* la F2 base del retomador dice «Entrada al gym … con barra»: sin gimnasio,
       la fase 2 habla de TU material */
    if (p.historial === 'retomador' && p.material !== 'gym') {
      VAR[1] = p.material === 'nada'
        ? { n: G.f2nNada, o: G.f2oNada }
        : { n: G.f2nCasa, o: G.f2oCasa };
    }
    const minTxt = p.minSesion <= 30 ? '~30' : p.minSesion <= 45 ? '~45' : '60-75';
    return base.FASES.map((f, i) => {
      const c = Object.assign({}, f);
      const semanas = [];
      for (let w = rangos[i][0]; w <= rangos[i][1]; w++) semanas.push(w);
      c.semanas = semanas;
      const a = addD(ini, (semanas[0] - 1) * 7);
      const b = addD(ini, semanas[semanas.length - 1] * 7 - 1);
      c.fechas = corta(a, meses) + ' – ' + corta(b, meses);
      if (VAR[i].n) c.nombre = VAR[i].n;
      if (VAR[i].o) c.objetivo = VAR[i].o;
      /* el sub deja de describir la progresión del dueño: F1 conserva su
         «en casa» solo si de verdad se reactiva en casa; el resto lleva el
         split real del perfil */
      const enCasa = i === 0 && p.historial !== 'activo';
      if (!enCasa) c.sub = plantilla(G.faseSub, { s: splitTxt, d: dias });
      c.objetivo = plantilla(c.objetivo, { d: dias, min: minTxt });
      return c;
    });
  }

  /* El bloque de seguridad también se genera: se queda lo que TU plan usa
     (rodilla si hay pierna cargada, tibial solo si corres, codo solo si hay
     volumen de torso con material) y entra el de la lesión que declaraste.
     Era el único bloque que seguía siendo del dueño — justo el del riesgo. */
  function tendonGen(base, p, tieneTrote) {
    const G = base.UI.gen || {};
    // en el embarazo y el posparto el seguro del plan es el suelo pélvico
    if (ETAPA(p) && base.SUELO_PELVICO) return JSON.parse(JSON.stringify(base.SUELO_PELVICO));
    const T = JSON.parse(JSON.stringify(base.TENDON));
    if (!tieneTrote && G.tendonSinTrote) T.intro = G.tendonSinTrote;
    const les = p.lesiones || [];
    const conMaterial = p.material !== 'nada';
    T.bloques = (T.bloques || []).filter(b => {
      if (b.id === 'tendon-tibial') return tieneTrote;                       // es «antes de cada trote»
      if (b.id === 'tendon-codo') return conMaterial && p.historial !== 'nunca';
      if (b.id === 'tendon-rodilla') return !les.includes('hombro') || les.includes('rodilla') || true;
      return true;
    });
    // el hombro declarado tiene su propio bloque: manguito y serrato con banda
    if (les.includes('hombro') && G.tHombroT) {
      T.bloques.unshift({ id: 'tendon-hombro', nombre: G.tHombroT,
        donde: G.tHombroW, detalle: G.tHombroD });
    }
    return T;
  }

  /* ---------- superficies que eran del dueño: ahora salen del perfil ----------
     Todo lo que enseñe un número tiene que poder defenderlo: checkpoints,
     fotos, reglas, ciencia, carrera y logros se regeneran con tus datos. */
  const plantilla = (s, o) => String(s || '').replace(/\{(\w+)\}/g, (m, k) => o[k] !== undefined ? o[k] : m);

  function checkpointsGen(base, M, ini) {
    const G = base.UI.gen || {};
    if (M.etapa === 'embarazo') {
      /* el corredor de ganancia de IOM 2009 en la semana de gestación de cada
         checkpoint, sobre el peso previo al embarazo */
      const st = M.semanas || 12, r1 = v => Math.round(v * 10) / 10;
      const semanas = [Math.round(st / 3), Math.round(st * 2 / 3), st].filter((s, i, a) => s >= 1 && a.indexOf(s) === i);
      return semanas.map(s => {
        const g = semanaGestacion(M.fpp, addD(ini, s * 7 - 1)) || 40;
        const e = gananciaEsperada(M.imcPre, g);
        return { sem: s, fecha: iso(addD(ini, s * 7 - 1)), rango: [r1(M.pesoPre + e[0]), r1(M.pesoPre + e[1])],
          si: (G.emb && G.emb.chkD) || '', dir: 'sube', g };
      });
    }
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
  function reglasGen(base, prot, p) {
    const G = base.UI.gen || {};
    const q = Math.max(20, Math.round(prot / 4 * 0.85 / 5) * 5);   // toma mínima útil
    const ST = semanasDe(p);
    const et = ETAPA(p);
    if (et === 'embarazo' && base.REGLAS_EMB) {
      const pp = pesoPreDe(p), imc = pp / Math.pow(p.alturaCm / 100, 2), r = iomDe(imc), rt = ritmoIOM(imc);
      const loc = v => v.toLocaleString(base.UI.lang || 'es');
      const r05 = v => loc(Math.round(v * 20) / 20);
      return base.REGLAS_EMB.map(x => Object.assign({}, x, { d: plantilla(x.d, { g: loc(r[1]) + '-' + loc(r[2]), r: r05(rt[0]) + '-' + r05(rt[1]), p: prot, q, s: ST }) }));
    }
    if (et === 'posparto' && base.REGLAS_PP) return base.REGLAS_PP.map(x => Object.assign({}, x, { d: plantilla(x.d, { p: prot, q, s: ST }) }));
    /* las reglas 1 y 8 narraban la biografía del dueño (5 años de sofá, ciclo
       on/off): cada historial recibe la suya */
    const var1 = p.historial === 'nunca' ? G.r1Nunca : p.historial === 'activo' ? G.r1Activo : null;
    const var8 = p.historial === 'nunca' ? G.r8Nunca : p.historial === 'activo' ? G.r8Activo : null;
    const sinBarra = p.material !== 'gym';
    return base.REGLAS.map(r => {
      const c = Object.assign({}, r);
      if (r.n === 1 && var1) c.d = var1;
      if (r.n === 8 && var8) c.d = var8;
      // la progresión doble no puede citar «+5 kg en sentadilla» sin barra
      if (r.n === 2 && sinBarra && G.r2SinBarra) c.d = G.r2SinBarra;
      c.t = plantilla(c.t, { p: prot, q, s: ST });
      c.d = plantilla(c.d, { p: prot, q, s: ST });
      return c;
    });
  }
  /* CIENCIA por índice (el orden es idéntico en los 5 idiomas):
     0 memoria muscular · 1 tendón · 2 correr con sobrepeso · 3 déficit óptimo
     4 proteína · 5 diet break · 6 volumen · 7 descarga · 8 sueño · 9 salud */
  function cienciaGen(base, prot, p, tieneTrote) {
    const G = base.UI.gen || {};
    const et = ETAPA(p);
    if (et === 'embarazo' && base.CIENCIA_EMB) return JSON.parse(JSON.stringify(base.CIENCIA_EMB));
    if (et === 'posparto' && base.CIENCIA_PP) return JSON.parse(JSON.stringify(base.CIENCIA_PP));
    const C = JSON.parse(JSON.stringify(base.CIENCIA));
    if (p.historial === 'nunca' && G.introNunca) C.intro = G.introNunca;
    else if (p.historial === 'activo' && G.introActivo) C.intro = G.introActivo;
    const imc = p.pesoKg / Math.pow(p.alturaCm / 100, 2);
    const recorta = p.objetivo === 'perder' || p.objetivo === 'recomp';
    const fuera = new Set();
    if (p.historial !== 'retomador') fuera.add(0);            // la memoria muscular es del que vuelve
    if (imc < 27 || !tieneTrote) fuera.add(2);                // correr: solo si aplica Y el plan corre
    if (!recorta) { fuera.add(3); fuera.add(5); }             // déficit y diet break, solo si se recorta
    const temas = (C.temas || []).filter((x, i) => !fuera.has(i));
    // el hueco lo llena el tema propio del perfil
    if (p.historial === 'nunca' && G.cNuncaT) temas.unshift({ t: G.cNuncaT, d: G.cNuncaD, ref: G.cNuncaR });
    if (p.historial === 'activo' && G.cActivoT) temas.unshift({ t: G.cActivoT, d: G.cActivoD, ref: G.cActivoR });
    if (p.objetivo === 'ganar' && G.cSupT) temas.splice(Math.min(3, temas.length), 0, { t: G.cSupT, d: G.cSupD, ref: G.cSupR });
    temas.forEach(x => { x.d = plantilla(x.d, { p: prot, s: semanasDe(p) }); });
    C.temas = temas;
    return C;
  }
  /* el cierre cita la fecha REAL y habla del objetivo real */
  function cierreGen(base, p, M) {
    const G = base.UI.gen || {};
    const meses = base.UI.meses;
    const fin = M.finISO.split('-').map(Number);
    const f = fin[2] + ' ' + meses[fin[1] - 1];
    const et = ETAPA(p);
    if (et === 'embarazo' && G.emb && G.emb.cierre) return plantilla(G.emb.cierre, { f });
    if (et === 'posparto' && G.pp && G.pp.cierre) return plantilla(G.pp.cierre, { f });
    const txt = p.objetivo === 'perder' ? G.cierrePerder : p.objetivo === 'recomp' ? G.cierreRecomp
      : p.objetivo === 'ganar' ? G.cierreGanar : G.cierreManten;
    if (!txt) return '';
    return plantilla(txt, { f }) + (M.abierto && G.cierreRenueva ? ' ' + G.cierreRenueva : '');
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
    /* en el embarazo no hay escalera de kilos (ni «músculo, ladrillo a
       ladrillo» por ganar peso), ni marcas, ni cintura */
    const emb = M.etapa === 'embarazo';
    const delta = emb ? 0 : Math.round(salida - media);   // + pierde · − gana
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
      // ni insignias imposibles: sin barra de dominadas (o habiéndolas descartado) no hay dominada libre
      if (l.id === 'dominada-libre' && (M.material === 'nada' || (M.gustosNo || []).includes('ej:dominadas'))) continue;
      if (emb && (/^pr-/.test(l.id) || l.id === 'dominada-libre')) continue;
      if (/^kg-/.test(l.id)) { if (!kgHecho) { out.push.apply(out, escalera); kgHecho = true; } continue; }
      if (/^cintura-/.test(l.id)) { if (!cintHecho) { out.push.apply(out, cinturas); cintHecho = true; } continue; }
      if (l.id === 'plan-completo') { out.push(Object.assign({}, l, { desc: (emb && G.emb && G.emb.logroFinD) || plantilla(G.lFinDesc || l.desc, { s: M.semanas }) })); continue; }
      // las insignias de checkpoint nombran SU semana (S8/S16 en un plan de 24)
      if ((l.id === 'checkpoint-s4' || l.id === 'checkpoint-s8') && chks) {
        const c = chks[l.id === 'checkpoint-s4' ? 0 : 1];
        if (c && G.lChkN) { out.push(Object.assign({}, l, { nombre: plantilla(G.lChkN, { s: c.sem }), desc: plantilla(G.lChkD2 || G.lChkD, { s: c.sem }) })); continue; }
      }
      out.push(l);
    }
    return out;
  }

  /* Las decisiones del motor, en datos: el reveal las enseña una a una.
     Solo hechos que el plan generado cumple de verdad — nada de prometer. */
  function decisionesGen(perfil, nutri, meta, menu, stats) {
    const et = ETAPA(perfil), M = meta.META;
    const dias = Math.min(et === 'embarazo' ? 4 : 6, Math.max(2, perfil.diasSemana || 4));
    const dec = [];
    // la etapa va la primera: es lo que ordena todo lo demás
    if (et === 'embarazo') dec.push({ k: 'etapa', v: 'embarazo', s: M.gInicio, f: M.fpp });
    if (et === 'posparto') dec.push({ k: 'etapa', v: 'posparto', s: M.wpInicio, ces: !!M.cesarea, lact: !!M.lactancia });
    dec.push({ k: 'split', d: dias, tipo: et === 'embarazo' ? 'emb' : (dias <= 3 ? 'fb' : dias === 4 ? 'tp' : 'ppl') });
    dec.push({ k: 'kcal', v: nutri.kcal, delta: nutri.kcal - nutri.tdee, obj: perfil.objetivo, etapa: et, lact: !!M.lactancia, extra: nutri.extra || 0 });
    dec.push({ k: 'prot', v: nutri.prot, kg: Math.round(nutri.prot / (et === 'embarazo' ? (M.pesoPre || perfil.pesoKg) : perfil.pesoKg) * 10) / 10 });
    dec.push({ k: 'dur', s: M.semanas, a: M.inicioISO, b: M.finISO, etapa: et });
    if (stats.subs) dec.push({ k: 'subs', n: stats.subs });
    // la fila de cuidado solo existe si el plan lleva avisos DE VERDAD
    if (et) dec.push({ k: 'cuida', etapa: et, zonas: (perfil.lesiones || []).slice() });
    else if ((perfil.lesiones || []).length && stats.cuida) dec.push({ k: 'cuida', zonas: perfil.lesiones.slice() });
    if (perfil.ciclo && perfil.ciclo.modo && (perfil.ciclo.modo === 'natural' || perfil.ciclo.modo === 'hormonal')) dec.push({ k: 'ciclo', modo: perfil.ciclo.modo });
    if ((perfil.dieta && perfil.dieta !== 'normal') || (perfil.sin || []).length)
      dec.push({ k: 'menu', avisos: menu.avisos || 0 });
    const g = perfil.gustos || {};
    if ((g.no || []).length) dec.push({ k: 'gustos', likes: (g.like || []).length, nos: g.no.length });
    if (stats.recorte) dec.push({ k: 'min', v: stats.recorte });
    if (!et && perfil.evento && perfil.evento !== 'siempre') dec.push({ k: 'evento', v: perfil.evento, f: meta.META.eventoFecha, manda: meta.META.eventoManda });
    if (!et && perfil.duracionSem === 0) dec[dec.findIndex(x => x.k === 'dur')].abierto = true;
    return dec;
  }

  /* ---------- ciclo menstrual: dónde estás y cuándo toca ----------
     Pura y sin reloj: recibe la fecha de hoy. La fase lútea es la parte fija
     (12-14 días; Bull 2019, 612.613 ciclos) y la folicular la que varía, así
     que la ovulación se estima hacia atrás desde la regla prevista, nunca
     «el día 14». Con anticoncepción hormonal no hay fases; con ciclos que
     varían más de 9 días (FIGO 2018) no se predice; con más de 90 días sin
     regla se pide consultar. */
  function cicloEstado(ciclo, inicios, hoy) {
    if (!ciclo || !ciclo.modo || ciclo.modo === 'no' || ciclo.modo === 'sin') return null;
    if (ciclo.modo === 'hormonal') return { modo: 'hormonal' };
    const starts = [...new Set((inicios || []).concat(ciclo.ultima ? [ciclo.ultima] : []).filter(s => fecha(s)))].sort();
    if (!starts.length) return { modo: 'natural', sinDatos: true };
    const lens = [];
    for (let i = 1; i < starts.length; i++) { const l = diasEntre(fecha(starts[i - 1]), fecha(starts[i])); if (l >= 15 && l <= 60) lens.push(l); }
    const ult = lens.slice(-6);
    const mediana = a => { const s = a.slice().sort((x, y) => x - y); return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2; };
    const dur = ult.length >= 2 ? Math.round(mediana(ult)) : (ciclo.dur || 28);
    const spread = ult.length >= 3 ? Math.max.apply(null, ult) - Math.min.apply(null, ult) : null;
    const irregular = spread !== null && spread > 9;
    const margen = spread === null ? (ciclo.dur ? 2 : 4) : Math.max(2, Math.ceil(spread / 2));
    const ultima = starts[starts.length - 1];
    const dia = diasEntre(fecha(ultima), fecha(hoy)) + 1;
    const proxima = iso(addD(fecha(ultima), dur));
    const retraso = dia - dur;                         // > 0: ya pasó lo previsto
    const ovul = dur - 14;                             // día de ovulación estimado
    let fase;
    if (retraso > margen) fase = 'retraso';
    else if (dia <= 5) fase = 'regla';
    else if (Math.abs(dia - ovul) <= 1) fase = 'ovulatoria';
    else if (dia < ovul) fase = 'folicular';
    else if (dia >= dur - 4) fase = 'premenstrual';
    else fase = 'lutea';
    return { modo: 'natural', dia, dur, fase, proxima, margen, retraso: Math.max(0, retraso), irregular, sinRegla90: dia > 90, ciclos: ult.length, ultima };
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
    // ¿este plan corre? la tarjeta de carrera, el tema de ciencia y las notas
    // de tendón sobre el trote solo existen si la respuesta es sí
    const tieneTrote = [...usados].some(id => ((base.SESIONES[id] || {}).icono) === 'run');
    const et = ETAPA(perfil);
    return Object.assign({}, base, {
      META: meta.META,
      FASES: fasesGen(base, meta.ini, perfil, cal),
      CAL: cal,
      HITOS_SEMANA: hitosGen(base, perfil, nutri, cal),
      // en el embarazo el calentamiento no salta, y las señales de alarma son las de las guías
      CALENTAMIENTO: (et === 'embarazo' && base.CALENTAMIENTO_EMB) ? base.CALENTAMIENTO_EMB : base.CALENTAMIENTO,
      SENALES: (et === 'embarazo' && base.SENALES_EMB) ? base.SENALES_EMB : (et === 'posparto' && base.SENALES_PP) ? base.SENALES_PP : base.SENALES,
      SESIONES: sesionesGen(base, perfil, stats, usados, !tieneTrote),
      TENDON: tendonGen(base, perfil, tieneTrote),
      NUTRI: nutri.NUTRI,
      MENU: menu.MENU,
      COMPRA: compraGen(base, menu.MENU, perfil.dieta === 'vegano' || (perfil.sin || []).includes('lactosa')),
      MEALPREP: mealprepGen(base, menu.MENU),
      MEALPREP_NOTA: (base.UI.gen && base.UI.gen.prepNota) || '',
      CHECKPOINTS: chks,
      FOTOS: fotosGen(meta.META, meta.ini),
      REGLAS: reglasGen(base, nutri.prot, perfil),
      CIENCIA: cienciaGen(base, nutri.prot, perfil, tieneTrote),
      CARRERA: tieneTrote ? carreraGen(base, perfil) : null,
      CIERRE: cierreGen(base, perfil, meta.META),
      LOGROS: logrosGen(base, meta.META, chks),
      __menuAvisos: menu.avisos || 0,
      __mantenimiento: Math.round(nutri.tdee / 100) * 100,
      __qMin: nutri.qMin,
      __protMenu: protMenuMedia(base, menu.MENU, perfil.dieta === 'vegano' || (perfil.sin || []).includes('lactosa')),
      __kcalMenu: kcalMenuMedia(base, menu.MENU, perfil.dieta === 'vegano' || (perfil.sin || []).includes('lactosa')),
      __decisiones: decisionesGen(perfil, nutri, meta, menu, stats),
      __gen: true
    });
  }

  // recetaVale se exporta para que el mazo y el recetario filtren en vivo
  // el mazo del cuestionario filtra sus cartas con los mismos criterios que el motor
  return { generarPlan, recetaVale, equipoVale, equipoValeId, tocaLesion, pictoDeFila,
    // etapa y ciclo: puras, para las vistas y para las pruebas
    etapaDe: ETAPA, semanaGestacion, semanasPosparto, fppDe, faseEmb, cortesPP, tocaEmbarazo, gananciaEsperada, pesoPreDe, cicloEstado, EMB_DEP_NO };
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
