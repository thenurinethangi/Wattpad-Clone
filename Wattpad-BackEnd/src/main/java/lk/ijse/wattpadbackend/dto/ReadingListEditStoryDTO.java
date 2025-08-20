package lk.ijse.wattpadbackend.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ReadingListEditStoryDTO {

    private long storyId;
    private String storyTitle;
    private String storyCoverImagePath;
    private String views;
    private String likes;
    private long parts;
    private String username;
}
