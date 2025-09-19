package lk.ijse.wattpadbackend.controller;

import org.springframework.web.bind.annotation.*;

import java.security.MessageDigest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payhere")
@CrossOrigin(origins = "http://localhost:63342")
public class PayHereController {

    private final String merchantId = "1232103";
    private final String merchantSecret = "NzcxMDc1MzMyNDAyNjIxMjc1MTI5MjAzNjU3MDI0MjAxNTI2MzM3";

    @GetMapping("/generate-hash")
    public Map<String, String> generateHash(@RequestParam String orderId, @RequestParam double amount, @RequestParam String currency) throws Exception {

        if (orderId == null || orderId.isEmpty() || amount <= 0 || currency == null || currency.isEmpty()) {
            throw new IllegalArgumentException("Invalid orderId, amount, or currency");
        }

        String formattedAmount = String.format("%.2f", amount / 100.0);
        String hashInput = merchantId + orderId + formattedAmount + currency + md5(merchantSecret).toUpperCase();
        String hash = md5(hashInput).toUpperCase();

        Map<String, String> response = new HashMap<>();
        response.put("merchant_id", merchantId);
        response.put("hash", hash);
        return response;
    }

    @PostMapping("/notify")
    public void handleNotify(@RequestParam String merchant_id, @RequestParam String order_id, @RequestParam String payment_id, @RequestParam String status_code, @RequestParam String md5sig, @RequestParam String amount, @RequestParam String currency, @RequestParam String status_message) throws Exception {

        String localSig = md5(merchantId + order_id + payment_id + amount + currency + md5(merchantSecret).toUpperCase()).toUpperCase();
        if (!localSig.equals(md5sig)) {
            throw new SecurityException("Invalid payment signature");
        }

        if ("2".equals(status_code)) {
            // Payment successful, update your database (e.g., mark user as premium)
            System.out.println("Payment successful for Order ID: " + order_id);
            // Add logic to update user status in your database
        } else {
            System.out.println("Payment failed or cancelled for Order ID: " + order_id);
        }
    }

    private String md5(String input) throws Exception {

        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] array = md.digest(input.getBytes("UTF-8"));
        StringBuilder sb = new StringBuilder();
        for (byte b : array) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}