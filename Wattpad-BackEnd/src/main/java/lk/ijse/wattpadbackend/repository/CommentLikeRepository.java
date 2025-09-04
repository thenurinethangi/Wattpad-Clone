package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.CommentLike;
import lk.ijse.wattpadbackend.entity.ParagraphComment;
import lk.ijse.wattpadbackend.entity.Reply;
import lk.ijse.wattpadbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentLikeRepository extends JpaRepository<CommentLike,Integer> {
    CommentLike findByParagraphCommentAndUser(ParagraphComment paragraphComment, User user);

    CommentLike findByReplyAndUser(Reply reply, User user);
}
