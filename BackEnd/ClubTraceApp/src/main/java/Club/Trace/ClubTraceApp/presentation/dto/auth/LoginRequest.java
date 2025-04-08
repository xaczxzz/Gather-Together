package Club.Trace.ClubTraceApp.presentation.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Optional;

@Data
public class LoginRequest {
    @NotBlank(message = "ID를 입력해주세요")
    private String sid;
    @NotBlank(message = "비밀번호를 입력해주세요")
    private String password;
    private Optional<String> token = Optional.empty();

}
