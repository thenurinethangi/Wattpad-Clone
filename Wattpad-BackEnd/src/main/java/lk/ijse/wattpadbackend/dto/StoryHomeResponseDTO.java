package lk.ijse.wattpadbackend.dto;

import lk.ijse.wattpadbackend.entity.StoryTag;
import lombok.*;

import java.math.BigInteger;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class StoryHomeResponseDTO {

    private long storyId;
    private String category;
    private String views;
    private String coverImagePath;
    private List<String> storyTags;
}















