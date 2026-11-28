(function(){
"use strict";
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo(0, 0);
var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var hasGsap = !!(window.gsap && window.ScrollTrigger);
if (hasGsap) gsap.registerPlugin(ScrollTrigger);


/* ================= data (loaded from js/data.js) ================= */
var D = window.PORTFOLIO_DATA || {};
var EMAIL = D.EMAIL, SOCIALS = D.SOCIALS, MARQUEE = D.MARQUEE, FACTS = D.FACTS, STATEMENT = D.STATEMENT;
var PROJECTS = D.PROJECTS, TOOLKIT = D.TOOLKIT, TK_ICONS = D.TK_ICONS, CREDENTIALS = D.CREDENTIALS, RECOGNITION = D.RECOGNITION;

/* ================= render: marquee ================= */
(function(){
  var track = document.getElementById("marqueeTrack");
  var rowHtml = MARQUEE.map(function(w,i){
    return '<span class="marquee-item"><span class="mq-word t-display'+(i%2?' outline-text':'')+'">'+w+'</span><span class="mq-dot"></span></span>';
  }).join("");
  var group = '<div class="marquee-row">'+rowHtml+'</div>';
  track.innerHTML = group+group+group+group;
})();

/* ================= render: about (Editorial Monograph × 3D Particle Form + 3×2 Minimal Facts Grid) ================= */
(function(){
  var sec = document.getElementById("about");
  var wrap = document.getElementById("facts");
  if (!wrap || !sec) return;
  var resumeEl = document.querySelector('#contact a[href*="Resume"]');
  var resumeHref = resumeEl ? resumeEl.getAttribute("href") : "#contact";

  /* 0 = sand, 1 = bone highlight, 2 = flame serif italic */
  var STMT = [
    ["I",0],["build",0],["for",0],["the",0],["web",0],["end",1],["to",1],["end",1],["—",0],
    ["interfaces",2],["that",0],["feel",0],["considered,",0],
    ["services",1],["that",0],["stay",0],["out",0],["of",0],["the",0],["way,",0],
    ["and",0],["the",0],["AI",2],["plumbing",2],["behind",0],["both.",0]
  ];
  var stmtHtml = STMT.map(function(w){
    var cls = "ab-word" + (w[1] === 1 ? " is-hi" : (w[1] === 2 ? " is-it" : ""));
    return '<span class="' + cls + '">' + w[0] + '</span>';
  }).join("");

  var ICO = {
    pin: '<svg class="ab-mico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6-5.6-6-10a6 6 0 1 1 12 0c0 4.4-6 10-6 10z"/><circle cx="12" cy="11" r="2.2"/></svg>',
    code: '<svg class="ab-mico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="8 7 3 12 8 17"/><polyline points="16 7 21 12 16 17"/><line x1="14" y1="5" x2="10" y2="19"/></svg>',
    edu: '<svg class="ab-mico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.6 2.7 3 6 3s6-1.4 6-3v-5"/></svg>',
    lang: '<svg class="ab-mico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>',
    layers: '<svg class="ab-mico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 3 2 8 12 13 22 8 12 3"/><polyline points="2 13 12 18 22 13"/><polyline points="2 18 12 23 22 18"/></svg>',
    status: '<svg class="ab-mico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><polyline points="9 12 11.2 14.2 15.5 9.8"/></svg>'
  };

  var PHIL = [
    ["“I",0],["learn",0],["fastest",0],["by",0],["shipping",0],["something",0],["real,",0],
    ["then",0],["taking",1],["it",1],["apart.”",1]
  ];
  var philHtml = PHIL.map(function(w){
    return '<span class="ab-pword' + (w[1] ? ' is-fl' : '') + '">' + w[0] + '</span>';
  }).join("");

  wrap.innerHTML = '' +
    '<div class="ab-top-grid" id="heroMeta">' +
      '<div class="ab-lead-col">' +
        '<h2 class="sec-title t-mega"><span class="mask"><span class="sec-line" style="display:block">About <span class="fl">me.</span></span></span></h2>' +
        '<p class="ab-statement" id="abStatement">' + stmtHtml + '</p>' +
        '<div class="ab-actions ab-fade">' +
          '<a class="ab-btn ab-btn--primary" href="#contact" data-cursor="Hire" data-morph="mail"><span>Get in touch</span><span class="ab-arr ab-arr--r" aria-hidden="true">→</span></a>' +
          '<a class="ab-btn" href="' + resumeHref + '" target="_blank" rel="noreferrer" data-cursor="PDF" data-morph="doc"><span>Résumé PDF</span><span class="ab-arr ab-arr--ur" aria-hidden="true">↗</span></a>' +
        '</div>' +
      '</div>' +
      '<aside class="ab-artifact" id="abArtifact">' +
        '<div class="ab-particle-stage" id="abParticleStage"><canvas id="abParticleCanvas" aria-hidden="true"></canvas></div>' +
        '<blockquote class="ab-phil" id="abPhil">' + philHtml + '</blockquote>' +
      '</aside>' +
    '</div>' +
    '<div class="ab-rule" id="abRule" aria-hidden="true"></div>' +
    '<div class="ab-meta-grid" id="abStrip">' +
      '<div class="ab-mitem" data-morph="pin"><span class="ab-mlbl">' + ICO.pin + 'Location</span><p class="ab-mval">Hong Kong <span class="ab-mdim" id="abHktClock">· UTC+8</span></p></div>' +
      '<div class="ab-mitem" data-morph="code"><span class="ab-mlbl">' + ICO.code + 'Coding since</span><p class="ab-mval"><span class="ab-scramble" data-final="2019">2019</span> <span class="ab-mdim">· Always learning</span></p></div>' +
      '<div class="ab-mitem" data-morph="edu"><span class="ab-mlbl">' + ICO.edu + 'Education</span><p class="ab-mval">BEng Computer Engineering <span class="ab-mdim ab-scramble" data-final="· HKU ’26">· HKU ’26</span></p></div>' +
      '<div class="ab-mitem" data-morph="globe"><span class="ab-mlbl">' + ICO.lang + 'Languages</span><p class="ab-mval">Cantonese, English, Mandarin, Japanese</p></div>' +
      '<div class="ab-mitem" data-morph="graph"><span class="ab-mlbl">' + ICO.layers + 'Focus</span><p class="ab-mval">Software <span class="ab-mdim">·</span> Web <span class="ab-mdim">·</span> AI <span class="ab-mdim">·</span> Automation</p></div>' +
      '<a class="ab-mitem ab-mitem--link" href="#contact" data-cursor="Hire" data-morph="check"><span class="ab-mlbl">' + ICO.status + 'Status</span><p class="ab-mval ab-mval--status"><span class="ab-beacon" aria-hidden="true"></span><span>Open to work <span class="ab-mdim">· Available Now →</span></span></p></a>' +
    '</div>';

  /* Live HKT Clock */
  var hktEl = document.getElementById("abHktClock");
  function tickAbClock(){
    if (!hktEl) return;
    var now = new Date(), hms = "";
    try { hms = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Hong_Kong", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(now); }
    catch (e) { hms = String((now.getUTCHours() + 8) % 24).padStart(2, "0") + ":" + String(now.getUTCMinutes()).padStart(2, "0") + ":" + String(now.getUTCSeconds()).padStart(2, "0"); }
    hktEl.textContent = "· " + hms + " UTC+8";
  }
  tickAbClock();
  setInterval(tickAbClock, 1000);

  if (typeof window.initAboutParticles === "function") window.initAboutParticles(wrap, sec, reduced);

  /* Kinetic monospace decode on numeric metadata values when scrolled into view */
  if (!reduced && "IntersectionObserver" in window) {
    var glyphs = "0123456789HKU/";
    var scrEls = document.querySelectorAll("#abStrip .ab-scramble");
    var sObs = new IntersectionObserver(function(es){
      es.forEach(function(en){
        if (!en.isIntersecting) return;
        sObs.unobserve(en.target);
        var el = en.target, finalTxt = el.getAttribute("data-final") || el.textContent, frame = 0, total = 14;
        var iv = setInterval(function(){
          frame++;
          var out = "";
          for (var j = 0; j < finalTxt.length; j++) {
            if (finalTxt[j] === " " || finalTxt[j] === "·" || j < Math.floor((frame / total) * finalTxt.length)) out += finalTxt[j];
            else out += glyphs[Math.floor(Math.random() * glyphs.length)];
          }
          el.textContent = out;
          if (frame >= total) { el.textContent = finalTxt; clearInterval(iv); }
        }, 32);
      });
    }, { threshold: 0.4 });
    scrEls.forEach(function(el){ sObs.observe(el); });
  }
})();

/* ================= render: work visuals ================= */
function ragVisual(){
  var nodes = [
    { y:18, label:"MCP / REST client", sub:"Chicerone UI · Claude · Cursor" },
    { y:100, label:"Gateway", sub:"Spring Boot · virtual threads" },
    { y:182, label:"AI plane", sub:"FastAPI · LangGraph · Docling" },
    { y:264, label:"Vector store", sub:"Qdrant · hybrid retrieval" }
  ];
  var s = '<svg class="rag-svg" viewBox="0 0 400 340" role="img" aria-label="Architecture: client, Java gateway, Python AI plane, Qdrant">';
  s += '<defs><path id="rag-path" d="M200 58 V100 M200 140 V182 M200 222 V264"/></defs>';
  nodes.forEach(function(n,i){
    s += '<g><rect x="30" y="'+n.y+'" width="340" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>';
    s += '<text x="44" y="'+(n.y+17)+'" font-family="JetBrains Mono, monospace" font-size="11" font-weight="600" fill="currentColor" letter-spacing="0.5">'+("0"+(i+1)).slice(-2)+' · '+n.label.toUpperCase()+'</text>';
    s += '<text x="44" y="'+(n.y+31)+'" font-family="JetBrains Mono, monospace" font-size="9.5" fill="currentColor" opacity="0.6">'+n.sub+'</text></g>';
  });
  [58,140,222].forEach(function(y){
    s += '<g><line x1="200" y1="'+y+'" x2="200" y2="'+(y+42)+'" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 4"/>';
    s += '<path d="M195 '+(y+34)+' L200 '+(y+42)+' L205 '+(y+34)+'" fill="none" stroke="currentColor" stroke-width="1.2"/></g>';
  });
  s += '<circle r="5" fill="#f2461f"><animateMotion dur="3.2s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear"><mpath href="#rag-path"/></animateMotion></circle>';
  s += '<text x="30" y="326" font-family="JetBrains Mono, monospace" font-size="9.5" fill="currentColor" opacity="0.55" letter-spacing="0.5">EDGE / CONTROL PLANE → AI / DATA PLANE</text>';
  s += '</svg>';
  return s;
}
function agentVisual(){
  return '<div class="term"><div class="term-bar"><i></i><i></i><i></i><span>~/project</span></div><div class="term-body" id="termBody"></div></div>';
}
function musicVisual(){
  var bars = "";
  for (var i=0;i<30;i++){
    var dur = 0.7 + ((i*37)%11)/8, del = -((i*53)%17)/6;
    bars += '<span style="animation:eq '+dur.toFixed(2)+'s ease-in-out '+del.toFixed(2)+'s infinite;transform:scaleY(0.2)"></span>';
  }
  return '<div class="music-vis"><div class="t-mono" style="display:flex;justify-content:space-between"><span>Now streaming · SSE</span><span style="font-variant-numeric:tabular-nums">02:41</span></div>'+
    '<div class="music-eq">'+bars+'</div>'+
    '<div><div class="music-prog"><i></i></div><div class="t-mono" style="margin-top:.75rem;display:flex;justify-content:space-between"><span>Cache: local</span><span>InnerTube → Express → React</span></div></div></div>';
}
function rhythmVisual(){
  var notes = [[0,0.0],[2,0.4],[1,0.9],[3,1.3],[0,1.8],[1,2.1],[2,2.6],[3,3.0],[1,3.4],[0,3.9],[3,4.2],[2,4.7]];
  var lanes = "";
  for (var l=0;l<4;l++){
    var ns = "";
    notes.forEach(function(n){
      if (n[0]!==l) return;
      ns += '<span class="rhythm-note" style="animation:notefall 4.8s linear '+(-(4.8-n[1])).toFixed(1)+'s infinite"></span>';
    });
    lanes += '<div class="rhythm-lane">'+ns+'</div>';
  }
  var pads = "";
  for (var k=1;k<=4;k++) pads += '<div class="t-mono"><b>'+k+'</b><span style="font-size:.55rem">GPIO</span></div>';
  return '<div class="rhythm-vis"><div class="rhythm-lanes">'+lanes+'</div><div class="rhythm-hit"></div><div class="rhythm-pads">'+pads+'</div></div>';
}
function visualFor(kind){
  if (kind==="rag") return ragVisual();
  if (kind==="agent") return agentVisual();
  if (kind==="music") return musicVisual();
  return rhythmVisual();
}

/* ================= render: projects ================= */
(function(){
  var stack = document.getElementById("projectStack");
  var GH_ICO = '<svg class="proj-ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>';
  stack.innerHTML = PROJECTS.map(function(p){
    var nameWords = p.name.split(" ").map(function(w){
      return '<span class="mask"><span class="proj-line" style="display:block">'+w+'</span></span>';
    }).join("");
    var tags = p.tags.map(function(t){ return '<li class="t-mono">'+t+'</li>'; }).join("");
    var compHtml = p.companion ? (
      '<a class="proj-companion" href="'+p.companion.href+'" target="_blank" rel="noreferrer" data-cursor="Demo">'+
        '<span class="proj-comp-left">'+
          '<span class="proj-comp-kicker t-mono"><span class="proj-live-dot" aria-hidden="true"></span>'+p.companion.badge+'</span>'+
          '<span class="proj-comp-name">'+p.companion.name+'</span>'+
        '</span>'+
        '<span class="proj-comp-right t-mono">'+p.companion.meta+' <span class="proj-arr" aria-hidden="true">↗</span></span>'+
      '</a>'
    ) : "";
    var links = p.links.map(function(l){
      var isLive = l.label.toLowerCase().indexOf("live") !== -1 || l.label.toLowerCase().indexOf("demo") !== -1;
      var cls = "proj-btn t-mono " + (isLive ? "proj-btn--live" : "proj-btn--src");
      var lead = isLive ? '<span class="proj-live-dot" aria-hidden="true"></span>' : GH_ICO;
      return '<a href="'+l.href+'" target="_blank" rel="noreferrer" data-cursor="'+(isLive ? 'Live' : 'Code')+'" class="'+cls+'">'+lead+'<span>'+l.label+'</span><span class="proj-arr" aria-hidden="true">↗</span></a>';
    }).join("");
    var points = p.points.map(function(pt){
      return '<li><span class="sq"></span><span>'+pt+'</span></li>';
    }).join("");
    var tone = (p.theme==="bone"||p.theme==="flame") ? ' data-nav-tone="ink"' : "";
    return '<article class="project theme-'+p.theme+'" aria-labelledby="proj-'+p.id+'"'+tone+'>'+
      '<div class="project-inner">'+
        '<div class="proj-meta t-mono"><span>'+p.index+' <span class="proj-sub">/ 04</span></span><span class="proj-sub">'+p.kind+'</span><span>'+p.year+'</span></div>'+
        '<div class="proj-grid">'+
          '<div class="proj-left"><div><h3 class="proj-name t-display" id="proj-'+p.id+'">'+nameWords+'</h3><p class="proj-blurb proj-fade">'+p.blurb+'</p></div>'+
          '<div class="proj-fade"><ul class="tagrow">'+tags+'</ul>'+compHtml+'<div class="proj-links">'+links+'</div></div></div>'+
          '<div class="proj-right"><div class="proj-visual">'+visualFor(p.visual)+'</div><ul class="proj-points proj-fade">'+points+'</ul></div>'+
        '</div>'+
      '</div><div class="veil"></div></article>';
  }).join("");
})();

/* ================= render: toolkit + socials ================= */
/* Local brand & custom technical SVG icons under assets/icons/. All 24
   tools carry high-contrast marks tailored for the obsidian card surface. */
(function(){
  var wrap = document.getElementById("tkGroups");
  wrap.innerHTML = TOOLKIT.map(function(g,gi){
    var boxes = g.items.map(function(it){
      var slugs = TK_ICONS[it];
      if (!slugs) return '<li class="tk-box tk-box--text" role="button" tabindex="0" aria-pressed="false" aria-label="'+it+' toolkit module"><svg class="tk-box-wire" aria-hidden="true"><polygon points="0,0 100,0 100,100 0,100"></polygon></svg><div class="tk-box-body"><span class="tk-name">'+it+'</span></div><svg class="tk-box-stroke" aria-hidden="true"><polygon points="0,0 100,0 100,100 0,100"></polygon></svg></li>';
      var imgs = slugs.map(function(s){
        return '<img src="assets/icons/'+s+'.svg" alt="" width="24" height="24" loading="lazy"/>';
      }).join("");
      return '<li class="tk-box" role="button" tabindex="0" aria-pressed="false" aria-label="'+it+' toolkit module"><svg class="tk-box-wire" aria-hidden="true"><polygon points="0,0 100,0 100,100 0,100"></polygon></svg><div class="tk-box-body"><div class="tk-box-left"><div class="tk-chip'+(slugs.length>1?' duo':'')+'" aria-hidden="true">'+imgs+'</div><span class="tk-name">'+it+'</span></div><div class="tk-meta-right"><svg class="tk-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg></div></div><svg class="tk-box-stroke" aria-hidden="true"><polygon points="0,0 100,0 100,100 0,100"></polygon></svg></li>';
    }).join("");
    return '<div class="tk-group"><div class="tk-group-head">'+
      '<span class="t-mono n">0'+(gi+1)+'</span><h3 class="t-narrow">'+g.group+'</h3>'+
      '<span class="t-mono cnt">'+g.items.length+' tools</span></div>'+
      '<ul class="tk-grid">'+boxes+'</ul></div>';
  }).join("");

/* Sync chamfered SVG polygons to exact pixel coordinates */
function syncChamferPolygons(){
  var cut = 12;
  document.querySelectorAll('.tk-box').forEach(function(card){
    var rect = card.getBoundingClientRect();
    var w = Math.max(40, Math.round(rect.width));
    var h = Math.max(40, Math.round(rect.height));
    var pts = ['0.5,0.5', (w-cut-0.5)+',0.5', (w-0.5)+','+(cut+0.5), (w-0.5)+','+(h-0.5), (cut+0.5)+','+(h-0.5), '0.5,'+(h-cut-0.5)].join(' ');
    card.querySelectorAll('svg.tk-box-wire, svg.tk-box-stroke').forEach(function(svg){
      svg.setAttribute('viewBox', '0 0 '+w+' '+h);
      var poly = svg.querySelector('polygon');
      if (poly) poly.setAttribute('points', pts);
    });
  });
}
window.addEventListener('resize', syncChamferPolygons);
window.addEventListener('load', syncChamferPolygons);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncChamferPolygons);
if ('ResizeObserver' in window) {
  var ro = new ResizeObserver(syncChamferPolygons);
  ro.observe(document.getElementById('tkGroups'));
}
syncChamferPolygons();

/* ================= render: credentials (jarnket recognition + aniwebcraft cursor-vicinity icon) ================= */
(function(){
  var wrap = document.getElementById('credGroups');
  var filtersWrap = document.getElementById('credFilters');
  var section = document.getElementById('credentials');
  if (!wrap) return;

  /* Dark-and-orange etched institutional emblem marks (or drop official PNG/SVG via badgeImg) */
  var FIELD_ICONS = {
    voice: '<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="27" stroke="#f2461f" stroke-width="1.6" stroke-dasharray="3 3"/><circle cx="32" cy="32" r="21" stroke="#e9e5db" stroke-opacity=".45" stroke-width="1.2"/><path d="M34 14L22 34h9l-3 16 14-22h-9l1-14z" fill="#f2461f" fill-opacity=".2" stroke="#f2461f" stroke-width="1.6" stroke-linejoin="round"/><text x="32" y="56" text-anchor="middle" fill="#e9e5db" font-family="JetBrains Mono,monospace" font-size="7.5" font-weight="700" letter-spacing="1">EMSD</text></svg>',
    edu: '<svg viewBox="0 0 64 64" fill="none"><path d="M14 12h36v20c0 13-10 21-18 24-8-3-18-11-18-24V12z" fill="rgba(242,70,31,.12)" stroke="#f2461f" stroke-width="1.7"/><path d="M14 25h36M32 12v44" stroke="#e9e5db" stroke-opacity=".32" stroke-width="1.1"/><text x="32" y="22" text-anchor="middle" fill="#e9e5db" font-family="Archivo,sans-serif" font-size="9" font-weight="800" letter-spacing="1">HKU</text><text x="32" y="42" text-anchor="middle" fill="#f2461f" font-family="JetBrains Mono,monospace" font-size="7" font-weight="700">1911</text></svg>',
    ctf: '<svg viewBox="0 0 64 64" fill="none"><polygon points="32,6 54,18 54,46 32,58 10,46 10,18" fill="rgba(242,70,31,.1)" stroke="#f2461f" stroke-width="1.6"/><path d="M23 45V19M23 20h19l-4 6 4 6H23" stroke="#e9e5db" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><text x="32" y="52" text-anchor="middle" fill="#f2461f" font-family="JetBrains Mono,monospace" font-size="6.8" font-weight="700" letter-spacing=".8">HKCERT</text></svg>',
    hackerrank_software_engineer_cert: '<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="27" fill="#0b0b0a" stroke="#e9e5db" stroke-opacity=".55" stroke-width="1.4"/><path d="M23 22v20M39 22v20M23 32h16" stroke="#e9e5db" stroke-width="3.4" stroke-linecap="round"/><rect x="43" y="24" width="7" height="7" fill="#2ec866"/></svg>',
    cert: '<svg viewBox="0 0 64 64" fill="none"><polygon points="32,7 53,19 53,45 32,57 11,45 11,19" fill="rgba(233,229,219,.05)" stroke="#e9e5db" stroke-opacity=".55" stroke-width="1.4"/><path d="M22 22v20M34 22v20M22 32h12" stroke="#e9e5db" stroke-width="2.6" stroke-linecap="round"/><rect x="38" y="36" width="8" height="6" fill="#f2461f"/></svg>',
    award: '<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="28" r="16" fill="rgba(242,70,31,.12)" stroke="#f2461f" stroke-width="1.6"/><path d="M25 42l-4 14 11-5 11 5-4-14" stroke="#e9e5db" stroke-width="1.6" stroke-linejoin="round"/><polygon points="32,18 35,25 42,25 36.5,29.5 38.5,36 32,32 25.5,36 27.5,29.5 22,25 29,25" fill="#f2461f"/></svg>'
  };

  var totalEntries = CREDENTIALS.reduce(function(sum, g){ return sum + g.items.length; }, 0) + RECOGNITION.length;
  if (filtersWrap) {
    var filterBtns = [{ id: 'all', label: 'All', count: totalEntries }].concat(
      CREDENTIALS.map(function(g){ return { id: g.id, label: g.group, count: g.items.length }; }),
      [{ id: 'recognition', label: 'Recognition', count: RECOGNITION.length }]
    );
    filtersWrap.innerHTML = filterBtns.map(function(f, idx){
      return '<button type="button" class="cred-filter t-mono' + (idx === 0 ? ' is-active' : '') + '" role="tab" aria-selected="' + (idx === 0 ? 'true' : 'false') + '" data-cred-filter="' + f.id + '">' +
        '<span>' + f.label + '</span><span class="cf-n">0' + f.count + '</span></button>';
    }).join('');
  }

  var seq = 0;
  var groupsHtml = CREDENTIALS.map(function(g, gi){
    var cards = g.items.map(function(it){
      seq++;
      var num = ('0' + seq).slice(-2);
      var isOpen = !!it.defaultOpen;
      var pts = (it.points || []).map(function(p){
        return '<li><span class="sq" aria-hidden="true"></span><span>' + p + '</span></li>';
      }).join('');
      var tags = (it.tags || []).map(function(t){
        return '<li class="t-mono">' + t + '</li>';
      }).join('');
      return '<li class="cred-card cred-track-item' + (isOpen ? ' is-open' : '') + '" data-icon="' + it.icon + '">' +
        '<button type="button" class="cred-trigger" aria-expanded="' + (isOpen ? 'true' : 'false') + '">' +
          '<div class="cred-meta-col"><span class="cred-idx t-mono">' + num + '</span><span class="cred-period t-mono">' + it.period + '</span></div>' +
          '<div class="cred-main"><h4 class="cred-role">' + it.role + '</h4><p class="cred-org">' + it.org + '</p></div>' +
          '<div class="cred-right"><span class="cred-badge t-mono">' + it.tag + '</span><span class="cred-plus" aria-hidden="true">+</span></div>' +
        '</button>' +
        '<div class="cred-drawer"><div class="cred-drawer-inner"><div class="cred-drawer-body">' +
          '<p class="cred-desc">' + it.desc + '</p>' +
          (pts ? '<ul class="cred-points">' + pts + '</ul>' : '') +
          (tags ? '<ul class="cred-tags">' + tags + '</ul>' : '') +
          (it.href ? '<a class="cred-drawer-link t-mono u-link" href="' + it.href + '" target="_blank" rel="noreferrer" data-cursor="Open">' + (it.linkLabel || 'Visit') + ' ↗</a>' : '') +
        '</div></div></div></li>';
    }).join('');
    return '<div class="cred-group" data-cred-group="' + g.id + '"><div class="cred-group-head">' +
      '<span class="t-mono n">0' + (gi + 1) + '</span><h3 class="t-narrow">' + g.group + '</h3>' +
      '<span class="t-mono cnt">' + g.items.length + ' ' + (g.items.length === 1 ? 'entry' : 'entries') + '</span></div>' +
      '<ul class="cred-list">' + cards + '</ul></div>';
  }).join('');

  var recogRows = RECOGNITION.map(function(r){
    var inner = '<span class="recog-date t-mono">' + r.date + '</span>' +
      '<span class="recog-title">' + r.title + '</span>' +
      '<span class="recog-issuer">' + r.issuer + '</span>' +
      '<span class="recog-badge t-mono">' + r.badge + (r.href ? '<span class="recog-arr" aria-hidden="true">↗</span>' : '') + '</span>';
    if (r.href) {
      return '<li><a class="recog-row is-link cred-track-item" href="' + r.href + '" target="_blank" rel="noreferrer" data-icon="' + r.icon + '">' + inner + '</a></li>';
    }
    return '<li class="recog-row cred-track-item' + (r.isSlot ? ' is-slot' : '') + '" data-icon="' + r.icon + '">' + inner + '</li>';
  }).join('');
  var recogHtml = '<div class="cred-group" data-cred-group="recognition"><div class="cred-group-head">' +
    '<span class="t-mono n">03</span><h3 class="t-narrow">Recognition</h3>' +
    '<span class="t-mono cnt">' + RECOGNITION.length + ' entries</span></div>' +
    '<ul class="recog-list">' + recogRows + '</ul></div>';

  wrap.innerHTML = groupsHtml + recogHtml;

  wrap.addEventListener('click', function(e){
    var btn = e.target.closest('.cred-trigger');
    if (!btn) return;
    var card = btn.closest('.cred-card');
    var open = card.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
    if (window.ScrollTrigger) setTimeout(function(){ ScrollTrigger.refresh(); }, 440);
  });

  if (filtersWrap) {
    filtersWrap.addEventListener('click', function(e){
      var btn = e.target.closest('.cred-filter');
      if (!btn) return;
      var target = btn.getAttribute('data-cred-filter');
      filtersWrap.querySelectorAll('.cred-filter').forEach(function(b){
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', String(active));
      });
      wrap.querySelectorAll('.cred-group').forEach(function(g){
        var show = target === 'all' || g.getAttribute('data-cred-group') === target;
        g.classList.toggle('is-hidden', !show);
      });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  }

  /* Cursor vicinity tracker + large icon-only square with exaggerated spring switch */
  /* Floating preview builds on every pointer type (mouse + touch); touch pins via tap, see below. */
  if (section && !reduced) {
    var badge = document.createElement('div');
    badge.id = 'credFloatIcon';
    badge.setAttribute('aria-hidden', 'true');
    badge.innerHTML = '<div class="cfi-stage"></div>';
    document.body.appendChild(badge);
    var stageEl = badge.querySelector('.cfi-stage');
    var BADGE_IMGS = { voice: { src: 'assets/badges/emsd.svg', cls: 'cfi-img cfi-img--emsd' }, edu: { src: 'assets/badges/University_of_Hong_Kong.svg', cls: 'cfi-img cfi-img--hku' }, hackerrank_software_engineer_cert: { src: 'assets/badges/hackerrank-software-engineer-cert.jpg', cls: 'cfi-img cfi-img--cert' } };
    var inside = false, tx = 0, ty = 0, cx = 0, cy = 0, vx = 0, raf = 0, currentItem = null, currentIconKey = '', currentIdx = -1;
    var isCoarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    var pinnedEl = null;
    var tiltX = 0, tiltY = 0; /* smoothed cursor-direction tilt, degrees */
    function setCertVariant(iconKey){ badge.classList.toggle('is-cert', iconKey === 'hackerrank_software_engineer_cert'); }

    function buildSlotContent(iconKey){
      var fallback = FIELD_ICONS[iconKey] || FIELD_ICONS.cert;
      var cfg = BADGE_IMGS[iconKey];
      var slot = document.createElement('div');
      if (cfg) {
        var img = new Image();
        img.className = cfg.cls;
        img.alt = '';
        img.onerror = function(){ slot.innerHTML = fallback; };
        img.src = cfg.src;
        slot.appendChild(img);
      } else {
        slot.innerHTML = fallback;
      }
      return slot;
    }
    function swapIcon(iconKey, dir){
      var enterCls = dir >= 0 ? 'is-enter-down' : 'is-enter-up';
      var exitCls = dir >= 0 ? 'is-exit-down' : 'is-exit-up';
      var prev = stageEl.querySelector('.cfi-slot.is-active-slot');
      if (prev) {
        prev.classList.remove('is-active-slot', 'is-enter-down', 'is-enter-up');
        prev.classList.add(exitCls);
        setTimeout(function(){ if (prev.parentNode) prev.parentNode.removeChild(prev); }, 480);
      }
      var next = buildSlotContent(iconKey);
      next.className = 'cfi-slot is-active-slot ' + enterCls;
      stageEl.appendChild(next);
    }
    function findNearest(px, py){
      var best = null, bestDist = 12, bestIdx = -1;
      var items = wrap.querySelectorAll('.cred-group:not(.is-hidden) .cred-track-item');
      items.forEach(function(el, idx){
        var r = el.getBoundingClientRect();
        if (px < r.left - 12 || px > r.right + 12) return;
        var dist = py < r.top ? (r.top - py) : (py > r.bottom ? (py - r.bottom) : 0);
        if (dist <= bestDist) { bestDist = dist; best = el; bestIdx = idx; }
      });
      return { el: best, idx: bestIdx };
    }
    function syncNearest(){
      if (!inside) return;
      var hit = findNearest(tx, ty);
      var near = hit.el;
      if (near !== currentItem) {
        if (currentItem) currentItem.classList.remove('is-near');
        var prevIdx = currentIdx;
        currentItem = near;
        currentIdx = hit.idx;
        if (currentItem) {
          currentItem.classList.add('is-near');
          var iconKey = currentItem.getAttribute('data-icon') || 'cert';
          setCertVariant(iconKey);
          if (iconKey !== currentIconKey) {
            var dir = (prevIdx === -1 || currentIdx >= prevIdx) ? 1 : -1;
            currentIconKey = iconKey;
            swapIcon(iconKey, dir);
          }
          badge.classList.add('is-visible');
        } else {
          badge.classList.remove('is-visible');
          currentIconKey = '';
        }
      }
    }
    function tickFloat(){
      raf = 0;
      if (isCoarse) return; /* touch: the frame is docked by CSS, never cursor-followed */
      var dvx = tx - cx, dvy = ty - cy;
      cx += dvx * 0.18;
      cy += dvy * 0.18;
      /* Tilt with the cursor: rightward drag leans right, upward drag leans forward; settles flat at rest. */
      tiltY += (Math.max(-18, Math.min(18, dvx * 0.28)) - tiltY) * 0.22;
      tiltX += (Math.max(-14, Math.min(14, -dvy * 0.28)) - tiltX) * 0.22;
      var frameW = 112;
      var px = Math.min(cx + 38, window.innerWidth - frameW - 12);
      var py = Math.max(12, cy - 56);
      badge.style.transform = 'translate3d(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px,0) rotateX(' + tiltX.toFixed(1) + 'deg) rotateY(' + tiltY.toFixed(1) + 'deg) scale(' + (inside && currentItem ? 1 : 0.86) + ')';
      if (inside || Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) raf = requestAnimationFrame(tickFloat);
    }
    section.addEventListener('pointerenter', function(e){
      inside = true; tx = cx = e.clientX; ty = cy = e.clientY;
      syncNearest();
      if (!raf && !isCoarse) raf = requestAnimationFrame(tickFloat);
    });
    section.addEventListener('pointermove', function(e){
      inside = true; tx = e.clientX; ty = e.clientY;
      syncNearest();
      if (!raf && !isCoarse) raf = requestAnimationFrame(tickFloat);
    }, { passive: true });
    section.addEventListener('pointerleave', function(){
      if (pinnedEl) return; /* a tap-pinned preview stays until the next tap */
      inside = false;
      badge.classList.remove('is-visible');
      if (currentItem) { currentItem.classList.remove('is-near'); currentItem = null; currentIconKey = ''; }
    });
    /* Touch: first tap pins the preview (same frame as desktop hover), second tap follows the link. */
    wrap.addEventListener('click', function(e){
      if (!isCoarse) return;
      var row = e.target.closest('.recog-row.is-link');
      if (!row) return;
      if (pinnedEl === row) { pinnedEl = null; row.classList.remove('is-pinned'); return; }
      e.preventDefault();
      if (pinnedEl) pinnedEl.classList.remove('is-pinned');
      pinnedEl = row;
      row.classList.add('is-pinned');
      if (currentItem) currentItem.classList.remove('is-near');
      currentItem = row;
      row.classList.add('is-near');
      var iconKey = row.getAttribute('data-icon') || 'cert';
      setCertVariant(iconKey);
      currentIconKey = '';
      swapIcon(iconKey, 1);
      currentIconKey = iconKey;
      badge.classList.add('is-visible');
    });
    window.addEventListener('scroll', function(){ if (inside) syncNearest(); }, { passive: true });
  }
})();

/* Click or keyboard Enter/Space pins/unpins the active hover state */
document.querySelectorAll('.tk-box').forEach(function(card){
  var togglePin = function(){
    var isPinned = card.classList.toggle('is-pinned');
    card.setAttribute('aria-pressed', String(isPinned));
  };
  card.addEventListener('click', togglePin);
  card.addEventListener('keydown', function(e){
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePin(); }
  });
});
  var soc = document.getElementById("socialsList");
  soc.innerHTML = SOCIALS.map(function(s){
    return '<li><a href="'+s.href+'" target="_blank" rel="noreferrer" data-cursor="Visit">'+
      '<span class="s-top t-mono">'+s.label+'<b>↗</b></span><span class="handle">'+s.handle+'</span></a></li>';
  }).join("");
})();

/* ================= terminal typing ================= */
(function(){
  var body = document.getElementById("termBody");
  if (!body) return;
  var lines = [
    { t:"$ npx -y github:Vincent-CLY/agentic-skills-mcp", c:"ok" },
    { t:"› scanning workspace…", c:"dm" },
    { t:"✓ detected  cursor · claude-code", c:"ok" },
    { t:"✓ 00-core-os.md", c:"ok" },
    { t:"✓ 01-ui-ux-master.md", c:"ok" },
    { t:"✓ AGENTS.md left untouched", c:"ok" },
    { t:"ready.", c:"fl" }
  ];
  var n = 1;
  function render(){
    var html = "";
    var upto = Math.min(n, lines.length);
    for (var i=0;i<upto;i++) html += '<div class="'+lines[i].c+'">'+lines[i].t+'</div>';
    html += '<span class="term-caret"></span>';
    body.innerHTML = html;
  }
  render();
  if (!reduced) setInterval(function(){ n = n >= lines.length+3 ? 1 : n+1; render(); }, 750);
})();

/* no live clock anywhere — the top nav is links + progress only */

/* ================= anchor scrolling (native) ================= */
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener("click", function(e){
    var id = a.getAttribute("href");
    if (id.length < 2) return;
    var target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  });
});
document.getElementById("toTop").addEventListener("click", function(){ window.scrollTo({top:0, behavior: reduced?"auto":"smooth"}); });

/* ================= copy email ================= */
(function(){
  var btn = document.getElementById("copyEmail");
  var timer = null;
  function openMail(){
    var a = document.createElement("a");
    a.href = "mailto:" + EMAIL;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  btn.addEventListener("click", function(){
    function done(){
      btn.textContent = "Copied ✓";
      clearTimeout(timer);
      timer = setTimeout(function(){ btn.innerHTML = "Copy&nbsp;email"; }, 2200);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(EMAIL).then(done).catch(openMail);
    } else { openMail(); }
  });
})();

/* ================= magnetic circles ================= */
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduced && hasGsap) {
  document.querySelectorAll(".magnet").forEach(function(el){
    var xTo = gsap.quickTo(el, "x", { duration:0.8, ease:"elastic.out(1, 0.5)" });
    var yTo = gsap.quickTo(el, "y", { duration:0.8, ease:"elastic.out(1, 0.5)" });
    el.addEventListener("mousemove", function(e){
      var r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width/2)) * 0.35);
      yTo((e.clientY - (r.top + r.height/2)) * 0.35);
    });
    el.addEventListener("mouseleave", function(){ xTo(0); yTo(0); });
  });
}

