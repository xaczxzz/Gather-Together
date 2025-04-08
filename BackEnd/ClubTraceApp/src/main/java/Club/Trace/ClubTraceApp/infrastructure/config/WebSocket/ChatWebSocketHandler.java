package Club.Trace.ClubTraceApp.infrastructure.config.WebSocket;

import Club.Trace.ClubTraceApp.infrastructure.security.JwtTokenProvider;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;


import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private static final ConcurrentHashMap<String, WebSocketSession> CLIENTS = new ConcurrentHashMap<String, WebSocketSession>();

    public ChatWebSocketHandler(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {


        String query = session.getUri().getQuery();
        String token = null;

        if (query != null && query.contains("token=")) {
            token = query.split("token=")[1];
//            System.out.println("추출된 토큰: " + token);
        }
        // 토큰이 유효하지 않는 경우
        if (token == null || !jwtTokenProvider.validateToken(token)) {

            session.close(CloseStatus.NOT_ACCEPTABLE);
            return;
        }

        //제대로 잘 도착
        CLIENTS.put(session.getId(), session);
        session.sendMessage(new TextMessage(session.getId()));
    }


//    public static void sendMessageToClient(String sessionId, String message){
//
//        WebSocketSession session = CLIENTS.get(sessionId);
//        if(session != null && session.isOpen()){
//
//            try {
//                session.sendMessage(new TextMessage(message));
//            }
//            catch (IOException e ){
//                System.out.println("전송 중 문제 발생");
//                e.printStackTrace();
//            }
//        }
//        else{
//            System.out.println("세션 ");
//            CLIENTS.remove(sessionId);
//        }
//    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        CLIENTS.remove(session.getId());
    }




}