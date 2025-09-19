package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.UserBlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserBlockRepository extends JpaRepository<UserBlock,Integer> {
}
