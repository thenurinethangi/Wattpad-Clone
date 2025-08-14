package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.LibraryStoryResponseDTO;
import lk.ijse.wattpadbackend.service.HomeService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

        List<LibraryStoryResponseDTO> libraryStoryResponseDTOList = homeService.yourStories(auth.getName());
        return new APIResponse(202,"Top Pickup For You successfully loaded from backend",libraryStoryResponseDTOList);
    }
}




























