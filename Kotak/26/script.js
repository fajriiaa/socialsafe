document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.story-slide');
    const arrowLeft = document.querySelector('.arrow-left');
    const arrowRight = document.querySelector('.arrow-right');
    const playButtons = document.querySelectorAll('.story-play');
    let currentSlide = 0;
    let progressInterval;
    let countdownInterval;
    let isPaused = false;
    let pauseStartTime = 0;
    let totalPausedTime = 0;
    let slideStartTime = 0;
    const SLIDE_DURATION = 30000; // 30 detik dalam milidetik

    // Fungsi untuk update icon play/pause
    function updatePlayIcon() {
        playButtons.forEach(btn => {
            if (isPaused) {
                btn.textContent = '▶';
                btn.style.color = '#fff';
            } else {
                btn.textContent = '⏸';
                btn.style.color = '#fff';
            }
        });
    }

    // Fungsi untuk menampilkan slide
    function showSlide(index) {
        // Sembunyikan semua slide
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Tampilkan slide yang dipilih
        if (slides[index]) {
            slides[index].classList.add('active');
        }

        // Reset waktu pause untuk slide baru
        totalPausedTime = 0;
        isPaused = false;

        // Update icon play/pause
        updatePlayIcon();

        // Update progress bar
        updateProgressBar(index);

        // Update visibilitas arrow
        updateArrows(index, slides.length);
    }

    // Fungsi untuk update progress bar
    function updateProgressBar(slideIndex) {
        // Ambil slide aktif
        const activeSlide = slides[slideIndex];
        // Ambil semua segment di slide aktif
        const progressSegments = activeSlide.querySelectorAll('.story-progress-segment');

        // Reset semua progress di slide aktif
        progressSegments.forEach((segment, idx) => {
            segment.classList.remove('active');
            segment.classList.remove('filled');
            segment.style.setProperty('--progress-width', '0%');
        });

        // Tandai bar yang sudah penuh (sebelum slide aktif)
        for (let i = 0; i < slideIndex; i++) {
            // Cari slide sebelumnya dan segment di dalamnya
            const prevSlide = slides[i];
            const prevSegments = prevSlide.querySelectorAll('.story-progress-segment');
            prevSegments.forEach(seg => {
                seg.classList.add('filled');
                seg.style.setProperty('--progress-width', '100%');
            });
        }

        // Aktifkan progress untuk segment di slide aktif
        if (progressSegments[slideIndex]) {
            progressSegments[slideIndex].classList.add('active');
            startProgressAnimation(progressSegments[slideIndex]);
        }
    }

    // Fungsi untuk pause progress
    function pauseProgress() {
        if (!isPaused) {
            isPaused = true;
            pauseStartTime = Date.now();
            clearInterval(progressInterval);
            clearInterval(countdownInterval);
            
            // Update icon tombol play
            updatePlayIcon();
        }
    }

    // Fungsi untuk resume progress
    function resumeProgress() {
        if (isPaused) {
            isPaused = false;
            totalPausedTime += Date.now() - pauseStartTime;
            
            // Update icon tombol play
            updatePlayIcon();
            
            // Resume progress animation
            const activeSlide = slides[currentSlide];
            const progressSegments = activeSlide.querySelectorAll('.story-progress-segment');
            if (progressSegments[currentSlide]) {
                startProgressAnimation(progressSegments[currentSlide]);
            }
        }
    }

    // Fungsi untuk toggle pause/play
    function togglePausePlay() {
        if (isPaused) {
            resumeProgress();
        } else {
            pauseProgress();
        }
    }

    // Fungsi untuk animasi progress bar
    function startProgressAnimation(segment) {
        slideStartTime = Date.now() - totalPausedTime; // Waktu mulai dengan kompensasi pause
        let timeLeft = 30; // 30 detik
        const duration = SLIDE_DURATION; // 30 detik
        const interval = 100; // Update setiap 100ms untuk animasi yang lebih smooth

        // Update countdown timer
        updateCountdown(timeLeft);

        progressInterval = setInterval(() => {
            if (isPaused) {
                return; // Jangan update jika sedang pause
            }
            
            const elapsed = Date.now() - slideStartTime;
            const progress = Math.min((elapsed / duration) * 100, 100);
            timeLeft = Math.max(0, 30 - Math.floor(elapsed / 1000));
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                clearInterval(countdownInterval);
                segment.classList.add('filled'); // Bar jadi putih penuh
                // Auto pindah ke slide berikutnya
                setTimeout(() => {
                    nextSlide();
                }, 100);
            }
            
            segment.style.setProperty('--progress-width', progress + '%');
            updateCountdown(timeLeft);
        }, interval);
    }

    // Fungsi untuk update countdown timer
    function updateCountdown(seconds) {
        const durationElements = document.querySelectorAll('.story-duration');
        durationElements.forEach(element => {
            element.textContent = `${seconds}s`;
        });
    }

    // Fungsi untuk slide berikutnya
    function nextSlide() {
        clearInterval(progressInterval);
        clearInterval(countdownInterval);
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            showSlide(currentSlide);
        }
        // Jika sudah di slide terakhir, tidak melakukan apa-apa
    }

    // Fungsi untuk slide sebelumnya
    function prevSlide() {
        clearInterval(progressInterval);
        clearInterval(countdownInterval);
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    // Event listener untuk tombol play
    playButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Mencegah event bubbling
            togglePausePlay();
        });
    });

    // Event listener untuk tombol navigasi
    arrowLeft.addEventListener('click', () => {
        clearInterval(progressInterval);
        clearInterval(countdownInterval);
        prevSlide();
    });

    arrowRight.addEventListener('click', () => {
        clearInterval(progressInterval);
        clearInterval(countdownInterval);
        nextSlide();
    });

    // Touch/swipe support untuk mobile
    let touchStartX = 0;
    let touchEndX = 0;

    const deviceScreen = document.querySelector('.device-screen');

    deviceScreen.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    deviceScreen.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            clearInterval(progressInterval);
            clearInterval(countdownInterval);
            
            if (diff > 0) {
                // Swipe kiri - next slide
                nextSlide();
            } else {
                // Swipe kanan - prev slide
                prevSlide();
            }
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        clearInterval(progressInterval);
        clearInterval(countdownInterval);
        
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === ' ' || e.key === 'Spacebar') {
            // Spacebar untuk toggle pause/play
            e.preventDefault();
            togglePausePlay();
        }
    });

    // Interaksi polling Instagram YES/NO
    const questionBox = document.querySelector('.question-box');
    const yesBtn = questionBox?.querySelector('.question-btn.yes');
    const noBtn = questionBox?.querySelector('.question-btn.no');
    const optionsBox = questionBox?.querySelector('.question-options');

    function showResult(answer) {
        if (!questionBox || !optionsBox) return;
        optionsBox.innerHTML = '';
        if (answer === 'yes') {
            optionsBox.innerHTML = `
                <div style="width:100%;text-align:center;">
                    <div class="question-btn yes" style="font-size:1.1rem;">YES</div>
                    <div class="poll-result" style="font-size:2.1rem;font-weight:700;color:#222;line-height:1;margin-top:2px;">100<span style='font-size:1.1rem;font-weight:400;'>%</span></div>
                </div>
            `;
        } else if (answer === 'no') {
            optionsBox.innerHTML = `
                <div style="display:flex;width:100%;">
                    <div style="flex:1;text-align:center;">
                        <div class="question-btn yes" style="font-size:1.1rem;">YES</div>
                        <div class="poll-result" style="font-size:1.5rem;font-weight:700;color:#222;line-height:1;margin-top:2px;">50<span style='font-size:1rem;font-weight:400;'>%</span></div>
                    </div>
                    <div style="flex:1;text-align:center;">
                        <div class="question-btn no" style="font-size:1.1rem;">NO</div>
                        <div class="poll-result" style="font-size:1.5rem;font-weight:700;color:#222;line-height:1;margin-top:2px;">50<span style='font-size:1rem;font-weight:400;'>%</span></div>
                    </div>
                </div>
            `;
        }
    }

    yesBtn?.addEventListener('click', function() {
        showResult('yes');
    });
    noBtn?.addEventListener('click', function() {
        showResult('no');
    });

    // Fungsi untuk update visibilitas arrow
    function updateArrows(currentSlide, totalSlides) {
        var leftArrow = document.querySelector('.arrow-left');
        var rightArrow = document.querySelector('.arrow-right');
        if(leftArrow) leftArrow.style.display = (currentSlide === 0) ? 'none' : '';
        if(rightArrow) rightArrow.style.display = (currentSlide === totalSlides - 1) ? 'none' : '';
    }

    // Inisialisasi
    showSlide(0);

    var input = document.getElementById('ig-question-input');
    var sendBtn = document.getElementById('ig-send-btn');
    if(input && sendBtn) {
        // Placeholder manual
        function updatePlaceholder() {
            if(input.innerText.trim().length === 0) {
                input.innerText = 'Type something...';
                input.classList.add('placeholder');
                sendBtn.style.display = 'none';
            } else if(input.innerText === 'Type something...') {
                sendBtn.style.display = 'none';
            } else {
                input.classList.remove('placeholder');
                sendBtn.style.display = 'block';
            }
        }
        input.addEventListener('focus', function() {
            if(input.innerText === 'Type something...') {
                input.innerText = '';
                input.classList.remove('placeholder');
            }
        });
        input.addEventListener('blur', function() {
            if(input.innerText.trim().length === 0) {
                input.innerText = 'Type something...';
                input.classList.add('placeholder');
                sendBtn.style.display = 'none';
            }
        });
        input.addEventListener('input', function() {
            updatePlaceholder();
        });
        sendBtn.addEventListener('click', function() {
            // Aksi setelah klik send, misal reset input
            input.innerText = 'Type something...';
            input.classList.add('placeholder');
            sendBtn.style.display = 'none';
            input.focus();

            // Tampilkan tampilan akhir edukasi
            var screenContent = document.querySelector('.screen-content');
            var storyActions = document.querySelector('.story-actions');
            var finish = document.getElementById('edukasi-finish');
            if(screenContent) screenContent.style.display = 'none';
            if(storyActions) storyActions.style.display = 'none';
            if(finish) finish.style.display = 'flex';
        });
        // Inisialisasi
        updatePlaceholder();
    }

    // Tambahkan event listener untuk tombol selesai edukasi
    const selesaiBtn = document.getElementById('edukasi-continue-btn');
    if (selesaiBtn) {
        selesaiBtn.onclick = function() {
            // Kirim pesan ke parent window untuk menutup overlay
            if (window.parent !== window) {
                window.parent.postMessage({ type: 'gameCompleted', points: 100 }, '*');
            }
        };
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