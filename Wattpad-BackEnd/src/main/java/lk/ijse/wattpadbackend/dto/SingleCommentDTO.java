package lk.ijse.wattpadbackend.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class SingleCommentDTO {

    private long id;
    private String commentMessage;
    private String likes;
    private String replyCount;
    private String time;
    private long userId;
    private String username;
    private String userProfilePic;
    private int isCurrentUserLiked;
    private int isCommentByAuthor;
}
