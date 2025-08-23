package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ReadingListEditStoryDTO {

    private long storyId;
    private String storyTitle;
    private String storyDescription;
    private String storyCoverImagePath;
    private String views;
    private String likes;
    private long parts;
    private List<String> tags;
    private long userId;
    private String username;
}
