package com.example.Main.Services;



import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.Main.Utils;
import com.example.Main.Models.Role;
import com.example.Main.Models.Users;
import com.example.Main.Repositories.UserRepository;
import com.example.Main.Requests.AuthRequest;
import com.example.Main.Requests.LoginRequest;
import com.example.Main.Requests.RegisterRequest;
import com.example.Main.Responses.AuthResponse;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
	
	private final UserRepository userRepository;
	private final JwtService jwtService;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;

	
	public AuthResponse login (HttpServletRequest req, HttpServletResponse res, LoginRequest request) {

		String error = null;
		
		try {
			userRepository.findByUsername(request.getUsername()).orElseThrow();
		}catch(Exception e){
			error = "usernameNotFound";
			
			return AuthResponse.builder()
					.error(error)
					.build();
		}
		
		try {
			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
		}catch(Exception e){
			error = "unableToAuthenticate";
			
			return AuthResponse.builder()
					.error(error)
					.build();
		}
		
		
		Users user = userRepository.findByUsername(request.getUsername()).orElseThrow();
		String token = jwtService.getToken(user, request.getTiempo());
		
		Utils.setAccessToken(res, token, "ssid");
		
		return AuthResponse.builder()
				.username(user.getUsername())
				.id(user.getId())
				.build();
		
	}

	
	
	
	public AuthResponse register(HttpServletRequest req, HttpServletResponse res, RegisterRequest request) {
		String error = null;
		
		System.out.println(request.getUsername());
		
		try {
			Users user = userRepository.findByUsername(request.getUsername()).orElseThrow();
			if(user != null) {
				error = "DuplicatedUserKey";
				System.out.println("DuplicatedUserKey");
				return AuthResponse.builder().error(error).build();
			}
		}catch(Exception e){
		}
		
		try {
			Users user = userRepository.findByEmail(request.getEmail()).orElseThrow();
			if(user != null) {
				error = "DuplicatedEmailKey";
				System.out.println("DuplicatedEmailKey");
				return AuthResponse.builder().error(error).build();
			}
		}catch(Exception e2){
		}
		
		
		
		Users user = Users.builder()
				.username(request.getUsername())
				.password(passwordEncoder.encode(request.getPassword()) )
				.email(request.getEmail())
				.role(Role.USER)
				.build();
		

		try {
			userRepository.save(user);
		}catch(Exception e2){
			error = "errorCreatingUser";
			return AuthResponse.builder().error(error).build();
		}
		
		
		String token = jwtService.getToken(user, request.getTiempo());
		Utils.setAccessToken(res, token, "ssid");
		
		
		return AuthResponse.builder()
				.error(error)
				.username(user.getUsername())
				.id(user.getId())
				.build();
		
	}
	
	
	
	
	
	
	public AuthResponse auth(AuthRequest request, String accessToken, HttpServletResponse res) {
		Users user;
		String error = null;

		user = Utils.getUser(accessToken,jwtService,userRepository);
		if(user == null) {
			error = "userNotFound";
			return AuthResponse
					.builder()
					.error(error)
					.build();
		}
		
		String token = jwtService.getToken(user, request.getTiempo());
		Utils.setAccessToken(res, token, "ssid");
		
		return AuthResponse
				.builder()
				.build();
	}
	
	
	
	
	
	
	
	
	
	
	
	
	

	

}
