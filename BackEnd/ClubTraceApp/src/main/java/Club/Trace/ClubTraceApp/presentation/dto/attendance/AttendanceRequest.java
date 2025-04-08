package Club.Trace.ClubTraceApp.presentation.dto.attendance;


import Club.Trace.ClubTraceApp.domain.attendance.entity.Attendance;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;





@Data
@Builder
public class AttendanceRequest {
    @NotBlank(message = "학번은 필수입니다.")
    private String sid;

    @NotBlank(message = "이름은 필수입니다.")
    private String name;

    @NotBlank(message = "날짜는 필수입니다.")
    private String date;

    private String major;

    private String grade;

    @NotNull(message = "출석 상태는 필수입니다.")
    private Attendance.AttendanceStatus status;
    private String qrData;

}
