/**
 * Fitur untuk melanjutkan permainan dari database
 */

class ContinueGameManager {
    constructor() {
        this.isCheckingProgress = false;
    }

    /**
     * Cek apakah ada progress tersimpan untuk pemain tertentu
     */
    async checkGameProgress(playerName) {
        if (this.isCheckingProgress) return null;
        
        this.isCheckingProgress = true;
        
        try {
            console.log('🔍 Mengecek progress untuk pemain:', playerName);
            const response = await fetch(`api/get_game_progress.php?nama=${encodeURIComponent(playerName)}`);
            const result = await response.json();
            
            console.log('📊 Hasil pengecekan progress:', result);
            
            if (result.success && result.data) {
                console.log('✅ Progress ditemukan:', result.data);
                return result.data;
            } else {
                console.log('❌ Tidak ada progress tersimpan atau data tidak valid');
                return null;
            }
        } catch (error) {
            console.error('❌ Error saat mengecek progress:', error);
            return null;
        } finally {
            this.isCheckingProgress = false;
        }
    }

    /**
     * Tampilkan dialog konfirmasi untuk melanjutkan permainan
     */
    showContinueDialog(progress, playerName) {
        return new Promise((resolve) => {
            // Langsung lanjutkan permainan tanpa konfirmasi
            resolve(true);
        });
    }

    /**
     * Terapkan progress ke game
     */
    applyProgress(progress, game, ui) {
        try {
            console.log('🔧 Menerapkan progress ke game:', progress);
            
            // Terapkan ke player
            const player = game.getPlayer();
            if (player) {
                const oldPosition = player.position;
                const oldPoints = player.points;
                
                player.points = progress.poin || 200;
                player.position = progress.position || 0;
                
                console.log(`📊 Player updated: position ${oldPosition} → ${player.position}, points ${oldPoints} → ${player.points}`);
            }

            // Terapkan timer jika ada
            if (progress.waktu && ui && typeof ui.setElapsedTime === 'function') {
                ui.setElapsedTime(progress.waktu);
                console.log('⏰ Timer diterapkan:', progress.waktu);
            }

            // Simpan ke localStorage untuk digunakan game
            localStorage.setItem('gameProgress', JSON.stringify(progress));
            console.log('💾 Progress disimpan ke localStorage');

            console.log('✅ Progress berhasil diterapkan:', progress);
            return true;
        } catch (error) {
            console.error('❌ Error saat menerapkan progress:', error);
            return false;
        }
    }

    /**
     * Proses melanjutkan permainan
     */
    async processContinueGame(playerName, game, ui) {
        try {
            console.log('🎮 Memproses melanjutkan permainan untuk:', playerName);
            
            // Cek progress di database
            const progress = await this.checkGameProgress(playerName);
            
            if (progress && progress.position !== undefined && progress.position !== null) {
                console.log('📈 Menerapkan progress yang valid:', progress);
                // Hanya terapkan progress jika ada data yang valid
                const success = this.applyProgress(progress, game, ui);
                
                if (success) {
                    console.log('✅ Permainan berhasil dilanjutkan dari database:', progress);
                    return true;
                }
            } else {
                // Tidak ada progress tersimpan atau data tidak valid
                console.log('🆕 Tidak ada progress tersimpan atau data tidak valid - menginisialisasi user baru');
                
                // Pastikan player dimulai dari posisi 0 untuk user baru
                const player = game.getPlayer();
                if (player) {
                    player.position = 0;
                    player.points = 200;
                    console.log('🎯 Player diinisialisasi ke posisi 0 untuk user baru');
                }
                
                return false;
            }
        } catch (error) {
            console.error('❌ Error saat memproses melanjutkan permainan:', error);
            return false;
        }
    }

    /**
     * Hapus progress dari localStorage setelah dimuat
     */
    clearLoadedProgress() {
        localStorage.removeItem('gameProgress');
    }
}

// Buat instance global
window.continueGameManager = new ContinueGameManager(); 