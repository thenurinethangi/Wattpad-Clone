package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.ParagraphComment;
import lk.ijse.wattpadbackend.entity.Reply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReplyRepository extends JpaRepository<Reply,Integer> {
    List<Reply> findAllByParagraphComment(ParagraphComment paragraphComment);
}
