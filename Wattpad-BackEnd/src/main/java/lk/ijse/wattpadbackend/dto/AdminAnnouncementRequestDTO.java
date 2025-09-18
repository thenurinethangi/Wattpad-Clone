package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class AdminAnnouncementRequestDTO {

    private LocalDate date;
    private String type;
}
