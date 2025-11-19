package com.example.Main.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.Main.Requests.LoginRequest;
import com.example.Main.Requests.RegisterRequest;
import com.example.Main.Responses.AuthResponse;
import com.example.Main.Services.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;

	@PostMapping(value = "login")
	public ResponseEntity<AuthResponse> login
	(HttpServletRequest req, HttpServletResponse res, @RequestBody LoginRequest request) {
		
		return ResponseEntity.ok(authService.login(req, res, request));
	}

	@PostMapping(value = "register")
	public ResponseEntity<AuthResponse> register
	(HttpServletRequest req, HttpServletResponse res, @RequestBody RegisterRequest request) {
		
		return ResponseEntity.ok(authService.register(req, res, request));
    }
	
	
	@PostMapping(value = "authenticate")
	public ResponseEntity<AuthResponse> auth
	(HttpServletRequest req, HttpServletResponse res, @RequestBody LoginRequest request) {
		
		
		
		return ResponseEntity.ok(AuthResponse.builder().build());
	}
	

	
	@GetMapping("/login")
    @ResponseBody
    public String login() {
        return "Login Page";
    }
	
	@GetMapping("/register")
    @ResponseBody
    public String register() {
        return "Register Page";
    }
	
	
}
