package lk.ijse.wattpadbackend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigInteger;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class StoryTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "story_id",nullable = false)
    private Story story;

    @ManyToOne
    @JoinColumn(name = "tag_id",nullable = false)
    private Tag tag;

    @Override
    public String toString() {
        return "StoryTag{" +
                "id=" + id +
                ", tag=" + tag +
                '}';
    }
}



























