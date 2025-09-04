package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.ParagraphCommentsModelResponseDTO;
import lk.ijse.wattpadbackend.dto.SingleCommentDTO;
import lk.ijse.wattpadbackend.entity.CommentLike;
import lk.ijse.wattpadbackend.entity.Paragraph;
import lk.ijse.wattpadbackend.entity.ParagraphComment;
import lk.ijse.wattpadbackend.entity.User;
import lk.ijse.wattpadbackend.exception.NotFoundException;
import lk.ijse.wattpadbackend.exception.UserNotFoundException;
import lk.ijse.wattpadbackend.repository.CommentLikeRepository;
import lk.ijse.wattpadbackend.repository.ParagraphCommentRepository;
import lk.ijse.wattpadbackend.repository.ParagraphRepository;
import lk.ijse.wattpadbackend.repository.UserRepository;
import lk.ijse.wattpadbackend.service.ParagraphService;
import lk.ijse.wattpadbackend.util.TimeAgoUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ParagraphServiceImpl implements ParagraphService {

    private final ParagraphRepository paragraphRepository;
    private final ParagraphCommentRepository paragraphCommentRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final UserRepository userRepository;

    @Override
    public ParagraphCommentsModelResponseDTO getAllCommentsByParagraphId(String username, long id) {

        try{
            Optional<Paragraph> optionalParagraph = paragraphRepository.findById((int) id);
            if(!optionalParagraph.isPresent()){
                throw new NotFoundException("Paragraph not found.");
            }

            Paragraph paragraph = optionalParagraph.get();

            ParagraphCommentsModelResponseDTO modelResponseDTO = new ParagraphCommentsModelResponseDTO();
            modelResponseDTO.setParagraphId(paragraph.getId());
            modelResponseDTO.setChapterTitle(paragraph.getChapter().getTitle());
            modelResponseDTO.setContentType(paragraph.getContentType());
            modelResponseDTO.setContent(paragraph.getContent());

            List<ParagraphComment> paragraphComments = paragraphCommentRepository.findAllByParagraph(paragraph);

            List<SingleCommentDTO> singleCommentDTOList = new ArrayList<>();
            for (ParagraphComment x : paragraphComments){
                SingleCommentDTO singleCommentDTO = new SingleCommentDTO();
                singleCommentDTO.setId(x.getId());
                singleCommentDTO.setCommentMessage(x.getCommentMessage());
                singleCommentDTO.setUserId(x.getUser().getId());
                singleCommentDTO.setUsername(x.getUser().getUsername());
                singleCommentDTO.setUserProfilePic(x.getUser().getProfilePicPath());

                long likesLong = x.getLikes();

                String likesInStr = "";
                if(likesLong<=1000){
                    likesInStr = String.valueOf(likesLong);
                }
                else if (likesLong >= 1000 && likesLong < 1000000) {
                    double value = (double) likesLong / 1000;
                    String vStr = String.valueOf(value);

                    if (vStr.endsWith(".0")) {
                        likesInStr = vStr.split("\\.0")[0] + "K";
                    } else {
                        likesInStr = vStr + "K";
                    }
                }
                else if(likesLong>=1000000){
                    double value = (double) likesLong/1000000;

                    String vStr = String.valueOf(value);

                    if (vStr.endsWith(".0")) {
                        likesInStr = vStr.split("\\.0")[0] + "M";
                    } else {
                        likesInStr = value+"M";
                    }
                }
                singleCommentDTO.setLikes(likesInStr);

                long commentsLong = x.getReplyCount();

                String commentsInStr = "";
                if(commentsLong<=1000){
                    commentsInStr = String.valueOf(commentsLong);
                }
                else if (commentsLong >= 1000 && commentsLong < 1000000) {
                    double value = (double) commentsLong / 1000;
                    String vStr = String.valueOf(value);

                    if (vStr.endsWith(".0")) {
                        commentsInStr = vStr.split("\\.0")[0] + "K";
                    } else {
                        commentsInStr = vStr + "K";
                    }
                }
                else if(commentsLong>=1000000){
                    double value = (double) commentsLong/1000000;

                    String vStr = String.valueOf(value);

                    if (vStr.endsWith(".0")) {
                        commentsInStr = vStr.split("\\.0")[0] + "M";
                    } else {
                        commentsInStr = value+"M";
                    }
                }
                singleCommentDTO.setReplyCount(commentsInStr);

                singleCommentDTO.setTime(TimeAgoUtil.toTimeAgo(x.getCreatedAt()));

                User user = userRepository.findByUsername(username);
                if(user==null){
                    throw new UserNotFoundException("User not found.");
                }

                CommentLike commentLike = commentLikeRepository.findByParagraphCommentAndUser(x,user);
                if(commentLike==null){
                    singleCommentDTO.setIsCurrentUserLiked(0);
                }
                else{
                    singleCommentDTO.setIsCurrentUserLiked(1);
                }

                singleCommentDTOList.add(singleCommentDTO);
            }

            modelResponseDTO.setSingleCommentDTOList(singleCommentDTOList);
            return modelResponseDTO;

        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}















