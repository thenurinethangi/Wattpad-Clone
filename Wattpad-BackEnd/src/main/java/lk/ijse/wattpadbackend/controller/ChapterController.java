package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.*;
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

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ChapterDTO chapterDTO = chapterService.getAChapterById(auth.getName(),id);
        return new APIResponse(202,"Chapter data successfully loaded for chapter id: "+id,chapterDTO);
    }

    @PostMapping("/recommendations")
    public APIResponse getRecommendationStories(@RequestBody StoryIdsDTO storyIdsDTO){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        List<StoryDTO> storyDTOList = chapterService.getRecommendationStories(auth.getName(),storyIdsDTO);
        return new APIResponse(202,"Successfully loaded recommendation stories",storyDTOList);
    }

    @PostMapping("/alsoYouWillLikeStories")
    public APIResponse getAlsoYouWillLikeStories(@RequestBody StoryIdsDTO storyIdsDTO){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        List<StoryDTO> storyDTOList = chapterService.getAlsoYouWillLikeStories(auth.getName(),storyIdsDTO);
        return new APIResponse(202,"Successfully loaded you will also like stories",storyDTOList);
    }

    @PostMapping("/vote/{chapterId}")
    public APIResponse addLikeOrRemove(@PathVariable long chapterId){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String result = chapterService.addLikeOrRemove(auth.getName(),chapterId);
        return new APIResponse(202,"Successfully add or remove like",result);
    }

    @PostMapping("/comment/{chapterId}")
    public APIResponse addACommentToAChapter(@PathVariable long chapterId, @RequestBody ReplyRequestDTO replyRequestDTO){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        chapterService.addACommentToAChapter(auth.getName(),chapterId,replyRequestDTO);
        return new APIResponse(202,"Successfully added comment to a chapter id: "+chapterId,null);
    }

    @GetMapping("/comment/{chapterId}/{amount}")
    public APIResponse loadCommentsOfAChapter(@PathVariable long chapterId, @PathVariable long amount){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        List<ReplyResponseDTO> replyResponseDTOList = chapterService.loadCommentsOfAChapter(auth.getName(),chapterId,amount);
        return new APIResponse(202,"Successfully loaded comments of chapter id: "+chapterId,replyResponseDTOList);
    }
}


















