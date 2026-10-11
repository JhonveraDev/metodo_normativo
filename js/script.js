const detailByChain = {
  type: {
    label: '3.4 · TIPO DE ACCIDENTE',
    title: 'El suceso productor',
    text: 'Selecciona la forma que mejor describe cómo ocurrió el contacto, o la acción o movimiento que originó la lesión cuando el agente de la lesión fue un movimiento corporal.',
    source: 'Base: PDF, p. 6'
  },
  condition: {
    label: '3.5 · CONDICIÓN AMBIENTAL PELIGROSA',
    title: 'El factor físico o circunstancia',
    text: 'Registra la condición que permitió u ocasionó el suceso. Se refiere a objetos, sustancias o ambiente, no a un defecto o debilidad física de una persona.',
    source: 'Base: PDF, pp. 6–7'
  },
  agent: {
    label: '3.6 · AGENTE DEL ACCIDENTE',
    title: 'Dónde existía la condición',
    text: 'Nombra el objeto, sustancia, elemento o estructura al que se refiere la condición peligrosa previamente designada.',
    source: 'Base: PDF, p. 7'
  },
  part: {
    label: '3.7 · PARTE DEL AGENTE',
    title: 'El detalle identificable',
    text: 'Precisa la parte importante del agente donde se encontraba la condición. Es una subclasificación que aumenta el nivel de detalle del registro.',
    source: 'Base: PDF, p. 8'
  },
  act: {
    label: '3.8 · ACTO INSEGURO',
    title: 'La acción u omisión vinculada',
    text: 'Registra la acción personal insegura que causó o permitió directamente el tipo de accidente, cuando existe una alternativa razonable menos peligrosa.',
    source: 'Base: PDF, pp. 8–9'
  }
};

const chainSteps = document.querySelectorAll('.chain-step');
const chainDetail = document.querySelector('.chain-detail');

chainSteps.forEach((step) => {
  step.addEventListener('click', () => {
    const detail = detailByChain[step.dataset.chain];
    chainSteps.forEach((item) => item.classList.toggle('is-selected', item === step));
    chainDetail.innerHTML = `
      <p class="chain-kicker">${detail.label}</p>
      <h3>${detail.title}</h3>
      <p>${detail.text}</p>
      <small>${detail.source}</small>`;
  });
});

const tabs = document.querySelectorAll('[role="tab"]');
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-selected', selected);
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    });
  });

  tab.addEventListener('keydown', (event) => {
    const current = [...tabs].indexOf(tab);
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'ArrowRight' ? (current + 1) % tabs.length : (current - 1 + tabs.length) % tabs.length;
    tabs[next].focus();
    tabs[next].click();
  });
});

const actDetail = document.getElementById('actDetail');
document.querySelectorAll('.act-item').forEach((item) => {
  item.addEventListener('click', () => {
    const wasActive = item.classList.contains('is-active');
    document.querySelectorAll('.act-item').forEach((button) => button.classList.remove('is-active'));
    if (wasActive) {
      actDetail.textContent = 'Selecciona un grupo para revisar una explicación breve del anexo.';
      return;
    }
    item.classList.add('is-active');
    actDetail.textContent = item.dataset.act;
  });
});

const revealCase = document.getElementById('revealCase');
const caseSteps = document.getElementById('caseSteps');
revealCase.addEventListener('click', () => {
  const hidden = caseSteps.hidden;
  caseSteps.hidden = !hidden;
  revealCase.textContent = hidden ? 'Ocultar clasificación razonada' : 'Ver clasificación razonada';
  revealCase.setAttribute('aria-expanded', hidden);
});

const quizForm = document.getElementById('quizForm');
const quizResult = document.getElementById('quizResult');
quizForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const answers = new FormData(quizForm);
  const expected = { q1: 'b', q2: 'b', q3: 'a' };
  const complete = Object.keys(expected).every((question) => answers.has(question));

  if (!complete) {
    quizResult.textContent = 'Selecciona una respuesta en cada pregunta antes de comprobar.';
    return;
  }

  const score = Object.entries(expected).filter(([question, answer]) => answers.get(question) === answer).length;
  const feedback = score === 3
    ? '3 de 3. Muy bien: reconoces las relaciones que sostienen una clasificación consistente.'
    : `${score} de 3. Revisa: sin condición no hay agente del accidente; los dos tipos de agente pueden diferir; y el EPP debe ser esencial para prevenir el accidente.`;
  quizResult.textContent = feedback;
});

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', open);
  menuButton.querySelector('.sr-only').textContent = open ? 'Cerrar menú' : 'Abrir menú';
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const progress = document.getElementById('readingProgress');
const backToTop = document.querySelector('.back-to-top');
const updateReadingUi = () => {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = height > 0 ? (window.scrollY / height) * 100 : 0;
  progress.style.width = `${Math.min(100, percentage)}%`;
  backToTop.classList.toggle('is-visible', window.scrollY > 700);
};
window.addEventListener('scroll', updateReadingUi, { passive: true });
updateReadingUi();
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const sections = document.querySelectorAll('main .section-anchor[id]');
const navLinks = document.querySelectorAll('.primary-nav a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
sections.forEach((section) => sectionObserver.observe(section));

const motionAllowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (motionAllowed) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .08 });
  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
}

document.querySelectorAll('[data-open-modal]').forEach((trigger) => {
  trigger.addEventListener('click', () => document.getElementById(trigger.dataset.openModal).showModal());
});
document.querySelectorAll('.modal').forEach((modal) => {
  modal.querySelector('.modal-close').addEventListener('click', () => modal.close());
  modal.addEventListener('click', (event) => {
    const rect = modal.getBoundingClientRect();
    const clickedBackdrop = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (clickedBackdrop) modal.close();
  });
});
