package lk.ijse.wattpadbackend.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class SearchProfileReturnDTO {

    private long userId;
    private String username;
    private String fullName;
    private String profilePicPath;
    private long storyCount;
    private long readingListCount;
    private String followersCount;
    private int isCurrentUserFollowed;
}
