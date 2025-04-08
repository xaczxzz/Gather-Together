package Club.Trace.ClubTraceApp.presentation.controller;

import Club.Trace.ClubTraceApp.application.service.AttendanceService;
import Club.Trace.ClubTraceApp.presentation.dto.attendance.AttendanceRequest;
import Club.Trace.ClubTraceApp.presentation.dto.attendance.AttendanceResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@AllArgsConstructor
@RequestMapping("/attend")
public class AttendanceController {
    @Autowired
    private final AttendanceService attendanceService;

    //qr data
    @GetMapping("/qr")
    public ResponseEntity<String> qrResponse() throws  Exception{
        try{
            String qrLink = attendanceService.genQrCode();
            return ResponseEntity.ok(qrLink);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("qr error"+ e.getMessage());
        }

    }
    //qr 출석 인증 및 출석 정보 등록
    @PostMapping("/qrIdentify")
    public ResponseEntity<AttendanceResponse> qrIdentify(@RequestBody AttendanceRequest attendanceRequest){
        try {
            AttendanceResponse response = attendanceService.addAttendanceInfo(attendanceRequest, attendanceRequest.getQrData());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(AttendanceResponse.fail("큐알 오류"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(AttendanceResponse.fail("서버 오류"));
        }


    }
    @PutMapping("/updateInfo")
    public ResponseEntity<AttendanceResponse> updateInfo(@RequestBody AttendanceRequest attendanceRequest){
        System.out.println("수신된 요청: " + attendanceRequest);
        try {
            AttendanceResponse attendanceResponse = attendanceService.updateAttendanceInfo(attendanceRequest);
            return ResponseEntity.ok(attendanceResponse);
        } catch (Exception e) {
            System.err.println("오류 발생: " + e.getMessage());
            e.printStackTrace(); // 스택 트레이스 추가
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(AttendanceResponse.fail(e.getMessage()));
        }

//        return ResponseEntity.ok(attendanceResponse);

    }
    @GetMapping("/info/{sid}")
    public List<AttendanceResponse> findAllSidInfo(@PathVariable("sid") String sid){
        System.out.println(sid);
            return attendanceService.findAttendInfo(sid);
    }
    @GetMapping("/info/all")
    public List<AttendanceResponse> findAllInfo(){
        return attendanceService.findAttendAllInfo();
    }

}
