package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.*;
import lk.ijse.wattpadbackend.entity.*;
import lk.ijse.wattpadbackend.exception.UserNotFoundException;
import lk.ijse.wattpadbackend.repository.GenreRepository;
import lk.ijse.wattpadbackend.repository.StoryRepository;
import lk.ijse.wattpadbackend.repository.UserGenreRepository;
import lk.ijse.wattpadbackend.repository.UserRepository;
import lk.ijse.wattpadbackend.service.GenreService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GenreServiceImpl implements GenreService {

    private final GenreRepository genreRepository;
    private final UserGenreRepository userGenreRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final StoryRepository storyRepository;

    @Override
    public List<GenreDTO> AllGenre() {

        try {
            List<Genre> genreList = genreRepository.findAll();

            List<GenreDTO> genreDTOList = new ArrayList<>();
            for (Genre x : genreList){
                genreDTOList.add(modelMapper.map(x, GenreDTO.class));
            }
            return genreDTOList;
        }
        catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public void selectGenre(SelectedGenreDTO selectedGenreDTO, String name) {

        try {
            User user = userRepository.findByUsername(name);

            if (user == null) {
                throw new UserNotFoundException("User Not Found.");
            }

            userGenreRepository.deleteAllByUser(user);

            for (int i = 0; i < selectedGenreDTO.getGenres().size(); i++) {
                Genre genre = genreRepository.findByGenre(selectedGenreDTO.getGenres().get(i)).get(0);
                UserGenre userGenre = new UserGenre(user, genre);
                userGenreRepository.save(userGenre);
            }
        }
        catch (UserNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Internal Server Error.");
        }
    }

    @Override
    public GenreSearchResponseDTO getAllStoriesOfSelectedGenre(String genre, GenreSearchCriteriaDTO searchCriteriaDTO) {

        try {
            if(searchCriteriaDTO.getSortBy()==1){
                List<Story> storyList = storyRepository.findAllByCategoryOrderByViewsDesc(genre);

                List<Story> qualifiedStoryList = new ArrayList<>();
                if(searchCriteriaDTO.getTags().isEmpty()){
                    qualifiedStoryList.addAll(storyList);
                }
                else{
                    L1:for (Story x : storyList){
                        List<StoryTag> storyTags = x.getStoryTags();

                        List<String> tags = new ArrayList<>();
                        for(StoryTag y : storyTags){
                            tags.add(y.getTag().getTagName());
                        }
                        Collections.sort(tags);

                        List<String> searchedTags = searchCriteriaDTO.getTags();
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
                if(searchCriteriaDTO.getStoryCount()<=qualifiedStoryList.size()){
                    returnStoryCount = searchCriteriaDTO.getStoryCount();
                }
                else{
                    returnStoryCount = qualifiedStoryList.size();
                }

                List<Story> finalQulifiedStoryList = new ArrayList<>();
                for (int i = 0; i < returnStoryCount; i++) {
                    finalQulifiedStoryList.add(qualifiedStoryList.get(i));
                }

                GenreSearchResponseDTO genreSearchResponseDTO = new GenreSearchResponseDTO();

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
                genreSearchResponseDTO.setTotalStoriesCount(storyCountInStr);

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

                genreSearchResponseDTO.setTags(returnTags);
                genreSearchResponseDTO.setGenreStoryDTOList(genreStoryDTOList);

                return genreSearchResponseDTO;
            }
            else {
                List<Story> storyList = storyRepository.findAllByCategoryOrderByCreatedAtDesc(genre);

                List<Story> qualifiedStoryList = new ArrayList<>();
                if(searchCriteriaDTO.getTags().isEmpty()){
                    qualifiedStoryList.addAll(storyList);
                }
                else{
                    L1:for (Story x : storyList){
                        List<StoryTag> storyTags = x.getStoryTags();

                        List<String> tags = new ArrayList<>();
                        for(StoryTag y : storyTags){
                            tags.add(y.getTag().getTagName());
                        }
                        Collections.sort(tags);

                        List<String> searchedTags = searchCriteriaDTO.getTags();
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
                if(searchCriteriaDTO.getStoryCount()<=qualifiedStoryList.size()){
                    returnStoryCount = searchCriteriaDTO.getStoryCount();
                }
                else{
                    returnStoryCount = qualifiedStoryList.size();
                }

                List<Story> finalQulifiedStoryList = new ArrayList<>();
                for (int i = 0; i < returnStoryCount; i++) {
                    finalQulifiedStoryList.add(qualifiedStoryList.get(i));
                }

                GenreSearchResponseDTO genreSearchResponseDTO = new GenreSearchResponseDTO();

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
                genreSearchResponseDTO.setTotalStoriesCount(storyCountInStr);

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

                genreSearchResponseDTO.setTags(returnTags);
                genreSearchResponseDTO.setGenreStoryDTOList(genreStoryDTOList);

                return genreSearchResponseDTO;
            }
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}













