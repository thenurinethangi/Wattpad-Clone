package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.UserCoins;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserCoinsRepository extends JpaRepository<UserCoins,Integer> {
}
