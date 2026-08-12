/* ============================================================
   KONFIGURASI KADO ULANG TAHUN — EDIT SEMUA DI FILE INI SAJA
   Kamu nggak perlu sentuh file lain buat ganti isi/foto/pesan.
   ============================================================ */

const CONFIG = {

  // Nama yang ulang tahun, dipakai di beberapa judul halaman
  nama: "Nola",

  // Tanggal ulang tahun (opsional, cuma dekorasi teks). Boleh dikosongin "".
  tanggal: "",

  // Tanda tangan/pengirim, muncul di halaman penutup
  pengirim: "alexxx",

  // Kalimat sapaan di halaman ke-2 (efek mengetik). Boleh diganti bebas.
  sapaan: "Sebelum kamu lanjut, aku cuma mau bilang terima kasih yaaa. yang aku harapin semoga kamu suka dengan ini semuaa yaaa.",

  /* ------------------------------------------------------------
     FOTO BACKGROUND & FOTO SAMPUL
     - background: dipasang samar di halaman pembuka (cover)
     - sampul: foto utama orangnya, muncul besar di halaman pembuka
     Taruh filenya di folder assets/images/
  ------------------------------------------------------------ */
  fotoBackground: "assets/images/background.jpg",
  fotoSampul: "assets/images/sampul.jpg",
// Musik latar — otomatis muter & ngulang terus (loop) begitu halaman
  // dibuka (tepatnya begitu tombol "Buka Kado" pertama kali diklik, biar
  // sesuai aturan browser soal autoplay). Taruh file musiknya di
  // assets/audio/ lalu isi nama filenya di sini.
  musik: "assets/audio/musik.mp3",

  /* ------------------------------------------------------------
     ALBUM KAMU — foto-foto orangnya (boleh sebanyak apapun)
     Taruh file fotonya di assets/images/profile/ lalu daftarkan
     nama filenya di sini. Urutan sesuai urutan di array ini.
     "caption" itu tulisan kecil ala catatan tangan di foto (opsional).
  ------------------------------------------------------------ */
  albumKamu: [
    { src: "assets/images/profile/foto1.jpg", caption: "senyum favoritku" },
    { src: "assets/images/profile/foto2.jpg", caption: "" },
    { src: "assets/images/profile/foto3.jpg", caption: "" },
    { src: "assets/images/profile/foto4.jpg", caption: "" },
    { src: "assets/images/profile/foto5.jpg", caption: "" },
    { src: "assets/images/profile/foto6.jpg", caption: "" },
    // tinggal copy baris di atas & tambah terus kalau foto masih banyak
  ],

  /* ------------------------------------------------------------
     ALBUM KENANGAN — foto-foto kenangan kalian berdua
     Ini kepisah dari album di atas & baru kebuka setelah menang
     mini-game. Taruh file di assets/images/memories/
  ------------------------------------------------------------ */
  albumKenangan: [
    { src: "assets/images/memories/kenangan1.jpg", caption: "" },
    { src: "assets/images/memories/kenangan2.jpg", caption: "" },
    { src: "assets/images/memories/kenangan3.jpg", caption: "" },
    { src: "assets/images/memories/kenangan4.jpg", caption: "" },
    { src: "assets/images/memories/kenangan5.jpg", caption: "" },
    { src: "assets/images/memories/kenangan6.jpg", caption: "" },
    // tinggal copy baris di atas & tambah terus kalau foto masih banyak
  ],

  /* ------------------------------------------------------------
     KATA-KATA — kalimat yang muncul bergantian di halaman "Kata Kata"
  ------------------------------------------------------------ */
  kataKata: [
    "Ulang tahun itu bukan cuma nambah umur kamu, tapi berapa kali kamu bisa perbaiki diri kamu jadi lebih baik dari tahun kemarin.",
    "Semoga tahun ini kamu makin kuat, makin tenang, dan makin yakin sama jalan yang kamu pilih.",
    "Kamu tetap orang yang paling berarti buat orang-orang di sekitar kamu.",
    "Makasii yaa uda jadi diri kamu yang sekarang itu udah lebih dari cukup.",
    "Apapun yang terjadi nanti, semoga kamu selalu inget kalau kamu selalu layak buat bahagia.",
  ],

  /* ------------------------------------------------------------
     EMAILJS — sudah diisi sesuai punya kamu, nggak perlu diubah
     kecuali kamu ganti service/template di dashboard EmailJS.
     Pastikan nama variabel di bawah (toEmail, fromName, message,
     subject) SAMA PERSIS dengan nama variable {{...}} di template
     EmailJS kamu. Kalau template kamu pakai nama lain, tinggal
     samain nama key-nya di object "templateParams" pada js/email.js
  ------------------------------------------------------------ */
  emailJS: {
    publicKey: "NgDDcDLaKvjBDnDYy",
    serviceID: "service_as1grip",
    templateID: "template_qsml4mf",
    toEmail: "noln21720@gmail.com",
    fromName: "Website Kado Ulang Tahun",
    subject: "Dia sudah selesai membuka kado ulang tahunnya 💌",
    message:
      "pibesdeeyy ya kamu semoga semakin dewasa semakin ngalir juga rezekinya dan rezeki keluarganya, jadi anak yang baik buat mama yaa dan bisa banggain keluarga, pokoknya semua hal baik selalu sama kamu dan ditahun berikutnya masih bisa ngerasain ultah lagi, aku kangen kamu tpi aku yakin ini cara terbaik buat kamu kedepannya yaaa, selalu jadi wanita yang cantik dan bukan hanya cantik wajahnya aja tapi hatinya jugaa...",
  },

  /* ------------------------------------------------------------
     MINI GAME — target skor & waktu, boleh diutak-atik
  ------------------------------------------------------------ */
  game1: {
    targetSkor: 15,   // jumlah hati yang harus ditangkap
    waktuDetik: 30,   // batas waktu (detik)
  },

  // Jumlah pasangan kartu di game 2 (memory match). Maks 8 (16 kartu)
  game2PasanganKartu: 6,
};
