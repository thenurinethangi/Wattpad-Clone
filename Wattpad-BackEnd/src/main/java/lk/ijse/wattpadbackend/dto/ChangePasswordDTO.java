package lk.ijse.wattpadbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ChangePasswordDTO {

    @NotBlank(message = "New Password is required")
    @Pattern(regexp = "^(?=.*\\d).{7,}$", message = "Password is invalid.")
    private String newPassword;

    @NotBlank(message = "confirm Password is required")
    @Pattern(regexp = "^(?=.*\\d).{7,}$", message = "confirm Password is invalid.")
    private String confirmPassword;

    @NotBlank(message = "confirm Password is required")
    private String emailOrUsername;
}
















