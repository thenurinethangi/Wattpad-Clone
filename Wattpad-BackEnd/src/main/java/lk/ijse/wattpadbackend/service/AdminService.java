package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.AdminAdminResponseDTO;
import lk.ijse.wattpadbackend.dto.AdminDTO;
import lk.ijse.wattpadbackend.dto.AdminRequestDTO;

public interface AdminService {

    AdminAdminResponseDTO loadAdminForAdminBySortingCriteria(long no, AdminRequestDTO adminRequestDTO);

    boolean createANewAdmin(AdminDTO adminDTO);

    boolean deactivateAdmin(long id);

    AdminDTO getAdminById(long id);
}
