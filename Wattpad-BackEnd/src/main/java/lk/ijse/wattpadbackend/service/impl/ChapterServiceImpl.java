package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.*;
import lk.ijse.wattpadbackend.entity.*;
import lk.ijse.wattpadbackend.exception.AccessDeniedException;
import lk.ijse.wattpadbackend.exception.NotFoundException;
import lk.ijse.wattpadbackend.exception.UserNotFoundException;
import lk.ijse.wattpadbackend.repository.*;
import lk.ijse.wattpadbackend.service.ChapterService;
import lk.ijse.wattpadbackend.util.TimeAgoUtil;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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
    private final ParagraphRepository paragraphRepository;
    private final UserBlockRepository userBlockRepository;
    private final UserWattpadOriginalStoryRepository userWattpadOriginalStoryRepository;
    private final UserWattpadOriginalChapterRepository userWattpadOriginalChapterRepository;
    private final LibraryRepository libraryRepository;
    private final LibraryStoryRepository libraryStoryRepository;

    @Override
    public ChapterDTO getAChapterById(String username,long id) {

        try{
            User currentUser = userRepository.findByUsername(username);
            if(currentUser==null){
                throw new UserNotFoundException("User not found.");
            }

            Optional<Chapter> chapterOptional = chapterRepository.findById((int) id);

            if(!chapterOptional.isPresent()){
                throw new NotFoundException("Chapter not found.");
            }
            Chapter chapter = chapterOptional.get();

            if(chapter.getPublishedOrDraft()==0 && chapter.getStory().getUser().getId()!=currentUser.getId()){
                throw new NotFoundException("Chapter not found./Draft");
            }

            ChapterDTO chapterDTO = new ChapterDTO();

            chapterDTO.setId(chapter.getId());
            chapterDTO.setTitle(chapter.getTitle());
            chapterDTO.setCoverImagePath(chapter.getCoverImagePath());
            chapterDTO.setIsPublishedOrDraft(chapter.getPublishedOrDraft());

            List<ChapterLike> chapterLikeList = chapterLikeRepository.findAllByChapter(chapter);
            long likesLong = chapterLikeList.size();

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

            List<ChapterComment> chapterCommentList = chapterCommentRepository.findAllByChapter(chapter);
            long commentsCount = chapterCommentList.size();
            for (Paragraph x : chapter.getParagraphs()){
                commentsCount+=x.getParagraphComments().size();
            }

            long commentsLong = commentsCount;

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
            chapterDTO.setIsWattpadOriginal(chapter.getStory().getIsWattpadOriginal());
            chapterDTO.setChapterCoins(chapter.getCoinsAmount());
            chapterDTO.setStoryCoins(chapter.getStory().getCoinsAmount());

            chapterDTO.setUserId(chapter.getStory().getUser().getId());
            chapterDTO.setUsername(chapter.getStory().getUser().getUsername());
            chapterDTO.setUserProfilePicPath(chapter.getStory().getUser().getProfilePicPath());

            chapterDTO.setIsFromCurrentUser(0);
            long storyId = chapter.getStory().getId();
            List<Story> storyList = storyRepository.findAllByUser(currentUser);
            for (Story y : storyList) {
                if (storyId == y.getId()) {
                    chapterDTO.setIsFromCurrentUser(1);
                    chapterDTO.setIsUnlocked(1);
                    break;
                }
            }

            List<UserWattpadOriginalStory> userWattpadOriginalStoryList = userWattpadOriginalStoryRepository.findByStoryAndUser(chapter.getStory(),currentUser);
            if(userWattpadOriginalStoryList.isEmpty()){

                List<UserWattpadOriginalChapter> userWattpadOriginalChapterList = userWattpadOriginalChapterRepository.findByChapterAndUser(chapter,currentUser);
                if(userWattpadOriginalChapterList.isEmpty()){
                    chapterDTO.setIsUnlocked(0);
                }
                else{
                    chapterDTO.setIsUnlocked(1);
                }
            }
            else{
                chapterDTO.setIsUnlocked(1);
            }

            ChapterLike chapterLike = chapterLikeRepository.findByChapterAndUser(chapter,currentUser);
            if(chapterLike==null){
                chapterDTO.setIsLiked(0);
            }
            else {
                chapterDTO.setIsLiked(1);
            }

            List<Chapter> chapterList = chapterRepository.findAllByStory(chapter.getStory());

            List<ChapterSimpleDTO> chapterSimpleDTOList = new ArrayList<>();
            for (Chapter x : chapterList){
                if(x.getPublishedOrDraft()==0 && x.getStory().getUser().getId()!=currentUser.getId()){
                    continue;
                }
                ChapterSimpleDTO chapterSimpleDTO = new ChapterSimpleDTO();
                chapterSimpleDTO.setId(x.getId());
                chapterSimpleDTO.setTitle(x.getTitle());
                chapterSimpleDTO.setIsPublishedOrDraft(x.getPublishedOrDraft());

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

                long remaining = amount - singleCommentDTOList.size();

                if (remaining > 0) {
                    if (remaining <= singleCommentDTOList1.size()) {
                        singleCommentDTOList1 = singleCommentDTOList1.subList(0, (int) remaining);
                    }
                    singleCommentDTOList.addAll(singleCommentDTOList1);
                }

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
                Optional<ParagraphComment> optionalParagraphComment = paragraphCommentRepository.findById((int) id);
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

    @Override
    @Transactional
    public void saveChapter(long chapterId, long storyId, ChapterSaveRequestDTO chapterSaveRequestDTO) {

        try{
            Optional<Chapter> optionalChapter = chapterRepository.findById((int) chapterId);
            if(!optionalChapter.isPresent()){
                throw new NotFoundException("Chapter not found.");
            }
            Chapter chapter = optionalChapter.get();

            Optional<Story> optionalStory = storyRepository.findById((int) storyId);
            if(!optionalStory.isPresent()){
                throw new NotFoundException("Story not found.");
            }
            Story story = optionalStory.get();

            chapter.setTitle(chapterSaveRequestDTO.getChapterTitle());
            chapter.setStory(story);
            chapter.setCoverImagePath(chapterSaveRequestDTO.getChapterCoverUrl());
            chapterRepository.save(chapter);

            paragraphRepository.deleteAllByChapter(chapter);

            int count = 1;
            for (ContentDTO x :chapterSaveRequestDTO.getContent()){
                Paragraph paragraph = new Paragraph();
                paragraph.setChapter(chapter);
                paragraph.setContent(x.getContent());

                if(x.getType().equals("text")){
                    paragraph.setContentType("text");
                }
                else if(x.getType().equals("image")){
                    paragraph.setContentType("image");
                }
                else if(x.getType().equals("video")){
                    paragraph.setContentType("link");
                }

                paragraph.setSequenceNo(count);
                count++;

                paragraphRepository.save(paragraph);
            }

        }
        catch (NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public long createAndSaveChapter(long storyId, ChapterSaveRequestDTO chapterSaveRequestDTO) {

        try{
            Optional<Story> optionalStory = storyRepository.findById((int) storyId);
            if(!optionalStory.isPresent()){
                throw new NotFoundException("Story not found.");
            }
            Story story = optionalStory.get();

            Chapter chapter = new Chapter();
            chapter.setStory(story);
            chapter.setPublishedOrDraft(0);
            chapter.setTitle(chapterSaveRequestDTO.getChapterTitle());
            chapter.setCoverImagePath(chapterSaveRequestDTO.getChapterCoverUrl());

            Chapter savedChapter = chapterRepository.save(chapter);

            int count = 1;
            for (ContentDTO x :chapterSaveRequestDTO.getContent()){
                Paragraph paragraph = new Paragraph();
                paragraph.setChapter(savedChapter);
                paragraph.setContent(x.getContent());

                if(x.getType().equals("text")){
                    paragraph.setContentType("text");
                }
                else if(x.getType().equals("image")){
                    paragraph.setContentType("image");
                }
                else if(x.getType().equals("video")){
                    paragraph.setContentType("link");
                }

                paragraph.setSequenceNo(count);
                count++;

                paragraphRepository.save(paragraph);
            }

            return savedChapter.getId();

        }
        catch (NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public void publishAndSaveChapter(long chapterId, long storyId, ChapterSaveRequestDTO chapterSaveRequestDTO) {

        try{
            Optional<Chapter> optionalChapter = chapterRepository.findById((int) chapterId);
            if(!optionalChapter.isPresent()){
                throw new NotFoundException("Chapter not found.");
            }
            Chapter chapter = optionalChapter.get();

            Optional<Story> optionalStory = storyRepository.findById((int) storyId);
            if(!optionalStory.isPresent()){
                throw new NotFoundException("Story not found.");
            }
            Story story = optionalStory.get();
            story.setPublishedOrDraft(1);
            storyRepository.save(story);

            chapter.setTitle(chapterSaveRequestDTO.getChapterTitle());
            chapter.setCoverImagePath(chapterSaveRequestDTO.getChapterCoverUrl());
            chapter.setPublishedOrDraft(1);
            chapter.setStory(story);
            chapter.setCoinsAmount(chapterSaveRequestDTO.getCoinsAmount());
            chapterRepository.save(chapter);

            paragraphRepository.deleteAllByChapter(chapter);

            int count = 1;
            for (ContentDTO x :chapterSaveRequestDTO.getContent()){
                Paragraph paragraph = new Paragraph();
                paragraph.setChapter(chapter);
                paragraph.setContent(x.getContent());

                if(x.getType().equals("text")){
                    paragraph.setContentType("text");
                }
                else if(x.getType().equals("image")){
                    paragraph.setContentType("image");
                }
                else if(x.getType().equals("video")){
                    paragraph.setContentType("link");
                }

                paragraph.setSequenceNo(count);
                count++;

                paragraphRepository.save(paragraph);
            }

        }
        catch (NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public long createPublishAndSaveChapter(long storyId, ChapterSaveRequestDTO chapterSaveRequestDTO) {

        try{
            Optional<Story> optionalStory = storyRepository.findById((int) storyId);
            if(!optionalStory.isPresent()){
                throw new NotFoundException("Story not found.");
            }
            Story story = optionalStory.get();
            story.setPublishedOrDraft(1);
            storyRepository.save(story);

            Chapter chapter = new Chapter();
            chapter.setStory(story);
            chapter.setPublishedOrDraft(1);
            chapter.setTitle(chapterSaveRequestDTO.getChapterTitle());
            chapter.setCoverImagePath(chapterSaveRequestDTO.getChapterCoverUrl());
            chapter.setCoinsAmount(chapterSaveRequestDTO.getCoinsAmount());

            Chapter savedChapter = chapterRepository.save(chapter);

            int count = 1;
            for (ContentDTO x :chapterSaveRequestDTO.getContent()){
                Paragraph paragraph = new Paragraph();
                paragraph.setChapter(savedChapter);
                paragraph.setContent(x.getContent());

                if(x.getType().equals("text")){
                    paragraph.setContentType("text");
                }
                else if(x.getType().equals("image")){
                    paragraph.setContentType("image");
                }
                else if(x.getType().equals("video")){
                    paragraph.setContentType("link");
                }

                paragraph.setSequenceNo(count);
                count++;

                paragraphRepository.save(paragraph);
            }

            return savedChapter.getId();

        }
        catch (NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void makeStoryUnpublishByStoryId(String username, long chapterId, long storyId) {

        try{
            User user = userRepository.findByUsername(username);
            if(user==null){
                throw new UserNotFoundException("User not found.");
            }

            boolean bool = false;
            List<Story> storyList = user.getStories();
            for(Story x : storyList){
                if(x.getId()==storyId){
                    bool = true;
                    break;
                }
            }
            if(!bool){
                throw new AccessDeniedException("You haven't not access to this function");
            }

            Optional<Chapter> optionalChapter = chapterRepository.findById((int) chapterId);
            if(!optionalChapter.isPresent()){
                throw new NotFoundException("Chapter not found.");
            }
            Chapter chapter = optionalChapter.get();

            Optional<Story> optionalStory = storyRepository.findById((int) storyId);
            if(!optionalStory.isPresent()){
                throw new NotFoundException("Story not found.");
            }
            Story story = optionalStory.get();

            chapter.setPublishedOrDraft(0);
            chapterRepository.save(chapter);

            List<Chapter> chapterList = story.getChapters();
            for(Chapter x : chapterList){
                if(x.getPublishedOrDraft()==1){
                    story.setPublishedOrDraft(1);
                    storyRepository.save(story);
                    return;
                }
            }

            story.setPublishedOrDraft(0);
            storyRepository.save(story);

        }
        catch (AccessDeniedException | NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }

    }

    @Override
    public void makeChapterDeleteByChapterId(String username, long chapterId, long storyId) {

        try{
            User user = userRepository.findByUsername(username);
            if(user==null){
                throw new UserNotFoundException("User not found.");
            }

            boolean bool = false;
            List<Story> storyList = user.getStories();
            for(Story x : storyList){
                if(x.getId()==storyId){
                    bool = true;
                    break;
                }
            }
            if(!bool){
                throw new AccessDeniedException("You haven't not access to this function");
            }

            Optional<Chapter> optionalChapter = chapterRepository.findById((int) chapterId);
            if(!optionalChapter.isPresent()){
                throw new NotFoundException("Chapter not found.");
            }
            Chapter chapter = optionalChapter.get();

            Optional<Story> optionalStory = storyRepository.findById((int) storyId);
            if(!optionalStory.isPresent()){
                throw new NotFoundException("Story not found.");
            }
            Story story = optionalStory.get();

            chapterRepository.delete(chapter);

            List<Chapter> chapterList = story.getChapters();
            if(chapterList.isEmpty()){
                story.setPublishedOrDraft(0);
                storyRepository.save(story);
            }

        }
        catch (AccessDeniedException | NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<ParagraphDTO> loadAllParagraphByChapterId(String username, long chapterId, long storyId) {

        try{
            User user = userRepository.findByUsername(username);
            if(user==null){
                throw new UserNotFoundException("User not found.");
            }

            boolean bool = false;
            List<Story> storyList = user.getStories();
            for(Story x : storyList){
                if(x.getId()==storyId){
                    bool = true;
                    break;
                }
            }
            if(!bool){
                throw new AccessDeniedException("You haven't not access to this function");
            }

            Optional<Chapter> optionalChapter = chapterRepository.findById((int) chapterId);
            if(!optionalChapter.isPresent()){
                throw new NotFoundException("Chapter not found.");
            }
            Chapter chapter = optionalChapter.get();

            Optional<Story> optionalStory = storyRepository.findById((int) storyId);
            if(!optionalStory.isPresent()){
                throw new NotFoundException("Story not found.");
            }
            Story story = optionalStory.get();

            List<Paragraph> paragraphList = chapter.getParagraphs();

            List<ParagraphDTO> paragraphDTOList = new ArrayList<>();
            for (Paragraph x : paragraphList){
                ParagraphDTO paragraphDTO = new ParagraphDTO();
                paragraphDTO.setId(x.getId());
                paragraphDTO.setContentType(x.getContentType());
                paragraphDTO.setContent(x.getContent());
                paragraphDTO.setSequenceNo(x.getSequenceNo());
                paragraphDTOList.add(paragraphDTO);
            }

            return paragraphDTOList;

        }
        catch (AccessDeniedException | NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public ChapterDTO loadNextChapter(long chapterId) {

        try{
            Optional<Chapter> optionalChapter = chapterRepository.findById((int) chapterId);
            if(!optionalChapter.isPresent()){
                throw new NotFoundException("Chapter not found.");
            }
            Chapter chapter = optionalChapter.get();
            Story story =  chapter.getStory();

            List<Chapter> chapterList = chapterRepository.findAllByStory(story);
            for (int i = 0; i < chapterList.size(); i++) {
                if(chapterList.get(i).getId()==chapter.getId()){
                    if(chapterList.size()>i+1){
                        Chapter x = chapterList.get(i+1);
                        ChapterDTO chapterDTO = new ChapterDTO();
                        chapterDTO.setId(x.getId());
                        return chapterDTO;
                    }
                    else{
                        return null;
                    }
                }
            }
            return null;

        }
        catch (NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean checkCurrentCommentOrReplyByCurrentUser(String username, UserCommentTypeDTO userCommentTypeDTO) {

        try {
            User currentUser = userRepository.findByUsername(username);
            if (currentUser == null) {
                throw new UserNotFoundException("User not found.");
            }

            if(userCommentTypeDTO.getType().equals("comment")){
                Optional<ParagraphComment> optionalParagraphComment = paragraphCommentRepository.findById((int) userCommentTypeDTO.getId());
                if(!optionalParagraphComment.isPresent()){
                    throw new NotFoundException("Paragraph comment not found.");
                }
                ParagraphComment paragraphComment = optionalParagraphComment.get();
                if(paragraphComment.getUser().getId()==currentUser.getId()){
                    return true;
                }
                else{
                    return false;
                }
            }
            else if(userCommentTypeDTO.getType().equals("reply")){
                Optional<Reply> optionalReply = replyRepository.findById((int) userCommentTypeDTO.getId());
                if(!optionalReply.isPresent()){
                    throw new NotFoundException("Reply not found.");
                }
                Reply reply = optionalReply.get();
                if(reply.getUser().getId()==currentUser.getId()){
                    return true;
                }
                else{
                    return false;
                }
            }
            else{
                Optional<ChapterComment> optionalChapterComment = chapterCommentRepository.findById((int) userCommentTypeDTO.getId());
                if(!optionalChapterComment.isPresent()){
                    Optional<ParagraphComment> optionalParagraphComment = paragraphCommentRepository.findById((int) userCommentTypeDTO.getId());
                    if(!optionalParagraphComment.isPresent()){
                        throw new NotFoundException("Comment not found.");
                    }
                    ParagraphComment paragraphComment = optionalParagraphComment.get();
                    if(paragraphComment.getUser().getId()==currentUser.getId()){
                        return true;
                    }
                    else{
                        return false;
                    }
                }
                ChapterComment chapterComment = optionalChapterComment.get();
                if(chapterComment.getUser().getId()==currentUser.getId()){
                    return true;
                }
                else{
                    return false;
                }
            }

        }
        catch (NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public void deleteCommentOrReply(String username, UserCommentTypeDTO userCommentTypeDTO) {

        try {
            User currentUser = userRepository.findByUsername(username);
            if (currentUser == null) {
                throw new UserNotFoundException("User not found.");
            }

            if(userCommentTypeDTO.getType().equals("comment")){
                Optional<ParagraphComment> optionalParagraphComment = paragraphCommentRepository.findById((int) userCommentTypeDTO.getId());
                if(!optionalParagraphComment.isPresent()){
                    throw new NotFoundException("Paragraph comment not found.");
                }
                ParagraphComment paragraphComment = optionalParagraphComment.get();
                if(paragraphComment.getUser().getId()==currentUser.getId()){
                    paragraphCommentRepository.delete(paragraphComment);
                    paragraphCommentRepository.flush();
                }
                else{
                    throw new AccessDeniedException("You haven't access for this");
                }
            }
            else if(userCommentTypeDTO.getType().equals("reply")){
                Optional<Reply> optionalReply = replyRepository.findById((int) userCommentTypeDTO.getId());
                if(!optionalReply.isPresent()){
                    throw new NotFoundException("Reply not found.");
                }
                Reply reply = optionalReply.get();
                if(reply.getUser().getId()==currentUser.getId()){
                    replyRepository.delete(reply);
                    replyRepository.flush();
                }
                else{
                    throw new AccessDeniedException("You haven't access for this");
                }
            }
            else {
                Optional<ChapterComment> optionalChapterComment = chapterCommentRepository.findById((int) userCommentTypeDTO.getId());
                if(!optionalChapterComment.isPresent()){
                    Optional<ParagraphComment> optionalParagraphComment = paragraphCommentRepository.findById((int) userCommentTypeDTO.getId());
                    if(!optionalParagraphComment.isPresent()){
                        throw new NotFoundException("Comment not found.");
                    }
                    ParagraphComment paragraphComment = optionalParagraphComment.get();
                    if(paragraphComment.getUser().getId()==currentUser.getId()){
                        paragraphCommentRepository.delete(paragraphComment);
                        paragraphCommentRepository.flush();
                        return;
                    }
                    else{
                        throw new AccessDeniedException("You haven't access for this");
                    }
                }
                ChapterComment chapterComment = optionalChapterComment.get();
                if(chapterComment.getUser().getId()==currentUser.getId()){
                    chapterCommentRepository.delete(chapterComment);
                    chapterCommentRepository.flush();
                }
                else{
                    throw new AccessDeniedException("You haven't access for this");
                }
            }

        }
        catch (NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean checkThisChapterRestrictedToCurrentUserOrNot(String name, long chapterId) {

        try{
            User currentUser = userRepository.findByUsername(name);
            if(currentUser==null){
                throw new UserNotFoundException("User not found.");
            }

            Optional<Chapter> optionalChapter = chapterRepository.findById((int) chapterId);
            if(!optionalChapter.isPresent()){
                throw new NotFoundException("Chapter not found.");
            }
            Chapter chapter = optionalChapter.get();

            UserBlock userBlock = userBlockRepository.findByBlockedByUserAndBlockedUser(chapter.getStory().getUser(),currentUser);
            if(userBlock!=null){
                return true;
            }
            else{
                return false;
            }

        }
        catch (UserNotFoundException | NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public boolean unlockStory(String name, long chapterId) {

        try {
            User currentUser = userRepository.findByUsername(name);
            if (currentUser == null) {
                throw new UserNotFoundException("User not found.");
            }

            Optional<Chapter> optionalChapter = chapterRepository.findById((int) chapterId);
            if (!optionalChapter.isPresent()) {
                throw new NotFoundException("Chapter not found.");
            }
            Chapter chapter = optionalChapter.get();

            if(currentUser.getCoins()>chapter.getStory().getCoinsAmount()){

                UserWattpadOriginalStory userWattpadOriginalStory = new UserWattpadOriginalStory();
                userWattpadOriginalStory.setStory(chapter.getStory());
                userWattpadOriginalStory.setUser(currentUser);

                userWattpadOriginalStoryRepository.save(userWattpadOriginalStory);

                int coins = currentUser.getCoins();
                coins= coins-chapter.getStory().getCoinsAmount();
                currentUser.setCoins(coins);
                userRepository.save(currentUser);

                return true;
            }
            else{
                return false;
            }

        }
        catch (UserNotFoundException | NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean unlockChapter(String name, long chapterId) {

        try {
            User currentUser = userRepository.findByUsername(name);
            if (currentUser == null) {
                throw new UserNotFoundException("User not found.");
            }

            Optional<Chapter> optionalChapter = chapterRepository.findById((int) chapterId);
            if (!optionalChapter.isPresent()) {
                throw new NotFoundException("Chapter not found.");
            }
            Chapter chapter = optionalChapter.get();

            if(currentUser.getCoins()>chapter.getCoinsAmount()) {

                UserWattpadOriginalChapter userWattpadOriginalChapter = new UserWattpadOriginalChapter();
                userWattpadOriginalChapter.setUser(currentUser);
                userWattpadOriginalChapter.setChapter(chapter);

                userWattpadOriginalChapterRepository.save(userWattpadOriginalChapter);

                int coins = currentUser.getCoins();
                coins= coins-chapter.getCoinsAmount();
                currentUser.setCoins(coins);
                userRepository.save(currentUser);

                return true;
            }
            else{
                return false;
            }

        }
        catch (UserNotFoundException | NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void increaseViews(String name, long chapterId) {

        try {
            User currentUser = userRepository.findByUsername(name);
            if (currentUser == null) {
                throw new UserNotFoundException("User not found.");
            }

            Optional<Chapter> optionalChapter = chapterRepository.findById((int) chapterId);
            if (!optionalChapter.isPresent()) {
                throw new NotFoundException("Chapter not found.");
            }
            Chapter chapter = optionalChapter.get();

            long views = chapter.getViews();
            views+=1;
            chapter.setViews(views);
            chapterRepository.save(chapter);
        }
        catch (UserNotFoundException | NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public void updateLastReadChapter(String name, long chapterId) {

        try {
            User currentUser = userRepository.findByUsername(name);
            if (currentUser == null) {
                throw new UserNotFoundException("User not found.");
            }

            Optional<Chapter> optionalChapter = chapterRepository.findById((int) chapterId);
            if (!optionalChapter.isPresent()) {
                throw new NotFoundException("Chapter not found.");
            }
            Chapter chapter = optionalChapter.get();

            Library library = libraryRepository.findByUser(currentUser);
            if(library==null){
                throw new NotFoundException("Library not found.");
            }

            int lastReadChapter = 1;
            int no = 0;
            List<Chapter> chapterList = chapterRepository.findAllByStory(chapter.getStory());
            for (Chapter x : chapterList){
                no++;
                if(x.getId()==chapter.getId()){
                    lastReadChapter = no;
                    break;
                }
            }

            List<LibraryStory> libraryStories = libraryStoryRepository.findAllByLibrary(library);
            for (LibraryStory x : libraryStories){
                if(chapter.getStory().getId()==x.getStory().getId()){
                    x.setLastOpenedPage(lastReadChapter);
                    x.setLastOpenedAt(LocalDateTime.now());
                    libraryStoryRepository.save(x);
                }
            }

        }
        catch (UserNotFoundException | NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

}






















