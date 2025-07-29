// Data email untuk game
const emailData = [
    // PAYPAL PHISHING
    {
        sender: "security@paypal-secure.com",
        senderName: "PayPal Security",
        logo: "img/paypal.png",
        subject: "Akun Anda Diblokir!",
        content: `<div style='font-family:sans-serif;'>
            <img src='img/paypal.png' alt='PayPal' style='height:32px;margin-bottom:12px;'><br>
            <b>PayPal Security &lt;security@paypal-secure.com&gt;</b><br><br>
            <span style='font-size:1.1em;'>Kami mendeteksi aktivitas mencurigakan pada akun PayPal Anda.</span><br><br>
            Untuk melindungi akun Anda, silakan <a href='http://paypal-verify.com' style='color:#0070ba;text-decoration:underline;' onmouseover="this.title='http://paypal-verify.com'">verifikasi akun Anda di sini</a>.<br><br>
            <span style='color:#888;font-size:0.95em;'>Jika Anda tidak melakukan permintaan ini, abaikan email ini.</span>
            <div style='margin-top:18px;font-size:0.95em;color:#888;'>Terima kasih,<br>Tim Keamanan PayPal</div>
        </div>`,
        isPhishing: true,
        explanation: "Email ini phishing karena menggunakan domain yang menyerupai PayPal dan meminta informasi pribadi. Link mengarah ke situs palsu."
    },
    // BANK PHISHING
    {
        sender: "update@secure-bank-login.com",
        senderName: "Customer Service BCA",
        logo: "img/bca.png",
        subject: "Perbarui Info Akun Anda",
        content: `<div style='font-family:sans-serif;'>
            <img src='img/bca.png' alt='BCA' style='height:28px;margin-bottom:10px;'><br>
            <b>Customer Service BCA &lt;update@secure-bank-login.com&gt;</b><br><br>
            <span style='font-size:1.08em;'>Demi keamanan, kami perlu Anda memperbarui data rekening Anda.</span><br><br>
            Silakan <a href='http://bank-update.com' style='color:#0055a4;text-decoration:underline;' onmouseover="this.title='http://bank-update.com'">klik di sini untuk memperbarui data</a>.<br><br>
            <span style='color:#888;font-size:0.95em;'>Abaikan email ini jika Anda merasa tidak pernah melakukan permintaan ini.</span>
            <div style='margin-top:18px;font-size:0.95em;color:#888;'>Salam,<br>Customer Service BCA</div>
        </div>`,
        isPhishing: true,
        explanation: "Email ini phishing karena menggunakan domain yang menyerupai bank dan meminta informasi sensitif melalui link tidak resmi."
    },
    // HRD PHISHING
    {
        sender: "hr@company-careers.com",
        senderName: "HRD PT. Sukses Bersama",
        logo: "img/company.png",
        subject: "Lowongan Pekerjaan Menarik",
        content: `<div style='font-family:sans-serif;'>
            <img src='img/company.png' alt='HRD' style='height:28px;margin-bottom:10px;'><br>
            <b>HRD PT. Sukses Bersama &lt;hr@company-careers.com&gt;</b><br><br>
            Kami tertarik dengan profil Anda. Silakan kirimkan <b>CV dan data pribadi</b> Anda ke email ini untuk proses rekrutmen lebih lanjut.<br><br>
            <span style='color:#888;font-size:0.95em;'>Mohon jangan membalas email ini jika Anda tidak berminat.</span>
            <div style='margin-top:18px;font-size:0.95em;color:#888;'>Hormat kami,<br>HRD PT. Sukses Bersama</div>
        </div>`,
        isPhishing: true,
        explanation: "Email ini phishing karena meminta data pribadi tanpa proses wawancara yang proper dan menggunakan domain yang mencurigakan."
    },
    // PHISHING TOKOPEDIA
    {
        sender: "security@tokopedia-support.com",
        senderName: "Tokopedia Security",
        logo: "img/tokopedia.png",
        subject: "Akun Anda Perlu Diverifikasi",
        content: `<div style='font-family:sans-serif;'>
            <img src='img/tokopedia.png' alt='Tokopedia' style='height:28px;margin-bottom:10px;'><br>
            <b>Tokopedia Security &lt;security@tokopedia-support.com&gt;</b><br><br>
            Kami mendeteksi aktivitas tidak biasa pada akun Anda. Silakan <a href='http://tokopedia-verify.com' style='color:#03ac0e;text-decoration:underline;' onmouseover="this.title='http://tokopedia-verify.com'">verifikasi akun Anda di sini</a> untuk menghindari pemblokiran.<br><br>
            <span style='color:#888;font-size:0.95em;'>Abaikan email ini jika Anda merasa tidak melakukan aktivitas mencurigakan.</span>
            <div style='margin-top:18px;font-size:0.95em;color:#888;'>Terima kasih,<br>Tim Keamanan Tokopedia</div>
        </div>`,
        isPhishing: true,
        explanation: "Email ini phishing karena menggunakan domain mirip Tokopedia dan meminta verifikasi melalui link palsu."
    },
    // PHISHING PLN
    {
        sender: "admin@pln-billing.com",
        senderName: "PLN Billing",
        logo: "img/pln.png",
        subject: "Tagihan Listrik Anda Bermasalah",
        content: `<div style='font-family:sans-serif;'>
            <img src='img/pln.png' alt='PLN' style='height:28px;margin-bottom:10px;'><br>
            <b>PLN Billing &lt;admin@pln-billing.com&gt;</b><br><br>
            Tagihan listrik Anda tidak dapat diproses. Silakan <a href='http://pln-fake-billing.com' style='color:#f9b233;text-decoration:underline;' onmouseover="this.title='http://pln-fake-billing.com'">klik di sini untuk memperbaiki</a> agar listrik tidak diputus.<br><br>
            <span style='color:#888;font-size:0.95em;'>Abaikan email ini jika Anda sudah membayar tagihan.</span>
            <div style='margin-top:18px;font-size:0.95em;color:#888;'>Salam,<br>PLN Billing</div>
        </div>`,
        isPhishing: true,
        explanation: "Email ini phishing karena menggunakan domain palsu PLN dan meminta tindakan melalui link tidak resmi."
    },
    // EMAIL ASLI PLN
    {
        sender: "noreply@pln.co.id",
        senderName: "PLN Indonesia",
        logo: "img/pln.png",
        subject: "Tagihan Bulanan Telah Terbit",
        content: `<div style='font-family:sans-serif;'>
            <img src='img/pln.png' alt='PLN' style='height:28px;margin-bottom:10px;'><br>
            <b>PLN Indonesia &lt;noreply@pln.co.id&gt;</b><br><br>
            Tagihan listrik bulanan Anda telah terbit.<br>
            Silakan cek di aplikasi <b>PLN Mobile</b> atau <a href='https://www.pln.co.id' style='color:#0055a4;text-decoration:underline;' target='_blank'>website resmi PLN</a>.<br><br>
            <span style='color:#888;font-size:0.95em;'>Email ini dikirim otomatis, mohon tidak membalas.</span>
            <div style='margin-top:18px;font-size:0.95em;color:#888;'>Terima kasih,<br>PLN Indonesia</div>
        </div>`,
        isPhishing: false,
        explanation: "Email ini asli, berasal dari domain resmi PLN dan tidak meminta data pribadi."
    },
    // EMAIL ASLI TOKOPEDIA
    {
        sender: "support@tokopedia.com",
        senderName: "Tokopedia Care",
        logo: "img/tokopedia.png",
        subject: "Reset Password Diminta",
        content: `<div style='font-family:sans-serif;'>
            <img src='img/tokopedia.png' alt='Tokopedia' style='height:28px;margin-bottom:10px;'><br>
            <b>Tokopedia Care &lt;support@tokopedia.com&gt;</b><br><br>
            Kami menerima permintaan reset password untuk akun Tokopedia Anda.<br>
            Jika Anda tidak merasa melakukan permintaan ini, abaikan email ini.<br><br>
            <span style='color:#888;font-size:0.95em;'>Email ini dikirim otomatis, mohon tidak membalas.</span>
            <div style='margin-top:18px;font-size:0.95em;color:#888;'>Salam,<br>Tokopedia Care</div>
        </div>`,
        isPhishing: false,
        explanation: "Email ini asli karena berasal dari domain resmi Tokopedia dan memberikan opsi untuk mengabaikan jika tidak merasa melakukan permintaan."
    },
    // EMAIL ASLI LINKEDIN
    {
        sender: "notifications@linkedin.com",
        senderName: "LinkedIn Notifications",
        logo: "img/linkedin.png",
        subject: "Pesan Baru di LinkedIn",
        content: `<div style='font-family:sans-serif;'>
            <img src='img/linkedin.png' alt='LinkedIn' style='height:28px;margin-bottom:10px;'><br>
            <b>LinkedIn Notifications &lt;notifications@linkedin.com&gt;</b><br><br>
            Anda memiliki pesan baru di LinkedIn.<br>
            <a href='https://www.linkedin.com' style='color:#0077b5;text-decoration:underline;' target='_blank'>Login untuk melihat pesan tersebut</a>.<br><br>
            <span style='color:#888;font-size:0.95em;'>Email ini dikirim otomatis, mohon tidak membalas.</span>
            <div style='margin-top:18px;font-size:0.95em;color:#888;'>Terima kasih,<br>LinkedIn Team</div>
        </div>`,
        isPhishing: false,
        explanation: "Email ini asli karena berasal dari domain resmi LinkedIn dan tidak meminta informasi sensitif."
    }
];

