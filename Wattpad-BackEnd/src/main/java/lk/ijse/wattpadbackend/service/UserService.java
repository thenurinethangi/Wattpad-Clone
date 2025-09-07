package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.UserDTO;

public interface UserService {

    String getUserProfilePic(String name);

    UserDTO getUserDataByUserId(String name, long id);
}
