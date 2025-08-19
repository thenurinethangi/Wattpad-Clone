package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.StoryDTO;
import lk.ijse.wattpadbackend.service.StoryService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/story")
@RequiredArgsConstructor
public class StoryController {

    private final StoryService storyService;

    @GetMapping
    public APIResponse welcomeMessage(){

        return new APIResponse(202,"WELCOME TO STORY PAGE",null);
    }

    @GetMapping("/{id}")
    public APIResponse getAStoryById(@PathVariable long id){

        StoryDTO storyDTO = storyService.getAStoryById(id);

        return new APIResponse(202,"Story data successfully loaded for story id: "+id,storyDTO);
    }
}














