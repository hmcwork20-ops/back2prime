/* ============================================================
   BACK2PRIME · data.de.js
   Der komplette Inhalt des 12-Wochen-Plans: Phasen, Kalender,
   Sessions, Übungskarten, Ernährung, Rezepte, Erfolge.
   Keine Logik: nur Daten. Die Logik lebt in app.js.
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
      objetivoNota: '≈ −8 kg echtes Fett: Kreatin versteckt ~1 kg Wasser auf der Waage',
      cinturaMetaCm: 91,
      grasaEstimada: '~22% → 16-17%',
      proteinaDia: 190
    }
  };

  /* ---------- PHASEN (Code der olympischen Hantelscheiben) ---------- */
  const FASES = [
    { id: 1, nombre: 'Reaktivierung', sub: 'Zuhause', semanas: [1, 2], disco: 10, rpe: '6–7',
      fechas: '17. – 30. Aug',
      objetivo: 'Die Gewohnheit wieder aufbauen und Bewegungsmuster wecken, ohne die Gelenke zu bestrafen. Du wirst Lust auf mehr haben: Das ist Absicht.' },
    { id: 2, nombre: 'Einstieg ins Gym', sub: 'Ganzkörper ×3', semanas: [3, 4, 5], disco: 15, rpe: '6–7',
      fechas: '31. Aug – 20. Sep',
      objetivo: 'Die Grundübungen mit der Langhantel neu lernen und eine Belastungsbasis aufbauen. Dein Muskelgedächtnis erlaubt Gewichte, die dein Bindegewebe noch nicht verkraftet: Arbeite bei 65-70% von dem, was du gefühlt könntest, IMMER mit 3 Wiederholungen in Reserve.' },
    { id: 3, nombre: 'Belastung', sub: 'Oberkörper / Beine ×4', semanas: [6, 7, 8, 9], disco: 20, rpe: '7–8',
      fechas: '21. Sep – 18. Okt',
      objetivo: 'Echtes Volumen und echte Intensität, um die Rekomposition zu erzwingen: Hier zahlt sich das Muskelgedächtnis wirklich aus. Beende jeden Satz so, dass 2 Wiederholungen mehr drin wären, und zwar echte: Wer zurückkommt, überschätzt gern, wie nah er am Muskelversagen ist.' },
    { id: 4, nombre: 'Peak', sub: 'Push / Pull / Legs ×5', semanas: [10, 11, 12], disco: 25, rpe: '8',
      fechas: '19. Okt – 8. Nov',
      objetivo: 'Maximaler Reiz, um die Rekomposition abzuschließen. {d} Tage, aber mit Sessions von 60-75 Minuten, nicht von 2 Stunden. RPE 8: 1-2 Wiederholungen in Reserve in den letzten Sätzen.' }
  ];

  /* ---------- KALENDER: 12 Wochen × 7 Tage (Mo..So) ----------
     Jeder Slot: Session-id, oder {s:id, opt:true} wenn optional.   */
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

  /* ---------- SPEZIALWOCHEN (Evidenz: gesteuerter Deload + Diet Break + Übergang) ---------- */
  const HITOS_SEMANA = {
    5:  { t: 'Gesundheitscheck', d: 'Vor Phase 3 (intensive Arbeit nach 5 Jahren Pause): Miss deinen Blutdruck in einer Apotheke und mach ein kleines Blutbild (Blutfette, Glukose/HbA1c). 15 Minuten, die dir Ruhe verschaffen.' },
    7:  { t: 'DIET BREAK', d: 'Die ganze Woche isst du auf Erhaltungsniveau (~2.800 kcal: +2 Portionen Kohlenhydrate am Tag, Protein gleich). Das Training ändert sich nicht. Das ist weder Belohnung noch Rückfall: Es stellt NEAT und Leptin wieder her und durchbricht den psychologischen On/Off-Zyklus. Am Montag danach wieder Defizit, als wäre nichts gewesen.' },
    9:  { t: 'DELOAD (nicht optional)', d: 'Gleiche Routine mit der HÄLFTE der Sätze pro Übung und demselben Gewicht auf der Stange. Kein Stopp: Ganz aufzuhören kostet Kraft. Es ist Gewebe-Erhalt + Urlaub für Sehnen und Gelenke vor dem finalen Block.' },
    10: { t: 'Übergang auf 5 Tage', d: 'Erste PPL-Woche: Mach überall EINEN Satz weniger. Der Sprung von 4 auf 5 Tage ist der Punkt mit dem höchsten Sehnenrisiko im Plan; rein geht es im Schritttempo, nicht im Sprung.' }
  };

  /* ---------- SESSIONS ---------- */
  // bloques: e = Übungs-id · s = Sätze · r = Wdh (rW = pro Woche) · d = Pause Sek · n = Kurznotiz
  const SESIONES = {
    /* — Phase 1 · Zuhause — */
    'c-a': { nombre: 'Zirkel A', tipo: 'fuerza', fase: 1, dur: '~35′', calent: true, bloques: [
      { e: 'sentadilla-pc',  s: 3, rW: { 1: '10', 2: '12' }, d: 75 },
      { e: 'flexiones',      s: 3, rW: { 1: '6-8', 2: '8-10' }, d: 75 },
      { e: 'puente-gluteo',  s: 3, rW: { 1: '12', 2: '15' }, d: 60 },
      { e: 'plancha',        s: 3, rW: { 1: '25″', 2: '35″' }, d: 60 },
      { e: 'elev-talones',   s: 2, rW: { 1: '15', 2: '20' }, d: 45, n: 'Bereitet die Sehnen aufs Joggen vor' }
    ]},
    'c-b': { nombre: 'Zirkel B', tipo: 'fuerza', fase: 1, dur: '~35′', calent: true, bloques: [
      { e: 'zancada-alterna', s: 3, rW: { 1: '8/Bein', 2: '10/Bein' }, d: 75 },
      { e: 'remo-toalla',     s: 3, rW: { 1: '10', 2: '12' }, d: 75 },
      { e: 'rdl-1p',          s: 3, rW: { 1: '8/Bein', 2: '10/Bein' }, d: 60 },
      { e: 'superman',        s: 3, rW: { 1: '10', 2: '12' }, d: 45 },
      { e: 'dead-bug',        s: 3, rW: { 1: '10/Seite', 2: '12/Seite' }, d: 45 }
    ]},
    /* — Phase 2 · Ganzkörper — */
    'fb-a': { nombre: 'Ganzkörper A', tipo: 'fuerza', fase: 2, dur: '~60′', calent: true, bloques: [
      { e: 'sentadilla-barra',   s: 3, r: '8',  d: 120, n: 'W3: leere Stange oder +10-20 kg, nur Bewegungsmuster' },
      { e: 'press-banca',        s: 3, r: '8',  d: 120 },
      { e: 'remo-barra',         s: 3, r: '8',  d: 120 },
      { e: 'press-militar-mc',   s: 2, r: '10', d: 90 },
      { e: 'curl-femoral-tumbado', s: 2, r: '12', d: 90 },
      { e: 'plancha',            s: 3, r: '40″', d: 60, n: 'Wenn es leicht wird: abwechselnd eine Hand abheben' }
    ]},
    'fb-b': { nombre: 'Ganzkörper B', tipo: 'fuerza', fase: 2, dur: '~60′', calent: true, bloques: [
      { e: 'rdl-barra',          s: 3, r: '8',  d: 120, n: 'Starte mit 30-40 kg' },
      { e: 'press-inclinado-mc', s: 3, r: '10', d: 120 },
      { e: 'jalon-pecho',        s: 3, r: '10', d: 90 },
      { e: 'zancada-mc',         s: 2, r: '10/Bein', d: 90, n: '6-10 kg pro Hand' },
      { e: 'elev-laterales',     s: 2, r: '15', d: 60 },
      { e: 'face-pull',          s: 2, r: '15', d: 60, n: 'Gegengewicht zum Drücken: Schultergesundheit von Anfang an' },
      { e: 'crunch-polea',       s: 3, r: '12', d: 60 }
    ]},
    /* — Phase 3 · Oberkörper/Beine — */
    'torso-a': { nombre: 'Oberkörper A', tipo: 'fuerza', fase: 3, dur: '~70′', calent: true, bloques: [
      { e: 'press-banca',      s: 4, r: '6-8', d: 150, n: 'Schwere Grundübung: 4×8 sauber → +2,5 kg und zurück auf 4×6' },
      { e: 'remo-barra',       s: 4, r: '8',   d: 120, n: 'Gleiches Gewicht in allen 4 Sätzen' },
      { e: 'press-militar',    s: 3, r: '10',  d: 90 },
      { e: 'jalon-pecho',      s: 3, r: '10',  d: 90, n: '1″ Pause unten' },
      { e: 'elev-laterales',   s: 3, r: '15',  d: 60 },
      { e: 'face-pull',        s: 2, r: '15',  d: 60, n: '2. Wochendosis Außenrotation' },
      { e: 'curl-barra-z',     s: 2, r: '12',  d: 60 },
      { e: 'ext-triceps-polea', s: 2, r: '12', d: 60 }
    ]},
    'pierna-a': { nombre: 'Beine A', tipo: 'fuerza', fase: 3, dur: '~70′', calent: true, tendon: 'rodilla', bloques: [
      { e: 'sentadilla-barra', s: 4, r: '6-8', d: 150, n: 'Doppelte Progression, wie beim Bankdrücken' },
      { e: 'rdl-barra',        s: 3, r: '8',   d: 120, n: '+5 kg, sobald alle 3 Sätze sauber sind' },
      { e: 'prensa',           s: 3, r: '10',  d: 90 },
      { e: 'curl-femoral-tumbado', s: 3, r: '12', d: 90, n: '3″ Exzentrik' },
      { e: 'gemelo-pie',       s: 4, r: '8',   d: 90, n: 'HSR für die Sehne: 3″ runter / 3″ hoch, mit echtem Gewicht' },
      { e: 'plancha-lastre',   s: 3, r: '40″', d: 60 }
    ]},
    'torso-b': { nombre: 'Oberkörper B', tipo: 'fuerza', fase: 3, dur: '~70′', calent: true, bloques: [
      { e: 'press-inclinado-mc', s: 4, r: '8', d: 120, n: 'Das schwere Drücken des Tages' },
      { e: 'dominadas',        s: 4, r: '8',   d: 120, n: 'Reduziere die Unterstützung Woche für Woche' },
      { e: 'press-plano-mc',   s: 3, r: '10',  d: 90 },
      { e: 'remo-polea',       s: 3, r: '12',  d: 90 },
      { e: 'face-pull',        s: 3, r: '15',  d: 60, n: 'Schultergesundheit für die Druckphasen' },
      { e: 'curl-inclinado',   s: 2, r: '12',  d: 60, n: 'Supersatz mit Stirndrücken, wenn die Zeit knapp ist' },
      { e: 'press-frances',    s: 2, r: '12',  d: 60 }
    ]},
    'pierna-b': { nombre: 'Beine B', tipo: 'fuerza', fase: 3, dur: '~70′', calent: true, tendon: 'rodilla', bloques: [
      { e: 'hip-thrust',       s: 4, r: '8',   d: 120, n: '1″ Pause oben, Gesäß maximal anspannen' },
      { e: 'zancada-bulgara',  s: 3, r: '10/Bein', d: 90, n: 'Die härteste Übung im Plan. Starte ohne Gewicht' },
      { e: 'ext-cuadriceps',   s: 3, r: '12',  d: 90, n: 'Wenn die Kniescheibe zwickt, Bewegungsradius oben verkürzen' },
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
      { e: 'ext-triceps-polea', s: 3, r: '12', d: 60, n: 'Wechsle mit Überkopf-Strecken ab' },
      { e: 'ext-triceps-cabeza', s: 3, r: '12', d: 60 }
    ]},
    'pull-a': { nombre: 'Pull', tipo: 'fuerza', fase: 4, dur: '~65′', calent: true, bloques: [
      { e: 'rdl-barra',        s: 3, r: '6-8', d: 150 },
      { e: 'dominadas',        s: 4, r: '8',   d: 120, n: 'Mit Zusatzgewicht, wenn mehr als 10 gehen' },
      { e: 'remo-barra',       s: 3, r: '10',  d: 120, n: 'Oder Rudern am Kabel' },
      { e: 'face-pull',        s: 3, r: '15',  d: 60 },
      { e: 'curl-barra-z',     s: 3, r: '10',  d: 60 },
      { e: 'curl-martillo',    s: 2, r: '12',  d: 60 }
    ]},
    'legs': { nombre: 'Legs', tipo: 'fuerza', fase: 4, dur: '~70′', calent: true, tendon: 'rodilla', bloques: [
      { e: 'sentadilla-barra', s: 4, r: '6',  d: 150 },
      { e: 'prensa',           s: 3, r: '10', d: 120 },
      { e: 'hip-thrust',       s: 3, r: '10', d: 120 },
      { e: 'curl-femoral-tumbado', s: 3, r: '12', d: 90 },
      { e: 'gemelo-pie',       s: 4, r: '8',  d: 90, n: 'HSR: 3″ runter / 3″ hoch' },
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
      { e: 'remo-mancuerna',   s: 3, r: '12/Seite', d: 90 },
      { e: 'pullover-polea',   s: 3, r: '15', d: 60 },
      { e: 'encogimientos',    s: 3, r: '12', d: 60 },
      { e: 'curl-polea',       s: 3, r: '15', d: 60 }
    ]},
    /* — Cardio — */
    'cam40':  { nombre: 'Gehen 40′', tipo: 'cardio', icono: 'walk', detalle: 'Tempo der unbequemen Unterhaltung: Reden geht noch, Singen nicht. Zählt für die Schritte des Tages.' },
    'cam60':  { nombre: 'Gehen 60′', tipo: 'cardio', icono: 'walk', detalle: 'Flottes, gleichmäßiges Tempo. Ideal draußen: bringt Licht, Schritte und aktive Erholung.' },
    'wj3': { nombre: 'Gehen-Laufen W3', tipo: 'cardio', icono: 'run', detalle: '7 Runden: 2′ lockeres Joggen + 2′ Gehen (28′). Davor: 2×20 Tibialis Raises + 10 Wadenheben. Wirklich lockeres Joggen: Wenn du nicht reden kannst, bist du zu schnell.' },
    'wj4': { nombre: 'Gehen-Laufen W4', tipo: 'cardio', icono: 'run', detalle: '6 Runden: 3′ Joggen + 2′ Gehen (30′). Davor: 2×20 Tibialis Raises. Hohe Kadenz und kurze Schritte: weniger Aufprall pro Schritt.' },
    'wj5': { nombre: 'Gehen-Laufen W5', tipo: 'cardio', icono: 'run', detalle: '5 Runden: 5′ Joggen + 1′ Gehen (30′), oder 20′ lockeres Dauerjoggen, wenn der Körper gut mitspielt. Davor: 2×20 Tibialis Raises.' },
    'trote25': { nombre: 'Joggen 25-30′', tipo: 'cardio', icono: 'run', detalle: 'Durchgehend und im Plaudertempo. Lieber glatter Asphalt oder fester Boden als unebene Gehwege. Wenn Schienbein oder Knie beim Laufen zunehmend wehtun: abbrechen und gehen.' },
    'trote30': { nombre: 'Joggen 30-35′', tipo: 'cardio', icono: 'run', detalle: 'Durchgehend. Ein Lauf darf etwas flotter sein (letzte 10′ im mittleren Tempo), der andere bleibt immer locker.' },
    'libre': { nombre: 'Ruhetag', tipo: 'libre', icono: 'rest', detalle: 'Ein echter freier Tag. Die täglichen Schritte zählen weiter. Sonntag: Meal Prep (~90′) und die Woche ist erledigt.' }
  };

  /* ---------- AUFWÄRMEN (immer, 6′) ---------- */
  const CALENTAMIENTO = {
    titulo: 'Aufwärmen · 6′ · immer',
    pasos: [
      'Armkreisen · 30″',
      'Hüftkreisen · 30″ pro Seite',
      '10 langsame Kniebeugen ohne Gewicht',
      '5 Ausfallschritte mit Rotation pro Seite',
      'Plank · 20″',
      '20 Jumping Jacks'
    ],
    gym: 'Im Gym zusätzlich: 1-2 Aufwärmsätze mit wenig Gewicht bei der ersten schweren Übung des Tages (50% und 75% des Arbeitsgewichts).'
  };

  /* ---------- SEHNEN-PROTOKOLL (die Versicherung des Plans) ---------- */
  const TENDON = {
    titulo: 'Sehnen-Protokoll · 6-8′ · 2-3×/Woche',
    intro: 'Die Kraft kommt in Wochen zurück; die Sehne braucht Monate (ihr Kollagen erneuert sich ~10-mal langsamer und hat kein Muskelgedächtnis). Dieser Block ist die Versicherung des Plans: Er startet in Woche 1, und das Joggen in Woche 3 kommt nur mit zwei Wochen Sehnenarbeit im Rücken.',
    bloques: [
      { id: 'tendon-rodilla', nombre: 'Patellasehne · isometrisch', donde: 'Nach jeder Beinsession (in P1 nach den Zirkeln)',
        detalle: 'Isometrischer Wandsitz (P2+: Spanish Squat mit starrem Gurt hinter den Knien): 5 × 45″ bei ~70% Anstrengung, 1′ Pause. Oberschenkel nahe der Parallele, kein stechender Schmerz. Passt nicht nur an, sondern wirkt sofort schmerzlindernd (Rio 2015).' },
      { id: 'tendon-aquiles', nombre: 'Achillessehne · Waden-HSR', donde: 'Schon in die Sessions integriert (Wadenheben)',
        detalle: 'Die Regel, die alles ändert: Waden SCHWER und LANGSAM, 3″ runter, 3″ hoch, 6-8 Wdh, ohne Federn. In P1 mit beladenem Rucksack einbeinig; im Gym mit echtem Gewicht. Das Federn nutzt den Sehnenreflex und raubt ihr genau den Reiz, den sie braucht.' },
      { id: 'tendon-tibial', nombre: 'Tibialis anterior', donde: 'Vor jedem Lauf',
        detalle: 'Tibialis Raises an der Wand gelehnt: 2-3 × 15-20. Das ist die Impfung gegen Schienbeinkantensyndrom bei deinem aktuellen Gewicht.' },
      { id: 'tendon-codo', nombre: 'Ellbogen/Handgelenk · isometrisch', donde: 'Nach den Oberkörpersessions (P2+), 2×/Woche',
        detalle: 'Mit einer leichten Kurzhantel, Handgelenk still in halber Beugung: 3 × 45″ (Handfläche oben und Handfläche unten). Das Volumen aus Drücken + Rudern + Latzug provoziert bei Rückkehrern Tennisellbogen; das hier verhindert ihn gratis.' }
    ],
    nota: 'Bau KEINE Plyometrie/Sprünge ein, um „das Joggen vorzubereiten": Die Evidenz sagt, das ist ein schlechter Sehnenreiz bei hohem Impact. Deine Impact-Vorbereitung ist dieser Block.'
  };

  /* ---------- LAUFREGELN (Evidenz BMI ~28) ---------- */
  const CARRERA = {
    titulo: 'Laufen ohne Bruch ({p} kg bestimmen)',
    reglas: [
      'Kadenz 170-180 Schritte/min, kurzer Schritt: senkt den Aufprall im Schienbein um ~11% und die Lastrate um ~15%. Zähl 30″ lang die Schritte (85-90) oder nutz das Metronom der Uhr.',
      'Das Volumen steuern Gefühl und Planprogression: Steigere nie über ~1,3× dessen, was du im Schnitt der letzten 4 Wochen gemacht hast (die App warnt dich).',
      'Woche 3 startet mit ~2,5 km Joggen gesamt: unter der Obergrenze von 3 km/Woche, die die Evidenz für den Start mit Übergewicht setzt.',
      'Untergrund und Schuhe KONSTANT: Ändere nie beides gleichzeitig. Lieber glatter Asphalt oder fester Boden als Gehwege.',
      'Schmerz in Schienbein oder Knie, der beim Laufen SCHLIMMER wird: abbrechen und gehen. Was beim Aufwärmen verschwindet, behalte im Auge; was wächst, bestimmt.'
    ]
  };

  /* ---------- HISTORISCHE BESTMARKEN (Gym-Ära, ~2021) ---------- */
  // Werden nicht als PR geladen: Sie sind die Referenz, „wo du warst", und das Ziel, das es zurückzuholen gilt.
  const HISTORICO = {
    'press-banca':      { kg: 95,  reps: 8, series: 4, txt: '95 kg × 8 (4 Sätze)',  rm: 120 },
    'sentadilla-barra': { kg: 100, reps: 8, series: 5, txt: '100 kg × 8 (5 Sätze)', rm: 127 }
  };

  /* ---------- STARTGEWICHTE · PHASE 2 ---------- */
  const ARRANQUE = {
    titulo: 'Mit welchem Gewicht du im Gym startest (Woche 3)',
    derivacion: 'Sie kommen aus deinen echten Bestmarken — Bankdrücken 95×8 und Kniebeuge 100×8 (1RM ≈ 120 und ≈ 127 kg) — bei 50%: der Standard-Start für Rückkehrer. Nicht weil der Muskel nicht mehr könnte, sondern weil die Sehne 5 Jahre ohne Last war. Ab da übernimmt die App die doppelte Progression.',
    tabla: [
      { ej: 'press-banca',      s3: '45 kg', s4: '47,5 kg', s5: '50 kg', n: '50% deiner 95. Stange + 2×12,5' },
      { ej: 'sentadilla-barra', s3: '50 kg', s4: '55 kg',   s5: '60 kg', n: '50% deiner 100. Stange + 2×15' },
      { ej: 'rdl-barra',        s3: '45 kg', s4: '50 kg',   s5: '55 kg', n: '≈45% deiner alten Kniebeuge' },
      { ej: 'remo-barra',       s3: '40 kg', s4: '42,5 kg', s5: '45 kg', n: '≈45% deines alten Bankdrückens' }
    ],
    resto: 'Die übrigen Übungen haben keine alte Bestmarke: Wähl im ersten Satz ein Gewicht, das du mit 3 Wiederholungen in Reserve bewegen kannst, trag es ein, und ab da kümmert sich die App.',
    aviso: 'Diese Gewichte werden dir lächerlich vorkommen. Genau das ist der Punkt: Die Tendinitis des Rückkehrers entsteht in den Wochen 3-5, wenn das Nervensystem erlaubt, was die Sehnen noch nicht verkraften.',
    desequilibrio: 'Deine eigenen Bestmarken sagen es: Kniebeuge 100 vs. Bankdrücken 95 ist ein Verhältnis von 1,05 (ausgewogen wären 1,4-1,5). Der Unterkörper hinkte hinterher — und da steckt die doppelt gute Nachricht: Dort hast du am meisten Spielraum, und nichts treibt die Rekomposition stärker. Lass die Beintage nicht sausen.'
  };

  /* ---------- ÜBUNGSKARTEN ---------- */
  // musc: [primär, sekundär] · cues: Technik · err: typische Fehler ·
  // alt: gleichwertige Alternativen (Kommerz-Gym) · mol: wenn es zwickt, wechsle zu
  const EJERCICIOS = {
    /* — Zuhause / P1 — */
    'sentadilla-pc': { pat: 'rod',
      nombre: 'Kniebeuge (Körpergewicht)', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadrizeps', 'Gesäß'], equipo: 'Nichts',
      cues: ['Füße schulterbreit, Fußspitzen leicht nach außen', 'Geh in 3″ runter, als würdest du dich nach hinten setzen, in 1″ hoch', 'Knie folgen der Fußspitze, Fersen fest im Boden', 'Brust hoch über den gesamten Weg'],
      err: ['Fersen, die abheben (geh weniger tief)', 'Knie, die nach innen kollabieren', 'Federnd absinken statt zu kontrollieren'],
      alt: [{ n: 'Kniebeuge auf Kiste/Sofa', por: 'wenn dir die Tiefenkontrolle schwerfällt' }, { n: 'Kniebeuge mit 2″ Pause unten', por: 'wenn dir 12 Wdh zu leicht werden' }],
      mol: 'Wenn das Knie zwickt: Tiefe reduzieren, bis nichts wehtut, und noch langsamer runter.'
    },
    'flexiones': { pat: 'eh',
      nombre: 'Liegestütze', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Brust', 'Trizeps, Schulter'], equipo: 'Nichts',
      cues: ['Hände etwas breiter als die Schultern', 'Ellbogen im 45°-Winkel zum Körper, weder angepresst noch im Kreuz', 'Körper wie ein Brett: Gesäß und Bauch fest', 'Brust berührt (fast) den Boden bei jeder Wdh'],
      err: ['Hängende oder zeltförmige Hüfte', 'Halber Bewegungsradius', 'Nacken, der zum Boden vorschiebt'],
      alt: [{ n: 'Liegestütze mit Händen auf Sofa/Tisch', por: 'wenn sie am Boden nicht sauber klappen' }, { n: 'Liegestütze mit erhöhten Füßen', por: 'wenn du locker über 12 kommst' }],
      mol: 'Wenn das Handgelenk zwickt: auf Fäusten oder mit Liegestützgriffen. Wenn die Schulter zwickt: Hände etwas enger.'
    },
    'puente-gluteo': { pat: 'bis',
      nombre: 'Glute Bridge', mm: { p: ['gluteo'], s: ['isquios'] }, zona: 'pierna', musc: ['Gesäß', 'Beinbizeps'], equipo: 'Nichts',
      cues: ['Auf dem Rücken, Fersen nah am Gesäß', 'Drück über die Fersen und heb die Hüfte', '2″ Pause oben, Gesäß kräftig anspannen', 'Rippen unten: kein Hohlkreuz'],
      err: ['Über die Fußspitzen drücken', 'Ins Hohlkreuz gehen, um höher zu kommen', 'Hoch und runter ohne Pause'],
      alt: [{ n: 'Einbeinige Glute Bridge', por: 'sobald 15 Wdh bequem sind' }, { n: 'Glute Bridge mit Rucksack auf der Hüfte', por: 'für Zusatzlast zuhause' }],
      mol: 'Bei Krampf im Beinbizeps: Fersen näher ans Gesäß.'
    },
    'plancha': { pat: 'core',
      nombre: 'Plank', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Kompletter Core'], equipo: 'Nichts',
      cues: ['Unterarme am Boden, Ellbogen unter den Schultern', 'Rippen rein, Becken kippen (Po einziehen)', 'Gesäß fest, Blick zum Boden', 'Atmen: nicht die Luft anhalten'],
      err: ['Hängende Hüfte (der untere Rücken leidet)', 'Po als Zelt nach oben (Schummeln)', 'Zitternd durchhalten: Wenn der untere Rücken zittert, brich den Satz ab'],
      alt: [{ n: 'Plank auf den Knien', por: 'wenn du die Zeit nicht mit sauberer Form schaffst' }],
      mol: 'Wenn der untere Rücken zwickt: Prüf zuerst die Beckenkippung; daran liegt es meistens.'
    },
    'plancha-lastre': { pat: 'core',
      nombre: 'Plank mit Zusatzgewicht', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Kompletter Core'], equipo: 'Scheibe 5-10 kg',
      cues: ['Gleiche Technik wie beim normalen Plank', 'Lass dir die Scheibe zwischen die Schulterblätter legen, nicht auf den unteren Rücken', 'Wenn die Hüfte absinkt, Gewicht runter'],
      err: ['Scheibe zu tief (belastet den unteren Rücken)', 'Beckenkippung verlieren, wenn du ermüdest'],
      alt: [{ n: 'Plank mit Schultertippen', por: 'wenn dir niemand die Scheibe auflegen kann' }, { n: 'Ab Wheel auf den Knien', por: 'anspruchsvollere Variante' }],
      mol: 'Wenn der untere Rücken zwickt: zurück zum Plank ohne Gewicht + Schultertippen.'
    },
    'elev-talones': { pat: 'gem',
      nombre: 'Wadenheben', mm: { p: ['gemelos'], s: [] }, zona: 'pierna', musc: ['Wade', 'Soleus'], equipo: 'Stufe optional',
      cues: ['Voller Bewegungsradius: unten dehnen, 1″ Pause oben', 'In 1″ hoch, in 2-3″ runter', 'Besser auf einer Stufe für mehr Weg'],
      err: ['Schnell federn ohne Pause', 'Oben nur halber Weg'],
      alt: [{ n: 'Einbeinig', por: 'sobald 20 Wdh leicht sind' }],
      mol: 'Wenn die Achillessehne zwickt: unten weniger Radius und langsamer absenken.'
    },
    'zancada-alterna': { pat: 'zan',
      nombre: 'Ausfallschritte im Wechsel', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadrizeps', 'Gesäß'], equipo: 'Nichts',
      cues: ['Großer Schritt nach vorn', 'Oberkörper aufrecht, Hände an der Hüfte oder vorn', 'Das hintere Knie streift den Boden', 'Drück über die vordere Ferse zurück'],
      err: ['Kurzer Schritt (das vordere Knie kollabiert)', 'Oberkörper kippt nach vorn', 'Vorderes Knie wandert nach innen'],
      alt: [{ n: 'Statischer Ausfallschritt (ohne Wechsel)', por: 'wenn die Balance versagt' }, { n: 'Ausfallschritt nach hinten', por: 'knieschonender' }],
      mol: 'Wenn das Knie zwickt: Wechsle zu Ausfallschritten nach HINTEN, gleiches Schema.'
    },
    'remo-toalla': { pat: 'th',
      nombre: 'Handtuchrudern an der Tür', mm: { p: ['dorsal'], s: ['biceps', 'espalda-alta'] }, zona: 'tiron', musc: ['Lat', 'Bizeps, Schulterblätter'], equipo: 'Handtuch + Tür (oder Rucksack)',
      cues: ['Handtuch um Klinke/Rahmen, Körper nach hinten gelehnt', 'Zieh mit dem ELLBOGEN, nicht mit der Hand', 'Schulterblätter am Ende nach hinten-unten', 'Je schräger du dich lehnst, desto härter'],
      err: ['Nur mit den Armen ziehen, ohne die Schulterblätter zu bewegen', 'Mit Hüftschwung reißen'],
      alt: [{ n: 'Rudern mit beladenem Rucksack', por: 'einarmig, auf dem Tisch abgestützt' }, { n: 'Inverted Rows unter einem stabilen Tisch', por: 'härtere Version' }],
      mol: 'Wenn der Ellbogen zwickt: breiter greifen und weniger Schräglage.'
    },
    'rdl-1p': { pat: 'bis',
      nombre: 'Einbeiniges Rumänisches Kreuzheben', mm: { p: ['isquios'], s: ['gluteo'] }, zona: 'pierna', musc: ['Beinbizeps', 'Gesäß, Balance'], equipo: 'Nichts (Rucksack optional)',
      cues: ['Hüfte nach hinten, Rücken gerade wie ein Tisch', 'Das freie Bein steigt hinten als Gegengewicht', 'Runter, bis du die Dehnung im Beinbizeps spürst', 'Balance geht vor Tiefe'],
      err: ['Rücken runden, um tiefer zu kommen', 'Hüfte aufdrehen (beide Hüftknochen zeigen zum Boden)'],
      alt: [{ n: 'Mit einer Hand an der Wand', por: 'wenn die Balance den Satz zerstört' }, { n: 'B-Stance (hinterer Fuß stützt)', por: 'Zwischenschritt' }],
      mol: 'Wenn der Beinbizeps zu sehr zieht: Radius verkürzen, nicht die Technik.'
    },
    'superman': { pat: 'core',
      nombre: 'Superman', mm: { p: ['lumbar'], s: ['gluteo', 'espalda-alta'] }, zona: 'core', musc: ['Unterer Rücken', 'Gesäß, oberer Rücken'], equipo: 'Nichts',
      cues: ['Bauchlage, Arme nach vorn', 'Arme und Beine gleichzeitig heben, 2″ oben', 'Blick zum Boden: nicht am Nacken ziehen'],
      err: ['Nacken überstrecken durch Blick nach vorn', 'Mit Schwung hochkommen'],
      alt: [{ n: 'Bird-Dog (gegenüberliegender Arm und Bein)', por: 'mehr Kontrolle, weniger Kompression' }],
      mol: 'Wenn der untere Rücken zwickt: direkt zu Bird-Dog wechseln.'
    },
    'dead-bug': { pat: 'core',
      nombre: 'Dead Bug', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Tiefer vorderer Core'], equipo: 'Nichts',
      cues: ['Auf dem Rücken, unterer Rücken die GANZE Zeit am Boden ANGEDRÜCKT', 'Gegenüberliegender Arm und Bein senken sich langsam zugleich', 'Beim Strecken ausatmen: Die Rippen bleiben unten'],
      err: ['Der untere Rücken hebt beim Beinstrecken ab (verkürze den Weg)', 'Zu schnell'],
      alt: [{ n: 'Nur Beine (Arme still)', por: 'wenn du den Bodenkontakt im unteren Rücken verlierst' }],
      mol: 'Die sicherste Übung im Plan; wenn etwas zwickt, prüf, ob der untere Rücken abhebt.'
    },

    /* — Gym: Drücken — */
    'press-banca': { pat: 'eh',
      nombre: 'Bankdrücken', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Brust', 'Trizeps, vordere Schulter'], equipo: 'Langhantel + Bank',
      cues: ['Schulterblätter zurückgezogen und in die Bank GENAGELT, Füße fest am Boden', 'Griff: Unterarm senkrecht, wenn die Stange die Brust berührt', 'Stange zur mittleren Brust, Ellbogen ~45°', 'Kontrolliert die Brust berühren und leicht diagonal nach oben drücken'],
      err: ['Schultern, die beim Drücken hochziehen (du verlierst die Retraktion)', 'Die Stange auf der Brust abfedern', 'Po hebt von der Bank ab', 'Handgelenke nach hinten geknickt'],
      alt: [{ n: 'Brustpresse (Maschine)', por: 'Tage ohne Lust auf Bankaufbau oder volles Gym' }, { n: 'Flachbankdrücken mit Kurzhanteln', por: 'mehr Radius und weniger Schulter' }],
      mol: 'Wenn die Schulter zwickt: Probier einen etwas engeren Griff mit angelegteren Ellbogen; hilft das nicht, Kurzhanteln mit neutraler Drehung.'
    },
    'press-inclinado-mc': { pat: 'eh',
      nombre: 'Schrägbankdrücken mit Kurzhanteln', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Obere Brust', 'Schulter, Trizeps'], equipo: 'Kurzhanteln + Bank 30°',
      cues: ['Bank auf 30° (eine Raste, nicht die Wand)', 'Runter, bis du die Dehnung in der Brust spürst', 'Ellbogen 45-60°, Handgelenke neutral', 'Hoch, ohne die Hanteln oben zusammenzuschlagen'],
      err: ['Bank zu steil (wird zum Schulterdrücken)', 'Unten abfedern', 'Übertriebenes Hohlkreuz'],
      alt: [{ n: 'Schrägdrücken an der Multipresse', por: 'wenn das Gym voll ist oder du Stabilität willst' }, { n: 'Schrägbankdrücken mit Langhantel', por: 'in Push B der P4 schon eingeplant' }],
      mol: 'Wenn die Schulter zwickt: Radius unten um 5 cm kürzen und die Handflächen leicht nach innen drehen.'
    },
    'press-inclinado-barra': { pat: 'eh',
      nombre: 'Schrägbankdrücken mit Langhantel', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Obere Brust', 'Schulter, Trizeps'], equipo: 'Langhantel + Schrägbank',
      cues: ['Bank 30-45°, Schulterblätter festgenagelt', 'Die Stange senkt sich zur oberen Brust (Schlüsselbeine)', 'Unterarme senkrecht beim Berühren'],
      err: ['Stange zur mittleren Brust senken (zwingt die Ellbogen auf)', 'Abfedern'],
      alt: [{ n: 'Multipresse schräg', por: 'gleiche Session, mehr Führung' }, { n: 'Kurzhanteln schräg', por: 'wenn keine Schrägbank mit Ablagen frei ist' }],
      mol: 'Wenn die Schulter zwickt: zurück zu Kurzhanteln, die lassen dich den Griff drehen.'
    },
    'press-plano-mc': { pat: 'eh',
      nombre: 'Flachbankdrücken mit Kurzhanteln', mm: { p: ['pecho'], s: ['triceps'] }, zona: 'empuje', musc: ['Brust', 'Trizeps'], equipo: 'Kurzhanteln + Bank',
      cues: ['Mehr Radius als die Stange: Nutz ihn unten mit Kontrolle', 'Im Bogen nach oben, ohne oben anzuschlagen', 'Füße fest, Schulterblätter zurück'],
      err: ['Die Hanteln unten fallen lassen, ohne zu bremsen', 'Durch zu weit geöffnete Ellbogen zum Schulterdrücken machen'],
      alt: [{ n: 'Brustpresse (Maschine)', por: 'bei hoher Ermüdung oder ohne freie Bank' }],
      mol: 'Wenn die Schulter zwickt: neutraler Griff (Handflächen zueinander).'
    },
    'press-militar': { pat: 'ev',
      nombre: 'Schulterdrücken', mm: { p: ['hombro'], s: ['triceps', 'abdomen'] }, zona: 'empuje', musc: ['Schulter', 'Trizeps, Core'], equipo: 'Langhantel (stehend oder sitzend)',
      cues: ['Im Stehen: Gesäß und Bauch FEST, bevor du drückst', 'Die Stange startet am Kinn und steigt dicht am Gesicht', 'Der Kopf „schiebt sich durchs Fenster" am Ende', 'Sitzend mit Lehne: ohne Hohlkreuz'],
      err: ['Ins Hohlkreuz gehen und ein Schrägdrücken daraus machen', 'Die Stange nach vorn drücken (kollidiert mit dem Kinn)', 'Oben unvollständiger Radius'],
      alt: [{ n: 'Schulterdrücken mit Kurzhanteln sitzend', por: 'in P2 schon eingeplant; schulterfreundlicher' }, { n: 'Schulterpresse (Maschine)', por: 'letzte Session der Woche mit Ermüdung' }],
      mol: 'Wenn die Schulter zwickt: Kurzhanteln mit neutralem Griff und nur so hoch, wie nichts einklemmt.'
    },
    'press-militar-mc': { pat: 'ev',
      nombre: 'Schulterdrücken mit Kurzhanteln sitzend', mm: { p: ['hombro'], s: ['triceps'] }, zona: 'empuje', musc: ['Schulter', 'Trizeps'], equipo: 'Kurzhanteln + Bank mit Lehne',
      cues: ['Hohe Lehne, unterer Rücken angelehnt ohne Hohlkreuz', 'Ellbogen leicht vor dem Körper, nicht im Kreuz', 'Voller Radius, ohne oben anzuschlagen'],
      err: ['Ins Hohlkreuz gehen und von der Lehne abheben', 'Nur bis zu den Ohren absenken'],
      alt: [{ n: 'Schulterpresse (Maschine)', por: 'direktes Pendant' }],
      mol: 'Wenn die Schulter zwickt: neutraler Griff und nur bis 90° Ellbogen absenken.'
    },
    'elev-laterales': { pat: 'ev',
      nombre: 'Seitheben', mm: { p: ['hombro'], s: [] }, zona: 'empuje', musc: ['Seitliche Schulter'], equipo: 'Kurzhanteln',
      cues: ['LEICHTES Gewicht, Ellbogen leicht gebeugt', 'Bis zur Horizontalen, als würdest du zwei Krüge ausschenken', 'Ohne Schwung: Wenn du pendelst, ist Gewicht übrig', 'In 2″ runter'],
      err: ['Mit dem Trapez hochziehen und die Schultern anheben', 'Über die Horizontale hinaus', 'Hüftpendeln'],
      alt: [{ n: 'Seitheben am Kabel (unten)', por: 'konstante Spannung; in Push B eingeplant' }, { n: 'Seitheben-Maschine', por: 'zum Abschluss ohne Technik-Denken' }],
      mol: 'Wenn die Schulter zwickt: Daumen leicht nach oben und 10° vor der Körperebene heben.'
    },
    'laterales-polea': { pat: 'ev',
      nombre: 'Seitheben am Kabel', mm: { p: ['hombro'], s: [] }, zona: 'empuje', musc: ['Seitliche Schulter'], equipo: 'Kabelzug unten',
      cues: ['Kabel auf Handgelenkshöhe bei hängendem Arm', 'Körper stabil, bis zur Horizontalen heben', 'Das Kabel hält auch unten Spannung: Nutz das'],
      err: ['Zu weit weg vom Kabelturm stehen', 'Mit dem Trapez ziehen'],
      alt: [{ n: 'Kurzhanteln', por: 'wenn die Kabelzüge belegt sind' }],
      mol: 'Wie mit Kurzhanteln: Daumen hoch und Ebene leicht nach vorn.'
    },
    'fondos': { pat: 'ev',
      nombre: 'Dips (assistiert)', mm: { p: ['pecho'], s: ['triceps'] }, zona: 'empuje', musc: ['Untere Brust', 'Trizeps'], equipo: 'Dip-Maschine mit Unterstützung oder Bänder',
      cues: ['Körper leicht nach vorn gelehnt (mehr Brust)', 'Runter bis 90° Ellbogen, nicht tiefer, wenn die Schulter protestiert', 'Ellbogen nicht im Kreuz aufgehen lassen'],
      err: ['Zu tief absinken', 'Schultern zu den Ohren hochgezogen'],
      alt: [{ n: 'Negativ-Bankdrücken oder Dips zwischen Bänken', por: 'wenn es keine assistierte Maschine gibt' }],
      mol: 'Wenn Brustbein oder Schulter zwicken: durch Flachbankdrücken mit Kurzhanteln ersetzen.'
    },
    'ext-triceps-polea': { pat: 'ext',
      nombre: 'Trizepsdrücken am Kabel', mm: { p: ['triceps'], s: [] }, zona: 'empuje', musc: ['Trizeps'], equipo: 'Kabelzug oben + Seil oder Stange',
      cues: ['Ellbogen am Körper, FIXIERT', 'Nur der Unterarm bewegt sich', 'Ganz strecken und 1″ anspannen'],
      err: ['Ellbogen wandern beim Absenken vor (du nimmst die Schulter rein)', 'Pendelnder Oberkörper'],
      alt: [{ n: 'Mit dem Seil unten auseinanderziehen', por: 'etwas mehr langer Kopf' }, { n: 'Trizeps-Kickbacks mit Kurzhantel', por: 'ohne freien Kabelzug' }],
      mol: 'Wenn der Ellbogen zwickt: Gewicht runter und Wdh auf 15-20 hoch; der Ellbogen hasst Ego.'
    },
    'ext-triceps-cabeza': { pat: 'ext',
      nombre: 'Überkopf-Trizepsstrecken (Seil)', mm: { p: ['triceps'], s: [] }, zona: 'empuje', musc: ['Trizeps (langer Kopf)'], equipo: 'Kabelzug + Seil',
      cues: ['Mit dem Rücken zum Kabelturm, Seil hinter dem Nacken', 'Ellbogen zeigen nach vorn, nach oben strecken', 'Echte Dehnung unten: Da wächst der lange Kopf'],
      err: ['Ellbogen im Kreuz aufgehen lassen', 'Kurzer Radius durch zu viel Gewicht'],
      alt: [{ n: 'Stirndrücken mit SZ-Stange', por: 'gleiches Muster im Liegen' }],
      mol: 'Wenn der Ellbogen zwickt: wie am normalen Kabel — weniger Gewicht, mehr Wdh.'
    },
    'press-frances': { pat: 'ext',
      nombre: 'Stirndrücken', mm: { p: ['triceps'], s: [] }, zona: 'empuje', musc: ['Trizeps (langer Kopf)'], equipo: 'SZ-Stange + Bank',
      cues: ['Im Liegen senkt sich die Stange zur Stirn oder etwas dahinter', 'Ellbogen zeigen zur Decke, still', 'In 2-3″ runter, strecken ohne ruckartiges Durchdrücken'],
      err: ['Ellbogen, die aufgehen', 'Durch Schulterbewegung zum engen Bankdrücken machen'],
      alt: [{ n: 'Überkopf-Strecken am Kabel', por: 'mehr Dauerspannung, weniger Ellbogenstress' }],
      mol: 'Wenn der Ellbogen zwickt: direkt gegen Kabeldrücken mit 15 Wdh tauschen.'
    },

    /* — Gym: Ziehen — */
    'remo-barra': { pat: 'th',
      nombre: 'Langhantelrudern', mm: { p: ['dorsal'], s: ['biceps', 'espalda-alta'] }, zona: 'tiron', musc: ['Lat', 'mittlerer Rücken, Bizeps'], equipo: 'Langhantel',
      cues: ['Oberkörper bei ~45°, Knie leicht gebeugt', 'Zieh die Stange zum unteren Bauch', 'Schulterblätter am Ende nach hinten-unten', 'NEUTRALER Rücken, nicht verhandelbar'],
      err: ['Mit dem unteren Rücken reißen (du schaukelst)', 'Oberkörper richtet sich Wdh für Wdh auf', 'Zur Brust ziehen mit offenen Ellbogen'],
      alt: [{ n: 'T-Bar-Rudern', por: 'stabilere Variante' }, { n: 'Rudermaschine mit Brustauflage', por: 'wenn der untere Rücken vom Beintag noch voll ist' }],
      mol: 'Wenn der untere Rücken protestiert: Maschine mit Brustauflage oder Rudern am Kabel, ohne zu zögern.'
    },
    'remo-polea': { pat: 'th',
      nombre: 'Rudern am Kabel sitzend', mm: { p: ['espalda-alta'], s: ['biceps', 'dorsal'] }, zona: 'tiron', musc: ['Mittlerer Rücken', 'Lat, Bizeps'], equipo: 'Kabelzug unten + Doppelgriff',
      cues: ['Brust hoch und FIX: Der Oberkörper reist nicht mit', 'Zieh den Griff zum Bauchnabel', '1″ Pause mit zusammengepressten Schulterblättern'],
      err: ['Oberkörper pendeln, um mehr Gewicht zu bewegen', 'Hochgezogene Schultern'],
      alt: [{ n: 'Rudermaschine', por: 'direktes Pendant' }],
      mol: 'Wenn der untere Rücken zwickt: Brust an einer Rudermaschine mit Auflage abstützen.'
    },
    'remo-mancuerna': { pat: 'th',
      nombre: 'Einarmiges Kurzhantelrudern', mm: { p: ['dorsal'], s: ['espalda-alta'] }, zona: 'tiron', musc: ['Lat', 'mittlerer Rücken'], equipo: 'Kurzhantel + Bank',
      cues: ['Knie und Hand auf der Bank, Rücken neutral', 'Zieh den Ellbogen zur Hüfte, nicht zur Schulter', 'Ohne den Oberkörper beim Hochziehen aufzudrehen'],
      err: ['Die Schulter zu Beginn des Zugs hochziehen', 'Den Oberkörper rotieren, um zu „helfen"', 'Kurzer Radius'],
      alt: [{ n: 'Einarmiges Rudern am Kabel', por: 'konstantere Spannung' }],
      mol: 'Ohne gute Stütze zwickt der untere Rücken: Nutz eine Schrägbank und stütz die Brust ab.'
    },
    'jalon-pecho': { pat: 'tv',
      nombre: 'Latzug', mm: { p: ['dorsal'], s: ['biceps'] }, zona: 'tiron', musc: ['Lat', 'Bizeps'], equipo: 'Kabelzug oben',
      cues: ['Griff etwas breiter als die Schultern', 'Brust hoch, leichte FIXE Rücklage', 'Zieh die ELLBOGEN Richtung Hosentaschen', 'Stange zum Schlüsselbein, 1″ Pause'],
      err: ['Schaukeln, um den Zug zu holen', 'Mit den Armen ziehen, ohne die Schulterblätter zu senken', 'Stange in den Nacken (nein)'],
      alt: [{ n: 'Assistierte Klimmzüge', por: 'das Ziel von P3 ist, dorthin zu wechseln' }, { n: 'Latzug enger Griff', por: 'in Pull B eingeplant' }],
      mol: 'Wenn die Schulter zwickt: neutraler Griff (breites Dreieck) und Gewicht runter.'
    },
    'jalon-estrecho': { pat: 'tv',
      nombre: 'Latzug enger Griff', mm: { p: ['dorsal'], s: ['biceps'] }, zona: 'tiron', musc: ['Lat', 'Bizeps'], equipo: 'Kabelzug oben + Doppelgriff',
      cues: ['Doppelgriff oder Untergriff schulterbreit', 'Ellbogen dicht am Körper nach unten', 'Oben ganz strecken: Der Lat arbeitet lang'],
      err: ['Durch zu viel Rücklage zum Rudern machen', 'Halbe Wiederholung oben'],
      alt: [{ n: 'Assistierte Klimmzüge im Untergriff', por: 'Pendant mit Körpergewicht' }],
      mol: 'Wenn der Ellbogen zwickt: neutraler Griff und gerade Handgelenke.'
    },
    'dominadas': { pat: 'tv',
      nombre: 'Klimmzüge (assistiert → frei → mit Zusatzgewicht)', mm: { p: ['dorsal'], s: ['biceps', 'abdomen'] }, zona: 'tiron', musc: ['Lat', 'Bizeps, Core'], equipo: 'Stange + assistierte Maschine oder Bänder',
      cues: ['Starte, indem du die Schulterblätter senkst (Schultern weg von den Ohren)', 'Zieh die Ellbogen nach unten, Kinn über die Stange', 'KONTROLLIERT runter bis fast gestreckte Arme', 'Reduziere die Unterstützung Woche für Woche: Sie kommen schneller, als du denkst'],
      err: ['Strampeln und Schwung holen', 'Halber Klimmzug (weder oben noch unten)', 'Unten passiv in den Schultern hängen ohne Schulterblatt-Spannung'],
      alt: [{ n: 'Schwerer Latzug im Obergriff', por: 'wenn an dem Tag keine assistierte Maschine frei ist' }, { n: 'Negative Klimmzüge (Sprung + 5″ absenken)', por: 'großer Baumeister des ersten Klimmzugs' }],
      mol: 'Wenn der Ellbogen zwickt: neutraler Griff. Wenn die Schulter zwickt: unten nicht passiv aushängen.',
      hito: 'dominada-libre'
    },
    'pullover-polea': { pat: 'tv',
      nombre: 'Pullover am Kabel', mm: { p: ['dorsal'], s: [] }, zona: 'tiron', musc: ['Lat (isoliert)'], equipo: 'Kabelzug oben + Stange oder Seil',
      cues: ['Arme fast gestreckt, Scharnier nur in der Schulter', 'Führ die Stange im Bogen zum Oberschenkel', 'Dehnung oben, Anspannung unten'],
      err: ['Ellbogen beugen (wird zum Trizepsdrücken)', 'Oberkörper schaukeln'],
      alt: [{ n: 'Pullover mit Kurzhantel auf der Bank', por: 'ohne freien Kabelzug' }],
      mol: 'Wenn die Schulter zwickt: Bogen oben verkleinern.'
    },
    'face-pull': { pat: 'tv',
      nombre: 'Face Pull', mm: { p: ['hombro'], s: ['espalda-alta'] }, zona: 'tiron', musc: ['Hintere Schulter', 'Rotatoren, mittlerer Trapez'], equipo: 'Kabelzug oben + Seil',
      cues: ['Kabel auf Gesichtshöhe', 'Zieh das Seil ZUR STIRN und zieh die Enden auseinander', 'Am Ende die Schultern nach außen rotieren (Bizeps zeigen zur Decke)', 'Leicht und perfekt: Das ist Schultergesundheit, kein Ego'],
      err: ['Mit Gewicht zum aufrechten Rudern machen', 'Ohne Außenrotation am Ende'],
      alt: [{ n: 'Reverse Pec-Deck', por: 'hintere Schulter ohne Seil' }, { n: 'Außenrotation mit Band', por: 'zuhause oder als Extra' }],
      mol: 'Das ist die Übung, die Schultern repariert; wenn sie zwickt, Gewicht runter und prüfen, dass du zur Stirn ziehst, nicht zum Hals.'
    },
    'encogimientos': { pat: 'ais',
      nombre: 'Shrugs mit Kurzhanteln', mm: { p: ['espalda-alta'], s: [] }, zona: 'tiron', musc: ['Oberer Trapez'], equipo: 'Kurzhanteln',
      cues: ['Schultern zu den Ohren, 1″ Pause oben', 'Arme wie Seile: Ellbogen nicht beugen', 'Kontrolliert runter und dehnen'],
      err: ['Die Schultern kreisen lassen (bringt nichts und reibt)', 'Mit den Beinen federn'],
      alt: [{ n: 'Mit Langhantel', por: 'mehr Gesamtlast' }],
      mol: 'Wenn der Nacken zwickt: geradeaus schauen und das Kinn nicht einziehen.'
    },

    /* — Gym: Beine/Hüfte — */
    'sentadilla-barra': { pat: 'rod',
      nombre: 'Langhantel-Kniebeuge', mm: { p: ['cuadriceps'], s: ['abdomen', 'gluteo'] }, zona: 'pierna', musc: ['Quadrizeps', 'Gesäß, Core'], equipo: 'Langhantel + Rack',
      cues: ['Stange auf dem Trapez, nicht auf der Halswirbelsäule', 'Core unter Druck, BEVOR du runtergehst (Luft in Brust-Bauch ziehen)', 'Runter bis zur Parallele, Knie nach außen', 'Drück den Boden weg, Brust hoch beim Hochkommen'],
      err: ['Fersen, die abheben (Schuld der Sprunggelenke: Fersen notfalls auf Scheiben erhöhen)', 'Knie, die beim Hochkommen nach innen kollabieren', 'Good Morning: Die Hüfte steigt vor der Brust'],
      alt: [{ n: 'Kniebeuge an der Multipresse', por: 'an müden Tagen oder bei belegtem Rack' }, { n: 'Hack Squat / Beinpresse', por: 'Quadrizeps-Reiz ohne axiale Last' }, { n: 'Goblet Squat mit Kurzhantel', por: 'als Aufwärmen oder wenn die Technik verloren geht' }],
      mol: 'Wenn das Knie zwickt: Absenktempo erhöhen (3″) und 5 cm über dem kritischen Punkt bleiben. Wenn der untere Rücken zwickt: Atemdruck prüfen und eine Woche 20% Gewicht rausnehmen.'
    },
    'prensa': { pat: 'rod',
      nombre: 'Beinpresse', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadrizeps', 'Gesäß'], equipo: 'Beinpresse',
      cues: ['Füße auf halber Höhe der Plattform, schulterbreit', 'Runter bis 90°, OHNE dass der untere Rücken von der Lehne abhebt', 'Mit der ganzen Sohle drücken, Knie nicht ruckartig durchstrecken'],
      err: ['So tief gehen, dass das Becken kippt (Butt Wink an der Presse = unterer Rücken)', 'Mit den Händen auf die Knie drücken'],
      alt: [{ n: 'Hack Squat', por: 'noch mehr Quadrizeps' }, { n: 'Einbeinige Beinpresse', por: 'bei Dysbalancen' }],
      mol: 'Wenn das Knie zwickt: Füße etwas höher auf der Plattform (mehr Gesäß, weniger Knie).'
    },
    'rdl-barra': { pat: 'bis',
      nombre: 'Rumänisches Kreuzheben', mm: { p: ['isquios'], s: ['gluteo', 'lumbar'] }, zona: 'pierna', musc: ['Beinbizeps', 'Gesäß, unterer Rücken isometrisch'], equipo: 'Langhantel',
      cues: ['Hüfte nach HINTEN, Knie leicht gebeugt und fix', 'Stange am Bein entlang, die ganze Reise', 'Rücken neutral: stolze Brust', 'Runter bis zur kräftigen Dehnung im Beinbizeps, hoch mit angespanntem Gesäß'],
      err: ['Rücken runden, um tiefer zu kommen', 'Knie beugen und eine halbe Kniebeuge daraus machen', 'Stange, die sich vom Körper entfernt'],
      alt: [{ n: 'RDL mit Kurzhanteln', por: 'bequemerer Griff in den ersten Wochen' }, { n: 'Hyperextensions 45° mit Gewicht', por: 'Beinbizeps-Gesäß ohne Grifflast' }],
      mol: 'Die Dehnung im Beinbizeps ist das Zeichen, dass du es RICHTIG machst. Wenn der untere Rücken zwickt (nicht der Beinbizeps): 20% runter und einen Satz von der Seite filmen.'
    },
    'hip-thrust': { pat: 'bis',
      nombre: 'Hip Thrust', mm: { p: ['gluteo'], s: ['isquios'] }, zona: 'pierna', musc: ['Gesäß', 'Beinbizeps'], equipo: 'Langhantel + Bank (+ Polster)',
      cues: ['Oberer Rücken auf der Bank, Stange mit Polster auf der Hüfte', 'Kinn zur Brust, Blick nach vorn-unten', 'Hoch bis EXAKT zur Horizontalen, 1″ Pause mit Anspannung', 'Knie oben bei 90°, Fersen unter den Knien'],
      err: ['Oben ins Hohlkreuz gehen (Überstreckung)', 'Über die Fußspitzen drücken', 'Unten abfedern ohne Pause'],
      alt: [{ n: 'Hip-Thrust-Maschine', por: 'falls dein Gym eine hat, viel schnellerer Aufbau' }, { n: 'Glute Bridge mit Langhantel am Boden', por: 'ohne freie Bank' }],
      mol: 'Wenn der untere Rücken zwickt: fast immer Überstreckung oben; stopp in der Horizontalen.'
    },
    'zancada-mc': { pat: 'zan',
      nombre: 'Ausfallschritte mit Kurzhanteln', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadrizeps', 'Gesäß'], equipo: 'Kurzhanteln',
      cues: ['Gleiche Technik wie zuhause, jetzt mit 6-10 kg pro Hand', 'Großer Schritt, Oberkörper aufrecht, hinteres Knie streift den Boden', 'Die Hanteln hängen dicht am Körper, Schultern zurück', 'Drück über die vordere Ferse zurück'],
      err: ['Kurzer Schritt, der das vordere Knie kollabieren lässt', 'Nach vorn kippen, wenn du ermüdest', 'Zum Boden schauen und die Linie verlieren'],
      alt: [{ n: 'Ausfallschritte nach hinten mit Kurzhanteln', por: 'knieschonender' }, { n: 'Ausfallschritte an der Multipresse', por: 'wenn die Balance die Last begrenzt' }],
      mol: 'Wenn das Knie zwickt: längerer Schritt und Wechsel zu Ausfallschritten nach hinten.'
    },
    'zancada-bulgara': { pat: 'zan',
      nombre: 'Bulgarian Split Squats', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadrizeps', 'Gesäß'], equipo: 'Bank + Kurzhanteln',
      cues: ['Hinterer Fuß auf der Bank, vorderer einen großen Schritt entfernt', 'SENKRECHT runter: Das hintere Knie sucht den Boden', 'Oberkörper leicht geneigt = mehr Gesäß; aufrecht = mehr Quadrizeps', 'Starte NUR mit Körpergewicht, im Ernst'],
      err: ['Vorderer Fuß zu nah (das Knie leidet)', 'Unten abfedern', 'Balance verlieren durch Blick zur Decke'],
      alt: [{ n: 'Statischer Ausfallschritt mit Kurzhanteln', por: 'wenn die Balance noch nicht da ist' }, { n: 'Einbeinige Beinpresse', por: 'unilateral ohne Balance' }],
      mol: 'Wenn das vordere Knie zwickt: Schritt verlängern und den Oberkörper etwas nach vorn nehmen.'
    },
    'ext-cuadriceps': { pat: 'rod',
      nombre: 'Beinstrecker', mm: { p: ['cuadriceps'], s: [] }, zona: 'pierna', musc: ['Quadrizeps (isoliert)'], equipo: 'Maschine',
      cues: ['Knie in Linie mit der Maschinenachse', 'Ganz strecken mit 1″ Pause oben', 'In 2-3″ runter'],
      err: ['Mit Schwung treten', 'Po, der vom Sitz abhebt'],
      alt: [{ n: 'Assistierter Sissy Squat', por: 'ohne Maschine' }],
      mol: 'Wenn die Kniescheibe zwickt: das letzte Drittel OBEN kappen, nicht unten, und langsameres Tempo. Das ist auch deine Reha-Übung, falls das Knie eines Tages vom Joggen protestiert.'
    },
    'curl-femoral-tumbado': { pat: 'ais',
      nombre: 'Beinbeuger liegend', mm: { p: ['isquios'], s: [] }, zona: 'pierna', musc: ['Beinbizeps (isoliert)'], equipo: 'Maschine',
      cues: ['Hüfte die ganze Zeit an der Bank ANGEDRÜCKT', 'In 1″ hoch, in 2-3″ runter', 'Fußspitze neutral'],
      err: ['Die Hüfte anheben, um zu helfen', 'Halbe Wiederholung'],
      alt: [{ n: 'Beinbeuger sitzend', por: 'tatsächlich etwas besser für den Beinbizeps; nimm ihn, wenn er frei ist' }, { n: 'Assistierter Nordic Curl', por: 'fortgeschrittene Version, für später' }],
      mol: 'Bei Krampf: Beinbizeps zwischen den Sätzen dehnen, in den ersten Wochen normal.'
    },
    'curl-femoral-sentado': { pat: 'ais',
      nombre: 'Beinbeuger sitzend', mm: { p: ['isquios'], s: [] }, zona: 'pierna', musc: ['Beinbizeps (isoliert)'], equipo: 'Maschine',
      cues: ['Oberschenkel gut vom Polster fixiert', 'Ganz beugen, 1″ Pause', 'Langsam zurück und dagegenhalten'],
      err: ['Po, der nach vorn rutscht', 'Kurzer Radius durch zu viel Gewicht'],
      alt: [{ n: 'Beinbeuger liegend', por: 'gleichwertig' }],
      mol: 'Keine typischen Beschwerden: eine der sichersten Übungen im Plan.'
    },
    'gemelo-pie': { pat: 'gem',
      nombre: 'Wadenheben stehend', mm: { p: ['gemelos'], s: [] }, zona: 'pierna', musc: ['Wade (Gastrocnemius)'], equipo: 'Maschine oder Multipresse + Stufe',
      cues: ['1″ Pause OBEN und 1″ UNTEN: kein Federn', 'Volle Dehnung unten', 'Senkrecht hoch, ohne die Knie zu beugen'],
      err: ['Federn über den Sehnenreflex (raubt genau dem Gewebe den Reiz, das wir vorbereiten wollen)', 'Halber Radius'],
      alt: [{ n: 'An der Beinpresse', por: 'ohne spezielle Maschine' }],
      mol: 'Wenn die Achillessehne zwickt: diese Woche nur Isometrie oben, 3×30″.'
    },
    'gemelo-sentado': { pat: 'gem',
      nombre: 'Wadenheben sitzend', mm: { p: ['gemelos'], s: [] }, zona: 'pierna', musc: ['Soleus'], equipo: 'Maschine',
      cues: ['Knie bei 90°: Hier arbeitet der Soleus, entscheidend fürs JOGGEN', 'Gleiche Regel: Pause oben und unten, kein Federn'],
      err: ['Schnell und federnd', 'Auflage auf den Zehenspitzen (besser am Ballen)'],
      alt: [{ n: 'Sitzend mit Kurzhanteln auf den Knien + Stufe', por: 'ohne Maschine' }],
      mol: 'Wie im Stehen: Achillessehnen-Beschwerden = eine Woche nur Isometrie.'
    },
    'elev-piernas': { pat: 'flex',
      nombre: 'Beinheben hängend', mm: { p: ['abdomen'], s: ['antebrazo'] }, zona: 'core', musc: ['Unterer Bauch', 'Hüftbeuger, Griffkraft'], equipo: 'Klimmzugstange',
      cues: ['Aktiv hängen (Schultern weg von den Ohren)', 'Knie zur Brust OHNE Pendeln', 'Ganz kontrolliert absenken'],
      err: ['Schaukeln', 'Nur aus den Hüftbeugern ziehen mit Hohlkreuz'],
      alt: [{ n: 'Im Beinhebeständer (Ellbogenstütze)', por: 'wenn der Griff vor dem Bauch versagt' }, { n: 'Beinheben im Liegen', por: 'Einstiegsversion' }],
      mol: 'Wenn die Schulter im Hang zwickt: direkt in den Beinhebeständer.'
    },
    'rueda-abdominal': { pat: 'flex',
      nombre: 'Ab Wheel', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Kompletter vorderer Core'], equipo: 'Ab Wheel',
      cues: ['Auf den Knien, Becken kippen, BEVOR du losrollst', 'Roll so weit, wie du den unteren Rücken kontrollierst', 'Zurück mit Zug aus dem Bauch, nicht aus den Armen'],
      err: ['Beim Ausrollen ins Hohlkreuz gehen (der Fehler, der verletzt)', 'Weiter rollen, als der Core aushält'],
      alt: [{ n: 'Kabel-Crunch', por: 'wenn das Rad heute zu groß ist' }, { n: 'Plank mit Zusatzgewicht', por: 'gleichwertige Isometrie' }],
      mol: 'Wenn der untere Rücken zwickt: Weg halbieren und Woche für Woche Radius gewinnen.'
    },
    'crunch-polea': { pat: 'flex',
      nombre: 'Kabel-Crunch', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Gerader Bauchmuskel'], equipo: 'Kabelzug oben + Seil',
      cues: ['Auf den Knien, Seil seitlich am Kopf', 'Beuge AUS DEN RIPPEN, nicht aus der Hüfte', 'Ellbogen Richtung Knie, beim Runtergehen ausatmen'],
      err: ['Mit den Armen ziehen', 'Nach hinten setzen und nur die Hüfte bewegen'],
      alt: [{ n: 'Crunch-Maschine', por: 'gleichwertig' }, { n: 'Ab Wheel', por: 'wenn du ein Level höher willst' }],
      mol: 'Keine typischen Beschwerden, wenn du aus den Rippen beugst.'
    },

    /* — Arme — */
    'curl-barra-z': { pat: 'curl',
      nombre: 'SZ-Curls', mm: { p: ['biceps'], s: [] }, zona: 'tiron', musc: ['Bizeps'], equipo: 'SZ-Stange',
      cues: ['Ellbogen am Körper, FIXIERT', 'Hoch ohne Schwung, in 2-3″ runter', 'Handgelenke neutral dank der SZ-Stange'],
      err: ['Den Körper pendeln, um mehr Gewicht zu heben', 'Ellbogen, die oben nach vorn wandern'],
      alt: [{ n: 'Kurzhantel-Curls im Wechsel', por: 'mit Drehung (Supination), sehr komplett' }, { n: 'Curls am Kabel unten', por: 'konstante Spannung' }],
      mol: 'Wenn Handgelenk oder Ellbogen zwicken: Kurzhanteln mit Drehung oder Hammergriff.'
    },
    'curl-inclinado': { pat: 'curl',
      nombre: 'Schrägbank-Curls', mm: { p: ['biceps'], s: [] }, zona: 'tiron', musc: ['Bizeps (langer Kopf)'], equipo: 'Kurzhanteln + Bank 45-60°',
      cues: ['Bank auf 45-60°, Arme HÄNGEN senkrecht', 'Die Dehnung unten ist der Reiz: Kürz sie nicht ab', 'Ellbogen still, hoch ohne Schulterheben'],
      err: ['Ellbogen nach vorn nehmen', 'Halbe Wiederholung unten'],
      alt: [{ n: 'Bayesian Curls am Kabel', por: 'gleiche Dehnung, im Stehen' }],
      mol: 'Wenn es unten in der Schulter zieht: Lehne eine Raste höher.'
    },
    'curl-martillo': { pat: 'curl',
      nombre: 'Hammercurls', mm: { p: ['biceps'], s: ['antebrazo'] }, zona: 'tiron', musc: ['Brachialis', 'Unterarm'], equipo: 'Kurzhanteln',
      cues: ['Neutraler Griff (Hammer), Ellbogen fix', 'Im Wechsel oder beidseitig', 'Kontrollier die Abwärtsbewegung'],
      err: ['Pendeln', 'Durch Anheben der Ellbogen zum Rudern machen'],
      alt: [{ n: 'Hammercurls mit Seil am Kabel', por: 'Variante' }],
      mol: 'Der Curl, der Ellbogen und Handgelenke am meisten schont: meist die ZUFLUCHT, wenn andere zwicken.'
    },
    'curl-polea': { pat: 'curl',
      nombre: 'Curls am Kabel', mm: { p: ['biceps'], s: [] }, zona: 'tiron', musc: ['Bizeps'], equipo: 'Kabelzug unten + Stange',
      cues: ['Ein Schritt vom Kabelturm weg, Ellbogen fix', 'Konstante Spannung: Ruh weder oben noch unten aus', 'Letzter Satz: 10″ isometrisch auf halbem Weg halten zum Abschluss'],
      err: ['So nah rangehen, dass unten keine Spannung bleibt', 'Schaukeln'],
      alt: [{ n: 'SZ-Curls', por: 'Pendant mit freiem Gewicht' }],
      mol: 'Wenn der Ellbogen zwickt: breiterer Griff oder Seil im Hammergriff.'
    }
  };

  /* ---------- DIE 8 REGELN ---------- */
  const REGLAS = [
    { n: 1, t: 'RPE unter Kontrolle', d: 'Jede Phase hat ihren Anstrengungsdeckel. Dein Nervensystem erinnert sich ans Athletsein; deine Sehnen waren 5 Jahre auf dem Sofa. Bremse du, bevor sie es tun.' },
    { n: 2, t: 'Doppelte Progression', d: 'Erst die Wiederholungen im Bereich steigern, dann das Gewicht (+2,5 kg; +5 kg bei Kniebeuge und Rumänischem Kreuzheben). Nur wenn die Technik in ALLEN Sätzen sauber war. Die App schlägt es dir von selbst vor.' },
    { n: 3, t: 'Waage = Wochenschnitt', d: 'Wieg dich Montag-Mittwoch-Freitag nüchtern und schau nur auf den Schnitt. Ein einzelner Tag bedeutet nichts (Wasser, Salz, Kreatin).' },
    { n: 4, t: 'Protein: {p} g in 4 Portionen', d: 'Frühstück, Mittag, Abend und eine Portion vor dem Schlafen. Keine Portion unter {q} g. Das ist die Variable, die entscheidet, ob deine Gewichtsänderung Fett oder Muskel ist.' },
    { n: 5, t: '8.000–10.000 Schritte täglich', d: 'Jeden Tag, ob du trainierst oder nicht. Sie verbrennen pro Woche mehr als die Sessions selbst.' },
    { n: 6, t: 'Schlaf 7–8 h: nicht verhandelbar', d: 'Kein Ziel, sondern eine Regel: 5,5 h Schlaf im Defizit macht aus dem Verlust −55% Fett und +60% Muskel (Nedeltcheva 2010). Starkes Koffein nur vor 13-14 Uhr.' },
    { n: 7, t: 'Ein verpatzter Tag wird nicht nachgeholt', d: 'Keine doppelten Sessions und kein Essenskürzen am Tag danach. Du folgst dem Kalender, wo er gerade steht.' },
    { n: 8, t: 'Das unantastbare Minimum', d: 'Dein historisches Muster ist 3 Monate Vollgas / 3 auf null. Die Chaos-Woche hat einen Boden: 2 Kraft + 1 Cardio. Das hält alles am Leben.' }
  ];

  const SENALES = 'Signale, eine Übung an dem Tag zu stoppen: stechender Schmerz in Knie, Schulter oder unterem Rücken während der Bewegung; Beschwerden, die Satz für Satz schlimmer werden, statt beim Aufwärmen zu verschwinden. Diffuser Muskelkater 24-48 h danach = normal. Lokalisierter Gelenkschmerz, der länger als 5 Tage bleibt = Physio, bevor du weiter Last draufpackst.';

  /* ---------- ERNÄHRUNG ---------- */
  const NUTRI = {
    calorias: [
      { c: 'Grundumsatz (Mifflin-St Jeor)', v: '~1.950 kcal', n: '95,1 kg · 183 cm · 30 Jahre' },
      { c: 'Geschätzter Gesamtverbrauch (Plan läuft)', v: '2.850–3.000 kcal', n: 'Training + 8-10k Schritte' },
      { c: 'Ziel-Zufuhr', v: '2.250–2.400 kcal', n: 'Defizit ~550–700 kcal/Tag (mehr bremst den Muskel-Wiederaufbau: Murphy & Koehler 2022)' },
      { c: 'Erwartetes Verlusttempo', v: '0,6–0,75 kg/Woche', n: '≈0,7% des Körpergewichts/Woche, der Sweet Spot, um Magermasse zu halten (Garthe 2011). Wochenschnitt, nicht Tag für Tag' }
    ],
    fases: [
      { f: 'P1–P2 (Wo. 1-5)', kcal: 2250, p: 190, g: 70, c: 205 },
      { f: 'P3 (Wo. 6-9)',    kcal: 2350, p: 190, g: 70, c: 230, nota: 'Woche 7: DIET BREAK bei ~2.800' },
      { f: 'P4 (Wo. 10-12)',  kcal: 2400, p: 190, g: 70, c: 240 }
    ],
    escalado: 'Protein bleibt immer gleich: {p} g am Tag für dich. Steigt das Trainingsvolumen, steigen nur die Kohlenhydrate. Praktisch: in F3 ein Stück Obst + 40 g Brot zum Mittag an Trainingstagen; in F4 dasselbe jeden Tag.',
    tomas: 'VIER Proteinportionen am Tag, keine unter {q} g: Frühstück, Mittagessen, Abendessen und eine Pre-Sleep-Portion. Die Tagessumme regiert, aber die Aufteilung auf 4 presst das Maximum aus der Proteinsynthese und nimmt den Nachthunger.',
    plato: [
      { t: 'Protein (jede Mahlzeit)', d: '200-250 g Hähnchen/Pute/weißer Fisch roh gewogen, oder 170-180 g Lachs/Rind, oder 3 Eier + 2 Eiklar, oder 250 g Skyr + Whey. Visuelle Referenz: anderthalb Handflächen.' },
      { t: 'Kohlenhydrate', d: '60-75 g roh gewogen Reis/Nudeln, oder 250-300 g Kartoffeln, oder 60 g Vollkornbrot, oder 50 g Haferflocken. Referenz: eine Faust.' },
      { t: 'Gemüse', d: 'Der halbe Teller, nach Belieben. Volumen und Sättigung.' },
      { t: 'Fett', d: '10 g natives Olivenöl extra pro Hauptmahlzeit (ein Esslöffel), und Schluss. Hier entwischen die Kalorien, ohne dass du es merkst.' }
    ],
    suplementos: [
      { t: 'Kreatin-Monohydrat', d: '5 g täglich, egal zu welcher Uhrzeit, ohne Ladephase, ab sofort. ACHTUNG: hält in den ersten Wochen 1-2 kg Wasser zurück. Das ist kein Fett: Vertrau der Taille und dem Wochenschnitt, nicht der einzelnen Zahl (die App markiert es in der Grafik).' },
      { t: 'Whey', d: '1 Messlöffel in der Pre-Sleep-Portion mit dem Skyr (und ein weiterer, wo nötig, an proteinarmen Tagen).' },
      { t: 'Koffein', d: 'Schluss um 13-14 Uhr: 200 mg stören den Schlaf bis zu 13 h danach; ein Kaffee ~9 h (Gardiner 2023). Training am Morgen: Kaffee 30-45′ vorher, perfekt. Abends: kein Koffein — dein Pre-Workout ist der Nachmittagssnack (Obst + Skyr 60-90′ vorher).' },
      { t: 'Sinnvolle Optionen', d: 'Vitamin D nur, wenn das Blutbild unter 30 ng/mL liegt (wahrscheinlich bei Indoor-Leben). Omega-3 ~2 g EPA+DHA/Tag: bescheidener, aber realer Nutzen für die Kraft plus entzündungshemmender Sehnen-Winkel.' },
      { t: 'KEIN Geld für', d: 'Fatburner, BCAA/EAA (überflüssig neben deinem täglichen Protein), „Testo-Booster". Nichts davon bewegt die Nadel.' }
    ],
    hidratacion: 'Wasser: 2,5–3 L/Tag. Alkohol: zählt Kalorien und blockiert die Regeneration — innerhalb der freien Mahlzeit ja, im Rest der Woche nicht.',
    comidaLibre: 'EINE Mahlzeit pro Woche (standardmäßig Samstag), kein ganzer Tag. Bestell oder iss, worauf du Lust hast, in normaler Menge, ohne davor oder danach zu kompensieren. Dafür hält der Plan 12 Wochen und ein Sozialleben durch. Gibt es an einem anderen Tag was vor, wird sie verschoben — bleibt aber eine.'
  };

  /* ---------- REZEPTE ---------- */
  // q in Gramm, außer Einheit angegeben · Makros pro Portion
  const RECETAS = [
    {
      id: 'bol-skyr', slot: 'de', tags: ['lacteo', 'frutos'], nombre: 'Skyr-Bowl', tipo: 'Frühstück A', tiempo: '5′', cocina: 'Ohne Kochen',
      macros: { kcal: 520, p: 35, g: 11, c: 72 },
      ing: [
        { q: '250 g', i: 'Skyr natur (oder Magerquark)' },
        { q: '50 g', i: 'Haferflocken' },
        { q: '1 Stück (120 g)', i: 'Banane' },
        { q: '10 g', i: 'Walnüsse' },
        { q: 'nach Geschmack', i: 'Zimt' }
      ],
      pasos: [
        'Skyr in die Bowl und die Haferflocken darüber (pur, wenn du Biss magst, oder 5′ in einem Fingerbreit Milch oder Wasser eingeweicht).',
        'Banane in Scheiben, Walnüsse mit der Hand zerbröselt und Zimt darüber.'
      ],
      tips: 'Wenn du morgens trainierst: Bau sie am Abend vorher (eingeweichte Haferflocken gewinnen). Proteinarmer Tag: +1 Messlöffel Whey in den Skyr gerührt (+110 kcal, +23 g P).'
    },
    {
      id: 'tortilla-pan', slot: 'de', tags: ['huevo', 'gluten'], nombre: 'Omelett mit Brot und Tomate', tipo: 'Frühstück B', tiempo: '10′', cocina: 'Pfanne',
      macros: { kcal: 470, p: 34, g: 22, c: 32 },
      ing: [
        { q: '3 Stück', i: 'Eier (M)' },
        { q: '2 Stück (oder 100 ml flüssig)', i: 'Eiklar' },
        { q: '60 g (2 Scheiben)', i: 'Vollkornbrot' },
        { q: '100 g', i: 'geriebene Tomate' },
        { q: '5 g', i: 'natives Olivenöl extra' },
        { q: 'Prise', i: 'Salz' }
      ],
      pasos: [
        'Eier und Eiklar mit dem Salz verquirlen.',
        'Beschichtete Pfanne bei mittlerer Hitze mit den 5 g Olivenöl: Stock das Omelett so, wie du es magst.',
        'Brot toasten und die geriebene Tomate mit einem Tropfen Öl aus der Pfanne darauf.'
      ],
      tips: 'Flüssig-Eiklar spart das lästige Trennen. Rührei-Version: gleiche Zeit, null Technik.'
    },
    {
      id: 'pollo-asado', slot: 'co', tags: ['carne'], nombre: 'Ofenhähnchen mit Kartoffeln', tipo: 'Mittag · Sonntags-Batch', tiempo: '45′ Ofen (aus dem Meal Prep)', cocina: 'Ofen',
      macros: { kcal: 780, p: 70, g: 19, c: 68 },
      ing: [
        { q: '250 g roh (~200 g gegart)', i: 'Hähnchenbrust', n: 'Batch: 1,2 kg = 5 Portionen' },
        { q: '300 g', i: 'Kartoffelspalten + Paprika + Zwiebel aus dem Ofen', n: 'Batch: 1,5 kg Kartoffeln + 2 Paprika + 2 Zwiebeln' },
        { q: '10 g', i: 'natives Olivenöl extra (Teil des Ofengemüses)' },
        { q: 'nach Geschmack', i: 'Paprikapulver, Knoblauchpulver, Salz, Oregano' }
      ],
      pasos: [
        'Ofen auf 200°. Die Brüste salzen, pfeffern und mit Paprika- + Knoblauchpulver einreiben.',
        'Blech 1: Brüste, 25-30′ (gerade durch = saftig; drüber, und sie werden Schuhsohle).',
        'Blech 2: Kartoffelspalten mit Paprika, Zwiebel und insgesamt 20 g Olivenöl, 40-45′, zur Halbzeit wenden.',
        'Portionieren: 5 Boxen. Das Hähnchen für Donnerstag-Freitag in den Gefrierschrank.'
      ],
      tips: 'Die Portion ist in 2′ Mikrowelle mit einem Schuss Wasser wieder warm, damit das Hähnchen nicht austrocknet.'
    },
    {
      id: 'lentejas-pollo', slot: 'co', tags: ['carne'], nombre: 'Linsen mit Hähnchen', tipo: 'Mittag · Sonntags-Batch', tiempo: '25′ Topf', cocina: 'Topf',
      macros: { kcal: 760, p: 52, g: 16, c: 80 },
      ing: [
        { q: '250 g abgetropft', i: 'gekochte Linsen aus der Dose', n: 'Batch: 2 Dosen = 3 Portionen' },
        { q: '120 g', i: 'Ofenhähnchen in Streifen (vom Backen)' },
        { q: '¼ Stück', i: 'Zwiebel' },
        { q: '½ Stück', i: 'Paprika' },
        { q: '1 Stück', i: 'Karotte' },
        { q: '4 g', i: 'natives Olivenöl extra (fürs Anschwitzen)' },
        { q: '1 TL / ½ TL', i: 'Paprikapulver / Kreuzkümmel' },
        { q: '150 ml', i: 'Brühe oder Wasser' },
        { q: '1 Stück', i: 'Obst zum Nachtisch' }
      ],
      pasos: [
        'Anschwitzen 8′: gehackte Zwiebel, Paprika und Karotte mit 10 g Olivenöl (für den 3-Portionen-Batch).',
        'Abgetropfte Linsen, Brühe, Paprikapulver und Kreuzkümmel dazu: 15′ bei niedriger Hitze.',
        'Ausschalten und das Hähnchen in Streifen unterrühren (so trocknet es nicht aus).'
      ],
      tips: 'Aus der Dose und ohne Einweichen: die schnellste Hülsenfrucht überhaupt. Am nächsten Tag dicken sie ein: beim Aufwärmen einen Fingerbreit Wasser dazu.'
    },
    {
      id: 'salteado-ternera', slot: 'co', tags: ['carne'], nombre: 'Rind-Gemüse-Pfanne', tipo: 'Mittag · 15′ frisch', tiempo: '15′', cocina: 'Wok / Pfanne',
      macros: { kcal: 730, p: 45, g: 20, c: 60 },
      ing: [
        { q: '180-200 g', i: 'mageres Rindfleisch in Streifen' },
        { q: '70 g roh (≈ 180 g gegart)', i: 'Reis', n: 'nimm den aus dem Batch' },
        { q: '250 g', i: 'gemischtes Gemüse: Paprika, Zwiebel, Zucchini, Karotte' },
        { q: '15 ml', i: 'Sojasauce' },
        { q: '8 g', i: 'natives Olivenöl extra' }
      ],
      pasos: [
        'Wok oder Pfanne RICHTIG heiß mit dem Olivenöl: Das Rind 1-2′ scharf anbraten und rausnehmen (bleibt es drin, kocht es und wird zäh).',
        'Gleiche Pfanne: Gemüsestreifen 5-6′, bissfest.',
        'Rind zurück, Soja dazu, 1′ schwenken und ab auf den Reis.'
      ],
      tips: 'Die Reihenfolge ist alles: Fleisch raus, bevor das Gemüse reinkommt. Bestell an der Fleischtheke „Streifen zum Kurzbraten" und spar dir das Schneiden.'
    },
    {
      id: 'salmon-arroz', slot: 'ce', tags: ['pescado'], nombre: 'Lachs mit Reis und Brokkoli', tipo: 'Abend · 15′', tiempo: '15′', cocina: 'Grillpfanne oder Ofen',
      macros: { kcal: 760, p: 40, g: 28, c: 62 },
      ing: [
        { q: '170-180 g', i: 'Lachsfilet' },
        { q: '75 g roh (≈ 190 g gegart)', i: 'Reis', n: 'aus dem Batch' },
        { q: '200 g', i: 'Brokkoli' },
        { q: '½ Stück', i: 'Zitrone' },
        { q: 'Prise', i: 'Salz' }
      ],
      pasos: [
        'Brokkoli in der Mikrowelle in abgedeckter Schüssel mit einem Fingerbreit Wasser: 4-5′ (oder Dampf).',
        'Lachs in der Pfanne 3-4′ pro Seite, Hautseite zuerst (oder Ofen 200°, 12′). Ohne Öl: Er bringt sein eigenes mit.',
        'Reis aufwärmen, Zitrone über alles pressen.'
      ],
      tips: 'Das Fett des Lachses zählt als das Fett der Mahlzeit: Darum gibt es hier kein Olivenöl.'
    },
    {
      id: 'merluza-patata', slot: 'ce', tags: ['pescado', 'lacteo'], nombre: 'Seehecht mit Ofenkartoffeln', tipo: 'Abend · 20′', tiempo: '20′', cocina: 'Ofen oder Mikro+Pfanne',
      macros: { kcal: 740, p: 55, g: 15, c: 55 },
      ing: [
        { q: '250 g', i: 'Seehecht oder Wolfsbarsch als Filet' },
        { q: '250 g', i: 'Kartoffeln' },
        { q: 'Schüssel', i: 'grüner Salat (Kopfsalat, Tomate, Zwiebel)' },
        { q: '10 g', i: 'natives Olivenöl extra (5 Kartoffeln + 5 Salat)' },
        { q: '1 Stück', i: 'Skyr zum Nachtisch' }
      ],
      pasos: [
        'Kartoffeln in ½-cm-Scheiben: 8′ abgedeckt in die Mikrowelle (oder 25′ Ofen mit 5 g Olivenöl, Salz und Oregano).',
        'Seehecht: Ofen 200°, 10-12′, oder Pfanne 3′ pro Seite. Gar, wenn er in Lamellen zerfällt.',
        'Salat mit 5 g Olivenöl und Essig. Skyr zum Nachtisch, Abendessen erledigt.'
      ],
      tips: 'Weißer Fisch ist das sättigendste Protein pro Kalorie im ganzen Plan: Nutz ihn an den Tagen mit dem größten Hunger.'
    },
    {
      id: 'revuelto-gambas', slot: 'ce', tags: ['pescado', 'huevo', 'gluten'], nombre: 'Rührei mit Garnelen', tipo: 'Abend · 10′', tiempo: '10′', cocina: 'Pfanne',
      macros: { kcal: 620, p: 45, g: 30, c: 25 },
      ing: [
        { q: '3 Stück', i: 'Eier (M)' },
        { q: '150 g', i: 'geschälte Garnelen (tiefgekühlt funktionieren perfekt)' },
        { q: '40 g', i: 'Vollkornbrot' },
        { q: 'Schüssel', i: 'grüner Salat' },
        { q: '8 g', i: 'natives Olivenöl extra' },
        { q: '1 Zehe', i: 'Knoblauch' }
      ],
      pasos: [
        'Knoblauch in Scheiben im Olivenöl goldbraun anbraten; Garnelen 2′ (vorher aufgetaut und trockengetupft).',
        'Hitze runter, verquirlte Eier dazu und OHNE PAUSE rühren, bis es cremig ist. Vom Herd, bevor es ganz stockt.',
        'Brot toasten, Salat daneben.'
      ],
      tips: 'Das Rührei gart abseits der Hitze fertig. TK-Garnelen: in einer Schüssel kaltem Wasser in 10′ auftauen.'
    },
    {
      id: 'toma-noche', slot: 'snack', tags: ['lacteo'], nombre: 'Pre-Sleep-Portion', tipo: 'Portion 4 · täglich', tiempo: '1′', cocina: 'Ohne Kochen',
      macros: { kcal: 270, p: 49, g: 2, c: 14 },
      ing: [
        { q: '250 g', i: 'Skyr oder Magerquark' },
        { q: '1 Messlöffel (30 g)', i: 'Whey (die Sorte, die dich nicht langweilt)' },
        { q: 'nach Geschmack', i: 'Zimt' }
      ],
      pasos: [
        'Den Messlöffel Whey mit dem Skyr zu Mousse-Textur verrühren. Zimt darüber.',
        '30-60′ vor dem Zubettgehen. Das war’s.'
      ],
      tips: 'Diese Portion rundet das Tagesprotein ab und stoppt den Nachthunger, den Moment, in dem Diäten sterben. Langsam verdauliches Milchkasein arbeitet im Schlaf.'
    },
    {
      id: 'ensalada-atun', slot: 'ce', tags: ['pescado', 'huevo'], nombre: 'Kompletter Thunfischsalat', tipo: 'Abend · 10′', tiempo: '10′', cocina: 'Ohne Herd (mit Batch)',
      macros: { kcal: 700, p: 45, g: 25, c: 50 },
      ing: [
        { q: '2 Dosen (120 g abgetropft)', i: 'Thunfisch im eigenen Saft' },
        { q: '1 Stück', i: 'hartgekochtes Ei (aus dem Batch)' },
        { q: '150 g', i: 'gekochte Kartoffeln (aus dem Batch)' },
        { q: '150 g', i: 'Tomate' },
        { q: '30 g', i: 'Oliven' },
        { q: '¼ Stück', i: 'rote Zwiebel' },
        { q: '10 g', i: 'natives Olivenöl extra' }
      ],
      pasos: [
        'Alles in die Schüssel: Kartoffelwürfel, Tomatenspalten, fein geschnittene Zwiebel, abgetropfter Thunfisch, geviertelte Eier, Oliven.',
        'Olivenöl, Essig, Salz und einmal durchschwenken.'
      ],
      tips: 'Das Null-Aufwand-Abendessen, wenn am Sonntag extra Kartoffeln und Eier gekocht wurden. Version ohne Kartoffel (Tag mit wenig Hunger): mehr Tomate rein.'
    },
    { id: 'porridge-soja', slot: 'de', tags: [], nombre: 'Hafer-Protein-Porridge', tipo: 'Frühstück C', tiempo: '8′', cocina: 'Topf oder Mikrowelle',
      macros: { kcal: 545, p: 37, g: 11, c: 69 },
      ing: [{ q: '70 g', i: 'Haferflocken (zertifiziert glutenfrei)' }, { q: '250 ml', i: 'Sojadrink ohne Zucker' }, { q: '25 g', i: 'Erbsenprotein, neutral oder Vanille' }, { q: '1', i: 'Banane in Scheiben' }, { q: 'nach Geschmack', i: 'Zimt' }],
      pasos: ['Hafer mit Sojadrink 4-5′ unter Rühren erhitzen, bis es dick wird.', 'Vom Herd nehmen und das Protein einrühren: gekocht klumpt es.', 'Mit Banane und Zimt toppen.'],
      tips: 'Abends im Kühlschrank vorbereiten (Overnight Oats), morgens nur das Protein einrühren.' },
    { id: 'tofu-revuelto', slot: 'de', tags: [], nombre: 'Tofu-Rührei auf Toast', tipo: 'Frühstück D', tiempo: '12′', cocina: 'Pfanne',
      macros: { kcal: 570, p: 41, g: 25, c: 42 },
      ing: [{ q: '200 g', i: 'fester Tofu, zerbröselt' }, { q: '2 Scheiben (70 g)', i: 'glutenfreies Brot' }, { q: '10 g', i: 'Hefeflocken' }, { q: '1', i: 'Tomate in Scheiben' }, { q: '5 g', i: 'natives Olivenöl extra' }, { q: 'nach Geschmack', i: 'Kurkuma, Kala-Namak-Schwarzsalz, Pfeffer' }],
      pasos: ['Zerbröselten Tofu im Öl 3-4′ bei mittlerer bis hoher Hitze anbraten.', 'Kurkuma, Hefeflocken und Schwarzsalz (der Ei-Geschmack) dazu; 2′ weiter.', 'Brot toasten und mit der Tomate anrichten.'],
      tips: 'Kala Namak ist der Schlüssel: ohne ist es Tofu mit Kurkuma, mit ist es Rührei.' },
    { id: 'bol-soja-frutos', slot: 'de', tags: [], nombre: 'Sojajoghurt-Bowl mit Beeren', tipo: 'Frühstück E', tiempo: '5′', cocina: 'Ohne Kochen',
      macros: { kcal: 415, p: 29, g: 11, c: 41 },
      ing: [{ q: '250 g', i: 'Sojajoghurt natur, ungesüßt' }, { q: '20 g', i: 'pflanzliches Proteinpulver' }, { q: '120 g', i: 'Beeren (tiefgekühlt geht)' }, { q: '15 g', i: 'Chiasamen' }, { q: '1', i: 'kleine Banane' }],
      pasos: ['Joghurt mit dem Protein glatt rühren.', 'Chia dazu, 5′ warten: dickt von selbst an.', 'Mit Beeren und Banane toppen.'],
      tips: 'Tiefgekühlte Beeren direkt aus der Packung kühlen und binden die Bowl: hier besser als frische.' },
    { id: 'revuelto-espinacas', slot: 'de', tags: ['huevo'], nombre: 'Rührei mit Spinat', tipo: 'Frühstück F', tiempo: '10′', cocina: 'Pfanne',
      macros: { kcal: 510, p: 28, g: 21, c: 46 },
      ing: [{ q: '3', i: 'Eier' }, { q: '100 g', i: 'frischer Spinat' }, { q: '100 g', i: 'Champignons in Scheiben' }, { q: '50 g', i: 'glutenfreies Brot' }, { q: '5 g', i: 'natives Olivenöl extra' }, { q: '150 g', i: 'Obst der Saison' }],
      pasos: ['Champignons 3′ anbraten; Spinat dazu, bis er zusammenfällt.', 'Verquirlte Eier rein, kleine Hitze, rühren: cremig, nicht trocken.', 'Mit dem getoasteten Brot und dem Obst servieren.'],
      tips: 'Herd aus, solange es noch leicht roh aussieht: die Restwärme macht den Rest.' },
    { id: 'curry-lentejas', slot: 'co', tags: [], nombre: 'Rotes-Linsen-Curry mit Reis', tipo: 'Mittag · Sonntags-Batch', tiempo: '25′ Topf', cocina: 'Topf',
      macros: { kcal: 755, p: 31, g: 18, c: 108 },
      ing: [{ q: '100 g', i: 'rote Linsen, trocken' }, { q: '100 ml', i: 'leichte Kokosmilch' }, { q: '150 g', i: 'passierte Tomaten' }, { q: '50 g', i: 'Basmatireis, trocken' }, { q: '10 g', i: 'natives Olivenöl extra' }, { q: 'nach Geschmack', i: 'Zwiebel, Knoblauch, Ingwer, Currypulver, Salz' }],
      pasos: ['Zwiebel, Knoblauch und Ingwer 3′ anschwitzen; Curry dazu und 30″ rösten.', 'Linsen, Tomate, Kokos und 300 ml Wasser: 18-20′ bei mittlerer Hitze, bis sie zerfallen.', 'Reis separat (12′). Curry obendrauf.'],
      tips: 'Batch: ×4 hält 4 Tage im Kühlschrank und lässt sich perfekt einfrieren. Rote Linsen müssen nicht einweichen.' },
    { id: 'tofu-salteado', slot: 'co', tags: [], nombre: 'Gebratener Tofu mit Gemüse und Vollkornreis', tipo: 'Mittag · 20′', tiempo: '20′', cocina: 'Wok / Pfanne',
      macros: { kcal: 775, p: 47, g: 34, c: 71 },
      ing: [{ q: '200 g', i: 'fester Tofu, gewürfelt' }, { q: '70 g', i: 'Vollkornreis, trocken' }, { q: '250 g', i: 'Brokkoli, Paprika und Karotte' }, { q: '15 ml', i: 'Tamari (glutenfreie Sojasauce)' }, { q: '10 g', i: 'natives Olivenöl extra' }, { q: '10 g', i: 'Sesam' }],
      pasos: ['Vollkornreis kochen (25′; im Batch vorkochen).', 'Tofu bei starker Hitze rundum goldbraun braten (6-7′); beiseitestellen.', 'Gemüse 4′ im Wok, Tofu zurück, Tamari und Sesam; 1′ und fertig.'],
      tips: 'Tofu 10′ zwischen zwei Tellern mit Gewicht pressen: er verliert Wasser und bräunt wirklich.' },
    { id: 'bol-garbanzos', slot: 'co', tags: [], nombre: 'Bowl mit gerösteten Kichererbsen, Quinoa und Hummus', tipo: 'Mittag · 15′ frisch', tiempo: '15′ (+ Ofen)', cocina: 'Ofen + ohne Kochen',
      macros: { kcal: 780, p: 31, g: 24, c: 103 },
      ing: [{ q: '200 g', i: 'gekochte Kichererbsen' }, { q: '60 g', i: 'Quinoa, trocken' }, { q: '50 g', i: 'Hummus' }, { q: '150 g', i: 'gegrillte Paprika und Gurke' }, { q: '5 g', i: 'natives Olivenöl extra' }, { q: 'nach Geschmack', i: 'Kreuzkümmel, Paprikapulver, Zitrone, Salz' }],
      pasos: ['Abgetropfte Kichererbsen mit Paprika, Kreuzkümmel und Salz: Ofen 200° 20′ bis knusprig (Batch).', 'Quinoa: waschen, 12′ in der doppelten Menge Wasser, zugedeckt ruhen lassen.', 'Bowl bauen: Quinoa, Kichererbsen, Gemüse, Hummus und Zitrone.'],
      tips: 'Geröstete Kichererbsen halten 5 Tage im Glas: der Snack dieses Plans.' },
    { id: 'pasta-lentejas-tempeh', slot: 'co', tags: [], nombre: 'Linsennudeln mit Tempeh in Tomatensauce', tipo: 'Mittag · 20′', tiempo: '20′', cocina: 'Topf + Pfanne',
      macros: { kcal: 665, p: 46, g: 26, c: 67 },
      ing: [{ q: '80 g', i: 'Nudeln aus roten Linsen (glutenfrei)' }, { q: '120 g', i: 'Tempeh, gewürfelt' }, { q: '200 g', i: 'passierte Tomaten' }, { q: '80 g', i: 'Zwiebel und Knoblauch' }, { q: '10 g', i: 'natives Olivenöl extra' }, { q: 'nach Geschmack', i: 'Basilikum, Oregano, Salz' }],
      pasos: ['Linsennudeln 7-8′ (zerkochen schnell: vor der Packungszeit probieren).', 'Tempeh im Öl 4′ anbraten; Zwiebel und Knoblauch 3′ dazu.', 'Tomate, Oregano und Salz, 5′; mit Nudeln und Basilikum mischen.'],
      tips: 'Tempeh wird viel besser, wenn du ihn vor dem Anbraten 8′ dämpfst: die Bitterkeit verschwindet.' },
    { id: 'tortilla-garbanzo', slot: 'ce', tags: [], nombre: 'Kichererbsenmehl-Omelett mit Zucchini', tipo: 'Abend · 20′', tiempo: '20′', cocina: 'Pfanne',
      macros: { kcal: 460, p: 20, g: 16, c: 62 },
      ing: [{ q: '80 g', i: 'Kichererbsenmehl (glutenfrei)' }, { q: '200 g', i: 'Zucchini in dünnen Scheiben' }, { q: '80 g', i: 'Zwiebel' }, { q: '10 g', i: 'natives Olivenöl extra' }, { q: '100 g', i: 'grüner Salat' }, { q: 'nach Geschmack', i: 'Salz, Pfeffer, Kurkuma' }],
      pasos: ['Mehl mit 160 ml Wasser, Salz und Kurkuma verrühren; 10′ ruhen.', 'Zucchini und Zwiebel 8′ bei mittlerer Hitze weich dünsten.', 'Teig darübergießen, Deckel drauf, 5′ pro Seite. Salat dazu.'],
      tips: 'Das echte „Omelett ohne Ei“: stockt genauso und schmeckt kalt in der Lunchbox.' },
    { id: 'crema-calabaza-tofu', slot: 'ce', tags: [], nombre: 'Kürbissuppe mit Edamame und gebratenem Tofu', tipo: 'Abend · 25′', tiempo: '25′', cocina: 'Topf + Grillpfanne',
      macros: { kcal: 590, p: 41, g: 24, c: 38 },
      ing: [{ q: '300 g', i: 'Kürbis, gewürfelt' }, { q: '100 g', i: 'Edamame, gepult (TK)' }, { q: '150 g', i: 'fester Tofu in Scheiben' }, { q: '60 g', i: 'Zwiebel' }, { q: '10 g', i: 'natives Olivenöl extra' }, { q: '10 g', i: 'Kürbiskerne' }],
      pasos: ['Zwiebel und Kürbis in 5 g Öl 3′; knapp mit Wasser bedecken, 15′, pürieren.', 'Edamame 4′ in kochendem Wasser; abgießen und in die Suppe.', 'Tofu im restlichen Öl braten, 3′ pro Seite. Kerne obendrauf.'],
      tips: 'Ohne Sahne, ohne Kartoffel: pürierter Kürbis ist von allein cremig.' },
    { id: 'ensalada-quinoa-alubias', slot: 'ce', tags: [], nombre: 'Lauwarmer Salat mit Quinoa, schwarzen Bohnen und Avocado', tipo: 'Abend · 15′', tiempo: '15′', cocina: 'Topf + ohne Kochen',
      macros: { kcal: 610, p: 25, g: 21, c: 82 },
      ing: [{ q: '40 g', i: 'Quinoa, trocken' }, { q: '200 g', i: 'gekochte schwarze Bohnen' }, { q: '80 g', i: 'Avocado' }, { q: '120 g', i: 'Tomate, rote Zwiebel und Koriander' }, { q: '5 g', i: 'natives Olivenöl extra' }, { q: 'nach Geschmack', i: 'Limette, Kreuzkümmel, Salz' }],
      pasos: ['Quinoa 12′ in der doppelten Menge Wasser; abgießen.', 'Bohnen abgießen, abspülen, in die noch warme Quinoa.', 'Avocado, Tomate, Zwiebel und Koriander; mit Limette, Kreuzkümmel und Öl anmachen.'],
      tips: 'Nimmt man problemlos mit ins Büro: Avocado erst im letzten Moment schneiden.' },
    { id: 'bolonesa-soja', slot: 'ce', tags: [], nombre: 'Bolognese aus Sojagranulat mit Zucchini-Spaghetti', tipo: 'Abend · 20′', tiempo: '20′', cocina: 'Pfanne',
      macros: { kcal: 445, p: 37, g: 13, c: 47 },
      ing: [{ q: '60 g', i: 'feines Sojagranulat (trocken)' }, { q: '250 g', i: 'passierte Tomaten' }, { q: '300 g', i: 'Zucchini in Spiralen oder Streifen' }, { q: '100 g', i: 'Zwiebel, Karotte und Knoblauch' }, { q: '10 g', i: 'natives Olivenöl extra' }, { q: 'nach Geschmack', i: 'Oregano, Paprikapulver, Salz' }],
      pasos: ['Soja 10′ in heißem Wasser mit einer Prise Salz einweichen; gut abtropfen.', 'Soffritto 5′; abgetropftes Soja 3′ bei starker Hitze; Tomate und Oregano, 8′.', 'Zucchini 2′ in separater Pfanne (damit sie kein Wasser zieht). Bolognese obendrauf.'],
      tips: 'Sojagranulat hat 50 g Protein pro 100 g trocken: das günstigste „Hackfleisch“, das es gibt.' }
  ];

  /* ---------- EINKAUFSLISTE (Standardwoche) ---------- */
  const COMPRA = [
    { cat: 'Protein', items: [
      { q: '1,4 kg', i: 'Hähnchenbrust' },
      { q: '400 g', i: 'mageres Rindfleisch in Streifen' },
      { q: '500 g', i: 'Seehecht oder Wolfsbarsch (2 Portionen)' },
      { q: '350 g', i: 'Lachs (2 Filets)' },
      { q: '300 g', i: 'geschälte TK-Garnelen' },
      { q: '4 Dosen', i: 'Thunfisch im eigenen Saft' },
      { q: '18 Stück', i: 'Eier (M) (anderthalb Dutzend)' },
      { q: '14 Stück (je 250 g)', i: 'Skyr oder Magerquark (7 Frühstücke/Nachtische + 7 Abendportionen)' },
      { q: '1 Dose (reicht ~1 Monat)', i: 'Whey (1 Messlöffel täglich in der Abendportion)' }
    ]},
    { cat: 'Kohlenhydrate', items: [
      { q: '500 g', i: 'Reis' },
      { q: '2 kg', i: 'Kartoffeln' },
      { q: '400 g', i: 'Vollkornbrot (großer Laib oder Kastenbrot)' },
      { q: '500 g', i: 'Haferflocken' },
      { q: '2 Dosen (je 400 g abgetropft)', i: 'gekochte Linsen' }
    ]},
    { cat: 'Gemüse und Obst', items: [
      { q: '5 Stück', i: 'Paprika' },
      { q: '4 Stück', i: 'Zwiebeln (+1 rote)' },
      { q: '2 Stück', i: 'Zucchini' },
      { q: '2 Stück', i: 'Brokkoli' },
      { q: '8 Stück', i: 'Tomaten (2 zum Reiben)' },
      { q: '2 Beutel', i: 'Kopfsalat oder Feldsalat' },
      { q: '500 g', i: 'Karotten' },
      { q: '12-14 Stück', i: 'Obst: Bananen ×5, Äpfel ×4-5, Orangen ×4' }
    ]},
    { cat: 'Vorrat', items: [
      { q: '—', i: 'natives Olivenöl extra' },
      { q: '200 g', i: 'Walnüsse' },
      { q: '1 Glas', i: 'Oliven' },
      { q: '1 Flasche', i: 'Sojasauce' },
      { q: '3 Stück', i: 'Zitronen' },
      { q: '—', i: 'Gewürze: Paprikapulver, Knoblauchpulver, Kreuzkümmel, Oregano, Zimt' },
      { q: '—', i: 'Salz, Essig, Brühe' }
    ]}
  ];

  /* ---------- MEAL PREP AM SONNTAG (~90′) ---------- */
  const MEALPREP = [
    { min: '0′',  paso: 'Ofen auf 200°. 1,2 kg Hähnchenbrust salzen, pfeffern und mit Paprika- + Knoblauchpulver einreiben.' },
    { min: '5′',  paso: 'In den Ofen: Blech 1 (Brüste, 25-30′) und Blech 2 (1,5 kg Kartoffelspalten + 2 Paprika + 2 Zwiebeln + 20 g Olivenöl, 40-45′).' },
    { min: '10′', paso: 'Topf auf mittlerer Hitze: Zwiebel, Paprika und Karotte mit 10 g Olivenöl anschwitzen.' },
    { min: '15′', paso: 'Topf 1: 400 g Reis aufsetzen (12-15′). Topf 2: 6 Eier (10′) + 2 mittlere Kartoffeln (lass sie 20′): Eier und Kartoffeln für den Thunfischsalat.' },
    { min: '20′', paso: 'In den Topf: 2 Dosen abgetropfte Linsen + 400 ml Brühe + Paprikapulver und Kreuzkümmel. Niedrige Hitze, 20′.' },
    { min: '30′', paso: 'Brüste raus. 250 g in Streifen schneiden für die Linsen (kommen beim Ausschalten dazu). Reis abgießen und auf einem Blech ausbreiten, damit er schnell abkühlt.' },
    { min: '45′', paso: 'Kartoffeln aus dem Ofen. Wenden, probieren, nachsalzen, falls nötig.' },
    { min: '60′', paso: 'Portionieren: 5 Mittagsboxen (2 Hähnchen+Kartoffeln, 2-3 Linsen, Reis in eigener Box für Pfanne/Lachs) + hartgekochte Eier und gekochte Kartoffeln in den Kühlschrank.' },
    { min: '75′', paso: 'Beschriften und verstauen: Kühlschrank bis Mittwoch, Gefrierschrank für Donnerstag-Freitag (am Vorabend in den Kühlschrank legen). Küche aufgeräumt, während nebenbei irgendwas läuft.' }
  ];
  const MEALPREP_NOTA = 'Der Fisch für die Abendessen wird in 10 Minuten frisch gemacht: Er wird nicht am Sonntag vorbereitet. Hähnchen und Reis halten gekühlt 4 Tage.';

  /* ---------- WOCHENMENÜ ---------- */
  const MENU = [
    { d: 'Mo', de: 'bol-skyr', co: 'pollo-asado', ce: 'merluza-patata' },
    { d: 'Di', de: 'tortilla-pan', co: 'lentejas-pollo', ce: 'ensalada-atun' },
    { d: 'Mi', de: 'bol-skyr', co: 'salteado-ternera', ce: 'revuelto-gambas' },
    { d: 'Do', de: 'tortilla-pan', co: 'pollo-asado', ce: 'salmon-arroz' },
    { d: 'Fr', de: 'bol-skyr', co: 'lentejas-pollo', ce: 'merluza-patata' },
    { d: 'Sa', de: 'tortilla-pan', co: 'LIBRE', ce: 'ensalada-atun' },
    { d: 'So', de: 'bol-skyr', co: 'salteado-ternera', ce: 'revuelto-gambas' }
  ];

  /* ---------- TRACKING ---------- */
  const CHECKPOINTS = [
    { sem: 4,  fecha: '2026-09-13', rango: [92.5, 93.5], si: 'Prüf Olivenöl und freie Mahlzeit; +1.000 Schritte/Tag. Denk dran: Kreatin versteckt ~1 kg.' },
    { sem: 8,  fecha: '2026-10-11', rango: [90.0, 91.3], si: '−100 kcal Kohlenhydrate nur an Ruhetagen (Woche 7 war Diet Break: Der Schnitt kann hoch reinkommen, und das ist normal)' },
    { sem: 12, fecha: '2026-11-08', rango: [86.0, 88.0], si: 'Abschluss, Fotos, Maße und nächster Block. In echtem Fett: ~−8 kg.' }
  ];
  const AJUSTES = [
    { id: 'rapido', cond: 'Du verlierst zwei Wochen in Folge mehr als 1,0 kg/Woche (Kreatin-Effekt rausgerechnet)', accion: 'Füg 150 kcal Kohlenhydrate hinzu. Schneller ist nicht besser: In dem Tempo frisst das Defizit den Muskel-Wiederaufbau.' },
    { id: 'lento', cond: 'Du verlierst zwei Wochen in Folge weniger als 0,45 kg/Woche (Diet-Break-Woche nicht mitgezählt)', accion: 'Prüf zuerst Schritte und Olivenöl; ist da alles sauber, +1.500 Schritte, BEVOR du kcal kürzt (schützt das Training).' },
    { id: 'rendimiento', cond: 'Die Leistung im Gym fällt zwei Sessions in Folge', accion: 'Schau auf den Schlaf, bevor du auf die Ernährung schaust.' }
  ];
  const FOTOS = ['2026-08-17', '2026-09-13', '2026-10-11', '2026-11-08'];

  /* ---------- ERFOLGE ---------- */
  // tipo: sesion | racha | peso | cintura | disco | pr | especial
  const LOGROS = [
    { id: 'primera',        icon: '⚡', nombre: 'Tag eins',           desc: 'Erste Session abgeschlossen. Das Schwerste ist schon getan.' },
    { id: 'sesiones-10',    icon: '🔟', nombre: 'Zehn von zehn',      desc: '10 Kraftsessions abgeschlossen.' },
    { id: 'sesiones-25',    icon: '🎯', nombre: 'Fünfundzwanzig',     desc: '25 Kraftsessions. Das ist schon eine Gewohnheit.' },
    { id: 'sesiones-50',    icon: '🏛️', nombre: 'Fünfzig',            desc: '50 Sessions. Territorium eines anderen Menschen.' },
    { id: 'semana-perfecta',icon: '💎', nombre: 'Perfekte Woche',     desc: 'Alle Kraftsessions einer Woche.' },
    { id: 'minimo-3',       icon: '🛡️', nombre: 'Der Boden hält',     desc: '3 Wochen in Folge mindestens das Minimum erfüllt (2 Kraft + 1 Cardio).' },
    { id: 'racha-7',        icon: '🔥', nombre: 'Serie 7',            desc: '7 Tage in Folge den Tag erfüllt.' },
    { id: 'racha-14',       icon: '🔥', nombre: 'Serie 14',           desc: '14 Tage in Folge. Das On/Off-Muster ist tot.' },
    { id: 'racha-30',       icon: '🌋', nombre: 'Serie 30',           desc: '30 Tage in Folge. Nicht zu stoppen.' },
    { id: 'pasos-7',        icon: '👟', nombre: 'Schritte-Woche',     desc: '7 Tage in Folge die Schritte erreicht.' },
    { id: 'disco-10',       icon: 'disc10', nombre: '10er-Scheibe',   desc: 'Phase 1 abgeschlossen. Die Gewohnheit ist zurück.', disco: true },
    { id: 'disco-15',       icon: 'disc15', nombre: '15er-Scheibe',   desc: 'Phase 2 abgeschlossen. Du bist im Gym angekommen.', disco: true },
    { id: 'disco-20',       icon: 'disc20', nombre: '20er-Scheibe',   desc: 'Phase 3 abgeschlossen. Die echte Last gehört dir.', disco: true },
    { id: 'disco-25',       icon: 'disc25', nombre: '25er-Scheibe',   desc: 'Phase 4 abgeschlossen. Sammlung komplett.', disco: true },
    { id: 'kg-2',           icon: '📉', nombre: '−2 kg',              desc: 'Wochenschnitt 2 kg unter dem Startgewicht.' },
    { id: 'kg-4',           icon: '📉', nombre: '−4 kg',              desc: '4 kg weniger im Wochenschnitt.' },
    { id: 'kg-6',           icon: '📉', nombre: '−6 kg',              desc: '6 kg weniger. Hälfte des langen Weges.' },
    { id: 'kg-8',           icon: '📉', nombre: '−8 kg',              desc: '8 kg weniger im Wochenschnitt.' },
    { id: 'kg-10',          icon: '🏔️', nombre: '−10 kg',             desc: 'Zweistellig. Nur wenige kommen hierher.' },
    { id: 'cintura-95',     icon: '📏', nombre: 'Taille −95',         desc: 'Taille unter 95 cm.' },
    { id: 'cintura-93',     icon: '📏', nombre: 'Taille −93',         desc: 'Taille unter 93 cm.' },
    { id: 'cintura-91',     icon: '👑', nombre: 'Königsmetrik',       desc: 'Taille unter 91 cm: weniger als die Hälfte deiner Körpergröße.' },
    { id: 'pr-1',           icon: '🥇', nombre: 'Erster PR',          desc: 'Zum ersten Mal deine Bestmarke in einer Übung überboten.' },
    { id: 'pr-5',           icon: '🥇', nombre: '5 PRs',              desc: 'Fünf persönliche Bestmarken geknackt.' },
    { id: 'pr-15',          icon: '🏆', nombre: '15 PRs',             desc: 'Fünfzehn PRs. Das Muskelgedächtnis zahlt Dividende.' },
    { id: 'marca-banca',    icon: '🔓', nombre: 'Bank zurückgeholt',  desc: 'Du bewegst wieder deine 95 kg beim Bankdrücken. Fünf Jahre danach.' },
    { id: 'marca-sentadilla', icon: '🔓', nombre: 'Kniebeuge zurückgeholt', desc: 'Du bewegst wieder deine 100 kg in der Kniebeuge.' },
    { id: 'dominada-libre', icon: '🦍', nombre: 'Freier Klimmzug',    desc: 'Erster Klimmzug ohne Hilfe. Zurück im Club.' },
    { id: 'mealprep-4',     icon: '🍱', nombre: 'Sonntagskoch',       desc: '4 Sonntage Meal Prep in Folge.' },
    { id: 'comeback',       icon: '🔁', nombre: 'Das Comeback',       desc: 'Zurück nach 4 oder mehr Tagen Pause. Zurückkommen zählt mehr als Fallen.' },
    { id: 'fotos-4',        icon: '📸', nombre: 'Die Sequenz',        desc: 'Alle 4 Fortschrittsfotos gemacht.' },
    { id: 'checkpoint-s4',  icon: '✅', nombre: 'Checkpoint W4',      desc: 'Gewicht im Korridor oder besser in Woche 4.' },
    { id: 'checkpoint-s8',  icon: '✅', nombre: 'Checkpoint W8',      desc: 'Gewicht im Korridor oder besser in Woche 8.' },
    { id: 'plan-completo',  icon: '🏁', nombre: 'BACK2PRIME',         desc: '12-Wochen-Plan beendet. 85 kg war die Konsequenz, nicht das Ziel.' }
  ];

  /* ---------- DIE WISSENSCHAFT HINTER DEM PLAN (Evidenz-Review · Aug 2026) ---------- */
  const CIENCIA = {
    intro: 'Plan gegen die Evidenz geprüft (Metaanalysen und Studien 2010-2025, August 2026). Die Idee, die alles ordnet: Wer zurückkommt, ist kein Anfänger — Muskel und Nervensystem kehren schnell zurück, aber die Sehne hat kein Gedächtnis. Der Muskel kann rennen; die Sehne gibt das Tempo vor.',
    temas: [
      { t: 'Muskelgedächtnis', d: 'Der Wiederaufbau ist real und schnell: Kraft in ~8 Wochen, Größe in ~12. Der Mechanismus (Myonuklei vs. Epigenetik) wird noch debattiert, der Effekt nicht. Darum darf die doppelte Progression schneller laufen als bei einem Anfänger — und genau darum wird der Kalender NICHT gestaucht: Wer nicht rennt, ist die Sehne.', ref: 'Rahmati 2022 (Metaanalyse, J Cachexia Sarcopenia Muscle) · Cumming 2024 (J Physiol)' },
      { t: 'Sehne: der limitierende Faktor', d: 'Das Sehnenkollagen erneuert sich ~10× langsamer als der Muskel. Was es wirklich anpasst: hohe Lasten mit langsamen ~3″-Kontraktionen (HSR) und Isometrie bei 70% (5×45″), die obendrein sofort Schmerz nimmt. Plyometrie ist ein schlechter Sehnenreiz: keine Sprünge, um das Joggen „vorzubereiten".', ref: 'Mersmann 2017 (Front Physiol) · Rio 2015 (BJSM) · Kongsgaard (HSR)' },
      { t: 'Laufen mit Übergewicht', d: 'Mit Übergewicht mehr als 3 km/Woche Joggen zu starten, lässt die Verletzungen hochschnellen (~31-48% mehr). Die Kadenz auf 170-180 zu heben senkt den Aufprall im Schienbein um ~11%. Die sichere Progression ist nicht die „10%-Regel": Es ist, ~1,3× deines Schnitts der letzten 4 Wochen nicht zu überschreiten.', ref: 'Bertelsen 2018 (RCT mit übergewichtigen Laufanfängern) · Kadenz-Review 2025 · IOC-Konsens zur Belastungssteuerung' },
      { t: 'Optimales Defizit', d: 'Ein Defizit über ~500-600 kcal löscht den Muskelzuwachs aus, auch wenn du Kraft trainierst. Das optimale Tempo, um Magermasse zu halten, ist ~0,7% des Gewichts/Woche. Darum verliert der Plan 0,6-0,75 kg/Woche und nicht 0,9.', ref: 'Murphy & Koehler 2022 (Metaanalyse, 59 Studien) · Garthe 2011' },
      { t: 'Protein', d: 'Im Defizit brauchen Trainierte 2,3-3,1 g/kg Magermasse. {p} g setzen dich bequem in den Bereich, und die Aufteilung auf 4 Portionen ≥40 g presst das Maximum aus der Proteinsynthese und kontrolliert den Hunger.', ref: 'Helms 2014 (systematisches Review) · Schoenfeld & Aragon (Verteilung pro Portion)' },
      { t: 'Diet Break', d: 'Defizit im Wechsel mit Erhaltungspausen dämpfte in der MATADOR-Studie den Stoffwechselabfall und verbesserte den Fettverlust. In 12 Wochen liegt sein Hauptwert für dein On/Off-Profil woanders: Er lehrt dich, dass EINE Woche Pause mit Plan kein Rückfall ist.', ref: 'Byrne 2018 (Int J Obesity, MATADOR)' },
      { t: 'Das richtige Volumen', d: 'Mehr Sätze = mehr Muskel, aber mit abnehmendem Ertrag, und im Defizit bringt der Überschuss nur Ermüdung und Risiko. Ziel: ~10 Sätze/Muskel/Woche in P2 und 12-18 in P3-P4. Und das unantastbare Minimum (2 Kraft + 1 Cardio) hat Rückendeckung: Damit ERHÄLTST du wirklich Muskel.', ref: 'Pelland 2025 (Sports Medicine) · Androulakis-Korakakis 2020 (Minimaldosis)' },
      { t: 'Deload, richtig gemacht', d: 'Eine Woche komplett zu pausieren kostet Kraft; was funktioniert: das Volumen halbieren und das Gewicht auf der Stange halten. Darum ist Woche 9 ein PFLICHT-Deload genau dieser Art, und Woche 10 (Sprung auf 5 Tage) startet überall mit einem Satz weniger.', ref: 'Coleman 2024 (PeerJ, Deload-RCT)' },
      { t: 'Schlaf', d: '5,5 h Schlaf im Defizit (vs. 8,5) reduzierte das verlorene Fett um 55% und vervielfachte den Muskelverlust. Nach Protein und Defizit ist er dein größter Hebel. Daher der Koffein-Schnitt um 13-14 Uhr: 200 mg stören den Schlaf bis zu 13 h danach.', ref: 'Nedeltcheva 2010 (Ann Intern Med) · Gardiner 2023 (Sleep Med Rev)' },
      { t: 'Gesundheit zuerst', d: 'Nach 5 Jahren sitzend mit BMI 28, vor der intensiven Arbeit von P3-P4: Blutdruck und kleines Blutbild (Blutfette, Glukose/HbA1c). Bei Symptomen jeder Art: zum Arzt, bevor es weitergeht.', ref: 'ACSM Preparticipation Health Screening' }
    ]
  };

  const CIERRE = 'Das wahre Ziel des Plans ist nicht der 8. November: Es ist, im Dezember aus Gewohnheit 4 Tage zu trainieren, ohne On/Off-Zyklus. Das Gewicht ist die Konsequenz, nicht das Ziel.';

  const AVISO_LEGAL = 'Dein Plan wird aus deinen Antworten mit Standardformeln erzeugt (Mifflin-St Jeor und klassische Aktivitätsfaktoren), mit ±10% Marge, die die Anpassungsregeln mit deinen echten Daten korrigieren. Nichts davon ersetzt ärztlichen Rat: bei Erkrankungen, anhaltenden Schmerzen oder Zweifeln geh zu medizinischem Fachpersonal.';

  /* ---------- INTERFACE-TEXTE (übersetzbar wie der Rest) ----------
     Templates mit {x}: app.js füllt sie über tpl(). Beim Sprachwechsel
     wird assets/data.<lang>.js geladen, das GANZ window.B2P ersetzt.   */
  const UI = {
    lang: 'de',
    tabs: ['Heute', 'Plan', 'Essen', 'Fortschritt', 'Erfolge'],
    dias: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
    meses: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    hoyTag: 'HEUTE',
    semanaLinea: 'Woche {w} von 12 · Phase {f} · {n} · RPE-Deckel {r}',
    empiezaEnDias: 'Start in {n} Tagen', empiezaEn1: 'Start in 1 Tag', empiezaLunes: 'Start am Montag',
    preplanSub: '{f} · Phase 1 zu Hause. Bis dahin: halte die Basiswerte fest:',
    prepCintura: 'Miss deine Taille nüchtern (auf Bauchnabelhöhe)',
    prepFotos: 'Fotos Tag 0: frontal und Profil, dasselbe Licht wie künftig immer',
    prepCompra: 'Einkauf für Woche 1 (Liste unter Essen)',
    prepBascula: 'Leg fest, wo und wann du dich wiegst: Montag-Mittwoch-Freitag nüchtern',
    practicaMenu: 'Du kannst das Menü ab heute üben: am {f} wird es ernst.',
    descanso: 'Ruhetag', domingoPrep: 'Sonntag: Ruhe + Meal Prep', planCompletado: 'Plan abgeschlossen',
    calentamiento: '🔥 Aufwärmen · 6′',
    sesionSub: '{d} · Pausen in jeder Zeile (antippen für den Timer)',
    tendonNombre: 'Sehnen-Protokoll',
    cardioHecho: '✓ Cardio erledigt', cardioMarcar: 'Cardio als erledigt markieren', minutosReales: 'Echte Minuten:',
    cadenciaSub: 'Kadenz 170-180 · kurzer Schritt', recuperacionSub: 'Aktive Erholung', opcional: 'optional',
    tibialisAviso: '🛡 Davor: Tibialis Raises 2×20 (Sehnen-Protokoll).',
    diaADia: 'Tag für Tag',
    hPasos: '8-10k Schritte', hPasosSub: 'Jeden Tag',
    hProte: 'Protein 4/4', hProteSub: '4 Portionen ≥40 g',
    hPeso: 'Gewicht nüchtern', hPesoSub: 'Wochenschnitt, nicht der einzelne Tag',
    hCintura: 'Taille (montags)', hCinturaSub: 'Die Königsmetrik · am Bauchnabel, ohne zu schnüren',
    hPrep: 'Meal Prep', hPrepSub: '~90′ und die Woche steht',
    hFoto: 'Fortschrittsfotos', hFotoSub: 'Frontal und Profil, gleiches Licht',
    pesoGuardado: 'Gewicht gespeichert: {v} kg', cinturaGuardada: 'Taille: {v} cm',
    marcarHecho: 'Als erledigt markieren', usarPeso: 'Dieses Gewicht übernehmen',
    diaAnterior: 'Vorheriger Tag', diaSiguiente: 'Nächster Tag',
    cerrarPanel: 'Schließen', panelSinTitulo: 'Details',
    ajIdiomaSinRed: 'Offline: Diese Sprache konnte nicht geladen werden.',
    versionNueva: 'Neue Version · zum Aktualisieren tippen',
    quizTitulo: 'Deine Vorlieben', quizPista: 'Wischen: rechts mag ich, links nicht',
    quizSi: 'Mag ich', quizNo: 'Nicht meins', quizDeshacer: 'Rückgängig', quizSaltar: 'Überspringen',
    quizListo: 'Fertig', quizResumen: 'Dir gefallen {a} von {b}. Das schärft deinen Plan.',
    gen: { durAprox: '≈{m}′', splitFbC: 'Ganzkörper', splitTpC: 'Ober · Unter', splitPplC: 'Push · Pull · Legs', faseSub: '{s} ×{d}', nf1: 'F1–F2 (Wo 1-{a})', nf2: 'F3 (Wo {b}-{c})', nf3: 'F4 (Wo {d}-{e})', dietBreakNota: 'Woche {w}: DIET BREAK bei ~{k}', hitoCribadoT: 'Gesundheitscheck', hitoCribadoD: 'Vor der Belastungsphase, wenn du jahrelang ohne intensive Aktivität warst: Blutdruck in der Apotheke und ein Basispanel (Lipide, Glukose). 15 Minuten, die Ruhe kaufen.', hitoDietT: 'DIET BREAK', hitoDietD: 'Die ganze Woche isst du auf Erhaltungsniveau (~{k} kcal: +2 Portionen Kohlenhydrate am Tag, Protein unverändert). Das Training bleibt gleich. Stellt NEAT und Leptin wieder her und bricht den On/Off-Zyklus. Am Montag danach wieder Defizit.', hitoDescargaT: 'DELOAD (nicht optional)', hitoDescargaD: 'Gleiche Routine mit der Hälfte der Sätze und demselben Gewicht. Kein Stopp: Gewebe-Erhalt und Urlaub für Sehnen und Gelenke.', tomaNocheAlt: '+ jeden Abend: Portion vor dem Schlafen mit deinem Pflanzenprotein (Soja oder Erbse), ~40 g im Shake. ', franjaM: 'Du trainierst morgens: Frühstück nach dem Training, nicht davor.', franjaMd: 'Du trainierst mittags: die Hauptmahlzeit fällt direkt nach das Training.', franjaT: 'Du trainierst abends: vorher etwas Leichtes; das Abendessen ist deine Post-Workout-Mahlzeit.', cardioLibreT: 'Cardio: {d}', cardioLibreD: '{m}′ in bequemem, konstantem Tempo. Dein Sport zählt wie Joggen: Konstanz regiert.', chk1: 'Außerhalb des Korridors: erst Portionen und Schritte prüfen, bevor du etwas änderst. In den ersten Wochen bewegt sich auch Wasser.', chk2: 'Zwei Wochen daneben: 150 kcal Kohlenhydrate in die passende Richtung anpassen. Protein bleibt.', chk3: 'Abschluss: Fotos, Maße und der nächste Block, mit Daten entschieden.', lKgN: '−{v} kg', lKgD: 'Wochenschnitt {v} kg unter dem Start.', lKgUpN: '+{v} kg', lKgUpD: 'Wochenschnitt {v} kg über dem Start. Muskel, Stein auf Stein.', lCintN: 'Taille −{v}', lCintD: 'Taille unter {v} cm.', lReinaN: 'Königsmetrik', lReinaD: 'Taille unter der Hälfte deiner Größe: {v} cm.', lFinDesc: '{s}-Wochen-Plan beendet. Das Ziel war die Gewohnheit; der Rest ist Folge.', marca: 'Plan, für dich erzeugt', cuida: 'schone: {a}', datos: '{p} kg · {a} cm · {e} J.', menuAviso: '{n} Gerichte passen noch nicht zu deiner Ernährung: ein größeres Rezeptbuch kommt.', prepNota: 'Nur Rezepte mit „Batch“ werden sonntags vorgekocht; der Rest frisch. Die Einkaufsmengen rechnen die Wiederholungen der Woche schon mit.' },
    pBarraT: 'Die Hantel des Plans', pBarraSub: '{a} von {b} Scheiben aufgelegt',
    patrones: { eh: 'Horizontales Drücken', ev: 'Vertikales Drücken', th: 'Horizontales Ziehen', tv: 'Vertikales Ziehen', rod: 'Kniedominant', bis: 'Hüftbeuge', zan: 'Ausfallschritt', core: 'Stabiler Core', flex: 'Rumpfbeugung', curl: 'Ellbogenbeugung', ext: 'Ellbogenstreckung', gem: 'Wade', ais: 'Isolation' },
    quizCatEj: 'Übung', quizCatDep: 'Sportart', quizCatCom: 'Gericht',
    alta: { t: 'Leg dein Profil an', sub: 'Kraft, Essen und Fortschritt. Ein Plan nach Maß, in zwei Minuten.', nombreL: 'Dein Name', ph: 'Wie sollen wir dich nennen?', cta: 'Los geht’s', local: 'Deine Daten leben nur auf diesem Gerät. Kein Konto, keine Cloud.', valNombre: 'Gib einen Namen mit 2 bis 24 Zeichen ein.', idioma: 'Sprache' },
    rev: { minT: '{v} Minuten pro Einheit', minSub: 'Einheiten aufs Wesentliche gekürzt: die Grundübungen bleiben', evT: 'Ziel: {e}', evSub: 'das Datum regiert: Konstanz vor Perfektion', durOpen: 'Ohne Datum: {s}-Wochen-Blöcke, verlängerbar', t: '{n}, dein Plan steht', tAnon: 'Dein Plan steht', sub: 'Entschieden aus deinen Antworten. Das ist keine Vorlage.',
      splitT: 'Kraft an {d} Tagen pro Woche', splitFb: 'Ganzkörper: bringt bei wenigen Tagen am meisten', splitTp: 'Oberkörper / Beine, im Wechsel', splitPpl: 'Drücken / Ziehen / Beine',
      kcalT: '{k} kcal am Tag', kDef: '{v} kcal Defizit: Fett verlieren, ohne Muskel herzugeben', kSup: '{v} kcal Überschuss für Muskelaufbau', kMan: 'auf Erhaltungsniveau, Protein führt',
      protT: '{p} g Protein am Tag', protSub: '{v} g pro Kilo Körpergewicht',
      durT: '{s} Wochen vor dir', durSub: 'vom {a} bis {b}',
      subsT: '{n} Übungen ersetzt', subsSub: 'wegen deiner Ausstattung oder deiner Absagen',
      cuidaT: 'Extra Vorsicht: {a}', cuidaSub: 'die betroffenen Übungen tragen einen Hinweis',
      menuT: 'Menü an deinen Tisch angepasst', menuSub: 'Ernährung und Unverträglichkeiten auf die ganze Woche angewandt', menuAv: '{n} Gerichte passen noch nicht: wird unter Essen angezeigt',
      gustosT: '{a} Likes · {b} Absagen', gustosSub: 'was du abgesagt hast, taucht im Plan nicht auf',
      cta: 'Meine Woche 1 sehen', micro: 'Mach den Fragebogen jederzeit neu: alles wird neu berechnet.' },
    tour: { salta: 'Überspringen', sigue: 'Weiter', listo: 'Ans Training', pasos: [
      ['Das ist HEUTE', 'Dein Tag, fertig aufgebaut: Einheit, Mahlzeiten, Protokoll. Hak ✓ ab, die App zählt mit.'],
      ['Die Leiste bewegt dich', 'Heute, Plan, Essen, Fortschritt und Erfolge. Tippe, oder zieh die Blase.'],
      ['Der ganze Plan', 'Phasen, Kalender, Regeln und die Übungsbibliothek mit Technik im Video.'],
      ['Dein Tisch', 'Wochenmenü, Rezepte mit Foto, Einkauf und Meal Prep, schon für dich gefiltert.'],
      ['Ehrlicher Fortschritt', 'Gewicht, Taille, Lasten und Konstanz. Zu schnell? Die App bremst dich.'] ] },
    cuest: {
      gateT: 'Deine Gesundheit entscheidet', gateTxt: 'Du hast eine medizinische Einschränkung angegeben. Bevor irgendetwas erzeugt wird: Zeig deinem Arzt, was du vorhast (Kraft an {d} Tagen pro Woche), und hol dir das Okay.',
      gateGuardado: 'Deine Antworten bleiben gespeichert, bis du zurückkommst.', gateOk: 'Ich habe das Okay', gateSalir: 'Erstmal raus',
      gateHoyT: 'Pausiert, mit Grund', gateHoyTxt: 'Der Fragebogen ist halb fertig: das Okay deines Arztes fehlt. Mit ihm entsteht dein Plan sofort.', gateVolver: 'Fragebogen fortsetzen',
      resCta: 'Meinen Plan erzeugen', resGen: 'Dein Plan wird erzeugt…',
      titulo: 'Dein Plan, nach Maß', atras: 'Zurück', sigue: 'Weiter',
      sexoT: 'Dein Körper', sexoP: 'Dient nur der Kalorienberechnung.', sexoH: 'Mann', sexoM: 'Frau', sexoX: 'Sage ich nicht',
      medidasT: 'Deine Werte', edadL: 'Alter', alturaL: 'Größe (cm)', pesoL: 'Gewicht (kg)', cinturaL: 'Taille (cm) · optional',
      objT: 'Was willst du?', objPerder: 'Fett verlieren', objRecomp: 'Rekomposition: weniger Fett, mehr Muskeln', objGanar: 'Muskeln aufbauen', objMantener: 'Halten',
      evT: 'Wofür?', evBoda: 'Eine Hochzeit', evOpo: 'Eine Prüfung', evVerano: 'Sommerfigur', evSiempre: 'Für immer',
      durT: 'Wie viel Zeit gibst du dir?', dur3: '3 Monate', dur6: '6 Monate', dur12: '12 Monate', durAlways: 'Ohne Datum: Gewohnheit',
      histT: 'Wo kommst du her?', histP: 'Der Wiedereinstieg wird anders geplant: die Sehne gibt das Tempo vor.', histNunca: 'Nie trainiert', histRetoma: 'Comeback nach Jahren Pause', histActivo: 'Trainiere gerade',
      diasL: 'Tage pro Woche', minL: 'Minuten pro Einheit', franjaT: 'Wann passt es dir?', franjaM: 'Morgens', franjaMd: 'Mittags', franjaT2: 'Abends',
      matT: 'Welche Ausrüstung?', matNada: 'Keine', matCasa: 'Zuhause: Hanteln und Bänder', matGym: 'Komplettes Gym',
      lesT: 'Beschwerden oder Verletzungen?', lesRodilla: 'Knie', lesHombro: 'Schulter', lesLumbar: 'Unterer Rücken', lesNo: 'Keine',
      medT: 'Eine medizinische Einschränkung fürs Training?', si: 'Ja', no: 'Nein',
      dietaT: 'Dein Tisch', dietaNormal: 'Ich esse alles', dietaVegetariano: 'Vegetarisch', dietaVegano: 'Vegan',
      sinT: 'Meidest du etwas?', sinGluten: 'Gluten', sinLactosa: 'Laktose', sinFrutos: 'Nüsse', sinNada: 'Nichts',
      resT: 'Dein Profil steht', resP: 'Daraus wird dein Plan erzeugt: Training, Mahlzeiten und Progression.',
      resGustos: '{a} mag ich · {b} verworfen', resProfesional: 'Bevor ein Plan erzeugt wird, sprich mit medizinischem Fachpersonal: eine deiner Antworten verlangt es.',
      resGuardar: 'Profil speichern', resGuardado: 'Profil gespeichert', resProx: 'Die Plan-Erzeugung kommt in der nächsten Phase.',
      valNum: 'Prüfe {c}: zwischen {a} und {b}.'
    },
    gPeso: 'Diagramm Körpergewicht', gCintura: 'Diagramm Taillenumfang',
    gCargas: 'Diagramm Gewichte', gAdherencia: 'Diagramm wöchentliche Adhärenz',
    gRango: '{n} Einträge, von {a} bis {b} {u}', gUnico: '1 Eintrag, {a} {u}',
    gSemanas: '{n} von 12 Wochen mit Daten',
    gSinDatos: 'noch keine Daten',
    fSinRegistro: 'Hier hast du noch kein Gewicht eingetragen. Sobald du das tust, siehst du den Abstand.',
    valFuera: 'Gib einen Wert zwischen {a} und {b} {u} ein.', descargaDosis: 'Deload',
    hechosDe: '{a} von {b} erledigt · ab {c} zählt es als Einheit',
    cerrarSinSesion: 'Ohne Einheit abschließen', diaCerradoSinRacha: '✓ Tag abgeschlossen',
    sinRachaHoy: 'Heute zählt nicht für die Serie.', mejorRachaNota: 'Dein Bestwert: {n} Tage.',
    sinSesionToast: 'Tag ohne Einheit abgeschlossen: zählt heute nicht.',
    reabrirDia: 'Tag wieder öffnen', diaReabierto: 'Tag wieder geöffnet', mejorLbl: 'Best',
    cerrarDia: 'Tag abschließen', diaCerradoBtn: '✓ Tag abgeschlossen · Serie {n}',
    diaCerradoToast: '✓ Tag abgeschlossen. Serie: {n}', diaCerradoSolo: 'Tag abgeschlossen.',
    sigueEditando: 'Du kannst weiter bearbeiten: Alles speichert sich von selbst.',
    comidaHoy: 'Das Essen von heute', comidaHoySub: '{kcal} kcal · {p} g Protein in 4 Portionen',
    desayuno: 'Frühstück', comidaLbl: 'Mittagessen', cena: 'Abendessen', presueno: 'Pre-Sleep',
    comidaLibreMn: 'FREIE MAHLZEIT', comidaLibreTitulo: 'Freie Mahlzeit', comidaLibreTag: 'eine Mahlzeit, kein Tag', tuya: 'deine',
    dietBreakChip: 'Diet Break: heute +2 Portionen Kohlenhydrate. Protein gleich.',
    extraChip: '➕ Extra P{f}: ein Stück Obst + 40 g Brot zum Mittagessen.',
    sugEmpieza: '◆ Start bei {v}', sugRepite: '↻ wiederhol {v}',
    faltaTitle: 'Tipp hier, wenn du NICHT alle Wdh geschafft hast',
    repsAMediasToast: 'Vermerkt: Wdh gefehlt (du wiederholst das Gewicht)', repsLimpiasToast: 'Alle Wdh sauber',
    repsAMediasTag: 'Wdh unvollständig', repsLimpias: 'Wdh sauber', repsCortas: 'Wdh gefehlt',
    prToast: '🥇 PR bei {e}: {v} kg', ya: 'JETZT!',
    fHistorial: 'Dein Verlauf', fMejor: 'Bestwert {v} kg', fHoy: 'heute',
    fComo: 'So geht sie', fErrores: 'Fehler, die dich Fortschritt kosten', fAlt: 'Gleichwertige Alternativen',
    fArranque: 'Empfohlener Start', fArranqueTxt: '{v} kg in Woche 3.',
    fMarca: '🔓 Deine Bestmarke von damals: {t}',
    fFaltan: 'Dir fehlen {v} kg, um sie zurückzuholen. Da wartet ein Erfolg auf dich.',
    fRecuperada: 'Zurückgeholt. Dieses Gewicht gehört wieder dir.',
    fVideo: 'Technik im Video ansehen',
    fDomiBtn: '🦍 Heute kam mein erster Klimmzug OHNE Unterstützung!', fDomiOk: '🦍 Eingetragen', fDomiYa: '🦍 Freier Klimmzug schon eingetragen',
    segPlan: ['Phasen', 'Regeln', 'Übungen', 'Wissenschaft'],
    vReglas8: 'Die 8 Regeln', vReglasSub: 'im Zweifel gewinnt die Regel',
    vCalendario: 'Kalender', vFasesDetalle: 'Die 4 Phasen im Detail',
    vSeguros: 'Die Versicherungen des Plans', vBiblioteca: 'Übungsbibliothek', vTocaCualquiera: 'tipp eine an',
    vCiencia: 'Die Wissenschaft hinter dem Plan',
    senalesTitulo: 'Stoppsignale', objetivoReal: 'Das wahre Ziel', recuerda: 'Denk dran',
    fase: 'Phase', sem: 'Wo.', fechasLbl: 'Daten', especial: 'Spezial', fuerzaLbl: 'Kraft',
    seriesLbl: 'Sätze', descLbl: 'Pause', ejercicioLbl: 'Übung', diaLbl: 'Tag',
    cardioFase: 'Cardio der Phase',
    zonas: { empuje: 'Drücken', tiron: 'Ziehen', pierna: 'Beine und Hüfte', core: 'Core' },
    chipsNutri: ['Ziel', 'Der Teller', 'Rezepte', 'Menü', 'Einkauf', 'Meal Prep', 'Supplemente'],
    nObjetivo: 'Dein Ziel jetzt', nSemana: 'Woche {w}',
    nNumeros: 'Woher die Zahlen kommen', nPlato: 'So baust du jede Mahlzeit',
    nRecetario: 'Rezeptbuch', nToca: 'antippen zum Kochen', nMenu: 'Wochenmenü',
    nCompra: 'Der Wocheneinkauf', nPrepDom: 'Meal Prep am Sonntag', nSupl: 'Supplemente',
    nReiniciar: 'zurücksetzen', nProteLbl: 'Protein', nGrasaLbl: 'Fett', nCarbosLbl: 'Carbs', kcalLbl: 'kcal',
    nDietBreakTitulo: 'Diese Woche: DIET BREAK', nDietBreakTxt: '~{k} kcal: +2 Portionen Kohlenhydrate am Tag. Protein gleich. Training gleich.',
    nTomaNota: '+ jeden Abend: Pre-Sleep-Portion (Skyr + Whey). ',
    nIngredientes: 'Zutaten (1 Portion)', nPasos: 'Schritte', opcionalParen: ' (optional)',
    chipsProg: ['Überblick', 'Gewicht', 'Taille', 'Gewichte', 'Wochen', 'Checkpoints'],
    pPeso: 'Gewicht', pPerdido: 'Verloren', pCintura: 'Taille', pAdh: 'Konstanz', pSesiones: 'Sessions', pRacha: 'Serie',
    pMediaS: 'Schnitt W{w}', pSinDatos: 'keine Daten', pDesde: 'ab {v}', pCinturaSub: '{f} · Ziel <{m}', pCinturaLunes: 'montags nüchtern',
    pFuerzas: '{a}/{b} Kraftsessions', pDeFuerza: 'Kraftsessions', pDiasCumplidos: 'Tage erfüllt',
    pPesoTitulo: 'Gewicht', pPesoSub: 'Punkte: Wiegungen · Linie: Wochenschnitt · Band: erwarteter Korridor',
    pCinturaTitulo: 'Taille', pCinturaTituloSub: 'die Königsmetrik · Ziel <{m} cm',
    pCargas: 'Gewichte', pCargasSub: 'Übungsgewicht, Session für Session',
    pAdhTitulo: 'Konstanz', pAdhSub: 'abgeschlossene Kraftsessions pro Woche',
    pChk: 'Checkpoints', pEsperado: 'Erwartet', pReal: 'Ist', pSiDesvias: 'Wenn du abweichst',
    pTabla: 'Tabelle', pGrafica: 'Grafik', pFecha: 'Datum',
    pLifts: { 'press-banca': 'Bank', 'sentadilla-barra': 'Kniebeuge', 'rdl-barra': 'RDL' },
    pTuMarca: 'deine Bestmarke · {v} kg', pMeta91: 'Ziel {m}', pAguaCreatina: 'Wasser (erste Wochen)', pLineaBase: 'Baseline',
    pMediaSemana: 'Schnitt W{w}',
    pVacioPeso: 'Die Wiegungen von Montag, Mittwoch und Freitag erscheinen hier',
    pVacioCintura: 'Jeden Montag nüchtern: Maßband am Bauchnabel, ohne zu schnüren',
    pVacioCargas: 'Sobald du bei dieser Übung kg einträgst, siehst du hier den Anstieg',
    pVacioAdh: 'Woche für Woche zeigt sich hier deine Konstanz',
    pCheckpointSemana: 'Checkpoint-Woche', pEsperadoRango: 'Erwartet: {a}–{b} kg', pLlevas: ' · du stehst bei {v}', pSinPesajes: ' · diese Woche noch keine Wiegungen',
    pRapido: 'Du bist zu schnell unterwegs', pLento: 'Tempo unter dem Erwarteten',
    pFrenaTrote: 'Bremse beim Joggen', pFrenaTxt: 'Diese Woche liegst du bei {r}× deinem jüngsten Schnitt an Laufminuten. Über 1,3× schießt das Verletzungsrisiko hoch: kürzen oder gehen.',
    lDiscos: 'Die Scheiben-Sammlung', lDiscosSub: 'eine pro abgeschlossener Phase',
    lLogros: 'Erfolge', lFuerzas: 'Kraftsessions', lPRs: 'PRs', lPerdido: 'Verloren', lMejorRacha: 'Beste Serie', lLogrosN: 'Erfolge', lFotos: 'Fotos',
    ajustes: 'Einstellungen', ajustesSub: 'BACK2PRIME · deine Daten leben NUR auf diesem Gerät',
    ajLineaBase: 'Baseline', ajCinturaIni: 'Anfangstaille (cm)', ajGuardar: 'Baseline speichern', ajGuardado: 'Gespeichert',
    ajCopia: 'Backup',
    ajCopiaTxt: 'Die Daten verlassen das Handy nicht. Mach ab und zu ein Backup (oder vor einem Gerätewechsel) und leg es ab, wo du willst.',
    ajExportar: '⬇ Exportieren', ajImportar: '⬆ Importieren', ajImportOk: 'Backup wiederhergestellt', ajImportErr: 'Diese Datei sieht nicht nach einem BACK2PRIME-Backup aus',
    ajIdioma: 'Sprache', ajIdiomaNota: 'Die App lädt beim Wechsel neu. Deine Daten bleiben unangetastet.',
    ajRehacer: 'Meinen Plan erstellen / neu machen', ajRehacerNota: 'Führt zum Fragebogen. Neu erzeugen rührt deine Tageseinträge nie an.', ajPeligro: 'Gefahrenzone', ajBorrar: 'Alle Daten löschen', ajBorrarConfirma: 'Sicher? Tipp noch einmal, um ALLES zu löschen',
    obTitulo: 'Willkommen bei BACK2PRIME', obSub: '12 Wochen · 17. Aug → 8. Nov · von 95 zu deiner besten Version',
    obTexto: 'Dein Trainingstagebuch, dein Plan und deine Ernährung an einem Ort. Hak ab, was du jeden Tag machst: Die App schlägt dir die Gewichte vor, wacht über dein Tempo und lässt Erfolge springen. Alles bleibt auf deinem Handy.',
    obConsejo: 'Tipp: Leg sie auf den Homescreen (Teilen → Zum Home-Bildschirm) und nutz sie wie eine echte App.',
    obCintura: 'Anfangstaille — deine Königsmetrik', obPlaceholder: 'cm (optional, geht auch später)', obEmpezamos: 'Los geht’s',
    celebraOk: 'Weiter geht’s',
    nuevoDia: 'Neuer Tag: {f}'
  };

  UI.checkSalidaTitulo = 'Abschluss-Check ({f})';
  UI.checkSalidaTxt = 'Du schaffst beide Zirkel mit den Wdh von Woche 2 ohne Gelenkschmerz → Phase 2. Wenn etwas zwickt, wiederholst du eine Woche: Die Sehnen danken es dir.';
  UI.planEmpiezaTitulo = 'Der Plan startet am {f}';
  UI.planEmpiezaTxt = 'Phase 1 · Reaktivierung zuhause. Hier hast du alles, um mit gemachten Hausaufgaben anzutreten.';

    const QUIZ_DEP = [{ id: 'running', n: 'Laufen' }, { id: 'natacion', n: 'Schwimmen' }, { id: 'ciclismo', n: 'Radfahren' }, { id: 'padel', n: 'Padel' }, { id: 'futbol', n: 'Fußball' }, { id: 'baloncesto', n: 'Basketball' }, { id: 'volley', n: 'Volleyball' }, { id: 'yoga', n: 'Yoga' }, { id: 'calistenia', n: 'Calisthenics' }, { id: 'boxeo', n: 'Boxen' }];
  return { META, FASES, CAL, HITOS_SEMANA, SESIONES, CALENTAMIENTO, TENDON, CARRERA, HISTORICO, ARRANQUE, EJERCICIOS, REGLAS, SENALES, NUTRI, RECETAS, COMPRA, MEALPREP, MEALPREP_NOTA, MENU, CHECKPOINTS, AJUSTES, FOTOS, LOGROS, CIENCIA, CIERRE, AVISO_LEGAL, QUIZ_DEP, UI };
})();
