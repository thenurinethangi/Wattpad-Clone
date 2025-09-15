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

        List<SingleCommentDTO> singleCommentDTOList = chapterService.loadCommentsOfAChapter(auth.getName(),chapterId,amount);
        return new APIResponse(202,"Successfully loaded comments of chapter id: "+chapterId,singleCommentDTOList);
    }

    @PostMapping("/comment/like/{id}")
    public APIResponse addOrRemoveLikeOnChapterComment(@PathVariable long id){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String result = chapterService.addOrRemoveLikeOnChapterComment(auth.getName(),id);
        return new APIResponse(202,"Successfully added or removed like on chapter comment id: "+id,result);
    }

    @PostMapping("/save/{chapterId}/{storyId}")
    public APIResponse saveChapter(@PathVariable long chapterId, @PathVariable long storyId, @RequestBody ChapterSaveRequestDTO chapterSaveRequestDTO){

        chapterService.saveChapter(chapterId,storyId,chapterSaveRequestDTO);
        return new APIResponse(202,"Successfully saved chapter id: "+chapterId,null);
    }

    @PostMapping("/createAndSave/{storyId}")
    public APIResponse createAndSaveChapter(@PathVariable long storyId, @RequestBody ChapterSaveRequestDTO chapterSaveRequestDTO){

        long id = chapterService.createAndSaveChapter(storyId,chapterSaveRequestDTO);
        return new APIResponse(202,"Successfully created and saved chapter",id);
    }

    @PostMapping("/publishAndSave/{chapterId}/{storyId}")
    public APIResponse publishAndSaveChapter(@PathVariable long chapterId, @PathVariable long storyId, @RequestBody ChapterSaveRequestDTO chapterSaveRequestDTO){

        chapterService.publishAndSaveChapter(chapterId,storyId,chapterSaveRequestDTO);
        return new APIResponse(202,"Successfully published and saved chapter id: "+chapterId,null);
    }

    @PostMapping("/createPublishAndSave/{storyId}")
    public APIResponse createPublishAndSaveChapter(@PathVariable long storyId, @RequestBody ChapterSaveRequestDTO chapterSaveRequestDTO){

        long id = chapterService.createPublishAndSaveChapter(storyId,chapterSaveRequestDTO);
        return new APIResponse(202,"Successfully created and saved and published chapter",id);
    }

    @PostMapping("/unpublish/{chapterId}/{storyId}")
    public APIResponse makeChapterUnpublishByChapterId(@PathVariable long chapterId, @PathVariable long storyId){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        chapterService.makeStoryUnpublishByStoryId(auth.getName(),chapterId,storyId);
        return new APIResponse(202,"Successfully unpublished chapter id: : "+chapterId,null);
    }

    @DeleteMapping("/delete/{chapterId}/{storyId}")
    public APIResponse makeChapterDeleteByChapterId(@PathVariable long chapterId, @PathVariable long storyId){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        chapterService.makeChapterDeleteByChapterId(auth.getName(),chapterId,storyId);
        return new APIResponse(202,"Successfully deleted chapter id: : "+chapterId,null);
    }

    @GetMapping("/paragraph/{chapterId}/{storyId}")
    public APIResponse loadAllParagraphByChapterId(@PathVariable long chapterId, @PathVariable long storyId){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        List<ParagraphDTO> paragraphDTOList = chapterService.loadAllParagraphByChapterId(auth.getName(),chapterId,storyId);
        return new APIResponse(202,"Successfully loaded all the paragraphs of chapter id: "+chapterId,paragraphDTOList);
    }

    @GetMapping("/next/{chapterId}")
    public APIResponse loadNextChapter(@PathVariable long chapterId){

        ChapterDTO chapterDTO = chapterService.loadNextChapter(chapterId);
        return new APIResponse(202,"Successfully loaded next chapter",chapterDTO);
    }

    @PostMapping("/comment/reply/check")
    public APIResponse checkCurrentCommentOrReplyByCurrentUser(@RequestBody UserCommentTypeDTO userCommentTypeDTO){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        boolean result = chapterService.checkCurrentCommentOrReplyByCurrentUser(auth.getName(),userCommentTypeDTO);
        return new APIResponse(202,"Successfully check comment or reply by current user",result);
    }

    @DeleteMapping("/comment/reply/delete")
    public APIResponse deleteCommentOrReply(@RequestBody UserCommentTypeDTO userCommentTypeDTO){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        chapterService.deleteCommentOrReply(auth.getName(),userCommentTypeDTO);
        return new APIResponse(202,"Successfully delete comment or reply",null);
    }
}


















