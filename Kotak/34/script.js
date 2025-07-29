// Data kata-kata UU ITE dan UU PDP
const wordData = [
    {
        word: "HOAKS",
        description: "Informasi yang tidak benar atau menyesatkan yang disebarluaskan melalui media elektronik.",
        article: "Pasal 28 ayat (1) UU ITE: Setiap Orang dengan sengaja dan tanpa hak menyebarkan berita bohong dan menyesatkan yang mengakibatkan kerugian konsumen dalam Transaksi Elektronik.",
        points: 20
    },
    {
        word: "FITNAH",
        description: "Perbuatan menyebarkan berita bohong yang dapat merugikan orang lain.",
        article: "Pasal 28 ayat (1) UU ITE: Setiap Orang dengan sengaja dan tanpa hak menyebarkan berita bohong dan menyesatkan yang mengakibatkan kerugian konsumen dalam Transaksi Elektronik.",
        points: 20
    },
    {
        word: "PRIVASI",
        description: "Hak untuk melindungi data pribadi dalam penggunaan teknologi informasi.",
        article: "Pasal 4 UU PDP: Pemrosesan Data Pribadi dilakukan berdasarkan asas kepastian hukum, kemanfaatan, kehati-hatian, iktikad baik, dan kebebasan memilih teknologi atau netral teknologi.",
        points: 20
    },
    {
        word: "HACKING",
        description: "Aktivitas mengakses sistem komputer secara tidak sah.",
        article: "Pasal 66 UU PDP: Setiap Orang yang dengan sengaja dan tanpa hak memperoleh atau mengakses Data Pribadi yang bukan miliknya dipidana dengan pidana penjara paling lama 4 (empat) tahun dan/atau denda paling banyak Rp4.000.000.000,00 (empat miliar rupiah).",
        points: 20
    },
    {
        word: "CYBERBULLYING",
        description: "Perbuatan mengganggu, mengusik, atau menyusahkan orang lain melalui media elektronik.",
        article: "Pasal 27 ayat (3) UU ITE: Setiap Orang dengan sengaja dan tanpa hak mendistribusikan dan/atau mentransmisikan dan/atau membuat dapat diaksesnya Informasi Elektronik dan/atau Dokumen Elektronik yang memiliki muatan penghinaan dan/atau pencemaran nama baik.",
        points: 20
    }
];

// Konfigurasi game
const GRID_SIZE = 15;
let selectedCells = [];
let foundWords = new Set();
let score = 0;
let timeLeft = 300; // 5 menit dalam detik
let timerInterval;
let gameStarted = false;
let firstCell = null;
let secondCell = null;
let shouldShowGameOverAfterInfo = false;

// Sound effects
const sounds = {
    correct: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3'),
    wrong: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3'),
    gameOver: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-game-ball-tap-2073.mp3'),
    background: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-game-level-music-689.mp3')
};

// Event handlers untuk seleksi kata
let isDragging = false;
let startCell = null;

function cellMouseDown(e) {
    isDragging = true;
    startCell = e.target;
    clearSelection();
    startCell.classList.add('selected');
}

function cellMouseMove(e) {
    if (!isDragging || !startCell) return;
    
    const currentCell = e.target;
    if (currentCell.classList.contains('grid-cell')) {
        clearSelection();
        if (isStraightLine(startCell, currentCell)) {
            const cellsInLine = getCellsInLine(startCell, currentCell);
            cellsInLine.forEach(c => c.classList.add('selected'));
        } else {
            startCell.classList.add('selected');
        }
    }
}

function cellMouseUp(e) {
    if (!isDragging || !startCell) return;
    
    const endCell = e.target;
    if (endCell.classList.contains('grid-cell') && isStraightLine(startCell, endCell)) {
        const cellsInLine = getCellsInLine(startCell, endCell);
        const word = cellsInLine.map(c => c.textContent).join('');
        checkWord(word);
    }
    
    isDragging = false;
    startCell = null;
    clearSelection();
}

// Inisialisasi game
function initializeGame() {
    score = 0;
    timeLeft = 300;
    foundWords.clear();
    updateScore();
    updateTimer();
    initializeGrid();
    updateWordList();
    startTimer();
    createStars();
    
    // Mute background music untuk device screen
    sounds.background.loop = true;
    sounds.background.volume = 0.1;
    // sounds.background.play(); // Uncomment jika ingin ada background music
}

