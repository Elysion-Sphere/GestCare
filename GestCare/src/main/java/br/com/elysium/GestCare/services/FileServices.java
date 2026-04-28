package br.com.elysium.GestCare.services;
import br.com.elysium.GestCare.model.File;
import br.com.elysium.GestCare.repositories.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FileServices {

    @Autowired
    private FileRepository fileRepository;

    public List<File> getFilesByPatient(Long patientId) {
        return fileRepository.findFilesByPatientId(patientId);
    }

}
