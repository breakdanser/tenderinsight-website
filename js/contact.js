const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');

function validateField(field) {
  const wrapper = field.closest('.field');
  const valid = field.checkValidity();
  wrapper?.classList.toggle('invalid', !valid);
  return valid;
}

contactForm?.querySelectorAll('input, select, textarea').forEach((field) => {
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    if (field.closest('.field')?.classList.contains('invalid')) validateField(field);
  });
});

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = [...contactForm.querySelectorAll('input, select, textarea')];
  const valid = fields.every(validateField);
  if (!valid) {
    formStatus.textContent = 'Controleer de gemarkeerde velden.';
    contactForm.querySelector('.invalid input, .invalid select, .invalid textarea')?.focus();
    return;
  }
  const data = new FormData(contactForm);
  const subject = `Websiteaanvraag: ${data.get('subject')} — ${data.get('organisation')}`;
  const body = [`Naam: ${data.get('name')}`, `Organisatie: ${data.get('organisation')}`, `E-mail: ${data.get('email')}`, `Telefoon: ${data.get('phone') || 'Niet opgegeven'}`, '', 'Vraag:', data.get('message')].join('\n');
  formStatus.textContent = 'Uw e-mailprogramma wordt geopend. Controleer het bericht en klik daar op Verzenden.';
  window.location.href = `mailto:info@tenderinsight.be?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
