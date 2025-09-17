package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class AdminStoryResponseDTO {

    private long totalStories;
    private long start;
    private long end;
    private List<AdminStoryDTO> adminStoryDTOList;
}
