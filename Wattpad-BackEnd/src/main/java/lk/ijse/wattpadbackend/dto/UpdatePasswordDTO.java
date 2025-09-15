package lk.ijse.wattpadbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class UpdatePasswordDTO {

    @NotBlank(message = "Current Password is required")
    private String currentPassword;

    @NotBlank(message = "New Password is required")
    @Pattern(regexp = "^(?=.*\\d).{7,}$", message = "new Password is invalid.")
    private String newPassword;
}




