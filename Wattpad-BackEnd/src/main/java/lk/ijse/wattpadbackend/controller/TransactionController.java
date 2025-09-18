package lk.ijse.wattpadbackend.controller;

import lk.ijse.wattpadbackend.dto.AdminStoryRequestDTO;
import lk.ijse.wattpadbackend.dto.AdminStoryResponseDTO;
import lk.ijse.wattpadbackend.dto.AdminTransactionRequestDTO;
import lk.ijse.wattpadbackend.dto.AdminTransactionResponseDTO;
import lk.ijse.wattpadbackend.service.TransactionService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
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

}












