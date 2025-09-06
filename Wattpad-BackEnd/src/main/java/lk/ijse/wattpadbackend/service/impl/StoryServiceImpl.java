package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.ChapterSimpleDTO;
import lk.ijse.wattpadbackend.dto.StoryDTO;
import lk.ijse.wattpadbackend.dto.StoryRequestDTO;
import lk.ijse.wattpadbackend.entity.*;
import lk.ijse.wattpadbackend.exception.NotFoundException;
import lk.ijse.wattpadbackend.exception.UserNotFoundException;
import lk.ijse.wattpadbackend.repository.StoryRepository;
import lk.ijse.wattpadbackend.repository.StoryTagRepository;
import lk.ijse.wattpadbackend.repository.TagRepository;
import lk.ijse.wattpadbackend.repository.UserRepository;
import lk.ijse.wattpadbackend.service.StoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StoryServiceImpl implements StoryService {

    private final StoryRepository storyRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final StoryTagRepository storyTagRepository;

    @Override
    public StoryDTO getAStoryById(long id) {

        try{
            Optional<Story> storyOptional = storyRepository.findById((int) id);

            if(!storyOptional.isPresent()){
                throw new NotFoundException("Story not found.");
            }

            Story story = storyOptional.get();

            if(story.getPublishedOrDraft()==0){
                throw new NotFoundException("Story not found.");
            }

            StoryDTO storyDTO = new StoryDTO();
            storyDTO.setId(story.getId());
            storyDTO.setTitle(story.getTitle());
            storyDTO.setDescription(story.getDescription());
            storyDTO.setCopyright(story.getCopyright());
            storyDTO.setParts(story.getParts());

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

            storyDTO.setLikes(likesInStr);

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

            storyDTO.setViews(viewsInStr);

            storyDTO.setRating(story.getRating());
            storyDTO.setStatus(story.getStatus());
            storyDTO.setCoverImagePath(story.getCoverImagePath());
            storyDTO.setUserId(story.getUser().getId());
            storyDTO.setUsername(story.getUser().getUsername());
            storyDTO.setProfilePicPath(story.getUser().getProfilePicPath());

            List<StoryTag> storyTagList = story.getStoryTags();
            List<String> tags = new ArrayList<>();
            for(StoryTag x : storyTagList){
                tags.add(x.getTag().getTagName());
            }

            storyDTO.setTags(tags);

            List<Chapter> characterList = story.getChapters();
            List<ChapterSimpleDTO> chapterSimpleDTOList = new ArrayList<>();
            for(Chapter x : characterList){
                if(x.getPublishedOrDraft()==0){
                    continue;
                }

                ChapterSimpleDTO chapterSimpleDTO = new ChapterSimpleDTO();
                chapterSimpleDTO.setId(x.getId());
                chapterSimpleDTO.setTitle(x.getTitle());

                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE, MMMM d yyyy");
                chapterSimpleDTO.setPublishedDate(x.getPublishedDate().format(formatter));

                chapterSimpleDTOList.add(chapterSimpleDTO);
            }

            storyDTO.setChapterSimpleDTOList(chapterSimpleDTOList);

            return storyDTO;

        }
        catch (NotFoundException e) {
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public long createANewStory(String username, StoryRequestDTO storyRequestDTO) {

        try{
            User user = userRepository.findByUsername(username);
            if(user==null){
                throw new UserNotFoundException("User not found.");
            }

            Story story = new Story();
            story.setTitle(storyRequestDTO.getTitle());
            story.setDescription(storyRequestDTO.getDescription());
            story.setCoverImagePath(storyRequestDTO.getCoverImagePath());
            story.setCategory(storyRequestDTO.getCategory());
            story.setCopyright(storyRequestDTO.getCopyright());
            story.setLanguage(storyRequestDTO.getLanguage());
            story.setTargetAudience(storyRequestDTO.getTargetAudience());
            story.setUser(user);
            story.setPublishedOrDraft(0);
            story.setRating(storyRequestDTO.getRating());
            story.setStatus(storyRequestDTO.getStatus());

            String mainCharacters = "";
            for (String x :storyRequestDTO.getCharacters()){
                mainCharacters += x+",";
            }
            if (!mainCharacters.isEmpty()) {
                mainCharacters = mainCharacters.substring(0, mainCharacters.length() - 1);
            }
            story.setMainCharacters(mainCharacters);

            String[] ar = storyRequestDTO.getTags().split(",");
            for (String x : ar){
                Tag tag = tagRepository.findByTagName(x);
                if(tag==null){
                    Tag tag1 = new Tag();
                    tag1.setTagName(x);
                    tagRepository.save(tag1);
                }
            }

            Story story1 = storyRepository.save(story);

            for (String x : ar){
                Tag tag = tagRepository.findByTagName(x);

                StoryTag storyTag = new StoryTag();
                storyTag.setStory(story1);
                storyTag.setTag(tag);

                storyTagRepository.save(storyTag);
            }

            return story1.getId();

        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}






































