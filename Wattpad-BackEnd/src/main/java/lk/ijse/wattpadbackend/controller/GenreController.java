package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.GenreDTO;
import lk.ijse.wattpadbackend.dto.SelectedGenreDTO;
import lk.ijse.wattpadbackend.service.AuthService;
import lk.ijse.wattpadbackend.service.GenreService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/genre")
@RequiredArgsConstructor
public class GenreController {

    private final GenreService genreService;
    private final AuthService authService;

    @GetMapping("/all")
    public APIResponse allGenre(){

        List<GenreDTO> genreDTOList = genreService.AllGenre();
        return new APIResponse(202,"All Genres",genreDTOList);
    }

    @PostMapping("/select")
    public APIResponse selectGenre(@RequestBody SelectedGenreDTO selectedGenreDTO){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        genreService.selectGenre(selectedGenreDTO,auth.getName());
        return new APIResponse(202,"Selected genres have been successfully saved.",null);
    }
}




































