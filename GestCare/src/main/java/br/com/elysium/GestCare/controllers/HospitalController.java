package br.com.elysium.GestCare.controllers;

import br.com.elysium.GestCare.model.Hospital;
import br.com.elysium.GestCare.services.HospitalServices;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hospital")
public class HospitalController {

    @Autowired
    private HospitalServices service;

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Hospital findById(@PathVariable("id") Long id) {
        return service.findById(id);
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Hospital> findAll() {
        return service.findAll();
    }

    @GetMapping("/search")
    public List<Hospital> search(
            @RequestParam String name,
            @RequestParam Long patientId) {
        return service.findByHospitalName(name, patientId);
    }

    @PostMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public Hospital create(@RequestBody Hospital hospital) {
        return service.create(hospital);
    }

    @PutMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public Hospital update(@Valid @RequestBody Hospital hospital) {
        return service.update(hospital);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}