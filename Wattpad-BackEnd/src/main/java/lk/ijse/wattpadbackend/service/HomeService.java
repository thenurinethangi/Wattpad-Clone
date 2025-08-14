package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.LibraryStoryResponseDTO;

import java.util.List;

public interface HomeService {

    List<LibraryStoryResponseDTO> yourStories(String name);
}
