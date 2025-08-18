package lk.ijse.wattpadbackend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class ReadingList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String listName;

    @Column(nullable = false)
    private long storyCount = 0;

    @Column(nullable = false)
    private long votes = 0;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "readingList")
    private List<ReadingListStory> readingListStories;

    @OneToMany(mappedBy = "readingList")
    private List<ReadingListLike> readingListLikes;

    public ReadingList(String listName, User user) {
        this.listName = listName;
        this.user = user;
    }

    @Override
    public String toString() {
        return "ReadingList{" +
                "id=" + id +
                ", listName='" + listName + '\'' +
                ", storyCount=" + storyCount +
                ", votes=" + votes +
                '}';
    }
}































