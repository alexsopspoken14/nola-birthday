/* ============================================================
   GAMES — Tantangan 1: Tangkap Cinta (catch-the-falling-hearts)
            Tantangan 2: Cocokkan Kartu (memory match)
   Kedua game nge-expose Games.state.game1Won / game2Won yang
   dipakai buat ngunci tombol "Lanjut" sampai menang.
   ============================================================ */

const Games = (function(){

  const state = { game1Won: false, game2Won: false };

  /* ---------------------------------------------------------
     GAME 1 — TANGKAP CINTA
  --------------------------------------------------------- */
  const g1 = {
    arena: null, basket: null, overlay: null, overlayText: null,
    scoreEl: null, timerEl: null, targetEl: null, startBtn: null, nextBtn: null,
    items: [], score: 0, timeLeft: 0, active: false,
    basketXPercent: 50,
    spawnTimer: null, countdownTimer: null, rafId: null, lastTs: 0,
  };

  const G1_ICONS_GOOD = ['💖','💕','💗','💖'];
  const G1_ICONS_BAD = ['⚡'];

  function initGame1(){
    g1.arena = document.getElementById('g1Arena');
    g1.basket = document.getElementById('g1Basket');
    g1.overlay = document.getElementById('g1Overlay');
    g1.overlayText = document.getElementById('g1OverlayText');
    g1.scoreEl = document.getElementById('g1Score');
    g1.timerEl = document.getElementById('g1Timer');
    g1.targetEl = document.getElementById('g1Target');
    g1.startBtn = document.getElementById('g1StartBtn');
    g1.nextBtn = document.getElementById('g1NextBtn');
    if (!g1.arena) return;

    g1.targetEl.textContent = CONFIG.game1.targetSkor;
    g1.timerEl.textContent = CONFIG.game1.waktuDetik;

    g1.startBtn.addEventListener('click', startGame1);

    g1.arena.addEventListener('pointermove', (e) => {
      if (!g1.active) return;
      const rect = g1.arena.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      g1.basketXPercent = Math.min(96, Math.max(4, pct));
      g1.basket.style.left = g1.basketXPercent + '%';
    });
  }

  function startGame1(){
    g1.score = 0;
    g1.timeLeft = CONFIG.game1.waktuDetik;
    g1.active = true;
    g1.items.forEach(it => it.el.remove());
    g1.items = [];
    g1.scoreEl.textContent = '0';
    g1.timerEl.textContent = g1.timeLeft;
    g1.overlay.classList.add('is-hidden');

    g1.spawnTimer = setInterval(spawnFallingItem, 650);
    g1.countdownTimer = setInterval(() => {
      g1.timeLeft--;
      g1.timerEl.textContent = Math.max(0, g1.timeLeft);
      if (g1.timeLeft <= 0) endGame1(false);
    }, 1000);

    g1.lastTs = performance.now();
    g1.rafId = requestAnimationFrame(loopGame1);
  }

  function spawnFallingItem(){
    if (!g1.active) return;
    const isBad = Math.random() < 0.22;
    const icon = isBad
      ? G1_ICONS_BAD[Math.floor(Math.random() * G1_ICONS_BAD.length)]
      : G1_ICONS_GOOD[Math.floor(Math.random() * G1_ICONS_GOOD.length)];
    const el = document.createElement('div');
    el.className = 'falling-item';
    el.textContent = icon;
    const xPercent = 4 + Math.random() * 88;
    el.style.left = xPercent + '%';
    g1.arena.appendChild(el);
    g1.items.push({
      el, xPercent, y: -40,
      speed: 70 + Math.random() * 60,
      bad: isBad,
    });
  }

  function loopGame1(ts){
    if (!g1.active) return;
    const dt = (ts - g1.lastTs) / 1000;
    g1.lastTs = ts;
    const arenaH = g1.arena.clientHeight;
    const basketY = arenaH - 46;

    for (let i = g1.items.length - 1; i >= 0; i--){
      const it = g1.items[i];
      it.y += it.speed * dt;
      it.el.style.transform = `translateY(${it.y}px)`;

      if (it.y >= basketY){
        const dx = Math.abs(it.xPercent - g1.basketXPercent);
        if (dx < 9){
          if (it.bad){
            g1.score = Math.max(0, g1.score - 1);
          } else {
            g1.score++;
          }
          g1.scoreEl.textContent = g1.score;
          it.el.remove();
          g1.items.splice(i, 1);
          if (g1.score >= CONFIG.game1.targetSkor){
            endGame1(true);
            return;
          }
          continue;
        }
      }
      if (it.y > arenaH + 20){
        it.el.remove();
        g1.items.splice(i, 1);
      }
    }
    g1.rafId = requestAnimationFrame(loopGame1);
  }

  function endGame1(won){
    g1.active = false;
    clearInterval(g1.spawnTimer);
    clearInterval(g1.countdownTimer);
    cancelAnimationFrame(g1.rafId);
    g1.items.forEach(it => it.el.remove());
    g1.items = [];

    g1.overlay.classList.remove('is-hidden');
    if (won){
      state.game1Won = true;
      g1.overlayText.textContent = '🎉 Berhasil ditangkap semua! Lanjut ke tantangan berikutnya, yuk.';
      g1.startBtn.textContent = 'Main Lagi (opsional) 💘';
      g1.nextBtn.removeAttribute('disabled');
      Confetti.burst(70);
    } else {
      g1.overlayText.textContent = 'Waktu habis! Skor kamu ' + g1.score + '/' + CONFIG.game1.targetSkor + '. Coba lagi yuk 💪';
      g1.startBtn.textContent = 'Coba Lagi 💘';
    }
  }

  /* ---------------------------------------------------------
     GAME 2 — COCOKKAN KARTU (memory match)
  --------------------------------------------------------- */
  const g2 = {
    grid: null, movesEl: null, matchedEl: null, totalEl: null, nextBtn: null, resetBtn: null,
    cards: [], flipped: [], matchedCount: 0, moves: 0, lock: false,
  };
  const G2_ICON_POOL = ['🎂','🎁','🎈','🌸','💌','🦋','🌙','✨'];

  function initGame2(){
    g2.grid = document.getElementById('g2Grid');
    g2.movesEl = document.getElementById('g2Moves');
    g2.matchedEl = document.getElementById('g2Matched');
    g2.totalEl = document.getElementById('g2Total');
    g2.nextBtn = document.getElementById('g2NextBtn');
    g2.resetBtn = document.getElementById('g2ResetBtn');
    if (!g2.grid) return;

    g2.resetBtn.addEventListener('click', buildGame2);
    buildGame2();
  }

  function buildGame2(){
    const pairs = Math.min(8, Math.max(3, CONFIG.game2PasanganKartu || 6));
    const icons = G2_ICON_POOL.slice(0, pairs);
    let deck = icons.concat(icons);
    deck = deck.sort(() => Math.random() - 0.5);

    g2.matchedCount = 0;
    g2.moves = 0;
    g2.flipped = [];
    g2.lock = false;
    g2.totalEl.textContent = pairs;
    g2.movesEl.textContent = '0';
    g2.matchedEl.textContent = '0';

    g2.grid.innerHTML = '';
    g2.cards = deck.map((icon, idx) => {
      const card = document.createElement('div');
      card.className = 'g2-card';
      card.dataset.icon = icon;
      card.dataset.idx = idx;
      card.innerHTML = `
        <div class="g2-card__inner">
          <div class="g2-face g2-face--back">❓</div>
          <div class="g2-face g2-face--front">${icon}</div>
        </div>`;
      card.addEventListener('click', () => flipCard(card));
      g2.grid.appendChild(card);
      return card;
    });
  }

  function flipCard(card){
    if (g2.lock) return;
    if (card.classList.contains('is-flipped') || card.classList.contains('is-matched')) return;
    if (g2.flipped.length >= 2) return;

    card.classList.add('is-flipped');
    g2.flipped.push(card);

    if (g2.flipped.length === 2){
      g2.moves++;
      g2.movesEl.textContent = g2.moves;
      const [a, b] = g2.flipped;
      if (a.dataset.icon === b.dataset.icon){
        g2.lock = true;
        setTimeout(() => {
          a.classList.add('is-matched');
          b.classList.add('is-matched');
          g2.flipped = [];
          g2.lock = false;
          g2.matchedCount++;
          g2.matchedEl.textContent = g2.matchedCount;
          if (g2.matchedCount === g2.cards.length / 2){
            state.game2Won = true;
            g2.nextBtn.removeAttribute('disabled');
            Confetti.burst(90);
          }
        }, 420);
      } else {
        g2.lock = true;
        setTimeout(() => {
          a.classList.remove('is-flipped');
          b.classList.remove('is-flipped');
          g2.flipped = [];
          g2.lock = false;
        }, 800);
      }
    }
  }

  return { state, initGame1, initGame2 };
})();
