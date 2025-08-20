package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.ReadingListEditResponseDTO;
import lk.ijse.wattpadbackend.dto.ReadingListsDTO;

public interface ReadingListService {

    ReadingListsDTO getAllReadingLists(String name);

    void deleteReadingListById(long id);

    ReadingListEditResponseDTO getAllStoriesOfReadingListById(long id);
}
