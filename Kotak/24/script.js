// Fungsi untuk update waktu real-time
function updateTime() {
    const timeElement = document.querySelector('.time');
    if (timeElement) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}`;
    }
}

// Update waktu setiap menit
updateTime();
setInterval(updateTime, 60000);

// Simulasi install APK
document.addEventListener('DOMContentLoaded', function() {
    const fileTitle = document.querySelector('.wa-file-title');
    if (fileTitle) {
        fileTitle.style.cursor = 'pointer';
        fileTitle.addEventListener('click', function() {
            showInstallModal();
        });
    }
});

// Sistem Petunjuk Interaktif Bertahap
const petunjukSteps = [
    {
        text: 'Perhatikan pesan dari <b>nomor tidak dikenal</b><br>Anda mendapatkan pesan dari nomor tidak dikenal yang mengirimkan file undangan pernikahan dalam <b>format APK</b>.',
        trigger: 'onLoad'
    },
    {
        text: 'Anda tidak sadar <b>menginstall</b> undangan yang ternyata sebuah file aplikasi.',
        trigger: 'afterClickAPK'
    },
    {
        text: 'Karena penasaran dan percaya, Anda akhirnya mencoba membuka file undangan tersebut.<br>Inilah yang sering terjadi pada <b>banyak orang</b>!',
        trigger: 'afterScrollBottom'
    }
];
let petunjukIndex = 0;
let petunjukScrollSudahMuncul = false;

function showPetunjuk(index) {
    const modal = document.getElementById('modalPetunjuk');
    const text = document.getElementById('modalPetunjukText');
    // Pastikan modal petunjuk selalu di paling akhir child device-screen
    const deviceScreen = document.querySelector('.device-screen');
    if (modal && deviceScreen) {
        deviceScreen.appendChild(modal);
    }
    if (modal && text && petunjukSteps[index]) {
        text.innerHTML = petunjukSteps[index].text;
        modal.style.display = 'flex';
        // Jika ini petunjuk terakhir (scroll), aktifkan file undangan setelah modal ditutup
        if (index === petunjukSteps.length - 1) {
            const btnTutup = document.getElementById('tutupPetunjuk');
            if (btnTutup) {
                btnTutup.onclick = function() {
                    hidePetunjuk();
                    var fileTitle = document.querySelector('.wa-file-title');
                    if (fileTitle) {
                        fileTitle.classList.remove('file-inactive');
                        fileTitle.classList.add('file-active');
                    }
                };
            }
        }
    }
}

function hidePetunjuk() {
    const modal = document.getElementById('modalPetunjuk');
    if (modal) modal.style.display = 'none';
}

window.addEventListener('DOMContentLoaded', function() {
    // Tampilkan petunjuk pertama saat halaman dibuka
    petunjukIndex = 0;
    showPetunjuk(petunjukIndex);
    var btnTutup = document.getElementById('tutupPetunjuk');
    if (btnTutup) {
        btnTutup.onclick = function() {
            hidePetunjuk();
        };
    }
    // Set file undangan tidak bisa diklik di awal
    var fileTitle = document.querySelector('.wa-file-title');
    if (fileTitle) {
        fileTitle.classList.add('file-inactive');
        fileTitle.classList.remove('file-active');
    }
});

// Modifikasi event klik file APK
function addPetunjukAfterClickAPK() {
    const fileTitle = document.querySelector('.wa-file-title');
    if (fileTitle) {
        fileTitle.addEventListener('click', function petunjukHandler() {
            // Tampilkan petunjuk kedua setelah klik APK
            petunjukIndex = 1;
            showPetunjuk(petunjukIndex);
            // Hapus handler agar tidak muncul berulang
            fileTitle.removeEventListener('click', petunjukHandler);
        });
    }
}
addPetunjukAfterClickAPK();

// Modifikasi showInstallModal agar petunjuk muncul setelah klik install
function showInstallModal() {
    // Modal wrapper
    let modal = document.createElement('div');
    modal.className = 'apk-modal';
    modal.innerHTML = `
        <div class="apk-modal-bg"></div>
        <div class="apk-modal-content" id="apkModalContent">
            <div class="apk-modal-icon"><i class="fas fa-download"></i></div>
            <div class="apk-modal-title">Unknown</div>
            <div class="apk-modal-desc">Staging app...</div>
            <div class="apk-modal-progress"><div class="apk-modal-bar" style="width: 30%"></div></div>
            <div class="apk-modal-btns">
                <span class="apk-modal-cancel-text btn-disabled">CANCEL</span>
            </div>
        </div>
    `;
    // Tambahkan ke .device-screen, fallback ke body jika tidak ada
    const deviceScreen = document.querySelector('.device-screen');
    if (deviceScreen) {
        deviceScreen.appendChild(modal);
    } else {
        document.body.appendChild(modal);
    }

    // Simulasi tahapan
    setTimeout(() => {
        // Konfirmasi install
        modal.querySelector('#apkModalContent').classList.add('apk-confirm');
        modal.querySelector('#apkModalContent').innerHTML = `
            <div class="apk-modal-icon"><img src='https://cdn-icons-png.flaticon.com/512/190/190411.png' width='32' style='border-radius:8px;'></div>
            <div class="apk-modal-title">Undangan Digital</div>
            <div class="apk-modal-desc">Do you want to install this application?</div>
            <div class="apk-modal-btns">
                <span class="apk-modal-cancel-text btn-disabled">CANCEL</span>
                <button class="apk-modal-install">INSTALL</button>
            </div>
        `;
        
        // Event listener untuk tombol cancel
        modal.querySelector('.apk-modal-cancel-text').onclick = function() {
            modal.remove();
        };
        
        modal.querySelector('.apk-modal-install').onclick = function() {
            // Setelah klik install, nonaktifkan event scroll dan set flag
            const chatArea = document.querySelector('.wa-chat-area');
            if (chatArea && chatArea._scrollHandlerPetunjuk) {
                chatArea.removeEventListener('scroll', chatArea._scrollHandlerPetunjuk);
                chatArea._scrollHandlerPetunjuk = null;
            }
            petunjukScrollSudahMuncul = true;
            // Tidak ada showPetunjuk di sini, langsung lanjut proses install
            modal.querySelector('#apkModalContent').classList.remove('apk-confirm');
            modal.querySelector('#apkModalContent').innerHTML = `
                <div class="apk-modal-icon"><img src='https://cdn-icons-png.flaticon.com/512/190/190411.png' width='32' style='border-radius:8px;'></div>
                <div class="apk-modal-title">Undangan Digital</div>
                <div class="apk-modal-desc">Installing...</div>
                <div class="apk-modal-progress"><div class="apk-modal-bar apk-bar-anim"></div></div>
                <div class="apk-modal-btns">
                    <span class="apk-modal-cancel-text btn-disabled">CANCEL</span>
                </div>
            `;
            modal.querySelector('.apk-modal-cancel-text').onclick = function() {
                modal.remove();
            };
            setTimeout(() => {
                modal.querySelector('#apkModalContent').innerHTML = `
                    <div class="apk-modal-icon"><img src='https://cdn-icons-png.flaticon.com/512/190/190411.png' width='32' style='border-radius:8px;'></div>
                    <div class="apk-modal-title">Undangan Digital</div>
                    <div class="apk-modal-desc">App installed.</div>
                    <div class="apk-modal-btns">
                        <span class="apk-modal-cancel-text btn-disabled">DONE</span>
                        <button class="apk-modal-open">OPEN</button>
                    </div>
                `;
                modal.querySelector('.apk-modal-cancel-text').onclick = function() {
                    modal.remove();
                };
                // Tampilkan petunjuk sebelum tombol OPEN bisa diklik
                const btnOpen = modal.querySelector('.apk-modal-open');
                if (btnOpen) {
                    btnOpen.disabled = true;
                    showPetunjukCustom(
                        'Dengan menginstall aplikasi ini, Anda secara tidak langsung memberikan <b>izin akses</b> ke <b>data</b> dan <b>perangkat</b> Anda.<br>Klik Lanjut untuk melanjutkan.',
                        function() {
                            modal.remove();
                            showMalwareAttack();
                        }
                    );
                    btnOpen.onclick = function() {
                        modal.remove();
                        showMalwareAttack();
                    };
                }
            }, 1800);
        };
    }, 1200);
}

function hidePetunjukOnClick(callback) {
    const btnTutup = document.getElementById('tutupPetunjuk');
    if (btnTutup) {
        btnTutup.onclick = function() {
            hidePetunjuk();
            if (typeof callback === 'function') callback();
        };
    }
}

function showMalwareAttack() {
    // Hapus isi utama dan tampilkan halaman serangan malware
    const contentArea = document.querySelector('.content-area');
    if (contentArea) {
        contentArea.innerHTML = `
            <div class="malware-attack-bg"></div>
            <div class="malware-attack-container">
                <div class="malware-skull"><i class='fas fa-skull-crossbones'></i></div>
                <div class="malware-attack-title">PERANGKAT ANDA TERINFEKSI MALWARE!</div>
                <div class="malware-attack-desc">
                    <ul>
                        <li><i class='fas fa-user-secret'></i> Data pribadi dicuri</li>
                        <li><i class='fas fa-camera'></i> Kamera & mikrofon diakses penyerang</li>
                        <li><i class='fas fa-bug'></i> Perangkat dikendalikan jarak jauh</li>
                    </ul>
                </div>
                <button class="malware-learn-btn">Pelajari Lebih Lanjut</button>
            </div>
        `;
        
        // Event listener untuk tombol pelajari
        document.querySelector('.malware-learn-btn').onclick = function() {
            // Kirim pesan ke parent window untuk menutup overlay
            if (window.parent !== window) {
                window.parent.postMessage({ type: 'gameCompleted', points: 20 }, '*');
            }
        };
        // Tampilkan petunjuk keempat setelah malware attack
        petunjukIndex = 3;
        showPetunjuk(petunjukIndex);
        hidePetunjukOnClick();
    }
}

// Fungsi untuk reset simulasi (opsional)
function resetSimulation() {
    const contentArea = document.querySelector('.content-area');
    if (contentArea) {
        // Reload halaman untuk reset
        location.reload();
    }
}

// Tambahkan event listener untuk tombol reset (jika diperlukan)
document.addEventListener('keydown', function(event) {
    // Tekan 'R' untuk reset simulasi
    if (event.key === 'r' || event.key === 'R') {
        resetSimulation();
    }
});

// Modal Petunjuk Alur Simulasi
window.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById('modalPetunjuk');
    var btnTutup = document.getElementById('tutupPetunjuk');
    if (modal && btnTutup) {
        modal.style.display = 'flex';
        btnTutup.onclick = function() {
            modal.style.display = 'none';
        };
    }
});

// Deteksi scroll area chat sampai paling bawah
function addPetunjukAfterScrollBottom() {
    const chatArea = document.querySelector('.wa-chat-area');
    if (chatArea) {
        function scrollHandler() {
            if (!petunjukScrollSudahMuncul && chatArea.scrollTop + chatArea.clientHeight >= chatArea.scrollHeight - 2) {
                petunjukIndex = petunjukSteps.length - 1;
                showPetunjuk(petunjukIndex);
                petunjukScrollSudahMuncul = true;
                chatArea.removeEventListener('scroll', scrollHandler);
            }
        }
        chatArea.addEventListener('scroll', scrollHandler);
        // Simpan handler agar bisa dihapus dari fungsi lain
        chatArea._scrollHandlerPetunjuk = scrollHandler;
    }
}
addPetunjukAfterScrollBottom();

// Fungsi petunjuk custom
function showPetunjukCustom(teks, callback) {
    const modal = document.getElementById('modalPetunjuk');
    const text = document.getElementById('modalPetunjukText');
    if (modal && text) {
        // Hilangkan tag <b> jika ada
        text.innerHTML = teks.replace(/<b>|<\/b>/g, '');
        modal.style.display = 'flex';
        const btnTutup = document.getElementById('tutupPetunjuk');
        if (btnTutup) {
            btnTutup.onclick = function() {
                modal.style.display = 'none';
                if (typeof callback === 'function') callback();
            };
        }
    }
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