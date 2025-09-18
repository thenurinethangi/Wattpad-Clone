package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.AdminTransactionRequestDTO;
import lk.ijse.wattpadbackend.dto.AdminTransactionResponseDTO;

public interface TransactionService {

    AdminTransactionResponseDTO loadTransactionsForAdminBySortingCriteria(long no, AdminTransactionRequestDTO adminTransactionRequestDTO);
}
