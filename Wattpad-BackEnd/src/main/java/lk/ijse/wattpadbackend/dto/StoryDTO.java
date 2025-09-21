package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.math.BigInteger;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class  StoryDTO {

    private long id;
    private String title;
    private String description;
    private String copyright;
    private int rating;
    private int status;
    private String views;
    private String likes;
    private BigInteger parts;
    private String coverImagePath;
    private long userId;
    private String username;
    private String userEmail;
    private String profilePicPath;
    private List<String> tags;
    private List<ChapterSimpleDTO> chapterSimpleDTOList;
    private int publishedOrDraft;
    private int isWattpadOriginal;
}







