package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.UserDTO;

import java.util.List;

public interface UserBlockService {

    boolean addABlock(String name, long userId);

    boolean removeABlock(String name, long userId);

    List<UserDTO> getAllBlockedUsersOfCurrentUser(String name);
}
