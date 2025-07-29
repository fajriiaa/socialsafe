// Tutorial ala COC untuk SociSafe
class CoCTutorial {
    constructor(steps) {
        this.steps = steps;
        this.currentStep = 0;
        this.overlay = null;
        this.arrow = null;
        this.dialog = null;
        this.avatar = null;
        this.isActive = false;
        this.init();
    }

    init() {
        // Buat overlay
        this.overlay = document.createElement('div');
        this.overlay.id = 'coc-tutorial-overlay';
        this.overlay.style.display = 'none';
        // Ubah ke absolute agar child bisa absolute terhadap dokumen
        this.overlay.style.position = 'absolute';
        this.overlay.style.left = '0';
        this.overlay.style.top = '0';
        this.overlay.style.width = '100%';
        this.overlay.style.height = '100%';
        document.body.appendChild(this.overlay);

        // Tambahkan CSS
        if (!document.getElementById('coc-tutorial-style')) {
            const style = document.createElement('style');
            style.id = 'coc-tutorial-style';
            style.textContent = `
                #coc-tutorial-overlay {
                    position: absolute; left: 0; top: 0; width: 100%; height: 100%;
                    z-index: 99998; pointer-events: none;
                }
                .coc-tutorial-avatar {
                    position: fixed; left: 32px; bottom: 32px; z-index: 100002;
                    width: 120px; height: 160px; pointer-events: auto;
                    display: flex; align-items: flex-end;
                }
                .coc-tutorial-avatar img {
                    width: 100%; height: auto; border-radius: 16px; box-shadow: 0 4px 16px #0008;
                    background: #fff;
                }
                .coc-tutorial-dialog {
                    position: fixed; left: 170px; bottom: 60px; z-index: 100010;
                    min-width: 120px; max-width: 240px;
                    background: #fff;
                    color: #222;
                    border-radius: 16px;
                    box-shadow: 0 4px 16px 0 #0003;
                    padding: 16px 18px 16px 28px;
                    font-size: 0.88em;
                    pointer-events: auto;
                    display: flex; flex-direction: column; gap: 10px;
                    border: 3px solid #222;
                    font-family: 'Luckiest Guy', 'Comic Sans MS', 'Arial Black', sans-serif;
                    font-weight: bold;
                    position: fixed;
                }
                .coc-tutorial-dialog::before {
                    content: '';
                    position: absolute;
                    left: -28px;
                    top: 32px;
                    width: 0; height: 0;
                    border-top: 18px solid transparent;
                    border-bottom: 18px solid transparent;
                    border-right: 28px solid #fff;
                    filter: drop-shadow(-2px 0 0 #222);
                }
                .coc-tutorial-dialog .corner-orn {
                    position: absolute;
                    font-size: 1.2em;
                    color: #bfae6a;
                }
                .coc-tutorial-dialog .corner-orn.tl { left: 7px; top: 4px; }
                .coc-tutorial-dialog .corner-orn.tr { right: 7px; top: 4px; }
                .coc-tutorial-dialog .corner-orn.bl { left: 7px; bottom: 4px; }
                .coc-tutorial-dialog .corner-orn.br { right: 7px; bottom: 4px; }
                .coc-tutorial-dialog .coc-tutorial-next,
                .coc-tutorial-dialog .coc-tutorial-skip {
                    background: #eee;
                    color: #444;
                    border: none;
                    border-radius: 6px;
                    padding: 3px 12px;
                    font-size: 0.92em;
                    min-width: 56px;
                    cursor: pointer;
                    font-weight: normal;
                    box-shadow: none;
                    transition: background 0.2s;
                }
                .coc-tutorial-dialog .coc-tutorial-next:hover,
                .coc-tutorial-dialog .coc-tutorial-skip:hover {
                    background: #e0e0e0;
                }
                .coc-tutorial-arrow {
                    position: absolute;
                    width: 60px;
                    height: 45px;
                    background: url('data:image/svg+xml;utf8,<svg width=\"60\" height=\"45\" viewBox=\"0 0 60 45\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"grad\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"%23ffe066\"/><stop offset=\"100%\" stop-color=\"%23ff9800\"/></linearGradient></defs><path d=\"M7 13 Q30 0 53 13 Q46 13 46 23 Q59 23 30 43 Q1 23 14 23 Q14 13 7 13 Z\" fill=\"url(%23grad)\" stroke=\"%234a2c00\" stroke-width=\"3\"/></svg>') no-repeat center/contain;
                    z-index: 100009;
                    left: 0; top: 0;
                    pointer-events: none;
                    animation: cocArrowBounce 1s infinite;
                    filter: drop-shadow(0 2px 8px #ff980088);
                }
                @keyframes cocArrowBounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(12px); }
                }
                .coc-tutorial-highlight {
                    position: relative !important;
                    z-index: 10010 !important;
                    box-shadow: 0 0 0 4px #00d4ff, 0 0 16px 8px #00d4ff55;
                    border-radius: 10px !important;
                    transition: box-shadow 0.3s;
                    animation: cocHighlightPulse 1.2s infinite;
                }
                @keyframes cocHighlightPulse {
                    0%, 100% { box-shadow: 0 0 0 4px #00d4ff, 0 0 16px 8px #00d4ff55; }
                    50% { box-shadow: 0 0 0 8px #00d4ff99, 0 0 32px 16px #00d4ff33; }
                }
                .coc-tutorial-highlight-rect {
                    box-sizing: border-box;
                    border-radius: 12px;
                    border: 4px solid #00d4ff;
                    box-shadow: 0 0 24px 8px #00d4ff55, 0 0 0 8px #00d4ff22;
                    pointer-events: none;
                    z-index: 100008;
                    animation: cocHighlightPulse 1.2s infinite;
                }
                .coc-tutorial-scale {
                    position: fixed;
                    left: 0;
                    bottom: 0;
                    z-index: 100010;
                    width: auto;
                    height: auto;
                }
                @media (max-width: 450px) {
                    .coc-tutorial-scale {
                        transform: scale(0.65);
                        transform-origin: left bottom;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    start() {
        this.isActive = true;
        // Tambahkan overlay redup
        if (!document.getElementById('coc-tutorial-dim')) {
            const dim = document.createElement('div');
            dim.id = 'coc-tutorial-dim';
            dim.style.position = 'fixed';
            dim.style.left = '0';
            dim.style.top = '0';
            dim.style.width = '100vw';
            dim.style.height = '100vh';
            dim.style.background = 'rgba(0,0,0,0.55)';
            dim.style.zIndex = '99997';
            dim.style.pointerEvents = 'auto';
            document.body.appendChild(dim);
        }
        this.overlay.style.display = 'block';
        this.currentStep = 0;
        this.showStep();
    }

    showStep() {
        const step = this.steps[this.currentStep];
        if (!step) return this.finish();
        // Selalu hapus highlight dan panah lama di awal
        this.removeHighlight();
        this.overlay.querySelectorAll('.coc-tutorial-arrow').forEach(el => el.remove());
        this.overlay.innerHTML = '';

        // Tambahkan wrapper scale agar bisa di-scale proporsional
        const scaleWrapper = document.createElement('div');
        scaleWrapper.className = 'coc-tutorial-scale';
        this.overlay.appendChild(scaleWrapper);

        // Avatar
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'coc-tutorial-avatar';
        let characterData = null;
        try {
            characterData = JSON.parse(localStorage.getItem('characterData'));
        } catch {}
        avatarDiv.innerHTML = this.renderCharacterHTML(characterData);
        scaleWrapper.appendChild(avatarDiv);

        // Dialog
        const dialogDiv = document.createElement('div');
        dialogDiv.className = 'coc-tutorial-dialog';
        dialogDiv.innerHTML = `
            <div class="coc-tutorial-text">${step.text}</div>
        `;
        const nextBtn = document.createElement('button');
        nextBtn.className = 'coc-tutorial-next';
        nextBtn.textContent = (this.currentStep === this.steps.length - 1) ? 'Selesai' : 'Lanjut';
        nextBtn.onclick = (e) => {
            e.stopPropagation();
            this.next();
        };
        // Tambahkan tombol Skip
        const skipBtn = document.createElement('button');
        skipBtn.className = 'coc-tutorial-skip';
        skipBtn.textContent = 'Skip';
        skipBtn.style.marginRight = '8px';
        skipBtn.onclick = (e) => {
            e.stopPropagation();
            this.finish();
        };
        // Bungkus tombol dalam div flex agar sejajar
        const btnWrapper = document.createElement('div');
        btnWrapper.style.display = 'flex';
        btnWrapper.style.justifyContent = 'flex-end';
        btnWrapper.style.gap = '8px';
        // Hanya tambahkan tombol Skip jika bukan langkah terakhir
        if (this.currentStep !== this.steps.length - 1) {
            btnWrapper.appendChild(skipBtn);
        }
        btnWrapper.appendChild(nextBtn);
        dialogDiv.appendChild(btnWrapper);
        scaleWrapper.appendChild(dialogDiv);

        // Highlight overlay
        if (step.selector && step.selector !== '.game-footer') {
            const target = document.querySelector(step.selector);
            if (target) {
                this.renderHighlightOverlay(target);
                // Scroll logic tetap
                let scrollParent = target.closest('.game-board-scroll');
                if (scrollParent) {
                    const targetRect = target.getBoundingClientRect();
                    const parentRect = scrollParent.getBoundingClientRect();
                    const offsetLeft = target.offsetLeft - scrollParent.offsetLeft;
                    const scrollLeft = offsetLeft - (parentRect.width / 2) + (targetRect.width / 2);
                    scrollParent.scrollTo({left: scrollLeft, behavior: 'smooth'});
                }
                target.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
        }

        // Panah di atas highlight
        this.renderArrow();
        // Update posisi panah & highlight saat scroll/resize
        this._updateArrowListener = () => {
            this.renderArrow();
            if (step.selector && step.selector !== '.game-footer') {
                const target = document.querySelector(step.selector);
                if (target) this.renderHighlightOverlay(target);
            } else {
                this.removeHighlight();
            }
        };
        window.addEventListener('scroll', this._updateArrowListener, true);
        window.addEventListener('resize', this._updateArrowListener, true);
    }

    next() {
        this.currentStep++;
        if (this.currentStep < this.steps.length) {
            this.showStep();
        } else {
            this.finish();
        }
    }

    finish() {
        this.isActive = false;
        this.overlay.style.display = 'none';
        this.removeHighlight();
        localStorage.setItem('cocTutorialDone', 'true');
        // Hapus overlay redup
        const dim = document.getElementById('coc-tutorial-dim');
        if (dim) dim.remove();
    }

    removeHighlight() {
        this.overlay.querySelectorAll('.coc-tutorial-highlight-rect').forEach(el => el.remove());
    }

    getAvatarUrl() {
        // Ambil dari localStorage characterData
        try {
            const data = JSON.parse(localStorage.getItem('characterData'));
            if (data && data.avatar) return data.avatar;
            if (data && data.image) return data.image;
        } catch {}
        // Default avatar
        return 'assets/images/profil/ikonsocisafe.png';
    }

    renderArrow() {
        // Hapus panah lama
        this.overlay.querySelectorAll('.coc-tutorial-arrow').forEach(el => el.remove());
        const step = this.steps[this.currentStep];
        if (!step || !step.selector || step.selector === '.game-footer') return;
        const target = document.querySelector(step.selector);
        if (!target) return;
        const rect = target.getBoundingClientRect();
        // Hitung posisi absolut terhadap dokumen
        const left = rect.left + rect.width / 2 - 30 + window.scrollX;
        const top = rect.top + window.scrollY - 45 - 8; // 8px di atas highlight
        const arrow = document.createElement('div');
        arrow.className = 'coc-tutorial-arrow';
        arrow.style.left = left + 'px';
        arrow.style.top = top + 'px';
        arrow.style.position = 'absolute';
        this.overlay.appendChild(arrow);
    }

    renderHighlightOverlay(target) {
        // Hapus highlight overlay lama
        this.overlay.querySelectorAll('.coc-tutorial-highlight-rect').forEach(el => el.remove());
        const rect = target.getBoundingClientRect();
        const highlight = document.createElement('div');
        highlight.className = 'coc-tutorial-highlight-rect';
        highlight.style.left = (rect.left + window.scrollX - 6) + 'px';
        highlight.style.top = (rect.top + window.scrollY - 6) + 'px';
        highlight.style.width = (rect.width + 12) + 'px';
        highlight.style.height = (rect.height + 12) + 'px';
        highlight.style.position = 'absolute';
        this.overlay.appendChild(highlight);
    }

    renderCharacterHTML(characterData) {
        // Default jika tidak ada data
        if (!characterData) {
            characterData = {
                nama: 'Pemain',
                hairColor: '#000000',
                hatColor: '#000000',
                shirtColor: '#97A88A',
                tieColor: '#000000',
                pantColor: '#808080',
                skinColor: '#FBE8D3',
                shoesColor: '#FFFFFF',
                hairStyle: 'kartun',
                expression: 'neutral'
            };
        }
        let characterHTML = '';
        if (characterData.hairStyle === 'hat') {
            characterHTML = `
                <div class="character" style="background: ${characterData.skinColor}; width: 120px; height: 150px; border-radius: 15px; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                    <div class="hair-hat" style="position: absolute; top: -18%; left: 0; width: 100%; height: 32%; pointer-events: none;">
                        <div class="hat-shape" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: ${characterData.hatColor}; border-top-right-radius: 15px; border-top-left-radius: 15px; z-index: 2;"></div>
                        <div class="hat-brim" style="position: absolute; top: 100%; left: 100%; width: 35%; height: 3px; background: ${characterData.hatColor}; transform: translateY(-100%);"></div>
                    </div>
                    <div class="eye right" style="position: absolute; width: 8px; height: 8px; background: black; border-radius: 50%; top: 25%; right: 15%;"></div>
                    <div class="eye left" style="position: absolute; width: 8px; height: 8px; background: black; border-radius: 50%; top: 25%; right: 55%;"></div>
                    <div class="mouth" style="position: absolute; top: 40%; width: 25%; height: 3px; background: black; left: 60%; ${characterData.expression === 'smile' ? 'border-radius: 0 0 15px 15px; height: 10px;' : characterData.expression === 'sad' ? 'border-radius: 0 0 15px 15px; transform: rotate(180deg); height: 10px;' : ''}"></div>
                    <div class="shirt" style="position: absolute; bottom: -1px; width: 105%; height: 50%; left: 50%; transform: translateX(-50%); background: ${characterData.shirtColor}; border-radius: 15px; border-top-right-radius: 0px; border-top-left-radius: 0px; overflow: hidden;">
                        <div class="under" style="position: absolute; left: 60%; top: 0px; width: 40%; height: 99%; transform: translateX(-50%); background: ${characterData.skinColor};"></div>
                        <div class="tie" style="background: ${characterData.tieColor}; width: 12%; height: 70%; position: absolute; top: 0; left: 55%; border-bottom-right-radius: 8px; border-bottom-left-radius: 8px;"></div>
                    </div>
                    <div class="arm right" style="position: absolute; width: 25%; height: 40%; background: ${characterData.skinColor}; border-radius: 10px; top: 60%; transform-origin: 50% 5%; right: -10%; transform: rotate(-0.5rad); z-index: 0;">
                        <div class="sleeve" style="position: absolute; top: 0; left: 0; border-radius: 10px; background: ${characterData.shirtColor}; width: 100%; height: 50%; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px;"></div>
                    </div>
                    <div class="arm left" style="position: absolute; width: 25%; height: 40%; background: ${characterData.skinColor}; border-radius: 10px; top: 60%; transform-origin: 50% 5%; left: -5%;">
                        <div class="sleeve" style="position: absolute; top: 0; left: 0; border-radius: 10px; background: ${characterData.shirtColor}; width: 100%; height: 50%; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px;"></div>
                    </div>
                    <div class="leg right" style="position: absolute; top: 80%; width: 25%; height: 45%; background: ${characterData.skinColor}; border-radius: 10px; z-index: -1; transform-origin: 50% 5%; transform: translateX(-50%); border-bottom: 18px solid ${characterData.shoesColor}; right: -5%;">
                        <div class="pant" style="position: absolute; width: 100%; height: 80%; top: 0; left: 0; background: ${characterData.pantColor};"></div>
                    </div>
                    <div class="leg left" style="position: absolute; top: 80%; width: 25%; height: 45%; background: ${characterData.skinColor}; border-radius: 10px; z-index: -1; transform-origin: 50% 5%; transform: translateX(-50%); border-bottom: 18px solid ${characterData.shoesColor}; left: 20%;">
                        <div class="pant" style="position: absolute; width: 100%; height: 80%; top: 0; left: 0; background: ${characterData.pantColor};"></div>
                    </div>
                    <div class="shadow" style="position: absolute; top: 115%; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.2); z-index: -2; width: 100%; height: 15px; border-radius: 50%;"></div>
                </div>
            `;
        } else {
            characterHTML = `
                <div class="character" style="background: ${characterData.skinColor}; width: 120px; height: 150px; border-radius: 15px; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                    <div class="hair-realistic" style="position: absolute; top: -22%; left: 0; width: 100%; height: 44%; pointer-events: none;">
                        <div class="hair-base" style="position: absolute; left: 7%; top: 0; width: 86%; height: 90%; background: linear-gradient(120deg, ${characterData.hairColor} 60%, #444 100%); border-top-left-radius: 60% 90%; border-top-right-radius: 90% 100%; border-bottom-left-radius: 60% 60%; border-bottom-right-radius: 80% 70%; z-index: 2;"></div>
                        <div class="hair-forelock" style="position: absolute; top: 18%; left: 55%; width: 38%; height: 38%; background: linear-gradient(120deg, ${characterData.hairColor} 60%, #444 100%); border-top-left-radius: 0 0; border-top-right-radius: 80% 60%; border-bottom-left-radius: 60% 100%; border-bottom-right-radius: 80% 100%; transform: rotate(18deg); z-index: 4;"></div>
                        <div class="hair-side-left" style="position: absolute; left: -2%; top: 22%; width: 18%; height: 60%; background: linear-gradient(120deg, ${characterData.hairColor} 60%, #444 100%); border-top-left-radius: 60% 80%; border-bottom-left-radius: 60% 80%; border-top-right-radius: 40% 60%; border-bottom-right-radius: 40% 60%; z-index: 3;"></div>
                        <div class="hair-side-right" style="position: absolute; right: -2%; top: 28%; width: 16%; height: 56%; background: linear-gradient(120deg, ${characterData.hairColor} 60%, #444 100%); border-top-right-radius: 60% 80%; border-bottom-right-radius: 60% 80%; border-top-left-radius: 40% 60%; border-bottom-left-radius: 40% 60%; z-index: 3;"></div>
                        <div class="hair-topwave" style="position: absolute; top: 2%; left: 32%; width: 38%; height: 28%; background: linear-gradient(120deg, ${characterData.hairColor} 60%, #555 100%); border-radius: 50% 60% 40% 60% / 60% 80% 40% 60%; transform: rotate(-8deg); z-index: 5; opacity: 0.7;"></div>
                    </div>
                    <div class="eye right" style="position: absolute; width: 8px; height: 8px; background: black; border-radius: 50%; top: 25%; right: 15%;"></div>
                    <div class="eye left" style="position: absolute; width: 8px; height: 8px; background: black; border-radius: 50%; top: 25%; right: 55%;"></div>
                    <div class="mouth" style="position: absolute; top: 40%; width: 25%; height: 3px; background: black; left: 60%; ${characterData.expression === 'smile' ? 'border-radius: 0 0 15px 15px; height: 10px;' : characterData.expression === 'sad' ? 'border-radius: 0 0 15px 15px; transform: rotate(180deg); height: 10px;' : ''}"></div>
                    <div class="shirt" style="position: absolute; bottom: -1px; width: 105%; height: 50%; left: 50%; transform: translateX(-50%); background: ${characterData.shirtColor}; border-radius: 15px; border-top-right-radius: 0px; border-top-left-radius: 0px; overflow: hidden;">
                        <div class="under" style="position: absolute; left: 60%; top: 0px; width: 40%; height: 99%; transform: translateX(-50%); background: ${characterData.skinColor};"></div>
                        <div class="tie" style="background: ${characterData.tieColor}; width: 12%; height: 70%; position: absolute; top: 0; left: 55%; border-bottom-right-radius: 8px; border-bottom-left-radius: 8px;"></div>
                    </div>
                    <div class="arm right" style="position: absolute; width: 25%; height: 40%; background: ${characterData.skinColor}; border-radius: 10px; top: 60%; transform-origin: 50% 5%; right: -10%; transform: rotate(-0.5rad); z-index: 0;">
                        <div class="sleeve" style="position: absolute; top: 0; left: 0; border-radius: 10px; background: ${characterData.shirtColor}; width: 100%; height: 50%; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px;"></div>
                    </div>
                    <div class="arm left" style="position: absolute; width: 25%; height: 40%; background: ${characterData.skinColor}; border-radius: 10px; top: 60%; transform-origin: 50% 5%; left: -5%;">
                        <div class="sleeve" style="position: absolute; top: 0; left: 0; border-radius: 10px; background: ${characterData.shirtColor}; width: 100%; height: 50%; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px;"></div>
                    </div>
                    <div class="leg right" style="position: absolute; top: 80%; width: 25%; height: 45%; background: ${characterData.skinColor}; border-radius: 10px; z-index: -1; transform-origin: 50% 5%; transform: translateX(-50%); border-bottom: 18px solid ${characterData.shoesColor}; right: -5%;">
                        <div class="pant" style="position: absolute; width: 100%; height: 80%; top: 0; left: 0; background: ${characterData.pantColor};"></div>
                    </div>
                    <div class="leg left" style="position: absolute; top: 80%; width: 25%; height: 45%; background: ${characterData.skinColor}; border-radius: 10px; z-index: -1; transform-origin: 50% 5%; transform: translateX(-50%); border-bottom: 18px solid ${characterData.shoesColor}; left: 20%;">
                        <div class="pant" style="position: absolute; width: 100%; height: 80%; top: 0; left: 0; background: ${characterData.pantColor};"></div>
                    </div>
                    <div class="shadow" style="position: absolute; top: 115%; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.2); z-index: -2; width: 100%; height: 15px; border-radius: 50%;"></div>
                </div>
            `;
        }
        return characterHTML;
    }
}

// Contoh langkah tutorial (bisa diedit sesuai kebutuhan)
window.cocTutorialSteps = [
    {
        text: 'Selamat datang di SOCISAFE, misi virtualmu untuk menjadi pengguna media sosial yang cerdas dan aman!'
        // Tidak ada selector, jadi tidak ada highlight
    },
    {
        text: 'Ada 40 kotak yang menunggumu, masing-masing berisi edukasi, tantangan, atau ancaman siber.',
        selector: '.game-board'
    },
    {
        text: 'Kumpulkan poin sebanyak mungkin! dan lihat hasil dari setiap keputusan yang kamu ambil…',
        selector: '.player-info'
    },
    {
        text: 'Klik tombol ini untuk melempar dadu dan menentukan langkahmu.',
        selector: '#rollDice'
    },
    {
        text: 'Ambil kartu CHANCE atau EVENT untuk kejutan menarik!',
        selector: '.card-decks-container'
    },
    {
        text: 'Dunia maya menunggumu. Sekarang, mari mulai perjalananmu…'
        // Tidak ada selector di sini!
    }
];

// Fungsi global untuk memulai tutorial
window.startCoCTutorial = function() {
    if (!window.cocTutorial) {
        window.cocTutorial = new CoCTutorial(window.cocTutorialSteps);
    }
    window.cocTutorial.start();
};

// Fungsi untuk debugging tutorial
window.debugTutorial = function() {
    console.log('🔍 Debug Tutorial:');
    console.log('- Game object:', !!window.game);
    console.log('- Player object:', !!(window.game && window.game.getPlayer()));
    if (window.game && window.game.getPlayer()) {
        console.log('- Player position:', window.game.getPlayer().position);
        console.log('- Tutorial akan muncul:', window.game.getPlayer().position === 0);
    }
    console.log('- cocTutorialDone:', localStorage.getItem('cocTutorialDone'));
};

// Fungsi untuk paksa tutorial muncul (testing)
window.forceTutorial = function() {
    console.log('🔧 Memaksa tutorial muncul...');
    window.startCoCTutorial();
};

// Tutorial sekarang hanya dipanggil dari UI.js ketika pemain di posisi 0
// Tidak ada auto-start lagi
