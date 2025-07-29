window.addEventListener('DOMContentLoaded', function() {
    var btnMulai = document.getElementById('btn-mulai');
    if (btnMulai) {
        btnMulai.addEventListener('click', function() {
            document.getElementById('intro-content').style.display = 'none';
            document.getElementById('game-content').style.display = 'grid';
            // Mulai tutorial interaktif
            tutorialStep = 0;
            showTutorialStep(tutorialStep);
        });
    }
    var tutBtn = document.getElementById('tutorial-next-btn');
    if (tutBtn) {
        tutBtn.onclick = function() {
            tutorialStep++;
            showTutorialStep(tutorialStep);
        };
    }
});

// Array soal dan jawaban
const questions = [
  {
    question: 'Apa yang sebaiknya TIDAK kamu bagikan di media sosial untuk menjaga privasi?',
    answers: [
      'Alamat rumah lengkap',
      'Foto makanan favorit',
      'Hobi dan minat',
      'Kutipan motivasi'
    ],
    correct: 0
  },
  {
    question: 'Mengapa penting menggunakan password yang kuat dan berbeda untuk setiap akun media sosial?',
    answers: [
      'Agar mudah diingat',
      'Agar akun tidak mudah diretas',
      'Supaya teman mudah menebak',
      'Agar bisa login di banyak perangkat'
    ],
    correct: 1
  },
  {
    question: 'Apa yang harus kamu lakukan jika menerima pesan mencurigakan yang meminta data pribadi?',
    answers: [
      'Segera membalas pesan tersebut',
      'Memberikan data yang diminta',
      'Mengabaikan dan melaporkan pesan tersebut',
      'Membagikan pesan ke teman'
    ],
    correct: 2
  },
  {
    question: 'Fitur apa yang bisa digunakan untuk membatasi siapa saja yang bisa melihat postinganmu di media sosial?',
    answers: [
      'Filter warna foto',
      'Pengaturan privasi akun',
      'Tag lokasi',
      'Menambah teman baru'
    ],
    correct: 1
  },
  {
    question: 'Apa risiko jika terlalu sering membagikan aktivitas harian secara detail di media sosial?',
    answers: [
      'Mendapat banyak like',
      'Privasi bisa terganggu dan rawan kejahatan',
      'Akun menjadi lebih populer',
      'Teman jadi tahu kegiatanmu'
    ],
    correct: 1
  },
  {
    question: 'Apa yang sebaiknya dilakukan sebelum menerima permintaan pertemanan dari orang yang tidak dikenal?',
    answers: [
      'Langsung diterima',
      'Cek profil dan mutual friend terlebih dahulu',
      'Abaikan saja',
      'Blokir akun tersebut'
    ],
    correct: 1
  },
  {
    question: 'Apa fungsi fitur two-factor authentication (2FA) di media sosial?',
    answers: [
      'Membuat akun lebih mudah diakses',
      'Menambah keamanan login',
      'Mengganti username',
      'Menghapus akun lama'
    ],
    correct: 1
  },
  {
    question: 'Apa yang harus kamu lakukan jika menemukan akun palsu yang mengatasnamakanmu?',
    answers: [
      'Abaikan saja',
      'Laporkan ke pihak media sosial',
      'Sebarkan ke teman-teman',
      'Ganti nama akunmu'
    ],
    correct: 1
  },
  {
    question: 'Mengapa sebaiknya tidak menggunakan WiFi publik untuk login ke akun media sosial?',
    answers: [
      'Agar baterai tidak cepat habis',
      'Karena rawan pencurian data',
      'Supaya tidak lemot',
      'Agar tidak boros kuota'
    ],
    correct: 1
  },
  {
    question: 'Apa yang harus dilakukan jika akun media sosialmu tiba-tiba tidak bisa diakses?',
    answers: [
      'Coba login berulang-ulang',
      'Segera reset password dan hubungi support',
      'Buat akun baru',
      'Tunggu beberapa hari'
    ],
    correct: 1
  }
];

