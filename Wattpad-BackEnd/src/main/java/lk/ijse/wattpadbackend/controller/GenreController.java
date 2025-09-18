package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.*;
import lk.ijse.wattpadbackend.service.AuthService;
import lk.ijse.wattpadbackend.service.GenreService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/genre")
@RequiredArgsConstructor
public class GenreController {

    private final GenreService genreService;

    @GetMapping()
    @PreAuthorize("hasRole('USER')")
    public APIResponse welcomeMessage(){
        return new APIResponse(202,"WELCOME TO GENRE STORIES PAGE",null);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public APIResponse welcomeMessage2(){
        return new APIResponse(202,"WELCOME TO GENRE STORIES PAGE(ADMIN)",null);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('USER')")
    public APIResponse allGenre(){

        List<GenreDTO> genreDTOList = genreService.AllGenre();
        return new APIResponse(202,"All Genres",genreDTOList);
    }

    @PostMapping("/select")
    @PreAuthorize("hasRole('USER')")
    public APIResponse selectGenre(@RequestBody SelectedGenreDTO selectedGenreDTO){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        genreService.selectGenre(selectedGenreDTO,auth.getName());
        return new APIResponse(202,"Selected genres have been successfully saved.",null);
    }

    @PostMapping("/{genre}")
    @PreAuthorize("hasRole('USER')")
    public APIResponse getAllStoriesOfSelectedGenre(@PathVariable String genre, @RequestBody GenreSearchCriteriaDTO genreSearchCriteriaDTO){

        GenreSearchResponseDTO genreSearchResponseDTO = genreService.getAllStoriesOfSelectedGenre(genre,genreSearchCriteriaDTO);
        return new APIResponse(202,"Successfully load stories from selected genre.",genreSearchResponseDTO);
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public APIResponse getAllGenreForAdmin(){

        List<AdminGenreDTO> adminGenreDTOList = genreService.getAllGenreForAdmin();
        return new APIResponse(202,"Successful load all genre for admin",adminGenreDTOList);
    }

    @PostMapping("/admin/add/{genre}")
    @PreAuthorize("hasRole('ADMIN')")
    public APIResponse addNewGenre(@PathVariable String genre){

        genreService.addNewGenre(genre);
        return new APIResponse(202,"Successful added new genre",null);
    }

    @DeleteMapping("/admin/remove/{genreId}")
    @PreAuthorize("hasRole('ADMIN')")
    public APIResponse removeAGenre(@PathVariable String genreId){

        genreService.removeAGenre(genreId);
        return new APIResponse(202,"Successful removed the genre id: "+genreId,null);
    }

    @PutMapping("/admin/edit")
    @PreAuthorize("hasRole('ADMIN')")
    public APIResponse editAGenre(@RequestBody EditGenreDTO editGenreDTO){

        genreService.editAGenre(editGenreDTO);
        return new APIResponse(202,"Successful edited the genre",null);
    }
}




































