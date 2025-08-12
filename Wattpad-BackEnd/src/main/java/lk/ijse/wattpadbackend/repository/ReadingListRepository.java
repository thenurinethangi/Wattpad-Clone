package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.ReadingList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReadingListRepository extends JpaRepository<ReadingList,Integer> {
}
