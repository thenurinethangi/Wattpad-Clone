package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.ChapterDTO;
import lk.ijse.wattpadbackend.dto.StoryDTO;
import lk.ijse.wattpadbackend.dto.StoryIdsDTO;
import lk.ijse.wattpadbackend.service.ChapterService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chapter")
@RequiredArgsConstructor
public class ChapterController {

    private final ChapterService chapterService;

    @GetMapping
    public APIResponse welcomeMessage(){

        return new APIResponse(202,"WELCOME TO CHAPTER PAGE",null);
    }

    @GetMapping("/{id}")
    public APIResponse getAChapterById(@PathVariable long id){

        ChapterDTO chapterDTO = chapterService.getAChapterById(id);
        return new APIResponse(202,"Chapter data successfully loaded for chapter id: "+id,chapterDTO);
    }

    @GetMapping("/recommendations")
    public APIResponse getRecommendationStories(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        List<StoryDTO> storyDTOList = chapterService.getRecommendationStories(auth.getName());
        return new APIResponse(202,"Successfully loaded recommendation stories",storyDTOList);
    }

    @PostMapping("/alsoYouWillLikeStories")
    public APIResponse getAlsoYouWillLikeStories(@RequestBody StoryIdsDTO storyIdsDTO){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        List<StoryDTO> storyDTOList = chapterService.getAlsoYouWillLikeStories(auth.getName(),storyIdsDTO);
        return new APIResponse(202,"Successfully loaded you will also like stories",storyDTOList);
    }
}


















