package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.UserMute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserMuteRepository extends JpaRepository<UserMute,Integer> {
}
