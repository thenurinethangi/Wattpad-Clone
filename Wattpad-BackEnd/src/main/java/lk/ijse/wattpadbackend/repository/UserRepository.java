package lk.ijse.wattpadbackend.repository;

import jakarta.validation.constraints.Pattern;
import lk.ijse.wattpadbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {

    User findByUsername(String username);

    Optional<User> findByEmail(String email);

    List<User> findAllByUsernameContainingIgnoreCase(String username);

    List<User> findAllByFullNameContainingIgnoreCase(String fullName);
}