let currentQuestion = 0;
let selectedAnswer = null;
let timerInterval = null;
let timeLeft = 20;
let currentScoreIndex = 0; // posisi skor terakhir benar
let jumlahBenar = 0; // Tambahkan variabel global untuk menghitung jawaban benar

// Tutorial interaktif sebelum game dimulai
let tutorialStep = 0;
const tutorialSteps = [
  {
    text: 'Jawab pertanyaan dengan benar untuk mendapatkan skor tertinggi!',
    highlight: null,
    btn: 'OK'
  },
  {
    text: 'Ini adalah daftar skor yang bisa kamu raih. Setiap jawaban benar akan menaikkan skor kamu.',
    highlight: 'prize-ladder-box',
    btn: 'OK'
  },
  {
    text: 'Di sini akan muncul pertanyaan seputar privasi media sosial.',
    highlight: 'question-box',
    btn: 'OK'
  },
  {
    text: 'Pilih salah satu jawaban yang menurutmu benar.',
    highlight: 'answer-buttons',
    btn: 'OK'
  },
  {
    text: 'Kamu harus menjawab sebelum waktu habis. Siap?',
    highlight: 'timer',
    btn: 'SIAP'
  }
];

function getTimeForQuestion(idx) {
  // Soal pertama 20 detik, tiap naik soal -1 detik, minimal 10 detik
  return Math.max(20 - idx, 10);
}

function startTimer(idx) {
  clearInterval(timerInterval);
  timeLeft = getTimeForQuestion(idx);
  const timerEl = document.getElementById('timer');
  if (timerEl) timerEl.textContent = timeLeft;
  timerInterval = setInterval(() => {
    timeLeft--;
    if (timerEl) {
      timerEl.textContent = timeLeft;
      if (timeLeft <= 5) {
        timerEl.classList.add('timer-warning');
      } else {
        timerEl.classList.remove('timer-warning');
      }
    }
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      // Waktu habis, game over
      document.getElementById('game-over').style.display = 'flex';
    }
  }, 1000);
}

function updateScore(idx) {
  // Ambil skor dari prize-ladder sesuai idx
  const prizes = Array.from(document.querySelectorAll('#prize-ladder .prize'));
  let skor = prizes[idx]?.textContent || '';
  // Ambil hanya angka skor
  let skorValue = skor.match(/\d+/g);
  skorValue = skorValue ? skorValue[skorValue.length-1] : '0';
  const bank = document.getElementById('bank-amount');
  if (bank) bank.textContent = skorValue;
}

function clearSelected() {
  const answerBtns = [
    document.getElementById('answer0'),
    document.getElementById('answer1'),
    document.getElementById('answer2'),
    document.getElementById('answer3')
  ];
  answerBtns.forEach(btn => btn && btn.classList.remove('selected'));
}

