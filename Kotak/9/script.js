// Intro popup functionality
document.addEventListener('DOMContentLoaded', function() {
    const introPopup = document.getElementById('intro-popup');
    const btnLanjutkanIntro = document.getElementById('btn-lanjutkan-intro');
    const waAppContainer = document.querySelector('.wa-app-container');
    
    // Sembunyikan wa-app-container saat awal
    if (waAppContainer) {
        waAppContainer.style.display = 'none';
    }
    
    // Tampilkan popup intro saat halaman dimuat
    if (introPopup) {
        introPopup.style.display = 'flex';
    }
    
    // Event listener untuk tombol lanjutkan
    if (btnLanjutkanIntro) {
        btnLanjutkanIntro.addEventListener('click', function() {
            // Hapus popup intro dari DOM
            if (introPopup) {
                introPopup.parentNode.removeChild(introPopup);
            }
            // Tampilkan wa-app-container
            if (waAppContainer) {
                waAppContainer.style.display = 'flex';
            }
        });
    }
});

// Phishing simulation steps
document.addEventListener('DOMContentLoaded', function() {
    const phishingLink = document.getElementById('phishing-link');
    const fakeLoginForm = document.getElementById('fake-login-form');
    const waAppContainer = document.querySelector('.wa-app-container');
    const stepLogin = document.getElementById('step-login');
    
    if (phishingLink) {
        phishingLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (waAppContainer) waAppContainer.style.display = 'none';
            if (stepLogin) stepLogin.style.display = 'flex';
        });
    }
    
    if (fakeLoginForm) {
        fakeLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (stepLogin) stepLogin.style.display = 'none';
            const stepAlert = document.getElementById('step-alert');
            if (stepAlert) stepAlert.style.display = 'flex';
        });
    }
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('.wa-phishing-link, .fake-login-link');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add click sound effect (optional)
    const clickableElements = document.querySelectorAll('.wa-phishing-link, .fake-login-btn');
    clickableElements.forEach(element => {
        element.addEventListener('click', function() {
            // Add a subtle visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
});

// Responsive functionality
// Perbaikan: jangan manipulasi #intro-popup
// Hanya popup-petunjuk lain yang boleh di-scale

document.addEventListener('DOMContentLoaded', function() {
    // Function to handle responsive behavior
    function handleResponsive() {
        const deviceFrame = document.querySelector('.device-frame');
        // Ambil popup-petunjuk yang BUKAN intro
        const popupPetunjuk = document.querySelector('.popup-petunjuk:not(#intro-popup)');
        const popupContent = popupPetunjuk ? popupPetunjuk.querySelector('.popup-petunjuk-content') : null;
        const windowWidth = window.innerWidth;
        
        // Add responsive classes based on screen size
        if (windowWidth <= 360) {
            deviceFrame.classList.add('mobile-small');
            if (popupPetunjuk) {
                popupPetunjuk.style.transform = 'scale(0.4)';
                popupPetunjuk.style.transformOrigin = 'center center';
            }
            if (popupContent) {
                popupContent.style.transform = 'scale(1)';
                popupContent.style.transformOrigin = 'center center';
            }
        } else if (windowWidth <= 480) {
            deviceFrame.classList.add('mobile-medium');
            if (popupPetunjuk) {
                popupPetunjuk.style.transform = 'scale(0.5)';
                popupPetunjuk.style.transformOrigin = 'center center';
            }
            if (popupContent) {
                popupContent.style.transform = 'scale(1)';
                popupContent.style.transformOrigin = 'center center';
            }
        } else if (windowWidth <= 768) {
            deviceFrame.classList.add('mobile-large');
            if (popupPetunjuk) {
                popupPetunjuk.style.transform = 'scale(0.6)';
                popupPetunjuk.style.transformOrigin = 'center center';
            }
            if (popupContent) {
                popupContent.style.transform = 'scale(1)';
                popupContent.style.transformOrigin = 'center center';
            }
        } else {
            deviceFrame.classList.remove('mobile-small', 'mobile-medium', 'mobile-large');
            if (popupPetunjuk) {
                popupPetunjuk.style.transform = 'scale(1)';
                popupPetunjuk.style.transformOrigin = 'center center';
            }
            if (popupContent) {
                popupContent.style.transform = 'scale(1)';
                popupContent.style.transformOrigin = 'center center';
            }
        }
        
        // Adjust touch interactions for mobile
        if (windowWidth <= 768) {
            // Enable touch-friendly interactions
            const touchElements = document.querySelectorAll('.wa-phishing-link, .fake-login-btn, .wa-chat-list-item');
            touchElements.forEach(element => {
                element.style.minHeight = '44px'; // Minimum touch target size
                element.style.padding = '12px 8px';
            });
        }
    }
    
    // Initial call
    handleResponsive();
    
    // Listen for window resize
    window.addEventListener('resize', handleResponsive);
    
    // Add touch support for mobile devices
    if ('ontouchstart' in window) {
        // Add touch-specific event listeners
        const touchElements = document.querySelectorAll('.wa-phishing-link, .fake-login-btn');
        touchElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });
            
            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
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

document.addEventListener('DOMContentLoaded', function() {
    // Event listener untuk tombol 'Pelajari Lebih Lanjut' di phishing alert
    const phishingActionBtn = document.querySelector('.phishing-action');
    if (phishingActionBtn) {
        phishingActionBtn.addEventListener('click', function() {
            // Kirim pesan ke parent window untuk menutup minigame dengan animasi (handled by parent)
            window.parent.postMessage({ type: 'gameCompleted', points: 0 }, '*');
        });
    }
}); 