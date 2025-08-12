package lk.ijse.wattpadbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserDTO {

    private long id;

    private String username;

    private String fullName;

    private String email;

    private String password;

    private Date birthday;

    private String pronouns;

    private String about;

    private Date joinedDate;

    private String websiteLink;

    private String facebookLink;

    private String location;

    private String profilePicPath;

    private String coverPicPath;

    private int isVerify;

    private int isActive;
}
