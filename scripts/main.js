/**
 * File utama untuk inisialisasi game CyberSecurity Monopoly
 */

// Tambahkan styling tambahan untuk board-center
document.addEventListener('DOMContentLoaded', () => {
    // Tambahkan styling untuk board-center
    const style = document.createElement('style');
    style.textContent = `
        .game-board {
            position: relative;
        }
        
        .board-center {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 70%;
            height: 70%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 5;
            pointer-events: none;
            overflow: hidden;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(52, 152, 219, 0.9) 0%, rgba(44, 62, 80, 0.9) 100%);
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
            transition: opacity 0.5s ease, visibility 0.5s ease;
        }
        
        .center-content {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .center-logo {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 60%;
            height: auto;
            z-index: 10;
        }
        
        .center-title {
            color: white;
            font-size: 24px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            text-align: center;
            z-index: 15;
            position: relative;
        }
        
        .center-subtitle {
            color: #ecf0f1;
            font-size: 14px;
            font-style: italic;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
            text-align: center;
            margin-bottom: 15px;
            z-index: 15;
            position: relative;
        }
        
        .social-icons {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 15px;
            z-index: 15;
            position: relative;
        }
        
        .social-icon {
            font-size: 24px;
            color: white;
            filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.3));
        }
        
        .security-symbol {
            position: absolute;
            font-size: 120px;
            opacity: 0.1;
            color: white;
            z-index: 5;
        }
        
        .symbol-lock {
            top: 10%;
            left: 20%;
            transform: rotate(-15deg);
        }
        
        .symbol-shield {
            bottom: 10%;
            right: 20%;
            transform: rotate(15deg);
        }
        
        .cyber-circle {
            position: absolute;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.2);
            z-index: 4;
        }
        
        .circle-1 {
            width: 90%;
            height: 90%;
            top: 5%;
            left: 5%;
            animation: rotate 30s linear infinite;
        }
        
        .circle-2 {
            width: 70%;
            height: 70%;
            top: 15%;
            left: 15%;
            border-style: dashed;
            animation: rotate 20s linear infinite reverse;
        }
        
        .circle-3 {
            width: 40%;
            height: 40%;
            top: 30%;
            left: 30%;
            border-width: 1px;
            animation: rotate 15s linear infinite;
        }
        
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .digital-particle {
            position: absolute;
            background-color: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            z-index: 3;
            animation: float-random 5s ease-in-out infinite;
        }
        
        @keyframes float-random {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(10px, -10px); }
            50% { transform: translate(-5px, 5px); }
            75% { transform: translate(-10px, -5px); }
        }
        
        .binary-text {
            position: absolute;
            color: rgba(255, 255, 255, 0.1);
            font-family: monospace;
            font-size: 10px;
            z-index: 2;
            white-space: nowrap;
            overflow: hidden;
        }
        
        .security-tip {
            position: absolute;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 8px;
            font-size: 10px;
            color: white;
            max-width: 120px;
            text-align: center;
            z-index: 7;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            animation: fade-in-out 8s ease-in-out infinite;
        }
        
        @keyframes fade-in-out {
            0%, 100% { opacity: 0; }
            25%, 75% { opacity: 1; }
        }
        
        .glow-effect {
            position: absolute;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(52, 152, 219, 0.4) 0%, transparent 70%);
            animation: pulse 4s ease-in-out infinite;
            z-index: 1;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.7; }
        }
        
        .floating-badge {
            position: absolute;
            background-color: rgba(231, 76, 60, 0.9);
            color: white;
            font-size: 12px;
            font-weight: bold;
            padding: 5px 10px;
            border-radius: 15px;
            z-index: 8;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            animation: float 3s ease-in-out infinite;
        }
        
        @keyframes wave {
            0% { transform: translateX(0) translateY(0) rotate(0); }
            50% { transform: translateX(-25px) translateY(10px) rotate(1deg); }
            100% { transform: translateX(0) translateY(0) rotate(0); }
        }
        
        .floating {
            animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        /* Responsivitas untuk layar kecil */
        @media (max-width: 768px) {
            .center-title {
                font-size: 18px;
            }
            
            .center-subtitle {
                font-size: 12px;
            }
            
            .social-icons {
                gap: 10px;
            }
            
            .social-icon {
                font-size: 18px;
            }
            
            .security-symbol {
                font-size: 80px;
            }
        }
        
        /* Styling untuk dadu */
        .dice-container {
            display: flex;
            gap: 10px;
            margin: 10px 0;
        }
        
        .dice {
            width: 40px;
            height: 40px;
            background-color: white;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            font-weight: bold;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            color: var(--primary-color);
        }
        
        /* Animasi untuk dadu */
        @keyframes roll {
            0% { transform: rotateX(0deg) rotateY(0deg); }
            25% { transform: rotateX(180deg) rotateY(90deg); }
            50% { transform: rotateX(270deg) rotateY(180deg); }
            75% { transform: rotateX(180deg) rotateY(270deg); }
            100% { transform: rotateX(360deg) rotateY(360deg); }
        }
        
        .dice.rolling {
            animation: roll 0.5s linear;
        }
        
        /* Styling untuk kartu */
        .card-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            padding: 20px;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            z-index: 200;
            max-width: 300px;
            text-align: center;
        }
        
        .card-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 10px;
            color: var(--primary-color);
        }
        
        .card-description {
            margin-bottom: 15px;
        }
        
        .card-action {
            font-weight: 500;
            color: var(--secondary-color);
        }
        
        .card-close {
            margin-top: 15px;
            padding: 8px 15px;
            background-color: var(--secondary-color);
            color: white;
            border: none;
            border-radius: var(--border-radius);
            cursor: pointer;
        }
        
        /* Styling untuk properti modal */
        .property-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            padding: 20px;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            z-index: 200;
            max-width: 300px;
        }
        
        .property-header {
            height: 30px;
            margin: -20px -20px 15px -20px;
            border-radius: var(--border-radius) var(--border-radius) 0 0;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-weight: 600;
        }
        
        .property-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 5px;
            text-align: center;
        }
        
        .property-description {
            font-size: 14px;
            margin-bottom: 15px;
            text-align: center;
            color: #666;
        }
        
        .property-details {
            margin-bottom: 15px;
        }
        
        .property-detail {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        
        .property-actions {
            display: flex;
            gap: 10px;
            justify-content: center;
        }
        
        .property-buy, .property-cancel {
            padding: 8px 15px;
            border: none;
            border-radius: var(--border-radius);
            cursor: pointer;
        }
        
        .property-buy {
            background-color: var(--success-color);
            color: white;
        }
        
        .property-cancel {
            background-color: #ddd;
            color: #333;
        }
        
        /* Sembunyikan board-center saat kartu ditampilkan */
        .card-overlay.active ~ .board-center,
        .card-display-container.active ~ .board-center {
            opacity: 0.2;
            visibility: visible;
            z-index: 1;
        }
    `;
    document.head.appendChild(style);
    
    // Hapus elemen tengah papan jika ada
    const existingBoardCenter = document.querySelector('.board-center');
    if (existingBoardCenter) {
        existingBoardCenter.remove();
    }
    
    // Buat fungsi untuk membuat elemen tengah papan
    function createBoardCenter() {
        // Hapus elemen tengah papan jika ada
        const existingCenter = document.querySelector('.board-center');
        if (existingCenter) {
            existingCenter.remove();
        }
        
        // Buat elemen tengah papan baru
        const boardCenterElement = document.createElement('div');
        boardCenterElement.className = 'board-center';
        
        // Buat konten HTML untuk elemen tengah
        let centerHTML = `
            <div class="glow-effect"></div>
            
            <div class="cyber-circle circle-1"></div>
            <div class="cyber-circle circle-2"></div>
            <div class="cyber-circle circle-3"></div>
            
            <div class="security-symbol symbol-lock">🔒</div>
            <div class="security-symbol symbol-shield">🛡️</div>
        `;
        
        // Tambahkan partikel digital acak
        for (let i = 0; i < 15; i++) {
            const size = Math.random() * 4 + 2;
            const top = Math.random() * 90 + 5;
            const left = Math.random() * 90 + 5;
            const delay = Math.random() * 5;
            
            centerHTML += `
                <div class="digital-particle" style="
                    width: ${size}px;
                    height: ${size}px;
                    top: ${top}%;
                    left: ${left}%;
                    animation-delay: ${delay}s;
                "></div>
            `;
        }
        
        // Tambahkan teks biner acak
        for (let i = 0; i < 5; i++) {
            const top = Math.random() * 90 + 5;
            const left = Math.random() * 70 + 5;
            const rotate = Math.random() * 360;
            
            let binaryText = '';
            for (let j = 0; j < 20; j++) {
                binaryText += Math.round(Math.random());
            }
            
            centerHTML += `
                <div class="binary-text" style="
                    top: ${top}%;
                    left: ${left}%;
                    transform: rotate(${rotate}deg);
                ">${binaryText}</div>
            `;
        }
        
        // Tambahkan tips keamanan
        const securityTips = [
            "Gunakan password yang kuat dan unik",
            "Aktifkan autentikasi dua faktor",
            "Jangan membagikan informasi pribadi",
            "Perbarui software secara rutin"
        ];
        
        for (let i = 0; i < securityTips.length; i++) {
            const top = 20 + (i * 15);
            const left = i % 2 === 0 ? 15 : 65;
            const delay = i * 2;
            
            centerHTML += `
                <div class="security-tip" style="
                    top: ${top}%;
                    left: ${left}%;
                    animation-delay: ${delay}s;
                ">${securityTips[i]}</div>
            `;
        }
        
        // Tambahkan badge
        centerHTML += `
            <div class="floating-badge" style="top: 15%; right: 15%;">
                #CyberSafe
            </div>
        `;
        
        // Tambahkan konten utama
        centerHTML += `
            <div class="center-content">
                <div class="center-title floating">Social Safe</div>
                <div class="center-title floating" style="margin-top: -5px;"></div>
                <div class="center-subtitle">Edukasi Keamanan Siber Media Sosial</div>
            </div>
        `;
        
        boardCenterElement.innerHTML = centerHTML;
        
        // Tambahkan ke papan permainan
        const gameBoard = document.querySelector('.game-board');
        gameBoard.appendChild(boardCenterElement);
        
        return boardCenterElement;
    }
    
    // Buat elemen tengah papan saat halaman dimuat
    createBoardCenter();

    // --- Bintang malam dan bintang jatuh ---
    const starsContainer = document.querySelector('.stars');
    if (starsContainer) {
        // Tambah bintang statis dengan variasi warna dan animasi
        const starColors = ['star-yellow', 'star-blue', 'star-purple', 'star-white'];
        for (let i = 0; i < 80; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            // Pilih warna random
            const colorClass = starColors[Math.floor(Math.random() * starColors.length)];
            star.classList.add(colorClass);
            // 1/5 bintang blur
            if (Math.random() < 0.2) star.classList.add('blur');
            // Ukuran random
            const size = Math.random() * 2.2 + 1.2;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            // Posisi random
            star.style.top = Math.random() * 100 + 'vh';
            star.style.left = Math.random() * 100 + 'vw';
            // Opacity random
            star.style.opacity = (Math.random() * 0.5 + 0.5).toFixed(2);
            // Durasi animasi random
            star.style.animationDuration = (2 + Math.random() * 2.5).toFixed(2) + 's';
            // Delay animasi random
            star.style.animationDelay = (Math.random() * 2.5).toFixed(2) + 's';
            starsContainer.appendChild(star);
        }
        // Fungsi untuk membuat bintang jatuh
        function createShootingStar() {
            const shootingStar = document.createElement('div');
            shootingStar.className = 'shooting-star';
            shootingStar.style.top = Math.random() * 60 + 'vh';
            shootingStar.style.left = Math.random() * 80 + 'vw';
            shootingStar.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
            starsContainer.appendChild(shootingStar);
            setTimeout(() => {
                shootingStar.remove();
            }, 2500);
        }
        // Interval bintang jatuh
        setInterval(() => {
            if (Math.random() < 0.5) createShootingStar();
        }, 1200);
    }
    
    // Event listener untuk tombol Mulai Ulang - dihapus karena sudah dipindah ke popup menu
    // document.addEventListener('click', function(e) {
    //     if (e.target.id === 'restartGame' || e.target.classList.contains('restart-btn')) {
    //     }
    // });
    
    // Perbaiki fungsi untuk animasi pergerakan player
    window.movePlayerWithAnimation = function(startPosition, endPosition, steps, callback) {
        const player = document.querySelector('.player');
        if (!player) return;

        let currentStep = 0;
        const moveInterval = 300; // Kurangi interval waktu untuk pergerakan lebih cepat
        
        function moveStep() {
            if (currentStep >= steps) {
                if (callback) callback();
                return;
            }

            currentStep++;
            const newPosition = (startPosition + currentStep) % 40;
            const tile = document.querySelector(`[data-tile-id="${newPosition}"]`);
            
            if (tile) {
                const tileRect = tile.getBoundingClientRect();
                const playerRect = player.getBoundingClientRect();
                
                // Tambahkan efek bounce saat bergerak
                player.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    player.style.transform = 'scale(1)';
                }, 150);
                
                // Pindahkan player ke posisi baru
                player.style.left = `${tileRect.left + (tileRect.width - playerRect.width) / 2}px`;
                player.style.top = `${tileRect.top + (tileRect.height - playerRect.height) / 2}px`;
                
                // Tambahkan efek trail saat bergerak
                const trail = document.createElement('div');
                trail.className = 'player-trail';
                trail.style.left = player.style.left;
                trail.style.top = player.style.top;
                document.querySelector('.game-board').appendChild(trail);
                
                // Hapus trail setelah beberapa detik
                setTimeout(() => {
                    trail.remove();
                }, 1000);
            }

            setTimeout(moveStep, moveInterval);
        }

        moveStep();
    };

    // Modifikasi fungsi rollDiceWithAnimation
    window.rollDiceWithAnimation = function(callback) {
        // Buat container dadu jika belum ada
        let diceContainer = document.querySelector('.dice-container');
        if (!diceContainer) {
            diceContainer = document.createElement('div');
            diceContainer.className = 'dice-container';
            diceContainer.innerHTML = `
                <div class="dice" id="dice1">?</div>
            `;
            document.querySelector('.game-actions').prepend(diceContainer);
        }
        
        const dice1 = document.getElementById('dice1');
        
        // Tambahkan kelas rolling untuk animasi
        dice1.classList.add('rolling');
        dice1.textContent = '?';
        
        // Setelah animasi selesai, tampilkan hasil
        setTimeout(() => {
            dice1.classList.remove('rolling');
            
            // Lempar dadu
            const diceResult = ui.game.rollDice();
            dice1.textContent = diceResult.total;
            
            // Panggil callback dengan hasil dadu
            if (callback) {
                const player = ui.game.getPlayer();
                const startPosition = player.position;
                const endPosition = (startPosition + diceResult.total) % 40;
                
                // Mulai animasi pergerakan
                movePlayerWithAnimation(startPosition, endPosition, diceResult.total, () => {
                    // Setelah animasi selesai, proses giliran
                    const result = ui.game.processTurn(diceResult);

                });
            }
        }, 500);
    };
}); 