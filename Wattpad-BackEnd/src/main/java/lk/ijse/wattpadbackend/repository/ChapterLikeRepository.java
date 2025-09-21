package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.Chapter;
import lk.ijse.wattpadbackend.entity.ChapterLike;
import lk.ijse.wattpadbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChapterLikeRepository extends JpaRepository<ChapterLike,Integer> {

    ChapterLike findByChapterAndUser(Chapter chapter, User user);

    List<ChapterLike> findAllByChapter(Chapter chapter);
}
