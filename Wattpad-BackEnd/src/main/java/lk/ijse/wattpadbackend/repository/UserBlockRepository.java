package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.User;
import lk.ijse.wattpadbackend.entity.UserBlock;
import lk.ijse.wattpadbackend.entity.UserMute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserBlockRepository extends JpaRepository<UserBlock,Integer> {
    UserBlock findByBlockedByUserAndBlockedUser(User blockedByUser, User blockedUser);
}
