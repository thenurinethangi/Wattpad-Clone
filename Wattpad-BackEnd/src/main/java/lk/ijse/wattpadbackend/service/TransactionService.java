package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.AdminTransactionRequestDTO;
import lk.ijse.wattpadbackend.dto.AdminTransactionResponseDTO;
import lk.ijse.wattpadbackend.dto.TransactionRequestDTO;
import lk.ijse.wattpadbackend.entity.User;

public interface TransactionService {

    AdminTransactionResponseDTO loadTransactionsForAdminBySortingCriteria(long no, AdminTransactionRequestDTO adminTransactionRequestDTO);

    User addPaymentForPremiumBuy(String name, TransactionRequestDTO transactionRequestDTO);

    boolean checkIfUserAlreadyHavePremium(String name);

    User addPaymentForCoinsBuy(String name, TransactionRequestDTO transactionRequestDTO);
}
