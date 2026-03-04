const API_URL = "http://localhost:8080/hospital";

async function createHospital(hospital) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(hospital)
        });

        if (!response.ok) {
            throw new Error("Erro ao criar hospital");
        }

        return await response.json();
    } catch (error) {
        console.error("[GestCare] Erro na API:", error);
        throw error;
    }
}

async function getHospitalsByPatient(patientId) {
    const response = await fetch(`${API_URL}/patient/${patientId}`);

    if (!response.ok) {
        throw new Error(response.status);
    }

    return response.json();
}

async function deleteHospital(hospitalId) {
    try {
        const response = await fetch(`${API_URL}/${hospitalId}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(response.status);
        }

        return true; // DELETE geralmente não retorna body

    } catch (error) {
        console.error("[GestCare] Erro ao excluir hospital:", error);
        throw error;
    }
}