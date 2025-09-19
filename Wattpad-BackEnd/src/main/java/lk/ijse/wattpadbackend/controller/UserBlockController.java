package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.UserReportRequestDTO;
import lk.ijse.wattpadbackend.service.UserBlockService;
import lk.ijse.wattpadbackend.service.UserReportService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user/block")
@RequiredArgsConstructor
public class UserBlockController {

    private final UserBlockService userBlockService;

    @PostMapping("/{userId}")
    public APIResponse addABlock(@PathVariable long userId){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        userBlockService.addABlock(auth.getName(),userId);
        return new APIResponse(202,"Your blocked to user id: "+userId,null);
    }
}
