package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.LibraryStoryDTO;
import lk.ijse.wattpadbackend.entity.Chapter;
import lk.ijse.wattpadbackend.entity.Library;
import lk.ijse.wattpadbackend.entity.LibraryStory;
import lk.ijse.wattpadbackend.entity.User;
import lk.ijse.wattpadbackend.exception.NotFoundException;
import lk.ijse.wattpadbackend.exception.UserNotFoundException;
import lk.ijse.wattpadbackend.repository.LibraryRepository;
import lk.ijse.wattpadbackend.repository.LibraryStoryRepository;
import lk.ijse.wattpadbackend.repository.UserRepository;
import lk.ijse.wattpadbackend.service.LibraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LibraryServiceImpl implements LibraryService {

    private final LibraryRepository libraryRepository;
    private final UserRepository userRepository;
    private final LibraryStoryRepository libraryStoryRepository;

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

                long viewsLong = x.getStory().getViews().longValue();

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

                long likesLong = x.getStory().getLikes().longValue();

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
                    if(i==x.getLastOpenedPage()){
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
}






















