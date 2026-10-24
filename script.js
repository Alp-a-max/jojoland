const root = document.documentElement;
const themeButton = document.getElementById('theme');
const dialog = document.getElementById('stand-dialog');
const dialogContent = dialog.querySelector('.dialog-content');
const dialogClose = dialog.querySelector('.dialog-close');
let lastDialogTrigger = null;
let refreshTimer = 0;

function isDarkTheme() {
  if (root.dataset.theme) return root.dataset.theme === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function updateThemeButton() {
  const dark = isDarkTheme();
  themeButton.textContent = dark ? 'Mürekkep: Koyu' : 'Mürekkep: Açık';
  themeButton.setAttribute('aria-pressed', String(dark));
}

function toggleTheme() {
  const theme = isDarkTheme() ? 'light' : 'dark';
  root.dataset.theme = theme;
  try {
    localStorage.setItem('jojo-gallery-theme', theme);
  } catch (error) {
    // Tema bu oturumda uygulanır; depolama kullanılamıyorsa kalıcı olmaz.
  }
  updateThemeButton();
}

function rankValue(rank) {
  return ({ E: 1, D: 2, C: 3, B: 4, A: 5, S: 6 })[rank] || 0;
}

function drawRadar(article) {
  const chart = article.querySelector('.radar');
  const polygon = chart.querySelector('.radar-value');
  const statItems = [...article.querySelectorAll('.stats .bd')];
  const labels = statItems.map((item) => {
    const name = item.querySelector('span').textContent;
    const rank = item.dataset.r;
    return `${name} ${rank === '?' ? 'bilinmiyor' : rank}`;
  });
  const angles = [-90, -30, 30, 90, 150, 210];
  const points = statItems.map((item, index) => {
    const radius = rankValue(item.dataset.r) / 6 * 58;
    const angle = angles[index] * Math.PI / 180;
    const x = 80 + Math.cos(angle) * radius;
    const y = 80 + Math.sin(angle) * radius;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  polygon.setAttribute('points', points.join(' '));
  chart.setAttribute('aria-label', `${article.querySelector('.copy h2').textContent} parametre grafiği: ${labels.join(', ')}.`);
  chart.querySelector('desc').textContent = labels.join(', ') + '.';
}

function setupImageFallbacks() {
  document.querySelectorAll('img').forEach((image) => {
    const showFallback = () => {
      const picture = image.closest('picture');
      if (picture && !image.dataset.fallbackTried && image.currentSrc && image.currentSrc !== image.src) {
        image.dataset.fallbackTried = 'true';
        picture.querySelectorAll('source').forEach((source) => source.remove());
        image.src = image.getAttribute('src');
        return;
      }
      if (image.closest('.hero-cover')) { image.remove(); return; }
      image.closest('.ph')?.classList.add('has-error');
    };
    image.addEventListener('error', showFallback);
    if (image.complete && image.naturalWidth === 0) showFallback();
    image.addEventListener('load', scheduleScrollRefresh);
  });
}

function scheduleScrollRefresh() {
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => {
    updateScrollControls();
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }, 120);
}

function openStandDialog(trigger) {
  const article = trigger.closest('[data-stand]');
  if (!article || typeof dialog.showModal !== 'function') return;
  lastDialogTrigger = trigger;
  const picture = article.querySelector('.main picture').cloneNode(true);
  const detailImage = picture.querySelector('img');
  detailImage.loading = 'eager';
  detailImage.removeAttribute('onerror');
  const title = article.querySelector('.copy h2').textContent;
  const copy = article.querySelector('.copy');
  const user = copy.querySelector('.user').textContent.trim();
  const description = [...copy.querySelectorAll(':scope > p')]
    .find((paragraph) => !paragraph.classList.contains('user')).textContent;
  const part = copy.querySelector('.cap').textContent;
  const tags = copy.querySelector('.tg').cloneNode(true);
  const stats = copy.querySelector('.stats').cloneNode(true);

  dialogContent.replaceChildren();
  const media = document.createElement('div');
  media.className = 'dialog-media';
  media.append(picture);
  const detail = document.createElement('div');
  detail.className = 'dialog-copy';
  const cap = document.createElement('span');
  cap.className = 'cap';
  cap.textContent = part;
  const heading = document.createElement('h2');
  heading.id = 'dialog-title';
  heading.textContent = title;
  const descriptionNode = document.createElement('p');
  descriptionNode.textContent = description;
  const userNode = document.createElement('p');
  userNode.className = 'user';
  userNode.textContent = user;
  const abilityHeading = document.createElement('h3');
  abilityHeading.textContent = 'Yetenekler';
  const statsHeading = document.createElement('h3');
  statsHeading.textContent = 'Stand parametreleri';
  detail.append(cap, heading, userNode, descriptionNode, abilityHeading, tags, statsHeading, stats);
  dialogContent.append(media, detail);
  dialog.showModal();
  dialogClose.focus();
}

function closeStandDialog() {
  if (dialog.open) dialog.close();
}

function trapDialogFocus(event) {
  if (event.key !== 'Tab') return;
  const focusable = [...dialog.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')]
    .filter((element) => !element.disabled);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function setupLightbox() {
  document.querySelectorAll('.stand-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => openStandDialog(trigger));
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        openStandDialog(trigger);
      }
    });
  });
  dialogClose.addEventListener('click', closeStandDialog);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeStandDialog();
  });
  dialog.addEventListener('keydown', trapDialogFocus);
  dialog.addEventListener('close', () => lastDialogTrigger?.focus());
}

