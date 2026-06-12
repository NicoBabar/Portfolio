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

// Scroll reveal général
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Effet 3D sur les cartes : légère inclinaison qui suit la souris
document.querySelectorAll('.video-card, .tarif-big-card, .client-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transition = 'transform 0.12s ease-out, border-color 0.35s ease, box-shadow 0.35s ease';
    card.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.45s ease, border-color 0.35s ease, box-shadow 0.35s ease';
    card.style.transform = '';
  });
});

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