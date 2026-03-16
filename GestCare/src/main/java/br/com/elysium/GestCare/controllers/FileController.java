package br.com.elysium.GestCare.controllers;
import br.com.elysium.GestCare.model.File;
import br.com.elysium.GestCare.services.FileServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;


@RestController
@RequestMapping("/file")
public class FileController {

    @Autowired
    private FileServices fileService;

    @GetMapping("/patient/{id}")
    public List<File> getFilesByPatient(@PathVariable Long id) {
        return fileService.getFilesByPatient(id);
    }

}

