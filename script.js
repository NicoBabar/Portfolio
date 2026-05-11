// Navbar: fond visible dès le scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Menu mobile
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Scroll reveal général
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Animation barres de compétences
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const aboutSection = document.getElementById('about');
if (aboutSection) skillObserver.observe(aboutSection);

// Modal vidéo YouTube
const modal      = document.getElementById('videoModal');
const iframe     = document.getElementById('modalIframe');
const closeBtn   = document.getElementById('modalClose');

document.querySelectorAll('.video-card').forEach(card => {
  card.addEventListener('click', () => {
    const id = card.dataset.videoId;
    if (!id || id.startsWith('VOTRE_ID')) return;
    iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  modal.classList.remove('active');
  iframe.src = '';
  document.body.style.overflow = '';
}

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Formulaire de contact (feedback visuel simple)
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.textContent = 'Message envoyé ✓';
  btn.style.background = '#22c55e';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
    btn.disabled = false;
    e.target.reset();
  }, 3000);
});
