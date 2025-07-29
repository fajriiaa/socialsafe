/**
 * Kelas Player untuk mengelola data pemain
 */
class Player {
    constructor(id, name, color) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.position = 0;
        this.points = 200;
        this.properties = [];
        this.jailed = false; // Status di penjara
        this.jailTurns = 0; // Jumlah giliran di penjara
        this.jailFreeCards = 0; // Kartu bebas dari penjara
    }

    /**
     * Pindahkan pemain ke posisi baru
     */
    moveTo(position) {
        // Jika melewati Start, dapatkan 200 poin
        if (position < this.position && !this.jailed) {
            this.addPoints(200);
            return { passedStart: true };
        }
        this.position = position;
        return { passedStart: false };
    }

    /**
     * Pindahkan pemain beberapa langkah
     */
    move(steps) {
        if (this.jailed) return { passedStart: false };
        
        let newPosition = (this.position + steps) % 40;
        return this.moveTo(newPosition);
    }

    /**
     * Tambahkan poin keamanan
     */
    addPoints(amount) {
        this.points += amount;
        return this.points;
    }

    /**
     * Kurangi poin keamanan
     */
    deductPoints(amount) {
        this.points -= amount;
        return this.points;
    }

    /**
     * Tambahkan properti ke pemain
     */
    addProperty(propertyId) {
        this.properties.push(propertyId);
    }

    /**
     * Hapus properti dari pemain
     */
    removeProperty(propertyId) {
        this.properties = this.properties.filter(id => id !== propertyId);
    }

    /**
     * Masukkan pemain ke penjara
     */
    goToJail() {
        this.jailed = true;
        this.jailTurns = 3;
        this.position = 10; // ID untuk kotak Cyber Jail
    }

    /**
     * Keluarkan pemain dari penjara
     */
    getOutOfJail() {
        this.jailed = false;
        this.jailTurns = 0;
    }

    /**
     * Kurangi giliran di penjara
     */
    decreaseJailTurn() {
        if (this.jailed) {
            this.jailTurns--;
            if (this.jailTurns <= 0) {
                this.getOutOfJail();
                return true;
            }
        }
        return false;
    }
}

/**
 * Kelas Game untuk mengelola logika permainan
 */
class Game {
    constructor() {
        this.player = null;
        this.gameBoard = new GameBoard();
        this.gameStarted = false;
        this.ui = null; // Referensi ke UI
    }

    /**
     * Set referensi UI
     */
    setUI(ui) {
        this.ui = ui;
    }

    /**
     * Inisialisasi permainan
     */
    initialize(playerData) {
        // Reset game state
        this.gameStarted = false;

        // Inisialisasi papan permainan jika belum ada
        if (!this.gameBoard.isInitialized) {
            this.gameBoard.initialize();
            this.gameBoard.isInitialized = true;
        } else {
            // Hanya acak kartu jika papan sudah ada
            this.gameBoard.shuffleCards();
        }

        // Ambil nama dari karakter yang telah dikustomisasi
        const characterData = JSON.parse(localStorage.getItem('characterData')) || { nama: 'Pemain' };
        const playerName = characterData.nama || 'Pemain';

        // Buat pemain dengan nama dari karakter
        this.player = new Player(0, playerName, '#3498db');

        // Cek apakah ada progress tersimpan untuk dilanjutkan
        const savedProgress = localStorage.getItem('gameProgress');
        if (savedProgress) {
            try {
                const progress = JSON.parse(savedProgress);
                
                // Terapkan progress tersimpan ke pemain hanya jika data valid
                if (progress.position !== undefined && progress.position !== null) {
                    this.player.points = progress.poin || 200;
                    this.player.position = progress.position || 0;
                    
                    // Jika ada data waktu tersimpan, set timer
                    if (progress.waktu && this.ui && typeof this.ui.setElapsedTime === 'function') {
                        this.ui.setElapsedTime(progress.waktu);
                    }
                    
                    console.log('Progress dimuat dari database:', progress);
                } else {
                    // Jika data tidak valid, pastikan player dimulai dari posisi 0
                    this.player.points = 200;
                    this.player.position = 0;
                    console.log('Player diinisialisasi ke posisi 0 karena data tidak valid');
                }
                
                // Hapus data progress dari localStorage setelah dimuat
                localStorage.removeItem('gameProgress');
            } catch (error) {
                console.error('Error saat memuat progress:', error);
                // Pastikan player dimulai dari posisi 0 jika ada error
                this.player.points = 200;
                this.player.position = 0;
                console.log('Player diinisialisasi ke posisi 0 karena error');
            }
        } else {
            // Tidak ada progress tersimpan, pastikan player dimulai dari posisi 0
            this.player.points = 200;
            this.player.position = 0;
            console.log('Player diinisialisasi ke posisi 0 untuk user baru');
        }

        this.gameStarted = true;
    }

    /**
     * Dapatkan pemain
     */
    getPlayer() {
        return this.player;
    }

    /**
     * Lempar dadu
     */
    rollDice() {
        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        const total = dice1 + dice2;
        const isDouble = dice1 === dice2;
        
        return { dice1, dice2, total, isDouble };
    }

    /**
     * Proses giliran pemain
     */
    processTurn(diceResult) {
        // Jika pemain di penjara
        if (this.player.jailed) {
            // Jika dadu double, keluar dari penjara
            if (diceResult.isDouble) {
                this.player.getOutOfJail();
                return {
                    action: 'jail-exit',
                    message: `Anda keluar dari Cyber Jail dengan melempar dadu double!`
                };
            } 
            // Kurangi giliran di penjara
            const released = this.player.decreaseJailTurn();
            if (released) {
                return {
                    action: 'jail-exit',
                    message: `Anda keluar dari Cyber Jail setelah ${3} giliran!`
                };
            } else {
                return {
                    action: 'jail-stay',
                    message: `Anda masih di Cyber Jail. Sisa ${this.player.jailTurns} giliran.`
                };
            }
        }
        
        // Pindahkan pemain
        //const moveResult = this.player.move(diceResult.total);
        // KODE SEMENTARA UNTUK PENGUJIAN - HARUS 1 LANGKAH
        const moveResult = this.player.move(1);
        // Dapatkan tile yang ditempati pemain
        const currentTile = this.gameBoard.getTileById(this.player.position);
        
        // Proses aksi berdasarkan jenis tile
        return this.processTileAction(this.player, currentTile, moveResult);
    }

    /**
     * Proses aksi berdasarkan jenis tile
     */
    processTileAction(player, tile, moveResult) {
        let result = {
            action: 'move',
            message: `Anda pindah ke ${tile.name}.`
        };
        
        // Jika melewati Start
        if (moveResult.passedStart) {
            result.message += ` Melewati START, mendapatkan 200 poin keamanan.`;
        }
        
        // Proses berdasarkan jenis tile
        switch (tile.type) {
            case 'corner':
                if (tile.id === 30) {
                    result.action = 'show-info-then-move';
                    result.targetTile = 10;
                    result.moveDirection = 'backward';
                    // Tidak langsung pindah, biarkan UI yang memproses setelah klik OK
                }
                else if (tile.action === 'goto-jail') {
                    player.goToJail();
                    result.action = 'goto-jail';
                    result.message = `Anda terdeteksi melakukan aktivitas mencurigakan! Dipindahkan ke Cyber Jail.`;
                }
                // Tampilkan Cyber Investigation jika mendarat di kotak 10
                else if (tile.id === 10) {
                    result.action = 'play-game';
                    result.message += ` Anda akan menjalani Cyber Investigation!`;
                }
                break;
                
            case 'tax':
                player.deductPoints(tile.value);
                result.action = 'pay-tax';
                result.message += ` Membayar ${tile.value} poin keamanan untuk ${tile.name}.`;
                break;
                
            case 'card':
                let card;
                if (tile.cardType === 'cyber-chance') {
                    card = this.gameBoard.drawChanceCard();
                    result.cardType = 'action';
                } else if (tile.cardType === 'cyber-event') {
                    card = this.gameBoard.drawEventCard();
                    result.cardType = 'event';
                }
                
                result.action = 'draw-card';
                result.card = card;
                break;

            case 'property':
                if (tile.id === 6) {
                    result.action = 'play-game';
                    result.message += ` Anda akan memainkan mini game di kotak 6!`;
                }
                // Kotak 1 - menampilkan frame device
                else if (tile.id === 1) {
                    result.action = 'play-game';
                    result.message += ` Anda akan memainkan game di kotak 1!`;
                }
                // Kotak 3 - menampilkan frame device quiz
                else if (tile.id === 3) {
                    result.action = 'play-game';
                    result.message += ` Anda akan memainkan game di kotak 3!`;
                }
                // Kotak 4 - menampilkan frame device quiz
                else if (tile.id === 4) {
                    result.action = 'play-game';
                    result.message += ` Anda akan memainkan game di kotak 4!`;
                }
                // Kotak 11 - menampilkan frame device quiz
                else if (tile.id === 11) {
                    result.action = 'play-game';
                    result.message += ` Anda akan memainkan game di kotak 11!`;
                }
                // Kotak 13 - menampilkan frame device quiz
                else if (tile.id === 13) {
                    result.action = 'play-game';
                    result.message += ` Anda akan memainkan game di kotak 13!`;
                }
                // Kotak 14 - menampilkan frame device quiz
                else if (tile.id === 14) {
                    result.action = 'play-game';
                    result.message += ` Anda akan memainkan game di kotak 14!`;
                }
                // Kotak 16 - menampilkan frame device quiz
                else if (tile.id === 16) {
                    result.action = 'play-game';
                    result.message += ` Anda akan memainkan game di kotak 16!`;
                }
                // Kotak 18 - menampilkan frame device quiz
                else if (tile.id === 18) {
                    result.action = 'play-game';
                    result.message += ` Anda akan memainkan game di kotak 18!`;
                }
                // Kotak 19 - menampilkan frame device quiz
                else if (tile.id === 19) {
                    result.action = 'play-game';
                    result.message += ` Anda akan memainkan game di kotak 19!`;
                }
                // Kotak 21 - menampilkan frame device quiz
                else if (tile.id === 21) {
                    result.action = 'play-game';
                    result.message += ` Anda akan memainkan game di kotak 21!`;
                }
                // Kotak 23 - menampilkan frame device quiz
                else if (tile.id === 23) {
                    result.action = 'play-game';
                    result.message += ` Anda akan memainkan game di kotak 23!`;
                }
                // Kotak 24 - menampilkan frame device quiz
                else if (tile.id === 24) {
                    result.action = 'play-game';
                    result.message += ` Anda akan memainkan game di kotak 24!`;
                }
                // Kotak 26 - menampilkan frame device quiz
                else if (tile.id === 26) {
                    result.action = 'play-game';
                    result.message += ` Anda akan memainkan game di kotak 26!`;
                }
                // Kotak 27 - menampilkan frame device quiz
                else if (tile.id === 27) {
                    result.action = 'play-game';
                    result.message += ` Anda akan memainkan game di kotak 27!`;
                }
                // Kotak 29 - menampilkan frame device quiz
                else if (tile.id === 29) {
                    result.action = 'play-game';
                    result.message += ` Anda akan memainkan game di kotak 29!`;
                }
                // Kotak 31 - menampilkan frame device quiz
                else if (tile.id === 31) {
                    result.action = 'play-game';
                    result.message += ` Anda akan memainkan game di kotak 31!`;
                }
                // Kotak 34 - menampilkan frame device quiz
                else if (tile.id === 34) {
                    result.action = 'play-game';
                    result.message += ` Anda akan memainkan game di kotak 34!`;
                }
                // Kotak 8 - tidak ada minigame
                else if (tile.id === 8) {
                    result.action = 'play-game';
                    result.message += ` Anda berada di kotak ${tile.name}.`;
                }
                // Kotak 9 - tidak ada minigame
                else if (tile.id === 9) {
                    result.action = 'play-game';
                    result.message += ` Anda berada di kotak ${tile.name}.`;
                }
                // Jika mendarat di kotak no 32 (Investigasi Data Pribadi)
                else if (tile.id === 32) {
                    result.action = 'play-game';
                    result.message += ` Anda akan memainkan game di kotak 32!`;
                }
                // Kotak 34 - tidak ada minigame
                else if (tile.id === 34) {
                    result.action = 'none';
                    result.message += ` Anda berada di kotak ${tile.name}.`;
                }
                // Jika mendarat di kotak no 37 (Investigasi UU ITE)
                else if (tile.id === 37) {
                    result.action = 'play-game';
                    result.message += ` Anda akan memainkan game di kotak 37!`;
                }
                // Jika mendarat di kotak 39 (Game Completion)
                else if (tile.id === 39) {
                    result.action = 'game-completion';
                    result.message += ` Selamat! Anda telah menyelesaikan perjalanan keamanan siber!`;
                    // this.showGameCompletion(); // Dihapus, biar hanya UI yang handle
                }
                // Kotak 6 - menampilkan frame device quiz
                else if (tile.id === 6) {
                    result.action = 'play-game';
                    result.message += ` Anda akan memainkan game di kotak 6!`;
                }
                break;
            case 'station':
                if (tile.id === 5) {
                    result.action = 'play-game';
                    result.message += ` Anda akan melihat Funfact Keamanan Media Sosial!`;
                }
                else if (tile.id === 15) {
                    result.action = 'play-game';
                    result.message += ` Anda akan memainkan game di kotak 15!`;
                }
                else if (tile.id === 25) {
                    result.action = 'play-game';
                    result.message += ` Anda akan memainkan game di kotak 25!`;
                }
                else if (tile.id === 35) {
                    result.action = 'play-game';
                    result.message += ` Anda akan memainkan game di kotak 35!`;
                }
                else if (tile.id === 12) {
                    result.action = 'play-game';
                    result.message += ` Anda akan melihat Funfact Ancaman Siber 1!`;
                }
                else if (tile.id === 28) {
                    result.action = 'play-game';
                    result.message += ` Anda akan melihat Funfact Ancaman Siber 2!`;
                }
                else if (tile.id === 38) {
                    result.action = 'play-game';
                    result.message += ` Anda akan melihat Funfact Ancaman Siber 3!`;
                }
                break;
        }
        
        return result;
    }

    /**
     * Proses aksi kartu
     */
    processCardAction(player, card) {
        let result = {
            message: ''
        };
        
        switch (card.action) {
            case 'collect':
                player.addPoints(card.value);
                result.message = `Mendapatkan ${card.value} poin keamanan.`;
                break;
                
            case 'pay':
                player.deductPoints(card.value);
                result.message = `Membayar ${card.value} poin keamanan.`;
                break;
                
            case 'move':
                const moveResult = player.move(card.value);
                const newTile = this.gameBoard.getTileById(player.position);
                result.message = `Pindah ${card.value > 0 ? 'maju' : 'mundur'} ${Math.abs(card.value)} langkah ke ${newTile.name}.`;
                if (moveResult.passedStart && card.value > 0) {
                    result.message += ` Melewati START, mendapatkan 200 poin keamanan.`;
                }
                break;
                
            case 'goto-jail':
                player.goToJail();
                result.message = `Dipindahkan ke Cyber Jail.`;
                break;
                
            case 'jail-free':
                player.jailFreeCards++;
                result.message = `Mendapatkan kartu bebas dari Cyber Jail.`;
                break;
                
            case 'goto':
                player.moveTo(0); // Pindah ke Start
                player.addPoints(200); // Dapatkan 200 poin
                result.message = `Pindah ke START dan mendapatkan 200 poin keamanan.`;
                break;
        }
        
        return result;
    }

