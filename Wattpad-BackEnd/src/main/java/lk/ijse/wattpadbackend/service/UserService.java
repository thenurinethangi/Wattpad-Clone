package lk.ijse.wattpadbackend.service;

import jakarta.validation.Valid;
import lk.ijse.wattpadbackend.dto.*;
import lk.ijse.wattpadbackend.entity.User;

import java.util.List;

public interface UserService {

    String getUserProfilePic(String name);

    UserDTO getUserDataByUserId(String name, long id);

    List<UserDTO> getFollowingUsersByUserId(long id);

    UserProfileStoriesResponseDTO getStoriesByUserId(String username, long id, long storyCount);

    List<UserProfileReadingListResponseDTO> getReadingListByUserId(long id, long readingListCount);

    void updateUser(UserDTO userDTO);

    void followAOtherUser(String name, long id);

    void unfollowAOtherUser(String name, long id);

    UserDTO getCurrentUserData(String name);

    boolean changeUserUsername(String name, UserDTO userDTO);

    boolean changeUserPassword(String name, UpdatePasswordDTO updatePasswordDTO);

    boolean changeUserEmail(String name, @Valid ChangeEmailDTO changeEmailDTO);

    void changeUserDataInSetting(String name, @Valid UserDataSettingDTO userDataSettingDTO);

    void deactivateCurrentUser(String name);

    UserFollowingResponseDTO getFollowersUsersByUserId(String username, long id, long count);

    List<AdminUserDTO> loadUserForAdminBySortingCriteria(long no, AdminUserRequestDTO adminUserRequestDTO);

    List<AdminUserDTO> searchUsers(String searchTerm, AdminUserRequestDTO sort);

    void deactivateUserByUserId(long userId);

    User verifyUserByUserId(long userId);

    long getTotalUserCount();

    boolean checkThisUserProfileRestrictedToCurrentUserOrNot(String name, long userId);
}
