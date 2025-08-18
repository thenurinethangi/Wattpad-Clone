package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.ReadingList;
import lk.ijse.wattpadbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReadingListRepository extends JpaRepository<ReadingList,Integer> {
    List<ReadingList> findAllByUser(User user);

    @Query(value = "select * from reading_list where user_id = :id", nativeQuery = true)
    List<ReadingList> findAllByUserId(@Param("id") long id);

    List<ReadingList> findAllByOrderByVotesDesc();
}
