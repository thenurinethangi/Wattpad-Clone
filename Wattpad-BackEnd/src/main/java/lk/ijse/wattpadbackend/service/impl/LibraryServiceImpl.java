package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.LibraryStoryDTO;
import lk.ijse.wattpadbackend.entity.*;
import lk.ijse.wattpadbackend.exception.NotFoundException;
import lk.ijse.wattpadbackend.exception.UserNotFoundException;
import lk.ijse.wattpadbackend.repository.*;
import lk.ijse.wattpadbackend.service.LibraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LibraryServiceImpl implements LibraryService {

    private final LibraryRepository libraryRepository;
    private final UserRepository userRepository;
    private final LibraryStoryRepository libraryStoryRepository;
    private final ChapterRepository chapterRepository;
    private final StoryRepository storyRepository;
    private final ChapterLikeRepository chapterLikeRepository;

    @Override
    public List<LibraryStoryDTO> getLibraryStories(String name) {

        try {
            User user = userRepository.findByUsername(name);

            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            Library library = libraryRepository.findByUser(user);
            List<LibraryStory> libraryStories = library.getLibraryStories();

            List<LibraryStoryDTO> libraryStoryDTOList = new ArrayList<>();
            for(LibraryStory x : libraryStories){
                LibraryStoryDTO libraryStoryDTO = new LibraryStoryDTO();

                libraryStoryDTO.setStoryId(x.getStory().getId());
                libraryStoryDTO.setStoryTitle(x.getStory().getTitle());
                libraryStoryDTO.setStoryCoverImagePath(x.getStory().getCoverImagePath());
                libraryStoryDTO.setTotalParts(x.getStory().getParts().longValue());

                long count1 = 0;
                List<Chapter> chapters = x.getStory().getChapters();
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
                libraryStoryDTO.setViews(viewsInStr);

                long count2 = 0;
                for(Chapter b : x.getStory().getChapters()){
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
                libraryStoryDTO.setLikes(likesInStr);

                libraryStoryDTO.setUserId(x.getStory().getUser().getId());
                libraryStoryDTO.setUsername(x.getStory().getUser().getUsername());
                libraryStoryDTO.setUserProfilePicPath(x.getStory().getUser().getProfilePicPath());
                libraryStoryDTO.setLastOpenedChapterSequenceNo(x.getLastOpenedPage());

                List<Chapter> chapterList = x.getStory().getChapters();
                Long lastOpenedChapterId = null;
                for (int i = 0; i < chapterList.size(); i++) {
                    if((i+1)==x.getLastOpenedPage()){
                       lastOpenedChapterId = chapterList.get(i).getId();
                    }
                }
                libraryStoryDTO.setLastOpenedChapterId(lastOpenedChapterId);

                libraryStoryDTOList.add(libraryStoryDTO);
            }

            Collections.reverse(libraryStoryDTOList);
            return libraryStoryDTOList;

        }
        catch (UserNotFoundException e) {
            throw e;
        }
        catch (RuntimeException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    @Override
    public void deleteAStoryInLibraryByStoryId(String name, long storyId) {

        try {
            User user = userRepository.findByUsername(name);

            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            Library library = libraryRepository.findByUser(user);
            List<LibraryStory> libraryStories = library.getLibraryStories();

            boolean bool = false;
            for (LibraryStory x : libraryStories){
                long id = x.getStory().getId();
                if(id==storyId){
                    bool = true;
                    libraryStoryRepository.delete(x);
                }
            }

            if(!bool){
                throw new NotFoundException("Story not found in given id in your library.");
            }

        }
        catch (UserNotFoundException e) {
            throw e;
        }
        catch (RuntimeException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean checkSpecificStoryExitInTheLibraryByChapterId(String name, long chapterId) {

        try {
            User user = userRepository.findByUsername(name);
            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            Optional<Chapter> optionalChapter = chapterRepository.findById((int) chapterId);
            if(!optionalChapter.isPresent()){
                throw new NotFoundException("Chapter not found.");
            }
            Chapter chapter = optionalChapter.get();
            Story story = chapter.getStory();

            Library library = libraryRepository.findByUser(user);
            List<LibraryStory> libraryStoryList = library.getLibraryStories();
            for (LibraryStory x : libraryStoryList){
                if(x.getStory().getId()==story.getId()){
                    return true;
                }
            }

            return false;
        }
        catch (UserNotFoundException e) {
            throw e;
        }
        catch (RuntimeException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }

    }

    @Override
    @Transactional
    public void addStoryToLibraryByChapterId(String name, long chapterId) {

        try {
            User user = userRepository.findByUsername(name);
            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            Optional<Chapter> optionalChapter = chapterRepository.findById((int) chapterId);
            if (!optionalChapter.isPresent()) {
                throw new NotFoundException("Chapter not found.");
            }
            Chapter chapter = optionalChapter.get();
            Story story = chapter.getStory();
            System.out.println(story);

            Library library = libraryRepository.findByUser(user);
            System.out.println(library);
            List<LibraryStory> libraryStoryList = library.getLibraryStories();
            for (LibraryStory x : libraryStoryList){
                if(x.getStory().getId()==story.getId()){
                    System.out.println("delete");
                    libraryStoryRepository.deleteById((int) x.getId());
                    libraryStoryRepository.flush();
                    return;
                }
            }

            System.out.println("add");
            LibraryStory libraryStory = new LibraryStory();
            libraryStory.setStory(story);
            libraryStory.setLibrary(library);
            libraryStoryRepository.save(libraryStory);
            return;
        }
        catch (UserNotFoundException e) {
            throw e;
        }
        catch (RuntimeException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean checkSpecificStoryExitInTheLibraryByStoryId(String name, long storyId) {

        try {
            User user = userRepository.findByUsername(name);
            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            Optional<Story> optionalStory = storyRepository.findById((int) storyId);
            if(!optionalStory.isPresent()){
                throw new NotFoundException("Story not found.");
            }
            Story story = optionalStory.get();

            Library library = libraryRepository.findByUser(user);
            List<LibraryStory> libraryStoryList = library.getLibraryStories();
            for (LibraryStory x : libraryStoryList){
                if(x.getStory().getId()==story.getId()){
                    return true;
                }
            }

            return false;
        }
        catch (UserNotFoundException e) {
            throw e;
        }
        catch (RuntimeException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    @Override
    public void addOrRemoveStoryToLibraryByStoryId(String name, long storyId) {

        try {
            User user = userRepository.findByUsername(name);
            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            Optional<Story> optionalStory = storyRepository.findById((int) storyId);
            if (!optionalStory.isPresent()) {
                throw new NotFoundException("Story not found.");
            }
            Story story = optionalStory.get();

            Library library = libraryRepository.findByUser(user);
            List<LibraryStory> libraryStoryList = library.getLibraryStories();
            for (LibraryStory x : libraryStoryList){
                if(x.getStory().getId()==story.getId()){
                    System.out.println("delete");
                    libraryStoryRepository.deleteById((int) x.getId());
                    libraryStoryRepository.flush();
                    return;
                }
            }

            System.out.println("add");
            LibraryStory libraryStory = new LibraryStory();
            libraryStory.setStory(story);
            libraryStory.setLibrary(library);
            libraryStoryRepository.save(libraryStory);
            return;
        }
        catch (UserNotFoundException e) {
            throw e;
        }
        catch (RuntimeException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
}






















