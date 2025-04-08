package Club.Trace.ClubTraceApp.presentation.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LogOutResponse {
    private String message;

    public static String form(){
        return "로그아웃됐습니다.";
    }
}
