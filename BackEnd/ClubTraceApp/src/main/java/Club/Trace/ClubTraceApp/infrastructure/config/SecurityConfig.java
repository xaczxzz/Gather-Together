package Club.Trace.ClubTraceApp.infrastructure.config;

import Club.Trace.ClubTraceApp.application.exception.ErrorCode;
import Club.Trace.ClubTraceApp.application.exception.ErrorResponse;
import Club.Trace.ClubTraceApp.domain.auth.entity.Role;
import Club.Trace.ClubTraceApp.application.service.AuthService;
import Club.Trace.ClubTraceApp.infrastructure.security.CustomUserDetails;
import Club.Trace.ClubTraceApp.infrastructure.security.JwtAuthenticationFilter;
import Club.Trace.ClubTraceApp.infrastructure.security.JwtTokenProvider;
import Club.Trace.ClubTraceApp.infrastructure.security.TokenStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.DispatcherType;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.PrintWriter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;


    public SecurityConfig(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;

    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
    //access 누락, 만료
    private AuthenticationEntryPoint unauthorizedEntryPoint() {
        return (HttpServletRequest request, HttpServletResponse response, org.springframework.security.core.AuthenticationException authException) -> {
            String authHeader = request.getHeader("Authorization");
            String token = (authHeader != null && authHeader.startsWith("Bearer ")) ? authHeader.substring(7) : null;
            ErrorResponse fail;
            TokenStatus tokenStatus = jwtTokenProvider.checkTokenStatus(token);
            System.out.println("unauthorizedEn"+tokenStatus);
            switch (tokenStatus) {
                case MISSING:
                    fail = new ErrorResponse(ErrorCode.TOKEN_NOT_PROVIDED.getCode(), ErrorCode.TOKEN_NOT_PROVIDED.getMessage());
                    break;
                case EXPIRED:
                    fail = new ErrorResponse(ErrorCode.ACCESS_TOKEN_EXPIRED.getCode(), ErrorCode.ACCESS_TOKEN_EXPIRED.getMessage());
                    break;
                case INVALID:
                    fail = new ErrorResponse(ErrorCode.INVALID_TOKEN.getCode(), ErrorCode.INVALID_TOKEN.getMessage());
                    break;
                default: // VALID는 JwtAuthenticationFilter에서 처리되므로 여기 도달 시 기본 오류
                    fail = new ErrorResponse(HttpStatus.UNAUTHORIZED, "예외구간"+ authException.getMessage());
                    break;
            }
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType("application/json;charset=UTF-8");
            String json = new ObjectMapper().writeValueAsString(fail);
            PrintWriter writer = response.getWriter();
            writer.write(json);
            writer.flush();
        };
    }

    //권한 부족
    private AccessDeniedHandler accessDeniedHandler() {
        return (HttpServletRequest request, HttpServletResponse response, org.springframework.security.access.AccessDeniedException accessDeniedException) -> {
            ErrorResponse fail = new ErrorResponse(ErrorCode.FORBIDDEN_ACCESS.getCode(), ErrorCode.FORBIDDEN_ACCESS.getMessage());
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setContentType("application/json;charset=UTF-8");
            String json = new ObjectMapper().writeValueAsString(fail);
            PrintWriter writer = response.getWriter();
            writer.write(json);
            writer.flush();
        };
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthService authService) throws Exception {
        http
                .csrf(csrfConfig -> csrfConfig.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers("/auth/**","/auth/refresh","/ws/**","/club/chat","swagger-ui/index.html","v3/api-docs").permitAll()
                                .requestMatchers("/api/**", "/api/v1/posts/**").hasRole(Role.USER.name())
                                .requestMatchers("/attend/qr", "/api/v1/admins/**").hasRole(Role.ADMIN.name())
                                .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()
                                .anyRequest().authenticated()
                )
                .exceptionHandling(exceptionConfig ->
                        exceptionConfig.authenticationEntryPoint(unauthorizedEntryPoint())
                                .accessDeniedHandler(accessDeniedHandler())
                )
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider,authService), UsernamePasswordAuthenticationFilter.class);


        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}