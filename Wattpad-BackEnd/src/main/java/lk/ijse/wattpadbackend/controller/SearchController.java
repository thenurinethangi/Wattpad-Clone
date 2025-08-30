package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.SearchCriteriaDTO;
import lk.ijse.wattpadbackend.dto.SearchProfileReturnDTO;
import lk.ijse.wattpadbackend.dto.SearchResponseDTO;
import lk.ijse.wattpadbackend.service.SearchService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/by/criteria/{input}")
    public APIResponse getAllStoriesThatMatchToSearchedKeyWordAndCriteria(@PathVariable String input, @RequestBody SearchCriteriaDTO searchCriteriaDTO){

        SearchResponseDTO searchResponseDTO = searchService.getAllStoriesThatMatchToSearchedKeyWordAndCriteria(input,searchCriteriaDTO);
        return new APIResponse(202,"Successfully load stories by searched keyword and criteria",searchResponseDTO);
    }

    @GetMapping("/profile/by/{input}")
    public APIResponse getAllProfilesThatMatchToSearchedKeyWord(@PathVariable String input){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        List<SearchProfileReturnDTO> searchProfileReturnDTOList = searchService.getAllProfilesThatMatchToSearchedKeyWord(auth.getName(),input);
        return new APIResponse(202,"Successfully load profiles by searched keyword",searchProfileReturnDTOList);
    }
}




















