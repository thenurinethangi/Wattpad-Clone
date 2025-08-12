package lk.ijse.wattpadbackend.exception;

public class InvalidCredentialException extends RuntimeException{

    public InvalidCredentialException(String message){
        super(message);
    }
}
