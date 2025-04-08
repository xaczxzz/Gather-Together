package Club.Trace.ClubTraceApp.presentation.dto.club;

import Club.Trace.ClubTraceApp.domain.club.entity.Member;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class MemberResponse {
    private String sid;
    private String name;
    private String major;
    private String grade;
    private LocalDate joinDate;

    public static MemberResponse from(Member member) {
        return MemberResponse.builder()
                .sid(member.getSid())
                .name(member.getName())
                .major(member.getMajor())
                .grade(member.getGrade())
                .joinDate(member.getJoinDate())
                .build();
    }

}