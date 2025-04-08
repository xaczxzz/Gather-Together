//package Club.Trace.ClubTraceApp.infrastructure.config.redis;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.boot.autoconfigure.data.redis.RedisProperties;
//import org.springframework.context.annotation.Bean;
//import org.springframework.data.redis.connection.RedisConnectionFactory;
//import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
//import org.springframework.stereotype.Component;
//
//@Component
//@RequiredArgsConstructor
//public class RedisConnection {
//    private  final RedisProperties redisProperties;
//    @Bean
//    public RedisConnectionFactory redisConnectionFactory(){
//        return new LettuceConnectionFactory(redisProperties.getHost(),redisProperties.getPort());
//    }
//}
