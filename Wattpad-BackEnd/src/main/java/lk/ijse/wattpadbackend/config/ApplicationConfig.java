package lk.ijse.wattpadbackend.config;

import lk.ijse.wattpadbackend.entity.User;
import lk.ijse.wattpadbackend.entity.UserRole;
import lk.ijse.wattpadbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.ArrayList;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final UserRepository userRepository;

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(){

        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            User user = userRepository.findByUsername(username);
            if (user == null) {
                throw new RuntimeException("User not found");
            }

            List<UserRole> roles = user.getUserRoles();
            List<SimpleGrantedAuthority> simpleGrantedAuthorityList = new ArrayList<>();
            for (UserRole x : roles){
                simpleGrantedAuthorityList.add(new SimpleGrantedAuthority("ROLE_"+x.getRole().getRole().name()));
            }

            return new org.springframework.security.core.userdetails.User(
                    user.getUsername(),
                    user.getPassword(),
                    simpleGrantedAuthorityList
            );
        };
    }
}
