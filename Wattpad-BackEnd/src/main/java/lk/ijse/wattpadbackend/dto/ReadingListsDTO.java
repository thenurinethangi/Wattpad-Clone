package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ReadingListsDTO {

    private String likedReadingListCount;
    private List<SingleReadingListDTO> singleReadingListDTOList;
}
