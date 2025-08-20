package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.ReadingListsDTO;
import lk.ijse.wattpadbackend.dto.SingleReadingListDTO;
import lk.ijse.wattpadbackend.entity.ReadingList;
import lk.ijse.wattpadbackend.entity.ReadingListLike;
import lk.ijse.wattpadbackend.entity.ReadingListStory;
import lk.ijse.wattpadbackend.entity.User;
import lk.ijse.wattpadbackend.exception.UserNotFoundException;
import lk.ijse.wattpadbackend.repository.ReadingListLikeRepository;
import lk.ijse.wattpadbackend.repository.ReadingListRepository;
import lk.ijse.wattpadbackend.repository.UserRepository;
import lk.ijse.wattpadbackend.service.ReadingListsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReadingListsServiceImpl implements ReadingListsService {

    private final ReadingListRepository readingListRepository;
    private final UserRepository userRepository;
    private final ReadingListLikeRepository readingListLikeRepository;

    @Override
    public ReadingListsDTO getAllReadingLists(String name) {

        try {
            User user = userRepository.findByUsername(name);

            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            ReadingListsDTO readingListsDTO = new ReadingListsDTO();

            List<ReadingListLike> readingListLikeList = readingListLikeRepository.findAllByUser(user);

            long likesLong = readingListLikeList.size();

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
            readingListsDTO.setLikedReadingListCount(likesInStr);

            List<ReadingList> readingLists = readingListRepository.findAllByUser(user);

            List<SingleReadingListDTO> singleReadingListDTOList = new ArrayList<>();
            for (ReadingList x : readingLists){
                SingleReadingListDTO readingListDTO = new SingleReadingListDTO();
                readingListDTO.setReadingListId(x.getId());
                readingListDTO.setReadingListName(x.getListName());
                readingListDTO.setStoryCount(x.getStoryCount());

                List<ReadingListStory> readingListStories = x.getReadingListStories();
                List<String> threeStoriesCoverImagePath = new ArrayList<>();
                for (int i = 0; i < 3; i++) {
                    if(i>=readingListStories.size()){
                        threeStoriesCoverImagePath.add("wattpad-logo-white.svg");
                    }
                    else{
                        threeStoriesCoverImagePath.add(readingListStories.get(i).getStory().getCoverImagePath());
                    }
                }
                readingListDTO.setThreeStoriesCoverImagePath(threeStoriesCoverImagePath);

                singleReadingListDTOList.add(readingListDTO);
            }

            readingListsDTO.setSingleReadingListDTOList(singleReadingListDTOList);
            return readingListsDTO;

        }
        catch (UserNotFoundException e) {
            throw e;
        }
        catch (RuntimeException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
}
