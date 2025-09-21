package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.service.EmailService;
import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    public void sendVerificationEmail(String to, String otp) {

        Context context = new Context();
        context.setVariable("otp", otp);
        context.setVariable("userEmail", to);

        String htmlContent = templateEngine.process("email-verification", context);

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("Verify Your Wattpad Email");
            helper.setFrom("thenurinathangi@gmail.com"); // Your sender email
            helper.setText(htmlContent, true); // true for HTML

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }


    // New method for forgot password OTP
    public void sendForgotPasswordOtp(String to, String otp, String username) {
        Context context = new Context();
        context.setVariable("otp", otp);
        context.setVariable("userEmail", to);
        context.setVariable("username", username);

        String htmlContent = templateEngine.process("forgot-password-otp", context);

        sendEmail(to, "Reset Your Wattpad Password", htmlContent);
    }


    // New method for admin verified user
    public void sendAdminVerifiedUserEmail(String to, String username) {
        Context context = new Context();
        context.setVariable("username", username);
        context.setVariable("userEmail", to);

        String htmlContent = templateEngine.process("admin-verified-user", context);

        sendEmail(to, "Congratulations! You're Verified on Wattpad", htmlContent);
    }


    // New method for story unpublished
    public void sendStoryUnpublishedEmail(String to, String username, String storyTitle) {
        Context context = new Context();
        context.setVariable("username", username);
        context.setVariable("storyTitle", storyTitle);
        context.setVariable("userEmail", to);

        String htmlContent = templateEngine.process("story-unpublished", context);

        sendEmail(to, "Your Story Has Been Unpublished", htmlContent);
    }


    // New method for premium purchase success
    public void sendPremiumPurchaseSuccessEmail(String to, String username) {
        Context context = new Context();
        context.setVariable("username", username);
        context.setVariable("userEmail", to);

        String htmlContent = templateEngine.process("premium-purchase-success", context);

        sendEmail(to, "Welcome to Wattpad Premium!", htmlContent);
    }


    // New method for coins purchase success
    public void sendCoinsPurchaseSuccessEmail(String to, String username, int coinAmount) {
        Context context = new Context();
        context.setVariable("username", username);
        context.setVariable("coinAmount", coinAmount);
        context.setVariable("userEmail", to);

        String htmlContent = templateEngine.process("coins-purchase-success", context);

        sendEmail(to, "Coin Purchase Successful!", htmlContent);
    }


    // Private helper method to send the email
    private void sendEmail(String to, String subject, String htmlContent) {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setFrom("thenurinathangi@gmail.com"); // Replace with your sender email
            helper.setText(htmlContent, true); // true for HTML

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email to " + to, e);
        }
    }
}
