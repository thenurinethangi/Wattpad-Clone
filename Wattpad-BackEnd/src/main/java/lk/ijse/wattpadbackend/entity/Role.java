package lk.ijse.wattpadbackend.entity;

import jakarta.persistence.*;
import lk.ijse.wattpadbackend.util.Roles;
import lombok.*;

import java.math.BigInteger;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private BigInteger id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private Roles role;

    @ManyToMany(mappedBy = "roles")
    private List<User> users;
}



























