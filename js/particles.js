/* ================= About Section WebGL2 Particle Morph Engine =================
   Isolated canvas controller — maps 1:1 to a future <AboutParticleStage /> React component. */
(function(){
"use strict";

window.initAboutParticles = function(wrap, sec, reduced){
  /* GPU WebGL2 3,200-Particle Aizawa Dynamical Signal Attractor -> World-Space Pose-Memory Morph Engine */
  var stage = document.getElementById("abParticleStage");
  var canvas = document.getElementById("abParticleCanvas");
  if (stage && canvas) {
    var gl = canvas.getContext("webgl2", { alpha: true, antialias: false, depth: false, stencil: false, powerPreference: "high-performance" });
    if (gl) {
      var isSm = window.innerWidth < 640;
      var BASE_N = isSm ? 1800 : 3200;
      var N = isSm ? 19700 : 27700;
      var vsSrc = [
        "#version 300 es",
        "precision highp float;",
        "layout(location=0) in vec4 aStart;",
        "layout(location=1) in vec4 aTarget;",
        "layout(location=2) in vec3 aSeed;",
        "uniform float uTime;",
        "uniform float uMorph;",
        "uniform vec2 uTargetRot;",
        "uniform vec2 uTilt;",
        "uniform float uAspect;",
        "uniform float uDpr;",
        "uniform float uDefault;",
        "uniform vec2 uLensIdx;",
        "uniform float uFlagWave;",
        "uniform float uCodeLive;",
        "uniform float uStatusLive;",
        "uniform float uSwLive;",
        "uniform float uWebLive;",
        "uniform float uAiLive;",
        "uniform float uAutoLive;",
        "uniform float uFocusAge;",
        "uniform float uEduLive;",
        "uniform float uLangLive;",
        "uniform float uLangAlpha;",
        "uniform float uStageScale;",
        "out float vFlame;",
        "out float vAlpha;",
        "float easeOutFast(float t){ return 1.0 - pow(1.0 - t, 3.6); }",
        "vec3 rotYX(vec3 v, vec2 r){",
        "  float cy = cos(r.x), sy = sin(r.x);",
        "  float cx = cos(r.y), sx = sin(r.y);",
        "  vec3 r1 = vec3(v.x * cy - v.z * sy, v.y, v.x * sy + v.z * cy);",
        "  return vec3(r1.x, r1.y * cx - r1.z * sx, r1.y * sx + r1.z * cx);",
        "}",
        "void main(){",
        "  float rawT = clamp((uMorph - aSeed.x) / 0.91, 0.0, 1.0);",
        "  float u = easeOutFast(rawT);",
        "  /* Target rotates in model-space; Start is already snapshotted in world-space (zero angle snap!) */",
        "  vec3 tLocal = aTarget.xyz;",
        "  float extraFl = 0.0;",
        "  float extraAlpha = 1.0;",
        "  float flagSlope = 0.0;",
        "  /* Live 3D wavy cloth physics anchored at the rigid left flagpole (x < -0.765) with visible S-curve billow & fly-edge ripple */",
        "  if (uFlagWave > 0.001) {",
        "    float isCloth = step(-0.765, tLocal.x);",
        "    float fx = (tLocal.x / 0.76) * 1.5;",
        "    float fy = (tLocal.y / 0.51) * 1.0;",
        "    float hoist = clamp((fx + 1.5) / 3.0, 0.0, 1.0) * isCloth;",
        "    float hoistEase = pow(hoist, 0.85);",
        "    float fAmp = 0.24;",
        "    float ph = 2.35 * fx - uTime * 2.15;",
        "    float ph2 = 4.5 * fx + 1.35 * fy - uTime * 3.05;",
        "    float fz = fAmp * hoistEase * sin(ph) + fAmp * 0.36 * hoistEase * sin(ph2);",
        "    float dy = 0.22 * hoistEase * sin(ph - 0.55) + 0.070 * hoistEase * sin(ph2 - 0.6) - 0.050 * hoist * hoist;",
        "    float dx = -0.075 * hoist * hoist * (0.5 + 0.5 * cos(ph)) + 0.045 * hoistEase * fy * sin(ph - 0.3);",
        "    tLocal.x += dx * (0.76 / 1.5) * uFlagWave;",
        "    tLocal.y += dy * (0.51 / 1.0) * uFlagWave;",
        "    tLocal.z += fz * (0.76 / 1.5) * uFlagWave;",
        "    flagSlope = cos(ph) * fAmp * hoistEase * 2.35;",
        "    /* 3D spherical lighting on the filled flagpole finial ball (top-left key light + specular + subtle rim, tuned for additive blending) */",
        "    if (isCloth < 0.5 && tLocal.y > 0.542) {",
        "      vec3 bN = normalize(tLocal - vec3(-0.811, 0.578, 0.0) + vec3(0.0, 0.0, 0.0001));",
        "      vec3 bL = normalize(vec3(-0.52, 0.68, 0.52));",
        "      float bDiff = max(0.0, dot(bN, bL));",
        "      vec3 bH = normalize(bL + vec3(0.0, 0.0, 1.0));",
        "      float bSpec = pow(max(0.0, dot(bN, bH)), 18.0);",
        "      float bRim = pow(1.0 - max(0.0, bN.z), 2.8) * 0.14;",
        "      float bLit = 0.07 + 0.36 * pow(bDiff, 1.15) + 0.62 * bSpec + bRim;",
        "      extraAlpha *= mix(1.0, clamp(bLit, 0.06, 1.05), uFlagWave);",
        "    }",
        "  }",
        "  /* Apple-style luminous typography: Flame-Orange top -> Pearl-White bottom vertical gradient + liquid-glass light sheen */",
        "  if (uLangLive > 0.001) {",
        "    float sweep = sin(uTime * 1.1) * 1.15;",
        "    float diag = tLocal.x * 0.88 + tLocal.y * 0.45;",
        "    float sheen = exp(-pow((diag - sweep) * 2.4, 2.0));",
        "    extraFl -= sheen * 0.24 * uLangLive;",
        "    tLocal.z += sheen * 0.042 * uLangLive;",
        "  }",
        "  /* Focus 01 · Software: rotating 8-tooth engineering gear around crisp Flame </> code core */",
        "  if (uSwLive > 0.001) {",
        "    if (aTarget.z > 0.015) {",
        "      float ga = -uTime * 0.65 * uSwLive;",
        "      float cg = cos(ga), sg = sin(ga);",
        "      tLocal.xy = vec2(tLocal.x * cg - tLocal.y * sg, tLocal.x * sg + tLocal.y * cg);",
        "    } else {",
        "      float pulseSw = 0.5 + 0.5 * sin(uTime * 3.4);",
        "      tLocal.z += pulseSw * 0.045 * uSwLive;",
        "      extraAlpha *= mix(1.0, 0.78 + 0.22 * pulseSw, uSwLive);",
        "    }",
        "  }",
        "  /* Focus 03 · AI: 3 sequentially twinkling Flame sparkles */",
        "  if (uAiLive > 0.001 && aTarget.z > 0.020) {",
        "    float spIdx = clamp(floor((aTarget.z - 0.020) / 0.020), 0.0, 2.0);",
        "    float tw = 0.5 + 0.5 * sin(uTime * 4.2 - spIdx * 1.4);",
        "    float pop = pow(tw, 2.0);",
        "    tLocal.z += pop * 0.065 * uAiLive;",
        "    extraAlpha *= mix(1.0, 0.26 + 0.74 * pop, uAiLive);",
        "  }",
        "  /* Focus unified deterministic orange light glaze: sweeps left-to-right exactly once per Focus item */",
        "  float focusGlazeOn = clamp(max(max(uSwLive, uWebLive), max(uAiLive, uAutoLive)), 0.0, 1.0);",
        "  if (focusGlazeOn > 0.001) {",
        "    float glazeU = clamp((uFocusAge - 0.25) / 1.85, 0.0, 1.0);",
        "    float glazeEnv = smoothstep(0.0, 0.08, glazeU) * (1.0 - smoothstep(0.92, 1.0, glazeU));",
        "    float glazeX = mix(-1.05, 1.05, glazeU);",
        "    float glazeHit = exp(-pow((tLocal.x - glazeX) / 0.20, 2.0)) * glazeEnv * focusGlazeOn;",
        "    extraFl += glazeHit * 0.90;",
        "    tLocal.z += glazeHit * 0.055;",
        "  }",
        "  /* Live Status: Architectural Open-to-Work Briefcase + Pulsing Flame Checkmark Badge & Expanding Availability Ripple */",
        "  if (uStatusLive > 0.001) {",
        "    vec2 bCtr = vec2(0.473, -0.4085);",
        "    float bob = sin(uTime * 2.0) * 0.024 * uStatusLive;",
        "    if (aTarget.z > 0.015 && aTarget.z < 0.042) {",
        "      float sc = 1.0 + 0.10 * sin(uTime * 3.0);",
        "      tLocal.xy = bCtr + (tLocal.xy - bCtr) * mix(1.0, sc, uStatusLive);",
        "      tLocal.y += bob;",
        "      tLocal.z += 0.038 * uStatusLive;",
        "      extraAlpha *= mix(1.0, 0.90 + 0.14 * sin(uTime * 3.0), uStatusLive);",
        "    } else if (aTarget.z > 0.045) {",
        "      float cyc = fract(uTime * 0.52);",
        "      float rsc = 1.0 + cyc * 0.72;",
        "      tLocal.xy = bCtr + (tLocal.xy - bCtr) * mix(1.0, rsc, uStatusLive);",
        "      tLocal.y += bob;",
        "      extraAlpha *= mix(1.0, (1.0 - cyc) * 0.92, uStatusLive);",
        "    } else {",
        "      tLocal.y += bob;",
        "      float swp = -0.95 + fract(uTime * 0.36) * 1.9;",
        "      float sh = exp(-pow((tLocal.x - swp) / 0.22, 2.0));",
        "      extraFl += sh * 0.42 * uStatusLive;",
        "    }",
        "  }",
        "  /* Interactive Graduation Cap: joyful toss float + swinging Flame tassel pendulum */",
        "  if (uEduLive > 0.001) {",
        "    float toss = sin(uTime * 2.8) * 0.065;",
        "    tLocal.y += toss * uEduLive;",
        "    if (tLocal.x > 0.56 && tLocal.y < 0.08) {",
        "      float drop = clamp((0.06 - tLocal.y) / 0.54, 0.0, 1.0);",
        "      tLocal.x += sin(uTime * 5.2) * 0.13 * drop * uEduLive;",
        "      tLocal.z += cos(uTime * 5.2) * 0.06 * drop * uEduLive;",
        "    }",
        "  }",
        "  /* Smoothly fade parked spare particles (z < -5.0) both entering & leaving terminal/flag so they never stack or flash */",
        "  vec3 sPos = aStart.xyz;",
        "  bool sParked = sPos.z < -5.0;",
        "  bool tParked = tLocal.z < -5.0;",
        "  if (sParked) sPos.z = 0.0;",
        "  if (tParked) tLocal.z = 0.0;",
        "  float parkMask = (sParked && tParked) ? 0.0 : (tParked ? smoothstep(0.55, 0.0, u) : (sParked ? smoothstep(0.45, 0.95, u) : 1.0));",
        "  /* Singularity 3D Black Hole Dynamics: slow, weighty spherical photon-shell streaming + gentle Keplerian shear */",
        "  float vid = float(gl_VertexID);",
        "  float isLens = step(uLensIdx.x, vid) * step(vid, uLensIdx.y - 0.5);",
        "  if (isLens > 0.5) {",
        "    float lAng = atan(tLocal.y, tLocal.x);",
        "    float lRawR = length(tLocal.xy);",
        "    float lOrigSpread = mix(0.11, 0.17, smoothstep(-0.2, 0.2, sin(lAng)));",
        "    float lFrac = clamp((lRawR - 0.308) / max(0.05, lOrigSpread), 0.0, 1.0);",
        "    float lOrb = uTime * mix(0.42, 0.16, lFrac) * uDefault;",
        "    float lAng2 = lAng - lOrb;",
        "    float lNewSpread = mix(0.11, 0.17, smoothstep(-0.35, 0.35, sin(lAng2)));",
        "    float lTurb = sin(lAng2 * 3.0 - uTime * 0.72 + lFrac * 4.2) * 0.012 * uDefault;",
        "    float lR2 = 0.308 + lFrac * lNewSpread + lTurb;",
        "    tLocal.x = cos(lAng2) * lR2;",
        "    tLocal.y = sin(lAng2) * lR2;",
        "    /* Wrap lensed light around a 3D spherical event-horizon shell so tilt & orbit read as a true 3D ball */",
        "    float lSphZ = -0.16 * abs(sin(lAng2)) + 0.14 * cos(lAng2) * (1.0 - lFrac * 0.55) + sin(lAng2 * 2.0 - uTime * 0.85) * 0.032;",
        "    tLocal.z = mix(tLocal.z, lSphZ + aTarget.z * 0.35, uDefault);",
        "    float flow1 = 0.5 + 0.5 * sin(lAng2 * 2.0 - uTargetRot.x * 1.4 + lFrac * 2.8);",
        "    float flow2 = 0.5 + 0.5 * sin(lAng2 * 4.0 + uTargetRot.x * 1.9 - uTime * 0.45);",
        "    float dopplerSide = 0.5 + 0.5 * cos(lAng2 - 2.65);",
        "    float arcShift = (flow1 * 0.55 + flow2 * 0.45 - 0.5) * 0.72 + (0.5 - dopplerSide) * 0.42;",
        "    extraFl += arcShift * uDefault;",
        "    extraAlpha *= mix(1.0, 0.64 + 0.48 * (0.45 * flow1 + 0.55 * dopplerSide), uDefault);",
        "  } else if (uDefault > 0.001) {",
        "    float diskR = length(tLocal.xz);",
        "    float kep = uTime * (0.16 / pow(max(0.30, diskR), 1.25)) * uDefault;",
        "    float ck = cos(kep), sk = sin(kep);",
        "    tLocal.xz = vec2(tLocal.x * ck - tLocal.z * sk, tLocal.x * sk + tLocal.z * ck);",
        "    float diskAng = atan(tLocal.z, tLocal.x);",
        "    tLocal.y += sin(diskAng * 3.0 - uTime * 1.05 + diskR * 6.0) * 0.011 * diskR * uDefault;",
        "  }",
        "  float pulse = pow(max(0.0, sin(aSeed.z * 25.1327 - uTime * 1.15)), 5.0) * uDefault;",
        "  tLocal += normalize(tLocal + vec3(0.0001)) * (pulse * 0.024);",
        "  vec3 pTarget = rotYX(tLocal, mix(uTargetRot, vec2(0.0), isLens));",
        "  vec3 p = mix(sPos, pTarget, u);",
        "  float fl = clamp(mix(aStart.w, aTarget.w, u) + (pulse * 0.55 + extraFl) * u, 0.0, 1.0);",
        "  /* Crisp, snappy 3D curl arc during item-to-item morph (zero sluggishness) */",
        "  float arc = sin(u * 3.14159265) * 0.14;",
        "  float ang = aSeed.z * 6.283185 + u * 2.1;",
        "  p += vec3(cos(ang), sin(ang), cos(ang * 1.3)) * arc * (0.35 + 0.65 * aSeed.y);",
        "  /* Subtle interactive pointer tilt */",
        "  vec3 r2 = rotYX(p, uTilt);",
        "  float persp = 2.65 / (2.65 - r2.z);",
        "  vec2 clip = vec2((r2.x * persp) / max(0.85, uAspect * 0.92), r2.y * persp) * 0.88;",
        "  gl_Position = vec4(clip, 0.0, 1.0);",
        "  float depth = clamp((r2.z + 1.05) * 0.56, 0.16, 1.0);",
        "  float flagBoost = uFlagWave * u;",
        "  float langBoost = uLangLive * u;",
        "  float codeBoost = uCodeLive * u;",
        "  float focusBoost = max(max(uSwLive, uWebLive), max(max(uAiLive, uAutoLive), uStatusLive)) * u;",
        "  float normalSz = 1.55 + aSeed.y * 1.25 + fl * 0.75 + langBoost * 0.42 + focusBoost * 0.24 + codeBoost * 0.12;",
        "  float flagDotSz = mix(1.62, 1.82, fl) * (0.90 + 0.20 * aSeed.y);",
        "  float mobSzScale = mix(0.76, 1.0, sqrt(uStageScale));",
        "  gl_PointSize = clamp(mix(normalSz, flagDotSz, flagBoost) * mobSzScale * persp * uDpr, 1.0, 7.6);",
        "  vFlame = fl;",
        "  float baseAlpha = depth * (0.30 + 0.58 * depth) * (1.0 - 0.26 * sin(u * 3.14159265));",
        "  float sCloth = flagSlope / (1.0 + abs(flagSlope));",
        "  float flagWShade = 0.96 - sCloth * 0.14;",
        "  float flagRShade = 0.84 - sCloth * 0.24;",
        "  float flagShade = clamp(mix(flagWShade * 0.84, flagRShade * 0.66, fl) * (0.88 + 0.24 * aSeed.y), 0.34, 0.94);",

        "  baseAlpha = mix(baseAlpha, flagShade, flagBoost);",
        "  baseAlpha = mix(baseAlpha, uLangAlpha, langBoost);",
        "  baseAlpha = mix(baseAlpha, mix(0.54, 0.66, uSwLive), focusBoost);",
        "  baseAlpha = mix(baseAlpha, 0.46, codeBoost);",
        "  float mobAlphaScale = mix(mix(0.46, 0.32, flagBoost), 1.0, uStageScale);",
        "  vAlpha = baseAlpha * parkMask * extraAlpha * mobAlphaScale;",
        "}"
      ].join("\n");
      var fsSrc = [
        "#version 300 es",
        "precision highp float;",
        "in float vFlame;",
        "in float vAlpha;",
        "out vec4 fragColor;",
        "void main(){",
        "  vec2 uv = gl_PointCoord - 0.5;",
        "  float d = length(uv);",
        "  if (d > 0.5) discard;",
        "  float core = smoothstep(0.5, 0.10, d);",
        "  float hot = exp(-d * 6.8);",
        "  vec3 bone = vec3(0.914, 0.898, 0.859);",
        "  vec3 flame = vec3(0.949, 0.275, 0.122);",
        "  vec3 col = mix(bone, flame, vFlame);",
        "  col = mix(col, vec3(1.0, 0.96, 0.90), hot * (0.18 + 0.20 * vFlame));",
        "  fragColor = vec4(col, core * vAlpha);",
        "}"
      ].join("\n");
      function compile(type, src){
        var sh = gl.createShader(type); gl.shaderSource(sh, src); gl.compileShader(sh);
        return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null;
      }
      var vs = compile(gl.VERTEX_SHADER, vsSrc), fs = compile(gl.FRAGMENT_SHADER, fsSrc);
      var prog = (vs && fs) ? gl.createProgram() : null;
      if (prog) {
        gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) prog = null;
      }
      if (prog) {
        /* Clean shape generators returning Float32Array(N * 4) = [x, y, z, flame] */
        function parkRest(out, fromIdx){
          for (var p = fromIdx; p < N; p++) { out[p*4] = 0; out[p*4 + 1] = 0; out[p*4 + 2] = -10.0; out[p*4 + 3] = 0; }
          return out;
        }
        function samplePaths(segs, count, spread, zThick){
          var isFull = count === N;
          var active = isFull ? BASE_N : count;
          var out = new Float32Array((isFull ? N : count) * 4), lens = [], total = 0;
          for (var i = 0; i < segs.length; i++) {
            var s = segs[i], l = Math.hypot(s[2] - s[0], s[3] - s[1]);
            lens.push(l); total += l;
          }
          for (var k = 0; k < active; k++) {
            var d = (k / active) * total, acc = 0, idx = 0;
            for (var j = 0; j < lens.length; j++) { if (acc + lens[j] >= d || j === lens.length - 1) { idx = j; break; } acc += lens[j]; }
            var seg = segs[idx], t = lens[idx] > 0 ? Math.min(1, (d - acc) / lens[idx]) : 0;
            var h1 = Math.sin(k * 12.9898) * 43758.5453; h1 -= Math.floor(h1);
            var h2 = Math.sin(k * 78.233) * 43758.5453; h2 -= Math.floor(h2);
            var h3 = Math.sin(k * 37.719) * 43758.5453; h3 -= Math.floor(h3);
            var sp = spread || 0.022;
            out[k*4]     = seg[0] + (seg[2] - seg[0]) * t + (h1 - 0.5) * sp;
            out[k*4 + 1] = -(seg[1] + (seg[3] - seg[1]) * t + (h2 - 0.5) * sp);
            out[k*4 + 2] = (h3 - 0.5) * (zThick || 0.14);
            out[k*4 + 3] = seg[4] || 0;
          }
          return isFull ? parkRest(out, active) : out;
        }

        var SHAPES = {};
        /* 0. Default: 3D Gargantua Black Hole Singularity (Hollow Event Horizon + Blazing Photon Ring + Einstein Lensing Halo + Multi-Arm Accretion Disk) */
        var SCULP_RING_END = Math.floor(BASE_N * 0.18);
        var SCULP_LENS_END = Math.floor(BASE_N * 0.38);
        SHAPES.sculpture = (function(){
          var out = new Float32Array(N * 4);
          var ringEnd = SCULP_RING_END;
          var lensEnd = SCULP_LENS_END;
          /* 1) Blazing Photon Sphere Ring tightly hugging the pitch-black Event Horizon void (r = 0.30) */
          for (var i = 0; i < ringEnd; i++) {
            var t = (i / ringEnd) * 6.283185;
            var h1 = Math.sin(i * 12.9898) * 43758.5453; h1 -= Math.floor(h1);
            var h2 = Math.sin(i * 78.233) * 43758.5453; h2 -= Math.floor(h2);
            var r = 0.30 + Math.pow(h1, 1.8) * 0.032;
            out[i*4]     = Math.cos(t) * r;
            out[i*4 + 1] = (h2 - 0.5) * 0.018;
            out[i*4 + 2] = Math.sin(t) * r;
            out[i*4 + 3] = 1.0;
          }
          /* 2) Relativistic Einstein Lensing Arch (light from behind the disk bent sharply over & under the black shadow) */
          for (var j = ringEnd; j < lensEnd; j++) {
            var u = (j - ringEnd) / Math.max(1, lensEnd - ringEnd);
            var ang = u * 6.283185;
            var h3 = Math.sin(j * 45.164) * 43758.5453; h3 -= Math.floor(h3);
            var h4 = Math.sin(j * 93.719) * 43758.5453; h4 -= Math.floor(h4);
            var upper = Math.sin(ang) >= 0;
            var spread = upper ? 0.17 : 0.11;
            var rad = 0.308 + Math.pow(h3, 2.1) * spread;
            var lx = Math.cos(ang) * rad;
            var ly = Math.sin(ang) * rad;
            var lz = (h4 - 0.5) * 0.045 - Math.abs(Math.sin(ang)) * 0.07;
            out[j*4]     = lx;
            out[j*4 + 1] = ly;
            out[j*4 + 2] = lz;
            out[j*4 + 3] = Math.max(0.18, 1.0 - (rad - 0.308) / Math.max(0.05, spread));
          }
          /* 3) Swirling Relativistic Accretion Disk (4 logarithmic plasma lanes, hot inner Flame -> Bone outer dust rim) */
          for (var k = lensEnd; k < BASE_N; k++) {
            var p = (k - lensEnd) / Math.max(1, BASE_N - lensEnd);
            var h5 = Math.sin(k * 19.19) * 43758.5453; h5 -= Math.floor(h5);
            var h6 = Math.sin(k * 73.73) * 43758.5453; h6 -= Math.floor(h6);
            var rFrac = Math.pow(h5, 1.55);
            var rad2 = 0.32 + rFrac * 0.63;
            var arm = (k % 4) * 1.570796;
            var swirl = arm + rad2 * 6.4 + (h6 - 0.5) * (0.48 + rFrac * 0.92) + p * 0.3;
            var thick = (0.012 + rFrac * 0.030) * Math.sin(k * 31.7);
            var doppler = 0.5 + 0.5 * Math.cos(swirl - 0.6);
            out[k*4]     = Math.cos(swirl) * rad2;
            out[k*4 + 1] = thick;
            out[k*4 + 2] = Math.sin(swirl) * rad2;
            out[k*4 + 3] = Math.max(0.0, Math.min(1.0, (1.0 - rFrac * 1.38) * (0.78 + 0.28 * doppler)));
          }
          return parkRest(out, BASE_N);
        })();

        /* 1. Get in touch -> Sleek Minimalist Paper Plane / Send Arrow */
        SHAPES.mail = samplePaths([
          [-0.76,0.06, 0.80,-0.56, 0], [0.80,-0.56, 0.32,0.68, 0], [0.32,0.68, -0.08,0.24, 0], [-0.08,0.24, -0.76,0.06, 0],
          [0.80,-0.56, -0.08,0.24, 1], [-0.08,0.24, -0.10,0.62, 1], [-0.10,0.62, 0.10,0.40, 1]
        ], N, 0.028, 0.14);

        /* 2. Résumé PDF -> Architectural Document Sheet */
        SHAPES.doc = samplePaths([
          [-0.50,-0.72, 0.18,-0.72, 0], [0.18,-0.72, 0.50,-0.40, 1], [0.50,-0.40, 0.50,0.72, 0], [0.50,0.72, -0.50,0.72, 0], [-0.50,0.72, -0.50,-0.72, 0],
          [0.18,-0.72, 0.18,-0.40, 1], [0.18,-0.40, 0.50,-0.40, 1],
          [-0.28,-0.12, 0.28,-0.12, 1], [-0.28,0.14, 0.28,0.14, 0], [-0.28,0.40, 0.12,0.40, 0]
        ], N, 0.024, 0.12);

        /* 3. Location (Hong Kong) -> Unified Single-Canvas 3:2 Particle Wave HKSAR Flag (Website Flame × Bone palette + exact Bauhinia artwork details + uniform particle pole) */
        SHAPES.pin = new Float32Array(N * 4);
        (function(){
          var x0 = -0.76, x1 = 0.76, y0 = -0.51, y1 = 0.51;
          function buildUnifiedHKFlag(img){
            var W = img.naturalWidth, H = img.naturalHeight;
            var oc = document.createElement("canvas"); oc.width = W; oc.height = H;
            var cx = oc.getContext("2d", { willReadFrequently: true });
            cx.drawImage(img, 0, 0);
            var data = cx.getImageData(0, 0, W, H).data;
            var CCX = W / 2, CCY = H / 2;
            var RCEN = W * 0.05, RCEN2 = RCEN * RCEN;
            var COREPX = 0.013 * (W / 3), CORE2 = COREPX * COREPX;
            (function(){
              var PXU = W / 3, R1 = 0.13, TW = 0.50, Rp = Math.ceil(R1 * PXU) + 2;
              var src = new Uint8ClampedArray(data);
              var xLo = Math.max(0, Math.floor(CCX - Rp)), xHi = Math.min(W - 1, Math.ceil(CCX + Rp));
              var yLo = Math.max(0, Math.floor(CCY - Rp)), yHi = Math.min(H - 1, Math.ceil(CCY + Rp));
              for (var wy = yLo; wy <= yHi; wy++){
                for (var wx = xLo; wx <= xHi; wx++){
                  var dx = wx - CCX, dy = wy - CCY, rr = Math.sqrt(dx * dx + dy * dy) / PXU;
                  if (rr >= R1 || rr === 0) continue;
                  var D = TW * (1 - rr / R1) * (1 - rr / R1), cd = Math.cos(D), sd = Math.sin(D);
                  var sx = CCX + dx * cd - dy * sd, sy = CCY + dx * sd + dy * cd;
                  var bx = Math.floor(sx), by = Math.floor(sy);
                  if (bx < 0 || by < 0 || bx >= W - 1 || by >= H - 1) continue;
                  var fx = sx - bx, fy = sy - by, o00 = (by * W + bx) * 4, o = (wy * W + wx) * 4;
                  for (var chn = 0; chn < 3; chn++){
                    var top = src[o00 + chn] * (1 - fx) + src[o00 + 4 + chn] * fx;
                    var bot = src[o00 + W * 4 + chn] * (1 - fx) + src[o00 + W * 4 + 4 + chn] * fx;
                    data[o + chn] = top * (1 - fy) + bot * fy;
                  }
                }
              }
            })();
            /* 1) Thicker Solid Cylindrical Flagpole (4-column shaft + fuller collar + multi-ring finial sphere + double hoist ties) */
            var polePts = [];
            var shaftSteps = isSm ? 64 : 80;
            var poleCols = [-0.823, -0.815, -0.807, -0.799];
            for (var si = 0; si < shaftSteps; si++) {
              var py = -0.59 + (si / (shaftSteps - 1)) * 1.13;
              for (var pci = 0; pci < poleCols.length; pci++) {
                var pz = (pci === 1 || pci === 2) ? 0.008 : -0.004;
                polePts.push([poleCols[pci], py, pz, 0.0]);
              }
            }
            /* Filled 3D Fibonacci-lattice finial sphere (front-facing hemisphere so additive blending preserves a real 3D lit-to-shadow gradient) */
            var ballN = 115, ballR = 0.035, ballCx = -0.811, ballCy = 0.578;
            for (var bi = 0; bi < ballN; bi++) {
              var nz = 0.04 + 0.955 * ((bi + 0.5) / ballN);
              var rrB = Math.sqrt(Math.max(0, 1 - nz * nz));
              var thB = bi * 2.39996323;
              polePts.push([ballCx + rrB * Math.cos(thB) * ballR, ballCy + rrB * Math.sin(thB) * ballR, nz * ballR, 0.0]);
            }
            [-0.829, -0.820, -0.811, -0.802, -0.793].forEach(function(cxp){
              polePts.push([cxp, 0.541, 0.004, 0.0], [cxp, 0.533, 0.004, 0.0]);
            });
            [0.46, -0.46].forEach(function(ty){
              [-0.794, -0.785, -0.776, -0.768].forEach(function(txp){
                polePts.push([txp, ty + 0.006, 0.0, 0.0], [txp, ty - 0.006, 0.0, 0.0]);
              });
            });
            /* 2) Direct port of Hong Kong Flag — Particle Wave sampler (200x133 desktop / 168x112 mobile) mapped to Website Flame × Bone palette */
            var FC = isSm ? 168 : 200, FR = isSm ? 112 : 133;
            var gridN = FC * FR;
            var cw = W / FC, ch = H / FR;
            var white = new Uint8Array(gridN);
            var fpxArr = new Float32Array(gridN), fpyArr = new Float32Array(gridN);
            for (var r = 0; r < FR; r++) {
              for (var c = 0; c < FC; c++) {
                var gi = r * FC + c;
                var px0 = Math.floor(c * cw), px1 = Math.min(W - 1, Math.ceil((c + 1) * cw) - 1);
                var py0 = Math.floor(r * ch), py1 = Math.min(H - 1, Math.ceil((r + 1) * ch) - 1);
                var sumL = 0, cnt = 0, redCnt = 0;
                for (var y = py0; y <= py1; y++) {
                  var rowOff = y * W;
                  for (var x = px0; x <= px1; x++) {
                    var o = (rowOff + x) * 4, pr = data[o], pg = data[o+1], pb = data[o+2];
                    sumL += (pr + pg + pb) / 3; cnt++;
                    if (pr > 140 && pr - Math.max(pg, pb) > 70) redCnt++;
                  }
                }
                var isW = (redCnt < 2) && ((sumL / Math.max(1, cnt)) > 165);
                var pcx = (c + 0.5) * cw - CCX, pcy = (r + 0.5) * ch - CCY;
                if (pcx * pcx + pcy * pcy < RCEN2) {
                  var wN = 0, rN = 0;
                  for (var sy = 0; sy < 5; sy++) for (var sx = 0; sx < 5; sx++) {
                    var qx = Math.min(W - 1, Math.floor(px0 + (sx + 0.5) * cw / 5));
                    var qy = Math.min(H - 1, Math.floor(py0 + (sy + 0.5) * ch / 5));
                    var qo = (qy * W + qx) * 4, qr = data[qo], qg = data[qo+1], qb = data[qo+2];
                    if (qr > 140 && qr - Math.max(qg, qb) > 70) rN++;
                    else if ((qr + qg + qb) / 3 > 165) wN++;
                  }
                  if (wN >= 13 && rN < 4) isW = true;
                  else if (rN >= 13 && wN < 8) isW = false;
                  else if (wN >= 8 && rN >= 13) isW = true;
                  else if (rN >= 4 && wN >= 13) isW = false;
                  if (pcx * pcx + pcy * pcy < CORE2) isW = false;
                }
                if (isW) {
                  var rfx = pcx / (W / 3), rfy = pcy / (H / 2);
                  if (rfx * rfx + rfy * rfy < 0.018 * 0.018) isW = false;
                }
                var jx = (Math.random() - 0.5) * 0.12 * (3 / FC);
                var jy = (Math.random() - 0.5) * 0.12 * (2 / FR);
                white[gi] = isW ? 1 : 0;
                fpxArr[gi] = -1.5 + (c + 0.5) * (3 / FC) + jx;
                fpyArr[gi] =  1.0 - (r + 0.5) * (2 / FR) + jy;
              }
            }
            /* 3) Tip-extension corridors preserving all curling petal tips (including bottom & bottom-left petals) swirling into the centre */
            var PATHS = [
              [[0.075,147.0],[0.060,149.0],[0.050,151.0],[0.040,153.0],[0.030,155.0],[0.0245,157.0]],
              [[0.078,218.0],[0.064,220.2],[0.052,222.5],[0.040,225.0],[0.030,227.5],[0.0245,230.0]],
              [[0.082,289.5],[0.066,292.2],[0.052,295.2],[0.040,298.5],[0.030,301.8],[0.0245,305.0]],
              [[0.075,74.5],[0.060,77.0],[0.050,79.5],[0.040,82.0],[0.030,85.0],[0.0245,88.0]]
            ];
            var fCell = 3 / FC;
            var tipPaths = PATHS.map(function(ptsP){
              var samples = [], SEG = 40;
              for (var s = 0; s < ptsP.length - 1; s++) {
                for (var ks = 0; ks < SEG; ks++) {
                  var f = ks / SEG;
                  var rr = ptsP[s][0] + (ptsP[s+1][0] - ptsP[s][0]) * f;
                  var th = (ptsP[s][1] + (ptsP[s+1][1] - ptsP[s][1]) * f) * Math.PI / 180;
                  samples.push([rr * Math.cos(th), rr * Math.sin(th), fCell * (0.75 + 0.25 * (rr - 0.0245) / 0.0575)]);
                }
              }
              var lastP = ptsP[ptsP.length - 1], lth = lastP[1] * Math.PI / 180;
              samples.push([lastP[0] * Math.cos(lth), lastP[0] * Math.sin(lth), fCell * 0.75]);
              return samples;
            });
            for (var giT = 0; giT < gridN; giT++) {
              if (white[giT]) continue;
              var tx2 = fpxArr[giT], ty2 = fpyArr[giT];
              var pr2 = Math.hypot(tx2, ty2);
              if (pr2 < 0.0235 || pr2 > 0.085) continue;
              for (var pi = 0; pi < tipPaths.length; pi++) {
                var sm = tipPaths[pi], hitT = false;
                for (var k2 = 0; k2 < sm.length; k2++) {
                  var ddx = tx2 - sm[k2][0], ddy = ty2 - sm[k2][1];
                  if (ddx * ddx + ddy * ddy <= sm[k2][2] * sm[k2][2]) { hitT = true; break; }
                }
                if (hitT) { white[giT] = 1; break; }
              }
            }
            /* 4) Hole fill: enclosed anti-aliasing red pinholes (<= 4 cells) outside r >= 0.05 (stars & stamens are >> 4 cells) */
            var label = new Int32Array(gridN).fill(-1);
            var stack = new Int32Array(gridN);
            var members = [];
            for (var r3 = 0; r3 < FR; r3++) {
              for (var c3 = 0; c3 < FC; c3++) {
                var start3 = r3 * FC + c3;
                if (white[start3] || label[start3] >= 0) continue;
                var sp3 = 0; members.length = 0;
                stack[sp3++] = start3; label[start3] = 1;
                while (sp3 > 0) {
                  var cur3 = stack[--sp3];
                  members.push(cur3);
                  var cc3 = cur3 % FC, cr3 = (cur3 - cc3) / FC;
                  for (var dr3 = -1; dr3 <= 1; dr3++) for (var dc3 = -1; dc3 <= 1; dc3++) {
                    if (!dr3 && !dc3) continue;
                    var nc3 = cc3 + dc3, nr3 = cr3 + dr3;
                    if (nc3 < 0 || nr3 < 0 || nc3 >= FC || nr3 >= FR) continue;
                    var nb3 = nr3 * FC + nc3;
                    if (!white[nb3] && label[nb3] < 0) { label[nb3] = 1; stack[sp3++] = nb3; }
                  }
                }
                if (members.length <= 4) {
                  var doFill = true;
                  for (var m3 = 0; m3 < members.length && doFill; m3++) {
                    var mi3 = members[m3];
                    if (fpxArr[mi3] * fpxArr[mi3] + fpyArr[mi3] * fpyArr[mi3] < 0.05 * 0.05) { doFill = false; break; }
                    var mc3 = mi3 % FC, mr3 = (mi3 - mc3) / FC, wn3 = 0;
                    for (var dr4 = -1; dr4 <= 1; dr4++) {
                      for (var dc4 = -1; dc4 <= 1; dc4++) {
                        if (!dr4 && !dc4) continue;
                        var nc4 = mc3 + dc4, nr4 = mr3 + dr4;
                        if (nc4 < 0 || nr4 < 0 || nc4 >= FC || nr4 >= FR) { wn3 = -99; break; }
                        if (white[nr4 * FC + nc4]) wn3++;
                      }
                      if (wn3 < 0) break;
                    }
                    if (wn3 < 5) doFill = false;
                  }
                  if (doFill) for (var m4 = 0; m4 < members.length; m4++) white[members[m4]] = 1;
                }
              }
            }
            /* 5) Final pure-Flame centre pinpoint guard (r < 0.023), clean white star-to-stamen gaps & crisp 5-pointed star replacement */
            var STAR_GAPS = [[-0.083, 0.296, 0.025], [0.274, 0.168, 0.026], [-0.115, -0.286, 0.025], [0.244, -0.211, 0.024]];
            var STARS = [[-0.3528, 0.0779, 10], [-0.0370, 0.3579, 11], [0.3304, 0.1446, 8], [0.2385, -0.2708, 6], [-0.1855, -0.3109, 7]];
            var STAR_OUT = 0.058, STAR_IN = 0.023;
            var STAR_SEC = 6.283185307 / 5, STAR_HALF = STAR_SEC * 0.5, COS_H = Math.cos(STAR_HALF), SIN_H = Math.sin(STAR_HALF);
            function isInside5Star(px, py, cxS, cyS, rO, rI, rotRad){
              var dxS = px - cxS, dyS = py - cyS, rS = Math.hypot(dxS, dyS);
              if (rS > rO) return false;
              if (rS <= rI) return true;
              var aS = ((Math.atan2(dyS, dxS) - rotRad) % STAR_SEC + STAR_SEC) % STAR_SEC;
              if (aS > STAR_HALF) aS = STAR_SEC - aS;
              var bxS = rI * COS_H, byS = rI * SIN_H;
              return (bxS - rO) * (rS * Math.sin(aS)) - byS * (rS * Math.cos(aS) - rO) >= 0;
            }
            for (var giC = 0; giC < gridN; giC++) {
              var gxC = fpxArr[giC], gyC = fpyArr[giC];
              if (white[giC] && gxC * gxC + gyC * gyC < 0.023 * 0.023) white[giC] = 0;
              if (!white[giC]) {
                var cleared = false;
                for (var sgi = 0; sgi < STAR_GAPS.length; sgi++) {
                  var dxG = gxC - STAR_GAPS[sgi][0], dyG = gyC - STAR_GAPS[sgi][1], rgG = STAR_GAPS[sgi][2];
                  if (dxG * dxG + dyG * dyG <= rgG * rgG) { white[giC] = 1; cleared = true; break; }
                }
                if (!cleared) {
                  for (var sti = 0; sti < STARS.length; sti++) {
                    var dxSt = gxC - STARS[sti][0], dySt = gyC - STARS[sti][1];
                    if (dxSt * dxSt + dySt * dySt <= 0.062 * 0.062) { white[giC] = 1; break; }
                  }
                }
              }
            }
            /* Consistent 5-pointed star particles in each petal's own rotated frame — exact same z=0.0, fl=1.0, and background particle density */
            var starPts = [];
            for (var sti2 = 0; sti2 < STARS.length; sti2++) {
              var scx = STARS[sti2][0], scy = STARS[sti2][1], sRot = STARS[sti2][2] * Math.PI / 180;
              for (var sv = 0; sv < 5; sv++) {
                var aTip = sRot + sv * STAR_SEC;
                var aVal = aTip + STAR_HALF;
                /* 5 outer tips + 5 inner valleys + 5 inner ring points + 1 center = 16 points (~background cell density) */
                var txP = scx + Math.cos(aTip) * (STAR_OUT * 0.90), tyP = scy + Math.sin(aTip) * (STAR_OUT * 0.90);
                var mxP = scx + Math.cos(aTip) * (STAR_OUT * 0.50), myP = scy + Math.sin(aTip) * (STAR_OUT * 0.50);
                var vxP = scx + Math.cos(aVal) * (STAR_IN * 0.85), vyP = scy + Math.sin(aVal) * (STAR_IN * 0.85);
                starPts.push([(txP / 1.5) * 0.76, (tyP / 1.0) * 0.51, 0.0, 1.0]);
                starPts.push([(mxP / 1.5) * 0.76, (myP / 1.0) * 0.51, 0.0, 1.0]);
                starPts.push([(vxP / 1.5) * 0.76, (vyP / 1.0) * 0.51, 0.0, 1.0]);
              }
              starPts.push([(scx / 1.5) * 0.76, (scy / 1.0) * 0.51, 0.0, 1.0]);
            }
            /* 6) Full-cell stratified random jitter across the cloth + exact 5-pointed star cutout in white petals */
            var buckets = [[],[],[],[],[],[],[],[]];
            var cellW = (3 / FC) * (0.76 / 1.5), cellH = (2 / FR) * (0.51 / 1.0);
            for (var r4 = 0; r4 < FR; r4++) {
              for (var c4 = 0; c4 < FC; c4++) {
                var giF = r4 * FC + c4;
                if (white[giF]) {
                  var inStarCut = false;
                  for (var stc = 0; stc < STARS.length; stc++) {
                    if (isInside5Star(fpxArr[giF], fpyArr[giF], STARS[stc][0], STARS[stc][1], STAR_OUT, STAR_IN, STARS[stc][2] * Math.PI / 180)) { inStarCut = true; break; }
                  }
                  if (inStarCut) continue;
                }
                var isEdgeX = (c4 === 0 || c4 === FC - 1), isEdgeY = (r4 === 0 || r4 === FR - 1);
                var jitScale = white[giF] ? 0.24 : 1.00;
                var ox = isEdgeX ? 0.0 : ((Math.random() - 0.5) * jitScale * cellW);
                var oy = isEdgeY ? 0.0 : ((Math.random() - 0.5) * jitScale * cellH);
                var wx2 = Math.max(-0.76, Math.min(0.76, (fpxArr[giF] / 1.5) * 0.76 + ox));
                var wy2 = Math.max(-0.51, Math.min(0.51, (fpyArr[giF] / 1.0) * 0.51 + oy));
                var bIdx = ((r4 & 1) << 2) | (c4 & 3);
                buckets[bIdx].push([wx2, wy2, 0.0, white[giF] ? 0.0 : 1.0]);
              }
            }
            var pts = polePts.concat(starPts, buckets[0], buckets[1], buckets[2], buckets[3], buckets[4], buckets[5], buckets[6], buckets[7]);
            var out = new Float32Array(N * 4);
            var used = Math.min(N, pts.length);
            for (var m = 0; m < used; m++) {
              var pp = pts[m];
              out[m*4] = pp[0]; out[m*4 + 1] = pp[1]; out[m*4 + 2] = pp[2]; out[m*4 + 3] = pp[3];
            }
            parkRest(out, used);
            SHAPES.pin.set(out);
            if (typeof currentKey !== "undefined" && currentKey === "pin") {
              curTarget.set(SHAPES.pin);
              gl.bindBuffer(gl.ARRAY_BUFFER, bufTarget);
              gl.bufferSubData(gl.ARRAY_BUFFER, 0, curTarget);
            }
          }
          var hkImg = new Image();
          hkImg.onload = function(){ buildUnifiedHKFlag(hkImg); };
          hkImg.src = "data:image/webp;base64,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";
        })();

        /* Apple-Grade Solid-Fill Text Rasterizer (SF Pro / PingFang / Hiragino + vertical Flame-Orange to Pearl-White luminous gradient) */
        function sampleTextShape(text, fontPx, accentFlameTail, withBeacon, appleStyle){
          var c = document.createElement("canvas");
          c.width = appleStyle ? 540 : 440; c.height = 160;
          var ctx = c.getContext("2d");
          ctx.clearRect(0, 0, c.width, c.height);
          ctx.fillStyle = "#ffffff";
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          var weight = appleStyle ? "600 " : "800 ";
          var family = appleStyle ? "-apple-system,'SF Pro Display','PingFang HK','Hiragino Sans','Archivo',sans-serif" : "Archivo,'PingFang HK','Hiragino Sans',sans-serif";
          ctx.font = weight + fontPx + "px " + family;
          ctx.fillText(text, c.width * 0.5, c.height * 0.52);
          var data = ctx.getImageData(0, 0, c.width, c.height).data;
          var pts = [];
          for (var py = 0; py < c.height; py += 2) {
            for (var px = 0; px < c.width; px += 2) {
              if (data[(py * c.width + px) * 4 + 3] > 110) pts.push([px, py]);
            }
          }
          var out = new Float32Array(N * 4);
          if (!pts.length) return samplePaths([[-0.6,0, 0.6,0, 1]], N, 0.03, 0.1);
          var minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
          for (var a = 0; a < pts.length; a++) {
            if (pts[a][0] < minX) minX = pts[a][0]; if (pts[a][0] > maxX) maxX = pts[a][0];
            if (pts[a][1] < minY) minY = pts[a][1]; if (pts[a][1] > maxY) maxY = pts[a][1];
          }
          var w = Math.max(1, maxX - minX), h = Math.max(1, maxY - minY);
          var maxW = withBeacon ? 1.32 : (appleStyle ? 1.66 : 1.54);
          var sc = Math.min(maxW / w, (appleStyle ? 0.64 : 0.68) / h);
          var cx = (minX + maxX) * 0.5, cy = (minY + maxY) * 0.5;
          var accentEnd = withBeacon ? Math.floor(BASE_N * 0.10) : (appleStyle ? 0 : Math.floor(BASE_N * 0.08));
          if (withBeacon) {
            for (var b = 0; b < accentEnd; b++) {
              var ba = (b / accentEnd) * 6.283185, br = (b % 3 === 0 ? 0.11 : 0.055);
              out[b*4] = -0.70 + Math.cos(ba) * br; out[b*4 + 1] = 0.04 + Math.sin(ba) * br; out[b*4 + 2] = 0.02; out[b*4 + 3] = 1.0;
            }
          } else if (accentEnd > 0) {
            for (var b2 = 0; b2 < accentEnd; b2++) {
              var bt = b2 / Math.max(1, accentEnd);
              out[b2*4] = -0.42 + bt * 0.84; out[b2*4 + 1] = -0.46; out[b2*4 + 2] = 0.02; out[b2*4 + 3] = 1.0;
            }
          }
          var txtN = BASE_N - accentEnd, xShift = withBeacon ? 0.12 : 0.0;
          for (var i = 0; i < txtN; i++) {
            var idx = accentEnd + i;
            var p = pts[Math.min(pts.length - 1, Math.floor(((i + 0.5) * pts.length) / txtN))];
            var h1 = Math.sin(idx * 12.9898) * 43758.5453; h1 -= Math.floor(h1);
            var h2 = Math.sin(idx * 78.233) * 43758.5453; h2 -= Math.floor(h2);
            var nx = (p[0] - cx) * sc + xShift + (h1 - 0.5) * 0.008;
            var ny = -(p[1] - cy) * sc + (appleStyle ? 0.0 : 0.04) + (h2 - 0.5) * 0.008;
            var normX = (p[0] - minX) / w;
            var normY = (p[1] - minY) / h; /* 0 = top of glyph, 1 = bottom of glyph */
            out[idx*4] = nx; out[idx*4 + 1] = ny; out[idx*4 + 2] = (h1 - 0.5) * 0.022;
            /* Apple Luminous Gradient: warm Molten Flame top -> velvety peach mid -> incandescent Pearl-White bottom */
            out[idx*4 + 3] = appleStyle ? Math.pow(1.0 - normY, 1.35) * 0.90 : ((accentFlameTail && normX > 0.78) ? 0.92 : 0.0);
          }
          parkRest(out, BASE_N);
          out._worldArea = pts.length * (2 * sc) * (2 * sc);
          return out;
        }

        /* 4. Coding since 2019 -> Swiss Brutalist Chamfered Wireframe Terminal (unified WebGL2 3,200-particle live typewriter) */
        var CODE_FRAME_N = Math.floor(BASE_N * 0.22);
        var CODE_FRAME_PTS = (function(){
          var segs = [
            /* Classic Clean Rectangular Terminal Window Frame + Title Bar Divider */
            [-0.86,-0.54, 0.86,-0.54, 0], [0.86,-0.54, 0.86,0.54, 0], [0.86,0.54, -0.86,0.54, 0], [-0.86,0.54, -0.86,-0.54, 0],
            [-0.86,-0.37, 0.86,-0.37, 0]
          ];
          /* 3 Classic Window Control Circles on Top-Left (First = Flame, Next Two = Bone) */
          var dxs = [-0.74, -0.64, -0.54];
          for (var di = 0; di < 3; di++) {
            for (var a = 0; a < 10; a++) {
              var a0 = (a / 10) * 6.283, a1 = ((a + 1) / 10) * 6.283;
              segs.push([dxs[di] + Math.cos(a0)*0.028, -0.455 + Math.sin(a0)*0.028, dxs[di] + Math.cos(a1)*0.028, -0.455 + Math.sin(a1)*0.028, di === 0 ? 1 : 0]);
            }
          }
          return samplePaths(segs, CODE_FRAME_N, 0.010, 0.02);
        })();
        var codeOffC = document.createElement("canvas");
        codeOffC.width = 520; codeOffC.height = 176;
        var codeOffCtx = codeOffC.getContext("2d", { willReadFrequently: true });
        function buildCodeBuffer(termLines, showCursor){
          var out = new Float32Array(N * 4);
          out.set(CODE_FRAME_PTS, 0);
          var c = codeOffC, ctx = codeOffCtx;
          ctx.clearRect(0, 0, c.width, c.height);
          ctx.textBaseline = "middle"; ctx.textAlign = "left";
          var vis = termLines.slice(-4);
          var fPx = 21, lh = 40, startY = 26;
          ctx.font = "700 " + fPx + "px 'JetBrains Mono',ui-monospace,Menlo,monospace";
          var charW = ctx.measureText("MMMMMMMMMM").width / 10 || 13.2;
          for (var i = 0; i < vis.length; i++) {
            var ln = vis[i], y = startY + i * lh, x = 12;
            for (var s = 0; s < ln.segs.length; s++) {
              var sg = ln.segs[s];
              ctx.fillStyle = sg.fl ? "#ff4400" : "#ffffff";
              ctx.fillText(sg.t, x, y);
              x += sg.t.length * charW;
            }
            if (showCursor && i === vis.length - 1) {
              ctx.fillStyle = "#ff4400";
              ctx.fillRect(Math.min(c.width - 14, x + 2), y - 10, 9, 20);
            }
          }
          var img = ctx.getImageData(0, 0, c.width, c.height).data;
          var pts = [];
          for (var py = 0; py < c.height; py += 2) {
            for (var px = 0; px < c.width; px += 2) {
              var o = (py * c.width + px) * 4;
              if (img[o + 3] > 95) pts.push([px, py, img[o + 2] < 100 ? 1.0 : 0.0]);
            }
          }
          var txtN = BASE_N - CODE_FRAME_N;
          var used = Math.min(txtN, pts.length);
          /* Strict 1-particle-per-pixel cap so short lines (like line 1 starting) never pile up 20x & blow out */
          for (var k = 0; k < used; k++) {
            var idx = CODE_FRAME_N + k;
            var p = pts[Math.min(pts.length - 1, Math.floor(((k + 0.5) * pts.length) / used))];
            out[idx*4]     = -0.78 + (p[0] / c.width) * 1.56;
            out[idx*4 + 1] = 0.29 - (p[1] / c.height) * 0.76;
            out[idx*4 + 2] = 0.015;
            out[idx*4 + 3] = p[2];
          }
          /* Park spare particles spread across terminal interior at alpha=0 (z = -10.0) so they never collapse into a center flash */
          for (var e = CODE_FRAME_N + used; e < N; e++) {
            var h1 = Math.sin(e * 12.9898) * 43758.5453; h1 -= Math.floor(h1);
            var h2 = Math.sin(e * 78.233) * 43758.5453; h2 -= Math.floor(h2);
            out[e*4]     = -0.78 + h1 * 1.56;
            out[e*4 + 1] = -0.46 + h2 * 0.76;
            out[e*4 + 2] = -10.0;
            out[e*4 + 3] = 0.0;
          }
          return out;
        }
        SHAPES.code = buildCodeBuffer([
          { segs: [{ t: "~ ", fl: false }, { t: "$ ", fl: true }, { t: "git clone app", fl: false }] }
        ], true);

        /* 5. Education (HKU) -> Animated 3D Graduation Cap with Swinging Flame Tassel & Sparkles */
        SHAPES.edu = samplePaths([
          [0.0,-0.52, 0.84,-0.12, 0], [0.84,-0.12, 0.0,0.26, 0], [0.0,0.26, -0.84,-0.12, 0], [-0.84,-0.12, 0.0,-0.52, 0],
          [-0.46,0.08, -0.46,0.46, 0], [0.46,0.08, 0.46,0.46, 0], [-0.46,0.46, 0.0,0.62, 0], [0.46,0.46, 0.0,0.62, 0],
          /* Center Button + Swinging Flame Tassel Cord & Fringe (animated live by uEduLive) */
          [0.0,-0.12, 0.68,-0.04, 1], [0.68,-0.04, 0.68,0.46, 1],
          [0.62,0.46, 0.74,0.46, 1], [0.64,0.46, 0.60,0.58, 1], [0.68,0.46, 0.68,0.60, 1], [0.72,0.46, 0.76,0.58, 1],
          /* Celebratory Sparkles */
          [-0.64,-0.52, -0.56,-0.52, 1], [-0.60,-0.56, -0.60,-0.48, 1],
          [0.62,-0.50, 0.70,-0.50, 1], [0.66,-0.54, 0.66,-0.46, 1]
        ], N, 0.022, 0.12);

        /* 6. Languages -> Apple Luminous Gradient 3-Language Hello Cycle: 你好 -> hello -> こんにちは */
        var LANG_CYCLE = ["lang_zh", "lang_en", "lang_ja"];
        SHAPES.lang_zh  = sampleTextShape("你好", 106, false, false, true);
        SHAPES.lang_en  = sampleTextShape("Hello", 104, false, false, true);
        SHAPES.lang_ja  = sampleTextShape("こんにちは", 82, false, false, true);
        SHAPES.globe    = SHAPES.lang_zh;
        /* Equalize additive brightness & gradient saturation across all 3 languages by scaling alpha proportionally to world-space glyph area */
        var langRefArea = SHAPES.lang_zh._worldArea || 0.30;
        var LANG_ALPHA = {
          lang_zh: 0.38,
          lang_en: Math.max(0.14, Math.min(0.46, 0.38 * ((SHAPES.lang_en._worldArea || langRefArea) / langRefArea))),
          lang_ja: Math.max(0.14, Math.min(0.46, 0.38 * ((SHAPES.lang_ja._worldArea || langRefArea) / langRefArea)))
        };

        /* 7. Focus (Software · Web · AI · Automation) -> 4-Stage Sculptural 3D Discipline Cycle */
        function sample3DPaths(segs, count, spread){
          var active = Math.min(count, BASE_N);
          var out = new Float32Array(N * 4), lens = [], total = 0;
          for (var i = 0; i < segs.length; i++) {
            var s = segs[i], l = Math.hypot(s[3] - s[0], s[4] - s[1], s[5] - s[2]);
            lens.push(l); total += l;
          }
          for (var k = 0; k < active; k++) {
            var d = (k / active) * total, acc = 0, idx = 0;
            for (var j = 0; j < lens.length; j++) { if (acc + lens[j] >= d || j === lens.length - 1) { idx = j; break; } acc += lens[j]; }
            var seg = segs[idx], t = lens[idx] > 0 ? Math.min(1, (d - acc) / lens[idx]) : 0;
            var h1 = Math.sin(k * 12.9898) * 43758.5453; h1 -= Math.floor(h1);
            var h2 = Math.sin(k * 78.233) * 43758.5453; h2 -= Math.floor(h2);
            var h3 = Math.sin(k * 37.719) * 43758.5453; h3 -= Math.floor(h3);
            var sp = spread || 0.016;
            out[k*4]     = seg[0] + (seg[3] - seg[0]) * t + (h1 - 0.5) * sp;
            out[k*4 + 1] = seg[1] + (seg[4] - seg[1]) * t + (h2 - 0.5) * sp;
            out[k*4 + 2] = seg[2] + (seg[5] - seg[2]) * t + (h3 - 0.5) * sp;
            out[k*4 + 3] = seg[6] || 0;
          }
          return parkRest(out, active);
        }
        /* Crisp 160x160 Offscreen Canvas Icon Sampler (inspired by Focus Particle Elements) with z-tag animation layers */
        var icoOff = document.createElement("canvas"); icoOff.width = 160; icoOff.height = 160;
        var icoCtx = icoOff.getContext("2d", { willReadFrequently: true });
        function icoRR(c, x, y, w, h, r){
          c.beginPath(); c.moveTo(x + r, y);
          c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
          c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
        }
        function sampleCanvasIcon(layers){
          var pts = [];
          for (var li = 0; li < layers.length; li++) {
            var L = layers[li], st = L.step || 2;
            icoCtx.clearRect(0, 0, 160, 160); icoCtx.save();
            L.draw(icoCtx);
            icoCtx.restore();
            var d = icoCtx.getImageData(0, 0, 160, 160).data;
            for (var py = 0; py < 160; py += st) {
              for (var px = 0; px < 160; px += st) {
                if (d[(py * 160 + px) * 4 + 3] > 110) {
                  pts.push([(px - 80) / 80 * 0.86, -(py - 80) / 80 * 0.86, L.z || 0.0, L.fl || 0.0]);
                }
              }
            }
          }
          var out = new Float32Array(N * 4);
          if (!pts.length) return parkRest(out, 0);
          for (var k = 0; k < BASE_N; k++) {
            var p = pts[Math.min(pts.length - 1, Math.floor(((k + 0.5) * pts.length) / BASE_N))];
            var h1 = Math.sin(k * 12.9898) * 43758.5453; h1 -= Math.floor(h1);
            var h2 = Math.sin(k * 78.233) * 43758.5453; h2 -= Math.floor(h2);
            out[k*4] = p[0] + (h1 - 0.5) * 0.006;
            out[k*4 + 1] = p[1] + (h2 - 0.5) * 0.006;
            out[k*4 + 2] = p[2];
            out[k*4 + 3] = p[3];
          }
          return parkRest(out, BASE_N);
        }
        /* 7a. Software -> Rotating 8-Tooth Engineering Gear (Bone) around Crisp Flame </> Code Mark (animated live by uSwLive) */
        SHAPES.dom_sw = sampleCanvasIcon([
          { step: 2, z: 0.025, fl: 0.0, draw: function(c){
            var cx = 80, cy = 80, teeth = 8, rIn = 46, rOut = 64;
            c.strokeStyle = "#fff"; c.lineWidth = 5.5; c.lineJoin = "round";
            c.beginPath();
            for (var i = 0; i < teeth; i++) {
              var a0 = (i / teeth) * 6.2832;
              var da = 6.2832 / teeth;
              var p0 = a0, p1 = a0 + da * 0.24, p2 = a0 + da * 0.34, p3 = a0 + da * 0.66, p4 = a0 + da * 0.76;
              if (i === 0) c.moveTo(cx + Math.cos(p0) * rIn, cy + Math.sin(p0) * rIn);
              c.lineTo(cx + Math.cos(p1) * rIn, cy + Math.sin(p1) * rIn);
              c.lineTo(cx + Math.cos(p2) * rOut, cy + Math.sin(p2) * rOut);
              c.lineTo(cx + Math.cos(p3) * rOut, cy + Math.sin(p3) * rOut);
              c.lineTo(cx + Math.cos(p4) * rIn, cy + Math.sin(p4) * rIn);
            }
            c.closePath(); c.stroke();
            c.lineWidth = 3.2; c.beginPath(); c.arc(cx, cy, 35, 0, 6.2832); c.stroke();
          } },
          { step: 2, z: 0.0, fl: 1.0, draw: function(c){
            c.strokeStyle = "#fff"; c.lineWidth = 5.8; c.lineCap = "round"; c.lineJoin = "round";
            c.beginPath(); c.moveTo(68, 66); c.lineTo(54, 80); c.lineTo(68, 94); c.stroke();
            c.beginPath(); c.moveTo(92, 66); c.lineTo(106, 80); c.lineTo(92, 94); c.stroke();
            c.lineWidth = 5.0;
            c.beginPath(); c.moveTo(85, 62); c.lineTo(75, 98); c.stroke();
          } }
        ]);
        /* 7b. Web -> Classic Wireframe Globe + Horizontal Pill Banner with Bold Flame WWW (animated live by uWebLive) */
        SHAPES.dom_web = sampleCanvasIcon([
          { step: 2, z: 0.0, fl: 0.0, draw: function(c){
            c.strokeStyle = "#fff"; c.lineWidth = 5.0;
            c.beginPath(); c.arc(80, 80, 56, 0, 6.2832); c.stroke();
            c.lineWidth = 3.8;
            c.beginPath(); c.ellipse(80, 80, 27, 56, 0, 0, 6.2832); c.stroke();
            c.beginPath(); c.moveTo(80, 24); c.lineTo(80, 136); c.stroke();
            c.beginPath(); c.moveTo(32, 50); c.quadraticCurveTo(80, 60, 128, 50); c.stroke();
            c.beginPath(); c.moveTo(32, 110); c.quadraticCurveTo(80, 100, 128, 110); c.stroke();
            /* Cleanly mask globe interior behind the horizontal WWW pill */
            c.globalCompositeOperation = "destination-out";
            c.fillStyle = "#000"; icoRR(c, 22, 62, 116, 36, 18); c.fill();
            c.globalCompositeOperation = "source-over";
            c.lineWidth = 4.5; icoRR(c, 22, 62, 116, 36, 18); c.stroke();
          } },
          { step: 2, z: 0.035, fl: 1.0, draw: function(c){
            c.fillStyle = "#fff"; c.font = '900 22px "Archivo","Helvetica Neue",sans-serif'; c.textAlign = "center"; c.textBaseline = "middle";
            c.fillText("WWW", 80, 81);
          } }
        ]);
        /* 7c. AI -> Open-Corner Rounded Frame + Bold Bone AI + 3 Twinkling Flame Sparkles Breaking Top-Right Corner (animated live by uAiLive) */
        SHAPES.dom_ai = sampleCanvasIcon([
          { step: 2, z: 0.0, fl: 0.0, draw: function(c){
            c.strokeStyle = "#fff"; c.lineWidth = 6.5; c.lineCap = "round"; c.lineJoin = "round";
            /* Rounded square with clean open top-right corner for the 3 sparkles */
            c.beginPath();
            c.moveTo(76, 36); c.lineTo(42, 36); c.arcTo(26, 36, 26, 52, 16);
            c.lineTo(26, 118); c.arcTo(26, 134, 42, 134, 16);
            c.lineTo(106, 134); c.arcTo(122, 134, 122, 118, 16);
            c.lineTo(122, 88); c.stroke();
            c.fillStyle = "#fff"; c.font = '900 50px "Archivo","Helvetica Neue",sans-serif'; c.textAlign = "center"; c.textBaseline = "middle";
            c.fillText("AI", 73, 88);
          } },
          { step: 2, z: 0.030, fl: 1.0, draw: function(c){
            c.fillStyle = "#fff"; c.beginPath();
            c.moveTo(102, 18); c.lineTo(107.5, 34.5); c.lineTo(124, 40); c.lineTo(107.5, 45.5);
            c.lineTo(102, 62); c.lineTo(96.5, 45.5); c.lineTo(80, 40); c.lineTo(96.5, 34.5);
            c.closePath(); c.fill();
          } },
          { step: 2, z: 0.050, fl: 1.0, draw: function(c){
            c.fillStyle = "#fff"; c.beginPath();
            c.moveTo(126, 52); c.lineTo(130, 62); c.lineTo(140, 66); c.lineTo(130, 70);
            c.lineTo(126, 80); c.lineTo(122, 70); c.lineTo(112, 66); c.lineTo(122, 62);
            c.closePath(); c.fill();
          } },
          { step: 2, z: 0.070, fl: 1.0, draw: function(c){
            c.fillStyle = "#fff"; c.beginPath();
            c.moveTo(132, 24); c.lineTo(134.5, 31.5); c.lineTo(142, 34); c.lineTo(134.5, 36.5);
            c.lineTo(132, 44); c.lineTo(129.5, 36.5); c.lineTo(122, 34); c.lineTo(129.5, 31.5);
            c.closePath(); c.fill();
          } }
        ]);
        /* 7d. Automation -> Clean Staggered 3-Node n8n Workflow Canvas (Trigger • -> Transform ◆ -> Ship ✓, zero stray top-left text) */
        SHAPES.dom_auto = sampleCanvasIcon([
          { step: 2, z: 0.0, fl: 0.0, draw: function(c){
            c.strokeStyle = "#fff"; c.lineWidth = 3.4; c.lineCap = "round";
            c.beginPath(); c.moveTo(46, 89); c.bezierCurveTo(55, 89, 54, 65, 63, 65); c.stroke();
            c.beginPath(); c.moveTo(97, 65); c.bezierCurveTo(106, 65, 105, 89, 114, 89); c.stroke();
            c.fillStyle = "#fff";
            c.beginPath(); c.arc(63, 65, 3.5, 0, 6.2832); c.fill();
            c.beginPath(); c.arc(114, 89, 3.5, 0, 6.2832); c.fill();
            c.lineWidth = 3.2;
            icoRR(c, 12, 72, 34, 34, 8); c.stroke();
            icoRR(c, 63, 48, 34, 34, 8); c.stroke();
            icoRR(c, 114, 72, 34, 34, 8); c.stroke();
          } },
          { step: 2, z: 0.02, fl: 1.0, draw: function(c){
            c.fillStyle = "#fff";
            c.beginPath(); c.arc(29, 89, 6.0, 0, 6.2832); c.fill();
            c.beginPath(); c.moveTo(80, 57); c.lineTo(88, 65); c.lineTo(80, 73); c.lineTo(72, 65); c.closePath(); c.fill();
            c.strokeStyle = "#fff"; c.lineWidth = 3.8; c.lineCap = "round"; c.lineJoin = "round";
            c.beginPath(); c.moveTo(124, 89); c.lineTo(129, 94); c.lineTo(139, 83); c.stroke();
          } }
        ]);
        var DOMAIN_CYCLE = ["dom_sw", "dom_web", "dom_ai", "dom_auto"];
        SHAPES.graph = SHAPES.dom_sw;

        /* 8. Status -> Architectural Open-to-Work Briefcase (Bone) + Pulsing Flame Checkmark Badge & Availability Ripple (animated live by uStatusLive) */
        SHAPES.status_open = sampleCanvasIcon([
          { step: 2, z: 0.0, fl: 0.0, draw: function(c){
            c.strokeStyle = "#fff"; c.lineWidth = 5.2; c.lineCap = "round"; c.lineJoin = "round";
            /* Top handle */
            c.beginPath();
            c.moveTo(58, 54); c.lineTo(58, 42); c.arcTo(58, 34, 66, 34, 8);
            c.lineTo(94, 34); c.arcTo(102, 34, 102, 42, 8); c.lineTo(102, 54); c.stroke();
            /* Rounded briefcase body */
            icoRR(c, 24, 54, 112, 74, 13); c.stroke();
            /* Upper flap seam + center clasp */
            c.lineWidth = 3.6;
            c.beginPath(); c.moveTo(25, 79); c.lineTo(72, 79); c.stroke();
            c.beginPath(); c.moveTo(88, 79); c.lineTo(135, 79); c.stroke();
            icoRR(c, 72, 72, 16, 14, 3); c.stroke();
            /* Clean cutout at bottom-right corner for the Flame Availability Checkmark Badge */
            c.globalCompositeOperation = "destination-out";
            c.fillStyle = "#000"; c.beginPath(); c.arc(124, 118, 25, 0, 6.2832); c.fill();
            c.globalCompositeOperation = "source-over";
          } },
          { step: 2, z: 0.025, fl: 1.0, draw: function(c){
            c.strokeStyle = "#fff"; c.lineWidth = 4.2; c.lineCap = "round"; c.lineJoin = "round";
            c.beginPath(); c.arc(124, 118, 17.5, 0, 6.2832); c.stroke();
            c.lineWidth = 4.6;
            c.beginPath(); c.moveTo(116, 118); c.lineTo(122, 124); c.lineTo(133, 112); c.stroke();
          } },
          { step: 2, z: 0.060, fl: 1.0, draw: function(c){
            c.strokeStyle = "#fff"; c.lineWidth = 2.6;
            c.beginPath(); c.arc(124, 118, 21, 0, 6.2832); c.stroke();
          } }
        ]);
        var STATUS_CYCLE = ["status_open"];
        SHAPES.check = SHAPES.status_open;

        var seeds = new Float32Array(N * 3);
        for (var i = 0; i < N; i++) {
          seeds[i*3]     = ((i * 73) % 100) / 100 * 0.09;
          seeds[i*3 + 1] = ((i * 41) % 100) / 100;
          seeds[i*3 + 2] = ((i * 17) % 100) / 100;
        }
        var curStart = new Float32Array(SHAPES.sculpture);
        var curTarget = new Float32Array(SHAPES.sculpture);

        var vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        var bufStart = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, bufStart);
        gl.bufferData(gl.ARRAY_BUFFER, curStart, gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);

        var bufTarget = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, bufTarget);
        gl.bufferData(gl.ARRAY_BUFFER, curTarget, gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);

        var bufSeed = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, bufSeed);
        gl.bufferData(gl.ARRAY_BUFFER, seeds, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);

        var uTimeLoc = gl.getUniformLocation(prog, "uTime");
        var uMorphLoc = gl.getUniformLocation(prog, "uMorph");
        var uTargetRotLoc = gl.getUniformLocation(prog, "uTargetRot");
        var uTiltLoc = gl.getUniformLocation(prog, "uTilt");
        var uAspectLoc = gl.getUniformLocation(prog, "uAspect");
        var uDprLoc = gl.getUniformLocation(prog, "uDpr");
        var uDefaultLoc = gl.getUniformLocation(prog, "uDefault");
        var uLensIdxLoc = gl.getUniformLocation(prog, "uLensIdx");
        var uFlagWaveLoc = gl.getUniformLocation(prog, "uFlagWave");
        var uCodeLiveLoc = gl.getUniformLocation(prog, "uCodeLive");
        var uStatusLiveLoc = gl.getUniformLocation(prog, "uStatusLive");
        var uSwLiveLoc = gl.getUniformLocation(prog, "uSwLive");
        var uWebLiveLoc = gl.getUniformLocation(prog, "uWebLive");
        var uAiLiveLoc = gl.getUniformLocation(prog, "uAiLive");
        var uAutoLiveLoc = gl.getUniformLocation(prog, "uAutoLive");
        var uFocusAgeLoc = gl.getUniformLocation(prog, "uFocusAge");
        var uEduLiveLoc = gl.getUniformLocation(prog, "uEduLive");
        var uLangLiveLoc = gl.getUniformLocation(prog, "uLangLive");
        var uLangAlphaLoc = gl.getUniformLocation(prog, "uLangAlpha");
        var uStageScaleLoc = gl.getUniformLocation(prog, "uStageScale");

        var aspect = 1.2, dpr = Math.min(window.devicePixelRatio || 1, 2), stageScale = 1.0;
        var tiltX = 0, tiltY = 0, curTiltX = 0, curTiltY = 0, inView = true, scrollP = 0, prevScrollP = 0;
        /* Saved original-sculpture pose memory: frozen on hover-in, untouched across icon hops, restored on hover-out */
        var savedRotY = 0.48, savedRotX = 0.72, sculpRotY = 0.48, sculpRotX = 0.72;
        var activeTargetRotY = 0.48, activeTargetRotX = 0.72;
        var tClock = 0, focusAge = 0, lastNow = 0, rafId = 0;
        var currentKey = "sculpture", morphT = 1.1, defaultBlend = 1, flagWaveBlend = 0, codeLiveBlend = 0, statusLiveBlend = 0, swLiveBlend = 0, webLiveBlend = 0, aiLiveBlend = 0, autoLiveBlend = 0, eduLiveBlend = 0, langLiveBlend = 0, langAlphaCur = 0.38;
        var leaveTimer = null, activeCycleList = null, activeCycleHold = 0, cycleClock = 0, cycleIdx = 0;

        function easeOutF(t){ return 1 - Math.pow(1 - t, 3.6); }
        function stopCycle(){ activeCycleList = null; activeCycleHold = 0; cycleClock = 0; }
        function startCycle(list, holdSec){
          if (activeCycleList === list) return;
          stopCycle(); cycleIdx = 0;
          applyMorph(list[0]);
          if (!reduced) {
            activeCycleList = list;
            activeCycleHold = holdSec;
            cycleClock = 0;
          }
        }
        function applyMorph(key){
          var targetKey = SHAPES[key] ? key : "sculpture";
          if (targetKey === currentKey) return;
          /* 1) Remember original sculpture pose ONLY when leaving it; icon->icon hops keep savedRot intact */
          if (currentKey === "sculpture" && targetKey !== "sculpture") {
            savedRotY = sculpRotY;
            savedRotX = sculpRotX;
          }
          /* 2) Snapshot exact live world-space particle positions (with current target rotation + live gear spin baked in) */
          var cy = Math.cos(activeTargetRotY), sy = Math.sin(activeTargetRotY);
          var cx = Math.cos(activeTargetRotX), sx = Math.sin(activeTargetRotX);
          var isFromCode = (currentKey === "code");
          var isFromSculp = (currentKey === "sculpture");
          var isFromSw = (currentKey === "dom_sw" && swLiveBlend > 0.001);
          var swAng = -tClock * 0.65 * swLiveBlend;
          var cSw = Math.cos(swAng), sSw = Math.sin(swAng);
          for (var i = 0; i < N; i++) {
            var rawT = Math.max(0, Math.min(1, (morphT - seeds[i*3]) / 0.91));
            var u = easeOutF(rawT);
            var wasTargetParked = curTarget[i*4 + 2] < -5.0;
            var wasStartParked = curStart[i*4 + 2] < -5.0;
            var sx0 = curStart[i*4], sy0 = curStart[i*4 + 1], sz0 = wasStartParked ? 0.0 : curStart[i*4 + 2];
            var tx = curTarget[i*4], ty = curTarget[i*4 + 1], tz = (isFromCode || wasTargetParked) ? 0.0 : curTarget[i*4 + 2];
            if (isFromSw && tz > 0.015) {
              var gtx = tx * cSw - ty * sSw;
              ty = tx * sSw + ty * cSw;
              tx = gtx;
            }
            var isLensPt = isFromSculp && i >= SCULP_RING_END && i < SCULP_LENS_END;
            var x1 = isLensPt ? tx : (tx * cy - tz * sy);
            var z1 = isLensPt ? tz : (tx * sy + tz * cy);
            var ry2 = isLensPt ? ty : (ty * cx - z1 * sx);
            var rz2 = isLensPt ? z1 : (ty * sx + z1 * cx);
            curStart[i*4]     = sx0 + (x1  - sx0) * u;
            curStart[i*4 + 1] = sy0 + (ry2 - sy0) * u;
            curStart[i*4 + 2] = (wasTargetParked && u > 0.5) ? -10.0 : (sz0 + (rz2 - sz0) * u);
            curStart[i*4 + 3] = curStart[i*4 + 3] + (curTarget[i*4 + 3] - curStart[i*4 + 3]) * u;
          }
          /* 3) When returning from icons back to original sculpture, resume directly from savedRot */
          if (targetKey === "sculpture") {
            sculpRotY = savedRotY;
            sculpRotX = savedRotX;
          }
          /* 4) Zero out outgoing shape live blends immediately so old vertex-shader animations never deform the incoming aTarget */
          if (targetKey !== "sculpture") defaultBlend = 0;
          if (targetKey !== "pin") flagWaveBlend = 0;
          if (targetKey !== "code") codeLiveBlend = 0;
          if (targetKey.indexOf("status_") !== 0) statusLiveBlend = 0;
          if (targetKey !== "dom_sw") swLiveBlend = 0;
          if (targetKey !== "dom_web") webLiveBlend = 0;
          if (targetKey !== "dom_ai") aiLiveBlend = 0;
          if (targetKey !== "dom_auto") autoLiveBlend = 0;
          if (targetKey !== "edu") eduLiveBlend = 0;
          if (targetKey.indexOf("lang_") !== 0) langLiveBlend = 0;
          curTarget.set(SHAPES[targetKey]);
          gl.bindBuffer(gl.ARRAY_BUFFER, bufStart); gl.bufferSubData(gl.ARRAY_BUFFER, 0, curStart);
          gl.bindBuffer(gl.ARRAY_BUFFER, bufTarget); gl.bufferSubData(gl.ARRAY_BUFFER, 0, curTarget);
          currentKey = targetKey;
          morphT = 0;
          focusAge = 0;
        }
        /* Unified WebGL2 Live Typewriter Controller (same 3,200 particles -> seamless morph in/out + Swiss chamfered wireframe frame + real git session) */
        var codeCtrl = (function(){
          var active = false, runId = 0, lines = [], blinkIv = null, curVis = true, typingNow = false;
          function rnd(a, b){ return a + Math.random() * (b - a); }
          function pushToGl(showCur){
            if (!active || currentKey !== "code") return;
            var buf = buildCodeBuffer(lines, showCur);
            SHAPES.code = buf;
            curTarget.set(buf);
            gl.bindBuffer(gl.ARRAY_BUFFER, bufTarget);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, curTarget);
          }
          function waitMs(ms, id){
            return new Promise(function(res){
              setTimeout(function(){ res(active && id === runId); }, ms);
            });
          }
          function typeCmd(promptTxt, cmd, id){
            var line = { segs: [{ t: promptTxt, fl: false }, { t: "$ ", fl: true }, { t: "", fl: false }] };
            lines.push(line); typingNow = true; curVis = true; pushToGl(true);
            var i = 0;
            function step(){
              if (!active || id !== runId) return Promise.resolve(false);
              if (i >= cmd.length) {
                typingNow = false;
                return waitMs(rnd(180, 300), id);
              }
              var ch = cmd.charAt(i); line.segs[2].t += ch; i++;
              pushToGl(true);
              var d = rnd(42, 92); if (ch === " ") d += rnd(45, 110);
              return waitMs(d, id).then(function(ok){ return ok ? step() : false; });
            }
            return waitMs(rnd(200, 340), id).then(function(ok){ return ok ? step() : false; });
          }
          function outL(txt, isFlame, id, d){
            return waitMs(d != null ? d : rnd(80, 170), id).then(function(ok){
              if (!ok) return false;
              lines.push({ segs: [{ t: txt, fl: !!isFlame }] });
              pushToGl(false);
              return true;
            });
          }
          function progL(id, frames){
            var line = { segs: [{ t: frames[0], fl: false }] };
            lines.push(line); pushToGl(false); var idx = 1;
            function tk(){
              if (!active || id !== runId) return Promise.resolve(false);
              if (idx >= frames.length) return waitMs(120, id);
              line.segs[0].t = frames[idx++]; pushToGl(false);
              return waitMs(rnd(140, 230), id).then(function(ok){ return ok ? tk() : false; });
            }
            return waitMs(rnd(140, 230), id).then(function(ok){ return ok ? tk() : false; });
          }
          function runScript(id){
            var P1 = "~ ", P2 = "~/app ";
            var steps = [
              function(){ return typeCmd(P1, "git clone app && cd app", id); },
              function(){ return outL("Cloning into 'app'...", false, id, 120); },
              function(){ return progL(id, ["Receiving objects:  18% (8/42)","Receiving objects:  62% (26/42)","Receiving objects: 100% (42/42), done."]); },
              function(){ return waitMs(260, id); },
              function(){ return typeCmd(P2, "code .", id); },
              function(){ return waitMs(620, id); },
              function(){ return typeCmd(P2, "git add .", id); },
              function(){ return waitMs(220, id); },
              function(){ return typeCmd(P2, 'git commit -m "feat: ship it"', id); },
              function(){ return outL("[main a1b2c3d] feat: ship it", true, id, 120); },
              function(){ return outL("3 files changed, +128 -12", false, id); },
              function(){ return waitMs(240, id); },
              function(){ return typeCmd(P2, "git push", id); },
              function(){ return progL(id, ["Writing objects:  33% (1/3)","Writing objects:  66% (2/3)","Writing objects: 100% (3/3), done."]); },
              function(){ return outL("a1b2c3d..e4f5g6h main -> main", true, id); },
              function(){ return waitMs(480, id); },
              function(){ return typeCmd(P2, "cd ~", id); },
              function(){ return waitMs(220, id); },
              function(){ return typeCmd(P1, "clear", id); },
              /* Clean instant text clear back at ~ prompt (frame stays intact!) + ~850ms pause */
              function(){ lines = [{ segs: [{ t: P1, fl: false }, { t: "$ ", fl: true }] }]; typingNow = false; pushToGl(true); return waitMs(850, id); },
              function(){ lines = []; return Promise.resolve(true); }
            ];
            var p = Promise.resolve(true);
            for (var s = 0; s < steps.length; s++) (function(fn){ p = p.then(function(ok){ return ok ? fn() : false; }); })(steps[s]);
            p.then(function(ok){ if (ok && active && id === runId) runScript(id); });
          }
          return {
            start: function(){
              if (active) return;
              active = true; runId++; lines = []; typingNow = false; curVis = true;
              if (reduced) {
                lines = [
                  { segs: [{ t: "~ ", fl: false }, { t: "$ ", fl: true }, { t: "git clone app && cd app", fl: false }] },
                  { segs: [{ t: "~/app ", fl: false }, { t: "$ ", fl: true }, { t: "code . && git add .", fl: false }] },
                  { segs: [{ t: "[main a1b2c3d] feat: ship it", fl: true }] },
                  { segs: [{ t: "a1b2c3d..e4f5g6h main -> main", fl: true }] }
                ];
                pushToGl(false); return;
              }
              blinkIv = setInterval(function(){ if (active && !typingNow) { curVis = !curVis; pushToGl(curVis); } }, 520);
              runScript(runId);
            },
            stop: function(){
              active = false; runId++; typingNow = false;
              if (blinkIv) { clearInterval(blinkIv); blinkIv = null; }
            }
          };
        })();

        function enterMorph(k){
          if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
          if (k === "code") { stopCycle(); applyMorph("code"); codeCtrl.start(); return; }
          codeCtrl.stop();
          if (k === "globe") { startCycle(LANG_CYCLE, 1.65); return; }
          if (k === "graph") { startCycle(DOMAIN_CYCLE, 2.0); return; }
          if (k === "check") { stopCycle(); applyMorph("status_open"); return; }
          stopCycle();
          applyMorph(k);
        }
        function scheduleReset(){
          if (leaveTimer) clearTimeout(leaveTimer);
          leaveTimer = setTimeout(function(){ stopCycle(); codeCtrl.stop(); applyMorph("sculpture"); }, 110);
        }

        /* Touch / Tablet tap-to-lock (stays in shifted form until tapping another item or tapping outside) */
        var isCoarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
        var lockedEl = null;
        function clearTouchLock(){
          if (lockedEl) { lockedEl.classList.remove("is-touch-locked"); lockedEl = null; }
        }
        wrap.querySelectorAll("[data-morph]").forEach(function(el){
          var k = el.getAttribute("data-morph");
          el.addEventListener("pointerenter", function(e){
            if (e.pointerType === "touch" || mobilePinActive) return;
            enterMorph(k);
          });
          el.addEventListener("focus", function(){
            if (mobilePinActive) return;
            enterMorph(k);
          });
          el.addEventListener("pointerleave", function(e){
            if (e.pointerType === "touch" || mobilePinActive) return;
            scheduleReset();
          });
          el.addEventListener("blur", function(){
            if (mobilePinActive || lockedEl) return;
            scheduleReset();
          });
          el.addEventListener("click", function(e){
            if (!isCoarse || mobilePinActive) return;
            if (lockedEl === el) {
              if (el.tagName !== "A") { clearTouchLock(); scheduleReset(); }
              return; /* second tap on a link follows navigation cleanly */
            }
            if (el.tagName === "A") e.preventDefault();
            clearTouchLock();
            lockedEl = el;
            el.classList.add("is-touch-locked");
            enterMorph(k);
          });
        });
        document.addEventListener("pointerdown", function(e){
          if (!lockedEl || mobilePinActive) return;
          if (!e.target.closest || !e.target.closest("[data-morph]")) {
            clearTouchLock();
            scheduleReset();
          }
        }, { passive: true });

        /* Mobile (<640px) Scroll-Pinned Horizontal Showcase: keeps #heroMeta (About me + buttons | particle stage) pinned side-by-side while scrolling horizontally from Philosophy -> 6 items below */
        var mobilePinActive = false, pinRunway = null, pinTrack = null, pinDots = [], lastPinIdx = -1;
        var SLIDE_MORPHS = ["sculpture", "pin", "code", "edu", "globe", "graph", "check"];
        var heroMetaEl = document.getElementById("heroMeta");
        var artifactEl = document.getElementById("abArtifact");
        var philEl = document.getElementById("abPhil");
        var ruleEl = document.getElementById("abRule");
        var stripEl = document.getElementById("abStrip");
        var stripItems = stripEl ? Array.prototype.slice.call(stripEl.children) : [];
        function syncMobilePinLayout(){
          var wantMobile = window.innerWidth < 640 && !reduced;
          if (wantMobile && !mobilePinActive && heroMetaEl && artifactEl && philEl && stripEl) {
            mobilePinActive = true; clearTouchLock();
            pinRunway = document.createElement("div"); pinRunway.className = "ab-pin-runway";
            var sticky = document.createElement("div"); sticky.className = "ab-pin-sticky";
            var vp = document.createElement("div"); vp.className = "ab-h-viewport";
            pinTrack = document.createElement("div"); pinTrack.className = "ab-h-track";
            var dotsWrap = document.createElement("div"); dotsWrap.className = "ab-pin-dots"; dotsWrap.setAttribute("aria-hidden", "true");
            pinDots = [];
            var slideEls = [philEl].concat(stripItems);
            for (var si = 0; si < slideEls.length; si++) {
              var sl = document.createElement("div"); sl.className = "ab-h-slide";
              sl.appendChild(slideEls[si]);
              pinTrack.appendChild(sl);
              var dot = document.createElement("i"); if (si === 0) dot.className = "is-on";
              dotsWrap.appendChild(dot); pinDots.push(dot);
            }
            vp.appendChild(pinTrack);
            sticky.appendChild(heroMetaEl); sticky.appendChild(vp); sticky.appendChild(dotsWrap);
            pinRunway.appendChild(sticky);
            if (ruleEl) ruleEl.style.display = "none";
            stripEl.style.display = "none";
            wrap.appendChild(pinRunway);
            lastPinIdx = 0; enterMorph("sculpture");
            resizeGl(); syncMobilePinScroll();
            if (window.ScrollTrigger) ScrollTrigger.refresh();
          } else if (!wantMobile && mobilePinActive) {
            mobilePinActive = false; lastPinIdx = -1;
            if (heroMetaEl) wrap.insertBefore(heroMetaEl, ruleEl || stripEl || null);
            if (artifactEl) artifactEl.appendChild(philEl);
            if (ruleEl) ruleEl.style.display = "";
            if (stripEl) { stripEl.style.display = ""; stripItems.forEach(function(it){ stripEl.appendChild(it); }); }
            if (pinRunway && pinRunway.parentNode) pinRunway.parentNode.removeChild(pinRunway);
            pinRunway = null; pinTrack = null; pinDots = [];
            enterMorph("sculpture"); resizeGl();
            if (window.ScrollTrigger) ScrollTrigger.refresh();
          }
        }
        function syncMobilePinScroll(){
          if (!mobilePinActive || !pinRunway || !pinTrack) return;
          var rc = pinRunway.getBoundingClientRect();
          var maxScroll = Math.max(1, pinRunway.offsetHeight - window.innerHeight);
          var p = Math.max(0, Math.min(1, -rc.top / maxScroll));
          pinTrack.style.transform = "translate3d(" + (-p * (SLIDE_MORPHS.length - 1) * 100).toFixed(3) + "%,0,0)";
          var idx = Math.round(p * (SLIDE_MORPHS.length - 1));
          if (idx !== lastPinIdx) {
            lastPinIdx = idx;
            for (var d = 0; d < pinDots.length; d++) pinDots[d].classList.toggle("is-on", d === idx);
            enterMorph(SLIDE_MORPHS[idx]);
          }
        }
        window.addEventListener("scroll", syncMobilePinScroll, { passive: true });
        window.addEventListener("resize", syncMobilePinLayout, { passive: true });
        syncMobilePinLayout();

        function resizeGl(){
          var rc = stage.getBoundingClientRect();
          var w = Math.max(120, Math.round(rc.width)), h = Math.max(140, Math.round(rc.height));
          aspect = w / h;
          stageScale = Math.min(1.0, Math.max(0.22, (w * h) / (440 * 300)));
          canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
          gl.viewport(0, 0, canvas.width, canvas.height);
        }
        resizeGl();
        window.addEventListener("resize", resizeGl, { passive: true });
        if ("ResizeObserver" in window) { var pro = new ResizeObserver(resizeGl); pro.observe(stage); }
        stage.addEventListener("pointermove", function(e){
          var rc = stage.getBoundingClientRect();
          tiltY = ((e.clientX - rc.left) / Math.max(1, rc.width) - 0.5) * 0.65;
          tiltX = ((e.clientY - rc.top) / Math.max(1, rc.height) - 0.5) * 0.48;
        }, { passive: true });
        stage.addEventListener("pointerleave", function(){ tiltX = 0; tiltY = 0; });
        function updateScroll(){
          var vh = Math.max(1, window.innerHeight);
          var sr = sec.getBoundingClientRect();
          scrollP = Math.max(0, Math.min(1, (vh - sr.top) / Math.max(1, vh + sr.height)));
        }
        window.addEventListener("scroll", updateScroll, { passive: true });
        updateScroll();
        prevScrollP = scrollP;
        if ("IntersectionObserver" in window) {
          var iobs = new IntersectionObserver(function(es){
            inView = es[0].isIntersecting;
            if (inView && !rafId && !reduced) { lastNow = 0; rafId = requestAnimationFrame(render); }
          }, { rootMargin: "80px" });
          iobs.observe(sec);
        }
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        gl.clearColor(0, 0, 0, 0);

        function render(now){
          rafId = 0;
          var dt = lastNow ? Math.min(0.04, (now - lastNow) / 1000) : 0.016;
          lastNow = now || 0;
          if (!reduced) {
            tClock += dt;
            focusAge += dt;
            morphT = Math.min(1.1, morphT + dt * 2.15);
            if (activeCycleList && morphT >= 1.0) {
              cycleClock += dt;
              if (cycleClock >= activeCycleHold) {
                cycleClock = 0;
                cycleIdx = (cycleIdx + 1) % activeCycleList.length;
                applyMorph(activeCycleList[cycleIdx]);
              }
            }
          } else { morphT = 1.1; }
          curTiltX += (tiltX - curTiltX) * Math.min(1, dt * 6);
          curTiltY += (tiltY - curTiltY) * Math.min(1, dt * 6);
          var isDef = currentKey === "sculpture";
          var isCode = currentKey === "code";
          var isStat = currentKey.indexOf("status_") === 0;
          var isLang = currentKey.indexOf("lang_") === 0;
          defaultBlend += ((isDef ? 1 : 0) - defaultBlend) * Math.min(1, dt * 5.5);
          flagWaveBlend += ((currentKey === "pin" ? 1 : 0) - flagWaveBlend) * Math.min(1, dt * 6.0);
          codeLiveBlend += ((isCode ? 1 : 0) - codeLiveBlend) * Math.min(1, dt * 6.0);
          statusLiveBlend += ((isStat ? 1 : 0) - statusLiveBlend) * Math.min(1, dt * 6.0);
          swLiveBlend += ((currentKey === "dom_sw" ? 1 : 0) - swLiveBlend) * Math.min(1, dt * 6.0);
          webLiveBlend += ((currentKey === "dom_web" ? 1 : 0) - webLiveBlend) * Math.min(1, dt * 6.0);
          aiLiveBlend += ((currentKey === "dom_ai" ? 1 : 0) - aiLiveBlend) * Math.min(1, dt * 6.0);
          autoLiveBlend += ((currentKey === "dom_auto" ? 1 : 0) - autoLiveBlend) * Math.min(1, dt * 6.0);
          eduLiveBlend += ((currentKey === "edu" ? 1 : 0) - eduLiveBlend) * Math.min(1, dt * 6.0);
          langLiveBlend += ((isLang ? 1 : 0) - langLiveBlend) * Math.min(1, dt * 6.0);
          var targetLangAlpha = LANG_ALPHA[currentKey] || 0.38;
          langAlphaCur += (targetLangAlpha - langAlphaCur) * Math.min(1, dt * 8.0);
          var dScroll = scrollP - prevScrollP;
          prevScrollP = scrollP;
          if (isDef) {
            sculpRotY += dt * 0.11 + dScroll * 0.70;
            sculpRotX = 0.72 + Math.sin(tClock * 0.28) * 0.05;
            activeTargetRotY = sculpRotY;
            activeTargetRotX = sculpRotX;
          } else if (currentKey === "pin") {
            activeTargetRotY = -0.22 + Math.sin(tClock * 0.55) * 0.08;
            activeTargetRotX = 0.06 + Math.cos(tClock * 0.45) * 0.04;
          } else {
            activeTargetRotY = Math.sin(tClock * 0.65) * 0.11;
            activeTargetRotX = 0.05 + Math.cos(tClock * 0.55) * 0.05;
          }
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.useProgram(prog);
          gl.bindVertexArray(vao);
          gl.uniform1f(uTimeLoc, tClock);
          gl.uniform1f(uMorphLoc, morphT);
          gl.uniform2f(uTargetRotLoc, activeTargetRotY, activeTargetRotX);
          gl.uniform2f(uTiltLoc, curTiltY, curTiltX);
          gl.uniform1f(uAspectLoc, aspect);
          gl.uniform1f(uDprLoc, dpr);
          gl.uniform1f(uDefaultLoc, defaultBlend);
          gl.uniform2f(uLensIdxLoc, isDef ? SCULP_RING_END : -1.0, isDef ? SCULP_LENS_END : -1.0);
          gl.uniform1f(uFlagWaveLoc, flagWaveBlend);
          gl.uniform1f(uCodeLiveLoc, codeLiveBlend);
          gl.uniform1f(uStatusLiveLoc, statusLiveBlend);
          gl.uniform1f(uSwLiveLoc, swLiveBlend);
          gl.uniform1f(uWebLiveLoc, webLiveBlend);
          gl.uniform1f(uAiLiveLoc, aiLiveBlend);
          gl.uniform1f(uAutoLiveLoc, autoLiveBlend);
          gl.uniform1f(uFocusAgeLoc, focusAge);
          gl.uniform1f(uEduLiveLoc, eduLiveBlend);
          gl.uniform1f(uLangLiveLoc, langLiveBlend);
          gl.uniform1f(uLangAlphaLoc, langAlphaCur);
          gl.uniform1f(uStageScaleLoc, stageScale);
          gl.drawArrays(gl.POINTS, 0, N);
          if (inView && !reduced) rafId = requestAnimationFrame(render);
        }
        render(0);
      }
    }
  }
};
})();
