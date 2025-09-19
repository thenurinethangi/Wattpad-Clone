package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.StoryReportRequestDTO;
import lk.ijse.wattpadbackend.entity.Story;
import lk.ijse.wattpadbackend.entity.StoryReport;
import lk.ijse.wattpadbackend.entity.User;
import lk.ijse.wattpadbackend.exception.NotFoundException;
import lk.ijse.wattpadbackend.exception.UserNotFoundException;
import lk.ijse.wattpadbackend.repository.StoryReportRepository;
import lk.ijse.wattpadbackend.repository.StoryRepository;
import lk.ijse.wattpadbackend.repository.UserRepository;
import lk.ijse.wattpadbackend.service.StoryReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StoryReportServiceImpl implements StoryReportService {

    private final StoryReportRepository storyReportRepository;
    private final UserRepository userRepository;
    private final StoryRepository storyRepository;

    @Override
    public void addReport(String name, StoryReportRequestDTO storyReportRequestDTO) {

        try{
           User user = userRepository.findByUsername(name);
           if(user==null){
               throw new UserNotFoundException("User not found.");
           }

           Optional<Story> optionalStory = storyRepository.findById((int) storyReportRequestDTO.getStoryId());
           if(!optionalStory.isPresent()){
               throw new NotFoundException("Story not found.");
           }
           Story story = optionalStory.get();

           StoryReport storyReport = new StoryReport();
           storyReport.setStory(story);
           storyReport.setUser(user);
           storyReport.setReportedAt(LocalDate.now());
           storyReport.setCategory(storyReportRequestDTO.getCategory());
           storyReport.setReason(storyReportRequestDTO.getReason());
           storyReport.setDescription(storyReportRequestDTO.getDescription());

           storyReportRepository.save(storyReport);

        }
        catch (UserNotFoundException | NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}














