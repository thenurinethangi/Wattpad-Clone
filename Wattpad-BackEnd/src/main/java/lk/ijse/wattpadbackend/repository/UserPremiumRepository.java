package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.User;
import lk.ijse.wattpadbackend.entity.UserPremium;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface UserPremiumRepository extends JpaRepository<UserPremium,Integer> {

    List<UserPremium> findByUserAndExpireDateAfter(User user, LocalDate date);
}
