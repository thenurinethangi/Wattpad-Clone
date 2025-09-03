package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.ChapterDTO;
import lk.ijse.wattpadbackend.dto.StoryDTO;
import lk.ijse.wattpadbackend.dto.StoryIdsDTO;

import java.util.List;

public interface ChapterService {

    ChapterDTO getAChapterById(String username,long id);

    List<StoryDTO> getRecommendationStories(String username, StoryIdsDTO storyIdsDTO);

    List<StoryDTO> getAlsoYouWillLikeStories(String name, StoryIdsDTO storyIdsDTO);

    String addLikeOrRemove(String name, long chapterId);
}
