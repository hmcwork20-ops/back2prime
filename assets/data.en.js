/* ============================================================
   BACK2PRIME · data.en.js
   All content for the 12-week plan: phases, calendar,
   sessions, exercise cards, nutrition, recipes, achievements.
   No logic: data only. Logic lives in app.js.
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
      objetivoNota: '≈ −8 kg of actual fat: creatine hides ~1 kg of water on the scale',
      cinturaMetaCm: 91,
      grasaEstimada: '~22% → 16-17%',
      proteinaDia: 190
    }
  };

  /* ---------- PHASES (olympic plate colour code) ---------- */
  const FASES = [
    { id: 1, nombre: 'Reactivation', sub: 'At home', semanas: [1, 2], disco: 10, rpe: '6–7',
      fechas: '17 – 30 Aug',
      objetivo: 'Rebuild the habit and wake up movement patterns without punishing your joints. You’ll be left wanting more: that’s intentional.' },
    { id: 2, nombre: 'Back in the gym', sub: 'Full Body ×3', semanas: [3, 4, 5], disco: 15, rpe: '6–7',
      fechas: '31 Aug – 20 Sep',
      objetivo: 'Relearn the barbell basics and build a base of load. Your muscle memory allows weights your connective tissue can’t yet take: work at 65-70% of what you feel you could do, with 3 reps in reserve ALWAYS.' },
    { id: 3, nombre: 'Loading', sub: 'Upper / Lower ×4', semanas: [6, 7, 8, 9], disco: 20, rpe: '7–8',
      fechas: '21 Sep – 18 Oct',
      objetivo: 'Real volume and intensity to force the recomposition: this is where muscle memory truly pays. End every set able to do 2 more reps, and make them real: returning lifters tend to overestimate how close they are to failure.' },
    { id: 4, nombre: 'Peak', sub: 'Push / Pull / Legs ×5', semanas: [10, 11, 12], disco: 25, rpe: '8',
      fechas: '19 Oct – 8 Nov',
      objetivo: 'Maximum stimulus to close out the recomposition. {d} days, but {min} minute sessions, not 2-hour ones. RPE 8: 1-2 reps in reserve on the final sets.' }
  ];

  /* ---------- CALENDAR: 12 weeks × 7 days (Mon..Sun) ----------
     Each slot: a session id, or {s:id, opt:true} if optional.   */
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

  /* ---------- SPECIAL WEEKS (evidence: managed deload + diet break + transition) ---------- */
  const HITOS_SEMANA = {
    5:  { t: 'Health screen', d: 'Before Phase 3 (vigorous work after 5 years off): get your blood pressure checked at a pharmacy and a basic blood panel (lipids, glucose/HbA1c). 15 minutes that buy peace of mind.' },
    7:  { t: 'DIET BREAK', d: 'All week you eat at maintenance (~2,800 kcal: +2 carb portions a day, protein unchanged). Training doesn’t change. It’s not a reward or a relapse: it restores NEAT and leptin, and breaks the psychological on/off cycle. Come Monday, back to the deficit as if nothing happened.' },
    9:  { t: 'DELOAD (not optional)', d: 'Same routine with HALF the sets per exercise and the same weight on the bar. It’s not a stop: stopping completely costs strength. It’s tissue maintenance + a holiday for tendons and joints before the final block.' },
    10: { t: 'Transition to 5 days', d: 'First PPL week: do ONE set less on everything. The jump from 4 to 5 days is the plan’s highest tendon-risk point; you walk in, you don’t jump in.' }
  };

  /* ---------- SESSIONS ---------- */
  // blocks: e = exercise id · s = sets · r = reps (rW = by week) · d = rest sec · n = short note
  const SESIONES = {
    /* — Phase 1 · home — */
    'c-a': { nombre: 'Circuit A', tipo: 'fuerza', fase: 1, dur: '~35′', calent: true, bloques: [
      { e: 'sentadilla-pc',  s: 3, rW: { 1: '10', 2: '12' }, d: 75 },
      { e: 'flexiones',      s: 3, rW: { 1: '6-8', 2: '8-10' }, d: 75 },
      { e: 'puente-gluteo',  s: 3, rW: { 1: '12', 2: '15' }, d: 60 },
      { e: 'plancha',        s: 3, rW: { 1: '25″', 2: '35″' }, d: 60 },
      { e: 'elev-talones',   s: 2, rW: { 1: '15', 2: '20' }, d: 45, n: 'Preps the tendons for jogging' }
    ]},
    'c-b': { nombre: 'Circuit B', tipo: 'fuerza', fase: 1, dur: '~35′', calent: true, bloques: [
      { e: 'zancada-alterna', s: 3, rW: { 1: '8/leg', 2: '10/leg' }, d: 75 },
      { e: 'remo-toalla',     s: 3, rW: { 1: '10', 2: '12' }, d: 75 },
      { e: 'rdl-1p',          s: 3, rW: { 1: '8/leg', 2: '10/leg' }, d: 60 },
      { e: 'superman',        s: 3, rW: { 1: '10', 2: '12' }, d: 45 },
      { e: 'dead-bug',        s: 3, rW: { 1: '10/side', 2: '12/side' }, d: 45 }
    ]},
    /* — Phase 2 · Full Body — */
    'fb-a': { nombre: 'Full Body A', tipo: 'fuerza', fase: 2, dur: '~60′', calent: true, bloques: [
      { e: 'sentadilla-barra',   s: 3, r: '8',  d: 120, n: 'W3: empty bar or +10-20 kg, pattern only' },
      { e: 'press-banca',        s: 3, r: '8',  d: 120 },
      { e: 'remo-barra',         s: 3, r: '8',  d: 120 },
      { e: 'press-militar-mc',   s: 2, r: '10', d: 90 },
      { e: 'curl-femoral-tumbado', s: 2, r: '12', d: 90 },
      { e: 'plancha',            s: 3, r: '40″', d: 60, n: 'Once it’s easy: alternate lifting one hand' }
    ]},
    'fb-b': { nombre: 'Full Body B', tipo: 'fuerza', fase: 2, dur: '~60′', calent: true, bloques: [
      { e: 'rdl-barra',          s: 3, r: '8',  d: 120, n: 'Start with 30-40 kg' },
      { e: 'press-inclinado-mc', s: 3, r: '10', d: 120 },
      { e: 'jalon-pecho',        s: 3, r: '10', d: 90 },
      { e: 'zancada-mc',         s: 2, r: '10/leg', d: 90, n: '6-10 kg per hand' },
      { e: 'elev-laterales',     s: 2, r: '15', d: 60 },
      { e: 'face-pull',          s: 2, r: '15', d: 60, n: 'Counterweight to the pressing: shoulder health from day one' },
      { e: 'crunch-polea',       s: 3, r: '12', d: 60 }
    ]},
    /* — Phase 3 · Upper/Lower — */
    'torso-a': { nombre: 'Upper A', tipo: 'fuerza', fase: 3, dur: '~70′', calent: true, bloques: [
      { e: 'press-banca',      s: 4, r: '6-8', d: 150, n: 'Heavy basic: clean 4×8 → +2.5 kg and back to 4×6' },
      { e: 'remo-barra',       s: 4, r: '8',   d: 120, n: 'Same weight across all 4 sets' },
      { e: 'press-militar',    s: 3, r: '10',  d: 90 },
      { e: 'jalon-pecho',      s: 3, r: '10',  d: 90, n: '1″ pause at the bottom' },
      { e: 'elev-laterales',   s: 3, r: '15',  d: 60 },
      { e: 'face-pull',        s: 2, r: '15',  d: 60, n: '2nd weekly dose of external rotation' },
      { e: 'curl-barra-z',     s: 2, r: '12',  d: 60 },
      { e: 'ext-triceps-polea', s: 2, r: '12', d: 60 }
    ]},
    'pierna-a': { nombre: 'Lower A', tipo: 'fuerza', fase: 3, dur: '~70′', calent: true, tendon: 'rodilla', bloques: [
      { e: 'sentadilla-barra', s: 4, r: '6-8', d: 150, n: 'Double progression, same as the bench' },
      { e: 'rdl-barra',        s: 3, r: '8',   d: 120, n: '+5 kg once all 3 sets come out clean' },
      { e: 'prensa',           s: 3, r: '10',  d: 90 },
      { e: 'curl-femoral-tumbado', s: 3, r: '12', d: 90, n: '3″ eccentric' },
      { e: 'gemelo-pie',       s: 4, r: '8',   d: 90, n: 'Tendon HSR: 3″ down / 3″ up, with proper load' },
      { e: 'plancha-lastre',   s: 3, r: '40″', d: 60 }
    ]},
    'torso-b': { nombre: 'Upper B', tipo: 'fuerza', fase: 3, dur: '~70′', calent: true, bloques: [
      { e: 'press-inclinado-mc', s: 4, r: '8', d: 120, n: 'The day’s heavy press' },
      { e: 'dominadas',        s: 4, r: '8',   d: 120, n: 'Reduce the assistance week by week' },
      { e: 'press-plano-mc',   s: 3, r: '10',  d: 90 },
      { e: 'remo-polea',       s: 3, r: '12',  d: 90 },
      { e: 'face-pull',        s: 3, r: '15',  d: 60, n: 'Shoulder health for the pressing phases' },
      { e: 'curl-inclinado',   s: 2, r: '12',  d: 60, n: 'Superset with skull crushers if pressed for time' },
      { e: 'press-frances',    s: 2, r: '12',  d: 60 }
    ]},
    'pierna-b': { nombre: 'Lower B', tipo: 'fuerza', fase: 3, dur: '~70′', calent: true, tendon: 'rodilla', bloques: [
      { e: 'hip-thrust',       s: 4, r: '8',   d: 120, n: '1″ pause at the top, glutes squeezed hard' },
      { e: 'zancada-bulgara',  s: 3, r: '10/leg', d: 90, n: 'The toughest one in the plan. Start with no weight' },
      { e: 'ext-cuadriceps',   s: 3, r: '12',  d: 90, n: 'If the kneecap complains, cut the range at the top' },
      { e: 'curl-femoral-sentado', s: 3, r: '12', d: 90 },
      { e: 'gemelo-sentado',   s: 4, r: '15',  d: 60 },
      { e: 'elev-piernas',     s: 3, r: '10',  d: 60 }
    ]},
    /* — Phase 4 · PPL — */
    'push-a': { nombre: 'Push', tipo: 'fuerza', fase: 4, dur: '~65′', calent: true, bloques: [
      { e: 'press-banca',       s: 4, r: '6',  d: 150 },
      { e: 'press-militar',     s: 3, r: '8',  d: 120 },
      { e: 'press-inclinado-mc', s: 3, r: '10', d: 90 },
      { e: 'elev-laterales',    s: 4, r: '15', d: 60 },
      { e: 'ext-triceps-polea', s: 3, r: '12', d: 60, n: 'Alternate with the overhead extension' },
      { e: 'ext-triceps-cabeza', s: 3, r: '12', d: 60 }
    ]},
    'pull-a': { nombre: 'Pull', tipo: 'fuerza', fase: 4, dur: '~65′', calent: true, bloques: [
      { e: 'rdl-barra',        s: 3, r: '6-8', d: 150 },
      { e: 'dominadas',        s: 4, r: '8',   d: 120, n: 'Weighted if you get more than 10' },
      { e: 'remo-barra',       s: 3, r: '10',  d: 120, n: 'Or cable row' },
      { e: 'face-pull',        s: 3, r: '15',  d: 60 },
      { e: 'curl-barra-z',     s: 3, r: '10',  d: 60 },
      { e: 'curl-martillo',    s: 2, r: '12',  d: 60 }
    ]},
    'legs': { nombre: 'Legs', tipo: 'fuerza', fase: 4, dur: '~70′', calent: true, tendon: 'rodilla', bloques: [
      { e: 'sentadilla-barra', s: 4, r: '6',  d: 150 },
      { e: 'prensa',           s: 3, r: '10', d: 120 },
      { e: 'hip-thrust',       s: 3, r: '10', d: 120 },
      { e: 'curl-femoral-tumbado', s: 3, r: '12', d: 90 },
      { e: 'gemelo-pie',       s: 4, r: '8',  d: 90, n: 'HSR: 3″ down / 3″ up' },
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
      { e: 'remo-mancuerna',   s: 3, r: '12/side', d: 90 },
      { e: 'pullover-polea',   s: 3, r: '15', d: 60 },
      { e: 'encogimientos',    s: 3, r: '12', d: 60 },
      { e: 'curl-polea',       s: 3, r: '15', d: 60 }
    ]},
    /* — Cardio — */
    'cam40':  { nombre: 'Walk 40′', tipo: 'cardio', icono: 'walk', detalle: 'Awkward-conversation pace: you can talk, but not sing. Counts towards the day’s steps.' },
    'cam60':  { nombre: 'Walk 60′', tipo: 'cardio', icono: 'walk', detalle: 'Brisk, sustained pace. Ideal outdoors: adds light, steps and active recovery.' },
    'wj3': { nombre: 'Walk-jog W3', tipo: 'cardio', icono: 'run', detalle: '7 rounds: 2′ easy jog + 2′ walking (28′). Before: 2×20 tibialis raises + 10 calf raises. Genuinely easy jogging: if you can’t hold a chat, you’re going too fast.' },
    'wj4': { nombre: 'Walk-jog W4', tipo: 'cardio', icono: 'run', detalle: '6 rounds: 3′ jog + 2′ walking (30′). Before: 2×20 tibialis raises. High cadence, short steps: less impact per stride.' },
    'wj5': { nombre: 'Walk-jog W5', tipo: 'cardio', icono: 'run', detalle: '5 rounds: 5′ jog + 1′ walking (30′), or 20′ of continuous easy jogging if the body feels good. Before: 2×20 tibialis raises.' },
    'trote25': { nombre: 'Jog 25-30′', tipo: 'cardio', icono: 'run', detalle: 'Continuous and conversational. Smooth tarmac or firm dirt beats uneven pavements. If shin or knee discomfort appears and worsens as you run: stop and walk.' },
    'trote30': { nombre: 'Jog 30-35′', tipo: 'cardio', icono: 'run', detalle: 'Continuous. One day can be a touch livelier (last 10′ at a moderate pace), the other always easy.' },
    'libre': { nombre: 'Rest', tipo: 'libre', icono: 'rest', detalle: 'A proper day off. Daily steps still count. Sunday: meal prep (~90′) leaves the week sorted.' }
  };

  /* ---------- WARM-UP (always, 6′) ---------- */
  const CALENTAMIENTO = {
    titulo: 'Warm-up · 6′ · every session',
    pasos: [
      'Arm circles · 30″',
      'Hip rotations · 30″ per side',
      '10 slow bodyweight squats',
      '5 lunges with a twist per side',
      'Plank · 20″',
      '20 jumping jacks'
    ],
    gym: 'At the gym, also: 1-2 light ramp-up sets on the day’s first heavy exercise (50% and 75% of your working weight).'
  };

  /* ---------- TENDON PROTOCOL (the plan’s insurance policy) ---------- */
  const TENDON = {
    titulo: 'Tendon protocol · 6-8′ · 2-3×/week',
    intro: 'Strength comes back in weeks; tendon needs months (its collagen renews ~10 times slower and has no muscle memory). This block is the plan’s insurance: it starts in week 1, and week 3’s jogging only happens with two weeks of tendon work already banked.',
    bloques: [
      { id: 'tendon-rodilla', nombre: 'Patellar · isometric', donde: 'After every leg session (in P1, after the circuits)',
        detalle: 'Isometric wall squat (P2+: Spanish squat with a rigid strap behind the knees): 5 × 45″ at ~70% effort, 1′ rest. Thigh near parallel, no sharp pain. Beyond adapting the tendon, it has an immediate pain-relieving effect (Rio 2015).' },
      { id: 'tendon-aquiles', nombre: 'Achilles · calf HSR', donde: 'Already built into the sessions (calf raises)',
        detalle: 'The rule that changes everything: calf work HEAVY and SLOW, 3″ down, 3″ up, 6-8 reps, no bouncing. In P1 with a loaded backpack on one leg; at the gym with real load. Bouncing uses the tendon’s reflex and robs it of exactly the stimulus it needs.' },
      { id: 'tendon-tibial', nombre: 'Tibialis anterior', donde: 'Before every jog',
        detalle: 'Wall-supported tibialis raises: 2-3 × 15-20. It’s the vaccine against shin splints at your current weight.' },
      { id: 'tendon-codo', nombre: 'Elbow/wrist · isometric', donde: 'After upper-body sessions (P2+), 2×/week',
        detalle: 'With a light dumbbell, wrist held still at mid-flexion: 3 × 45″ (palm up and palm down). The press + row + pulldown volume triggers epicondylitis in returning lifters; this prevents it for free.' }
    ],
    nota: 'Do NOT add plyometrics/jumps "to prepare for jogging": the evidence says it’s a poor tendon stimulus with high impact. Your impact preparation is this block.'
  };

  /* ---------- RUNNING RULES (evidence: BMI ~28) ---------- */
  const CARRERA = {
    titulo: 'How to run without breaking ({p} kg in charge)',
    reglas: [
      'Cadence 170-180 steps/min, short stride: cuts tibial impact ~11% and loading rate ~15%. Count steps for 30″ (85-90) or use your watch’s metronome.',
      'Volume governed by feel and the plan’s progression: never go above ~1.3× your average of the last 4 weeks (the app warns you).',
      'Week 3 starts with ~2.5 km of total jogging: under the 3 km/week ceiling the evidence sets for starting out overweight.',
      'Surface and shoes CONSTANT: don’t change both at once. Smooth tarmac or firm dirt beats pavements.',
      'Shin or knee discomfort that WORSENS as you run: stop and walk. If it fades as you warm up, watch it; if it grows, it rules.'
    ]
  };

  /* ---------- HISTORIC LIFTS (gym era, ~2021) ---------- */
  // Not loaded as PRs: they’re the "where you were" reference and the target to reclaim.
  const HISTORICO = {
    'press-banca':      { kg: 95,  reps: 8, series: 4, txt: '95 kg × 8 (4 sets)',  rm: 120 },
    'sentadilla-barra': { kg: 100, reps: 8, series: 5, txt: '100 kg × 8 (5 sets)', rm: 127 }
  };

  /* ---------- STARTING LOADS · PHASE 2 ---------- */
  const ARRANQUE = {
    titulo: 'What weight to start with at the gym (week 3)',
    derivacion: 'They come from your real lifts — bench 95×8 and squat 100×8 (1RM ≈ 120 and ≈ 127 kg) — at 50%: the standard restart for a returning lifter. Not because the muscle can’t do more, but because the tendon hasn’t been loaded in 5 years. From there, the app runs the double progression.',
    tabla: [
      { ej: 'press-banca',      s3: '45 kg', s4: '47.5 kg', s5: '50 kg', n: '50% of your 95. Bar + 2×12.5' },
      { ej: 'sentadilla-barra', s3: '50 kg', s4: '55 kg',   s5: '60 kg', n: '50% of your 100. Bar + 2×15' },
      { ej: 'rdl-barra',        s3: '45 kg', s4: '50 kg',   s5: '55 kg', n: '≈45% of your old squat' },
      { ej: 'remo-barra',       s3: '40 kg', s4: '42.5 kg', s5: '45 kg', n: '≈45% of your old bench' }
    ],
    resto: 'The rest have no previous mark: on the first set pick a weight you can move with 3 reps in reserve, log it, and the app takes over from there.',
    aviso: 'These weights will feel ridiculous. That’s the point: comeback tendinitis brews in weeks 3-5, when the nervous system allows what the tendons can’t yet take.',
    desequilibrio: 'Your own numbers say it: squat 100 vs bench 95 is a ratio of 1.05 (balanced sits around 1.4-1.5). Your lower body was lagging — and that’s the double good news: it’s where you have the most headroom and what moves recomposition most. Don’t skip leg days.'
  };

  /* ---------- EXERCISE CARDS ---------- */
  // musc: [primary, secondary] · cues: technique · err: typical mistakes ·
  // alt: equivalent alternatives (commercial gym) · mol: if it hurts, switch to
  const EJERCICIOS = {
    /* — Home / P1 — */
    'sentadilla-pc': { pat: 'rod',
      nombre: 'Bodyweight Squat', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quads', 'glutes'], equipo: 'Nothing',
      cues: ['Feet shoulder-width, toes slightly out', 'Lower for 3″ as if sitting back, up in 1″', 'Knees track the toes, heels nailed to the floor', 'Chest up through the whole range'],
      err: ['Heels lifting off (don’t go as deep)', 'Knees collapsing inwards', 'Bouncing down instead of controlling it'],
      alt: [{ n: 'Squat to a box/sofa', por: 'if controlling depth is hard' }, { n: 'Squat with a 2″ pause at the bottom', por: 'if 12 reps feel too easy' }],
      mol: 'If the knee complains: reduce depth to where it doesn’t hurt and lower even slower.'
    },
    'flexiones': { pat: 'eh',
      nombre: 'Push-ups', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Chest', 'triceps, shoulders'], equipo: 'Nothing',
      cues: ['Hands slightly wider than shoulders', 'Elbows at 45° from the body, neither tucked nor flared', 'Body like a plank: glutes and abs braced', 'Chest (almost) touches the floor every rep'],
      err: ['Hips sagging or piking up', 'Half range', 'Neck poking towards the floor'],
      alt: [{ n: 'Push-ups with hands on a sofa/table', por: 'if clean floor reps aren’t there yet' }, { n: 'Feet-elevated push-ups', por: 'if you clear 12 with ease' }],
      mol: 'If the wrist complains: closed fists or push-up handles. If the shoulder complains: narrow the width a touch.'
    },
    'puente-gluteo': { pat: 'bis',
      nombre: 'Glute Bridge', mm: { p: ['gluteo'], s: ['isquios'] }, zona: 'pierna', musc: ['Glutes', 'hamstrings'], equipo: 'Nothing',
      cues: ['Lying down, heels close to your glutes', 'Drive through the heels and lift the hips', '2″ pause at the top squeezing the glutes hard', 'Ribs down: don’t arch the lower back'],
      err: ['Pushing through the toes', 'Arching the lower back to get higher', 'Up and down with no pause'],
      alt: [{ n: 'Single-leg bridge', por: 'once 15 reps feel comfortable' }, { n: 'Bridge with a backpack on your hips', por: 'to add load at home' }],
      mol: 'If the hamstring cramps: bring the heels closer to your glutes.'
    },
    'plancha': { pat: 'core',
      nombre: 'Front Plank', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Full core'], equipo: 'Nothing',
      cues: ['Forearms on the floor, elbows under the shoulders', 'Ribs in, pelvis tucked (tuck your backside under)', 'Glutes squeezed, eyes on the floor', 'Breathe: don’t hold your breath'],
      err: ['Hips sagging (lower back suffers)', 'Backside piked up (cheating)', 'Holding on while shaking: if the lower back trembles, end the set'],
      alt: [{ n: 'Plank on the knees', por: 'if you can’t hold the time with good form' }],
      mol: 'If the lower back complains: check the pelvic tuck first; it’s usually that.'
    },
    'plancha-lastre': { pat: 'core',
      nombre: 'Weighted Plank', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Full core'], equipo: '5-10 kg plate',
      cues: ['Same technique as the regular plank', 'Have the plate placed between your shoulder blades, not on the lower back', 'If the hips drop, remove weight'],
      err: ['Plate too low (loads the lower back)', 'Losing the pelvic tuck as you fatigue'],
      alt: [{ n: 'Plank with shoulder taps', por: 'if there’s no one to place the plate' }, { n: 'Kneeling ab wheel', por: 'a more demanding variant' }],
      mol: 'If the lower back complains: back to an unweighted plank + shoulder taps.'
    },
    'elev-talones': { pat: 'gem',
      nombre: 'Calf Raises', mm: { p: ['gemelos'], s: [] }, zona: 'pierna', musc: ['Calf', 'soleus'], equipo: 'Optional step',
      cues: ['Full range: stretch at the bottom, 1″ pause at the top', 'Up in 1″, down in 2-3″', 'Better on a step for more range'],
      err: ['Fast bouncing with no pause', 'Half range at the top'],
      alt: [{ n: 'Single-leg', por: 'once 20 reps are easy' }],
      mol: 'If the Achilles complains: reduce the bottom range and slow the lowering further.'
    },
    'zancada-alterna': { pat: 'zan',
      nombre: 'Alternating Lunge', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quads', 'glutes'], equipo: 'Nothing',
      cues: ['Big step forward', 'Torso upright, hands on hips or out front', 'Back knee brushes the floor', 'Drive through the front heel to come back'],
      err: ['Short step (front knee collapses)', 'Torso tipping forward', 'Front knee drifting inwards'],
      alt: [{ n: 'Static lunge (no alternating)', por: 'if balance keeps failing' }, { n: 'Reverse lunge', por: 'kinder on the knee' }],
      mol: 'If the knee complains: switch to REVERSE lunges, same scheme.'
    },
    'remo-toalla': { pat: 'th',
      nombre: 'Towel Door Row', mm: { p: ['dorsal'], s: ['biceps', 'espalda-alta'] }, zona: 'tiron', musc: ['Lats', 'biceps, shoulder blades'], equipo: 'Towel + door (or backpack)',
      cues: ['Towel round the handle/frame, body leaning back', 'Pull with the ELBOW, not the hand', 'Shoulder blades back and down at the end of the pull', 'The further you lean, the harder it gets'],
      err: ['Pulling with the arms without moving the shoulder blades', 'Jerking with hip drive'],
      alt: [{ n: 'Loaded backpack row', por: 'one arm, braced on the table' }, { n: 'Inverted row under a sturdy table', por: 'the harder version' }],
      mol: 'If the elbow complains: grip wider and lean back less.'
    },
    'rdl-1p': { pat: 'bis',
      nombre: 'Single-leg Romanian Deadlift', mm: { p: ['isquios'], s: ['gluteo'] }, zona: 'pierna', musc: ['Hamstrings', 'glutes, balance'], equipo: 'Nothing (optional backpack)',
      cues: ['Hips back, back flat as a table', 'Free leg rises behind you as a counterweight', 'Lower until you feel the hamstring stretch', 'Prioritise balance over depth'],
      err: ['Rounding the back to get lower', 'Rotating the hips (keep both hips facing the floor)'],
      alt: [{ n: 'One hand on the wall for support', por: 'if balance keeps breaking the set' }, { n: 'B-stance (rear foot as a kickstand)', por: 'the halfway point' }],
      mol: 'If the hamstring pulls too hard: reduce the range, not the technique.'
    },
    'superman': { pat: 'core',
      nombre: 'Superman', mm: { p: ['lumbar'], s: ['gluteo', 'espalda-alta'] }, zona: 'core', musc: ['Lower back', 'glutes, upper back'], equipo: 'Nothing',
      cues: ['Face down, arms out front', 'Lift arms and legs together, 2″ at the top', 'Eyes on the floor: don’t crane the neck'],
      err: ['Whipping the neck by looking forward', 'Coming up with a bounce'],
      alt: [{ n: 'Bird-dog (opposite arm and leg)', por: 'more control, less compression' }],
      mol: 'If the lower back complains: switch straight to bird-dogs.'
    },
    'dead-bug': { pat: 'core',
      nombre: 'Dead Bug', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Deep anterior core'], equipo: 'Nothing',
      cues: ['Lying down, lower back GLUED to the floor at all times', 'Opposite arm and leg lower slowly together', 'Exhale as you extend: ribs stay down'],
      err: ['Lower back arching as the leg extends (shorten the range)', 'Rushing it'],
      alt: [{ n: 'Legs only (arms still)', por: 'if you lose the lower back off the floor' }],
      mol: 'It’s the safest exercise in the plan; if anything complains, check the lower back isn’t lifting.'
    },

    /* — Gym: push — */
    'press-banca': { pat: 'eh',
      nombre: 'Bench Press', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Chest', 'triceps, front delts'], equipo: 'Barbell + bench',
      cues: ['Shoulder blades retracted and PINNED to the bench, feet planted', 'Grip: vertical forearm when the bar touches the chest', 'Bar to mid-chest, elbows ~45°', 'Touch the chest under control and press along a slightly diagonal line'],
      err: ['Shoulders shrugging as you press (you lose the retraction)', 'Bouncing the bar off the chest', 'Backside off the bench', 'Wrists bent backwards'],
      alt: [{ n: 'Machine chest press', por: 'days you can’t face setting up a bench, or a packed gym' }, { n: 'Flat dumbbell press', por: 'more range and less shoulder' }],
      mol: 'If the shoulder complains: try a slightly narrower grip with elbows more tucked; if it persists, dumbbells with a neutral turn.'
    },
    'press-inclinado-mc': { pat: 'eh',
      nombre: 'Incline Dumbbell Press', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Upper chest', 'shoulders, triceps'], equipo: 'Dumbbells + 30° bench',
      cues: ['Bench at 30° (one notch, not a wall)', 'Lower until you feel the stretch in the chest', 'Elbows at 45-60°, wrists neutral', 'Press up without clashing the dumbbells at the top'],
      err: ['Bench too upright (it turns into a shoulder press)', 'Bouncing at the bottom', 'Over-arching the lower back'],
      alt: [{ n: 'Incline press in the Smith machine', por: 'if the gym is packed or you want stability' }, { n: 'Incline barbell press', por: 'already programmed in Push B in P4' }],
      mol: 'If the shoulder complains: cut the bottom range by 5 cm and turn the palms slightly inwards.'
    },
    'press-inclinado-barra': { pat: 'eh',
      nombre: 'Incline Barbell Press', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Upper chest', 'shoulders, triceps'], equipo: 'Barbell + incline bench',
      cues: ['Bench at 30-45°, shoulder blades pinned', 'The bar lowers to the upper chest (collarbones)', 'Forearms vertical at the touch'],
      err: ['Lowering the bar to mid-chest (forces the elbows to flare)', 'Bouncing'],
      alt: [{ n: 'Incline Smith machine', por: 'same session, more guidance' }, { n: 'Incline dumbbells', por: 'if there’s no incline bench with uprights' }],
      mol: 'If the shoulder complains: back to dumbbells, which let you rotate the grip.'
    },
    'press-plano-mc': { pat: 'eh',
      nombre: 'Flat Dumbbell Press', mm: { p: ['pecho'], s: ['triceps'] }, zona: 'empuje', musc: ['Chest', 'triceps'], equipo: 'Dumbbells + bench',
      cues: ['More range than the bar: use it at the bottom with control', 'Press up in an arc, without clashing at the top', 'Feet planted, shoulder blades back'],
      err: ['Letting the dumbbells drop without braking', 'Turning it into a shoulder press by flaring the elbows too wide'],
      alt: [{ n: 'Chest press machine', por: 'high fatigue or no free bench' }],
      mol: 'If the shoulder complains: neutral grip (palms facing each other).'
    },
    'press-militar': { pat: 'ev',
      nombre: 'Overhead Press', mm: { p: ['hombro'], s: ['triceps', 'abdomen'] }, zona: 'empuje', musc: ['Shoulders', 'triceps, core'], equipo: 'Barbell (standing or seated)',
      cues: ['Standing: glutes and abs BRACED before you press', 'The bar starts at the chin and travels close to the face', 'Head "through the window" at the top', 'Seated with back support: no lower-back arch'],
      err: ['Arching the lower back into an incline press', 'Pressing the bar forwards (it hits the chin)', 'Incomplete range at the top'],
      alt: [{ n: 'Seated dumbbell shoulder press', por: 'already programmed in P2; kinder on the shoulder' }, { n: 'Shoulder press machine', por: 'last session of the week, fatigue high' }],
      mol: 'If the shoulder complains: dumbbells with a neutral grip, pressing only as high as stays pinch-free.'
    },
    'press-militar-mc': { pat: 'ev',
      nombre: 'Seated Dumbbell Shoulder Press', mm: { p: ['hombro'], s: ['triceps'] }, zona: 'empuje', musc: ['Shoulders', 'triceps'], equipo: 'Dumbbells + bench with backrest',
      cues: ['High backrest, lower back supported without arching', 'Elbows slightly in front of the body, not out wide', 'Full range without clashing at the top'],
      err: ['Arching the lower back off the backrest', 'Lowering only to ear height'],
      alt: [{ n: 'Shoulder press machine', por: 'direct equivalent' }],
      mol: 'If the shoulder complains: neutral grip and lower only to 90° of elbow.'
    },
    'elev-laterales': { pat: 'ev',
      nombre: 'Lateral Raises', mm: { p: ['hombro'], s: [] }, zona: 'empuje', musc: ['Side delts'], equipo: 'Dumbbells',
      cues: ['LIGHT weight, elbows slightly bent', 'Raise to horizontal, like pouring two jugs', 'No momentum: if you’re swinging, the weight’s too much', 'Lower in 2″'],
      err: ['Shrugging up with the traps', 'Going past horizontal', 'Hip swing'],
      alt: [{ n: 'Low-cable lateral raises', por: 'constant tension; programmed in Push B' }, { n: 'Lateral raise machine', por: 'to finish without thinking about technique' }],
      mol: 'If the shoulder complains: thumb slightly up and raise 10° in front of the lateral plane.'
    },
    'laterales-polea': { pat: 'ev',
      nombre: 'Cable Lateral Raises', mm: { p: ['hombro'], s: [] }, zona: 'empuje', musc: ['Side delts'], equipo: 'Low pulley',
      cues: ['Pulley at wrist height with the arm hanging', 'Body stable, raise to horizontal', 'The cable keeps tension at the bottom too: use it'],
      err: ['Standing too far from the pulley', 'Pulling with the traps'],
      alt: [{ n: 'Dumbbells', por: 'if the cables are taken' }],
      mol: 'Same as with dumbbells: thumb up and the plane slightly forward.'
    },
    'fondos': { pat: 'ev',
      nombre: 'Assisted Dips', mm: { p: ['pecho'], s: ['triceps'] }, zona: 'empuje', musc: ['Lower chest', 'triceps'], equipo: 'Assisted dip machine or bands',
      cues: ['Body leaning slightly forward (more chest)', 'Lower to 90° of elbow, no further if the shoulder protests', 'Elbows that don’t flare out wide'],
      err: ['Going too deep', 'Shoulders shrugged up to the ears'],
      alt: [{ n: 'Decline press or bench dips', por: 'if there’s no assisted machine' }],
      mol: 'If the sternum or shoulder complains: swap for the flat dumbbell press.'
    },
    'ext-triceps-polea': { pat: 'ext',
      nombre: 'Triceps Pushdown', mm: { p: ['triceps'], s: [] }, zona: 'empuje', musc: ['Triceps'], equipo: 'High pulley + rope or bar',
      cues: ['Elbows tucked to your sides, FIXED', 'Only the forearm moves', 'Extend fully and squeeze for 1″'],
      err: ['Elbows drifting forward on the way down (shoulder takes over)', 'Torso swinging'],
      alt: [{ n: 'With a rope, spreading it at the bottom', por: 'a bit more long head' }, { n: 'Dumbbell triceps kickback', por: 'when no cable is free' }],
      mol: 'If the elbow complains: drop the weight and raise the reps to 15-20; elbows hate ego.'
    },
    'ext-triceps-cabeza': { pat: 'ext',
      nombre: 'Overhead Rope Extension', mm: { p: ['triceps'], s: [] }, zona: 'empuje', musc: ['Triceps (long head)'], equipo: 'Cable + rope',
      cues: ['Back to the pulley, rope behind the neck', 'Elbows pointing forward, extend overhead', 'Real stretch at the bottom: that’s where the long head grows'],
      err: ['Elbows flaring out wide', 'Short range from too much weight'],
      alt: [{ n: 'Skull crushers with an EZ bar', por: 'same pattern lying down' }],
      mol: 'If the elbow complains: same as the pushdown — less weight, more reps.'
    },
    'press-frances': { pat: 'ext',
      nombre: 'Skull Crushers', mm: { p: ['triceps'], s: [] }, zona: 'empuje', musc: ['Triceps (long head)'], equipo: 'EZ bar + bench',
      cues: ['Lying down, bar lowers to the forehead or slightly behind', 'Elbows pointing at the ceiling, still', 'Lower in 2-3″, extend without snapping into lockout'],
      err: ['Elbows flaring out', 'Turning it into a close-grip press by moving the shoulder'],
      alt: [{ n: 'Overhead cable extension', por: 'more constant tension, less elbow stress' }],
      mol: 'If the elbow complains: swap it straight for pushdowns at 15 reps.'
    },

    /* — Gym: pull — */
    'remo-barra': { pat: 'th',
      nombre: 'Barbell Row', mm: { p: ['dorsal'], s: ['biceps', 'espalda-alta'] }, zona: 'tiron', musc: ['Lats', 'mid-back, biceps'], equipo: 'Barbell',
      cues: ['Torso at ~45°, knees soft', 'Pull the bar to your lower abdomen', 'Shoulder blades back and down at the end', 'NEUTRAL spine, non-negotiable'],
      err: ['Jerking with the lower back (rocking)', 'Torso rising rep after rep', 'Pulling to the chest with flared elbows'],
      alt: [{ n: 'T-bar row', por: 'a more stable variant' }, { n: 'Chest-supported machine row', por: 'if the lower back is fried from leg day' }],
      mol: 'If the lower back protests: chest-supported machine or cable row, no second thoughts.'
    },
    'remo-polea': { pat: 'th',
      nombre: 'Seated Cable Row', mm: { p: ['espalda-alta'], s: ['biceps', 'dorsal'] }, zona: 'tiron', musc: ['Mid-back', 'lats, biceps'], equipo: 'Low pulley + V-handle',
      cues: ['Chest tall and FIXED: the torso doesn’t travel', 'Pull the handle to your navel', '1″ pause squeezing the shoulder blades'],
      err: ['Rocking the torso to move more weight', 'Shrugged shoulders'],
      alt: [{ n: 'Machine row', por: 'direct equivalent' }],
      mol: 'If the lower back complains: rest your chest on a supported row machine.'
    },
    'remo-mancuerna': { pat: 'th',
      nombre: 'Single-arm Dumbbell Row', mm: { p: ['dorsal'], s: ['espalda-alta'] }, zona: 'tiron', musc: ['Lats', 'mid-back'], equipo: 'Dumbbell + bench',
      cues: ['Knee and hand on the bench, spine neutral', 'Pull the elbow towards your hip, not your shoulder', 'No torso rotation on the way up'],
      err: ['Shrugging the shoulder at the start of the pull', 'Rotating the torso to "help"', 'Short range'],
      alt: [{ n: 'Single-arm cable row', por: 'more constant tension' }],
      mol: 'Without solid support the lower back complains: use an incline bench and rest your chest on it.'
    },
    'jalon-pecho': { pat: 'tv',
      nombre: 'Lat Pulldown', mm: { p: ['dorsal'], s: ['biceps'] }, zona: 'tiron', musc: ['Lats', 'biceps'], equipo: 'High pulley',
      cues: ['Grip slightly wider than shoulders', 'Chest up, slight lean back held FIXED', 'Pull the ELBOWS down towards your pockets', 'Bar to the collarbone, 1″ pause'],
      err: ['Rocking to yank the weight down', 'Pulling with the arms without depressing the shoulder blades', 'Behind-the-neck pulldowns (no)'],
      alt: [{ n: 'Assisted pull-ups', por: 'the P3 goal is migrating to them' }, { n: 'Close-grip pulldown', por: 'programmed in Pull B' }],
      mol: 'If the shoulder complains: neutral grip (wide V-handle) and drop the weight.'
    },
    'jalon-estrecho': { pat: 'tv',
      nombre: 'Close-grip Lat Pulldown', mm: { p: ['dorsal'], s: ['biceps'] }, zona: 'tiron', musc: ['Lats', 'biceps'], equipo: 'High pulley + V-handle',
      cues: ['V-handle or underhand grip at shoulder width', 'Elbows tucked, driving down to your sides', 'Full stretch at the top: the lat works long'],
      err: ['Turning it into a row by leaning back too far', 'Half reps at the top'],
      alt: [{ n: 'Assisted chin-ups', por: 'the bodyweight equivalent' }],
      mol: 'If the elbow complains: neutral grip and straight wrists.'
    },
    'dominadas': { pat: 'tv',
      nombre: 'Pull-ups (assisted → free → weighted)', mm: { p: ['dorsal'], s: ['biceps', 'abdomen'] }, zona: 'tiron', musc: ['Lats', 'biceps, core'], equipo: 'Bar + assisted machine or bands',
      cues: ['Start by depressing the shoulder blades (shoulders away from ears)', 'Drive the elbows down, chin over the bar', 'Lower under CONTROL until the arms are almost straight', 'Reduce assistance week by week: they’ll come sooner than you think'],
      err: ['Kicking and swinging up', 'Half pull-ups (neither top nor bottom)', 'Hanging off the shoulders at the bottom with no scapular tension'],
      alt: [{ n: 'Heavy overhand lat pulldown', por: 'if the assisted machine is taken that day' }, { n: 'Negative pull-ups (jump up + 5″ lower)', por: 'a great builder of the first pull-up' }],
      mol: 'If the elbow complains: neutral grip. If the shoulder complains: don’t hang passively at the bottom.',
      hito: 'dominada-libre'
    },
    'pullover-polea': { pat: 'tv',
      nombre: 'Cable Pullover', mm: { p: ['dorsal'], s: [] }, zona: 'tiron', musc: ['Lats (isolated)'], equipo: 'High pulley + bar or rope',
      cues: ['Arms almost straight, hinging only at the shoulder', 'Sweep the bar to your thighs in an arc', 'Stretch at the top, squeeze at the bottom'],
      err: ['Bending the elbows (it becomes a triceps extension)', 'Rocking the torso'],
      alt: [{ n: 'Dumbbell pullover on a bench', por: 'when no cable is free' }],
      mol: 'If the shoulder complains: shorten the arc at the top.'
    },
    'face-pull': { pat: 'tv',
      nombre: 'Face Pull', mm: { p: ['hombro'], s: ['espalda-alta'] }, zona: 'tiron', musc: ['Rear delts', 'rotators, mid traps'], equipo: 'High pulley + rope',
      cues: ['Pulley at face height', 'Pull the rope TOWARDS YOUR FOREHEAD, spreading the ends apart', 'At the end, rotate the shoulders outwards (biceps point at the ceiling)', 'Light and perfect: this is shoulder health, not ego'],
      err: ['Turning it into a heavy upright row', 'No final external rotation'],
      alt: [{ n: 'Reverse pec-deck', por: 'rear delts without a rope' }, { n: 'External rotation with a band', por: 'at home or as an extra' }],
      mol: 'This is the exercise that fixes shoulders; if it complains, drop the weight and check you’re pulling to the forehead, not the neck.'
    },
    'encogimientos': { pat: 'ais',
      nombre: 'Dumbbell Shrugs', mm: { p: ['espalda-alta'], s: [] }, zona: 'tiron', musc: ['Upper traps'], equipo: 'Dumbbells',
      cues: ['Shoulders up towards the ears, 1″ pause at the top', 'Arms like ropes: don’t bend the elbows', 'Lower under control and stretch'],
      err: ['Rolling the shoulders in circles (adds nothing and grinds)', 'Bouncing with the legs'],
      alt: [{ n: 'With a barbell', por: 'more total load' }],
      mol: 'If the neck complains: look straight ahead and don’t tuck the chin.'
    },

    /* — Gym: legs/hips — */
    'sentadilla-barra': { pat: 'rod',
      nombre: 'Barbell Squat', mm: { p: ['cuadriceps'], s: ['abdomen', 'gluteo'] }, zona: 'pierna', musc: ['Quads', 'glutes, core'], equipo: 'Barbell + rack',
      cues: ['Bar on the traps, not on the neck', 'Core pressurised BEFORE you descend (breathe into chest and belly)', 'Squat to parallel, knees out', 'Push the floor away, chest up as you rise'],
      err: ['Heels lifting (ankle mobility: raise the heels on plates if needed)', 'Knees caving in on the way up', 'Good-morning squat: hips rising before the chest'],
      alt: [{ n: 'Smith machine squat', por: 'fatigued days or a taken rack' }, { n: 'Hack squat / leg press', por: 'quad stimulus without axial load' }, { n: 'Goblet squat with a dumbbell', por: 'as a warm-up or if technique slips' }],
      mol: 'If the knee complains: slow the descent (3″) and stay 5 cm above the sore point. If the lower back complains: check your bracing and drop the weight 20% for a week.'
    },
    'prensa': { pat: 'rod',
      nombre: 'Leg Press', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quads', 'glutes'], equipo: 'Leg press machine',
      cues: ['Feet mid-platform, shoulder width', 'Lower to 90° WITHOUT the lower back peeling off the pad', 'Push through the whole foot, don’t snap the knees into lockout'],
      err: ['Going so deep the pelvis rotates (butt wink on the press = lower back)', 'Hands pushing on the knees'],
      alt: [{ n: 'Hack squat', por: 'even more quads' }, { n: 'Single-leg press', por: 'if one side lags' }],
      mol: 'If the knee complains: feet slightly higher on the platform (more glute, less knee).'
    },
    'rdl-barra': { pat: 'bis',
      nombre: 'Romanian Deadlift', mm: { p: ['isquios'], s: ['gluteo', 'lumbar'] }, zona: 'pierna', musc: ['Hamstrings', 'glutes, isometric lower back'], equipo: 'Barbell',
      cues: ['Hips BACK, knees soft and fixed', 'Bar glued to the legs the whole way', 'Neutral spine: proud chest', 'Lower until the hamstring stretch bites hard, then stand up squeezing the glutes'],
      err: ['Rounding the back to get lower', 'Bending the knees into a half squat', 'Bar drifting away from the body'],
      alt: [{ n: 'Dumbbell RDL', por: 'a comfier grip for the first weeks' }, { n: 'Weighted 45° back extensions', por: 'hamstring-glute without the grip demand' }],
      mol: 'The hamstring stretch is the sign you’re doing it RIGHT. If the lower back (not the hamstring) complains: drop 20% and film a set from the side.'
    },
    'hip-thrust': { pat: 'bis',
      nombre: 'Hip Thrust', mm: { p: ['gluteo'], s: ['isquios'] }, zona: 'pierna', musc: ['Glutes', 'hamstrings'], equipo: 'Barbell + bench (+ pad)',
      cues: ['Upper back resting on the bench, bar over the hips with a pad', 'Chin tucked, eyes forward and down', 'Rise to EXACTLY horizontal, 1″ pause squeezing', 'Knees at 90° at the top, heels under the knees'],
      err: ['Arching the lower back at the top (hyperextension)', 'Pushing through the toes', 'Bouncing at the bottom with no pause'],
      alt: [{ n: 'Hip thrust machine', por: 'if your gym has one, far quicker to set up' }, { n: 'Barbell glute bridge on the floor', por: 'when no bench is free' }],
      mol: 'If the lower back complains: it’s almost always hyperextension at the top; stop at horizontal.'
    },
    'zancada-mc': { pat: 'zan',
      nombre: 'Dumbbell Lunge', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quads', 'glutes'], equipo: 'Dumbbells',
      cues: ['Same technique as at home, now with 6-10 kg per hand', 'Big step, torso upright, back knee brushes the floor', 'Dumbbells hang close to the body, shoulders back', 'Drive through the front heel to come back'],
      err: ['Short step that collapses the front knee', 'Leaning forward as you fatigue', 'Staring at the floor and losing your line'],
      alt: [{ n: 'Dumbbell reverse lunge', por: 'kinder on the knee' }, { n: 'Smith machine lunge', por: 'if balance limits the load' }],
      mol: 'If the knee complains: take a longer step and switch to reverse lunges.'
    },
    'zancada-bulgara': { pat: 'zan',
      nombre: 'Bulgarian Split Squat', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quads', 'glutes'], equipo: 'Bench + dumbbells',
      cues: ['Rear foot on the bench, front foot a long step out', 'Descend VERTICALLY: the back knee seeks the floor', 'Torso slightly forward = more glute; upright = more quad', 'Start with bodyweight ONLY, seriously'],
      err: ['Front foot too close (the knee suffers)', 'Bouncing at the bottom', 'Losing balance by staring at the ceiling'],
      alt: [{ n: 'Static dumbbell lunge', por: 'if the balance isn’t there yet' }, { n: 'Single-leg press', por: 'unilateral without the balance demand' }],
      mol: 'If the front knee complains: lengthen the step and shift the torso a touch forward.'
    },
    'ext-cuadriceps': { pat: 'rod',
      nombre: 'Leg Extension', mm: { p: ['cuadriceps'], s: [] }, zona: 'pierna', musc: ['Quads (isolated)'], equipo: 'Machine',
      cues: ['Knee aligned with the machine’s axis', 'Extend fully with a 1″ pause at the top', 'Lower in 2-3″'],
      err: ['Kicking with momentum', 'Backside lifting off the seat'],
      alt: [{ n: 'Assisted sissy squat', por: 'no machine needed' }],
      mol: 'If the kneecap complains: trim the last third at the TOP, not the bottom, and slow the tempo. It’s also your rehab exercise if the knee ever protests after a jog.'
    },
    'curl-femoral-tumbado': { pat: 'ais',
      nombre: 'Lying Leg Curl', mm: { p: ['isquios'], s: [] }, zona: 'pierna', musc: ['Hamstrings (isolated)'], equipo: 'Machine',
      cues: ['Hips GLUED to the pad the whole time', 'Up in 1″, down in 2-3″', 'Toes neutral'],
      err: ['Lifting the hips to help', 'Half reps'],
      alt: [{ n: 'Seated leg curl', por: 'actually slightly better for the hamstrings; use it if free' }, { n: 'Assisted Nordic curl', por: 'advanced version, further down the road' }],
      mol: 'If it cramps: stretch the hamstring between sets, normal in the first weeks.'
    },
    'curl-femoral-sentado': { pat: 'ais',
      nombre: 'Seated Leg Curl', mm: { p: ['isquios'], s: [] }, zona: 'pierna', musc: ['Hamstrings (isolated)'], equipo: 'Machine',
      cues: ['Thigh locked down by the pad', 'Flex all the way, 1″ pause', 'Return slowly, resisting'],
      err: ['Backside sliding forward', 'Short range from too much weight'],
      alt: [{ n: 'Lying leg curl', por: 'equivalent' }],
      mol: 'No typical issues: one of the safest in the plan.'
    },
    'gemelo-pie': { pat: 'gem',
      nombre: 'Standing Calf Raise', mm: { p: ['gemelos'], s: [] }, zona: 'pierna', musc: ['Calf (gastrocnemius)'], equipo: 'Machine or Smith machine + step',
      cues: ['1″ pause at the TOP and 1″ at the BOTTOM: no bouncing', 'Full stretch at the bottom', 'Rise vertically, without bending the knees'],
      err: ['Bouncing off the tendon’s reflex (robs the very tissue we’re preparing of its stimulus)', 'Mid range'],
      alt: [{ n: 'On the leg press', por: 'no dedicated machine' }],
      mol: 'If the Achilles complains: top-position isometrics only, 3×30″, that week.'
    },
    'gemelo-sentado': { pat: 'gem',
      nombre: 'Seated Calf Raise', mm: { p: ['gemelos'], s: [] }, zona: 'pierna', musc: ['Soleus'], equipo: 'Machine',
      cues: ['Knee at 90°: this hits the soleus, key for JOGGING', 'Same rule: pause at the top and bottom, no bouncing'],
      err: ['Rushing into bounces', 'Resting on the very tips of the toes (better on the ball of the foot)'],
      alt: [{ n: 'Seated with dumbbells on the knees + a step', por: 'no machine' }],
      mol: 'Same as the standing one: Achilles discomfort = isometrics only for a week.'
    },
    'elev-piernas': { pat: 'flex',
      nombre: 'Hanging Leg Raise', mm: { p: ['abdomen'], s: ['antebrazo'] }, zona: 'core', musc: ['Lower abs', 'hip flexors, grip'], equipo: 'Pull-up bar',
      cues: ['Hang actively (shoulders away from ears)', 'Bring the knees to the chest with NO swinging', 'Lower all the way under control'],
      err: ['Swinging like a pendulum', 'Pulling only with the hip flexors, lower back arched'],
      alt: [{ n: 'On parallel bars (elbow support)', por: 'if grip fails before the abs do' }, { n: 'Lying leg raises', por: 'the starter version' }],
      mol: 'If the shoulder complains while hanging: go straight to the parallel bars.'
    },
    'rueda-abdominal': { pat: 'flex',
      nombre: 'Ab Wheel Rollout', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Full anterior core'], equipo: 'Ab wheel',
      cues: ['Kneeling, pelvis tucked BEFORE rolling out', 'Roll only as far as you can control the lower back', 'Come back pulling with the abs, not the arms'],
      err: ['Arching the lower back at full stretch (the mistake that injures)', 'Going further than the core can hold'],
      alt: [{ n: 'Cable crunch', por: 'if the wheel is too big an ask today' }, { n: 'Weighted plank', por: 'the isometric equivalent' }],
      mol: 'If the lower back complains: halve the range and win it back week by week.'
    },
    'crunch-polea': { pat: 'flex',
      nombre: 'Cable Crunch', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Rectus abdominis'], equipo: 'High pulley + rope',
      cues: ['Kneeling, rope held beside your head', 'Flex FROM THE RIBS, not from the hips', 'Elbows towards the knees, exhale on the way down'],
      err: ['Pulling with the arms', 'Sitting back, moving only at the hips'],
      alt: [{ n: 'Machine crunch', por: 'equivalent' }, { n: 'Ab wheel', por: 'when you want to level up' }],
      mol: 'No typical issues if you flex from the ribs.'
    },

    /* — Arms — */
    'curl-barra-z': { pat: 'curl',
      nombre: 'EZ Bar Curl', mm: { p: ['biceps'], s: [] }, zona: 'tiron', musc: ['Biceps'], equipo: 'EZ bar',
      cues: ['Elbows tucked to your sides, FIXED', 'Curl without swinging, lower in 2-3″', 'Wrists neutral thanks to the EZ shape'],
      err: ['Rocking the body to lift more weight', 'Elbows travelling forward at the top'],
      alt: [{ n: 'Alternating dumbbell curl', por: 'with rotation (supination), very complete' }, { n: 'Low cable curl', por: 'constant tension' }],
      mol: 'If the wrist or elbow complains: dumbbells with rotation, or a hammer grip.'
    },
    'curl-inclinado': { pat: 'curl',
      nombre: 'Incline Dumbbell Curl', mm: { p: ['biceps'], s: [] }, zona: 'tiron', musc: ['Biceps (long head)'], equipo: 'Dumbbells + 45-60° bench',
      cues: ['Bench at 45-60°, arms HANGING vertical', 'The stretch at the bottom is the stimulus: don’t cut it short', 'Elbows still, curl without shrugging'],
      err: ['Bringing the elbows forward', 'Half reps at the bottom'],
      alt: [{ n: 'Bayesian cable curl', por: 'same stretch, standing' }],
      mol: 'If the shoulder pulls at the bottom: raise the backrest one notch.'
    },
    'curl-martillo': { pat: 'curl',
      nombre: 'Hammer Curl', mm: { p: ['biceps'], s: ['antebrazo'] }, zona: 'tiron', musc: ['Brachialis', 'forearm'], equipo: 'Dumbbells',
      cues: ['Neutral (hammer) grip, elbows fixed', 'Alternating or both at once', 'Control the lowering'],
      err: ['Swinging', 'Turning it into a row by lifting the elbows'],
      alt: [{ n: 'Rope hammer curl on the cable', por: 'a variant' }],
      mol: 'The kindest curl on elbows and wrists: usually the REFUGE when others complain.'
    },
    'curl-polea': { pat: 'curl',
      nombre: 'Low Cable Curl', mm: { p: ['biceps'], s: [] }, zona: 'tiron', musc: ['Biceps'], equipo: 'Low pulley + bar',
      cues: ['One step back from the pulley, elbows fixed', 'Constant tension: no resting at the top or the bottom', 'Last set: hold a 10″ isometric at halfway to finish'],
      err: ['Standing so close the bottom stretch loses tension', 'Rocking'],
      alt: [{ n: 'EZ bar curl', por: 'the free-weight equivalent' }],
      mol: 'If the elbow complains: wider grip or a hammer-grip rope.'
    }
  };

  /* ---------- THE 8 RULES ---------- */
  const REGLAS = [
    { n: 1, t: 'Controlled RPE', d: 'Every phase has its effort cap. Your nervous system remembers being an athlete; your tendons have gone years without loading. Brake before they do.' },
    { n: 2, t: 'Double progression', d: 'First add reps within the range, then add weight (+2.5 kg; +5 kg on squat and Romanian deadlift). Only if technique was clean on EVERY set. The app suggests it for you.' },
    { n: 3, t: 'Scale = weekly average', d: 'Weigh in Monday-Wednesday-Friday, fasted, and look only at the average. A single day means nothing (water, salt, creatine).' },
    { n: 4, t: 'Protein: {p} g in 4 servings', d: 'Breakfast, lunch, dinner and one serving before bed. No serving below {q} g. It is the variable that decides whether your weight change is fat or muscle.' },
    { n: 5, t: '8,000–10,000 daily steps', d: 'Every day, training or not. They burn more per week than the sessions themselves.' },
    { n: 6, t: 'Sleep 7–8 h: non-negotiable', d: 'It’s not a goal, it’s a rule: sleeping 5.5 h in a deficit turns your loss into −55% fat and +60% muscle (Nedeltcheva 2010). Strong caffeine only before 1-2 pm.' },
    { n: 7, t: 'A missed day is not made up', d: 'Don’t double up sessions or cut food the next day. Pick up the calendar wherever it stands.' },
    { n: 8, t: 'The non-negotiable minimum', d: 'The killer pattern is 3 months all-in / 3 at zero. The chaotic week has a floor: 2 strength + 1 cardio. That keeps everything.' }
  ];

  const SENALES = 'Signs to stop an exercise for the day: sharp pain in the knee, shoulder or lower back during the movement; discomfort that worsens set by set instead of fading as you warm up. Diffuse soreness 24-48 h later = normal. Localised joint pain that persists beyond 5 days = physio before loading again.';

  /* ---------- NUTRITION ---------- */
  const NUTRI = {
    calorias: [
      { c: 'Basal metabolic rate (Mifflin-St Jeor)', v: '~1,950 kcal', n: '95.1 kg · 183 cm · 30 years' },
      { c: 'Estimated total expenditure (plan running)', v: '2,850–3,000 kcal', n: 'Training + 8-10k steps' },
      { c: 'Target intake', v: '2,250–2,400 kcal', n: 'Deficit ~550–700 kcal/day (more than that stalls muscle regain: Murphy & Koehler 2022)' },
      { c: 'Expected rate of loss', v: '0.6–0.75 kg/week', n: '≈0.7% of bodyweight/week, the sweet spot for keeping lean mass (Garthe 2011). Weekly average, not day to day' }
    ],
    fases: [
      { f: 'P1–P2 (wk 1-5)', kcal: 2250, p: 190, g: 70, c: 205 },
      { f: 'P3 (wk 6-9)',    kcal: 2350, p: 190, g: 70, c: 230, nota: 'Week 7: DIET BREAK at ~2,800' },
      { f: 'P4 (wk 10-12)',  kcal: 2400, p: 190, g: 70, c: 240 }
    ],
    escalado: 'Protein never moves: {p} g a day for you. When training volume goes up, only carbs go up. In practice: in F3 add a piece of fruit + 40 g of bread to lunch on training days; in F4, the same every day.',
    tomas: 'FOUR protein servings a day, none below {q} g: breakfast, lunch, dinner and a pre-sleep serving. The daily total rules, but splitting it into 4 squeezes the most out of protein synthesis and kills evening hunger.',
    plato: [
      { t: 'Protein (every meal)', d: '200-250 g of raw chicken/turkey/white fish, or 170-180 g of salmon/beef, or 3 eggs + 2 whites, or 250 g of skyr + whey. Visual reference: a palm and a half.' },
      { t: 'Carbohydrate', d: '60-75 g raw of rice/pasta, or 250-300 g of potato, or 60 g of wholemeal bread, or 50 g of oats. Reference: one fist.' },
      { t: 'Veg', d: 'Half the plate, unlimited. Volume and satiety.' },
      { t: 'Fat', d: '10 g of olive oil per main meal (one tablespoon) and stop counting. It’s where calories slip away unnoticed.' }
    ],
    suplementos: [
      { t: 'Creatine monohydrate', d: '5 g daily, any time of day, no loading phase, starting now. WARNING: it holds 1-2 kg of water in the first weeks. It’s not fat: trust the waist and the weekly average, not a single reading (the app flags it on the chart).' },
      { t: 'Whey', d: '1 scoop in the pre-sleep serving with the skyr (and another wherever needed on short-protein days).' },
      { t: 'Caffeine', d: 'Cut-off at 1-2 pm: 200 mg disrupts sleep up to 13 h later; one coffee, ~9 h (Gardiner 2023). Morning training: coffee 30-45′ before, perfect. Evening training: no caffeine — your pre-workout is the afternoon snack (fruit + skyr 60-90′ before).' },
      { t: 'Sensible optionals', d: 'Vitamin D only if bloods come back under 30 ng/mL (likely with an indoor life). Omega-3 ~2 g EPA+DHA/day: a modest but real benefit for strength, plus the anti-inflammatory/tendon angle.' },
      { t: 'Don’t spend on', d: 'Fat burners, BCAA/EAA (redundant with your daily protein), "testo boosters". None of it moves the needle.' }
    ],
    hidratacion: 'Water: 2.5–3 L/day. Alcohol: counts calories and blocks recovery — inside the free meal, out for the rest of the week.',
    comidaLibre: 'ONE meal a week (Saturday by default), not a whole day. Order or eat whatever you fancy in a normal amount, no compensating before or after. It’s what lets the plan survive {s} weeks and a social life. If plans land on another day, move it — but it stays just one.'
  };

  /* ---------- RECIPES ---------- */
  // q in grams unless a unit is given · macros per serving
  const RECETAS = [
    {
      id: 'bol-skyr', slot: 'de', tags: ['lacteo', 'frutos'], nombre: 'Skyr bowl', tipo: 'Breakfast A', tiempo: '5′', cocina: 'No cooking',
      macros: { kcal: 520, p: 35, g: 11, c: 72 },
      ing: [
        { q: '250 g', i: 'natural skyr (or 0% fat quark)' },
        { q: '50 g', i: 'rolled oats' },
        { q: '1 (120 g)', i: 'banana' },
        { q: '10 g', i: 'walnuts' },
        { q: 'to taste', i: 'cinnamon' }
      ],
      pasos: [
        'Skyr into the bowl, oats on top (as they come if you like texture, or soaked 5′ in a splash of milk or water).',
        'Banana in slices, walnuts crushed by hand and cinnamon over the top.'
      ],
      tips: 'Training in the morning? Build it the night before (soaked oats win). Short-protein day: +1 scoop of whey mixed into the skyr (+110 kcal, +23 g P).'
    },
    {
      id: 'tortilla-pan', slot: 'de', tags: ['huevo', 'gluten'], nombre: 'Omelette with bread and tomato', tipo: 'Breakfast B', tiempo: '10′', cocina: 'Frying pan',
      macros: { kcal: 470, p: 34, g: 22, c: 32 },
      ing: [
        { q: '3', i: 'medium eggs' },
        { q: '2 (or 100 ml carton)', i: 'egg whites' },
        { q: '60 g (2 slices)', i: 'wholemeal bread' },
        { q: '100 g', i: 'grated tomato' },
        { q: '5 g', i: 'EVOO' },
        { q: 'pinch', i: 'salt' }
      ],
      pasos: [
        'Beat the eggs and whites with the salt.',
        'Non-stick pan on medium heat with the 5 g of EVOO: set the omelette as done as you like it.',
        'Toast the bread and top it with the grated tomato and a drop of the oil from the pan.'
      ],
      tips: 'Carton egg whites remove the faff of separating. Scrambled version: same time, zero technique.'
    },
    {
      id: 'pollo-asado', slot: 'co', tags: ['carne'], nombre: 'Roast chicken with potatoes', tipo: 'Lunch · Sunday batch', tiempo: '45′ oven (from meal prep)', cocina: 'Oven',
      macros: { kcal: 780, p: 70, g: 19, c: 68 },
      ing: [
        { q: '250 g raw (~200 g cooked)', i: 'chicken breast', n: 'batch: 1.2 kg = 5 servings' },
        { q: '300 g', i: 'roasted potato wedges + pepper + onion', n: 'batch: 1.5 kg potato + 2 peppers + 2 onions' },
        { q: '10 g', i: 'EVOO (part of the roast)' },
        { q: 'to taste', i: 'paprika, garlic powder, salt, oregano' }
      ],
      pasos: [
        'Oven to 200°. Season the breasts and rub them with paprika + garlic powder.',
        'Tray 1: breasts, 25-30′ (just cooked = juicy; overdo it and they’re shoe leather).',
        'Tray 2: potato wedges with pepper, onion and 20 g of EVOO in total, 40-45′, turn halfway.',
        'Portion up: 5 containers. Thursday-Friday’s chicken goes in the freezer.'
      ],
      tips: 'A portion reheats in 2′ in the microwave with a splash of water so the chicken doesn’t dry out.'
    },
    {
      id: 'lentejas-pollo', slot: 'co', tags: ['carne'], nombre: 'Lentils with chicken', tipo: 'Lunch · Sunday batch', tiempo: '25′ pot', cocina: 'Pot',
      macros: { kcal: 760, p: 52, g: 16, c: 80 },
      ing: [
        { q: '250 g drained', i: 'tinned cooked lentils', n: 'batch: 2 tins = 3 servings' },
        { q: '120 g', i: 'roast chicken in strips (from the oven batch)' },
        { q: '¼', i: 'onion' },
        { q: '½', i: 'pepper' },
        { q: '1', i: 'carrot' },
        { q: '4 g', i: 'EVOO (part of the sofrito)' },
        { q: '1 tsp / ½ tsp', i: 'paprika / cumin' },
        { q: '150 ml', i: 'stock or water' },
        { q: '1 piece', i: 'fruit for dessert' }
      ],
      pasos: [
        'Sofrito, 8′: diced onion, pepper and carrot with 10 g of EVOO (for the 3-serving batch).',
        'Add the drained lentils, the stock, paprika and cumin: 15′ on a low heat.',
        'Turn off the heat and stir in the chicken strips (so they don’t dry out).'
      ],
      tips: 'Tinned and no soaking: the fastest legume there is. They thicken by the next day: add a splash of water when reheating.'
    },
    {
      id: 'salteado-ternera', slot: 'co', tags: ['carne'], nombre: 'Beef stir-fry', tipo: 'Lunch · 15′ fresh', tiempo: '15′', cocina: 'Wok / frying pan',
      macros: { kcal: 730, p: 45, g: 20, c: 60 },
      ing: [
        { q: '180-200 g', i: 'lean beef strips' },
        { q: '70 g raw (≈ 180 g cooked)', i: 'rice', n: 'use the batch rice' },
        { q: '250 g', i: 'mixed veg: pepper, onion, courgette, carrot' },
        { q: '15 ml', i: 'soy sauce' },
        { q: '8 g', i: 'EVOO' }
      ],
      pasos: [
        'Wok or pan VERY hot with the EVOO: sear the beef 1-2′ and set it aside (leave it in and it stews and toughens).',
        'Same pan: veg in strips 5-6′, keep them al dente.',
        'Beef back in, soy sauce, 1′ of tossing, and over the rice it goes.'
      ],
      tips: 'The order is everything: meat out before the veg goes in. Ask the butcher for "stir-fry strips" and skip the knife work.'
    },
    {
      id: 'salmon-arroz', slot: 'ce', tags: ['pescado'], nombre: 'Salmon with rice and broccoli', tipo: 'Dinner · 15′', tiempo: '15′', cocina: 'Pan or oven',
      macros: { kcal: 760, p: 40, g: 28, c: 62 },
      ing: [
        { q: '170-180 g', i: 'salmon fillet' },
        { q: '75 g raw (≈ 190 g cooked)', i: 'rice', n: 'from the batch' },
        { q: '200 g', i: 'broccoli' },
        { q: '½', i: 'lemon' },
        { q: 'pinch', i: 'salt' }
      ],
      pasos: [
        'Broccoli in the microwave in a covered bowl with a splash of water: 4-5′ (or steamed).',
        'Salmon in a hot pan 3-4′ per side starting skin down (or oven at 200°, 12′). No oil: it brings its own.',
        'Reheat the rice, squeeze the lemon over everything.'
      ],
      tips: 'The salmon’s fat counts as the meal’s fat: that’s why there’s no EVOO here.'
    },
    {
      id: 'merluza-patata', slot: 'ce', tags: ['pescado', 'lacteo'], nombre: 'Hake with roast potatoes', tipo: 'Dinner · 20′', tiempo: '20′', cocina: 'Oven or micro+pan',
      macros: { kcal: 740, p: 55, g: 15, c: 55 },
      ing: [
        { q: '250 g', i: 'hake or sea bass fillets' },
        { q: '250 g', i: 'potato' },
        { q: 'bowl', i: 'green salad (lettuce, tomato, onion)' },
        { q: '10 g', i: 'EVOO (5 potato + 5 salad)' },
        { q: '1', i: 'skyr for dessert' }
      ],
      pasos: [
        'Potato in ½ cm slices: microwave 8′ covered (or oven 25′ with 5 g of EVOO, salt and oregano).',
        'Hake: oven at 200° for 10-12′, or pan 3′ per side. Done when it separates into flakes.',
        'Salad with 5 g of EVOO and vinegar. Skyr for dessert and dinner is done.'
      ],
      tips: 'White fish is the most satiating protein per calorie in the whole plan: use it on the hungriest days.'
    },
    {
      id: 'revuelto-gambas', slot: 'ce', tags: ['pescado', 'huevo', 'gluten'], nombre: 'Scrambled eggs with prawns', tipo: 'Dinner · 10′', tiempo: '10′', cocina: 'Frying pan',
      macros: { kcal: 620, p: 45, g: 30, c: 25 },
      ing: [
        { q: '3', i: 'medium eggs' },
        { q: '150 g', i: 'peeled prawns (frozen work perfectly)' },
        { q: '40 g', i: 'wholemeal bread' },
        { q: 'bowl', i: 'green salad' },
        { q: '8 g', i: 'EVOO' },
        { q: '1 clove', i: 'garlic' }
      ],
      pasos: [
        'Brown the sliced garlic in the EVOO; prawns 2′ (defrosted and patted dry first).',
        'Lower the heat, add the beaten eggs and stir NON-STOP until creamy. Off the heat before it fully sets.',
        'Toasted bread and salad on the side.'
      ],
      tips: 'The scramble finishes cooking off the heat. Frozen prawns: defrost in a bowl of cold water in 10′.'
    },
    {
      id: 'toma-noche', slot: 'snack', tags: ['lacteo'], nombre: 'Pre-sleep serving', tipo: 'Serving 4 · daily', tiempo: '1′', cocina: 'No cooking',
      macros: { kcal: 270, p: 49, g: 2, c: 14 },
      ing: [
        { q: '250 g', i: 'skyr or 0% fat quark' },
        { q: '1 scoop (30 g)', i: 'whey (a flavour you won’t tire of)' },
        { q: 'to taste', i: 'cinnamon' }
      ],
      pasos: [
        'Mix the scoop of whey into the skyr until mousse-like. Cinnamon on top.',
        '30-60′ before bed. That’s it.'
      ],
      tips: 'This serving tops off the day’s protein and kills night hunger, the moment diets die. Slow-digesting dairy casein works while you sleep.'
    },
    {
      id: 'ensalada-atun', slot: 'ce', tags: ['pescado', 'huevo'], nombre: 'Complete tuna salad', tipo: 'Dinner · 10′', tiempo: '10′', cocina: 'No cooking (uses batch)',
      macros: { kcal: 700, p: 45, g: 25, c: 50 },
      ing: [
        { q: '2 tins (120 g drained)', i: 'tuna in spring water' },
        { q: '1', i: 'hard-boiled egg (from the batch)' },
        { q: '150 g', i: 'boiled potato (from the batch)' },
        { q: '150 g', i: 'tomato' },
        { q: '30 g', i: 'olives' },
        { q: '¼', i: 'red onion' },
        { q: '10 g', i: 'EVOO' }
      ],
      pasos: [
        'Everything into the bowl: diced potato, tomato in wedges, thinly sliced onion, drained tuna, quartered egg, olives.',
        'EVOO, vinegar, salt and a good toss.'
      ],
      tips: 'The zero-effort dinner if Sunday boiled spare potatoes and eggs. No-potato version (low-hunger day): add more tomato.'
    },
    { id: 'porridge-soja', slot: 'de', tags: [], nombre: 'Oat and protein porridge', tipo: 'Breakfast C', tiempo: '8′', cocina: 'Pan or microwave',
      macros: { kcal: 545, p: 37, g: 11, c: 69 },
      ing: [{ q: '70 g', i: 'rolled oats (certified gluten-free)' }, { q: '250 ml', i: 'unsweetened soy milk' }, { q: '25 g', i: 'pea protein, plain or vanilla' }, { q: '1', i: 'banana, sliced' }, { q: 'to taste', i: 'cinnamon' }],
      pasos: ['Heat the oats with the soy milk 4-5′, stirring until thick.', 'Off the heat, stir in the protein: boiling it makes it clump.', 'Top with the banana and cinnamon.'],
      tips: 'Make it the night before (overnight oats) and just stir in the protein in the morning.' },
    { id: 'tofu-revuelto', slot: 'de', tags: [], nombre: 'Scrambled tofu on toast', tipo: 'Breakfast D', tiempo: '12′', cocina: 'Pan',
      macros: { kcal: 570, p: 41, g: 25, c: 42 },
      ing: [{ q: '200 g', i: 'firm tofu, crumbled' }, { q: '2 slices (70 g)', i: 'gluten-free bread' }, { q: '10 g', i: 'nutritional yeast' }, { q: '1', i: 'tomato, sliced' }, { q: '5 g', i: 'extra-virgin olive oil' }, { q: 'to taste', i: 'turmeric, kala namak black salt, pepper' }],
      pasos: ['Sauté the crumbled tofu in the oil 3-4′ over medium-high heat.', 'Add turmeric, yeast and black salt (the eggy flavour); 2′ more.', 'Toast the bread and build with the tomato.'],
      tips: 'Kala namak is the secret: without it it’s tofu with turmeric; with it, a scramble.' },
    { id: 'bol-soja-frutos', slot: 'de', tags: [], nombre: 'Soy yogurt bowl with berries', tipo: 'Breakfast E', tiempo: '5′', cocina: 'No cooking',
      macros: { kcal: 415, p: 29, g: 11, c: 41 },
      ing: [{ q: '250 g', i: 'plain unsweetened soy yogurt' }, { q: '20 g', i: 'plant protein powder' }, { q: '120 g', i: 'berries (frozen are fine)' }, { q: '15 g', i: 'chia seeds' }, { q: '1', i: 'small banana' }],
      pasos: ['Whisk the yogurt with the protein until smooth.', 'Add the chia and wait 5′: it thickens on its own.', 'Top with the berries and the banana.'],
      tips: 'Frozen berries straight from the bag chill and thicken the bowl: better than fresh here.' },
    { id: 'revuelto-espinacas', slot: 'de', tags: ['huevo'], nombre: 'Scrambled eggs with spinach', tipo: 'Breakfast F', tiempo: '10′', cocina: 'Pan',
      macros: { kcal: 510, p: 28, g: 21, c: 46 },
      ing: [{ q: '3', i: 'eggs' }, { q: '100 g', i: 'fresh spinach' }, { q: '100 g', i: 'sliced mushrooms' }, { q: '50 g', i: 'gluten-free bread' }, { q: '5 g', i: 'extra-virgin olive oil' }, { q: '150 g', i: 'seasonal fruit' }],
      pasos: ['Sauté the mushrooms 3′; add the spinach until it wilts.', 'Beaten eggs in, low heat, stirring: creamy, not dry.', 'Serve with the toasted bread and the fruit on the side.'],
      tips: 'Kill the heat while it still looks slightly underdone: residual heat finishes it.' },
    { id: 'curry-lentejas', slot: 'co', tags: [], nombre: 'Red lentil curry with rice', tipo: 'Lunch · Sunday batch', tiempo: '25′ pot', cocina: 'Pot',
      macros: { kcal: 755, p: 31, g: 18, c: 108 },
      ing: [{ q: '100 g', i: 'dry red lentils' }, { q: '100 ml', i: 'light coconut milk' }, { q: '150 g', i: 'crushed tomatoes' }, { q: '50 g', i: 'dry basmati rice' }, { q: '10 g', i: 'extra-virgin olive oil' }, { q: 'to taste', i: 'onion, garlic, ginger, curry powder, salt' }],
      pasos: ['Sweat onion, garlic and ginger 3′; add the curry and toast it 30″.', 'Lentils, tomato, coconut and 300 ml water: 18-20′ over medium heat until they fall apart.', 'Rice on the side (12′). Curry on top.'],
      tips: 'Batch: ×4 keeps 4 days in the fridge and freezes perfectly. Red lentils need no soaking.' },
    { id: 'tofu-salteado', slot: 'co', tags: [], nombre: 'Stir-fried tofu with veg and brown rice', tipo: 'Lunch · 20′', tiempo: '20′', cocina: 'Wok / pan',
      macros: { kcal: 775, p: 47, g: 34, c: 71 },
      ing: [{ q: '200 g', i: 'firm tofu, cubed' }, { q: '70 g', i: 'dry brown rice' }, { q: '250 g', i: 'broccoli, pepper and carrot' }, { q: '15 ml', i: 'tamari (gluten-free soy sauce)' }, { q: '10 g', i: 'extra-virgin olive oil' }, { q: '10 g', i: 'sesame seeds' }],
      pasos: ['Cook the brown rice (25′; batch it).', 'Tofu over high heat until golden on all sides (6-7′); set aside.', 'Veg 4′ in the wok, tofu back in, tamari and sesame; 1′ and done.'],
      tips: 'Press the tofu 10′ between two plates with a weight: it sheds water and actually browns.' },
    { id: 'bol-garbanzos', slot: 'co', tags: [], nombre: 'Roasted chickpea bowl with quinoa and hummus', tipo: 'Lunch · 15′ fresh', tiempo: '15′ (+ oven)', cocina: 'Oven + no cooking',
      macros: { kcal: 780, p: 31, g: 24, c: 103 },
      ing: [{ q: '200 g', i: 'cooked chickpeas' }, { q: '60 g', i: 'dry quinoa' }, { q: '50 g', i: 'hummus' }, { q: '150 g', i: 'roasted pepper and cucumber' }, { q: '5 g', i: 'extra-virgin olive oil' }, { q: 'to taste', i: 'cumin, paprika, lemon, salt' }],
      pasos: ['Drained chickpeas with paprika, cumin and salt: oven 200° for 20′ until crunchy (batch).', 'Quinoa: rinse, 12′ in twice its water, rest covered.', 'Build the bowl: quinoa, chickpeas, veg, hummus and lemon.'],
      tips: 'Roasted chickpeas keep 5 days in a jar: they are this plan’s snack.' },
    { id: 'pasta-lentejas-tempeh', slot: 'co', tags: [], nombre: 'Lentil pasta with tempeh in tomato sauce', tipo: 'Lunch · 20′', tiempo: '20′', cocina: 'Pot + pan',
      macros: { kcal: 665, p: 46, g: 26, c: 67 },
      ing: [{ q: '80 g', i: 'red lentil pasta (gluten-free)' }, { q: '120 g', i: 'tempeh, cubed' }, { q: '200 g', i: 'crushed tomatoes' }, { q: '80 g', i: 'onion and garlic' }, { q: '10 g', i: 'extra-virgin olive oil' }, { q: 'to taste', i: 'basil, oregano, salt' }],
      pasos: ['Lentil pasta 7-8′ (it overcooks fast: taste before the packet time).', 'Tempeh browned in the oil 4′; onion and garlic 3′ more.', 'Tomato, oregano and salt, 5′; toss with the pasta and basil.'],
      tips: 'Tempeh improves a lot if you steam it 8′ before browning: the bitterness goes.' },
    { id: 'tortilla-garbanzo', slot: 'ce', tags: [], nombre: 'Chickpea-flour omelette with courgette', tipo: 'Dinner · 20′', tiempo: '20′', cocina: 'Pan',
      macros: { kcal: 460, p: 20, g: 16, c: 62 },
      ing: [{ q: '80 g', i: 'chickpea flour (gluten-free)' }, { q: '200 g', i: 'courgette, thinly sliced' }, { q: '80 g', i: 'onion' }, { q: '10 g', i: 'extra-virgin olive oil' }, { q: '100 g', i: 'green salad' }, { q: 'to taste', i: 'salt, pepper, turmeric' }],
      pasos: ['Mix the flour with 160 ml water, salt and turmeric; rest 10′.', 'Courgette and onion 8′ over medium heat until tender.', 'Pour the batter over, lid on, 5′ per side. Salad alongside.'],
      tips: 'The real “eggless omelette”: sets the same and travels well cold.' },
    { id: 'crema-calabaza-tofu', slot: 'ce', tags: [], nombre: 'Pumpkin soup with edamame and seared tofu', tipo: 'Dinner · 25′', tiempo: '25′', cocina: 'Pot + griddle',
      macros: { kcal: 590, p: 41, g: 24, c: 38 },
      ing: [{ q: '300 g', i: 'pumpkin, diced' }, { q: '100 g', i: 'shelled edamame (frozen)' }, { q: '150 g', i: 'firm tofu, sliced' }, { q: '60 g', i: 'onion' }, { q: '10 g', i: 'extra-virgin olive oil' }, { q: '10 g', i: 'pumpkin seeds' }],
      pasos: ['Onion and pumpkin in 5 g oil 3′; barely cover with water, 15′ and blend.', 'Edamame 4′ in boiling water; drain and stir into the soup.', 'Tofu seared in the remaining oil, 3′ per side. Seeds on top.'],
      tips: 'No cream, no potato: blended pumpkin is creamy on its own.' },
    { id: 'ensalada-quinoa-alubias', slot: 'ce', tags: [], nombre: 'Warm quinoa, black bean and avocado salad', tipo: 'Dinner · 15′', tiempo: '15′', cocina: 'Pot + no cooking',
      macros: { kcal: 610, p: 25, g: 21, c: 82 },
      ing: [{ q: '40 g', i: 'dry quinoa' }, { q: '200 g', i: 'cooked black beans' }, { q: '80 g', i: 'avocado' }, { q: '120 g', i: 'tomato, red onion and coriander' }, { q: '5 g', i: 'extra-virgin olive oil' }, { q: 'to taste', i: 'lime, cumin, salt' }],
      pasos: ['Quinoa 12′ in twice its water; drain.', 'Beans drained and rinsed, into the still-warm quinoa.', 'Avocado, tomato, onion and coriander; dress with lime, cumin and oil.'],
      tips: 'Travels well to work: cut the avocado at the last minute.' },
    { id: 'bolonesa-soja', slot: 'ce', tags: [], nombre: 'Textured soy bolognese with courgette noodles', tipo: 'Dinner · 20′', tiempo: '20′', cocina: 'Pan',
      macros: { kcal: 445, p: 37, g: 13, c: 47 },
      ing: [{ q: '60 g', i: 'fine textured soy protein (dry)' }, { q: '250 g', i: 'crushed tomatoes' }, { q: '300 g', i: 'courgette spirals or ribbons' }, { q: '100 g', i: 'onion, carrot and garlic' }, { q: '10 g', i: 'extra-virgin olive oil' }, { q: 'to taste', i: 'oregano, paprika, salt' }],
      pasos: ['Soak the soy 10′ in hot water with a pinch of salt; drain well.', 'Soffritto 5′; drained soy 3′ over high heat; tomato and oregano, 8′.', 'Courgette 2′ in a separate pan (so it doesn’t weep). Bolognese on top.'],
      tips: 'Textured soy has 50 g protein per 100 g dry: the cheapest “mince” there is.' }
  ];

  /* ---------- SHOPPING LIST (typical week) ---------- */
  const COMPRA = [
    { cat: 'Protein', items: [
      { q: '1.4 kg', i: 'chicken breast' },
      { q: '400 g', i: 'lean beef strips' },
      { q: '500 g', i: 'hake or sea bass (2 servings)' },
      { q: '350 g', i: 'salmon (2 fillets)' },
      { q: '300 g', i: 'frozen peeled prawns' },
      { q: '4 tins', i: 'tuna in spring water' },
      { q: '18', i: 'medium eggs (a dozen and a half)' },
      { q: '14 (250 g each)', i: 'skyr or 0% fat quark (7 breakfasts/desserts + 7 night servings)' },
      { q: '1 tub (lasts ~1 month)', i: 'whey (1 scoop daily in the night serving)' }
    ]},
    { cat: 'Carbohydrates', items: [
      { q: '500 g', i: 'rice' },
      { q: '2 kg', i: 'potatoes' },
      { q: '400 g', i: 'wholemeal bread (large loaf or sliced)' },
      { q: '500 g', i: 'oats' },
      { q: '2 tins (400 g drained each)', i: 'cooked lentils' }
    ]},
    { cat: 'Veg and fruit', items: [
      { q: '5', i: 'peppers' },
      { q: '4', i: 'onions (+1 red)' },
      { q: '2', i: 'courgettes' },
      { q: '2', i: 'heads of broccoli' },
      { q: '8', i: 'tomatoes (2 for grating)' },
      { q: '2 bags', i: 'lettuce or lamb’s lettuce' },
      { q: '500 g', i: 'carrots' },
      { q: '12-14 pieces', i: 'fruit: bananas ×5, apples ×4-5, oranges ×4' }
    ]},
    { cat: 'Pantry', items: [
      { q: '—', i: 'EVOO' },
      { q: '200 g', i: 'walnuts' },
      { q: '1 jar', i: 'olives' },
      { q: '1 bottle', i: 'soy sauce' },
      { q: '3', i: 'lemons' },
      { q: '—', i: 'spices: paprika, garlic powder, cumin, oregano, cinnamon' },
      { q: '—', i: 'salt, vinegar, stock' }
    ]}
  ];

  /* ---------- SUNDAY MEAL PREP (~90′) ---------- */
  const MEALPREP = [
    { min: '0′',  paso: 'Oven to 200°. Season 1.2 kg of chicken breasts and rub them with paprika + garlic powder.' },
    { min: '5′',  paso: 'Into the oven: tray 1 (breasts, 25-30′) and tray 2 (1.5 kg of potato wedges + 2 peppers + 2 onions + 20 g EVOO, 40-45′).' },
    { min: '10′', paso: 'Pot on medium heat: sofrito of onion, pepper and carrot with 10 g of EVOO.' },
    { min: '15′', paso: 'Saucepan 1: 400 g of rice on to cook (12-15′). Saucepan 2: 6 eggs (10′) + 2 medium potatoes (leave those 20′): eggs and potato for the tuna salad.' },
    { min: '20′', paso: 'Into the pot: 2 tins of drained lentils + 400 ml of stock + paprika and cumin. Low heat, 20′.' },
    { min: '30′', paso: 'Breasts out. Slice 250 g into strips for the lentils (added once off the heat). Drain the rice and spread it on a tray to cool fast.' },
    { min: '45′', paso: 'Potatoes out of the oven. Turn, taste, salt if needed.' },
    { min: '60′', paso: 'Portion up: 5 lunch containers (2 chicken+potatoes, 2-3 lentils, rice in its own container for the stir-fry/salmon) + hard-boiled eggs and boiled potato into the fridge.' },
    { min: '75′', paso: 'Label and store: fridge until Wednesday, freezer for Thursday-Friday’s (move it down to the fridge the night before). Kitchen tidied while something plays in the background.' }
  ];
  const MEALPREP_NOTA = 'The dinner fish is cooked fresh in 10 minutes: it isn’t prepped on Sunday. Chicken and rice keep 4 days refrigerated.';

  /* ---------- WEEKLY MENU ---------- */
  const MENU = [
    { d: 'Mon', de: 'bol-skyr', co: 'pollo-asado', ce: 'merluza-patata' },
    { d: 'Tue', de: 'tortilla-pan', co: 'lentejas-pollo', ce: 'ensalada-atun' },
    { d: 'Wed', de: 'bol-skyr', co: 'salteado-ternera', ce: 'revuelto-gambas' },
    { d: 'Thu', de: 'tortilla-pan', co: 'pollo-asado', ce: 'salmon-arroz' },
    { d: 'Fri', de: 'bol-skyr', co: 'lentejas-pollo', ce: 'merluza-patata' },
    { d: 'Sat', de: 'tortilla-pan', co: 'LIBRE', ce: 'ensalada-atun' },
    { d: 'Sun', de: 'bol-skyr', co: 'salteado-ternera', ce: 'revuelto-gambas' }
  ];

  /* ---------- TRACKING ---------- */
  const CHECKPOINTS = [
    { sem: 4,  fecha: '2026-09-13', rango: [92.5, 93.5], si: 'Review olive oil and the free meal; +1,000 steps/day. Remember: creatine hides ~1 kg.' },
    { sem: 8,  fecha: '2026-10-11', rango: [90.0, 91.3], si: '−100 kcal of carbohydrate on rest days only (week 7 was a diet break: the average may come in high and that’s normal)' },
    { sem: 12, fecha: '2026-11-08', rango: [86.0, 88.0], si: 'Wrap-up, photos, measurements and the next block. In actual fat: ~−8 kg.' }
  ];
  const AJUSTES = [
    { id: 'rapido', cond: 'You lose more than 1.0 kg/week two weeks running (discounting the creatine effect)', accion: 'Add 150 kcal of carbohydrate. Faster is not better: at that rate the deficit eats into your muscle regain.' },
    { id: 'lento', cond: 'You lose less than 0.45 kg/week two weeks running (not counting the diet-break week)', accion: 'First verify steps and olive oil; if those are clean, add +1,500 steps BEFORE cutting kcal (protects the training).' },
    { id: 'rendimiento', cond: 'Gym performance drops two sessions in a row', accion: 'Look at sleep before the diet.' }
  ];
  const FOTOS = ['2026-08-17', '2026-09-13', '2026-10-11', '2026-11-08'];

  /* ---------- ACHIEVEMENTS ---------- */
  // type: sesion | racha | peso | cintura | disco | pr | especial
  const LOGROS = [
    { id: 'primera',        icon: '⚡', nombre: 'Day one',            desc: 'First session completed. You’ve already done the hardest part.' },
    { id: 'sesiones-10',    icon: '🔟', nombre: 'Ten out of ten',     desc: '10 strength sessions completed.' },
    { id: 'sesiones-25',    icon: '🎯', nombre: 'Twenty-five',        desc: '25 strength sessions. This is a habit now.' },
    { id: 'sesiones-50',    icon: '🏛️', nombre: 'Fifty',              desc: '50 sessions. Different-person territory.' },
    { id: 'semana-perfecta',icon: '💎', nombre: 'Perfect week',       desc: 'Every strength session in a single week.' },
    { id: 'minimo-3',       icon: '🛡️', nombre: 'The floor holds',    desc: '3 straight weeks hitting at least the minimum (2 strength + 1 cardio).' },
    { id: 'racha-7',        icon: '🔥', nombre: 'Streak 7',           desc: '7 plan days in a row, done.' },
    { id: 'racha-14',       icon: '🔥', nombre: 'Streak 14',          desc: '14 plan days in a row. The on/off pattern is dead.' },
    { id: 'racha-30',       icon: '🌋', nombre: 'Streak 30',          desc: '30 plan days in a row. Unstoppable.' },
    { id: 'pasos-7',        icon: '👟', nombre: 'Week on foot',       desc: '7 days in a row hitting your steps.' },
    { id: 'disco-10',       icon: 'disc10', nombre: 'The 10 plate',   desc: 'Phase 1 complete. The habit is back.', disco: true },
    { id: 'disco-15',       icon: 'disc15', nombre: 'The 15 plate',   desc: 'Phase 2 complete. You’re back inside the gym.', disco: true },
    { id: 'disco-20',       icon: 'disc20', nombre: 'The 20 plate',   desc: 'Phase 3 complete. Real load is yours again.', disco: true },
    { id: 'disco-25',       icon: 'disc25', nombre: 'The 25 plate',   desc: 'Phase 4 complete. Full collection.', disco: true },
    { id: 'kg-2',           icon: '📉', nombre: '−2 kg',              desc: 'Weekly average 2 kg below the start.' },
    { id: 'kg-4',           icon: '📉', nombre: '−4 kg',              desc: '4 kg down on the weekly average.' },
    { id: 'kg-6',           icon: '📉', nombre: '−6 kg',              desc: '6 kg down. Halfway along the long road.' },
    { id: 'kg-8',           icon: '📉', nombre: '−8 kg',              desc: '8 kg down on the weekly average.' },
    { id: 'kg-10',          icon: '🏔️', nombre: '−10 kg',             desc: 'Double digits. Few people ever get here.' },
    { id: 'cintura-95',     icon: '📏', nombre: 'Waist −95',          desc: 'Waist below 95 cm.' },
    { id: 'cintura-93',     icon: '📏', nombre: 'Waist −93',          desc: 'Waist below 93 cm.' },
    { id: 'cintura-91',     icon: '👑', nombre: 'Master metric',      desc: 'Waist below 91 cm: less than half your height.' },
    { id: 'pr-1',           icon: '🥇', nombre: 'First PR',           desc: 'First time you beat your best mark on an exercise.' },
    { id: 'pr-5',           icon: '🥇', nombre: '5 PRs',              desc: 'Five personal records beaten.' },
    { id: 'pr-15',          icon: '🏆', nombre: '15 PRs',             desc: 'Fifteen PRs. Muscle memory paying dividends.' },
    { id: 'marca-banca',    icon: '🔓', nombre: 'Bench reclaimed',    desc: 'Moving your 95 kg on the bench press again. Five years on.' },
    { id: 'marca-sentadilla', icon: '🔓', nombre: 'Squat reclaimed', desc: 'Moving your 100 kg squat again.' },
    { id: 'dominada-libre', icon: '🦍', nombre: 'Free pull-up',       desc: 'First unassisted pull-up. Welcome back to the club.' },
    { id: 'mealprep-4',     icon: '🍱', nombre: 'Sunday chef',        desc: '4 Sunday meal preps in a row.' },
    { id: 'comeback',       icon: '🔁', nombre: 'The comeback',       desc: 'Back after 4 or more days away. Coming back matters more than falling.' },
    { id: 'fotos-4',        icon: '📸', nombre: 'The sequence',       desc: 'All 4 progress photos taken.' },
    { id: 'checkpoint-s4',  icon: '✅', nombre: 'Checkpoint W4',      desc: 'Weight inside or better than the corridor in week 4.' },
    { id: 'checkpoint-s8',  icon: '✅', nombre: 'Checkpoint W8',      desc: 'Weight inside or better than the corridor in week 8.' },
    { id: 'plan-completo',  icon: '🏁', nombre: 'BACK2PRIME',         desc: '12-week plan finished. 85 kg was the consequence, not the goal.' }
  ];

  /* ---------- THE SCIENCE BEHIND THE PLAN (evidence review · Aug 2026) ---------- */
  const CIENCIA = {
    intro: 'Plan checked against the evidence (meta-analyses and trials 2010-2025, August 2026). The idea that orders everything: a returner is not a novice — muscle and nervous system come back fast, but tendon has no memory. The muscle can sprint; the tendon sets the pace.',
    temas: [
      { t: 'Muscle memory', d: 'The regain is real and fast: strength in ~8 weeks, size in ~12. The mechanism (myonuclei vs epigenetics) is under debate, but the effect isn’t. That’s why double progression can move faster than in a novice — and exactly why the calendar is NOT compressed: the one that can’t keep up is the tendon.', ref: 'Rahmati 2022 (meta-analysis, J Cachexia Sarcopenia Muscle) · Cumming 2024 (J Physiol)' },
      { t: 'Tendon: the limiter', d: 'Tendon collagen renews ~10× slower than muscle. What does adapt it: heavy loads with slow ~3″ contractions (HSR) and isometrics at 70% (5×45″), which also relieve pain on the spot. Plyometrics is a poor tendon stimulus: no jumps to "prepare" for jogging.', ref: 'Mersmann 2017 (Front Physiol) · Rio 2015 (BJSM) · Kongsgaard (HSR)' },
      { t: 'Running with extra weight', d: 'Carrying extra weight, starting with more than 3 km/week of jogging spikes injuries (~31-48% more). Raising cadence to 170-180 cuts tibial impact ~11%. Safe progression isn’t the "10% rule": it’s never exceeding ~1.3× your average of the last 4 weeks.', ref: 'Bertelsen 2018 (RCT in overweight novices) · 2025 cadence review · IOC load consensus' },
      { t: 'The right deficit', d: 'A deficit beyond ~500-600 kcal wipes out muscle gain even if you lift. The optimal rate for keeping lean mass is ~0.7% of bodyweight/week. That’s why the plan loses at 0.6-0.75 kg/week and not 0.9.', ref: 'Murphy & Koehler 2022 (meta-analysis, 59 studies) · Garthe 2011' },
      { t: 'Protein', d: 'In a deficit, trained lifters need 2.3-3.1 g/kg of lean mass. {p} g puts you comfortably in the range, and splitting it into 4 servings of ≥40 g squeezes the most out of protein synthesis and controls hunger.', ref: 'Helms 2014 (systematic review) · Schoenfeld & Aragon (per-serving distribution)' },
      { t: 'Diet break', d: 'Alternating deficit with maintenance breaks softened the metabolic slowdown and improved fat loss in the MATADOR study. Over {s} weeks its main value for your on/off profile is a different one: it teaches you that stopping for ONE planned week is not relapsing.', ref: 'Byrne 2018 (Int J Obesity, MATADOR)' },
      { t: 'Just enough volume', d: 'More sets = more muscle but with diminishing returns, and in a deficit the excess only adds fatigue and risk. Target: ~10 sets/muscle/week in P2 and 12-18 in P3-P4. And the non-negotiable minimum (2 strength + 1 cardio) has backing: that genuinely PRESERVES muscle.', ref: 'Pelland 2025 (Sports Medicine) · Androulakis-Korakakis 2020 (minimum dose)' },
      { t: 'Deloading done right', d: 'Stopping completely for a week costs strength; what works is cutting the volume in half while keeping the weight on the bar. That’s why week 9 is a MANDATORY deload of that kind, and week 10 (the jump to 5 days) starts with one set less on everything.', ref: 'Coleman 2024 (PeerJ, deload RCT)' },
      { t: 'Sleep', d: 'Sleeping 5.5 h in a deficit (vs 8.5) cut the fat lost by 55% and multiplied the muscle lost. After protein and the deficit, it’s your biggest lever. Hence the caffeine cut-off at 1-2 pm: 200 mg disrupts sleep up to 13 h later.', ref: 'Nedeltcheva 2010 (Ann Intern Med) · Gardiner 2023 (Sleep Med Rev)' },
      { t: 'Health first', d: 'After years without vigorous activity, before the hard work of F3-F4: blood pressure and a basic panel (lipids, glucose/HbA1c). With symptoms of any kind, see a doctor before continuing.', ref: 'ACSM Preparticipation Health Screening' }
    ]
  };

  const CIERRE = 'The plan’s real goal isn’t 8 November: it’s reaching December training 4 days a week out of habit, with no on/off cycle. The weight is the consequence, not the goal.';

  const AVISO_LEGAL = 'Your plan is generated from your answers using standard formulas (Mifflin-St Jeor and classic activity factors), with a ±10% margin that the adjustment rules correct with your real data. None of this replaces medical advice: for any condition, persistent pain or doubt, see a healthcare professional.';

  /* ---------- INTERFACE TEXTS (translatable like everything else) ----------
     Templates with {x}: app.js fills them via tpl(). Switching language
     loads assets/data.<lang>.js, which replaces ALL of window.B2P.        */
  const UI = {
    lang: 'en',
    tabs: ['Today', 'Plan', 'Food', 'Progress', 'Awards'],
    dias: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    meses: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    hoyTag: 'TODAY',
    semanaLinea: 'Week {w} of {t} · Phase {f} · {n} · RPE cap {r}',
    empiezaEnDias: 'Starts in {n} days', empiezaEn1: 'Starts in 1 day', empiezaLunes: 'Starts on Monday',
    preplanSub: '{f} · Phase 1 at home. Meanwhile, get your baseline ready:',
    prepCintura: 'Measure your waist fasted (at navel height)',
    prepFotos: 'Day-0 photos: front and side, the same light you’ll always use',
    prepCompra: 'Week 1 shop (list under Food)',
    prepBascula: 'Decide where and when you weigh in: Monday-Wednesday-Friday, fasted',
    practicaMenu: 'You can practise the menu from today: on {f} it’s for real.',
    descanso: 'Rest', domingoPrep: 'Sunday: rest + meal prep', planCompletado: 'Plan complete',
    calentamiento: '🔥 Warm-up · 6′',
    sesionSub: '{d} · rest on every row (tap to start the timer)',
    tendonNombre: 'Tendon protocol',
    cardioHecho: '✓ Cardio done', cardioMarcar: 'Mark cardio done', minutosReales: 'Actual minutes:',
    cadenciaSub: 'Cadence 170-180 · short stride', recuperacionSub: 'Active recovery', opcional: 'optional',
    tibialisAviso: '🛡 Before: tibialis raises 2×20 (tendon protocol).',
    diaADia: 'The day-to-day',
    hPasos: '8-10k steps', hPasosSub: 'Every day',
    hProte: 'Protein 4/4', hProteSub: '4 servings ≥{q} g',
    hPeso: 'Fasted weigh-in', hPesoSub: 'Weekly average, not a single day',
    hCintura: 'Waist (Monday)', hCinturaSub: 'The master metric · at the navel, no squeezing',
    hPrep: 'Meal prep', hPrepSub: '~90′ and the week is sorted',
    hFoto: 'Progress photos', hFotoSub: 'Front and side, same light',
    pesoGuardado: 'Weight saved: {v} kg', cinturaGuardada: 'Waist: {v} cm',
    marcarHecho: 'Mark done', usarPeso: 'Use this weight',
    diaAnterior: 'Previous day', diaSiguiente: 'Next day',
    cerrarPanel: 'Close', panelSinTitulo: 'Details',
    ajIdiomaSinRed: 'Offline: that language could not be downloaded.',
    versionNueva: 'New version · tap to update',
    quizTitulo: 'Your likes', quizPista: 'Swipe: right = like, left = pass',
    quizSi: 'Like', quizNo: 'Pass', quizDeshacer: 'Undo', quizSaltar: 'Skip',
    quizListo: 'Done', quizResumen: 'You like {a} of {b}. This will tune your plan.',
    gen: { protHueco: 'The menu provides ~{m} g of protein a day; up to your {p} g, the bridge is the extra servings (a shake or one more portion).', finRecapT: 'Your block, in numbers', subCorporal: 'Bodyweight version: hit the top of the rep range cleanly, then move up a variant.', f2nCasa: 'Loading up', f2oCasa: 'Relearn the basics with dumbbells and bands and build a loading base. Work at 65-70% of what you feel you could, with 3 reps in reserve ALWAYS.', f2nNada: 'Bodyweight progression', f2oNada: 'Master the progressions with your own body and build a base. Leverage rises before reps: harder variant only with clean technique.', gemNota: 'The slow calf raise is the tendon’s insurance: don’t skip it.', tendonSinTrote: 'Strength returns in weeks; the tendon needs months (its collagen renews ~10× slower and has no muscle memory). This block is the plan’s insurance: it starts week 1 and runs the whole block.', introNunca: 'Plan checked against the evidence (meta-analyses and trials 2010-2025). The organizing idea: starting from zero you progress fast, the first months bring the biggest strength gains of your life, but connective tissue lags behind muscle. That is why loads climb slowly even when you could do more.', introActivo: 'Plan checked against the evidence (meta-analyses and trials 2010-2025). The organizing idea: if you already train you do not need more punishment, you need better dosing. The right volume, logged progression and counted rest separate maintaining from improving.', cNuncaT: 'Starting from zero', cNuncaD: 'The first year brings the biggest strength gains of a lifetime: almost any well-executed dose works, which is why extreme programs are unnecessary. Technique comes first: today’s clean reps are the safe kilos of three months from now.', cNuncaR: 'novice gains: ACSM reviews and dose-response meta-analyses', cActivoT: 'Adding without breaking', cActivoD: 'The risk for someone already training is stacking new volume on old. Jumps above ~1.3× your recent average load spike injuries: add one variable at a time (days, volume or intensity), never all three.', cActivoR: 'IOC training load consensus (ACWR)', cSupT: 'A surplus that builds', cSupD: 'Building muscle needs only a small surplus (~250-350 kcal): above that, the extra shifts toward fat. The scale should climb slowly; if it climbs fast it is not muscle, because protein synthesis has a weekly ceiling.', cSupR: 'Garthe 2013 · Slater 2019 (surplus and composition)', r1Nunca: 'Every phase has its effort cap. Starting from zero, strength rises faster than your tissues’ resilience: always leave 2-3 reps in reserve and the gains arrive anyway, toll-free.', r1Activo: 'Every phase has its effort cap. You come in training, but this volume is new: respect the RPE caps for the first two weeks, then climb. Braking in time is what lets you progress all {s} weeks.', r8Nunca: 'The enemy at the start is not hardness, it is irregularity. The chaotic week has a floor: 2 strength + 1 cardio. That keeps everything running.', r8Activo: 'People who train also have impossible weeks. The floor: 2 strength + 1 cardio. With that nothing is lost; the rest is recoverable.', f1nNunca: 'Foundations', f1oNunca: 'Build the habit and learn the movement patterns without punishing joints. Being left wanting more is intentional.', f2nNunca: 'Technique', f2oNunca: 'Learn the basics with light load: every clean rep now is safe kilos later. Work far from failure ALWAYS.', f3oNunca: 'Real volume and intensity, with technique now grooved. End every set able to do 2 more honest reps.', f1nActivo: 'Base', f1oActivo: 'Two weeks of adaptation to the plan: known dose, logging running, technique tuned before raising anything.', f2nActivo: 'Construction', f2oActivo: 'Progressive volume on top of your base: work at 70-75% of what you feel you could, with 2-3 reps in reserve.', f3oActivo: 'Real volume and intensity to force the change. End every set able to do 2 more reps, and make them real.', cierrePerder: 'The real goal of the plan is not {f}: it is getting there training out of habit, no on/off cycle. The weight coming down is the consequence, not the goal.', cierreRecomp: 'The real goal of the plan is not {f}: it is getting there with the habit built and clothes fitting differently. Recomposition is slow by design: consistency is the goal.', cierreGanar: 'The real goal of the plan is not {f}: it is getting there stronger on the bar with the habit built. Muscle is built in months: the next block starts where this one ends.', cierreManten: 'The real goal of the plan is not {f}: it is training stopping being a plan and becoming a custom. Maintaining is winning.', cierreRenueva: 'To renew the block: Settings, Create / redo my plan. Two taps and you continue.', platoVegetariano: '3 eggs + 2 whites, or 250 g of skyr or quark + whey, or 200 g of firm tofu, or 150 g of tempeh, or 250 g of cooked legumes + 1 egg. Visual reference: a palm and a half.', platoVegano: '200-250 g of firm tofu, or 150-180 g of tempeh, or 250 g of cooked legumes + a scoop of plant protein, or 80 g (dry) of textured soy. Visual reference: a palm and a half.', suplVegT: 'Plant protein', suplVegD: '1 scoop of pea or soy protein in the pre-sleep serving (and another wherever a day runs short on protein).', numRecomp: 'Gentle deficit ~300-450 kcal/day: recomposition asks for patience, not aggression.', numSup: 'Surplus ~250-350 kcal/day: more is not more muscle, it is more fat (Garthe 2013).', numMan: 'Your estimated maintenance: the weekly average judges and adjusts.', ritmoSubeT: 'Expected gain rate', ritmoManT: 'Expected rate', ritmoSubeN: '≈0.25% of body weight/week: what muscle can actually be built. Weekly average, not day to day.', ritmoManN: 'The weekly average should stay within ±0.3 kg of your start.', wjN1: 'Walk-jog I', wjN2: 'Walk-jog II', wjN3: 'Walk-jog III', lChkN: 'Checkpoint W{s}', lChkD: 'Weight inside or better than the corridor in week {s}.', alRapidoBaja: 'Add 150 kcal of carbs. At this pace the deficit is eating muscle too.', alLentoBaja: 'Check portions and steps for a couple of days before cutting anything; if it stays flat, drop 100 kcal of carbs on rest days only.', alRapidoSube: 'You are gaining faster than muscle can be built: cut 150 kcal of carbs so the extra is not fat.', alLentoSube: 'The surplus is not showing on the scale: add 150 kcal of carbs on training days.', alMantenT: 'You are drifting off maintenance', alMantenD: 'Two weeks of drift in a row: adjust 100-150 kcal in the opposite direction and leave training alone.', circProg: 'Add 1-2 reps per week wherever your form stays clean: that is the progression.', durAprox: '≈{m}′', splitFbC: 'Full Body', splitTpC: 'Upper · Lower', splitPplC: 'Push · Pull · Legs', faseSub: '{s} ×{d}', nf1: 'F1–F2 (wk 1-{a})', nf2: 'F3 (wk {b}-{c})', nf3: 'F4 (wk {d}-{e})', dietBreakNota: 'Week {w}: DIET BREAK at ~{k}', hitoCribadoT: 'Health screen', hitoCribadoD: 'Before the loading phase, if you have been inactive for years: blood pressure at a pharmacy and a basic panel (lipids, glucose). 15 minutes that buy peace of mind.', hitoDietT: 'DIET BREAK', hitoDietD: 'All week you eat at maintenance (~{k} kcal: +2 servings of carbs a day, protein unchanged). Training stays the same. It restores NEAT and leptin and breaks the on/off cycle. Next Monday, deficit again.', hitoDescargaT: 'DELOAD (not optional)', hitoDescargaD: 'Same routine with half the sets and the same weight on the bar. Not a stop: it is tissue maintenance and a holiday for tendons and joints.', tomaNocheAlt: '+ every night: pre-sleep serving with your plant protein (soy or pea), ~40 g in a shake. ', franjaM: 'You train in the morning: eat breakfast after training, not before.', franjaMd: 'You train at midday: your main meal lands right after training.', franjaT: 'You train in the evening: something light before; dinner is your post-workout meal.', cardioLibreT: 'Cardio: {d}', cardioLibreD: '{m}′ at a comfortable, steady pace. Your sport counts the same as jogging: consistency rules.', chk1: 'Off the corridor: check portions and steps before touching anything. Early weeks also move water.', chk2: 'Two weeks off track: adjust 150 kcal of carbs in the right direction. Protein stays.', chk3: 'Closing: photos, measurements and the next block, decided with data.', lKgN: '−{v} kg', lKgD: 'Weekly average {v} kg below your start.', lKgUpN: '+{v} kg', lKgUpD: 'Weekly average {v} kg above your start. Muscle, brick by brick.', lCintN: 'Waist −{v}', lCintD: 'Waist below {v} cm.', lReinaN: 'Queen metric', lReinaD: 'Waist below half your height: {v} cm.', lFinDesc: '{s}-week plan finished. The goal was the habit; the rest is consequence.', marca: 'Plan generated for you', cuida: 'mind your {a}', datos: '{p} kg · {a} cm · {e} y.o.', menuAviso: '{n} menu dishes don’t fit your diet: swap them for anything in the recipe book, already filtered for you.', prepNota: 'Only recipes marked “batch” are made on Sunday; the rest are cooked fresh. Shopping quantities already count the week’s repeats.' },
    pBarraT: 'The plan on the bar', pBarraSub: '{a} of {b} plates loaded',
    patrones: { eh: 'Horizontal push', ev: 'Vertical push', th: 'Horizontal pull', tv: 'Vertical pull', rod: 'Knee-dominant', bis: 'Hip hinge', zan: 'Lunge', core: 'Stable core', flex: 'Trunk flexion', curl: 'Elbow flexion', ext: 'Elbow extension', gem: 'Calf raise', ais: 'Isolation' },
    quizCatEj: 'Exercise', quizCatDep: 'Sport', quizCatCom: 'Food',
    alta: { t: 'Create your user', sub: 'Strength, food and progress. A plan built for you, in two minutes.', nombreL: 'Your name', ph: 'What should we call you?', cta: 'Start', local: 'Your data lives only on this device. No accounts, no cloud.', valNombre: 'Enter a name, 2 to 24 characters.', idioma: 'Language' },
    rev: { minT: '{v} minutes per session', minSub: 'sessions trimmed to the essentials: the big lifts stay', evT: 'Goal: {e}', evSub: 'the date rules: consistency over perfection', durOpen: 'No deadline: {s}-week blocks, renewable', t: '{n}, your plan is ready', tAnon: 'Your plan is ready', sub: 'Decided from your answers. This is not a template.',
      splitT: 'Strength {d} days a week', splitFb: 'full body: what pays best on few days', splitTp: 'upper / lower, in pairs', splitPpl: 'push / pull / legs',
      kcalT: '{k} kcal a day', kDef: 'a {v} kcal deficit: lose fat without giving up muscle', kSup: 'a {v} kcal surplus to build muscle', kMan: 'at your maintenance, protein in charge',
      protT: '{p} g of protein a day', protSub: '{v} g per kilo of body weight',
      durT: '{s} weeks ahead', durSub: '{a} to {b}',
      subsT: '{n} exercises swapped', subsSub: 'for your equipment or your passes',
      cuidaT: 'Extra care: {a}', cuidaSub: 'the exercises that load it carry a warning',
      menuT: 'Menu adjusted to your table', menuSub: 'diet and intolerances applied to the whole week', menuAv: '{n} dishes still don’t fit: flagged in Food',
      gustosT: '{a} likes · {b} passes', gustosSub: 'what you passed on is out of your plan',
      cta: 'See my week 1', micro: 'Redo the questionnaire any time: everything recalculates.' },
    tour: { salta: 'Skip', sigue: 'Next', listo: 'Let’s train', pasos: [
      ['This is TODAY', 'Your day, already set: session, meals and logging. Tick ✓ and the app keeps count.'],
      ['The bar moves you', 'Today, Plan, Food, Progress and Awards. Tap, or drag the bubble.'],
      ['The whole plan', 'Phases, calendar, rules and the exercise library with video technique.'],
      ['Your table', 'Weekly menu, recipes with photos, shopping and meal prep, already filtered for you.'],
      ['Honest progress', 'Weight, waist, loads and consistency. Going too fast? The app slows you down.'] ] },
    cuest: {
      resLObj: 'Goal', resLEv: 'For', resLDur: 'Horizon', resLHist: 'Coming from', resLMat: 'Equipment', resLDieta: 'Table', resLFranja: 'Time slot', resLLes: 'Care', resLSin: 'Avoiding', 
      gateT: 'Your health rules', gateTxt: 'You marked a medical condition that limits exercise. Before anything gets generated, show your doctor what you plan to do (strength {d} days a week) and get their OK.',
      gateGuardado: 'Your answers are saved for when you come back.', gateOk: 'I have the OK', gateSalir: 'Leave for now',
      gateHoyT: 'Paused, for a reason', gateHoyTxt: 'The questionnaire is half done: your doctor’s OK is missing. With it, your plan generates instantly.', gateVolver: 'Resume the questionnaire',
      resCta: 'Generate my plan', resGen: 'Generating your plan…',
      titulo: 'Your plan, made to measure', atras: 'Back', sigue: 'Continue',
      sexoT: 'Your body', sexoP: 'Used only to calculate your calories.', sexoH: 'Man', sexoM: 'Woman', sexoX: 'Prefer not to say',
      medidasT: 'Your numbers', edadL: 'Age', alturaL: 'Height (cm)', pesoL: 'Weight (kg)', cinturaL: 'Waist (cm) · optional',
      objT: 'What are you after?', objPerder: 'Lose fat', objRecomp: 'Recomp: less fat, more muscle', objGanar: 'Build muscle', objMantener: 'Maintain',
      evT: 'What for?', evBoda: 'A wedding', evOpo: 'An exam', evVerano: 'Summer body', evSiempre: 'For good',
      durT: 'How long do you give yourself?', dur3: '3 months', dur6: '6 months', dur12: '12 months', durAlways: 'No deadline: a habit',
      histT: 'Where are you coming from?', histP: 'Comebacks are programmed differently: tendons set the pace.', histNunca: 'Never trained', histRetoma: 'Coming back after years away', histActivo: 'Training now',
      diasL: 'Days per week', minL: 'Minutes per session', franjaT: 'When do you prefer?', franjaM: 'Morning', franjaMd: 'Midday', franjaT2: 'Evening',
      matT: 'What equipment?', matNada: 'No equipment', matCasa: 'Home: dumbbells and bands', matGym: 'Full gym',
      lesT: 'Any aches or injuries?', lesRodilla: 'Knee', lesHombro: 'Shoulder', lesLumbar: 'Lower back', lesNo: 'None',
      medT: 'Any medical condition limiting exercise?', si: 'Yes', no: 'No',
      dietaT: 'Your table', dietaNormal: 'I eat everything', dietaVegetariano: 'Vegetarian', dietaVegano: 'Vegan',
      sinT: 'Avoiding anything?', sinGluten: 'Gluten', sinLactosa: 'Lactose', sinFrutos: 'Nuts', sinNada: 'Nothing',
      resT: 'Your profile is ready', resP: 'Your plan will be generated from this: training, meals and progression.',
      resGustos: '{a} likes · {b} passes', resProfesional: 'Before generating a plan, see a health professional: one of your answers calls for it.',
      resGuardar: 'Save profile', resGuardado: 'Profile saved', resProx: 'Plan generation arrives in the next phase.',
      valNum: 'Check {c}: between {a} and {b}.'
    },
    gPeso: 'Body weight chart', gCintura: 'Waist chart',
    gCargas: 'Load chart', gAdherencia: 'Weekly adherence chart',
    gRango: '{n} entries, from {a} to {b} {u}', gUnico: '1 entry, {a} {u}',
    gSemanas: '{n} of {t} weeks with data',
    gSinDatos: 'no data yet',
    fSinRegistro: 'You haven’t logged any weight here yet. Once you do, you’ll see the gap.',
    valFuera: 'Enter a value between {a} and {b} {u}.', descargaDosis: 'deload',
    hechosDe: 'Done {a} of {b} · {c} makes it count as a session',
    cerrarSinSesion: 'Close without a session', diaCerradoSinRacha: '✓ Day closed',
    sinRachaHoy: 'Today doesn\'t add to the streak.', mejorRachaNota: 'Your best: {n} days.',
    sinSesionToast: 'Day closed without a session: today doesn\'t count.',
    reabrirDia: 'Reopen day', diaReabierto: 'Day reopened', mejorLbl: 'Best',
    cerrarDia: 'Close the day', diaCerradoBtn: '✓ Day closed · streak {n}',
    diaCerradoToast: '✓ Day closed. Streak: {n}', diaCerradoSolo: 'Day closed.',
    sigueEditando: 'You can keep editing: everything saves itself.',
    comidaHoy: 'Today’s food', comidaHoySub: '{kcal} kcal · {p} g of protein in 4 servings',
    desayuno: 'Breakfast', comidaLbl: 'Lunch', cena: 'Dinner', presueno: 'Pre-sleep',
    comidaLibreMn: 'FREE MEAL', comidaLibreTitulo: 'Free meal', comidaLibreTag: 'one meal, not a day', tuya: 'yours',
    dietBreakChip: 'Diet break: +2 carb portions today. Protein unchanged.',
    extraChip: '➕ P{f} extra: a piece of fruit + 40 g of bread with lunch.',
    sugEmpieza: '◆ start at {v}', sugRepite: '↻ repeat {v}',
    faltaTitle: 'Tap if you did NOT complete all the reps',
    repsAMediasToast: 'Marked: reps missed (you’ll repeat the weight)', repsLimpiasToast: 'All reps clean',
    repsAMediasTag: 'reps short', repsLimpias: 'all reps clean', repsCortas: 'reps cut short',
    prToast: '🥇 PR on {e}: {v} kg', ya: 'NOW!',
    fHistorial: 'Your history', fMejor: 'best {v} kg', fHoy: 'today',
    fComo: 'How to do it', fErrores: 'Mistakes that will steal your progress', fAlt: 'Equivalent alternatives',
    fArranque: 'Suggested start', fArranqueTxt: '{v} kg in week 3.',
    fMarca: '🔓 Your mark back then: {t}',
    fFaltan: '{v} kg to reclaim it. There’s an award waiting.',
    fRecuperada: 'Reclaimed. That weight is yours again.',
    fVideo: 'Watch technique video',
    fDomiBtn: '🦍 Today I got my first UNASSISTED pull-up!', fDomiOk: '🦍 Logged', fDomiYa: '🦍 Free pull-up already logged',
    segPlan: ['Phases', 'Rules', 'Exercises', 'Science'],
    vReglas8: 'The 8 rules', vReglasSub: 'when in doubt, the rule wins',
    vCalendario: 'Calendar', vFasesDetalle: 'The 4 phases, in detail',
    vSeguros: 'The plan’s insurance', vBiblioteca: 'Exercise library', vTocaCualquiera: 'tap any of them',
    vCiencia: 'The science behind the plan',
    senalesTitulo: 'Signs to stop', objetivoReal: 'The real goal', recuerda: 'Remember',
    fase: 'Phase', sem: 'Wk', fechasLbl: 'Dates', especial: 'Special', fuerzaLbl: 'Strength',
    seriesLbl: 'Sets', descLbl: 'Rest', ejercicioLbl: 'Exercise', diaLbl: 'Day',
    cardioFase: 'Cardio for this phase',
    zonas: { empuje: 'Push', tiron: 'Pull', pierna: 'Legs and hips', core: 'Core' },
    chipsNutri: ['Goal', 'The plate', 'Recipes', 'Menu', 'Shopping', 'Meal prep', 'Supplements'],
    nObjetivo: 'Your goal right now', nSemana: 'week {w}',
    nNumeros: 'Where the numbers come from', nPlato: 'How to build each meal',
    nRecetario: 'Recipe book', nToca: 'tap to cook', nMenu: 'Weekly menu',
    nCompra: 'The week’s shop', nPrepDom: 'Sunday meal prep', nSupl: 'Supplements',
    nReiniciar: 'reset', nProteLbl: 'Protein', nGrasaLbl: 'Fat', nCarbosLbl: 'Carbs', kcalLbl: 'kcal',
    nDietBreakTitulo: 'This week: DIET BREAK', nDietBreakTxt: '~{k} kcal: +2 carb portions a day. Same protein. Same training.',
    nTomaNota: '+ every night: pre-sleep serving (skyr + whey). ',
    nIngredientes: 'Ingredients (1 serving)', nPasos: 'Steps', opcionalParen: ' (optional)',
    chipsProg: ['Overview', 'Weight', 'Waist', 'Loads', 'Weeks', 'Checkpoints'],
    pPeso: 'Weight', pPerdido: 'Lost', pGanado: 'Gained', pCintura: 'Waist', pAdh: 'Adherence', pSesiones: 'Sessions', pRacha: 'Streak',
    pMediaS: 'avg W{w}', pSinDatos: 'no data', pDesde: 'from {v}', pCinturaSub: '{f} · goal <{m}', pCinturaLunes: 'Mondays, fasted',
    pFuerzas: '{a}/{b} strength', pDeFuerza: 'strength', pDiasCumplidos: 'days closed',
    pPesoTitulo: 'Weight', pPesoSub: 'dots: weigh-ins · line: weekly average · band: expected corridor',
    pCinturaTitulo: 'Waist', pCinturaTituloSub: 'the queen metric · goal <{m} cm',
    pCargas: 'Loads', pCargasSub: 'exercise weight, session by session',
    pAdhTitulo: 'Adherence', pAdhSub: 'strength sessions completed per week',
    pChk: 'Checkpoints', pEsperado: 'Expected', pReal: 'Actual', pSiDesvias: 'If you drift',
    pTabla: 'table', pGrafica: 'chart', pFecha: 'Date',
    pLifts: { 'press-banca': 'Bench', 'sentadilla-barra': 'Squat', 'rdl-barra': 'RDL' },
    pTuMarca: 'your mark · {v} kg', pMeta91: 'goal {m}', pAguaCreatina: 'water (first weeks)', pLineaBase: 'Baseline',
    pMediaSemana: 'W{w} average',
    pVacioPeso: 'Your Monday, Wednesday and Friday weigh-ins will show up here',
    pVacioCintura: 'Every Monday, fasted: tape at the navel, no squeezing',
    pVacioCargas: 'Log kg on this exercise and you’ll see the climb here',
    pVacioAdh: 'Week by week, your consistency will show here',
    pCheckpointSemana: 'Checkpoint week', pEsperadoRango: 'Expected: {a}–{b} kg', pLlevas: ' · you’re at {v}', pSinPesajes: ' · no weigh-ins yet this week',
    pRapido: 'You’re going too fast', pLento: 'Pace below expected',
    pFrenaTrote: 'Ease off the jogging', pFrenaTxt: 'This week you’re at {r}× your recent average of running minutes. Above 1.3× the injury risk spikes: cut back or walk.',
    lDiscos: 'The plate collection', lDiscosSub: 'one per phase completed',
    lLogros: 'Awards', lFuerzas: 'Strength', lPRs: 'PRs', lPerdido: 'Lost', lMejorRacha: 'Best streak', lLogrosN: 'Awards', lFotos: 'Photos',
    perfilCinturaAdd: '+ Add waist', perfilCinturaNota: 'It becomes your baseline and unlocks the waist goal and badges. The rest of the plan does not change.', cerrarSesion: 'Log out', cerrarSesionNota: 'Back to the front door. Your plan and logs stay saved on this device.', rehacerSub: 'What do you want to redo?', rehacerTodo: 'Full questionnaire', rehacerTodoSub: 'Data and likes, top to bottom.', rehacerDatos: 'Just my data', rehacerDatosSub: 'Age, goal, days, equipment… The deck stays.', rehacerGustos: 'Just my likes', rehacerGustosSub: 'The card deck, from scratch.', perfilDetrasT: 'Behind the plan', buscarT: 'Search the app', buscarPH: 'Exercise, dish, section…', buscarNada: 'Nothing by that name. Try another word.', perfilT: 'My profile', perfilDatosT: 'Your answers', perfilPlanT: 'Your plan, in short', ajustes: 'Settings', ajustesSub: 'BACK2PRIME · your data lives ONLY on this device',
    ajLineaBase: 'Baseline', ajCinturaIni: 'Starting waist (cm)', ajGuardar: 'Save baseline', ajGuardado: 'Saved',
    ajCopia: 'Backup',
    ajCopiaTxt: 'Your data never leaves the phone. Make a backup now and then (or before switching devices) and keep it wherever you like.',
    ajExportar: '⬇ Export', ajImportar: '⬆ Import', ajImportOk: 'Backup restored', ajImportErr: 'That file doesn’t look like a BACK2PRIME backup',
    ajIdioma: 'Language', ajIdiomaNota: 'The app reloads on change. Your data is untouched.',
    ajRehacer: 'Create / redo my plan', ajRehacerNota: 'Takes you to the questionnaire. Regenerating never touches your daily logs.', ajPeligro: 'Danger zone', ajBorrar: 'Delete profile and all data', ajBorrarConfirma: 'Sure? Tap again to delete EVERYTHING',
    obTitulo: 'Welcome to BACK2PRIME', obSub: '12 weeks · 17 Aug → 8 Nov · from 95 to your best self',
    obTexto: 'Your training log, your plan and your nutrition in one place. Tick off what you do each day: the app suggests your weights, watches your pace and drops awards. Everything stays on your phone.',
    obConsejo: 'Tip: add it to your home screen (Share → Add to Home Screen) to use it like a real app.',
    obCintura: 'Starting waist — your master metric', obPlaceholder: 'cm (optional, you can do it later)', obEmpezamos: 'Let’s go',
    celebraOk: 'Keep going',
    nuevoDia: 'New day: {f}'
  };

  UI.checkSalidaTitulo = 'Exit check ({f})';
  UI.checkSalidaTxt = 'You complete both circuits at week 2 reps with no joint pain → Phase 2. If anything complains, repeat a week: your tendons will thank you.';
  UI.planEmpiezaTitulo = 'The plan starts on {f}';
  UI.planEmpiezaTxt = 'Phase 1 · Reactivation at home. Here’s everything you need to arrive with your homework done.';

    const QUIZ_DEP = [{ id: 'running', n: 'Running' }, { id: 'natacion', n: 'Swimming' }, { id: 'ciclismo', n: 'Cycling' }, { id: 'padel', n: 'Padel' }, { id: 'futbol', n: 'Football' }, { id: 'baloncesto', n: 'Basketball' }, { id: 'volley', n: 'Volleyball' }, { id: 'yoga', n: 'Yoga' }, { id: 'calistenia', n: 'Calisthenics' }, { id: 'boxeo', n: 'Boxing' }];
  return { META, FASES, CAL, HITOS_SEMANA, SESIONES, CALENTAMIENTO, TENDON, CARRERA, HISTORICO, ARRANQUE, EJERCICIOS, REGLAS, SENALES, NUTRI, RECETAS, COMPRA, MEALPREP, MEALPREP_NOTA, MENU, CHECKPOINTS, AJUSTES, FOTOS, LOGROS, CIENCIA, CIERRE, AVISO_LEGAL, QUIZ_DEP, UI };
})();
