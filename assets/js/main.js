/* PLANT MATTER — MOBILE (m.plantmatter.kr) */
(() => {
  const LANGS = ['ko', 'en', 'ja'];
  const DICT = window.PM_I18N || {};
  const root = document.documentElement;
  let lang = LANGS.includes(root.lang) ? root.lang : 'ko';

  const t = (key, vars = {}) => {
    const s = (DICT[lang] && DICT[lang][key]) ?? (DICT.ko && DICT.ko[key]) ?? key;
    return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
  };

  const toast = document.querySelector('.toast');
  const search = document.getElementById('search');
  const searchOpen = document.querySelector('[data-search-open]');
  const input = document.getElementById('search-input');
  const msg = search.querySelector('.search__msg');

  /* 검색창·언어 창·메뉴가 열려 있을 때 뒤 화면 스크롤 막기 */
  const lockScroll = () => {
    const open = search.classList.contains('is-open') || document.getElementById('lang-drawer').classList.contains('is-open')
      || Boolean(document.querySelector('.mega.is-open'));
    root.style.overflow = open ? 'hidden' : '';
  };

  /* ---------- 언어 ---------- */
  const applyLang = (next, save) => {
    lang = LANGS.includes(next) ? next : 'ko';
    root.lang = lang;
    if (save) { try { localStorage.setItem('pm-lang', lang); } catch (e) {} }
    document.title = t('title');
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('description'));
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      el.dataset.i18nAttr.split(';').forEach((pair) => {
        const [attr, key] = pair.split(':').map((s) => s.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });
    msg.textContent = '';
  };
  applyLang(lang, false);

  /* 주소의 ?lang= 은 적용 후 지워서 주소를 깔끔하게 */
  if (/[?&](lang|view)=/.test(location.search)) history.replaceState(null, '', location.pathname + location.hash);

  /* ---------- 탭 아래로 내려오는 메뉴 (PLANT) ---------- */
  /* 탭을 누르면 열리고, 한 번 더 누르거나 어두운 부분을 누르면 닫힘 */
  const gnb = document.querySelector('.gnb');
  const menuTabs = document.querySelectorAll('[data-menu]');
  let openMenu = null;
  const setMenu = (id) => {
    document.querySelectorAll('.mega').forEach((m) => {
      const on = m.id === `menu-${id}`;
      m.classList.toggle('is-open', on);
      m.setAttribute('aria-hidden', String(!on));
    });
    menuTabs.forEach((tab) => {
      const on = tab.dataset.menu === id;
      tab.classList.toggle('is-current', on);
      tab.setAttribute('aria-expanded', String(on));
    });
    gnb.classList.toggle('is-menu-open', Boolean(id));
    openMenu = id || null;
    lockScroll();
  };
  menuTabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      setMenu(openMenu === tab.dataset.menu ? null : tab.dataset.menu);
    });
  });
  document.querySelectorAll('[data-menu-close]').forEach((el) => el.addEventListener('click', () => setMenu(null)));

  /* ---------- 아직 없는 페이지·기능: '준비 중' 안내 ---------- */
  let toastTimer;
  const showToast = (text) => {
    toast.textContent = text;
    toast.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-show'), 2200);
  };
  document.querySelectorAll('[data-soon]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      if (!el.closest('.mega')) setMenu(null);
      showToast(t('soon', { name: t(el.dataset.soon) }));
    });
  });

  /* ---------- 검색 (전체 화면) ---------- */
  const setSearch = (open) => {
    search.classList.toggle('is-open', open);
    search.setAttribute('aria-hidden', String(!open));
    searchOpen.setAttribute('aria-expanded', String(open));
    lockScroll();
    if (open) input.focus();
    else { msg.textContent = ''; input.blur(); }
  };
  searchOpen.addEventListener('click', () => { setMenu(null); setSearch(true); });
  search.querySelector('[data-search-close]').addEventListener('click', () => setSearch(false));
  search.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    msg.textContent = q ? t('searchSoon', { q }) : t('searchEmpty');
    input.blur();
  });

  /* ---------- 언어 설정 창 ---------- */
  const drawer = document.getElementById('lang-drawer');
  const drawerOpen = document.querySelector('[data-lang-open]');
  const langSelect = document.getElementById('lang-select');
  const setDrawer = (open) => {
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    drawerOpen.setAttribute('aria-expanded', String(open));
    lockScroll();
    if (open) langSelect.value = lang;
    else drawerOpen.focus();
  };
  drawerOpen.addEventListener('click', () => { setMenu(null); setDrawer(true); });
  drawer.querySelectorAll('[data-drawer-close]').forEach((el) => el.addEventListener('click', () => setDrawer(false)));
  document.getElementById('lang-form').addEventListener('submit', (e) => {
    e.preventDefault();
    applyLang(langSelect.value, true);
    setDrawer(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (openMenu) setMenu(null);
    else if (drawer.classList.contains('is-open')) setDrawer(false);
    else if (search.classList.contains('is-open')) setSearch(false);
  });

  /* ---------- 홈 사진 슬라이드 (자동으로 넘어감) ---------- */
  const SLIDE_INTERVAL = 5000;   /* 한 장이 머무는 시간 (밀리초) */
  const hero = document.querySelector('.hero');
  const track = hero && hero.querySelector('.slides__track');
  if (track) {
    const bars = [...hero.querySelectorAll('.bar')];
    const count = bars.length;
    /* 마지막 → 첫 장으로 이어지게 첫 장 복사본을 맨 뒤에 붙임 */
    const clone = track.children[0].cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelector('img')?.removeAttribute('fetchpriority');
    track.appendChild(clone);
    hero.style.setProperty('--interval', `${SLIDE_INTERVAL}ms`);

    let index = 0;
    let busy = false;
    let busyTimer;
    const setPos = (i, animate) => {
      track.style.transition = animate ? '' : 'none';
      track.style.transform = `translateX(${-i * 100}%)`;
      if (!animate) void track.offsetWidth;   /* 즉시 적용 */
    };
    const activate = (k) => {
      bars.forEach((b) => { b.classList.remove('is-active'); b.setAttribute('aria-current', 'false'); });
      void bars[k].offsetWidth;               /* 막대 채우기 처음부터 다시 */
      bars[k].classList.add('is-active');
      bars[k].setAttribute('aria-current', 'true');
      [...track.children].forEach((s, j) => { if (j < count) s.setAttribute('aria-hidden', String(j !== k)); });
    };
    const goTo = (target) => {
      if (busy || target === index) return;
      busy = true;
      clearTimeout(busyTimer);
      busyTimer = setTimeout(() => { busy = false; }, 1400);
      if (target < 0) { setPos(count, false); target = count - 1; }   /* 첫 장에서 뒤로: 복사본 위치로 옮긴 뒤 이동 */
      index = target;
      setPos(index, true);
      activate(index % count);
    };
    const next = () => goTo(index + 1);
    const prev = () => goTo(index - 1);
    track.addEventListener('transitionend', (e) => {
      if (e.target !== track) return;
      busy = false;
      if (index === count) { index = 0; setPos(0, false); }   /* 복사본에 도착하면 진짜 첫 장으로 조용히 교체 */
    });

    bars.forEach((b, k) => {
      /* 막대가 다 차면 다음 사진으로 */
      b.querySelector('.bar__fill').addEventListener('animationend', () => { if (b.classList.contains('is-active')) next(); });
      b.addEventListener('click', () => {
        const cur = index % count;
        if (k === cur) return;
        goTo(k === 0 && cur === count - 1 ? count : k);
      });
    });

    /* 손가락으로 밀어 넘기기 */
    let sx = null;
    let sy = null;
    const area = hero.querySelector('.slides');
    area.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    area.addEventListener('touchend', (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? next : prev)();
      sx = null;
    }, { passive: true });

    /* 다른 탭을 보고 있을 때는 멈춤 */
    document.addEventListener('visibilitychange', () => hero.classList.toggle('is-paused', document.hidden));

    setPos(0, false);
    activate(0);
  }
})();