    /**
     * Beli properti
     */
    buyProperty(playerId, propertyId) {
        const property = this.gameBoard.getTileById(propertyId);
        
        if (!property) return false;
        if (property.type !== 'property' && property.type !== 'station' && property.type !== 'utility') return false;
        
        // Cek apakah pemain punya cukup poin
        if (this.player.points < property.price) return false;
        
        // Kurangi poin dan tambahkan properti
        this.player.deductPoints(property.price);
        this.player.addProperty(propertyId);
        
        return true;
    }

    /**
     * Dapatkan pemilik properti
     */
    getPropertyOwner(propertyId) {
        if (this.player.properties.includes(propertyId)) {
            return this.player;
        }
        return null;
    }

    /**
     * Memainkan game dari kotak 5 (Funfact Keamanan Media Sosial)
     */
    playGameFromBox5(customMessage) {
        // Mencegah scrolling pada body
        document.body.style.overflow = 'hidden';
        // Buat overlay untuk fun fact
        const overlay = document.createElement('div');
        overlay.className = 'funfact-overlay';
        overlay.innerHTML = `
            <div class="cube-container">
                <div class="cube">
                    <div class="cube-face front">
                        <span>Cyberpedia</span>
                    </div>
                    <div class="cube-face back"></div>
                    <div class="cube-face right"></div>
                    <div class="cube-face left"></div>
                    <div class="cube-face top"></div>
                    <div class="cube-face bottom"></div>
                </div>
            </div>
            <div class="overlay" style="display: none;">
                <div class="funfact-container">
                    <div class="funfact-card">
                        <!--<div class="close-button">×</div>-->
                        <h2>Cyberpedia</h2>
                        <div class="funfact-content">
                            <p id="funfact-text">${customMessage || 'Tahukah kamu bahwa lebih dari 60% pengguna media sosial tidak pernah mengubah pengaturan privasi mereka?'}</p>
                        </div>
                        <div class="funfact-footer">
                            <button class="continue-button">
                                Lanjutkan
                                <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Style untuk overlay dan kubus
        const style = document.createElement('style');
        style.textContent = `
            .funfact-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(30, 41, 59, 0.7);
                backdrop-filter: blur(3px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }

            /* Kubus 3D */
            .cube-container {
                perspective: 1200px;
                width: 200px;
                height: 200px;
                cursor: pointer;
                position: relative;
            }

            .cube {
                width: 100%;
                height: 100%;
                position: relative;
                transform-style: preserve-3d;
                animation: float 4s ease-in-out infinite;
                transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .cube-face {
                position: absolute;
                width: 200px;
                height: 200px;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.2);
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 80px;
                color: #fff;
                text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
                backdrop-filter: blur(5px);
                transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
                transform-origin: center;
            }

            .cube-face span {
                animation: pulse 2s ease-in-out infinite;
                transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                text-shadow: 0 0 30px rgba(255, 255, 255, 0.8);
            }

            .cube-face.front span {
                font-size: 1.2rem;
                letter-spacing: 1px;
                font-weight: 600;
            }

            .front  { transform: translateZ(100px); }
            .back   { transform: rotateY(180deg) translateZ(100px); }
            .right  { transform: rotateY(90deg) translateZ(100px); }
            .left   { transform: rotateY(-90deg) translateZ(100px); }
            .top    { transform: rotateX(90deg) translateZ(100px); }
            .bottom { transform: rotateX(-90deg) translateZ(100px); }

            /* Overlay */
            .overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                backdrop-filter: blur(0px);
                opacity: 0;
                visibility: hidden;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .overlay.active {
                background: rgba(0, 0, 0, 0.75);
                backdrop-filter: blur(4px);
                opacity: 1;
                visibility: visible;
            }

            .funfact-container {
                width: 100%;
                max-width: 380px;
                padding: 15px;
                transform: scale(0) translateY(20px);
                opacity: 0;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
            }

            .overlay.active .funfact-container {
                transform: scale(1) translateY(0);
                opacity: 1;
            }

            .funfact-card {
                background: rgba(255, 255, 255, 0.98);
                border-radius: 16px;
                padding: 25px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2),
                            0 0 0 1px rgba(255, 255, 255, 0.1);
                text-align: center;
                position: relative;
                overflow: hidden;
                transform: translateY(0);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .funfact-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(45deg, 
                    transparent, 
                    rgba(255, 255, 255, 0.2), 
                    transparent);
                transform: translateX(-100%);
                transition: 0.5s;
            }

            .funfact-card:hover::before {
                transform: translateX(100%);
            }

            .close-button {
                position: absolute;
                top: 12px;
                right: 12px;
                width: 28px;
                height: 28px;
                background: rgba(0, 0, 0, 0.05);
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                font-size: 18px;
                color: #333;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 2;
                border: 1px solid rgba(0, 0, 0, 0.1);
            }

            .close-button:hover {
                background: rgba(0, 0, 0, 0.1);
                transform: rotate(90deg);
                border-color: rgba(0, 0, 0, 0.2);
            }

            h2 {
                color: #2d3748;
                margin-bottom: 15px;
                font-size: 22px;
                font-weight: 600;
                transform: translateY(0);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                letter-spacing: 0.5px;
            }

            h2::after {
                content: '';
                position: absolute;
                bottom: -4px;
                left: 50%;
                transform: translateX(-50%);
                width: 40px;
                height: 2px;
                background: linear-gradient(90deg, #302b63, #24243e);
                border-radius: 2px;
            }

            .funfact-content {
                background: rgba(48, 43, 99, 0.03);
                padding: 20px;
                border-radius: 12px;
                margin-top: 15px;
                transform: translateY(0);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
                border: 1px solid rgba(48, 43, 99, 0.1);
            }

            #funfact-text {
                font-size: 15px;
                line-height: 1.6;
                color: #4a5568;
                position: relative;
                z-index: 1;
                letter-spacing: 0.3px;
            }

            /* Animasi */
            @keyframes float {
                0%, 100% { 
                    transform: translateY(0) rotateX(0) rotateY(0);
                    box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
                }
                50% { 
                    transform: translateY(-20px) rotateX(10deg) rotateY(10deg);
                    box-shadow: 0 0 40px rgba(255, 255, 255, 0.2);
                }
            }

            @keyframes pulse {
                0%, 100% { 
                    transform: scale(1);
                    opacity: 1;
                    text-shadow: 0 0 30px rgba(255, 255, 255, 0.8);
                }
                50% { 
                    transform: scale(1.1);
                    opacity: 0.8;
                    text-shadow: 0 0 50px rgba(255, 255, 255, 1);
                }
            }

            /* Efek hover pada kubus */
            .cube-container:hover .cube {
                animation: none;
                transform: scale(1.05) rotateX(10deg) rotateY(10deg);
                transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }

            .cube-container:hover .cube-face {
                background: rgba(255, 255, 255, 0.15);
                border-color: rgba(255, 255, 255, 0.3);
                box-shadow: 0 0 30px rgba(255, 255, 255, 0.15);
                transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }

            /* Animasi saat kubus diklik */
            .cube-container.clicked .cube {
                animation: none;
                transform: scale(1.05);
                transition: transform 1.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }

            .cube-container.clicked .front {
                transform: translateZ(100px) translateY(-120px) rotateX(-20deg);
                transition: all 1.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                transition-delay: 0.1s;
            }

            .cube-container.clicked .back {
                transform: rotateY(180deg) translateZ(100px) translateY(120px) rotateX(20deg);
                transition: all 1.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                transition-delay: 0.1s;
            }

            .cube-container.clicked .right {
                transform: rotateY(90deg) translateZ(100px) translateX(120px) rotateY(-20deg);
                transition: all 1.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                transition-delay: 0.2s;
            }

            .cube-container.clicked .left {
                transform: rotateY(-90deg) translateZ(100px) translateX(-120px) rotateY(20deg);
                transition: all 1.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                transition-delay: 0.2s;
            }

            .cube-container.clicked .top {
                transform: rotateX(90deg) translateZ(100px) translateY(-120px) rotateX(-20deg);
                transition: all 1.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                transition-delay: 0.3s;
            }

            .cube-container.clicked .bottom {
                transform: rotateX(-90deg) translateZ(100px) translateY(120px) rotateX(20deg);
                transition: all 1.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                transition-delay: 0.3s;
            }

            .funfact-footer {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid rgba(48, 43, 99, 0.1);
            }

            .continue-button {
                width: 100%;
                padding: 12px 24px;
                background: linear-gradient(135deg, #302b63 0%, #24243e 100%);
                border: none;
                border-radius: 8px;
                color: white;
                font-size: 16px;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            }

            .continue-button::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(45deg, 
                    transparent, 
                    rgba(255, 255, 255, 0.2), 
                    transparent);
                transform: translateX(-100%);
                transition: 0.5s;
            }

