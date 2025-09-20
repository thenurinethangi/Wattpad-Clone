package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.*;
import lk.ijse.wattpadbackend.service.TransactionService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/transaction")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

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

        transactionService.addPaymentForPremiumBuy(auth.getName(),transactionRequestDTO);
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

        transactionService.addPaymentForCoinsBuy(auth.getName(),transactionRequestDTO);
        return new APIResponse(202,"Successfully buy the coins package", null);
    }

}












