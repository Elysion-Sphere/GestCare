package br.com.elysium.GestCare.services;

import br.com.elysium.GestCare.exception.ResourceNotFoundException;
import br.com.elysium.GestCare.model.Hospital;
import br.com.elysium.GestCare.repositories.HospitalRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.logging.Logger;

@Service
public class HospitalServices {

    private Logger logger = Logger.getLogger(HospitalServices.class.getName());

    @Autowired
    HospitalRepository hospitalRepository;

    public List<Hospital> findAll() {
        return hospitalRepository.findAll();
    }

    public Hospital findById(Long id) {
        logger.info("Finding one Hospital!");
        return hospitalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID!"));
    }

    @Transactional
    public Hospital create(Hospital hospital) {
        logger.info("Creating one Hospital!");
        return hospitalRepository.save(hospital);
    }

    @Transactional
    public Hospital update(Hospital hospital) {

        logger.info("Updating one Hospital!");

        Hospital entity = hospitalRepository.findById(hospital.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID!"));

        entity.setName(hospital.getName());
        entity.setCnpj(hospital.getCnpj());
        entity.setTelephone(hospital.getTelephone());
        entity.setAdress(hospital.getAdress());
        entity.setPatient(hospital.getPatient());

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