function handleAnswerConfirm() {
  const answerBtns = [
    document.getElementById('answer0'),
    document.getElementById('answer1'),
    document.getElementById('answer2'),
    document.getElementById('answer3')
  ];
  if (selectedAnswer !== null) {
    const btn = answerBtns[selectedAnswer];
    btn.classList.add('blink');
    clearInterval(timerInterval);
    setTimeout(() => {
      btn.classList.remove('blink');
      const prizes = Array.from(document.querySelectorAll('#prize-ladder .prize'));
      // Cek jawaban
      if (selectedAnswer === questions[currentQuestion].correct) {
        // Benar, highlight skor naik satu
        if (currentScoreIndex < prizes.length - 1) currentScoreIndex++;
        prizes.forEach((el, idx) => el.classList.toggle('active', idx === currentScoreIndex));
        // Update skor baru
        updateScore(currentScoreIndex);
        btn.classList.add('correct');
        jumlahBenar++; // Tambahkan jika benar
      } else {
        // Salah, highlight skor tetap di posisi terakhir benar
        prizes.forEach((el, idx) => el.classList.toggle('active', idx === currentScoreIndex));
      }
      // Lanjut ke soal berikutnya setelah jeda
      setTimeout(() => {
        btn.classList.remove('correct');
        currentQuestion++;
        if (currentQuestion < questions.length) {
          showQuestion(currentQuestion);
        } else {
          // Hitung jumlah benar dan skor
          const totalSoal = questions.length;
          const totalSkor = jumlahBenar * 10;
          // Selesai, tampilkan pesan menang
          document.getElementById('game-over').innerHTML = `<div style=\"font-size:1.2rem; color:#fff; font-weight:900; text-shadow:1px 1px 0 #232b4a; margin-bottom:8px; text-align:center;\">Selamat!<br>Kamu sudah menyelesaikan semua soal.</div><div style=\"font-size:1rem; color:#fff; font-weight:700; margin-bottom:4px; text-align:center;\">Jawaban benar: ${jumlahBenar}/${totalSoal}</div><div style=\"font-size:1rem; color:#ffd700; font-weight:900; margin-bottom:12px; text-align:center;\">Total Skor: ${totalSkor}</div><button id=\"selesai-btn\" style=\"font-size:0.8rem; padding:6px 16px; border-radius:4px; background:#ffd700; color:#232b4a; font-weight:700; border:none; box-shadow:0 1px 4px #0002; cursor:pointer; margin-bottom:12px;\">Selesai</button>`;
          document.getElementById('game-over').style.display = 'flex';
          document.getElementById('selesai-btn').onclick = function() { 
            // Kirim pesan ke parent window untuk menutup minigame
            window.parent.postMessage({ type: 'gameCompleted', points: totalSkor }, '*');
          };
        }
      }, 1000);
    }, 2000);
  }
}

function setupAnswerButtons() {
  const answerBtns = [
    document.getElementById('answer0'),
    document.getElementById('answer1'),
    document.getElementById('answer2'),
    document.getElementById('answer3')
  ];
  answerBtns.forEach((btn, idx) => {
    if (btn) {
      btn.onclick = function() {
        if (selectedAnswer !== null) return; // Tidak bisa pilih ulang sebelum konfirmasi
        clearSelected();
        btn.classList.add('selected');
        selectedAnswer = idx;
        handleAnswerConfirm();
      };
    }
  });
}

function showQuestion(idx) {
  const q = questions[idx];
  const questionBox = document.getElementById('question-box');
  const answerBtns = [
    document.getElementById('answer0'),
    document.getElementById('answer1'),
    document.getElementById('answer2'),
    document.getElementById('answer3')
  ];
  if (questionBox) questionBox.textContent = q.question;
  for (let i = 0; i < 4; i++) {
    if (answerBtns[i]) answerBtns[i].textContent = q.answers[i];
  }
  // Pastikan pertanyaan dan jawaban terlihat
  if (questionBox) questionBox.style.visibility = 'visible';
  const answers = document.querySelector('.answers');
  if (answers) answers.style.visibility = 'visible';
  // Reset pilihan
  clearSelected();
  selectedAnswer = null;
  // Setup event
  setupAnswerButtons();
  // Sembunyikan confirm box jika ada
  const confirmBox = document.getElementById('confirm-box');
  if (confirmBox) confirmBox.style.display = 'none';
  // Mulai timer
  startTimer(idx);
  // Efek animasi muncul
  if (questionBox) {
    questionBox.classList.add('fade-in');
    setTimeout(() => questionBox.classList.remove('fade-in'), 600);
  }
  if (answers) {
    answers.classList.add('fade-in');
    setTimeout(() => answers.classList.remove('fade-in'), 600);
  }
}

