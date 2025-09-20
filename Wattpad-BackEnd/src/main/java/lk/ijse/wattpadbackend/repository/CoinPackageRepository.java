package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.CoinPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoinPackageRepository extends JpaRepository<CoinPackage,Integer> {


}
