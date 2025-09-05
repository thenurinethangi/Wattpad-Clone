package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.ChapterComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChapterCommentRepository extends JpaRepository<ChapterComment,Integer> {
}
