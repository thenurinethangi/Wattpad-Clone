package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.GenreStoryDTO;
import lk.ijse.wattpadbackend.dto.SearchResponseDTO;
import lk.ijse.wattpadbackend.entity.Story;
import lk.ijse.wattpadbackend.repository.StoryRepository;
import lk.ijse.wattpadbackend.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final StoryRepository storyRepository;

    @Override
    public List<String> getTopResultForSearch(String input) {

        List<Story> storyList = storyRepository.findByTitleContainingIgnoreCase(input);

        int returnCount = 0;
        if(storyList.size()<8){
            returnCount = storyList.size();
        }
        else{
           returnCount = 8;
        }
        
        List<String> topStoryTitles = new ArrayList<>();
        for (int i = 0; i < returnCount; i++) {
            if(storyList.get(i).getTitle().toLowerCase().startsWith(input.toLowerCase())){
                topStoryTitles.add(storyList.get(i).getTitle());
            }
        }

        for (int i = 0; i < returnCount; i++) {
            if(!storyList.get(i).getTitle().toLowerCase().startsWith(input.toLowerCase())){
                topStoryTitles.add(storyList.get(i).getTitle());
            }
        }

        return topStoryTitles;
    }

    @Override
    public SearchResponseDTO getAllStoriesThatMatchToSearchedKeyWord(String input) {

        List<Story> storyList = storyRepository.findByTitleContainingIgnoreCase(input);

        int returnCount = 0;
        if(storyList.size()<15){
            returnCount = storyList.size();
        }
        else{
            returnCount = 15;
        }

        SearchResponseDTO searchResponseDTO = new SearchResponseDTO();
        searchResponseDTO.setTotalStoriesCount(String.valueOf(returnCount));

        List<GenreStoryDTO> genreStoryDTOList = new ArrayList<>();
        for (int i = 0; i < returnCount; i++) {
            Story story = storyList.get(i);
            if(story.getTitle().toLowerCase().startsWith(input.toLowerCase())){
                GenreStoryDTO genreStoryDTO = new GenreStoryDTO();
                genreStoryDTO.setStoryId(story.getId());
                genreStoryDTO.setStoryTitle(story.getTitle());
                genreStoryDTO.setStoryDescription(story.getDescription());
                genreStoryDTO.setStatus(story.getStatus());
                genreStoryDTO.setRating(story.getRating());
                genreStoryDTO.setCoverImagePath(story.getCoverImagePath());
                genreStoryDTO.setUserId(story.getUser().getId());
                genreStoryDTO.setUsername(story.getUser().getUsername());
                genreStoryDTO.setParts(story.getParts().longValue());

                long likesLong = story.getLikes().longValue();

                String likesInStr = "";
                if(likesLong<=1000){
                    likesInStr = String.valueOf(likesLong);
                }
                else if (likesLong >= 1000 && likesLong < 1000000) {
                    double value = (double) likesLong / 1000;
                    String vStr = String.valueOf(value);

                    if (vStr.endsWith(".0")) {
                        likesInStr = vStr.split("\\.0")[0] + "K";
                    } else {
                        likesInStr = vStr + "K";
                    }
                }
                else if(likesLong>=1000000){
                    double value = (double) likesLong/1000000;

                    String vStr = String.valueOf(value);

                    if (vStr.endsWith(".0")) {
                        likesInStr = vStr.split("\\.0")[0] + "M";
                    } else {
                        likesInStr = value+"M";
                    }
                }
                genreStoryDTO.setLikes(likesInStr);

                long viewsLong = story.getViews().longValue();

                String viewsInStr = "";
                if(viewsLong<=1000){
                    viewsInStr = String.valueOf(viewsLong);
                }
                else if (viewsLong >= 1000 && viewsLong < 1000000) {
                    double value = (double) viewsLong / 1000;
                    String vStr = String.valueOf(value);

                    if (vStr.endsWith(".0")) {
                        viewsInStr = vStr.split("\\.0")[0] + "K";
                    } else {
                        viewsInStr = vStr + "K";
                    }
                }
                else if(viewsLong>=1000000){
                    double value = (double) viewsLong/1000000;

                    String vStr = String.valueOf(value);

                    if (vStr.endsWith(".0")) {
                        viewsInStr = vStr.split("\\.0")[0] + "M";
                    } else {
                        viewsInStr = value+"M";
                    }
                }
                genreStoryDTO.setViews(viewsInStr);

                genreStoryDTOList.add(genreStoryDTO);
            }
        }

        for (int i = 0; i < returnCount; i++) {
            Story story = storyList.get(i);
            if(!story.getTitle().toLowerCase().startsWith(input.toLowerCase())){
                GenreStoryDTO genreStoryDTO = new GenreStoryDTO();
                genreStoryDTO.setStoryId(story.getId());
                genreStoryDTO.setStoryTitle(story.getTitle());
                genreStoryDTO.setStoryDescription(story.getDescription());
                genreStoryDTO.setStatus(story.getStatus());
                genreStoryDTO.setRating(story.getRating());
                genreStoryDTO.setCoverImagePath(story.getCoverImagePath());
                genreStoryDTO.setUserId(story.getUser().getId());
                genreStoryDTO.setUsername(story.getUser().getUsername());
                genreStoryDTO.setParts(story.getParts().longValue());

                long likesLong = story.getLikes().longValue();

                String likesInStr = "";
                if(likesLong<=1000){
                    likesInStr = String.valueOf(likesLong);
                }
                else if (likesLong >= 1000 && likesLong < 1000000) {
                    double value = (double) likesLong / 1000;
                    String vStr = String.valueOf(value);

                    if (vStr.endsWith(".0")) {
                        likesInStr = vStr.split("\\.0")[0] + "K";
                    } else {
                        likesInStr = vStr + "K";
                    }
                }
                else if(likesLong>=1000000){
                    double value = (double) likesLong/1000000;

                    String vStr = String.valueOf(value);

                    if (vStr.endsWith(".0")) {
                        likesInStr = vStr.split("\\.0")[0] + "M";
                    } else {
                        likesInStr = value+"M";
                    }
                }
                genreStoryDTO.setLikes(likesInStr);

                long viewsLong = story.getViews().longValue();

                String viewsInStr = "";
                if(viewsLong<=1000){
                    viewsInStr = String.valueOf(viewsLong);
                }
                else if (viewsLong >= 1000 && viewsLong < 1000000) {
                    double value = (double) viewsLong / 1000;
                    String vStr = String.valueOf(value);

                    if (vStr.endsWith(".0")) {
                        viewsInStr = vStr.split("\\.0")[0] + "K";
                    } else {
                        viewsInStr = vStr + "K";
                    }
                }
                else if(viewsLong>=1000000){
                    double value = (double) viewsLong/1000000;

                    String vStr = String.valueOf(value);

                    if (vStr.endsWith(".0")) {
                        viewsInStr = vStr.split("\\.0")[0] + "M";
                    } else {
                        viewsInStr = value+"M";
                    }
                }
                genreStoryDTO.setViews(viewsInStr);

                genreStoryDTOList.add(genreStoryDTO);
            }
        }

        searchResponseDTO.setGenreStoryDTOList(genreStoryDTOList);
        searchResponseDTO.setAreMoreStoriesAvailable(0);

        return searchResponseDTO;
    }
}





















