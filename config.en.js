/* =====================================================================
   VERSÃO EM INGLÊS — textos usados quando o botão "pt / en" está em "en".
   ---------------------------------------------------------------------
   Este arquivo só traz TEXTOS: links, imagens e o resto vêm do config.js.
   Ele segue a mesma estrutura do config.js e é combinado com ele:
     - listas de objetos (projetos, experiências, prints...) são casadas
       pela POSIÇÃO: o 1º projeto daqui traduz o 1º projeto de lá, etc.;
     - listas de textos (highlights, items, tags...) substituem as de lá.
   Ao mudar a ordem ou adicionar algo no config.js, ajuste aqui também.
   ===================================================================== */

window.PORTFOLIO_EN = {
  tagline: ["in a pond of ideas,", "swim with purpose"],

  greeting: "Hi, I'm Caio.",
  intro: [
    "Software engineer at [LEVTY](https://www.levty.com/br), focused on bringing ideas to life and helping others.",
    "Computer Science student at [PUC Minas](https://www.pucminas.br), in Belo Horizonte, Brazil.",
    "I build processes, integrations and automations — from the database to the interface.",
    "Currently exploring **AI agents** and **computer vision**, and striving to get better every day.",
  ],

  resume: {
    label: "résumé (pdf, in Portuguese) ↓",
  },

  photo: {
    alt: "Caio Gomes smiling, wearing a black polo shirt",
    caption: "Belo Horizonte, Brazil",
  },

  labels: {
    top: "pond",
    about: "about",
    experience: "experience",
    projects: "projects",
    education: "education",
    skills: "stack",
    contact: "contact",
  },

  about: [
    "I'm a software developer based in Belo Horizonte, Brazil, finishing my degree in **Computer Science at PUC Minas**. At [LEVTY](https://www.levty.com/br), I work with the **SYDLE ONE** platform: I model processes in BPMN, write business rules and automations in JavaScript, and integrate external systems through REST APIs.",
    "I enjoy the work that sits between code and people. I talk directly with clients to understand the problem, gather requirements and validate every delivery, and I handle large volumes of data, from imports with custom validations to **Elasticsearch** queries that power dashboards.",
    "In college, I'm going deeper into parallel and distributed computing, computer architecture, image processing and analysis, and computer vision. Before tech, I worked in accounting, which gave me a keen eye for processes and for the business behind every system. I speak English at an advanced level.",
  ],

  experience: [
    {
      period: "jan 2026 — present",
      role: "Junior Software Developer",
      description: "Belo Horizonte, Brazil · hybrid",
      highlights: [
        "Development on the SYDLE ONE platform, with BPMN process modeling, business rules and automations in JavaScript.",
        "Integrations with external systems through REST APIs, and imports of large volumes of data with custom validations.",
        "Advanced Elasticsearch queries and aggregations, optimizing searches and powering analytics and dashboards for clients.",
        "Front end in HTML, CSS and JavaScript, focused on user experience and on access control by roles and permissions.",
        "Direct contact with clients for requirements gathering, acceptance testing and support, in multidisciplinary agile teams.",
        "Exploring AI agents integrated into the platform's processes: intelligent automation, decision support and chatbots.",
      ],
      tags: ["SYDLE ONE", "BPMN", "JavaScript", "REST", "Elasticsearch", "AI"],
    },
    {
      period: "jan 2023 — aug 2023",
      role: "Accounting Assistant",
      company: "Independent accounting firm",
      description: "Minas Gerais, Brazil",
      highlights: [
        "Support with accounting routines, organization of tax documents, data entry into the system and client service.",
      ],
    },
  ],

  projects: [
    {
      // anabia-brownies
      description: "Web app (PWA) for the day-to-day of a home bakery: order calendar, stock per flavor, deliveries, expenses and profit by day, week and month — designed for the phone.",
      details: {
        summary: [
          "An app for Anabia Brownies to manage sales from the phone. It replaces scattered notes with a **calendar**: each day shows how many brownies are still available per flavor, the orders with who bought and whether they have paid, the expenses and the profit.",
          "It was designed to be used in the middle of the rush: it opens straight on today, adding an order takes just a few taps, and the app warns when an order exceeds the stock. It can be installed on the home screen like an app (PWA).",
          "Want to try it? The [demo](https://anabia-brownies-demo.vercel.app) opens with the test login already filled in and runs on a separate database, with fictional data only.",
        ],
        facts: [
          ["type", "mobile-first PWA"],
          ["front", "Next.js 16 · Tailwind 4"],
          ["data", "Supabase (Postgres, Auth, RLS)"],
          ["deploy", "Vercel"],
        ],
        sections: [
          {
            title: "what it does",
            items: [
              "**Monthly calendar** with sold and available brownies per day and an icon that shows whether all of the day's orders have been paid; tapping a day opens its panel right below.",
              "**Orders** with flavor, customer, sale option (e.g. 1 for R$ 7, 2 for R$ 12), date, time, place, notes and a **paid** checkbox.",
              "**Financial summary** for today, the week, the month or all time: profit, margin, sales, expenses, amounts receivable and a chart of sales per day.",
              "**Most ordered flavors** in the period, to know what to bake more of.",
              "**Instant Pix** (Brazil's instant payment system): the app itself generates the QR code following the Central Bank of Brazil standard, with a copy-and-paste option.",
              "**Expenses** recorded for a single day or for a whole week; flavors and sale options are configurable.",
            ],
          },
          {
            title: "business rules",
            items: [
              "The price is stored in the order: changing the price list later does not change the history.",
              "Weekly expenses count as 1/7 in each day's profit and in full in the week's profit.",
              "Profit = non-canceled sales − expenses, always by delivery date.",
            ],
          },
          {
            title: "architecture",
            items: [
              "App Router with Server Actions; a proxy refreshes the session and protects the authenticated routes.",
              "Supabase database with Row Level Security: each user can only see their own data.",
            ],
          },
        ],
        gallery: [
          { caption: "Desktop version of the financial summary, with a period selector (today, week, month and all time)" },
          { caption: "Home screen: calendar with sold/available per day and who has already paid" },
          { caption: "Monthly summary: profit, margin, sales, expenses and a chart of sales per day" },
          { caption: "Quick order entry; paid orders fade out with a single tap" },
          { caption: "Ranking of the most ordered flavors and orders not yet paid" },
          { caption: "Pix QR code generated by the app itself (Central Bank of Brazil standard)" },
          { caption: "Sign-in screen" },
        ],
        note: "Screenshots from the demo environment, with fictional data. Visitors can also edit the demo.",
      },
    },
    {
      // angra-photos
      description: "Shared trip album: everyone uploads photos and videos in original quality and the site sorts everything by the date they were taken — built to make organizing the photos of a family trip easy.",
      details: {
        summary: [
          "After a trip to Ilha Grande, the photos were scattered across dozens of phones and a WhatsApp group that **compresses everything and strips the photos' dates**. angra-photos solves this with a link, a name and a password.",
          "Everyone uploads straight from their phone's gallery, in original quality, and the site organizes everything by day and by the time each photo was taken. Since most of the group is over 60, every screen was designed for people who are not comfortable with technology — and the album ended up complete.",
        ],
        facts: [
          ["front", "React 19 · Vite · Tailwind 4 · shadcn/ui"],
          ["back", "Cloudflare Workers + Hono"],
          ["data", "R2 (files) · D1/SQLite (metadata)"],
          ["cost", "< R$ 5/month for ~50 GB"],
        ],
        sections: [
          {
            title: "what makes it different",
            items: [
              "**Right order**: the date is read from inside the file — EXIF in photos, QuickTime/MP4 metadata in videos, with time zone.",
              "**Original quality**: the file that arrives is the same one that left the phone (HEIC, 4K, everything).",
              "**Made for grandparents**: a single screen with just a name and a password, big buttons, clear messages and a green *Done!* circle.",
              "**Spots duplicates**: SHA-256 for identical files and a visual fingerprint (dHash) for the same photo recompressed by WhatsApp.",
              "**Saves to the gallery**: on iPhone it opens the iOS share sheet; on Android it downloads the original; a ✓ marks what you have already saved.",
              "**Private**: closed bucket, short-lived signed URLs, HMAC cookie sessions and a limit on password attempts. Available in Portuguese and English.",
            ],
          },
          {
            title: "engineering",
            items: [
              "Uploads go **straight from the browser to R2** through presigned URLs; large videos use multipart uploads (10 MB parts, 3 in parallel), and the upload **resumes where it left off** if the connection drops.",
              "Custom MP4/MOV parser (~200 lines) that reads only the headers: just a few KB even for a 2 GB video.",
              "Hashing in 4 MB chunks so that Safari on iPhone does not crash by holding entire videos in memory.",
              "Album download as a **ZIP generated by streaming** in a service worker, writing straight to disk.",
              "API and site in a single Worker: the same domain for the cookie and deploys with a single command.",
            ],
          },
        ],
        gallery: [
          { caption: "Desktop version, with the animated photo corridor" },
          { caption: "Sign-in: just a name and a password" },
          { caption: "Top of the album" },
          { caption: "Gallery grouped by day" },
          { caption: "Full screen, with the ✓ for photos already saved" },
          { caption: "Selection, just like in the phone's gallery" },
          { caption: "Upload complete" },
        ],
        note: "The screenshots use sample photos from Unsplash and fictional names.",
      },
    },
    {
      // deep-forensics
      description: "Image tampering detection combining four analyses (vanishing points, ELA, noise and scale) with adaptive weights, a Flask API and a parallel computing benchmark. Interdisciplinary group project.",
      details: {
        summary: [
          "A detector of **tampered images**. Instead of relying on a single signal, it runs four different forensic analyses in parallel and combines the results with **adaptive weights** for each image, producing a score from 0 to 100.",
          "The score falls into five zones — *Manipulated, High chance, Inconclusive, Medium consistency and Consistent* — and the interface shows the visualizations of each analysis to explain the result. Interdisciplinary Project VI at PUC Minas, built by a group of five.",
        ],
        facts: [
          ["algorithm", "Python · OpenCV · NumPy"],
          ["backend", "Flask (REST API)"],
          ["front", "plain HTML, CSS and JS"],
          ["dataset", "CASIA ITDE"],
        ],
        blocks: [
          {
            title: "pipeline",
            text:
              `          ┌──────────────────────┐
  image → │  4 analyses run      │
          │  in parallel         │
          └──────────┬───────────┘
   ┌───────────┬─────┴─────┬───────────┐
   ▼           ▼           ▼           ▼
 Vanishing   ELA         Noise       Scale
 points     (JPEG 75   (variation  (blobs +
 (Hough +   recomp.)   in 32×32    perspective)
  RANSAC)               blocks)
   └───────────┴─────┬─────┴───────────┘
                     ▼
         per-image adaptive weights
                     ▼
         score 0–100  →  5 zones`,
          },
        ],
        sections: [
          {
            title: "the four analyses",
            items: [
              "**Vanishing points**: Canny + HoughLinesP + RANSAC check whether the lines in the scene converge as they should.",
              "**ELA (Error Level Analysis)**: recompresses the image and looks for regions whose error level differs from the rest.",
              "**Noise**: compares the coefficient of variation of the noise across 32×32 blocks — spliced regions tend to stand out.",
              "**Scale**: detects objects and checks whether their height matches the expected perspective.",
            ],
          },
          {
            title: "interface with 4 modes",
            items: [
              "**Single image**: full analysis with 8 visualizations (lines, vanishing points, ELA, noise, blobs…).",
              "**Batch**: several images at once, in parallel or sequential mode, with a table sorted by score.",
              "**Dataset**: evaluates authentic and manipulated images and shows F1, accuracy, precision, recall and the confusion matrix.",
              "**Benchmark**: runs with 1, 2, 4 or N workers and measures speedup, efficiency and scalability.",
            ],
          },
        ],
        gallery: [
          { caption: "Result of an analysis: final score with its classification, the weight of each algorithm and the detected vanishing lines" },
          { caption: "Forensic maps: ELA, regional inconsistency, noise and the objects used in the scale check" },
          { caption: "Batch of 12 images from the CASIA dataset processed in parallel, with the score of each one" },
          { caption: "Parallel benchmark: speedup compared with Amdahl's law, efficiency, times and overhead" },
          { caption: "Home screen: single or batch image upload" },
        ],
      },
    },
    {
      name: "parallel-kmeans",
      description: "Parallelization of the K-Means algorithm in C in four versions — sequential, OpenMP on the CPU, OpenMP on the GPU and CUDA — reaching a 15× speedup on a real dataset of 2.6 million points.",
      details: {
        summary: [
          "K-Means groups points into K clusters by repeating two steps: assign each point to the nearest center and recompute the centers. We started from a sequential implementation in C and built **three parallel versions** to compare their performance on real data.",
          "The tests ran on the PUC Minas parallel computing server, with a real dataset (UCI 3D Road Network) of **2,609,244 points**, K = 16 and 350 iterations. Done in a pair with Lucas Rodrigues.",
        ],
        chart: {
          title: "speedup over the sequential version (56.56 s)",
          rows: [
            { label: "sequential", note: "56.56 s" },
            { label: "OpenMP 2 threads", note: "37.19 s" },
            { label: "OpenMP 4 threads", note: "23.15 s" },
            { label: "OpenMP 32 threads", note: "18.36 s" },
            { label: "CUDA (GPU)", note: "3.72 s" },
          ],
        },
        sections: [
          {
            title: "how each version parallelizes",
            items: [
              "**OpenMP on the CPU**: splits the loops over the points among the threads, with a manual reduction into private arrays to sum the centers without race conditions.",
              "**OpenMP on the GPU**: the points are sent to the GPU only once, in a structure-of-arrays (SoA) layout for coalesced memory access.",
              "**CUDA**: a kernel with one thread per point fuses the assignment and sum steps using `atomicAdd`; per iteration, only one integer goes back to the CPU.",
            ],
          },
          {
            title: "details that made a difference",
            items: [
              "**Fixed iterations** instead of stopping at convergence: small rounding differences in the parallel reductions changed the number of iterations (9 vs. 58), which would have made the speedup unfair.",
              "**SSE2 instead of x87**: with 32-bit compilers, the distance calculation was ~90× slower; the right flag took one step from 2.5 s to 0.03 s.",
              "The CPU saturates at ~3× because the algorithm is limited by **memory bandwidth**; the GPU, even an entry-level one (GT 1030), reaches 15.2×.",
            ],
          },
        ],
      },
    },
    {
      name: "bytecode-interpreter",
      description: "Interpreter for a stack machine: two-pass assembly, 32-bit integers, jumps, function calls and runtime error handling.",
      tags: ["Python", "Compilers"],
      details: {
        summary: [
          "A **bytecode** interpreter for a stack machine, built for the Compilers course. It reads a program as text, assembles the list of instructions and executes them one by one, operating on a stack of integers and a memory of variables.",
          "It supports arithmetic, comparisons, variables, jumps to labels, function calls, and input and output — enough to write loops, conditionals and recursive functions.",
        ],
        blocks: [
          {
            title: "exemplos/fatorial.txt",
            text:
              `READ            # read n from the input
STORE n
PUSH 1
STORE result

loop:
    LOAD n
    JZ end          # if n == 0, stop
    LOAD result
    LOAD n
    MUL
    STORE result    # result = result * n
    LOAD n
    PUSH 1
    SUB
    STORE n         # n = n - 1
    JMP loop

end:
LOAD result
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
            title: "how it works",
            items: [
              "**Two passes**: assembly skips comments and resolves the labels; execution steps through the instructions with a *program counter*.",
              "**32-bit signed** integers, with *wraparound* on overflow and division truncating toward zero, as in C and Java.",
              "Runtime errors (division by zero, empty or full stack) are reported as `# error: <message>`; the stack holds up to 1,000,000 elements.",
              "Validated with a suite of tests comparing the output with the expected output.",
            ],
          },
          {
            title: "instructions",
            items: [
              "Stack: `PUSH n`, `POP` · Arithmetic: `ADD SUB MUL DIV MOD NEG`",
              "Variables: `STORE name`, `LOAD name` · Comparisons: `EQ NEQ LT GT LE GE`",
              "Flow: `JMP`, `JZ`, `JNZ`, `HALT` · Functions: `CALL`, `RET` · I/O: `PRINT`, `READ`",
            ],
          },
        ],
      },
    },
    {
      name: "distributed-traffic",
      description: "Network of smart traffic lights that communicate via gRPC to detect congestion, elect a coordinator and synchronize events, with a real-time web dashboard.",
      tags: ["TypeScript", "gRPC", "Distributed systems"],
      details: {
        summary: [
          "A distributed system for monitoring urban traffic. Each node represents an intersection with a smart traffic light: it measures the volume of vehicles, alerts its neighbors when there is congestion and takes part in choosing a coordinator for global decisions.",
          "Course project for Distributed Computing at PUC Minas, putting RPC, logical clocks and leader election into practice.",
        ],
        blocks: [
          {
            title: "architecture",
            text:
              `┌─────────────┐   gRPC   ┌─────────────┐   gRPC   ┌─────────────┐
│   Node 1    │◄────────►│   Node 2    │◄────────►│   Node 3    │
│ port 50051  │          │ port 50052  │          │ port 50053  │
│  (sensor)   │          │  (sensor)   │          │  (sensor)   │
└──────┬──────┘          └─────────────┘          └─────────────┘
       │ REST (port 3000)
┌──────▼──────┐
│  Dashboard  │
│   (React)   │
└─────────────┘`,
          },
        ],
        sections: [
          {
            title: "how it works",
            items: [
              "**Local sensor**: every 10 s, each node generates a reading from 0 to 100 vehicles/min; above **70**, it sends gRPC alerts to its neighbors.",
              "**Propagation**: the neighbors receive the alert, update their logical clock and adjust their own traffic lights.",
              "**Dashboard**: the user sends manual readings through the web panel, and they enter the gRPC network through Node 1.",
            ],
          },
          {
            title: "distributed systems concepts",
            items: [
              "**RPC with gRPC** and Protocol Buffers: the `ReportTraffic`, `Election` and `SetCoordinator` services.",
              "**Lamport clock**: every message carries the clock, and each node does `local = max(local, received) + 1`, guaranteeing the causal order of events.",
              "**Leader election (bully algorithm)**: if the coordinator goes down, a node asks the nodes with a higher ID; with no answer within 2 s, it declares itself the leader and notifies the others.",
              "**REST API** in Express as the bridge between the dashboard and the gRPC network.",
            ],
          },
        ],
      },
    },
  ],

  education: {
    items: [
      {
        title: "Bachelor's degree in Computer Science",
        note: "in progress · expected graduation in July 2027",
      },
      {
        title: "High school",
      },
    ],
    courses: [
      "**English — advanced level** · KUMON (2015–2018)",
      "**Oracle Database — SQL, PL/SQL and Data Modeling** · Udemy",
      "**Power BI — Data Analysis and Business Intelligence** · Udemy",
      "**Microsoft Excel — from basic to advanced** · Udemy",
    ],
  },

  // Substitui a lista inteira (os nomes das categorias também mudam)
  skills: {
    languages: ["JavaScript", "Java", "C", "C++", "C#", "Dart", "SQL", "HTML", "CSS"],
    platforms: ["SYDLE ONE (BPM/low-code)", "Spring Boot", "Flutter", "Android Studio", "Unity"],
    data: ["Elasticsearch", "MySQL", "Oracle SQL/PL-SQL", "Azure"],
    integrations: ["REST APIs", "data imports", "Excel spreadsheets (.xlsx)"],
    "analytics & BI": ["dashboards", "Power BI", "advanced Excel", "ArcGIS"],
    modeling: ["BPMN", "UML", "requirements analysis", "design patterns (GoF/GRASP)"],
    tools: ["Git", "GitHub", "VS Code", "IntelliJ"],
  },

  contact: {
    text: "Open to opportunities, projects and good conversations. Send me a message:",
  },

  footer: "click the pond to feed the koi · use − and + to change how many are swimming",
};
