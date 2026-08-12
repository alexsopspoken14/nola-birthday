/* ============================================================
   MAIN — navigasi antar halaman, tali jemuran progress, efek
   ketik, rotasi kata-kata, dan inisialisasi semua modul lain.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const pages = Array.from(document.querySelectorAll('.page'))
    .sort((a, b) => Number(a.dataset.page) - Number(b.dataset.page));
  const pegsWrap = document.getElementById('pegs');
  let current = 0;
  const visited = new Set([0]);
  let pegEls = [];

  /* ---------- isi konten dinamis dari CONFIG ---------- */
  document.title = 'Kado Ulang Tahun untuk ' + CONFIG.nama + ' 🎁';
  setText('coverTitle', 'Selamat Ulang Tahun, ' + CONFIG.nama + '! 🎂');
  setText('greetTitle', 'Halo, ' + CONFIG.nama + '.');
  setText('finaleSignoff', 'dari akuu, ' + CONFIG.pengirim);

  const coverPhoto = document.getElementById('coverPhoto');
  coverPhoto.src = CONFIG.fotoSampul;
  coverPhoto.onerror = () => coverPhoto.closest('.photo-wrap').classList.add('img-error');

  const coverBg = document.getElementById('coverBg');
  const bgImg = new Image();
  bgImg.onload = () => {
    coverBg.style.backgroundImage = `url('${CONFIG.fotoBackground}')`;
    coverBg.classList.add('is-loaded');
  };
  bgImg.src = CONFIG.fotoBackground;

  setText('finaleMessage', CONFIG.emailJS.message);

  /* ---------- galleries ---------- */
  Gallery.render('galleryKamu', CONFIG.albumKamu, 'kamu');
  Gallery.render('galleryKenangan', CONFIG.albumKenangan, 'kenangan');

  /* ---------- games ---------- */
  Games.initGame1();
  Games.initGame2();

  /* ---------- email ---------- */
  EmailFlow.init();
  /* ---------- musik latar (autoplay + loop) ---------- */
  initMusic();

  /* ---------- clothesline pegs ---------- */
  function buildPegs(){
    pegsWrap.innerHTML = '';
    pegEls = pages.map((p, idx) => {
      const peg = document.createElement('button');
      peg.className = 'peg';
      peg.type = 'button';
      peg.title = p.dataset.title || ('Halaman ' + (idx + 1));
      peg.addEventListener('click', () => {
        if (visited.has(idx)) showPage(idx);
      });
      pegsWrap.appendChild(peg);
      return peg;
    });
    refreshPegs();
  }

  function refreshPegs(){
    pegEls.forEach((peg, idx) => {
      peg.classList.remove('is-visited', 'is-current', 'is-locked');
      if (idx === current) peg.classList.add('is-current');
      else if (visited.has(idx)) peg.classList.add('is-visited');
      else peg.classList.add('is-locked');
    });
  }

  /* ---------- navigasi halaman ---------- */
  function showPage(idx){
    if (idx < 0 || idx >= pages.length) return;
    pages[current].classList.remove('active');
    current = idx;
    visited.add(idx);
    pages[current].classList.add('active');
    refreshPegs();
    window.scrollTo(0, 0);

    if (idx === 1) runTypewriterOnce();
    if (idx === 3) initQuotesOnce();
    if (idx === 8) EmailFlow.sendOnce();
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-next]')){
      const btn = e.target.closest('[data-next]');
      if (btn.hasAttribute('disabled')) return;
      showPage(current + 1);
    }
    if (e.target.closest('[data-back]')){
      showPage(current - 1);
    }
  });

  buildPegs();

  /* ---------- efek ketik (halaman sapaan) ---------- */
  let typedOnce = false;
  function runTypewriterOnce(){
    if (typedOnce) return;
    typedOnce = true;
    const el = document.getElementById('greetText');
    const text = CONFIG.sapaan;
    let i = 0;
    el.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.textContent = '\u00A0';

    function tick(){
      if (i < text.length){
        el.textContent = text.slice(0, i + 1);
        el.appendChild(cursor);
        i++;
        setTimeout(tick, 18);
      } else {
        el.appendChild(cursor);
      }
    }
    tick();
  }

  /* ---------- kata-kata rotator (halaman quotes) ---------- */
  let quotesInit = false;
  function initQuotesOnce(){
    if (quotesInit) return;
    quotesInit = true;
    const list = CONFIG.kataKata.length ? CONFIG.kataKata : ['Semoga harimu selalu baik.'];
    let qi = 0;
    const textEl = document.getElementById('quoteText');
    const dotsWrap = document.getElementById('quoteDots');
    const prevBtn = document.getElementById('quotePrev');
    const nextBtn = document.getElementById('quoteNext');

    const dots = list.map((_, idx) => {
      const d = document.createElement('span');
      d.className = 'quote-dot';
      d.addEventListener('click', () => setQuote(idx));
      dotsWrap.appendChild(d);
      return d;
    });

    function setQuote(idx){
      qi = (idx + list.length) % list.length;
      textEl.style.opacity = 0;
      setTimeout(() => {
        textEl.textContent = '“' + list[qi] + '”';
        textEl.style.opacity = 1;
      }, 180);
      dots.forEach((d, i) => d.classList.toggle('is-active', i === qi));
    }

    textEl.style.transition = 'opacity .18s ease';
    prevBtn.addEventListener('click', () => setQuote(qi - 1));
    nextBtn.addEventListener('click', () => setQuote(qi + 1));
    setQuote(0);
  }

  function setText(id, text){
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }
  /* ---------- musik latar ----------
     Browser blokir audio-dengan-suara sebelum ada interaksi user,
     jadi musik baru benar-benar mulai diputar begitu user klik
     pertama kali di halaman (biasanya tombol "Buka Kado"). Setelah
     itu `loop` bikin dia otomatis ngulang terus tanpa henti. */
  function initMusic(){
    const audio = document.getElementById('bgMusic');
    const toggleBtn = document.getElementById('musicToggle');
    if (!audio || !CONFIG.musik) return;

    audio.src = CONFIG.musik;
    audio.loop = true;
    audio.volume = 0.6;

    let started = false;
    let mutedByUser = false;

    function tryStart(){
      if (started) return;
      audio.play().then(() => {
        started = true;
      }).catch(() => {
        // masih diblokir browser, coba lagi di interaksi berikutnya
      });
    }

    tryStart();
    document.addEventListener('click', tryStart, { once: false });
    document.addEventListener('touchstart', tryStart, { once: false });

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mutedByUser = !mutedByUser;
      audio.muted = mutedByUser;
      toggleBtn.textContent = mutedByUser ? '🔇' : '🔊';
      toggleBtn.setAttribute('aria-pressed', String(mutedByUser));
      if (!started) tryStart();
    });
  }
});
