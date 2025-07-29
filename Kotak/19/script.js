// Update waktu setiap menit
function updateTime() {
    const timeElement = document.querySelector('.time');
    if (timeElement) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}`;
    }
}

// Popup intro simulasi
function showIntroPopup() {
    const introPopup = document.createElement('div');
    introPopup.className = 'intro-popup-bg';
    introPopup.innerHTML = `
        <div class="intro-popup-card">
            <p>Di sini kamu akan mencoba mengikuti tren <b>Add Yours</b> seperti di media sosial.</p>
            <button class="btn-intro-start">Mulai</button>
        </div>
    `;
    // Sisipkan ke dalam .device-screen, bukan body
    const deviceScreen = document.querySelector('.device-screen');
    if (deviceScreen) {
        deviceScreen.appendChild(introPopup);
    }
    document.body.style.overflow = 'hidden';
    document.querySelector('.btn-intro-start').onclick = function() {
        introPopup.remove();
        document.body.style.overflow = '';
        showTutorialPetunjuk();
    };
}

// Petunjuk tutorial highlight tombol Add Yours
function showTutorialPetunjuk() {
    // Pastikan hanya tombol panah (story-arrow-btn) yang di-highlight
    const arrowBtn = document.querySelector('.story-arrow-btn');
    if (!arrowBtn) return;
    // Tambahkan efek highlight
    arrowBtn.classList.add('highlight-add-yours');
    // Buat elemen instruksi
    const instruksi = document.createElement('div');
    instruksi.className = 'petunjuk-add-yours';
    instruksi.innerHTML = 'Klik tombol <b>kirim</b> untuk mengunggah postingan!';
    // Sisipkan instruksi di bawah tombol
    arrowBtn.parentNode.insertBefore(instruksi, arrowBtn.nextSibling);
    // Hapus highlight dan instruksi saat tombol diklik
    arrowBtn.addEventListener('click', function handler() {
        arrowBtn.classList.remove('highlight-add-yours');
        if (instruksi) instruksi.remove();
        arrowBtn.removeEventListener('click', handler);
    });
}

// Event untuk tombol send
document.addEventListener('DOMContentLoaded', function() {
    showIntroPopup();
    // Update waktu saat halaman dimuat
    updateTime();
    
    // Update waktu setiap menit
    setInterval(updateTime, 60000);
    
    // Fungsi untuk menampilkan warning dan menambahkan event listener
    function showWarningAndSetupListener(buttonText) {
            const appContainer = document.querySelector('.app-container');
            if (appContainer) {
                appContainer.innerHTML = `
                    <div class="snapgram-warning-bg">
                        <h2 class="snapgram-warning-title">Anda telah membagikan informasi pribadi Anda ke publik.</h2>
                        <p class="snapgram-warning-desc">
                            Hati-hati saat membagikan foto hewan peliharaan pertamamu!<br>
                            Informasi seperti nama hewan peliharaan sering digunakan sebagai pertanyaan keamanan pada akun digital. Jika kamu membagikan foto dan nama hewan peliharaanmu, orang lain bisa saja menggunakannya untuk menebak atau meretas akunmu.<br><br>
                            <b>Jangan mudah ikut tren <span style='color:#e6683c'>Add Yours</span></b> jika diminta membagikan data atau cerita pribadi. Selalu pikirkan dampaknya sebelum membagikan sesuatu ke publik.
                        </p>
                        <div class="snapgram-warning-footer">Lindungi privasimu, jangan mudah membagikan data pribadi di internet!</div>
                    <button class="btn-privasi-info" id="btn-privasi-info">${buttonText}</button>
                    </div>
                `;
            
            // Tambahkan event listener untuk tombol Pelajari
            setTimeout(() => {
                const privasiBtn = document.getElementById('btn-privasi-info');
                if (privasiBtn) {
                    privasiBtn.addEventListener('click', function() {
                        // Kirim pesan ke parent window untuk menutup minigame
                        window.parent.postMessage({ type: 'gameCompleted', points: 100 }, '*');
                    });
                }
            }, 100);
        }
    }
    
    // Event handler untuk tombol send
    const sendBtn = document.querySelector('.story-arrow-btn');
    if (sendBtn) {
        sendBtn.addEventListener('click', function() {
            showWarningAndSetupListener('Pelajari Lebih Lanjut');
        });
    }
    
    // Event handler untuk tombol Add Yours
    const addYoursBtn = document.querySelector('.add-yours-btn');
    if (addYoursBtn) {
        addYoursBtn.addEventListener('click', function() {
            showWarningAndSetupListener('Pelajari Data Privasi');
        });
    }
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