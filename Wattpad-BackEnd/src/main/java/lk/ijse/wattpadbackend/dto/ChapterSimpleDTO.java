package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ChapterSimpleDTO {

    private long id;
    private String title;
    private String publishedDate;
    private int isPublishedOrDraft;
    private int chapterCoins;
    private int isUnlocked;
}
