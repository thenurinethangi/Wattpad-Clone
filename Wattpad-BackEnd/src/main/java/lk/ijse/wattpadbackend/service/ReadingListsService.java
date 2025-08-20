package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.ReadingListsDTO;

public interface ReadingListsService {

    ReadingListsDTO getAllReadingLists(String name);

    void deleteReadingListById(long id);
}
