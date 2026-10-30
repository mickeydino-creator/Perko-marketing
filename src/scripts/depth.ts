// Depth and progress for the landing page: hero planes that move at different rates, and the stamp trail that fills as the page is read.

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
const narrow = window.matchMedia('(max-width: 900px)');

/* Hero planes: each layer moves by -scrollY x data-depth. Positive is nearer (moves up faster), negative is further back. */
export function initDepth() {
  if (reduce.matches) return;
  const layers = Array.from(document.querySelectorAll<HTMLElement>('.hero [data-depth]'));
  if (!layers.length) return;
  let ticking = false;
  const update = () => {
    ticking = false;
    // Only the first screen of scroll matters for the hero; past that the layers simply stay put.
    const y = Math.min(window.scrollY, window.innerHeight * 1.2);
    const k = narrow.matches ? 0.5 : 1;
    for (const el of layers) {
      const d = Number(el.dataset.depth) * k;
      el.style.translate = `0 ${(-y * d).toFixed(1)}px`;
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
}

/* Stamp trail: one stamp lands each time a station crosses the middle of the screen. Stamps stay once landed. */
export function initStampTrail() {
  const trail = document.querySelector<HTMLElement>('[data-trail]');
  if (!trail) return;
  const ids = (trail.dataset.trail ?? '').split(',').filter(Boolean);
  const slots = Array.from(trail.querySelectorAll<HTMLElement>('[data-slot]'));
  const count = trail.querySelector<HTMLElement>('[data-trail-count]');
  const landed = new Set<string>();

  const paint = () => {
    slots.forEach((s, i) => s.classList.toggle('is-on', landed.has(ids[i])));
    if (count) count.textContent = `${landed.size}/${ids.length}`;
    trail.classList.toggle('is-idle', landed.size === 0);
    trail.classList.toggle('is-complete', landed.size === ids.length);
  };

  const stations = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
  const stamps = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting || !e.target.id || landed.has(e.target.id)) continue;
      landed.add(e.target.id);
      stamps.unobserve(e.target);
    }
    paint();
  }, { rootMargin: '-45% 0px -45% 0px' });
  stations.forEach((el) => stamps.observe(el));

  // The trail steps aside while the join form is on screen, so it never covers a field.
  const join = document.getElementById('join');
  if (join) {
    const away = new IntersectionObserver((entries) => {
      for (const e of entries) trail.classList.toggle('is-away', e.isIntersecting);
    }, { threshold: 0.12 });
    away.observe(join);
  }
  paint();
}
