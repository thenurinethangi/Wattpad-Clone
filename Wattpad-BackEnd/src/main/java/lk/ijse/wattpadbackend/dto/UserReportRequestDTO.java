package lk.ijse.wattpadbackend.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
public class UserReportRequestDTO {

    private long userId;
    private String category;
    private String reason;
    private String description;
}
