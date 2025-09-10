package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.UserDTO;
import lk.ijse.wattpadbackend.dto.UserProfileReadingListResponseDTO;
import lk.ijse.wattpadbackend.dto.UserProfileStoriesResponseDTO;
import lk.ijse.wattpadbackend.service.UserService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/story/{id}/{storyCount}")
    public APIResponse getStoriesByUserId(@PathVariable long id, @PathVariable long storyCount){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        UserProfileStoriesResponseDTO userProfileStoriesResponseDTO = userService.getStoriesByUserId(auth.getName(),id,storyCount);
        return new APIResponse(202,"Successfully load stories by user.",userProfileStoriesResponseDTO);
    }

    @GetMapping("/readingList/{id}/{readingListCount}")
    public APIResponse getReadingListByUserId(@PathVariable long id, @PathVariable long readingListCount){

        List<UserProfileReadingListResponseDTO> userProfileReadingListResponseDTO = userService.getReadingListByUserId(id,readingListCount);
        return new APIResponse(202,"Successfully load reading lists by user.",userProfileReadingListResponseDTO);
    }

    @PutMapping()
    public APIResponse updateUser(@RequestBody UserDTO userDTO){

        userService.updateUser(userDTO);
        return new APIResponse(202,"Successfully update the user details.",null);
    }

    @PostMapping("/follow/{id}")
    public APIResponse followAOtherUser(@PathVariable long id){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        System.out.println(id);
        System.out.println(auth.getName());

        userService.followAOtherUser(auth.getName(),id);
        return new APIResponse(202,"Successfully followed the users.",null);
    }

    @PostMapping("/unfollow/{id}")
    public APIResponse unfollowAOtherUser(@PathVariable long id){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        System.out.println(id);
        System.out.println(auth.getName());

        userService.unfollowAOtherUser(auth.getName(),id);
        return new APIResponse(202,"Successfully unfollowed the users.",null);
    }
}




























