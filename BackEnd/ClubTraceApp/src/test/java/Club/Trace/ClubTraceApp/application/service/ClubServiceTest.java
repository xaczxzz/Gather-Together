package Club.Trace.ClubTraceApp.application.service;
import Club.Trace.ClubTraceApp.infrastructure.config.BucketConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Function;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ClubServiceTest {

    @Mock
    private WebClient ragWebClient;

    @Mock
    private BucketConfig bucketConfig;

    @Mock
    private WebClient.RequestHeadersUriSpec requestHeadersUriSpec;

    @Mock
    private WebClient.RequestHeadersSpec requestHeadersSpec;

    @Mock
    private WebClient.ResponseSpec responseSpec;

    @InjectMocks
    private ClubService clubService;

    @BeforeEach
    void setUp() {
        // 필요 시 초기화 로직 추가
    }

    @Test
    void testProcessChatRequest_BucketLimitExceeded() throws ExecutionException, InterruptedException {
        // Given
        String sessionId1 = "32949-32132"; //테스트 세션 Id
        String sessionId2 = "12213-1221"; //테스트 세션 Id
        String query = "동아리 엠티 언제인가요?";
        String expectedResponse = "동아리 엠티는 내일 입니다.";

        when(bucketConfig.tryConsume(sessionId1))
                .thenReturn(true);
        when(bucketConfig.tryConsume(sessionId2))
                .thenReturn(true);



        // WebClient 모킹
        when(ragWebClient.get()).thenReturn(requestHeadersUriSpec);
        // uri() 모킹 수정: Function<UriBuilder, URI> 타입을 명시적으로 처리
        when(requestHeadersUriSpec.uri(any(Function.class))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(String.class)).thenReturn(Mono.just(expectedResponse));



        for (int i = 0; i < 5; i++) {
            CompletableFuture<String> future = clubService.processChatRequest(query, sessionId1);
            String result = future.get();
            assertNotNull(result);
            assertEquals(expectedResponse, result);
        }


        CompletableFuture<String> future = clubService.processChatRequest(query, sessionId1);
        try {
            future.get(); // 예외 발생 기대

        } catch (ExecutionException e) {

            assertTrue(e.getCause() instanceof RuntimeException);
        }

        // Verify
        verify(bucketConfig, times(6)).tryConsume(sessionId1);
        verify(ragWebClient, times(5)).get(); // 5번만 WebClient 호출됨
    }
    @Test
    void testProcessChatRequest_MultiThreadedBucketLimit() throws InterruptedException {
        // Given
        String sessionId1 = "32949-32132";
        String sessionId2 = "12213-1221";
        String query = "동아리 엠티 언제인가요?";
        String expectedResponse = "동아리 엠티는 내일 입니다.";

        // BucketConfig 모킹: 각 sessionId에 대해 5번 true, 이후 false
        when(bucketConfig.tryConsume(sessionId1))
                .thenReturn(true, true, true, true, true);
        when(bucketConfig.tryConsume(sessionId2))
                .thenReturn(true, true, true, true, true);

        // WebClient 모킹
        when(ragWebClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(any(Function.class))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(String.class)).thenReturn(Mono.just(expectedResponse));

        // 스레드 풀 생성
        ExecutorService executorService = Executors.newFixedThreadPool(2);
        AtomicInteger successCount1 = new AtomicInteger(0);
        AtomicInteger successCount2 = new AtomicInteger(0);
        AtomicInteger failureCount1 = new AtomicInteger(0);
        AtomicInteger failureCount2 = new AtomicInteger(0);

        // sessionId1 작업
        Runnable task1 = () -> {
            for (int i = 0; i < 5; i++) {
                try {
                    CompletableFuture<String> future = clubService.processChatRequest(query, sessionId1);
                    String result = future.get();
                    successCount1.incrementAndGet();
                } catch (ExecutionException e) {
                    assertTrue(e.getCause() instanceof RuntimeException);
                    failureCount1.incrementAndGet();
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        };

        // sessionId2 작업
        Runnable task2 = () -> {
            for (int i = 0; i < 5; i++) {
                try {
                    CompletableFuture<String> future = clubService.processChatRequest(query, sessionId2);
                    String result = future.get();
                    successCount2.incrementAndGet();
                } catch (ExecutionException e) {
                    assertTrue(e.getCause() instanceof RuntimeException);
                    failureCount2.incrementAndGet();
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        };

        // 스레드 실행
        executorService.submit(task1);
        executorService.submit(task2);

        // 스레드 작업 완료 대기
        executorService.shutdown();
        executorService.awaitTermination(10, java.util.concurrent.TimeUnit.SECONDS);

        // Then: 각 sessionId별로 5번 성공, 0번 실패 확인
        assertEquals(5, successCount1.get(), "sessionId1 ");
        assertEquals(0, failureCount1.get(), "sessionId1 ");
        assertEquals(5, successCount2.get(), "sessionId2 ");
        assertEquals(0, failureCount2.get(), "sessionId2 ");

        // Verify: 각 sessionId별로 5번 호출, WebClient는 총 10번 호출 (5+5)
        verify(bucketConfig, times(5)).tryConsume(sessionId1);
        verify(bucketConfig, times(5)).tryConsume(sessionId2);
        verify(ragWebClient, times(10)).get();
    }
}


