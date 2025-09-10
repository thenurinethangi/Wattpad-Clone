package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.*;
import lk.ijse.wattpadbackend.entity.*;
import lk.ijse.wattpadbackend.exception.AccessDeniedException;
import lk.ijse.wattpadbackend.exception.NotFoundException;
import lk.ijse.wattpadbackend.exception.UserNotFoundException;
import lk.ijse.wattpadbackend.repository.*;
import lk.ijse.wattpadbackend.service.StoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class StoryServiceImpl implements StoryService {

    private final StoryRepository storyRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final StoryTagRepository storyTagRepository;
    private final ChapterRepository chapterRepository;
    private final ParagraphCommentRepository paragraphCommentRepository;
    private final ChapterCommentRepository chapterCommentRepository;

    @Override
    public StoryDTO getAStoryById(long id) {

        try{
            Optional<Story> storyOptional = storyRepository.findById((int) id);

            if(!storyOptional.isPresent()){
                throw new NotFoundException("Story not found.");
            }

            Story story = storyOptional.get();

//            if(story.getPublishedOrDraft()==0){
//                throw new NotFoundException("Story not found.");
//            }

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
    public StoryDTO getAStoryByIdTwo(long id) {

        try{
            Optional<Story> storyOptional = storyRepository.findById((int) id);

            if(!storyOptional.isPresent()){
                throw new NotFoundException("Story not found.");
            }

            Story story = storyOptional.get();

            StoryDTO storyDTO = new StoryDTO();
            storyDTO.setId(story.getId());
            storyDTO.setTitle(story.getTitle());
            storyDTO.setCoverImagePath(story.getCoverImagePath());

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
    public CreateStoryResponseDTO createANewStory(String username, StoryCreateDTO storyCreateDTO) {

        try{
            User user = userRepository.findByUsername(username);
            if(user==null){
                throw new UserNotFoundException("User not found.");
            }

            Story story = new Story();
            story.setTitle(storyCreateDTO.getTitle());
            story.setDescription(storyCreateDTO.getDescription());
            story.setCoverImagePath(storyCreateDTO.getCoverImagePath());
            story.setCategory(storyCreateDTO.getCategory());
            story.setCopyright(storyCreateDTO.getCopyright());
            story.setLanguage(storyCreateDTO.getLanguage());
            story.setTargetAudience(storyCreateDTO.getTargetAudience());
            story.setUser(user);
            story.setPublishedOrDraft(0);
            story.setRating(storyCreateDTO.getRating());
            story.setStatus(storyCreateDTO.getStatus());

            String mainCharacters = "";
            for (String x : storyCreateDTO.getCharacters()){
                mainCharacters += x+",";
            }
            if (!mainCharacters.isEmpty()) {
                mainCharacters = mainCharacters.substring(0, mainCharacters.length() - 1);
            }
            story.setMainCharacters(mainCharacters);

            String[] ar = storyCreateDTO.getTags().split(",");
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

            Chapter chapter = new Chapter();
            chapter.setStory(story1);
            chapter.setTitle("Untitled Part 1");
            chapter.setPublishedOrDraft(0);
            Chapter chapter1 = chapterRepository.save(chapter);

            CreateStoryResponseDTO createStoryResponseDTO = new CreateStoryResponseDTO();
            createStoryResponseDTO.setStoryId(story1.getId());
            createStoryResponseDTO.setChapterId(chapter1.getId());

            return createStoryResponseDTO;

        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<MyStorySingleStoryDTO> loadPublishedStoriesOfCurrentUser(String username) {

        try {
            User user = userRepository.findByUsername(username);
            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            List<Story> storyList = storyRepository.findAllByUserAndPublishedOrDraft(user,1);

            List<MyStorySingleStoryDTO> myStorySingleStoryDTOList = new ArrayList<>();
            for (Story x : storyList){
                MyStorySingleStoryDTO dto = new MyStorySingleStoryDTO();
                dto.setStoryId(x.getId());
                dto.setStoryTitle(x.getTitle());
                dto.setStoryCoverImagePath(x.getCoverImagePath());
                dto.setParts(x.getParts().longValue());

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
                dto.setLikes(likesInStr);

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
                dto.setViews(viewsInStr);

                long publishedCount = 0;
                long draftCount = 0;
                List<Chapter> chapterList = x.getChapters();
                for (Chapter y : chapterList){
                    if(y.getPublishedOrDraft()==1){
                        publishedCount++;
                    }
                    else {
                        draftCount++;
                    }
                }

                dto.setPublishedPartsCount(publishedCount);
                dto.setDraftPartsCount(draftCount);

                //here should implement last edited time of story
                dto.setLastUpdate("12 minutes go");

                myStorySingleStoryDTOList.add(dto);
            }

            return myStorySingleStoryDTOList;

        }
        catch (UserNotFoundException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<MyStorySingleStoryDTO> loadAllStoriesOfCurrentUser(String username) {

        try {
            User user = userRepository.findByUsername(username);
            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            List<Story> storyList = storyRepository.findAllByUser(user);

            List<MyStorySingleStoryDTO> myStorySingleStoryDTOList = new ArrayList<>();
            for (Story x : storyList){
                MyStorySingleStoryDTO dto = new MyStorySingleStoryDTO();
                dto.setStoryId(x.getId());
                dto.setStoryTitle(x.getTitle());
                dto.setStoryCoverImagePath(x.getCoverImagePath());
                dto.setParts(x.getParts().longValue());
                dto.setPublishedOrDraft(x.getPublishedOrDraft());

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
                dto.setLikes(likesInStr);

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
                dto.setViews(viewsInStr);

                long publishedCount = 0;
                long draftCount = 0;
                List<Chapter> chapterList = x.getChapters();
                for (Chapter y : chapterList){
                    if(y.getPublishedOrDraft()==1){
                        publishedCount++;
                    }
                    else {
                        draftCount++;
                    }
                }

                dto.setPublishedPartsCount(publishedCount);
                dto.setDraftPartsCount(draftCount);

                //here should implement last edited time of story
                dto.setLastUpdate("12 minutes go");

                myStorySingleStoryDTOList.add(dto);
            }

            return myStorySingleStoryDTOList;

        }
        catch (UserNotFoundException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean checkIfStoryIsOwnedByCurrentUser(String username, long storyId) {

        try {
            User user = userRepository.findByUsername(username);
            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            List<Story> storyList = storyRepository.findAllByUser(user);
            for(Story x : storyList){
                if(x.getId()==storyId){
                    return true;
                }
            }
            return false;

        }
        catch (UserNotFoundException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<EditStoryChapterDTO> loadAllChaptersOfAStoryByStoryId(long storyId) {

        try{
            Optional<Story> optionalStory = storyRepository.findById((int) storyId);
            if(!optionalStory.isPresent()){
                throw new NotFoundException("Story not found.");
            }
            Story story = optionalStory.get();

            List<Chapter> chapterList = story.getChapters();

            List<EditStoryChapterDTO> editStoryChapterDTOList = new ArrayList<>();
            for(Chapter x : chapterList){
                EditStoryChapterDTO dto = new EditStoryChapterDTO();
                dto.setChapterId(x.getId());
                dto.setChapterTitle(x.getTitle());
                dto.setPublishedOrDraft(x.getPublishedOrDraft());

                long likesLong = x.getLikes();

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
                dto.setLikes(likesInStr);

                long viewsLong = x.getViews();

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
                dto.setViews(viewsInStr);

                long totalComments = 0;
                List<ChapterComment> chapterCommentList = chapterCommentRepository.findAllByChapter(x);
                totalComments+=chapterCommentList.size();

                List<Paragraph> paragraphList = x.getParagraphs();
                for (Paragraph y : paragraphList){
                    totalComments+=y.getParagraphComments().size();
                }

                long commentsLong = totalComments;

                String commentsInStr = "";
                if(commentsLong<=1000){
                    commentsInStr = String.valueOf(commentsLong);
                }
                else if (commentsLong >= 1000 && commentsLong < 1000000) {
                    double value = (double) commentsLong / 1000;
                    String vStr = String.valueOf(value);

                    if (vStr.endsWith(".0")) {
                        commentsInStr = vStr.split("\\.0")[0] + "K";
                    } else {
                        commentsInStr = vStr + "K";
                    }
                }
                else if(commentsLong>=1000000){
                    double value = (double) commentsLong/1000000;

                    String vStr = String.valueOf(value);

                    if (vStr.endsWith(".0")) {
                        commentsInStr = vStr.split("\\.0")[0] + "M";
                    } else {
                        commentsInStr = value+"M";
                    }
                }
                dto.setComments(commentsInStr);

                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");
                String formattedDate = x.getPublishedDate().format(formatter);

                dto.setPublishedDate(formattedDate);

                editStoryChapterDTOList.add(dto);
            }

            return editStoryChapterDTOList;

        }
        catch (NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public StoryCreateDTO loadStoryDetailsByStoryId(long storyId) {

        try {
            Optional<Story> optionalStory = storyRepository.findById((int) storyId);
            if (!optionalStory.isPresent()) {
                throw new NotFoundException("Story not found.");
            }
            Story story = optionalStory.get();

            StoryCreateDTO storyCreateDTO = new StoryCreateDTO();
            storyCreateDTO.setId(story.getId());
            storyCreateDTO.setTitle(story.getTitle());
            storyCreateDTO.setCategory(story.getCategory());
            storyCreateDTO.setLanguage(story.getLanguage());
            storyCreateDTO.setCopyright(story.getCopyright());
            storyCreateDTO.setDescription(story.getDescription());
            storyCreateDTO.setStatus(story.getStatus());
            storyCreateDTO.setRating(story.getRating());
            storyCreateDTO.setTargetAudience(story.getTargetAudience());
            storyCreateDTO.setCoverImagePath(story.getCoverImagePath());
            storyCreateDTO.setCharacters(Arrays.asList(story.getMainCharacters().split(",")));

            StringJoiner joiner = new StringJoiner(",");
            for (StoryTag x : story.getStoryTags()) {
                joiner.add(x.getTag().getTagName());
            }
            String tags = joiner.toString();
            storyCreateDTO.setTags(tags);

            return storyCreateDTO;

        }
        catch (NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public void updateAStory(String username, StoryCreateDTO storyCreateDTO) {

        try{
            User user = userRepository.findByUsername(username);
            if(user==null){
                throw new UserNotFoundException("User not found.");
            }

            boolean bool = false;
            List<Story> storyList = user.getStories();
            for(Story x : storyList){
                if(x.getId()==storyCreateDTO.getId()){
                    bool = true;
                    break;
                }
            }
            if(!bool){
                throw new AccessDeniedException("You haven't not access to this function");
            }

            Optional<Story> storyOptional = storyRepository.findById((int) storyCreateDTO.getId());
            if(!storyOptional.isPresent()){
                throw new NotFoundException("Story not found.");
            }
            Story story = storyOptional.get();

            story.setTitle(storyCreateDTO.getTitle());
            story.setDescription(storyCreateDTO.getDescription());
            story.setCoverImagePath(storyCreateDTO.getCoverImagePath());
            story.setCategory(storyCreateDTO.getCategory());
            story.setCopyright(storyCreateDTO.getCopyright());
            story.setLanguage(storyCreateDTO.getLanguage());
            story.setTargetAudience(storyCreateDTO.getTargetAudience());
            story.setRating(storyCreateDTO.getRating());
            story.setStatus(storyCreateDTO.getStatus());

            String mainCharacters = "";
            for (String x : storyCreateDTO.getCharacters()){
                mainCharacters += x+",";
            }
            if (!mainCharacters.isEmpty()) {
                mainCharacters = mainCharacters.substring(0, mainCharacters.length() - 1);
            }
            story.setMainCharacters(mainCharacters);

            storyTagRepository.deleteByStory(story);

            String[] ar = storyCreateDTO.getTags().split(",");
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
        }
        catch (AccessDeniedException | NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void unpublishedStoryByStoryId(String username, long storyId) {

        try {
            User user = userRepository.findByUsername(username);
            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            boolean bool = false;
            List<Story> storyList = user.getStories();
            for (Story x : storyList) {
                if (x.getId() == storyId) {
                    bool = true;
                    break;
                }
            }
            if (!bool) {
                throw new AccessDeniedException("You haven't not access to this function");
            }

            Optional<Story> storyOptional = storyRepository.findById((int) storyId);
            if (!storyOptional.isPresent()) {
                throw new NotFoundException("Story not found.");
            }
            Story story = storyOptional.get();

            story.setPublishedOrDraft(0);
            storyRepository.save(story);
        }
        catch (AccessDeniedException | NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public void deleteStoryByStoryId(String username, long storyId) {

        try {
            User user = userRepository.findByUsername(username);
            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            boolean bool = false;
            List<Story> storyList = user.getStories();
            for (Story x : storyList) {
                if (x.getId() == storyId) {
                    bool = true;
                    break;
                }
            }
            if (!bool) {
                throw new AccessDeniedException("You haven't not access to this function");
            }

            Optional<Story> storyOptional = storyRepository.findById((int) storyId);
            if (!storyOptional.isPresent()) {
                throw new NotFoundException("Story not found.");
            }
            Story story = storyOptional.get();

            storyRepository.delete(story);
            storyRepository.flush();
        }
        catch (AccessDeniedException | NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}






































