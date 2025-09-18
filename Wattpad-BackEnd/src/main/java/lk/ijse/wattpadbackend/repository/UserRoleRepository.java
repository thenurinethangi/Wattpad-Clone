package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole,Integer> {

}
