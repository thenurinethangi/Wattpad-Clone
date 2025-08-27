package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.entity.Story;
import lk.ijse.wattpadbackend.repository.StoryRepository;
import lk.ijse.wattpadbackend.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final StoryRepository storyRepository;

    @Override
    public List<String> getTopResultForSearch(String input) {

        List<Story> storyList = storyRepository.findByTitleContainingIgnoreCase(input);

        int returnCount = 0;
        if(storyList.size()<8){
            returnCount = storyList.size();
        }
        else{
           returnCount = 8;
        }
        
        List<String> topStoryTitles = new ArrayList<>();
        for (int i = 0; i < returnCount; i++) {
            if(storyList.get(i).getTitle().toLowerCase().startsWith(input.toLowerCase())){
                topStoryTitles.add(storyList.get(i).getTitle());
            }
        }

        for (int i = 0; i < returnCount; i++) {
            if(!storyList.get(i).getTitle().toLowerCase().startsWith(input.toLowerCase())){
                topStoryTitles.add(storyList.get(i).getTitle());
            }
        }

        return topStoryTitles;
    }
}





















