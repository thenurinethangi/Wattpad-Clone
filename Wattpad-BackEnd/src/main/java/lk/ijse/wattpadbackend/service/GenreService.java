package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.GenreDTO;
import lk.ijse.wattpadbackend.dto.SelectedGenreDTO;

import java.util.List;

public interface GenreService {

    List<GenreDTO> AllGenre();

    void selectGenre(SelectedGenreDTO selectedGenreDTO, String name);
}
