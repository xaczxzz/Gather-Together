package Club.Trace.ClubTraceApp.presentation.dto.club;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class MemberRequest {
    private String sid;
    private String name;
    private String major;
    private String grade;
    private LocalDate joinDate;
    private MemberStatus status;
    public enum MemberStatus {
        APPROVE,
        REJECT,

        HOLD;

    }


}
