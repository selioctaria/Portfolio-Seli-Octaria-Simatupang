/* ═══════════════════════════════════════════════════════════
   SELI OCTARIA SIMATUPANG — PORTFOLIO
   Main JavaScript · main.js
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── Active Nav Link ─────────────────────────────────── */
function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    const target = href.split('/').pop();
    a.classList.toggle('active', target === page);
  });
}

/* ─── Nav Scroll Tint ─────────────────────────────────── */
function initNavScroll() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  const handler = () => nav.classList.toggle('scrolled', scrollY > 40);
  window.addEventListener('scroll', handler, { passive: true });
  handler();
}

/* ─── Cursor Glow ─────────────────────────────────────── */
function initCursor() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}

/* ─── Particle Canvas ─────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts;

  function init() {
    W = canvas.width  = innerWidth;
    H = canvas.height = innerHeight;
    pts = Array.from({ length: 42 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * .28,
      vy: (Math.random() - .5) * .28,
      r: Math.random() * 1.5 + .5,
      c: Math.random() > .5 ? 'rgba(220,110,155,' : 'rgba(210,160,80,'
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c + '.28)';
      ctx.fill();
    });
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.hypot(dx, dy);
        if (d < 90) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(220,110,155,${.09 * (1 - d / 90)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', init, { passive: true });
  init();
  draw();
}

/* ─── Scroll Reveal ───────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('vis');
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.07 }
  );
  els.forEach(el => io.observe(el));
}

/* ─── Counter Animation ───────────────────────────────── */
function animateCount(el, target) {
  const dur    = 1500;
  const suffix = target >= 10 ? '+' : '×';
  let start = 0;
  const step = ts => {
    if (!start) start = ts;
    const prog = Math.min((ts - start) / dur, 1);
    const ease = 1 - Math.pow(1 - prog, 3);
    el.textContent = Math.round(ease * target) + suffix;
    if (prog < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const io = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target, +e.target.dataset.target);
        io.unobserve(e.target);
      }
    }),
    { threshold: .5 }
  );
  document.querySelectorAll('[data-target]').forEach(el => io.observe(el));
}

/* ─── Skill Bars ──────────────────────────────────────── */
function initSkillBars() {
  const io = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.w + '%';
        io.unobserve(e.target);
      }
    }),
    { threshold: .3 }
  );
  document.querySelectorAll('.bar-fill').forEach(b => io.observe(b));
}

/* ─── Radar Chart ─────────────────────────────────────── */
function initRadar() {
  const c = document.getElementById('radarCanvas');
  if (!c) return;
  const ct = c.getContext('2d');
  const labels = ['UI/UX', 'Web', 'Mobile', 'Data', 'Backend'];
  const vals   = [.90, .85, .88, .75, .80];
  const N = labels.length;
  const cx = 160, cy = 160, R = 108;

  const px = (i, r) => cx + r * Math.cos((i / N) * Math.PI * 2 - Math.PI / 2);
  const py = (i, r) => cy + r * Math.sin((i / N) * Math.PI * 2 - Math.PI / 2);

  function draw(p) {
    ct.clearRect(0, 0, 320, 320);
    // grid rings
    [.25, .5, .75, 1].forEach(s => {
      ct.beginPath();
      for (let i = 0; i < N; i++)
        i === 0 ? ct.moveTo(px(i, R * s), py(i, R * s)) : ct.lineTo(px(i, R * s), py(i, R * s));
      ct.closePath();
      ct.strokeStyle = 'rgba(220,110,155,.09)';
      ct.lineWidth = 1; ct.stroke();
    });
    // spokes
    for (let i = 0; i < N; i++) {
      ct.beginPath(); ct.moveTo(cx, cy); ct.lineTo(px(i, R), py(i, R));
      ct.strokeStyle = 'rgba(220,110,155,.08)'; ct.lineWidth = 1; ct.stroke();
    }
    // fill
    ct.beginPath();
    for (let i = 0; i < N; i++) {
      const r = R * vals[i] * p;
      i === 0 ? ct.moveTo(px(i, r), py(i, r)) : ct.lineTo(px(i, r), py(i, r));
    }
    ct.closePath();
    const g = ct.createRadialGradient(cx, cy, 0, cx, cy, R);
    g.addColorStop(0, 'rgba(220,110,155,.32)');
    g.addColorStop(1, 'rgba(210,160,80,.06)');
    ct.fillStyle = g; ct.fill();
    ct.strokeStyle = 'rgba(220,110,155,.52)'; ct.lineWidth = 1.5; ct.stroke();
    // dots
    for (let i = 0; i < N; i++) {
      const r = R * vals[i] * p;
      ct.beginPath(); ct.arc(px(i, r), py(i, r), 4, 0, Math.PI * 2);
      ct.fillStyle = '#dc6e9b'; ct.fill();
      ct.strokeStyle = '#07070f'; ct.lineWidth = 2; ct.stroke();
    }
    // labels
    ct.font = '600 11.5px "Outfit",sans-serif';
    ct.textAlign = 'center'; ct.textBaseline = 'middle';
    for (let i = 0; i < N; i++) {
      ct.fillStyle = '#948faa';
      ct.fillText(labels[i], px(i, R + 24), py(i, R + 22));
    }
  }

  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      const s = performance.now();
      (function tick(now) {
        const prog = Math.min((now - s) / 1200, 1);
        draw(1 - Math.pow(1 - prog, 3));
        if (prog < 1) requestAnimationFrame(tick);
      })(s);
      io.unobserve(c);
    }
  }, { threshold: .3 });
  io.observe(c);
  draw(0);
}

