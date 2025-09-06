package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ChapterSaveRequestDTO {

    private String chapterTitle;
    private String chapterCoverUrl;
    private List<ContentDTO> content;
}
