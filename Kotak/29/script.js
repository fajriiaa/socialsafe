document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('igVideo');
    const overlay = document.getElementById('igVideoOverlay');
    const soundBtn = document.getElementById('igVideoSound');
    const soundIcon = soundBtn.querySelector('.material-symbols-outlined');
    const eduOverlay = document.querySelector('.ig-post-edu-overlay');

    let canShowDeepfakeWarning = false;

    // Play video on overlay click
    overlay.addEventListener('click', function() {
        video.muted = false;
        video.play();
        overlay.classList.add('hide');
        soundIcon && (soundIcon.textContent = 'volume_up');
        if (eduOverlay) eduOverlay.classList.add('hide');
    });

    // Toggle mute/unmute
    soundBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        video.muted = !video.muted;
        soundIcon.textContent = video.muted ? 'volume_off' : 'volume_up';
    });

    // Show overlay if video paused
    video.addEventListener('pause', function() {
        overlay.classList.remove('hide');
    });

    // Hide overlay if video play
    video.addEventListener('play', function() {
        overlay.classList.add('hide');
    });

    // Toggle play/pause on video click
    video.addEventListener('click', function() {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });

    // Nonaktifkan tombol Hubungi sekarang sampai petunjuk kedua muncul
    const btnHubungi = document.querySelector('.ig-post-btn');
    if (btnHubungi) {
        btnHubungi.disabled = true;
        btnHubungi.classList.add('disabled');
        btnHubungi.addEventListener('click', function(e) {
            if (!canShowDeepfakeWarning) {
                e.preventDefault();
                return;
            }
            e.preventDefault();
            showFullScreenDeepfakeWarning();
        });
    }

    // Show overlay and update petunjuk when video ended
    video.addEventListener('ended', function() {
        if (eduOverlay) {
            eduOverlay.classList.remove('hide');
            const box = eduOverlay.querySelector('.ig-post-edu-box');
            if (box) box.innerHTML = '<b>Petunjuk:</b><br>Karena percaya video ini asli, kamu jadi menghubungi.<br>Klik <b>Hubungi sekarang</b>';
        }
        if (btnHubungi) {
            btnHubungi.disabled = false;
            btnHubungi.classList.remove('disabled');
        }
        canShowDeepfakeWarning = true;
    });

    // Set initial icon
    soundIcon.textContent = video.muted ? 'volume_off' : 'volume_up';
});

// Fungsi untuk menampilkan warning deepfake full screen
function showFullScreenDeepfakeWarning() {
    const deviceScreen = document.querySelector('.device-screen');
    if (!deviceScreen) return;

    // Hapus warning yang sudah ada jika ada
    const existingWarning = document.querySelector('.ig-deepfake-fullscreen');
    if (existingWarning) {
        existingWarning.remove();
    }

    // Buat warning full screen
    const fullScreenWarning = document.createElement('div');
    fullScreenWarning.className = 'ig-deepfake-fullscreen';
    fullScreenWarning.innerHTML = `
        <div class="ig-deepfake-fullscreen-title">KAMU TERKENA PENIPUAN DEEPFAKE!</div>
        <div class="ig-deepfake-fullscreen-desc">
            Video yang kamu lihat adalah hasil manipulasi AI (deepfake).<br>
            Jangan mudah percaya dengan konten yang terlihat meyakinkan di internet.<br><br>
            <b>Selalu cek kebenaran informasi sebelum bertindak!</b>
        </div>
        <button class="ig-deepfake-fullscreen-retry">Pelajari Lebih Lanjut</button>
    `;

    // Tambahkan ke device screen
    deviceScreen.appendChild(fullScreenWarning);

    // Event listener untuk tombol retry
    const retryBtn = fullScreenWarning.querySelector('.ig-deepfake-fullscreen-retry');
    retryBtn.addEventListener('click', function() {
        // Kirim pesan ke parent window untuk menutup minigame
        if (window.parent) {
            window.parent.postMessage({ type: 'gameCompleted', points: 0 }, '*');
        }
    });
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