/* ========================================
   GESTCARE - SIDEBAR
   Toggle mobile + navegação ativa
   ======================================== */

'use strict';

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

// Inicializa quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new SidebarController();
});
