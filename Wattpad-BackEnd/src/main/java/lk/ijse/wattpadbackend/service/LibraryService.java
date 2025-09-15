package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.LibraryStoryDTO;

import java.util.List;

public interface LibraryService {

    List<LibraryStoryDTO> getLibraryStories(String name);

    void deleteAStoryInLibraryByStoryId(String name, long storyId);

    boolean checkSpecificStoryExitInTheLibraryByChapterId(String name, long chapterId);

    void addStoryToLibraryByChapterId(String name, long chapterId);

    boolean checkSpecificStoryExitInTheLibraryByStoryId(String name, long storyId);

    void addOrRemoveStoryToLibraryByStoryId(String name, long storyId);
}
