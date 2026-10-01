// Préférences d'affichage de l'utilisateur
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer   = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Navbar : fond visible dès le scroll (throttlé sur la frame d'affichage)
const navbar = document.getElementById('navbar');
if (navbar) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
      ticking = false;
    });
  }, { passive: true });
}

// Menu mobile (libellés lus dans le HTML pour suivre la langue de la page)
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  const setMenu = open => {
    navLinks.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? navToggle.dataset.labelClose : navToggle.dataset.labelOpen);
  };
  navToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape' || !navLinks.classList.contains('open')) return;
    setMenu(false);
    navToggle.focus();
  });
}

// Apparition au scroll : dès qu'un bout de l'élément entre à l'écran (un seuil en %
// laisserait invisibles les blocs très hauts, par exemple avec un fort zoom)
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Bouton « Contactez-moi » flottant : visible une fois les boutons du haut de page
// dépassés, masqué tant que la section contact est à l'écran
const stickyCta = document.querySelector('.sticky-cta');
const heroBtns  = document.querySelector('.hero-btns');
const contact   = document.getElementById('contact');
if (stickyCta && heroBtns && contact) {
  const onScreen = new Map([[heroBtns, true], [contact, false]]);

  const ctaObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => onScreen.set(entry.target, entry.isIntersecting));
    const show = !onScreen.get(heroBtns) && !onScreen.get(contact);

    // Si le bouton a le focus quand il disparaît, le focus passe au titre de la
    // section contact : l'utilisateur au clavier n'est pas renvoyé en haut de page
    if (!show && document.activeElement === stickyCta) {
      const title = contact.querySelector('h2');
      title.setAttribute('tabindex', '-1');
      title.focus({ preventScroll: true });
    }
    stickyCta.classList.toggle('show', show);
  });
  ctaObserver.observe(heroBtns);
  ctaObserver.observe(contact);
}

// Effet 3D sur les cartes : uniquement à la souris, et jamais si l'utilisateur
// a demandé des animations réduites
if (finePointer && !reducedMotion) {
  document.querySelectorAll('.video-card, .tarif-big-card, .client-card').forEach(card => {
    let frame = null;

    card.addEventListener('mousemove', e => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transition = 'transform 0.12s ease-out, border-color 0.35s ease, box-shadow 0.35s ease';
        card.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
      });
    });

    card.addEventListener('mouseleave', () => {
      if (frame) { cancelAnimationFrame(frame); frame = null; }
      card.style.transition = 'transform 0.45s ease, border-color 0.35s ease, box-shadow 0.35s ease';
      card.style.transform = '';
    });
  });
}

// Modal vidéo
const modal    = document.getElementById('videoModal');
const iframe   = document.getElementById('modalIframe');
const closeBtn = document.getElementById('modalClose');

if (modal && iframe && closeBtn) {
  let lastFocused = null;
  // Tant que la vidéo est ouverte, le reste de la page est inerte : ni clic,
  // ni tabulation, ni lecteur d'écran ne peuvent s'y égarer derrière la vidéo
  const background = [...document.body.children].filter(el => el !== modal && el.tagName !== 'SCRIPT');
  const setBackgroundInert = on => background.forEach(el => { el.inert = on; });

  function openModal(card) {
    const id = card.dataset.videoId;
    // Un identifiant YouTube fait toujours 11 caractères parmi [A-Za-z0-9_-]
    if (!/^[A-Za-z0-9_-]{11}$/.test(id || '')) return;
    lastFocused = card;
    modal.classList.toggle('modal-vertical', card.classList.contains('vertical-card'));
    // youtube-nocookie : pas de cookie publicitaire déposé tant que la vidéo n'est pas lue
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    setBackgroundInert(true);
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    if (!modal.classList.contains('active')) return;
    modal.classList.remove('active', 'modal-vertical');
    modal.setAttribute('aria-hidden', 'true');
    iframe.src = '';
    setBackgroundInert(false);
    document.body.style.overflow = '';
    if (lastFocused) { lastFocused.focus(); lastFocused = null; }
  }

  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();          // empêche le scroll sur la barre d'espace
      openModal(card);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

// Formulaire de contact via Formspree. Les textes affichés viennent du HTML
// (attribut data-sending et modèles #formOk / #formErr) : ils suivent la langue de la page
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const status  = document.getElementById('formStatus');
  const btn     = contactForm.querySelector('button[type="submit"]');
  const label   = btn.textContent;
  const showMsg = id => {
    const tpl = document.getElementById(id);
    if (tpl) status.replaceChildren(tpl.content.cloneNode(true));
  };
  let sending = false;

  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (sending) return;
    sending = true;

    // aria-disabled plutôt que disabled : le bouton garde le focus pendant l'envoi
    btn.setAttribute('aria-disabled', 'true');
    btn.textContent = contactForm.dataset.sending;
    status.replaceChildren();

    let ok = false;
    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });
      ok = res.ok;
    } catch {
      ok = false;
    }

    // Le résultat reste affiché : en cas d'échec, le message saisi est conservé
    // et l'adresse email est proposée en solution de repli
    if (ok) contactForm.reset();
    showMsg(ok ? 'formOk' : 'formErr');
    btn.textContent = label;
    btn.removeAttribute('aria-disabled');
    sending = false;
  });
}
