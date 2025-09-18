package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.*;
import lk.ijse.wattpadbackend.service.AnnouncementService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/announcement")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @GetMapping
    public APIResponse welcomeMessage(){

        return new APIResponse(202,"WELCOME TO STORY PAGE",null);
    }

    @PostMapping("/admin/loadAnnouncement/{no}")
    public APIResponse loadAnnouncementForAdminBySortingCriteria(@PathVariable long no, @RequestBody AdminAnnouncementRequestDTO adminAnnouncementRequestDTO){

        AdminAnnouncementResponseDTO adminAnnouncementResponseDTO = announcementService.loadAnnouncementForAdminBySortingCriteria(no,adminAnnouncementRequestDTO);
        return new APIResponse(202,"Successfully load announcement for admin part by sort criteria", adminAnnouncementResponseDTO);
    }

    @DeleteMapping("/admin/delete/{id}")
    public APIResponse deleteAnnouncement(@PathVariable long id){

        announcementService.deleteAnnouncement(id);
        return new APIResponse(202,"Successfully delete announcement id: "+id, null);
    }

    @GetMapping("/admin/searchByUserId/{userId}")
    public APIResponse searchAnnouncementByUserId(@PathVariable long userId){

        List<AdminAnnouncementDTO> adminAnnouncementDTOList = announcementService.searchAnnouncementByUserId(userId);
        return new APIResponse(202,"Successfully search announcement by user id", adminAnnouncementDTOList);
    }

    @PostMapping("/admin/add")
    public APIResponse addNewAnnouncement(@RequestBody AdminAnnouncementDTO adminAnnouncementDTO){

        announcementService.addNewAnnouncement(adminAnnouncementDTO);
        return new APIResponse(202,"Successfully added new announcement", null);
    }
}














