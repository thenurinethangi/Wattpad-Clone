package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.UserDTO;
import lk.ijse.wattpadbackend.service.UserService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping()
    public APIResponse welcomeMessage(){

        return new APIResponse(202,"WELCOME TO USER",null);
    }

    @GetMapping("/profilePic")
    public APIResponse getUserProfilePic(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String profilePicPath = userService.getUserProfilePic(auth.getName());
        return new APIResponse(202,"User profile picture path",profilePicPath);
    }

    @GetMapping("/{id}")
    public APIResponse getUserDataByUserId(@PathVariable long id){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        UserDTO userDTO = userService.getUserDataByUserId(auth.getName(),id);
        return new APIResponse(202,"Successfully load user data.",userDTO);
    }

    @GetMapping("/following/{id}")
    public APIResponse getFollowingUsersByUserId(@PathVariable long id){

        List<UserDTO> userDTOList = userService.getFollowingUsersByUserId(id);
        return new APIResponse(202,"Successfully load top following users.",userDTOList);
    }
}




























