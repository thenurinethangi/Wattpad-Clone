package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.*;
import lk.ijse.wattpadbackend.service.AdminService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public APIResponse welcomeMessage(){

        return new APIResponse(202,"WELCOME TO STORY PAGE",null);
    }

    @PostMapping("/admin/loadAdmin/{no}")
    @PreAuthorize("hasRole('ADMIN')")
    public APIResponse loadAdminForAdminBySortingCriteria(@PathVariable long no, @RequestBody AdminRequestDTO adminRequestDTO){

        AdminAdminResponseDTO adminAdminResponseDTO = adminService.loadAdminForAdminBySortingCriteria(no,adminRequestDTO);
        return new APIResponse(202,"Successfully load admin for admin part by sort criteria", adminAdminResponseDTO);
    }

    @PostMapping("/admin/new")
    @PreAuthorize("hasRole('ADMIN')")
    public APIResponse createANewAdmin(@RequestBody AdminDTO adminDTO){

        //must send email with username and password
        boolean result = adminService.createANewAdmin(adminDTO);
        return new APIResponse(202,"Successfully create new admin", result);
    }

    @PostMapping("/admin/deactivate/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public APIResponse deactivateAdmin(@PathVariable long id){

        boolean result = adminService.deactivateAdmin(id);
        return new APIResponse(202,"Successfully deactivate the admin id :"+id, result);
    }

    @GetMapping("/admin/get/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public APIResponse getAdminById(@PathVariable long id){

        AdminDTO adminDTO = adminService.getAdminById(id);
        return new APIResponse(202,"Successfully load data of admin id :"+id, adminDTO);
    }

}
















