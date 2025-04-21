package com.example.Main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.example.Main.Repositories.GroupRepository;
import com.example.Main.Repositories.UserRepository;
import com.example.Main.Requests.ProjectManagerRequest;
import com.example.Main.Services.JwtService;

@SpringBootApplication
public class ProductyFlowApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProductyFlowApplication.class, args);
	}

}
