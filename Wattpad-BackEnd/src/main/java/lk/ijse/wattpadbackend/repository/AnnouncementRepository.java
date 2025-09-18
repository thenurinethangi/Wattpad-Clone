package lk.ijse.wattpadbackend.repository;

import lk.ijse.wattpadbackend.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement,Integer> {
    List<Announcement> findAllBySendTo(String sendTo);

    List<Announcement> findAllByUserId(Long userId);
}
