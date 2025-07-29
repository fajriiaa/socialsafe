/**
 * Data untuk boardgame socisafe
 * Berisi 40 kotak
 */
const BOARD_DATA = [
    // Kotak Khusus
    {
        id: 0,
        type: 'corner',
        name: 'Mission Start',
        description: 'Mulai perjalanan keamanan siber Anda',
        action: 'collect',
        value: 200,
        position: { row: 10, col: 10 }
    },
    {
        id: 10,
        type: 'corner',
        name: 'Cyber Investigation',
        description: 'Ups! Kamu dilaporkan atas aktivitas yang melanggar UU ITE',
        action: 'jail',
        position: { row: 10, col: 0 }
    },
    {
        id: 20,
        type: 'corner',
        name: 'Secure Spot',
        description: 'Area bebas ancaman',
        action: 'free',
        position: { row: 0, col: 0 }
    },
    {
        id: 30,
        type: 'corner',
        name: 'Go to Cyber Investigation',
        description: 'Terdeteksi melakukan aktivitas mencurigakan',
        action: 'goto-jail',
        position: { row: 0, col: 10 }
    },

    // Kotak Properti
    {
        id: 1,
        type: 'property',
        group: 'basic-security',
        color: '#91C8E4',
        name: 'SafeKey',
        description: 'Password kuat, akun selamat!',
        price: 20,
        position: { row: 10, col: 9 }
    },
    {
        id: 3,
        type: 'property',
        group: 'basic-security',
        color: '#91C8E4',
        name: 'PassQuiz',
        description: 'Yuk, uji seberapa paham kamu soal password!',
        price: 60,
        position: { row: 10, col: 7 }
    },

    {
        id: 4,
        type: 'property',
        name: 'VerifiMe',
        color: '#91C8E4',
        description: 'Dua langkah, perlindungan ganda',
        price: 20,
        position: { row: 10, col: 6 }
    },

    {
        id: 6,
        type: 'property',
        group: 'network-security',
        color: '#F97A00',
        name: 'Phishing',
        description: 'Phishing bisa nyamar jadi siapa aja, kenali trik-triknya!',
        price: 100,
        position: { row: 10, col: 4 }
    },
    {
        id: 8,
        type: 'property',
        group: 'network-security',
        color: '#F97A00',
        name: 'LinkTrap',
        description: 'Kelihatan mirip, tapi bisa berbahaya. Bisa bedain link asli dan palsu?',
        price: 100,
        position: { row: 10, col: 2 }
    },
    {
        id: 9,
        type: 'property',
        group: 'network-security',
        color: '#F97A00',
        name: 'Don\'t Click!',
        description: 'Oops! Kamu nggak sengaja klik link jebakan',
        price: 20,
        position: { row: 10, col: 1 }
    },

    {
        id: 11,
        type: 'property',
        group: 'device-security',
        color: '#FFE8CD',
        name: 'Fake Account',
        description: 'Hati-hati! Kenali ciri-ciri akun palsu sebelum jadi korban',
        price: 140,
        position: { row: 9, col: 0 }
    },
    {
        id: 13,
        type: 'property',
        group: 'device-security',
        color: '#FFE8CD',
        name: 'Suspicious Account',
        description: 'Cek akun mencurigakan dan report jika palsu!',
        price: 140,
        position: { row: 7, col: 0 }
    },
    {
        id: 14,
        type: 'property',
        group: 'device-security',
        color: '#FFE8CD',
        name: 'Don\'t Trust it',
        description: 'Oops! Kamu tertipu pesan jebakan dan kasih info login, akunmu kini dikuasai orang lain',
        price: 160,
        position: { row: 6, col: 0 }
    },

    {
        id: 16,
        type: 'property',
        group: 'data-security',
        color: '#7965C1',
        name: 'Protect Your Info',
        description: 'Nggak semua hal harus dibagikan. Saatnya belajar batasan privasi akunmu!',
        price: 180,
        position: { row: 4, col: 0 }
    },
    {
        id: 18,
        type: 'property',
        group: 'data-security',
        color: '#7965C1',
        name: 'Know Your Privacy',
        description: 'Siap-siap! Kuis ini akan menguji seberapa paham kamu soal privasi akun.',
        price: 180,
        position: { row: 2, col: 0 }
    },
    {
        id: 19,
        type: 'property',
        group: 'data-security',
        color: '#7965C1',
        name: 'Privacy Challenge',
        description: 'Kamu bagikan info pribadi lewat tren viral!',
        price: 200,
        position: { row: 1, col: 0 }
    },

    {
        id: 21,
        type: 'property',
        group: 'app-security',
        color: '#4E71FF',
        name: 'Threat Shooter',
        description: 'Kamu diserang? Bisa jadi malware! Kenali jenis-jenisnya sebelum terlambat',
        price: 220,
        position: { row: 0, col: 1 }
    },
    {
        id: 23,
        type: 'property',
        group: 'app-security',
        color: '#4E71FF',
        name: 'Malword',
        description: 'Waktunya uji wawasan malware! Tebak kata dari huruf yang diacak.',
        price: 220,
        position: { row: 0, col: 3 }
    },
    {
        id: 24,
        type: 'property',
        group: 'app-security',
        color: '#4E71FF',
        name: 'Malware Attack',
        description: 'Ups! Kamu tertipu aplikasi palsu dan malware berhasil masuk',
        price: 240,
        position: { row: 0, col: 4 }
    },
    {
        id: 26,
        type: 'property',
        group: 'cloud-security',
        color: '#2ecc71',
        name: 'Digital Impostor',
        description: 'Deepfake bisa bikin orang terlihat berkata hal yang nggak pernah mereka ucapkan.',
        price: 260,
        position: { row: 0, col: 6 }
    },
    {
        id: 27,
        type: 'property',
        group: 'cloud-security',
        color: '#2ecc71',
        name: 'AI Hoax',
        description: 'Coba tebak, konten ini nyata atau palsu?',
        price: 260,
        position: { row: 0, col: 7 }
    },
    {
        id: 29,
        type: 'property',
        group: 'cloud-security',
        color: '#2ecc71',
        name: 'Fake Video!',
        description: 'Kamu jadi korban manipulasi digital. Deepfake berhasil mengecohmu!',
        price: 280,
        position: { row: 0, col: 9 }
    },
    {
        id: 31,
        type: 'property',
        group: 'advanced-security',
        color: '#89A8B2',
        name: 'Digital Privacy',
        description: 'Posting dan data punya aturan main! Yuk, pelajari PDP biar gak asal sebar',
        price: 300,
        position: { row: 1, col: 10 }
    },
    {
        id: 32,
        type: 'property',
        group: 'advanced-security',
        color: '#89A8B2',
        name: 'Privacy Violation',
        description: 'Kamu menggunakan identitas orang lain untuk menipu!',
        price: 300,
        position: { row: 2, col: 10 }
    },
    {
        id: 34,
        type: 'property',
        group: 'advanced-security',
        color: '#FF76CE',
        name: 'CyberLaw Puzzle',
        description: 'Cari dan temukan istilah penting seputar UU ITE',
        price: 320,
        position: { row: 4, col: 10 }
    },
    {
        id: 37,
        type: 'property',
        group: 'critical-security',
        color: '#FF76CE',
        name: 'Hate Post',
        description: 'Hati-hati saat posting! Ucapanmu bisa dianggap melanggar hukum',
        price: 350,
        position: { row: 7, col: 10 }
    },
    {
        id: 39,
        type: 'property',
        group: 'critical-security',
        color: '#8e44ad',
        name: 'Mission Complete',
        description: 'Kamu berhasil menyelesaikan misi keamanan!',
        price: 400,
        position: { row: 9, col: 10 }
    },

    // Kotak Utilitas
    {
        id: 5,
        type: 'station',
        name: 'Cyberpedia',
        description: 'Sertifikasi keamanan dasar',
        price: 20,
        position: { row: 10, col: 5 }
    },
    {
        id: 12,
        type: 'station',
        name: 'Cyberpedia',
        description: 'Asuransi untuk risiko keamanan siber',
        price: 150,
        position: { row: 8, col: 0 }
    },
    {
        id: 28,
        type: 'station',
        name: 'Cyberpedia',
        description: 'Pelatihan keamanan untuk karyawan',
        price: 150,
        position: { row: 0, col: 8 }
    },
    {
        id: 38,
        type: 'station',
        name: 'Cyberpedia',
        description: 'Serangan ransomware yang meminta tebusan',
        value: 100,
        position: { row: 8, col: 10 }
    },
    {
        id: 15,
        type: 'station',
        name: 'PassReset',
        description: 'Yuk, ganti kata sandimu! Biar akun tetap aman dari pembobolan',
        price: 200,
        position: { row: 5, col: 0 }
    },
    {
        id: 25,
        type: 'station',
        name: 'PassReset',
        description: 'Akun aman dimulai dari password yang baru',
        price: 200,
        position: { row: 0, col: 5 }
    },
    {
        id: 35,
        type: 'station',
        name: 'PassReset',
        description: 'Sudah saatnya ubah password. Yuk biasakan ganti secara berkala!',
        price: 200,
        position: { row: 5, col: 10 }
    },

    // Kotak Kartu
    {
        id: 2,
        type: 'card',
        cardType: 'cyber-event',
        name: 'EVENT',
        description: 'Kamu mendapatkan Kartu Event! Ambil kartu untuk lihat kejutan seru!',
        position: { row: 10, col: 8 }
    },
    {
        id: 7,
        type: 'card',
        cardType: 'cyber-chance',
        name: 'CHANCE',
        description: 'Kamu mendarat di Kotak Chance! Ambil kartunya dan lihat ke mana takdir membawamu...',
        position: { row: 10, col: 3 }
    },
    {
        id: 17,
        type: 'card',
        cardType: 'cyber-event',
        name: 'EVENT',
        description: 'Kamu mendapatkan Kartu Event! Ambil kartu untuk lihat kejutan seru!',
        position: { row: 3, col: 0 }
    },
    {
        id: 22,
        type: 'card',
        cardType: 'cyber-chance',
        name: 'CHANCE',
        description: 'Kamu mendarat di Kotak Chance! Ambil kartunya dan lihat ke mana takdir membawamu...',
        position: { row: 0, col: 2 }
    },
    {
        id: 33,
        type: 'card',
        cardType: 'cyber-event',
        name: 'EVENT',
        description: 'Kamu mendapatkan Kartu Event! Ambil kartu untuk lihat kejutan seru!',
        position: { row: 3, col: 10 }
    },
    {
        id: 36,
        type: 'card',
        cardType: 'cyber-chance',
        name: 'CHANCE',
        description: 'Kamu mendarat di Kotak Chance! Ambil kartunya dan lihat ke mana takdir membawamu...',
        position: { row: 6, col: 10 }
    }
    
];

