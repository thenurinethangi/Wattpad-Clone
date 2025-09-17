package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.math.BigInteger;
import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class AdminStoryDTO {

    private long id;
    private String title;
    private int status;
    private String views;
    private String likes;
    private String comments;
    private BigInteger parts;
    private String genre;
    private LocalDate publishedDate;
    private String coverImagePath;
    private int publishedOrDraft;
    private String totalReports;
    private String recentReports;
    private String rank;
    private int isOriginal;
    private long userId;
    private String username;
}











