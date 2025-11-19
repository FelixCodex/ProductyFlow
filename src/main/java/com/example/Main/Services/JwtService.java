package com.example.Main.Services;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.example.Main.Models.Users;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
	
	private static final String SECRET_KEY =  "aT3Cdhco5BWZAts7C9jQzyOPQOrxFckGNdsObLsan88m4tHcYTeAqOpv2ueGqVtWNYoBtx6EXsTjjb6j7w2s";

	public String getToken(UserDetails user, String tiempo) {
		return getToken(new HashMap<>(), user, tiempo);
	}

	private String getToken(Map<String,Object> extraClaims, UserDetails user, String tiempo) {
		long expDate = System.currentTimeMillis()+1000*60*60*24*2;
		if(tiempo == "true") {
			expDate = System.currentTimeMillis()+1000*60*60*24*365;
		}
		return Jwts
				.builder()
				.setClaims(extraClaims)
				.setSubject(user.getUsername())
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(expDate))
				.signWith(getKey(), SignatureAlgorithm.HS256)
				.compact();
	}

	private Key getKey() {
		byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
		return Keys.hmacShaKeyFor(keyBytes);
	}

	public String getUsernameFromToken(String token) {
		
		return getClaim(token, Claims::getSubject);
		
		
	}

	public boolean isTokenValid(String token, UserDetails userDetails) {
		final String username = getUsernameFromToken(token);
		return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
	}
	

	private Claims getAllClaims(String token) {
		Claims claim;
		try {
			claim = Jwts
				.parserBuilder()
				.setSigningKey(getKey())
				.build()
				.parseClaimsJws(token)
				.getBody();
		}catch(Exception e) {
			return null;
		}
		return claim;
	}
	
	public <T> T getClaim(String token, Function<Claims,T> claimsResolver) {
		
		final Claims claims = getAllClaims(token);
		try {
			if(claims.equals("null")){
				return null;
			}
		}catch(Exception e) {
			return null;
		}
		
		return claimsResolver.apply(claims);
		
	}
	
	
	private Date getExpiration(String token) {
		return getClaim(token, Claims::getExpiration);
	}
	
	private boolean isTokenExpired(String token) {
		return getExpiration(token).before(new Date());
	}
	
	
	
}
