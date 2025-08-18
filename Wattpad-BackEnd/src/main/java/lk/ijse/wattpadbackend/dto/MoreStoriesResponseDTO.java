package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class MoreStoriesResponseDTO {

    private List<List<StoryHomeResponseDTO>> lists;
}
