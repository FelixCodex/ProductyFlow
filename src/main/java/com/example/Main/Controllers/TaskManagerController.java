package com.example.Main.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Main.Requests.TaskManagerRequest;
import com.example.Main.Responses.TaskManagerResponse;
import com.example.Main.Services.TaskManagerService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tm")
@RequiredArgsConstructor
public class TaskManagerController {

	
	private final TaskManagerService taskManagerService;
	
	
	@PostMapping(value = "createList")
	public ResponseEntity<TaskManagerResponse> createlist
	(HttpServletRequest req, HttpServletResponse res, @RequestBody TaskManagerRequest request) {
		
		return taskManagerService.createNewList(req, res, request);
    }

	@PostMapping(value = "getListData")
	public ResponseEntity<TaskManagerResponse> listData
	(HttpServletRequest req, HttpServletResponse res, @RequestBody TaskManagerRequest request) {
		
		return taskManagerService.getListData(req, res, request);
    }
	
	@PostMapping(value = "getAllLists")
	public ResponseEntity<TaskManagerResponse> allListas
	(HttpServletRequest req, HttpServletResponse res, @RequestBody TaskManagerRequest request) {
		
		return taskManagerService.getAllLists(req, res, request);
    }
	
	@PostMapping(value = "updateList")
	public ResponseEntity<TaskManagerResponse> updateList
	(HttpServletRequest req, HttpServletResponse res, @RequestBody TaskManagerRequest request) {
		
		return taskManagerService.updateList(req, res, request);
	}

	
	@PostMapping(value = "deleteList")
	public ResponseEntity<TaskManagerResponse> deleteList
	(HttpServletRequest req, HttpServletResponse res, @RequestBody TaskManagerRequest request) {
		
		return taskManagerService.deleteList(req, res, request);
	}

	
	@PostMapping(value = "getCalendarDate")
	public ResponseEntity<TaskManagerResponse> getCalendarDate
	(HttpServletRequest req, HttpServletResponse res, @RequestBody TaskManagerRequest request) {
		
		return taskManagerService.getCalendarDate(req, res, request);
    }
	
	@PostMapping(value = "updateCalendarDate")
	public ResponseEntity<TaskManagerResponse> updateCalendarDate
	(HttpServletRequest req, HttpServletResponse res, @RequestBody TaskManagerRequest request) {
		
		return taskManagerService.updateCalendarDate(req, res, request);
	}
}