function setupPartFilters() {
  const buttons = [...document.querySelectorAll('.filter-button')];
  const articles = [...document.querySelectorAll('.spread[data-stand]')];
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      let visibleIndex = 0;
      articles.forEach((article) => {
        const visible = filter === 'all' || article.dataset.part === filter;
        article.hidden = !visible;
        article.classList.toggle('flip', visible && visibleIndex % 2 === 1);
        if (visible) visibleIndex += 1;
      });
      scheduleScrollRefresh();
    });
  });
}

function updateScrollControls() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  document.getElementById('scroll-progress').style.transform = `scaleX(${progress})`;
  document.getElementById('back-to-top').classList.toggle('is-visible', window.scrollY > 500);
}

function setupScrollControls() {
  const topButton = document.getElementById('back-to-top');
  topButton.addEventListener('click', () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  });
  window.addEventListener('scroll', updateScrollControls, { passive: true });
  window.addEventListener('resize', updateScrollControls, { passive: true });
  updateScrollControls();
}

function setupRadarReveal() {
  const articles = document.querySelectorAll('.spread[data-stand]');
  if (!('IntersectionObserver' in window)) {
    articles.forEach((article) => article.classList.add('is-inview'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-inview');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });
  articles.forEach((article) => observer.observe(article));
}

function setupAnimations() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;
  window.gsap.registerPlugin(window.ScrollTrigger);
  const gsap = window.gsap;
  gsap.timeline({ defaults: { ease: 'power4.out' } })
    .from('.hero-cover-frame', { scale: 0.96, opacity: 0, duration: 1.1 })
    .from('.hero-title', { y: 28, opacity: 0, duration: 0.75 }, '-=0.65')
    .from('.chapter-ribbon, .cue', { y: 18, opacity: 0, duration: 0.55, stagger: 0.12 }, '-=0.4')
    .from('.hero .sfx', { opacity: 0, duration: 0.8, stagger: 0.18 }, '-=0.65');

  gsap.utils.toArray('.spread[data-stand]').forEach((article, index) => {
    const direction = index % 2 ? 1 : -1;
    const timeline = gsap.timeline({
      scrollTrigger: { trigger: article, start: 'top 68%', once: true },
      defaults: { ease: 'expo.out' }
    });
    timeline.from(article.querySelector('.main .pn'), {
      x: direction * 150, opacity: 0, duration: 1.05
    }).from(article.querySelectorAll('.copy > *'), {
      y: 28, opacity: 0, duration: 0.65, stagger: 0.08
    }, '-=0.7');
  });
  gsap.utils.toArray('.spread .sfx, .contact .sfx').forEach((effect) => {
    gsap.from(effect, {
      opacity: 0, duration: 0.8,
      scrollTrigger: { trigger: effect.closest('section, footer'), start: 'top 92%', once: true }
    });
  });
}

function initGallery() {
  updateThemeButton();
  themeButton.addEventListener('click', toggleTheme);
  document.querySelectorAll('.spread[data-stand]').forEach(drawRadar);
  setupImageFallbacks();
  setupLightbox();
  setupPartFilters();
  setupScrollControls();
  setupRadarReveal();
  setupAnimations();
  window.addEventListener('load', scheduleScrollRefresh, { once: true });
  document.addEventListener('load', scheduleScrollRefresh, true);
}

initGallery();