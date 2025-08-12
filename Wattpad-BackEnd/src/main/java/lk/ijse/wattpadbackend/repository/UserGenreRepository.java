package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.User;
import lk.ijse.wattpadbackend.entity.UserGenre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserGenreRepository extends JpaRepository<UserGenre,Integer> {
    void deleteAllByUser(User user);
}
