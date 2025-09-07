package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.UserDTO;

import java.util.List;

public interface UserService {

    String getUserProfilePic(String name);

    UserDTO getUserDataByUserId(String name, long id);

    List<UserDTO> getFollowingUsersByUserId(long id);
}
