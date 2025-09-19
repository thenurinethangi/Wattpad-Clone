package lk.ijse.wattpadbackend.dto;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lk.ijse.wattpadbackend.entity.Story;
import lk.ijse.wattpadbackend.entity.User;
import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
public class StoryReportRequestDTO {

    private long storyId;
    private String category;
    private String reason;
    private String description;
}
