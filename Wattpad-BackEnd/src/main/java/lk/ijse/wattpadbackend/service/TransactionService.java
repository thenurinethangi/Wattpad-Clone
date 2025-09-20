package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.AdminTransactionRequestDTO;
import lk.ijse.wattpadbackend.dto.AdminTransactionResponseDTO;
import lk.ijse.wattpadbackend.dto.TransactionRequestDTO;

public interface TransactionService {

    AdminTransactionResponseDTO loadTransactionsForAdminBySortingCriteria(long no, AdminTransactionRequestDTO adminTransactionRequestDTO);

    void addPaymentForPremiumBuy(String name, TransactionRequestDTO transactionRequestDTO);

    boolean checkIfUserAlreadyHavePremium(String name);

    void addPaymentForCoinsBuy(String name, TransactionRequestDTO transactionRequestDTO);
}
