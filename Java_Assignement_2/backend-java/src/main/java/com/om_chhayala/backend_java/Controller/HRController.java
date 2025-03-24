package com.om_chhayala.backend_java.Controller;

import com.om_chhayala.backend_java.Model.HRDTO;
import com.om_chhayala.backend_java.Service.HRService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/api/hr")
public class HRController {
    private final HRService hrService;

    public HRController(HRService hrService) {
        this.hrService = hrService;
    }

    @PostMapping("/login")
    public ResponseEntity<HRDTO> login(@RequestParam String email, @RequestParam String password) {
        Optional<HRDTO> hrDTO = hrService.login(email, password);
        return hrDTO.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(401).build());
    }
}
