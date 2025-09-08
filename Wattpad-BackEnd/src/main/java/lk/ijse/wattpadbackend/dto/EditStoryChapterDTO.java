package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class EditStoryChapterDTO {

    private long chapterId;
    private String chapterTitle;
    private int publishedOrDraft;
    private String publishedDate;
    private String views;
    private String likes;
    private String comments;
}
