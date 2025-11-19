package com.fitness.gateway.user;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    @LoadBalanced // We use Service name instead of port number for communication
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    } // Exposing the Instance of Web Client to the whole application

    @Bean
    public WebClient userServiceWebClient(WebClient.Builder builder) {
        return builder.baseUrl("http://USER-SERVICE").build();
    }
}
