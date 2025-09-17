package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.*;

import java.util.List;

public interface GenreService {

    List<GenreDTO> AllGenre();

    void selectGenre(SelectedGenreDTO selectedGenreDTO, String name);

    GenreSearchResponseDTO getAllStoriesOfSelectedGenre(String genre, GenreSearchCriteriaDTO genreSearchCriteriaDTO);

    List<AdminGenreDTO> getAllGenreForAdmin();

    void addNewGenre(String genre);

    void removeAGenre(String genreId);

    void editAGenre(EditGenreDTO editGenreDTO);
}
