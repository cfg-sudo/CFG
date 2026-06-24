/* ============================================================
   CASTLE ADVISORS GROUP — Main JS
   Nav dropdown, scroll animations, parallax, counters, modal
   ============================================================ */

(function () {
  'use strict';

  /* ── NAVBAR ─────────────────────────────────────────────── */
  const navbar   = document.getElementById('navbar');
  const overlay  = document.getElementById('navOverlay');
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ── DROPDOWN SYSTEM ─────────────────────────────────────── */
  const triggers = document.querySelectorAll('[data-dropdown-trigger]');
  const panels   = document.querySelectorAll('.dropdown-panel');
  let activePanel = null;
  let closeTimer  = null;

  function openPanel(id) {
    clearTimeout(closeTimer);
    const panel = document.getElementById('dp-' + id);
    if (!panel) return;
    if (activePanel && activePanel !== panel) activePanel.classList.remove('open');
    panel.classList.add('open');
    activePanel = panel;
    if (overlay) overlay.classList.add('visible');
  }

  function closeAll(delay) {
    closeTimer = setTimeout(() => {
      panels.forEach(p => p.classList.remove('open'));
      if (overlay) overlay.classList.remove('visible');
      activePanel = null;
    }, delay || 0);
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('mouseenter', () => openPanel(trigger.dataset.dropdownTrigger));
    trigger.addEventListener('mouseleave', () => closeAll(160));
  });
  panels.forEach(panel => {
    panel.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    panel.addEventListener('mouseleave', () => closeAll(160));
  });
  if (overlay) overlay.addEventListener('click', () => closeAll(0));

  /* ── MOBILE NAV TOGGLE ───────────────────────────────────── */
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('mobile-open');
      toggle.textContent = open ? 'Close' : 'Menu +';
      toggle.setAttribute('aria-expanded', open);
    });
  }

  /* Mobile: tap trigger to toggle sub-panel */
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      if (window.innerWidth > 768) return;
      const panel = document.getElementById('dp-' + trigger.dataset.dropdownTrigger);
      if (panel) panel.classList.toggle('mobile-open');
    });
  });

  /* Active nav link */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[href]').forEach(link => {
    if ((link.getAttribute('href') || '').split('#')[0] === path) link.classList.add('active');
  });

  /* ── HERO PARALLAX ───────────────────────────────────────── */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          heroBg.style.transform = `translateY(${window.scrollY * 0.32}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── SCROLL ANIMATIONS ───────────────────────────────────── */
  const animEls = document.querySelectorAll('.anim');
  if (animEls.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    animEls.forEach(el => obs.observe(el));
  }

  /* ── NUMBER COUNTER ──────────────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el       = entry.target;
        const target   = parseFloat(el.dataset.count);
        const suffix   = el.dataset.suffix || '';
        const prefix   = el.dataset.prefix || '';
        const decimals = el.dataset.count.includes('.') ? el.dataset.count.split('.')[1].length : 0;
        const duration = 1400;
        let start = null;
        cObs.unobserve(el);
        function step(ts) {
          if (!start) start = ts;
          const p = Math.min((ts - start) / duration, 1);
          const e = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + (e * target).toFixed(decimals) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cObs.observe(el));
  }

  /* ── MODAL ───────────────────────────────────────────────── */
  const modalOverlay = document.getElementById('signupOverlay');
  const modalTitle   = document.getElementById('modalTitle');
  const modalSub     = document.getElementById('modalSubtitle');
  const activityFld  = document.getElementById('activityField');
  const signupForm   = document.getElementById('signupForm');
  const modalSuccess = document.getElementById('modalSuccess');

  window.openModal = function (activity, title, subtitle) {
    if (!modalOverlay) return;
    if (modalTitle)   modalTitle.textContent  = title    || 'Sign Up';
    if (modalSub)     modalSub.textContent    = subtitle || '';
    if (activityFld)  activityFld.value       = activity || '';
    if (signupForm)   signupForm.style.display   = '';
    if (modalSuccess) modalSuccess.style.display = 'none';
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function () {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-signup]');
    if (btn) window.openModal(btn.dataset.signup, btn.dataset.title, btn.dataset.subtitle);
  });

  document.querySelectorAll('#modalCloseBtn').forEach(b => b.addEventListener('click', window.closeModal));
  if (modalOverlay) modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) window.closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') window.closeModal(); });

  if (signupForm) {
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      signupForm.style.display  = 'none';
      if (modalSuccess) modalSuccess.style.display = '';
    });
  }

})();
