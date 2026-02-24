package br.com.elysium.GestCare.services;

import br.com.elysium.GestCare.exception.ResourceNotFoundException;
import br.com.elysium.GestCare.model.Patient;
import br.com.elysium.GestCare.repositories.PatientRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.logging.Logger;

@Service
public class PatientServices {

    private final AtomicLong counter = new AtomicLong();
    private Logger logger = Logger.getLogger(PatientServices.class.getName());

    @Autowired
    PatientRepository patientRepository;

    public List<Patient> findAll(){
        //Mocking:
        //List<Patient> patients = new ArrayList<>();
        //for (int i = 0; i < 3; i++){
        //    Patient patient = mockPatient(i);
        //    patients.add(patient);
        //}
        //return patients;
        //Final Mocking
        return patientRepository.findAll();
    }

    public Patient findById(Long id){
        logger.info("Finding One Patient!");

        //MOCK:
        //Patient patient = new Patient();
        //patient.setId(counter.incrementAndGet()); // Faz uma simulação de adicionar id auto incrementaveis(i++)
        //patient.setName("Breno");
        //patient.setLastName("Ferreira");
        //patient.setCpf("12345678900");
        //patient.setBirthDate(LocalDate.of(2002, 7, 13));
        //patient.setEmail("ElysionSphere@gmail.com");
        //patient.setTelephone("11999999999");
        //patient.setPassword("ElysionSphereSenha");
        //patient.setGender(2);
        //patient.setJoinDate(LocalDateTime.of(2026, 2, 16, 15, 5));
        //patient.setVerified(Boolean.TRUE);
        //return patient;
        //Final do Mock

        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID!"));
    }

    @Transactional
    public Patient create(Patient patient) {

        logger.info("Creating one Patient!");

        return patientRepository.save(patient);
        //return patient;    //Mock
    }

    @Transactional
    public Patient update(Patient patient) {

        logger.info("Updating one Patient!");

        Patient patientEntity = patientRepository.findById(patient.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID!"));

        patientEntity.setName(patient.getName());
        patientEntity.setLastName(patient.getLastName());
        patientEntity.setCpf(patient.getCpf());
        patientEntity.setBirthDate(patient.getBirthDate());
        patientEntity.setEmail(patient.getEmail());
        patientEntity.setTelephone(patient.getTelephone());
        patientEntity.setPassword(patient.getPassword());
       // patientEntity.setJoinDate(patient.getJoinDate());
        patientEntity.setVerified(patient.getVerified());
        patientEntity.setGender(patient.getGender());

        return patientRepository.save(patientEntity);
        //return patient;  //MOCK
    }

    @Transactional
    public void delete(Long id) {

        logger.info("Deleting one Patient!");

        Patient entity = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No records found for this ID!"));
        patientRepository.delete(entity);

    }

    //Função feita para mockar
    private Patient mockPatient(int i) {
        //MOCK:
        logger.info("Mocking Patients!");
        Patient patient = new Patient();
        patient.setId(counter.incrementAndGet()); // Faz uma simulação de adicionar id auto incrementaveis(i++)
        patient.setName("FirstName" + i);
        patient.setLastName("LastNAME" + i);
        patient.setCpf("12345678900");
        patient.setBirthDate(LocalDate.of(2002, 7, 13));
        patient.setEmail("ElysionSphere@gmail.com");
        patient.setTelephone("11999999999");
        patient.setPassword("ElysionSphereSenha");
        patient.setGender(2);
        patient.setJoinDate(LocalDateTime.of(2026, 2, 16, 15, 5));
        patient.setVerified(Boolean.TRUE);
        //Final do Mock

        return patient;
    }
}
