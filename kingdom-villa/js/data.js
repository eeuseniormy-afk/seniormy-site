/* The Kingdom Villa — conteúdo das campanhas
   © 2026 W. Carolino — CNPJ 69.610.819/0001-77. Um projeto desenvolvido por VillaChurch.
   Referências bíblicas citadas por livro, capítulo e versículo; os trechos narrativos são paráfrases. */

const STATS = {
  fe:   { nome: 'Fé',          icone: '✦', cor: '#f2c96b', desc: 'Comunhão com Deus e firmeza interior. Fé baixa enfraquece suas decisões difíceis.' },
  sab:  { nome: 'Sabedoria',   icone: '❖', cor: '#9fd0ff', desc: 'Conhecimento das Escrituras e discernimento. Ajuda a ler o momento.' },
  seg:  { nome: 'Seguidores',  icone: '☗', cor: '#b8e28f', desc: 'Pessoas que acompanham você e acolhem a mensagem.' },
  prov: { nome: 'Provisões',   icone: '⚱', cor: '#e2b48f', desc: 'Alimento, abrigo e recursos para a jornada. Abaixo de 0, a fadiga consome sua Fé.' },
  inf:  { nome: 'Influência',  icone: '☼', cor: '#ffd98a', desc: 'Alcance da mensagem nas cidades e regiões.' },
  opo:  { nome: 'Oposição',    icone: '⚔', cor: '#ff8a7a', desc: 'Atenção hostil de autoridades religiosas, Herodes ou Roma. Em 100, você é detido antes da hora.' }
};

const LOCAIS = {
  israel: {
    img: 'map_israel',
    pontos: {
      nazare:     { nome: 'Nazaré',               x: 843, y: 215 },
      cafarnaum:  { nome: 'Cafarnaum',            x: 940, y: 128 },
      betsaida:   { nome: 'Betsaida',             x: 1000, y: 120 },
      galileia:   { nome: 'Mar da Galileia',      x: 968, y: 165 },
      cesfilipe:  { nome: 'Cesareia de Filipe',   x: 990, y: 50 },
      jordao:     { nome: 'Betânia além do Jordão', x: 952, y: 470 },
      deserto:    { nome: 'Deserto da Judeia',    x: 805, y: 585 },
      jerusalem:  { nome: 'Jerusalém',            x: 735, y: 520 },
      getsemani:  { nome: 'Getsêmani',            x: 760, y: 505 },
      maqueronte: { nome: 'Maqueronte',           x: 1035, y: 600 },
      cesmar:     { nome: 'Cesareia Marítima',    x: 395, y: 260 },
      jope:       { nome: 'Jope',                 x: 280, y: 410 }
    }
  },
  med: {
    img: 'map_med',
    pontos: {
      roma:      { nome: 'Roma',               x: 222, y: 175 },
      filipos:   { nome: 'Filipos',            x: 640, y: 160 },
      atenas:    { nome: 'Atenas',             x: 585, y: 318 },
      corinto:   { nome: 'Corinto',            x: 545, y: 305 },
      efeso:     { nome: 'Éfeso',              x: 760, y: 290 },
      tarso:     { nome: 'Tarso',              x: 1110, y: 268 },
      antioquia: { nome: 'Antioquia da Síria', x: 1185, y: 290 },
      damasco:   { nome: 'Damasco',            x: 1290, y: 420 },
      jerusalem: { nome: 'Jerusalém',          x: 1245, y: 505 },
      cesmar:    { nome: 'Cesareia Marítima',  x: 1215, y: 455 }
    }
  }
};

/* Ações de gestão: custo em pontos de ação (PA). Cada turno tem 3 PA. */
const ACOES_BASE = {
  orar:    { nome: 'Orar e jejuar',      pa: 1, ef: { fe: +8, prov: -2 },                      txt: 'Você se retira para orar. A alma se aquieta.' },
  estudar: { nome: 'Meditar nas Escrituras', pa: 1, ef: { sab: +7, fe: +2 },                  txt: 'A Lei e os Profetas iluminam o caminho.' },
  pregar:  { nome: 'Pregar ao povo',     pa: 1, ef: { seg: +6, inf: +6, opo: +5, prov: -3 },  txt: 'Multidões se reúnem para ouvir.' },
  servir:  { nome: 'Servir e curar',     pa: 1, ef: { seg: +4, inf: +3, fe: +2, prov: -4 },   txt: 'Doentes e pobres são acolhidos.' },
  ensinar: { nome: 'Ensinar o círculo próximo', pa: 1, ef: { sab: +4, seg: +2, fe: +2 },     txt: 'Os mais próximos aprendem em particular.' },
  prover:  { nome: 'Trabalhar e prover', pa: 1, ef: { prov: +10, fe: -1 },                    txt: 'Trabalho honesto garante o pão.' },
  discreto:{ nome: 'Retirar-se discretamente', pa: 1, ef: { opo: -7, inf: -2 },              txt: 'Você evita os olhares hostis por um tempo.' }
};

