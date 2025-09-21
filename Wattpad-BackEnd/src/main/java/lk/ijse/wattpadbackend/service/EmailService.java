package lk.ijse.wattpadbackend.service;

public interface EmailService {

    public void sendVerificationEmail(String to, String otp);

    public void sendForgotPasswordOtp(String to, String otp, String username);

    public void sendPremiumPurchaseSuccessEmail(String to, String username);

    public void sendCoinsPurchaseSuccessEmail(String to, String username, int coinAmount);

    public void sendAdminVerifiedUserEmail(String to, String username);

    public void sendStoryUnpublishedEmail(String to, String username, String storyTitle);
}
