package br.com.elysium.GestCare.repositories;

import br.com.elysium.GestCare.model.Hospital;
import br.com.elysium.GestCare.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    List<Patient> findByName(
            String name
    );
}
