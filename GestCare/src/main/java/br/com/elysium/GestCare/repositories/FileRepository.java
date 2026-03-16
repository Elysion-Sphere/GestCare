package br.com.elysium.GestCare.repositories;

import br.com.elysium.GestCare.model.File;
import br.com.elysium.GestCare.model.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FileRepository extends JpaRepository<File, Long> {
    @Query("""
    SELECT f
    FROM File f
    JOIN FETCH f.hospital h
    JOIN FETCH f.fileType t
    WHERE h.patient.id = :patientId
    """)
    List<File> findFilesByPatientId(@Param("patientId") Long patientId);
}
