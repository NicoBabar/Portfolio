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

// Menu mobile
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  const setMenu = open => {
    navLinks.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  };
  navToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
}

// Apparition au scroll : on arrête d'observer une fois l'élément révélé
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

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

  function openModal(card) {
    const id = card.dataset.videoId;
    if (!id) return;
    lastFocused = card;
    modal.classList.toggle('modal-vertical', card.classList.contains('vertical-card'));
    // youtube-nocookie : pas de cookie publicitaire déposé tant que la vidéo n'est pas lue
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    if (!modal.classList.contains('active')) return;
    modal.classList.remove('active', 'modal-vertical');
    modal.setAttribute('aria-hidden', 'true');
    iframe.src = '';
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

// Formulaire de contact via Formspree
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const status = document.getElementById('formStatus');

  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.textContent;
    const announce = msg => {
      btn.textContent = msg;
      if (status) status.textContent = msg;
    };

    announce('Envoi en cours...');
    btn.disabled = true;

    try {
      const res = await fetch('https://formspree.io/f/xpqnleaw', {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        announce('Message envoyé ✓');
        btn.style.background = '#22c55e';
        contactForm.reset();
      } else {
        announce('Erreur, réessayez');
        btn.style.background = '#ef4444';
      }
    } catch {
      announce('Erreur, réessayez');
      btn.style.background = '#ef4444';
    }

    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.disabled = false;
      if (status) status.textContent = '';
    }, 3000);
  });
}
