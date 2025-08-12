package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.GenreDTO;
import lk.ijse.wattpadbackend.dto.SelectedGenreDTO;
import lk.ijse.wattpadbackend.entity.Genre;
import lk.ijse.wattpadbackend.entity.User;
import lk.ijse.wattpadbackend.entity.UserGenre;
import lk.ijse.wattpadbackend.exception.UserExistException;
import lk.ijse.wattpadbackend.exception.UserNotFoundException;
import lk.ijse.wattpadbackend.repository.GenreRepository;
import lk.ijse.wattpadbackend.repository.UserGenreRepository;
import lk.ijse.wattpadbackend.repository.UserRepository;
import lk.ijse.wattpadbackend.service.GenreService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GenreServiceImpl implements GenreService {

    private final GenreRepository genreRepository;
    private final UserGenreRepository userGenreRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<GenreDTO> AllGenre() {

        try {
            List<Genre> genreList = genreRepository.findAll();

            List<GenreDTO> genreDTOList = new ArrayList<>();
            for (Genre x : genreList){
                genreDTOList.add(modelMapper.map(x, GenreDTO.class));
            }
            return genreDTOList;
        }
        catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public void selectGenre(SelectedGenreDTO selectedGenreDTO, String name) {

        try {
            User user = userRepository.findByUsername(name);

            if (user == null) {
                throw new UserNotFoundException("User Not Found.");
            }

            userGenreRepository.deleteAllByUser(user);

            for (int i = 0; i < selectedGenreDTO.getGenres().size(); i++) {
                Genre genre = genreRepository.findByGenre(selectedGenreDTO.getGenres().get(i)).get(0);
                UserGenre userGenre = new UserGenre(user, genre);
                userGenreRepository.save(userGenre);
            }
        }
        catch (UserNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Internal Server Error.");
        }
    }
}













