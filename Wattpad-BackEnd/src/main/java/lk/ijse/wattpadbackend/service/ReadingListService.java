package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.*;

import java.util.List;

public interface ReadingListService {

    ReadingListsDTO getAllReadingLists(String name);

    void deleteReadingListById(long id);

    ReadingListEditResponseDTO getAllStoriesOfReadingListById(long id);

    void updateAReadingList(ReadingListEditRequestDTO readingListEditRequestDTO);

    ReadingListEditResponseDTO getAllStoriesInAReadingListById(String username, long id);

    boolean checkIfReadingListOwnedByCurrentUser(String name, long readingListId);

    String addOrRemoveLikeFromTheReadingList(String name, long readingListId);

    List<SingleReadingListDTO> getAllLikedReadingLists(String name);

    List<AddToReadingListResponseDTO> getAllReadingListsAndCheckTheSpecificStoryExit(String name, long chapterId);

    boolean addNewReadingList(String name, CreateNewListRequestDTO createNewListRequestDTO);

    void addOrRemoveStoryToReadingListByChapterId(String name, long listId, long chapterId);

    List<AddToReadingListResponseDTO> getAllReadingListsAndCheckTheSpecificStoryExitByStoryId(String name, long storyId);

    void addOrRemoveStoryToReadingListByStoryId(String name, long listId, long storyId);
}
