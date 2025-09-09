package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.Story;
import lk.ijse.wattpadbackend.entity.StoryTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoryTagRepository extends JpaRepository<StoryTag,Integer> {
    void deleteByStory(Story story);
}
