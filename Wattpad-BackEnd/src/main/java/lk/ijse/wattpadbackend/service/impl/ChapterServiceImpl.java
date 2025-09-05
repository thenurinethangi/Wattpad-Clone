package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.*;
import lk.ijse.wattpadbackend.entity.*;
import lk.ijse.wattpadbackend.exception.NotFoundException;
import lk.ijse.wattpadbackend.exception.UserNotFoundException;
import lk.ijse.wattpadbackend.repository.*;
import lk.ijse.wattpadbackend.service.ChapterService;
import lk.ijse.wattpadbackend.util.TimeAgoUtil;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ChapterServiceImpl implements ChapterService {

    private final ChapterRepository chapterRepository;
    private final StoryRepository storyRepository;
    private final UserRepository userRepository;
    private final ChapterLikeRepository chapterLikeRepository;
    private final ChapterCommentRepository chapterCommentRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final ReplyRepository replyRepository;
    private final ParagraphCommentRepository paragraphCommentRepository;

    @Override
    public ChapterDTO getAChapterById(String username,long id) {

        try{
            Optional<Chapter> chapterOptional = chapterRepository.findById((int) id);

            if(!chapterOptional.isPresent()){
                throw new NotFoundException("Chapter not found.");
            }

            Chapter chapter = chapterOptional.get();

            if(chapter.getPublishedOrDraft()==0){
                throw new NotFoundException("Chapter not found.");
            }

            ChapterDTO chapterDTO = new ChapterDTO();

            chapterDTO.setId(chapter.getId());
            chapterDTO.setTitle(chapter.getTitle());
            chapterDTO.setCoverImagePath(chapter.getCoverImagePath());

            long likesLong = chapter.getLikes();

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
            chapterDTO.setLikes(likesInStr);

            long viewsLong = chapter.getViews();

            String viewsInStr = "";
            if(viewsLong<=1000){
                viewsInStr = String.valueOf(viewsLong);
            }
            else if (viewsLong >= 1000 && viewsLong < 1000000) {
                double value = (double) viewsLong / 1000;
                String vStr = String.valueOf(value);

                if (vStr.endsWith(".0")) {
                    viewsInStr = vStr.split("\\.0")[0] + "K";
                } else {
                    viewsInStr = vStr + "K";
                }
            }
            else if(viewsLong>=1000000){
                double value = (double) viewsLong/1000000;

                String vStr = String.valueOf(value);

                if (vStr.endsWith(".0")) {
                    viewsInStr = vStr.split("\\.0")[0] + "M";
                } else {
                    viewsInStr = value+"M";
                }
            }
            chapterDTO.setViews(viewsInStr);

            long commentsLong = chapter.getComments();

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
            chapterDTO.setComments(commentsInStr);

            chapterDTO.setStoryId(chapter.getStory().getId());
            chapterDTO.setStoryTitle(chapter.getStory().getTitle());
            chapterDTO.setStoryCoverImagePath(chapter.getStory().getCoverImagePath());

            chapterDTO.setUserId(chapter.getStory().getUser().getId());
            chapterDTO.setUsername(chapter.getStory().getUser().getUsername());
            chapterDTO.setUserProfilePicPath(chapter.getStory().getUser().getProfilePicPath());

            //here must have a logic for check current user liked this chapter or not
            User user = userRepository.findByUsername(username);
            if(user==null){
                throw new UserNotFoundException("User not found.");
            }

            ChapterLike chapterLike = chapterLikeRepository.findByChapterAndUser(chapter,user);
            if(chapterLike==null){
                chapterDTO.setIsLiked(0);
            }
            else {
                chapterDTO.setIsLiked(1);
            }

            List<Chapter> chapterList = chapterRepository.findAllByStory(chapter.getStory());

            List<ChapterSimpleDTO> chapterSimpleDTOList = new ArrayList<>();
            for (Chapter x : chapterList){
                ChapterSimpleDTO chapterSimpleDTO = new ChapterSimpleDTO();
                chapterSimpleDTO.setId(x.getId());
                chapterSimpleDTO.setTitle(x.getTitle());

                chapterSimpleDTOList.add(chapterSimpleDTO);
            }
            chapterDTO.setChapterSimpleDTOList(chapterSimpleDTOList);

            List<Paragraph> paragraphList = chapter.getParagraphs();
            List<ParagraphDTO> paragraphDTOList = new ArrayList<>();
            for (Paragraph x : paragraphList){
                ParagraphDTO paragraphDTO = new ParagraphDTO();

                paragraphDTO.setId(x.getId());
                paragraphDTO.setContent(x.getContent());
                paragraphDTO.setContentType(x.getContentType());
                paragraphDTO.setSequenceNo(x.getSequenceNo());

                List<ParagraphComment> paragraphComments = x.getParagraphComments();
                long commentCount = paragraphComments.size();
                for (ParagraphComment y : paragraphComments){
                    commentCount+=y.getReplyCount();
                }

                String commentInStr = "";
                if(commentCount<=1000){
                    commentInStr = String.valueOf(commentCount);
                }
                else if (commentCount >= 1000 && commentCount < 1000000) {
                    double value = (double) commentCount / 1000;
                    String vStr = String.valueOf(value);

                    if (vStr.endsWith(".0")) {
                        commentInStr = vStr.split("\\.0")[0] + "K";
                    } else {
                        commentInStr = vStr + "K";
                    }
                }
                else if(commentCount>=1000000){
                    double value = (double) commentCount/1000000;

                    String vStr = String.valueOf(value);

                    if (vStr.endsWith(".0")) {
                        commentInStr = vStr.split("\\.0")[0] + "M";
                    } else {
                        commentInStr = value+"M";
                    }
                }
                paragraphDTO.setCommentCount(commentInStr);

                paragraphDTOList.add(paragraphDTO);
            }
            chapterDTO.setParagraphDTOList(paragraphDTOList);

            return chapterDTO;

        }
        catch (NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<StoryDTO> getRecommendationStories(String username, StoryIdsDTO storyIdsDTO) {

        try{
           User user = userRepository.findByUsername(username);
           if(user==null){
               throw new UserNotFoundException("User not found.");
           }

           List<Story> stories = storyRepository.findTwoRandomStoriesNotBelongingToUserAndStory(user.getId(),storyIdsDTO.getStoriesIdList().get(0));

           List<StoryDTO> storyDTOList = new ArrayList<>();
           for (Story x : stories){
               StoryDTO storyDTO = new StoryDTO();
               storyDTO.setId(x.getId());
               storyDTO.setTitle(x.getTitle());
               storyDTO.setDescription(x.getDescription());
               storyDTO.setParts(x.getParts());
               storyDTO.setCoverImagePath(x.getCoverImagePath());
               storyDTO.setUserId(x.getUser().getId());
               storyDTO.setUsername(x.getUser().getUsername());

               long viewsLong = x.getViews().longValue();

               String viewsInStr = "";
               if(viewsLong<=1000){
                   viewsInStr = String.valueOf(viewsLong);
               }
               else if (viewsLong >= 1000 && viewsLong < 1000000) {
                   double value = (double) viewsLong / 1000;
                   String vStr = String.valueOf(value);

                   if (vStr.endsWith(".0")) {
                       viewsInStr = vStr.split("\\.0")[0] + "K";
                   } else {
                       viewsInStr = vStr + "K";
                   }
               }
               else if(viewsLong>=1000000){
                   double value = (double) viewsLong/1000000;

                   String vStr = String.valueOf(value);

                   if (vStr.endsWith(".0")) {
                       viewsInStr = vStr.split("\\.0")[0] + "M";
                   } else {
                       viewsInStr = value+"M";
                   }
               }
               storyDTO.setViews(viewsInStr);

               long likesLong = x.getLikes().longValue();

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
               storyDTO.setLikes(likesInStr);

               List<StoryTag> storyTagList = x.getStoryTags();

               List<String> tags = new ArrayList<>();
               for (StoryTag y : storyTagList){
                   tags.add(y.getTag().getTagName());
               }
               storyDTO.setTags(tags);

               storyDTOList.add(storyDTO);
           }

           return storyDTOList;

        }
        catch (UserNotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<StoryDTO> getAlsoYouWillLikeStories(String username, StoryIdsDTO storyIdsDTO) {

        try {
            User user = userRepository.findByUsername(username);
            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            List<Story> stories = storyRepository.findSevenRandomStoriesExcludingUserAndStories(user.getId(),storyIdsDTO.getStoriesIdList());

            List<StoryDTO> storyDTOList = new ArrayList<>();
            for (Story x : stories){
                StoryDTO storyDTO = new StoryDTO();
                storyDTO.setId(x.getId());
                storyDTO.setTitle(x.getTitle());
                storyDTO.setDescription(x.getDescription());
                storyDTO.setCoverImagePath(x.getCoverImagePath());

                long viewsLong = x.getViews().longValue();

                String viewsInStr = "";
                if(viewsLong<=1000){
                    viewsInStr = String.valueOf(viewsLong);
                }
                else if (viewsLong >= 1000 && viewsLong < 1000000) {
                    double value = (double) viewsLong / 1000;
                    String vStr = String.valueOf(value);

                    if (vStr.endsWith(".0")) {
                        viewsInStr = vStr.split("\\.0")[0] + "K";
                    } else {
                        viewsInStr = vStr + "K";
                    }
                }
                else if(viewsLong>=1000000){
                    double value = (double) viewsLong/1000000;

                    String vStr = String.valueOf(value);

                    if (vStr.endsWith(".0")) {
                        viewsInStr = vStr.split("\\.0")[0] + "M";
                    } else {
                        viewsInStr = value+"M";
                    }
                }
                storyDTO.setViews(viewsInStr);

                long likesLong = x.getLikes().longValue();

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
                storyDTO.setLikes(likesInStr);

                storyDTOList.add(storyDTO);
            }

            return storyDTOList;
        }
        catch (UserNotFoundException e) {
            throw new RuntimeException(e);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public String addLikeOrRemove(String username, long chapterId) {

        try {
            User user = userRepository.findByUsername(username);
            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            Optional<Chapter> optionalChapter = chapterRepository.findById((int) chapterId);
            if(!optionalChapter.isPresent()){
                throw new NotFoundException("Chapter not found.");
            }
            Chapter chapter = optionalChapter.get();

            ChapterLike chapterLike = chapterLikeRepository.findByChapterAndUser(chapter,user);

            if(chapterLike==null){
                ChapterLike chapterLike1 = new ChapterLike();
                chapterLike1.setChapter(chapter);
                chapterLike1.setUser(user);

                chapterLikeRepository.save(chapterLike1);
                return "Liked";
            }
            else{
                chapterLikeRepository.delete(chapterLike);
                return "Unliked";
            }

        }
        catch (UserNotFoundException e) {
            throw new RuntimeException(e);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void addACommentToAChapter(String username, long chapterId, ReplyRequestDTO replyRequestDTO) {

        try{
            User user = userRepository.findByUsername(username);
            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            Optional<Chapter> optionalChapter = chapterRepository.findById((int) chapterId);
            if(!optionalChapter.isPresent()){
                throw new NotFoundException("Chapter not found.");
            }
            Chapter chapter = optionalChapter.get();

            ChapterComment chapterComment = new ChapterComment();
            chapterComment.setChapter(chapter);
            chapterComment.setCommentMessage(replyRequestDTO.getReplyMessage());
            chapterComment.setUser(user);

            chapterCommentRepository.save(chapterComment);

        }
        catch (UserNotFoundException e) {
            throw new RuntimeException(e);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<SingleCommentDTO> loadCommentsOfAChapter(String username, long chapterId, long amount) {

        try {
            User user = userRepository.findByUsername(username);
            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            Optional<Chapter> optionalChapter = chapterRepository.findById((int) chapterId);
            if (!optionalChapter.isPresent()) {
                throw new NotFoundException("Chapter not found.");
            }
            Chapter chapter = optionalChapter.get();

            Pageable limit = PageRequest.of(0, (int) amount);
            List<ChapterComment> chapterCommentList = chapterCommentRepository.findAllByChapterOrderByCreatedAtAsc(chapter,limit);

            List<SingleCommentDTO> singleCommentDTOList = new ArrayList<>();
            for (ChapterComment x : chapterCommentList){
                SingleCommentDTO singleCommentDTO = new SingleCommentDTO();
                singleCommentDTO.setId(x.getId());
                singleCommentDTO.setCommentMessage(x.getCommentMessage());
                singleCommentDTO.setUserId(x.getUser().getId());
                singleCommentDTO.setUsername(x.getUser().getUsername());
                singleCommentDTO.setUserProfilePic(x.getUser().getProfilePicPath());
                singleCommentDTO.setTime(TimeAgoUtil.toTimeAgo(x.getCreatedAt()));

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

                CommentLike commentLike = commentLikeRepository.findByChapterCommentAndUser(x,user);
                if(commentLike==null){
                    singleCommentDTO.setIsCurrentUserLiked(0);
                }
                else{
                    singleCommentDTO.setIsCurrentUserLiked(1);
                }

                Long commentUserId = x.getUser().getId();
                Long storyUserId = x.getChapter().getStory().getUser().getId();

                if (commentUserId.equals(storyUserId)) {
                    singleCommentDTO.setIsCommentByAuthor(1);
                }
                else{
                    singleCommentDTO.setIsCommentByAuthor(0);
                }

                singleCommentDTOList.add(singleCommentDTO);
            }

            if(singleCommentDTOList.size()<amount){

                List<SingleCommentDTO> singleCommentDTOList1 = new ArrayList<>();

                List<Paragraph> paragraphList = chapter.getParagraphs();
                for (Paragraph x : paragraphList){
                    List<ParagraphComment> paragraphCommentList = x.getParagraphComments();
                    for (ParagraphComment y : paragraphCommentList){
                        SingleCommentDTO singleCommentDTO = new SingleCommentDTO();
                        singleCommentDTO.setId(y.getId());
                        singleCommentDTO.setCommentMessage(y.getCommentMessage());
                        singleCommentDTO.setUserId(y.getUser().getId());
                        singleCommentDTO.setUsername(y.getUser().getUsername());
                        singleCommentDTO.setUserProfilePic(y.getUser().getProfilePicPath());
                        singleCommentDTO.setTime(TimeAgoUtil.toTimeAgo(y.getCreatedAt()));

                        long likesLong = y.getLikes();

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

                        CommentLike commentLike = commentLikeRepository.findByParagraphCommentAndUser(y,user);
                        if(commentLike==null){
                            singleCommentDTO.setIsCurrentUserLiked(0);
                        }
                        else{
                            singleCommentDTO.setIsCurrentUserLiked(1);
                        }

                        Long commentUserId = y.getUser().getId();
                        Long storyUserId = x.getChapter().getStory().getUser().getId();

                        if (commentUserId.equals(storyUserId)) {
                            singleCommentDTO.setIsCommentByAuthor(1);
                        }
                        else{
                            singleCommentDTO.setIsCommentByAuthor(0);
                        }

                        singleCommentDTOList1.add(singleCommentDTO);

                    }

                }

                if(amount-singleCommentDTOList.size()<=singleCommentDTOList1.size()){
                    singleCommentDTOList1.subList(0, (int) (amount-singleCommentDTOList.size()));
                }

                singleCommentDTOList.addAll(0,singleCommentDTOList1);
            }

            return singleCommentDTOList;
        }
        catch (UserNotFoundException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        } catch (RuntimeException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    @Override
    public String addOrRemoveLikeOnChapterComment(String username, long id) {

        try{
            User user = userRepository.findByUsername(username);
            if(user==null){
                throw new UserNotFoundException("User not found.");
            }

            Optional<ChapterComment> optionalChapterComment = chapterCommentRepository.findById((int) id);
            if(!optionalChapterComment.isPresent()){
                throw new NotFoundException("Comment not found.");
            }
            ChapterComment chapterComment = optionalChapterComment.get();

            CommentLike commentLike = commentLikeRepository.findByChapterCommentAndUser(chapterComment,user);
            if(commentLike==null){
                CommentLike commentLike1 = new CommentLike();
                commentLike1.setChapterComment(chapterComment);
                commentLike1.setUser(user);

                commentLikeRepository.save(commentLike1);

                long likes = chapterComment.getLikes();
                likes++;
                chapterComment.setLikes(likes);
                chapterCommentRepository.save(chapterComment);

                return "Liked";
            }
            else{
                commentLikeRepository.delete(commentLike);

                long likes = chapterComment.getLikes();
                likes--;
                chapterComment.setLikes(likes);
                chapterCommentRepository.save(chapterComment);

                return "Unliked";
            }

        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}






















