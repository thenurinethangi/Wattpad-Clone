package lk.ijse.wattpadbackend.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ReplyResponseDTO {

    private long replyId;
    private long paragraphCommentId;
    private String replyMessage;
    private String likes;
    private String time;
    private long userId;
    private String username;
    private String userProfilePic;
    private int isCurrentUserLiked;
    private int isCommentByAuthor;
}
