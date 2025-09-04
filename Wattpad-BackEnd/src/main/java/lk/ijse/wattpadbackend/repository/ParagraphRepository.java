package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.Paragraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParagraphRepository extends JpaRepository<Paragraph,Integer> {
}
