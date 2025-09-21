package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.*;

import java.util.List;

public interface StoryService {

    StoryDTO getAStoryById(String username, long id);

    CreateStoryResponseDTO createANewStory(String name, StoryCreateDTO storyCreateDTO);

    StoryDTO getAStoryByIdTwo(long id);

    List<MyStorySingleStoryDTO> loadPublishedStoriesOfCurrentUser(String name);

    List<MyStorySingleStoryDTO> loadAllStoriesOfCurrentUser(String name);

    boolean checkIfStoryIsOwnedByCurrentUser(String name, long storyId);

    List<EditStoryChapterDTO> loadAllChaptersOfAStoryByStoryId(long storyId);

    StoryCreateDTO loadStoryDetailsByStoryId(long storyId);

    void updateAStory(String name, StoryCreateDTO storyCreateDTO);

    void unpublishedStoryByStoryId(String name, long storyId);

    void deleteStoryByStoryId(String name, long storyId);

    boolean publishedStoryByStoryId(String name, long storyId);

    AdminStoryResponseDTO loadStoriesForAdminBySortingCriteria(long no, AdminStoryRequestDTO adminStoryRequestDTO);

    StoryDTO storyUnpublishByAdmin(long storyId);

    boolean checkThisStoryRestrictedToCurrentUserOrNot(String name, long storyId);
}
