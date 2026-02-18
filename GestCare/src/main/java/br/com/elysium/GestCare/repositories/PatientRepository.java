package br.com.elysium.GestCare.repositories;

import br.com.elysium.GestCare.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {}
