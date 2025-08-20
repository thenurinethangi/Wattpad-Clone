package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.ChapterDTO;
import lk.ijse.wattpadbackend.dto.StoryDTO;
import lk.ijse.wattpadbackend.service.ChapterService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}


















