package Club.Trace.ClubTraceApp.infrastructure.security;

import Club.Trace.ClubTraceApp.application.service.AuthService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthService authService;



    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider,AuthService authService) {
        this.authService= authService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String path = request.getRequestURI();

        if (path.startsWith("/auth/")) {
            System.out.println("Skipping /auth/ path: " + path);
            chain.doFilter(request, response);
            return;
        }

        String token = resolveToken(request);
        if (token != null && jwtTokenProvider.validateToken(token)) {

            String sid = jwtTokenProvider.getSidFromToken(token);
            String role = jwtTokenProvider.getRoleFromToken(token);
            List<GrantedAuthority> authorities = Collections.singletonList(
                    new SimpleGrantedAuthority("ROLE_" + role));
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(sid, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(auth);
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        }
        try{
            chain.doFilter(request, response);
            System.out.println("수행하러 갑니당"+path);
        }
        catch (Exception e){
            System.out.println(("❌ JWT 인증 필터에서 요청 차단: " + e.getMessage()));
        }

    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}