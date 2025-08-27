package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.GenreSearchCriteriaDTO;
import lk.ijse.wattpadbackend.dto.GenreSearchResponseDTO;
import lk.ijse.wattpadbackend.dto.TagSearchCriteriaDTO;
import lk.ijse.wattpadbackend.dto.TagSearchResponseDTO;
import lk.ijse.wattpadbackend.service.TagService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tag")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @GetMapping
    public APIResponse welcomeMessage(){
        return new APIResponse(202,"WELCOME TO TAG STORIES PAGE",null);
    }

    @PostMapping("/{tag}")
    public APIResponse getAllStoriesOfSelectedTag(@PathVariable String tag, @RequestBody TagSearchCriteriaDTO tagSearchCriteriaDTO){

        TagSearchResponseDTO tagSearchResponseDTO = tagService.getAllStoriesOfSelectedTag(tag,tagSearchCriteriaDTO);
        return new APIResponse(202,"Successfully load stories from selected tag.",tagSearchResponseDTO);
    }

}