/**
 * Kartu Chance
 */
const CYBER_CHANCE_CARDS = [
    {
        id: 1,
        title: 'Koneksi Putus',
        description: 'Lagi scroll, eh… kuota habis di tengah jalan.',
        actionText: 'Kembali ke kotak sebelumnya'
    },
    {
        id: 2,
        title: 'Akses Premium Gratis!',
        description: 'Kamu dapet akses gratis ke tools keamanan premium. Hidupmu lebih aman.',
        actionText: 'Maju 2 langkah'
    },
    {
        id: 3,
        title: 'Kamu Viral...',
        description: 'Postinganmu viral karena info salah. Sekarang kamu harus klarifikasi.',
        actionText: 'Langsung ke kotak Cyber Investigation'
    },
    {
        id: 4,
        title: 'Login Asing',
        description: 'Ada percobaan login dari lokasi yang tidak dikenal.',
        actionText: 'Menuju VerifiMe dan Aktifkan verifikasi dua langkah.'
    },
    {
        id: 5,
        title: 'Salah Kirim Password!',
        description: 'Tanpa sadar kamu kirim password ke grup kelas. Waduh!',
        actionText: 'Menuju Password Reset untuk ganti password'
    },
    {
        id: 6,
        title: 'Akunmu Masuk Trending!',
        description: 'Kamu trending karena kampanye positif soal keamanan digital.',
        actionText: 'Maju 3 langkah'
    },
    {
        id: 7,
        title: 'Update Sistem Berhasil!',
        description: 'Sistem keamananmu diperbarui otomatis. Kamu selangkah lebih aman.',
        actionText: 'Maju 3 langkah'
    },
    {
        id: 8,
        title: 'Akun Dibajak Mantan Teman',
        description: 'Mantan temanmu pakai akunmu buat nyebar spam. Kamu harus lapor!',
        actionText: 'Mundur 2 langkah'
    }
];

