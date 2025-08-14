package lk.ijse.wattpadbackend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigInteger;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Story {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    private String mainCharacters;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String targetAudience;

    @Column(nullable = false)
    private String language;

    @Column(nullable = false)
    private String copyright;

    @Column(nullable = false)
    private int rating;

    @Column(nullable = false)
    private int status = 0;

    @Column(nullable = false)
    private BigInteger views = BigInteger.valueOf(0);

    @Column(nullable = false)
    private BigInteger likes = BigInteger.valueOf(0);

    @Column(nullable = false)
    private BigInteger parts = BigInteger.valueOf(0);

    @Column(nullable = false)
    private String coverImagePath;

    @Column(nullable = false)
    private int publishedOrDraft = 0;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "story")
    private List<StoryTag> storyTags;

    @OneToMany(mappedBy = "story")
    private List<LibraryStory> libraryStories;

    @OneToMany(mappedBy = "story")
    private List<ReadingListStory> readingListStories;

    @OneToMany(mappedBy = "story")
    private List<Chapter> chapters;

    @Override
    public String toString() {
        return "Story{" +
                "id=" + id +
                ", title='" + title + '\'' +
                '}';
    }
}



























