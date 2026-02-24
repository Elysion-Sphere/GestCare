package br.com.elysium.GestCare.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "patient")
public class Patient implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank(message = "O nome do paciente precisa estar preenchido")
    @Column(name = "first_name", nullable = false, length = 80)
    private String name;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(unique = true, nullable = false, length = 15)
    private String cpf;

    @NotNull(message = "A data de nascimento precisa ser informada")
    @PastOrPresent(message = "A data de nascimento não pode ser futura")
    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;

    @Column(unique = true, length = 60)
    private String email;

    @Column(length = 20)
    private String telephone;

    @NotBlank(message = "A senha é obrigatória!")
    @Size(min = 6, message = "A senha deve possuir no mínimo 6 caracteres!")
    @Column(nullable = false, length = 255)
    private String password;

    @NotNull(message = "O gênero é obrigatório!")
    @Min(value = 1, message = "O gênero deve ser 1, 2 ou 3!")
    @Max(value = 3, message = "O gênero deve ser 1, 2 ou 3!")
    @Column(nullable = false)
    private Integer gender;

    @Column(name = "join_date")
    private LocalDateTime joinDate;

    @Column(columnDefinition = "BIT(1)")
    private Boolean verified;

    @JsonIgnore
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Hospital> hospitals = new ArrayList<>();

    public Patient() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Integer getGender() {
        return gender;
    }

    public void setGender(Integer gender) {
        this.gender = gender;
    }

    public LocalDateTime getJoinDate() {
        return joinDate;
    }

    public void setJoinDate(LocalDateTime joinDate) {
        this.joinDate = joinDate;
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }

    public List<Hospital> getHospitals() {
        return hospitals;
    }

    public void setHospitals(List<Hospital> hospitals) {
        this.hospitals = hospitals;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Patient patient)) return false;
        return getId() == patient.getId() && Objects.equals(getName(), patient.getName()) && Objects.equals(getLastName(), patient.getLastName()) && Objects.equals(getCpf(), patient.getCpf()) && Objects.equals(getBirthDate(), patient.getBirthDate()) && Objects.equals(getEmail(), patient.getEmail()) && Objects.equals(getTelephone(), patient.getTelephone()) && Objects.equals(getPassword(), patient.getPassword()) && Objects.equals(getGender(), patient.getGender()) && Objects.equals(getJoinDate(), patient.getJoinDate()) && Objects.equals(getVerified(), patient.getVerified()) && Objects.equals(getHospitals(), patient.getHospitals());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getName(), getLastName(), getCpf(), getBirthDate(), getEmail(), getTelephone(), getPassword(), getGender(), getJoinDate(), getVerified(), getHospitals());
    }
}
