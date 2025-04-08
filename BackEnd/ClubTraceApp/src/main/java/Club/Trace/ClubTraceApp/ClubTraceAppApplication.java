package Club.Trace.ClubTraceApp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class ClubTraceAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClubTraceAppApplication.class, args);
	}

}
