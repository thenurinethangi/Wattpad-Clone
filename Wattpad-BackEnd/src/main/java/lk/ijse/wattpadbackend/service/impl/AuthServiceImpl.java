package lk.ijse.wattpadbackend.service.impl;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import lk.ijse.wattpadbackend.dto.ChangePasswordDTO;
import lk.ijse.wattpadbackend.dto.UserLoginDTO;
import lk.ijse.wattpadbackend.dto.UserSignupDTO;
import lk.ijse.wattpadbackend.entity.*;
import lk.ijse.wattpadbackend.exception.*;
import lk.ijse.wattpadbackend.repository.*;
import lk.ijse.wattpadbackend.service.AuthService;
import lk.ijse.wattpadbackend.util.GoogleTokenVerifier;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Date;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final GenreRepository genreRepository;
    private final UserGenreRepository userGenreRepository;
    private final LibraryRepository libraryRepository;
    private final ReadingListRepository readingListRepository;
    private final ModelMapper modelMapper;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;

    @Override
    public boolean CheckUserNameExistence(String username) {

        try {
            User user = userRepository.findByUsername(username);
            return user != null;
        }
        catch (RuntimeException e) {
            throw new RuntimeException("Internal Server Error");
        }
    }

    @Override
    @Transactional
    public void signupWithGoogle(UserSignupDTO userSignupDTO) {

        try {
            Optional<User> user = userRepository.findByEmail(userSignupDTO.getEmail());

            if (user.isPresent()) {
                throw new UserExistException("Already Signed Up");
            }

            User user1 = new User(userSignupDTO.getUsername(),userSignupDTO.getFullName(),userSignupDTO.getEmail(),"fakepassword",LocalDate.parse(userSignupDTO.getBirthday()),userSignupDTO.getPronouns(),1);
            User savedUser = userRepository.save(user1);

            Optional<Role> optionalRole = roleRepository.findById(2);
            if(!optionalRole.isPresent()){
                throw new NotFoundException("Role not found.");
            }
            Role role = optionalRole.get();

            UserRole userRole = new UserRole();
            userRole.setUser(savedUser);
            userRole.setRole(role);

            userRoleRepository.save(userRole);

            //add default selected genre for user
            String[] ar = {"Romance","Werewolf","New Adult"};
            for (int i = 0; i < 3; i++) {
                Genre genre = genreRepository.findByGenre(ar[i]).get(0);
                UserGenre userGenre = new UserGenre(savedUser,genre);
                userGenreRepository.save(userGenre);
            }

            //add library to user when signup
            Library library = new Library(savedUser);
            libraryRepository.save(library);

            //add default reading list to user when signup
            ReadingList readingList = new ReadingList(savedUser.getUsername()+"'s Reading List",savedUser);
            readingListRepository.save(readingList);
        }
        catch (UserExistException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Internal Server Error.");
        }
    }

    @Override
    @Transactional
    public void signupWithEmail(UserSignupDTO userSignupDTO) {

        try {
            Optional<User> user = userRepository.findByEmail(userSignupDTO.getEmail());

            if (user.isPresent()) {
                throw new UserExistException("Already Signed Up");
            }
//            else if(user.isPresent() && user.get().getIsVerify()==0){
//                throw new EmailNotVerifiedException("Please verify your email. A new OTP has been resent to you.");
//            }

            User user1 = new User(userSignupDTO.getUsername(),userSignupDTO.getFullName(),userSignupDTO.getEmail(),userSignupDTO.getPassword(),LocalDate.parse(userSignupDTO.getBirthday()),userSignupDTO.getPronouns());
            User savedUser = userRepository.save(user1);

            Optional<Role> optionalRole = roleRepository.findById(2);
            if(!optionalRole.isPresent()){
                throw new NotFoundException("Role not found.");
            }
            Role role = optionalRole.get();

            UserRole userRole = new UserRole();
            userRole.setUser(savedUser);
            userRole.setRole(role);

            userRoleRepository.save(userRole);

            //add default selected genre for user
            String[] ar = {"Romance","Werewolf","New Adult"};
            for (int i = 0; i < 3; i++) {
                Genre genre = genreRepository.findByGenre(ar[i]).get(0);
                UserGenre userGenre = new UserGenre(savedUser,genre);
                userGenreRepository.save(userGenre);
            }

            //add library to user when signup
            Library library = new Library(savedUser);
            libraryRepository.save(library);

            //add default reading list to user when signup
            ReadingList readingList = new ReadingList(savedUser.getUsername()+"'s Reading List",savedUser);
            readingListRepository.save(readingList);
        }
        catch (UserExistException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Internal Server Error.");
        }
    }

    @Override
    public void emailVerify(String username) {

        User user = userRepository.findByUsername(username);

        if(user!=null){
            user.setIsVerify(1);
            userRepository.save(user);
            return;
        }
        throw new UserNotFoundException("User Not Found. Please Signup!");
    }

    @Override
    public User loginWithGoogle(UserLoginDTO userLoginDTO) {

        Optional<User> optionalUser = userRepository.findByEmail(userLoginDTO.getEmail());

        if (optionalUser.isEmpty()) {
            throw new UserNotFoundException("User not found.");
        }

        User user = optionalUser.get();
        if(user.getIsVerify()==0){
            throw new EmailNotVerifiedException("Email not verify.");
        }

        return user;
    }

    @Override
    public User emailVerifyLogin(String email) {

        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            throw new UserNotFoundException("User not found.");
        }

        User user = optionalUser.get();
        user.setIsVerify(1);
        return userRepository.save(user);
    }

    @Override
    public User loginWithEmail(UserLoginDTO userLoginDTO) {

        Optional<User> optionalUser = userRepository.findByEmail(userLoginDTO.getEmail());

        if (optionalUser.isEmpty()) {
            throw new UserNotFoundException("User not found.");
        }

        User user = optionalUser.get();

        if(!user.getPassword().equals(userLoginDTO.getPassword())){
            throw new InvalidCredentialException("Password is incorrect.");
        }

        if(user.getIsVerify()==0){
            throw new EmailNotVerifiedException("Email not verify.");
        }

        return user;
    }

    @Override
    public String forgotPassword(String emailOrUsername) {

        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$";

        User user = null;
        if (emailOrUsername != null && emailOrUsername.matches(emailRegex)) {
            Optional<User> optionalUser = userRepository.findByEmail(emailOrUsername);

            if(optionalUser.isEmpty()){
                throw new UserNotFoundException("User not found.");
            }
            user = optionalUser.get();
        }
        else {
            User user1 = userRepository.findByUsername(emailOrUsername);

            if(user1==null){
                throw new UserNotFoundException("User not found.");
            }
            user = user1;
        }

        //here send otp to user email
        Random random =  new Random();
        String otp = String.valueOf(10000 + random.nextInt(90000));
        otp+='-'+user.getEmail()+'-'+user.getUsername();

        return otp;
    }

    @Override
    public void changePassword(ChangePasswordDTO changePasswordDTO) {

        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$";

        User user = null;
        if (changePasswordDTO.getEmailOrUsername() != null && changePasswordDTO.getEmailOrUsername().matches(emailRegex)) {
            Optional<User> optionalUser = userRepository.findByEmail(changePasswordDTO.getEmailOrUsername());

            if(optionalUser.isEmpty()){
                throw new UserNotFoundException("User not found.");
            }
            user = optionalUser.get();
        }
        else {
            User user1 = userRepository.findByUsername(changePasswordDTO.getEmailOrUsername());

            if(user1==null){
                throw new UserNotFoundException("User not found.");
            }
            user = user1;
        }

        user.setPassword(changePasswordDTO.getNewPassword());
        userRepository.save(user);
    }

    @Override
    public User adminLoginWithUsername(UserLoginDTO userLoginDTO) {

        User user = userRepository.findByUsername(userLoginDTO.getUsername());
        if (user==null) {
            throw new UserNotFoundException("User not found.");
        }

        if(!user.getPassword().equals(userLoginDTO.getPassword())){
            throw new InvalidCredentialException("Password is incorrect.");
        }

        if(user.getIsActive()==0){
            throw new RuntimeException("This User has been deactivated. can't login");
        }

        return user;
    }
}














