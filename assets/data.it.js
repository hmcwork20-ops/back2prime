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
      objetivo: 'Ricostruire l\'abitudine e risvegliare gli schemi di movimento senza massacrare le articolazioni. Resterai con la voglia di più: è voluto.' },
    { id: 2, nombre: 'Ingresso in palestra', sub: 'Full Body ×3', semanas: [3, 4, 5], disco: 15, rpe: '6–7',
      fechas: '31 ago – 20 set',
      objetivo: 'Reimparare i fondamentali col bilanciere e costruire la base di carico. La tua memoria muscolare permette pesi che il tuo tessuto connettivo ancora non regge: lavora al 65-70% di quello che senti di poter fare, SEMPRE con 3 ripetizioni di riserva.' },
    { id: 3, nombre: 'Carico', sub: 'Torso / Gambe ×4', semanas: [6, 7, 8, 9], disco: 20, rpe: '7–8',
      fechas: '21 set – 18 ott',
      objetivo: 'Volume e intensità veri per forzare la ricomposizione: qui la memoria muscolare rende davvero. Chiudi ogni serie potendo fare 2 ripetizioni in più — e che siano vere: chi torna tende a sovrastimare quanto è vicino al cedimento.' },
    { id: 4, nombre: 'Picco', sub: 'Push / Pull / Legs ×5', semanas: [10, 11, 12], disco: 25, rpe: '8',
      fechas: '19 ott – 8 nov',
      objetivo: 'Massimo stimolo per chiudere la ricomposizione. Cinque giorni, ma con sessioni da 60-75 minuti, non da 2 ore. RPE 8: 1-2 ripetizioni di riserva nelle ultime serie.' }
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
  const HITOS_SEMANA = {
    5:  { t: 'Screening di salute', d: 'Prima della Fase 3 (lavoro intenso dopo 5 anni fermo): misurati la pressione in farmacia e fatti delle analisi di base (lipidi, glicemia/HbA1c). 15 minuti che comprano tranquillità.' },
    7:  { t: 'DIET BREAK', d: 'Per tutta la settimana mangi a mantenimento (~2.800 kcal: +2 porzioni di carboidrati al giorno, proteine uguali). L\'allenamento non cambia. Non è un premio né una ricaduta: ripristina NEAT e leptina, e rompe il ciclo psicologico on/off. Il lunedì dopo, di nuovo deficit come se niente fosse.' },
    9:  { t: 'SCARICO (non opzionale)', d: 'Stessa routine con LA METÀ delle serie per esercizio e lo stesso peso sul bilanciere. Non è uno stop: fermarsi del tutto costa forza. È mantenimento del tessuto + vacanze per tendini e articolazioni prima del blocco finale.' },
    10: { t: 'Transizione a 5 giorni', d: 'Prima settimana di PPL: fai UNA serie in meno su tutto. Il salto da 4 a 5 giorni è il punto di maggior rischio tendineo del piano; ci si entra camminando, non saltando.' }
  };

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
    'cam40':  { nombre: 'Camminata 40′', tipo: 'cardio', icono: 'walk', detalle: 'Ritmo da conversazione scomoda: puoi parlare, ma non cantare. Conta per i passi del giorno.' },
    'cam60':  { nombre: 'Camminata 60′', tipo: 'cardio', icono: 'walk', detalle: 'Ritmo vivace e costante. Ideale all\'aperto: somma luce, passi e recupero attivo.' },
    'wj3': { nombre: 'Cammina-corri S3', tipo: 'cardio', icono: 'run', detalle: '7 giri: 2′ di corsa leggera + 2′ camminando (28′). Prima: 2×20 tibialis raises + 10 calf raise. Corsa leggera sul serio: se non riesci a parlare, stai andando forte.' },
    'wj4': { nombre: 'Cammina-corri S4', tipo: 'cardio', icono: 'run', detalle: '6 giri: 3′ di corsa + 2′ camminando (30′). Prima: 2×20 tibialis raises. Cadenza alta e passi corti: meno impatto per falcata.' },
    'wj5': { nombre: 'Cammina-corri S5', tipo: 'cardio', icono: 'run', detalle: '5 giri: 5′ di corsa + 1′ camminando (30′), oppure 20′ di corsa leggera continua se il corpo risponde bene. Prima: 2×20 tibialis raises.' },
    'trote25': { nombre: 'Corsa 25-30′', tipo: 'cardio', icono: 'run', detalle: 'Continua e a ritmo di conversazione. Meglio asfalto liscio o sterrato compatto che marciapiedi irregolari. Se compare un fastidio a tibia o ginocchio che peggiora correndo: fermati e cammina.' },
    'trote30': { nombre: 'Corsa 30-35′', tipo: 'cardio', icono: 'run', detalle: 'Continua. Un giorno può essere un po\' più brillante (ultimi 10′ a ritmo medio), l\'altro sempre leggero.' },
    'libre': { nombre: 'Riposo', tipo: 'libre', icono: 'rest', detalle: 'Giorno libero per davvero. I passi giornalieri contano comunque. Domenica: il meal prep (~90′) ti sistema la settimana.' }
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
    intro: 'La forza torna in settimane; il tendine ha bisogno di mesi (il suo collagene si rinnova ~10 volte più lentamente e non ha memoria muscolare). Questo blocco è l\'assicurazione del piano: parte dalla settimana 1, e la corsa della settimana 3 entra solo con due settimane di lavoro tendineo già rodate.',
    bloques: [
      { id: 'tendon-rodilla', nombre: 'Rotuleo · isometrico', donde: 'Dopo ogni sessione di gambe (in F1, dopo i circuiti)',
        detalle: 'Squat isometrico al muro (F2+: squat spagnolo con fascia rigida dietro le ginocchia): 5 × 45″ al 70% di sforzo, 1′ di recupero. Coscia vicina al parallelo, senza dolore acuto. Oltre ad adattare, ha un effetto analgesico immediato (Rio 2015).' },
      { id: 'tendon-aquiles', nombre: 'Achille · HSR per il polpaccio', donde: 'Già integrato nelle sessioni (calf raise)',
        detalle: 'La regola che cambia tutto: polpacci PESANTI e LENTI — 3″ giù, 3″ su, 6-8 reps, senza rimbalzi. In F1 con uno zaino carico su una gamba sola; in palestra con carico vero. Il rimbalzo sfrutta il riflesso del tendine e gli toglie proprio lo stimolo che gli serve.' },
      { id: 'tendon-tibial', nombre: 'Tibiale anteriore', donde: 'Prima di ogni corsa',
        detalle: 'Tibialis raises appoggiato al muro: 2-3 × 15-20. È il vaccino contro la periostite al tuo peso attuale.' },
      { id: 'tendon-codo', nombre: 'Gomito/polso · isometrico', donde: 'Dopo le sessioni di torso (F2+), 2×/sett',
        detalle: 'Con un manubrio leggero, polso fermo a metà flessione: 3 × 45″ (palmo in su e palmo in giù). Il volume di panca + rematore + lat machine fa scattare l\'epicondilite in chi riprende; questo la previene gratis.' }
    ],
    nota: 'NON aggiungere pliometria/salti "per preparare la corsa": l\'evidenza dice che è un cattivo stimolo tendineo e ad alto impatto. La tua preparazione all\'impatto è questo blocco.'
  };

  /* ---------- REGOLE DI CORSA (evidenza BMI ~28) ---------- */
  const CARRERA = {
    titulo: 'Come correre senza romperti (95 kg comandano)',
    reglas: [
      'Cadenza 170-180 passi/min, falcata corta: riduce l\'impatto tibiale di ~11% e il tasso di carico di ~15%. Conta i passi per 30″ (85-90) o usa il metronomo dell\'orologio.',
      'Volume governato dalle sensazioni e dalla progressione del piano: non superare mai ~1,3× la media di quello che stai facendo nelle ultime 4 settimane (l\'app ti avvisa).',
      'La settimana 3 parte con ~2,5 km di corsa totale: sotto il tetto dei 3 km/sett che l\'evidenza indica per iniziare in sovrappeso.',
      'Superficie e scarpe COSTANTI: non cambiare le due cose insieme. Meglio asfalto liscio o sterrato compatto che marciapiedi.',
      'Fastidio a tibia o ginocchio che PEGGIORA correndo: fermati e cammina. Quello che sparisce scaldandoti, tienilo d\'occhio; quello che cresce, comanda.'
    ]
  };

  /* ---------- MASSIMALI STORICI (epoca palestra, ~2021) ---------- */
  // Non si caricano come PR: sono il riferimento di "dov'eri" e il bersaglio da riconquistare.
  const HISTORICO = {
    'press-banca':      { kg: 95,  reps: 8, series: 4, txt: '95 kg × 8 (4 serie)',  rm: 120 },
    'sentadilla-barra': { kg: 100, reps: 8, series: 5, txt: '100 kg × 8 (5 serie)', rm: 127 }
  };

  /* ---------- CARICHI DI PARTENZA · FASE 2 ---------- */
  const ARRANQUE = {
    titulo: 'Con che peso parti in palestra (settimana 3)',
    derivacion: 'Escono dai tuoi massimali reali — panca 95×8 e squat 100×8 (1RM ≈ 120 e ≈ 127 kg) — al 50%: la partenza standard di chi torna. Non perché il muscolo non possa di più, ma perché il tendine sono 5 anni che non carica. Da lì in poi, la doppia progressione la gestisce l\'app.',
    tabla: [
      { ej: 'press-banca',      s3: '45 kg', s4: '47,5 kg', s5: '50 kg', n: '50% dei tuoi 95. Bilanciere + 2×12,5' },
      { ej: 'sentadilla-barra', s3: '50 kg', s4: '55 kg',   s5: '60 kg', n: '50% dei tuoi 100. Bilanciere + 2×15' },
      { ej: 'rdl-barra',        s3: '45 kg', s4: '50 kg',   s5: '55 kg', n: '≈45% del tuo vecchio squat' },
      { ej: 'remo-barra',       s3: '40 kg', s4: '42,5 kg', s5: '45 kg', n: '≈45% della tua vecchia panca' }
    ],
    resto: 'Gli altri esercizi non hanno un riferimento precedente: nella prima serie scegli un peso che riesci a muovere lasciandoti 3 ripetizioni di riserva, annotalo, e da lì se ne occupa l\'app.',
    aviso: 'Questi pesi ti sembreranno ridicoli. Il punto è proprio quello: la tendinite di chi torna si incuba nelle settimane 3-5, quando il sistema nervoso permette ciò che i tendini ancora non reggono.',
    desequilibrio: 'Lo dicono i tuoi stessi massimali: squat 100 vs panca 95 è un rapporto di 1,05 (l\'equilibrio gira intorno a 1,4-1,5). La parte inferiore era rimasta indietro — ed ecco la doppia buona notizia: è dove hai più margine ed è ciò che muove di più la ricomposizione. Non saltare i giorni di gambe.'
  };

  /* ---------- SCHEDE ESERCIZI ---------- */
  // musc: [primario, secondari] · cues: tecnica · err: errori tipici ·
  // alt: alternative equivalenti (palestra commerciale) · mol: se dà fastidio, passa a
  const EJERCICIOS = {
    /* — Casa / F1 — */
    'sentadilla-pc': {
      nombre: 'Squat a corpo libero', zona: 'pierna', musc: ['Quadricipiti', 'glutei'], equipo: 'Niente',
      cues: ['Piedi alla larghezza delle spalle, punte leggermente in fuori', 'Scendi in 3″ come per sederti all\'indietro, sali in 1″', 'Le ginocchia seguono la punta del piede, talloni inchiodati a terra', 'Petto alto per tutto il movimento'],
      err: ['Talloni che si staccano (scendi meno in profondità)', 'Ginocchia che collassano verso l\'interno', 'Scendere rimbalzando invece di controllare'],
      alt: [{ n: 'Squat al box/divano', por: 'se fai fatica a controllare la profondità' }, { n: 'Squat con pausa di 2″ in basso', por: 'se 12 reps ti stanno strette' }],
      mol: 'Se il ginocchio dà fastidio: riduci la profondità fino a dove non fa male e scendi ancora più lento.'
    },
    'flexiones': {
      nombre: 'Flessioni', zona: 'empuje', musc: ['Pettorali', 'tricipiti, spalle'], equipo: 'Niente',
      cues: ['Mani poco più larghe delle spalle', 'Gomiti a 45° dal corpo, né incollati né a croce', 'Corpo in asse: glutei e addome contratti', 'Il petto tocca (quasi) terra a ogni rep'],
      err: ['Bacino che crolla o a punta', 'Mezzo movimento', 'Collo proiettato verso il pavimento'],
      alt: [{ n: 'Flessioni con le mani su divano/tavolo', por: 'se da terra non escono pulite' }, { n: 'Flessioni coi piedi rialzati', por: 'se ne superi 12 con facilità' }],
      mol: 'Se il polso dà fastidio: pugni chiusi o maniglie per flessioni. Se dà fastidio la spalla: stringi un po\' la larghezza.'
    },
    'puente-gluteo': {
      nombre: 'Ponte glutei', zona: 'pierna', musc: ['Glutei', 'femorali'], equipo: 'Niente',
      cues: ['Sdraiato, talloni vicini ai glutei', 'Spingi coi talloni e alza il bacino', 'Pausa di 2″ in alto strizzando forte i glutei', 'Costole giù: non inarcare la lombare'],
      err: ['Spingere con la punta del piede', 'Inarcare la lombare per salire di più', 'Salire e scendere senza pausa'],
      alt: [{ n: 'Ponte a una gamba', por: 'quando 15 reps diventano comode' }, { n: 'Ponte con lo zaino sul bacino', por: 'per aggiungere carico a casa' }],
      mol: 'Se viene un crampo al femorale: avvicina di più i talloni ai glutei.'
    },
    'plancha': {
      nombre: 'Plank frontale', zona: 'core', musc: ['Core completo'], equipo: 'Niente',
      cues: ['Avambracci a terra, gomiti sotto le spalle', 'Costole dentro, bacino in retroversione (culo in dentro)', 'Glutei contratti, sguardo a terra', 'Respira: non trattenere l\'aria'],
      err: ['Bacino che crolla (la lombare soffre)', 'Culo a punta (trucco)', 'Resistere tremando: se trema la lombare, chiudi la serie'],
      alt: [{ n: 'Plank in appoggio sulle ginocchia', por: 'se non reggi il tempo con una buona forma' }],
      mol: 'Se la lombare dà fastidio: controlla prima di tutto la retroversione del bacino; di solito è quella.'
    },
    'plancha-lastre': {
      nombre: 'Plank con zavorra', zona: 'core', musc: ['Core completo'], equipo: 'Disco da 5-10 kg',
      cues: ['Stessa tecnica del plank normale', 'Fatti mettere il disco tra le scapole, non sulla lombare', 'Se il bacino cede, togli zavorra'],
      err: ['Disco troppo in basso (carica la lombare)', 'Perdere la retroversione quando ti stanchi'],
      alt: [{ n: 'Plank con tocchi di spalla', por: 'se non hai nessuno che ti metta il disco' }, { n: 'Ab wheel in ginocchio', por: 'variante più esigente' }],
      mol: 'Se la lombare dà fastidio: torna al plank senza zavorra + tocchi di spalla.'
    },
    'elev-talones': {
      nombre: 'Calf raise', zona: 'pierna', musc: ['Polpaccio', 'soleo'], equipo: 'Gradino opzionale',
      cues: ['Range completo: allunga in basso, pausa di 1″ in alto', 'Sali in 1″, scendi in 2-3″', 'Meglio su un gradino per più escursione'],
      err: ['Rimbalzare veloce senza pausa', 'Mezza escursione in alto'],
      alt: [{ n: 'A una gamba', por: 'quando 20 reps diventano facili' }],
      mol: 'Se l\'Achille dà fastidio: riduci il range in basso e allunga il tempo di discesa.'
    },
    'zancada-alterna': {
      nombre: 'Affondi alternati', zona: 'pierna', musc: ['Quadricipiti', 'glutei'], equipo: 'Niente',
      cues: ['Passo ampio in avanti', 'Busto verticale, mani sui fianchi o davanti', 'Il ginocchio dietro sfiora il pavimento', 'Spingi col tallone davanti per tornare'],
      err: ['Passo corto (il ginocchio davanti collassa)', 'Busto inclinato in avanti', 'Ginocchio davanti che cede verso l\'interno'],
      alt: [{ n: 'Affondo statico (senza alternare)', por: 'se l\'equilibrio non tiene' }, { n: 'Affondo indietro', por: 'più gentile col ginocchio' }],
      mol: 'Se il ginocchio dà fastidio: passa all\'affondo INDIETRO, stesso schema.'
    },
    'remo-toalla': {
      nombre: 'Rematore con asciugamano alla porta', zona: 'tiron', musc: ['Dorsali', 'bicipiti, scapole'], equipo: 'Asciugamano + porta (o zaino)',
      cues: ['Asciugamano sulla maniglia/stipite, corpo inclinato indietro', 'Tira col GOMITO, non con la mano', 'Scapole indietro e in basso a fine corsa', 'Più ti inclini, più è duro'],
      err: ['Tirare con le braccia senza muovere le scapole', 'Strattonare con lo slancio del bacino'],
      alt: [{ n: 'Rematore con zaino carico', por: 'a un braccio, appoggiato al tavolo' }, { n: 'Rematore inverso sotto un tavolo robusto', por: 'versione più dura' }],
      mol: 'Se il gomito dà fastidio: impugna più largo e riduci l\'inclinazione.'
    },
    'rdl-1p': {
      nombre: 'Stacco rumeno a una gamba', zona: 'pierna', musc: ['Femorali', 'glutei, equilibrio'], equipo: 'Niente (zaino opzionale)',
      cues: ['Anche indietro, schiena dritta come un tavolo', 'La gamba libera sale dietro da contrappeso', 'Scendi finché senti l\'allungamento del femorale', 'Dai priorità all\'equilibrio, non alla profondità'],
      err: ['Arrotondare la schiena per arrivare più in basso', 'Ruotare il bacino (tieni entrambe le anche rivolte al pavimento)'],
      alt: [{ n: 'Con una mano appoggiata al muro', por: 'se l\'equilibrio ti rompe la serie' }, { n: 'B-stance (piede dietro di appoggio)', por: 'via di mezzo' }],
      mol: 'Se il femorale tira troppo: riduci il range, non la tecnica.'
    },
    'superman': {
      nombre: 'Superman', zona: 'core', musc: ['Lombari', 'glutei, alta schiena'], equipo: 'Niente',
      cues: ['A pancia in giù, braccia avanti', 'Alza braccia e gambe insieme, 2″ in alto', 'Sguardo a terra: non tirare col collo'],
      err: ['Colpo di frusta cervicale guardando avanti', 'Salire di rimbalzo'],
      alt: [{ n: 'Bird-dog (braccio e gamba opposti)', por: 'più controllo, meno compressione' }],
      mol: 'Se la lombare dà fastidio: passa direttamente al bird-dog.'
    },
    'dead-bug': {
      nombre: 'Dead bug', zona: 'core', musc: ['Core anteriore profondo'], equipo: 'Niente',
      cues: ['Sdraiato, lombare INCOLLATA a terra per tutto il tempo', 'Braccio e gamba opposti scendono lenti insieme', 'Espira mentre estendi: le costole restano giù'],
      err: ['La lombare si inarca quando estendi la gamba (accorcia il movimento)', 'Andare veloce'],
      alt: [{ n: 'Solo gambe (braccia ferme)', por: 'se la lombare si stacca da terra' }],
      mol: 'È l\'esercizio più sicuro del piano; se qualcosa dà fastidio, controlla che la lombare non si stacchi.'
    },

    /* — Palestra: spinta — */
    'press-banca': {
      nombre: 'Panca piana', zona: 'empuje', musc: ['Pettorali', 'tricipiti, deltoide anteriore'], equipo: 'Bilanciere + panca',
      cues: ['Scapole retratte e INCHIODATE alla panca, piedi saldi a terra', 'Presa: avambraccio verticale quando il bilanciere tocca il petto', 'Il bilanciere scende a metà petto, gomiti a ~45°', 'Tocca il petto con controllo e spingi in linea leggermente diagonale'],
      err: ['Spalle che si sollevano spingendo (perdi la retrazione)', 'Far rimbalzare il bilanciere sul petto', 'Culo staccato dalla panca', 'Polsi piegati all\'indietro'],
      alt: [{ n: 'Chest press alla macchina', por: 'giorni senza voglia di montare la panca o palestra piena' }, { n: 'Distensioni con manubri su panca piana', por: 'più range e meno spalla' }],
      mol: 'Se la spalla dà fastidio: prova una presa un po\' più stretta e gomiti più chiusi; se continua, manubri con presa neutra.'
    },
    'press-inclinado-mc': {
      nombre: 'Panca inclinata con manubri', zona: 'empuje', musc: ['Pettorale alto', 'spalle, tricipiti'], equipo: 'Manubri + panca a 30°',
      cues: ['Panca a 30° (una tacca, non il muro)', 'Scendi finché senti lo stiramento del pettorale', 'Gomiti a 45-60°, polsi neutri', 'Sali senza far sbattere i manubri in alto'],
      err: ['Panca troppo verticale (diventa una shoulder press)', 'Rimbalzare in basso', 'Inarcare la lombare in modo esagerato'],
      alt: [{ n: 'Panca inclinata al multipower', por: 'se la palestra è piena o vuoi stabilità' }, { n: 'Panca inclinata con bilanciere', por: 'già programmata nel Push B della F4' }],
      mol: 'Se la spalla dà fastidio: riduci il range in basso di 5 cm e ruota leggermente i palmi verso l\'interno.'
    },
    'press-inclinado-barra': {
      nombre: 'Panca inclinata con bilanciere', zona: 'empuje', musc: ['Pettorale alto', 'spalle, tricipiti'], equipo: 'Bilanciere + panca inclinata',
      cues: ['Panca a 30-45°, scapole inchiodate', 'Il bilanciere scende sulla parte alta del petto (clavicole)', 'Avambracci verticali al contatto'],
      err: ['Portare il bilanciere a metà petto (ti costringe ad aprire i gomiti)', 'Rimbalzare'],
      alt: [{ n: 'Multipower inclinato', por: 'stessa sessione, più guida' }, { n: 'Manubri su inclinata', por: 'se non c\'è una panca inclinata coi supporti' }],
      mol: 'Se la spalla dà fastidio: torna ai manubri, che permettono di ruotare la presa.'
    },
    'press-plano-mc': {
      nombre: 'Distensioni con manubri su panca piana', zona: 'empuje', musc: ['Pettorali', 'tricipiti'], equipo: 'Manubri + panca',
      cues: ['Più range del bilanciere: sfruttalo in basso con controllo', 'Sali ad arco, senza far sbattere i manubri in alto', 'Piedi saldi, scapole indietro'],
      err: ['Lasciar cadere i manubri in basso senza frenare', 'Trasformarle in una shoulder press aprendo troppo i gomiti'],
      alt: [{ n: 'Chest press alla macchina', por: 'fatica alta o nessuna panca libera' }],
      mol: 'Se la spalla dà fastidio: presa neutra (palmi uno di fronte all\'altro).'
    },
    'press-militar': {
      nombre: 'Military press', zona: 'empuje', musc: ['Spalle', 'tricipiti, core'], equipo: 'Bilanciere (in piedi o da seduto)',
      cues: ['In piedi: glutei e addome CONTRATTI prima di spingere', 'Il bilanciere parte dal mento e sale rasente al viso', 'La testa "attraversa la finestra" alla fine', 'Da seduto con schienale: senza inarcare la lombare'],
      err: ['Inarcare la lombare trasformandolo in una panca inclinata', 'Spingere il bilanciere in avanti (sbatte sul mento)', 'Range incompleto in alto'],
      alt: [{ n: 'Shoulder press con manubri da seduto', por: 'già programmata in F2; più gentile con la spalla' }, { n: 'Shoulder press alla macchina', por: 'ultima sessione della settimana con fatica addosso' }],
      mol: 'Se la spalla dà fastidio: manubri con presa neutra e sali solo fin dove non c\'è pizzicore.'
    },
    'press-militar-mc': {
      nombre: 'Shoulder press con manubri da seduto', zona: 'empuje', musc: ['Spalle', 'tricipiti'], equipo: 'Manubri + panca con schienale',
      cues: ['Schienale alto, lombare appoggiata senza inarcare', 'Gomiti leggermente davanti al corpo, non a croce', 'Escursione completa senza far sbattere i manubri in alto'],
      err: ['Inarcare la lombare staccandola dallo schienale', 'Scendere solo fino alle orecchie'],
      alt: [{ n: 'Shoulder press alla macchina', por: 'equivalente diretto' }],
      mol: 'Se la spalla dà fastidio: presa neutra e scendi solo fino a 90° di gomito.'
    },
    'elev-laterales': {
      nombre: 'Alzate laterali', zona: 'empuje', musc: ['Deltoide laterale'], equipo: 'Manubri',
      cues: ['Peso LEGGERO, gomiti un po\' flessi', 'Sali fino all\'orizzontale, come versando due caraffe', 'Niente slancio: se dondoli, il peso è troppo', 'Scendi in 2″'],
      err: ['Salire col trapezio alzando le spalle', 'Superare l\'orizzontale', 'Dondolio del bacino'],
      alt: [{ n: 'Alzate laterali al cavo basso', por: 'tensione continua; programmate nel Push B' }, { n: 'Macchina per alzate laterali', por: 'per chiudere senza pensare alla tecnica' }],
      mol: 'Se la spalla dà fastidio: pollice leggermente verso l\'alto e sali 10° davanti al piano laterale.'
    },
    'laterales-polea': {
      nombre: 'Alzate laterali al cavo', zona: 'empuje', musc: ['Deltoide laterale'], equipo: 'Cavo basso',
      cues: ['Cavo all\'altezza del polso col braccio rilassato', 'Corpo stabile, sali fino all\'orizzontale', 'Il cavo mantiene la tensione anche in basso: sfruttala'],
      err: ['Mettersi troppo lontano dal cavo', 'Tirare col trapezio'],
      alt: [{ n: 'Manubri', por: 'se i cavi sono occupati' }],
      mol: 'Come coi manubri: pollice in su e piano leggermente avanzato.'
    },
    'fondos': {
      nombre: 'Dip assistiti', zona: 'empuje', musc: ['Pettorale basso', 'tricipiti'], equipo: 'Macchina per dip assistiti o elastici',
      cues: ['Corpo leggermente inclinato in avanti (più petto)', 'Scendi fino a 90° di gomito, non oltre se la spalla protesta', 'Gomiti che non si aprono a croce'],
      err: ['Scendere troppo in profondità', 'Spalle sollevate verso le orecchie'],
      alt: [{ n: 'Panca declinata o dip tra panche', por: 'se non c\'è la macchina assistita' }],
      mol: 'Se dà fastidio lo sterno o la spalla: sostituisci con distensioni con manubri su panca piana.'
    },
    'ext-triceps-polea': {
      nombre: 'Pushdown per tricipiti al cavo', zona: 'empuje', musc: ['Tricipiti'], equipo: 'Cavo alto + corda o barra',
      cues: ['Gomiti incollati al corpo, FISSI', 'Si muove solo l\'avambraccio', 'Estendi del tutto e strizza 1″'],
      err: ['Gomiti che avanzano in discesa (ci metti la spalla)', 'Dondolio del busto'],
      alt: [{ n: 'Con la corda aprendo in basso', por: 'un po\' più di capo lungo' }, { n: 'Kick-back con manubrio', por: 'senza cavi liberi' }],
      mol: 'Se il gomito dà fastidio: abbassa il peso e sali a 15-20 reps; il gomito odia l\'ego.'
    },
    'ext-triceps-cabeza': {
      nombre: 'Estensioni sopra la testa (corda)', zona: 'empuje', musc: ['Tricipiti (capo lungo)'], equipo: 'Cavo + corda',
      cues: ['Di spalle al cavo, corda dietro la nuca', 'Gomiti che puntano in avanti, estendi verso l\'alto', 'Stiramento vero in basso: è lì che cresce il capo lungo'],
      err: ['Aprire i gomiti a croce', 'Range corto per eccesso di peso'],
      alt: [{ n: 'French press con bilanciere EZ', por: 'stesso schema da sdraiato' }],
      mol: 'Se il gomito dà fastidio: come al cavo normale — meno peso, più reps.'
    },
    'press-frances': {
      nombre: 'French press', zona: 'empuje', musc: ['Tricipiti (capo lungo)'], equipo: 'Bilanciere EZ + panca',
      cues: ['Sdraiato, il bilanciere scende verso la fronte o poco dietro', 'Gomiti che puntano al soffitto, fermi', 'Scendi in 2-3″, estendi senza chiudere di colpo'],
      err: ['Gomiti che si aprono', 'Trasformarlo in una panca presa stretta muovendo la spalla'],
      alt: [{ n: 'Estensioni sopra la testa al cavo', por: 'più tensione continua, meno stress sul gomito' }],
      mol: 'Se il gomito dà fastidio: cambialo direttamente con pushdown al cavo a 15 reps.'
    },

    /* — Palestra: tirata — */
    'remo-barra': {
      nombre: 'Rematore con bilanciere', zona: 'tiron', musc: ['Dorsali', 'schiena media, bicipiti'], equipo: 'Bilanciere',
      cues: ['Busto a ~45°, ginocchia semiflesse', 'Tira il bilanciere verso il basso ventre', 'Scapole indietro e in basso alla fine', 'Schiena NEUTRA non negoziabile'],
      err: ['Strattonare con la lombare (ti dondoli)', 'Busto che si alza rep dopo rep', 'Tirare verso il petto coi gomiti aperti'],
      alt: [{ n: 'T-bar row', por: 'variante più stabile' }, { n: 'Rematore alla macchina con supporto al petto', por: 'se la lombare è carica dal giorno di gambe' }],
      mol: 'Se la lombare protesta: macchina con supporto al petto o pulley, senza pensarci due volte.'
    },
    'remo-polea': {
      nombre: 'Pulley basso', zona: 'tiron', musc: ['Schiena media', 'dorsali, bicipiti'], equipo: 'Cavo basso + triangolo',
      cues: ['Petto alto e FISSO: il busto non viaggia', 'Tira il triangolo verso l\'ombelico', 'Pausa 1″ strizzando le scapole'],
      err: ['Dondolare il busto per muovere più peso', 'Spalle sollevate'],
      alt: [{ n: 'Rematore alla macchina', por: 'equivalente diretto' }],
      mol: 'Se la lombare dà fastidio: appoggia il petto a una macchina da rematore con supporto.'
    },
    'remo-mancuerna': {
      nombre: 'Rematore con manubrio a un braccio', zona: 'tiron', musc: ['Dorsali', 'schiena media'], equipo: 'Manubrio + panca',
      cues: ['Ginocchio e mano sulla panca, schiena neutra', 'Tira il gomito verso il fianco, non verso la spalla', 'Senza ruotare il busto in salita'],
      err: ['Alzare la spalla a inizio tirata', 'Ruotare il busto per "aiutarti"', 'Range corto'],
      alt: [{ n: 'Rematore al cavo a un braccio', por: 'tensione più costante' }],
      mol: 'Senza un buon appoggio la lombare soffre: usa una panca inclinata e appoggia il petto.'
    },
    'jalon-pecho': {
      nombre: 'Lat machine', zona: 'tiron', musc: ['Dorsali', 'bicipiti'], equipo: 'Cavo alto',
      cues: ['Presa poco più larga delle spalle', 'Petto in fuori, leggera inclinazione indietro FISSA', 'Tira i GOMITI verso le tasche', 'Barra alla clavicola, 1″ di pausa'],
      err: ['Dondolarsi per strappare la tirata', 'Tirare con le braccia senza deprimere le scapole', 'Barra dietro la nuca (no)'],
      alt: [{ n: 'Trazioni assistite', por: 'l\'obiettivo della F3 è migrare verso di loro' }, { n: 'Lat machine presa stretta', por: 'programmata nel Pull B' }],
      mol: 'Se la spalla dà fastidio: presa neutra (triangolo largo) e abbassa il peso.'
    },
    'jalon-estrecho': {
      nombre: 'Lat machine presa stretta', zona: 'tiron', musc: ['Dorsali', 'bicipiti'], equipo: 'Cavo alto + triangolo',
      cues: ['Triangolo o presa supina alla larghezza delle spalle', 'Gomiti stretti che scendono lungo i fianchi', 'Allunga del tutto in alto: il dorsale lavora lungo'],
      err: ['Trasformarla in un rematore inclinandosi troppo', 'Mezza ripetizione in alto'],
      alt: [{ n: 'Trazioni supine assistite', por: 'equivalente a corpo libero' }],
      mol: 'Se il gomito dà fastidio: presa neutra e polsi dritti.'
    },
    'dominadas': {
      nombre: 'Trazioni (assistite → libere → zavorrate)', zona: 'tiron', musc: ['Dorsali', 'bicipiti, core'], equipo: 'Sbarra + macchina assistita o elastici',
      cues: ['Parti deprimendo le scapole (spalle lontane dalle orecchie)', 'Tira i gomiti verso il basso, mento sopra la sbarra', 'Scendi CONTROLLANDO fino a braccia quasi distese', 'Riduci l\'assistenza settimana dopo settimana: usciranno prima di quanto credi'],
      err: ['Scalciare e darsi slancio', 'Mezza trazione (né su né giù)', 'Appendersi sulle spalle in basso senza tensione scapolare'],
      alt: [{ n: 'Lat machine presa prona pesante', por: 'se quel giorno non c\'è la macchina assistita' }, { n: 'Trazioni negative (salto + discesa in 5″)', por: 'gran costruttore della prima trazione' }],
      mol: 'Se il gomito dà fastidio: presa neutra. Se dà fastidio la spalla: non restare appeso passivo in basso.',
      hito: 'dominada-libre'
    },
    'pullover-polea': {
      nombre: 'Pullover al cavo', zona: 'tiron', musc: ['Dorsali (isolamento)'], equipo: 'Cavo alto + barra o corda',
      cues: ['Braccia quasi tese, cerniera solo nella spalla', 'Porta la barra alla coscia disegnando un arco', 'Stiramento in alto, strizzata in basso'],
      err: ['Piegare i gomiti (diventa un\'estensione per tricipiti)', 'Dondolare il busto'],
      alt: [{ n: 'Pullover con manubrio su panca', por: 'senza cavi liberi' }],
      mol: 'Se la spalla dà fastidio: riduci l\'arco in alto.'
    },
    'face-pull': {
      nombre: 'Face pull', zona: 'tiron', musc: ['Deltoide posteriore', 'rotatori, trapezio medio'], equipo: 'Cavo alto + corda',
      cues: ['Cavo all\'altezza del viso', 'Tira la corda VERSO LA FRONTE separando i capi', 'Alla fine, ruota le spalle verso fuori (i bicipiti puntano al soffitto)', 'Leggero e perfetto: è salute della spalla, non ego'],
      err: ['Trasformarlo in un rematore alto caricato', 'Saltare la rotazione esterna finale'],
      alt: [{ n: 'Reverse pec-deck', por: 'deltoide posteriore senza corda' }, { n: 'Rotazione esterna con elastico', por: 'a casa o come extra' }],
      mol: 'È l\'esercizio che aggiusta le spalle; se dà fastidio, abbassa il peso e controlla di tirare verso la fronte, non verso il collo.'
    },
    'encogimientos': {
      nombre: 'Scrollate con manubri', zona: 'tiron', musc: ['Trapezio superiore'], equipo: 'Manubri',
      cues: ['Spalle verso le orecchie, pausa 1″ in alto', 'Braccia come corde: non piegare i gomiti', 'Scendi controllato e allunga'],
      err: ['Ruotare le spalle in cerchio (non aggiunge nulla e sfrega)', 'Rimbalzare con le gambe'],
      alt: [{ n: 'Con bilanciere', por: 'più carico totale' }],
      mol: 'Se il collo dà fastidio: guarda avanti e non incassare il mento.'
    },

    /* — Palestra: gambe/anca — */
    'sentadilla-barra': {
      nombre: 'Squat con bilanciere', zona: 'pierna', musc: ['Quadricipiti', 'glutei, core'], equipo: 'Bilanciere + rack',
      cues: ['Bilanciere sul trapezio, non sulle cervicali', 'Core pressurizzato PRIMA di scendere (prendi aria in petto-addome)', 'Scendi al parallelo, ginocchia in fuori', 'Spingi il pavimento, petto alto in risalita'],
      err: ['Talloni che si sollevano (colpa delle caviglie: rialzali con dei dischi se serve)', 'Ginocchia che collassano in dentro in risalita', 'Good morning: il bacino sale prima del petto'],
      alt: [{ n: 'Squat al multipower', por: 'giorni di fatica o rack occupato' }, { n: 'Hack squat / pressa', por: 'stimolo per i quadricipiti senza carico assiale' }, { n: 'Goblet squat con manubrio', por: 'come riscaldamento o se la tecnica si perde' }],
      mol: 'Se il ginocchio dà fastidio: rallenta la discesa (3″) e fermati 5 cm sopra il punto critico. Se dà fastidio la lombare: controlla la pressurizzazione e togli il 20% del peso per una settimana.'
    },
    'prensa': {
      nombre: 'Pressa', zona: 'pierna', musc: ['Quadricipiti', 'glutei'], equipo: 'Pressa',
      cues: ['Piedi a metà pedana, larghezza spalle', 'Scendi fino a 90° SENZA staccare la lombare dallo schienale', 'Spingi con tutta la pianta, non bloccare le ginocchia di colpo'],
      err: ['Scendere tanto da far ruotare il bacino (butt wink in pressa = lombare)', 'Mani che spingono sulle ginocchia'],
      alt: [{ n: 'Hack squat', por: 'ancora più quadricipiti' }, { n: 'Pressa a una gamba', por: 'se c\'è uno squilibrio' }],
      mol: 'Se il ginocchio dà fastidio: piedi un po\' più in alto sulla pedana (più glutei, meno ginocchio).'
    },
    'rdl-barra': {
      nombre: 'Stacco rumeno', zona: 'pierna', musc: ['Femorali', 'glutei, lombari in isometria'], equipo: 'Bilanciere',
      cues: ['Anche INDIETRO, ginocchia semiflesse e ferme', 'Bilanciere incollato alle gambe per tutto il viaggio', 'Schiena neutra: petto in fuori', 'Scendi finché senti forte l\'allungamento del femorale e risali strizzando i glutei'],
      err: ['Arrotondare la schiena per scendere di più', 'Piegare le ginocchia trasformandolo in mezzo squat', 'Bilanciere che si allontana dal corpo'],
      alt: [{ n: 'Stacco rumeno con manubri', por: 'presa più comoda le prime settimane' }, { n: 'Hyperextension a 45° con carico', por: 'femorali-glutei senza limite di presa' }],
      mol: 'L\'allungamento del femorale è il segnale che lo stai facendo BENE. Se dà fastidio la lombare (non il femorale): togli il 20% e filma una serie di lato.'
    },
    'hip-thrust': {
      nombre: 'Hip thrust', zona: 'pierna', musc: ['Glutei', 'femorali'], equipo: 'Bilanciere + panca (+ protezione)',
      cues: ['Parte alta della schiena appoggiata alla panca, bilanciere sul bacino con protezione', 'Mento al petto, sguardo avanti-basso', 'Sali fino all\'orizzontale ESATTA, pausa 1″ strizzando', 'Ginocchia a 90° in alto, talloni sotto le ginocchia'],
      err: ['Inarcare la lombare in alto (iperestensione)', 'Spingere con le punte dei piedi', 'Rimbalzare in basso senza pausa'],
      alt: [{ n: 'Macchina per hip thrust', por: 'se la palestra ce l\'ha, montaggio molto più rapido' }, { n: 'Ponte con bilanciere a terra', por: 'senza panca libera' }],
      mol: 'Se la lombare dà fastidio: è quasi sempre iperestensione in alto; fermati all\'orizzontale.'
    },
    'zancada-mc': {
      nombre: 'Affondi con manubri', zona: 'pierna', musc: ['Quadricipiti', 'glutei'], equipo: 'Manubri',
      cues: ['Stessa tecnica di casa, ora con 6-10 kg per mano', 'Passo ampio, busto verticale, il ginocchio dietro sfiora il pavimento', 'I manubri pendono incollati al corpo, spalle indietro', 'Spingi col tallone davanti per tornare'],
      err: ['Passo corto che fa collassare il ginocchio davanti', 'Inclinarsi in avanti quando ti stanchi', 'Guardare a terra e perdere la linea'],
      alt: [{ n: 'Affondi indietro con manubri', por: 'più gentili col ginocchio' }, { n: 'Affondi al multipower', por: 'se l\'equilibrio limita il carico' }],
      mol: 'Se il ginocchio dà fastidio: passo più lungo e passa all\'affondo indietro.'
    },
    'zancada-bulgara': {
      nombre: 'Affondi bulgari', zona: 'pierna', musc: ['Quadricipiti', 'glutei'], equipo: 'Panca + manubri',
      cues: ['Piede dietro sulla panca, quello davanti a un passo lungo', 'Scendi in VERTICALE: il ginocchio dietro cerca il pavimento', 'Busto leggermente inclinato = più glutei; verticale = più quadricipiti', 'Parti SOLO a corpo libero, sul serio'],
      err: ['Piede davanti troppo vicino (il ginocchio soffre)', 'Rimbalzare in basso', 'Perdere l\'equilibrio guardando il soffitto'],
      alt: [{ n: 'Affondo statico con manubri', por: 'se l\'equilibrio ancora non c\'è' }, { n: 'Pressa a una gamba', por: 'unilaterale senza equilibrio' }],
      mol: 'Se il ginocchio davanti dà fastidio: allunga il passo e sposta il busto un po\' in avanti.'
    },
    'ext-cuadriceps': {
      nombre: 'Leg extension', zona: 'pierna', musc: ['Quadricipiti (isolamento)'], equipo: 'Macchina',
      cues: ['Ginocchio allineato al perno della macchina', 'Estendi del tutto con pausa 1″ in alto', 'Scendi in 2-3″'],
      err: ['Scalciare con lo slancio', 'Culo che si stacca dal sedile'],
      alt: [{ n: 'Sissy squat assistito', por: 'senza macchina' }],
      mol: 'Se la rotula dà fastidio: taglia l\'ultimo terzo IN ALTO non in basso, e tempo più lento. È anche il tuo esercizio di riabilitazione se un giorno il ginocchio protesta per la corsa.'
    },
    'curl-femoral-tumbado': {
      nombre: 'Leg curl sdraiato', zona: 'pierna', musc: ['Femorali (isolamento)'], equipo: 'Macchina',
      cues: ['Bacino INCOLLATO al lettino per tutto il tempo', 'Sali in 1″, scendi in 2-3″', 'Punta del piede neutra'],
      err: ['Sollevare il bacino per aiutarti', 'Mezza ripetizione'],
      alt: [{ n: 'Leg curl da seduto', por: 'in realtà un filo meglio per il femorale; usalo se è libero' }, { n: 'Nordic curl assistito', por: 'versione avanzata, più avanti' }],
      mol: 'Se viene un crampo: allunga il femorale tra le serie, è normale le prime settimane.'
    },
    'curl-femoral-sentado': {
      nombre: 'Leg curl da seduto', zona: 'pierna', musc: ['Femorali (isolamento)'], equipo: 'Macchina',
      cues: ['Coscia ben bloccata dal cuscinetto', 'Fletti del tutto, pausa 1″', 'Torna lento resistendo'],
      err: ['Culo che scivola in avanti', 'Range corto per eccesso di peso'],
      alt: [{ n: 'Leg curl sdraiato', por: 'equivalente' }],
      mol: 'Nessun problema tipico: è tra i più sicuri del piano.'
    },
    'gemelo-pie': {
      nombre: 'Calf raise in piedi', zona: 'pierna', musc: ['Polpaccio (gastrocnemio)'], equipo: 'Macchina o multipower + gradino',
      cues: ['Pausa 1″ IN ALTO e 1″ IN BASSO: niente rimbalzo', 'Allungamento completo in basso', 'Sali verticale, senza piegare le ginocchia'],
      err: ['Rimbalzare sfruttando il riflesso del tendine (toglie lo stimolo proprio al tessuto che vogliamo preparare)', 'Range a metà'],
      alt: [{ n: 'Alla pressa', por: 'senza macchina dedicata' }],
      mol: 'Se l\'Achille dà fastidio: solo isometrie in alto 3×30″ quella settimana.'
    },
    'gemelo-sentado': {
      nombre: 'Calf raise da seduto', zona: 'pierna', musc: ['Soleo'], equipo: 'Macchina',
      cues: ['Ginocchio a 90°: qui lavora il soleo, chiave per CORRERE', 'Stessa regola: pausa in alto e in basso, niente rimbalzi'],
      err: ['Andare veloce a rimbalzi', 'Appoggiare solo la punta delle dita (meglio la base)'],
      alt: [{ n: 'Da seduto con manubri sulle ginocchia + gradino', por: 'senza macchina' }],
      mol: 'Come quello in piedi: fastidio all\'Achille = solo isometrie per una settimana.'
    },
    'elev-piernas': {
      nombre: 'Sollevamento gambe alla sbarra', zona: 'core', musc: ['Addome basso', 'flessori, presa'], equipo: 'Sbarra per trazioni',
      cues: ['Appenditi attivo (spalle lontane dalle orecchie)', 'Porta le ginocchia al petto SENZA dondolare', 'Scendi controllato fino in fondo'],
      err: ['Dondolarsi', 'Tirare solo coi flessori dell\'anca a lombare inarcata'],
      alt: [{ n: 'Alle parallele (appoggio sui gomiti)', por: 'se la presa cede prima dell\'addome' }, { n: 'Sollevamenti da sdraiato', por: 'versione iniziale' }],
      mol: 'Se la spalla dà fastidio da appeso: passa direttamente alle parallele.'
    },
    'rueda-abdominal': {
      nombre: 'Ab wheel', zona: 'core', musc: ['Core anteriore completo'], equipo: 'Ab wheel',
      cues: ['In ginocchio, bacino in retroversione PRIMA di partire', 'Rotola fino a dove controlli la lombare', 'Torna tirando con l\'addome, non con le braccia'],
      err: ['Inarcare la lombare in estensione (l\'errore che fa infortunare)', 'Andare più lontano di quanto il core regga'],
      alt: [{ n: 'Crunch al cavo', por: 'se oggi la rotella è troppo' }, { n: 'Plank con zavorra', por: 'isometrico equivalente' }],
      mol: 'Se la lombare dà fastidio: dimezza l\'escursione e guadagna range settimana dopo settimana.'
    },
    'crunch-polea': {
      nombre: 'Crunch al cavo', zona: 'core', musc: ['Retto addominale'], equipo: 'Cavo alto + corda',
      cues: ['In ginocchio, corda ai lati della testa', 'Flettiti DALLE COSTOLE, non dall\'anca', 'Gomiti verso le ginocchia, espira scendendo'],
      err: ['Tirare con le braccia', 'Sedersi all\'indietro muovendo solo l\'anca'],
      alt: [{ n: 'Crunch alla macchina', por: 'equivalente' }, { n: 'Ab wheel', por: 'quando vuoi alzare il livello' }],
      mol: 'Nessun problema tipico se fletti dalle costole.'
    },

    /* — Braccia — */
    'curl-barra-z': {
      nombre: 'Curl con bilanciere EZ', zona: 'tiron', musc: ['Bicipiti'], equipo: 'Bilanciere EZ',
      cues: ['Gomiti incollati al corpo, FISSI', 'Sali senza dondolare, scendi in 2-3″', 'Polsi neutri grazie alla EZ'],
      err: ['Dondolare il corpo per alzare più peso', 'Gomiti che viaggiano in avanti in alto'],
      alt: [{ n: 'Curl alternato con manubri', por: 'con rotazione (supinazione), molto completo' }, { n: 'Curl al cavo basso', por: 'tensione continua' }],
      mol: 'Se polso o gomito danno fastidio: manubri con rotazione o presa a martello.'
    },
    'curl-inclinado': {
      nombre: 'Curl su panca inclinata', zona: 'tiron', musc: ['Bicipiti (capo lungo)'], equipo: 'Manubri + panca a 45-60°',
      cues: ['Panca a 45-60°, braccia che PENDONO verticali', 'Lo stiramento in basso è lo stimolo: non tagliarlo', 'Gomiti fermi, sali senza alzare le spalle'],
      err: ['Portare avanti i gomiti', 'Mezza ripetizione in basso'],
      alt: [{ n: 'Curl bayesian al cavo', por: 'stesso stiramento, in piedi' }],
      mol: 'Se la spalla tira in basso: alza di una tacca lo schienale.'
    },
    'curl-martillo': {
      nombre: 'Hammer curl', zona: 'tiron', musc: ['Brachiale', 'avambraccio'], equipo: 'Manubri',
      cues: ['Presa neutra (a martello), gomiti fermi', 'Puoi farlo alternato o insieme', 'Controlla la discesa'],
      err: ['Dondolio', 'Trasformarlo in un rematore alzando i gomiti'],
      alt: [{ n: 'Hammer curl con corda al cavo', por: 'variante' }],
      mol: 'È il curl più gentile con gomiti e polsi: di solito è il RIFUGIO quando gli altri danno fastidio.'
    },
    'curl-polea': {
      nombre: 'Curl al cavo basso', zona: 'tiron', musc: ['Bicipiti'], equipo: 'Cavo basso + barra',
      cues: ['Un passo indietro dal cavo, gomiti fermi', 'Tensione continua: non riposare né in alto né in basso', 'Ultima serie: tieni 10″ in isometria a metà per chiudere'],
      err: ['Avvicinarsi tanto che il tratto basso perde tensione', 'Dondolarsi'],
      alt: [{ n: 'Curl con bilanciere EZ', por: 'equivalente coi pesi liberi' }],
      mol: 'Se il gomito dà fastidio: presa più larga o corda a martello.'
    }
  };

  /* ---------- LE 8 REGOLE ---------- */
  const REGLAS = [
    { n: 1, t: 'RPE sotto controllo', d: 'Ogni fase ha il suo tetto di sforzo. Il tuo sistema nervoso si ricorda di essere stato un atleta; i tuoi tendini sono stati 5 anni sul divano. Frena tu prima che frenino loro.' },
    { n: 2, t: 'Doppia progressione', d: 'Prima sali di ripetizioni dentro il range, poi sali di peso (+2,5 kg; +5 kg in squat e stacco rumeno). Solo se la tecnica è stata pulita in TUTTE le serie. L\'app te lo suggerisce da sola.' },
    { n: 3, t: 'Bilancia = media settimanale', d: 'Pesati lunedì-mercoledì-venerdì a digiuno e guarda solo la media. Un giorno singolo non significa niente (acqua, sale, creatina).' },
    { n: 4, t: 'Proteine: 190 g in 4 pasti', d: 'Colazione, pranzo, cena e uno spuntino prima di dormire. Nessun pasto sotto i 38-40 g. È la variabile che decide se i chili che perdi sono grasso o muscolo.' },
    { n: 5, t: '8.000–10.000 passi al giorno', d: 'Tutti i giorni, che ti alleni o no. Bruciano più calorie a settimana delle sessioni stesse.' },
    { n: 6, t: 'Sonno 7–8 h: non negoziabile', d: 'Non è un obiettivo, è una regola: dormire 5,5 h in deficit trasforma la perdita in −55% grasso e +60% muscolo (Nedeltcheva 2010). Caffeina forte solo prima delle 13-14.' },
    { n: 7, t: 'Un giorno saltato non si recupera', d: 'Non raddoppiare le sessioni né tagliare il cibo il giorno dopo. Segui il calendario da dove tocca.' },
    { n: 8, t: 'Minimo non negoziabile', d: 'Il tuo schema storico è 3 mesi a tutta / 3 a zero. La settimana caotica ha un pavimento: 2 pesi + 1 cardio. Quello mantiene tutto.' }
  ];

  const SENALES = 'Segnali per fermare un esercizio quel giorno: dolore acuto a ginocchio, spalla o lombare durante il movimento; fastidio che peggiora serie dopo serie invece di sparire scaldandoti. Indolenzimento diffuso 24-48 h dopo = normale. Dolore articolare localizzato che persiste più di 5 giorni = fisioterapista prima di continuare a caricare.';

  /* ---------- NUTRIZIONE ---------- */
  const NUTRI = {
    calorias: [
      { c: 'Metabolismo basale (Mifflin-St Jeor)', v: '~1.950 kcal', n: '95,1 kg · 183 cm · 30 anni' },
      { c: 'Dispendio totale stimato (piano in corso)', v: '2.850–3.000 kcal', n: 'Allenamenti + 8-10k passi' },
      { c: 'Apporto obiettivo', v: '2.250–2.400 kcal', n: 'Deficit ~550–700 kcal/giorno (di più frena il recupero del muscolo: Murphy & Koehler 2022)' },
      { c: 'Ritmo di perdita atteso', v: '0,6–0,75 kg/sett', n: '≈0,7% del peso/sett, il punto ottimale per trattenere massa magra (Garthe 2011). Media settimanale, non giorno per giorno' }
    ],
    fases: [
      { f: 'F1–F2 (sett 1-5)', kcal: 2250, p: 190, g: 70, c: 205 },
      { f: 'F3 (sett 6-9)',    kcal: 2350, p: 190, g: 70, c: 230, nota: 'Settimana 7: DIET BREAK a ~2.800' },
      { f: 'F4 (sett 10-12)',  kcal: 2400, p: 190, g: 70, c: 240 }
    ],
    escalado: 'Le proteine non si toccano mai: 190 g ≈ 2,5 g/kg di massa magra, il range che l\'evidenza chiede in deficit (Helms 2014). Quando sale il volume di allenamento sale solo il carboidrato. In pratica: in F3 aggiungi un frutto + 40 g di pane a pranzo nei giorni di allenamento; in F4, la stessa cosa tutti i giorni.',
    tomas: 'QUATTRO pasti proteici al giorno, nessuno sotto i 38-40 g: colazione, pranzo, cena e uno spuntino pre-nanna (skyr + whey). Comanda il totale giornaliero, ma dividerlo in 4 spreme la sintesi proteica e toglie la fame notturna.',
    plato: [
      { t: 'Proteine (a ogni pasto)', d: '200-250 g di pollo/tacchino/pesce bianco a crudo, o 170-180 g di salmone/manzo, o 3 uova + 2 albumi, o 250 g di skyr + whey. Riferimento visivo: un palmo e mezzo della mano.' },
      { t: 'Carboidrati', d: '60-75 g a crudo di riso/pasta, o 250-300 g di patate, o 60 g di pane integrale, o 50 g di avena. Riferimento: un pugno.' },
      { t: 'Verdura', d: 'Metà piatto, libera. Volume e sazietà.' },
      { t: 'Grassi', d: '10 g di olio EVO per pasto principale (un cucchiaio) e stop. È da lì che scappano le calorie senza che te ne accorga.' }
    ],
    suplementos: [
      { t: 'Creatina monoidrato', d: '5 g al giorno, a qualsiasi ora, senza fase di carico, da subito. AVVISO: trattiene 1-2 kg d\'acqua le prime settimane. Non è grasso: fidati del girovita e della media settimanale, non del numero singolo (l\'app lo segna sul grafico).' },
      { t: 'Whey', d: '1 misurino nello spuntino pre-nanna con lo skyr (e un altro dove serve nei giorni corti di proteine).' },
      { t: 'Caffeina', d: 'Stop alle 13-14: 200 mg alterano il sonno fino a 13 h dopo; un caffè, ~9 h (Gardiner 2023). Allenamento al mattino: caffè 30-45′ prima, perfetto. Di pomeriggio-sera: niente caffeina — il tuo pre-workout è la merenda (frutta + skyr 60-90′ prima).' },
      { t: 'Opzionali sensati', d: 'Vitamina D solo se le analisi escono sotto i 30 ng/mL (probabile con vita al chiuso). Omega-3 ~2 g EPA+DHA/giorno: beneficio modesto ma reale sulla forza e angolo antinfiammatorio/tendine.' },
      { t: 'NON spendere in', d: 'Brucia-grassi, BCAA/EAA (ridondanti con 190 g di proteine), "testo booster". Niente di tutto questo sposta l\'ago.' }
    ],
    hidratacion: 'Acqua: 2,5–3 L/giorno. Alcol: conta calorie e blocca il recupero — dentro il pasto libero, fuori dal resto della settimana.',
    comidaLibre: 'UN pasto a settimana (sabato di default), non un giorno intero. Ordini o mangi quello che ti va in quantità normale, senza compensare né prima né dopo. Serve a far reggere il piano per 12 settimane e una vita sociale. Se c\'è un impegno un altro giorno, si sposta — ma resta uno.'
  };

  /* ---------- RICETTE ---------- */
  // q in grammi salvo unità indicata · macro per porzione
  const RECETAS = [
    {
      id: 'bol-skyr', nombre: 'Bowl di skyr', tipo: 'Colazione A', tiempo: '5′', cocina: 'Niente fornelli',
      macros: { kcal: 520, p: 35, g: 11, c: 72 },
      ing: [
        { q: '250 g', i: 'skyr al naturale (o quark magro 0%)' },
        { q: '50 g', i: 'fiocchi d\'avena' },
        { q: '1 pz (120 g)', i: 'banana' },
        { q: '10 g', i: 'noci' },
        { q: 'q.b.', i: 'cannella' }
      ],
      pasos: [
        'Skyr nella ciotola e avena sopra (così com\'è se ti piace la consistenza, o ammollata 5′ in un dito di latte o acqua).',
        'Banana a rondelle, noci spezzate con le mani e cannella sopra.'
      ],
      tips: 'Se ti alleni al mattino: montala la sera prima (l\'avena ammollata ci guadagna). Giorno corto di proteine: +1 misurino di whey mescolato allo skyr (+110 kcal, +23 g P).'
    },
    {
      id: 'tortilla-pan', nombre: 'Frittata con pane e pomodoro', tipo: 'Colazione B', tiempo: '10′', cocina: 'Padella',
      macros: { kcal: 470, p: 34, g: 22, c: 32 },
      ing: [
        { q: '3 pz', i: 'uova M' },
        { q: '2 pz (o 100 ml in brik)', i: 'albumi' },
        { q: '60 g (2 fette)', i: 'pane integrale' },
        { q: '100 g', i: 'pomodoro grattugiato' },
        { q: '5 g', i: 'olio EVO' },
        { q: 'un pizzico', i: 'sale' }
      ],
      pasos: [
        'Sbatti uova e albumi col sale.',
        'Padella antiaderente a fuoco medio coi 5 g di olio EVO: rapprendi la frittata al punto che ti piace.',
        'Tosta il pane e mettici sopra il pomodoro grattugiato con una goccia dell\'olio della padella.'
      ],
      tips: 'Gli albumi in brik tolgono la pigrizia di separare le uova. Versione strapazzata: stesso tempo, zero tecnica.'
    },
    {
      id: 'pollo-asado', nombre: 'Pollo al forno con patate', tipo: 'Pranzo · batch della domenica', tiempo: '45′ di forno (dal meal prep)', cocina: 'Forno',
      macros: { kcal: 780, p: 70, g: 19, c: 68 },
      ing: [
        { q: '250 g a crudo (~200 g cotto)', i: 'petto di pollo', n: 'batch: 1,2 kg = 5 porzioni' },
        { q: '300 g', i: 'patate a spicchi + peperone + cipolla al forno', n: 'batch: 1,5 kg di patate + 2 peperoni + 2 cipolle' },
        { q: '10 g', i: 'olio EVO (parte della teglia)' },
        { q: 'q.b.', i: 'paprika, aglio in polvere, sale, origano' }
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
      id: 'lentejas-pollo', nombre: 'Lenticchie col pollo', tipo: 'Pranzo · batch della domenica', tiempo: '25′ in pentola', cocina: 'Pentola',
      macros: { kcal: 760, p: 52, g: 16, c: 80 },
      ing: [
        { q: '250 g sgocciolate', i: 'lenticchie già cotte in barattolo', n: 'batch: 2 barattoli = 3 porzioni' },
        { q: '120 g', i: 'pollo al forno a striscioline (dalla teglia)' },
        { q: '¼ pz', i: 'cipolla' },
        { q: '½ pz', i: 'peperone' },
        { q: '1 pz', i: 'carota' },
        { q: '4 g', i: 'olio EVO (parte del soffritto)' },
        { q: '1 cucchiaino / ½ cucchiaino', i: 'paprika / cumino' },
        { q: '150 ml', i: 'brodo o acqua' },
        { q: '1 pezzo', i: 'frutta come dessert' }
      ],
      pasos: [
        'Soffritto 8′: cipolla, peperone e carota tritati con 10 g di olio EVO (per il batch da 3 porzioni).',
        'Aggiungi le lenticchie sgocciolate, il brodo, paprika e cumino: 15′ a fuoco basso.',
        'Spegni e mescolaci il pollo a striscioline (così non si secca).'
      ],
      tips: 'In barattolo e senza ammollo: il legume più veloce che esista. Il giorno dopo si addensano: aggiungi un dito d\'acqua quando riscaldi.'
    },
    {
      id: 'salteado-ternera', nombre: 'Straccetti di manzo saltati', tipo: 'Pranzo · 15′ al momento', tiempo: '15′', cocina: 'Wok / padella',
      macros: { kcal: 730, p: 45, g: 20, c: 60 },
      ing: [
        { q: '180-200 g', i: 'manzo magro a striscioline' },
        { q: '70 g a crudo (≈ 180 g cotto)', i: 'riso', n: 'usa quello del batch' },
        { q: '250 g', i: 'verdure miste: peperone, cipolla, zucchina, carota' },
        { q: '15 ml', i: 'salsa di soia' },
        { q: '8 g', i: 'olio EVO' }
      ],
      pasos: [
        'Wok o padella BEN calda con l\'olio EVO: rosola il manzo 1-2′ e mettilo da parte (se lo lasci lì, si lessa e diventa duro).',
        'Stessa padella: verdure a striscioline 5-6′, che restino al dente.',
        'Rimetti il manzo, soia, 1′ di salto e tutto sopra il riso.'
      ],
      tips: 'L\'ordine è tutto: carne fuori prima delle verdure. Chiedi in macelleria "straccetti da saltare" e ti risparmi di tagliare.'
    },
    {
      id: 'salmon-arroz', nombre: 'Salmone con riso e broccoli', tipo: 'Cena · 15′', tiempo: '15′', cocina: 'Piastra o forno',
      macros: { kcal: 760, p: 40, g: 28, c: 62 },
      ing: [
        { q: '170-180 g', i: 'filetto di salmone' },
        { q: '75 g a crudo (≈ 190 g cotto)', i: 'riso', n: 'dal batch' },
        { q: '200 g', i: 'broccoli' },
        { q: '½ pz', i: 'limone' },
        { q: 'un pizzico', i: 'sale' }
      ],
      pasos: [
        'Broccoli al micro in una ciotola coperta con un dito d\'acqua: 4-5′ (o al vapore).',
        'Salmone in padella 3-4′ per lato partendo dalla pelle (o forno a 200°, 12′). Senza olio: il suo ce l\'ha già.',
        'Riso riscaldato, limone spremuto sopra tutto.'
      ],
      tips: 'Il grasso del salmone conta come il grasso del pasto: per questo qui non c\'è olio EVO.'
    },
    {
      id: 'merluza-patata', nombre: 'Nasello con patate al forno', tipo: 'Cena · 20′', tiempo: '20′', cocina: 'Forno o micro+piastra',
      macros: { kcal: 740, p: 55, g: 15, c: 55 },
      ing: [
        { q: '250 g', i: 'nasello o branzino a filetti' },
        { q: '250 g', i: 'patate' },
        { q: 'una ciotola', i: 'insalata verde (lattuga, pomodoro, cipolla)' },
        { q: '10 g', i: 'olio EVO (5 patate + 5 insalata)' },
        { q: '1 pz', i: 'skyr come dessert' }
      ],
      pasos: [
        'Patate a fette di ½ cm: micro 8′ coperte (o al forno 25′ con 5 g di olio EVO, sale e origano).',
        'Nasello: forno a 200° 10-12′, o piastra 3′ per lato. Punto giusto: quando si sfalda in scaglie.',
        'Insalata con 5 g di olio EVO e aceto. Skyr come dessert e cena chiusa.'
      ],
      tips: 'Il pesce bianco è la proteina più saziante per caloria di tutto il piano: usalo nei giorni di più fame.'
    },
    {
      id: 'revuelto-gambas', nombre: 'Uova strapazzate coi gamberi', tipo: 'Cena · 10′', tiempo: '10′', cocina: 'Padella',
      macros: { kcal: 620, p: 45, g: 30, c: 25 },
      ing: [
        { q: '3 pz', i: 'uova M' },
        { q: '150 g', i: 'gamberi sgusciati (surgelati vanno benissimo)' },
        { q: '40 g', i: 'pane integrale' },
        { q: 'una ciotola', i: 'insalata verde' },
        { q: '8 g', i: 'olio EVO' },
        { q: '1 spicchio', i: 'aglio' }
      ],
      pasos: [
        'Dora l\'aglio a lamelle con l\'olio EVO; gamberi 2′ (scongelati e asciugati prima).',
        'Abbassa il fuoco, aggiungi le uova sbattute e mescola SENZA FERMARTI fino a renderle cremose. Via dal fuoco prima che rapprendano del tutto.',
        'Pane tostato e insalata a fianco.'
      ],
      tips: 'Le uova strapazzate finiscono di cuocersi fuori dal fuoco. Gamberi surgelati: scongelali in una ciotola d\'acqua fredda in 10′.'
    },
    {
      id: 'toma-noche', nombre: 'Spuntino pre-nanna', tipo: 'Pasto 4 · quotidiano', tiempo: '1′', cocina: 'Niente fornelli',
      macros: { kcal: 270, p: 49, g: 2, c: 14 },
      ing: [
        { q: '250 g', i: 'skyr o quark magro 0%' },
        { q: '1 misurino (30 g)', i: 'whey (il gusto che non ti stufa)' },
        { q: 'q.b.', i: 'cannella' }
      ],
      pasos: [
        'Mescola il misurino di whey con lo skyr fino a consistenza di mousse. Cannella sopra.',
        '30-60′ prima di andare a letto. Fine.'
      ],
      tips: 'Questo spuntino è quello che porta la giornata a ~190 g di proteine e ammazza la fame notturna, il momento in cui muoiono le diete. La caseina del latte, a digestione lenta, lavora mentre dormi.'
    },
    {
      id: 'ensalada-atun', nombre: 'Insalatona di tonno', tipo: 'Cena · 10′', tiempo: '10′', cocina: 'Senza fornelli (col batch)',
      macros: { kcal: 700, p: 45, g: 25, c: 50 },
      ing: [
        { q: '2 lattine (120 g sgocciolato)', i: 'tonno al naturale' },
        { q: '1 pz', i: 'uovo sodo (dal batch)' },
        { q: '150 g', i: 'patate lesse (dal batch)' },
        { q: '150 g', i: 'pomodoro' },
        { q: '30 g', i: 'olive' },
        { q: '¼ pz', i: 'cipolla rossa' },
        { q: '10 g', i: 'olio EVO' }
      ],
      pasos: [
        'Tutto nella ciotola: patate a dadini, pomodoro a spicchi, cipolla sottile, tonno sgocciolato, uovo in quarti, olive.',
        'Olio EVO, aceto, sale e una mescolata.'
      ],
      tips: 'La cena a sforzo zero se la domenica hai lessato patate e uova in più. Versione senza patate (giorno di poca fame): aggiungi più pomodoro.'
    }
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
  const MEALPREP = [
    { min: '0′',  paso: 'Forno a 200°. Sala e pepa 1,2 kg di petti e spalmali di paprika + aglio in polvere.' },
    { min: '5′',  paso: 'In forno: teglia 1 (petti, 25-30′) e teglia 2 (1,5 kg di patate a spicchi + 2 peperoni + 2 cipolle + 20 g di olio EVO, 40-45′).' },
    { min: '10′', paso: 'Pentola a fuoco medio: soffritto di cipolla, peperone e carota con 10 g di olio EVO.' },
    { min: '15′', paso: 'Pentolino 1: 400 g di riso a cuocere (12-15′). Pentolino 2: 6 uova (10′) + 2 patate medie (lasciale 20′): uova e patate per l\'insalatona di tonno.' },
    { min: '20′', paso: 'Nella pentola: 2 barattoli di lenticchie sgocciolate + 400 ml di brodo + paprika e cumino. Fuoco basso 20′.' },
    { min: '30′', paso: 'Petti fuori. Tagliane 250 g a striscioline per le lenticchie (si aggiungono a fuoco spento). Scola il riso e stendilo su una teglia perché raffreddi in fretta.' },
    { min: '45′', paso: 'Patate fuori dal forno. Gira, assaggia, sale se manca.' },
    { min: '60′', paso: 'Porziona: 5 contenitori da pranzo (2 pollo+patate, 2-3 lenticchie, riso in contenitore a parte per saltato/salmone) + uova sode e patate lesse in frigo.' },
    { min: '75′', paso: 'Etichetta e riponi: in frigo fino a mercoledì, in freezer quello di giovedì-venerdì (passalo in frigo la sera prima). Cucina in ordine mentre suona quello che vuoi.' }
  ];
  const MEALPREP_NOTA = 'Il pesce delle cene si fa fresco in 10 minuti: non si prepara la domenica. Pollo e riso reggono 4 giorni in frigo.';

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
  const CHECKPOINTS = [
    { sem: 4,  fecha: '2026-09-13', rango: [92.5, 93.5], si: 'Rivedi olio EVO e pasto libero; +1.000 passi/giorno. Ricorda: la creatina nasconde ~1 kg.' },
    { sem: 8,  fecha: '2026-10-11', rango: [90.0, 91.3], si: '−100 kcal di carboidrati solo nei giorni di riposo (la settimana 7 era diet break: la media può uscire alta ed è normale)' },
    { sem: 12, fecha: '2026-11-08', rango: [86.0, 88.0], si: 'Chiusura, foto, misure e blocco successivo. In grasso vero: ~−8 kg.' }
  ];
  const AJUSTES = [
    { id: 'rapido', cond: 'Perdi più di 1,0 kg/sett per due settimane di fila (scontando l\'effetto creatina)', accion: 'Aggiungi 150 kcal di carboidrati. Più veloce non è meglio: a quel ritmo il deficit si mangia il recupero del muscolo.' },
    { id: 'lento', cond: 'Perdi meno di 0,45 kg/sett per due settimane di fila (senza contare la settimana di diet break)', accion: 'Prima verifica passi e olio EVO; se è tutto pulito, sali di +1.500 passi PRIMA di tagliare kcal (protegge l\'allenamento).' },
    { id: 'rendimiento', cond: 'La resa in palestra cala per due sessioni di fila', accion: 'Guarda il sonno prima della dieta.' }
  ];
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
    { id: 'racha-7',        icon: '🔥', nombre: 'Striscia da 7',      desc: '7 giorni di fila chiudendo la giornata.' },
    { id: 'racha-14',       icon: '🔥', nombre: 'Striscia da 14',     desc: '14 giorni di fila. Lo schema on/off è morto.' },
    { id: 'racha-30',       icon: '🌋', nombre: 'Striscia da 30',     desc: '30 giorni di fila. Inarrestabile.' },
    { id: 'pasos-7',        icon: '👟', nombre: 'Settimana in cammino', desc: '7 giorni di fila raggiungendo i passi.' },
    { id: 'disco-10',       icon: 'disc10', nombre: 'Disco da 10',    desc: 'Fase 1 completata. L\'abitudine è tornata.', disco: true },
    { id: 'disco-15',       icon: 'disc15', nombre: 'Disco da 15',    desc: 'Fase 2 completata. Ormai sei dentro la palestra.', disco: true },
    { id: 'disco-20',       icon: 'disc20', nombre: 'Disco da 20',    desc: 'Fase 3 completata. Il carico vero ormai è tuo.', disco: true },
    { id: 'disco-25',       icon: 'disc25', nombre: 'Disco da 25',    desc: 'Fase 4 completata. Collezione completa.', disco: true },
    { id: 'kg-2',           icon: '📉', nombre: '−2 kg',              desc: 'Media settimanale 2 kg sotto la partenza.' },
    { id: 'kg-4',           icon: '📉', nombre: '−4 kg',              desc: '4 kg in meno di media settimanale.' },
    { id: 'kg-6',           icon: '📉', nombre: '−6 kg',              desc: '6 kg in meno. Metà della strada lunga.' },
    { id: 'kg-8',           icon: '📉', nombre: '−8 kg',              desc: '8 kg in meno di media settimanale.' },
    { id: 'kg-10',          icon: '🏔️', nombre: '−10 kg',             desc: 'Doppia cifra. Poche persone arrivano fin qui.' },
    { id: 'cintura-95',     icon: '📏', nombre: 'Girovita −95',       desc: 'Girovita sotto i 95 cm.' },
    { id: 'cintura-93',     icon: '📏', nombre: 'Girovita −93',       desc: 'Girovita sotto i 93 cm.' },
    { id: 'cintura-91',     icon: '👑', nombre: 'Metrica regina',     desc: 'Girovita sotto i 91 cm: meno della metà della tua statura.' },
    { id: 'pr-1',           icon: '🥇', nombre: 'Primo PR',           desc: 'Prima volta che superi il tuo miglior massimale in un esercizio.' },
    { id: 'pr-5',           icon: '🥇', nombre: '5 PR',               desc: 'Cinque record personali battuti.' },
    { id: 'pr-15',          icon: '🏆', nombre: '15 PR',              desc: 'Quindici PR. La memoria muscolare che paga i dividendi.' },
    { id: 'marca-banca',    icon: '🔓', nombre: 'Panca riconquistata', desc: 'Torni a muovere i tuoi 95 kg di panca piana. Cinque anni dopo.' },
    { id: 'marca-sentadilla', icon: '🔓', nombre: 'Squat riconquistato', desc: 'Torni a muovere i tuoi 100 kg di squat.' },
    { id: 'dominada-libre', icon: '🦍', nombre: 'Trazione libera',    desc: 'Prima trazione senza assistenza. Bentornato.' },
    { id: 'mealprep-4',     icon: '🍱', nombre: 'Chef della domenica', desc: '4 domeniche di fila di meal prep.' },
    { id: 'comeback',       icon: '🔁', nombre: 'Il ritorno',         desc: 'Sei tornato dopo 4 o più giorni fermo. Tornare conta più che cadere.' },
    { id: 'fotos-4',        icon: '📸', nombre: 'La sequenza',        desc: 'Tutte e 4 le foto di progresso fatte.' },
    { id: 'checkpoint-s4',  icon: '✅', nombre: 'Checkpoint S4',      desc: 'Peso dentro il corridoio o meglio alla settimana 4.' },
    { id: 'checkpoint-s8',  icon: '✅', nombre: 'Checkpoint S8',      desc: 'Peso dentro il corridoio o meglio alla settimana 8.' },
    { id: 'plan-completo',  icon: '🏁', nombre: 'BACK2PRIME',         desc: 'Piano di 12 settimane finito. 85 kg era la conseguenza, non la meta.' }
  ];

  /* ---------- LA SCIENZA DEL PIANO (revisione dell'evidenza · ago 2026) ---------- */
  const CIENCIA = {
    intro: 'Piano rivisto contro l\'evidenza (meta-analisi e trial 2010-2025, agosto 2026). L\'idea che mette in ordine tutto: chi torna non è un principiante — muscolo e sistema nervoso rientrano in fretta, ma il tendine non ha memoria. Il muscolo può correre; il tendine detta il ritmo.',
    temas: [
      { t: 'Memoria muscolare', d: 'Il recupero è reale e rapido: forza in ~8 settimane, volume in ~12. Il meccanismo (mionuclei vs epigenetica) è in discussione, ma l\'effetto no. Per questo la doppia progressione può andare più veloce che in un principiante — e proprio per questo NON si comprime il calendario: chi non corre è il tendine.', ref: 'Rahmati 2022 (meta-analisi, J Cachexia Sarcopenia Muscle) · Cumming 2024 (J Physiol)' },
      { t: 'Tendine: il fattore limitante', d: 'Il collagene tendineo si rinnova ~10× più lentamente del muscolo. Cosa lo adatta davvero: carichi alti con contrazioni lente da ~3″ (HSR) e isometrie al 70% (5×45″), che in più tolgono il dolore all\'istante. La pliometria è un cattivo stimolo tendineo: niente salti per «preparare» la corsa.', ref: 'Mersmann 2017 (Front Physiol) · Rio 2015 (BJSM) · Kongsgaard (HSR)' },
      { t: 'Correre a 95 kg', d: 'In sovrappeso, partire con più di 3 km/sett di corsa fa schizzare gli infortuni (~31-48% in più). Alzare la cadenza a 170-180 riduce l\'impatto tibiale di ~11%. La progressione sicura non è la "regola del 10%": è non superare ~1,3× la tua media delle ultime 4 settimane.', ref: 'Bertelsen 2018 (RCT su principianti in sovrappeso) · revisione sulla cadenza 2025 · consenso CIO sul carico' },
      { t: 'Deficit ottimale', d: 'Un deficit oltre ~500-600 kcal annulla la crescita del muscolo anche se alleni la forza. Il ritmo ottimale per trattenere massa magra è ~0,7% del peso/settimana. Per questo il piano perde a 0,6-0,75 kg/sett e non a 0,9.', ref: 'Murphy & Koehler 2022 (meta-analisi, 59 studi) · Garthe 2011' },
      { t: 'Proteine', d: 'In deficit, gli allenati hanno bisogno di 2,3-3,1 g/kg di massa magra. 190 g ti mettono comodo nel range, e dividerli in 4 pasti da ≥40 g spreme la sintesi proteica e controlla la fame.', ref: 'Helms 2014 (revisione sistematica) · Schoenfeld & Aragon (distribuzione per pasto)' },
      { t: 'Diet break', d: 'Alternare deficit e pause a mantenimento ha attenuato il calo metabolico e migliorato la perdita di grasso nello studio MATADOR. In 12 settimane il suo valore principale per il tuo profilo on/off è un altro: ti insegna che fermarti UNA settimana con un piano non è ricadere.', ref: 'Byrne 2018 (Int J Obesity, MATADOR)' },
      { t: 'Il volume giusto', d: 'Più serie = più muscolo ma con rendimenti decrescenti, e in deficit l\'eccesso aggiunge solo fatica e rischio. Bersaglio: ~10 serie/muscolo/sett in F2 e 12-18 in F3-F4. E il minimo non negoziabile (2 pesi + 1 cardio) ha basi solide: con quello il muscolo si CONSERVA davvero.', ref: 'Pelland 2025 (Sports Medicine) · Androulakis-Korakakis 2020 (dose minima)' },
      { t: 'Scarico fatto bene', d: 'Fermarsi del tutto per una settimana costa forza; quello che funziona è dimezzare il volume mantenendo il peso sul bilanciere. Per questo la settimana 9 è uno scarico OBBLIGATORIO di quel tipo, e la 10 (salto a 5 giorni) parte con una serie in meno su tutto.', ref: 'Coleman 2024 (PeerJ, RCT sullo scarico)' },
      { t: 'Sonno', d: 'Dormire 5,5 h in deficit (vs 8,5) ha ridotto il grasso perso del 55% e moltiplicato la perdita di muscolo. È, dopo proteine e deficit, la tua leva più grande. Da lì il taglio della caffeina alle 13-14: 200 mg alterano il sonno fino a 13 h dopo.', ref: 'Nedeltcheva 2010 (Ann Intern Med) · Gardiner 2023 (Sleep Med Rev)' },
      { t: 'Prima la salute', d: 'Dopo 5 anni da sedentario con BMI 28, prima di passare al lavoro intenso di F3-F4: pressione arteriosa e analisi di base (lipidi, glicemia/HbA1c). Con sintomi di qualsiasi tipo, medico prima di continuare.', ref: 'ACSM Preparticipation Health Screening' }
    ]
  };

  const CIERRE = 'Il vero obiettivo del piano non è l\'8 novembre: è arrivare a dicembre allenandoti 4 giorni per abitudine, senza ciclo on/off. Il peso è la conseguenza, non la meta.';

  const AVISO_LEGAL = 'Piano elaborato il 13 ago 2026 (v2, rivisto contro l\'evidenza scientifica quello stesso giorno) con i dati: uomo, 30 anni, 183 cm, 95,1 kg, polso 16,1 cm, punto di partenza sedentario con un passato ad alto livello. Stime di kcal e macro con margine del ±10%: le regole di aggiustamento correggono quel margine con dati reali. Non sostituisce il parere medico; davanti a qualsiasi patologia o dolore persistente, consulta un professionista sanitario.';

  /* ---------- TESTI DI INTERFACCIA (traducibili come il resto) ----------
     Template con {x}: app.js li riempie con tpl(). Al cambio di lingua
     si carica assets/data.<lang>.js, che sostituisce TUTTO window.B2P.   */
  const UI = {
    lang: 'it',
    tabs: ['Oggi', 'Piano', 'Cibo', 'Progressi', 'Traguardi'],
    dias: ['lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica'],
    meses: ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'],
    hoyTag: 'OGGI',
    semanaLinea: 'Settimana {w} di 12 · Fase {f} · {n} · RPE tetto {r}',
    empiezaEnDias: 'Parte tra {n} giorni', empiezaEn1: 'Parte tra 1 giorno', empiezaLunes: 'Parte lunedì',
    preplanSub: 'Lunedì 17 agosto · Fase 1 a casa. Nel frattempo, lascia pronta la linea di base:',
    prepCintura: 'Misurati il girovita a digiuno (all\'altezza dell\'ombelico)',
    prepFotos: 'Foto giorno 0: fronte e profilo, stessa luce che userai sempre',
    prepCompra: 'Spesa della settimana 1 (lista in Cibo)',
    prepBascula: 'Decidi dove e quando ti pesi: lunedì-mercoledì-venerdì a digiuno',
    practicaMenu: 'Puoi provare il menù fin da ora: lunedì 17 si fa sul serio.',
    descanso: 'Riposo', domingoPrep: 'Domenica: riposo + meal prep', planCompletado: 'Piano completato',
    calentamiento: '🔥 Riscaldamento · 6′',
    sesionSub: '{d} · recuperi su ogni riga (tocca per cronometrare)',
    tendonNombre: 'Protocollo tendini',
    cardioHecho: '✓ Cardio fatto', cardioMarcar: 'Segna cardio fatto', minutosReales: 'Minuti reali:',
    cadenciaSub: 'Cadenza 170-180 · falcata corta', recuperacionSub: 'Recupero attivo', opcional: 'opzionale',
    tibialisAviso: '🛡 Prima: tibialis raises 2×20 (protocollo tendini).',
    diaADia: 'Il giorno per giorno',
    hPasos: '8-10k passi', hPasosSub: 'Tutti i giorni',
    hProte: 'Proteine 4/4', hProteSub: '4 pasti ≥40 g',
    hPeso: 'Peso a digiuno', hPesoSub: 'Media settimanale, non il giorno singolo',
    hCintura: 'Girovita (lunedì)', hCinturaSub: 'La metrica regina · all\'ombelico, senza stringere',
    hPrep: 'Meal prep', hPrepSub: '~90′ e settimana sistemata',
    hFoto: 'Foto di progresso', hFotoSub: 'Fronte e profilo, stessa luce',
    pesoGuardado: 'Peso salvato: {v} kg', cinturaGuardada: 'Girovita: {v} cm',
    marcarHecho: 'Segna come fatto', usarPeso: 'Usa questo peso',
    diaAnterior: 'Giorno precedente', diaSiguiente: 'Giorno successivo',
    cerrarPanel: 'Chiudi', panelSinTitulo: 'Dettaglio',
    ajIdiomaSinRed: 'Offline: non è stato possibile scaricare quella lingua.',
    versionNueva: 'Nuova versione · tocca per aggiornare',
    quizTitulo: 'I tuoi gusti', quizPista: 'Scorri: destra mi piace, sinistra no',
    quizSi: 'Mi piace', quizNo: 'Non fa per me', quizDeshacer: 'Annulla', quizSaltar: 'Salta',
    quizListo: 'Fatto', quizResumen: 'Ti piacciono {a} su {b}. Affinerà il tuo piano.',
    quizCatEj: 'Esercizio', quizCatDep: 'Sport', quizCatCom: 'Piatto',
    gPeso: 'Grafico del peso corporeo', gCintura: 'Grafico del girovita',
    gCargas: 'Grafico dei carichi', gAdherencia: 'Grafico di aderenza settimanale',
    gRango: '{n} rilevazioni, da {a} a {b} {u}', gUnico: '1 rilevazione, {a} {u}',
    gSemanas: '{n} settimane su 12 con dati',
    gSinDatos: 'ancora nessun dato',
    fSinRegistro: 'Qui non hai ancora registrato nessun peso. Appena lo farai, vedrai quanto manca.',
    valFuera: 'Inserisci un valore tra {a} e {b} {u}.', descargaDosis: 'scarico',
    hechosDe: 'Fatti {a} su {b} · da {c} conta come sessione',
    cerrarSinSesion: 'Chiudi senza sessione', diaCerradoSinRacha: '✓ Giornata chiusa',
    sinRachaHoy: 'Oggi non conta per la serie.', mejorRachaNota: 'Il tuo record: {n} giorni.',
    sinSesionToast: 'Giornata chiusa senza sessione: oggi non conta.',
    reabrirDia: 'Riapri la giornata', diaReabierto: 'Giornata riaperta', mejorLbl: 'Record',
    cerrarDia: 'Chiudi la giornata', diaCerradoBtn: '✓ Giornata chiusa · striscia {n}',
    diaCerradoToast: '✓ Giornata chiusa. Striscia: {n}', diaCerradoSolo: 'Giornata chiusa.',
    sigueEditando: 'Puoi continuare a modificare: si salva tutto da solo.',
    comidaHoy: 'Il cibo di oggi', comidaHoySub: '{kcal} kcal · {p} g di proteine in 4 pasti',
    desayuno: 'Colazione', comidaLbl: 'Pranzo', cena: 'Cena', presueno: 'Pre-nanna',
    comidaLibreMn: 'PASTO LIBERO', comidaLibreTitulo: 'Pasto libero', comidaLibreTag: 'un pasto, non un giorno', tuya: 'tuo',
    dietBreakChip: 'Diet break: +2 porzioni di carboidrati oggi. Proteine uguali.',
    extraChip: '➕ Extra F{f}: un frutto + 40 g di pane a pranzo.',
    sugEmpieza: '◆ parti con {v}', sugRepite: '↻ ripeti {v}',
    faltaTitle: 'Tocca se NON hai completato tutte le reps',
    repsAMediasToast: 'Segnato: reps mancate (ripeterai il peso)', repsLimpiasToast: 'Tutte le reps pulite',
    repsAMediasTag: 'reps a metà', repsLimpias: 'reps pulite', repsCortas: 'reps mancate',
    prToast: '🥇 PR in {e}: {v} kg', ya: 'ORA!',
    fHistorial: 'Il tuo storico', fMejor: 'migliore {v} kg', fHoy: 'oggi',
    fComo: 'Come si fa', fErrores: 'Errori che ti ruberanno progressi', fAlt: 'Alternative equivalenti',
    fArranque: 'Partenza suggerita', fArranqueTxt: '{v} kg alla settimana 3.',
    fMarca: '🔓 Il tuo massimale di allora: {t}',
    fFaltan: 'Ti mancano {v} kg per riprendertelo. C\'è un traguardo che ti aspetta.',
    fRecuperada: 'Riconquistato. Quel peso è di nuovo tuo.',
    fVideo: '▶ Guarda la tecnica in video',
    fDomiBtn: '🦍 Oggi è uscita la mia prima trazione SENZA assistenza!', fDomiOk: '🦍 Registrata', fDomiYa: '🦍 Trazione libera già registrata',
    segPlan: ['Fasi', 'Regole', 'Esercizi', 'Scienza'],
    vReglas8: 'Le 8 regole', vReglasSub: 'nel dubbio, vince la regola',
    vCalendario: 'Calendario', vFasesDetalle: 'Le 4 fasi, nel dettaglio',
    vSeguros: 'Le assicurazioni del piano', vBiblioteca: 'Libreria degli esercizi', vTocaCualquiera: 'toccane uno qualsiasi',
    vCiencia: 'La scienza del piano',
    senalesTitulo: 'Segnali per fermarsi', objetivoReal: 'Il vero obiettivo', recuerda: 'Ricorda',
    fase: 'Fase', sem: 'Sett', fechasLbl: 'Date', especial: 'Speciale', fuerzaLbl: 'Pesi',
    seriesLbl: 'Serie', descLbl: 'Rec.', ejercicioLbl: 'Esercizio', diaLbl: 'Giorno',
    cardioFase: 'Cardio della fase',
    zonas: { empuje: 'Spinta', tiron: 'Tirata', pierna: 'Gambe e anca', core: 'Core' },
    chipsNutri: ['Obiettivo', 'Il piatto', 'Ricette', 'Menù', 'Spesa', 'Meal prep', 'Integratori'],
    nObjetivo: 'Il tuo obiettivo adesso', nSemana: 'settimana {w}',
    nNumeros: 'Da dove escono i numeri', nPlato: 'Come montare ogni pasto',
    nRecetario: 'Ricettario', nToca: 'tocca per cucinare', nMenu: 'Menù settimanale',
    nCompra: 'La spesa della settimana', nPrepDom: 'Meal prep della domenica', nSupl: 'Integratori',
    nReiniciar: 'ricomincia', nProteLbl: 'Prote', nGrasaLbl: 'Grassi', nCarbosLbl: 'Carbo', kcalLbl: 'kcal',
    nDietBreakTitulo: 'Questa settimana: DIET BREAK', nDietBreakTxt: '~2.800 kcal: +2 porzioni di carboidrati al giorno. Proteine uguali. Allenamento uguale.',
    nTomaNota: '+ ogni sera: spuntino pre-nanna (skyr + whey). ',
    nIngredientes: 'Ingredienti (1 porzione)', nPasos: 'Passaggi', opcionalParen: ' (opzionale)',
    chipsProg: ['Riepilogo', 'Peso', 'Girovita', 'Carichi', 'Settimane', 'Checkpoint'],
    pPeso: 'Peso', pPerdido: 'Perso', pCintura: 'Girovita', pAdh: 'Aderenza', pSesiones: 'Sessioni', pRacha: 'Striscia',
    pMediaS: 'media S{w}', pSinDatos: 'niente dati', pDesde: 'da 95,1', pCinturaSub: '{f} · meta <91', pCinturaLunes: 'lunedì a digiuno',
    pFuerzas: '{a}/{b} pesi', pDeFuerza: 'di pesi', pDiasCumplidos: 'giorni chiusi',
    pPesoTitulo: 'Peso', pPesoSub: 'punti: pesate · linea: media settimanale · banda: corridoio atteso',
    pCinturaTitulo: 'Girovita', pCinturaTituloSub: 'la metrica regina · obiettivo <91 cm',
    pCargas: 'Carichi', pCargasSub: 'peso dell\'esercizio, sessione dopo sessione',
    pAdhTitulo: 'Aderenza', pAdhSub: 'sessioni di pesi completate a settimana',
    pChk: 'Checkpoint', pEsperado: 'Atteso', pReal: 'Reale', pSiDesvias: 'Se sbandi',
    pTabla: 'tabella', pGrafica: 'grafico', pFecha: 'Data',
    pLifts: { 'press-banca': 'Panca', 'sentadilla-barra': 'Squat', 'rdl-barra': 'Rumeno' },
    pTuMarca: 'il tuo massimale · {v} kg', pMeta91: 'meta 91', pAguaCreatina: 'acqua creatina', pLineaBase: 'Linea di base',
    pMediaSemana: 'Media S{w}',
    pVacioPeso: 'Le pesate di lunedì, mercoledì e venerdì appariranno qui',
    pVacioCintura: 'Ogni lunedì a digiuno: metro all\'ombelico, senza stringere',
    pVacioCargas: 'Appena registri dei kg in questo esercizio, qui vedrai la scalata',
    pVacioAdh: 'Settimana dopo settimana, qui si vedrà la tua costanza',
    pCheckpointSemana: 'Settimana di checkpoint', pEsperadoRango: 'Atteso: {a}–{b} kg', pLlevas: ' · sei a {v}', pSinPesajes: ' · ancora nessuna pesata questa settimana',
    pRapido: 'Stai andando troppo veloce', pLento: 'Ritmo sotto le attese',
    pFrenaTrote: 'Frena la corsa', pFrenaTxt: 'Questa settimana sei a {r}× la tua media recente di minuti di corsa. Sopra 1,3× il rischio di infortunio schizza: taglia o cammina.',
    lDiscos: 'La collezione di dischi', lDiscosSub: 'uno per ogni fase completata',
    lLogros: 'Traguardi', lFuerzas: 'Pesi', lPRs: 'PR', lPerdido: 'Perso', lMejorRacha: 'Miglior striscia', lLogrosN: 'Traguardi', lFotos: 'Foto',
    ajustes: 'Impostazioni', ajustesSub: 'BACK2PRIME · i tuoi dati vivono SOLO su questo dispositivo',
    ajLineaBase: 'Linea di base', ajCinturaIni: 'Girovita iniziale (cm)', ajGuardar: 'Salva linea di base', ajGuardado: 'Salvato',
    ajCopia: 'Copia di sicurezza',
    ajCopiaTxt: 'I dati non escono dal telefono. Fai una copia ogni tanto (o prima di cambiare dispositivo) e conservala dove vuoi.',
    ajExportar: '⬇ Esporta', ajImportar: '⬆ Importa', ajImportOk: 'Copia ripristinata', ajImportErr: 'Quel file non sembra una copia di BACK2PRIME',
    ajIdioma: 'Lingua', ajIdiomaNota: 'L\'app si ricarica al cambio. I tuoi dati non si toccano.',
    ajPeligro: 'Zona pericolosa', ajBorrar: 'Cancella tutti i dati', ajBorrarConfirma: 'Sicuro? Tocca di nuovo per cancellare TUTTO',
    obTitulo: 'Benvenuto in BACK2PRIME', obSub: '12 settimane · 17 ago → 8 nov · da 95 alla tua versione migliore',
    obTexto: 'Il tuo diario di allenamento, il tuo piano e la tua nutrizione in un unico posto. Segna quello che fai ogni giorno: l\'app ti suggerisce i pesi, sorveglia il tuo ritmo e sgancia traguardi. Tutto resta sul tuo telefono.',
    obConsejo: 'Consiglio: aggiungila alla schermata iniziale (Condividi → Aggiungi alla schermata Home) per usarla come una vera app.',
    obCintura: 'Girovita iniziale — la tua metrica regina', obPlaceholder: 'cm (opzionale, puoi farlo dopo)', obEmpezamos: 'Si parte',
    celebraOk: 'Avanti',
    nuevoDia: 'Nuovo giorno: {f}'
  };

  UI.checkSalidaTitulo = 'Check di uscita (dom 30 ago)';
  UI.checkSalidaTxt = 'Completi entrambi i circuiti con le reps della settimana 2 senza dolore articolare → Fase 2. Se qualcosa dà fastidio, ripeti una settimana: i tendini ringraziano.';
  UI.planEmpiezaTitulo = 'Il piano parte lunedì 17 agosto';
  UI.planEmpiezaTxt = 'Fase 1 · Riattivazione a casa. Qui hai tutto per arrivare coi compiti fatti.';

    const QUIZ_DEP = [{ id: 'running', n: 'Corsa' }, { id: 'natacion', n: 'Nuoto' }, { id: 'ciclismo', n: 'Ciclismo' }, { id: 'padel', n: 'Padel' }, { id: 'futbol', n: 'Calcio' }, { id: 'baloncesto', n: 'Basket' }, { id: 'volley', n: 'Pallavolo' }, { id: 'yoga', n: 'Yoga' }, { id: 'calistenia', n: 'Calisthenics' }, { id: 'boxeo', n: 'Boxe' }];
  return { META, FASES, CAL, HITOS_SEMANA, SESIONES, CALENTAMIENTO, TENDON, CARRERA, HISTORICO, ARRANQUE, EJERCICIOS, REGLAS, SENALES, NUTRI, RECETAS, COMPRA, MEALPREP, MEALPREP_NOTA, MENU, CHECKPOINTS, AJUSTES, FOTOS, LOGROS, CIENCIA, CIERRE, AVISO_LEGAL, QUIZ_DEP, UI };
})();
