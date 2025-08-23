package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ReadingListEditRequestDTO {

    private long readingListId;
    private String readingListName;
    private long readingListStoryCount;
    private List<Long> storyDeleteQueue;
}
