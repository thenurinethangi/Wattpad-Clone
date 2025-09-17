package lk.ijse.wattpadbackend.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class AdminUserRequestDTO {

    private String status;
    private String type;
    private String rank;
}
