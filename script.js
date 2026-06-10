/* ── Année dynamique dans le footer ─────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── Navbar : effet scroll ───────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── Menu burger (mobile) ────────────────────────────────── */
const burgerBtn  = document.getElementById('burger-btn');
const mobileMenu = document.getElementById('mobile-menu');
const burgerIcon = document.getElementById('burger-icon');
const closeIcon  = document.getElementById('close-icon');

burgerBtn.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burgerIcon.classList.toggle('hidden', isOpen);
  closeIcon.classList.toggle('hidden', !isOpen);
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burgerIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
  });
});

/* ── Smooth scroll pour les ancres ──────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
  });
});

/* ── Envoi du formulaire ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('[type="submit"]');
    const errorBox = document.getElementById('form-error');
    const successBox = document.getElementById('form-success');

    errorBox.style.display = 'none';
    successBox.style.display = 'none';

    const prenom = document.getElementById('prenom').value.trim();
    const nom    = document.getElementById('nom').value.trim();
    const email  = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!prenom || !nom || !email || !message) {
      errorBox.innerText = 'Veuillez remplir tous les champs obligatoires (*).';
      errorBox.style.display = 'block';
      return;
    }

    btn.disabled = true;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>Envoi en cours...</span>';

    try {
      const response = await fetch('contact.php', {
        method: 'POST',
        body: new FormData(form)
      });

      if (!response.ok) throw new Error('Erreur serveur');
      const data = await response.json();

      if (data.status === 'success') {
        form.reset();
        successBox.style.display = 'block';
        setTimeout(() => successBox.style.display = 'none', 6000);
      } else {
        errorBox.innerText = data.message || 'Une erreur est survenue.';
        errorBox.style.display = 'block';
      }
    } catch (err) {
      errorBox.innerText = 'Impossible de joindre le serveur. Veuillez réessayer.';
      errorBox.style.display = 'block';
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  });
});
/* ── Pièces jointes ──────────────────────────────────────── */
function updateFileLabel(input) {
  const files    = Array.from(input.files);
  const label    = document.getElementById('file-label');
  const fileList = document.getElementById('file-list');
  const badge    = document.getElementById('attachment-badge');

  if (!files.length) {
    label.textContent = 'Glissez vos fichiers ici ou utilisez le bouton ci-dessus';
    fileList.classList.add('hidden');
    fileList.innerHTML = '';
    badge.classList.add('hidden');
    return;
  }

  badge.textContent = files.length;
  badge.classList.remove('hidden');

  label.textContent = files.length === 1
    ? files[0].name
    : `${files.length} fichier(s) sélectionné(s)`;

  fileList.innerHTML = '';
  files.forEach(file => {
    const sizeMo = (file.size / 1024 / 1024).toFixed(2);
    const item = document.createElement('div');
    item.className = 'flex items-center gap-2 text-xs text-slate-600 bg-slate-100 rounded-lg px-3 py-1.5';
    item.innerHTML = `
      <svg class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
      </svg>
      <span class="truncate">${file.name}</span>
      <span class="ml-auto text-slate-400 flex-shrink-0">${sizeMo} Mo</span>`;
    fileList.appendChild(item);
  });
  fileList.classList.remove('hidden');
}

// Drag & drop sur la zone pointillée
document.addEventListener('DOMContentLoaded', () => {
  const dropZone  = document.querySelector('.file-drop-zone');
  const fileInput = document.getElementById('attachments');
  if (!dropZone || !fileInput) return;

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
  ['dragleave', 'dragend'].forEach(evt =>
    dropZone.addEventListener(evt, () => dropZone.classList.remove('drag-over'))
  );
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      updateFileLabel(fileInput);
    }
  });
});

/* ── Animations d'apparition au scroll ──────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
