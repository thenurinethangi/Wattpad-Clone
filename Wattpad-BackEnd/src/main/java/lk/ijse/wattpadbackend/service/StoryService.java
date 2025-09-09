package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.*;

import java.util.List;

public interface StoryService {

    StoryDTO getAStoryById(long id);

    CreateStoryResponseDTO createANewStory(String name, StoryCreateDTO storyCreateDTO);

    StoryDTO getAStoryByIdTwo(long id);

    List<MyStorySingleStoryDTO> loadPublishedStoriesOfCurrentUser(String name);

    List<MyStorySingleStoryDTO> loadAllStoriesOfCurrentUser(String name);

    boolean checkIfStoryIsOwnedByCurrentUser(String name, long storyId);

    List<EditStoryChapterDTO> loadAllChaptersOfAStoryByStoryId(long storyId);

    StoryCreateDTO loadStoryDetailsByStoryId(long storyId);
}
