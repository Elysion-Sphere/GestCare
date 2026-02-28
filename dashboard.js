/* ========================================
   GESTCARE - DASHBOARD JAVASCRIPT
   Partículas DNA/Células + Sidebar + Interações
   ======================================== */

'use strict';

// =============================================
// SISTEMA DE PARTÍCULAS — CÉLULAS E DNA
// =============================================

class DNAParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) return;

        this.cells = [];
        this.dnaPoints = [];
        this.floatingCrosses = [];
        this.time = 0;
        this.isRunning = false;
        this._boundAnimate = this.animate.bind(this);

        this.init();
    }

    init() {
        this.resize();
        this.createCells();
        this.createFloatingCrosses();
        this.addEventListeners();
        this.isRunning = true;
        this.animate();
    }

    resize() {
        const section = this.canvas.parentElement;
        if (!section) return;
        const rect = section.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    createCells() {
        this.cells = [];
        const w = this.canvas.width;
        const h = this.canvas.height;
        const count = Math.min(35, Math.max(12, Math.floor(w / 30)));

        for (let i = 0; i < count; i++) {
            const type = Math.random();
            this.cells.push({
                x: Math.random() * w,
                y: Math.random() * h,
                radius: type < 0.3 ? (Math.random() * 8 + 4) : (Math.random() * 5 + 2),
                speedX: (Math.random() - 0.5) * 0.6,
                speedY: (Math.random() - 0.5) * 0.6,
                opacity: Math.random() * 0.4 + 0.15,
                type: type < 0.3 ? 'cell' : (type < 0.6 ? 'molecule' : 'particle'),
                pulseSpeed: Math.random() * 0.02 + 0.01,
                pulseOffset: Math.random() * Math.PI * 2,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.02,
            });
        }
    }

    createFloatingCrosses() {
        this.floatingCrosses = [];
        for (let i = 0; i < 3; i++) {
            this.floatingCrosses.push({
                x: this.canvas.width * (0.5 + Math.random() * 0.45),
                y: Math.random() * this.canvas.height,
                size: Math.random() * 6 + 4,
                speedY: (Math.random() - 0.5) * 0.3,
                speedX: (Math.random() - 0.5) * 0.2,
                opacity: Math.random() * 0.2 + 0.1,
                rotation: Math.random() * Math.PI,
                rotSpeed: (Math.random() - 0.5) * 0.01,
            });
        }
    }

    addEventListeners() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resize();
                this.createCells();
                this.createFloatingCrosses();
            }, 200);
        }, { passive: true });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.isRunning = false;
            } else if (!this.isRunning) {
                this.isRunning = true;
                this.animate();
            }
        });
    }

    drawCell(cell) {
        const ctx = this.ctx;
        const pulse = Math.sin(this.time * cell.pulseSpeed + cell.pulseOffset) * 0.3 + 1;
        const r = cell.radius * pulse;

        if (cell.type === 'cell') {
            // Célula com membrana e núcleo
            ctx.save();
            ctx.globalAlpha = cell.opacity;

            // Membrana externa (glow)
            const gradient = ctx.createRadialGradient(cell.x, cell.y, 0, cell.x, cell.y, r * 1.8);
            gradient.addColorStop(0, 'rgba(66, 165, 245, 0.15)');
            gradient.addColorStop(0.6, 'rgba(66, 165, 245, 0.08)');
            gradient.addColorStop(1, 'rgba(66, 165, 245, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(cell.x, cell.y, r * 1.8, 0, Math.PI * 2);
            ctx.fill();

            // Membrana celular
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(cell.x, cell.y, r, 0, Math.PI * 2);
            ctx.stroke();

            // Citoplasma
            ctx.fillStyle = 'rgba(144, 202, 249, 0.2)';
            ctx.fill();

            // Núcleo
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(cell.x - r * 0.2, cell.y - r * 0.1, r * 0.4, 0, Math.PI * 2);
            ctx.fill();

            // Organelas pequenas (mitocôndrias)
            for (let i = 0; i < 3; i++) {
                const angle = (this.time * 0.01 + cell.pulseOffset) + (i * Math.PI * 2 / 3);
                const ox = cell.x + Math.cos(angle) * r * 0.55;
                const oy = cell.y + Math.sin(angle) * r * 0.55;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.beginPath();
                ctx.arc(ox, oy, r * 0.12, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();

        } else if (cell.type === 'molecule') {
            // Molécula (estrutura hexagonal)
            ctx.save();
            ctx.translate(cell.x, cell.y);
            ctx.rotate(cell.rotation);
            ctx.globalAlpha = cell.opacity * 0.7;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 1;

            // Hexágono
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i - Math.PI / 6;
                const px = Math.cos(angle) * r;
                const py = Math.sin(angle) * r;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.stroke();

            // Nós nos vértices
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i - Math.PI / 6;
                const px = Math.cos(angle) * r;
                const py = Math.sin(angle) * r;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.beginPath();
                ctx.arc(px, py, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();

        } else {
            // Partícula simples flutuante
            ctx.globalAlpha = cell.opacity * 0.6;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();
            ctx.arc(cell.x, cell.y, r * 0.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    drawDNAHelix() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Posicionar o DNA no lado direito do banner
        const startX = w * 0.62;
        const endX = w * 0.92;
        const centerY = h * 0.5;
        const amplitude = h * 0.28;
        const frequency = 0.06;
        const points = 50;

        ctx.save();

        // Desenhar as duas fitas do DNA
        for (let strand = 0; strand < 2; strand++) {
            const phaseOffset = strand * Math.PI;

            ctx.beginPath();
            ctx.strokeStyle = strand === 0
                ? 'rgba(255, 255, 255, 0.35)'
                : 'rgba(144, 202, 249, 0.35)';
            ctx.lineWidth = 2;

            for (let i = 0; i <= points; i++) {
                const t = i / points;
                const x = startX + (endX - startX) * t;
                const y = centerY + Math.sin(t * Math.PI * 4 + this.time * 0.025 + phaseOffset) * amplitude;

                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        // Pontes entre as fitas (bases nitrogenadas)
        for (let i = 0; i <= points; i += 3) {
            const t = i / points;
            const x = startX + (endX - startX) * t;
            const y1 = centerY + Math.sin(t * Math.PI * 4 + this.time * 0.025) * amplitude;
            const y2 = centerY + Math.sin(t * Math.PI * 4 + this.time * 0.025 + Math.PI) * amplitude;

            // Só desenhar pontes quando as fitas estão visíveis (não se cruzando demais)
            const dist = Math.abs(y1 - y2);
            if (dist > amplitude * 0.3) {
                const midY = (y1 + y2) / 2;

                // Linha da ponte
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 + (dist / (amplitude * 2)) * 0.15})`;
                ctx.lineWidth = 1.2;
                ctx.moveTo(x, y1);
                ctx.lineTo(x, y2);
                ctx.stroke();

                // Nós nas bases (cores representando A-T, C-G)
                const colors = [
                    ['rgba(129, 212, 250, 0.6)', 'rgba(255, 183, 77, 0.6)'],  // Azul - Laranja
                    ['rgba(165, 214, 167, 0.6)', 'rgba(239, 154, 154, 0.6)'], // Verde - Vermelho
                ];
                const colorPair = colors[i % 2];

                ctx.fillStyle = colorPair[0];
                ctx.beginPath();
                ctx.arc(x, y1, 2.5, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = colorPair[1];
                ctx.beginPath();
                ctx.arc(x, y2, 2.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.restore();
    }

    drawFloatingCrosses() {
        const ctx = this.ctx;

        for (const cross of this.floatingCrosses) {
            ctx.save();
            ctx.translate(cross.x, cross.y);
            ctx.rotate(cross.rotation);
            ctx.globalAlpha = cross.opacity;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';

            // Cruz médica
            const s = cross.size;
            ctx.fillRect(-s * 0.3, -s, s * 0.6, s * 2);
            ctx.fillRect(-s, -s * 0.3, s * 2, s * 0.6);

            ctx.restore();

            // Atualizar posição
            cross.x += cross.speedX;
            cross.y += cross.speedY;
            cross.rotation += cross.rotSpeed;

            // Loop
            if (cross.x < 0 || cross.x > this.canvas.width) cross.speedX *= -1;
            if (cross.y < 0 || cross.y > this.canvas.height) cross.speedY *= -1;
        }
    }

    drawConnections() {
        const ctx = this.ctx;
        const maxDist = 80;

        for (let i = 0; i < this.cells.length; i++) {
            for (let j = i + 1; j < this.cells.length; j++) {
                const a = this.cells[i];
                const b = this.cells[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < maxDist * maxDist) {
                    const dist = Math.sqrt(distSq);
                    const opacity = (1 - dist / maxDist) * 0.12;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = 0.6;
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }
    }

    update() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        for (const cell of this.cells) {
            cell.x += cell.speedX;
            cell.y += cell.speedY;
            cell.rotation += cell.rotSpeed;

            if (cell.x < -20) cell.x = w + 20;
            if (cell.x > w + 20) cell.x = -20;
            if (cell.y < -20) cell.y = h + 20;
            if (cell.y > h + 20) cell.y = -20;

            cell.opacity += (Math.random() - 0.5) * 0.005;
            cell.opacity = Math.max(0.1, Math.min(0.5, cell.opacity));
        }

        this.time++;
    }

    animate() {
        if (!this.isRunning) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawDNAHelix();
        this.drawConnections();

        for (const cell of this.cells) {
            this.drawCell(cell);
        }

        this.drawFloatingCrosses();
        this.update();

        requestAnimationFrame(this._boundAnimate);
    }
}


// =============================================
// SIDEBAR TOGGLE (MOBILE)
// =============================================

class SidebarController {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.toggleBtn = document.getElementById('menu-toggle');
        this.overlay = null;

        if (!this.sidebar || !this.toggleBtn) return;

        this.createOverlay();
        this.init();
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'sidebar-overlay';
        document.body.appendChild(this.overlay);
    }

    init() {
        this.toggleBtn.addEventListener('click', () => this.toggle());
        this.overlay.addEventListener('click', () => this.close());

        const navItems = this.sidebar.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 900) this.close();
            });
        });
    }

    toggle() {
        this.sidebar.classList.toggle('open');
        this.overlay.classList.toggle('show');
    }

    close() {
        this.sidebar.classList.remove('open');
        this.overlay.classList.remove('show');
    }
}


// =============================================
// NAVEGAÇÃO ATIVA
// =============================================

class NavigationController {
    constructor() {
        this.navItems = document.querySelectorAll('.sidebar-nav .nav-item');
        if (this.navItems.length === 0) return;
        this.init();
    }

    init() {
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (!item.getAttribute('onclick')) e.preventDefault();
                this.setActive(item);
            });
        });
    }

    setActive(activeItem) {
        this.navItems.forEach(item => item.classList.remove('active'));
        activeItem.classList.add('active');
    }
}


// =============================================
// ANIMAÇÃO DOS NÚMEROS DAS ESTATÍSTICAS
// =============================================

class StatsAnimator {
    constructor() {
        this.animated = false;
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animated = true;
                    this.animateAll();
                }
            });
        }, { threshold: 0.3 });

        const statsGrid = document.querySelector('.stats-grid');
        if (statsGrid) observer.observe(statsGrid);
    }

    animateAll() {
        this.animateValue('stat-consultas-val', 0, 24, 1200);
        this.animateValue('stat-pacientes-val', 0, 1248, 1500, true);
        this.animateValue('stat-medicos-val', 0, 12, 1000);
        this.animateValue('stat-leitos-val', 0, 78, 1300, false, '%');
    }

    animateValue(elementId, start, end, duration, format = false, suffix = '') {
        const el = document.getElementById(elementId);
        if (!el) return;

        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(start + (end - start) * eased);

            if (format) {
                el.textContent = value.toLocaleString('pt-BR') + suffix;
            } else {
                el.textContent = value + suffix;
            }

            if (progress < 1) requestAnimationFrame(update);
        };

        requestAnimationFrame(update);
    }
}


// =============================================
// SAUDAÇÃO DINÂMICA
// =============================================

function updateGreeting() {
    const h1 = document.querySelector('.welcome-text h1');
    if (!h1) return;

    const hour = new Date().getHours();
    let greeting;

    if (hour >= 5 && hour < 12) greeting = 'Bom dia';
    else if (hour >= 12 && hour < 18) greeting = 'Boa tarde';
    else greeting = 'Boa noite';

    h1.textContent = `${greeting}, André! 👋`;
}


// =============================================
// EFEITO NAS LINHAS DA TABELA
// =============================================

function setupTableInteractions() {
    const rows = document.querySelectorAll('.agenda-table tbody tr');
    rows.forEach(row => {
        row.addEventListener('click', () => {
            rows.forEach(r => r.style.background = '');
            row.style.background = 'rgba(66, 165, 245, 0.06)';
        });
    });
}


// =============================================
// INICIALIZAÇÃO
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    try {
        updateGreeting();
        new DNAParticleSystem('dna-canvas');
        new SidebarController();
        new NavigationController();
        new StatsAnimator();
        setupTableInteractions();
    } catch (error) {
        console.error('[GestCare] Erro ao inicializar dashboard:', error);
    }
});
