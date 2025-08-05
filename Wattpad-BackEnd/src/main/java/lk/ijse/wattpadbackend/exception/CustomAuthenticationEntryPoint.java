package lk.ijse.wattpadbackend.exception;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lk.ijse.wattpadbackend.util.APIResponse;
import lk.ijse.wattpadbackend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final JwtUtil jwtUtil;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {

        response.setStatus(401);
        response.setContentType("application/json");
        APIResponse apiResponse = new APIResponse();

        boolean bool = (boolean) request.getAttribute("isExpired");
        if(!bool){
            apiResponse.setStatus(401);
            apiResponse.setMessage("Unauthorized - Please log in");
            apiResponse.setData(authException.getMessage());
        }
        else{
            apiResponse.setStatus(401);
            apiResponse.setMessage("new jwt token");
            String username = (String) request.getAttribute("username");
            apiResponse.setData(jwtUtil.generateToken(username));
        }
        new ObjectMapper().writeValue(response.getOutputStream(),apiResponse);
    }
}

