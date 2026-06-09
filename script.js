document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Empêche le rechargement brut de la page

      const form = event.target;
      const submitBtn = form.querySelector(".form-submit-btn");
      const errorBox = document.getElementById("form-error");
      const successBox = document.getElementById("form-success");

      // Réinitialisation des messages
      errorBox.style.display = "none";
      successBox.style.display = "none";
      errorBox.innerText = "";

      // Récupération et vérification des champs obligatoires
      const prenom = document.getElementById("f-prenom").value.trim();
      const nom = document.getElementById("f-nom").value.trim();
      const email = document.getElementById("f-email").value.trim();
      const message = document.getElementById("f-message").value.trim();

      if (!prenom || !nom || !email || !message) {
        errorBox.innerText = "Veuillez remplir tous les champs obligatoires (*).";
        errorBox.style.display = "block";
        return;
      }

      // Changement visuel du bouton (état de chargement)
      submitBtn.disabled = true;
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = "<span>Envoi en cours...</span>";

      // CRUCIAL : On récupère TOUTES les données du formulaire, y COMPRIS le fichier
      const formData = new FormData(form);

      try {
        // Envoi dynamique vers contact.php
        const response = await fetch(form.action, {
          method: form.method,
          body: formData // Contient le texte ET la pièce jointe
        });

        const result = await response.json();

        if (response.ok && result.status === "success") {
          // Tout s'est bien passé
          successBox.innerText = result.message;
          successBox.style.display = "block";
          form.reset(); // On vide le formulaire
        } else {
          // Le fichier php a renvoyé une erreur (ex: fichier trop gros)
          errorBox.innerText = result.message || "Une erreur est survenue lors de l'envoi.";
          errorBox.style.display = "block";
        }
      } catch (error) {
        // Erreur de connexion réseau
        errorBox.innerText = "Impossible de joindre le serveur de messagerie. Veuillez réessayer.";
        errorBox.style.display = "block";
      } finally {
        // On remet le bouton à son état normal
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }
});

// Menu burger
const burgerBtn = document.getElementById('burger-btn');
const mobileMenu = document.getElementById('mobile-menu');

burgerBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});

// Ajouter dans script.js
document.addEventListener('click', (e) => {
  if (!mobileMenu.contains(e.target) && !burgerBtn.contains(e.target)) {
    mobileMenu.classList.remove('open');
  }
});