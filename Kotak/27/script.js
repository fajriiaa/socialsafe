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
    
    // Array untuk melacak quiz yang sudah dijawab
    let answeredQuizzes = [];
    
    // Array untuk melacak jawaban yang benar
    let correctAnswers = [];
    
    // Variabel untuk mengontrol mode result
    let isInResultMode = false;

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

        // Sembunyikan/tampilkan tombol panah
        if (arrowLeft) arrowLeft.style.display = (index === 0) ? 'none' : '';
        if (arrowRight) arrowRight.style.display = (index === slides.length - 1) ? 'none' : '';

        // Play/pause video hanya di slide 2, 3, dan 5
        const video2 = document.querySelector('.story-slide[data-slide="2"] video');
        if (video2) {
            if (index === 1) {
                video2.play();
            } else {
                video2.pause();
                video2.currentTime = 0;
            }
        }
        const video3 = document.querySelector('.story-slide[data-slide="3"] video');
        if (video3) {
            if (index === 2) {
                video3.play();
            } else {
                video3.pause();
                video3.currentTime = 0;
            }
        }
        const video5 = document.querySelector('.story-slide[data-slide="5"] video');
        if (video5) {
            if (index === 4) {
                video5.play();
            } else {
                video5.pause();
                video5.currentTime = 0;
            }
        }

        // Reset waktu pause untuk slide baru
        totalPausedTime = 0;
        isPaused = false;

        // Update icon play/pause
        updatePlayIcon();

        // Update icon love berdasarkan slide aktif
        updateLoveIcon();

        // Update progress bar
        updateProgressBar(index);
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
            
            // Pause video di slide 2, 3, dan 5 jika ada
            const video2 = document.querySelector('.story-slide[data-slide="2"] video');
            if (video2) video2.pause();
            const video3 = document.querySelector('.story-slide[data-slide="3"] video');
            if (video3) video3.pause();
            const video5 = document.querySelector('.story-slide[data-slide="5"] video');
            if (video5) video5.pause();
            // Update icon tombol play
            updatePlayIcon();
        }
    }

    // Fungsi untuk resume progress
    function resumeProgress() {
        if (isPaused) {
            isPaused = false;
            totalPausedTime += Date.now() - pauseStartTime;
            
            // Play video di slide 2, 3, dan 5 jika ada dan sedang di slide 2/3/5
            const video2 = document.querySelector('.story-slide[data-slide="2"] video');
            if (video2 && currentSlide === 1) video2.play();
            const video3 = document.querySelector('.story-slide[data-slide="3"] video');
            if (video3 && currentSlide === 2) video3.play();
            const video5 = document.querySelector('.story-slide[data-slide="5"] video');
            if (video5 && currentSlide === 4) video5.play();
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
        if (isInResultMode) return; // Jangan toggle pause/play jika dalam mode result
        
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
        if (isInResultMode) return; // Jangan pindah slide jika dalam mode result
        
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
        if (isInResultMode) return; // Jangan pindah slide jika dalam mode result
        
        clearInterval(progressInterval);
        clearInterval(countdownInterval);
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    // Event listener untuk tombol play
    playButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (isInResultMode) return; // Jangan toggle pause/play jika dalam mode result
            
            e.stopPropagation(); // Mencegah event bubbling
            togglePausePlay();
        });
    });

    // Event listener untuk tombol navigasi
    arrowLeft.addEventListener('click', () => {
        if (isInResultMode) return; // Jangan pindah slide jika dalam mode result
        
        clearInterval(progressInterval);
        clearInterval(countdownInterval);
        prevSlide();
    });

    arrowRight.addEventListener('click', () => {
        if (isInResultMode) return; // Jangan pindah slide jika dalam mode result
        
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
        if (isInResultMode) return; // Jangan handle swipe jika dalam mode result
        
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
        if (isInResultMode) return; // Jangan handle keyboard jika dalam mode result
        
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

    // Event handler quiz slide 2
    function setupQuizSlide2() {
        const slide2 = document.querySelector('.story-slide[data-slide="2"]');
        if (!slide2) return;
        const options = slide2.querySelectorAll('.ig-quiz-option');
        let answered = false;
        options.forEach(option => {
            option.addEventListener('click', function() {
                if (answered) return;
                answered = true;
                options.forEach(opt => {
                    if (opt.dataset.answer === 'correct') {
                        opt.classList.add('correct');
                    } else {
                        opt.classList.add('incorrect');
                    }
                });
                
                // Tambahkan slide 2 ke array answeredQuizzes
                if (!answeredQuizzes.includes(1)) {
                    answeredQuizzes.push(1);
                }
                
                // Track jawaban yang benar
                if (this.dataset.answer === 'correct') {
                    if (!correctAnswers.includes(1)) {
                        correctAnswers.push(1);
                    }
                }
                
                // Cek apakah semua quiz sudah terjawab
                checkAllQuizzesAnswered();
            });
        });
    }

    // Event handler quiz slide 3
    function setupQuizSlide3() {
        const slide3 = document.querySelector('.story-slide[data-slide="3"]');
        if (!slide3) return;
        const options = slide3.querySelectorAll('.ig-quiz-option');
        let answered = false;
        options.forEach(option => {
            option.addEventListener('click', function() {
                if (answered) return;
                answered = true;
                options.forEach(opt => {
                    if (opt.dataset.answer === 'correct') {
                        opt.classList.add('correct');
                    } else {
                        opt.classList.add('incorrect');
                    }
                });
                
                // Tambahkan slide 3 ke array answeredQuizzes
                if (!answeredQuizzes.includes(2)) {
                    answeredQuizzes.push(2);
                }
                
                // Track jawaban yang benar
                if (this.dataset.answer === 'correct') {
                    if (!correctAnswers.includes(2)) {
                        correctAnswers.push(2);
                    }
                }
                
                // Cek apakah semua quiz sudah terjawab
                checkAllQuizzesAnswered();
            });
        });
    }

    // Event handler quiz slide 4
    function setupQuizSlide4() {
        const slide4 = document.querySelector('.story-slide[data-slide="4"]');
        if (!slide4) return;
        const options = slide4.querySelectorAll('.ig-quiz-option');
        let answered = false;
        options.forEach(option => {
            option.addEventListener('click', function() {
                if (answered) return;
                answered = true;
                options.forEach(opt => {
                    if (opt.dataset.answer === 'correct') {
                        opt.classList.add('correct');
                    } else {
                        opt.classList.add('incorrect');
                    }
                });
                
                // Tambahkan slide 4 ke array answeredQuizzes
                if (!answeredQuizzes.includes(3)) {
                    answeredQuizzes.push(3);
                }
                
                // Track jawaban yang benar
                if (this.dataset.answer === 'correct') {
                    if (!correctAnswers.includes(3)) {
                        correctAnswers.push(3);
                    }
                }
                
                // Cek apakah semua quiz sudah terjawab
                checkAllQuizzesAnswered();
            });
        });
    }

    // Event handler quiz slide 5
    function setupQuizSlide5() {
        const slide5 = document.querySelector('.story-slide[data-slide="5"]');
        if (!slide5) return;
        const options = slide5.querySelectorAll('.ig-quiz-option');
        let answered = false;
        options.forEach(option => {
            option.addEventListener('click', function() {
                if (answered) return;
                answered = true;
                options.forEach(opt => {
                    if (opt.dataset.answer === 'correct') {
                        opt.classList.add('correct');
                    } else {
                        opt.classList.add('incorrect');
                    }
                });
                
                // Tambahkan slide 5 ke array answeredQuizzes
                if (!answeredQuizzes.includes(4)) {
                    answeredQuizzes.push(4);
                }
                
                // Track jawaban yang benar
                if (this.dataset.answer === 'correct') {
                    if (!correctAnswers.includes(4)) {
                        correctAnswers.push(4);
                    }
                }
                
                // Cek apakah semua quiz sudah terjawab
                checkAllQuizzesAnswered();
            });
        });
    }

    // Panggil setupQuizSlide2, setupQuizSlide3, dan setupQuizSlide4 setelah DOM siap
    setupQuizSlide2();
    setupQuizSlide3();
    setupQuizSlide4();
    setupQuizSlide5();

    // Event listener untuk tombol Continue di tampilan akhir edukasi
    const continueBtn = document.getElementById('edukasi-continue-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            // Ambil skor dari elemen #edukasi-finish-score
            let skor = 0;
            const scoreElement = document.getElementById('edukasi-finish-score');
            if (scoreElement) {
                const match = scoreElement.textContent.match(/(\d+)/);
                if (match) skor = parseInt(match[1]);
            }
            // Kirim pesan ke parent window untuk menutup minigame
            window.parent.postMessage({ type: 'gameCompleted', points: skor }, '*');
        });
    }

    // Event listener untuk icon love
    const loveIcon = document.querySelector('.story-actions .material-icons');
    if (loveIcon) {
        loveIcon.addEventListener('click', function() {
            // Toggle class liked untuk slide saat ini
            this.classList.toggle('liked');
            
            // Simpan status like untuk slide saat ini
            const currentSlideElement = slides[currentSlide];
            if (this.classList.contains('liked')) {
                currentSlideElement.setAttribute('data-liked', 'true');
                this.textContent = 'favorite';
            } else {
                currentSlideElement.removeAttribute('data-liked');
                this.textContent = 'favorite_border';
            }
        });
    }

    // Fungsi untuk update icon love berdasarkan slide aktif
    function updateLoveIcon() {
        const loveIcon = document.querySelector('.story-actions .material-icons');
        if (!loveIcon) return;
        
        const currentSlideElement = slides[currentSlide];
        const isLiked = currentSlideElement.hasAttribute('data-liked');
        
        if (isLiked) {
            loveIcon.classList.add('liked');
            loveIcon.textContent = 'favorite';
        } else {
            loveIcon.classList.remove('liked');
            loveIcon.textContent = 'favorite_border';
        }
    }

    // Fungsi untuk mengecek apakah semua quiz sudah terjawab
    function checkAllQuizzesAnswered() {
        // Quiz ada di slide 2, 3, 4, 5 (index 1, 2, 3, 4)
        const quizSlides = [1, 2, 3, 4];
        const allAnswered = quizSlides.every(slideIndex => answeredQuizzes.includes(slideIndex));
        
        if (allAnswered) {
            // Aktifkan mode result
            isInResultMode = true;
            
            // Hentikan semua progress dan slide
            clearInterval(progressInterval);
            clearInterval(countdownInterval);
            isPaused = true;
            
            // Pause semua video
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                video.pause();
            });
            
            // Update icon play menjadi pause
            updatePlayIcon();
            
            // Hitung skor
            const totalQuestions = 4;
            const correctCount = correctAnswers.length;
            const score = Math.round((correctCount / totalQuestions) * 100);
            
            // Tampilkan edukasi finish setelah delay
            setTimeout(() => {
                var screenContent = document.querySelector('.screen-content');
                var storyActions = document.querySelector('.story-actions');
                var finish = document.getElementById('edukasi-finish');
                var scoreElement = document.getElementById('edukasi-finish-score');
                
                if(screenContent) screenContent.style.display = 'none';
                if(storyActions) storyActions.style.display = 'none';
                if(finish) finish.style.display = 'flex';
                
                // Tampilkan skor
                if(scoreElement) {
                    scoreElement.innerHTML = `<h2>Skor Kamu: ${score}</h2>`;
                }
            }, 2000); // Delay 2 detik untuk memberikan waktu melihat hasil quiz
        }
    }

    // Inisialisasi
    showSlide(0);
    updateLoveIcon();
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