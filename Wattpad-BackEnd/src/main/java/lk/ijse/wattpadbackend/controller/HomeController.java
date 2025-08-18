package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.HomeGenreStoriesRequestDTO;
import lk.ijse.wattpadbackend.dto.LibraryStoryResponseDTO;
import lk.ijse.wattpadbackend.dto.ReadingListHomeResponseDTO;
import lk.ijse.wattpadbackend.dto.StoryHomeResponseDTO;
import lk.ijse.wattpadbackend.service.HomeService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/home")
@RequiredArgsConstructor
public class HomeController {

    private final HomeService homeService;

    @GetMapping
    public APIResponse home(){
        return new APIResponse(202,"WELCOME TO WATTPAD HOME PAGE",null);
    }

    @GetMapping("/yourStories")
    public APIResponse yourStories(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        List<LibraryStoryResponseDTO> libraryStoryResponseDTOList = homeService.yourStories(auth.getName());
        return new APIResponse(202,"Your stories successfully loaded from backend",libraryStoryResponseDTOList);
    }

    @GetMapping("/topPickupForYou")
    public APIResponse topPickupForYou(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        List<StoryHomeResponseDTO> storyHomeResponseDTOList = homeService.topPickupForYou(auth.getName());
        return new APIResponse(202,"Top Pickup For You successfully loaded from backend",storyHomeResponseDTOList);
    }

    @GetMapping("/hotWattpadReads")
    public APIResponse hotWattpadReads(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        List<StoryHomeResponseDTO> storyHomeResponseDTOList = homeService.hotWattpadReads(auth.getName());
        return new APIResponse(202,"Hot Wattpad Reads successfully loaded from backend",storyHomeResponseDTOList);
    }

    @GetMapping("/readingLists")
    public APIResponse readingLists(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        List<ReadingListHomeResponseDTO> readingListHomeResponseDTOList = homeService.readingLists(auth.getName());
        return new APIResponse(202,"Reading Lists successfully loaded from backend",readingListHomeResponseDTOList);
    }

    @PostMapping("/storiesFromGenreYouLike")
    public APIResponse storiesFromGenreYouLike(@RequestBody HomeGenreStoriesRequestDTO homeGenreStoriesRequestDTO){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        List<StoryHomeResponseDTO> storyHomeResponseDTOList = homeService.storiesFromGenreYouLike(auth.getName(), homeGenreStoriesRequestDTO);
        return new APIResponse(202,"Stories from genres you like successfully loaded from backend",storyHomeResponseDTOList);
    }

    @PostMapping("/storiesFromWritersYouLike")
    public APIResponse storiesFromWritersYouLike(@RequestBody HomeGenreStoriesRequestDTO homeGenreStoriesRequestDTO){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        List<StoryHomeResponseDTO> storyHomeResponseDTOList = homeService.storiesFromWritersYouLike(auth.getName(), homeGenreStoriesRequestDTO);
        return new APIResponse(202,"Stories from writers you like successfully loaded from backend",storyHomeResponseDTOList);
    }

    @PostMapping("/recommendationForYou")
    public APIResponse recommendationForYou(@RequestBody HomeGenreStoriesRequestDTO homeGenreStoriesRequestDTO){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        List<StoryHomeResponseDTO> storyHomeResponseDTOList = homeService.recommendationForYou(auth.getName(), homeGenreStoriesRequestDTO);
        return new APIResponse(202,"Recommendation stories successfully loaded from backend",storyHomeResponseDTOList);
    }

    @PostMapping("/completedStories")
    public APIResponse completedStories(@RequestBody HomeGenreStoriesRequestDTO homeGenreStoriesRequestDTO){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        List<StoryHomeResponseDTO> storyHomeResponseDTOList = homeService.completedStories(auth.getName(), homeGenreStoriesRequestDTO);
        return new APIResponse(202,"Completed stories successfully loaded from backend",storyHomeResponseDTOList);
    }

    @PostMapping("/trySomethingNew")
    public APIResponse trySomethingNew(@RequestBody HomeGenreStoriesRequestDTO homeGenreStoriesRequestDTO){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        List<StoryHomeResponseDTO> storyHomeResponseDTOList  = homeService.trySomethingNew(auth.getName(), homeGenreStoriesRequestDTO);
        return new APIResponse(202,"Try something new stories successfully loaded from backend",storyHomeResponseDTOList);
    }

    @PostMapping("/moreStories")
    public APIResponse moreStories(@RequestBody HomeGenreStoriesRequestDTO homeGenreStoriesRequestDTO){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        List<List<StoryHomeResponseDTO>> lists = homeService.moreStories(auth.getName(), homeGenreStoriesRequestDTO);
        return new APIResponse(202,"More stories successfully loaded from backend",lists);
    }
}




























