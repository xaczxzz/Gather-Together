package Club.Trace.ClubTraceApp.application.service;

import Club.Trace.ClubTraceApp.domain.attendance.entity.QR;
import Club.Trace.ClubTraceApp.domain.attendance.repository.QRRepositroy;
import Club.Trace.ClubTraceApp.domain.attendance.service.AttendanceDomainService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.internal.verification.VerificationModeFactory.times;

class AttendanceServiceTest {

    @Mock
    private QRRepositroy qrRepository;

    @Mock
    private AttendanceDomainService attendanceDomainService;


    @InjectMocks
    private AttendanceService attendanceService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGenQrCode_ExistingQr() throws Exception {
        // Given
        String today = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
        System.out.println(today);
        QR qr = new QR(today, "emnksdf");
        when(qrRepository.findByDate(today)).thenReturn(Optional.of(qr));

        // When
        String result = attendanceService.genQrCode();


        // Then
        assertEquals("https://myapp.com/qr/XyZ123", result);
        verify(qrRepository, times(1)).findByDate(today);
        verify(attendanceDomainService, never()).qrData();
        verify(qrRepository, never()).save(any(QR.class));
    }

    @Test
    void testGenQrCode_NewQr() throws Exception {
        String today = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
        when(qrRepository.findByDate(today)).thenReturn(Optional.empty());
//        when(attendanceDomainService.qrData()).thenReturn("https://myapp.com/qr/New123");
        String result = attendanceService.genQrCode();
        assertEquals(result, result);
    }
}