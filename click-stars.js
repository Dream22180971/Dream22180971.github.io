(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  document.addEventListener('pointerdown', event => {
    if (reduced.matches || !event.isPrimary || event.button !== 0) return;
    const burst = document.createElement('span');
    const firstScreen = Boolean(event.target.closest('.hero, .strip, header'));
    burst.className = firstScreen ? 'click-stars click-constellation' : 'click-stars';
    burst.setAttribute('aria-hidden', 'true');
    burst.style.left = `${event.clientX}px`;
    burst.style.top = `${event.clientY}px`;
    for (let i = 0; i < 8; i++) {
      const star = document.createElement('span');
      star.style.setProperty('--angle', `${i * 45}deg`);
      star.style.setProperty('--distance', `${65 + (i % 3) * 22}px`);
      burst.append(star);
    }
    document.body.append(burst);
    burst.addEventListener('animationend', () => burst.remove(), { once: true });
  });
})();
