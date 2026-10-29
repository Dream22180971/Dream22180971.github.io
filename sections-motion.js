(() => {
  const sections = Array.from(document.querySelectorAll('#spaces, #work, #writing'));
  if (!sections.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let observer;

  function updateDrift() {
    frame = 0;
    if (reducedMotion.matches) return;
    const viewportHeight = window.innerHeight;
    for (const section of sections) {
      const bounds = section.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > viewportHeight) continue;
      const progress = (viewportHeight - bounds.top) / (viewportHeight + bounds.height);
      section.style.setProperty('--section-drift', `${((progress - 0.5) * -80).toFixed(1)}px`);
    }
  }

  function scheduleDrift() {
    if (!reducedMotion.matches && !frame) frame = window.requestAnimationFrame(updateDrift);
  }

  function configureMotion() {
    if (observer) observer.disconnect();
    if (reducedMotion.matches) {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      for (const section of sections) section.style.removeProperty('--section-drift');
      return;
    }

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries, currentObserver) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('section-arrived');
          currentObserver.unobserve(entry.target);
        }
      }, { threshold: 0.1 });
      for (const section of sections) {
        for (const element of section.querySelectorAll('.heading, .place, .work, .article')) {
          if (!element.classList.contains('section-arrived')) observer.observe(element);
        }
      }
    }
    scheduleDrift();
  }

  window.addEventListener('scroll', scheduleDrift, { passive: true });
  window.addEventListener('resize', scheduleDrift, { passive: true });
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', configureMotion);
  else if (reducedMotion.addListener) reducedMotion.addListener(configureMotion);
  configureMotion();
})();
