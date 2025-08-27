package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class TagSearchCriteriaDTO {

    private long storyCount;
    private List<String> tags;
    private int sortBy;
}
