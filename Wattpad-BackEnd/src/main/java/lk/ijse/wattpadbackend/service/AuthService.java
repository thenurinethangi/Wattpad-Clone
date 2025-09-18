package lk.ijse.wattpadbackend.service;

import jakarta.validation.Valid;
import lk.ijse.wattpadbackend.dto.ChangePasswordDTO;
import lk.ijse.wattpadbackend.dto.UserLoginDTO;
import lk.ijse.wattpadbackend.dto.UserSignupDTO;
import lk.ijse.wattpadbackend.entity.User;

public interface AuthService {

    boolean CheckUserNameExistence(String username);

    void signupWithGoogle(@Valid UserSignupDTO userSignupDTO);

    void signupWithEmail(@Valid UserSignupDTO userSignupDTO);

    void emailVerify(@Valid String username);

    User loginWithGoogle(@Valid UserLoginDTO userLoginDTO);

    User emailVerifyLogin(String email);

    User loginWithEmail(@Valid UserLoginDTO userLoginDTO);

    int forgotPassword(@Valid String emailOrUsername);

    void changePassword(@Valid ChangePasswordDTO changePasswordDTO);

    User adminLoginWithUsername(@Valid UserLoginDTO userLoginDTO);
}
