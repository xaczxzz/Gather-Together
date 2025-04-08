package Club.Trace.ClubTraceApp.infrastructure.security;

import Club.Trace.ClubTraceApp.domain.auth.entity.Role;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {
//    @Value("${jwt.secret}")
    private SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    @Value("${jwt.access-token-validity}")
    private long accessTokenValidity; // 예: 30 * 60 * 1000 (30분)
    @Value("${jwt.refresh-token-validity}")
    private long refreshTokenValidity; // 예: 7 * 24 * 60 * 60 * 1000 (7일)

    // Access Token 생성
    public String generateAccessToken(String sid, Role role) {
        return Jwts.builder()
                .setSubject(sid)
                .setIssuedAt(new Date())
                .claim("role",role)
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenValidity))
                .signWith(secretKey, SignatureAlgorithm.HS256) // SecretKey 객체 사용
                .compact();
    }

    public String generateRefreshToken(String sid) {
        return Jwts.builder()
                .setSubject(sid)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenValidity))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }
    public TokenStatus checkTokenStatus(String token) {
        if (token == null || token.isEmpty()) {
            return TokenStatus.MISSING;
        }
        try {
            Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
            System.out.println("검증 과정 성공");
            return TokenStatus.VALID;
        } catch (ExpiredJwtException e) {
            System.out.println("만료된 토큰: " + e.getMessage());
            return TokenStatus.EXPIRED;
        } catch (JwtException e) {
            System.out.println("유효하지 않은 토큰: " + e.getMessage());
            return TokenStatus.INVALID;
        } catch (Exception e) {
            System.out.println("기타 예외: " + e.getMessage());
            return TokenStatus.INVALID;
        }
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            System.out.println("Invalid JWT: " + e.getMessage()); // 로깅 추가
            return false;
        }
    }

    public String getSidFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
    public String getRoleFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }


}
