package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
public class StoryCreateDTO {

    private long id;
    private String title;
    private String description;
    private String copyright;
    private String targetAudience;
    private String language;
    private String category;
    private int rating;
    private int status;
    private String coverImagePath;
    private String tags;
    private List<String> characters;
}
