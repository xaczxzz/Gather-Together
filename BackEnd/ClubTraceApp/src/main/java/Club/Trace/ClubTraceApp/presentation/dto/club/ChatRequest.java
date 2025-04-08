package Club.Trace.ClubTraceApp.presentation.dto.club;


import lombok.Data;

@Data
public class ChatRequest {
    private String query;
   private String sessionId;
}
