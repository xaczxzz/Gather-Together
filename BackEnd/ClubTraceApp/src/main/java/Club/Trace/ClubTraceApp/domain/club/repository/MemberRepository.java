package Club.Trace.ClubTraceApp.domain.club.repository;

import Club.Trace.ClubTraceApp.domain.club.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member,Long> {
    boolean existsBySid(String sid);
    Member findBySid(String sid);
}
