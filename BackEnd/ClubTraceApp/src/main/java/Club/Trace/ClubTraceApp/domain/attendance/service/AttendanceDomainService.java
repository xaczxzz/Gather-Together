package Club.Trace.ClubTraceApp.domain.attendance.service;

import Club.Trace.ClubTraceApp.domain.attendance.entity.Attendance;
import Club.Trace.ClubTraceApp.domain.attendance.entity.QR;
import Club.Trace.ClubTraceApp.presentation.dto.attendance.AttendanceRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.Mac;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.text.SimpleDateFormat;
import java.util.*;

import static Club.Trace.ClubTraceApp.domain.attendance.entity.Attendance.AttendanceStatus.PRESENT;

@Service
public class AttendanceDomainService {
    // qr 데이터 생성, qr 인증기
    // 멤버 출석 데이터 생성, 기록하기
    @Value("${qr.secret}")
    String qrSecret;

    //qr 데이터 생성 해시 데이터

    public String qrData() throws Exception {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String today = dateFormat.format(new Date());
        String dataToEncrypt = qrSecret + ":" + today;

        // 동적 IV 생성
        byte[] ivBytes = new byte[16];
        new SecureRandom().nextBytes(ivBytes);
        IvParameterSpec iv = new IvParameterSpec(ivBytes);

        // 암호화
        String encryptedData = encrypt(dataToEncrypt, iv);

        // IV와 암호화 데이터 결합
        String ivEncoded = Base64.getUrlEncoder().withoutPadding().encodeToString(ivBytes);
        String combinedData = ivEncoded + ":" + encryptedData;

        return combinedData;
    }

    public boolean verifyQrData(String combinedData) {
        try {
            // IV와 암호화 데이터 분리
            String[] parts = combinedData.split(":");
            if (parts.length != 2) return false;

            String ivEncoded = parts[0];
            String encryptedData = parts[1];
            IvParameterSpec iv = new IvParameterSpec(Base64.getUrlDecoder().decode(ivEncoded));

            // 복호화
            String decryptedData = decrypt(encryptedData, iv);
            String[] decryptedParts = decryptedData.split(":");
            if (decryptedParts.length != 2 || !decryptedParts[0].equals(qrSecret)) {
                return false;
            }

            String decryptedDate = decryptedParts[1];
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            String today = dateFormat.format(new Date());

            return decryptedDate.equals(today);
        } catch (Exception e) {
            return false;
        }
    }
    public Attendance createData(AttendanceRequest attendanceRequest,String today){

        return Attendance.builder()
                .sid(attendanceRequest.getSid())
                .date(today)
                .status(PRESENT)
                .name(attendanceRequest.getName())
                .grade(attendanceRequest.getGrade())
                .major(attendanceRequest.getMajor())
                .build();

    }

    private Attendance.AttendanceStatus convertToAttendanceStatus(String koreanStatus) {
        if (koreanStatus == null) {
            throw new IllegalArgumentException("Status 값이 null입니다.");
        }
        switch (koreanStatus) {
            case "출석":
                return PRESENT;
            case "결석":
                return Attendance.AttendanceStatus.ABSENT;
            default:
                throw new IllegalArgumentException("유효하지 않은 출석 상태: " + koreanStatus);
        }
    }
    public Attendance updateData(Attendance existingAttendance, AttendanceRequest request) {
        System.out.println(request.getStatus());
        return  Attendance.builder()
                .index(existingAttendance.getIndex())
                .sid(existingAttendance.getSid())
                .date(existingAttendance.getDate())
                .status(request.getStatus())
                .name(existingAttendance.getName())
                .grade(existingAttendance.getGrade())
                .major(existingAttendance.getMajor())
                .build();
    }
    public QR addQrData(String date, String qrdata){
        return QR.builder()
                .date(date)
                .secret(qrdata)
                .build();
    }

    private String encrypt(String data, IvParameterSpec iv) throws Exception {
        SecretKeySpec key = new SecretKeySpec(getKeyBytes(), "AES");
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(Cipher.ENCRYPT_MODE, key, iv);
        byte[] encryptedBytes = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return Base64.getUrlEncoder().withoutPadding().encodeToString(encryptedBytes);
    }

    private String decrypt(String encryptedData, IvParameterSpec iv) throws Exception {
        SecretKeySpec key = new SecretKeySpec(getKeyBytes(), "AES");
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(Cipher.DECRYPT_MODE, key, iv);
        byte[] decodedBytes = Base64.getUrlDecoder().decode(encryptedData);
        byte[] decryptedBytes = cipher.doFinal(decodedBytes);
        return new String(decryptedBytes, StandardCharsets.UTF_8);
    }

    private byte[] getKeyBytes() {
        byte[] keyBytes = qrSecret.getBytes(StandardCharsets.UTF_8);
        byte[] adjustedKey = new byte[16];
        System.arraycopy(keyBytes, 0, adjustedKey, 0, Math.min(keyBytes.length, adjustedKey.length));
        return adjustedKey;
    }

    //


}
