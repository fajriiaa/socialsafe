// Daftar kata malware (bisa ditambah nanti)
const levels = [
  { word: 'VIRUS', explain: 'Program jahat yang dapat menggandakan diri dan merusak sistem.' },
  { word: 'TROJAN', explain: 'Malware yang menyamar sebagai program baik untuk mencuri data atau merusak.' },
  { word: 'SPYWARE', explain: 'Perangkat lunak yang diam-diam memantau dan mengirimkan data pengguna.' },
  { word: 'BOT', explain: 'Akun otomatis yang bisa digunakan untuk spam atau penipuan.' },
  { word: 'BACKDOOR', explain: 'Metode untuk melewati keamanan sistem dan mendapatkan akses tanpa izin.' },
];

let currentLevel = 0;
let selectedIndexes = [];
let score = 0;

// Hapus seluruh logika tutorial interaktif
document.addEventListener('DOMContentLoaded', function() {
  // Sembunyikan game utama, tampilkan intro
  const intro = document.getElementById('intro-screen');
  const gameContent = document.querySelector('.device-screen .screen-content');
  if (intro && gameContent) {
    intro.style.display = 'flex';
    gameContent.style.display = 'none';
    const playBtn = document.getElementById('play-btn');
    playBtn.onclick = function() {
      intro.style.display = 'none';
      gameContent.style.display = '';
      // Tampilkan tutorial
      showTutorial();
    };
  }
});

function shuffle(array) {
  // Durstenfeld shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function renderLevel() {
  const level = levels[currentLevel];
  const word = level.word;
  const letters = word.split('');
  const shuffled = shuffle([...letters]);
  selectedIndexes = [];

  // Render grid
  const grid = document.getElementById('letter-grid');
  grid.innerHTML = '';
  shuffled.forEach((char, idx) => {
    const tile = document.createElement('div');
    tile.className = 'letter-tile';
    tile.textContent = char;
    tile.dataset.index = idx;
    tile.addEventListener('mousedown', () => selectTile(idx));
    grid.appendChild(tile);
  });

  // Render answer box
  const answerBox = document.getElementById('answer-box');
  answerBox.innerHTML = '';
  for (let i = 0; i < word.length; i++) {
    const slot = document.createElement('div');
    slot.className = 'answer-slot';
    slot.textContent = '';
    answerBox.appendChild(slot);
  }

  // Reset pesan dan sembunyikan tombol next
  document.getElementById('message').textContent = '';
  document.getElementById('level-info').textContent = `Soal: ${currentLevel + 1}/${levels.length}`;
  
  // Hapus tombol next jika ada
  const nextButton = document.getElementById('next-button');
  if (nextButton) {
    nextButton.remove();
  }

  // Sembunyikan hint jika terbuka
  const explanationBox = document.getElementById('explanation-box');
  if (explanationBox) {
    explanationBox.style.display = 'none';
  }

  // Aktifkan kembali tombol bantuan huruf, reset, dan hint
  const letterBtn = document.getElementById('hint-letter');
  if (letterBtn) {
    letterBtn.classList.remove('letter-used');
    letterBtn.removeAttribute('disabled');
  }
  const resetBtn = document.getElementById('reload-level');
  if (resetBtn) {
    resetBtn.classList.remove('reset-used');
    resetBtn.removeAttribute('disabled');
  }
  const hintBtn = document.getElementById('hint-explain');
  if (hintBtn) {
    hintBtn.classList.remove('hint-used');
    hintBtn.removeAttribute('disabled');
  }
}

function selectTile(idx) {
  if (selectedIndexes.includes(idx)) return; // Tidak boleh pilih dua kali
  selectedIndexes.push(idx);
  const grid = document.getElementById('letter-grid');
  const tiles = grid.getElementsByClassName('letter-tile');
  tiles[idx].classList.add('selected');

  // Update answer box
  const level = levels[currentLevel];
  const shuffled = Array.from(tiles).map(tile => tile.textContent);
  const answerBox = document.getElementById('answer-box');
  answerBox.children[selectedIndexes.length - 1].textContent = shuffled[idx];

  // Jika sudah sebanyak huruf, cek jawaban
  if (selectedIndexes.length === level.word.length) {
    const userAnswer = selectedIndexes.map(i => shuffled[i]).join('');
    if (userAnswer === level.word) {
      score += 20;
      updateScore();
      showCorrectMessage();
    } else {
      setTimeout(() => renderLevel(), 1000);
    }
  }
}

