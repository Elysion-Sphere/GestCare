package br.com.elysium.GestCare.repositories;

import br.com.elysium.GestCare.model.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HospitalRepository extends JpaRepository<Hospital, Long> {}