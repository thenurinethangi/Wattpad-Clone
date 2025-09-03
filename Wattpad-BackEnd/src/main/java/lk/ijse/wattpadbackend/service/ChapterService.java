package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.ChapterDTO;
import lk.ijse.wattpadbackend.dto.StoryDTO;

import java.util.List;

public interface ChapterService {

    ChapterDTO getAChapterById(long id);

    List<StoryDTO> getRecommendationStories(String username);
}
