/* ========================================
   GESTCARE - DOCUMENTOS
   CRUD completo conectado à API
   Campos da API: id, title, fileDate, description,
                  fileName, filePath, hospital{id,name},
                  fileType{id,name}
   ======================================== */

// ======== DADOS ========
var hospitais  = []; // preenchido pela API de hospitais
var documentos = []; // preenchido pela API de arquivos
var selectedFile = null;

// ======== UTILITÁRIOS ========

// Extrai o nome do hospital de um objeto documento (API ou local)
function resolveHospitalNome(d) {
    if (d.hospital && (d.hospital.name || d.hospital.nome)) {
        return d.hospital.name || d.hospital.nome;
    }
    // fallback para formato local antigo
    var h = hospitais.find(function (h) { return h.id == d.hospitalId; });
    return h ? (h.name || h.nome || 'Desconhecido') : 'Desconhecido';
}

// Extrai o tipo (string) de um documento (API ou local)
function resolveTipo(d) {
    if (d.fileType && d.fileType.name) return d.fileType.name;
    return d.tipo || '—';
}

// Formata data ISO (yyyy-MM-dd) → dd/MM/yyyy
function formatDate(dateStr) {
    if (!dateStr) return '—';
    var parts = String(dateStr).split('T')[0].split('-');
    if (parts.length < 3) return dateStr;
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

function extractExt(fileName) {
    if (!fileName) return '—';
    var parts = fileName.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '?';
}

// ======== POPULAR SELECTS DE HOSPITAL ========
function populateHospitalSelects() {
    var selects = [
        document.getElementById('filter-hospital'),
        document.getElementById('doc-hospital')
    ];
    selects.forEach(function (sel) {
        if (!sel) return;
        var currentValue = sel.value;
        var firstOption  = sel.options[0];
        sel.innerHTML = '';
        sel.appendChild(firstOption);
        hospitais.forEach(function (h) {
            var opt = document.createElement('option');
            opt.value       = h.id;
            opt.textContent = h.name || h.nome || 'Hospital';
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
        // Compatível com resposta da API e com formato local
        var tipo        = resolveTipo(d);
        var hospitalNome = resolveHospitalNome(d);
        var data        = d.fileDate || d.data || '';
        var descricao   = d.description || d.descricao || '—';
        var arquivo     = d.fileName   || d.arquivo    || '—';
        var ext         = extractExt(arquivo);

        return '<tr>' +
            '<td class="time-cell">' + formatDate(data) + '</td>' +
            '<td><span class="doc-type-badge ' + escapeDocHTML(tipo) + '">' + escapeDocHTML(tipo.toUpperCase()) + '</span></td>' +
            '<td>' + escapeDocHTML(hospitalNome) + '</td>' +
            '<td>' + escapeDocHTML(descricao) + '</td>' +
            '<td><span class="file-badge ' + getFileClass(ext) + '">' + ext.toUpperCase() + '</span></td>' +
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
    var tipoFiltro     = document.getElementById('filter-tipo').value;
    var hospitalFiltro = document.getElementById('filter-hospital').value;

    var filtered = documentos.filter(function (d) {
        var tipo       = resolveTipo(d);
        var hospId     = d.hospital ? d.hospital.id : d.hospitalId;
        var tipoOk     = !tipoFiltro     || tipo == tipoFiltro;
        var hospitalOk = !hospitalFiltro || String(hospId) === hospitalFiltro;
        return tipoOk && hospitalOk;
    });

    renderDocs(filtered);
}

// ======== MODAL ========
function openDocModal(id) {
    var overlay = document.getElementById('modal-overlay');
    var title   = document.getElementById('modal-title');
    var form    = document.getElementById('doc-form');
    if (!overlay || !title || !form) return;

    overlay.classList.add('show');
    selectedFile = null;
    document.getElementById('upload-preview').style.display     = 'none';
    document.getElementById('upload-placeholder').style.display = 'flex';

    if (id) {
        var d = documentos.find(function (d) { return d.id == id; });
        if (d) {
            title.textContent = 'Editar Documento';
            document.getElementById('doc-id').value = d.id;

            // Campos API ou local
            var hospId = d.hospital ? d.hospital.id : d.hospitalId;
            var tipo   = resolveTipo(d);
            var data   = d.fileDate || d.data || '';
            var desc   = d.description || d.descricao || '';
            var arq    = d.fileName   || d.arquivo    || '';

            document.getElementById('doc-hospital').value  = hospId || '';
            document.getElementById('doc-tipo').value      = tipo  !== '—' ? tipo : '';
            document.getElementById('doc-data').value      = String(data).split('T')[0];
            document.getElementById('doc-descricao').value = desc;
            document.getElementById('file-name').textContent = arq;

            if (arq) {
                document.getElementById('upload-preview').style.display     = 'flex';
                document.getElementById('upload-placeholder').style.display = 'none';
            }
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
    document.getElementById('file-name').textContent            = file.name;
    document.getElementById('upload-preview').style.display     = 'flex';
    document.getElementById('upload-placeholder').style.display = 'none';
}

function removeFile() {
    selectedFile = null;
    document.getElementById('doc-arquivo').value                = '';
    document.getElementById('upload-preview').style.display     = 'none';
    document.getElementById('upload-placeholder').style.display = 'flex';
}

// ======== SALVAR DOCUMENTO (API) ========
async function saveDoc(e) {
    e.preventDefault();

    var id        = document.getElementById('doc-id').value;
    var hospitalId = parseInt(document.getElementById('doc-hospital').value);
    var tipo      = document.getElementById('doc-tipo').value;
    var data      = document.getElementById('doc-data').value;
    var descricao = document.getElementById('doc-descricao').value.trim();

    // ── Validações ──────────────────────────────────────────────
    if (!hospitalId || !tipo || !data) {
        alert('Preencha os campos obrigatórios: Hospital, Tipo e Data!');
        return;
    }
    if (new Date(data) > new Date()) {
        alert('A data do documento não pode ser futura.');
        return;
    }

    // Para criar, precisa de arquivo
    var existingDoc = id ? documentos.find(function (d) { return d.id == id; }) : null;
    if (!id && !selectedFile) {
        alert('Selecione um arquivo!');
        return;
    }

    // ── Montar payload para API ──────────────────────────────────
    var fileName = selectedFile ? selectedFile.name : (existingDoc && (existingDoc.fileName || existingDoc.arquivo)) || '';
    var filePath = 'uploads/' + fileName;

    var payload = {
        title:       descricao || fileName,   // backend exige title
        fileDate:    data,
        description: descricao,
        fileName:    fileName,
        filePath:    filePath,
        hospital:    { id: hospitalId },
        fileType:    { id: TIPO_PARA_ID[tipo] || 1 }
    };

    // ── Chamar API ───────────────────────────────────────────────
    try {
        if (id) {
            await updateFile(Number(id), payload);
            alert('Documento atualizado com sucesso!');
        } else {
            await createFile(payload);
            alert('Documento criado com sucesso!');
        }

        closeDocModal();
        // Recarregar lista da API
        documentos = await getFilesByPatient(1);
        renderDocs();

    } catch (err) {
        var status = err && err.message ? err.message : String(err);
        if (status === '404' || status === '405') {
            alert('O backend ainda não possui endpoint para ' + (id ? 'editar' : 'criar') + ' documentos.\nEntre em contato com a equipe de backend para adicionar POST/PUT em /file.');
        } else if (status === '409') {
            alert('Conflito: já existe um documento com esses dados.');
        } else {
            alert('Erro ao salvar documento (HTTP ' + status + ').');
        }
        console.error('[GestCare] Erro ao salvar doc:', err);
    }
}

function editDoc(id) {
    openDocModal(id);
}

// ======== EXCLUIR DOCUMENTO (API) ========
async function deleteDoc(id) {
    var d = documentos.find(function (item) { return item.id == id; });
    if (!d) return;

    var nome = d.description || d.descricao || d.fileName || d.arquivo || 'este documento';
    if (!confirm('Excluir "' + nome + '"?')) return;

    try {
        await deleteFile(Number(id));
        documentos = await getFilesByPatient(1);
        renderDocs();
    } catch (err) {
        var status = err && err.message ? err.message : String(err);
        if (status === '404' || status === '405') {
            alert('O backend ainda não possui endpoint para excluir documentos (DELETE /file).');
        } else {
            alert('Erro ao excluir documento (HTTP ' + status + ').');
        }
        console.error('[GestCare] Erro ao excluir doc:', err);
    }
}

// ======== FECHAR MODAL ========
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDocModal();
});
document.addEventListener('click', function (e) {
    var overlay = document.getElementById('modal-overlay');
    if (e.target === overlay) closeDocModal();
});

// ======== INICIALIZAR ========
document.addEventListener('DOMContentLoaded', async function () {
    const patientId = 1; // TODO: substituir pelo ID real do paciente logado

    // Hospitais (independente)
    try {
        hospitais = await getHospitalsByPatient(patientId);
        console.log('[GestCare] Hospitais carregados:', hospitais.length);
    } catch (e) {
        console.warn('[GestCare] Falha ao carregar hospitais:', e);
        hospitais = [];
    }

    // Documentos (independente)
    try {
        documentos = await getFilesByPatient(patientId);
        console.log('[GestCare] Documentos carregados:', documentos.length);
    } catch (e) {
        console.warn('[GestCare] Falha ao carregar documentos:', e);
        documentos = [];
    }

    populateHospitalSelects();
    renderDocs();
});
