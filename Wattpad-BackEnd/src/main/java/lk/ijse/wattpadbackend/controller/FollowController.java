package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.service.FollowService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/follow")
@AllArgsConstructor
public class FollowController {

    private final FollowService followService;

    @PostMapping("/add/{userId}")
    public APIResponse makeAFollow(@PathVariable long userId){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        followService.makeAFollow(auth.getName(),userId);
        return new APIResponse(202,"Successfully follow user Id: "+userId,null);
    }

    @PostMapping("/remove/{userId}")
    public APIResponse removeAFollow(@PathVariable long userId){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        followService.removeAFollow(auth.getName(),userId);
        return new APIResponse(202,"Successfully unfollow user Id: "+userId,null);
    }
}








