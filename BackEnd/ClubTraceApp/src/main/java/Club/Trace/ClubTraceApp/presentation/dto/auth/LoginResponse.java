package Club.Trace.ClubTraceApp.presentation.dto.auth;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
    private String id;
    private String token;
    private String refreshToken;
    private String name;
    private String role;

    public static LoginResponse from(String userId, String token,String refeshToken,String name,String role) {
        return LoginResponse.builder()
                .id(userId)
                .token(token)
                .role(role)
                .refreshToken(refeshToken)
                .name(name)
                .build();
    }
    public static LoginResponse from(String userId, String token) {
        return LoginResponse.builder()
                .id(userId)
                .token(token)
                .build();
    }
    public static LoginResponse from(String userId, String token,String refeshToken) {
        return LoginResponse.builder()
                .id(userId)
                .token(token)
                .refreshToken(refeshToken)
                .build();
    }

}
