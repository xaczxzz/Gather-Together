package Club.Trace.ClubTraceApp.presentation.dto.club;

import lombok.Data;


// 수정 게시판 DTO
@Data
public class BoardUpdateRequest {
    private Long boardId;
    private String title;
    private String content;
}
