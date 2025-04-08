package Club.Trace.ClubTraceApp.presentation.controller;

import Club.Trace.ClubTraceApp.application.service.ClubService;
import Club.Trace.ClubTraceApp.domain.club.entity.Board;
import Club.Trace.ClubTraceApp.presentation.dto.club.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;
import java.util.Map;
@RestController
@Slf4j
@RequestMapping("/club")
public class ClubController {
    @Autowired
    private final ClubService clubService;

    public ClubController(ClubService clubService){
        this.clubService =clubService;
    }

    @PostMapping("/register")
    public ResponseEntity<MemberResponse> register(@RequestBody MemberRequest memberRequest) {
        MemberResponse response = clubService.registerMember(memberRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response); // 201 Created
    }

    @GetMapping("/list")
    public ResponseEntity<List<MemberResponse>> getAllMembers() {
        List<MemberResponse> members = clubService.allMemberList();
        return ResponseEntity.ok(members);
    }
    @PostMapping("/board/add")
    public ResponseEntity<BoardResponse> addBoard(@RequestBody @Valid BoardRequest boardRequest) {
        BoardResponse boardResponse = clubService.createBoard(boardRequest);
        System.out.println("게시판 글 생성");
        return ResponseEntity.status(HttpStatus.CREATED).body(boardResponse);
    }
    @PutMapping("/board/update")
    public ResponseEntity<BoardResponse> updateBoard(@RequestBody @Valid BoardUpdateRequest boardUpdateRequest){

        BoardResponse boardResponse = clubService.updateBoard(boardUpdateRequest);
        return ResponseEntity.status(HttpStatus.OK).body(boardResponse);
    }
    @DeleteMapping("/board/delete/{boardId}")
    public ResponseEntity<BoardResponse> deleteBoard(@PathVariable long boardId){
        System.out.println(boardId);
        clubService.deleteBoard(boardId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/board/list")
    public List<BoardResponse> listBoard(){
        return clubService.getAllBoards();
    }
    @GetMapping("/board/{boardId}")
    public ResponseEntity<BoardResponse> getBoard(@PathVariable Long boardId){
        BoardResponse board = clubService.getBoard(boardId);
        return ResponseEntity.ok(board);
    }
    // 채팅
    @PostMapping("/chat")
    public Mono<ResponseEntity<String>> handleChatRequest(@RequestBody Map<String, String> request) {
        if (!request.containsKey("query") || !request.containsKey("sessionId")) {
            return Mono.just(ResponseEntity.badRequest().body("요청에 query 또는 sessionId가 없습니다."));
        }

        System.out.println("Received query in controller: " + request.get("query"));
        String query = request.get("query");
        String sessionId = request.get("sessionId");

        return Mono.fromFuture(clubService.processChatRequest(query, sessionId))
                .timeout(Duration.ofSeconds(300))
                .map(result -> ResponseEntity.ok(result))
                .onErrorResume(e -> Mono.just(ResponseEntity.status(500).body("에러 발생!!!" + e.getMessage())));
    }

    //멤버 정보
    @GetMapping("/memberInfo/{sid}")
    public ResponseEntity<MemberResponse> getMemberInfo(@PathVariable String sid){
        return clubService.findByMemberInfo(sid);
    }


}
