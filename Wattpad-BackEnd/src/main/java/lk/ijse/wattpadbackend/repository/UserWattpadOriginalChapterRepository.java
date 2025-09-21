package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.Chapter;
import lk.ijse.wattpadbackend.entity.User;
import lk.ijse.wattpadbackend.entity.UserWattpadOriginalChapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserWattpadOriginalChapterRepository extends JpaRepository<UserWattpadOriginalChapter,Integer> {
    List<UserWattpadOriginalChapter> findByChapterAndUser(Chapter chapter, User user);
}
