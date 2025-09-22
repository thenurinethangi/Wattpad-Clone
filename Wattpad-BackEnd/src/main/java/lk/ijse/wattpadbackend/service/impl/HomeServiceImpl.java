package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.*;
import lk.ijse.wattpadbackend.entity.*;
import lk.ijse.wattpadbackend.exception.UserNotFoundException;
import lk.ijse.wattpadbackend.repository.*;
import lk.ijse.wattpadbackend.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HomeServiceImpl implements HomeService {

    private final UserRepository userRepository;
    private final LibraryRepository libraryRepository;
    private final ChapterRepository chapterRepository;
    private final ReadingListRepository readingListRepository;
    private final StoryRepository storyRepository;
    private final UserGenreRepository userGenreRepository;
    private final GenreRepository genreRepository;
    private final UserBlockRepository userBlockRepository;


    @Override
    public List<LibraryStoryResponseDTO> yourStories(String name) {

        User user = userRepository.findByUsername(name);

        if(user==null){
            throw new UserNotFoundException("User not found.");
        }

        Library library = libraryRepository.findByUser(user);
        List<LibraryStory> libraryStories = library.getLibraryStories();

        List<LibraryStory> libraryStoriesOrdered = libraryStories.stream()
                .sorted(Comparator.comparing(
                        LibraryStory::getLastOpenedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .toList();

        List<LibraryStoryResponseDTO> libraryStoryResponseDTOS = new ArrayList<>();
        for (LibraryStory x : libraryStoriesOrdered){
            LibraryStoryResponseDTO libraryStoryResponseDTO = new LibraryStoryResponseDTO();
            libraryStoryResponseDTO.setTitle(x.getStory().getTitle());
            libraryStoryResponseDTO.setParts(x.getStory().getParts());
            libraryStoryResponseDTO.setViews(x.getStory().getViews());
            libraryStoryResponseDTO.setLikes(x.getStory().getLikes());
            libraryStoryResponseDTO.setCoverImagePath(x.getStory().getCoverImagePath());
            libraryStoryResponseDTO.setAuthorId(x.getStory().getUser().getId());
            libraryStoryResponseDTO.setAuthorUsername(x.getStory().getUser().getUsername());
            libraryStoryResponseDTO.setAuthorProfilePicPath(x.getStory().getUser().getProfilePicPath());
            libraryStoryResponseDTO.setLastOpenedPage(x.getLastOpenedPage());

            //set last opened chapter id
            int lastOpenedPage = x.getLastOpenedPage();
            lastOpenedPage--;

            List<Chapter> chapterList = chapterRepository.findAllByStory(x.getStory());
            Chapter lastOpenedChapter = null;
            if(chapterList.size()>=lastOpenedPage){
                lastOpenedChapter = chapterList.get(lastOpenedPage);
            }
            else{
                if(!chapterList.isEmpty()){
                    lastOpenedChapter = chapterList.getFirst();
                }
                else{
                    lastOpenedChapter = null;
                }
            }

            libraryStoryResponseDTO.setLastReadChapterId(lastOpenedChapter.getId());

            LocalDateTime twoWeeksAgo = LocalDateTime.now().minusWeeks(2);
            int newPartCount = 0;
            for (Chapter y : chapterList){
                LocalDateTime publishedDate = y.getPublishedDate();

                if (publishedDate.isAfter(twoWeeksAgo) && publishedDate.isBefore(LocalDateTime.now())) {
//                    System.out.println("Date is within the last 2 weeks.");
                    newPartCount++;
                } else {
//                    System.out.println("Date is NOT within the last 2 weeks.");
                }
            }
            libraryStoryResponseDTO.setNewPartCount(newPartCount);

            libraryStoryResponseDTOS.add(libraryStoryResponseDTO);
        }

//        System.out.println(libraryStoryResponseDTOS);
//        for (LibraryStoryResponseDTO x : libraryStoryResponseDTOS){
//            System.out.println(x);
//        }

        return libraryStoryResponseDTOS;
    }

    @Override
    public List<StoryHomeResponseDTO> topPickupForYou(String name) {

        try {
            User user = userRepository.findByUsername(name);

            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            List<String> categories = new ArrayList<>();

            //find user library story and find those stories categories
            Library library = libraryRepository.findByUser(user);
            List<LibraryStory> libraryStories = library.getLibraryStories();

            for (LibraryStory x : libraryStories) {
                categories.add(x.getStory().getCategory());
            }

            //find reading list story and find those stories categories
            List<ReadingList> readingLists = readingListRepository.findAllByUser(user);

            for (ReadingList x : readingLists) {
                List<ReadingListStory> readingListStories = x.getReadingListStories();
                for (ReadingListStory y : readingListStories){
                    categories.add(y.getStory().getCategory());
                }
            }

            List<String> sortedUnique = new ArrayList<>(new LinkedHashSet<>(categories));
            sortedUnique.sort(Comparator.naturalOrder());

            Collections.sort(categories);

            List<Integer> eachCategoriesCount = new ArrayList<>();

            for (int i = 0; i < sortedUnique.size(); i++) {
                int count = 0;
                String cat1 = sortedUnique.get(i);
                System.out.println("cat1: "+cat1);
                for (int j = 0; j < categories.size(); j++) {
                    String cat2 = categories.get(j);
                    if(cat1.equals(cat2)){
                        count++;
                    }
                    else{
                        continue;
                    }
                }
                eachCategoriesCount.add(count);
            }

            System.out.println(sortedUnique);
            System.out.println(categories);
            System.out.println(eachCategoriesCount);

            Map<String,Integer> categoryMap = new HashMap<>();
            for (int i = 0; i < sortedUnique.size(); i++) {
                categoryMap.put(sortedUnique.get(i),eachCategoriesCount.get(i));
            }

            List<Map.Entry<String, Integer>> list = new ArrayList<>(categoryMap.entrySet());
            list.sort((e1, e2) -> e2.getValue().compareTo(e1.getValue()));

            List<String> topCategories = new ArrayList<>();
            for (int i = 0; i < list.size(); i++) {
                if(i<3){
                    topCategories.add(list.get(i).getKey());
                }
                else{
                    break;
                }
            }


            int storyCountReturn = 0;
            int totalStoryCount = 0;
            for (int i = 0; i < topCategories.size(); i++) {
                List<Story> stories = storyRepository.findAllByCategory(topCategories.get(i));
                int listLong = stories.size();
                for (Story x : stories){
                    int res = x.getPublishedOrDraft();
                    User author = x.getUser();
                    UserBlock userBlock = userBlockRepository.findByBlockedByUserAndBlockedUser(author,user);
                    if(res==0 || author==user || userBlock!=null){
                        listLong--;
                    }
                }
                totalStoryCount+=listLong;
            }

            if(totalStoryCount<16){
                for (int i = 1; i <= 15; i++) {
                    if(totalStoryCount==i){
                        storyCountReturn = i;
                    }
                }
            }
            else{
                storyCountReturn = 16;
            }

            System.out.println("a: "+totalStoryCount);
            System.out.println("b: "+storyCountReturn);

            List<Story> topPickupStoryList = new ArrayList<>();
            while (topPickupStoryList.size()<storyCountReturn){
                for (int j = 0; j < topCategories.size(); j++) {
                    List<Story> stories = storyRepository.findAllByCategory(topCategories.get(j));
                    Collections.shuffle(stories);

                    int listLong = stories.size();

                    Random random = new Random();
                    int randNo = random.nextInt(listLong);

                    if(topPickupStoryList.contains(stories.get(randNo)) || stories.get(randNo).getPublishedOrDraft()==0 || stories.get(randNo).getUser()==user){
                        continue;
                    }
                    else {
                        topPickupStoryList.add(stories.get(randNo));
                    }
                }
            }

            List<StoryHomeResponseDTO> storyHomeResponseDTOList = new ArrayList<>();
            for (Story x : topPickupStoryList){
                StoryHomeResponseDTO storyHomeResponseDTO = new StoryHomeResponseDTO();
                storyHomeResponseDTO.setStoryId(x.getId());
                storyHomeResponseDTO.setCategory(x.getCategory());
                storyHomeResponseDTO.setViews(String.valueOf(x.getViews()));
                storyHomeResponseDTO.setCoverImagePath(x.getCoverImagePath());

                List<String> tags = new ArrayList<>();
                for (StoryTag y : x.getStoryTags()){
                    Tag tag = y.getTag();
                    tags.add(tag.getTagName());
                }
                storyHomeResponseDTO.setStoryTags(tags);

                storyHomeResponseDTOList.add(storyHomeResponseDTO);
            }

            return storyHomeResponseDTOList;

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
    public List<StoryHomeResponseDTO> hotWattpadReads(String name) {

        try{
            User user = userRepository.findByUsername(name);

            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            List<Story> storyList1 = storyRepository.findAllByOrderByViewsDesc();

            List<Story> storyList = new ArrayList<>();
            for (Story x : storyList1){
                int res = x.getPublishedOrDraft();
                User author = x.getUser();
                UserBlock userBlock = userBlockRepository.findByBlockedByUserAndBlockedUser(author,user);
                if(res==0 || author==user || userBlock!=null){
                    continue;
                }
                else{
                    storyList.add(x);
                }
            }

            int storyCount = storyList.size();
            int storyCountReturn = 0;
            if(storyCount<16){
                storyCountReturn = storyCount;
            } else{
                storyCountReturn = 16;
            }

            List<Story> selectedStoryList = new ArrayList<>();
            for (int i = 0; i < storyCountReturn; i++) {
                selectedStoryList.add(storyList.get(i));
            }

            Collections.shuffle(selectedStoryList);

            List<StoryHomeResponseDTO> storyHomeResponseDTOList = new ArrayList<>();
            for (Story x : selectedStoryList){
                StoryHomeResponseDTO storyHomeResponseDTO = new StoryHomeResponseDTO();

                storyHomeResponseDTO.setStoryId(x.getId());
                storyHomeResponseDTO.setCategory(x.getCategory());
                storyHomeResponseDTO.setCoverImagePath(x.getCoverImagePath());

                long totalViews = 0;
                for(Chapter a: x.getChapters()){
                    totalViews+=a.getViews();
                }

                long viewsLong = totalViews;

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
                storyHomeResponseDTO.setViews(viewsInStr);

                List<String> tags = new ArrayList<>();
                for (StoryTag y : x.getStoryTags()){
                    Tag tag = y.getTag();
                    tags.add(tag.getTagName());
                }
                storyHomeResponseDTO.setStoryTags(tags);

                storyHomeResponseDTOList.add(storyHomeResponseDTO);
            }

            return storyHomeResponseDTOList;
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
    public List<ReadingListHomeResponseDTO> readingLists(String name) {

        try {
            User user = userRepository.findByUsername(name);

            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            List<ReadingList> readingListList = readingListRepository.findAllByOrderByVotesDesc();

            List<ReadingList> qualifiedReadingListList = new ArrayList<>();
            for (ReadingList x : readingListList) {
                if (x.getUser() == user || x.getStoryCount() < 3 || x.getListName().contains("'s Reading List")) {
                    continue;
                }
                qualifiedReadingListList.add(x);
            }

            int readingListLength = qualifiedReadingListList.size();
            int returnReadingListCount = 0;
            if(readingListLength<10){
                returnReadingListCount = readingListLength;
            }
            else{
                returnReadingListCount = 10;
            }

            List<ReadingList> finalPickupReadingList = new ArrayList<>();
            int listLong = qualifiedReadingListList.size();
            while(finalPickupReadingList.size()<returnReadingListCount){
                Collections.shuffle(qualifiedReadingListList);

                Random random = new Random();
                int randNo = random.nextInt(listLong);

                if(finalPickupReadingList.contains(qualifiedReadingListList.get(randNo))){
                    continue;
                } else {
                    finalPickupReadingList.add(qualifiedReadingListList.get(randNo));
                }
            }

            List<ReadingListHomeResponseDTO> readingListHomeResponseDTOList = new ArrayList<>();
            for (ReadingList x : finalPickupReadingList){
                ReadingListHomeResponseDTO readingListHomeResponseDTO = new ReadingListHomeResponseDTO();
                readingListHomeResponseDTO.setReadingListId(x.getId());
                readingListHomeResponseDTO.setListName(x.getListName());
                readingListHomeResponseDTO.setUserId(x.getUser().getId());
                readingListHomeResponseDTO.setUsername(x.getUser().getUsername());
                readingListHomeResponseDTO.setProfilePicPath(x.getUser().getProfilePicPath());

                List<ReadingListStory> readingListStoryList = x.getReadingListStories();
                List<StoryHomeResponseDTO> storyHomeResponseDTOSList = new ArrayList<>();
                for (ReadingListStory y : readingListStoryList){
                    StoryHomeResponseDTO storyHomeResponseDTO = new StoryHomeResponseDTO();
                    storyHomeResponseDTO.setStoryId(y.getStory().getId());
                    storyHomeResponseDTO.setCoverImagePath(y.getStory().getCoverImagePath());

                    storyHomeResponseDTOSList.add(storyHomeResponseDTO);
                }

                readingListHomeResponseDTO.setStoryHomeResponseDTOList(storyHomeResponseDTOSList);

                readingListHomeResponseDTOList.add(readingListHomeResponseDTO);
            }

            return readingListHomeResponseDTOList;

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
    public List<StoryHomeResponseDTO> storiesFromGenreYouLike(String name, HomeGenreStoriesRequestDTO homeGenreStoriesRequestDTO) {

        try {
            User user = userRepository.findByUsername(name);

            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            List<UserGenre> userGenreList = userGenreRepository.findAllByUser(user);

            List<String> userSelectedGenreslist = new ArrayList<>();
            for (UserGenre x : userGenreList){
                userSelectedGenreslist.add(x.getGenre().getGenre());
            }

            List<Story> storyList = storyRepository.findAll();

            List<Story> qualifiedStory = new ArrayList<>();
            L1:for(Story x : storyList){
                User author = x.getUser();
                UserBlock userBlock = userBlockRepository.findByBlockedByUserAndBlockedUser(author,user);
                if(x.getUser()==user || x.getPublishedOrDraft()==0 || userBlock!=null){
                    continue;
                }

                for (LibraryStory z : x.getLibraryStories()){
                    if(z.getLibrary().getUser()==user){
                        continue L1;
                    }
                }

                for (ReadingListStory q : x.getReadingListStories()){
                    if(q.getReadingList().getUser()==user){
                        continue L1;
                    }
                }

                for (String y : userSelectedGenreslist){
                    if(x.getCategory().equals(y)){
                        qualifiedStory.add(x);
                        break;
                    }
                }
            }

            List<StoryHomeResponseDTO> topPickupStoriesList  = homeGenreStoriesRequestDTO.getTopPickupStories();
            List<StoryHomeResponseDTO> hotWattpadStoriesList  = homeGenreStoriesRequestDTO.getHotWattpadStories();

            List<Story> finalQualifiedStoryList = new ArrayList<>();
            L2:for (Story x : qualifiedStory){
                long storyId = x.getId();

                for (StoryHomeResponseDTO y : topPickupStoriesList){
                    if(y.getStoryId()==storyId){
                        continue L2;
                    }
                }

                for (StoryHomeResponseDTO z : hotWattpadStoriesList){
                    if(z.getStoryId()==storyId){
                        continue L2;
                    }
                }

                finalQualifiedStoryList.add(x);
            }

            int listLong = finalQualifiedStoryList.size();
            int returnListLong = 0;

            if(listLong<10){
                returnListLong = listLong;
            }
            else{
                returnListLong = 10;
            }

            List<Story> finalReturnList = new ArrayList<>();
            while(finalReturnList.size()<returnListLong){
                Collections.shuffle(finalQualifiedStoryList);

                Random random = new Random();
                int randNo = random.nextInt(listLong);

                if(finalReturnList.contains(finalQualifiedStoryList.get(randNo))){
                    continue;
                } else {
                    finalReturnList.add(finalQualifiedStoryList.get(randNo));
                }
            }

            List<StoryHomeResponseDTO> storyHomeResponseDTOList = new ArrayList<>();
            for (Story x : finalReturnList){
                StoryHomeResponseDTO storyHomeResponseDTO = new StoryHomeResponseDTO();
                storyHomeResponseDTO.setStoryId(x.getId());
                storyHomeResponseDTO.setCategory(x.getCategory());
                storyHomeResponseDTO.setCoverImagePath(x.getCoverImagePath());
                storyHomeResponseDTO.setViews(x.getViews().toString());

                List<String> tags = new ArrayList<>();
                List<StoryTag> storyTagList = x.getStoryTags();
                for(StoryTag y : storyTagList){
                    tags.add(y.getTag().getTagName());
                }

                storyHomeResponseDTO.setStoryTags(tags);

                storyHomeResponseDTOList.add(storyHomeResponseDTO);
            }

            return storyHomeResponseDTOList;

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
    public List<StoryHomeResponseDTO> storiesFromWritersYouLike(String name, HomeGenreStoriesRequestDTO homeGenreStoriesRequestDTO) {

        try {
            User user = userRepository.findByUsername(name);

            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            List<StoryHomeResponseDTO> topPickupStories = homeGenreStoriesRequestDTO.getTopPickupStories();
            List<StoryHomeResponseDTO> hotWattpadStories = homeGenreStoriesRequestDTO.getHotWattpadStories();
            List<StoryHomeResponseDTO> storiesFromGenreYouLikeList = homeGenreStoriesRequestDTO.getStoriesFromGenreYouLikeList();

            Library library = libraryRepository.findByUser(user);
            List<LibraryStory> libraryStories = library.getLibraryStories();

            List<User> uniqueAuthors = new ArrayList<>();
            for (LibraryStory x : libraryStories){
                User u = x.getStory().getUser();
                if(uniqueAuthors.contains(u) || u==user){
                    continue;
                }
                uniqueAuthors.add(u);
            }

            List<ReadingList> readingLists = readingListRepository.findAllByUser(user);
            for (ReadingList x : readingLists){
                for (ReadingListStory y : x.getReadingListStories()){
                    User u = y.getStory().getUser();
                    if(uniqueAuthors.contains(u) || u==user){
                        continue;
                    }
                    uniqueAuthors.add(u);
                }
            }

            List<Story> allStoriesOfLikedAuthors = new ArrayList<>();
            for (User u : uniqueAuthors){
                List<Story> storyList = storyRepository.findAllByUser(u);
                for (Story x : storyList){
                    allStoriesOfLikedAuthors.add(x);
                }
            }

            List<Story> qualifiedStoryList = new ArrayList<>();
            L3:for (Story x : allStoriesOfLikedAuthors){

                User author = x.getUser();
                UserBlock userBlock = userBlockRepository.findByBlockedByUserAndBlockedUser(author,user);
                if(x.getPublishedOrDraft()==0 || x.getUser()==user || userBlock!=null){
                    continue;
                }

                Library library1 = libraryRepository.findByUser(user);
                List<LibraryStory> libraryStoryList = library1.getLibraryStories();
                for (LibraryStory a : libraryStoryList){
                    if(a.getStory()==x){
                        continue L3;
                    }
                }

                List<ReadingList> readingListList = readingListRepository.findAllByUser(user);
                for (ReadingList b : readingListList){
                    for (ReadingListStory c : b.getReadingListStories()){
                        if(c.getStory()==x){
                            continue L3;
                        }
                    }
                }

                for (StoryHomeResponseDTO q : topPickupStories){
                    if(q.getStoryId()==x.getId()){
                        continue L3;
                    }
                }

                for (StoryHomeResponseDTO r : hotWattpadStories){
                    if(r.getStoryId()==x.getId()){
                        continue L3;
                    }
                }

                for (StoryHomeResponseDTO s : storiesFromGenreYouLikeList){
                    if(s.getStoryId()==x.getId()){
                        continue L3;
                    }
                }

                qualifiedStoryList.add(x);
            }

            int listLong = qualifiedStoryList.size();
            int returnListLong = 0;

            if(listLong<16){
                returnListLong = listLong;
            }
            else{
                returnListLong = 16;
            }

            List<Story> finalReturnList = new ArrayList<>();
            while(finalReturnList.size()<returnListLong){
                Collections.shuffle(qualifiedStoryList);

                Random random = new Random();
                int randNo = random.nextInt(listLong);

                if(finalReturnList.contains(qualifiedStoryList.get(randNo))){
                    continue;
                } else {
                    finalReturnList.add(qualifiedStoryList.get(randNo));
                }
            }

            List<StoryHomeResponseDTO> storyHomeResponseDTOList = new ArrayList<>();
            for (Story x : finalReturnList){
                StoryHomeResponseDTO storyHomeResponseDTO = new StoryHomeResponseDTO();
                storyHomeResponseDTO.setStoryId(x.getId());
                storyHomeResponseDTO.setCategory(x.getCategory());
                storyHomeResponseDTO.setCoverImagePath(x.getCoverImagePath());
                storyHomeResponseDTO.setViews(x.getViews().toString());

                List<String> tags = new ArrayList<>();
                List<StoryTag> storyTagList = x.getStoryTags();
                for(StoryTag y : storyTagList){
                    tags.add(y.getTag().getTagName());
                }

                storyHomeResponseDTO.setStoryTags(tags);

                storyHomeResponseDTOList.add(storyHomeResponseDTO);
            }

            return storyHomeResponseDTOList;

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
    public List<StoryHomeResponseDTO> recommendationForYou(String name, HomeGenreStoriesRequestDTO homeGenreStoriesRequestDTO) {

        try {
            User user = userRepository.findByUsername(name);

            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            List<StoryHomeResponseDTO> topPickupStories = homeGenreStoriesRequestDTO.getTopPickupStories();
            List<StoryHomeResponseDTO> hotWattpadStories = homeGenreStoriesRequestDTO.getHotWattpadStories();
            List<StoryHomeResponseDTO> storiesFromGenreYouLikeList = homeGenreStoriesRequestDTO.getStoriesFromGenreYouLikeList();
            List<StoryHomeResponseDTO> storiesFromWritersYouLikeList = homeGenreStoriesRequestDTO.getStoriesFromWritersYouLikeList();

            Library library = libraryRepository.findByUser(user);
            List<LibraryStory> libraryStories = library.getLibraryStories();

            List<String> uniqueTags = new ArrayList<>();
            for(LibraryStory x : libraryStories){
                List<StoryTag> storyTags = x.getStory().getStoryTags();
                for(StoryTag y : storyTags){
                    String tagName = y.getTag().getTagName();
                    if(!uniqueTags.contains(tagName)){
                        uniqueTags.add(tagName);
                    }
                }
            }

            List<ReadingList> readingLists = readingListRepository.findAllByUser(user);
            for(ReadingList x : readingLists){
                List<ReadingListStory> readingListStories = x.getReadingListStories();
                for(ReadingListStory y : readingListStories){
                    List<StoryTag> storyTags = y.getStory().getStoryTags();
                    for(StoryTag z : storyTags){
                        String tagName = z.getTag().getTagName();
                        if(!uniqueTags.contains(tagName)){
                            uniqueTags.add(tagName);
                        }
                    }
                }
            }

            List<String> qualifiedCategory = new ArrayList<>();
            for(StoryHomeResponseDTO x : topPickupStories){
                if(!qualifiedCategory.contains(x.getCategory())){
                    qualifiedCategory.add(x.getCategory());
                }
            }

            List<Story> stories = storyRepository.findAll();

            List<Story> qualifiedStories = new ArrayList<>();
            L4:for(Story x : stories){

                User author = x.getUser();
                UserBlock userBlock = userBlockRepository.findByBlockedByUserAndBlockedUser(author,user);
                if(x.getPublishedOrDraft()==0 || x.getUser()==user || userBlock!=null){
                    continue;
                }

                Library library1 = libraryRepository.findByUser(user);
                List<LibraryStory> libraryStoryList = library1.getLibraryStories();
                for (LibraryStory a : libraryStoryList){
                    if(a.getStory()==x){
                        continue L4;
                    }
                }

                List<ReadingList> readingListList = readingListRepository.findAllByUser(user);
                for (ReadingList b : readingListList){
                    for (ReadingListStory c : b.getReadingListStories()){
                        if(c.getStory()==x){
                            continue L4;
                        }
                    }
                }

                for (StoryHomeResponseDTO q : topPickupStories){
                    if(q.getStoryId()==x.getId()){
                        continue L4;
                    }
                }

                for (StoryHomeResponseDTO r : hotWattpadStories){
                    if(r.getStoryId()==x.getId()){
                        continue L4;
                    }
                }

                for (StoryHomeResponseDTO s : storiesFromGenreYouLikeList){
                    if(s.getStoryId()==x.getId()){
                        continue L4;
                    }
                }

                for (StoryHomeResponseDTO s : storiesFromWritersYouLikeList){
                    if(s.getStoryId()==x.getId()){
                        continue L4;
                    }
                }

                for(StoryTag a : x.getStoryTags()){
                   String tagName = a.getTag().getTagName();
                   if(uniqueTags.contains(tagName)){
                       qualifiedStories.add(x);
                       continue L4;
                   }
                }

                String category = x.getCategory();
                if(qualifiedCategory.contains(category)){
                    qualifiedStories.add(x);
                }
            }

            int listLong = qualifiedStories.size();
            int returnListLong = 0;

            if(listLong<10){
                returnListLong = listLong;
            }
            else{
                returnListLong = 10;
            }

            List<Story> finalReturnList = new ArrayList<>();
            while(finalReturnList.size()<returnListLong){
                Collections.shuffle(qualifiedStories);

                Random random = new Random();
                int randNo = random.nextInt(listLong);

                if(finalReturnList.contains(qualifiedStories.get(randNo))){
                    continue;
                } else {
                    finalReturnList.add(qualifiedStories.get(randNo));
                }
            }

            List<StoryHomeResponseDTO> storyHomeResponseDTOList = new ArrayList<>();
            for (Story x : finalReturnList){
                StoryHomeResponseDTO storyHomeResponseDTO = new StoryHomeResponseDTO();
                storyHomeResponseDTO.setStoryId(x.getId());
                storyHomeResponseDTO.setCategory(x.getCategory());
                storyHomeResponseDTO.setCoverImagePath(x.getCoverImagePath());
                storyHomeResponseDTO.setViews(x.getViews().toString());

                List<String> tags = new ArrayList<>();
                List<StoryTag> storyTagList = x.getStoryTags();
                for(StoryTag y : storyTagList){
                    tags.add(y.getTag().getTagName());
                }

                storyHomeResponseDTO.setStoryTags(tags);

                storyHomeResponseDTOList.add(storyHomeResponseDTO);
            }

            return storyHomeResponseDTOList;

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
    public List<StoryHomeResponseDTO> completedStories(String name, HomeGenreStoriesRequestDTO homeGenreStoriesRequestDTO) {

        try {
            User user = userRepository.findByUsername(name);

            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            List<StoryHomeResponseDTO> topPickupStories = homeGenreStoriesRequestDTO.getTopPickupStories();
            List<StoryHomeResponseDTO> hotWattpadStories = homeGenreStoriesRequestDTO.getHotWattpadStories();
            List<StoryHomeResponseDTO> storiesFromGenreYouLikeList = homeGenreStoriesRequestDTO.getStoriesFromGenreYouLikeList();
            List<StoryHomeResponseDTO> storiesFromWritersYouLikeList = homeGenreStoriesRequestDTO.getStoriesFromWritersYouLikeList();
            List<StoryHomeResponseDTO> recommendationForYouStoriesList = homeGenreStoriesRequestDTO.getRecommendationForYouStoriesList();

            List<Story> stories = storyRepository.findAll();

            List<Story> qualifiedStories = new ArrayList<>();
            L5:for(Story x : stories){

                User author = x.getUser();
                UserBlock userBlock = userBlockRepository.findByBlockedByUserAndBlockedUser(author,user);
                if(x.getPublishedOrDraft()==0 || x.getUser()==user || x.getStatus()==0 || userBlock!=null){
                    continue;
                }

                Library library1 = libraryRepository.findByUser(user);
                List<LibraryStory> libraryStoryList = library1.getLibraryStories();
                for (LibraryStory a : libraryStoryList){
                    if(a.getStory()==x){
                        continue L5;
                    }
                }

//                List<ReadingList> readingListList = readingListRepository.findAllByUser(user);
//                for (ReadingList b : readingListList){
//                    for (ReadingListStory c : b.getReadingListStories()){
//                        if(c.getStory()==x){
//                            continue L5;
//                        }
//                    }
//                }

                for (StoryHomeResponseDTO q : topPickupStories){
                    if(q.getStoryId()==x.getId()){
                        continue L5;
                    }
                }

                for (StoryHomeResponseDTO r : hotWattpadStories){
                    if(r.getStoryId()==x.getId()){
                        continue L5;
                    }
                }

                for (StoryHomeResponseDTO s : storiesFromGenreYouLikeList){
                    if(s.getStoryId()==x.getId()){
                        continue L5;
                    }
                }

                for (StoryHomeResponseDTO s : storiesFromWritersYouLikeList){
                    if(s.getStoryId()==x.getId()){
                        continue L5;
                    }
                }

                for (StoryHomeResponseDTO s : recommendationForYouStoriesList){
                    if(s.getStoryId()==x.getId()){
                        continue L5;
                    }
                }

                qualifiedStories.add(x);
            }

            int listLong = qualifiedStories.size();
            int returnListLong = 0;

            if(listLong<10){
                returnListLong = listLong;
            }
            else{
                returnListLong = 10;
            }

            List<Story> finalReturnList = new ArrayList<>();
            while(finalReturnList.size()<returnListLong){
                Collections.shuffle(qualifiedStories);

                Random random = new Random();
                int randNo = random.nextInt(listLong);

                if(finalReturnList.contains(qualifiedStories.get(randNo))){
                    continue;
                } else {
                    finalReturnList.add(qualifiedStories.get(randNo));
                }
            }

            List<StoryHomeResponseDTO> storyHomeResponseDTOList = new ArrayList<>();
            for (Story x : finalReturnList){
                StoryHomeResponseDTO storyHomeResponseDTO = new StoryHomeResponseDTO();
                storyHomeResponseDTO.setStoryId(x.getId());
                storyHomeResponseDTO.setCategory(x.getCategory());
                storyHomeResponseDTO.setCoverImagePath(x.getCoverImagePath());
                storyHomeResponseDTO.setViews(x.getViews().toString());

                List<String> tags = new ArrayList<>();
                List<StoryTag> storyTagList = x.getStoryTags();
                for(StoryTag y : storyTagList){
                    tags.add(y.getTag().getTagName());
                }

                storyHomeResponseDTO.setStoryTags(tags);

                storyHomeResponseDTOList.add(storyHomeResponseDTO);
            }

            return storyHomeResponseDTOList;

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
    public List<StoryHomeResponseDTO> trySomethingNew(String name, HomeGenreStoriesRequestDTO homeGenreStoriesRequestDTO) {

        try {
            User user = userRepository.findByUsername(name);

            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            List<StoryHomeResponseDTO> topPickupStories = homeGenreStoriesRequestDTO.getTopPickupStories();
            List<StoryHomeResponseDTO> hotWattpadStories = homeGenreStoriesRequestDTO.getHotWattpadStories();
            List<StoryHomeResponseDTO> storiesFromGenreYouLikeList = homeGenreStoriesRequestDTO.getStoriesFromGenreYouLikeList();
            List<StoryHomeResponseDTO> storiesFromWritersYouLikeList = homeGenreStoriesRequestDTO.getStoriesFromWritersYouLikeList();
            List<StoryHomeResponseDTO> recommendationForYouStoriesList = homeGenreStoriesRequestDTO.getRecommendationForYouStoriesList();
            List<StoryHomeResponseDTO> completedStoriesList = homeGenreStoriesRequestDTO.getCompletedStoriesList();

            Library library = libraryRepository.findByUser(user);
            List<LibraryStory> libraryStories = library.getLibraryStories();

            List<String> categories = new ArrayList<>();
            for(LibraryStory x : libraryStories){
                categories.add(x.getStory().getCategory());
            }

            List<ReadingList> readingLists = readingListRepository.findAllByUser(user);
            for(ReadingList x : readingLists){
                for(ReadingListStory y : x.getReadingListStories()){
                    categories.add(y.getStory().getCategory());
                }
            }

            Collections.sort(categories);

            Map<String, Integer> categoryWithCount = new TreeMap<>();
            int count = 1;
            for (int i = 0; i < categories.size(); i++) {
                if (i == categories.size() - 1 || !categories.get(i).equals(categories.get(i + 1))) {
                    categoryWithCount.put(categories.get(i), count);
                    count = 1;
                }
                else {
                    count++;
                }
            }

            List<Genre> genres = genreRepository.findAll();

            List<String> allGenreInstr = new ArrayList<>();
            for(Genre x : genres){
                allGenreInstr.add(x.getGenre());
            }

            List<String> userUnLikedGenreList = new ArrayList<>();
            for(String x : allGenreInstr){
                Integer value = categoryWithCount.get(x);
                if(value==null){
                    userUnLikedGenreList.add(x);
                }
            }

            if(!userUnLikedGenreList.isEmpty()){

                List<Story> stories = storyRepository.findAll();

                List<Story> qualifiedStories = new ArrayList<>();
                L6:for(Story x : stories){

                    User author = x.getUser();
                    UserBlock userBlock = userBlockRepository.findByBlockedByUserAndBlockedUser(author,user);
                    if(x.getPublishedOrDraft()==0 || x.getUser()==user || userBlock!=null){
                        continue;
                    }

                    for (StoryHomeResponseDTO q : topPickupStories){
                        if(q.getStoryId()==x.getId()){
                            continue L6;
                        }
                    }

                    for (StoryHomeResponseDTO r : hotWattpadStories){
                        if(r.getStoryId()==x.getId()){
                            continue L6;
                        }
                    }

                    for (StoryHomeResponseDTO s : storiesFromGenreYouLikeList){
                        if(s.getStoryId()==x.getId()){
                            continue L6;
                        }
                    }

                    for (StoryHomeResponseDTO s : storiesFromWritersYouLikeList){
                        if(s.getStoryId()==x.getId()){
                            continue L6;
                        }
                    }

                    for (StoryHomeResponseDTO s : recommendationForYouStoriesList){
                        if(s.getStoryId()==x.getId()){
                            continue L6;
                        }
                    }

                    for (StoryHomeResponseDTO s : completedStoriesList){
                        if(s.getStoryId()==x.getId()){
                            continue L6;
                        }
                    }

                    if(userUnLikedGenreList.contains(x.getCategory())){
                        qualifiedStories.add(x);
                    }
                }

                int listLong = qualifiedStories.size();
                int returnListLong = 0;

                if(listLong<10){
                    returnListLong = listLong;
                }
                else{
                    returnListLong = 10;
                }

                List<Story> finalReturnList = new ArrayList<>();
                while(finalReturnList.size()<returnListLong){
                    Collections.shuffle(qualifiedStories);

                    Random random = new Random();
                    int randNo = random.nextInt(listLong);

                    if(finalReturnList.contains(qualifiedStories.get(randNo))){
                        continue;
                    } else {
                        finalReturnList.add(qualifiedStories.get(randNo));
                    }
                }

                List<StoryHomeResponseDTO> storyHomeResponseDTOList = new ArrayList<>();
                for (Story x : finalReturnList){
                    StoryHomeResponseDTO storyHomeResponseDTO = new StoryHomeResponseDTO();
                    storyHomeResponseDTO.setStoryId(x.getId());
                    storyHomeResponseDTO.setCategory(x.getCategory());
                    storyHomeResponseDTO.setCoverImagePath(x.getCoverImagePath());
                    storyHomeResponseDTO.setViews(x.getViews().toString());

                    List<String> tags = new ArrayList<>();
                    List<StoryTag> storyTagList = x.getStoryTags();
                    for(StoryTag y : storyTagList){
                        tags.add(y.getTag().getTagName());
                    }

                    storyHomeResponseDTO.setStoryTags(tags);

                    storyHomeResponseDTOList.add(storyHomeResponseDTO);
                }

                return storyHomeResponseDTOList;
            }
            else{

                Map<String, Integer> sortedCategoryWithCount = categoryWithCount.entrySet()
                        .stream()
                        .sorted(Map.Entry.<String, Integer>comparingByValue())
                        .collect(Collectors.toMap(
                                Map.Entry::getKey,
                                Map.Entry::getValue,
                                (e1, e2) -> e1,
                                LinkedHashMap::new
                        ));

                List<Map.Entry<String, Integer>> entries = new ArrayList<>(sortedCategoryWithCount.entrySet());

                List<String> leastLikedCategory = new ArrayList<>();
                for (int i = 0; i < 5; i++) {
                    Map.Entry<String, Integer> entry = entries.get(i);
                    leastLikedCategory.add(entry.getKey());
                }

                List<Story> stories = storyRepository.findAll();

                List<Story> qualifiedStories = new ArrayList<>();
                L7:for(Story x : stories){

                    User author = x.getUser();
                    UserBlock userBlock = userBlockRepository.findByBlockedByUserAndBlockedUser(author,user);
                    if(x.getPublishedOrDraft()==0 || x.getUser()==user || userBlock!=null){
                        continue;
                    }

                    Library library1 = libraryRepository.findByUser(user);
                    List<LibraryStory> libraryStoryList = library1.getLibraryStories();
                    for (LibraryStory a : libraryStoryList){
                        if(a.getStory()==x){
                            continue L7;
                        }
                    }

//                List<ReadingList> readingListList = readingListRepository.findAllByUser(user);
//                for (ReadingList b : readingListList){
//                    for (ReadingListStory c : b.getReadingListStories()){
//                        if(c.getStory()==x){
//                            continue L5;
//                        }
//                    }
//                }

                    for (StoryHomeResponseDTO q : topPickupStories){
                        if(q.getStoryId()==x.getId()){
                            continue L7;
                        }
                    }

                    for (StoryHomeResponseDTO r : hotWattpadStories){
                        if(r.getStoryId()==x.getId()){
                            continue L7;
                        }
                    }

                    for (StoryHomeResponseDTO s : storiesFromGenreYouLikeList){
                        if(s.getStoryId()==x.getId()){
                            continue L7;
                        }
                    }

                    for (StoryHomeResponseDTO s : storiesFromWritersYouLikeList){
                        if(s.getStoryId()==x.getId()){
                            continue L7;
                        }
                    }

                    for (StoryHomeResponseDTO s : recommendationForYouStoriesList){
                        if(s.getStoryId()==x.getId()){
                            continue L7;
                        }
                    }

                    for (StoryHomeResponseDTO s : completedStoriesList){
                        if(s.getStoryId()==x.getId()){
                            continue L7;
                        }
                    }

                    if(leastLikedCategory.contains(x.getCategory())){
                        qualifiedStories.add(x);
                    }
                }

                int listLong = qualifiedStories.size();
                int returnListLong = 0;

                if(listLong<10){
                    returnListLong = listLong;
                }
                else{
                    returnListLong = 10;
                }

                List<Story> finalReturnList = new ArrayList<>();
                while(finalReturnList.size()<returnListLong){
                    Collections.shuffle(qualifiedStories);

                    Random random = new Random();
                    int randNo = random.nextInt(listLong);

                    if(finalReturnList.contains(qualifiedStories.get(randNo))){
                        continue;
                    } else {
                        finalReturnList.add(qualifiedStories.get(randNo));
                    }
                }

                List<StoryHomeResponseDTO> storyHomeResponseDTOList = new ArrayList<>();
                for (Story x : finalReturnList){
                    StoryHomeResponseDTO storyHomeResponseDTO = new StoryHomeResponseDTO();
                    storyHomeResponseDTO.setStoryId(x.getId());
                    storyHomeResponseDTO.setCategory(x.getCategory());
                    storyHomeResponseDTO.setCoverImagePath(x.getCoverImagePath());
                    storyHomeResponseDTO.setViews(x.getViews().toString());

                    List<String> tags = new ArrayList<>();
                    List<StoryTag> storyTagList = x.getStoryTags();
                    for(StoryTag y : storyTagList){
                        tags.add(y.getTag().getTagName());
                    }

                    storyHomeResponseDTO.setStoryTags(tags);

                    storyHomeResponseDTOList.add(storyHomeResponseDTO);
                }

                return storyHomeResponseDTOList;
            }

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
    public List<List<StoryHomeResponseDTO>> moreStories(String name, HomeGenreStoriesRequestDTO homeGenreStoriesRequestDTO) {

        try {
            User user = userRepository.findByUsername(name);

            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            List<StoryHomeResponseDTO> topPickupStories = homeGenreStoriesRequestDTO.getTopPickupStories();
            List<StoryHomeResponseDTO> hotWattpadStories = homeGenreStoriesRequestDTO.getHotWattpadStories();
            List<StoryHomeResponseDTO> storiesFromGenreYouLikeList = homeGenreStoriesRequestDTO.getStoriesFromGenreYouLikeList();
            List<StoryHomeResponseDTO> storiesFromWritersYouLikeList = homeGenreStoriesRequestDTO.getStoriesFromWritersYouLikeList();
            List<StoryHomeResponseDTO> recommendationForYouStoriesList = homeGenreStoriesRequestDTO.getRecommendationForYouStoriesList();
            List<StoryHomeResponseDTO> completedStoriesList = homeGenreStoriesRequestDTO.getCompletedStoriesList();
            List<StoryHomeResponseDTO> trySomethingNewStoriesList = homeGenreStoriesRequestDTO.getTrySomethingNewStoriesList();

            List<Story> stories = storyRepository.findAll();

            List<Story> qualifiedStories = new ArrayList<>();
            L5:for(Story x : stories){

                User author = x.getUser();
                UserBlock userBlock = userBlockRepository.findByBlockedByUserAndBlockedUser(author,user);
                if(x.getPublishedOrDraft()==0 || x.getUser()==user || userBlock!=null){
                    continue;
                }

                Library library1 = libraryRepository.findByUser(user);
                List<LibraryStory> libraryStoryList = library1.getLibraryStories();
                for (LibraryStory a : libraryStoryList){
                    if(a.getStory()==x){
                        continue L5;
                    }
                }

                List<ReadingList> readingListList = readingListRepository.findAllByUser(user);
                for (ReadingList b : readingListList){
                    for (ReadingListStory c : b.getReadingListStories()){
                        if(c.getStory()==x){
                            continue L5;
                        }
                    }
                }

                for (StoryHomeResponseDTO q : topPickupStories){
                    if(q.getStoryId()==x.getId()){
                        continue L5;
                    }
                }

                for (StoryHomeResponseDTO r : hotWattpadStories){
                    if(r.getStoryId()==x.getId()){
                        continue L5;
                    }
                }

                for (StoryHomeResponseDTO s : storiesFromGenreYouLikeList){
                    if(s.getStoryId()==x.getId()){
                        continue L5;
                    }
                }

                for (StoryHomeResponseDTO s : storiesFromWritersYouLikeList){
                    if(s.getStoryId()==x.getId()){
                        continue L5;
                    }
                }

                for (StoryHomeResponseDTO s : recommendationForYouStoriesList){
                    if(s.getStoryId()==x.getId()){
                        continue L5;
                    }
                }

                for (StoryHomeResponseDTO s : completedStoriesList){
                    if(s.getStoryId()==x.getId()){
                        continue L5;
                    }
                }

                for (StoryHomeResponseDTO s : trySomethingNewStoriesList){
                    if(s.getStoryId()==x.getId()){
                        continue L5;
                    }
                }

                qualifiedStories.add(x);
            }

            int listLong = qualifiedStories.size();
            int returnListLong = 0;

            if(listLong<20){
                for (int i = 5; i < 19; i+=5) {
                    if(listLong==i){
                        returnListLong = i;
                        break;
                    }
                    else if(listLong>i){
                        continue;
                    }
                }
            }
            else{
                returnListLong = 20;
            }

            if(returnListLong==0){
                return List.of();
            }

            List<Story> finalReturnList = new ArrayList<>();
            for (int i = 0; i < returnListLong; i++) {
                finalReturnList.add(qualifiedStories.get(i));
            }

            int x = 0;
            int y = 5;
            List<List<StoryHomeResponseDTO>> lists = new ArrayList<>();
            for (int i = 0; i < finalReturnList.size()/5; i++) {
                List<StoryHomeResponseDTO> storyHomeResponseDTOList = new ArrayList<>();

                for (int j = x; j < y; j++) {
                    StoryHomeResponseDTO storyHomeResponseDTO = new StoryHomeResponseDTO();
                    Story a = finalReturnList.get(j);

                    storyHomeResponseDTO.setStoryId(a.getId());
                    storyHomeResponseDTO.setCategory(a.getCategory());
                    storyHomeResponseDTO.setCoverImagePath(a.getCoverImagePath());
                    storyHomeResponseDTO.setViews(a.getViews().toString());

                    List<String> tags = new ArrayList<>();
                    List<StoryTag> storyTagList = a.getStoryTags();
                    for(StoryTag b : storyTagList){
                        tags.add(b.getTag().getTagName());
                    }

                    storyHomeResponseDTO.setStoryTags(tags);

                    storyHomeResponseDTOList.add(storyHomeResponseDTO);
                }
                lists.add(storyHomeResponseDTOList);
                x = y;
                y = y+5;
            }

            return lists;
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





















