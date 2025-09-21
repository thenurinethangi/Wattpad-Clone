package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.AdminAnnouncementDTO;
import lk.ijse.wattpadbackend.service.NotificationService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notification")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping()
    @PreAuthorize("hasRole('USER')")
    public APIResponse welcomeMessage(){

        return new APIResponse(202,"WELCOME TO NOTIFICATION PAGE",null);
    }

    @GetMapping("/all/currentUser")
    @PreAuthorize("hasRole('USER')")
    public APIResponse getAllNotificationOfCurrentUser(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        List<AdminAnnouncementDTO> adminAnnouncementDTOList = notificationService.getAllNotificationOfCurrentUser(auth.getName());
        return new APIResponse(202,"WELCOME TO NOTIFICATION PAGE",adminAnnouncementDTOList);
    }
}





