// State game
let score = 0;
let timeLeft = 60;
let timer;
let currentEmails = [];
let correctCount = 0;
let wrongCount = 0;

// State tambahan
let selectedEmailIndex = null;

// Array petunjuk alur game
const introSteps = [
    "Selamat datang di Detektif Phishing! Disini, kamu akan mendeteksi email phishing. Klik Continue untuk melihat petunjuk berikutnya.",
    "Kamu akan melihat beberapa email di inbox. Klik pada email untuk melihat detailnya.",
    "Tugasmu adalah menentukan apakah email tersebut asli atau phishing dengan menekan tombol yang sesuai.",
    "Setiap jawaban benar akan menambah skor, jawaban salah akan mengurangi skor. Baca penjelasan edukasi di setiap feedback!",
    "Siap? Klik Continue untuk mulai bermain!"
];
let introIndex = 0;

// DOM Elements
const gamePage = document.getElementById('game-page');
const resultPage = document.getElementById('result-page');
const inboxContainer = document.getElementById('inbox-container');
const currentScoreElement = document.getElementById('current-score');
const timeLeftElement = document.getElementById('time-left');
const finalScoreElement = document.getElementById('final-score');
const correctCountElement = document.getElementById('correct-count');
const wrongCountElement = document.getElementById('wrong-count');
const finalCorrectElement = document.getElementById('final-correct');
const finalWrongElement = document.getElementById('final-wrong');

