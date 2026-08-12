/* ============================================================
   GALLERY — render Album Kamu (polaroid) & Album Kenangan (scrap),
   plus lightbox click-to-enlarge yang dipakai bareng oleh keduanya
   ============================================================ */

const Gallery = (function(){
  let currentList = [];
  let currentIndex = 0;

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const btnClose = document.getElementById('lightboxClose');
  const btnPrev = document.getElementById('lightboxPrev');
  const btnNext = document.getElementById('lightboxNext');

  function frameFor(kind){ return kind === 'kamu' ? 'polaroid' : 'scrap'; }

  function render(containerId, items, kind){
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = '';
    const frameClass = frameFor(kind);

    items.forEach((item, idx) => {
      const fig = document.createElement('figure');
      fig.className = frameClass;
      fig.tabIndex = 0;
      fig.setAttribute('role', 'button');
      fig.setAttribute('aria-label', 'Buka foto ' + (idx + 1));

      const photoWrap = document.createElement('div');
      photoWrap.className = 'photo-wrap';

      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.caption || ('Foto ' + (idx + 1));
      img.loading = 'lazy';
      img.onerror = function(){ photoWrap.classList.add('img-error'); };

      photoWrap.appendChild(img);
      fig.appendChild(photoWrap);

      const caption = document.createElement('figcaption');
      caption.textContent = item.caption || '';
      fig.appendChild(caption);

      const openThis = () => open(items, idx, kind);
      fig.addEventListener('click', openThis);
      fig.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openThis(); }
      });

      el.appendChild(fig);
    });
  }

  function open(list, index, kind){
    currentList = list;
    currentIndex = index;
    lightboxImg.src = currentList[currentIndex].src;
    lightboxImg.alt = currentList[currentIndex].caption || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function close(){
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  function step(dir){
    if (!currentList.length) return;
    currentIndex = (currentIndex + dir + currentList.length) % currentList.length;
    lightboxImg.src = currentList[currentIndex].src;
    lightboxImg.alt = currentList[currentIndex].caption || '';
  }

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', () => step(-1));
  btnNext.addEventListener('click', () => step(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  return { render };
})();
