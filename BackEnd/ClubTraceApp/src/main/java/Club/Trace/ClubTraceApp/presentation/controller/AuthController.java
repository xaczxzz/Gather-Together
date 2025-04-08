package Club.Trace.ClubTraceApp.presentation.controller;

import Club.Trace.ClubTraceApp.application.service.AuthService;
import Club.Trace.ClubTraceApp.presentation.dto.auth.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private  AuthService authService;




    @PostMapping("/signup")
    public ResponseEntity<SignUpResponse> signUp(@RequestBody SignUpRequest request){
//        System.out

        SignUpResponse response =authService.signUp(request);

        return ResponseEntity.ok(response);
    }
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {

        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        LoginResponse response = authService.refreshAccessToken(refreshToken);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/checkSid/{sid}")
    public boolean duplicationSid(@PathVariable String sid) {
        return (authService.checkSid(sid));

    }
    @PostMapping("/logOut")
    public String logoutUser(@RequestBody String accessToken){
        authService.logOut(accessToken);
        return LogOutResponse.form();
    }

}
