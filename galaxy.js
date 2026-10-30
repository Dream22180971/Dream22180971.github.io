(() => {
  const scene = document.querySelector('.scene');
  if (!scene) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'galaxy-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  scene.append(canvas);

  const nodes = [...scene.querySelectorAll('.point')];
  const descriptions = {
    'seanwalter.top': ['AI、测试与独立开发的实践', 'AI, testing, and independent development'],
    'projects.seanwalter.top': ['项目与创作的作品集', 'Projects and creative work'],
    'dream.seanwalter.top': ['阅读、电影与生活随笔', 'Books, films, and personal notes']
  };
  nodes.forEach(node => {
    const description = descriptions[new URL(node.href).hostname];
    if (!description) return;
    const preview = document.createElement('span');
    preview.className = 'node-preview';
    preview.setAttribute('aria-hidden', 'true');
    const zh = document.createElement('span');
    zh.className = 'preview-zh';
    zh.textContent = description[0];
    const en = document.createElement('span');
    en.className = 'preview-en';
    en.textContent = description[1];
    preview.append(zh, en);
    node.append(preview);
  });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const tau = Math.PI * 2;
  let width = 0, height = 0, scale = 1, radius = 0;
  let stars = [], dust = [], frame = 0, last = 0, time = 0, orbit = 0;
  let visible = true, hovered = false, focused = false, touching = false;
  let pointerX = 0, pointerY = 0, cameraX = 0, cameraY = 0;
  let seed = 17491;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  function positionNodes() {
    nodes.forEach((node, index) => {
      const angle = orbit - Math.PI / 2 + index * tau / nodes.length;
      node.style.left = `${width / 2 + Math.cos(angle) * radius}px`;
      node.style.top = `${height / 2 + Math.sin(angle) * radius}px`;
    });
  }

  function resize() {
    const box = scene.getBoundingClientRect();
    width = box.width;
    height = box.height;
    if (!width || !height) return;
    scale = Math.min(window.devicePixelRatio || 1, width < 500 ? 1.25 : 1.5);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const widest = Math.max(44, ...nodes.map(node => node.offsetWidth));
    const tallest = Math.max(44, ...nodes.map(node => node.offsetHeight));
    radius = Math.max(0, Math.min(255, (width - widest) / 2 - 8, (height - tallest) / 2 - 8));

    seed = 17491;
    const mobile = width < 500;
    stars = Array.from({ length: mobile ? 80 : 160 }, () => ({
      x: random(), y: random(), size: .25 + random() * .8,
      alpha: .1 + random() * .42, phase: random() * tau, depth: .3 + random() * .7
    }));
    dust = Array.from({ length: mobile ? 420 : 900 }, (_, i) => {
      const distance = .1 + Math.pow(random(), .72) * .9;
      return {
        distance, angle: (i % 3) * tau / 3 + distance * 5.2 + (random() - .5) * (1 + distance),
        spread: (random() - .5) * (.05 + distance * .2),
        size: .2 + random() * .75, alpha: .1 + random() * .45, color: random()
      };
    });
    positionNodes();
    draw();
  }

  function draw() {
    if (!width || !height) return;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const cx = width / 2 + cameraX * 8;
    const cy = height / 2 + cameraY * 6;
    const size = Math.min(width * .49, height * .48);

    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, size);
    glow.addColorStop(0, 'rgba(236,178,151,.22)');
    glow.addColorStop(.28, 'rgba(125,111,156,.14)');
    glow.addColorStop(.65, 'rgba(75,118,178,.08)');
    glow.addColorStop(1, 'rgba(20,28,49,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    for (const star of stars) {
      const twinkle = reduced.matches ? 1 : .8 + .2 * Math.sin(time * .7 + star.phase);
      ctx.fillStyle = `rgba(220,231,255,${star.alpha * twinkle})`;
      ctx.beginPath();
      ctx.arc(star.x * width + cameraX * star.depth * 5, star.y * height + cameraY * star.depth * 5, star.size, 0, tau);
      ctx.fill();
    }

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-.24);
    for (const particle of dust) {
      const angle = particle.angle + time * .065 / (particle.distance + .4);
      const x = Math.cos(angle) * particle.distance * size;
      const y = (Math.sin(angle) * particle.distance * .4 + particle.spread) * size;
      const alpha = particle.alpha * (1 - particle.distance * .35);
      ctx.fillStyle = particle.color < .26 ? `rgba(238,185,162,${alpha})` : particle.color < .58 ? `rgba(164,196,246,${alpha})` : `rgba(236,239,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, particle.size, 0, tau);
      ctx.fill();
    }
    ctx.restore();

    // The links remain real DOM anchors; the orbit is purely decorative.
    if (radius > 0) {
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius, 0, tau);
      ctx.strokeStyle = 'rgba(193,207,231,.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  function tick(now) {
    if (!visible || reduced.matches || document.hidden) {
      frame = 0;
      last = 0;
      return;
    }
    const delta = last ? Math.min((now - last) / 1000, .05) : 0;
    last = now;
    time += delta;
    if (!hovered && !focused && !touching) {
      orbit += delta * .075;
      positionNodes();
    }
    const easing = 1 - Math.exp(-delta * 3);
    cameraX += (pointerX - cameraX) * easing;
    cameraY += (pointerY - cameraY) * easing;
    draw();
    frame = requestAnimationFrame(tick);
  }

  function sync() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    if (reduced.matches) {
      pointerX = pointerY = cameraX = cameraY = 0;
      positionNodes();
      draw();
    }
    if (visible && !reduced.matches && !document.hidden) frame = requestAnimationFrame(tick);
  }

  nodes.forEach(node => {
    node.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') hovered = true; });
    node.addEventListener('pointerleave', () => { hovered = false; });
  });
  scene.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || reduced.matches) return;
    const box = scene.getBoundingClientRect();
    pointerX = (event.clientX - box.left) / box.width - .5;
    pointerY = (event.clientY - box.top) / box.height - .5;
  });
  scene.addEventListener('pointerleave', () => {
    hovered = false;
    pointerX = pointerY = 0;
  });
  scene.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch') touching = true;
  });
  window.addEventListener('pointerup', () => { touching = false; });
  window.addEventListener('pointercancel', () => { touching = false; });
  scene.addEventListener('focusin', () => { focused = true; });
  scene.addEventListener('focusout', event => {
    if (!scene.contains(event.relatedTarget)) focused = false;
  });

  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(scene);
  else window.addEventListener('resize', resize);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      sync();
    }).observe(scene);
  }
  // Translation can change the links' widths without changing the scene's size.
  if ('MutationObserver' in window) {
    const observer = new MutationObserver(resize);
    nodes.forEach(node => observer.observe(node, { childList: true, characterData: true, subtree: true }));
  }
  if (reduced.addEventListener) reduced.addEventListener('change', sync);
  else reduced.addListener(sync);
  document.addEventListener('visibilitychange', sync);
  resize();
  sync();
})();
