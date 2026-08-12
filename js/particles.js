/* ============================================================
   PARTICLES — bintang latar (ambient) + confetti burst (dipakai
   saat menang game & di halaman penutup)
   ============================================================ */

(function initSparkles(){
  const wrap = document.getElementById('sparkles');
  if (!wrap) return;
  const COUNT = 34;
  for (let i = 0; i < COUNT; i++){
    const s = document.createElement('div');
    s.className = 'sparkle';
    const size = 2 + Math.random() * 3;
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.left = Math.random() * 100 + 'vw';
    s.style.top = Math.random() * 100 + 'vh';
    s.style.animationDuration = (2.5 + Math.random() * 3.5) + 's';
    s.style.animationDelay = (Math.random() * 4) + 's';
    wrap.appendChild(s);
  }
})();

const Confetti = (function(){
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let particles = [];
  let running = false;
  const COLORS = ['#F2A7B3', '#FFC9A8', '#C9B6E4', '#E8B34C', '#FBF3E7'];

  function resize(){
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function burst(count = 90){
    if (!canvas || !ctx) return;
    const cx = canvas.width / 2;
    for (let i = 0; i < count; i++){
      particles.push({
        x: cx + (Math.random() - 0.5) * 120,
        y: canvas.height * 0.25 + (Math.random() - 0.5) * 60,
        vx: (Math.random() - 0.5) * 9,
        vy: Math.random() * -9 - 3,
        size: 5 + Math.random() * 6,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 0,
        maxLife: 90 + Math.random() * 40,
      });
    }
    if (!running){ running = true; requestAnimationFrame(tick); }
  }

  function tick(){
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.vy += 0.22; // gravity
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life++;
      const alpha = Math.max(0, 1 - p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });
    particles = particles.filter(p => p.life < p.maxLife && p.y < canvas.height + 40);
    if (particles.length > 0){
      requestAnimationFrame(tick);
    } else {
      running = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  return { burst };
})();
