package Club.Trace.ClubTraceApp.application.service;

import Club.Trace.ClubTraceApp.domain.auth.repository.UserRepository;
import Club.Trace.ClubTraceApp.domain.club.repository.MemberRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.internal.verification.VerificationModeFactory.times;
import static org.springframework.test.web.client.ExpectedCount.never;

class AuthServiceTest {

    @Mock
    private MemberRepository memberRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCheckSid_Duplicated() {
        // Given
        String sid = "2019315002";
        when(memberRepository.findBySid(sid)).thenReturn(true);

        // When
        boolean result = authService.checkSid(sid);

        // Then
        assertTrue(result);
        verify(memberRepository, times(1)).findBySid(sid);
    }

    @Test
    void testCheckSid_NotDuplicated() {
        // Given
        String sid = "2019315003";
        when(memberRepository.findBySid(sid)).thenReturn(false);

        // When
        boolean result = authService.checkSid(sid);

        // Then
        assertFalse(result);
        verify(memberRepository, times(1)).findBySid(sid);
    }

    @Test
    void testCheckSid_InvalidInput() {
        // Given
        String sid = "";

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> authService.checkSid(sid));
        verify(userRepository, times(1)).findBySid(sid);
    }
}