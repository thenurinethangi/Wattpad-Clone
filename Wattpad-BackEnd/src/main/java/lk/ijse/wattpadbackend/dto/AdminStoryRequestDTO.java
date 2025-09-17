package lk.ijse.wattpadbackend.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class AdminStoryRequestDTO {

    private String status;
    private String type;
    private String rank;
    private String report;
}
