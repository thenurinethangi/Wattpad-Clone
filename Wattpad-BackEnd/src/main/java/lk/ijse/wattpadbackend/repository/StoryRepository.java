package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.Story;
import lk.ijse.wattpadbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoryRepository extends JpaRepository<Story,Integer> {

    List<Story> findAllByCategory(String category);

    List<Story> findAllByOrderByViewsDesc();

    List<Story> findAllByUser(User user);

    List<Story> findAllByCategoryOrderByViewsDesc(String genre);

    List<Story> findAllByCategoryOrderByCreatedAtDesc(String genre);

    List<Story> findAllByOrderByCreatedAtDesc();

    List<Story> findByTitleContainingIgnoreCase(String keyword);
}



























