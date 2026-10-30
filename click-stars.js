(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  document.addEventListener('pointerdown', event => {
    if (reduced.matches || !event.isPrimary || event.button !== 0 || event.target.closest('a, button, input, select, textarea') || !event.target.closest('#spaces, #work, #writing, footer')) return;
    const burst = document.createElement('span');
    burst.className = 'click-stars';
    burst.setAttribute('aria-hidden', 'true');
    burst.style.left = `${event.clientX}px`;
    burst.style.top = `${event.clientY}px`;
    for (let i = 0; i < 6; i++) {
      const star = document.createElement('span');
      star.style.setProperty('--angle', `${i * 60}deg`);
      burst.append(star);
    }
    document.body.append(burst);
    burst.addEventListener('animationend', () => burst.remove(), { once: true });
  });
})();
