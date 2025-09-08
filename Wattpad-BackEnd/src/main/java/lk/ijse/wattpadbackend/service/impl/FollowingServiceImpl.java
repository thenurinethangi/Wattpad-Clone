package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.FollowingUserDTO;
import lk.ijse.wattpadbackend.dto.UserFollowingResponseDTO;
import lk.ijse.wattpadbackend.entity.Following;
import lk.ijse.wattpadbackend.entity.Story;
import lk.ijse.wattpadbackend.entity.User;
import lk.ijse.wattpadbackend.exception.UserNotFoundException;
import lk.ijse.wattpadbackend.repository.FollowingRepository;
import lk.ijse.wattpadbackend.repository.UserRepository;
import lk.ijse.wattpadbackend.service.FollowingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FollowingServiceImpl implements FollowingService {

    private final FollowingRepository followingRepository;
    private final UserRepository userRepository;

    @Override
    public UserFollowingResponseDTO getFollowingUsersByUserId(String username, long id, long count) {

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

            List<Following> followingList = followingRepository.findAllByFollowedUserId(user.getId());

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
                FollowingUserDTO followingUserDTO = new FollowingUserDTO();
                followingUserDTO.setUserId(x.getUser().getId());
                followingUserDTO.setUsername(x.getUser().getUsername());
                followingUserDTO.setFullName(x.getUser().getFullName());
                followingUserDTO.setProfilePicPath(x.getUser().getProfilePicPath());
                followingUserDTO.setCoverPicPath(x.getUser().getCoverPicPath());

                List<Story> storyList = x.getUser().getStories();
                int a = 0;
                for(Story y : storyList){
                    if(y.getPublishedOrDraft()==1){
                        a++;
                    }
                }
                followingUserDTO.setWork(a);

                List<Following> followings = followingRepository.findAllByFollowedUserId(x.getUser().getId());

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
                    if(z.getUser().getId()==x.getUser().getId()){
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
}
















