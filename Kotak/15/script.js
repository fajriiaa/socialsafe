

// Password visibility toggle
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Password strength checker
    const passwordInput = document.querySelector('input[placeholder="Masukkan password baru"]');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');

    if (passwordInput && strengthBar && strengthText) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;
            let feedback = '';

            // Check length
            if (password.length >= 8) strength += 25;
            
            // Check for uppercase
            if (/[A-Z]/.test(password)) strength += 25;
            
            // Check for lowercase
            if (/[a-z]/.test(password)) strength += 25;
            
            // Check for numbers and special characters
            if (/[0-9!@#$%^&*]/.test(password)) strength += 25;

            // Update strength bar
            strengthBar.style.width = `${strength}%`;

            // Update strength text and color
            if (strength <= 25) {
                strengthBar.style.background = 'var(--danger-color)';
                feedback = 'Lemah';
            } else if (strength <= 50) {
                strengthBar.style.background = 'var(--warning-color)';
                feedback = 'Sedang';
            } else if (strength <= 75) {
                strengthBar.style.background = '#f39c12';
                feedback = 'Kuat';
            } else {
                strengthBar.style.background = 'var(--success-color)';
                feedback = 'Sangat Kuat';
            }

            strengthText.textContent = `Kekuatan password: ${feedback}`;
        });
    }

    // Form validation
    const form = document.querySelector('.password-form');
    const updateBtn = document.querySelector('.update-btn');

    if (updateBtn) {
        updateBtn.addEventListener('click', function() {
            const currentPassword = document.querySelector('input[placeholder="Masukkan password saat ini"]').value;
            const newPassword = document.querySelector('input[placeholder="Masukkan password baru"]').value;
            const confirmPassword = document.querySelector('input[placeholder="Konfirmasi password baru"]').value;

            if (!currentPassword || !newPassword || !confirmPassword) {
                alert('Mohon lengkapi semua field password');
                return;
            }

            if (newPassword !== confirmPassword) {
                alert('Password baru dan konfirmasi password tidak cocok');
                return;
            }

            // Simulasi update password
            updateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memperbarui...';
            updateBtn.disabled = true;

            setTimeout(() => {
                // Sembunyikan form, tampilkan success screen
                const passwordForm = document.querySelector('.password-form');
                const successScreen = document.querySelector('.success-screen');
                const passwordStatus = document.querySelector('.password-status');
                
                if (passwordForm) passwordForm.style.display = 'none';
                if (successScreen) successScreen.style.display = 'flex';
                if (passwordStatus) passwordStatus.style.display = 'none';
                
                // Reset form setelah 2 detik (opsional)
                setTimeout(() => {
                    if (form) form.reset();
                    updateBtn.innerHTML = '<i class="fas fa-save"></i> Perbarui Password';
                    updateBtn.style.background = 'var(--primary-color)';
                    updateBtn.disabled = false;
                    if (strengthBar) strengthBar.style.width = '0%';
                    if (strengthText) strengthText.textContent = 'Kekuatan password: -';
                    if (passwordStatus) passwordStatus.style.display = '';
                }, 2000);
            }, 1500);
        });
    }

    // Event tombol selesai
    var continueBtn = document.querySelector('.continue-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            window.parent.postMessage({ type: 'gameCompleted', points: 25 }, '*');
        });
    }




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