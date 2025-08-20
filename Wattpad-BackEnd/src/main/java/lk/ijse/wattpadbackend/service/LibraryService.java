package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.LibraryStoryDTO;

import java.util.List;

public interface LibraryService {

    List<LibraryStoryDTO> getLibraryStories(String name);

    void deleteAStoryInLibraryByStoryId(String name, long storyId);
}
