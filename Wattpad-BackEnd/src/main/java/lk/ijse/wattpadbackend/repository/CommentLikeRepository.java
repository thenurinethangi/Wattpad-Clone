package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentLikeRepository extends JpaRepository<CommentLike,Integer> {
    CommentLike findByParagraphCommentAndUser(ParagraphComment paragraphComment, User user);

    CommentLike findByReplyAndUser(Reply reply, User user);

    CommentLike findByChapterCommentAndUser(ChapterComment x, User user);
}
