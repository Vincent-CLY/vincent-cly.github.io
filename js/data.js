/* ================= Portfolio Content Data =================
   Single source of truth for all editable portfolio content.
   Edit projects, toolkit items, experience, awards, or links here.
   Ready to convert directly to src/data/portfolio.ts when moving to React. */
(function(){
"use strict";

var EMAIL = "vincentchung413@gmail.com";
var SOCIALS = [
  { label:"GitHub", href:"https://github.com/Vincent-CLY", handle:"Vincent-CLY" },
  { label:"LinkedIn", href:"https://linkedin.com/in/lai-yin-chung-45b0a1289", handle:"lai-yin-chung" },
  { label:"Stack Overflow", href:"https://stackoverflow.com/users/22401621/chung-lai-yin-vincent", handle:"chung-lai-yin-vincent" },
  { label:"Instagram", href:"https://instagram.com/v_c.413", handle:"@v_c.413" }
];
var MARQUEE = ["Interfaces","Backends","Retrieval","Agents","Systems","Motion"];
var FACTS = [
  ["Based","Hong Kong"],
  ["Languages","Cantonese · English · Mandarin · Japanese"],
  ["Shipping since","2022, when the first PHP site went live"]
];
var STATEMENT = [
  ["I",0],["build",0],["for",0],["the",0],["web",0],["end",0],["to",0],["end:",0],
  ["interfaces",1],
  ["that",0],["feel",0],["considered,",0],
  ["services",1],
  ["that",0],["stay",0],["out",0],["of",0],["the",0],["way,",0],
  ["and",0],["the",0],
  ["AI",1],["plumbing",1],
  ["behind",0],["both.",0],["I",0],["learn",0],["fastest",0],["by",0],["shipping",0],
  ["something",0],["real,",0],["then",0],["taking",0],["it",0],["apart.",0]
];
var PROJECTS = [
  { id:"rag", index:"01", year:"2026", name:"RAG Backend", kind:"AI infrastructure", theme:"bone", visual:"rag",
    blurb:"A multi-stage retrieval-augmented generation backend that ingests resumes, papers, slides and scans, keeps their layout intact, and answers over them through REST and MCP.",
    points:["Java 21 gateway on virtual threads owns security, routing and rate limiting","Python data plane handles parsing, hybrid retrieval and LangGraph agents","Exposed via MCP and powers Chicerone — an AI wardrobe UI preview deployed on Cloudflare Workers"],
    tags:["Java 21","Spring Boot","Python","FastAPI","Qdrant","LangGraph","MCP"],
    links:[{label:"Source", href:"https://github.com/Vincent-CLY/RAG-Backend"},{label:"Wardrobe UI Demo", href:"https://chicerone.vchku413.workers.dev/"}] },
  { id:"agent", index:"02", year:"2026", name:"Agentic Skills OS", kind:"Developer tooling", theme:"graphite", visual:"agent",
    blurb:"A zero-bloat rules system for AI coding agents. One command detects your editor and installs modular, context-triggered rules instead of one giant prompt.",
    points:["Works across Cursor, Claude Code, Codex, Cline and Copilot","Auto-detected, one-click updates through an interactive truecolor CLI","Runs on demand through npx or uvx. Nothing to maintain locally"],
    tags:["Node.js","CLI","MCP","Markdown rules"],
    links:[{label:"Source", href:"https://github.com/Vincent-CLY/agentic-skills-mcp"}] },
  { id:"music", index:"03", year:"2024 – 26", name:"YT Music Player", kind:"Full-stack web app", theme:"flame", visual:"music",
    blurb:"A music player with its own backend. React and TypeScript on the front, Express behind it, pulling YouTube data through InnerTube and streaming audio over SSE.",
    points:["RESTful API layer with server-sent events for stream data","Local-storage caching so repeat browsing feels instant","Deployed on Vercel. Frontend rewritten in TypeScript"],
    tags:["React","TypeScript","Vite","Express","SSE","Vercel"],
    links:[{label:"Live", href:"https://yt-music-player.vercel.app"},{label:"Frontend", href:"https://github.com/Vincent-CLY/yt-music-player--front-end"},{label:"Backend", href:"https://github.com/Vincent-CLY/yt-music-player--backend"}] },
  { id:"rhythm", index:"04", year:"2026", name:"Rhythm Trainer", kind:"Embedded + Python", theme:"ink", visual:"rhythm",
    blurb:"A rhythm game scaffold for Raspberry Pi 5 that treats timing as something you can train, with GPIO tap zones, chart files, judgment logic and session analytics.",
    points:["Hardware abstraction so the same code runs on a Pi and a Windows dev box","JSON charts with optional training blocks and a randomised final round","CSV session logging for post-run analysis; optional camera air-detection"],
    tags:["Python","Raspberry Pi 5","GPIO","Pygame","CSV analytics"],
    links:[{label:"Source", href:"https://github.com/Vincent-CLY/rhythm-game-trainer"}] }
];
var TOOLKIT = [
  { group:"Interface & Motion", items:["TypeScript","React","Next.js","Vite","Tailwind CSS","GSAP","Three.js"] },
  { group:"Backend & Systems", items:["Java · Spring Boot","Python · FastAPI","Node · Express","Django","PHP","C++","REST · SSE"] },
  { group:"Data & AI", items:["SQL · MySQL","SQLite · Turso","Qdrant","LangChain · LangGraph","MCP","Docling"] },
  { group:"DevOps & Ship", items:["Git · GitHub","Cloudflare","Vercel","GitHub Pages","Let’s Encrypt"] }
];
var CREDENTIALS = [
  {
    id: "experience",
    group: "Experience",
    items: [
      {
        period: "Summer Intern",
        role: "AI Voice Bot QA & Regex Pattern Engineering",
        org: "Electrical and Mechanical Services Department (EMSD), HKSAR",
        desc: "Engineered and validated regex pattern matching test suites for an AI voice bot workflow in a public-sector engineering environment.",
        points: [
          "Built structured regex test matrices to stress-test conversational intent parsing and fallback paths",
          "Surfaced edge-case mismatches across bilingual phrasing and tightened pattern reliability"
        ],
        tags: ["Regex", "AI Voice Bot", "QA Testing", "HKSAR EMSD"],
        tag: "Internship",
        href: "https://www.emsd.gov.hk/",
        linkLabel: "Visit EMSD",
        icon: "voice",
        defaultOpen: true
      }
    ]
  },
  {
    id: "education",
    group: "Education",
    items: [
      {
        period: "Class of 2026",
        role: "BEng in Computer Engineering (Minor in Japanese)",
        org: "The University of Hong Kong (HKU)",
        desc: "Core grounding in computer systems, software engineering, and architecture paired with Japanese language studies.",
        points: [
          "Coursework spanning operating systems, algorithms, computer architecture, and full-stack software design",
          "Minor in Japanese — cross-cultural technical communication alongside Cantonese, English, and Mandarin"
        ],
        tags: ["Computer Engineering", "Systems", "Minor in Japanese", "HKU"],
        tag: "Degree",
        href: "https://engg.hku.hk/",
        linkLabel: "HKU Engineering",
        icon: "edu"
      }
    ]
  }
];
var RECOGNITION = [
  { date: "2026", title: "HKCERT CTF — Round 1", issuer: "HKCERT · Capture The Flag", badge: "Rank #52 · R1", href: "https://ctf.hkcert.org/", icon: "ctf" },
  { date: "2026", title: "Software Engineer Certificate", issuer: "HackerRank", badge: "Certificate", href: "https://www.hackerrank.com/certificates/4295fd056a84", icon: "hackerrank_software_engineer_cert", isSlot: true },
  // { date: "Year", title: "Award / Honour Title", issuer: "Institution or Competition", badge: "Award", href: "", icon: "award", isSlot: true }
];

var TK_ICONS = {
  "TypeScript":["typescript"], "React":["react"], "Vite":["vite"], "Next.js":["nextdotjs"],
  "GSAP":["greensock"], "Three.js":["threedotjs"], "Tailwind CSS":["tailwindcss"],
  "Java · Spring Boot":["openjdk","springboot"], "Python · FastAPI":["python","fastapi"],
  "Node · Express":["nodedotjs","express"], "Django":["django"], "PHP":["php"],
  "C++":["cplusplus"], "REST · SSE":["rest-sse"],
  "SQL · MySQL":["mysql"], "SQLite · Turso":["sqlite","turso"], "Qdrant":["qdrant"],
  "LangChain · LangGraph":["langchain","langgraph"], "MCP":["modelcontextprotocol"],
  "Docling":["docling"],
  "Git · GitHub":["git","github"], "Cloudflare":["cloudflare"], "Vercel":["vercel"], "GitHub Pages":["githubpages"],
  "Let’s Encrypt":["letsencrypt"]
};

window.PORTFOLIO_DATA = {
  EMAIL: EMAIL,
  SOCIALS: SOCIALS,
  MARQUEE: MARQUEE,
  FACTS: FACTS,
  STATEMENT: STATEMENT,
  PROJECTS: PROJECTS,
  TOOLKIT: TOOLKIT,
  TK_ICONS: TK_ICONS,
  CREDENTIALS: CREDENTIALS,
  RECOGNITION: RECOGNITION
};
})();
