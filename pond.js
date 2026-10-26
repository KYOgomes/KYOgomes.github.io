/* Lago de carpas em ASCII — canvas puro, sem dependências.
   Cada carpa é uma "espinha" de pontos que segue a cabeça; o corpo é
   rasterizado numa grade de células e cada célula vira um quadradinho
   com um caractere. A água é uma simulação de ondas na mesma grade. */
(() => {
  "use strict";

  const canvas = document.getElementById("pond");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const cfg = (window.PORTFOLIO && window.PORTFOLIO.pond) || {};
  const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");

  const TAU = Math.PI * 2;
  const STEP = 1 / 30; // simulação e desenho a 30 fps: mais leve e com cara de retrô
  const WAVE_STEP = 1 / 18;
  const TRAIL_LIFE = 1.2;
  const BITE_LIFE = 0.7;
  const RIPPLE_LIFE = 4;
  const RIPPLE_SPEED = 18; // px/s — bem mais devagar que a onda do clique
  const WAKE_LIFE = 1.4;
  const DEEP = 0.16; // brilho das carpas quando passam por baixo do texto
  const BODY_SEGS = 14;
  const TAIL_SEGS = 3;
  const TAIL_FRAC = TAIL_SEGS / BODY_SEGS;
  const MAX_FISH = 16;
  const MIN_FISH = 1;
  const MAX_PELLETS = 40;
  const BODY_CHARS = "SX%SXS%X";
  const DENSE_CHARS = "8%8X"; // nas partes sombreadas
  // Direção de onde vem a luz (de cima, um pouco da esquerda)
  const LIGHT_X = -0.45, LIGHT_Y = -0.89;
  const INTERACTIVE = "a, button, input, textarea, select, label, [data-koi-ignore]";

  // Índices da paleta: [preenchimento do quadrado | null, cor do caractere]
  const P = { HALO: 0, FIN: 1, WHITE: 2, ORANGE: 3, RED: 4, BLACK: 5, BLUE: 6, GOLD: 7, SHADOW: 8, EYE: 9, WATER: 10, PELLET: 11, BARBEL: 12 };
  const PALETTES = {
    dark: [
      ["#292928", "#3e3d3a"], ["#383736", "#5d5b57"],
      ["#b5b0a7", "#8a857c"], ["#c47b3f", "#93582a"], ["#a5472c", "#76301d"],
      ["#323234", "#6b6b70"], ["#4c536d", "#6e7693"], ["#c4a15c", "#93763d"],
      [null, "#3f3e3b"], ["#151515", "#e6e1d7"], [null, "#5f5d58"], [null, "#cf9f68"], [null, "#9d978c"],
    ],
    light: [
      ["#e2ddd3", "#c3bcae"], ["#d6d0c4", "#b0a99a"],
      ["#d3ccbf", "#a8a092"], ["#d98d4f", "#a8622e"], ["#be5a3c", "#8c3c25"],
      ["#3c3c40", "#7c7c84"], ["#7a8099", "#565c76"], ["#d6b46c", "#a48544"],
      [null, "#cfc8ba"], ["#1d1d1d", "#ffffff"], [null, "#a39b8c"], [null, "#b26d33"], [null, "#857e70"],
    ],
  };

  // Escalação do lago: as primeiras carpas seguem esta ordem (dá para trocar em config.js → pond.varieties).
  // Carpas extras (clicando no contador) sorteiam entre as "normais".
  const LINEUP = cfg.varieties || ["showa", "ogon", "kohaku", "kohaku", "sanke", "tancho", "kohaku", "chagoi", "sanke"];
  const EXTRA = ["kohaku", "kohaku", "sanke", "tancho", "chagoi"];

  // ── utilidades ──────────────────────────────────────────────────────
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const angleDiff = (a, b) => {
    let d = (a - b) % TAU;
    if (d > Math.PI) d -= TAU;
    if (d < -Math.PI) d += TAU;
    return d;
  };
  function hash(x, y, s) {
    let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(s | 0, 1442695041);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }
  function noise(x, y, s) {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash(xi, yi, s), b = hash(xi + 1, yi, s);
    const c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  // Caractere de linha que acompanha uma direção (para anéis de onda e rastros)
  function lineGlyph(dx, dy) {
    let a = Math.atan2(dy, dx);
    if (a < 0) a += Math.PI;
    if (a < Math.PI / 8 || a >= (7 * Math.PI) / 8) return "-";
    if (a < (3 * Math.PI) / 8) return "\\";
    if (a < (5 * Math.PI) / 8) return "|";
    return "/";
  }

  // ── estado ──────────────────────────────────────────────────────────
  let W = 0, H = 0, CELL = 14, cols = 0, rows = 0, prevW = 0, prevH = 0;
  let palette = PALETTES.dark;
  let gridPal, gridChr, gridDim, gridLight, gridDepth, waveCur, wavePrev;
  let fish = [];
  let pellets = [];
  let time = 0, fed = 0;
  const pointer = { x: 0, y: 0, active: false, lastX: 0, lastY: 0 };
  let avoidBoxes = [];
  let trail = [];
  let bites = [];
  let ripples = [];
  let wakes = [];
  let waveAcc = 0;
  const cellBuf = { idx: [], pal: [], chr: [], solid: [], light: [] };
  const projC = {}, projQ = {};

  // ── carpa ───────────────────────────────────────────────────────────
  class Koi {
    constructor(x, y, pattern) {
      const small = W < 640;
      this.lenCells = rand(15, 21) * (small ? 0.8 : 1);
      this.len = this.lenCells * CELL;
      this.maxW = this.len * rand(0.14, 0.155);
      this.seg = this.len / BODY_SEGS;
      this.angle = rand(0, TAU);
      this.baseSpeed = rand(9, 14) * (CELL / 14);
      this.reactAt = 0;
      this.turnRate = 0;
      this.wanderTheta = rand(-1, 1);
      this.atWall = false;
      this.speed = this.baseSpeed;
      this.phase = rand(0, TAU);
      this.tailPhase = rand(0, TAU);
      this.seed = (Math.random() * 1e6) | 0;
      this.depth = rand(0.8, 1); // 1 = rente à superfície; menor = mais fundo e mais apagada
      this.pattern = pattern;
      this.marks = this.makeMarkings();
      this.nextRipple = time + rand(1, 7);
      this.target = null;
      this.pts = [];
      for (let k = 0; k <= BODY_SEGS + TAIL_SEGS; k++) {
        this.pts.push({ x: x - Math.cos(this.angle) * this.seg * k, y: y - Math.sin(this.angle) * this.seg * k });
      }
    }

    // Leva a carpa para a nova tela: posição proporcional e tamanho/velocidade na nova escala
    rescale(sx, sy, k) {
      for (const p of this.pts) { p.x *= sx; p.y *= sy; }
      this.len *= k; this.maxW *= k; this.seg *= k; this.baseSpeed *= k; this.speed *= k;
      for (let i = 1; i < this.pts.length; i++) {
        const a = this.pts[i - 1], b = this.pts[i];
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 1;
        b.x = a.x + (dx / d) * this.seg;
        b.y = a.y + (dy / d) * this.seg;
      }
    }

    /* Movimento por "steering behaviors" (Craig Reynolds, 1999): cada
       comportamento propõe uma direção, elas são somadas com pesos e a
       carpa vira suavemente para a soma, com velocidade angular limitada. */
    update(dt) {
      const head = this.pts[0];
      const fx = Math.cos(this.angle), fy = Math.sin(this.angle);
      let sx = fx, sy = fy; // inércia: continuar em frente
      let maxTurn = 0.55, speedMul = 1, urgent = false, feeding = false, tight = 0.45;

      // Wander: um ponto num círculo à frente da carpa passeia aos poucos (ruído suave, não aleatório puro)
      this.wanderTheta += (noise(time * 0.18, 0.5, this.seed) - 0.5) * 2.4 * dt;
      this.wanderTheta = clamp(this.wanderTheta, -1.3, 1.3);
      sx += Math.cos(this.angle + this.wanderTheta) * 0.8;
      sy += Math.sin(this.angle + this.wanderTheta) * 0.8;

      // Contenção com antecipação: olha um pouco à frente; se esse ponto sai da
      // margem, empurra de volta só no eixo que estourou (reflete, não vai pro centro)
      const look = this.len * 1.3 + this.speed * 2;
      const ax = head.x + fx * look, ay = head.y + fy * look;
      const m = Math.min(W, H) * 0.06;
      const wall = (v, lo, hi) => (v < lo ? (lo - v) / m : v > hi ? -(v - hi) / m : 0);
      const wx = wall(ax, m, W - m), wy = wall(ay, m, H - m);
      if (wx || wy) {
        sx += clamp(wx, -3, 3) * 1.6;
        sy += clamp(wy, -3, 3) * 1.6;
        maxTurn = 0.9;
        // Ao bater na borda, sorteia um novo rumo de passeio para não repetir o mesmo trajeto
        if (!this.atWall) this.wanderTheta = rand(-1.1, 1.1);
        this.atWall = true;
      } else this.atWall = false;

      // Separação: evita encostar no corpo das outras carpas
      for (const o of fish) {
        if (o === this) continue;
        const r = (this.len + o.len) * 0.4;
        for (let k = 0; k < o.pts.length; k += 2) {
          const dx = head.x - o.pts[k].x, dy = head.y - o.pts[k].y;
          const d2 = dx * dx + dy * dy;
          if (d2 > r * r || d2 < 1) continue;
          const d = Math.sqrt(d2);
          sx += (dx / d) * (1 - d / r) * 1.5;
          sy += (dy / d) * (1 - d / r) * 1.5;
        }
      }

      if (!this.target || !pellets.includes(this.target)) {
        this.target = nearestPellet(head.x, head.y, Math.max(W, H) * 0.45);
        if (this.target) this.reactAt = Math.max(this.reactAt, time + rand(0.05, 0.3));
      }
      if (this.target && this.target.landed && time >= this.reactAt) {
        const dx = this.target.x - head.x, dy = this.target.y - head.y;
        const d = Math.hypot(dx, dy) || 1;
        sx += (dx / d) * 2.2; sy += (dy / d) * 2.2;
        // Arrive (Reynolds): dispara de longe e freia perto para não ficar rodeando o grão
        const arrive = clamp(d / (CELL * 16), 0.25, 1); // freia mais cedo, porque chega muito rápido
        maxTurn = 1.8 + (1 - arrive) * 2.2;
        speedMul = 8 * arrive + 0.5; // disparada: sai do passeio lento e corre até o grão
        feeding = true;
        urgent = true;
        if (d < this.len * 0.8) tight = 0.18; // perto do grão pode fazer a curva fechada para abocanhar
        if (d < this.maxW + CELL * 0.8) {
          pellets.splice(pellets.indexOf(this.target), 1);
          this.target = null;
          fed++;
          bites.push({ x: head.x, y: head.y, born: time });
          splash(head.x, head.y, 0.5);
          updateCounter();
        }
      }

      if (pointer.active) {
        const dx = head.x - pointer.x, dy = head.y - pointer.y;
        const d = Math.hypot(dx, dy) || 1;
        const r = this.len * 0.7;
        if (d < r) {
          sx += (dx / d) * 4 * (1 - d / r + 0.3); sy += (dy / d) * 4 * (1 - d / r + 0.3);
          maxTurn = 1.5;
          speedMul = 1.7;
          urgent = true;
        }
      }

      // Velocidade de cruzeiro varia devagar: ora desliza, ora dá umas braçadas
      if (!urgent) speedMul *= 0.7 + 0.6 * noise(time * 0.12, 3.7, this.seed);

      // Raio mínimo de curva proporcional ao corpo: sem isso, nadando devagar ela
      // conseguiria virar quase parada e o corpo se dobraria em U
      const cap = Math.min(maxTurn, Math.max(0.1, this.speed / (this.len * tight)));
      const targetTurn = clamp(angleDiff(Math.atan2(sy, sx), this.angle) * 1.6, -cap, cap);
      this.turnRate += (targetTurn - this.turnRate) * Math.min(1, dt * (urgent ? 2.2 : 1.4));
      this.angle += this.turnRate * dt;
      // Arrancada forte só atrás de ração; fugir do mouse e passear seguem como antes
      this.speed += (this.baseSpeed * speedMul - this.speed) * Math.min(1, dt * (feeding ? 4.5 : urgent ? 1.8 : 0.7));
      const swim = this.speed / this.baseSpeed;
      this.tailPhase += dt * (1.3 + 0.9 * Math.min(swim, 2));

      const heading = this.angle + Math.sin(this.tailPhase) * 0.06;
      head.x += Math.cos(heading) * this.speed * dt;
      head.y += Math.sin(heading) * this.speed * dt;
      for (let k = 1; k < this.pts.length; k++) {
        const a = this.pts[k - 1], b = this.pts[k];
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 1;
        b.x = a.x + (dx / d) * this.seg;
        b.y = a.y + (dy / d) * this.seg;
      }

      // De tempos em tempos a cauda dá um impulso e solta uma única onda lenta,
      // com marquinhas de rastro dos lados (mais frequente quando a carpa acelera)
      if (time >= this.nextRipple) {
        const tail = this.pts[BODY_SEGS];
        ripples.push({ x: tail.x, y: tail.y, born: time, strength: urgent ? 0.95 : 0.75 });
        const nx = -fy, ny = fx, side = this.maxW * 1.5;
        for (const k of [BODY_SEGS - 4, BODY_SEGS]) {
          const p = this.pts[k];
          for (const sg of [-1, 1]) wakes.push({ x: p.x + nx * side * sg, y: p.y + ny * side * sg, born: time, ch: lineGlyph(fx, fy) });
        }
        this.nextRipple = time + (urgent ? rand(1.5, 3) : rand(4, 9));
      }
    }

    // Espinha com a ondulação de nado aplicada (cresce em direção à cauda)
    spine() {
      const out = [];
      const n = this.pts.length;
      const amp = this.maxW * (0.28 + 0.08 * Math.min(2, this.speed / this.baseSpeed));
      for (let k = 0; k < n; k++) {
        const p = this.pts[k];
        const a = this.pts[Math.max(0, k - 1)], b = this.pts[Math.min(n - 1, k + 1)];
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 1;
        const s = k / BODY_SEGS;
        const off = amp * Math.pow(Math.min(s, 1.3), 1.8) * Math.sin(this.tailPhase - s * 3.2);
        out.push({ x: p.x - (dy / d) * off, y: p.y + (dx / d) * off });
      }
      return out;
    }

    // Contorno visto de cima: cabeça cheia e arredondada, ombros largos, pedúnculo fino
    width(s) {
      if (s < 0.16) return this.maxW * (0.28 + 0.72 * Math.pow(Math.sin((s / 0.16) * (Math.PI / 2)), 0.6));
      if (s < 0.35) return this.maxW;
      const u = (s - 0.35) / 0.65;
      return this.maxW * (0.16 + 0.84 * Math.pow(1 - u, 1.15));
    }

    /* Manchas fixas no corpo (elipses em coordenadas do corpo), sorteadas uma vez
       por carpa: assim o desenho não "escorre" enquanto ela nada.
       s = 0 focinho … 1 base da cauda; v = -1 … 1 de um lado ao outro. */
    makeMarkings() {
      const red = [], black = [], white = [];
      const saddles = (n) => {
        for (let j = 0; j < n; j++) {
          red.push({ s: 0.3 + j * (0.45 / n) + rand(-0.03, 0.03), v: rand(-0.35, 0.35), rs: rand(0.07, 0.11), rv: rand(0.7, 1.2) });
        }
      };
      switch (this.pattern) {
        case "kohaku":
          if (Math.random() < 0.8) red.push({ s: 0.1, v: rand(-0.15, 0.15), rs: rand(0.06, 0.1), rv: rand(0.7, 1.1) });
          saddles(2 + ((Math.random() * 2) | 0));
          break;
        case "sanke":
          red.push({ s: 0.1, v: 0, rs: 0.08, rv: 0.9 });
          saddles(2);
          for (let j = 0; j < 4; j++) black.push({ s: rand(0.3, 0.85), v: rand(-0.7, 0.7), rs: 0.035, rv: 0.28 });
          break;
        case "showa": // fundo preto, cabeça e selas vermelhas, algumas áreas brancas
          red.push({ s: 0.11, v: rand(-0.2, 0.2), rs: 0.08, rv: 0.9 });
          red.push({ s: rand(0.38, 0.5), v: rand(-0.4, 0.4), rs: 0.07, rv: 0.6 });
          if (Math.random() < 0.6) red.push({ s: rand(0.62, 0.72), v: rand(-0.4, 0.4), rs: 0.05, rv: 0.5 });
          white.push({ s: rand(0.04, 0.08), v: rand(-0.5, 0.5), rs: 0.05, rv: 0.5 });
          for (let j = 0; j < 2; j++) white.push({ s: rand(0.3, 0.75), v: rand(-0.6, 0.6), rs: rand(0.05, 0.08), rv: rand(0.4, 0.7) });
          break;
        case "tancho":
          red.push({ s: 0.1, v: 0, rs: 0.055, rv: 0.55 });
          break;
        case "chagoi":
          for (let j = 0; j < 2; j++) white.push({ s: rand(0.25, 0.8), v: rand(-0.5, 0.5), rs: rand(0.06, 0.1), rv: rand(0.5, 0.9) });
          break;
      }
      return { red, black, white };
    }

    colorAt(s, v) {
      const wob = (noise(s * 14, v * 2.5, this.seed) - 0.5) * 0.7; // borda orgânica, mas fixa
      const hit = (list) => {
        for (const m of list) {
          const k = ((s - m.s) / m.rs) ** 2 + ((v - m.v) / m.rv) ** 2;
          if (k < 1 + wob) return k;
        }
        return -1;
      };
      const { red, black, white } = this.marks;
      if (this.pattern === "showa") {
        const k = hit(red);
        if (k >= 0) return k < 0.8 ? P.RED : P.ORANGE;
        return hit(white) >= 0 ? P.WHITE : P.BLACK;
      }
      if (hit(black) >= 0) return P.BLACK;
      switch (this.pattern) {
        case "ogon": return Math.abs(v) > 0.8 ? P.ORANGE : P.GOLD;
        case "chagoi": return hit(white) >= 0 ? P.WHITE : P.ORANGE;
        case "asagi": return Math.abs(v) < 0.45 ? P.BLUE : s < 0.2 ? P.WHITE : P.ORANGE;
      }
      const k = hit(red);
      if (k >= 0) return k < 0.45 ? P.RED : P.ORANGE; // miolo ferrugem, borda laranja
      return P.WHITE;
    }

    // 0 = água, 1 = corpo, 2 = nadadeira
    classify(s, dist, cross, flap) {
      if (s < 0) return 0;
      if (s <= 1) {
        const w = this.width(s);
        if (dist <= w) return 1;
        const out = dist - w;
        // Nadadeiras peitorais (grandes) e pélvicas (pequenas), inclinadas para trás
        const pc = 0.22 + (out / this.len) * 1.2, pv = 0.56 + (out / this.len) * 0.9;
        const pect = Math.max(0, 1 - Math.abs(s - pc) / 0.085) * this.maxW * 1.3 * flap;
        const pelv = Math.max(0, 1 - Math.abs(s - pv) / 0.05) * this.maxW * 0.7 * flap;
        return out < pect || out < pelv ? 2 : 0;
      }
      // Cauda em leque, menor, com um corte em V na ponta
      const u = (s - 1) / TAIL_FRAC;
      if (u >= 1) return 0;
      const tw = this.maxW * (0.16 + 0.72 * u);
      const notch = u > 0.7 && Math.abs(cross) < this.maxW * 0.45 * ((u - 0.7) / 0.3);
      return dist <= tw && !notch ? 2 : 0;
    }

    // Ponto mais próximo na espinha. `hint` limita a busca aos segmentos vizinhos
    project(R, px, py, hint, out) {
      const nSeg = R.length - 1;
      const i0 = hint < 0 ? 0 : Math.max(0, hint - 2), i1 = hint < 0 ? nSeg - 1 : Math.min(nSeg - 1, hint + 2);
      let best = Infinity, bi = 0, bt = 0;
      for (let i = i0; i <= i1; i++) {
        const ax = R[i].x, ay = R[i].y;
        const dx = R[i + 1].x - ax, dy = R[i + 1].y - ay;
        const l2 = dx * dx + dy * dy || 1;
        let t = ((px - ax) * dx + (py - ay) * dy) / l2;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        const qx = ax + dx * t - px, qy = ay + dy * t - py;
        const d2 = qx * qx + qy * qy;
        if (d2 < best) { best = d2; bi = i; bt = t; }
      }
      const sdx = R[bi + 1].x - R[bi].x, sdy = R[bi + 1].y - R[bi].y;
      const sl = Math.hypot(sdx, sdy) || 1;
      out.tx = sdx / sl; out.ty = sdy / sl;
      out.bi = bi;
      out.dist = Math.sqrt(best);
      out.cross = (sdx * (py - R[bi].y) - sdy * (px - R[bi].x)) / sl;
      // Antes do focinho o "s" fica negativo (para os bigodes não virarem cabeça)
      const ahead = bi === 0 && bt === 0 ? -(((px - R[0].x) * sdx + (py - R[0].y) * sdy) / sl) : 0;
      out.s = ahead > this.maxW * 0.55 ? -1 : (bi + bt) / BODY_SEGS;
    }

    /* Escreve as células desta carpa em cellBuf. Cada célula é testada em 4 pontos
       (supersampling 2x2) e vira corpo só se a maioria cair dentro: o contorno fica
       estável enquanto a carpa nada, sem "piscar" quadradinhos na borda. */
    raster() {
      const R = this.spine();
      cellBuf.idx.length = cellBuf.pal.length = cellBuf.chr.length = cellBuf.solid.length = cellBuf.light.length = 0;

      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const p of R) {
        if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
      }
      const pad = this.maxW * 2.4 + CELL * 1.5;
      const c0 = Math.max(0, Math.floor((minX - pad) / CELL)), c1 = Math.min(cols - 1, Math.floor((maxX + pad) / CELL));
      const r0 = Math.max(0, Math.floor((minY - pad) / CELL)), r1 = Math.min(rows - 1, Math.floor((maxY + pad) / CELL));
      if (c0 > c1 || r0 > r1) return R;

      const flap = 0.85 + 0.15 * Math.sin(this.tailPhase * 0.6 + 1);
      const halo = CELL * 0.95;
      const reach = this.maxW * 2.2 + CELL;
      const c = projC, q = projQ, off = CELL * 0.25;

      for (let cy = r0; cy <= r1; cy++) {
        for (let cx = c0; cx <= c1; cx++) {
          const px = (cx + 0.5) * CELL, py = (cy + 0.5) * CELL;
          this.project(R, px, py, -1, c);
          if (c.dist > reach) continue;

          let body = 0, fin = 0;
          for (let k = 0; k < 4; k++) {
            this.project(R, px + (k & 1 ? off : -off), py + (k & 2 ? off : -off), c.bi, q);
            const t = this.classify(q.s, q.dist, q.cross, flap);
            if (t === 1) body++; else if (t === 2) fin++;
          }

          // Normal do lado do corpo onde o ponto está (para luz e para os raios das nadadeiras)
          const side = c.cross >= 0 ? 1 : -1;
          const nx = -c.ty * side, ny = c.tx * side;

          let pal = -1, chr = " ", solid = false, light = 1;
          if (body >= 2) {
            pal = this.colorAt(Math.max(0, c.s), clamp(c.cross / this.maxW, -1.2, 1.2));
            // Volume: centro iluminado, bordas na sombra, luz vindo de cima
            const e = clamp(c.dist / (this.width(clamp(c.s, 0, 1)) || 1), 0, 1);
            const lit = (nx * LIGHT_X + ny * LIGHT_Y) * e;
            light = 1.06 - 0.26 * e * e + 0.14 * lit;
            // Brilho molhado: uma faixa mais clara ao longo das costas, do lado iluminado
            if (e < 0.35 && c.s > 0.12 && c.s < 0.7 && lit > -0.05) light += 0.08;
            if (pal === P.BLACK) light = Math.max(light, 1); // o preto já é escuro: sombrear faria a showa sumir no fundo
            if (body < 4) { light *= 0.9; chr = "."; }
            else {
              const h = hash(cx, cy, this.seed);
              chr = light < 0.86 ? DENSE_CHARS[(h * DENSE_CHARS.length) | 0] : BODY_CHARS[(h * BODY_CHARS.length) | 0];
            }
            solid = true;
          } else if (body + fin >= 2) {
            // Nadadeiras: raios finos na direção da membrana (cauda abre em leque; laterais vão para fora e para trás)
            pal = P.FIN; solid = true; light = 0.95;
            let rx, ry;
            if (c.s > 1) { const k = clamp(Math.abs(c.cross) / this.maxW, 0, 1) * 0.9; rx = c.tx + nx * k; ry = c.ty + ny * k; }
            else { rx = c.tx * 0.55 + nx; ry = c.ty * 0.55 + ny; }
            chr = hash(cx, cy, 7) > 0.55 ? lineGlyph(rx, ry) : hash(cx, cy, 9) > 0.6 ? "." : " ";
          } else if (body + fin > 0 || (c.s >= 0 && c.s <= 1 && c.dist <= this.width(c.s) + halo)) {
            pal = P.HALO; chr = hash(cx, cy, 3) > 0.55 ? "." : " ";
          }
          if (pal >= 0) {
            cellBuf.idx.push(cy * cols + cx); cellBuf.pal.push(pal); cellBuf.chr.push(chr); cellBuf.solid.push(solid); cellBuf.light.push(light);
          }
        }
      }
      return R;
    }

    // Olhos e bigodinhos (barbilhões): pontos fixos na cabeça, desenhados por cima
    face(R) {
      const a = R[0], b = R[2];
      const dx = b.x - a.x, dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 1;
      const fx = -dx / d, fy = -dy / d; // para a frente
      const nx = -fy, ny = fx;
      const out = [];
      const eyeAlong = 0.08 * this.len, eyeSide = this.width(0.08) * 0.62;
      const mouthSide = this.width(0) * 0.45;
      for (const sg of [-1, 1]) {
        out.push({ x: a.x - fx * eyeAlong + nx * eyeSide * sg, y: a.y - fy * eyeAlong + ny * eyeSide * sg, pal: P.EYE, ch: "o" });
        // Bigode sai do canto da boca, para a frente e para fora
        const wx = fx * 0.75 + nx * 0.66 * sg, wy = fy * 0.75 + ny * 0.66 * sg;
        const mx = a.x + nx * mouthSide * sg, my = a.y + ny * mouthSide * sg;
        const ch = lineGlyph(wx, wy);
        const n = this.lenCells > 17 ? 2 : 1;
        for (let k = 1; k <= n; k++) {
          out.push({ x: mx + wx * CELL * (0.5 + k * 0.9), y: my + wy * CELL * (0.5 + k * 0.9), pal: P.BARBEL, ch, soft: true });
        }
      }
      return out;
    }
  }

  // ── água ────────────────────────────────────────────────────────────
  function cellIndex(x, y) {
    const c = Math.floor(x / CELL), r = Math.floor(y / CELL);
    if (c < 0 || r < 0 || c >= cols || r >= rows) return -1;
    return r * cols + c;
  }

  function disturb(x, y, amount) {
    const i = cellIndex(x, y);
    if (i >= 0) waveCur[i] += amount;
  }

  // Impulso circular: o "plof" de algo caindo na água
  function splash(x, y, strength) {
    const cx = Math.floor(x / CELL), cy = Math.floor(y / CELL);
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const c = cx + dx, r = cy + dy;
        if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
        const f = Math.max(0, 1 - Math.hypot(dx, dy) / 1.8);
        waveCur[r * cols + c] -= strength * f;
      }
    }
  }

  // Equação de onda discreta (dois buffers) com amortecimento
  function stepWaves() {
    const damp = 0.94; // mais amortecido = anéis menores e mais discretos
    for (let r = 1; r < rows - 1; r++) {
      for (let c = 1; c < cols - 1; c++) {
        const i = r * cols + c;
        wavePrev[i] = ((waveCur[i - 1] + waveCur[i + 1] + waveCur[i - cols] + waveCur[i + cols]) * 0.5 - wavePrev[i]) * damp;
      }
    }
    const t = waveCur; waveCur = wavePrev; wavePrev = t;
  }

  // ── comida ──────────────────────────────────────────────────────────
  function feed(x, y) {
    splash(x, y, 1.6);
    const n = Math.min(5 + ((Math.random() * 3) | 0), MAX_PELLETS - pellets.length);
    for (let k = 0; k < n; k++) {
      const a = rand(0, TAU), r = Math.sqrt(Math.random()) * CELL * 5;
      pellets.push({ x: x + Math.cos(a) * r * 1.3, y: y + Math.sin(a) * r, born: time, landAt: rand(0.2, 0.9), landed: false, vx: Math.cos(a) * rand(2, 6), vy: Math.sin(a) * rand(2, 6) });
    }
  }

  function nearestPellet(x, y, range) {
    let best = null, bd = range;
    for (const p of pellets) {
      const d = Math.hypot(p.x - x, p.y - y);
      if (d < bd) { bd = d; best = p; }
    }
    return best;
  }

  function stepPellets(dt) {
    for (let k = pellets.length - 1; k >= 0; k--) {
      const p = pellets[k];
      const age = time - p.born;
      if (age > 22) { pellets.splice(k, 1); continue; }
      if (!p.landed) {
        if (age >= p.landAt) {
          p.landed = true;
          splash(p.x, p.y, 0.7);
          const range = Math.max(W, H) * 0.55;
          for (const f of fish) {
            // Cada carpa vai atrás do grão mais próximo dela
            const d = Math.hypot(f.pts[0].x - p.x, f.pts[0].y - p.y);
            if (d > range) continue;
            const cur = f.target && pellets.includes(f.target) ? Math.hypot(f.pts[0].x - f.target.x, f.pts[0].y - f.target.y) : Infinity;
            if (d < cur) {
              if (cur === Infinity) f.reactAt = time + rand(0.05, 0.3); // cada uma percebe num momento diferente
              f.target = p;
            }
          }
        }
        continue;
      }
      p.vx *= 0.995; p.vy *= 0.995;
      p.x += p.vx * dt; p.y += p.vy * dt;
    }
  }

  // ── conteúdo por cima do lago ───────────────────────────────────────
  function measureContent() {
    avoidBoxes = Array.from(document.querySelectorAll("[data-koi-avoid]"), (el) => el.getBoundingClientRect())
      .filter((b) => b.width > 0 && b.bottom > 0 && b.top < H)
      .map((b) => ({ left: b.left - 12, top: b.top - 8, right: b.right + 12, bottom: b.bottom + 8 }));
    gridDim.fill(1);
    const fade = CELL * 3;
    for (const b of avoidBoxes) {
      const c0 = Math.max(0, Math.floor((b.left - fade) / CELL)), c1 = Math.min(cols - 1, Math.floor((b.right + fade) / CELL));
      const r0 = Math.max(0, Math.floor((b.top - fade) / CELL)), r1 = Math.min(rows - 1, Math.floor((b.bottom + fade) / CELL));
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const x = (c + 0.5) * CELL, y = (r + 0.5) * CELL;
          const dx = Math.max(b.left - x, 0, x - b.right), dy = Math.max(b.top - y, 0, y - b.bottom);
          const k = Math.min(1, Math.hypot(dx, dy) / fade);
          const i = r * cols + c;
          gridDim[i] = Math.min(gridDim[i], DEEP + (1 - DEEP) * k * k);
        }
      }
    }
  }

  // ── desenho ─────────────────────────────────────────────────────────
  function render() {
    gridPal.fill(-1);
    // As mais fundas são desenhadas primeiro, para as da superfície passarem por cima
    const order = fish.slice().sort((a, b) => a.depth - b.depth);
    const rasters = [];
    for (const f of order) {
      const R = f.raster();
      rasters.push({ f, R, idx: cellBuf.idx.slice(), pal: cellBuf.pal.slice(), chr: cellBuf.chr.slice(), solid: cellBuf.solid.slice(), light: cellBuf.light.slice() });
    }
    // Sombras primeiro (deslocadas para baixo/direita), depois os corpos por cima
    for (const r of rasters) {
      for (let k = 0; k < r.idx.length; k++) {
        if (!r.solid[k]) continue;
        const i = r.idx[k] + cols * 1 + 2;
        if (i < gridPal.length && (i % cols) > 1 && gridPal[i] < 0) { gridPal[i] = P.SHADOW; gridChr[i] = ":"; gridLight[i] = 1; gridDepth[i] = 1; }
      }
    }
    for (const r of rasters) {
      const depth = r.f.depth;
      for (let k = 0; k < r.idx.length; k++) {
        const i = r.idx[k];
        gridPal[i] = r.pal[k]; gridChr[i] = r.chr[k]; gridLight[i] = r.light[k]; gridDepth[i] = depth;
      }
      for (const e of r.f.face(r.R)) {
        const i = cellIndex(e.x, e.y);
        if (i < 0 || (e.soft && gridPal[i] >= 0 && gridPal[i] !== P.HALO && gridPal[i] !== P.SHADOW)) continue;
        gridPal[i] = e.pal; gridChr[i] = e.ch; gridLight[i] = 1; gridDepth[i] = depth;
      }
    }

    ctx.clearRect(0, 0, W, H);
    ctx.font = `500 ${Math.round(CELL * 0.8)}px "JetBrains Mono", ui-monospace, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Água: anéis desenhados com o caractere tangente à onda
    const water = palette[P.WATER][1];
    ctx.fillStyle = water;
    for (let r = 1; r < rows - 1; r++) {
      for (let c = 1; c < cols - 1; c++) {
        const i = r * cols + c;
        const h = waveCur[i];
        const a = Math.abs(h);
        if (a < 0.08 || gridPal[i] >= 0) continue;
        const gx = waveCur[i + 1] - waveCur[i - 1], gy = waveCur[i + cols] - waveCur[i - cols];
        ctx.globalAlpha = Math.min(1, a * 1.6) * 0.75 * gridDim[i];
        ctx.fillText(a < 0.16 ? "." : lineGlyph(-gy, gx), c * CELL + CELL / 2, r * CELL + CELL / 2 + 1);
      }
    }

    // Anéis da cauda: borda com o caractere tangente ao círculo e um anel de pontinhos dentro
    ctx.fillStyle = water;
    for (const rp of ripples) {
      const age = time - rp.born;
      const fade = Math.pow(1 - age / RIPPLE_LIFE, 1.3) * rp.strength;
      for (let ring = 0; ring < 2; ring++) {
        const R = Math.max(0, age - ring * 0.6) * RIPPLE_SPEED;
        if (R < CELL) continue;
        const band = CELL * 0.55;
        const c0 = Math.max(0, Math.floor((rp.x - R - CELL) / CELL)), c1 = Math.min(cols - 1, Math.floor((rp.x + R + CELL) / CELL));
        const r0 = Math.max(0, Math.floor((rp.y - R - CELL) / CELL)), r1 = Math.min(rows - 1, Math.floor((rp.y + R + CELL) / CELL));
        for (let r = r0; r <= r1; r++) {
          for (let c = c0; c <= c1; c++) {
            const i = r * cols + c;
            if (gridPal[i] >= 0) continue;
            const dx = (c + 0.5) * CELL - rp.x, dy = (r + 0.5) * CELL - rp.y;
            if (Math.abs(Math.hypot(dx, dy) - R) > band) continue;
            ctx.globalAlpha = fade * (ring ? 0.55 : 1) * gridDim[i];
            ctx.fillText(ring ? "." : lineGlyph(-dy, dx), c * CELL + CELL / 2, r * CELL + CELL / 2 + 1);
          }
        }
      }
    }
    for (const w of wakes) {
      const i = cellIndex(w.x, w.y);
      if (i < 0 || gridPal[i] >= 0) continue;
      ctx.globalAlpha = (1 - (time - w.born) / WAKE_LIFE) * 0.6 * gridDim[i];
      ctx.fillText(w.ch, (i % cols) * CELL + CELL / 2, ((i / cols) | 0) * CELL + CELL / 2 + 1);
    }

    // Rastro do arraste: ~ que vira - e depois . enquanto some
    ctx.fillStyle = palette[P.PELLET][1];
    for (const t of trail) {
      const i = cellIndex(t.x, t.y);
      if (i < 0 || gridPal[i] >= 0) continue;
      const k = (time - t.born) / TRAIL_LIFE;
      ctx.globalAlpha = (1 - k) * 0.85 * gridDim[i];
      ctx.fillText(k < 0.35 ? "~" : k < 0.7 ? "-" : ".", (i % cols) * CELL + CELL / 2, ((i / cols) | 0) * CELL + CELL / 2 + 1);
    }

    // Ração: cai (' .), aterrissa como o e afunda
    ctx.fillStyle = palette[P.PELLET][1];
    for (const p of pellets) {
      const age = time - p.born;
      const fall = Math.min(1, age / p.landAt);
      const i = cellIndex(p.x, p.y - (1 - fall) * CELL * 1.5);
      if (i < 0 || gridPal[i] >= 0) continue;
      const sink = Math.max(0, (age - 16) / 6);
      ctx.globalAlpha = (p.landed ? 0.85 + 0.15 * Math.sin(age * 1.8 + p.x) : 0.6) * (1 - sink * 0.8);
      ctx.fillText(!p.landed ? (fall < 0.5 ? "'" : ".") : sink > 0.5 ? "." : "o", (i % cols) * CELL + CELL / 2, ((i / cols) | 0) * CELL + CELL / 2 + 1);
    }

    // Carpas
    for (let i = 0; i < gridPal.length; i++) {
      const p = gridPal[i];
      if (p < 0) continue;
      const x = (i % cols) * CELL, y = ((i / cols) | 0) * CELL;
      const L = p === P.SHADOW ? 1 : gridLight[i];
      ctx.globalAlpha = gridDim[i] * (p === P.SHADOW ? 1 : 0.4 + 0.6 * gridDepth[i]);
      if (palette[p][0]) { ctx.fillStyle = shade(p, 0, L); ctx.fillRect(x + 1, y + 1, CELL - 1, CELL - 1); }
      const ch = gridChr[i];
      if (ch !== " ") { ctx.fillStyle = shade(p, 1, L); ctx.fillText(ch, x + CELL / 2, y + CELL / 2 + 1); }
    }
    // Mordida: * que vira + e depois . na boca da carpa (desenhado por cima)
    ctx.fillStyle = palette[P.PELLET][1];
    for (const b of bites) {
      const i = cellIndex(b.x, b.y);
      if (i < 0) continue;
      const k = (time - b.born) / BITE_LIFE;
      ctx.globalAlpha = 1 - k * k;
      ctx.fillText(k < 0.35 ? "*" : k < 0.7 ? "+" : ".", (i % cols) * CELL + CELL / 2, ((i / cols) | 0) * CELL + CELL / 2 + 1);
    }
    ctx.globalAlpha = 1;
  }

  // ── ciclo ───────────────────────────────────────────────────────────
  function step(dt) {
    time += dt;
    for (const f of fish) f.update(dt);
    stepPellets(dt);
    // As ondas andam a 18 passos/s (mais devagar que o desenho): propagação mais calma
    waveAcc += dt;
    while (waveAcc >= WAVE_STEP) { stepWaves(); waveAcc -= WAVE_STEP; }
    trail = trail.filter((t) => time - t.born < TRAIL_LIFE);
    bites = bites.filter((b) => time - b.born < BITE_LIFE);
    ripples = ripples.filter((r) => time - r.born < RIPPLE_LIFE);
    wakes = wakes.filter((w) => time - w.born < WAKE_LIFE);
  }

  let last = 0, acc = 0, frames = 0, raf = 0;
  function frame(now) {
    acc += Math.min(0.25, (now - last) / 1000);
    last = now;
    if (acc >= STEP) {
      while (acc >= STEP) { step(STEP); acc -= STEP; }
      if (++frames % 15 === 0) measureContent();
      render();
    }
    raf = requestAnimationFrame(frame);
  }

  function start() {
    cancelAnimationFrame(raf);
    if (motionQuery.matches) {
      // Movimento reduzido: deixa as carpas se espalharem e congela um quadro
      for (let i = 0; i < 120; i++) step(STEP);
      measureContent();
      render();
      return;
    }
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function spawnFish() {
    if (fish.length >= MAX_FISH) return;
    const n = fish.length;
    const pattern = n < LINEUP.length ? LINEUP[n] : EXTRA[(Math.random() * EXTRA.length) | 0];
    fish.push(new Koi(rand(W * 0.05, W * 0.95), rand(H * 0.05, H * 0.95), pattern));
    updateCounter();
  }

  // Tira a última carpa que entrou (a escalação do começo, como a showa, fica): ela mergulha com um "plof"
  function removeFish() {
    if (fish.length <= MIN_FISH) return;
    const f = fish.pop();
    splash(f.pts[0].x, f.pts[0].y, 1.2);
    ripples.push({ x: f.pts[BODY_SEGS >> 1].x, y: f.pts[BODY_SEGS >> 1].y, born: time, strength: 0.9 });
    updateCounter();
    if (motionQuery.matches) render();
  }

  function updateCounter() {
    const k = document.getElementById("koi-count"), f = document.getElementById("koi-fed");
    if (k) k.textContent = fish.length;
    if (f) f.textContent = fed;
    const minus = document.getElementById("koi-minus"), plus = document.getElementById("koi-plus");
    if (minus) minus.disabled = fish.length <= MIN_FISH;
    if (plus) plus.disabled = fish.length >= MAX_FISH;
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // O "pixel" do lago acompanha a largura da tela (cellSize vale para uma tela de 1440 px).
    // Assim, com zoom ou em telas grandes/pequenas, o lago mantém a mesma composição.
    const oldW = prevW, oldH = prevH, oldCell = CELL;
    CELL = clamp(Math.round((cfg.cellSize || 14) * (W / 1440)), 10, 40);
    prevW = W; prevH = H;
    cols = Math.ceil(W / CELL);
    rows = Math.ceil(H / CELL);
    gridPal = new Int8Array(cols * rows);
    gridChr = new Array(cols * rows).fill(" ");
    gridDim = new Float32Array(cols * rows).fill(1);
    gridLight = new Float32Array(cols * rows).fill(1);
    gridDepth = new Float32Array(cols * rows).fill(1);
    waveCur = new Float32Array(cols * rows);
    wavePrev = new Float32Array(cols * rows);

    const target = cfg.fishCount || clamp(Math.round((cols * rows) / 1000), 3, 7);
    if (fish.length === 0) {
      for (let i = 0; i < target; i++) spawnFish();
    } else if (oldW) {
      // Redimensionou (ou mudou o zoom): reposiciona e reescala as carpas em vez de recriá-las
      const sx = W / oldW, sy = H / oldH, k = CELL / oldCell;
      for (const f of fish) f.rescale(sx, sy, k);
      for (const p of pellets) { p.x *= sx; p.y *= sy; }
      ripples = []; wakes = []; trail = [];
    }
    measureContent();
    updateCounter();
    if (motionQuery.matches) render();
  }

  /* Sombreamento: mistura a cor da célula com o fundo (sombra) ou com branco
     (brilho) conforme a luz L. As cores ficam em cache, em 24 níveis. */
  const BG = { dark: [27, 27, 26], light: [241, 237, 228] };
  let bgRgb = BG.dark, shadeCache = new Map();
  const toRgb = (hex) => [1, 3, 5].map((k) => parseInt(hex.slice(k, k + 2), 16));
  function shade(p, which, L) {
    const level = clamp(Math.round(L * 16), 0, 23);
    const key = p * 64 + which * 32 + level;
    let c = shadeCache.get(key);
    if (c) return c;
    const base = toRgb(palette[p][which]);
    const l = level / 16;
    const mix = l <= 1
      ? base.map((v, k) => v + (bgRgb[k] - v) * (1 - l) * (which ? 0.45 : 0.6))
      : base.map((v) => v + (255 - v) * (l - 1) * 0.55);
    c = `rgb(${mix.map((v) => Math.round(v)).join(",")})`;
    shadeCache.set(key, c);
    return c;
  }

  function applyTheme() {
    const theme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    palette = PALETTES[theme];
    bgRgb = BG[theme];
    shadeCache = new Map();
    if (motionQuery.matches) render();
  }

  // ── eventos ─────────────────────────────────────────────────────────
  window.addEventListener("resize", resize);
  window.addEventListener("scroll", () => measureContent(), { passive: true });
  window.addEventListener("themechange", applyTheme);
  motionQuery.addEventListener("change", start);

  // Segurar e arrastar no lago deixa um rastro na água (em texto, o arraste continua selecionando)
  const TEXTUAL = "p, h1, h2, h3, li, dt, dd";
  let drag = null;
  window.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || e.pointerType === "touch") return;
    if (e.composedPath().some((n) => n instanceof Element && n.matches(INTERACTIVE + ", " + TEXTUAL))) return;
    e.preventDefault(); // evita selecionar texto enquanto arrasta
    drag = { x: e.clientX, y: e.clientY, dist: 0 };
  });
  window.addEventListener("pointerup", () => { if (drag) setTimeout(() => (drag = null)); });

  function dragTo(x, y) {
    const dx = x - drag.x, dy = y - drag.y;
    const d = Math.hypot(dx, dy);
    const step = CELL * 0.7;
    if (d < step) return;
    // Preenche o caminho entre dois eventos para o rastro não ficar pontilhado
    for (let s = step; s <= d; s += step) {
      const px = drag.x + (dx * s) / d, py = drag.y + (dy * s) / d;
      disturb(px, py, 0.32);
      if (trail.length < 220) trail.push({ x: px + rand(-2, 2), y: py + rand(-2, 2), born: time });
    }
    drag.dist += d;
    drag.x = x; drag.y = y;
  }

  window.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true;
    if (drag && e.buttons & 1) dragTo(e.clientX, e.clientY);
    else {
      // Só passar o cursor mexe a água bem de leve
      const moved = Math.hypot(pointer.x - pointer.lastX, pointer.y - pointer.lastY);
      if (moved > 4) disturb(pointer.x, pointer.y, Math.min(0.25, moved * 0.006));
    }
    pointer.lastX = pointer.x; pointer.lastY = pointer.y;
  }, { passive: true });
  document.documentElement.addEventListener("pointerleave", () => (pointer.active = false));
  window.addEventListener("blur", () => (pointer.active = false));

  // Clique no "lago" (fora de links/botões e sem texto selecionado): onda + ração
  window.addEventListener("click", (e) => {
    if (e.composedPath().some((n) => n instanceof Element && n.matches(INTERACTIVE))) return;
    if (String(window.getSelection() || "")) return;
    if (drag && drag.dist > 10) return; // foi um arraste, não um clique
    feed(e.clientX, e.clientY);
    if (motionQuery.matches) render();
  });

  const plusBtn = document.getElementById("koi-plus"), minusBtn = document.getElementById("koi-minus");
  if (plusBtn) plusBtn.addEventListener("click", () => { spawnFish(); if (motionQuery.matches) render(); });
  if (minusBtn) minusBtn.addEventListener("click", removeFish);

  applyTheme();
  resize();
  start();
})();
