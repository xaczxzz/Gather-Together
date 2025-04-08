package Club.Trace.ClubTraceApp.domain.auth.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "users")

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sid;
    private String password;
    private String refreshToken;
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Role role;
    private LocalDateTime lastLoginTime;
    private String name;

    @Builder

    public User(String sid, String password, Role role,String refreshToken,String name) {
        this.sid = sid;
        this.password = password;
        this.role = role;
        this.refreshToken = refreshToken;
        this.name = name;
    }
    public void updateRefreshToken(String refreshToken){
        this.refreshToken = refreshToken;
    }
    public void updateLastTime(){
        this.lastLoginTime = LocalDateTime.now();
    }
}
