package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.UserDTO;
import lk.ijse.wattpadbackend.dto.UserProfileReadingListResponseDTO;
import lk.ijse.wattpadbackend.dto.UserProfileStoriesResponseDTO;

import java.util.List;

public interface UserService {

    String getUserProfilePic(String name);

    UserDTO getUserDataByUserId(String name, long id);

    List<UserDTO> getFollowingUsersByUserId(long id);

    UserProfileStoriesResponseDTO getStoriesByUserId(String username, long id, long storyCount);

    List<UserProfileReadingListResponseDTO> getReadingListByUserId(long id, long readingListCount);
}
