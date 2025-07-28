package lk.ijse.wattpadbackend.entity;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigInteger;
import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private BigInteger id;

    @Column(nullable = false, unique = true)
    private String username;

    private String fullName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private Date birthday;

    private String pronouns;

    private String about;

    @Column(nullable = false)
    private Date joinedDate;

    private String websiteLink;

    private String facebookLink;

    private String location;

    private String profilePicPath;

    private String coverPicPath;

    @ManyToMany(mappedBy = "users")
    private List<Role> users;

    @OneToMany(mappedBy = "user")
    private List<Story> stories;

    @OneToMany(mappedBy = "user")
    private List<ReadingList> readingLists;
}





















