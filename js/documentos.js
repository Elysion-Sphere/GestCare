/* ========================================
   GESTCARE - DOCUMENTOS
   CRUD completo: listar, adicionar, editar, excluir, filtrar
   ======================================== */

// ======== DADOS SIMULADOS ========
var hospitais = [
    { id: 1, nome: 'Hospital São Lucas' },
    { id: 2, nome: 'Clínica Santa Maria' },
    { id: 3, nome: 'Lab Central' },
];

var documentos = [
    { id: 1, hospitalId: 1, tipo: 'exame', data: '2026-02-27', descricao: 'Hemograma completo', arquivo: 'hemograma.pdf', ext: 'pdf' },
    { id: 2, hospitalId: 2, tipo: 'consulta', data: '2026-02-25', descricao: 'Consulta cardiológica — acompanhamento', arquivo: 'consulta_cardio.jpg', ext: 'jpg' },
    { id: 3, hospitalId: 1, tipo: 'receita', data: '2026-02-20', descricao: 'Receita — Losartana 50mg', arquivo: 'receita_losartana.pdf', ext: 'pdf' },
    { id: 4, hospitalId: 3, tipo: 'laudo', data: '2026-02-15', descricao: 'Laudo de ressonância magnética', arquivo: 'laudo_rm.pdf', ext: 'pdf' },
    { id: 5, hospitalId: 2, tipo: 'exame', data: '2026-02-10', descricao: 'Eletrocardiograma', arquivo: 'ecg.png', ext: 'png' },
    { id: 6, hospitalId: 1, tipo: 'consulta', data: '2026-01-28', descricao: 'Retorno clínico geral', arquivo: 'retorno_clinico.pdf', ext: 'pdf' },
    { id: 7, hospitalId: 3, tipo: 'exame', data: '2026-01-15', descricao: 'Glicemia em jejum', arquivo: 'glicemia.pdf', ext: 'pdf' },
];
var nextDocId = 8;
var selectedFile = null;

// ======== UTILITÁRIOS ========
function getHospitalName(id) {
    var h = hospitais.find(function (h) { return h.id === id; });
    return h ? h.nome : 'Desconhecido';
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    var parts = dateStr.split('-');
    return parts[2] + '/' + parts[1] + '/' + parts[0];
}

