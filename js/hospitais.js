/* ========================================
   GESTCARE - HOSPITAIS
   CRUD completo: listar, adicionar, editar, excluir, buscar
   ======================================== */

// ======== DADOS SIMULADOS ========
var hospitais = [
    { id: 1, nome: 'Hospital São Lucas', telefone: '(11) 3456-7890', endereco: 'Av. Paulista, 1000 - São Paulo' },
    { id: 2, nome: 'Clínica Santa Maria', telefone: '(11) 2345-6789', endereco: 'Rua Augusta, 500 - São Paulo' },
    { id: 3, nome: 'Lab Central', telefone: '(11) 9876-5432', endereco: 'Rua Oscar Freire, 200 - São Paulo' },
];
var nextId = 4;

// ======== TEMPLATE DO CARD ========
function buildCardHTML(h) {
    return `
    <div class="hospital-card">
        <div class="hospital-card-header">
            <div class="hospital-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>
            </div>
            <h3>${escapeHTML(h.nome)}</h3>
        </div>
        <div class="hospital-card-body">
            ${h.telefone ? `<p class="hospital-detail"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg> ${escapeHTML(h.telefone)}</p>` : ''}
            ${h.endereco ? `<p class="hospital-detail"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> ${escapeHTML(h.endereco)}</p>` : ''}
        </div>
        <div class="hospital-card-actions">
            <button class="btn-edit" onclick="editHospital(${h.id})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Editar
            </button>
            <button class="btn-delete" onclick="deleteHospital(${h.id})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Excluir
            </button>
        </div>
    </div>`;
}

// ======== SEGURANÇA: ESCAPE HTML ========
function escapeHTML(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ======== RENDERIZAR CARDS ========
function renderHospitais() {
    var grid = document.getElementById('hospitais-grid');
    var empty = document.getElementById('empty-state');
    if (!grid) return;

    if (hospitais.length === 0) {
        grid.innerHTML = '';
        if (empty) {
            empty.style.display = 'flex';
            empty.querySelector('h3').textContent = 'Nenhum hospital cadastrado';
            empty.querySelector('p').textContent = 'Clique em "Novo Hospital" para adicionar o primeiro.';
        }
        return;
    }
    if (empty) empty.style.display = 'none';

    grid.innerHTML = hospitais.map(function (h) { return buildCardHTML(h); }).join('');
}

// ======== MODAL ========
function openModal(id) {
    var overlay = document.getElementById('modal-overlay');
    var title = document.getElementById('modal-title');
    var form = document.getElementById('hospital-form');
    if (!overlay || !title || !form) return;

    overlay.classList.add('show');

    if (id) {
        var h = hospitais.find(function (h) { return h.id === id; });
        if (h) {
            title.textContent = 'Editar Hospital';
            document.getElementById('hospital-id').value = h.id;
            document.getElementById('hospital-nome').value = h.nome;
            document.getElementById('hospital-telefone').value = h.telefone || '';
            document.getElementById('hospital-endereco').value = h.endereco || '';
        }
    } else {
        title.textContent = 'Novo Hospital';
        form.reset();
        document.getElementById('hospital-id').value = '';
    }
}

function closeModal() {
    var overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.classList.remove('show');
}

// ======== SALVAR (CRIAR/EDITAR) ========
function saveHospital(e) {
    e.preventDefault();
    var id = document.getElementById('hospital-id').value;
    var nome = document.getElementById('hospital-nome').value.trim();
    var telefone = document.getElementById('hospital-telefone').value.trim();
    var endereco = document.getElementById('hospital-endereco').value.trim();

    if (!nome) {
        alert('O nome do hospital é obrigatório!');
        return;
    }

    if (id) {
        var h = hospitais.find(function (h) { return h.id === parseInt(id); });
        if (h) {
            h.nome = nome;
            h.telefone = telefone;
            h.endereco = endereco;
        }
    } else {
        hospitais.push({ id: nextId++, nome: nome, telefone: telefone, endereco: endereco });
    }

    closeModal();
    renderHospitais();
}

function editHospital(id) {
    openModal(id);
}

// ======== EXCLUIR ========
function deleteHospital(id) {
    var h = hospitais.find(function (item) { return item.id === id; });
    if (!h) return;
    if (confirm('Tem certeza que deseja excluir "' + h.nome + '"?\nTodos os documentos vinculados serão perdidos.')) {
        hospitais = hospitais.filter(function (item) { return item.id !== id; });
        renderHospitais();
    }
}

// ======== BUSCA POR NOME ========
function searchHospitais() {
    var input = document.getElementById('busca-hospital');
    var grid = document.getElementById('hospitais-grid');
    var empty = document.getElementById('empty-state');
    if (!input || !grid) return;

    var busca = input.value.toLowerCase().trim();

    var filtered = busca
        ? hospitais.filter(function (h) { return h.nome.toLowerCase().indexOf(busca) !== -1; })
        : hospitais;

    if (filtered.length === 0) {
        grid.innerHTML = '';
        if (empty) {
            empty.style.display = 'flex';
            empty.querySelector('h3').textContent = busca ? 'Nenhum hospital encontrado' : 'Nenhum hospital cadastrado';
            empty.querySelector('p').textContent = busca ? 'Nenhum resultado para "' + busca + '"' : 'Clique em "Novo Hospital" para adicionar o primeiro.';
        }
        return;
    }
    if (empty) empty.style.display = 'none';

    grid.innerHTML = filtered.map(function (h) { return buildCardHTML(h); }).join('');
}

// ======== MÁSCARA DE TELEFONE ========
function setupPhoneMask() {
    var input = document.getElementById('hospital-telefone');
    if (!input) return;
    input.addEventListener('input', function () {
        var value = this.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        if (value.length > 6) value = value.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
        else if (value.length > 2) value = value.replace(/(\d{2})(\d{1,5})/, '($1) $2');
        this.value = value;
    });
}

// ======== FECHAR MODAL COM ESC ========
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
});

// ======== FECHAR MODAL CLICANDO FORA ========
document.addEventListener('click', function (e) {
    var overlay = document.getElementById('modal-overlay');
    if (e.target === overlay) closeModal();
});

// ======== INICIALIZAR ========
document.addEventListener('DOMContentLoaded', function () {
    renderHospitais();
    setupPhoneMask();
});
