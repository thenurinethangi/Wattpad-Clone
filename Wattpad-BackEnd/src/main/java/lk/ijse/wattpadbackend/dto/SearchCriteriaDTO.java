package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class SearchCriteriaDTO {

    private long storyCount;
    private String length;
    private String time;
    private String content;
    private List<String> tags;
}
