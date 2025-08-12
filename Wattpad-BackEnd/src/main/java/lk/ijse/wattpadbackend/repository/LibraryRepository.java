package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.Library;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LibraryRepository extends JpaRepository<Library,Integer> {
}
