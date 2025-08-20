package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ReadingListEditResponseDTO {

    private long readingListId;
    private String readingListName;
    private long storyCount;
    private List<ReadingListEditStoryDTO> readingListEditStoryDTOList;
}