function animatePrizeLadder(callback) {
    const prizes = Array.from(document.querySelectorAll('#prize-ladder .prize'));
    let i = 0;
    function highlightUp() {
        if (i < prizes.length) {
            prizes.forEach((el, idx) => el.classList.toggle('active', idx === i));
            i++;
            setTimeout(highlightUp, 100);
        } else {
            i = prizes.length - 1;
            setTimeout(highlightDown, 200);
        }
    }
    function highlightDown() {
        if (i >= 0) {
            prizes.forEach((el, idx) => el.classList.toggle('active', idx === i));
            i--;
            setTimeout(highlightDown, 100);
        } else {
            // Kembalikan highlight ke skor awal (bawah)
            prizes.forEach((el, idx) => el.classList.toggle('active', idx === 0));
            if (callback) callback();
        }
    }
    highlightUp();
}

// Event untuk tombol Yes pada host-speech
const yesBtn = document.querySelector('.host-btn');
if (yesBtn) {
    yesBtn.addEventListener('click', function() {
        const speech = document.querySelector('.host-speech');
        const petunjuk = speech.querySelector('.petunjuk');
        if (petunjuk) {
            petunjuk.textContent = 'Ayo mulai permainan!';
            setTimeout(() => {
                const hostPanel = document.querySelector('.host-panel');
                if (hostPanel) hostPanel.style.display = 'none';
                // Jalankan animasi skor, lalu tampilkan soal
                animatePrizeLadder(() => showQuestion(currentQuestion));
            }, 2000);
        }
        // Sembunyikan tombol Yes/No
        const btns = speech.querySelectorAll('.host-btn');
        btns.forEach(btn => btn.style.display = 'none');
    });
}

// Event Play Again
window.addEventListener('DOMContentLoaded', function() {
  const playAgainBtn = document.getElementById('play-again-btn');
  if (playAgainBtn) {
    playAgainBtn.onclick = function() {
      // Reset game tanpa tutorial
      currentQuestion = 0;
      selectedAnswer = null;
      currentScoreIndex = 0;
      jumlahBenar = 0;
      document.getElementById('intro-content').style.display = 'none';
      document.getElementById('game-content').style.display = 'grid';
      document.getElementById('game-over').style.display = 'none';
      document.getElementById('tutorial-overlay').style.display = 'none';
      // Reset skor aktif ke skor 0 (paling bawah)
      const prizes = Array.from(document.querySelectorAll('#prize-ladder .prize'));
      prizes.forEach((el) => el.classList.remove('active'));
      if (prizes[0]) prizes[0].classList.add('active');
      showQuestion(currentQuestion);
    };
  }
});

// Reset jumlahBenar saat mulai game baru
window.addEventListener('DOMContentLoaded', function() {
  var btnMulai = document.getElementById('btn-mulai');
  if (btnMulai) {
    btnMulai.addEventListener('click', function() {
      jumlahBenar = 0;
    });
  }
});

function showGiveUpScreen() {
  clearInterval(timerInterval);
  // Ambil skor terakhir dari prize-ladder
  const prizes = Array.from(document.querySelectorAll('#prize-ladder .prize'));
  let skor = prizes[currentQuestion]?.textContent || '';
  // Ambil hanya angka skor
  let skorValue = skor.match(/\d+/g);
  skorValue = skorValue ? skorValue[skorValue.length-1] : '';
  // Tampilkan pesan give up
  const gameOver = document.getElementById('game-over');
  if (gameOver) {
    gameOver.innerHTML = `
      <div style="font-size:1rem; color:#fff; font-weight:900; text-shadow:1px 1px 0 #232b4a; margin-bottom:8px; text-align:center;">Kamu menyerah...<br>Kamu pulang membawa</div>
      <div style="font-size:1.6rem; color:#ffd700; font-weight:900; text-shadow:1px 1px 0 #232b4a; margin-bottom:8px;">Skor ${skorValue}</div>
      <button id="play-again-btn" style="font-size:0.8rem; padding:6px 16px; border-radius:4px; background:#ffd700; color:#232b4a; font-weight:700; border:none; box-shadow:0 1px 4px #0002; cursor:pointer; margin-bottom:12px;">Main Lagi</button>
      <div style="font-size:2rem;">😃</div>
    `;
    gameOver.style.display = 'flex';
    // Event Play Again
    document.getElementById('play-again-btn').onclick = function() {
      window.location.reload();
    };
  }
}

