package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.*;
import lk.ijse.wattpadbackend.entity.*;
import lk.ijse.wattpadbackend.exception.NotFoundException;
import lk.ijse.wattpadbackend.repository.AnnouncementRepository;
import lk.ijse.wattpadbackend.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    @Override
    public AdminAnnouncementResponseDTO loadAnnouncementForAdminBySortingCriteria(long no, AdminAnnouncementRequestDTO adminAnnouncementRequestDTO) {

        try{
            List<Announcement> announcementList = announcementRepository.findAll();

            AdminAnnouncementResponseDTO adminAnnouncementResponseDTO = new AdminAnnouncementResponseDTO();
            adminAnnouncementResponseDTO.setTotalAnnouncements(announcementList.size());

            List<Announcement> sortAfterType = new ArrayList<>();
            for (Announcement x : announcementList){
                if(adminAnnouncementRequestDTO.getType().equals("all")){
                    sortAfterType.add(x);
                }
                else if (adminAnnouncementRequestDTO.getType().equals("verified")) {
                    if(x.getSendTo().equalsIgnoreCase("verified")){
                        sortAfterType.add(x);
                    }
                }
                else if (adminAnnouncementRequestDTO.getType().equals("specific")) {
                    if(x.getSendTo().equalsIgnoreCase("specific")){
                        sortAfterType.add(x);
                    }
                }
            }

            List<Announcement> sortAfterDate = new ArrayList<>();
            for (Announcement x : sortAfterType){
                if(adminAnnouncementRequestDTO.getDate()==null){
                    sortAfterDate.add(x);
                }
                else if (adminAnnouncementRequestDTO.getDate()!=null) {
                    if (x.getDateTime().toLocalDate().isEqual(adminAnnouncementRequestDTO.getDate())) {
                        sortAfterDate.add(x);
                    }
                }
            }

            long end = (no*12)-1;
            long start = ((end+1)-12);

            List<Announcement> sortAfterCount = new ArrayList<>();
            if(sortAfterDate.size()>start){
                for (long i = start; i <= end; i++) {
                    if(i<sortAfterDate.size()){
                        sortAfterCount.add(sortAfterDate.get((int) i));
                    }
                    else{
                        break;
                    }
                }
            }

            adminAnnouncementResponseDTO.setStart(start+1);
            adminAnnouncementResponseDTO.setEnd(end+1);

            List<AdminAnnouncementDTO> adminAnnouncementDTOS = new ArrayList<>();
            for (Announcement x : sortAfterCount){
                AdminAnnouncementDTO adminAnnouncementDTO = new AdminAnnouncementDTO();
                adminAnnouncementDTO.setId(x.getId());
                adminAnnouncementDTO.setTitle(x.getTitle());
                adminAnnouncementDTO.setDescription(x.getDescription());
                adminAnnouncementDTO.setSentTo(x.getSendTo());
                adminAnnouncementDTO.setUserId(x.getUserId());

                LocalDateTime ldt = x.getDateTime();
                String formatted = ldt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                adminAnnouncementDTO.setDateTime(formatted);

                adminAnnouncementDTOS.add(adminAnnouncementDTO);
            }

            adminAnnouncementResponseDTO.setAdminAnnouncementDTOList(adminAnnouncementDTOS);
            return adminAnnouncementResponseDTO;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public void deleteAnnouncement(long id) {

        try{
           Optional<Announcement> optionalAnnouncement = announcementRepository.findById((int) id);
           if(!optionalAnnouncement.isPresent()){
               throw new NotFoundException("Announcement not found.");
           }
           Announcement announcement = optionalAnnouncement.get();

           announcementRepository.delete(announcement);
           announcementRepository.flush();

        }
        catch (NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<AdminAnnouncementDTO> searchAnnouncementByUserId(long userId) {

        try {
            List<Announcement> announcementList = announcementRepository.findAllByUserId(userId);

            List<AdminAnnouncementDTO> adminAnnouncementDTOS = new ArrayList<>();
            for (Announcement x : announcementList){
                AdminAnnouncementDTO adminAnnouncementDTO = new AdminAnnouncementDTO();
                adminAnnouncementDTO.setId(x.getId());
                adminAnnouncementDTO.setTitle(x.getTitle());
                adminAnnouncementDTO.setDescription(x.getDescription());
                adminAnnouncementDTO.setSentTo(x.getSendTo());
                adminAnnouncementDTO.setUserId(x.getUserId());

                LocalDateTime ldt = x.getDateTime();
                String formatted = ldt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                adminAnnouncementDTO.setDateTime(formatted);

                adminAnnouncementDTOS.add(adminAnnouncementDTO);
            }

            return adminAnnouncementDTOS;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void addNewAnnouncement(AdminAnnouncementDTO adminAnnouncementDTO) {

        try{
            Announcement announcement = new Announcement();
            announcement.setTitle(adminAnnouncementDTO.getTitle());
            announcement.setDescription(adminAnnouncementDTO.getDescription());
            announcement.setSendTo(adminAnnouncementDTO.getSentTo());
            announcement.setUserId(adminAnnouncementDTO.getUserId());

            announcementRepository.save(announcement);

        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}