            .continue-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(48, 43, 99, 0.3);
            }

            .continue-button:hover::before {
                transform: translateX(100%);
            }

            .continue-button i {
                transition: transform 0.3s ease;
            }

            .continue-button:hover i {
                transform: translateX(4px);
            }

            @media (max-width: 600px) {
                .continue-button {
                    padding: 10px 20px;
                    font-size: 14px;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(overlay);

        // Event listeners
        const cubeContainer = overlay.querySelector('.cube-container');
        const funfactOverlay = overlay.querySelector('.overlay');
        const closeButton = overlay.querySelector('.close-button');
        const continueButton = overlay.querySelector('.continue-button');
        let isAnimating = false;

        cubeContainer.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;

            // Tambahkan class untuk animasi kubus
            cubeContainer.classList.add('clicked');
            
            // Tunggu animasi kubus terbuka selesai
            setTimeout(() => {
                // Tampilkan overlay dengan efek
                funfactOverlay.style.display = 'flex';
                setTimeout(() => {
                    funfactOverlay.classList.add('active');
                }, 50);
                
                // Reset animasi kubus
                setTimeout(() => {
                    cubeContainer.classList.remove('clicked');
                    isAnimating = false;
                }, 500);
            }, 1000);
        });

        function closeOverlay() {
            if (isAnimating) return;
            isAnimating = true;

            // Animasi keluar
            const funfactContainer = overlay.querySelector('.funfact-container');
            funfactContainer.style.transform = 'scale(0) translateY(20px)';
            funfactContainer.style.opacity = '0';
            
            setTimeout(() => {
                funfactOverlay.classList.remove('active');
                
                // Reset animasi
                setTimeout(() => {
                    funfactOverlay.style.display = 'none';
                    funfactContainer.style.transform = 'scale(0) translateY(20px)';
                    funfactContainer.style.opacity = '0';
                    isAnimating = false;
                    
                    // Hapus overlay dan style
                    overlay.remove();
                    style.remove();
                    // Kembalikan scrolling
                    document.body.style.overflow = '';
                }, 300);
            }, 300);
        }

        // Event untuk tombol continue
        continueButton.addEventListener('click', () => {
            closeOverlay();
            this.player.addPoints(25);
            this.updatePlayerPoints();
            showMissionSuccess({
                title: "Congratulations!",
                desc: "Kamu dapet insight menarik hari ini. Jangan remehkan info kecil yang bisa selamatkan akunmu!",
                points: 25
            });
        });
    }

    /**
     * Memainkan game dari kotak 4 (Frame Device)
     */
    playGameFromBox4() {
        // Mencegah scrolling pada body
        document.body.style.overflow = 'hidden';
        
        // Buat overlay untuk frame device
        const overlay = document.createElement('div');
        overlay.className = 'device-overlay';
        overlay.innerHTML = `
            <iframe src="Kotak/4/index.html" class="device-iframe" allowfullscreen></iframe>
        `;
        // Style overlay dan device frame - overlay blur agar fokus ke device + animasi pop-in
        const style = document.createElement('style');
        style.textContent = `
            .device-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: rgba(30,41,59,0.25);
                backdrop-filter: blur(6px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .device-overlay.closing {
                opacity: 0;
                background: rgba(30,41,59,0);
                backdrop-filter: blur(0px);
            }
            .device-iframe {
                border: none;
                background: transparent;
                width: 800px;
                height: 520px;
                margin: 0;
                padding: 0;
                display: block;
                overflow: hidden;
                animation: devicePopIn 0.6s cubic-bezier(0.4,0,0.2,1);
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .device-overlay.closing .device-iframe {
                transform: scale(0.8);
                opacity: 0;
            }
            @keyframes devicePopIn {
                0% {
                    opacity: 0;
                    transform: scale(0.7);
                }
                80% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        // Fungsi untuk menutup overlay dengan animasi smooth
        const closeOverlayWithAnimation = () => {
            overlay.classList.add('closing');
            setTimeout(() => {
                const overlayEl = document.querySelector('.device-overlay');
                const styleEl = [...document.head.querySelectorAll('style')].find(s => s.textContent.includes('.device-overlay'));
                if (overlayEl) overlayEl.remove();
                if (styleEl) styleEl.remove();
                document.body.style.overflow = '';
            }, 600);
        };
        // Event listener untuk pesan dari iframe (game selesai)
        const messageHandler = (event) => {
            if (event.data.type === 'gameCompleted') {
                const points = event.data.points !== undefined ? event.data.points : 20;
                this.player.addPoints(points);
                showMissionSuccess({
                    title: "Congratulations!",
                    desc: "Keren! Kamu berhasil selesaikan simulasi 2FA.",
                    points: points
                });
                this.updatePlayerPoints();
                // Tutup overlay dengan animasi smooth
                closeOverlayWithAnimation();
                // Hapus event listener
                window.removeEventListener('message', messageHandler);
            }
        };
        window.addEventListener('message', messageHandler);
    }

    /**
     * Memainkan game dari kotak 11 (Frame Device)
     */
    playGameFromBox11() {
        document.body.style.overflow = 'hidden';
        const overlay = document.createElement('div');
        overlay.className = 'device-overlay';
        overlay.innerHTML = `
            <iframe src="Kotak/11/index.html" class="device-iframe" allowfullscreen></iframe>
        `;
        const style = document.createElement('style');
        style.textContent = `
            .device-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: rgba(30,41,59,0.25);
                backdrop-filter: blur(6px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .device-overlay.closing {
                opacity: 0;
                background: rgba(30,41,59,0);
                backdrop-filter: blur(0px);
            }
            .device-iframe {
                border: none;
                background: transparent;
                width: 800px;
                height: 520px;
                margin: 0;
                padding: 0;
                display: block;
                overflow: hidden;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                animation: devicePopIn 0.6s cubic-bezier(0.4,0,0.2,1);
            }
            .device-overlay.closing .device-iframe {
                transform: scale(0.8);
                opacity: 0;
            }
            @keyframes devicePopIn {
                0% {
                    opacity: 0;
                    transform: scale(0.7);
                }
                80% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        const closeOverlayWithAnimation = () => {
            overlay.classList.add('closing');
            setTimeout(() => {
                const overlayEl = document.querySelector('.device-overlay');
                const styleEl = [...document.head.querySelectorAll('style')].find(s => s.textContent.includes('.device-overlay'));
                if (overlayEl) overlayEl.remove();
                if (styleEl) styleEl.remove();
                document.body.style.overflow = '';
            }, 600);
        };
        const messageHandler = (event) => {
            if (event.data.type === 'gameCompleted') {
                const points = event.data.points !== undefined ? event.data.points : 20;
                this.player.addPoints(points);
                this.updatePlayerPoints();
                window.removeEventListener('message', messageHandler);
                // Tutup overlay dulu, baru tampilkan pesan sukses
                closeOverlayWithAnimation();
                setTimeout(() => {
                    showMissionSuccess({
                        title: "Hebat!",
                        desc: "Kamu berhasil bedain akun asli dan palsu",
                        points: points
                    });
                }, 600);
            }
        };
        window.addEventListener('message', messageHandler);
    }

    /**
     * Memainkan game dari kotak 13 (Frame Device)
     */
    playGameFromBox13() {
        document.body.style.overflow = 'hidden';
        const overlay = document.createElement('div');
        overlay.className = 'device-overlay';
        overlay.innerHTML = `
            <iframe src="Kotak/13/index.html" class="device-iframe" allowfullscreen></iframe>
        `;
        const style = document.createElement('style');
        style.textContent = `
            .device-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: rgba(30,41,59,0.25);
                backdrop-filter: blur(6px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .device-overlay.closing {
                opacity: 0;
                background: rgba(30,41,59,0);
                backdrop-filter: blur(0px);
            }
            .device-iframe {
                border: none;
                background: transparent;
                width: 800px;
                height: 520px;
                margin: 0;
                padding: 0;
                display: block;
                overflow: hidden;
                transition: all 0.6s cubic-bezier(0.4,0,0.2,1);
                animation: devicePopIn 0.6s cubic-bezier(0.4,0,0.2,1);
            }
            .device-overlay.closing .device-iframe {
                transform: scale(0.8);
                opacity: 0;
            }
            @keyframes devicePopIn {
                0% {
                    opacity: 0;
                    transform: scale(0.7);
                }
                80% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        const closeOverlayWithAnimation = () => {
            overlay.classList.add('closing');
            setTimeout(() => {
                const overlayEl = document.querySelector('.device-overlay');
                const styleEl = [...document.head.querySelectorAll('style')].find(s => s.textContent.includes('.device-overlay'));
                if (overlayEl) overlayEl.remove();
                if (styleEl) styleEl.remove();
                document.body.style.overflow = '';
            }, 600);
        };
        const messageHandler = (event) => {
            if (event.data.type === 'gameCompleted') {
                const points = event.data.points !== undefined ? event.data.points : 20;
                this.player.addPoints(points);
                this.updatePlayerPoints();
                window.removeEventListener('message', messageHandler);
                // Tutup overlay dulu, baru tampilkan pesan sukses
                closeOverlayWithAnimation();
                setTimeout(() => {
                    showMissionSuccess({
                        title: "Good job!",
                        desc: "Kamu nggak tinggal diam saat lihat akun mencurigakan",
                        points: points
                    });
                }, 600);
            }
        };
        window.addEventListener('message', messageHandler);
    }

    /**
     * Memainkan game dari kotak 14 (Frame Device)
     */
    playGameFromBox14() {
        document.body.style.overflow = 'hidden';
        const overlay = document.createElement('div');
        overlay.className = 'device-overlay';
        overlay.innerHTML = `
            <iframe src="Kotak/14/index.html" class="device-iframe" allowfullscreen></iframe>
        `;
        const style = document.createElement('style');
        style.textContent = `
            .device-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: rgba(30,41,59,0.25);
                backdrop-filter: blur(6px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .device-overlay.closing {
                opacity: 0;
                background: rgba(30,41,59,0);
                backdrop-filter: blur(0px);
            }
            .device-iframe {
                border: none;
                background: transparent;
                width: 800px;
                height: 520px;
                margin: 0;
                padding: 0;
                display: block;
                overflow: hidden;
                transition: all 0.6s cubic-bezier(0.4,0,0.2,1);
                animation: devicePopIn 0.6s cubic-bezier(0.4,0,0.2,1);
            }
            .device-overlay.closing .device-iframe {
                transform: scale(0.8);
                opacity: 0;
            }
            @keyframes devicePopIn {
                0% {
                    opacity: 0;
                    transform: scale(0.7);
                }
                80% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        const closeOverlayWithAnimation = () => {
            overlay.classList.add('closing');
            setTimeout(() => {
                const overlayEl = document.querySelector('.device-overlay');
                const styleEl = [...document.head.querySelectorAll('style')].find(s => s.textContent.includes('.device-overlay'));
                if (overlayEl) overlayEl.remove();
                if (styleEl) styleEl.remove();
                document.body.style.overflow = '';
            }, 600);
        };
        const messageHandler = (event) => {
            if (event.data.type === 'gameCompleted') {
                // Kurangi poin 100
                this.player.deductPoints(100);
                this.updatePlayerPoints();
                window.removeEventListener('message', messageHandler);
                // Tutup overlay dulu, baru tampilkan popup perhatian
                closeOverlayWithAnimation();
                setTimeout(() => {
                    showMissionSuccess({
                        title: "Perhatian!",
                        desc: "Kamu tertipu akun palsu dan mengirimkan kredensial! Anda harus mundur ke Kotak 11.",
                        points: -100,
                        onClose: () => {
                            // Setelah popup ditutup, pion bergerak mundur satu per satu ke kotak 11, lalu tampilkan minigame kotak 11
                            if (this.ui) {
                                this.ui.animateMoveBackward(14, 11, () => {
                                    this.ui.showTileInfo(11, {
                                        action: 'play-game',
                                        afterTileInfo: () => {
                                            this.ui.showMinigameNotification(() => {
                                                this.playGameFromBox11();
                                            });
                                        }
                                    });
                                });
                            } else {
                                this.movePlayerToTile(this.player.id, 11);
                                this.playGameFromBox11();
                            }
                        }
                    });
                }, 600);
            }
        };
        window.addEventListener('message', messageHandler);
    }

    /**
     * Memainkan game dari kotak 16 (Frame Device)
     */
    playGameFromBox16() {
        // Mencegah scrolling pada body
        document.body.style.overflow = 'hidden';
        
        // Buat overlay untuk frame device
        const overlay = document.createElement('div');
        overlay.className = 'device-overlay';
        overlay.innerHTML = `
            <iframe src="Kotak/16/index.html" class="device-iframe" allowfullscreen></iframe>
        `;
        // Style overlay dan device frame - overlay blur agar fokus ke device + animasi pop-in
        const style = document.createElement('style');
        style.textContent = `
            .device-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: rgba(30,41,59,0.25);
                backdrop-filter: blur(6px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .device-overlay.closing {
                opacity: 0;
                background: rgba(30,41,59,0);
                backdrop-filter: blur(0px);
            }
            .device-iframe {
                border: none;
                background: transparent;
                width: 800px;
                height: 520px;
                margin: 0;
                padding: 0;
                display: block;
                overflow: hidden;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                animation: devicePopIn 0.6s cubic-bezier(0.4,0,0.2,1);
            }
            .device-overlay.closing .device-iframe {
                transform: scale(0.8);
                opacity: 0;
            }
            @keyframes devicePopIn {
                0% {
                    opacity: 0;
                    transform: scale(0.7);
                }
                80% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        
        // Fungsi untuk menutup overlay dengan animasi smooth
        const closeOverlayWithAnimation = () => {
            overlay.classList.add('closing');
            setTimeout(() => {
                const overlayEl = document.querySelector('.device-overlay');
                const styleEl = [...document.head.querySelectorAll('style')].find(s => s.textContent.includes('.device-overlay'));
                if (overlayEl) overlayEl.remove();
                if (styleEl) styleEl.remove();
                document.body.style.overflow = '';
            }, 600);
        };
        
        // Event listener untuk pesan dari iframe (game selesai)
        const messageHandler = (event) => {
            if (event.data.type === 'gameCompleted') {
                const points = event.data.points !== undefined ? event.data.points : 20;
                this.player.addPoints(points);
                this.updatePlayerPoints();
                window.removeEventListener('message', messageHandler);
                // Tutup overlay dulu, baru tampilkan pesan sukses
                closeOverlayWithAnimation();
                setTimeout(() => {
                    showMissionSuccess({
                        title: "Well done!",
                        desc: "Akun aman dimulai dari privasi yang terjaga",
                        points: points
                    });
                }, 600);
            }
        };
        window.addEventListener('message', messageHandler);
    }

    /**
     * Memainkan game dari kotak 18 (Frame Device)
     */
    playGameFromBox18() {
        // Mencegah scrolling pada body
        document.body.style.overflow = 'hidden';
        
        // Buat overlay untuk frame device
        const overlay = document.createElement('div');
        overlay.className = 'device-overlay';
        overlay.innerHTML = `
            <iframe src="Kotak/18/index.html" class="device-iframe" allowfullscreen></iframe>
        `;
        // Style overlay dan device frame - overlay blur agar fokus ke device + animasi pop-in
        const style = document.createElement('style');
        style.textContent = `
            .device-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: rgba(30,41,59,0.25);
                backdrop-filter: blur(6px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .device-overlay.closing {
                opacity: 0;
                background: rgba(30,41,59,0);
                backdrop-filter: blur(0px);
            }
            .device-iframe {
                border: none;
                background: transparent;
                width: 800px;
                height: 520px;
                margin: 0;
                padding: 0;
                display: block;
                overflow: hidden;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                animation: devicePopIn 0.6s cubic-bezier(0.4,0,0.2,1);
            }
            .device-overlay.closing .device-iframe {
                transform: scale(0.8);
                opacity: 0;
            }
            @keyframes devicePopIn {
                0% {
                    opacity: 0;
                    transform: scale(0.7);
                }
                80% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        
        // Fungsi untuk menutup overlay dengan animasi smooth
        const closeOverlayWithAnimation = () => {
            overlay.classList.add('closing');
            setTimeout(() => {
                const overlayEl = document.querySelector('.device-overlay');
                const styleEl = [...document.head.querySelectorAll('style')].find(s => s.textContent.includes('.device-overlay'));
                if (overlayEl) overlayEl.remove();
                if (styleEl) styleEl.remove();
                document.body.style.overflow = '';
            }, 600);
        };
        
        // Event listener untuk pesan dari iframe (game selesai)
        const messageHandler = (event) => {
            if (event.data.type === 'gameCompleted') {
                const points = event.data.points !== undefined ? event.data.points : 20;
                this.player.addPoints(points);
                this.updatePlayerPoints();
                window.removeEventListener('message', messageHandler);
                // Tutup overlay dulu, baru tampilkan pesan sukses
                closeOverlayWithAnimation();
                setTimeout(() => {
                    // Pesan yang menyesuaikan dengan skor
                    let desc = "Kamu berhasil menyelesaikan kuis privasi media sosial!";
                    if (points >= 80) {
                        desc = "Excellent! Kamu sangat memahami privasi media sosial!";
                    } else if (points >= 60) {
                        desc = "Bagus! Kamu sudah cukup memahami privasi media sosial!";
                    } else if (points >= 40) {
                        desc = "Cukup baik! Kamu perlu belajar lebih lagi tentang privasi media sosial.";
                    } else {
                        desc = "Kamu perlu belajar lebih banyak tentang privasi media sosial.";
                    }
                    
                    showMissionSuccess({
                        title: "Great!",
                        desc: desc,
                        points: points
                    });
                }, 600);
            }
        };
        window.addEventListener('message', messageHandler);
    }

    /**
     * Memainkan game dari kotak 19 (Frame Device)
     */
    playGameFromBox19() {
        // Mencegah scrolling pada body
        document.body.style.overflow = 'hidden';
        
        // Buat overlay untuk frame device
        const overlay = document.createElement('div');
        overlay.className = 'device-overlay';
        overlay.innerHTML = `
            <iframe src="Kotak/19/index.html" class="device-iframe" allowfullscreen></iframe>
        `;
        // Style overlay dan device frame - overlay blur agar fokus ke device + animasi pop-in
        const style = document.createElement('style');
        style.textContent = `
            .device-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: rgba(30,41,59,0.25);
                backdrop-filter: blur(6px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .device-overlay.closing {
                opacity: 0;
                background: rgba(30,41,59,0);
                backdrop-filter: blur(0px);
            }
            .device-iframe {
                border: none;
                background: transparent;
                width: 800px;
                height: 520px;
                margin: 0;
                padding: 0;
                display: block;
                overflow: hidden;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                animation: devicePopIn 0.6s cubic-bezier(0.4,0,0.2,1);
            }
            .device-overlay.closing .device-iframe {
                transform: scale(0.8);
                opacity: 0;
            }
            @keyframes devicePopIn {
                0% {
                    opacity: 0;
                    transform: scale(0.7);
                }
                80% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        
        // Fungsi untuk menutup overlay dengan animasi smooth
        const closeOverlayWithAnimation = () => {
            overlay.classList.add('closing');
            setTimeout(() => {
                const overlayEl = document.querySelector('.device-overlay');
                const styleEl = [...document.head.querySelectorAll('style')].find(s => s.textContent.includes('.device-overlay'));
                if (overlayEl) overlayEl.remove();
                if (styleEl) styleEl.remove();
                document.body.style.overflow = '';
            }, 600);
        };
        
        // Event listener untuk pesan dari iframe (game selesai)
        const messageHandler = (event) => {
            if (event.data.type === 'gameCompleted') {
                // Kurangi poin 100
                this.player.deductPoints(100);
                this.updatePlayerPoints();
                window.removeEventListener('message', messageHandler);
                // Tutup overlay dulu, baru tampilkan popup perhatian
                closeOverlayWithAnimation();
                setTimeout(() => {
                    showMissionSuccess({
                        title: "Perhatian!",
                        desc: " Kamu masuk jebakan tren medsos. Data bocor, risiko terbuka! Balik ke Kotak 7.",
                        points: -100,
                        onClose: () => {
                            // Setelah popup ditutup, pion bergerak mundur satu per satu ke kotak 16, lalu tampilkan minigame kotak 16
                            if (this.ui) {
                                this.ui.animateMoveBackward(19, 16, () => {
                                    this.ui.showTileInfo(16, {
                                        action: 'play-game',
                                        afterTileInfo: () => {
                                            this.ui.showMinigameNotification(() => {
                                                this.playGameFromBox16();
                                            });
                                        }
                                    });
                                });
                            } else {
                                this.movePlayerToTile(this.player.id, 16);
                                this.playGameFromBox16();
                            }
                        }
                    });
                }, 600);
            }
        };
        window.addEventListener('message', messageHandler);
    }

    /**
     * Memainkan game dari kotak 21 (Frame Device)
     */
    playGameFromBox21() {
        // Mencegah scrolling pada body
        document.body.style.overflow = 'hidden';
        
        // Buat overlay untuk frame device
        const overlay = document.createElement('div');
        overlay.className = 'device-overlay';
        overlay.innerHTML = `
            <iframe src="Kotak/21/index.html" class="device-iframe" allowfullscreen></iframe>
        `;
        // Style overlay dan device frame - overlay blur agar fokus ke device + animasi pop-in
        const style = document.createElement('style');
        style.textContent = `
            .device-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: rgba(30,41,59,0.25);
                backdrop-filter: blur(6px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .device-overlay.closing {
                opacity: 0;
                background: rgba(30,41,59,0);
                backdrop-filter: blur(0px);
            }
            .device-iframe {
                border: none;
                background: transparent;
                width: 800px;
                height: 520px;
                margin: 0;
                padding: 0;
                display: block;
                overflow: hidden;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                animation: devicePopIn 0.6s cubic-bezier(0.4,0,0.2,1);
            }
            .device-overlay.closing .device-iframe {
                transform: scale(0.8);
                opacity: 0;
            }
            @keyframes devicePopIn {
                0% {
                    opacity: 0;
                    transform: scale(0.7);
                }
                80% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        
        // Fungsi untuk menutup overlay dengan animasi smooth
        const closeOverlayWithAnimation = () => {
            overlay.classList.add('closing');
            setTimeout(() => {
                const overlayEl = document.querySelector('.device-overlay');
                const styleEl = [...document.head.querySelectorAll('style')].find(s => s.textContent.includes('.device-overlay'));
                if (overlayEl) overlayEl.remove();
                if (styleEl) styleEl.remove();
                document.body.style.overflow = '';
            }, 600);
        };
        
        // Event listener untuk pesan dari iframe (game selesai)
        const messageHandler = (event) => {
            if (event.data.type === 'gameCompleted') {
                const points = event.data.points !== undefined ? event.data.points : 100;
                this.player.addPoints(points);
                showMissionSuccess({
                    title: "Congratulations!",
                    desc: "Kamu berhasil melindungi akunmu dari serangan malware!",
                    points: points
                });
                this.updatePlayerPoints();
                window.removeEventListener('message', messageHandler);
                // Tutup overlay dengan animasi smooth
                closeOverlayWithAnimation();
            }
        };
        window.addEventListener('message', messageHandler);
    }



    /**
     * Memainkan game dari kotak 1
     */
    playGameFromBox1() {
        // Mencegah scrolling pada body
        document.body.style.overflow = 'hidden';
        
        // Buat overlay untuk frame device
        const overlay = document.createElement('div');
        overlay.className = 'device-overlay';
        overlay.innerHTML = `
            <iframe src="Kotak/1/index.html" class="device-iframe" allowfullscreen></iframe>
        `;
        
        // Style overlay dan device frame - overlay blur agar fokus ke device
        const style = document.createElement('style');
        style.textContent = `
            .device-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: rgba(30,41,59,0.25);
                backdrop-filter: blur(6px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .device-overlay.closing {
                opacity: 0;
                background: rgba(30,41,59,0);
                backdrop-filter: blur(0px);
            }
            .device-iframe {
                border: none;
                background: transparent;
                width: 650px;
                height: 420px;
                margin: 0;
                padding: 0;
                display: block;
                overflow: hidden;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                animation: devicePopIn 0.6s cubic-bezier(0.4,0,0.2,1);
            }
            .device-overlay.closing .device-iframe {
                transform: scale(0.8);
                opacity: 0;
            }
            @keyframes devicePopIn {
                0% {
                    opacity: 0;
                    transform: scale(0.7);
                }
                80% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        
        // Fungsi untuk menutup overlay dengan animasi smooth
        const closeOverlayWithAnimation = () => {
            // Tambahkan class untuk animasi closing
            overlay.classList.add('closing');
            
            // Tunggu animasi selesai sebelum menghapus elemen
            setTimeout(() => {
                const overlay = document.querySelector('.device-overlay');
                const style = [...document.head.querySelectorAll('style')].find(s => s.textContent.includes('.device-overlay'));
                if (overlay) overlay.remove();
                if (style) style.remove();
                // Kembalikan scrolling
                document.body.style.overflow = '';
            }, 600); // durasi animasi
        };
        
        // Event listener untuk pesan game selesai
        const messageHandler = (event) => {
            if (event.data.type === 'gameCompleted') {
                // Tutup overlay dengan animasi smooth
                closeOverlayWithAnimation();
                
                // Tampilkan pesan misi sukses setelah animasi selesai
                setTimeout(() => {
                    showMissionSuccess({
                        title: "Congratulations!",
                        desc: "Kamu berhasil membuat password kamu jadi lebih aman!",
                        points: 100
                    });
                    
                    // Tambahkan 100 poin setelah pesan misi sukses hilang (2.5 detik)
                    setTimeout(() => {
                        this.player.addPoints(100);
                        this.updatePlayerPoints();
                    }, 2500);
                }, 700); // Tunggu animasi selesai (600ms) + sedikit delay
                
                // Hapus event listener
                window.removeEventListener('message', messageHandler);
            }
        };
        
        window.addEventListener('message', messageHandler);
    }

    /**
     * Update tampilan poin pemain
     */
    updatePlayerPoints() {
        // Update di player list
        const playersList = document.getElementById('playersList');
        if (playersList) {
            const playerItem = playersList.querySelector('.player-item');
            if (playerItem) {
                const pointsDisplay = playerItem.querySelector('.player-points');
                if (pointsDisplay) {
                    // Animasikan perubahan poin
                    const oldPoints = parseInt(pointsDisplay.textContent);
                    const newPoints = this.player.points;
                    this.animatePointsChange(pointsDisplay, oldPoints, newPoints);
                }
            }
        }
    }

    /**
     * Animasikan perubahan poin
     */
    animatePointsChange(element, start, end) {
        const duration = 1500; // Durasi animasi dalam milidetik
        const stepTime = 50; // Interval waktu antara setiap step
        const steps = duration / stepTime;
        const increment = (end - start) / steps;
        let current = start;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current += increment;
            element.textContent = `${Math.round(current)} Poin`;
            
            if (step >= steps) {
                clearInterval(timer);
                element.textContent = `${end} Poin`;
            }
        }, stepTime);
    }

    movePlayer(playerId, steps) {
        const player = this.getPlayer();
        if (!player) return;

        const oldPosition = player.position;
        let newPosition = (oldPosition + steps) % this.gameBoard.tiles.length;
        if (newPosition < 0) newPosition += this.gameBoard.tiles.length;
        
        // Cek apakah melewati Start
        const passedStart = newPosition < oldPosition;
        
        // Update posisi pemain
        player.position = newPosition;
        
        // Proses aksi tile
        const tile = this.gameBoard.getTileById(newPosition);
        return this.processTileAction(player, tile, { passedStart });
    }

    /**
     * Pindahkan pemain ke kotak tertentu
     */
    movePlayerToTile(playerId, tileId) {
        const player = this.getPlayer();
        if (!player) return;

        // Update posisi pemain
        player.position = tileId;
        
        // Proses aksi tile
        const tile = this.gameBoard.getTileById(tileId);
        return this.processTileAction(player, tile, { passedStart: false });
    }

    /**
     * Memainkan game dari kotak 3
     */
    playGameFromBox3() {
        // Mencegah scrolling pada body
        document.body.style.overflow = 'hidden';
        
        // Buat overlay untuk frame device
        const overlay = document.createElement('div');
        overlay.className = 'device-overlay';
        overlay.innerHTML = `
            <iframe src="Kotak/3/index.html" class="device-iframe" allowfullscreen></iframe>
        `;
        // Style overlay dan device frame - overlay blur agar fokus ke device + animasi pop-in
        const style = document.createElement('style');
        style.textContent = `
            .device-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: rgba(30,41,59,0.25);
                backdrop-filter: blur(6px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .device-overlay.closing {
                opacity: 0;
                background: rgba(30,41,59,0);
                backdrop-filter: blur(0px);
            }
            .device-iframe {
                border: none;
                background: transparent;
                width: 800px;
                height: 520px;
                margin: 0;
                padding: 0;
                display: block;
                overflow: hidden;
                transition: all 0.6s cubic-bezier(0.4,0,0.2,1);
                animation: devicePopIn 0.6s cubic-bezier(0.4,0,0.2,1);
            }
            .device-overlay.closing .device-iframe {
                transform: scale(0.8);
                opacity: 0;
            }
            @keyframes devicePopIn {
                0% {
                    opacity: 0;
                    transform: scale(0.7);
                }
                80% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        // Fungsi untuk menutup overlay dengan animasi smooth
        const closeOverlayWithAnimation = () => {
            overlay.classList.add('closing');
            setTimeout(() => {
                const overlayEl = document.querySelector('.device-overlay');
                const styleEl = [...document.head.querySelectorAll('style')].find(s => s.textContent.includes('.device-overlay'));
                if (overlayEl) overlayEl.remove();
                if (styleEl) styleEl.remove();
                document.body.style.overflow = '';
            }, 600);
        };
        // Event listener untuk pesan dari iframe (game selesai)
        const messageHandler = (event) => {
            if (event.data.type === 'gameCompleted') {
                // Tutup overlay dengan animasi smooth
                closeOverlayWithAnimation();
                // Ambil skor dari event.data.points, default 100 jika tidak ada
                const points = event.data.points !== undefined ? event.data.points : 100;
                // Tampilkan pesan misi sukses setelah animasi selesai
                setTimeout(() => {
                    showMissionSuccess({
                        title: "Congratulations!",
                        desc: "Kuis selesai! Sekarang kamu tahu seperti apa password yang aman dan sulit ditebak.",
                        points: points
                    });
                    // Tambahkan poin ke player setelah popup hilang
                    setTimeout(() => {
                        this.player.addPoints(points);
                        this.updatePlayerPoints();
                    }, 2500);
                }, 700);
                // Hapus event listener
                window.removeEventListener('message', messageHandler);
            }
        };
        window.addEventListener('message', messageHandler);
    }

    /**
     * Memainkan game dari kotak 9 (Frame Device)
     */
    playGameFromBox9() {
        // Mencegah scrolling pada body
        document.body.style.overflow = 'hidden';
        // Buat overlay untuk frame device
        const overlay = document.createElement('div');
        overlay.className = 'device-overlay';
        overlay.innerHTML = `
            <iframe src="Kotak/9/index.html" class="device-iframe" allowfullscreen></iframe>
        `;
        // Style overlay dan device frame - overlay blur agar fokus ke device + animasi pop-in
        const style = document.createElement('style');
        style.textContent = `
            .device-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: rgba(30,41,59,0.25);
                backdrop-filter: blur(6px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .device-overlay.closing {
                opacity: 0;
                background: rgba(30,41,59,0);
                backdrop-filter: blur(0px);
            }
            .device-iframe {
                border: none;
                background: transparent;
                width: 800px;
                height: 520px;
                margin: 0;
                padding: 0;
                display: block;
                overflow: hidden;
                transition: all 0.6s cubic-bezier(0.4,0,0.2,1);
                animation: devicePopIn 0.6s cubic-bezier(0.4,0,0.2,1);
            }
            .device-overlay.closing .device-iframe {
                transform: scale(0.8);
                opacity: 0;
            }
            @keyframes devicePopIn {
                0% {
                    opacity: 0;
                    transform: scale(0.7);
                }
                80% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        // Fungsi untuk menutup overlay dengan animasi smooth
        const closeOverlayWithAnimation = () => {
            overlay.classList.add('closing');
            setTimeout(() => {
                const overlayEl = document.querySelector('.device-overlay');
                const styleEl = [...document.head.querySelectorAll('style')].find(s => s.textContent.includes('.device-overlay'));
                if (overlayEl) overlayEl.remove();
                if (styleEl) styleEl.remove();
                document.body.style.overflow = '';
            }, 600);
        };
        // Event listener untuk pesan dari iframe (game selesai)
        const messageHandler = (event) => {
            if (event.data.type === 'gameCompleted') {
                // Kurangi skor pemain 100
                this.player.deductPoints(100);
                this.updatePlayerPoints();
                showMissionSuccess({
                    title: "Perhatian!",
                    desc: "Serangan berhasil! Kamu kena jebakan phishing. Mundur ke Kotak 6.",
                    points: -100,
                    onClose: () => {
                        // Mulai animasi pergerakan mundur dari kotak 9 ke kotak 6 setelah user klik close
                        if (this.ui) {
                            this.ui.animateMoveBackward(9, 6, () => {
                                // Setelah selesai bergerak, langsung jalankan minigame kotak 6
                                this.ui.showTileInfo(6, {
                                    action: 'play-game',
                                    afterTileInfo: () => {
                                        this.ui.showMinigameNotification(() => {
                                            this.playGameFromBox6();
                                        });
                                    }
                                });
                                // this.playGameFromBox6();
                            });
                        } else {
                            // Fallback jika UI tidak tersedia
                            this.movePlayerToTile(this.player.id, 6);
                            this.playGameFromBox6();
                        }
                    }
                });
                closeOverlayWithAnimation();
                window.removeEventListener('message', messageHandler);
            }
        };
        window.addEventListener('message', messageHandler);
    }

    /**
     * Memainkan game dari kotak 8 (Frame Device)
     */
    playGameFromBox8() {
        // Mencegah scrolling pada body
        document.body.style.overflow = 'hidden';
        // Buat overlay untuk frame device
        const overlay = document.createElement('div');
        overlay.className = 'device-overlay';
        overlay.innerHTML = `
            <iframe src="Kotak/8/index.html" class="device-iframe" allowfullscreen></iframe>
        `;
        // Style overlay dan device frame - overlay blur agar fokus ke device + animasi pop-in
        const style = document.createElement('style');
        style.textContent = `
            .device-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: rgba(30,41,59,0.25);
                backdrop-filter: blur(6px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .device-overlay.closing {
                opacity: 0;
                background: rgba(30,41,59,0);
                backdrop-filter: blur(0px);
            }
            .device-iframe {
                border: none;
                background: transparent;
                width: 800px;
                height: 520px;
                margin: 0;
                padding: 0;
                display: block;
                overflow: hidden;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                animation: devicePopIn 0.6s cubic-bezier(0.4,0,0.2,1);
            }
            .device-overlay.closing .device-iframe {
                transform: scale(0.8);
                opacity: 0;
            }
            @keyframes devicePopIn {
                0% {
                    opacity: 0;
                    transform: scale(0.7);
                }
                80% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        // Fungsi untuk menutup overlay dengan animasi smooth
        const closeOverlayWithAnimation = () => {
            overlay.classList.add('closing');
            setTimeout(() => {
                const overlayEl = document.querySelector('.device-overlay');
                const styleEl = [...document.head.querySelectorAll('style')].find(s => s.textContent.includes('.device-overlay'));
                if (overlayEl) overlayEl.remove();
                if (styleEl) styleEl.remove();
                document.body.style.overflow = '';
            }, 600);
        };
        // Event listener untuk pesan dari iframe (game selesai)
        const messageHandler = (event) => {
            if (event.data.type === 'gameCompleted') {
                const points = event.data.points !== undefined ? event.data.points : 20;
                this.player.addPoints(points);
                showMissionSuccess({
                    title: "Congratulations!",
                    desc: "Kamu jago banget! Phishing berhasil dipatahkan!",
                    points: points
                });
                this.updatePlayerPoints();
                // Tutup overlay dengan animasi smooth
                closeOverlayWithAnimation();
                // Hapus event listener
                window.removeEventListener('message', messageHandler);
            }
        };
        window.addEventListener('message', messageHandler);
    }

    /**
     * Memainkan game dari kotak 6 (Frame Device)
     */
    playGameFromBox6() {
        // Mencegah scrolling pada body
        document.body.style.overflow = 'hidden';
        // Buat overlay untuk frame device
        const overlay = document.createElement('div');
        overlay.className = 'device-overlay';
        overlay.innerHTML = `
            <iframe src="Kotak/6/index.html" class="device-iframe" allowfullscreen></iframe>
        `;
        // Style overlay dan device frame - overlay blur agar fokus ke device + animasi pop-in
        const style = document.createElement('style');
        style.textContent = `
            .device-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: rgba(30,41,59,0.25);
                backdrop-filter: blur(6px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .device-overlay.closing {
                opacity: 0;
                background: rgba(30,41,59,0);
                backdrop-filter: blur(0px);
            }
            .device-iframe {
                border: none;
                background: transparent;
                width: 800px;
                height: 520px;
                margin: 0;
                padding: 0;
                display: block;
                overflow: hidden;
                transition: all 0.6s cubic-bezier(0.4,0,0.2,1);
            }
            .device-overlay.closing .device-iframe {
                transform: scale(0.8);
                opacity: 0;
            }
            @keyframes devicePopIn {
                0% {
                    opacity: 0;
                    transform: scale(0.7);
                }
                80% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        // Fungsi untuk menutup overlay dengan animasi smooth
        const closeOverlayWithAnimation = () => {
            overlay.classList.add('closing');
            setTimeout(() => {
                const overlayEl = document.querySelector('.device-overlay');
                const styleEl = [...document.head.querySelectorAll('style')].find(s => s.textContent.includes('.device-overlay'));
                if (overlayEl) overlayEl.remove();
                if (styleEl) styleEl.remove();
                document.body.style.overflow = '';
            }, 600);
        };
        // Event listener untuk pesan dari iframe (game selesai)
        const messageHandler = (event) => {
            if (event.data.type === 'gameCompleted') {
                const points = event.data.points !== undefined ? event.data.points : 100;
                this.player.addPoints(points);
                showMissionSuccess({
                    title: "Congratulations!",
                    desc: "Sekarang kamu tahu cara kerja phishing. Jangan asal klik link, ya!",
                    points: points
                });
                this.updatePlayerPoints();
                // Tutup overlay dengan animasi smooth
                closeOverlayWithAnimation();
                // Hapus event listener
                window.removeEventListener('message', messageHandler);
            }
        };
        window.addEventListener('message', messageHandler);
    }

    /**
     * Memainkan game dari kotak 24 (Frame Device)
     */
    playGameFromBox24() {
        // Mencegah scrolling pada body
        document.body.style.overflow = 'hidden';
        
        // Buat overlay untuk frame device
        const overlay = document.createElement('div');
        overlay.className = 'device-overlay';
        overlay.innerHTML = `
            <iframe src="Kotak/24/index.html" class="device-iframe" allowfullscreen></iframe>
        `;
        // Style overlay dan device frame - overlay blur agar fokus ke device + animasi pop-in
        const style = document.createElement('style');
        style.textContent = `
            .device-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: rgba(30,41,59,0.25);
                backdrop-filter: blur(6px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .device-overlay.closing {
                opacity: 0;
                background: rgba(30,41,59,0);
                backdrop-filter: blur(0px);
            }
            .device-iframe {
                border: none;
                background: transparent;
                width: 800px;
                height: 520px;
                margin: 0;
                padding: 0;
                display: block;
                overflow: hidden;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                animation: devicePopIn 0.6s cubic-bezier(0.4,0,0.2,1);
            }
            .device-overlay.closing .device-iframe {
                transform: scale(0.8);
                opacity: 0;
            }
            @keyframes devicePopIn {
                0% {
                    opacity: 0;
                    transform: scale(0.7);
                }
                80% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        
        // Fungsi untuk menutup overlay dengan animasi smooth
        const closeOverlayWithAnimation = () => {
            overlay.classList.add('closing');
            setTimeout(() => {
                const overlayEl = document.querySelector('.device-overlay');
                const styleEl = [...document.head.querySelectorAll('style')].find(s => s.textContent.includes('.device-overlay'));
                if (overlayEl) overlayEl.remove();
                if (styleEl) styleEl.remove();
                document.body.style.overflow = '';
            }, 600);
        };
        
        // Event listener untuk pesan dari iframe (game selesai)
        const messageHandler = (event) => {
            if (event.data.type === 'gameCompleted') {
                // Kurangi poin 200
                this.player.deductPoints(100);
                this.updatePlayerPoints();
                window.removeEventListener('message', messageHandler);
                // Tutup overlay dulu, baru tampilkan popup perhatian
                closeOverlayWithAnimation();
                setTimeout(() => {
                    showMissionSuccess({
                        title: "Perhatian!",
                        desc: "Kamu instal APK sembarangan... dan boom! Malware masuk. Mundur ke Kotak 21.",
                        points: -100,
                        onClose: () => {
                            // Setelah popup ditutup, pion bergerak mundur satu per satu ke kotak 21, lalu tampilkan minigame kotak 21
                            if (this.ui) {
                                this.ui.animateMoveBackward(24, 21, () => {
                                    this.ui.showTileInfo(21, {
                                        action: 'play-game',
                                        afterTileInfo: () => {
                                            this.ui.showMinigameNotification(() => {
                                                this.playGameFromBox21();
                                            });
                                        }
                                    });
                                });
                            } else {
                                this.movePlayerToTile(this.player.id, 21);
                                this.playGameFromBox21();
                            }
                        }
                    });
                }, 600);
            }
        };
        window.addEventListener('message', messageHandler);
    }

    /**
     * Memainkan game dari kotak 23 (Frame Device)
     */
    playGameFromBox23() {
        // Mencegah scrolling pada body
        document.body.style.overflow = 'hidden';
        
        // Buat overlay untuk frame device
        const overlay = document.createElement('div');
        overlay.className = 'device-overlay';
        overlay.innerHTML = `
            <iframe src="Kotak/23/index.html" class="device-iframe" allowfullscreen></iframe>
        `;
        // Style overlay dan device frame - overlay blur agar fokus ke device + animasi pop-in
        const style = document.createElement('style');
        style.textContent = `
            .device-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: rgba(30,41,59,0.25);
                backdrop-filter: blur(6px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .device-overlay.closing {
                opacity: 0;
                background: rgba(30,41,59,0);
                backdrop-filter: blur(0px);
            }
            .device-iframe {
                border: none;
                background: transparent;
                width: 800px;
                height: 520px;
                margin: 0;
                padding: 0;
                display: block;
                overflow: hidden;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                animation: devicePopIn 0.6s cubic-bezier(0.4,0,0.2,1);
            }
            .device-overlay.closing .device-iframe {
                transform: scale(0.8);
                opacity: 0;
            }
            @keyframes devicePopIn {
                0% {
                    opacity: 0;
                    transform: scale(0.7);
                }
                80% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        
        // Fungsi untuk menutup overlay dengan animasi smooth
        const closeOverlayWithAnimation = () => {
            overlay.classList.add('closing');
            setTimeout(() => {
                const overlayEl = document.querySelector('.device-overlay');
                const styleEl = [...document.head.querySelectorAll('style')].find(s => s.textContent.includes('.device-overlay'));
                if (overlayEl) overlayEl.remove();
                if (styleEl) styleEl.remove();
                document.body.style.overflow = '';
            }, 600);
        };
        
        // Event listener untuk pesan dari iframe (game selesai)
        const messageHandler = (event) => {
            if (event.data.type === 'gameCompleted') {
                const points = event.data.points !== undefined ? event.data.points : 20;
                this.player.addPoints(points);
                this.updatePlayerPoints();
                window.removeEventListener('message', messageHandler);
                // Tutup overlay dulu, baru tampilkan pesan sukses
                closeOverlayWithAnimation();
                setTimeout(() => {
                    showMissionSuccess({
                        title: "Well done!",
                        desc: "Semua kata terpecahkan! Kamu siap hadapi ancaman malware.",
                        points: points
                    });
                }, 600);
            }
        };
        window.addEventListener('message', messageHandler);
    }

    /**
     * Memainkan game dari kotak 26 (Frame Device)
     */
    playGameFromBox26() {
        // Mencegah scrolling pada body
        document.body.style.overflow = 'hidden';
        
        // Buat overlay untuk frame device
        const overlay = document.createElement('div');
        overlay.className = 'device-overlay';
        overlay.innerHTML = `
            <iframe src="Kotak/26/index.html" class="device-iframe" allowfullscreen></iframe>
        `;
        // Style overlay dan device frame - overlay blur agar fokus ke device + animasi pop-in
        const style = document.createElement('style');
        style.textContent = `
            .device-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: rgba(30,41,59,0.25);
                backdrop-filter: blur(6px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .device-overlay.closing {
                opacity: 0;
                background: rgba(30,41,59,0);
                backdrop-filter: blur(0px);
            }
            .device-iframe {
                border: none;
                background: transparent;
                width: 800px;
                height: 520px;
                margin: 0;
                padding: 0;
                display: block;
                overflow: hidden;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                animation: devicePopIn 0.6s cubic-bezier(0.4,0,0.2,1);
            }
            .device-overlay.closing .device-iframe {
                transform: scale(0.8);
                opacity: 0;
            }
            @keyframes devicePopIn {
                0% {
                    opacity: 0;
                    transform: scale(0.7);
                }
                80% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        
        // Fungsi untuk menutup overlay dengan animasi smooth
        const closeOverlayWithAnimation = () => {
            overlay.classList.add('closing');
            setTimeout(() => {
                const overlayEl = document.querySelector('.device-overlay');
                const styleEl = [...document.head.querySelectorAll('style')].find(s => s.textContent.includes('.device-overlay'));
                if (overlayEl) overlayEl.remove();
                if (styleEl) styleEl.remove();
                document.body.style.overflow = '';
            }, 600);
        };
        
        // Event listener untuk pesan dari iframe (game selesai)
        const messageHandler = (event) => {
            if (event.data.type === 'gameCompleted') {
                const points = event.data.points !== undefined ? event.data.points : 100;
                this.player.addPoints(points);
                this.updatePlayerPoints();
                window.removeEventListener('message', messageHandler);
                // Tutup overlay dulu, baru tampilkan pesan sukses
                closeOverlayWithAnimation();
                setTimeout(() => {
                    showMissionSuccess({
                        title: "Nice!",
                        desc: "Deepfake? Kamu udah gak gampang ketipu lagi",
                        points: points
                    });
                }, 600);
            }
        };
        window.addEventListener('message', messageHandler);
    }

    /**
     * Memainkan game dari kotak 27 (Frame Device)
     */
    playGameFromBox27() {
        // Mencegah scrolling pada body
        document.body.style.overflow = 'hidden';
        
        // Buat overlay untuk frame device
        const overlay = document.createElement('div');
        overlay.className = 'device-overlay';
        overlay.innerHTML = `
            <iframe src="Kotak/27/index.html" class="device-iframe" allowfullscreen></iframe>
        `;
        // Style overlay dan device frame - overlay blur agar fokus ke device + animasi pop-in
        const style = document.createElement('style');
        style.textContent = `
            .device-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: rgba(30,41,59,0.25);
                backdrop-filter: blur(6px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .device-overlay.closing {
                opacity: 0;
                background: rgba(30,41,59,0);
                backdrop-filter: blur(0px);
            }
            .device-iframe {
                border: none;
                background: transparent;
                width: 800px;
                height: 520px;
                margin: 0;
                padding: 0;
                display: block;
                overflow: hidden;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                animation: devicePopIn 0.6s cubic-bezier(0.4,0,0.2,1);
            }
            .device-overlay.closing .device-iframe {
                transform: scale(0.8);
                opacity: 0;
            }
            @keyframes devicePopIn {
                0% {
                    opacity: 0;
                    transform: scale(0.7);
                }
                80% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        
        // Fungsi untuk menutup overlay dengan animasi smooth
        const closeOverlayWithAnimation = () => {
            overlay.classList.add('closing');
            setTimeout(() => {
                const overlayEl = document.querySelector('.device-overlay');
                const styleEl = [...document.head.querySelectorAll('style')].find(s => s.textContent.includes('.device-overlay'));
                if (overlayEl) overlayEl.remove();
                if (styleEl) styleEl.remove();
                document.body.style.overflow = '';
            }, 600);
        };
        
        // Event listener untuk pesan dari iframe (game selesai)
        const messageHandler = (event) => {
            if (event.data.type === 'gameCompleted') {
                const points = event.data.points !== undefined ? event.data.points : 20;
                this.player.addPoints(points);
                this.updatePlayerPoints();
                window.removeEventListener('message', messageHandler);
                // Tutup overlay dulu, baru tampilkan pesan sukses
                closeOverlayWithAnimation();
                setTimeout(() => {
                    showMissionSuccess({
                        title: "Nice!",
                        desc: "Kamu udah jago bedain mana yang asli, mana yang palsu.",
                        points: points
                    });
                }, 600);
            }
        };
        window.addEventListener('message', messageHandler);
    }

    /**
     * Memainkan game dari kotak 29 (Frame Device)
     */
    playGameFromBox29() {
        // Mencegah scrolling pada body
        document.body.style.overflow = 'hidden';
        
        // Buat overlay untuk frame device
        const overlay = document.createElement('div');
        overlay.className = 'device-overlay';
        overlay.innerHTML = `
            <iframe src="Kotak/29/index.html" class="device-iframe" allowfullscreen></iframe>
        `;
        // Style overlay dan device frame - overlay blur agar fokus ke device + animasi pop-in
        const style = document.createElement('style');
        style.textContent = `
            .device-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: rgba(30,41,59,0.25);
                backdrop-filter: blur(6px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .device-overlay.closing {
                opacity: 0;
                background: rgba(30,41,59,0);
                backdrop-filter: blur(0px);
            }
            .device-iframe {
                border: none;
                background: transparent;
                width: 800px;
                height: 520px;
                margin: 0;
                padding: 0;
                display: block;
                overflow: hidden;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                animation: devicePopIn 0.6s cubic-bezier(0.4,0,0.2,1);
            }
            .device-overlay.closing .device-iframe {
                transform: scale(0.8);
                opacity: 0;
            }
            @keyframes devicePopIn {
                0% {
                    opacity: 0;
                    transform: scale(0.7);
                }
                80% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        
        // Fungsi untuk menutup overlay dengan animasi smooth
        const closeOverlayWithAnimation = () => {
            overlay.classList.add('closing');
            setTimeout(() => {
                const overlayEl = document.querySelector('.device-overlay');
                const styleEl = [...document.head.querySelectorAll('style')].find(s => s.textContent.includes('.device-overlay'));
                if (overlayEl) overlayEl.remove();
                if (styleEl) styleEl.remove();
                document.body.style.overflow = '';
            }, 600);
        };
        
        // Event listener untuk pesan dari iframe (game selesai)
        const messageHandler = (event) => {
            if (event.data.type === 'gameCompleted') {
                // Kurangi poin 200
                this.player.deductPoints(100);
                this.updatePlayerPoints();
                window.removeEventListener('message', messageHandler);
                // Tutup overlay dulu, baru tampilkan popup perhatian
                closeOverlayWithAnimation();
                setTimeout(() => {
                    showMissionSuccess({
                        title: "Perhatian!",
                        desc: "Deepfake berhasil menipumu. Konten palsu bisa sangat meyakinkan!",
                        points: -100,
                        onClose: () => {
                            // Setelah popup ditutup, pion bergerak mundur ke kotak 26, lalu tampilkan minigame kotak 26
                            if (this.ui) {
                                this.ui.animateMoveBackward(29, 26, () => {
                                    this.ui.showTileInfo(26, {
                                        action: 'play-game',
                                        afterTileInfo: () => {
                                            this.ui.showMinigameNotification(() => {
                                                this.playGameFromBox26();
                                            });
                                        }
                                    });
                                });
                            } else {
                                this.movePlayerToTile(this.player.id, 26);
                                this.playGameFromBox26();
                            }
                        }
                    });
                }, 600);
            }
        };
        window.addEventListener('message', messageHandler);
    }

    /**
     * Memainkan game dari kotak 31 (Frame Device)
     */
    playGameFromBox31() {
        // Mencegah scrolling pada body
        document.body.style.overflow = 'hidden';
        
        // Buat overlay untuk frame device
        const overlay = document.createElement('div');
        overlay.className = 'device-overlay';
        overlay.innerHTML = `
            <iframe src="Kotak/31/index.html" class="device-iframe" allowfullscreen></iframe>
        `;
        // Style overlay dan device frame - overlay blur agar fokus ke device + animasi pop-in
        const style = document.createElement('style');
        style.textContent = `
            .device-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: rgba(30,41,59,0.25);
                backdrop-filter: blur(6px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .device-overlay.closing {
                opacity: 0;
                background: rgba(30,41,59,0);
                backdrop-filter: blur(0px);
            }
            .device-iframe {
                border: none;
                background: transparent;
                width: 800px;
                height: 520px;
                margin: 0;
                padding: 0;
                display: block;
                overflow: hidden;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                animation: devicePopIn 0.6s cubic-bezier(0.4,0,0.2,1);
            }
            .device-overlay.closing .device-iframe {
                transform: scale(0.8);
                opacity: 0;
            }
            @keyframes devicePopIn {
                0% {
                    opacity: 0;
                    transform: scale(0.7);
                }
                80% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        
        // Fungsi untuk menutup overlay dengan animasi smooth
        const closeOverlayWithAnimation = () => {
            overlay.classList.add('closing');
            setTimeout(() => {
                const overlayEl = document.querySelector('.device-overlay');
                const styleEl = [...document.head.querySelectorAll('style')].find(s => s.textContent.includes('.device-overlay'));
                if (overlayEl) overlayEl.remove();
                if (styleEl) styleEl.remove();
                document.body.style.overflow = '';
            }, 600);
        };
        
        // Event listener untuk pesan dari iframe (game selesai)
        const messageHandler = (event) => {
            if (event.data.type === 'gameCompleted') {
                const points = event.data.points !== undefined ? event.data.points : 20;
                this.player.addPoints(points);
                this.updatePlayerPoints();
                window.removeEventListener('message', messageHandler);
                // Tutup overlay dulu, baru tampilkan pesan sukses
                closeOverlayWithAnimation();
                setTimeout(() => {
                    showMissionSuccess({
                        title: "Great!",
                        desc: "Sekarang kamu lebih siap jaga datamu",
                        points: points
                    });
                }, 600);
            }
        };
        window.addEventListener('message', messageHandler);
    }

    /**
     * Memainkan game dari kotak 32 (Frame Device)
     */
    playGameFromBox32() {
        // Mencegah scrolling pada body
        document.body.style.overflow = 'hidden';
        
        // Buat overlay untuk frame device
        const overlay = document.createElement('div');
        overlay.className = 'device-overlay';
        overlay.innerHTML = `
            <iframe src="Kotak/32/index.html" class="device-iframe" allowfullscreen></iframe>
        `;
        // Style overlay dan device frame - overlay blur agar fokus ke device + animasi pop-in
        const style = document.createElement('style');
        style.textContent = `
            .device-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: rgba(30,41,59,0.25);
                backdrop-filter: blur(6px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .device-overlay.closing {
                opacity: 0;
                background: rgba(30,41,59,0);
                backdrop-filter: blur(0px);
            }
            .device-iframe {
                border: none;
                background: transparent;
                width: 800px;
                height: 520px;
                margin: 0;
                padding: 0;
                display: block;
                overflow: hidden;
                transition: all 0.6s cubic-bezier(0.4,0,0.2,1);
                animation: devicePopIn 0.6s cubic-bezier(0.4,0,0.2,1);
            }
            .device-overlay.closing .device-iframe {
                transform: scale(0.8);
                opacity: 0;
            }
            @keyframes devicePopIn {
                0% {
                    opacity: 0;
                    transform: scale(0.7);
                }
                80% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        
        // Fungsi untuk menutup overlay dengan animasi smooth
        const closeOverlayWithAnimation = () => {
            overlay.classList.add('closing');
            setTimeout(() => {
                const overlayEl = document.querySelector('.device-overlay');
                const styleEl = [...document.head.querySelectorAll('style')].find(s => s.textContent.includes('.device-overlay'));
                if (overlayEl) overlayEl.remove();
                if (styleEl) styleEl.remove();
                document.body.style.overflow = '';
            }, 600);
        };
        
        // Event listener untuk pesan dari iframe (game selesai)
        const messageHandler = (event) => {
            if (event.data.type === 'gameCompleted') {
                // Kurangi poin 200
                this.player.deductPoints(100);
                this.updatePlayerPoints();
                window.removeEventListener('message', messageHandler);
                // Tutup overlay dulu, baru tampilkan popup perhatian
                closeOverlayWithAnimation();
                setTimeout(() => {
                    showMissionSuccess({
                        title: "Perhatian!",
                        desc: "Kamu menggunakan identitas orang lain tanpa izin! Mundur ke Kotak 31.",
                        points: -100,
                        onClose: () => {
                            // Setelah popup ditutup, pion bergerak mundur ke kotak 31, lalu tampilkan minigame kotak 31
                            if (this.ui) {
                                this.ui.animateMoveBackward(32, 31, () => {
                                    this.ui.showTileInfo(31, {
                                        action: 'play-game',
                                        afterTileInfo: () => {
                                            this.ui.showMinigameNotification(() => {
                                                this.playGameFromBox31();
                                            });
                                        }
                                    });
                                });
                            } else {
                                this.movePlayerToTile(this.player.id, 31);
                                this.playGameFromBox31();
                            }
                        }
                    });
                }, 600);
            }
        };
        window.addEventListener('message', messageHandler);
    }

    /**
     * Memainkan game dari kotak 34 (Frame Device)
     */
    playGameFromBox34() {
        // Mencegah scrolling pada body
        document.body.style.overflow = 'hidden';
        // Buat overlay untuk frame device
        const overlay = document.createElement('div');
        overlay.className = 'device-overlay';
        overlay.innerHTML = `
            <iframe src="Kotak/34/index.html" class="device-iframe" allowfullscreen></iframe>
        `;
        // Style overlay dan device frame - overlay blur agar fokus ke device + animasi pop-in
        const style = document.createElement('style');
        style.textContent = `
            .device-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: rgba(30,41,59,0.25);
                backdrop-filter: blur(6px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .device-overlay.closing {
                opacity: 0;
                background: rgba(30,41,59,0);
                backdrop-filter: blur(0px);
            }
            .device-iframe {
                border: none;
                background: transparent;
                width: 800px;
                height: 520px;
                margin: 0;
                padding: 0;
                display: block;
                overflow: hidden;
                transition: all 0.6s cubic-bezier(0.4,0,0.2,1);
                animation: devicePopIn 0.6s cubic-bezier(0.4,0,0.2,1);
            }
            .device-overlay.closing .device-iframe {
                transform: scale(0.8);
                opacity: 0;
            }
            @keyframes devicePopIn {
                0% {
                    opacity: 0;
                    transform: scale(0.7);
                }
                80% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        // Fungsi untuk menutup overlay dengan animasi smooth
        const closeOverlayWithAnimation = () => {
            overlay.classList.add('closing');
            setTimeout(() => {
                const overlayEl = document.querySelector('.device-overlay');
                const styleEl = [...document.head.querySelectorAll('style')].find(s => s.textContent.includes('.device-overlay'));
                if (overlayEl) overlayEl.remove();
                if (styleEl) styleEl.remove();
                document.body.style.overflow = '';
            }, 600);
        };
        // Event listener untuk pesan dari iframe (game selesai)
        const messageHandler = (event) => {
            if (event.data.type === 'gameCompleted') {
                const points = event.data.points !== undefined ? event.data.points : 100;
                this.player.addPoints(points);
                this.updatePlayerPoints();
                // Tutup overlay dulu, baru tampilkan pesan sukses
                closeOverlayWithAnimation();
                setTimeout(() => {
                    showMissionSuccess({
                        title: "Well done!",
                        desc: "Puzzle UU ITE berhasil kamu pecahkan. Pengetahuan digitalmu naik level!",
                        points: points
                    });
                }, 600);
            } else if (event.data.type === 'closeGame') {
                // Tutup overlay langsung tanpa pesan sukses
                closeOverlayWithAnimation();
                window.removeEventListener('message', messageHandler);
            }
        };
        window.addEventListener('message', messageHandler);
    }

    /**
     * Memainkan game dari kotak 15
     */
    playGameFromBox15() {
        document.body.style.overflow = 'hidden';
        const overlay = document.createElement('div');
        overlay.className = 'device-overlay';
        overlay.innerHTML = `
            <iframe src="Kotak/15/index.html" class="device-iframe" allowfullscreen></iframe>
        `;
        const style = document.createElement('style');
        style.textContent = `
            .device-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: rgba(30,41,59,0.25);
                backdrop-filter: blur(6px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .device-overlay.closing {
                opacity: 0;
                background: rgba(30,41,59,0);
                backdrop-filter: blur(0px);
            }
            .device-iframe {
                border: none;
                background: transparent;
                width: 800px;
                height: 520px;
                margin: 0;
                padding: 0;
                display: block;
                overflow: hidden;
                transition: all 0.6s cubic-bezier(0.4,0,0.2,1);
                animation: devicePopIn 0.6s cubic-bezier(0.4,0,0.2,1);
            }
            .device-overlay.closing .device-iframe {
                transform: scale(0.8);
                opacity: 0;
            }
            @keyframes devicePopIn {
                0% {
                    opacity: 0;
                    transform: scale(0.7);
                }
                80% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        const closeOverlayWithAnimation = () => {
            overlay.classList.add('closing');
            setTimeout(() => {
                const overlayEl = document.querySelector('.device-overlay');
                const styleEl = [...document.head.querySelectorAll('style')].find(s => s.textContent.includes('.device-overlay'));
                if (overlayEl) overlayEl.remove();
                if (styleEl) styleEl.remove();
                document.body.style.overflow = '';
            }, 600);
        };
        const messageHandler = (event) => {
            if (event.data.type === 'gameCompleted') {
                const points = event.data.points !== undefined ? event.data.points : 100;
                this.player.addPoints(points);
                this.updatePlayerPoints();
                window.removeEventListener('message', messageHandler);
                // Tutup overlay dulu, baru tampilkan pesan sukses
                closeOverlayWithAnimation();
                setTimeout(() => {
                    showMissionSuccess({
                        title: "Nice!",
                        desc: "Password berhasil diperbarui. Akunmu kembali aman!",
                        points: points
                    });
                }, 600);
            }
        };
        window.addEventListener('message', messageHandler);
    }

    /**
     * Memainkan game dari kotak 25
     */
    playGameFromBox25() {
        // Mencegah scrolling pada body
        document.body.style.overflow = 'hidden';
        
        // Buat overlay untuk frame device
        const overlay = document.createElement('div');
        overlay.className = 'device-overlay';
        overlay.innerHTML = `
            <iframe src="Kotak/25/index.html" class="device-iframe" allowfullscreen></iframe>
        `;
        
        // Style overlay dan device frame - overlay blur agar fokus ke device
        const style = document.createElement('style');
        style.textContent = `
            .device-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: rgba(30,41,59,0.25);
                backdrop-filter: blur(6px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .device-overlay.closing {
                opacity: 0;
                background: rgba(30,41,59,0);
                backdrop-filter: blur(0px);
            }
            .device-iframe {
                border: none;
                background: transparent;
                width: 650px;
                height: 420px;
                margin: 0;
                padding: 0;
                display: block;
                overflow: hidden;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                animation: devicePopIn 0.6s cubic-bezier(0.4,0,0.2,1);
            }
            .device-overlay.closing .device-iframe {
                transform: scale(0.8);
                opacity: 0;
            }
            @keyframes devicePopIn {
                0% {
                    opacity: 0;
                    transform: scale(0.7);
                }
                80% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        
        // Fungsi untuk menutup overlay dengan animasi smooth
        const closeOverlayWithAnimation = () => {
            overlay.classList.add('closing');
            setTimeout(() => {
                const overlayEl = document.querySelector('.device-overlay');
                const styleEl = [...document.head.querySelectorAll('style')].find(s => s.textContent.includes('.device-overlay'));
                if (overlayEl) overlayEl.remove();
                if (styleEl) styleEl.remove();
                document.body.style.overflow = '';
            }, 600);
        };
        
        // Event listener untuk pesan dari iframe (game selesai)
        const messageHandler = (event) => {
            if (event.data.type === 'gameCompleted') {
                const points = event.data.points !== undefined ? event.data.points : 100;
                this.player.addPoints(points);
                this.updatePlayerPoints();
                window.removeEventListener('message', messageHandler);
                // Tutup overlay dulu, baru tampilkan pesan sukses
                closeOverlayWithAnimation();
                setTimeout(() => {
                    showMissionSuccess({
                        title: "Nice!",
                        desc: "Password berhasil diperbarui. Akunmu kembali aman!",
                        points: points
                    });
                }, 600);
            }
        };
        
        window.addEventListener('message', messageHandler);
    }

    /**
     * Memainkan game dari kotak 35
     */
    playGameFromBox35() {
        // Mencegah scrolling pada body
        document.body.style.overflow = 'hidden';
        
        // Buat overlay untuk frame device
        const overlay = document.createElement('div');
        overlay.className = 'device-overlay';
        overlay.innerHTML = `
            <iframe src="Kotak/35/index.html" class="device-iframe" allowfullscreen></iframe>
        `;
        
        // Style overlay dan device frame - overlay blur agar fokus ke device
        const style = document.createElement('style');
        style.textContent = `
            .device-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: rgba(30,41,59,0.25);
                backdrop-filter: blur(6px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .device-overlay.closing {
                opacity: 0;
                background: rgba(30,41,59,0);
                backdrop-filter: blur(0px);
            }
            .device-iframe {
                border: none;
                background: transparent;
                width: 650px;
                height: 420px;
                margin: 0;
                padding: 0;
                display: block;
                overflow: hidden;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                animation: devicePopIn 0.6s cubic-bezier(0.4,0,0.2,1);
            }
            .device-overlay.closing .device-iframe {
                transform: scale(0.8);
                opacity: 0;
            }
            @keyframes devicePopIn {
                0% {
                    opacity: 0;
                    transform: scale(0.7);
                }
                80% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        
        // Fungsi untuk menutup overlay dengan animasi smooth
        const closeOverlayWithAnimation = () => {
            overlay.classList.add('closing');
            setTimeout(() => {
                const overlayEl = document.querySelector('.device-overlay');
                const styleEl = [...document.head.querySelectorAll('style')].find(s => s.textContent.includes('.device-overlay'));
                if (overlayEl) overlayEl.remove();
                if (styleEl) styleEl.remove();
                document.body.style.overflow = '';
            }, 600);
        };
        
        // Event listener untuk pesan dari iframe (game selesai)
        const messageHandler = (event) => {
            if (event.data.type === 'gameCompleted') {
                const points = event.data.points !== undefined ? event.data.points : 100;
                this.player.addPoints(points);
                this.updatePlayerPoints();
                window.removeEventListener('message', messageHandler);
                // Tutup overlay dulu, baru tampilkan pesan sukses
                closeOverlayWithAnimation();
                setTimeout(() => {
                    showMissionSuccess({
                        title: "Nice!",
                        desc: "Password berhasil diperbarui. Akunmu kembali aman!",
                        points: points
                    });
                }, 600);
            }
        };
        
        window.addEventListener('message', messageHandler);
    }

    /**
     * Memainkan game dari kotak 10 (Cyber Investigation)
     */
    playGameFromBox10() {
        // Mencegah scrolling pada body
        document.body.style.overflow = 'hidden';
        
        // Buat overlay untuk frame device
        const overlay = document.createElement('div');
        overlay.className = 'device-overlay';
        overlay.innerHTML = `
            <iframe src="Kotak/10/index.html" class="device-iframe" allowfullscreen></iframe>
        `;
        
        // Style overlay dan device frame - overlay blur agar fokus ke device
        const style = document.createElement('style');
        style.textContent = `
            .device-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: rgba(30,41,59,0.25);
                backdrop-filter: blur(6px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .device-overlay.closing {
                opacity: 0;
                background: rgba(30,41,59,0);
                backdrop-filter: blur(0px);
            }
            .device-iframe {
                border: none;
                background: transparent;
                width: 800px;
                height: 520px;
                margin: 0;
                padding: 0;
                display: block;
                overflow: hidden;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                animation: devicePopIn 0.6s cubic-bezier(0.4,0,0.2,1);
            }
            .device-overlay.closing .device-iframe {
                transform: scale(0.8);
                opacity: 0;
            }
            @keyframes devicePopIn {
                0% {
                    opacity: 0;
                    transform: scale(0.7);
                }
                80% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        
        // Fungsi untuk menutup overlay dengan animasi smooth
        const closeOverlayWithAnimation = () => {
            overlay.classList.add('closing');
            setTimeout(() => {
                const overlayEl = document.querySelector('.device-overlay');
                const styleEl = [...document.head.querySelectorAll('style')].find(s => s.textContent.includes('.device-overlay'));
                if (overlayEl) overlayEl.remove();
                if (styleEl) styleEl.remove();
                document.body.style.overflow = '';
            }, 600);
        };
        
        // Event listener untuk pesan dari iframe (game selesai)
        const messageHandler = (event) => {
            if (event.data.type === 'gameCompleted') {
                const points = event.data.points !== undefined ? event.data.points : -200;
                this.player.addPoints(points);
                this.updatePlayerPoints();
                window.removeEventListener('message', messageHandler);
                
                // Tutup overlay dulu, baru tampilkan pesan
                closeOverlayWithAnimation();
                setTimeout(() => {
                    if (points < 0) {
                        showMissionSuccess({
                            title: "Cyber Investigation Selesai",
                            desc: "Anda telah menyelesaikan masa hukuman cyber. Poin Anda berkurang karena pelanggaran UU ITE.",
                            points: points,
                            icon: "fas fa-shield-alt"
                        });
                    } else {
                        showMissionSuccess({
                            title: "Cyber Investigation Selesai",
                            desc: "Anda telah menyelesaikan investigasi cyber dengan baik!",
                            points: points,
                            icon: "fas fa-shield-alt"
                        });
                    }
                }, 600);
            }
        };
        
        window.addEventListener('message', messageHandler);
    }

    /**
     * Memainkan game dari kotak 37
     */
    playGameFromBox37() {
        document.body.style.overflow = 'hidden';
        const overlay = document.createElement('div');
        overlay.className = 'device-overlay';
        overlay.innerHTML = `
            <iframe src="Kotak/37/index.html" class="device-iframe" allowfullscreen></iframe>
        `;
        const style = document.createElement('style');
        style.textContent = `
            .device-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: rgba(30,41,59,0.25);
                backdrop-filter: blur(6px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .device-overlay.closing {
                opacity: 0;
                background: rgba(30,41,59,0);
                backdrop-filter: blur(0px);
            }
            .device-iframe {
                border: none;
                background: transparent;
                width: 800px;
                height: 520px;
                margin: 0;
                padding: 0;
                display: block;
                overflow: hidden;
                transition: all 0.6s cubic-bezier(0.4,0,0.2,1);
                animation: devicePopIn 0.6s cubic-bezier(0.4,0,0.2,1);
            }
            .device-overlay.closing .device-iframe {
                transform: scale(0.8);
                opacity: 0;
            }
            @keyframes devicePopIn {
                0% {
                    opacity: 0;
                    transform: scale(0.7);
                }
                80% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        
        // Fungsi untuk menutup overlay dengan animasi smooth
        const closeOverlayWithAnimation = () => {
            overlay.classList.add('closing');
            setTimeout(() => {
                const overlayEl = document.querySelector('.device-overlay');
                const styleEl = [...document.head.querySelectorAll('style')].find(s => s.textContent.includes('.device-overlay'));
                if (overlayEl) overlayEl.remove();
                if (styleEl) styleEl.remove();
                document.body.style.overflow = '';
            }, 600);
        };
        
        // Event listener untuk pesan dari iframe (game selesai)
        const messageHandler = (event) => {
            if (event.data.type === 'gameCompleted') {
                // Kurangi poin 200
                this.player.deductPoints(100);
                this.updatePlayerPoints();
                window.removeEventListener('message', messageHandler);
                // Tutup overlay dulu, baru tampilkan popup perhatian
                closeOverlayWithAnimation();
                setTimeout(() => {
                    showMissionSuccess({
                        title: "Perhatian!",
                        desc: "Kamu mencemarkan nama baik orang lain. Itu melanggar UU ITE, ayo pahami risikonya di Kotak 34.",
                        points: -100,
                        onClose: () => {
                            // Setelah popup ditutup, pion bergerak mundur ke kotak 31, lalu tampilkan minigame kotak 31
                            if (this.ui) {
                                this.ui.animateMoveBackward(37, 34, () => {
                                    this.ui.showTileInfo(34, {
                                        action: 'play-game',
                                        afterTileInfo: () => {
                                            this.ui.showMinigameNotification(() => {
                                                this.playGameFromBox34();
                                            });
                                        }
                                    });
                                });
                            } else {
                                this.movePlayerToTile(this.player.id, 34);
                                this.playGameFromBox34();
                            }
                        }
                    });
                }, 600);
            }
        };
        window.addEventListener('message', messageHandler);
    }

    /**
     * Menampilkan animasi completion game yang keren dengan konsep board game terbuka
     */
    showGameCompletion() {
        // Simpan waktu selesai sebelum menampilkan completion screen
        if (this.ui) {
            this.ui.saveCompletionTime();
        }
        
        // Tambahkan CSS animation untuk notifikasi
        if (!document.getElementById('notification-animation')) {
            const style = document.createElement('style');
            style.id = 'notification-animation';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Mencegah scrolling pada body
        document.body.style.overflow = 'hidden';
        
        // Buat overlay completion dengan konsep board game terbuka
        const overlay = document.createElement('div');
        overlay.className = 'completion-overlay';
        overlay.innerHTML = `
            <div class="completion-container">
                <!-- Background dengan efek cyber -->
                <div class="cyber-background">
                    <div class="cyber-grid"></div>
                    <div class="cyber-particles"></div>
                    <div class="cyber-lines"></div>
                </div>
                
                <!-- Board game yang akan terbuka seperti treasure chest -->
                <div class="board-game-container" id="boardGameContainer">
                    <div class="board-game-box" id="boardGameBox">
                        <!-- Box lid yang akan terbuka -->
                        <div class="box-lid" id="boxLid">
                            <div class="lid-front"></div>
                            <div class="lid-back"></div>
                            <div class="lid-left"></div>
                            <div class="lid-right"></div>
                            <div class="lid-top"></div>
                        </div>
                        
                        <!-- Box base -->
                        <div class="box-base">
                            <div class="base-front"></div>
                            <div class="base-back"></div>
                            <div class="base-left"></div>
                            <div class="base-right"></div>
                            <div class="base-bottom"></div>
                        </div>
                        
                        <!-- Content di dalam box -->
                        <div class="box-content modern-box-content">
                        </div>
                        
                        <!-- Hinge untuk animasi terbuka -->
                        <div class="box-hinge"></div>
                    </div>
                </div>
                
                <!-- Completion content yang akan muncul setelah box terbuka -->
                <div class="completion-content" id="completionContent" style="display: none;">
                    <!-- Explosion effect -->
                    <div class="explosion-effect">
                        <div class="explosion-particle"></div>
                        <div class="explosion-particle"></div>
                        <div class="explosion-particle"></div>
                        <div class="explosion-particle"></div>
                        <div class="explosion-particle"></div>
                        <div class="explosion-particle"></div>
                        <div class="explosion-particle"></div>
                        <div class="explosion-particle"></div>
                    </div>
                    
                    <!-- Golden light effect -->
                    <div class="golden-light"></div>
                    
                    <!-- Completion card -->
                    <div class="completion-card">
                        <!-- Achievement crown -->
                        <div class="achievement-crown">
                            <div class="crown-icon">👑</div>
                            <div class="crown-glow"></div>
                            <div class="crown-sparkles">
                                <div class="sparkle"></div>
                                <div class="sparkle"></div>
                                <div class="sparkle"></div>
                                <div class="sparkle"></div>
                            </div>
                        </div>
                        
                        <!-- Completion title -->
                        <div class="completion-title">
                            <span class="title-text">MISI SELESAI!</span>
                            <div class="title-underline"></div>
                        </div>
                        
                        <!-- Player stats -->
                        <div class="player-stats">
                            <div class="stat-item">
                                <div class="stat-icon">
                                    <i class="fas fa-trophy"></i>
                                </div>
                                <div class="stat-content">
                                    <div class="stat-value">${this.player.points}</div>
                                    <div class="stat-label">Total Poin Keamanan</div>
                            </div>
                                </div>
                            
                            <div class="stat-item">
                                <div class="stat-icon">
                                    <i class="fas fa-user-shield"></i>
                                </div>
                                <div class="stat-content">
                                    <div class="stat-value">${this.player.name}</div>
                                    <div class="stat-label">Cyber Guardian</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Achievement message -->
                        <div class="achievement-message" style="text-align:center; margin-bottom:20px; background:none; box-shadow:none; border:none; padding:0;">
                            <div style="font-size:0.68rem; font-weight:700; font-style:italic; color:#333; margin-bottom:3px;">"Kamu telah menjadi Cyber Security Champion<br>yang siap melindungi dunia digital!"</div>
                            <div style="font-size:0.58rem; color:#666; font-weight:400;">Selamat! Kamu telah menyelesaikan semua tantangan keamanan siber dan menjadi ahli dalam melindungi diri di dunia digital.</div>
                        </div>
                        
                        <!-- Action buttons -->
                        <div class="completion-actions-fix">
                            <button class="btn-close-fix" onclick="closeCompletionOverlay()">
                                Lihat Hall of Fame
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Tambahkan style untuk completion dengan konsep board game terbuka
        const style = document.createElement('style');
        style.textContent = `
                         .completion-overlay {
                 position: fixed;
                 top: 0; left: 0; width: 100vw; height: 100vh;
                 background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
                 z-index: 5000;
                 display: flex;
                 align-items: center;
                 justify-content: center;
                 overflow: hidden;
             }
             
             /* Cyber background effect */
             .cyber-background {
                 position: absolute;
                 top: 0; left: 0; width: 100%; height: 100%;
                 pointer-events: none;
                 z-index: 1;
             }
             
             .cyber-grid {
                 position: absolute;
                 top: 0; left: 0; width: 100%; height: 100%;
                 /* background-image: 
                     linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
                     linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
                 background-size: 50px 50px; */
                 animation: gridMove 20s linear infinite;
             }
             
             .cyber-particles {
                 position: absolute;
                 width: 100%; height: 100%;
                 overflow: hidden;
             }
             
             .cyber-particles::before {
                 content: '';
                 position: absolute;
                 width: 100%; height: 100%;
                 background: radial-gradient(circle at 20% 80%, rgba(0, 255, 255, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(255, 0, 255, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 40% 40%, rgba(255, 255, 0, 0.3) 0%, transparent 50%);
                 animation: particleFloat 8s ease-in-out infinite;
             }
             
             .cyber-lines {
                 position: absolute;
                 width: 100%; height: 100%;
                 background: 
                     linear-gradient(90deg, transparent 0%, rgba(0, 255, 255, 0.2) 50%, transparent 100%),
                     linear-gradient(0deg, transparent 0%, rgba(255, 0, 255, 0.2) 50%, transparent 100%);
                 animation: lineScan 4s linear infinite;
             }
             
             @keyframes gridMove {
                 0% { transform: translate(0, 0); }
                 100% { transform: translate(50px, 50px); }
             }
             
             @keyframes particleFloat {
                 0%, 100% { opacity: 0.3; transform: scale(1); }
                 50% { opacity: 0.8; transform: scale(1.2); }
             }
             
             @keyframes lineScan {
                 0% { opacity: 0; transform: translateY(-100%); }
                 50% { opacity: 1; }
                 100% { opacity: 0; transform: translateY(100%); }
             }
             
             /* Board game box */
             .board-game-container {
                 position: relative;
                 z-index: 10;
                 animation: boxAppear 1s ease-out;
             }
             
             .board-game-box {
                 width: 180px;
                 height: 120px;
                 position: relative;
                 transform-style: preserve-3d;
                 animation: boxFloat 3s ease-in-out infinite;
             }
             
             .box-lid, .box-base {
                 position: absolute;
                 width: 100%;
                 height: 100%;
                 transform-style: preserve-3d;
             }
             
             .box-lid {
                 transform-origin: bottom;
                 transition: transform 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
             }
             
             .lid-front, .lid-back, .lid-left, .lid-right, .lid-top,
             .base-front, .base-back, .base-left, .base-right, .base-bottom {
                 position: absolute;
                 background: linear-gradient(135deg, #ffd700, #ffed4e);
                 border: 2px solid #b8860b;
                 box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
             }
             
             .lid-front { width: 100%; height: 20px; transform: rotateX(-90deg) translateZ(10px); }
             .lid-back { width: 100%; height: 20px; transform: rotateX(90deg) translateZ(10px); }
             .lid-left { width: 20px; height: 100%; transform: rotateY(-90deg) translateZ(10px); }
             .lid-right { width: 20px; height: 100%; transform: rotateY(90deg) translateZ(10px); }
             .lid-top { width: 100%; height: 100%; transform: translateZ(20px); }
             
             .base-front { width: 100%; height: 20px; transform: rotateX(-90deg) translateZ(-10px); }
             .base-back { width: 100%; height: 20px; transform: rotateX(90deg) translateZ(-10px); }
             .base-left { width: 20px; height: 100%; transform: rotateY(-90deg) translateZ(-10px); }
             .base-right { width: 20px; height: 100%; transform: rotateY(90deg) translateZ(-10px); }
             .base-bottom { width: 100%; height: 100%; transform: translateZ(-20px); }
             
             .box-hinge {
                 position: absolute;
                 top: 0; left: 50%;
                 width: 4px;
                 height: 100%;
                 background: linear-gradient(to bottom, #8b4513, #a0522d);
                 transform: translateX(-50%);
                 z-index: 1;
             }
             
             .box-content {
                 position: absolute;
                 top: 50%;
                 left: 50%;
                 transform: translate(-50%, -50%);
                 text-align: center;
                 color: #1a1a1a;
                 z-index: 5;
             }
             
             .box-icon {
                 font-size: 40px;
                 margin-bottom: 8px;
                 animation: boxIconPulse 2s ease-in-out infinite;
             }
             
             .box-text {
                 font-size: 14px;
                 font-weight: 700;
                 letter-spacing: 1px;
                 text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
             }
             
             .box-glow {
                 position: absolute;
                 top: 50%;
                 left: 50%;
                 transform: translate(-50%, -50%);
                 width: 60px;
                 height: 60px;
                 background: radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%);
                 border-radius: 50%;
                 animation: boxGlow 2s ease-in-out infinite;
             }
             
             @keyframes boxAppear {
                 0% { transform: scale(0) rotateY(180deg); opacity: 0; }
                 100% { transform: scale(1) rotateY(0deg); opacity: 1; }
             }
             
             @keyframes boxFloat {
                 0%, 100% { transform: translateY(0) rotateY(0); }
                 50% { transform: translateY(-15px) rotateY(5deg); }
             }
             
             @keyframes boxIconPulse {
                 0%, 100% { transform: scale(1); }
                 50% { transform: scale(1.1); }
             }
             
             @keyframes boxGlow {
                 0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
                 50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
             }
             
             /* Box opening animation */
             .box-opening .box-lid {
                 transform: rotateX(-120deg);
             }
            
                         /* Explosion effect */
             .explosion-effect {
                 position: absolute;
                 top: 50%;
                 left: 50%;
                 transform: translate(-50%, -50%);
                 width: 100px;
                 height: 100px;
                 z-index: 25;
             }
             
             .explosion-particle {
                 position: absolute;
                 width: 8px;
                 height: 8px;
                 background: linear-gradient(45deg, #ffd700, #ffed4e);
                 border-radius: 50%;
                 animation: explosionMove 1s ease-out forwards;
             }
             
             .explosion-particle:nth-child(1) { --x: -100px; --y: -100px; animation-delay: 0s; }
             .explosion-particle:nth-child(2) { --x: 100px; --y: -100px; animation-delay: 0.1s; }
             .explosion-particle:nth-child(3) { --x: -100px; --y: 100px; animation-delay: 0.2s; }
             .explosion-particle:nth-child(4) { --x: 100px; --y: 100px; animation-delay: 0.3s; }
             .explosion-particle:nth-child(5) { --x: 0px; --y: -150px; animation-delay: 0.4s; }
             .explosion-particle:nth-child(6) { --x: 0px; --y: 150px; animation-delay: 0.5s; }
             .explosion-particle:nth-child(7) { --x: -150px; --y: 0px; animation-delay: 0.6s; }
             .explosion-particle:nth-child(8) { --x: 150px; --y: 0px; animation-delay: 0.7s; }
             
             @keyframes explosionMove {
                 0% { 
                     transform: translate(-50%, -50%) scale(0);
                     opacity: 1;
                 }
                 100% { 
                     transform: translate(-50%, -50%) scale(1) translate(var(--x), var(--y));
                     opacity: 0;
                 }
             }
             
             /* Completion content */
             .completion-content {
                 position: absolute;
                 top: 0; left: 0; width: 100%; height: 100%;
                 display: flex;
                 align-items: center;
                 justify-content: center;
                 z-index: 20;
             }
             
             .golden-light {
                 position: absolute;
                 top: 50%;
                 left: 50%;
                 transform: translate(-50%, -50%);
                 width: 400px;
                 height: 400px;
                 background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, rgba(255, 215, 0, 0.1) 50%, transparent 100%);
                 border-radius: 50%;
                 animation: goldenPulse 2s ease-in-out infinite;
             }
             
             @keyframes goldenPulse {
                 0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
                 50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
             }
            
            /* Main completion card */
            .completion-card {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 16px;
                padding: 25px;
                max-width: 320px;
                width: 80%;
                text-align: center;
                box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
                animation: cardAppear 1s ease-out;
                position: relative;
                z-index: 10;
            }
            
            /* Achievement crown */
            .achievement-crown {
                position: relative;
                display: inline-block;
                margin-bottom: 20px;
            }
            
            .crown-icon {
                font-size: 50px;
                animation: crownBounce 2s ease-in-out infinite;
            }
            
            .crown-glow {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 60px;
                height: 60px;
                background: radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%);
                border-radius: 50%;
                animation: crownGlow 2s ease-in-out infinite;
            }
            
            @keyframes crownBounce {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(-10px) rotate(5deg); }
            }
            
                         @keyframes crownGlow {
                 0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
                 50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
             }
             
             /* Crown sparkles */
             .crown-sparkles {
                 position: absolute;
                 top: 0; left: 0; width: 100%; height: 100%;
                 pointer-events: none;
             }
             
             .sparkle {
                 position: absolute;
                 width: 4px;
                 height: 4px;
                 background: #ffd700;
                 border-radius: 50%;
                 animation: sparkleFloat 3s ease-in-out infinite;
             }
             
             .sparkle:nth-child(1) { top: 20%; left: 30%; animation-delay: 0s; }
             .sparkle:nth-child(2) { top: 40%; right: 20%; animation-delay: 0.5s; }
             .sparkle:nth-child(3) { bottom: 30%; left: 40%; animation-delay: 1s; }
             .sparkle:nth-child(4) { bottom: 20%; right: 30%; animation-delay: 1.5s; }
             
             @keyframes sparkleFloat {
                 0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
                 50% { transform: scale(1) rotate(180deg); opacity: 1; }
             }
            
            /* Floating achievements */
            .floating-achievements {
                position: absolute;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 15;
            }
            
            .achievement-icon {
                position: absolute;
                font-size: 24px;
                animation: achievementFloat 4s ease-in-out infinite;
            }
            
            .achievement-icon:nth-child(1) { top: 20%; left: 15%; animation-delay: 0s; }
            .achievement-icon:nth-child(2) { top: 30%; right: 20%; animation-delay: 0.5s; }
            .achievement-icon:nth-child(3) { bottom: 30%; left: 25%; animation-delay: 1s; }
            .achievement-icon:nth-child(4) { bottom: 20%; right: 15%; animation-delay: 1.5s; }
            .achievement-icon:nth-child(5) { top: 50%; left: 10%; animation-delay: 2s; }
            .achievement-icon:nth-child(6) { top: 50%; right: 10%; animation-delay: 2.5s; }
            
                         @keyframes achievementFloat {
                 0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
                 50% { transform: translateY(-30px) rotate(180deg); opacity: 1; }
             }
             
             @keyframes cardAppear {
                 0% { transform: scale(0.8); opacity: 0; }
                 100% { transform: scale(1); opacity: 1; }
             }
             
             @keyframes fadeIn {
                 from { opacity: 0; }
                 to { opacity: 1; }
             }
             
             @keyframes fadeOut {
                 from { opacity: 1; }
                 to { opacity: 0; }
             }
             
             /* Completion title */
             .completion-title {
                 margin-bottom: 20px;
             }
             
             .title-text {
                 font-size: 20px;
                 font-weight: 800;
                 color: #1e3c72;
                 letter-spacing: 1px;
                 text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
             }
             
             .title-underline {
                 width: 50px;
                 height: 2px;
                 background: linear-gradient(90deg, #2196f3, #1e3c72);
                 margin: 6px auto 0;
                 border-radius: 2px;
                 animation: underlineGrow 1s ease-out 0.5s both;
             }
             
             @keyframes underlineGrow {
                 0% { width: 0; }
                 100% { width: 50px; }
             }
             
             /* Player stats */
             .player-stats {
                 display: flex;
                 justify-content: space-around;
                 margin-bottom: 20px;
                 gap: 12px;
             }
             
             .stat-item {
                 display: flex;
                 align-items: center;
                 gap: 8px;
                 padding: 10px;
                 background: rgba(33, 150, 243, 0.1);
                 border-radius: 8px;
                 border: 1px solid rgba(33, 150, 243, 0.2);
                 flex: 1;
             }
             
             .stat-icon {
                 font-size: 18px;
                 color: #2196f3;
             }
             
             .stat-content {
                 text-align: left;
             }
             
             .stat-value {
                 font-size: 14px;
                 font-weight: 700;
                 color: #1e3c72;
                 margin-bottom: 2px;
             }
             
             .stat-label {
                 font-size: 10px;
                 color: #666;
                 font-weight: 500;
             }
             
             /* Achievement message */
             .achievement-message {
                 margin-bottom: 20px;
                 padding: 12px;
                 background: rgba(76, 175, 80, 0.1);
                 border-radius: 8px;
                 border-left: 2px solid #4caf50;
             }
             
             .achievement-message p {
                 font-size: 12px;
                 line-height: 1.4;
                 color: #333;
                 margin: 0;
             }
             
             /* Action buttons */
             .completion-actions-fix {
                 display: flex;
                 flex-direction: column;
                 align-items: center;
                 gap: 14px;
                 margin-top: 24px;
             }
             .btn-row {
                 display: flex;
                 flex-direction: row;
                 gap: 10px;
                 margin-bottom: 0;
             }
             .btn-outline-hof, .btn-outline-share {
                 padding: 4px 12px;
                 border: 1.2px solid #6a82fb;
                 border-radius: 7px;
                 background: #fff;
                 color: #6a82fb;
                 font-size: 0.85rem;
                 font-weight: 500;
                 cursor: pointer;
                 transition: all 0.2s;
                 display: flex;
                 align-items: center;
                 gap: 4px;
             }
             .btn-outline-hof:hover, .btn-outline-share:hover {
                 background: #f3f6ff;
                 border-color: #fc5c7d;
                 color: #fc5c7d;
                 transform: translateY(-2px) scale(1.03);
             }
             .btn-close-fix {
                 margin-top: 2px;
                 padding: 4px 18px;
                 border: 1.2px solid #e74c3c;
                 border-radius: 7px;
                 background: #fff;
                 color: #e74c3c;
                 font-size: 0.85rem;
                 font-weight: 500;
                 cursor: pointer;
                 transition: all 0.2s;
                 display: flex;
                 align-items: center;
                 justify-content: center;
             }
             .btn-close-fix:hover {
                 background: #ffeaea;
                 border-color: #c0392b;
                 color: #c0392b;
                 transform: translateY(-2px) scale(1.03);
             }
             .btn-emoji {
                 font-size: 1.1em;
                 margin-left: 3px;
             }
             @media (max-width: 600px) {
                 .btn-row {
                     flex-direction: column;
                     gap: 8px;
                 }
                 .btn-outline-hof, .btn-outline-share, .btn-close-fix {
                 width: 100%;
             }
             }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        
                 // Sequence animation untuk efek board game terbuka
         setTimeout(() => {
             const boardGameBox = overlay.querySelector('#boardGameBox');
             const completionContent = overlay.querySelector('#completionContent');
             
             if (boardGameBox && completionContent) {
                 // Mulai animasi box terbuka
                 boardGameBox.classList.add('box-opening');
                 
                 // Setelah box terbuka, tampilkan completion content
                 setTimeout(() => {
                     completionContent.style.display = 'flex';
                     completionContent.style.animation = 'fadeIn 1s ease-out';
                     
                     // Trigger explosion effect
                     const explosionEffect = completionContent.querySelector('.explosion-effect');
                     if (explosionEffect) {
                         explosionEffect.style.display = 'block';
                     }
                 }, 1200);
             }
         }, 2000);
        

        
        // Buat fungsi closeCompletionOverlay global
        window.closeCompletionOverlay = async () => {
            try {
                // Ambil data karakter dari localStorage
                const characterData = localStorage.getItem('characterData');
                
                if (characterData) {
                    const character = JSON.parse(characterData);
                    
                    // Ambil waktu bermain dari timer UI
                    let waktuBermain = '00:00:00';
                    if (this.ui && typeof this.ui.getElapsedTime === 'function') {
                        waktuBermain = this.ui.getElapsedTime();
                    } else {
                        // Fallback: ambil dari elemen timer di UI
                        const timerElement = document.getElementById('gameTimer');
                        if (timerElement) {
                            waktuBermain = timerElement.textContent;
                        }
                    }
                    
                    // Ambil data game saat ini (game completion - selalu selesai)
                    const gameData = {
                        nama: character.nama,
                        poin: this.player.points,
                        position: 39, // Posisi finish untuk game completion
                        waktu: waktuBermain,
                        hairColor: character.hairColor || null,
                        hatColor: character.hatColor || null,
                        shirtColor: character.shirtColor || null,
                        tieColor: character.tieColor || null,
                        pantColor: character.pantColor || null,
                        skinColor: character.skinColor || null,
                        shoesColor: character.shoesColor || null,
                        hairStyle: character.hairStyle || null,
                        expression: character.expression || null
                    };
                    
                    console.log('Menyimpan data game completion:', gameData);
                    console.log('Posisi yang dikirim:', gameData.position);
                    console.log('Status yang diharapkan: selesai');
                    
                    // Kirim data ke API save_game_progress
                    const response = await fetch('api/save_game_progress.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(gameData)
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        console.log('Progress game completion berhasil disimpan:', result.message);
                        console.log('Data yang disimpan:', gameData);
                        console.log('Status yang dikembalikan API:', result.status_game);
                        console.log('Response lengkap:', result);
                        
                        // Tampilkan notifikasi singkat sebelum redirect
                        const notification = document.createElement('div');
                        notification.style.cssText = `
                            position: fixed;
                            top: 20px;
                            right: 20px;
                            background: #FFD700;
                            color: #333;
                            padding: 15px 20px;
                            border-radius: 8px;
                            z-index: 10000;
                            font-family: 'Poppins', sans-serif;
                            font-size: 14px;
                            font-weight: bold;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                            animation: slideInRight 0.5s ease-out;
                        `;
                        notification.textContent = '🏆 Game selesai! Skor Anda telah masuk ke papan peringkat!';
                        document.body.appendChild(notification);
                        
                        // Hapus notifikasi setelah 3 detik
                        setTimeout(() => {
                            if (notification.parentNode) {
                                notification.parentNode.removeChild(notification);
                            }
                        }, 3000);
                    } else {
                        console.error('Gagal menyimpan progress game completion:', result.error);
                    }
                }
            } catch (error) {
                console.error('Error saat menyimpan progress game completion:', error);
            }
            
            // Delay sebentar agar notifikasi bisa terlihat sebelum redirect
            setTimeout(() => {
                // Redirect ke halaman index awal
                window.location.href = 'index.html';
            }, 2000);
        };
        

    }
    
    }

// Utility pesan sukses misi seragam
function showMissionSuccess({ title = "Misi Sukses!", desc = "", points = 0, icon = "fas fa-shield-alt", onClose = null }) {
    // Hapus pesan sukses sebelumnya jika ada
    document.querySelectorAll('.simple-success-message').forEach(e => e.remove());

    const successMessage = document.createElement('div');
    successMessage.className = 'simple-success-message';
    // Tampilkan + jika positif, - jika negatif
    let pointsDisplay = points > 0 ? `+${points}` : points < 0 ? `${points}` : '0';
    successMessage.innerHTML = `
        <div class="success-card">
            <button class="success-close-btn" title="Tutup">&times;</button>
            <div class="success-icon"><i class="${icon}"></i></div>
            <div class="success-title">${title}</div>
            <div class="success-desc">${desc}</div>
            <div class="success-points">${pointsDisplay}</div>
            <div class="success-label">Poin Keamanan</div>
        </div>
    `;

    // Tambahkan style hanya sekali
    if (!document.getElementById('simple-success-style')) {
        const style = document.createElement('style');
        style.id = 'simple-success-style';
        style.textContent = `
            .simple-success-message {
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(30,41,59,0.10);
                backdrop-filter: blur(1.5px);
                display: flex; align-items: center; justify-content: center;
                z-index: 2000;
                animation: fadeIn 0.3s;
            }
            .success-card {
                background: #fff;
                border-radius: 14px;
                box-shadow: 0 2px 16px rgba(0,0,0,0.10);
                padding: 18px 16px 14px 16px;
                text-align: center;
                min-width: 0;
                max-width: 350px;
                width: 100%;
                animation: popIn 0.3s;
                position: relative;
            }
            .success-close-btn {
                position: absolute;
                top: 7px;
                right: 10px;
                background: none;
                border: none;
                font-size: 1.15rem;
                color: #888;
                cursor: pointer;
                z-index: 10;
                transition: color 0.2s;
                padding: 0;
                line-height: 1;
            }
            .success-close-btn:hover {
                color: #2196f3;
            }
            .success-icon i {
                color: #2196f3;
                font-size: 28px;
                margin-bottom: 6px;
            }
            .success-title {
                font-size: 1.05rem;
                font-weight: 700;
                color: #2196f3;
                margin-bottom: 6px;
                letter-spacing: 0.5px;
            }
            .success-desc {
                color: #444;
                font-size: 0.95rem;
                margin-bottom: 10px;
            }
            .success-points {
                font-size: 1.4rem;
                font-weight: 700;
                color: #2196f3;
                margin-bottom: 1px;
            }
            .success-label {
                color: #888;
                font-size: 0.85rem;
                letter-spacing: 0.5px;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes popIn {
                from { transform: scale(0.95); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(successMessage);

    // Tombol close
    const closeBtn = successMessage.querySelector('.success-close-btn');
    closeBtn.addEventListener('click', () => {
        successMessage.style.animation = 'fadeOut 0.4s forwards';
        setTimeout(() => {
            successMessage.remove();
            if (typeof onClose === 'function') onClose();
        }, 400);
    });
}

// Export kelas untuk digunakan di file lain
window.Player = Player;
window.Game = Game; 