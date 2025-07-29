const gameContainer = document.getElementById('game-container');

function showIntro() {
  gameContainer.innerHTML = `
    <div class="intro-2fa-card animate-fadein">
      <div class="intro-2fa-illustration">
        <span class="intro-2fa-icon">🔒</span>
      </div>
      <div class="intro-2fa-badge">Simulasi 2FA</div>
      <div class="intro-2fa-title">Selamat Datang di <span>Simulasi 2FA!</span></div>
      <div class="intro-2fa-desc">
        Kamu akan belajar cara menggunakan <b>Two-Factor Authentication (2FA)</b> untuk melindungi akun media sosialmu dari peretas.<br>
        <span style="color:#1877f2;font-weight:500;">2FA</span> menambah lapisan keamanan ekstra dengan membutuhkan verifikasi tambahan saat login.
      </div>
      <button class="intro-2fa-btn" onclick="showSmsStage()">
        <span class="btn-icon">▶️</span> Mulai Simulasi
      </button>
    </div>
  `;
}

function showSmsStage() {
  const code = Math.floor(100000 + Math.random() * 900000);
  window.smsCode = code;
  window.smsCountdown = 30; // 30 detik
  window.smsInterval && clearInterval(window.smsInterval);

  gameContainer.innerHTML = `
    <div class="verify-login-row animate-fadein">
      <div class="verify-login-col left">
        <div class="mockup-phone">
          <div class="mockup-phone-notch"></div>
          <div class="mockup-phone-screen">
            <div class="mockup-phone-notif">
              <div class="mockup-phone-notif-icon">📱</div>
              <div class="mockup-phone-notif-title">Kode 2FA</div>
              <div class="mockup-phone-notif-code">${code}</div>
              <div class="mockup-phone-notif-info">Kode berlaku 30 detik</div>
            </div>
          </div>
        </div>
      </div>
      <div class="verify-login-col right">
        <div class="verify-login-title">Verifikasi Login</div>
        <div class="verify-login-desc">Masukkan kode 2FA yang dikirim ke HP-mu.</div>
        <div class="verify-login-card">
          <div class="verify-login-card-icon">🔒</div>
          <div class="verify-login-card-code">******</div>
          <div class="verify-login-card-info">Kode berlaku 30 detik</div>
          <div id="sms-timer" class="verify-login-timer"></div>
        </div>
        <input type="number" class="verify-login-input" id="inputCode" placeholder="Kode 6 digit" maxlength="6" />
        <button class="verify-login-btn" onclick="checkSmsCode()">Verifikasi</button>
      </div>
    </div>
  `;

  function updateSmsTimer() {
    const timerDiv = document.getElementById('sms-timer');
    if (!timerDiv) return;
    if (window.smsCountdown > 0) {
      const minutes = Math.floor(window.smsCountdown / 60);
      const seconds = window.smsCountdown % 60;
      timerDiv.innerHTML = `<span style='color:#1877f2;'>${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}</span>`;
    } else {
      timerDiv.innerHTML = `<button id='resend-btn' class='verify-login-btn resend' style='margin-top:8px;'>Kirim Ulang</button>`;
      document.getElementById('resend-btn').onclick = showSmsStage;
      clearInterval(window.smsInterval);
    }
  }

  updateSmsTimer();
  window.smsInterval = setInterval(() => {
    if (window.smsCountdown > 0) {
      window.smsCountdown--;
      updateSmsTimer();
    } else {
      updateSmsTimer();
    }
  }, 1000);
}

function checkSmsCode() {
  const input = document.getElementById('inputCode').value;
  // Jika waktu habis, selalu salah
  if (window.smsCountdown <= 0) {
    showSmsError();
    return;
  }
  if (parseInt(input) === window.smsCode) {
    gameContainer.innerHTML = `
      <div class="verify-success-card animate-fadein">
        <div class="verify-success-icon-bg">
          <span class="verify-success-icon">✔️</span>
        </div>
        <div class="verify-success-title">Verifikasi Berhasil</div>
        <div class="verify-success-sub">Kode benar! Kamu berhasil melewati verifikasi <b>SMS</b>.</div>
        <div class="verify-success-desc">Ini adalah salah satu cara 2FA yang paling umum digunakan.<br> Sekarang mari coba metode lain yang lebih aman.</div>
        <button class="verify-success-btn" onclick="showPromptStage()">Lanjut ke 2FA Prompt</button>
      </div>
    `;
    return;
  }
  showSmsError();
}

function showSmsError() {
  let errorMsg = document.getElementById('sms-error-msg');
  if (!errorMsg) {
    errorMsg = document.createElement('div');
    errorMsg.id = 'sms-error-msg';
    errorMsg.className = 'error-message';
    errorMsg.style.marginTop = '8px';
    errorMsg.textContent = 'Kode yang kamu masukkan salah atau sudah kadaluarsa.';
    const inputEl = document.getElementById('inputCode');
    inputEl.parentNode.insertBefore(errorMsg, inputEl.nextSibling);
  } else {
    errorMsg.textContent = 'Kode yang kamu masukkan salah atau sudah kadaluarsa.';
  }
}

