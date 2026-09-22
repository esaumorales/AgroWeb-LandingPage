// Interacciones de la landing, una función por parte de la página

// Única fuente de las temporadas: alimenta el calendario y las tarjetas
const SEASONS = [
  { id: 'mango', name: 'Mango', image: 'img/fotografia/mango-96.webp', accent: '#E8872E', tint: '#FFE3C2', months: [11, 12, 1, 2, 3], peak: [12, 1, 2] },
  { id: 'palta', name: 'Palta Hass', image: 'img/fotografia/palta-96.webp', accent: '#4E7A2E', tint: '#DCEBCB', months: [4, 5, 6, 7, 8, 9], peak: [5, 6, 7] },
  { id: 'uva', name: 'Uva Red Globe', image: 'img/fotografia/uva-96.webp', accent: '#A33A5C', tint: '#F3D5DE', months: [10, 11, 12, 1], peak: [11, 12] },
  { id: 'banano', name: 'Banano orgánico', image: 'img/fotografia/banano-96.webp', accent: '#C99312', tint: '#FBEBB5', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], peak: [] },
];

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const MONTH_NAMES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const CURRENT_MONTH = new Date().getMonth() + 1;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initHeader() {
  const header = document.getElementById('header');
  const toggle = header.querySelector('.menu-toggle');
  const nav = document.getElementById('nav');

  const setMenu = (open) => {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  toggle.addEventListener('click', () => setMenu(!header.classList.contains('is-open')));
  nav.addEventListener('click', (event) => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });
}

// Marca en el menú la sección visible
function initActiveLink() {
  const links = [...document.querySelectorAll('.nav__link')];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => link.classList.toggle('is-active', link.hash === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  links.forEach((link) => {
    const section = document.querySelector(link.hash);
    if (section) observer.observe(section);
  });
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}

function initProgressBar() {
  const root = document.documentElement;
  const update = () => {
    const max = root.scrollHeight - window.innerHeight;
    root.style.setProperty('--progress', max > 0 ? (window.scrollY / max).toFixed(4) : 0);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

// Cuenta desde cero hasta el valor de data-count
function initCounters() {
  if (reduceMotion) return;

  const animate = (element) => {
    const target = Number(element.dataset.count);
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / 1100, 1);
      element.textContent = Math.round(target * (1 - (1 - progress) ** 3));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animate(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('[data-count]').forEach((element) => observer.observe(element));
}

// Texto corto de temporada, por ejemplo "Nov – Mar"
function formatSeason(months) {
  if (months.length === 12) return 'Todo el año';
  const first = months.find((month) => !months.includes(month === 1 ? 12 : month - 1));
  const last = months.find((month) => !months.includes(month === 12 ? 1 : month + 1));
  return `${MONTHS[first - 1]} – ${MONTHS[last - 1]}`;
}

function renderSeasonTags() {
  SEASONS.forEach((fruit) => {
    const tag = document.querySelector(`.fruit[data-fruit="${fruit.id}"] .fruit__season span`);
    if (tag) tag.textContent = formatSeason(fruit.months);
  });
}

function renderSeasonTable() {
  const table = document.getElementById('season-table');
  const nowClass = (month) => (month === CURRENT_MONTH ? ' class="is-now"' : '');

  const head = MONTHS.map((label, index) =>
    `<th scope="col"${nowClass(index + 1)}><abbr title="${MONTH_NAMES[index]}">${label}</abbr></th>`).join('');

  const rows = SEASONS.map((fruit) => {
    const cells = MONTHS.map((_, index) => {
      const month = index + 1;
      if (!fruit.months.includes(month)) {
        return `<td${nowClass(month)}><span class="visually-hidden">Sin oferta</span></td>`;
      }
      const isPeak = fruit.peak.includes(month);
      const classes = ['bar'];
      if (!fruit.months.includes(month - 1)) classes.push('bar--start');
      if (!fruit.months.includes(month + 1)) classes.push('bar--end');
      if (isPeak) classes.push('bar--peak');
      return `<td${nowClass(month)}><span class="${classes.join(' ')}" style="--m:${index}"><span class="visually-hidden">${isPeak ? 'Temporada alta' : 'Disponible'}</span></span></td>`;
    }).join('');

    return `<tr data-fruit="${fruit.id}" style="--accent:${fruit.accent}; --tint:${fruit.tint}">
      <th scope="row"><span class="calendar__fruit"><img src="${fruit.image}" alt="" width="32" height="32">${fruit.name}</span></th>${cells}</tr>`;
  }).join('');

  table.insertAdjacentHTML('beforeend', `<thead><tr><th scope="col"><span class="visually-hidden">Fruta</span></th>${head}</tr></thead><tbody>${rows}</tbody>`);
}

// Atenúa las filas que no coinciden con el filtro elegido
function initSeasonFilter() {
  const buttons = document.querySelectorAll('.filter');
  const rows = document.querySelectorAll('#season-table tbody tr');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      buttons.forEach((other) => {
        other.classList.toggle('is-active', other === button);
        other.setAttribute('aria-pressed', String(other === button));
      });
      rows.forEach((row) => row.classList.toggle('is-dimmed', filter !== 'all' && row.dataset.fruit !== filter));
    });
  });
}

// Voltea la tarjeta y deja inaccesible la cara oculta
function initFlipCards() {
  document.querySelectorAll('.fruit').forEach((card) => {
    const front = card.querySelector('.fruit__front');
    const back = card.querySelector('.fruit__back');
    const openButton = front.querySelector('.fruit__flip');
    const closeButton = back.querySelector('.fruit__flip');

    const setFlipped = (flipped) => {
      card.classList.toggle('is-flipped', flipped);
      openButton.setAttribute('aria-expanded', String(flipped));
      front.inert = flipped;
      back.inert = !flipped;
      front.setAttribute('aria-hidden', String(flipped));
      back.setAttribute('aria-hidden', String(!flipped));
      (flipped ? closeButton : openButton).focus({ preventScroll: true });
    };

    openButton.addEventListener('click', () => setFlipped(true));
    closeButton.addEventListener('click', () => setFlipped(false));
  });
}

// Sin backend: arma el correo y abre la app de correo del visitante
function initContactForm() {
  const form = document.getElementById('contact-form');
  const note = document.getElementById('form-note');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const subject = `Consulta desde la web - ${data.get('company') || data.get('name')}`;
    const body = [
      `Nombre: ${data.get('name')}`,
      `Empresa: ${data.get('company') || '-'}`,
      `Correo: ${data.get('email')}`,
      `Fruta de interés: ${data.get('fruit') || '-'}`,
      '',
      data.get('message'),
    ].join('\n');

    window.location.href = `mailto:${form.dataset.mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    note.textContent = 'Listo. Revisa tu aplicación de correo para enviar el mensaje.';
  });
}

renderSeasonTags();
renderSeasonTable();
initHeader();
initActiveLink();
initReveal();
initProgressBar();
initCounters();
initSeasonFilter();
initFlipCards();
initContactForm();
document.getElementById('year').textContent = new Date().getFullYear();
