package Club.Trace.ClubTraceApp.infrastructure.config;

import io.github.bucket4j.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class BucketConfig {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();




    private BucketConfiguration createBucketConfiguration() {
        Refill refill = Refill.intervally(3, Duration.ofSeconds(60));
        Bandwidth limit = Bandwidth.classic(3, refill);
        return BucketConfiguration.builder().addLimit(limit).build();
    }


    public Bucket resolveBucket(String sessionId) {
        return buckets.computeIfAbsent(sessionId, id ->
                Bucket.builder()
                        .addLimit(createBucketConfiguration().getBandwidths()[0])
                        .build()
        );

    }
    // 요청 하나 소모
    public boolean tryConsume(String sessionId) {
        return resolveBucket(sessionId).tryConsume(1);
    }
}
