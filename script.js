// Navbar: fond visible dès le scroll
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// Menu mobile
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Apparition en cascade : délais progressifs sur les enfants des conteneurs .stagger
document.querySelectorAll('.stagger').forEach(container => {
  Array.from(container.children).forEach((child, i) => {
    child.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
    child.style.transitionDelay = `${Math.min(i * 0.09, 0.9)}s`;
  });
});

// Scroll reveal général
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('visible');
    revealObserver.unobserve(el);

    // Cascade terminée : on rend la main aux transitions de hover des cartes
    if (el.classList.contains('stagger')) {
      setTimeout(() => {
        Array.from(el.children).forEach(c => {
          c.style.transition = '';
          c.style.transitionDelay = '';
        });
        el.classList.remove('stagger');
      }, 1800);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Compteurs animés de la section "Pourquoi la vidéo"
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    statObserver.unobserve(el);
    const target = parseInt(el.dataset.count, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));

// Modal vidéo
const modal    = document.getElementById('videoModal');
const iframe   = document.getElementById('modalIframe');
const closeBtn = document.getElementById('modalClose');

if (modal && iframe && closeBtn) {
  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.videoId;
      if (!id || id.startsWith('VOTRE_ID')) return;
      const isVertical = card.classList.contains('vertical-card');
      modal.classList.toggle('modal-vertical', isVertical);
      const platform = card.dataset.platform || 'youtube';
      iframe.src = platform === 'instagram'
        ? `https://www.instagram.com/reel/${id}/embed/`
        : `https://www.youtube.com/embed/${id}?autoplay=1`;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active', 'modal-vertical');
    iframe.src = '';
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

// Formulaire de contact via Formspree
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Envoi en cours...';
    btn.disabled = true;

    try {
      const res = await fetch('https://formspree.io/f/xpqnleaw', {
        method: 'POST',
        body: new FormData(e.target),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        btn.textContent = 'Message envoyé ✓';
        btn.style.background = '#22c55e';
        e.target.reset();
      } else {
        btn.textContent = 'Erreur, réessayez';
        btn.style.background = '#ef4444';
      }
    } catch {
      btn.textContent = 'Erreur, réessayez';
      btn.style.background = '#ef4444';
    }

    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  });
}
