package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.*;
import lk.ijse.wattpadbackend.entity.ReadingList;
import lk.ijse.wattpadbackend.entity.ReadingListLike;
import lk.ijse.wattpadbackend.entity.ReadingListStory;
import lk.ijse.wattpadbackend.entity.User;
import lk.ijse.wattpadbackend.exception.NotFoundException;
import lk.ijse.wattpadbackend.exception.UserNotFoundException;
import lk.ijse.wattpadbackend.repository.ReadingListLikeRepository;
import lk.ijse.wattpadbackend.repository.ReadingListRepository;
import lk.ijse.wattpadbackend.repository.ReadingListStoryRepository;
import lk.ijse.wattpadbackend.repository.UserRepository;
import lk.ijse.wattpadbackend.service.ReadingListService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReadingListServiceImpl implements ReadingListService {

    private final ReadingListRepository readingListRepository;
    private final UserRepository userRepository;
    private final ReadingListLikeRepository readingListLikeRepository;
    private final ReadingListStoryRepository readingListStoryRepository;

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

    @Override
    public void deleteReadingListById(long id) {

        try {
            Optional<ReadingList> optionalReadingList = readingListRepository.findById((int) id);

            if (!optionalReadingList.isPresent()) {
                throw new NotFoundException("Reading list is not found.");
            }

            readingListRepository.delete(optionalReadingList.get());
        }
        catch (NotFoundException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public ReadingListEditResponseDTO getAllStoriesOfReadingListById(long id) {

        try{
            Optional<ReadingList> optionalReadingList = readingListRepository.findById((int) id);

            if (!optionalReadingList.isPresent()) {
                throw new NotFoundException("Reading list is not found.");
            }

            ReadingList readingList = optionalReadingList.get();
            List<ReadingListStory> readingListStories = readingList.getReadingListStories();

            ReadingListEditResponseDTO readingListEditResponseDTO = new ReadingListEditResponseDTO();
            readingListEditResponseDTO.setReadingListId(readingList.getId());
            readingListEditResponseDTO.setReadingListName(readingList.getListName());
            readingListEditResponseDTO.setStoryCount(readingList.getStoryCount());

            List<ReadingListEditStoryDTO> readingListEditStoryDTOList = new ArrayList<>();
            for (ReadingListStory x : readingListStories){
                ReadingListEditStoryDTO dto = new ReadingListEditStoryDTO();
                dto.setStoryId(x.getStory().getId());
                dto.setStoryTitle(x.getStory().getTitle());
                dto.setStoryCoverImagePath(x.getStory().getCoverImagePath());

                long viewsLong = x.getStory().getViews().longValue();

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
                dto.setViews(viewsInStr);

                long likesLong = x.getStory().getLikes().longValue();

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
                dto.setLikes(likesInStr);

                dto.setParts(x.getStory().getParts().longValue());
                dto.setUsername(x.getStory().getUser().getUsername());

                readingListEditStoryDTOList.add(dto);
            }

            readingListEditResponseDTO.setReadingListEditStoryDTOList(readingListEditStoryDTOList);
            return readingListEditResponseDTO;

        }
        catch (NotFoundException e) {
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public void updateAReadingList(ReadingListEditRequestDTO readingListEditRequestDTO) {

        try{
            Optional<ReadingList> optionalReadingList = readingListRepository.findById((int) readingListEditRequestDTO.getReadingListId());

            if(!optionalReadingList.isPresent()){
               throw new NotFoundException("Reading List not found.");
            }

            ReadingList readingList = optionalReadingList.get();

            if(!readingListEditRequestDTO.getReadingListName().isEmpty()){
                readingList.setListName(readingListEditRequestDTO.getReadingListName());
            }
            readingList.setStoryCount(readingListEditRequestDTO.getReadingListStoryCount());
            readingListRepository.save(readingList);

            List<ReadingListStory> toDelete = new ArrayList<>();
            for (ReadingListStory x : readingList.getReadingListStories()) {
                for (Long y : readingListEditRequestDTO.getStoryDeleteQueue()) {
                    if (y.equals(x.getStory().getId())) {
                        toDelete.add(x);
                        break;
                    }
                }
            }
            readingList.getReadingListStories().removeAll(toDelete);

        }
        catch (NotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}


















