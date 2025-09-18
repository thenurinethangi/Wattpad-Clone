package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.Role;
import lk.ijse.wattpadbackend.util.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role,Integer> {
    Optional<Role> findByRole(Roles role);
}
