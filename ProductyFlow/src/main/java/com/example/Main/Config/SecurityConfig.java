package com.example.Main.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.Main.Jwt.JwtAuthenticationFilter;
import com.example.Main.Config.PathAccessDeniedHandler;


import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
	
	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final AuthenticationProvider authProvider;
	private final PathAccessDeniedHandler accessDeniedHandler;
	
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		return http
				.csrf(csrf ->
				  csrf
				  .disable())
				.authorizeHttpRequests(authRequest ->
				  authRequest
				    .requestMatchers("/auth/**","/home","/css/**","/js/**","/notify-channels/**", "/group/**", "/", "/auth", "/home",
		    				 "/taskmanager", "/network", "/workspace", "/about", "/contact","/api/pm/**","/api/nw/**","/api/tm/**").permitAll()
				        .anyRequest().authenticated())
				.exceptionHandling(exceptionHandling ->
						exceptionHandling
						.accessDeniedHandler(accessDeniedHandler))
				.sessionManagement(sessionManager->
						sessionManager
						.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authenticationProvider(authProvider)
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
				.build();
	}

}
