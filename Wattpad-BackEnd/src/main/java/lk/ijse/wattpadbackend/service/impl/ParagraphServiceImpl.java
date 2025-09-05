package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.ParagraphCommentsModelResponseDTO;
import lk.ijse.wattpadbackend.dto.ReplyRequestDTO;
import lk.ijse.wattpadbackend.dto.ReplyResponseDTO;
import lk.ijse.wattpadbackend.dto.SingleCommentDTO;
import lk.ijse.wattpadbackend.entity.*;
import lk.ijse.wattpadbackend.exception.NotFoundException;
import lk.ijse.wattpadbackend.exception.UserNotFoundException;
import lk.ijse.wattpadbackend.repository.*;
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
    private final ReplyRepository replyRepository;

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

                Long commentUserId = x.getUser().getId();
                Long storyUserId = x.getParagraph().getChapter().getStory().getUser().getId();

                if (commentUserId.equals(storyUserId)) {
                    singleCommentDTO.setIsCommentByAuthor(1);
                }
                else{
                    singleCommentDTO.setIsCommentByAuthor(0);
                }

                singleCommentDTOList.add(singleCommentDTO);
            }

            modelResponseDTO.setSingleCommentDTOList(singleCommentDTOList);
            return modelResponseDTO;

        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public String addOrRemoveLikeOnParagraphComment(String username, long paragraphCommentId) {

        try{
            User user = userRepository.findByUsername(username);
            if(user==null){
                throw new UserNotFoundException("User not found.");
            }

            Optional<ParagraphComment> optionalParagraphComment = paragraphCommentRepository.findById((int) paragraphCommentId);
            if(!optionalParagraphComment.isPresent()){
                throw new NotFoundException("Comment not found.");
            }
            ParagraphComment paragraphComment = optionalParagraphComment.get();

            CommentLike commentLike = commentLikeRepository.findByParagraphCommentAndUser(paragraphComment,user);
            if(commentLike==null){
                CommentLike commentLike1 = new CommentLike();
                commentLike1.setParagraphComment(paragraphComment);
                commentLike1.setUser(user);

                commentLikeRepository.save(commentLike1);

                long likes = paragraphComment.getLikes();
                likes++;
                paragraphComment.setLikes(likes);
                paragraphCommentRepository.save(paragraphComment);

                return "Liked";
            }
            else{
                commentLikeRepository.delete(commentLike);

                long likes = paragraphComment.getLikes();
                likes--;
                paragraphComment.setLikes(likes);
                paragraphCommentRepository.save(paragraphComment);

                return "Unliked";
            }

        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void addAReplyToParagraphComment(String username, long id, ReplyRequestDTO replyRequestDTO) {

        try {
            User user = userRepository.findByUsername(username);
            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            Optional<ParagraphComment> optionalParagraphComment = paragraphCommentRepository.findById((int) id);
            if(!optionalParagraphComment.isPresent()){
                throw new NotFoundException("Comment not found.");
            }
            ParagraphComment paragraphComment = optionalParagraphComment.get();

            Reply reply = new Reply();
            reply.setReplyMessage(replyRequestDTO.getReplyMessage());
            reply.setParagraphComment(paragraphComment);
            reply.setUser(user);

            replyRepository.save(reply);

            long count = paragraphComment.getReplyCount();
            count++;
            paragraphComment.setReplyCount(count);
            paragraphCommentRepository.save(paragraphComment);

        }
        catch (UserNotFoundException e) {
            throw new RuntimeException(e);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }

    }

    @Override
    public List<ReplyResponseDTO> getAllRepliesForParagraphComment(String username, long id) {

        try {
            Optional<ParagraphComment> optionalParagraphComment = paragraphCommentRepository.findById((int) id);
            if(!optionalParagraphComment.isPresent()){
                throw new NotFoundException("Comment not found.");
            }
            ParagraphComment paragraphComment = optionalParagraphComment.get();

            List<Reply> replyList = replyRepository.findAllByParagraphComment(paragraphComment);

            List<ReplyResponseDTO> replyResponseDTOList = new ArrayList<>();
            for (Reply x : replyList){
                ReplyResponseDTO replyResponseDTO = new ReplyResponseDTO();
                replyResponseDTO.setReplyId(x.getId());
                replyResponseDTO.setParagraphCommentId(x.getParagraphComment().getId());
                replyResponseDTO.setReplyMessage(x.getReplyMessage());
                replyResponseDTO.setUserId(x.getUser().getId());
                replyResponseDTO.setUsername(x.getUser().getUsername());
                replyResponseDTO.setUserProfilePic(x.getUser().getProfilePicPath());

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
                replyResponseDTO.setLikes(likesInStr);

                replyResponseDTO.setTime(TimeAgoUtil.toTimeAgo(x.getCreateAt()));

                User user = userRepository.findByUsername(username);
                if(user==null){
                    throw new UserNotFoundException("User not found.");
                }

                CommentLike commentLike = commentLikeRepository.findByReplyAndUser(x,user);
                if(commentLike==null){
                    replyResponseDTO.setIsCurrentUserLiked(0);
                }
                else{
                    replyResponseDTO.setIsCurrentUserLiked(1);
                }

                Long commentUserId = x.getUser().getId();
                Long storyUserId = x.getParagraphComment().getParagraph().getChapter().getStory().getUser().getId();

                if (commentUserId.equals(storyUserId)) {
                    replyResponseDTO.setIsCommentByAuthor(1);
                }
                else{
                    replyResponseDTO.setIsCommentByAuthor(0);
                }

                replyResponseDTOList.add(replyResponseDTO);
            }

            return replyResponseDTOList;
        }
        catch (UserNotFoundException e) {
            throw new RuntimeException(e);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public String addOrRemoveLikeOnReply(String username, long replyId) {

        try{
            User user = userRepository.findByUsername(username);
            if(user==null){
                throw new UserNotFoundException("User not found.");
            }

            Optional<Reply> optionalReply = replyRepository.findById((int) replyId);
            if(!optionalReply.isPresent()){
                throw new NotFoundException("Reply not found.");
            }
            Reply reply = optionalReply.get();

            CommentLike commentLike = commentLikeRepository.findByReplyAndUser(reply,user);
            if(commentLike==null){
                CommentLike commentLike1 = new CommentLike();
                commentLike1.setReply(reply);
                commentLike1.setUser(user);

                commentLikeRepository.save(commentLike1);

                long likes = reply.getLikes();
                likes++;
                reply.setLikes(likes);
                replyRepository.save(reply);

                return "Liked";
            }
            else{
                commentLikeRepository.delete(commentLike);

                long likes = reply.getLikes();
                likes--;
                reply.setLikes(likes);
                replyRepository.save(reply);

                return "Unliked";
            }

        }
        catch (UserNotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void addACommentToAParagraphByParagraphId(String username, long id, ReplyRequestDTO replyRequestDTO) {

        try {
            User user = userRepository.findByUsername(username);
            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            Optional<Paragraph> optionalParagraph = paragraphRepository.findById((int) id);
            if(!optionalParagraph.isPresent()){
                throw new NotFoundException("Paragraph not found.");
            }
            Paragraph paragraph = optionalParagraph.get();

            ParagraphComment paragraphComment = new ParagraphComment();
            paragraphComment.setParagraph(paragraph);
            paragraphComment.setCommentMessage(replyRequestDTO.getReplyMessage());
            paragraphComment.setUser(user);

            paragraphCommentRepository.save(paragraphComment);

        }
        catch (UserNotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }

    }

}















