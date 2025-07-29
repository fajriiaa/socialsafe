// Variabel canvas dan context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Variabel hook untuk animasi pancing (jika ingin tetap ada)
let hook = { x: 450, y: 140, length: 80, moving: false };

// Array untuk menyimpan ikan
let fishes = [];

// Variabel untuk bar jumlah ikan
let fishBarCount = 0;

let fishBarDisplay = 0; // Untuk animasi smooth bar

let isGameFinished = false;

// Pesan edukasi random per jenis ikan
const fishEducation = {
  clownfish: {
    title: 'Ciri-ciri Pesan Phishing',
    messages: [
      `<ul style="text-align:left; margin:10px 0 0 18px; color:#20639b; font-size:15px;">
        <li><b>Domain web aneh atau tidak resmi</b><br><span style='color:#b23c3c;'>Contoh: secure-login-bank.xyz, update-akun-gratis.com</span></li>
      </ul>`,
      `<ul style="text-align:left; margin:10px 0 0 18px; color:#20639b; font-size:15px;">
        <li><b>Meminta data pribadi atau rahasia</b><br><span style='color:#b23c3c;'>Contoh: "Mohon kirimkan username dan password Anda ke email ini."</span></li>
      </ul>`,
      `<ul style="text-align:left; margin:10px 0 0 18px; color:#20639b; font-size:15px;">
        <li><b>Mengancam akun akan diblokir/dinonaktifkan</b><br><span style='color:#b23c3c;'>Contoh: "Akun Anda akan diblokir jika tidak melakukan verifikasi hari ini."</span></li>
      </ul>`,
      `<ul style="text-align:left; margin:10px 0 0 18px; color:#20639b; font-size:15px;">
        <li><b>Ada link atau permintaan klik yang mencurigakan</b><br><span style='color:#b23c3c;'>Contoh: http://bit.ly/claim-hadiah, http://bank-aman-login.com</span></li>
      </ul>`,
      `<ul style="text-align:left; margin:10px 0 0 18px; color:#20639b; font-size:15px;">
        <li><b>Pesan mendesak untuk segera bertindak</b><br><span style='color:#b23c3c;'>Contoh: "Segera transfer dana Anda sekarang juga!"</span></li>
        <li><b>Bahasa tidak formal atau banyak typo</b><br><span style='color:#b23c3c;'>Contoh: "Akun anda sudaah di blokir, Segera login ulang!"</span></li>
      </ul>`,
      `<ul style="text-align:left; margin:10px 0 0 18px; color:#20639b; font-size:15px;">
        <li><b>Alamat email pengirim aneh</b><br><span style='color:#b23c3c;'>Contoh: admin-bank123@gmail.com, info-update@akunpromo.site</span></li>
        <li><b>Meminta transfer uang ke rekening tidak dikenal</b><br><span style='color:#b23c3c;'>Contoh: "Transfer ke rekening 1234567890 a.n. PT Amanah"</span></li>
      </ul>`
    ]
  },
  angelfish: {
    title: 'Tips Agar Terhindar dari Phishing',
    messages: [
      '<ul><li>Jangan pernah klik link mencurigakan</li><li>Selalu cek alamat website sebelum login</li><li>Aktifkan autentikasi dua faktor (2FA)</li><li>Jangan bagikan data pribadi ke siapapun</li></ul>',
      '<ul><li>Gunakan password yang kuat dan berbeda untuk setiap akun</li><li>Update aplikasi dan sistem operasi secara berkala</li><li>Laporkan pesan mencurigakan ke pihak berwenang</li><li>Jangan mudah percaya dengan hadiah dadakan</li></ul>',
      '<ul><li>Periksa ejaan dan tata bahasa pada pesan</li><li>Jangan unduh lampiran dari sumber tidak jelas</li><li>Pastikan website menggunakan HTTPS</li><li>Selalu logout setelah selesai menggunakan akun</li></ul>'
    ]
  },
  realfish: {
    title: 'Contoh Pesan Phishing',
    messages: [
      `<div style="color:#b23c3c; background:#fff6e0; border-radius:8px; padding:10px 14px; margin:10px 0;">
        <b>Subjek:</b> [PENTING] Akun Anda Akan Dinonaktifkan<br>
        <b>Dari:</b> admin@securebank-update.com<br><br>
        Yth. Nasabah, akun Anda akan dinonaktifkan dalam 24 jam. Segera verifikasi data Anda di <b>http://secure-update-login.com</b> untuk menghindari pemblokiran.
      </div>`,
      `<div style="color:#b23c3c; background:#fff6e0; border-radius:8px; padding:10px 14px; margin:10px 0;">
        <b>Subjek:</b> Selamat! Anda Menang Undian<br>
        <b>Dari:</b> info@undianberhadiah.com<br><br>
        Selamat! Anda memenangkan hadiah undian. Klaim hadiah Anda sekarang di <b>www.hadiah-mudah.com</b> sebelum 1x24 jam.
      </div>`,
      `<div style="color:#b23c3c; background:#fff6e0; border-radius:8px; padding:10px 14px; margin:10px 0;">
        <b>Subjek:</b> Pembaruan Data Diperlukan<br>
        <b>Dari:</b> support@pajak-resmi.id<br><br>
        Data NPWP Anda perlu diperbarui. Upload dokumen Anda di <b>www.update-dataku.com</b> agar tetap aktif.
      </div>`,
      `<div style="color:#b23c3c; background:#fff6e0; border-radius:8px; padding:10px 14px; margin:10px 0;">
        <b>Subjek:</b> Akun Bank Diblokir<br>
        <b>Dari:</b> cs@bank-palsu.com<br><br>
        Akun bank Anda diblokir karena aktivitas mencurigakan. Segera login ulang di <b>www.bank-palsu.com</b> untuk mengaktifkan kembali.
      </div>`
    ]
  }
};

