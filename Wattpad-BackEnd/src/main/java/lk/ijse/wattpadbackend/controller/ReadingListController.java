package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.*;
import lk.ijse.wattpadbackend.service.ReadingListService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/readingList")
@RequiredArgsConstructor
public class ReadingListController {

    private final ReadingListService readingListService;

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public APIResponse welcomeMessage(){
        return new APIResponse(202,"WELCOME TO READING LIST PAGE",null);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('USER')")
    public APIResponse getAllReadingLists(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ReadingListsDTO readingListsDTO = readingListService.getAllReadingLists(auth.getName());

        return new APIResponse(202,"Successfully loaded all your readingLists.",readingListsDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public APIResponse deleteReadingListById(@PathVariable long id){

        readingListService.deleteReadingListById(id);
        return new APIResponse(202,"Successfully deleted readingList id: "+id,null);
    }

    @GetMapping("/single/{id}")
    @PreAuthorize("hasRole('USER')")
    public APIResponse getAllStoriesOfReadingListById(@PathVariable long id){

        ReadingListEditResponseDTO readingListEditResponseDTO = readingListService.getAllStoriesOfReadingListById(id);
        return new APIResponse(202,"Successfully loaded all stories from readingList id: "+id,readingListEditResponseDTO);
    }

    @PostMapping("/update")
    @PreAuthorize("hasRole('USER')")
    public APIResponse updateAReadingList(@RequestBody ReadingListEditRequestDTO readingListEditRequestDTO){

        readingListService.updateAReadingList(readingListEditRequestDTO);
        return new APIResponse(202,"Successfully update the reading list", null);
    }

    @GetMapping("/single/all/{id}")
    @PreAuthorize("hasRole('USER')")
    public APIResponse getAllStoriesInAReadingListById(@PathVariable long id){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ReadingListEditResponseDTO readingListEditResponseDTO = readingListService.getAllStoriesInAReadingListById(auth.getName(),id);
        return new APIResponse(202,"Successfully loaded all stories of readingList id: "+id, readingListEditResponseDTO);
    }

    @GetMapping("/owner/{id}")
    @PreAuthorize("hasRole('USER')")
    public APIResponse checkIfReadingListOwnedByCurrentUser(@PathVariable("id") long readingListId){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Boolean result = readingListService.checkIfReadingListOwnedByCurrentUser(auth.getName(),readingListId);
        return new APIResponse(202,"Successfully get the result of reading list owned by current user or not", result);
    }

    @PostMapping("/like/{id}")
    @PreAuthorize("hasRole('USER')")
    public APIResponse addOrRemoveLikeFromTheReadingList(@PathVariable("id") long readingListId){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String result = readingListService.addOrRemoveLikeFromTheReadingList(auth.getName(),readingListId);
        return new APIResponse(202,"Successfully add or remove the like from a reading list id : "+readingListId, result);
    }

    @GetMapping("/liked/all")
    @PreAuthorize("hasRole('USER')")
    public APIResponse getAllLikedReadingLists(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        List<SingleReadingListDTO> singleReadingListDTOList = readingListService.getAllLikedReadingLists(auth.getName());

        return new APIResponse(202,"Successfully loaded all liked readingLists.",singleReadingListDTOList);
    }

    @GetMapping("/all/check/story/{chapterId}")
    @PreAuthorize("hasRole('USER')")
    public APIResponse getAllReadingListsAndCheckTheSpecificStoryExit(@PathVariable long chapterId){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        List<AddToReadingListResponseDTO> addToReadingListResponseDTOList = readingListService.getAllReadingListsAndCheckTheSpecificStoryExit(auth.getName(),chapterId);

        return new APIResponse(202,"Successfully loaded all your readingLists and check story exit or not.",addToReadingListResponseDTOList);
    }

    @GetMapping("/all/check/story/byStoryId/{storyId}")
    @PreAuthorize("hasRole('USER')")
    public APIResponse getAllReadingListsAndCheckTheSpecificStoryExitByStoryId(@PathVariable long storyId){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        List<AddToReadingListResponseDTO> addToReadingListResponseDTOList = readingListService.getAllReadingListsAndCheckTheSpecificStoryExitByStoryId(auth.getName(),storyId);

        return new APIResponse(202,"Successfully loaded all your readingLists and check story exit or not.",addToReadingListResponseDTOList);
    }

    @PostMapping("/create/new")
    @PreAuthorize("hasRole('USER')")
    public APIResponse addNewReadingList(@RequestBody CreateNewListRequestDTO createNewListRequestDTO){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        boolean result = readingListService.addNewReadingList(auth.getName(),createNewListRequestDTO);
        return new APIResponse(202,"Successfully created new reading list", result);
    }

    @PostMapping("/add/remove/story/byChapter/{listId}/{chapterId}")
    @PreAuthorize("hasRole('USER')")
    public APIResponse addOrRemoveStoryToReadingListByChapterId(@PathVariable long listId, @PathVariable long chapterId){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        readingListService.addOrRemoveStoryToReadingListByChapterId(auth.getName(),listId,chapterId);

        return new APIResponse(202,"Successfully added or removed story to reading list id: "+listId,null);
    }

    @PostMapping("/add/remove/story/byStory/{listId}/{storyId}")
    @PreAuthorize("hasRole('USER')")
    public APIResponse addOrRemoveStoryToReadingListByStoryId(@PathVariable long listId, @PathVariable long storyId){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        readingListService.addOrRemoveStoryToReadingListByStoryId(auth.getName(),listId,storyId);

        return new APIResponse(202,"Successfully added or removed story to reading list id: "+listId,null);
    }
}



































