package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.UserDTO;
import lk.ijse.wattpadbackend.service.UserBlockService;
import lk.ijse.wattpadbackend.service.UserMuteService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user/mute")
@RequiredArgsConstructor
public class UserMuteController {

    private final UserMuteService userMuteService;

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public APIResponse welcomeMessage(){

        return new APIResponse(202,"WELCOME TO MUTE PAGE",null);
    }

    @PostMapping("/{userId}")
    @PreAuthorize("hasRole('USER')")
    public APIResponse addAMute(@PathVariable long userId){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        boolean result = userMuteService.addAMute(auth.getName(),userId);
        return new APIResponse(202,"Successfully muted user id: "+userId,result);
    }

    @PostMapping("/remove/{userId}")
    @PreAuthorize("hasRole('USER')")
    public APIResponse removeAMute(@PathVariable long userId){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        boolean result = userMuteService.removeAMute(auth.getName(),userId);
        return new APIResponse(202,"Successfully un muted user id: "+userId,result);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('USER')")
    public APIResponse getAllMutedUsersOfCurrentUser(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        List<UserDTO> userDTOList = userMuteService.getAllMutedUsersOfCurrentUser(auth.getName());
        return new APIResponse(202,"Successfully load all the muted users of current user",userDTOList);
    }
}











