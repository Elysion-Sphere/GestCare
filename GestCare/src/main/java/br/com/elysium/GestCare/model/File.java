package br.com.elysium.GestCare.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

@JsonPropertyOrder({
        "id",
        "title",
        "doctorName",
        "doctorCrm",
        "fileDate",
        "description",
        "fileName",
        "filePath",
        "uploadDate",
        "hospital",
        "fileType"
})
@Entity
@Table(name = "file")
public class File {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O título do documento precisa estar preenchido")
    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 150)
    private String doctorName;

    @Column(length = 20)
    private String doctorCrm;

    @NotNull(message = "A data do documento precisa estar preenchida!")
    @PastOrPresent(message = "A data do documento não pode ser futura")
    @Column(nullable = false)
    private LocalDate fileDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "O Nome do arquivo precisa estar preenchido!")
    @Column(nullable = false, length = 255)
    private String fileName;

    @NotNull(message = "O caminho do arquivo precisa estar preenchido!")
    @Column(nullable = false, length = 255)
    private String filePath;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column(nullable = false, updatable = false)
    private LocalDateTime uploadDate;

    // Relacionamento com Hospital
    @NotNull(message = "O hospital precisa ser informado")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    // Relacionamento com FileType
    @NotNull(message = "O tipo de arquivo precisa ser informado")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_type_id", nullable = false)
    private FileType fileType;

    @PrePersist
    public void prePersist() {
        this.uploadDate = LocalDateTime.now();
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getDoctorCrm() { return doctorCrm; }
    public void setDoctorCrm(String doctorCrm) { this.doctorCrm = doctorCrm; }

    public LocalDate getFileDate() { return fileDate; }
    public void setFileDate(LocalDate fileDate) { this.fileDate = fileDate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public LocalDateTime getUploadDate() { return uploadDate; }
    public void setUploadDate(LocalDateTime uploadDate) { this.uploadDate = uploadDate; }

    public Hospital getHospital() { return hospital; }
    public void setHospital(Hospital hospital) { this.hospital = hospital; }

    public FileType getFileType() { return fileType; }
    public void setFileType(FileType fileType) { this.fileType = fileType; }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof File file)) return false;
        return Objects.equals(getId(), file.getId()) && Objects.equals(getTitle(), file.getTitle()) && Objects.equals(getDoctorName(), file.getDoctorName()) && Objects.equals(getDoctorCrm(), file.getDoctorCrm()) && Objects.equals(getFileDate(), file.getFileDate()) && Objects.equals(getDescription(), file.getDescription()) && Objects.equals(getFileName(), file.getFileName()) && Objects.equals(getFilePath(), file.getFilePath()) && Objects.equals(getUploadDate(), file.getUploadDate()) && Objects.equals(getHospital(), file.getHospital()) && Objects.equals(getFileType(), file.getFileType());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getTitle(), getDoctorName(), getDoctorCrm(), getFileDate(), getDescription(), getFileName(), getFilePath(), getUploadDate(), getHospital(), getFileType());
    }
}