// Update skor
function updateScore() {
    document.getElementById('score').textContent = `Skor: ${score}`;
}

// Update timer
function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = `Waktu: ${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Start timer
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// End game
function endGame() {
    clearInterval(timerInterval);
    sounds.background.pause();
    sounds.gameOver.play();
    
    // Tutup modal info jika terbuka
    closeInfoModal();
    
    // Update final score dan words found
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-words-found').textContent = foundWords.size;
    
    // Tampilkan modal game over
    showGameOverModal();
    
    // Tambahkan event listener untuk tombol Selesai (hanya sekali)
    const selesaiBtn = document.querySelector('.gameover-btn');
    if (selesaiBtn) {
        // Hapus event listener lama jika ada
        selesaiBtn.removeEventListener('click', handleSelesaiClick);
        // Tambahkan event listener baru
        selesaiBtn.addEventListener('click', handleSelesaiClick);
    }
}

// Fungsi untuk menangani klik tombol Selesai
function handleSelesaiClick() {
    // Kirim pesan ke parent dengan poin
    window.parent.postMessage({ type: 'gameCompleted', points: score }, '*');
    
    // Tutup tampilan minigame secara langsung
    // Tambahkan animasi fade out sebelum menutup
    const gameSection = document.getElementById('game-section');
    if (gameSection) {
        gameSection.style.transition = 'opacity 0.3s ease';
        gameSection.style.opacity = '0';
        setTimeout(() => {
            // Sembunyikan seluruh halaman minigame
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                // Tutup iframe dengan mengirim pesan ke parent
                window.parent.postMessage({ type: 'closeGame' }, '*');
            }, 300);
        }, 300);
    }
}

// Inisialisasi grid
function initializeGrid() {
    const grid = document.getElementById('word-grid');
    grid.innerHTML = '';
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('mousedown', cellMouseDown);
            cell.addEventListener('mousemove', cellMouseMove);
            cell.addEventListener('mouseup', cellMouseUp);
            grid.appendChild(cell);
        }
    }
    placeWords();
    fillEmptyCells();
}

// Tempatkan kata-kata dalam grid
function placeWords() {
    wordData.forEach(data => {
        let placed = false;
        while (!placed) {
            const direction = Math.floor(Math.random() * 8); // 8 arah
            const row = Math.floor(Math.random() * GRID_SIZE);
            const col = Math.floor(Math.random() * GRID_SIZE);
            
            if (canPlaceWord(data.word, row, col, direction)) {
                placeWord(data.word, row, col, direction);
                placed = true;
            }
        }
    });
}

// Cek apakah kata bisa ditempatkan
function canPlaceWord(word, row, col, direction) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]
    ];
    
    const [dr, dc] = directions[direction];
    
    for (let i = 0; i < word.length; i++) {
        const newRow = row + i * dr;
        const newCol = col + i * dc;
        
        if (newRow < 0 || newRow >= GRID_SIZE || newCol < 0 || newCol >= GRID_SIZE) {
            return false;
        }
        
        const cell = getCell(newRow, newCol);
        if (cell.textContent !== '' && cell.textContent !== word[i]) {
            return false;
        }
    }
    
    return true;
}

// Tempatkan kata dalam grid
function placeWord(word, row, col, direction) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]
    ];
    
    const [dr, dc] = directions[direction];
    
    for (let i = 0; i < word.length; i++) {
        const newRow = row + i * dr;
        const newCol = col + i * dc;
        const cell = getCell(newRow, newCol);
        cell.textContent = word[i];
    }
}

// Isi sel kosong dengan huruf acak
function fillEmptyCells() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const cell = getCell(i, j);
            if (cell.textContent === '') {
                cell.textContent = letters[Math.floor(Math.random() * letters.length)];
            }
        }
    }
}

// Dapatkan sel berdasarkan posisi
function getCell(row, col) {
    return document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
}

// Cek apakah dua sel membentuk garis lurus
function isStraightLine(cell1, cell2) {
    const row1 = parseInt(cell1.dataset.row);
    const col1 = parseInt(cell1.dataset.col);
    const row2 = parseInt(cell2.dataset.row);
    const col2 = parseInt(cell2.dataset.col);
    
    return row1 === row2 || col1 === col2 || Math.abs(row1 - row2) === Math.abs(col1 - col2);
}

// Dapatkan semua sel dalam garis
function getCellsInLine(cell1, cell2) {
    const row1 = parseInt(cell1.dataset.row);
    const col1 = parseInt(cell1.dataset.col);
    const row2 = parseInt(cell2.dataset.row);
    const col2 = parseInt(cell2.dataset.col);
    
    const cells = [];
    const maxDistance = Math.max(Math.abs(row1 - row2), Math.abs(col1 - col2));
    
    for (let i = 0; i <= maxDistance; i++) {
        const row = row1 + Math.round((row2 - row1) * i / maxDistance);
        const col = col1 + Math.round((col2 - col1) * i / maxDistance);
        cells.push(getCell(row, col));
    }
    
    return cells;
}

// Bersihkan seleksi
function clearSelection() {
    document.querySelectorAll('.grid-cell.selected').forEach(cell => {
        cell.classList.remove('selected');
    });
}

// Cek kata yang dipilih
function checkWord(word) {
    const wordInfo = wordData.find(data => data.word === word);
    
    if (wordInfo && !foundWords.has(word)) {
        foundWords.add(word);
        score += wordInfo.points;
        updateScore();
        updateWordList();
        
        // Tandai sel yang ditemukan
        document.querySelectorAll('.grid-cell.selected').forEach(cell => {
            cell.classList.add('found');
        });
        
        sounds.correct.play();
        showWordInfo(wordInfo);
        
        // Cek apakah semua kata sudah ditemukan
        if (foundWords.size === wordData.length) {
            setTimeout(() => {
                endGame();
            }, 1000);
        }
    } else if (wordInfo && foundWords.has(word)) {
        // Kata sudah ditemukan
        sounds.wrong.play();
    } else {
        // Kata tidak valid
        sounds.wrong.play();
    }
}

// Tampilkan info kata
function showWordInfo(wordInfo) {
    // Custom konten modal
    document.getElementById('word-found').innerHTML = `<span class='modal-info-title'>${wordInfo.word}</span>`;
    document.getElementById('word-description').innerHTML = `<span class='modal-info-desc'>${wordInfo.description}</span>`;
    document.getElementById('related-article').innerHTML = `<div class='modal-info-article'>${wordInfo.article}</div>`;
    showInfoModal();
    clearInterval(timerInterval);
    // Timer akan dilanjutkan saat modal ditutup (lihat closeInfoModal)
}

// Update daftar kata
function updateWordList() {
    const wordListInside = document.getElementById('word-list-inside');
    if (wordListInside) {
        wordListInside.innerHTML = '';
        wordData.forEach(data => {
            const li = document.createElement('li');
            li.textContent = data.word;
            if (foundWords.has(data.word)) {
                li.classList.add('found');
            }
            wordListInside.appendChild(li);
        });
    }
}

// Buat efek bintang
function createStars() {
    const starsBg = document.getElementById('stars-bg');
    if (!starsBg) return;
    
    starsBg.innerHTML = '';
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 2 + 's';
        starsBg.appendChild(star);
    }
}

// Navigasi antar section
function showInstructions() {
    document.getElementById('intro-section').style.display = 'none';
    document.getElementById('instructions-section').style.display = 'block';
    
    // Animate instructions
    const instructions = document.querySelectorAll('.instruction-item');
    instructions.forEach((instruction, index) => {
        setTimeout(() => {
            instruction.classList.add('active');
        }, index * 300);
    });
}

function startGame() {
    document.getElementById('instructions-section').style.display = 'none';
    document.getElementById('game-section').style.display = 'block';
    initializeGame();
}



// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    createStars();
    
    // Tambahkan event listener untuk touch events (mobile)
    document.addEventListener('touchstart', function(e) {
        if (e.target.classList.contains('grid-cell')) {
            cellMouseDown(e);
        }
    });
    
    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
        if (e.target.classList.contains('grid-cell')) {
            cellMouseMove(e);
        }
    });
    
    document.addEventListener('touchend', function(e) {
        if (e.target.classList.contains('grid-cell')) {
            cellMouseUp(e);
        }
    });
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