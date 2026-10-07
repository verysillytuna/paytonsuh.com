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

const factories: Record<string, Factory> = { lorenz, brownian, fourier, torus, perspective, lattice, conformal, flow };

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
