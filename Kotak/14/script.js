document.addEventListener('DOMContentLoaded', () => {
    // Lockscreen logic
    const lockscreen = document.getElementById('lockscreen');
    const deviceFrame = document.getElementById('device-frame');
    const lockTime = document.getElementById('lockscreen-time');
    const lockDate = document.getElementById('lockscreen-date');

    // Jam dan tanggal dinamis
    function updateTime() {
        const now = new Date();
        let h = now.getHours();
        let m = now.getMinutes();
        if (h < 10) h = '0' + h;
        if (m < 10) m = '0' + m;
        if (lockTime) lockTime.textContent = h + ':' + m;
    }
    function updateDate() {
        const hari = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
        const bulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
        const now = new Date();
        if (lockDate) lockDate.textContent = `${hari[now.getDay()]}, ${now.getDate()} ${bulan[now.getMonth()]} ${now.getFullYear()}`;
    }
    updateTime();
    updateDate();
    setInterval(updateTime, 10000);
    setInterval(updateDate, 60000);

    // Klik untuk membuka lockscreen
    if (lockscreen) {
        lockscreen.addEventListener('click', unlockScreen);
    }
    function unlockScreen() {
        lockscreen.classList.add('lockscreen-hide');
        setTimeout(() => {
            lockscreen.style.display = 'none';
            if (deviceFrame) {
                deviceFrame.style.opacity = 1;
                deviceFrame.style.pointerEvents = 'auto';
            }
        }, 700);
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
        eduRows.forEach((row, idx) => {
            if (row) row.style.display = idx === current ? 'flex' : 'none';
        });
        if (btnPrev) btnPrev.disabled = current === 0;
        if (btnNext) btnNext.disabled = current === eduRows.length - 1;
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            if (current > 0) {
                current--;
                updateView();
            }
        });
    }
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            if (current < eduRows.length - 1) {
                current++;
                updateView();
            }
        });
    }

    updateView();

    // Mini Game Script - Very Simple Version
    let guideNextCallback = null;

    function showGuideBubble(text, onNext) {
        const overlay = document.querySelector('.guide-bubble-overlay');
        const row = document.querySelector('.guide-bubble-row');
        const bubble = document.querySelector('.guide-bubble');
        const bubbleText = document.querySelector('.guide-bubble-text');
        const nextBtn = document.querySelector('.guide-next-btn');
        
        if (!overlay || !row || !bubble || !nextBtn || !bubbleText) {
            console.error('Guide bubble elements not found');
            return;
        }
        
        bubbleText.textContent = text;
        overlay.style.display = 'flex';
        nextBtn.style.display = 'block';
        
        setTimeout(() => {
            row.classList.add('show');
        }, 10);
        
        guideNextCallback = () => {
            row.classList.remove('show');
            setTimeout(() => {
                overlay.style.display = 'none';
                nextBtn.style.display = 'none';
                if (onNext) onNext();
            }, 300);
        };
    }

    function updateMiniGameTime() {
        const timeElement = document.querySelector('.time');
        if (timeElement) {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            timeElement.textContent = `${hours}:${minutes}`;
        }
    }

    function scrollToBottom() {
        const chatMessages = document.querySelector('.chat-messages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // Simple message display function
    function showMessages() {
        const messages = document.querySelectorAll('.message, .system-message');
        if (messages.length === 0) return;
        
        // Sembunyikan semua pesan di awal
        messages.forEach(msg => { msg.style.display = 'none'; });
        let currentIndex = 0;
        
        // Daftar checkpoint petunjuk
        const checkpoints = [
            { type: 'intro', text: 'Simulasi ini akan menunjukkan bagaimana penipuan akun palsu terjadi.' },
            { type: 'hadiah', text: 'Penipu sering membuat hadiah palsu agar korban percaya.', messageIndex: 4 },
            { type: 'userpass', text: 'Waspada! Jangan pernah berikan username & password ke siapapun, bahkan yang mengaku admin.', messageIndex: 7 },
            { type: 'akibat', text: 'Inilah akibat jika data diberikan ke penipu. Akun Anda bisa diambil alih!' },
            { type: 'buka_game', text: 'Sekarang, buka kembali game Anda untuk login.' },
            { type: 'coba_login_1', text: 'Coba login ke akun Anda. Apa yang terjadi?' },
        ];
        let checkpointIdx = 0;
        
        function nextCheckpoint(callback) {
            if (checkpointIdx < checkpoints.length) {
                showGuideBubble(checkpoints[checkpointIdx].text, () => {
                    checkpointIdx++;
                    callback();
                });
            } else {
                callback();
            }
        }
        
        function processNextMessage() {
            if (currentIndex >= messages.length) return;
            const message = messages[currentIndex];
            
            // Petunjuk intro sebelum pesan pertama
            if (currentIndex === 0) {
                nextCheckpoint(() => {
                    message.style.display = 'block';
                    scrollToBottom();
                    currentIndex++;
                    processNextMessage();
                });
                return;
            }
            
            // Cek apakah harus pause di checkpoint sebelum pesan ini
            if (checkpointIdx < checkpoints.length && checkpoints[checkpointIdx].messageIndex === currentIndex) {
                nextCheckpoint(() => {
                    message.style.display = 'block';
                    scrollToBottom();
                    if (message.classList.contains('received')) {
                        const status = document.querySelector('.profile-details .status');
                        if (status) status.textContent = 'Online';
                    }
                    currentIndex++;
                    processNextMessage();
                });
                return;
            }
            
            // Petunjuk akibat sebelum blokir
            if (message.classList.contains('system-message') && checkpointIdx < checkpoints.length && checkpoints[checkpointIdx].type === 'akibat') {
                nextCheckpoint(() => {
                    message.style.display = 'block';
                    scrollToBottom();
                    setTimeout(() => {
                        // Petunjuk buka game sebelum splash/login
                        if (checkpointIdx < checkpoints.length && checkpoints[checkpointIdx].type === 'buka_game') {
                            nextCheckpoint(() => {
                                const chatContainer = document.querySelector('.chat-container');
                                const splashScreen = document.querySelector('.splash-screen');
                                if (chatContainer) chatContainer.style.display = 'none';
                                if (splashScreen) splashScreen.style.display = 'flex';
                                setTimeout(() => {
                                    if (splashScreen) splashScreen.style.display = 'none';
                                    // Petunjuk coba login sebelum login page muncul
                                    if (checkpointIdx < checkpoints.length && checkpoints[checkpointIdx].type === 'coba_login_1') {
                                        nextCheckpoint(() => {
                                            const loginSimulation = document.querySelector('.login-simulation');
                                            if (loginSimulation) loginSimulation.style.display = 'flex';
                                        });
                                    } else {
                                        const loginSimulation = document.querySelector('.login-simulation');
                                        if (loginSimulation) loginSimulation.style.display = 'flex';
                                    }
                                }, 1200);
                            });
                        } else {
                            const chatContainer = document.querySelector('.chat-container');
                            const splashScreen = document.querySelector('.splash-screen');
                            if (chatContainer) chatContainer.style.display = 'none';
                            if (splashScreen) splashScreen.style.display = 'flex';
                            setTimeout(() => {
                                if (splashScreen) splashScreen.style.display = 'none';
                                const loginSimulation = document.querySelector('.login-simulation');
                                if (loginSimulation) loginSimulation.style.display = 'flex';
                            }, 1200);
                        }
                    }, 1000);
                });
                return;
            }
            
            // Pesan normal - tampilkan langsung
            message.style.display = 'block';
            scrollToBottom();
            if (message.classList.contains('received')) {
                const status = document.querySelector('.profile-details .status');
                if (status) status.textContent = 'Online';
            }
            currentIndex++;
            
            // Delay sebelum pesan berikutnya
            setTimeout(() => {
                processNextMessage();
            }, 1000);
        }
        
        // Mulai dengan petunjuk intro
        processNextMessage();
    }

    // Update time for status bar
    updateMiniGameTime();
    setInterval(updateMiniGameTime, 60000);
    
    // Start mini game when window loads (like in folder 14)
    window.onload = showMessages;
    
    // Login button event
    const loginBtn = document.getElementById('try-login');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            loginBtn.disabled = true;
            const loginError = document.querySelector('.login-error');
            if (loginError) loginError.style.display = 'block';
            setTimeout(() => {
                const loginSimulation = document.querySelector('.login-simulation');
                const takeoverNotif = document.querySelector('.takeover-notif');
                if (loginSimulation) loginSimulation.style.display = 'none';
                if (takeoverNotif) takeoverNotif.style.display = 'flex';
            }, 1200);
        });
    }
    
    // Guide next button event
    const nextBtn = document.querySelector('.guide-next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (guideNextCallback) guideNextCallback();
        });
    }
    
    

    // Event listener untuk tombol Pelajari Lebih Lanjut
    const btnLearn = document.querySelector('.btn-learn-fake-account');
    if (btnLearn) {
        btnLearn.addEventListener('click', function() {
            window.parent.postMessage({ type: 'gameCompleted', points: 100 }, '*');
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