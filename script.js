const overlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');

document.querySelectorAll('.open-modal').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });
});

modalClose.addEventListener('click', closeModal);

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

function openModal() {
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  goTo(1);
}

function closeModal() {
  overlay.classList.add('hidden');
  document.body.style.overflow = '';
}


function goTo(step) {
  ['step1', 'step2', 'step3', 'stepSuccess'].forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });

  const target = step === 'success'
    ? document.getElementById('stepSuccess')
    : document.getElementById('step' + step);

  target.classList.remove('hidden');

  const modal = document.querySelector('.modal');
  if (modal) modal.scrollTop = 0;
}

document.querySelectorAll('.checkbox-item').forEach(item => {
  item.addEventListener('change', () => {
    item.classList.toggle('selected', item.querySelector('input').checked);
  });
});


const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});