function showPromptStage(showInstruction = true) {
  const options = [
    { color: '#ff0000', shape: 'pentagon', symbol: '⬟', label: 'Pentagon Merah' },
    { color: '#0000ff', shape: 'pentagon', symbol: '⬟', label: 'Pentagon Biru' },
    { color: '#008000', shape: 'pentagon', symbol: '⬟', label: 'Pentagon Hijau' },
    { color: '#ffff00', shape: 'circle', symbol: '⬤', label: 'Lingkaran Kuning' },
    { color: '#ff0000', shape: 'circle', symbol: '⬤', label: 'Lingkaran Merah' },
    { color: '#0000ff', shape: 'triangle', symbol: '▲', label: 'Segitiga Biru' },
  ];
  
  // Hanya pilih dari opsi pentagon untuk shield
  const shieldOptions = options.filter(o => o.shape === 'pentagon');
  const shield = shieldOptions[Math.floor(Math.random() * shieldOptions.length)];
  window.promptShield = shield;
  
  // Acak urutan opsi
  const shuffled = [...options].sort(() => Math.random() - 0.5);

  gameContainer.innerHTML = `
    <div class="verify-login-row animate-fadein">
      <div class="verify-login-col left">
        <div class="mockup-phone">
          <div class="mockup-phone-notch"></div>
          <div class="mockup-phone-screen">
            <div class="mockup-phone-notif" style="margin-top:38px;">
              <div class="mockup-phone-notif-icon">🔒</div>
              <div class="mockup-phone-notif-title">Verifikasi Login</div>
              <div class="mockup-phone-notif-shape" style="display:flex;justify-content:center;align-items:center;margin:20px auto 0 auto;width:60px;height:60px;background:${shield.color};$${
                shield.shape === 'circle' ? 'border-radius:50%;' :
                shield.shape === 'pentagon' ? 'clip-path:polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);' :
                'clip-path:polygon(50% 0%, 100% 100%, 0% 100%);'
              }">
                <span style="color:white;font-size:32px;${shield.shape === 'circle' ? 'margin-top:-4px;' : ''}">${shield.symbol}</span>
              </div>
              <div class="mockup-phone-notif-info" style="margin-top:10px;">Tap notifikasi yang sesuai untuk memverifikasi login</div>
            </div>
          </div>
        </div>
      </div>
      <div class="verify-login-col right">
        <div class="verify-login-title">Verifikasi Login</div>
        <div class="verify-login-desc">Pilih notifikasi dengan warna dan bentuk yang sama seperti di HP-mu!</div>
        <div class="prompt-options">
          ${shuffled.map((opt) => `
            <div class="prompt-option" style="background:${opt.color};${
              opt.shape === 'circle' ? 'border-radius:50%;' : 
              opt.shape === 'pentagon' ? 
              'clip-path:polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);' :
              'clip-path:polygon(50% 0%, 100% 100%, 0% 100%);'
            }" onclick="checkPromptOption('${opt.color}','${opt.shape}')">
              <span style="color:white;font-size:32px;${opt.shape === 'circle' ? 'margin-top:-4px;' : ''}">${opt.symbol}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function checkPromptOption(color, shape) {
  if (color === window.promptShield.color && shape === window.promptShield.shape) {
    gameContainer.innerHTML = `
      <div class="verify-success-card animate-fadein">
        <div class="verify-success-icon-bg">
          <span class="verify-success-icon">✔️</span>
        </div>
        <div class="verify-success-title">Verifikasi Berhasil</div>
        <div class="verify-success-sub">Kamu memilih notifikasi yang benar! Metode ini lebih aman karena hanya bisa diverifikasi dari perangkat yang sudah terdaftar.</div>
        <div class="verify-success-desc">Mari coba metode terakhir yang paling aman - Authenticator App.</div>
        <button class="verify-success-btn" onclick="showAuthStage()">Lanjut ke Authenticator</button>
      </div>
    `;
  } else {
    // Tampilkan pesan error dan ulangi stage
    gameContainer.innerHTML = `
      <div class="feed-post">
        <div class="post-header">
          <div class="post-avatar">❌</div>
          <div class="post-info">
            <div class="post-name">Verifikasi Gagal</div>
            <div class="post-time">Baru saja</div>
          </div>
        </div>
        <div class="post-content">
          <p class="error-message">Pilihan salah! Coba lagi dengan teliti.</p>
        </div>
        <div class="post-actions">
          <div class="action-button" onclick="showPromptStage(false)">Coba Lagi</div>
        </div>
      </div>
    `;
  }
}

