package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.*;

import java.util.List;

public interface ChapterService {

    ChapterDTO getAChapterById(String username,long id);

    List<StoryDTO> getRecommendationStories(String username, StoryIdsDTO storyIdsDTO);

    List<StoryDTO> getAlsoYouWillLikeStories(String name, StoryIdsDTO storyIdsDTO);

    String addLikeOrRemove(String name, long chapterId);

    void addACommentToAChapter(String name, long chapterId, ReplyRequestDTO replyRequestDTO);

    List<ReplyResponseDTO> loadCommentsOfAChapter(String name, long chapterId, long amount);
}
