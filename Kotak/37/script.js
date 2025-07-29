// Game JavaScript untuk Minigame UU ITE Pencemaran Nama Baik

// Modal functionality
const modal = document.getElementById('penalty-modal');
const closeBtn = document.querySelector('.close');

// Close modal when clicking X
closeBtn.onclick = function() {
    modal.style.display = "none";
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Show penalty modal
function showPenalty() {
    modal.style.display = "block";
    // Add sound effect
    playSound('alert');
}

// Sound effect function (placeholder)
function playSound(type) {
    // In a real implementation, you would play actual sound files
    console.log(`Playing ${type} sound`);
}

// Function untuk handle klik tombol selesai
function handleSelesaiClick() {
    console.log('handleSelesaiClick dipanggil!');
    if (window.parent && window.parent !== window) {
        console.log('Mengirim pesan ke parent window dari handleSelesaiClick');
        window.parent.postMessage({
            type: 'gameCompleted',
            points: 20
        }, '*');
    } else {
        console.log('Tidak dapat mengirim pesan ke parent window dari handleSelesaiClick');
    }
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to post
    const postContainer = document.querySelector('.post-container');
    if (postContainer) {
        postContainer.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 4px 16px rgba(220, 53, 69, 0.2)';
        });
        
        postContainer.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        });
    }
    
    // Add click effect to buttons (kecuali tombol selesai)
    const buttons = document.querySelectorAll('.btn:not(#btn-selesai)');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Add typing effect to post text
    const postText = document.querySelector('.post-text');
    if (postText) {
        const originalText = postText.textContent;
        postText.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < originalText.length) {
                postText.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 1000);
    }
});
