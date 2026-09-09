/* ============================================================
   BACK2PRIME · data.fr.js
   Tout le contenu du plan de 12 semaines : phases, calendrier,
   séances, fiches d’exercices, nutrition, recettes, succès.
   Aucune logique : que des données. La logique vit dans app.js.
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
      objetivoNota: '≈ −8 kg de gras réels : la créatine masque ~1 kg d’eau sur la balance',
      cinturaMetaCm: 91,
      grasaEstimada: '~22% → 16-17%',
      proteinaDia: 190
    }
  };

  /* ---------- PHASES (code des disques olympiques) ---------- */
  const FASES = [
    { id: 1, nombre: 'Réactivation', sub: 'À la maison', semanas: [1, 2], disco: 10, rpe: '6–7',
      fechas: '17 – 30 août',
      objetivo: 'Retrouver l’habitude et les schémas moteurs sans matraquer les articulations. Tu resteras sur ta faim : c’est voulu.' },
    { id: 2, nombre: 'Entrée en salle', sub: 'Full Body ×3', semanas: [3, 4, 5], disco: 15, rpe: '6–7',
      fechas: '31 août – 20 sept',
      objetivo: 'Mouvements de base à la barre et base de charge. Ta mémoire musculaire autorise des poids que le tissu conjonctif ne tolère pas encore : 65-70% de ce que tu pourrais, 3 vraies répétitions en réserve.' },
    { id: 3, nombre: 'Charge', sub: 'Haut / Bas ×4', semanas: [6, 7, 8, 9], disco: 20, rpe: '7–8',
      fechas: '21 sept – 18 oct',
      objetivo: 'Volume et intensité réels ; c’est ici que la mémoire musculaire paie. Termine chaque série avec 2 vraies répétitions en réserve : celui qui revient se croit plus près de l’échec qu’il ne l’est.' },
    { id: 4, nombre: 'Pic', sub: 'Push / Pull / Legs ×5', semanas: [10, 11, 12], disco: 25, rpe: '8',
      fechas: '19 oct – 8 nov',
      objetivo: 'Stimulus maximal pour boucler. {d} jours de {min} minutes, pas de 2 heures. RPE 8 : 1-2 vraies répétitions en réserve sur les dernières séries.' }
  ];

  /* ---------- CALENDRIER : 12 semaines × 7 jours (Lun..Dim) ----------
     Chaque slot : id de séance, ou {s:id, opt:true} si optionnelle.   */
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

  /* ---------- SEMAINES SPÉCIALES (évidence : décharge gérée + diet break + transition) ---------- */
  const HITOS_SEMANA = {};

  /* ---------- SÉANCES ---------- */
  // blocs : e = id exercice · s = séries · r = reps (rW = par semaine) · d = repos sec · n = note courte
  const SESIONES = {
    /* — Phase 1 · maison — */
    'c-a': { nombre: 'Circuit A', tipo: 'fuerza', fase: 1, dur: '~35′', calent: true, bloques: [
      { e: 'sentadilla-pc',  s: 3, rW: { 1: '10', 2: '12' }, d: 75 },
      { e: 'flexiones',      s: 3, rW: { 1: '6-8', 2: '8-10' }, d: 75 },
      { e: 'puente-gluteo',  s: 3, rW: { 1: '12', 2: '15' }, d: 60 },
      { e: 'plancha',        s: 3, rW: { 1: '25″', 2: '35″' }, d: 60 },
      { e: 'elev-talones',   s: 2, rW: { 1: '15', 2: '20' }, d: 45, n: 'Prépare les tendons au footing' }
    ]},
    'c-b': { nombre: 'Circuit B', tipo: 'fuerza', fase: 1, dur: '~35′', calent: true, bloques: [
      { e: 'zancada-alterna', s: 3, rW: { 1: '8/jambe', 2: '10/jambe' }, d: 75 },
      { e: 'remo-toalla',     s: 3, rW: { 1: '10', 2: '12' }, d: 75 },
      { e: 'rdl-1p',          s: 3, rW: { 1: '8/jambe', 2: '10/jambe' }, d: 60 },
      { e: 'superman',        s: 3, rW: { 1: '10', 2: '12' }, d: 45 },
      { e: 'dead-bug',        s: 3, rW: { 1: '10/côté', 2: '12/côté' }, d: 45 }
    ]},
    /* — Phase 2 · Full Body — */
    'fb-a': { nombre: 'Full Body A', tipo: 'fuerza', fase: 2, dur: '~60′', calent: true, bloques: [
      { e: 'sentadilla-barra',   s: 3, r: '8',  d: 120, n: 'S3 : barre à vide ou +10-20 kg, juste le schéma moteur' },
      { e: 'press-banca',        s: 3, r: '8',  d: 120 },
      { e: 'remo-barra',         s: 3, r: '8',  d: 120 },
      { e: 'press-militar-mc',   s: 2, r: '10', d: 90 },
      { e: 'curl-femoral-tumbado', s: 2, r: '12', d: 90 },
      { e: 'plancha',            s: 3, r: '40″', d: 60, n: 'Quand ça devient facile : alterne l’appui sur une main' }
    ]},
    'fb-b': { nombre: 'Full Body B', tipo: 'fuerza', fase: 2, dur: '~60′', calent: true, bloques: [
      { e: 'rdl-barra',          s: 3, r: '8',  d: 120, n: 'Commence avec 30-40 kg' },
      { e: 'press-inclinado-mc', s: 3, r: '10', d: 120 },
      { e: 'jalon-pecho',        s: 3, r: '10', d: 90 },
      { e: 'zancada-mc',         s: 2, r: '10/jambe', d: 90, n: '6-10 kg par main' },
      { e: 'elev-laterales',     s: 2, r: '15', d: 60 },
      { e: 'face-pull',          s: 2, r: '15', d: 60, n: 'Contrepoids à la poussée : santé d’épaule dès maintenant' },
      { e: 'crunch-polea',       s: 3, r: '12', d: 60 }
    ]},
    /* — Phase 3 · Haut/Bas — */
    'torso-a': { nombre: 'Haut A', tipo: 'fuerza', fase: 3, dur: '~70′', calent: true, bloques: [
      { e: 'press-banca',      s: 4, r: '6-8', d: 150, n: 'Base lourde : 4×8 propre → +2,5 kg et retour à 4×6' },
      { e: 'remo-barra',       s: 4, r: '8',   d: 120, n: 'Même poids sur les 4 séries' },
      { e: 'press-militar',    s: 3, r: '10',  d: 90 },
      { e: 'jalon-pecho',      s: 3, r: '10',  d: 90, n: '1″ de pause en bas' },
      { e: 'elev-laterales',   s: 3, r: '15',  d: 60 },
      { e: 'face-pull',        s: 2, r: '15',  d: 60, n: '2e dose hebdo de rotation externe' },
      { e: 'curl-barra-z',     s: 2, r: '12',  d: 60 },
      { e: 'ext-triceps-polea', s: 2, r: '12', d: 60 }
    ]},
    'pierna-a': { nombre: 'Bas A', tipo: 'fuerza', fase: 3, dur: '~70′', calent: true, tendon: 'rodilla', bloques: [
      { e: 'sentadilla-barra', s: 4, r: '6-8', d: 150, n: 'Double progression, comme le couché' },
      { e: 'rdl-barra',        s: 3, r: '8',   d: 120, n: '+5 kg quand les 3 séries sortent propres' },
      { e: 'prensa',           s: 3, r: '10',  d: 90 },
      { e: 'curl-femoral-tumbado', s: 3, r: '12', d: 90, n: 'Excentrique en 3″' },
      { e: 'gemelo-pie',       s: 4, r: '8',   d: 90, n: 'HSR tendon : 3″ descente / 3″ montée, avec une vraie charge' },
      { e: 'plancha-lastre',   s: 3, r: '40″', d: 60 }
    ]},
    'torso-b': { nombre: 'Haut B', tipo: 'fuerza', fase: 3, dur: '~70′', calent: true, bloques: [
      { e: 'press-inclinado-mc', s: 4, r: '8', d: 120, n: 'Poussée lourde du jour' },
      { e: 'dominadas',        s: 4, r: '8',   d: 120, n: 'Réduis l’assistance semaine après semaine' },
      { e: 'press-plano-mc',   s: 3, r: '10',  d: 90 },
      { e: 'remo-polea',       s: 3, r: '12',  d: 90 },
      { e: 'face-pull',        s: 3, r: '15',  d: 60, n: 'Santé d’épaule pour les phases de poussée' },
      { e: 'curl-inclinado',   s: 2, r: '12',  d: 60, n: 'Superset avec la barre au front si tu es juste en temps' },
      { e: 'press-frances',    s: 2, r: '12',  d: 60 }
    ]},
    'pierna-b': { nombre: 'Bas B', tipo: 'fuerza', fase: 3, dur: '~70′', calent: true, tendon: 'rodilla', bloques: [
      { e: 'hip-thrust',       s: 4, r: '8',   d: 120, n: 'Pause 1″ en haut, fessier à fond' },
      { e: 'zancada-bulgara',  s: 3, r: '10/jambe', d: 90, n: 'Le plus dur du plan. Commence sans charge' },
      { e: 'ext-cuadriceps',   s: 3, r: '12',  d: 90, n: 'Si la rotule gêne, réduis l’amplitude en haut' },
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
      { e: 'ext-triceps-polea', s: 3, r: '12', d: 60, n: 'Alterne avec l’extension nuque' },
      { e: 'ext-triceps-cabeza', s: 3, r: '12', d: 60 }
    ]},
    'pull-a': { nombre: 'Pull', tipo: 'fuerza', fase: 4, dur: '~65′', calent: true, bloques: [
      { e: 'rdl-barra',        s: 3, r: '6-8', d: 150 },
      { e: 'dominadas',        s: 4, r: '8',   d: 120, n: 'Lestées si tu dépasses 10' },
      { e: 'remo-barra',       s: 3, r: '10',  d: 120, n: 'Ou rowing à la poulie' },
      { e: 'face-pull',        s: 3, r: '15',  d: 60 },
      { e: 'curl-barra-z',     s: 3, r: '10',  d: 60 },
      { e: 'curl-martillo',    s: 2, r: '12',  d: 60 }
    ]},
    'legs': { nombre: 'Legs', tipo: 'fuerza', fase: 4, dur: '~70′', calent: true, tendon: 'rodilla', bloques: [
      { e: 'sentadilla-barra', s: 4, r: '6',  d: 150 },
      { e: 'prensa',           s: 3, r: '10', d: 120 },
      { e: 'hip-thrust',       s: 3, r: '10', d: 120 },
      { e: 'curl-femoral-tumbado', s: 3, r: '12', d: 90 },
      { e: 'gemelo-pie',       s: 4, r: '8',  d: 90, n: 'HSR : 3″ descente / 3″ montée' },
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
      { e: 'remo-mancuerna',   s: 3, r: '12/côté', d: 90 },
      { e: 'pullover-polea',   s: 3, r: '15', d: 60 },
      { e: 'encogimientos',    s: 3, r: '12', d: 60 },
      { e: 'curl-polea',       s: 3, r: '15', d: 60 }
    ]},
    /* — Cardio — */
    'cam40':  { nombre: 'Marche 40′', tipo: 'cardio', icono: 'walk', detalle: 'Tu peux parler, pas chanter. Ça compte pour les pas du jour.' },
    'cam60':  { nombre: 'Marche 60′', tipo: 'cardio', icono: 'walk', detalle: 'Rythme vif et soutenu. Idéal dehors : ça cumule lumière, pas et récupération active.' },
    'wj3': { nombre: 'Marche-course S3', tipo: 'cardio', icono: 'run', detalle: '7 tours : 2′ de course légère + 2′ de marche (28′). Avant : 2×20 tibialis raises et 10 élévations de mollets. Si tu ne peux pas parler, tu vas trop vite.' },
    'wj4': { nombre: 'Marche-course S4', tipo: 'cardio', icono: 'run', detalle: '6 tours : 3′ de course + 2′ de marche (30′). Avant : 2×20 tibialis raises. Cadence haute et foulées courtes : moins d’impact par foulée.' },
    'wj5': { nombre: 'Marche-course S5', tipo: 'cardio', icono: 'run', detalle: '5 tours : 5′ de course + 1′ de marche (30′), ou 20′ de footing léger en continu si le corps répond bien. Avant : 2×20 tibialis raises.' },
    'trote25': { nombre: 'Footing 25-30′', tipo: 'cardio', icono: 'run', detalle: 'Continu, à rythme de conversation. Préfère l’asphalte lisse ou la terre aux trottoirs. Gêne au tibia ou au genou qui empire : coupe et marche.' },
    'trote30': { nombre: 'Footing 30-35′', tipo: 'cardio', icono: 'run', detalle: 'Continu. Un jour peut être un peu plus enlevé (les derniers 10′ à allure moyenne), l’autre toujours facile.' },
    'libre': { nombre: 'Repos', tipo: 'libre', icono: 'rest', detalle: 'Vraie journée off ; les pas comptent toujours. Dimanche : meal prep (~90′) et la semaine est réglée.' }
  };

  /* ---------- ÉCHAUFFEMENT (toujours, 6′) ---------- */
  const CALENTAMIENTO = {
    titulo: 'Échauffement · 6′ · toujours',
    pasos: [
      'Cercles de bras · 30″',
      'Rotations de hanches · 30″ par côté',
      '10 squats lents sans charge',
      '5 fentes avec rotation par côté',
      'Planche · 20″',
      '20 jumping jacks'
    ],
    gym: 'En salle, en plus : 1-2 séries d’approche légères sur le premier exercice lourd du jour (50% et 75% du poids de travail).'
  };

  /* ---------- PROTOCOLE TENDON (l’assurance du plan) ---------- */
  const TENDON = {
    titulo: 'Protocole tendon · 6-8′ · 2-3×/semaine',
    intro: 'La force revient en semaines ; le tendon demande des mois : son collagène se renouvelle ~10 fois plus lentement et n’a pas de mémoire. Ce bloc est l’assurance du plan : il démarre en semaine 1, et la course de la semaine 3 n’arrive qu’avec deux semaines de tendon rodées.',
    bloques: [
      { id: 'tendon-rodilla', nombre: 'Rotulien · isométrique', donde: 'Après chaque séance jambes (en P1, après les circuits)',
        detalle: 'Squat isométrique au mur (dès P2, squat espagnol avec sangle rigide derrière les genoux) : 5 × 45″ à ~70% d’effort, 1′ de repos. Cuisse proche de la parallèle, sans douleur aiguë. En plus, ça coupe la douleur sur le moment.' },
      { id: 'tendon-aquiles', nombre: 'Achille · HSR mollets', donde: 'Déjà intégré aux séances (élévations/mollets)',
        detalle: 'Mollets lourds et lents : 3″ de descente, 3″ de montée, 6-8 reps, sans rebond. En P1 avec un sac à dos sur une jambe ; en salle avec une vraie charge. Le rebond exploite le réflexe du tendon et lui vole le stimulus dont il a besoin.' },
      { id: 'tendon-tibial', nombre: 'Tibial antérieur', donde: 'Avant chaque footing',
        detalle: 'Tibialis raises adossé au mur : 2-3 × 15-20. C’est le vaccin contre la périostite à ton poids actuel.' },
      { id: 'tendon-codo', nombre: 'Coude/poignet · isométrique', donde: 'Après les séances haut du corps (P2+), 2×/sem',
        detalle: 'Haltère léger, poignet immobile à mi-flexion : 3 × 45″, paume vers le haut puis vers le bas. Autant de développé, rowing et tirage déclenche des épicondylites ; ça les prévient.' }
    ],
    nota: 'N’ajoute pas de sauts « pour préparer la course » : mauvais stimulus pour le tendon et impact élevé. Ta préparation à l’impact, c’est ce bloc.'
  };

  /* ---------- RÈGLES DE COURSE (évidence IMC ~28) ---------- */
  const CARRERA = {
    titulo: 'Courir sans te casser ({p} kg aux commandes)',
    reglas: [
      'Cadence 170-180 pas/min et foulée courte : ~11% d’impact tibial et ~15% de taux de charge en moins. Compte 85-90 pas en 30″ ou utilise le métronome de la montre.',
      'Jamais plus de ~1,3× ta moyenne des 4 dernières semaines. L’app te prévient.',
      'Semaine 3 : ~2,5 km au total, sous le plafond de 3 km/sem pour débuter en surpoids.',
      'Même surface et mêmes chaussures : ne change pas les deux en même temps. Préfère l’asphalte lisse ou la terre aux trottoirs.',
      'Gêne au tibia ou au genou qui empire en courant : coupe et marche. Celle qui part à l’échauffement, surveille-la.'
    ]
  };

  /* ---------- MARQUES HISTORIQUES (époque salle, ~2021) ---------- */
  // Pas chargées comme PR : c’est la référence de « où tu en étais » et la cible à reconquérir.
  /* Sin marcas previas: el plan se genera del cuestionario. La clave se
     mantiene porque la app la consulta, y vacía deja los logros de marca
     personal fuera de alcance, que es lo correcto para cualquiera. */

  /* ---------- CHARGES DE DÉPART · PHASE 2 ---------- */


  /* ---------- FICHES D’EXERCICES ---------- */
  // musc : [principal, secondaires] · cues : technique · err : erreurs typiques ·
  // alt : alternatives équivalentes (salle commerciale) · mol : si ça gêne, passe à
  const EJERCICIOS = {
    /* — Maison / P1 — */
    'sentadilla-pc': { pat: 'rod', pic: 'sentadilla-pc',
      nombre: 'Squat au poids du corps', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadriceps', 'fessier'], equipo: 'Rien',
      cues: ['Pieds largeur d’épaules, pointes légèrement ouvertes', 'Descends en 3″ comme pour t’asseoir en arrière, remonte en 1″', 'Les genoux suivent la pointe des pieds, talons vissés au sol', 'Poitrine haute sur tout le trajet'],
      err: ['Talons qui décollent (descends moins bas)', 'Genoux qui rentrent vers l’intérieur', 'Descendre en rebondissant au lieu de contrôler'],
      alt: [{ n: 'Squat sur box/canapé', por: 'si tu as du mal à contrôler la profondeur' }, { n: 'Squat avec pause 2″ en bas', por: 'si 12 reps deviennent trop faciles' }],
      mol: 'Si le genou gêne : réduis la profondeur jusqu’à la zone sans douleur et descends encore plus lentement.'
    },
    'flexiones': { pat: 'eh', pic: 'flexiones',
      nombre: 'Pompes', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Pectoraux', 'triceps, épaules'], equipo: 'Rien',
      cues: ['Mains un peu plus larges que les épaules', 'Coudes à 45° du corps, ni collés ni en croix', 'Corps en planche : fessier et abdos serrés', 'La poitrine touche (presque) le sol à chaque rep'],
      err: ['Hanches qui tombent ou en pic', 'Demi-amplitude', 'Cou qui plonge vers le sol'],
      alt: [{ n: 'Pompes mains sur canapé/table', por: 'si elles ne sortent pas propres au sol' }, { n: 'Pompes pieds surélevés', por: 'si tu en passes 12 facilement' }],
      mol: 'Si le poignet gêne : poings fermés ou poignées de pompes. Si l’épaule gêne : resserre un peu l’écartement.'
    },
    'puente-gluteo': { pat: 'bis', pic: 'puente',
      nombre: 'Pont fessier', mm: { p: ['gluteo'], s: ['isquios'] }, zona: 'pierna', musc: ['Fessier', 'ischios'], equipo: 'Rien',
      cues: ['Allongé, talons proches du fessier', 'Pousse dans les talons et monte le bassin', 'Pause 2″ en haut en serrant fort le fessier', 'Côtes basses : ne cambre pas les lombaires'],
      err: ['Pousser avec la pointe des pieds', 'Cambrer les lombaires pour monter plus haut', 'Monter et descendre sans pause'],
      alt: [{ n: 'Pont à une jambe', por: 'quand 15 reps deviennent confortables' }, { n: 'Pont avec sac à dos sur les hanches', por: 'pour ajouter de la charge à la maison' }],
      mol: 'Si crampe aux ischios : rapproche encore les talons du fessier.'
    },
    'plancha': { pat: 'core',
      nombre: 'Planche', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Core complet'], equipo: 'Rien',
      cues: ['Avant-bras au sol, coudes sous les épaules', 'Côtes rentrées, bassin en rétroversion (rentre les fesses)', 'Fessier serré, regard vers le sol', 'Respire : ne bloque pas l’air'],
      err: ['Hanches qui tombent (les lombaires trinquent)', 'Fesses en pic (triche)', 'Tenir en tremblant : si les lombaires tremblent, coupe la série'],
      alt: [{ n: 'Planche en appui sur les genoux', por: 'si tu ne tiens pas le temps avec une bonne forme' }],
      mol: 'Si les lombaires gênent : vérifie d’abord la rétroversion du bassin ; c’est presque toujours ça.'
    },
    'plancha-lastre': { pat: 'core',
      nombre: 'Planche lestée', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Core complet'], equipo: 'Disque 5-10 kg',
      cues: ['Même technique que la planche normale', 'Fais-toi poser le disque entre les omoplates, pas sur les lombaires', 'Si les hanches tombent, enlève du lest'],
      err: ['Disque trop bas (charge les lombaires)', 'Perdre la rétroversion avec la fatigue'],
      alt: [{ n: 'Planche avec touches d’épaule', por: 'si personne ne peut te poser le disque' }, { n: 'Ab wheel sur les genoux', por: 'variante plus exigeante' }],
      mol: 'Si les lombaires gênent : reviens à la planche sans lest + touches d’épaule.'
    },
    'elev-talones': { pat: 'gem',
      nombre: 'Élévations de mollets', mm: { p: ['gemelos'], s: [] }, zona: 'pierna', musc: ['Mollet', 'soléaire'], equipo: 'Marche optionnelle',
      cues: ['Amplitude complète : étire en bas, pause 1″ en haut', 'Monte en 1″, descends en 2-3″', 'Mieux sur une marche pour plus d’amplitude'],
      err: ['Rebondir vite sans pause', 'Demi-amplitude en haut'],
      alt: [{ n: 'À une jambe', por: 'quand 20 reps deviennent faciles' }],
      mol: 'Si l’Achille gêne : réduis l’amplitude en bas et rallonge le temps de descente.'
    },
    'zancada-alterna': { pat: 'zan', pic: 'zancada-pc',
      nombre: 'Fentes alternées', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadriceps', 'fessier'], equipo: 'Rien',
      cues: ['Grand pas vers l’avant', 'Buste vertical, mains sur les hanches ou devant', 'Le genou arrière frôle le sol', 'Pousse dans le talon avant pour revenir'],
      err: ['Pas trop court (le genou avant s’écrase)', 'Buste penché vers l’avant', 'Genou avant qui part vers l’intérieur'],
      alt: [{ n: 'Fente statique (sans alterner)', por: 'si l’équilibre lâche' }, { n: 'Fente arrière', por: 'plus douce pour le genou' }],
      mol: 'Si le genou gêne : passe à la fente arrière, même schéma.'
    },
    'banda-remo': { pat: 'th', pic: 'banda',
      nombre: 'Rowing assis à la bande', mm: { p: ['dorsal'], s: ['biceps', 'espalda-alta'] }, zona: 'tiron', musc: ['Dorsaux', 'biceps, omoplates'], equipo: 'Bande',
      cues: ['Bande ancrée à hauteur de poitrine (poignée, poteau ou sous les pieds)', 'Tire avec les coudes, collés au corps', 'Serre les omoplates et tiens une demi-seconde', 'Relâche lentement : le retour, c’est la moitié de l’exercice'],
      err: ['Basculer le buste en arrière pour tirer plus', 'Lâcher la bande d’un coup'],
      alt: [{ n: 'Rowing à la serviette dans l’embrasure', por: 'sans point d’ancrage' }, { n: 'Rowing avec sac à dos chargé', por: 'à un bras, appuyé sur la table' }],
      mol: 'Si l’épaule se plaint : baisse l’ancrage et tire plus près du flanc.'
    },
    'banda-jalon': { pat: 'tv', pic: 'banda',
      nombre: 'Tirage vertical à la bande', mm: { p: ['dorsal'], s: ['biceps'] }, zona: 'tiron', musc: ['Dorsaux', 'biceps'], equipo: 'Bande',
      cues: ['Bande ancrée en haut (chambranle ou charnière haute)', 'À genoux ou assis, poitrine haute', 'Descends les coudes vers les poches, pas vers l’arrière', 'La poitrine va à la rencontre des mains'],
      err: ['Cambrer le bas du dos pour gagner de l’amplitude', 'Tirer seulement avec les bras'],
      alt: [{ n: 'Tractions assistées à la bande', por: 'si tu as une barre' }, { n: 'Rowing à la serviette', por: 'sans ancrage haut' }],
      mol: 'Si l’épaule se plaint : prise plus serrée, arrête plus haut.'
    },
    'banda-rotacion': { pat: 'ais', pic: 'banda',
      nombre: 'Rotation externe à la bande', mm: { p: ['hombro'], s: ['espalda-alta'] }, zona: 'empuje', musc: ['Coiffe des rotateurs', 'omoplates'], equipo: 'Bande',
      cues: ['Coude collé au flanc, 90° fixe (une serviette roulée aide)', 'Tourne l’avant-bras vers l’extérieur, lentement', 'L’épaule ne monte pas : garde la clavicule basse', '2-3″ au retour, sans perdre la tension'],
      err: ['Laisser le coude s’écarter du corps', 'Prendre une bande dure : ici c’est le contrôle qui commande'],
      alt: [{ n: 'Haltère léger allongé sur le côté', por: 'même travail, sans bande' }, { n: 'Face pull à la bande', por: 'plus d’omoplate' }],
      mol: 'Si ça pince : réduis l’amplitude de moitié et baisse la résistance.'
    },
    'banda-abduccion': { pat: 'ais', pic: 'banda',
      nombre: 'Abduction de hanche à la bande', mm: { p: ['gluteo'], s: [] }, zona: 'pierna', musc: ['Moyen fessier', 'stabilité du genou'], equipo: 'Bande',
      cues: ['Bande juste au-dessus des genoux', 'Debout ou allongé sur le côté : ouvre le genou sans rouler la hanche', 'Le buste ne bouge pas, seule la jambe', 'Tiens une seconde en haut'],
      err: ['Faire pivoter le bassin pour ouvrir plus', 'Aller vite : le moyen fessier se travaille lentement'],
      alt: [{ n: 'Pont fessier avec bande', por: 'plus de grand fessier' }, { n: 'Pas latéral à la bande (monster walk)', por: 'debout, plus fonctionnel' }],
      mol: 'Si le genou se plaint : place la bande plus bas, sur les tibias.'
    },
    'remo-toalla': { pat: 'th', pic: 'remo-toalla',
      nombre: 'Rowing serviette sur porte', mm: { p: ['dorsal'], s: ['biceps', 'espalda-alta'] }, zona: 'tiron', musc: ['Dorsaux', 'biceps, omoplates'], equipo: 'Serviette + porte (ou sac à dos)',
      cues: ['Serviette sur la poignée/le cadre, corps incliné en arrière', 'Tire avec le coude, pas avec la main', 'Omoplates en arrière et en bas en fin de trajet', 'Plus tu t’inclines, plus c’est dur'],
      err: ['Tirer avec les bras sans bouger les omoplates', 'Donner des à-coups avec les hanches'],
      alt: [{ n: 'Rowing avec sac à dos chargé', por: 'à une main, appuyé sur la table' }, { n: 'Rowing inversé sous une table solide', por: 'version plus dure' }],
      mol: 'Si le coude gêne : prends plus large et réduis l’inclinaison.'
    },
    'rdl-1p': { pat: 'bis', pic: 'rdl-1p',
      nombre: 'Soulevé de terre roumain à 1 jambe', mm: { p: ['isquios'], s: ['gluteo'] }, zona: 'pierna', musc: ['Ischios', 'fessier, équilibre'], equipo: 'Rien (sac à dos optionnel)',
      cues: ['Hanches en arrière, dos droit comme une table', 'La jambe libre monte derrière en contrepoids', 'Descends jusqu’à sentir l’étirement des ischios', 'Priorité à l’équilibre sur la profondeur'],
      err: ['Arrondir le dos pour descendre plus bas', 'Ouvrir la hanche (garde les deux hanches face au sol)'],
      alt: [{ n: 'Avec une main en appui sur le mur', por: 'si l’équilibre casse la série' }, { n: 'B-stance (pied arrière en appui)', por: 'étape intermédiaire' }],
      mol: 'Si les ischios tirent trop : réduis l’amplitude, pas la technique.'
    },
    'superman': { pat: 'core',
      nombre: 'Superman', mm: { p: ['lumbar'], s: ['gluteo', 'espalda-alta'] }, zona: 'core', musc: ['Lombaires', 'fessier, haut du dos'], equipo: 'Rien',
      cues: ['À plat ventre, bras devant', 'Monte bras et jambes en même temps, 2″ en haut', 'Regard vers le sol : ne tire pas sur la nuque'],
      err: ['Coup de fouet cervical en regardant devant', 'Monter en rebondissant'],
      alt: [{ n: 'Bird-dog (bras et jambe opposés)', por: 'plus de contrôle, moins de compression' }],
      mol: 'Si les lombaires gênent : passe directement au bird-dog.'
    },
    'dead-bug': { pat: 'core',
      nombre: 'Dead bug', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Core antérieur profond'], equipo: 'Rien',
      cues: ['Allongé, lombaires plaquées au sol en permanence', 'Bras et jambe opposés descendent lentement en même temps', 'Expire en étendant : les côtes restent basses'],
      err: ['Les lombaires se cambrent quand la jambe s’étend (raccourcis le trajet)', 'Aller vite'],
      alt: [{ n: 'Jambes seules (bras immobiles)', por: 'si tu perds les lombaires au sol' }],
      mol: 'C’est l’exercice le plus sûr du plan ; si quelque chose gêne, vérifie que les lombaires ne décollent pas.'
    },

    'pike-flexiones': { pat: 'ev', pic: 'pike-flexiones',
      nombre: 'Pompes piquées', mm: { p: ['hombro'], s: ['triceps'] }, zona: 'empuje', musc: ['Deltoïde antérieur', 'triceps'], equipo: 'Rien',
      cues: ['V inversé : mains et pieds rapprochés, hanches bien hautes', 'La tête descend entre les mains, pas devant', 'Coudes à 45° du corps, jamais écartés', 'En haut, extension complète sans remonter les épaules'],
      err: ['Baisser les hanches et en faire une pompe classique', 'Amener la tête devant les mains (c’est là que l’épaule paie)', 'Demi-amplitude pour en compter davantage'],
      alt: [{ n: 'Pieds sur une chaise', por: 'quand 12 deviennent faciles' }, { n: 'Mains sur une marche', por: 'si tu ne descends pas encore proprement' }],
      mol: 'Si l’épaule proteste : baisse un peu les hanches jusqu’à ce que l’angle soit confortable. La poussée verticale est ce qui demande le plus de mobilité dans tout le plan.'
    },
    'jalon-toalla': { pat: 'tv', pic: 'jalon-toalla',
      nombre: 'Tirage vertical à la serviette', mm: { p: ['dorsal'], s: ['biceps'] }, zona: 'tiron', musc: ['Grand dorsal', 'biceps'], equipo: 'Serviette',
      cues: ['Serviette tendue au-dessus de la tête : un bras tire vers le bas, l’autre résiste', 'Le coude qui tire va vers le flanc, pas vers l’avant', 'Abaisse l’omoplate et tiens 1″', 'Remonte en 3″ en freinant avec l’autre bras'],
      err: ['Tirer avec le biceps au lieu du dos', 'Hausser l’épaule au lieu d’abaisser l’omoplate', 'Ne pas résister avec le bras du haut : sans tension, pas de stimulus'],
      alt: [{ n: 'Rowing inversé sous une table solide', por: 'bien plus mesurable : si tu as une table, fais plutôt ça' }, { n: 'Tractions', por: 'dès que tu as une barre' }],
      mol: 'Sans barre, le tirage vertical est le plus difficile à remplacer honnêtement : si tu peux, privilégie le rowing sous la table, qui charge vraiment.'
    },
    'abduccion-lado': { pat: 'ais', pic: 'abduccion-lado',
      nombre: 'Abduction de hanche sur le côté', mm: { p: ['gluteo'], s: [] }, zona: 'pierna', musc: ['Moyen fessier'], equipo: 'Rien',
      cues: ['Allongé sur le côté, corps aligné, hanches perpendiculaires au sol', 'Monte la jambe du dessus, talon légèrement en arrière', 'Monte en 1″, tiens 1″, descends en 3″', 'La pointe du pied regarde devant, pas le plafond'],
      err: ['Rouler la hanche vers l’arrière (alors c’est le fléchisseur qui travaille, pas le fessier)', 'Monter la jambe plus haut que la hanche ne le permet', 'Aller vite : ici c’est le temps sous tension qui compte'],
      alt: [{ n: 'Avec un élastique au-dessus des genoux', por: 'quand 20 répétitions ne brûlent plus' }, { n: 'Clam, genoux pliés', por: 'si le bas du dos s’en mêle' }],
      mol: 'C’est aussi l’exercice de rééducation du moyen fessier : si ton genou rentre vers l’intérieur en courant ou en squattant, c’est ton assurance.'
    },
    'crunch-inverso': { pat: 'flex',
      nombre: 'Crunch inversé', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Bas des abdominaux'], equipo: 'Rien',
      cues: ['Sur le dos, mains le long du corps ou sous le sacrum', 'Amène les genoux à la poitrine en enroulant le bassin, pas en pliant seulement la hanche', 'Le bas du dos décolle d’un doigt : c’est toute l’amplitude', 'Descends en 3″ sans laisser tomber les jambes'],
      err: ['Prendre de l’élan avec les jambes', 'Cambrer le bas du dos à la descente', 'Chercher de l’amplitude en levant toute la hanche'],
      alt: [{ n: 'Relevé de jambes suspendu', por: 'quand tu auras une barre' }, { n: 'Dead bug', por: 'si le bas du dos décolle sans contrôle' }],
      mol: 'Si le bas du dos proteste : mains sous le sacrum et réduis l’amplitude de moitié le temps que le contrôle arrive.'
    },
    'curl-mochila': { pat: 'curl', pic: 'curl-mochila',
      nombre: 'Curl avec sac à dos', mm: { p: ['biceps'], s: ['antebrazo'] }, zona: 'tiron', musc: ['Biceps', 'avant-bras'], equipo: 'Sac à dos',
      cues: ['Attrape le sac par la poignée du haut ou par les deux bretelles', 'Coudes collés au corps et fixes', 'Monte sans balancer, descends en 3″', 'Tu progresses en ajoutant des livres ou des bouteilles d’eau'],
      err: ['Balancer le buste pour monter', 'Avancer les coudes en haut', 'Charger le sac au point que la prise lâche avant le biceps'],
      alt: [{ n: 'Curl auto-résisté à la serviette', por: 'sans sac : un bras monte, l’autre freine' }, { n: 'Curl avec haltères', por: 'quand tu auras du matériel' }],
      mol: 'Si le poignet proteste : attrape les deux bretelles plutôt que la poignée, ça garde le poignet neutre.'
    },

    'flexion-declinada': { pat: 'eh', pic: 'flexiones',
      nombre: 'Pompes déclinées', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Haut des pectoraux', 'épaule, triceps'], equipo: 'Rien (chaise ou canapé)',
      cues: ['Pieds sur la chaise, mains un peu plus larges que les épaules', 'Plus les pieds sont hauts, plus tu portes de poids', 'Corps en planche : fessiers et abdos serrés', 'Poitrine presque au sol à chaque répétition'],
      err: ['Casser les hanches pour se soulager', 'Réduire l’amplitude de moitié dès que les pieds montent', 'Cou tendu vers le sol'],
      alt: [{ n: 'Pompes classiques', por: 'si tu ne sors pas 8 propres ici' }, { n: 'Pieds plus hauts', por: 'la progression : chaque empan pèse davantage' }],
      mol: 'C’est la marche suivante après les pompes : passé 15 répétitions propres, monte les pieds au lieu de compter jusqu’à vingt.'
    },
    'pino-pared': { pat: 'ev', pic: 'pino-pared',
      nombre: 'Pompe en équilibre contre le mur', mm: { p: ['hombro'], s: ['triceps'] }, zona: 'empuje', musc: ['Deltoïdes', 'triceps'], equipo: 'Rien (mur)',
      cues: ['Dos au mur, remonte les pieds en marchant jusqu’à être presque vertical', 'Mains un peu plus larges que les épaules, doigts écartés qui agrippent le sol', 'Descends seulement ce que tu contrôles : deux doigts au début', 'Corps gainé : sans cambrer le bas du dos'],
      err: ['Descendre à fond dès le premier jour : on commence avec une amplitude courte', 'Laisser tomber la tête sans contrôle', 'Cambrer le dos pour compenser'],
      alt: [{ n: 'Pompes piquées', por: 'la version de départ, bien plus douce' }, { n: 'Pieds sur une chaise plutôt qu’au mur', por: 'l’étape intermédiaire' }],
      mol: 'C’est la variante avancée de la poussée verticale : seulement si les pompes piquées sortent à 15 propres et que l’épaule ne dit rien. Avec une gêne d’épaule, ce n’est pas le moment.'
    },
    'remo-mesa': { pat: 'th', pic: 'remo-mesa',
      nombre: 'Rowing inversé sous la table', mm: { p: ['dorsal'], s: ['biceps', 'espalda-alta'] }, zona: 'tiron', musc: ['Grand dorsal', 'haut du dos, biceps'], equipo: 'Rien (table solide)',
      cues: ['Allonge-toi sous une table solide et attrape-la par le bord', 'Corps en planche des talons aux épaules', 'Tire en amenant la poitrine à la table, coudes au corps', 'Serre les omoplates 1″ en haut et descends en 3″'],
      err: ['Sortir les hanches avant la poitrine', 'Tirer avec les bras seuls sans serrer les omoplates', 'Utiliser une table qui se soulève : vérifie-la avant'],
      alt: [{ n: 'Genoux pliés, pieds au sol', por: 'la version facile' }, { n: 'Pieds sur une chaise', por: 'la progression : plus horizontal, plus lourd' }],
      mol: 'C’est le tirage qui charge vraiment sans barre : si tu as une table solide, préfère-le au tirage à la serviette.'
    },
    'pistol-asistida': { pat: 'rod', pic: 'sentadilla-pc',
      nombre: 'Squat sur une jambe assisté', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadriceps', 'fessier'], equipo: 'Rien (chaise)',
      cues: ['Debout dos à une chaise, un pied au sol, l’autre tendu devant', 'Descends en 3″ jusqu’à effleurer la chaise, puis remonte sans t’asseoir', 'Genou aligné avec le pied, jamais vers l’intérieur', 'Bras devant en contrepoids'],
      err: ['Se laisser tomber sur la chaise et rebondir', 'Genou qui rentre (c’est là que ça se paie)', 'Talon qui décolle : descends moins jusqu’à ce que la cheville suive'],
      alt: [{ n: 'Squat au poids du corps sur deux jambes', por: 'la version de départ' }, { n: 'Une chaise plus basse', por: 'la progression, jusqu’au pistol complet' }],
      mol: 'Si le genou proteste : remonte la hauteur de la chaise et freine la descente. C’est une progression de squat, pas un saut dans le vide : 8 répétitions propres à deux jambes avant d’essayer sur une.'
    },
    'curl-toalla': { pat: 'curl', pic: 'curl-toalla',
      nombre: 'Curl auto-résisté à la serviette', mm: { p: ['biceps'], s: ['antebrazo'] }, zona: 'tiron', musc: ['Biceps', 'avant-bras'], equipo: 'Serviette',
      cues: ['Un pied bloque un bout de la serviette, la main remonte l’autre', 'Le bras libre peut tirer vers le bas pour ajouter de la résistance', 'Coude collé au corps et fixe', 'Monte en 2″, descends en 3″ sans lâcher la tension'],
      err: ['Relâcher la tension en haut ou en bas', 'Balancer le buste', 'Mettre tant de résistance que le mouvement se bloque à mi-chemin'],
      alt: [{ n: 'Curl avec sac à dos', por: 'plus mesurable : tu peux peser ce que tu mets' }, { n: 'Curl avec haltères', por: 'quand tu auras du matériel' }],
      mol: 'Sans rien à la maison, c’est le remplaçant du curl : il ne se mesure pas en kilos, il se mesure à la durée de la descente.'
    },

    'zancada-bulgara-pc': { pat: 'zan', pic: 'zancada-pc',
      nombre: 'Fente bulgare au poids du corps', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadriceps', 'fessier'], equipo: 'Rien (chaise)',
      cues: ['Dessus du pied arrière sur la chaise, pied avant à une grande enjambée', 'Descends droit, genou arrière vers le sol', 'Le poids vit dans le talon avant', 'Descends en 3″ et remonte sans rebondir'],
      err: ['Pied avant trop près (le genou part devant et paie)', 'Se pencher en avant pour y arriver', 'Rebondir en bas avec le genou arrière'],
      alt: [{ n: 'Fentes alternées sur place', por: 'la version de départ' }, { n: 'Avec un sac à dos chargé', por: 'la progression quand 12 deviennent faciles' }],
      mol: 'Si le genou proteste : éloigne le pied avant d’un empan et descends moins. C’est l’un des meilleurs mouvements de jambes sans matériel, mais il demande de l’équilibre : tiens-toi au mur les premières fois.'
    },
    'puente-1p': { pat: 'bis', pic: 'puente',
      nombre: 'Pont fessier sur une jambe', mm: { p: ['gluteo'], s: ['isquios'] }, zona: 'pierna', musc: ['Grand fessier', 'ischio-jambiers'], equipo: 'Rien',
      cues: ['Allongé, un pied au sol et l’autre jambe tendue devant', 'Monte en poussant par le talon jusqu’à aligner hanche et cuisse', 'Serre le fessier 2″ en haut, sans cambrer', 'Descends en 3″ sans reposer complètement'],
      err: ['Monter en cambrant le dos au lieu de serrer le fessier', 'Hanche qui tombe d’un côté', 'Poser le pied si loin que l’ischio prend le relais'],
      alt: [{ n: 'Pont sur deux pieds', por: 'la version de départ' }, { n: 'Épaules sur le canapé', por: 'plus d’amplitude, plus de fessier' }],
      mol: 'Si le bas du dos s’en mêle : rapproche le talon du fessier et monte moins haut. La hanche ne doit pas tourner : si elle tombe d’un côté, reviens à deux jambes.'
    },
    'elev-piernas-suelo': { pat: 'flex',
      nombre: 'Relevé de jambes allongé', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Bas des abdominaux'], equipo: 'Rien',
      cues: ['Sur le dos, mains sous le sacrum et bas du dos collé au sol', 'Monte les jambes tendues à la verticale', 'Descends en 3″ et arrête-toi là où le bas du dos commence à décoller', 'Ce point est ton amplitude : il descendra chaque semaine'],
      err: ['Laisser le bas du dos se cambrer à la descente (l’erreur qui blesse)', 'Prendre de l’élan avec les jambes', 'Descendre plus bas que ce que les abdos tiennent'],
      alt: [{ n: 'Crunch inversé', por: 'la version de départ' }, { n: 'Relevé de jambes suspendu', por: 'quand tu auras une barre' }],
      mol: 'C’est la progression du crunch inversé : si le bas du dos décolle, plie un peu les genoux et raccourcis l’amplitude jusqu’à ce que ça tienne.'
    },
    'elev-talon-1p': { pat: 'gem',
      nombre: 'Extension du mollet sur une jambe', mm: { p: ['gemelos'], s: [] }, zona: 'pierna', musc: ['Mollet et soléaire'], equipo: 'Rien (marche)',
      cues: ['Demi-plante sur le bord d’une marche, l’autre jambe repliée', 'Descends le talon au maximum et tiens 1″ en bas', 'Monte à la verticale, pause d’1″ en haut : pas de rebond', 'Appuie-toi au mur seulement pour l’équilibre'],
      err: ['Rebondir sur le réflexe du tendon : ça enlève justement le stimulus recherché', 'Demi-amplitude', 'Charger le poids sur la main qui s’appuie'],
      alt: [{ n: 'Extension des mollets sur deux jambes', por: 'la version de départ' }, { n: 'Avec un sac à dos chargé', por: 'quand 20 par jambe deviennent faciles' }],
      mol: 'Si l’Achille gêne : uniquement des isométriques en haut, 3×30″ cette semaine. C’est l’assurance tendon pour la course : ne le saute pas.'
    },
    'plancha-lateral': { pat: 'core',
      nombre: 'Planche latérale', mm: { p: ['abdomen'], s: ['gluteo'] }, zona: 'core', musc: ['Obliques', 'moyen fessier'], equipo: 'Rien',
      cues: ['Coude sous l’épaule, corps aligné de la cheville à la tête', 'Monte la hanche et tiens-LA : le sol ne la touche pas', 'Épaule loin de l’oreille', 'Tiens le temps prévu de chaque côté'],
      err: ['Hanche qui s’affaisse (l’oblique arrête de travailler)', 'Rouler la poitrine vers le sol', 'Bloquer la respiration'],
      alt: [{ n: 'Sur les genoux', por: 'la version de départ' }, { n: 'Jambe du dessus levée', por: 'la progression, qui demande en plus du moyen fessier' }],
      mol: 'Si l’épaule proteste : monte sur la main bras tendu, ou fais-la à genoux. C’est la moitié latérale de la planche : le gainage ne tient pas que de face.'
    },

    'elev-y-suelo': { pat: 'ais', pic: 'elev-y-suelo',
      nombre: 'Élévation en Y au sol', mm: { p: ['hombro'], s: ['espalda-alta'] }, zona: 'empuje', musc: ['Épaule (coiffe)', 'trapèze inférieur'], equipo: 'Rien',
      cues: ['À plat ventre, bras tendus en Y, pouces vers le plafond', 'Monte les bras sans hausser les épaules : la nuque reste longue', 'Tiens 2″ en haut et descends en 3″', 'Le front ne décolle pas : le mouvement vient de l’omoplate, pas du cou'],
      err: ['Hausser les épaules vers les oreilles', 'Lever la tête pour s’aider', 'Aller vite : il n’y a pas de poids ici, le stimulus c’est le contrôle'],
      alt: [{ n: 'Rotation externe à l’élastique', por: 'quand tu auras un élastique' }, { n: 'Une petite bouteille dans chaque main', por: 'la progression : ça pèse peu et ça se sent' }],
      mol: 'L’épaule du protocole tendon, sans matériel : la coiffe gagne avec du contrôle, pas avec du poids. Si l’épaule gêne, celui-ci passe bien en général.'
    },
    'curl-nordico': { pat: 'ais', pic: 'curl-nordico',
      nombre: 'Leg curl nordique assisté', mm: { p: ['isquios'], s: [] }, zona: 'pierna', musc: ['Ischio-jambiers'], equipo: 'Rien (de quoi bloquer les chevilles)',
      cues: ['À genoux sur quelque chose de doux, chevilles bloquées sous un meuble solide', 'Descends très lentement en gardant hanches et épaules alignées', 'Tiens aussi loin que possible et amortis avec les mains', 'Remonte en poussant avec les bras : la montée ne compte pas'],
      err: ['Casser la hanche pour se faciliter la tâche (l’ischio arrête de travailler)', 'Se laisser tomber sans freiner', 'Commencer par l’amplitude complète : ça se gagne centimètre par centimètre'],
      alt: [{ n: 'Pont fessier sur une jambe', por: 'si le nordique est encore trop dur' }, { n: 'Leg curl à la machine', por: 'en salle' }],
      mol: 'Le travail d’ischios le plus puissant sans matériel, et celui qui laisse le plus de courbatures : commence à 3 et monte une par une. Si le genou gêne, serviette pliée dessous.'
    },
    'encogimiento-mochila': { pat: 'ais', pic: 'encogimiento-mochila',
      nombre: 'Shrugs avec sac à dos', mm: { p: ['espalda-alta'], s: ['antebrazo'] }, zona: 'tiron', musc: ['Trapèze supérieur'], equipo: 'Sac à dos',
      cues: ['Sac suspendu aux deux mains ou serré contre la poitrine', 'Monte les épaules droit vers les oreilles, sans les rouler', 'Serre 2″ en haut et descends en contrôlant', 'Nuque détendue : ne pousse pas le menton en avant'],
      err: ['Rouler les épaules en arrière (ça n’apporte rien et charge le cou)', 'Prendre de l’élan avec les jambes', 'Demi-amplitude'],
      alt: [{ n: 'Shrugs avec haltères', por: 'quand tu auras du matériel' }, { n: 'Un sac plus chargé', por: 'la progression : ici tu peux peser ce que tu mets' }],
      mol: 'Si tu le sens dans le cou : baisse la charge et monte moins. Le trapèze supérieur travaille déjà beaucoup au quotidien ; deux séries bien faites suffisent.'
    },

    /* — Salle : poussée — */
    'press-banca': { pat: 'eh',
      nombre: 'Développé couché', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Pectoraux', 'triceps, deltoïde antérieur'], equipo: 'Barre + banc',
      cues: ['Omoplates rétractées et vissées au banc, pieds ancrés au sol', 'Prise : avant-bras vertical quand la barre touche la poitrine', 'La barre descend au milieu de la poitrine, coudes ~45°', 'Touche la poitrine avec contrôle et pousse en ligne légèrement diagonale'],
      err: ['Épaules qui haussent en poussant (tu perds la rétraction)', 'Faire rebondir la barre sur la poitrine', 'Fesses décollées du banc', 'Poignets cassés en arrière'],
      alt: [{ n: 'Développé à la machine (chest press)', por: 'jours sans envie de monter un banc ou salle bondée' }, { n: 'Développé couché haltères', por: 'plus d’amplitude et moins d’épaule' }],
      mol: 'Si l’épaule gêne : essaie une prise un peu plus serrée et des coudes plus rentrés ; si ça persiste, haltères en prise neutre.'
    },
    'press-inclinado-mc': { pat: 'eh',
      nombre: 'Développé incliné haltères', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Haut des pectoraux', 'épaules, triceps'], equipo: 'Haltères + banc 30°',
      cues: ['Banc à 30° (un cran, pas la verticale)', 'Descends jusqu’à sentir l’étirement du pectoral', 'Coudes à 45-60°, poignets neutres', 'Monte sans entrechoquer les haltères en haut'],
      err: ['Banc trop vertical (ça devient un développé épaules)', 'Rebondir en bas', 'Cambrer exagérément les lombaires'],
      alt: [{ n: 'Développé incliné à la Smith machine', por: 'si la salle est pleine ou pour plus de stabilité' }, { n: 'Développé incliné barre', por: 'déjà programmé dans le Push B de P4' }],
      mol: 'Si l’épaule gêne : réduis l’amplitude en bas de 5 cm et tourne légèrement les paumes vers l’intérieur.'
    },
    'press-inclinado-barra': { pat: 'eh',
      nombre: 'Développé incliné barre', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Haut des pectoraux', 'épaules, triceps'], equipo: 'Barre + banc incliné',
      cues: ['Banc à 30-45°, omoplates vissées', 'La barre descend sur le haut de la poitrine (clavicules)', 'Avant-bras verticaux au contact'],
      err: ['Descendre la barre au milieu de la poitrine (ça t’oblige à ouvrir les coudes)', 'Rebondir'],
      alt: [{ n: 'Smith machine inclinée', por: 'même séance, plus de guidage' }, { n: 'Haltères inclinés', por: 's’il n’y a pas de banc incliné avec supports' }],
      mol: 'Si l’épaule gêne : reviens aux haltères, qui permettent de tourner la prise.'
    },
    'press-plano-mc': { pat: 'eh',
      nombre: 'Développé couché haltères', mm: { p: ['pecho'], s: ['triceps'] }, zona: 'empuje', musc: ['Pectoraux', 'triceps'], equipo: 'Haltères + banc',
      cues: ['Plus d’amplitude qu’à la barre : profites-en en bas avec contrôle', 'Monte en arc de cercle, sans entrechoquer en haut', 'Pieds ancrés, omoplates en arrière'],
      err: ['Laisser tomber les haltères en bas sans freiner', 'Le transformer en développé épaules en ouvrant trop les coudes'],
      alt: [{ n: 'Machine à développé', por: 'grosse fatigue ou pas de banc libre' }],
      mol: 'Si l’épaule gêne : prise neutre (paumes face à face).'
    },
    'press-militar': { pat: 'ev',
      nombre: 'Développé militaire', mm: { p: ['hombro'], s: ['triceps', 'abdomen'] }, zona: 'empuje', musc: ['Épaules', 'triceps, core'], equipo: 'Barre (debout ou assis)',
      cues: ['Debout : fessier et abdos serrés avant de pousser', 'La barre part du menton et monte collée au visage', 'La tête « passe par la fenêtre » à la fin', 'Assis avec dossier : sans cambrer les lombaires'],
      err: ['Cambrer les lombaires pour le transformer en développé incliné', 'Pousser la barre vers l’avant (elle heurte le menton)', 'Amplitude incomplète en haut'],
      alt: [{ n: 'Développé militaire haltères assis', por: 'déjà programmé en P2 ; plus doux pour l’épaule' }, { n: 'Développé épaules à la machine', por: 'dernière séance de la semaine avec de la fatigue' }],
      mol: 'Si l’épaule gêne : haltères en prise neutre et monte seulement jusqu’où il n’y a pas de pincement.'
    },
    'press-militar-mc': { pat: 'ev',
      nombre: 'Développé militaire haltères assis', mm: { p: ['hombro'], s: ['triceps'] }, zona: 'empuje', musc: ['Épaules', 'triceps'], equipo: 'Haltères + banc à dossier',
      cues: ['Dossier haut, lombaires en appui sans cambrer', 'Coudes légèrement devant le corps, pas en croix', 'Amplitude complète sans entrechoquer en haut'],
      err: ['Cambrer les lombaires en les décollant du dossier', 'Ne descendre que jusqu’aux oreilles'],
      alt: [{ n: 'Machine à développé épaules', por: 'équivalent direct' }],
      mol: 'Si l’épaule gêne : prise neutre et descends seulement jusqu’à 90° de coude.'
    },
    'elev-laterales': { pat: 'ev', pic: 'elev-laterales',
      nombre: 'Élévations latérales', mm: { p: ['hombro'], s: [] }, zona: 'empuje', musc: ['Deltoïde latéral'], equipo: 'Haltères',
      cues: ['Poids léger, coudes un peu fléchis', 'Monte jusqu’à l’horizontale, comme pour servir deux carafes', 'Sans élan : si tu balances, il y a trop de poids', 'Descends en 2″'],
      err: ['Monter avec le trapèze en haussant les épaules', 'Dépasser l’horizontale', 'Balancement des hanches'],
      alt: [{ n: 'Latérales à la poulie basse', por: 'tension continue ; programmées dans le Push B' }, { n: 'Machine à élévations latérales', por: 'pour finir sans penser à la technique' }],
      mol: 'Si l’épaule gêne : pouce légèrement vers le haut et monte 10° en avant du plan latéral.'
    },
    'laterales-polea': { pat: 'ev',
      nombre: 'Élévations latérales à la poulie', mm: { p: ['hombro'], s: [] }, zona: 'empuje', musc: ['Deltoïde latéral'], equipo: 'Poulie basse',
      cues: ['Poulie à hauteur du poignet bras relâché', 'Corps stable, monte jusqu’à l’horizontale', 'La poulie garde la tension aussi en bas : profites-en'],
      err: ['Se placer trop loin de la poulie', 'Tirer avec le trapèze'],
      alt: [{ n: 'Haltères', por: 'si les poulies sont prises' }],
      mol: 'Comme avec les haltères : pouce vers le haut et plan légèrement avancé.'
    },
    'fondos': { pat: 'ev', pic: 'fondos',
      nombre: 'Dips assistés', mm: { p: ['pecho'], s: ['triceps'] }, zona: 'empuje', musc: ['Bas des pectoraux', 'triceps'], equipo: 'Machine à dips assistés ou élastiques',
      cues: ['Corps légèrement penché en avant (plus de pecs)', 'Descends jusqu’à 90° de coude, pas plus si l’épaule proteste', 'Coudes qui ne s’ouvrent pas en croix'],
      err: ['Descendre trop profond', 'Épaules haussées vers les oreilles'],
      alt: [{ n: 'Développé décliné ou dips entre bancs', por: 's’il n’y a pas de machine assistée' }],
      mol: 'Si le sternum ou l’épaule gêne : remplace par du développé couché haltères.'
    },
    'ext-triceps-polea': { pat: 'ext',
      nombre: 'Extension triceps à la poulie', mm: { p: ['triceps'], s: [] }, zona: 'empuje', musc: ['Triceps'], equipo: 'Poulie haute + corde ou barre',
      cues: ['Coudes collés au corps, fixes', 'Seul l’avant-bras bouge', 'Étends à fond et serre 1″'],
      err: ['Coudes qui avancent en descendant (tu mets de l’épaule)', 'Balancement du buste'],
      alt: [{ n: 'À la corde en écartant en bas', por: 'un peu plus de chef long' }, { n: 'Kickback triceps avec haltère', por: 'sans poulie libre' }],
      mol: 'Si le coude gêne : baisse le poids et monte les reps à 15-20 ; le coude déteste l’ego.'
    },
    'ext-triceps-cabeza': { pat: 'ext',
      nombre: 'Extension nuque à la corde', mm: { p: ['triceps'], s: [] }, zona: 'empuje', musc: ['Triceps (chef long)'], equipo: 'Poulie + corde',
      cues: ['Dos à la poulie, corde derrière la nuque', 'Coudes pointés vers l’avant, étends vers le haut', 'Vrai étirement en bas : c’est là que le chef long grandit'],
      err: ['Ouvrir les coudes en croix', 'Amplitude courte par excès de poids'],
      alt: [{ n: 'Barre au front avec barre EZ', por: 'même schéma, allongé' }],
      mol: 'Si le coude gêne : comme à la poulie classique — moins de poids, plus de reps.'
    },
    'press-frances': { pat: 'ext',
      nombre: 'Barre au front', mm: { p: ['triceps'], s: [] }, zona: 'empuje', musc: ['Triceps (chef long)'], equipo: 'Barre EZ + banc',
      cues: ['Allongé, la barre descend vers le front ou un peu derrière', 'Coudes pointés au plafond, immobiles', 'Descends en 2-3″, étends sans verrouiller d’un coup'],
      err: ['Coudes qui s’ouvrent', 'Le transformer en développé serré en bougeant l’épaule'],
      alt: [{ n: 'Extension nuque à la poulie', por: 'plus de tension continue, moins de stress au coude' }],
      mol: 'Si le coude gêne : remplace directement par des extensions à la poulie à 15 reps.'
    },

    /* — Salle : tirage — */
    'remo-barra': { pat: 'th',
      nombre: 'Rowing barre', mm: { p: ['dorsal'], s: ['biceps', 'espalda-alta'] }, zona: 'tiron', musc: ['Dorsaux', 'milieu du dos, biceps'], equipo: 'Barre',
      cues: ['Buste à ~45°, genoux semi-fléchis', 'Tire la barre vers le bas de l’abdomen', 'Omoplates en arrière et en bas à la fin', 'Dos neutre non négociable'],
      err: ['Donner des à-coups avec les lombaires (tu te balances)', 'Buste qui se redresse rep après rep', 'Tirer vers la poitrine avec les coudes ouverts'],
      alt: [{ n: 'Rowing T-bar', por: 'variante plus stable' }, { n: 'Rowing machine avec appui poitrine', por: 'si les lombaires sont chargées du jour jambes' }],
      mol: 'Si les lombaires protestent : machine avec appui poitrine ou rowing à la poulie, sans hésiter.'
    },
    'remo-polea': { pat: 'th',
      nombre: 'Rowing assis à la poulie', mm: { p: ['espalda-alta'], s: ['biceps', 'dorsal'] }, zona: 'tiron', musc: ['Milieu du dos', 'dorsaux, biceps'], equipo: 'Poulie basse + triangle',
      cues: ['Poitrine haute et fixe : le buste ne voyage pas', 'Tire le triangle vers le nombril', 'Pause 1″ en serrant les omoplates'],
      err: ['Balancer le buste pour bouger plus lourd', 'Épaules haussées'],
      alt: [{ n: 'Rowing machine', por: 'équivalent direct' }],
      mol: 'Si les lombaires gênent : appuie la poitrine sur une machine à rowing avec support.'
    },
    'remo-mancuerna': { pat: 'th',
      nombre: 'Rowing haltère à 1 bras', mm: { p: ['dorsal'], s: ['espalda-alta'] }, zona: 'tiron', musc: ['Dorsaux', 'milieu du dos'], equipo: 'Haltère + banc',
      cues: ['Genou et main sur le banc, dos neutre', 'Tire le coude vers la hanche, pas vers l’épaule', 'Sans tourner le buste en montant'],
      err: ['Hausser l’épaule au départ du tirage', 'Faire pivoter le torse pour « aider »', 'Amplitude courte'],
      alt: [{ n: 'Rowing à la poulie à 1 bras', por: 'tension plus constante' }],
      mol: 'Sans bon appui, les lombaires trinquent : utilise un banc incliné et pose la poitrine.'
    },
    'jalon-pecho': { pat: 'tv',
      nombre: 'Tirage vertical', mm: { p: ['dorsal'], s: ['biceps'] }, zona: 'tiron', musc: ['Dorsaux', 'biceps'], equipo: 'Poulie haute',
      cues: ['Prise un peu plus large que les épaules', 'Poitrine haute, légère inclinaison arrière fixe', 'Tire les coudes vers les poches', 'Barre à la clavicule, 1″ de pause'],
      err: ['Se balancer pour donner l’à-coup', 'Tirer avec les bras sans abaisser les omoplates', 'Barre derrière la nuque (non)'],
      alt: [{ n: 'Tractions assistées', por: 'l’objectif de la P3 est de migrer vers elles' }, { n: 'Tirage prise serrée', por: 'programmé dans le Pull B' }],
      mol: 'Si l’épaule gêne : prise neutre (triangle large) et baisse le poids.'
    },
    'jalon-estrecho': { pat: 'tv',
      nombre: 'Tirage vertical prise serrée', mm: { p: ['dorsal'], s: ['biceps'] }, zona: 'tiron', musc: ['Dorsaux', 'biceps'], equipo: 'Poulie haute + triangle',
      cues: ['Triangle ou prise supination à largeur d’épaules', 'Coudes serrés qui descendent le long du corps', 'Étire tout en haut : le dorsal travaille allongé'],
      err: ['Le transformer en rowing en se penchant trop', 'Demi-répétition en haut'],
      alt: [{ n: 'Tractions supination assistées', por: 'équivalent au poids du corps' }],
      mol: 'Si le coude gêne : prise neutre et poignets droits.'
    },
    'dominadas': { pat: 'tv',
      nombre: 'Tractions (assistées → libres → lestées)', mm: { p: ['dorsal'], s: ['biceps', 'abdomen'] }, zona: 'tiron', musc: ['Dorsaux', 'biceps, core'], equipo: 'Barre + machine assistée ou élastiques',
      cues: ['Commence en abaissant les omoplates (épaules loin des oreilles)', 'Tire les coudes vers le bas, menton au-dessus de la barre', 'Descends en contrôlant jusqu’aux bras presque tendus', 'Réduis l’assistance semaine après semaine : elles sortiront plus tôt que tu ne crois'],
      err: ['Gigoter et se donner de l’élan', 'Demi-traction (ni en haut ni en bas)', 'Se suspendre sur les épaules en bas sans tension scapulaire'],
      alt: [{ n: 'Tirage vertical pronation lourd', por: 's’il n’y a pas de machine assistée ce jour-là' }, { n: 'Tractions négatives (saut + descente 5″)', por: 'grand bâtisseur de la première traction' }],
      mol: 'Si le coude gêne : prise neutre. Si l’épaule gêne : ne reste pas suspendu passif en bas.',
      hito: 'dominada-libre'
    },
    'pullover-polea': { pat: 'tv',
      nombre: 'Pullover à la poulie', mm: { p: ['dorsal'], s: [] }, zona: 'tiron', musc: ['Dorsaux (isolés)'], equipo: 'Poulie haute + barre ou corde',
      cues: ['Bras presque tendus, charnière uniquement à l’épaule', 'Amène la barre à la cuisse en dessinant un arc', 'Étirement en haut, contraction en bas'],
      err: ['Plier les coudes (ça devient une extension triceps)', 'Balancer le buste'],
      alt: [{ n: 'Pullover haltère sur banc', por: 'sans poulie libre' }],
      mol: 'Si l’épaule gêne : réduis l’arc en haut.'
    },
    'face-pull': { pat: 'tv',
      nombre: 'Face pull', mm: { p: ['hombro'], s: ['espalda-alta'] }, zona: 'tiron', musc: ['Deltoïde postérieur', 'rotateurs, trapèze moyen'], equipo: 'Poulie haute + corde',
      cues: ['Poulie à hauteur du visage', 'Tire la corde vers le front en écartant les extrémités', 'À la fin, tourne les épaules vers l’extérieur (les biceps pointent au plafond)', 'Léger et parfait : c’est de la santé d’épaule, pas de l’ego'],
      err: ['Le transformer en rowing haut avec du poids', 'Sans rotation externe finale'],
      alt: [{ n: 'Écartés inversés à la machine (reverse pec-deck)', por: 'deltoïde postérieur sans corde' }, { n: 'Rotation externe avec élastique', por: 'à la maison ou en extra' }],
      mol: 'C’est l’exercice qui répare les épaules ; si ça gêne, baisse le poids et vérifie que tu tires vers le front, pas vers le cou.'
    },
    'encogimientos': { pat: 'ais',
      nombre: 'Shrugs haltères', mm: { p: ['espalda-alta'], s: [] }, zona: 'tiron', musc: ['Trapèze supérieur'], equipo: 'Haltères',
      cues: ['Épaules vers les oreilles, pause 1″ en haut', 'Bras comme des cordes : ne plie pas les coudes', 'Descends contrôlé et étire'],
      err: ['Rouler les épaules en cercle (ça n’apporte rien et ça frotte)', 'Rebondir avec les jambes'],
      alt: [{ n: 'À la barre', por: 'plus de charge totale' }],
      mol: 'Si le cou gêne : regarde devant et ne rentre pas le menton.'
    },


    /* — Salle : jambes/hanches — */
    'sentadilla-barra': { pat: 'rod',
      nombre: 'Squat barre', mm: { p: ['cuadriceps'], s: ['abdomen', 'gluteo'] }, zona: 'pierna', musc: ['Quadriceps', 'fessier, core'], equipo: 'Barre + rack',
      cues: ['Barre sur le trapèze, pas sur les cervicales', 'Core pressurisé avant de descendre (prends l’air dans la poitrine et le ventre)', 'Descends au parallèle, genoux vers l’extérieur', 'Pousse le sol, poitrine haute en remontant'],
      err: ['Talons qui décollent (la faute aux chevilles : surélève les talons avec des disques s’il le faut)', 'Genoux qui rentrent vers l’intérieur en remontant', 'Good morning : les hanches montent avant la poitrine'],
      alt: [{ n: 'Squat à la Smith machine', por: 'jours de fatigue ou rack occupé' }, { n: 'Hack squat / presse', por: 'stimulus quadriceps sans charge axiale' }, { n: 'Goblet squat avec haltère', por: 'en échauffement ou si la technique se perd' }],
      mol: 'Genou : descends en 3″ et reste 5 cm au-dessus du point douloureux. Lombaires : revois la pressurisation et baisse le poids de 20% une semaine.'
    },
    'prensa': { pat: 'rod',
      nombre: 'Presse à cuisses', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadriceps', 'fessier'], equipo: 'Machine à presse',
      cues: ['Pieds à mi-hauteur du plateau, largeur d’épaules', 'Descends jusqu’à 90° sans décoller les lombaires du dossier', 'Pousse avec toute la plante, ne verrouille pas les genoux d’un coup'],
      err: ['Descendre au point que le bassin bascule (butt wink à la presse = lombaires)', 'Mains qui poussent sur les genoux'],
      alt: [{ n: 'Hack squat', por: 'encore plus de quadriceps' }, { n: 'Presse à une jambe', por: 's’il y a un déséquilibre' }],
      mol: 'Si le genou gêne : pieds un peu plus hauts sur le plateau (plus de fessier, moins de genou).'
    },
    'rdl-barra': { pat: 'bis',
      nombre: 'Soulevé de terre roumain', mm: { p: ['isquios'], s: ['gluteo', 'lumbar'] }, zona: 'pierna', musc: ['Ischios', 'fessier, lombaires en isométrique'], equipo: 'Barre',
      cues: ['Hanches en arrière, genoux semi-fléchis fixes', 'Barre collée aux jambes sur tout le trajet', 'Dos neutre : poitrine fière', 'Descends jusqu’à sentir l’étirement fort des ischios et remonte en serrant le fessier'],
      err: ['Arrondir le dos pour descendre plus bas', 'Plier les genoux et le transformer en demi-squat', 'Barre qui s’éloigne du corps'],
      alt: [{ n: 'RDL haltères', por: 'prise plus confortable les premières semaines' }, { n: 'Hyperextensions 45° lestées', por: 'ischios-fessiers sans contrainte de prise' }],
      mol: 'L’étirement des ischios est le signe que tu le fais bien. Si les lombaires gênent (pas les ischios) : baisse de 20% et filme une série de profil.'
    },
    'hip-thrust': { pat: 'bis',
      nombre: 'Hip thrust', mm: { p: ['gluteo'], s: ['isquios'] }, zona: 'pierna', musc: ['Fessier', 'ischios'], equipo: 'Barre + banc (+ protection)',
      cues: ['Haut du dos en appui sur le banc, barre sur les hanches avec protection', 'Menton rentré, regard vers l’avant-bas', 'Monte jusqu’à l’horizontale exacte, pause 1″ en serrant', 'Genoux à 90° en haut, talons sous les genoux'],
      err: ['Cambrer les lombaires en haut (hyperextension)', 'Pousser avec la pointe des pieds', 'Rebondir en bas sans pause'],
      alt: [{ n: 'Machine à hip thrust', por: 'si la salle en a une, installation bien plus rapide' }, { n: 'Pont avec barre au sol', por: 'sans banc libre' }],
      mol: 'Si les lombaires gênent : c’est presque toujours l’hyperextension en haut ; arrête-toi à l’horizontale.'
    },
    'zancada-mc': { pat: 'zan',
      nombre: 'Fentes haltères', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadriceps', 'fessier'], equipo: 'Haltères',
      cues: ['Même technique qu’à la maison, maintenant avec 6-10 kg par main', 'Grand pas, buste vertical, le genou arrière frôle le sol', 'Les haltères pendent collés au corps, épaules en arrière', 'Pousse dans le talon avant pour revenir'],
      err: ['Pas court qui écrase le genou avant', 'Se pencher en avant avec la fatigue', 'Regarder le sol et perdre la ligne'],
      alt: [{ n: 'Fentes arrière haltères', por: 'plus douces pour le genou' }, { n: 'Fentes à la Smith machine', por: 'si l’équilibre limite la charge' }],
      mol: 'Si le genou gêne : pas plus long et passe aux fentes arrière.'
    },
    'zancada-bulgara': { pat: 'zan',
      nombre: 'Fentes bulgares', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadriceps', 'fessier'], equipo: 'Banc + haltères',
      cues: ['Pied arrière sur le banc, l’avant à un grand pas', 'Descends vertical : le genou arrière cherche le sol', 'Buste légèrement penché = plus de fessier ; vertical = plus de quadriceps', 'Commence uniquement au poids du corps, sérieusement'],
      err: ['Pied avant trop proche (le genou trinque)', 'Rebondir en bas', 'Perdre l’équilibre en regardant le plafond'],
      alt: [{ n: 'Fente statique haltères', por: 'si l’équilibre n’est pas encore là' }, { n: 'Presse à une jambe', por: 'unilatéral sans équilibre' }],
      mol: 'Si le genou avant gêne : allonge le pas et penche le buste un peu en avant.'
    },
    'ext-cuadriceps': { pat: 'rod',
      nombre: 'Leg extension', mm: { p: ['cuadriceps'], s: [] }, zona: 'pierna', musc: ['Quadriceps (isolés)'], equipo: 'Machine',
      cues: ['Genou aligné avec l’axe de la machine', 'Étends à fond avec pause 1″ en haut', 'Descends en 2-3″'],
      err: ['Donner des coups de pied avec élan', 'Fesses qui décollent du siège'],
      alt: [{ n: 'Sissy squat assisté', por: 'sans machine' }],
      mol: 'Si la rotule gêne : coupe le dernier tiers EN haut, pas en bas, et tempo plus lent. C’est aussi ton exercice de rééducation si un jour le genou proteste après le footing.'
    },
    'curl-femoral-tumbado': { pat: 'ais',
      nombre: 'Leg curl allongé', mm: { p: ['isquios'], s: [] }, zona: 'pierna', musc: ['Ischios (isolés)'], equipo: 'Machine',
      cues: ['Hanches plaquées au banc en permanence', 'Monte en 1″, descends en 2-3″', 'Pointe du pied neutre'],
      err: ['Lever les hanches pour aider', 'Demi-répétition'],
      alt: [{ n: 'Leg curl assis', por: 'en fait un peu meilleur pour les ischios ; utilise-le s’il est libre' }, { n: 'Curl nordique assisté', por: 'version avancée, pour plus tard' }],
      mol: 'Si crampe : étire les ischios entre les séries, c’est normal les premières semaines.'
    },
    'curl-femoral-sentado': { pat: 'ais',
      nombre: 'Leg curl assis', mm: { p: ['isquios'], s: [] }, zona: 'pierna', musc: ['Ischios (isolés)'], equipo: 'Machine',
      cues: ['Cuisse bien calée par le coussin', 'Fléchis à fond, pause 1″', 'Reviens lentement en résistant'],
      err: ['Fesses qui glissent vers l’avant', 'Amplitude courte par excès de poids'],
      alt: [{ n: 'Leg curl allongé', por: 'équivalent' }],
      mol: 'Pas d’incident typique : c’est l’un des plus sûrs du plan.'
    },
    'gemelo-pie': { pat: 'gem',
      nombre: 'Mollets debout', mm: { p: ['gemelos'], s: [] }, zona: 'pierna', musc: ['Mollet (gastrocnémien)'], equipo: 'Machine ou Smith machine + marche',
      cues: ['Pause 1″ EN haut et 1″ EN bas : sans rebond', 'Étirement complet en bas', 'Monte vertical, sans plier les genoux'],
      err: ['Rebondir en exploitant le réflexe du tendon (ça vole le stimulus au tissu qu’on veut justement préparer)', 'Demi-amplitude'],
      alt: [{ n: 'À la presse', por: 'sans machine dédiée' }],
      mol: 'Si l’Achille gêne : uniquement des isométriques en haut 3×30″ cette semaine-là.'
    },
    'gemelo-sentado': { pat: 'gem',
      nombre: 'Mollets assis', mm: { p: ['gemelos'], s: [] }, zona: 'pierna', musc: ['Soléaire'], equipo: 'Machine',
      cues: ['Genou à 90° : ici travaille le soléaire, la clé pour courir', 'Même règle : pause en haut et en bas, sans rebonds'],
      err: ['Aller vite en rebondissant', 'Mettre l’appui sur le bout des orteils (mieux sur leur base)'],
      alt: [{ n: 'Assis avec haltères sur les genoux + marche', por: 'sans machine' }],
      mol: 'Comme debout : gêne à l’Achille = uniquement des isométriques pendant une semaine.'
    },
    'elev-piernas': { pat: 'flex',
      nombre: 'Relevés de jambes suspendu', mm: { p: ['abdomen'], s: ['antebrazo'] }, zona: 'core', musc: ['Bas des abdos', 'fléchisseurs, grip'], equipo: 'Barre de tractions',
      cues: ['Suspension active (épaules loin des oreilles)', 'Monte les genoux à la poitrine sans balancement', 'Redescends contrôlé jusqu’en bas'],
      err: ['Se balancer', 'Tirer uniquement des fléchisseurs de hanche avec les lombaires cambrées'],
      alt: [{ n: 'Aux barres parallèles (appui sur les coudes)', por: 'si le grip lâche avant les abdos' }, { n: 'Relevés allongé', por: 'version de départ' }],
      mol: 'Si l’épaule gêne en suspension : passe directement aux barres parallèles.'
    },
    'rueda-abdominal': { pat: 'flex',
      nombre: 'Roulette abdominale', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Core antérieur complet'], equipo: 'Ab wheel',
      cues: ['À genoux, bassin en rétroversion avant de partir', 'Roule jusqu’où tu contrôles les lombaires', 'Reviens en tirant avec les abdos, pas avec les bras'],
      err: ['Cambrer les lombaires en s’étendant (l’erreur qui blesse)', 'Aller plus loin que ce que le core tient'],
      alt: [{ n: 'Crunch à la poulie', por: 'si la roulette est trop grosse aujourd’hui' }, { n: 'Planche lestée', por: 'isométrique équivalent' }],
      mol: 'Si les lombaires gênent : coupe le trajet de moitié et gagne de l’amplitude semaine après semaine.'
    },
    'crunch-polea': { pat: 'flex',
      nombre: 'Crunch à la poulie', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Grand droit'], equipo: 'Poulie haute + corde',
      cues: ['À genoux, corde de chaque côté de la tête', 'Fléchis depuis les côtes, pas depuis les hanches', 'Coudes vers les genoux, expire en descendant'],
      err: ['Tirer avec les bras', 'S’asseoir en arrière en ne bougeant que les hanches'],
      alt: [{ n: 'Crunch à la machine', por: 'équivalent' }, { n: 'Roulette abdominale', por: 'quand tu veux monter d’un niveau' }],
      mol: 'Pas d’incident typique si tu fléchis depuis les côtes.'
    },

    'fondos-silla': { pat: 'ext', pic: 'fondos-silla',
      nombre: 'Dips sur chaise', mm: { p: ['triceps'], s: ['pecho', 'hombro'] }, zona: 'empuje', musc: ['Triceps', 'bas des pectoraux, épaule'], equipo: 'Rien (chaise ou canapé)',
      cues: ['Mains au bord de la chaise, doigts vers l’extérieur, épaules loin des oreilles', 'Descends jusqu’à 90° au coude, pas un degré de plus : en dessous, c’est l’épaule qui paie', 'Coudes vers l’arrière, frôlant le corps, jamais écartés', 'Le dos monte et descend collé au bord de la chaise'],
      err: ['Descendre à fond en cherchant l’étirement (c’est là que naît la douleur d’épaule)', 'Éloigner les pieds au point que le poids parte dans les jambes', 'Remonter les épaules vers les oreilles'],
      alt: [{ n: 'Genoux pliés, pieds rapprochés', por: 'si tu ne sors pas 8 répétitions propres' }, { n: 'Pieds sur une deuxième chaise', por: 'quand 15 deviennent faciles' }],
      mol: 'Si l’avant de l’épaule proteste : réduis l’amplitude à 60°, ou passe aux pompes diamant, qui laissent l’articulation tranquille.'
    },
    'flexion-diamante': { pat: 'ext', pic: 'flexiones',
      nombre: 'Pompes diamant', mm: { p: ['triceps'], s: ['pecho', 'hombro'] }, zona: 'empuje', musc: ['Triceps', 'pectoral interne'], equipo: 'Rien',
      cues: ['Index et pouces formant un losange sous le sternum', 'Coudes collés au corps pendant tout le mouvement', 'Corps en planche : fessiers et abdos serrés', 'Poitrine aux mains, puis extension complète en haut'],
      err: ['Ouvrir les coudes (ça redevient une pompe classique)', 'Poser les mains sous le visage au lieu du sternum', 'Bassin qui s’affaisse'],
      alt: [{ n: 'Mains sur le canapé ou une table', por: 'si au sol elles ne sortent pas propres' }, { n: 'Pieds surélevés', por: 'si tu dépasses 12 faciles' }],
      mol: 'Si le poignet proteste : appuie sur les poings ou passe à genoux. Si c’est le coude, monte à 15 répétitions et ralentis le tempo.'
    },
    'ext-triceps-banda': { pat: 'ext', pic: 'banda',
      nombre: 'Extension triceps à l’élastique', mm: { p: ['triceps'], s: [] }, zona: 'empuje', musc: ['Triceps (les trois chefs)'], equipo: 'Élastique',
      cues: ['Fixe l’élastique en hauteur (porte ou poignée) et recule d’un pas', 'Coudes collés aux côtes et immobiles : seul l’avant-bras bouge', 'Étends jusqu’au verrouillage souple et tiens 1″ en bas', 'Reviens en 2-3″ en résistant à l’élastique'],
      err: ['Laisser les coudes partir vers l’avant ou vers le haut', 'Pousser avec l’épaule en penchant le buste', 'Lâcher le retour et laisser l’élastique commander'],
      alt: [{ n: 'Au-dessus de la tête, élastique sous les pieds', por: 'travaille davantage le chef long' }, { n: 'Kickback avec haltère', por: 'si tu n’as nulle part où fixer' }],
      mol: 'C’est l’exercice le plus tendre avec le coude de tout le plan : quand les autres gênent, c’est souvent le refuge. Monte les répétitions avant la dureté de l’élastique.'
    },
    'press-frances-mc': { pat: 'ext', pic: 'press-frances-mc',
      nombre: 'Barre au front avec haltères', mm: { p: ['triceps'], s: [] }, zona: 'empuje', musc: ['Triceps (chef long)'], equipo: 'Haltères',
      cues: ['Allongé au sol, haltères en haut, paumes face à face', 'Descends vers les oreilles en pliant seulement le coude, en 2-3″', 'Coudes pointés vers le plafond et immobiles', 'Étends sans verrouiller d’un coup'],
      err: ['Laisser les coudes s’ouvrir', 'En faire un développé en bougeant l’épaule', 'Descendre si vite que le sol arrête l’haltère'],
      alt: [{ n: 'Extension au-dessus de la tête assis', por: 'plus d’amplitude sur le chef long' }, { n: 'Extension triceps à l’élastique', por: 'si le coude demande une tension plus douce' }],
      mol: 'Si le coude proteste : passe à la version élastique à 15 répétitions. Le sol te coupe en plus l’amplitude juste là où le coude souffre.'
    },
    /* — Bras — */
    'curl-barra-z': { pat: 'curl',
      nombre: 'Curl barre EZ', mm: { p: ['biceps'], s: [] }, zona: 'tiron', musc: ['Biceps'], equipo: 'Barre EZ',
      cues: ['Coudes collés au corps, fixes', 'Monte sans balancement, descends en 2-3″', 'Poignets neutres grâce à la EZ'],
      err: ['Balancer le corps pour monter plus lourd', 'Coudes qui voyagent vers l’avant en haut'],
      alt: [{ n: 'Curl haltères alterné', por: 'avec rotation (supination), très complet' }, { n: 'Curl à la poulie basse', por: 'tension continue' }],
      mol: 'Si le poignet ou le coude gêne : haltères avec rotation ou prise marteau.'
    },
    'curl-inclinado': { pat: 'curl',
      nombre: 'Curl incliné haltères', mm: { p: ['biceps'], s: [] }, zona: 'tiron', musc: ['Biceps (chef long)'], equipo: 'Haltères + banc 45-60°',
      cues: ['Banc à 45-60°, bras pendants à la verticale', 'L’étirement en bas est le stimulus : ne le coupe pas', 'Coudes immobiles, monte sans hausser les épaules'],
      err: ['Avancer les coudes', 'Demi-répétition en bas'],
      alt: [{ n: 'Curl bayésien à la poulie', por: 'même étirement, debout' }],
      mol: 'Si l’épaule tire en bas : remonte le dossier d’un cran.'
    },
    'curl-martillo': { pat: 'curl',
      nombre: 'Curl marteau', mm: { p: ['biceps'], s: ['antebrazo'] }, zona: 'tiron', musc: ['Brachial', 'avant-bras'], equipo: 'Haltères',
      cues: ['Prise neutre (marteau), coudes fixes', 'Tu peux le faire alterné ou simultané', 'Contrôle la descente'],
      err: ['Balancement', 'Le transformer en rowing en montant les coudes'],
      alt: [{ n: 'Curl marteau à la corde à la poulie', por: 'variante' }],
      mol: 'C’est le curl le plus doux pour les coudes et les poignets : c’est souvent le refuge quand les autres gênent.'
    },
    'curl-polea': { pat: 'curl',
      nombre: 'Curl à la poulie basse', mm: { p: ['biceps'], s: [] }, zona: 'tiron', musc: ['Biceps'], equipo: 'Poulie basse + barre',
      cues: ['Un pas en arrière de la poulie, coudes fixes', 'Tension continue : ne te repose ni en haut ni en bas', 'Dernière série : tiens 10″ en isométrique à mi-chemin pour finir'],
      err: ['Se rapprocher au point que le bas du trajet perde la tension', 'Se balancer'],
      alt: [{ n: 'Curl barre EZ', por: 'équivalent en poids libre' }],
      mol: 'Si le coude gêne : prise plus large ou corde en marteau.'
    }
  };

  /* ---------- LES 8 RÈGLES ---------- */
  const REGLAS = [
    { n: 1, t: 'RPE contrôlé', d: 'Chaque phase a son plafond. Ton système nerveux se souvient ; tes tendons ont passé des années sans charge. Freine avant qu’ils ne freinent.' },
    { n: 2, t: 'Double progression', d: 'D’abord les répétitions dans la fourchette, ensuite le poids : +2,5 kg (+5 kg au squat et au soulevé de terre roumain), seulement avec une technique propre sur toutes les séries. L’app te le suggère.' },
    { n: 3, t: 'Balance = moyenne hebdo', d: 'Lundi, mercredi et vendredi à jeun, et ne regarde que la moyenne. Un jour isolé ne veut rien dire : eau, sel, créatine.' },
    { n: 4, t: 'Protéines : {p} g en 4 prises', d: 'Aucune prise sous {q} g. Ça décide si ce qui change est du gras ou du muscle.' },
    { n: 5, t: '8 000–10 000 pas par jour', d: 'Tous les jours, entraînement ou pas. Ça brûle plus sur la semaine que les séances elles-mêmes.' },
    { n: 6, t: 'Sommeil 7–8 h : non négociable', d: 'Avec 5,5 h de sommeil en déficit, tu perds 55% de gras en moins et 60% de muscle en plus. Caféine uniquement avant 13-14 h.' },
    { n: 7, t: 'Un jour raté ne se rattrape pas', d: 'Ni double séance ni repas coupé le lendemain : suis le calendrier.' },
    { n: 8, t: 'Le minimum non négociable', d: 'Ce qui tue, c’est 3 mois à fond et 3 à zéro. La semaine chaotique a un plancher : 2 forces + 1 cardio.' }
  ];

  const SENALES = ['Arrête l’exercice pour la journée : douleur aiguë au genou, à l’épaule ou aux lombaires pendant le mouvement ; gêne qui empire série après série au lieu de partir à l’échauffement.', 'Normal : courbatures diffuses à 24-48 h.', 'Kiné avant de continuer : douleur articulaire localisée plus de 5 jours.'];

  /* ---------- NUTRITION ---------- */
  const NUTRI = {
    calorias: [
      { c: 'Métabolisme de base', v: '~1 950 kcal', n: '95,1 kg · 183 cm · 30 ans' },
      { c: 'Dépense totale estimée', v: '2 850–3 000 kcal', n: 'Entraînements + 8-10k pas' },
      { c: 'Apport cible', v: '2 250–2 400 kcal', n: 'Déficit ~550–700 kcal/jour : au-delà, ça freine la reprise de muscle.' },
      { c: 'Rythme de perte attendu', v: '0,6–0,75 kg/sem', n: '≈0,7% du poids/sem, l’optimum pour garder du muscle. Moyenne hebdo.' }
    ],
    fases: [
      { f: 'P1–P2 (sem 1-5)', kcal: 2250, p: 190, g: 70, c: 205 },
      { f: 'P3 (sem 6-9)',    kcal: 2350, p: 190, g: 70, c: 230, nota: 'Semaine 7 : DIET BREAK à ~2 800' },
      { f: 'P4 (sem 10-12)',  kcal: 2400, p: 190, g: 70, c: 240 }
    ],
    escalado: 'Les protéines ({p} g) ne bougent pas : quand l’entraînement monte, seuls les glucides montent.',
    tomas: 'C’est le total qui commande, mais le répartir en 4 maximise la synthèse et coupe la faim nocturne.',
    plato: [
      { t: 'Protéines (chaque repas)', d: '200-250 g de poulet/dinde/poisson blanc en cru, ou 170-180 g de saumon/bœuf, ou 3 œufs + 2 blancs, ou 250 g de skyr + whey.' },
      { t: 'Glucides', d: '60-75 g en cru de riz/pâtes, ou 250-300 g de pommes de terre, ou 60 g de pain complet, ou 50 g de flocons d’avoine.' },
      { t: 'Légumes', d: 'La moitié de l’assiette, à volonté. Volume et satiété.' },
      { t: 'Graisses', d: '10 g d’huile d’olive vierge extra par repas principal (une cuillère à soupe) et on arrête de compter. C’est là que les calories filent sans que tu t’en rendes compte.' }
    ],
    suplementos: [
      { id: 'creatina', t: 'Créatine monohydrate', d: '5 g par jour, à n’importe quelle heure, sans charge, dès maintenant. Elle retient 1-2 kg d’eau les premières semaines : ce n’est pas du gras. Fie-toi au tour de taille et à la moyenne hebdo ; le graphique le marque.' },
      { id: 'whey', t: 'Whey', d: '1 dose dans la prise pré-sommeil avec le skyr (et une autre là où il faut, les jours courts en protéines).' },
      { id: 'cafeina', t: 'Caféine', d: 'Pas de caféine après 13-14 h : 200 mg perturbent le sommeil jusqu’à 13 h après ; un café, ~9 h. Entraînement le matin : café 30-45′ avant. Le soir : sans caféine ; le pré-workout, c’est le goûter (fruit + skyr, 60-90′ avant).' },
      { id: 'vitamina-d', t: 'Vitamine D', d: 'Seulement si l’analyse sort sous 30 ng/mL, probable avec une vie d’intérieur.' },
      { id: 'omega-3', t: 'Oméga-3', d: '~2 g d’EPA+DHA par jour : bénéfice modeste mais réel sur la force et le tendon.' },
      { id: 'no', t: 'Ne dépense pas dans', d: 'Brûleurs de graisse, BCAA/EAA (tes protéines les couvrent déjà) et « testo boosters ». Ça ne fait pas bouger l’aiguille.' }
    ],
    hidratacion: 'Eau : 2,5–3 L/jour. Alcool : seulement au repas libre ; il compte en calories et freine la récupération.',
    comidaLibre: 'Un repas libre par semaine, pas une journée (samedi par défaut). Mange ce qui te fait envie en quantité normale, sans compenser ni avant ni après. C’est ce qui fait tenir le plan {s} semaines et une vie sociale. Il peut se déplacer ; il en reste un seul.'
  };


  /* ---------- RECETTES ---------- */
  // q en grammes sauf unité indiquée · macros par portion
  const RECETAS = [
    {
      id: 'bol-skyr', slot: 'de', tags: ['lacteo', 'frutos'], nombre: 'Bol de skyr', tipo: 'Petit-déj A', tiempo: '5′', cocina: 'Sans cuisson',
      macros: { kcal: 520, p: 35, g: 11, c: 72 },
      ing: [
        { pid: 'skyr', q: '250 g', i: 'skyr nature (ou fromage blanc 0%)' },
        { pid: 'avena', q: '50 g', i: 'flocons d’avoine' },
        { pid: 'platano', q: '1 pièce (120 g)', i: 'banane' },
        { pid: 'nueces', q: '10 g', i: 'noix' },
        { pid: 'canela', q: 'au goût', i: 'cannelle' }
      ],
      pasos: [
        'Le skyr dans le bol et l’avoine par-dessus (telle quelle si tu aimes la texture, ou trempée 5′ dans un doigt de lait ou d’eau).',
        'Banane en rondelles, noix concassées à la main et cannelle par-dessus.'
      ],
      tips: 'Si tu t’entraînes le matin, monte-le la veille au soir : l’avoine trempée y gagne. Jour court en protéines : +1 dose de whey dans le skyr (+110 kcal, +23 g).'
    },
    {
      id: 'tortilla-pan', slot: 'de', tags: ['huevo', 'gluten'], nombre: 'Omelette, pain et tomate', tipo: 'Petit-déj B', tiempo: '10′', cocina: 'Poêle',
      macros: { kcal: 470, p: 34, g: 22, c: 32 },
      ing: [
        { pid: 'huevos', q: '3 pièces', i: 'œufs M' },
        { pid: 'claras', q: '2 pièces (ou 100 ml en bouteille)', i: 'blancs d’œufs' },
        { pid: 'pan', q: '60 g (2 tranches)', i: 'pain complet' },
        { pid: 'tomate', q: '100 g', i: 'tomate râpée' },
        { pid: 'aove', q: '5 g', i: 'huile d’olive vierge extra' },
        { pid: 'sal', q: 'pincée', i: 'sel' }
      ],
      pasos: [
        'Bats les œufs et les blancs avec le sel.',
        'Poêle antiadhésive à feu moyen avec les 5 g d’huile : fais prendre l’omelette à la cuisson que tu aimes.',
        'Toaste le pain et couvre-le de tomate râpée avec une goutte de l’huile de la poêle.'
      ],
      tips: 'Les blancs en bouteille suppriment la corvée de séparer. Version œufs brouillés : même temps, zéro technique.'
    },
    {
      id: 'pollo-asado', slot: 'co', tags: ['carne'], nombre: 'Poulet rôti et pommes de terre', tipo: 'Déjeuner · batch du dimanche', tiempo: '45′ de four (du meal prep)', cocina: 'Four',
      macros: { kcal: 780, p: 70, g: 19, c: 68 },
      ing: [
        { pid: 'pollo', q: '250 g cru (~200 g cuit)', i: 'blanc de poulet', n: 'batch : 1,2 kg = 5 portions' },
        { pid: 'patata', q: '200 g', i: 'pommes de terre en quartiers' }, { pid: 'pimiento', q: '50 g', i: 'poivron' }, { pid: 'cebolla', q: '50 g', i: 'oignon' },
        { pid: 'aove', q: '10 g', i: 'huile d’olive vierge extra (comptée dans le rôti)' },
        { pid: 'especias', q: 'au goût', i: 'paprika, ail en poudre, sel, origan' }
      ],
      pasos: [
        'Four à 200°. Sale et poivre les blancs de poulet et enduis-les de paprika + ail en poudre.',
        'Plaque 1 : les blancs, 25-30′ (juste cuits = juteux ; dépasse et ce sera de la semelle).',
        'Plaque 2 : pommes de terre en quartiers avec poivron, oignon et 20 g d’huile au total, 40-45′, retourne à mi-cuisson.',
        'Portionne : 5 boîtes. Le poulet du jeudi-vendredi, au congélateur.'
      ],
      tips: 'La portion se réchauffe en 2′ au micro-ondes avec un filet d’eau pour que le poulet ne sèche pas.'
    },
    {
      id: 'lentejas-pollo', slot: 'co', tags: ['carne'], nombre: 'Lentilles au poulet', tipo: 'Déjeuner · batch du dimanche', tiempo: '25′ de casserole', cocina: 'Casserole',
      macros: { kcal: 760, p: 52, g: 16, c: 80 },
      ing: [
        { pid: 'lentejas', q: '250 g égouttées', i: 'lentilles cuites en bocal', n: 'batch : 2 bocaux = 3 portions' },
        { pid: 'pollo', q: '120 g', i: 'poulet rôti en lanières (de la fournée au four)' },
        { pid: 'cebolla', q: '¼ pièce', i: 'oignon' },
        { pid: 'pimiento', q: '½ pièce', i: 'poivron' },
        { pid: 'zanahoria', q: '1 pièce', i: 'carotte' },
        { pid: 'aove', q: '4 g', i: 'huile d’olive vierge extra (comptée dans les légumes revenus)' },
        { pid: 'especias', q: '1 c. à café / ½ c. à café', i: 'paprika / cumin' },
        { pid: 'caldo', q: '150 ml', i: 'bouillon ou eau' },
        { pid: 'fruta', q: '1 pièce', i: 'fruit en dessert' }
      ],
      pasos: [
        'Fais revenir 8′ : oignon, poivron et carotte hachés avec 10 g d’huile (pour le batch de 3 portions).',
        'Ajoute les lentilles égouttées, le bouillon, le paprika et le cumin : 15′ à feu doux.',
        'Éteins et mélange le poulet en lanières (comme ça il ne se dessèche pas).'
      ],
      tips: 'En bocal et sans trempage : la légumineuse la plus rapide qui existe. Elles épaississent le lendemain : ajoute un doigt d’eau en réchauffant.'
    },
    {
      id: 'salteado-ternera', slot: 'co', tags: ['carne'], nombre: 'Sauté de bœuf', tipo: 'Déjeuner · 15′ frais', tiempo: '15′', cocina: 'Wok / poêle',
      macros: { kcal: 730, p: 45, g: 20, c: 60 },
      ing: [
        { pid: 'ternera', q: '180-200 g', i: 'bœuf maigre en lanières' },
        { pid: 'arroz', q: '70 g cru (≈ 180 g cuit)', i: 'riz', n: 'prends celui du batch' },
        { pid: 'verduras', q: '250 g', i: 'légumes variés : poivron, oignon, courgette, carotte' },
        { pid: 'salsa-soja', q: '15 ml', i: 'sauce soja' },
        { pid: 'aove', q: '8 g', i: 'huile d’olive vierge extra' }
      ],
      pasos: [
        'Wok ou poêle très chaude avec l’huile : saisis le bœuf 1-2′ et réserve-le ; si tu le laisses, il bout et durcit.',
        'Même poêle : les légumes en lanières 5-6′, qu’ils restent al dente.',
        'Remets le bœuf, la sauce soja, 1′ de remuage et le tout sur le riz.'
      ],
      tips: 'L’ordre fait tout : la viande sort avant les légumes. Demande au boucher des « lanières à sauter » et tu t’épargnes la découpe.'
    },
    {
      id: 'salmon-arroz', slot: 'ce', tags: ['pescado'], nombre: 'Saumon, riz et brocoli', tipo: 'Dîner · 15′', tiempo: '15′', cocina: 'Poêle ou four',
      macros: { kcal: 760, p: 40, g: 28, c: 62 },
      ing: [
        { pid: 'salmon', q: '170-180 g', i: 'pavé de saumon' },
        { pid: 'arroz', q: '75 g cru (≈ 190 g cuit)', i: 'riz', n: 'du batch' },
        { pid: 'brocoli', q: '200 g', i: 'brocoli' },
        { pid: 'limon', q: '½ pièce', i: 'citron' },
        { pid: 'sal', q: 'pincée', i: 'sel' }
      ],
      pasos: [
        'Brocoli au micro-ondes dans un bol couvert avec un doigt d’eau : 4-5′ (ou vapeur).',
        'Saumon à la poêle 3-4′ par face en commençant côté peau (ou au four à 200°, 12′). Sans huile : il apporte la sienne.',
        'Riz réchauffé, citron pressé par-dessus le tout.'
      ],
      tips: 'Le gras du saumon compte comme le gras du repas : c’est pour ça qu’il n’y a pas d’huile d’olive ici.'
    },
    {
      id: 'merluza-patata', slot: 'ce', tags: ['pescado', 'lacteo'], nombre: 'Colin et pommes de terre boulangères', tipo: 'Dîner · 20′', tiempo: '20′', cocina: 'Four ou micro-ondes+poêle',
      macros: { kcal: 740, p: 55, g: 15, c: 55 },
      ing: [
        { pid: 'merluza', q: '250 g', i: 'colin (merlu) ou bar en filets' },
        { pid: 'patata', q: '250 g', i: 'pommes de terre' },
        { pid: 'lechuga', q: '100 g', i: 'laitue' }, { pid: 'tomate', q: '1 ud', i: 'tomate' }, { pid: 'cebolla', q: '¼ ud', i: 'oignon' },
        { pid: 'aove', q: '10 g', i: 'huile d’olive vierge extra (5 pommes de terre + 5 salade)' },
        { pid: 'skyr', q: '1 pièce', i: 'skyr en dessert' }
      ],
      pasos: [
        'Pommes de terre en rondelles de ½ cm : micro-ondes 8′ à couvert (ou au four 25′ avec 5 g d’huile, sel et origan).',
        'Colin : four à 200° 10-12′, ou poêle 3′ par face. Le point parfait : quand il se détache en feuillets.',
        'Salade avec 5 g d’huile et du vinaigre. Skyr en dessert et le dîner est plié.'
      ],
      tips: 'Le poisson blanc est la protéine la plus rassasiante par calorie de tout le plan : garde-le pour les jours de grosse faim.'
    },
    {
      id: 'revuelto-gambas', slot: 'ce', tags: ['pescado', 'huevo', 'gluten'], nombre: 'Brouillade aux crevettes', tipo: 'Dîner · 10′', tiempo: '10′', cocina: 'Poêle',
      macros: { kcal: 620, p: 45, g: 30, c: 25 },
      ing: [
        { pid: 'huevos', q: '3 pièces', i: 'œufs M' },
        { pid: 'gambas', q: '150 g', i: 'crevettes décortiquées (les surgelées vont très bien)' },
        { pid: 'pan', q: '40 g', i: 'pain complet' },
        { pid: 'lechuga', q: 'bol', i: 'salade verte' },
        { pid: 'aove', q: '8 g', i: 'huile d’olive vierge extra' },
        { pid: 'ajo', q: '1 gousse', i: 'ail' }
      ],
      pasos: [
        'Fais dorer l’ail émincé dans l’huile ; les crevettes 2′ (décongelées et séchées avant).',
        'Baisse le feu, ajoute les œufs battus et remue sans T’arrêter jusqu’à texture crémeuse. Retire avant que ça prenne complètement.',
        'Pain toasté et salade à côté.'
      ],
      tips: 'La brouillade finit de cuire hors du feu. Crevettes surgelées : décongèle-les dans un bol d’eau froide en 10′.'
    },
    {
      id: 'toma-noche', slot: 'snack', tags: ['lacteo'], nombre: 'Prise pré-sommeil', tipo: 'Prise 4 · quotidienne', tiempo: '1′', cocina: 'Sans cuisson',
      macros: { kcal: 270, p: 49, g: 2, c: 14 },
      ing: [
        { pid: 'skyr', q: '250 g', i: 'skyr ou fromage blanc 0%' },
        { pid: 'whey', q: '1 dose (30 g)', i: 'whey (le parfum qui ne te lasse pas)' },
        { pid: 'canela', q: 'au goût', i: 'cannelle' }
      ],
      pasos: [
        'Mélange la dose de whey au skyr jusqu’à texture de mousse. Cannelle par-dessus.',
        '30-60′ avant de te coucher. C’est tout.'
      ],
      tips: 'Complète les protéines du jour et coupe la faim nocturne, là où meurent les régimes. La caséine se digère lentement : elle travaille pendant ton sommeil.'
    },
    {
      id: 'ensalada-atun', slot: 'ce', tags: ['pescado', 'huevo'], nombre: 'Salade complète au thon', tipo: 'Dîner · 10′', tiempo: '10′', cocina: 'Sans feu (avec le batch)',
      macros: { kcal: 700, p: 45, g: 25, c: 50 },
      ing: [
        { pid: 'atun', q: '2 boîtes (120 g égoutté)', i: 'thon au naturel' },
        { pid: 'huevos', q: '1 pièce', i: 'œuf dur (du batch)' },
        { pid: 'patata', q: '150 g', i: 'pommes de terre cuites (du batch)' },
        { pid: 'tomate', q: '150 g', i: 'tomate' },
        { pid: 'aceitunas', q: '30 g', i: 'olives' },
        { pid: 'cebolla', q: '¼ pièce', i: 'oignon rouge' },
        { pid: 'aove', q: '10 g', i: 'huile d’olive vierge extra' }
      ],
      pasos: [
        'Tout dans le bol : pommes de terre en dés, tomate en quartiers, oignon émincé, thon égoutté, œuf en quartiers, olives.',
        'Huile, vinaigre, sel et on remue.'
      ],
      tips: 'Le dîner zéro effort si dimanche tu as cuit des pommes de terre et des œufs en plus. Version sans pommes de terre (jour de petite faim) : ajoute plus de tomate.'
    },
    { id: 'porridge-soja', slot: 'de', tags: [], nombre: 'Porridge d’avoine et protéine', tipo: 'Petit-déj C', tiempo: '8′', cocina: 'Casserole ou micro-ondes',
      macros: { kcal: 545, p: 37, g: 11, c: 69 },
      ing: [{ pid: 'avena', q: '70 g', i: 'flocons d’avoine (certifiés sans gluten)' }, { pid: 'bebida-soja', q: '250 ml', i: 'boisson de soja sans sucre' }, { pid: 'prote-vegetal', q: '25 g', i: 'protéine de pois, nature ou vanille' }, { pid: 'platano', q: '1', i: 'banane en rondelles' }, { pid: 'canela', q: 'au goût', i: 'cannelle' }],
      pasos: ['Chauffe l’avoine avec le soja 4-5′ en remuant jusqu’à épaississement.', 'Hors du feu, incorpore la protéine : bouillie, elle fait des grumeaux.', 'Couronne avec la banane et la cannelle.'],
      tips: 'Prépare-le la veille au frigo (overnight) et ajoute juste la protéine le matin.' },
    { id: 'tofu-revuelto', slot: 'de', tags: [], nombre: 'Tofu brouillé sur toasts', tipo: 'Petit-déj D', tiempo: '12′', cocina: 'Poêle',
      macros: { kcal: 570, p: 41, g: 25, c: 42 },
      ing: [{ pid: 'tofu', q: '200 g', i: 'tofu ferme émietté' }, { pid: 'pan-sg', q: '2 tranches (70 g)', i: 'pain sans gluten' }, { pid: 'levadura', q: '10 g', i: 'levure nutritionnelle' }, { pid: 'tomate', q: '1', i: 'tomate en rondelles' }, { pid: 'aove', q: '5 g', i: 'huile d’olive vierge extra' }, { pid: 'especias', q: 'au goût', i: 'curcuma, sel noir kala namak, poivre' }],
      pasos: ['Fais sauter le tofu émietté dans l’huile 3-4′ à feu moyen-vif.', 'Ajoute curcuma, levure et sel noir (le goût d’œuf) ; 2′ de plus.', 'Grille le pain et dresse avec la tomate.'],
      tips: 'Le kala namak est la clé : sans lui, du tofu au curcuma ; avec, un vrai brouillé.' },
    { id: 'bol-soja-frutos', slot: 'de', tags: [], nombre: 'Bol de yaourt de soja aux fruits rouges', tipo: 'Petit-déj E', tiempo: '5′', cocina: 'Sans cuisson',
      macros: { kcal: 415, p: 29, g: 11, c: 41 },
      ing: [{ pid: 'yogur-soja', q: '250 g', i: 'yaourt de soja nature sans sucre' }, { pid: 'prote-vegetal', q: '20 g', i: 'protéine végétale en poudre' }, { pid: 'frutos-rojos', q: '120 g', i: 'fruits rouges (surgelés OK)' }, { pid: 'chia', q: '15 g', i: 'graines de chia' }, { pid: 'platano', q: '1', i: 'petite banane' }],
      pasos: ['Mélange le yaourt et la protéine jusqu’à disparition des grumeaux.', 'Ajoute le chia et attends 5′ : ça épaissit seul.', 'Couronne avec les fruits rouges et la banane.'],
      tips: 'Les fruits rouges surgelés, tels quels, refroidissent et épaississent le bol : mieux que des frais ici.' },
    { id: 'revuelto-espinacas', slot: 'de', tags: ['huevo'], nombre: 'Œufs brouillés aux épinards', tipo: 'Petit-déj F', tiempo: '10′', cocina: 'Poêle',
      macros: { kcal: 510, p: 28, g: 21, c: 46 },
      ing: [{ pid: 'huevos', q: '3', i: 'œufs' }, { pid: 'espinacas', q: '100 g', i: 'épinards frais' }, { pid: 'champinones', q: '100 g', i: 'champignons émincés' }, { pid: 'pan-sg', q: '50 g', i: 'pain sans gluten' }, { pid: 'aove', q: '5 g', i: 'huile d’olive vierge extra' }, { pid: 'fruta', q: '150 g', i: 'fruit de saison' }],
      pasos: ['Fais sauter les champignons 3′ ; ajoute les épinards jusqu’à ce qu’ils tombent.', 'Œufs battus dedans, feu doux, en remuant : crémeux, pas sec.', 'Sers avec le pain grillé et le fruit à part.'],
      tips: 'Coupe le feu quand ça semble encore un peu cru : la chaleur résiduelle finit le travail.' },
    { id: 'curry-lentejas', slot: 'co', tags: [], nombre: 'Curry de lentilles corail au riz', tipo: 'Déjeuner · batch du dimanche', tiempo: '25′ casserole', cocina: 'Casserole',
      macros: { kcal: 755, p: 31, g: 18, c: 108 },
      ing: [{ pid: 'lentejas-rojas', q: '100 g', i: 'lentilles corail sèches' }, { pid: 'leche-coco', q: '100 ml', i: 'lait de coco léger' }, { pid: 'tomate-triturado', q: '150 g', i: 'tomates concassées' }, { pid: 'arroz', q: '50 g', i: 'riz basmati sec' }, { pid: 'aove', q: '10 g', i: 'huile d’olive vierge extra' }, { pid: 'especias', q: 'au goût', i: 'oignon, ail, gingembre, curry en poudre, sel' }],
      pasos: ['Fais suer oignon, ail et gingembre 3′ ; ajoute le curry et torréfie 30″.', 'Lentilles, tomate, coco et 300 ml d’eau : 18-20′ à feu moyen jusqu’à ce qu’elles se défassent.', 'Riz à part (12′). Curry par-dessus.'],
      tips: 'Batch : ×4, se garde 4 jours au frigo et se congèle parfaitement. Les lentilles corail ne se trempent pas.' },
    { id: 'tofu-salteado', slot: 'co', tags: [], nombre: 'Tofu sauté aux légumes et riz complet', tipo: 'Déjeuner · 20′', tiempo: '20′', cocina: 'Wok / poêle',
      macros: { kcal: 775, p: 47, g: 34, c: 71 },
      ing: [{ pid: 'tofu', q: '200 g', i: 'tofu ferme en dés' }, { pid: 'arroz', q: '70 g', i: 'riz complet sec' }, { pid: 'brocoli', q: '100 g', i: 'brocoli' }, { pid: 'pimiento', q: '75 g', i: 'poivron' }, { pid: 'zanahoria', q: '75 g', i: 'carotte' }, { pid: 'tamari', q: '15 ml', i: 'tamari (sauce soja sans gluten)' }, { pid: 'aove', q: '10 g', i: 'huile d’olive vierge extra' }, { pid: 'sesamo', q: '10 g', i: 'graines de sésame' }],
      pasos: ['Riz complet à cuire (25′ ; fais-en en batch).', 'Tofu à feu vif jusqu’à dorer sur toutes les faces (6-7′) ; réserve.', 'Légumes 4′ au wok, tofu de retour, tamari et sésame ; 1′ et c’est prêt.'],
      tips: 'Presse le tofu 10′ entre deux assiettes avec un poids : il rend son eau et dore vraiment.' },
    { id: 'bol-garbanzos', slot: 'co', tags: [], nombre: 'Bol de pois chiches rôtis, quinoa et houmous', tipo: 'Déjeuner · 15′ frais', tiempo: '15′ (+ four)', cocina: 'Four + sans cuisson',
      macros: { kcal: 780, p: 31, g: 24, c: 103 },
      ing: [{ pid: 'garbanzos', q: '200 g', i: 'pois chiches cuits' }, { pid: 'quinoa', q: '60 g', i: 'quinoa sec' }, { pid: 'hummus', q: '50 g', i: 'houmous' }, { pid: 'pimiento', q: '100 g', i: 'poivron' }, { pid: 'pepino', q: '50 g', i: 'concombre' }, { pid: 'aove', q: '5 g', i: 'huile d’olive vierge extra' }, { pid: 'especias', q: 'au goût', i: 'cumin, paprika, citron, sel' }],
      pasos: ['Pois chiches égouttés avec paprika, cumin et sel : four 200° 20′ jusqu’à croustillants (batch).', 'Quinoa : rince, 12′ dans deux fois son volume d’eau, repos couvert.', 'Monte le bol : quinoa, pois chiches, légumes, houmous et citron.'],
      tips: 'Les pois chiches rôtis tiennent 5 jours en bocal : c’est le « grignotage » de ce plan.' },
    { id: 'pasta-lentejas-tempeh', slot: 'co', tags: [], nombre: 'Pâtes de lentilles au tempeh et tomate', tipo: 'Déjeuner · 20′', tiempo: '20′', cocina: 'Casserole + poêle',
      macros: { kcal: 665, p: 46, g: 26, c: 67 },
      ing: [{ pid: 'pasta-lentejas', q: '80 g', i: 'pâtes de lentilles corail (sans gluten)' }, { pid: 'tempeh', q: '120 g', i: 'tempeh en dés' }, { pid: 'tomate-triturado', q: '200 g', i: 'tomates concassées' }, { pid: 'cebolla', q: '80 g', i: 'oignon' }, { pid: 'ajo', q: '1 gousse', i: 'ail' }, { pid: 'aove', q: '10 g', i: 'huile d’olive vierge extra' }, { pid: 'especias', q: 'au goût', i: 'basilic, origan, sel' }],
      pasos: ['Pâtes de lentilles 7-8′ (elles se défont vite : goûte avant le temps du paquet).', 'Tempeh doré dans l’huile 4′ ; oignon et ail 3′ de plus.', 'Tomate, origan et sel, 5′ ; mélange avec les pâtes et le basilic.'],
      tips: 'Le tempeh gagne beaucoup à être cuit 8′ à la vapeur avant de dorer : l’amertume disparaît.' },
    { id: 'tortilla-garbanzo', slot: 'ce', tags: [], nombre: 'Omelette de farine de pois chiche à la courgette', tipo: 'Dîner · 20′', tiempo: '20′', cocina: 'Poêle',
      macros: { kcal: 460, p: 20, g: 16, c: 62 },
      ing: [{ pid: 'harina-garbanzo', q: '80 g', i: 'farine de pois chiche (sans gluten)' }, { pid: 'calabacin', q: '200 g', i: 'courgette en fines lamelles' }, { pid: 'cebolla', q: '80 g', i: 'oignon' }, { pid: 'aove', q: '10 g', i: 'huile d’olive vierge extra' }, { pid: 'lechuga', q: '100 g', i: 'salade verte' }, { pid: 'especias', q: 'au goût', i: 'sel, poivre, curcuma' }],
      pasos: ['Mélange la farine avec 160 ml d’eau, sel et curcuma ; repos 10′.', 'Courgette et oignon 8′ à feu moyen jusqu’à tendres.', 'Verse la pâte dessus, couvre, 5′ par face. Salade à côté.'],
      tips: 'La vraie « omelette sans œuf » : elle prend pareil et se mange froide en lunchbox.' },
    { id: 'crema-calabaza-tofu', slot: 'ce', tags: [], nombre: 'Velouté de potiron, edamame et tofu grillé', tipo: 'Dîner · 25′', tiempo: '25′', cocina: 'Casserole + plancha',
      macros: { kcal: 590, p: 41, g: 24, c: 38 },
      ing: [{ pid: 'calabaza', q: '300 g', i: 'potiron en dés' }, { pid: 'edamame', q: '100 g', i: 'edamame écossés (surgelés)' }, { pid: 'tofu', q: '150 g', i: 'tofu ferme en tranches' }, { pid: 'cebolla', q: '60 g', i: 'oignon' }, { pid: 'aove', q: '10 g', i: 'huile d’olive vierge extra' }, { pid: 'pipas', q: '10 g', i: 'graines de courge' }],
      pasos: ['Oignon et potiron dans 5 g d’huile 3′ ; couvre d’eau à hauteur, 15′ et mixe.', 'Edamame 4′ à l’eau bouillante ; égoutte et ajoute au velouté.', 'Tofu à la plancha avec le reste d’huile, 3′ par face. Graines par-dessus.'],
      tips: 'Sans crème ni pomme de terre : le potiron mixé est crémeux tout seul.' },
    { id: 'ensalada-quinoa-alubias', slot: 'ce', tags: [], nombre: 'Salade tiède de quinoa, haricots noirs et avocat', tipo: 'Dîner · 15′', tiempo: '15′', cocina: 'Casserole + sans cuisson',
      macros: { kcal: 610, p: 25, g: 21, c: 82 },
      ing: [{ pid: 'quinoa', q: '40 g', i: 'quinoa sec' }, { pid: 'alubias', q: '200 g', i: 'haricots noirs cuits' }, { pid: 'aguacate', q: '80 g', i: 'avocat' }, { pid: 'tomate', q: '100 g', i: 'tomate' }, { pid: 'cebolla', q: '20 g', i: 'oignon rouge' }, { pid: 'cilantro', q: 'au goût', i: 'coriandre' }, { pid: 'aove', q: '5 g', i: 'huile d’olive vierge extra' }, { pid: 'especias', q: 'au goût', i: 'citron vert, cumin, sel' }],
      pasos: ['Quinoa 12′ dans deux fois son volume d’eau ; égoutte.', 'Haricots égouttés et rincés, dans le quinoa encore tiède.', 'Avocat, tomate, oignon et coriandre ; assaisonne citron vert, cumin et huile.'],
      tips: 'Se transporte très bien au travail : l’avocat, coupé au dernier moment.' },
    { id: 'bolonesa-soja', slot: 'ce', tags: [], nombre: 'Bolognaise de soja texturé aux spaghettis de courgette', tipo: 'Dîner · 20′', tiempo: '20′', cocina: 'Poêle',
      macros: { kcal: 445, p: 37, g: 13, c: 47 },
      ing: [{ pid: 'soja-text', q: '60 g', i: 'protéines de soja texturées fines (sèches)' }, { pid: 'tomate-triturado', q: '250 g', i: 'tomates concassées' }, { pid: 'calabacin', q: '300 g', i: 'courgette en spirales ou lanières' }, { pid: 'cebolla', q: '50 g', i: 'oignon' }, { pid: 'zanahoria', q: '40 g', i: 'carotte' }, { pid: 'ajo', q: '1 gousse', i: 'ail' }, { pid: 'aove', q: '10 g', i: 'huile d’olive vierge extra' }, { pid: 'especias', q: 'au goût', i: 'origan, paprika, sel' }],
      pasos: ['Réhydrate le soja 10′ dans l’eau chaude avec une pincée de sel ; égoutte bien.', 'Sofrito 5′ ; soja égoutté 3′ à feu vif ; tomate et origan, 8′.', 'Courgette 2′ dans une poêle à part (pour qu’elle ne rende pas d’eau). Bolognaise dessus.'],
      tips: 'Le soja texturé a 50 g de protéines pour 100 g sec : la « viande hachée » la moins chère qui existe.' }
  ];

  /* ---------- LISTE DE COURSES (semaine type) ---------- */
  const COMPRA = [
    { cat: 'Protéines', items: [
      { q: '1,4 kg', i: 'blanc de poulet' },
      { q: '400 g', i: 'bœuf maigre en lanières' },
      { q: '500 g', i: 'colin (merlu) ou bar (2 portions)' },
      { q: '350 g', i: 'saumon (2 pavés)' },
      { q: '300 g', i: 'crevettes décortiquées surgelées' },
      { q: '4 boîtes', i: 'thon au naturel' },
      { q: '18 pièces', i: 'œufs M (une douzaine et demie)' },
      { q: '14 pièces (250 g chacune)', i: 'skyr ou fromage blanc 0% (7 petits-déj/desserts + 7 prises du soir)' },
      { q: '1 pot (dure ~1 mois)', i: 'whey (1 dose par jour dans la prise du soir)' }
    ]},
    { cat: 'Glucides', items: [
      { q: '500 g', i: 'riz' },
      { q: '2 kg', i: 'pommes de terre' },
      { q: '400 g', i: 'pain complet (grande baguette ou pain de mie)' },
      { q: '500 g', i: 'flocons d’avoine' },
      { q: '2 bocaux (400 g égoutté chacun)', i: 'lentilles cuites' }
    ]},
    { cat: 'Légumes et fruits', items: [
      { q: '5 pièces', i: 'poivrons' },
      { q: '4 pièces', i: 'oignons (+1 rouge)' },
      { q: '2 pièces', i: 'courgettes' },
      { q: '2 pièces', i: 'brocolis' },
      { q: '8 pièces', i: 'tomates (2 à râper)' },
      { q: '2 sachets', i: 'laitue ou mâche' },
      { q: '500 g', i: 'carottes' },
      { q: '12-14 pièces', i: 'fruits : bananes ×5, pommes ×4-5, oranges ×4' }
    ]},
    { cat: 'Placard', items: [
      { q: '—', i: 'huile d’olive vierge extra' },
      { q: '200 g', i: 'noix' },
      { q: '1 bocal', i: 'olives' },
      { q: '1 bouteille', i: 'sauce soja' },
      { q: '3 pièces', i: 'citrons' },
      { q: '—', i: 'épices : paprika, ail en poudre, cumin, origan, cannelle' },
      { q: '—', i: 'sel, vinaigre, bouillon' }
    ]}
  ];

  /* ---------- MEAL PREP DU DIMANCHE (~90′) ---------- */
  const MEALPREP = [];

  /* ---------- MENU DE LA SEMAINE ---------- */
  const MENU = [
    { d: 'Lun', de: 'bol-skyr', co: 'pollo-asado', ce: 'merluza-patata' },
    { d: 'Mar', de: 'tortilla-pan', co: 'lentejas-pollo', ce: 'ensalada-atun' },
    { d: 'Mer', de: 'bol-skyr', co: 'salteado-ternera', ce: 'revuelto-gambas' },
    { d: 'Jeu', de: 'tortilla-pan', co: 'pollo-asado', ce: 'salmon-arroz' },
    { d: 'Ven', de: 'bol-skyr', co: 'lentejas-pollo', ce: 'merluza-patata' },
    { d: 'Sam', de: 'tortilla-pan', co: 'LIBRE', ce: 'ensalada-atun' },
    { d: 'Dim', de: 'bol-skyr', co: 'salteado-ternera', ce: 'revuelto-gambas' }
  ];


  /* ---------- SUIVI ---------- */
  const CHECKPOINTS = [];
  const FOTOS = ['2026-08-17', '2026-09-13', '2026-10-11', '2026-11-08'];

  /* ---------- SUCCÈS ---------- */
  // tipo : sesion | racha | peso | cintura | disco | pr | especial
  const LOGROS = [
    { id: 'primera',        icon: '⚡', nombre: 'Jour un',            desc: 'Première séance bouclée. Tu as déjà fait le plus dur.' },
    { id: 'sesiones-10',    icon: '🔟', nombre: 'Dix sur dix',        desc: '10 séances de force bouclées.' },
    { id: 'sesiones-25',    icon: '🎯', nombre: 'Vingt-cinq',         desc: '25 séances de force. C’est déjà une habitude.' },
    { id: 'sesiones-50',    icon: '🏛️', nombre: 'Cinquante',          desc: '50 séances. Le territoire de quelqu’un d’autre.' },
    { id: 'semana-perfecta',icon: '💎', nombre: 'Semaine parfaite',   desc: 'Toutes les séances de force d’une semaine.' },
    { id: 'minimo-3',       icon: '🛡️', nombre: 'Le plancher tient',  desc: '3 semaines de suite en tenant au moins le minimum (2 force + 1 cardio).' },
    { id: 'racha-7',        icon: '🔥', nombre: 'Série de 7',         desc: '7 jours de plan d’affilée, accomplis.' },
    { id: 'racha-14',       icon: '🔥', nombre: 'Série de 14',        desc: '14 jours de plan d’affilée. C’est désormais une habitude.' },
    { id: 'racha-30',       icon: '🌋', nombre: 'Série de 30',        desc: '30 jours de plan d’affilée. Inarrêtable.' },
    { id: 'pasos-7',        icon: '👟', nombre: 'Semaine marchée',    desc: '7 jours de suite à atteindre les pas.' },
    { id: 'disco-10',       icon: 'disc10', nombre: 'Disque de 10',   desc: 'Phase 1 bouclée. L’habitude est de retour.', disco: true },
    { id: 'disco-15',       icon: 'disc15', nombre: 'Disque de 15',   desc: 'Phase 2 bouclée. Te voilà dans la salle.', disco: true },
    { id: 'disco-20',       icon: 'disc20', nombre: 'Disque de 20',   desc: 'Phase 3 bouclée. La vraie charge est à toi.', disco: true },
    { id: 'disco-25',       icon: 'disc25', nombre: 'Disque de 25',   desc: 'Phase 4 bouclée. Collection complète.', disco: true },
    { id: 'kg-2', icon: '', nombre: '', desc: '' },
    { id: 'cintura-95', icon: '', nombre: '', desc: '' },
    { id: 'pr-1',           icon: '🥇', nombre: 'Premier PR',         desc: 'Première fois que tu bats ta meilleure marque sur un exercice.' },
    { id: 'pr-5',           icon: '🥇', nombre: '5 PR',               desc: 'Cinq records personnels battus.' },
    { id: 'pr-15',          icon: '🏆', nombre: '15 PR',              desc: 'Quinze PR. La mémoire musculaire paie ses dividendes.' },
    { id: 'dominada-libre', icon: '🦍', nombre: 'Traction libre',     desc: 'Première traction sans assistance. De retour au club.' },
    { id: 'mealprep-4',     icon: '🍱', nombre: 'Chef du dimanche',   desc: '4 dimanches de meal prep d’affilée.' },
    { id: 'comeback',       icon: '🔁', nombre: 'Le retour',          desc: 'De retour après 4 jours d’arrêt ou plus. Revenir compte plus que tomber.' },
    { id: 'fotos-4',        icon: '📸', nombre: 'La séquence',        desc: 'Les 4 photos de progression faites.' },
    { id: 'checkpoint-s4',  icon: '✅', nombre: 'Checkpoint S4',      desc: '' },
    { id: 'checkpoint-s8',  icon: '✅', nombre: 'Checkpoint S8',      desc: '' },
    { id: 'plan-completo',  icon: '🏁', nombre: 'BACK2PRIME',         desc: '' }
  ];

  /* ---------- LA SCIENCE DU PLAN (revue d’évidence · août 2026) ---------- */
  const CIENCIA = {
    intro: 'Plan passé au crible de l’évidence (méta-analyses et essais 2010-2025). L’idée qui ordonne tout : celui qui revient n’est pas un débutant. Muscle et système nerveux reviennent vite ; le tendon n’a pas de mémoire et donne le tempo.',
    temas: [
      { t: 'Mémoire musculaire', d: 'La reprise est réelle et rapide : la force en ~8 semaines, le volume en ~12. Le mécanisme fait débat ; pas l’effet. C’est pour ça que la double progression peut aller plus vite que chez un débutant, et pour la même raison on ne compresse pas le calendrier : le tendon ne court pas.', ref: 'Rahmati 2022 (méta-analyse, J Cachexia Sarcopenia Muscle) · Cumming 2024 (J Physiol)' },
      { t: 'Tendon : le facteur limitant', d: 'Le collagène du tendon se renouvelle ~10× plus lentement que le muscle. Ce qui l’adapte : des charges lourdes avec contractions lentes de ~3″ (HSR) et des isométriques à 70% (5×45″), qui en plus coupent la douleur sur le moment. Les sauts sont un mauvais stimulus : pas de pliométrie pour « préparer » la course.', ref: 'Mersmann 2017 (Front Physiol) · Rio 2015 (BJSM) · Kongsgaard (HSR)' },
      { t: 'Courir avec du surpoids', d: 'En surpoids, démarrer au-delà de 3 km/sem de course fait exploser les blessures (~31-48% de plus). Monter la cadence à 170-180 réduit l’impact tibial d’~11%. La progression sûre n’est pas la « règle des 10% » : c’est ne pas dépasser ~1,3× ta moyenne des 4 dernières semaines.', ref: 'Bertelsen 2018 (ECR chez des novices en surpoids) · revue de cadence 2025 · consensus CIO sur la charge' },
      { t: 'Déficit optimal', d: 'Un déficit au-delà de ~500-600 kcal annule le gain de muscle même en t’entraînant en force. Le rythme optimal pour garder du maigre est ~0,7% du poids/semaine. Voilà pourquoi le plan perd à 0,6-0,75 kg/sem et pas à 0,9.', ref: 'Murphy & Koehler 2022 (méta-analyse, 59 études) · Garthe 2011' },
      { t: 'Protéines', d: 'En déficit, les pratiquants entraînés ont besoin de 2,3-3,1 g/kg de masse maigre. {p} g te place confortablement dans la fourchette, et la répartition en 4 prises de ≥40 g maximise la synthèse protéique et contrôle la faim.', ref: 'Helms 2014 (revue systématique) · Schoenfeld & Aragon (répartition par prise)' },
      { t: 'Diet break', d: 'Alterner déficit et pauses à maintenance a atténué la chute métabolique et amélioré la perte de gras (étude MATADOR). Sur {s} semaines, sa valeur est ailleurs : il t’apprend qu’une semaine d’arrêt avec un plan n’est pas une rechute.', ref: 'Byrne 2018 (Int J Obesity, MATADOR)' },
      { t: 'Le volume juste', d: 'Plus de séries, plus de muscle, avec des rendements décroissants ; en déficit, l’excès n’ajoute que fatigue et risque. Cible : ~10 séries/muscle/sem en P2, 12-18 en P3-P4. Le minimum (2 forces + 1 cardio) conserve vraiment du muscle.', ref: 'Pelland 2025 (Sports Medicine) · Androulakis-Korakakis 2020 (dose minimale)' },
      { t: 'La décharge bien faite', d: 'Tout arrêter une semaine coûte de la force ; ce qui marche, c’est la moitié du volume avec le même poids. D’où une décharge obligatoire, et de ce type.', ref: 'Coleman 2024 (PeerJ, ECR de décharge)' },
      { t: 'Sommeil', d: 'Dormir 5,5 h en déficit (contre 8,5) a réduit le gras perdu de 55% et multiplié la perte de muscle. Après les protéines et le déficit, c’est ton plus grand levier. D’où la coupure de caféine à 13-14 h.', ref: 'Nedeltcheva 2010 (Ann Intern Med) · Gardiner 2023 (Sleep Med Rev)' },
      { t: 'La santé d’abord', d: 'Après des années à l’arrêt, avant le travail dur de F3-F4 : tension artérielle et bilan basique (lipides, glucose/HbA1c). Au moindre symptôme, médecin avant de continuer.', ref: 'ACSM Preparticipation Health Screening' }
    ]
  };


  const AVISO_LEGAL = 'Le plan sort de tes réponses avec des formules standard (Mifflin-St Jeor et facteurs d’activité) et une marge de ±10% que les règles d’ajustement corrigent avec tes données. Ça ne remplace pas un avis médical : en cas de pathologie, douleur persistante ou doute, consulte un professionnel de santé.';

  /* ---------- TEXTES D’INTERFACE (traduisibles comme le reste) ----------
     Gabarits avec {x} : app.js les remplit avec tpl(). Au changement de langue,
     on charge assets/data.<lang>.js, qui remplace TOUT window.B2P.        */
  const UI = {
    // figuras.js: la leyenda de peso, las etiquetas del plato y el extra por fase
    pLeyenda: ['pesées', 'moyenne hebdo', 'couloir'],
    platoLbl: { v: 'Légumes', p: 'Protéines', c: 'Glucides', g: 'Huile', mano: 'une paume et demie', puno: 'un poing', cuchara: 'une cuillère' },
    nExtra: ['—', '+1 fruit et 40 g de pain les jours d’entraînement', 'pareil, tous les jours'],
    lang: 'fr',
    tabs: ['Aujourd’hui', 'Plan', 'Exercices', 'Nutrition', 'Progrès', 'Succès'],
    dias: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'],
    diasIni: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
    calComidas: 'Les repas du jour',
    meses: ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'],
    hoyTag: 'AUJOURD’HUI',
    semanaLinea: 'Semaine {w}/{t} · Phase {f} · {n} · RPE max {r}',
    empiezaEnDias: 'Départ dans {n} jours', empiezaEn1: 'Départ dans 1 jour', empiezaLunes: 'Départ lundi',
    preplanSub: '{f} · Phase 1 à la maison. En attendant, la ligne de base :',
    prepCintura: 'Tour de taille à jeun',
    prepFotos: 'Photos jour 0 : face et profil, toujours la même lumière',
    prepCompra: 'Courses de la semaine 1 (liste dans Nutrition)',
    prepBascula: 'Balance : lundi, mercredi et vendredi à jeun, toujours pareil',
    practicaMenu: 'Le menu compte dès aujourd’hui ; le {f}, c’est du sérieux.',
    descanso: 'Repos', domingoPrep: 'Dimanche : repos + meal prep', planCompletado: 'Plan terminé',
    calentamiento: 'Échauffement · 6′',
    sesionSub: '{d} · touche un repos pour le chronométrer',
    tendonNombre: 'Protocole tendon',
    cardioHecho: '✓ Cardio fait', cardioMarcar: 'Marquer le cardio fait', minutosReales: 'Minutes réelles :',
    cadenciaSub: 'Cadence 170-180 · foulée courte', recuperacionSub: 'Récupération active', opcional: 'optionnel',
    tibialisAviso: 'Avant : tibialis raises 2×20 (protocole tendon).',
    diaADia: 'Le quotidien',
    hPasos: '8-10k pas', hPasosSub: 'Tous les jours',
    hProte: 'Protéines 4/4', hProteSub: '4 prises ≥{q} g',
    hPeso: 'Poids à jeun', hPesoSub: 'Seule la moyenne hebdo compte',
    hCintura: 'Tour de taille (lundi)', hCinturaSub: 'La métrique reine',
    hPrep: 'Meal prep', hPrepSub: '~90′ et la semaine est réglée',
    hFoto: 'Photos de progression', hFotoSub: 'Face et profil, même lumière',
    pesoGuardado: 'Poids enregistré : {v} kg', cinturaGuardada: 'Tour de taille : {v} cm',
    marcarHecho: 'Marquer comme fait', usarPeso: 'Utiliser ce poids',
    diaAnterior: 'Jour précédent', diaSiguiente: 'Jour suivant',
    cerrarPanel: 'Fermer', panelSinTitulo: 'Détail',
    ajIdiomaSinRed: 'Hors ligne : impossible de télécharger cette langue.',
    versionNueva: 'Nouvelle version · touche pour actualiser',
    quizAfinara: 'Ça affinera ton plan.', quizTitulo: 'Tes goûts',
    quizSi: 'J’aime', quizNo: 'Pas pour moi', quizDeshacer: 'Annuler', quizSaltar: 'Passer',
    quizListo: 'Terminé',
    gen: { kcalHueco: 'Ajuste le riz, les pâtes ou le pain du repas principal pour couvrir la différence.', kcalSube: 'il te manque ~{d}', kcalBaja: 'tu dépasses de ~{d}', chkDentro: 'dans le couloir', chkBajo: 'en dessous', chkAlto: 'au-dessus', lChkD2: 'Poids dans le couloir à la semaine {s}.', tHombroT: 'Épaule · coiffe et dentelé', tHombroD: 'Rotation externe à la bande 2×15 par côté et élévation en Y allongé 2×12, lentes, avant toute poussée et les jours creux. La coiffe gagne avec du contrôle, pas avec du poids.', tHombroW: 'À la maison avec une bande, ou l’haltère le plus léger que tu aies.', r2SinBarra: 'D’abord les répétitions dans la fourchette, ensuite la charge : le plus petit saut dont tu disposes (un haltère de plus, une bande plus dure, une variante plus difficile), seulement avec une technique propre sur toutes les séries. L’app te le suggère.', protHueco: 'Jusqu’à tes {p} g de protéines, le pont c’est une prise extra : un shake ou une portion de plus.', finRecapT: 'Ton bloc, en chiffres', subCorporal: 'Version au poids du corps : atteins proprement le haut de la fourchette, puis passe à la variante supérieure.', subRepe: 'Deuxième tour : sans matériel il n’y a pas trente variantes, et répéter le mouvement proprement construit quand même.', f2nCasa: 'Mise en charge', f2oCasa: 'Basiques avec haltères et bandes, et base de charge : 65-70% de ce que tu pourrais, 3 vraies répétitions en réserve.', f2nNada: 'Progression au poids du corps', f2oNada: 'Progressions au poids du corps et base. D’abord le levier, puis les répétitions : variante plus dure seulement avec une technique propre.', gemNota: 'Le mollet lent est l’assurance du tendon : ne le saute pas.', tendonSinTrote: 'La force revient en semaines ; le tendon demande des mois : son collagène se renouvelle ~10× plus lentement et n’a pas de mémoire. Ce bloc est l’assurance du plan, de la semaine 1 à la dernière.', introNunca: 'Plan vérifié contre l’évidence (méta-analyses et essais 2010-2025). L’idée qui ordonne tout : en partant de zéro on progresse vite (les premiers mois apportent les plus grands gains de force de ta vie), mais le tissu conjonctif traîne derrière le muscle. Voilà pourquoi les charges montent lentement même si tu pourrais plus.', introActivo: 'Plan vérifié contre l’évidence (méta-analyses et essais 2010-2025). L’idée qui ordonne tout : qui s’entraîne déjà n’a pas besoin de plus de punition, mais d’une meilleure dose. Volume juste, progression notée et repos compté séparent se maintenir de progresser.', cNuncaT: 'Partir de zéro', cNuncaD: 'La première année apporte les plus grands gains de force d’une vie : presque toute dose bien faite fonctionne, d’où l’inutilité des programmes extrêmes. La technique d’abord : les répétitions propres d’aujourd’hui sont les kilos sûrs de dans trois mois.', cNuncaR: 'gains de débutant : revues ACSM et méta-analyses dose-réponse', cActivoT: 'Ajouter sans se casser', cActivoD: 'Le risque de qui s’entraîne déjà est d’empiler du volume neuf sur l’ancien. Les sauts au-dessus de ~1,3× ta charge moyenne récente font exploser les blessures : ajoute une variable à la fois (jours, volume ou intensité), jamais les trois.', cActivoR: 'consensus CIO sur la charge d’entraînement (ACWR)', cSupT: 'Un surplus qui construit', cSupD: 'Construire du muscle demande un petit surplus (~250-350 kcal) : au-dessus, l’extra part vers le gras. La balance doit monter lentement ; si elle monte vite ce n’est pas du muscle, la synthèse protéique a un plafond hebdomadaire.', cSupR: 'Garthe 2013 · Slater 2019 (surplus et composition)', r1Nunca: 'Chaque phase a son plafond. En partant de zéro, la force monte plus vite que la résistance de tes tissus : laisse 2-3 vraies répétitions en réserve et les gains arrivent quand même.', r1Activo: 'Chaque phase a son plafond. Ce volume est nouveau même si tu t’entraînes : respecte le RPE les deux premières semaines, monte ensuite. Freiner à temps, c’est ce qui te laisse progresser {s} semaines d’affilée.', r8Nunca: 'Au début, l’ennemi n’est pas la dureté, c’est l’irrégularité. Plancher de la semaine chaotique : 2 forces + 1 cardio.', r8Activo: 'Qui s’entraîne a aussi des semaines impossibles. Plancher : 2 forces + 1 cardio. Rien ne se perd ; le reste se récupère.', f1nNunca: 'Fondations', f1oNunca: 'Habitude et patrons de mouvement, sans punir les articulations. Rester sur ta faim est intentionnel.', f2nNunca: 'Technique', f2oNunca: 'Basiques avec charge légère : chaque répétition propre maintenant, ce sont des kilos sûrs après. Toujours loin de l’échec.', f3oNunca: 'Volume et intensité pour de vrai, la technique rodée. Termine chaque série avec 2 vraies répétitions en réserve.', f1nActivo: 'Base', f1oActivo: 'Deux semaines d’adaptation : dose connue, registre en route, technique affûtée. Ensuite, on monte.', f2nActivo: 'Construction', f2oActivo: 'Volume progressif sur ta base : 70-75% de ce que tu pourrais, 2-3 vraies répétitions en réserve.', f3oActivo: 'Volume et intensité réels pour forcer le changement. Termine chaque série avec 2 vraies répétitions en réserve.', cierrePerder: 'Le but n’est pas le {f} : c’est d’y arriver en t’entraînant par habitude, sans cycle on/off. Le poids qui descend est la conséquence.', cierreRecomp: 'Le but n’est pas le {f} : c’est d’y arriver avec l’habitude installée et les vêtements qui tombent autrement. Recomposer est lent par design ; la constance est le but.', cierreGanar: 'Le but n’est pas le {f} : c’est d’y arriver plus fort, l’habitude installée. Le muscle se construit en mois : le bloc suivant commence où celui-ci finit.', cierreManten: 'Le but n’est pas le {f} : c’est que s’entraîner cesse d’être un plan pour devenir une habitude. Maintenir, c’est gagner.', cierreRenueva: 'Pour renouveler le bloc : Réglages › Créer / refaire mon plan.', platoVegetariano: '3 œufs + 2 blancs, ou 250 g de skyr ou fromage blanc + whey, ou 200 g de tofu ferme, ou 150 g de tempeh, ou 250 g de légumineuses cuites + 1 œuf.', platoVegano: '200-250 g de tofu ferme, ou 150-180 g de tempeh, ou 250 g de légumineuses cuites + une dose de protéine végétale, ou 80 g (sec) de soja texturé.', suplVegT: 'Protéine végétale', suplVegD: '1 dose de protéine de pois ou de soja dans la prise pré-sommeil, et une autre les jours courts en protéines.', numRecomp: 'Déficit doux, ~300-450 kcal/jour : recomposer demande de la patience.', numSup: 'Surplus ~250-350 kcal/jour : plus, ce n’est pas plus de muscle, c’est du gras.', numMan: 'Ta maintenance estimée : la moyenne hebdo juge et ajuste.', ritmoSubeT: 'Rythme de prise attendu', ritmoManT: 'Rythme attendu', ritmoSubeN: '≈0,25% du poids/sem : ce que le muscle peut construire. Moyenne hebdo.', ritmoManN: 'La moyenne hebdo doit rester à ±0,3 kg de ton départ.', wjN1: 'Marche-course I', wjN2: 'Marche-course II', wjN3: 'Marche-course III', lChkN: 'Checkpoint S{s}', lChkD: 'Poids dans le couloir (ou mieux) à la semaine {s}.', alRapidoBaja: 'Ajoute 150 kcal de glucides. À ce rythme, le déficit mange aussi du muscle.', alLentoBaja: 'Vérifie portions et pas pendant deux jours. Si ça reste plat, retire 100 kcal de glucides les jours de repos seulement.', alRapidoSube: 'Tu montes plus vite que le muscle ne se construit : retire 150 kcal de glucides, sinon le surplus sera du gras.', alLentoSube: 'Le surplus ne se voit pas sur la balance : ajoute 150 kcal de glucides les jours d’entraînement.', alMantenT: 'Tu dérives de la maintenance', alMantenD: 'Deux semaines de dérive d’affilée : ajuste 100-150 kcal dans la direction opposée et ne touche pas à l’entraînement.', circProg: 'Ajoute 1-2 répétitions par semaine là où ta technique reste propre : c’est ça, la progression.', durAprox: '≈{m}′', splitFbC: 'Full Body', splitTpC: 'Haut · Bas', splitPplC: 'Push · Pull · Legs', faseSub: '{s} ×{d}', nf1: 'F1–F2 (sem 1-{a})', nf2: 'F3 (sem {b}-{c})', nf3: 'F4 (sem {d}-{e})', dietBreakNota: 'Semaine {w} : diet break à ~{k} kcal', hitoCribadoT: 'Bilan santé', hitoCribadoD: 'Avant de charger pour de vrai, si tu es resté des années à l’arrêt : tension en pharmacie et bilan basique (lipides, glucose). 15 minutes.', hitoDietT: 'Diet break', hitoDietD: 'Semaine à la maintenance, ~{k} kcal : +2 portions de glucides par jour. Protéines et entraînement inchangés. Le lundi suivant, déficit à nouveau.', hitoDescargaT: 'Décharge · obligatoire', hitoDescargaD: 'Même routine, moitié des séries, même charge. Pas un arrêt : tendons et articulations se reposent sans perdre de tissu.', tomaNocheAlt: '+ chaque soir : prise pré-sommeil avec protéine végétale, ~40 g en shake. ', franjaM: 'Séance le matin : petit-déj après, pas avant.', franjaMd: 'Séance à midi : le repas principal tombe juste après.', franjaT: 'Séance le soir : léger avant ; le dîner est le post-entraînement.', cardioLibreT: 'Cardio : {d}', cardioLibreD: '{m}′ à un rythme confortable et régulier. Ton sport compte autant que le footing.', chk1: 'Hors du couloir : vérifie portions et pas avant de toucher à quoi que ce soit. Au début, l’eau bouge aussi.', chk2: 'Deux semaines hors piste : ajuste 150 kcal de glucides dans la bonne direction. Les protéines ne bougent pas.', chk3: 'Clôture : photos, mesures et le bloc suivant, décidé avec des données.', lKgN: '−{v} kg', lKgD: 'Moyenne hebdo {v} kg sous ton départ.', lKgUpN: '+{v} kg', lKgUpD: 'Moyenne hebdo {v} kg au-dessus du départ. Du muscle, brique par brique.', lCintN: 'Taille −{v}', lCintD: 'Tour de taille sous {v} cm.', lReinaN: 'Métrique reine', lReinaD: 'Taille sous la moitié de ta stature : {v} cm.', lFinDesc: 'Plan de {s} semaines terminé. Le but était l’habitude ; le reste est conséquence.', marca: 'Plan généré pour toi', cuida: 'ménage : {a}', datos: '{p} kg · {a} cm · {e} ans', menuAviso: '{n} plats ne collent pas à ton régime : remplace-les par un autre du livre de recettes, déjà filtré.', prepNota: 'Seul ce qui est marqué « batch » se cuisine le dimanche ; le reste, à la minute. Les courses comptent déjà les répétitions de la semaine.' },
    pBarraT: 'La barre du plan', pBarraSub: '{a} disques chargés sur {b}',
    patrones: { eh: 'Poussée horizontale', ev: 'Poussée verticale', th: 'Tirage horizontal', tv: 'Tirage vertical', rod: 'Dominante genou', bis: 'Charnière de hanche', zan: 'Fente', core: 'Gainage', flex: 'Flexion du tronc', curl: 'Flexion de coude', ext: 'Extension de coude', gem: 'Mollet', ais: 'Isolation' },
    quizCatEj: 'Exercice', quizCatDep: 'Sport', quizCatCom: 'Plat',
    alta: { t: 'Crée ton profil', sub: 'Force, assiette et progrès. Ton plan, en deux minutes.', nombreL: 'Ton prénom', ph: 'Comment on t’appelle ?', cta: 'Commencer', local: 'Tes données vivent uniquement sur cet appareil.', valNombre: 'Écris un prénom de 2 à 24 caractères.', idioma: 'Langue' },
    rev: { evFecha: 'se termine le {b}, juste avant', evSinFecha: 'sans date : c’est l’horizon choisi qui commande', minT: '{v} minutes par séance', minSub: 'séances courtes : les mouvements de base restent', evT: 'Objectif : {e}', evSub: 'la date commande : régularité avant perfection', durOpen: 'Sans date : blocs de {s} semaines, renouvelables', t: '{n}, ton plan est prêt', tAnon: 'Ton plan est prêt', sub: 'Fait avec tes réponses, pas un modèle.',
      splitT: 'Force {d} jours par semaine', splitFb: 'corps entier : ce qui rend le plus avec peu de jours', splitTp: 'haut / bas, en paires', splitPpl: 'pousser / tirer / jambes',
      kcalT: '{k} kcal par jour', kDef: 'un déficit de {v} kcal, sans sacrifier le muscle', kSup: 'un surplus de {v} kcal pour construire du muscle', kMan: 'à ta maintenance, protéines aux commandes',
      protT: '{p} g de protéines par jour', protSub: '{v} g par kilo de poids',
      durT: '{s} semaines devant toi', durSub: 'du {a} au {b}',
      subsT: '{n} exercices remplacés', subsSub: 'selon ton matériel ou tes refus',
      cuidaT: 'Attention renforcée : {a}', cuidaSub: 'les exercices concernés portent un avertissement',
      menuT: 'Menu ajusté à ta table', menuSub: 'régime et intolérances appliqués à toute la semaine', menuAv: '{n} plats ne collent pas : signalé dans Nutrition',
      gustosT: '{a} j’aime · {b} refus', gustosSub: 'ce que tu as refusé reste hors de ton plan',
      cta: 'Voir ma semaine 1', micro: 'Refais le questionnaire quand tu veux : tout se recalcule.' },
    tour: { salta: 'Passer', sigue: 'Suivant', listo: 'À l’entraînement', otraVez: 'Revoir la visite de bienvenue',
      antes: ['Ton plan est lancé', 'Jusqu’au jour que tu as choisi, Aujourd’hui te montre les étapes préalables. Le menu est déjà prêt : fais tes courses.'],
      pasos: [
      ['Voici AUJOURD’HUI', 'Ta séance du jour : exercices, séries et repos. Touche-en un pour voir technique et muscle.'],
      ['Les repas du jour', 'Petit-déjeuner, déjeuner, dîner et prise du soir, pour ton objectif. Touche un plat : recette entière.'],
      ['Ton journal quotidien', 'Poids, tour de taille et habitudes : un toucher chacun. Clôture la journée avec le bouton en bas.'],
      ['Le plan entier', 'Chaque phase dans sa couleur. Touche un jour : sa séance et ses repas. Glisse pour changer de mois.'],
      ['Les quatre phases', 'Chaque bande indique ses semaines et son intensité. Déplie-la : ce qu’elle vise.'],
      ['Ta bibliothèque d’exercices', 'Tous les mouvements par zone : muscle en couleur, technique et quoi utiliser s’il manque du matériel.'],
      ['Ton objectif à table', 'Calories et macros de la phase, et de combien le menu est en dessous ou au-dessus. Le pourquoi, dans Mon profil.'],
      ['Recettes', 'Petits-déjeuners, déjeuners, dîners et compléments filtrés pour toi, avec photo, ingrédients et pas à pas.'],
      ['Les courses de la semaine', 'Toute la semaine par rayon, avec la photo de chaque produit. Coche ce que tu as déjà.'],
      ['Progrès honnêtes', 'Poids, taille, charges et régularité, en graphiques. Trop vite ? L’app te freine.'],
      ['Tes badges', 'Ils se gagnent par la régularité, pas par l’intensité. Chacun dit comment l’obtenir.'],
      ['Deux bulles', 'La loupe cherche exercices, plats et réglages. La bulle sert à me signaler bugs ou idées.'],
      ['Mon profil', 'Tes réponses, refaire le plan, le partager, exporter tes données, confidentialité et supprimer le compte.'] ] },
    cuest: {
      evFechaT: 'C’est quel jour ?', evFechaP: 'Le plan se termine juste avant. Sans date, c’est l’horizon qui commande.', evFechaSaltar: 'Je ne sais pas encore', evFechaMal: 'Choisis une date entre 2 et 12 mois à partir d’aujourd’hui.', 
      resLObj: 'Objectif', resLEv: 'Pour', resLDur: 'Horizon', resLHist: 'Tu viens de', resLMat: 'Matériel', resLDieta: 'Table', resLFranja: 'Créneau', resLLes: 'Attention', resLSin: 'Tu évites', 
      gateT: 'Ta santé décide', gateTxt: 'Tu as indiqué une condition médicale qui limite l’exercice. Avant de générer le plan, demande à ton médecin son feu vert pour de la force {d} jours par semaine.',
      gateGuardado: 'Tes réponses sont gardées.', gateOk: 'J’ai le feu vert', gateSalir: 'Sortir pour l’instant',
      gateHoyT: 'En pause, pour une raison', gateHoyTxt: 'Il manque le feu vert de ton médecin. Avec lui, le plan se génère à l’instant.', gateVolver: 'Reprendre le questionnaire',
      resCta: 'Générer mon plan', resGen: 'Génération de ton plan…',
      titulo: 'Ton plan, sur mesure', atras: 'Retour', sigue: 'Continuer',
      inicioT: 'Quand veux-tu commencer ?', inicioP: 'Le plan se construit à partir de ce jour.', inicioHoy: 'Aujourd’hui', inicioSemana: 'Cette semaine', inicioLunes: 'Lundi prochain', inicioExacto: 'Un jour précis', inicioSemT: 'Quel jour de cette semaine ?', inicioDiaT: 'Quel jour veux-tu commencer ?', sexoT: 'Ton corps', sexoP: 'Uniquement pour calculer tes calories.', sexoH: 'Homme', sexoM: 'Femme', sexoX: 'Je préfère ne pas dire',
      medidasT: 'Tes mesures', edadL: 'Âge', alturaL: 'Taille (cm)', pesoL: 'Poids (kg)', cinturaL: 'Tour de taille (cm) · optionnel',
      objT: 'Tu cherches quoi ?', objPerder: 'Perdre du gras', objRecomp: 'Recomposition : moins de gras, plus de muscle', objGanar: 'Prendre du muscle', objMantener: 'Me maintenir',
      evT: 'Pour quoi ?', evBoda: 'Un mariage', evOpo: 'Un concours', evVerano: 'Opération été', evSiempre: 'Pour toujours',
      durT: 'Tu te donnes combien de temps ?', dur3: '3 mois', dur6: '6 mois', dur12: '12 mois', durAlways: 'Sans date : une habitude',
      histT: 'Tu viens d’où ?', histP: 'Ça change le démarrage du plan.', histNunca: 'Jamais entraîné', histRetoma: 'De retour après des années d’arrêt', histActivo: 'Je m’entraîne',
      diasL: 'Jours par semaine', minL: 'Minutes par séance', franjaT: 'Tu préfères quand ?', franjaM: 'Matin', franjaMd: 'Midi', franjaT2: 'Soir',
      matT: 'Avec quel matériel ?', matNada: 'Sans matériel', matCasa: 'Maison : haltères et élastiques', matGym: 'Salle complète',
      lesT: 'Douleurs ou blessures ?', lesRodilla: 'Genou', lesHombro: 'Épaule', lesLumbar: 'Lombaires', lesNo: 'Aucune',
      medT: 'Une condition médicale qui limite l’exercice ?', si: 'Oui', no: 'Non',
      dietaT: 'Ta table', dietaNormal: 'Je mange de tout', dietaVegetariano: 'Végétarien', dietaVegano: 'Végane',
      sinT: 'Tu évites quelque chose ?', sinGluten: 'Gluten', sinLactosa: 'Lactose', sinFrutos: 'Fruits à coque', sinNada: 'Rien',
      resT: 'Ton profil est prêt', resP: 'Ton plan se génère à partir de ça.',
      resGustos: '{a} j’aime · {b} passés', resProfesional: 'Une de tes réponses demande de consulter d’abord un professionnel de santé.',
      resGuardar: 'Enregistrer le profil', resGuardado: 'Profil enregistré',
      valNum: 'Vérifie {c} : entre {a} et {b}.'
    },
    gPeso: 'Graphique du poids corporel', gCintura: 'Graphique du tour de taille',
    gCargas: 'Graphique des charges', gAdherencia: 'Graphique d’assiduité hebdomadaire',
    gRango: '{n} relevés, de {a} à {b} {u}', gUnico: '1 relevé, {a} {u}',
    gSemanas: '{n} sur {t} semaines avec données',
    gSinDatos: 'pas encore de données',
    valFuera: 'Saisis une valeur entre {a} et {b} {u}.', descargaDosis: 'décharge',
    hechosDe: 'Faits {a} sur {b} · à {c} ça compte comme séance',
    cerrarSinSesion: 'Clore sans séance', diaCerradoSinRacha: '✓ Journée close',
    sinRachaHoy: 'Aujourd\'hui ne compte pas pour la série.', mejorRachaNota: 'Ton record : {n} jours.',
    sinSesionToast: 'Journée close sans séance : elle ne compte pas.',
    reabrirDia: 'Rouvrir la journée', diaReabierto: 'Journée rouverte', mejorLbl: 'Record',
    cerrarDia: 'Clore la journée', diaCerradoBtn: '✓ Journée close · série {n}',
    diaCerradoToast: '✓ Journée close. Série : {n}', diaCerradoSolo: 'Journée close.',
    sigueEditando: 'Ça s’enregistre tout seul ; tu peux continuer à éditer.',
    comidaHoy: 'Les repas du jour', comidaHoySub: '{kcal} kcal · {p} g de protéines en 4 prises',
    desayuno: 'Petit-déj', comidaLbl: 'Déjeuner', cena: 'Dîner', presueno: 'Pré-sommeil',
    secCompra: { fresco: 'Frais', prote: 'Protéines', lacteo: 'Laitages et boissons', despensa: 'Épicerie', congelado: 'Surgelés', supl: 'Compléments' }, despensaTag: 'épicerie',
    comidaLibreMn: 'REPAS LIBRE', comidaLibreTitulo: 'Repas libre', comidaLibreTag: 'un repas, pas une journée', tuya: 'à toi',
    dietBreakChip: 'Diet break : +2 portions de glucides aujourd’hui. Protéines inchangées.',
    extraChip: 'Extra P{f} : +1 fruit et 40 g de pain au déjeuner.', sugRepite: '↻ répète {v}',
    repsAMediasToast: 'Noté : il manquait des reps (tu répéteras le poids)', repsLimpiasToast: 'Toutes les reps propres',
    repsAMediasTag: 'reps incomplètes', repsLimpias: 'reps propres', repsCortas: 'reps manquées',
    prToast: 'PR sur {e} : {v} kg', ya: 'C’EST PARTI !',
    fHistorial: 'Ton historique', fMejor: 'record {v} kg',
    fComo: 'Comment l’exécuter', fErrores: 'Erreurs classiques', fAlt: 'Alternatives',
    fVideo: 'Voir la technique en vidéo',
    fDomiBtn: 'Aujourd’hui, j’ai réussi ma première traction sans aide', fDomiOk: 'Enregistrée', fDomiYa: 'Traction libre déjà enregistrée',
    vReglas8: 'Les 8 règles', vReglasSub: 'en cas de doute, la règle gagne',
    vCalendario: 'Calendrier',
    vSeguros: 'Les assurances du plan', libDescartado: 'écarté', libSinMaterial: 'sans matériel', libFuera: 'hors de ton plan', vBiblioteca: 'Bibliothèque d’exercices', vTocaCualquiera: 'touche n’importe lequel',
    vCiencia: 'La science du plan',
    senalesTitulo: 'Signaux d’arrêt', objetivoReal: 'Le vrai objectif', recuerda: 'Rappelle-toi',
    fase: 'Phase', sem: 'Sem', fuerzaLbl: 'Force',
    zonas: { empuje: 'Poussée', tiron: 'Tirage', pierna: 'Jambes et hanches', core: 'Core' },
    chipsNutri: ['Objectif', 'L’assiette', 'Recettes', 'Menu', 'Courses', 'Meal prep', 'Suppléments'],
    nObjetivo: 'Ton objectif maintenant', nSemana: 'semaine {w}',
    nNumeros: 'D’où sortent les chiffres', nPlato: 'Comment monter chaque repas',
    nRecetario: 'Livre de recettes', nToca: 'touche pour cuisiner',
    nCompra: 'Les courses de la semaine', nPrepDom: 'Meal prep du dimanche', nSupl: 'Suppléments',
    nReiniciar: 'réinitialiser', nProteLbl: 'Prot', nGrasaLbl: 'Lipides', nCarbosLbl: 'Glucides', kcalLbl: 'kcal', nMenuLbl: 'menu',
    nDietBreakTitulo: 'Cette semaine : diet break', nDietBreakTxt: '~{k} kcal : +2 portions de glucides par jour. Protéines inchangées. Entraînement inchangé.',
    nTomaNota: '+ chaque soir : prise pré-sommeil (skyr + whey). ',
    nIngredientes: 'Ingrédients (1 portion)', nPasos: 'Étapes', opcionalParen: ' (optionnel)',
    chipsProg: ['Résumé', 'Poids', 'Taille', 'Charges', 'Semaines', 'Checkpoints'],
    pPeso: 'Poids', pPerdido: 'Perdu', pGanado: 'Gagné', pCintura: 'Taille', pAdh: 'Assiduité', pSesiones: 'Séances', pRacha: 'Série',
    pMediaS: 'moyenne S{w}', pSinDatos: 'aucune donnée', pDesde: 'depuis {v}', pCinturaSub: '{f} · objectif <{m}', pCinturaLunes: 'lundi à jeun',
    pFuerzas: '{a}/{b} force', pDeFuerza: 'de force', pDiasCumplidos: 'jours tenus',
    pPesoTitulo: 'Poids',
    pCinturaTitulo: 'Tour de taille', pCinturaTituloSub: 'la métrique reine · objectif <{m} cm',
    pCargas: 'Charges', pCargasSub: 'kg par séance',
    pAdhTitulo: 'Assiduité', pAdhSub: 'forces bouclées par semaine',
    pChk: 'Checkpoints', pEsperado: 'Attendu', pReal: 'Réel', pSiDesvias: 'Si tu dévies',
    pTabla: 'tableau', pGrafica: 'graphique', pFecha: 'Date',
    pLifts: { 'press-banca': 'Couché', 'sentadilla-barra': 'Squat', 'rdl-barra': 'Roumain' }, pMeta91: 'objectif {m}', pAguaCreatina: 'eau (premières semaines)', pLineaBase: 'Ligne de base',
    pMediaSemana: 'Moyenne S{w}',
    pVacioPeso: 'Ici, tes pesées du lundi, mercredi et vendredi.',
    pVacioCintura: 'Chaque lundi à jeun',
    pVacioCargas: 'Enregistre des kg sur cet exercice et tu verras ici l’escalade.',
    pVacioAdh: 'Semaine après semaine, ta constance se verra ici',
    pCheckpointSemana: 'Semaine de checkpoint', pEsperadoRango: 'Attendu : {a}–{b} kg', pLlevas: ' · tu en es à {v}', pSinPesajes: ' · pas encore de pesée cette semaine',
    pRapido: 'Tu vas trop vite', pLento: 'Plus lent que prévu',
    pFrenaTrote: 'Lève le pied sur la course', pFrenaTxt: 'Cette semaine tu cours {r}× ta moyenne récente. Au-delà de 1,3×, le risque de blessure explose : réduis ou marche.',
    lDiscos: 'La collection de disques', lDiscosSub: 'un par phase bouclée',
    lLogros: 'Succès', lFuerzas: 'Force', lPRs: 'PR', lPerdido: 'Perdu', lMejorRacha: 'Meilleure série', lLogrosN: 'Succès', lFotos: 'Photos',
    perfilCinturaAdd: '+ Ajouter le tour de taille', perfilCinturaNota: 'Il devient ta ligne de base et active l’objectif et les succès de tour de taille. Le plan ne change pas.', cerrarSesion: 'Se déconnecter', cerrarSesionNota: 'Ton plan et tes registres restent sur cet appareil.', rehacerSub: 'Que veux-tu refaire ?', rehacerTodo: 'Questionnaire complet', rehacerTodoSub: 'Données et goûts, de haut en bas.', rehacerDatos: 'Seulement mes données', rehacerDatosSub: 'Âge, objectif, jours, matériel… Le paquet ne bouge pas.', rehacerGustos: 'Seulement mes goûts', rehacerGustosSub: 'Le paquet de cartes, depuis zéro.', perfilDetrasT: 'Derrière le plan', buscarT: 'Chercher dans l’app', buscarPH: 'Exercice, plat, section…', buscarNada: 'Rien à ce nom. Essaie un autre mot.', perfilT: 'Mon profil', perfilDatosT: 'Tes réponses', perfilPlanT: 'Ton plan, en bref', ajustes: 'Réglages', ajustesSub: 'Tes données vivent uniquement sur cet appareil.', ajGuardar: 'Enregistrer la ligne de base', ajGuardado: 'Enregistré',
    ajCopia: 'Sauvegarde',
    ajCopiaTxt: 'Les données ne quittent pas le téléphone. Fais une sauvegarde de temps en temps, ou avant de changer d’appareil.',
    ajExportar: 'Exporter', ajImportar: 'Importer', ajImportOk: 'Sauvegarde restaurée', ajImportErr: 'Ce fichier ne ressemble pas à une sauvegarde BACK2PRIME',
    ajIdioma: 'Langue', ajIdiomaNota: 'L’app se recharge au changement. Tes données restent intactes.',
    ajRehacer: 'Créer / refaire mon plan', ajRehacerNota: 'Retour au questionnaire. Tes registres quotidiens ne bougent pas.', ajBorrar: 'Supprimer le profil et toutes les données', ajBorrarConfirma: 'Sûr ? Touche encore une fois pour tout effacer',
    celebraOk: 'On continue',
    navAria: 'Navigation principale',
    pPrivacidad: 'Politique de confidentialité',
    rep: { t: 'Signaler', sub: 'Quelque chose cloche, ou une idée ? Dis-le-moi.', bug: 'Ça ne marche pas', idea: 'Une idée', otro: 'Autre chose', txtL: 'Raconte', ph: 'Que s’est-il passé ? Dis sur quel écran et ce que tu attendais.', enviar: 'Envoyer', gracias: 'Bien reçu, merci.', corto: 'Écris-en un peu plus pour que ce soit compréhensible.', repRitmo: 'Attends une minute avant d’en envoyer un autre.', errRed: 'Envoi impossible : vérifie ta connexion.', adjunta: 'Version, plateforme, langue et écran sont joints. Rien de ton plan ni de tes registres.' },
    nube: { correoL: 'E-mail', claveL: 'Mot de passe (8 minimum)', verClave: 'Afficher le mot de passe', ocultarClave: 'Masquer le mot de passe', previoT: 'Plan précédent sur cet appareil', previoTxt: 'Cet appareil garde un plan d’avant les comptes. Il n’est pas repris tout seul, au cas où il ne serait pas à toi. S’il l’est, récupère-le : il remplacera l’actuel.', previoCta: 'Récupérer ce plan', previoOk: 'Plan récupéré', entrar: 'Se connecter', crear: 'Créer un compte', aCrear: 'Première fois ? Crée ton compte', aEntrar: 'Déjà un compte ? Connecte-toi', olvide: 'Mot de passe oublié', enviadoReset: 'E-mail envoyé : ouvre le lien pour le changer', nuevaClaveT: 'Choisis un nouveau mot de passe', guardarClave: 'Enregistrer le mot de passe', cambiada: 'Mot de passe changé : tu peux te connecter', confirmaCorreo: 'Confirme le compte depuis ta boîte mail, puis connecte-toi ici', yaExiste: 'Cet e-mail a déjà un compte : connecte-toi avec ton mot de passe', errCred: 'E-mail ou mot de passe incorrects', errCorreo: 'Écris un e-mail valide', errClaveCorta: 'Minimum 8 caractères', errRitmo: 'Trop de tentatives d’affilée : attends un instant', errRed: 'Pas de connexion au serveur : réessaie', local: 'Ton plan suit ton compte sur tous tes appareils. Toi seul le vois.', ajustesSub: 'Ton plan vit dans ton compte. Toi seul le vois.', cerrarSesionNota: 'Ton plan reste dans ton compte. Reconnecte-toi et tu reprends où tu en étais.' },
    comp: { t: 'Partager mon plan', nota: 'Lien public en lecture seule vers ton plan. Sans ton poids ni tes registres.', copiado: 'Lien copié', quitar: 'Ne plus partager', quitado: 'Lien désactivé', vT: 'Le plan de {n}', vSub: 'Généré avec BACK2PRIME', vCta: 'Fais le tien', noExiste: 'Ce lien n’existe pas ou son propriétaire l’a désactivé', sem: '{s} semaines', dias: '{d} jours/semaine' },
    nuevoDia: 'Nouveau jour : {f}'
  };


    const QUIZ_DEP = [{ id: 'running', n: 'Course à pied' }, { id: 'natacion', n: 'Natation' }, { id: 'ciclismo', n: 'Vélo' }, { id: 'padel', n: 'Padel' }, { id: 'futbol', n: 'Football' }, { id: 'baloncesto', n: 'Basket' }, { id: 'volley', n: 'Volley' }, { id: 'yoga', n: 'Yoga' }, { id: 'calistenia', n: 'Callisthénie' }, { id: 'boxeo', n: 'Boxe' }];
  /* ---------- PRODUCTOS: el nombre con el que se COMPRA cada pid ----------
     La compra pinta esto, no el texto de la receta: «tomate», no «tomate en
     rodajas». Lo de en rodajas es cosa de la receta, y alli se queda. */
  const PRODUCTOS = {
    aceitunas: 'Olives',
    aguacate: 'Avocat',
    ajo: 'Ail',
    alubias: 'Haricots noirs cuits',
    aove: 'Huile d’olive vierge extra',
    arroz: 'Riz',
    atun: 'Thon au naturel',
    avena: 'Flocons d’avoine',
    'bebida-soja': 'Boisson de soja',
    brocoli: 'Brocoli',
    calabacin: 'Courgette',
    calabaza: 'Potiron',
    caldo: 'Bouillon de légumes',
    canela: 'Cannelle',
    cebolla: 'Oignon',
    champinones: 'Champignons',
    chia: 'Graines de chia',
    cilantro: 'Coriandre',
    claras: 'Blancs d’œufs',
    edamame: 'Edamame',
    especias: 'Épices',
    espinacas: 'Épinards',
    fruta: 'Fruits',
    'frutos-rojos': 'Fruits rouges',
    gambas: 'Crevettes décortiquées',
    garbanzos: 'Pois chiches cuits',
    'harina-garbanzo': 'Farine de pois chiche',
    huevos: 'Œufs',
    hummus: 'Houmous',
    'leche-coco': 'Lait de coco',
    lechuga: 'Laitue',
    lentejas: 'Lentilles cuites',
    'lentejas-rojas': 'Lentilles corail',
    levadura: 'Levure nutritionnelle',
    limon: 'Citron',
    merluza: 'Merlu',
    nueces: 'Noix',
    pan: 'Pain complet',
    'pan-sg': 'Pain sans gluten',
    'pasta-lentejas': 'Pâtes de lentilles',
    patata: 'Pomme de terre',
    pepino: 'Concombre',
    pimiento: 'Poivron',
    pipas: 'Graines de courge',
    platano: 'Banane',
    pollo: 'Blanc de poulet',
    'prote-vegetal': 'Protéine végétale en poudre',
    quinoa: 'Quinoa',
    sal: 'Sel',
    salmon: 'Saumon',
    'salsa-soja': 'Sauce soja',
    sesamo: 'Graines de sésame',
    skyr: 'Skyr',
    'soja-text': 'Protéine de soja texturée',
    tamari: 'Tamari',
    tempeh: 'Tempeh',
    ternera: 'Bœuf maigre',
    tofu: 'Tofu ferme',
    tomate: 'Tomate',
    'tomate-triturado': 'Tomates concassées',
    verduras: 'Légumes variés',
    whey: 'Whey',
    'yogur-soja': 'Yaourt de soja',
    zanahoria: 'Carotte',
  };
  /* ---------- MUJER: embarazo, posparto y ciclo ----------
     Un solo bloque, con la misma forma en los seis idiomas: solo cambian los
     textos. Asi los espejos se traducen enteros y el inserto es el mismo. Las
     cifras salen de las guias citadas en el informe de evidencia (ACOG 804,
     canadienses 2019 y 2025, SEGO 2019, Goom 2019, EFSA, IOM 2009, AESAN). */
  const MUJER = {
    EJERCICIOS: {
      'cuadrupedia': { pat: 'core', pic: 'cuadrupedia',
        nombre: 'Quadrupédie (bird-dog)', mm: { p: ['abdomen'], s: ['gluteo'] }, zona: 'core', musc: ['Core profond', 'fessier', 'érecteurs'], equipo: 'Rien',
        cues: ['À quatre pattes, mains sous les épaules et genoux sous les hanches', 'Étends le bras et la jambe opposés sans que les lombaires bougent', 'Expire en étendant ; reviens lentement et change de côté'],
        err: ['Cambrer les lombaires en montant la jambe (monte-la moins haut)', 'Tourner la hanche pour aller plus loin', 'Bloquer la respiration'],
        alt: [{ n: 'Jambe seule, ou bras seul', por: 'si tu perds l’équilibre ou les lombaires' }, { n: 'Avec pause de 3″ en haut', por: 'si 10 répétitions te semblent courtes' }],
        mol: 'Si les poignets gênent, appuie sur les poings ou attrape des haltères fixes en guise de poignées.'
      },
      'plancha-inclinada': { pat: 'core', pic: 'plancha-inclinada',
        nombre: 'Planche inclinée', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Core antérieur', 'dentelé'], equipo: 'Rien (table, banc ou mur)',
        cues: ['Mains sur une table ou un banc, corps aligné de la tête aux talons', 'Côtes basses et bassin neutre : rien à cambrer', 'Respire normalement ; plus l’appui est haut, plus c’est facile'],
        err: ['Hanches qui tombent ou qui montent', 'Épaules haussées vers les oreilles', 'Bloquer la respiration'],
        alt: [{ n: 'Au mur', por: 'si la table devient dure ou dans la dernière ligne droite de la grossesse' }, { n: 'Planche au sol', por: 'hors grossesse, quand 40″ sortent faciles' }],
        mol: 'Si tu sens une poussée vers l’extérieur dans le ventre ou dans le périnée, monte l’inclinaison.'
      },
      'suelo-pelvico': { pat: 'sp', pic: 'suelo-pelvico',
        nombre: 'Périnée', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Plancher pelvien'], equipo: 'Rien',
        cues: ['Assise ou allongée sur le côté : contracte comme pour couper le jet d’urine et retenir un gaz, en même temps', 'Tiens 6-8″ en respirant ; relâche complètement avant de répéter', 'Termine par 5 contractions rapides de 1″'],
        err: ['Serrer les fessiers, les cuisses ou le ventre au lieu du périnée', 'Bloquer la respiration', 'Ne pas relâcher complètement entre les répétitions'],
        alt: [{ n: 'Allongée sur le côté', por: 'si assise tu ne sens pas la contraction' }, { n: 'Debout, dans la file ou au feu rouge', por: 'quand tu le maîtrises : c’est comme ça qu’il se fait tous les jours' }],
        mol: 'Si avec des fuites, une pesanteur ou une douleur ça ne s’améliore pas en quelques semaines, rééducation périnéale : c’est ce que disent les recommandations.'
      }
    },
    SESIONES: {
      'emb1-a': { nombre: 'Force A · premier trimestre', tipo: 'fuerza', fase: 1, dur: '~40′', calent: true, bloques: [
        { e: 'sentadilla-pc',     s: 3, r: '10-12', d: 75, n: 'Avec un haltère contre la poitrine si tu en as un ; sur un box en cas de vertiges' },
        { e: 'press-militar-mc',  s: 3, r: '10',    d: 75, n: 'Assise, avec dossier' },
        { e: 'remo-mancuerna',    s: 3, r: '10/côté', d: 75, n: 'En appui sur un banc ou une table' },
        { e: 'puente-gluteo',     s: 3, r: '12',    d: 60, n: 'Jusqu’à la semaine 16 ; ensuite la quadrupédie le remplace' },
        { e: 'plancha',           s: 3, r: '20-30″', d: 60 },
        { e: 'elev-talones',      s: 2, r: '15',    d: 45 },
        { e: 'suelo-pelvico',     s: 3, r: '10',    d: 30, n: '6-8″ chacune et 5 rapides à la fin' }
      ]},
      'emb1-b': { nombre: 'Force B · premier trimestre', tipo: 'fuerza', fase: 1, dur: '~40′', calent: true, bloques: [
        { e: 'zancada-alterna',   s: 3, r: '8/jambe', d: 75, n: 'Statique et avec une main en appui : l’équilibre change déjà' },
        { e: 'press-inclinado-mc', s: 3, r: '10',   d: 75, n: 'Banc à 30-45° ; sans banc, pompes mains sur une table' },
        { e: 'banda-remo',        s: 3, r: '12',    d: 60 },
        { e: 'elev-laterales',    s: 2, r: '12',    d: 60 },
        { e: 'dead-bug',          s: 2, r: '8/côté', d: 45, n: 'Jusqu’à la semaine 16' },
        { e: 'abduccion-lado',    s: 2, r: '12/côté', d: 45 },
        { e: 'suelo-pelvico',     s: 3, r: '10',    d: 30 }
      ]},
      'emb2-a': { nombre: 'Force A · deuxième trimestre', tipo: 'fuerza', fase: 2, dur: '~40′', calent: true, bloques: [
        { e: 'sentadilla-pc',     s: 3, r: '10',    d: 75, n: 'Sur un box ou une chaise : profondeur confortable, sans rebond' },
        { e: 'press-militar-mc',  s: 3, r: '10',    d: 75, n: 'Assise, avec dossier' },
        { e: 'remo-mancuerna',    s: 3, r: '10/côté', d: 75, n: 'En appui : le ventre ne pend pas' },
        { e: 'cuadrupedia',       s: 2, r: '8/côté', d: 60, n: 'Remplace le pont : rien sur le dos' },
        { e: 'plancha-inclinada', s: 3, r: '25″',   d: 60 },
        { e: 'elev-talones',      s: 2, r: '15',    d: 45 },
        { e: 'suelo-pelvico',     s: 3, r: '10',    d: 30 }
      ]},
      'emb2-b': { nombre: 'Force B · deuxième trimestre', tipo: 'fuerza', fase: 2, dur: '~40′', calent: true, bloques: [
        { e: 'zancada-alterna',   s: 3, r: '8/jambe', d: 75, n: 'Statique, avec appui' },
        { e: 'press-inclinado-mc', s: 2, r: '10',   d: 75, n: 'Banc haut ou mains sur une table ; jamais à plat' },
        { e: 'banda-remo',        s: 3, r: '12',    d: 60 },
        { e: 'elev-laterales',    s: 2, r: '12',    d: 60 },
        { e: 'curl-martillo',     s: 2, r: '12',    d: 45 },
        { e: 'ext-triceps-banda', s: 2, r: '12',    d: 45 },
        { e: 'abduccion-lado',    s: 2, r: '12/côté', d: 45 },
        { e: 'suelo-pelvico',     s: 3, r: '10',    d: 30 }
      ]},
      'emb3-a': { nombre: 'Force A · troisième trimestre', tipo: 'fuerza', fase: 3, dur: '~30′', calent: true, bloques: [
        { e: 'sentadilla-pc',     s: 3, r: '8-10',  d: 90, n: 'Sur une chaise, les mains libres pour t’appuyer' },
        { e: 'press-militar-mc',  s: 2, r: '10',    d: 75, n: 'Assise' },
        { e: 'remo-mancuerna',    s: 2, r: '10/côté', d: 75 },
        { e: 'cuadrupedia',       s: 2, r: '6/côté', d: 60 },
        { e: 'plancha-inclinada', s: 2, r: '20″',   d: 60, n: 'Au mur, ça marche' },
        { e: 'suelo-pelvico',     s: 3, r: '10',    d: 30 }
      ]},
      'emb3-b': { nombre: 'Force B · troisième trimestre', tipo: 'fuerza', fase: 3, dur: '~30′', calent: true, bloques: [
        { e: 'zancada-alterna',   s: 2, r: '6/jambe', d: 90, n: 'Avec appui ; si c’est lourd, demi-fente' },
        { e: 'banda-remo',        s: 2, r: '12',    d: 60 },
        { e: 'elev-laterales',    s: 2, r: '10',    d: 60 },
        { e: 'abduccion-lado',    s: 2, r: '10/côté', d: 45 },
        { e: 'ext-triceps-banda', s: 2, r: '10',    d: 45 },
        { e: 'suelo-pelvico',     s: 3, r: '10',    d: 30 }
      ]},
      'pp-a': { nombre: 'Récupération', tipo: 'fuerza', fase: 1, dur: '~15′', calent: false, bloques: [
        { e: 'suelo-pelvico',     s: 3, r: '10',    d: 30, n: 'Dès que tu peux : 6-8″ et relâcher complètement' },
        { e: 'dead-bug',          s: 2, r: '8/côté', d: 45, n: 'Jambes seules au début ; les lombaires plaquées' },
        { e: 'cuadrupedia',       s: 2, r: '6/côté', d: 45 },
        { e: 'abduccion-lado',    s: 2, r: '10/côté', d: 45 }
      ]},
      'pp-b': { nombre: 'Reconnexion', tipo: 'fuerza', fase: 2, dur: '~30′', calent: true, bloques: [
        { e: 'sentadilla-pc',     s: 3, r: '10',    d: 60, n: 'Expire en montant ; sans bloquer l’air' },
        { e: 'zancada-alterna',   s: 2, r: '8/jambe', d: 60, n: 'Statique' },
        { e: 'puente-gluteo',     s: 3, r: '12',    d: 60 },
        { e: 'banda-remo',        s: 3, r: '12',    d: 60 },
        { e: 'elev-talones',      s: 2, r: '15',    d: 45 },
        { e: 'plancha-inclinada', s: 2, r: '20″',   d: 45 },
        { e: 'suelo-pelvico',     s: 3, r: '10',    d: 30 }
      ]},
      'pp-paseo': { nombre: 'Marche 10-20′', tipo: 'cardio', icono: 'walk', detalle: 'Douce et courte, dès les premiers jours. Si les lochies augmentent après, arrête et baisse le rythme : c’est le signal qu’utilisent les recommandations.' }
    },
    SUELO_PELVICO: {
      titulo: 'Périnée · 5′ · tous les jours',
      intro: 'C’est la recommandation la mieux documentée de toutes : le faire tous les jours pendant la grossesse réduit de 62 % l’incontinence en fin de grossesse et de 29 % à 3-6 mois de l’accouchement (Cochrane 2020). Et personne ne voit que tu es en train de le faire.',
      bloques: [
        { id: 'suelo-pelvico', nombre: 'Contractions longues et courtes', donde: 'Chaque jour, et après chaque séance', detalle: '3 × 10 contractions de 6-8″, en respirant, en relâchant complètement entre chacune ; et à la fin 5 rapides de 1″. Assise, sur le côté ou debout : l’important, c’est que ce soit le périnée et pas le fessier.' },
        { id: 'respiracion', nombre: 'Respiration et core', donde: 'Avant de charger', detalle: 'Inspire en ouvrant les côtes ; à l’expiration, le périnée monte et le ventre se resserre doucement. C’est le schéma qui passe devant chaque squat et chaque charge dans les bras : le bébé, la chaise, les courses.' }
      ],
      nota: 'S’il y a des fuites, une pesanteur, une boule ou une douleur, ça ne suffit pas : bilan en rééducation périnéale. La référence en kinésithérapie (Goom 2019) le conseille à toutes dès la semaine 6 après l’accouchement, et la recommandation de 2025 demande d’apprendre la technique avec un kiné.'
    },
    CALENTAMIENTO_EMB: {
      titulo: 'Échauffement · 6′ · toujours',
      pasos: ['Cercles de bras · 30″', 'Rotations de hanches · 30″ par côté', '10 squats lents sur une chaise', '5 fentes courtes avec appui par côté', 'Marche sur place en bougeant les bras · 60″', 'Respiration avec le périnée · 5 cycles'],
      gym: 'Sans sauts : l’impact n’entre pas dans la grossesse.'
    },
    FASES_EMB: [
      { id: 1, nombre: 'Premier trimestre', sub: 'Semaines 1-13', disco: 10, rpe: 'Borg 12-14 · tu peux parler', objetivo: 'Tenir l’habitude avec les nausées et le sommeil contre toi : séances courtes, marche, périnée tous les jours. Zéro record personnel.' },
      { id: 2, nombre: 'Deuxième trimestre', sub: 'Semaines 14-27', disco: 15, rpe: 'Borg 12-14 · tu peux parler', objetivo: 'L’énergie revient : le volume peut monter un peu. À partir de la semaine 16, rien sur le dos ni sur le ventre ; le plan le change déjà.' },
      { id: 3, nombre: 'Troisième trimestre', sub: 'Semaines 28-36', disco: 20, rpe: 'Borg 12-14 · tu peux parler', objetivo: 'Séances plus courtes, plus de repos entre les séries et toujours avec appui : l’équilibre et le centre de gravité ne sont plus les mêmes.' },
      { id: 4, nombre: 'Dernière ligne droite', sub: 'Semaine 37 et après', disco: 25, rpe: 'Borg 11-13 · léger', objetivo: 'Marcher, périnée et mobilité. Ce dont tu as envie et ce que le corps te laisse, jusqu’au jour de l’accouchement.' }
    ],
    FASES_PP: [
      { id: 1, nombre: 'Récupération', sub: 'Semaines 0-2', disco: 10, rpe: 'léger', objetivo: 'Périnée dès que tu peux, respiration, marches courtes. Rien de plus, et c’est déjà beaucoup. Avec une césarienne, sans se presser : la cicatrice commande.' },
      { id: 2, nombre: 'Reconnexion', sub: 'Semaines 2-6', disco: 15, rpe: 'Borg 11-13', objetivo: 'Squat, fente, pont et rowing à la bande : ce que tu vas faire mille fois par jour avec le bébé dans les bras, appris sans charge.' },
      { id: 3, nombre: 'Base', sub: 'Semaines 6-12', disco: 20, rpe: '6-7', objetivo: 'Après la visite : circuits, vélo ou elliptique, soulevé de terre léger. Pas encore d’impact : le périnée prend son temps.' },
      { id: 4, nombre: 'Construction', sub: 'Semaine 12 et après', disco: 25, rpe: '7-8', objetivo: 'Le plan habituel, depuis la base. Courir, seulement avec la liste de contrôle validée et sans symptômes.' }
    ],
    REGLAS_EMB: [
      { n: 1, t: 'Tu peux parler', d: 'L’intensité se mesure avec la voix, pas avec le pouls : si tu peux tenir une conversation, tu es bien (Borg 12-14). Le pouls répond autrement pendant la grossesse et il trompe.' },
      { n: 2, t: 'Sans records', d: 'Ici on ne progresse pas en kilos : on maintient. Aucune série à l’échec, aucune manœuvre de blocage respiratoire pour soulever. Expire à l’effort.' },
      { n: 3, t: 'Rien sur le dos à partir de la 16', d: 'Allongée sur le dos, l’utérus comprime la veine cave et la tension baisse. Le plan change seulement ces exercices-là ; si à un moment tu as des vertiges, change de position.' },
      { n: 4, t: 'Périnée tous les jours', d: '3 × 10 contractions chaque jour. C’est la recommandation la mieux documentée de tous les guides cliniques, et elle prévient l’incontinence après l’accouchement.' },
      { n: 5, t: 'Chaleur et eau', d: 'Entraîne-toi dans un endroit frais, avec de l’eau à portée de main. Plus de 45 minutes d’affilée peuvent faire baisser la glycémie : mange quelque chose avant ou raccourcis la séance (ACOG). Pas de hot yoga, ni de sauna, ni d’exercice avec de la fièvre.' },
      { n: 6, t: 'Ni chutes ni chocs', d: 'Exit les sports de contact, de raquette, le vélo en extérieur, les rollers ou tout ce qui risque de te faire tomber. Marcher, nager, le vélo d’appartement et cette force couvrent tout.' },
      { n: 7, t: 'Arrête et appelle', d: 'Saignements, douleur abdominale, contractions régulières, perte de liquide, essoufflement au repos, vertiges, mal de tête fort, douleur dans la poitrine, faiblesse, ou douleur et gonflement dans un mollet : ce jour-là on ne s’entraîne pas et on consulte.' },
      { n: 8, t: 'Le couloir monte', d: 'La balance monte et elle doit monter : {g} kg au total pour ton IMC d’avant, environ {r} kg par semaine à partir du deuxième trimestre. En dehors de ça, tu en parles à la consultation ; ici il n’y a pas de déficit.' }
    ],
    REGLAS_PP: [
      { n: 1, t: 'Les symptômes commandent', d: 'Chaque pas se fait si le précédent n’a donné ni fuites, ni pesanteur, ni douleur, ni plus de saignements. Si ça apparaît, on recule d’une semaine et on consulte.' },
      { n: 2, t: 'Pas d’impact avant la 12', d: 'Ni courir, ni sauter, ni cours avec sauts avant 12 semaines, et ensuite seulement avec la liste de contrôle validée. Le périnée récupère en mois, pas en jours.' },
      { n: 3, t: 'Périnée tous les jours', d: '3 × 10 chaque jour dès que tu peux. Et un bilan de rééducation périnéale vers la semaine 6, même si tu ne sens rien : les recommandations le conseillent à toutes.' },
      { n: 4, t: 'Césarienne : la cicatrice commande', d: 'Chaque étape est décalée de deux semaines et rien qui tire sur la cicatrice jusqu’à la visite. Une fois guérie, la masser aide à ce qu’elle n’adhère pas.' },
      { n: 5, t: 'Sommeil', d: '7-9 heures, c’est ce que le corps demande et ce qu’on n’a presque jamais. Les siestes comptent : fais-les coïncider avec celles du bébé. Une semaine sans dormir est une semaine de minimum, pas un échec.' },
      { n: 6, t: 'Manger pour deux', d: 'Avec l’allaitement, la dépense monte d’environ 450 kcal par jour. Le déficit, s’il y en a un, commence à la semaine 6 et ne dépasse pas 500 kcal : un demi-kilo par semaine, c’est ce que l’évidence tient pour sûr pour le bébé.' },
      { n: 7, t: 'Les abdos, oui', d: 'Les abdos n’ouvrent pas le diastasis des grands droits et ne le ferment pas : ils donnent de la force et de la fonction. Le core du plan est progressif ; si tu vois un bombement quand tu te relèves, monte l’inclinaison.' },
      { n: 8, t: 'Le minimum tient', d: 'Semaine chaotique : 2 forces + 1 marche. On ne perd rien ; on reprend là où tu en étais.' }
    ],
    CIENCIA_EMB: {
      intro: 'Plan passé au crible des recommandations cliniques en vigueur (ACOG 2020, canadienne 2019, SEGO 2019, OMS 2020) et des méta-analyses qui les soutiennent. L’idée qui ordonne tout : l’exercice pendant la grossesse est un traitement de première ligne, et ce qu’il faut adapter, ce sont les positions et l’intensité, pas l’envie.',
      temas: [
        { t: 'Moins de complications', d: 'L’exercice à lui seul réduit le diabète gestationnel (OR 0,62), l’hypertension gestationnelle (0,61) et la prééclampsie (0,59) sur 106 études et 273 182 femmes. 140 minutes par semaine de marche rapide, de vélo d’appartement ou de force suffisent.', ref: 'Davenport et al., Br J Sports Med 2018' },
        { t: 'La force oui ; lourd, pas par défaut', d: 'Les recommandations comptent la force avec poids et élastiques parmi ce qui est étudié et sûr. Chez 679 pratiquantes qui ont continué à charger lourd, les résultats ont été normaux : il n’y a pas de preuve de danger chez celle qui le faisait déjà, ni de bénéfice à commencer maintenant. C’est pour ça que le plafond, c’est de parler sans s’essouffler.', ref: 'ACOG 804, 2020 · Prevett et al., 2023' },
        { t: 'Le périnée, ça s’entraîne', d: 'L’entraîner pendant la grossesse réduit de 62 % l’incontinence en fin de grossesse et de 29 % à 3-6 mois de l’accouchement chez les femmes sans fuites préalables. C’est l’intervention la mieux documentée de tout le plan.', ref: 'Woodley et al., Cochrane 2020' },
        { t: 'Combien prendre et combien de protéines', d: 'La prise attendue dépend de l’IMC d’avant (IOM 2009), et le besoin réel en protéines mesuré aux isotopes est de 1,2 g/kg au début et de 1,5 à la fin, bien au-dessus du chiffre officiel de 0,88. Le plan demande 1,4 et 1,6 sur le poids d’avant.', ref: 'Institute of Medicine 2009 · Stephens et al., J Nutr 2015' }
      ]
    },
    CIENCIA_PP: {
      intro: 'Plan passé au crible de la recommandation canadienne de 2025, la première consacrée à la première année après l’accouchement, et du consensus de kinésithérapie sur le retour à la course. L’idée qui ordonne tout : bouger dès les premiers jours protège la santé mentale, et l’impact attend le périnée.',
      temas: [
        { t: '120 minutes qui valent 45 %', d: 'Cumuler 120 minutes par semaine d’activité modérée, sur 4 jours ou plus et avec de la force, s’associe à 45 % de dépression du post-partum en moins, 37 % d’incontinence en moins et 28 % de diabète de type 2 en moins, sans plus de blessures ni de changement dans le lait.', ref: 'Davenport et al., Br J Sports Med 2025' },
        { t: 'Courir à partir de la 12, et sous conditions', d: 'La référence de kinésithérapie fixe les trois mois comme minimum, et une batterie de tests de charge et d’impact sans fuites ni pesanteur avant de trotter. L’app la porte à l’intérieur.', ref: 'Goom, Donnelly et Brockwell, 2019' },
        { t: 'Allaitement et déficit', d: 'Avec un allaitement exclusif, 500 kcal de moins par jour et 45 minutes d’exercice 4 jours par semaine à partir de la semaine 4 ont fait perdre 4,8 kg en 10 semaines sans aucun effet sur le poids ni la taille des bébés.', ref: 'Lovelady et al., N Engl J Med 2000' },
        { t: 'Abdos et diastasis', d: 'Douze semaines de curl-ups n’ont pas aggravé l’écart entre les grands droits et ont bien augmenté force et épaisseur. Ce que l’exercice ne fait pas, c’est le fermer : les revues ne trouvent pas d’effet sur la distance.', ref: 'Gluppe et al., J Physiother 2023 · Lyons et al., Hernia 2026' }
      ]
    },
    SENALES_EMB: ['Arrête et consulte : saignements, douleur abdominale, contractions régulières, perte de liquide, essoufflement au repos, vertiges, mal de tête fort, douleur dans la poitrine, faiblesse qui touche l’équilibre, douleur ou gonflement dans le mollet.', 'Normal : fatigue, chaleur et bouffées qui partent quand tu baisses le rythme ; gêne légère dans le bassin qui cède en changeant de position.', 'À signaler à la prochaine consultation : douleur pelvienne qui revient, fuites urinaires, pesanteur.'],
    SENALES_PP: ['Arrête et consulte : saignements qui augmentent à l’effort, douleur abdominale intense, fièvre, douleur ou gonflement dans un mollet, vertiges, douleur à la cicatrice qui empire.', 'Normal : fatigue, courbatures légères, un peu de gêne à la cicatrice au début qui diminue.', 'Kiné périnéale avant de continuer : fuites d’urine ou de selles, pesanteur ou boule dans le vagin, douleur pendant les rapports, bombement du ventre quand tu te relèves.'],
    UI: {
      patrones: { sp: 'Plancher pelvien' },
      cuest: {
        etapaT: 'Grossesse ou post-partum ?', etapaP: 'Ça change tout le plan : positions, intensité, table et ce qui se mesure.',
        etapaNo: 'Aucune des deux', etapaEmb: 'Je suis enceinte', etapaPp: 'J’ai accouché récemment',
        embT: 'Ta grossesse', embSemL: 'Semaine de grossesse', embPesoPreL: 'Poids avant la grossesse (kg) · optionnel', embSemMal: 'Semaine entre 4 et 42.',
        embRiesgoT: 'L’une de celles-ci ?', embRiesgoP: 'Ce sont les contre-indications des recommandations. Avec une case cochée, l’exercice, c’est ton gynécologue ou ta sage-femme qui le décide.',
        embR: { membranas: 'Rupture de la poche des eaux', prematuro: 'Menace d’accouchement prématuré', sangrado: 'Saignements vaginaux persistants', placenta: 'Placenta prævia (à partir de la semaine 20)', preeclampsia: 'Prééclampsie ou hypertension non contrôlée', cervix: 'Béance cervicale ou cerclage', cir: 'Retard de croissance intra-utérin', multiple: 'Grossesse de triplés ou plus', diabetes: 'Diabète de type 1 ou thyroïde non contrôlés', cardio: 'Maladie cardiaque ou respiratoire importante' },
        embRiesgoNo: 'Aucune',
        embAvisoRel: 'Si tu as des antécédents de fausse couche, une hypertension gestationnelle, des jumeaux, une anémie avec symptômes ou un accouchement prématuré, parles-en à ta prochaine consultation : le plan continue, avec plus de marge.',
        gateEmbT: 'Ta grossesse décide', gateEmbTxt: 'Tu as coché une contre-indication des recommandations. Avec elle, le plan ne se génère que si ton gynécologue ou ta sage-femme t’a donné le feu vert pour de l’exercice modéré.',
        ppT: 'Ton accouchement', ppFechaL: 'Quel jour a eu lieu l’accouchement ?', ppFechaMal: 'Choisis une date des 12 derniers mois.',
        ppTipoT: 'Comment ça s’est passé ?', ppVaginal: 'Voie basse', ppCesarea: 'Césarienne',
        ppLactT: 'Tu allaites ?', ppLactSi: 'Oui', ppLactNo: 'Non',
        ppSpT: 'Tu remarques l’une de celles-ci ?', ppSpP: 'Ce sont des signes du périnée. Elles ne ferment pas le plan : elles freinent l’impact et demandent de la kiné.',
        ppSp: { orina: 'Fuites urinaires en toussant, en riant ou en sautant', pesadez: 'Pesanteur, boule ou pression dans le vagin', dolor: 'Douleur pelvienne ou pendant les rapports', bulto: 'Bombement du ventre quand je me relève' },
        ppSpNo: 'Aucune',
        ppRiesgoT: 'L’une de celles-ci en ce moment ?', ppRiesgoP: 'Ce sont les contre-indications relatives de la recommandation de 2025. Avec une case cochée, il faut le feu vert de ton médecin.',
        ppR: { sangrado: 'Saignements qui augmentent à l’effort', dolor: 'Douleur abdominale intense', fiebre: 'Fièvre ou infection', tension: 'Hypertension non contrôlée', pantorrilla: 'Douleur ou gonflement dans un mollet', cicatriz: 'Douleur à la cicatrice qui empire quand je bouge', mareo: 'Vertiges ou malaises', ahogo: 'Essoufflement au repos' },
        ppRiesgoNo: 'Aucune',
        gatePpT: 'Ta récupération décide', gatePpTxt: 'Tu as coché une contre-indication de la recommandation de 2025. Le plan se génère quand ton médecin ou ta sage-femme t’aura donné le feu vert.',
        cicloT: 'Ton cycle', cicloP: 'Optionnel. Sert à noter et à prévoir les règles, et à mieux lire la balance et les jours creux. Ça ne change pas le plan par phases : l’évidence ne le soutient pas.',
        cicloNat: 'J’ai des règles naturelles', cicloHorm: 'J’utilise une contraception hormonale', cicloSin: 'Je n’ai pas de règles en ce moment', cicloNo: 'Je préfère ne pas dire',
        cicloUltT: 'Quand ont commencé tes dernières règles ?', cicloUltMal: 'Choisis un jour des 60 derniers.',
        cicloDurT: 'Ton cycle dure combien, en général ?', cicloDurP: 'D’un premier jour de règles au suivant. La normale se situe entre 24 et 38 jours.', cicloDurNs: 'Je ne sais pas',
        resLEtapa: 'Étape', resLCiclo: 'Cycle', resEmb: 'Grossesse · semaine {s}', resPp: 'Post-partum · semaine {s}', resPpCes: 'Post-partum · césarienne · semaine {s}',
        resCicloNat: 'Règles naturelles · {d} jours', resCicloHorm: 'Contraception hormonale', resCicloSin: 'Pas de règles en ce moment'
      },
      gen: {
        emb: {
          kcalNota: '{t} : ta dépense plus {k} kcal. Sans déficit : ici on construit.',
          ritmoT: 'Prise attendue', ritmoV: '+{a}–{b} kg/sem', ritmoN: 'À partir du deuxième trimestre, pour ton IMC d’avant ({imc}). Au total, {g} kg (IOM 2009).',
          fila1: '1er trimestre', fila2: '2e trimestre', fila3: '3e trimestre',
          nota1: '+70 kcal : presque rien. Mange quand le corps le demande.', nota2: '+260 kcal : une prise de plus, avec des protéines.', nota3: '+500 kcal : deux prises de plus. Les protéines montent à 1,6 g/kg.',
          escalado: 'Les protéines ({p} g) se calculent sur ton poids d’avant la grossesse ; ce qui monte par trimestre, c’est le reste.',
          hidratacion: 'Eau : 2,3 litres par jour (8-10 verres). Alcool : aucun, en aucune quantité. Caféine : jusqu’à 200 mg par jour en comptant tout (un grand café et un thé).',
          comidaLibre: 'Il y a toujours un repas libre par semaine, avec les mêmes règles de sécurité : rien de cru, rien de séché sans cuisson ni de non pasteurisé, et sans alcool. Il peut se déplacer ; il en reste un seul.',
          plato: 'À chaque repas : 150-200 g de viande maigre ou de poisson bien cuit (sans espadon, requin, thon rouge ni brochet), ou 3 œufs bien cuits, ou 250 g de skyr ou de fromage blanc pasteurisé, ou 250 g de légumineuses + 1 œuf.',
          supl: [
            { id: 'folico', t: 'Acide folique', d: '0,4 mg par jour, au moins les 12 premières semaines : c’est la recommandation forte du guide du ministère de la Santé. Si tu en prends déjà sur prescription, continue avec cette posologie.' },
            { id: 'yodo', t: 'Iode', d: '200 µg par jour pendant la grossesse et l’allaitement (EFSA). Si tu n’arrives pas à 3 produits laitiers et du sel iodé par jour, ta sage-femme te le prescrit en iodure de potassium.' },
            { id: 'omega-3', t: 'DHA', d: '100-200 mg de DHA par jour en plus du poisson gras (EFSA). Avec 3-4 portions de poisson par semaine, ça suffit en général.' },
            { id: 'vitamina-d', t: 'Vitamine D', d: '15 µg par jour de référence. On ne supplémente que si l’analyse le demande.' },
            { id: 'hierro', t: 'Fer', d: 'Pas d’extra par principe : la recommandation du ministère espagnol ne le prescrit pas à toutes. Seulement si ton analyse le dit.' },
            { id: 'cafeina', t: 'Caféine', d: 'Plafond de 200 mg par jour en additionnant café, thé, cola et boissons énergisantes. Un grand café, c’est déjà la moitié.' },
            { id: 'no', t: 'Pas maintenant', d: 'Créatine (aucune étude pendant la grossesse : ne commence pas maintenant), brûleurs de graisse, pré-workout, vitamine A sous forme de rétinol au-dessus de 3 000 µg (10 000 UI) par jour (une portion de foie dépasse déjà) et plantes « pour la grossesse ». Rien que ta sage-femme ne t’ait prescrit.' }
          ],
          seguridad: 'Hors du menu : poisson ou fruits de mer crus et fumés réfrigérés ; fromages non pasteurisés et lait cru ; pâtés réfrigérés et graines germées ; œuf cru ou peu cuit ; jambon cru et charcuterie crue sauf cuits ; espadon, requin, thon rouge et brochet. Viande cuite jusqu’à 71 °C à cœur ; restes réchauffés à plus de 75 °C ; réfrigérateur à 4 °C ou moins ; fruits et légumes bien lavés.',
          jamon: 'Le jambon sec : l’AESAN le liste parmi ceux à éviter sauf cuits. Le congeler 48 h à −20 °C inactive le toxoplasme, mais pas la listeria. Si tu en prends, cuit ; et jamais en tranches sous vide. Si ton analyse du premier trimestre montre que tu es déjà immunisée contre la toxoplasmose, l’AESAN ne l’interdit pas à ce titre ; les tranches sous vide restent exclues à cause de la listeria.',
          hito14T: 'Deuxième trimestre', hito14D: 'L’énergie revient en général. Si tu en as envie, monte un peu le rythme, jamais au-dessus de pouvoir parler.',
          hito16T: 'À partir d’aujourd’hui, rien sur le dos', hito16D: 'Le plan a déjà remplacé le pont, le dead bug et le développé à plat par des versions debout, inclinées ou en quadrupédie. Si tu as des vertiges allongée, change de position sans attendre.',
          hito28T: 'Troisième trimestre', hito28D: 'Séances plus courtes et avec appui. Le centre de gravité n’est plus le même : rien qui dépende de l’équilibre. Si tu courais, à partir d’aujourd’hui tu marches.',
          hito36T: 'Dernière ligne droite', hito36D: 'Marcher et périnée commandent. Entraîne-toi comme tu en as envie, jusqu’au jour de l’accouchement si le corps le demande.',
          cierre: 'Le plan se termine avec l’accouchement, autour du {f}. À la naissance, va dans Réglages et passe ton profil en post-partum : le plan change entièrement.',
          chkD: 'Couloir de prise de poids pour ton IMC d’avant (IOM 2009). Dedans, c’est dedans ; au-dessus deux semaines de suite, parles-en à la consultation.',
          cuidaN: 'rien sur le dos à partir de la 16 · ni sauts ni équilibre · plafond : pouvoir parler',
          logroFinD: 'Plan terminé jusqu’à l’accouchement. Place au post-partum : l’app change avec toi.'
        },
        pp: {
          kcalNotaLact: 'Ta dépense plus {k} kcal pour l’allaitement{d}. Plancher de 1 800 kcal : en dessous, les données ne garantissent plus le lait.',
          kcalNota: '{d}. Avant la semaine 6, maintenance : d’abord guérir.',
          defTxt: ', moins {v} kcal de déficit à partir de la semaine 6', mantTxt: 'Maintenance',
          fila1: 'Récupération et reconnexion (jusqu’à la visite)', fila2: 'Base (de la visite à la semaine 12)', fila3: 'Construction (sem 12+)',
          escalado: 'Avec l’allaitement, les protéines ({p} g) montent à 1,6 g/kg et ne bougent pas ; les glucides accompagnent le volume.',
          hidratacion: 'Eau : 2,5-3 litres par jour, plus avec l’allaitement (chaque tétée donne soif : bois à ce moment-là). Alcool : le moins possible, c’est mieux pour le bébé ; s’il y en a, loin de la tétée. Caféine : jusqu’à 200 mg par jour avec l’allaitement.',
          comidaLibre: 'Un repas par semaine, pas une journée. Avec l’allaitement, le poisson reste sans espadon, requin, thon rouge ni brochet ; le reste revient à table.',
          supl: [
            { id: 'yodo', t: 'Iode', d: '200 µg par jour tant que dure l’allaitement (EFSA) : le lait l’emporte.' },
            { id: 'omega-3', t: 'DHA', d: '100-200 mg par jour en plus du poisson gras tant que dure l’allaitement (EFSA).' },
            { id: 'vitamina-d', t: 'Vitamine D', d: '15 µg par jour de référence ; supplément seulement si l’analyse le demande.' },
            { id: 'hierro', t: 'Fer', d: 'Après l’accouchement, analyse s’il y a eu des saignements abondants ou une fatigue qui ne cède pas ; supplémenter seulement avec la ferritine basse.' },
            { id: 'whey', t: 'Whey', d: 'Une dose là où il manque des protéines : avec l’allaitement c’est 1,6 g/kg et c’est dur d’y arriver à table.' },
            { id: 'cafeina', t: 'Caféine', d: 'Avec l’allaitement, plafond de 200 mg par jour et jamais après 14 h : le bébé la sent aussi.' },
            { id: 'no', t: 'Ne dépense pas en', d: 'Brûleurs de graisse, « récupérateurs post-partum », gaines qui promettent de fermer le diastasis et créatine jusqu’au sevrage. Ça ne bouge pas l’aiguille.' }
          ],
          hito6T: 'Visite et périnée', hito6D: 'Après la visite des 6 semaines, bilan de rééducation périnéale même si tu ne sens rien : la référence en kinésithérapie de 2019 le conseille à toutes, et la recommandation de 2025 demande d’apprendre la technique avec un kiné.',
          hito8T: 'La cicatrice', hito8D: 'Césarienne : si elle est fermée et sèche, la masser tous les jours évite qu’elle n’adhère. Toujours rien qui tire dessus.',
          hito12T: 'Impact : la liste', hito12D: 'À partir d’aujourd’hui tu peux envisager de courir, si tu passes la liste de contrôle d’AUJOURD’HUI sans fuites ni pesanteur. Sans te presser : entre 3 et 6 mois, c’est l’habituel.',
          cierre: 'Plan post-partum terminé le {f}. Le bloc suivant commence là où celui-ci finit : Réglages › Créer / refaire mon plan, déjà comme le plan habituel.',
          cuidaN: 'pas d’impact avant la 12 · périnée tous les jours · césarienne : deux semaines de plus par étape',
          correrT: 'Prête à courir', correrP: 'Tout sans fuites, pesanteur, douleur ni saignements. Coche ce que tu fais déjà sans symptômes et enregistre.',
          correr: { pasear: 'Marcher 30 minutes', equil: 'Équilibre sur une jambe 10″ par côté', sent1: 'Squat sur une jambe, 10 par côté', trote: 'Trotter sur place 1 minute', saltos: '10 sauts vers l’avant', pata: '10 sauts sur une jambe par côté', runman: '10 running man par côté', fuerza: '20 élévations de mollets, ponts et squats sur une jambe, et 20 abductions sur le côté' },
          correrOk: 'Enregistrer : je peux courir', correrHecho: 'Liste validée le {f} : le cardio peut inclure le footing.',
          correrAviso: 'Avec des fuites, une pesanteur ou une douleur sur un test : rééducation périnéale avant de courir. Ce n’est pas un échec, c’est le bon ordre.'
        },
        ciclo: {
          fase: { regla: 'règles', folicular: 'phase folliculaire', ovulatoria: 'ovulation estimée', lutea: 'phase lutéale', premenstrual: 'phase lutéale · prémenstruelle', retraso: 'règles en retard' },
          linea: 'Cycle · jour {d} · {f}', proxima: 'règles prévues le {f} (±{m} jours)', proximaHoy: 'règles prévues aujourd’hui ou demain', retraso: '{n} jours de retard sur la prévision',
          irregular: 'Cycles avec plus de 9 jours de variation : pas de prédiction. Note tes règles et, si ça sort de 24-38 jours de façon répétée, parles-en à ton médecin.',
          hormonal: 'Avec une contraception hormonale il n’y a pas de phases : le saignement, s’il y en a un, vient de la pause de la pilule, de l’anneau ou du patch, ou est irrégulier avec un implant, un DIU hormonal ou une pilule progestative ; ce ne sont pas des règles. Note quand même si tu veux le calendrier.',
          sinRegla: 'Plus de 90 jours sans règles, sans grossesse ni contraception hormonale : consulte. C’est le signal qu’utilisent le CIO et les recommandations de santé féminine.',
          nota: { regla: 'S’il y a de la douleur ou de la fatigue, aujourd’hui le minimum suffit, ou baisse l’effort d’un cran. Sinon, entraîne-toi pareil : la performance ne dépend pas de la phase. Du fer à table : légumineuses ou viande rouge maigre, avec de la vitamine C.', folicular: 'Rien à changer : l’évidence ne trouve pas de différences de force ni d’adaptation selon la phase.', ovulatoria: 'Les ligaments sont un peu plus laxes ces jours-ci : soigne les réceptions sur les fentes et les sauts. Le plan ne change pas.', lutea: 'Dépense et appétit un peu plus hauts (de 2-11 %) : ta marge du jour monte d’environ 150 kcal. Le poids peut monter à cause de l’eau : la moyenne hebdo l’absorbe.', premenstrual: 'Envies, sommeil moins bon et un peu de ballonnement sont normaux ces jours-ci. Ne compense pas, ne te pèse pas tous les jours et, si l’humeur le demande, le minimum suffit.' },
          hRegla: 'Règles', hReglaSub: 'Marque les jours de saignement', hAbund: 'Saignement abondant', hAbundSub: 'Imbibe toutes les 1-2 h : demande une ferritine',
          abundNota: 'Le saignement abondant touche une sportive sur trois et s’associe à l’anémie. Analyse avec ferritine, et du fer seulement s’il sort bas.'
        }
      },
      rev: {
        etapaEmbT: 'Semaine {s} de grossesse', etapaEmbSub: 'plan jusqu’à l’accouchement, autour du {f} ; sans déficit ni records',
        etapaPpT: 'Post-partum · semaine {s}', etapaPpSub: 'progression par semaines depuis l’accouchement ; impact seulement à partir de la 12', etapaPpCes: 'césarienne : chaque étape, deux semaines de plus',
        kEmb: 'ta dépense plus le supplément du trimestre : ici on ne coupe pas', kLact: 'avec l’allaitement inclus ; le déficit attend la semaine 6',
        cuidaEmbT: 'Positions et intensité adaptées', cuidaEmbSub: 'rien sur le dos à partir de la 16, ni sauts ni équilibre, plafond : pouvoir parler',
        cuidaPpT: 'Le périnée d’abord', cuidaPpSub: 'tous les jours, et kiné vers la semaine 6',
        cicloT: 'Cycle enregistré', cicloSub: 'marque tes règles dans AUJOURD’HUI : prédiction, lecture de la balance et jours creux. Sans séances par phases : il n’y a pas d’évidence.',
        cicloHormT: 'Contraception hormonale', cicloHormSub: 'pas de phases à lire ; le plan ne change pas'
      },
      hoy: {
        embLinea: 'Semaine {s} de grossesse · {t}', embT1: '1er trimestre', embT2: '2e trimestre', embT3: '3e trimestre', embT4: 'dernière ligne droite',
        embPasada: 'Date prévue d’accouchement dépassée : à la naissance, passe ton profil en post-partum dans Réglages.',
        ppLinea: 'Post-partum · semaine {s}{c}', ppCes: ' · césarienne',
        hSuelo: 'Périnée', hSueloSub: '3 × 10 · 6-8″ chacune',
        correrChip: 'Prête à courir', correrChipSub: 'Semaine 12 atteinte : vérifie la liste',
        pesoSube: 'Pris', corredorEmb: 'Couloir de prise de poids', corredorEmbSub: 'pour ton IMC d’avant : {g} kg au total (IOM 2009)',
        pesoEmbNota: 'Moyenne hebdo dans le couloir : bien. Au-dessus deux semaines de suite : parles-en à la consultation, ne coupe pas.'
      }
    }
  };
  Object.assign(EJERCICIOS, MUJER.EJERCICIOS);
  Object.assign(SESIONES, MUJER.SESIONES);
  Object.assign(UI.patrones, MUJER.UI.patrones);
  Object.assign(UI.cuest, MUJER.UI.cuest);
  Object.assign(UI.gen, MUJER.UI.gen);
  Object.assign(UI.rev, MUJER.UI.rev);
  UI.mujer = MUJER.UI.hoy;
  /* ---------- fin MUJER ---------- */
  return {SUELO_PELVICO: MUJER.SUELO_PELVICO, CALENTAMIENTO_EMB: MUJER.CALENTAMIENTO_EMB, FASES_EMB: MUJER.FASES_EMB, FASES_PP: MUJER.FASES_PP, REGLAS_EMB: MUJER.REGLAS_EMB, REGLAS_PP: MUJER.REGLAS_PP, CIENCIA_EMB: MUJER.CIENCIA_EMB, CIENCIA_PP: MUJER.CIENCIA_PP, SENALES_EMB: MUJER.SENALES_EMB, SENALES_PP: MUJER.SENALES_PP,
    META, FASES, CAL, HITOS_SEMANA, SESIONES, CALENTAMIENTO, TENDON, CARRERA, EJERCICIOS, REGLAS, SENALES, NUTRI, RECETAS, COMPRA, MEALPREP, MENU, CHECKPOINTS, FOTOS, LOGROS, CIENCIA, AVISO_LEGAL, QUIZ_DEP, UI, PRODUCTOS };
})();

