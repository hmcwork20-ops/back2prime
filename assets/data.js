/* ============================================================
   BACK2PRIME · data.js
   Todo el contenido del plan de 12 semanas: fases, calendario,
   sesiones, fichas de ejercicios, nutrición, recetas, logros.
   Sin lógica: solo datos. La lógica vive en app.js.
   ============================================================ */
window.B2P = (function () {

  const META = {
    nombre: 'BACK2PRIME',
    inicioISO: '2026-08-17',
    finISO: '2026-11-08',
    semanas: 12,
    perfil: {
      pesoSalida: 95.1,
      alturaCm: 183,
      objetivoKg: [86, 88],
      objetivoNota: '≈ −8 kg de grasa reales: la creatina esconde ~1 kg de agua en la báscula',
      cinturaMetaCm: 91,
      grasaEstimada: '~22% → 16-17%',
      proteinaDia: 190
    }
  };

  /* ---------- FASES (código de discos olímpicos) ---------- */
  const FASES = [
    { id: 1, nombre: 'Reactivación', sub: 'En casa', semanas: [1, 2], disco: 10, rpe: '6–7',
      fechas: '17 – 30 ago',
      objetivo: 'Reconstruir el hábito y despertar patrones de movimiento sin castigar articulaciones. Te quedarás con ganas de más: es intencionado.' },
    { id: 2, nombre: 'Entrada al gym', sub: 'Full Body ×3', semanas: [3, 4, 5], disco: 15, rpe: '6–7',
      fechas: '31 ago – 20 sep',
      objetivo: 'Reaprender los básicos con barra y construir base de carga. Tu memoria muscular permite pesos que tu tejido conectivo aún no aguanta: trabaja al 65-70% de lo que sientes que podrías, con 3 repeticiones en reserva SIEMPRE.' },
    { id: 3, nombre: 'Carga', sub: 'Torso / Pierna ×4', semanas: [6, 7, 8, 9], disco: 20, rpe: '7–8',
      fechas: '21 sep – 18 oct',
      objetivo: 'Volumen e intensidad reales para forzar la recomposición: aquí la memoria muscular rinde de verdad. Termina cada serie pudiendo hacer 2 repeticiones más, y que sean reales: quien vuelve tiende a sobrestimar lo cerca que está del fallo.' },
    { id: 4, nombre: 'Pico', sub: 'Push / Pull / Legs ×5', semanas: [10, 11, 12], disco: 25, rpe: '8',
      fechas: '19 oct – 8 nov',
      objetivo: 'Máximo estímulo para cerrar la recomposición. {d} días, pero con sesiones de {min} minutos, no de 2 horas. RPE 8: 1-2 repeticiones en reserva en las últimas series.' }
  ];

  /* ---------- CALENDARIO: 12 semanas × 7 días (Lun..Dom) ----------
     Cada slot: id de sesión, o {s:id, opt:true} si es opcional.   */
  const CAL = [
    { n: 1,  fase: 1, dias: ['c-a', 'cam40', 'c-b', 'cam40', 'c-a', 'cam40', 'libre'] },
    { n: 2,  fase: 1, dias: ['c-b', 'cam40', 'c-a', 'cam40', 'c-b', 'cam40', 'libre'] },
    { n: 3,  fase: 2, dias: ['fb-a', 'wj3', 'fb-b', 'wj3', 'fb-a', { s: 'wj3', opt: true }, 'libre'] },
    { n: 4,  fase: 2, dias: ['fb-b', 'wj4', 'fb-a', 'wj4', 'fb-b', { s: 'wj4', opt: true }, 'libre'] },
    { n: 5,  fase: 2, dias: ['fb-a', 'wj5', 'fb-b', 'wj5', 'fb-a', { s: 'wj5', opt: true }, 'libre'] },
    { n: 6,  fase: 3, dias: ['torso-a', 'pierna-a', 'trote25', 'torso-b', 'pierna-b', 'cam60', { s: 'trote25', opt: true }] },
    { n: 7,  fase: 3, dietbreak: true, dias: ['torso-a', 'pierna-a', 'trote25', 'torso-b', 'pierna-b', 'cam60', { s: 'trote25', opt: true }] },
    { n: 8,  fase: 3, dias: ['torso-a', 'pierna-a', 'trote25', 'torso-b', 'pierna-b', 'cam60', { s: 'trote25', opt: true }] },
    { n: 9,  fase: 3, descarga: true, dias: ['torso-a', 'pierna-a', 'trote25', 'torso-b', 'pierna-b', 'cam60', { s: 'trote25', opt: true }] },
    { n: 10, fase: 4, transicion: true, dias: ['push-a', 'pull-a', 'legs', 'trote30', 'push-b', 'pull-b', { s: 'trote30', opt: true }] },
    { n: 11, fase: 4, dias: ['push-a', 'pull-a', 'legs', 'trote30', 'push-b', 'pull-b', { s: 'trote30', opt: true }] },
    { n: 12, fase: 4, dias: ['push-a', 'pull-a', 'legs', 'trote30', 'push-b', 'pull-b', { s: 'trote30', opt: true }] }
  ];

  /* ---------- SEMANAS ESPECIALES (evidencia: descarga gestionada + diet break + transición) ---------- */
  const HITOS_SEMANA = {
    5:  { t: 'Cribado de salud', d: 'Antes de la Fase 3 (trabajo vigoroso tras 5 años parado): mídete la tensión en una farmacia y hazte una analítica básica (lípidos, glucosa/HbA1c). 15 minutos que compran tranquilidad.' },
    7:  { t: 'DIET BREAK', d: 'Toda la semana comes a mantenimiento (~2.800 kcal: +2 raciones de carbohidrato al día, proteína igual). El entreno no cambia. No es un premio ni una recaída: restaura NEAT y leptina, y rompe el ciclo psicológico de todo o nada. El lunes siguiente, déficit otra vez como si nada.' },
    9:  { t: 'DESCARGA (no opcional)', d: 'Misma rutina con LA MITAD de series por ejercicio y el mismo peso en la barra. No es cese: parar del todo cuesta fuerza. Es mantenimiento de tejido + vacaciones para tendones y articulaciones antes del bloque final.' },
    10: { t: 'Un día más', d: 'Primera semana del bloque nuevo: haz UNA serie menos en todo. Subir de día es el punto de mayor riesgo tendinoso del plan; se entra andando, no saltando.' }
  };

  /* ---------- SESIONES ---------- */
  // bloques: e = id ejercicio · s = series · r = reps (rW = por semana) · d = descanso seg · n = nota corta
  const SESIONES = {
    /* — Fase 1 · casa — */
    'c-a': { nombre: 'Circuito A', tipo: 'fuerza', fase: 1, dur: '~35′', calent: true, bloques: [
      { e: 'sentadilla-pc',  s: 3, rW: { 1: '10', 2: '12' }, d: 75 },
      { e: 'flexiones',      s: 3, rW: { 1: '6-8', 2: '8-10' }, d: 75 },
      { e: 'puente-gluteo',  s: 3, rW: { 1: '12', 2: '15' }, d: 60 },
      { e: 'plancha',        s: 3, rW: { 1: '25″', 2: '35″' }, d: 60 },
      { e: 'elev-talones',   s: 2, rW: { 1: '15', 2: '20' }, d: 45, n: 'Prepara los tendones para el trote' }
    ]},
    'c-b': { nombre: 'Circuito B', tipo: 'fuerza', fase: 1, dur: '~35′', calent: true, bloques: [
      { e: 'zancada-alterna', s: 3, rW: { 1: '8/p', 2: '10/p' }, d: 75 },
      { e: 'remo-toalla',     s: 3, rW: { 1: '10', 2: '12' }, d: 75 },
      { e: 'rdl-1p',          s: 3, rW: { 1: '8/p', 2: '10/p' }, d: 60 },
      { e: 'superman',        s: 3, rW: { 1: '10', 2: '12' }, d: 45 },
      { e: 'dead-bug',        s: 3, rW: { 1: '10/l', 2: '12/l' }, d: 45 }
    ]},
    /* — Fase 2 · Full Body — */
    'fb-a': { nombre: 'Full Body A', tipo: 'fuerza', fase: 2, dur: '~60′', calent: true, bloques: [
      { e: 'sentadilla-barra',   s: 3, r: '8',  d: 120, n: 'S3: barra vacía o +10-20 kg, solo patrón' },
      { e: 'press-banca',        s: 3, r: '8',  d: 120 },
      { e: 'remo-barra',         s: 3, r: '8',  d: 120 },
      { e: 'press-militar-mc',   s: 2, r: '10', d: 90 },
      { e: 'curl-femoral-tumbado', s: 2, r: '12', d: 90 },
      { e: 'plancha',            s: 3, r: '40″', d: 60, n: 'Cuando sea fácil: alterna apoyo de una mano' }
    ]},
    'fb-b': { nombre: 'Full Body B', tipo: 'fuerza', fase: 2, dur: '~60′', calent: true, bloques: [
      { e: 'rdl-barra',          s: 3, r: '8',  d: 120, n: 'Empieza con 30-40 kg' },
      { e: 'press-inclinado-mc', s: 3, r: '10', d: 120 },
      { e: 'jalon-pecho',        s: 3, r: '10', d: 90 },
      { e: 'zancada-mc',         s: 2, r: '10/p', d: 90, n: '6-10 kg por mano' },
      { e: 'elev-laterales',     s: 2, r: '15', d: 60 },
      { e: 'face-pull',          s: 2, r: '15', d: 60, n: 'Contrapeso al empuje: salud de hombro desde ya' },
      { e: 'crunch-polea',       s: 3, r: '12', d: 60 }
    ]},
    /* — Fase 3 · Torso/Pierna — */
    'torso-a': { nombre: 'Torso A', tipo: 'fuerza', fase: 3, dur: '~70′', calent: true, bloques: [
      { e: 'press-banca',      s: 4, r: '6-8', d: 150, n: 'Básico pesado: 4×8 limpio → +2,5 kg y vuelve a 4×6' },
      { e: 'remo-barra',       s: 4, r: '8',   d: 120, n: 'Mismo peso en las 4 series' },
      { e: 'press-militar',    s: 3, r: '10',  d: 90 },
      { e: 'jalon-pecho',      s: 3, r: '10',  d: 90, n: '1″ de pausa abajo' },
      { e: 'elev-laterales',   s: 3, r: '15',  d: 60 },
      { e: 'face-pull',        s: 2, r: '15',  d: 60, n: '2ª dosis semanal de rotación externa' },
      { e: 'curl-barra-z',     s: 2, r: '12',  d: 60 },
      { e: 'ext-triceps-polea', s: 2, r: '12', d: 60 }
    ]},
    'pierna-a': { nombre: 'Pierna A', tipo: 'fuerza', fase: 3, dur: '~70′', calent: true, tendon: 'rodilla', bloques: [
      { e: 'sentadilla-barra', s: 4, r: '6-8', d: 150, n: 'Doble progresión, igual que la banca' },
      { e: 'rdl-barra',        s: 3, r: '8',   d: 120, n: '+5 kg cuando las 3 series salgan limpias' },
      { e: 'prensa',           s: 3, r: '10',  d: 90 },
      { e: 'curl-femoral-tumbado', s: 3, r: '12', d: 90, n: 'Excéntrica de 3″' },
      { e: 'gemelo-pie',       s: 4, r: '8',   d: 90, n: 'HSR tendón: 3″ bajar / 3″ subir, con carga de verdad' },
      { e: 'plancha-lastre',   s: 3, r: '40″', d: 60 }
    ]},
    'torso-b': { nombre: 'Torso B', tipo: 'fuerza', fase: 3, dur: '~70′', calent: true, bloques: [
      { e: 'press-inclinado-mc', s: 4, r: '8', d: 120, n: 'Empuje pesado del día' },
      { e: 'dominadas',        s: 4, r: '8',   d: 120, n: 'Reduce la asistencia semana a semana' },
      { e: 'press-plano-mc',   s: 3, r: '10',  d: 90 },
      { e: 'remo-polea',       s: 3, r: '12',  d: 90 },
      { e: 'face-pull',        s: 3, r: '15',  d: 60, n: 'Salud de hombro para las fases de empuje' },
      { e: 'curl-inclinado',   s: 2, r: '12',  d: 60, n: 'Superserie con press francés si vas justo' },
      { e: 'press-frances',    s: 2, r: '12',  d: 60 }
    ]},
    'pierna-b': { nombre: 'Pierna B', tipo: 'fuerza', fase: 3, dur: '~70′', calent: true, tendon: 'rodilla', bloques: [
      { e: 'hip-thrust',       s: 4, r: '8',   d: 120, n: 'Pausa 1″ arriba, glúteo al máximo' },
      { e: 'zancada-bulgara',  s: 3, r: '10/p', d: 90, n: 'El más duro del plan. Empieza sin peso' },
      { e: 'ext-cuadriceps',   s: 3, r: '12',  d: 90, n: 'Si molesta la rótula, reduce rango arriba' },
      { e: 'curl-femoral-sentado', s: 3, r: '12', d: 90 },
      { e: 'gemelo-sentado',   s: 4, r: '15',  d: 60 },
      { e: 'elev-piernas',     s: 3, r: '10',  d: 60 }
    ]},
    /* — Fase 4 · PPL — */
    'push-a': { nombre: 'Push', tipo: 'fuerza', fase: 4, dur: '~65′', calent: true, bloques: [
      { e: 'press-banca',       s: 4, r: '6',  d: 150 },
      { e: 'press-militar',     s: 3, r: '8',  d: 120 },
      { e: 'press-inclinado-mc', s: 3, r: '10', d: 90 },
      { e: 'elev-laterales',    s: 4, r: '15', d: 60 },
      { e: 'ext-triceps-polea', s: 3, r: '12', d: 60, n: 'Alterna con extensión sobre cabeza' },
      { e: 'ext-triceps-cabeza', s: 3, r: '12', d: 60 }
    ]},
    'pull-a': { nombre: 'Pull', tipo: 'fuerza', fase: 4, dur: '~65′', calent: true, bloques: [
      { e: 'rdl-barra',        s: 3, r: '6-8', d: 150 },
      { e: 'dominadas',        s: 4, r: '8',   d: 120, n: 'Lastradas si salen más de 10' },
      { e: 'remo-barra',       s: 3, r: '10',  d: 120, n: 'O remo en polea' },
      { e: 'face-pull',        s: 3, r: '15',  d: 60 },
      { e: 'curl-barra-z',     s: 3, r: '10',  d: 60 },
      { e: 'curl-martillo',    s: 2, r: '12',  d: 60 }
    ]},
    'legs': { nombre: 'Legs', tipo: 'fuerza', fase: 4, dur: '~70′', calent: true, tendon: 'rodilla', bloques: [
      { e: 'sentadilla-barra', s: 4, r: '6',  d: 150 },
      { e: 'prensa',           s: 3, r: '10', d: 120 },
      { e: 'hip-thrust',       s: 3, r: '10', d: 120 },
      { e: 'curl-femoral-tumbado', s: 3, r: '12', d: 90 },
      { e: 'gemelo-pie',       s: 4, r: '8',  d: 90, n: 'HSR: 3″ bajar / 3″ subir' },
      { e: 'rueda-abdominal',  s: 3, r: '12', d: 60 }
    ]},
    'push-b': { nombre: 'Push B', tipo: 'fuerza', fase: 4, dur: '~60′', calent: true, bloques: [
      { e: 'press-inclinado-barra', s: 4, r: '10', d: 120 },
      { e: 'press-plano-mc',   s: 3, r: '12', d: 90 },
      { e: 'fondos',           s: 3, r: '10', d: 90 },
      { e: 'laterales-polea',  s: 4, r: '15', d: 60 },
      { e: 'ext-triceps-polea', s: 3, r: '15', d: 60 }
    ]},
    'pull-b': { nombre: 'Pull B', tipo: 'fuerza', fase: 4, dur: '~60′', calent: true, bloques: [
      { e: 'jalon-estrecho',   s: 4, r: '10', d: 120 },
      { e: 'remo-mancuerna',   s: 3, r: '12/l', d: 90 },
      { e: 'pullover-polea',   s: 3, r: '15', d: 60 },
      { e: 'encogimientos',    s: 3, r: '12', d: 60 },
      { e: 'curl-polea',       s: 3, r: '15', d: 60 }
    ]},
    /* — Cardio — */
    'cam40':  { nombre: 'Caminata 40′', tipo: 'cardio', icono: 'walk', detalle: 'Ritmo de conversación incómoda: puedes hablar, pero no cantar. Cuenta para los pasos del día.' },
    'cam60':  { nombre: 'Caminata 60′', tipo: 'cardio', icono: 'walk', detalle: 'Ritmo vivo y sostenido. Ideal en exterior: suma luz, pasos y recuperación activa.' },
    'wj3': { nombre: 'Caminar-trotar S3', tipo: 'cardio', icono: 'run', detalle: '7 rondas: 2′ trote suave + 2′ caminando (28′). Antes: 2×20 tibialis raises + 10 elevaciones de talón. Trote de verdad suave: si no puedes hablar, vas rápido.' },
    'wj4': { nombre: 'Caminar-trotar S4', tipo: 'cardio', icono: 'run', detalle: '6 rondas: 3′ trote + 2′ caminando (30′). Antes: 2×20 tibialis raises. Cadencia alta y pasos cortos: menos impacto por zancada.' },
    'wj5': { nombre: 'Caminar-trotar S5', tipo: 'cardio', icono: 'run', detalle: '5 rondas: 5′ trote + 1′ caminando (30′), o 20′ de trote suave continuo si el cuerpo va bien. Antes: 2×20 tibialis raises.' },
    'trote25': { nombre: 'Trote 25-30′', tipo: 'cardio', icono: 'run', detalle: 'Continuo y conversacional. Mejor asfalto liso o tierra compacta que aceras irregulares. Si aparece molestia en espinilla o rodilla que empeora al correr: corta y camina.' },
    'trote30': { nombre: 'Trote 30-35′', tipo: 'cardio', icono: 'run', detalle: 'Continuo. Un día puede ser algo más alegre (últimos 10′ a ritmo medio), el otro siempre suave.' },
    'libre': { nombre: 'Descanso', tipo: 'libre', icono: 'rest', detalle: 'Día libre de verdad. Los pasos diarios siguen contando. Domingo: meal prep (~90′) deja la semana resuelta.' }
  };

  /* ---------- CALENTAMIENTO (siempre, 6′) ---------- */
  const CALENTAMIENTO = {
    titulo: 'Calentamiento · 6′ · siempre',
    pasos: [
      'Círculos de brazos · 30″',
      'Rotaciones de cadera · 30″ por lado',
      '10 sentadillas lentas sin peso',
      '5 zancadas con giro por lado',
      'Plancha · 20″',
      '20 jumping jacks'
    ],
    gym: 'En el gym, además: 1-2 series de aproximación con poco peso en el primer ejercicio pesado del día (50% y 75% del peso de trabajo).'
  };

  /* ---------- PROTOCOLO TENDÓN (el seguro del plan) ---------- */
  const TENDON = {
    titulo: 'Protocolo tendón · 6-8′ · 2-3×/semana',
    intro: 'La fuerza vuelve en semanas; el tendón necesita meses (su colágeno se renueva ~10 veces más lento y no tiene memoria muscular). Este bloque es el seguro del plan: empieza la semana 1, y el trote de la semana 3 solo entra con dos semanas de tendón ya rodadas.',
    bloques: [
      { id: 'tendon-rodilla', nombre: 'Rotuliano · isométrico', donde: 'Tras cada sesión de pierna (en F1, tras los circuitos)',
        detalle: 'Sentadilla isométrica en pared (F2+: sentadilla española con cinta rígida tras las rodillas): 5 × 45″ a un 70% de esfuerzo, 1′ de descanso. Muslo cerca del paralelo, sin dolor punzante. Además de adaptar, tiene efecto analgésico inmediato (Rio 2015).' },
      { id: 'tendon-aquiles', nombre: 'Aquiles · HSR de gemelo', donde: 'Ya integrado en las sesiones (elevaciones/gemelo)',
        detalle: 'La regla que lo cambia todo: gemelo PESADO y LENTO, 3″ bajar, 3″ subir, 6-8 reps, sin rebotes. En F1 con mochila cargada a una pierna; en gym con carga real. El rebote usa el reflejo del tendón y le quita justo el estímulo que necesita.' },
      { id: 'tendon-tibial', nombre: 'Tibial anterior', donde: 'Antes de cada trote',
        detalle: 'Tibialis raises apoyado en pared: 2-3 × 15-20. Es la vacuna contra la periostitis a tu peso actual.' },
      { id: 'tendon-codo', nombre: 'Codo/muñeca · isométrico', donde: 'Tras las sesiones de torso (F2+), 2×/sem',
        detalle: 'Con una mancuerna ligera, muñeca quieta a media flexión: 3 × 45″ (palma arriba y palma abajo). El volumen de press + remo + jalón dispara epicondilitis en retomadores; esto la previene gratis.' }
    ],
    nota: 'NO añadas pliometría/saltos "para preparar el trote": la evidencia dice que es mal estímulo tendinoso y alto impacto. Tu preparación de impacto es este bloque.'
  };

  /* ---------- REGLAS DE CARRERA (evidencia BMI ~28) ---------- */
  const CARRERA = {
    titulo: 'Cómo correr sin romperte ({p} kg mandan)',
    reglas: [
      'Cadencia 170-180 pasos/min, zancada corta: reduce el impacto tibial ~11% y la tasa de carga ~15%. Cuenta pasos 30″ (85-90) o usa el metrónomo del reloj.',
      'Volumen gobernado por sensaciones y progresión del plan: nunca subas más de ~1,3× lo que vienes haciendo de media las últimas 4 semanas (la app te avisa).',
      'Semana 3 arranca con ~2,5 km de trote total: por debajo del techo de 3 km/sem que la evidencia marca para empezar con sobrepeso.',
      'Superficie y zapatillas CONSTANTES: no cambies las dos cosas a la vez. Mejor asfalto liso o tierra compacta que aceras.',
      'Molestia en espinilla o rodilla que EMPEORA al correr: corta y camina. La que desaparece al calentar, vigílala; la que crece, manda.'
    ]
  };

  /* ---------- MARCAS HISTÓRICAS (etapa de gym, ~2021) ---------- */
  // No se cargan como PR: son la referencia de "dónde estabas" y la diana a recuperar.
  /* Sin marcas previas: el plan se genera del cuestionario. La clave se
     mantiene porque la app la consulta, y vacía deja los logros de marca
     personal fuera de alcance, que es lo correcto para cualquiera. */
  const HISTORICO = {};

  /* ---------- ARRANQUE DE CARGAS · FASE 2 ---------- */
  const ARRANQUE = {
    titulo: 'Con qué peso empiezas en el gym (semana 3)',
    derivacion: 'Salen de tus marcas reales — banca 95×8 y sentadilla 100×8 (1RM ≈ 120 y ≈ 127 kg) — al 50%: el arranque estándar de quien vuelve. No porque el músculo no pueda más, sino porque el tendón lleva 5 años sin cargar. Desde ahí, la progresión doble la lleva la app.',
    tabla: [
      { ej: 'press-banca',      s3: '45 kg', s4: '47,5 kg', s5: '50 kg', n: '50% de tus 95. Barra + 2×12,5' },
      { ej: 'sentadilla-barra', s3: '50 kg', s4: '55 kg',   s5: '60 kg', n: '50% de tus 100. Barra + 2×15' },
      { ej: 'rdl-barra',        s3: '45 kg', s4: '50 kg',   s5: '55 kg', n: '≈45% de tu sentadilla antigua' },
      { ej: 'remo-barra',       s3: '40 kg', s4: '42,5 kg', s5: '45 kg', n: '≈45% de tu banca antigua' }
    ],
    resto: 'El resto de ejercicios no tienen marca previa: en la primera serie elige un peso que puedas mover dejándote 3 repeticiones en reserva, anótalo, y la app se encarga desde ahí.',
    aviso: 'Estos pesos te parecerán ridículos. Ese es el punto: la tendinitis de quien vuelve se gesta en las semanas 3-5, cuando el sistema nervioso permite lo que los tendones aún no aguantan.',
    desequilibrio: 'Tus propias marcas lo dicen: sentadilla 100 vs banca 95 es un ratio de 1,05 (lo equilibrado ronda 1,4-1,5). El tren inferior iba por detrás — y ahí está la doble buena noticia: es donde más margen tienes y lo que más mueve la recomposición. No te saltes los días de pierna.'
  };

  /* ---------- FICHAS DE EJERCICIOS ---------- */
  // musc: [primario, secundarios] · cues: técnica · err: errores típicos ·
  // alt: alternativas equivalentes (gym comercial) · mol: si molesta, cambia a
  const EJERCICIOS = {
    /* — Casa / F1 — */
    'sentadilla-pc': { pat: 'rod',
      nombre: 'Sentadilla peso corporal', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Cuádriceps', 'glúteo'], equipo: 'Nada',
      cues: ['Pies al ancho de hombros, puntas ligeramente hacia fuera', 'Baja en 3″ como si te sentaras atrás, sube en 1″', 'Rodillas siguen la punta del pie, talones clavados al suelo', 'Pecho alto durante todo el recorrido'],
      err: ['Talones que se despegan (baja menos profundo)', 'Rodillas que colapsan hacia dentro', 'Bajar rebotando en vez de controlar'],
      alt: [{ n: 'Sentadilla a un cajón/sofá', por: 'si te cuesta controlar la profundidad' }, { n: 'Sentadilla con pausa 2″ abajo', por: 'si 12 reps se te quedan cortas' }],
      mol: 'Si molesta la rodilla: reduce profundidad hasta donde no duela y baja aún más lento.'
    },
    'flexiones': { pat: 'eh',
      nombre: 'Flexiones', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Pectoral', 'tríceps, hombro'], equipo: 'Nada',
      cues: ['Manos algo más anchas que los hombros', 'Codos a 45° del cuerpo, no pegados ni en cruz', 'Cuerpo en tabla: glúteo y abdomen apretados', 'Pecho toca (casi) el suelo en cada rep'],
      err: ['Cadera caída o en pico', 'Medio recorrido', 'Cuello adelantado hacia el suelo'],
      alt: [{ n: 'Flexiones con manos en sofá/mesa', por: 'si no salen limpias del suelo' }, { n: 'Flexiones con pies elevados', por: 'si superas 12 fáciles' }],
      mol: 'Si molesta la muñeca: puños cerrados o agarres de flexión. Si molesta el hombro: estrecha un poco el ancho.'
    },
    'puente-gluteo': { pat: 'bis',
      nombre: 'Puente de glúteo', mm: { p: ['gluteo'], s: ['isquios'] }, zona: 'pierna', musc: ['Glúteo', 'femoral'], equipo: 'Nada',
      cues: ['Tumbado, talones cerca del glúteo', 'Empuja con los talones y sube la cadera', 'Pausa 2″ arriba apretando el glúteo fuerte', 'Costillas abajo: no arquees la lumbar'],
      err: ['Empujar con la punta del pie', 'Arquear la lumbar para subir más', 'Subir y bajar sin pausa'],
      alt: [{ n: 'Puente a una pierna', por: 'cuando 15 reps sean cómodas' }, { n: 'Puente con mochila sobre la cadera', por: 'para añadir carga en casa' }],
      mol: 'Si hay calambre en el femoral: acerca más los talones al glúteo.'
    },
    'plancha': { pat: 'core',
      nombre: 'Plancha frontal', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Core completo'], equipo: 'Nada',
      cues: ['Antebrazos en el suelo, codos bajo los hombros', 'Costillas dentro, pelvis en retroversión (mete el culo)', 'Glúteo apretado, mirada al suelo', 'Respira: no aguantes el aire'],
      err: ['Cadera caída (lumbar sufre)', 'Culo en pico (trampa)', 'Aguantar temblando: si tiembla la lumbar, corta la serie'],
      alt: [{ n: 'Plancha con apoyo de rodillas', por: 'si no aguantas el tiempo con buena forma' }],
      mol: 'Si molesta la lumbar: revisa la retroversión pélvica antes de nada; suele ser eso.'
    },
    'plancha-lastre': { pat: 'core',
      nombre: 'Plancha con lastre', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Core completo'], equipo: 'Disco 5-10 kg',
      cues: ['Misma técnica que la plancha normal', 'Que te coloquen el disco entre los omóplatos, no en la lumbar', 'Si la cadera cae, quita lastre'],
      err: ['Disco demasiado bajo (carga la lumbar)', 'Perder la retroversión al fatigarte'],
      alt: [{ n: 'Plancha con toques de hombro', por: 'si no tienes quien te ponga el disco' }, { n: 'Ab wheel de rodillas', por: 'variante más exigente' }],
      mol: 'Si molesta la lumbar: vuelve a plancha sin lastre + toques de hombro.'
    },
    'elev-talones': { pat: 'gem',
      nombre: 'Elevación de talones', mm: { p: ['gemelos'], s: [] }, zona: 'pierna', musc: ['Gemelo', 'sóleo'], equipo: 'Escalón opcional',
      cues: ['Rango completo: estira abajo, pausa 1″ arriba', 'Sube en 1″, baja en 2-3″', 'Mejor en escalón para más recorrido'],
      err: ['Rebotar rápido sin pausa', 'Medio recorrido arriba'],
      alt: [{ n: 'A una pierna', por: 'cuando 20 reps sean fáciles' }],
      mol: 'Si molesta el Aquiles: reduce el rango abajo y sube el tiempo de bajada.'
    },
    'zancada-alterna': { pat: 'zan',
      nombre: 'Zancada alterna', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Cuádriceps', 'glúteo'], equipo: 'Nada',
      cues: ['Paso amplio hacia delante', 'Tronco vertical, manos a la cadera o al frente', 'La rodilla trasera roza el suelo', 'Empuja con el talón delantero para volver'],
      err: ['Paso corto (colapsa la rodilla delantera)', 'Tronco inclinado hacia delante', 'Rodilla delantera que se va hacia dentro'],
      alt: [{ n: 'Zancada estática (sin alternar)', por: 'si el equilibrio falla' }, { n: 'Zancada atrás', por: 'más amable con la rodilla' }],
      mol: 'Si molesta la rodilla: cambia a zancada ATRÁS, mismo esquema.'
    },
    'banda-remo': { pat: 'th',
      nombre: 'Remo sentado con banda', mm: { p: ['dorsal'], s: ['biceps', 'espalda-alta'] }, zona: 'tiron', musc: ['Dorsal', 'bíceps, escápulas'], equipo: 'Banda',
      cues: ['Banda anclada a la altura del pecho (pomo, poste o bajo los pies)', 'Tira con los CODOS pegados al cuerpo', 'Junta las escápulas al final y aguanta medio segundo', 'Suelta despacio: la vuelta es la mitad del ejercicio'],
      err: ['Echar el tronco atrás para tirar más', 'Soltar la banda de golpe'],
      alt: [{ n: 'Remo con toalla en puerta', por: 'si no tienes anclaje' }, { n: 'Remo con mochila cargada', por: 'a una mano, apoyado en la mesa' }],
      mol: 'Si molesta el hombro: baja el anclaje y tira más pegado al costado.'
    },
    'banda-jalon': { pat: 'tv',
      nombre: 'Jalón con banda', mm: { p: ['dorsal'], s: ['biceps'] }, zona: 'tiron', musc: ['Dorsal', 'bíceps'], equipo: 'Banda',
      cues: ['Banda anclada arriba (marco de puerta o bisagra alta)', 'De rodillas o sentado, pecho alto', 'Baja los codos hacia los bolsillos, no hacia atrás', 'El pecho va al encuentro de las manos'],
      err: ['Arquear la lumbar para ganar recorrido', 'Tirar solo con los brazos'],
      alt: [{ n: 'Dominadas asistidas con banda', por: 'si tienes barra' }, { n: 'Remo con toalla en puerta', por: 'sin anclaje alto' }],
      mol: 'Si molesta el hombro: agarra más estrecho y no bajes tanto.'
    },
    'banda-rotacion': { pat: 'ais',
      nombre: 'Rotación externa con banda', mm: { p: ['hombro'], s: ['espalda-alta'] }, zona: 'empuje', musc: ['Manguito rotador', 'escápulas'], equipo: 'Banda',
      cues: ['Codo pegado al costado, 90° fijo (una toalla enrollada ayuda)', 'Gira el antebrazo hacia fuera, lento', 'El hombro no se encoge: baja la clavícula', '2-3″ de vuelta, sin soltar la tensión'],
      err: ['Separar el codo del cuerpo', 'Usar banda dura: aquí manda el control, no la carga'],
      alt: [{ n: 'Con mancuerna ligera tumbado de lado', por: 'misma función, sin banda' }, { n: 'Face pull con banda', por: 'más escápula' }],
      mol: 'Si pincha: reduce el recorrido a la mitad y baja la resistencia.'
    },
    'banda-abduccion': { pat: 'ais',
      nombre: 'Abducción de cadera con banda', mm: { p: ['gluteo'], s: [] }, zona: 'pierna', musc: ['Glúteo medio', 'estabilidad de rodilla'], equipo: 'Banda',
      cues: ['Banda por encima de las rodillas', 'De pie o tumbado de lado: abre la rodilla sin girar la cadera', 'El tronco no se mueve, solo la pierna', 'Aguanta un segundo arriba'],
      err: ['Rotar la pelvis para abrir más', 'Ir rápido: el glúteo medio se entrena lento'],
      alt: [{ n: 'Puente de glúteo con banda', por: 'más glúteo mayor' }, { n: 'Paso lateral con banda (monster walk)', por: 'de pie, más funcional' }],
      mol: 'Si molesta la rodilla: coloca la banda por debajo, en las espinillas.'
    },
    'remo-toalla': { pat: 'th',
      nombre: 'Remo con toalla en puerta', mm: { p: ['dorsal'], s: ['biceps', 'espalda-alta'] }, zona: 'tiron', musc: ['Dorsal', 'bíceps, escápulas'], equipo: 'Toalla + puerta (o mochila)',
      cues: ['Toalla en el pomo/marco, cuerpo inclinado atrás', 'Tira con el CODO, no con la mano', 'Escápulas atrás y abajo al final del recorrido', 'Cuanto más te inclines, más duro'],
      err: ['Tirar con los brazos sin mover las escápulas', 'Dar tirones con impulso de cadera'],
      alt: [{ n: 'Remo con mochila cargada', por: 'a una mano, apoyado en la mesa' }, { n: 'Remo invertido bajo una mesa robusta', por: 'versión más dura' }],
      mol: 'Si molesta el codo: agarra más ancho y baja la inclinación.'
    },
    'rdl-1p': { pat: 'bis',
      nombre: 'Peso muerto rumano a 1 pierna', mm: { p: ['isquios'], s: ['gluteo'] }, zona: 'pierna', musc: ['Femoral', 'glúteo, equilibrio'], equipo: 'Nada (mochila opcional)',
      cues: ['Cadera atrás, espalda recta como una mesa', 'La pierna libre sube atrás como contrapeso', 'Baja hasta notar el estiramiento del femoral', 'Prioriza equilibrio sobre profundidad'],
      err: ['Redondear la espalda para llegar más abajo', 'Girar la cadera (mantén las dos caderas mirando al suelo)'],
      alt: [{ n: 'Con apoyo de una mano en la pared', por: 'si el equilibrio rompe la serie' }, { n: 'B-stance (pie trasero de apoyo)', por: 'punto intermedio' }],
      mol: 'Si tira demasiado el femoral: reduce el rango, no la técnica.'
    },
    'superman': { pat: 'core',
      nombre: 'Superman', mm: { p: ['lumbar'], s: ['gluteo', 'espalda-alta'] }, zona: 'core', musc: ['Lumbar', 'glúteo, espalda alta'], equipo: 'Nada',
      cues: ['Boca abajo, brazos delante', 'Sube brazos y piernas a la vez, 2″ arriba', 'Mirada al suelo: no tires del cuello'],
      err: ['Latigazo cervical mirando al frente', 'Subir con rebote'],
      alt: [{ n: 'Bird-dog (brazo y pierna contrarios)', por: 'más control, menos compresión' }],
      mol: 'Si molesta la lumbar: cambia a bird-dog directamente.'
    },
    'dead-bug': { pat: 'core',
      nombre: 'Dead bug', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Core anterior profundo'], equipo: 'Nada',
      cues: ['Tumbado, lumbar PEGADA al suelo todo el tiempo', 'Brazo y pierna contrarios bajan lento a la vez', 'Exhala al extender: las costillas se quedan abajo'],
      err: ['La lumbar se arquea al extender la pierna (acorta el recorrido)', 'Ir rápido'],
      alt: [{ n: 'Solo piernas (brazos quietos)', por: 'si pierdes la lumbar en el suelo' }],
      mol: 'Es el ejercicio más seguro del plan; si algo molesta, revisa que la lumbar no se despegue.'
    },

    'pike-flexiones': { pat: 'ev',
      nombre: 'Flexiones en pica', mm: { p: ['hombro'], s: ['triceps'] }, zona: 'empuje', musc: ['Deltoides anterior', 'tríceps'], equipo: 'Nada',
      cues: ['V invertida: manos y pies cerca, cadera bien arriba', 'La cabeza baja ENTRE las manos, no por delante', 'Codos a 45° del cuerpo, nunca en cruz', 'Arriba extiende del todo, sin encoger los hombros'],
      err: ['Bajar la cadera y convertirlo en una flexión normal', 'Llevar la cabeza por delante de las manos (ahí paga el hombro)', 'Medio recorrido para poder hacer más repeticiones'],
      alt: [{ n: 'Con los pies en una silla', por: 'cuando 12 salen fáciles' }, { n: 'Con las manos en un escalón', por: 'si todavía no bajas limpio' }],
      mol: 'Si molesta el hombro: baja un poco la cadera hasta que el ángulo sea cómodo. El empuje vertical es el que más movilidad pide de todo el plan.'
    },
    'jalon-toalla': { pat: 'tv',
      nombre: 'Jalón con toalla', mm: { p: ['dorsal'], s: ['biceps'] }, zona: 'tiron', musc: ['Dorsal', 'bíceps'], equipo: 'Toalla',
      cues: ['Toalla tensa sobre la cabeza: un brazo tira hacia abajo y el otro RESISTE', 'El codo que tira va al costado, no hacia delante', 'Aprieta la escápula hacia abajo y aguanta 1″', 'Vuelve arriba en 3″ frenando con el brazo contrario'],
      err: ['Tirar con el bíceps en vez de con la espalda', 'Encoger el hombro en vez de bajar la escápula', 'No resistir con el brazo de arriba: sin tensión no hay estímulo'],
      alt: [{ n: 'Remo invertido bajo una mesa firme', por: 'mucho más medible: si tienes mesa, mejor esto' }, { n: 'Dominadas', por: 'en cuanto tengas una barra' }],
      mol: 'Sin barra, el tirón vertical es lo más difícil de sustituir de verdad: si puedes, prioriza el remo bajo mesa, que sí carga peso real.'
    },
    'abduccion-lado': { pat: 'ais',
      nombre: 'Abducción tumbado de lado', mm: { p: ['gluteo'], s: [] }, zona: 'pierna', musc: ['Glúteo medio'], equipo: 'Nada',
      cues: ['Tumbado de lado, cuerpo en línea y cadera perpendicular al suelo', 'Sube la pierna de arriba con el talón ligeramente atrasado', 'Sube en 1″, aguanta 1″ y baja en 3″', 'La punta del pie mira al frente, no al techo'],
      err: ['Rodar la cadera hacia atrás (entonces trabaja el flexor, no el glúteo)', 'Subir la pierna más alto de lo que la cadera permite', 'Ir rápido: aquí manda el tiempo bajo tensión'],
      alt: [{ n: 'Con banda por encima de las rodillas', por: 'cuando 20 repeticiones dejen de quemar' }, { n: 'Almeja, con las rodillas dobladas', por: 'si la lumbar se mete en el movimiento' }],
      mol: 'Es además el ejercicio de rehabilitación del glúteo medio: si la rodilla se te va hacia dentro al correr o al sentadillar, este es tu seguro.'
    },
    'crunch-inverso': { pat: 'flex',
      nombre: 'Crunch inverso', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Abdomen inferior'], equipo: 'Nada',
      cues: ['Tumbado, manos al lado del cuerpo o bajo el sacro', 'Lleva las rodillas al pecho ENROLLANDO la pelvis, no solo doblando la cadera', 'La lumbar se despega un dedo del suelo: ese es todo el recorrido', 'Baja en 3″ sin dejar caer las piernas'],
      err: ['Coger impulso con las piernas', 'Arquear la lumbar al bajar', 'Buscar amplitud levantando la cadera entera'],
      alt: [{ n: 'Elevación de piernas suspendido', por: 'cuando tengas barra' }, { n: 'Dead bug', por: 'si la lumbar se despega sin control' }],
      mol: 'Si molesta la lumbar: manos bajo el sacro y recorta el recorrido a la mitad hasta que el control llegue.'
    },
    'curl-mochila': { pat: 'curl',
      nombre: 'Curl con mochila', mm: { p: ['biceps'], s: ['antebrazo'] }, zona: 'tiron', musc: ['Bíceps', 'antebrazo'], equipo: 'Mochila',
      cues: ['Agarra la mochila por el asa de arriba o por las dos correas', 'Codos pegados al cuerpo y FIJOS', 'Sube sin balancearte y baja en 3″', 'Progresas metiendo libros o botellas de agua'],
      err: ['Balancear el tronco para subir', 'Adelantar los codos en la parte alta', 'Cargar tanto la mochila que falle el agarre antes que el bíceps'],
      alt: [{ n: 'Curl con toalla auto-resistido', por: 'sin mochila: un brazo sube y el otro frena' }, { n: 'Curl con mancuernas', por: 'cuando tengas material' }],
      mol: 'Si molesta la muñeca: agarra por las dos correas en vez de por el asa, que deja la muñeca neutra.'
    },

    'flexion-declinada': { pat: 'eh',
      nombre: 'Flexiones declinadas', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Pectoral superior', 'hombro, tríceps'], equipo: 'Nada (silla o sofá)',
      cues: ['Pies en la silla, manos algo más anchas que los hombros', 'Cuanto más altos los pies, más peso llevas encima', 'Cuerpo en tabla: glúteo y abdomen apretados', 'Pecho casi al suelo en cada repetición'],
      err: ['Cadera en pico para aliviar', 'Bajar solo medio recorrido al subir la altura', 'Cuello adelantado buscando el suelo'],
      alt: [{ n: 'Flexiones normales', por: 'si aquí no salen 8 limpias' }, { n: 'Con los pies más altos', por: 'la progresión: cada palmo pesa más' }],
      mol: 'Es el escalón siguiente a las flexiones: cuando pases de 15 limpias, sube los pies en vez de contar hasta veinte.'
    },
    'pino-pared': { pat: 'ev',
      nombre: 'Flexión en pino contra pared', mm: { p: ['hombro'], s: ['triceps'] }, zona: 'empuje', musc: ['Deltoides', 'tríceps'], equipo: 'Nada (pared)',
      cues: ['De espaldas a la pared, sube los pies caminando hasta quedar casi vertical', 'Manos algo más anchas que los hombros, dedos abiertos agarrando el suelo', 'Baja SOLO lo que controles: al principio, dos dedos', 'Cuerpo apretado: sin arquear la lumbar'],
      err: ['Subir del todo el primer día: se empieza con el recorrido corto', 'Dejar caer la cabeza sin control', 'Arquear la espalda para compensar'],
      alt: [{ n: 'Flexiones en pica', por: 'la versión de partida, mucho más amable' }, { n: 'Con los pies en una silla en vez de la pared', por: 'paso intermedio' }],
      mol: 'Es la variante avanzada del empuje vertical: solo si las flexiones en pica te salen a 15 limpias y el hombro no dice nada. Con molestia de hombro, no toca.'
    },
    'remo-mesa': { pat: 'th',
      nombre: 'Remo invertido bajo la mesa', mm: { p: ['dorsal'], s: ['biceps', 'espalda-alta'] }, zona: 'tiron', musc: ['Dorsal', 'espalda alta, bíceps'], equipo: 'Nada (mesa firme)',
      cues: ['Túmbate bajo una mesa sólida y agárrala por el borde', 'Cuerpo en tabla desde talones a hombros', 'Tira llevando el PECHO a la mesa, codos al costado', 'Aprieta las escápulas 1″ arriba y baja en 3″'],
      err: ['Sacar la cadera antes que el pecho', 'Tirar solo con los brazos sin juntar escápulas', 'Usar una mesa que se levante: compruébala antes'],
      alt: [{ n: 'Con las rodillas dobladas y los pies en el suelo', por: 'la versión fácil' }, { n: 'Con los pies en una silla', por: 'la progresión: más horizontal, más peso' }],
      mol: 'Este es el tirón que de verdad carga sin barra: si tienes una mesa firme, prefiérelo al jalón con toalla.'
    },
    'pistol-asistida': { pat: 'rod',
      nombre: 'Sentadilla a una pierna asistida', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Cuádriceps', 'glúteo'], equipo: 'Nada (silla)',
      cues: ['De pie frente a una silla, un pie en el suelo y el otro estirado delante', 'Baja en 3″ hasta rozar la silla con el glúteo y sube sin sentarte', 'Rodilla alineada con el pie, sin caer hacia dentro', 'Brazos al frente hacen de contrapeso'],
      err: ['Dejarte caer en la silla y rebotar', 'Rodilla hacia dentro (ahí es donde se paga)', 'Talón que se levanta: baja menos hasta que el tobillo dé'],
      alt: [{ n: 'Con las dos piernas, sentadilla al peso corporal', por: 'la versión de partida' }, { n: 'Con una silla más baja', por: 'la progresión, hasta llegar a la pistol completa' }],
      mol: 'Si la rodilla molesta: sube la altura de la silla y frena la bajada. Es progresión de sentadilla, no un salto al vacío: 8 limpias con las dos piernas antes de intentarla a una.'
    },
    'curl-toalla': { pat: 'curl',
      nombre: 'Curl con toalla auto-resistido', mm: { p: ['biceps'], s: ['antebrazo'] }, zona: 'tiron', musc: ['Bíceps', 'antebrazo'], equipo: 'Toalla',
      cues: ['Un pie pisa un extremo de la toalla, la mano sube por el otro', 'El brazo libre puede tirar hacia abajo para poner más resistencia', 'Codo pegado al cuerpo y fijo', 'Sube en 2″, baja en 3″ sin soltar tensión'],
      err: ['Soltar la tensión arriba o abajo', 'Balancear el tronco', 'Poner tanta resistencia que el movimiento se corte a la mitad'],
      alt: [{ n: 'Curl con mochila', por: 'más medible: puedes pesar lo que metes' }, { n: 'Curl con mancuernas', por: 'cuando tengas material' }],
      mol: 'Sin nada en casa es el recambio del curl: no se mide en kilos, se mide en cuánto aguantas la bajada.'
    },

    'zancada-bulgara-pc': { pat: 'zan',
      nombre: 'Zancada búlgara al peso corporal', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Cuádriceps', 'glúteo'], equipo: 'Nada (silla)',
      cues: ['Empeine del pie de atrás sobre la silla, el de delante a un paso largo', 'Baja recto, la rodilla de atrás hacia el suelo', 'El peso vive en el talón de delante', 'Baja en 3″ y sube sin rebotar'],
      err: ['Poner el pie de delante demasiado cerca (la rodilla se adelanta y paga)', 'Inclinarte hacia delante para llegar', 'Rebotar abajo con la rodilla de atrás'],
      alt: [{ n: 'Zancada alterna en el sitio', por: 'la versión de partida' }, { n: 'Con una mochila cargada', por: 'la progresión cuando 12 salen fáciles' }],
      mol: 'Si la rodilla molesta: aleja un palmo el pie de delante y baja menos. Es de las que más pierna dan sin material, pero pide equilibrio: agárrate a una pared las primeras veces.'
    },
    'puente-1p': { pat: 'bis',
      nombre: 'Puente de glúteo a una pierna', mm: { p: ['gluteo'], s: ['isquios'] }, zona: 'pierna', musc: ['Glúteo mayor', 'isquiotibiales'], equipo: 'Nada',
      cues: ['Tumbado, un pie apoyado y la otra pierna estirada al frente', 'Sube empujando con el TALÓN hasta alinear cadera y muslo', 'Aprieta el glúteo 2″ arriba, sin arquear la lumbar', 'Baja en 3″ sin apoyar del todo'],
      err: ['Subir arqueando la espalda en vez de apretando el glúteo', 'Cadera que se descuelga hacia un lado', 'Apoyar el pie tan lejos que trabaje el isquio y no el glúteo'],
      alt: [{ n: 'Puente con los dos pies', por: 'la versión de partida' }, { n: 'Con los hombros en el sofá', por: 'más recorrido, más glúteo' }],
      mol: 'Si la lumbar se mete: acerca el talón al glúteo y sube menos. La cadera no debe rotar: si se cae de un lado, vuelve a dos piernas.'
    },
    'elev-piernas-suelo': { pat: 'flex',
      nombre: 'Elevación de piernas tumbado', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Abdomen inferior'], equipo: 'Nada',
      cues: ['Tumbado, manos bajo el sacro y lumbar PEGADA al suelo', 'Sube las piernas rectas hasta la vertical', 'Baja en 3″ y para donde la lumbar empiece a despegarse', 'Ese punto es tu recorrido: irá bajando cada semana'],
      err: ['Dejar que la lumbar se arquee al bajar (el error que lesiona)', 'Coger impulso con las piernas', 'Bajar más de lo que el abdomen aguanta'],
      alt: [{ n: 'Crunch inverso', por: 'la versión de partida' }, { n: 'Elevación de piernas suspendido', por: 'cuando tengas barra' }],
      mol: 'Es la progresión del crunch inverso: si la lumbar se despega, dobla un poco las rodillas y recorta el recorrido hasta que aguante.'
    },
    'elev-talon-1p': { pat: 'gem',
      nombre: 'Elevación de talón a una pierna', mm: { p: ['gemelos'], s: [] }, zona: 'pierna', musc: ['Gemelo y sóleo'], equipo: 'Nada (escalón)',
      cues: ['Media planta en el borde de un escalón, la otra pierna recogida', 'Baja el talón todo lo que dé y aguanta 1″ abajo', 'Sube vertical, pausa de 1″ arriba: sin rebotes', 'Apóyate en la pared solo para el equilibrio'],
      err: ['Rebotar aprovechando el reflejo del tendón: quita justo el estímulo que buscamos', 'Medio recorrido', 'Cargar el peso en la mano que se apoya'],
      alt: [{ n: 'Elevación de talones a dos piernas', por: 'la versión de partida' }, { n: 'Con una mochila cargada', por: 'cuando 20 por pierna salgan fáciles' }],
      mol: 'Si el Aquiles incomoda: solo isométricos arriba, 3×30″ esa semana. Este es el seguro del tendón para el trote: no lo saltes.'
    },
    'plancha-lateral': { pat: 'core',
      nombre: 'Plancha lateral', mm: { p: ['abdomen'], s: ['gluteo'] }, zona: 'core', musc: ['Oblicuos', 'glúteo medio'], equipo: 'Nada',
      cues: ['Codo bajo el hombro, cuerpo en línea de tobillo a cabeza', 'Sube la cadera y MANTÉNLA: el suelo no la toca', 'Hombro lejos de la oreja', 'Aguanta el tiempo marcado por cada lado'],
      err: ['Cadera caída (deja de trabajar el oblicuo)', 'Rodar el pecho hacia el suelo', 'Aguantar la respiración'],
      alt: [{ n: 'Con las rodillas apoyadas', por: 'la versión de partida' }, { n: 'Con la pierna de arriba elevada', por: 'la progresión, que además pide glúteo medio' }],
      mol: 'Si el hombro molesta: apoya en la mano con el brazo estirado, o hazla de rodillas. Es el complemento lateral de la plancha: el core no solo aguanta de frente.'
    },

    'elev-y-suelo': { pat: 'ais',
      nombre: 'Elevación en Y tumbado', mm: { p: ['hombro'], s: ['espalda-alta'] }, zona: 'empuje', musc: ['Hombro (manguito)', 'trapecio inferior'], equipo: 'Nada',
      cues: ['Boca abajo, brazos estirados formando una Y con pulgares al techo', 'Sube los brazos SIN encoger los hombros: el cuello queda largo', 'Aguanta 2″ arriba y baja en 3″', 'La frente no se despega: el movimiento es de escápula, no de cuello'],
      err: ['Encoger los hombros hacia las orejas', 'Levantar la cabeza para ayudar', 'Ir rápido: aquí no hay peso, el estímulo es el control'],
      alt: [{ n: 'Rotación externa con banda', por: 'cuando tengas banda' }, { n: 'Con una botella pequeña en cada mano', por: 'la progresión: pesa poco y se nota' }],
      mol: 'Es el ejercicio de hombro del protocolo del tendón, sin material: el manguito no gana con peso, gana con control. Si el hombro molesta, este es de los pocos que suele sentar bien.'
    },
    'curl-nordico': { pat: 'ais',
      nombre: 'Curl nórdico asistido', mm: { p: ['isquios'], s: [] }, zona: 'pierna', musc: ['Isquiotibiales'], equipo: 'Nada (algo que sujete los tobillos)',
      cues: ['De rodillas sobre algo blando, tobillos sujetos bajo un mueble firme', 'Baja MUY despacio manteniendo cadera y hombros en línea', 'Aguanta hasta donde puedas y amortigua con las manos', 'Vuelve empujándote con los brazos: la subida no cuenta'],
      err: ['Doblar la cadera para hacerlo más fácil (deja de trabajar el isquio)', 'Dejarte caer sin frenar', 'Empezar por el recorrido completo: se gana centímetro a centímetro'],
      alt: [{ n: 'Puente de glúteo a una pierna', por: 'si el nórdico todavía queda grande' }, { n: 'Curl femoral en máquina', por: 'en gimnasio' }],
      mol: 'Es el trabajo de isquiotibiales más potente sin material, y también el que más agujetas deja: empieza con 3 repeticiones y sube de una en una. Si la rodilla molesta, ponte una toalla doblada debajo.'
    },
    'encogimiento-mochila': { pat: 'ais',
      nombre: 'Encogimientos con mochila', mm: { p: ['espalda-alta'], s: ['antebrazo'] }, zona: 'tiron', musc: ['Trapecio superior'], equipo: 'Mochila',
      cues: ['Mochila colgada de las dos manos o abrazada al pecho', 'Sube los hombros RECTOS hacia las orejas, sin rotarlos', 'Aprieta 2″ arriba y baja controlando', 'Cuello relajado: no empujes la barbilla adelante'],
      err: ['Rotar los hombros hacia atrás (no aporta y carga el cuello)', 'Usar impulso de piernas', 'Medio recorrido'],
      alt: [{ n: 'Encogimientos con mancuernas', por: 'cuando tengas material' }, { n: 'Con la mochila más cargada', por: 'la progresión: aquí sí puedes pesar lo que metes' }],
      mol: 'Si notas tensión en el cuello: baja la carga y sube menos. El trapecio superior ya trabaja bastante en el día a día; con dos series bien hechas basta.'
    },

    /* — Gym: empuje — */
    'press-banca': { pat: 'eh',
      nombre: 'Press banca', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Pectoral', 'tríceps, deltoides anterior'], equipo: 'Barra + banco',
      cues: ['Escápulas retraídas y CLAVADAS al banco, pies firmes en el suelo', 'Agarre: antebrazo vertical cuando la barra toca el pecho', 'Barra baja al pecho medio, codos ~45°', 'Toca el pecho con control y empuja en línea ligeramente diagonal'],
      err: ['Hombros que se encogen al empujar (pierdes la retracción)', 'Rebotar la barra en el pecho', 'Culo despegado del banco', 'Muñecas dobladas hacia atrás'],
      alt: [{ n: 'Press en máquina (chest press)', por: 'días sin ganas de montar banco o gym lleno' }, { n: 'Press con mancuernas plano', por: 'más rango y menos hombro' }],
      mol: 'Si molesta el hombro: prueba agarre algo más estrecho y codos más pegados; si sigue, mancuernas con giro neutro.'
    },
    'press-inclinado-mc': { pat: 'eh',
      nombre: 'Press inclinado con mancuernas', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Pectoral superior', 'hombro, tríceps'], equipo: 'Mancuernas + banco 30°',
      cues: ['Banco a 30° (un punto, no la pared)', 'Baja hasta notar estiramiento en el pectoral', 'Codos a 45-60°, muñecas neutras', 'Sube sin chocar las mancuernas arriba'],
      err: ['Banco demasiado vertical (se vuelve press de hombro)', 'Rebotar abajo', 'Arquear la lumbar exageradamente'],
      alt: [{ n: 'Press inclinado en multipower', por: 'si el gym está lleno o quieres estabilidad' }, { n: 'Press inclinado con barra', por: 'ya programado en Push B de F4' }],
      mol: 'Si molesta el hombro: reduce el rango abajo 5 cm y gira ligeramente las palmas hacia dentro.'
    },
    'press-inclinado-barra': { pat: 'eh',
      nombre: 'Press inclinado con barra', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Pectoral superior', 'hombro, tríceps'], equipo: 'Barra + banco inclinado',
      cues: ['Banco 30-45°, escápulas clavadas', 'La barra baja a la parte alta del pecho (clavículas)', 'Antebrazos verticales al tocar'],
      err: ['Bajar la barra al pecho medio (te obliga a abrir codos)', 'Rebotar'],
      alt: [{ n: 'Multipower inclinado', por: 'misma sesión, más guía' }, { n: 'Mancuernas inclinado', por: 'si no hay banco de inclinado con soportes' }],
      mol: 'Si molesta el hombro: vuelve a mancuernas, que permiten girar el agarre.'
    },
    'press-plano-mc': { pat: 'eh',
      nombre: 'Press plano con mancuernas', mm: { p: ['pecho'], s: ['triceps'] }, zona: 'empuje', musc: ['Pectoral', 'tríceps'], equipo: 'Mancuernas + banco',
      cues: ['Más rango que la barra: aprovéchalo abajo con control', 'Sube en arco, sin chocar arriba', 'Pies firmes, escápulas atrás'],
      err: ['Dejar caer las mancuernas abajo sin frenar', 'Convertirlo en press de hombro abriendo demasiado los codos'],
      alt: [{ n: 'Máquina de press', por: 'fatiga alta o sin banco libre' }],
      mol: 'Si molesta el hombro: agarre neutro (palmas enfrentadas).'
    },
    'press-militar': { pat: 'ev',
      nombre: 'Press militar', mm: { p: ['hombro'], s: ['triceps', 'abdomen'] }, zona: 'empuje', musc: ['Hombro', 'tríceps, core'], equipo: 'Barra (de pie o sentado)',
      cues: ['De pie: glúteo y abdomen APRETADOS antes de empujar', 'La barra sale del mentón y sube pegada a la cara', 'Cabeza "atraviesa la ventana" al final', 'Sentado con respaldo: sin arquear la lumbar'],
      err: ['Arquear la lumbar para convertirlo en press inclinado', 'Empujar la barra hacia delante (choca con la barbilla)', 'Rango incompleto arriba'],
      alt: [{ n: 'Press militar con mancuernas sentado', por: 'ya programado en F2; más amable con hombro' }, { n: 'Press en máquina de hombro', por: 'última sesión de la semana con fatiga' }],
      mol: 'Si molesta el hombro: mancuernas con agarre neutro y sube solo hasta donde no haya pinzamiento.'
    },
    'press-militar-mc': { pat: 'ev',
      nombre: 'Press militar con mancuernas sentado', mm: { p: ['hombro'], s: ['triceps'] }, zona: 'empuje', musc: ['Hombro', 'tríceps'], equipo: 'Mancuernas + banco con respaldo',
      cues: ['Respaldo alto, lumbar apoyada sin arquear', 'Codos ligeramente por delante del cuerpo, no en cruz', 'Recorrido completo sin chocar arriba'],
      err: ['Arquear la lumbar despegándola del respaldo', 'Bajar solo hasta las orejas'],
      alt: [{ n: 'Máquina de press de hombro', por: 'equivalente directo' }],
      mol: 'Si molesta el hombro: agarre neutro y baja solo hasta 90° de codo.'
    },
    'elev-laterales': { pat: 'ev',
      nombre: 'Elevaciones laterales', mm: { p: ['hombro'], s: [] }, zona: 'empuje', musc: ['Deltoides lateral'], equipo: 'Mancuernas',
      cues: ['Peso LIGERO, codos algo flexionados', 'Sube hasta la horizontal, como sirviendo dos jarras', 'Sin impulso: si balanceas, sobra peso', 'Baja en 2″'],
      err: ['Subir con trapecio encogiendo hombros', 'Pasar de la horizontal', 'Balanceo de cadera'],
      alt: [{ n: 'Laterales en polea baja', por: 'tensión continua; programadas en Push B' }, { n: 'Máquina de laterales', por: 'para acabar sin pensar en técnica' }],
      mol: 'Si molesta el hombro: pulgar ligeramente hacia arriba y sube 10° por delante del plano lateral.'
    },
    'laterales-polea': { pat: 'ev',
      nombre: 'Elevaciones laterales en polea', mm: { p: ['hombro'], s: [] }, zona: 'empuje', musc: ['Deltoides lateral'], equipo: 'Polea baja',
      cues: ['Polea a la altura de la muñeca con el brazo caído', 'Cuerpo estable, sube hasta la horizontal', 'La polea mantiene tensión también abajo: aprovéchala'],
      err: ['Ponerse demasiado lejos de la polea', 'Tirar con el trapecio'],
      alt: [{ n: 'Mancuernas', por: 'si las poleas están ocupadas' }],
      mol: 'Igual que con mancuernas: pulgar arriba y plano ligeramente adelantado.'
    },
    'fondos': { pat: 'ev', pic: 'fondos',
      nombre: 'Fondos asistidos', mm: { p: ['pecho'], s: ['triceps'] }, zona: 'empuje', musc: ['Pectoral inferior', 'tríceps'], equipo: 'Máquina de fondos asistidos o bandas',
      cues: ['Cuerpo ligeramente inclinado adelante (más pecho)', 'Baja hasta 90° de codo, no más si el hombro protesta', 'Codos que no se abran en cruz'],
      err: ['Bajar demasiado profundo', 'Hombros encogidos hacia las orejas'],
      alt: [{ n: 'Press declinado o fondos entre bancos', por: 'si no hay máquina asistida' }],
      mol: 'Si molesta el esternón u hombro: sustituye por press plano con mancuernas.'
    },
    'ext-triceps-polea': { pat: 'ext',
      nombre: 'Extensión de tríceps en polea', mm: { p: ['triceps'], s: [] }, zona: 'empuje', musc: ['Tríceps'], equipo: 'Polea alta + cuerda o barra',
      cues: ['Codos pegados al cuerpo, FIJOS', 'Solo se mueve el antebrazo', 'Extiende del todo y aprieta 1″'],
      err: ['Codos que se adelantan al bajar (metes hombro)', 'Balanceo del tronco'],
      alt: [{ n: 'Con cuerda separando abajo', por: 'algo más de cabeza larga' }, { n: 'Patada de tríceps con mancuerna', por: 'sin polea libre' }],
      mol: 'Si molesta el codo: baja el peso y sube las reps a 15-20; el codo odia el ego.'
    },
    'ext-triceps-cabeza': { pat: 'ext',
      nombre: 'Extensión sobre cabeza (cuerda)', mm: { p: ['triceps'], s: [] }, zona: 'empuje', musc: ['Tríceps (cabeza larga)'], equipo: 'Polea + cuerda',
      cues: ['De espaldas a la polea, cuerda tras la nuca', 'Codos apuntando al frente, extiende arriba', 'Estiramiento real abajo: ahí crece la cabeza larga'],
      err: ['Abrir los codos en cruz', 'Rango corto por exceso de peso'],
      alt: [{ n: 'Press francés con barra Z', por: 'mismo patrón tumbado' }],
      mol: 'Si molesta el codo: igual que la polea normal — menos peso, más reps.'
    },
    'press-frances': { pat: 'ext',
      nombre: 'Press francés', mm: { p: ['triceps'], s: [] }, zona: 'empuje', musc: ['Tríceps (cabeza larga)'], equipo: 'Barra Z + banco',
      cues: ['Tumbado, barra baja hacia la frente o algo detrás', 'Codos apuntando al techo, quietos', 'Baja en 2-3″, extiende sin bloquear con golpe'],
      err: ['Codos que se abren', 'Convertirlo en press cerrado moviendo el hombro'],
      alt: [{ n: 'Extensión sobre cabeza en polea', por: 'más tensión continua, menos estrés de codo' }],
      mol: 'Si molesta el codo: cámbialo directamente por extensiones en polea a 15 reps.'
    },

    /* — Gym: tirón — */
    'remo-barra': { pat: 'th',
      nombre: 'Remo con barra', mm: { p: ['dorsal'], s: ['biceps', 'espalda-alta'] }, zona: 'tiron', musc: ['Dorsal', 'espalda media, bíceps'], equipo: 'Barra',
      cues: ['Torso a ~45°, rodillas semiflexionadas', 'Tira de la barra hacia el abdomen bajo', 'Escápulas atrás y abajo al final', 'Espalda NEUTRA innegociable'],
      err: ['Dar tirones con la lumbar (te meces)', 'Torso que se levanta rep a rep', 'Tirar hacia el pecho con codos abiertos'],
      alt: [{ n: 'Remo en punta (T-bar)', por: 'variante más estable' }, { n: 'Remo en máquina con apoyo de pecho', por: 'si la lumbar va cargada del día de pierna' }],
      mol: 'Si protesta la lumbar: máquina con apoyo de pecho o remo en polea, sin dudarlo.'
    },
    'remo-polea': { pat: 'th',
      nombre: 'Remo en polea sentado', mm: { p: ['espalda-alta'], s: ['biceps', 'dorsal'] }, zona: 'tiron', musc: ['Espalda media', 'dorsal, bíceps'], equipo: 'Polea baja + triángulo',
      cues: ['Pecho alto y FIJO: el tronco no viaja', 'Tira del triángulo al ombligo', 'Pausa 1″ apretando escápulas'],
      err: ['Balancear el tronco para mover más peso', 'Hombros encogidos'],
      alt: [{ n: 'Remo en máquina', por: 'equivalente directo' }],
      mol: 'Si molesta la lumbar: apoya el pecho en una máquina de remo con soporte.'
    },
    'remo-mancuerna': { pat: 'th',
      nombre: 'Remo con mancuerna a 1 brazo', mm: { p: ['dorsal'], s: ['espalda-alta'] }, zona: 'tiron', musc: ['Dorsal', 'espalda media'], equipo: 'Mancuerna + banco',
      cues: ['Rodilla y mano en el banco, espalda neutra', 'Tira del codo hacia la cadera, no hacia el hombro', 'Sin girar el tronco al subir'],
      err: ['Encoger el hombro al inicio del tirón', 'Rotar el torso para "ayudar"', 'Rango corto'],
      alt: [{ n: 'Remo en polea a 1 brazo', por: 'tensión más constante' }],
      mol: 'Sin apoyo bueno molesta la lumbar: usa banco inclinado y apoya el pecho.'
    },
    'jalon-pecho': { pat: 'tv',
      nombre: 'Jalón al pecho', mm: { p: ['dorsal'], s: ['biceps'] }, zona: 'tiron', musc: ['Dorsal', 'bíceps'], equipo: 'Polea alta',
      cues: ['Agarre algo más ancho que los hombros', 'Pecho arriba, ligera inclinación atrás FIJA', 'Tira de los CODOS hacia los bolsillos', 'Barra a la clavícula, 1″ de pausa'],
      err: ['Mecerse para dar el tirón', 'Tirar con los brazos sin deprimir escápulas', 'Barra tras la nuca (no)'],
      alt: [{ n: 'Dominadas asistidas', por: 'el objetivo de F3 es migrar hacia ellas' }, { n: 'Jalón agarre estrecho', por: 'programado en Pull B' }],
      mol: 'Si molesta el hombro: agarre neutro (triángulo ancho) y baja el peso.'
    },
    'jalon-estrecho': { pat: 'tv',
      nombre: 'Jalón agarre estrecho', mm: { p: ['dorsal'], s: ['biceps'] }, zona: 'tiron', musc: ['Dorsal', 'bíceps'], equipo: 'Polea alta + triángulo',
      cues: ['Triángulo o agarre supino al ancho de hombros', 'Codos pegados que bajan al costado', 'Estira del todo arriba: el dorsal trabaja largo'],
      err: ['Convertirlo en remo inclinándose demasiado', 'Media repetición arriba'],
      alt: [{ n: 'Dominadas supinas asistidas', por: 'equivalente con peso corporal' }],
      mol: 'Si molesta el codo: agarre neutro y muñecas rectas.'
    },
    'dominadas': { pat: 'tv',
      nombre: 'Dominadas (asistidas → libres → lastradas)', mm: { p: ['dorsal'], s: ['biceps', 'abdomen'] }, zona: 'tiron', musc: ['Dorsal', 'bíceps, core'], equipo: 'Barra + máquina asistida o bandas',
      cues: ['Inicia deprimiendo escápulas (hombros lejos de orejas)', 'Tira de los codos hacia abajo, barbilla sobre la barra', 'Baja CONTROLANDO hasta brazos casi rectos', 'Reduce asistencia semana a semana: saldrán antes de lo que crees'],
      err: ['Patalear e impulsarse', 'Media dominada (ni arriba ni abajo)', 'Colgarse en los hombros abajo sin tensión escapular'],
      alt: [{ n: 'Jalón al pecho prono pesado', por: 'si no hay máquina asistida ese día' }, { n: 'Dominadas negativas (salto + bajada 5″)', por: 'gran constructor de la primera dominada' }],
      mol: 'Si molesta el codo: agarre neutro. Si molesta el hombro: no te cuelgues pasivo abajo.',
      hito: 'dominada-libre'
    },
    'pullover-polea': { pat: 'tv',
      nombre: 'Pullover en polea', mm: { p: ['dorsal'], s: [] }, zona: 'tiron', musc: ['Dorsal (aislado)'], equipo: 'Polea alta + barra o cuerda',
      cues: ['Brazos casi rectos, bisagra solo en el hombro', 'Lleva la barra al muslo dibujando un arco', 'Estiramiento arriba, apretón abajo'],
      err: ['Doblar los codos (se vuelve extensión de tríceps)', 'Mecer el tronco'],
      alt: [{ n: 'Pullover con mancuerna en banco', por: 'sin polea libre' }],
      mol: 'Si molesta el hombro: reduce el arco arriba.'
    },
    'face-pull': { pat: 'tv',
      nombre: 'Face pull', mm: { p: ['hombro'], s: ['espalda-alta'] }, zona: 'tiron', musc: ['Deltoides posterior', 'rotadores, trapecio medio'], equipo: 'Polea alta + cuerda',
      cues: ['Polea a la altura de la cara', 'Tira de la cuerda HACIA LA FRENTE separando los extremos', 'Al final, rota los hombros hacia fuera (bíceps apuntan al techo)', 'Ligero y perfecto: es salud de hombro, no ego'],
      err: ['Convertirlo en remo alto con peso', 'Sin rotación externa final'],
      alt: [{ n: 'Aperturas invertidas en máquina (reverse pec-deck)', por: 'deltoides posterior sin cuerda' }, { n: 'Rotación externa con banda', por: 'en casa o como extra' }],
      mol: 'Es el ejercicio que arregla hombros; si molesta, baja peso y revisa que tiras a la frente, no al cuello.'
    },
    'encogimientos': { pat: 'ais',
      nombre: 'Encogimientos con mancuernas', mm: { p: ['espalda-alta'], s: [] }, zona: 'tiron', musc: ['Trapecio superior'], equipo: 'Mancuernas',
      cues: ['Hombros hacia las orejas, pausa 1″ arriba', 'Brazos como cuerdas: no dobles los codos', 'Baja controlado y estira'],
      err: ['Girar los hombros en círculo (no aporta y roza)', 'Rebotar con las piernas'],
      alt: [{ n: 'Con barra', por: 'más carga total' }],
      mol: 'Si molesta el cuello: mira al frente y no metas la barbilla.'
    },

    /* — Gym: pierna/cadera — */
    'sentadilla-barra': { pat: 'rod',
      nombre: 'Sentadilla con barra', mm: { p: ['cuadriceps'], s: ['abdomen', 'gluteo'] }, zona: 'pierna', musc: ['Cuádriceps', 'glúteo, core'], equipo: 'Barra + rack',
      cues: ['Barra sobre trapecio, no sobre cervicales', 'Core presurizado ANTES de bajar (coge aire al pecho-abdomen)', 'Baja al paralelo, rodillas hacia fuera', 'Empuja el suelo, pecho alto al subir'],
      err: ['Talones que se levantan (culpa de tobillos: eleva talones con discos si hace falta)', 'Rodillas que colapsan hacia dentro al subir', 'Buenos días: la cadera sube antes que el pecho'],
      alt: [{ n: 'Sentadilla en multipower', por: 'días de fatiga o rack ocupado' }, { n: 'Hack squat / prensa', por: 'estímulo de cuádriceps sin carga axial' }, { n: 'Sentadilla goblet con mancuerna', por: 'como calentamiento o si la técnica se pierde' }],
      mol: 'Si molesta la rodilla: sube el tempo de bajada (3″) y quédate 5 cm por encima del punto molesto. Si molesta la lumbar: revisa la presurización y baja 20% el peso una semana.'
    },
    'prensa': { pat: 'rod',
      nombre: 'Prensa', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Cuádriceps', 'glúteo'], equipo: 'Máquina de prensa',
      cues: ['Pies a media altura de la plataforma, ancho de hombros', 'Baja hasta 90° SIN despegar la lumbar del respaldo', 'Empuja con toda la planta, no bloquees las rodillas de golpe'],
      err: ['Bajar tanto que la pelvis rota (butt wink en prensa = lumbar)', 'Manos empujando las rodillas'],
      alt: [{ n: 'Hack squat', por: 'más cuádriceps aún' }, { n: 'Prensa a una pierna', por: 'si hay descompensación' }],
      mol: 'Si molesta la rodilla: pies algo más altos en la plataforma (más glúteo, menos rodilla).'
    },
    'rdl-barra': { pat: 'bis',
      nombre: 'Peso muerto rumano', mm: { p: ['isquios'], s: ['gluteo', 'lumbar'] }, zona: 'pierna', musc: ['Femoral', 'glúteo, lumbar isométrico'], equipo: 'Barra',
      cues: ['Cadera ATRÁS, rodillas semiflexionadas fijas', 'Barra pegada a las piernas todo el viaje', 'Espalda neutra: pecho orgulloso', 'Baja hasta notar el estiramiento fuerte del femoral y sube apretando glúteo'],
      err: ['Redondear la espalda para bajar más', 'Doblar rodillas y convertirlo en media sentadilla', 'Barra que se aleja del cuerpo'],
      alt: [{ n: 'RDL con mancuernas', por: 'agarre más cómodo las primeras semanas' }, { n: 'Hiperextensiones 45° cargadas', por: 'femoral-glúteo sin carga de agarre' }],
      mol: 'El estiramiento del femoral es la señal de que lo haces BIEN. Si molesta la lumbar (no el femoral): baja 20% y graba una serie de lado.'
    },
    'hip-thrust': { pat: 'bis',
      nombre: 'Hip thrust', mm: { p: ['gluteo'], s: ['isquios'] }, zona: 'pierna', musc: ['Glúteo', 'femoral'], equipo: 'Barra + banco (+ protector)',
      cues: ['Espalda alta apoyada en el banco, barra sobre la cadera con protector', 'Barbilla al pecho, mirada al frente-abajo', 'Sube hasta la horizontal EXACTA, pausa 1″ apretando', 'Rodillas a 90° arriba, talones bajo las rodillas'],
      err: ['Arquear la lumbar arriba (hiperextensión)', 'Empujar con la punta de los pies', 'Rebotar abajo sin pausa'],
      alt: [{ n: 'Máquina de hip thrust', por: 'si el gym la tiene, montaje mucho más rápido' }, { n: 'Puente con barra en el suelo', por: 'sin banco libre' }],
      mol: 'Si molesta la lumbar: es casi siempre hiperextensión arriba; para en horizontal.'
    },
    'zancada-mc': { pat: 'zan',
      nombre: 'Zancada con mancuernas', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Cuádriceps', 'glúteo'], equipo: 'Mancuernas',
      cues: ['Misma técnica que en casa, ahora con 6-10 kg por mano', 'Paso amplio, tronco vertical, rodilla trasera roza el suelo', 'Las mancuernas cuelgan pegadas al cuerpo, hombros atrás', 'Empuja con el talón delantero para volver'],
      err: ['Paso corto que colapsa la rodilla delantera', 'Inclinarse adelante al fatigarte', 'Mirar al suelo y perder la línea'],
      alt: [{ n: 'Zancada atrás con mancuernas', por: 'más amable con la rodilla' }, { n: 'Zancada en multipower', por: 'si el equilibrio limita la carga' }],
      mol: 'Si molesta la rodilla: paso más largo y cambia a zancada atrás.'
    },
    'zancada-bulgara': { pat: 'zan',
      nombre: 'Zancada búlgara', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Cuádriceps', 'glúteo'], equipo: 'Banco + mancuernas',
      cues: ['Pie trasero en el banco, delantero a un paso largo', 'Baja VERTICAL: la rodilla trasera busca el suelo', 'Tronco ligeramente inclinado = más glúteo; vertical = más cuádriceps', 'Empieza SOLO con peso corporal, en serio'],
      err: ['Pie delantero demasiado cerca (rodilla sufre)', 'Rebotar abajo', 'Perder el equilibrio por mirar al techo'],
      alt: [{ n: 'Zancada estática con mancuernas', por: 'si el equilibrio no está aún' }, { n: 'Prensa a una pierna', por: 'unilateral sin equilibrio' }],
      mol: 'Si molesta la rodilla delantera: alarga el paso y desplaza el tronco un poco adelante.'
    },
    'ext-cuadriceps': { pat: 'rod',
      nombre: 'Extensión de cuádriceps', mm: { p: ['cuadriceps'], s: [] }, zona: 'pierna', musc: ['Cuádriceps (aislado)'], equipo: 'Máquina',
      cues: ['Rodilla alineada con el eje de la máquina', 'Extiende del todo con pausa 1″ arriba', 'Baja en 2-3″'],
      err: ['Dar patadas con impulso', 'Culo que se despega del asiento'],
      alt: [{ n: 'Sissy squat asistido', por: 'sin máquina' }],
      mol: 'Si molesta la rótula: recorta el último tercio ARRIBA no abajo, y tempo más lento. Es también tu ejercicio de rehabilitación si un día la rodilla protesta del trote.'
    },
    'curl-femoral-tumbado': { pat: 'ais',
      nombre: 'Curl femoral tumbado', mm: { p: ['isquios'], s: [] }, zona: 'pierna', musc: ['Femoral (aislado)'], equipo: 'Máquina',
      cues: ['Cadera PEGADA al banco todo el tiempo', 'Sube en 1″, baja en 2-3″', 'Punta del pie neutra'],
      err: ['Levantar la cadera para ayudar', 'Media repetición'],
      alt: [{ n: 'Curl femoral sentado', por: 'de hecho algo mejor para el femoral; úsalo si está libre' }, { n: 'Curl nórdico asistido', por: 'versión avanzada, más adelante' }],
      mol: 'Si hay calambre: estira el femoral entre series, es normal las primeras semanas.'
    },
    'curl-femoral-sentado': { pat: 'ais',
      nombre: 'Curl femoral sentado', mm: { p: ['isquios'], s: [] }, zona: 'pierna', musc: ['Femoral (aislado)'], equipo: 'Máquina',
      cues: ['Muslo bien fijado por la almohadilla', 'Flexiona del todo, pausa 1″', 'Vuelve lento resistiendo'],
      err: ['Culo que se desliza hacia delante', 'Rango corto por exceso de peso'],
      alt: [{ n: 'Curl femoral tumbado', por: 'equivalente' }],
      mol: 'Sin incidencias típicas: es de lo más seguro del plan.'
    },
    'gemelo-pie': { pat: 'gem',
      nombre: 'Gemelo de pie', mm: { p: ['gemelos'], s: [] }, zona: 'pierna', musc: ['Gemelo (gastrocnemio)'], equipo: 'Máquina o multipower + escalón',
      cues: ['Pausa 1″ ARRIBA y 1″ ABAJO: sin rebote', 'Estiramiento completo abajo', 'Sube vertical, sin doblar rodillas'],
      err: ['Rebotar aprovechando el reflejo del tendón (le quita el estímulo justo al tejido que queremos preparar)', 'Rango medio'],
      alt: [{ n: 'En prensa', por: 'sin máquina específica' }],
      mol: 'Si molesta el Aquiles: solo isométricos arriba 3×30″ esa semana.'
    },
    'gemelo-sentado': { pat: 'gem',
      nombre: 'Gemelo sentado', mm: { p: ['gemelos'], s: [] }, zona: 'pierna', musc: ['Sóleo'], equipo: 'Máquina',
      cues: ['Rodilla a 90°: aquí trabaja el sóleo, clave para TROTAR', 'Misma regla: pausa arriba y abajo, sin rebotes'],
      err: ['Ir rápido a rebotes', 'Poner el apoyo en la punta de los dedos (mejor en la base)'],
      alt: [{ n: 'Sentado con mancuernas sobre rodillas + escalón', por: 'sin máquina' }],
      mol: 'Igual que el de pie: molestia de Aquiles = solo isométricos una semana.'
    },
    'elev-piernas': { pat: 'flex',
      nombre: 'Elevación de piernas colgado', mm: { p: ['abdomen'], s: ['antebrazo'] }, zona: 'core', musc: ['Abdomen inferior', 'flexores, agarre'], equipo: 'Barra de dominadas',
      cues: ['Cuelga activo (hombros lejos de orejas)', 'Sube las rodillas al pecho SIN balanceo', 'Baja controlado del todo'],
      err: ['Columpiarse', 'Tirar solo de flexores de cadera con lumbar arqueada'],
      alt: [{ n: 'En paralelas (apoyo de codos)', por: 'si el agarre falla antes que el abdomen' }, { n: 'Elevaciones tumbado', por: 'versión inicial' }],
      mol: 'Si molesta el hombro colgado: usa las paralelas directamente.'
    },
    'rueda-abdominal': { pat: 'flex',
      nombre: 'Rueda abdominal', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Core anterior completo'], equipo: 'Ab wheel',
      cues: ['De rodillas, pelvis en retroversión ANTES de salir', 'Rueda hasta donde controles la lumbar', 'Vuelve tirando con el abdomen, no con los brazos'],
      err: ['Arquear la lumbar al extender (el error que lesiona)', 'Ir más lejos de lo que el core aguanta'],
      alt: [{ n: 'Crunch en polea', por: 'si la rueda queda grande hoy' }, { n: 'Plancha con lastre', por: 'isométrico equivalente' }],
      mol: 'Si molesta la lumbar: recorta el recorrido a la mitad y gana rango semana a semana.'
    },
    'crunch-polea': { pat: 'flex',
      nombre: 'Crunch en polea', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Recto abdominal'], equipo: 'Polea alta + cuerda',
      cues: ['De rodillas, cuerda a los lados de la cabeza', 'Flexiona DESDE LAS COSTILLAS, no desde la cadera', 'Codos hacia las rodillas, exhala al bajar'],
      err: ['Tirar con los brazos', 'Sentarse hacia atrás moviendo solo cadera'],
      alt: [{ n: 'Crunch en máquina', por: 'equivalente' }, { n: 'Rueda abdominal', por: 'cuando quieras subir nivel' }],
      mol: 'Sin incidencias típicas si flexionas desde las costillas.'
    },

    'fondos-silla': { pat: 'ext', pic: 'fondos',
      nombre: 'Fondos en silla', mm: { p: ['triceps'], s: ['pecho', 'hombro'] }, zona: 'empuje', musc: ['Tríceps', 'pecho bajo, hombro'], equipo: 'Nada (silla o sofá)',
      cues: ['Manos en el borde de la silla, dedos hacia fuera y hombros LEJOS de las orejas', 'Baja hasta 90° de codo, ni un grado más: por debajo el hombro paga la factura', 'Codos hacia atrás, rozando el cuerpo, nunca abiertos', 'La espalda sube y baja pegada al canto de la silla'],
      err: ['Bajar hasta el fondo buscando estiramiento (así nace el dolor de hombro)', 'Alejar tanto los pies que el peso se vaya a las piernas', 'Encoger los hombros hacia las orejas'],
      alt: [{ n: 'Con las rodillas dobladas y los pies cerca', por: 'si no salen 8 limpios' }, { n: 'Con los pies en otra silla', por: 'cuando pasas de 15 fáciles' }],
      mol: 'Si molesta el hombro por delante: acorta el recorrido a 60° o cámbialo por flexiones diamante, que no comprometen la articulación.'
    },
    'flexion-diamante': { pat: 'ext', pic: 'eh',
      nombre: 'Flexiones diamante', mm: { p: ['triceps'], s: ['pecho', 'hombro'] }, zona: 'empuje', musc: ['Tríceps', 'pectoral interno'], equipo: 'Nada',
      cues: ['Índices y pulgares formando un rombo bajo el esternón', 'Codos pegados al cuerpo durante todo el recorrido', 'Cuerpo en tabla: glúteo y abdomen apretados', 'Pecho a las manos, y arriba extiende del todo'],
      err: ['Abrir los codos (se convierte en una flexión normal)', 'Poner las manos a la altura de la cara en vez del esternón', 'Cadera caída'],
      alt: [{ n: 'Con las manos en el sofá o una mesa', por: 'si del suelo no salen limpias' }, { n: 'Con los pies elevados', por: 'si superas 12 fáciles' }],
      mol: 'Si molesta la muñeca: apoya en puños o baja a rodillas. Si molesta el codo, sube a 15 repeticiones y baja el ritmo.'
    },
    'ext-triceps-banda': { pat: 'ext',
      nombre: 'Extensión de tríceps con banda', mm: { p: ['triceps'], s: [] }, zona: 'empuje', musc: ['Tríceps (las tres cabezas)'], equipo: 'Banda',
      cues: ['Ancla la banda en alto (puerta o pomo) y da un paso atrás', 'Codos pegados al costado y QUIETOS: solo se mueve el antebrazo', 'Extiende hasta el bloqueo suave y aguanta 1″ abajo', 'Vuelve en 2-3″ resistiendo la goma'],
      err: ['Que los codos viajen hacia delante o hacia arriba', 'Empujar con el hombro inclinando el tronco', 'Soltar la vuelta y dejar que la banda mande'],
      alt: [{ n: 'Sobre la cabeza con la banda pisada', por: 'trabaja más la cabeza larga' }, { n: 'Patada de tríceps con mancuerna', por: 'si no tienes dónde anclar' }],
      mol: 'Es el ejercicio más amable con el codo del plan: si otros molestan, este suele ser el refugio. Sube repeticiones antes que dureza de banda.'
    },
    'press-frances-mc': { pat: 'ext',
      nombre: 'Press francés con mancuernas', mm: { p: ['triceps'], s: [] }, zona: 'empuje', musc: ['Tríceps (cabeza larga)'], equipo: 'Mancuernas',
      cues: ['Tumbado en el suelo, mancuernas arriba con las palmas enfrentadas', 'Baja hacia las orejas doblando solo el codo, en 2-3″', 'Codos apuntando al techo y quietos', 'Extiende sin bloquear de golpe'],
      err: ['Que los codos se abran hacia fuera', 'Convertirlo en press moviendo el hombro', 'Bajar tan rápido que el suelo frene la mancuerna'],
      alt: [{ n: 'Extensión sobre la cabeza sentado', por: 'más recorrido en la cabeza larga' }, { n: 'Extensión de tríceps con banda', por: 'si el codo pide tensión más suave' }],
      mol: 'Si molesta el codo: cámbialo por la versión con banda a 15 repeticiones. El suelo, además, te corta el recorrido justo donde el codo sufre.'
    },
    /* — Brazos — */
    'curl-barra-z': { pat: 'curl',
      nombre: 'Curl con barra Z', mm: { p: ['biceps'], s: [] }, zona: 'tiron', musc: ['Bíceps'], equipo: 'Barra Z',
      cues: ['Codos pegados al cuerpo, FIJOS', 'Sube sin balanceo, baja en 2-3″', 'Muñecas neutras gracias a la Z'],
      err: ['Mecer el cuerpo para subir más peso', 'Codos que viajan adelante arriba'],
      alt: [{ n: 'Curl con mancuernas alterno', por: 'con giro (supinación), muy completo' }, { n: 'Curl en polea baja', por: 'tensión continua' }],
      mol: 'Si molesta la muñeca o el codo: mancuernas con giro o agarre martillo.'
    },
    'curl-inclinado': { pat: 'curl',
      nombre: 'Curl inclinado con mancuernas', mm: { p: ['biceps'], s: [] }, zona: 'tiron', musc: ['Bíceps (cabeza larga)'], equipo: 'Mancuernas + banco 45-60°',
      cues: ['Banco a 45-60°, brazos COLGANDO verticales', 'El estiramiento abajo es el estímulo: no lo recortes', 'Codos quietos, sube sin encoger hombros'],
      err: ['Adelantar los codos', 'Media repetición abajo'],
      alt: [{ n: 'Curl bayesiano en polea', por: 'mismo estiramiento, de pie' }],
      mol: 'Si tira el hombro abajo: sube un punto el respaldo.'
    },
    'curl-martillo': { pat: 'curl',
      nombre: 'Curl martillo', mm: { p: ['biceps'], s: ['antebrazo'] }, zona: 'tiron', musc: ['Braquial', 'antebrazo'], equipo: 'Mancuernas',
      cues: ['Agarre neutro (martillo), codos fijos', 'Puedes hacerlo alterno o a la vez', 'Controla la bajada'],
      err: ['Balanceo', 'Convertirlo en remo subiendo los codos'],
      alt: [{ n: 'Curl martillo con cuerda en polea', por: 'variante' }],
      mol: 'Es el curl más amable con codos y muñecas: suele ser el REFUGIO cuando otros molestan.'
    },
    'curl-polea': { pat: 'curl',
      nombre: 'Curl en polea baja', mm: { p: ['biceps'], s: [] }, zona: 'tiron', musc: ['Bíceps'], equipo: 'Polea baja + barra',
      cues: ['Un paso atrás de la polea, codos fijos', 'Tensión continua: no descanses ni arriba ni abajo', 'Última serie: aguanta 10″ isométrico a mitad para acabar'],
      err: ['Acercarse tanto que el tramo bajo no tenga tensión', 'Mecerse'],
      alt: [{ n: 'Curl con barra Z', por: 'equivalente con peso libre' }],
      mol: 'Si molesta el codo: agarre más ancho o cuerda en martillo.'
    }
  };

  /* ---------- LAS 8 REGLAS ---------- */
  const REGLAS = [
    { n: 1, t: 'RPE controlado', d: 'Cada fase tiene su tope de esfuerzo. Tu sistema nervioso recuerda ser atleta; tus tendones llevan años sin cargar. Frena tú antes de que frenen ellos.' },
    { n: 2, t: 'Progresión doble', d: 'Primero sube repeticiones dentro del rango, luego sube peso (+2,5 kg; +5 kg en sentadilla y peso muerto rumano). Solo si la técnica fue limpia en TODAS las series. La app te lo sugiere sola.' },
    { n: 3, t: 'Báscula = media semanal', d: 'Pésate lunes-miércoles-viernes en ayunas y mira solo la media. Un día suelto no significa nada (agua, sal, creatina).' },
    { n: 4, t: 'Proteína: {p} g en 4 tomas', d: 'Desayuno, comida, cena y una toma antes de dormir. Ninguna toma por debajo de {q} g. Es la variable que decide si tu cambio de peso es grasa o músculo.' },
    { n: 5, t: '8.000–10.000 pasos diarios', d: 'Todos los días, entrenes o no. Queman más a la semana que las propias sesiones.' },
    { n: 6, t: 'Sueño 7–8 h: innegociable', d: 'No es un objetivo, es una regla: dormir 5,5 h en déficit convierte la pérdida en −55% grasa y +60% músculo (Nedeltcheva 2010). Cafeína fuerte solo antes de las 13-14 h.' },
    { n: 7, t: 'Un día fallado no se recupera', d: 'No dobles sesiones ni recortes comida al día siguiente. Sigues el calendario donde toque.' },
    { n: 8, t: 'Mínimo innegociable', d: 'El patrón que mata es 3 meses a tope / 3 a cero. La semana caótica tiene un suelo: 2 fuerzas + 1 cardio. Eso mantiene todo.' }
  ];

  const SENALES = 'Señales de parar un ejercicio ese día: dolor punzante en rodilla, hombro o lumbar durante el movimiento; molestia que empeora serie a serie en vez de desaparecer al calentar. Agujetas difusas 24-48 h después = normal. Dolor articular localizado que persiste más de 5 días = fisio antes de seguir cargando.';

  /* ---------- NUTRICIÓN ---------- */
  const NUTRI = {
    calorias: [
      { c: 'Metabolismo basal (Mifflin-St Jeor)', v: '~1.950 kcal', n: '95,1 kg · 183 cm · 30 años' },
      { c: 'Gasto total estimado (plan en marcha)', v: '2.850–3.000 kcal', n: 'Entrenos + 8-10k pasos' },
      { c: 'Ingesta objetivo', v: '2.250–2.400 kcal', n: 'Déficit ~550–700 kcal/día (más de eso frena la recuperación de músculo: Murphy & Koehler 2022)' },
      { c: 'Ritmo de pérdida esperado', v: '0,6–0,75 kg/sem', n: '≈0,7% del peso/sem, el punto óptimo para retener magro (Garthe 2011). Media semanal, no día a día' }
    ],
    fases: [
      { f: 'F1–F2 (sem 1-5)', kcal: 2250, p: 190, g: 70, c: 205 },
      { f: 'F3 (sem 6-9)',    kcal: 2350, p: 190, g: 70, c: 230, nota: 'Semana 7: DIET BREAK a ~2.800' },
      { f: 'F4 (sem 10-12)',  kcal: 2400, p: 190, g: 70, c: 240 }
    ],
    escalado: 'La proteína no se toca nunca: {p} g al día para ti. Al subir el volumen de entreno solo sube el carbohidrato. En la práctica: en F3 añade una pieza de fruta + 40 g de pan a la comida en días de entreno; en F4, eso mismo todos los días.',
    tomas: 'CUATRO tomas de proteína al día, ninguna por debajo de {q} g: desayuno, comida, cena y una toma pre-sueño. El total diario manda, pero el reparto en 4 exprime la síntesis proteica y quita hambre nocturna.',
    plato: [
      { t: 'Proteína (cada comida)', d: '200-250 g de pollo/pavo/pescado blanco en crudo, o 170-180 g de salmón/ternera, o 3 huevos + 2 claras, o 250 g de skyr + whey. Referencia visual: palma de la mano y media.' },
      { t: 'Carbohidrato', d: '60-75 g en crudo de arroz/pasta, o 250-300 g de patata, o 60 g de pan integral, o 50 g de avena. Referencia: un puño.' },
      { t: 'Verdura', d: 'Media ración del plato, libre. Volumen y saciedad.' },
      { t: 'Grasa', d: '10 g de AOVE por comida principal (una cucharada) y para de contar. Es donde se escapan las calorías sin darte cuenta.' }
    ],
    suplementos: [
      { t: 'Creatina monohidrato', d: '5 g diarios, a cualquier hora, sin fase de carga, desde ya. AVISO: retiene 1-2 kg de agua las primeras semanas. No es grasa: fíate de la cintura y de la media semanal, no del número suelto (la app lo marca en la gráfica).' },
      { t: 'Whey', d: '1 cazo en la toma pre-sueño con el skyr (y otro donde haga falta los días cortos de proteína).' },
      { t: 'Cafeína', d: 'Corte a las 13-14 h: 200 mg alteran el sueño hasta 13 h después; un café, ~9 h (Gardiner 2023). Entreno de mañana: café 30-45′ antes, perfecto. De tarde-noche: sin cafeína — tu pre-entreno es la merienda (fruta + skyr 60-90′ antes).' },
      { t: 'Opcionales con sentido', d: 'Vitamina D solo si la analítica sale por debajo de 30 ng/mL (probable con vida de interior). Omega-3 ~2 g EPA+DHA/día: beneficio modesto pero real en fuerza y ángulo antiinflamatorio/tendón.' },
      { t: 'NO gastes en', d: 'Quemagrasas, BCAA/EAA (redundantes con tu proteína diaria), "testo boosters". Nada de eso mueve la aguja.' }
    ],
    hidratacion: 'Agua: 2,5–3 L/día. Alcohol: cuenta calorías y bloquea la recuperación — dentro de la comida libre, fuera del resto de la semana.',
    comidaLibre: 'UNA comida a la semana (sábado por defecto), no un día. Pides o comes lo que te apetezca en cantidad normal, sin compensar antes ni después. Sirve para que el plan aguante {s} semanas y una vida social. Si hay plan otro día, se mueve — pero sigue siendo una.'
  };

  /* ---------- RECETAS ---------- */
  // q en gramos salvo unidad indicada · macros por ración
  const RECETAS = [
    {
      id: 'bol-skyr', slot: 'de', tags: ['lacteo', 'frutos'], nombre: 'Bol de skyr', tipo: 'Desayuno A', tiempo: '5′', cocina: 'Sin cocina',
      macros: { kcal: 520, p: 35, g: 11, c: 72 },
      ing: [
        { q: '250 g', i: 'skyr natural (o queso fresco batido 0%)' },
        { q: '50 g', i: 'copos de avena' },
        { q: '1 ud (120 g)', i: 'plátano' },
        { q: '10 g', i: 'nueces' },
        { q: 'al gusto', i: 'canela' }
      ],
      pasos: [
        'Skyr en el bol y la avena por encima (tal cual si te gusta con textura, o remojada 5′ en un dedo de leche o agua).',
        'Plátano en rodajas, nueces troceadas con la mano y canela por encima.'
      ],
      tips: 'Si entrenas por la mañana: móntalo la noche antes (la avena remojada gana). Día corto de proteína: +1 cazo de whey mezclado con el skyr (+110 kcal, +23 g P).'
    },
    {
      id: 'tortilla-pan', slot: 'de', tags: ['huevo', 'gluten'], nombre: 'Tortilla con pan y tomate', tipo: 'Desayuno B', tiempo: '10′', cocina: 'Sartén',
      macros: { kcal: 470, p: 34, g: 22, c: 32 },
      ing: [
        { q: '3 ud', i: 'huevos M' },
        { q: '2 ud (o 100 ml envasadas)', i: 'claras' },
        { q: '60 g (2 rebanadas)', i: 'pan integral' },
        { q: '100 g', i: 'tomate rallado' },
        { q: '5 g', i: 'AOVE' },
        { q: 'pizca', i: 'sal' }
      ],
      pasos: [
        'Bate huevos y claras con la sal.',
        'Sartén antiadherente a fuego medio con los 5 g de AOVE: cuaja la tortilla al punto que te guste.',
        'Tuesta el pan y ponle el tomate rallado con una gota del aceite de la sartén.'
      ],
      tips: 'Las claras envasadas quitan la pereza de separar. Versión revuelto: mismo tiempo, cero técnica.'
    },
    {
      id: 'pollo-asado', slot: 'co', tags: ['carne'], nombre: 'Pollo asado con patatas', tipo: 'Comida · batch domingo', tiempo: '45′ horno (del meal prep)', cocina: 'Horno',
      macros: { kcal: 780, p: 70, g: 19, c: 68 },
      ing: [
        { q: '250 g crudo (~200 g hecho)', i: 'pechuga de pollo', n: 'batch: 1,2 kg = 5 raciones' },
        { q: '300 g', i: 'patata en gajos + pimiento + cebolla asados', n: 'batch: 1,5 kg patata + 2 pimientos + 2 cebollas' },
        { q: '10 g', i: 'AOVE (parte del asado)' },
        { q: 'al gusto', i: 'pimentón, ajo en polvo, sal, orégano' }
      ],
      pasos: [
        'Horno a 200°. Salpimenta las pechugas y úntalas con pimentón + ajo en polvo.',
        'Bandeja 1: pechugas, 25-30′ (justo cocidas = jugosas; pásate y serán suela).',
        'Bandeja 2: patata en gajos con pimiento, cebolla y 20 g de AOVE total, 40-45′, giro a mitad.',
        'Porciona: 5 tuppers. El pollo del jueves-viernes, al congelador.'
      ],
      tips: 'La ración se recalienta en 2′ de micro con un chorrito de agua para que el pollo no se seque.'
    },
    {
      id: 'lentejas-pollo', slot: 'co', tags: ['carne'], nombre: 'Lentejas con pollo', tipo: 'Comida · batch domingo', tiempo: '25′ olla', cocina: 'Olla',
      macros: { kcal: 760, p: 52, g: 16, c: 80 },
      ing: [
        { q: '250 g escurridas', i: 'lentejas cocidas de bote', n: 'batch: 2 botes = 3 raciones' },
        { q: '120 g', i: 'pollo asado en tiras (del horneado)' },
        { q: '¼ ud', i: 'cebolla' },
        { q: '½ ud', i: 'pimiento' },
        { q: '1 ud', i: 'zanahoria' },
        { q: '4 g', i: 'AOVE (parte del sofrito)' },
        { q: '1 cdta / ½ cdta', i: 'pimentón / comino' },
        { q: '150 ml', i: 'caldo o agua' },
        { q: '1 pieza', i: 'fruta de postre' }
      ],
      pasos: [
        'Sofrito 8′: cebolla, pimiento y zanahoria picados con 10 g de AOVE (para el batch de 3 raciones).',
        'Añade las lentejas escurridas, el caldo, pimentón y comino: 15′ a fuego bajo.',
        'Apaga y mezcla el pollo en tiras (así no se reseca).'
      ],
      tips: 'De bote y sin remojo: la legumbre más rápida que existe. Espesan al día siguiente: añade un dedo de agua al recalentar.'
    },
    {
      id: 'salteado-ternera', slot: 'co', tags: ['carne'], nombre: 'Salteado de ternera', tipo: 'Comida · 15′ fresco', tiempo: '15′', cocina: 'Wok / sartén',
      macros: { kcal: 730, p: 45, g: 20, c: 60 },
      ing: [
        { q: '180-200 g', i: 'ternera magra en tiras' },
        { q: '70 g crudo (≈ 180 g cocido)', i: 'arroz', n: 'usa el del batch' },
        { q: '250 g', i: 'verdura variada: pimiento, cebolla, calabacín, zanahoria' },
        { q: '15 ml', i: 'salsa de soja' },
        { q: '8 g', i: 'AOVE' }
      ],
      pasos: [
        'Wok o sartén MUY caliente con el AOVE: sella la ternera 1-2′ y resérvala (si la dejas, se cuece y queda dura).',
        'Misma sartén: verduras en tiras 5-6′, que queden al dente.',
        'Vuelve la ternera, soja, 1′ de meneo y encima del arroz.'
      ],
      tips: 'El orden lo es todo: carne fuera antes de las verduras. Pide en la carnicería "tiras para saltear" y te ahorras cortar.'
    },
    {
      id: 'salmon-arroz', slot: 'ce', tags: ['pescado'], nombre: 'Salmón con arroz y brócoli', tipo: 'Cena · 15′', tiempo: '15′', cocina: 'Plancha u horno',
      macros: { kcal: 760, p: 40, g: 28, c: 62 },
      ing: [
        { q: '170-180 g', i: 'lomo de salmón' },
        { q: '75 g crudo (≈ 190 g cocido)', i: 'arroz', n: 'del batch' },
        { q: '200 g', i: 'brócoli' },
        { q: '½ ud', i: 'limón' },
        { q: 'pizca', i: 'sal' }
      ],
      pasos: [
        'Brócoli al micro en bol tapado con un dedo de agua: 4-5′ (o vapor).',
        'Salmón a la plancha 3-4′ por lado empezando por la piel (u horno 200°, 12′). Sin aceite: ya trae el suyo.',
        'Arroz recalentado, limón exprimido por encima de todo.'
      ],
      tips: 'La grasa del salmón cuenta como la grasa de la comida: por eso aquí no hay AOVE.'
    },
    {
      id: 'merluza-patata', slot: 'ce', tags: ['pescado', 'lacteo'], nombre: 'Merluza con patata panadera', tipo: 'Cena · 20′', tiempo: '20′', cocina: 'Horno o micro+plancha',
      macros: { kcal: 740, p: 55, g: 15, c: 55 },
      ing: [
        { q: '250 g', i: 'merluza o lubina en lomos' },
        { q: '250 g', i: 'patata' },
        { q: 'bol', i: 'ensalada verde (lechuga, tomate, cebolla)' },
        { q: '10 g', i: 'AOVE (5 patata + 5 ensalada)' },
        { q: '1 ud', i: 'skyr de postre' }
      ],
      pasos: [
        'Patata en rodajas de ½ cm: micro 8′ tapada (o al horno 25′ con 5 g de AOVE, sal y orégano).',
        'Merluza: horno 200° 10-12′, o plancha 3′ por lado. Punto: cuando se separa en lascas.',
        'Ensalada con 5 g de AOVE y vinagre. Skyr de postre y cena cerrada.'
      ],
      tips: 'El pescado blanco es la proteína más saciante por caloría de todo el plan: úsalo los días de más hambre.'
    },
    {
      id: 'revuelto-gambas', slot: 'ce', tags: ['pescado', 'huevo', 'gluten'], nombre: 'Revuelto de gambas', tipo: 'Cena · 10′', tiempo: '10′', cocina: 'Sartén',
      macros: { kcal: 620, p: 45, g: 30, c: 25 },
      ing: [
        { q: '3 ud', i: 'huevos M' },
        { q: '150 g', i: 'gambas peladas (congeladas van perfectas)' },
        { q: '40 g', i: 'pan integral' },
        { q: 'bol', i: 'ensalada verde' },
        { q: '8 g', i: 'AOVE' },
        { q: '1 diente', i: 'ajo' }
      ],
      pasos: [
        'Dora el ajo laminado con el AOVE; gambas 2′ (descongeladas y secadas antes).',
        'Baja el fuego, añade los huevos batidos y remueve SIN PARAR hasta cremoso. Fuera antes de que cuaje del todo.',
        'Pan tostado y ensalada al lado.'
      ],
      tips: 'El revuelto se termina de hacer fuera del fuego. Gambas congeladas: descongela en un bol de agua fría en 10′.'
    },
    {
      id: 'toma-noche', slot: 'snack', tags: ['lacteo'], nombre: 'Toma pre-sueño', tipo: 'Toma 4 · diaria', tiempo: '1′', cocina: 'Sin cocina',
      macros: { kcal: 270, p: 49, g: 2, c: 14 },
      ing: [
        { q: '250 g', i: 'skyr o queso fresco batido 0%' },
        { q: '1 cazo (30 g)', i: 'whey (el sabor que no te aburra)' },
        { q: 'al gusto', i: 'canela' }
      ],
      pasos: [
        'Mezcla el cazo de whey con el skyr hasta textura de mousse. Canela por encima.',
        '30-60′ antes de acostarte. Ya está.'
      ],
      tips: 'Esta toma remata la proteína del día y mata el hambre nocturna, el momento donde mueren las dietas. La caseína láctea de digestión lenta trabaja mientras duermes.'
    },
    {
      id: 'ensalada-atun', slot: 'ce', tags: ['pescado', 'huevo'], nombre: 'Ensalada completa de atún', tipo: 'Cena · 10′', tiempo: '10′', cocina: 'Sin fuego (con batch)',
      macros: { kcal: 700, p: 45, g: 25, c: 50 },
      ing: [
        { q: '2 latas (120 g escurrido)', i: 'atún al natural' },
        { q: '1 ud', i: 'huevo duro (del batch)' },
        { q: '150 g', i: 'patata cocida (del batch)' },
        { q: '150 g', i: 'tomate' },
        { q: '30 g', i: 'aceitunas' },
        { q: '¼ ud', i: 'cebolla morada' },
        { q: '10 g', i: 'AOVE' }
      ],
      pasos: [
        'Todo al bol: patata en dados, tomate en gajos, cebolla fina, atún escurrido, huevo en cuartos, aceitunas.',
        'AOVE, vinagre, sal y un meneo.'
      ],
      tips: 'La cena de cero esfuerzo si el domingo coció patatas y huevos de más. Versión sin patata (día flojo de hambre): añade más tomate.'
    },
    { id: 'porridge-soja', slot: 'de', tags: [], nombre: 'Porridge de avena y proteína', tipo: 'Desayuno C', tiempo: '8′', cocina: 'Cazo o micro',
      macros: { kcal: 545, p: 37, g: 11, c: 69 },
      ing: [{ q: '70 g', i: 'copos de avena (certificada sin gluten)' }, { q: '250 ml', i: 'bebida de soja sin azúcar' }, { q: '25 g', i: 'proteína de guisante, sabor neutro o vainilla' }, { q: '1', i: 'plátano en rodajas' }, { q: 'al gusto', i: 'canela' }],
      pasos: ['Calienta la avena con la bebida de soja 4-5′ removiendo hasta que espese.', 'Fuera del fuego, mezcla la proteína: si la hierves, se apelmaza.', 'Corona con el plátano y la canela.'],
      tips: 'Déjalo hecho la noche antes en la nevera (overnight) y por la mañana solo añades la proteína.' },
    { id: 'tofu-revuelto', slot: 'de', tags: [], nombre: 'Tofu revuelto con tostadas', tipo: 'Desayuno D', tiempo: '12′', cocina: 'Sartén',
      macros: { kcal: 570, p: 41, g: 25, c: 42 },
      ing: [{ q: '200 g', i: 'tofu firme desmenuzado' }, { q: '2 rebanadas (70 g)', i: 'pan sin gluten' }, { q: '10 g', i: 'levadura nutricional' }, { q: '1', i: 'tomate en rodajas' }, { q: '5 g', i: 'AOVE' }, { q: 'al gusto', i: 'cúrcuma, sal negra kala namak, pimienta' }],
      pasos: ['Saltea el tofu desmenuzado con el AOVE 3-4′ a fuego medio-alto.', 'Añade cúrcuma, levadura y sal negra (da el sabor a huevo); 2′ más.', 'Tuesta el pan y monta con el tomate.'],
      tips: 'La sal kala namak es la clave: sin ella es tofu con cúrcuma; con ella, un revuelto.' },
    { id: 'bol-soja-frutos', slot: 'de', tags: [], nombre: 'Bol de yogur de soja y frutos rojos', tipo: 'Desayuno E', tiempo: '5′', cocina: 'Sin cocina',
      macros: { kcal: 415, p: 29, g: 11, c: 41 },
      ing: [{ q: '250 g', i: 'yogur de soja natural sin azúcar' }, { q: '20 g', i: 'proteína vegetal en polvo' }, { q: '120 g', i: 'frutos rojos (congelados valen)' }, { q: '15 g', i: 'semillas de chía' }, { q: '1', i: 'plátano pequeño' }],
      pasos: ['Mezcla el yogur con la proteína hasta que no queden grumos.', 'Añade la chía y deja 5′: espesa sola.', 'Corona con los frutos rojos y el plátano.'],
      tips: 'Los frutos rojos congelados, echados tal cual, enfrían y espesan el bol: mejor que los frescos aquí.' },
    { id: 'revuelto-espinacas', slot: 'de', tags: ['huevo'], nombre: 'Revuelto de huevos con espinacas', tipo: 'Desayuno F', tiempo: '10′', cocina: 'Sartén',
      macros: { kcal: 510, p: 28, g: 21, c: 46 },
      ing: [{ q: '3', i: 'huevos' }, { q: '100 g', i: 'espinacas frescas' }, { q: '100 g', i: 'champiñones laminados' }, { q: '50 g', i: 'pan sin gluten' }, { q: '5 g', i: 'AOVE' }, { q: '150 g', i: 'fruta de temporada' }],
      pasos: ['Saltea los champiñones 3′; añade las espinacas hasta que bajen.', 'Huevos batidos dentro, fuego bajo, removiendo: cremoso, no seco.', 'Sirve con el pan tostado y la fruta aparte.'],
      tips: 'Apaga el fuego cuando aún parezca un poco crudo: el calor residual lo termina.' },
    { id: 'curry-lentejas', slot: 'co', tags: [], nombre: 'Curry de lentejas rojas con arroz', tipo: 'Comida · batch domingo', tiempo: '25′ olla', cocina: 'Olla',
      macros: { kcal: 755, p: 31, g: 18, c: 108 },
      ing: [{ q: '100 g', i: 'lentejas rojas secas' }, { q: '100 ml', i: 'leche de coco ligera' }, { q: '150 g', i: 'tomate triturado' }, { q: '50 g', i: 'arroz basmati seco' }, { q: '10 g', i: 'AOVE' }, { q: 'al gusto', i: 'cebolla, ajo, jengibre, curry en polvo, sal' }],
      pasos: ['Sofríe cebolla, ajo y jengibre 3′; añade el curry y tuéstalo 30″.', 'Lentejas, tomate, coco y 300 ml de agua: 18-20′ a fuego medio hasta que se deshagan.', 'Arroz aparte (12′). Sirve el curry encima.'],
      tips: 'Batch: multiplica ×4, dura 4 días en nevera y congela perfecto. Las lentejas rojas no necesitan remojo.' },
    { id: 'tofu-salteado', slot: 'co', tags: [], nombre: 'Tofu salteado con verduras y arroz integral', tipo: 'Comida · 20′', tiempo: '20′', cocina: 'Wok / sartén',
      macros: { kcal: 775, p: 47, g: 34, c: 71 },
      ing: [{ q: '200 g', i: 'tofu firme en dados' }, { q: '70 g', i: 'arroz integral seco' }, { q: '250 g', i: 'brócoli, pimiento y zanahoria' }, { q: '15 ml', i: 'tamari (salsa de soja sin gluten)' }, { q: '10 g', i: 'AOVE' }, { q: '10 g', i: 'semillas de sésamo' }],
      pasos: ['Arroz integral a cocer (25′; hazlo de batch).', 'Tofu a fuego fuerte hasta dorar por todos los lados (6-7′); reserva.', 'Verduras 4′ al wok, vuelve el tofu, tamari y sésamo; 1′ y fuera.'],
      tips: 'Prensa el tofu 10′ entre dos platos con peso: suelta agua y se dora de verdad.' },
    { id: 'bol-garbanzos', slot: 'co', tags: [], nombre: 'Bol de garbanzos asados con quinoa y hummus', tipo: 'Comida · 15′ fresco', tiempo: '15′ (+ horno)', cocina: 'Horno + sin fuego',
      macros: { kcal: 780, p: 31, g: 24, c: 103 },
      ing: [{ q: '200 g', i: 'garbanzos cocidos' }, { q: '60 g', i: 'quinoa seca' }, { q: '50 g', i: 'hummus' }, { q: '150 g', i: 'pimiento asado y pepino' }, { q: '5 g', i: 'AOVE' }, { q: 'al gusto', i: 'comino, pimentón, limón, sal' }],
      pasos: ['Garbanzos escurridos con pimentón, comino y sal: horno 200° 20′ hasta crujientes (batch).', 'Quinoa: lava, 12′ en el doble de agua, reposa tapada.', 'Monta el bol: quinoa, garbanzos, verduras, hummus y limón.'],
      tips: 'Los garbanzos asados aguantan 5 días en un tarro: son el «picoteo» de este plan.' },
    { id: 'pasta-lentejas-tempeh', slot: 'co', tags: [], nombre: 'Pasta de lentejas con tempeh al tomate', tipo: 'Comida · 20′', tiempo: '20′', cocina: 'Olla + sartén',
      macros: { kcal: 665, p: 46, g: 26, c: 67 },
      ing: [{ q: '80 g', i: 'pasta de lentejas rojas (sin gluten)' }, { q: '120 g', i: 'tempeh en dados' }, { q: '200 g', i: 'tomate triturado' }, { q: '80 g', i: 'cebolla y ajo' }, { q: '10 g', i: 'AOVE' }, { q: 'al gusto', i: 'albahaca, orégano, sal' }],
      pasos: ['Pasta de lentejas 7-8′ (se pasa rápido: prueba antes del tiempo del paquete).', 'Tempeh dorado en el AOVE 4′; añade cebolla y ajo 3′ más.', 'Tomate, orégano y sal, 5′; mezcla con la pasta y la albahaca.'],
      tips: 'El tempeh gana mucho si lo cueces 8′ al vapor antes de dorarlo: pierde el amargor.' },
    { id: 'tortilla-garbanzo', slot: 'ce', tags: [], nombre: 'Tortilla de harina de garbanzo con calabacín', tipo: 'Cena · 20′', tiempo: '20′', cocina: 'Sartén',
      macros: { kcal: 460, p: 20, g: 16, c: 62 },
      ing: [{ q: '80 g', i: 'harina de garbanzo (sin gluten)' }, { q: '200 g', i: 'calabacín en láminas finas' }, { q: '80 g', i: 'cebolla' }, { q: '10 g', i: 'AOVE' }, { q: '100 g', i: 'ensalada verde' }, { q: 'al gusto', i: 'sal, pimienta, cúrcuma' }],
      pasos: ['Mezcla la harina con 160 ml de agua, sal y cúrcuma; reposa 10′.', 'Calabacín y cebolla 8′ a fuego medio hasta tiernos.', 'Vierte la masa encima, tapa, 5′ por cada lado. Ensalada al lado.'],
      tips: 'Es la «tortilla sin huevo» de verdad: cuaja igual y aguanta fría para llevar.' },
    { id: 'crema-calabaza-tofu', slot: 'ce', tags: [], nombre: 'Crema de calabaza con edamame y tofu a la plancha', tipo: 'Cena · 25′', tiempo: '25′', cocina: 'Olla + plancha',
      macros: { kcal: 590, p: 41, g: 24, c: 38 },
      ing: [{ q: '300 g', i: 'calabaza en dados' }, { q: '100 g', i: 'edamame desgranado (congelado)' }, { q: '150 g', i: 'tofu firme en filetes' }, { q: '60 g', i: 'cebolla' }, { q: '10 g', i: 'AOVE' }, { q: '10 g', i: 'pipas de calabaza' }],
      pasos: ['Cebolla y calabaza con 5 g de AOVE 3′; cubre de agua justo, 15′ y tritura.', 'Edamame 4′ en agua hirviendo; escurre y mete en la crema.', 'Tofu a la plancha con el resto del AOVE, 3′ por lado. Pipas por encima.'],
      tips: 'La crema sin nata ni patata: la calabaza triturada ya es cremosa sola.' },
    { id: 'ensalada-quinoa-alubias', slot: 'ce', tags: [], nombre: 'Ensalada templada de quinoa, alubias negras y aguacate', tipo: 'Cena · 15′', tiempo: '15′', cocina: 'Olla + sin fuego',
      macros: { kcal: 610, p: 25, g: 21, c: 82 },
      ing: [{ q: '40 g', i: 'quinoa seca' }, { q: '200 g', i: 'alubias negras cocidas' }, { q: '80 g', i: 'aguacate' }, { q: '120 g', i: 'tomate, cebolla morada y cilantro' }, { q: '5 g', i: 'AOVE' }, { q: 'al gusto', i: 'lima, comino, sal' }],
      pasos: ['Quinoa 12′ en el doble de agua; escurre.', 'Alubias escurridas y lavadas, con la quinoa aún templada.', 'Aguacate, tomate, cebolla y cilantro; aliña con lima, comino y AOVE.'],
      tips: 'Se lleva al trabajo sin problema: el aguacate, mejor cortado al momento.' },
    { id: 'bolonesa-soja', slot: 'ce', tags: [], nombre: 'Boloñesa de soja texturizada con calabacín en espiral', tipo: 'Cena · 20′', tiempo: '20′', cocina: 'Sartén',
      macros: { kcal: 445, p: 37, g: 13, c: 47 },
      ing: [{ q: '60 g', i: 'soja texturizada fina (seca)' }, { q: '250 g', i: 'tomate triturado' }, { q: '300 g', i: 'calabacín en espirales o tiras' }, { q: '100 g', i: 'cebolla, zanahoria y ajo' }, { q: '10 g', i: 'AOVE' }, { q: 'al gusto', i: 'orégano, pimentón, sal' }],
      pasos: ['Hidrata la soja 10′ en agua caliente con una pizca de sal; escurre bien.', 'Sofrito 5′; soja escurrida 3′ a fuego fuerte; tomate y orégano, 8′.', 'Calabacín 2′ en sartén aparte (que no suelte agua). Boloñesa encima.'],
      tips: 'La soja texturizada tiene 50 g de proteína por 100 g secos: es el «carne picada» más barato que existe.' }
  ];

  /* ---------- LISTA DE LA COMPRA (semana tipo) ---------- */
  const COMPRA = [
    { cat: 'Proteína', items: [
      { q: '1,4 kg', i: 'pechuga de pollo' },
      { q: '400 g', i: 'ternera magra en tiras' },
      { q: '500 g', i: 'merluza o lubina (2 raciones)' },
      { q: '350 g', i: 'salmón (2 lomos)' },
      { q: '300 g', i: 'gambas peladas congeladas' },
      { q: '4 latas', i: 'atún al natural' },
      { q: '18 ud', i: 'huevos M (docena y media)' },
      { q: '14 ud (250 g c/u)', i: 'skyr o queso fresco batido 0% (7 desayunos/postres + 7 tomas nocturnas)' },
      { q: '1 bote (dura ~1 mes)', i: 'whey (1 cazo diario en la toma nocturna)' }
    ]},
    { cat: 'Carbohidratos', items: [
      { q: '500 g', i: 'arroz' },
      { q: '2 kg', i: 'patatas' },
      { q: '400 g', i: 'pan integral (barra grande o molde)' },
      { q: '500 g', i: 'avena' },
      { q: '2 botes (400 g escurrido c/u)', i: 'lentejas cocidas' }
    ]},
    { cat: 'Verdura y fruta', items: [
      { q: '5 ud', i: 'pimientos' },
      { q: '4 ud', i: 'cebollas (+1 morada)' },
      { q: '2 ud', i: 'calabacines' },
      { q: '2 ud', i: 'brócolis' },
      { q: '8 ud', i: 'tomates (2 para rallar)' },
      { q: '2 bolsas', i: 'lechuga o canónigos' },
      { q: '500 g', i: 'zanahorias' },
      { q: '12-14 piezas', i: 'fruta: plátanos ×5, manzanas ×4-5, naranjas ×4' }
    ]},
    { cat: 'Despensa', items: [
      { q: '—', i: 'AOVE' },
      { q: '200 g', i: 'nueces' },
      { q: '1 bote', i: 'aceitunas' },
      { q: '1 bote', i: 'salsa de soja' },
      { q: '3 ud', i: 'limones' },
      { q: '—', i: 'especias: pimentón, ajo en polvo, comino, orégano, canela' },
      { q: '—', i: 'sal, vinagre, caldo' }
    ]}
  ];

  /* ---------- MEAL PREP DEL DOMINGO (~90′) ---------- */
  const MEALPREP = [
    { min: '0′',  paso: 'Horno a 200°. Salpimenta 1,2 kg de pechugas y úntalas con pimentón + ajo en polvo.' },
    { min: '5′',  paso: 'Al horno: bandeja 1 (pechugas, 25-30′) y bandeja 2 (1,5 kg de patata en gajos + 2 pimientos + 2 cebollas + 20 g AOVE, 40-45′).' },
    { min: '10′', paso: 'Olla a fuego medio: sofrito de cebolla, pimiento y zanahoria con 10 g de AOVE.' },
    { min: '15′', paso: 'Cazo 1: 400 g de arroz a cocer (12-15′). Cazo 2: 6 huevos (10′) + 2 patatas medianas (déjalas 20′): huevos y patata para la ensalada de atún.' },
    { min: '20′', paso: 'A la olla: 2 botes de lentejas escurridas + 400 ml de caldo + pimentón y comino. Fuego bajo 20′.' },
    { min: '30′', paso: 'Pechugas fuera. Trocea 250 g en tiras para las lentejas (se añaden al apagar). Escurre el arroz y extiéndelo en una bandeja para que enfríe rápido.' },
    { min: '45′', paso: 'Patatas del horno fuera. Gira, prueba, sal si falta.' },
    { min: '60′', paso: 'Porciona: 5 tuppers de comida (2 pollo+patatas, 2-3 lentejas, arroz en tupper aparte para salteado/salmón) + huevos duros y patata cocida en la nevera.' },
    { min: '75′', paso: 'Etiqueta y guarda: nevera hasta el miércoles, congelador lo del jueves-viernes (bájalo a nevera la noche antes). Cocina recogida mientras suena lo que sea.' }
  ];
  const MEALPREP_NOTA = 'El pescado de las cenas se hace fresco en 10 minutos: no se prepara el domingo. Pollo y arroz aguantan 4 días refrigerados.';

  /* ---------- MENÚ SEMANAL ---------- */
  const MENU = [
    { d: 'Lun', de: 'bol-skyr', co: 'pollo-asado', ce: 'merluza-patata' },
    { d: 'Mar', de: 'tortilla-pan', co: 'lentejas-pollo', ce: 'ensalada-atun' },
    { d: 'Mié', de: 'bol-skyr', co: 'salteado-ternera', ce: 'revuelto-gambas' },
    { d: 'Jue', de: 'tortilla-pan', co: 'pollo-asado', ce: 'salmon-arroz' },
    { d: 'Vie', de: 'bol-skyr', co: 'lentejas-pollo', ce: 'merluza-patata' },
    { d: 'Sáb', de: 'tortilla-pan', co: 'LIBRE', ce: 'ensalada-atun' },
    { d: 'Dom', de: 'bol-skyr', co: 'salteado-ternera', ce: 'revuelto-gambas' }
  ];

  /* ---------- SEGUIMIENTO ---------- */
  const CHECKPOINTS = [
    { sem: 4,  fecha: '2026-09-13', rango: [92.5, 93.5], si: 'Revisa AOVE y comida libre; +1.000 pasos/día. Recuerda: la creatina esconde ~1 kg.' },
    { sem: 8,  fecha: '2026-10-11', rango: [90.0, 91.3], si: '−100 kcal de carbohidrato solo en días de descanso (la semana 7 fue diet break: la media puede venir alta y es normal)' },
    { sem: 12, fecha: '2026-11-08', rango: [86.0, 88.0], si: 'Cierre, fotos, medidas y siguiente bloque. En grasa real: ~−8 kg.' }
  ];
  const AJUSTES = [
    { id: 'rapido', cond: 'Pierdes más de 1,0 kg/sem dos semanas seguidas (descontando el efecto creatina)', accion: 'Añade 150 kcal de carbohidrato. Más rápido no es mejor: a ese ritmo el déficit se come el músculo que estás recuperando.' },
    { id: 'lento', cond: 'Pierdes menos de 0,45 kg/sem dos semanas seguidas (sin contar la semana de diet break)', accion: 'Primero verifica pasos y AOVE; si está limpio, sube +1.500 pasos ANTES de recortar kcal (protege el entreno).' },
    { id: 'rendimiento', cond: 'El rendimiento en el gym cae dos sesiones seguidas', accion: 'Mira el sueño antes que la dieta.' }
  ];
  const FOTOS = ['2026-08-17', '2026-09-13', '2026-10-11', '2026-11-08'];

  /* ---------- LOGROS ---------- */
  // tipo: sesion | racha | peso | cintura | disco | pr | especial
  const LOGROS = [
    { id: 'primera',        icon: '⚡', nombre: 'Día uno',           desc: 'Primera sesión completada. Ya has hecho lo más difícil.' },
    { id: 'sesiones-10',    icon: '🔟', nombre: 'Diez de diez',      desc: '10 sesiones de fuerza completadas.' },
    { id: 'sesiones-25',    icon: '🎯', nombre: 'Veinticinco',       desc: '25 sesiones de fuerza. Esto ya es un hábito.' },
    { id: 'sesiones-50',    icon: '🏛️', nombre: 'Cincuenta',         desc: '50 sesiones. Territorio de otra persona.' },
    { id: 'semana-perfecta',icon: '💎', nombre: 'Semana perfecta',   desc: 'Todas las sesiones de fuerza de una semana.' },
    { id: 'minimo-3',       icon: '🛡️', nombre: 'El suelo aguanta',  desc: '3 semanas seguidas cumpliendo al menos el mínimo (2 fuerzas + 1 cardio).' },
    { id: 'racha-7',        icon: '🔥', nombre: 'Racha 7',           desc: '7 días de plan seguidos, cumplidos.' },
    { id: 'racha-14',       icon: '🔥', nombre: 'Racha 14',          desc: '14 días de plan seguidos. Esto ya es una costumbre.' },
    { id: 'racha-30',       icon: '🌋', nombre: 'Racha 30',          desc: '30 días de plan seguidos. Imparable.' },
    { id: 'pasos-7',        icon: '👟', nombre: 'Semana andada',     desc: '7 días seguidos llegando a los pasos.' },
    { id: 'disco-10',       icon: 'disc10', nombre: 'Disco de 10',   desc: 'Fase 1 completada. El hábito ha vuelto.', disco: true },
    { id: 'disco-15',       icon: 'disc15', nombre: 'Disco de 15',   desc: 'Fase 2 completada. Ya estás dentro del gym.', disco: true },
    { id: 'disco-20',       icon: 'disc20', nombre: 'Disco de 20',   desc: 'Fase 3 completada. La carga real ya es tuya.', disco: true },
    { id: 'disco-25',       icon: 'disc25', nombre: 'Disco de 25',   desc: 'Fase 4 completada. Colección completa.', disco: true },
    { id: 'kg-2',           icon: '📉', nombre: '−2 kg',             desc: 'Media semanal 2 kg por debajo de la salida.' },
    { id: 'kg-4',           icon: '📉', nombre: '−4 kg',             desc: '4 kg menos de media semanal.' },
    { id: 'kg-6',           icon: '📉', nombre: '−6 kg',             desc: '6 kg menos. Mitad del camino largo.' },
    { id: 'kg-8',           icon: '📉', nombre: '−8 kg',             desc: '8 kg menos de media semanal.' },
    { id: 'kg-10',          icon: '🏔️', nombre: '−10 kg',            desc: 'Doble dígito. Pocas personas llegan aquí.' },
    { id: 'cintura-95',     icon: '📏', nombre: 'Cintura −95',       desc: 'Cintura por debajo de 95 cm.' },
    { id: 'cintura-93',     icon: '📏', nombre: 'Cintura −93',       desc: 'Cintura por debajo de 93 cm.' },
    { id: 'cintura-91',     icon: '👑', nombre: 'Métrica reina',     desc: 'Cintura por debajo de 91 cm: menos de la mitad de tu estatura.' },
    { id: 'pr-1',           icon: '🥇', nombre: 'Primer PR',         desc: 'Primera vez que superas tu mejor marca en un ejercicio.' },
    { id: 'pr-5',           icon: '🥇', nombre: '5 PRs',             desc: 'Cinco marcas personales batidas.' },
    { id: 'pr-15',          icon: '🏆', nombre: '15 PRs',            desc: 'Quince PRs. La memoria muscular pagando dividendos.' },
    { id: 'dominada-libre', icon: '🦍', nombre: 'Dominada libre',    desc: 'Primera dominada sin asistencia. De vuelta al club.' },
    { id: 'mealprep-4',     icon: '🍱', nombre: 'Chef de domingo',   desc: '4 domingos seguidos de meal prep.' },
    { id: 'comeback',       icon: '🔁', nombre: 'La vuelta',         desc: 'La vuelta tras 4 o más días sin entrenar. Volver importa más que caer.' },
    { id: 'fotos-4',        icon: '📸', nombre: 'La secuencia',      desc: 'Las 4 fotos de progreso hechas.' },
    { id: 'checkpoint-s4',  icon: '✅', nombre: 'Checkpoint S4',     desc: 'Peso dentro o mejor del corredor en la semana 4.' },
    { id: 'checkpoint-s8',  icon: '✅', nombre: 'Checkpoint S8',     desc: 'Peso dentro o mejor del corredor en la semana 8.' },
    { id: 'plan-completo',  icon: '🏁', nombre: 'BACK2PRIME',        desc: 'Plan de 12 semanas terminado. 85 kg era la consecuencia, no la meta.' }
  ];

  /* ---------- LA CIENCIA DEL PLAN (revisión de evidencia · ago 2026) ---------- */
  const CIENCIA = {
    intro: 'Plan revisado contra la evidencia (metaanálisis y ensayos 2010-2025, agosto de 2026). La idea que lo ordena todo: quien vuelve no es un novato — el músculo y el sistema nervioso regresan rápido, pero el tendón no tiene memoria. El músculo puede correr; el tendón marca el ritmo.',
    temas: [
      { t: 'Memoria muscular', d: 'Recuperar lo ganado es real y rápido: fuerza en ~8 semanas, tamaño en ~12. El mecanismo (mionúcleos vs epigenética) está en debate, pero el efecto no. Por eso la doble progresión puede ir más rápido que en un novato — y por eso mismo NO se comprime el calendario: el que no corre es el tendón.', ref: 'Rahmati 2022 (metaanálisis, J Cachexia Sarcopenia Muscle) · Cumming 2024 (J Physiol)' },
      { t: 'Tendón: el limitante', d: 'El colágeno tendinoso se renueva ~10× más lento que el músculo. Lo que sí lo adapta: cargas altas con contracciones lentas de ~3″ (HSR) e isométricos al 70% (5×45″), que además quitan dolor al momento. La pliometría es mal estímulo tendinoso: nada de saltos para «preparar» el trote.', ref: 'Mersmann 2017 (Front Physiol) · Rio 2015 (BJSM) · Kongsgaard (HSR)' },
      { t: 'Correr con sobrepeso', d: 'Con sobrepeso, empezar con más de 3 km/sem de trote dispara las lesiones (~31-48% más). Subir la cadencia a 170-180 reduce el impacto tibial ~11%. La progresión segura no es la "regla del 10%": es no superar ~1,3× tu media de las últimas 4 semanas.', ref: 'Bertelsen 2018 (ECA en noveles con sobrepeso) · revisión de cadencia 2025 · consenso COI de carga' },
      { t: 'Déficit óptimo', d: 'Un déficit mayor de ~500-600 kcal anula la ganancia de músculo aunque entrenes fuerza. El ritmo óptimo para retener magro es ~0,7% del peso/semana. Por eso el plan pierde a 0,6-0,75 kg/sem y no a 0,9.', ref: 'Murphy & Koehler 2022 (metaanálisis, 59 estudios) · Garthe 2011' },
      { t: 'Proteína', d: 'En déficit, los entrenados necesitan 2,3-3,1 g/kg de masa magra. {p} g te sitúa cómodo en el rango, y repartirlo en 4 tomas de ≥40 g exprime la síntesis proteica y controla el hambre.', ref: 'Helms 2014 (revisión sistemática) · Schoenfeld & Aragon (reparto por toma)' },
      { t: 'Diet break', d: 'Alternar déficit con descansos a mantenimiento atenuó la caída metabólica y mejoró la pérdida de grasa en el estudio MATADOR. En {s} semanas su valor principal es otro: te enseña que parar UNA semana con plan no es recaer.', ref: 'Byrne 2018 (Int J Obesity, MATADOR)' },
      { t: 'Volumen justo', d: 'Más series = más músculo pero con rendimientos decrecientes, y en déficit el exceso solo suma fatiga y riesgo. Diana: ~10 series/músculo/sem en F2 y 12-18 en F3-F4. Y el mínimo innegociable (2 fuerzas + 1 cardio) tiene respaldo: con eso se CONSERVA músculo de verdad.', ref: 'Pelland 2025 (Sports Medicine) · Androulakis-Korakakis 2020 (dosis mínima)' },
      { t: 'Descarga bien hecha', d: 'Parar del todo una semana cuesta fuerza; lo que funciona es recortar el volumen a la mitad manteniendo el peso en la barra. Por eso la semana 9 es descarga OBLIGATORIA de ese tipo.', ref: 'Coleman 2024 (PeerJ, ECA de descarga)' },
      { t: 'Sueño', d: 'Dormir 5,5 h en déficit (vs 8,5) redujo la grasa perdida un 55% y multiplicó la pérdida de músculo. Es, tras proteína y déficit, tu mayor palanca. De ahí el corte de cafeína a las 13-14 h: 200 mg alteran el sueño hasta 13 h después.', ref: 'Nedeltcheva 2010 (Ann Intern Med) · Gardiner 2023 (Sleep Med Rev)' },
      { t: 'Salud primero', d: 'Tras años sin actividad vigorosa, antes de pasar al trabajo fuerte de F3-F4: tensión arterial y analítica básica (lípidos, glucosa/HbA1c). Con síntomas de cualquier tipo, médico antes de seguir.', ref: 'ACSM Preparticipation Health Screening' }
    ]
  };

  const CIERRE = 'El objetivo real del plan no es el 8 de noviembre: es llegar a diciembre entrenando 4 días por costumbre, sin ciclo on/off. El peso es la consecuencia, no la meta.';

  const AVISO_LEGAL = 'Tu plan se genera con tus respuestas usando fórmulas estándar (Mifflin-St Jeor y factores de actividad clásicos), con un margen de ±10% que las reglas de ajuste corrigen con tus datos reales. Nada de esto sustituye consejo médico: ante cualquier patología, dolor persistente o duda, consulta con un profesional sanitario.';

  /* ---------- TEXTOS DE INTERFAZ (traducibles como el resto) ----------
     Plantillas con {x}: app.js las rellena con tpl(). Al cambiar de idioma
     se carga assets/data.<lang>.js, que sustituye TODO window.B2P.        */
  const UI = {
    lang: 'es',
    tabs: ['Hoy', 'Plan', 'Comida', 'Progreso', 'Logros'],
    dias: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
    meses: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    hoyTag: 'HOY',
    semanaLinea: 'Semana {w} de {t} · Fase {f} · {n} · RPE tope {r}',
    empiezaEnDias: 'Empieza en {n} días', empiezaEn1: 'Empieza en 1 día', empiezaLunes: 'Empieza el lunes',
    preplanSub: '{f} · Fase 1 en casa. Mientras tanto, deja lista la línea base:',
    prepCintura: 'Mídete la cintura en ayunas (a la altura del ombligo)',
    prepFotos: 'Fotos día 0: frente y perfil, misma luz que usarás siempre',
    prepCompra: 'Compra de la semana 1 (lista en Comida)',
    prepBascula: 'Decide dónde y cuándo te pesas: lunes-miércoles-viernes en ayunas',
    practicaMenu: 'Puedes practicar el menú desde ya: el {f} va en serio.',
    descanso: 'Descanso', domingoPrep: 'Domingo: descanso + meal prep', planCompletado: 'Plan completado',
    calentamiento: 'Calentamiento · 6′',
    sesionSub: '{d} · descansos en cada fila (toca para cronometrar)',
    tendonNombre: 'Protocolo tendón',
    cardioHecho: '✓ Cardio hecho', cardioMarcar: 'Marcar cardio hecho', minutosReales: 'Minutos reales:',
    cadenciaSub: 'Cadencia 170-180 · zancada corta', recuperacionSub: 'Recuperación activa', opcional: 'opcional',
    tibialisAviso: 'Antes: tibialis raises 2×20 (protocolo tendón).',
    diaADia: 'El día a día',
    hPasos: '8-10k pasos', hPasosSub: 'Todos los días',
    hProte: 'Proteína 4/4', hProteSub: '4 tomas ≥{q} g',
    hPeso: 'Peso en ayunas', hPesoSub: 'Media semanal, no el día suelto',
    hCintura: 'Cintura (lunes)', hCinturaSub: 'La métrica reina · al ombligo, sin apretar',
    hPrep: 'Meal prep', hPrepSub: '~90′ y semana resuelta',
    hFoto: 'Fotos de progreso', hFotoSub: 'Frente y perfil, misma luz',
    pesoGuardado: 'Peso guardado: {v} kg', cinturaGuardada: 'Cintura: {v} cm',
    marcarHecho: 'Marcar hecho', usarPeso: 'Usar este peso',
    diaAnterior: 'Día anterior', diaSiguiente: 'Día siguiente',
    cerrarPanel: 'Cerrar', panelSinTitulo: 'Detalle',
    ajIdiomaSinRed: 'Sin conexión: no se pudo descargar ese idioma.',
    versionNueva: 'Versión nueva · toca para actualizar',
    quizAfinara: 'Esto afinará tu plan.', quizTitulo: 'Tus gustos', quizPista: 'Desliza: derecha me gusta, izquierda no',
    quizSi: 'Me gusta', quizNo: 'No me va', quizDeshacer: 'Deshacer', quizSaltar: 'Saltar',
    quizListo: 'Listo', quizResumen: 'Te gustan {a} de {b}. Esto afinará tu plan.',
    gen: { kcalHueco: 'Este menú suma ~{m} kcal al día y tu objetivo es {k}: {q}. Las recetas vienen a tamaño fijo; ajusta el arroz, la pasta o el pan de la comida principal.', kcalSube: 'te faltan ~{d}', kcalBaja: 'te sobran ~{d}', chkDentro: 'dentro', chkBajo: 'por debajo', chkAlto: 'por encima', lChkD2: 'Peso dentro del corredor en la semana {s}.', tHombroT: 'Hombro · manguito y serrato', tHombroD: 'Rotación externa con banda 2×15 por lado y elevación en Y tumbado 2×12, lentas. Antes de cualquier empuje y en días sueltos. El manguito no gana con peso: gana con control.', tHombroW: 'En casa con banda, o con la mancuerna más ligera que tengas.', descargaSinBarra: 'Misma rutina con la mitad de series y la misma carga. No es cese: es mantenimiento de tejido y vacaciones para tendones y articulaciones.', r2SinBarra: 'Primero sube repeticiones dentro del rango, luego sube carga (el salto más pequeño que tengas: una mancuerna más, una banda más dura o una variante más difícil). Solo si la técnica fue limpia en TODAS las series. La app te lo sugiere sola.', protHueco: 'Del menú salen ~{m} g de proteína al día; hasta tus {p} g, el puente son las tomas extra (batido o una ración más).', finRecapT: 'Tu bloque, en números', subCorporal: 'Al peso corporal: llega limpio al tope de repeticiones y sube de variante.', subRepe: 'Segunda vuelta: sin material no hay treinta variantes, y repetir el patrón con técnica limpia sigue construyendo.', f2nCasa: 'Entrada en carga', f2oCasa: 'Reaprender los básicos con mancuernas y bandas y construir base de carga. Trabaja al 65-70% de lo que sientes que podrías, con 3 repeticiones en reserva SIEMPRE.', f2nNada: 'Progresión corporal', f2oNada: 'Dominar las progresiones con tu propio cuerpo y construir base. La palanca sube antes que las repeticiones: variante más difícil solo con técnica limpia.', gemNota: 'El gemelo lento es el seguro del tendón: no lo saltes.', tendonSinTrote: 'La fuerza vuelve en semanas; el tendón necesita meses (su colágeno se renueva ~10 veces más lento y no tiene memoria muscular). Este bloque es el seguro del plan: empieza la semana 1 y acompaña todo el bloque.', introNunca: 'Plan revisado contra la evidencia (metaanálisis y ensayos 2010-2025). La idea que lo ordena todo: quien empieza de cero progresa rápido, los primeros meses son los de más ganancia de fuerza de tu vida, pero el tejido conectivo va detrás del músculo. Por eso las cargas suben despacio aunque puedas más.', introActivo: 'Plan revisado contra la evidencia (metaanálisis y ensayos 2010-2025). La idea que lo ordena todo: quien ya entrena no necesita más caña sino mejor dosis. El volumen justo, la progresión registrada y el descanso contado separan mantenerse de mejorar.', cNuncaT: 'Empezar de cero', cNuncaD: 'El primer año es el de mayor ganancia de fuerza de la vida: casi cualquier dosis bien hecha funciona, por eso sobran los programas extremos. La técnica va primero: las repeticiones limpias de hoy son los kilos seguros de dentro de tres meses.', cNuncaR: 'ganancias de novato: revisiones ACSM y metaanálisis de dosis-respuesta', cActivoT: 'Añadir sin romperte', cActivoD: 'El riesgo de quien ya entrena es apilar volumen nuevo sobre el viejo. Los saltos por encima de ~1,3× tu carga media reciente disparan las lesiones: añade una variable cada vez (días, volumen o intensidad), nunca las tres.', cActivoR: 'consenso COI de carga de entrenamiento (ACWR)', cSupT: 'Superávit que construye', cSupD: 'Para ganar músculo basta un superávit pequeño (~250-350 kcal): por encima, el extra se reparte hacia grasa. La báscula debe subir despacio; si sube rápido, no es músculo, porque la síntesis proteica tiene techo semanal.', cSupR: 'Garthe 2013 · Slater 2019 (superávit y composición)', r1Nunca: 'Cada fase tiene su tope de esfuerzo. Empezando de cero, la fuerza sube más rápido que la resistencia de tus tejidos: deja siempre 2-3 repeticiones en reserva y las ganancias llegan igual, sin peajes.', r1Activo: 'Cada fase tiene su tope de esfuerzo. Vienes entrenando, pero este volumen es nuevo: respeta los topes de RPE las dos primeras semanas y sube después. Frenar a tiempo es lo que te deja progresar las {s} semanas seguidas.', r8Nunca: 'El enemigo del principio no es la dureza, es la irregularidad. La semana caótica tiene un suelo: 2 fuerzas + 1 cardio. Eso mantiene todo en marcha.', r8Activo: 'También quien entrena tiene semanas imposibles. El suelo: 2 fuerzas + 1 cardio. Con eso no se pierde nada; el resto se recupera.', f1nNunca: 'Cimientos', f1oNunca: 'Construir el hábito y aprender los patrones de movimiento sin castigar articulaciones. Quedarse con ganas de más es intencionado.', f2nNunca: 'Técnica', f2oNunca: 'Aprender los básicos con carga ligera: cada repetición limpia de ahora son kilos seguros después. Trabaja lejos del fallo SIEMPRE.', f3oNunca: 'Volumen e intensidad de verdad, ya con la técnica rodada. Termina cada serie pudiendo hacer 2 repeticiones más, de las de verdad.', f1nActivo: 'Base', f1oActivo: 'Dos semanas de adaptación al plan: dosis conocida, registro en marcha y técnica afinada antes de subir nada.', f2nActivo: 'Construcción', f2oActivo: 'Volumen progresivo sobre tu base: trabaja al 70-75% de lo que sientes que podrías, con 2-3 repeticiones en reserva.', f3oActivo: 'Volumen e intensidad reales para forzar el cambio. Termina cada serie pudiendo hacer 2 repeticiones más, y que sean reales.', cierrePerder: 'El objetivo real del plan no es el {f}: es llegar ahí entrenando por costumbre, sin ciclo on/off. El peso que baja es la consecuencia, no la meta.', cierreRecomp: 'El objetivo real del plan no es el {f}: es llegar ahí con el hábito hecho y la ropa sentando distinto. La recomposición es lenta por diseño: la constancia es la meta.', cierreGanar: 'El objetivo real del plan no es el {f}: es llegar ahí más fuerte en la barra y con el hábito hecho. El músculo se construye en meses: el siguiente bloque empieza donde este acaba.', cierreManten: 'El objetivo real del plan no es el {f}: es que entrenar deje de ser un plan y sea una costumbre. Mantener es ganar.', cierreRenueva: 'Para renovar el bloque: Ajustes, Crear / rehacer mi plan. Dos toques y sigues.', platoVegetariano: '3 huevos + 2 claras, o 250 g de skyr o queso fresco batido + whey, o 200 g de tofu firme, o 150 g de tempeh, o 250 g de legumbre cocida + 1 huevo. Referencia visual: palma de la mano y media.', platoVegano: '200-250 g de tofu firme, o 150-180 g de tempeh, o 250 g de legumbre cocida + un cazo de proteína vegetal, o 80 g (en seco) de soja texturizada. Referencia visual: palma de la mano y media.', suplVegT: 'Proteína vegetal', suplVegD: '1 cazo de proteína de guisante o soja en la toma pre-sueño (y otro donde haga falta los días cortos de proteína).', numRecomp: 'Déficit suave ~300-450 kcal/día: recomponer pide paciencia, no agresividad.', numSup: 'Superávit ~250-350 kcal/día: más no es más músculo, es más grasa (Garthe 2013).', numMan: 'Tu mantenimiento estimado: la media semanal juzga y ajusta.', ritmoSubeT: 'Ritmo de subida esperado', ritmoManT: 'Ritmo esperado', ritmoSubeN: '≈0,25% del peso/sem: lo que el músculo puede construir. Media semanal, no día a día.', ritmoManN: 'La media semanal debe quedarse a ±0,3 kg de tu salida.', wjN1: 'Caminar-trotar I', wjN2: 'Caminar-trotar II', wjN3: 'Caminar-trotar III', lChkN: 'Checkpoint S{s}', lChkD: 'Peso dentro o mejor del corredor en la semana {s}.', alRapidoBaja: 'Añade 150 kcal de carbohidrato. A este ritmo el déficit también se come músculo.', alLentoBaja: 'Repasa raciones y pasos un par de días antes de recortar nada; si sigue plano, quita 100 kcal de carbohidrato solo en días de descanso.', alRapidoSube: 'Subes más deprisa de lo que se construye músculo: recorta 150 kcal de carbohidrato para que el extra no sea grasa.', alLentoSube: 'El superávit no asoma en la báscula: añade 150 kcal de carbohidrato en días de entreno.', alMantenT: 'Te estás moviendo del mantenimiento', alMantenD: 'Dos semanas seguidas de deriva: ajusta 100-150 kcal en la dirección contraria y no toques el entreno.', circProg: 'Sube 1-2 repeticiones por semana donde llegues con técnica limpia: esa es la progresión.', durAprox: '≈{m}′', splitFbC: 'Full Body', splitTpC: 'Torso · Pierna', splitPplC: 'Push · Pull · Legs', faseSub: '{s} ×{d}', nf1: 'F1–F2 (sem 1-{a})', nf2: 'F3 (sem {b}-{c})', nf3: 'F4 (sem {d}-{e})', dietBreakNota: 'Semana {w}: DIET BREAK a ~{k}', hitoCribadoT: 'Cribado de salud', hitoCribadoD: 'Antes de la fase de carga, si llevas años sin actividad vigorosa: tensión en una farmacia y una analítica básica (lípidos, glucosa). 15 minutos que compran tranquilidad.', hitoDietT: 'DIET BREAK', hitoDietD: 'Toda la semana comes a mantenimiento (~{k} kcal: +2 raciones de carbohidrato al día, proteína igual). El entreno no cambia. Restaura NEAT y leptina y rompe el ciclo on/off. El lunes siguiente, déficit otra vez.', hitoDescargaT: 'DESCARGA (no opcional)', hitoDescargaD: 'Misma rutina con la mitad de series y el mismo peso en la barra. No es cese: es mantenimiento de tejido y vacaciones para tendones y articulaciones.', tomaNocheAlt: '+ cada noche: toma pre-sueño con tu proteína vegetal (soja o guisante), ~40 g en batido. ', franjaM: 'Entrenas por la mañana: desayuna después del entreno, no antes.', franjaMd: 'Entrenas a mediodía: la comida fuerte cae justo después del entreno.', franjaT: 'Entrenas por la tarde: algo ligero antes; la cena hace de comida post-entreno.', cardioLibreT: 'Cardio: {d}', cardioLibreD: '{m}′ a ritmo cómodo y constante. Tu deporte cuenta igual que el trote: la constancia manda.', chk1: 'Fuera del corredor: repasa raciones y pasos antes de tocar nada. Las primeras semanas también se mueve agua.', chk2: 'Dos semanas fuera: ajusta 150 kcal de carbohidrato en la dirección que toque. La proteína no se toca.', chk3: 'Cierre: fotos, medidas y el siguiente bloque, decidido con datos.', lKgN: '−{v} kg', lKgD: 'Media semanal {v} kg por debajo de la salida.', lKgUpN: '+{v} kg', lKgUpD: 'Media semanal {v} kg por encima de la salida. Músculo, ladrillo a ladrillo.', lCintN: 'Cintura −{v}', lCintD: 'Cintura por debajo de {v} cm.', lReinaN: 'Métrica reina', lReinaD: 'Cintura por debajo de la mitad de tu estatura: {v} cm.', lFinDesc: 'Plan de {s} semanas terminado. La meta era el hábito; lo demás es consecuencia.', marca: 'Plan generado a tu medida', cuida: 'cuida: {a}', datos: '{p} kg · {a} cm · {e} años', menuAviso: '{n} platos del menú no encajan con tu dieta: cámbialos por cualquiera del recetario, ya filtrado para ti.', prepNota: 'Solo las recetas marcadas «batch» se dejan hechas el domingo; el resto se cocina al momento. Las cantidades de la compra ya cuentan las repeticiones de la semana.' },
    pBarraT: 'La barra del plan', pBarraSub: '{a} de {b} discos cargados',
    patrones: { eh: 'Empuje horizontal', ev: 'Empuje vertical', th: 'Tirón horizontal', tv: 'Tirón vertical', rod: 'Dominante de rodilla', bis: 'Bisagra de cadera', zan: 'Zancada', core: 'Core estable', flex: 'Flexión de tronco', curl: 'Flexión de codo', ext: 'Extensión de codo', gem: 'Gemelo', ais: 'Aislamiento' },
    quizCatEj: 'Ejercicio', quizCatDep: 'Deporte', quizCatCom: 'Comida',
    alta: { t: 'Crea tu usuario', sub: 'Fuerza, comida y progreso. Un plan hecho a tu medida, en dos minutos.', nombreL: 'Tu nombre', ph: '¿Cómo te llamamos?', cta: 'Empezar', local: 'Tus datos viven solo en este dispositivo. Sin cuentas, sin nube.', valNombre: 'Escribe un nombre de 2 a 24 letras.', idioma: 'Idioma' },
    rev: { evFecha: 'termina el {b}, justo antes', evSinFecha: 'sin fecha: manda el plazo que elegiste', minT: '{v} minutos por sesión', minSub: 'sesiones recortadas a lo esencial: los básicos se quedan', evT: 'Objetivo: {e}', evSub: 'la fecha manda: constancia por encima de perfección', durOpen: 'Sin fecha: bloques de {s} semanas, renovables', t: '{n}, tu plan está listo', tAnon: 'Tu plan está listo', sub: 'Decidido con tus respuestas. Esto no es una plantilla.',
      splitT: 'Fuerza {d} días por semana', splitFb: 'cuerpo completo: lo que más rinde con pocos días', splitTp: 'torso / pierna, en pares', splitPpl: 'empuje / tirón / pierna',
      kcalT: '{k} kcal al día', kDef: 'déficit de {v} kcal: perder grasa sin regalar músculo', kSup: 'superávit de {v} kcal para construir músculo', kMan: 'en tu mantenimiento, con la proteína al mando',
      protT: '{p} g de proteína al día', protSub: '{v} g por kilo de tu peso',
      durT: '{s} semanas por delante', durSub: 'del {a} al {b}',
      subsT: '{n} ejercicios sustituidos', subsSub: 'por tu material o tus descartes',
      cuidaT: 'Cuidado extra: {a}', cuidaSub: 'los ejercicios que lo tocan llevan aviso',
      menuT: 'Menú ajustado a tu mesa', menuSub: 'dieta e intolerancias aplicadas a la semana entera', menuAv: '{n} platos siguen sin encajar: lo verás avisado en Comida',
      gustosT: '{a} me gusta · {b} descartes', gustosSub: 'lo que descartaste no aparece en tu plan',
      cta: 'Ver mi semana 1', micro: 'Rehaz el cuestionario cuando quieras: todo se recalcula.' },
    tour: { salta: 'Saltar', sigue: 'Siguiente', listo: 'A entrenar', pasos: [
      ['Esto es HOY', 'Tu día, ya montado: sesión, comidas y registro. Marca ✓ y la app lleva la cuenta.'],
      ['La barra te mueve', 'Hoy, Plan, Comida, Progreso y Logros. Toca, o arrastra la burbuja.'],
      ['El plan entero', 'Fases, calendario, reglas y la biblioteca de ejercicios con su técnica en vídeo.'],
      ['Tu mesa', 'Menú semanal, recetas con foto, compra y meal prep, ya filtrados para ti.'],
      ['Progreso honesto', 'Peso, cintura, cargas y constancia. Si vas demasiado rápido, la app te frena.'] ] },
    cuest: {
      evFechaT: '¿Qué día es?', evFechaP: 'Con la fecha, el plan termina justo antes. Sin ella, manda el plazo que elijas.', evFechaSaltar: 'No lo sé todavía', evFechaMal: 'Elige una fecha entre 2 y 12 meses desde hoy.', 
      resLObj: 'Objetivo', resLEv: 'Para', resLDur: 'Plazo', resLHist: 'Vienes de', resLMat: 'Material', resLDieta: 'Mesa', resLFranja: 'Franja', resLLes: 'Cuida', resLSin: 'Evitas', 
      gateT: 'Tu salud manda', gateTxt: 'Has marcado que una condición médica limita tu ejercicio. Antes de generar nada, enséñale a tu médico lo que quieres hacer (fuerza {d} días por semana) y pídele el visto bueno.',
      gateGuardado: 'Tus respuestas quedan guardadas para cuando vuelvas.', gateOk: 'Tengo el visto bueno', gateSalir: 'Salir por ahora',
      gateHoyT: 'En pausa, con motivo', gateHoyTxt: 'El cuestionario quedó a medias: falta el visto bueno de tu médico. Con él, tu plan se genera al momento.', gateVolver: 'Retomar el cuestionario',
      resCta: 'Generar mi plan', resGen: 'Generando tu plan…',
      titulo: 'Tu plan, a medida', atras: 'Atrás', sigue: 'Continuar',
      sexoT: 'Tu cuerpo', sexoP: 'Se usa solo para calcular tus calorías.', sexoH: 'Hombre', sexoM: 'Mujer', sexoX: 'Prefiero no decirlo',
      medidasT: 'Tus medidas', edadL: 'Edad', alturaL: 'Altura (cm)', pesoL: 'Peso (kg)', cinturaL: 'Cintura (cm) · opcional',
      objT: '¿Qué buscas?', objPerder: 'Perder grasa', objRecomp: 'Recomponer: menos grasa, más músculo', objGanar: 'Ganar músculo', objMantener: 'Mantenerme',
      evT: '¿Para qué?', evBoda: 'Una boda', evOpo: 'Una oposición', evVerano: 'Operación verano', evSiempre: 'Para siempre',
      durT: '¿Cuánto tiempo te das?', dur3: '3 meses', dur6: '6 meses', dur12: '12 meses', durAlways: 'Sin fecha: hábito',
      histT: '¿De dónde vienes?', histP: 'La vuelta se programa distinto: el tendón marca el ritmo.', histNunca: 'Nunca he entrenado', histRetoma: 'Vuelvo tras años sin entrenar', histActivo: 'Entreno ahora',
      diasL: 'Días por semana', minL: 'Minutos por sesión', franjaT: '¿Cuándo prefieres?', franjaM: 'Mañana', franjaMd: 'Mediodía', franjaT2: 'Tarde-noche',
      matT: '¿Con qué material?', matNada: 'Sin material', matCasa: 'Casa: mancuernas y bandas', matGym: 'Gimnasio completo',
      lesT: '¿Molestias o lesiones?', lesRodilla: 'Rodilla', lesHombro: 'Hombro', lesLumbar: 'Lumbar', lesNo: 'Ninguna',
      medT: '¿Alguna condición médica que limite el ejercicio?', si: 'Sí', no: 'No',
      dietaT: 'Tu mesa', dietaNormal: 'Como de todo', dietaVegetariano: 'Vegetariano', dietaVegano: 'Vegano',
      sinT: '¿Evitas algo?', sinGluten: 'Gluten', sinLactosa: 'Lactosa', sinFrutos: 'Frutos secos', sinNada: 'Nada',
      resT: 'Tu perfil está listo', resP: 'Con esto se generará tu plan: entreno, comidas y progresión.',
      resGustos: '{a} me gusta · {b} descartes', resProfesional: 'Antes de generar un plan, consulta con un profesional de la salud: alguna de tus respuestas lo pide.',
      resGuardar: 'Guardar perfil', resGuardado: 'Perfil guardado', resProx: 'La generación del plan llega en la siguiente fase.',
      valNum: 'Revisa {c}: entre {a} y {b}.'
    },
    gPeso: 'Gráfica de peso corporal', gCintura: 'Gráfica de cintura',
    gCargas: 'Gráfica de cargas', gAdherencia: 'Gráfica de adherencia semanal',
    gRango: '{n} registros, de {a} a {b} {u}', gUnico: '1 registro, {a} {u}',
    gSemanas: '{n} de {t} semanas con datos',
    gSinDatos: 'sin datos todavía',
    fSinRegistro: 'Todavía no has registrado peso aquí. En cuanto lo hagas, verás cuánto falta.',
    valFuera: 'Introduce un valor entre {a} y {b} {u}.', descargaDosis: 'descarga',
    hechosDe: 'Hechos {a} de {b} · con {c} cuenta como sesión',
    cerrarSinSesion: 'Cerrar sin sesión', diaCerradoSinRacha: '✓ Día cerrado',
    sinRachaHoy: 'Hoy no suma a la racha.', mejorRachaNota: 'Tu mejor: {n} días.',
    sinSesionToast: 'Día cerrado sin sesión: hoy no cuenta.',
    reabrirDia: 'Reabrir día', diaReabierto: 'Día reabierto', mejorLbl: 'Mejor',
    cerrarDia: 'Cerrar el día', diaCerradoBtn: '✓ Día cerrado · racha {n}',
    diaCerradoToast: '✓ Día cerrado. Racha: {n}', diaCerradoSolo: 'Día cerrado.',
    sigueEditando: 'Puedes seguir editando: todo se guarda solo.',
    comidaHoy: 'La comida de hoy', comidaHoySub: '{kcal} kcal · {p} g de proteína en 4 tomas',
    desayuno: 'Desayuno', comidaLbl: 'Comida', cena: 'Cena', presueno: 'Pre-sueño',
    comidaLibreMn: 'COMIDA LIBRE', comidaLibreTitulo: 'Comida libre', comidaLibreTag: 'una comida, no un día', tuya: 'tuya',
    dietBreakChip: 'Diet break: +2 raciones de carbohidrato hoy. Proteína igual.',
    extraChip: 'Extra F{f}: una pieza de fruta + 40 g de pan en la comida.',
    sugEmpieza: '◆ empieza en {v}', sugRepite: '↻ repite {v}',
    faltaTitle: 'Toca si NO completaste todas las reps',
    repsAMediasToast: 'Marcado: faltaron reps (repetirás peso)', repsLimpiasToast: 'Todas las reps limpias',
    repsAMediasTag: 'reps a medias', repsLimpias: 'reps limpias', repsCortas: 'faltaron reps',
    prToast: 'PR en {e}: {v} kg', ya: '¡YA!',
    fHistorial: 'Tu historial', fMejor: 'mejor {v} kg', fHoy: 'hoy',
    fComo: 'Cómo se hace', fErrores: 'Errores que te robarán progreso', fAlt: 'Alternativas equivalentes',
    fArranque: 'Arranque sugerido', fArranqueTxt: '{v} kg en la semana 3.',
    fMarca: 'Tu marca de entonces: {t}',
    fFaltan: 'Te faltan {v} kg para recuperarla. Hay logro esperándote.',
    fRecuperada: 'Recuperada. Ese peso vuelve a ser tuyo.',
    fVideo: 'Ver técnica en vídeo',
    fDomiBtn: '¡Hoy salió mi primera dominada SIN asistencia!', fDomiOk: 'Registrada', fDomiYa: 'Dominada libre ya registrada',
    segPlan: ['Fases', 'Reglas', 'Ejercicios', 'Ciencia'],
    vReglas8: 'Las 8 reglas', vReglasSub: 'si dudas, gana la regla',
    vCalendario: 'Calendario', vFasesDetalle: 'Las 4 fases, al detalle',
    vSeguros: 'Los seguros del plan', libDescartado: 'descartado', libSinMaterial: 'sin material', libFuera: 'fuera de tu plan', vBiblioteca: 'Biblioteca de ejercicios', vTocaCualquiera: 'toca cualquiera',
    vCiencia: 'La ciencia del plan',
    senalesTitulo: 'Señales de parar', objetivoReal: 'El objetivo real', recuerda: 'Recuerda',
    fase: 'Fase', sem: 'Sem', fechasLbl: 'Fechas', especial: 'Especial', fuerzaLbl: 'Fuerza',
    seriesLbl: 'Series', descLbl: 'Desc.', ejercicioLbl: 'Ejercicio', diaLbl: 'Día',
    cardioFase: 'Cardio de la fase',
    zonas: { empuje: 'Empuje', tiron: 'Tirón', pierna: 'Pierna y cadera', core: 'Core' },
    chipsNutri: ['Objetivo', 'El plato', 'Recetas', 'Menú', 'Compra', 'Meal prep', 'Suplementos'],
    nObjetivo: 'Tu objetivo ahora', nSemana: 'semana {w}',
    nNumeros: 'De dónde salen los números', nPlato: 'Cómo montar cada comida',
    nRecetario: 'Recetario', nToca: 'toca para cocinar', nMenu: 'Menú semanal',
    nCompra: 'La compra de la semana', nPrepDom: 'Meal prep del domingo', nSupl: 'Suplementos',
    nReiniciar: 'reiniciar', nProteLbl: 'Prote', nGrasaLbl: 'Grasa', nCarbosLbl: 'Carbos', kcalLbl: 'kcal',
    nDietBreakTitulo: 'Esta semana: DIET BREAK', nDietBreakTxt: '~{k} kcal: +2 raciones de carbohidrato al día. Proteína igual. Entreno igual.',
    nTomaNota: '+ cada noche: toma pre-sueño (skyr + whey). ',
    nIngredientes: 'Ingredientes (1 ración)', nPasos: 'Pasos', opcionalParen: ' (opcional)',
    chipsProg: ['Resumen', 'Peso', 'Cintura', 'Cargas', 'Semanas', 'Checkpoints'],
    pPeso: 'Peso', pPerdido: 'Perdido', pGanado: 'Ganado', pCintura: 'Cintura', pAdh: 'Adherencia', pSesiones: 'Sesiones', pRacha: 'Racha',
    pMediaS: 'media S{w}', pSinDatos: 'sin datos', pDesde: 'desde {v}', pCinturaSub: '{f} · meta <{m}', pCinturaLunes: 'lunes en ayunas',
    pFuerzas: '{a}/{b} fuerzas', pDeFuerza: 'de fuerza', pDiasCumplidos: 'días cumplidos',
    pPesoTitulo: 'Peso', pPesoSub: 'puntos: pesajes · línea: media semanal · banda: corredor esperado',
    pCinturaTitulo: 'Cintura', pCinturaTituloSub: 'la métrica reina · objetivo <{m} cm',
    pCargas: 'Cargas', pCargasSub: 'peso del ejercicio, sesión a sesión',
    pAdhTitulo: 'Adherencia', pAdhSub: 'sesiones de fuerza completadas por semana',
    pChk: 'Checkpoints', pEsperado: 'Esperado', pReal: 'Real', pSiDesvias: 'Si te desvías',
    pTabla: 'tabla', pGrafica: 'gráfica', pFecha: 'Fecha',
    pLifts: { 'press-banca': 'Banca', 'sentadilla-barra': 'Sentadilla', 'rdl-barra': 'Rumano' },
    pTuMarca: 'tu marca · {v} kg', pMeta91: 'meta {m}', pAguaCreatina: 'agua (primeras semanas)', pLineaBase: 'Línea base',
    pMediaSemana: 'Media S{w}',
    pVacioPeso: 'Los pesajes de lunes, miércoles y viernes aparecerán aquí',
    pVacioCintura: 'Cada lunes en ayunas: cinta al ombligo, sin apretar',
    pVacioCargas: 'En cuanto registres kg en este ejercicio, aquí verás la escalada',
    pVacioAdh: 'Semana a semana, aquí se verá tu constancia',
    pCheckpointSemana: 'Semana de checkpoint', pEsperadoRango: 'Esperado: {a}–{b} kg', pLlevas: ' · llevas {v}', pSinPesajes: ' · aún sin pesajes esta semana',
    pRapido: 'Vas demasiado rápido', pLento: 'Ritmo por debajo de lo esperado',
    pFrenaTrote: 'Frena el trote', pFrenaTxt: 'Esta semana llevas {r}× tu media reciente de minutos corriendo. Por encima de 1,3× el riesgo de lesión se dispara: recorta o camina.',
    lDiscos: 'La colección de discos', lDiscosSub: 'uno por fase completada',
    lLogros: 'Logros', lFuerzas: 'Fuerzas', lPRs: 'PRs', lPerdido: 'Perdido', lMejorRacha: 'Mejor racha', lLogrosN: 'Logros', lFotos: 'Fotos',
    perfilCinturaAdd: '+ Añadir cintura', perfilCinturaNota: 'Se convierte en tu línea base y activa la meta y los logros de cintura. El resto del plan no cambia.', cerrarSesion: 'Cerrar sesión', cerrarSesionNota: 'Vuelves a la puerta de entrada. Tu plan y tus registros se quedan guardados en este dispositivo.', rehacerSub: '¿Qué quieres rehacer?', rehacerTodo: 'Cuestionario completo', rehacerTodoSub: 'Datos y gustos, de arriba abajo.', rehacerDatos: 'Solo mis datos', rehacerDatosSub: 'Edad, objetivo, días, material… El mazo no se toca.', rehacerGustos: 'Solo mis gustos', rehacerGustosSub: 'El mazo de cartas, desde cero.', perfilDetrasT: 'Detrás del plan', buscarT: 'Buscar en la app', buscarPH: 'Ejercicio, plato, sección…', buscarNada: 'Nada con ese nombre. Prueba otra palabra.', chipFases: 'Fases al detalle', perfilT: 'Mi perfil', perfilDatosT: 'Tus respuestas', perfilPlanT: 'Tu plan, en corto', ajustes: 'Ajustes', ajustesSub: 'BACK2PRIME · tus datos viven SOLO en este dispositivo',
    ajLineaBase: 'Línea base', ajCinturaIni: 'Cintura inicial (cm)', ajGuardar: 'Guardar línea base', ajGuardado: 'Guardado',
    ajCopia: 'Copia de seguridad',
    ajCopiaTxt: 'Los datos no salen del móvil. Haz una copia de vez en cuando (o antes de cambiar de dispositivo) y guárdala donde quieras.',
    ajExportar: 'Exportar', ajImportar: 'Importar', ajImportOk: 'Copia restaurada', ajImportErr: 'Ese archivo no parece una copia de BACK2PRIME',
    ajIdioma: 'Idioma', ajIdiomaNota: 'La app se recarga al cambiar. Tus datos no se tocan.',
    ajRehacer: 'Crear / rehacer mi plan', ajRehacerNota: 'Te lleva al cuestionario. Al generar de nuevo, tus registros diarios no se tocan.', ajPeligro: 'Zona peligrosa', ajBorrar: 'Eliminar perfil y todos los datos', ajBorrarConfirma: '¿Seguro? Toca otra vez para borrar TODO',
    obTitulo: 'Bienvenido a BACK2PRIME', obSub: '12 semanas · 17 ago → 8 nov · de 95 a tu mejor versión',
    obTexto: 'Tu cuaderno de entreno, tu plan y tu nutrición en un solo sitio. Marca lo que haces cada día: la app te sugiere los pesos, vigila tu ritmo y suelta logros. Todo queda en tu móvil.',
    obConsejo: 'Consejo: añádela a la pantalla de inicio (Compartir → Añadir a pantalla de inicio) para usarla como una app de verdad.',
    obCintura: 'Cintura inicial — tu métrica reina', obPlaceholder: 'cm (opcional, puedes hacerlo luego)', obEmpezamos: 'Empezamos',
    celebraOk: 'Seguimos',
    navAria: 'Navegación principal',
    nube: { correoL: 'Correo', claveL: 'Contraseña (mínimo 8)', entrar: 'Entrar', crear: 'Crear cuenta', aCrear: '¿Primera vez? Crea tu cuenta', aEntrar: '¿Ya tienes cuenta? Entra', olvide: 'He olvidado la contraseña', enviadoReset: 'Correo enviado: abre el enlace para cambiarla', nuevaClaveT: 'Elige una contraseña nueva', guardarClave: 'Guardar contraseña', cambiada: 'Contraseña cambiada: ya puedes entrar', confirmaCorreo: 'Revisa tu correo y confirma la cuenta; después entra aquí', yaExiste: 'Ese correo ya tiene cuenta: entra con tu contraseña', errCred: 'Correo o contraseña incorrectos', errCorreo: 'Escribe un correo válido', errClaveCorta: 'La contraseña necesita al menos 8 caracteres', errRitmo: 'Demasiados intentos seguidos: espera un momento', errRed: 'Sin conexión con el servidor: prueba de nuevo', local: 'Tu cuenta guarda tu plan y te sigue en cualquier dispositivo. Solo tú puedes verlo.', ajustesSub: 'BACK2PRIME · tu plan vive en tu cuenta y solo tú puedes verlo', cerrarSesionNota: 'Vuelves a la puerta de entrada. Tu plan queda en tu cuenta: entra de nuevo y sigues donde ibas.' },
    comp: { t: 'Compartir mi plan', nota: 'Crea un enlace público de solo lectura con tu plan: sin tu peso ni tus registros.', copiado: 'Enlace copiado', quitar: 'Dejar de compartir', quitado: 'Enlace desactivado', vT: 'El plan de {n}', vSub: 'Generado con BACK2PRIME', vCta: 'Hazte el tuyo', noExiste: 'Ese enlace no existe o su dueño lo desactivó', sem: '{s} semanas', dias: '{d} días/semana' },
    nuevoDia: 'Nuevo día: {f}'
  };

  UI.checkSalidaTitulo = 'Check de salida ({f})';
  UI.checkSalidaTxt = 'Completas ambos circuitos con las reps de la semana 2 sin dolor articular → Fase 2. Si algo molesta, repites una semana: los tendones lo agradecen.';
  UI.planEmpiezaTitulo = 'El plan empieza el {f}';
  UI.planEmpiezaTxt = 'Fase 1 · Reactivación en casa. Aquí tienes todo para llegar con los deberes hechos.';

    const QUIZ_DEP = [{ id: 'running', n: 'Correr' }, { id: 'natacion', n: 'Natación' }, { id: 'ciclismo', n: 'Ciclismo' }, { id: 'padel', n: 'Pádel' }, { id: 'futbol', n: 'Fútbol' }, { id: 'baloncesto', n: 'Baloncesto' }, { id: 'volley', n: 'Vóley' }, { id: 'yoga', n: 'Yoga' }, { id: 'calistenia', n: 'Calistenia' }, { id: 'boxeo', n: 'Boxeo' }];
  return { META, FASES, CAL, HITOS_SEMANA, SESIONES, CALENTAMIENTO, TENDON, CARRERA, HISTORICO, ARRANQUE, EJERCICIOS, REGLAS, SENALES, NUTRI, RECETAS, COMPRA, MEALPREP, MEALPREP_NOTA, MENU, CHECKPOINTS, AJUSTES, FOTOS, LOGROS, CIENCIA, CIERRE, AVISO_LEGAL, QUIZ_DEP, UI };
})();
