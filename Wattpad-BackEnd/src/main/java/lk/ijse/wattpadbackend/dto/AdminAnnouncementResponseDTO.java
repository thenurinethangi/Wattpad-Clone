package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class AdminAnnouncementResponseDTO {

    private long totalAnnouncements;
    private long start;
    private long end;
    private List<AdminAnnouncementDTO> adminAnnouncementDTOList;
}
