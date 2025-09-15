package lk.ijse.wattpadbackend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class UserDataSettingDTO {

    @NotNull(message = "Birthday is required.")
    @Past(message = "Birthday must be in the past.")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate birthday;
}
