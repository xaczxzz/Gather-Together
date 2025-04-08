package Club.Trace.ClubTraceApp.domain.auth.repository;

import Club.Trace.ClubTraceApp.domain.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,String> {
    Optional<User> findBySid(String sid);
//    boolean findBySid(String sid);
Optional<User> findByRefreshToken(String refreshToken);

}
