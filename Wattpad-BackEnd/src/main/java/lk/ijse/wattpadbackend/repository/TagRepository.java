package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagRepository extends JpaRepository<Tag,Integer> {

    Tag findByTagName(String tagName);
}
