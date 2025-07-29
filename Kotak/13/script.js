// Instagram Simulation Script - Edukasi Keamanan Media Sosial
let currentStep = 0;
let fromFollowers = false;
let fromAbout = false;
let fromAboutBack = false;

// Tampilkan hanya intro petunjuk di awal
function showIntroStep(step) {
    document.getElementById('introPetunjuk').style.display = 'flex';
    document.getElementById('igMessageOverlay').style.display = 'none';
    document.querySelector('.ig-realistic-profile').style.display = 'none';
    document.getElementById('introTitle').style.display = (step === 0) ? 'block' : 'none';
    if (step === 0) {
        document.getElementById('introDesc').textContent = 'Kamu menemukan akun yang mencurigakan. Yuk, lakukan investigasi dan laporkan jika terbukti palsu!';
    } else if (step === 1) {
        document.getElementById('introDesc').textContent = 'Tiba-tiba Anda menerima DM atau di-follow akun yang mengaku resmi BCA dan menawarkan bantuan terkait layanan BCA.';
    }
}
showIntroStep(0);

// Next button untuk petunjuk 1 & 2
const introNextBtn = document.getElementById('introNextBtn');
introNextBtn.onclick = function() {
    if (currentStep === 0) {
        showIntroStep(1);
        currentStep = 1;
    } else if (currentStep === 1) {
        document.getElementById('introPetunjuk').style.display = 'none';
        document.getElementById('igMessageOverlay').style.display = 'block';
        currentStep = 2;
        setTimeout(showDmBubblePetunjuk, 2000);
    }
};

