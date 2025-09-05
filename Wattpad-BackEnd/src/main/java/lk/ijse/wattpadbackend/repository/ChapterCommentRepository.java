package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.Chapter;
import lk.ijse.wattpadbackend.entity.ChapterComment;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChapterCommentRepository extends JpaRepository<ChapterComment,Integer> {

    List<ChapterComment> findAllByChapterOrderByCreatedAtDesc(Chapter chapter, Pageable pageable);

}
