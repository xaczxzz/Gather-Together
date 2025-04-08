package Club.Trace.ClubTraceApp.domain.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RedisTemplate<String,String> redisTemplate;
    private static final String REFRESH_TOKEN_PREFIX = "refresh_token";
    private static final long REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7일
    // Refresh Token 저장
    public void saveRefreshToken(String id, String refreshToken) {
        redisTemplate.opsForValue().set(id, refreshToken, REFRESH_TOKEN_TTL_SECONDS, TimeUnit.SECONDS);
    }

    // Refresh Token 조회
    public String getRefreshToken(String id) {
        return redisTemplate.opsForValue().get(id);
    }

    // Refresh Token 삭제
    public void deleteRefreshToken(String id) {
        redisTemplate.delete(id);
    }

}
