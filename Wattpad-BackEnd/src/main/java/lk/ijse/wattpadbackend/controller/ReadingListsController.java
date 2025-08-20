package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.ReadingListsDTO;
import lk.ijse.wattpadbackend.service.ReadingListsService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/readingLists")
@RequiredArgsConstructor
public class ReadingListsController {

    private final ReadingListsService readingListsService;

    @GetMapping
    public APIResponse welcomeMessage(){
        return new APIResponse(202,"WELCOME TO READING LIST PAGE",null);
    }

    @GetMapping("/all")
    public APIResponse getAllReadingLists(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ReadingListsDTO readingListsDTO = readingListsService.getAllReadingLists(auth.getName());

        return new APIResponse(202,"Successfully loaded all your readingLists.",readingListsDTO);
    }

    @DeleteMapping("/{id}")
    public APIResponse deleteReadingListById(@PathVariable long id){
        
        readingListsService.deleteReadingListById(id);
        return new APIResponse(202,"Successfully deleted readingList id: "+id,null);
    }
}



































