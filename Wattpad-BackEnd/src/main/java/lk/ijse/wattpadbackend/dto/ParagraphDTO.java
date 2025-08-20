package lk.ijse.wattpadbackend.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ParagraphDTO {

    private long id;
    private String contentType;
    private String content;
    private int sequenceNo;
    private String commentCount;
}
