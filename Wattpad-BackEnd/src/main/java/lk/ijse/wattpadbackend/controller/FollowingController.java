package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.UserFollowingResponseDTO;
import lk.ijse.wattpadbackend.service.FollowingService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/following")
@RequiredArgsConstructor
public class FollowingController {

    private final FollowingService followingService;

    @GetMapping
    public APIResponse welcomeMessage(){

        return new APIResponse(202,"WELCOME TO FOLLOWING",null);
    }

    @GetMapping("/following/users/{id}/{count}")
    public APIResponse getFollowingUsersByUserId(@PathVariable long id, @PathVariable long count){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        UserFollowingResponseDTO userFollowingResponseDTO = followingService.getFollowingUsersByUserId(auth.getName(),id,count);
        return new APIResponse(202,"Successfully loaded following users",userFollowingResponseDTO);
    }
}