function showCorrectMessage() {
  // Nonaktifkan tombol reset dan hint
  const resetBtn = document.getElementById('reload-level');
  if (resetBtn) {
    resetBtn.classList.add('reset-used');
    resetBtn.setAttribute('disabled', 'disabled');
  }
  const hintBtn = document.getElementById('hint-explain');
  if (hintBtn) {
    hintBtn.classList.add('hint-used');
    hintBtn.setAttribute('disabled', 'disabled');
  }
  // Tampilkan tombol next jika bukan level terakhir
  if (currentLevel < levels.length - 1) {
    showNextButton();
  } else {
    // Tampilkan popup akhir game
    showEndPopup();
  }
}

function showEndPopup() {
  const popup = document.getElementById('end-popup');
  popup.innerHTML = `
    <div class="popup-content" style="animation:none;transition:none;">
      <div class="popup-desc">Kamu telah menyelesaikan semua tantangan malware di media sosial.<br>Terus waspada dan lindungi akunmu!</div>
      <div class="popup-score" style="margin-bottom:16px;">Skor Akhir: <b>${score}</b></div>
      <button id="continue-btn" class="popup-btn">Selesai</button>
    </div>
  `;
  // Hilangkan animasi jika ada
  popup.style.display = 'flex';
  popup.style.animation = 'none';
  popup.style.opacity = '1';
  document.getElementById('continue-btn').onclick = function() {
    // Kirim pesan ke parent window untuk menutup overlay
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'gameCompleted', points: score }, '*');
    }
  };
}

