package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class GenreSearchResponseDTO {

    private String totalStoriesCount;
    private List<String> tags;
    private List<GenreStoryDTO> genreStoryDTOList;
    private int areMoreStoriesAvailable;
}











