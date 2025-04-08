package Club.Trace.ClubTraceApp.domain.club.service;

import Club.Trace.ClubTraceApp.domain.auth.entity.Role;
import Club.Trace.ClubTraceApp.domain.auth.entity.User;
import Club.Trace.ClubTraceApp.domain.club.entity.Board;
import Club.Trace.ClubTraceApp.domain.club.entity.Member;
import Club.Trace.ClubTraceApp.presentation.dto.club.BoardRequest;
import Club.Trace.ClubTraceApp.presentation.dto.club.MemberRequest;
import Club.Trace.ClubTraceApp.presentation.dto.club.MemberResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ClubDomainService {


    // --- 게시판, 멤버의상태를 변경하는거 ---


    // 게시글 생성 준비
    public Board prepareBoard(BoardRequest request) {
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("게시글 제목은 필수입니다.");
        }
        return Board.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .writer(request.getWriter())
                .day(LocalDateTime.now().toString())
                .sid(request.getSid())
                .build();
    }

    // 수정용 메서드
    public Board prepareBoardUpdate(Board existingBoard, String title, String content) {
        if ((title == null || title.trim().isEmpty()) && (content == null || content.trim().isEmpty())) {
            return existingBoard; // 기존 객체 반환
        }
        Board.BoardBuilder builder = Board.builder()
                .boardId(existingBoard.getBoardId()) // ID 유지 필수
                .sid(existingBoard.getSid())
                .title(existingBoard.getTitle()) // 기본값
                .content(existingBoard.getContent()) // 기본값
                .writer(existingBoard.getWriter())
                .day(existingBoard.getDay());

        // title이 유효하면 적용
        if (title != null && !title.trim().isEmpty()) {
            builder.title(title);
        }

        // content가 유효하면 적용
        if (content != null && !content.trim().isEmpty()) {
            builder.content(content);
        }

        return builder.build(); // 새 객체 반환, ID 포함
    }

    // --- 동아리 멤버 관리 기능 ---

    // 신청자 등록 변경
    public Member prepareMemberRegistration(MemberRequest response) {
        System.out.println("여기 들어옴");
        System.out.println(response.getStatus());
        if (MemberRequest.MemberStatus.APPROVE.equals(response.getStatus())){
            System.out.println("생성중멤버 ");
            return Member.builder()
                    .sid(response.getSid())
                    .name(response.getName())
                    .major(response.getMajor())
                    .grade(response.getGrade())
                    .joinDate(response.getJoinDate())
                    .role(Role.USER)
                    .build();
        }
        else{
            return null;
        }
    }
    // Admin,User 구분


}