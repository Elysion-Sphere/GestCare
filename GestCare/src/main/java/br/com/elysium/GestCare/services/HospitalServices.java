package br.com.elysium.GestCare.services;

import br.com.elysium.GestCare.exception.ResourceNotFoundException;
import br.com.elysium.GestCare.model.Hospital;
import br.com.elysium.GestCare.model.Patient;
import br.com.elysium.GestCare.repositories.HospitalRepository;
import br.com.elysium.GestCare.repositories.PatientRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.logging.Logger;

@Service
public class HospitalServices {

    private Logger logger = Logger.getLogger(HospitalServices.class.getName());

    @Autowired
    HospitalRepository hospitalRepository;

    @Autowired
    PatientRepository patientRepository;

    public List<Hospital> findAll() {
        return hospitalRepository.findAll();
    }

    public Hospital findById(Long id) {
        logger.info("Finding one Hospital!");
        return hospitalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID!"));
    }

    public List<Hospital> findByHospitalName(String name, Long patientId) {
        return hospitalRepository
                .findByNameContainingIgnoreCaseAndPatientId(name, patientId);
    }

    public List<Hospital> findByPatientId(Long patientId) {
        return hospitalRepository.findByPatientId(patientId);
    }

    @Transactional
    public Hospital create(Hospital hospital) {
        logger.info("Creating one Hospital!");
        return hospitalRepository.save(hospital);
    }

    @Transactional
    public Hospital update(Long id, Hospital hospital) {

        logger.info("Updating Hospital!");

        Hospital entity = hospitalRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("No records found for this ID!"));

        // 🔐 REGRA DE SEGURANÇA:
        // Não permitir trocar o paciente do hospital
        if (hospital.getPatient() != null &&
                entity.getPatient().getId() != hospital.getPatient().getId()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "It is not allowed to change the patient of this hospital!"
            );
        }

        // 🔄 Atualiza apenas os dados do hospital
        entity.setName(hospital.getName());
        entity.setCnpj(hospital.getCnpj());
        entity.setTelephone(hospital.getTelephone());
        entity.setAddress(hospital.getAddress());

        return hospitalRepository.save(entity);
    }

    @Transactional
    public void delete(Long id) {

        logger.info("Deleting one Hospital!");

        Hospital entity = hospitalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID!"));

        hospitalRepository.delete(entity);
    }
}