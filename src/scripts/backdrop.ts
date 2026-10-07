// Faint drifting symbols from pure mathematics behind the page. Kept away from the text column by a CSS mask.
const SYMBOLS = [
  '∀', '∃', '∈', '⊂', '∅', '∞', '∫', '∮', '∑', '∏', '∂', '∇', 'ℝ', 'ℂ', 'ℤ', 'ℚ', 'ℕ', '≅', '≃', '⊗', '⊕', '→',
  '↦', '⟨·,·⟩', 'π₁', 'Hⁿ', 'ε', 'δ', 'φ', 'λ', 'ζ(s)', 'dω', 'ker', 'Spec', 'Sⁿ', 'GL₂', 'lim', 'sup', 'det', 'tr',
];

export function mountBackdrop(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  type Glyph = { s: string; x: number; y: number; size: number; vx: number; vy: number; rot: number; vr: number; tone: number };
  let glyphs: Glyph[] = [];
  let w = 0, h = 0;

  const seed = () => {
    const n = Math.round((w * h) / 26000);
    glyphs = Array.from({ length: Math.min(70, Math.max(18, n)) }, () => ({
      s: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      x: Math.random() * w,
      y: Math.random() * h,
      size: 16 + Math.random() * 30,
      vx: (Math.random() - 0.5) * 0.06,
      vy: -0.03 - Math.random() * 0.07,
      rot: (Math.random() - 0.5) * 0.6,
      vr: (Math.random() - 0.5) * 0.0006,
      tone: Math.floor(Math.random() * 4),
    }));
  };
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  };
  const draw = () => {
    const css = getComputedStyle(document.documentElement);
    const tones = ['--accent', '--accent-2', '--earth', '--plum'].map((v) => css.getPropertyValue(v).trim());
    const dark = css.getPropertyValue('color-scheme').includes('dark');
    ctx.clearRect(0, 0, w, h);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const g of glyphs) {
      ctx.save();
      ctx.translate(g.x, g.y);
      ctx.rotate(g.rot);
      ctx.globalAlpha = dark ? 0.1 : 0.085;
      ctx.fillStyle = tones[g.tone];
      ctx.font = `italic ${g.size}px "EB Garamond", Georgia, serif`;
      ctx.fillText(g.s, 0, 0);
      ctx.restore();
    }
  };
  const step = () => {
    for (const g of glyphs) {
      g.x += g.vx;
      g.y += g.vy;
      g.rot += g.vr;
      if (g.y < -40) {
        g.y = h + 40;
        g.x = Math.random() * w;
      }
      if (g.x < -60) g.x = w + 60;
      if (g.x > w + 60) g.x = -60;
    }
  };

  resize();
  addEventListener('resize', () => {
    resize();
    draw();
  });
  new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', draw);
  document.fonts?.ready.then(draw);
  draw();
  if (reduce) return;

  let last = 0;
  const loop = (t: number) => {
    if (!document.hidden && t - last > 33) {
      step();
      draw();
      last = t;
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
