package Club.Trace.ClubTraceApp.domain.club.entity;

import Club.Trace.ClubTraceApp.domain.auth.entity.Role;
import Club.Trace.ClubTraceApp.presentation.dto.club.MemberResponse;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name="member")
public class Member {
    @Id
    private String sid;
    private String name;
    private String major;
    private String grade;
    private LocalDate joinDate;
    @Enumerated(EnumType.STRING)
    private Role role;

    @Builder
    public Member(String sid, String name, String major, String grade, LocalDate joinDate,Role role) {
        this.sid = sid;
        this.name = name;
        this.major = major;
        this.grade = grade;
        this.joinDate = joinDate;
        this.role = role;
    }


}
