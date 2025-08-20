package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.ReadingListLike;
import lk.ijse.wattpadbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReadingListLikeRepository extends JpaRepository<ReadingListLike,Integer> {
    List<ReadingListLike> findAllByUser(User user);
}
