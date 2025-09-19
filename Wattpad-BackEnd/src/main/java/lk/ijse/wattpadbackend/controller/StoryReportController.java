package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.LibraryStoryResponseDTO;
import lk.ijse.wattpadbackend.dto.StoryReportRequestDTO;
import lk.ijse.wattpadbackend.service.StoryReportService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/story/report")
@RequiredArgsConstructor
public class StoryReportController {

    private final StoryReportService storyReportService;

    @PostMapping
    public APIResponse addReport(@RequestBody StoryReportRequestDTO storyReportRequestDTO){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        storyReportService.addReport(auth.getName(),storyReportRequestDTO);
        return new APIResponse(202,"Your added report to story id: "+storyReportRequestDTO.getStoryId(),null);
    }
}










