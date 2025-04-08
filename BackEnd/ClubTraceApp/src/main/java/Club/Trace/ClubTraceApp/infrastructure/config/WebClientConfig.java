package Club.Trace.ClubTraceApp.infrastructure.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

@Configuration
public class WebClientConfig {


    @Value("${rag.server}")
    private String ragServerUrl;

    @Bean
    WebClient webClient(@Value("${rag.server}") String ragServerUrl,WebClient.Builder builder){
        HttpClient httpClient = HttpClient.create()
                .proxyWithSystemProperties();
        return builder.clientConnector(new ReactorClientHttpConnector(httpClient)).build();
    }
    @Bean
    public WebClient ragWebClient() {

        return WebClient.builder()
                .baseUrl(ragServerUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();

    }
}
