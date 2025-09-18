package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class TransactionDTO {

    private long id;
    private long userId;
    private String dateTime;
    private String amount;
    private String reason;
}