/**
 * Kartu Event
 */
const CYBER_EVENT_CARDS = [
    {
        id: 1,
        title: 'Webinar Komunitas Sadar SMKI #4',
        description: 'Kamu ikut webinar tentang keamanan siber! Pengetahuan makin mantap.',
        action: 'collect',
        value: 50,
    },
    {
        id: 2,
        title: 'Report',
        description: 'Kamu membiarkan akun palsu menyebar tipu daya! Waspadalah... .',
        action: 'pay',
        value: 50,
    },
    {
        id: 3,
        title: 'Giveaway Palsu',
        description: 'Kamu tergoda giveaway palsu dan kasih data pribadi! Kamu tertipu',
        action: 'pay',
        value: 50,
    },
    {
        id: 4,
        title: 'Tren Viral',
        description: 'Kamu isi challenge viral yang minta info pribadi! Bahaya tersembunyi…',
        action: 'pay',
        value: 50,
    },
    {
        id: 5,
        title: 'Backup Data',
        description: 'Backup rutin? Good job! Datamu aman dari ancaman',
        action: 'collect',
        value: 50,
    },
    {
        id: 6,
        title: 'Volunter',
        description: 'Kamu aktif di komunitas kampanye edukasi siber! Aksimu berdampak besar',
        action: 'collect',
        value: 50,
    },
    {
        id: 7,
        title: 'Insiden Keamanan',
        description: 'Lupa logout dari perangkat umum! Akunmu hampir diretas',
        action: 'pay',
        value: 50,
    },
    {
        id: 8,
        title: 'Penghargaan Keamanan',
        description: 'Anda menerima penghargaan atas kontribusi di bidang keamanan siber. Dapatkan bonus.',
        action: 'collect',
        value: 50,
    }
];

