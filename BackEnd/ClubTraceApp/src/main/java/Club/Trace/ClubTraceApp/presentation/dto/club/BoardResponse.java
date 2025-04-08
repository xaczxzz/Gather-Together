package Club.Trace.ClubTraceApp.presentation.dto.club;

import Club.Trace.ClubTraceApp.domain.club.entity.Board;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BoardResponse {
    private String sid;
    private String title;
    private Long boardId;
    private String content;
    private String day;
    private String writer;

    public static BoardResponse from(Board board) {
        return BoardResponse.builder()
                .sid(board.getSid())
                .title(board.getTitle())
                .boardId(board.getBoardId())
                .content(board.getContent())
                .day(board.getDay())
                .writer(board.getWriter())
                .build();
    }
}