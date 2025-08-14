package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.math.BigInteger;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class LibraryStoryResponseDTO {

    private String title;
    private BigInteger views;
    private BigInteger likes;
    private BigInteger parts;
    private String coverImagePath;
    private int newPartCount;
    private int lastOpenedPage;
    private long lastReadChapterId;
    private long authorId;
    private String authorUsername;
    private String authorProfilePicPath;
}























