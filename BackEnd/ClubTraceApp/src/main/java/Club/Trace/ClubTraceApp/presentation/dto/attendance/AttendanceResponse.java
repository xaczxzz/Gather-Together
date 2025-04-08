package Club.Trace.ClubTraceApp.presentation.dto.attendance;

import Club.Trace.ClubTraceApp.domain.attendance.entity.Attendance;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AttendanceResponse {
    private Long index;
    private String sid;
    private String name;
    private String date;
    private String major;
    private String grade;
    private AttendanceResponseStatus status;
    private String message;

    public enum AttendanceResponseStatus {
        PRESENT,
        ABSENT;
        public static AttendanceResponseStatus fromAttendanceStatus(Attendance.AttendanceStatus status) {
            if (status == null) {
                return ABSENT; // 기본값
            }
            return switch (status) {
                case PRESENT -> PRESENT;
                case ABSENT -> ABSENT;
            };
        }


    }

    // 단일 Attendance 엔티티에서 DTO로 변환
    public static AttendanceResponse from(Attendance attendance) {
        if (attendance == null) {
            return fail("Attendance 정보가 없습니다.");
        }
        return AttendanceResponse.builder()
                .index(attendance.getIndex())
                .sid(attendance.getSid())
                .name(attendance.getName())
                .date(attendance.getDate())
                .major(attendance.getMajor())
                .grade(attendance.getGrade())
                .status(AttendanceResponseStatus.fromAttendanceStatus(attendance.getStatus())) // 변환 적용
                .message("")
                .build();
    }

    // 실패 응답 생성
    public static AttendanceResponse fail(String errorMessage) {
        return AttendanceResponse.builder()
                .message(errorMessage)
                .build();
    }

    // List<Attendance>를 처리하는 경우 (옵션)
    public static List<AttendanceResponse> fromList(List<Attendance> attendances) {
        return attendances.stream()
                .map(AttendanceResponse::from)
                .toList();
    }
}