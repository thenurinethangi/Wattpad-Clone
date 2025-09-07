package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.StoryDTO;
import lk.ijse.wattpadbackend.dto.UserDTO;
import lk.ijse.wattpadbackend.dto.UserProfileReadingListResponseDTO;
import lk.ijse.wattpadbackend.dto.UserProfileStoriesResponseDTO;
import lk.ijse.wattpadbackend.entity.*;
import lk.ijse.wattpadbackend.exception.UserNotFoundException;
import lk.ijse.wattpadbackend.repository.FollowingRepository;
import lk.ijse.wattpadbackend.repository.StoryRepository;
import lk.ijse.wattpadbackend.repository.UserRepository;
import lk.ijse.wattpadbackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final FollowingRepository followingRepository;
    private final StoryRepository storyRepository;

    @Override
    public String getUserProfilePic(String name) {

        try {
            User user = userRepository.findByUsername(name);

            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            return user.getProfilePicPath();
        }
        catch (UserNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Internal Server Error.");
        }
    }

    @Override
    public UserDTO getUserDataByUserId(String username, long id) {

        try {
            User currentUser = userRepository.findByUsername(username);
            if (currentUser == null) {
                throw new UserNotFoundException("User not found. Please Signup.");
            }

            Optional<User> optionalUser = userRepository.findById((int) id);
            if(!optionalUser.isPresent()){
                throw new UserNotFoundException("User not found.");
            }
            User user = optionalUser.get();

            if(user.getIsActive()==0){
                throw new UserNotFoundException("User not found.");
            }

            UserDTO userDTO = new UserDTO();
            userDTO.setId(user.getId());
            userDTO.setBirthday(user.getBirthday());
            userDTO.setEmail(user.getEmail());
            userDTO.setAbout(user.getAbout());
            userDTO.setFacebookLink(user.getFacebookLink());
            userDTO.setWebsiteLink(user.getWebsiteLink());
            userDTO.setFullName(user.getFullName());
            userDTO.setLocation(user.getLocation());
            userDTO.setCoverPicPath(user.getCoverPicPath());
            userDTO.setProfilePicPath(user.getProfilePicPath());
            userDTO.setJoinedDate(user.getJoinedDate());
            userDTO.setUsername(user.getUsername());
            userDTO.setPronouns(user.getPronouns());

            if(user.getId()== currentUser.getId()){
                userDTO.setIsCurrentUser(1);
            }
            else{
                userDTO.setIsCurrentUser(0);
            }

            int storyCount = 0;
            for(Story x : user.getStories()){
                if(x.getPublishedOrDraft()==1){
                    storyCount++;
                }
            }
            userDTO.setWork(storyCount);

            userDTO.setReadingLists(user.getReadingLists().size());

            userDTO.setFollowers(followingRepository.findAllByUser(user).size());

            return userDTO;

        }
        catch (UserNotFoundException e) {
            throw e;
        }
        catch (Exception e) {
            throw new RuntimeException("Internal Server Error.");
        }

    }

    @Override
    public List<UserDTO> getFollowingUsersByUserId(long id) {

        try {
            Optional<User> optionalUser = userRepository.findById((int) id);
            if(!optionalUser.isPresent()){
                throw new UserNotFoundException("User not found.");
            }
            User user = optionalUser.get();

            List<Following> followingList = followingRepository.findAllByFollowedUserId(user.getId());

            int i = 0;
            if(followingList.size()>=3){
                i = 3;
            }
            else {
                i = followingList.size();
            }

            List<UserDTO> userDTOList = new ArrayList<>();
            for (int j = 0; j < i; j++) {
                UserDTO userDTO = new UserDTO();
                userDTO.setId(followingList.get(j).getUser().getId());
                userDTO.setProfilePicPath(followingList.get(j).getUser().getProfilePicPath());

                userDTOList.add(userDTO);
            }

            return userDTOList;

        }
        catch (UserNotFoundException e) {
            throw e;
        }
        catch (Exception e) {
            throw new RuntimeException("Internal Server Error.");
        }
    }

    @Override
    public UserProfileStoriesResponseDTO getStoriesByUserId(String username, long id, long storyCount) {

        try {
            User currentUser = userRepository.findByUsername(username);
            if (currentUser == null) {
                throw new UserNotFoundException("User not found. Please Signup.");
            }

            Optional<User> optionalUser = userRepository.findById((int) id);
            if (!optionalUser.isPresent()) {
                throw new UserNotFoundException("User not found.");
            }
            User user = optionalUser.get();


            if(user.getId()==currentUser.getId()) {
                List<Story> storyList = storyRepository.findAllByUser(user);

                long publishedCount = 0;
                long draftCount = 0;
                for (Story x : storyList){
                    if(x.getPublishedOrDraft()==1){
                        publishedCount++;
                    } else if (x.getPublishedOrDraft()==0) {
                        draftCount++;
                    }
                }

                UserProfileStoriesResponseDTO profileStoriesResponseDTO = new UserProfileStoriesResponseDTO();
                profileStoriesResponseDTO.setUserId(user.getId());
                profileStoriesResponseDTO.setUserFullName(user.getFullName());
                profileStoriesResponseDTO.setPublishedCount(publishedCount);
                profileStoriesResponseDTO.setDraftCount(draftCount);
                profileStoriesResponseDTO.setIsCurrentUser(1);

                long returnStoryCount = 0;
                if(storyList.size()>=storyCount){
                    returnStoryCount = storyCount;
                    if(storyList.size()>storyCount){
                        profileStoriesResponseDTO.setIsMoreStoriesThere(1);
                    }
                    else {
                        profileStoriesResponseDTO.setIsMoreStoriesThere(0);
                    }
                } else {
                    returnStoryCount = storyList.size();
                    profileStoriesResponseDTO.setIsMoreStoriesThere(0);
                }

                List<StoryDTO> storyDTOList = new ArrayList<>();
                for (int i = 0; i < returnStoryCount; i++) {
                    Story x  = storyList.get(i);

                    StoryDTO storyDTO = new StoryDTO();
                    storyDTO.setId(x.getId());
                    storyDTO.setCoverImagePath(x.getCoverImagePath());
                    storyDTO.setTitle(x.getTitle());
                    storyDTO.setDescription(x.getDescription());
                    storyDTO.setParts(x.getParts());
                    storyDTO.setPublishedOrDraft(x.getPublishedOrDraft());

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
                    storyDTO.setLikes(likesInStr);

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

                    storyDTO.setViews(viewsInStr);

                    List<StoryTag> storyTagList = x.getStoryTags();
                    List<String> tags = new ArrayList<>();
                    for (StoryTag y : storyTagList){
                        tags.add(y.getTag().getTagName());
                    }
                    storyDTO.setTags(tags);

                    storyDTOList.add(storyDTO);
                }

                profileStoriesResponseDTO.setStoryDTOList(storyDTOList);
                return profileStoriesResponseDTO;
            }
            else {

                List<Story> storyList1 = storyRepository.findAllByUser(user);

                List<Story> storyList = new ArrayList<>();
                for (Story x : storyList1){
                    if(x.getPublishedOrDraft()==1){
                        storyList.add(x);
                    }
                }

                UserProfileStoriesResponseDTO profileStoriesResponseDTO = new UserProfileStoriesResponseDTO();
                profileStoriesResponseDTO.setUserId(user.getId());
                profileStoriesResponseDTO.setUserFullName(user.getFullName());
                profileStoriesResponseDTO.setPublishedCount(storyList.size());
                profileStoriesResponseDTO.setIsCurrentUser(0);

                long returnStoryCount = 0;
                if(storyList.size()>=storyCount){
                    returnStoryCount = storyCount;
                    if(storyList.size()>storyCount){
                        profileStoriesResponseDTO.setIsMoreStoriesThere(1);
                    }
                    else {
                        profileStoriesResponseDTO.setIsMoreStoriesThere(0);
                    }
                } else {
                    returnStoryCount = storyList.size();
                    profileStoriesResponseDTO.setIsMoreStoriesThere(0);
                }

                List<StoryDTO> storyDTOList = new ArrayList<>();
                for (int i = 0; i < returnStoryCount; i++) {
                    Story x  = storyList.get(i);

                    StoryDTO storyDTO = new StoryDTO();
                    storyDTO.setId(x.getId());
                    storyDTO.setCoverImagePath(x.getCoverImagePath());
                    storyDTO.setTitle(x.getTitle());
                    storyDTO.setDescription(x.getDescription());
                    storyDTO.setParts(x.getParts());
                    storyDTO.setPublishedOrDraft(x.getPublishedOrDraft());

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
                    storyDTO.setLikes(likesInStr);

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

                    storyDTO.setViews(viewsInStr);

                    List<StoryTag> storyTagList = x.getStoryTags();
                    List<String> tags = new ArrayList<>();
                    for (StoryTag y : storyTagList){
                        tags.add(y.getTag().getTagName());
                    }
                    storyDTO.setTags(tags);

                    storyDTOList.add(storyDTO);
                }

                profileStoriesResponseDTO.setStoryDTOList(storyDTOList);
                return profileStoriesResponseDTO;
            }

        }
        catch (UserNotFoundException e) {
            throw e;
        }
        catch (Exception e) {
            throw new RuntimeException("Internal Server Error.");
        }
    }

    @Override
    public List<UserProfileReadingListResponseDTO> getReadingListByUserId(long id, long readingListCount) {

        try {
            Optional<User> optionalUser = userRepository.findById((int) id);
            if (!optionalUser.isPresent()) {
                throw new UserNotFoundException("User not found.");
            }
            User user = optionalUser.get();

            List<ReadingList> readingListList = user.getReadingLists();

            long returnCount = 0;
            if(readingListList.size()>=readingListCount){
                returnCount = readingListCount;
            }
            else{
                returnCount = readingListList.size();
            }

            List<UserProfileReadingListResponseDTO> profileReadingListResponseDTOList = new ArrayList<>();
            for (int i = 0; i < returnCount; i++) {
                ReadingList x = readingListList.get(i);

                UserProfileReadingListResponseDTO dto = new UserProfileReadingListResponseDTO();
                dto.setReadingListId(x.getId());
                dto.setReadingListName(x.getListName());
                dto.setReadingListStoryCount(x.getReadingListStories().size());

                if(readingListList.size()>=readingListCount){
                    if(readingListList.size()>readingListCount){
                        dto.setIsMoreReadingListsAvailable(1);
                    }
                    else {
                        dto.setIsMoreReadingListsAvailable(0);
                    }
                }
                else{
                    dto.setIsMoreReadingListsAvailable(0);
                }

                List<StoryDTO> storyDTOList = new ArrayList<>();
                List<ReadingListStory> readingListStories = x.getReadingListStories();
                for (int j = 0; j < readingListStories.size(); j++) {
                    if(j==3){
                        break;
                    }
                    ReadingListStory listStory = readingListStories.get(i);

                    StoryDTO storyDTO = new StoryDTO();
                    storyDTO.setId(listStory.getStory().getId());
                    storyDTO.setParts(listStory.getStory().getParts());
                    storyDTO.setTitle(listStory.getStory().getTitle());
                    storyDTO.setCoverImagePath(listStory.getStory().getCoverImagePath());

                    long likesLong = listStory.getStory().getLikes().longValue();

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

                    long viewsLong = listStory.getStory().getViews().longValue();

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

                    storyDTOList.add(storyDTO);
                }

                dto.setThreeStoriesDTOList(storyDTOList);

                profileReadingListResponseDTOList.add(dto);
            }

            return profileReadingListResponseDTOList;

        }
        catch (UserNotFoundException e) {
            throw e;
        }
        catch (Exception e) {
            throw new RuntimeException("Internal Server Error.");
        }
    }
}



































