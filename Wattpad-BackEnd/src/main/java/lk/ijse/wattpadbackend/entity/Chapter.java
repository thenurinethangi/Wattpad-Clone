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
public class Chapter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private BigInteger id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private LocalDateTime publishedDate = LocalDateTime.now();

    private String coverImagePath;

    @Column(nullable = false)
    private BigInteger views = BigInteger.valueOf(0);

    @Column(nullable = false)
    private BigInteger likes = BigInteger.valueOf(0);

    @Column(nullable = false)
    private BigInteger comments = BigInteger.valueOf(0);

    @Column(nullable = false)
    private int publishedOrDraft = 0;

    @ManyToOne
    @JoinColumn(name = "story_id", nullable = false)
    private Story story;

    @OneToMany(mappedBy = "chapter")
    private List<Paragraph> paragraphs;

    @OneToMany(mappedBy = "chapter")
    private List<ChapterComment> chapterComments;

    @OneToMany(mappedBy = "chapter")
    private List<ChapterLike> chapterLikes;
}


































