package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.TagSearchCriteriaDTO;
import lk.ijse.wattpadbackend.dto.TagSearchResponseDTO;

public interface TagService {

    TagSearchResponseDTO getAllStoriesOfSelectedTag(String tag, TagSearchCriteriaDTO tagSearchCriteriaDTO);
}
