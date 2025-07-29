// Learning System Variables
let currentLesson = 1;
let totalLessons = 4;
let quizAnswers = [];
let quizScore = 0;

// Lesson Content Data
const lessons = [
    {
        id: 1,
        title: "Pengenalan Akun Palsu",
        subtitle: "Memahami apa itu akun palsu dan mengapa berbahaya",
        content: `
            <h3>🔍 Apa itu Akun Palsu?</h3>
            <p>Akun palsu adalah akun media sosial yang dibuat dengan identitas palsu atau meniru identitas orang lain untuk tujuan yang tidak baik.</p>
            
            <div class="highlight">
                <h4>Karakteristik Akun Palsu:</h4>
                <ul>
                    <li>Menggunakan foto profil yang bukan milik pemilik akun</li>
                    <li>Mengklaim identitas orang lain atau selebritas</li>
                    <li>Memiliki followers yang tidak proporsional</li>
                    <li>Mengirim pesan spam atau mencurigakan</li>
                </ul>
            </div>
            
            <div class="warning">
                <h4>⚠️ Mengapa Akun Palsu Berbahaya?</h4>
                <ul>
                    <li>Penipuan dan scam online</li>
                    <li>Pencurian data pribadi</li>
                    <li>Penyebaran berita hoax</li>
                    <li>Cyberbullying dan pelecehan</li>
                    <li>Penjualan produk palsu</li>
                </ul>
            </div>
            
            <p>Menurut data, <strong>60% akun palsu</strong> digunakan untuk penipuan online, dan <strong>40%</strong> untuk penyebaran informasi palsu.</p>
        `
    },
    {
        id: 2,
        title: "Tanda-tanda Akun Palsu",
        subtitle: "Karakteristik dan red flags yang perlu diperhatikan",
        content: `
            <h3>🚨 Tanda-tanda Utama Akun Palsu</h3>
            
            <div class="highlight">
                <h4>1. Profil yang Mencurigakan</h4>
                <ul>
                    <li>Foto profil blur atau dari internet</li>
                    <li>Username dengan angka acak atau kata "official", "CEO", "VIP"</li>
                    <li>Bio yang terlalu generik atau defensif</li>
                    <li>Tanggal bergabung yang baru tapi followers banyak</li>
                </ul>
            </div>
            
            <div class="example">
                <h4>2. Aktivitas yang Tidak Wajar</h4>
                <ul>
                    <li>Posting terlalu sering dalam waktu singkat</li>
                    <li>Konten yang selalu sama atau copy-paste</li>
                    <li>Hanya berinteraksi dengan akun tertentu</li>
                    <li>Mengirim link mencurigakan</li>
                </ul>
            </div>
            
            <div class="warning">
                <h4>3. Rasio yang Tidak Seimbang</h4>
                <ul>
                    <li>Followers ribuan tapi following hanya puluhan</li>
                    <li>Followers banyak tapi posts sedikit</li>
                    <li>Engagement rate yang sangat rendah</li>
                    <li>Komentar yang selalu sama atau spam</li>
                </ul>
            </div>
            
            <p><strong>Tips:</strong> Selalu periksa setidaknya 3-4 tanda sebelum menentukan apakah akun palsu atau tidak.</p>
        `
    },
    {
        id: 3,
        title: "Analisis Profil",
        subtitle: "Cara menganalisis profil media sosial",
        content: `
            <h3>🔬 Langkah-langkah Analisis Profil</h3>
            
            <div class="highlight">
                <h4>Langkah 1: Periksa Foto Profil</h4>
                <ul>
                    <li>Apakah foto jelas dan profesional?</li>
                    <li>Apakah foto terlihat asli atau dari stock photo?</li>
                    <li>Apakah ada tanda-tanda editing berlebihan?</li>
                    <li>Apakah foto konsisten dengan identitas yang diklaim?</li>
                </ul>
            </div>
            
            <div class="example">
                <h4>Langkah 2: Analisis Username dan Bio</h4>
                <ul>
                    <li>Username yang mencurigakan: @john_doe_123, @official_ceo</li>
                    <li>Bio yang terlalu generik: "Love life, travel, food"</li>
                    <li>Bio yang defensif: "This is my REAL account, don't believe fakes"</li>
                    <li>Bio yang meminta DM: "DM me for collaboration"</li>
                </ul>
            </div>
            
            <div class="warning">
                <h4>Langkah 3: Periksa Statistik</h4>
                <ul>
                    <li>Rasio followers/following yang tidak wajar</li>
                    <li>Jumlah posts yang tidak proporsional</li>
                    <li>Tanggal bergabung vs jumlah followers</li>
                    <li>Engagement rate yang sangat rendah</li>
                </ul>
            </div>
            
            <div class="highlight">
                <h4>Langkah 4: Analisis Konten</h4>
                <ul>
                    <li>Apakah posting konsisten dengan identitas?</li>
                    <li>Apakah ada tanda-tanda copy-paste?</li>
                    <li>Apakah interaksi terlihat natural?</li>
                    <li>Apakah ada link mencurigakan?</li>
                </ul>
            </div>
        `
    },
    {
        id: 4,
        title: "Tips Keamanan",
        subtitle: "Cara melindungi diri dari akun palsu",
        content: `
            <h3>🛡️ Tips Melindungi Diri</h3>
            
            <div class="highlight">
                <h4>1. Verifikasi Identitas</h4>
                <ul>
                    <li>Periksa akun resmi di website perusahaan</li>
                    <li>Cari informasi di Google atau media sosial lain</li>
                    <li>Periksa apakah ada akun serupa dengan followers lebih banyak</li>
                    <li>Hubungi langsung melalui saluran resmi</li>
                </ul>
            </div>
            
            <div class="warning">
                <h4>2. Jangan Terburu-buru</h4>
                <ul>
                    <li>Jangan langsung percaya tawaran yang terlalu bagus</li>
                    <li>Jangan klik link mencurigakan</li>
                    <li>Jangan berikan informasi pribadi dengan mudah</li>
                    <li>Jangan transfer uang tanpa verifikasi</li>
                </ul>
            </div>
            
            <div class="example">
                <h4>3. Gunakan Fitur Keamanan</h4>
                <ul>
                    <li>Aktifkan two-factor authentication</li>
                    <li>Gunakan password yang kuat dan unik</li>
                    <li>Periksa pengaturan privasi secara berkala</li>
                    <li>Laporkan akun mencurigakan ke platform</li>
                </ul>
            </div>
            
            <div class="highlight">
                <h4>4. Tetap Waspada</h4>
                <ul>
                    <li>Selalu verifikasi sebelum mempercayai</li>
                    <li>Jangan mudah terpengaruh oleh followers banyak</li>
                    <li>Perhatikan pola dan konsistensi akun</li>
                    <li>Bagikan pengetahuan ke teman dan keluarga</li>
                </ul>
            </div>
            
            <p><strong>Ingat:</strong> Lebih baik berhati-hati daripada menyesal kemudian!</p>
        `
    }
];

