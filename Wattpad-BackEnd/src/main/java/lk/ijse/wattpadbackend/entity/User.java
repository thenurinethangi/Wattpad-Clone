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

    @Lob
    private String profilePicPath;

    @Lob
    private String coverPicPath;

    private int isVerify = 0;

    private int isActive = 1;

    private int isVerifiedByWattpad = 0;

    private int coins = 0;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserRole> userRoles;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Story> stories;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReadingList> readingLists;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChapterComment> chapterComments;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChapterLike> chapterLikes;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ParagraphComment> paragraphComments;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reply> replies;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CommentLike> commentLikes;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReadingListLike> readingListLikes;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserGenre> userGenres;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StoryReport> storyReports;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserPremium> userPremiums;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaction> transactions;

    @Transient
    private long totalViews;

    @Transient
    private long totalLikes;

    @Transient
    private long userTotalViewsAndLikes;

    @Transient
    private long rank;

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
                ", total='" + userTotalViewsAndLikes + '\'' +
                ", rank='" + rank + '\'' +
                '}';
    }
}





















