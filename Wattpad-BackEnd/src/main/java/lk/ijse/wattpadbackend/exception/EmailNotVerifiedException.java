package lk.ijse.wattpadbackend.exception;

public class EmailNotVerifiedException extends RuntimeException{

    public EmailNotVerifiedException(String message){
        super(message);
    }
}
