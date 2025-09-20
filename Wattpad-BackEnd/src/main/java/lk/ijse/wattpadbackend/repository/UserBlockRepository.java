package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.User;
import lk.ijse.wattpadbackend.entity.UserBlock;
import lk.ijse.wattpadbackend.entity.UserMute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserBlockRepository extends JpaRepository<UserBlock,Integer> {

    UserBlock findByBlockedByUserAndBlockedUser(User blockedByUser, User blockedUser);

    List<UserBlock> findAllByBlockedByUser(User blockedByUser);
}
