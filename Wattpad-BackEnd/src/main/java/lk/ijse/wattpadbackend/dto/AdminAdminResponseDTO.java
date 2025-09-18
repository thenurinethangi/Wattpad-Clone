package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class AdminAdminResponseDTO {

    private long totalAdmins;
    private long start;
    private long end;
    private List<AdminDTO> adminDTOList;
}
