package Club.Trace.ClubTraceApp.domain.club.repository;

import Club.Trace.ClubTraceApp.domain.club.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<Board,Long> {
}
