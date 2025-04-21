package com.example.Main.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Main.Requests.NetworkRequest;
import com.example.Main.Responses.NetworkResponse;
import com.example.Main.Services.NetworkService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/nw")
@RequiredArgsConstructor
public class NetworkController {

	
	private final NetworkService networkService;
	
	@PostMapping(value = "create")
	public ResponseEntity<NetworkResponse> create
	(HttpServletRequest req, HttpServletResponse res, @RequestBody NetworkRequest request) {
		
		return networkService.create(req, res,request);
    }

	@PostMapping(value = "getData")
	public ResponseEntity<NetworkResponse> data
	(HttpServletRequest req, HttpServletResponse res, @RequestBody NetworkRequest request) {
		
		return networkService.getData(req, res,request);
    }
	
	@PostMapping(value = "getAllProjects")
	public ResponseEntity<NetworkResponse> allData
	(HttpServletRequest req, HttpServletResponse res, @RequestBody NetworkRequest request) {
		
		return networkService.getAllProjects(req, res,request);
    }
	
	@PostMapping(value = "update")
	public ResponseEntity<NetworkResponse> update
	(HttpServletRequest req, HttpServletResponse res, @RequestBody NetworkRequest request) {
		
		return networkService.update(req, res,request);
	}

	
	@PostMapping(value = "delete")
	public ResponseEntity<NetworkResponse> delete
	(HttpServletRequest req, HttpServletResponse res, @RequestBody NetworkRequest request) {
		
		return networkService.delete(req, res,request);
	}


	
}
