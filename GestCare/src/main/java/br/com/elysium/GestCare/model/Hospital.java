package br.com.elysium.GestCare.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "hospital")
public class Hospital implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 18)
    private String cnpj;

    @Column(length = 20)
    private String telephone;

    @Column(length = 255)
    private String adress;

    @ManyToOne
    @JoinColumn(name = "paciente_id")
    private Patient patient;

    public Hospital() {}

    // Getters e Setters

    public long getId() { return id; }
    public void setId(long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getAdress() { return adress; }
    public void setAdress(String adress) { this.adress = adress; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Hospital hospital)) return false;
        return id == hospital.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}