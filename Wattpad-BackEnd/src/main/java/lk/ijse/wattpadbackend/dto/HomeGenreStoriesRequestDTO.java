package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class HomeGenreStoriesRequestDTO {

    private List<StoryHomeResponseDTO> topPickupStories;
    private List<StoryHomeResponseDTO> hotWattpadStories;
    private List<StoryHomeResponseDTO> storiesFromGenreYouLikeList;
    private List<StoryHomeResponseDTO> storiesFromWritersYouLikeList;
    private List<StoryHomeResponseDTO> recommendationForYouStoriesList;
    private List<StoryHomeResponseDTO> completedStoriesList;
    private List<StoryHomeResponseDTO> trySomethingNewStoriesList;
}
