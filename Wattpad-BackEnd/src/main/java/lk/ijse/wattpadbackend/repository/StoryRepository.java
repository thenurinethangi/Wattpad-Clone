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

    @Query(value = "SELECT * FROM story s WHERE LOWER(s.title) REGEXP CONCAT('(^| )', LOWER(:word), '( |$)')", nativeQuery = true)
    List<Story> findByTitleContainingWholeWord(@Param("word") String word);

    @Query(value = "SELECT * FROM story WHERE user_id <> :userId ORDER BY RAND() LIMIT 2", nativeQuery = true)
    List<Story> findTwoRandomStoriesNotBelongingToCurrentUser(@Param("userId") Long userId);

    @Query(value = """
        SELECT * FROM story 
        WHERE user_id <> :userId 
          AND id NOT IN (:excludedStoryIds)
        ORDER BY RAND() 
        LIMIT 7
        """, nativeQuery = true)
    List<Story> findSevenRandomStoriesExcludingUserAndStories(
            @Param("userId") Long userId,
            @Param("excludedStoryIds") List<Long> excludedStoryIds
    );
}



























