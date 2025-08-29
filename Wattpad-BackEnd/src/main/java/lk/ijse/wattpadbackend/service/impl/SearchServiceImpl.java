package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.GenreStoryDTO;
import lk.ijse.wattpadbackend.dto.SearchCriteriaDTO;
import lk.ijse.wattpadbackend.dto.SearchProfileReturnDTO;
import lk.ijse.wattpadbackend.dto.SearchResponseDTO;
import lk.ijse.wattpadbackend.entity.*;
import lk.ijse.wattpadbackend.repository.*;
import lk.ijse.wattpadbackend.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final StoryRepository storyRepository;
    private final ChapterRepository chapterRepository;
    private final UserRepository userRepository;
    private final ReadingListRepository readingListRepository;
    private final FollowingRepository followingRepository;

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

    @Override
    public SearchResponseDTO getAllStoriesThatMatchToSearchedKeyWordAndCriteria(String input, SearchCriteriaDTO searchCriteriaDTO) {

        List<Story> storyList = storyRepository.findByTitleContainingIgnoreCase(input);

        List<GenreStoryDTO> genreStoryDTOList = new ArrayList<>();
        for (int i = 0; i < storyList.size(); i++) {
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

        for (int i = 0; i < storyList.size(); i++) {
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

       List<Story> moreStories = new ArrayList<>();

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

        for (int i = 0; i < ar.length; i++) {
            List<Story> storyList1 = storyRepository.findByTitleContainingWholeWord(ar[i]);
            moreStories.addAll(storyList1);
        }

        L1:for (int i = 0; i < moreStories.size(); i++) {
            Story story = moreStories.get(i);
            for (GenreStoryDTO x : genreStoryDTOList){
                if (Objects.equals(x.getStoryId(), story.getId())) {
                    continue L1;
                }
            }

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

        SearchResponseDTO searchResponseDTO = new SearchResponseDTO();

        List<GenreStoryDTO> finalSelectedStoryListAfterLengthCheck = new ArrayList<>();
        for (GenreStoryDTO x : genreStoryDTOList){
            if(searchCriteriaDTO.getLength().equalsIgnoreCase("anyLength")){
                finalSelectedStoryListAfterLengthCheck.add(x);
            }
            else if(searchCriteriaDTO.getLength().equalsIgnoreCase("oneToTen")){
                if(x.getParts()>=1 && x.getParts()<=10){
                    finalSelectedStoryListAfterLengthCheck.add(x);
                }
            }
            else if(searchCriteriaDTO.getLength().equalsIgnoreCase("tenToTwenty")){
                if(x.getParts()>=10 && x.getParts()<=20){
                    finalSelectedStoryListAfterLengthCheck.add(x);
                }
            }
            else if(searchCriteriaDTO.getLength().equalsIgnoreCase("twentyToFifty")){
                if(x.getParts()>=20 && x.getParts()<=50){
                    finalSelectedStoryListAfterLengthCheck.add(x);
                }
            }
            else if(searchCriteriaDTO.getLength().equalsIgnoreCase("50 Parts or more")){
                if(x.getParts()>=50){
                    finalSelectedStoryListAfterLengthCheck.add(x);
                }
            }
        }
        

        List<GenreStoryDTO> finalSelectedStoryListAfterTimeCheck = new ArrayList<>();
        for (GenreStoryDTO x : finalSelectedStoryListAfterLengthCheck){
            if(searchCriteriaDTO.getTime().equalsIgnoreCase("anytime")){
                finalSelectedStoryListAfterTimeCheck.add(x);
            }
            else if(searchCriteriaDTO.getTime().equalsIgnoreCase("day")){
                Optional<Story> storyOptional = storyRepository.findById((int) x.getStoryId());
                Story story = storyOptional.get();
                List<Chapter> chapterList = chapterRepository.findAllByStory(story);

                if (!chapterList.isEmpty()) {
                    Chapter lastChapter = chapterList.getLast();
                    LocalDateTime lastUpdatedDate = lastChapter.getPublishedDate();

                    if (lastUpdatedDate.toLocalDate().isEqual(LocalDate.now())) {
                        finalSelectedStoryListAfterTimeCheck.add(x);
                    }
                    else {

                    }
                }
            }
            else if (searchCriteriaDTO.getTime().equalsIgnoreCase("week")) {
                Optional<Story> storyOptional = storyRepository.findById((int) x.getStoryId());
                if (storyOptional.isPresent()) {
                    Story story = storyOptional.get();
                    List<Chapter> chapterList = chapterRepository.findAllByStory(story);

                    if (!chapterList.isEmpty()) {
                        Chapter lastChapter = chapterList.getLast();
                        LocalDateTime lastUpdatedDate = lastChapter.getPublishedDate();

                        LocalDate today = LocalDate.now();
                        // Start of this week (Monday)
                        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
                        // End of this week (Sunday)
                        LocalDate endOfWeek = today.with(DayOfWeek.SUNDAY);

                        LocalDate updatedDate = lastUpdatedDate.toLocalDate();

                        if ((updatedDate.isEqual(startOfWeek) || updatedDate.isAfter(startOfWeek)) &&
                                (updatedDate.isEqual(endOfWeek)   || updatedDate.isBefore(endOfWeek))) {

                            finalSelectedStoryListAfterTimeCheck.add(x);
                        }
                    }
                }
            }
            else if (searchCriteriaDTO.getTime().equalsIgnoreCase("month")) {
                Optional<Story> storyOptional = storyRepository.findById((int) x.getStoryId());
                if (storyOptional.isPresent()) {
                    Story story = storyOptional.get();
                    List<Chapter> chapterList = chapterRepository.findAllByStory(story);

                    if (!chapterList.isEmpty()) {
                        Chapter lastChapter = chapterList.getLast();
                        LocalDate updatedDate = lastChapter.getPublishedDate().toLocalDate();

                        LocalDate today = LocalDate.now();

                        if (updatedDate.getYear() == today.getYear() &&
                                updatedDate.getMonth() == today.getMonth()) {
                            finalSelectedStoryListAfterTimeCheck.add(x);
                        }
                    }
                }
            }
            else if (searchCriteriaDTO.getTime().equalsIgnoreCase("year")) {
                Optional<Story> storyOptional = storyRepository.findById((int) x.getStoryId());
                if (storyOptional.isPresent()) {
                    Story story = storyOptional.get();
                    List<Chapter> chapterList = chapterRepository.findAllByStory(story);

                    if (!chapterList.isEmpty()) {
                        Chapter lastChapter = chapterList.getLast();
                        LocalDate updatedDate = lastChapter.getPublishedDate().toLocalDate();

                        LocalDate today = LocalDate.now();

                        if (updatedDate.getYear() == today.getYear()) {
                            finalSelectedStoryListAfterTimeCheck.add(x);
                        }
                    }
                }
            }
        }


        if(searchCriteriaDTO.getContent()!=null) {
            List<GenreStoryDTO> finalSelectedStoryListAfterContentCheck = new ArrayList<>();
            for (GenreStoryDTO x : finalSelectedStoryListAfterTimeCheck) {
                if (searchCriteriaDTO.getContent().equalsIgnoreCase("complete")) {
                    if (x.getStatus() == 1) {
                        finalSelectedStoryListAfterContentCheck.add(x);
                    }
                } else if (searchCriteriaDTO.getContent().equalsIgnoreCase("mature")) {
                    if (x.getRating() != 1) {
                        finalSelectedStoryListAfterContentCheck.add(x);
                    }
                } else if (searchCriteriaDTO.getContent().equalsIgnoreCase("free")) {

                } else if (searchCriteriaDTO.getContent().equalsIgnoreCase("paid")) {

                }
            }

//            if (!searchCriteriaDTO.getTags().isEmpty()) {
//                List<GenreStoryDTO> finalSelectedStoryListAfterTagCheck = new ArrayList<>();
//
//                //strict
//                for (GenreStoryDTO x : finalSelectedStoryListAfterContentCheck) {
//                    Optional<Story> storyOptional = storyRepository.findById((int) x.getStoryId());
//                    if (storyOptional.isEmpty()) continue;
//
//                    Story story = storyOptional.get();
//                    List<String> storyTagNames = story.getStoryTags()
//                            .stream()
//                            .map(st -> st.getTag().getTagName().toLowerCase())
//                            .toList();
//
//                    boolean allMatch = searchCriteriaDTO.getTags()
//                            .stream()
//                            .allMatch(tag -> storyTagNames.contains(tag.toLowerCase()));
//
//                    if (allMatch) {
//                        finalSelectedStoryListAfterTagCheck.add(x);
//                    }
//                }
//
//                //loose
//                for (GenreStoryDTO x : finalSelectedStoryListAfterContentCheck) {
//                    Optional<Story> storyOptional = storyRepository.findById((int) x.getStoryId());
//                    if (storyOptional.isEmpty()) continue;
//
//                    Story story = storyOptional.get();
//                    List<String> storyTagNames = story.getStoryTags()
//                            .stream()
//                            .map(st -> st.getTag().getTagName().toLowerCase())
//                            .toList();
//
//                    boolean anyMatch = searchCriteriaDTO.getTags()
//                            .stream()
//                            .anyMatch(tag -> storyTagNames.contains(tag.toLowerCase()));
//
//                    if (anyMatch) {
//                        finalSelectedStoryListAfterTagCheck.add(x);
//                    }
//                }
//
//                searchResponseDTO.setGenreStoryDTOList(finalSelectedStoryListAfterTagCheck);
//            }
            if (!searchCriteriaDTO.getTags().isEmpty()) {
                List<GenreStoryDTO> finalSelectedStoryListAfterTagCheck = new ArrayList<>();

                for (GenreStoryDTO x : finalSelectedStoryListAfterContentCheck) {
                    Optional<Story> storyOptional = storyRepository.findById((int) x.getStoryId());
                    if (storyOptional.isEmpty()) continue;

                    Story story = storyOptional.get();
                    List<String> storyTagNames = story.getStoryTags()
                            .stream()
                            .map(st -> st.getTag().getTagName().toLowerCase())
                            .toList();

                    // --- Strict match: ALL tags must exist ---
                    boolean allMatch = searchCriteriaDTO.getTags()
                            .stream()
                            .allMatch(tag -> storyTagNames.contains(tag.toLowerCase()));

                    // --- Loose match: ANY tag must exist ---
                    boolean anyMatch = searchCriteriaDTO.getTags()
                            .stream()
                            .anyMatch(tag -> storyTagNames.contains(tag.toLowerCase()));

                    if ((allMatch || anyMatch) &&
                            finalSelectedStoryListAfterTagCheck.stream()
                                    .noneMatch(dto -> dto.getStoryId() == x.getStoryId())) {
                        finalSelectedStoryListAfterTagCheck.add(x);
                    }
                }

                searchResponseDTO.setGenreStoryDTOList(finalSelectedStoryListAfterTagCheck);
            }
            else {
                searchResponseDTO.setGenreStoryDTOList(finalSelectedStoryListAfterContentCheck);
            }
        }
        else{

//            if(!searchCriteriaDTO.getTags().isEmpty()){
//                List<GenreStoryDTO> finalSelectedStoryListAfterTagCheck = new ArrayList<>();
//
//                //strict
//                for (GenreStoryDTO x : finalSelectedStoryListAfterTimeCheck) {
//                    Optional<Story> storyOptional = storyRepository.findById((int) x.getStoryId());
//                    if (storyOptional.isEmpty()) continue;
//
//                    Story story = storyOptional.get();
//                    List<String> storyTagNames = story.getStoryTags()
//                            .stream()
//                            .map(st -> st.getTag().getTagName().toLowerCase())
//                            .toList();
//
//                    boolean allMatch = searchCriteriaDTO.getTags()
//                            .stream()
//                            .allMatch(tag -> storyTagNames.contains(tag.toLowerCase()));
//
//                    if (allMatch) {
//                        finalSelectedStoryListAfterTagCheck.add(x);
//                    }
//                }
//
//                //loose
//                for (GenreStoryDTO x : finalSelectedStoryListAfterTimeCheck) {
//                    Optional<Story> storyOptional = storyRepository.findById((int) x.getStoryId());
//                    if (storyOptional.isEmpty()) continue;
//
//                    Story story = storyOptional.get();
//                    List<String> storyTagNames = story.getStoryTags()
//                            .stream()
//                            .map(st -> st.getTag().getTagName().toLowerCase())
//                            .toList();
//
//                    boolean anyMatch = searchCriteriaDTO.getTags()
//                            .stream()
//                            .anyMatch(tag -> storyTagNames.contains(tag.toLowerCase()));
//
//                    if (anyMatch) {
//                        finalSelectedStoryListAfterTagCheck.add(x);
//                    }
//                }
//
//                searchResponseDTO.setGenreStoryDTOList(finalSelectedStoryListAfterTagCheck);
//            }
            if (!searchCriteriaDTO.getTags().isEmpty()) {
                List<GenreStoryDTO> finalSelectedStoryListAfterTagCheck = new ArrayList<>();

                for (GenreStoryDTO x : finalSelectedStoryListAfterTimeCheck) {
                    Optional<Story> storyOptional = storyRepository.findById((int) x.getStoryId());
                    if (storyOptional.isEmpty()) continue;

                    Story story = storyOptional.get();
                    List<String> storyTagNames = story.getStoryTags()
                            .stream()
                            .map(st -> st.getTag().getTagName().toLowerCase())
                            .toList();

                    // --- Strict match: ALL tags must exist ---
                    boolean allMatch = searchCriteriaDTO.getTags()
                            .stream()
                            .allMatch(tag -> storyTagNames.contains(tag.toLowerCase()));

                    // --- Loose match: ANY tag must exist ---
                    boolean anyMatch = searchCriteriaDTO.getTags()
                            .stream()
                            .anyMatch(tag -> storyTagNames.contains(tag.toLowerCase()));

                    if ((allMatch || anyMatch) &&
                            finalSelectedStoryListAfterTagCheck.stream()
                                    .noneMatch(dto -> dto.getStoryId() == x.getStoryId())) {
                        finalSelectedStoryListAfterTagCheck.add(x);
                    }
                }

                searchResponseDTO.setGenreStoryDTOList(finalSelectedStoryListAfterTagCheck);
            }
            else {
                searchResponseDTO.setGenreStoryDTOList(finalSelectedStoryListAfterTimeCheck);
            }
        }

        System.out.println(searchCriteriaDTO);
        return searchResponseDTO;
    }

    @Override
    public List<SearchProfileReturnDTO> getAllProfilesThatMatchToSearchedKeyWord(String input) {

        try{
            List<User> userList1 = userRepository.findAllByFullNameContainingIgnoreCase(input);
            List<User> userList2 = userRepository.findAllByUsernameContainingIgnoreCase(input);

            List<User> finalSelectedUserList = new ArrayList<>();
            for (User x : userList1){
                if(!finalSelectedUserList.contains(x)){
                    finalSelectedUserList.add(x);
                }
            }

            for (User x : userList2){
                if(!finalSelectedUserList.contains(x)){
                    finalSelectedUserList.add(x);
                }
            }

            List<SearchProfileReturnDTO> searchProfileReturnDTOList = new ArrayList<>();
            for (User x : finalSelectedUserList){
                SearchProfileReturnDTO searchProfileReturnDTO = new SearchProfileReturnDTO();
                searchProfileReturnDTO.setUserId(x.getId());
                searchProfileReturnDTO.setUsername(x.getUsername());
                searchProfileReturnDTO.setFullName(x.getFullName());
                searchProfileReturnDTO.setProfilePicPath(x.getProfilePicPath());

                List<Story> storyList = storyRepository.findAllByUser(x);
                searchProfileReturnDTO.setStoryCount(storyList.size());

                List<ReadingList> readingListList = readingListRepository.findAllByUser(x);
                searchProfileReturnDTO.setReadingListCount(readingListList.size());

                List<Following> followingList = followingRepository.findAllByUser(x);

                long followersLong = followingList.size();

                String followersInStr = "";
                if(followersLong<=1000){
                    followersInStr = String.valueOf(followersLong);
                }
                else if (followersLong >= 1000 && followersLong < 1000000) {
                    double value = (double) followersLong / 1000;
                    String vStr = String.valueOf(value);

                    if (vStr.endsWith(".0")) {
                        followersInStr = vStr.split("\\.0")[0] + "K";
                    } else {
                        followersInStr = vStr + "K";
                    }
                }
                else if(followersLong>=1000000){
                    double value = (double) followersLong/1000000;

                    String vStr = String.valueOf(value);

                    if (vStr.endsWith(".0")) {
                        followersInStr = vStr.split("\\.0")[0] + "M";
                    } else {
                        followersInStr = value+"M";
                    }
                }
                searchProfileReturnDTO.setFollowersCount(followersInStr);

                searchProfileReturnDTOList.add(searchProfileReturnDTO);
            }

            return searchProfileReturnDTOList;

        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}





















