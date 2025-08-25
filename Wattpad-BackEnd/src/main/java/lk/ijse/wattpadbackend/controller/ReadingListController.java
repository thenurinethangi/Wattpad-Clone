package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.ReadingListEditRequestDTO;
import lk.ijse.wattpadbackend.dto.ReadingListEditResponseDTO;
import lk.ijse.wattpadbackend.dto.ReadingListsDTO;
import lk.ijse.wattpadbackend.dto.SingleReadingListDTO;
import lk.ijse.wattpadbackend.service.ReadingListService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
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
    public APIResponse welcomeMessage(){
        return new APIResponse(202,"WELCOME TO READING LIST PAGE",null);
    }

    @GetMapping("/all")
    public APIResponse getAllReadingLists(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ReadingListsDTO readingListsDTO = readingListService.getAllReadingLists(auth.getName());

        return new APIResponse(202,"Successfully loaded all your readingLists.",readingListsDTO);
    }

    @DeleteMapping("/{id}")
    public APIResponse deleteReadingListById(@PathVariable long id){

        readingListService.deleteReadingListById(id);
        return new APIResponse(202,"Successfully deleted readingList id: "+id,null);
    }

    @GetMapping("/single/{id}")
    public APIResponse getAllStoriesOfReadingListById(@PathVariable long id){

        ReadingListEditResponseDTO readingListEditResponseDTO = readingListService.getAllStoriesOfReadingListById(id);
        return new APIResponse(202,"Successfully loaded all stories from readingList id: "+id,readingListEditResponseDTO);
    }

    @PostMapping("/update")
    public APIResponse updateAReadingList(@RequestBody ReadingListEditRequestDTO readingListEditRequestDTO){

        readingListService.updateAReadingList(readingListEditRequestDTO);
        return new APIResponse(202,"Successfully update the reading list", null);
    }

    @GetMapping("/single/all/{id}")
    public APIResponse getAllStoriesInAReadingListById(@PathVariable long id){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ReadingListEditResponseDTO readingListEditResponseDTO = readingListService.getAllStoriesInAReadingListById(auth.getName(),id);
        return new APIResponse(202,"Successfully loaded all stories of readingList id: "+id, readingListEditResponseDTO);
    }

    @GetMapping("/owner/{id}")
    public APIResponse checkIfReadingListOwnedByCurrentUser(@PathVariable("id") long readingListId){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Boolean result = readingListService.checkIfReadingListOwnedByCurrentUser(auth.getName(),readingListId);
        return new APIResponse(202,"Successfully get the result of reading list owned by current user or not", result);
    }

    @PostMapping("/like/{id}")
    public APIResponse addOrRemoveLikeFromTheReadingList(@PathVariable("id") long readingListId){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String result = readingListService.addOrRemoveLikeFromTheReadingList(auth.getName(),readingListId);
        return new APIResponse(202,"Successfully add or remove the like from a reading list id : "+readingListId, result);
    }

    @GetMapping("/liked/all")
    public APIResponse getAllLikedReadingLists(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        List<SingleReadingListDTO> singleReadingListDTOList = readingListService.getAllLikedReadingLists(auth.getName());

        return new APIResponse(202,"Successfully loaded all liked readingLists.",singleReadingListDTOList);
    }
}



































