package lk.ijse.wattpadbackend.service;

import java.util.List;

public interface SearchService {

    List<String> getTopResultForSearch(String input);
}
