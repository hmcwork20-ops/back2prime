/* ============================================================
   BACK2PRIME · data.it.js
   Tutto il contenuto del piano di 12 settimane: fasi, calendario,
   sessioni, schede esercizi, nutrizione, ricette, traguardi.
   Niente logica: solo dati. La logica vive in app.js.
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
      objetivoNota: '≈ −8 kg di grasso vero: la creatina nasconde ~1 kg d\'acqua sulla bilancia',
      cinturaMetaCm: 91,
      grasaEstimada: '~22% → 16-17%',
      proteinaDia: 190
    }
  };

  /* ---------- FASI (codice dei dischi olimpici) ---------- */
  const FASES = [
    { id: 1, nombre: 'Riattivazione', sub: 'A casa', semanas: [1, 2], disco: 10, rpe: '6–7',
      fechas: '17 – 30 ago',
      objetivo: 'Recuperare l’abitudine e gli schemi senza massacrare le articolazioni. Resterai con la voglia: è voluto.' },
    { id: 2, nombre: 'Ingresso in palestra', sub: 'Full Body ×3', semanas: [3, 4, 5], disco: 15, rpe: '6–7',
      fechas: '31 ago – 20 set',
      objetivo: 'Fondamentali col bilanciere e base di carico. La tua memoria muscolare permette pesi che il tessuto connettivo ancora non regge: 65-70% di quello che potresti, 3 ripetizioni vere di riserva.' },
    { id: 3, nombre: 'Carico', sub: 'Torso / Gambe ×4', semanas: [6, 7, 8, 9], disco: 20, rpe: '7–8',
      fechas: '21 set – 18 ott',
      objetivo: 'Volume e intensità veri; qui rende la memoria muscolare. Chiudi ogni serie con 2 ripetizioni vere di riserva: chi torna si crede più vicino al cedimento di quanto sia.' },
    { id: 4, nombre: 'Picco', sub: 'Push / Pull / Legs ×5', semanas: [10, 11, 12], disco: 25, rpe: '8',
      fechas: '19 ott – 8 nov',
      objetivo: 'Massimo stimolo per chiudere. {d} giorni da {min} minuti, non da 2 ore. RPE 8: 1-2 ripetizioni vere di riserva nelle ultime serie.' }
  ];

  /* ---------- CALENDARIO: 12 settimane × 7 giorni (Lun..Dom) ----------
     Ogni slot: id di sessione, o {s:id, opt:true} se è opzionale.   */
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

  /* ---------- SETTIMANE SPECIALI (evidenza: scarico gestito + diet break + transizione) ---------- */
  const HITOS_SEMANA = {};

  /* ---------- SESSIONI ---------- */
  // blocchi: e = id esercizio · s = serie · r = reps (rW = per settimana) · d = recupero sec · n = nota breve
  const SESIONES = {
    /* — Fase 1 · casa — */
    'c-a': { nombre: 'Circuito A', tipo: 'fuerza', fase: 1, dur: '~35′', calent: true, bloques: [
      { e: 'sentadilla-pc',  s: 3, rW: { 1: '10', 2: '12' }, d: 75 },
      { e: 'flexiones',      s: 3, rW: { 1: '6-8', 2: '8-10' }, d: 75 },
      { e: 'puente-gluteo',  s: 3, rW: { 1: '12', 2: '15' }, d: 60 },
      { e: 'plancha',        s: 3, rW: { 1: '25″', 2: '35″' }, d: 60 },
      { e: 'elev-talones',   s: 2, rW: { 1: '15', 2: '20' }, d: 45, n: 'Prepara i tendini alla corsa' }
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
      { e: 'sentadilla-barra',   s: 3, r: '8',  d: 120, n: 'S3: bilanciere scarico o +10-20 kg, solo schema motorio' },
      { e: 'press-banca',        s: 3, r: '8',  d: 120 },
      { e: 'remo-barra',         s: 3, r: '8',  d: 120 },
      { e: 'press-militar-mc',   s: 2, r: '10', d: 90 },
      { e: 'curl-femoral-tumbado', s: 2, r: '12', d: 90 },
      { e: 'plancha',            s: 3, r: '40″', d: 60, n: 'Quando diventa facile: alterna l\'appoggio su una mano' }
    ]},
    'fb-b': { nombre: 'Full Body B', tipo: 'fuerza', fase: 2, dur: '~60′', calent: true, bloques: [
      { e: 'rdl-barra',          s: 3, r: '8',  d: 120, n: 'Parti con 30-40 kg' },
      { e: 'press-inclinado-mc', s: 3, r: '10', d: 120 },
      { e: 'jalon-pecho',        s: 3, r: '10', d: 90 },
      { e: 'zancada-mc',         s: 2, r: '10/p', d: 90, n: '6-10 kg per mano' },
      { e: 'elev-laterales',     s: 2, r: '15', d: 60 },
      { e: 'face-pull',          s: 2, r: '15', d: 60, n: 'Contrappeso alla spinta: salute della spalla fin da subito' },
      { e: 'crunch-polea',       s: 3, r: '12', d: 60 }
    ]},
    /* — Fase 3 · Torso/Gambe — */
    'torso-a': { nombre: 'Torso A', tipo: 'fuerza', fase: 3, dur: '~70′', calent: true, bloques: [
      { e: 'press-banca',      s: 4, r: '6-8', d: 150, n: 'Fondamentale pesante: 4×8 pulito → +2,5 kg e torni a 4×6' },
      { e: 'remo-barra',       s: 4, r: '8',   d: 120, n: 'Stesso peso in tutte e 4 le serie' },
      { e: 'press-militar',    s: 3, r: '10',  d: 90 },
      { e: 'jalon-pecho',      s: 3, r: '10',  d: 90, n: '1″ di pausa in basso' },
      { e: 'elev-laterales',   s: 3, r: '15',  d: 60 },
      { e: 'face-pull',        s: 2, r: '15',  d: 60, n: '2ª dose settimanale di rotazione esterna' },
      { e: 'curl-barra-z',     s: 2, r: '12',  d: 60 },
      { e: 'ext-triceps-polea', s: 2, r: '12', d: 60 }
    ]},
    'pierna-a': { nombre: 'Gambe A', tipo: 'fuerza', fase: 3, dur: '~70′', calent: true, tendon: 'rodilla', bloques: [
      { e: 'sentadilla-barra', s: 4, r: '6-8', d: 150, n: 'Doppia progressione, come la panca' },
      { e: 'rdl-barra',        s: 3, r: '8',   d: 120, n: '+5 kg quando tutte e 3 le serie escono pulite' },
      { e: 'prensa',           s: 3, r: '10',  d: 90 },
      { e: 'curl-femoral-tumbado', s: 3, r: '12', d: 90, n: 'Eccentrica da 3″' },
      { e: 'gemelo-pie',       s: 4, r: '8',   d: 90, n: 'HSR tendine: 3″ giù / 3″ su, con carico vero' },
      { e: 'plancha-lastre',   s: 3, r: '40″', d: 60 }
    ]},
    'torso-b': { nombre: 'Torso B', tipo: 'fuerza', fase: 3, dur: '~70′', calent: true, bloques: [
      { e: 'press-inclinado-mc', s: 4, r: '8', d: 120, n: 'La spinta pesante del giorno' },
      { e: 'dominadas',        s: 4, r: '8',   d: 120, n: 'Riduci l\'assistenza settimana dopo settimana' },
      { e: 'press-plano-mc',   s: 3, r: '10',  d: 90 },
      { e: 'remo-polea',       s: 3, r: '12',  d: 90 },
      { e: 'face-pull',        s: 3, r: '15',  d: 60, n: 'Salute della spalla per le fasi di spinta' },
      { e: 'curl-inclinado',   s: 2, r: '12',  d: 60, n: 'Superserie col french press se sei corto di tempo' },
      { e: 'press-frances',    s: 2, r: '12',  d: 60 }
    ]},
    'pierna-b': { nombre: 'Gambe B', tipo: 'fuerza', fase: 3, dur: '~70′', calent: true, tendon: 'rodilla', bloques: [
      { e: 'hip-thrust',       s: 4, r: '8',   d: 120, n: 'Pausa 1″ in alto, gluteo al massimo' },
      { e: 'zancada-bulgara',  s: 3, r: '10/p', d: 90, n: 'Il più duro del piano. Parti senza peso' },
      { e: 'ext-cuadriceps',   s: 3, r: '12',  d: 90, n: 'Se la rotula dà fastidio, riduci il range in alto' },
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
      { e: 'ext-triceps-polea', s: 3, r: '12', d: 60, n: 'Alterna con l\'estensione sopra la testa' },
      { e: 'ext-triceps-cabeza', s: 3, r: '12', d: 60 }
    ]},
    'pull-a': { nombre: 'Pull', tipo: 'fuerza', fase: 4, dur: '~65′', calent: true, bloques: [
      { e: 'rdl-barra',        s: 3, r: '6-8', d: 150 },
      { e: 'dominadas',        s: 4, r: '8',   d: 120, n: 'Zavorrate se ne escono più di 10' },
      { e: 'remo-barra',       s: 3, r: '10',  d: 120, n: 'O rematore al cavo' },
      { e: 'face-pull',        s: 3, r: '15',  d: 60 },
      { e: 'curl-barra-z',     s: 3, r: '10',  d: 60 },
      { e: 'curl-martillo',    s: 2, r: '12',  d: 60 }
    ]},
    'legs': { nombre: 'Legs', tipo: 'fuerza', fase: 4, dur: '~70′', calent: true, tendon: 'rodilla', bloques: [
      { e: 'sentadilla-barra', s: 4, r: '6',  d: 150 },
      { e: 'prensa',           s: 3, r: '10', d: 120 },
      { e: 'hip-thrust',       s: 3, r: '10', d: 120 },
      { e: 'curl-femoral-tumbado', s: 3, r: '12', d: 90 },
      { e: 'gemelo-pie',       s: 4, r: '8',  d: 90, n: 'HSR: 3″ giù / 3″ su' },
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
    'cam40':  { nombre: 'Camminata 40′', tipo: 'cardio', icono: 'walk', detalle: 'Puoi parlare, non cantare. Conta per i passi del giorno.' },
    'cam60':  { nombre: 'Camminata 60′', tipo: 'cardio', icono: 'walk', detalle: 'Ritmo vivace e costante. Ideale all\'aperto: somma luce, passi e recupero attivo.' },
    'wj3': { nombre: 'Cammina-corri S3', tipo: 'cardio', icono: 'run', detalle: '7 giri: 2′ di corsa leggera + 2′ camminando (28′). Prima: 2×20 tibialis raises e 10 calf raise. Se non riesci a parlare, stai andando forte.' },
    'wj4': { nombre: 'Cammina-corri S4', tipo: 'cardio', icono: 'run', detalle: '6 giri: 3′ di corsa + 2′ camminando (30′). Prima: 2×20 tibialis raises. Cadenza alta e passi corti: meno impatto per falcata.' },
    'wj5': { nombre: 'Cammina-corri S5', tipo: 'cardio', icono: 'run', detalle: '5 giri: 5′ di corsa + 1′ camminando (30′), oppure 20′ di corsa leggera continua se il corpo risponde bene. Prima: 2×20 tibialis raises.' },
    'trote25': { nombre: 'Corsa 25-30′', tipo: 'cardio', icono: 'run', detalle: 'Continua, a ritmo di conversazione. Meglio asfalto liscio o sterrato che marciapiedi. Fastidio a tibia o ginocchio che peggiora: fermati e cammina.' },
    'trote30': { nombre: 'Corsa 30-35′', tipo: 'cardio', icono: 'run', detalle: 'Continua. Un giorno può essere un po\' più brillante (ultimi 10′ a ritmo medio), l\'altro sempre leggero.' },
    'libre': { nombre: 'Riposo', tipo: 'libre', icono: 'rest', detalle: 'Libero per davvero; i passi contano comunque. Domenica: meal prep (~90′) e settimana sistemata.' }
  };

  /* ---------- RISCALDAMENTO (sempre, 6′) ---------- */
  const CALENTAMIENTO = {
    titulo: 'Riscaldamento · 6′ · sempre',
    pasos: [
      'Circonduzioni delle braccia · 30″',
      'Rotazioni delle anche · 30″ per lato',
      '10 squat lenti a corpo libero',
      '5 affondi con torsione per lato',
      'Plank · 20″',
      '20 jumping jack'
    ],
    gym: 'In palestra, in più: 1-2 serie di avvicinamento con poco peso sul primo esercizio pesante del giorno (50% e 75% del peso di lavoro).'
  };

  /* ---------- PROTOCOLLO TENDINI (l'assicurazione del piano) ---------- */
  const TENDON = {
    titulo: 'Protocollo tendini · 6-8′ · 2-3×/settimana',
    intro: 'La forza torna in settimane; il tendine ha bisogno di mesi: il suo collagene si rinnova ~10 volte più lentamente e non ha memoria. Questo blocco è l’assicurazione del piano: parte dalla settimana 1, e la corsa della settimana 3 entra solo con due settimane di tendine rodate.',
    bloques: [
      { id: 'tendon-rodilla', nombre: 'Rotuleo · isometrico', donde: 'Dopo ogni sessione di gambe (in F1, dopo i circuiti)',
        detalle: 'Squat isometrico al muro (da F2, spagnolo con fascia rigida dietro le ginocchia): 5 × 45″ al 70% di sforzo, 1′ di recupero. Coscia vicina al parallelo, senza dolore acuto. In più toglie il dolore all’istante.' },
      { id: 'tendon-aquiles', nombre: 'Achille · HSR per il polpaccio', donde: 'Già integrato nelle sessioni (calf raise)',
        detalle: 'Polpacci pesanti e lenti: 3″ giù, 3″ su, 6-8 reps, senza rimbalzo. In F1 con uno zaino su una gamba sola; in palestra con carico vero. Il rimbalzo sfrutta il riflesso del tendine e gli toglie lo stimolo che gli serve.' },
      { id: 'tendon-tibial', nombre: 'Tibiale anteriore', donde: 'Prima di ogni corsa',
        detalle: 'Tibialis raises appoggiato al muro: 2-3 × 15-20. È il vaccino contro la periostite al tuo peso attuale.' },
      { id: 'tendon-codo', nombre: 'Gomito/polso · isometrico', donde: 'Dopo le sessioni di torso (F2+), 2×/sett',
        detalle: 'Manubrio leggero, polso fermo a metà flessione: 3 × 45″, palmo in su e palmo in giù. Il volume di panca, rematore e lat machine fa scattare l’epicondilite; questo la previene.' }
    ],
    nota: 'Non aggiungere salti "per preparare la corsa": è un cattivo stimolo per il tendine e ad alto impatto. La tua preparazione all’impatto è questo blocco.'
  };

  /* ---------- REGOLE DI CORSA (evidenza BMI ~28) ---------- */
  const CARRERA = {
    titulo: 'Correre senza romperti (comandano i {p} kg)',
    reglas: [
      'Cadenza 170-180 passi/min e falcata corta: ~11% in meno di impatto tibiale, ~15% in meno di tasso di carico. Conta 85-90 passi in 30″ o usa il metronomo dell’orologio.',
      'Mai più di ~1,3× la media delle tue ultime 4 settimane. L’app ti avvisa.',
      'Settimana 3: ~2,5 km in totale, sotto il tetto dei 3 km/sett per iniziare in sovrappeso.',
      'Stessa superficie e stesse scarpe: non cambiare le due cose insieme. Meglio asfalto liscio o sterrato che marciapiedi.',
      'Fastidio a tibia o ginocchio che peggiora correndo: fermati e cammina. Quello che sparisce scaldandoti, tienilo d’occhio.'
    ]
  };

  /* ---------- MASSIMALI STORICI (epoca palestra, ~2021) ---------- */
  // Non si caricano come PR: sono il riferimento di "dov'eri" e il bersaglio da riconquistare.
  /* Sin marcas previas: el plan se genera del cuestionario. La clave se
     mantiene porque la app la consulta, y vacía deja los logros de marca
     personal fuera de alcance, que es lo correcto para cualquiera. */

  /* ---------- CARICHI DI PARTENZA · FASE 2 ---------- */

  /* ---------- SCHEDE ESERCIZI ---------- */
  // musc: [primario, secondari] · cues: tecnica · err: errori tipici ·
  // alt: alternative equivalenti (palestra commerciale) · mol: se dà fastidio, passa a
  const EJERCICIOS = {
    /* — Casa / F1 — */
    'sentadilla-pc': { pat: 'rod', pic: 'sentadilla-pc',
      nombre: 'Squat a corpo libero', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadricipiti', 'glutei'], equipo: 'Niente',
      cues: ['Piedi alla larghezza delle spalle, punte leggermente in fuori', 'Scendi in 3″ come per sederti all\'indietro, sali in 1″', 'Le ginocchia seguono la punta del piede, talloni inchiodati a terra', 'Petto alto per tutto il movimento'],
      err: ['Talloni che si staccano (scendi meno in profondità)', 'Ginocchia che collassano verso l\'interno', 'Scendere rimbalzando invece di controllare'],
      alt: [{ n: 'Squat al box/divano', por: 'se fai fatica a controllare la profondità' }, { n: 'Squat con pausa di 2″ in basso', por: 'se 12 reps ti stanno strette' }],
      mol: 'Se il ginocchio dà fastidio: riduci la profondità fino a dove non fa male e scendi ancora più lento.'
    },
    'flexiones': { pat: 'eh', pic: 'flexiones',
      nombre: 'Flessioni', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Pettorali', 'tricipiti, spalle'], equipo: 'Niente',
      cues: ['Mani poco più larghe delle spalle', 'Gomiti a 45° dal corpo, né incollati né a croce', 'Corpo in asse: glutei e addome contratti', 'Il petto tocca (quasi) terra a ogni rep'],
      err: ['Bacino che crolla o a punta', 'Mezzo movimento', 'Collo proiettato verso il pavimento'],
      alt: [{ n: 'Flessioni con le mani su divano/tavolo', por: 'se da terra non escono pulite' }, { n: 'Flessioni coi piedi rialzati', por: 'se ne superi 12 con facilità' }],
      mol: 'Se il polso dà fastidio: pugni chiusi o maniglie per flessioni. Se dà fastidio la spalla: stringi un po\' la larghezza.'
    },
    'puente-gluteo': { pat: 'bis', pic: 'puente',
      nombre: 'Ponte glutei', mm: { p: ['gluteo'], s: ['isquios'] }, zona: 'pierna', musc: ['Glutei', 'femorali'], equipo: 'Niente',
      cues: ['Sdraiato, talloni vicini ai glutei', 'Spingi coi talloni e alza il bacino', 'Pausa di 2″ in alto strizzando forte i glutei', 'Costole giù: non inarcare la lombare'],
      err: ['Spingere con la punta del piede', 'Inarcare la lombare per salire di più', 'Salire e scendere senza pausa'],
      alt: [{ n: 'Ponte a una gamba', por: 'quando 15 reps diventano comode' }, { n: 'Ponte con lo zaino sul bacino', por: 'per aggiungere carico a casa' }],
      mol: 'Se viene un crampo al femorale: avvicina di più i talloni ai glutei.'
    },
    'plancha': { pat: 'core',
      nombre: 'Plank frontale', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Core completo'], equipo: 'Niente',
      cues: ['Avambracci a terra, gomiti sotto le spalle', 'Costole dentro, bacino in retroversione (culo in dentro)', 'Glutei contratti, sguardo a terra', 'Respira: non trattenere l\'aria'],
      err: ['Bacino che crolla (la lombare soffre)', 'Culo a punta (trucco)', 'Resistere tremando: se trema la lombare, chiudi la serie'],
      alt: [{ n: 'Plank in appoggio sulle ginocchia', por: 'se non reggi il tempo con una buona forma' }],
      mol: 'Se la lombare dà fastidio: controlla prima di tutto la retroversione del bacino; di solito è quella.'
    },
    'plancha-lastre': { pat: 'core',
      nombre: 'Plank con zavorra', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Core completo'], equipo: 'Disco da 5-10 kg',
      cues: ['Stessa tecnica del plank normale', 'Fatti mettere il disco tra le scapole, non sulla lombare', 'Se il bacino cede, togli zavorra'],
      err: ['Disco troppo in basso (carica la lombare)', 'Perdere la retroversione quando ti stanchi'],
      alt: [{ n: 'Plank con tocchi di spalla', por: 'se non hai nessuno che ti metta il disco' }, { n: 'Ab wheel in ginocchio', por: 'variante più esigente' }],
      mol: 'Se la lombare dà fastidio: torna al plank senza zavorra + tocchi di spalla.'
    },
    'elev-talones': { pat: 'gem',
      nombre: 'Calf raise', mm: { p: ['gemelos'], s: [] }, zona: 'pierna', musc: ['Polpaccio', 'soleo'], equipo: 'Gradino opzionale',
      cues: ['Range completo: allunga in basso, pausa di 1″ in alto', 'Sali in 1″, scendi in 2-3″', 'Meglio su un gradino per più escursione'],
      err: ['Rimbalzare veloce senza pausa', 'Mezza escursione in alto'],
      alt: [{ n: 'A una gamba', por: 'quando 20 reps diventano facili' }],
      mol: 'Se l\'Achille dà fastidio: riduci il range in basso e allunga il tempo di discesa.'
    },
    'zancada-alterna': { pat: 'zan', pic: 'zancada-pc',
      nombre: 'Affondi alternati', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadricipiti', 'glutei'], equipo: 'Niente',
      cues: ['Passo ampio in avanti', 'Busto verticale, mani sui fianchi o davanti', 'Il ginocchio dietro sfiora il pavimento', 'Spingi col tallone davanti per tornare'],
      err: ['Passo corto (il ginocchio davanti collassa)', 'Busto inclinato in avanti', 'Ginocchio davanti che cede verso l\'interno'],
      alt: [{ n: 'Affondo statico (senza alternare)', por: 'se l\'equilibrio non tiene' }, { n: 'Affondo indietro', por: 'più gentile col ginocchio' }],
      mol: 'Se il ginocchio dà fastidio: passa all\'affondo indietro, stesso schema.'
    },
    'banda-remo': { pat: 'th', pic: 'banda',
      nombre: 'Rematore seduto con elastico', mm: { p: ['dorsal'], s: ['biceps', 'espalda-alta'] }, zona: 'tiron', musc: ['Dorsali', 'bicipiti, scapole'], equipo: 'Elastico',
      cues: ['Elastico ancorato all’altezza del petto (maniglia, palo o sotto i piedi)', 'Tira con i gomiti, stretti al corpo', 'Stringi le scapole e tieni mezzo secondo', 'Rilascia piano: il ritorno è metà esercizio'],
      err: ['Portare il busto indietro per tirare di più', 'Lasciare tornare l’elastico di colpo'],
      alt: [{ n: 'Rematore con asciugamano alla porta', por: 'senza ancoraggio' }, { n: 'Rematore con zaino carico', por: 'a un braccio, appoggiato al tavolo' }],
      mol: 'Se la spalla si lamenta: abbassa l’ancoraggio e tira più vicino al fianco.'
    },
    'banda-jalon': { pat: 'tv', pic: 'banda',
      nombre: 'Lat machine con elastico', mm: { p: ['dorsal'], s: ['biceps'] }, zona: 'tiron', musc: ['Dorsali', 'bicipiti'], equipo: 'Elastico',
      cues: ['Elastico ancorato in alto (stipite o cerniera alta)', 'In ginocchio o seduto, petto alto', 'Porta i gomiti verso le tasche, non indietro', 'Il petto va incontro alle mani'],
      err: ['Inarcare la lombare per guadagnare corsa', 'Tirare solo con le braccia'],
      alt: [{ n: 'Trazioni assistite con elastico', por: 'se hai una sbarra' }, { n: 'Rematore con asciugamano', por: 'senza ancoraggio alto' }],
      mol: 'Se la spalla si lamenta: presa più stretta e fermati più in alto.'
    },
    'banda-rotacion': { pat: 'ais', pic: 'banda',
      nombre: 'Rotazione esterna con elastico', mm: { p: ['hombro'], s: ['espalda-alta'] }, zona: 'empuje', musc: ['Cuffia dei rotatori', 'scapole'], equipo: 'Elastico',
      cues: ['Gomito al fianco, 90° fissi (un asciugamano arrotolato aiuta)', 'Ruota l’avambraccio verso fuori, lento', 'La spalla non si alza: tieni giù la clavicola', '2-3″ di ritorno, senza perdere tensione'],
      err: ['Lasciare che il gomito si allontani dal corpo', 'Usare un elastico duro: qui comanda il controllo, non il carico'],
      alt: [{ n: 'Manubrio leggero da sdraiato di lato', por: 'stesso lavoro, senza elastico' }, { n: 'Face pull con elastico', por: 'più scapola' }],
      mol: 'Se punge: dimezza la corsa e abbassa la resistenza.'
    },
    'banda-abduccion': { pat: 'ais', pic: 'banda',
      nombre: 'Abduzione d’anca con elastico', mm: { p: ['gluteo'], s: [] }, zona: 'pierna', musc: ['Gluteo medio', 'stabilità del ginocchio'], equipo: 'Elastico',
      cues: ['Elastico appena sopra le ginocchia', 'In piedi o sdraiato di lato: apri il ginocchio senza ruotare l’anca', 'Il busto resta fermo, si muove solo la gamba', 'Tieni un secondo in alto'],
      err: ['Ruotare il bacino per aprire di più', 'Andare veloce: il gluteo medio si allena lento'],
      alt: [{ n: 'Ponte glutei con elastico', por: 'più gluteo massimo' }, { n: 'Passo laterale con elastico (monster walk)', por: 'in piedi, più funzionale' }],
      mol: 'Se il ginocchio si lamenta: metti l’elastico più in basso, sulle tibie.'
    },
    'remo-toalla': { pat: 'th', pic: 'remo-toalla',
      nombre: 'Rematore con asciugamano alla porta', mm: { p: ['dorsal'], s: ['biceps', 'espalda-alta'] }, zona: 'tiron', musc: ['Dorsali', 'bicipiti, scapole'], equipo: 'Asciugamano + porta (o zaino)',
      cues: ['Asciugamano sulla maniglia/stipite, corpo inclinato indietro', 'Tira col gomito, non con la mano', 'Scapole indietro e in basso a fine corsa', 'Più ti inclini, più è duro'],
      err: ['Tirare con le braccia senza muovere le scapole', 'Strattonare con lo slancio del bacino'],
      alt: [{ n: 'Rematore con zaino carico', por: 'a un braccio, appoggiato al tavolo' }, { n: 'Rematore inverso sotto un tavolo robusto', por: 'versione più dura' }],
      mol: 'Se il gomito dà fastidio: impugna più largo e riduci l\'inclinazione.'
    },
    'rdl-1p': { pat: 'bis', pic: 'rdl-1p',
      nombre: 'Stacco rumeno a una gamba', mm: { p: ['isquios'], s: ['gluteo'] }, zona: 'pierna', musc: ['Femorali', 'glutei, equilibrio'], equipo: 'Niente (zaino opzionale)',
      cues: ['Anche indietro, schiena dritta come un tavolo', 'La gamba libera sale dietro da contrappeso', 'Scendi finché senti l\'allungamento del femorale', 'Dai priorità all\'equilibrio, non alla profondità'],
      err: ['Arrotondare la schiena per arrivare più in basso', 'Ruotare il bacino (tieni entrambe le anche rivolte al pavimento)'],
      alt: [{ n: 'Con una mano appoggiata al muro', por: 'se l\'equilibrio ti rompe la serie' }, { n: 'B-stance (piede dietro di appoggio)', por: 'via di mezzo' }],
      mol: 'Se il femorale tira troppo: riduci il range, non la tecnica.'
    },
    'superman': { pat: 'core',
      nombre: 'Superman', mm: { p: ['lumbar'], s: ['gluteo', 'espalda-alta'] }, zona: 'core', musc: ['Lombari', 'glutei, alta schiena'], equipo: 'Niente',
      cues: ['A pancia in giù, braccia avanti', 'Alza braccia e gambe insieme, 2″ in alto', 'Sguardo a terra: non tirare col collo'],
      err: ['Colpo di frusta cervicale guardando avanti', 'Salire di rimbalzo'],
      alt: [{ n: 'Bird-dog (braccio e gamba opposti)', por: 'più controllo, meno compressione' }],
      mol: 'Se la lombare dà fastidio: passa direttamente al bird-dog.'
    },
    'dead-bug': { pat: 'core',
      nombre: 'Dead bug', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Core anteriore profondo'], equipo: 'Niente',
      cues: ['Sdraiato, lombare incollata a terra per tutto il tempo', 'Braccio e gamba opposti scendono lenti insieme', 'Espira mentre estendi: le costole restano giù'],
      err: ['La lombare si inarca quando estendi la gamba (accorcia il movimento)', 'Andare veloce'],
      alt: [{ n: 'Solo gambe (braccia ferme)', por: 'se la lombare si stacca da terra' }],
      mol: 'È l\'esercizio più sicuro del piano; se qualcosa dà fastidio, controlla che la lombare non si stacchi.'
    },

    'pike-flexiones': { pat: 'ev', pic: 'pike-flexiones',
      nombre: 'Piegamenti a pica', mm: { p: ['hombro'], s: ['triceps'] }, zona: 'empuje', musc: ['Deltoide anteriore', 'tricipite'], equipo: 'Niente',
      cues: ['V rovesciata: mani e piedi vicini, anca bene in alto', 'La testa scende tra le mani, non davanti', 'Gomiti a 45° dal corpo, mai aperti', 'In alto estendi del tutto, senza alzare le spalle'],
      err: ['Abbassare l’anca e trasformarlo in un piegamento normale', 'Portare la testa davanti alle mani (lì paga la spalla)', 'Mezza escursione per contarne di più'],
      alt: [{ n: 'Con i piedi su una sedia', por: 'quando 12 diventano facili' }, { n: 'Con le mani su un gradino', por: 'se ancora non scendi pulito' }],
      mol: 'Se la spalla protesta: abbassa un po’ l’anca finché l’angolo non è comodo. La spinta verticale è ciò che chiede più mobilità di tutto il piano.'
    },
    'jalon-toalla': { pat: 'tv', pic: 'jalon-toalla',
      nombre: 'Lat machine con asciugamano', mm: { p: ['dorsal'], s: ['biceps'] }, zona: 'tiron', musc: ['Gran dorsale', 'bicipite'], equipo: 'Asciugamano',
      cues: ['Asciugamano teso sopra la testa: un braccio tira giù e l’altro resiste', 'Il gomito che tira va al fianco, non in avanti', 'Abbassa la scapola e tieni 1″', 'Torna su in 3″ frenando con l’altro braccio'],
      err: ['Tirare con il bicipite invece che con la schiena', 'Alzare la spalla invece di abbassare la scapola', 'Non resistere con il braccio in alto: senza tensione non c’è stimolo'],
      alt: [{ n: 'Rematore inverso sotto un tavolo solido', por: 'molto più misurabile: se hai un tavolo, meglio quello' }, { n: 'Trazioni', por: 'appena hai una sbarra' }],
      mol: 'Senza sbarra la tirata verticale è la più difficile da sostituire davvero: se puoi, dai la precedenza al rematore sotto il tavolo, che carica peso vero.'
    },
    'abduccion-lado': { pat: 'ais', pic: 'abduccion-lado',
      nombre: 'Abduzione dell’anca su un fianco', mm: { p: ['gluteo'], s: [] }, zona: 'pierna', musc: ['Piccolo e medio gluteo'], equipo: 'Niente',
      cues: ['Sdraiato su un fianco, corpo in linea e anca perpendicolare al pavimento', 'Alza la gamba di sopra con il tallone leggermente arretrato', 'Sali in 1″, tieni 1″, scendi in 3″', 'La punta del piede guarda avanti, non il soffitto'],
      err: ['Ruotare l’anca all’indietro (così lavora il flessore, non il gluteo)', 'Alzare la gamba più di quanto l’anca permetta', 'Andare veloce: qui comanda il tempo sotto tensione'],
      alt: [{ n: 'Con elastico sopra le ginocchia', por: 'quando 20 ripetizioni non bruciano più' }, { n: 'Clam, ginocchia piegate', por: 'se la lombare si intromette' }],
      mol: 'È anche l’esercizio di riabilitazione del medio gluteo: se il ginocchio ti cade verso l’interno correndo o accosciando, questa è la tua assicurazione.'
    },
    'crunch-inverso': { pat: 'flex',
      nombre: 'Crunch inverso', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Addome basso'], equipo: 'Niente',
      cues: ['Sdraiato, mani lungo il corpo o sotto il sacro', 'Porta le ginocchia al petto arrotolando il bacino, non solo piegando l’anca', 'La lombare si stacca di un dito dal pavimento: è tutta l’escursione', 'Scendi in 3″ senza lasciar cadere le gambe'],
      err: ['Prendere slancio con le gambe', 'Inarcare la lombare mentre scendi', 'Cercare escursione alzando tutta l’anca'],
      alt: [{ n: 'Sollevamento gambe alla sbarra', por: 'quando avrai una sbarra' }, { n: 'Dead bug', por: 'se la lombare si stacca senza controllo' }],
      mol: 'Se la lombare protesta: mani sotto il sacro e dimezza l’escursione finché non arriva il controllo.'
    },
    'curl-mochila': { pat: 'curl', pic: 'curl-mochila',
      nombre: 'Curl con zaino', mm: { p: ['biceps'], s: ['antebrazo'] }, zona: 'tiron', musc: ['Bicipite', 'avambraccio'], equipo: 'Zaino',
      cues: ['Prendi lo zaino dalla maniglia in alto o dalle due bretelle', 'Gomiti attaccati al corpo e fermi', 'Sali senza dondolare, scendi in 3″', 'Progredisci mettendoci libri o bottiglie d’acqua'],
      err: ['Dondolare il busto per salire', 'Portare i gomiti avanti in alto', 'Caricarlo tanto che la presa ceda prima del bicipite'],
      alt: [{ n: 'Curl con asciugamano auto-resistito', por: 'senza zaino: un braccio sale, l’altro frena' }, { n: 'Curl con manubri', por: 'quando avrai attrezzatura' }],
      mol: 'Se protesta il polso: prendi le due bretelle invece della maniglia, così il polso resta neutro.'
    },

    'flexion-declinada': { pat: 'eh', pic: 'flexiones',
      nombre: 'Piegamenti declinati', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Petto alto', 'spalla, tricipite'], equipo: 'Niente (sedia o divano)',
      cues: ['Piedi sulla sedia, mani poco più larghe delle spalle', 'Più alti i piedi, più peso ti carichi addosso', 'Corpo in plank: glutei e addome stretti', 'Petto quasi a terra a ogni ripetizione'],
      err: ['Alzare il bacino per alleggerire', 'Dimezzare l’escursione appena alzi i piedi', 'Collo proteso verso il pavimento'],
      alt: [{ n: 'Piegamenti normali', por: 'se qui non escono 8 puliti' }, { n: 'Con i piedi più alti', por: 'la progressione: ogni spanna pesa di più' }],
      mol: 'È il gradino successivo ai piegamenti: superate le 15 pulite, alza i piedi invece di contare fino a venti.'
    },
    'pino-pared': { pat: 'ev', pic: 'pino-pared',
      nombre: 'Piegamento in verticale al muro', mm: { p: ['hombro'], s: ['triceps'] }, zona: 'empuje', musc: ['Deltoidi', 'tricipite'], equipo: 'Niente (muro)',
      cues: ['Di spalle al muro, sali con i piedi camminando fino a essere quasi verticale', 'Mani poco più larghe delle spalle, dita aperte che afferrano il pavimento', 'Scendi solo quanto controlli: all’inizio due dita', 'Corpo stretto: senza inarcare la lombare'],
      err: ['Scendere fino in fondo il primo giorno: si parte con escursione corta', 'Lasciar cadere la testa senza controllo', 'Inarcare la schiena per compensare'],
      alt: [{ n: 'Piegamenti a pica', por: 'la versione di partenza, molto più gentile' }, { n: 'Con i piedi su una sedia invece che al muro', por: 'il passaggio intermedio' }],
      mol: 'È la variante avanzata della spinta verticale: solo se i piegamenti a pica escono a 15 puliti e la spalla non dice nulla. Con fastidio di spalla, non è il momento.'
    },
    'remo-mesa': { pat: 'th', pic: 'remo-mesa',
      nombre: 'Rematore inverso sotto il tavolo', mm: { p: ['dorsal'], s: ['biceps', 'espalda-alta'] }, zona: 'tiron', musc: ['Gran dorsale', 'alta schiena, bicipite'], equipo: 'Niente (tavolo solido)',
      cues: ['Sdraiati sotto un tavolo solido e afferralo per il bordo', 'Corpo in plank dai talloni alle spalle', 'Tira portando il petto al tavolo, gomiti al fianco', 'Stringi le scapole 1″ in alto e scendi in 3″'],
      err: ['Portare avanti il bacino prima del petto', 'Tirare solo con le braccia senza stringere le scapole', 'Usare un tavolo che si solleva: controllalo prima'],
      alt: [{ n: 'Ginocchia piegate, piedi a terra', por: 'la versione facile' }, { n: 'Con i piedi su una sedia', por: 'la progressione: più orizzontale, più peso' }],
      mol: 'Questa è la tirata che carica davvero senza sbarra: se hai un tavolo solido, preferiscila alla lat machine con asciugamano.'
    },
    'pistol-asistida': { pat: 'rod', pic: 'sentadilla-pc',
      nombre: 'Squat su una gamba assistito', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadricipite', 'gluteo'], equipo: 'Niente (sedia)',
      cues: ['In piedi di spalle a una sedia, un piede a terra e l’altro teso davanti', 'Scendi in 3″ fino a sfiorare la sedia col gluteo e risali senza sederti', 'Ginocchio in linea con il piede, mai verso l’interno', 'Braccia avanti come contrappeso'],
      err: ['Lasciarsi cadere sulla sedia e rimbalzare', 'Ginocchio che cade dentro (è lì che si paga)', 'Tallone che si alza: scendi meno finché la caviglia non lo permette'],
      alt: [{ n: 'Squat a corpo libero su due gambe', por: 'la versione di partenza' }, { n: 'Una sedia più bassa', por: 'la progressione, fino al pistol completo' }],
      mol: 'Se il ginocchio protesta: alza la sedia e frena la discesa. È una progressione di squat, non un salto nel vuoto: 8 ripetizioni pulite a due gambe prima di provarci su una.'
    },
    'curl-toalla': { pat: 'curl', pic: 'curl-toalla',
      nombre: 'Curl con asciugamano auto-resistito', mm: { p: ['biceps'], s: ['antebrazo'] }, zona: 'tiron', musc: ['Bicipite', 'avambraccio'], equipo: 'Asciugamano',
      cues: ['Un piede blocca un capo dell’asciugamano, la mano sale dall’altro', 'Il braccio libero può tirare in basso per aggiungere resistenza', 'Gomito attaccato al corpo e fermo', 'Sali in 2″, scendi in 3″ senza mollare la tensione'],
      err: ['Perdere la tensione in alto o in basso', 'Dondolare il busto', 'Mettere tanta resistenza che il movimento si blocca a metà'],
      alt: [{ n: 'Curl con zaino', por: 'più misurabile: puoi pesare quello che ci metti' }, { n: 'Curl con manubri', por: 'quando avrai attrezzatura' }],
      mol: 'Senza niente in casa è il ricambio del curl: non si misura in chili, si misura in quanto reggi la discesa.'
    },

    'zancada-bulgara-pc': { pat: 'zan', pic: 'zancada-pc',
      nombre: 'Affondo bulgaro a corpo libero', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadricipite', 'gluteo'], equipo: 'Niente (sedia)',
      cues: ['Collo del piede dietro sulla sedia, quello davanti a un passo lungo', 'Scendi dritto, ginocchio dietro verso il pavimento', 'Il peso vive nel tallone davanti', 'Scendi in 3″ e sali senza rimbalzare'],
      err: ['Piede davanti troppo vicino (il ginocchio va avanti e paga)', 'Sbilanciarti in avanti per arrivare', 'Rimbalzare in basso con il ginocchio dietro'],
      alt: [{ n: 'Affondi alternati sul posto', por: 'la versione di partenza' }, { n: 'Con uno zaino carico', por: 'la progressione quando 12 diventano facili' }],
      mol: 'Se il ginocchio protesta: allontana di una spanna il piede davanti e scendi meno. È tra le migliori per le gambe senza attrezzi, ma chiede equilibrio: reggiti al muro le prime volte.'
    },
    'puente-1p': { pat: 'bis', pic: 'puente',
      nombre: 'Ponte per glutei su una gamba', mm: { p: ['gluteo'], s: ['isquios'] }, zona: 'pierna', musc: ['Grande gluteo', 'ischiocrurali'], equipo: 'Niente',
      cues: ['Sdraiato, un piede a terra e l’altra gamba tesa in avanti', 'Sali spingendo con il tallone fino ad allineare anca e coscia', 'Stringi il gluteo 2″ in alto, senza inarcare la lombare', 'Scendi in 3″ senza appoggiare del tutto'],
      err: ['Salire inarcando la schiena invece di stringere il gluteo', 'Anca che cede da un lato', 'Appoggiare il piede così lontano che lavora l’ischiocrurale'],
      alt: [{ n: 'Ponte con due piedi', por: 'la versione di partenza' }, { n: 'Spalle sul divano', por: 'più escursione, più gluteo' }],
      mol: 'Se la lombare si intromette: avvicina il tallone al gluteo e sali meno. L’anca non deve ruotare: se cade da un lato, torna a due gambe.'
    },
    'elev-piernas-suelo': { pat: 'flex',
      nombre: 'Sollevamento gambe da sdraiato', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Addome basso'], equipo: 'Niente',
      cues: ['Sdraiato, mani sotto il sacro e lombare incollata al pavimento', 'Alza le gambe tese fino alla verticale', 'Scendi in 3″ e fermati dove la lombare inizia a staccarsi', 'Quel punto è la tua escursione: scenderà settimana dopo settimana'],
      err: ['Lasciare inarcare la lombare in discesa (l’errore che infortuna)', 'Prendere slancio con le gambe', 'Scendere più di quanto l’addome regga'],
      alt: [{ n: 'Crunch inverso', por: 'la versione di partenza' }, { n: 'Sollevamento gambe alla sbarra', por: 'quando avrai una sbarra' }],
      mol: 'È la progressione del crunch inverso: se la lombare si stacca, piega un po’ le ginocchia e accorcia l’escursione finché non tiene.'
    },
    'elev-talon-1p': { pat: 'gem',
      nombre: 'Calf raise su una gamba', mm: { p: ['gemelos'], s: [] }, zona: 'pierna', musc: ['Polpaccio e soleo'], equipo: 'Niente (gradino)',
      cues: ['Mezza pianta sul bordo di un gradino, l’altra gamba raccolta', 'Scendi il tallone il più possibile e tieni 1″ in basso', 'Sali verticale, pausa di 1″ in alto: niente rimbalzi', 'Appoggiati al muro solo per l’equilibrio'],
      err: ['Rimbalzare sfruttando il riflesso del tendine: toglie proprio lo stimolo che cerchiamo', 'Mezza escursione', 'Scaricare il peso sulla mano d’appoggio'],
      alt: [{ n: 'Calf raise a due gambe', por: 'la versione di partenza' }, { n: 'Con uno zaino carico', por: 'quando 20 per gamba diventano facili' }],
      mol: 'Se l’Achille dà fastidio: solo isometrie in alto, 3×30″ quella settimana. È l’assicurazione del tendine per la corsa: non saltarla.'
    },
    'plancha-lateral': { pat: 'core',
      nombre: 'Plank laterale', mm: { p: ['abdomen'], s: ['gluteo'] }, zona: 'core', musc: ['Obliqui', 'medio gluteo'], equipo: 'Niente',
      cues: ['Gomito sotto la spalla, corpo in linea dalla caviglia alla testa', 'Alza l’anca e tienila: il pavimento non la tocca', 'Spalla lontana dall’orecchio', 'Tieni il tempo previsto per ogni lato'],
      err: ['Anca che cede (l’obliquo smette di lavorare)', 'Ruotare il petto verso il pavimento', 'Trattenere il respiro'],
      alt: [{ n: 'Sulle ginocchia', por: 'la versione di partenza' }, { n: 'Con la gamba di sopra sollevata', por: 'la progressione, che chiede anche medio gluteo' }],
      mol: 'Se la spalla protesta: sali sulla mano a braccio teso, o falla in ginocchio. È la metà laterale del plank: il core non regge solo di fronte.'
    },

    'elev-y-suelo': { pat: 'ais', pic: 'elev-y-suelo',
      nombre: 'Alzata a Y da prono', mm: { p: ['hombro'], s: ['espalda-alta'] }, zona: 'empuje', musc: ['Spalla (cuffia)', 'trapezio inferiore'], equipo: 'Niente',
      cues: ['A pancia in giù, braccia tese a formare una Y con i pollici al soffitto', 'Alza le braccia senza alzare le spalle: il collo resta lungo', 'Tieni 2″ in alto e scendi in 3″', 'La fronte non si stacca: il movimento è di scapola, non di collo'],
      err: ['Alzare le spalle verso le orecchie', 'Sollevare la testa per aiutarsi', 'Andare veloce: qui non c’è peso, lo stimolo è il controllo'],
      alt: [{ n: 'Rotazione esterna con elastico', por: 'quando avrai un elastico' }, { n: 'Con una bottiglietta per mano', por: 'la progressione: pesa poco e si sente' }],
      mol: 'La spalla del protocollo tendine, senza attrezzi: la cuffia guadagna col controllo, non col peso. Se la spalla dà fastidio, questo di solito va bene.'
    },
    'curl-nordico': { pat: 'ais', pic: 'curl-nordico',
      nombre: 'Nordic curl assistito', mm: { p: ['isquios'], s: [] }, zona: 'pierna', musc: ['Ischiocrurali'], equipo: 'Niente (qualcosa che blocchi le caviglie)',
      cues: ['In ginocchio su qualcosa di morbido, caviglie bloccate sotto un mobile solido', 'Scendi molto lentamente tenendo anca e spalle in linea', 'Tieni fin dove riesci e ammortizza con le mani', 'Risali spingendo con le braccia: la salita non conta'],
      err: ['Piegare l’anca per farlo più facile (l’ischiocrurale smette di lavorare)', 'Lasciarsi cadere senza frenare', 'Partire dall’escursione completa: si guadagna centimetro dopo centimetro'],
      alt: [{ n: 'Ponte per glutei su una gamba', por: 'se il nordic è ancora troppo' }, { n: 'Leg curl alla macchina', por: 'in palestra' }],
      mol: 'Il lavoro di ischiocrurali più potente senza attrezzi e quello che lascia più dolori: parti da 3 e sali di una alla volta. Se il ginocchio dà fastidio, asciugamano piegato sotto.'
    },
    'encogimiento-mochila': { pat: 'ais', pic: 'encogimiento-mochila',
      nombre: 'Scrollate con zaino', mm: { p: ['espalda-alta'], s: ['antebrazo'] }, zona: 'tiron', musc: ['Trapezio superiore'], equipo: 'Zaino',
      cues: ['Zaino appeso alle due mani o stretto al petto', 'Alza le spalle dritte verso le orecchie, senza ruotarle', 'Stringi 2″ in alto e scendi controllando', 'Collo rilassato: non spingere il mento in avanti'],
      err: ['Ruotare le spalle indietro (non aggiunge nulla e carica il collo)', 'Usare lo slancio delle gambe', 'Mezza escursione'],
      alt: [{ n: 'Scrollate con manubri', por: 'quando avrai attrezzatura' }, { n: 'Con lo zaino più carico', por: 'la progressione: qui puoi pesare quello che ci metti' }],
      mol: 'Se lo senti nel collo: abbassa il carico e sali meno. Il trapezio superiore lavora già parecchio nella vita di tutti i giorni; due serie fatte bene bastano.'
    },

    /* — Palestra: spinta — */
    'press-banca': { pat: 'eh',
      nombre: 'Panca piana', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Pettorali', 'tricipiti, deltoide anteriore'], equipo: 'Bilanciere + panca',
      cues: ['Scapole retratte e inchiodate alla panca, piedi saldi a terra', 'Presa: avambraccio verticale quando il bilanciere tocca il petto', 'Il bilanciere scende a metà petto, gomiti a ~45°', 'Tocca il petto con controllo e spingi in linea leggermente diagonale'],
      err: ['Spalle che si sollevano spingendo (perdi la retrazione)', 'Far rimbalzare il bilanciere sul petto', 'Culo staccato dalla panca', 'Polsi piegati all\'indietro'],
      alt: [{ n: 'Chest press alla macchina', por: 'giorni senza voglia di montare la panca o palestra piena' }, { n: 'Distensioni con manubri su panca piana', por: 'più range e meno spalla' }],
      mol: 'Se la spalla dà fastidio: prova una presa un po\' più stretta e gomiti più chiusi; se continua, manubri con presa neutra.'
    },
    'press-inclinado-mc': { pat: 'eh',
      nombre: 'Panca inclinata con manubri', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Pettorale alto', 'spalle, tricipiti'], equipo: 'Manubri + panca a 30°',
      cues: ['Panca a 30° (una tacca, non il muro)', 'Scendi finché senti lo stiramento del pettorale', 'Gomiti a 45-60°, polsi neutri', 'Sali senza far sbattere i manubri in alto'],
      err: ['Panca troppo verticale (diventa una shoulder press)', 'Rimbalzare in basso', 'Inarcare la lombare in modo esagerato'],
      alt: [{ n: 'Panca inclinata al multipower', por: 'se la palestra è piena o vuoi stabilità' }, { n: 'Panca inclinata con bilanciere', por: 'già programmata nel Push B della F4' }],
      mol: 'Se la spalla dà fastidio: riduci il range in basso di 5 cm e ruota leggermente i palmi verso l\'interno.'
    },
    'press-inclinado-barra': { pat: 'eh',
      nombre: 'Panca inclinata con bilanciere', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Pettorale alto', 'spalle, tricipiti'], equipo: 'Bilanciere + panca inclinata',
      cues: ['Panca a 30-45°, scapole inchiodate', 'Il bilanciere scende sulla parte alta del petto (clavicole)', 'Avambracci verticali al contatto'],
      err: ['Portare il bilanciere a metà petto (ti costringe ad aprire i gomiti)', 'Rimbalzare'],
      alt: [{ n: 'Multipower inclinato', por: 'stessa sessione, più guida' }, { n: 'Manubri su inclinata', por: 'se non c\'è una panca inclinata coi supporti' }],
      mol: 'Se la spalla dà fastidio: torna ai manubri, che permettono di ruotare la presa.'
    },
    'press-plano-mc': { pat: 'eh',
      nombre: 'Distensioni con manubri su panca piana', mm: { p: ['pecho'], s: ['triceps'] }, zona: 'empuje', musc: ['Pettorali', 'tricipiti'], equipo: 'Manubri + panca',
      cues: ['Più range del bilanciere: sfruttalo in basso con controllo', 'Sali ad arco, senza far sbattere i manubri in alto', 'Piedi saldi, scapole indietro'],
      err: ['Lasciar cadere i manubri in basso senza frenare', 'Trasformarle in una shoulder press aprendo troppo i gomiti'],
      alt: [{ n: 'Chest press alla macchina', por: 'fatica alta o nessuna panca libera' }],
      mol: 'Se la spalla dà fastidio: presa neutra (palmi uno di fronte all\'altro).'
    },
    'press-militar': { pat: 'ev',
      nombre: 'Military press', mm: { p: ['hombro'], s: ['triceps', 'abdomen'] }, zona: 'empuje', musc: ['Spalle', 'tricipiti, core'], equipo: 'Bilanciere (in piedi o da seduto)',
      cues: ['In piedi: glutei e addome contratti prima di spingere', 'Il bilanciere parte dal mento e sale rasente al viso', 'La testa "attraversa la finestra" alla fine', 'Da seduto con schienale: senza inarcare la lombare'],
      err: ['Inarcare la lombare trasformandolo in una panca inclinata', 'Spingere il bilanciere in avanti (sbatte sul mento)', 'Range incompleto in alto'],
      alt: [{ n: 'Shoulder press con manubri da seduto', por: 'già programmata in F2; più gentile con la spalla' }, { n: 'Shoulder press alla macchina', por: 'ultima sessione della settimana con fatica addosso' }],
      mol: 'Se la spalla dà fastidio: manubri con presa neutra e sali solo fin dove non c\'è pizzicore.'
    },
    'press-militar-mc': { pat: 'ev',
      nombre: 'Shoulder press con manubri da seduto', mm: { p: ['hombro'], s: ['triceps'] }, zona: 'empuje', musc: ['Spalle', 'tricipiti'], equipo: 'Manubri + panca con schienale',
      cues: ['Schienale alto, lombare appoggiata senza inarcare', 'Gomiti leggermente davanti al corpo, non a croce', 'Escursione completa senza far sbattere i manubri in alto'],
      err: ['Inarcare la lombare staccandola dallo schienale', 'Scendere solo fino alle orecchie'],
      alt: [{ n: 'Shoulder press alla macchina', por: 'equivalente diretto' }],
      mol: 'Se la spalla dà fastidio: presa neutra e scendi solo fino a 90° di gomito.'
    },
    'elev-laterales': { pat: 'ev', pic: 'elev-laterales',
      nombre: 'Alzate laterali', mm: { p: ['hombro'], s: [] }, zona: 'empuje', musc: ['Deltoide laterale'], equipo: 'Manubri',
      cues: ['Peso leggero, gomiti un po\' flessi', 'Sali fino all\'orizzontale, come versando due caraffe', 'Niente slancio: se dondoli, il peso è troppo', 'Scendi in 2″'],
      err: ['Salire col trapezio alzando le spalle', 'Superare l\'orizzontale', 'Dondolio del bacino'],
      alt: [{ n: 'Alzate laterali al cavo basso', por: 'tensione continua; programmate nel Push B' }, { n: 'Macchina per alzate laterali', por: 'per chiudere senza pensare alla tecnica' }],
      mol: 'Se la spalla dà fastidio: pollice leggermente verso l\'alto e sali 10° davanti al piano laterale.'
    },
    'laterales-polea': { pat: 'ev',
      nombre: 'Alzate laterali al cavo', mm: { p: ['hombro'], s: [] }, zona: 'empuje', musc: ['Deltoide laterale'], equipo: 'Cavo basso',
      cues: ['Cavo all\'altezza del polso col braccio rilassato', 'Corpo stabile, sali fino all\'orizzontale', 'Il cavo mantiene la tensione anche in basso: sfruttala'],
      err: ['Mettersi troppo lontano dal cavo', 'Tirare col trapezio'],
      alt: [{ n: 'Manubri', por: 'se i cavi sono occupati' }],
      mol: 'Come coi manubri: pollice in su e piano leggermente avanzato.'
    },
    'fondos': { pat: 'ev', pic: 'fondos',
      nombre: 'Dip assistiti', mm: { p: ['pecho'], s: ['triceps'] }, zona: 'empuje', musc: ['Pettorale basso', 'tricipiti'], equipo: 'Macchina per dip assistiti o elastici',
      cues: ['Corpo leggermente inclinato in avanti (più petto)', 'Scendi fino a 90° di gomito, non oltre se la spalla protesta', 'Gomiti che non si aprono a croce'],
      err: ['Scendere troppo in profondità', 'Spalle sollevate verso le orecchie'],
      alt: [{ n: 'Panca declinata o dip tra panche', por: 'se non c\'è la macchina assistita' }],
      mol: 'Se dà fastidio lo sterno o la spalla: sostituisci con distensioni con manubri su panca piana.'
    },
    'ext-triceps-polea': { pat: 'ext',
      nombre: 'Pushdown per tricipiti al cavo', mm: { p: ['triceps'], s: [] }, zona: 'empuje', musc: ['Tricipiti'], equipo: 'Cavo alto + corda o barra',
      cues: ['Gomiti incollati al corpo, fissi', 'Si muove solo l\'avambraccio', 'Estendi del tutto e strizza 1″'],
      err: ['Gomiti che avanzano in discesa (ci metti la spalla)', 'Dondolio del busto'],
      alt: [{ n: 'Con la corda aprendo in basso', por: 'un po\' più di capo lungo' }, { n: 'Kick-back con manubrio', por: 'senza cavi liberi' }],
      mol: 'Se il gomito dà fastidio: abbassa il peso e sali a 15-20 reps; il gomito odia l\'ego.'
    },
    'ext-triceps-cabeza': { pat: 'ext',
      nombre: 'Estensioni sopra la testa (corda)', mm: { p: ['triceps'], s: [] }, zona: 'empuje', musc: ['Tricipiti (capo lungo)'], equipo: 'Cavo + corda',
      cues: ['Di spalle al cavo, corda dietro la nuca', 'Gomiti che puntano in avanti, estendi verso l\'alto', 'Stiramento vero in basso: è lì che cresce il capo lungo'],
      err: ['Aprire i gomiti a croce', 'Range corto per eccesso di peso'],
      alt: [{ n: 'French press con bilanciere EZ', por: 'stesso schema da sdraiato' }],
      mol: 'Se il gomito dà fastidio: come al cavo normale — meno peso, più reps.'
    },
    'press-frances': { pat: 'ext',
      nombre: 'French press', mm: { p: ['triceps'], s: [] }, zona: 'empuje', musc: ['Tricipiti (capo lungo)'], equipo: 'Bilanciere EZ + panca',
      cues: ['Sdraiato, il bilanciere scende verso la fronte o poco dietro', 'Gomiti che puntano al soffitto, fermi', 'Scendi in 2-3″, estendi senza chiudere di colpo'],
      err: ['Gomiti che si aprono', 'Trasformarlo in una panca presa stretta muovendo la spalla'],
      alt: [{ n: 'Estensioni sopra la testa al cavo', por: 'più tensione continua, meno stress sul gomito' }],
      mol: 'Se il gomito dà fastidio: cambialo direttamente con pushdown al cavo a 15 reps.'
    },

    /* — Palestra: tirata — */
    'remo-barra': { pat: 'th',
      nombre: 'Rematore con bilanciere', mm: { p: ['dorsal'], s: ['biceps', 'espalda-alta'] }, zona: 'tiron', musc: ['Dorsali', 'schiena media, bicipiti'], equipo: 'Bilanciere',
      cues: ['Busto a ~45°, ginocchia semiflesse', 'Tira il bilanciere verso il basso ventre', 'Scapole indietro e in basso alla fine', 'Schiena neutra non negoziabile'],
      err: ['Strattonare con la lombare (ti dondoli)', 'Busto che si alza rep dopo rep', 'Tirare verso il petto coi gomiti aperti'],
      alt: [{ n: 'T-bar row', por: 'variante più stabile' }, { n: 'Rematore alla macchina con supporto al petto', por: 'se la lombare è carica dal giorno di gambe' }],
      mol: 'Se la lombare protesta: macchina con supporto al petto o pulley, senza pensarci due volte.'
    },
    'remo-polea': { pat: 'th',
      nombre: 'Pulley basso', mm: { p: ['espalda-alta'], s: ['biceps', 'dorsal'] }, zona: 'tiron', musc: ['Schiena media', 'dorsali, bicipiti'], equipo: 'Cavo basso + triangolo',
      cues: ['Petto alto e fisso: il busto non viaggia', 'Tira il triangolo verso l\'ombelico', 'Pausa 1″ strizzando le scapole'],
      err: ['Dondolare il busto per muovere più peso', 'Spalle sollevate'],
      alt: [{ n: 'Rematore alla macchina', por: 'equivalente diretto' }],
      mol: 'Se la lombare dà fastidio: appoggia il petto a una macchina da rematore con supporto.'
    },
    'remo-mancuerna': { pat: 'th',
      nombre: 'Rematore con manubrio a un braccio', mm: { p: ['dorsal'], s: ['espalda-alta'] }, zona: 'tiron', musc: ['Dorsali', 'schiena media'], equipo: 'Manubrio + panca',
      cues: ['Ginocchio e mano sulla panca, schiena neutra', 'Tira il gomito verso il fianco, non verso la spalla', 'Senza ruotare il busto in salita'],
      err: ['Alzare la spalla a inizio tirata', 'Ruotare il busto per "aiutarti"', 'Range corto'],
      alt: [{ n: 'Rematore al cavo a un braccio', por: 'tensione più costante' }],
      mol: 'Senza un buon appoggio la lombare soffre: usa una panca inclinata e appoggia il petto.'
    },
    'jalon-pecho': { pat: 'tv',
      nombre: 'Lat machine', mm: { p: ['dorsal'], s: ['biceps'] }, zona: 'tiron', musc: ['Dorsali', 'bicipiti'], equipo: 'Cavo alto',
      cues: ['Presa poco più larga delle spalle', 'Petto in fuori, leggera inclinazione indietro fissa', 'Tira i gomiti verso le tasche', 'Barra alla clavicola, 1″ di pausa'],
      err: ['Dondolarsi per strappare la tirata', 'Tirare con le braccia senza deprimere le scapole', 'Barra dietro la nuca (no)'],
      alt: [{ n: 'Trazioni assistite', por: 'l\'obiettivo della F3 è migrare verso di loro' }, { n: 'Lat machine presa stretta', por: 'programmata nel Pull B' }],
      mol: 'Se la spalla dà fastidio: presa neutra (triangolo largo) e abbassa il peso.'
    },
    'jalon-estrecho': { pat: 'tv',
      nombre: 'Lat machine presa stretta', mm: { p: ['dorsal'], s: ['biceps'] }, zona: 'tiron', musc: ['Dorsali', 'bicipiti'], equipo: 'Cavo alto + triangolo',
      cues: ['Triangolo o presa supina alla larghezza delle spalle', 'Gomiti stretti che scendono lungo i fianchi', 'Allunga del tutto in alto: il dorsale lavora lungo'],
      err: ['Trasformarla in un rematore inclinandosi troppo', 'Mezza ripetizione in alto'],
      alt: [{ n: 'Trazioni supine assistite', por: 'equivalente a corpo libero' }],
      mol: 'Se il gomito dà fastidio: presa neutra e polsi dritti.'
    },
    'dominadas': { pat: 'tv',
      nombre: 'Trazioni (assistite → libere → zavorrate)', mm: { p: ['dorsal'], s: ['biceps', 'abdomen'] }, zona: 'tiron', musc: ['Dorsali', 'bicipiti, core'], equipo: 'Sbarra + macchina assistita o elastici',
      cues: ['Parti deprimendo le scapole (spalle lontane dalle orecchie)', 'Tira i gomiti verso il basso, mento sopra la sbarra', 'Scendi controllando fino a braccia quasi distese', 'Riduci l\'assistenza settimana dopo settimana: usciranno prima di quanto credi'],
      err: ['Scalciare e darsi slancio', 'Mezza trazione (né su né giù)', 'Appendersi sulle spalle in basso senza tensione scapolare'],
      alt: [{ n: 'Lat machine presa prona pesante', por: 'se quel giorno non c\'è la macchina assistita' }, { n: 'Trazioni negative (salto + discesa in 5″)', por: 'gran costruttore della prima trazione' }],
      mol: 'Se il gomito dà fastidio: presa neutra. Se dà fastidio la spalla: non restare appeso passivo in basso.',
      hito: 'dominada-libre'
    },
    'pullover-polea': { pat: 'tv',
      nombre: 'Pullover al cavo', mm: { p: ['dorsal'], s: [] }, zona: 'tiron', musc: ['Dorsali (isolamento)'], equipo: 'Cavo alto + barra o corda',
      cues: ['Braccia quasi tese, cerniera solo nella spalla', 'Porta la barra alla coscia disegnando un arco', 'Stiramento in alto, strizzata in basso'],
      err: ['Piegare i gomiti (diventa un\'estensione per tricipiti)', 'Dondolare il busto'],
      alt: [{ n: 'Pullover con manubrio su panca', por: 'senza cavi liberi' }],
      mol: 'Se la spalla dà fastidio: riduci l\'arco in alto.'
    },
    'face-pull': { pat: 'tv',
      nombre: 'Face pull', mm: { p: ['hombro'], s: ['espalda-alta'] }, zona: 'tiron', musc: ['Deltoide posteriore', 'rotatori, trapezio medio'], equipo: 'Cavo alto + corda',
      cues: ['Cavo all\'altezza del viso', 'Tira la corda verso la fronte separando i capi', 'Alla fine, ruota le spalle verso fuori (i bicipiti puntano al soffitto)', 'Leggero e perfetto: è salute della spalla, non ego'],
      err: ['Trasformarlo in un rematore alto caricato', 'Saltare la rotazione esterna finale'],
      alt: [{ n: 'Reverse pec-deck', por: 'deltoide posteriore senza corda' }, { n: 'Rotazione esterna con elastico', por: 'a casa o come extra' }],
      mol: 'È l\'esercizio che aggiusta le spalle; se dà fastidio, abbassa il peso e controlla di tirare verso la fronte, non verso il collo.'
    },
    'encogimientos': { pat: 'ais',
      nombre: 'Scrollate con manubri', mm: { p: ['espalda-alta'], s: [] }, zona: 'tiron', musc: ['Trapezio superiore'], equipo: 'Manubri',
      cues: ['Spalle verso le orecchie, pausa 1″ in alto', 'Braccia come corde: non piegare i gomiti', 'Scendi controllato e allunga'],
      err: ['Ruotare le spalle in cerchio (non aggiunge nulla e sfrega)', 'Rimbalzare con le gambe'],
      alt: [{ n: 'Con bilanciere', por: 'più carico totale' }],
      mol: 'Se il collo dà fastidio: guarda avanti e non incassare il mento.'
    },

    /* — Palestra: gambe/anca — */
    'sentadilla-barra': { pat: 'rod',
      nombre: 'Squat con bilanciere', mm: { p: ['cuadriceps'], s: ['abdomen', 'gluteo'] }, zona: 'pierna', musc: ['Quadricipiti', 'glutei, core'], equipo: 'Bilanciere + rack',
      cues: ['Bilanciere sul trapezio, non sulle cervicali', 'Core pressurizzato prima di scendere (prendi aria in petto-addome)', 'Scendi al parallelo, ginocchia in fuori', 'Spingi il pavimento, petto alto in risalita'],
      err: ['Talloni che si sollevano (colpa delle caviglie: rialzali con dei dischi se serve)', 'Ginocchia che collassano in dentro in risalita', 'Good morning: il bacino sale prima del petto'],
      alt: [{ n: 'Squat al multipower', por: 'giorni di fatica o rack occupato' }, { n: 'Hack squat / pressa', por: 'stimolo per i quadricipiti senza carico assiale' }, { n: 'Goblet squat con manubrio', por: 'come riscaldamento o se la tecnica si perde' }],
      mol: 'Ginocchio: scendi in 3″ e fermati 5 cm sopra il punto critico. Lombare: controlla la pressurizzazione e togli il 20% del peso per una settimana.'
    },
    'prensa': { pat: 'rod',
      nombre: 'Pressa', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadricipiti', 'glutei'], equipo: 'Pressa',
      cues: ['Piedi a metà pedana, larghezza spalle', 'Scendi fino a 90° senza staccare la lombare dallo schienale', 'Spingi con tutta la pianta, non bloccare le ginocchia di colpo'],
      err: ['Scendere tanto da far ruotare il bacino (butt wink in pressa = lombare)', 'Mani che spingono sulle ginocchia'],
      alt: [{ n: 'Hack squat', por: 'ancora più quadricipiti' }, { n: 'Pressa a una gamba', por: 'se c\'è uno squilibrio' }],
      mol: 'Se il ginocchio dà fastidio: piedi un po\' più in alto sulla pedana (più glutei, meno ginocchio).'
    },
    'rdl-barra': { pat: 'bis',
      nombre: 'Stacco rumeno', mm: { p: ['isquios'], s: ['gluteo', 'lumbar'] }, zona: 'pierna', musc: ['Femorali', 'glutei, lombari in isometria'], equipo: 'Bilanciere',
      cues: ['Anche indietro, ginocchia semiflesse e ferme', 'Bilanciere incollato alle gambe per tutto il viaggio', 'Schiena neutra: petto in fuori', 'Scendi finché senti forte l\'allungamento del femorale e risali strizzando i glutei'],
      err: ['Arrotondare la schiena per scendere di più', 'Piegare le ginocchia trasformandolo in mezzo squat', 'Bilanciere che si allontana dal corpo'],
      alt: [{ n: 'Stacco rumeno con manubri', por: 'presa più comoda le prime settimane' }, { n: 'Hyperextension a 45° con carico', por: 'femorali-glutei senza limite di presa' }],
      mol: 'L\'allungamento del femorale è il segnale che lo stai facendo bene. Se dà fastidio la lombare (non il femorale): togli il 20% e filma una serie di lato.'
    },
    'hip-thrust': { pat: 'bis',
      nombre: 'Hip thrust', mm: { p: ['gluteo'], s: ['isquios'] }, zona: 'pierna', musc: ['Glutei', 'femorali'], equipo: 'Bilanciere + panca (+ protezione)',
      cues: ['Parte alta della schiena appoggiata alla panca, bilanciere sul bacino con protezione', 'Mento al petto, sguardo avanti-basso', 'Sali fino all\'orizzontale esatta, pausa 1″ strizzando', 'Ginocchia a 90° in alto, talloni sotto le ginocchia'],
      err: ['Inarcare la lombare in alto (iperestensione)', 'Spingere con le punte dei piedi', 'Rimbalzare in basso senza pausa'],
      alt: [{ n: 'Macchina per hip thrust', por: 'se la palestra ce l\'ha, montaggio molto più rapido' }, { n: 'Ponte con bilanciere a terra', por: 'senza panca libera' }],
      mol: 'Se la lombare dà fastidio: è quasi sempre iperestensione in alto; fermati all\'orizzontale.'
    },
    'zancada-mc': { pat: 'zan',
      nombre: 'Affondi con manubri', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadricipiti', 'glutei'], equipo: 'Manubri',
      cues: ['Stessa tecnica di casa, ora con 6-10 kg per mano', 'Passo ampio, busto verticale, il ginocchio dietro sfiora il pavimento', 'I manubri pendono incollati al corpo, spalle indietro', 'Spingi col tallone davanti per tornare'],
      err: ['Passo corto che fa collassare il ginocchio davanti', 'Inclinarsi in avanti quando ti stanchi', 'Guardare a terra e perdere la linea'],
      alt: [{ n: 'Affondi indietro con manubri', por: 'più gentili col ginocchio' }, { n: 'Affondi al multipower', por: 'se l\'equilibrio limita il carico' }],
      mol: 'Se il ginocchio dà fastidio: passo più lungo e passa all\'affondo indietro.'
    },
    'zancada-bulgara': { pat: 'zan',
      nombre: 'Affondi bulgari', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadricipiti', 'glutei'], equipo: 'Panca + manubri',
      cues: ['Piede dietro sulla panca, quello davanti a un passo lungo', 'Scendi in verticale: il ginocchio dietro cerca il pavimento', 'Busto leggermente inclinato = più glutei; verticale = più quadricipiti', 'Parti solo a corpo libero, sul serio'],
      err: ['Piede davanti troppo vicino (il ginocchio soffre)', 'Rimbalzare in basso', 'Perdere l\'equilibrio guardando il soffitto'],
      alt: [{ n: 'Affondo statico con manubri', por: 'se l\'equilibrio ancora non c\'è' }, { n: 'Pressa a una gamba', por: 'unilaterale senza equilibrio' }],
      mol: 'Se il ginocchio davanti dà fastidio: allunga il passo e sposta il busto un po\' in avanti.'
    },
    'ext-cuadriceps': { pat: 'rod',
      nombre: 'Leg extension', mm: { p: ['cuadriceps'], s: [] }, zona: 'pierna', musc: ['Quadricipiti (isolamento)'], equipo: 'Macchina',
      cues: ['Ginocchio allineato al perno della macchina', 'Estendi del tutto con pausa 1″ in alto', 'Scendi in 2-3″'],
      err: ['Scalciare con lo slancio', 'Culo che si stacca dal sedile'],
      alt: [{ n: 'Sissy squat assistito', por: 'senza macchina' }],
      mol: 'Se la rotula dà fastidio: taglia l\'ultimo terzo IN alto non in basso, e tempo più lento. È anche il tuo esercizio di riabilitazione se un giorno il ginocchio protesta per la corsa.'
    },
    'curl-femoral-tumbado': { pat: 'ais',
      nombre: 'Leg curl sdraiato', mm: { p: ['isquios'], s: [] }, zona: 'pierna', musc: ['Femorali (isolamento)'], equipo: 'Macchina',
      cues: ['Bacino incollato al lettino per tutto il tempo', 'Sali in 1″, scendi in 2-3″', 'Punta del piede neutra'],
      err: ['Sollevare il bacino per aiutarti', 'Mezza ripetizione'],
      alt: [{ n: 'Leg curl da seduto', por: 'in realtà un filo meglio per il femorale; usalo se è libero' }, { n: 'Nordic curl assistito', por: 'versione avanzata, più avanti' }],
      mol: 'Se viene un crampo: allunga il femorale tra le serie, è normale le prime settimane.'
    },
    'curl-femoral-sentado': { pat: 'ais',
      nombre: 'Leg curl da seduto', mm: { p: ['isquios'], s: [] }, zona: 'pierna', musc: ['Femorali (isolamento)'], equipo: 'Macchina',
      cues: ['Coscia ben bloccata dal cuscinetto', 'Fletti del tutto, pausa 1″', 'Torna lento resistendo'],
      err: ['Culo che scivola in avanti', 'Range corto per eccesso di peso'],
      alt: [{ n: 'Leg curl sdraiato', por: 'equivalente' }],
      mol: 'Nessun problema tipico: è tra i più sicuri del piano.'
    },
    'gemelo-pie': { pat: 'gem',
      nombre: 'Calf raise in piedi', mm: { p: ['gemelos'], s: [] }, zona: 'pierna', musc: ['Polpaccio (gastrocnemio)'], equipo: 'Macchina o multipower + gradino',
      cues: ['Pausa 1″ IN alto e 1″ IN basso: niente rimbalzo', 'Allungamento completo in basso', 'Sali verticale, senza piegare le ginocchia'],
      err: ['Rimbalzare sfruttando il riflesso del tendine (toglie lo stimolo proprio al tessuto che vogliamo preparare)', 'Range a metà'],
      alt: [{ n: 'Alla pressa', por: 'senza macchina dedicata' }],
      mol: 'Se l\'Achille dà fastidio: solo isometrie in alto 3×30″ quella settimana.'
    },
    'gemelo-sentado': { pat: 'gem',
      nombre: 'Calf raise da seduto', mm: { p: ['gemelos'], s: [] }, zona: 'pierna', musc: ['Soleo'], equipo: 'Macchina',
      cues: ['Ginocchio a 90°: qui lavora il soleo, chiave per correre', 'Stessa regola: pausa in alto e in basso, niente rimbalzi'],
      err: ['Andare veloce a rimbalzi', 'Appoggiare solo la punta delle dita (meglio la base)'],
      alt: [{ n: 'Da seduto con manubri sulle ginocchia + gradino', por: 'senza macchina' }],
      mol: 'Come quello in piedi: fastidio all\'Achille = solo isometrie per una settimana.'
    },
    'elev-piernas': { pat: 'flex',
      nombre: 'Sollevamento gambe alla sbarra', mm: { p: ['abdomen'], s: ['antebrazo'] }, zona: 'core', musc: ['Addome basso', 'flessori, presa'], equipo: 'Sbarra per trazioni',
      cues: ['Appenditi attivo (spalle lontane dalle orecchie)', 'Porta le ginocchia al petto senza dondolare', 'Scendi controllato fino in fondo'],
      err: ['Dondolarsi', 'Tirare solo coi flessori dell\'anca a lombare inarcata'],
      alt: [{ n: 'Alle parallele (appoggio sui gomiti)', por: 'se la presa cede prima dell\'addome' }, { n: 'Sollevamenti da sdraiato', por: 'versione iniziale' }],
      mol: 'Se la spalla dà fastidio da appeso: passa direttamente alle parallele.'
    },
    'rueda-abdominal': { pat: 'flex',
      nombre: 'Ab wheel', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Core anteriore completo'], equipo: 'Ab wheel',
      cues: ['In ginocchio, bacino in retroversione prima di partire', 'Rotola fino a dove controlli la lombare', 'Torna tirando con l\'addome, non con le braccia'],
      err: ['Inarcare la lombare in estensione (l\'errore che fa infortunare)', 'Andare più lontano di quanto il core regga'],
      alt: [{ n: 'Crunch al cavo', por: 'se oggi la rotella è troppo' }, { n: 'Plank con zavorra', por: 'isometrico equivalente' }],
      mol: 'Se la lombare dà fastidio: dimezza l\'escursione e guadagna range settimana dopo settimana.'
    },
    'crunch-polea': { pat: 'flex',
      nombre: 'Crunch al cavo', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Retto addominale'], equipo: 'Cavo alto + corda',
      cues: ['In ginocchio, corda ai lati della testa', 'Flettiti dalle costole, non dall\'anca', 'Gomiti verso le ginocchia, espira scendendo'],
      err: ['Tirare con le braccia', 'Sedersi all\'indietro muovendo solo l\'anca'],
      alt: [{ n: 'Crunch alla macchina', por: 'equivalente' }, { n: 'Ab wheel', por: 'quando vuoi alzare il livello' }],
      mol: 'Nessun problema tipico se fletti dalle costole.'
    },

    'fondos-silla': { pat: 'ext', pic: 'fondos-silla',
      nombre: 'Dips sulla sedia', mm: { p: ['triceps'], s: ['pecho', 'hombro'] }, zona: 'empuje', musc: ['Tricipite', 'petto basso, spalla'], equipo: 'Niente (sedia o divano)',
      cues: ['Mani sul bordo della sedia, dita in fuori, spalle lontane dalle orecchie', 'Scendi fino a 90° di gomito, nemmeno un grado di più: sotto paga la spalla', 'Gomiti indietro, che sfiorano il corpo, mai aperti', 'La schiena sale e scende incollata al bordo della sedia'],
      err: ['Scendere fino in fondo cercando l’allungamento (è così che nasce il dolore di spalla)', 'Allontanare i piedi al punto che il peso finisce sulle gambe', 'Alzare le spalle verso le orecchie'],
      alt: [{ n: 'Ginocchia piegate, piedi vicini', por: 'se non escono 8 ripetizioni pulite' }, { n: 'Piedi su una seconda sedia', por: 'quando 15 diventano facili' }],
      mol: 'Se la parte anteriore della spalla protesta: accorcia l’escursione a 60°, oppure passa ai piegamenti a diamante, che lasciano stare l’articolazione.'
    },
    'flexion-diamante': { pat: 'ext', pic: 'flexiones',
      nombre: 'Piegamenti a diamante', mm: { p: ['triceps'], s: ['pecho', 'hombro'] }, zona: 'empuje', musc: ['Tricipite', 'petto interno'], equipo: 'Niente',
      cues: ['Indici e pollici a formare un rombo sotto lo sterno', 'Gomiti attaccati al corpo per tutta la ripetizione', 'Corpo in plank: glutei e addome stretti', 'Petto alle mani, e in alto estendi del tutto'],
      err: ['Aprire i gomiti (torna a essere un piegamento normale)', 'Mettere le mani sotto il viso invece che sotto lo sterno', 'Bacino che cede'],
      alt: [{ n: 'Mani sul divano o su un tavolo', por: 'se a terra non escono pulite' }, { n: 'Piedi rialzati', por: 'se superi 12 facili' }],
      mol: 'Se protesta il polso: appoggia sui pugni o scendi sulle ginocchia. Se protesta il gomito, sali a 15 ripetizioni e rallenta il tempo.'
    },
    'ext-triceps-banda': { pat: 'ext', pic: 'banda',
      nombre: 'Estensione tricipiti con elastico', mm: { p: ['triceps'], s: [] }, zona: 'empuje', musc: ['Tricipite (tutti e tre i capi)'], equipo: 'Elastico',
      cues: ['Fissa l’elastico in alto (porta o maniglia) e fai un passo indietro', 'Gomiti attaccati ai fianchi e fermi: si muove solo l’avambraccio', 'Estendi fino al blocco morbido e tieni 1″ in basso', 'Torna in 2-3″ resistendo all’elastico'],
      err: ['Lasciare che i gomiti scappino avanti o in alto', 'Spingere con la spalla inclinando il busto', 'Mollare il ritorno e lasciare comandare l’elastico'],
      alt: [{ n: 'Sopra la testa con l’elastico sotto i piedi', por: 'colpisce di più il capo lungo' }, { n: 'Kickback con manubrio', por: 'se non hai dove fissarlo' }],
      mol: 'È l’esercizio più gentile con il gomito di tutto il piano: quando gli altri danno fastidio, di solito è il rifugio. Aumenta le ripetizioni prima della durezza dell’elastico.'
    },
    'press-frances-mc': { pat: 'ext', pic: 'press-frances-mc',
      nombre: 'French press con manubri', mm: { p: ['triceps'], s: [] }, zona: 'empuje', musc: ['Tricipite (capo lungo)'], equipo: 'Manubri',
      cues: ['Sdraiato a terra, manubri in alto, palmi che si guardano', 'Scendi verso le orecchie piegando solo il gomito, in 2-3″', 'Gomiti puntati al soffitto e fermi', 'Estendi senza bloccare di colpo'],
      err: ['Lasciare che i gomiti si aprano', 'Trasformarlo in una spinta muovendo la spalla', 'Scendere così in fretta che il pavimento fermi il manubrio'],
      alt: [{ n: 'Estensione sopra la testa da seduto', por: 'più escursione sul capo lungo' }, { n: 'Estensione tricipiti con elastico', por: 'se il gomito chiede tensione più dolce' }],
      mol: 'Se protesta il gomito: passa alla versione con elastico a 15 ripetizioni. Il pavimento inoltre ti taglia l’escursione proprio dove il gomito soffre.'
    },
    /* — Braccia — */
    'curl-barra-z': { pat: 'curl',
      nombre: 'Curl con bilanciere EZ', mm: { p: ['biceps'], s: [] }, zona: 'tiron', musc: ['Bicipiti'], equipo: 'Bilanciere EZ',
      cues: ['Gomiti incollati al corpo, fissi', 'Sali senza dondolare, scendi in 2-3″', 'Polsi neutri grazie alla EZ'],
      err: ['Dondolare il corpo per alzare più peso', 'Gomiti che viaggiano in avanti in alto'],
      alt: [{ n: 'Curl alternato con manubri', por: 'con rotazione (supinazione), molto completo' }, { n: 'Curl al cavo basso', por: 'tensione continua' }],
      mol: 'Se polso o gomito danno fastidio: manubri con rotazione o presa a martello.'
    },
    'curl-inclinado': { pat: 'curl',
      nombre: 'Curl su panca inclinata', mm: { p: ['biceps'], s: [] }, zona: 'tiron', musc: ['Bicipiti (capo lungo)'], equipo: 'Manubri + panca a 45-60°',
      cues: ['Panca a 45-60°, braccia che pendono verticali', 'Lo stiramento in basso è lo stimolo: non tagliarlo', 'Gomiti fermi, sali senza alzare le spalle'],
      err: ['Portare avanti i gomiti', 'Mezza ripetizione in basso'],
      alt: [{ n: 'Curl bayesian al cavo', por: 'stesso stiramento, in piedi' }],
      mol: 'Se la spalla tira in basso: alza di una tacca lo schienale.'
    },
    'curl-martillo': { pat: 'curl',
      nombre: 'Hammer curl', mm: { p: ['biceps'], s: ['antebrazo'] }, zona: 'tiron', musc: ['Brachiale', 'avambraccio'], equipo: 'Manubri',
      cues: ['Presa neutra (a martello), gomiti fermi', 'Puoi farlo alternato o insieme', 'Controlla la discesa'],
      err: ['Dondolio', 'Trasformarlo in un rematore alzando i gomiti'],
      alt: [{ n: 'Hammer curl con corda al cavo', por: 'variante' }],
      mol: 'È il curl più gentile con gomiti e polsi: di solito è il rifugio quando gli altri danno fastidio.'
    },
    'curl-polea': { pat: 'curl',
      nombre: 'Curl al cavo basso', mm: { p: ['biceps'], s: [] }, zona: 'tiron', musc: ['Bicipiti'], equipo: 'Cavo basso + barra',
      cues: ['Un passo indietro dal cavo, gomiti fermi', 'Tensione continua: non riposare né in alto né in basso', 'Ultima serie: tieni 10″ in isometria a metà per chiudere'],
      err: ['Avvicinarsi tanto che il tratto basso perde tensione', 'Dondolarsi'],
      alt: [{ n: 'Curl con bilanciere EZ', por: 'equivalente coi pesi liberi' }],
      mol: 'Se il gomito dà fastidio: presa più larga o corda a martello.'
    }
  };

  /* ---------- LE 8 REGOLE ---------- */
  const REGLAS = [
    { n: 1, t: 'RPE sotto controllo', d: 'Ogni fase ha il suo tetto. Il tuo sistema nervoso ricorda; i tuoi tendini sono stati anni senza carico. Frena tu prima che frenino loro.' },
    { n: 2, t: 'Doppia progressione', d: 'Prima ripetizioni dentro il range, poi peso: +2,5 kg (+5 in squat e stacco rumeno), solo con tecnica pulita in tutte le serie. L’app te lo suggerisce.' },
    { n: 3, t: 'Bilancia = media settimanale', d: 'Lunedì, mercoledì e venerdì a digiuno, e guarda solo la media. Un giorno singolo non dice niente: acqua, sale, creatina.' },
    { n: 4, t: 'Proteine: {p} g in 4 pasti', d: 'Nessuna porzione sotto i {q} g. Decide se quello che cambia è grasso o muscolo.' },
    { n: 5, t: '8.000–10.000 passi al giorno', d: 'Tutti i giorni, che ti alleni o no. Bruciano più calorie a settimana delle sessioni stesse.' },
    { n: 6, t: 'Sonno 7–8 h: non negoziabile', d: 'Con 5,5 h di sonno in deficit perdi il 55% di grasso in meno e il 60% di muscolo in più. Caffeina solo prima delle 13-14.' },
    { n: 7, t: 'Un giorno saltato non si recupera', d: 'Non raddoppiare la sessione né tagliare il cibo il giorno dopo: segui il calendario.' },
    { n: 8, t: 'Minimo non negoziabile', d: 'Quello che ammazza è 3 mesi a tutta e 3 a zero. La settimana caotica ha un pavimento: 2 forza + 1 cardio.' }
  ];

  const SENALES = ['Ferma l’esercizio quel giorno: dolore acuto a ginocchio, spalla o lombare durante il movimento; fastidio che peggiora serie dopo serie invece di sparire scaldandoti.', 'Normale: indolenzimento diffuso a 24-48 h.', 'Fisioterapista prima di continuare: dolore articolare localizzato più di 5 giorni.'];

  /* ---------- NUTRIZIONE ---------- */
  const NUTRI = {
    calorias: [
      { c: 'Metabolismo basale', v: '~1.950 kcal', n: '95,1 kg · 183 cm · 30 anni' },
      { c: 'Dispendio totale stimato', v: '2.850–3.000 kcal', n: 'Allenamenti + 8-10k passi' },
      { c: 'Apporto obiettivo', v: '2.250–2.400 kcal', n: 'Deficit ~550–700 kcal/giorno: di più frena il recupero del muscolo.' },
      { c: 'Ritmo di perdita atteso', v: '0,6–0,75 kg/sett', n: '≈0,7% del peso a settimana, l’ideale per trattenere muscolo. Media settimanale.' }
    ],
    fases: [
      { f: 'F1–F2 (sett 1-5)', kcal: 2250, p: 190, g: 70, c: 205 },
      { f: 'F3 (sett 6-9)',    kcal: 2350, p: 190, g: 70, c: 230, nota: 'Settimana 7: DIET BREAK a ~2.800' },
      { f: 'F4 (sett 10-12)',  kcal: 2400, p: 190, g: 70, c: 240 }
    ],
    escalado: 'Le proteine ({p} g) non si toccano: quando sale l’allenamento, salgono solo i carboidrati.',
    tomas: 'Comanda il totale, ma dividerlo in 4 spreme la sintesi e toglie la fame notturna.',
    plato: [
      { t: 'Proteine (a ogni pasto)', d: '200-250 g di pollo/tacchino/pesce bianco a crudo, o 170-180 g di salmone/manzo, o 3 uova + 2 albumi, o 250 g di skyr + whey.' },
      { t: 'Carboidrati', d: '60-75 g a crudo di riso/pasta, o 250-300 g di patate, o 60 g di pane integrale, o 50 g di avena.' },
      { t: 'Verdura', d: 'Metà piatto, libera. Volume e sazietà.' },
      { t: 'Grassi', d: '10 g di olio EVO per pasto principale (un cucchiaio) e stop. È da lì che scappano le calorie senza che te ne accorga.' }
    ],
    suplementos: [
      { id: 'creatina', t: 'Creatina monoidrato', d: '5 g al giorno, a qualsiasi ora, senza carico, da subito. Trattiene 1-2 kg d’acqua le prime settimane: non è grasso. Fidati del girovita e della media settimanale; il grafico lo segna.' },
      { id: 'whey', t: 'Whey', d: '1 misurino nello spuntino pre-nanna con lo skyr (e un altro dove serve nei giorni corti di proteine).' },
      { id: 'cafeina', t: 'Caffeina', d: 'Niente caffeina dopo le 13-14: 200 mg alterano il sonno fino a 13 h dopo; un caffè, ~9 h. Allenamento al mattino: caffè 30-45′ prima. Di pomeriggio: niente caffeina; il pre-workout è la merenda (frutta + skyr, 60-90′ prima).' },
      { id: 'vitamina-d', t: 'Vitamina D', d: 'Solo se le analisi escono sotto i 30 ng/mL, probabile con vita al chiuso.' },
      { id: 'omega-3', t: 'Omega-3', d: '~2 g di EPA+DHA al giorno: beneficio modesto ma reale su forza e tendine.' },
      { id: 'no', t: 'Non spendere in', d: 'Brucia-grassi, BCAA/EAA (li coprono già le tue proteine) e "testo booster". Non spostano l’ago.' }
    ],
    hidratacion: 'Acqua: 2,5–3 L al giorno. Alcol: solo nel pasto libero; conta calorie e frena il recupero.',
    comidaLibre: 'Un pasto a settimana, non un giorno intero (sabato di default). Mangia quello che ti va in quantità normale, senza compensare né prima né dopo. Così il piano regge {s} settimane e una vita sociale. Si può spostare; resta uno.'
  };

  /* ---------- RICETTE ---------- */
  // q in grammi salvo unità indicata · macro per porzione
  const RECETAS = [
    {
      id: 'bol-skyr', slot: 'de', tags: ['lacteo', 'frutos'], nombre: 'Bowl di skyr', tipo: 'Colazione A', tiempo: '5′', cocina: 'Niente fornelli',
      macros: { kcal: 520, p: 35, g: 11, c: 72 },
      ing: [
        { pid: 'skyr', q: '250 g', i: 'skyr al naturale (o quark magro 0%)' },
        { pid: 'avena', q: '50 g', i: 'fiocchi d\'avena' },
        { pid: 'platano', q: '1 pz (120 g)', i: 'banana' },
        { pid: 'nueces', q: '10 g', i: 'noci' },
        { pid: 'canela', q: 'q.b.', i: 'cannella' }
      ],
      pasos: [
        'Skyr nella ciotola e avena sopra (così com\'è se ti piace la consistenza, o ammollata 5′ in un dito di latte o acqua).',
        'Banana a rondelle, noci spezzate con le mani e cannella sopra.'
      ],
      tips: 'Se ti alleni al mattino, montala la sera prima: l’avena ammollata ci guadagna. Giorno corto di proteine: +1 misurino di whey nello skyr (+110 kcal, +23 g).'
    },
    {
      id: 'tortilla-pan', slot: 'de', tags: ['huevo', 'gluten'], nombre: 'Omelette con pane e pomodoro', tipo: 'Colazione B', tiempo: '10′', cocina: 'Padella',
      macros: { kcal: 470, p: 34, g: 22, c: 32 },
      ing: [
        { pid: 'huevos', q: '3 pz', i: 'uova M' },
        { pid: 'claras', q: '2 pz (o 100 ml in brik)', i: 'albumi' },
        { pid: 'pan', q: '60 g (2 fette)', i: 'pane integrale' },
        { pid: 'tomate', q: '100 g', i: 'pomodoro grattugiato' },
        { pid: 'aove', q: '5 g', i: 'olio EVO' },
        { pid: 'sal', q: 'un pizzico', i: 'sale' }
      ],
      pasos: [
        'Sbatti uova e albumi col sale.',
        'Padella antiaderente a fuoco medio coi 5 g di olio EVO: rapprendi la frittata al punto che ti piace.',
        'Tosta il pane e mettici sopra il pomodoro grattugiato con una goccia dell\'olio della padella.'
      ],
      tips: 'Gli albumi in brik tolgono la pigrizia di separare le uova. Versione strapazzata: stesso tempo, zero tecnica.'
    },
    {
      id: 'pollo-asado', slot: 'co', tags: ['carne'], nombre: 'Pollo al forno con patate', tipo: 'Pranzo · batch della domenica', tiempo: '45′ di forno (dal meal prep)', cocina: 'Forno',
      macros: { kcal: 780, p: 70, g: 19, c: 68 },
      ing: [
        { pid: 'pollo', q: '250 g a crudo (~200 g cotto)', i: 'petto di pollo', n: 'batch: 1,2 kg = 5 porzioni' },
        { pid: 'patata', q: '200 g', i: 'patate a spicchi' }, { pid: 'pimiento', q: '50 g', i: 'peperone' }, { pid: 'cebolla', q: '50 g', i: 'cipolla' },
        { pid: 'aove', q: '10 g', i: 'olio EVO (parte della teglia)' },
        { pid: 'especias', q: 'q.b.', i: 'paprika, aglio in polvere, sale, origano' }
      ],
      pasos: [
        'Forno a 200°. Sala e pepa i petti e spalmali di paprika + aglio in polvere.',
        'Teglia 1: petti, 25-30′ (appena cotti = succosi; esagera e diventano suola).',
        'Teglia 2: patate a spicchi con peperone, cipolla e 20 g di olio EVO in totale, 40-45′, girata a metà.',
        'Porziona: 5 contenitori. Il pollo di giovedì-venerdì, in freezer.'
      ],
      tips: 'La porzione si riscalda in 2′ di micro con un goccio d\'acqua perché il pollo non si secchi.'
    },
    {
      id: 'lentejas-pollo', slot: 'co', tags: ['carne'], nombre: 'Lenticchie col pollo', tipo: 'Pranzo · batch della domenica', tiempo: '25′ in pentola', cocina: 'Pentola',
      macros: { kcal: 760, p: 52, g: 16, c: 80 },
      ing: [
        { pid: 'lentejas', q: '250 g sgocciolate', i: 'lenticchie già cotte in barattolo', n: 'batch: 2 barattoli = 3 porzioni' },
        { pid: 'pollo', q: '120 g', i: 'pollo al forno a striscioline (dalla teglia)' },
        { pid: 'cebolla', q: '¼ pz', i: 'cipolla' },
        { pid: 'pimiento', q: '½ pz', i: 'peperone' },
        { pid: 'zanahoria', q: '1 pz', i: 'carota' },
        { pid: 'aove', q: '4 g', i: 'olio EVO (parte del soffritto)' },
        { pid: 'especias', q: '1 cucchiaino / ½ cucchiaino', i: 'paprika / cumino' },
        { pid: 'caldo', q: '150 ml', i: 'brodo o acqua' },
        { pid: 'fruta', q: '1 pezzo', i: 'frutta come dessert' }
      ],
      pasos: [
        'Soffritto 8′: cipolla, peperone e carota tritati con 10 g di olio EVO (per il batch da 3 porzioni).',
        'Aggiungi le lenticchie sgocciolate, il brodo, paprika e cumino: 15′ a fuoco basso.',
        'Spegni e mescolaci il pollo a striscioline (così non si secca).'
      ],
      tips: 'In barattolo e senza ammollo: il legume più veloce che esista. Il giorno dopo si addensano: aggiungi un dito d\'acqua quando riscaldi.'
    },
    {
      id: 'salteado-ternera', slot: 'co', tags: ['carne'], nombre: 'Straccetti di manzo saltati', tipo: 'Pranzo · 15′ al momento', tiempo: '15′', cocina: 'Wok / padella',
      macros: { kcal: 730, p: 45, g: 20, c: 60 },
      ing: [
        { pid: 'ternera', q: '180-200 g', i: 'manzo magro a striscioline' },
        { pid: 'arroz', q: '70 g a crudo (≈ 180 g cotto)', i: 'riso', n: 'usa quello del batch' },
        { pid: 'verduras', q: '250 g', i: 'verdure miste: peperone, cipolla, zucchina, carota' },
        { pid: 'salsa-soja', q: '15 ml', i: 'salsa di soia' },
        { pid: 'aove', q: '8 g', i: 'olio EVO' }
      ],
      pasos: [
        'Wok o padella ben calda con l’olio EVO: rosola il manzo 1-2′ e mettilo da parte; se lo lasci lì, si lessa e diventa duro.',
        'Stessa padella: verdure a striscioline 5-6′, che restino al dente.',
        'Rimetti il manzo, soia, 1′ di salto e tutto sopra il riso.'
      ],
      tips: 'L\'ordine è tutto: carne fuori prima delle verdure. Chiedi in macelleria "straccetti da saltare" e ti risparmi di tagliare.'
    },
    {
      id: 'salmon-arroz', slot: 'ce', tags: ['pescado'], nombre: 'Salmone con riso e broccoli', tipo: 'Cena · 15′', tiempo: '15′', cocina: 'Piastra o forno',
      macros: { kcal: 760, p: 40, g: 28, c: 62 },
      ing: [
        { pid: 'salmon', q: '170-180 g', i: 'filetto di salmone' },
        { pid: 'arroz', q: '75 g a crudo (≈ 190 g cotto)', i: 'riso', n: 'dal batch' },
        { pid: 'brocoli', q: '200 g', i: 'broccoli' },
        { pid: 'limon', q: '½ pz', i: 'limone' },
        { pid: 'sal', q: 'un pizzico', i: 'sale' }
      ],
      pasos: [
        'Broccoli al micro in una ciotola coperta con un dito d\'acqua: 4-5′ (o al vapore).',
        'Salmone in padella 3-4′ per lato partendo dalla pelle (o forno a 200°, 12′). Senza olio: il suo ce l\'ha già.',
        'Riso riscaldato, limone spremuto sopra tutto.'
      ],
      tips: 'Il grasso del salmone conta come il grasso del pasto: per questo qui non c\'è olio EVO.'
    },
    {
      id: 'merluza-patata', slot: 'ce', tags: ['pescado', 'lacteo'], nombre: 'Nasello con patate al forno', tipo: 'Cena · 20′', tiempo: '20′', cocina: 'Forno o micro+piastra',
      macros: { kcal: 740, p: 55, g: 15, c: 55 },
      ing: [
        { pid: 'merluza', q: '250 g', i: 'nasello o branzino a filetti' },
        { pid: 'patata', q: '250 g', i: 'patate' },
        { pid: 'lechuga', q: '100 g', i: 'lattuga' }, { pid: 'tomate', q: '1 ud', i: 'pomodoro' }, { pid: 'cebolla', q: '¼ ud', i: 'cipolla' },
        { pid: 'aove', q: '10 g', i: 'olio EVO (5 patate + 5 insalata)' },
        { pid: 'skyr', q: '1 pz', i: 'skyr come dessert' }
      ],
      pasos: [
        'Patate a fette di ½ cm: micro 8′ coperte (o al forno 25′ con 5 g di olio EVO, sale e origano).',
        'Nasello: forno a 200° 10-12′, o piastra 3′ per lato. Punto giusto: quando si sfalda in scaglie.',
        'Insalata con 5 g di olio EVO e aceto. Skyr come dessert e cena chiusa.'
      ],
      tips: 'Il pesce bianco è la proteina più saziante per caloria di tutto il piano: usalo nei giorni di più fame.'
    },
    {
      id: 'revuelto-gambas', slot: 'ce', tags: ['pescado', 'huevo', 'gluten'], nombre: 'Uova strapazzate coi gamberi', tipo: 'Cena · 10′', tiempo: '10′', cocina: 'Padella',
      macros: { kcal: 620, p: 45, g: 30, c: 25 },
      ing: [
        { pid: 'huevos', q: '3 pz', i: 'uova M' },
        { pid: 'gambas', q: '150 g', i: 'gamberi sgusciati (surgelati vanno benissimo)' },
        { pid: 'pan', q: '40 g', i: 'pane integrale' },
        { pid: 'lechuga', q: 'una ciotola', i: 'insalata verde' },
        { pid: 'aove', q: '8 g', i: 'olio EVO' },
        { pid: 'ajo', q: '1 spicchio', i: 'aglio' }
      ],
      pasos: [
        'Dora l\'aglio a lamelle con l\'olio EVO; gamberi 2′ (scongelati e asciugati prima).',
        'Abbassa il fuoco, aggiungi le uova sbattute e mescola senza fermarti fino a renderle cremose. Via dal fuoco prima che rapprendano del tutto.',
        'Pane tostato e insalata a fianco.'
      ],
      tips: 'Le uova strapazzate finiscono di cuocersi fuori dal fuoco. Gamberi surgelati: scongelali in una ciotola d\'acqua fredda in 10′.'
    },
    {
      id: 'toma-noche', slot: 'snack', tags: ['lacteo'], nombre: 'Spuntino pre-nanna', tipo: 'Pasto 4 · quotidiano', tiempo: '1′', cocina: 'Niente fornelli',
      macros: { kcal: 270, p: 49, g: 2, c: 14 },
      ing: [
        { pid: 'skyr', q: '250 g', i: 'skyr o quark magro 0%' },
        { pid: 'whey', q: '1 misurino (30 g)', i: 'whey (il gusto che non ti stufa)' },
        { pid: 'canela', q: 'q.b.', i: 'cannella' }
      ],
      pasos: [
        'Mescola il misurino di whey con lo skyr fino a consistenza di mousse. Cannella sopra.',
        '30-60′ prima di andare a letto. Fine.'
      ],
      tips: 'Completa le proteine del giorno e uccide la fame notturna, dove muoiono le diete. La caseina si digerisce lenta: lavora mentre dormi.'
    },
    {
      id: 'ensalada-atun', slot: 'ce', tags: ['pescado', 'huevo'], nombre: 'Insalatona di tonno', tipo: 'Cena · 10′', tiempo: '10′', cocina: 'Senza fornelli (col batch)',
      macros: { kcal: 700, p: 45, g: 25, c: 50 },
      ing: [
        { pid: 'atun', q: '2 lattine (120 g sgocciolato)', i: 'tonno al naturale' },
        { pid: 'huevos', q: '1 pz', i: 'uovo sodo (dal batch)' },
        { pid: 'patata', q: '150 g', i: 'patate lesse (dal batch)' },
        { pid: 'tomate', q: '150 g', i: 'pomodoro' },
        { pid: 'aceitunas', q: '30 g', i: 'olive' },
        { pid: 'cebolla', q: '¼ pz', i: 'cipolla rossa' },
        { pid: 'aove', q: '10 g', i: 'olio EVO' }
      ],
      pasos: [
        'Tutto nella ciotola: patate a dadini, pomodoro a spicchi, cipolla sottile, tonno sgocciolato, uovo in quarti, olive.',
        'Olio evo, aceto, sale e una mescolata.'
      ],
      tips: 'La cena a sforzo zero se la domenica hai lessato patate e uova in più. Versione senza patate (giorno di poca fame): aggiungi più pomodoro.'
    },
    { id: 'porridge-soja', slot: 'de', tags: [], nombre: 'Porridge di avena e proteine', tipo: 'Colazione C', tiempo: '8′', cocina: 'Pentolino o micro',
      macros: { kcal: 545, p: 37, g: 11, c: 69 },
      ing: [{ pid: 'avena', q: '70 g', i: 'fiocchi d’avena (certificati senza glutine)' }, { pid: 'bebida-soja', q: '250 ml', i: 'bevanda di soia senza zucchero' }, { pid: 'prote-vegetal', q: '25 g', i: 'proteine di pisello, neutre o vaniglia' }, { pid: 'platano', q: '1', i: 'banana a fette' }, { pid: 'canela', q: 'q.b.', i: 'cannella' }],
      pasos: ['Scalda l’avena con la soia 4-5′ mescolando finché addensa.', 'Fuori dal fuoco unisci le proteine: se bollono, fanno grumi.', 'Completa con banana e cannella.'],
      tips: 'Preparalo la sera prima in frigo (overnight) e al mattino aggiungi solo le proteine.' },
    { id: 'tofu-revuelto', slot: 'de', tags: [], nombre: 'Tofu strapazzato su pane tostato', tipo: 'Colazione D', tiempo: '12′', cocina: 'Padella',
      macros: { kcal: 570, p: 41, g: 25, c: 42 },
      ing: [{ pid: 'tofu', q: '200 g', i: 'tofu compatto sbriciolato' }, { pid: 'pan-sg', q: '2 fette (70 g)', i: 'pane senza glutine' }, { pid: 'levadura', q: '10 g', i: 'lievito alimentare' }, { pid: 'tomate', q: '1', i: 'pomodoro a fette' }, { pid: 'aove', q: '5 g', i: 'olio EVO' }, { pid: 'especias', q: 'q.b.', i: 'curcuma, sale nero kala namak, pepe' }],
      pasos: ['Salta il tofu sbriciolato nell’olio 3-4′ a fuoco medio-alto.', 'Aggiungi curcuma, lievito e sale nero (il sapore d’uovo); altri 2′.', 'Tosta il pane e componi con il pomodoro.'],
      tips: 'Il kala namak è la chiave: senza è tofu alla curcuma; con, uno strapazzato vero.' },
    { id: 'bol-soja-frutos', slot: 'de', tags: [], nombre: 'Bowl di yogurt di soia e frutti rossi', tipo: 'Colazione E', tiempo: '5′', cocina: 'Senza cottura',
      macros: { kcal: 415, p: 29, g: 11, c: 41 },
      ing: [{ pid: 'yogur-soja', q: '250 g', i: 'yogurt di soia naturale senza zucchero' }, { pid: 'prote-vegetal', q: '20 g', i: 'proteine vegetali in polvere' }, { pid: 'frutos-rojos', q: '120 g', i: 'frutti rossi (surgelati vanno bene)' }, { pid: 'chia', q: '15 g', i: 'semi di chia' }, { pid: 'platano', q: '1', i: 'banana piccola' }],
      pasos: ['Mescola yogurt e proteine finché sparisce ogni grumo.', 'Aggiungi la chia e aspetta 5′: addensa da sola.', 'Completa con frutti rossi e banana.'],
      tips: 'I frutti rossi surgelati, così come sono, raffreddano e addensano la bowl: meglio dei freschi qui.' },
    { id: 'revuelto-espinacas', slot: 'de', tags: ['huevo'], nombre: 'Uova strapazzate con spinaci', tipo: 'Colazione F', tiempo: '10′', cocina: 'Padella',
      macros: { kcal: 510, p: 28, g: 21, c: 46 },
      ing: [{ pid: 'huevos', q: '3', i: 'uova' }, { pid: 'espinacas', q: '100 g', i: 'spinaci freschi' }, { pid: 'champinones', q: '100 g', i: 'funghi champignon a fette' }, { pid: 'pan-sg', q: '50 g', i: 'pane senza glutine' }, { pid: 'aove', q: '5 g', i: 'olio EVO' }, { pid: 'fruta', q: '150 g', i: 'frutta di stagione' }],
      pasos: ['Salta i funghi 3′; aggiungi gli spinaci finché appassiscono.', 'Uova sbattute dentro, fuoco basso, mescolando: cremose, non asciutte.', 'Servi con il pane tostato e la frutta a parte.'],
      tips: 'Spegni quando sembra ancora un po’ crudo: il calore residuo finisce la cottura.' },
    { id: 'curry-lentejas', slot: 'co', tags: [], nombre: 'Curry di lenticchie rosse con riso', tipo: 'Pranzo · batch della domenica', tiempo: '25′ pentola', cocina: 'Pentola',
      macros: { kcal: 755, p: 31, g: 18, c: 108 },
      ing: [{ pid: 'lentejas-rojas', q: '100 g', i: 'lenticchie rosse secche' }, { pid: 'leche-coco', q: '100 ml', i: 'latte di cocco leggero' }, { pid: 'tomate-triturado', q: '150 g', i: 'passata di pomodoro' }, { pid: 'arroz', q: '50 g', i: 'riso basmati crudo' }, { pid: 'aove', q: '10 g', i: 'olio EVO' }, { pid: 'especias', q: 'q.b.', i: 'cipolla, aglio, zenzero, curry in polvere, sale' }],
      pasos: ['Soffriggi cipolla, aglio e zenzero 3′; aggiungi il curry e tostalo 30″.', 'Lenticchie, pomodoro, cocco e 300 ml d’acqua: 18-20′ a fuoco medio finché si disfano.', 'Riso a parte (12′). Curry sopra.'],
      tips: 'Batch: ×4 dura 4 giorni in frigo e si congela benissimo. Le lenticchie rosse non vanno ammollate.' },
    { id: 'tofu-salteado', slot: 'co', tags: [], nombre: 'Tofu saltato con verdure e riso integrale', tipo: 'Pranzo · 20′', tiempo: '20′', cocina: 'Wok / padella',
      macros: { kcal: 775, p: 47, g: 34, c: 71 },
      ing: [{ pid: 'tofu', q: '200 g', i: 'tofu compatto a cubetti' }, { pid: 'arroz', q: '70 g', i: 'riso integrale crudo' }, { pid: 'brocoli', q: '100 g', i: 'broccoli' }, { pid: 'pimiento', q: '75 g', i: 'peperone' }, { pid: 'zanahoria', q: '75 g', i: 'carota' }, { pid: 'tamari', q: '15 ml', i: 'tamari (salsa di soia senza glutine)' }, { pid: 'aove', q: '10 g', i: 'olio EVO' }, { pid: 'sesamo', q: '10 g', i: 'semi di sesamo' }],
      pasos: ['Cuoci il riso integrale (25′; fallo in batch).', 'Tofu a fuoco vivo finché dora su tutti i lati (6-7′); metti da parte.', 'Verdure 4′ nel wok, torna il tofu, tamari e sesamo; 1′ e via.'],
      tips: 'Pressa il tofu 10′ tra due piatti con un peso: perde acqua e dora davvero.' },
    { id: 'bol-garbanzos', slot: 'co', tags: [], nombre: 'Bowl di ceci arrostiti con quinoa e hummus', tipo: 'Pranzo · 15′ fresco', tiempo: '15′ (+ forno)', cocina: 'Forno + senza cottura',
      macros: { kcal: 780, p: 31, g: 24, c: 103 },
      ing: [{ pid: 'garbanzos', q: '200 g', i: 'ceci cotti' }, { pid: 'quinoa', q: '60 g', i: 'quinoa cruda' }, { pid: 'hummus', q: '50 g', i: 'hummus' }, { pid: 'pimiento', q: '100 g', i: 'peperone' }, { pid: 'pepino', q: '50 g', i: 'cetriolo' }, { pid: 'aove', q: '5 g', i: 'olio EVO' }, { pid: 'especias', q: 'q.b.', i: 'cumino, paprika, limone, sale' }],
      pasos: ['Ceci scolati con paprika, cumino e sale: forno 200° 20′ finché croccanti (batch).', 'Quinoa: sciacqua, 12′ nel doppio d’acqua, riposo coperta.', 'Componi la bowl: quinoa, ceci, verdure, hummus e limone.'],
      tips: 'I ceci arrostiti durano 5 giorni in barattolo: sono lo «spuntino» di questo piano.' },
    { id: 'pasta-lentejas-tempeh', slot: 'co', tags: [], nombre: 'Pasta di lenticchie con tempeh al pomodoro', tipo: 'Pranzo · 20′', tiempo: '20′', cocina: 'Pentola + padella',
      macros: { kcal: 665, p: 46, g: 26, c: 67 },
      ing: [{ pid: 'pasta-lentejas', q: '80 g', i: 'pasta di lenticchie rosse (senza glutine)' }, { pid: 'tempeh', q: '120 g', i: 'tempeh a cubetti' }, { pid: 'tomate-triturado', q: '200 g', i: 'passata di pomodoro' }, { pid: 'cebolla', q: '80 g', i: 'cipolla' }, { pid: 'ajo', q: '1 spicchio', i: 'aglio' }, { pid: 'aove', q: '10 g', i: 'olio EVO' }, { pid: 'especias', q: 'q.b.', i: 'basilico, origano, sale' }],
      pasos: ['Pasta di lenticchie 7-8′ (scuoce in fretta: assaggia prima del tempo indicato).', 'Tempeh dorato nell’olio 4′; cipolla e aglio altri 3′.', 'Pomodoro, origano e sale, 5′; unisci pasta e basilico.'],
      tips: 'Il tempeh migliora molto se lo cuoci 8′ al vapore prima di dorarlo: perde l’amaro.' },
    { id: 'tortilla-garbanzo', slot: 'ce', tags: [], nombre: 'Frittata di farina di ceci con zucchine', tipo: 'Cena · 20′', tiempo: '20′', cocina: 'Padella',
      macros: { kcal: 460, p: 20, g: 16, c: 62 },
      ing: [{ pid: 'harina-garbanzo', q: '80 g', i: 'farina di ceci (senza glutine)' }, { pid: 'calabacin', q: '200 g', i: 'zucchine a fettine sottili' }, { pid: 'cebolla', q: '80 g', i: 'cipolla' }, { pid: 'aove', q: '10 g', i: 'olio EVO' }, { pid: 'lechuga', q: '100 g', i: 'insalata verde' }, { pid: 'especias', q: 'q.b.', i: 'sale, pepe, curcuma' }],
      pasos: ['Mescola la farina con 160 ml d’acqua, sale e curcuma; riposo 10′.', 'Zucchine e cipolla 8′ a fuoco medio finché tenere.', 'Versa la pastella sopra, coperchio, 5′ per lato. Insalata accanto.'],
      tips: 'È la vera «frittata senza uova»: rapprende uguale e regge fredda da portare.' },
    { id: 'crema-calabaza-tofu', slot: 'ce', tags: [], nombre: 'Vellutata di zucca con edamame e tofu alla piastra', tipo: 'Cena · 25′', tiempo: '25′', cocina: 'Pentola + piastra',
      macros: { kcal: 590, p: 41, g: 24, c: 38 },
      ing: [{ pid: 'calabaza', q: '300 g', i: 'zucca a cubetti' }, { pid: 'edamame', q: '100 g', i: 'edamame sgranati (surgelati)' }, { pid: 'tofu', q: '150 g', i: 'tofu compatto a fette' }, { pid: 'cebolla', q: '60 g', i: 'cipolla' }, { pid: 'aove', q: '10 g', i: 'olio EVO' }, { pid: 'pipas', q: '10 g', i: 'semi di zucca' }],
      pasos: ['Cipolla e zucca in 5 g d’olio 3′; copri a filo d’acqua, 15′ e frulla.', 'Edamame 4′ in acqua bollente; scola e unisci alla vellutata.', 'Tofu alla piastra con l’olio restante, 3′ per lato. Semi sopra.'],
      tips: 'Senza panna né patata: la zucca frullata è cremosa da sola.' },
    { id: 'ensalada-quinoa-alubias', slot: 'ce', tags: [], nombre: 'Insalata tiepida di quinoa, fagioli neri e avocado', tipo: 'Cena · 15′', tiempo: '15′', cocina: 'Pentola + senza cottura',
      macros: { kcal: 610, p: 25, g: 21, c: 82 },
      ing: [{ pid: 'quinoa', q: '40 g', i: 'quinoa cruda' }, { pid: 'alubias', q: '200 g', i: 'fagioli neri cotti' }, { pid: 'aguacate', q: '80 g', i: 'avocado' }, { pid: 'tomate', q: '100 g', i: 'pomodoro' }, { pid: 'cebolla', q: '20 g', i: 'cipolla rossa' }, { pid: 'cilantro', q: 'q.b.', i: 'coriandolo' }, { pid: 'aove', q: '5 g', i: 'olio EVO' }, { pid: 'especias', q: 'q.b.', i: 'lime, cumino, sale' }],
      pasos: ['Quinoa 12′ nel doppio d’acqua; scola.', 'Fagioli scolati e sciacquati, nella quinoa ancora tiepida.', 'Avocado, pomodoro, cipolla e coriandolo; condisci con lime, cumino e olio.'],
      tips: 'Si porta al lavoro senza problemi: l’avocado, tagliato all’ultimo.' },
    { id: 'bolonesa-soja', slot: 'ce', tags: [], nombre: 'Ragù di soia granulare con spaghetti di zucchine', tipo: 'Cena · 20′', tiempo: '20′', cocina: 'Padella',
      macros: { kcal: 445, p: 37, g: 13, c: 47 },
      ing: [{ pid: 'soja-text', q: '60 g', i: 'soia granulare fine (secca)' }, { pid: 'tomate-triturado', q: '250 g', i: 'passata di pomodoro' }, { pid: 'calabacin', q: '300 g', i: 'zucchine a spirale o a striscioline' }, { pid: 'cebolla', q: '50 g', i: 'cipolla' }, { pid: 'zanahoria', q: '40 g', i: 'carota' }, { pid: 'ajo', q: '1 spicchio', i: 'aglio' }, { pid: 'aove', q: '10 g', i: 'olio EVO' }, { pid: 'especias', q: 'q.b.', i: 'origano, paprika, sale' }],
      pasos: ['Reidrata la soia 10′ in acqua calda con un pizzico di sale; scola bene.', 'Soffritto 5′; soia scolata 3′ a fuoco vivo; pomodoro e origano, 8′.', 'Zucchine 2′ in una padella a parte (così non rilasciano acqua). Ragù sopra.'],
      tips: 'La soia granulare ha 50 g di proteine per 100 g secca: il «macinato» più economico che esista.' }
  ];

  /* ---------- LISTA DELLA SPESA (settimana tipo) ---------- */
  const COMPRA = [
    { cat: 'Proteine', items: [
      { q: '1,4 kg', i: 'petto di pollo' },
      { q: '400 g', i: 'manzo magro a striscioline' },
      { q: '500 g', i: 'nasello o branzino (2 porzioni)' },
      { q: '350 g', i: 'salmone (2 filetti)' },
      { q: '300 g', i: 'gamberi sgusciati surgelati' },
      { q: '4 lattine', i: 'tonno al naturale' },
      { q: '18 pz', i: 'uova M (una dozzina e mezza)' },
      { q: '14 pz (250 g l\'uno)', i: 'skyr o quark magro 0% (7 colazioni/dessert + 7 spuntini serali)' },
      { q: '1 barattolo (dura ~1 mese)', i: 'whey (1 misurino al giorno nello spuntino serale)' }
    ]},
    { cat: 'Carboidrati', items: [
      { q: '500 g', i: 'riso' },
      { q: '2 kg', i: 'patate' },
      { q: '400 g', i: 'pane integrale (filone grande o in cassetta)' },
      { q: '500 g', i: 'avena' },
      { q: '2 barattoli (400 g sgocciolato l\'uno)', i: 'lenticchie già cotte' }
    ]},
    { cat: 'Verdura e frutta', items: [
      { q: '5 pz', i: 'peperoni' },
      { q: '4 pz', i: 'cipolle (+1 rossa)' },
      { q: '2 pz', i: 'zucchine' },
      { q: '2 pz', i: 'broccoli' },
      { q: '8 pz', i: 'pomodori (2 da grattugiare)' },
      { q: '2 buste', i: 'lattuga o songino' },
      { q: '500 g', i: 'carote' },
      { q: '12-14 pezzi', i: 'frutta: banane ×5, mele ×4-5, arance ×4' }
    ]},
    { cat: 'Dispensa', items: [
      { q: '—', i: 'olio EVO' },
      { q: '200 g', i: 'noci' },
      { q: '1 barattolo', i: 'olive' },
      { q: '1 bottiglia', i: 'salsa di soia' },
      { q: '3 pz', i: 'limoni' },
      { q: '—', i: 'spezie: paprika, aglio in polvere, cumino, origano, cannella' },
      { q: '—', i: 'sale, aceto, brodo' }
    ]}
  ];

  /* ---------- MEAL PREP DELLA DOMENICA (~90′) ---------- */
  const MEALPREP = [];

  /* ---------- MENÙ SETTIMANALE ---------- */
  const MENU = [
    { d: 'Lun', de: 'bol-skyr', co: 'pollo-asado', ce: 'merluza-patata' },
    { d: 'Mar', de: 'tortilla-pan', co: 'lentejas-pollo', ce: 'ensalada-atun' },
    { d: 'Mer', de: 'bol-skyr', co: 'salteado-ternera', ce: 'revuelto-gambas' },
    { d: 'Gio', de: 'tortilla-pan', co: 'pollo-asado', ce: 'salmon-arroz' },
    { d: 'Ven', de: 'bol-skyr', co: 'lentejas-pollo', ce: 'merluza-patata' },
    { d: 'Sab', de: 'tortilla-pan', co: 'LIBRE', ce: 'ensalada-atun' },
    { d: 'Dom', de: 'bol-skyr', co: 'salteado-ternera', ce: 'revuelto-gambas' }
  ];

  /* ---------- MONITORAGGIO ---------- */
  const CHECKPOINTS = [];
  const FOTOS = ['2026-08-17', '2026-09-13', '2026-10-11', '2026-11-08'];

  /* ---------- TRAGUARDI ---------- */
  // tipo: sesion | racha | peso | cintura | disco | pr | especial
  const LOGROS = [
    { id: 'primera',        icon: '⚡', nombre: 'Giorno uno',         desc: 'Prima sessione completata. Hai già fatto la parte più difficile.' },
    { id: 'sesiones-10',    icon: '🔟', nombre: 'Dieci su dieci',     desc: '10 sessioni di pesi completate.' },
    { id: 'sesiones-25',    icon: '🎯', nombre: 'Venticinque',        desc: '25 sessioni di pesi. Questa ormai è un\'abitudine.' },
    { id: 'sesiones-50',    icon: '🏛️', nombre: 'Cinquanta',          desc: '50 sessioni. Territorio di un\'altra persona.' },
    { id: 'semana-perfecta',icon: '💎', nombre: 'Settimana perfetta', desc: 'Tutte le sessioni di pesi di una settimana.' },
    { id: 'minimo-3',       icon: '🛡️', nombre: 'Il pavimento regge', desc: '3 settimane di fila rispettando almeno il minimo (2 pesi + 1 cardio).' },
    { id: 'racha-7',        icon: '🔥', nombre: 'Striscia da 7',      desc: '7 giorni di piano di fila, fatti.' },
    { id: 'racha-14',       icon: '🔥', nombre: 'Striscia da 14',     desc: '14 giorni di piano di fila. Ormai è un’abitudine.' },
    { id: 'racha-30',       icon: '🌋', nombre: 'Striscia da 30',     desc: '30 giorni di piano di fila. Inarrestabile.' },
    { id: 'pasos-7',        icon: '👟', nombre: 'Settimana in cammino', desc: '7 giorni di fila raggiungendo i passi.' },
    { id: 'disco-10',       icon: 'disc10', nombre: 'Disco da 10',    desc: 'Fase 1 completata. L\'abitudine è tornata.', disco: true },
    { id: 'disco-15',       icon: 'disc15', nombre: 'Disco da 15',    desc: 'Fase 2 completata. Ormai sei dentro la palestra.', disco: true },
    { id: 'disco-20',       icon: 'disc20', nombre: 'Disco da 20',    desc: 'Fase 3 completata. Il carico vero ormai è tuo.', disco: true },
    { id: 'disco-25',       icon: 'disc25', nombre: 'Disco da 25',    desc: 'Fase 4 completata. Collezione completa.', disco: true },
    { id: 'kg-2', icon: '', nombre: '', desc: '' },
    { id: 'cintura-95', icon: '', nombre: '', desc: '' },
    { id: 'pr-1',           icon: '🥇', nombre: 'Primo PR',           desc: 'Prima volta che superi il tuo miglior massimale in un esercizio.' },
    { id: 'pr-5',           icon: '🥇', nombre: '5 PR',               desc: 'Cinque record personali battuti.' },
    { id: 'pr-15',          icon: '🏆', nombre: '15 PR',              desc: 'Quindici PR. La memoria muscolare che paga i dividendi.' },
    { id: 'dominada-libre', icon: '🦍', nombre: 'Trazione libera',    desc: 'Prima trazione senza assistenza. Di nuovo nel club.' },
    { id: 'mealprep-4',     icon: '🍱', nombre: 'Chef della domenica', desc: '4 domeniche di fila di meal prep.' },
    { id: 'comeback',       icon: '🔁', nombre: 'Il ritorno',         desc: 'Di ritorno dopo 4 o più giorni di stop. Tornare conta più che cadere.' },
    { id: 'fotos-4',        icon: '📸', nombre: 'La sequenza',        desc: 'Tutte e 4 le foto di progresso fatte.' },
    { id: 'checkpoint-s4',  icon: '✅', nombre: 'Checkpoint S4',      desc: '' },
    { id: 'checkpoint-s8',  icon: '✅', nombre: 'Checkpoint S8',      desc: '' },
    { id: 'plan-completo',  icon: '🏁', nombre: 'BACK2PRIME',         desc: '' }
  ];

  /* ---------- LA SCIENZA DEL PIANO (revisione dell'evidenza · ago 2026) ---------- */
  const CIENCIA = {
    intro: 'Piano rivisto contro l’evidenza (meta-analisi e trial 2010-2025). L’idea che mette in ordine tutto: chi torna non è un principiante. Muscolo e sistema nervoso rientrano in fretta; il tendine non ha memoria e detta il ritmo.',
    temas: [
      { t: 'Memoria muscolare', d: 'Il recupero è reale e rapido: forza in ~8 settimane, volume in ~12. Il meccanismo è in discussione; l’effetto no. Per questo la doppia progressione può andare più veloce che in un principiante, e proprio per questo non si comprime il calendario: il tendine non corre.', ref: 'Rahmati 2022 (meta-analisi, J Cachexia Sarcopenia Muscle) · Cumming 2024 (J Physiol)' },
      { t: 'Tendine: il fattore limitante', d: 'Il collagene del tendine si rinnova ~10× più lentamente del muscolo. Lo adattano carichi alti con contrazioni lente da ~3″ (HSR) e isometrie al 70% (5×45″), che in più tolgono il dolore all’istante. I salti sono un cattivo stimolo: niente pliometria per «preparare» la corsa.', ref: 'Mersmann 2017 (Front Physiol) · Rio 2015 (BJSM) · Kongsgaard (HSR)' },
      { t: 'Correre in sovrappeso', d: 'In sovrappeso, partire con più di 3 km/sett di corsa fa schizzare gli infortuni (~31-48% in più). Alzare la cadenza a 170-180 riduce l\'impatto tibiale di ~11%. La progressione sicura non è la "regola del 10%": è non superare ~1,3× la tua media delle ultime 4 settimane.', ref: 'Bertelsen 2018 (RCT su principianti in sovrappeso) · revisione sulla cadenza 2025 · consenso CIO sul carico' },
      { t: 'Deficit ottimale', d: 'Un deficit oltre ~500-600 kcal annulla la crescita del muscolo anche se alleni la forza. Il ritmo ottimale per trattenere massa magra è ~0,7% del peso/settimana. Per questo il piano perde a 0,6-0,75 kg/sett e non a 0,9.', ref: 'Murphy & Koehler 2022 (meta-analisi, 59 studi) · Garthe 2011' },
      { t: 'Proteine', d: 'In deficit, gli allenati hanno bisogno di 2,3-3,1 g/kg di massa magra. {p} g ti mettono comodo nel range, e dividerli in 4 pasti da ≥40 g spreme la sintesi proteica e controlla la fame.', ref: 'Helms 2014 (revisione sistematica) · Schoenfeld & Aragon (distribuzione per pasto)' },
      { t: 'Diet break', d: 'Alternare deficit e pause a mantenimento ha attenuato il calo metabolico e migliorato la perdita di grasso (studio MATADOR). In {s} settimane il suo valore è un altro: ti insegna che fermarti una settimana con un piano non è ricadere.', ref: 'Byrne 2018 (Int J Obesity, MATADOR)' },
      { t: 'Il volume giusto', d: 'Più serie, più muscolo, con rendimenti decrescenti; in deficit l’eccesso aggiunge solo fatica e rischio. Bersaglio: ~10 serie per muscolo a settimana in F2, 12-18 in F3-F4. Il minimo (2 pesi + 1 cardio) conserva muscolo davvero.', ref: 'Pelland 2025 (Sports Medicine) · Androulakis-Korakakis 2020 (dose minima)' },
      { t: 'Scarico fatto bene', d: 'Fermarsi del tutto per una settimana costa forza; quello che funziona è metà volume con lo stesso peso. Per questo lo scarico è obbligatorio e di quel tipo.', ref: 'Coleman 2024 (PeerJ, RCT sullo scarico)' },
      { t: 'Sonno', d: 'Dormire 5,5 h in deficit (contro 8,5) ha ridotto il grasso perso del 55% e moltiplicato la perdita di muscolo. Dopo proteine e deficit, è la tua leva più grande. Da lì il taglio della caffeina alle 13-14.', ref: 'Nedeltcheva 2010 (Ann Intern Med) · Gardiner 2023 (Sleep Med Rev)' },
      { t: 'Prima la salute', d: 'Dopo anni fermo, prima del lavoro duro di F3-F4: pressione arteriosa e pannello base (lipidi, glucosio/HbA1c). Con qualsiasi sintomo, medico prima di continuare.', ref: 'ACSM Preparticipation Health Screening' }
    ]
  };


  const AVISO_LEGAL = 'Il piano nasce dalle tue risposte con formule standard (Mifflin-St Jeor e fattori di attività) e un margine del ±10% che le regole di aggiustamento correggono con i tuoi dati. Non sostituisce il parere medico: per patologia, dolore persistente o dubbio, rivolgiti a un professionista sanitario.';

  /* ---------- TESTI DI INTERFACCIA (traducibili come il resto) ----------
     Template con {x}: app.js li riempie con tpl(). Al cambio di lingua
     si carica assets/data.<lang>.js, che sostituisce TUTTO window.B2P.   */
  const UI = {
    // figuras.js: la leyenda de peso, las etiquetas del plato y el extra por fase
    pLeyenda: ['pesate', 'media settimanale', 'corridoio'],
    platoLbl: { v: 'Verdura', p: 'Proteine', c: 'Carboidrati', g: 'Olio', mano: 'palmo e mezzo', puno: 'un pugno', cuchara: 'un cucchiaio' },
    nExtra: ['—', '+1 frutto e 40 g di pane nei giorni di allenamento', 'uguale, tutti i giorni'],
    lang: 'it',
    tabs: ['Oggi', 'Piano', 'Esercizi', 'Cibo', 'Progressi', 'Traguardi'],
    dias: ['lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica'],
    diasIni: ['L', 'M', 'M', 'G', 'V', 'S', 'D'],
    calComidas: 'I pasti del giorno',
    meses: ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'],
    hoyTag: 'OGGI',
    semanaLinea: 'Settimana {w}/{t} · Fase {f} · {n} · RPE max {r}',
    empiezaEnDias: 'Parte tra {n} giorni', empiezaEn1: 'Parte tra 1 giorno', empiezaLunes: 'Parte lunedì',
    preplanSub: '{f} · Fase 1 a casa. Intanto, la linea di base:',
    prepCintura: 'Girovita a digiuno',
    prepFotos: 'Foto giorno 0: fronte e profilo, sempre la stessa luce',
    prepCompra: 'Spesa della settimana 1 (lista in Cibo)',
    prepBascula: 'Bilancia: lunedì, mercoledì e venerdì a digiuno, sempre uguale',
    practicaMenu: 'Il menù vale già da oggi; il {f} si fa sul serio.',
    descanso: 'Riposo', domingoPrep: 'Domenica: riposo + meal prep', planCompletado: 'Piano completato',
    calentamiento: 'Riscaldamento · 6′',
    sesionSub: '{d} · tocca un recupero per cronometrarlo',
    tendonNombre: 'Protocollo tendini',
    cardioHecho: '✓ Cardio fatto', cardioMarcar: 'Segna cardio fatto', minutosReales: 'Minuti reali:',
    cadenciaSub: 'Cadenza 170-180 · falcata corta', recuperacionSub: 'Recupero attivo', opcional: 'opzionale',
    tibialisAviso: 'Prima: tibialis raises 2×20 (protocollo tendini).',
    diaADia: 'Il giorno per giorno',
    hPasos: '8-10k passi', hPasosSub: 'Tutti i giorni',
    hProte: 'Proteine 4/4', hProteSub: '4 porzioni ≥{q} g',
    hPeso: 'Peso a digiuno', hPesoSub: 'Conta la media settimanale',
    hCintura: 'Girovita (lunedì)', hCinturaSub: 'La metrica regina',
    hPrep: 'Meal prep', hPrepSub: '~90′ e settimana sistemata',
    hFoto: 'Foto di progresso', hFotoSub: 'Fronte e profilo, stessa luce',
    pesoGuardado: 'Peso salvato: {v} kg', cinturaGuardada: 'Girovita: {v} cm',
    marcarHecho: 'Segna come fatto', usarPeso: 'Usa questo peso',
    diaAnterior: 'Giorno precedente', diaSiguiente: 'Giorno successivo',
    cerrarPanel: 'Chiudi', panelSinTitulo: 'Dettaglio',
    ajIdiomaSinRed: 'Offline: non è stato possibile scaricare quella lingua.',
    versionNueva: 'Nuova versione · tocca per aggiornare',
    quizAfinara: 'Questo affinerà il tuo piano.', quizTitulo: 'I tuoi gusti',
    quizSi: 'Mi piace', quizNo: 'Non fa per me', quizDeshacer: 'Annulla', quizSaltar: 'Salta',
    quizListo: 'Fatto',
    gen: { kcalHueco: 'Regola riso, pasta o pane del pasto principale per coprire la differenza.', kcalSube: 'ti mancano ~{d}', kcalBaja: 'sei sopra di ~{d}', chkDentro: 'nel corridoio', chkBajo: 'sotto', chkAlto: 'sopra', lChkD2: 'Peso dentro il corridoio alla settimana {s}.', tHombroT: 'Spalla · cuffia e dentato', tHombroD: 'Rotazione esterna con elastico 2×15 per lato e alzata a Y da sdraiato 2×12, lente, prima di ogni spinta e nei giorni liberi. La cuffia cresce col controllo, non col peso.', tHombroW: 'A casa con un elastico, o il manubrio più leggero che hai.', r2SinBarra: 'Prima ripetizioni nel range, poi carico: il salto più piccolo che hai (un manubrio in più, un elastico più duro, una variante più difficile), solo con tecnica pulita in tutte le serie. L’app te lo suggerisce.', protHueco: 'Fino ai tuoi {p} g di proteine, il ponte è una porzione extra: uno shake o una porzione in più.', finRecapT: 'Il tuo blocco, in numeri', subCorporal: 'Versione a corpo libero: arriva pulito al tetto delle ripetizioni, poi sali di variante.', subRepe: 'Secondo giro: senza attrezzatura non ci sono trenta varianti, e ripetere lo schema con tecnica pulita costruisce lo stesso.', f2nCasa: 'Ingresso in carico', f2oCasa: 'Fondamentali con manubri ed elastici, e base di carico: 65-70% di ciò che potresti, 3 ripetizioni vere di riserva.', f2nNada: 'Progressione a corpo libero', f2oNada: 'Progressioni col proprio corpo e base. Prima la leva, poi le ripetizioni: variante più dura solo con tecnica pulita.', gemNota: 'Il polpaccio lento è l’assicurazione del tendine: non saltarlo.', tendonSinTrote: 'La forza torna in settimane; il tendine chiede mesi: il suo collagene si rinnova ~10 volte più lento e non ha memoria. Questo blocco è l’assicurazione del piano, dalla settimana 1 all’ultima.', introNunca: 'Piano verificato contro l’evidenza (metanalisi e studi 2010-2025). L’idea che ordina tutto: da zero si progredisce in fretta (i primi mesi portano i maggiori guadagni di forza della vita), ma il tessuto connettivo resta indietro rispetto al muscolo. Per questo i carichi salgono piano anche quando potresti di più.', introActivo: 'Piano verificato contro l’evidenza (metanalisi e studi 2010-2025). L’idea che ordina tutto: chi già si allena non ha bisogno di più durezza, ma di una dose migliore. Volume giusto, progressione registrata e riposo contato separano mantenersi dal migliorare.', cNuncaT: 'Partire da zero', cNuncaD: 'Il primo anno porta i maggiori guadagni di forza della vita: quasi ogni dose ben fatta funziona, per questo i programmi estremi sono inutili. Prima la tecnica: le ripetizioni pulite di oggi sono i chili sicuri di fra tre mesi.', cNuncaR: 'guadagni da principiante: review ACSM e metanalisi dose-risposta', cActivoT: 'Aggiungere senza rompersi', cActivoD: 'Il rischio di chi già si allena è impilare volume nuovo sul vecchio. I salti oltre ~1,3× il tuo carico medio recente fanno esplodere gli infortuni: aggiungi una variabile alla volta (giorni, volume o intensità), mai tutte e tre.', cActivoR: 'consenso CIO sul carico di allenamento (ACWR)', cSupT: 'Un surplus che costruisce', cSupD: 'Per costruire muscolo basta un surplus piccolo (~250-350 kcal): oltre, l’extra va verso il grasso. La bilancia deve salire piano; se sale in fretta non è muscolo, perché la sintesi proteica ha un tetto settimanale.', cSupR: 'Garthe 2013 · Slater 2019 (surplus e composizione)', r1Nunca: 'Ogni fase ha il suo tetto. Da zero, la forza sale più in fretta della resistenza dei tuoi tessuti: lascia 2-3 ripetizioni vere di riserva e i guadagni arrivano lo stesso.', r1Activo: 'Ogni fase ha il suo tetto. Questo volume è nuovo anche se ti alleni: rispetta l’RPE le prime due settimane e poi sali. Frenare in tempo è ciò che ti fa progredire {s} settimane di fila.', r8Nunca: 'All’inizio il nemico non è la durezza, è l’irregolarità. Pavimento della settimana caotica: 2 forza + 1 cardio.', r8Activo: 'Anche chi si allena ha settimane impossibili. Pavimento: 2 forza + 1 cardio. Non si perde nulla; il resto si recupera.', f1nNunca: 'Fondamenta', f1oNunca: 'Abitudine e schemi di movimento, senza punire le articolazioni. Restare con la voglia è intenzionale.', f2nNunca: 'Tecnica', f2oNunca: 'Fondamentali con carico leggero: ogni ripetizione pulita adesso sono chili sicuri dopo. Sempre lontano dal cedimento.', f3oNunca: 'Volume e intensità sul serio, con la tecnica rodata. Chiudi ogni serie con 2 ripetizioni vere di riserva.', f1nActivo: 'Base', f1oActivo: 'Due settimane di adattamento: dose nota, registro in moto, tecnica affinata. Poi si sale.', f2nActivo: 'Costruzione', f2oActivo: 'Volume progressivo sulla tua base: 70-75% di ciò che potresti, 2-3 ripetizioni vere di riserva.', f3oActivo: 'Volume e intensità reali per forzare il cambiamento. Chiudi ogni serie con 2 ripetizioni vere di riserva.', cierrePerder: 'L’obiettivo non è il {f}: è arrivarci allenandoti per abitudine, senza ciclo on/off. Il peso che scende è la conseguenza.', cierreRecomp: 'L’obiettivo non è il {f}: è arrivarci con l’abitudine costruita e i vestiti che cadono diversi. Ricomporre è lento per disegno; la costanza è la meta.', cierreGanar: 'L’obiettivo non è il {f}: è arrivarci più forte e con l’abitudine costruita. Il muscolo si costruisce in mesi: il blocco successivo inizia dove finisce questo.', cierreManten: 'L’obiettivo non è il {f}: è che allenarsi smetta di essere un piano e diventi abitudine. Mantenere è vincere.', cierreRenueva: 'Per rinnovare il blocco: Impostazioni › Crea / rifai il mio piano.', platoVegetariano: '3 uova + 2 albumi, o 250 g di skyr o fiocchi di latte magri + whey, o 200 g di tofu sodo, o 150 g di tempeh, o 250 g di legumi cotti + 1 uovo.', platoVegano: '200-250 g di tofu sodo, o 150-180 g di tempeh, o 250 g di legumi cotti + un misurino di proteina vegetale, o 80 g (secchi) di soia testurizzata.', suplVegT: 'Proteina vegetale', suplVegD: '1 misurino di proteina di pisello o soia nella porzione pre-sonno, e un altro nei giorni corti di proteine.', numRecomp: 'Deficit dolce, ~300-450 kcal/giorno: ricomporre chiede pazienza.', numSup: 'Surplus ~250-350 kcal/giorno: di più non è più muscolo, è grasso.', numMan: 'Il tuo mantenimento stimato: la media settimanale giudica e aggiusta.', ritmoSubeT: 'Ritmo di salita atteso', ritmoManT: 'Ritmo atteso', ritmoSubeN: '≈0,25% del peso a settimana: ciò che il muscolo può costruire. Media settimanale.', ritmoManN: 'La media settimanale deve restare entro ±0,3 kg dalla partenza.', wjN1: 'Cammina-corri I', wjN2: 'Cammina-corri II', wjN3: 'Cammina-corri III', lChkN: 'Checkpoint S{s}', lChkD: 'Peso dentro il corridoio (o meglio) alla settimana {s}.', alRapidoBaja: 'Aggiungi 150 kcal di carboidrati. A questo ritmo il deficit si mangia anche il muscolo.', alLentoBaja: 'Controlla porzioni e passi per un paio di giorni. Se resta piatto, togli 100 kcal di carboidrati solo nei giorni di riposo.', alRapidoSube: 'Sali più in fretta di quanto si costruisca muscolo: taglia 150 kcal di carboidrati o l’extra sarà grasso.', alLentoSube: 'Il surplus non si vede sulla bilancia: aggiungi 150 kcal di carboidrati nei giorni di allenamento.', alMantenT: 'Ti stai spostando dal mantenimento', alMantenD: 'Due settimane di deriva di fila: aggiusta 100-150 kcal nella direzione opposta e non toccare l’allenamento.', circProg: 'Aggiungi 1-2 ripetizioni a settimana dove la tecnica resta pulita: è questa la progressione.', durAprox: '≈{m}′', splitFbC: 'Full Body', splitTpC: 'Busto · Gambe', splitPplC: 'Push · Pull · Legs', faseSub: '{s} ×{d}', nf1: 'F1–F2 (sett 1-{a})', nf2: 'F3 (sett {b}-{c})', nf3: 'F4 (sett {d}-{e})', dietBreakNota: 'Settimana {w}: diet break a ~{k} kcal', hitoCribadoT: 'Screening di salute', hitoCribadoD: 'Prima di caricare sul serio, se sei stato fermo per anni: pressione in farmacia e pannello base (lipidi, glucosio). 15 minuti.', hitoDietT: 'Diet break', hitoDietD: 'Settimana a mantenimento, ~{k} kcal: +2 porzioni di carboidrati al giorno. Proteine e allenamento invariati. Il lunedì dopo, di nuovo deficit.', hitoDescargaT: 'Scarico · obbligatorio', hitoDescargaD: 'Stessa routine, metà delle serie, stesso carico. Non è uno stop: riposano tendini e articolazioni senza perdere tessuto.', tomaNocheAlt: '+ ogni sera: porzione pre-sonno con proteina vegetale, ~40 g in shake. ', franjaM: 'Allenamento al mattino: colazione dopo, non prima.', franjaMd: 'Allenamento a mezzogiorno: il pasto principale va subito dopo.', franjaT: 'Allenamento la sera: qualcosa di leggero prima; la cena è il post-allenamento.', cardioLibreT: 'Cardio: {d}', cardioLibreD: '{m}′ a ritmo comodo e costante. Il tuo sport conta quanto la corsa.', chk1: 'Fuori dal corridoio: controlla porzioni e passi prima di toccare altro. All’inizio si muove anche l’acqua.', chk2: 'Due settimane fuori: aggiusta 150 kcal di carboidrati nella direzione giusta. Le proteine non si toccano.', chk3: 'Chiusura: foto, misure e il blocco successivo, deciso con i dati.', lKgN: '−{v} kg', lKgD: 'Media settimanale {v} kg sotto la partenza.', lKgUpN: '+{v} kg', lKgUpD: 'Media settimanale {v} kg sopra la partenza. Muscolo, mattone su mattone.', lCintN: 'Girovita −{v}', lCintD: 'Girovita sotto {v} cm.', lReinaN: 'Metrica regina', lReinaD: 'Girovita sotto la metà della tua statura: {v} cm.', lFinDesc: 'Piano di {s} settimane finito. L’obiettivo era l’abitudine; il resto è conseguenza.', marca: 'Piano generato per te', cuida: 'proteggi: {a}', datos: '{p} kg · {a} cm · {e} anni', menuAviso: '{n} piatti non quadrano con la tua dieta: sostituiscili con altri del ricettario, già filtrato.', prepNota: 'Solo le ricette segnate «batch» si cucinano la domenica; il resto, al momento. La spesa conta già le ripetizioni della settimana.' },
    pBarraT: 'Il bilanciere del piano', pBarraSub: '{a} dischi su {b} caricati',
    patrones: { eh: 'Spinta orizzontale', ev: 'Spinta verticale', th: 'Tirata orizzontale', tv: 'Tirata verticale', rod: 'Dominante di ginocchio', bis: 'Cerniera d’anca', zan: 'Affondo', core: 'Core stabile', flex: 'Flessione del tronco', curl: 'Flessione di gomito', ext: 'Estensione di gomito', gem: 'Polpaccio', ais: 'Isolamento' },
    quizCatEj: 'Esercizio', quizCatDep: 'Sport', quizCatCom: 'Piatto',
    alta: { t: 'Crea il tuo profilo', sub: 'Forza, cibo e progressi. Il tuo piano, in due minuti.', nombreL: 'Il tuo nome', ph: 'Come ti chiamiamo?', cta: 'Inizia', local: 'I tuoi dati vivono solo su questo dispositivo.', valNombre: 'Scrivi un nome da 2 a 24 caratteri.', idioma: 'Lingua' },
    rev: { evFecha: 'finisce il {b}, poco prima', evSinFecha: 'senza data: comanda l’orizzonte che hai scelto', minT: '{v} minuti a sessione', minSub: 'sessioni corte: i fondamentali restano', evT: 'Obiettivo: {e}', evSub: 'la data comanda: costanza più che perfezione', durOpen: 'Senza data: blocchi di {s} settimane, rinnovabili', t: '{n}, il tuo piano è pronto', tAnon: 'Il tuo piano è pronto', sub: 'Fatto con le tue risposte, non un modello.',
      splitT: 'Forza {d} giorni a settimana', splitFb: 'full body: quello che rende di più con pochi giorni', splitTp: 'busto / gambe, in coppie', splitPpl: 'spinta / tirata / gambe',
      kcalT: '{k} kcal al giorno', kDef: 'deficit di {v} kcal, senza regalare muscolo', kSup: 'surplus di {v} kcal per costruire muscolo', kMan: 'al tuo mantenimento, con le proteine al comando',
      protT: '{p} g di proteine al giorno', protSub: '{v} g per chilo di peso',
      durT: '{s} settimane davanti', durSub: 'dal {a} al {b}',
      subsT: '{n} esercizi sostituiti', subsSub: 'per la tua attrezzatura o i tuoi scarti',
      cuidaT: 'Attenzione extra: {a}', cuidaSub: 'gli esercizi coinvolti portano un avviso',
      menuT: 'Menù adattato alla tua tavola', menuSub: 'dieta e intolleranze applicate a tutta la settimana', menuAv: '{n} piatti non quadrano: segnalato in Cibo',
      gustosT: '{a} mi piace · {b} scarti', gustosSub: 'ciò che hai scartato resta fuori dal piano',
      cta: 'Vedi la mia settimana 1', micro: 'Rifai il questionario quando vuoi: tutto si ricalcola.' },
    tour: { salta: 'Salta', sigue: 'Avanti', listo: 'Ad allenarsi', otraVez: 'Rivedi il tour di benvenuto',
      antes: ['Il tuo piano è pronto', 'Fino al giorno che hai scelto, Oggi ti mostra i passi preliminari. Il menù è già pronto: inizia a fare la spesa.'],
      pasos: [
      ['Questo è OGGI', 'La tua sessione di oggi: esercizi, serie e recuperi. Toccane uno e vedi tecnica e muscolo.'],
      ['Il cibo di oggi', 'Colazione, pranzo, cena e porzione della sera, per il tuo obiettivo. Tocca un piatto: ricetta intera.'],
      ['Il tuo registro quotidiano', 'Peso, girovita e abitudini: un tocco ciascuno. Chiudi la giornata col pulsante in basso.'],
      ['Il piano intero', 'Ogni fase nel suo colore. Tocca un giorno: allenamento e pasti. Scorri per cambiare mese.'],
      ['Le quattro fasi', 'Ogni banda dice le sue settimane e l’intensità. Aprila: cosa insegue.'],
      ['La tua libreria di esercizi', 'Tutti i movimenti per zona: muscolo colorato, tecnica e cosa usare se manca l’attrezzatura.'],
      ['Il tuo obiettivo a tavola', 'Calorie e macro della fase, e quanto manca o avanza al menù. Il perché, in Il mio profilo.'],
      ['Ricettario', 'Colazioni, pranzi, cene e integratori filtrati per te, con foto, ingredienti e passaggi.'],
      ['La spesa della settimana', 'Tutto il necessario della settimana per reparto del super, con la foto di ogni prodotto. Spunta quello che hai già.'],
      ['Progressi onesti', 'Peso, girovita, carichi e costanza, in grafici. Vai troppo veloce? L’app ti frena.'],
      ['I tuoi distintivi', 'Si guadagnano con la costanza, non con l’intensità. Ognuno dice come si ottiene.'],
      ['Due bolle', 'La lente cerca esercizi, piatti e impostazioni. Il fumetto è per raccontarmi errori o idee.'],
      ['Il mio profilo', 'Le tue risposte, rifare il piano, condividerlo, esportare i dati, privacy e cancellare l’account.'] ] },
    cuest: {
      evFechaT: 'Che giorno è?', evFechaP: 'Il piano finisce poco prima. Senza data, comanda l’orizzonte.', evFechaSaltar: 'Non lo so ancora', evFechaMal: 'Scegli una data tra 2 e 12 mesi da oggi.', 
      resLObj: 'Obiettivo', resLEv: 'Per', resLDur: 'Orizzonte', resLHist: 'Vieni da', resLMat: 'Attrezzatura', resLDieta: 'Tavola', resLFranja: 'Fascia', resLLes: 'Riguardo', resLSin: 'Eviti', 
      gateT: 'La tua salute comanda', gateTxt: 'Hai indicato una condizione medica che limita l’esercizio. Prima di generare il piano, chiedi al tuo medico il via libera per forza {d} giorni a settimana.',
      gateGuardado: 'Le tue risposte restano salvate.', gateOk: 'Ho il via libera', gateSalir: 'Esci per ora',
      gateHoyT: 'In pausa, con un motivo', gateHoyTxt: 'Manca il via libera del tuo medico. Con quello, il piano si genera all’istante.', gateVolver: 'Riprendi il questionario',
      resCta: 'Genera il mio piano', resGen: 'Sto generando il tuo piano…',
      titulo: 'Il tuo piano, su misura', atras: 'Indietro', sigue: 'Continua',
      inicioT: 'Quando vuoi cominciare?', inicioP: 'Il piano si costruisce da quel giorno.', inicioHoy: 'Oggi', inicioSemana: 'Questa settimana', inicioLunes: 'Lunedì prossimo', inicioExacto: 'Un giorno preciso', inicioSemT: 'Che giorno di questa settimana?', inicioDiaT: 'Che giorno vuoi cominciare?', sexoT: 'Il tuo corpo', sexoP: 'Solo per calcolare le calorie.', sexoH: 'Uomo', sexoM: 'Donna', sexoX: 'Preferisco non dirlo',
      medidasT: 'Le tue misure', edadL: 'Età', alturaL: 'Altezza (cm)', pesoL: 'Peso (kg)', cinturaL: 'Girovita (cm) · opzionale',
      objT: 'Cosa cerchi?', objPerder: 'Perdere grasso', objRecomp: 'Ricomposizione: meno grasso, più muscolo', objGanar: 'Mettere muscolo', objMantener: 'Mantenermi',
      evT: 'Per cosa?', evBoda: 'Un matrimonio', evOpo: 'Un concorso', evVerano: 'Prova costume', evSiempre: 'Per sempre',
      durT: 'Quanto tempo ti dai?', dur3: '3 mesi', dur6: '6 mesi', dur12: '12 mesi', durAlways: 'Senza data: abitudine',
      histT: 'Da dove vieni?', histP: 'Cambia come parte il piano.', histNunca: 'Mai allenato', histRetoma: 'Torno dopo anni di stop', histActivo: 'Mi alleno ora',
      diasL: 'Giorni a settimana', minL: 'Minuti a seduta', franjaT: 'Quando preferisci?', franjaM: 'Mattina', franjaMd: 'Mezzogiorno', franjaT2: 'Sera',
      matT: 'Con che attrezzatura?', matNada: 'Niente', matCasa: 'Casa: manubri ed elastici', matGym: 'Palestra completa',
      lesT: 'Fastidi o infortuni?', lesRodilla: 'Ginocchio', lesHombro: 'Spalla', lesLumbar: 'Lombare', lesNo: 'Nessuno',
      medT: 'Qualche condizione medica che limita l’esercizio?', si: 'Sì', no: 'No',
      dietaT: 'La tua tavola', dietaNormal: 'Mangio di tutto', dietaVegetariano: 'Vegetariano', dietaVegano: 'Vegano',
      sinT: 'Eviti qualcosa?', sinGluten: 'Glutine', sinLactosa: 'Lattosio', sinFrutos: 'Frutta a guscio', sinNada: 'Niente',
      resT: 'Il tuo profilo è pronto', resP: 'Da qui nasce il tuo piano.',
      resGustos: '{a} mi piace · {b} scartati', resProfesional: 'Una delle tue risposte chiede di parlare prima con un professionista della salute.',
      resGuardar: 'Salva profilo', resGuardado: 'Profilo salvato',
      valNum: 'Controlla {c}: tra {a} e {b}.'
    },
    gPeso: 'Grafico del peso corporeo', gCintura: 'Grafico del girovita',
    gCargas: 'Grafico dei carichi', gAdherencia: 'Grafico di aderenza settimanale',
    gRango: '{n} rilevazioni, da {a} a {b} {u}', gUnico: '1 rilevazione, {a} {u}',
    gSemanas: '{n} di {t} settimane con dati',
    gSinDatos: 'ancora nessun dato',
    valFuera: 'Inserisci un valore tra {a} e {b} {u}.', descargaDosis: 'scarico',
    hechosDe: 'Fatti {a} su {b} · da {c} conta come sessione',
    cerrarSinSesion: 'Chiudi senza sessione', diaCerradoSinRacha: '✓ Giornata chiusa',
    sinRachaHoy: 'Oggi non conta per la serie.', mejorRachaNota: 'Il tuo record: {n} giorni.',
    sinSesionToast: 'Giornata chiusa senza sessione: oggi non conta.',
    reabrirDia: 'Riapri la giornata', diaReabierto: 'Giornata riaperta', mejorLbl: 'Record',
    cerrarDia: 'Chiudi la giornata', diaCerradoBtn: '✓ Giornata chiusa · striscia {n}',
    diaCerradoToast: '✓ Giornata chiusa. Striscia: {n}', diaCerradoSolo: 'Giornata chiusa.',
    sigueEditando: 'Si salva da solo; puoi continuare a modificare.',
    comidaHoy: 'Il cibo di oggi', comidaHoySub: '{kcal} kcal · {p} g di proteine in 4 pasti',
    desayuno: 'Colazione', comidaLbl: 'Pranzo', cena: 'Cena', presueno: 'Pre-nanna',
    secCompra: { fresco: 'Freschi', prote: 'Proteine', lacteo: 'Latticini e bevande', despensa: 'Dispensa', congelado: 'Surgelati', supl: 'Integratori' }, despensaTag: 'dispensa',
    comidaLibreMn: 'PASTO LIBERO', comidaLibreTitulo: 'Pasto libero', comidaLibreTag: 'un pasto, non un giorno', tuya: 'tuo',
    dietBreakChip: 'Diet break: +2 porzioni di carboidrati oggi. Proteine uguali.',
    extraChip: 'Extra F{f}: +1 frutto e 40 g di pane a pranzo.', sugRepite: '↻ ripeti {v}',
    repsAMediasToast: 'Segnato: reps mancate (ripeterai il peso)', repsLimpiasToast: 'Tutte le reps pulite',
    repsAMediasTag: 'reps a metà', repsLimpias: 'reps pulite', repsCortas: 'reps mancate',
    prToast: 'PR in {e}: {v} kg', ya: 'ORA!',
    fHistorial: 'Il tuo storico', fMejor: 'migliore {v} kg',
    fComo: 'Come si fa', fErrores: 'Errori tipici', fAlt: 'Alternative',
    fVideo: 'Guarda la tecnica in video',
    fDomiBtn: 'Oggi è uscita la mia prima trazione senza aiuto', fDomiOk: 'Registrata', fDomiYa: 'Trazione libera già registrata',
    vReglas8: 'Le 8 regole', vReglasSub: 'nel dubbio, vince la regola',
    vCalendario: 'Calendario',
    vSeguros: 'Le assicurazioni del piano', libDescartado: 'scartato', libSinMaterial: 'senza attrezzatura', libFuera: 'fuori dal tuo piano', vBiblioteca: 'Libreria degli esercizi', vTocaCualquiera: 'toccane uno qualsiasi',
    vCiencia: 'La scienza del piano',
    senalesTitulo: 'Segnali per fermarsi', objetivoReal: 'Il vero obiettivo', recuerda: 'Ricorda',
    fase: 'Fase', sem: 'Sett', fuerzaLbl: 'Pesi',
    zonas: { empuje: 'Spinta', tiron: 'Tirata', pierna: 'Gambe e anca', core: 'Core' },
    chipsNutri: ['Obiettivo', 'Il piatto', 'Ricette', 'Menù', 'Spesa', 'Meal prep', 'Integratori'],
    nObjetivo: 'Il tuo obiettivo adesso', nSemana: 'settimana {w}',
    nNumeros: 'Da dove escono i numeri', nPlato: 'Come montare ogni pasto',
    nRecetario: 'Ricettario', nToca: 'tocca per cucinare',
    nCompra: 'La spesa della settimana', nPrepDom: 'Meal prep della domenica', nSupl: 'Integratori',
    nReiniciar: 'ricomincia', nProteLbl: 'Prote', nGrasaLbl: 'Grassi', nCarbosLbl: 'Carbo', kcalLbl: 'kcal', nMenuLbl: 'menù',
    nDietBreakTitulo: 'Questa settimana: diet break', nDietBreakTxt: '~{k} kcal: +2 porzioni di carboidrati al giorno. Proteine invariate. Allenamento invariato.',
    nTomaNota: '+ ogni sera: spuntino pre-nanna (skyr + whey). ',
    nIngredientes: 'Ingredienti (1 porzione)', nPasos: 'Passaggi', opcionalParen: ' (opzionale)',
    chipsProg: ['Riepilogo', 'Peso', 'Girovita', 'Carichi', 'Settimane', 'Checkpoint'],
    pPeso: 'Peso', pPerdido: 'Perso', pGanado: 'Guadagnato', pCintura: 'Girovita', pAdh: 'Aderenza', pSesiones: 'Sessioni', pRacha: 'Striscia',
    pMediaS: 'media S{w}', pSinDatos: 'niente dati', pDesde: 'da {v}', pCinturaSub: '{f} · meta <{m}', pCinturaLunes: 'lunedì a digiuno',
    pFuerzas: '{a}/{b} pesi', pDeFuerza: 'di pesi', pDiasCumplidos: 'giorni chiusi',
    pPesoTitulo: 'Peso',
    pCinturaTitulo: 'Girovita', pCinturaTituloSub: 'la metrica regina · obiettivo <{m} cm',
    pCargas: 'Carichi', pCargasSub: 'kg per sessione',
    pAdhTitulo: 'Aderenza', pAdhSub: 'sessioni di pesi fatte a settimana',
    pChk: 'Checkpoint', pEsperado: 'Atteso', pReal: 'Reale', pSiDesvias: 'Se sbandi',
    pTabla: 'tabella', pGrafica: 'grafico', pFecha: 'Data',
    pLifts: { 'press-banca': 'Panca', 'sentadilla-barra': 'Squat', 'rdl-barra': 'Rumeno' }, pMeta91: 'meta {m}', pAguaCreatina: 'acqua (prime settimane)', pLineaBase: 'Linea di base',
    pMediaSemana: 'Media S{w}',
    pVacioPeso: 'Qui andranno le pesate di lunedì, mercoledì e venerdì.',
    pVacioCintura: 'Ogni lunedì a digiuno',
    pVacioCargas: 'Registra dei kg in questo esercizio e qui vedrai la scalata.',
    pVacioAdh: 'Settimana dopo settimana, qui si vedrà la tua costanza',
    pCheckpointSemana: 'Settimana di checkpoint', pEsperadoRango: 'Atteso: {a}–{b} kg', pLlevas: ' · sei a {v}', pSinPesajes: ' · ancora nessuna pesata questa settimana',
    pRapido: 'Stai andando troppo veloce', pLento: 'Più lento del previsto',
    pFrenaTrote: 'Frena la corsa', pFrenaTxt: 'Questa settimana corri {r}× la tua media recente. Sopra 1,3× il rischio di infortunio schizza: taglia o cammina.',
    lDiscos: 'La collezione di dischi', lDiscosSub: 'uno per ogni fase completata',
    lLogros: 'Traguardi', lFuerzas: 'Pesi', lPRs: 'PR', lPerdido: 'Perso', lMejorRacha: 'Miglior striscia', lLogrosN: 'Traguardi', lFotos: 'Foto',
    perfilCinturaAdd: '+ Aggiungi girovita', perfilCinturaNota: 'Sarà la tua linea di base e attiva la meta e i traguardi di girovita. Il piano non cambia.', cerrarSesion: 'Esci', cerrarSesionNota: 'Piano e registri restano su questo dispositivo.', rehacerSub: 'Cosa vuoi rifare?', rehacerTodo: 'Questionario completo', rehacerTodoSub: 'Dati e gusti, da cima a fondo.', rehacerDatos: 'Solo i miei dati', rehacerDatosSub: 'Età, obiettivo, giorni, attrezzatura… Il mazzo non si tocca.', rehacerGustos: 'Solo i miei gusti', rehacerGustosSub: 'Il mazzo di carte, da zero.', perfilDetrasT: 'Dietro il piano', buscarT: 'Cerca nell’app', buscarPH: 'Esercizio, piatto, sezione…', buscarNada: 'Niente con questo nome. Prova un’altra parola.', perfilT: 'Il mio profilo', perfilDatosT: 'Le tue risposte', perfilPlanT: 'Il tuo piano, in breve', ajustes: 'Impostazioni', ajustesSub: 'I tuoi dati vivono solo su questo dispositivo.', ajGuardar: 'Salva linea di base', ajGuardado: 'Salvato',
    ajCopia: 'Copia di sicurezza',
    ajCopiaTxt: 'I dati non escono dal telefono. Fai una copia ogni tanto, o prima di cambiare dispositivo.',
    ajExportar: 'Esporta', ajImportar: 'Importa', ajImportOk: 'Copia ripristinata', ajImportErr: 'Quel file non sembra una copia di BACK2PRIME',
    ajIdioma: 'Lingua', ajIdiomaNota: 'L\'app si ricarica al cambio. I tuoi dati non si toccano.',
    ajRehacer: 'Crea / rifai il mio piano', ajRehacerNota: 'Torni al questionario. I tuoi registri giornalieri non si toccano.', ajBorrar: 'Elimina profilo e tutti i dati', ajBorrarConfirma: 'Sicuro? Tocca di nuovo per cancellare tutto',
    celebraOk: 'Avanti',
    navAria: 'Navigazione principale',
    pPrivacidad: 'Informativa sulla privacy',
    rep: { t: 'Segnala', sub: 'Qualcosa non va o hai un’idea? Scrivimelo.', bug: 'Qualcosa non va', idea: 'Un’idea', otro: 'Altro', txtL: 'Raccontami', ph: 'Cos’è successo? Dimmi la schermata e cosa ti aspettavi.', enviar: 'Invia', gracias: 'Ricevuto, grazie.', corto: 'Scrivi qualcosa in più perché si capisca.', repRitmo: 'Aspetta un minuto prima di inviarne un altro.', errRed: 'Non si è potuto inviare: controlla la connessione.', adjunta: 'Si allegano versione, piattaforma, lingua e schermata. Niente del tuo piano né dei tuoi registri.' },
    nube: { correoL: 'E-mail', claveL: 'Password (minimo 8)', verClave: 'Mostra la password', ocultarClave: 'Nascondi la password', previoT: 'Piano precedente su questo dispositivo', previoTxt: 'Questo dispositivo conserva un piano di prima degli account. Non si carica da solo, nel caso non sia tuo. Se lo è, portalo: sostituirà quello attuale.', previoCta: 'Portare quel piano', previoOk: 'Piano recuperato', entrar: 'Entra', crear: 'Crea account', aCrear: 'Prima volta? Crea il tuo account', aEntrar: 'Hai già un account? Entra', olvide: 'Ho dimenticato la password', enviadoReset: 'E-mail inviata: apri il link per cambiarla', nuevaClaveT: 'Scegli una password nuova', guardarClave: 'Salva password', cambiada: 'Password cambiata: ora puoi entrare', confirmaCorreo: 'Conferma l’account dalla posta ed entra da qui', yaExiste: 'Quella e-mail ha già un account: entra con la tua password', errCred: 'E-mail o password sbagliate', errCorreo: 'Scrivi una e-mail valida', errClaveCorta: 'Minimo 8 caratteri', errRitmo: 'Troppi tentativi di fila: aspetta un momento', errRed: 'Nessuna connessione col server: riprova', local: 'Il tuo piano va col tuo account su qualsiasi dispositivo. Lo vedi solo tu.', ajustesSub: 'Il tuo piano vive nel tuo account. Lo vedi solo tu.', cerrarSesionNota: 'Il piano resta nel tuo account. Quando rientri, riprendi da dove eri.' },
    comp: { t: 'Condividere il mio piano', nota: 'Link pubblico di sola lettura al tuo piano. Senza peso né registri.', copiado: 'Link copiato', quitar: 'Smettere di condividere', quitado: 'Link disattivato', vT: 'Il piano di {n}', vSub: 'Generato con BACK2PRIME', vCta: 'Fatti il tuo', noExiste: 'Quel link non esiste o il suo proprietario l’ha disattivato', sem: '{s} settimane', dias: '{d} giorni/settimana' },
    nuevoDia: 'Nuovo giorno: {f}'
  };


    const QUIZ_DEP = [{ id: 'running', n: 'Corsa' }, { id: 'natacion', n: 'Nuoto' }, { id: 'ciclismo', n: 'Ciclismo' }, { id: 'padel', n: 'Padel' }, { id: 'futbol', n: 'Calcio' }, { id: 'baloncesto', n: 'Basket' }, { id: 'volley', n: 'Pallavolo' }, { id: 'yoga', n: 'Yoga' }, { id: 'calistenia', n: 'Calisthenics' }, { id: 'boxeo', n: 'Boxe' }];
  /* ---------- PRODUCTOS: el nombre con el que se COMPRA cada pid ----------
     La compra pinta esto, no el texto de la receta: «tomate», no «tomate en
     rodajas». Lo de en rodajas es cosa de la receta, y alli se queda. */
  const PRODUCTOS = {
    aceitunas: 'Olive',
    aguacate: 'Avocado',
    ajo: 'Aglio',
    alubias: 'Fagioli neri cotti',
    aove: 'Olio extravergine di oliva',
    arroz: 'Riso',
    atun: 'Tonno al naturale',
    avena: 'Fiocchi d’avena',
    'bebida-soja': 'Bevanda di soia',
    brocoli: 'Broccoli',
    calabacin: 'Zucchina',
    calabaza: 'Zucca',
    caldo: 'Brodo vegetale',
    canela: 'Cannella',
    cebolla: 'Cipolla',
    champinones: 'Champignon',
    chia: 'Semi di chia',
    cilantro: 'Coriandolo',
    claras: 'Albumi',
    edamame: 'Edamame',
    especias: 'Spezie',
    espinacas: 'Spinaci',
    fruta: 'Frutta',
    'frutos-rojos': 'Frutti di bosco',
    gambas: 'Gamberi sgusciati',
    garbanzos: 'Ceci cotti',
    'harina-garbanzo': 'Farina di ceci',
    huevos: 'Uova',
    hummus: 'Hummus',
    'leche-coco': 'Latte di cocco',
    lechuga: 'Lattuga',
    lentejas: 'Lenticchie cotte',
    'lentejas-rojas': 'Lenticchie rosse',
    levadura: 'Lievito alimentare',
    limon: 'Limone',
    merluza: 'Merluzzo',
    nueces: 'Noci',
    pan: 'Pane integrale',
    'pan-sg': 'Pane senza glutine',
    'pasta-lentejas': 'Pasta di lenticchie',
    patata: 'Patata',
    pepino: 'Cetriolo',
    pimiento: 'Peperone',
    pipas: 'Semi di zucca',
    platano: 'Banana',
    pollo: 'Petto di pollo',
    'prote-vegetal': 'Proteine vegetali in polvere',
    quinoa: 'Quinoa',
    sal: 'Sale',
    salmon: 'Salmone',
    'salsa-soja': 'Salsa di soia',
    sesamo: 'Semi di sesamo',
    skyr: 'Skyr',
    'soja-text': 'Soia texturizzata',
    tamari: 'Tamari',
    tempeh: 'Tempeh',
    ternera: 'Manzo magro',
    tofu: 'Tofu compatto',
    tomate: 'Pomodoro',
    'tomate-triturado': 'Polpa di pomodoro',
    verduras: 'Verdure miste',
    whey: 'Whey',
    'yogur-soja': 'Yogurt di soia',
    zanahoria: 'Carota',
  };
  /* ---------- MUJER: embarazo, posparto y ciclo ----------
     Un solo bloque, con la misma forma en los seis idiomas: solo cambian los
     textos. Asi los espejos se traducen enteros y el inserto es el mismo. Las
     cifras salen de las guias citadas en el informe de evidencia (ACOG 804,
     canadienses 2019 y 2025, SEGO 2019, Goom 2019, EFSA, IOM 2009, AESAN). */
  const MUJER = {
    EJERCICIOS: {
      'cuadrupedia': { pat: 'core', pic: 'cuadrupedia',
        nombre: 'Quadrupedia (bird-dog)', mm: { p: ['abdomen'], s: ['gluteo'] }, zona: 'core', musc: ['Core profondo', 'glutei', 'erettori'], equipo: 'Niente',
        cues: ['A quattro zampe, mani sotto le spalle e ginocchia sotto le anche', 'Allunga braccio e gamba opposti senza che la lombare si muova', 'Espira mentre allunghi; torna lenta e cambia lato'],
        err: ['Inarcare la lombare mentre alzi la gamba (alzala meno)', 'Ruotare l’anca per arrivare più lontano', 'Trattenere il respiro'],
        alt: [{ n: 'Solo gamba, o solo braccio', por: 'se perdi l’equilibrio o la lombare' }, { n: 'Con pausa di 3″ in alto', por: 'se 10 ripetizioni ti stanno strette' }],
        mol: 'Se i polsi danno fastidio, appoggia sui pugni o afferra due manubri fermi come maniglie.'
      },
      'plancha-inclinada': { pat: 'core', pic: 'plancha-inclinada',
        nombre: 'Plank inclinato', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Core anteriore', 'dentato'], equipo: 'Niente (tavolo, panca o muro)',
        cues: ['Mani su un tavolo o una panca, corpo in linea dalla testa ai talloni', 'Costole giù e bacino neutro: niente inarcamenti', 'Respira normale; più alto è l’appoggio, più è facile'],
        err: ['Bacino che crolla o si alza', 'Spalle strette verso le orecchie', 'Trattenere il respiro'],
        alt: [{ n: 'Al muro', por: 'se il tavolo diventa duro o nella dirittura d’arrivo della gravidanza' }, { n: 'Plank a terra', por: 'fuori dalla gravidanza, quando 40″ vengono facili' }],
        mol: 'Se senti una spinta verso l’esterno sull’addome o sul pavimento pelvico, alza l’inclinazione.'
      },
      'suelo-pelvico': { pat: 'sp', pic: 'suelo-pelvico',
        nombre: 'Pavimento pelvico', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Pavimento pelvico'], equipo: 'Niente',
        cues: ['Seduta o sdraiata su un fianco: contrai come per bloccare la pipì e trattenere un gas, insieme', 'Tieni 6-8″ respirando; rilascia del tutto prima di ripetere', 'Chiudi con 5 contrazioni rapide da 1″'],
        err: ['Stringere glutei, cosce o addome al posto del pavimento pelvico', 'Trattenere il respiro', 'Non rilasciare del tutto tra una ripetizione e l’altra'],
        alt: [{ n: 'Sdraiata su un fianco', por: 'se da seduta non senti la contrazione' }, { n: 'In piedi, in coda o al semaforo', por: 'quando ce l’hai: così si fa ogni giorno' }],
        mol: 'Se con perdite, pesantezza o dolore non migliora in qualche settimana, fisioterapia del pavimento pelvico: è quello che raccomandano le linee guida.'
      }
    },
    SESIONES: {
      'emb1-a': { nombre: 'Forza A · primo trimestre', tipo: 'fuerza', fase: 1, dur: '~40′', calent: true, bloques: [
        { e: 'sentadilla-pc',     s: 3, r: '10-12', d: 75, n: 'Con un manubrio al petto se ce l’hai; al box se hai capogiri' },
        { e: 'press-militar-mc',  s: 3, r: '10',    d: 75, n: 'Seduta, con schienale' },
        { e: 'remo-mancuerna',    s: 3, r: '10/l', d: 75, n: 'Appoggiata a panca o tavolo' },
        { e: 'puente-gluteo',     s: 3, r: '12',    d: 60, n: 'Fino alla settimana 16; dopo lo sostituisce la quadrupedia' },
        { e: 'plancha',           s: 3, r: '20-30″', d: 60 },
        { e: 'elev-talones',      s: 2, r: '15',    d: 45 },
        { e: 'suelo-pelvico',     s: 3, r: '10',    d: 30, n: '6-8″ ciascuna e 5 rapide alla fine' }
      ]},
      'emb1-b': { nombre: 'Forza B · primo trimestre', tipo: 'fuerza', fase: 1, dur: '~40′', calent: true, bloques: [
        { e: 'zancada-alterna',   s: 3, r: '8/p',   d: 75, n: 'Statico e con una mano appoggiata: l’equilibrio è già cambiato' },
        { e: 'press-inclinado-mc', s: 3, r: '10',   d: 75, n: 'Panca a 30-45°; senza panca, flessioni con le mani su un tavolo' },
        { e: 'banda-remo',        s: 3, r: '12',    d: 60 },
        { e: 'elev-laterales',    s: 2, r: '12',    d: 60 },
        { e: 'dead-bug',          s: 2, r: '8/l',   d: 45, n: 'Fino alla settimana 16' },
        { e: 'abduccion-lado',    s: 2, r: '12/l', d: 45 },
        { e: 'suelo-pelvico',     s: 3, r: '10',    d: 30 }
      ]},
      'emb2-a': { nombre: 'Forza A · secondo trimestre', tipo: 'fuerza', fase: 2, dur: '~40′', calent: true, bloques: [
        { e: 'sentadilla-pc',     s: 3, r: '10',    d: 75, n: 'Al box o alla sedia: profondità comoda, senza rimbalzo' },
        { e: 'press-militar-mc',  s: 3, r: '10',    d: 75, n: 'Seduta, con schienale' },
        { e: 'remo-mancuerna',    s: 3, r: '10/l', d: 75, n: 'Appoggiata: la pancia non resta appesa' },
        { e: 'cuadrupedia',       s: 2, r: '8/l', d: 60, n: 'Sostituisce il ponte: niente da sdraiata a pancia in su' },
        { e: 'plancha-inclinada', s: 3, r: '25″',   d: 60 },
        { e: 'elev-talones',      s: 2, r: '15',    d: 45 },
        { e: 'suelo-pelvico',     s: 3, r: '10',    d: 30 }
      ]},
      'emb2-b': { nombre: 'Forza B · secondo trimestre', tipo: 'fuerza', fase: 2, dur: '~40′', calent: true, bloques: [
        { e: 'zancada-alterna',   s: 3, r: '8/p',   d: 75, n: 'Statico, con appoggio' },
        { e: 'press-inclinado-mc', s: 2, r: '10',   d: 75, n: 'Panca alta o mani su un tavolo; mai piana' },
        { e: 'banda-remo',        s: 3, r: '12',    d: 60 },
        { e: 'elev-laterales',    s: 2, r: '12',    d: 60 },
        { e: 'curl-martillo',     s: 2, r: '12',    d: 45 },
        { e: 'ext-triceps-banda', s: 2, r: '12',    d: 45 },
        { e: 'abduccion-lado',    s: 2, r: '12/l', d: 45 },
        { e: 'suelo-pelvico',     s: 3, r: '10',    d: 30 }
      ]},
      'emb3-a': { nombre: 'Forza A · terzo trimestre', tipo: 'fuerza', fase: 3, dur: '~30′', calent: true, bloques: [
        { e: 'sentadilla-pc',     s: 3, r: '8-10',  d: 90, n: 'Alla sedia, con le mani libere per appoggiarti' },
        { e: 'press-militar-mc',  s: 2, r: '10',    d: 75, n: 'Seduta' },
        { e: 'remo-mancuerna',    s: 2, r: '10/l', d: 75 },
        { e: 'cuadrupedia',       s: 2, r: '6/l', d: 60 },
        { e: 'plancha-inclinada', s: 2, r: '20″',   d: 60, n: 'Al muro va bene' },
        { e: 'suelo-pelvico',     s: 3, r: '10',    d: 30 }
      ]},
      'emb3-b': { nombre: 'Forza B · terzo trimestre', tipo: 'fuerza', fase: 3, dur: '~30′', calent: true, bloques: [
        { e: 'zancada-alterna',   s: 2, r: '6/p',   d: 90, n: 'Con appoggio; se pesa, mezzo affondo' },
        { e: 'banda-remo',        s: 2, r: '12',    d: 60 },
        { e: 'elev-laterales',    s: 2, r: '10',    d: 60 },
        { e: 'abduccion-lado',    s: 2, r: '10/l', d: 45 },
        { e: 'ext-triceps-banda', s: 2, r: '10',    d: 45 },
        { e: 'suelo-pelvico',     s: 3, r: '10',    d: 30 }
      ]},
      'pp-a': { nombre: 'Recupero', tipo: 'fuerza', fase: 1, dur: '~15′', calent: false, bloques: [
        { e: 'suelo-pelvico',     s: 3, r: '10',    d: 30, n: 'Da quando puoi: 6-8″ e rilasciare del tutto' },
        { e: 'dead-bug',          s: 2, r: '8/l',   d: 45, n: 'Solo gambe all’inizio; la lombare incollata' },
        { e: 'cuadrupedia',       s: 2, r: '6/l', d: 45 },
        { e: 'abduccion-lado',    s: 2, r: '10/l', d: 45 }
      ]},
      'pp-b': { nombre: 'Riconnessione', tipo: 'fuerza', fase: 2, dur: '~30′', calent: true, bloques: [
        { e: 'sentadilla-pc',     s: 3, r: '10',    d: 60, n: 'Espira in salita; senza trattenere l’aria' },
        { e: 'zancada-alterna',   s: 2, r: '8/p',   d: 60, n: 'Statico' },
        { e: 'puente-gluteo',     s: 3, r: '12',    d: 60 },
        { e: 'banda-remo',        s: 3, r: '12',    d: 60 },
        { e: 'elev-talones',      s: 2, r: '15',    d: 45 },
        { e: 'plancha-inclinada', s: 2, r: '20″',   d: 45 },
        { e: 'suelo-pelvico',     s: 3, r: '10',    d: 30 }
      ]},
      'pp-paseo': { nombre: 'Camminata 10-20′', tipo: 'cardio', icono: 'walk', detalle: 'Dolce e corta, fin dai primi giorni. Se dopo il sanguinamento aumenta, fermati e abbassa il ritmo: è il segnale che usano le linee guida.' }
    },
    SUELO_PELVICO: {
      titulo: 'Pavimento pelvico · 5′ · ogni giorno',
      intro: 'È la raccomandazione con più evidenza di tutte: farlo ogni giorno in gravidanza riduce del 62% l’incontinenza alla fine e del 29% a tre mesi dal parto (Cochrane 2020). E nessuno si accorge che lo stai facendo.',
      bloques: [
        { id: 'suelo-pelvico', nombre: 'Contrazioni lunghe e corte', donde: 'Ogni giorno, e dopo ogni sessione', detalle: '3 × 10 contrazioni da 6-8″, respirando, rilasciando del tutto tra una e l’altra; e alla fine 5 rapide da 1″. Seduta, su un fianco o in piedi: l’importante è che sia il pavimento pelvico e non il gluteo.' },
        { id: 'respiracion', nombre: 'Respirazione e core', donde: 'Prima di caricare', detalle: 'Inspira aprendo le costole; nell’espirazione il pavimento pelvico sale e l’addome si raccoglie dolcemente. È lo schema che precede ogni squat e ogni carico in braccio: il bebè, la sedia, la spesa.' }
      ],
      nota: 'Se ci sono perdite, pesantezza, rigonfiamento o dolore, questo non basta: valutazione con la fisioterapia del pavimento pelvico. Le linee guida del 2025 la raccomandano a tutte dalla settimana 6 dopo il parto.'
    },
    CALENTAMIENTO_EMB: {
      titulo: 'Riscaldamento · 6′ · sempre',
      pasos: ['Circonduzioni delle braccia · 30″', 'Rotazioni delle anche · 30″ per lato', '10 squat lenti alla sedia', '5 affondi corti con appoggio per lato', 'Marcia sul posto muovendo le braccia · 60″', 'Respirazione con pavimento pelvico · 5 cicli'],
      gym: 'Niente salti: l’impatto non entra in gravidanza.'
    },
    FASES_EMB: [
      { id: 1, nombre: 'Primo trimestre', sub: 'Settimane 1-13', disco: 10, rpe: 'Borg 12-14 · puoi parlare', objetivo: 'Mantenere l’abitudine con nausea e sonno contro: sessioni corte, camminare, pavimento pelvico ogni giorno. Zero record personali.' },
      { id: 2, nombre: 'Secondo trimestre', sub: 'Settimane 14-27', disco: 15, rpe: 'Borg 12-14 · puoi parlare', objetivo: 'Torna l’energia: il volume può salire un po’. Dalla settimana 16 niente da sdraiata a pancia in su né a pancia in giù; il piano lo cambia già.' },
      { id: 3, nombre: 'Terzo trimestre', sub: 'Settimane 28-36', disco: 20, rpe: 'Borg 12-14 · puoi parlare', objetivo: 'Sessioni più corte, più recupero tra le serie e sempre con appoggio: l’equilibrio e il centro di gravità non sono più quelli di prima.' },
      { id: 4, nombre: 'Dirittura d’arrivo', sub: 'Dalla settimana 37', disco: 25, rpe: 'Borg 11-13 · dolce', objetivo: 'Camminare, pavimento pelvico e mobilità. Quello che ti va e quello che il corpo ti concede, fino al giorno del parto.' }
    ],
    FASES_PP: [
      { id: 1, nombre: 'Recupero', sub: 'Settimane 0-2', disco: 10, rpe: 'dolce', objetivo: 'Pavimento pelvico da quando puoi, respirazione, camminate corte. Nient’altro, ed è già tanto. Con il cesareo, senza fretta: comanda la cicatrice.' },
      { id: 2, nombre: 'Riconnessione', sub: 'Settimane 2-6', disco: 15, rpe: 'Borg 11-13', objetivo: 'Squat, affondo, ponte e rematore con elastico: quello che farai mille volte al giorno con il bebè in braccio, imparato senza carico.' },
      { id: 3, nombre: 'Base', sub: 'Settimane 6-12', disco: 20, rpe: '6-7', objetivo: 'Dopo la visita di controllo: circuiti, cyclette o ellittica, stacco leggero. Ancora senza impatto: il pavimento pelvico si prende il suo tempo.' },
      { id: 4, nombre: 'Costruzione', sub: 'Dalla settimana 12', disco: 25, rpe: '7-8', objetivo: 'Il piano di sempre, dalla base. Correre, solo con la lista di controllo superata e senza sintomi.' }
    ],
    REGLAS_EMB: [
      { n: 1, t: 'Puoi parlare', d: 'L’intensità si misura con la voce, non con il battito: se riesci a portare avanti una conversazione, vai bene (Borg 12-14). In gravidanza il battito risponde in modo diverso e inganna.' },
      { n: 2, t: 'Niente record', d: 'Qui non si progredisce in chili: si mantiene. Nessuna serie a cedimento, nessuna manovra di trattenere l’aria per sollevare. Espira nello sforzo.' },
      { n: 3, t: 'Niente a pancia in su dalla 16', d: 'Da sdraiata a pancia in su l’utero comprime la vena cava e la pressione scende. Il piano cambia da solo quegli esercizi; se in qualsiasi momento senti capogiri, cambia posizione.' },
      { n: 4, t: 'Pavimento pelvico ogni giorno', d: '3 × 10 contrazioni al giorno. È la raccomandazione con più evidenza di tutte le linee guida, e previene l’incontinenza dopo il parto.' },
      { n: 5, t: 'Caldo e acqua', d: 'Allenati in un posto fresco, con l’acqua a portata e senza superare i 45 minuti di fila: oltre, la glicemia scende. Niente hot yoga, sauna né esercizio con la febbre.' },
      { n: 6, t: 'Niente cadute né colpi', d: 'Fuori gli sport di contatto, quelli di racchetta, la bici all’aperto, i pattini o qualsiasi cosa con rischio di cadere. Camminare, nuotare, cyclette e questa forza coprono tutto.' },
      { n: 7, t: 'Fermati e chiama', d: 'Sanguinamento, dolore addominale, contrazioni regolari, perdita di liquido, affanno a riposo, capogiri, mal di testa forte, dolore al petto, debolezza, o dolore e gonfiore a un polpaccio: quel giorno non si allena e si sente il medico.' },
      { n: 8, t: 'Il corridoio sale', d: 'La bilancia sale e deve salire: {g} kg in totale per il tuo BMI di partenza, circa {r} kg a settimana dal secondo trimestre. Fuori da lì, parlane alla visita; qui non c’è deficit.' }
    ],
    REGLAS_PP: [
      { n: 1, t: 'Comandano i sintomi', d: 'Ogni passo si fa se il precedente non ha dato perdite, pesantezza, dolore né più sanguinamento. Se compaiono, si torna indietro di una settimana e si sente il medico.' },
      { n: 2, t: 'Niente impatto prima della 12', d: 'Niente corsa, niente salti, niente lezioni con salti prima delle 12 settimane, e dopo solo con la lista di controllo superata. Il pavimento pelvico si riprende in mesi, non in giorni.' },
      { n: 3, t: 'Pavimento pelvico ogni giorno', d: '3 × 10 al giorno da quando puoi. E valutazione con la fisioterapia del pavimento pelvico verso la settimana 6, anche se non senti nulla: le linee guida la raccomandano a tutte.' },
      { n: 4, t: 'Cesareo: comanda la cicatrice', d: 'Ogni tratto slitta di due settimane e niente che tiri sulla cicatrice fino alla visita di controllo. Quando è guarita, massaggiarla aiuta a non farla aderire.' },
      { n: 5, t: 'Sonno', d: '7-9 ore è quello che il corpo chiede e quello che quasi mai c’è. I sonnellini contano: falli coincidere con quelli del bebè. Una settimana senza dormire è una settimana di minimo, non di fallimento.' },
      { n: 6, t: 'Mangiare per due', d: 'Con l’allattamento il dispendio sale di circa 450 kcal al giorno. Il deficit, se c’è, parte dalla settimana 6 e non supera le 500 kcal: mezzo chilo a settimana è ciò che l’evidenza dà per sicuro per il bebè.' },
      { n: 7, t: 'Addominali sì', d: 'Gli addominali non aprono la diastasi dei retti né la chiudono: danno forza e funzione. Il core del piano è progressivo; se senti un rigonfiamento quando ti tiri su, alza l’inclinazione.' },
      { n: 8, t: 'Il minimo regge', d: 'Settimana caotica: 2 forza + 1 camminata. Non si perde niente; si riprende da dove eri.' }
    ],
    CIENCIA_EMB: {
      intro: 'Piano verificato contro le linee guida cliniche in vigore (ACOG 2020, canadese 2019, SEGO 2019, OMS 2020) e le metanalisi che le sostengono. L’idea che ordina tutto: l’esercizio in gravidanza è trattamento di prima linea, e quello che va adattato sono posizioni e intensità, non la voglia.',
      temas: [
        { t: 'Meno complicazioni', d: 'Il solo esercizio riduce il diabete gestazionale (OR 0,62), l’ipertensione gestazionale (0,61) e la preeclampsia (0,59) in 106 studi e 273.182 donne. Bastano 140 minuti a settimana di camminata veloce, cyclette o forza.', ref: 'Davenport et al., Br J Sports Med 2018' },
        { t: 'Forza sì; pesante, non di default', d: 'Le linee guida includono la forza con pesi ed elastici tra ciò che è studiato e sicuro. In 679 atlete che hanno continuato a caricare pesante i risultati sono stati normali: non c’è evidenza di danno in chi lo faceva già, e nemmeno di beneficio nell’iniziare adesso. Per questo il tetto è parlare senza affannarsi.', ref: 'ACOG 804, 2020 · Prevett et al., 2023' },
        { t: 'Il pavimento pelvico si allena', d: 'Allenarlo in gravidanza riduce del 62% l’incontinenza a fine gravidanza e del 29% a tre mesi dal parto in donne senza perdite precedenti. È l’intervento con più evidenza di tutto il piano.', ref: 'Woodley et al., Cochrane 2020' },
        { t: 'Quanto salire e quante proteine', d: 'L’aumento atteso dipende dal BMI di partenza (IOM 2009), e il fabbisogno reale di proteine misurato con gli isotopi è di 1,2 g/kg all’inizio e 1,5 alla fine, molto sopra la cifra ufficiale di 0,88. Il piano chiede 1,4 e 1,6 sul peso di partenza.', ref: 'Institute of Medicine 2009 · Stephens et al., J Nutr 2015' }
      ]
    },
    CIENCIA_PP: {
      intro: 'Piano verificato contro la linea guida canadese del 2025, la prima dedicata al primo anno dopo il parto, e il consenso di fisioterapia sul ritorno alla corsa. L’idea che ordina tutto: muoversi fin dai primi giorni protegge la salute mentale, e l’impatto aspetta il pavimento pelvico.',
      temas: [
        { t: '120 minuti che valgono il 45%', d: 'Accumulare 120 minuti a settimana di attività moderata, in 4 giorni o più e con la forza inclusa, si associa al 45% in meno di depressione post parto, al 37% in meno di incontinenza e al 28% in meno di diabete di tipo 2, senza più infortuni né cambiamenti nel latte.', ref: 'Davenport et al., Br J Sports Med 2025' },
        { t: 'Correre dalla 12, e a condizioni', d: 'Il riferimento di fisioterapia fissa i tre mesi come minimo, e una batteria di prove di carico e impatto senza perdite né pesantezza prima di trottare. L’app la porta dentro.', ref: 'Goom, Donnelly e Brockwell, 2019' },
        { t: 'Allattamento e deficit', d: 'Con l’allattamento esclusivo, 500 kcal in meno al giorno e 45 minuti di esercizio 4 giorni a settimana dalla settimana 4 hanno fatto perdere 4,8 kg in 10 settimane senza alcun effetto sul peso né sulla statura dei bebè.', ref: 'Lovelady et al., N Engl J Med 2000' },
        { t: 'Addominali e diastasi', d: 'Dodici settimane di curl-up non hanno peggiorato la separazione dei retti e hanno aumentato forza e spessore. Quello che l’esercizio non fa è chiuderla: le revisioni non trovano effetto sulla distanza.', ref: 'Gluppe et al., J Physiother 2023 · Lyons et al., Hernia 2026' }
      ]
    },
    SENALES_EMB: ['Fermati e senti il medico: sanguinamento, dolore addominale, contrazioni regolari, perdita di liquido, affanno a riposo, capogiri, mal di testa forte, dolore al petto, debolezza che tocca l’equilibrio, dolore o gonfiore al polpaccio.', 'Normale: stanchezza, caldo e vampate che passano abbassando il ritmo; fastidio lieve nel bacino che cede cambiando posizione.', 'Parlane alla prossima visita: dolore pelvico che si ripete, perdite di urina, pesantezza.'],
    SENALES_PP: ['Fermati e senti il medico: sanguinamento che aumenta con lo sforzo, dolore addominale intenso, febbre, dolore o gonfiore a un polpaccio, capogiri, dolore alla cicatrice che peggiora.', 'Normale: stanchezza, indolenzimento leggero, un po’ di fastidio alla cicatrice all’inizio che va a diminuire.', 'Fisioterapia del pavimento pelvico prima di continuare: perdite di urina o di feci, pesantezza o rigonfiamento in vagina, dolore durante i rapporti, rigonfiamento sulla pancia quando ti tiri su.'],
    UI: {
      patrones: { sp: 'Pavimento pelvico' },
      cuest: {
        etapaT: 'Gravidanza o post parto?', etapaP: 'Cambia tutto il piano: posizioni, intensità, cibo e ciò che si misura.',
        etapaNo: 'Nessuna delle due', etapaEmb: 'Sono incinta', etapaPp: 'Ho partorito da poco',
        embT: 'La tua gravidanza', embSemL: 'Settimana di gravidanza', embPesoPreL: 'Peso prima della gravidanza (kg) · opzionale', embSemMal: 'Settimana tra 4 e 42.',
        embRiesgoT: 'Qualcuna di queste?', embRiesgoP: 'Sono le controindicazioni delle linee guida. Se ne segni una, l’esercizio lo decide il tuo ginecologo o la tua ostetrica.',
        embR: { membranas: 'Rottura delle membrane', prematuro: 'Minaccia di parto pretermine', sangrado: 'Sanguinamento vaginale persistente', placenta: 'Placenta previa (dalla settimana 20)', preeclampsia: 'Preeclampsia o pressione alta non controllata', cervix: 'Cervice incompetente o cerchiaggio', cir: 'Restrizione della crescita intrauterina', multiple: 'Gravidanza trigemina o più', diabetes: 'Diabete di tipo 1 o tiroide non controllati', cardio: 'Malattia cardiaca o respiratoria importante' },
        embRiesgoNo: 'Nessuna',
        embAvisoRel: 'Se hai avuto aborti spontanei precedenti, ipertensione gestazionale, gemelli, anemia con sintomi o un parto pretermine, parlane alla prossima visita: il piano prosegue, con più margine.',
        gateEmbT: 'Comanda la tua gravidanza', gateEmbTxt: 'Hai segnato una controindicazione delle linee guida. Con quella, il piano si genera solo se il tuo ginecologo o la tua ostetrica ti ha dato il via libera per fare esercizio moderato.',
        ppT: 'Il tuo parto', ppFechaL: 'Che giorno hai partorito?', ppFechaMal: 'Scegli una data degli ultimi 12 mesi.',
        ppTipoT: 'Com’è andato?', ppVaginal: 'Vaginale', ppCesarea: 'Cesareo',
        ppLactT: 'Stai allattando al seno?', ppLactSi: 'Sì', ppLactNo: 'No',
        ppSpT: 'Noti qualcuna di queste?', ppSpP: 'Sono segnali del pavimento pelvico. Non chiudono il piano: frenano l’impatto e chiedono fisioterapia.',
        ppSp: { orina: 'Perdite di urina quando tossisci, ridi o salti', pesadez: 'Pesantezza, rigonfiamento o pressione in vagina', dolor: 'Dolore pelvico o durante i rapporti', bulto: 'Rigonfiamento sulla pancia quando mi tiro su' },
        ppSpNo: 'Nessuna',
        ppRiesgoT: 'Qualcuna di queste adesso?', ppRiesgoP: 'Sono le controindicazioni della linea guida del 2025. Se ne segni una, serve il via libera della tua dottoressa.',
        ppR: { sangrado: 'Sanguinamento che aumenta con lo sforzo', dolor: 'Dolore addominale intenso', fiebre: 'Febbre o infezione', tension: 'Pressione alta non controllata', pantorrilla: 'Dolore o gonfiore a un polpaccio', cicatriz: 'Dolore alla cicatrice che peggiora quando mi muovo', mareo: 'Capogiri o svenimenti' },
        ppRiesgoNo: 'Nessuna',
        gatePpT: 'Comanda il tuo recupero', gatePpTxt: 'Hai segnato una controindicazione della linea guida del 2025. Il piano si genera quando la tua dottoressa o la tua ostetrica ti avrà dato il via libera.',
        cicloT: 'Il tuo ciclo', cicloP: 'Opzionale. Serve a registrare e prevedere le mestruazioni, e a leggere meglio la bilancia e i giorni fiacchi. Non cambia il piano per fasi: l’evidenza non lo sostiene.',
        cicloNat: 'Ho un ciclo naturale', cicloHorm: 'Uso un contraccettivo ormonale', cicloSin: 'Ora non ho le mestruazioni', cicloNo: 'Preferisco non dirlo',
        cicloUltT: 'Quando sono iniziate le tue ultime mestruazioni?', cicloUltMal: 'Scegli un giorno degli ultimi 60.',
        cicloDurT: 'Quanto dura di solito il tuo ciclo?', cicloDurP: 'Dal primo giorno di mestruazioni al successivo. Il normale sta tra 24 e 38 giorni.', cicloDurNs: 'Non lo so',
        resLEtapa: 'Fase', resLCiclo: 'Ciclo', resEmb: 'Gravidanza · settimana {s}', resPp: 'Post parto · settimana {s}', resPpCes: 'Post parto · cesareo · settimana {s}',
        resCicloNat: 'Ciclo naturale · {d} giorni', resCicloHorm: 'Contraccettivo ormonale', resCicloSin: 'Ora senza mestruazioni'
      },
      gen: {
        emb: {
          kcalNota: '{t}: il tuo dispendio più {k} kcal. Nessun deficit: qui si costruisce.',
          ritmoT: 'Aumento atteso', ritmoV: '+{a}–{b} kg/sett', ritmoN: 'Dal secondo trimestre, per il tuo BMI di partenza ({imc}). In totale, {g} kg (IOM 2009).',
          fila1: '1º trimestre', fila2: '2º trimestre', fila3: '3º trimestre',
          nota1: '+70 kcal: quasi niente. Mangia quando il corpo lo chiede.', nota2: '+260 kcal: una porzione in più, con proteine.', nota3: '+500 kcal: due porzioni in più. Le proteine salgono a 1,6 g/kg.',
          escalado: 'Le proteine ({p} g) si calcolano sul tuo peso prima della gravidanza; quello che sale per trimestre è il resto.',
          hidratacion: 'Acqua: 2,3 litri al giorno (8-10 bicchieri). Alcol: nessuno, in nessuna quantità. Caffeina: fino a 200 mg al giorno contando tutto (un caffè lungo e un tè).',
          comidaLibre: 'C’è ancora un pasto libero a settimana, con le stesse regole di sicurezza: niente crudo, niente salumi crudi né prodotti non pastorizzati, e niente alcol. Si può spostare; resta uno.',
          plato: 'Ogni pasto: 150-200 g di carne magra o pesce ben cotto (niente pesce spada, squalo, tonno rosso né luccio), o 3 uova ben cotte, o 250 g di skyr o formaggio fresco pastorizzato, o 250 g di legumi cotti + 1 uovo.',
          supl: [
            { id: 'folico', t: 'Acido folico', d: '0,4 mg al giorno, almeno le prime 12 settimane: è la raccomandazione forte della linea guida del Ministero. Se lo prendi già su prescrizione, continua con quella.' },
            { id: 'yodo', t: 'Iodio', d: '200 µg al giorno durante la gravidanza e l’allattamento (EFSA). Se non arrivi a 3 latticini e sale iodato al giorno, te lo prescrive la tua ostetrica come ioduro di potassio.' },
            { id: 'omega-3', t: 'DHA', d: '100-200 mg di DHA al giorno oltre al pesce azzurro (EFSA). Con 3-4 porzioni di pesce a settimana di solito basta.' },
            { id: 'vitamina-d', t: 'Vitamina D', d: '15 µg al giorno di riferimento. Si integra solo se lo chiedono le analisi.' },
            { id: 'hierro', t: 'Ferro', d: 'Nessun extra di default: l’assenza di mestruazioni e il maggiore assorbimento bastano. Solo se lo dicono le tue analisi.' },
            { id: 'cafeina', t: 'Caffeina', d: 'Tetto di 200 mg al giorno sommando caffè, tè, cola ed energy drink. Un caffè lungo è già la metà.' },
            { id: 'no', t: 'Ora no', d: 'Creatina (nessuno studio in gravidanza: non iniziare adesso), brucia-grassi, pre-workout, vitamina A oltre le 2.500 UI ed erbe “per la gravidanza”. Niente che non ti abbia prescritto la tua ostetrica.' }
          ],
          seguridad: 'Fuori dal menù: pesce o frutti di mare crudi e affumicati da banco frigo; formaggi non pastorizzati e latte crudo; paté da banco frigo e germogli; uovo crudo o poco cotto; prosciutto crudo e salumi crudi se non cotti; pesce spada, squalo, tonno rosso e luccio. Carne cotta fino a 71 °C al cuore; avanzi oltre i 75 °C; frigorifero a 4 °C o meno; frutta e verdura ben lavate.',
          jamon: 'Il prosciutto crudo: l’AESAN lo elenca tra quelli da evitare se non cotto. Congelarlo 48 h a −20 °C inattiva il toxoplasma, ma non la listeria. Se lo mangi, cotto; e mai affettato in busta.',
          hito14T: 'Secondo trimestre', hito14D: 'Di solito torna l’energia. Se ti va, alza un po’ il ritmo, mai oltre il poter parlare.',
          hito16T: 'Da oggi, niente a pancia in su', hito16D: 'Il piano ha già sostituito ponte, dead bug e panca piana con versioni in piedi, inclinate o in quadrupedia. Se senti capogiri da sdraiata, cambia posizione senza aspettare.',
          hito28T: 'Terzo trimestre', hito28D: 'Sessioni più corte e con appoggio. Il centro di gravità non è più quello di prima: niente che dipenda dall’equilibrio. Se correvi, da oggi cammini.',
          hito36T: 'Dirittura d’arrivo', hito36D: 'Comandano camminata e pavimento pelvico. Allenati quanto ti va, fino al giorno del parto se il corpo lo chiede.',
          cierre: 'Il piano finisce con il parto, intorno al {f}. Quando nasce, entra in Impostazioni e aggiorna il profilo al post parto: il piano cambia del tutto.',
          chkD: 'Corridoio di aumento per il tuo BMI di partenza (IOM 2009). Dentro è dentro; sopra per due settimane di fila, parlane alla visita.',
          cuidaN: 'niente a pancia in su dalla 16 · niente salti né equilibrio · tetto: poter parlare',
          logroFinD: 'Piano completato fino al parto. Ora tocca al post parto: l’app cambia con te.'
        },
        pp: {
          kcalNotaLact: 'Il tuo dispendio più {k} kcal per l’allattamento{d}. Minimo 1.800 kcal: sotto, cala il latte prima del grasso.',
          kcalNota: '{d}. Prima della settimana 6, mantenimento: prima guarire.',
          defTxt: ', meno {v} kcal di deficit dalla settimana 6', mantTxt: 'Mantenimento',
          fila1: 'Recupero e riconnessione (fino alla visita)', fila2: 'Base (dalla visita alla settimana 12)', fila3: 'Costruzione (sett 12+)',
          escalado: 'Con l’allattamento le proteine ({p} g) salgono a 1,6 g/kg e non si toccano; i carboidrati accompagnano il volume.',
          hidratacion: 'Acqua: 2,5-3 litri al giorno, di più con l’allattamento (ogni poppata dà sete: bevi allora). Alcol: meno ce n’è, meglio è per il bebè; se c’è, lontano dalla poppata. Caffeina: fino a 200 mg al giorno con l’allattamento.',
          comidaLibre: 'Un pasto a settimana, non un giorno. Con l’allattamento il pesce resta senza pesce spada, squalo, tonno rosso né luccio; il resto torna in tavola.',
          supl: [
            { id: 'yodo', t: 'Iodio', d: '200 µg al giorno finché dura l’allattamento (EFSA): il latte se lo porta via.' },
            { id: 'omega-3', t: 'DHA', d: '100-200 mg al giorno oltre al pesce azzurro finché dura l’allattamento (EFSA).' },
            { id: 'vitamina-d', t: 'Vitamina D', d: '15 µg al giorno di riferimento; integrazione solo se lo chiedono le analisi.' },
            { id: 'hierro', t: 'Ferro', d: 'Dopo il parto, analisi se c’è stato sanguinamento abbondante o stanchezza che non passa; integrare solo con la ferritina bassa.' },
            { id: 'whey', t: 'Whey', d: 'Un misurino dove mancano proteine: con l’allattamento sono 1,6 g/kg e con la tavola è dura arrivarci.' },
            { id: 'cafeina', t: 'Caffeina', d: 'Con l’allattamento, tetto di 200 mg al giorno e mai dopo le 14: la sente anche il bebè.' },
            { id: 'no', t: 'Non spendere in', d: 'Brucia-grassi, “recuperatori post parto”, guaine che promettono di chiudere la diastasi e creatina fino allo svezzamento. Non spostano l’ago.' }
          ],
          hito6T: 'Visita e pavimento pelvico', hito6D: 'Dopo la visita di controllo delle 6 settimane, valutazione con la fisioterapia del pavimento pelvico anche se non senti nulla: le linee guida del 2025 la raccomandano a tutte.',
          hito8T: 'La cicatrice', hito8D: 'Cesareo: se è chiusa e asciutta, massaggiarla ogni giorno evita che aderisca. Continua senza niente che tiri sulla cicatrice.',
          hito12T: 'Impatto: la lista', hito12D: 'Da oggi puoi pensare di correre, se superi la lista di controllo in OGGI senza perdite né pesantezza. Senza fretta: tra i 3 e i 6 mesi è la norma.',
          cierre: 'Piano post parto finito il {f}. Il blocco successivo inizia dove finisce questo: Impostazioni › Crea / rifai il mio piano, ormai come il piano di sempre.',
          cuidaN: 'niente impatto fino alla 12 · pavimento pelvico ogni giorno · cesareo: due settimane in più per tratto',
          correrT: 'Pronta per correre', correrP: 'Tutto senza perdite, pesantezza, dolore né sanguinamento. Segna quello che già fai senza sintomi e salva.',
          correr: { pasear: 'Camminare 30 minuti', equil: 'Equilibrio su una gamba 10″ per lato', sent1: 'Squat su una gamba, 10 per lato', trote: 'Corsa sul posto 1 minuto', saltos: '10 salti in avanti', pata: '10 salti su una gamba per lato', runman: '10 running man per lato', fuerza: '20 calf raise, ponti e squat su una gamba, e 20 abduzioni su un fianco' },
          correrOk: 'Salva: ora posso correre', correrHecho: 'Lista superata il {f}: il cardio ora può includere la corsa leggera.',
          correrAviso: 'Con perdite, pesantezza o dolore in una delle prove: fisioterapia del pavimento pelvico prima di correre. Non è un fallimento, è l’ordine giusto.'
        },
        ciclo: {
          fase: { regla: 'mestruazioni', folicular: 'fase follicolare', ovulatoria: 'ovulazione stimata', lutea: 'fase luteale', premenstrual: 'fase luteale · premestruale', retraso: 'mestruazioni in ritardo' },
          linea: 'Ciclo · giorno {d} · {f}', proxima: 'mestruazioni previste il {f} (±{m} giorni)', proximaHoy: 'mestruazioni previste oggi o domani', retraso: '{n} giorni di ritardo sul previsto',
          irregular: 'Cicli con più di 9 giorni di variazione: non si prevedono. Registra le mestruazioni e, se escono da 24-38 giorni in modo ripetuto, parlane con la tua dottoressa.',
          hormonal: 'Con il contraccettivo ormonale non ci sono fasi: il sanguinamento è dovuto alla pausa dalla pillola, non sono mestruazioni. Registra lo stesso se vuoi il calendario.',
          sinRegla: 'Più di 90 giorni senza mestruazioni, senza gravidanza né contraccettivo ormonale: fatti vedere. È il segnale che usano il CIO e le linee guida di salute femminile.',
          nota: { regla: 'Se c’è dolore o stanchezza, oggi va bene il minimo o abbassare di un punto lo sforzo. Altrimenti allenati uguale: il rendimento non dipende dalla fase. Ferro in tavola: legumi o carne rossa magra, con vitamina C.', folicular: 'Niente da cambiare: l’evidenza non trova differenze di forza né di adattamento per fase.', ovulatoria: 'I legamenti sono un po’ più lassi in questi giorni: atterra bene negli affondi e nei salti. Il piano non cambia.', lutea: 'Dispendio e appetito un po’ più alti (il 2-11%): il margine di oggi sale di circa 150 kcal. Il peso può salire per l’acqua: la media settimanale lo assorbe.', premenstrual: 'Voglie, sonno peggiore e un po’ di gonfiore sono normali in questi giorni. Non compensare, non pesarti ogni giorno e, se l’umore lo chiede, il minimo va bene.' },
          hRegla: 'Mestruazioni', hReglaSub: 'Segna i giorni di sanguinamento', hAbund: 'Sanguinamento abbondante', hAbundSub: 'Assorbente zuppo ogni 1-2 h: chiedi la ferritina',
          abundNota: 'Il sanguinamento abbondante riguarda un’atleta su tre e si associa all’anemia. Analisi con ferritina, e ferro solo se esce bassa.'
        }
      },
      rev: {
        etapaEmbT: 'Settimana {s} di gravidanza', etapaEmbSub: 'piano fino al parto, intorno al {f}; senza deficit né record',
        etapaPpT: 'Post parto · settimana {s}', etapaPpSub: 'progressione per settimane dal parto; impatto solo dalla 12', etapaPpCes: 'cesareo: ogni tratto, due settimane in più',
        kEmb: 'il tuo dispendio più il tratto del trimestre: qui non si taglia', kLact: 'con l’allattamento incluso; il deficit aspetta la settimana 6',
        cuidaEmbT: 'Posizioni e intensità adattate', cuidaEmbSub: 'niente a pancia in su dalla 16, niente salti né equilibrio, tetto: poter parlare',
        cuidaPpT: 'Prima il pavimento pelvico', cuidaPpSub: 'ogni giorno, e fisioterapia verso la settimana 6',
        cicloT: 'Ciclo registrato', cicloSub: 'segna le mestruazioni in OGGI: previsione, lettura della bilancia e giorni fiacchi. Nessuna sessione per fasi: non c’è evidenza.',
        cicloHormT: 'Contraccettivo ormonale', cicloHormSub: 'nessuna fase da leggere; il piano non cambia'
      },
      hoy: {
        embLinea: 'Settimana {s} di gravidanza · {t}', embT1: '1º trimestre', embT2: '2º trimestre', embT3: '3º trimestre', embT4: 'dirittura d’arrivo',
        embPasada: 'Data presunta del parto superata: quando nasce, aggiorna il profilo al post parto in Impostazioni.',
        ppLinea: 'Post parto · settimana {s}{c}', ppCes: ' · cesareo',
        hSuelo: 'Pavimento pelvico', hSueloSub: '3 × 10 · 6-8″ ciascuna',
        correrChip: 'Pronta per correre', correrChipSub: 'Settimana 12 compiuta: controlla la lista',
        pesoSube: 'Presi', corredorEmb: 'Corridoio di aumento', corredorEmbSub: 'per il tuo BMI di partenza: {g} kg in totale (IOM 2009)',
        pesoEmbNota: 'Media settimanale dentro il corridoio: bene. Sopra per due settimane di fila: parlane alla visita, non tagliare.'
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