function updateTime() {
    const timeElement = document.querySelector('.time');
    if (timeElement) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}`;
    }
}

// Update waktu setiap menit
    updateTime();
setInterval(updateTime, 60000);

// Event listeners untuk menu dan popup
function showSubmitReportOverlay() {
    document.getElementById('igSubmitReportOverlay').style.display = 'block';
    document.getElementById('igSubmitReportOverlay').classList.add('submit-step-only');
}

function hideSubmitReportOverlay() {
    document.getElementById('igSubmitReportOverlay').style.display = 'none';
    document.getElementById('igSubmitReportOverlay').classList.remove('submit-step-only');
}

// Tampilkan popup selesai setelah submit
function showPopupSelesai() {
    document.getElementById('popupSelesaiOverlay').style.display = 'flex';
}
function hidePopupSelesai() {
    document.getElementById('popupSelesaiOverlay').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    const menuTop = document.querySelector('.ig-menu-top');
    if (menuTop) {
        menuTop.onclick = function() {
            if (fromAboutBack) {
                updateBottomNavText('report');
                document.getElementById('igPopupMenu').classList.add('popup-step-report');
                document.getElementById('igPopupMenu').classList.remove('popup-step-about');
            } else {
                updateBottomNavText('menu');
                document.getElementById('igPopupMenu').classList.add('popup-step-about');
                document.getElementById('igPopupMenu').classList.remove('popup-step-report');
            }
            fromFollowers = false;
            document.getElementById('igPopupOverlay').style.display = 'block';
            document.getElementById('igPopupMenu').style.display = 'block';
        };
    }

    const popupOverlay = document.getElementById('igPopupOverlay');
    if (popupOverlay) {
        popupOverlay.onclick = function() {
            document.getElementById('igPopupOverlay').style.display = 'none';
            document.getElementById('igPopupMenu').style.display = 'none';
            document.getElementById('igPopupMenu').classList.remove('popup-step-about');
            document.getElementById('igPopupMenu').classList.remove('popup-step-report');
        };
    }

    const aboutAccountBtn = document.getElementById('aboutAccountBtn');
    if (aboutAccountBtn) {
        aboutAccountBtn.onclick = function() {
            document.getElementById('igPopupOverlay').style.display = 'none';
            document.getElementById('igPopupMenu').style.display = 'none';
            document.getElementById('igAboutOverlay').style.display = 'block';
            updateBottomNavText('about');
        };
    }

    const igAboutBack = document.getElementById('igAboutBack');
    if (igAboutBack) {
        igAboutBack.onclick = function() {
            document.getElementById('igAboutOverlay').style.display = 'none';
            fromAbout = true;
            fromAboutBack = true;
            showProfileOverlay();
            controlInteraction(['.ig-followers-link']);
        };
    }

    const reportBtn = document.getElementById('reportBtn');
    if (reportBtn) {
        reportBtn.onclick = function() {
            document.getElementById('igPopupOverlay').style.display = 'none';
            document.getElementById('igPopupMenu').style.display = 'none';
            showReportOverlay();
            updateBottomNavText('reportPage');
        };
    }

    const igReportBack = document.getElementById('igReportBack');
    if (igReportBack) {
        igReportBack.onclick = function() {
            hideReportOverlay();
        };
    }

    const pretendReportBtn = document.getElementById('pretendReportBtn');
    if (pretendReportBtn) {
        pretendReportBtn.onclick = function() {
            hideReportOverlay();
            showSubmitReportOverlay();
            updateBottomNavText('submitReport');
        };
    }

    const igSubmitReportBack = document.getElementById('igSubmitReportBack');
    if (igSubmitReportBack) {
        igSubmitReportBack.onclick = function() {
            hideSubmitReportOverlay();
            showReportOverlay();
        };
    }

    const igSubmitReportBtn = document.getElementById('igSubmitReportBtn');
    if (igSubmitReportBtn) {
        igSubmitReportBtn.onclick = function() {
            hideSubmitReportOverlay();
            showPopupSelesai();
        };
    }
    const popupSelesaiBtn = document.getElementById('popupSelesaiBtn');
    if (popupSelesaiBtn) {
        popupSelesaiBtn.onclick = function() {
            window.parent.postMessage({ type: 'gameCompleted', points: 100 }, '*');
        };
    }

    const followersBtn = document.getElementById('followersBtn');
    if (followersBtn) {
        followersBtn.onclick = function() {
            document.getElementById('igFollowersOverlay').style.display = 'block';
            fromFollowers = false;
            updateBottomNavText('followers');
            controlInteraction([], true);
        };
    }

    const igFollowersBack = document.getElementById('igFollowersBack');
    if (igFollowersBack) {
        igFollowersBack.onclick = function() {
            document.getElementById('igFollowersOverlay').style.display = 'none';
            fromFollowers = true;
            showProfileOverlay();
            controlInteraction(['.ig-followers-link']);
        };
    }

    const igMessageBtn = document.getElementById('igMessageBtn');
    if (igMessageBtn) {
        igMessageBtn.onclick = function() {
            showDmOverlay();
        };
    }

    const igMessageBack = document.getElementById('igMessageBack');
    if (igMessageBack) {
        igMessageBack.onclick = function() {
            showProfileOverlay();
        };
    }

    const igMessageUserBox = document.getElementById('igMessageUserBox');
    if (igMessageUserBox) {
        igMessageUserBox.onclick = function() {
            showProfileOverlay();
        };
    }
});

function updateBottomNavText(page) {
    const dmNav = document.querySelector('.dm-bottom-nav:not(.profile-bottom-nav)');
    const profileNav = document.querySelector('.profile-bottom-nav');
    if (page === 'dm') {
        if (dmNav) dmNav.textContent = 'Ayo cek keaslian akun! Klik profil untuk investigasi!';
        if (profileNav) profileNav.textContent = 'Ayo cek keaslian akun! Klik profil untuk investigasi!';
    } else if (page === 'profile') {
        if (fromAbout) {
            const instruksi = 'Jika kamu menemukan akun fake instagram, kamu bisa melaporkannya agar tidak berpotensi terjadi tindak penipuan. Klik titik tiga';
            if (dmNav) dmNav.textContent = instruksi;
            if (profileNav) profileNav.textContent = instruksi;
        } else if (fromFollowers) {
            const instruksi = 'Ketuk tombol titik tiga di pojok kanan atas. Pilih menu About This Account (Tentang Akun Ini)';
            if (dmNav) dmNav.textContent = instruksi;
            if (profileNav) profileNav.textContent = instruksi;
        } else {
            if (dmNav) dmNav.textContent = 'Jangan cuma lihat jumlah followers, cek juga siapa saja yang follow akun ini!';
            if (profileNav) profileNav.textContent = 'Jangan cuma lihat jumlah followers, cek juga siapa saja yang follow akun ini!';
        }
    } else if (page === 'followers') {
        if (dmNav) dmNav.textContent = 'Banyak followers tanpa foto profil? Waspada, bisa jadi akun palsu! Mari kembali ke profil';
        if (profileNav) profileNav.textContent = 'Banyak followers tanpa foto profil? Waspada, bisa jadi akun palsu! Mari kembali ke profil';
    } else if (page === 'menu') {
        const menuInstruksi = 'Pilih menu About This Account (Tentang Akun Ini)';
        if (dmNav) dmNav.textContent = menuInstruksi;
        if (profileNav) profileNav.textContent = menuInstruksi;
    } else if (page === 'about') {
        const aboutInstruksi = 'Biasanya akun fake Instagram memiliki ciri-ciri tanggal bergabung yang masih baru atau terlalu sering mengganti usernamenya.';
        if (dmNav) dmNav.textContent = aboutInstruksi;
        if (profileNav) profileNav.textContent = aboutInstruksi;
    } else if (page === 'report') {
        const reportInstruksi = 'Pilih Report (Laporkan)';
        if (dmNav) dmNav.textContent = reportInstruksi;
        if (profileNav) profileNav.textContent = reportInstruksi;
    } else if (page === 'reportPage') {
        const reportPageInstruksi = "Selanjutnya, pilih It's pretending to be someone else (Berpura-pura menjadi orang lain)";
        if (dmNav) dmNav.textContent = reportPageInstruksi;
        if (profileNav) profileNav.textContent = reportPageInstruksi;
    } else if (page === 'submitReport') {
        const submitInstruksi = 'Klik Submit report untuk mengirim laporan';
        if (dmNav) dmNav.textContent = submitInstruksi;
        if (profileNav) profileNav.textContent = submitInstruksi;
    }
}

// Fungsi untuk menampilkan bubble petunjuk DM (petunjuk 3)
function showDmBubblePetunjuk() {
    var bubble = document.getElementById('dmBubblePetunjuk');
    if (bubble) bubble.style.display = 'flex';
    var btn = document.getElementById('closeDmBubbleBtn');
    if (btn) {
        btn.onclick = function() {
            document.getElementById('dmBubblePetunjuk').style.display = 'none';
        };
    }
}

// Panggil showDmBubblePetunjuk setiap kali DM overlay ditampilkan
function showDmOverlay() {
    document.getElementById('igMessageOverlay').style.display = 'block';
    document.querySelector('.ig-realistic-profile').style.display = 'none';
    updateBottomNavText('dm');
    showDmBubblePetunjuk();
}

// Fungsi untuk menampilkan bubble petunjuk 4 di profil IG
function showProfileBubblePetunjuk() {
    setTimeout(function() {
        var bubble = document.getElementById('profileBubblePetunjuk');
        if (bubble) bubble.style.display = 'flex';
        var btn = document.getElementById('closeProfileBubbleBtn');
        if (btn) {
            btn.onclick = function() {
                document.getElementById('profileBubblePetunjuk').style.display = 'none';
            };
        }
    }, 2000);
}

// Tampilkan bubble petunjuk 4 setiap kali profil IG muncul
function showProfileOverlay() {
    document.getElementById('igMessageOverlay').style.display = 'none';
    const profileEl = document.querySelector('.ig-realistic-profile');
    profileEl.style.display = 'block';
    // Tambahkan/atur class untuk step 2
    if (fromFollowers || fromAbout) {
        profileEl.classList.add('profile-step2');
        controlInteraction(['.ig-menu-top'], true);
    } else {
        profileEl.classList.remove('profile-step2');
        controlInteraction(['.ig-followers-link'], true);
    }
    updateBottomNavText('profile');
    showProfileBubblePetunjuk();
    // Reset flag setelah update
    fromFollowers = false;
    fromAbout = false;
}

function showReportOverlay() {
    document.getElementById('igReportOverlay').style.display = 'block';
    document.getElementById('igReportOverlay').classList.add('report-step-pretend');
}

function hideReportOverlay() {
    document.getElementById('igReportOverlay').style.display = 'none';
    document.getElementById('igReportOverlay').classList.remove('report-step-pretend');
}

// Fungsi untuk mengontrol interaksi
function controlInteraction(selectors, disableAll = false) {
    if (disableAll) {
        // Disable semua interaksi
        const allButtons = document.querySelectorAll('button, .ig-followers-link, .ig-menu-top');
        allButtons.forEach(btn => {
            btn.style.pointerEvents = 'none';
        });
        // Enable hanya selector yang diberikan
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.pointerEvents = 'auto';
            });
        });
    } else {
        // Enable semua
        const allButtons = document.querySelectorAll('button, .ig-followers-link, .ig-menu-top');
        allButtons.forEach(btn => {
            btn.style.pointerEvents = 'auto';
        });
    }
}

// Fungsi untuk reset ke state awal
function resetToInitialState() {
    // Reset variabel global
    currentStep = 0;
    fromFollowers = false;
    fromAbout = false;
    fromAboutBack = false;
    
    // Sembunyikan semua overlay dan popup
    document.getElementById('introPetunjuk').style.display = 'none';
    document.getElementById('igMessageOverlay').style.display = 'none';
    document.querySelector('.ig-realistic-profile').style.display = 'none';
    document.getElementById('igPopupOverlay').style.display = 'none';
    document.getElementById('igPopupMenu').style.display = 'none';
    document.getElementById('igAboutOverlay').style.display = 'none';
    document.getElementById('igFollowersOverlay').style.display = 'none';
    document.getElementById('igReportOverlay').style.display = 'none';
    document.getElementById('igSubmitReportOverlay').style.display = 'none';
    document.getElementById('popupSelesaiOverlay').style.display = 'none';
    
    // Hapus semua class yang mungkin ditambahkan
    document.getElementById('igPopupMenu').classList.remove('popup-step-about', 'popup-step-report');
    document.getElementById('igReportOverlay').classList.remove('report-step-pretend');
    document.getElementById('igSubmitReportOverlay').classList.remove('submit-step-only');
    document.querySelector('.ig-realistic-profile').classList.remove('profile-step2');
    
    // Sembunyikan bubble petunjuk
    const dmBubble = document.getElementById('dmBubblePetunjuk');
    if (dmBubble) dmBubble.style.display = 'none';
    const profileBubble = document.getElementById('profileBubblePetunjuk');
    if (profileBubble) profileBubble.style.display = 'none';
    
    // Reset bottom nav text
    updateBottomNavText('dm');
    
    // Enable semua interaksi
    controlInteraction([]);
    
    // Tampilkan kembali intro petunjuk
    document.getElementById('introPetunjuk').style.display = 'flex';
    document.getElementById('introTitle').style.display = 'block';
    document.getElementById('introDesc').textContent = 'Kamu menemukan akun yang mencurigakan. Yuk, lakukan investigasi dan laporkan jika terbukti palsu!';
}

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