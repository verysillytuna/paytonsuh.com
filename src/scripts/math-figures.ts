// Canvas renderers for the per-page mathematical figures.
// Each renderer is a factory returning a frame function drawn on a cleared canvas (CSS pixel coordinates).

type Colors = { fg: string; muted: string; rule: string; accent: string; accent2: string; earth: string };
type Frame = (ctx: CanvasRenderingContext2D, w: number, h: number, c: Colors) => void;
type Factory = () => Frame;

const TAU = Math.PI * 2;

function gaussian() {
  // Box–Muller
  return Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(TAU * Math.random());
}

function withAlpha(color: string, a: number) {
  // Colors come from CSS as hex (#rrggbb); fall back to globalAlpha-free string otherwise.
  const m = /^#([0-9a-f]{6})$/i.exec(color.trim());
  if (!m) return color;
  const n = parseInt(m[1], 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
}

// Lorenz system, two trajectories from initial conditions 10⁻⁵ apart: sensitive dependence made visible.
const lorenz: Factory = () => {
  const s = 10, r = 28, b = 8 / 3, dt = 0.004, max = 2200;
  const paths = [
    { p: [1, 1, 1], trail: [] as number[][] },
    { p: [1.00001, 1, 1], trail: [] as number[][] },
  ];
  const f = ([x, y, z]: number[]) => [s * (y - x), x * (r - z) - y, x * y - b * z];
  const step = (p: number[]) => {
    // RK4
    const k1 = f(p);
    const k2 = f(p.map((v, i) => v + (dt / 2) * k1[i]));
    const k3 = f(p.map((v, i) => v + (dt / 2) * k2[i]));
    const k4 = f(p.map((v, i) => v + dt * k3[i]));
    return p.map((v, i) => v + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
  };
  // Start on the attractor with some history already drawn, the second path displaced by 10⁻⁵.
  let p0 = [1, 1, 1];
  for (let i = 0; i < 3000; i++) p0 = step(p0);
  paths[0].p = p0;
  paths[1].p = [p0[0] + 1e-5, p0[1], p0[2]];
  for (const path of paths) for (let i = 0; i < 800; i++) path.trail.push((path.p = step(path.p)));
  let theta = 0;
  return (ctx, w, h, c) => {
    theta += 0.002;
    for (const path of paths) {
      for (let i = 0; i < 5; i++) {
        path.p = step(path.p);
        path.trail.push(path.p);
      }
      if (path.trail.length > max) path.trail.splice(0, path.trail.length - max);
    }
    const scale = (h - 16) / 50;
    const cos = Math.cos(theta), sin = Math.sin(theta);
    const proj = ([x, y, z]: number[]) => [w / 2 + (x * cos - y * sin) * scale, h - 8 - z * scale];
    paths.forEach((path, k) => {
      const color = k === 0 ? c.accent : c.accent2;
      const n = path.trail.length;
      const chunk = 100;
      for (let start = 0; start < n - 1; start += chunk) {
        ctx.strokeStyle = withAlpha(color, (0.08 + 0.75 * (start / n)) * (k === 0 ? 1 : 0.8));
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = start; i <= Math.min(start + chunk, n - 1); i++) {
          const [px, py] = proj(path.trail[i]);
          i === start ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
      const [hx, hy] = proj(path.p);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(hx, hy, 2.2, 0, TAU);
      ctx.fill();
    });
  };
};

// Sample paths of standard Brownian motion against the ±2√t envelope.
const brownian: Factory = () => {
  const N = 6, steps = 600;
  let paths: number[][] = [];
  let shown = 0, hold = 0;
  const reset = () => {
    paths = Array.from({ length: N }, () => {
      const p = [0];
      for (let i = 1; i <= steps; i++) p.push(p[i - 1] + gaussian() / Math.sqrt(steps));
      return p;
    });
    shown = 0;
    hold = 0;
  };
  reset();
  return (ctx, w, h, c) => {
    if (shown < steps) shown = Math.min(steps, shown + 3);
    else if (++hold > 140) reset();
    const x0 = 6, sx = (w - 12) / steps, mid = h / 2, sy = (h / 2 - 8) / 2.6;
    // axis and envelope y = ±2√t
    ctx.strokeStyle = c.rule;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x0, mid);
    ctx.lineTo(w - 6, mid);
    ctx.stroke();
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = c.muted;
    for (const sign of [1, -1]) {
      ctx.beginPath();
      for (let i = 0; i <= steps; i += 4) {
        const y = mid - sign * 2 * Math.sqrt(i / steps) * sy;
        i === 0 ? ctx.moveTo(x0, y) : ctx.lineTo(x0 + i * sx, y);
      }
      ctx.stroke();
    }
    ctx.setLineDash([]);
    paths.forEach((p, k) => {
      ctx.strokeStyle = k === 0 ? c.accent : withAlpha(c.accent2, 0.45);
      ctx.lineWidth = k === 0 ? 1.4 : 1;
      ctx.beginPath();
      for (let i = 0; i <= shown; i++) {
        const y = mid - p[i] * sy;
        i === 0 ? ctx.moveTo(x0, y) : ctx.lineTo(x0 + i * sx, y);
      }
      ctx.stroke();
    });
  };
};

// Partial sums of the Fourier series of a square wave, drawn by epicycles.
const fourier: Factory = () => {
  const terms = [1, 3, 5, 7, 9, 11, 13];
  let t = 0;
  const wave: number[] = [];
  return (ctx, w, h, c) => {
    t += 0.018;
    const R = h * 0.3;
    let x = R * 1.35 + 6, y = h / 2;
    ctx.lineWidth = 1;
    for (const n of terms) {
      const r = (4 / (n * Math.PI)) * R;
      const nx = x + r * Math.cos(n * t), ny = y - r * Math.sin(n * t);
      ctx.strokeStyle = withAlpha(c.muted, 0.45);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.stroke();
      ctx.strokeStyle = c.earth;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(nx, ny);
      ctx.stroke();
      x = nx;
      y = ny;
    }
    const startX = R * 2.9 + 16;
    wave.unshift(y);
    if (wave.length > w - startX) wave.pop();
    ctx.strokeStyle = withAlpha(c.muted, 0.7);
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(startX, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    wave.forEach((v, i) => (i === 0 ? ctx.moveTo(startX + i, v) : ctx.lineTo(startX + i, v)));
    ctx.stroke();
  };
};

// A (2, 3) torus knot (the trefoil) winding around a slowly turning torus.
const torus: Factory = () => {
  const p = 2, q = 3;
  let spin = 0, drawn = 0;
  const N = 600;
  return (ctx, w, h, c) => {
    spin += 0.006;
    drawn = Math.min(N, drawn + 2);
    const R = h * 0.3, a = h * 0.13, tilt = 1.1;
    const cs = Math.cos(spin), ss = Math.sin(spin), ct = Math.cos(tilt), st = Math.sin(tilt);
    const pt = (u: number, v: number) => {
      // u: around the core circle, v: around the tube
      const r = R + a * Math.cos(v);
      let X = r * Math.cos(u), Y = r * Math.sin(u), Z = a * Math.sin(v);
      [X, Y] = [X * cs - Y * ss, X * ss + Y * cs];
      [Y, Z] = [Y * ct - Z * st, Y * st + Z * ct];
      return [w / 2 + X, h / 2 + Y, Z];
    };
    ctx.lineWidth = 1;
    ctx.strokeStyle = withAlpha(c.accent2, 0.3);
    for (let i = 0; i < 24; i++) {
      const u = (i / 24) * TAU;
      ctx.beginPath();
      for (let j = 0; j <= 32; j++) {
        const [x, y] = pt(u, (j / 32) * TAU);
        j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    for (const v of [0, Math.PI]) {
      ctx.beginPath();
      for (let j = 0; j <= 64; j++) {
        const [x, y] = pt((j / 64) * TAU, v);
        j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.lineWidth = 2;
    let prev = pt(0, 0);
    for (let i = 1; i <= drawn; i++) {
      const s = (i / N) * TAU;
      const cur = pt(p * s, q * s);
      ctx.strokeStyle = withAlpha(c.accent, 0.35 + 0.65 * ((cur[2] / a + 1) / 2));
      ctx.beginPath();
      ctx.moveTo(prev[0], prev[1]);
      ctx.lineTo(cur[0], cur[1]);
      ctx.stroke();
      prev = cur;
    }
  };
};

// One-point perspective: parallel lines on a plane meet at a point on the horizon.
const perspective: Factory = () => {
  let z = 0;
  return (ctx, w, h, c) => {
    z = (z + 0.01) % 1;
    const hy = h * 0.32, vx = w / 2, f = h - hy;
    ctx.lineWidth = 1;
    ctx.strokeStyle = c.rule;
    ctx.beginPath();
    ctx.moveTo(0, hy);
    ctx.lineTo(w, hy);
    ctx.stroke();
    const n = 14;
    for (let i = -n; i <= n; i++) {
      const bx = vx + (i / n) * w * 1.6;
      ctx.strokeStyle = withAlpha(c.accent2, i === 0 ? 0.6 : 0.3);
      ctx.beginPath();
      ctx.moveTo(vx, hy);
      ctx.lineTo(bx, h);
      ctx.stroke();
    }
    for (let k = 0; k < 18; k++) {
      const depth = k + 1 - z; // rows approach the viewer
      const y = hy + f / depth;
      if (y > h) continue;
      ctx.strokeStyle = withAlpha(c.accent, Math.min(0.8, 0.9 / depth));
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.fillStyle = c.accent;
    ctx.beginPath();
    ctx.arc(vx, hy, 2.5, 0, TAU);
    ctx.fill();
  };
};


// Rock-salt (NaCl-type) lattice of ZrC, slowly rotating; some carbon sites blink out as vacancies.
const lattice: Factory = () => {
  const n = 4; // sites per edge
  type Site = { p: number[]; zr: boolean; phase: number; vacancy: boolean };
  const sites: Site[] = [];
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      for (let k = 0; k < n; k++) {
        const zr = (i + j + k) % 2 === 0;
        sites.push({
          p: [i - (n - 1) / 2, j - (n - 1) / 2, k - (n - 1) / 2],
          zr,
          phase: Math.random() * TAU,
          vacancy: !zr && Math.random() < 0.22,
        });
      }
  const bonds: [number, number][] = [];
  sites.forEach((a, i) =>
    sites.forEach((b, j) => {
      if (j > i && Math.hypot(a.p[0] - b.p[0], a.p[1] - b.p[1], a.p[2] - b.p[2]) < 1.01) bonds.push([i, j]);
    }),
  );
  let t = 0;
  return (ctx, w, h, c) => {
    t += 0.01;
    const ay = t * 0.5, ax = 0.45 + 0.15 * Math.sin(t * 0.3);
    const cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax);
    const unit = h / 5.2, cam = 7;
    const proj = sites.map(({ p: [x, y, z] }) => {
      [x, z] = [x * cy + z * sy, -x * sy + z * cy];
      [y, z] = [y * cx - z * sx, y * sx + z * cx];
      const s = cam / (cam - z);
      return { x: w / 2 + x * unit * s, y: h / 2 + y * unit * s, z, s };
    });
    ctx.lineWidth = 1;
    for (const [i, j] of bonds) {
      const a = proj[i], b = proj[j];
      ctx.strokeStyle = withAlpha(c.muted, 0.12 + 0.12 * ((a.z + b.z) / 4 + 0.5));
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
    const order = proj.map((_, i) => i).sort((a, b) => proj[a].z - proj[b].z);
    for (const i of order) {
      const site = sites[i], q = proj[i];
      const depth = 0.45 + 0.55 * ((q.z + 2) / 4);
      const r = (site.zr ? 6.5 : 4) * q.s;
      if (site.vacancy) {
        const on = 0.5 + 0.5 * Math.sin(t * 2 + site.phase); // 1 = atom present, 0 = vacancy
        ctx.setLineDash([2, 2]);
        ctx.strokeStyle = withAlpha(c.accent, 0.6 * depth);
        ctx.beginPath();
        ctx.arc(q.x, q.y, r, 0, TAU);
        ctx.stroke();
        ctx.setLineDash([]);
        if (on < 0.35) {
          // a trapped hydrogen atom sits in the empty site
          ctx.fillStyle = withAlpha(c.earth, depth * (1 - on / 0.35));
          ctx.beginPath();
          ctx.arc(q.x, q.y, 2 * q.s, 0, TAU);
          ctx.fill();
        }
        ctx.fillStyle = withAlpha(c.accent, on * depth);
      } else {
        ctx.fillStyle = withAlpha(site.zr ? c.accent2 : c.accent, depth);
      }
      ctx.beginPath();
      ctx.arc(q.x, q.y, r, 0, TAU);
      ctx.fill();
    }
  };
};

// A Cartesian grid inside the unit disk carried by the disk automorphism z ↦ (z − a)/(1 − āz), a circling.
const conformal: Factory = () => {
  let t = 0;
  const lines: [number, number][][] = [];
  const m = 9, samples = 80;
  for (let k = 1; k < m; k++) {
    const u = -1 + (2 * k) / m;
    const half = Math.sqrt(Math.max(0, 1 - u * u)) * 0.999;
    const h: [number, number][] = [], v: [number, number][] = [];
    for (let i = 0; i <= samples; i++) {
      const s = -half + (2 * half * i) / samples;
      h.push([s, u]);
      v.push([u, s]);
    }
    lines.push(h, v);
  }
  const mobius = ([x, y]: [number, number], ax: number, ay: number): [number, number] => {
    // (z − a) / (1 − conj(a) z)
    const nx = x - ax, ny = y - ay;
    const dx = 1 - (ax * x + ay * y), dy = -(ax * y - ay * x);
    const d = dx * dx + dy * dy;
    return [(nx * dx + ny * dy) / d, (ny * dx - nx * dy) / d];
  };
  return (ctx, w, h, c) => {
    t += 0.006;
    const rad = 0.55 * (0.5 + 0.5 * Math.sin(t * 0.7));
    const ax = rad * Math.cos(t), ay = rad * Math.sin(t);
    const R = h / 2 - 8;
    const panels = [w / 2 - R * 1.25, w / 2 + R * 1.25];
    for (const [pi, cx] of panels.entries()) {
      ctx.strokeStyle = c.rule;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, h / 2, R, 0, TAU);
      ctx.stroke();
      lines.forEach((line, li) => {
        ctx.strokeStyle = withAlpha(li % 2 ? c.accent : c.accent2, pi === 0 ? 0.35 : 0.8);
        ctx.beginPath();
        line.forEach((z, i) => {
          const [x, y] = pi === 0 ? z : mobius(z, ax, ay);
          i === 0 ? ctx.moveTo(cx + x * R, h / 2 - y * R) : ctx.lineTo(cx + x * R, h / 2 - y * R);
        });
        ctx.stroke();
      });
    }
    // arrow between panels
    const y = h / 2, x0 = panels[0] + R + 8, x1 = panels[1] - R - 8;
    if (x1 - x0 > 16) {
      ctx.strokeStyle = c.muted;
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.lineTo(x1, y);
      ctx.lineTo(x1 - 5, y - 4);
      ctx.moveTo(x1, y);
      ctx.lineTo(x1 - 5, y + 4);
      ctx.stroke();
    }
    ctx.fillStyle = c.earth;
    ctx.beginPath();
    ctx.arc(panels[0] + ax * R, h / 2 - ay * R, 3, 0, TAU);
    ctx.fill();
  };
};

// Phase flow of the pendulum θ'' = −sin θ: particles drift along level sets of the energy.
const flow: Factory = () => {
  const N = 260, trail = 14;
  type P = { x: number; y: number; hist: number[][]; age: number };
  const spawn = (): P => ({ x: (Math.random() * 2 - 1) * 1.5 * Math.PI, y: (Math.random() * 2 - 1) * 2.6, hist: [], age: 0 });
  const ps = Array.from({ length: N }, () => {
    const p = spawn();
    p.age = Math.floor(Math.random() * 300);
    return p;
  });
  return (ctx, w, h, c) => {
    const sx = w / (3 * Math.PI), sy = h / 6;
    const dt = 0.02;
    ctx.lineWidth = 1.2;
    for (const p of ps) {
      for (let k = 0; k < 2; k++) {
        // symplectic Euler keeps orbits closed
        p.y -= Math.sin(p.x) * dt;
        p.x += p.y * dt;
      }
      if (p.x > 1.5 * Math.PI) p.x -= 3 * Math.PI;
      if (p.x < -1.5 * Math.PI) p.x += 3 * Math.PI;
      const px = w / 2 + p.x * sx, py = h / 2 - p.y * sy;
      const last = p.hist[p.hist.length - 1];
      if (last && Math.abs(last[0] - px) > w / 2) p.hist = []; // wrapped around
      p.hist.push([px, py]);
      if (p.hist.length > trail) p.hist.shift();
      if (++p.age > 400) Object.assign(p, spawn());
      const energy = p.y * p.y / 2 - Math.cos(p.x); // < 1: libration, > 1: rotation
      const color = energy < 1 ? c.accent2 : c.accent;
      for (let i = 1; i < p.hist.length; i++) {
        ctx.strokeStyle = withAlpha(color, (i / p.hist.length) * 0.55);
        ctx.beginPath();
        ctx.moveTo(p.hist[i - 1][0], p.hist[i - 1][1]);
        ctx.lineTo(p.hist[i][0], p.hist[i][1]);
        ctx.stroke();
      }
    }
  };
};

// Möbius strip: a normal vector carried once around the core comes back pointing the other way.
const mobius: Factory = () => {
  let t = 0;
  return (ctx, w, h, c) => {
    t += 0.008;
    const R = h * 0.3, half = h * 0.12, rot = t * 0.4, tilt = 1.05;
    const cr = Math.cos(rot), sr = Math.sin(rot), ct = Math.cos(tilt), st = Math.sin(tilt);
    const P = (u: number, v: number) => {
      // u ∈ [0, 2π) around the core, v ∈ [−1, 1] across the band
      let X = (R + v * half * Math.cos(u / 2)) * Math.cos(u);
      let Y = (R + v * half * Math.cos(u / 2)) * Math.sin(u);
      let Z = v * half * Math.sin(u / 2);
      [X, Y] = [X * cr - Y * sr, X * sr + Y * cr];
      [Y, Z] = [Y * ct - Z * st, Y * st + Z * ct];
      return [w / 2 + X, h / 2 + Y, Z];
    };
    const U = 90, V = 6;
    // quads sorted back to front
    const quads: { z: number; pts: number[][]; band: number }[] = [];
    for (let i = 0; i < U; i++)
      for (let j = 0; j < V; j++) {
        const u0 = (i / U) * TAU, u1 = ((i + 1) / U) * TAU, v0 = -1 + (2 * j) / V, v1 = -1 + (2 * (j + 1)) / V;
        const pts = [P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)];
        quads.push({ z: pts.reduce((a, p) => a + p[2], 0) / 4, pts, band: j });
      }
    quads.sort((a, b) => a.z - b.z);
    for (const q of quads) {
      const shade = 0.25 + 0.5 * ((q.z / half + 1) / 2);
      ctx.fillStyle = withAlpha(q.band % 2 ? c.accent2 : c.muted, shade * 0.55);
      ctx.strokeStyle = withAlpha(c.accent2, 0.35);
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      q.pts.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    // the travelling normal: one lap flips it, two laps restore it
    const u = (t * 0.9) % (2 * TAU);
    const [bx, by] = P(u, 0);
    const [tx, ty] = P(u, 0.95);
    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(tx, ty);
    ctx.stroke();
    ctx.fillStyle = c.accent;
    ctx.beginPath();
    ctx.arc(tx, ty, 3, 0, TAU);
    ctx.fill();
  };
};

// Hopf fibration: fibres over a circle of latitude on S², stereographically projected to ℝ³ as linked circles.
const hopf: Factory = () => {
  let t = 0;
  const fibre = (a: number, b: number, cc: number, s: number) => {
    const k = 1 / Math.sqrt(2 * (1 + cc));
    const x1 = k * (1 + cc) * Math.cos(s), x2 = k * (a * Math.sin(s) - b * Math.cos(s));
    const x3 = k * (a * Math.cos(s) + b * Math.sin(s)), x4 = k * (1 + cc) * Math.sin(s);
    return [x1 / (1 - x4), x2 / (1 - x4), x3 / (1 - x4)];
  };
  return (ctx, w, h, c) => {
    t += 0.005;
    const lat = 0.35 * Math.sin(t * 0.8);
    const scale = h * 0.17, cs = Math.cos(t * 0.6), ss = Math.sin(t * 0.6), tl = 0.5;
    const ct = Math.cos(tl), st = Math.sin(tl);
    const n = 14;
    for (let k = 0; k < n; k++) {
      const phi = (k / n) * TAU + t * 0.4;
      const cc = lat, r = Math.sqrt(1 - cc * cc);
      const a = r * Math.cos(phi), b = r * Math.sin(phi);
      ctx.strokeStyle = withAlpha(k % 2 ? c.accent : c.accent2, 0.75);
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      for (let i = 0; i <= 120; i++) {
        let [X, Y, Z] = fibre(a, b, cc, (i / 120) * TAU);
        if (!isFinite(X) || Math.hypot(X, Y, Z) > 8) {
          ctx.stroke();
          ctx.beginPath();
          continue;
        }
        [X, Z] = [X * cs + Z * ss, -X * ss + Z * cs];
        [Y, Z] = [Y * ct - Z * st, Y * st + Z * ct];
        const px = w / 2 + X * scale, py = h / 2 + Y * scale;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.stroke();
    }
  };
};

// Geometric Brownian motion dS = μS dt + σS dW, with the lognormal law of S_T building up on the right.
const gbm: Factory = () => {
  const mu = 0.06, sigma = 0.32, steps = 250, dt = 1 / steps, bins = 36, sMax = 3;
  const hist = new Array(bins).fill(0);
  let path: number[] = [1], done = 0, total = 0;
  const finished: number[][] = [];
  return (ctx, w, h, c) => {
    for (let k = 0; k < 6; k++) {
      const S = path[path.length - 1];
      path.push(S * Math.exp((mu - sigma * sigma / 2) * dt + sigma * Math.sqrt(dt) * gaussian()));
      if (path.length > steps) {
        const ST = path[path.length - 1];
        hist[Math.min(bins - 1, Math.floor((ST / sMax) * bins))]++;
        total++;
        finished.push(path);
        if (finished.length > 14) finished.shift();
        path = [1];
        done++;
      }
    }
    const plotW = w * 0.72, x0 = 6, top = 8, bot = h - 8;
    const yOf = (S: number) => bot - (Math.min(S, sMax) / sMax) * (bot - top);
    ctx.strokeStyle = c.rule;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x0, yOf(1));
    ctx.lineTo(x0 + plotW, yOf(1));
    ctx.stroke();
    const draw = (p: number[], color: string, lw: number) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = lw;
      ctx.beginPath();
      p.forEach((S, i) => (i ? ctx.lineTo(x0 + (i / steps) * plotW, yOf(S)) : ctx.moveTo(x0, yOf(S))));
      ctx.stroke();
    };
    finished.forEach((p) => draw(p, withAlpha(c.accent2, 0.28), 1));
    draw(path, c.accent, 1.5);
    // histogram of S_T
    const hx = x0 + plotW + 10, maxBin = Math.max(1, ...hist), hw = w - hx - 6;
    ctx.fillStyle = withAlpha(c.accent, 0.55);
    hist.forEach((n, i) => {
      const y1 = yOf((i / bins) * sMax), y2 = yOf(((i + 1) / bins) * sMax);
      ctx.fillRect(hx, y2, (n / maxBin) * hw, Math.max(1, y1 - y2 - 1));
    });
    // lognormal density for comparison
    ctx.strokeStyle = c.earth;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    const m = mu - sigma * sigma / 2;
    let peak = 0;
    const dens = (S: number) => Math.exp(-((Math.log(S) - m) ** 2) / (2 * sigma * sigma)) / (S * sigma * Math.sqrt(TAU));
    for (let i = 1; i <= 100; i++) peak = Math.max(peak, dens((i / 100) * sMax));
    for (let i = 1; i <= 100; i++) {
      const S = (i / 100) * sMax;
      const x = hx + (dens(S) / peak) * hw * 0.98, y = yOf(S);
      i === 1 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    if (total > 30) ctx.stroke();
    void done;
  };
};

// Quadratic variation: Σ (ΔW)² over finer and finer partitions of [0, t] converges to t.
const qv: Factory = () => {
  const N = 1024;
  let W: number[] = [], level = 2, hold = 0;
  const reset = () => {
    W = [0];
    for (let i = 1; i <= N; i++) W.push(W[i - 1] + gaussian() / Math.sqrt(N));
    level = 2;
    hold = 0;
  };
  reset();
  return (ctx, w, h, c) => {
    if (++hold % 45 === 0) {
      if (level < N) level *= 2;
      else if (hold > 45 * 12) reset();
    }
    const x0 = 6, pw = w - 12, midTop = h * 0.28, s = h * 0.14;
    // the path, sampled on the current partition
    ctx.strokeStyle = withAlpha(c.accent2, 0.35);
    ctx.lineWidth = 1;
    ctx.beginPath();
    W.forEach((v, i) => (i ? ctx.lineTo(x0 + (i / N) * pw, midTop - v * s) : ctx.moveTo(x0, midTop)));
    ctx.stroke();
    const stride = N / level;
    ctx.strokeStyle = c.accent2;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    for (let k = 0; k <= level; k++) {
      const i = k * stride, x = x0 + (i / N) * pw, y = midTop - W[i] * s;
      k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();
    // running sum of squared increments vs. the line y = t
    const base = h - 8, top = h * 0.52;
    const yOf = (v: number) => base - v * (base - top);
    ctx.strokeStyle = c.rule;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(x0, yOf(0));
    ctx.lineTo(x0 + pw, yOf(1));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    let q = 0;
    ctx.moveTo(x0, yOf(0));
    for (let k = 1; k <= level; k++) {
      const d = W[k * stride] - W[(k - 1) * stride];
      q += d * d;
      ctx.lineTo(x0 + (k / level) * pw, yOf(Math.min(q, 1.6)));
    }
    ctx.stroke();
    ctx.fillStyle = c.muted;
    ctx.font = 'italic 12px "EB Garamond", serif';
    ctx.fillText(`n = ${level}`, x0 + pw - 52, top - 4);
  };
};

// Shared 3D helpers: rotate about y then x, then a light perspective projection.
function makeView(w: number, h: number, scale: number, yaw: number, pitch: number) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cx = Math.cos(pitch), sx = Math.sin(pitch);
  return ([x, y, z]: number[]) => {
    [x, z] = [x * cy + z * sy, -x * sy + z * cy];
    [y, z] = [y * cx - z * sx, y * sx + z * cx];
    const k = 4 / (4 - z);
    return [w / 2 + x * scale * k, h / 2 - y * scale * k, z];
  };
}

// Hairy ball theorem: a tangent field on S² (here combed along meridians and twisted) must vanish somewhere.
const hairyball: Factory = () => {
  const pts: number[][] = [];
  const N = 320;
  for (let i = 0; i < N; i++) {
    // Fibonacci sphere
    const z = 1 - (2 * (i + 0.5)) / N, r = Math.sqrt(1 - z * z), phi = i * Math.PI * (3 - Math.sqrt(5));
    pts.push([r * Math.cos(phi), z, r * Math.sin(phi)]);
  }
  let t = 0;
  return (ctx, w, h, c) => {
    t += 0.008;
    const R = h * 0.36, view = makeView(w, h, R, t * 0.5, 0.35 + 0.15 * Math.sin(t * 0.4));
    const twist = 0.9 * Math.sin(t * 0.6); // blend between combing along meridians and around latitudes
    ctx.strokeStyle = withAlpha(c.muted, 0.35);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, R * (4 / 4), 0, TAU);
    ctx.stroke();
    const field = ([x, y, z]: number[]) => {
      // north pole is +y. e_theta points "south", e_phi points "east"; both scaled by r so the field vanishes at the poles
      const r = Math.hypot(x, z);
      if (r < 1e-6) return [0, 0, 0];
      const eth = [(y * x) / r, -r, (y * z) / r], eph = [-z / r, 0, x / r];
      const a = Math.cos(twist), b = Math.sin(twist);
      return eth.map((v, i) => r * (a * v + b * eph[i]));
    };
    const hairs = pts.map((p) => {
      const v = field(p), L = 0.22;
      const q = p.map((pi, i) => pi + L * v[i]), n = Math.hypot(...q);
      const mid = p.map((pi, i) => pi + 0.5 * L * v[i]), nm = Math.hypot(...mid);
      return { a: view(p), m: view(mid.map((x) => x / nm)), b: view(q.map((x) => x / n)) };
    });
    hairs.sort((u, v) => u.a[2] - v.a[2]);
    for (const { a, m, b } of hairs) {
      const front = (a[2] + 1) / 2;
      ctx.strokeStyle = withAlpha(c.accent2, 0.15 + 0.7 * front);
      ctx.lineWidth = 0.6 + 0.9 * front;
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.quadraticCurveTo(m[0], m[1], b[0], b[1]);
      ctx.stroke();
    }
    for (const pole of [[0, 1, 0], [0, -1, 0]]) {
      const [px, py, pz] = view(pole);
      const glow = 3 + 1.5 * Math.sin(t * 4);
      ctx.fillStyle = withAlpha(c.accent, pz > 0 ? 1 : 0.35);
      ctx.beginPath();
      ctx.arc(px, py, glow, 0, TAU);
      ctx.fill();
    }
  };
};

// A closed cone and the round sphere are the same space: radially push the cone's surface out to S².
const conesphere: Factory = () => {
  const apex = 1, base = -0.7, baseR = 0.95;
  const insideCone = (x: number, y: number, z: number) =>
    y >= base && y <= apex && Math.hypot(x, z) <= (baseR * (apex - y)) / (apex - base);
  const coneRadius = (u: number[]) => {
    // distance along direction u from the centroid-ish origin to the cone boundary (bisection)
    let lo = 0, hi = 2;
    for (let i = 0; i < 28; i++) {
      const mid = (lo + hi) / 2;
      insideCone(u[0] * mid, u[1] * mid - 0.05, u[2] * mid) ? (lo = mid) : (hi = mid);
    }
    return lo;
  };
  const lat = 13, lon = 20, seg = 48;
  const dirs = (th: number, ph: number) => [Math.sin(th) * Math.cos(ph), Math.cos(th), Math.sin(th) * Math.sin(ph)];
  const cache = new Map<string, number>();
  const rc = (th: number, ph: number) => {
    const key = `${th.toFixed(4)},${ph.toFixed(4)}`;
    let v = cache.get(key);
    if (v === undefined) cache.set(key, (v = coneRadius(dirs(th, ph))));
    return v;
  };
  let t = 0;
  return (ctx, w, h, c) => {
    t += 0.01;
    const s = 0.5 - 0.5 * Math.cos(t * 0.7);
    const lam = s * s * (3 - 2 * s); // smoothstep
    const view = makeView(w, h, h * 0.38, t * 0.45, 0.3);
    const P = (th: number, ph: number) => {
      const r = (1 - lam) * rc(th, ph) + lam * 0.85;
      const d = dirs(th, ph);
      return view([d[0] * r, d[1] * r - (1 - lam) * 0.05, d[2] * r]);
    };
    const curve = (pts: number[][], color: string) => {
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i], depth = ((a[2] + b[2]) / 2 + 1) / 2;
        ctx.strokeStyle = withAlpha(color, 0.12 + 0.75 * depth);
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
      }
    };
    ctx.lineWidth = 1;
    for (let i = 1; i < lat; i++) {
      const th = (i / lat) * Math.PI;
      curve(Array.from({ length: seg + 1 }, (_, k) => P(th, (k / seg) * TAU)), c.accent2);
    }
    for (let j = 0; j < lon; j++) {
      const ph = (j / lon) * TAU;
      curve(Array.from({ length: seg + 1 }, (_, k) => P((k / seg) * Math.PI, ph)), c.accent);
    }
    ctx.font = 'italic 14px "EB Garamond", serif';
    ctx.fillStyle = withAlpha(c.fg, 0.25 + 0.75 * (1 - lam));
    ctx.fillText('cone', 8, h - 10);
    ctx.fillStyle = c.muted;
    ctx.fillText('≅', 40, h - 10);
    ctx.fillStyle = withAlpha(c.fg, 0.25 + 0.75 * lam);
    ctx.fillText('sphere', 56, h - 10);
  };
};

// Monte Carlo estimate of π: uniform points in the unit square, counted inside the quarter disc.
const montecarlo: Factory = () => {
  const max = 5000;
  let pts: [number, number, boolean][] = [], inside = 0, hold = 0;
  const history: number[] = [];
  return (ctx, w, h, c) => {
    if (pts.length < max) {
      for (let i = 0; i < 12; i++) {
        const x = Math.random(), y = Math.random(), inn = x * x + y * y <= 1;
        pts.push([x, y, inn]);
        if (inn) inside++;
      }
      history.push((4 * inside) / pts.length);
    } else if (++hold > 150) {
      pts = [];
      inside = 0;
      hold = 0;
      history.length = 0;
    }
    const S = h - 16, x0 = 8, y0 = 8;
    ctx.strokeStyle = c.rule;
    ctx.lineWidth = 1;
    ctx.strokeRect(x0, y0, S, S);
    ctx.beginPath();
    ctx.arc(x0, y0 + S, S, -Math.PI / 2, 0);
    ctx.strokeStyle = c.muted;
    ctx.stroke();
    for (const [x, y, inn] of pts) {
      ctx.fillStyle = inn ? withAlpha(c.accent, 0.7) : withAlpha(c.accent2, 0.6);
      ctx.fillRect(x0 + x * S - 0.75, y0 + S - y * S - 0.75, 1.5, 1.5);
    }
    // convergence of the estimate toward π
    const px = x0 + S + 18, pw = w - px - 8;
    if (pw < 40) return;
    const yOf = (v: number) => y0 + S / 2 - (v - Math.PI) * (S / 1.2);
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = c.muted;
    ctx.beginPath();
    ctx.moveTo(px, yOf(Math.PI));
    ctx.lineTo(px + pw, yOf(Math.PI));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    history.forEach((v, i) => {
      const x = px + (i / (max / 12)) * pw, y = Math.min(y0 + S, Math.max(y0, yOf(v)));
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.stroke();
    ctx.fillStyle = c.fg;
    ctx.font = 'italic 14px "EB Garamond", serif';
    const est = history.length ? history[history.length - 1] : 0;
    ctx.textAlign = 'right';
    ctx.fillText(`π ≈ ${est.toFixed(4)}`, px + pw, y0 + S - 20);
    ctx.fillStyle = c.muted;
    ctx.font = 'italic 12px "EB Garamond", serif';
    ctx.fillText(`n = ${pts.length}`, px + pw, y0 + S - 4);
    ctx.textAlign = 'left';
  };
};

// The doubling ("martingale") betting strategy on a fair coin: wealth is still a martingale.
const martingale: Factory = () => {
  const G = 60, bank = 255, rounds = 360;
  type Gambler = { w: number[]; stake: number; ruined: boolean };
  let gs: Gambler[] = [], step = 0, hold = 0;
  const reset = () => {
    gs = Array.from({ length: G }, () => ({ w: [bank], stake: 1, ruined: false }));
    step = 0;
    hold = 0;
  };
  reset();
  return (ctx, w, h, c) => {
    if (step < rounds) {
      for (let k = 0; k < 2 && step < rounds; k++, step++)
        for (const g of gs) {
          const cur = g.w[g.w.length - 1];
          if (g.ruined || g.stake > cur) {
            g.ruined = true;
            g.w.push(cur);
            continue;
          }
          if (Math.random() < 0.5) {
            g.w.push(cur + g.stake);
            g.stake = 1;
          } else {
            g.w.push(cur - g.stake);
            g.stake *= 2;
          }
        }
    } else if (++hold > 160) reset();
    const x0 = 6, pw = w - 12, top = 18, bot = h - 8, yMax = bank + rounds / 2 + 20;
    const yOf = (v: number) => bot - (v / yMax) * (bot - top);
    const xOf = (i: number) => x0 + (i / rounds) * pw;
    ctx.strokeStyle = c.rule;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(x0, yOf(bank));
    ctx.lineTo(x0 + pw, yOf(bank));
    ctx.stroke();
    ctx.setLineDash([]);
    for (const g of gs) {
      ctx.strokeStyle = g.ruined ? withAlpha(c.earth, 0.45) : withAlpha(c.accent2, 0.35);
      ctx.lineWidth = 1;
      ctx.beginPath();
      g.w.forEach((v, i) => (i ? ctx.lineTo(xOf(i), yOf(v)) : ctx.moveTo(xOf(0), yOf(v))));
      ctx.stroke();
    }
    // sample mean wealth
    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= step; i++) {
      let m = 0;
      for (const g of gs) m += g.w[Math.min(i, g.w.length - 1)];
      m /= G;
      i ? ctx.lineTo(xOf(i), yOf(m)) : ctx.moveTo(xOf(0), yOf(m));
    }
    ctx.stroke();
    const ruined = gs.filter((g) => g.ruined).length;
    ctx.fillStyle = c.muted;
    ctx.font = 'italic 12px "EB Garamond", serif';
    ctx.textAlign = 'right';
    ctx.fillText(`ruined: ${ruined} of ${G}`, x0 + pw, top - 5);
    ctx.textAlign = 'left';
  };
};

// A linear map acting on the plane: grid, basis vectors, unit square → parallelogram, and the eigenvector lines.
const linmap: Factory = () => {
  const mats = [
    [2, 1, 0.5, 1.5],   // eigenvalues 2.5 and 1
    [1, 0.8, 0, 1],     // shear: one eigendirection
    [1.6, 0, 0, 0.6],   // diagonal stretch
    [0.9, -1.2, 0.8, 0.9], // rotation-scaling: no real eigenvectors
  ];
  let t = 0, k = 0;
  return (ctx, w, h, c) => {
    t += 0.008;
    // ease in, hold, ease out, then move to the next matrix
    const phase = t % 4;
    if (t > 4 * (k + 1)) k++;
    const M = mats[k % mats.length];
    const e = phase < 1.5 ? (s => s * s * (3 - 2 * s))(Math.min(1, phase / 1.5)) : phase < 3 ? 1 : (s => 1 - s * s * (3 - 2 * s))((phase - 3));
    const a = 1 + (M[0] - 1) * e, b = M[1] * e, cc = M[2] * e, d = 1 + (M[3] - 1) * e;
    const u = Math.min(w, h * 1.6) / 9;
    const X = (x: number, y: number) => [w / 2 + (a * x + b * y) * u, h / 2 - (cc * x + d * y) * u];
    // background grid (fixed) and transformed grid
    ctx.lineWidth = 1;
    ctx.strokeStyle = withAlpha(c.muted, 0.12);
    for (let i = -8; i <= 8; i++) {
      ctx.beginPath(); ctx.moveTo(w / 2 + i * u, 0); ctx.lineTo(w / 2 + i * u, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, h / 2 + i * u); ctx.lineTo(w, h / 2 + i * u); ctx.stroke();
    }
    ctx.strokeStyle = withAlpha(c.accent2, 0.35);
    for (let i = -8; i <= 8; i++) {
      let p = X(i, -8), q = X(i, 8);
      ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
      p = X(-8, i); q = X(8, i);
      ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
    }
    // unit square → parallelogram, area = det
    const sq = [X(0, 0), X(1, 0), X(1, 1), X(0, 1)];
    ctx.fillStyle = withAlpha(c.earth, 0.22);
    ctx.beginPath();
    sq.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.fill();
    // eigenvector lines of the current (interpolated) matrix
    const tr = a + d, det = a * d - b * cc, disc = tr * tr - 4 * det;
    if (disc >= 0) {
      for (const lam of [(tr + Math.sqrt(disc)) / 2, (tr - Math.sqrt(disc)) / 2]) {
        let vx = b, vy = lam - a;
        if (Math.hypot(vx, vy) < 1e-6) [vx, vy] = [lam - d, cc];
        if (Math.hypot(vx, vy) < 1e-6) [vx, vy] = [1, 0];
        const n = Math.hypot(vx, vy) / 12;
        ctx.strokeStyle = withAlpha(c.accent, 0.55);
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(w / 2 - (vx / n) * u, h / 2 + (vy / n) * u);
        ctx.lineTo(w / 2 + (vx / n) * u, h / 2 - (vy / n) * u);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    // basis vectors
    const arrow = (x: number, y: number, color: string) => {
      const [x0, y0] = X(0, 0), [x1, y1] = X(x, y), ang = Math.atan2(y1 - y0, x1 - x0);
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 - 8 * Math.cos(ang - 0.4), y1 - 8 * Math.sin(ang - 0.4));
      ctx.lineTo(x1 - 8 * Math.cos(ang + 0.4), y1 - 8 * Math.sin(ang + 0.4));
      ctx.fill();
    };
    arrow(1, 0, c.accent);
    arrow(0, 1, c.accent2);
    ctx.fillStyle = c.fg;
    ctx.font = 'italic 13px "EB Garamond", serif';
    ctx.fillText(`A = [${M[0]} ${M[1]}; ${M[2]} ${M[3]}]`, 8, 16);
    ctx.fillStyle = c.muted;
    ctx.fillText(`det = ${det.toFixed(2)}`, 8, 32);
  };
};

// Singular value decomposition A = UΣVᵀ: rotate, stretch along the axes, rotate again.
const svd: Factory = () => {
  // A = U Σ Vᵀ with U = R(α), Σ = diag(s1, s2), V = R(β)
  const alpha = 0.6, beta = -0.9, s1 = 1.8, s2 = 0.6;
  let t = 0;
  return (ctx, w, h, c) => {
    t += 0.006;
    const cycle = t % 4; // 0–1 Vᵀ, 1–2 Σ, 2–3 U, 3–4 hold then reset
    const sm = (x: number) => { const s = Math.min(1, Math.max(0, x)); return s * s * (3 - 2 * s); };
    const p1 = sm(cycle), p2 = sm(cycle - 1), p3 = sm(cycle - 2);
    const fade = cycle > 3.6 ? 1 - (cycle - 3.6) / 0.4 : 1;
    const rot = (x: number, y: number, th: number) => [x * Math.cos(th) - y * Math.sin(th), x * Math.sin(th) + y * Math.cos(th)];
    const apply = (x: number, y: number) => {
      [x, y] = rot(x, y, -beta * p1);                  // Vᵀ
      [x, y] = [x * (1 + (s1 - 1) * p2), y * (1 + (s2 - 1) * p2)]; // Σ
      return rot(x, y, alpha * p3);                     // U
    };
    const R = h * 0.26, cx = w / 2, cy = h / 2;
    ctx.strokeStyle = withAlpha(c.muted, 0.25);
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - w / 2, cy); ctx.lineTo(cx + w / 2, cy); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();
    // image of the unit circle
    ctx.fillStyle = withAlpha(c.accent2, 0.12 * fade);
    ctx.strokeStyle = withAlpha(c.accent2, 0.9 * fade);
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let i = 0; i <= 120; i++) {
      const th = (i / 120) * TAU, [x, y] = apply(Math.cos(th), Math.sin(th));
      i ? ctx.lineTo(cx + x * R, cy - y * R) : ctx.moveTo(cx + x * R, cy - y * R);
    }
    ctx.fill(); ctx.stroke();
    // right singular vectors v1, v2 carried along: they end up as s1·u1, s2·u2
    for (const [k, color] of [[0, c.accent], [1, c.earth]] as const) {
      const v = rot(k === 0 ? 1 : 0, k === 0 ? 0 : 1, beta);
      const [x, y] = apply(v[0], v[1]);
      ctx.strokeStyle = withAlpha(color, fade);
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + x * R, cy - y * R); ctx.stroke();
      ctx.fillStyle = withAlpha(color, fade);
      ctx.beginPath(); ctx.arc(cx + x * R, cy - y * R, 3, 0, TAU); ctx.fill();
    }
    const label = cycle < 1 ? 'Vᵀ: rotate' : cycle < 2 ? 'Σ: stretch by σ₁, σ₂' : cycle < 3 ? 'U: rotate' : 'A = UΣVᵀ';
    ctx.fillStyle = c.fg;
    ctx.font = 'italic 13px "EB Garamond", serif';
    ctx.fillText(label, 8, 16);
  };
};

const factories: Record<string, Factory> = {
  linmap, svd,
  hairyball, conesphere, montecarlo, martingale,
  lorenz, brownian, fourier, torus, perspective, lattice, conformal, flow, mobius, hopf, gbm, qv,
};

function readColors(): Colors {
  const s = getComputedStyle(document.documentElement);
  const v = (name: string) => s.getPropertyValue(name).trim();
  return { fg: v('--fg'), muted: v('--muted'), rule: v('--rule'), accent: v('--accent'), accent2: v('--accent-2'), earth: v('--earth') };
}

export function mountAll() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll<HTMLCanvasElement>('canvas[data-math-figure]').forEach((canvas) => {
    if (canvas.dataset.mounted) return;
    canvas.dataset.mounted = '1';
    const factory = factories[canvas.dataset.mathFigure ?? ''];
    if (!factory) return;
    const ctx = canvas.getContext('2d')!;
    const frame = factory();
    let visible = true;
    let w = 0, h = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      frame(ctx, w, h, readColors());
    };
    resize();
    new ResizeObserver(() => {
      resize();
      draw();
    }).observe(canvas);

    if (reduce) {
      // Advance the figure to a representative state and show a single still frame.
      for (let i = 0; i < 400; i++) frame(ctx, w, h, readColors());
      draw();
      new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      return;
    }
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);
    const loop = () => {
      if (visible && !document.hidden) draw();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  });
}
