package com.example.Main.Config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class PathAccessDeniedHandler implements AccessDeniedHandler {

    private static final Logger logger = LoggerFactory.getLogger(PathAccessDeniedHandler.class);
	
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
    	System.out.println("Acceso denegado: un usuario no autenticado intentó acceder a {"+request.getRequestURI()+"}");
        logger.warn("Acceso denegado: {} intentó acceder a {}", request.getRemoteUser(), request.getRequestURI());
        response.sendError(HttpServletResponse.SC_FORBIDDEN, "Acceso denegado");
    }
}