/* ─── Orbit Chips (Hero) ──────────────────────────────── */
function initOrbit() {
  const ids = ['op1', 'op2', 'op3', 'op4', 'op5'];
  const OCX = 270, OCY = 270, OR = 248;
  const existing = ids.map(id => document.getElementById(id)).filter(Boolean);
  if (!existing.length) return;

  function tick(t) {
    existing.forEach((el, i) => {
      const angle = t * .00042 + (i / existing.length) * Math.PI * 2;
      el.style.left  = (OCX + OR * Math.cos(angle) - el.offsetWidth  / 2) + 'px';
      el.style.top   = (OCY + OR * Math.sin(angle) - el.offsetHeight / 2) + 'px';
      el.style.transform = 'none';
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ─── Certificate Modal ───────────────────────────────── */
function initCertModal() {
  const modal    = document.getElementById('certModal');
  const overlay  = document.getElementById('certOverlay');
  const closeBtn = document.getElementById('certClose');
  if (!modal) return;

  document.querySelectorAll('[data-cert]').forEach(card => {
    card.addEventListener('click', () => {
      const d = card.dataset;
      modal.querySelector('#mTitle').textContent   = d.title   || '';
      modal.querySelector('#mOrg').textContent     = d.org     || '';
      modal.querySelector('#mDate').textContent    = d.date    || '';
      modal.querySelector('#mId').textContent      = d.certid  || '-';
      modal.querySelector('#mDesc').textContent    = d.desc    || '';
      const img = modal.querySelector('#mImg');
      if (d.img) { img.src = d.img; img.style.display = 'block'; }
      else img.style.display = 'none';
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function close() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
  closeBtn?.addEventListener('click', close);
  overlay?.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* ─── Contact Form ────────────────────────────────────── */
function initContactForm() {
  const btn = document.getElementById('cf-send');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const name  = document.getElementById('cf-name')?.value.trim();
    const email = document.getElementById('cf-email')?.value.trim();
    const subj  = document.getElementById('cf-subj')?.value.trim();
    const msg   = document.getElementById('cf-msg')?.value.trim();
    const out   = document.getElementById('cf-feedback');

    if (!name || !email || !msg) {
      if (out) { out.textContent = '⚠ Mohon isi semua kolom yang wajib.'; out.style.color = 'var(--rose)'; }
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (out) { out.textContent = '⚠ Format email tidak valid.'; out.style.color = 'var(--rose)'; }
      return;
    }
    if (out) {
      out.textContent = '✓ Pesan terkirim! Terima kasih ' + name + ' 🌸';
      out.style.color = 'var(--gold2)';
    }
    ['cf-name','cf-email','cf-subj','cf-msg'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  });
}

/* ─── Smooth Hash Scroll ──────────────────────────────── */
function initSmoothHash() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ─── Init All ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initNavScroll();
  initCursor();
  initParticles();
  initReveal();
  initCounters();
  initSkillBars();
  initRadar();
  initOrbit();
  initCertModal();
  initContactForm();
  initSmoothHash();
});