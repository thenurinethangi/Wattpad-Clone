package lk.ijse.wattpadbackend.exception;

import lk.ijse.wattpadbackend.util.APIResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<APIResponse> handlerGenericException(Exception e){
        return new ResponseEntity<>(new APIResponse(500,e.getMessage(),null), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
