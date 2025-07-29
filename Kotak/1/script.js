const gameStages = [
    {
        title: "Langkah 1: Panjang Password",
        instruction: "Masukkan kata dengan minimal 8 karakter",
        tip: "Password yang lebih panjang lebih sulit untuk diretas. Gunakan minimal 8 karakter untuk keamanan dasar.",
        icon: "fa-ruler-horizontal",
        validate: (password) => password.length >= 8,
        feedback: {
            success: "Bagus! Password yang panjang adalah langkah pertama menuju keamanan yang lebih baik.",
            error: "Password terlalu pendek. Gunakan minimal 8 karakter untuk keamanan dasar."
        },
        fact: "Tahukah Anda? Password 8 karakter dapat diretas dalam waktu beberapa jam, sementara password 12 karakter butuh ratusan tahun untuk diretas!"
    },
    {
        title: "Langkah 2: Huruf Kapital",
        instruction: "Tambahkan minimal satu huruf kapital",
        tip: "Kombinasi huruf besar dan kecil membuat password lebih kompleks dan lebih sulit ditebak.",
        icon: "fa-font",
        validate: (password) => /[A-Z]/.test(password),
        feedback: {
            success: "Sempurna! Penggunaan huruf kapital membuat password Anda lebih kuat.",
            error: "Tambahkan minimal satu huruf kapital untuk meningkatkan keamanan."
        },
        fact: "Penggunaan huruf kapital meningkatkan kompleksitas password Anda hingga 8 kali lipat!"
    },
    {
        title: "Langkah 3: Angka",
        instruction: "Tambahkan minimal satu angka",
        tip: "Angka menambah kompleksitas password dan membuatnya lebih sulit untuk diretas.",
        icon: "fa-hashtag",
        validate: (password) => /[0-9]/.test(password),
        feedback: {
            success: "Hebat! Angka membuat password Anda semakin kuat.",
            error: "Tambahkan minimal satu angka untuk meningkatkan keamanan."
        },
        fact: "26% pengguna media sosial menggunakan tanggal lahir mereka sebagai password - jangan lakukan ini!"
    },
    {
        title: "Langkah 4: Karakter Khusus",
        instruction: "Tambahkan minimal satu karakter khusus (!@#$%^&*)",
        tip: "Karakter khusus membuat password Anda jauh lebih sulit untuk ditebak atau diretas.",
        icon: "fa-star",
        validate: (password) => /[!@#$%^&*]/.test(password),
        feedback: {
            success: "Luar biasa! Password Anda sekarang sangat kuat dan aman.",
            error: "Tambahkan minimal satu karakter khusus (!@#$%^&*) untuk keamanan maksimal."
        },
        fact: "Penggunaan karakter khusus dapat meningkatkan kekuatan password Anda hingga 100 kali lipat!"
    }
];

let currentStage = 0;
let currentPassword = '';

function startGame() {
    // Sembunyikan welcome screen jika ada
    var welcome = document.getElementById('welcome-screen');
    if (welcome) welcome.classList.add('hidden');

    // Tampilkan password screen jika ada
    var passwordInput = document.getElementById('password-input');
    if (passwordInput) passwordInput.classList.remove('hidden');

    showPasswordScreen();
    updateProgress();
}

function showPasswordScreen() {
    const stage = gameStages[currentStage];
    const passwordScreen = document.getElementById('password-input');
    if (!passwordScreen) return;
    passwordScreen.classList.remove('hidden');
    
    passwordScreen.innerHTML = `
        <div class="stage-header">
            <h2>${stage.title}</h2>
        </div>
        <p class="instruction">${stage.instruction}</p>
        
        <div class="password-requirements">
            <div class="requirement-header">
                <p class="highlight">Tips Keamanan:</p>
            </div>
            <p>${stage.tip}</p>
            <div class="fun-fact">
                <p>${stage.fact}</p>
            </div>
        </div>

        <div class="password-input-container" style="display:flex;align-items:center;gap:8px;max-width:320px;">
            <input type="password" 
                   class="password-input" 
                   id="passwordInput" 
                   value="${currentPassword}"
                   placeholder="Masukkan password Anda">
            <button class="btn-primary" style="width:auto;min-width:80px;padding:8px 18px;margin:0;position:static;transform:none;" onclick="checkPassword()">
                Submit
            </button>
            <button class="toggle-password" onclick="togglePasswordVisibility()">
                <span class="icon-eye"></span>
            </button>
        </div>

        <div id="feedback"></div>
    `;

    document.getElementById('passwordInput').focus();
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('passwordInput');
    if (!passwordInput) return;
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
}

function checkPassword() {
    const password = document.getElementById('passwordInput').value;
    const stage = gameStages[currentStage];
    const feedbackElement = document.getElementById('feedback');
    
    if (stage.validate(password)) {
        currentPassword = password;
        feedbackElement.innerHTML = `
            <div class="feedback success">
                ${stage.feedback.success}
            </div>
        `;
        
        setTimeout(() => {
            if (currentStage < gameStages.length - 1) {
                currentStage++;
                showPasswordScreen();
                updateProgress();
            } else {
                showFinalScreen();
            }
        }, 1200);
    } else {
        feedbackElement.innerHTML = `
            <div class="feedback error">
                ${stage.feedback.error}
            </div>
        `;
        document.getElementById('passwordInput').classList.add('error');
    }
}

function updateProgress() {
    // Progress bar bisa ditambahkan di sini jika diperlukan
}

function showFinalScreen() {
    const gameContent = document.querySelector('.game-content');
    if (!gameContent) return;
    gameContent.innerHTML = `
        <div class="two-sides-layout" style="padding-top:22px;padding-bottom:22px;">
            <div class="side-left">
                <div class="social-card profile-card" style="margin-bottom:0;">
                    <div class="profile-header">
                        <div class="profile-photo-wrapper">
                            <img class="profile-photo" src="https://ui-avatars.com/api/?name=User&background=1a73e8&color=fff&rounded=true&size=96" alt="Foto Profil">
                            <span class="online-status online"></span>
                        </div>
                        <div class="profile-info">
                            <h3 class="profile-name">Nama Pengguna</h3>
                            <p class="profile-username">@username</p>
                            <p class="profile-bio">"Jaga privasi, jaga diri!"</p>
                            <span class="profile-status">Keamanan: <span class="status-badge tinggi">Tinggi</span></span>
                        </div>
                    </div>
                    <div class="profile-progress">
                        <div class="progress-label">Progress Keamanan Akun</div>
                        <div class="progress-bar-profile">
                            <div class="progress-fill" style="width: 100%"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="side-right">
                <div class="security-tips right-card" style="margin-bottom:18px;">
                    <h3 style="text-align:left; margin-bottom:10px; font-size:1.01rem; padding-left:16px;">Password Aman</h3>
                    <ul style="list-style:none; padding-left:16px; margin:0; text-align:left;">
                        <li style="margin-bottom:5px; font-size:0.93rem; color:#444; font-weight:500;">8+ karakter</li>
                        <li style="margin-bottom:5px; font-size:0.93rem; color:#444; font-weight:500;">Huruf besar</li>
                        <li style="margin-bottom:5px; font-size:0.93rem; color:#444; font-weight:500;">Angka</li>
                        <li style="margin-bottom:5px; font-size:0.93rem; color:#444; font-weight:500;">Simbol</li>
                    </ul>
                </div>
                <div class="info-box right-card" style="margin-bottom:18px;">
                    <p style="margin:0;font-size:0.93rem;color:#1a73e8;font-weight:500;">Password kamu sudah kuat dan aman. Selamat!</p>
                </div>
                <button class="btn-primary" style="position:absolute;left:50%;bottom:24px;transform:translateX(-50%);display:block;margin:0 auto;min-width:90px;max-width:120px;font-size:0.93rem;padding:7px 0;z-index:10;" onclick="completeGame()">
                    Selesai
                </button>
            </div>
        </div>
    `;
}

// Fungsi untuk mengatur scale device frame secara keseluruhan
function updateDeviceScale() {
    const deviceFrame = document.querySelector('.device-frame');
    if (!deviceFrame) return;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Ukuran asli device frame
    const originalWidth = 650;
    const originalHeight = 420;
    
    // Hitung scale berdasarkan viewport (gunakan yang lebih kecil)
    const scaleX = (viewportWidth * 0.9) / originalWidth;
    const scaleY = (viewportHeight * 0.9) / originalHeight;
    const scale = Math.min(scaleX, scaleY, 1); // Maksimal scale 1 (ukuran asli)
    
    deviceFrame.style.transform = `scale(${scale})`;
    deviceFrame.style.transformOrigin = 'center center';
}

// Panggil fungsi saat halaman dimuat dan saat window di-resize
window.addEventListener('load', updateDeviceScale);
window.addEventListener('resize', updateDeviceScale);

// Fungsi untuk menyelesaikan game dan mengirim pesan ke parent window
function completeGame() {
    // Kirim pesan ke parent window bahwa game selesai
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({
            type: 'gameCompleted',
            points: 50, // Poin untuk menyelesaikan game password
            gameType: 'password-security'
        }, '*');
    }
    // Tidak perlu animasi keluar, tidak perlu setTimeout, tidak perlu reload
}


