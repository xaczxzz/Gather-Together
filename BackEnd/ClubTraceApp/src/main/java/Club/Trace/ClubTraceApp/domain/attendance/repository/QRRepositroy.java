package Club.Trace.ClubTraceApp.domain.attendance.repository;

import Club.Trace.ClubTraceApp.domain.attendance.entity.QR;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QRRepositroy extends JpaRepository<QR,String> {
    Optional<QR> findByDate(String date);
}
