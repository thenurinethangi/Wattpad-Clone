package lk.ijse.wattpadbackend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/fuck")
public class fuckController {

    @GetMapping
    public String hello(){
        return "FUCK";
    }
}
