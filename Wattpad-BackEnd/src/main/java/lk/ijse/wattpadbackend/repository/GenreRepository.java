package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GenreRepository extends JpaRepository<Genre,Integer> {

    List<Genre> findByGenre(String genre);
}
