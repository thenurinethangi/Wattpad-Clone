package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.UserDTO;
import lk.ijse.wattpadbackend.entity.Following;
import lk.ijse.wattpadbackend.entity.Story;
import lk.ijse.wattpadbackend.entity.User;
import lk.ijse.wattpadbackend.exception.UserNotFoundException;
import lk.ijse.wattpadbackend.repository.FollowingRepository;
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
}



































