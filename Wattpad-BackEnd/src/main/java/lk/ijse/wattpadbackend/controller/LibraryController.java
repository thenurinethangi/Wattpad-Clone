package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.LibraryStoryDTO;
import lk.ijse.wattpadbackend.service.LibraryService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/library")
@RequiredArgsConstructor
public class LibraryController {

    private final LibraryService libraryService;

    @GetMapping
    public APIResponse welcomeMessage(){
        return new APIResponse(202,"WELCOME TO LIBRARY PAGE",null);
    }

    @GetMapping("/stories")
    public APIResponse getLibraryStories(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        List<LibraryStoryDTO> libraryStoryDTOList = libraryService.getLibraryStories(auth.getName());

        return new APIResponse(202,"Successfully loaded library stories.",libraryStoryDTOList);
    }

    @DeleteMapping("/{storyId}")
    public APIResponse deleteAStoryInLibraryByStoryId(@PathVariable long storyId){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        libraryService.deleteAStoryInLibraryByStoryId(auth.getName(),storyId);

        return new APIResponse(202,"Successfully deleted the story from library.",null);
    }
}













