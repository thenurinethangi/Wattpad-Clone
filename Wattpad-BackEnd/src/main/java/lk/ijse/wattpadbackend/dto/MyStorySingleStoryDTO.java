package lk.ijse.wattpadbackend.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class MyStorySingleStoryDTO {

    public long storyId;
    private String storyTitle;
    private String storyCoverImagePath;
    private long parts;
    private String views;
    private String likes;
    private long publishedPartsCount;
    private long draftPartsCount;
    private String lastUpdate;
    private int PublishedOrDraft;
}
