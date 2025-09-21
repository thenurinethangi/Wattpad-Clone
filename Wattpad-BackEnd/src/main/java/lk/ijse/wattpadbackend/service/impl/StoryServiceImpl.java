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

import java.math.BigInteger;
import java.time.LocalDate;
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
    private final UserBlockRepository userBlockRepository;
    private final UserWattpadOriginalStoryRepository userWattpadOriginalStoryRepository;
    private final UserWattpadOriginalChapterRepository userWattpadOriginalChapterRepository;
    private final ChapterLikeRepository chapterLikeRepository;

    @Override
    public StoryDTO getAStoryById(String username, long id) {

        try{
            User currentUser = userRepository.findByUsername(username);
            if(currentUser==null){
                throw new UserNotFoundException("User not found.");
            }

            Optional<Story> storyOptional = storyRepository.findById((int) id);

            if(!storyOptional.isPresent()){
                throw new NotFoundException("Story not found.");
            }

            Story story = storyOptional.get();

            if(story.getPublishedOrDraft()==0 && currentUser.getId()!=story.getUser().getId()){
                throw new NotFoundException("Story not found./Draft");
            }

            StoryDTO storyDTO = new StoryDTO();
            storyDTO.setId(story.getId());
            storyDTO.setTitle(story.getTitle());
            storyDTO.setDescription(story.getDescription());
            storyDTO.setCopyright(story.getCopyright());
            storyDTO.setParts(BigInteger.valueOf(chapterRepository.findAllByStory(story).size()));
            storyDTO.setIsWattpadOriginal(story.getIsWattpadOriginal());

            long count2 = 0;
            for(Chapter b : story.getChapters()){
                count2+=chapterLikeRepository.findAllByChapter(b).size();
            }
            long likesLong = count2;

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

            long count1 = 0;
            List<Chapter> chapters = story.getChapters();
            for (Chapter a : chapters){
                count1+=a.getViews();
            }
            long viewsLong = count1;

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
                if(x.getPublishedOrDraft()==0 && currentUser.getId()!=story.getUser().getId()){
                    continue;
                }

                ChapterSimpleDTO chapterSimpleDTO = new ChapterSimpleDTO();
                chapterSimpleDTO.setId(x.getId());
                chapterSimpleDTO.setTitle(x.getTitle());
                chapterSimpleDTO.setIsPublishedOrDraft(x.getPublishedOrDraft());
                chapterSimpleDTO.setChapterCoins(x.getCoinsAmount());

                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE, MMMM d yyyy");
                chapterSimpleDTO.setPublishedDate(x.getPublishedDate().format(formatter));

                List<UserWattpadOriginalStory> userWattpadOriginalStoryList = userWattpadOriginalStoryRepository.findByStoryAndUser(x.getStory(),currentUser);
                if(userWattpadOriginalStoryList.isEmpty()){

                    List<UserWattpadOriginalChapter> userWattpadOriginalChapterList = userWattpadOriginalChapterRepository.findByChapterAndUser(x,currentUser);
                    if(userWattpadOriginalChapterList.isEmpty()){
                        chapterSimpleDTO.setIsUnlocked(0);
                    }
                    else{
                        chapterSimpleDTO.setIsUnlocked(1);
                    }
                }
                else{
                    chapterSimpleDTO.setIsUnlocked(1);
                }

                if(x.getStory().getUser().getId()==currentUser.getId()){
                    chapterSimpleDTO.setIsUnlocked(1);
                }

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
            story.setIsWattpadOriginal(storyCreateDTO.getIsWattpadOriginal());
            story.setCoinsAmount(storyCreateDTO.getCoinsAmount());

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

    @Override
    public boolean publishedStoryByStoryId(String username, long storyId) {

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

            List<Chapter> chapterList = story.getChapters();
            int count = 0;
            for (Chapter x : chapterList){
                if(x.getPublishedOrDraft()==1){
                    count++;
                }
            }

            if(count>=1){
                story.setPublishedOrDraft(1);
                storyRepository.save(story);
                return true;
            }
            return false;
        }
        catch (AccessDeniedException | NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public AdminStoryResponseDTO loadStoriesForAdminBySortingCriteria(long no, AdminStoryRequestDTO adminStoryRequestDTO) {

        try{
            List<Story> storyList = storyRepository.findAll();

            AdminStoryResponseDTO adminStoryResponseDTO = new AdminStoryResponseDTO();
            adminStoryResponseDTO.setTotalStories(storyList.size());

            for (Story x : storyList){
                long totalViews = 0;
                long totalLikes = 0;

                totalViews+=x.getViews().longValue();

                List<Chapter> chapterList = x.getChapters();
                for (Chapter z : chapterList){
                    List<ChapterLike> chapterLikeList = z.getChapterLikes();
                    totalLikes+=chapterLikeList.size();
                }

                long total = totalViews+totalLikes;
                x.setTotalViewsAndLikes(total);
            }

            List<Story> tempForAddRank = new ArrayList<>();
            tempForAddRank.addAll(storyList);
            tempForAddRank.sort(
                    Comparator.comparingLong(Story::getTotalViewsAndLikes).reversed()
            );
            int count = 1;
            for (Story a : tempForAddRank){
                a.setRank(count);
                count++;
            }

            List<Story> sortAfterStatus = new ArrayList<>();
            for (Story x : storyList){
                if(adminStoryRequestDTO.getStatus().equals("all")){
                    sortAfterStatus.add(x);
                }
                else if (adminStoryRequestDTO.getStatus().equals("published")) {
                    if(x.getPublishedOrDraft()==1){
                        sortAfterStatus.add(x);
                    }
                }
                else if (adminStoryRequestDTO.getStatus().equals("draft")) {
                    if(x.getPublishedOrDraft()==0){
                        sortAfterStatus.add(x);
                    }
                }
            }

            List<Story> sortAfterType = new ArrayList<>();
            for (Story x : sortAfterStatus){
                if(adminStoryRequestDTO.getType().equals("all")){
                    sortAfterType.add(x);
                }
                else if (adminStoryRequestDTO.getType().equals("original")) {
                    if(x.getIsWattpadOriginal()==1){
                        sortAfterType.add(x);
                    }
                }
                else if (adminStoryRequestDTO.getType().equals("normal")) {
                    if(x.getIsWattpadOriginal()==0){
                        sortAfterType.add(x);
                    }
                }
            }

            List<Story> sortAfterRank = new ArrayList<>();
            if(adminStoryRequestDTO.getRank().equals("all")){
                for (Story x : sortAfterType) {
                    long totalViews = 0;
                    long totalLikes = 0;

                    totalViews+=x.getViews().longValue();

                    List<Chapter> chapterList = x.getChapters();
                    for (Chapter z : chapterList){
                        List<ChapterLike> chapterLikeList = z.getChapterLikes();
                        totalLikes+=chapterLikeList.size();
                    }

                    long total = totalViews+totalLikes;
                    x.setTotalViewsAndLikes(total);
                    x.setTotalLikes(totalLikes);
                    x.setTotalViews(totalViews);
                    sortAfterRank.add(x);
                }
            }
            else {
                List<Story> storyListAfterCalculateTotalViewsAndLikes = new ArrayList<>();
                for (Story x : sortAfterType) {
                    long totalViews = 0;
                    long totalLikes = 0;

                    totalViews+=x.getViews().longValue();

                    List<Chapter> chapterList = x.getChapters();
                    for (Chapter z : chapterList){
                        List<ChapterLike> chapterLikeList = z.getChapterLikes();
                        totalLikes+=chapterLikeList.size();
                    }

                    long total = totalViews+totalLikes;
                    x.setTotalViewsAndLikes(total);
                    x.setTotalLikes(totalLikes);
                    x.setTotalViews(totalViews);
                    storyListAfterCalculateTotalViewsAndLikes.add(x);
                }

                if(adminStoryRequestDTO.getRank().equals("top")){
                    storyListAfterCalculateTotalViewsAndLikes.sort(
                            Comparator.comparingLong(Story::getTotalViewsAndLikes).reversed()
                    );
                    sortAfterRank.addAll(storyListAfterCalculateTotalViewsAndLikes);
                }
                else if(adminStoryRequestDTO.getRank().equals("bottom")){
                    storyListAfterCalculateTotalViewsAndLikes.sort(
                            Comparator.comparingLong(Story::getTotalViewsAndLikes)
                    );
                    sortAfterRank.addAll(storyListAfterCalculateTotalViewsAndLikes);
                }
            }

            List<Story> sortAfterReport = new ArrayList<>();
            if(adminStoryRequestDTO.getReport().equals("all")){
                sortAfterReport.addAll(sortAfterRank);
            }
            else{
                List<Story> sortListByReport = new ArrayList<>();
                sortListByReport.addAll(sortAfterRank);
                if(adminStoryRequestDTO.getReport().equals("most")){
                    sortListByReport.sort(
                            Comparator.comparingInt((Story s) -> s.getStoryReports().size()).reversed()
                    );
                }
                else{
                    sortListByReport.sort(
                            Comparator.comparingInt((Story s) -> s.getStoryReports().size())
                    );
                }
                sortAfterReport.addAll(sortListByReport);
            }

            long end = (no*12)-1;
            long start = ((end+1)-12);

            List<Story> sortAfterCount = new ArrayList<>();
            if(sortAfterReport.size()>start){
                for (long i = start; i <= end; i++) {
                    if(i<sortAfterReport.size()){
                        sortAfterCount.add(sortAfterReport.get((int) i));
                    }
                    else{
                        break;
                    }
                }
            }

            adminStoryResponseDTO.setStart(start+1);
            adminStoryResponseDTO.setEnd(end+1);

            List<AdminStoryDTO> adminStoryDTOS = new ArrayList<>();
            for (Story x : sortAfterCount){
                AdminStoryDTO adminStoryDTO = new AdminStoryDTO();
                adminStoryDTO.setId(x.getId());
                adminStoryDTO.setTitle(x.getTitle());
                adminStoryDTO.setStatus(x.getPublishedOrDraft());
                adminStoryDTO.setCoverImagePath(x.getCoverImagePath());
                adminStoryDTO.setIsOriginal(x.getIsWattpadOriginal());
                adminStoryDTO.setPublishedDate(LocalDate.from(x.getCreatedAt()));
                adminStoryDTO.setUserId(x.getUser().getId());
                adminStoryDTO.setUsername(x.getUser().getUsername());
                adminStoryDTO.setGenre(x.getCategory());
                adminStoryDTO.setRank(String.valueOf(x.getRank()));
                adminStoryDTO.setTotalReports(String.valueOf(x.getStoryReports().size()));
                adminStoryDTO.setRecentReports(String.valueOf(x.getStoryReports().size()));

                long viewsLong = x.getTotalViews();

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
                adminStoryDTO.setViews(viewsInStr);

                long likesLong = x.getTotalLikes();

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
                adminStoryDTO.setLikes(likesInStr);

                adminStoryDTO.setParts(BigInteger.valueOf(x.getChapters().size()));

                long totalComments = 0;
                for (Chapter w : x.getChapters()){
                    totalComments+=w.getChapterComments().size();
                    for (Paragraph q : w.getParagraphs()){
                        totalComments+=q.getParagraphComments().size();
                    }
                }
                adminStoryDTO.setComments(String.valueOf(totalComments));

                adminStoryDTOS.add(adminStoryDTO);
            }

            adminStoryResponseDTO.setAdminStoryDTOList(adminStoryDTOS);
            return adminStoryResponseDTO;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public StoryDTO storyUnpublishByAdmin(long storyId) {

        try{
            Optional<Story> optionalStory = storyRepository.findById((int) storyId);
            if(!optionalStory.isPresent()){
                throw new NotFoundException("Story not found.");
            }
            Story story = optionalStory.get();

            //here must send email for author telling that admin panel of wattpad unpublished there story
            story.setPublishedOrDraft(0);
            storyRepository.save(story);

            StoryDTO storyDTO = new StoryDTO();
            storyDTO.setTitle(story.getTitle());
            storyDTO.setUsername(story.getUser().getUsername());
            storyDTO.setUserEmail(story.getUser().getEmail());
            return storyDTO;
        }
        catch (NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean checkThisStoryRestrictedToCurrentUserOrNot(String name, long storyId) {

        try{
            User currentUser = userRepository.findByUsername(name);
            if(currentUser==null){
                throw new UserNotFoundException("User not found.");
            }

            Optional<Story> optionalStory = storyRepository.findById((int) storyId);
            if(!optionalStory.isPresent()){
                throw new NotFoundException("Story not found.");
            }
            Story story = optionalStory.get();

            UserBlock userBlock = userBlockRepository.findByBlockedByUserAndBlockedUser(story.getUser(),currentUser);
            if(userBlock!=null){
                return true;
            }
            else{
                return false;
            }

        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}






