/* ================= cursor ================= */
(function(){
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  var dot = document.getElementById("cursorDot");
  var label = document.getElementById("cursorLabel");
  var mx = -100, my = -100, x = -100, y = -100;
  document.addEventListener("pointermove", function(e){ mx = e.clientX; my = e.clientY; }, { passive:true });
  (function loop(){
    x += (mx - x) * 0.22; y += (my - y) * 0.22;
    dot.style.left = x + "px"; dot.style.top = y + "px";
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll("a, button").forEach(function(el){
    el.addEventListener("pointerenter", function(){ dot.classList.add("is-ring"); });
    el.addEventListener("pointerleave", function(){ dot.classList.remove("is-ring"); });
  });
  document.querySelectorAll("[data-cursor]").forEach(function(el){
    el.addEventListener("pointerenter", function(){ label.textContent = el.getAttribute("data-cursor"); dot.classList.add("is-label"); });
    el.addEventListener("pointerleave", function(){ dot.classList.remove("is-label"); });
  });
})();

/* ================= nav tone over light panels ================= */
(function(){
  var rootEl = document.documentElement;
  var lightSections = document.querySelectorAll('[data-nav-tone="ink"]');
  if (!("IntersectionObserver" in window) || !lightSections.length) return;
  var obs = new IntersectionObserver(function(entries){
    var any = false;
    entries.forEach(function(en){ if (en.isIntersecting) any = true; });
    /* recompute from all observed */
    var hit = false;
    lightSections.forEach(function(s){
      var r = s.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.5) hit = true;
    });
    rootEl.setAttribute("data-tone", hit ? "ink" : "");
    if (!hit) rootEl.removeAttribute("data-tone");
  }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
  lightSections.forEach(function(s){ obs.observe(s); });
})();

/* ================= scroll progress ================= */
(function(){
  var bar = document.getElementById("scrollProgressBar");
  function onScroll(){
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
    bar.style.transform = "scaleX(" + p + ")";
  }
  document.addEventListener("scroll", onScroll, { passive:true });
  onScroll();
})();

/* ================= hero portrait as a settled square grid =================
   The "one field" idea from the cobalt version, without an engine: the
   Firefly cut-out is sampled into grid cells (colour averaged per cell by
   the browser's own smoothing draw), and the settled frame IS the grid of
   squares — the plain photograph is never drawn over it. Squares settle
   in from the top, centre-out, once, when the preloader lifts. */

/* ================= terrain-lines backdrop (Scene) =================
   Fixed WebGL backdrop restored from the original project: a displaced
   ridge grid drawn twice — an ink occluder mesh that hides the far side
   of each ridge, and one line strip per row on top of it, lifted by
   uLift. Shared mutable sceneState is driven by the preloader (intro)
   and by the scroll moods bound in the GSAP section below. */
var sceneState = { opacity: 1, pitch: 0, amp: 1, freq: 1, warm: 0, intro: reduced ? 1 : 0, footerHover: false };
var terrainState = null;
if (typeof window.initTerrain === "function") window.initTerrain(sceneState, reduced);

/* ================= preloader + hero entrance ================= */
var heroIntroPlayed = false;
var heroParallaxInit = false;
function syncHeroExit(){
  var topEl = document.getElementById("top");
  var giant = document.querySelector(".giant");
  var visual = document.getElementById("heroVisual");
  var halo = document.getElementById("heroHalo");
  var blackout = document.getElementById("heroBlackout");
  var cue = document.querySelector(".scroll-cue");
  if (!topEl) return;
  var vh = Math.max(1, window.innerHeight);
  var half = Math.max(1, topEl.offsetHeight * 0.5);
  var p = Math.max(0, Math.min(1, -topEl.getBoundingClientRect().top / half));
  if (giant) {
    giant.style.transformOrigin = "50% 100%";
    giant.style.transform = "translate3d(0," + (-0.45 * vh * p).toFixed(1) + "px,0) scale(" + (1 + 0.05 * p).toFixed(4) + ")";
  }
  if (visual) {
    visual.style.translate = "-45% 0";
    visual.style.transformOrigin = "50% 100%";
    visual.style.opacity = "1";
    visual.style.transform = "translate3d(0," + (-0.14 * vh * p).toFixed(1) + "px,0) scale(" + (1 + 0.18 * p).toFixed(4) + ")";
  }
  if (halo) {
    halo.style.translate = "";
    halo.style.transform = "translate3d(0," + (-0.3 * vh * p).toFixed(1) + "px,0) scale(" + (1 + 0.06 * p).toFixed(4) + ")";
    halo.style.opacity = (1 - 0.5 * p).toFixed(3);
  }
  if (blackout) blackout.style.opacity = p.toFixed(3);
  if (cue) cue.style.opacity = Math.max(0, 1 - p * 3).toFixed(3);
}
function initHeroParallax(){
  if (heroParallaxInit) return; heroParallaxInit = true;
  if (reduced) return;
  window.addEventListener("scroll", syncHeroExit, { passive: true });
  window.addEventListener("resize", syncHeroExit, { passive: true });
  syncHeroExit();
}
function playHeroIntro(){
  if (heroIntroPlayed) return; heroIntroPlayed = true;
  if (!hasGsap || reduced || window.scrollY > 20) {
    if (hasGsap) gsap.set([".giant .char", "#heroVisual"], { y: 0, yPercent: 0, opacity: 1 });
    initHeroParallax();
    return;
  }
  var tl = gsap.timeline({ defaults:{ ease:"expo.out" }, onComplete: initHeroParallax });
  tl.fromTo(".giant .char", { yPercent: 115 }, { yPercent: 0, duration: 1.3, stagger: 0.045 }, 0)
    .fromTo("#heroVisual", { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5 }, 0.15);
}
(function(){
  if (reduced || !hasGsap) {
    sceneState.intro = 1;
    initHeroParallax();
    return;
  }
  gsap.to(sceneState, { intro: 1, duration: 2.0, ease: "power2.out" });
  playHeroIntro();
  if (window.ScrollTrigger) setTimeout(function(){ ScrollTrigger.refresh(); }, 120);
})();

/* ================= GSAP scroll motion ================= */
if (hasGsap && !reduced) {

  /* --- marquee: velocity-responsive ticker --- */
  (function(){
    var el = document.getElementById("marqueeTrack");
    var setX = gsap.quickSetter(el, "x", "px");
    var skewTo = gsap.quickTo(el, "skewX", { duration: 0.5, ease: "power3" });
    var x = 0, dir = -1, boost = 0;
    gsap.ticker.add(function(_t, dt){
      var half = el.scrollWidth / 2;
      if (!half) return;
      x += (dir * (60 + Math.abs(boost) * 0.18) * dt) / 1000;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      setX(x);
      boost *= 0.92;
    });
    ScrollTrigger.create({
      trigger: "#marquee", start: "top bottom", end: "bottom top",
      onUpdate: function(self){
        var vel = self.getVelocity();
        if (vel !== 0) dir = vel > 0 ? -1 : 1;
        boost = Math.min(Math.abs(vel), 6000);
        skewTo(gsap.utils.clamp(-8, 8, vel / -300));
      }
    });
  })();

  /* --- section titles: mega line reveal --- */
  gsap.utils.toArray(".sec-title").forEach(function(t){
    gsap.fromTo(t.querySelectorAll(".sec-line"), { yPercent: 112 }, {
      yPercent: 0, duration: 1.3, ease: "expo.out", stagger: 0.1,
      scrollTrigger: { trigger: t, start: "top 86%" }
    });
  });
  /* about: Pure cinematic Blur-In text animation (zero scaling / zero font-stretch distortion) */
  if (document.querySelector("#abStatement .ab-word")) {
    gsap.fromTo("#abStatement .ab-word", { opacity: 0, filter: "blur(12px)", y: 8 }, {
      opacity: 1, filter: "blur(0px)", y: 0, duration: 0.85, stagger: 0.032, ease: "power3.out",
      scrollTrigger: { trigger: "#abStatement", start: "top 86%" }
    });
  }
  if (document.querySelector("#abPhil .ab-pword")) {
    gsap.fromTo("#abPhil .ab-pword", { opacity: 0, filter: "blur(10px)", y: 6 }, {
      opacity: 1, filter: "blur(0px)", y: 0, duration: 0.8, stagger: 0.038, ease: "power3.out",
      scrollTrigger: { trigger: "#abPhil", start: "top 88%" }
    });
  }
  if (document.querySelector(".ab-fade")) {
    gsap.fromTo(".ab-fade", { opacity: 0, filter: "blur(8px)", y: 10 }, {
      opacity: 1, filter: "blur(0px)", y: 0, duration: 0.85, ease: "power3.out", stagger: 0.08,
      scrollTrigger: { trigger: "#about", start: "top 82%" }
    });
  }
  if (document.getElementById("abArtifact")) {
    gsap.fromTo("#abArtifact", { opacity: 0, filter: "blur(12px)" }, {
      opacity: 1, filter: "blur(0px)", duration: 1.05, ease: "power2.out",
      scrollTrigger: { trigger: "#abArtifact", start: "top 86%" }
    });
  }
  if (document.getElementById("abRule")) {
    gsap.fromTo("#abRule", { scaleX: 0 }, {
      scaleX: 1, duration: 1.05, ease: "expo.out",
      scrollTrigger: { trigger: "#abRule", start: "top 90%" }
    });
  }
  if (document.querySelector("#abStrip .ab-mitem")) {
    gsap.fromTo("#abStrip .ab-mitem", { opacity: 0, filter: "blur(9px)", y: 10 }, {
      opacity: 1, filter: "blur(0px)", y: 0, duration: 0.82, ease: "power3.out", stagger: 0.065,
      scrollTrigger: { trigger: "#abStrip", start: "top 88%" }
    });
  }

  /* --- work: title reveal, card entrances, sticky stack squeeze --- */
  gsap.fromTo(".work-title .char-line", { yPercent: 110 }, {
    yPercent: 0, duration: 1.4, ease: "expo.out", stagger: 0.1,
    scrollTrigger: { trigger: ".work-title", start: "top 85%" }
  });
  gsap.utils.toArray(".project").forEach(function(card){
    var tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 62%" } });
    tl.fromTo(card.querySelectorAll(".proj-line"), { yPercent: 110 }, { yPercent: 0, duration: 1.3, ease: "expo.out", stagger: 0.08 }, 0)
      .fromTo(card.querySelectorAll(".proj-fade"), { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.1 }, 0.15)
      .fromTo(card.querySelector(".proj-visual"), { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.4, ease: "expo.inOut" }, 0.1);
  });
  /* Deterministic sticky-card squeeze & veil measured from non-sticky #projectStack
     so ScrollTrigger.refresh() or mid-page reloads can never leave cards 01-03 dimmed */
  (function(){
    var stackEl = document.getElementById("projectStack");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".project"));
    if (!stackEl || !cards.length) return;
    function syncWorkStack(){
      var desktop = window.innerWidth >= 768;
      var vh = Math.max(1, window.innerHeight);
      var stackTop = stackEl.getBoundingClientRect().top;
      var cumH = 0;
      cards.forEach(function(card, i){
        var inner = card.querySelector(".project-inner");
        var veil = card.querySelector(".veil");
        var cardH = card.offsetHeight || vh;
        card.style.top = desktop ? "0px" : Math.min(0, Math.round(vh - cardH)) + "px";
        cumH += cardH;
        if (i === cards.length - 1) {
          if (inner) inner.style.transform = "";
          if (veil) veil.style.opacity = "0";
          return;
        }
        var nextNaturalTop = stackTop + cumH;
        var p = Math.max(0, Math.min(1, (vh - nextNaturalTop) / vh));
        var lift = desktop ? -4 : -2;
        var shrink = desktop ? 0.07 : 0.05;
        if (inner) {
          inner.style.transformOrigin = desktop ? "50% 50%" : "50% 100%";
          inner.style.transform = p > 0.001 ? "translate3d(0," + (lift * p).toFixed(2) + "%,0) scale(" + (1 - shrink * p).toFixed(4) + ")" : "";
        }
        if (veil) veil.style.opacity = ((desktop ? 0.7 : 0.65) * p).toFixed(3);
      });
    }
    window.addEventListener("scroll", syncWorkStack, { passive: true });
    window.addEventListener("resize", syncWorkStack, { passive: true });
    if ("ResizeObserver" in window) {
      var stackRo = new ResizeObserver(syncWorkStack);
      stackRo.observe(stackEl);
    }
    syncWorkStack();
  })();
  /* --- toolkit: group head rises, boxes stagger in --- */
  gsap.utils.toArray(".tk-group").forEach(function(g){
    var tl = gsap.timeline({ scrollTrigger: { trigger: g, start: "top 82%" } });
    tl.fromTo(g.querySelector(".tk-group-head"), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "expo.out" }, 0)
      .fromTo(g.querySelectorAll(".tk-box"), { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.05 }, 0.1);
  });

  /* --- credentials: title + groups --- */
  gsap.fromTo(".cred-line", { yPercent: 112 }, {
    yPercent: 0, duration: 1.4, ease: "expo.out", stagger: 0.1,
    scrollTrigger: { trigger: ".cred-title", start: "top 85%" }
  });
  gsap.utils.toArray(".cred-group").forEach(function(g){
    var tl = gsap.timeline({ scrollTrigger: { trigger: g, start: "top 85%" } });
    tl.fromTo(g.querySelector(".cred-group-head"), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "expo.out" }, 0)
      .fromTo(g.querySelectorAll(".cred-card"), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: "expo.out", stagger: 0.08 }, 0.1);
  });

  /* --- contact: title + fade-ins --- */
  gsap.fromTo(".ct-line", { yPercent: 112 }, {
    yPercent: 0, duration: 1.5, ease: "expo.out", stagger: 0.12,
    scrollTrigger: { trigger: ".ct-title", start: "top 80%" }
  });
  gsap.fromTo(".ct-fade", { y: 30, opacity: 0 }, {
    y: 0, opacity: 1, duration: 1.1, ease: "expo.out", stagger: 0.08,
    scrollTrigger: { trigger: ".ct-email-grid", start: "top 90%" }
  });

  window.addEventListener("load", function(){ ScrollTrigger.refresh(); });
  /* rAF-independent refresh: if the ticker stalls, scrubbed triggers
     keep stale start/end and progress reads 0 at any scroll position. */
  [100, 600, 1500, 3000].forEach(function(ms){ setTimeout(function(){ ScrollTrigger.refresh(); }, ms); });

  /* rAF-stall fallback: if the ticker never ticks, every fromTo() above
     stays at its "from" state (opacity 0 / clipped / translated) and the
     page looks empty. Detect the stall and jump everything to final. */
  var rafFired = false;
  requestAnimationFrame(function(){ rafFired = true; });
  setTimeout(function(){
    if (rafFired) return;
    gsap.set([
      ".sec-line", ".ab-word", ".ab-fade", "#abArtifact", "#abRule", ".ab-mitem", ".work-title .char-line", ".proj-line", ".proj-fade",
      ".tk-group-head", ".tk-box", ".cred-line", ".cred-group-head", ".cred-card",
      ".ct-line", ".ct-fade", ".giant .char", "#heroVisual"
    ], { opacity: 1, x: 0, y: 0, yPercent: 0, scale: 1, scaleX: 1, filter: "none" });
    gsap.set([".proj-visual", ".ab-mval"], { clipPath: "inset(0 0 0% 0)", y: 0 });
    gsap.set([".ab-pword"], { opacity: 1 });
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }, 1200);
}


if (typeof window.initFooterWave === "function") window.initFooterWave(sceneState, reduced);
})();
