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