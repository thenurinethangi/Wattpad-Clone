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
public class UserMute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "muted_user_id", nullable = false)
    private User mutedUser;

    @ManyToOne
    @JoinColumn(name = "muted_by_user_id", nullable = false)
    private User mutedByUser;

    private LocalDateTime blockedAt = LocalDateTime.now();
}








