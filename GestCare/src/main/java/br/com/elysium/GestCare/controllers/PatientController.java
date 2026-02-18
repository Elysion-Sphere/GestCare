package br.com.elysium.GestCare.controllers;

import br.com.elysium.GestCare.model.Patient;
import br.com.elysium.GestCare.services.PatientServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patient")    //http://localhost:8080/patient
public class PatientController {

    // Aqui que se faz a injeção de dependências, só possivel por conta do @Service definido em PatientService
    @Autowired
    private PatientServices service;
    //Ou somente:
    //private PatientServices service = new PatientServices();

    @GetMapping(value = "{id}", // valor que sera passado no https://localhost:8080/patient/{id}
        //method = RequestMethod.GET, // Especificando que é um metodo GET//
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public Patient findById(@PathVariable("id") Long id){ // Encontrara o valor pelo id
        return service.findById(id);
    }

    @GetMapping(// Quando não há parametro o verbo HTTP cai como default: https://localhost:8080/patient
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public List<Patient> findAll(){
        return service.findAll();
    }

    @PostMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public Patient create(@RequestBody Patient Patient) {
        return service.create(Patient);
    }

    @PutMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public Patient update(@RequestBody Patient Patient) {
        return service.update(Patient);
    }


    @DeleteMapping(value = "/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
