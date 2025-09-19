package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.service.UserBlockService;
import lk.ijse.wattpadbackend.service.UserMuteService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/user/mute")
@RequiredArgsConstructor
public class UserMuteController {

    private final UserMuteService userMuteService;

    @PostMapping("/{userId}")
    public APIResponse addAMute(@PathVariable long userId){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        userMuteService.addAMute(auth.getName(),userId);
        return new APIResponse(202,"Successfully muted user id: "+userId,null);
    }
}