function showTutorialStep(step) {
  const overlay = document.getElementById('tutorial-overlay');
  const box = document.getElementById('tutorial-box');
  const text = document.getElementById('tutorial-text');
  const btn = document.getElementById('tutorial-next-btn');
  // Reset highlight
  document.querySelectorAll('.highlight-tutorial').forEach(el => el.classList.remove('highlight-tutorial'));
  if (step < tutorialSteps.length) {
    overlay.style.display = 'flex';
    text.textContent = tutorialSteps[step].text;
    btn.textContent = tutorialSteps[step].btn;
    
    // Atur posisi tutorial box berdasarkan elemen yang di-highlight
    if (tutorialSteps[step].highlight === 'question-box') {
      // Jika highlight soal, posisikan tutorial di bawah soal
      const questionBox = document.getElementById('question-box');
      if (questionBox) {
        const rect = questionBox.getBoundingClientRect();
        const overlayRect = overlay.getBoundingClientRect();
        box.style.position = 'absolute';
        box.style.top = (rect.bottom - overlayRect.top + 10) + 'px';
        box.style.left = '50%';
        box.style.transform = 'translateX(-50%)';
        box.style.margin = '0';
      }
    } else if (tutorialSteps[step].highlight === 'timer') {
      // Jika highlight timer, posisikan tutorial di bawah timer
      const timerEl = document.getElementById('timer');
      if (timerEl) {
        const rect = timerEl.getBoundingClientRect();
        const overlayRect = overlay.getBoundingClientRect();
        box.style.position = 'absolute';
        box.style.top = (rect.bottom - overlayRect.top + 10) + 'px';
        box.style.left = '50%';
        box.style.transform = 'translateX(-50%)';
        box.style.margin = '0';
      }
    } else {
      // Untuk elemen lain, posisikan di tengah
      box.style.position = 'relative';
      box.style.top = 'auto';
      box.style.left = 'auto';
      box.style.transform = 'none';
      box.style.margin = '0';
    }
    
    // Highlight hanya pada elemen yang sesuai step
    if (tutorialSteps[step].highlight === 'prize-ladder-box') {
      const el = document.getElementById('prize-ladder-box') || document.querySelector('.prize-ladder-box');
      if (el) el.classList.add('highlight-tutorial');
    } else if (tutorialSteps[step].highlight === 'answer-buttons') {
      // Highlight keempat tombol jawaban
      const answerBtns = [
        document.getElementById('answer0'),
        document.getElementById('answer1'),
        document.getElementById('answer2'),
        document.getElementById('answer3')
      ];
      answerBtns.forEach(btn => {
        if (btn) btn.classList.add('highlight-tutorial');
      });
    } else if (tutorialSteps[step].highlight) {
      const el = document.getElementById(tutorialSteps[step].highlight);
      if (el) el.classList.add('highlight-tutorial');
    }
  } else {
    overlay.style.display = 'none';
    document.querySelectorAll('.highlight-tutorial').forEach(el => el.classList.remove('highlight-tutorial'));
    animatePrizeLadder(() => showQuestion(currentQuestion));
  }
}

// Highlight style
const style = document.createElement('style');
style.innerHTML = `
  .highlight-tutorial {
    box-shadow: 0 0 0 4px #ffe082, 0 4px 32px #fff8, 0 2px 24px #ffd700cc !important;
    background: rgba(255,255,255,0.35) !important;
    z-index: 101 !important;
    position: relative;
    transition: box-shadow 0.2s, background 0.2s;
  }
`;
document.head.appendChild(style);

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