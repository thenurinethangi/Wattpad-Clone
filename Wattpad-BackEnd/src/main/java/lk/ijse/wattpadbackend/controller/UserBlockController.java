package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.UserDTO;
import lk.ijse.wattpadbackend.dto.UserReportRequestDTO;
import lk.ijse.wattpadbackend.service.UserBlockService;
import lk.ijse.wattpadbackend.service.UserReportService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user/block")
@RequiredArgsConstructor
public class UserBlockController {

    private final UserBlockService userBlockService;

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public APIResponse welcomeMessage(){

        return new APIResponse(202,"WELCOME TO BLOCK PAGE",null);
    }

    @PostMapping("/{userId}")
    @PreAuthorize("hasRole('USER')")
    public APIResponse addABlock(@PathVariable long userId){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        boolean result = userBlockService.addABlock(auth.getName(),userId);
        return new APIResponse(202,"Your blocked to user id: "+userId,result);
    }

    @PostMapping("/remove/{userId}")
    @PreAuthorize("hasRole('USER')")
    public APIResponse removeABlock(@PathVariable long userId){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        boolean result = userBlockService.removeABlock(auth.getName(),userId);
        return new APIResponse(202,"Successfully un block user id: "+userId,result);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('USER')")
    public APIResponse getAllBlockedUsersOfCurrentUser(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        List<UserDTO> userDTOList = userBlockService.getAllBlockedUsersOfCurrentUser(auth.getName());
        return new APIResponse(202,"Successfully load all the blocked users of current user",userDTOList);
    }
}
