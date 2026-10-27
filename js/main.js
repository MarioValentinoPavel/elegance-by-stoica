// Elegance by Stoica · «Persiana»: la foto del salón se parte en lamas que se abren al cargar y giran con el cursor
// como una persiana; al bajar se separan. Después, tres rubios se suceden fijados en pantalla mientras haces scroll.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const N = 7;

  function slats() {
    const box = document.getElementById('slats'), hero = document.getElementById('hero');
    box.innerHTML = Array.from({ length: N }, (_, i) => `<div class="sl" style="--i:${i};--n:${N}"><img src="assets/img/salon.jpg" alt="" width="1280" height="1600"></div>`).join('');
    const sl = [...box.children];
    if (reduce || typeof gsap === 'undefined') return;
    gsap.fromTo(sl, { rotateY: -88 }, { rotateY: 0, duration: 1.7, ease: 'expo.inOut', stagger: .07, delay: .1 });
    gsap.fromTo(sl.map((s) => s.firstChild), { scale: 1.18 }, { scale: 1, duration: 2.6, ease: 'expo.out', delay: .2 });
    gsap.fromTo('.word span', { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.5, ease: 'expo.out', stagger: .06, delay: .35 });
    // la persiana gira hacia donde está el cursor
    if (fine) {
      const rot = sl.map((s, i) => gsap.quickTo(s, 'rotateY', { duration: .7 + i * .09, ease: 'power3.out' }));
      let last = 0;
      hero.addEventListener('pointermove', (e) => {
        const r = box.getBoundingClientRect(), a = gsap.utils.clamp(-1, 1, ((e.clientX - r.left) / r.width - .5) * 2) * 26;
        rot.forEach((q) => q(a));
        if (Math.sign(a) !== last) { last = Math.sign(a); sl.forEach((s) => s.classList.toggle('r', a < 0)); }
        sl.forEach((s) => s.style.setProperty('--sh', (Math.abs(a) / 40).toFixed(2)));
      });
      hero.addEventListener('pointerleave', () => { rot.forEach((q) => q(0)); sl.forEach((s) => s.style.setProperty('--sh', 0)); });
    }
    // al bajar, las lamas se separan y se desfasan
    const tl = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    tl.to(box, { gap: 14, ease: 'none' }, 0)
      .to(sl, { y: (i) => (i % 2 ? -1 : 1) * 70, ease: 'none' }, 0)
      .to('.word', { xPercent: -8, ease: 'none' }, 0)
      .to('.hero-in', { y: -60, opacity: .2, ease: 'none' }, 0);
  }

  // tres rubios fijados en pantalla: cada tramo de scroll destapa la siguiente foto
  function tones() {
    if (reduce || typeof gsap === 'undefined') return;
    const st = gsap.utils.toArray('.st'), li = gsap.utils.toArray('#tones li'), num = document.getElementById('stN');
    const mm = gsap.matchMedia();
    mm.add('(min-width: 861px)', () => {
      document.documentElement.classList.add('pin');
      let cur = 0;
      const set = (i) => { if (i === cur) return; cur = i; li.forEach((l, k) => l.classList.toggle('on', k === i)); num.textContent = '0' + (i + 1); };
      gsap.set(st.slice(1), { clipPath: 'inset(100% 0% 0% 0%)' });
      const tl = gsap.timeline({ scrollTrigger: { trigger: '.color', start: 'top top', end: '+=200%', pin: true, scrub: .6, onUpdate: (s) => set(s.progress < .36 ? 0 : s.progress < .72 ? 1 : 2) } });
      [1, 2].forEach((k) => {
        tl.to(st[k], { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power2.inOut' })
          .fromTo(st[k].firstElementChild, { scale: 1.3 }, { scale: 1, duration: 1, ease: 'power2.out' }, '<')
          .to(st[k - 1].firstElementChild, { scale: 1.12, duration: 1, ease: 'none' }, '<')
          .to({}, { duration: .4 });
      });
      return () => { document.documentElement.classList.remove('pin'); li.forEach((l, k) => l.classList.toggle('on', !k)); };
    });
  }

  function init() { slats(); tones(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
