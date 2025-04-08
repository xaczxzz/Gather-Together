package Club.Trace.ClubTraceApp.presentation.dto.club;

import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class BoardRequest {
    // Board 속성
    private String sid;
    @NotEmpty(message = "제목은 필수입니다.")
    private String title;
    @NotEmpty(message = "내용은 필수입니다.")
    private String content;
    private String writer;
    private String day;


}
