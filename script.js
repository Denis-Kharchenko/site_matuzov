const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-toggle]');
const mobileNav = document.querySelector('[data-mobile-nav]');
const contactModal = document.querySelector('[data-contact-modal]');
const videoModal = document.querySelector('[data-video-modal]');
const contextInput = document.querySelector('[data-context-input]');
const toast = document.querySelector('[data-toast]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!reduceMotion.matches) document.documentElement.classList.add('motion-ready');

const hero = document.querySelector('.hero');
if (hero && header) {
  const headerObserver = new IntersectionObserver(
    ([entry]) => header.classList.toggle('scrolled', !entry.isIntersecting),
    { threshold: 0.08 }
  );
  headerObserver.observe(hero);
}

if (hero && !reduceMotion.matches && window.matchMedia('(pointer: fine)').matches) {
  let frame = 0;
  let target = { x: 0, y: 0 };

  const renderParallax = () => {
    hero.style.setProperty('--hero-x', `${target.x.toFixed(2)}px`);
    hero.style.setProperty('--hero-y', `${target.y.toFixed(2)}px`);
    frame = 0;
  };

  const scheduleParallax = () => {
    if (!frame) frame = window.requestAnimationFrame(renderParallax);
  };

  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    target = {
      x: ((event.clientX - rect.left) / rect.width - 0.5) * -10,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * -6,
    };
    scheduleParallax();
  });

  hero.addEventListener('pointerleave', () => { target = { x: 0, y: 0 }; scheduleParallax(); });
}

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  mobileNav?.classList.toggle('open', !isOpen);
});

mobileNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

const openDialog = (dialog) => {
  if (!dialog) return;
  dialog.showModal();
  document.body.classList.add('modal-open');
};

const closeDialog = (dialog) => {
  if (!dialog) return;
  dialog.close();
  document.body.classList.remove('modal-open');
};

document.querySelectorAll('[data-open-contact]').forEach((button) => {
  button.addEventListener('click', () => {
    if (contextInput) contextInput.value = button.dataset.context || 'Общий запрос';
    openDialog(contactModal);
  });
});

document.querySelector('[data-close-modal]')?.addEventListener('click', () => closeDialog(contactModal));
document.querySelectorAll('[data-open-video]').forEach((button) => button.addEventListener('click', () => openDialog(videoModal)));
document.querySelector('[data-close-video]')?.addEventListener('click', () => closeDialog(videoModal));

[contactModal, videoModal].forEach((dialog) => {
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog(dialog);
  });
  dialog?.addEventListener('close', () => document.body.classList.remove('modal-open'));
});

document.querySelectorAll('[data-demo-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    form.reset();
    closeDialog(contactModal);
    toast?.classList.add('show');
    window.setTimeout(() => toast?.classList.remove('show'), 4200);
  });
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

document.querySelectorAll('.case-item').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.case-item').forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});
