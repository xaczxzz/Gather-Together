// src/main/java/Club/Trace/ClubTraceApp/application/exception/ErrorCode.java
package Club.Trace.ClubTraceApp.application.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {
    INVALID_TOKEN(HttpStatus.FORBIDDEN, "T-001", "올바른 토큰이 아닙니다."),
    ACCESS_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "T-002", "Access 토큰 기간 만료"),
    REFRESH_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "T-003", "Refresh 토큰 기간 만료"),
    TOKEN_NOT_PROVIDED(HttpStatus.UNAUTHORIZED, "T-004", "토큰이 없습니다."),
    TOKEN_USER_MISMATCH(HttpStatus.FORBIDDEN, "T-005", "토큰에 담긴 유저와 요청 유저가 다릅니다."),
    FORBIDDEN_ACCESS(HttpStatus.FORBIDDEN, "A-001", "권한이 부족합니다."),
    FORBIDDEN_RATE_LIMIT(HttpStatus.TOO_MANY_REQUESTS, "A-002", "요청이 너무 많습니다. 잠시 후 다시 시도해주세요."),
    ATTEND_DATA_EXIST(HttpStatus.CONFLICT, "A-003", "출석 정보가 있습니다.");


    private final HttpStatus status;
    private final String code;
    private final String message;

    ErrorCode(HttpStatus status, String code, String message) {
        this.status = status;
        this.code = code;
        this.message = message;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}