// Kelas dasar untuk ikan
class Fish {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.speed = 0.5 + Math.random() * 0.7;
    this.direction = Math.random() > 0.5 ? 1 : -1;
    this.size = 30 + Math.random() * 20;
    this.caught = false;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.direction, 1);

    switch(this.type) {
      case 'clownfish':
        this.drawClownfish();
        break;
      case 'angelfish':
        this.drawAngelfish();
        break;
      case 'realfish':
        this.drawRealFish();
        break;
    }

    ctx.restore();
  }

  drawClownfish() {
    // Tubuh utama
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size/1.2, this.size/3, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#4ecdc4';
    ctx.fill();
    // Punggung biru tua
    ctx.beginPath();
    ctx.ellipse(0, -this.size/10, this.size/1.2, this.size/5, 0, Math.PI, 2*Math.PI);
    ctx.fillStyle = '#20639b';
    ctx.fill();
    // Garis-garis gelap di punggung
    for(let i=-2;i<=2;i++){
      ctx.beginPath();
      ctx.moveTo(i*this.size/6, -this.size/6);
      ctx.lineTo(i*this.size/6, 0);
      ctx.strokeStyle = '#174e75';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    // Sirip punggung
    ctx.beginPath();
    ctx.moveTo(this.size/3, -this.size/6);
    ctx.lineTo(this.size/4, -this.size/2);
    ctx.lineTo(this.size/6, -this.size/6);
    ctx.closePath();
    ctx.fillStyle = '#20639b';
    ctx.fill();
    // Sirip ekor bercabang (selalu di kiri)
    ctx.beginPath();
    ctx.moveTo(-this.size/1.2, 0);
    ctx.lineTo(-this.size/1.2-this.size/3, -this.size/4);
    ctx.lineTo(-this.size/1.2-this.size/3, this.size/4);
    ctx.closePath();
    ctx.fillStyle = '#20639b';
    ctx.fill();
    // Sirip bawah
    ctx.beginPath();
    ctx.moveTo(this.size/6, this.size/6);
    ctx.lineTo(this.size/8, this.size/2.5);
    ctx.lineTo(0, this.size/6);
    ctx.closePath();
    ctx.fillStyle = '#4ecdc4';
    ctx.fill();
    // Mata (selalu di kanan)
    ctx.beginPath();
    ctx.arc(this.size/2.5, -this.size/12, this.size/14, 0, Math.PI*2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.size/2.5, -this.size/12, this.size/28, 0, Math.PI*2);
    ctx.fillStyle = '#174e75';
    ctx.fill();
    // Mulut (selalu di kanan)
    ctx.beginPath();
    ctx.arc(this.size/2.2, this.size/16, this.size/18, Math.PI*0.2, Math.PI*0.8);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#174e75';
    ctx.stroke();
  }

  drawAngelfish() {
    // Tubuh utama
    ctx.save();
    ctx.scale(1.2,0.6);
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size/1.5, this.size/5, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#b3e0fc';
    ctx.fill();
    ctx.restore();
    // Garis biru di punggung
    ctx.beginPath();
    ctx.moveTo(this.size/1.5, -this.size/10);
    ctx.bezierCurveTo(this.size/3, -this.size/5, -this.size/3, -this.size/5, -this.size/1.5, -this.size/10);
    ctx.strokeStyle = '#20639b';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Sirip ekor kecil (selalu di kiri)
    ctx.beginPath();
    ctx.moveTo(-this.size/1.5, 0);
    ctx.lineTo(-this.size/1.2, -this.size/8);
    ctx.lineTo(-this.size/1.2, this.size/8);
    ctx.closePath();
    ctx.fillStyle = '#b3e0fc';
    ctx.fill();
    // Sirip bawah kecil
    ctx.beginPath();
    ctx.moveTo(0, this.size/8);
    ctx.lineTo(-this.size/10, this.size/4);
    ctx.lineTo(-this.size/8, this.size/8);
    ctx.closePath();
    ctx.fillStyle = '#b3e0fc';
    ctx.fill();
    // Mata (selalu di kanan)
    ctx.beginPath();
    ctx.arc(this.size/2, -this.size/12, this.size/16, 0, Math.PI*2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.size/2, -this.size/12, this.size/32, 0, Math.PI*2);
    ctx.fillStyle = '#174e75';
    ctx.fill();
    // Mulut (selalu di kanan)
    ctx.beginPath();
    ctx.arc(this.size/1.8, this.size/20, this.size/20, Math.PI*0.3, Math.PI*0.7);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#174e75';
    ctx.stroke();
  }

  drawRealFish() {
    // Tubuh utama
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size/1.3, this.size/3.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#ff6b6b';
    ctx.fill();
    // Garis-garis merah tua
    for(let i=-1;i<=1;i++){
      ctx.beginPath();
      ctx.moveTo(i*this.size/4, -this.size/8);
      ctx.lineTo(i*this.size/4, this.size/8);
      ctx.strokeStyle = '#d63031';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    // Sirip ekor (selalu di kiri)
    ctx.beginPath();
    ctx.moveTo(-this.size/1.3, 0);
    ctx.lineTo(-this.size/1.3-this.size/4, -this.size/6);
    ctx.lineTo(-this.size/1.3-this.size/4, this.size/6);
    ctx.closePath();
    ctx.fillStyle = '#ff6b6b';
    ctx.fill();
    // Sirip bawah
    ctx.beginPath();
    ctx.moveTo(0, this.size/8);
    ctx.lineTo(-this.size/12, this.size/3);
    ctx.lineTo(-this.size/8, this.size/8);
    ctx.closePath();
    ctx.fillStyle = '#ff6b6b';
    ctx.fill();
    // Mata (selalu di kanan)
    ctx.beginPath();
    ctx.arc(this.size/2.2, -this.size/15, this.size/16, 0, Math.PI*2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.size/2.2, -this.size/15, this.size/32, 0, Math.PI*2);
    ctx.fillStyle = '#174e75';
    ctx.fill();
    // Mulut (selalu di kanan)
    ctx.beginPath();
    ctx.arc(this.size/2, this.size/20, this.size/18, Math.PI*0.25, Math.PI*0.75);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#174e75';
    ctx.stroke();
  }

  update() {
    if (!this.caught) {
      this.x += this.speed * this.direction;
      
      // Balik arah jika mencapai tepi
      if (this.x > canvas.width + 50) {
        this.direction = -1;
        this.x = canvas.width + 40;
      } else if (this.x < -50) {
        this.direction = 1;
        this.x = -40;
      }
      
      // Gerakan naik turun sedikit
      this.y += Math.sin(Date.now() * 0.003) * 0.5;
    }
  }
}

// Inisialisasi ikan
function initFishes() {
  for (let i = 0; i < 5; i++) {
    fishes.push(createNewFish());
  }
}

function drawBackground() {
  // Gradient background laut
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#4ecdc4');
  gradient.addColorStop(0.2, '#45b7af');
  gradient.addColorStop(0.4, '#3da199');
  gradient.addColorStop(0.6, '#2c7a73');
  gradient.addColorStop(0.8, '#1a4a45');
  gradient.addColorStop(1, '#0a1f1c');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Gambar awan
  drawCloud(100, 80, 0.8, 0.3, 0.7);
  drawCloud(300, 60, 1.2, 0.2, 0.6);
  drawCloud(600, 90, 0.6, 0.4, 0.5);
  drawCloud(800, 70, 1.0, 0.25, 0.8);
  
  function drawCloud(cx, cy, scale, speed, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(cx + Math.sin(Date.now() * 0.001 * speed) * 20, cy);
    ctx.scale(scale, scale);
    
    // Gambar awan dengan beberapa lingkaran
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.arc(25, 0, 25, 0, Math.PI * 2);
    ctx.arc(50, 0, 20, 0, Math.PI * 2);
    ctx.arc(25, -15, 18, 0, Math.PI * 2);
    ctx.arc(25, 15, 18, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
}

function drawBoat() {
  ctx.save();
  ctx.translate(hook.x, 120);

  // --- Perahu ---
  ctx.beginPath();
  ctx.moveTo(-50, 18);
  ctx.lineTo(50, 18);
  ctx.lineTo(35, 30);
  ctx.lineTo(-35, 30);
  ctx.closePath();
  ctx.fillStyle = '#a67c52';
  ctx.strokeStyle = '#6e4b1f';
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();

  // --- Orang (badan) ---
  ctx.save();
  ctx.translate(0, 0);
  ctx.beginPath();
  ctx.ellipse(0, 5, 10, 16, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#3b6ea5'; // baju
  ctx.fill();
  ctx.restore();

  // --- Kepala ---
  ctx.beginPath();
  ctx.arc(0, -12, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#f7d6b3';
  ctx.fill();
  // --- Topi ---
  ctx.beginPath();
  ctx.ellipse(0, -18, 10, 4, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#b5651d';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-10, -18);
  ctx.lineTo(0, -28);
  ctx.lineTo(10, -18);
  ctx.closePath();
  ctx.fillStyle = '#a0522d';
  ctx.fill();

  // --- Lengan kiri ---
  ctx.save();
  ctx.rotate(-0.5);
  ctx.beginPath();
  ctx.moveTo(-6, 0);
  ctx.lineTo(-18, 18);
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#3b6ea5';
  ctx.stroke();
  ctx.restore();

  // --- Lengan kanan (memegang pancing) ---
  ctx.save();
  ctx.rotate(0.5);
  ctx.beginPath();
  ctx.moveTo(6, 0);
  ctx.lineTo(18, 18);
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#3b6ea5';
  ctx.stroke();
  ctx.restore();

  // --- Tangan kanan ---
  ctx.save();
  ctx.rotate(0.5);
  ctx.beginPath();
  ctx.arc(18, 18, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#f7d6b3';
  ctx.fill();
  ctx.restore();

  // --- Kaki ---
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-5, 20);
  ctx.lineTo(-5, 32);
  ctx.moveTo(5, 20);
  ctx.lineTo(5, 32);
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#222';
  ctx.stroke();
  ctx.restore();

  // --- Joran pancing ---
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(18, 18);
  ctx.lineTo(18, 60);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#8d5524';
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

function drawHook() {
  // Titik tangan kanan pemancing (harus sinkron dengan drawBoat)
  const handX = hook.x + 18;
  const handY = 120 + 18;
  // Titik ujung joran (ke depan, sedikit miring)
  const rodEndX = hook.x + 60;
  const rodEndY = 120 - 40;
  // Joran pancing (batang) lurus dari tangan
  ctx.save();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#8d5524';
  ctx.beginPath();
  ctx.moveTo(handX, handY);
  ctx.lineTo(rodEndX, rodEndY);
  ctx.stroke();
  // Ujung joran
  ctx.beginPath();
  ctx.arc(rodEndX, rodEndY, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#bfa76a';
  ctx.fill();
  // Tali pancing lurus dari ujung joran ke hook
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#aaa';
  ctx.beginPath();
  ctx.moveTo(rodEndX, rodEndY);
  ctx.lineTo(hook.x, hook.y);
  ctx.stroke();
  // Mata pancing (hook) realistik
  // Lingkaran besi
  ctx.beginPath();
  ctx.arc(hook.x, hook.y, 8, 0, Math.PI * 2);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#bbb';
  ctx.shadowColor = '#fff';
  ctx.shadowBlur = 4;
  ctx.stroke();
  ctx.shadowBlur = 0;
  // Kait (hook) setengah lingkaran
  ctx.beginPath();
  ctx.arc(hook.x + 4, hook.y + 4, 7, Math.PI * 0.7, Math.PI * 1.7);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#666';
  ctx.stroke();
  // Highlight pada hook
  ctx.beginPath();
  ctx.arc(hook.x + 6, hook.y + 2, 2, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.globalAlpha = 0.7;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();
}

// Variabel untuk tracking ikan yang tertangkap
let caughtFish = null;
let isPopupActive = false;

// Bar progress untuk setiap jenis ikan
let barClownfish = 0;
let barAngelfish = 0;
let barRealfish = 0;
const BAR_MAX = 3;

// Tambahkan variabel baru untuk status ikan menempel di kail
let fishOnHook = null;

function checkFishing() {
  if (fishOnHook || caughtFish) return;
  fishes.forEach(fish => {
    if (!fish.caught && Math.abs(fish.x - hook.x) < 20 && Math.abs(fish.y - hook.y) < 20) {
      fish.caught = true;
      fishOnHook = fish;
    }
  });
}

function showPopupScam(type) {
  isPopupActive = true;
  const popupScam = document.getElementById('popupScam');
  const popupScamTitle = document.getElementById('popupScamTitle');
  const popupScamMsg = document.getElementById('popupScamMsg');
  
  const education = fishEducation[type];
  const randomMessage = education.messages[Math.floor(Math.random() * education.messages.length)];
  
  popupScamTitle.textContent = education.title;
  popupScamMsg.innerHTML = randomMessage;
  popupScam.style.display = 'flex';
  
  // Tambahkan event listener untuk tombol OK
  const btnScamOk = document.getElementById('btnScamOk');
  btnScamOk.onclick = function() {
    hidePopupScam();
  };
}

function hidePopupScam() {
  isPopupActive = false;
  document.getElementById('popupScam').style.display = 'none';
  // Jika semua bar penuh, tampilkan popup finish
  if (barClownfish >= BAR_MAX && barAngelfish >= BAR_MAX && barRealfish >= BAR_MAX) {
    showFinishPopup();
  }
}

function createNewFish() {
  const types = ['clownfish', 'angelfish', 'realfish'];
  const type = types[Math.floor(Math.random() * types.length)];
  const x = Math.random() > 0.5 ? canvas.width + 50 : -50;
  const y = 200 + Math.random() * 200;
  return new Fish(x, y, type);
}

function drawAllFishBars() {
  const barWidth = 200;
  const barHeight = 20;
  const barSpacing = 30;
  const startX = 20;
  const startY = 20;
  
  // Background untuk semua bar
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(startX - 5, startY - 5, barWidth + 10, barSpacing * 3 + 10);
  
  // Bar Clownfish (Biru)
  drawFishBar(startX, startY, barClownfish, BAR_MAX, barWidth, barHeight, '#4ecdc4', 'Clownfish');
  
  // Bar Angelfish (Biru Muda)
  drawFishBar(startX, startY + barSpacing, barAngelfish, BAR_MAX, barWidth, barHeight, '#b3e0fc', 'Angelfish');
  
  // Bar Realfish (Merah)
  drawFishBar(startX, startY + barSpacing * 2, barRealfish, BAR_MAX, barWidth, barHeight, '#ff6b6b', 'Realfish');
}

function drawFishBar(x, y, current, max, width, height, color, label) {
  // Background bar
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.fillRect(x, y, width, height);
  
  // Progress bar
  const progressWidth = (current / max) * width;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, progressWidth, height);
  
  // Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);
  
  // Label
  ctx.fillStyle = '#fff';
  ctx.font = '14px Arial';
  ctx.fillText(`${label}: ${current}/${max}`, x + width + 10, y + height - 5);
}

function removeCaughtFish() {
  if (fishOnHook) {
    // Jika kail sudah di atas (misal y < 160), baru dapatkan ikan
    if (hook.y < 160) {
      // Mainkan efek suara splash
      // (tambahkan jika ada audioSplash)
      // audioSplash.currentTime = 0;
      // audioSplash.play();
      showPopupScam(fishOnHook.type);
      fishes = fishes.filter(f => f !== fishOnHook);
      // Tambah bar sesuai jenis ikan
      if (fishOnHook.type === 'clownfish' && barClownfish < BAR_MAX) barClownfish++;
      if (fishOnHook.type === 'angelfish' && barAngelfish < BAR_MAX) barAngelfish++;
      if (fishOnHook.type === 'realfish' && barRealfish < BAR_MAX) barRealfish++;
      fishOnHook = null;
      // Tambah ikan baru
      fishes.push(createNewFish());
    } else {
      // Selama ikan menempel, posisikan ikan di kail
      fishOnHook.x = hook.x;
      fishOnHook.y = hook.y + 18; // sedikit di bawah hook
    }
  }
}

let isHookReturning = false;

window.addEventListener('keydown', function(e) {
  const step = 18;
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
    hook.x -= step;
    if (hook.x < 60) hook.x = 60;
  }
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
    hook.x += step;
    if (hook.x > canvas.width - 60) hook.x = canvas.width - 60;
  }
  if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && !isHookReturning) {
    hook.y = canvas.height - 30;
    isHookReturning = true;
  }
  if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
    hook.y -= step;
    if (hook.y < 150) hook.y = 150;
  }
});

// Animasi hook naik otomatis setelah turun
function animateHookReturn() {
  if (isHookReturning) {
    hook.y -= 10;
    if (hook.y <= 150) {
      hook.y = 150;
      isHookReturning = false;
    }
  }
}

function gameLoop() {
  // Hapus pemanggilan showFinishPopup() di sini
  // if (!isGameFinished && barClownfish >= BAR_MAX && barAngelfish >= BAR_MAX && barRealfish >= BAR_MAX) {
  //   showFinishPopup();
  //   return;
  // }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawBoat();
  drawHook();
  drawAllFishBars();
  if (!isPopupActive) {
    checkFishing();
    removeCaughtFish();
    animateHookReturn();
    // Update dan gambar ikan
    fishes.forEach(fish => {
      fish.update();
      fish.draw();
    });
  } else {
    // Saat popup aktif, tetap gambar ikan (tanpa update)
    fishes.forEach(fish => {
      fish.draw();
    });
  }
  requestAnimationFrame(gameLoop);
}

// Panggil initFishes sebelum memulai game
initFishes();
gameLoop();

// Ambil elemen popup finish
const popupFinish = document.getElementById('popupFinish');
const btnFinishContinue = document.getElementById('btnFinishContinue');

function showFinishPopup() {
  isGameFinished = true;
  popupFinish.style.display = 'flex';
}

btnFinishContinue.onclick = function() {
  // Kirim pesan ke parent window bahwa game selesai (point 100)
  window.parent.postMessage({
    type: 'gameCompleted',
    points: 100
  }, '*');
  // Kirim pesan untuk menutup game kotak 6 (trigger animasi closing overlay di parent)
  window.parent.postMessage({
    type: 'gameContinue'
  }, '*');
};

// --- PETUNJUK GAME ---
const guides = [
  'Selamat datang di Phishing Fishing Game!<br><br>Tangkap ikan dan pelajari edukasi tentang phishing.',
  'Setiap jenis ikan mewakili kategori edukasi berbeda.<br>Isi semua bar ikan untuk menyelesaikan game.',
  'Baca baik-baik pesan edukasi yang muncul setiap kali menangkap ikan.',
  'Hati-hati dengan pesan phishing di dunia nyata!<br><br>Siap bermain?'
];
let guideStep = 0;
let isGuideActive = true;

const guideOverlay = document.getElementById('guideOverlay');
const guideText = document.getElementById('guideText');
const btnGuideNext = document.getElementById('btnGuideNext');

function showGuideStep() {
  guideText.innerHTML = guides[guideStep];
  btnGuideNext.textContent = (guideStep === guides.length-1) ? 'Mulai' : 'Next';
}

btnGuideNext.onclick = function() {
  guideStep++;
  if (guideStep < guides.length) {
    showGuideStep();
  } else {
    guideOverlay.style.display = 'none';
    isGuideActive = false;
    // Mulai game loop
    gameLoop();
  }
};

// Tampilkan petunjuk saat halaman dimuat, dan tahan gameLoop sampai selesai
window.addEventListener('DOMContentLoaded', () => {
  guideOverlay.style.display = 'flex';
  showGuideStep();
  // Animasi fade-in box
  setTimeout(() => {
    document.getElementById('guideBox').style.opacity = '1';
    document.getElementById('guideBox').style.transform = 'translateY(0)';
  }, 80);
});

// Modifikasi gameLoop agar tidak jalan sebelum petunjuk selesai
const realGameLoop = gameLoop;
gameLoop = function() {
  if (isGuideActive) return;
  realGameLoop();
};

function scaleDeviceFrameLock() {
  const deviceLock = document.querySelector('.device-frame-lock');
  if (!deviceLock) return;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const dw = 650; // width asli device
  const dh = 420; // height asli device
  const scale = Math.min(vw / dw, vh / dh, 1); // Maksimal 1 (tidak membesar)
  deviceLock.style.transform = `scale(${scale})`;
}
window.addEventListener('resize', scaleDeviceFrameLock);
window.addEventListener('DOMContentLoaded', scaleDeviceFrameLock); 