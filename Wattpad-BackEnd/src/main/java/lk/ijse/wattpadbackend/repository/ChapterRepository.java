package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.Chapter;
import lk.ijse.wattpadbackend.entity.Story;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter,Integer> {
    List<Chapter> findAllByStory(Story story);
}
