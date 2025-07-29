document.addEventListener('DOMContentLoaded', () => {
    // Lockscreen logic
    const lockscreen = document.getElementById('lockscreen');
    const deviceFrame = document.getElementById('device-frame');
    const lockTime = document.getElementById('lockscreen-time');
    const lockDate = document.getElementById('lockscreen-date');

    // Jam dan tanggal dinamis
    if (lockTime && lockDate) {
        function updateTime() {
            const now = new Date();
            let h = now.getHours();
            let m = now.getMinutes();
            if (h < 10) h = '0' + h;
            if (m < 10) m = '0' + m;
            lockTime.textContent = h + ':' + m;
        }
        function updateDate() {
            const hari = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
            const bulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
            const now = new Date();
            lockDate.textContent = `${hari[now.getDay()]}, ${now.getDate()} ${bulan[now.getMonth()]} ${now.getFullYear()}`;
        }
        updateTime();
        updateDate();
        setInterval(updateTime, 10000);
        setInterval(updateDate, 60000);
    }

    // Klik untuk membuka lockscreen
    if (lockscreen && deviceFrame) {
        lockscreen.addEventListener('click', unlockScreen);
        function unlockScreen() {
            lockscreen.classList.add('lockscreen-hide');
            setTimeout(() => {
                lockscreen.style.display = 'none';
                deviceFrame.style.opacity = 1;
                deviceFrame.style.pointerEvents = 'auto';
            }, 700);
        }
    }

    // Edu navigation logic
    const eduRows = [
        document.getElementById('edu-case-1'),
        document.getElementById('edu-case-2'),
        document.getElementById('edu-case-3')
    ];
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    let current = 0;

    function updateView() {
        if (eduRows.every(row => row)) {
            eduRows.forEach((row, idx) => {
                row.style.display = idx === current ? 'flex' : 'none';
            });
            if (btnPrev) btnPrev.disabled = current === 0;
            if (btnNext) btnNext.disabled = current === eduRows.length - 1;
        }
    }

    if (btnPrev && btnNext && eduRows.every(row => row)) {
        btnPrev.addEventListener('click', () => {
            if (current > 0) {
                current--;
                updateView();
            }
        });
        btnNext.addEventListener('click', () => {
            if (current < eduRows.length - 1) {
                current++;
                updateView();
            }
        });
        updateView();
    }

    // CHAT LOGIC
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.querySelector('.chat-input input');
    const chatButton = document.querySelector('.chat-input button');

    if (chatMessages && chatInput && chatButton) {
        function addUserMessage(text) {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'message user';
            msgDiv.innerHTML = `<div class="msg-content">${text}</div>`;
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function addBotMessage(text) {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'message bot';
            msgDiv.innerHTML = `<div class="msg-content">${text}</div>`;
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Array soal
        const quizQuestions = [
            {
                question: '[1/5] Manakah contoh password yang aman?',
                options: [
                    { text: 'S4yaSuk4K0t4k!', correct: true },
                    { text: '12345678', correct: false },
                    { text: 'password', correct: false },
                    { text: 'tanggal lahir', correct: false }
                ],
                explanation: 'Password yang aman adalah password yang panjang, unik, dan mengandung kombinasi huruf besar, huruf kecil, angka, dan simbol. Contoh: <b>S4yaSuk4K0t4k!</b>'
            },
            {
                question: '[2/5] Apa yang sebaiknya tidak dilakukan saat membuat password?',
                options: [
                    { text: 'Menggunakan nama sendiri', correct: true },
                    { text: 'Menggunakan kombinasi angka dan huruf', correct: false },
                    { text: 'Menggunakan simbol', correct: false },
                    { text: 'Menggunakan huruf besar dan kecil', correct: false }
                ],
                explanation: 'Jangan gunakan nama sendiri, tanggal lahir, atau informasi pribadi lain sebagai password karena mudah ditebak.'
            },
            {
                question: '[3/5] Apa itu two-factor authentication (2FA)?',
                options: [
                    { text: 'Lapisan keamanan tambahan selain password', correct: true },
                    { text: 'Jenis password baru', correct: false },
                    { text: 'Aplikasi chatting', correct: false },
                    { text: 'Fitur untuk menyimpan password', correct: false }
                ],
                explanation: '2FA adalah lapisan keamanan tambahan yang meminta verifikasi kedua setelah password, misal kode SMS atau aplikasi authenticator.'
            },
            {
                question: '[4/5] Apa yang harus dilakukan jika password diketahui orang lain?',
                options: [
                    { text: 'Segera ganti password', correct: true },
                    { text: 'Abaikan saja', correct: false },
                    { text: 'Bagikan ke teman', correct: false },
                    { text: 'Gunakan password yang sama di semua akun', correct: false }
                ],
                explanation: 'Jika password diketahui orang lain, segera ganti password dan aktifkan 2FA jika tersedia.'
            },
            {
                question: '[5/5] Mengapa penting menggunakan password yang berbeda untuk setiap akun?',
                options: [
                    { text: 'Agar jika satu akun bocor, akun lain tetap aman', correct: true },
                    { text: 'Agar mudah diingat', correct: false },
                    { text: 'Supaya bisa dibagikan', correct: false },
                    { text: 'Agar tidak perlu 2FA', correct: false }
                ],
                explanation: 'Menggunakan password berbeda di setiap akun mencegah semua akun diretas jika satu password bocor.'
            }
        ];

        let currentQuizIdx = 0;
        let quizStarted = false;
        let quizScore = 0;

        function showQuiz(idx) {
            const q = quizQuestions[idx];
            const msgDiv = document.createElement('div');
            msgDiv.className = 'message bot';
            let optionsHtml = '';
            q.options.forEach(opt => {
                optionsHtml += `<div class=\"quiz-option\" data-correct=\"${opt.correct}\"><span class=\"quiz-radio\"></span><span class=\"quiz-text\">${opt.text}</span></div>`;
            });
            msgDiv.innerHTML = `
                <div class=\"quiz-card\">
                    <div class=\"quiz-header\">${q.question}</div>
                    <div class=\"quiz-meta\"><span>Quiz</span><span class=\"quiz-time\" id=\"quiz-timer-${idx}\">00:15</span></div>
                    ${optionsHtml}
                    <div class=\"quiz-footer\">
                        <span class=\"quiz-no-answers\">No answers</span>
                        <span class=\"quiz-time\">15:32</span>
                    </div>
                </div>
            `;
            const chatMessages = document.querySelector('.chat-messages');
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Timer mundur 15 detik (format mm:ss)
            let timeLeft = 15;
            const timerEl = msgDiv.querySelector(`#quiz-timer-${idx}`);
            function formatTime(sec) {
                const m = Math.floor(sec / 60).toString().padStart(2, '0');
                const s = (sec % 60).toString().padStart(2, '0');
                return `${m}:${s}`;
            }
            if (timerEl) timerEl.textContent = formatTime(timeLeft);
            let timerInterval = setInterval(() => {
                timeLeft--;
                if (timerEl) timerEl.textContent = formatTime(timeLeft);
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    if (!answered) autoAnswer();
                }
            }, 1000);

            // Interaktivitas memilih jawaban
            const quizCard = msgDiv.querySelector('.quiz-card');
            const options = quizCard.querySelectorAll('.quiz-option');
            let answered = false;
            options.forEach((opt, idxOpt) => {
                opt.addEventListener('click', function() {
                    if (answered) return;
                    answered = true;
                    clearInterval(timerInterval);
                    options.forEach((o, i) => {
                        o.classList.remove('selected', 'correct', 'wrong');
                        o.querySelector('.quiz-radio').style.borderColor = '#bdbdbd';
                        o.querySelector('.quiz-radio').style.background = 'transparent';
                    });
                    // Tandai jawaban yang dipilih
                    this.classList.add('selected');
                    this.querySelector('.quiz-radio').style.borderColor = '#eebf63';
                    this.querySelector('.quiz-radio').style.background = '#eebf63';
                    // Tampilkan hasil benar/salah
                    let benar = false;
                    options.forEach((o) => {
                        if (o.dataset.correct === 'true') {
                            o.classList.add('correct');
                            o.querySelector('.quiz-radio').style.borderColor = '#4caf50';
                            o.querySelector('.quiz-radio').style.background = '#4caf50';
                            o.querySelector('.quiz-text').innerHTML += ' <span style=\"color:#4caf50;font-weight:bold;\">(Benar)</span>';
                            if (o === this) benar = true;
                        } else if (o.classList.contains('selected')) {
                            o.classList.add('wrong');
                            o.querySelector('.quiz-radio').style.borderColor = '#f44336';
                            o.querySelector('.quiz-radio').style.background = '#f44336';
                            o.querySelector('.quiz-text').innerHTML += ' <span style=\"color:#f44336;font-weight:bold;\">(Salah)</span>';
                        }
                    });
                    // Update skor
                    if (benar) quizScore += 20;
                    // Update footer
                    quizCard.querySelector('.quiz-no-answers').innerHTML = '<button class=\"quiz-view-results\">View Result</button>';
                    // Event untuk View Result
                    quizCard.querySelector('.quiz-view-results').addEventListener('click', function() {
                        showQuizExplanation(quizCard, q.explanation);
                    });
                    // Tampilkan soal berikutnya jika masih ada
                    if (currentQuizIdx < quizQuestions.length - 1) {
                        currentQuizIdx++;
                        setTimeout(() => showQuiz(currentQuizIdx), 900);
                    } else {
                        setTimeout(() => showQuizEnd(), 900);
                    }
                });
            });

            // Auto-answer jika waktu habis
            function autoAnswer() {
                answered = true;
                options.forEach((o, i) => {
                    o.classList.remove('selected', 'correct', 'wrong');
                    o.querySelector('.quiz-radio').style.borderColor = '#bdbdbd';
                    o.querySelector('.quiz-radio').style.background = 'transparent';
                });
                // Tandai jawaban benar
                options.forEach((o) => {
                    if (o.dataset.correct === 'true') {
                        o.classList.add('correct');
                        o.querySelector('.quiz-radio').style.borderColor = '#4caf50';
                        o.querySelector('.quiz-radio').style.background = '#4caf50';
                        o.querySelector('.quiz-text').innerHTML += ' <span style=\"color:#4caf50;font-weight:bold;\">(Benar)</span>';
                    }
                });
                // Tidak menambah skor jika auto
                // Update footer
                quizCard.querySelector('.quiz-no-answers').innerHTML = '<button class=\"quiz-view-results\">View Result</button>';
                quizCard.querySelector('.quiz-view-results').addEventListener('click', function() {
                    showQuizExplanation(quizCard, q.explanation);
                });
                // Tampilkan soal berikutnya jika masih ada
                if (currentQuizIdx < quizQuestions.length - 1) {
                    currentQuizIdx++;
                    setTimeout(() => showQuiz(currentQuizIdx), 900);
                } else {
                    setTimeout(() => showQuizEnd(), 900);
                }
            }
        }

        function showQuizEnd() {
            const chatMessages = document.querySelector('.chat-messages');
            const msgDiv = document.createElement('div');
            msgDiv.className = 'message bot';
            msgDiv.innerHTML = `<div class=\"quiz-finish-msg\"><div class=\"quiz-finish-title\"><b>Quiz Selesai 🎉</b></div><div class=\"quiz-finish-score\"><b>Skor kamu: ${quizScore}</b> dari 100</div><div class=\"quiz-finish-desc\">Terima kasih sudah bermain dan belajar tentang keamanan password.<br>Jaga selalu keamanan akunmu agar terhindar dari ancaman siber!</div><button class=\"quiz-finish-done\">Selesai</button></div>`;
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            // Event tombol Done - tidak melakukan apa-apa
            msgDiv.querySelector('.quiz-finish-done').addEventListener('click', function() {
                // Kirim pesan ke parent window untuk menutup minigame
                if (window.parent) {
                    window.parent.postMessage({ type: 'gameCompleted', points: quizScore }, '*');
                }
                // window.close(); // Jika diizinkan browser
            });
        }

        // Ubah event siap
        chatButton.addEventListener('click', function() {
            const userText = chatInput.value.trim();
            if (!userText) return;
            addUserMessage(userText);
            chatInput.value = '';
            if (userText.toLowerCase() === 'siap' && !quizStarted) {
                quizStarted = true;
                // Hapus quiz-card sebelumnya jika ada
                const chatMessages = document.querySelector('.chat-messages');
                chatMessages.querySelectorAll('.message.bot .quiz-card').forEach(e => e.parentElement.remove());
                currentQuizIdx = 0;
                quizScore = 0; // Reset skor saat quiz baru dimulai
                setTimeout(() => showQuiz(currentQuizIdx), 600);
            }
        });

        function showQuizExplanation(parent, explanationText) {
            const deviceScreen = document.querySelector('.device-screen');
            if (deviceScreen.querySelector('.quiz-explanation-modal')) return;
            const modal = document.createElement('div');
            modal.className = 'quiz-explanation-modal';
            modal.innerHTML = `
                <div class=\"quiz-explanation-content\">
                    <button class=\"quiz-explanation-close\">&times;</button>
                    <div class=\"quiz-explanation-title\"><b>Penjelasan Jawaban:</b></div>
                    <div class=\"quiz-explanation-text\">${explanationText}</div>
                </div>
            `;
            deviceScreen.appendChild(modal);
            modal.querySelector('.quiz-explanation-close').addEventListener('click', function() {
                modal.remove();
            });
        }

        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                chatButton.click();
            }
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