// Initialize Learning System
function initLearning() {
    showWelcomePopup();
}

// Show Welcome Popup
function showWelcomePopup() {
    document.getElementById('welcomePopup').style.display = 'flex';
    document.getElementById('learningOverviewScreen').style.display = 'none';
    document.getElementById('lessonScreen').style.display = 'none';
    document.getElementById('completionScreen').style.display = 'none';
    
    // Scroll to top
    document.querySelector('.learning-interface').scrollTop = 0;
}

// Show Learning Overview
function showLearningOverview() {
    document.getElementById('welcomePopup').style.display = 'none';
    document.getElementById('learningOverviewScreen').style.display = 'block';
    document.getElementById('lessonScreen').style.display = 'none';
    document.getElementById('completionScreen').style.display = 'none';
    
    // Scroll to top
    document.querySelector('.learning-interface').scrollTop = 0;
}

// Start Learning
function startLearning() {
    currentLesson = 1;
    document.getElementById('currentLesson').textContent = '1';
    document.getElementById('completionPercent').textContent = '25';
    showLesson(1);
    
    // Scroll to top
    document.querySelector('.learning-interface').scrollTop = 0;
}

// Show Lesson
function showLesson(lessonNumber) {
    const lesson = lessons.find(l => l.id === lessonNumber);
    if (!lesson) return;

    document.getElementById('welcomePopup').style.display = 'none';
    document.getElementById('learningOverviewScreen').style.display = 'none';
    document.getElementById('lessonScreen').style.display = 'block';
    document.getElementById('completionScreen').style.display = 'none';

    document.getElementById('lessonHeading').textContent = lesson.title;
    document.getElementById('lessonSubtitle').textContent = lesson.subtitle;
    document.getElementById('lessonBody').innerHTML = lesson.content;

    // Show/hide navigation buttons
    document.getElementById('prevBtn').style.display = lessonNumber === 1 ? 'none' : 'block';
    document.getElementById('nextBtn').textContent = 'Selanjutnya';

    currentLesson = lessonNumber;
    
    // Update stats
    document.getElementById('currentLesson').textContent = currentLesson;
    const completionPercent = Math.round((currentLesson / totalLessons) * 100);
    document.getElementById('completionPercent').textContent = completionPercent;
    
    // Scroll to top
    document.querySelector('.learning-interface').scrollTop = 0;
}

// Next Lesson
function nextLesson() {
    if (currentLesson === lessons.length) {
        showCompletion();
    } else {
        showLesson(currentLesson + 1);
    }
}

// Previous Lesson
function previousLesson() {
    if (currentLesson > 1) {
        showLesson(currentLesson - 1);
    }
}

// Show Completion
function showCompletion() {
    document.getElementById('welcomePopup').style.display = 'none';
    document.getElementById('learningOverviewScreen').style.display = 'none';
    document.getElementById('lessonScreen').style.display = 'none';
    document.getElementById('completionScreen').style.display = 'block';
    
    // Update final stats
    document.getElementById('currentLesson').textContent = totalLessons;
    document.getElementById('completionPercent').textContent = '100';
    
    // Scroll to top
    document.querySelector('.learning-interface').scrollTop = 0;
    
    // Tambahkan event listener untuk tombol selesai (gunakan class selector)
    var selesaiBtn = document.querySelector('.restart-btn');
    if (selesaiBtn) {
        selesaiBtn.addEventListener('click', function() {
            window.parent.postMessage({ type: 'gameCompleted', points: 100 }, '*');
        });
    }
}

// Restart Learning
function restartLearning() {
    // Tidak melakukan apa-apa - tombol selesai tidak memiliki aksi
}





// Show Help
function showHelp() {
    document.getElementById('helpModal').style.display = 'flex';
}

// Close Help
function closeHelp() {
    document.getElementById('helpModal').style.display = 'none';
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initLearning();
    
    // Close modal when clicking outside
    document.getElementById('helpModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeHelp();
        }
    });
});

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

  