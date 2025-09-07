package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class UserProfileStoriesResponseDTO {

    private long userId;
    private String userFullName;
    private long publishedCount;
    private long draftCount;
    private List<StoryDTO> storyDTOList;
    private int isCurrentUser;
    private int isMoreStoriesThere;
}
