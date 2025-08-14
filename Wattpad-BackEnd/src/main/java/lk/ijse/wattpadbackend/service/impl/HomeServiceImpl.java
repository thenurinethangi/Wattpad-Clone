package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.LibraryStoryResponseDTO;
import lk.ijse.wattpadbackend.entity.Chapter;
import lk.ijse.wattpadbackend.entity.Library;
import lk.ijse.wattpadbackend.entity.LibraryStory;
import lk.ijse.wattpadbackend.entity.User;
import lk.ijse.wattpadbackend.exception.UserNotFoundException;
import lk.ijse.wattpadbackend.repository.ChapterRepository;
import lk.ijse.wattpadbackend.repository.LibraryRepository;
import lk.ijse.wattpadbackend.repository.UserRepository;
import lk.ijse.wattpadbackend.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HomeServiceImpl implements HomeService {

    private final UserRepository userRepository;
    private final LibraryRepository libraryRepository;
    private final ChapterRepository chapterRepository;

    @Override
    public List<LibraryStoryResponseDTO> yourStories(String name) {

        User user = userRepository.findByUsername(name);

        if(user==null){
            throw new UserNotFoundException("User not found.");
        }

        Library library = libraryRepository.findByUser(user);
        List<LibraryStory> libraryStories = library.getLibraryStories();

        List<LibraryStory> libraryStoriesOrdered = libraryStories.stream()
                .sorted(Comparator.comparing(
                        LibraryStory::getLastOpenedAt,
                        Comparator.nullsLast(Comparator.reverseOrder()) // latest → oldest, nulls last
                ))
                .toList();

        List<LibraryStoryResponseDTO> libraryStoryResponseDTOS = new ArrayList<>();
        for (LibraryStory x : libraryStoriesOrdered){
            LibraryStoryResponseDTO libraryStoryResponseDTO = new LibraryStoryResponseDTO();
            libraryStoryResponseDTO.setTitle(x.getStory().getTitle());
            libraryStoryResponseDTO.setParts(x.getStory().getParts());
            libraryStoryResponseDTO.setViews(x.getStory().getViews());
            libraryStoryResponseDTO.setLikes(x.getStory().getLikes());
            libraryStoryResponseDTO.setCoverImagePath(x.getStory().getCoverImagePath());
            libraryStoryResponseDTO.setAuthorId(x.getStory().getUser().getId());
            libraryStoryResponseDTO.setAuthorUsername(x.getStory().getUser().getUsername());
            libraryStoryResponseDTO.setAuthorProfilePicPath(x.getStory().getUser().getProfilePicPath());
            libraryStoryResponseDTO.setLastOpenedPage(x.getLastOpenedPage());

            //set last opened chapter id
            int lastOpenedPage = x.getLastOpenedPage();
            lastOpenedPage--;

            List<Chapter> chapterList = chapterRepository.findAllByStory(x.getStory());
            Chapter lastOpenedChapter = chapterList.get(lastOpenedPage);

            libraryStoryResponseDTO.setLastReadChapterId(lastOpenedChapter.getId());

            LocalDateTime twoWeeksAgo = LocalDateTime.now().minusWeeks(2);
            int newPartCount = 0;
            for (Chapter y : chapterList){
                LocalDateTime publishedDate = y.getPublishedDate();

                if (publishedDate.isAfter(twoWeeksAgo) && publishedDate.isBefore(LocalDateTime.now())) {
                    System.out.println("Date is within the last 2 weeks.");
                    newPartCount++;
                } else {
                    System.out.println("Date is NOT within the last 2 weeks.");
                }
            }
            libraryStoryResponseDTO.setNewPartCount(newPartCount);

            libraryStoryResponseDTOS.add(libraryStoryResponseDTO);
        }

        System.out.println(libraryStoryResponseDTOS);
        for (LibraryStoryResponseDTO x : libraryStoryResponseDTOS){
            System.out.println(x);
        }

        return libraryStoryResponseDTOS;
    }
}





















