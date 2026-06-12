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

// Chemin de progression latéral : SVG tracé main-droite, se remplit au scroll
const scrollPathEl = document.querySelector('.scroll-path');
if (scrollPathEl) {
  const progressRect = document.getElementById('scrollProgressRect');
  const svg = scrollPathEl.querySelector('.scroll-path-svg');
  const svgNS = 'http://www.w3.org/2000/svg';
  const sections = ['about', 'portfolio', 'clients', 'tarifs', 'contact']
    .map(id => document.getElementById(id)).filter(Boolean);
  const dots = [];

  sections.forEach(section => {
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', '12');
    circle.setAttribute('r', '6');
    circle.classList.add('path-dot');
    svg.appendChild(circle);
    dots.push({ circle, section, triggerY: 0 });
  });

  function getRange() {
    const first = document.getElementById('about');
    const footer = document.querySelector('footer');
    const start = first ? first.offsetTop : 0;
    const end = footer ? footer.offsetTop : document.body.scrollHeight;
    return { start, end };
  }

  function layout() {
    const { start, end } = getRange();
    const range = Math.max(end - start, 1);
    dots.forEach(d => {
      const ratio = Math.min(Math.max((d.section.offsetTop - start) / range, 0), 1);
      d.circle.setAttribute('cy', ratio * 960 + 20);
      d.triggerY = d.section.offsetTop + 60;
    });
  }

  function update() {
    const { start, end } = getRange();
    const marker = window.scrollY + window.innerHeight * 0.4;
    const p = Math.min(Math.max((marker - start) / (end - start), 0), 1);
    progressRect.setAttribute('height', p * 1000);
    dots.forEach(d => d.circle.classList.toggle('lit', marker >= d.triggerY));
  }

  layout();
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', () => { layout(); update(); });
  window.addEventListener('load', () => { layout(); update(); });
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