package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ParagraphCommentsModelResponseDTO {

    private String chapterTitle;
    private long paragraphId;
    private String contentType;
    private String content;
    List<SingleCommentDTO> singleCommentDTOList;
}
