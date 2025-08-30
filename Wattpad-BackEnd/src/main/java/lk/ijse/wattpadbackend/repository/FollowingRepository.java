package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.Following;
import lk.ijse.wattpadbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FollowingRepository extends JpaRepository<Following,Integer> {
    
    List<Following> findAllByUser(User user);

    Following findByFollowedUserIdAndUser(long id, User followingUser);
}
