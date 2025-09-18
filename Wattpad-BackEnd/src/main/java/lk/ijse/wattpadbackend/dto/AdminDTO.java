package lk.ijse.wattpadbackend.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class AdminDTO {

    private long id;
    private String fullName;
    private String username;
    private String email;
    private String Password;
    private String pronouns;
    private String profilePicPath;
    private int isActive;
}
