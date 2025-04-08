package Club.Trace.ClubTraceApp.application.service;

import Club.Trace.ClubTraceApp.domain.auth.entity.Role;
import Club.Trace.ClubTraceApp.domain.auth.service.RefreshTokenService;
import Club.Trace.ClubTraceApp.infrastructure.security.CustomUserDetails;
import Club.Trace.ClubTraceApp.domain.auth.entity.User;
import Club.Trace.ClubTraceApp.domain.auth.repository.UserRepository;
import Club.Trace.ClubTraceApp.domain.auth.service.AuthDomainService;
import Club.Trace.ClubTraceApp.infrastructure.security.JwtTokenProvider;
import Club.Trace.ClubTraceApp.presentation.dto.auth.LoginRequest;
import Club.Trace.ClubTraceApp.presentation.dto.auth.LoginResponse;
import Club.Trace.ClubTraceApp.presentation.dto.auth.SignUpRequest;
import Club.Trace.ClubTraceApp.presentation.dto.auth.SignUpResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor

// 간단한 CRUD 작업은 괜찮다. 단 복잡한 비즈니스 로직 같은 경우에는 Domain 단으로 넘어가서 작업
public class AuthService implements UserDetailsService {

    private final UserRepository userRepository;
    private final AuthDomainService authDomainService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;




    @Override
    public UserDetails loadUserByUsername(String sid) throws UsernameNotFoundException {
        User user = userRepository.findBySid(sid)
                .orElseThrow(() -> new UsernameNotFoundException("유저 존재하지 않음: " + sid));
        return new org.springframework.security.core.userdetails.User(
                user.getSid(),
                user.getPassword(),
                getAuthorities(user.getRole()) // Role enum 가정
        );
    }
    private Collection<? extends GrantedAuthority> getAuthorities(Role role) {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    public LoginResponse login(LoginRequest loginRequest) {
        String sid = loginRequest.getSid();
        String password = loginRequest.getPassword();
        User user = userRepository.findBySid(sid)
                .orElseThrow(() -> new UsernameNotFoundException("유저 존재하지 않음: " + sid));
        authDomainService.validateUserCredentials(user, password, passwordEncoder);

        // 로그인 준비
        User preparedUser = authDomainService.prepareLogin(user);

        // Redis에서 기존 Refresh Token 조회
        String existingRefreshToken = refreshTokenService.getRefreshToken(sid);

        if (existingRefreshToken != null && jwtTokenProvider.validateToken(existingRefreshToken)) {
            String tokenSid = jwtTokenProvider.getSidFromToken(existingRefreshToken);
            if (tokenSid.equals(sid)) {
                String newAccessToken = jwtTokenProvider.generateAccessToken(sid,user.getRole());
                userRepository.save(preparedUser);
                System.out.print("원래 있는거");
                return LoginResponse.from(String.valueOf(preparedUser.getLastLoginTime()), newAccessToken, existingRefreshToken, preparedUser.getName(), String.valueOf(preparedUser.getRole()));
            }
        }

        // 새 토큰 발급 및 저장
        String accessToken = jwtTokenProvider.generateAccessToken(sid,user.getRole());
        String refreshToken = jwtTokenProvider.generateRefreshToken(sid);

        // Redis에 저장 (id를 키로 사용)
        refreshTokenService.saveRefreshToken(sid, refreshToken);
        // DB 업데이트 (필요 시)
        preparedUser.updateRefreshToken(refreshToken);
        userRepository.save(preparedUser);

        return LoginResponse.from(String.valueOf(preparedUser.getLastLoginTime()), accessToken, refreshToken, preparedUser.getName(),String.valueOf(preparedUser.getRole()));
    }

    // Refresh Token으로 Access Token 갱신
    public LoginResponse refreshAccessToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new IllegalArgumentException("유효하지 않은 Refresh Token");
        }

        String sid = jwtTokenProvider.getSidFromToken(refreshToken);
        User user = userRepository.findBySid(sid)
                .orElseThrow(() -> new UsernameNotFoundException("유저 존재하지 않음: " + sid));

        //access 만료로 인해 두 개 모두 재발급
        String newAccessToken = jwtTokenProvider.generateAccessToken(sid,user.getRole());
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(sid);
        refreshTokenService.deleteRefreshToken(sid);
        refreshTokenService.saveRefreshToken(sid, newRefreshToken);
        return LoginResponse.from(sid, newAccessToken, newRefreshToken,user.getName(),String.valueOf(user.getRole()));
    }

    public SignUpResponse signUp(SignUpRequest signUpRequest) {
        String sid = signUpRequest.getSid();

        if (userRepository.findBySid(sid).isPresent()) {
            throw new IllegalArgumentException("해당 학번은 존재합니다.");
        }

        String encodedPassword = passwordEncoder.encode(signUpRequest.getPassword());
        User user = authDomainService.createUser(
                sid,
                encodedPassword,
                signUpRequest.getName()
        );

        userRepository.save(user);

        return new SignUpResponse("가입 완료했습니다.");
    }
    //로그아웃
    public void logOut(String  accessToken){
        String sid = jwtTokenProvider.getSidFromToken(accessToken);
//        String name = jwtTokenProvider.
        System.out.println(sid+"확인해볼까");
        refreshTokenService.deleteRefreshToken(sid);

        User user = userRepository.findBySid(sid)
                .orElseThrow(() -> new UsernameNotFoundException("유저 없음"));

    }

    public void testToken() {
        String token = jwtTokenProvider.generateAccessToken("2019315002",Role.ADMIN);
        System.out.println("Generated Token: " + token);
        System.out.println("Is Valid: " + jwtTokenProvider.validateToken(token));
    }

    public boolean checkSid(String sid){
        return userRepository.findBySid(sid).isPresent();
    }

}