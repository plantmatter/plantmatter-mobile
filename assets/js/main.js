/* PLANT MATTER — MOBILE (m.plantmatter.kr) */
(() => {
  /* 아직 없는 페이지·기능: 누르면 '준비 중' 안내 */
  const toast = document.querySelector('.toast');
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
      showToast(`${el.dataset.soon} · 준비 중입니다`);
    });
  });

  /* 검색 (전체 화면) */
  const search = document.getElementById('search');
  const openBtn = document.querySelector('[data-search-open]');
  const input = document.getElementById('search-input');
  const msg = search.querySelector('.search__msg');
  const setSearch = (open) => {
    search.classList.toggle('is-open', open);
    search.setAttribute('aria-hidden', String(!open));
    openBtn.setAttribute('aria-expanded', String(open));
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) input.focus();
    else { msg.textContent = ''; input.blur(); }
  };
  openBtn.addEventListener('click', () => setSearch(true));
  search.querySelector('[data-search-close]').addEventListener('click', () => setSearch(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && search.classList.contains('is-open')) setSearch(false);
  });
  search.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    msg.textContent = q ? `‘${q}’ — 검색 기능은 준비 중입니다.` : '검색어를 입력해 주세요.';
    input.blur();
  });

  /* 'PC 버전'을 누르면 모바일 고정 설정을 지움 */
  document.querySelector('.foot__pc')?.addEventListener('click', () => {
    try { localStorage.removeItem('pm-view'); } catch (e) {}
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
