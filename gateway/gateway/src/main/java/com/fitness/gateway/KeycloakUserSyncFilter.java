// java
package com.fitness.gateway;

import com.fitness.gateway.user.RegisterRequest;
import com.fitness.gateway.user.UserService;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
@Slf4j
@RequiredArgsConstructor
public class KeycloakUserSyncFilter implements WebFilter {
    private final UserService userService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");
        String userId = exchange.getRequest().getHeaders().getFirst("X-User-ID");

        if (token == null || token.isBlank()) {
            return chain.filter(exchange);
        }

        RegisterRequest registerRequest = getUserDetails(token);

        if (userId == null && registerRequest != null) {
            userId = registerRequest.getKeycloakId();
        }

        if (userId != null) {
            String finalUserId = userId;
            return userService.validateUser(finalUserId)
                    .flatMap(exist -> {
                        if (!exist && registerRequest != null) {
                            return userService.registerUser(registerRequest).then();
                        } else {
                            log.info("User already exists or no register details, skipping sync.");
                            return Mono.empty();
                        }
                    })
                    .then(Mono.defer(() -> {
                        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                                .header("X-User-ID", finalUserId)
                                .build();
                        return chain.filter(exchange.mutate().request(mutatedRequest).build());
                    }));
        }

        return chain.filter(exchange);
    }

    private RegisterRequest getUserDetails(String token) {
        if (token == null) {
            return null;
        }
        try {
            String tokenWithoutBearer = token.replaceAll("(?i)^Bearer\\s+", "").trim();
            if (tokenWithoutBearer.isEmpty()) {
                return null;
            }
            SignedJWT signedJWT = SignedJWT.parse(tokenWithoutBearer);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

            if (claims == null) {
                log.warn("JWT claims are null");
                return null;
            }

            RegisterRequest registerRequest = new RegisterRequest();
            registerRequest.setEmail(claims.getStringClaim("email"));

            String sub = claims.getSubject();
            if (sub == null) {
                try {
                    Object raw = claims.getClaim("sub");
                    if (raw != null) {
                        sub = String.valueOf(raw);
                    }
                } catch (Exception ex) {
                    // ignore fallback error
                }
            }

            if (sub == null) {
                log.warn("`sub` claim is null — full claims: {}", claims.toJSONObject());
            } else {
                registerRequest.setKeycloakId(sub);
            }

            registerRequest.setPassword("dummy@123123");
            registerRequest.setFirstName(claims.getStringClaim("given_name"));
            registerRequest.setLastName(claims.getStringClaim("family_name"));
            return registerRequest;
        } catch (Exception e) {
            log.warn("Failed to parse JWT from Authorization header: {}", e.getMessage());
            return null;
        }
    }
}
