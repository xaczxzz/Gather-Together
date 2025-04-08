package Club.Trace.ClubTraceApp.infrastructure.config.WebSocket;

import Club.Trace.ClubTraceApp.application.exception.ErrorCode;
import Club.Trace.ClubTraceApp.application.exception.ErrorResponse;
import Club.Trace.ClubTraceApp.infrastructure.security.JwtTokenProvider;
import Club.Trace.ClubTraceApp.infrastructure.security.TokenStatus;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Component
public class WebSocketInterceptor implements HandshakeInterceptor {
    @Autowired
    private JwtTokenProvider jwtTokenProvider;


    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        String query = request.getURI().getQuery();
        String token = query.split("token=")[1];
        if (jwtTokenProvider.validateToken(token)) {  // JWT 검증
            attributes.put("token", token);  // WebSocket 세션에 토큰 저장
            return true;
        }

        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
    }
}
