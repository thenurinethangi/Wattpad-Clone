package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.AdminAnnouncementDTO;

import java.util.List;

public interface NotificationService {

    List<AdminAnnouncementDTO> getAllNotificationOfCurrentUser(String name);
}
