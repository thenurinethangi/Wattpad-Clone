package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.CreateStoryResponseDTO;
import lk.ijse.wattpadbackend.dto.MyStorySingleStoryDTO;
import lk.ijse.wattpadbackend.dto.StoryDTO;
import lk.ijse.wattpadbackend.dto.StoryRequestDTO;

import java.util.List;

public interface StoryService {

    StoryDTO getAStoryById(long id);

    CreateStoryResponseDTO createANewStory(String name, StoryRequestDTO storyRequestDTO);

    StoryDTO getAStoryByIdTwo(long id);

    List<MyStorySingleStoryDTO> loadPublishedStoriesOfCurrentUser(String name);

    List<MyStorySingleStoryDTO> loadAllStoriesOfCurrentUser(String name);
}
