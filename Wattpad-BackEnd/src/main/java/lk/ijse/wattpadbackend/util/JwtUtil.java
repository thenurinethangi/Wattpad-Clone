package lk.ijse.wattpadbackend.util;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    @Value("${secretKey}")
    private String secretKey;
    @Value("${jwt.expiration}")
    private long expiration;


    public String generateToken(String username){
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()+expiration))
                .signWith(Keys.hmacShaKeyFor(secretKey.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }


    public String extractUsername(String token){

        try {
            return Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes()))
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        }
        catch (ExpiredJwtException e) {
            System.out.println("JWT expired at: " + e.getClaims().getExpiration());
            return e.getClaims().getSubject();
        }
        catch (Exception e) {
            return null;
        }
    }


    public boolean validateToken(String token) {

        try {
            Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes()))
                    .build()
                    .parseClaimsJws(token);
            return true;
        }
        catch (ExpiredJwtException e) {
            System.out.println("JWT expired at: " + e.getClaims().getExpiration());
            return true;
        }
        catch (Exception e) {
            return false;
        }
    }


    public boolean checkTokenExpireOrNot(String token){

        try {
            Date expirationTime = Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes()))
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getExpiration();

            Date currentTime = new Date(System.currentTimeMillis());
            return currentTime.after(expirationTime);
        }
        catch (ExpiredJwtException e){
            return true;
        }
    }
}
