package lk.ijse.wattpadbackend.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lk.ijse.wattpadbackend.dto.ChangePasswordDTO;
import lk.ijse.wattpadbackend.dto.UserLoginDTO;
import lk.ijse.wattpadbackend.dto.UserSignUpResponseDTO;
import lk.ijse.wattpadbackend.dto.UserSignupDTO;
import lk.ijse.wattpadbackend.entity.User;
import lk.ijse.wattpadbackend.service.AuthService;
import lk.ijse.wattpadbackend.service.EmailService;
import lk.ijse.wattpadbackend.util.APIResponse;
import lk.ijse.wattpadbackend.util.GoogleTokenVerifier;
import lk.ijse.wattpadbackend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Random;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    @GetMapping("/username/existence")
    public APIResponse CheckUserNameExistence(@RequestParam String username){

        boolean isExist = authService.CheckUserNameExistence(username);
        if(isExist){
            return new APIResponse(202,"Username Unavailable",isExist);
        }
        else{
            return new APIResponse(202,"Username Available",isExist);
        }
    }

    @PostMapping("/google/signup")
    public APIResponse signupWithGoogle(@Valid @RequestBody UserSignupDTO userSignupDTO, HttpServletResponse response){

        GoogleIdToken.Payload payload = GoogleTokenVerifier.verify(userSignupDTO.getIdToken());
        userSignupDTO.setEmail(payload.getEmail());
        if(userSignupDTO.getPronouns().isEmpty()){
            userSignupDTO.setPronouns(null);
        }

        authService.signupWithGoogle(userSignupDTO);

        String jwtToken = jwtUtil.generateToken(userSignupDTO.getUsername());
        Cookie cookie = new Cookie("jwtToken", jwtToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24 * 365);
        response.addCookie(cookie);

        UserSignUpResponseDTO signUpResponseDTO = new UserSignUpResponseDTO(jwtToken);
        return new APIResponse(202,"SignUp Successful.",signUpResponseDTO);
    }

    @PostMapping("/email/signup")
    public APIResponse signupWithEmail(@Valid @RequestBody UserSignupDTO userSignupDTO){

        if(userSignupDTO.getPronouns().isEmpty()){
            userSignupDTO.setPronouns(null);
        }
        authService.signupWithEmail(userSignupDTO);

        Random random =  new Random();
        int otp = 10000 + random.nextInt(90000);
        UserSignUpResponseDTO signUpResponseDTO = new UserSignUpResponseDTO(otp);

        emailService.sendVerificationEmail(userSignupDTO.getEmail(), String.valueOf(otp));

        return new APIResponse(202,"SignUp Successful.",signUpResponseDTO);
    }

    @PostMapping("/email/signup/verify")
    public APIResponse emailVerify(@Valid @RequestBody String username, HttpServletResponse response){

        authService.emailVerify(username);

        String jwtToken = jwtUtil.generateToken(username);
        Cookie cookie = new Cookie("jwtToken", jwtToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24 * 365);
        response.addCookie(cookie);

        UserSignUpResponseDTO signUpResponseDTO = new UserSignUpResponseDTO(jwtToken);
        return new APIResponse(202,"Email Verify Successful.",signUpResponseDTO);
    }

    @GetMapping("/email/signup/otp/{email}")
    public APIResponse ResendEmail(@PathVariable String email){

        Random random =  new Random();
        int otp = 10000 + random.nextInt(90000);
        UserSignUpResponseDTO signUpResponseDTO = new UserSignUpResponseDTO(otp);

        emailService.sendVerificationEmail(email, String.valueOf(otp));

        return new APIResponse(202,"Resend OTP Successfully.",signUpResponseDTO);
    }

    @PostMapping("/google/login")
    public APIResponse loginWithGoogle(@Valid @RequestBody UserLoginDTO userLoginDTO, HttpServletResponse response){

        GoogleIdToken.Payload payload = GoogleTokenVerifier.verify(userLoginDTO.getIdToken());
        userLoginDTO.setEmail(payload.getEmail());

        User user = authService.loginWithGoogle(userLoginDTO);

        String jwtToken = jwtUtil.generateToken(user.getUsername());
        Cookie cookie = new Cookie("jwtToken", jwtToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24 * 365);
        response.addCookie(cookie);

        UserSignUpResponseDTO signUpResponseDTO = new UserSignUpResponseDTO(jwtToken);
        return new APIResponse(202,"Login Successful.",signUpResponseDTO);
    }

    @PostMapping("/email/login/verify")
    public APIResponse emailVerifyLogin(@Valid @RequestBody String idTokenOrEmail, HttpServletResponse response){

        String email = "";

        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$";
        if (idTokenOrEmail != null && idTokenOrEmail.matches(emailRegex)) {
            email = idTokenOrEmail;
        } else {
            GoogleIdToken.Payload payload = GoogleTokenVerifier.verify(idTokenOrEmail);
            email = payload.getEmail();
        }

        User user = authService.emailVerifyLogin(email);

        String jwtToken = jwtUtil.generateToken(user.getUsername());
        Cookie cookie = new Cookie("jwtToken", jwtToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24 * 365);
        response.addCookie(cookie);

        UserSignUpResponseDTO signUpResponseDTO = new UserSignUpResponseDTO(jwtToken);
        return new APIResponse(202,"Email Verify Successful.",signUpResponseDTO);
    }

    @PostMapping("/email/login")
    public APIResponse loginWithEmail(@Valid @RequestBody UserLoginDTO userLoginDTO, HttpServletResponse response){

        User user = authService.loginWithEmail(userLoginDTO);

        String jwtToken = jwtUtil.generateToken(user.getUsername());
        Cookie cookie = new Cookie("jwtToken", jwtToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24 * 365);
        response.addCookie(cookie);

        return new APIResponse(202,"Login Successful.",null);
    }

    @PostMapping("/email/login/forgotPassword")
    public APIResponse forgotPassword(@Valid @RequestBody String emailOrUsername){

        String otpAndEmail = authService.forgotPassword(emailOrUsername);
        String[] ar = otpAndEmail.split("-");

        emailService.sendForgotPasswordOtp(ar[1], String.valueOf(ar[0]),ar[2]);

        UserSignUpResponseDTO signUpResponseDTO = new UserSignUpResponseDTO("",Integer.parseInt(ar[0]));
        return new APIResponse(202,"One Time Password.",signUpResponseDTO);
    }

    @PostMapping("/email/login/changePassword")
    public APIResponse changePassword(@Valid @RequestBody ChangePasswordDTO changePasswordDTO){

        authService.changePassword(changePasswordDTO);

        return new APIResponse(202,"Password Changed Successfully.",null);
    }

    @PostMapping("/logout")
    public APIResponse logout(HttpServletResponse response){

        Cookie cookie = new Cookie("jwtToken", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return new APIResponse(202,"Logout Successful.",null);
    }

    @PostMapping("/admin/email/login")
    public APIResponse adminLoginWithEmail(@Valid @RequestBody UserLoginDTO userLoginDTO, HttpServletResponse response){

        User user = authService.adminLoginWithUsername(userLoginDTO);

        String jwtToken = jwtUtil.generateToken(user.getUsername());
        Cookie cookie = new Cookie("jwtToken", jwtToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24 * 365);
        response.addCookie(cookie);

        return new APIResponse(202,"Login Successful.",null);
    }

    @PostMapping("/admin/logout")
    public APIResponse adminLogout(HttpServletResponse response){

        Cookie cookie = new Cookie("jwtToken", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return new APIResponse(202,"Logout Successful.",null);
    }
}















