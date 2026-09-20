/* =============================================
   ANANTHA DARSHINI R — Portfolio Scripts
   ============================================= */

/* ── 1. CUSTOM CURSOR ── */
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
});
document.querySelectorAll('a, button, .project-card, .cert-card, .skill-pill, .stat-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursorGlow.classList.add('expanded'));
  el.addEventListener('mouseleave', () => cursorGlow.classList.remove('expanded'));
});

/* ── 2. NAVBAR SCROLL + ACTIVE LINK ── */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Sticky style
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  // Active section highlight
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 160) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

/* ── 3. HAMBURGER MENU ── */
const hamburger = document.getElementById('hamburger');
const navList   = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navList.classList.toggle('open');
  document.body.style.overflow = navList.classList.contains('open') ? 'hidden' : '';
});
navList.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navList.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── 4. TYPEWRITER ── */
const phrases = [
  'IT Student',
  'Python Developer',
  'Java Programmer',
  'AI Enthusiast',
  'Web Developer',
  'Problem Solver',
];
let phraseIndex = 0, charIndex = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  const current = phrases[phraseIndex];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    typedEl.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 60 : 110);
}
type();

/* ── 5. PARTICLE CANVAS ── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: null, y: null };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); build(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  const COLORS = ['rgba(124,58,237,', 'rgba(6,182,212,', 'rgba(236,72,153,', 'rgba(167,139,250,'];

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 2 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
  }
  Particle.prototype.update = function () {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };
  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color + this.alpha + ')';
    ctx.fill();
  };

  function build() {
    const count = Math.min(120, Math.floor((W * H) / 14000));
    particles = Array.from({ length: count }, () => new Particle());
  }
  build();

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124,58,237,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
      // connect to mouse
      if (mouse.x) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(6,182,212,${0.15 * (1 - dist / 180)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ── 6. SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── 7. SKILL BAR FILL (triggered on visibility) ── */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.pill-fill').forEach(fill => {
        fill.style.width = fill.dataset.width + '%';
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(el => barObserver.observe(el));

/* ── 8. 3D TILT on project cards ── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -12;
    card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── 9. ANIMATED COUNTER on About stats ── */
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const isDecimal = String(target).includes('.');
  const suffix    = String(target).replace(/[\d.]/g, '');
  const num       = parseFloat(target);
  const step = num / (duration / 16);

  function tick() {
    start = Math.min(start + step, num);
    el.textContent = (isDecimal ? start.toFixed(2) : Math.floor(start)) + suffix;
    if (start < num) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  tick();
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(el => {
        const raw = el.textContent.trim();
        animateCounter(el, raw);
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsWrap = document.querySelector('.about-stats');
if (statsWrap) statObserver.observe(statsWrap);

/* ── 10. CONTACT FORM ── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #10b981, #34d399)';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 3000);
  });
}

/* ── 11. SMOOTH NAV CLICKS ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── 12. PAGE LOAD FADE ── */
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });
});
