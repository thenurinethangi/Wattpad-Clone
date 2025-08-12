package lk.ijse.wattpadbackend.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class UserSignUpResponseDTO {

    private String jwtToke;
    private int otp;

    public UserSignUpResponseDTO(String jwtToke) {
        this.jwtToke = jwtToke;
    }

    public UserSignUpResponseDTO(int otp) {
        this.otp = otp;
    }
}
