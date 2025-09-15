package lk.ijse.wattpadbackend.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class AddToReadingListResponseDTO {

    private long readingListId;
    private String listName;
    private int isStoryExit;
}
