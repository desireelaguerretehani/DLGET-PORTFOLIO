/* ==============================================
   APP.JS — Tehani DESIREE-LAGUERRE Portfolio
   ============================================== */

/* ---------- ANNÉE FOOTER ---------- */
const anneeEl = document.getElementById('annee');
if (anneeEl) anneeEl.textContent = new Date().getFullYear();

/* ---------- MODE CLAIR / SOMBRE ---------- */
const THEME_KEY = 'portfolio-theme';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.innerHTML       = theme === 'dark' ? '☀' : '☾';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre');
    btn.title           = theme === 'dark' ? 'Mode clair' : 'Mode sombre';
  }
}

/* Appliqué immédiatement (avant DOMContentLoaded) pour éviter le flash */
(function () {
  const saved      = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial    = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', initial);
})();

/* ---------- DOM READY ---------- */
document.addEventListener('DOMContentLoaded', () => {

  /* Sync bouton avec le thème déjà appliqué */
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(currentTheme);

  /* Toggle au clic */
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---------- BURGER MENU ---------- */
  const burger     = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpen = burger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- SCROLL ANIMATIONS ---------- */
  const fadeEls = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(el => observer.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- FILTRES PROJETS ---------- */
  const filtresBtns = document.querySelectorAll('.filtre-btn');
  const projetsGrid = document.getElementById('projets-grid');

  if (filtresBtns.length && projetsGrid) {
    filtresBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filtresBtns.forEach(b => b.classList.remove('actif'));
        btn.classList.add('actif');

        const filtre = btn.dataset.filtre;
        const cartes = projetsGrid.querySelectorAll('.projet-carte');

        cartes.forEach(carte => {
          const tags    = carte.dataset.tags || '';
          const visible = filtre === 'tous' || tags.includes(filtre);

          carte.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

          if (visible) {
            carte.removeAttribute('hidden');
            requestAnimationFrame(() => {
              carte.style.opacity   = '1';
              carte.style.transform = '';
            });
          } else {
            carte.style.opacity   = '0';
            carte.style.transform = 'scale(0.96)';
            setTimeout(() => carte.setAttribute('hidden', ''), 300);
          }
        });
      });
    });
  }

  /* ---------- COMPTEUR CARACTÈRES ---------- */
  const textarea = document.getElementById('contact-message');
  const restant  = document.getElementById('restant');
  if (textarea && restant) {
    textarea.addEventListener('input', () => {
      const left = (textarea.maxLength || 280) - textarea.value.length;
      restant.textContent  = left;
      restant.style.color  = left < 40 ? 'var(--rouge-vif)' : '';
    });
  }

  /* ---------- VALIDATION FORMULAIRE ---------- */
  const form = document.querySelector('form[aria-label="Formulaire de contact"]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = [
        form.querySelector('#contact-nom'),
        form.querySelector('#contact-email'),
        form.querySelector('#contact-message'),
      ];
      let valid = true;

      fields.forEach(field => {
        if (!field) return;
        if (!field.value.trim()) {
          field.style.borderColor = 'var(--rouge-vif)';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (valid) {
        const btn = form.querySelector('.btn-envoyer');
        if (btn) {
          const originalText = btn.textContent;
          btn.textContent      = 'Message envoyé ✓';
          btn.style.background = 'var(--or)';
          btn.style.color      = 'var(--encre)';
          setTimeout(() => {
            btn.textContent      = originalText;
            btn.style.background = '';
            btn.style.color      = '';
            form.reset();
            if (restant) restant.textContent = '280';
          }, 3000);
        }
      }
    });
  }

  /* ---------- NAV SCROLL EFFECT ---------- */
  const nav = document.querySelector('nav:not(.mobile-menu)');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); /* état initial */
  }

});