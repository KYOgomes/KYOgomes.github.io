/* =====================================================================
   SEU PORTFÓLIO — edite só este arquivo.
   ---------------------------------------------------------------------
   Dicas de formatação nos textos:
     [texto](https://link)   -> vira um link sublinhado
     **texto**               -> negrito
   Para remover uma seção, tire o nome dela da lista `sections`.
   Para reordenar, mude a ordem da lista.
   ===================================================================== */

window.PORTFOLIO = {
  name: "Caio Gomes",

  // Duas linhas "digitadas" no topo (efeito máquina de escrever)
  tagline: ["num lago de ideias,", "nade com propósito"],

  // Texto principal do topo (cada item é uma linha)
  greeting: "Olá, eu sou o Caio.",
  intro: [
    "Engenheiro de software na [LEVTY](https://www.levty.com/br), focado em desenvolver ideias e ajudar o próximo.",
    "Estudante de Ciência da Computação na [PUC Minas](https://www.pucminas.br), em Belo Horizonte.",
    "Construo processos, integrações e automações — do banco de dados à interface.",
    "Atualmente, explorando **agentes de IA** e **visão computacional**, e buscando ser melhor a cada dia.",
  ],

  socials: [
    { label: "github", url: "https://github.com/KYOgomes" },
    { label: "linkedin", url: "https://www.linkedin.com/in/caio-gomes-393687299/" },
    { label: "email", url: "mailto:caioga2011@gmail.com" },
  ],

  // Foto exibida na seção "sobre" (para tirar, apague este bloco)
  photo: {
    src: "images/caio.jpg",
    alt: "Caio Gomes sorrindo, de camisa polo preta",
    caption: "Belo Horizonte, MG",
  },

  // Ordem das seções que aparecem ao rolar a página
  sections: ["about", "experience", "projects", "education", "skills", "contact"],

  // Nomes exibidos no menu e nos títulos
  labels: {
    top: "lago",
    about: "sobre",
    experience: "experiência",
    projects: "projetos",
    education: "formação",
    skills: "stack",
    contact: "contato",
  },

  about: [
    "Sou desenvolvedor de software em Belo Horizonte e estou concluindo **Ciência da Computação na PUC Minas**. Na [LEVTY](https://www.levty.com/br), trabalho com a plataforma **SYDLE ONE**: modelo processos em BPMN, escrevo regras de negócio e automações em JavaScript e integro sistemas externos por APIs REST.",
    "Gosto do trabalho que fica entre o código e as pessoas. Converso direto com clientes para entender o problema, levantar requisitos e validar cada entrega, lido com grandes volumes de dados, sendo de importações com validações customizadas a consultas no **Elasticsearch** que alimentam dashboards.",
    "Na faculdade, me aprofundo em computação paralela e distribuída, arquitetura de computadores, Processamento e Análise de Imagens (PAI) e Visão Computacional. Antes da tecnologia, passei pela contabilidade, e isso me deixou um olhar atento para processos e para o negócio por trás de cada sistema. Falo inglês em nível avançado.",
  ],

  // `highlights` vira uma lista de tópicos; `description` é a linha curta abaixo do cargo
  experience: [
    {
      period: "jan 2026 — hoje",
      role: "Desenvolvedor de Software Júnior",
      company: "LEVTY",
      url: "https://www.levty.com/br",
      description: "Belo Horizonte, MG · híbrido",
      highlights: [
        "Desenvolvimento na plataforma SYDLE ONE com modelagem de processos BPMN, regras de negócio e automações em JavaScript.",
        "Integrações com sistemas externos via APIs REST e importação de grandes volumes de dados com validações customizadas.",
        "Consultas e agregações avançadas no Elasticsearch, otimizando buscas e alimentando analytics e dashboards para clientes.",
        "Front-end em HTML, CSS e JavaScript, com foco na experiência do usuário e controle de acesso por perfis e permissões.",
        "Contato direto com clientes no levantamento de requisitos, homologação e suporte, em times ágeis multidisciplinares.",
        "Exploração de agentes de IA integrados aos processos da plataforma: automação inteligente, apoio à decisão e chatbots.",
      ],
      tags: ["SYDLE ONE", "BPMN", "JavaScript", "REST", "Elasticsearch", "IA"],
    },
    {
      period: "jan 2023 — ago 2023",
      role: "Auxiliar de Contabilidade",
      company: "Escritório de Contabilidade Independente",
      url: "",
      description: "Minas Gerais",
      highlights: [
        "Suporte em rotinas contábeis, organização de documentos fiscais, lançamentos em sistema e atendimento a clientes.",
      ],
      tags: [],
    },
  ],

  // Os primeiros projetos são os que recrutadores mais leem: deixe os melhores no topo.
  // `details` é o conteúdo do painel que abre no botão ⤢ de cada caixa:
  //   summary: parágrafos · facts: [rótulo, valor] · sections: listas com título
  //   gallery: prints ({ src, caption, wide }) · blocks: texto em bloco (código/diagrama) · chart: barras
  projects: [
    {
      name: "anabia-brownies",
      description: "App web (PWA) para o dia a dia de uma confeitaria: calendário de pedidos, estoque por sabor, entregas, despesas e lucro por dia, semana e mês — pensado para o celular.",
      tags: ["Next.js", "TypeScript", "Tailwind", "Supabase"],
      links: { demo: "https://anabia-brownies-demo.vercel.app", code: "https://github.com/KYOgomes/AnabiaBrownies" },
      details: {
        summary: [
          "Um aplicativo para a Anabia Brownies controlar as vendas pelo celular. Ele troca as anotações soltas por um **calendário**: cada dia mostra quantos brownies ainda estão disponíveis por sabor, os pedidos com quem comprou e se já pagou, as despesas e o lucro.",
          "Foi pensado para ser usado no meio da correria: abre direto no dia de hoje, adicionar um pedido leva poucos toques e o app avisa quando o pedido passa do estoque. Dá para instalá-lo na tela inicial como um app (PWA).",
          "Quer testar? A [demo](https://anabia-brownies-demo.vercel.app) abre com o login de teste já preenchido e roda num banco separado, só com dados fictícios.",
        ],
        facts: [
          ["tipo", "PWA mobile-first"],
          ["front", "Next.js 16 · Tailwind 4"],
          ["dados", "Supabase (Postgres, Auth, RLS)"],
          ["deploy", "Vercel"],
        ],
        sections: [
          {
            title: "o que ele faz",
            items: [
              "**Calendário** do mês com vendidos e disponíveis por dia e um ícone que mostra se todos os pedidos do dia já foram pagos; tocar num dia abre o painel logo abaixo.",
              "**Pedidos** com sabor, cliente, opção de venda (ex.: 1 por R$ 7, 2 por R$ 12), data, horário, local, observações e caixinha de **pago**.",
              "**Resumo financeiro** de hoje, da semana, do mês ou total: lucro, margem, vendas, despesas, valores a receber e um gráfico de vendas por dia.",
              "**Sabores mais pedidos** no período, para saber o que produzir mais.",
              "**Pix na hora**: o próprio app gera o QR code no padrão do Banco Central, com opção de copia e cola.",
              "**Despesas** lançadas para um dia ou para uma semana inteira; sabores e opções de venda configuráveis.",
            ],
          },
          {
            title: "regras de negócio",
            items: [
              "O preço fica gravado no pedido: mudar a tabela depois não altera o histórico.",
              "Despesas semanais entram como 1/7 no lucro de cada dia e inteiras no lucro da semana.",
              "Lucro = vendas não canceladas − despesas, sempre pela data de entrega.",
            ],
          },
          {
            title: "arquitetura",
            items: [
              "App Router com Server Actions; um proxy renova a sessão e protege as rotas autenticadas.",
              "Banco no Supabase com Row Level Security: cada usuário só enxerga os próprios dados.",
            ],
          },
        ],
        gallery: [
          { src: "images/projects/anabia/05-resumo-desktop.jpg", caption: "Versão desktop do resumo financeiro, com seletor de período (hoje, semana, mês e total)", wide: true },
          { src: "images/projects/anabia/01-calendario.jpg", caption: "Tela inicial: calendário com vendidos/disponíveis por dia e quem já pagou" },
          { src: "images/projects/anabia/02-resumo-financeiro.jpg", caption: "Resumo do mês: lucro, margem, vendas, despesas e gráfico de vendas por dia" },
          { src: "images/projects/anabia/03-pedidos-do-dia.jpg", caption: "Lançamento rápido de pedidos; os pagos ficam esmaecidos com um toque" },
          { src: "images/projects/anabia/04-sabores-mais-pedidos.jpg", caption: "Ranking dos sabores mais pedidos e pedidos ainda não pagos" },
          { src: "images/projects/anabia/06-qr-code-pix.jpg", caption: "QR code Pix gerado pelo próprio app (padrão do Banco Central)" },
          { src: "images/projects/anabia/01-login.jpg", caption: "Tela de entrada" },
        ],
        note: "Prints do ambiente de demonstração, com dados fictícios. A demo também pode ser editada por quem visita.",
      },
    },
    {
      name: "angra-photos",
      description: "Álbum compartilhado de uma viagem: todos enviam fotos e vídeos em qualidade original e o site organiza tudo pela data em que foram tirados — feito para facilitar a organização das fotos de uma viagem da família.",
      tags: ["React", "TypeScript", "Cloudflare Workers", "R2 · D1"],
      links: { demo: "", code: "https://github.com/KYOgomes/angra-photos" },
      details: {
        summary: [
          "Depois de uma viagem para Ilha Grande, as fotos estavam espalhadas em dezenas de celulares e num grupo de WhatsApp que **comprime tudo e apaga a data das fotos**. O angra-photos resolve isso com um link, um nome e uma senha.",
          "Cada um envia direto da galeria do celular, em qualidade original, e o site organiza tudo por dia e pela hora em que cada foto foi tirada. Como a maior parte da turma tem mais de 60 anos, cada tela foi pensada para quem não tem intimidade com tecnologia — e o álbum ficou completo.",
        ],
        facts: [
          ["front", "React 19 · Vite · Tailwind 4 · shadcn/ui"],
          ["back", "Cloudflare Workers + Hono"],
          ["dados", "R2 (arquivos) · D1/SQLite (metadados)"],
          ["custo", "< R$ 5/mês para ~50 GB"],
        ],
        sections: [
          {
            title: "por que ele é diferente",
            items: [
              "**Ordem certa**: a data é lida de dentro do arquivo — EXIF nas fotos, metadados QuickTime/MP4 nos vídeos, com fuso horário.",
              "**Qualidade original**: o arquivo que chega é o mesmo que saiu do celular (HEIC, 4K, tudo).",
              "**Feito para os avós**: uma tela só com nome e senha, botões grandes, avisos claros e um círculo verde de *Finalizado!*.",
              "**Detecta repetidas**: SHA-256 para arquivos idênticos e uma impressão digital visual (dHash) para a mesma foto recomprimida pelo WhatsApp.",
              "**Salva na galeria**: no iPhone abre a tela de compartilhar do iOS; no Android baixa o original; um ✓ marca o que você já salvou.",
              "**Privado**: bucket fechado, URLs assinadas de curta duração, sessão por cookie HMAC e limite de tentativas na senha. Em português e inglês.",
            ],
          },
          {
            title: "engenharia",
            items: [
              "Upload **direto do navegador para o R2** por URLs pré-assinadas; vídeos grandes vão em multipart (partes de 10 MB, 3 em paralelo) e o envio **continua de onde parou** se a internet cair.",
              "Leitor de MP4/MOV próprio (~200 linhas) que lê só os cabeçalhos: alguns KB mesmo num vídeo de 2 GB.",
              "Hash em blocos de 4 MB para não derrubar o Safari do iPhone com vídeos inteiros na memória.",
              "Download do álbum em **ZIP gerado em streaming** por um service worker, gravando direto no disco.",
              "API e site num único Worker: mesmo domínio para o cookie e deploy em um comando.",
            ],
          },
        ],
        gallery: [
          { src: "images/projects/angra/07-desktop.jpg", caption: "Versão para computador, com o corredor animado de fotos", wide: true },
          { src: "images/projects/angra/01-login.jpg", caption: "Entrada: só nome e senha" },
          { src: "images/projects/angra/02-album.jpg", caption: "Topo do álbum" },
          { src: "images/projects/angra/03-galeria.jpg", caption: "Galeria agrupada por dia" },
          { src: "images/projects/angra/04-visualizador.jpg", caption: "Tela cheia com o ✓ de já salva" },
          { src: "images/projects/angra/05-selecao.jpg", caption: "Seleção, como na galeria do celular" },
          { src: "images/projects/angra/06-finalizado.jpg", caption: "Envio finalizado" },
        ],
        note: "As screenshots usam fotos de exemplo do Unsplash e nomes fictícios.",
      },
    },
    {
      name: "deep-forensics",
      description: "Detecção de adulteração em imagens combinando quatro análises (pontos de fuga, ELA, ruído e escala) com pesos adaptativos, API em Flask e benchmark de computação paralela. Trabalho interdisciplinar em grupo.",
      tags: ["Python", "OpenCV", "Flask"],
      links: { demo: "", code: "https://github.com/KYOgomes/TI6-DeepForensics" },
      details: {
        summary: [
          "Um detector de **imagens adulteradas**. Em vez de confiar num único sinal, ele roda quatro análises forenses diferentes em paralelo e combina os resultados com **pesos adaptativos** por imagem, chegando a um score de 0 a 100.",
          "O score cai em cinco zonas — *Manipulada, Alta chance, Inconclusiva, Consistência média e Consistente* — e a interface mostra as visualizações de cada análise para explicar o porquê do resultado. Trabalho Interdisciplinar VI da PUC Minas, feito em grupo de cinco.",
        ],
        facts: [
          ["algoritmo", "Python · OpenCV · NumPy"],
          ["backend", "Flask (API REST)"],
          ["front", "HTML, CSS e JS puros"],
          ["dataset", "CASIA ITDE"],
        ],
        blocks: [
          {
            title: "pipeline",
            text:
              `          ┌──────────────────────┐
 imagem → │  4 análises em       │
          │  paralelo            │
          └──────────┬───────────┘
   ┌───────────┬─────┴─────┬───────────┐
   ▼           ▼           ▼           ▼
 Pontos      ELA         Ruído       Escala
 de fuga   (recomp.    (variação   (blobs +
 (Hough +   JPEG 75)   em blocos   perspectiva)
  RANSAC)               32×32)
   └───────────┴─────┬─────┴───────────┘
                     ▼
        pesos adaptativos por imagem
                     ▼
         score 0–100  →  5 zonas`,
          },
        ],
        sections: [
          {
            title: "as quatro análises",
            items: [
              "**Pontos de fuga**: Canny + HoughLinesP + RANSAC medem se as linhas da cena convergem como deveriam.",
              "**ELA (Error Level Analysis)**: recomprime a imagem e procura regiões com nível de erro diferente do resto.",
              "**Ruído**: compara o coeficiente de variação do ruído entre blocos 32×32 — colagens costumam destoar.",
              "**Escala**: detecta objetos e confere se a altura bate com a perspectiva esperada.",
            ],
          },
          {
            title: "interface com 4 modos",
            items: [
              "**Imagem única**: análise completa com 8 visualizações (linhas, pontos de fuga, ELA, ruído, blobs…).",
              "**Lote**: várias imagens de uma vez, em modo paralelo ou sequencial, com tabela ordenada por score.",
              "**Dataset**: avalia imagens autênticas e manipuladas e mostra F1, acurácia, precisão, recall e matriz de confusão.",
              "**Benchmark**: roda com 1, 2, 4 ou N workers e mede speedup, eficiência e escalabilidade.",
            ],
          },
        ],
        gallery: [
          { src: "images/projects/deepForensics/01-analise-score-desktop.jpg", caption: "Resultado de uma análise: score final com a classificação, o peso de cada algoritmo e as linhas de fuga detectadas", wide: true },
          { src: "images/projects/deepForensics/02-mapas-forenses-desktop.jpg", caption: "Mapas forenses: ELA, inconsistência regional, ruído e objetos usados na checagem de escala" },
          { src: "images/projects/deepForensics/03-analise-em-lote-desktop.jpg", caption: "Lote de 12 imagens do dataset CASIA processadas em paralelo, com score de cada uma" },
          { src: "images/projects/deepForensics/04-benchmark-paralelo-desktop.jpg", caption: "Benchmark paralelo: speedup comparado à lei de Amdahl, eficiência, tempos e overhead" },
          { src: "images/projects/deepForensics/05-tela-inicial-desktop.jpg", caption: "Tela inicial: upload de imagem única ou em lote" },
        ],
        galleryLayout: "desktop",
      },
    },
    {
      name: "kmeans-paralelo",
      description: "Paralelização do algoritmo K-Means em C em quatro versões — sequencial, OpenMP na CPU, OpenMP na GPU e CUDA — chegando a 15× de speedup com um dataset real de 2,6 milhões de pontos.",
      tags: ["C", "OpenMP", "CUDA"],
      links: { demo: "", code: "https://github.com/KYOgomes/TrabalhoPraticoComputacaoParalela" },
      details: {
        summary: [
          "O K-Means agrupa pontos em K grupos, repetindo dois passos: atribuir cada ponto ao centro mais próximo e recalcular os centros. Partimos de uma implementação sequencial em C e criamos **três versões paralelas** para comparar o desempenho com dados reais.",
          "Os testes rodaram no servidor de computação paralela da PUC Minas, com um dataset real (UCI 3D Road Network) de **2.609.244 pontos**, K = 16 e 350 iterações. Trabalho em dupla com Lucas Rodrigues.",
        ],
        chart: {
          title: "speedup sobre a versão sequencial (56,56 s)",
          rows: [
            { label: "sequencial", value: 1.0, note: "56,56 s" },
            { label: "OpenMP 2 threads", value: 1.52, note: "37,19 s" },
            { label: "OpenMP 4 threads", value: 2.44, note: "23,15 s" },
            { label: "OpenMP 32 threads", value: 3.08, note: "18,36 s" },
            { label: "CUDA (GPU)", value: 15.2, note: "3,72 s", highlight: true },
          ],
          unit: "×",
        },
        sections: [
          {
            title: "como cada versão paraleliza",
            items: [
              "**OpenMP na CPU**: divide os laços sobre os pontos entre as threads, com redução manual em vetores privados para somar os centros sem condição de corrida.",
              "**OpenMP na GPU**: os pontos vão para a GPU uma única vez, num layout de vetores separados (SoA) para acesso coalescido à memória.",
              "**CUDA**: um kernel com uma thread por ponto funde os passos de atribuição e soma usando `atomicAdd`; por iteração, só um inteiro volta para a CPU.",
            ],
          },
          {
            title: "detalhes que fizeram diferença",
            items: [
              "**Iterações fixas** em vez de parar por convergência: pequenas diferenças de arredondamento nas reduções paralelas mudavam o número de iterações (9 contra 58), o que tornaria o speedup injusto.",
              "**SSE2 em vez de x87**: em compiladores 32 bits o cálculo de distância ficava ~90× mais lento; a flag certa levou um passo de 2,5 s para 0,03 s.",
              "A CPU satura em ~3× porque o algoritmo é limitado pela **banda de memória**; a GPU, mesmo de entrada (GT 1030), chega a 15,2×.",
            ],
          },
        ],
      },
    },
    {
      name: "interpretador-bytecode",
      description: "Interpretador para uma máquina de pilha: montagem em duas passagens, inteiros de 32 bits, saltos, chamadas de função e tratamento de erros de execução.",
      tags: ["Python", "Compiladores"],
      links: { demo: "", code: "https://github.com/KYOgomes/Interpreter_compiladores" },
      details: {
        summary: [
          "Um interpretador de **bytecode** para uma máquina de pilha, feito na disciplina de Compiladores. Ele lê um programa em texto, monta a lista de instruções e executa uma a uma, manipulando uma pilha de inteiros e a memória de variáveis.",
          "Suporta aritmética, comparações, variáveis, saltos com rótulos, chamadas de função e entrada e saída — o suficiente para escrever laços, condicionais e funções recursivas.",
        ],
        blocks: [
          {
            title: "exemplos/fatorial.txt",
            text:
              `READ            # lê n da entrada
STORE n
PUSH 1
STORE resultado

loop:
    LOAD n
    JZ fim          # se n == 0, termina
    LOAD resultado
    LOAD n
    MUL
    STORE resultado # resultado = resultado * n
    LOAD n
    PUSH 1
    SUB
    STORE n         # n = n - 1
    JMP loop

fim:
LOAD resultado
PRINT
HALT`,
          },
          {
            title: "terminal",
            text:
              `$ echo 5 | python interpretador.py exemplos/fatorial.txt
120

$ python interpretador.py teste_divisao.txt   # PUSH 10, PUSH 0, DIV
# error: div by zero`,
          },
        ],
        sections: [
          {
            title: "como funciona",
            items: [
              "**Duas passagens**: a montagem ignora comentários e resolve os rótulos; a execução percorre as instruções com um *program counter*.",
              "Inteiros de **32 bits com sinal**, com *wraparound* em overflow e divisão truncando para zero, como em C e Java.",
              "Erros de execução (divisão por zero, pilha vazia ou cheia) são reportados como `# error: <mensagem>`; a pilha tem limite de 1.000.000 de elementos.",
              "Validado com uma bateria de testes de entrada e saída esperada.",
            ],
          },
          {
            title: "instruções",
            items: [
              "Pilha: `PUSH n`, `POP` · Aritmética: `ADD SUB MUL DIV MOD NEG`",
              "Variáveis: `STORE nome`, `LOAD nome` · Comparações: `EQ NEQ LT GT LE GE`",
              "Fluxo: `JMP`, `JZ`, `JNZ`, `HALT` · Funções: `CALL`, `RET` · E/S: `PRINT`, `READ`",
            ],
          },
        ],
      },
    },
    {
      name: "trafego-distribuido",
      description: "Rede de semáforos inteligentes que se comunicam via gRPC para detectar congestionamentos, eleger um coordenador e sincronizar eventos, com dashboard web em tempo real.",
      tags: ["TypeScript", "gRPC", "Sistemas distribuídos"],
      links: { demo: "", code: "https://github.com/KYOgomes/TrabalhoPraticoComputacaoDistribuida" },
      details: {
        summary: [
          "Um sistema distribuído de monitoramento de tráfego urbano. Cada nó representa um cruzamento com semáforo inteligente: mede o volume de veículos, avisa os vizinhos quando há congestionamento e participa da escolha de um coordenador para as decisões globais.",
          "Trabalho prático da disciplina de Computação Distribuída da PUC Minas, implementando na prática RPC, relógios lógicos e eleição de líder.",
        ],
        blocks: [
          {
            title: "arquitetura",
            text:
              `┌─────────────┐   gRPC   ┌─────────────┐   gRPC   ┌─────────────┐
│    Nó 1     │◄────────►│    Nó 2     │◄────────►│    Nó 3     │
│ porta 50051 │          │ porta 50052 │          │ porta 50053 │
│  (sensor)   │          │  (sensor)   │          │  (sensor)   │
└──────┬──────┘          └─────────────┘          └─────────────┘
       │ REST (porta 3000)
┌──────▼──────┐
│  Dashboard  │
│   (React)   │
└─────────────┘`,
          },
        ],
        sections: [
          {
            title: "como funciona",
            items: [
              "**Sensor local**: a cada 10 s cada nó gera uma leitura de 0 a 100 veículos/min; acima de **70**, envia alertas gRPC aos vizinhos.",
              "**Propagação**: os vizinhos recebem o alerta, atualizam o relógio lógico e ajustam os próprios semáforos.",
              "**Dashboard**: o usuário envia leituras manuais pelo painel web, que entram na rede gRPC pelo Nó 1.",
            ],
          },
          {
            title: "conceitos de sistemas distribuídos",
            items: [
              "**RPC com gRPC** e Protocol Buffers: serviços `ReportTraffic`, `Election` e `SetCoordinator`.",
              "**Relógio de Lamport**: toda mensagem carrega o relógio, e cada nó faz `local = max(local, recebido) + 1`, garantindo a ordem causal dos eventos.",
              "**Eleição de líder (algoritmo do Valentão)**: se o coordenador cai, o nó pergunta aos de ID maior; sem resposta em 2 s, ele se declara líder e avisa os outros.",
              "**API REST** em Express como ponte entre o dashboard e a rede gRPC.",
            ],
          },
        ],
      },
    },
  ],

  education: {
    items: [
      {
        period: "2022 — 2026",
        title: "Bacharelado em Ciência da Computação",
        school: "PUC Minas",
        url: "https://www.pucminas.br",
        note: "cursando · conclusão prevista em julho/2027",
      },
      {
        period: "2019 — 2021",
        title: "Ensino Médio",
        school: "Colégio Magnum Cidade Nova",
        url: "",
        note: "",
      },
    ],
    // Certificados e cursos
    courses: [
      "**Inglês — nível avançado** · KUMON (2015–2018)",
      "**Banco de Dados Oracle — SQL, PL/SQL e Modelagem** · Udemy",
      "**Power BI — Análise de Dados e Business Intelligence** · Udemy",
      "**Microsoft Excel — do básico ao avançado** · Udemy",
    ],
  },

  skills: {
    linguagens: ["JavaScript", "Java", "C", "C++", "C#", "Dart", "SQL", "HTML", "CSS"],
    plataformas: ["SYDLE ONE (BPM/low-code)", "Spring Boot", "Flutter", "Android Studio", "Unity"],
    dados: ["Elasticsearch", "MySQL", "Oracle SQL/PL-SQL", "Azure"],
    integrações: ["APIs REST", "importação de dados", "planilhas Excel (.xlsx)"],
    "analytics & BI": ["dashboards", "Power BI", "Excel avançado", "ArcGIS"],
    modelagem: ["BPMN", "UML", "análise de requisitos", "design patterns (GoF/GRASP)"],
    ferramentas: ["Git", "GitHub", "VS Code", "IntelliJ"],
  },

  contact: {
    text: "Aberto a oportunidades, projetos e boas conversas. Me mande uma mensagem:",
    email: "caioga2011@gmail.com",
  },

  footer: "clique no lago para alimentar as carpas · use − e + lá em cima para mudar quantas nadam",

  // Ajustes do lago
  pond: {
    fishCount: null, // null = automático pelo tamanho da tela
    // Variedades na ordem em que entram no lago:
    // "showa" (preta e vermelha), "ogon" (dourada), "kohaku" (branca e vermelha),
    // "sanke" (kohaku com pintinhas pretas), "tancho" (mancha vermelha na cabeça), "chagoi" (laranja)
    varieties: ["showa", "ogon", "kohaku", "kohaku", "sanke", "tancho", "kohaku", "chagoi", "sanke"],
    cellSize: 14,    // tamanho de cada "pixel" ASCII em px
  },
};
