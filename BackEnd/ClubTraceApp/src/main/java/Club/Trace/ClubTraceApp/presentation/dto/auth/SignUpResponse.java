package Club.Trace.ClubTraceApp.presentation.dto.auth;


import lombok.Getter;

@Getter
public class SignUpResponse {
    private String message;

    public SignUpResponse(String message){
        this.message = message;
    }



}
