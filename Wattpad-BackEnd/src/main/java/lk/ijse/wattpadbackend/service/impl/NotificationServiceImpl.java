package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.AdminAnnouncementDTO;
import lk.ijse.wattpadbackend.entity.Announcement;
import lk.ijse.wattpadbackend.entity.User;
import lk.ijse.wattpadbackend.exception.UserNotFoundException;
import lk.ijse.wattpadbackend.repository.AnnouncementRepository;
import lk.ijse.wattpadbackend.repository.UserRepository;
import lk.ijse.wattpadbackend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;

    @Override
    public List<AdminAnnouncementDTO> getAllNotificationOfCurrentUser(String name) {

        try{
            User user = userRepository.findByUsername(name);
            if(user==null){
                throw new UserNotFoundException("User not found.");
            }

            List<AdminAnnouncementDTO> adminAnnouncementDTOList = new ArrayList<>();

            List<Announcement> announcementList1 = announcementRepository.findAllBySendTo("all");
            for (Announcement x : announcementList1){
                AdminAnnouncementDTO announcementDTO = new AdminAnnouncementDTO();
                announcementDTO.setTitle(x.getTitle());
                announcementDTO.setDescription(x.getDescription());

                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE, MMM d, yyyy, h.mm a", Locale.ENGLISH);
                String formattedDate = x.getDateTime().format(formatter);
                announcementDTO.setDateTime(formattedDate);

                adminAnnouncementDTOList.add(announcementDTO);
            }

            List<Announcement> announcementList2 = announcementRepository.findAllByUserId(user.getId());
            for (Announcement x : announcementList2){
                AdminAnnouncementDTO announcementDTO = new AdminAnnouncementDTO();
                announcementDTO.setTitle(x.getTitle());
                announcementDTO.setDescription(x.getDescription());

                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE, MMM d, yyyy, h.mm a", Locale.ENGLISH);
                String formattedDate = x.getDateTime().format(formatter);
                announcementDTO.setDateTime(formattedDate);

                adminAnnouncementDTOList.add(announcementDTO);
            }

            if(user.getIsVerifiedByWattpad()==1){
                List<Announcement> announcementList3 = announcementRepository.findAllBySendTo("verified");
                for (Announcement x : announcementList3){
                    AdminAnnouncementDTO announcementDTO = new AdminAnnouncementDTO();
                    announcementDTO.setTitle(x.getTitle());
                    announcementDTO.setDescription(x.getDescription());

                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE, MMM d, yyyy, h.mm a", Locale.ENGLISH);
                    String formattedDate = x.getDateTime().format(formatter);
                    announcementDTO.setDateTime(formattedDate);

                    adminAnnouncementDTOList.add(announcementDTO);
                }
            }

            return adminAnnouncementDTOList;

        }
        catch (UserNotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}













