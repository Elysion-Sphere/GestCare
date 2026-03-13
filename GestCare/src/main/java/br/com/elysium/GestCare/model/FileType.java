package br.com.elysium.GestCare.model;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;
import java.util.List;
import java.util.Objects;

@JsonPropertyOrder({
        "id",
        "name",
        "files"
})
@Entity
@Table(name = "file_type")
public class FileType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    // Um FileType pode ter vários arquivos
    // Esse campo não aparece no banco de dados.
    // A palavra mappedBy indica que essa entidade NÃO é a dona do relacionamento.
    //Quem realmente cria a foreign key no banco é o lado @ManyToOne(Model/File.java).
    @OneToMany(mappedBy = "fileType", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<File> files;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<File> getFiles() { return files; }
    public void setFiles(List<File> files) { this.files = files; }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof FileType fileType)) return false;
        return Objects.equals(getId(), fileType.getId()) && Objects.equals(getName(), fileType.getName()) && Objects.equals(getFiles(), fileType.getFiles());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getName(), getFiles());
    }
}
