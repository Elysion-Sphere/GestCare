/* ========================================
   GESTCARE - SISTEMA DE PARTÍCULAS
   Canvas interativo para login/cadastro
   ======================================== */

'use strict';

class ParticleSystem {
    constructor(canvasId) {
        try {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas || !(this.canvas instanceof HTMLCanvasElement)) return;
            this.ctx = this.canvas.getContext('2d');
            if (!this.ctx) return;

            this.particles = [];
            this.mouse = { x: null, y: null, radius: 150 };
            this.animationId = null;
            this.isRunning = false;
            this._boundAnimate = this.animate.bind(this);
            this._resizeTimeout = null;

            this.config = Object.freeze({
                particleCount: 80,
                particleColor: 'rgba(25, 118, 210, {opacity})',
                lineColor: 'rgba(25, 118, 210, {opacity})',
                particleMinSize: 1.5,
                particleMaxSize: 3.5,
                speed: 0.4,
                connectionDistance: 130,
                mouseConnectionDistance: 180,
            });

            this.init();
        } catch (error) {
            console.error('[ParticleSystem] Erro:', error);
        }
    }

    init() {
        this.resize();
        this.createParticles();
        this.addEventListeners();
        this.isRunning = true;
        this.animate();
    }

    destroy() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resize() {
        const parent = this.canvas.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    createParticles() {
        this.particles = [];
        if (this.canvas.width === 0 || this.canvas.height === 0) return;
        const count = Math.min(this.config.particleCount, Math.max(20, Math.floor((this.canvas.width * this.canvas.height) / 8000)));
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * (this.config.particleMaxSize - this.config.particleMinSize) + this.config.particleMinSize,
                speedX: (Math.random() - 0.5) * this.config.speed * 2,
                speedY: (Math.random() - 0.5) * this.config.speed * 2,
                opacity: Math.random() * 0.5 + 0.2,
            });
        }
    }

    addEventListeners() {
        const parent = this.canvas.parentElement;
        if (!parent) return;
        parent.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        }, { passive: true });
        parent.addEventListener('mouseleave', () => { this.mouse.x = null; this.mouse.y = null; }, { passive: true });
        window.addEventListener('resize', () => {
            clearTimeout(this._resizeTimeout);
            this._resizeTimeout = setTimeout(() => { this.resize(); this.createParticles(); }, 200);
        }, { passive: true });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) { this.isRunning = false; if (this.animationId) { cancelAnimationFrame(this.animationId); this.animationId = null; } }
            else if (!this.isRunning) { this.isRunning = true; this.animate(); }
        });
    }

    drawParticle(p) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = this.config.particleColor.replace('{opacity}', String(p.opacity));
        this.ctx.fill();
    }

    drawConnections() {
        const len = this.particles.length;
        for (let i = 0; i < len; i++) {
            const pi = this.particles[i];
            for (let j = i + 1; j < len; j++) {
                const pj = this.particles[j];
                const dx = pi.x - pj.x, dy = pi.y - pj.y;
                const distSq = dx * dx + dy * dy;
                const maxDist = this.config.connectionDistance;
                if (distSq < maxDist * maxDist) {
                    const dist = Math.sqrt(distSq);
                    const opacity = (1 - dist / maxDist) * 0.25;
                    this.ctx.beginPath();
                    this.ctx.moveTo(pi.x, pi.y);
                    this.ctx.lineTo(pj.x, pj.y);
                    this.ctx.strokeStyle = this.config.lineColor.replace('{opacity}', String(opacity));
                    this.ctx.lineWidth = 0.8;
                    this.ctx.stroke();
                }
            }
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = pi.x - this.mouse.x, dy = pi.y - this.mouse.y;
                const distSq = dx * dx + dy * dy;
                const maxDist = this.config.mouseConnectionDistance;
                if (distSq < maxDist * maxDist) {
                    const dist = Math.sqrt(distSq);
                    const opacity = (1 - dist / maxDist) * 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(pi.x, pi.y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.strokeStyle = this.config.lineColor.replace('{opacity}', String(opacity));
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                    const force = (maxDist - dist) / maxDist;
                    const angle = Math.atan2(dy, dx);
                    pi.x += Math.cos(angle) * force * 0.8;
                    pi.y += Math.sin(angle) * force * 0.8;
                }
            }
        }
    }

    updateParticles() {
        const w = this.canvas.width, h = this.canvas.height;
        if (w === 0 || h === 0) return;
        for (const p of this.particles) {
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.x < 0 || p.x > w) p.speedX *= -1;
            if (p.y < 0 || p.y > h) p.speedY *= -1;
            p.x = Math.max(0, Math.min(w, p.x));
            p.y = Math.max(0, Math.min(h, p.y));
            p.opacity += (Math.random() - 0.5) * 0.01;
            p.opacity = Math.max(0.15, Math.min(0.6, p.opacity));
        }
    }

    animate() {
        if (!this.isRunning) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateParticles();
        this.drawConnections();
        for (const p of this.particles) this.drawParticle(p);
        this.animationId = requestAnimationFrame(this._boundAnimate);
    }
}

// Inicializa quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem('particles-canvas');
});
