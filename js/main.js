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

// Contact form: submit via Web3Forms and show inline confirmation
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }

    const data = new FormData(form);
    const res  = await fetch('https://api.web3forms.com/submit', {
      method: 'POST', body: data
    });
    const json = await res.json();

    if (json.success) {
      form.innerHTML = '<p class="form-success">Thanks! Terri will be in touch soon. 🐾</p>';
    } else {
      if (btn) { btn.textContent = 'Send Message ✨'; btn.disabled = false; }
      alert('Something went wrong — please try again or call/text 949-375-1419.');
    }
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
