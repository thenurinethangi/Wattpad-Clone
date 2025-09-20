package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.UserDTO;

import java.util.List;

public interface UserMuteService {

    boolean addAMute(String name, long userId);

    boolean removeAMute(String name, long userId);

    List<UserDTO> getAllMutedUsersOfCurrentUser(String name);
}