function escapeDocHTML(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function getFileClass(ext) {
    return ext === 'pdf' ? 'pdf' : 'img';
}

// ======== POPULAR SELECTS DE HOSPITAL ========
function populateHospitalSelects() {
    var selects = [document.getElementById('filter-hospital'), document.getElementById('doc-hospital')];
    selects.forEach(function (sel) {
        if (!sel) return;
        var currentValue = sel.value;
        var firstOption = sel.options[0];
        sel.innerHTML = '';
        sel.appendChild(firstOption);
        hospitais.forEach(function (h) {
            var opt = document.createElement('option');
            opt.value = h.id;
            opt.textContent = h.nome;
            sel.appendChild(opt);
        });
        if (currentValue) sel.value = currentValue;
    });
}

// ======== RENDERIZAR DOCUMENTOS ========
function renderDocs(list) {
    var tbody = document.getElementById('docs-tbody');
    var empty = document.getElementById('empty-state');
    if (!tbody) return;

    var docs = list || documentos;

    if (docs.length === 0) {
        tbody.innerHTML = '';
        if (empty) empty.style.display = 'flex';
        return;
    }
    if (empty) empty.style.display = 'none';

    tbody.innerHTML = docs.map(function (d) {
        return '<tr>' +
            '<td class="time-cell">' + formatDate(d.data) + '</td>' +
            '<td><span class="doc-type-badge ' + d.tipo + '">' + d.tipo + '</span></td>' +
            '<td>' + escapeDocHTML(getHospitalName(d.hospitalId)) + '</td>' +
            '<td>' + escapeDocHTML(d.descricao || '—') + '</td>' +
            '<td><span class="file-badge ' + getFileClass(d.ext) + '">' + d.ext.toUpperCase() + '</span></td>' +
            '<td class="actions-cell">' +
            '<button class="action-btn" title="Editar" onclick="editDoc(' + d.id + ')">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
            '</button>' +
            '<button class="action-btn btn-action-delete" title="Excluir" onclick="deleteDoc(' + d.id + ')">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>' +
            '</button>' +
            '</td>' +
            '</tr>';
    }).join('');
}

// ======== FILTROS ========
function applyFilters() {
    var tipo = document.getElementById('filter-tipo').value;
    var hospitalId = document.getElementById('filter-hospital').value;
    var busca = document.getElementById('filter-busca').value.toLowerCase().trim();

    var filtered = documentos;
    if (tipo) filtered = filtered.filter(function (d) { return d.tipo === tipo; });
    if (hospitalId) filtered = filtered.filter(function (d) { return d.hospitalId === parseInt(hospitalId); });
    if (busca) filtered = filtered.filter(function (d) { return (d.descricao || '').toLowerCase().indexOf(busca) !== -1; });

    renderDocs(filtered);
}

// ======== MODAL ========
function openDocModal(id) {
    var overlay = document.getElementById('modal-overlay');
    var title = document.getElementById('modal-title');
    var form = document.getElementById('doc-form');
    if (!overlay || !title || !form) return;

    overlay.classList.add('show');
    selectedFile = null;
    document.getElementById('upload-preview').style.display = 'none';
    document.getElementById('upload-placeholder').style.display = 'flex';

    if (id) {
        var d = documentos.find(function (d) { return d.id === id; });
        if (d) {
            title.textContent = 'Editar Documento';
            document.getElementById('doc-id').value = d.id;
            document.getElementById('doc-hospital').value = d.hospitalId;
            document.getElementById('doc-tipo').value = d.tipo;
            document.getElementById('doc-data').value = d.data;
            document.getElementById('doc-descricao').value = d.descricao || '';
            document.getElementById('file-name').textContent = d.arquivo;
            document.getElementById('upload-preview').style.display = 'flex';
            document.getElementById('upload-placeholder').style.display = 'none';
        }
    } else {
        title.textContent = 'Novo Documento';
        form.reset();
        document.getElementById('doc-id').value = '';
    }
}

function closeDocModal() {
    var overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.classList.remove('show');
}

// ======== UPLOAD DE ARQUIVO ========
function handleFileSelect(e) {
    var file = e.target.files[0];
    if (!file) return;

    var validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (validTypes.indexOf(file.type) === -1) {
        alert('Formato inválido! Aceitos: PDF, JPG, PNG.');
        e.target.value = '';
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        alert('Arquivo muito grande! Máximo 10MB.');
        e.target.value = '';
        return;
    }

    selectedFile = file;
    document.getElementById('file-name').textContent = file.name;
    document.getElementById('upload-preview').style.display = 'flex';
    document.getElementById('upload-placeholder').style.display = 'none';
}

function removeFile() {
    selectedFile = null;
    document.getElementById('doc-arquivo').value = '';
    document.getElementById('upload-preview').style.display = 'none';
    document.getElementById('upload-placeholder').style.display = 'flex';
}

// ======== SALVAR DOCUMENTO ========
function saveDoc(e) {
    e.preventDefault();
    var id = document.getElementById('doc-id').value;
    var hospitalId = parseInt(document.getElementById('doc-hospital').value);
    var tipo = document.getElementById('doc-tipo').value;
    var data = document.getElementById('doc-data').value;
    var descricao = document.getElementById('doc-descricao').value.trim();

    if (!hospitalId || !tipo || !data) {
        alert('Preencha os campos obrigatórios!');
        return;
    }

    // Data não pode ser futura (RN15)
    if (new Date(data) > new Date()) {
        alert('A data do documento não pode ser futura.');
        return;
    }

    if (id) {
        var d = documentos.find(function (d) { return d.id === parseInt(id); });
        if (d) {
            d.hospitalId = hospitalId;
            d.tipo = tipo;
            d.data = data;
            d.descricao = descricao;
            if (selectedFile) {
                d.arquivo = selectedFile.name;
                d.ext = selectedFile.name.split('.').pop().toLowerCase();
            }
        }
    } else {
        if (!selectedFile) {
            alert('Selecione um arquivo!');
            return;
        }
        var ext = selectedFile.name.split('.').pop().toLowerCase();
        documentos.push({
            id: nextDocId++,
            hospitalId: hospitalId,
            tipo: tipo,
            data: data,
            descricao: descricao,
            arquivo: selectedFile.name,
            ext: ext
        });
    }

    closeDocModal();
    renderDocs();
}

function editDoc(id) {
    openDocModal(id);
}

// ======== EXCLUIR DOCUMENTO ========
function deleteDoc(id) {
    var d = documentos.find(function (item) { return item.id === id; });
    if (!d) return;
    if (confirm('Excluir "' + (d.descricao || d.arquivo) + '"?')) {
        documentos = documentos.filter(function (item) { return item.id !== id; });
        renderDocs();
    }
}

// ======== FECHAR MODAL COM ESC ========
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDocModal();
});

// ======== FECHAR MODAL CLICANDO FORA ========
document.addEventListener('click', function (e) {
    var overlay = document.getElementById('modal-overlay');
    if (e.target === overlay) closeDocModal();
});

// ======== INICIALIZAR ========
document.addEventListener('DOMContentLoaded', function () {
    populateHospitalSelects();
    renderDocs();
});
