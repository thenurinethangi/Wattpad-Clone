package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.ParagraphCommentsModelResponseDTO;
import lk.ijse.wattpadbackend.dto.ReplyResponseDTO;

import java.util.List;

public interface ParagraphService {

    ParagraphCommentsModelResponseDTO getAllCommentsByParagraphId(String name, long id);

    String addOrRemoveLikeOnParagraphComment(String name, long id);

    void addAReplyToParagraphComment(String name, long id);

    List<ReplyResponseDTO> getAllRepliesForParagraphComment(String username, long id);
}
