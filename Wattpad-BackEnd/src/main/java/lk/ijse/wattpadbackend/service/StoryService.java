package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.StoryDTO;

public interface StoryService {

    StoryDTO getAStoryById(long id);
}
