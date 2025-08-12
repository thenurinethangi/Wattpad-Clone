package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.service.UserService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profilePic")
    public APIResponse getUserProfilePic(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String profilePicPath = userService.getUserProfilePic(auth.getName());
        return new APIResponse(202,"User profile picture path",profilePicPath);
    }
}




























