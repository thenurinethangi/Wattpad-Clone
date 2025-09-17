package lk.ijse.wattpadbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchUserRequestDTO {

    private String searchTerm;
    private AdminUserRequestDTO sort;
}
