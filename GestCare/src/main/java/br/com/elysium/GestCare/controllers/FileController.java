package br.com.elysium.GestCare.controllers;
import br.com.elysium.GestCare.model.File;
import br.com.elysium.GestCare.services.FileServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public File uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("hospitalId") Long hospitalId,
            @RequestParam("fileTypeId") Long fileTypeId,
            @RequestParam("fileDate") String fileDate,
            @RequestParam("description") String description
    ) {
        return fileService.saveFile(file, hospitalId, fileTypeId, fileDate, description);
    }

}

