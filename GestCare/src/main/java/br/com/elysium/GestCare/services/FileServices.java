package br.com.elysium.GestCare.services;
import br.com.elysium.GestCare.model.File;
import br.com.elysium.GestCare.model.FileType;
import br.com.elysium.GestCare.model.Hospital;
import br.com.elysium.GestCare.model.Patient;
import br.com.elysium.GestCare.repositories.FileRepository;
import br.com.elysium.GestCare.repositories.FileTypeRepository;
import br.com.elysium.GestCare.repositories.HospitalRepository;
import br.com.elysium.GestCare.repositories.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Service
public class FileServices {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private FileRepository fileRepository;

    public List<File> getFilesByPatient(Long patientId) {
        return fileRepository.findFilesByPatientId(patientId);
    }

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private FileTypeRepository fileTypeRepository;

    public File saveFile(MultipartFile multipartFile,
                         Long hospitalId,
                         Long fileTypeId,
                         String fileDate,
                         String description) {

        try {
            String uploadDir = System.getProperty("user.dir") + "/uploads/";

            java.io.File dir = new java.io.File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String originalName = multipartFile.getOriginalFilename();


            String fileName = originalName
                    .replaceAll("\\s+", "_")
                    .replaceAll("[^a-zA-Z0-9._-]", "");


            String filePath = uploadDir + fileName;


            multipartFile.transferTo(new java.io.File(filePath));


            Hospital hospital = hospitalRepository.findById(hospitalId).orElseThrow();
            FileType fileType = fileTypeRepository.findById(fileTypeId).orElseThrow();

            Patient patient = patientRepository.findById(1L).orElseThrow();


            File file = new File();
            file.setTitle(fileName);
            file.setFileName(fileName);
            file.setFilePath(filePath);
            file.setDescription(description);
            file.setFileDate(LocalDate.parse(fileDate));
            file.setHospital(hospital);
            file.setFileType(fileType);

            file.setDoctorName("Dr. Teste");
            file.setDoctorCrm("123456");

            return fileRepository.save(file);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao salvar arquivo: " + e.getMessage());
        }
    }
}