package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.User;
import lk.ijse.wattpadbackend.entity.UserMute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserMuteRepository extends JpaRepository<UserMute,Integer> {

    UserMute findByMutedByUserAndMutedUser(User mutedByUser, User mutedUser);

    List<UserMute> findAllByMutedByUser(User mutedByUser);
}
