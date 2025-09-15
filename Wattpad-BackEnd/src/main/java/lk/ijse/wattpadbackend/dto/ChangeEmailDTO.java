package lk.ijse.wattpadbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ChangeEmailDTO {

    @NotBlank(message = "New email is required")
    @Pattern(
            regexp = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
            message = "Email is invalid."
    )
    private String newEmail;

    @NotBlank(message = "Password is required")
    private String password;
}
