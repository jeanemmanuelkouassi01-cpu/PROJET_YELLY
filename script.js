/* ══════════════════════════════════════════════════════════════
   HOTEL & RESIDENCES YELLY — script.js
   ══════════════════════════════════════════════════════════════ */

'use strict';

// ══════════════════════════ LOADER ══════════════════════════
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    // Sécurité : forcer la disparition du loader après 3s max
    setTimeout(() => loader.style.display = 'none', 1200);
    // Trigger hero reveal after loader
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 150);
    });
  }, 1200);
});

// ══════════════════════════ NAVBAR ══════════════════════════
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ══════════════════════════ BURGER MENU ══════════════════════════
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    burger.classList.toggle('active', menuOpen);
    mobileMenu.setAttribute('aria-hidden', String(!menuOpen));
    if (menuOpen) {
      mobileMenu.style.display = 'flex';
      requestAnimationFrame(() => mobileMenu.classList.add('open'));
      document.body.style.overflow = 'hidden';
    } else {
      closeMobileMenu();
    }
  });

  function closeMobileMenu() {
    menuOpen = false;
    burger.classList.remove('active');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { mobileMenu.style.display = ''; }, 400);
  }

  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

// ══════════════════════════ SCROLL REVEAL ══════════════════════════
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay) || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ══════════════════════════ COUNTER ANIMATION ══════════════════════════
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = true;
      const targets = entry.target.querySelectorAll('.chiffre-num');
      targets.forEach(num => animateCounter(num));
    }
  });
}, { threshold: 0.5 });

const chiffresBar = document.querySelector('.chiffres-bar');
if (chiffresBar) counterObserver.observe(chiffresBar);

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString('fr-FR');
  }, 16);
}

// ══════════════════════════ MENU RESTAURANT ══════════════════════════
const menuData = {
  entrees: [
    { name: '............................................', desc: '............................................', price: '... FCFA' },
    { name: '............................................', desc: '............................................', price: '...FCFA' },
    { name: '............................................', desc: '............................................', price: '... FCFA' },
  ],
  plats: [
    { name: '............................................l', desc: '............................................', price: '... FCFA' },
    { name: '............................................', desc: '............................................', price: '... FCFA' },
    { name: '............................................', desc: "............................................", price: '... FCFA' },
    { name: '............................................', desc: '............................................', price: ' FCFA' },
  ],
  desserts: [
    { name: '............................................', desc: '............................................', price: 'FCFA' },
    { name: '............................................', desc: '............................................', price: ' FCFA' },
    { name: '............................................', desc: '............................................', price: ' FCFA' },
  ]
};

const menuItemsEl = document.getElementById('menuItems');
const menuCats = document.querySelectorAll('.menu-cat');

function renderMenu(cat) {
  if (!menuItemsEl) return;
  const items = menuData[cat];
  menuItemsEl.innerHTML = items.map(item => `
    <div class="menu-item">
      <div class="menu-item-left">
        <h4>${item.name}</h4>
        <p>${item.desc}</p>
      </div>
      <div class="menu-item-price">${item.price}</div>
    </div>
  `).join('');
}

menuCats.forEach(btn => {
  btn.addEventListener('click', () => {
    menuCats.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderMenu(btn.dataset.cat);
  });
});

// Init
renderMenu('entrees');

// ══════════════════════════ TÉMOIGNAGES SLIDER ══════════════════════════
const track = document.getElementById('temoignagesTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('sliderDots');

if (track && prevBtn && nextBtn) {
  const cards = track.querySelectorAll('.temoignage-card');
  let current = 0;
  const total = cards.length;
  const visible = window.innerWidth <= 768 ? 1 : 2;
  const maxIndex = total - visible;

  // Create dots
  for (let i = 0; i <= maxIndex; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex));
    const cardWidth = cards[0].offsetWidth + 24; // gap
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto slide
  let autoSlide = setInterval(() => {
    goTo(current >= maxIndex ? 0 : current + 1);
  }, 5000);

  [prevBtn, nextBtn].forEach(btn => {
    btn.addEventListener('click', () => {
      clearInterval(autoSlide);
      autoSlide = setInterval(() => {
        goTo(current >= maxIndex ? 0 : current + 1);
      }, 5000);
    });
  });
}

// ══════════════════════════ SMOOTH SCROLL NAV ══════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ══════════════════════════ BACK TO TOP ══════════════════════════
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 400);
});
backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ══════════════════════════ ACTIVE NAV LINK ON SCROLL ══════════════════════════
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active-link', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.4, rootMargin: '-80px 0px 0px 0px' });

sections.forEach(sec => sectionObserver.observe(sec));

// ══════════════════════════ PARALLAX HERO SHAPES ══════════════════════════
const shapes = document.querySelectorAll('.shape');
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const y = window.scrollY;
      shapes.forEach((shape, i) => {
        const speed = i === 0 ? 0.08 : 0.05;
        shape.style.transform = `translateY(${y * speed}px)`;
      });
      ticking = false;
    });
    ticking = true;
  }
});

// ══════════════════════════ CURSOR GLOW EFFECT ══════════════════════════
const glow = document.createElement('div');
glow.style.cssText = `
  position: fixed; width: 300px; height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%);
  pointer-events: none; z-index: 0;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease;
`;
document.body.appendChild(glow);

window.addEventListener('mousemove', (e) => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

// ══════════════════════════ SERVICE CARD STAGGER ══════════════════════════
const serviceCards = document.querySelectorAll('.service-card');
const serviceObserver = new IntersectionObserver((entries) => {
  if (entries.some(e => e.isIntersecting)) {
    serviceCards.forEach((card, i) => {
      setTimeout(() => card.classList.add('visible'), i * 100);
    });
    serviceObserver.disconnect();
  }
}, { threshold: 0.1 });

if (serviceCards.length) serviceObserver.observe(serviceCards[0]);

// ══════════════════════════ CONSOLE EASTER EGG ══════════════════════════
console.log('%c✦ HÔTEL AZUR PALACE ✦', 'color: #c9a84c; font-family: serif; font-size: 24px; font-weight: bold;');
console.log('%cCréé avec élégance. Site officiel.', 'color: #888; font-size: 12px;');
