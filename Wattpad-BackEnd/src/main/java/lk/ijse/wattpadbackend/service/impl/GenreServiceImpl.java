package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.*;
import lk.ijse.wattpadbackend.entity.*;
import lk.ijse.wattpadbackend.exception.NotFoundException;
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

import java.util.*;

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

                if(qualifiedStoryList.size()>searchCriteriaDTO.getStoryCount()){
                    genreSearchResponseDTO.setAreMoreStoriesAvailable(1);
                }
                else{
                    genreSearchResponseDTO.setAreMoreStoriesAvailable(0);
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

    @Override
    public List<AdminGenreDTO> getAllGenreForAdmin() {

        try{
            List<Genre> genreList = genreRepository.findAll();

            List<AdminGenreDTO> adminGenreDTOList = new ArrayList<>();
            for (Genre x : genreList){
                AdminGenreDTO adminGenreDTO = new AdminGenreDTO();
                adminGenreDTO.setId(x.getId());
                adminGenreDTO.setGenre(x.getGenre());

                List<Story> storyList = storyRepository.findAllByCategory(x.getGenre());
                long totalStoryCountInGenre = storyList.size();

                String totalStoryCountInGenreInStr = "";
                if(totalStoryCountInGenre<=1000){
                    totalStoryCountInGenreInStr = String.valueOf(totalStoryCountInGenre);
                }
                else if (totalStoryCountInGenre >= 1000 && totalStoryCountInGenre < 1000000) {
                    double value = (double) totalStoryCountInGenre / 1000;
                    String vStr = String.valueOf(value);

                    if (vStr.endsWith(".0")) {
                        totalStoryCountInGenreInStr = vStr.split("\\.0")[0] + "K";
                    } else {
                        totalStoryCountInGenreInStr = vStr + "K";
                    }
                }
                else if(totalStoryCountInGenre>=1000000){
                    double value = (double) totalStoryCountInGenre/1000000;

                    String vStr = String.valueOf(value);

                    if (vStr.endsWith(".0")) {
                        totalStoryCountInGenreInStr = vStr.split("\\.0")[0] + "M";
                    } else {
                        totalStoryCountInGenreInStr = value+"M";
                    }
                }
                adminGenreDTO.setTotalStories(totalStoryCountInGenreInStr);

                long totalStories = storyRepository.findAll().size();

                double percentage = ((double) totalStoryCountInGenre / totalStories) * 100;
                String status = getGenreStatus(percentage);
                adminGenreDTO.setStatus(status);

                String percentageStr;
                if (percentage % 1 == 0) {
                    percentageStr = String.format("%.0f", percentage);
                } else {
                    percentageStr = String.format("%.1f", percentage);
                }
                adminGenreDTO.setPercentage(percentageStr);

                adminGenreDTOList.add(adminGenreDTO);
            }

            Collections.sort(adminGenreDTOList, Comparator.comparing(AdminGenreDTO::getId));
            return adminGenreDTOList;

        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void addNewGenre(String genre) {

        try{
           if(genreRepository.findByGenre(genre).isEmpty()){
               Genre genre1 = new Genre();
               genre1.setGenre(genre);
               genreRepository.save(genre1);
           }
           else{
               throw new RuntimeException("Genre Already Exit.");
           }
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public void removeAGenre(String genreId) {

        try{
            Optional<Genre> optionalGenre = genreRepository.findById(Integer.valueOf(genreId));
            if(!optionalGenre.isPresent()){
                throw new NotFoundException("Genre not found.");
            }
            Genre genre = optionalGenre.get();

            genreRepository.delete(genre);
            genreRepository.flush();
        }
        catch (NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void editAGenre(EditGenreDTO editGenreDTO) {

        try{
            Optional<Genre> optionalGenre = genreRepository.findById((int) editGenreDTO.getGenreId());
            if(!optionalGenre.isPresent()){
                throw new NotFoundException("Genre not found.");
            }
            Genre genre = optionalGenre.get();

            genre.setGenre(editGenreDTO.getGenre());
            genreRepository.save(genre);
        }
        catch (NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    public static String getGenreStatus(double percentage) {
        if (percentage >= 20) {
            return "Very High";
        } else if (percentage >= 15) {
            return "High";
        } else if (percentage >= 10) {
            return "Above Average";
        } else if (percentage >= 7) {
            return "Medium";
        } else if (percentage >= 4) {
            return "Below Average";
        } else if (percentage >= 2) {
            return "Low";
        } else if (percentage >= 1) {
            return "Very Low";
        } else if (percentage >= 0.5) {
            return "Rare";
        } else {
            return "Niche / Extreme Niche";
        }
    }

}













