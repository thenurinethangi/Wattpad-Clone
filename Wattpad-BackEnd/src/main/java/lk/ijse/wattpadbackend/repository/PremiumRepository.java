package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.Premium;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PremiumRepository extends JpaRepository<Premium,Integer> {
}
