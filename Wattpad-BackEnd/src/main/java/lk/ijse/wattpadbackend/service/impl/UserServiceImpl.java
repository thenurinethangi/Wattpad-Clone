package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.*;
import lk.ijse.wattpadbackend.entity.*;
import lk.ijse.wattpadbackend.exception.UserNotFoundException;
import lk.ijse.wattpadbackend.repository.ChapterLikeRepository;
import lk.ijse.wattpadbackend.repository.FollowingRepository;
import lk.ijse.wattpadbackend.repository.StoryRepository;
import lk.ijse.wattpadbackend.repository.UserRepository;
import lk.ijse.wattpadbackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final FollowingRepository followingRepository;
    private final StoryRepository storyRepository;
    private final ChapterLikeRepository chapterLikeRepository;

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
            userDTO.setBirthday(user.getBirthday());

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

            Following following = followingRepository.findByFollowedUserIdAndUser(currentUser.getId(),user);
            if(following!=null){
                userDTO.setIsFollowedByTheCurrentUser(1);
            }
            else{
                userDTO.setIsFollowedByTheCurrentUser(0);
            }

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

            List<ReadingList> readingLists = user.getReadingLists();
            List<ReadingList> readingListList = new ArrayList<>();
            for(ReadingList x : readingLists){
                if(!x.getReadingListStories().isEmpty()){
                    readingListList.add(x);
                }
            }

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
                    ReadingListStory listStory = readingListStories.get(j);

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

    @Override
    public void updateUser(UserDTO userDTO) {

        try {
            Optional<User> optionalUser = userRepository.findById((int) userDTO.getId());
            if (!optionalUser.isPresent()) {
                throw new UserNotFoundException("User not found.");
            }
            User user = optionalUser.get();

            user.setAbout(userDTO.getAbout());
            user.setLocation(userDTO.getLocation());
            user.setCoverPicPath(userDTO.getCoverPicPath());
            user.setFacebookLink(userDTO.getFacebookLink());
            user.setFullName(userDTO.getFullName());
            user.setWebsiteLink(userDTO.getWebsiteLink());
            user.setCoverPicPath(userDTO.getCoverPicPath());
            user.setPronouns(userDTO.getPronouns());
            user.setProfilePicPath(userDTO.getProfilePicPath());

            userRepository.save(user);

        }
        catch (UserNotFoundException e) {
            throw e;
        }
        catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Internal Server Error.");
        }
    }

    @Override
    public void followAOtherUser(String username, long id) {

        try {
           User currentUser = userRepository.findByUsername(username);
           if(currentUser==null){
               throw new UserNotFoundException("User not found.");
           }

            Optional<User> optionalUser = userRepository.findById((int) id);
            if (!optionalUser.isPresent()) {
                throw new UserNotFoundException("User not found.");
            }
            User user = optionalUser.get();

            Following following = new Following();
            following.setUser(user);
            following.setFollowedUserId(currentUser.getId());
            followingRepository.save(following);
        }
        catch (UserNotFoundException e) {
            throw e;
        }
        catch (Exception e) {
            throw new RuntimeException("Internal Server Error.");
        }
    }

    @Override
    @Transactional
    public void unfollowAOtherUser(String username, long id) {

        try {
            User currentUser = userRepository.findByUsername(username);
            if(currentUser==null){
                throw new UserNotFoundException("User not found.");
            }

            Optional<User> optionalUser = userRepository.findById((int) id);
            if (!optionalUser.isPresent()) {
                throw new UserNotFoundException("User not found.");
            }
            User user = optionalUser.get();

            Following following = followingRepository.findByFollowedUserIdAndUser(currentUser.getId(),user);
            if(following!=null){
                System.out.println("exit");
                followingRepository.delete(following);
            }
        }
        catch (UserNotFoundException e) {
            throw e;
        }
        catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Internal Server Error.");
        }
    }

    @Override
    public UserDTO getCurrentUserData(String username) {

        try {
            User user = userRepository.findByUsername(username);
            if (user == null) {
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
            userDTO.setBirthday(user.getBirthday());

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
    public boolean changeUserUsername(String username, UserDTO userDTO) {

        try {
            User user = userRepository.findByUsername(username);
            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            if(!user.getPassword().equals(userDTO.getPassword())){
                return false;
            }
            else{
                user.setUsername(userDTO.getUsername());
                userRepository.save(user);
                return true;
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
    public boolean changeUserPassword(String username, UpdatePasswordDTO updatePasswordDTO) {

        try {
            User user = userRepository.findByUsername(username);
            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            if(!user.getPassword().equals(updatePasswordDTO.getCurrentPassword())){
                return false;
            }
            else{
                user.setPassword(updatePasswordDTO.getNewPassword());
                userRepository.save(user);
                return true;
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
    public boolean changeUserEmail(String username, ChangeEmailDTO changeEmailDTO) {

        try {
            User user = userRepository.findByUsername(username);
            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            if(!user.getPassword().equals(changeEmailDTO.getPassword())){
                return false;
            }
            else{
                user.setEmail(changeEmailDTO.getNewEmail());
                userRepository.save(user);
                return true;
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
    public void changeUserDataInSetting(String username, UserDataSettingDTO userDataSettingDTO) {

        try {
            User user = userRepository.findByUsername(username);
            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            user.setBirthday(userDataSettingDTO.getBirthday());
            userRepository.save(user);
        }
        catch (UserNotFoundException e) {
            throw e;
        }
        catch (Exception e) {
            throw new RuntimeException("Internal Server Error.");
        }
    }

    @Override
    public void deactivateCurrentUser(String username) {

        try {
            User user = userRepository.findByUsername(username);
            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            user.setIsActive(0);
            userRepository.save(user);
        }
        catch (UserNotFoundException e) {
            throw e;
        }
        catch (Exception e) {
            throw new RuntimeException("Internal Server Error.");
        }
    }

    @Override
    public UserFollowingResponseDTO getFollowersUsersByUserId(String username, long id, long count) {

        try {
            User currentUser = userRepository.findByUsername(username);
            if(currentUser==null){
                throw new UserNotFoundException("User not found, Please signup");
            }

            Optional<User> optionalUser = userRepository.findById((int) id);
            if (!optionalUser.isPresent()) {
                throw new UserNotFoundException("User not found.");
            }
            User user = optionalUser.get();

            List<Following> followingList = followingRepository.findAllByUser(user);

            UserFollowingResponseDTO userFollowingResponseDTO = new UserFollowingResponseDTO();

            long returnCount = 0;
            if(followingList.size()>=count){
                returnCount = count;
                if(followingList.size()>count){
                    userFollowingResponseDTO.setIsMoreFollowingUsersAvailable(1);
                }
                else {
                    userFollowingResponseDTO.setIsMoreFollowingUsersAvailable(0);
                }
            }
            else {
                returnCount = followingList.size();
                userFollowingResponseDTO.setIsMoreFollowingUsersAvailable(0);
            }

            List<FollowingUserDTO> followingUserDTOList = new ArrayList<>();
            for (Following x : followingList){
                Optional<User> optionalUser1 = userRepository.findById((int) x.getFollowedUserId());
                if(!optionalUser1.isPresent()){
                    continue;
                }
                User y = optionalUser1.get();

                FollowingUserDTO followingUserDTO = new FollowingUserDTO();
                followingUserDTO.setUserId(y.getId());
                followingUserDTO.setUsername(y.getUsername());
                followingUserDTO.setFullName(y.getFullName());
                followingUserDTO.setProfilePicPath(y.getProfilePicPath());
                followingUserDTO.setCoverPicPath(y.getCoverPicPath());

                List<Story> storyList = y.getStories();
                int a = 0;
                for(Story z : storyList){
                    if(z.getPublishedOrDraft()==1){
                        a++;
                    }
                }
                followingUserDTO.setWork(a);

                List<Following> followings = followingRepository.findAllByFollowedUserId(x.getId());

                long followingLong = followings.size();

                String followingInStr = "";
                if(followingLong<=1000){
                    followingInStr = String.valueOf(followingLong);
                }
                else if (followingLong >= 1000 && followingLong < 1000000) {
                    double value = (double) followingLong / 1000;
                    String vStr = String.valueOf(value);

                    if (vStr.endsWith(".0")) {
                        followingInStr = vStr.split("\\.0")[0] + "K";
                    } else {
                        followingInStr = vStr + "K";
                    }
                }
                else if(followingLong>=1000000){
                    double value = (double) followingLong/1000000;

                    String vStr = String.valueOf(value);

                    if (vStr.endsWith(".0")) {
                        followingInStr = vStr.split("\\.0")[0] + "M";
                    } else {
                        followingInStr = value+"M";
                    }
                }
                followingUserDTO.setFollowings(followingInStr);

                List<Following> followers = followingRepository.findAllByUser(user);

                long followersLong = followers.size();

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
                followingUserDTO.setFollowers(followersInStr);

                followingUserDTO.setIsFollowedByTheCurrentUser(0);
                List<Following> f = followingRepository.findAllByFollowedUserId(currentUser.getId());
                for(Following z : f){
                    if(z.getUser().getId()==y.getId()){
                        followingUserDTO.setIsFollowedByTheCurrentUser(1);
                        break;
                    }
                }

                followingUserDTOList.add(followingUserDTO);
            }

            userFollowingResponseDTO.setFollowingUserDTOList(followingUserDTOList);
            return userFollowingResponseDTO;

        }
        catch (UserNotFoundException e) {
            throw e;
        }
        catch (Exception e) {
            throw new RuntimeException("Internal Server Error.");
        }
    }

//    @Override
//    public List<AdminUserDTO> loadUserForAdminBySortingCriteria(long no, AdminUserRequestDTO adminUserRequestDTO) {
//        try {
//            List<User> userList = userRepository.findAll();
//
//            // Filter by status
//            List<User> sortAfterStatus = new ArrayList<>();
//            for (User x : userList) {
//                if ("all".equals(adminUserRequestDTO.getStatus())) {
//                    sortAfterStatus.add(x);
//                } else if ("active".equals(adminUserRequestDTO.getStatus())) {
//                    if (x.getIsActive() == 1) {
//                        sortAfterStatus.add(x);
//                    }
//                } else if ("inactive".equals(adminUserRequestDTO.getStatus())) {
//                    if (x.getIsActive() == 0) {
//                        sortAfterStatus.add(x);
//                    }
//                }
//            }
//
//            // Filter by type (verification)
//            List<User> sortAfterType = new ArrayList<>();
//            for (User x : sortAfterStatus) {
//                if ("all".equals(adminUserRequestDTO.getType())) {
//                    sortAfterType.add(x);
//                } else if ("verified".equals(adminUserRequestDTO.getType())) {
//                    if (x.getIsVerifiedByWattpad() == 1) {
//                        sortAfterType.add(x);
//                    }
//                } else if ("normal".equals(adminUserRequestDTO.getType())) {
//                    if (x.getIsVerifiedByWattpad() == 0) {
//                        sortAfterType.add(x);
//                    }
//                }
//            }
//
//            // Calculate totals for all filtered users (before rank-specific sorting)
//            List<User> usersWithTotals = new ArrayList<>();
//            for (User x : sortAfterType) {
//                long totalViews = 0;
//                long totalLikes = 0;
//                List<Story> storyList = x.getStories();
//                for (Story y : storyList) {
//                    totalViews += y.getViews().longValue();
//                    List<Chapter> chapterList = y.getChapters();
//                    for (Chapter z : chapterList) {
//                        List<ChapterLike> chapterLikeList = z.getChapterLikes();
//                        totalLikes += chapterLikeList.size();
//                    }
//                }
//                long total = totalViews + totalLikes;
//                x.setUserTotalViewsAndLikes(total);
//                x.setTotalLikes(totalLikes);
//                x.setTotalViews(totalViews);
//                usersWithTotals.add(x);
//            }
//
//            // Apply rank sorting if not "all"
//            List<User> filteredUsers = new ArrayList<>(usersWithTotals);
//            if (!"all".equals(adminUserRequestDTO.getRank())) {
//                if ("top".equals(adminUserRequestDTO.getRank())) {
//                    filteredUsers.sort(Comparator.comparingLong(User::getUserTotalViewsAndLikes).reversed());
//                } else if ("bottom".equals(adminUserRequestDTO.getRank())) {
//                    filteredUsers.sort(Comparator.comparingLong(User::getUserTotalViewsAndLikes));
//                }
//            }
//
//            // Assign ranks to the FULL filtered list (consistent across pages)
//            filteredUsers.sort(Comparator.comparingLong(User::getUserTotalViewsAndLikes).reversed());
//            long count = 1;
//            for (User q : filteredUsers) {
//                q.setRank(count);
//                count++;
//            }
//
//            // Pagination: Calculate start (0-based) and end for the current page
//            int pageSize = 12;
//            int start = (int) ((no - 1) * pageSize);  // 1-based to 0-based
//            int end = (int) (start + pageSize);      // Exclusive end
//
//            // If start >= total size, return empty list
//            int totalSize = filteredUsers.size();
//            if (start >= totalSize) {
//                return new ArrayList<>();  // No more users
//            }
//
//            // Slice the list (handles partial last page automatically)
//            List<User> paginatedUsers = filteredUsers.subList(start, Math.min(end, totalSize));
//
//            // Convert to DTOs
//            List<AdminUserDTO> adminUserDTOList = new ArrayList<>();
//            for (User x : paginatedUsers) {
//                AdminUserDTO adminUserDTO = new AdminUserDTO();
//                adminUserDTO.setId(x.getId());
//                adminUserDTO.setFullName(x.getFullName());
//                adminUserDTO.setUsername(x.getUsername());
//                adminUserDTO.setEmail(x.getEmail());
//                adminUserDTO.setJoinedDate(x.getJoinedDate());
//                adminUserDTO.setCoverPicPath(x.getCoverPicPath());
//                adminUserDTO.setProfilePicPath(x.getProfilePicPath());
//                adminUserDTO.setIsActive(x.getIsActive());
//                adminUserDTO.setIsVerify(x.getIsVerifiedByWattpad());
//                adminUserDTO.setRank(String.valueOf(x.getRank()));
//                adminUserDTO.setTotalReports(String.valueOf(0));
//                adminUserDTO.setRecentReports(String.valueOf(0));
//                adminUserDTO.setWork(x.getStories().size());
//
//                long viewsLong = x.getTotalViews();
//                adminUserDTO.setViews(formatNumber(viewsLong));
//
//                long likesLong = x.getTotalLikes();
//                adminUserDTO.setLikes(formatNumber(likesLong));
//
//                long total = x.getUserTotalViewsAndLikes();
//                adminUserDTO.setEngagement(determineEngagement(total));
//
//                adminUserDTOList.add(adminUserDTO);
//            }
//
//            return adminUserDTOList;
//        } catch (RuntimeException e) {
//            throw new RuntimeException(e);
//        }
//    }


    @Override
    public List<AdminUserDTO> loadUserForAdminBySortingCriteria(long no, AdminUserRequestDTO adminUserRequestDTO) {
        try {
            List<User> userList = userRepository.findAll();

            for (User x : userList){
                long totalViews = 0;
                long totalLikes = 0;

                List<Story> storyList = x.getStories();
                for (Story y : storyList){
                    totalViews+=y.getViews().longValue();

                    List<Chapter> chapterList = y.getChapters();
                    for (Chapter z : chapterList){
                        List<ChapterLike> chapterLikeList = z.getChapterLikes();
                        totalLikes+=chapterLikeList.size();
                    }
                }

                long total = totalViews+totalLikes;
                x.setUserTotalViewsAndLikes(total);
            }

            List<User> tempForAddRank = new ArrayList<>();
            tempForAddRank.addAll(userList);
            tempForAddRank.sort(
                    Comparator.comparingLong(User::getUserTotalViewsAndLikes).reversed()
            );
            int count = 1;
            for (User a : tempForAddRank){
                a.setRank(count);
                count++;
            }

            // Filter by status
            List<User> sortAfterStatus = new ArrayList<>();
            for (User x : userList) {
                if ("all".equals(adminUserRequestDTO.getStatus())) {
                    sortAfterStatus.add(x);
                } else if ("active".equals(adminUserRequestDTO.getStatus())) {
                    if (x.getIsActive() == 1) {
                        sortAfterStatus.add(x);
                    }
                } else if ("inactive".equals(adminUserRequestDTO.getStatus())) {
                    if (x.getIsActive() == 0) {
                        sortAfterStatus.add(x);
                    }
                }
            }

            // Filter by type (verification)
            List<User> sortAfterType = new ArrayList<>();
            for (User x : sortAfterStatus) {
                if ("all".equals(adminUserRequestDTO.getType())) {
                    sortAfterType.add(x);
                } else if ("verified".equals(adminUserRequestDTO.getType())) {
                    if (x.getIsVerifiedByWattpad() == 1) {
                        sortAfterType.add(x);
                    }
                } else if ("normal".equals(adminUserRequestDTO.getType())) {
                    if (x.getIsVerifiedByWattpad() == 0) {
                        sortAfterType.add(x);
                    }
                }
            }

            // Calculate totals for all filtered users
            List<User> usersWithTotals = new ArrayList<>();
            for (User x : sortAfterType) {
                long totalViews = 0;
                long totalLikes = 0;
                List<Story> storyList = x.getStories();
                for (Story y : storyList) {
                    totalViews += y.getViews().longValue();
                    List<Chapter> chapterList = y.getChapters();
                    for (Chapter z : chapterList) {
                        List<ChapterLike> chapterLikeList = z.getChapterLikes();
                        totalLikes += chapterLikeList.size();
                    }
                }
                long total = totalViews + totalLikes;
                x.setUserTotalViewsAndLikes(total);
                x.setTotalLikes(totalLikes);
                x.setTotalViews(totalViews);
                usersWithTotals.add(x);
            }

            // Apply rank sorting to the full list
            List<User> filteredUsers = new ArrayList<>(usersWithTotals);
            if ("top".equals(adminUserRequestDTO.getRank())) {
                filteredUsers.sort(Comparator.comparingLong(User::getUserTotalViewsAndLikes).reversed());
            } else if ("bottom".equals(adminUserRequestDTO.getRank())) {
                filteredUsers.sort(Comparator.comparingLong(User::getUserTotalViewsAndLikes));
            } // If "all", no additional sorting beyond the final reverse sort

            // Assign ranks to the FULL filtered list after sorting
//            long rank = 1;
//            for (User q : filteredUsers) {
//                q.setRank(rank++);
//            }

            // Pagination: Calculate start (0-based) and end for the current page
            int pageSize = 12;
            int start = (int) ((no - 1) * pageSize);  // 1-based to 0-based
            int end = (int) (start + pageSize);      // Exclusive end

            // If start >= total size, return empty list
            int totalSize = filteredUsers.size();
            if (start >= totalSize) {
                return new ArrayList<>();  // No more users
            }

            // Slice the list (handles partial last page automatically)
            List<User> paginatedUsers = filteredUsers.subList(start, Math.min(end, totalSize));

            // Convert to DTOs
            List<AdminUserDTO> adminUserDTOList = new ArrayList<>();
            for (User x : paginatedUsers) {
                AdminUserDTO adminUserDTO = new AdminUserDTO();
                adminUserDTO.setId(x.getId());
                adminUserDTO.setFullName(x.getFullName());
                adminUserDTO.setUsername(x.getUsername());
                adminUserDTO.setEmail(x.getEmail());
                adminUserDTO.setJoinedDate(x.getJoinedDate());
                adminUserDTO.setCoverPicPath(x.getCoverPicPath());
                adminUserDTO.setProfilePicPath(x.getProfilePicPath());
                adminUserDTO.setIsActive(x.getIsActive());
                adminUserDTO.setIsVerify(x.getIsVerifiedByWattpad());
                adminUserDTO.setRank(String.valueOf(x.getRank()));
                adminUserDTO.setTotalReports(String.valueOf(0));
                adminUserDTO.setRecentReports(String.valueOf(0));
                adminUserDTO.setWork(x.getStories().size());

                long viewsLong = x.getTotalViews();
                adminUserDTO.setViews(formatNumber(viewsLong));

                long likesLong = x.getTotalLikes();
                adminUserDTO.setLikes(formatNumber(likesLong));

                long total = x.getUserTotalViewsAndLikes();
                adminUserDTO.setEngagement(determineEngagement(total));

                adminUserDTOList.add(adminUserDTO);
            }

            return adminUserDTOList;
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    // Helper method for formatting views/likes (extracted for reuse)
    private String formatNumber(long value) {
        if (value <= 1000) {
            return String.valueOf(value);
        } else if (value < 1000000) {
            double formatted = value / 1000.0;
            String str = String.valueOf(formatted);
            if (str.endsWith(".0")) {
                return str.split("\\.0")[0] + "K";
            } else {
                return str + "K";
            }
        } else {
            double formatted = value / 1000000.0;
            String str = String.valueOf(formatted);
            if (str.endsWith(".0")) {
                return str.split("\\.0")[0] + "M";
            } else {
                return formatted + "M";
            }
        }
    }


    @Override
    public List<AdminUserDTO> searchUsers(String searchTerm, AdminUserRequestDTO sort) {
        try {
            List<User> userList = userRepository.findAll();
            List<User> filteredUsers = filterUsersBySearchTerm(userList, searchTerm);
            applySortingCriteria(filteredUsers, sort);
            return convertToAdminUserDTOs(filteredUsers);
        } catch (Exception e) {
            throw new RuntimeException("Error searching users: " + e.getMessage());
        }
    }

    @Override
    public void deactivateUserByUserId(long userId) {

        try{
            Optional<User> optionalUser = userRepository.findById((int) userId);
            if(!optionalUser.isPresent()){
                throw new UserNotFoundException("User not found.");
            }
            User user = optionalUser.get();

            user.setIsActive(0);
            userRepository.save(user);
        }
        catch (UserNotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void verifyUserByUserId(long userId) {

        try{
            Optional<User> optionalUser = userRepository.findById((int) userId);
            if(!optionalUser.isPresent()){
                throw new UserNotFoundException("User not found.");
            }
            User user = optionalUser.get();

            user.setIsVerifiedByWattpad(1);
            userRepository.save(user);
        }
        catch (UserNotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public long getTotalUserCount() {

        try{
            return userRepository.findAll().size();

        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    private List<User> filterUsersBySearchTerm(List<User> users, String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return new ArrayList<>(users); // Return all users if search term is empty
        }

        List<User> filtered = new ArrayList<>();
        searchTerm = searchTerm.toLowerCase();

        for (User user : users) {
            AdminUserDTO dto = convertToAdminUserDTO(user); // Temporary DTO for comparison
            if (matchesSearchTerm(dto, searchTerm)) {
                filtered.add(user);
            }
        }
        return filtered;
    }

    private boolean matchesSearchTerm(AdminUserDTO dto, String searchTerm) {
        // Convert numeric fields to their string representations for search
        String viewsStr = dto.getViews() != null ? dto.getViews().toLowerCase() : "";
        String likesStr = dto.getLikes() != null ? dto.getLikes().toLowerCase() : "";
        String workStr = String.valueOf(dto.getWork());
        String idStr = String.valueOf(dto.getId());
        String engagementStr = dto.getEngagement() != null ? dto.getEngagement().toLowerCase() : "";
        String rankStr = dto.getRank() != null ? dto.getRank().toLowerCase() : "";

        return (dto.getFullName() != null && dto.getFullName().toLowerCase().contains(searchTerm)) ||
                (dto.getUsername() != null && dto.getUsername().toLowerCase().contains(searchTerm)) ||
                (dto.getEmail() != null && dto.getEmail().toLowerCase().contains(searchTerm)) ||
                viewsStr.contains(searchTerm) ||
                likesStr.contains(searchTerm) ||
                workStr.toLowerCase().contains(searchTerm) ||
                idStr.toLowerCase().contains(searchTerm) ||
                (dto.getIsActive() == 1 && "active".toLowerCase().contains(searchTerm)) ||
                (dto.getIsActive() == 0 && "deactive".toLowerCase().contains(searchTerm)) ||
                (dto.getIsVerify() == 1 && "verified".toLowerCase().contains(searchTerm)) ||
                (dto.getIsVerify() == 0 && "normal".toLowerCase().contains(searchTerm)) ||
                engagementStr.contains(searchTerm) ||
                rankStr.contains(searchTerm);
    }

    private void applySortingCriteria(List<User> users, AdminUserRequestDTO sort) {
        if (sort == null) return;

        if ("active".equals(sort.getStatus())) {
            users.removeIf(user -> user.getIsActive() != 1);
        } else if ("inactive".equals(sort.getStatus())) {
            users.removeIf(user -> user.getIsActive() != 0);
        }

        if ("verified".equals(sort.getType())) {
            users.removeIf(user -> user.getIsVerifiedByWattpad() != 1);
        } else if ("normal".equals(sort.getType())) {
            users.removeIf(user -> user.getIsVerifiedByWattpad() != 0);
        }

        if ("top".equals(sort.getRank())) {
            users.sort(Comparator.comparingLong(User::getUserTotalViewsAndLikes).reversed());
        } else if ("bottom".equals(sort.getRank())) {
            users.sort(Comparator.comparingLong(User::getUserTotalViewsAndLikes));
        }

        // Assign ranks based on sorted order
        long rank = 1;
        for (User user : users) {
            user.setRank(rank++);
        }
    }

    private List<AdminUserDTO> convertToAdminUserDTOs(List<User> users) {
        List<AdminUserDTO> adminUserDTOList = new ArrayList<>();
        for (User user : users) {
            AdminUserDTO adminUserDTO = new AdminUserDTO();
            adminUserDTO.setId(user.getId());
            adminUserDTO.setFullName(user.getFullName());
            adminUserDTO.setUsername(user.getUsername());
            adminUserDTO.setEmail(user.getEmail());
            adminUserDTO.setJoinedDate(user.getJoinedDate());
            adminUserDTO.setCoverPicPath(user.getCoverPicPath());
            adminUserDTO.setProfilePicPath(user.getProfilePicPath());
            adminUserDTO.setIsActive(user.getIsActive());
            adminUserDTO.setIsVerify(user.getIsVerifiedByWattpad());
            adminUserDTO.setRank(String.valueOf(user.getRank()));
            adminUserDTO.setTotalReports(String.valueOf(0)); // Assuming no reports data here
            adminUserDTO.setRecentReports(String.valueOf(0));
            adminUserDTO.setWork(user.getStories().size());

            long viewsLong = user.getTotalViews();
            adminUserDTO.setViews(formatViewsOrLikes(viewsLong));

            long likesLong = user.getTotalLikes();
            adminUserDTO.setLikes(formatViewsOrLikes(likesLong));

            long total = user.getUserTotalViewsAndLikes();
            adminUserDTO.setEngagement(determineEngagement(total));

            adminUserDTOList.add(adminUserDTO);
        }
        return adminUserDTOList;
    }

    private String formatViewsOrLikes(long value) {
        if (value <= 1000) {
            return String.valueOf(value);
        } else if (value < 1000000) {
            double kValue = value / 1000.0;
            return kValue % 1 == 0 ? (int)kValue + "K" : String.format("%.1fK", kValue);
        } else {
            double mValue = value / 1000000.0;
            return mValue % 1 == 0 ? (int)mValue + "M" : String.format("%.1fM", mValue);
        }
    }

    private String determineEngagement(long total) {
        if (total < 1000) return "Newbie";
        else if (total < 10000) return "Rising Author";
        else if (total < 50000) return "Popular Writer";
        else if (total < 200000) return "Star Author";
        else if (total < 1000000) return "Elite Author";
        else return "Legend";
    }

    private AdminUserDTO convertToAdminUserDTO(User user) {
        AdminUserDTO dto = new AdminUserDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setJoinedDate(user.getJoinedDate());
        dto.setCoverPicPath(user.getCoverPicPath());
        dto.setProfilePicPath(user.getProfilePicPath());
        dto.setIsActive(user.getIsActive());
        dto.setIsVerify(user.getIsVerifiedByWattpad());
        dto.setWork(user.getStories().size());
        dto.setViews(formatViewsOrLikes(user.getTotalViews()));
        dto.setLikes(formatViewsOrLikes(user.getTotalLikes()));
        dto.setTotalReports("0");
        dto.setRecentReports("0");
        dto.setEngagement(determineEngagement(user.getUserTotalViewsAndLikes()));
        dto.setRank(String.valueOf(user.getRank()));
        return dto;
    }
}



































