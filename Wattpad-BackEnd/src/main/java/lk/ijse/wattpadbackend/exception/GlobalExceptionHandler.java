package lk.ijse.wattpadbackend.exception;

import lk.ijse.wattpadbackend.dto.UserSignUpResponseDTO;
import lk.ijse.wattpadbackend.util.APIResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public APIResponse handlerGenericException(Exception e){
        e.printStackTrace();
        return new APIResponse(500,e.getMessage(),null);
    }

    @ExceptionHandler(UserExistException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public APIResponse handlerUserExistException(UserExistException e){
        return new APIResponse(400,e.getMessage(),null);
    }

    @ExceptionHandler(UserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public APIResponse handlerUserNotFoundException(UserNotFoundException e){
        return new APIResponse(404,e.getMessage(),null);
    }

    @ExceptionHandler(EmailNotVerifiedException.class)
    @ResponseStatus(HttpStatus.NOT_ACCEPTABLE)
    public APIResponse handlerEmailNotVerifiedException(EmailNotVerifiedException e){
        Random random =  new Random();
        int otp = 10000 + random.nextInt(90000);
        UserSignUpResponseDTO signUpResponseDTO = new UserSignUpResponseDTO(otp);

        return new APIResponse(406,e.getMessage(),signUpResponseDTO);
    }

    @ExceptionHandler(InvalidCredentialException.class)
    @ResponseStatus(HttpStatus.EXPECTATION_FAILED)
    public APIResponse handlerInvalidCredentialException(InvalidCredentialException e){
        return new APIResponse(417,e.getMessage(),null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public APIResponse methodArgumentNotValidateException(MethodArgumentNotValidException e){

        Map<String,String> errors = new HashMap<>();
        e.getBindingResult().getFieldErrors().forEach(fieldError -> {
            errors.put(fieldError.getField(),fieldError.getDefaultMessage());
        });

        return new APIResponse(401,"Validation Failed",errors);
    }
}















