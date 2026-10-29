(() => {
  const scene = document.querySelector('.scene');
  if (!scene) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'galaxy-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  scene.append(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0, height = 0, scale = 1, frame = 0, time = 0, visible = true, last = 0;
  const nodes = [...scene.querySelectorAll('.point')];
  let orbitTime = 0, interacting = false;
  function positionNodes() {
    const radius = Math.max(0, Math.min(width, height, 510) * .5 - (width < 500 ? 52 : 64));
    nodes.forEach((node, index) => {
      const angle = orbitTime * .12 - Math.PI / 2 + index * Math.PI * 2 / 3;
      node.style.left = `${width / 2 + Math.cos(angle) * radius}px`;
      node.style.top = `${height / 2 + Math.sin(angle) * radius}px`;
    });
  }
  let particles = [];
  let seed = 17491;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  function resize() {
    const box = scene.getBoundingClientRect();
    width = box.width; height = box.height; scale = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * scale); canvas.height = Math.round(height * scale);
    canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
    seed = 17491;
    const count = width < 500 ? 750 : 1600;
    particles = Array.from({length: count}, (_, i) => {
      const radius = 0.22 + Math.pow(random(), 0.72) * 0.78;
      const arm = i % 2 ? Math.PI : 0;
      return { radius, angle: arm + radius * 6 + (random() - .5) * (0.7 + radius), spread: (random() - .5) * (0.08 + radius * .12), size: .35 + random() * 1.35, opacity: .18 + random() * .65, color: random() };
    });
    positionNodes();
    draw();
  }
  function draw() {
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const cx = width * .5, cy = height * .49, r = Math.min(width * .48, height * .46);
    const glow = ctx.createRadialGradient(cx, cy, r * .06, cx, cy, r);
    glow.addColorStop(0, 'rgba(223,169,145,.16)'); glow.addColorStop(.45, 'rgba(105,126,189,.11)'); glow.addColorStop(1, 'rgba(20,28,49,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
    for (const p of particles) {
      const angle = p.angle + time * .025 / (p.radius + .35);
      const x = cx + Math.cos(angle) * p.radius * r;
      const y = cy + Math.sin(angle) * p.radius * r * .42 + p.spread * r;
      const alpha = p.opacity * (1 - p.radius * .38);
      ctx.fillStyle = p.color < .27 ? `rgba(231,177,155,${alpha})` : p.color < .55 ? `rgba(163,193,239,${alpha})` : `rgba(235,239,255,${alpha})`;
      ctx.beginPath(); ctx.arc(x, y, p.size, 0, Math.PI * 2); ctx.fill();
    }
  }
  function tick(now) {
    if (!visible || reduced.matches || document.hidden) { frame = 0; return; }
    if (last) {
      const delta = Math.min((now - last) / 1000, .05);
      time += delta;
      if (!interacting) orbitTime += delta;
    }
    last = now; positionNodes(); draw(); frame = requestAnimationFrame(tick);
  }
  function sync() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; last = 0; draw();
    if (visible && !reduced.matches && !document.hidden) frame = requestAnimationFrame(tick);
  }
  nodes.forEach(node => {
    node.addEventListener('pointerenter', () => { interacting = true; });
    node.addEventListener('pointerleave', () => { interacting = false; });
  });
  scene.addEventListener('focusin', () => { interacting = true; });
  scene.addEventListener('focusout', event => { if (!scene.contains(event.relatedTarget)) interacting = false; });
  new ResizeObserver(resize).observe(scene);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }).observe(scene);
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  resize(); sync();
})();
