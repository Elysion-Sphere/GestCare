/* ========================================
   GESTCARE - STATS & SAUDAÇÃO
   Animação de números + saudação dinâmica
   ======================================== */

'use strict';

// =============================================
// ANIMAÇÃO DOS NÚMEROS
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
        this.animateValue('stat-hospitais-val', 0, 3, 1000);
        this.animateValue('stat-documentos-val', 0, 18, 1200);
        this.animateValue('stat-exames-val', 0, 7, 1000);
        this.animateValue('stat-receitas-val', 0, 4, 800);
    }

    animateValue(elementId, start, end, duration, suffix = '') {
        const el = document.getElementById(elementId);
        if (!el) return;

        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(start + (end - start) * eased);
            el.textContent = value + suffix;
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
    updateGreeting();
    new StatsAnimator();
    setupTableInteractions();
});
