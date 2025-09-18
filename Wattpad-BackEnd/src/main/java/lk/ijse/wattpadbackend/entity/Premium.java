package lk.ijse.wattpadbackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Premium {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, unique = true)
    private String type;

    @Column(nullable = false)
    private String price;

    @Column(nullable = false)
    private int bonusCoins;

    @OneToMany(mappedBy = "premium", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserPremium> userPremiums;
}















