package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.*;
import lk.ijse.wattpadbackend.service.StoryService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/story")
@RequiredArgsConstructor
public class StoryController {

    private final StoryService storyService;

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public APIResponse welcomeMessage(){

        return new APIResponse(202,"WELCOME TO STORY PAGE",null);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public APIResponse welcomeMessage2(){

        return new APIResponse(202,"WELCOME TO STORY PAGE(ADMIN)",null);
    }

    @GetMapping("/isCurrentUser/{storyId}")
    @PreAuthorize("hasRole('USER')")
    public APIResponse checkIfStoryIsOwnedByCurrentUser(@PathVariable long storyId){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        boolean result = storyService.checkIfStoryIsOwnedByCurrentUser(auth.getName(),storyId);
        return new APIResponse(202,"Successfully check is story from current user or not",result);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public APIResponse getAStoryById(@PathVariable long id){

        StoryDTO storyDTO = storyService.getAStoryById(id);

        return new APIResponse(202,"Story data successfully loaded for story id: "+id,storyDTO);
    }

    @GetMapping("/get/{id}")
    @PreAuthorize("hasRole('USER')")
    public APIResponse getAStoryByIdTwo(@PathVariable long id){

        StoryDTO storyDTO = storyService.getAStoryByIdTwo(id);

        return new APIResponse(202,"Story data(ignore published or draft) successfully loaded for story id: "+id,storyDTO);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('USER')")
    public APIResponse createANewStory(@RequestParam("title") String title,
                                       @RequestParam("description") String description,
                                       @RequestParam("mainCharacters") List<String> mainCharacters,
                                       @RequestParam("category") String category,
                                       @RequestParam("tags") String tags,
                                       @RequestParam("targetAudience") String targetAudience,
                                       @RequestParam("language") String language,
                                       @RequestParam("copyright") String copyright,
                                       @RequestParam("isMature") String isMature,
                                       @RequestParam("coverImageUrl") String coverImageUrl){

//        boolean hasValidCoverImage = coverImage != null && !coverImage.isEmpty() && coverImage.getSize() > 0;
//        System.out.println("Has valid cover image: " + hasValidCoverImage);
//
//        if (hasValidCoverImage) {
//            System.out.println("Cover Image Size: " + coverImage.getSize());
//            System.out.println("Cover Image Name: " + coverImage.getOriginalFilename());
//        }

        StoryCreateDTO storyCreateDTO = new StoryCreateDTO();
        storyCreateDTO.setStatus(0);
        storyCreateDTO.setRating(Integer.parseInt(isMature));
        storyCreateDTO.setDescription(description);
        storyCreateDTO.setTitle(title);
        storyCreateDTO.setCharacters(mainCharacters);
        storyCreateDTO.setTags(tags);
        storyCreateDTO.setCopyright(copyright);
        storyCreateDTO.setTargetAudience(targetAudience);
        storyCreateDTO.setLanguage(language);
        storyCreateDTO.setCategory(category);
        storyCreateDTO.setCoverImagePath(coverImageUrl);


//        if (hasValidCoverImage) {
//            try {
//                String originalFileName = coverImage.getOriginalFilename();
//                System.out.println("original file name: "+originalFileName);
//                String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
//                System.out.println("extension: "+extension);
//
//                String sanitizedTitle = title.replaceAll("[^a-zA-Z0-9]", "_");
//                System.out.println("sani: "+sanitizedTitle);
//                String uniqueFileName = System.currentTimeMillis() + "_" + sanitizedTitle + extension;
//                System.out.println("unique: "+uniqueFileName);
//
//                String uploadDir = "C:/wattpad-uploads";
//                System.out.println("dir: "+uploadDir);
//                File uploadPath = new File(uploadDir);
//                if (!uploadPath.exists()) {
//                    uploadPath.mkdirs();
//                }
//
//                File destinationFile = new File(uploadPath, uniqueFileName);
//                coverImage.transferTo(destinationFile);
//                storyRequestDTO.setCoverImagePath(uniqueFileName);
//                System.out.println("Successfully uploaded cover image: " + uniqueFileName);
//            } catch (Exception fileException) {
//                System.err.println("Error processing cover image: " + fileException.getMessage());
//                // Continue without the image rather than failing completely
//            }
//        } else {
//            System.out.println("No cover image provided, creating story without image");
//        }

        System.out.println(storyCreateDTO);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        CreateStoryResponseDTO createStoryResponseDTO = storyService.createANewStory(auth.getName(), storyCreateDTO);
        return new APIResponse(202,"Successfully created a new story.",createStoryResponseDTO);
    }

    @GetMapping("/published/user")
    @PreAuthorize("hasRole('USER')")
    public APIResponse loadPublishedStoriesOfCurrentUser(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        List<MyStorySingleStoryDTO> myStorySingleStoryDTOList = storyService.loadPublishedStoriesOfCurrentUser(auth.getName());
        return new APIResponse(202,"Successfully loaded all published stories of current user",myStorySingleStoryDTOList);
    }

    @GetMapping("/all/user")
    @PreAuthorize("hasRole('USER')")
    public APIResponse loadAllStoriesOfCurrentUser(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        List<MyStorySingleStoryDTO> myStorySingleStoryDTOList = storyService.loadAllStoriesOfCurrentUser(auth.getName());
        return new APIResponse(202,"Successfully loaded all stories of current user",myStorySingleStoryDTOList);
    }

    @GetMapping("/chapters/{storyId}")
    @PreAuthorize("hasRole('USER')")
    public APIResponse loadAllChaptersOfAStoryByStoryId(@PathVariable long storyId){

        List<EditStoryChapterDTO> editStoryChapterDTOList = storyService.loadAllChaptersOfAStoryByStoryId(storyId);
        return new APIResponse(202,"Successfully loaded all chapters of a story id: "+storyId,editStoryChapterDTOList);
    }

    @GetMapping("/data/{storyId}")
    @PreAuthorize("hasRole('USER')")
    public APIResponse loadStoryDetailsByStoryId(@PathVariable long storyId){

        StoryCreateDTO storyCreateDTO = storyService.loadStoryDetailsByStoryId(storyId);
        return new APIResponse(202,"Successfully loaded all data of story id: "+storyId,storyCreateDTO);
    }

    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('USER')")
    public APIResponse updateAStory(@RequestParam("storyId") long id,
                                    @RequestParam("title") String title,
                                    @RequestParam("status") int status,
                                       @RequestParam("description") String description,
                                       @RequestParam("mainCharacters") List<String> mainCharacters,
                                       @RequestParam("category") String category,
                                       @RequestParam("tags") String tags,
                                       @RequestParam("targetAudience") String targetAudience,
                                       @RequestParam("language") String language,
                                       @RequestParam("copyright") String copyright,
                                       @RequestParam("isMature") String isMature,
                                       @RequestParam("coverImageUrl") String coverImageUrl){

        StoryCreateDTO storyCreateDTO = new StoryCreateDTO();
        storyCreateDTO.setId(id);
        storyCreateDTO.setStatus(status);
        storyCreateDTO.setRating(Integer.parseInt(isMature));
        storyCreateDTO.setDescription(description);
        storyCreateDTO.setTitle(title);
        storyCreateDTO.setCharacters(mainCharacters);
        storyCreateDTO.setTags(tags);
        storyCreateDTO.setCopyright(copyright);
        storyCreateDTO.setTargetAudience(targetAudience);
        storyCreateDTO.setLanguage(language);
        storyCreateDTO.setCategory(category);
        storyCreateDTO.setCoverImagePath(coverImageUrl);

        System.out.println(storyCreateDTO);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        storyService.updateAStory(auth.getName(), storyCreateDTO);
        return new APIResponse(202,"Successfully update the story id: "+id,null);
    }

    @PostMapping("/unpublish/{storyId}")
    @PreAuthorize("hasRole('USER')")
    public APIResponse unpublishedStoryByStoryId(@PathVariable long storyId){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        storyService.unpublishedStoryByStoryId(auth.getName(),storyId);
        return new APIResponse(202,"Successfully unpublished story id: "+storyId,null);
    }

    @PostMapping("/publish/{storyId}")
    @PreAuthorize("hasRole('USER')")
    public APIResponse publishedStoryByStoryId(@PathVariable long storyId){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        boolean result = storyService.publishedStoryByStoryId(auth.getName(),storyId);
        return new APIResponse(202,"Story published result",result);
    }

    @DeleteMapping("/delete/{storyId}")
    @PreAuthorize("hasRole('USER')")
    public APIResponse deleteStoryByStoryId(@PathVariable long storyId){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        storyService.deleteStoryByStoryId(auth.getName(),storyId);
        return new APIResponse(202,"Successfully deleted story id: "+storyId,null);
    }

    @PostMapping("/admin/loadStory/{no}")
    @PreAuthorize("hasRole('ADMIN')")
    public APIResponse loadStoriesForAdminBySortingCriteria(@PathVariable long no, @RequestBody AdminStoryRequestDTO adminStoryRequestDTO){

        AdminStoryResponseDTO adminStoryResponseDTO = storyService.loadStoriesForAdminBySortingCriteria(no,adminStoryRequestDTO);
        return new APIResponse(202,"Successfully load stories for admin part by sort criteria", adminStoryResponseDTO);
    }

    @PostMapping("/admin/unpublish/{storyId}")
    @PreAuthorize("hasRole('ADMIN')")
    public APIResponse storyUnpublishByAdmin(@PathVariable long storyId){

        storyService.storyUnpublishByAdmin(storyId);
        return new APIResponse(202,"Successfully unpublished the story id : "+storyId, null);
    }
}














