// Beach House Bliss — main.js

// Mobile nav toggle
document.getElementById('hamburger').addEventListener('click', function () {
  const nav = document.getElementById('navLinks');
  const isOpen = nav.classList.toggle('open');
  this.setAttribute('aria-expanded', isOpen);
});

// Close mobile nav when a link is clicked
document.querySelectorAll('#navLinks a').forEach(function (link) {
  link.addEventListener('click', function () {
    document.getElementById('navLinks').classList.remove('open');
  });
});

// Contact form: build a mailto: link from field values and open it
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const phone   = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    const subject = encodeURIComponent('Beach House Bliss OC – Dog Sitting Inquiry');
    const body    = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`
    );

    window.location.href =
      `mailto:terrisuzannelee@gmail.com?subject=${subject}&body=${body}`;
  });
}

// ── Gallery Lightbox ───────────────────────
(function () {
  const lb      = document.getElementById('lightbox');
  if (!lb) return;  // gallery not present on this page
  const lbImg   = document.getElementById('lightboxImg');
  const figures = Array.from(document.querySelectorAll('.gallery-grid figure'));
  let current   = 0;
  let triggerEl = null;

  function open(idx) {
    triggerEl  = figures[idx];
    current    = idx;
    lbImg.src  = figures[idx].querySelector('img').src;
    lbImg.alt  = figures[idx].querySelector('img').alt;
    lb.classList.add('open');
    lb.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    document.getElementById('lightboxClose').focus();
  }

  function close() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lbImg.src = '';
    lbImg.alt = '';
    if (triggerEl) triggerEl.focus();
  }

  function prev() { open((current - 1 + figures.length) % figures.length); }
  function next() { open((current + 1) % figures.length); }

  figures.forEach((fig, i) => fig.addEventListener('click', () => open(i)));

  document.getElementById('lightboxClose').addEventListener('click', close);
  document.getElementById('lightboxPrev').addEventListener('click', prev);
  document.getElementById('lightboxNext').addEventListener('click', next);

  lb.addEventListener('click', e => { if (e.target === lb) close(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });
}());
