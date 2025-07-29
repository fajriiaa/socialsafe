// Game state
let gameState = {
    currentStep: 0,
    messages: [],
    playerRole: 'police_officer',
    targetAmount: 10000000, // 10 juta rupiah
    currentAmount: 0,
    warningShown: false
};

// Pesan-pesan untuk skenario game
const scenarioMessages = [
    {
        type: 'sent',
        text: 'Assalamu\'alaikum, Pak Ustadz. Saya AKP Budi Santoso dari Polres Karanganyar.',
        time: '08:30'
    },
    {
        type: 'received',
        text: 'Wa\'alaikumsalam. Ada apa ya, Pak?',
        time: '08:31'
    },
    {
        type: 'sent',
        text: 'Kami sedang mengadakan acara sosialisasi keamanan digital. Mohon dukungan dana, Pak.',
        time: '08:32'
    },
    {
        type: 'received',
        text: 'Berapa yang dibutuhkan?',
        time: '08:33'
    },
    {
        type: 'sent',
        text: '10 juta rupiah, Pak. Bisa bantu?',
        time: '08:34'
    },
    {
        type: 'received',
        text: 'Bisa. Transfer ke mana?',
        time: '08:35'
    },
    {
        type: 'sent',
        text: 'BCA: 1234567890 a.n. AKP Budi Santoso.',
        time: '08:36'
    },
    {
        type: 'received',
        text: 'Transfer selesai.',
        time: '08:37'
    },
    {
        type: 'sent',
        text: 'Terima kasih banyak, Pak Ustadz.',
        time: '08:38'
    }
];

// Inisialisasi game
function initGame() {
    displayWarning();
}

// Tampilkan peringatan hukum
function displayWarning() {
    if (!gameState.warningShown) {
        const overlay = document.getElementById('gameOverlay');
        overlay.style.display = 'flex';
        gameState.warningShown = true;
    }
}

// Sembunyikan peringatan dan mulai game
function hideWarning() {
    const overlay = document.getElementById('gameOverlay');
    overlay.style.display = 'none';
    
    // Mulai game setelah overlay hilang
    setTimeout(() => {
        loadInitialMessages();
        setupEventListeners();
    }, 300);
}

// Load pesan awal
function loadInitialMessages() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    scenarioMessages.forEach((message) => {
        addMessage(message);
    });
    // Setelah semua pesan tampil, cek scroll untuk game over
    waitForScrollToBottomAndShowGameOver();
}

function waitForScrollToBottomAndShowGameOver() {
    const chatMessages = document.getElementById('chatMessages');
    // Fungsi cek apakah sudah di bawah
    function isScrolledToBottom() {
        return chatMessages.scrollHeight - chatMessages.scrollTop - chatMessages.clientHeight < 2;
    }
    // Jika sudah di bawah, langsung tampilkan
    if (isScrolledToBottom()) {
        showGameResult();
        return;
    }
    // Jika belum, tunggu scroll
    function onScroll() {
        if (isScrolledToBottom()) {
            chatMessages.removeEventListener('scroll', onScroll);
            showGameResult();
        }
    }
    chatMessages.addEventListener('scroll', onScroll);
}

// Tambah pesan ke chat
function addMessage(messageData) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${messageData.type}`;
    
    messageDiv.innerHTML = `
        <div class="message-text">${messageData.text}</div>
        <div class="message-time">${messageData.time}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    
    // Hapus auto-scroll, biarkan player scroll manual
    // chatMessages.scrollTo({
    //     top: chatMessages.scrollHeight,
    //     behavior: 'smooth'
    // });
    
    // Simpan ke state
    gameState.messages.push(messageData);
}

// Setup event listeners
function setupEventListeners() {
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    
    // Send message on Enter
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Send message on button click
    sendBtn.addEventListener('click', sendMessage);
    
    // Auto-advance scenario setelah semua pesan awal ditampilkan
    setTimeout(() => {
        let messageIndex = scenarioMessages.length;
        const autoAdvance = setInterval(() => {
            if (messageIndex < scenarioMessages.length + 5) { // Tambah 5 pesan tambahan
                const additionalMessages = [
                    {
                        type: 'received',
                        text: 'Pak, kapan acaranya akan diadakan?',
                        time: '08:50'
                    },
                    {
                        type: 'sent',
                        text: 'Insya Allah minggu depan, Pak. Saya akan kirim undangan resminya.',
                        time: '08:51'
                    },
                    {
                        type: 'received',
                        text: 'Baik, saya tunggu undangannya.',
                        time: '08:52'
                    },
                    {
                        type: 'sent',
                        text: 'Terima kasih banyak, Pak Ustadz.',
                        time: '08:53'
                    },
                    {
                        type: 'received',
                        text: 'Sama-sama, Pak.',
                        time: '08:54'
                    }
                ];
                
                addMessage(additionalMessages[messageIndex - scenarioMessages.length]);
                messageIndex++;
            } else {
                clearInterval(autoAdvance);
                setTimeout(() => {
                    showGameResult();
                }, 2000);
            }
        }, 4000);
    }, scenarioMessages.length * 500 + 1000);
}

// Send message function
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const text = messageInput.textContent.trim();
    
    if (text) {
        const currentTime = new Date().toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const messageData = {
            type: 'sent',
            text: text,
            time: currentTime
        };
        
        addMessage(messageData);
        messageInput.textContent = '';
        
        // Simulasi respons dari korban
        setTimeout(() => {
            const responses = [
                'Baik, saya mengerti.',
                'Terima kasih informasinya.',
                'Saya akan pertimbangkan.',
                'Baik, nanti saya konfirmasi lagi.'
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            const responseData = {
                type: 'received',
                text: randomResponse,
                time: new Date().toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };
            
            addMessage(responseData);
        }, 1000);
    }
}

// Tampilkan hasil game
function showGameResult() {
    // Sembunyikan overlay peringatan jika masih ada
    const warningOverlay = document.getElementById('gameOverlay');
    if (warningOverlay) warningOverlay.style.display = 'none';

    // Tampilkan overlay game over
    const gameOverOverlay = document.getElementById('gameOverOverlay');
    if (gameOverOverlay) gameOverOverlay.style.display = 'flex';
}

function closeGameOver() {
    const gameOverOverlay = document.getElementById('gameOverOverlay');
    if (gameOverOverlay) gameOverOverlay.style.display = 'none';
    // Atau bisa juga: location.reload();
}

// Inisialisasi game saat halaman dimuat
document.addEventListener('DOMContentLoaded', initGame);

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

// Tutup minigame dan kirim pesan ke parent (game utama)
document.getElementById('btnSelesai').addEventListener('click', function() {
    window.parent.postMessage({ type: 'gameCompleted', points: 0 }, '*');
}); 