/**
 * Fungsi untuk membuat papan permainan
 */
class GameBoard {
    constructor() {
        this.tiles = BOARD_DATA;
        this.chanceCards = CYBER_CHANCE_CARDS;
        this.eventCards = CYBER_EVENT_CARDS;
        this.boardElement = document.querySelector('.game-board');
    }

    /**
     * Inisialisasi papan permainan
     */
    initialize() {
        this.renderBoard();
        this.shuffleCards();
    }

    /**
     * Render papan permainan ke DOM
     */
    renderBoard() {
        // Bersihkan papan
        this.boardElement.innerHTML = '';

        // Buat grid 11x11 untuk papan
        for (let row = 0; row <= 10; row++) {
            for (let col = 0; col <= 10; col++) {
                // Hanya buat tile untuk tepi papan (baris/kolom 0 dan 10)
                // atau kotak kosong di tengah
                if (row === 0 || row === 10 || col === 0 || col === 10) {
                    const tile = this.getTileAtPosition(row, col);
                    if (tile) {
                        const tileElement = this.createTileElement(tile);
                        this.boardElement.appendChild(tileElement);
                    }
                } else if (row === 5 && col === 5) {
                    // Tambahkan logo di tengah papan
                    const centerElement = document.createElement('div');
                    centerElement.className = 'board-center';
                    centerElement.style.gridRow = '5 / span 2';
                    centerElement.style.gridColumn = '5 / span 2';
                    centerElement.innerHTML = `
                        <h2>CyberSecurity Monopoly</h2>
                        <div class="board-logo">🔒</div>
                    `;
                    this.boardElement.appendChild(centerElement);
                }
            }
        }
    }

