package Club.Trace.ClubTraceApp.domain.auth.service;

import Club.Trace.ClubTraceApp.domain.auth.entity.Role;
import Club.Trace.ClubTraceApp.domain.auth.entity.User;
import Club.Trace.ClubTraceApp.infrastructure.security.CustomUserDetails;
import Club.Trace.ClubTraceApp.infrastructure.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
@Service
public class AuthDomainService {

    @Value("${ADMIN_SIDS}")
    private Set<String> adminSids;

    // 비밀번호 검증
    public void validateUserCredentials(User user, String inputPassword, PasswordEncoder passwordEncoder) {
        if (!passwordEncoder.matches(inputPassword, user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }
    }

    // 회원가입 시 사용자 생성
    public User createUser(String sid, String encodedPassword, String name) {
        if (sid == null || sid.trim().isEmpty()) {
            throw new IllegalArgumentException("SID는 필수입니다.");
        }
        if (encodedPassword == null || encodedPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("비밀번호는 필수입니다.");
        }

        Role role = adminSids.contains(sid) ? Role.ADMIN : Role.USER;

        return User.builder()
                .sid(sid)
                .password(encodedPassword)
                .role(role)
                .name(name)
                .build();
    }

    // 로그인 준비 (필요 시 확장 가능)
    public User prepareLogin(User user) {
        user.updateLastTime();
        return user;
    }
    public boolean validationRole(){

        return SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                .contains(new SimpleGrantedAuthority("ROLE_ADMIN"));

    }
    public String getCurrentUserSid(){
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(principal instanceof CustomUserDetails){
            return ((CustomUserDetails) principal).getUserSid();
        }
        return principal.toString();

    }

}