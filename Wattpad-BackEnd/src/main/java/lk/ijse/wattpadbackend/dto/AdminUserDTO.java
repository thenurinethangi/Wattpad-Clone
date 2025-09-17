package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class AdminUserDTO {

    private long id;
    private String username;
    private String fullName;
    private String email;
    private LocalDate joinedDate;
    private String profilePicPath;
    private String coverPicPath;
    private int isVerify;
    private int isActive;
    private long work;
    private String views;
    private String likes;
    private String totalReports;
    private String recentReports;
    private String engagement;
    private String rank;
}











