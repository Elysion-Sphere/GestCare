/* ========================================
   GESTCARE - JAVASCRIPT
   Partículas + Validação Login/Cadastro
   ======================================== */

'use strict';

// =============================================
// SISTEMA DE PARTÍCULAS
// =============================================

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


// =============================================
// UTILITÁRIOS
// =============================================

function safeGetElement(id) {
    if (typeof id !== 'string' || !id) return null;
    return document.getElementById(id);
}

function safeGetValue(id) {
    const el = safeGetElement(id);
    if (!el) return '';
    return (el.value || '').trim();
}


// =============================================
// MÁSCARAS
// =============================================

function maskCPF(input) {
    if (!input) return;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 9) value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    else if (value.length > 6) value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    else if (value.length > 3) value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    input.value = value;
}

function maskPhone(input) {
    if (!input) return;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 6) value = value.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
    else if (value.length > 2) value = value.replace(/(\d{2})(\d{1,5})/, '($1) $2');
    else if (value.length > 0) value = value.replace(/(\d{1,2})/, '($1');
    input.value = value;
}


// =============================================
// EXIBIR MENSAGENS
// =============================================

function showMessage(elementId, text, type) {
    const el = safeGetElement(elementId);
    if (!el) return;
    el.textContent = String(text);
    el.className = 'message ' + (type === 'success' ? 'success' : 'error');
    el.style.display = 'flex';
    setTimeout(() => { if (el) el.style.display = 'none'; }, 4000);
}


// =============================================
// VALIDAÇÃO DO LOGIN
// =============================================

function setupLoginForm() {
    const form = safeGetElement('login-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = safeGetValue('email');
        const password = safeGetValue('password');

        if (!email || !password) {
            showMessage('login-message', '⚠️ Preencha todos os campos.', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('login-message', '⚠️ Digite um e-mail válido.', 'error');
            return;
        }

        if (password.length < 6) {
            showMessage('login-message', '⚠️ A senha deve ter pelo menos 6 caracteres.', 'error');
            return;
        }

        showMessage('login-message', '✅ Login realizado com sucesso!', 'success');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
    });
}


// =============================================
// VALIDAÇÃO DO CADASTRO
// =============================================

function setupCadastroForm() {
    const form = safeGetElement('cadastro-form');
    if (!form) return;

    const cpfInput = safeGetElement('cpf');
    if (cpfInput) cpfInput.addEventListener('input', () => maskCPF(cpfInput));

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = safeGetValue('nome');
        const cpf = safeGetValue('cpf');
        const nascimento = safeGetValue('nascimento');
        const email = safeGetValue('email-cadastro');
        const senha = safeGetValue('senha');
        const confirmarSenha = safeGetValue('confirmar-senha');
        const genero = safeGetValue('genero');

        // Campos obrigatórios
        if (!nome || !cpf || !nascimento || !email || !senha || !confirmarSenha || !genero) {
            showMessage('cadastro-message', '⚠️ Preencha todos os campos.', 'error');
            return;
        }

        // Nome completo (RN01)
        if (nome.split(/\s+/).filter(Boolean).length < 2) {
            showMessage('cadastro-message', '⚠️ Informe o nome completo (nome e sobrenome).', 'error');
            return;
        }

        // CPF 11 dígitos (RN03)
        const cpfDigits = cpf.replace(/\D/g, '');
        if (cpfDigits.length !== 11) {
            showMessage('cadastro-message', '⚠️ CPF deve conter 11 dígitos.', 'error');
            return;
        }
        if (/^(\d)\1{10}$/.test(cpfDigits)) {
            showMessage('cadastro-message', '⚠️ CPF inválido.', 'error');
            return;
        }

        // Data de nascimento não futura (RN02)
        const birthDate = new Date(nascimento);
        const today = new Date();
        if (isNaN(birthDate.getTime()) || birthDate > today) {
            showMessage('cadastro-message', '⚠️ Data de nascimento inválida.', 'error');
            return;
        }

        // Email válido (RN04)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('cadastro-message', '⚠️ Digite um e-mail válido.', 'error');
            return;
        }

        // Senha mínimo 6 caracteres (RN05)
        if (senha.length < 6) {
            showMessage('cadastro-message', '⚠️ A senha deve ter pelo menos 6 caracteres.', 'error');
            return;
        }

        // Senhas coincidem
        if (senha !== confirmarSenha) {
            showMessage('cadastro-message', '⚠️ As senhas não coincidem.', 'error');
            return;
        }

        // Gênero válido (RN07)
        if (!['1', '2', '3'].includes(genero)) {
            showMessage('cadastro-message', '⚠️ Selecione um gênero válido.', 'error');
            return;
        }

        // Sucesso
        showMessage('cadastro-message', '✅ Cadastro realizado com sucesso! Redirecionando...', 'success');
        form.reset();

        setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
    });
}


// =============================================
// INICIALIZAÇÃO
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    try {
        new ParticleSystem('particles-canvas');
        setupLoginForm();
        setupCadastroForm();
    } catch (error) {
        console.error('[GestCare] Erro ao inicializar:', error);
    }
});
