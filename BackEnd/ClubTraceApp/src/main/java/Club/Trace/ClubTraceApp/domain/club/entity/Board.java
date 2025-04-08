package Club.Trace.ClubTraceApp.domain.club.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name="board")
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long boardId;
    private String sid;
    private String title;
    private String content;
    private String day;
    private String writer;


    @Builder
    public Board(Long boardId, String sid, String title, String content, String day, String writer) {
        this.boardId = boardId;
        this.sid = sid;
        this.title = title;
        this.content = content;
        this.day = day;
        this.writer = writer;
    }
}
