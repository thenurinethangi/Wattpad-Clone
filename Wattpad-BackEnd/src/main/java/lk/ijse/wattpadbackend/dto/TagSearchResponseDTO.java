package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class TagSearchResponseDTO {

    private String totalStoriesCount;
    private List<String> tags;
    private List<GenreStoryDTO> genreStoryDTOList;
    private int areMoreStoriesAvailable;
}