// DOM Elements untuk intro
const introPage = document.getElementById('intro-page');
const introText = document.getElementById('intro-text');
const introContinue = document.getElementById('intro-continue');

// Sound Effects
const sounds = {
    click: new Audio('sounds/click.wav'),
    correct: new Audio('sounds/correct.wav'),
    wrong: new Audio('sounds/wrong.wav'),
    gameOver: new Audio('sounds/gameover.wav')
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Event listener untuk tombol #back-to-home
    const backToHomeBtn = document.getElementById('back-to-home');
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', () => {
            sounds.click.play();
            // Kirim pesan ke parent window dengan skor
            window.parent.postMessage({
                type: 'gameCompleted',
                points: score
            }, '*');
        });
    }
    
    introContinue.addEventListener('click', () => {
        sounds.click.play();
        introIndex++;
        if (introIndex < introSteps.length) {
            introText.textContent = introSteps[introIndex];
        } else {
            // Selesai intro, langsung mulai game
            introPage.classList.remove('active');
            startGame();
            introIndex = 0;
            introText.textContent = introSteps[0];
        }
    });
});

function startGame() {
    gamePage.classList.add('active');
    resetGame();
    getRandomEmails();
    displayInbox(currentEmails);
    startTimer();
}

function resetGame() {
    score = 0;
    timeLeft = 60;
    correctCount = 0;
    wrongCount = 0;
    currentEmails = [];
    updateScore();
    updateStats();
}

function getRandomEmails() {
    const shuffled = [...emailData].sort(() => 0.5 - Math.random());
    currentEmails = shuffled.slice(0, 5);
}

