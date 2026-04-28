package br.com.elysium.GestCare.repositories;

import br.com.elysium.GestCare.model.FileType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileTypeRepository extends JpaRepository<FileType, Long> {
}
