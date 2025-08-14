package lk.ijse.wattpadbackend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigInteger;
import java.time.LocalDate;
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
    private long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    @Column(nullable = false)
    private LocalDate birthday;

    private String pronouns;

    private String about;

    @Column(nullable = false)
    private LocalDate joinedDate = LocalDate.now();

    private String websiteLink;

    private String facebookLink;

    private String location;

    private String profilePicPath;

    private String coverPicPath;

    private int isVerify = 0;

    private int isActive = 1;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private List<UserRole> userRoles;

    @OneToMany(mappedBy = "user")
    private List<Story> stories;

    @OneToMany(mappedBy = "user")
    private List<ReadingList> readingLists;

    @OneToMany(mappedBy = "user")
    private List<ChapterComment> chapterComments;

    @OneToMany(mappedBy = "user")
    private List<ChapterLike> chapterLikes;

    @OneToMany(mappedBy = "user")
    private List<ParagraphComment> paragraphComments;

    @OneToMany(mappedBy = "user")
    private List<Reply> replies;

    @OneToMany(mappedBy = "user")
    private List<CommentLike> commentLikes;

    @OneToMany(mappedBy = "user")
    private List<ReadingListLike> readingListLikes;

    @OneToMany(mappedBy = "user")
    private List<UserGenre> userGenres;

    public User(String username, String fullName, String email, String password, LocalDate birthday, String pronouns, int isVerify) {
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.birthday = birthday;
        this.pronouns = pronouns;
        this.isVerify = isVerify;
    }

    public User(String username, String fullName, String email, String password, LocalDate birthday, String pronouns) {
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.birthday = birthday;
        this.pronouns = pronouns;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}





















