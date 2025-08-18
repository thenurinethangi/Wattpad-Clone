package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ReadingListHomeResponseDTO {

    private long readingListId;
    private String listName;
    private long userId;
    private String username;
    private String profilePicPath;
    private List<StoryHomeResponseDTO> storyHomeResponseDTOList;
}
