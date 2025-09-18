package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.AdminAnnouncementDTO;
import lk.ijse.wattpadbackend.dto.AdminAnnouncementRequestDTO;
import lk.ijse.wattpadbackend.dto.AdminAnnouncementResponseDTO;

import java.util.List;

public interface AnnouncementService {

    AdminAnnouncementResponseDTO loadAnnouncementForAdminBySortingCriteria(long no, AdminAnnouncementRequestDTO adminAnnouncementRequestDTO);

    void deleteAnnouncement(long id);

    List<AdminAnnouncementDTO> searchAnnouncementByUserId(long userId);

    void addNewAnnouncement(AdminAnnouncementDTO adminAnnouncementDTO);
}