const CAMPANHAS = {
  /* ======================================================= JESUS */
  jesus: {
    nome: 'Jesus de Nazaré',
    titulo: 'O Filho do Homem',
    epoca: 'c. 27–30 d.C. · Galileia e Judeia',
    retrato: 'j1_jordao',
    mapa: 'israel',
    trilha: 'jesus',
    resumo: 'Do Jordão ao Getsêmani. Toda tentação de atalho tem um preço: viva a missão sem perder o caminho.',
    nota: 'Nesta campanha, os caminhos alternativos são apresentados como tentações. Os Evangelhos afirmam que Jesus foi tentado em tudo, mas sem pecado (Hb 4:15). Explorar o "e se" serve para entender por que o caminho escolhido importa.',
    inicio: { fe: 70, sab: 60, seg: 0, prov: 30, inf: 5, opo: 0 },
    acoes: {
      prover: { nome: 'Trabalhar como artesão (tékton)', pa: 1, ef: { prov: +10, fe: -1 }, txt: 'Madeira e pedra: o ofício aprendido em Nazaré sustenta a jornada.' },
      servir: { nome: 'Curar os enfermos', pa: 1, ef: { seg: +6, inf: +4, fe: +1, prov: -3, opo: +2 }, txt: 'Leprosos, cegos e paralíticos são restaurados.' }
    },
    capitulos: [
      {
        id: 'j1', titulo: 'As águas do Jordão', ref: 'Mateus 3:13-17; Lucas 3:21-23', local: 'jordao', img: 'j1_jordao', turnos: 1,
        intro: [
          'Você tem cerca de trinta anos. Por anos trabalhou em Nazaré, uma aldeia pequena da Galileia. Agora, notícias correm: um profeta chamado João batiza no Jordão e anuncia que o Reino de Deus está próximo.',
          'Multidões descem de Jerusalém e da Judeia. Você deixa a oficina e caminha até o rio. Quando João o vê, hesita.'
        ],
        decisao: {
          pergunta: 'João diz: "Eu é que preciso ser batizado por ti, e tu vens a mim?" O que você faz?',
          lord: 'Observe o gesto antes da palavra. Quem não tem pecado a confessar entra na água ao lado dos pecadores. É identificação, não necessidade. Começar assim define o tipo de Rei que você será.',
          opcoes: [
            { txt: 'Insistir com humildade: "Deixa por agora, pois convém cumprir toda a justiça."', biblico: true, lord: true,
              ef: { fe: +10, seg: +3, inf: +5 },
              res: 'João consente. Ao sair da água, os céus se abrem, o Espírito desce como pomba e uma voz declara: "Este é o meu Filho amado, em quem me comprazo."' },
            { txt: 'Dispensar o batismo e começar a pregar imediatamente em Jerusalém.', fid: -25,
              aviso: 'Você pula o momento em que, segundo os Evangelhos, o Pai confirma publicamente o Filho e o Espírito o unge para a missão.',
              ef: { inf: +8, opo: +12, fe: -8 },
              res: 'Você sobe a Jerusalém sem passar pelo rio. As pessoas ouvem, mas perguntam: "Com que autoridade fazes isto?" Sem o testemunho do Jordão, a pergunta fica sem resposta.' },
            { txt: 'Convidar João a se tornar seu discípulo ali mesmo.', fid: -15,
              aviso: 'João tem missão própria: preparar o caminho (Is 40:3). Absorvê-lo cedo apaga o papel do precursor que o povo reconhecia como profeta.',
              ef: { seg: +6, sab: -3 },
              res: 'João, surpreso, recusa com respeito: "Não sou digno de desatar tuas sandálias." Ele continua seu próprio chamado, e a multidão fica confusa sobre quem é o maior.' }
          ]
        },
        curiosidade: { txt: 'Betânia além do Jordão (Jo 1:28) é tradicionalmente identificada com Al-Maghtas, na Jordânia, hoje Patrimônio Mundial da UNESCO. Ali foram encontrados vestígios de igrejas bizantinas e piscinas batismais.', refs: ['Jo 1:28', 'Is 40:3', 'Mt 3:15'] }
      },
      {
        id: 'j2', titulo: 'Quarenta dias no deserto', ref: 'Mateus 4:1-11; Lucas 4:1-13', local: 'deserto', img: 'j2_deserto', turnos: 1,
        intro: [
          'Conduzido pelo Espírito, você vai ao deserto da Judeia. Quarenta dias de jejum, entre pedras e feras. A fome é real.',
          'Então vem a voz do tentador, com três ofertas que parecem razoáveis: pão, espetáculo e poder.'
        ],
        decisao: {
          pergunta: '"Se és Filho de Deus, manda que estas pedras se tornem pães." Depois, o pináculo do Templo. Por fim, todos os reinos do mundo. Como você responde?',
          lord: 'Cada oferta é um atalho legítimo na aparência: satisfazer uma necessidade, provar quem você é, conquistar o mundo. O problema não é o fim, é o caminho sem obediência. Israel falhou 40 anos no deserto; aqui a história é refeita.',
          opcoes: [
            { txt: 'Responder com a Escritura: "Não só de pão viverá o homem... Não tentarás o Senhor... Ao Senhor teu Deus adorarás."', biblico: true, lord: true,
              ef: { fe: +15, sab: +8 },
              res: 'O tentador se retira "até momento oportuno". Anjos vêm e o servem. Você volta à Galileia no poder do Espírito.' },
            { txt: 'Transformar as pedras em pão. Afinal, a fome é real.', fid: -30,
              aviso: 'Usar poder em benefício próprio contradiz o padrão de Deuteronômio 8:3 que Jesus cita. A missão passaria a girar em torno da necessidade imediata.',
              ef: { prov: +25, fe: -20, seg: +5 },
              res: 'O pão aparece, quente. A fome passa, mas algo se quebrou: a primeira decisão do ministério foi servir a si mesmo. Mais tarde, as multidões o seguirão pelo pão, e não pela palavra (cf. Jo 6:26).' },
            { txt: 'Aceitar os reinos do mundo e governar com justiça.', fid: -100, fim: 'j_reino_mundo',
              aviso: 'Divergência máxima. Adorar o tentador em troca de poder é abandonar o próprio Reino de Deus. Esta escolha encerra a campanha num final alternativo.',
              ef: { inf: +60, fe: -60 },
              res: 'Você se curva. O mundo é seu.' }
          ]
        },
        curiosidade: { txt: 'As três respostas de Jesus vêm de Deuteronômio 6 a 8, o trecho em que Moisés relembra os 40 anos de Israel no deserto. Os Evangelhos apresentam Jesus revivendo a história de Israel, e vencendo onde o povo caiu.', refs: ['Dt 8:3', 'Dt 6:16', 'Dt 6:13', 'Hb 4:15'] }
      },
      {
        id: 'j3', titulo: 'Pães na encosta', ref: 'João 6:1-15; Marcos 6:30-44', local: 'galileia', img: 'j3_galileia', turnos: 2,
        intro: [
          'Meses se passaram. Em Cafarnaum você chamou pescadores, ensinou no monte e curou muitos. Sua fama correu pela Síria e pela Decápole.',
          'Numa encosta junto ao mar, cinco mil homens, fora mulheres e crianças, comem de cinco pães e dois peixes. Sobram doze cestos. O entusiasmo explode.'
        ],
        decisao: {
          pergunta: 'A multidão quer arrebatá-lo e fazê-lo rei à força. Galileus armados falam em marchar sobre Jerusalém. O que você faz?',
          lord: 'Popularidade não é o mesmo que Reino. Muitos esperam um Messias que expulse Roma, como os macabeus fizeram com os gregos. Revoltas assim acabaram em massacre, como em Séforis no ano 4 a.C. A sua coroa é de outro tipo.',
          opcoes: [
            { txt: 'Despedir a multidão e retirar-se sozinho ao monte para orar.', biblico: true, lord: true,
              ef: { fe: +10, seg: -8, opo: -5 },
              res: 'A multidão se dispersa decepcionada. No dia seguinte, em Cafarnaum, você ensina sobre o "pão da vida" e muitos discípulos o abandonam. Os Doze ficam: "Senhor, para quem iremos?"' },
            { txt: 'Aceitar ser proclamado rei na Galileia.', fid: -40,
              aviso: 'Aceitar a coroa política atrai Herodes Antipas e Roma diretamente. A missão vira um movimento nacionalista.',
              ef: { seg: +25, inf: +20, opo: +45, fe: -15 },
              res: 'Gritos de "Hosana ao Rei da Galileia!" ecoam. Em Tiberíades, Herodes convoca soldados. Em Cesareia, Pilatos é avisado de um novo pretendente ao trono.' },
            { txt: 'Liderar a multidão armada contra Jerusalém e Roma.', fid: -100, fim: 'j_revolta',
              aviso: 'Divergência máxima. Os Evangelhos mostram Jesus recusando a espada (Mt 26:52). Esta escolha encerra a campanha num final alternativo baseado no destino real das revoltas judaicas.',
              ef: { seg: +40, opo: +80, fe: -40 },
              res: 'A marcha começa.' }
          ]
        },
        curiosidade: { txt: 'A multiplicação dos pães é o único milagre, além da ressurreição, narrado nos quatro Evangelhos. A Igreja da Multiplicação, em Tabgha, guarda um mosaico do século V com um cesto de pães e dois peixes.', refs: ['Jo 6:15', 'Jo 6:66-68', 'Mt 14:13-21'] }
      },
      {
        id: 'j4', titulo: 'Noite no Getsêmani', ref: 'Mateus 26:36-56; Lucas 22:39-53', local: 'getsemani', img: 'j4_getsemani', turnos: 2,
        intro: [
          'É Páscoa em Jerusalém. Você entrou na cidade montado num jumentinho, purificou o Templo e enfrentou os principais sacerdotes. Na ceia, partiu o pão: "Isto é o meu corpo."',
          'Agora, no jardim das oliveiras, a angústia é tanta que o suor parece gotas de sangue. Ao longe, tochas. Judas conduz os guardas.'
        ],
        decisao: {
          pergunta: '"Meu Pai, se possível, passe de mim este cálice." As tochas se aproximam. Qual é a sua oração?',
          lord: 'Este é o centro de toda a história. Fugir é possível: o deserto da Judeia fica a poucas horas. Resistir também: Pedro tem uma espada, e "mais de doze legiões de anjos" estariam ao seu dispor. Mas a redenção, segundo o Novo Testamento, passa pelo cálice. Sem ele, não há Páscoa.',
          opcoes: [
            { txt: '"Contudo, não seja como eu quero, mas como tu queres."', biblico: true, lord: true,
              ef: { fe: +25, seg: -15, opo: +30 },
              res: 'Você mesmo se apresenta aos guardas: "Sou eu." Cura a orelha que Pedro feriu. Os discípulos fogem. O caminho segue para a cruz e, ao terceiro dia, o túmulo vazio.' },
            { txt: 'Fugir pela noite de volta à Galileia.', fid: -100, fim: 'j_fuga',
              aviso: 'Divergência máxima. Sem a cruz e a ressurreição, o Novo Testamento afirma que "vã é a nossa fé" (1Co 15:17).',
              ef: { opo: -40, fe: -50 },
              res: 'Você desce o vale do Cedrom na escuridão.' },
            { txt: 'Chamar as doze legiões de anjos.', fid: -100, fim: 'j_legioes',
              aviso: 'Divergência máxima. Jesus menciona essa possibilidade justamente para recusá-la (Mt 26:53-54).',
              ef: { inf: +50, fe: -40 },
              res: 'Você ergue os olhos ao céu e pede.' }
          ]
        },
        curiosidade: { txt: '"Getsêmani" vem do aramaico gat shemanim, "prensa de azeite". No jardim atual, ao pé do Monte das Oliveiras, há oliveiras cuja datação por carbono indica cerca de 900 anos, possivelmente brotos de árvores ainda mais antigas.', refs: ['Mt 26:39', 'Mt 26:53', 'Lc 22:44', '1Co 15:17'] }
      }
    ],
    finais: {
      biblico: { titulo: 'O túmulo vazio', img: 'title',
        txt: ['Você foi crucificado sob Pôncio Pilatos e sepultado num túmulo novo. Ao terceiro dia, mulheres encontraram a pedra removida. Pedro, que o negara, viu o Ressuscitado. Quinhentos o viram de uma vez.', 'Em poucas décadas, a mensagem alcançou Roma. O Reino que você anunciou não veio pela espada, mas por servos dispostos a morrer.'],
        refs: ['Lc 24', '1Co 15:3-8', 'Fp 2:5-11'] },
      j_reino_mundo: { titulo: 'O Império que se curvou', img: 'j2_deserto',
        txt: ['Você ganhou o mundo e governou com mão firme. Houve pão e ordem. Mas nunca houve cruz, perdão dos pecados nem Pentecostes.', 'Os Evangelhos chamam isto de perder a própria alma para ganhar o mundo (Mc 8:36). Na história real, Jesus recusou e venceu de outro modo.'],
        refs: ['Mt 4:8-10', 'Mc 8:36', 'Jo 18:36'] },
      j_revolta: { titulo: 'Fogo sobre Jerusalém', img: 'j3_galileia',
        txt: ['A marcha chegou a Jerusalém, mas as legiões vieram da Síria. Como em Séforis (4 a.C.) e, mais tarde, na guerra de 66-70 d.C., a revolta terminou em cruzes à beira das estradas.', 'Seu nome seria lembrado como o de mais um pretendente messiânico, ao lado de Judas, o Galileu, e Teudas (At 5:36-37). Nada de Igreja, nada de Evangelho.'],
        refs: ['At 5:36-37', 'Mt 26:52', 'Lc 19:41-44'] },
      j_fuga: { titulo: 'Um mestre na Galileia', img: 'j4_getsemani',
        txt: ['Você viveu muitos anos, ensinando em aldeias. Seus ditos foram guardados por alguns, como os de outros sábios de Israel.', 'Mas sem a cruz não houve expiação, e sem ressurreição a fé dos discípulos não teria explicação. O próprio Paulo escreveu que, nesse caso, "somos os mais dignos de compaixão" (1Co 15:19).'],
        refs: ['1Co 15:14-19', 'Hb 9:22', 'Is 53'] },
      j_legioes: { titulo: 'O céu em guerra', img: 'j4_getsemani',
        txt: ['As legiões desceram e ninguém resistiu. Mas Jesus havia dito: "Como, então, se cumpririam as Escrituras?" (Mt 26:54). O poder venceu os soldados, não o pecado nem a morte.', 'O Reino imposto pela força não é o Reino que convida.'],
        refs: ['Mt 26:53-54', 'Is 53:7', 'Jo 10:18'] }
    }
  },

  /* ======================================================= PEDRO */
  pedro: {
    nome: 'Simão Pedro',
    titulo: 'A Pedra',
    epoca: 'c. 28–40 d.C. · Galileia, Jerusalém e Cesareia',
    retrato: 'p1_redes',
    mapa: 'israel',
    trilha: 'pedro',
    resumo: 'Pescador impulsivo, discípulo que caiu e se levantou. A Igreja vai precisar de você.',
    inicio: { fe: 40, sab: 25, seg: 2, prov: 40, inf: 5, opo: 0 },
    acoes: {
      prover: { nome: 'Pescar no mar da Galileia', pa: 1, ef: { prov: +12, fe: -1 }, txt: 'Noites no barco com André, Tiago e João. A rede pesa.' },
      ensinar:{ nome: 'Conversar com os outros discípulos', pa: 1, ef: { sab: +3, seg: +3, fe: +2 }, txt: 'André, Tiago, João: laços que vão sustentar a Igreja.' }
    },
    capitulos: [
      {
        id: 'p1', titulo: 'Redes ao mar', ref: 'Lucas 5:1-11; Mateus 4:18-20', local: 'galileia', img: 'p1_redes', turnos: 1,
        intro: [
          'Você é Simão, filho de Jonas, pescador de Betsaida que mora em Cafarnaum. Trabalhou a noite inteira e não pegou nada.',
          'Um mestre de Nazaré usa seu barco como púlpito e, ao terminar, diz: "Vá para onde as águas são mais fundas e lancem as redes."'
        ],
        decisao: {
          pergunta: 'Você é o pescador; ele é um carpinteiro. Peixe não aparece de dia naquelas águas. O que você faz?',
          lord: 'Sua experiência diz não, e ela não está errada. A fé, aqui, não pede que você negue o que sabe, mas que obedeça mesmo assim. Repare na sua própria frase: "Mas, sob a tua palavra..."',
          opcoes: [
            { txt: '"Mestre, trabalhamos a noite toda... mas, sob a tua palavra, lançarei as redes."', biblico: true, lord: true,
              ef: { fe: +12, prov: +15, seg: +2 },
              res: 'As redes quase rompem. Você cai de joelhos: "Afasta-te de mim, Senhor, sou pecador!" Ele responde: "Não tenha medo. De agora em diante você será pescador de homens." Você deixa tudo e o segue.' },
            { txt: 'Recusar com educação: quem entende de pesca é você.', fid: -30,
              aviso: 'Recusar o chamado aqui afasta Pedro do círculo dos Doze. A história da Igreja primitiva perderia sua principal voz em Jerusalém.',
              ef: { prov: +5, fe: -10 },
              res: 'O mestre agradece e segue pela praia. Dias depois, você ouve que André, seu irmão, e os filhos de Zebedeu foram com ele. O barco parece vazio.' },
            { txt: 'Lançar as redes, mas, com a pesca farta, ficar para vender o peixe.', fid: -20,
              aviso: 'O milagre seria visto como oportunidade de negócio, não como chamado. Pedro adiaria a decisão que o Evangelho apresenta como imediata.',
              ef: { prov: +30, fe: -5, inf: +3 },
              res: 'Você vende tudo no mercado de Magdala e ganha o lucro de um mês. À noite, porém, as palavras dele não saem da sua cabeça: "pescador de homens".' }
          ]
        },
        curiosidade: { txt: 'Em 1986, uma seca no Mar da Galileia revelou um barco de pesca do século I, hoje chamado "Barco de Jesus", exposto em Ginosar. Media 8,2 m e cabia cerca de 13 pessoas: o tamanho exato de um barco como o de Pedro.', refs: ['Lc 5:5', 'Lc 5:8-10', 'Mc 1:16-18'] }
      },
      {
        id: 'p2', titulo: '"E vós, quem dizeis que eu sou?"', ref: 'Mateus 16:13-23', local: 'cesfilipe', img: 'p2_cesareia', turnos: 2,
        intro: [
          'Dois anos seguindo o mestre. Você o viu acalmar o mar, curar sua sogra, andar sobre as águas. Você também afundou ao olhar o vento.',
          'Agora, em Cesareia de Filipe, junto à rocha onde os pagãos honram o deus Pã, ele pergunta aos Doze quem o povo diz que ele é. E depois pergunta a vocês.'
        ],
        decisao: {
          pergunta: 'Os outros respondem: "João Batista, Elias, Jeremias..." O silêncio pesa. Você responde?',
          lord: 'Repare no cenário: um santuário pagão e um templo a César. Confessar aqui um outro Senhor tem peso político e espiritual. Atenção também ao que vem depois: logo em seguida ele falará de sofrimento, e é aí que a confissão será testada.',
          opcoes: [
            { txt: '"Tu és o Cristo, o Filho do Deus vivo."', biblico: true, lord: true,
              ef: { fe: +15, sab: +8, inf: +6 },
              res: '"Bem-aventurado és tu, Simão... tu és Pedro, e sobre esta pedra edificarei a minha igreja." Mas, quando ele anuncia que vai sofrer e morrer, você o repreende, e ouve: "Para trás de mim, Satanás!" A lição: confessar Cristo inclui aceitar a cruz.' },
            { txt: 'Responder como o povo: "És um grande profeta, como Elias."', fid: -25,
              aviso: 'Sem a confissão messiânica, Pedro não recebe o novo nome nem o papel de "pedra". A liderança dos Doze ficaria indefinida.',
              ef: { sab: +2, fe: -5 },
              res: 'O mestre o olha longamente, sem repreender. "A carne e o sangue respondem assim." O nome Pedro, Kefa, nunca é pronunciado.' },
            { txt: 'Ficar em silêncio por cautela.', fid: -15,
              aviso: 'A prudência evita risco, mas também a revelação. Outro discípulo pode assumir o papel de porta-voz.',
              ef: { opo: -3, fe: -3 },
              res: 'O silêncio se prolonga até que ele mesmo muda de assunto. Na volta, você sente que perdeu algo que não sabe nomear.' }
          ]
        },
        curiosidade: { txt: 'Há um jogo de palavras no grego: Pétros (Pedro) e pétra (rocha). Em aramaico, a língua de Jesus, ambos seriam Kefa, por isso Paulo o chama de "Cefas". O santuário de Pã em Banias, com seus nichos escavados na rocha, ainda pode ser visitado.', refs: ['Mt 16:16-18', 'Mt 16:23', 'Jo 1:42', 'Gl 2:9'] }
      },
      {
        id: 'p3', titulo: 'O galo canta', ref: 'Lucas 22:54-62; João 18:15-27; João 21:15-19', local: 'jerusalem', img: 'p3_patio', turnos: 1,
        intro: [
          'Você jurou: "Ainda que todos te abandonem, eu jamais!" No Getsêmani puxou a espada e cortou a orelha de Malco. Agora ele foi preso.',
          'Você o seguiu de longe até o pátio do sumo sacerdote. Está frio. Você se aquece junto a um braseiro, entre os guardas.'
        ],
        decisao: {
          pergunta: 'Uma criada o encara: "Você também estava com ele!" Os guardas se viram. O que você responde?',
          lord: 'Aqui a escolha mais fiel ao relato não é a mais corajosa: Pedro nega três vezes, chora amargamente e depois é restaurado à beira do lago. Eu o aconselho a ser fiel a Cristo. Mas saiba: confessar agora pode custar sua liberdade antes da hora, e sua força pode não bastar.',
          opcoes: [
            { txt: '"Mulher, não o conheço." (Como no relato bíblico.)', biblico: true,
              ef: { fe: -15, opo: -10 },
              res: 'Três vezes você nega. O galo canta. O Senhor se volta e o olha. Você sai e chora amargamente. Dias depois, junto ao lago, ele pergunta três vezes: "Simão, tu me amas?" E três vezes o restaura: "Apascenta as minhas ovelhas."',
              extra: { fe: +25, sab: +8 } },
            { txt: '"Sim, sou discípulo dele."', lord: true, fid: -15, teste: { stat: 'fe', min: 60 },
              aviso: 'Diverge do relato, mas em direção à fidelidade. Pedro poderia ser preso com Jesus e não estar presente no Pentecostes. Exige Fé alta.',
              ef: { fe: +10, opo: +35, inf: +5 },
              res: 'Sua voz não treme. Os guardas o agarram, mas o sumo sacerdote, ocupado com Jesus, manda soltá-lo como "um galileu sem importância". Você sai ferido e marcado, mas firme.',
              falha: { ef: { fe: -10, opo: +40 }, res: 'Você começa a dizer "sim", mas, quando os guardas se aproximam, a voz falha e você foge pela porta, perseguido. Fé insuficiente para sustentar a coragem.' } },
            { txt: 'Sacar a espada de novo e tentar libertá-lo.', fid: -40,
              aviso: 'Jesus já havia ordenado: "Guarda a espada." A violência contrariaria diretamente a ordem do mestre.',
              ef: { opo: +60, fe: -15, seg: -5 },
              res: 'Você é dominado em segundos. Passa a noite acorrentado. Pela manhã, um centurião manda açoitá-lo e soltá-lo. A ordem ainda ecoa: "Todos os que lançam mão da espada, à espada morrerão."' }
          ]
        },
        curiosidade: { txt: 'No local tradicional da casa de Caifás fica hoje a igreja de São Pedro em Gallicantu ("canto do galo"), com escadarias de pedra do período romano que descem ao vale do Cedrom.', refs: ['Lc 22:61-62', 'Jo 21:15-17', 'Mt 26:52'] }
      },
      {
        id: 'p4', titulo: 'A casa de Cornélio', ref: 'Atos 10; Atos 11:1-18', local: 'cesmar', img: 'p4_cornelio', turnos: 2,
        intro: [
          'No Pentecostes você pregou e três mil foram batizados. Foi preso, açoitado, libertado por um anjo. A Igreja cresce em Jerusalém.',
          'Em Jope, no terraço de Simão, o curtidor, você tem uma visão: animais impuros descem num lençol, e uma voz diz: "Não chames impuro ao que Deus purificou." Na porta, três homens enviados por um centurião romano.'
        ],
        decisao: {
          pergunta: 'Cornélio, oficial do exército de ocupação, pede que você vá à casa dele em Cesareia. Um judeu fiel não entra em casa de gentio. O que você decide?',
          lord: 'A questão é maior do que uma visita: o Evangelho é só para Israel, ou para todas as nações? Os profetas já prometiam que as nações viriam à luz de Israel (Is 49:6). A visão do lençol aponta numa direção. Os irmãos de Jerusalém vão cobrar explicações; esteja pronto.',
          opcoes: [
            { txt: 'Ir com eles a Cesareia e pregar na casa de Cornélio.', biblico: true, lord: true,
              ef: { seg: +15, inf: +15, opo: +10, fe: +8 },
              res: 'Enquanto você ainda fala, o Espírito Santo cai sobre os gentios. "Quem pode recusar a água do batismo?" Em Jerusalém você é questionado, mas conta tudo, e eles glorificam a Deus: "Também aos gentios Deus concedeu o arrependimento para a vida."' },
            { txt: 'Recusar: a missão é para Israel.', fid: -40,
              aviso: 'Sem a abertura aos gentios, o cristianismo tenderia a permanecer uma corrente dentro do judaísmo. A missão de Paulo perderia o respaldo de Pedro.',
              ef: { opo: -5, inf: -10, fe: -10 },
              res: 'Os mensageiros voltam sozinhos. Anos depois, quando Paulo começa a batizar gentios, falta-lhe o apoio da primeira testemunha. A Igreja se divide.' },
            { txt: 'Enviar outro discípulo no seu lugar, para evitar críticas.', fid: -15,
              aviso: 'O gesto acontece, mas sem a autoridade de Pedro. O debate em Jerusalém seria mais duro e mais longo.',
              ef: { opo: -3, inf: +4 },
              res: 'Filipe vai a Cesareia e a casa de Cornélio crê. Em Jerusalém, porém, dizem: "Filipe não é um dos Doze." A questão fica sem solução por anos.' }
          ]
        },
        curiosidade: { txt: 'Em Cesareia Marítima foi encontrada, em 1961, a "Pedra de Pilatos", uma inscrição com o nome de Pôncio Pilatos, prefeito da Judeia. É uma das poucas provas arqueológicas diretas de um personagem dos Evangelhos.', refs: ['At 10:15', 'At 10:34-35', 'At 11:18', 'Is 49:6'] }
      }
    ],
    finais: {
      biblico: { titulo: 'Apascenta as minhas ovelhas', img: 'p4_cornelio',
        txt: ['Você liderou a Igreja em Jerusalém, defendeu os gentios no concílio e escreveu às comunidades dispersas: "Vós sois geração eleita, sacerdócio real."', 'Segundo a tradição antiga (Clemente de Roma, Eusébio), você morreu mártir em Roma, sob Nero, por volta de 64 d.C. O pescador virou pedra.'],
        refs: ['At 15:7-11', '1Pe 2:9', 'Jo 21:18-19'] }
    }
  },

  /* ======================================================= JOÃO BATISTA */
  batista: {
    nome: 'João Batista',
    titulo: 'A Voz no Deserto',
    epoca: 'c. 27–29 d.C. · Judeia e Pereia',
    retrato: 'b1_deserto',
    mapa: 'israel',
    trilha: 'batista',
    resumo: 'Prepare o caminho do Senhor. Sua grandeza está em diminuir.',
    inicio: { fe: 65, sab: 45, seg: 0, prov: 15, inf: 0, opo: 0 },
    acoes: {
      prover: { nome: 'Colher gafanhotos e mel silvestre', pa: 1, ef: { prov: +8 }, txt: 'O deserto provê o suficiente para quem vive com pouco.' },
      pregar: { nome: 'Pregar arrependimento', pa: 1, ef: { seg: +7, inf: +6, opo: +6, prov: -1 }, txt: '"Produzi frutos dignos de arrependimento!"' },
      servir: { nome: 'Batizar no Jordão', pa: 1, ef: { seg: +6, inf: +4, fe: +2, prov: -1 }, txt: 'Publicanos, soldados e camponeses descem às águas.' }
    },
    capitulos: [
      {
        id: 'b1', titulo: 'Uma voz que clama', ref: 'Lucas 1:80; 3:1-6', local: 'deserto', img: 'b1_deserto', turnos: 1,
        intro: [
          'Você é João, filho do sacerdote Zacarias e de Isabel. Nasceu quando seus pais já eram idosos e, desde jovem, viveu no deserto.',
          'É o 15º ano de Tibério César. A palavra de Deus vem sobre você. Perto dali, em Qumran, uma comunidade de essênios se separou do Templo para esperar o fim dos tempos.'
        ],
        decisao: {
          pergunta: 'Onde e como você vai anunciar a mensagem?',
          lord: 'Isaías fala de uma voz no deserto preparando o caminho. Qumran usava o mesmo versículo para justificar o isolamento. A diferença decisiva: a voz deve ser ouvida. Preparar o caminho exige um lugar de passagem, onde o povo possa vir.',
          opcoes: [
            { txt: 'Pregar e batizar no Jordão, aberto a todos que vierem.', biblico: true, lord: true,
              ef: { seg: +10, inf: +10, opo: +5 },
              res: 'Jerusalém, toda a Judeia e a região do Jordão saem para ouvi-lo. Publicanos perguntam: "Que faremos?" Você responde com justiça prática: não cobrem mais do que o devido.' },
            { txt: 'Juntar-se de vez à comunidade de Qumran.', fid: -40,
              aviso: 'Qumran era uma comunidade fechada, com iniciação de anos. A voz que deveria preparar o povo ficaria restrita a poucos eleitos.',
              ef: { sab: +12, seg: -5, inf: -10 },
              res: 'Você copia rolos de Isaías à luz de lamparinas. Aprende muito. Mas lá fora ninguém ouve sua voz, e o caminho fica sem quem o prepare.' },
            { txt: 'Pregar nos pátios do Templo, no coração do poder.', fid: -20,
              aviso: 'No Templo, a guarda dos sacerdotes e a coorte romana da Antônia agiriam rápido. A mensagem de arrependimento dependia do simbolismo do deserto e do rio.',
              ef: { inf: +12, opo: +25 },
              res: 'Os sacerdotes ouvem, ofendidos. A guarda do Templo o expulsa no terceiro dia. Você volta ao deserto, agora vigiado.' }
          ]
        },
        curiosidade: { txt: 'O "Grande Rolo de Isaías" de Qumran, achado em 1947, tem cerca de 2.100 anos e traz o mesmo Is 40:3 que os Evangelhos aplicam a João. Hoje está no Santuário do Livro, em Jerusalém.', refs: ['Is 40:3', 'Lc 3:2-3', 'Lc 3:10-14'] }
      },
      {
        id: 'b2', titulo: 'Raça de víboras', ref: 'Mateus 3:7-12; Lucas 3:7-18', local: 'jordao', img: 'b2_fariseus', turnos: 2,
        intro: [
          'Sua fama cresceu. Muitos se perguntam se você é o Cristo. Agora, chegam ao rio fariseus e saduceus: a elite religiosa de Jerusalém.',
          'Eles querem ser vistos no batismo popular, mas sem mudar nada.'
        ],
        decisao: {
          pergunta: 'Os líderes esperam ser tratados com deferência. Muitos olhos estão em você. O que faz?',
          lord: 'Confrontá-los tem custo: eles têm influência no Sinédrio e junto ao povo. Agradá-los traria aliados, mas esvaziaria a mensagem. Arrependimento sem fruto é rito vazio. A pergunta é se a sua voz pertence a Deus ou à plateia.',
          opcoes: [
            { txt: '"Raça de víboras! Produzi frutos dignos de arrependimento. O machado já está posto à raiz das árvores."', biblico: true, lord: true,
              ef: { fe: +10, inf: +8, opo: +15, seg: +5 },
              res: 'Os líderes se retiram, irritados. O povo, porém, entende: ninguém é salvo por ser "filho de Abraão". E você aponta além de si: "Aquele que vem depois de mim é mais poderoso do que eu."' },
            { txt: 'Recebê-los com honras para ganhar apoio no Sinédrio.', fid: -30,
              aviso: 'A mensagem perderia a força profética. Jesus mais tarde elogiaria João justamente por não ser "um caniço agitado pelo vento" (Mt 11:7).',
              ef: { inf: +15, opo: -10, fe: -15, seg: -5 },
              res: 'Os líderes saem satisfeitos. Mas os publicanos e soldados murmuram: "Até o profeta se vende?" Muitos voltam para casa sem se batizar.' },
            { txt: 'Recusar-se a batizá-los e expulsá-los do rio.', fid: -15,
              aviso: 'Os Evangelhos mostram João exigindo frutos, não fechando a porta. A exclusão total contradiz o chamado ao arrependimento de todos.',
              ef: { opo: +25, inf: +3 },
              res: 'A cena vira escândalo em Jerusalém. Ganha-se coragem, mas perde-se a chance de que algum deles realmente se arrependa.' }
          ]
        },
        curiosidade: { txt: 'Flávio Josefo, historiador judeu do século I, descreve João como "homem bom" que exortava os judeus à justiça e à piedade e ao batismo (Antiguidades Judaicas 18.116-119). É uma das fontes não bíblicas mais antigas sobre ele.', refs: ['Mt 3:7-10', 'Mt 11:7-11', 'Lc 3:15-16'] }
      },
      {
        id: 'b3', titulo: 'Eis o Cordeiro de Deus', ref: 'João 1:29-37; João 3:26-30', local: 'jordao', img: 'b3_cordeiro', turnos: 1,
        intro: [
          'Você batizou Jesus de Nazaré e viu o Espírito descer sobre ele. Agora ele passa pela margem do rio.',
          'Ao seu lado estão dois de seus discípulos mais próximos: André e outro jovem, provavelmente João, filho de Zebedeu.'
        ],
        decisao: {
          pergunta: 'Seu movimento está no auge. Se você apontar para Jesus, seus melhores discípulos vão segui-lo. O que faz?',
          lord: 'Esta é a decisão que define o precursor. Nenhuma métrica de sucesso humano recomenda perder os melhores. Mas a sua alegria, segundo o próprio relato, é a do amigo do noivo: ouvir a voz do noivo e se alegrar. "É necessário que ele cresça e que eu diminua."',
          opcoes: [
            { txt: '"Eis o Cordeiro de Deus, que tira o pecado do mundo!" E deixá-los ir.', biblico: true, lord: true,
              ef: { fe: +20, seg: -10, inf: -5 },
              res: 'André e o outro discípulo seguem Jesus. André logo chama seu irmão, Simão. Quando seus discípulos se queixam de que "todos vão a ele", você responde: "Minha alegria está completa."' },
            { txt: 'Manter os discípulos junto a você; cada movimento com seu mestre.', fid: -35,
              aviso: 'Pedro e André poderiam nunca conhecer Jesus por esse caminho. Os dois movimentos competiriam pelo mesmo público.',
              ef: { seg: +10, inf: +5, fe: -15 },
              res: 'Seu grupo cresce, mas surge rivalidade: "O nosso mestre batizou o deles!" A pergunta "quem é o maior?" divide famílias na Galileia.' },
            { txt: 'Aceitar o que o povo murmura: que você é o Messias.', fid: -100, fim: 'b_messias',
              aviso: 'Divergência máxima. João negou expressamente: "Eu não sou o Cristo" (Jo 1:20). Esta escolha encerra a campanha num final alternativo.',
              ef: { seg: +30, opo: +40, fe: -40 },
              res: 'Você ergue a voz no rio: "Eu sou aquele que havia de vir."' }
          ]
        },
        curiosidade: { txt: 'Atos 19 mostra discípulos de João em Éfeso, mais de 20 anos depois, que só conheciam "o batismo de João". O movimento do Batista se espalhou para muito além da Judeia.', refs: ['Jo 1:29', 'Jo 1:20', 'Jo 3:29-30', 'At 19:1-7'] }
      },
      {
        id: 'b4', titulo: 'A fortaleza de Maqueronte', ref: 'Marcos 6:17-29; Mateus 11:2-6', local: 'maqueronte', img: 'b4_maqueronte', turnos: 2,
        intro: [
          'Herodes Antipas, tetrarca da Galileia e da Pereia, divorciou-se para se casar com Herodias, mulher de seu irmão Filipe. A Lei proíbe.',
          'Você denunciou o casamento em público. Agora está preso na fortaleza de Maqueronte. Herodes o teme e gosta de ouvi-lo, mas Herodias quer sua morte.'
        ],
        decisao: {
          pergunta: 'Herodes o chama em particular: "Retire o que disse e eu o solto." O que você responde?',
          lord: 'Josefo diz que Herodes temia a influência de João sobre o povo. Uma retratação traria liberdade, mas o profeta deixaria de ser profeta. Fugir para a Nabateia é possível com ajuda de discípulos. Lembre-se: a sua missão de preparar o caminho já foi cumprida.',
          opcoes: [
            { txt: '"Não te é lícito possuir a mulher de teu irmão."', biblico: true, lord: true,
              ef: { fe: +20, opo: +30 },
              res: 'Herodes o devolve ao cárcere. Da prisão você envia discípulos a Jesus: "És tu aquele que havia de vir?" A resposta chega: "Os cegos veem, os coxos andam... e bem-aventurado aquele que não se escandaliza." Pouco depois, num banquete, Herodias consegue o que queria.' },
            { txt: 'Retratar-se em troca da liberdade.', fid: -45,
              aviso: 'O profeta que não se dobrou a ninguém se dobraria ao poder. Jesus o chamou de "o maior entre os nascidos de mulher" justamente pela integridade.',
              ef: { opo: -40, fe: -30, inf: -20 },
              res: 'Você é solto. Mas o povo diz que o profeta se vendeu. Herodias sorri: venceu sem derramar sangue.' },
            { txt: 'Aceitar o plano de fuga dos discípulos para a Nabateia.', fid: -30,
              aviso: 'A Nabateia estava em conflito com Herodes por causa do divórcio da filha do rei Aretas. Fugir para lá misturaria a mensagem com a política.',
              ef: { opo: -20, fe: -10, seg: +5 },
              res: 'Você escapa à noite pelo deserto. O rei Aretas IV o recebe como símbolo contra Herodes. Sua voz, antes profética, passa a servir a uma guerra entre reis.' }
          ]
        },
        curiosidade: { txt: 'Josefo confirma que João foi executado em Maqueronte (Antiguidades 18.119). Escavações húngaras no local revelaram um pátio real e um salão que pode ter abrigado o banquete de Herodes.', refs: ['Mc 6:18', 'Mt 11:2-11', 'Mc 6:21-29'] }
      }
    ],
    finais: {
      biblico: { titulo: 'O maior entre os nascidos de mulher', img: 'b3_cordeiro',
        txt: ['Você morreu em Maqueronte, fiel até o fim. Seus discípulos sepultaram seu corpo e foram contar a Jesus.', 'Jesus disse: "Entre os nascidos de mulher, ninguém é maior do que João." Você preparou o caminho e diminuiu, para que ele crescesse.'],
        refs: ['Mt 11:11', 'Jo 3:30', 'Ml 4:5-6'] },
      b_messias: { titulo: 'Um messias no Jordão', img: 'b2_fariseus',
        txt: ['Multidões o aclamaram, e Herodes enviou soldados mais cedo. Seu movimento virou mais uma seita messiânica entre tantas do século I.', 'O caminho que você deveria preparar ficou obstruído pelo próprio arauto. No relato real, João disse: "Eu não sou o Cristo."'],
        refs: ['Jo 1:19-27', 'Jo 3:28', 'At 13:25'] }
    }
  },

  /* ======================================================= PAULO */
  paulo: {
    nome: 'Apóstolo Paulo',
    titulo: 'O Apóstolo dos Gentios',
    epoca: 'c. 34–60 d.C. · Damasco, Antioquia, Grécia e Roma',
    retrato: 'a1_damasco',
    mapa: 'med',
    trilha: 'paulo',
    resumo: 'De perseguidor a missionário. Atravesse o Império com cartas, navios e uma mensagem que vira o mundo de cabeça para baixo.',
    inicio: { fe: 30, sab: 75, seg: 0, prov: 50, inf: 20, opo: 0 },
    acoes: {
      prover:  { nome: 'Fazer tendas', pa: 1, ef: { prov: +11, inf: +1 }, txt: 'Couro e lona. "Estas mãos proveram minhas necessidades" (At 20:34).' },
      estudar: { nome: 'Escrever cartas às igrejas', pa: 1, ef: { sab: +5, inf: +6, seg: +2 }, txt: 'Tércio escreve enquanto você dita. As cartas atravessam o mar.' },
      pregar:  { nome: 'Discutir na sinagoga e na praça', pa: 1, ef: { seg: +6, inf: +6, opo: +7, prov: -2 }, txt: 'Judeus, prosélitos e gregos ouvem. Uns creem, outros se enfurecem.' }
    },
    capitulos: [
      {
        id: 'a1', titulo: 'A estrada de Damasco', ref: 'Atos 9:1-22; Gálatas 1:13-17', local: 'damasco', img: 'a1_damasco', turnos: 1,
        intro: [
          'Você é Saulo, de Tarso, cidadão romano, fariseu formado aos pés de Gamaliel. Aprovou a morte de Estêvão. Agora leva cartas do sumo sacerdote para prender os seguidores "do Caminho" em Damasco.',
          'Perto do meio-dia, uma luz mais forte que o sol o derruba. Uma voz: "Saulo, Saulo, por que me persegues?" "Quem és tu, Senhor?" "Eu sou Jesus, a quem tu persegues."'
        ],
        decisao: {
          pergunta: 'Cego, você ouve: "Levanta-te, entra na cidade e lá te será dito o que deves fazer." O que você faz?',
          lord: 'Tudo o que você construiu está em jogo: reputação, carreira, a aprovação do sumo sacerdote. Mas a evidência é pessoal e esmagadora. A obediência começa pequena: entrar na cidade e esperar. Ananias, um dos que você vinha prender, está sendo enviado a você.',
          opcoes: [
            { txt: 'Deixar-se conduzir pela mão até Damasco e esperar.', biblico: true, lord: true,
              ef: { fe: +25, inf: -10, opo: +10 },
              res: 'Três dias sem ver, sem comer, sem beber. Então Ananias entra: "Irmão Saulo..." Caem-lhe dos olhos como que escamas. Você é batizado e logo prega nas sinagogas que Jesus é o Filho de Deus.' },
            { txt: 'Atribuir a visão ao sol e ao cansaço, e continuar a missão.', fid: -100, fim: 'a_perseguidor',
              aviso: 'Divergência máxima. Sem a conversão, não haveria as viagens missionárias nem as 13 cartas atribuídas a Paulo, quase metade do Novo Testamento.',
              ef: { inf: +20, fe: -40 },
              res: 'Você se levanta, ainda cego, e ordena: "Sigamos."' },
            { txt: 'Voltar a Jerusalém e consultar o Sinédrio sobre a visão.', fid: -30,
              aviso: 'Paulo afirma que, após a conversão, "não consultou carne e sangue" (Gl 1:16). Voltar ao Sinédrio poderia levar à prisão dele.',
              ef: { opo: +30, sab: +5, fe: +5 },
              res: 'O sumo sacerdote ouve, gelado. "Você foi enfeitiçado pelos nazarenos." Retiram suas cartas e o vigiam. Você foge à noite, agora perseguido como os que perseguia.' }
          ]
        },
        curiosidade: { txt: 'A "rua chamada Direita" de Atos 9:11 corresponde à antiga Via Recta, a principal rua romana de Damasco, que ainda existe no centro antigo da cidade com o nome de Souk Medhat Pasha.', refs: ['At 9:4-6', 'At 9:11', 'Gl 1:16', 'Fp 3:4-8'] }
      },
      {
        id: 'a2', titulo: 'O Concílio de Jerusalém', ref: 'Atos 15:1-31; Gálatas 2:1-10', local: 'jerusalem', img: 'a2_concilio', turnos: 2,
        intro: [
          'Com Barnabé, você navegou a Chipre e percorreu a Galácia. Foi apedrejado em Listra e deixado por morto. Muitos gentios creram.',
          'De volta a Antioquia, chegam homens da Judeia ensinando: "Se não forem circuncidados segundo Moisés, não podem ser salvos." A questão vai a Jerusalém, diante de Pedro, Tiago e os anciãos.'
        ],
        decisao: {
          pergunta: 'Diante do concílio, qual posição você defende?',
          lord: 'O ponto não é o rito em si, mas o que salva: a graça de Cristo ou a graça mais a Lei. Uma vitória aqui abre a porta a todo o Império. Mas ouça Tiago: ele vai propor gestos de respeito aos judeus. Saber ceder no secundário é sabedoria, não fraqueza.',
          opcoes: [
            { txt: 'Defender que os gentios são salvos pela graça, sem circuncisão, aceitando os gestos de comunhão propostos por Tiago.', biblico: true, lord: true,
              ef: { inf: +15, seg: +12, sab: +6, opo: +5 },
              res: 'Pedro lembra a casa de Cornélio. Tiago cita Amós e conclui: "Não devemos perturbar os gentios que se convertem a Deus." Uma carta é enviada às igrejas. Em Antioquia, a leitura causa grande alegria.' },
            { txt: 'Ceder e exigir a circuncisão dos gentios para manter a paz.', fid: -40,
              aviso: 'Paulo escreveria depois que, nesse caso, "Cristo de nada vos aproveitará" (Gl 5:2). A missão aos gentios encolheria drasticamente.',
              ef: { opo: -10, seg: -20, inf: -10, fe: -10 },
              res: 'A decisão chega a Antioquia e à Galácia. Muitos gentios desistem. A fé em Cristo passa a parecer, para os gregos, apenas uma seita judaica a mais.' },
            { txt: 'Romper com Jerusalém e fundar uma igreja só de gentios.', fid: -35,
              aviso: 'Paulo lutou pela unidade, chegando a levantar uma grande oferta para os pobres de Jerusalém. A ruptura criaria duas igrejas rivais logo no início.',
              ef: { inf: +10, seg: +5, opo: +10, fe: -10 },
              res: 'Você sai do concílio batendo a porta. Barnabé fica do lado de lá. A "igreja dos gentios" cresce, mas sem raízes nas Escrituras de Israel, e logo surgem doutrinas estranhas.' }
          ]
        },
        curiosidade: { txt: 'A carta aos Gálatas, escrita por volta dessa época, contém o relato mais antigo de Paulo sobre Pedro e Tiago e um famoso conflito em Antioquia, em que Paulo repreende Pedro "face a face" (Gl 2:11).', refs: ['At 15:10-11', 'At 15:19-20', 'Gl 2:11', 'Gl 5:1'] }
      },
      {
        id: 'a3', titulo: 'Ao Deus desconhecido', ref: 'Atos 17:16-34', local: 'atenas', img: 'a3_atenas', turnos: 2,
        intro: [
          'Na segunda viagem você atravessou a Macedônia após uma visão. Em Filipos, foi açoitado e preso com Silas. À meia-noite cantavam hinos, e a terra tremeu.',
          'Agora está em Atenas, sozinho, esperando Silas e Timóteo. A cidade está cheia de ídolos. Filósofos epicureus e estoicos o levam ao Areópago: "Que quer dizer este tagarela?"'
        ],
        decisao: {
          pergunta: 'Os maiores pensadores da Grécia esperam. Como você fala?',
          lord: 'Sua indignação é compreensível, mas atenienses não respondem a gritos. Comece onde eles estão: você viu um altar "Ao Deus desconhecido". Cite os poetas deles: Arato escreveu "Dele também somos geração". Depois, o ponto que vai dividir a plateia: a ressurreição.',
          opcoes: [
            { txt: 'Partir do altar "Ao Deus desconhecido", citar os poetas gregos e anunciar a ressurreição.', biblico: true, lord: true,
              ef: { sab: +10, seg: +6, inf: +8 },
              res: 'Ao ouvir falar de ressurreição, uns zombam, outros dizem: "Ouviremos você outra vez." Mas alguns creem: Dionísio, membro do Areópago, uma mulher chamada Dâmaris e outros.' },
            { txt: 'Denunciar os ídolos com fúria diante de todos.', fid: -20,
              aviso: 'Atenas tolerava ideias novas, mas punia o desrespeito aos deuses da cidade, como fez com Sócrates. A missão seria encerrada à força.',
              ef: { opo: +35, fe: +5, inf: -5 },
              res: 'Os estoicos se levantam indignados. Lembram, com ironia, que Sócrates também foi acusado de introduzir "divindades estrangeiras". Você é escoltado para fora da cidade.' },
            { txt: 'Calar-se e partir para Corinto.', fid: -15,
              aviso: 'Dionísio, o areopagita, e Dâmaris não ouviriam a mensagem. O discurso de Atos 17 é um dos modelos mais estudados de diálogo entre fé e cultura.',
              ef: { opo: -5, fe: -5 },
              res: 'Você atravessa o istmo até Corinto. Lá ficará um ano e meio. Mas Atenas fica para trás sem ouvir a palavra.' }
          ]
        },
        curiosidade: { txt: 'Paulo cita o poeta Arato (Fenômenos, séc. III a.C.): "Pois dele também somos geração." Hoje, uma placa de bronze ao pé da colina do Areópago traz o texto grego do discurso de Atos 17.', refs: ['At 17:23', 'At 17:28', 'At 17:32-34'] }
      },
      {
        id: 'a4', titulo: 'Apelo a César', ref: 'Atos 21–26; Atos 25:9-12', local: 'cesmar', img: 'a4_cesar', turnos: 2,
        intro: [
          'Você levou a oferta das igrejas a Jerusalém. No Templo, uma multidão o acusou de profanar o santuário. Os soldados romanos o salvaram do linchamento.',
          'Há dois anos está preso em Cesareia. Félix o deixou esperando suborno. O novo governador, Pórcio Festo, quer agradar os judeus e propõe julgá-lo em Jerusalém, onde quarenta homens juraram matá-lo.'
        ],
        decisao: {
          pergunta: 'Festo pergunta: "Queres subir a Jerusalém e ali ser julgado diante de mim?" Sua resposta:',
          lord: 'Lembre-se do que o Senhor lhe disse na fortaleza Antônia: "Assim como testemunhaste em Jerusalém, importa que testemunhes também em Roma." Sua cidadania romana não é vaidade: é um instrumento. Usá-la para chegar a Roma é diferente de usá-la para escapar.',
          opcoes: [
            { txt: '"Estou perante o tribunal de César... Apelo para César!"', biblico: true, lord: true,
              ef: { inf: +20, fe: +10, opo: +10 },
              res: '"Apelaste para César? Para César irás!" Antes de partir, você testemunha diante do rei Agripa: "Por pouco me persuades a ser cristão." A viagem a Roma terá tempestade, naufrágio em Malta e uma víbora na fogueira.' },
            { txt: 'Aceitar o julgamento em Jerusalém.', fid: -100, fim: 'a_emboscada',
              aviso: 'Divergência máxima. O complô dos quarenta (At 23:12-22) tornaria a viagem quase certamente fatal. Romanos e Filipenses mostram que Roma era o destino.',
              ef: { opo: +50 },
              res: 'Você aceita. A escolta parte para Jerusalém pela estrada da montanha.' },
            { txt: 'Usar a cidadania para pedir soltura e retirar-se para Tarso.', fid: -40,
              aviso: 'Paulo nunca usou a cidadania para abandonar a missão, apenas para continuá-la. As cartas da prisão (Efésios, Filipenses, Colossenses, Filemom) talvez não existissem.',
              ef: { opo: -40, prov: +20, fe: -20, inf: -15 },
              res: 'Festo, aliviado, aceita libertá-lo discretamente. Você volta a Tarso e retoma as tendas. As igrejas escrevem perguntando por você. Roma nunca ouve sua voz.' }
          ]
        },
        curiosidade: { txt: 'Em Cesareia Marítima foi escavado o palácio do governador, o "pretório de Herodes" de Atos 23:35, onde Paulo provavelmente ficou preso. O teatro romano da cidade ainda recebe espetáculos.', refs: ['At 23:11', 'At 25:11-12', 'At 26:28', 'At 27–28'] }
      }
    ],
    finais: {
      biblico: { titulo: 'Combati o bom combate', img: 'a4_cesar',
        txt: ['Você chegou a Roma acorrentado e viveu dois anos numa casa alugada, "pregando o Reino de Deus com toda a liberdade, sem impedimento".', 'Suas cartas formam quase metade do Novo Testamento. Segundo a tradição, você foi decapitado em Roma sob Nero. "Combati o bom combate, terminei a carreira, guardei a fé."'],
        refs: ['At 28:30-31', '2Tm 4:7', 'Rm 1:16'] },
      a_perseguidor: { titulo: 'O zelo sem luz', img: 'a1_damasco',
        txt: ['Você seguiu prendendo os "do Caminho" e chegou a ser um nome respeitado no Sinédrio.', 'Mas não houve Romanos, nem Coríntios, nem o hino ao amor de 1 Coríntios 13. A mensagem talvez não tivesse atravessado o mar. No relato real, Paulo escreveu: "Considero tudo como perda, por causa da excelência do conhecimento de Cristo."'],
        refs: ['Fp 3:7-8', 'At 26:14', '1Tm 1:13'] },
      a_emboscada: { titulo: 'A estrada da montanha', img: 'a2_concilio',
        txt: ['No caminho para Jerusalém, a escolta foi surpreendida. Os quarenta cumpriram seu juramento.', 'As cartas de Roma e da prisão nunca foram escritas. O Senhor lhe dissera que Roma era o destino (At 23:11). A desobediência custou o testemunho.'],
        refs: ['At 23:12-22', 'At 23:11', 'Fp 1:12-14'] }
    }
  }
};

