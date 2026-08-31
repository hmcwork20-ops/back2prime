/* ============================================================
   BACK2PRIME · data.pt.js — português de Portugal
   Todo o conteúdo do plano: fases, calendário, sessões, fichas de
   exercícios, nutrição, receitas, conquistas. Sem lógica: só dados.
   IMPORTANTE: os valores que a app compara como texto (tipo, icono,
   zona, ids de receita, 'LIBRE') NÃO se traduzem.
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
      objetivoNota: '≈ −8 kg de gordura reais: a creatina esconde ~1 kg de água na balança',
      cinturaMetaCm: 91,
      grasaEstimada: '~22% → 16-17%',
      proteinaDia: 190
    }
  };

  /* ---------- FASES (código de discos olímpicos) ---------- */
  const FASES = [
    { id: 1, nombre: 'Reativação', sub: 'Em casa', semanas: [1, 2], disco: 10, rpe: '6–7',
      fechas: '17 – 30 ago',
      objetivo: 'Reconstruir o hábito e acordar os padrões de movimento sem castigar articulações. Vais ficar com vontade de mais: é intencional.' },
    { id: 2, nombre: 'Entrada no ginásio', sub: 'Full Body ×3', semanas: [3, 4, 5], disco: 15, rpe: '6–7',
      fechas: '31 ago – 20 set',
      objetivo: 'Reaprender os básicos com barra e construir base de carga. A tua memória muscular permite pesos que o tecido conjuntivo ainda não aguenta: trabalha a 65-70% do que sentes que podias, com 3 repetições na reserva SEMPRE.' },
    { id: 3, nombre: 'Carga', sub: 'Tronco / Perna ×4', semanas: [6, 7, 8, 9], disco: 20, rpe: '7–8',
      fechas: '21 set – 18 out',
      objetivo: 'Volume e intensidade a sério para forçar a recomposição: aqui a memória muscular rende de verdade. Termina cada série a poder fazer mais 2 repetições, e que sejam reais: quem regressa tende a sobrestimar o quão perto está da falha.' },
    { id: 4, nombre: 'Pico', sub: 'Push / Pull / Legs ×5', semanas: [10, 11, 12], disco: 25, rpe: '8',
      fechas: '19 out – 8 nov',
      objetivo: 'Estímulo máximo para fechar a recomposição. {d} dias, mas com sessões de {min} minutos, não de 2 horas. RPE 8: 1-2 repetições na reserva nas últimas séries.' }
  ];

  /* ---------- CALENDÁRIO: 12 semanas × 7 dias (Seg..Dom) ----------
     Cada slot: id de sessão, ou {s:id, opt:true} se for opcional.   */
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

  /* ---------- SEMANAS ESPECIAIS (evidência: descarga gerida + diet break + transição) ---------- */
  const HITOS_SEMANA = {
    5:  { t: 'Rastreio de saúde', d: 'Antes da fase de carga, se levas anos sem atividade vigorosa: mede a tensão numa farmácia e faz análises básicas (lípidos, glicose/HbA1c). 15 minutos que compram tranquilidade.' },
    7:  { t: 'DIET BREAK', d: 'A semana inteira comes à manutenção (~2.800 kcal: +2 porções de hidratos por dia, proteína igual). O treino não muda. Não é um prémio nem uma recaída: restaura NEAT e leptina, e quebra o ciclo psicológico do tudo ou nada. Na segunda seguinte, défice outra vez como se nada fosse.' },
    9:  { t: 'DESCARGA (não opcional)', d: 'Mesma rotina com METADE das séries por exercício e o mesmo peso na barra. Não é paragem: parar por completo custa força. É manutenção de tecido + férias para tendões e articulações antes do bloco final.' },
    10: { t: 'Mais um dia', d: 'Primeira semana do bloco novo: faz UMA série a menos em tudo. Subir de dia é o ponto de maior risco tendinoso do plano; entra-se a andar, não a saltar.' }
  };

  /* ---------- SESSÕES ---------- */
  // bloques: e = id exercício · s = séries · r = reps (rW = por semana) · d = descanso seg · n = nota curta
  const SESIONES = {
    /* — Fase 1 · casa — */
    'c-a': { nombre: 'Circuito A', tipo: 'fuerza', fase: 1, dur: '~35′', calent: true, bloques: [
      { e: 'sentadilla-pc',  s: 3, rW: { 1: '10', 2: '12' }, d: 75 },
      { e: 'flexiones',      s: 3, rW: { 1: '6-8', 2: '8-10' }, d: 75 },
      { e: 'puente-gluteo',  s: 3, rW: { 1: '12', 2: '15' }, d: 60 },
      { e: 'plancha',        s: 3, rW: { 1: '25″', 2: '35″' }, d: 60 },
      { e: 'elev-talones',   s: 2, rW: { 1: '15', 2: '20' }, d: 45, n: 'Prepara os tendões para a corrida' }
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
      { e: 'sentadilla-barra',   s: 3, r: '8',  d: 120, n: 'S3: barra vazia ou +10-20 kg, só padrão' },
      { e: 'press-banca',        s: 3, r: '8',  d: 120 },
      { e: 'remo-barra',         s: 3, r: '8',  d: 120 },
      { e: 'press-militar-mc',   s: 2, r: '10', d: 90 },
      { e: 'curl-femoral-tumbado', s: 2, r: '12', d: 90 },
      { e: 'plancha',            s: 3, r: '40″', d: 60, n: 'Quando for fácil: alterna o apoio de uma mão' }
    ]},
    'fb-b': { nombre: 'Full Body B', tipo: 'fuerza', fase: 2, dur: '~60′', calent: true, bloques: [
      { e: 'rdl-barra',          s: 3, r: '8',  d: 120, n: 'Começa com 30-40 kg' },
      { e: 'press-inclinado-mc', s: 3, r: '10', d: 120 },
      { e: 'jalon-pecho',        s: 3, r: '10', d: 90 },
      { e: 'zancada-mc',         s: 2, r: '10/p', d: 90, n: '6-10 kg por mão' },
      { e: 'elev-laterales',     s: 2, r: '15', d: 60 },
      { e: 'face-pull',          s: 2, r: '15', d: 60, n: 'Contrapeso ao empurrar: saúde do ombro desde já' },
      { e: 'crunch-polea',       s: 3, r: '12', d: 60 }
    ]},
    /* — Fase 3 · Tronco/Perna — */
    'torso-a': { nombre: 'Tronco A', tipo: 'fuerza', fase: 3, dur: '~70′', calent: true, bloques: [
      { e: 'press-banca',      s: 4, r: '6-8', d: 150, n: 'Básico pesado: 4×8 limpo → +2,5 kg e volta a 4×6' },
      { e: 'remo-barra',       s: 4, r: '8',   d: 120, n: 'Mesmo peso nas 4 séries' },
      { e: 'press-militar',    s: 3, r: '10',  d: 90 },
      { e: 'jalon-pecho',      s: 3, r: '10',  d: 90, n: '1″ de pausa em baixo' },
      { e: 'elev-laterales',   s: 3, r: '15',  d: 60 },
      { e: 'face-pull',        s: 2, r: '15',  d: 60, n: '2.ª dose semanal de rotação externa' },
      { e: 'curl-barra-z',     s: 2, r: '12',  d: 60 },
      { e: 'ext-triceps-polea', s: 2, r: '12', d: 60 }
    ]},
    'pierna-a': { nombre: 'Perna A', tipo: 'fuerza', fase: 3, dur: '~70′', calent: true, tendon: 'rodilla', bloques: [
      { e: 'sentadilla-barra', s: 4, r: '6-8', d: 150, n: 'Progressão dupla, tal como o supino' },
      { e: 'rdl-barra',        s: 3, r: '8',   d: 120, n: '+5 kg quando as 3 séries saírem limpas' },
      { e: 'prensa',           s: 3, r: '10',  d: 90 },
      { e: 'curl-femoral-tumbado', s: 3, r: '12', d: 90, n: 'Excêntrica de 3″' },
      { e: 'gemelo-pie',       s: 4, r: '8',   d: 90, n: 'HSR de tendão: 3″ a descer / 3″ a subir, com carga a sério' },
      { e: 'plancha-lastre',   s: 3, r: '40″', d: 60 }
    ]},
    'torso-b': { nombre: 'Tronco B', tipo: 'fuerza', fase: 3, dur: '~70′', calent: true, bloques: [
      { e: 'press-inclinado-mc', s: 4, r: '8', d: 120, n: 'Empurrar pesado do dia' },
      { e: 'dominadas',        s: 4, r: '8',   d: 120, n: 'Reduz a assistência semana a semana' },
      { e: 'press-plano-mc',   s: 3, r: '10',  d: 90 },
      { e: 'remo-polea',       s: 3, r: '12',  d: 90 },
      { e: 'face-pull',        s: 3, r: '15',  d: 60, n: 'Saúde do ombro para as fases de empurrar' },
      { e: 'curl-inclinado',   s: 2, r: '12',  d: 60, n: 'Superset com o francês se estiveres à justa' },
      { e: 'press-frances',    s: 2, r: '12',  d: 60 }
    ]},
    'pierna-b': { nombre: 'Perna B', tipo: 'fuerza', fase: 3, dur: '~70′', calent: true, tendon: 'rodilla', bloques: [
      { e: 'hip-thrust',       s: 4, r: '8',   d: 120, n: 'Pausa 1″ em cima, glúteo ao máximo' },
      { e: 'zancada-bulgara',  s: 3, r: '10/p', d: 90, n: 'O mais duro do plano. Começa sem peso' },
      { e: 'ext-cuadriceps',   s: 3, r: '12',  d: 90, n: 'Se a rótula incomodar, reduz a amplitude em cima' },
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
      { e: 'ext-triceps-polea', s: 3, r: '12', d: 60, n: 'Alterna com a extensão acima da cabeça' },
      { e: 'ext-triceps-cabeza', s: 3, r: '12', d: 60 }
    ]},
    'pull-a': { nombre: 'Pull', tipo: 'fuerza', fase: 4, dur: '~65′', calent: true, bloques: [
      { e: 'rdl-barra',        s: 3, r: '6-8', d: 150 },
      { e: 'dominadas',        s: 4, r: '8',   d: 120, n: 'Com lastro se saírem mais de 10' },
      { e: 'remo-barra',       s: 3, r: '10',  d: 120, n: 'Ou remada na polia' },
      { e: 'face-pull',        s: 3, r: '15',  d: 60 },
      { e: 'curl-barra-z',     s: 3, r: '10',  d: 60 },
      { e: 'curl-martillo',    s: 2, r: '12',  d: 60 }
    ]},
    'legs': { nombre: 'Legs', tipo: 'fuerza', fase: 4, dur: '~70′', calent: true, tendon: 'rodilla', bloques: [
      { e: 'sentadilla-barra', s: 4, r: '6',  d: 150 },
      { e: 'prensa',           s: 3, r: '10', d: 120 },
      { e: 'hip-thrust',       s: 3, r: '10', d: 120 },
      { e: 'curl-femoral-tumbado', s: 3, r: '12', d: 90 },
      { e: 'gemelo-pie',       s: 4, r: '8',  d: 90, n: 'HSR: 3″ a descer / 3″ a subir' },
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
    'cam40':  { nombre: 'Caminhada 40′', tipo: 'cardio', icono: 'walk', detalle: 'Ritmo de conversa desconfortável: consegues falar, mas não cantar. Conta para os passos do dia.' },
    'cam60':  { nombre: 'Caminhada 60′', tipo: 'cardio', icono: 'walk', detalle: 'Ritmo vivo e sustentado. Ideal no exterior: soma luz, passos e recuperação ativa.' },
    'wj3': { nombre: 'Andar-correr S3', tipo: 'cardio', icono: 'run', detalle: '7 rondas: 2′ de corrida leve + 2′ a andar (28′). Antes: 2×20 tibialis raises + 10 elevações de calcanhar. Corrida mesmo leve: se não consegues falar, vais rápido.' },
    'wj4': { nombre: 'Andar-correr S4', tipo: 'cardio', icono: 'run', detalle: '6 rondas: 3′ de corrida + 2′ a andar (30′). Antes: 2×20 tibialis raises. Cadência alta e passadas curtas: menos impacto por passada.' },
    'wj5': { nombre: 'Andar-correr S5', tipo: 'cardio', icono: 'run', detalle: '5 rondas: 5′ de corrida + 1′ a andar (30′), ou 20′ de corrida leve contínua se o corpo estiver bem. Antes: 2×20 tibialis raises.' },
    'trote25': { nombre: 'Corrida 25-30′', tipo: 'cardio', icono: 'run', detalle: 'Contínua e conversacional. Melhor asfalto liso ou terra compacta do que passeios irregulares. Se aparecer desconforto na canela ou no joelho que piora a correr: corta e anda.' },
    'trote30': { nombre: 'Corrida 30-35′', tipo: 'cardio', icono: 'run', detalle: 'Contínua. Um dia pode ser mais animado (últimos 10′ a ritmo médio), o outro sempre leve.' },
    'libre': { nombre: 'Descanso', tipo: 'libre', icono: 'rest', detalle: 'Dia livre a sério. Os passos diários continuam a contar. Domingo: meal prep (~90′) deixa a semana resolvida.' }
  };

  /* ---------- AQUECIMENTO (sempre, 6′) ---------- */
  const CALENTAMIENTO = {
    titulo: 'Aquecimento · 6′ · sempre',
    pasos: [
      'Círculos de braços · 30″',
      'Rotações de anca · 30″ por lado',
      '10 agachamentos lentos sem peso',
      '5 afundos com rotação por lado',
      'Prancha · 20″',
      '20 polichinelos'
    ],
    gym: 'No ginásio, ainda: 1-2 séries de aproximação com pouco peso no primeiro exercício pesado do dia (50% e 75% do peso de trabalho).'
  };

  /* ---------- PROTOCOLO DE TENDÃO (o seguro do plano) ---------- */
  const TENDON = {
    titulo: 'Protocolo de tendão · 6-8′ · 2-3×/semana',
    intro: 'A força volta em semanas; o tendão precisa de meses (o colagénio renova-se ~10 vezes mais devagar e não tem memória muscular). Este bloco é o seguro do plano: começa na semana 1, e a corrida da semana 3 só entra com duas semanas de tendão já rodadas.',
    bloques: [
      { id: 'tendon-rodilla', nombre: 'Rotuliano · isométrico', donde: 'Depois de cada sessão de perna (na F1, depois dos circuitos)',
        detalle: 'Agachamento isométrico na parede (F2+: agachamento espanhol com fita rígida atrás dos joelhos): 5 × 45″ a 70% de esforço, 1′ de descanso. Coxa perto do paralelo, sem dor aguda. Além de adaptar, tem efeito analgésico imediato (Rio 2015).' },
      { id: 'tendon-aquiles', nombre: 'Aquiles · HSR de gémeo', donde: 'Já integrado nas sessões (elevações/gémeo)',
        detalle: 'A regra que muda tudo: gémeo PESADO e LENTO, 3″ a descer, 3″ a subir, 6-8 reps, sem ressaltos. Na F1 com mochila carregada a uma perna; no ginásio com carga a sério. O ressalto usa o reflexo do tendão e tira-lhe exatamente o estímulo de que precisa.' },
      { id: 'tendon-tibial', nombre: 'Tibial anterior', donde: 'Antes de cada corrida',
        detalle: 'Tibialis raises apoiado na parede: 2-3 × 15-20. É a vacina contra a periostite ao teu peso atual.' },
      { id: 'tendon-codo', nombre: 'Cotovelo/punho · isométrico', donde: 'Depois das sessões de tronco (F2+), 2×/semana',
        detalle: 'Com um haltere leve, punho parado a meia flexão: 3 × 45″ (palma para cima e palma para baixo). O volume de supino + remada + puxada dispara epicondilite em quem regressa; isto previne-a de graça.' }
    ],
    nota: 'NÃO acrescentes pliometria/saltos «para preparar a corrida»: a evidência diz que é mau estímulo tendinoso e alto impacto. A tua preparação de impacto é este bloco.'
  };

  /* ---------- REGRAS DE CORRIDA (evidência IMC ~28) ---------- */
  const CARRERA = {
    titulo: 'Como correr sem te partires ({p} kg mandam)',
    reglas: [
      'Cadência 170-180 passos/min, passada curta: reduz o impacto tibial ~11% e a taxa de carga ~15%. Conta passos 30″ (85-90) ou usa o metrónomo do relógio.',
      'Volume governado por sensações e pela progressão do plano: nunca subas mais de ~1,3× a média das últimas 4 semanas (a app avisa-te).',
      'A semana 3 arranca com ~2,5 km de corrida no total: abaixo do teto de 3 km/semana que a evidência marca para começar com excesso de peso.',
      'Superfície e sapatilhas CONSTANTES: não mudes as duas coisas ao mesmo tempo. Melhor asfalto liso ou terra compacta do que passeios.',
      'Desconforto na canela ou no joelho que PIORA a correr: corta e anda. O que desaparece ao aquecer, vigia-o; o que cresce, manda.'
    ]
  };

  /* ---------- MARCAS HISTÓRICAS (etapa de ginásio, ~2021) ---------- */
  // Não entram como PR: são a referência de «onde estavas» e o alvo a recuperar.
  /* Sin marcas previas: el plan se genera del cuestionario. La clave se
     mantiene porque la app la consulta, y vacía deja los logros de marca
     personal fuera de alcance, que es lo correcto para cualquiera. */
  const HISTORICO = {};

  /* ---------- ARRANQUE DE CARGAS · FASE 2 ---------- */
  const ARRANQUE = {
    titulo: 'Com que peso começas no ginásio (semana 3)',
    derivacion: 'Saem das tuas marcas reais, supino 95×8 e agachamento 100×8 (1RM ≈ 120 e ≈ 127 kg), a 50%: o arranque padrão de quem regressa. Não porque o músculo não possa mais, mas porque o tendão leva 5 anos sem carregar. Daí em diante, a progressão dupla fica com a app.',
    tabla: [
      { ej: 'press-banca',      s3: '45 kg', s4: '47,5 kg', s5: '50 kg', n: '50% dos teus 95. Barra + 2×12,5' },
      { ej: 'sentadilla-barra', s3: '50 kg', s4: '55 kg',   s5: '60 kg', n: '50% dos teus 100. Barra + 2×15' },
      { ej: 'rdl-barra',        s3: '45 kg', s4: '50 kg',   s5: '55 kg', n: '≈45% do teu agachamento antigo' },
      { ej: 'remo-barra',       s3: '40 kg', s4: '42,5 kg', s5: '45 kg', n: '≈45% do teu supino antigo' }
    ],
    resto: 'Os restantes exercícios não têm marca prévia: na primeira série escolhe um peso que consigas mover deixando 3 repetições na reserva, aponta-o, e a app trata do resto.',
    aviso: 'Estes pesos vão parecer-te ridículos. É esse o ponto: a tendinite de quem regressa gera-se nas semanas 3-5, quando o sistema nervoso permite aquilo que os tendões ainda não aguentam.',
    desequilibrio: 'As tuas próprias marcas dizem-no: agachamento 100 vs supino 95 é um rácio de 1,05 (o equilibrado ronda 1,4-1,5). O trem inferior ia atrás — e aí está a dupla boa notícia: é onde tens mais margem e o que mais move a recomposição. Não faltes aos dias de perna.'
  };

  /* ---------- FICHAS DE EXERCÍCIOS ---------- */
  // musc: [primário, secundários] · cues: técnica · err: erros típicos ·
  // alt: alternativas equivalentes (ginásio comercial) · mol: se incomodar, muda para
  const EJERCICIOS = {
    /* — Casa / F1 — */
    'sentadilla-pc': { pat: 'rod',
      nombre: 'Agachamento com peso do corpo', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadríceps', 'glúteo'], equipo: 'Nada',
      cues: ['Pés à largura dos ombros, pontas ligeiramente para fora', 'Desce em 3″ como se te sentasses para trás, sobe em 1″', 'Joelhos seguem a ponta do pé, calcanhares cravados no chão', 'Peito alto durante todo o percurso'],
      err: ['Calcanhares que se levantam (desce menos fundo)', 'Joelhos que colapsam para dentro', 'Descer a saltar em vez de controlar'],
      alt: [{ n: 'Agachamento até uma caixa/sofá', por: 'se te custa controlar a profundidade' }, { n: 'Agachamento com pausa de 2″ em baixo', por: 'se 12 reps te souberem a pouco' }],
      mol: 'Se o joelho incomodar: reduz a profundidade até onde não doa e desce ainda mais devagar.'
    },
    'flexiones': { pat: 'eh',
      nombre: 'Flexões', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Peitoral', 'tríceps, ombro'], equipo: 'Nada',
      cues: ['Mãos um pouco mais largas do que os ombros', 'Cotovelos a 45° do corpo, nem colados nem em cruz', 'Corpo em prancha: glúteo e abdómen apertados', 'O peito toca (quase) o chão em cada rep'],
      err: ['Anca caída ou em bico', 'Meio percurso', 'Pescoço adiantado para o chão'],
      alt: [{ n: 'Flexões com mãos no sofá/mesa', por: 'se não saem limpas do chão' }, { n: 'Flexões com pés elevados', por: 'se passas de 12 com facilidade' }],
      mol: 'Se o punho incomodar: punhos fechados ou pegas de flexão. Se o ombro incomodar: aperta um pouco a largura.'
    },
    'puente-gluteo': { pat: 'bis',
      nombre: 'Ponte de glúteo', mm: { p: ['gluteo'], s: ['isquios'] }, zona: 'pierna', musc: ['Glúteo', 'isquiotibiais'], equipo: 'Nada',
      cues: ['Deitado, calcanhares perto do glúteo', 'Empurra com os calcanhares e sobe a anca', 'Pausa de 2″ em cima a apertar o glúteo com força', 'Costelas para baixo: não arqueies a lombar'],
      err: ['Empurrar com a ponta do pé', 'Arquear a lombar para subir mais', 'Subir e descer sem pausa'],
      alt: [{ n: 'Ponte a uma perna', por: 'quando 15 reps forem confortáveis' }, { n: 'Ponte com mochila sobre a anca', por: 'para acrescentar carga em casa' }],
      mol: 'Se houver cãibra no isquiotibial: aproxima mais os calcanhares do glúteo.'
    },
    'plancha': { pat: 'core',
      nombre: 'Prancha frontal', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Core completo'], equipo: 'Nada',
      cues: ['Antebraços no chão, cotovelos sob os ombros', 'Costelas para dentro, pélvis em retroversão (mete o rabo)', 'Glúteo apertado, olhar para o chão', 'Respira: não prendas o ar'],
      err: ['Anca caída (a lombar sofre)', 'Rabo em bico (batota)', 'Aguentar a tremer: se a lombar treme, corta a série'],
      alt: [{ n: 'Prancha com apoio de joelhos', por: 'se não aguentas o tempo com boa forma' }],
      mol: 'Se a lombar incomodar: revê a retroversão pélvica antes de tudo; costuma ser isso.'
    },
    'plancha-lastre': { pat: 'core',
      nombre: 'Prancha com carga', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Core completo'], equipo: 'Disco 5-10 kg',
      cues: ['Mesma técnica da prancha normal', 'Que te coloquem o disco entre as omoplatas, não na lombar', 'Se a anca cair, tira carga'],
      err: ['Disco demasiado baixo (carrega a lombar)', 'Perder a retroversão ao cansares-te'],
      alt: [{ n: 'Prancha com toques de ombro', por: 'se não tens quem te ponha o disco' }, { n: 'Ab wheel de joelhos', por: 'variante mais exigente' }],
      mol: 'Se a lombar incomodar: volta à prancha sem carga + toques de ombro.'
    },
    'elev-talones': { pat: 'gem',
      nombre: 'Elevação de calcanhares', mm: { p: ['gemelos'], s: [] }, zona: 'pierna', musc: ['Gémeo', 'solear'], equipo: 'Degrau opcional',
      cues: ['Amplitude completa: alonga em baixo, pausa 1″ em cima', 'Sobe em 1″, desce em 2-3″', 'Melhor num degrau para mais percurso'],
      err: ['Saltitar depressa sem pausa', 'Meio percurso em cima'],
      alt: [{ n: 'A uma perna', por: 'quando 20 reps forem fáceis' }],
      mol: 'Se o Aquiles incomodar: reduz a amplitude em baixo e aumenta o tempo de descida.'
    },
    'zancada-alterna': { pat: 'zan',
      nombre: 'Afundo alternado', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadríceps', 'glúteo'], equipo: 'Nada',
      cues: ['Passo amplo para a frente', 'Tronco vertical, mãos na anca ou à frente', 'O joelho de trás roça o chão', 'Empurra com o calcanhar da frente para voltar'],
      err: ['Passo curto (colapsa o joelho da frente)', 'Tronco inclinado para a frente', 'Joelho da frente que vai para dentro'],
      alt: [{ n: 'Afundo estático (sem alternar)', por: 'se o equilíbrio falha' }, { n: 'Afundo para trás', por: 'mais simpático para o joelho' }],
      mol: 'Se o joelho incomodar: muda para afundo PARA TRÁS, mesmo esquema.'
    },
    'banda-remo': { pat: 'th',
      nombre: 'Remada sentada com elástico', mm: { p: ['dorsal'], s: ['biceps', 'espalda-alta'] }, zona: 'tiron', musc: ['Dorsal', 'bíceps, omoplatas'], equipo: 'Elástico',
      cues: ['Elástico ancorado à altura do peito (maçaneta, poste ou sob os pés)', 'Puxa com os COTOVELOS colados ao corpo', 'Junta as omoplatas no fim e aguenta meio segundo', 'Solta devagar: a volta é metade do exercício'],
      err: ['Levar o tronco atrás para puxar mais', 'Soltar o elástico de repente'],
      alt: [{ n: 'Remada com toalha na porta', por: 'se não tens onde ancorar' }, { n: 'Remada com mochila carregada', por: 'a uma mão, apoiado na mesa' }],
      mol: 'Se o ombro incomodar: baixa a ancoragem e puxa mais colado ao lado.'
    },
    'banda-jalon': { pat: 'tv',
      nombre: 'Puxada com elástico', mm: { p: ['dorsal'], s: ['biceps'] }, zona: 'tiron', musc: ['Dorsal', 'bíceps'], equipo: 'Elástico',
      cues: ['Elástico ancorado em cima (aro da porta ou dobradiça alta)', 'De joelhos ou sentado, peito alto', 'Desce os cotovelos para os bolsos, não para trás', 'O peito vai ao encontro das mãos'],
      err: ['Arquear a lombar para ganhar percurso', 'Puxar só com os braços'],
      alt: [{ n: 'Elevações assistidas com elástico', por: 'se tens barra' }, { n: 'Remada com toalha na porta', por: 'sem ancoragem alta' }],
      mol: 'Se o ombro incomodar: pega mais fechada e não desças tanto.'
    },
    'banda-rotacion': { pat: 'ais',
      nombre: 'Rotação externa com elástico', mm: { p: ['hombro'], s: ['espalda-alta'] }, zona: 'empuje', musc: ['Coifa dos rotadores', 'omoplatas'], equipo: 'Elástico',
      cues: ['Cotovelo colado ao lado, 90° fixo (uma toalha enrolada ajuda)', 'Roda o antebraço para fora, devagar', 'O ombro não encolhe: mantém a clavícula em baixo', '2-3″ de volta, sem largar a tensão'],
      err: ['Afastar o cotovelo do corpo', 'Usar elástico duro: aqui manda o controlo, não a carga'],
      alt: [{ n: 'Com haltere leve deitado de lado', por: 'mesma função, sem elástico' }, { n: 'Face pull com elástico', por: 'mais omoplata' }],
      mol: 'Se picar: reduz o percurso a metade e baixa a resistência.'
    },
    'banda-abduccion': { pat: 'ais',
      nombre: 'Abdução de anca com elástico', mm: { p: ['gluteo'], s: [] }, zona: 'pierna', musc: ['Glúteo médio', 'estabilidade do joelho'], equipo: 'Elástico',
      cues: ['Elástico acima dos joelhos', 'De pé ou deitado de lado: abre o joelho sem rodar a anca', 'O tronco não se mexe, só a perna', 'Aguenta um segundo em cima'],
      err: ['Rodar a bacia para abrir mais', 'Ir depressa: o glúteo médio treina-se devagar'],
      alt: [{ n: 'Ponte de glúteo com elástico', por: 'mais glúteo máximo' }, { n: 'Passo lateral com elástico (monster walk)', por: 'de pé, mais funcional' }],
      mol: 'Se o joelho incomodar: coloca o elástico por baixo, nas canelas.'
    },
    'remo-toalla': { pat: 'th',
      nombre: 'Remada com toalha na porta', mm: { p: ['dorsal'], s: ['biceps', 'espalda-alta'] }, zona: 'tiron', musc: ['Dorsal', 'bíceps, omoplatas'], equipo: 'Toalha + porta (ou mochila)',
      cues: ['Toalha na maçaneta/aro, corpo inclinado para trás', 'Puxa com o COTOVELO, não com a mão', 'Omoplatas atrás e para baixo no fim do percurso', 'Quanto mais te inclinares, mais duro'],
      err: ['Puxar com os braços sem mover as omoplatas', 'Dar puxões com impulso de anca'],
      alt: [{ n: 'Remada com mochila carregada', por: 'a uma mão, apoiado na mesa' }, { n: 'Remada invertida sob uma mesa robusta', por: 'versão mais dura' }],
      mol: 'Se o cotovelo incomodar: pega mais larga e menos inclinação.'
    },
    'rdl-1p': { pat: 'bis',
      nombre: 'Peso morto romeno a 1 perna', mm: { p: ['isquios'], s: ['gluteo'] }, zona: 'pierna', musc: ['Isquiotibiais', 'glúteo, equilíbrio'], equipo: 'Nada (mochila opcional)',
      cues: ['Anca para trás, costas direitas como uma mesa', 'A perna livre sobe atrás como contrapeso', 'Desce até sentires o alongamento do isquiotibial', 'Prioriza equilíbrio sobre profundidade'],
      err: ['Arredondar as costas para chegar mais abaixo', 'Rodar a anca (mantém as duas ancas viradas para o chão)'],
      alt: [{ n: 'Com apoio de uma mão na parede', por: 'se o equilíbrio parte a série' }, { n: 'B-stance (pé de trás de apoio)', por: 'ponto intermédio' }],
      mol: 'Se o isquiotibial puxar demasiado: reduz a amplitude, não a técnica.'
    },
    'superman': { pat: 'core',
      nombre: 'Superman', mm: { p: ['lumbar'], s: ['gluteo', 'espalda-alta'] }, zona: 'core', musc: ['Lombar', 'glúteo, costas altas'], equipo: 'Nada',
      cues: ['De barriga para baixo, braços à frente', 'Sobe braços e pernas ao mesmo tempo, 2″ em cima', 'Olhar para o chão: não puxes o pescoço'],
      err: ['Chicotada cervical a olhar em frente', 'Subir com ressalto'],
      alt: [{ n: 'Bird-dog (braço e perna contrários)', por: 'mais controlo, menos compressão' }],
      mol: 'Se a lombar incomodar: passa diretamente a bird-dog.'
    },
    'dead-bug': { pat: 'core',
      nombre: 'Dead bug', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Core anterior profundo'], equipo: 'Nada',
      cues: ['Deitado, lombar COLADA ao chão o tempo todo', 'Braço e perna contrários descem devagar ao mesmo tempo', 'Expira ao estender: as costelas ficam em baixo'],
      err: ['A lombar arqueia ao estender a perna (encurta o percurso)', 'Ir depressa'],
      alt: [{ n: 'Só pernas (braços parados)', por: 'se perdes a lombar no chão' }],
      mol: 'É o exercício mais seguro do plano; se algo incomodar, confirma que a lombar não se descola.'
    },

    'pike-flexiones': { pat: 'ev',
      nombre: 'Flexões em pica', mm: { p: ['hombro'], s: ['triceps'] }, zona: 'empuje', musc: ['Deltoide anterior', 'tricípite'], equipo: 'Nada',
      cues: ['V invertido: mãos e pés perto, anca bem no alto', 'A cabeça desce ENTRE as mãos, não à frente', 'Cotovelos a 45° do corpo, nunca abertos', 'Em cima estende por completo, sem encolher os ombros'],
      err: ['Baixar a anca e transformá-lo numa flexão normal', 'Levar a cabeça à frente das mãos (é aí que o ombro paga)', 'Meio percurso para poder contar mais repetições'],
      alt: [{ n: 'Com os pés numa cadeira', por: 'quando 12 já saírem fáceis' }, { n: 'Com as mãos num degrau', por: 'se ainda não desces limpo' }],
      mol: 'Se o ombro incomodar: baixa um pouco a anca até o ângulo ficar confortável. O empurrão vertical é o que mais mobilidade pede em todo o plano.'
    },
    'jalon-toalla': { pat: 'tv',
      nombre: 'Puxada com toalha', mm: { p: ['dorsal'], s: ['biceps'] }, zona: 'tiron', musc: ['Grande dorsal', 'bicípite'], equipo: 'Toalha',
      cues: ['Toalha esticada acima da cabeça: um braço puxa para baixo e o outro RESISTE', 'O cotovelo que puxa vai ao lado do corpo, não à frente', 'Baixa a omoplata e aguenta 1″', 'Volta a subir em 3″ a travar com o braço contrário'],
      err: ['Puxar com o bicípite em vez das costas', 'Encolher o ombro em vez de baixar a omoplata', 'Não resistir com o braço de cima: sem tensão não há estímulo'],
      alt: [{ n: 'Remada invertida debaixo de uma mesa firme', por: 'muito mais mensurável: se tens mesa, faz antes isso' }, { n: 'Elevações', por: 'assim que tiveres uma barra' }],
      mol: 'Sem barra, a puxada vertical é a mais difícil de substituir a sério: se puderes, dá prioridade à remada debaixo da mesa, que carrega peso a sério.'
    },
    'abduccion-lado': { pat: 'ais',
      nombre: 'Abdução de anca deitado de lado', mm: { p: ['gluteo'], s: [] }, zona: 'pierna', musc: ['Glúteo médio'], equipo: 'Nada',
      cues: ['Deitado de lado, corpo alinhado e anca perpendicular ao chão', 'Sobe a perna de cima com o calcanhar ligeiramente atrasado', 'Sobe em 1″, aguenta 1″ e desce em 3″', 'A ponta do pé olha em frente, não para o teto'],
      err: ['Rodar a anca para trás (assim trabalha o flexor, não o glúteo)', 'Subir a perna mais alto do que a anca permite', 'Ir depressa: aqui manda o tempo sob tensão'],
      alt: [{ n: 'Com banda acima dos joelhos', por: 'quando 20 repetições deixarem de arder' }, { n: 'Amêijoa, com os joelhos dobrados', por: 'se a lombar se meter ao barulho' }],
      mol: 'É também o exercício de reabilitação do glúteo médio: se o joelho te cai para dentro a correr ou a agachar, este é o teu seguro.'
    },
    'crunch-inverso': { pat: 'flex',
      nombre: 'Crunch invertido', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Abdómen inferior'], equipo: 'Nada',
      cues: ['Deitado, mãos ao lado do corpo ou debaixo do sacro', 'Leva os joelhos ao peito ENROLANDO a bacia, não só dobrando a anca', 'A lombar descola um dedo do chão: é esse o percurso todo', 'Desce em 3″ sem deixar cair as pernas'],
      err: ['Ganhar balanço com as pernas', 'Arquear a lombar ao descer', 'Procurar amplitude levantando a anca inteira'],
      alt: [{ n: 'Elevação de pernas suspenso', por: 'quando tiveres barra' }, { n: 'Dead bug', por: 'se a lombar descolar sem controlo' }],
      mol: 'Se a lombar incomodar: mãos debaixo do sacro e corta o percurso a metade até o controlo aparecer.'
    },
    'curl-mochila': { pat: 'curl',
      nombre: 'Curl com mochila', mm: { p: ['biceps'], s: ['antebrazo'] }, zona: 'tiron', musc: ['Bicípite', 'antebraço'], equipo: 'Mochila',
      cues: ['Agarra a mochila pela pega de cima ou pelas duas alças', 'Cotovelos colados ao corpo e FIXOS', 'Sobe sem baloiçar e desce em 3″', 'Progrides metendo livros ou garrafas de água'],
      err: ['Baloiçar o tronco para subir', 'Adiantar os cotovelos na parte alta', 'Carregar tanto a mochila que a preensão falhe antes do bicípite'],
      alt: [{ n: 'Curl com toalha auto-resistido', por: 'sem mochila: um braço sobe e o outro trava' }, { n: 'Curl com halteres', por: 'quando tiveres material' }],
      mol: 'Se o punho incomodar: agarra pelas duas alças em vez da pega, que deixa o punho neutro.'
    },

    'flexion-declinada': { pat: 'eh',
      nombre: 'Flexões declinadas', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Peitoral superior', 'ombro, tricípite'], equipo: 'Nada (cadeira ou sofá)',
      cues: ['Pés na cadeira, mãos um pouco mais largas do que os ombros', 'Quanto mais altos os pés, mais peso levas em cima', 'Corpo em prancha: glúteo e abdómen apertados', 'Peito quase ao chão em cada repetição'],
      err: ['Levantar a anca em pico para aliviar', 'Cortar o percurso a meio assim que sobes os pés', 'Pescoço esticado à procura do chão'],
      alt: [{ n: 'Flexões normais', por: 'se aqui não saírem 8 limpas' }, { n: 'Com os pés mais altos', por: 'a progressão: cada palmo pesa mais' }],
      mol: 'É o degrau a seguir às flexões: passadas 15 limpas, sobe os pés em vez de contar até vinte.'
    },
    'pino-pared': { pat: 'ev',
      nombre: 'Flexão em pino contra a parede', mm: { p: ['hombro'], s: ['triceps'] }, zona: 'empuje', musc: ['Deltoides', 'tricípite'], equipo: 'Nada (parede)',
      cues: ['De costas para a parede, sobe os pés a caminhar até ficares quase vertical', 'Mãos um pouco mais largas do que os ombros, dedos abertos a agarrar o chão', 'Desce SÓ o que controlares: ao início, dois dedos', 'Corpo apertado: sem arquear a lombar'],
      err: ['Descer até ao fundo no primeiro dia: começa-se com percurso curto', 'Deixar cair a cabeça sem controlo', 'Arquear as costas para compensar'],
      alt: [{ n: 'Flexões em pica', por: 'a versão de partida, muito mais simpática' }, { n: 'Com os pés numa cadeira em vez da parede', por: 'o passo intermédio' }],
      mol: 'É a variante avançada do empurrão vertical: só se as flexões em pica te saírem a 15 limpas e o ombro não disser nada. Com incómodo no ombro, não é agora.'
    },
    'remo-mesa': { pat: 'th',
      nombre: 'Remada invertida debaixo da mesa', mm: { p: ['dorsal'], s: ['biceps', 'espalda-alta'] }, zona: 'tiron', musc: ['Grande dorsal', 'costas altas, bicípite'], equipo: 'Nada (mesa firme)',
      cues: ['Deita-te debaixo de uma mesa sólida e agarra-a pela borda', 'Corpo em prancha dos calcanhares aos ombros', 'Puxa levando o PEITO à mesa, cotovelos ao lado do corpo', 'Aperta as omoplatas 1″ em cima e desce em 3″'],
      err: ['Levar a anca à frente do peito', 'Puxar só com os braços sem juntar as omoplatas', 'Usar uma mesa que se levante: confirma antes'],
      alt: [{ n: 'Com os joelhos dobrados e os pés no chão', por: 'a versão fácil' }, { n: 'Com os pés numa cadeira', por: 'a progressão: mais horizontal, mais peso' }],
      mol: 'Esta é a puxada que carrega a sério sem barra: se tens uma mesa firme, dá-lhe preferência sobre a puxada com toalha.'
    },
    'pistol-asistida': { pat: 'rod',
      nombre: 'Agachamento a uma perna assistido', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadríceps', 'glúteo'], equipo: 'Nada (cadeira)',
      cues: ['De pé, de costas para uma cadeira, um pé no chão e o outro esticado à frente', 'Desce em 3″ até roçar a cadeira com o glúteo e sobe sem te sentares', 'Joelho alinhado com o pé, nunca a cair para dentro', 'Braços à frente fazem de contrapeso'],
      err: ['Deixares-te cair na cadeira e ressaltar', 'Joelho para dentro (é aí que se paga)', 'Calcanhar que levanta: desce menos até o tornozelo permitir'],
      alt: [{ n: 'Agachamento ao peso do corpo com as duas pernas', por: 'a versão de partida' }, { n: 'Uma cadeira mais baixa', por: 'a progressão, até ao pistol completo' }],
      mol: 'Se o joelho incomodar: sobe a altura da cadeira e trava a descida. É progressão de agachamento, não um salto no escuro: 8 limpas com as duas pernas antes de tentares a uma.'
    },
    'curl-toalla': { pat: 'curl',
      nombre: 'Curl com toalha auto-resistido', mm: { p: ['biceps'], s: ['antebrazo'] }, zona: 'tiron', musc: ['Bicípite', 'antebraço'], equipo: 'Toalha',
      cues: ['Um pé pisa uma ponta da toalha, a mão sobe pela outra', 'O braço livre pode puxar para baixo para pôr mais resistência', 'Cotovelo colado ao corpo e fixo', 'Sobe em 2″, desce em 3″ sem largar a tensão'],
      err: ['Largar a tensão em cima ou em baixo', 'Baloiçar o tronco', 'Pôr tanta resistência que o movimento trave a meio'],
      alt: [{ n: 'Curl com mochila', por: 'mais mensurável: podes pesar o que lá metes' }, { n: 'Curl com halteres', por: 'quando tiveres material' }],
      mol: 'Sem nada em casa é o substituto do curl: não se mede em quilos, mede-se em quanto aguentas a descida.'
    },

    'zancada-bulgara-pc': { pat: 'zan',
      nombre: 'Afundo búlgaro ao peso do corpo', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadríceps', 'glúteo'], equipo: 'Nada (cadeira)',
      cues: ['Peito do pé de trás na cadeira, o da frente a uma passada larga', 'Desce a direito, joelho de trás na direção do chão', 'O peso vive no calcanhar da frente', 'Desce em 3″ e sobe sem ressaltar'],
      err: ['Pôr o pé da frente demasiado perto (o joelho vai à frente e paga)', 'Inclinares-te para a frente para chegar', 'Ressaltar em baixo com o joelho de trás'],
      alt: [{ n: 'Afundo alternado no sítio', por: 'a versão de partida' }, { n: 'Com uma mochila carregada', por: 'a progressão quando 12 saírem fáceis' }],
      mol: 'Se o joelho incomodar: afasta um palmo o pé da frente e desce menos. É das que mais perna dão sem material, mas pede equilíbrio: agarra-te a uma parede das primeiras vezes.'
    },
    'puente-1p': { pat: 'bis',
      nombre: 'Ponte de glúteo a uma perna', mm: { p: ['gluteo'], s: ['isquios'] }, zona: 'pierna', musc: ['Grande glúteo', 'isquiotibiais'], equipo: 'Nada',
      cues: ['Deitado, um pé apoiado e a outra perna esticada à frente', 'Sobe a empurrar com o CALCANHAR até alinhar anca e coxa', 'Aperta o glúteo 2″ em cima, sem arquear a lombar', 'Desce em 3″ sem apoiar por completo'],
      err: ['Subir a arquear as costas em vez de apertar o glúteo', 'Anca que cai para um lado', 'Apoiar o pé tão longe que passa a trabalhar o isquiotibial'],
      alt: [{ n: 'Ponte com os dois pés', por: 'a versão de partida' }, { n: 'Com os ombros no sofá', por: 'mais percurso, mais glúteo' }],
      mol: 'Se a lombar se meter: aproxima o calcanhar do glúteo e sobe menos. A anca não deve rodar: se cai para um lado, volta a duas pernas.'
    },
    'elev-piernas-suelo': { pat: 'flex',
      nombre: 'Elevação de pernas deitado', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Abdómen inferior'], equipo: 'Nada',
      cues: ['Deitado, mãos debaixo do sacro e lombar COLADA ao chão', 'Sobe as pernas esticadas até à vertical', 'Desce em 3″ e para onde a lombar começar a descolar', 'Esse ponto é o teu percurso: vai descendo cada semana'],
      err: ['Deixar a lombar arquear ao descer (o erro que lesiona)', 'Ganhar balanço com as pernas', 'Descer mais do que o abdómen aguenta'],
      alt: [{ n: 'Crunch invertido', por: 'a versão de partida' }, { n: 'Elevação de pernas suspenso', por: 'quando tiveres barra' }],
      mol: 'É a progressão do crunch invertido: se a lombar descolar, dobra um pouco os joelhos e corta o percurso até aguentar.'
    },
    'elev-talon-1p': { pat: 'gem',
      nombre: 'Elevação de calcanhar a uma perna', mm: { p: ['gemelos'], s: [] }, zona: 'pierna', musc: ['Gémeo e solear'], equipo: 'Nada (degrau)',
      cues: ['Meia planta na borda de um degrau, a outra perna recolhida', 'Desce o calcanhar o máximo que der e aguenta 1″ em baixo', 'Sobe na vertical, pausa de 1″ em cima: sem ressaltos', 'Apoia-te na parede só para o equilíbrio'],
      err: ['Ressaltar a aproveitar o reflexo do tendão: tira exatamente o estímulo que queremos', 'Meio percurso', 'Descarregar o peso na mão que se apoia'],
      alt: [{ n: 'Elevação de calcanhares a duas pernas', por: 'a versão de partida' }, { n: 'Com uma mochila carregada', por: 'quando 20 por perna saírem fáceis' }],
      mol: 'Se o Aquiles incomodar: só isométricos em cima, 3×30″ nessa semana. Este é o seguro do tendão para a corrida: não o saltes.'
    },
    'plancha-lateral': { pat: 'core',
      nombre: 'Prancha lateral', mm: { p: ['abdomen'], s: ['gluteo'] }, zona: 'core', musc: ['Oblíquos', 'glúteo médio'], equipo: 'Nada',
      cues: ['Cotovelo debaixo do ombro, corpo alinhado do tornozelo à cabeça', 'Sobe a anca e MANTÉM-NA: o chão não lhe toca', 'Ombro longe da orelha', 'Aguenta o tempo marcado de cada lado'],
      err: ['Anca a ceder (o oblíquo deixa de trabalhar)', 'Rodar o peito na direção do chão', 'Prender a respiração'],
      alt: [{ n: 'Com os joelhos apoiados', por: 'a versão de partida' }, { n: 'Com a perna de cima elevada', por: 'a progressão, que ainda pede glúteo médio' }],
      mol: 'Se o ombro incomodar: apoia na mão com o braço esticado, ou fá-la de joelhos. É a metade lateral da prancha: o core não aguenta só de frente.'
    },

    'elev-y-suelo': { pat: 'ais',
      nombre: 'Elevação em Y de barriga para baixo', mm: { p: ['hombro'], s: ['espalda-alta'] }, zona: 'empuje', musc: ['Ombro (coifa)', 'trapézio inferior'], equipo: 'Nada',
      cues: ['De barriga para baixo, braços esticados a formar um Y com os polegares para o teto', 'Sobe os braços SEM encolher os ombros: o pescoço fica comprido', 'Aguenta 2″ em cima e desce em 3″', 'A testa não descola: o movimento é de omoplata, não de pescoço'],
      err: ['Encolher os ombros na direção das orelhas', 'Levantar a cabeça para ajudar', 'Ir depressa: aqui não há peso, o estímulo é o controlo'],
      alt: [{ n: 'Rotação externa com banda', por: 'quando tiveres banda' }, { n: 'Com uma garrafa pequena em cada mão', por: 'a progressão: pesa pouco e nota-se' }],
      mol: 'É o exercício de ombro do protocolo do tendão, sem material: a coifa não ganha com peso, ganha com controlo. Se o ombro incomodar, este é dos poucos que costuma assentar bem.'
    },
    'curl-nordico': { pat: 'ais',
      nombre: 'Curl nórdico assistido', mm: { p: ['isquios'], s: [] }, zona: 'pierna', musc: ['Isquiotibiais'], equipo: 'Nada (algo que segure os tornozelos)',
      cues: ['De joelhos sobre algo macio, tornozelos presos debaixo de um móvel firme', 'Desce MUITO devagar mantendo anca e ombros em linha', 'Aguenta até onde conseguires e amortece com as mãos', 'Volta a empurrar-te com os braços: a subida não conta'],
      err: ['Dobrar a anca para facilitar (o isquiotibial deixa de trabalhar)', 'Deixares-te cair sem travar', 'Começar pelo percurso completo: ganha-se centímetro a centímetro'],
      alt: [{ n: 'Ponte de glúteo a uma perna', por: 'se o nórdico ainda ficar grande' }, { n: 'Curl femoral na máquina', por: 'no ginásio' }],
      mol: 'É o trabalho de isquiotibiais mais potente sem material, e também o que deixa mais dores: começa com 3 repetições e sobe uma de cada vez. Se o joelho incomodar, põe uma toalha dobrada por baixo.'
    },
    'encogimiento-mochila': { pat: 'ais',
      nombre: 'Encolhimentos com mochila', mm: { p: ['espalda-alta'], s: ['antebrazo'] }, zona: 'tiron', musc: ['Trapézio superior'], equipo: 'Mochila',
      cues: ['Mochila pendurada nas duas mãos ou abraçada ao peito', 'Sobe os ombros A DIREITO na direção das orelhas, sem os rodar', 'Aperta 2″ em cima e desce a controlar', 'Pescoço relaxado: não empurres o queixo para a frente'],
      err: ['Rodar os ombros para trás (não acrescenta nada e carrega o pescoço)', 'Usar impulso das pernas', 'Meio percurso'],
      alt: [{ n: 'Encolhimentos com halteres', por: 'quando tiveres material' }, { n: 'Com a mochila mais carregada', por: 'a progressão: aqui podes pesar o que lá metes' }],
      mol: 'Se sentires tensão no pescoço: baixa a carga e sobe menos. O trapézio superior já trabalha bastante no dia a dia; duas séries bem feitas chegam.'
    },

    /* — Ginásio: empurrar — */
    'press-banca': { pat: 'eh',
      nombre: 'Supino', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Peitoral', 'tríceps, deltoide anterior'], equipo: 'Barra + banco',
      cues: ['Omoplatas retraídas e CRAVADAS no banco, pés firmes no chão', 'Pega: antebraço vertical quando a barra toca no peito', 'A barra desce ao peito médio, cotovelos ~45°', 'Toca o peito com controlo e empurra numa linha ligeiramente diagonal'],
      err: ['Ombros que encolhem ao empurrar (perdes a retração)', 'Fazer a barra ressaltar no peito', 'Rabo levantado do banco', 'Punhos dobrados para trás'],
      alt: [{ n: 'Supino em máquina (chest press)', por: 'dias sem paciência para montar banco ou ginásio cheio' }, { n: 'Supino com halteres plano', por: 'mais amplitude e menos ombro' }],
      mol: 'Se o ombro incomodar: experimenta pega um pouco mais fechada e cotovelos mais colados; se continuar, halteres com pega neutra.'
    },
    'press-inclinado-mc': { pat: 'eh',
      nombre: 'Supino inclinado com halteres', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Peitoral superior', 'ombro, tríceps'], equipo: 'Halteres + banco 30°',
      cues: ['Banco a 30° (um ponto, não a parede)', 'Desce até sentires alongamento no peitoral', 'Cotovelos a 45-60°, punhos neutros', 'Sobe sem bater os halteres em cima'],
      err: ['Banco demasiado vertical (vira supino de ombro)', 'Ressaltar em baixo', 'Arquear a lombar de forma exagerada'],
      alt: [{ n: 'Supino inclinado no multipower', por: 'se o ginásio está cheio ou queres estabilidade' }, { n: 'Supino inclinado com barra', por: 'já programado no Push B da F4' }],
      mol: 'Se o ombro incomodar: reduz 5 cm de amplitude em baixo e roda ligeiramente as palmas para dentro.'
    },
    'press-inclinado-barra': { pat: 'eh',
      nombre: 'Supino inclinado com barra', mm: { p: ['pecho'], s: ['hombro', 'triceps'] }, zona: 'empuje', musc: ['Peitoral superior', 'ombro, tríceps'], equipo: 'Barra + banco inclinado',
      cues: ['Banco 30-45°, omoplatas cravadas', 'A barra desce à parte alta do peito (clavículas)', 'Antebraços verticais ao tocar'],
      err: ['Descer a barra ao peito médio (obriga-te a abrir cotovelos)', 'Ressaltar'],
      alt: [{ n: 'Multipower inclinado', por: 'mesma sessão, mais guia' }, { n: 'Halteres inclinado', por: 'se não há banco de inclinado com suportes' }],
      mol: 'Se o ombro incomodar: volta aos halteres, que permitem rodar a pega.'
    },
    'press-plano-mc': { pat: 'eh',
      nombre: 'Supino plano com halteres', mm: { p: ['pecho'], s: ['triceps'] }, zona: 'empuje', musc: ['Peitoral', 'tríceps'], equipo: 'Halteres + banco',
      cues: ['Mais amplitude do que a barra: aproveita-a em baixo com controlo', 'Sobe em arco, sem bater em cima', 'Pés firmes, omoplatas atrás'],
      err: ['Deixar cair os halteres em baixo sem travar', 'Transformá-lo em supino de ombro abrindo demasiado os cotovelos'],
      alt: [{ n: 'Máquina de supino', por: 'fadiga alta ou sem banco livre' }],
      mol: 'Se o ombro incomodar: pega neutra (palmas frente a frente).'
    },
    'press-militar': { pat: 'ev',
      nombre: 'Press militar', mm: { p: ['hombro'], s: ['triceps', 'abdomen'] }, zona: 'empuje', musc: ['Ombro', 'tríceps, core'], equipo: 'Barra (de pé ou sentado)',
      cues: ['De pé: glúteo e abdómen APERTADOS antes de empurrar', 'A barra sai do queixo e sobe colada à cara', 'A cabeça «atravessa a janela» no fim', 'Sentado com encosto: sem arquear a lombar'],
      err: ['Arquear a lombar transformando-o em supino inclinado', 'Empurrar a barra para a frente (bate no queixo)', 'Amplitude incompleta em cima'],
      alt: [{ n: 'Press militar com halteres sentado', por: 'já programado na F2; mais simpático para o ombro' }, { n: 'Press em máquina de ombro', por: 'última sessão da semana com fadiga' }],
      mol: 'Se o ombro incomodar: halteres com pega neutra e sobe só até onde não haja pinçamento.'
    },
    'press-militar-mc': { pat: 'ev',
      nombre: 'Press militar com halteres sentado', mm: { p: ['hombro'], s: ['triceps'] }, zona: 'empuje', musc: ['Ombro', 'tríceps'], equipo: 'Halteres + banco com encosto',
      cues: ['Encosto alto, lombar apoiada sem arquear', 'Cotovelos ligeiramente à frente do corpo, não em cruz', 'Percurso completo sem bater em cima'],
      err: ['Arquear a lombar descolando-a do encosto', 'Descer só até às orelhas'],
      alt: [{ n: 'Máquina de press de ombro', por: 'equivalente direto' }],
      mol: 'Se o ombro incomodar: pega neutra e desce só até 90° de cotovelo.'
    },
    'elev-laterales': { pat: 'ev',
      nombre: 'Elevações laterais', mm: { p: ['hombro'], s: [] }, zona: 'empuje', musc: ['Deltoide lateral'], equipo: 'Halteres',
      cues: ['Peso LEVE, cotovelos ligeiramente fletidos', 'Sobe até à horizontal, como quem serve dois jarros', 'Sem impulso: se balanças, sobra peso', 'Desce em 2″'],
      err: ['Subir com o trapézio encolhendo os ombros', 'Passar da horizontal', 'Balanço de anca'],
      alt: [{ n: 'Laterais na polia baixa', por: 'tensão contínua; programadas no Push B' }, { n: 'Máquina de laterais', por: 'para acabar sem pensar na técnica' }],
      mol: 'Se o ombro incomodar: polegar ligeiramente para cima e sobe 10° à frente do plano lateral.'
    },
    'laterales-polea': { pat: 'ev',
      nombre: 'Elevações laterais na polia', mm: { p: ['hombro'], s: [] }, zona: 'empuje', musc: ['Deltoide lateral'], equipo: 'Polia baixa',
      cues: ['Polia à altura do punho com o braço em baixo', 'Corpo estável, sobe até à horizontal', 'A polia mantém tensão também em baixo: aproveita-a'],
      err: ['Ficar demasiado longe da polia', 'Puxar com o trapézio'],
      alt: [{ n: 'Halteres', por: 'se as polias estiverem ocupadas' }],
      mol: 'Tal como com halteres: polegar para cima e plano ligeiramente adiantado.'
    },
    'fondos': { pat: 'ev', pic: 'fondos',
      nombre: 'Paralelas assistidas', mm: { p: ['pecho'], s: ['triceps'] }, zona: 'empuje', musc: ['Peitoral inferior', 'tríceps'], equipo: 'Máquina de paralelas assistidas ou elásticos',
      cues: ['Corpo ligeiramente inclinado à frente (mais peito)', 'Desce até 90° de cotovelo, não mais se o ombro protestar', 'Cotovelos que não abram em cruz'],
      err: ['Descer demasiado fundo', 'Ombros encolhidos para as orelhas'],
      alt: [{ n: 'Supino declinado ou paralelas entre bancos', por: 'se não há máquina assistida' }],
      mol: 'Se o esterno ou o ombro incomodarem: substitui por supino plano com halteres.'
    },
    'ext-triceps-polea': { pat: 'ext',
      nombre: 'Extensão de tríceps na polia', mm: { p: ['triceps'], s: [] }, zona: 'empuje', musc: ['Tríceps'], equipo: 'Polia alta + corda ou barra',
      cues: ['Cotovelos colados ao corpo, FIXOS', 'Só se move o antebraço', 'Estende por completo e aperta 1″'],
      err: ['Cotovelos que se adiantam ao descer (metes ombro)', 'Balanço do tronco'],
      alt: [{ n: 'Com corda a separar em baixo', por: 'um pouco mais de cabeça longa' }, { n: 'Coice de tríceps com haltere', por: 'sem polia livre' }],
      mol: 'Se o cotovelo incomodar: baixa o peso e sobe as reps a 15-20; o cotovelo detesta o ego.'
    },
    'ext-triceps-cabeza': { pat: 'ext',
      nombre: 'Extensão acima da cabeça (corda)', mm: { p: ['triceps'], s: [] }, zona: 'empuje', musc: ['Tríceps (cabeça longa)'], equipo: 'Polia + corda',
      cues: ['De costas para a polia, corda atrás da nuca', 'Cotovelos a apontar em frente, estende em cima', 'Alongamento real em baixo: é aí que cresce a cabeça longa'],
      err: ['Abrir os cotovelos em cruz', 'Amplitude curta por excesso de peso'],
      alt: [{ n: 'Francês com barra W', por: 'mesmo padrão deitado' }],
      mol: 'Se o cotovelo incomodar: igual à polia normal — menos peso, mais reps.'
    },
    'press-frances': { pat: 'ext',
      nombre: 'Francês', mm: { p: ['triceps'], s: [] }, zona: 'empuje', musc: ['Tríceps (cabeça longa)'], equipo: 'Barra W + banco',
      cues: ['Deitado, barra desce à testa ou um pouco atrás', 'Cotovelos a apontar ao teto, parados', 'Desce em 2-3″, estende sem bloquear com pancada'],
      err: ['Cotovelos que abrem', 'Transformá-lo em supino fechado mexendo o ombro'],
      alt: [{ n: 'Extensão acima da cabeça na polia', por: 'mais tensão contínua, menos stress de cotovelo' }],
      mol: 'Se o cotovelo incomodar: troca-o diretamente por extensões na polia a 15 reps.'
    },

    /* — Ginásio: puxar — */
    'remo-barra': { pat: 'th',
      nombre: 'Remada com barra', mm: { p: ['dorsal'], s: ['biceps', 'espalda-alta'] }, zona: 'tiron', musc: ['Dorsal', 'costas médias, bíceps'], equipo: 'Barra',
      cues: ['Tronco a ~45°, joelhos semifletidos', 'Puxa a barra ao abdómen baixo', 'Omoplatas atrás e para baixo no fim', 'Costas NEUTRAS, inegociável'],
      err: ['Dar puxões com a lombar (balanças)', 'Tronco que se levanta rep a rep', 'Puxar ao peito com cotovelos abertos'],
      alt: [{ n: 'Remada em T (T-bar)', por: 'variante mais estável' }, { n: 'Remada em máquina com apoio de peito', por: 'se a lombar vem carregada do dia de perna' }],
      mol: 'Se a lombar protestar: máquina com apoio de peito ou remada na polia, sem hesitar.'
    },
    'remo-polea': { pat: 'th',
      nombre: 'Remada na polia sentado', mm: { p: ['espalda-alta'], s: ['biceps', 'dorsal'] }, zona: 'tiron', musc: ['Costas médias', 'dorsal, bíceps'], equipo: 'Polia baixa + triângulo',
      cues: ['Peito alto e FIXO: o tronco não viaja', 'Puxa o triângulo ao umbigo', 'Pausa de 1″ a apertar omoplatas'],
      err: ['Balançar o tronco para mover mais peso', 'Ombros encolhidos'],
      alt: [{ n: 'Remada em máquina', por: 'equivalente direto' }],
      mol: 'Se a lombar incomodar: apoia o peito numa máquina de remada com suporte.'
    },
    'remo-mancuerna': { pat: 'th',
      nombre: 'Remada com haltere a 1 braço', mm: { p: ['dorsal'], s: ['espalda-alta'] }, zona: 'tiron', musc: ['Dorsal', 'costas médias'], equipo: 'Haltere + banco',
      cues: ['Joelho e mão no banco, costas neutras', 'Puxa o cotovelo à anca, não ao ombro', 'Sem rodar o tronco ao subir'],
      err: ['Encolher o ombro no início da puxada', 'Rodar o tronco para «ajudar»', 'Amplitude curta'],
      alt: [{ n: 'Remada na polia a 1 braço', por: 'tensão mais constante' }],
      mol: 'Sem bom apoio incomoda a lombar: usa banco inclinado e apoia o peito.'
    },
    'jalon-pecho': { pat: 'tv',
      nombre: 'Puxada ao peito', mm: { p: ['dorsal'], s: ['biceps'] }, zona: 'tiron', musc: ['Dorsal', 'bíceps'], equipo: 'Polia alta',
      cues: ['Pega um pouco mais larga do que os ombros', 'Peito em cima, ligeira inclinação atrás FIXA', 'Puxa os COTOVELOS para os bolsos', 'Barra à clavícula, 1″ de pausa'],
      err: ['Balançar para dar o puxão', 'Puxar com os braços sem deprimir as omoplatas', 'Barra atrás da nuca (não)'],
      alt: [{ n: 'Elevações assistidas', por: 'o objetivo da F3 é migrar para elas' }, { n: 'Puxada com pega fechada', por: 'programada no Pull B' }],
      mol: 'Se o ombro incomodar: pega neutra (triângulo largo) e baixa o peso.'
    },
    'jalon-estrecho': { pat: 'tv',
      nombre: 'Puxada com pega fechada', mm: { p: ['dorsal'], s: ['biceps'] }, zona: 'tiron', musc: ['Dorsal', 'bíceps'], equipo: 'Polia alta + triângulo',
      cues: ['Triângulo ou pega supinada à largura dos ombros', 'Cotovelos colados que descem ao lado', 'Estica por completo em cima: o dorsal trabalha longo'],
      err: ['Transformá-lo em remada inclinando-te demasiado', 'Meia repetição em cima'],
      alt: [{ n: 'Elevações supinadas assistidas', por: 'equivalente com peso do corpo' }],
      mol: 'Se o cotovelo incomodar: pega neutra e punhos direitos.'
    },
    'dominadas': { pat: 'tv',
      nombre: 'Elevações (assistidas → livres → com lastro)', mm: { p: ['dorsal'], s: ['biceps', 'abdomen'] }, zona: 'tiron', musc: ['Dorsal', 'bíceps, core'], equipo: 'Barra + máquina assistida ou elásticos',
      cues: ['Começa a deprimir as omoplatas (ombros longe das orelhas)', 'Puxa os cotovelos para baixo, queixo acima da barra', 'Desce a CONTROLAR até aos braços quase esticados', 'Reduz a assistência semana a semana: saem antes do que pensas'],
      err: ['Pernear e dar impulso', 'Meia elevação (nem em cima nem em baixo)', 'Pendurar-te nos ombros em baixo sem tensão escapular'],
      alt: [{ n: 'Puxada ao peito pronada pesada', por: 'se não há máquina assistida nesse dia' }, { n: 'Elevações negativas (salto + descida de 5″)', por: 'grande construtor da primeira elevação' }],
      mol: 'Se o cotovelo incomodar: pega neutra. Se o ombro incomodar: não te penduires passivo em baixo.',
      hito: 'dominada-libre'
    },
    'pullover-polea': { pat: 'tv',
      nombre: 'Pullover na polia', mm: { p: ['dorsal'], s: [] }, zona: 'tiron', musc: ['Dorsal (isolado)'], equipo: 'Polia alta + barra ou corda',
      cues: ['Braços quase esticados, dobradiça só no ombro', 'Leva a barra à coxa desenhando um arco', 'Alongamento em cima, aperto em baixo'],
      err: ['Dobrar os cotovelos (vira extensão de tríceps)', 'Balançar o tronco'],
      alt: [{ n: 'Pullover com haltere no banco', por: 'sem polia livre' }],
      mol: 'Se o ombro incomodar: reduz o arco em cima.'
    },
    'face-pull': { pat: 'tv',
      nombre: 'Face pull', mm: { p: ['hombro'], s: ['espalda-alta'] }, zona: 'tiron', musc: ['Deltoide posterior', 'rotadores, trapézio médio'], equipo: 'Polia alta + corda',
      cues: ['Polia à altura da cara', 'Puxa a corda PARA A TESTA separando as pontas', 'No fim, roda os ombros para fora (bíceps a apontar ao teto)', 'Leve e perfeito: isto é saúde de ombro, não ego'],
      err: ['Transformá-lo em remada alta com peso', 'Sem rotação externa final'],
      alt: [{ n: 'Aberturas invertidas em máquina (reverse pec-deck)', por: 'deltoide posterior sem corda' }, { n: 'Rotação externa com elástico', por: 'em casa ou como extra' }],
      mol: 'É o exercício que arranja ombros; se incomodar, baixa o peso e confirma que puxas à testa, não ao pescoço.'
    },
    'encogimientos': { pat: 'ais',
      nombre: 'Encolhimentos com halteres', mm: { p: ['espalda-alta'], s: [] }, zona: 'tiron', musc: ['Trapézio superior'], equipo: 'Halteres',
      cues: ['Ombros às orelhas, pausa de 1″ em cima', 'Braços como cordas: não dobres os cotovelos', 'Desce controlado e alonga'],
      err: ['Rodar os ombros em círculo (não acrescenta e roça)', 'Ressaltar com as pernas'],
      alt: [{ n: 'Com barra', por: 'mais carga total' }],
      mol: 'Se o pescoço incomodar: olha em frente e não metas o queixo.'
    },

    /* — Ginásio: perna/anca — */
    'sentadilla-barra': { pat: 'rod',
      nombre: 'Agachamento com barra', mm: { p: ['cuadriceps'], s: ['abdomen', 'gluteo'] }, zona: 'pierna', musc: ['Quadríceps', 'glúteo, core'], equipo: 'Barra + rack',
      cues: ['Barra sobre o trapézio, não sobre as cervicais', 'Core pressurizado ANTES de descer (mete ar no peito-abdómen)', 'Desce ao paralelo, joelhos para fora', 'Empurra o chão, peito alto ao subir'],
      err: ['Calcanhares que se levantam (culpa dos tornozelos: eleva-os com discos se for preciso)', 'Joelhos que colapsam para dentro ao subir', 'Bom dia: a anca sobe antes do peito'],
      alt: [{ n: 'Agachamento no multipower', por: 'dias de fadiga ou rack ocupado' }, { n: 'Hack squat / prensa', por: 'estímulo de quadríceps sem carga axial' }, { n: 'Agachamento goblet com haltere', por: 'como aquecimento ou se a técnica se perde' }],
      mol: 'Se o joelho incomodar: sobe o tempo de descida (3″) e fica 5 cm acima do ponto incómodo. Se a lombar incomodar: revê a pressurização e baixa 20% o peso durante uma semana.'
    },
    'prensa': { pat: 'rod',
      nombre: 'Prensa', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadríceps', 'glúteo'], equipo: 'Máquina de prensa',
      cues: ['Pés a meia altura da plataforma, à largura dos ombros', 'Desce até 90° SEM descolar a lombar do encosto', 'Empurra com toda a planta, não bloqueies os joelhos de repente'],
      err: ['Descer tanto que a bacia roda (butt wink na prensa = lombar)', 'Mãos a empurrar os joelhos'],
      alt: [{ n: 'Hack squat', por: 'ainda mais quadríceps' }, { n: 'Prensa a uma perna', por: 'se houver descompensação' }],
      mol: 'Se o joelho incomodar: pés um pouco mais altos na plataforma (mais glúteo, menos joelho).'
    },
    'rdl-barra': { pat: 'bis',
      nombre: 'Peso morto romeno', mm: { p: ['isquios'], s: ['gluteo', 'lumbar'] }, zona: 'pierna', musc: ['Isquiotibiais', 'glúteo, lombar isométrico'], equipo: 'Barra',
      cues: ['Anca ATRÁS, joelhos semifletidos fixos', 'Barra colada às pernas toda a viagem', 'Costas neutras: peito orgulhoso', 'Desce até sentires o alongamento forte do isquiotibial e sobe a apertar o glúteo'],
      err: ['Arredondar as costas para descer mais', 'Dobrar joelhos e transformá-lo em meio agachamento', 'Barra que se afasta do corpo'],
      alt: [{ n: 'RDL com halteres', por: 'pega mais confortável nas primeiras semanas' }, { n: 'Hiperextensões a 45° com carga', por: 'isquiotibial-glúteo sem carga de preensão' }],
      mol: 'O alongamento do isquiotibial é o sinal de que o estás a fazer BEM. Se a lombar incomodar (não o isquiotibial): baixa 20% e grava uma série de lado.'
    },
    'hip-thrust': { pat: 'bis',
      nombre: 'Hip thrust', mm: { p: ['gluteo'], s: ['isquios'] }, zona: 'pierna', musc: ['Glúteo', 'isquiotibiais'], equipo: 'Barra + banco (+ proteção)',
      cues: ['Costas altas apoiadas no banco, barra sobre a anca com proteção', 'Queixo ao peito, olhar em frente-abaixo', 'Sobe até à horizontal EXATA, pausa de 1″ a apertar', 'Joelhos a 90° em cima, calcanhares sob os joelhos'],
      err: ['Arquear a lombar em cima (hiperextensão)', 'Empurrar com a ponta dos pés', 'Ressaltar em baixo sem pausa'],
      alt: [{ n: 'Máquina de hip thrust', por: 'se o ginásio a tiver, montagem muito mais rápida' }, { n: 'Ponte com barra no chão', por: 'sem banco livre' }],
      mol: 'Se a lombar incomodar: é quase sempre hiperextensão em cima; para na horizontal.'
    },
    'zancada-mc': { pat: 'zan',
      nombre: 'Afundo com halteres', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadríceps', 'glúteo'], equipo: 'Halteres',
      cues: ['Mesma técnica de casa, agora com 6-10 kg por mão', 'Passo amplo, tronco vertical, joelho de trás roça o chão', 'Os halteres pendem colados ao corpo, ombros atrás', 'Empurra com o calcanhar da frente para voltar'],
      err: ['Passo curto que colapsa o joelho da frente', 'Inclinar-te à frente ao cansares-te', 'Olhar para o chão e perder a linha'],
      alt: [{ n: 'Afundo atrás com halteres', por: 'mais simpático para o joelho' }, { n: 'Afundo no multipower', por: 'se o equilíbrio limita a carga' }],
      mol: 'Se o joelho incomodar: passo mais longo e muda para afundo atrás.'
    },
    'zancada-bulgara': { pat: 'zan',
      nombre: 'Afundo búlgaro', mm: { p: ['cuadriceps'], s: ['gluteo'] }, zona: 'pierna', musc: ['Quadríceps', 'glúteo'], equipo: 'Banco + halteres',
      cues: ['Pé de trás no banco, o da frente a um passo largo', 'Desce a VERTICAL: o joelho de trás procura o chão', 'Tronco ligeiramente inclinado = mais glúteo; vertical = mais quadríceps', 'Começa SÓ com o peso do corpo, a sério'],
      err: ['Pé da frente demasiado perto (o joelho sofre)', 'Ressaltar em baixo', 'Perder o equilíbrio por olhar para o teto'],
      alt: [{ n: 'Afundo estático com halteres', por: 'se o equilíbrio ainda não está lá' }, { n: 'Prensa a uma perna', por: 'unilateral sem equilíbrio' }],
      mol: 'Se o joelho da frente incomodar: alarga o passo e desloca o tronco um pouco à frente.'
    },
    'ext-cuadriceps': { pat: 'rod',
      nombre: 'Extensão de quadríceps', mm: { p: ['cuadriceps'], s: [] }, zona: 'pierna', musc: ['Quadríceps (isolado)'], equipo: 'Máquina',
      cues: ['Joelho alinhado com o eixo da máquina', 'Estende por completo com pausa de 1″ em cima', 'Desce em 2-3″'],
      err: ['Dar pontapés com impulso', 'Rabo que se descola do assento'],
      alt: [{ n: 'Sissy squat assistido', por: 'sem máquina' }],
      mol: 'Se a rótula incomodar: corta o último terço EM CIMA, não em baixo, e tempo mais lento. É também o teu exercício de reabilitação se um dia o joelho protestar da corrida.'
    },
    'curl-femoral-tumbado': { pat: 'ais',
      nombre: 'Curl femoral deitado', mm: { p: ['isquios'], s: [] }, zona: 'pierna', musc: ['Isquiotibiais (isolado)'], equipo: 'Máquina',
      cues: ['Anca COLADA ao banco o tempo todo', 'Sobe em 1″, desce em 2-3″', 'Ponta do pé neutra'],
      err: ['Levantar a anca para ajudar', 'Meia repetição'],
      alt: [{ n: 'Curl femoral sentado', por: 'até é um pouco melhor para o isquiotibial; usa-o se estiver livre' }, { n: 'Curl nórdico assistido', por: 'versão avançada, mais para a frente' }],
      mol: 'Se houver cãibra: alonga o isquiotibial entre séries, é normal nas primeiras semanas.'
    },
    'curl-femoral-sentado': { pat: 'ais',
      nombre: 'Curl femoral sentado', mm: { p: ['isquios'], s: [] }, zona: 'pierna', musc: ['Isquiotibiais (isolado)'], equipo: 'Máquina',
      cues: ['Coxa bem fixada pela almofada', 'Flete por completo, pausa de 1″', 'Volta devagar a resistir'],
      err: ['Rabo que desliza para a frente', 'Amplitude curta por excesso de peso'],
      alt: [{ n: 'Curl femoral deitado', por: 'equivalente' }],
      mol: 'Sem incidentes típicos: é dos mais seguros do plano.'
    },
    'gemelo-pie': { pat: 'gem',
      nombre: 'Gémeo de pé', mm: { p: ['gemelos'], s: [] }, zona: 'pierna', musc: ['Gémeo (gastrocnémio)'], equipo: 'Máquina ou multipower + degrau',
      cues: ['Pausa de 1″ EM CIMA e 1″ EM BAIXO: sem ressalto', 'Alongamento completo em baixo', 'Sobe vertical, sem dobrar joelhos'],
      err: ['Ressaltar aproveitando o reflexo do tendão (tira o estímulo exato ao tecido que queremos preparar)', 'Amplitude média'],
      alt: [{ n: 'Na prensa', por: 'sem máquina específica' }],
      mol: 'Se o Aquiles incomodar: só isométricos em cima 3×30″ nessa semana.'
    },
    'gemelo-sentado': { pat: 'gem',
      nombre: 'Gémeo sentado', mm: { p: ['gemelos'], s: [] }, zona: 'pierna', musc: ['Solear'], equipo: 'Máquina',
      cues: ['Joelho a 90°: aqui trabalha o solear, chave para CORRER', 'Mesma regra: pausa em cima e em baixo, sem ressaltos'],
      err: ['Ir depressa aos ressaltos', 'Apoiar na ponta dos dedos (melhor na base)'],
      alt: [{ n: 'Sentado com halteres sobre os joelhos + degrau', por: 'sem máquina' }],
      mol: 'Tal como o de pé: desconforto no Aquiles = só isométricos durante uma semana.'
    },
    'elev-piernas': { pat: 'flex',
      nombre: 'Elevação de pernas suspenso', mm: { p: ['abdomen'], s: ['antebrazo'] }, zona: 'core', musc: ['Abdómen inferior', 'flexores, preensão'], equipo: 'Barra de elevações',
      cues: ['Pendura-te ativo (ombros longe das orelhas)', 'Sobe os joelhos ao peito SEM balanço', 'Desce controlado por completo'],
      err: ['Baloiçar', 'Puxar só com os flexores da anca e a lombar arqueada'],
      alt: [{ n: 'Nas paralelas (apoio de cotovelos)', por: 'se a preensão falha antes do abdómen' }, { n: 'Elevações deitado', por: 'versão inicial' }],
      mol: 'Se o ombro incomodar suspenso: usa diretamente as paralelas.'
    },
    'rueda-abdominal': { pat: 'flex',
      nombre: 'Roda abdominal', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Core anterior completo'], equipo: 'Ab wheel',
      cues: ['De joelhos, bacia em retroversão ANTES de sair', 'Roda até onde controles a lombar', 'Volta a puxar com o abdómen, não com os braços'],
      err: ['Arquear a lombar ao estender (o erro que lesiona)', 'Ir mais longe do que o core aguenta'],
      alt: [{ n: 'Crunch na polia', por: 'se a roda ficar grande hoje' }, { n: 'Prancha com carga', por: 'isométrico equivalente' }],
      mol: 'Se a lombar incomodar: corta o percurso a metade e ganha amplitude semana a semana.'
    },
    'crunch-polea': { pat: 'flex',
      nombre: 'Crunch na polia', mm: { p: ['abdomen'], s: [] }, zona: 'core', musc: ['Reto abdominal'], equipo: 'Polia alta + corda',
      cues: ['De joelhos, corda ao lado da cabeça', 'Flete A PARTIR DAS COSTELAS, não da anca', 'Cotovelos aos joelhos, expira ao descer'],
      err: ['Puxar com os braços', 'Sentar-te para trás mexendo só a anca'],
      alt: [{ n: 'Crunch em máquina', por: 'equivalente' }, { n: 'Roda abdominal', por: 'quando quiseres subir de nível' }],
      mol: 'Sem incidentes típicos se fletires a partir das costelas.'
    },

    'fondos-silla': { pat: 'ext', pic: 'fondos',
      nombre: 'Dips na cadeira', mm: { p: ['triceps'], s: ['pecho', 'hombro'] }, zona: 'empuje', musc: ['Tricípite', 'peito baixo, ombro'], equipo: 'Nada (cadeira ou sofá)',
      cues: ['Mãos na borda da cadeira, dedos para fora, ombros LONGE das orelhas', 'Desce até 90° de cotovelo, nem um grau mais: abaixo disso quem paga é o ombro', 'Cotovelos para trás, a roçar o corpo, nunca abertos', 'As costas sobem e descem coladas ao canto da cadeira'],
      err: ['Descer até ao fundo à procura de alongamento (é assim que nasce a dor de ombro)', 'Afastar tanto os pés que o peso vai parar às pernas', 'Encolher os ombros na direção das orelhas'],
      alt: [{ n: 'Com os joelhos dobrados e os pés perto', por: 'se não saírem 8 limpas' }, { n: 'Com os pés noutra cadeira', por: 'quando 15 já forem fáceis' }],
      mol: 'Se o ombro incomodar à frente: encurta o percurso para 60°, ou troca por flexões diamante, que deixam a articulação em paz.'
    },
    'flexion-diamante': { pat: 'ext', pic: 'eh',
      nombre: 'Flexões diamante', mm: { p: ['triceps'], s: ['pecho', 'hombro'] }, zona: 'empuje', musc: ['Tricípite', 'peitoral interno'], equipo: 'Nada',
      cues: ['Indicadores e polegares a formar um losango debaixo do esterno', 'Cotovelos colados ao corpo durante todo o percurso', 'Corpo em prancha: glúteo e abdómen apertados', 'Peito às mãos, e em cima estende por completo'],
      err: ['Abrir os cotovelos (passa a ser uma flexão normal)', 'Pôr as mãos à altura da cara em vez do esterno', 'Anca a ceder'],
      alt: [{ n: 'Com as mãos no sofá ou numa mesa', por: 'se do chão não saírem limpas' }, { n: 'Com os pés elevados', por: 'se passares de 12 fáceis' }],
      mol: 'Se o punho incomodar: apoia nos punhos ou desce aos joelhos. Se for o cotovelo, sobe para 15 repetições e abranda o ritmo.'
    },
    'ext-triceps-banda': { pat: 'ext',
      nombre: 'Extensão de tricípite com banda', mm: { p: ['triceps'], s: [] }, zona: 'empuje', musc: ['Tricípite (as três cabeças)'], equipo: 'Elástico',
      cues: ['Prende a banda em cima (porta ou puxador) e dá um passo atrás', 'Cotovelos colados às costelas e QUIETOS: só o antebraço se mexe', 'Estende até ao bloqueio suave e aguenta 1″ em baixo', 'Volta em 2-3″ a resistir ao elástico'],
      err: ['Deixar os cotovelos viajar para a frente ou para cima', 'Empurrar com o ombro, inclinando o tronco', 'Largar a volta e deixar o elástico mandar'],
      alt: [{ n: 'Acima da cabeça com a banda pisada', por: 'trabalha mais a cabeça longa' }, { n: 'Kickback com haltere', por: 'se não tiveres onde prender' }],
      mol: 'É o exercício mais simpático com o cotovelo de todo o plano: quando os outros incomodam, costuma ser o refúgio. Sobe repetições antes de subir a dureza da banda.'
    },
    'press-frances-mc': { pat: 'ext',
      nombre: 'French press com halteres', mm: { p: ['triceps'], s: [] }, zona: 'empuje', musc: ['Tricípite (cabeça longa)'], equipo: 'Halteres',
      cues: ['Deitado no chão, halteres em cima, palmas viradas uma para a outra', 'Desce na direção das orelhas dobrando só o cotovelo, em 2-3″', 'Cotovelos a apontar ao teto e quietos', 'Estende sem bloquear de repente'],
      err: ['Deixar os cotovelos abrirem para fora', 'Transformá-lo num press mexendo o ombro', 'Descer tão depressa que o chão trave o haltere'],
      alt: [{ n: 'Extensão acima da cabeça sentado', por: 'mais percurso na cabeça longa' }, { n: 'Extensão de tricípite com banda', por: 'se o cotovelo pedir tensão mais suave' }],
      mol: 'Se o cotovelo incomodar: passa para a versão com banda a 15 repetições. O chão, ainda por cima, corta-te o percurso mesmo onde o cotovelo sofre.'
    },
    /* — Braços — */
    'curl-barra-z': { pat: 'curl',
      nombre: 'Curl com barra W', mm: { p: ['biceps'], s: [] }, zona: 'tiron', musc: ['Bíceps'], equipo: 'Barra W',
      cues: ['Cotovelos colados ao corpo, FIXOS', 'Sobe sem balanço, desce em 2-3″', 'Punhos neutros graças à W'],
      err: ['Balançar o corpo para subir mais peso', 'Cotovelos que viajam à frente em cima'],
      alt: [{ n: 'Curl com halteres alternado', por: 'com rotação (supinação), muito completo' }, { n: 'Curl na polia baixa', por: 'tensão contínua' }],
      mol: 'Se o punho ou o cotovelo incomodarem: halteres com rotação ou pega martelo.'
    },
    'curl-inclinado': { pat: 'curl',
      nombre: 'Curl inclinado com halteres', mm: { p: ['biceps'], s: [] }, zona: 'tiron', musc: ['Bíceps (cabeça longa)'], equipo: 'Halteres + banco 45-60°',
      cues: ['Banco a 45-60°, braços PENDURADOS na vertical', 'O alongamento em baixo é o estímulo: não o cortes', 'Cotovelos parados, sobe sem encolher ombros'],
      err: ['Adiantar os cotovelos', 'Meia repetição em baixo'],
      alt: [{ n: 'Curl bayesiano na polia', por: 'mesmo alongamento, de pé' }],
      mol: 'Se o ombro puxar em baixo: sobe um ponto o encosto.'
    },
    'curl-martillo': { pat: 'curl',
      nombre: 'Curl martelo', mm: { p: ['biceps'], s: ['antebrazo'] }, zona: 'tiron', musc: ['Braquial', 'antebraço'], equipo: 'Halteres',
      cues: ['Pega neutra (martelo), cotovelos fixos', 'Podes fazê-lo alternado ou aos dois', 'Controla a descida'],
      err: ['Balanço', 'Transformá-lo em remada subindo os cotovelos'],
      alt: [{ n: 'Curl martelo com corda na polia', por: 'variante' }],
      mol: 'É o curl mais simpático com cotovelos e punhos: costuma ser o REFÚGIO quando os outros incomodam.'
    },
    'curl-polea': { pat: 'curl',
      nombre: 'Curl na polia baixa', mm: { p: ['biceps'], s: [] }, zona: 'tiron', musc: ['Bíceps'], equipo: 'Polia baixa + barra',
      cues: ['Um passo atrás da polia, cotovelos fixos', 'Tensão contínua: não descanses nem em cima nem em baixo', 'Última série: aguenta 10″ isométrico a meio para acabar'],
      err: ['Aproximar-te tanto que o troço baixo fique sem tensão', 'Balançar'],
      alt: [{ n: 'Curl com barra W', por: 'equivalente com peso livre' }],
      mol: 'Se o cotovelo incomodar: pega mais larga ou corda em martelo.'
    }
  };

  /* ---------- AS 8 REGRAS ---------- */
  const REGLAS = [
    { n: 1, t: 'RPE controlado', d: 'Cada fase tem o seu teto de esforço. O teu sistema nervoso lembra-se de ser atleta; os teus tendões levam anos sem carregar. Trava tu antes que travem eles.' },
    { n: 2, t: 'Progressão dupla', d: 'Primeiro sobe repetições dentro do intervalo, depois sobe peso (+2,5 kg; +5 kg no agachamento e no peso morto romeno). Só se a técnica esteve limpa em TODAS as séries. A app sugere-o sozinha.' },
    { n: 3, t: 'Balança = média semanal', d: 'Pesa-te segunda-quarta-sexta em jejum e olha só para a média. Um dia solto não significa nada (água, sal, creatina).' },
    { n: 4, t: 'Proteína: {p} g em 4 tomas', d: 'Pequeno-almoço, almoço, jantar e uma toma antes de dormir. Nenhuma toma abaixo de {q} g. É a variável que decide se a tua mudança de peso é gordura ou músculo.' },
    { n: 5, t: '8.000–10.000 passos diários', d: 'Todos os dias, treines ou não. Queimam mais à semana do que as próprias sessões.' },
    { n: 6, t: 'Sono 7–8 h: inegociável', d: 'Não é um objetivo, é uma regra: dormir 5,5 h em défice transforma a perda em −55% gordura e +60% músculo (Nedeltcheva 2010). Cafeína forte só antes das 13-14 h.' },
    { n: 7, t: 'Um dia falhado não se recupera', d: 'Não dobres sessões nem cortes comida no dia seguinte. Segues o calendário onde calhar.' },
    { n: 8, t: 'Mínimo inegociável', d: 'O padrão que mata é 3 meses a fundo / 3 a zero. A semana caótica tem um chão: 2 de força + 1 de cardio. Isso mantém tudo.' }
  ];

  const SENALES = 'Sinais para parar um exercício nesse dia: dor aguda no joelho, ombro ou lombar durante o movimento; desconforto que piora série a série em vez de desaparecer ao aquecer. Dores musculares difusas 24-48 h depois = normal. Dor articular localizada que persiste mais de 5 dias = fisioterapia antes de continuar a carregar.';

  /* ---------- NUTRIÇÃO ---------- */
  const NUTRI = {
    calorias: [
      { c: 'Metabolismo basal (Mifflin-St Jeor)', v: '~1.950 kcal', n: '95,1 kg · 183 cm · 30 anos' },
      { c: 'Gasto total estimado (plano a decorrer)', v: '2.850–3.000 kcal', n: 'Treinos + 8-10k passos' },
      { c: 'Ingestão objetivo', v: '2.250–2.400 kcal', n: 'Défice ~550–700 kcal/dia (mais do que isso trava a recuperação de músculo: Murphy & Koehler 2022)' },
      { c: 'Ritmo de perda esperado', v: '0,6–0,75 kg/sem', n: '≈0,7% do peso/semana, o ponto ótimo para reter massa magra (Garthe 2011). Média semanal, não dia a dia' }
    ],
    fases: [
      { f: 'F1–F2 (sem 1-5)', kcal: 2250, p: 190, g: 70, c: 205 },
      { f: 'F3 (sem 6-9)',    kcal: 2350, p: 190, g: 70, c: 230, nota: 'Semana 7: DIET BREAK a ~2.800' },
      { f: 'F4 (sem 10-12)',  kcal: 2400, p: 190, g: 70, c: 240 }
    ],
    escalado: 'A proteína nunca se toca: {p} g por dia para ti. Ao subir o volume de treino sobe só o hidrato. Na prática: na F3 acrescenta uma peça de fruta + 40 g de pão ao almoço nos dias de treino; na F4, o mesmo todos os dias.',
    tomas: 'QUATRO tomas de proteína por dia, nenhuma abaixo de {q} g: pequeno-almoço, almoço, jantar e uma toma antes de dormir. O total diário é que manda, mas dividir em 4 espreme a síntese proteica e tira a fome noturna.',
    plato: [
      { t: 'Proteína (cada refeição)', d: '200-250 g de frango/peru/peixe branco em cru, ou 170-180 g de salmão/vaca, ou 3 ovos + 2 claras, ou 250 g de skyr + whey. Referência visual: uma palma da mão e meia.' },
      { t: 'Hidratos', d: '60-75 g em cru de arroz/massa, ou 250-300 g de batata, ou 60 g de pão integral, ou 50 g de aveia. Referência: um punho.' },
      { t: 'Legumes', d: 'Meia porção do prato, à vontade. Volume e saciedade.' },
      { t: 'Gordura', d: '10 g de azeite por refeição principal (uma colher de sopa) e para de contar. É por aí que as calorias fogem sem dares conta.' }
    ],
    suplementos: [
      { t: 'Creatina mono-hidratada', d: '5 g diários, a qualquer hora, sem fase de carga, desde já. AVISO: retém 1-2 kg de água nas primeiras semanas. Não é gordura: fia-te da cintura e da média semanal, não do número solto (a app marca-o no gráfico).' },
      { t: 'Whey', d: '1 colher na toma antes de dormir com o skyr (e outra onde fizer falta nos dias curtos de proteína).' },
      { t: 'Cafeína', d: 'Corte às 13-14 h: 200 mg alteram o sono até 13 h depois; um café, ~9 h (Gardiner 2023). Treino de manhã: café 30-45′ antes, perfeito. De tarde-noite: sem cafeína — o teu pré-treino é o lanche (fruta + skyr 60-90′ antes).' },
      { t: 'Opcionais com sentido', d: 'Vitamina D só se as análises derem abaixo de 30 ng/mL (provável com vida de interior). Ómega-3 ~2 g EPA+DHA/dia: benefício modesto mas real em força e no ângulo anti-inflamatório/tendão.' },
      { t: 'NÃO gastes em', d: 'Queimadores de gordura, BCAA/EAA (redundantes com a tua proteína diária), «testo boosters». Nada disso mexe o ponteiro.' }
    ],
    hidratacion: 'Água: 2,5–3 L/dia. Álcool: conta calorias e bloqueia a recuperação — dentro da refeição livre, fora do resto da semana.',
    comidaLibre: 'UMA refeição por semana (sábado por defeito), não um dia. Pedes ou comes o que te apetecer em quantidade normal, sem compensar antes nem depois. Serve para que o plano aguente {s} semanas e uma vida social. Se houver plano noutro dia, muda-se — mas continua a ser uma.'
  };

  /* ---------- RECEITAS ---------- */
  // q em gramas salvo unidade indicada · macros por porção
  const RECETAS = [
    {
      id: 'bol-skyr', slot: 'de', tags: ['lacteo', 'frutos'], nombre: 'Taça de skyr', tipo: 'Pequeno-almoço A', tiempo: '5′', cocina: 'Sem cozinha',
      macros: { kcal: 520, p: 35, g: 11, c: 72 },
      ing: [
        { q: '250 g', i: 'skyr natural (ou queijo fresco batido 0%)' },
        { q: '50 g', i: 'flocos de aveia' },
        { q: '1 ud (120 g)', i: 'banana' },
        { q: '10 g', i: 'nozes' },
        { q: 'a gosto', i: 'canela' }
      ],
      pasos: [
        'Skyr na taça e a aveia por cima (assim mesmo se gostas com textura, ou demolhada 5′ num dedo de leite ou água).',
        'Banana às rodelas, nozes partidas à mão e canela por cima.'
      ],
      tips: 'Se treinas de manhã: monta-a na noite anterior (a aveia demolhada ganha). Dia curto de proteína: +1 colher de whey misturada no skyr (+110 kcal, +23 g P).'
    },
    {
      id: 'tortilla-pan', slot: 'de', tags: ['huevo', 'gluten'], nombre: 'Omelete com pão e tomate', tipo: 'Pequeno-almoço B', tiempo: '10′', cocina: 'Frigideira',
      macros: { kcal: 470, p: 34, g: 22, c: 32 },
      ing: [
        { q: '3 ud', i: 'ovos M' },
        { q: '2 ud (ou 100 ml embaladas)', i: 'claras' },
        { q: '60 g (2 fatias)', i: 'pão integral' },
        { q: '100 g', i: 'tomate ralado' },
        { q: '5 g', i: 'azeite' },
        { q: 'pitada', i: 'sal' }
      ],
      pasos: [
        'Bate ovos e claras com o sal.',
        'Frigideira antiaderente em lume médio com os 5 g de azeite: coalha a omelete no ponto que gostares.',
        'Torra o pão e põe-lhe o tomate ralado com uma gota do azeite da frigideira.'
      ],
      tips: 'As claras embaladas tiram a preguiça de separar. Versão mexidos: mesmo tempo, zero técnica.'
    },
    {
      id: 'pollo-asado', slot: 'co', tags: ['carne'], nombre: 'Frango assado com batata', tipo: 'Almoço · batch domingo', tiempo: '45′ forno (do meal prep)', cocina: 'Forno',
      macros: { kcal: 780, p: 70, g: 19, c: 68 },
      ing: [
        { q: '250 g cru (~200 g feito)', i: 'peito de frango', n: 'batch: 1,2 kg = 5 porções' },
        { q: '300 g', i: 'batata aos gomos + pimento + cebola assados', n: 'batch: 1,5 kg batata + 2 pimentos + 2 cebolas' },
        { q: '10 g', i: 'azeite (parte do assado)' },
        { q: 'a gosto', i: 'colorau, alho em pó, sal, orégãos' }
      ],
      pasos: [
        'Forno a 200°. Tempera os peitos e unta-os com colorau + alho em pó.',
        'Tabuleiro 1: peitos, 25-30′ (mal cozinhados = suculentos; passa disso e ficam sola).',
        'Tabuleiro 2: batata aos gomos com pimento, cebola e 20 g de azeite no total, 40-45′, virar a meio.',
        'Porciona: 5 taparuedas. O frango de quinta-sexta, ao congelador.'
      ],
      tips: 'A porção aquece-se em 2′ de micro-ondas com um fio de água para o frango não secar.'
    },
    {
      id: 'lentejas-pollo', slot: 'co', tags: ['carne'], nombre: 'Lentilhas com frango', tipo: 'Almoço · batch domingo', tiempo: '25′ panela', cocina: 'Panela',
      macros: { kcal: 760, p: 52, g: 16, c: 80 },
      ing: [
        { q: '250 g escorridas', i: 'lentilhas cozidas de frasco', n: 'batch: 2 frascos = 3 porções' },
        { q: '120 g', i: 'frango assado às tiras (do assado)' },
        { q: '¼ ud', i: 'cebola' },
        { q: '½ ud', i: 'pimento' },
        { q: '1 ud', i: 'cenoura' },
        { q: '4 g', i: 'azeite (parte do refogado)' },
        { q: '1 c. chá / ½ c. chá', i: 'colorau / cominhos' },
        { q: '150 ml', i: 'caldo ou água' },
        { q: '1 peça', i: 'fruta de sobremesa' }
      ],
      pasos: [
        'Refogado 8′: cebola, pimento e cenoura picados com 10 g de azeite (para o batch de 3 porções).',
        'Junta as lentilhas escorridas, o caldo, o colorau e os cominhos: 15′ em lume brando.',
        'Desliga e mistura o frango às tiras (assim não resseca).'
      ],
      tips: 'De frasco e sem demolhar: a leguminosa mais rápida que existe. Engrossam no dia seguinte: junta um dedo de água ao aquecer.'
    },
    {
      id: 'salteado-ternera', slot: 'co', tags: ['carne'], nombre: 'Salteado de vaca', tipo: 'Almoço · 15′ fresco', tiempo: '15′', cocina: 'Wok / frigideira',
      macros: { kcal: 730, p: 45, g: 20, c: 60 },
      ing: [
        { q: '180-200 g', i: 'vaca magra às tiras' },
        { q: '70 g cru (≈ 180 g cozido)', i: 'arroz', n: 'usa o do batch' },
        { q: '250 g', i: 'legumes variados: pimento, cebola, courgette, cenoura' },
        { q: '15 ml', i: 'molho de soja' },
        { q: '8 g', i: 'azeite' }
      ],
      pasos: [
        'Wok ou frigideira MUITO quente com o azeite: sela a carne 1-2′ e reserva (se a deixares, coze e fica dura).',
        'Mesma frigideira: legumes às tiras 5-6′, que fiquem al dente.',
        'Volta a carne, soja, 1′ a mexer e por cima do arroz.'
      ],
      tips: 'A ordem é tudo: carne fora antes dos legumes. Pede no talho «tiras para saltear» e poupas o corte.'
    },
    {
      id: 'salmon-arroz', slot: 'ce', tags: ['pescado'], nombre: 'Salmão com arroz e brócolos', tipo: 'Jantar · 15′', tiempo: '15′', cocina: 'Grelha ou forno',
      macros: { kcal: 760, p: 40, g: 28, c: 62 },
      ing: [
        { q: '170-180 g', i: 'lombo de salmão' },
        { q: '75 g cru (≈ 190 g cozido)', i: 'arroz', n: 'do batch' },
        { q: '200 g', i: 'brócolos' },
        { q: '½ ud', i: 'limão' },
        { q: 'pitada', i: 'sal' }
      ],
      pasos: [
        'Brócolos no micro-ondas numa taça tapada com um dedo de água: 4-5′ (ou a vapor).',
        'Salmão na grelha 3-4′ de cada lado começando pela pele (ou forno 200°, 12′). Sem azeite: já traz o seu.',
        'Arroz aquecido, limão espremido por cima de tudo.'
      ],
      tips: 'A gordura do salmão conta como a gordura da refeição: é por isso que aqui não há azeite.'
    },
    {
      id: 'merluza-patata', slot: 'ce', tags: ['pescado', 'lacteo'], nombre: 'Pescada com batata a padeiro', tipo: 'Jantar · 20′', tiempo: '20′', cocina: 'Forno ou micro+grelha',
      macros: { kcal: 740, p: 55, g: 15, c: 55 },
      ing: [
        { q: '250 g', i: 'pescada ou robalo em lombos' },
        { q: '250 g', i: 'batata' },
        { q: 'taça', i: 'salada verde (alface, tomate, cebola)' },
        { q: '10 g', i: 'azeite (5 batata + 5 salada)' },
        { q: '1 ud', i: 'skyr de sobremesa' }
      ],
      pasos: [
        'Batata às rodelas de ½ cm: micro-ondas 8′ tapada (ou forno 25′ com 5 g de azeite, sal e orégãos).',
        'Pescada: forno 200° 10-12′, ou grelha 3′ de cada lado. Ponto: quando se separa em lascas.',
        'Salada com 5 g de azeite e vinagre. Skyr de sobremesa e jantar fechado.'
      ],
      tips: 'O peixe branco é a proteína mais saciante por caloria de todo o plano: usa-o nos dias de mais fome.'
    },
    {
      id: 'revuelto-gambas', slot: 'ce', tags: ['pescado', 'huevo', 'gluten'], nombre: 'Ovos mexidos com camarão', tipo: 'Jantar · 10′', tiempo: '10′', cocina: 'Frigideira',
      macros: { kcal: 620, p: 45, g: 30, c: 25 },
      ing: [
        { q: '3 ud', i: 'ovos M' },
        { q: '150 g', i: 'camarão descascado (congelado serve perfeitamente)' },
        { q: '40 g', i: 'pão integral' },
        { q: 'taça', i: 'salada verde' },
        { q: '8 g', i: 'azeite' },
        { q: '1 dente', i: 'alho' }
      ],
      pasos: [
        'Aloura o alho laminado com o azeite; camarão 2′ (descongelado e seco antes).',
        'Baixa o lume, junta os ovos batidos e mexe SEM PARAR até ficar cremoso. Fora do lume antes de coalhar por completo.',
        'Pão torrado e salada ao lado.'
      ],
      tips: 'Os mexidos acabam de fazer-se fora do lume. Camarão congelado: descongela numa taça de água fria em 10′.'
    },
    {
      id: 'toma-noche', slot: 'snack', tags: ['lacteo'], nombre: 'Toma antes de dormir', tipo: 'Toma 4 · diária', tiempo: '1′', cocina: 'Sem cozinha',
      macros: { kcal: 270, p: 49, g: 2, c: 14 },
      ing: [
        { q: '250 g', i: 'skyr ou queijo fresco batido 0%' },
        { q: '1 colher (30 g)', i: 'whey (o sabor de que não te fartas)' },
        { q: 'a gosto', i: 'canela' }
      ],
      pasos: [
        'Mistura a colher de whey com o skyr até ficar textura de mousse. Canela por cima.',
        '30-60′ antes de te deitares. Já está.'
      ],
      tips: 'Esta toma remata a proteína do dia e mata a fome noturna, o momento onde morrem as dietas. A caseína do leite, de digestão lenta, trabalha enquanto dormes.'
    },
    {
      id: 'ensalada-atun', slot: 'ce', tags: ['pescado', 'huevo'], nombre: 'Salada completa de atum', tipo: 'Jantar · 10′', tiempo: '10′', cocina: 'Sem lume (com batch)',
      macros: { kcal: 700, p: 45, g: 25, c: 50 },
      ing: [
        { q: '2 latas (120 g escorrido)', i: 'atum ao natural' },
        { q: '1 ud', i: 'ovo cozido (do batch)' },
        { q: '150 g', i: 'batata cozida (do batch)' },
        { q: '150 g', i: 'tomate' },
        { q: '30 g', i: 'azeitonas' },
        { q: '¼ ud', i: 'cebola roxa' },
        { q: '10 g', i: 'azeite' }
      ],
      pasos: [
        'Tudo para a taça: batata aos cubos, tomate aos gomos, cebola fina, atum escorrido, ovo aos quartos, azeitonas.',
        'Azeite, vinagre, sal e uma mexida.'
      ],
      tips: 'O jantar de esforço zero se no domingo cozeste batatas e ovos a mais. Versão sem batata (dia de pouca fome): junta mais tomate.'
    },
    { id: 'porridge-soja', slot: 'de', tags: [], nombre: 'Papas de aveia com proteína', tipo: 'Pequeno-almoço C', tiempo: '8′', cocina: 'Tacho ou micro',
      macros: { kcal: 545, p: 37, g: 11, c: 69 },
      ing: [{ q: '70 g', i: 'flocos de aveia (certificada sem glúten)' }, { q: '250 ml', i: 'bebida de soja sem açúcar' }, { q: '25 g', i: 'proteína de ervilha, sabor neutro ou baunilha' }, { q: '1', i: 'banana às rodelas' }, { q: 'a gosto', i: 'canela' }],
      pasos: ['Aquece a aveia com a bebida de soja 4-5′ a mexer até engrossar.', 'Fora do lume, mistura a proteína: se a ferveres, empelota.', 'Coroa com a banana e a canela.'],
      tips: 'Deixa-as feitas na noite anterior no frigorífico (overnight) e de manhã só juntas a proteína.' },
    { id: 'tofu-revuelto', slot: 'de', tags: [], nombre: 'Tofu mexido com torradas', tipo: 'Pequeno-almoço D', tiempo: '12′', cocina: 'Frigideira',
      macros: { kcal: 570, p: 41, g: 25, c: 42 },
      ing: [{ q: '200 g', i: 'tofu firme esmigalhado' }, { q: '2 fatias (70 g)', i: 'pão sem glúten' }, { q: '10 g', i: 'levedura nutricional' }, { q: '1', i: 'tomate às rodelas' }, { q: '5 g', i: 'azeite' }, { q: 'a gosto', i: 'curcuma, sal negro kala namak, pimenta' }],
      pasos: ['Salteia o tofu esmigalhado com o azeite 3-4′ em lume médio-alto.', 'Junta curcuma, levedura e sal negro (é o que dá o sabor a ovo); mais 2′.', 'Torra o pão e monta com o tomate.'],
      tips: 'O sal kala namak é a chave: sem ele é tofu com curcuma; com ele, uns mexidos.' },
    { id: 'bol-soja-frutos', slot: 'de', tags: [], nombre: 'Taça de iogurte de soja e frutos vermelhos', tipo: 'Pequeno-almoço E', tiempo: '5′', cocina: 'Sem cozinha',
      macros: { kcal: 415, p: 29, g: 11, c: 41 },
      ing: [{ q: '250 g', i: 'iogurte de soja natural sem açúcar' }, { q: '20 g', i: 'proteína vegetal em pó' }, { q: '120 g', i: 'frutos vermelhos (congelados servem)' }, { q: '15 g', i: 'sementes de chia' }, { q: '1', i: 'banana pequena' }],
      pasos: ['Mistura o iogurte com a proteína até não ficarem grumos.', 'Junta a chia e deixa 5′: engrossa sozinha.', 'Coroa com os frutos vermelhos e a banana.'],
      tips: 'Os frutos vermelhos congelados, deitados assim mesmo, arrefecem e engrossam a taça: aqui são melhores do que os frescos.' },
    { id: 'revuelto-espinacas', slot: 'de', tags: ['huevo'], nombre: 'Ovos mexidos com espinafres', tipo: 'Pequeno-almoço F', tiempo: '10′', cocina: 'Frigideira',
      macros: { kcal: 510, p: 28, g: 21, c: 46 },
      ing: [{ q: '3', i: 'ovos' }, { q: '100 g', i: 'espinafres frescos' }, { q: '100 g', i: 'cogumelos laminados' }, { q: '50 g', i: 'pão sem glúten' }, { q: '5 g', i: 'azeite' }, { q: '150 g', i: 'fruta da época' }],
      pasos: ['Salteia os cogumelos 3′; junta os espinafres até murcharem.', 'Ovos batidos lá dentro, lume brando, a mexer: cremoso, não seco.', 'Serve com o pão torrado e a fruta à parte.'],
      tips: 'Desliga o lume quando ainda parecer um pouco cru: o calor residual acaba o trabalho.' },
    { id: 'curry-lentejas', slot: 'co', tags: [], nombre: 'Caril de lentilhas vermelhas com arroz', tipo: 'Almoço · batch domingo', tiempo: '25′ panela', cocina: 'Panela',
      macros: { kcal: 755, p: 31, g: 18, c: 108 },
      ing: [{ q: '100 g', i: 'lentilhas vermelhas secas' }, { q: '100 ml', i: 'leite de coco light' }, { q: '150 g', i: 'tomate triturado' }, { q: '50 g', i: 'arroz basmati seco' }, { q: '10 g', i: 'azeite' }, { q: 'a gosto', i: 'cebola, alho, gengibre, caril em pó, sal' }],
      pasos: ['Refoga cebola, alho e gengibre 3′; junta o caril e torra-o 30″.', 'Lentilhas, tomate, coco e 300 ml de água: 18-20′ em lume médio até se desfazerem.', 'Arroz à parte (12′). Serve o caril por cima.'],
      tips: 'Batch: multiplica ×4, dura 4 dias no frigorífico e congela na perfeição. As lentilhas vermelhas não precisam de demolha.' },
    { id: 'tofu-salteado', slot: 'co', tags: [], nombre: 'Tofu salteado com legumes e arroz integral', tipo: 'Almoço · 20′', tiempo: '20′', cocina: 'Wok / frigideira',
      macros: { kcal: 775, p: 47, g: 34, c: 71 },
      ing: [{ q: '200 g', i: 'tofu firme aos cubos' }, { q: '70 g', i: 'arroz integral seco' }, { q: '250 g', i: 'brócolos, pimento e cenoura' }, { q: '15 ml', i: 'tamari (molho de soja sem glúten)' }, { q: '10 g', i: 'azeite' }, { q: '10 g', i: 'sementes de sésamo' }],
      pasos: ['Arroz integral a cozer (25′; faz de batch).', 'Tofu em lume forte até alourar de todos os lados (6-7′); reserva.', 'Legumes 4′ no wok, volta o tofu, tamari e sésamo; 1′ e fora.'],
      tips: 'Prensa o tofu 10′ entre dois pratos com peso: larga água e aloura a sério.' },
    { id: 'bol-garbanzos', slot: 'co', tags: [], nombre: 'Taça de grão assado com quinoa e húmus', tipo: 'Almoço · 15′ fresco', tiempo: '15′ (+ forno)', cocina: 'Forno + sem lume',
      macros: { kcal: 780, p: 31, g: 24, c: 103 },
      ing: [{ q: '200 g', i: 'grão-de-bico cozido' }, { q: '60 g', i: 'quinoa seca' }, { q: '50 g', i: 'húmus' }, { q: '150 g', i: 'pimento assado e pepino' }, { q: '5 g', i: 'azeite' }, { q: 'a gosto', i: 'cominhos, colorau, limão, sal' }],
      pasos: ['Grão escorrido com colorau, cominhos e sal: forno 200° 20′ até ficar crocante (batch).', 'Quinoa: lava, 12′ no dobro de água, repousa tapada.', 'Monta a taça: quinoa, grão, legumes, húmus e limão.'],
      tips: 'O grão assado aguenta 5 dias num frasco: é o «petisco» deste plano.' },
    { id: 'pasta-lentejas-tempeh', slot: 'co', tags: [], nombre: 'Massa de lentilhas com tempeh ao tomate', tipo: 'Almoço · 20′', tiempo: '20′', cocina: 'Panela + frigideira',
      macros: { kcal: 665, p: 46, g: 26, c: 67 },
      ing: [{ q: '80 g', i: 'massa de lentilhas vermelhas (sem glúten)' }, { q: '120 g', i: 'tempeh aos cubos' }, { q: '200 g', i: 'tomate triturado' }, { q: '80 g', i: 'cebola e alho' }, { q: '10 g', i: 'azeite' }, { q: 'a gosto', i: 'manjericão, orégãos, sal' }],
      pasos: ['Massa de lentilhas 7-8′ (passa depressa: prova antes do tempo do pacote).', 'Tempeh alourado no azeite 4′; junta cebola e alho mais 3′.', 'Tomate, orégãos e sal, 5′; mistura com a massa e o manjericão.'],
      tips: 'O tempeh ganha muito se o cozeres 8′ a vapor antes de alourar: perde o amargo.' },
    { id: 'tortilla-garbanzo', slot: 'ce', tags: [], nombre: 'Omelete de farinha de grão com courgette', tipo: 'Jantar · 20′', tiempo: '20′', cocina: 'Frigideira',
      macros: { kcal: 460, p: 20, g: 16, c: 62 },
      ing: [{ q: '80 g', i: 'farinha de grão-de-bico (sem glúten)' }, { q: '200 g', i: 'courgette em lâminas finas' }, { q: '80 g', i: 'cebola' }, { q: '10 g', i: 'azeite' }, { q: '100 g', i: 'salada verde' }, { q: 'a gosto', i: 'sal, pimenta, curcuma' }],
      pasos: ['Mistura a farinha com 160 ml de água, sal e curcuma; deixa repousar 10′.', 'Courgette e cebola 8′ em lume médio até ficarem tenras.', 'Deita a massa por cima, tapa, 5′ de cada lado. Salada ao lado.'],
      tips: 'É a «omelete sem ovo» a sério: coalha na mesma e aguenta fria para levar.' },
    { id: 'crema-calabaza-tofu', slot: 'ce', tags: [], nombre: 'Creme de abóbora com edamame e tofu grelhado', tipo: 'Jantar · 25′', tiempo: '25′', cocina: 'Panela + grelha',
      macros: { kcal: 590, p: 41, g: 24, c: 38 },
      ing: [{ q: '300 g', i: 'abóbora aos cubos' }, { q: '100 g', i: 'edamame debulhado (congelado)' }, { q: '150 g', i: 'tofu firme em filetes' }, { q: '60 g', i: 'cebola' }, { q: '10 g', i: 'azeite' }, { q: '10 g', i: 'sementes de abóbora' }],
      pasos: ['Cebola e abóbora com 5 g de azeite 3′; cobre de água à justa, 15′ e tritura.', 'Edamame 4′ em água a ferver; escorre e junta ao creme.', 'Tofu grelhado com o resto do azeite, 3′ de cada lado. Sementes por cima.'],
      tips: 'O creme sem natas nem batata: a abóbora triturada já é cremosa sozinha.' },
    { id: 'ensalada-quinoa-alubias', slot: 'ce', tags: [], nombre: 'Salada morna de quinoa, feijão preto e abacate', tipo: 'Jantar · 15′', tiempo: '15′', cocina: 'Panela + sem lume',
      macros: { kcal: 610, p: 25, g: 21, c: 82 },
      ing: [{ q: '40 g', i: 'quinoa seca' }, { q: '200 g', i: 'feijão preto cozido' }, { q: '80 g', i: 'abacate' }, { q: '120 g', i: 'tomate, cebola roxa e coentros' }, { q: '5 g', i: 'azeite' }, { q: 'a gosto', i: 'lima, cominhos, sal' }],
      pasos: ['Quinoa 12′ no dobro de água; escorre.', 'Feijão escorrido e lavado, com a quinoa ainda morna.', 'Abacate, tomate, cebola e coentros; tempera com lima, cominhos e azeite.'],
      tips: 'Leva-se para o trabalho sem problema: o abacate, de preferência cortado na hora.' },
    { id: 'bolonesa-soja', slot: 'ce', tags: [], nombre: 'Bolonhesa de soja texturizada com courgette em espiral', tipo: 'Jantar · 20′', tiempo: '20′', cocina: 'Frigideira',
      macros: { kcal: 445, p: 37, g: 13, c: 47 },
      ing: [{ q: '60 g', i: 'soja texturizada fina (seca)' }, { q: '250 g', i: 'tomate triturado' }, { q: '300 g', i: 'courgette em espirais ou tiras' }, { q: '100 g', i: 'cebola, cenoura e alho' }, { q: '10 g', i: 'azeite' }, { q: 'a gosto', i: 'orégãos, colorau, sal' }],
      pasos: ['Hidrata a soja 10′ em água quente com uma pitada de sal; escorre bem.', 'Refogado 5′; soja escorrida 3′ em lume forte; tomate e orégãos, 8′.', 'Courgette 2′ em frigideira à parte (para não largar água). Bolonhesa por cima.'],
      tips: 'A soja texturizada tem 50 g de proteína por 100 g em seco: é a «carne picada» mais barata que existe.' }
  ];

  /* ---------- LISTA DE COMPRAS (semana tipo) ---------- */
  const COMPRA = [
    { cat: 'Proteína', items: [
      { q: '1,4 kg', i: 'peito de frango' },
      { q: '400 g', i: 'vaca magra às tiras' },
      { q: '500 g', i: 'pescada ou robalo (2 porções)' },
      { q: '350 g', i: 'salmão (2 lombos)' },
      { q: '300 g', i: 'camarão descascado congelado' },
      { q: '4 latas', i: 'atum ao natural' },
      { q: '18 ud', i: 'ovos M (dúzia e meia)' },
      { q: '14 ud (250 g cada)', i: 'skyr ou queijo fresco batido 0% (7 pequenos-almoços/sobremesas + 7 tomas noturnas)' },
      { q: '1 embalagem (dura ~1 mês)', i: 'whey (1 colher diária na toma noturna)' }
    ]},
    { cat: 'Hidratos', items: [
      { q: '500 g', i: 'arroz' },
      { q: '2 kg', i: 'batatas' },
      { q: '400 g', i: 'pão integral (cacete grande ou de forma)' },
      { q: '500 g', i: 'aveia' },
      { q: '2 frascos (400 g escorrido cada)', i: 'lentilhas cozidas' }
    ]},
    { cat: 'Legumes e fruta', items: [
      { q: '5 ud', i: 'pimentos' },
      { q: '4 ud', i: 'cebolas (+1 roxa)' },
      { q: '2 ud', i: 'courgettes' },
      { q: '2 ud', i: 'brócolos' },
      { q: '8 ud', i: 'tomates (2 para ralar)' },
      { q: '2 sacos', i: 'alface ou canónigos' },
      { q: '500 g', i: 'cenouras' },
      { q: '12-14 peças', i: 'fruta: bananas ×5, maçãs ×4-5, laranjas ×4' }
    ]},
    { cat: 'Despensa', items: [
      { q: '—', i: 'azeite' },
      { q: '200 g', i: 'nozes' },
      { q: '1 frasco', i: 'azeitonas' },
      { q: '1 frasco', i: 'molho de soja' },
      { q: '3 ud', i: 'limões' },
      { q: '—', i: 'especiarias: colorau, alho em pó, cominhos, orégãos, canela' },
      { q: '—', i: 'sal, vinagre, caldo' }
    ]}
  ];

  /* ---------- MEAL PREP DE DOMINGO (~90′) ---------- */
  const MEALPREP = [
    { min: '0′',  paso: 'Forno a 200°. Tempera 1,2 kg de peitos e unta-os com colorau + alho em pó.' },
    { min: '5′',  paso: 'Ao forno: tabuleiro 1 (peitos, 25-30′) e tabuleiro 2 (1,5 kg de batata aos gomos + 2 pimentos + 2 cebolas + 20 g de azeite, 40-45′).' },
    { min: '10′', paso: 'Panela em lume médio: refogado de cebola, pimento e cenoura com 10 g de azeite.' },
    { min: '15′', paso: 'Tacho 1: 400 g de arroz a cozer (12-15′). Tacho 2: 6 ovos (10′) + 2 batatas médias (deixa-as 20′): ovos e batata para a salada de atum.' },
    { min: '20′', paso: 'À panela: 2 frascos de lentilhas escorridas + 400 ml de caldo + colorau e cominhos. Lume brando 20′.' },
    { min: '30′', paso: 'Peitos fora. Corta 250 g às tiras para as lentilhas (juntam-se ao desligar). Escorre o arroz e espalha-o num tabuleiro para arrefecer depressa.' },
    { min: '45′', paso: 'Batatas do forno fora. Vira, prova, sal se faltar.' },
    { min: '60′', paso: 'Porciona: 5 taparuedas de almoço (2 frango+batatas, 2-3 lentilhas, arroz em taparuedas à parte para salteado/salmão) + ovos cozidos e batata cozida no frigorífico.' },
    { min: '75′', paso: 'Etiqueta e guarda: frigorífico até quarta, congelador o de quinta-sexta (passa-o para o frigorífico na noite anterior). Cozinha arrumada enquanto toca o que for.' }
  ];
  const MEALPREP_NOTA = 'O peixe dos jantares faz-se fresco em 10 minutos: não se prepara ao domingo. Frango e arroz aguentam 4 dias refrigerados.';

  /* ---------- MENU SEMANAL ---------- */
  const MENU = [
    { d: 'Seg', de: 'bol-skyr', co: 'pollo-asado', ce: 'merluza-patata' },
    { d: 'Ter', de: 'tortilla-pan', co: 'lentejas-pollo', ce: 'ensalada-atun' },
    { d: 'Qua', de: 'bol-skyr', co: 'salteado-ternera', ce: 'revuelto-gambas' },
    { d: 'Qui', de: 'tortilla-pan', co: 'pollo-asado', ce: 'salmon-arroz' },
    { d: 'Sex', de: 'bol-skyr', co: 'lentejas-pollo', ce: 'merluza-patata' },
    { d: 'Sáb', de: 'tortilla-pan', co: 'LIBRE', ce: 'ensalada-atun' },
    { d: 'Dom', de: 'bol-skyr', co: 'salteado-ternera', ce: 'revuelto-gambas' }
  ];

  /* ---------- ACOMPANHAMENTO ---------- */
  const CHECKPOINTS = [
    { sem: 4,  fecha: '2026-09-13', rango: [92.5, 93.5], si: 'Revê o azeite e a refeição livre; +1.000 passos/dia. Lembra-te: a creatina esconde ~1 kg.' },
    { sem: 8,  fecha: '2026-10-11', rango: [90.0, 91.3], si: '−100 kcal de hidratos só nos dias de descanso (a semana 7 foi diet break: a média pode vir alta e é normal)' },
    { sem: 12, fecha: '2026-11-08', rango: [86.0, 88.0], si: 'Fecho, fotos, medidas e bloco seguinte. Em gordura real: ~−8 kg.' }
  ];
  const AJUSTES = [
    { id: 'rapido', cond: 'Perdes mais de 1,0 kg/semana duas semanas seguidas (descontando o efeito da creatina)', accion: 'Junta 150 kcal de hidratos. Mais rápido não é melhor: a esse ritmo o défice come o músculo que estás a recuperar.' },
    { id: 'lento', cond: 'Perdes menos de 0,45 kg/semana duas semanas seguidas (sem contar a semana de diet break)', accion: 'Primeiro confirma passos e azeite; se estiver limpo, sobe +1.500 passos ANTES de cortar kcal (protege o treino).' },
    { id: 'rendimiento', cond: 'O rendimento no ginásio cai duas sessões seguidas', accion: 'Olha para o sono antes da dieta.' }
  ];
  const FOTOS = ['2026-08-17', '2026-09-13', '2026-10-11', '2026-11-08'];

  /* ---------- CONQUISTAS ---------- */
  // tipo: sesion | racha | peso | cintura | disco | pr | especial
  const LOGROS = [
    { id: 'primera',        icon: '⚡', nombre: 'Dia um',            desc: 'Primeira sessão concluída. Já fizeste o mais difícil.' },
    { id: 'sesiones-10',    icon: '🔟', nombre: 'Dez em dez',        desc: '10 sessões de força concluídas.' },
    { id: 'sesiones-25',    icon: '🎯', nombre: 'Vinte e cinco',     desc: '25 sessões de força. Isto já é um hábito.' },
    { id: 'sesiones-50',    icon: '🏛️', nombre: 'Cinquenta',         desc: '50 sessões. Território de outra pessoa.' },
    { id: 'semana-perfecta',icon: '💎', nombre: 'Semana perfeita',   desc: 'Todas as sessões de força de uma semana.' },
    { id: 'minimo-3',       icon: '🛡️', nombre: 'O chão aguenta',    desc: '3 semanas seguidas a cumprir pelo menos o mínimo (2 de força + 1 de cardio).' },
    { id: 'racha-7',        icon: '🔥', nombre: 'Sequência 7',       desc: '7 dias de plano seguidos, cumpridos.' },
    { id: 'racha-14',       icon: '🔥', nombre: 'Sequência 14',      desc: '14 dias de plano seguidos. Isto já é costume.' },
    { id: 'racha-30',       icon: '🌋', nombre: 'Sequência 30',      desc: '30 dias de plano seguidos. Imparável.' },
    { id: 'pasos-7',        icon: '👟', nombre: 'Semana andada',     desc: '7 dias seguidos a chegar aos passos.' },
    { id: 'disco-10',       icon: 'disc10', nombre: 'Disco de 10',   desc: 'Fase 1 concluída. O hábito voltou.', disco: true },
    { id: 'disco-15',       icon: 'disc15', nombre: 'Disco de 15',   desc: 'Fase 2 concluída. Já estás dentro do ginásio.', disco: true },
    { id: 'disco-20',       icon: 'disc20', nombre: 'Disco de 20',   desc: 'Fase 3 concluída. A carga a sério já é tua.', disco: true },
    { id: 'disco-25',       icon: 'disc25', nombre: 'Disco de 25',   desc: 'Fase 4 concluída. Coleção completa.', disco: true },
    { id: 'kg-2',           icon: '📉', nombre: '−2 kg',             desc: 'Média semanal 2 kg abaixo da partida.' },
    { id: 'kg-4',           icon: '📉', nombre: '−4 kg',             desc: '4 kg a menos de média semanal.' },
    { id: 'kg-6',           icon: '📉', nombre: '−6 kg',             desc: '6 kg a menos. Metade do caminho longo.' },
    { id: 'kg-8',           icon: '📉', nombre: '−8 kg',             desc: '8 kg a menos de média semanal.' },
    { id: 'kg-10',          icon: '🏔️', nombre: '−10 kg',            desc: 'Dois dígitos. Poucas pessoas chegam aqui.' },
    { id: 'cintura-95',     icon: '📏', nombre: 'Cintura −95',       desc: 'Cintura abaixo de 95 cm.' },
    { id: 'cintura-93',     icon: '📏', nombre: 'Cintura −93',       desc: 'Cintura abaixo de 93 cm.' },
    { id: 'cintura-91',     icon: '👑', nombre: 'Métrica rainha',    desc: 'Cintura abaixo de 91 cm: menos de metade da tua altura.' },
    { id: 'pr-1',           icon: '🥇', nombre: 'Primeiro PR',       desc: 'Primeira vez que superas a tua melhor marca num exercício.' },
    { id: 'pr-5',           icon: '🥇', nombre: '5 PR',              desc: 'Cinco recordes pessoais batidos.' },
    { id: 'pr-15',          icon: '🏆', nombre: '15 PR',             desc: 'Quinze PR. A memória muscular a pagar dividendos.' },
    { id: 'dominada-libre', icon: '🦍', nombre: 'Elevação livre',    desc: 'Primeira elevação sem assistência. De volta ao clube.' },
    { id: 'mealprep-4',     icon: '🍱', nombre: 'Chef de domingo',   desc: '4 domingos seguidos de meal prep.' },
    { id: 'comeback',       icon: '🔁', nombre: 'O regresso',        desc: 'O regresso após 4 ou mais dias sem treinar. Voltar importa mais do que cair.' },
    { id: 'fotos-4',        icon: '📸', nombre: 'A sequência',       desc: 'As 4 fotos de progresso feitas.' },
    { id: 'checkpoint-s4',  icon: '✅', nombre: 'Checkpoint S4',     desc: 'Peso dentro do corredor na semana 4.' },
    { id: 'checkpoint-s8',  icon: '✅', nombre: 'Checkpoint S8',     desc: 'Peso dentro do corredor na semana 8.' },
    { id: 'plan-completo',  icon: '🏁', nombre: 'BACK2PRIME',        desc: 'Plano de 12 semanas terminado. 85 kg era a consequência, não a meta.' }
  ];

  /* ---------- A CIÊNCIA DO PLANO (revisão de evidência · ago 2026) ---------- */
  const CIENCIA = {
    intro: 'Plano revisto contra a evidência (metanálises e ensaios 2010-2025, agosto de 2026). A ideia que ordena tudo: quem regressa não é um novato — o músculo e o sistema nervoso voltam depressa, mas o tendão não tem memória. O músculo pode correr; o tendão marca o ritmo.',
    temas: [
      { t: 'Memória muscular', d: 'Recuperar o que se ganhou é real e rápido: força em ~8 semanas, tamanho em ~12. O mecanismo (mionúcleos vs epigenética) está em debate, o efeito não. Por isso a progressão dupla pode andar mais depressa do que num novato — e por isso mesmo NÃO se comprime o calendário: quem não corre é o tendão.', ref: 'Rahmati 2022 (metanálise, J Cachexia Sarcopenia Muscle) · Cumming 2024 (J Physiol)' },
      { t: 'Tendão: o limitante', d: 'O colagénio tendinoso renova-se ~10× mais devagar do que o músculo. O que o adapta mesmo: cargas altas com contrações lentas de ~3″ (HSR) e isométricos a 70% (5×45″), que ainda por cima tiram a dor na hora. A pliometria é mau estímulo tendinoso: nada de saltos para «preparar» a corrida.', ref: 'Mersmann 2017 (Front Physiol) · Rio 2015 (BJSM) · Kongsgaard (HSR)' },
      { t: 'Correr com excesso de peso', d: 'Com excesso de peso, começar com mais de 3 km/semana de corrida dispara as lesões (~31-48% mais). Subir a cadência para 170-180 reduz o impacto tibial ~11%. A progressão segura não é a «regra dos 10%»: é não passar de ~1,3× a tua média das últimas 4 semanas.', ref: 'Bertelsen 2018 (ECA em iniciados com excesso de peso) · revisão de cadência 2025 · consenso COI de carga' },
      { t: 'Défice ótimo', d: 'Um défice maior do que ~500-600 kcal anula o ganho de músculo mesmo que treines força. O ritmo ótimo para reter massa magra é ~0,7% do peso/semana. Por isso o plano perde a 0,6-0,75 kg/sem e não a 0,9.', ref: 'Murphy & Koehler 2022 (metanálise, 59 estudos) · Garthe 2011' },
      { t: 'Proteína', d: 'Em défice, os treinados precisam de 2,3-3,1 g/kg de massa magra. {p} g deixa-te confortável no intervalo, e dividi-la em 4 tomas de ≥40 g espreme a síntese proteica e controla a fome.', ref: 'Helms 2014 (revisão sistemática) · Schoenfeld & Aragon (divisão por toma)' },
      { t: 'Diet break', d: 'Alternar défice com descansos à manutenção atenuou a queda metabólica e melhorou a perda de gordura no estudo MATADOR. Em {s} semanas o seu valor principal é outro: ensina-te que parar UMA semana com plano não é recair.', ref: 'Byrne 2018 (Int J Obesity, MATADOR)' },
      { t: 'Volume certo', d: 'Mais séries = mais músculo, mas com rendimentos decrescentes, e em défice o excesso só soma fadiga e risco. Alvo: ~10 séries/músculo/semana na F2 e 12-18 na F3-F4. E o mínimo inegociável (2 de força + 1 de cardio) tem suporte: com isso CONSERVA-SE músculo a sério.', ref: 'Pelland 2025 (Sports Medicine) · Androulakis-Korakakis 2020 (dose mínima)' },
      { t: 'Descarga bem feita', d: 'Parar por completo uma semana custa força; o que funciona é cortar o volume a metade mantendo o peso na barra. Por isso a semana 9 é descarga OBRIGATÓRIA desse tipo.', ref: 'Coleman 2024 (PeerJ, ECA de descarga)' },
      { t: 'Sono', d: 'Dormir 5,5 h em défice (vs 8,5) reduziu a gordura perdida em 55% e multiplicou a perda de músculo. É, a seguir à proteína e ao défice, a tua maior alavanca. Daí o corte de cafeína às 13-14 h: 200 mg alteram o sono até 13 h depois.', ref: 'Nedeltcheva 2010 (Ann Intern Med) · Gardiner 2023 (Sleep Med Rev)' },
      { t: 'Saúde primeiro', d: 'Depois de anos sem atividade vigorosa, antes de passar ao trabalho forte da F3-F4: tensão arterial e análises básicas (lípidos, glicose/HbA1c). Com sintomas de qualquer tipo, médico antes de continuar.', ref: 'ACSM Preparticipation Health Screening' }
    ]
  };

  const CIERRE = 'O objetivo real do plano não é o 8 de novembro: é chegar a dezembro a treinar 4 dias por costume, sem ciclo on/off. O peso é a consequência, não a meta.';

  const AVISO_LEGAL = 'O teu plano é gerado com as tuas respostas usando fórmulas padrão (Mifflin-St Jeor e fatores de atividade clássicos), com uma margem de ±10% que as regras de ajuste corrigem com os teus dados reais. Nada disto substitui aconselhamento médico: perante qualquer patologia, dor persistente ou dúvida, consulta um profissional de saúde.';

  /* ---------- TEXTOS DE INTERFACE (traduzíveis como o resto) ----------
     Modelos com {x}: app.js preenche-os com tpl(). Ao mudar de idioma
     carrega-se assets/data.<lang>.js, que substitui TODO o window.B2P.    */
  const UI = {
    lang: 'pt',
    tabs: ['Hoje', 'Plano', 'Exercícios', 'Comida', 'Progresso', 'Conquistas'],
    dias: ['segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado', 'domingo'],
    diasIni: ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
    calComidas: 'As refeições do dia',
    meses: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
    hoyTag: 'HOJE',
    semanaLinea: 'Semana {w} de {t} · Fase {f} · {n} · RPE teto {r}',
    empiezaEnDias: 'Começa daqui a {n} dias', empiezaEn1: 'Começa daqui a 1 dia', empiezaLunes: 'Começa na segunda',
    preplanSub: '{f} · Fase 1 em casa. Entretanto, deixa a linha de base pronta:',
    prepCintura: 'Mede a cintura em jejum (à altura do umbigo)',
    prepFotos: 'Fotos dia 0: frente e perfil, mesma luz que vais usar sempre',
    prepCompra: 'Compras da semana 1 (lista em Comida)',
    prepBascula: 'Decide onde e quando te pesas: segunda-quarta-sexta em jejum',
    practicaMenu: 'Podes praticar o menu já: o {f} vai a sério.',
    descanso: 'Descanso', domingoPrep: 'Domingo: descanso + meal prep', planCompletado: 'Plano concluído',
    calentamiento: 'Aquecimento · 6′',
    sesionSub: '{d} · descansos em cada linha (toca para cronometrar)',
    tendonNombre: 'Protocolo tendão',
    cardioHecho: '✓ Cardio feito', cardioMarcar: 'Marcar cardio feito', minutosReales: 'Minutos reais:',
    cadenciaSub: 'Cadência 170-180 · passada curta', recuperacionSub: 'Recuperação ativa', opcional: 'opcional',
    tibialisAviso: 'Antes: tibialis raises 2×20 (protocolo tendão).',
    diaADia: 'O dia a dia',
    hPasos: '8-10k passos', hPasosSub: 'Todos os dias',
    hProte: 'Proteína 4/4', hProteSub: '4 tomas ≥{q} g',
    hPeso: 'Peso em jejum', hPesoSub: 'Média semanal, não o dia solto',
    hCintura: 'Cintura (segunda)', hCinturaSub: 'A métrica rainha · ao umbigo, sem apertar',
    hPrep: 'Meal prep', hPrepSub: '~90′ e semana resolvida',
    hFoto: 'Fotos de progresso', hFotoSub: 'Frente e perfil, mesma luz',
    pesoGuardado: 'Peso guardado: {v} kg', cinturaGuardada: 'Cintura: {v} cm',
    marcarHecho: 'Marcar feito', usarPeso: 'Usar este peso',
    diaAnterior: 'Dia anterior', diaSiguiente: 'Dia seguinte',
    cerrarPanel: 'Fechar', panelSinTitulo: 'Detalhe',
    ajIdiomaSinRed: 'Sem ligação: não foi possível descarregar esse idioma.',
    versionNueva: 'Versão nova · toca para atualizar',
    quizAfinara: 'Isto vai afinar o teu plano.', quizTitulo: 'Os teus gostos', quizPista: 'Desliza: direita gosto, esquerda não',
    quizSi: 'Gosto', quizNo: 'Não é para mim', quizDeshacer: 'Desfazer', quizSaltar: 'Saltar',
    quizListo: 'Pronto', quizResumen: 'Gostas de {a} de {b}. Isto vai afinar o teu plano.',
    gen: { kcalHueco: 'Este menu soma ~{m} kcal por dia e o teu objetivo é {k}: {q}. As receitas vêm em tamanho fixo; ajusta o arroz, a massa ou o pão da refeição principal.', kcalSube: 'faltam-te ~{d}', kcalBaja: 'sobram-te ~{d}', chkDentro: 'dentro', chkBajo: 'abaixo', chkAlto: 'acima', lChkD2: 'Peso dentro do corredor na semana {s}.', tHombroT: 'Ombro · coifa e serrátil', tHombroD: 'Rotação externa com banda 2×15 por lado e elevação em Y deitado 2×12, lentas. Antes de qualquer empurrão e em dias soltos. A coifa não ganha com peso: ganha com controlo.', tHombroW: 'Em casa com banda, ou com o haltere mais leve que tiveres.', descargaSinBarra: 'Mesma rotina com metade das séries e a mesma carga. Não é parar: é manutenção de tecido e férias para tendões e articulações.', r2SinBarra: 'Primeiro sobe repetições dentro do intervalo, depois sobe carga (o salto mais pequeno que tiveres: mais um haltere, uma banda mais dura ou uma variante mais difícil). Só se a técnica esteve limpa em TODAS as séries. A app sugere-o sozinha.', protHueco: 'Do menu saem ~{m} g de proteína por dia; até aos teus {p} g, a ponte são as tomas extra (batido ou mais uma porção).', finRecapT: 'O teu bloco, em números', subCorporal: 'Ao peso do corpo: chega limpo ao topo das repetições e sobe de variante.', subRepe: 'Segunda volta: sem material não há trinta variantes, e repetir o padrão com técnica limpa continua a construir.', f2nCasa: 'Entrada em carga', f2oCasa: 'Reaprender os básicos com halteres e bandas e construir base de carga. Trabalha a 65-70% do que sentes que podias, com 3 repetições na reserva SEMPRE.', f2nNada: 'Progressão corporal', f2oNada: 'Dominar as progressões com o teu próprio corpo e construir base. A alavanca sobe antes das repetições: variante mais difícil só com técnica limpa.', gemNota: 'O gémeo lento é o seguro do tendão: não o saltes.', tendonSinTrote: 'A força volta em semanas; o tendão precisa de meses (o seu colagénio renova-se ~10 vezes mais devagar e não tem memória muscular). Este bloco é o seguro do plano: começa na semana 1 e acompanha o bloco todo.', introNunca: 'Plano revisto contra a evidência (metanálises e ensaios 2010-2025). A ideia que ordena tudo: quem começa do zero progride depressa, os primeiros meses são os de maior ganho de força da tua vida, mas o tecido conjuntivo vem atrás do músculo. Por isso as cargas sobem devagar mesmo que consigas mais.', introActivo: 'Plano revisto contra a evidência (metanálises e ensaios 2010-2025). A ideia que ordena tudo: quem já treina não precisa de mais fúria, precisa de melhor dose. O volume certo, a progressão registada e o descanso contado separam manter-se de melhorar.', cNuncaT: 'Começar do zero', cNuncaD: 'O primeiro ano é o de maior ganho de força da vida: quase qualquer dose bem feita funciona, por isso os programas extremos sobram. A técnica vem primeiro: as repetições limpas de hoje são os quilos seguros daqui a três meses.', cNuncaR: 'ganhos de novato: revisões ACSM e metanálises de dose-resposta', cActivoT: 'Acrescentar sem te partires', cActivoD: 'O risco de quem já treina é empilhar volume novo sobre o velho. Os saltos acima de ~1,3× a tua carga média recente disparam as lesões: acrescenta uma variável de cada vez (dias, volume ou intensidade), nunca as três.', cActivoR: 'consenso COI de carga de treino (ACWR)', cSupT: 'Superavit que constrói', cSupD: 'Para ganhar músculo basta um superavit pequeno (~250-350 kcal): acima disso, o extra vai para gordura. A balança deve subir devagar; se sobe depressa, não é músculo, porque a síntese proteica tem teto semanal.', cSupR: 'Garthe 2013 · Slater 2019 (superavit e composição)', r1Nunca: 'Cada fase tem o seu teto de esforço. A começar do zero, a força sobe mais depressa do que a resistência dos teus tecidos: deixa sempre 2-3 repetições na reserva e os ganhos chegam na mesma, sem portagens.', r1Activo: 'Cada fase tem o seu teto de esforço. Já vens a treinar, mas este volume é novo: respeita os tetos de RPE nas duas primeiras semanas e sobe depois. Travar a tempo é o que te deixa progredir as {s} semanas seguidas.', r8Nunca: 'O inimigo do início não é a dureza, é a irregularidade. A semana caótica tem um chão: 2 de força + 1 de cardio. Isso mantém tudo a andar.', r8Activo: 'Também quem treina tem semanas impossíveis. O chão: 2 de força + 1 de cardio. Com isso não se perde nada; o resto recupera-se.', f1nNunca: 'Alicerces', f1oNunca: 'Construir o hábito e aprender os padrões de movimento sem castigar articulações. Ficar com vontade de mais é de propósito.', f2nNunca: 'Técnica', f2oNunca: 'Aprender os básicos com carga leve: cada repetição limpa de agora são quilos seguros depois. Trabalha longe da falha SEMPRE.', f3oNunca: 'Volume e intensidade a sério, já com a técnica rodada. Acaba cada série a poder fazer mais 2 repetições, das a sério.', f1nActivo: 'Base', f1oActivo: 'Duas semanas de adaptação ao plano: dose conhecida, registo a andar e técnica afinada antes de subir seja o que for.', f2nActivo: 'Construção', f2oActivo: 'Volume progressivo sobre a tua base: trabalha a 70-75% do que sentes que podias, com 2-3 repetições na reserva.', f3oActivo: 'Volume e intensidade reais para forçar a mudança. Acaba cada série a poder fazer mais 2 repetições, e que sejam reais.', cierrePerder: 'O objetivo real do plano não é o {f}: é chegar lá a treinar por costume, sem ciclo on/off. O peso que desce é a consequência, não a meta.', cierreRecomp: 'O objetivo real do plano não é o {f}: é chegar lá com o hábito feito e a roupa a assentar de outra maneira. A recomposição é lenta por desenho: a constância é a meta.', cierreGanar: 'O objetivo real do plano não é o {f}: é chegar lá mais forte na barra e com o hábito feito. O músculo constrói-se em meses: o bloco seguinte começa onde este acaba.', cierreManten: 'O objetivo real do plano não é o {f}: é que treinar deixe de ser um plano e passe a ser um costume. Manter é ganhar.', cierreRenueva: 'Para renovar o bloco: Definições, Criar / refazer o meu plano. Dois toques e segues.', platoVegetariano: '3 ovos + 2 claras, ou 250 g de skyr ou queijo fresco batido + whey, ou 200 g de tofu firme, ou 150 g de tempeh, ou 250 g de leguminosa cozida + 1 ovo. Referência visual: palma da mão e meia.', platoVegano: '200-250 g de tofu firme, ou 150-180 g de tempeh, ou 250 g de leguminosa cozida + uma colher de proteína vegetal, ou 80 g (em seco) de soja texturizada. Referência visual: palma da mão e meia.', suplVegT: 'Proteína vegetal', suplVegD: '1 colher de proteína de ervilha ou soja na toma antes de dormir (e outra onde fizer falta nos dias curtos de proteína).', numRecomp: 'Défice suave ~300-450 kcal/dia: recompor pede paciência, não agressividade.', numSup: 'Superavit ~250-350 kcal/dia: mais não é mais músculo, é mais gordura (Garthe 2013).', numMan: 'A tua manutenção estimada: a média semanal julga e ajusta.', ritmoSubeT: 'Ritmo de subida esperado', ritmoManT: 'Ritmo esperado', ritmoSubeN: '≈0,25% do peso/sem: o que o músculo consegue construir. Média semanal, não dia a dia.', ritmoManN: 'A média semanal deve ficar a ±0,3 kg da tua partida.', wjN1: 'Andar-correr I', wjN2: 'Andar-correr II', wjN3: 'Andar-correr III', lChkN: 'Checkpoint S{s}', lChkD: 'Peso dentro ou melhor do que o corredor na semana {s}.', alRapidoBaja: 'Junta 150 kcal de hidratos. A este ritmo o défice também come músculo.', alLentoBaja: 'Revê porções e passos uns dias antes de cortar seja o que for; se continuar plano, tira 100 kcal de hidratos só nos dias de descanso.', alRapidoSube: 'Sobes mais depressa do que se constrói músculo: corta 150 kcal de hidratos para que o extra não seja gordura.', alLentoSube: 'O superavit não aparece na balança: junta 150 kcal de hidratos nos dias de treino.', alMantenT: 'Estás a afastar-te da manutenção', alMantenD: 'Duas semanas seguidas de deriva: ajusta 100-150 kcal na direção contrária e não mexas no treino.', circProg: 'Sobe 1-2 repetições por semana onde chegares com técnica limpa: essa é a progressão.', durAprox: '≈{m}′', splitFbC: 'Corpo inteiro', splitTpC: 'Tronco · Perna', splitPplC: 'Push · Pull · Legs', faseSub: '{s} ×{d}', nf1: 'F1–F2 (sem 1-{a})', nf2: 'F3 (sem {b}-{c})', nf3: 'F4 (sem {d}-{e})', dietBreakNota: 'Semana {w}: DIET BREAK a ~{k}', hitoCribadoT: 'Rastreio de saúde', hitoCribadoD: 'Antes da fase de carga, se levas anos sem atividade vigorosa: tensão numa farmácia e análises básicas (lípidos, glicose). 15 minutos que compram descanso de espírito.', hitoDietT: 'DIET BREAK', hitoDietD: 'A semana toda comes à manutenção (~{k} kcal: +2 porções de hidratos por dia, proteína igual). O treino não muda. Restaura NEAT e leptina e quebra o ciclo on/off. Na segunda seguinte, défice outra vez.', hitoDescargaT: 'DESCARGA (não é opcional)', hitoDescargaD: 'Mesma rotina com metade das séries e o mesmo peso na barra. Não é parar: é manutenção de tecido e férias para tendões e articulações.', tomaNocheAlt: '+ todas as noites: toma antes de dormir com a tua proteína vegetal (soja ou ervilha), ~40 g em batido. ', franjaM: 'Treinas de manhã: toma o pequeno-almoço depois do treino, não antes.', franjaMd: 'Treinas ao meio-dia: a refeição forte cai logo a seguir ao treino.', franjaT: 'Treinas à tarde: algo leve antes; o jantar faz de refeição pós-treino.', cardioLibreT: 'Cardio: {d}', cardioLibreD: '{m}′ a ritmo confortável e constante. O teu desporto conta tanto como a corrida: a constância é que manda.', chk1: 'Fora do corredor: revê porções e passos antes de mexer em nada. Nas primeiras semanas também se mexe água.', chk2: 'Duas semanas fora: ajusta 150 kcal de hidratos na direção que calhar. A proteína não se toca.', chk3: 'Fecho: fotos, medidas e o bloco seguinte, decidido com dados.', lKgN: '−{v} kg', lKgD: 'Média semanal {v} kg abaixo da partida.', lKgUpN: '+{v} kg', lKgUpD: 'Média semanal {v} kg acima da partida. Músculo, tijolo a tijolo.', lCintN: 'Cintura −{v}', lCintD: 'Cintura abaixo de {v} cm.', lReinaN: 'Métrica rainha', lReinaD: 'Cintura abaixo de metade da tua altura: {v} cm.', lFinDesc: 'Plano de {s} semanas terminado. A meta era o hábito; o resto é consequência.', marca: 'Plano gerado à tua medida', cuida: 'cuidado: {a}', datos: '{p} kg · {a} cm · {e} anos', menuAviso: '{n} pratos do menu não encaixam na tua dieta: troca-os por qualquer um do receituário, já filtrado para ti.', prepNota: 'Só as receitas marcadas «batch» ficam feitas ao domingo; o resto cozinha-se na hora. As quantidades das compras já contam as repetições da semana.' },
    pBarraT: 'A barra do plano', pBarraSub: '{a} de {b} discos carregados',
    patrones: { eh: 'Empurrão horizontal', ev: 'Empurrão vertical', th: 'Puxada horizontal', tv: 'Puxada vertical', rod: 'Dominante de joelho', bis: 'Dobradiça de anca', zan: 'Afundo', core: 'Core estável', flex: 'Flexão de tronco', curl: 'Flexão de cotovelo', ext: 'Extensão de cotovelo', gem: 'Gémeo', ais: 'Isolamento' },
    quizCatEj: 'Exercício', quizCatDep: 'Desporto', quizCatCom: 'Comida',
    alta: { t: 'Cria o teu utilizador', sub: 'Força, comida e progresso. Um plano feito à tua medida, em dois minutos.', nombreL: 'O teu nome', ph: 'Como te chamamos?', cta: 'Começar', local: 'Os teus dados vivem só neste dispositivo. Sem contas, sem nuvem.', valNombre: 'Escreve um nome de 2 a 24 letras.', idioma: 'Idioma' },
    rev: { evFecha: 'termina a {b}, mesmo antes', evSinFecha: 'sem data: manda o prazo que escolheste', minT: '{v} minutos por sessão', minSub: 'sessões cortadas ao essencial: os básicos ficam', evT: 'Objetivo: {e}', evSub: 'a data manda: constância acima de perfeição', durOpen: 'Sem data: blocos de {s} semanas, renováveis', t: '{n}, o teu plano está pronto', tAnon: 'O teu plano está pronto', sub: 'Decidido com as tuas respostas. Isto não é um modelo.',
      splitT: 'Força {d} dias por semana', splitFb: 'corpo inteiro: o que mais rende com poucos dias', splitTp: 'tronco / perna, aos pares', splitPpl: 'empurrar / puxar / perna',
      kcalT: '{k} kcal por dia', kDef: 'défice de {v} kcal: perder gordura sem oferecer músculo', kSup: 'superavit de {v} kcal para construir músculo', kMan: 'na tua manutenção, com a proteína ao comando',
      protT: '{p} g de proteína por dia', protSub: '{v} g por quilo do teu peso',
      durT: '{s} semanas pela frente', durSub: 'de {a} a {b}',
      subsT: '{n} exercícios substituídos', subsSub: 'pelo teu material ou pelas tuas rejeições',
      cuidaT: 'Cuidado extra: {a}', cuidaSub: 'os exercícios que lhe tocam levam aviso',
      menuT: 'Menu ajustado à tua mesa', menuSub: 'dieta e intolerâncias aplicadas à semana inteira', menuAv: '{n} pratos continuam a não encaixar: vais vê-lo avisado em Comida',
      gustosT: '{a} gosto · {b} rejeições', gustosSub: 'o que rejeitaste não aparece no teu plano',
      cta: 'Ver a minha semana 1', micro: 'Refaz o questionário quando quiseres: tudo se recalcula.' },
    tour: { salta: 'Saltar', sigue: 'Seguinte', listo: 'A treinar', pasos: [
      ['Isto é HOJE', 'O teu dia, já montado: sessão, refeições e registo. Marca ✓ e a app leva as contas.'],
      ['A barra move-te', 'Hoje, Plano, Exercícios, Comida, Progresso e Conquistas. Toca, ou arrasta a bolha.'],
      ['O plano inteiro', 'Um calendário com as fases coloridas: toca num dia e vês o seu treino e as suas refeições.'],
      ['A tua mesa', 'Menu semanal, receitas com foto, compras e meal prep, já filtrados para ti.'],
      ['Progresso honesto', 'Peso, cintura, cargas e constância. Se vais depressa demais, a app trava-te.'] ] },
    cuest: {
      evFechaT: 'Que dia é?', evFechaP: 'Com a data, o plano termina mesmo antes. Sem ela, manda o prazo que escolheres.', evFechaSaltar: 'Ainda não sei', evFechaMal: 'Escolhe uma data entre 2 e 12 meses a partir de hoje.',
      resLObj: 'Objetivo', resLEv: 'Para', resLDur: 'Prazo', resLHist: 'Vens de', resLMat: 'Material', resLDieta: 'Mesa', resLFranja: 'Altura', resLLes: 'Cuidado', resLSin: 'Evitas',
      gateT: 'A tua saúde manda', gateTxt: 'Marcaste que uma condição médica limita o teu exercício. Antes de gerar seja o que for, mostra ao teu médico o que queres fazer (força {d} dias por semana) e pede-lhe luz verde.',
      gateGuardado: 'As tuas respostas ficam guardadas para quando voltares.', gateOk: 'Tenho luz verde', gateSalir: 'Sair por agora',
      gateHoyT: 'Em pausa, com motivo', gateHoyTxt: 'O questionário ficou a meio: falta a luz verde do teu médico. Com ela, o teu plano é gerado na hora.', gateVolver: 'Retomar o questionário',
      resCta: 'Gerar o meu plano', resGen: 'A gerar o teu plano…',
      titulo: 'O teu plano, à medida', atras: 'Atrás', sigue: 'Continuar',
      sexoT: 'O teu corpo', sexoP: 'Usa-se só para calcular as tuas calorias.', sexoH: 'Homem', sexoM: 'Mulher', sexoX: 'Prefiro não dizer',
      medidasT: 'As tuas medidas', edadL: 'Idade', alturaL: 'Altura (cm)', pesoL: 'Peso (kg)', cinturaL: 'Cintura (cm) · opcional',
      objT: 'O que procuras?', objPerder: 'Perder gordura', objRecomp: 'Recompor: menos gordura, mais músculo', objGanar: 'Ganhar músculo', objMantener: 'Manter-me',
      evT: 'Para quê?', evBoda: 'Um casamento', evOpo: 'Um concurso público', evVerano: 'Operação verão', evSiempre: 'Para sempre',
      durT: 'Quanto tempo te dás?', dur3: '3 meses', dur6: '6 meses', dur12: '12 meses', durAlways: 'Sem data: hábito',
      histT: 'De onde vens?', histP: 'O regresso programa-se de outra maneira: o tendão marca o ritmo.', histNunca: 'Nunca treinei', histRetoma: 'Volto após anos sem treinar', histActivo: 'Treino agora',
      diasL: 'Dias por semana', minL: 'Minutos por sessão', franjaT: 'Quando preferes?', franjaM: 'Manhã', franjaMd: 'Meio-dia', franjaT2: 'Tarde-noite',
      matT: 'Com que material?', matNada: 'Sem material', matCasa: 'Casa: halteres e bandas', matGym: 'Ginásio completo',
      lesT: 'Incómodos ou lesões?', lesRodilla: 'Joelho', lesHombro: 'Ombro', lesLumbar: 'Lombar', lesNo: 'Nenhuma',
      medT: 'Alguma condição médica que limite o exercício?', si: 'Sim', no: 'Não',
      dietaT: 'A tua mesa', dietaNormal: 'Como de tudo', dietaVegetariano: 'Vegetariano', dietaVegano: 'Vegano',
      sinT: 'Evitas alguma coisa?', sinGluten: 'Glúten', sinLactosa: 'Lactose', sinFrutos: 'Frutos secos', sinNada: 'Nada',
      resT: 'O teu perfil está pronto', resP: 'Com isto vai gerar-se o teu plano: treino, refeições e progressão.',
      resGustos: '{a} gosto · {b} rejeições', resProfesional: 'Antes de gerar um plano, consulta um profissional de saúde: alguma das tuas respostas pede-o.',
      resGuardar: 'Guardar perfil', resGuardado: 'Perfil guardado', resProx: 'A geração do plano chega na fase seguinte.',
      valNum: 'Revê {c}: entre {a} e {b}.'
    },
    gPeso: 'Gráfico de peso corporal', gCintura: 'Gráfico de cintura',
    gCargas: 'Gráfico de cargas', gAdherencia: 'Gráfico de adesão semanal',
    gRango: '{n} registos, de {a} a {b} {u}', gUnico: '1 registo, {a} {u}',
    gSemanas: '{n} de {t} semanas com dados',
    gSinDatos: 'ainda sem dados',
    fSinRegistro: 'Ainda não registaste peso aqui. Assim que o fizeres, vais ver quanto falta.',
    valFuera: 'Introduz um valor entre {a} e {b} {u}.', descargaDosis: 'descarga',
    hechosDe: 'Feitos {a} de {b} · com {c} conta como sessão',
    cerrarSinSesion: 'Fechar sem sessão', diaCerradoSinRacha: '✓ Dia fechado',
    sinRachaHoy: 'Hoje não soma à sequência.', mejorRachaNota: 'A tua melhor: {n} dias.',
    sinSesionToast: 'Dia fechado sem sessão: hoje não conta.',
    reabrirDia: 'Reabrir dia', diaReabierto: 'Dia reaberto', mejorLbl: 'Melhor',
    cerrarDia: 'Fechar o dia', diaCerradoBtn: '✓ Dia fechado · sequência {n}',
    diaCerradoToast: '✓ Dia fechado. Sequência: {n}', diaCerradoSolo: 'Dia fechado.',
    sigueEditando: 'Podes continuar a editar: tudo se guarda sozinho.',
    comidaHoy: 'A comida de hoje', comidaHoySub: '{kcal} kcal · {p} g de proteína em 4 tomas',
    desayuno: 'Pequeno-almoço', comidaLbl: 'Almoço', cena: 'Jantar', presueno: 'Antes de dormir',
    comidaLibreMn: 'REFEIÇÃO LIVRE', comidaLibreTitulo: 'Refeição livre', comidaLibreTag: 'uma refeição, não um dia', tuya: 'tua',
    dietBreakChip: 'Diet break: +2 porções de hidratos hoje. Proteína igual.',
    extraChip: 'Extra F{f}: uma peça de fruta + 40 g de pão ao almoço.',
    sugEmpieza: '◆ começa em {v}', sugRepite: '↻ repete {v}',
    faltaTitle: 'Toca se NÃO completaste todas as reps',
    repsAMediasToast: 'Marcado: faltaram reps (vais repetir peso)', repsLimpiasToast: 'Todas as reps limpas',
    repsAMediasTag: 'reps a meio', repsLimpias: 'reps limpas', repsCortas: 'faltaram reps',
    prToast: 'PR em {e}: {v} kg', ya: 'JÁ!',
    fHistorial: 'O teu histórico', fMejor: 'melhor {v} kg', fHoy: 'hoje',
    fComo: 'Como se faz', fErrores: 'Erros que te vão roubar progresso', fAlt: 'Alternativas equivalentes',
    fArranque: 'Arranque sugerido', fArranqueTxt: '{v} kg na semana 3.',
    fMarca: 'A tua marca de então: {t}',
    fFaltan: 'Faltam-te {v} kg para a recuperares. Há uma conquista à tua espera.',
    fRecuperada: 'Recuperada. Esse peso volta a ser teu.',
    fVideo: 'Ver técnica em vídeo',
    fDomiBtn: 'Hoje saiu a minha primeira elevação SEM assistência!', fDomiOk: 'Registada', fDomiYa: 'Elevação livre já registada',
    segPlan: ['Fases', 'Regras', 'Exercícios', 'Ciência'],
    vReglas8: 'As 8 regras', vReglasSub: 'se hesitas, ganha a regra',
    vCalendario: 'Calendário', vFasesDetalle: 'As 4 fases, ao detalhe',
    vSeguros: 'Os seguros do plano', libDescartado: 'rejeitado', libSinMaterial: 'sem material', libFuera: 'fora do teu plano', vBiblioteca: 'Biblioteca de exercícios', vTocaCualquiera: 'toca em qualquer um',
    vCiencia: 'A ciência do plano',
    senalesTitulo: 'Sinais para parar', objetivoReal: 'O objetivo real', recuerda: 'Lembra-te',
    fase: 'Fase', sem: 'Sem', fechasLbl: 'Datas', especial: 'Especial', fuerzaLbl: 'Força',
    seriesLbl: 'Séries', descLbl: 'Desc.', ejercicioLbl: 'Exercício', diaLbl: 'Dia',
    cardioFase: 'Cardio da fase',
    zonas: { empuje: 'Empurrar', tiron: 'Puxar', pierna: 'Perna e anca', core: 'Core' },
    chipsNutri: ['Objetivo', 'O prato', 'Receitas', 'Menu', 'Compras', 'Meal prep', 'Suplementos'],
    nObjetivo: 'O teu objetivo agora', nSemana: 'semana {w}',
    nNumeros: 'De onde saem os números', nPlato: 'Como montar cada refeição',
    nRecetario: 'Receituário', nToca: 'toca para cozinhar', nMenu: 'Menu semanal',
    nCompra: 'As compras da semana', nPrepDom: 'Meal prep de domingo', nSupl: 'Suplementos',
    nReiniciar: 'reiniciar', nProteLbl: 'Prote', nGrasaLbl: 'Gordura', nCarbosLbl: 'Hidratos', kcalLbl: 'kcal',
    nDietBreakTitulo: 'Esta semana: DIET BREAK', nDietBreakTxt: '~{k} kcal: +2 porções de hidratos por dia. Proteína igual. Treino igual.',
    nTomaNota: '+ todas as noites: toma antes de dormir (skyr + whey). ',
    nIngredientes: 'Ingredientes (1 porção)', nPasos: 'Passos', opcionalParen: ' (opcional)',
    chipsProg: ['Resumo', 'Peso', 'Cintura', 'Cargas', 'Semanas', 'Checkpoints'],
    pPeso: 'Peso', pPerdido: 'Perdido', pGanado: 'Ganho', pCintura: 'Cintura', pAdh: 'Adesão', pSesiones: 'Sessões', pRacha: 'Sequência',
    pMediaS: 'média S{w}', pSinDatos: 'sem dados', pDesde: 'desde {v}', pCinturaSub: '{f} · meta <{m}', pCinturaLunes: 'segunda em jejum',
    pFuerzas: '{a}/{b} de força', pDeFuerza: 'de força', pDiasCumplidos: 'dias cumpridos',
    pPesoTitulo: 'Peso', pPesoSub: 'pontos: pesagens · linha: média semanal · banda: corredor esperado',
    pCinturaTitulo: 'Cintura', pCinturaTituloSub: 'a métrica rainha · objetivo <{m} cm',
    pCargas: 'Cargas', pCargasSub: 'peso do exercício, sessão a sessão',
    pAdhTitulo: 'Adesão', pAdhSub: 'sessões de força concluídas por semana',
    pChk: 'Checkpoints', pEsperado: 'Esperado', pReal: 'Real', pSiDesvias: 'Se te desviares',
    pTabla: 'tabela', pGrafica: 'gráfico', pFecha: 'Data',
    pLifts: { 'press-banca': 'Supino', 'sentadilla-barra': 'Agachamento', 'rdl-barra': 'Romeno' },
    pTuMarca: 'a tua marca · {v} kg', pMeta91: 'meta {m}', pAguaCreatina: 'água (primeiras semanas)', pLineaBase: 'Linha de base',
    pMediaSemana: 'Média S{w}',
    pVacioPeso: 'As pesagens de segunda, quarta e sexta vão aparecer aqui',
    pVacioCintura: 'Todas as segundas em jejum: fita ao umbigo, sem apertar',
    pVacioCargas: 'Assim que registares kg neste exercício, vais ver aqui a escalada',
    pVacioAdh: 'Semana a semana, aqui vai ver-se a tua constância',
    pCheckpointSemana: 'Semana de checkpoint', pEsperadoRango: 'Esperado: {a}–{b} kg', pLlevas: ' · vais em {v}', pSinPesajes: ' · ainda sem pesagens esta semana',
    pRapido: 'Vais depressa demais', pLento: 'Ritmo abaixo do esperado',
    pFrenaTrote: 'Trava a corrida', pFrenaTxt: 'Esta semana levas {r}× a tua média recente de minutos a correr. Acima de 1,3× o risco de lesão dispara: corta ou caminha.',
    lDiscos: 'A coleção de discos', lDiscosSub: 'um por fase concluída',
    lLogros: 'Conquistas', lFuerzas: 'Sessões de força', lPRs: 'PR', lPerdido: 'Perdido', lMejorRacha: 'Melhor sequência', lLogrosN: 'Conquistas', lFotos: 'Fotos',
    perfilCinturaAdd: '+ Adicionar cintura', perfilCinturaNota: 'Passa a ser a tua linha de base e ativa a meta e as conquistas de cintura. O resto do plano não muda.', cerrarSesion: 'Terminar sessão', cerrarSesionNota: 'Voltas à porta de entrada. O teu plano e os teus registos ficam guardados neste dispositivo.', rehacerSub: 'O que queres refazer?', rehacerTodo: 'Questionário completo', rehacerTodoSub: 'Dados e gostos, de cima a baixo.', rehacerDatos: 'Só os meus dados', rehacerDatosSub: 'Idade, objetivo, dias, material… O baralho não se toca.', rehacerGustos: 'Só os meus gostos', rehacerGustosSub: 'O baralho de cartas, do zero.', perfilDetrasT: 'Por trás do plano', buscarT: 'Procurar na app', buscarPH: 'Exercício, prato, secção…', buscarNada: 'Nada com esse nome. Tenta outra palavra.', chipFases: 'Fases ao detalhe', perfilT: 'O meu perfil', perfilDatosT: 'As tuas respostas', perfilPlanT: 'O teu plano, em resumo', ajustes: 'Definições', ajustesSub: 'BACK2PRIME · os teus dados vivem SÓ neste dispositivo',
    ajLineaBase: 'Linha de base', ajCinturaIni: 'Cintura inicial (cm)', ajGuardar: 'Guardar linha de base', ajGuardado: 'Guardado',
    ajCopia: 'Cópia de segurança',
    ajCopiaTxt: 'Os dados não saem do telemóvel. Faz uma cópia de vez em quando (ou antes de mudar de dispositivo) e guarda-a onde quiseres.',
    ajExportar: 'Exportar', ajImportar: 'Importar', ajImportOk: 'Cópia restaurada', ajImportErr: 'Esse ficheiro não parece uma cópia do BACK2PRIME',
    ajIdioma: 'Idioma', ajIdiomaNota: 'A app recarrega ao mudar. Os teus dados não se tocam.',
    ajRehacer: 'Criar / refazer o meu plano', ajRehacerNota: 'Leva-te ao questionário. Ao gerar de novo, os teus registos diários não se tocam.', ajPeligro: 'Zona perigosa', ajBorrar: 'Eliminar perfil e todos os dados', ajBorrarConfirma: 'De certeza? Toca outra vez para apagar TUDO',
    obTitulo: 'Bem-vindo ao BACK2PRIME', obSub: '12 semanas · 17 ago → 8 nov · de 95 à tua melhor versão',
    obTexto: 'O teu caderno de treino, o teu plano e a tua nutrição num só sítio. Marca o que fazes cada dia: a app sugere-te os pesos, vigia o teu ritmo e larga conquistas. Fica tudo no teu telemóvel.',
    obConsejo: 'Dica: adiciona-a ao ecrã principal (Partilhar → Adicionar ao ecrã principal) para a usares como uma app a sério.',
    obCintura: 'Cintura inicial — a tua métrica rainha', obPlaceholder: 'cm (opcional, podes fazê-lo depois)', obEmpezamos: 'Vamos a isto',
    celebraOk: 'Seguimos',
    navAria: 'Navegação principal',
    nube: { correoL: 'E-mail', claveL: 'Palavra-passe (mínimo 8)', entrar: 'Entrar', crear: 'Criar conta', aCrear: 'Primeira vez? Cria a tua conta', aEntrar: 'Já tens conta? Entra', olvide: 'Esqueci-me da palavra-passe', enviadoReset: 'E-mail enviado: abre a ligação para a mudar', nuevaClaveT: 'Escolhe uma palavra-passe nova', guardarClave: 'Guardar palavra-passe', cambiada: 'Palavra-passe mudada: já podes entrar', confirmaCorreo: 'Vê o teu e-mail e confirma a conta; depois entra aqui', yaExiste: 'Esse e-mail já tem conta: entra com a tua palavra-passe', errCred: 'E-mail ou palavra-passe errados', errCorreo: 'Escreve um e-mail válido', errClaveCorta: 'A palavra-passe precisa de pelo menos 8 caracteres', errRitmo: 'Demasiadas tentativas seguidas: espera um momento', errRed: 'Sem ligação ao servidor: tenta outra vez', local: 'A tua conta guarda o teu plano e segue-te em qualquer dispositivo. Só tu o podes ver.', ajustesSub: 'BACK2PRIME · o teu plano vive na tua conta e só tu o podes ver', cerrarSesionNota: 'Voltas à porta de entrada. O teu plano fica na tua conta: entra de novo e segues onde ias.' },
    comp: { t: 'Partilhar o meu plano', nota: 'Cria uma ligação pública só de leitura com o teu plano: sem o teu peso nem os teus registos.', copiado: 'Ligação copiada', quitar: 'Deixar de partilhar', quitado: 'Ligação desativada', vT: 'O plano de {n}', vSub: 'Gerado com o BACK2PRIME', vCta: 'Faz o teu', noExiste: 'Essa ligação não existe ou o dono desativou-a', sem: '{s} semanas', dias: '{d} dias/semana' },
    nuevoDia: 'Novo dia: {f}'
  };

  UI.checkSalidaTitulo = 'Check de saída ({f})';
  UI.checkSalidaTxt = 'Completas ambos os circuitos com as reps da semana 2 sem dor articular → Fase 2. Se algo incomodar, repetes uma semana: os tendões agradecem.';
  UI.planEmpiezaTitulo = 'O plano começa a {f}';
  UI.planEmpiezaTxt = 'Fase 1 · Reativação em casa. Aqui tens tudo para chegares com os trabalhos feitos.';

    const QUIZ_DEP = [{ id: 'running', n: 'Corrida' }, { id: 'natacion', n: 'Natação' }, { id: 'ciclismo', n: 'Ciclismo' }, { id: 'padel', n: 'Padel' }, { id: 'futbol', n: 'Futebol' }, { id: 'baloncesto', n: 'Basquetebol' }, { id: 'volley', n: 'Voleibol' }, { id: 'yoga', n: 'Yoga' }, { id: 'calistenia', n: 'Calistenia' }, { id: 'boxeo', n: 'Boxe' }];
  return { META, FASES, CAL, HITOS_SEMANA, SESIONES, CALENTAMIENTO, TENDON, CARRERA, HISTORICO, ARRANQUE, EJERCICIOS, REGLAS, SENALES, NUTRI, RECETAS, COMPRA, MEALPREP, MEALPREP_NOTA, MENU, CHECKPOINTS, AJUSTES, FOTOS, LOGROS, CIENCIA, CIERRE, AVISO_LEGAL, QUIZ_DEP, UI };
})();
