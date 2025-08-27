package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.GenreStoryDTO;
import lk.ijse.wattpadbackend.dto.TagSearchCriteriaDTO;
import lk.ijse.wattpadbackend.dto.TagSearchResponseDTO;
import lk.ijse.wattpadbackend.entity.Story;
import lk.ijse.wattpadbackend.entity.StoryTag;
import lk.ijse.wattpadbackend.entity.Tag;
import lk.ijse.wattpadbackend.repository.StoryRepository;
import lk.ijse.wattpadbackend.repository.TagRepository;
import lk.ijse.wattpadbackend.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;
    private final StoryRepository storyRepository;

    @Override
    public TagSearchResponseDTO getAllStoriesOfSelectedTag(String tagName, TagSearchCriteriaDTO tagSearchCriteriaDTO) {

        try {
            if(tagSearchCriteriaDTO.getSortBy()==1){

                Tag tag = tagRepository.findByTagName(tagName);

                List<Story> storyList = storyRepository.findAllByOrderByViewsDesc();

                List<Story> selectedStoryList = new ArrayList<>();
                for (Story x : storyList){
                    List<StoryTag> storyTags = x.getStoryTags();
                    for (StoryTag y : storyTags){
                        if(y.getTag().getId() == tag.getId()){
                            selectedStoryList.add(x);
                            break;
                        }
                    }
                }

                List<Story> qualifiedStoryList = new ArrayList<>();
                if(tagSearchCriteriaDTO.getTags().isEmpty()){
                    qualifiedStoryList.addAll(selectedStoryList);
                }
                else{
                    L1:for (Story x : selectedStoryList){
                        List<StoryTag> storyTags = x.getStoryTags();

                        List<String> tags = new ArrayList<>();
                        for(StoryTag y : storyTags){
                            tags.add(y.getTag().getTagName());
                        }
                        Collections.sort(tags);

                        List<String> searchedTags = tagSearchCriteriaDTO.getTags();
                        Collections.sort(searchedTags);

                        for (String t : searchedTags){
                            if(!tags.contains(t)){
                                continue L1;
                            }
                        }
                        qualifiedStoryList.add(x);
                    }
                }

                long returnStoryCount = 0;
                if(tagSearchCriteriaDTO.getStoryCount()<=qualifiedStoryList.size()){
                    returnStoryCount = tagSearchCriteriaDTO.getStoryCount();
                }
                else{
                    returnStoryCount = qualifiedStoryList.size();

                }

                List<Story> finalQulifiedStoryList = new ArrayList<>();
                for (int i = 0; i < returnStoryCount; i++) {
                    finalQulifiedStoryList.add(qualifiedStoryList.get(i));
                }

                TagSearchResponseDTO tagSearchResponseDTO = new TagSearchResponseDTO();

                if(qualifiedStoryList.size()>tagSearchCriteriaDTO.getStoryCount()){
                    tagSearchResponseDTO.setAreMoreStoriesAvailable(1);
                }
                else{
                    tagSearchResponseDTO.setAreMoreStoriesAvailable(0);
                }

                long count = returnStoryCount;

                String storyCountInStr = "";
                if(count<=1000){
                    storyCountInStr = String.valueOf(count);
                }
                else if (count >= 1000 && count < 1000000) {
                    double value = (double) count / 1000;
                    String vStr = String.valueOf(value);

                    if (vStr.endsWith(".0")) {
                        storyCountInStr = vStr.split("\\.0")[0] + "K";
                    } else {
                        storyCountInStr = vStr + "K";
                    }
                }
                else if(count>=1000000){
                    double value = (double) count/1000000;

                    String vStr = String.valueOf(value);

                    if (vStr.endsWith(".0")) {
                        storyCountInStr = vStr.split("\\.0")[0] + "M";
                    } else {
                        storyCountInStr = value+"M";
                    }
                }
                tagSearchResponseDTO.setTotalStoriesCount(storyCountInStr);

                List<GenreStoryDTO> genreStoryDTOList = new ArrayList<>();
                List<String> returnTags = new ArrayList<>();
                int rank = 1;
                for (Story x : finalQulifiedStoryList){
                    GenreStoryDTO genreStoryDTO = new GenreStoryDTO();
                    genreStoryDTO.setStoryId(x.getId());
                    genreStoryDTO.setStoryTitle(x.getTitle());
                    genreStoryDTO.setStoryDescription(x.getDescription());
                    genreStoryDTO.setStatus(x.getStatus());
                    genreStoryDTO.setRating(x.getRating());
                    genreStoryDTO.setCoverImagePath(x.getCoverImagePath());
                    genreStoryDTO.setUserId(x.getUser().getId());
                    genreStoryDTO.setUsername(x.getUser().getUsername());
                    genreStoryDTO.setRankNo(rank);

                    List<String> tags = new ArrayList<>();
                    for (StoryTag y : x.getStoryTags()){
                        tags.add(y.getTag().getTagName());

                        if(!returnTags.contains(y.getTag().getTagName())){
                            returnTags.add(y.getTag().getTagName());
                        }
                    }
                    genreStoryDTO.setTags(tags);

                    genreStoryDTO.setParts(x.getParts().longValue());

                    long likesLong = x.getLikes().longValue();

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

                    long viewsLong = x.getViews().longValue();

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

                    rank++;
                    genreStoryDTOList.add(genreStoryDTO);
                }

                tagSearchResponseDTO.setTags(returnTags);
                tagSearchResponseDTO.setGenreStoryDTOList(genreStoryDTOList);

                return tagSearchResponseDTO;
            }
            else {
                Tag tag = tagRepository.findByTagName(tagName);

                List<Story> storyList = storyRepository.findAllByOrderByCreatedAtDesc();

                List<Story> selectedStoryList = new ArrayList<>();
                for (Story x : storyList){
                    List<StoryTag> storyTags = x.getStoryTags();
                    for (StoryTag y : storyTags){
                        if(y.getTag().getId() == tag.getId()){
                            selectedStoryList.add(x);
                            break;
                        }
                    }
                }

                List<Story> qualifiedStoryList = new ArrayList<>();
                if(tagSearchCriteriaDTO.getTags().isEmpty()){
                    qualifiedStoryList.addAll(selectedStoryList);
                }
                else{
                    L1:for (Story x : selectedStoryList){
                        List<StoryTag> storyTags = x.getStoryTags();

                        List<String> tags = new ArrayList<>();
                        for(StoryTag y : storyTags){
                            tags.add(y.getTag().getTagName());
                        }
                        Collections.sort(tags);

                        List<String> searchedTags = tagSearchCriteriaDTO.getTags();
                        Collections.sort(searchedTags);

                        for (String t : searchedTags){
                            if(!tags.contains(t)){
                                continue L1;
                            }
                        }
                        qualifiedStoryList.add(x);
                    }
                }

                long returnStoryCount = 0;
                if(tagSearchCriteriaDTO.getStoryCount()<=qualifiedStoryList.size()){
                    returnStoryCount = tagSearchCriteriaDTO.getStoryCount();
                }
                else{
                    returnStoryCount = qualifiedStoryList.size();

                }

                List<Story> finalQulifiedStoryList = new ArrayList<>();
                for (int i = 0; i < returnStoryCount; i++) {
                    finalQulifiedStoryList.add(qualifiedStoryList.get(i));
                }

                TagSearchResponseDTO tagSearchResponseDTO = new TagSearchResponseDTO();

                if(qualifiedStoryList.size()>tagSearchCriteriaDTO.getStoryCount()){
                    tagSearchResponseDTO.setAreMoreStoriesAvailable(1);
                }
                else{
                    tagSearchResponseDTO.setAreMoreStoriesAvailable(0);
                }

                long count = returnStoryCount;

                String storyCountInStr = "";
                if(count<=1000){
                    storyCountInStr = String.valueOf(count);
                }
                else if (count >= 1000 && count < 1000000) {
                    double value = (double) count / 1000;
                    String vStr = String.valueOf(value);

                    if (vStr.endsWith(".0")) {
                        storyCountInStr = vStr.split("\\.0")[0] + "K";
                    } else {
                        storyCountInStr = vStr + "K";
                    }
                }
                else if(count>=1000000){
                    double value = (double) count/1000000;

                    String vStr = String.valueOf(value);

                    if (vStr.endsWith(".0")) {
                        storyCountInStr = vStr.split("\\.0")[0] + "M";
                    } else {
                        storyCountInStr = value+"M";
                    }
                }
                tagSearchResponseDTO.setTotalStoriesCount(storyCountInStr);

                List<GenreStoryDTO> genreStoryDTOList = new ArrayList<>();
                List<String> returnTags = new ArrayList<>();
                int rank = 1;
                for (Story x : finalQulifiedStoryList){
                    GenreStoryDTO genreStoryDTO = new GenreStoryDTO();
                    genreStoryDTO.setStoryId(x.getId());
                    genreStoryDTO.setStoryTitle(x.getTitle());
                    genreStoryDTO.setStoryDescription(x.getDescription());
                    genreStoryDTO.setStatus(x.getStatus());
                    genreStoryDTO.setRating(x.getRating());
                    genreStoryDTO.setCoverImagePath(x.getCoverImagePath());
                    genreStoryDTO.setUserId(x.getUser().getId());
                    genreStoryDTO.setUsername(x.getUser().getUsername());
                    genreStoryDTO.setRankNo(rank);

                    List<String> tags = new ArrayList<>();
                    for (StoryTag y : x.getStoryTags()){
                        tags.add(y.getTag().getTagName());

                        if(!returnTags.contains(y.getTag().getTagName())){
                            returnTags.add(y.getTag().getTagName());
                        }
                    }
                    genreStoryDTO.setTags(tags);

                    genreStoryDTO.setParts(x.getParts().longValue());

                    long likesLong = x.getLikes().longValue();

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

                    long viewsLong = x.getViews().longValue();

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

                    rank++;
                    genreStoryDTOList.add(genreStoryDTO);
                }

                tagSearchResponseDTO.setTags(returnTags);
                tagSearchResponseDTO.setGenreStoryDTOList(genreStoryDTOList);

                return tagSearchResponseDTO;
            }
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}
