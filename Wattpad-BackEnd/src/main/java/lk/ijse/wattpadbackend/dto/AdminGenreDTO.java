package lk.ijse.wattpadbackend.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class AdminGenreDTO {

    private long id;
    private String genre;
    private String totalStories;
    private String percentage;
    private String status;
}
