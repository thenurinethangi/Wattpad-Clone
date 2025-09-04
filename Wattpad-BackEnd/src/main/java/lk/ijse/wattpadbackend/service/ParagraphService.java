package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.ParagraphCommentsModelResponseDTO;

public interface ParagraphService {

    ParagraphCommentsModelResponseDTO getAllCommentsByParagraphId(String name, long id);

    String addOrRemoveLikeOnParagraphComment(String name, long id);
}
