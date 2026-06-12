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

// Chemin de progression central : se remplit au scroll,
// chaque point de passage s'embrase quand on l'atteint
const scrollPath = document.querySelector('.scroll-path');
if (scrollPath) {
  const progress = scrollPath.querySelector('.scroll-path-progress');
  const sections = document.querySelectorAll('#about, #portfolio, #clients, #tarifs, #contact');
  const dots = [];
  let pathTop = 0;
  let pathHeight = 0;

  sections.forEach(section => {
    const el = document.createElement('div');
    el.className = 'path-dot';
    scrollPath.appendChild(el);
    dots.push({ el, section, y: 0 });
  });

  function layoutPath() {
    const hero = document.getElementById('hero');
    const footer = document.querySelector('footer');
    pathTop = hero ? hero.offsetTop + hero.offsetHeight : 0;
    const end = footer ? footer.offsetTop : document.body.scrollHeight;
    pathHeight = Math.max(end - pathTop, 0);
    scrollPath.style.top = pathTop + 'px';
    scrollPath.style.height = pathHeight + 'px';
    dots.forEach(d => {
      d.y = d.section.offsetTop + 60; // niveau du titre de section
      d.el.style.top = (d.y - pathTop) + 'px';
    });
  }

  function updatePath() {
    const marker = window.scrollY + window.innerHeight * 0.5;
    const filled = Math.min(Math.max(marker - pathTop, 0), pathHeight);
    progress.style.height = filled + 'px';
    dots.forEach(d => d.el.classList.toggle('lit', marker >= d.y));
  }

  layoutPath();
  updatePath();
  window.addEventListener('scroll', updatePath, { passive: true });
  window.addEventListener('resize', () => { layoutPath(); updatePath(); });
  window.addEventListener('load', () => { layoutPath(); updatePath(); });
}

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