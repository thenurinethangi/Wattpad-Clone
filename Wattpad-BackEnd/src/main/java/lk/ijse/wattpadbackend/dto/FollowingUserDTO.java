package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class FollowingUserDTO {

    private long userId;
    private String username;
    private String fullName;
    private String profilePicPath;
    private String coverPicPath;
    private long work;
    private String followings;
    private String followers;
    private int isFollowedByTheCurrentUser;
}







