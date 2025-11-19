package com.example.Main.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.example.Main.Interceptors.RequestInterceptor;
import com.example.Main.Repositories.UserRepository;
import com.example.Main.Services.JwtService;

@Configuration
public class InterceptorConfig implements WebMvcConfigurer{

    private final UserRepository userRepository;
    private final JwtService jwtService;
	
    public InterceptorConfig(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(new RequestInterceptor(userRepository,jwtService));
	}
	

}
