package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.UserReportRequestDTO;
import lk.ijse.wattpadbackend.entity.Story;
import lk.ijse.wattpadbackend.entity.StoryReport;
import lk.ijse.wattpadbackend.entity.User;
import lk.ijse.wattpadbackend.entity.UserReport;
import lk.ijse.wattpadbackend.exception.NotFoundException;
import lk.ijse.wattpadbackend.exception.UserNotFoundException;
import lk.ijse.wattpadbackend.repository.UserReportRepository;
import lk.ijse.wattpadbackend.repository.UserRepository;
import lk.ijse.wattpadbackend.service.UserReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserReportServiceImpl implements UserReportService {

    private final UserReportRepository userReportRepository;
    private final UserRepository userRepository;

    @Override
    public void addReport(String name, UserReportRequestDTO userReportRequestDTO) {

        try{
            User currentUser = userRepository.findByUsername(name);
            if(currentUser==null){
                throw new UserNotFoundException("Current User not found.");
            }

            Optional<User> optionalUser = userRepository.findById((int) userReportRequestDTO.getUserId());
            if(!optionalUser.isPresent()){
                throw new NotFoundException("User not found.");
            }
            User user = optionalUser.get();

            UserReport userReport = new UserReport();
            userReport.setUser(user);
            userReport.setRepotedByUser(currentUser);
            userReport.setCategory(userReportRequestDTO.getCategory());
            userReport.setReason(userReportRequestDTO.getReason());
            userReport.setDescription(userReportRequestDTO.getDescription());

            userReportRepository.save(userReport);

        }
        catch (UserNotFoundException | NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}

