    /**
     * Mendapatkan tile berdasarkan posisi
     */
    getTileAtPosition(row, col) {
        return this.tiles.find(tile => 
            tile.position.row === row && tile.position.col === col
        );
    }

    /**
     * Membuat elemen HTML untuk tile
     */
    createTileElement(tile) {
        const tileElement = document.createElement('div');
        let extraClass = '';
        if (tile.position.row === 0 || tile.position.row === 10) {
            extraClass = ' horizontal-tile';
        }
        tileElement.className = `board-tile tile-${tile.type}${extraClass}`;
        tileElement.dataset.id = tile.id;
        tileElement.style.gridRow = tile.position.row + 1;
        tileElement.style.gridColumn = tile.position.col + 1;

        // Tambahkan konten berdasarkan jenis tile
        if (tile.type === 'corner') {
            tileElement.className += ' corner-tile';
            tileElement.innerHTML = `
            `;
        } else if (tile.type === 'property') {
            if (tile.id === 39) {
                // Kotak 39 tidak memiliki header
                tileElement.innerHTML = `
                    <div class="tile-content">
                    </div>
                `;
            } else {
                tileElement.innerHTML = `
                    <div class="tile-header" style="background-color: ${tile.color}"></div>
                    <div class="tile-content">
                    </div>
                `;
            }
        } else if (tile.type === 'station') {
            tileElement.innerHTML = `
                <div class="tile-content">
                </div>
            `;
        } else if (tile.type === 'utility') {
            tileElement.innerHTML = `
                <div class="tile-header">UTILITAS</div>
                <div class="tile-content">
                    <div class="tile-icon">⚙️</div>
                </div>
            `;
        } else if (tile.type === 'card') {
            tileElement.innerHTML = `
                <div class="tile-content">
                </div>
            `;
        } else if (tile.type === 'tax') {
            tileElement.innerHTML = `
                <div class="tile-content">
                    <div class="tile-icon">💸</div>
                </div>
            `;
        }

        return tileElement;
    }

    /**
     * Acak kartu kesempatan dan peristiwa
     */
    shuffleCards() {
        // Fisher-Yates shuffle algorithm untuk kartu kesempatan
        for (let i = this.chanceCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.chanceCards[i], this.chanceCards[j]] = [this.chanceCards[j], this.chanceCards[i]];
        }
        
        // Fisher-Yates shuffle algorithm untuk kartu peristiwa
        for (let i = this.eventCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.eventCards[i], this.eventCards[j]] = [this.eventCards[j], this.eventCards[i]];
        }
    }

    /**
     * Mendapatkan tile berdasarkan ID
     */
    getTileById(id) {
        return this.tiles.find(tile => tile.id === id);
    }

    /**
     * Ambil kartu kesempatan teratas
     */
    drawChanceCard() {
        const card = this.chanceCards.shift();
        this.chanceCards.push(card); // Letakkan kembali di bawah tumpukan
        return card;
    }
    
    /**
     * Ambil kartu peristiwa teratas
     */
    drawEventCard() {
        const card = this.eventCards.shift();
        this.eventCards.push(card); // Letakkan kembali di bawah tumpukan
        return card;
    }
}

// Export kelas untuk digunakan di file lain
window.GameBoard = GameBoard; 