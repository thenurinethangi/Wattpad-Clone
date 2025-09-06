package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.CreateStoryResponseDTO;
import lk.ijse.wattpadbackend.dto.StoryDTO;
import lk.ijse.wattpadbackend.dto.StoryRequestDTO;
import lk.ijse.wattpadbackend.entity.Story;
import lk.ijse.wattpadbackend.service.StoryService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

@RestController
@RequestMapping("/api/v1/story")
@RequiredArgsConstructor
public class StoryController {

    private final StoryService storyService;

    @GetMapping
    public APIResponse welcomeMessage(){

        return new APIResponse(202,"WELCOME TO STORY PAGE",null);
    }

    @GetMapping("/{id}")
    public APIResponse getAStoryById(@PathVariable long id){

        StoryDTO storyDTO = storyService.getAStoryById(id);

        return new APIResponse(202,"Story data successfully loaded for story id: "+id,storyDTO);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public APIResponse createANewStory(@RequestParam("title") String title,
                                       @RequestParam("description") String description,
                                       @RequestParam("mainCharacters") List<String> mainCharacters,
                                       @RequestParam("category") String category,
                                       @RequestParam("tags") String tags,
                                       @RequestParam("targetAudience") String targetAudience,
                                       @RequestParam("language") String language,
                                       @RequestParam("copyright") String copyright,
                                       @RequestParam("isMature") String isMature,
                                       @RequestPart(value = "coverImage", required = false) MultipartFile coverImage){

        boolean hasValidCoverImage = coverImage != null && !coverImage.isEmpty() && coverImage.getSize() > 0;
        System.out.println("Has valid cover image: " + hasValidCoverImage);

        if (hasValidCoverImage) {
            System.out.println("Cover Image Size: " + coverImage.getSize());
            System.out.println("Cover Image Name: " + coverImage.getOriginalFilename());
        }

        StoryRequestDTO storyRequestDTO = new StoryRequestDTO();
        storyRequestDTO.setStatus(0);
        storyRequestDTO.setRating(Integer.parseInt(isMature));
        storyRequestDTO.setDescription(description);
        storyRequestDTO.setTitle(title);
        storyRequestDTO.setCharacters(mainCharacters);
        storyRequestDTO.setTags(tags);
        storyRequestDTO.setCopyright(copyright);
        storyRequestDTO.setTargetAudience(targetAudience);
        storyRequestDTO.setLanguage(language);
        storyRequestDTO.setCategory(category);


        if (hasValidCoverImage) {
            try {
                String originalFileName = coverImage.getOriginalFilename();
                System.out.println("original file name: "+originalFileName);
                String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
                System.out.println("extension: "+extension);

                String sanitizedTitle = title.replaceAll("[^a-zA-Z0-9]", "_");
                System.out.println("sani: "+sanitizedTitle);
                String uniqueFileName = System.currentTimeMillis() + "_" + sanitizedTitle + extension;
                System.out.println("unique: "+uniqueFileName);

                String uploadDir = "C:/wattpad-uploads";
                System.out.println("dir: "+uploadDir);
                File uploadPath = new File(uploadDir);
                if (!uploadPath.exists()) {
                    uploadPath.mkdirs();
                }

                File destinationFile = new File(uploadPath, uniqueFileName);
                coverImage.transferTo(destinationFile);
                storyRequestDTO.setCoverImagePath(uniqueFileName);
                System.out.println("Successfully uploaded cover image: " + uniqueFileName);
            } catch (Exception fileException) {
                System.err.println("Error processing cover image: " + fileException.getMessage());
                // Continue without the image rather than failing completely
            }
        } else {
            System.out.println("No cover image provided, creating story without image");
        }

        System.out.println(storyRequestDTO);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        CreateStoryResponseDTO createStoryResponseDTO = storyService.createANewStory(auth.getName(),storyRequestDTO);
        return new APIResponse(202,"Successfully created a new story.",createStoryResponseDTO);
    }
}