/* Eventos aleatórios de gestão (aparecem entre os turnos) */
const EVENTOS = [
  { id: 'pobre', txt: 'Uma viúva pobre pede ajuda à beira do caminho.', a: { txt: 'Dar parte das provisões', ef: { prov: -6, seg: +3, fe: +3 } }, b: { txt: 'Seguir viagem', ef: { fe: -2 } }, ref: 'Tg 1:27' },
  { id: 'patrulha', txt: 'Uma patrulha romana exige que alguém carregue sua bagagem por uma milha.', a: { txt: 'Carregar duas milhas', ef: { fe: +4, inf: +3, prov: -2 } }, b: { txt: 'Evitar a estrada', ef: { opo: -2, prov: -3 } }, ref: 'Mt 5:41' },
  { id: 'seca', txt: 'A seca encareceu o trigo nos mercados.', a: { txt: 'Racionar e partilhar', ef: { prov: -4, seg: +3 } }, b: { txt: 'Comprar estoque', ef: { prov: +6, inf: -2 } }, ref: 'At 11:28-30' },
  { id: 'escriba', txt: 'Um escriba quer debater a Lei em público.', a: { txt: 'Debater com mansidão', ef: { sab: +4, inf: +4, opo: +3 } }, b: { txt: 'Recusar o debate', ef: { opo: -2 } }, ref: 'Mc 12:28-34' },
  { id: 'festa', txt: 'Chega uma festa de peregrinação: Jerusalém se enche.', a: { txt: 'Aproveitar as multidões', ef: { seg: +5, inf: +5, opo: +6 } }, b: { txt: 'Ficar entre os seus', ef: { fe: +3 } }, ref: 'Jo 7:2-10' },
  { id: 'doente', txt: 'Uma família traz uma criança com febre alta.', a: { txt: 'Orar e cuidar', ef: { fe: +3, seg: +3, prov: -3 } }, b: { txt: 'Indicar um médico', ef: { prov: -1 } }, ref: 'Tg 5:14' },
  { id: 'hospedagem', txt: 'Um anfitrião oferece hospedagem e mesa farta.', a: { txt: 'Aceitar com gratidão', ef: { prov: +8, seg: +2 } }, b: { txt: 'Recusar para não pesar', ef: { prov: -1, fe: +1 } }, ref: 'Lc 10:7' },
  { id: 'espiao', txt: 'Você percebe que um informante segue o grupo.', a: { txt: 'Mudar de rota', ef: { opo: -6, prov: -3 } }, b: { txt: 'Seguir às claras', ef: { opo: +4, fe: +2 } }, ref: 'Mt 10:16' }
];

const NOMES_FIDELIDADE = [
  [95, 'Fiel ao relato'], [70, 'Pequenos desvios'], [40, 'Caminho alternativo'], [0, 'Outra história']
];
