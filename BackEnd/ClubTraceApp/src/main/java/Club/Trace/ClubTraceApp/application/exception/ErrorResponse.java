package Club.Trace.ClubTraceApp.application.exception;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class ErrorResponse {
    private String code;
    private String message;

    public ErrorResponse(String code, String message) {
        this.code = code;
        this.message = message;
    }


    public ErrorResponse(HttpStatus status, String message) {
        this.code = status.toString();
        this.message = message;
    }
}