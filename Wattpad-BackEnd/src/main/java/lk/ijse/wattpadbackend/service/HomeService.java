package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.HomeGenreStoriesRequestDTO;
import lk.ijse.wattpadbackend.dto.LibraryStoryResponseDTO;
import lk.ijse.wattpadbackend.dto.ReadingListHomeResponseDTO;
import lk.ijse.wattpadbackend.dto.StoryHomeResponseDTO;

import java.util.List;

public interface HomeService {

    List<LibraryStoryResponseDTO> yourStories(String name);

    List<StoryHomeResponseDTO> topPickupForYou(String name);

    List<StoryHomeResponseDTO> hotWattpadReads(String name);

    List<ReadingListHomeResponseDTO> readingLists(String name);

    List<StoryHomeResponseDTO> storiesFromGenreYouLike(String name, HomeGenreStoriesRequestDTO homeGenreStoriesRequestDTO);

    List<StoryHomeResponseDTO> storiesFromWritersYouLike(String name, HomeGenreStoriesRequestDTO homeGenreStoriesRequestDTO);

    List<StoryHomeResponseDTO> recommendationForYou(String name, HomeGenreStoriesRequestDTO homeGenreStoriesRequestDTO);

    List<StoryHomeResponseDTO> completedStories(String name, HomeGenreStoriesRequestDTO homeGenreStoriesRequestDTO);

    List<StoryHomeResponseDTO> trySomethingNew(String name, HomeGenreStoriesRequestDTO homeGenreStoriesRequestDTO);

    List<List<StoryHomeResponseDTO>> moreStories(String name, HomeGenreStoriesRequestDTO homeGenreStoriesRequestDTO);
}