function displayInbox(emails) {
    inboxContainer.innerHTML = '';
    emails.forEach((email, index) => {
        const inboxItem = document.createElement('div');
        inboxItem.className = 'inbox-item';
        inboxItem.innerHTML = `
            <div class="inbox-logo"><img src="${email.logo}" alt="logo" /></div>
            <div class="inbox-info">
                <div class="inbox-sender">${email.senderName}</div>
                <div class="inbox-email">${email.sender}</div>
            </div>
            <div class="inbox-subject">${email.subject}</div>
        `;
        inboxItem.onclick = () => showEmailDetail(index);
        inboxContainer.appendChild(inboxItem);
    });
}

function showEmailDetail(index) {
    selectedEmailIndex = index;
    const email = currentEmails[index];
    inboxContainer.innerHTML = '';
    const detailDiv = document.createElement('div');
    detailDiv.className = 'email-detail';
    detailDiv.innerHTML = `
        <div class="email-header-full">
            <div class="email-logo"><img src="${email.logo}" alt="logo" /></div>
            <div class="email-from">
                <span class="email-sender-name">${email.senderName}</span>
                <span class="email-sender-email">${email.sender}</span>
            </div>
            <div class="email-subject">${email.subject}</div>
        </div>
        <div class="email-body">${email.content}</div>
        <div class="email-actions">
            <button class="legitimate-btn" onclick="checkAnswer(${index}, false)">Asli</button>
            <button class="phishing-btn" onclick="checkAnswer(${index}, true)">Phishing</button>
        </div>
    `;
    inboxContainer.appendChild(detailDiv);
}

function checkAnswer(index, isPhishing) {
    const email = currentEmails[index];
    const isCorrect = email.isPhishing === isPhishing;
    
    if (isCorrect) {
        score += 20;
        correctCount++;
        sounds.correct.play();
    } else {
        score = Math.max(0, score - 10);
        wrongCount++;
        sounds.wrong.play();
    }
    
    updateScore();
    updateStats();
    showFeedback(isCorrect, email.explanation, index);
    
    // Hapus email yang sudah dijawab
    currentEmails.splice(index, 1);
    displayInbox(currentEmails);
    
    // Jangan panggil endGame() di sini!
    // endGame akan dipanggil setelah klik OK di showFeedback jika email habis
}

function showFeedback(isCorrect, explanation, emailIndex = null) {
    const feedback = document.createElement('div');
    feedback.className = 'feedback';
    feedback.style.display = 'block';
    feedback.innerHTML = `
        <h3 style=\"color: ${isCorrect ? '#4CAF50' : '#f44336'}\">\n            ${isCorrect ? '✓ Benar!' : '✗ Salah!'}\n        </h3>\n        <p>${explanation}</p>\n        <button id=\"ok-feedback-btn\" style=\"margin-top: 10px; padding: 8px 16px; background: #00ff88; border: none; border-radius: 5px; cursor: pointer;\">OK</button>\n    `;
    
    // Masukkan ke dalam .device-screen agar ikut diskalakan
    const deviceScreen = document.querySelector('.device-screen');
    deviceScreen.appendChild(feedback);
    
    // Event klik OK
    feedback.querySelector('#ok-feedback-btn').onclick = function() {
        feedback.remove();
        // Jika email sudah habis, tampilkan hasil investigasi
        if (currentEmails.length === 0) {
            endGame();
        }
    };
    
    setTimeout(() => {
        if (feedback.parentElement) {
            feedback.remove();
        }
    }, 5000);
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timeLeftElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    sounds.gameOver.play();
    
    finalScoreElement.textContent = score;
    finalCorrectElement.textContent = correctCount;
    finalWrongElement.textContent = wrongCount;
    
    gamePage.classList.remove('active');
    resultPage.classList.add('active');
}

function updateScore() {
    currentScoreElement.textContent = score;
}

function updateStats() {
    correctCountElement.textContent = correctCount;
    wrongCountElement.textContent = wrongCount;
}

function getFeedbackMessage(score) {
    if (score >= 80) return "Excellent! Kamu sangat paham tentang phishing!";
    if (score >= 60) return "Good job! Kamu cukup paham tentang phishing.";
    if (score >= 40) return "Not bad! Kamu perlu belajar lebih lagi tentang phishing.";
    return "Keep learning! Kamu perlu banyak belajar tentang phishing.";
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