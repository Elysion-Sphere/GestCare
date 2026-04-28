/* ========================================
   GESTCARE - FILE API
   Endpoints: GET, POST, PUT, DELETE
   Base: http://localhost:8080/file
   ======================================== */

const FILE_API_URL = "http://localhost:8080/file";

// Mapeamento: tipo (string) → file_type_id no banco
// Deve bater com os IDs inseridos via HeidiSQL na tabela file_type
const TIPO_PARA_ID = {
    consulta: 1,
    laudo:    2,
    exame:    3,
    receita:  4
};

// ── GET: listar arquivos de um paciente ──────────────────────────
async function getFilesByPatient(patientId) {
    const response = await fetch(`${FILE_API_URL}/patient/${patientId}`);
    if (!response.ok) throw new Error(response.status);
    return response.json();
}

// ── POST: criar novo documento ───────────────────────────────────
// Requer: POST /file no FileController (ainda não existe no backend)
async function createFile(fileData) {
    const response = await fetch(FILE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fileData)
    });
    if (!response.ok) throw new Error(response.status);
    return response.json();
}

// ── PUT: atualizar documento existente ───────────────────────────
// Requer: PUT /file/{id} no FileController (ainda não existe no backend)
async function updateFile(id, fileData) {
    const response = await fetch(`${FILE_API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fileData)
    });
    if (!response.ok) throw new Error(response.status);
    return response.json();
}

// ── DELETE: excluir documento ────────────────────────────────────
// Requer: DELETE /file/{id} no FileController (ainda não existe no backend)
async function deleteFile(fileId) {
    const response = await fetch(`${FILE_API_URL}/${fileId}`, {
        method: "DELETE"
    });
    if (!response.ok) throw new Error(response.status);
    return true;
}
