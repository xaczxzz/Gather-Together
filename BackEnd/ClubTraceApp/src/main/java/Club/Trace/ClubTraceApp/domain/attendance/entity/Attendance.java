package Club.Trace.ClubTraceApp.domain.attendance.entity;


import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@Table(name = "attendances")

public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long index;
    private String sid;
    private String name;
    private String date;
    private String major;
    private String grade;
    @Enumerated(EnumType.STRING)
    private AttendanceStatus status;

    public enum AttendanceStatus {
        PRESENT,
        ABSENT;


    }
    public AttendanceStatus getStatus() {
        return status;
    }
    @Builder
    public Attendance(Long index,String sid,String name,String date, String major,String grade, AttendanceStatus status){
        this.index = index;
        this.sid = sid;
        this.name= name;
        this.date = date;
        this.major = major;
        this.grade = grade;
        this.status =status;
    }
    public Attendance createAttendance (Attendance attendance) {
        return Attendance.builder()
                .index(attendance.getIndex())
                .sid(attendance.getSid())
                .major(attendance.getMajor())
                .name(attendance.getName())
                .grade(attendance.getGrade())
                .date(attendance.getDate())
                .status(attendance.getStatus())
                .build();
    }

}
