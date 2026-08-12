/* ============================================================
   EMAIL — kirim notifikasi otomatis lewat EmailJS begitu halaman
   terakhir (penutup) dibuka. Hanya terkirim SEKALI per kunjungan.
   ============================================================ */

const EmailFlow = (function(){
  let sent = false;
  let sending = false;

  function init(){
    if (window.emailjs && CONFIG.emailJS.publicKey){
      emailjs.init({ publicKey: CONFIG.emailJS.publicKey });
    }
  }

  function updateStatus(text, mode){
    const box = document.getElementById('sendStatus');
    const label = document.getElementById('sendStatusText');
    if (!box || !label) return;
    label.textContent = text;
    box.classList.remove('is-sent', 'is-error');
    if (mode) box.classList.add(mode);
  }

  function sendOnce(){
    if (sent || sending) return;
    sending = true;
    updateStatus('mengirim pesan...', '');

    if (!window.emailjs){
      updateStatus('gagal memuat layanan email — cek koneksi internet', 'is-error');
      sending = false;
      return;
    }

    const params = {
      to_email: CONFIG.emailJS.toEmail,
      from_name: CONFIG.emailJS.fromName,
      subject: CONFIG.emailJS.subject,
      message: CONFIG.emailJS.message,
    };

    emailjs.send(CONFIG.emailJS.serviceID, CONFIG.emailJS.templateID, params)
      .then(() => {
        sent = true;
        sending = false;
        updateStatus('pesan sudah terkirim 💌', 'is-sent');
      })
      .catch((err) => {
        sending = false;
        console.error('EmailJS error:', err);
        updateStatus('pesan belum terkirim, coba cek koneksi (lihat console)', 'is-error');
      });
  }

  return { init, sendOnce };
})();
