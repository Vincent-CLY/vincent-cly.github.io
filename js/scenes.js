/* ================= WebGL / Three.js Background & Footer Scenes =================
   Isolated canvas controllers — map 1:1 to <TerrainBackdrop /> and <FooterTopoCanvas /> in React. */
(function(){
"use strict";

var terrainState = null;

window.initTerrain = function(sceneState, reduced){
  var holder = document.getElementById("terrainBg");
  if (!holder || !window.THREE) return;
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch (e) { return; }
  if (!renderer) return;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  holder.appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  var aspect = window.innerWidth / Math.max(1, window.innerHeight);
  var camera = new THREE.PerspectiveCamera(aspect < 0.8 ? 52 : 38, aspect, 0.1, 100);
  camera.position.set(0, 2.1, 8.2);
  camera.lookAt(0, 0.1, -4.5);

  var shared = {
    uTime:     { value: 0 },
    uAmp:      { value: 1 },
    uFreq:     { value: 1 },
    uIntro:    { value: sceneState.intro },
    uWarm:     { value: 0 },
    uMouse:    { value: new THREE.Vector2(99, 99) },
    uMouseAmp: { value: 1.0 },
    uClick:    { value: new THREE.Vector3(0, 0, -99) },
    uLift:     { value: 0 },
    uBone:     { value: new THREE.Color(0xe9e5db) },
    uFlame:    { value: new THREE.Color(0xf2461f) },
    uBg:       { value: new THREE.Color(0x0b0b0a) }
  };
  /* Vertex shader: the original Scene terrain, verbatim. Height varies
     mainly along X (1.1 / 2.7 / 6.1 + two pow7 spikes on X), so every row
     line zig-zags into sharp ridges left-to-right — that X-frequency is
     what makes the dense mountain-range look in the reference. */
  var vertexShader = [
    "uniform float uTime;",
    "uniform float uAmp;",
    "uniform float uFreq;",
    "uniform float uIntro;",
    "uniform vec2 uMouse;",
    "uniform float uMouseAmp;",
    "uniform vec3 uClick;",
    "uniform float uLift;",
    "varying float vH;",
    "varying float vDist;",
    "float spike(float x){",
    "  float s = abs(sin(x));",
    "  return pow(s, 7.0);",
    "}",
    "float terrain(vec2 p){",
    "  float env = exp(-pow(p.x / 5.2, 2.0));",
    "  float t = uTime;",
    "  float f = uFreq;",
    "  float n = 0.0;",
    "  n += sin(p.x * 1.1 * f + t * 0.30 + p.y * 0.55) * 0.55;",
    "  n += sin(p.x * 2.7 * f - t * 0.46 + p.y * 1.60) * 0.28;",
    "  n += sin(p.x * 6.1 * f + t * 0.85 - p.y * 2.20) * 0.12;",
    "  n += spike(p.x * 3.3 * f + p.y * 1.9 - t * 0.6) * 0.42;",
    "  n += spike(p.x * 1.7 * f - p.y * 0.8 + t * 0.4 + 2.0) * 0.35;",
    "  float near = mix(0.5, 1.0, smoothstep(2.5, -7.0, p.y));",
    "  float h = n * (0.25 + env * 1.05) * near;",
    "  float age = mod(t, 5.0);",
    "  float ring = exp(-pow(distance(p, vec2(0.0, -7.0)) - age * 4.5, 2.0) * 1.2);",
    "  h += ring * 0.55 * exp(-age * 0.45);",
    "  float d = distance(p, uMouse);",
    "  h += 1.15 * uMouseAmp * exp(-d * d * 0.55);",
    "  float ca = t - uClick.z;",
    "  if (ca > 0.0 && ca < 4.0) {",
    "    float cr = exp(-pow(distance(p, uClick.xy) - ca * 4.2, 2.0) * 2.4);",
    "    h += cr * 1.5 * exp(-ca * 0.9);",
    "  }",
    "  return h;",
    "}",
    "void main(){",
    "  vec3 pos = position;",
    "  float h = terrain(pos.xz) * uAmp * uIntro;",
    "  vec3 p = vec3(pos.x, pos.y + h, pos.z);",
    "  vH = p.y;",
    "  p.y += uLift;",
    "  vec4 mv = modelViewMatrix * vec4(p, 1.0);",
    "  vDist = -mv.z;",
    "  gl_Position = projectionMatrix * mv;",
    "}"
  ].join("\n");
  var lineFragment = [
    "uniform vec3 uBone;",
    "uniform vec3 uFlame;",
    "uniform float uWarm;",
    "varying float vH;",
    "varying float vDist;",
    "void main(){",
    "  float fade = 1.0 - smoothstep(10.0, 22.0, vDist);",
    "  float peak = smoothstep(0.7, 1.9, vH);",
    "  vec3 col = mix(uBone, uFlame, clamp(peak + uWarm * 0.55, 0.0, 1.0));",
    "  float a = fade * (0.28 + 0.72 * smoothstep(-0.05, 0.9, vH));",
    "  gl_FragColor = vec4(col, a);",
    "}"
  ].join("\n");
  var occluderFragment = [
    "uniform vec3 uBg;",
    "void main(){ gl_FragColor = vec4(uBg, 1.0); }"
  ].join("\n");

  function buildGeometries(isMobile){
    var COLS = isMobile ? 140 : 280;
    var ROWS = isMobile ? 40 : 64;
    var W = 26, Z_FAR = -15, Z_NEAR = 3;
    var count = COLS * ROWS;
    var pos = new Float32Array(count * 3);
    var k = 0;
    for (var j = 0; j < ROWS; j++) {
      for (var i = 0; i < COLS; i++) {
        pos[k++] = -W / 2 + (i / (COLS - 1)) * W;
        pos[k++] = 0;
        pos[k++] = Z_FAR + (j / (ROWS - 1)) * (Z_NEAR - Z_FAR);
      }
    }
    var meshGeo = new THREE.BufferGeometry();
    meshGeo.setAttribute("position", new THREE.BufferAttribute(pos.slice(), 3));
    var idx = [];
    for (var mj = 0; mj < ROWS - 1; mj++) {
      for (var mi = 0; mi < COLS - 1; mi++) {
        var a = mj * COLS + mi, b = a + 1, c = a + COLS, d = c + 1;
        idx.push(a, c, b, b, c, d);
      }
    }
    meshGeo.setIndex(idx);
    var lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(pos.slice(), 3));
    var lidx = [];
    for (var lj = 0; lj < ROWS; lj++) {
      for (var li = 0; li < COLS - 1; li++) {
        var s = lj * COLS + li;
        lidx.push(s, s + 1);
      }
    }
    lineGeo.setIndex(lidx);
    return { meshGeo: meshGeo, lineGeo: lineGeo };
  }

  var isMobile = window.innerWidth < 768;
  var geos = buildGeometries(isMobile);
  var occluderUniforms = {
    uTime: shared.uTime, uAmp: shared.uAmp, uFreq: shared.uFreq, uIntro: shared.uIntro,
    uMouse: shared.uMouse, uMouseAmp: shared.uMouseAmp, uClick: shared.uClick, uLift: { value: 0 }, uBg: shared.uBg
  };
  var lineUniforms = {
    uTime: shared.uTime, uAmp: shared.uAmp, uFreq: shared.uFreq, uIntro: shared.uIntro,
    uMouse: shared.uMouse, uMouseAmp: shared.uMouseAmp, uClick: shared.uClick, uLift: { value: 0.012 },
    uBone: shared.uBone, uFlame: shared.uFlame, uWarm: shared.uWarm
  };
  var occluderMat = new THREE.ShaderMaterial({
    uniforms: occluderUniforms, vertexShader: vertexShader, fragmentShader: occluderFragment,
    polygonOffset: true, polygonOffsetFactor: 1.5, polygonOffsetUnits: 1.5
  });
  var lineMat = new THREE.ShaderMaterial({
    uniforms: lineUniforms, vertexShader: vertexShader, fragmentShader: lineFragment,
    transparent: true, depthWrite: false
  });
  var occluder = new THREE.Mesh(geos.meshGeo, occluderMat);
  occluder.renderOrder = 0;
  occluder.frustumCulled = false;
  var lines = new THREE.LineSegments(geos.lineGeo, lineMat);
  lines.renderOrder = 1;
  lines.frustumCulled = false;
  scene.add(occluder);
  scene.add(lines);

  var clock = new THREE.Clock();
  var elapsed = 0;
  var parallax = { x: 0, y: 0 };
  var parallaxTarget = { x: 0, y: 0 };
  var rafId = 0;
  var disposed = false;

  /* Pointer → terrain, as in the original: raycast onto the y = 0 plane
     so the bump sits under the true world point of the cursor, and the
     mouse uniform rests at (99, 99) — far off-grid — when the pointer
     is out of the document. */
  var raycaster = new THREE.Raycaster();
  var groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  var ndc = new THREE.Vector2(0, 0);
  var hitPoint = new THREE.Vector3();
  var mouseTarget = new THREE.Vector2(99, 99);
  var pointerIn = false;
  var lastClientX = -999, lastClientY = -999;
  var terrainShift = 0, footerTop = window.innerHeight;
  function setNdc(cx, cy){
    var localY = cy - terrainShift;
    ndc.set((cx / window.innerWidth) * 2 - 1, -(localY / window.innerHeight) * 2 + 1);
  }
  function raycastGround(){
    raycaster.setFromCamera(ndc, camera);
    return raycaster.ray.intersectPlane(groundPlane, hitPoint) ? hitPoint : null;
  }
  window.addEventListener("pointermove", function(e){
    lastClientX = e.clientX; lastClientY = e.clientY;
    parallaxTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
    parallaxTarget.y = (e.clientY / window.innerHeight) * 2 - 1;
    pointerIn = true;
  }, { passive: true });
  window.addEventListener("pointerdown", function(e){
    lastClientX = e.clientX; lastClientY = e.clientY;
    if (lastClientY >= footerTop || sceneState.footerHover) return;
    setNdc(e.clientX, e.clientY);
    camera.updateMatrixWorld();
    var hit = raycastGround();
    if (hit) shared.uClick.value.set(hit.x, hit.z, elapsed);
  }, { passive: true });
  document.documentElement.addEventListener("pointerleave", function(){ pointerIn = false; });

  function onResize(){
    var w = window.innerWidth, h = Math.max(1, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(w, h);
    var a = w / h;
    camera.aspect = a;
    camera.fov = a < 0.8 ? 52 : 38;
    camera.updateProjectionMatrix();
    var nowMobile = w < 768;
    if (nowMobile !== isMobile) {
      isMobile = nowMobile;
      var old = geos;
      geos = buildGeometries(isMobile);
      occluder.geometry = geos.meshGeo;
      lines.geometry = geos.lineGeo;
      old.meshGeo.dispose(); old.lineGeo.dispose();
    }
    if (reduced) drawFrame(2.0);
  }
  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", function(){ setTimeout(onResize, 120); });

  /* Bind #terrainBg bottom to #footer (Back to top) top line so it scrolls up
     together with the Contact text and never interferes with #footGiant */
  var footerEl = document.getElementById("footer");
  var secTop = document.getElementById("top");
  var secTk = document.getElementById("toolkit");
  var secWork = document.getElementById("work");
  var secCred = document.getElementById("credentials");
  var secCt = document.getElementById("contact");
  function clamp01(v){ return v < 0 ? 0 : (v > 1 ? 1 : v); }
  function mix(a, b, t){ return a + (b - a) * t; }
  function getTargetMood(){
    var vh = Math.max(1, window.innerHeight);
    var m = { opacity: 1, pitch: 0, amp: 1, freq: 1, warm: 0 };
    if (secTop) {
      var t1 = clamp01(-secTop.getBoundingClientRect().top / (secTop.offsetHeight * 0.225 || vh));
      m.opacity = mix(1, 0.25, t1); m.pitch = mix(0, 0.72, t1); m.amp = mix(1, 1.55, t1); m.freq = mix(1, 1.4, t1); m.warm = 0;
    }
    if (secTk) {
      var t2 = clamp01((vh * 0.9 - secTk.getBoundingClientRect().top) / (vh * 0.65));
      if (t2 > 0) { m.opacity = mix(m.opacity, 0.32, t2); m.pitch = mix(m.pitch, 0.75, t2); m.amp = mix(m.amp, 1.5, t2); m.freq = mix(m.freq, 1.5, t2); }
    }
    if (secWork) {
      var t3 = clamp01((vh * 0.85 - secWork.getBoundingClientRect().top) / (vh * 0.6));
      if (t3 > 0) { m.opacity = mix(m.opacity, 0, t3); }
    }
    if (secCred) {
      var t4 = clamp01((vh * 0.95 - secCred.getBoundingClientRect().top) / (vh * 0.7));
      if (t4 > 0) { m.opacity = mix(m.opacity, 0.3, t4); m.pitch = mix(0.65, 0.5, t4); m.amp = mix(1.3, 1.1, t4); m.freq = mix(1.25, 1.15, t4); m.warm = mix(0, 0.35, t4); }
    }
    if (secCt) {
      var t5 = clamp01((vh * 0.98 - secCt.getBoundingClientRect().top) / (vh * 0.66));
      if (t5 > 0) { m.opacity = mix(m.opacity, 0.56, t5); m.pitch = mix(m.pitch, 0.06, t5); m.amp = mix(m.amp, 0.72, t5); m.freq = mix(m.freq, 0.82, t5); m.warm = mix(m.warm, 0.38, t5); }
    }
    return m;
  }
  function syncTerrainBound(){
    if (!footerEl) return;
    footerTop = footerEl.getBoundingClientRect().top;
    terrainShift = Math.min(0, footerTop - window.innerHeight);
    holder.style.transform = terrainShift < -0.5 ? "translate3d(0," + terrainShift.toFixed(1) + "px,0)" : "";
  }
  window.addEventListener("scroll", syncTerrainBound, { passive: true });
  window.addEventListener("resize", syncTerrainBound, { passive: true });
  syncTerrainBound();

  var pScale = 1.0;
  function drawFrame(time){
    syncTerrainBound();
    var target = getTargetMood();
    var k = reduced ? 1 : 0.14;
    sceneState.opacity += (target.opacity - sceneState.opacity) * k;
    sceneState.pitch   += (target.pitch   - sceneState.pitch)   * k;
    sceneState.amp     += (target.amp     - sceneState.amp)     * k;
    sceneState.freq    += (target.freq    - sceneState.freq)    * k;
    sceneState.warm    += (target.warm    - sceneState.warm)    * k;
    shared.uTime.value = time;
    shared.uAmp.value = sceneState.amp;
    shared.uFreq.value = sceneState.freq;
    shared.uIntro.value = sceneState.intro;
    shared.uWarm.value = sceneState.warm;
    var overFooter = pointerIn && lastClientY >= footerTop;
    var dampen = sceneState.footerHover || overFooter;
    var mAmpTarget = dampen ? 0.0 : 1.0;
    var pScaleTarget = dampen ? 0.12 : 1.0;
    shared.uMouseAmp.value += (mAmpTarget - shared.uMouseAmp.value) * (dampen ? 0.035 : 0.07);
    pScale += (pScaleTarget - pScale) * (dampen ? 0.035 : 0.06);
    holder.style.opacity = String(sceneState.opacity);
    if (sceneState.opacity < 0.01) return;
    parallax.x += (parallaxTarget.x * pScale - parallax.x) * 0.04;
    parallax.y += (parallaxTarget.y * pScale - parallax.y) * 0.04;
    var p = sceneState.pitch;
    camera.position.set(parallax.x * 0.7, 2.1 + p * 5.5 - parallax.y * 0.25, 8.2 - p * 2.5);
    camera.lookAt(parallax.x * 0.25, 0.1 - p * 0.4, -4.5);
    camera.updateMatrixWorld();
    if (pointerIn && !dampen) {
      setNdc(lastClientX, lastClientY);
      var hit = raycastGround();
      if (hit) mouseTarget.set(hit.x, hit.z);
      else mouseTarget.set(99, 99);
    } else if (!pointerIn) {
      mouseTarget.set(99, 99);
    }
    var mu = shared.uMouse.value;
    if (mu.x > 90 && mouseTarget.x < 90) mu.copy(mouseTarget);
    else mu.lerp(mouseTarget, 0.14);
    renderer.render(scene, camera);
  }
  function loop(){
    if (disposed) return;
    rafId = requestAnimationFrame(loop);
    if (document.hidden) return;
    /* accumulated delta time, as in the original: the wave clock only
       advances while the backdrop is actually on screen */
    var dt = Math.min(clock.getDelta(), 0.05);
    if (sceneState.opacity >= 0.01) elapsed += dt;
    drawFrame(elapsed);
  }
  terrainState = { state: sceneState };
  if (reduced) { sceneState.intro = 1; drawFrame(2.0); }
  else { loop(); }
  window.addEventListener("pagehide", function(){
    disposed = true;
    if (rafId) cancelAnimationFrame(rafId);
    geos.meshGeo.dispose(); geos.lineGeo.dispose();
    occluderMat.dispose(); lineMat.dispose();
    renderer.dispose();
    if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
  });
};

window.initFooterWave = function(sceneState, reduced){
  var wrap = document.getElementById("footGiant");
  var canvas = document.getElementById("footTopoCanvas");
  if (!wrap || !canvas || reduced) return;
  var gl = canvas.getContext("webgl2", { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: "high-performance" });
  var prog = null, vao = null, uRes = null, uProg = null;
  if (gl) {
    var vsSrc = "#version 300 es\nprecision highp float;void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.0-1.0,0.0,1.0);}";
    var fsSrc = [
      "#version 300 es",
      "precision highp float;",
      "out vec4 fragColor;",
      "uniform vec2 u_resolution;",
      "uniform float u_progress;",
      "const float TAU = 6.283185307179586;",
      "vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}",
      "float mod289(float x){return x-floor(x*(1.0/289.0))*289.0;}",
      "vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}",
      "float permute(float x){return mod289(((x*34.0)+1.0)*x);}",
      "vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}",
      "float taylorInvSqrt(float r){return 1.79284291400159-0.85373472095314*r;}",
      "vec4 grad4(float j,vec4 ip){const vec4 ones=vec4(1.0,1.0,1.0,-1.0);vec4 p,s;p.xyz=floor(fract(vec3(j)*ip.xyz)*7.0)*ip.z-1.0;p.w=1.5-dot(abs(p.xyz),ones.xyz);s=vec4(lessThan(p,vec4(0.0)));p.xyz=p.xyz+(s.xyz*2.0-1.0)*s.www;return p;}",
      "vec3 snoiseGradXY(vec4 v){const vec4 C=vec4(0.138196601125011,0.276393202250021,0.414589803375032,-0.447213595499958);const float F4=0.309016994374947451;vec4 i=floor(v+dot(v,vec4(F4)));vec4 x0=v-i+dot(i,C.xxxx);vec4 i0;vec3 isX=step(x0.yzw,x0.xxx);vec3 isYZ=step(x0.zww,x0.yyz);i0.x=isX.x+isX.y+isX.z;i0.yzw=1.0-isX;i0.y+=isYZ.x+isYZ.y;i0.zw+=1.0-isYZ.xy;i0.z+=isYZ.z;i0.w+=1.0-isYZ.z;vec4 i3=clamp(i0,0.0,1.0);vec4 i2=clamp(i0-1.0,0.0,1.0);vec4 i1=clamp(i0-2.0,0.0,1.0);vec4 x1=x0-i1+C.xxxx;vec4 x2=x0-i2+C.yyyy;vec4 x3=x0-i3+C.zzzz;vec4 x4=x0+C.wwww;i=mod289(i);float j0=permute(permute(permute(permute(i.w)+i.z)+i.y)+i.x);vec4 j1=permute(permute(permute(permute(i.w+vec4(i1.w,i2.w,i3.w,1.0))+i.z+vec4(i1.z,i2.z,i3.z,1.0))+i.y+vec4(i1.y,i2.y,i3.y,1.0))+i.x+vec4(i1.x,i2.x,i3.x,1.0));vec4 ip=vec4(1.0/294.0,1.0/49.0,1.0/7.0,0.0);vec4 p0=grad4(j0,ip);vec4 p1=grad4(j1.x,ip);vec4 p2=grad4(j1.y,ip);vec4 p3=grad4(j1.z,ip);vec4 p4=grad4(j1.w,ip);vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;p4*=taylorInvSqrt(dot(p4,p4));vec4 m0=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);float m1=max(0.6-dot(x4,x4),0.0);vec4 m0_2=m0*m0;vec4 m0_3=m0_2*m0;vec4 m0_4=m0_2*m0_2;float m1_2=m1*m1;float m1_3=m1_2*m1;float m1_4=m1_2*m1_2;vec4 px0=vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3));float px4=dot(p4,x4);float val=49.0*(dot(m0_4,px0)+m1_4*px4);vec4 t0=-8.0*m0_3*px0;float t4=-8.0*m1_3*px4;vec2 grad=t0.x*x0.xy+m0_4.x*p0.xy+t0.y*x1.xy+m0_4.y*p1.xy+t0.z*x2.xy+m0_4.z*p2.xy+t0.w*x3.xy+m0_4.w*p3.xy+t4*x4.xy+m1_4*p4.xy;return vec3(val,49.0*grad);}",
      "vec3 evalTerrain(vec2 p,float theta){float c1=cos(theta),s1=sin(theta),c2=cos(2.0*theta),s2=sin(2.0*theta);float r1=0.46;vec2 seed=vec2(1.42,-2.18);const float wf=0.62,wa=0.48;vec3 wx=snoiseGradXY(vec4(p*wf+seed,r1*c1,r1*s1));vec3 wy=snoiseGradXY(vec4(p*wf+seed+vec2(17.3,-11.9),r1*c1+5.7,r1*s1-4.3));vec2 dwx=wx.yz*wf,dwy=wy.yz*wf;vec2 pw=p+wa*vec2(wx.x,wy.x);vec3 o1=snoiseGradXY(vec4(pw*0.92+seed*0.6,r1*c1+1.3,r1*s1-2.1));vec3 o2=snoiseGradXY(vec4(pw*1.82+seed+vec2(23.7,-19.4),r1*1.25*c1+11.4,r1*1.25*s1+7.2));vec3 o3=snoiseGradXY(vec4(pw*3.25+seed*1.3+vec2(-14.8,29.1),r1*1.1*c2-8.6,r1*1.1*s2+13.5));float h=0.68*o1.x+0.26*o2.x+0.06*o3.x;vec2 gf=0.68*(o1.yz*0.92)+0.26*(o2.yz*1.82)+0.06*(o3.yz*3.25);vec2 gh=vec2(gf.x*(1.0+wa*dwx.x)+gf.y*(wa*dwy.x),gf.x*(wa*dwx.y)+gf.y*(1.0+wa*dwy.y));return vec3(h,gh);}",
      "void main(){float minDim=max(1.0,min(u_resolution.x,u_resolution.y));vec2 uv=(gl_FragCoord.xy-0.5*u_resolution)/minDim;float zoom=mix(0.72,1.15,smoothstep(110.0,340.0,minDim));float levels=mix(9.5,14.0,smoothstep(110.0,340.0,minDim));vec3 f=evalTerrain(uv*zoom,TAU*u_progress);float pxInP=zoom/minDim;float gLenPx=length(f.yz)*(levels*pxInP);float bandDist=abs(fract(f.x*levels+0.5)-0.5);float refScale=clamp(520.0/minDim,0.75,1.85);float distPx=bandDist/max(gLenPx,0.0022/refScale);float distRef=distPx*refScale;float steep=smoothstep(0.014,0.052,gLenPx*refScale);float halfW=max(0.95,1.35/refScale);float lineCore=1.0-smoothstep(max(0.0,halfW-0.85),halfW+0.9,distPx);float hot=1.0-smoothstep(0.0,halfW*0.65+0.6,distPx);float tightH=exp(-distRef/4.4);float midH=exp(-distRef/13.0);float ember=steep*exp(-distRef/26.0);const vec3 colBone=vec3(0.945,0.925,0.885);const vec3 colSand=vec3(0.855,0.825,0.765);const vec3 colFlame=vec3(0.980,0.310,0.135);const vec3 colEmber=vec3(0.520,0.145,0.045);vec3 col=vec3(0.0);col+=colEmber*(ember*0.44);col+=colFlame*(tightH*0.58+midH*0.24);vec3 coreCol=mix(colFlame,mix(colSand,colBone,hot),0.52+0.44*hot);col=mix(col,coreCol,lineCore);col*=1.04;float lum=dot(col,vec3(0.2126,0.7152,0.0722));col*=smoothstep(0.004,0.022,lum);fragColor=vec4(clamp(col,0.0,1.0),1.0);}"
    ].join("\n");
    function compile(t, s){var sh=gl.createShader(t);gl.shaderSource(sh,s);gl.compileShader(sh);return gl.getShaderParameter(sh,gl.COMPILE_STATUS)?sh:null;}
    var vs = compile(gl.VERTEX_SHADER, vsSrc), fs = compile(gl.FRAGMENT_SHADER, fsSrc);
    if (vs && fs) {
      prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
      if (gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        vao = gl.createVertexArray();
        uRes = gl.getUniformLocation(prog, "u_resolution");
        uProg = gl.getUniformLocation(prog, "u_progress");
      } else { prog = null; }
    }
  }
  function resizeCanvas(){
    if (!gl) return;
    var r = wrap.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var w = Math.max(120, Math.round(r.width * dpr)), h = Math.max(60, Math.round(r.height * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  var active = false, rCur = 0, rTar = 0, mx = 50, my = 50, tx = 50, ty = 50, raf = 0, loopP = 0, lastT = 0;
  function step(now){
    raf = 0;
    if (!lastT) lastT = now;
    var dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    loopP = (loopP + dt / 18.0) % 1.0;
    rCur += (rTar - rCur) * 0.14;
    mx += (tx - mx) * 0.18;
    my += (ty - my) * 0.18;
    wrap.style.setProperty("--mx", mx.toFixed(2) + "%");
    wrap.style.setProperty("--my", my.toFixed(2) + "%");
    wrap.style.setProperty("--mr", rCur.toFixed(1) + "px");
    if (gl && prog && (active || rCur > 0.6)) {
      resizeCanvas();
      gl.bindVertexArray(vao);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(prog);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uProg, loopP);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    if (active || rCur > 0.6) raf = requestAnimationFrame(step);
    else { wrap.style.setProperty("--mr", "0px"); lastT = 0; }
  }
  function kick(){ if (!raf) raf = requestAnimationFrame(step); }

  function updatePointer(e){
    var r = wrap.getBoundingClientRect();
    tx = Math.max(0, Math.min(100, ((e.clientX - r.left) / Math.max(1, r.width)) * 100));
    ty = Math.max(0, Math.min(100, ((e.clientY - r.top) / Math.max(1, r.height)) * 100));
    rTar = Math.max(68, Math.min(180, r.width * (window.innerWidth < 768 ? 0.25 : 0.12)));
    active = true;
    sceneState.footerHover = true;
    wrap.classList.add("is-hover");
    kick();
  }
  wrap.addEventListener("pointerenter", function(){ sceneState.footerHover = true; }, { passive: true });
  wrap.addEventListener("pointerdown", updatePointer, { passive: true });
  wrap.addEventListener("pointermove", updatePointer, { passive: true });
  wrap.addEventListener("pointerleave", function(){
    active = false;
    rTar = 0;
    sceneState.footerHover = false;
    wrap.classList.remove("is-hover");
    kick();
  });
};
})();