function showAuthStage() {
  function renderAuthStage() {
    const code = Math.floor(100000 + Math.random() * 900000);
    window.authCode = code;
    window.authCountdown = 30;
    window.authInterval && clearInterval(window.authInterval);

    gameContainer.innerHTML = `
      <div class="verify-login-row animate-fadein">
        <div class="verify-login-col left">
          <div class="mockup-phone">
            <div class="mockup-phone-notch"></div>
            <div class="mockup-phone-screen">
              <div class="mockup-auth-app">
                <div class="mockup-auth-app-header">
                  <span class="mockup-auth-app-title">Google Authenticator</span>
                </div>
                <div class="mockup-auth-app-account">user123@email.com</div>
                <div class="mockup-auth-app-code">${code}</div>
                <div class="mockup-auth-app-timer" id="auth-timer"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="verify-login-col right">
          <div class="verify-login-title">Authenticator App</div>
          <div class="verify-login-desc">Masukkan kode 6 digit yang muncul di aplikasi authenticator-mu.</div>
          <input type="number" class="verify-login-input" id="authInputCode" placeholder="Kode 6 digit" maxlength="6" />
          <button class="verify-login-btn" onclick="checkAuthCode()">Verifikasi</button>
        </div>
      </div>
    `;

    function updateAuthTimer() {
      const timerDiv = document.getElementById('auth-timer');
      if (!timerDiv) return;
      if (window.authCountdown > 0) {
        timerDiv.innerHTML = `<span style='color:#1877f2;'>${window.authCountdown}s</span>`;
      } else {
        timerDiv.innerHTML = `<button id='refresh-btn' class='verify-login-btn resend' style='margin-top:8px;'>Refresh</button>`;
        document.getElementById('refresh-btn').onclick = renderAuthStage;
        clearInterval(window.authInterval);
      }
    }

    updateAuthTimer();
    window.authInterval = setInterval(() => {
      if (window.authCountdown > 0) {
        window.authCountdown--;
        updateAuthTimer();
      } else {
        updateAuthTimer();
      }
    }, 1000);
  }

  renderAuthStage();
}

function checkAuthCode() {
  const input = document.getElementById('authInputCode').value;
  if (parseInt(input) === window.authCode) {
    showGameResult();
    return;
  } else {
    let errorMsg = document.getElementById('auth-error-msg');
    if (!errorMsg) {
      errorMsg = document.createElement('div');
      errorMsg.id = 'auth-error-msg';
      errorMsg.className = 'error-message';
      errorMsg.style.marginTop = '8px';
      errorMsg.textContent = 'Kode salah! Coba periksa lagi aplikasi authenticator-mu.';
      const inputEl = document.getElementById('authInputCode');
      inputEl.parentNode.insertBefore(errorMsg, inputEl.nextSibling);
    } else {
      errorMsg.textContent = 'Kode salah! Coba periksa lagi aplikasi authenticator-mu.';
    }
  }
}

function showPhoneFrame(content) {
  return `
    <div class="phone-frame">
      <div class="phone-content">
        ${content}
      </div>
    </div>
  `;
}

function showGameResult() {
  gameContainer.innerHTML = `
    <div class="result-finish-full animate-fadein">
      <div class="result-finish-bg"></div>
      <div class="result-finish-icon-bg">
        <span class="result-finish-icon">🎉</span>
      </div>
      <div class="result-finish-title">Selamat!</div>
      <div class="result-finish-sub">Kamu Berhasil Menyelesaikan Simulasi 2FA!</div>
      <div class="result-finish-desc">Sekarang kamu sudah memahami cara kerja <span class="result-finish-green">Three-Factor Authentication</span>:</div>
      <ul class="result-finish-list">
        <li><span class="result-finish-check">✔️</span> SMS Verification <span class="result-finish-list-desc">- Mudah tapi bisa diintercept</span></li>
        <li><span class="result-finish-check">✔️</span> Push Notification <span class="result-finish-list-desc">- Lebih aman, hanya di perangkat terdaftar</span></li>
        <li><span class="result-finish-check">✔️</span> Authenticator App <span class="result-finish-list-desc">- Paling aman, kode berubah setiap 30 detik</span></li>
      </ul>
      <div class="result-finish-note">Selalu aktifkan 2FA di semua akun media sosialmu untuk keamanan maksimal!</div>
      <button class="result-finish-btn">Selesai</button>
    </div>
  `;
  // Tambahkan event agar klik Selesai mengirim pesan ke parent
  setTimeout(() => {
    const btn = document.querySelector('.result-finish-btn');
    if (btn) {
      btn.addEventListener('click', function() {
        window.parent.postMessage({ type: 'gameCompleted', points: 100 }, '*');
      });
    }
  }, 0);
}

// Mulai game saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
  showIntro();
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