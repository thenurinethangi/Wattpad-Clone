package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.*;
import lk.ijse.wattpadbackend.entity.CoinPackage;
import lk.ijse.wattpadbackend.entity.User;
import lk.ijse.wattpadbackend.entity.UserCoins;
import lk.ijse.wattpadbackend.exception.NotFoundException;
import lk.ijse.wattpadbackend.service.EmailService;
import lk.ijse.wattpadbackend.service.TransactionService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/transaction")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final EmailService emailService;

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public APIResponse welcomeMessage(){

        return new APIResponse(202,"WELCOME TO TRANSACTION PAGE",null);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public APIResponse welcomeMessage2(){

        return new APIResponse(202,"WELCOME TO TRANSACTION PAGE(ADMIN)",null);
    }

    @PostMapping("/admin/loadTransaction/{no}")
    @PreAuthorize("hasRole('ADMIN')")
    public APIResponse loadTransactionsForAdminBySortingCriteria(@PathVariable long no, @RequestBody AdminTransactionRequestDTO adminTransactionRequestDTO){

        AdminTransactionResponseDTO adminTransactionResponseDTO = transactionService.loadTransactionsForAdminBySortingCriteria(no,adminTransactionRequestDTO);
        return new APIResponse(202,"Successfully load transactions for admin part by sort criteria", adminTransactionResponseDTO);
    }

    @PostMapping("/premium")
    @PreAuthorize("hasRole('USER')")
    public APIResponse addPaymentForPremiumBuy(@RequestBody TransactionRequestDTO transactionRequestDTO){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User user = transactionService.addPaymentForPremiumBuy(auth.getName(),transactionRequestDTO);

        emailService.sendPremiumPurchaseSuccessEmail(user.getEmail(), user.getUsername());

        return new APIResponse(202,"Successfully buy the premium subscription", null);
    }

    @GetMapping("/check/premium")
    @PreAuthorize("hasRole('USER')")
    public APIResponse checkIfUserAlreadyHavePremium(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        boolean result = transactionService.checkIfUserAlreadyHavePremium(auth.getName());
        return new APIResponse(202,"Checking successfully", result);
    }

    @PostMapping("/coins")
    @PreAuthorize("hasRole('USER')")
    public APIResponse addPaymentForCoinsBuy(@RequestBody TransactionRequestDTO transactionRequestDTO){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User user = transactionService.addPaymentForCoinsBuy(auth.getName(),transactionRequestDTO);

        int coinsAmount = 0;
        if(transactionRequestDTO.getPlan().equalsIgnoreCase("30 Coins")){
            coinsAmount = 30;
        }
        else if (transactionRequestDTO.getPlan().equalsIgnoreCase("90 Coins")){
            coinsAmount = 90;
        }
        else if (transactionRequestDTO.getPlan().equalsIgnoreCase("270 Coins")){
            coinsAmount = 270;
        }
        else if (transactionRequestDTO.getPlan().equalsIgnoreCase("500 Coins")){
            coinsAmount = 500;
        }

        emailService.sendCoinsPurchaseSuccessEmail(user.getEmail(), user.getUsername(),coinsAmount);

        return new APIResponse(202,"Successfully buy the coins package", null);
    }

}












