package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.UserReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserReportRepository extends JpaRepository<UserReport,Integer> {

}
