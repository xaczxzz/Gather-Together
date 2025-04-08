package Club.Trace.ClubTraceApp.domain.attendance.repository;

import Club.Trace.ClubTraceApp.domain.attendance.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findBySidAndDate(String sid, String date);
    List <Attendance> findAllBySid(String sid);
}