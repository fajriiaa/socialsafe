document.addEventListener('DOMContentLoaded', function() {
    var btnMulai = document.getElementById('btnMulai');
    var popup = document.getElementById('popupPetunjuk');
    var tutorialOverlay = document.getElementById('tutorialOverlay');
    var currentStep = 1;
    var totalSteps = 4;
    
    if(btnMulai && popup) {
        btnMulai.addEventListener('click', function() {
            popup.style.display = 'none';
            // Tampilkan tutorial
            if(tutorialOverlay) {
                tutorialOverlay.style.display = 'flex';
                showTutorialStep(1);
            }
        });
    }
    
    // Tutorial navigation
    var btnTutorialNext = document.getElementById('btnTutorialNext');
    var btnTutorialPrev = document.getElementById('btnTutorialPrev');
    var btnTutorialStart = document.getElementById('btnTutorialStart');
    
    if(btnTutorialNext) {
        btnTutorialNext.addEventListener('click', function() {
            if(currentStep < totalSteps) {
                currentStep++;
                showTutorialStep(currentStep);
            }
        });
    }
    
    if(btnTutorialPrev) {
        btnTutorialPrev.addEventListener('click', function() {
            if(currentStep > 1) {
                currentStep--;
                showTutorialStep(currentStep);
            }
        });
    }
    
            if(btnTutorialStart) {
            btnTutorialStart.addEventListener('click', function() {
                tutorialOverlay.style.display = 'none';
                // Hapus highlight jika ada
                var highlights = document.querySelectorAll('.tutorial-highlight');
                highlights.forEach(function(highlight) {
                    highlight.remove();
                });
            });
        }
    
    function showTutorialStep(step) {
        // Sembunyikan semua step
        for(var i = 1; i <= totalSteps; i++) {
            var stepElement = document.getElementById('step' + i);
            if(stepElement) {
                stepElement.style.display = 'none';
            }
        }
        
        // Tampilkan step yang aktif
        var activeStep = document.getElementById('step' + step);
        if(activeStep) {
            activeStep.style.display = 'block';
        }
        
        // Update tombol navigasi
        var btnPrev = document.getElementById('btnTutorialPrev');
        var btnNext = document.getElementById('btnTutorialNext');
        var btnStart = document.getElementById('btnTutorialStart');
        
        if(btnPrev) btnPrev.style.display = step > 1 ? 'block' : 'none';
        if(btnNext) btnNext.style.display = step < totalSteps ? 'block' : 'none';
        if(btnStart) btnStart.style.display = step === totalSteps ? 'block' : 'none';
        
        // Hapus highlight sebelumnya
        var highlights = document.querySelectorAll('.tutorial-highlight');
        highlights.forEach(function(highlight) {
            highlight.remove();
        });
        
        // Tambahkan highlight sesuai step
        if(step === 4) {
            highlightProgressBar();
        }
        
    }
    
    function highlightProgressBar() {
        var progressBar = document.querySelector('.edukasi-progress-container');
        if(progressBar) {
            var rect = progressBar.getBoundingClientRect();
            var deviceScreen = document.querySelector('.device-screen');
            var screenRect = deviceScreen.getBoundingClientRect();
            
            var highlight = document.createElement('div');
            highlight.className = 'tutorial-highlight';
            highlight.style.cssText = `
                position: absolute;
                left: ${rect.left - screenRect.left + 5}px;
                top: ${rect.top - screenRect.top + 5}px;
                width: ${rect.width - 10}px;
                height: ${rect.height - 10}px;
            `;
            deviceScreen.appendChild(highlight);
        }
    }
    


    // Progress bar logic
    var posts = document.querySelectorAll('.post-card');
    var progressFill = document.querySelector('.progress-fill');
    var total = posts.length;
    var progress = 0;
    var answered = Array(total).fill(null);
    var score = 0;
    var maxScore = 0;

    // Hitung maksimal skor yang bisa didapat
    posts.forEach(function(post) {
        var type = post.getAttribute('data-type');
        if (type === 'edukasi') {
            maxScore++;
        }
    });

    // --- RESET LOGIKA BAR EDUKASI ---
    // Ambil semua postingan edukasi & bahaya
    var soalIndexes = [];
    posts.forEach(function(post, idx) {
        var type = post.getAttribute('data-type');
        if (type === 'edukasi' || type === 'bahaya') {
            soalIndexes.push(idx);
        }
    });
    var soalTotal = soalIndexes.length;
    var jawaban = Array(posts.length).fill(null); // 'like', 'dislike', null
    var edukasiFill = document.querySelector('.edukasi-progress-fill');

    let resultShown = false;
    function isJawabanBenar(type, ans) {
        return (type === 'edukasi' && ans === 'like') || (type === 'bahaya' && ans === 'dislike');
    }

    function updateEdukasiProgressBar() {
        var benar = soalIndexes.filter(idx => isJawabanBenar(posts[idx].getAttribute('data-type'), jawaban[idx])).length;
        var percent = soalTotal === 0 ? 0 : Math.round((benar / soalTotal) * 100);
        if (edukasiFill) edukasiFill.style.width = percent + '%';
        // Jika semua jawaban benar, tampilkan result (hanya sekali)
        if (benar === soalTotal && soalTotal > 0 && !resultShown) {
            resultShown = true;
            showGameComplete();
        }
    }

    // --- RANDOM LIKE/DISLIKE ---
    posts.forEach(function(post) {
        var likeLabel = post.querySelector('.action-btn .action-label');
        var dislikeBtn = post.querySelectorAll('.action-btn')[1];
        if (likeLabel) {
            var randLike = Math.floor(Math.random() * 5000) + 10;
            likeLabel.textContent = randLike.toLocaleString('id-ID');
            post.dataset.randLike = randLike;
        }
        if (dislikeBtn) {
            var dislikeLabel = dislikeBtn.querySelector('.action-label');
            if (dislikeLabel) {
                var randDislike = Math.floor(Math.random() * 5000);
                dislikeLabel.textContent = randDislike.toLocaleString('id-ID');
                post.dataset.randDislike = randDislike;
            }
        }
    });

    // --- END RANDOM LIKE/DISLIKE ---

    posts.forEach(function(post, idx) {
        var type = post.getAttribute('data-type');
        var btns = post.querySelectorAll('.action-btn');
        var likeBtn = btns[0];
        var dislikeBtn = btns[1];

        function resetBtnStyle() {
            likeBtn.style.background = '';
            likeBtn.style.color = '';
            dislikeBtn.style.background = '';
            dislikeBtn.style.color = '';
        }

        if(likeBtn) {
            likeBtn.addEventListener('click', function() {
                if(jawaban[idx] === 'like') {
                    jawaban[idx] = null;
                    resetBtnStyle();
                    // Kurangi angka like jika batal
                    var likeLabel = likeBtn.querySelector('.action-label');
                    if (likeLabel) {
                        var val = parseInt(post.dataset.randLike || likeLabel.textContent.replace(/\D/g, ''));
                        if (val > 0) val--;
                        likeLabel.textContent = val.toLocaleString('id-ID');
                        post.dataset.randLike = val;
                    }
                } else {
                    jawaban[idx] = 'like';
                    resetBtnStyle();
                    likeBtn.style.background = '#4CAF50';
                    likeBtn.style.color = '#fff';
                    // Tambah angka like
                    var likeLabel = likeBtn.querySelector('.action-label');
                    if (likeLabel) {
                        var val = parseInt(post.dataset.randLike || likeLabel.textContent.replace(/\D/g, ''));
                        val++;
                        likeLabel.textContent = val.toLocaleString('id-ID');
                        post.dataset.randLike = val;
                    }
                    if(type === 'edukasi') {
                        showFeedback(post, true, 'Bagus! Kamu mendukung edukasi privasi data.');
                    } else if(type === 'bahaya') {
                        showFeedback(post, false, 'Jangan like postingan yang membocorkan data pribadi!');
                    }
                }
                updateEdukasiProgressBar();
            });
        }
        if(dislikeBtn) {
            dislikeBtn.addEventListener('click', function() {
                if(jawaban[idx] === 'dislike') {
                    jawaban[idx] = null;
                    resetBtnStyle();
                    // Kurangi angka dislike jika batal
                    var dislikeLabel = dislikeBtn.querySelector('.action-label');
                    if (dislikeLabel) {
                        var val = parseInt(post.dataset.randDislike || dislikeLabel.textContent.replace(/\D/g, ''));
                        if (val > 0) val--;
                        dislikeLabel.textContent = val.toLocaleString('id-ID');
                        post.dataset.randDislike = val;
                    }
                } else {
                    jawaban[idx] = 'dislike';
                    resetBtnStyle();
                    dislikeBtn.style.background = '#f44336';
                    dislikeBtn.style.color = '#fff';
                    // Tambah angka dislike
                    var dislikeLabel = dislikeBtn.querySelector('.action-label');
                    if (dislikeLabel) {
                        var val = parseInt(post.dataset.randDislike || dislikeLabel.textContent.replace(/\D/g, ''));
                        val++;
                        dislikeLabel.textContent = val.toLocaleString('id-ID');
                        post.dataset.randDislike = val;
                    }
                    if(type === 'bahaya') {
                        showFeedback(post, true, 'Tepat! Jangan dukung postingan yang membahayakan data pribadi.');
                    } else if(type === 'edukasi') {
                        showFeedback(post, false, 'Edukasi itu penting, sebaiknya jangan dislike info bermanfaat.');
                    }
                }
                updateEdukasiProgressBar();
            });
        }
    });
    // --- END RESET LOGIKA BAR EDUKASI ---

    function updateProgress() {
        var percent = Math.round((progress / total) * 100);
        if(progressFill) {
            progressFill.style.width = percent + '%';
            
            // Tambahkan efek visual saat progress bertambah
            progressFill.style.animation = 'none';
            setTimeout(() => {
                progressFill.style.animation = 'progressPulse 0.5s ease-in-out';
            }, 10);
        }
    }

    function showFeedback(post, isCorrect, message) {
        // Hapus feedback sebelumnya jika ada
        var deviceScreen = document.querySelector('.device-screen');
        var existingFeedback = deviceScreen.querySelector('.feedback-message-global');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        // Buat elemen feedback
        var feedback = document.createElement('div');
        feedback.className = 'feedback-message-global';
        feedback.textContent = message;
        feedback.style.cssText = `
            position: absolute;
            left: 50%;
            top: 28px;
            transform: translateX(-50%);
            background: ${isCorrect ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 10px 22px;
            border-radius: 10px;
            font-size: 1em;
            font-weight: 500;
            z-index: 2000;
            animation: feedbackSlideIn 0.3s ease-out;
            box-shadow: 0 2px 12px rgba(0,0,0,0.18);
            white-space: pre-line;
            max-width: 90%;
            text-align: center;
        `;

        deviceScreen.appendChild(feedback);

        // Hapus feedback setelah 2.5 detik
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.style.animation = 'feedbackSlideOut 0.3s ease-in';
                setTimeout(() => {
                    if (feedback.parentNode) {
                        feedback.remove();
                    }
                }, 300);
            }
        }, 2500);
    }

    function checkGameComplete() {
        if (progress === total) {
            setTimeout(() => {
                showGameComplete();
            }, 1000);
        }
    }

    function showGameComplete() {
        var deviceScreen = document.querySelector('.device-screen');
        // Hapus feedback jika ada
        var oldFeedback = deviceScreen.querySelector('.feedback-message-global');
        if (oldFeedback) oldFeedback.remove();
        // Hapus overlay sebelumnya jika ada
        var oldOverlay = deviceScreen.querySelector('.result-overlay');
        if (oldOverlay) oldOverlay.remove();

        var overlay = document.createElement('div');
        overlay.className = 'result-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease-out;
        `;

        var modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 16px;
            padding: 18px 16px 16px 16px;
            text-align: center;
            max-width: 240px;
            width: 90%;
            margin: 10px;
            animation: modalSlideIn 0.3s ease-out;
            box-shadow: 0 2px 16px rgba(0,0,0,0.13);
            z-index: 10000;
        `;

        // Skor: total soal adalah jumlah postingan edukasi + bahaya
        var soalTotal = soalIndexes.length;
        var benar = soalIndexes.filter(idx => isJawabanBenar(posts[idx].getAttribute('data-type'), jawaban[idx])).length;
        var percentage = soalTotal === 0 ? 0 : Math.round((benar / soalTotal) * 100);
        
        modal.innerHTML = `
            <p style=\"color: #333; margin-bottom: 16px; font-family: 'Poppins', sans-serif; font-size: 0.9em;\">
                Excellent! Anda sangat memahami privasi data pribadi!
            </p>
            <button id=\"btnSelesai\" style=\"\n                background: linear-gradient(90deg, #1da1f2 0%, #0d8ddb 100%);\n                color: white;\n                border: none;\n                border-radius: 8px;\n                padding: 5px 12px;\n                font-size: 0.92em;\n                font-family: 'Poppins', sans-serif;\n                font-weight: 600;\n                cursor: pointer;\n                transition: transform 0.2s;\n            \" onmouseover=\"this.style.transform='scale(1.05)'\" onmouseout=\"this.style.transform='scale(1)'\">
                Selesai
            </button>
        `;

        overlay.appendChild(modal);
        deviceScreen.appendChild(overlay);

        // Tambahkan event listener untuk tombol Selesai
        var btnSelesai = modal.querySelector('#btnSelesai');
        if (btnSelesai) {
            btnSelesai.addEventListener('click', function() {
                // Kirim pesan ke parent window bahwa game selesai
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({
                        type: 'gameCompleted',
                        points: 100
                    }, '*');
                }
            });
        }

        // Tambahkan event listener untuk menutup modal jika klik overlay
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    // Tambahkan CSS animations
    var style = document.createElement('style');
    style.textContent = `
        @keyframes progressPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
        
        @keyframes feedbackSlideIn {
            from { 
                opacity: 0; 
                transform: translateX(-50%) translateY(-10px); 
            }
            to { 
                opacity: 1; 
                transform: translateX(-50%) translateY(0); 
            }
        }
        
        @keyframes feedbackSlideOut {
            from { 
                opacity: 1; 
                transform: translateX(-50%) translateY(0); 
            }
            to { 
                opacity: 0; 
                transform: translateX(-50%) translateY(-10px); 
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes modalSlideIn {
            from { 
                opacity: 0; 
                transform: scale(0.8) translateY(-20px); 
            }
            to { 
                opacity: 1; 
                transform: scale(1) translateY(0); 
            }
        }
    `;
    document.head.appendChild(style);
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