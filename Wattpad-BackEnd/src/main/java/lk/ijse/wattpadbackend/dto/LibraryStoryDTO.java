package lk.ijse.wattpadbackend.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class LibraryStoryDTO {

    private long storyId;
    private String storyTitle;
    private String storyCoverImagePath;
    private long totalParts;
    private String views;
    private String likes;
    private long userId;
    private String username;
    private String userProfilePicPath;
    private Long lastOpenedChapterId;
    private long lastOpenedChapterSequenceNo;
}











