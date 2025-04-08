package Club.Trace.ClubTraceApp.infrastructure.security;

import Club.Trace.ClubTraceApp.domain.auth.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 어드민, 사용자
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));


    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }


    public String getUsername() {
        return user.getSid();
    }
    public String getUserSid() {return user.getSid();}

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}