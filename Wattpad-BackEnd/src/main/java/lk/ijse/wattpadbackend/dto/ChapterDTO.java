package lk.ijse.wattpadbackend.dto;

import jakarta.persistence.Column;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ChapterDTO {

    private long id;
    private String title;
    private String coverImagePath;
    private String views;
    private String likes;
    private String comments;
    private int isPublishedOrDraft;
    private long storyId;
    private String storyTitle;
    private String storyCoverImagePath;
    private int isWattpadOriginal;
    private long userId;
    private String username;
    private String userProfilePicPath;
    private int isLiked;
    private List<ParagraphDTO> paragraphDTOList;
    private List<ChapterSimpleDTO> chapterSimpleDTOList;
    private int isFromCurrentUser;
    private int isUnlocked;
    private int chapterCoins;
    private int storyCoins;
}














