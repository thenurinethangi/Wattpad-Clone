package lk.ijse.wattpadbackend.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class AdminAnnouncementDTO {

    private long id;
    private String title;
    private String description;
    private String dateTime;
    private String sentTo;
    private Long userId;
}
