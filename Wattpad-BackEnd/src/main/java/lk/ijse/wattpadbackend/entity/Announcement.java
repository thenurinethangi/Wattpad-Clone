package lk.ijse.wattpadbackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private LocalDateTime dateTime = LocalDateTime.now();

    @Lob
    @Column(columnDefinition = "TEXT")
    private String title;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    private String sendTo;

    private Long userId;
}















