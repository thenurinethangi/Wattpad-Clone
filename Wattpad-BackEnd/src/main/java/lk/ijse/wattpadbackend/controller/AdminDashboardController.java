package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.util.APIResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
public class AdminDashboardController {

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public APIResponse welcomeMessage(){

        return new APIResponse(202,"WELCOME TO ADMIN DASHBOARD PAGE",null);
    }
}
