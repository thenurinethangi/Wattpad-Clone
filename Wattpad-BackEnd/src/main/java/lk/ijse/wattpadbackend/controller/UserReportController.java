package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.StoryReportRequestDTO;
import lk.ijse.wattpadbackend.dto.UserReportRequestDTO;
import lk.ijse.wattpadbackend.service.StoryReportService;
import lk.ijse.wattpadbackend.service.UserReportService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/user/report")
@RequiredArgsConstructor
public class UserReportController {

    private final UserReportService userReportService;

    @PostMapping
    public APIResponse addReport(@RequestBody UserReportRequestDTO userReportRequestDTO){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        userReportService.addReport(auth.getName(),userReportRequestDTO);
        return new APIResponse(202,"Your added report to user id: "+userReportRequestDTO.getUserId(),null);
    }
}
