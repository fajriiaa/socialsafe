document.addEventListener('DOMContentLoaded', () => {
    const startInvestigationBtn = document.getElementById('startInvestigation');
    const viewEvidenceBtn = document.getElementById('viewEvidence');
    const investigationContent = document.getElementById('investigationContent');

    // Data materi keamanan cyber
    const cyberSecurityMaterials = [
        {
            title: "UU ITE (Undang-Undang Informasi dan Transaksi Elektronik)",
            content: `
Pelajari Undang-Undang No. 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik yang mengatur aktivitas digital.
<br><br>
<b>Pokok-pokok Materi:</b><br>
- <b>Definisi UU ITE:</b><br>
UU ITE adalah peraturan yang mengatur informasi elektronik, transaksi elektronik, dan dokumen elektronik, serta perlindungan data dan sanksi atas pelanggaran di dunia digital.<br><br>
- <b>Pasal Penting Terkait Penyebaran Informasi Palsu:</b><br>
<b>Pasal 28 Ayat (1):</b><br>
<i>"Setiap Orang dengan sengaja dan tanpa hak menyebarkan berita bohong dan menyesatkan yang mengakibatkan kerugian konsumen dalam Transaksi Elektronik dapat dipidana penjara paling lama 6 (enam) tahun dan/atau denda paling banyak Rp1.000.000.000,00 (satu miliar rupiah)."</i><br><br>
- <b>Contoh Pelanggaran:</b><br>
  • Menyebarkan hoaks atau berita palsu di media sosial.<br>
  • Membagikan informasi yang belum terverifikasi kebenarannya.<br>
  • Membuat postingan yang menyesatkan publik.<br><br>
- <b>Sanksi:</b><br>
  • Pidana penjara maksimal 6 tahun.<br>
  • Denda maksimal 1 miliar rupiah.<br><br>
- <b>Tips Aman di Dunia Digital:</b><br>
  • Selalu cek kebenaran informasi sebelum membagikan.<br>
  • Jangan mudah percaya pada berita viral tanpa sumber jelas.<br>
  • Laporkan konten hoaks ke platform terkait.<br>
            `
        }
    ];

    // Data pelanggaran cyber
    const cyberViolations = [
        {
            type: "Penyebaran Informasi Palsu",
            description: "Menyebarkan berita hoax dan informasi palsu",
            law: "UU ITE Pasal 28 Ayat (1)",
            lawText: "Setiap Orang dengan sengaja dan tanpa hak menyebarkan berita bohong dan menyesatkan yang mengakibatkan kerugian konsumen dalam Transaksi Elektronik",
            penalty: "Pidana penjara maksimal 6 tahun dan/atau denda maksimal Rp1.000.000.000",
            gamePoints: 200,
            gameMessage: "Anda telah melanggar UU ITE dengan menyebarkan informasi palsu!"
        },
        {
            type: "Penyalahgunaan Data Pribadi",
            description: "Menggunakan data pribadi tanpa izin",
            law: "UU PDP Pasal 65",
            lawText: "Setiap Orang dilarang secara melawan hukum mengungkapkan Data Pribadi yang bukan miliknya.",
            penalty: "Pidana penjara maksimal 5 tahun dan/atau denda maksimal Rp5.000.000.000",
            gamePoints: 200,
            gameMessage: "Anda telah melanggar UU PDP dengan menyalahgunakan data pribadi orang lain!"
        }
    ];

    let selectedViolation = null;

    // Event listeners
    startInvestigationBtn.addEventListener('click', () => {
        startCyberInvestigation();
    });

    viewEvidenceBtn.addEventListener('click', () => {
        showEvidence();
    });

    // Event delegation yang lebih sederhana
    document.body.addEventListener('click', function(e) {
        // Untuk tombol Mulai Investigasi dan Lanjutkan Investigasi
        if (e.target && e.target.classList.contains('btn-primary')) {
            const text = e.target.textContent.trim();
            if (text === 'Mulai Investigasi') {
                startCyberInvestigation();
            } else if (text === 'Lanjutkan Investigasi') {
                startCyberInvestigation();
            }
        }
    });

    function startCyberInvestigation() {
        selectedViolation = cyberViolations[0]; // Selalu pilih pelanggaran 'Penyebaran Informasi Palsu'
        // Simulasi proses investigasi cyber
        const investigationSteps = [
            "Mengumpulkan bukti digital...",
            "Menganalisis aktivitas online...",
            "Mengidentifikasi pelanggaran UU ITE...",
            "Menyiapkan laporan investigasi cyber...",
            "Memverifikasi bukti pelanggaran..."
        ];

        let currentStep = 0;
        const content = document.querySelector('.investigation-content');

        // Menampilkan langkah-langkah investigasi
        const showNextStep = () => {
            if (currentStep < investigationSteps.length) {
                content.innerHTML = `
                    <div class="investigation-progress">
                        <div class="investigation-progress-icon" style="text-align:center; margin-bottom:8px;">
                            <i class="fas fa-search" style="font-size:32px; color:#1e3a8a;"></i>
                        </div>
                        <h3>Proses Investigasi Cyber</h3>
                        <p>${investigationSteps[currentStep]}</p>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${(currentStep + 1) * 20}%"></div>
                        </div>
                        <p style="font-size: 10px; color: #666; margin-top: 10px;">
                            Langkah ${currentStep + 1} dari ${investigationSteps.length}
                        </p>
                    </div>
                `;
                currentStep++;
                setTimeout(showNextStep, 2000);
            } else {
                showViolationResult();
            }
        };

        showNextStep();
    }

    function showEvidence() {
        const content = document.querySelector('.investigation-content');
        content.innerHTML = `
            <div class="evidence-container">
                <h3><i class="fas fa-file-alt"></i> Bukti Pelanggaran Cyber</h3>
                <div class="evidence-item">
                    <h4><i class="fas fa-exclamation-triangle"></i> Aktivitas Mencurigakan</h4>
                    <p>Ditemukan aktivitas penyebaran informasi palsu melalui akun media sosial</p>
                </div>
                <div class="evidence-item">
                    <h4><i class="fas fa-user-secret"></i> Pelanggaran Privasi</h4>
                    <p>Penggunaan data pribadi tanpa izin pemilik data</p>
                </div>
                <div class="evidence-item">
                    <h4><i class="fas fa-gavel"></i> Pelanggaran UU ITE</h4>
                    <p>Melanggar Undang-Undang Informasi dan Transaksi Elektronik</p>
                </div>
                <div class="evidence-item">
                    <h4><i class="fas fa-clock"></i> Waktu Pelanggaran</h4>
                    <p>Pelanggaran terjadi dalam 24 jam terakhir</p>
                </div>
                <button onclick="startCyberInvestigation()" class="btn-primary" style="margin-top: 15px;">
                    <i class="fas fa-search"></i> Lanjutkan Investigasi
                </button>
            </div>
        `;
    }

    function showViolationResult() {
        const content = document.querySelector('.investigation-content');
        
        // Buat tombol terpisah dengan ID unik
        const buttonId = 'terima-hukuman-btn-' + Date.now();
        
        content.innerHTML = `
            <div class="violation-result">
                <div style="text-align:center; margin-bottom:8px;">
                    <i class="fas fa-exclamation-triangle" style="font-size:32px; color:#dc2626;"></i>
                </div>
                <h3>Hasil Investigasi Cyber</h3>
                <div class="violation-details">
                    <p class="game-message">${selectedViolation.gameMessage}</p>
                    <div class="law-reference">
                        <p class="law-title">${selectedViolation.law}</p>
                        <p class="law-text">${selectedViolation.lawText}</p>
                    </div>
                    <div class="penalty">
                        <p><i class="fas fa-gavel"></i> Sanksi: ${selectedViolation.penalty}</p>
                        <p><i class="fas fa-coins"></i> Denda Game: ${selectedViolation.gamePoints} Poin</p>
                        <p><i class="fas fa-clock"></i> Masa Suspensi: 3 menit</p>
                    </div>
                </div>
                <div style="margin-top: 20px; text-align: center;">
                    <button id="${buttonId}" class="btn-primary" style="width: 100%; padding: 12px; font-size: 12px; font-weight: 700; background: #dc2626; border: none; color: white; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);">
                        TERIMA HUKUMAN
                    </button>
                </div>
            </div>
        `;
        
        // Tambahkan event listener dengan cara yang paling sederhana
        const button = document.getElementById(buttonId);
        if (button) {
            button.onclick = function() {
                console.log('Tombol TERIMA HUKUMAN diklik!');
                startPenaltyFunction();
            };
        }
    }

    function updateHeaderTimer(timeLeft) {
        const timerSpan = document.getElementById('suspension-timer');
        const titleSpan = document.getElementById('investigation-title');
        if (timerSpan && titleSpan) {
            if (typeof timeLeft === 'number' && timeLeft > 0) {
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                timerSpan.textContent = `${minutes}:${seconds.toString().padStart(2, '0')} `;
                titleSpan.style.display = 'none';
            } else {
                timerSpan.textContent = '';
                titleSpan.style.display = '';
            }
        }
    }

    function startPenaltyFunction() {
        window.scrollTo(0, 0);
        const content = document.querySelector('.investigation-content');
        let timeLeft = 5; // 5 detik masa suspensi
        // Hentikan timer sebelumnya jika ada
        if (window.penaltyTimer) clearInterval(window.penaltyTimer);
        // Header tetap judul di halaman suspensi utama
        updateHeaderTimer(0);
        let suspensiSelesai = false;
        const selesaiId = 'selesai-btn';
        window.penaltyTimer = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            // Buat ID unik untuk tombol Pelajari Materi
            const pelajariMateriId = 'pelajari-materi-btn-' + Date.now();
            content.innerHTML = `
                <div class="penalty-screen">
                    <h3 style="margin-bottom:18px;">Masa Suspensi</h3>
                    <div class="timer">
                        <span class="time">${minutes}:${seconds.toString().padStart(2, '0')}</span>
                    </div>
                    <p class="game-text" style="font-size:10px;">Gunakan waktu ini untuk memahami pentingnya mematuhi UU ITE</p>
                    <div style="margin-top: 15px; display: flex; flex-direction: column; gap: 10px;">
                        <button id="${pelajariMateriId}" class="btn-secondary" style="width: 100%; padding: 10px; font-size: 11px; font-weight: 600; background: #6b7280; border: none; color: white; border-radius: 6px; cursor: pointer; box-shadow: 0 2px 4px rgba(107, 114, 128, 0.3);">
                            <i class="fas fa-book" style="margin-right: 6px;"></i>
                            Pelajari Materi
                        </button>
                        <button id="${selesaiId}" class="btn-primary" style="width: 100%; padding: 10px; font-size: 11px; font-weight: 600; background: ${suspensiSelesai ? '#1e3a8a' : '#bdbdbd'}; border: none; color: ${suspensiSelesai ? 'white' : '#888'}; border-radius: 6px; cursor: ${suspensiSelesai ? 'pointer' : 'not-allowed'};" ${suspensiSelesai ? '' : 'disabled'}>
                            <i class="fas fa-check" style="margin-right: 6px;"></i>
                            Selesai
                        </button>
                    </div>
                </div>
            `;
            const pelajariMateriBtn = document.getElementById(pelajariMateriId);
            if (pelajariMateriBtn) {
                pelajariMateriBtn.onclick = function() {
                    showMaterialsFunction(timeLeft);
                };
            }
            const selesaiBtn = document.getElementById(selesaiId);
            if (selesaiBtn) {
                selesaiBtn.onclick = function() {
                    if (!selesaiBtn.disabled) {
                        completeInvestigationFunction();
                    }
                };
            }
            if (timeLeft <= 0) {
                clearInterval(window.penaltyTimer);
                updateHeaderTimer(0);
                suspensiSelesai = true;
                // Aktifkan tombol selesai jika sudah ada di DOM
                const selesaiBtn = document.getElementById(selesaiId);
                if (selesaiBtn) {
                    selesaiBtn.disabled = false;
                    selesaiBtn.style.background = '#1e3a8a';
                    selesaiBtn.style.color = 'white';
                    selesaiBtn.style.cursor = 'pointer';
                }
            }
            timeLeft--;
        }, 1000);
    }

    function showMaterialsFunction(timeLeftSuspensi) {
        if (window.penaltyTimer) clearInterval(window.penaltyTimer);
        // Header biru tampilkan timer di halaman materi
        updateHeaderTimer(timeLeftSuspensi);
        if (typeof timeLeftSuspensi === 'number' && timeLeftSuspensi > 0) {
            window.penaltyTimer = setInterval(() => {
                timeLeftSuspensi--;
                updateHeaderTimer(timeLeftSuspensi);
                if (timeLeftSuspensi <= 0) {
                    clearInterval(window.penaltyTimer);
                    updateHeaderTimer(0);
                    completeInvestigationFunction();
                }
            }, 1000);
        }
        const content = document.querySelector('.investigation-content');
        const material = cyberSecurityMaterials[0];
        const kembaliId = 'kembali-btn-' + Date.now();
        content.innerHTML = `
            <div class="material-item">
                <h3>${material.title}</h3>
                <p>${material.content}</p>
                <div style="margin-top: 18px;">
                    <button id="${kembaliId}" class="btn-secondary" style="width: 100%; padding: 10px; font-size: 11px; font-weight: 600; background: #6b7280; border: none; color: white; border-radius: 6px; cursor: pointer;">
                        <i class="fas fa-arrow-left" style="margin-right: 6px;"></i>
                        Kembali
                    </button>
                </div>
            </div>
        `;
        const kembaliBtn = document.getElementById(kembaliId);
        if (kembaliBtn) {
            kembaliBtn.onclick = function() {
                startPenaltyFunction();
            };
        }
    }

    function studyMaterialFunction(materialIndex, timeLeftSuspensi) {
        if (window.penaltyTimer) clearInterval(window.penaltyTimer);
        // Header biru tampilkan timer di halaman materi
        updateHeaderTimer(timeLeftSuspensi);
        if (typeof timeLeftSuspensi === 'number' && timeLeftSuspensi > 0) {
            window.penaltyTimer = setInterval(() => {
                timeLeftSuspensi--;
                updateHeaderTimer(timeLeftSuspensi);
                if (timeLeftSuspensi <= 0) {
                    clearInterval(window.penaltyTimer);
                    updateHeaderTimer(0);
                    completeInvestigationFunction();
                }
            }, 1000);
        }
        const content = document.querySelector('.investigation-content');
        const material = cyberSecurityMaterials[materialIndex];
        // Tampilkan materi dan tombol Kembali di bawahnya
        const kembaliId = 'kembali-btn-' + Date.now();
        content.innerHTML = `
            <div class="material-item">
                <h3><i class="fas fa-book"></i> ${material.title}</h3>
                <p>${material.content}</p>
                <div style="margin-top: 18px;">
                    <button id="${kembaliId}" class="btn-secondary" style="width: 100%; padding: 10px; font-size: 11px; font-weight: 600; background: #6b7280; border: none; color: white; border-radius: 6px; cursor: pointer;">
                        <i class="fas fa-arrow-left" style="margin-right: 6px;"></i>
                        Kembali
                    </button>
                </div>
            </div>
        `;
        const kembaliBtn = document.getElementById(kembaliId);
        if (kembaliBtn) {
            kembaliBtn.onclick = function() {
                startPenaltyFunction();
            };
        }
    }

    // Pastikan updateHeaderTimer(0) dipanggil di completeInvestigationFunction dan closeInvestigationFunction
    function completeInvestigationFunction() {
        updateHeaderTimer(0);
        const content = document.querySelector('.investigation-content');
        
        // Buat ID unik untuk tombol Tutup
        const tutupId = 'tutup-btn-' + Date.now();
        
        content.innerHTML = `
            <div class="completion-message">
                <h3><i class="fas fa-check-circle"></i> Masa Suspensi Selesai</h3>
                <p class="game-text">Anda telah menyelesaikan masa hukuman cyber Anda.</p>
                <p class="game-text">Ingatlah untuk selalu mematuhi UU ITE dan berperilaku baik di dunia digital!</p>
                <div style="margin-top: 20px;">
                    <button id="${tutupId}" class="btn-primary" style="width: 100%; padding: 10px; font-size: 11px; font-weight: 600; background: #1e3a8a; border: none; color: white; border-radius: 6px; cursor: pointer; box-shadow: 0 2px 4px rgba(30, 58, 138, 0.3);">
                        <i class="fas fa-times" style="margin-right: 6px;"></i>
                        Tutup
                    </button>
                </div>
            </div>
        `;
        
        // Tambahkan event listener untuk tombol Tutup
        const tutupBtn = document.getElementById(tutupId);
        if (tutupBtn) {
            tutupBtn.onclick = function() {
                console.log('Tombol Tutup diklik!');
                closeInvestigationFunction();
            };
        }
    }

    function closeInvestigationFunction() {
        updateHeaderTimer(0);
        // Kirim pesan ke parent window bahwa investigasi selesai
        if (window.parent) {
            window.parent.postMessage({
                type: 'gameCompleted',
                points: -200, // Kurangi 200 poin sebagai hukuman
                message: 'Cyber Investigation selesai'
            }, '*');
        }
    }

    // Pastikan semua fungsi utama berada di global scope
    window.startPenalty = startPenaltyFunction;
    window.showMaterials = showMaterialsFunction;
    window.studyMaterial = studyMaterialFunction;
    window.completeInvestigation = completeInvestigationFunction;
    window.closeInvestigation = closeInvestigationFunction;

    // Pastikan fungsi startCyberInvestigation juga global
    window.startCyberInvestigation = startCyberInvestigation;
}); 