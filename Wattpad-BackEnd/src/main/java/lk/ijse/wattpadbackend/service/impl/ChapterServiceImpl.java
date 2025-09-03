package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.ChapterDTO;
import lk.ijse.wattpadbackend.dto.ParagraphDTO;
import lk.ijse.wattpadbackend.dto.StoryDTO;
import lk.ijse.wattpadbackend.dto.StoryIdsDTO;
import lk.ijse.wattpadbackend.entity.*;
import lk.ijse.wattpadbackend.exception.NotFoundException;
import lk.ijse.wattpadbackend.exception.UserNotFoundException;
import lk.ijse.wattpadbackend.repository.ChapterRepository;
import lk.ijse.wattpadbackend.repository.StoryRepository;
import lk.ijse.wattpadbackend.repository.UserRepository;
import lk.ijse.wattpadbackend.service.ChapterService;
import lombok.AllArgsConstructor;
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

    @Override
    public ChapterDTO getAChapterById(long id) {

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
            chapterDTO.setIsLiked(1);

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
}






















