package Club.Trace.ClubTraceApp.application.service;

import Club.Trace.ClubTraceApp.application.exception.ErrorCode;
import Club.Trace.ClubTraceApp.application.exception.ErrorResponse;
import Club.Trace.ClubTraceApp.domain.auth.service.AuthDomainService;
import Club.Trace.ClubTraceApp.domain.club.entity.Board;
import Club.Trace.ClubTraceApp.domain.club.entity.Member;
import Club.Trace.ClubTraceApp.domain.club.repository.BoardRepository;
import Club.Trace.ClubTraceApp.domain.club.repository.MemberRepository;
import Club.Trace.ClubTraceApp.domain.club.service.ClubDomainService;
import Club.Trace.ClubTraceApp.infrastructure.config.BucketConfig;
import Club.Trace.ClubTraceApp.presentation.dto.club.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.Vector;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service

public class ClubService {
    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;
    private final ClubDomainService clubDomainService;
    private final AuthDomainService authDomainService;

    private static final Map<double[], String> chatCache = new ConcurrentHashMap<>();

    private final WebClient ragWebClient ;

    private final BucketConfig bucketConfig;

    @Autowired
    public ClubService(WebClient webClient, BoardRepository boardRepository, MemberRepository memberRepository,
                       ClubDomainService clubDomainService, AuthDomainService authDomainService, WebClient ragWebClient,BucketConfig bucketConfig) {
        this.memberRepository = memberRepository;
        this.clubDomainService = clubDomainService;
        this.authDomainService = authDomainService;
        this.boardRepository = boardRepository;
//        this.chatWebSocketHandler = chatWebSocketHandler;
        this.ragWebClient = ragWebClient;
        this.bucketConfig = bucketConfig;

    }



    // 챗 기능
    @Async
    public CompletableFuture<String> processChatRequest(String query, String sessionId) {
        if (!bucketConfig.tryConsume(sessionId)) {
            CompletableFuture<String> failedFuture = new CompletableFuture<>();
            failedFuture.completeExceptionally(
                    new RuntimeException(ErrorCode.FORBIDDEN_RATE_LIMIT.getMessage())
            );

        }
        return ragWebClient.get()
                .uri(uriBuilder -> uriBuilder.path("/ask").queryParam("query",query).build())
                .retrieve()
                .bodyToMono(String.class)
                .doOnError(e -> System.out.println("발생했습니다 processChatRequest. Error: " + e.getMessage())) // 에러 로그
                .toFuture();
    }
    // --- 게시판 CRUD 기능 ---

    @Transactional
    public BoardResponse createBoard(BoardRequest request) {
        Board board = clubDomainService.prepareBoard(request);
        Board savedBoard = boardRepository.save(board);
        return BoardResponse.from(savedBoard);
    }

    @Transactional(readOnly = true)
    public BoardResponse getBoard(Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다: " + boardId));
        return BoardResponse.from(board);
    }

    @Transactional(readOnly = true)
    public List<BoardResponse> getAllBoards() {
        return boardRepository.findAll().stream()
                .map(BoardResponse::from)
                .toList();
    }

    @Transactional
    public BoardResponse updateBoard(BoardUpdateRequest boardUpdateRequest) {
        Board existingBoard = boardRepository.findById(boardUpdateRequest.getBoardId())
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다: "));
        Board updatedBoard = clubDomainService.prepareBoardUpdate(existingBoard, boardUpdateRequest.getTitle(), boardUpdateRequest.getContent());
        Board savedBoard = boardRepository.save(updatedBoard);
        return BoardResponse.from(savedBoard);
    }

    @Transactional
    public void deleteBoard(Long boardId) {
        // optional
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다: "));
        String currentUsername = authDomainService.getCurrentUserSid();
        System.out.print(currentUsername+" ");
        // 권한 검증
        if (!authDomainService.validationRole()) {
            if (currentUsername.equals(board.getSid())){
                boardRepository.delete(board);
                return;
            }
            throw new IllegalStateException("게시글을 삭제할 권한이 없습니다.");
        }

        // 삭제 실행
        boardRepository.delete(board);
    }

    // --- 동아리 멤버 관리 기능 ---

    @Transactional
    public MemberResponse registerMember(MemberRequest request) {
        Member member = clubDomainService.prepareMemberRegistration(request);


        if (member == null){
            return null;
        }

        Member savedMember = memberRepository.save(member);

        return MemberResponse.from(savedMember);
    }
    @Transactional
    public List<MemberResponse> allMemberList(){
        List<Member> members = memberRepository.findAll();

        authDomainService.validationRole();

        return members.stream()
                .map(MemberResponse::from)
                .collect(Collectors.toList());


    }
    @Transactional(readOnly = true)
    public ResponseEntity<MemberResponse> findByMemberInfo(String sid) {
        Member member = memberRepository.findBySid(sid);
        if (member == null){
            throw new NullPointerException();
        }

        return ResponseEntity.ok(MemberResponse.from(member));
    }







}
