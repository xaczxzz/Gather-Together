package Club.Trace.ClubTraceApp.presentation.dto.club;

import lombok.Builder;

@Builder
public class ChatResponse {
    private String answer;
    public ChatResponse from(String answer){
        return ChatResponse.builder()
                .answer(answer)
                .build();
    }
}
