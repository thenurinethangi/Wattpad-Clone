package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.math.BigInteger;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
public class StoryRequestDTO {

    private String title;
    private String description;
    private String copyright;
    private String targetAudience;
    private String language;
    private int rating;
    private int status;
    private String coverImagePath;
    private String tags;
    private List<String> characters;
}
