package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.SearchResponseDTO;
import lk.ijse.wattpadbackend.service.SearchService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public APIResponse welcomeMessage(){
        return new APIResponse(202,"WELCOME TO THE SEARCH RESULT PAGE",null);
    }

    @GetMapping("{input}")
    public APIResponse getTopResultForSearch(@PathVariable String input){

        List<String> topStoryTitles = searchService.getTopResultForSearch(input);
        return new APIResponse(202,"Successfully load top search result",topStoryTitles);
    }

    @GetMapping("/by/{input}")
    public APIResponse getAllStoriesThatMatchToSearchedKeyWord(@PathVariable String input){

        SearchResponseDTO searchResponseDTO = searchService.getAllStoriesThatMatchToSearchedKeyWord(input);
        return new APIResponse(202,"Successfully load stories by searched keyword",searchResponseDTO);
    }
}




















