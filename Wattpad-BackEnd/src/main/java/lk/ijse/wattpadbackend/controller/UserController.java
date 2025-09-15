package lk.ijse.wattpadbackend.controller;

import jakarta.validation.Valid;
import lk.ijse.wattpadbackend.dto.*;
import lk.ijse.wattpadbackend.service.UserService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.hibernate.sql.Update;
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

    @GetMapping("/current")
    public APIResponse getCurrentUserData(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        UserDTO userDTO = userService.getCurrentUserData(auth.getName());
        return new APIResponse(202,"Successfully load current user data.",userDTO);
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

        userService.followAOtherUser(auth.getName(),id);
        return new APIResponse(202,"Successfully followed the users.",null);
    }

    @PostMapping("/unfollow/{id}")
    public APIResponse unfollowAOtherUser(@PathVariable long id){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        userService.unfollowAOtherUser(auth.getName(),id);
        return new APIResponse(202,"Successfully unfollowed the users.",null);
    }

    @PostMapping("/change/username")
    public APIResponse changeUserUsername(@RequestBody UserDTO userDTO){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        boolean result = userService.changeUserUsername(auth.getName(),userDTO);
        return new APIResponse(202,"Changed username result successfully sent.",result);
    }

    @PostMapping("/change/password")
    public APIResponse changeUserPassword(@Valid @RequestBody UpdatePasswordDTO updatePasswordDTO){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        boolean result = userService.changeUserPassword(auth.getName(),updatePasswordDTO);
        return new APIResponse(202,"Changed password result successfully sent.",result);
    }

    @PostMapping("/change/email")
    public APIResponse changeUserEmail(@Valid @RequestBody ChangeEmailDTO changeEmailDTO){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        boolean result = userService.changeUserEmail(auth.getName(),changeEmailDTO);
        return new APIResponse(202,"Changed email result successfully sent.",result);
    }

    @PostMapping("/change/setting/userData")
    public APIResponse changeUserDataInSetting(@Valid @RequestBody UserDataSettingDTO userDataSettingDTO){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        userService.changeUserDataInSetting(auth.getName(),userDataSettingDTO);
        return new APIResponse(202,"Successfully Changed user data in setting.",null);
    }

    @PostMapping("/deactivate")
    public APIResponse deactivateCurrentUser(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        userService.deactivateCurrentUser(auth.getName());
        return new APIResponse(202,"Successfully deactivate current user.",null);
    }

    @GetMapping("/followers/{id}/{count}")
    public APIResponse getFollowersUsersByUserId(@PathVariable long id, @PathVariable long count){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        UserFollowingResponseDTO userFollowingResponseDTO = userService.getFollowersUsersByUserId(auth.getName(),id,count);
        return new APIResponse(202,"Successfully load followers of user id: "+id,userFollowingResponseDTO);
    }
}




























