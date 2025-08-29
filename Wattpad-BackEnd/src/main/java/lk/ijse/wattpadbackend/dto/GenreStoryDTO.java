package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class GenreStoryDTO {

    private long storyId;
    private String storyTitle;
    private String storyDescription;
    private String views;
    private String likes;
    private long parts;
    private String coverImagePath;
    private int rating;
    private int status;
    private long userId;
    private String username;
    private List<String> tags;
    private long rankNo;
}
















