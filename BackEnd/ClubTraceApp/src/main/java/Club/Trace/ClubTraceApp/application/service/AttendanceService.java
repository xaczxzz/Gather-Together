package Club.Trace.ClubTraceApp.application.service;

import Club.Trace.ClubTraceApp.application.exception.ErrorCode;
import Club.Trace.ClubTraceApp.application.exception.ErrorResponse;
import Club.Trace.ClubTraceApp.domain.attendance.entity.Attendance;
import Club.Trace.ClubTraceApp.domain.attendance.entity.QR;
import Club.Trace.ClubTraceApp.domain.attendance.repository.AttendanceRepository;
import Club.Trace.ClubTraceApp.domain.attendance.repository.QRRepositroy;
import Club.Trace.ClubTraceApp.domain.attendance.service.AttendanceDomainService;
import Club.Trace.ClubTraceApp.presentation.dto.attendance.AttendanceRequest;
import Club.Trace.ClubTraceApp.presentation.dto.attendance.AttendanceResponse;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final AttendanceDomainService attendanceDomainService;
    private final QRRepositroy qrRepository;


    //출석 정보 생성
    @Transactional
    public AttendanceResponse addAttendanceInfo(AttendanceRequest attendanceRequest, String scanData) {
        if (!attendanceDomainService.verifyQrData(scanData)) {
            throw new IllegalArgumentException("인증 코드가 옳지 않습니다.");
        }
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String today = dateFormat.format(new Date());

        if (attendanceRepository.findBySidAndDate(attendanceRequest.getSid(),today).isPresent()){
            throw new IllegalArgumentException(ErrorCode.ATTEND_DATA_EXIST.getMessage());
        }
        Attendance attendance = attendanceDomainService.createData(attendanceRequest, today);


        Attendance savedAttendance = attendanceRepository.save(attendance);
        return AttendanceResponse.from(savedAttendance);
    }

    //qr 정보 생성
    public String genQrCode() throws Exception {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String today = dateFormat.format(new Date());
        Optional<QR> existingQr = qrRepository.findByDate(today);
        if (existingQr.isPresent()) {
            return existingQr.get().getSecret();
        }
        String newQrData = attendanceDomainService.qrData();

        qrRepository.save(attendanceDomainService.addQrData(today,newQrData));
        return newQrData;
    }

    //출석 정보 수정
    @Transactional
    public AttendanceResponse updateAttendanceInfo(AttendanceRequest attendanceRequest) {
        // 기존 출석 데이터 조회
        Attendance existingAttendance = attendanceRepository.findBySidAndDate(attendanceRequest.getSid(),attendanceRequest.getDate())
                .orElseThrow(() -> new IllegalArgumentException("출석 정보를 찾을 수 없습니다: "));


        // 출석 정보 업데이트
        Attendance updatedAttendance = attendanceDomainService.updateData(existingAttendance, attendanceRequest);

        Attendance savedAttendance = attendanceRepository.save(updatedAttendance);
        return AttendanceResponse.from(savedAttendance);
    }
    @Transactional
    public List<AttendanceResponse> findAttendInfo(String sid) {
        List<Attendance> attendances = attendanceRepository.findAllBySid(sid);
        if (attendances.isEmpty()) {
            throw new IllegalArgumentException("해당 학생의 출석 정보가 없습니다: " + sid);
        }

        return attendances.stream()
                .map(AttendanceResponse::from)
                .collect(Collectors.toList());
    }
    @Transactional
    public List<AttendanceResponse> findAttendAllInfo(){
        List<Attendance> attendances = attendanceRepository.findAll();
        if (attendances.isEmpty()) {
            throw new IllegalArgumentException("전체 출석 정보가 없습니다: ");
        }
        return attendances.stream()
                .map(AttendanceResponse::from)
                .collect(Collectors.toList());
    }



}
