package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.GenreStoryDTO;
import lk.ijse.wattpadbackend.dto.SearchResponseDTO;
import lk.ijse.wattpadbackend.entity.Story;
import lk.ijse.wattpadbackend.entity.StoryTag;
import lk.ijse.wattpadbackend.repository.StoryRepository;
import lk.ijse.wattpadbackend.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

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

        long totalStoryCount = 0;
        totalStoryCount+=storyList.size();

        List<String> tags = new ArrayList<>();

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

                List<StoryTag> storyTags = story.getStoryTags();
                for (StoryTag t : storyTags){
                    tags.add(t.getTag().getTagName());
                }
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

                List<StoryTag> storyTags = story.getStoryTags();
                for (StoryTag t : storyTags){
                    tags.add(t.getTag().getTagName());
                }
            }
        }

        int lessCount = 0;
        if(genreStoryDTOList.size()<15){
            lessCount = 15-genreStoryDTOList.size();
        }

        List<Story> moreStories = new ArrayList<>();

        if(lessCount>0){
            String[] ar = input.split(" ");

            for (int i = 0; i < ar.length; i++) {
                List<Story> storyList1 = storyRepository.findAll();
                for (Story x : storyList1){
                    List<StoryTag> storyTags = x.getStoryTags();
                    for (StoryTag y : storyTags){
                        if(y.getTag().getTagName().equalsIgnoreCase(ar[i])){
                            moreStories.add(x);
                        }
                    }
                }
            }
        }

        if(lessCount>0){
            String[] ar = input.split(" ");

            for (int i = 0; i < ar.length; i++) {
                List<Story> storyList1 = storyRepository.findByTitleContainingWholeWord(ar[i]);
                moreStories.addAll(storyList1);
            }
        }

        L2:for(Story y : moreStories) {
            for (GenreStoryDTO x : genreStoryDTOList) {
                if (Objects.equals(x.getStoryId(), y.getId())) {
                    continue L2;
                }
            }
            totalStoryCount++;
        }

        int i = 0;
        L1:while (genreStoryDTOList.size()<15){

            if(moreStories.size()>i){
                Story story = moreStories.get(i);
                for (GenreStoryDTO x : genreStoryDTOList){
                    if (Objects.equals(x.getStoryId(), story.getId())) {
                        i++;
                        continue L1;
                    }
                }

                i++;
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

                List<StoryTag> storyTags = story.getStoryTags();
                for (StoryTag t : storyTags){
                    tags.add(t.getTag().getTagName());
                }
            }
            else{
                break L1;
            }
        }

        long totalStoryCountLong = totalStoryCount;

        String totalStoryInStr = "";
        if(totalStoryCountLong<=1000){
            totalStoryInStr = String.valueOf(totalStoryCountLong);
        }
        else if (totalStoryCountLong >= 1000 && totalStoryCountLong < 1000000) {
            double value = (double) totalStoryCountLong / 1000;
            String vStr = String.valueOf(value);

            if (vStr.endsWith(".0")) {
                totalStoryInStr = vStr.split("\\.0")[0] + "K";
            } else {
                totalStoryInStr = vStr + "K";
            }
        }
        else if(totalStoryCountLong>=1000000){
            double value = (double) totalStoryCountLong/1000000;

            String vStr = String.valueOf(value);

            if (vStr.endsWith(".0")) {
                totalStoryInStr = vStr.split("\\.0")[0] + "M";
            } else {
                totalStoryInStr = value+"M";
            }
        }

        SearchResponseDTO searchResponseDTO = new SearchResponseDTO();
        searchResponseDTO.setTotalStoriesCount(totalStoryInStr);
        searchResponseDTO.setGenreStoryDTOList(genreStoryDTOList);
        if(totalStoryCountLong>15){
            searchResponseDTO.setAreMoreStoriesAvailable(1);
        }
        else{
            searchResponseDTO.setAreMoreStoriesAvailable(0);
        }

        Map<String, Long> freqMap = new HashMap<>();
        for (String item : tags) {
            freqMap.put(item, freqMap.getOrDefault(item, 0L) + 1);
        }

        List<String> sortedTags = new ArrayList<>(tags);
        sortedTags.sort((a, b) -> {
            int freqCompare = freqMap.get(b).compareTo(freqMap.get(a));
            return (freqCompare != 0) ? freqCompare : a.compareTo(b);
        });

        List<String> uniqueTags = new ArrayList<>(new LinkedHashSet<>(sortedTags));

        int finalTagListLength = 8;
        if(uniqueTags.size()<8){
            finalTagListLength = uniqueTags.size();
        }

        List<String> finalTagList = new ArrayList<>();
        for (int j = 0; j < finalTagListLength; j++) {
            finalTagList.add(uniqueTags.get(j));
        }
        searchResponseDTO.setTags(finalTagList);

        return searchResponseDTO;
    }
}





















