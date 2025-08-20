package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.LibraryStory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LibraryStoryRepository extends JpaRepository<LibraryStory,Integer> {
}
