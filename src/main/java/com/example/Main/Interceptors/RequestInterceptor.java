package com.example.Main.Interceptors;

import java.util.Collection;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.example.Main.Utils;
import com.example.Main.Models.Users;
import com.example.Main.Repositories.GroupCalendarListRepository;
import com.example.Main.Repositories.GroupListRepository;
import com.example.Main.Repositories.GroupRepository;
import com.example.Main.Repositories.MemberLinkRepository;
import com.example.Main.Repositories.UserRepository;
import com.example.Main.Requests.ProjectManagerRequest;
import com.example.Main.Responses.ProjectManagerResponse;
import com.example.Main.Services.JwtService;
import com.example.Main.Services.ProjectManagerService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RequestInterceptor implements HandlerInterceptor{

	private final UserRepository userRepository;
	private final JwtService jwtService;
		
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		Cookie[] cookies = request.getCookies();

		boolean pathPm = request.getRequestURI().startsWith("/api/pm");
		boolean pathNw = request.getRequestURI().startsWith("/api/nw");
		
		
		if(cookies == null) {
			if(pathPm || pathNw) {
				System.out.println("Blocked request with no cookies to: " + request.getRequestURI());
				response.setStatus(401);
				return false;
			}
			return true;
		}
		

		
		for(Cookie c: cookies) {
			if(c.getName().equals("ssid")) {
				Users user = Utils.getUser(c.getValue(),jwtService ,userRepository);

				if(pathPm || pathNw) {
					if(user == null) {
						System.out.println("Blocked request with cookies to: " + request.getRequestURI());
						response.setStatus(401);
						return false;
					}
				}
					
				request.setAttribute("user", user);
				
				
				return true;
			}
		}
		return true;
	}

	
	
}
