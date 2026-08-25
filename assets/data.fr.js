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
      objetivo: 'Reconstruire l’habitude et réveiller les schémas moteurs sans matraquer les articulations. Tu resteras sur ta faim : c’est voulu.' },
    { id: 2, nombre: 'Entrée en salle', sub: 'Full Body ×3', semanas: [3, 4, 5], disco: 15, rpe: '6–7',
      fechas: '31 août – 20 sept',
      objetivo: 'Réapprendre les mouvements de base à la barre et reconstruire une base de charge. Ta mémoire musculaire autorise des poids que ton tissu conjonctif ne tolère pas encore : travaille à 65-70% de ce que tu sens possible, avec TOUJOURS 3 répétitions en réserve.' },
    { id: 3, nombre: 'Charge', sub: 'Haut / Bas ×4', semanas: [6, 7, 8, 9], disco: 20, rpe: '7–8',
      fechas: '21 sept – 18 oct',
      objetivo: 'Volume et intensité réels pour forcer la recomposition : c’est ici que la mémoire musculaire paie vraiment. Termine chaque série en pouvant faire 2 répétitions de plus — et des vraies : celui qui revient a tendance à surestimer sa proximité de l’échec.' },
    { id: 4, nombre: 'Pic', sub: 'Push / Pull / Legs ×5', semanas: [10, 11, 12], disco: 25, rpe: '8',
      fechas: '19 oct – 8 nov',
      objetivo: 'Stimulus maximal pour boucler la recomposition. Cinq jours, mais des séances de 60-75 minutes, pas de 2 heures. RPE 8 : 1-2 répétitions en réserve sur les dernières séries.' }
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
  const HITOS_SEMANA = {
    5:  { t: 'Bilan santé', d: 'Avant la Phase 3 (travail vigoureux après 5 ans d’arrêt) : mesure ta tension en pharmacie et fais un bilan sanguin de base (lipides, glycémie/HbA1c). 15 minutes qui achètent la tranquillité.' },
    7:  { t: 'DIET BREAK', d: 'Toute la semaine tu manges à maintenance (~2 800 kcal : +2 portions de glucides par jour, protéines inchangées). L’entraînement ne change pas. Ce n’est ni une récompense ni une rechute : ça restaure le NEAT et la leptine, et ça casse le cycle psychologique on/off. Le lundi suivant, retour au déficit comme si de rien n’était.' },
    9:  { t: 'DÉCHARGE (pas optionnelle)', d: 'Même programme avec LA MOITIÉ des séries par exercice et le même poids sur la barre. Ce n’est pas un arrêt : tout couper coûte de la force. C’est de l’entretien de tissu + des vacances pour les tendons et les articulations avant le bloc final.' },
    10: { t: 'Transition à 5 jours', d: 'Première semaine de PPL : fais UNE série de moins sur tout. Le saut de 4 à 5 jours est le point de risque tendineux maximal du plan ; on y entre en marchant, pas en sautant.' }
  };

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
    'cam40':  { nombre: 'Marche 40′', tipo: 'cardio', icono: 'walk', detalle: 'Rythme de conversation inconfortable : tu peux parler, mais pas chanter. Ça compte pour les pas du jour.' },
    'cam60':  { nombre: 'Marche 60′', tipo: 'cardio', icono: 'walk', detalle: 'Rythme vif et soutenu. Idéal dehors : ça cumule lumière, pas et récupération active.' },
    'wj3': { nombre: 'Marche-course S3', tipo: 'cardio', icono: 'run', detalle: '7 tours : 2′ de course légère + 2′ de marche (28′). Avant : 2×20 tibialis raises + 10 élévations de mollets. Course vraiment légère : si tu ne peux pas parler, tu vas trop vite.' },
    'wj4': { nombre: 'Marche-course S4', tipo: 'cardio', icono: 'run', detalle: '6 tours : 3′ de course + 2′ de marche (30′). Avant : 2×20 tibialis raises. Cadence haute et foulées courtes : moins d’impact par foulée.' },
    'wj5': { nombre: 'Marche-course S5', tipo: 'cardio', icono: 'run', detalle: '5 tours : 5′ de course + 1′ de marche (30′), ou 20′ de footing léger en continu si le corps répond bien. Avant : 2×20 tibialis raises.' },
    'trote25': { nombre: 'Footing 25-30′', tipo: 'cardio', icono: 'run', detalle: 'Continu et conversationnel. Préfère l’asphalte lisse ou la terre compacte aux trottoirs irréguliers. Si une gêne au tibia ou au genou empire en courant : coupe et marche.' },
    'trote30': { nombre: 'Footing 30-35′', tipo: 'cardio', icono: 'run', detalle: 'Continu. Un jour peut être un peu plus enlevé (les derniers 10′ à allure moyenne), l’autre toujours facile.' },
    'libre': { nombre: 'Repos', tipo: 'libre', icono: 'rest', detalle: 'Vraie journée off. Les pas quotidiens comptent toujours. Dimanche : le meal prep (~90′) règle la semaine.' }
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
    intro: 'La force revient en quelques semaines ; le tendon demande des mois (son collagène se renouvelle ~10 fois plus lentement et n’a pas de mémoire musculaire). Ce bloc est l’assurance du plan : il démarre en semaine 1, et la course de la semaine 3 n’arrive qu’avec deux semaines de tendon déjà rodées.',
    bloques: [
      { id: 'tendon-rodilla', nombre: 'Rotulien · isométrique', donde: 'Après chaque séance jambes (en P1, après les circuits)',
        detalle: 'Squat isométrique au mur (P2+ : squat espagnol avec sangle rigide derrière les genoux) : 5 × 45″ à ~70% d’effort, 1′ de repos. Cuisse proche de la parallèle, sans douleur aiguë. En plus d’adapter, l’effet antalgique est immédiat (Rio 2015).' },
      { id: 'tendon-aquiles', nombre: 'Achille · HSR mollets', donde: 'Déjà intégré aux séances (élévations/mollets)',
        detalle: 'La règle qui change tout : mollets LOURDS et LENTS — 3″ de descente, 3″ de montée, 6-8 reps, sans rebond. En P1 avec un sac à dos chargé sur une jambe ; en salle avec une vraie charge. Le rebond exploite le réflexe du tendon et lui vole exactement le stimulus dont il a besoin.' },
      { id: 'tendon-tibial', nombre: 'Tibial antérieur', donde: 'Avant chaque footing',
        detalle: 'Tibialis raises adossé au mur : 2-3 × 15-20. C’est le vaccin contre la périostite à ton poids actuel.' },
      { id: 'tendon-codo', nombre: 'Coude/poignet · isométrique', donde: 'Après les séances haut du corps (P2+), 2×/sem',
        detalle: 'Avec un haltère léger, poignet immobile à mi-flexion : 3 × 45″ (paume vers le haut puis vers le bas). Le volume de développé + rowing + tirage déclenche des épicondylites chez ceux qui reprennent ; ça les prévient gratuitement.' }
    ],
    nota: 'N’ajoute PAS de pliométrie/sauts « pour préparer la course » : l’évidence dit que c’est un mauvais stimulus tendineux et un impact élevé. Ta préparation à l’impact, c’est ce bloc.'
  };

  /* ---------- RÈGLES DE COURSE (évidence IMC ~28) ---------- */
  const CARRERA = {
    titulo: 'Courir sans te casser ({p} kg aux commandes)',
    reglas: [
      'Cadence 170-180 pas/min, foulée courte : réduit l’impact tibial d’~11% et le taux de charge d’~15%. Compte tes pas sur 30″ (85-90) ou utilise le métronome de la montre.',
      'Volume gouverné par les sensations et la progression du plan : ne dépasse jamais ~1,3× ta moyenne des 4 dernières semaines (l’app te prévient).',
      'La semaine 3 démarre avec ~2,5 km de course au total : sous le plafond de 3 km/sem que l’évidence fixe pour débuter en surpoids.',
      'Surface et chaussures CONSTANTES : ne change pas les deux en même temps. Préfère l’asphalte lisse ou la terre compacte aux trottoirs.',
      'Gêne au tibia ou au genou qui EMPIRE en courant : coupe et marche. Celle qui disparaît à l’échauffement, surveille-la ; celle qui grandit, c’est elle qui commande.'
    ]
  };

  /* ---------- MARQUES HISTORIQUES (époque salle, ~2021) ---------- */
  // Pas chargées comme PR : c’est la référence de « où tu en étais » et la cible à reconquérir.
  const HISTORICO = {
    'press-banca':      { kg: 95,  reps: 8, series: 4, txt: '95 kg × 8 (4 séries)',  rm: 120 },
    'sentadilla-barra': { kg: 100, reps: 8, series: 5, txt: '100 kg × 8 (5 séries)', rm: 127 }
  };

  /* ---------- CHARGES DE DÉPART · PHASE 2 ---------- */
  const ARRANQUE = {
    titulo: 'Avec quel poids tu démarres en salle (semaine 3)',
    derivacion: 'Ils sortent de tes vraies marques — couché 95×8 et squat 100×8 (1RM ≈ 120 et ≈ 127 kg) — à 50% : le départ standard de celui qui revient. Non pas parce que le muscle ne peut pas plus, mais parce que le tendon n’a rien chargé depuis 5 ans. À partir de là, la double progression, c’est l’app qui la gère.',
    tabla: [
      { ej: 'press-banca',      s3: '45 kg', s4: '47,5 kg', s5: '50 kg', n: '50% de tes 95. Barre + 2×12,5' },
      { ej: 'sentadilla-barra', s3: '50 kg', s4: '55 kg',   s5: '60 kg', n: '50% de tes 100. Barre + 2×15' },
      { ej: 'rdl-barra',        s3: '45 kg', s4: '50 kg',   s5: '55 kg', n: '≈45% de ton squat d’avant' },
      { ej: 'remo-barra',       s3: '40 kg', s4: '42,5 kg', s5: '45 kg', n: '≈45% de ton couché d’avant' }
    ],
    resto: 'Les autres exercices n’ont pas de marque de référence : sur la première série, choisis un poids que tu peux bouger en gardant 3 répétitions en réserve, note-le, et l’app prend le relais.',
    aviso: 'Ces poids te paraîtront ridicules. C’est exactement le but : la tendinite de celui qui revient se fabrique dans les semaines 3-5, quand le système nerveux autorise ce que les tendons ne tolèrent pas encore.',
    desequilibrio: 'Tes propres marques le disent : squat 100 vs couché 95, c’est un ratio de 1,05 (l’équilibre tourne autour de 1,4-1,5). Le bas du corps était à la traîne — et c’est la double bonne nouvelle : c’est là que tu as le plus de marge et ce qui fait le plus bouger la recomposition. Ne saute pas les jours de jambes.'
  };


  /* ---------- FICHES D’EXERCICES ---------- */
  // musc : [principal, secondaires] · cues : technique · err : erreurs typiques ·
  // alt : alternatives équivalentes (salle commerciale) · mol : si ça gêne, passe à
  const EJERCICIOS = {
    /* — Maison / P1 — */
    'sentadilla-pc': { pat: 'rod',
      nombre: 'Squat au poids du corps', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadriceps', 'fessier'], equipo: 'Rien',
      cues: ['Pieds largeur d’épaules, pointes légèrement ouvertes', 'Descends en 3″ comme pour t’asseoir en arrière, remonte en 1″', 'Les genoux suivent la pointe des pieds, talons vissés au sol', 'Poitrine haute sur tout le trajet'],
      err: ['Talons qui décollent (descends moins bas)', 'Genoux qui rentrent vers l’intérieur', 'Descendre en rebondissant au lieu de contrôler'],
      alt: [{ n: 'Squat sur box/canapé', por: 'si tu as du mal à contrôler la profondeur' }, { n: 'Squat avec pause 2″ en bas', por: 'si 12 reps deviennent trop faciles' }],
      mol: 'Si le genou gêne : réduis la profondeur jusqu’à la zone sans douleur et descends encore plus lentement.'
    },
    'flexiones': { pat: 'eh',
      nombre: 'Pompes', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Pectoraux', 'triceps, épaules'], equipo: 'Rien',
      cues: ['Mains un peu plus larges que les épaules', 'Coudes à 45° du corps, ni collés ni en croix', 'Corps en planche : fessier et abdos serrés', 'La poitrine touche (presque) le sol à chaque rep'],
      err: ['Hanches qui tombent ou en pic', 'Demi-amplitude', 'Cou qui plonge vers le sol'],
      alt: [{ n: 'Pompes mains sur canapé/table', por: 'si elles ne sortent pas propres au sol' }, { n: 'Pompes pieds surélevés', por: 'si tu en passes 12 facilement' }],
      mol: 'Si le poignet gêne : poings fermés ou poignées de pompes. Si l’épaule gêne : resserre un peu l’écartement.'
    },
    'puente-gluteo': { pat: 'bis',
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
    'zancada-alterna': { pat: 'zan',
      nombre: 'Fentes alternées', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadriceps', 'fessier'], equipo: 'Rien',
      cues: ['Grand pas vers l’avant', 'Buste vertical, mains sur les hanches ou devant', 'Le genou arrière frôle le sol', 'Pousse dans le talon avant pour revenir'],
      err: ['Pas trop court (le genou avant s’écrase)', 'Buste penché vers l’avant', 'Genou avant qui part vers l’intérieur'],
      alt: [{ n: 'Fente statique (sans alterner)', por: 'si l’équilibre lâche' }, { n: 'Fente arrière', por: 'plus douce pour le genou' }],
      mol: 'Si le genou gêne : passe à la fente ARRIÈRE, même schéma.'
    },
    'remo-toalla': { pat: 'th',
      nombre: 'Rowing serviette sur porte', mm: { p: ['dorsal'], s: ['biceps', 'espalda-alta'] }, zona: 'tiron', musc: ['Dorsaux', 'biceps, omoplates'], equipo: 'Serviette + porte (ou sac à dos)',
      cues: ['Serviette sur la poignée/le cadre, corps incliné en arrière', 'Tire avec le COUDE, pas avec la main', 'Omoplates en arrière et en bas en fin de trajet', 'Plus tu t’inclines, plus c’est dur'],
      err: ['Tirer avec les bras sans bouger les omoplates', 'Donner des à-coups avec les hanches'],
      alt: [{ n: 'Rowing avec sac à dos chargé', por: 'à une main, appuyé sur la table' }, { n: 'Rowing inversé sous une table solide', por: 'version plus dure' }],
      mol: 'Si le coude gêne : prends plus large et réduis l’inclinaison.'
    },
    'rdl-1p': { pat: 'bis',
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
      cues: ['Allongé, lombaires PLAQUÉES au sol en permanence', 'Bras et jambe opposés descendent lentement en même temps', 'Expire en étendant : les côtes restent basses'],
      err: ['Les lombaires se cambrent quand la jambe s’étend (raccourcis le trajet)', 'Aller vite'],
      alt: [{ n: 'Jambes seules (bras immobiles)', por: 'si tu perds les lombaires au sol' }],
      mol: 'C’est l’exercice le plus sûr du plan ; si quelque chose gêne, vérifie que les lombaires ne décollent pas.'
    },

    /* — Salle : poussée — */
    'press-banca': { pat: 'eh',
      nombre: 'Développé couché', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Pectoraux', 'triceps, deltoïde antérieur'], equipo: 'Barre + banc',
      cues: ['Omoplates rétractées et VISSÉES au banc, pieds ancrés au sol', 'Prise : avant-bras vertical quand la barre touche la poitrine', 'La barre descend au milieu de la poitrine, coudes ~45°', 'Touche la poitrine avec contrôle et pousse en ligne légèrement diagonale'],
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
      cues: ['Debout : fessier et abdos SERRÉS avant de pousser', 'La barre part du menton et monte collée au visage', 'La tête « passe par la fenêtre » à la fin', 'Assis avec dossier : sans cambrer les lombaires'],
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
    'elev-laterales': { pat: 'ev',
      nombre: 'Élévations latérales', mm: { p: ['hombro'], s: [] }, zona: 'empuje', musc: ['Deltoïde latéral'], equipo: 'Haltères',
      cues: ['Poids LÉGER, coudes un peu fléchis', 'Monte jusqu’à l’horizontale, comme pour servir deux carafes', 'Sans élan : si tu balances, il y a trop de poids', 'Descends en 2″'],
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
    'fondos': { pat: 'ev',
      nombre: 'Dips assistés', mm: { p: ['pecho'], s: ['triceps'] }, zona: 'empuje', musc: ['Bas des pectoraux', 'triceps'], equipo: 'Machine à dips assistés ou élastiques',
      cues: ['Corps légèrement penché en avant (plus de pecs)', 'Descends jusqu’à 90° de coude, pas plus si l’épaule proteste', 'Coudes qui ne s’ouvrent pas en croix'],
      err: ['Descendre trop profond', 'Épaules haussées vers les oreilles'],
      alt: [{ n: 'Développé décliné ou dips entre bancs', por: 's’il n’y a pas de machine assistée' }],
      mol: 'Si le sternum ou l’épaule gêne : remplace par du développé couché haltères.'
    },
    'ext-triceps-polea': { pat: 'ext',
      nombre: 'Extension triceps à la poulie', mm: { p: ['triceps'], s: [] }, zona: 'empuje', musc: ['Triceps'], equipo: 'Poulie haute + corde ou barre',
      cues: ['Coudes collés au corps, FIXES', 'Seul l’avant-bras bouge', 'Étends à fond et serre 1″'],
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
      cues: ['Buste à ~45°, genoux semi-fléchis', 'Tire la barre vers le bas de l’abdomen', 'Omoplates en arrière et en bas à la fin', 'Dos NEUTRE non négociable'],
      err: ['Donner des à-coups avec les lombaires (tu te balances)', 'Buste qui se redresse rep après rep', 'Tirer vers la poitrine avec les coudes ouverts'],
      alt: [{ n: 'Rowing T-bar', por: 'variante plus stable' }, { n: 'Rowing machine avec appui poitrine', por: 'si les lombaires sont chargées du jour jambes' }],
      mol: 'Si les lombaires protestent : machine avec appui poitrine ou rowing à la poulie, sans hésiter.'
    },
    'remo-polea': { pat: 'th',
      nombre: 'Rowing assis à la poulie', mm: { p: ['espalda-alta'], s: ['biceps', 'dorsal'] }, zona: 'tiron', musc: ['Milieu du dos', 'dorsaux, biceps'], equipo: 'Poulie basse + triangle',
      cues: ['Poitrine haute et FIXE : le buste ne voyage pas', 'Tire le triangle vers le nombril', 'Pause 1″ en serrant les omoplates'],
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
      cues: ['Prise un peu plus large que les épaules', 'Poitrine haute, légère inclinaison arrière FIXE', 'Tire les COUDES vers les poches', 'Barre à la clavicule, 1″ de pause'],
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
      cues: ['Commence en abaissant les omoplates (épaules loin des oreilles)', 'Tire les coudes vers le bas, menton au-dessus de la barre', 'Descends en CONTRÔLANT jusqu’aux bras presque tendus', 'Réduis l’assistance semaine après semaine : elles sortiront plus tôt que tu ne crois'],
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
      cues: ['Poulie à hauteur du visage', 'Tire la corde VERS LE FRONT en écartant les extrémités', 'À la fin, tourne les épaules vers l’extérieur (les biceps pointent au plafond)', 'Léger et parfait : c’est de la santé d’épaule, pas de l’ego'],
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
      cues: ['Barre sur le trapèze, pas sur les cervicales', 'Core pressurisé AVANT de descendre (prends l’air dans la poitrine et le ventre)', 'Descends au parallèle, genoux vers l’extérieur', 'Pousse le sol, poitrine haute en remontant'],
      err: ['Talons qui décollent (la faute aux chevilles : surélève les talons avec des disques s’il le faut)', 'Genoux qui rentrent vers l’intérieur en remontant', 'Good morning : les hanches montent avant la poitrine'],
      alt: [{ n: 'Squat à la Smith machine', por: 'jours de fatigue ou rack occupé' }, { n: 'Hack squat / presse', por: 'stimulus quadriceps sans charge axiale' }, { n: 'Goblet squat avec haltère', por: 'en échauffement ou si la technique se perd' }],
      mol: 'Si le genou gêne : ralentis la descente (3″) et reste 5 cm au-dessus du point douloureux. Si les lombaires gênent : revois la pressurisation et baisse le poids de 20% pendant une semaine.'
    },
    'prensa': { pat: 'rod',
      nombre: 'Presse à cuisses', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadriceps', 'fessier'], equipo: 'Machine à presse',
      cues: ['Pieds à mi-hauteur du plateau, largeur d’épaules', 'Descends jusqu’à 90° SANS décoller les lombaires du dossier', 'Pousse avec toute la plante, ne verrouille pas les genoux d’un coup'],
      err: ['Descendre au point que le bassin bascule (butt wink à la presse = lombaires)', 'Mains qui poussent sur les genoux'],
      alt: [{ n: 'Hack squat', por: 'encore plus de quadriceps' }, { n: 'Presse à une jambe', por: 's’il y a un déséquilibre' }],
      mol: 'Si le genou gêne : pieds un peu plus hauts sur le plateau (plus de fessier, moins de genou).'
    },
    'rdl-barra': { pat: 'bis',
      nombre: 'Soulevé de terre roumain', mm: { p: ['isquios'], s: ['gluteo', 'lumbar'] }, zona: 'pierna', musc: ['Ischios', 'fessier, lombaires en isométrique'], equipo: 'Barre',
      cues: ['Hanches en ARRIÈRE, genoux semi-fléchis fixes', 'Barre collée aux jambes sur tout le trajet', 'Dos neutre : poitrine fière', 'Descends jusqu’à sentir l’étirement fort des ischios et remonte en serrant le fessier'],
      err: ['Arrondir le dos pour descendre plus bas', 'Plier les genoux et le transformer en demi-squat', 'Barre qui s’éloigne du corps'],
      alt: [{ n: 'RDL haltères', por: 'prise plus confortable les premières semaines' }, { n: 'Hyperextensions 45° lestées', por: 'ischios-fessiers sans contrainte de prise' }],
      mol: 'L’étirement des ischios est le signe que tu le fais BIEN. Si les lombaires gênent (pas les ischios) : baisse de 20% et filme une série de profil.'
    },
    'hip-thrust': { pat: 'bis',
      nombre: 'Hip thrust', mm: { p: ['gluteo'], s: ['isquios'] }, zona: 'pierna', musc: ['Fessier', 'ischios'], equipo: 'Barre + banc (+ protection)',
      cues: ['Haut du dos en appui sur le banc, barre sur les hanches avec protection', 'Menton rentré, regard vers l’avant-bas', 'Monte jusqu’à l’horizontale EXACTE, pause 1″ en serrant', 'Genoux à 90° en haut, talons sous les genoux'],
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
      cues: ['Pied arrière sur le banc, l’avant à un grand pas', 'Descends VERTICAL : le genou arrière cherche le sol', 'Buste légèrement penché = plus de fessier ; vertical = plus de quadriceps', 'Commence UNIQUEMENT au poids du corps, sérieusement'],
      err: ['Pied avant trop proche (le genou trinque)', 'Rebondir en bas', 'Perdre l’équilibre en regardant le plafond'],
      alt: [{ n: 'Fente statique haltères', por: 'si l’équilibre n’est pas encore là' }, { n: 'Presse à une jambe', por: 'unilatéral sans équilibre' }],
      mol: 'Si le genou avant gêne : allonge le pas et penche le buste un peu en avant.'
    },
    'ext-cuadriceps': { pat: 'rod',
      nombre: 'Leg extension', mm: { p: ['cuadriceps'], s: [] }, zona: 'pierna', musc: ['Quadriceps (isolés)'], equipo: 'Machine',
      cues: ['Genou aligné avec l’axe de la machine', 'Étends à fond avec pause 1″ en haut', 'Descends en 2-3″'],
      err: ['Donner des coups de pied avec élan', 'Fesses qui décollent du siège'],
      alt: [{ n: 'Sissy squat assisté', por: 'sans machine' }],
      mol: 'Si la rotule gêne : coupe le dernier tiers EN HAUT, pas en bas, et tempo plus lent. C’est aussi ton exercice de rééducation si un jour le genou proteste après le footing.'
    },
    'curl-femoral-tumbado': { pat: 'ais',
      nombre: 'Leg curl allongé', mm: { p: ['isquios'], s: [] }, zona: 'pierna', musc: ['Ischios (isolés)'], equipo: 'Machine',
      cues: ['Hanches PLAQUÉES au banc en permanence', 'Monte en 1″, descends en 2-3″', 'Pointe du pied neutre'],
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
      cues: ['Pause 1″ EN HAUT et 1″ EN BAS : sans rebond', 'Étirement complet en bas', 'Monte vertical, sans plier les genoux'],
      err: ['Rebondir en exploitant le réflexe du tendon (ça vole le stimulus au tissu qu’on veut justement préparer)', 'Demi-amplitude'],
      alt: [{ n: 'À la presse', por: 'sans machine dédiée' }],
      mol: 'Si l’Achille gêne : uniquement des isométriques en haut 3×30″ cette semaine-là.'
    },
    'gemelo-sentado': { pat: 'gem',
      nombre: 'Mollets assis', mm: { p: ['gemelos'], s: [] }, zona: 'pierna', musc: ['Soléaire'], equipo: 'Machine',
      cues: ['Genou à 90° : ici travaille le soléaire, la clé pour COURIR', 'Même règle : pause en haut et en bas, sans rebonds'],
      err: ['Aller vite en rebondissant', 'Mettre l’appui sur le bout des orteils (mieux sur leur base)'],
      alt: [{ n: 'Assis avec haltères sur les genoux + marche', por: 'sans machine' }],
      mol: 'Comme debout : gêne à l’Achille = uniquement des isométriques pendant une semaine.'
    },
    'elev-piernas': { pat: 'flex',
      nombre: 'Relevés de jambes suspendu', mm: { p: ['abdomen'], s: ['antebrazo'] }, zona: 'core', musc: ['Bas des abdos', 'fléchisseurs, grip'], equipo: 'Barre de tractions',
      cues: ['Suspension active (épaules loin des oreilles)', 'Monte les genoux à la poitrine SANS balancement', 'Redescends contrôlé jusqu’en bas'],
      err: ['Se balancer', 'Tirer uniquement des fléchisseurs de hanche avec les lombaires cambrées'],
      alt: [{ n: 'Aux barres parallèles (appui sur les coudes)', por: 'si le grip lâche avant les abdos' }, { n: 'Relevés allongé', por: 'version de départ' }],
      mol: 'Si l’épaule gêne en suspension : passe directement aux barres parallèles.'
    },
    'rueda-abdominal': { pat: 'flex',
      nombre: 'Roulette abdominale', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Core antérieur complet'], equipo: 'Ab wheel',
      cues: ['À genoux, bassin en rétroversion AVANT de partir', 'Roule jusqu’où tu contrôles les lombaires', 'Reviens en tirant avec les abdos, pas avec les bras'],
      err: ['Cambrer les lombaires en s’étendant (l’erreur qui blesse)', 'Aller plus loin que ce que le core tient'],
      alt: [{ n: 'Crunch à la poulie', por: 'si la roulette est trop grosse aujourd’hui' }, { n: 'Planche lestée', por: 'isométrique équivalent' }],
      mol: 'Si les lombaires gênent : coupe le trajet de moitié et gagne de l’amplitude semaine après semaine.'
    },
    'crunch-polea': { pat: 'flex',
      nombre: 'Crunch à la poulie', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Grand droit'], equipo: 'Poulie haute + corde',
      cues: ['À genoux, corde de chaque côté de la tête', 'Fléchis DEPUIS LES CÔTES, pas depuis les hanches', 'Coudes vers les genoux, expire en descendant'],
      err: ['Tirer avec les bras', 'S’asseoir en arrière en ne bougeant que les hanches'],
      alt: [{ n: 'Crunch à la machine', por: 'équivalent' }, { n: 'Roulette abdominale', por: 'quand tu veux monter d’un niveau' }],
      mol: 'Pas d’incident typique si tu fléchis depuis les côtes.'
    },

    /* — Bras — */
    'curl-barra-z': { pat: 'curl',
      nombre: 'Curl barre EZ', mm: { p: ['biceps'], s: [] }, zona: 'tiron', musc: ['Biceps'], equipo: 'Barre EZ',
      cues: ['Coudes collés au corps, FIXES', 'Monte sans balancement, descends en 2-3″', 'Poignets neutres grâce à la EZ'],
      err: ['Balancer le corps pour monter plus lourd', 'Coudes qui voyagent vers l’avant en haut'],
      alt: [{ n: 'Curl haltères alterné', por: 'avec rotation (supination), très complet' }, { n: 'Curl à la poulie basse', por: 'tension continue' }],
      mol: 'Si le poignet ou le coude gêne : haltères avec rotation ou prise marteau.'
    },
    'curl-inclinado': { pat: 'curl',
      nombre: 'Curl incliné haltères', mm: { p: ['biceps'], s: [] }, zona: 'tiron', musc: ['Biceps (chef long)'], equipo: 'Haltères + banc 45-60°',
      cues: ['Banc à 45-60°, bras PENDANTS à la verticale', 'L’étirement en bas est le stimulus : ne le coupe pas', 'Coudes immobiles, monte sans hausser les épaules'],
      err: ['Avancer les coudes', 'Demi-répétition en bas'],
      alt: [{ n: 'Curl bayésien à la poulie', por: 'même étirement, debout' }],
      mol: 'Si l’épaule tire en bas : remonte le dossier d’un cran.'
    },
    'curl-martillo': { pat: 'curl',
      nombre: 'Curl marteau', mm: { p: ['biceps'], s: ['antebrazo'] }, zona: 'tiron', musc: ['Brachial', 'avant-bras'], equipo: 'Haltères',
      cues: ['Prise neutre (marteau), coudes fixes', 'Tu peux le faire alterné ou simultané', 'Contrôle la descente'],
      err: ['Balancement', 'Le transformer en rowing en montant les coudes'],
      alt: [{ n: 'Curl marteau à la corde à la poulie', por: 'variante' }],
      mol: 'C’est le curl le plus doux pour les coudes et les poignets : c’est souvent le REFUGE quand les autres gênent.'
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
    { n: 1, t: 'RPE contrôlé', d: 'Chaque phase a son plafond d’effort. Ton système nerveux se souvient d’avoir été athlète ; tes tendons sortent de 5 ans de canapé. Freine toi-même avant qu’ils ne freinent, eux.' },
    { n: 2, t: 'Double progression', d: 'D’abord monte les répétitions dans la fourchette, ensuite monte le poids (+2,5 kg ; +5 kg au squat et au soulevé de terre roumain). Seulement si la technique était propre sur TOUTES les séries. L’app te le suggère toute seule.' },
    { n: 3, t: 'Balance = moyenne hebdo', d: 'Pèse-toi lundi-mercredi-vendredi à jeun et ne regarde que la moyenne. Un jour isolé ne veut rien dire (eau, sel, créatine).' },
    { n: 4, t: 'Protéines : {p} g en 4 prises', d: 'Petit-déj, déjeuner, dîner et une prise avant de dormir. Aucune prise sous {q} g. C’est la variable qui décide si ton changement de poids est du gras ou du muscle.' },
    { n: 5, t: '8 000–10 000 pas par jour', d: 'Tous les jours, entraînement ou pas. Ça brûle plus sur la semaine que les séances elles-mêmes.' },
    { n: 6, t: 'Sommeil 7–8 h : non négociable', d: 'Ce n’est pas un objectif, c’est une règle : dormir 5,5 h en déficit transforme la perte en −55% de gras et +60% de muscle (Nedeltcheva 2010). Caféine forte uniquement avant 13-14 h.' },
    { n: 7, t: 'Un jour raté ne se rattrape pas', d: 'Ne double pas les séances et ne coupe pas les repas le lendemain. Tu suis le calendrier là où il en est.' },
    { n: 8, t: 'Le minimum non négociable', d: 'Ton schéma historique, c’est 3 mois à fond / 3 mois à zéro. La semaine chaotique a un plancher : 2 séances de force + 1 cardio. Ça, ça maintient tout.' }
  ];

  const SENALES = 'Signaux pour arrêter un exercice ce jour-là : douleur aiguë au genou, à l’épaule ou aux lombaires pendant le mouvement ; gêne qui empire série après série au lieu de disparaître à l’échauffement. Courbatures diffuses 24-48 h après = normal. Douleur articulaire localisée qui persiste plus de 5 jours = kiné avant de continuer à charger.';

  /* ---------- NUTRITION ---------- */
  const NUTRI = {
    calorias: [
      { c: 'Métabolisme de base (Mifflin-St Jeor)', v: '~1 950 kcal', n: '95,1 kg · 183 cm · 30 ans' },
      { c: 'Dépense totale estimée (plan en route)', v: '2 850–3 000 kcal', n: 'Entraînements + 8-10k pas' },
      { c: 'Apport cible', v: '2 250–2 400 kcal', n: 'Déficit ~550–700 kcal/jour (au-delà, ça freine la reprise de muscle : Murphy & Koehler 2022)' },
      { c: 'Rythme de perte attendu', v: '0,6–0,75 kg/sem', n: '≈0,7% du poids/sem, le point optimal pour garder du maigre (Garthe 2011). Moyenne hebdo, pas au jour le jour' }
    ],
    fases: [
      { f: 'P1–P2 (sem 1-5)', kcal: 2250, p: 190, g: 70, c: 205 },
      { f: 'P3 (sem 6-9)',    kcal: 2350, p: 190, g: 70, c: 230, nota: 'Semaine 7 : DIET BREAK à ~2 800' },
      { f: 'P4 (sem 10-12)',  kcal: 2400, p: 190, g: 70, c: 240 }
    ],
    escalado: 'Les protéines ne bougent jamais : {p} g par jour pour toi. Quand le volume monte, seuls les glucides montent. En pratique : en F3 ajoute un fruit + 40 g de pain au déjeuner les jours d’entraînement ; en F4, pareil tous les jours.',
    tomas: 'QUATRE prises de protéines par jour, aucune sous 38-40 g : petit-déjeuner, déjeuner, dîner et une prise pré-sommeil (skyr + whey). C’est le total quotidien qui commande, mais la répartition en 4 maximise la synthèse protéique et coupe la faim nocturne.',
    plato: [
      { t: 'Protéines (chaque repas)', d: '200-250 g de poulet/dinde/poisson blanc en cru, ou 170-180 g de saumon/bœuf, ou 3 œufs + 2 blancs, ou 250 g de skyr + whey. Référence visuelle : une paume et demie.' },
      { t: 'Glucides', d: '60-75 g en cru de riz/pâtes, ou 250-300 g de pommes de terre, ou 60 g de pain complet, ou 50 g de flocons d’avoine. Référence : un poing.' },
      { t: 'Légumes', d: 'La moitié de l’assiette, à volonté. Volume et satiété.' },
      { t: 'Graisses', d: '10 g d’huile d’olive vierge extra par repas principal (une cuillère à soupe) et on arrête de compter. C’est là que les calories filent sans que tu t’en rendes compte.' }
    ],
    suplementos: [
      { t: 'Créatine monohydrate', d: '5 g par jour, à n’importe quelle heure, sans phase de charge, dès maintenant. ATTENTION : elle retient 1-2 kg d’eau les premières semaines. Ce n’est pas du gras : fie-toi au tour de taille et à la moyenne hebdo, pas au chiffre isolé (l’app le marque sur le graphique).' },
      { t: 'Whey', d: '1 dose dans la prise pré-sommeil avec le skyr (et une autre là où il faut, les jours courts en protéines).' },
      { t: 'Caféine', d: 'Coupure à 13-14 h : 200 mg perturbent le sommeil jusqu’à 13 h après ; un café, ~9 h (Gardiner 2023). Entraînement le matin : café 30-45′ avant, parfait. Le soir : sans caféine — ton pré-workout, c’est le goûter (fruit + skyr 60-90′ avant).' },
      { t: 'Optionnels sensés', d: 'Vitamine D seulement si l’analyse sort sous 30 ng/mL (probable avec une vie d’intérieur). Oméga-3 ~2 g EPA+DHA/jour : bénéfice modeste mais réel sur la force et l’angle anti-inflammatoire/tendon.' },
      { t: 'NE dépense PAS dans', d: 'Brûleurs de graisse, BCAA/EAA (redondants avec tes protéines quotidiennes), « testo boosters ». Rien de tout ça ne fait bouger l’aiguille.' }
    ],
    hidratacion: 'Eau : 2,5–3 L/jour. Alcool : il compte en calories et bloque la récupération — dans le repas libre, hors du reste de la semaine.',
    comidaLibre: 'UN repas libre par semaine (samedi par défaut), pas une journée. Tu commandes ou manges ce qui te fait envie en quantité normale, sans compenser ni avant ni après. Ça sert à ce que le plan tienne 12 semaines et une vie sociale. Si un plan tombe un autre jour, il se déplace — mais il en reste un seul.'
  };


  /* ---------- RECETTES ---------- */
  // q en grammes sauf unité indiquée · macros par portion
  const RECETAS = [
    {
      id: 'bol-skyr', slot: 'de', tags: ['lacteo', 'frutos'], nombre: 'Bol de skyr', tipo: 'Petit-déj A', tiempo: '5′', cocina: 'Sans cuisson',
      macros: { kcal: 520, p: 35, g: 11, c: 72 },
      ing: [
        { q: '250 g', i: 'skyr nature (ou fromage blanc 0%)' },
        { q: '50 g', i: 'flocons d’avoine' },
        { q: '1 pièce (120 g)', i: 'banane' },
        { q: '10 g', i: 'noix' },
        { q: 'au goût', i: 'cannelle' }
      ],
      pasos: [
        'Le skyr dans le bol et l’avoine par-dessus (telle quelle si tu aimes la texture, ou trempée 5′ dans un doigt de lait ou d’eau).',
        'Banane en rondelles, noix concassées à la main et cannelle par-dessus.'
      ],
      tips: 'Si tu t’entraînes le matin : monte-le la veille au soir (l’avoine trempée y gagne). Jour court en protéines : +1 dose de whey mélangée au skyr (+110 kcal, +23 g P).'
    },
    {
      id: 'tortilla-pan', slot: 'de', tags: ['huevo', 'gluten'], nombre: 'Omelette, pain et tomate', tipo: 'Petit-déj B', tiempo: '10′', cocina: 'Poêle',
      macros: { kcal: 470, p: 34, g: 22, c: 32 },
      ing: [
        { q: '3 pièces', i: 'œufs M' },
        { q: '2 pièces (ou 100 ml en bouteille)', i: 'blancs d’œufs' },
        { q: '60 g (2 tranches)', i: 'pain complet' },
        { q: '100 g', i: 'tomate râpée' },
        { q: '5 g', i: 'huile d’olive vierge extra' },
        { q: 'pincée', i: 'sel' }
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
        { q: '250 g cru (~200 g cuit)', i: 'blanc de poulet', n: 'batch : 1,2 kg = 5 portions' },
        { q: '300 g', i: 'pommes de terre en quartiers + poivron + oignon rôtis', n: 'batch : 1,5 kg de pommes de terre + 2 poivrons + 2 oignons' },
        { q: '10 g', i: 'huile d’olive vierge extra (comptée dans le rôti)' },
        { q: 'au goût', i: 'paprika, ail en poudre, sel, origan' }
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
        { q: '250 g égouttées', i: 'lentilles cuites en bocal', n: 'batch : 2 bocaux = 3 portions' },
        { q: '120 g', i: 'poulet rôti en lanières (de la fournée au four)' },
        { q: '¼ pièce', i: 'oignon' },
        { q: '½ pièce', i: 'poivron' },
        { q: '1 pièce', i: 'carotte' },
        { q: '4 g', i: 'huile d’olive vierge extra (comptée dans les légumes revenus)' },
        { q: '1 c. à café / ½ c. à café', i: 'paprika / cumin' },
        { q: '150 ml', i: 'bouillon ou eau' },
        { q: '1 pièce', i: 'fruit en dessert' }
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
        { q: '180-200 g', i: 'bœuf maigre en lanières' },
        { q: '70 g cru (≈ 180 g cuit)', i: 'riz', n: 'prends celui du batch' },
        { q: '250 g', i: 'légumes variés : poivron, oignon, courgette, carotte' },
        { q: '15 ml', i: 'sauce soja' },
        { q: '8 g', i: 'huile d’olive vierge extra' }
      ],
      pasos: [
        'Wok ou poêle TRÈS chaude avec l’huile : saisis le bœuf 1-2′ et réserve-le (si tu le laisses, il bout et durcit).',
        'Même poêle : les légumes en lanières 5-6′, qu’ils restent al dente.',
        'Remets le bœuf, la sauce soja, 1′ de remuage et le tout sur le riz.'
      ],
      tips: 'L’ordre fait tout : la viande sort avant les légumes. Demande au boucher des « lanières à sauter » et tu t’épargnes la découpe.'
    },
    {
      id: 'salmon-arroz', slot: 'ce', tags: ['pescado'], nombre: 'Saumon, riz et brocoli', tipo: 'Dîner · 15′', tiempo: '15′', cocina: 'Poêle ou four',
      macros: { kcal: 760, p: 40, g: 28, c: 62 },
      ing: [
        { q: '170-180 g', i: 'pavé de saumon' },
        { q: '75 g cru (≈ 190 g cuit)', i: 'riz', n: 'du batch' },
        { q: '200 g', i: 'brocoli' },
        { q: '½ pièce', i: 'citron' },
        { q: 'pincée', i: 'sel' }
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
        { q: '250 g', i: 'colin (merlu) ou bar en filets' },
        { q: '250 g', i: 'pommes de terre' },
        { q: 'bol', i: 'salade verte (laitue, tomate, oignon)' },
        { q: '10 g', i: 'huile d’olive vierge extra (5 pommes de terre + 5 salade)' },
        { q: '1 pièce', i: 'skyr en dessert' }
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
        { q: '3 pièces', i: 'œufs M' },
        { q: '150 g', i: 'crevettes décortiquées (les surgelées vont très bien)' },
        { q: '40 g', i: 'pain complet' },
        { q: 'bol', i: 'salade verte' },
        { q: '8 g', i: 'huile d’olive vierge extra' },
        { q: '1 gousse', i: 'ail' }
      ],
      pasos: [
        'Fais dorer l’ail émincé dans l’huile ; les crevettes 2′ (décongelées et séchées avant).',
        'Baisse le feu, ajoute les œufs battus et remue SANS T’ARRÊTER jusqu’à texture crémeuse. Retire avant que ça prenne complètement.',
        'Pain toasté et salade à côté.'
      ],
      tips: 'La brouillade finit de cuire hors du feu. Crevettes surgelées : décongèle-les dans un bol d’eau froide en 10′.'
    },
    {
      id: 'toma-noche', slot: 'snack', tags: ['lacteo'], nombre: 'Prise pré-sommeil', tipo: 'Prise 4 · quotidienne', tiempo: '1′', cocina: 'Sans cuisson',
      macros: { kcal: 270, p: 49, g: 2, c: 14 },
      ing: [
        { q: '250 g', i: 'skyr ou fromage blanc 0%' },
        { q: '1 dose (30 g)', i: 'whey (le parfum qui ne te lasse pas)' },
        { q: 'au goût', i: 'cannelle' }
      ],
      pasos: [
        'Mélange la dose de whey au skyr jusqu’à texture de mousse. Cannelle par-dessus.',
        '30-60′ avant de te coucher. C’est tout.'
      ],
      tips: 'Cette prise complète les protéines du jour et tue la faim nocturne, le moment où meurent les régimes. La caséine laitière à digestion lente travaille pendant ton sommeil.'
    },
    {
      id: 'ensalada-atun', slot: 'ce', tags: ['pescado', 'huevo'], nombre: 'Salade complète au thon', tipo: 'Dîner · 10′', tiempo: '10′', cocina: 'Sans feu (avec le batch)',
      macros: { kcal: 700, p: 45, g: 25, c: 50 },
      ing: [
        { q: '2 boîtes (120 g égoutté)', i: 'thon au naturel' },
        { q: '1 pièce', i: 'œuf dur (du batch)' },
        { q: '150 g', i: 'pommes de terre cuites (du batch)' },
        { q: '150 g', i: 'tomate' },
        { q: '30 g', i: 'olives' },
        { q: '¼ pièce', i: 'oignon rouge' },
        { q: '10 g', i: 'huile d’olive vierge extra' }
      ],
      pasos: [
        'Tout dans le bol : pommes de terre en dés, tomate en quartiers, oignon émincé, thon égoutté, œuf en quartiers, olives.',
        'Huile, vinaigre, sel et on remue.'
      ],
      tips: 'Le dîner zéro effort si dimanche tu as cuit des pommes de terre et des œufs en plus. Version sans pommes de terre (jour de petite faim) : ajoute plus de tomate.'
    },
    { id: 'porridge-soja', slot: 'de', tags: [], nombre: 'Porridge d’avoine et protéine', tipo: 'Petit-déj C', tiempo: '8′', cocina: 'Casserole ou micro-ondes',
      macros: { kcal: 545, p: 37, g: 11, c: 69 },
      ing: [{ q: '70 g', i: 'flocons d’avoine (certifiés sans gluten)' }, { q: '250 ml', i: 'boisson de soja sans sucre' }, { q: '25 g', i: 'protéine de pois, nature ou vanille' }, { q: '1', i: 'banane en rondelles' }, { q: 'au goût', i: 'cannelle' }],
      pasos: ['Chauffe l’avoine avec le soja 4-5′ en remuant jusqu’à épaississement.', 'Hors du feu, incorpore la protéine : bouillie, elle fait des grumeaux.', 'Couronne avec la banane et la cannelle.'],
      tips: 'Prépare-le la veille au frigo (overnight) et ajoute juste la protéine le matin.' },
    { id: 'tofu-revuelto', slot: 'de', tags: [], nombre: 'Tofu brouillé sur toasts', tipo: 'Petit-déj D', tiempo: '12′', cocina: 'Poêle',
      macros: { kcal: 570, p: 41, g: 25, c: 42 },
      ing: [{ q: '200 g', i: 'tofu ferme émietté' }, { q: '2 tranches (70 g)', i: 'pain sans gluten' }, { q: '10 g', i: 'levure nutritionnelle' }, { q: '1', i: 'tomate en rondelles' }, { q: '5 g', i: 'huile d’olive vierge extra' }, { q: 'au goût', i: 'curcuma, sel noir kala namak, poivre' }],
      pasos: ['Fais sauter le tofu émietté dans l’huile 3-4′ à feu moyen-vif.', 'Ajoute curcuma, levure et sel noir (le goût d’œuf) ; 2′ de plus.', 'Grille le pain et dresse avec la tomate.'],
      tips: 'Le kala namak est la clé : sans lui, du tofu au curcuma ; avec, un vrai brouillé.' },
    { id: 'bol-soja-frutos', slot: 'de', tags: [], nombre: 'Bol de yaourt de soja aux fruits rouges', tipo: 'Petit-déj E', tiempo: '5′', cocina: 'Sans cuisson',
      macros: { kcal: 415, p: 29, g: 11, c: 41 },
      ing: [{ q: '250 g', i: 'yaourt de soja nature sans sucre' }, { q: '20 g', i: 'protéine végétale en poudre' }, { q: '120 g', i: 'fruits rouges (surgelés OK)' }, { q: '15 g', i: 'graines de chia' }, { q: '1', i: 'petite banane' }],
      pasos: ['Mélange le yaourt et la protéine jusqu’à disparition des grumeaux.', 'Ajoute le chia et attends 5′ : ça épaissit seul.', 'Couronne avec les fruits rouges et la banane.'],
      tips: 'Les fruits rouges surgelés, tels quels, refroidissent et épaississent le bol : mieux que des frais ici.' },
    { id: 'revuelto-espinacas', slot: 'de', tags: ['huevo'], nombre: 'Œufs brouillés aux épinards', tipo: 'Petit-déj F', tiempo: '10′', cocina: 'Poêle',
      macros: { kcal: 510, p: 28, g: 21, c: 46 },
      ing: [{ q: '3', i: 'œufs' }, { q: '100 g', i: 'épinards frais' }, { q: '100 g', i: 'champignons émincés' }, { q: '50 g', i: 'pain sans gluten' }, { q: '5 g', i: 'huile d’olive vierge extra' }, { q: '150 g', i: 'fruit de saison' }],
      pasos: ['Fais sauter les champignons 3′ ; ajoute les épinards jusqu’à ce qu’ils tombent.', 'Œufs battus dedans, feu doux, en remuant : crémeux, pas sec.', 'Sers avec le pain grillé et le fruit à part.'],
      tips: 'Coupe le feu quand ça semble encore un peu cru : la chaleur résiduelle finit le travail.' },
    { id: 'curry-lentejas', slot: 'co', tags: [], nombre: 'Curry de lentilles corail au riz', tipo: 'Déjeuner · batch du dimanche', tiempo: '25′ casserole', cocina: 'Casserole',
      macros: { kcal: 755, p: 31, g: 18, c: 108 },
      ing: [{ q: '100 g', i: 'lentilles corail sèches' }, { q: '100 ml', i: 'lait de coco léger' }, { q: '150 g', i: 'tomates concassées' }, { q: '50 g', i: 'riz basmati sec' }, { q: '10 g', i: 'huile d’olive vierge extra' }, { q: 'au goût', i: 'oignon, ail, gingembre, curry en poudre, sel' }],
      pasos: ['Fais suer oignon, ail et gingembre 3′ ; ajoute le curry et torréfie 30″.', 'Lentilles, tomate, coco et 300 ml d’eau : 18-20′ à feu moyen jusqu’à ce qu’elles se défassent.', 'Riz à part (12′). Curry par-dessus.'],
      tips: 'Batch : ×4, se garde 4 jours au frigo et se congèle parfaitement. Les lentilles corail ne se trempent pas.' },
    { id: 'tofu-salteado', slot: 'co', tags: [], nombre: 'Tofu sauté aux légumes et riz complet', tipo: 'Déjeuner · 20′', tiempo: '20′', cocina: 'Wok / poêle',
      macros: { kcal: 775, p: 47, g: 34, c: 71 },
      ing: [{ q: '200 g', i: 'tofu ferme en dés' }, { q: '70 g', i: 'riz complet sec' }, { q: '250 g', i: 'brocoli, poivron et carotte' }, { q: '15 ml', i: 'tamari (sauce soja sans gluten)' }, { q: '10 g', i: 'huile d’olive vierge extra' }, { q: '10 g', i: 'graines de sésame' }],
      pasos: ['Riz complet à cuire (25′ ; fais-en en batch).', 'Tofu à feu vif jusqu’à dorer sur toutes les faces (6-7′) ; réserve.', 'Légumes 4′ au wok, tofu de retour, tamari et sésame ; 1′ et c’est prêt.'],
      tips: 'Presse le tofu 10′ entre deux assiettes avec un poids : il rend son eau et dore vraiment.' },
    { id: 'bol-garbanzos', slot: 'co', tags: [], nombre: 'Bol de pois chiches rôtis, quinoa et houmous', tipo: 'Déjeuner · 15′ frais', tiempo: '15′ (+ four)', cocina: 'Four + sans cuisson',
      macros: { kcal: 780, p: 31, g: 24, c: 103 },
      ing: [{ q: '200 g', i: 'pois chiches cuits' }, { q: '60 g', i: 'quinoa sec' }, { q: '50 g', i: 'houmous' }, { q: '150 g', i: 'poivron rôti et concombre' }, { q: '5 g', i: 'huile d’olive vierge extra' }, { q: 'au goût', i: 'cumin, paprika, citron, sel' }],
      pasos: ['Pois chiches égouttés avec paprika, cumin et sel : four 200° 20′ jusqu’à croustillants (batch).', 'Quinoa : rince, 12′ dans deux fois son volume d’eau, repos couvert.', 'Monte le bol : quinoa, pois chiches, légumes, houmous et citron.'],
      tips: 'Les pois chiches rôtis tiennent 5 jours en bocal : c’est le « grignotage » de ce plan.' },
    { id: 'pasta-lentejas-tempeh', slot: 'co', tags: [], nombre: 'Pâtes de lentilles au tempeh et tomate', tipo: 'Déjeuner · 20′', tiempo: '20′', cocina: 'Casserole + poêle',
      macros: { kcal: 665, p: 46, g: 26, c: 67 },
      ing: [{ q: '80 g', i: 'pâtes de lentilles corail (sans gluten)' }, { q: '120 g', i: 'tempeh en dés' }, { q: '200 g', i: 'tomates concassées' }, { q: '80 g', i: 'oignon et ail' }, { q: '10 g', i: 'huile d’olive vierge extra' }, { q: 'au goût', i: 'basilic, origan, sel' }],
      pasos: ['Pâtes de lentilles 7-8′ (elles se défont vite : goûte avant le temps du paquet).', 'Tempeh doré dans l’huile 4′ ; oignon et ail 3′ de plus.', 'Tomate, origan et sel, 5′ ; mélange avec les pâtes et le basilic.'],
      tips: 'Le tempeh gagne beaucoup à être cuit 8′ à la vapeur avant de dorer : l’amertume disparaît.' },
    { id: 'tortilla-garbanzo', slot: 'ce', tags: [], nombre: 'Omelette de farine de pois chiche à la courgette', tipo: 'Dîner · 20′', tiempo: '20′', cocina: 'Poêle',
      macros: { kcal: 460, p: 20, g: 16, c: 62 },
      ing: [{ q: '80 g', i: 'farine de pois chiche (sans gluten)' }, { q: '200 g', i: 'courgette en fines lamelles' }, { q: '80 g', i: 'oignon' }, { q: '10 g', i: 'huile d’olive vierge extra' }, { q: '100 g', i: 'salade verte' }, { q: 'au goût', i: 'sel, poivre, curcuma' }],
      pasos: ['Mélange la farine avec 160 ml d’eau, sel et curcuma ; repos 10′.', 'Courgette et oignon 8′ à feu moyen jusqu’à tendres.', 'Verse la pâte dessus, couvre, 5′ par face. Salade à côté.'],
      tips: 'La vraie « omelette sans œuf » : elle prend pareil et se mange froide en lunchbox.' },
    { id: 'crema-calabaza-tofu', slot: 'ce', tags: [], nombre: 'Velouté de potiron, edamame et tofu grillé', tipo: 'Dîner · 25′', tiempo: '25′', cocina: 'Casserole + plancha',
      macros: { kcal: 590, p: 41, g: 24, c: 38 },
      ing: [{ q: '300 g', i: 'potiron en dés' }, { q: '100 g', i: 'edamame écossés (surgelés)' }, { q: '150 g', i: 'tofu ferme en tranches' }, { q: '60 g', i: 'oignon' }, { q: '10 g', i: 'huile d’olive vierge extra' }, { q: '10 g', i: 'graines de courge' }],
      pasos: ['Oignon et potiron dans 5 g d’huile 3′ ; couvre d’eau à hauteur, 15′ et mixe.', 'Edamame 4′ à l’eau bouillante ; égoutte et ajoute au velouté.', 'Tofu à la plancha avec le reste d’huile, 3′ par face. Graines par-dessus.'],
      tips: 'Sans crème ni pomme de terre : le potiron mixé est crémeux tout seul.' },
    { id: 'ensalada-quinoa-alubias', slot: 'ce', tags: [], nombre: 'Salade tiède de quinoa, haricots noirs et avocat', tipo: 'Dîner · 15′', tiempo: '15′', cocina: 'Casserole + sans cuisson',
      macros: { kcal: 610, p: 25, g: 21, c: 82 },
      ing: [{ q: '40 g', i: 'quinoa sec' }, { q: '200 g', i: 'haricots noirs cuits' }, { q: '80 g', i: 'avocat' }, { q: '120 g', i: 'tomate, oignon rouge et coriandre' }, { q: '5 g', i: 'huile d’olive vierge extra' }, { q: 'au goût', i: 'citron vert, cumin, sel' }],
      pasos: ['Quinoa 12′ dans deux fois son volume d’eau ; égoutte.', 'Haricots égouttés et rincés, dans le quinoa encore tiède.', 'Avocat, tomate, oignon et coriandre ; assaisonne citron vert, cumin et huile.'],
      tips: 'Se transporte très bien au travail : l’avocat, coupé au dernier moment.' },
    { id: 'bolonesa-soja', slot: 'ce', tags: [], nombre: 'Bolognaise de soja texturé aux spaghettis de courgette', tipo: 'Dîner · 20′', tiempo: '20′', cocina: 'Poêle',
      macros: { kcal: 445, p: 37, g: 13, c: 47 },
      ing: [{ q: '60 g', i: 'protéines de soja texturées fines (sèches)' }, { q: '250 g', i: 'tomates concassées' }, { q: '300 g', i: 'courgette en spirales ou lanières' }, { q: '100 g', i: 'oignon, carotte et ail' }, { q: '10 g', i: 'huile d’olive vierge extra' }, { q: 'au goût', i: 'origan, paprika, sel' }],
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
  const MEALPREP = [
    { min: '0′',  paso: 'Four à 200°. Sale et poivre 1,2 kg de blancs de poulet et enduis-les de paprika + ail en poudre.' },
    { min: '5′',  paso: 'Au four : plaque 1 (blancs de poulet, 25-30′) et plaque 2 (1,5 kg de pommes de terre en quartiers + 2 poivrons + 2 oignons + 20 g d’huile, 40-45′).' },
    { min: '10′', paso: 'Casserole à feu moyen : fais revenir oignon, poivron et carotte avec 10 g d’huile.' },
    { min: '15′', paso: 'Casserole 1 : 400 g de riz à cuire (12-15′). Casserole 2 : 6 œufs (10′) + 2 pommes de terre moyennes (laisse-les 20′) : œufs et pommes de terre pour la salade au thon.' },
    { min: '20′', paso: 'Dans la casserole : 2 bocaux de lentilles égouttées + 400 ml de bouillon + paprika et cumin. Feu doux 20′.' },
    { min: '30′', paso: 'Sors le poulet. Coupe 250 g en lanières pour les lentilles (à ajouter en éteignant). Égoutte le riz et étale-le sur une plaque pour qu’il refroidisse vite.' },
    { min: '45′', paso: 'Sors les pommes de terre du four. Retourne, goûte, sale s’il en manque.' },
    { min: '60′', paso: 'Portionne : 5 boîtes de déjeuner (2 poulet+pommes de terre, 2-3 lentilles, le riz dans une boîte à part pour sauté/saumon) + œufs durs et pommes de terre cuites au frigo.' },
    { min: '75′', paso: 'Étiquette et range : frigo jusqu’à mercredi, congélateur pour le jeudi-vendredi (redescends-le au frigo la veille au soir). Cuisine rangée pendant que tourne ce que tu veux.' }
  ];
  const MEALPREP_NOTA = 'Le poisson des dîners se cuisine frais en 10 minutes : il ne se prépare pas le dimanche. Poulet et riz tiennent 4 jours au frigo.';

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
  const CHECKPOINTS = [
    { sem: 4,  fecha: '2026-09-13', rango: [92.5, 93.5], si: 'Vérifie l’huile d’olive et le repas libre ; +1 000 pas/jour. Rappel : la créatine masque ~1 kg.' },
    { sem: 8,  fecha: '2026-10-11', rango: [90.0, 91.3], si: '−100 kcal de glucides uniquement les jours de repos (la semaine 7 était un diet break : la moyenne peut sortir haute et c’est normal)' },
    { sem: 12, fecha: '2026-11-08', rango: [86.0, 88.0], si: 'Clôture, photos, mensurations et bloc suivant. En gras réel : ~−8 kg.' }
  ];
  const AJUSTES = [
    { id: 'rapido', cond: 'Tu perds plus de 1,0 kg/sem deux semaines de suite (effet créatine déduit)', accion: 'Ajoute 150 kcal de glucides. Plus vite n’est pas mieux : à ce rythme, le déficit dévore la reprise de muscle.' },
    { id: 'lento', cond: 'Tu perds moins de 0,45 kg/sem deux semaines de suite (semaine de diet break exclue)', accion: 'Vérifie d’abord les pas et l’huile d’olive ; si c’est propre, monte de +1 500 pas AVANT de couper des kcal (ça protège l’entraînement).' },
    { id: 'rendimiento', cond: 'La performance en salle chute deux séances de suite', accion: 'Regarde le sommeil avant le régime.' }
  ];
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
    { id: 'racha-7',        icon: '🔥', nombre: 'Série de 7',         desc: '7 jours de suite à boucler la journée.' },
    { id: 'racha-14',       icon: '🔥', nombre: 'Série de 14',        desc: '14 jours de suite. Le schéma on/off est mort.' },
    { id: 'racha-30',       icon: '🌋', nombre: 'Série de 30',        desc: '30 jours de suite. Inarrêtable.' },
    { id: 'pasos-7',        icon: '👟', nombre: 'Semaine marchée',    desc: '7 jours de suite à atteindre les pas.' },
    { id: 'disco-10',       icon: 'disc10', nombre: 'Disque de 10',   desc: 'Phase 1 bouclée. L’habitude est de retour.', disco: true },
    { id: 'disco-15',       icon: 'disc15', nombre: 'Disque de 15',   desc: 'Phase 2 bouclée. Te voilà dans la salle.', disco: true },
    { id: 'disco-20',       icon: 'disc20', nombre: 'Disque de 20',   desc: 'Phase 3 bouclée. La vraie charge est à toi.', disco: true },
    { id: 'disco-25',       icon: 'disc25', nombre: 'Disque de 25',   desc: 'Phase 4 bouclée. Collection complète.', disco: true },
    { id: 'kg-2',           icon: '📉', nombre: '−2 kg',              desc: 'Moyenne hebdo 2 kg sous le poids de départ.' },
    { id: 'kg-4',           icon: '📉', nombre: '−4 kg',              desc: '4 kg de moins en moyenne hebdo.' },
    { id: 'kg-6',           icon: '📉', nombre: '−6 kg',              desc: '6 kg de moins. La moitié du long chemin.' },
    { id: 'kg-8',           icon: '📉', nombre: '−8 kg',              desc: '8 kg de moins en moyenne hebdo.' },
    { id: 'kg-10',          icon: '🏔️', nombre: '−10 kg',             desc: 'Deux chiffres. Peu de gens arrivent jusqu’ici.' },
    { id: 'cintura-95',     icon: '📏', nombre: 'Taille −95',         desc: 'Tour de taille sous 95 cm.' },
    { id: 'cintura-93',     icon: '📏', nombre: 'Taille −93',         desc: 'Tour de taille sous 93 cm.' },
    { id: 'cintura-91',     icon: '👑', nombre: 'La métrique reine',  desc: 'Tour de taille sous 91 cm : moins de la moitié de ta stature.' },
    { id: 'pr-1',           icon: '🥇', nombre: 'Premier PR',         desc: 'Première fois que tu bats ta meilleure marque sur un exercice.' },
    { id: 'pr-5',           icon: '🥇', nombre: '5 PR',               desc: 'Cinq records personnels battus.' },
    { id: 'pr-15',          icon: '🏆', nombre: '15 PR',              desc: 'Quinze PR. La mémoire musculaire paie ses dividendes.' },
    { id: 'marca-banca',    icon: '🔓', nombre: 'Couché reconquis',   desc: 'Tu rebouges tes 95 kg au développé couché. Cinq ans après.' },
    { id: 'marca-sentadilla', icon: '🔓', nombre: 'Squat reconquis',  desc: 'Tu rebouges tes 100 kg au squat.' },
    { id: 'dominada-libre', icon: '🦍', nombre: 'Traction libre',     desc: 'Première traction sans assistance. De retour au club.' },
    { id: 'mealprep-4',     icon: '🍱', nombre: 'Chef du dimanche',   desc: '4 dimanches de meal prep d’affilée.' },
    { id: 'comeback',       icon: '🔁', nombre: 'Le retour',          desc: 'De retour après 4 jours d’arrêt ou plus. Revenir compte plus que tomber.' },
    { id: 'fotos-4',        icon: '📸', nombre: 'La séquence',        desc: 'Les 4 photos de progression faites.' },
    { id: 'checkpoint-s4',  icon: '✅', nombre: 'Checkpoint S4',      desc: 'Poids dans le couloir ou mieux à la semaine 4.' },
    { id: 'checkpoint-s8',  icon: '✅', nombre: 'Checkpoint S8',      desc: 'Poids dans le couloir ou mieux à la semaine 8.' },
    { id: 'plan-completo',  icon: '🏁', nombre: 'BACK2PRIME',         desc: 'Plan de 12 semaines terminé. 85 kg était la conséquence, pas le but.' }
  ];

  /* ---------- LA SCIENCE DU PLAN (revue d’évidence · août 2026) ---------- */
  const CIENCIA = {
    intro: 'Plan passé au crible de l’évidence (méta-analyses et essais 2010-2025, août 2026). L’idée qui ordonne tout : celui qui revient n’est pas un débutant — le muscle et le système nerveux reviennent vite, mais le tendon n’a pas de mémoire. Le muscle peut courir ; c’est le tendon qui donne le tempo.',
    temas: [
      { t: 'Mémoire musculaire', d: 'La reprise est réelle et rapide : la force en ~8 semaines, le volume en ~12. Le mécanisme (myonoyaux vs épigénétique) fait débat, mais pas l’effet. C’est pour ça que la double progression peut aller plus vite que chez un débutant — et pour la même raison, on ne compresse PAS le calendrier : celui qui ne court pas, c’est le tendon.', ref: 'Rahmati 2022 (méta-analyse, J Cachexia Sarcopenia Muscle) · Cumming 2024 (J Physiol)' },
      { t: 'Tendon : le facteur limitant', d: 'Le collagène tendineux se renouvelle ~10× plus lentement que le muscle. Ce qui l’adapte vraiment : des charges lourdes avec contractions lentes de ~3″ (HSR) et des isométriques à 70% (5×45″), qui en plus coupent la douleur sur le moment. La pliométrie est un mauvais stimulus tendineux : pas de sauts pour « préparer » la course.', ref: 'Mersmann 2017 (Front Physiol) · Rio 2015 (BJSM) · Kongsgaard (HSR)' },
      { t: 'Courir avec du surpoids', d: 'En surpoids, démarrer au-delà de 3 km/sem de course fait exploser les blessures (~31-48% de plus). Monter la cadence à 170-180 réduit l’impact tibial d’~11%. La progression sûre n’est pas la « règle des 10% » : c’est ne pas dépasser ~1,3× ta moyenne des 4 dernières semaines.', ref: 'Bertelsen 2018 (ECR chez des novices en surpoids) · revue de cadence 2025 · consensus CIO sur la charge' },
      { t: 'Déficit optimal', d: 'Un déficit au-delà de ~500-600 kcal annule le gain de muscle même en t’entraînant en force. Le rythme optimal pour garder du maigre est ~0,7% du poids/semaine. Voilà pourquoi le plan perd à 0,6-0,75 kg/sem et pas à 0,9.', ref: 'Murphy & Koehler 2022 (méta-analyse, 59 études) · Garthe 2011' },
      { t: 'Protéines', d: 'En déficit, les pratiquants entraînés ont besoin de 2,3-3,1 g/kg de masse maigre. {p} g te place confortablement dans la fourchette, et la répartition en 4 prises de ≥40 g maximise la synthèse protéique et contrôle la faim.', ref: 'Helms 2014 (revue systématique) · Schoenfeld & Aragon (répartition par prise)' },
      { t: 'Diet break', d: 'Alterner déficit et pauses à maintenance a atténué la chute métabolique et amélioré la perte de gras dans l’étude MATADOR. Sur 12 semaines, sa valeur principale pour ton profil on/off est ailleurs : il t’apprend qu’une semaine d’arrêt AVEC un plan n’est pas une rechute.', ref: 'Byrne 2018 (Int J Obesity, MATADOR)' },
      { t: 'Le volume juste', d: 'Plus de séries = plus de muscle mais avec des rendements décroissants, et en déficit l’excès n’ajoute que fatigue et risque. Cible : ~10 séries/muscle/sem en P2 et 12-18 en P3-P4. Et le minimum non négociable (2 force + 1 cardio) est étayé : avec ça, on CONSERVE vraiment du muscle.', ref: 'Pelland 2025 (Sports Medicine) · Androulakis-Korakakis 2020 (dose minimale)' },
      { t: 'La décharge bien faite', d: 'Tout arrêter une semaine coûte de la force ; ce qui marche, c’est couper le volume de moitié en gardant le poids sur la barre. D’où la semaine 9 en décharge OBLIGATOIRE de ce type, et la 10 (saut à 5 jours) qui entre avec une série de moins sur tout.', ref: 'Coleman 2024 (PeerJ, ECR de décharge)' },
      { t: 'Sommeil', d: 'Dormir 5,5 h en déficit (vs 8,5) a réduit le gras perdu de 55% et multiplié la perte de muscle. C’est, après les protéines et le déficit, ton plus grand levier. D’où la coupure de caféine à 13-14 h : 200 mg perturbent le sommeil jusqu’à 13 h après.', ref: 'Nedeltcheva 2010 (Ann Intern Med) · Gardiner 2023 (Sleep Med Rev)' },
      { t: 'La santé d’abord', d: 'Après 5 ans sédentaire avec un IMC de 28, avant de passer au travail vigoureux de P3-P4 : tension artérielle et bilan sanguin de base (lipides, glycémie/HbA1c). Au moindre symptôme, médecin avant de continuer.', ref: 'ACSM Preparticipation Health Screening' }
    ]
  };

  const CIERRE = 'Le vrai objectif du plan n’est pas le 8 novembre : c’est d’arriver en décembre en t’entraînant 4 jours par semaine par habitude, sans cycle on/off. Le poids est la conséquence, pas le but.';

  const AVISO_LEGAL = 'Ton plan est généré à partir de tes réponses avec des formules standard (Mifflin-St Jeor et facteurs d’activité classiques), avec une marge de ±10% que les règles d’ajustement corrigent avec tes données réelles. Rien de tout cela ne remplace un avis médical : pour toute pathologie, douleur persistante ou doute, consulte un professionnel de santé.';

  /* ---------- TEXTES D’INTERFACE (traduisibles comme le reste) ----------
     Gabarits avec {x} : app.js les remplit avec tpl(). Au changement de langue,
     on charge assets/data.<lang>.js, qui remplace TOUT window.B2P.        */
  const UI = {
    lang: 'fr',
    tabs: ['Aujourd’hui', 'Plan', 'Nutrition', 'Progrès', 'Succès'],
    dias: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'],
    meses: ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'],
    hoyTag: 'AUJOURD’HUI',
    semanaLinea: 'Semaine {w} sur 12 · Phase {f} · {n} · RPE max {r}',
    empiezaEnDias: 'Départ dans {n} jours', empiezaEn1: 'Départ dans 1 jour', empiezaLunes: 'Départ lundi',
    preplanSub: '{f} · Phase 1 à la maison. En attendant, prépare ta ligne de base :',
    prepCintura: 'Mesure ton tour de taille à jeun (à hauteur du nombril)',
    prepFotos: 'Photos jour 0 : face et profil, la même lumière que tu utiliseras toujours',
    prepCompra: 'Courses de la semaine 1 (liste dans Nutrition)',
    prepBascula: 'Décide où et quand tu te pèses : lundi-mercredi-vendredi à jeun',
    practicaMenu: 'Tu peux répéter le menu dès maintenant : lundi 17, c’est du sérieux.',
    descanso: 'Repos', domingoPrep: 'Dimanche : repos + meal prep', planCompletado: 'Plan terminé',
    calentamiento: '🔥 Échauffement · 6′',
    sesionSub: '{d} · repos sur chaque ligne (touche pour chronométrer)',
    tendonNombre: 'Protocole tendon',
    cardioHecho: '✓ Cardio fait', cardioMarcar: 'Marquer le cardio fait', minutosReales: 'Minutes réelles :',
    cadenciaSub: 'Cadence 170-180 · foulée courte', recuperacionSub: 'Récupération active', opcional: 'optionnel',
    tibialisAviso: '🛡 Avant : tibialis raises 2×20 (protocole tendon).',
    diaADia: 'Le quotidien',
    hPasos: '8-10k pas', hPasosSub: 'Tous les jours',
    hProte: 'Protéines 4/4', hProteSub: '4 prises ≥40 g',
    hPeso: 'Poids à jeun', hPesoSub: 'Moyenne hebdo, pas le jour isolé',
    hCintura: 'Tour de taille (lundi)', hCinturaSub: 'La métrique reine · au nombril, sans serrer',
    hPrep: 'Meal prep', hPrepSub: '~90′ et la semaine est réglée',
    hFoto: 'Photos de progression', hFotoSub: 'Face et profil, même lumière',
    pesoGuardado: 'Poids enregistré : {v} kg', cinturaGuardada: 'Tour de taille : {v} cm',
    marcarHecho: 'Marquer comme fait', usarPeso: 'Utiliser ce poids',
    diaAnterior: 'Jour précédent', diaSiguiente: 'Jour suivant',
    cerrarPanel: 'Fermer', panelSinTitulo: 'Détail',
    ajIdiomaSinRed: 'Hors ligne : impossible de télécharger cette langue.',
    versionNueva: 'Nouvelle version · touche pour actualiser',
    quizTitulo: 'Tes goûts', quizPista: 'Glisse : à droite j’aime, à gauche non',
    quizSi: 'J’aime', quizNo: 'Pas pour moi', quizDeshacer: 'Annuler', quizSaltar: 'Passer',
    quizListo: 'Terminé', quizResumen: 'Tu aimes {a} sur {b}. Ton plan s’affinera.',
    gen: { chk1: 'Hors du couloir : vérifie portions et pas avant de toucher à quoi que ce soit. Les premières semaines, l’eau bouge aussi.', chk2: 'Deux semaines hors piste : ajuste 150 kcal de glucides dans la bonne direction. Les protéines ne bougent pas.', chk3: 'Clôture : photos, mesures et le bloc suivant, décidé avec des données.', lKgN: '−{v} kg', lKgD: 'Moyenne hebdo {v} kg sous ton départ.', lKgUpN: '+{v} kg', lKgUpD: 'Moyenne hebdo {v} kg au-dessus du départ. Du muscle, brique par brique.', lCintN: 'Taille −{v}', lCintD: 'Tour de taille sous {v} cm.', lReinaN: 'Métrique reine', lReinaD: 'Taille sous la moitié de ta stature : {v} cm.', lFinDesc: 'Plan de {s} semaines terminé. Le but était l’habitude ; le reste est conséquence.', marca: 'Plan généré pour toi', cuida: 'ménage : {a}', datos: '{p} kg · {a} cm · {e} ans', menuAviso: '{n} plats du menu ne collent pas encore à ton régime : recueil élargi bientôt.', prepNota: 'Seules les recettes marquées « batch » se préparent le dimanche ; le reste se cuisine à la minute. Les quantités de courses comptent déjà les répétitions de la semaine.' },
    pBarraT: 'La barre du plan', pBarraSub: '{a} disques chargés sur {b}',
    patrones: { eh: 'Poussée horizontale', ev: 'Poussée verticale', th: 'Tirage horizontal', tv: 'Tirage vertical', rod: 'Dominante genou', bis: 'Charnière de hanche', zan: 'Fente', core: 'Gainage', flex: 'Flexion du tronc', curl: 'Flexion de coude', ext: 'Extension de coude', gem: 'Mollet', ais: 'Isolation' },
    quizCatEj: 'Exercice', quizCatDep: 'Sport', quizCatCom: 'Plat',
    alta: { t: 'Crée ton profil', sub: 'Force, assiette et progrès. Un plan fait pour toi, en deux minutes.', nombreL: 'Ton prénom', ph: 'Comment on t’appelle ?', cta: 'Commencer', local: 'Tes données vivent uniquement sur cet appareil. Sans compte, sans cloud.', valNombre: 'Écris un prénom de 2 à 24 caractères.', idioma: 'Langue' },
    rev: { t: '{n}, ton plan est prêt', tAnon: 'Ton plan est prêt', sub: 'Décidé à partir de tes réponses. Ce n’est pas un modèle.',
      splitT: 'Force {d} jours par semaine', splitFb: 'corps entier : ce qui rend le plus avec peu de jours', splitTp: 'haut / bas, en paires', splitPpl: 'pousser / tirer / jambes',
      kcalT: '{k} kcal par jour', kDef: 'un déficit de {v} kcal : perdre du gras sans sacrifier le muscle', kSup: 'un surplus de {v} kcal pour construire du muscle', kMan: 'à ta maintenance, protéines aux commandes',
      protT: '{p} g de protéines par jour', protSub: '{v} g par kilo de poids',
      durT: '{s} semaines devant toi', durSub: 'du {a} au {b}',
      subsT: '{n} exercices remplacés', subsSub: 'selon ton matériel ou tes refus',
      cuidaT: 'Attention renforcée : {a}', cuidaSub: 'les exercices concernés portent un avertissement',
      menuT: 'Menu ajusté à ta table', menuSub: 'régime et intolérances appliqués à toute la semaine', menuAv: '{n} plats ne collent toujours pas : signalé dans Nutrition',
      gustosT: '{a} j’aime · {b} refus', gustosSub: 'ce que tu as refusé reste hors de ton plan',
      cta: 'Voir ma semaine 1', micro: 'Refais le questionnaire quand tu veux : tout se recalcule.' },
    tour: { salta: 'Passer', sigue: 'Suivant', listo: 'À l’entraînement', pasos: [
      ['Voici Aujourd’hui', 'Ta journée, déjà montée : séance, repas et suivi. Coche ✓, l’app tient les comptes.'],
      ['La barre te déplace', 'Aujourd’hui, Plan, Nutrition, Progrès et Succès. Touche, ou fais glisser la bulle.'],
      ['Le plan entier', 'Phases, calendrier, règles et la bibliothèque d’exercices avec technique en vidéo.'],
      ['Ta table', 'Menu de la semaine, recettes en photo, courses et meal prep, déjà filtrés pour toi.'],
      ['Un progrès honnête', 'Poids, taille, charges et régularité. Trop vite ? L’app te freine.'] ] },
    cuest: {
      gateT: 'Ta santé décide', gateTxt: 'Tu as indiqué une condition médicale qui limite l’exercice. Avant de générer quoi que ce soit, montre à ton médecin ce que tu veux faire (force {d} jours par semaine) et demande son feu vert.',
      gateGuardado: 'Tes réponses sont gardées pour ton retour.', gateOk: 'J’ai le feu vert', gateSalir: 'Sortir pour l’instant',
      gateHoyT: 'En pause, pour une raison', gateHoyTxt: 'Le questionnaire est resté à mi-chemin : il manque le feu vert de ton médecin. Avec lui, ton plan se génère à l’instant.', gateVolver: 'Reprendre le questionnaire',
      resCta: 'Générer mon plan', resGen: 'Génération de ton plan…',
      titulo: 'Ton plan, sur mesure', atras: 'Retour', sigue: 'Continuer',
      sexoT: 'Ton corps', sexoP: 'Sert uniquement à calculer tes calories.', sexoH: 'Homme', sexoM: 'Femme', sexoX: 'Je préfère ne pas dire',
      medidasT: 'Tes mesures', edadL: 'Âge', alturaL: 'Taille (cm)', pesoL: 'Poids (kg)', cinturaL: 'Tour de taille (cm) · optionnel',
      objT: 'Tu cherches quoi ?', objPerder: 'Perdre du gras', objRecomp: 'Recomposition : moins de gras, plus de muscle', objGanar: 'Prendre du muscle', objMantener: 'Me maintenir',
      evT: 'Pour quoi ?', evBoda: 'Un mariage', evOpo: 'Un concours', evVerano: 'Opération été', evSiempre: 'Pour toujours',
      durT: 'Tu te donnes combien de temps ?', dur3: '3 mois', dur6: '6 mois', dur12: '12 mois', durAlways: 'Sans date : une habitude',
      histT: 'Tu viens d’où ?', histP: 'Le retour se programme autrement : le tendon donne le rythme.', histNunca: 'Jamais entraîné', histRetoma: 'De retour après des années d’arrêt', histActivo: 'Je m’entraîne',
      diasL: 'Jours par semaine', minL: 'Minutes par séance', franjaT: 'Tu préfères quand ?', franjaM: 'Matin', franjaMd: 'Midi', franjaT2: 'Soir',
      matT: 'Avec quel matériel ?', matNada: 'Sans matériel', matCasa: 'Maison : haltères et élastiques', matGym: 'Salle complète',
      lesT: 'Douleurs ou blessures ?', lesRodilla: 'Genou', lesHombro: 'Épaule', lesLumbar: 'Lombaires', lesNo: 'Aucune',
      medT: 'Une condition médicale qui limite l’exercice ?', si: 'Oui', no: 'Non',
      dietaT: 'Ta table', dietaNormal: 'Je mange de tout', dietaVegetariano: 'Végétarien', dietaVegano: 'Végane',
      sinT: 'Tu évites quelque chose ?', sinGluten: 'Gluten', sinLactosa: 'Lactose', sinFrutos: 'Fruits à coque', sinNada: 'Rien',
      resT: 'Ton profil est prêt', resP: 'Ton plan sera généré à partir de ça : entraînement, repas et progression.',
      resGustos: '{a} j’aime · {b} passés', resProfesional: 'Avant de générer un plan, consulte un professionnel de santé : une de tes réponses le demande.',
      resGuardar: 'Enregistrer le profil', resGuardado: 'Profil enregistré', resProx: 'La génération du plan arrive à la phase suivante.',
      valNum: 'Vérifie {c} : entre {a} et {b}.'
    },
    gPeso: 'Graphique du poids corporel', gCintura: 'Graphique du tour de taille',
    gCargas: 'Graphique des charges', gAdherencia: 'Graphique d’assiduité hebdomadaire',
    gRango: '{n} relevés, de {a} à {b} {u}', gUnico: '1 relevé, {a} {u}',
    gSemanas: '{n} semaines sur 12 avec des données',
    gSinDatos: 'pas encore de données',
    fSinRegistro: 'Tu n’as encore enregistré aucun poids ici. Dès que ce sera fait, tu verras l’écart.',
    valFuera: 'Saisis une valeur entre {a} et {b} {u}.', descargaDosis: 'décharge',
    hechosDe: 'Faits {a} sur {b} · à {c} ça compte comme séance',
    cerrarSinSesion: 'Clore sans séance', diaCerradoSinRacha: '✓ Journée close',
    sinRachaHoy: 'Aujourd\'hui ne compte pas pour la série.', mejorRachaNota: 'Ton record : {n} jours.',
    sinSesionToast: 'Journée close sans séance : elle ne compte pas.',
    reabrirDia: 'Rouvrir la journée', diaReabierto: 'Journée rouverte', mejorLbl: 'Record',
    cerrarDia: 'Clore la journée', diaCerradoBtn: '✓ Journée close · série {n}',
    diaCerradoToast: '✓ Journée close. Série : {n}', diaCerradoSolo: 'Journée close.',
    sigueEditando: 'Tu peux continuer à éditer : tout s’enregistre tout seul.',
    comidaHoy: 'Les repas du jour', comidaHoySub: '{kcal} kcal · {p} g de protéines en 4 prises',
    desayuno: 'Petit-déj', comidaLbl: 'Déjeuner', cena: 'Dîner', presueno: 'Pré-sommeil',
    comidaLibreMn: 'REPAS LIBRE', comidaLibreTitulo: 'Repas libre', comidaLibreTag: 'un repas, pas une journée', tuya: 'à toi',
    dietBreakChip: 'Diet break : +2 portions de glucides aujourd’hui. Protéines inchangées.',
    extraChip: '➕ Extra P{f} : un fruit + 40 g de pain au déjeuner.',
    sugEmpieza: '◆ démarre à {v}', sugRepite: '↻ répète {v}',
    faltaTitle: 'Touche si tu n’as PAS complété toutes les reps',
    repsAMediasToast: 'Noté : il manquait des reps (tu répéteras le poids)', repsLimpiasToast: 'Toutes les reps propres',
    repsAMediasTag: 'reps incomplètes', repsLimpias: 'reps propres', repsCortas: 'reps manquées',
    prToast: '🥇 PR sur {e} : {v} kg', ya: 'C’EST PARTI !',
    fHistorial: 'Ton historique', fMejor: 'record {v} kg', fHoy: 'aujourd’hui',
    fComo: 'Comment l’exécuter', fErrores: 'Les erreurs qui te voleront du progrès', fAlt: 'Alternatives équivalentes',
    fArranque: 'Départ suggéré', fArranqueTxt: '{v} kg en semaine 3.',
    fMarca: '🔓 Ta marque d’alors : {t}',
    fFaltan: 'Il te manque {v} kg pour la reconquérir. Un succès t’attend.',
    fRecuperada: 'Reconquise. Ce poids est de nouveau à toi.',
    fVideo: 'Voir la technique en vidéo',
    fDomiBtn: '🦍 Aujourd’hui, ma première traction SANS assistance est sortie !', fDomiOk: '🦍 Enregistrée', fDomiYa: '🦍 Traction libre déjà enregistrée',
    segPlan: ['Phases', 'Règles', 'Exercices', 'Science'],
    vReglas8: 'Les 8 règles', vReglasSub: 'en cas de doute, la règle gagne',
    vCalendario: 'Calendrier', vFasesDetalle: 'Les 4 phases, en détail',
    vSeguros: 'Les assurances du plan', vBiblioteca: 'Bibliothèque d’exercices', vTocaCualquiera: 'touche n’importe lequel',
    vCiencia: 'La science du plan',
    senalesTitulo: 'Signaux d’arrêt', objetivoReal: 'Le vrai objectif', recuerda: 'Rappelle-toi',
    fase: 'Phase', sem: 'Sem', fechasLbl: 'Dates', especial: 'Spécial', fuerzaLbl: 'Force',
    seriesLbl: 'Séries', descLbl: 'Repos', ejercicioLbl: 'Exercice', diaLbl: 'Jour',
    cardioFase: 'Le cardio de la phase',
    zonas: { empuje: 'Poussée', tiron: 'Tirage', pierna: 'Jambes et hanches', core: 'Core' },
    chipsNutri: ['Objectif', 'L’assiette', 'Recettes', 'Menu', 'Courses', 'Meal prep', 'Suppléments'],
    nObjetivo: 'Ton objectif maintenant', nSemana: 'semaine {w}',
    nNumeros: 'D’où sortent les chiffres', nPlato: 'Comment monter chaque repas',
    nRecetario: 'Livre de recettes', nToca: 'touche pour cuisiner', nMenu: 'Menu de la semaine',
    nCompra: 'Les courses de la semaine', nPrepDom: 'Meal prep du dimanche', nSupl: 'Suppléments',
    nReiniciar: 'réinitialiser', nProteLbl: 'Prot', nGrasaLbl: 'Lipides', nCarbosLbl: 'Glucides', kcalLbl: 'kcal',
    nDietBreakTitulo: 'Cette semaine : DIET BREAK', nDietBreakTxt: '~2 800 kcal : +2 portions de glucides par jour. Protéines inchangées. Entraînement inchangé.',
    nTomaNota: '+ chaque soir : prise pré-sommeil (skyr + whey). ',
    nIngredientes: 'Ingrédients (1 portion)', nPasos: 'Étapes', opcionalParen: ' (optionnel)',
    chipsProg: ['Résumé', 'Poids', 'Taille', 'Charges', 'Semaines', 'Checkpoints'],
    pPeso: 'Poids', pPerdido: 'Perdu', pCintura: 'Taille', pAdh: 'Assiduité', pSesiones: 'Séances', pRacha: 'Série',
    pMediaS: 'moyenne S{w}', pSinDatos: 'aucune donnée', pDesde: 'depuis {v}', pCinturaSub: '{f} · objectif <{m}', pCinturaLunes: 'lundi à jeun',
    pFuerzas: '{a}/{b} force', pDeFuerza: 'de force', pDiasCumplidos: 'jours tenus',
    pPesoTitulo: 'Poids', pPesoSub: 'points : pesées · ligne : moyenne hebdo · bande : couloir attendu',
    pCinturaTitulo: 'Tour de taille', pCinturaTituloSub: 'la métrique reine · objectif <{m} cm',
    pCargas: 'Charges', pCargasSub: 'poids de l’exercice, séance après séance',
    pAdhTitulo: 'Assiduité', pAdhSub: 'séances de force bouclées par semaine',
    pChk: 'Checkpoints', pEsperado: 'Attendu', pReal: 'Réel', pSiDesvias: 'Si tu dévies',
    pTabla: 'tableau', pGrafica: 'graphique', pFecha: 'Date',
    pLifts: { 'press-banca': 'Couché', 'sentadilla-barra': 'Squat', 'rdl-barra': 'Roumain' },
    pTuMarca: 'ta marque · {v} kg', pMeta91: 'objectif {m}', pAguaCreatina: 'eau (premières semaines)', pLineaBase: 'Ligne de base',
    pMediaSemana: 'Moyenne S{w}',
    pVacioPeso: 'Les pesées du lundi, mercredi et vendredi apparaîtront ici',
    pVacioCintura: 'Chaque lundi à jeun : le mètre au nombril, sans serrer',
    pVacioCargas: 'Dès que tu enregistres des kg sur cet exercice, tu verras ici l’escalade',
    pVacioAdh: 'Semaine après semaine, ta constance se verra ici',
    pCheckpointSemana: 'Semaine de checkpoint', pEsperadoRango: 'Attendu : {a}–{b} kg', pLlevas: ' · tu en es à {v}', pSinPesajes: ' · pas encore de pesée cette semaine',
    pRapido: 'Tu vas trop vite', pLento: 'Rythme sous l’attendu',
    pFrenaTrote: 'Lève le pied sur la course', pFrenaTxt: 'Cette semaine tu es à {r}× ta moyenne récente de minutes de course. Au-delà de 1,3×, le risque de blessure explose : réduis ou marche.',
    lDiscos: 'La collection de disques', lDiscosSub: 'un par phase bouclée',
    lLogros: 'Succès', lFuerzas: 'Force', lPRs: 'PR', lPerdido: 'Perdu', lMejorRacha: 'Meilleure série', lLogrosN: 'Succès', lFotos: 'Photos',
    ajustes: 'Réglages', ajustesSub: 'BACK2PRIME · tes données vivent UNIQUEMENT sur cet appareil',
    ajLineaBase: 'Ligne de base', ajCinturaIni: 'Tour de taille initial (cm)', ajGuardar: 'Enregistrer la ligne de base', ajGuardado: 'Enregistré',
    ajCopia: 'Sauvegarde',
    ajCopiaTxt: 'Les données ne quittent pas le téléphone. Fais une sauvegarde de temps en temps (ou avant de changer d’appareil) et range-la où tu veux.',
    ajExportar: '⬇ Exporter', ajImportar: '⬆ Importer', ajImportOk: 'Sauvegarde restaurée', ajImportErr: 'Ce fichier ne ressemble pas à une sauvegarde BACK2PRIME',
    ajIdioma: 'Langue', ajIdiomaNota: 'L’app se recharge au changement. Tes données restent intactes.',
    ajPeligro: 'Zone dangereuse', ajBorrar: 'Effacer toutes les données', ajBorrarConfirma: 'Sûr ? Touche encore une fois pour TOUT effacer',
    obTitulo: 'Bienvenue dans BACK2PRIME', obSub: '12 semaines · 17 août → 8 nov · de 95 à ta meilleure version',
    obTexto: 'Ton carnet d’entraînement, ton plan et ta nutrition au même endroit. Coche ce que tu fais chaque jour : l’app te suggère les poids, surveille ton rythme et lâche des succès. Tout reste sur ton téléphone.',
    obConsejo: 'Conseil : ajoute-la à l’écran d’accueil (Partager → Sur l’écran d’accueil) pour l’utiliser comme une vraie app.',
    obCintura: 'Tour de taille initial — ta métrique reine', obPlaceholder: 'cm (optionnel, tu peux le faire plus tard)', obEmpezamos: 'On y va',
    celebraOk: 'On continue',
    nuevoDia: 'Nouveau jour : {f}'
  };

  UI.checkSalidaTitulo = 'Check de sortie ({f})';
  UI.checkSalidaTxt = 'Tu boucles les deux circuits avec les reps de la semaine 2 sans douleur articulaire → Phase 2. Si quelque chose gêne, tu répètes une semaine : les tendons diront merci.';
  UI.planEmpiezaTitulo = 'Le plan commence le {f}';
  UI.planEmpiezaTxt = 'Phase 1 · Réactivation à la maison. Voici tout ce qu’il faut pour arriver les devoirs faits.';

    const QUIZ_DEP = [{ id: 'running', n: 'Course à pied' }, { id: 'natacion', n: 'Natation' }, { id: 'ciclismo', n: 'Vélo' }, { id: 'padel', n: 'Padel' }, { id: 'futbol', n: 'Football' }, { id: 'baloncesto', n: 'Basket' }, { id: 'volley', n: 'Volley' }, { id: 'yoga', n: 'Yoga' }, { id: 'calistenia', n: 'Callisthénie' }, { id: 'boxeo', n: 'Boxe' }];
  return { META, FASES, CAL, HITOS_SEMANA, SESIONES, CALENTAMIENTO, TENDON, CARRERA, HISTORICO, ARRANQUE, EJERCICIOS, REGLAS, SENALES, NUTRI, RECETAS, COMPRA, MEALPREP, MEALPREP_NOTA, MENU, CHECKPOINTS, AJUSTES, FOTOS, LOGROS, CIENCIA, CIERRE, AVISO_LEGAL, QUIZ_DEP, UI };
})();

