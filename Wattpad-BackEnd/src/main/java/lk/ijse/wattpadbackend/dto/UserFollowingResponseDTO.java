package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class UserFollowingResponseDTO {

    private int isMoreFollowingUsersAvailable;
    private List<FollowingUserDTO> followingUserDTOList;
}
