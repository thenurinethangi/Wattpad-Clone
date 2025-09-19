package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.dto.*;
import lk.ijse.wattpadbackend.entity.*;
import lk.ijse.wattpadbackend.exception.NotFoundException;
import lk.ijse.wattpadbackend.exception.UserNotFoundException;
import lk.ijse.wattpadbackend.repository.PremiumRepository;
import lk.ijse.wattpadbackend.repository.TransactionRepository;
import lk.ijse.wattpadbackend.repository.UserPremiumRepository;
import lk.ijse.wattpadbackend.repository.UserRepository;
import lk.ijse.wattpadbackend.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final UserPremiumRepository userPremiumRepository;
    private final PremiumRepository premiumRepository;

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

    @Override
    @Transactional
    public void addPaymentForPremiumBuy(String name, TransactionRequestDTO transactionRequestDTO) {

        try{
            User user = userRepository.findByUsername(name);
            if(user==null){
                throw new UserNotFoundException("User not found.");
            }

            Transaction transaction = new Transaction();
            transaction.setUser(user);
            double actualAmount = transactionRequestDTO.getAmount()/100;
            transaction.setAmount(String.valueOf(actualAmount));
            transaction.setDateTime(LocalDateTime.now());
            transaction.setReason("Premium Buy");

            transactionRepository.save(transaction);

            Premium premium = null;
            if(transactionRequestDTO.getPlan().equalsIgnoreCase("premium plus")){
                Optional<Premium> premiumOptional = premiumRepository.findById(1);
                if(!premiumOptional.isPresent()){
                    throw new NotFoundException("Premium plan not found.");
                }
                premium = premiumOptional.get();

                UserPremium userPremium = new UserPremium();
                userPremium.setPremium(premium);
                userPremium.setUser(user);
                userPremium.setActive("active");
                userPremium.setStartDate(LocalDate.now());
                userPremium.setExpireDate(LocalDate.now().plusDays(30));

                userPremiumRepository.save(userPremium);

                int coins = user.getCoins();
                coins+=200;
                user.setCoins(coins);
                userRepository.save(user);

            }
            else {
                Optional<Premium> premiumOptional = premiumRepository.findById(2);
                if(!premiumOptional.isPresent()){
                    throw new NotFoundException("Premium plan not found.");
                }
                premium = premiumOptional.get();

                UserPremium userPremium = new UserPremium();
                userPremium.setPremium(premium);
                userPremium.setUser(user);
                userPremium.setActive("active");
                userPremium.setStartDate(LocalDate.now());
                userPremium.setExpireDate(LocalDate.now().plusDays(7));

                userPremiumRepository.save(userPremium);

                int coins = user.getCoins();
                coins+=200;
                user.setCoins(coins);
                userRepository.save(user);
            }

        }
        catch (UserNotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean checkIfUserAlreadyHavePremium(String name) {

        try {
            User user = userRepository.findByUsername(name);
            if (user == null) {
                throw new UserNotFoundException("User not found.");
            }

            List<UserPremium> userPremiumList = userPremiumRepository.findByUserAndExpireDateAfter(user,LocalDate.now());
            if(!userPremiumList.isEmpty()){
                return false;
            }
            return true;

        }
        catch (UserNotFoundException e){
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}

















