package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.UserFollowingResponseDTO;

public interface FollowingService {

    UserFollowingResponseDTO getFollowingUsersByUserId(String username, long id, long count);
}
