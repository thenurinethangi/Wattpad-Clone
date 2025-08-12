package lk.ijse.wattpadbackend.exception;

public class UserExistException extends RuntimeException{

    public UserExistException(String message){
        super(message);
    }
}
