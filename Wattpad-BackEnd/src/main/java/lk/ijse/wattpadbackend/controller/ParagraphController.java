package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.ChapterDTO;
import lk.ijse.wattpadbackend.dto.ParagraphCommentsModelResponseDTO;
import lk.ijse.wattpadbackend.service.ParagraphService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/paragraph")
@RequiredArgsConstructor
public class ParagraphController {

    private final ParagraphService paragraphService;

    @GetMapping("/all/comments/{id}")
    public APIResponse getAllCommentsByParagraphId(@PathVariable long id){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ParagraphCommentsModelResponseDTO modelResponseDTO = paragraphService.getAllCommentsByParagraphId(auth.getName(),id);
        return new APIResponse(202,"Successfully loaded all the comments by paragraph id : "+id,modelResponseDTO);
    }

    @PostMapping("/comment/like/{id}")
    public APIResponse addOrRemoveLikeOnParagraphComment(@PathVariable long id){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String result = paragraphService.addOrRemoveLikeOnParagraphComment(auth.getName(),id);
        return new APIResponse(202,"Successfully add or remove like on paragraph comment id : "+id,result);
    }
}












