package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.*;
import lk.ijse.wattpadbackend.entity.*;
import lk.ijse.wattpadbackend.repository.TransactionRepository;
import lk.ijse.wattpadbackend.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;

    @Override
    public AdminTransactionResponseDTO loadTransactionsForAdminBySortingCriteria(long no, AdminTransactionRequestDTO adminTransactionRequestDTO) {

        try{
            List<Transaction> transactionList = transactionRepository.findAll();

            AdminTransactionResponseDTO adminTransactionResponseDTO = new AdminTransactionResponseDTO();
            adminTransactionResponseDTO.setTotalTransactions(transactionList.size());

            List<Transaction> sortAfterReason = new ArrayList<>();
            for (Transaction x : transactionList){
                if(adminTransactionRequestDTO.getReason().equals("all")){
                    sortAfterReason.add(x);
                }
                else if (adminTransactionRequestDTO.getReason().equals("premium buy")) {
                    if(x.getReason().equalsIgnoreCase("premium buy")){
                        sortAfterReason.add(x);
                    }
                }
                else if (adminTransactionRequestDTO.getReason().equals("coins buy")) {
                    if(x.getReason().equalsIgnoreCase("coins buy")){
                        sortAfterReason.add(x);
                    }
                }
            }

            long end = (no*12)-1;
            long start = ((end+1)-12);

            List<Transaction> sortAfterCount = new ArrayList<>();
            if(sortAfterReason.size()>start){
                for (long i = start; i <= end; i++) {
                    if(i<sortAfterReason.size()){
                        sortAfterCount.add(sortAfterReason.get((int) i));
                    }
                    else{
                        break;
                    }
                }
            }

            adminTransactionResponseDTO.setStart(start+1);
            adminTransactionResponseDTO.setEnd(end+1);

            List<TransactionDTO> transactionDTOS = new ArrayList<>();
            for (Transaction x : sortAfterCount){
                TransactionDTO transactionDTO = new TransactionDTO();
                transactionDTO.setId(x.getId());
                transactionDTO.setUserId(x.getUser().getId());
                transactionDTO.setReason(x.getReason());
                transactionDTO.setAmount(x.getAmount());

                LocalDateTime ldt = x.getDateTime();
                String formatted = ldt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                transactionDTO.setDateTime(formatted);

                transactionDTOS.add(transactionDTO);
            }

            adminTransactionResponseDTO.setTransactionDTOList(transactionDTOS);
            return adminTransactionResponseDTO;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}

















