package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class SingleReadingListDTO {

    private long readingListId;
    private String readingListName;
    private long storyCount;
    private long userId;
    private String username;
    private String userProfilePicPath;
    private List<String> threeStoriesCoverImagePath;
}
