package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.Paragraph;
import lk.ijse.wattpadbackend.entity.ParagraphComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParagraphCommentRepository extends JpaRepository<ParagraphComment,Integer> {
    List<ParagraphComment> findAllByParagraph(Paragraph paragraph);
}
