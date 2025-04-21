package com.example.Main.Services;


import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.Main.Utils;
import com.example.Main.Models.LinkProjects;
import com.example.Main.Models.NodeProjects;
import com.example.Main.Models.Users;
import com.example.Main.Repositories.LinkRepository;
import com.example.Main.Repositories.NodeRepository;
import com.example.Main.Repositories.UserRepository;
import com.example.Main.Requests.NetworkRequest;
import com.example.Main.Responses.NetworkResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class NetworkService {


	private final UserRepository userRepository;
	private final NodeRepository nodeRepository;
	private final LinkRepository linkRepository;
	private final JwtService jwtService;
	
	
	

	public ResponseEntity<NetworkResponse> create(HttpServletRequest req, HttpServletResponse res, NetworkRequest request) {
		String error = null;
		Users user = (Users) req.getAttribute("user");
		
		if(user == null) {
			error = "userNotUthenticated";
			return ResponseEntity.status(401).body(null);
		}
		
		
		String ProjectName = "Untitled Project";
		if(request.getLang() == "es") {
			ProjectName = "Projecto sin nombre";
		}
		
		

		NodeProjects nodes = NodeProjects.builder()
							.userid(user.getId())
							.projectname(ProjectName)
							.project(null)
						    .build();
		

		try {
			nodeRepository.save(nodes);
		}catch(Exception e) {
			error = "repositoryCouldNotSave";
			return ResponseEntity.status(400).body(null);
		}
		
		NetworkResponse response = NetworkResponse
				.builder()
				.projects(nodes.getId().toString())
				.error(error)
				.build();
		
		return ResponseEntity.ok(response);
		
	}
	
	
	
	
	
	public ResponseEntity<NetworkResponse> getData(HttpServletRequest req, HttpServletResponse res, NetworkRequest request) {
		String error = null;
		
		Users user = (Users) req.getAttribute("user");
		
		if(user == null) {
			error = "userNotUthenticated";
			return ResponseEntity.status(401).body(null);
		}
		
		
		Long id = request.getNodeId();
		NodeProjects node;
		LinkProjects link;

		
		try {
			node = nodeRepository.findById(id).orElseThrow();
		}catch(Exception e) {
			error = "repositoryCouldNotFound";
			return ResponseEntity.status(400).body(null);
		}

		
		try {
			link = linkRepository.findByProjectid(id).orElseThrow();
		}catch(Exception e) {
			
			
			LinkProjects links = LinkProjects.builder()
					.projectid(node.getId())
					.project(null)
					.build();
			
			linkRepository.save(links);
			
			
			NetworkResponse response = NetworkResponse
					.builder()
					.nodeProject(node.getProject())
					.nodeProjectName(node.getProjectname())
					.linkProject(links.getProject())
					.build();
			
			return ResponseEntity.ok(response);
		}
		

		
		NetworkResponse response = NetworkResponse
				.builder()
				.nodeProject(node.getProject())
				.nodeProjectName(node.getProjectname())
				.linkProject(link.getProject())
				.build();
		
		
		return ResponseEntity.ok(response);
		
	}
	
	
	
	
	
	
	public ResponseEntity<NetworkResponse> update(HttpServletRequest req, HttpServletResponse res, NetworkRequest request) {
		String error = null;
		
		Users user = (Users) req.getAttribute("user");
		if(user == null) {
			error = "userNotAuthenticated";
			return ResponseEntity.status(401).body(null);
		}
		
		
		
		Long id = request.getNodeId();
		String nodeProject = request.getNodeProject(); 
		String linkProject = request.getLinkProject(); 
		NodeProjects nodes;
		LinkProjects links;
		
		
		try {
			nodes = nodeRepository.findById(id).orElseThrow();
		}catch(Exception e) {
			error = "nodeProjectNotFound";
			return ResponseEntity.status(404).body(null);
		}
		
		try {
			links = linkRepository.findByProjectid(id).orElseThrow();
		}catch(Exception e) {
			error = "linkProjectNotFound";
			return ResponseEntity.status(404).body(null);
		}
		
		
		if(nodes.getUserid() != user.getId()) {
			error = "userNotOwner";
			return ResponseEntity.status(403).body(null);
		}
		
		

		nodes.setProject(nodeProject);
		nodes.setProjectname(request.getNodeProjectName());
		links.setProject(linkProject);

		
		nodeRepository.save(nodes);
		linkRepository.save(links);
		
	
		
		NetworkResponse response = NetworkResponse
				.builder()
				.error(error)
				.build();
		
		return ResponseEntity.ok(response);
		
	}
	
	
	
	
	
	public ResponseEntity<NetworkResponse> delete(HttpServletRequest req, HttpServletResponse res, NetworkRequest request) {
		String error = null;
		Users user = (Users) req.getAttribute("user");
		if(user == null) {
			error = "userNotAuthenticated";
			return ResponseEntity.status(401).body(null);
		}
		
		Long id = request.getNodeId();
		NodeProjects nodeP;
		
		
		try {
			nodeP = nodeRepository.findById(id).orElseThrow();
			if(nodeP.getUserid() != user.getId()) {
				error = "userNotOwner";
				return ResponseEntity.status(403).body(null);
			}
		}catch(Exception e) {
			error = "nodeProjectNotFound";
			return ResponseEntity.status(404).body(null);
		}
		
		
		
		
		
		try {
			linkRepository.deleteByProjectid(id);
		}catch(Exception e) {
			error = "linkProjectNotFound";
			
			nodeRepository.delete(nodeP);
			
			NetworkResponse response = NetworkResponse
					.builder()
					.error(error)
					.build();
			
			return ResponseEntity.ok(response);
		}
		
		
		
		nodeRepository.delete(nodeP);
		
		NetworkResponse response = NetworkResponse
				.builder()
				.error(error)
				.build();
		
		return ResponseEntity.ok(response);
	}
	
	
	
	
	
	public ResponseEntity<NetworkResponse> getAllProjects(HttpServletRequest req, HttpServletResponse res, NetworkRequest request) {
		String error = null;
		Users user = (Users) req.getAttribute("user");

		if(user == null) {
			error = "userNotUthenticated";
			return ResponseEntity.status(401).body(null);
		}
		
		List<NodeProjects> allNodes;
		
		try {
			allNodes = nodeRepository.findByUserid(user.getId());
		}catch(Exception e) {
			error = "noProjectsFound";
			return ResponseEntity.status(404).body(null);
			
		}
		
		String ids = "";
		String names = "";
		int count = 0;
		
		for (NodeProjects node: allNodes){
			if(count == 0) {
				ids = ""+node.getId();
				names = ""+node.getProjectname();
				count++;
			}
			else{
				ids += "/"+node.getId();
				names += "/"+node.getProjectname();
				count++;
			}
		}
		
		String token = jwtService.getToken(user, request.getTiempo());
		Utils.setAccessToken(res, token, "ssid");
		
		NetworkResponse response = NetworkResponse
				.builder()
				.projects(ids)
				.nodeProjectName(names)
				.error(error)
				.build();
		
		return ResponseEntity.ok(response);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}
