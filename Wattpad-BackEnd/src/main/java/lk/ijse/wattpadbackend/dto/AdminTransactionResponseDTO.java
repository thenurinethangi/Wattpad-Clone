package lk.ijse.wattpadbackend.dto;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class AdminTransactionResponseDTO {

    private long totalTransactions;
    private long start;
    private long end;
    private List<TransactionDTO> transactionDTOList;
}














