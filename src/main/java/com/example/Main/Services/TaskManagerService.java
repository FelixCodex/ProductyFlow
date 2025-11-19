package com.example.Main.Services;


import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.Main.Utils;
import com.example.Main.Models.CalendarLists;
import com.example.Main.Models.ListProjects;
import com.example.Main.Models.Users;
import com.example.Main.Repositories.CalendarListRepository;
import com.example.Main.Repositories.ListRepository;
import com.example.Main.Repositories.UserRepository;
import com.example.Main.Requests.TaskManagerRequest;
import com.example.Main.Responses.ProjectManagerResponse;
import com.example.Main.Responses.TaskManagerResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class TaskManagerService {
	
	private final UserRepository userRepository;
	private final ListRepository listRepository;
	private final CalendarListRepository calendarListRepository;
	private final JwtService jwtService;
	
	
	
	
	

	
	public ResponseEntity<TaskManagerResponse> createNewList(HttpServletRequest req, HttpServletResponse res, TaskManagerRequest request) {
		String error = null;
		Users user = (Users) req.getAttribute("user");
		
		if(user == null) {
			error = "userNotUthenticated";
			return ResponseEntity.status(401).body(null);
		}
		
		String ListName = "Untitled List";
		
		if(request.getLang().equals("es")) {
			System.out.println("Entro");
			ListName = "Lista sin nombre";
		}

		

		ListProjects lists = ListProjects.builder()
							.userid(user.getId())
							.projectname(ListName)
							.project(null)
						    .build();
		

		try {
			listRepository.save(lists);
		}catch(Exception e) {
			error = "repositoryCouldNotSave";
			return ResponseEntity.status(400).body(null);
		}
		
		TaskManagerResponse response = TaskManagerResponse
				.builder()
				.projects(lists.getId().toString())
				.error(error)
				.build();

		return ResponseEntity.ok(response);
	}
	
	
	
	
	
	
	public ResponseEntity<TaskManagerResponse> getListData(HttpServletRequest req, HttpServletResponse res, TaskManagerRequest request) {
		String error = null;		
		Users user = (Users) req.getAttribute("user");
		
		if(user == null) {
			error = "userNotUthenticated";
			return ResponseEntity.status(401).body(null);
		}

		Long id = request.getListId();
		ListProjects list;
		
		
		
		try {
			list = listRepository.findById(id).orElseThrow();
		}catch(Exception e) {
			error = "repositoryCouldNotFound";
			return ResponseEntity.status(404).body(null);
		}
		
		
		

		TaskManagerResponse response = TaskManagerResponse
				.builder()
				.listProject(list.getProject())
				.listProjectName(list.getProjectname())
				.build();

		return ResponseEntity.ok(response);
		
	}
	
	
	
	
	
	
	
	public ResponseEntity<TaskManagerResponse> updateList(HttpServletRequest req, HttpServletResponse res, TaskManagerRequest request) {
		String error = null;
		Users user = (Users) req.getAttribute("user");
		
		if(user == null) {
			error = "userNotUthenticated";
			return ResponseEntity.status(401).body(null);
		}

		Long id = request.getListId();
		String listProject = request.getListProject(); 
		ListProjects list;
		
		
		try {
			list = listRepository.findById(id).orElseThrow();
		}catch(Exception e) {
			error = "listProjectNotFound";
			return ResponseEntity.status(404).body(null);
		}
		
		
		

		list.setProject(listProject);
		list.setProjectname(request.getListProjectName());

		try {
			listRepository.save(list);
		}catch(Exception e) {
			error = "repositoryCouldNotSave";
			return ResponseEntity.status(400).body(null);
		}
		
		

		TaskManagerResponse response = TaskManagerResponse
				.builder()
				.error(error)
				.build();

		return ResponseEntity.ok(response);		
	}
	
	
	
	
	
	
	public ResponseEntity<TaskManagerResponse> deleteList(HttpServletRequest req, HttpServletResponse res, TaskManagerRequest request) {
		String error = null;
		Users user = (Users) req.getAttribute("user");
		
		if(user == null) {
			error = "userNotUthenticated";
			return ResponseEntity.status(401).body(null);
		}

		Long id = request.getListId();
		ListProjects list;
		
		
		
		try {
			list = listRepository.findById(id).orElseThrow();
		}catch(Exception e) {
			error = "repositoryCouldNotFind";
			return ResponseEntity.status(404).body(null);
		}
		
		if(list.getUserid() == user.getId()) {
			try {
				listRepository.deleteById(id);
			}catch(Exception e) {
				error = "repositoryCouldNotDelete";
				return ResponseEntity.status(400).body(null);
			}
		}
		
		

		TaskManagerResponse response = TaskManagerResponse
				.builder()
				.error(error)
				.build();

		return ResponseEntity.ok(response);	
	}
	
	
	
	
	
	
	public ResponseEntity<TaskManagerResponse> getAllLists(HttpServletRequest req, HttpServletResponse res, TaskManagerRequest request) {
		String error = null;		
		Users user = (Users) req.getAttribute("user");
		
		if(user == null) {
			error = "userNotUthenticated";
			return ResponseEntity.status(401).body(null);
		}

		String ids = "";
		String names = "";
		int count = 0;
			
		List<ListProjects> allLists = listRepository.findByUserid(user.getId());
		
		
		
		for (ListProjects list: allLists){
			if(count == 0) {
				ids = ""+list.getId();
				names = ""+list.getProjectname();
				count++;
			}
			else{
				ids += "/"+list.getId();
				names += "/"+list.getProjectname();
				count++;
			}
		}
		
		
		String token = jwtService.getToken(user, request.getTiempo());
		Utils.setAccessToken(res, token, "ssid");
		
		

		TaskManagerResponse response = TaskManagerResponse
				.builder()
				.projects(ids)
				.listProjectName(names)
				.error(error)
				.build();

		return ResponseEntity.ok(response);	
	}
	
	
	
	
	
	
	
	
	
	
	public ResponseEntity<TaskManagerResponse> updateCalendarDate(HttpServletRequest req, HttpServletResponse res, TaskManagerRequest request) {
		String error = null;
		Users user = (Users) req.getAttribute("user");
		
		if(user == null) {
			error = "userNotUthenticated";
			return ResponseEntity.status(401).body(null);
		}

		String listProject = request.getListProject(); 
		String date = request.getDate(); 
		CalendarLists list;
		
		try {
			list = calendarListRepository.findByUseridAndDate(user.getId(),date).orElseThrow();
		}catch(Exception e) {
			CalendarLists newList = CalendarLists.builder()
					.project(request.getListProject())
					.userid(user.getId())
					.date(date)
					.build();
			
			calendarListRepository.save(newList);
			
			TaskManagerResponse response = TaskManagerResponse
					.builder()
					.error(error)
					.build();

			return ResponseEntity.ok(response);	
		}
		
		
		

		list.setProject(listProject);
		calendarListRepository.save(list);
		


		TaskManagerResponse response = TaskManagerResponse
				.builder()
				.error(error)
				.build();

		return ResponseEntity.ok(response);			
	}
	
	
	
	
	
	
	public ResponseEntity<TaskManagerResponse> getCalendarDate(HttpServletRequest req, HttpServletResponse res, TaskManagerRequest request) {
		String error = null;
		Users user = (Users) req.getAttribute("user");
		
		if(user == null) {
			error = "userNotUthenticated";
			return ResponseEntity.status(401).body(null);
		}

		String date = request.getDate();
		CalendarLists list;
		
		try {
			list = calendarListRepository.findByUseridAndDate(user.getId(),date).orElseThrow();
		}catch(Exception e) {
			error = "couldNotFoundAListForTheSpecifiedDate";
			return ResponseEntity.status(404).body(null);
		}
		
		TaskManagerResponse response = TaskManagerResponse
				.builder()
				.listProject(list.getProject())
				.build();
		

		return ResponseEntity.ok(response);		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}

