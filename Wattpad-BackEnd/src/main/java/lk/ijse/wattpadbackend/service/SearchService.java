package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.SearchCriteriaDTO;
import lk.ijse.wattpadbackend.dto.SearchProfileReturnDTO;
import lk.ijse.wattpadbackend.dto.SearchResponseDTO;

import java.util.List;

public interface SearchService {

    List<String> getTopResultForSearch(String input);

    SearchResponseDTO getAllStoriesThatMatchToSearchedKeyWord(String input);

    SearchResponseDTO getAllStoriesThatMatchToSearchedKeyWordAndCriteria(String input, SearchCriteriaDTO searchCriteriaDTO);

    List<SearchProfileReturnDTO> getAllProfilesThatMatchToSearchedKeyWord(String username,String input);

    SearchResponseDTO getAllStoriesThatMatchToSearchedKeyWordAndLimitedCount(String input, int count);
}