function showNextButton() {
  // Hapus tombol next yang sudah ada jika ada
  const existingNextButton = document.getElementById('next-button');
  if (existingNextButton) {
    existingNextButton.remove();
  }
  
  // Buat tombol next baru
  const nextButton = document.createElement('button');
  nextButton.id = 'next-button';
  nextButton.className = 'next-btn-elegant';
  nextButton.title = 'Lanjut ke soal berikutnya';
  nextButton.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 12h14"/>
      <path d="m12 5 7 7-7 7"/>
    </svg>
  `;
  nextButton.addEventListener('click', nextLevel);
  
  // Tambahkan tombol next ke dalam game level
  const gameLevel = document.getElementById('game-level');
  gameLevel.appendChild(nextButton);
}

function nextLevel() {
  currentLevel++;
  if (currentLevel < levels.length) {
    renderLevel();
  }
}

function showExplanation() {
  const hintBtn = document.getElementById('hint-explain');
  if (hintBtn && (hintBtn.hasAttribute('disabled') || hintBtn.classList.contains('hint-used'))) return;
  // Kurangi skor 5 jika hint digunakan
  score -= 5;
  updateScore();
  const level = levels[currentLevel];
  const box = document.getElementById('explanation-box');
  box.innerHTML = `<strong>Hint:</strong><br>${level.explain}<br><button id='close-explanation' style='margin-top:10px;padding:4px 12px;border:none;background:#4fd1c5;color:#fff;border-radius:6px;cursor:pointer;'>Tutup</button>`;
  box.style.display = 'block';
  // Ubah warna tombol hint
  if (hintBtn) hintBtn.classList.add('hint-used');
  document.getElementById('close-explanation').onclick = function() {
    box.style.display = 'none';
    // Kembalikan warna tombol hint
    if (hintBtn) hintBtn.classList.remove('hint-used');
  };
}

function revealFirstLetter() {
  // Cek jika sudah penuh, jangan lakukan apa-apa
  const answerBox = document.getElementById('answer-box');
  let isFull = true;
  for (let i = 0; i < answerBox.children.length; i++) {
    if (answerBox.children[i].textContent === '') {
      isFull = false;
      break;
    }
  }
  const letterBtn = document.getElementById('hint-letter');
  const resetBtn = document.getElementById('reload-level');
  if (isFull) {
    if (letterBtn) {
      letterBtn.classList.add('letter-used');
      letterBtn.setAttribute('disabled', 'disabled');
    }
    if (resetBtn) {
      resetBtn.classList.add('reset-used');
      resetBtn.setAttribute('disabled', 'disabled');
    }
    return;
  }
  // Kurangi skor 2 setiap kali bantuan huruf digunakan
  score -= 2;
  updateScore();
  const level = levels[currentLevel];
  const word = level.word;
  const grid = document.getElementById('letter-grid');
  const tiles = grid.getElementsByClassName('letter-tile');
  const shuffled = Array.from(tiles).map(tile => tile.textContent);

  // Cari posisi pertama yang masih kosong
  let pos = -1;
  for (let i = 0; i < word.length; i++) {
    if (answerBox.children[i].textContent === '') {
      pos = i;
      break;
    }
  }
  if (pos === -1) return;
  const correctLetter = word[pos];

  // Cari index tile di grid yang sesuai huruf benar dan belum dipilih
  for (let i = 0; i < shuffled.length; i++) {
    if (shuffled[i] === correctLetter && !tiles[i].classList.contains('selected')) {
      selectTile(i);
      break;
    }
  }

  // Cek lagi, jika sudah penuh setelah bantuan, disable tombol
  let isFullAfter = true;
  for (let i = 0; i < answerBox.children.length; i++) {
    if (answerBox.children[i].textContent === '') {
      isFullAfter = false;
      break;
    }
  }
  if (isFullAfter) {
    if (letterBtn) {
      letterBtn.classList.add('letter-used');
      letterBtn.setAttribute('disabled', 'disabled');
    }
    if (resetBtn) {
      resetBtn.classList.add('reset-used');
      resetBtn.setAttribute('disabled', 'disabled');
    }
  }
}

function updateScore() {
  var scoreCorner = document.getElementById('score-corner');
  if (scoreCorner) scoreCorner.textContent = `Skor: ${score}`;
}

function resetCurrentLevel() {
  renderLevel();
}

function showTutorial() {
  const tutorialOverlay = document.getElementById('tutorial-overlay');
  tutorialOverlay.innerHTML = `
    <div class="tutorial-box">
      <div class="tutorial-title">🎮 Cara Bermain</div>
      <div class="tutorial-content">
        Selamat datang di <span class="tutorial-highlight">Malword</span>! 
        Game edukasi untuk mengenali ancaman malware di media sosial.
      </div>
      <div class="tutorial-steps">
        <div class="tutorial-step">
          <div class="step-number">1</div>
          <div class="step-text">Susun huruf-huruf yang tersedia menjadi kata yang benar</div>
        </div>
        <div class="tutorial-step">
          <div class="step-number">2</div>
          <div class="step-text">Klik huruf secara berurutan untuk membentuk kata</div>
        </div>
        <div class="tutorial-step">
          <div class="step-number">3</div>
          <div class="step-text">Gunakan tombol <span class="tutorial-highlight">Hint</span> untuk penjelasan kata</div>
        </div>
        <div class="tutorial-step">
          <div class="step-number">4</div>
          <div class="step-text">Gunakan tombol <span class="tutorial-highlight">Clue</span> untuk membuka huruf pertama</div>
        </div>
        <div class="tutorial-step">
          <div class="step-number">5</div>
          <div class="step-text">Gunakan tombol <span class="tutorial-highlight">Reset</span> untuk mengacak ulang huruf</div>
        </div>
      </div>
      <div class="tutorial-content">
        Setiap kata yang benar akan memberikan <span class="tutorial-highlight">20 poin</span> dan penjelasan tentang ancaman malware tersebut.
      </div>
      <button class="tutorial-btn" onclick="startGame()">Mulai Bermain</button>
    </div>
  `;
  tutorialOverlay.style.display = 'flex';
}

function startGame() {
  document.getElementById('tutorial-overlay').style.display = 'none';
  renderLevel();
}

// Event listener tombol bantuan
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('hint-explain').addEventListener('click', showExplanation);
  document.getElementById('hint-letter').addEventListener('click', revealFirstLetter);
  document.getElementById('reload-level').addEventListener('click', resetCurrentLevel);

  // Hapus atribut title agar tooltip browser tidak muncul dobel
  document.getElementById('hint-explain').removeAttribute('title');
  document.getElementById('hint-letter').removeAttribute('title');
  document.getElementById('reload-level').removeAttribute('title');
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