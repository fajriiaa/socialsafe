document.addEventListener('DOMContentLoaded', () => {
    // Intro screen elements
    const introScreen = document.getElementById('intro-screen');
    const progressIndicator = document.getElementById('progress-indicator');
    const eduRows = [
        document.getElementById('edu-case-1'),
        document.getElementById('edu-case-2'),
        document.getElementById('edu-case-3'),
        document.getElementById('edu-case-4')
    ];
    const segments = [
        document.getElementById('segment-1'),
        document.getElementById('segment-2'),
        document.getElementById('segment-3'),
        document.getElementById('segment-4')
    ];
    const eduNavBtnsPrev = document.querySelectorAll('.nav-prev');
    const eduNavBtnsNext = document.querySelectorAll('.nav-next');
    const startLearningBtn = document.getElementById('start-learning-btn');
    const selesaiBtn = document.getElementById('selesai-btn');
    let current = 0;
    let isIntroActive = true;

    function showIntro() {
        introScreen.style.display = 'flex';
        progressIndicator.style.display = 'none';
        eduRows.forEach(row => row.style.display = 'none');
        isIntroActive = true;
    }

    function startLearning() {
        introScreen.style.display = 'none';
        progressIndicator.style.display = 'flex';
        eduRows.forEach((row, idx) => {
            row.style.display = idx === current ? 'flex' : 'none';
        });
        isIntroActive = false;
        updateView();
    }

    function updateView() {
        if (isIntroActive) return;
        eduRows.forEach((row, idx) => {
            row.style.display = idx === current ? 'flex' : 'none';
        });
        // Update tombol prev/next
        eduNavBtnsPrev.forEach(btn => btn.disabled = current === 0);
        eduNavBtnsNext.forEach(btn => btn.disabled = current === eduRows.length - 1);
        // Update progress bar ala IG story
        segments.forEach((seg, idx) => {
            seg.classList.remove('active', 'seen');
            if (idx < current) {
                seg.classList.add('seen');
            } else if (idx === current) {
                seg.classList.add('active');
            }
        });
    }

    // Event listeners
    startLearningBtn.addEventListener('click', startLearning);
    eduNavBtnsPrev.forEach(btn => btn.addEventListener('click', () => {
        if (current > 0) {
            current--;
            updateView();
        }
    }));
    eduNavBtnsNext.forEach(btn => btn.addEventListener('click', () => {
        if (current < eduRows.length - 1) {
            current++;
            updateView();
        }
    }));

    // Tombol selesai dengan animasi closing
    if (selesaiBtn) {
        selesaiBtn.addEventListener('click', function() {
            // Tambahkan class closing untuk animasi
            const deviceFrameLock = document.querySelector('.device-frame-lock');
            if (deviceFrameLock) {
                deviceFrameLock.classList.add('closing');
                
                // Tunggu animasi selesai, lalu kirim pesan ke parent
                setTimeout(() => {
                    window.parent.postMessage({ type: 'gameCompleted', points: 100 }, '*');
                }, 500);
            }
        });
    }

    // Initialize with intro screen
    showIntro();
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