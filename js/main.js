// Beach House Bliss — main.js

// Date pickers + cost estimator
const DAILY_RATE       = 120;
const PUPPY_SURCHARGE  = 30;
const LONG_STAY_DAYS   = 14;
const LONG_STAY_PCT    = 0.20;

let checkinPicker, checkoutPicker;

function updateEstimate() {
  const estimator = document.getElementById('cost-estimator');
  if (!checkinPicker || !checkoutPicker) return;

  const ci = checkinPicker.selectedDates[0];
  const co = checkoutPicker.selectedDates[0];
  if (!ci || !co) { estimator.classList.remove('visible'); return; }

  const days = Math.round((co - ci) / 86400000);
  if (days <= 0) { estimator.classList.remove('visible'); return; }

  const isPuppy  = document.getElementById('isPuppy').checked;
  const base     = days * DAILY_RATE;
  const puppy    = isPuppy ? days * PUPPY_SURCHARGE : 0;
  const subtotal = base + puppy;
  const isLong   = days >= LONG_STAY_DAYS;
  const discount = isLong ? subtotal * LONG_STAY_PCT : 0;
  const total    = subtotal - discount;

  const fmt = v => '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  document.getElementById('est-days-label').textContent    = days + ' day' + (days !== 1 ? 's' : '') + ' × $' + DAILY_RATE + '/day';
  document.getElementById('est-base-amount').textContent   = fmt(base);
  document.getElementById('est-puppy-label').textContent   = 'Puppy surcharge (' + days + ' × $' + PUPPY_SURCHARGE + ')';
  document.getElementById('est-puppy-amount').textContent  = fmt(puppy);
  document.getElementById('est-puppy-line').style.display  = isPuppy ? '' : 'none';
  document.getElementById('est-discount-amount').textContent = '−' + fmt(discount);
  document.getElementById('est-discount-line').style.display = isLong ? '' : 'none';
  document.getElementById('est-total').textContent   = fmt(total);
  document.getElementById('est-deposit').textContent = fmt(total * 0.5);

  // Populate hidden fields for form submission
  document.getElementById('est-field-days').value     = days + ' day' + (days !== 1 ? 's' : '');
  document.getElementById('est-field-base').value     = fmt(base);
  document.getElementById('est-field-puppy').value    = isPuppy ? fmt(puppy) : '';
  document.getElementById('est-field-discount').value = isLong  ? '−' + fmt(discount) : '';
  document.getElementById('est-field-total').value    = fmt(total);
  document.getElementById('est-field-deposit').value  = fmt(total * 0.5);

  estimator.classList.add('visible');
}

(function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  checkinPicker = flatpickr('#checkin', {
    minDate: today,
    dateFormat: 'M j, Y',
    disableMobile: false,
    onChange: function (selectedDates) {
      if (selectedDates[0]) {
        checkoutPicker.set('minDate', selectedDates[0]);
        if (checkoutPicker.selectedDates[0] && checkoutPicker.selectedDates[0] < selectedDates[0]) {
          checkoutPicker.clear();
        }
      }
      updateEstimate();
    }
  });

  checkoutPicker = flatpickr('#checkout', {
    minDate: today,
    dateFormat: 'M j, Y',
    disableMobile: false,
    onChange: updateEstimate
  });

  const puppyCheck = document.getElementById('isPuppy');
  if (puppyCheck) puppyCheck.addEventListener('change', updateEstimate);
}());

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
