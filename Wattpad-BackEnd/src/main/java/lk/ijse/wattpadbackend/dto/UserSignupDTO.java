package lk.ijse.wattpadbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class UserSignupDTO {

    @NotBlank(message = "Username is required.")
    @Pattern(regexp = "^[a-zA-Z0-9_]{3,20}$", message = "Username is invalid.")
    private String username;

    @NotBlank(message = "Full Name is required.")
    @Pattern(regexp = "^[A-Za-z]+(?:\\s[A-Za-z]+)+$", message = "Full Name is invalid.")
    private String fullName;

    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$", message = "Email is invalid.")
    private String email;

    @Pattern(regexp = "^(?=.*\\d).{7,}$", message = "Your password should be 7 or more characters and include at least one digit..")
    private String password;

    @NotBlank(message = "Birthday is required.")
    @Pattern(regexp = "^(19|20)\\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$", message = "Birthday is invalid.")
    private String birthday;

    private String pronouns;

    private String idToken;
}
