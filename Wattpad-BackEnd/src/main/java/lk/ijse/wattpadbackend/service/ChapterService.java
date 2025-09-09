package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.*;

import java.util.List;

public interface ChapterService {

    ChapterDTO getAChapterById(String username,long id);

    List<StoryDTO> getRecommendationStories(String username, StoryIdsDTO storyIdsDTO);

    List<StoryDTO> getAlsoYouWillLikeStories(String name, StoryIdsDTO storyIdsDTO);

    String addLikeOrRemove(String name, long chapterId);

    void addACommentToAChapter(String name, long chapterId, ReplyRequestDTO replyRequestDTO);

    List<SingleCommentDTO> loadCommentsOfAChapter(String name, long chapterId, long amount);

    String addOrRemoveLikeOnChapterComment(String name, long id);

    void saveChapter(long chapterId, long storyId, ChapterSaveRequestDTO chapterSaveRequestDTO);

    long createAndSaveChapter(long storyId, ChapterSaveRequestDTO chapterSaveRequestDTO);

    void publishAndSaveChapter(long chapterId, long storyId, ChapterSaveRequestDTO chapterSaveRequestDTO);

    long createPublishAndSaveChapter(long storyId, ChapterSaveRequestDTO chapterSaveRequestDTO);


    void makeStoryUnpublishByStoryId(String name, long chapterId, long storyId);

    void makeChapterDeleteByChapterId(String name, long chapterId, long storyId);
}
