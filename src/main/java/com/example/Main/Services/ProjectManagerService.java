package com.example.Main.Services;


import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.LinkedList;
import java.util.List;
import java.util.UUID;


import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.multipart.MultipartFile;

import com.example.Main.Utils;
import com.example.Main.Models.GroupCalendarListProjects;
import com.example.Main.Models.GroupListProjects;
import com.example.Main.Models.Groups;
import com.example.Main.Models.MemberLinks;
import com.example.Main.Models.Users;
import com.example.Main.Repositories.GroupCalendarListRepository;
import com.example.Main.Repositories.GroupListRepository;
import com.example.Main.Repositories.GroupRepository;
import com.example.Main.Repositories.MemberLinkRepository;
import com.example.Main.Repositories.UserRepository;
import com.example.Main.Requests.ProjectManagerRequest;
import com.example.Main.Responses.NetworkResponse;
import com.example.Main.Responses.ProjectManagerResponse;
import com.google.gson.Gson;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class ProjectManagerService {

	private final UserRepository userRepository;
	private final GroupRepository groupRepository;
	private final GroupListRepository groupListRepository;
	private final GroupCalendarListRepository groupCalendarListRepository;
	private final MemberLinkRepository memberLinkRepository;
	private final JwtService jwtService;
	private final SimpMessageSendingOperations messagingService;
	String Messagebroker = "/group/";

	
	
	
	
	
	

	public ResponseEntity<ProjectManagerResponse> createNewGroupWithImg(HttpServletRequest req, HttpServletResponse res, MultipartFile file, String request) {
		Users user = (Users) req.getAttribute("user");
		
		if(user == null) {
			return ResponseEntity.status(401).body(null);
		}
		
		String joinlink = UUID.randomUUID().toString();
		
		ProjectManagerRequest requestData = (ProjectManagerRequest) Utils.transformFromJson(request, ProjectManagerRequest.class);
		String GroupName = requestData.getGroupName();
		
		String filename = uploadFile(file, "groupImgs");
		
		
		Groups group = Groups.builder()
							.groupname(GroupName)
							.useradmin(user.getId())
							.joinlink(joinlink)
							.img(filename)
						    .build();

		try {
			groupRepository.save(group);
		}catch(Exception e) {
			return ResponseEntity.status(400).body(null);
		}
		
		
		ProjectManagerResponse response = ProjectManagerResponse
				.builder()
				.groupName(group.getGroupname())
				.groupId(group.getId())
				.build();

		return ResponseEntity.ok(response);
	}
	
	
	

	public ResponseEntity<ProjectManagerResponse> createNewGroup(HttpServletRequest req, HttpServletResponse res, ProjectManagerRequest request) {
		Users user = (Users) req.getAttribute("user");
		
		if(user == null) {
			return ResponseEntity.status(401).body(null);
		}
		String joinlink = UUID.randomUUID().toString();
		
		String GroupName = request.getGroupName();
		
		
		Groups group = Groups.builder()
							.groupname(GroupName)
							.useradmin(user.getId())
							.joinlink(joinlink)
							.img("group.jpg")
						    .build();

		try {
			groupRepository.save(group);
		}catch(Exception e) {
			return ResponseEntity.status(400).body(null);
		}
		
		
		ProjectManagerResponse response = ProjectManagerResponse
										.builder()
										.groupName(group.getGroupname())
										.groupId(group.getId())
										.build();
		
		return ResponseEntity.ok(response);
	}
	
	
	
	

	public ResponseEntity<ProjectManagerResponse> createNewGroupList(HttpServletRequest req, HttpServletResponse res, ProjectManagerRequest request) {
		String error = null;
		Users user = (Users) req.getAttribute("user");
		
		if(user == null) {
			return ResponseEntity.status(401).body(null);
		}
		
		String ListName = "Untitled Group List";
		Groups group;
		
		if(request.getLang().equals("es")) {
			ListName = "Lista sin nombre";
		}

		group = Utils.getGroupById(request.getGroupId().toString(),groupRepository);

		if(user.getId() != group.getUseradmin()) {
			return ResponseEntity.status(403).body(null);
		}
		

		GroupListProjects lists = GroupListProjects.builder()
							.groupid(group.getId())
							.projectname(ListName)
							.project(null)
						    .build();
		

		try {
			groupListRepository.save(lists);
		}catch(Exception e) {
			return ResponseEntity.status(400).body(null);
		}
		
		ProjectManagerResponse response = ProjectManagerResponse
				.builder()
				.projects(lists.getId().toString())
				.error(error)
				.build();

		return ResponseEntity.ok(response);
		
	}
	
	
	public ResponseEntity<ProjectManagerResponse> updateGroup(HttpServletRequest req, HttpServletResponse res, ProjectManagerRequest request) {
		String error = null;
		Users user = (Users) req.getAttribute("user");
		
		if(user == null) {
			error = "userNotUthenticated";
			return ResponseEntity.status(401).body(null);
		}
		
		String newName = request.getGroupName();
		Groups group = Utils.getGroupById(request.getGroupId().toString(),groupRepository);
		
		if(user.getId() != group.getUseradmin()) {
			error = "userIsNotAdmin";
			return ResponseEntity.status(403).body(null);
		}
		
		
		group.setGroupname(newName);
		
		try {
			groupRepository.save(group);
		}catch(Exception e) {
			error = "repositoryCouldNotSave";
			return ResponseEntity.status(400).body(null);
		}
		
		ProjectManagerResponse response = ProjectManagerResponse
				.builder()
				.error(error)
				.build();
		

		return ResponseEntity.ok(response);
		
	}
	
	
	public ResponseEntity<ProjectManagerResponse> updateGroupWithImg(HttpServletRequest req, HttpServletResponse res, MultipartFile file ,String requestData) {
		ProjectManagerRequest request = (ProjectManagerRequest) Utils.transformFromJson(requestData, ProjectManagerRequest.class);
		
		
		String error = null;
		String newName = request.getGroupName();
		String newImg = null;
		Groups group = Utils.getGroupById(request.getGroupId().toString(),groupRepository);
		Users user = (Users) req.getAttribute("user");
		
		if(user == null) {
			error = "userNotUthenticated";
			return ResponseEntity.status(401).body(null);
		}
		
		if(user.getId() != group.getUseradmin()) {
			error = "userIsNotAdmin";
			return ResponseEntity.status(403).body(null);
		}
		
		if(group.getImg() == "group.jpg" && !file.equals("null")) {
			newImg = uploadFile(file, "groupImgs");
		}
		
		
		else if(group.getImg() != "group.jpg" && !file.equals("null")) {
			try {
				Path path = Paths.get("src/main/resources/groupImgs/"+ group.getImg());
				Files.deleteIfExists(path);
			}catch(Exception e) {
				error = "errorWhileDeletingFile";
				return ResponseEntity.status(400).body(null);
			}
			
			newImg = uploadFile(file, "groupImgs");
		}
		
		group.setGroupname(newName);
		if(!newImg.equals("null")) {
			group.setImg(newImg);
		}
		
		
		groupRepository.save(group);
		
		
		ProjectManagerResponse response = ProjectManagerResponse
				.builder()
				.error(error)
				.img(newImg)
				.build();
		

		return ResponseEntity.ok(response);
	}
	
	
	
	
	
	

	
	public ResponseEntity<ProjectManagerResponse> updateGroupList(HttpServletRequest req, HttpServletResponse res, ProjectManagerRequest request) {
		Users user = (Users) req.getAttribute("user");
		
		if(user == null) {
			return ResponseEntity.status(401).body(null);
		}
		Long id = request.getGroupListId();
		String listProject = request.getListProject(); 
		GroupListProjects list;
		
		
		try {
			list = groupListRepository.findById(id.toString()).orElseThrow();
		}catch(Exception e) {
			return ResponseEntity.status(400).body(null);
		}
		

		list.setProject(listProject);
		list.setProjectname(request.getListProjectName());

		try {
			groupListRepository.save(list);
		}catch(Exception e) {
			return ResponseEntity.status(400).body(null);
		}
		
		String mess = "{\"listProject\":"+list.getProject()+",\"listProjectName\":\""+list.getProjectname()+"\",\"userId\":\""+user.getId()+"\"}";
		
		messagingService.convertAndSend( Messagebroker+list.getId() , mess);
		
		
		ProjectManagerResponse response = ProjectManagerResponse
				.builder()
				.build();

		return ResponseEntity.ok(response);
	}
	
	
	
	public ResponseEntity<ProjectManagerResponse> changeMemberPermiss(HttpServletRequest req, HttpServletResponse res, ProjectManagerRequest request) {
		String error = null;
		Users user = (Users) req.getAttribute("user");
		
		if(user == null) {
			error = "userNotUthenticated";
			return ResponseEntity.status(401).body(null);
		}
		
		Groups group = Utils.getGroupById(request.getGroupId().toString(),groupRepository);
		MemberLinks link ;
		
		
		if(user.getId() != group.getUseradmin()) {
			error = "userIsNotAdmin";
			return ResponseEntity.status(403).body(null);
		}
		
		
		try {
			link = memberLinkRepository.findByGroupidAndUserid(group.getId(), request.getMemberId()).orElseThrow();
		}catch(Exception e) {
			error = "errorFindingMember";
			return ResponseEntity.status(404).body(null);
		}
		
		link.setPermis(request.getPermis());
		

		try {
			memberLinkRepository.save(link);
		}catch(Exception e) {
			error = "errorSavingLink";
			return ResponseEntity.status(400).body(null);
		}
		
		ProjectManagerResponse response = ProjectManagerResponse
				.builder()
				.error(error)
				.build();

		return ResponseEntity.ok(response);
		
	}
	
	
	
	
	public ResponseEntity<ProjectManagerResponse> getGroupListData(HttpServletRequest req, HttpServletResponse res, ProjectManagerRequest request) {
		Users user = (Users) req.getAttribute("user");
		
		if(user == null) {
			return ResponseEntity.status(401).body(null);
		}
		
		Long id = request.getGroupListId();
		GroupListProjects list;
		
		
		
		try {
			list = groupListRepository.findById(id.toString()).orElseThrow();
		}catch(Exception e) {
			return ResponseEntity.status(404).body(null);
		}
		
		ProjectManagerResponse response = ProjectManagerResponse
				.builder()
				.listProject(list.getProject())
				.listProjectName(list.getProjectname())
				.build();
		
		return ResponseEntity.ok(response);
		
	}
	
	
	public ResponseEntity<ProjectManagerResponse> getAllGroupLists(HttpServletRequest req, HttpServletResponse res, ProjectManagerRequest request) {
		String error = null;
		Users user = (Users) req.getAttribute("user");
		
		if(user == null) {
			error = "userNotAuthenticated";
			return ResponseEntity.status(401).body(null);
		}
		
		String ids = "";
		String names = "";
		int count = 0;
		Groups group;
		String admin = "false";
		String permis = "0";
		
		
		
		group = Utils.getGroupById(request.getGroupId().toString(),groupRepository);
		
		
		try{
			if(!(group.getUseradmin() == user.getId())) {
				MemberLinks link = memberLinkRepository.findByGroupidAndUserid(group.getId(), user.getId()).orElseThrow();
				permis = link.getPermis()+"";
			}
			
		}catch(Exception e) {
			error = "userDoesNotBelong";
			return ResponseEntity.status(403).body(null);
		}
			
		List<GroupListProjects> allLists = groupListRepository.findByGroupid(group.getId());
		
		
		
		for (GroupListProjects list: allLists){
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
		
		if(user.getId() == group.getUseradmin()) {
			admin = "true";
		}
		
		
		ProjectManagerResponse response = ProjectManagerResponse
				.builder()
				.projects(ids)
				.listProjectName(names)
				.admin(admin)	
				.membersPermis(permis)
				.error(error)
				.build();

		return ResponseEntity.ok(response);
	}
	
	
	public ResponseEntity<ProjectManagerResponse> getAllGroups(HttpServletRequest req, HttpServletResponse res, ProjectManagerRequest request) {
		String error = null;

		
		Users user = (Users) req.getAttribute("user");
		
		if(user == null) {
			return ResponseEntity.status(401).body(null);
		}
		
		String ids = "";
		String names = "";
		int count = 0;
		
		List<Groups> allGroups = new LinkedList<>();
		
		
		
		
			
		List<MemberLinks> allLinks = memberLinkRepository.findByUserid(user.getId());
		List<Groups> allAdminGroups = groupRepository.findByUseradmin(user.getId());
		
		
		for(Groups group: allAdminGroups) {
			try {
				allGroups.add(group);
			}catch(Exception e) {
				return ResponseEntity.status(404).body(null);
			}
		}

		
		for(MemberLinks link: allLinks) {
			try {
				Groups group = groupRepository.findById(link.getGroupid().toString()).orElseThrow();
				allGroups.add(group);
			}catch(Exception e) {
				return ResponseEntity.status(404).body(null);
			}
			
		}
		
		if(allGroups.isEmpty()) {
			return ResponseEntity.status(404).body(null);
		}
		
		for (Groups group: allGroups){
			if(count == 0) {
				ids = ""+group.getId();
				names = ""+group.getGroupname();
				count++;
			}
			else{
				ids += "/"+group.getId();
				names += "/"+group.getGroupname();
				count++;
			}
		}
		
		String token = jwtService.getToken(user, request.getTiempo());
		Utils.setAccessToken(res, token, "ssid");
		
		ProjectManagerResponse response = ProjectManagerResponse
				.builder()
				.groups(ids)
				.groupNames(names)
				.userId(user.getId().toString())
				.error(error)
				.build();
		
		
		
		return ResponseEntity.ok(response);
	}
	
	
	
	
	
	public ResponseEntity<ProjectManagerResponse> deleteGroupList(HttpServletRequest req, HttpServletResponse res, ProjectManagerRequest request) {
		String error = null;
		Users user = (Users) req.getAttribute("user");
		
		if(user == null) {
			error = "userNotUthenticated";
			return ResponseEntity.status(401).body(null);
		}
		
		Groups group = Utils.getGroupById(request.getGroupId().toString(),groupRepository);
		
		if(user.getId() != group.getUseradmin()) {
			error = "userIsNotAdmin";
			return ResponseEntity.status(403).body(null);
		}
		
		
		
		Long id = request.getGroupListId();
		GroupListProjects list;
		
		
		
		try {
			list = groupListRepository.findById(id.toString()).orElseThrow();
		}catch(Exception e) {
			error = "repositoryCouldNotFind";
			System.out.println("repositoryCouldNotFind");
			return ResponseEntity.status(404).body(null);
		}
		
		if(list.getGroupid() == group.getId()) {
			try {
				groupListRepository.deleteById(id);
			}catch(Exception e) {
				error = "repositoryCouldNotDelete";
				return ResponseEntity.status(400).body(null);
			}
		}
		
		ProjectManagerResponse response = ProjectManagerResponse
				.builder()
				.error(error)
				.build();

		return ResponseEntity.ok(response);
	}
	
	

	public ResponseEntity<ProjectManagerResponse> deleteGroup(HttpServletRequest req, HttpServletResponse res, ProjectManagerRequest request) {
		String error = null;
		
		Users user = (Users) req.getAttribute("user");
		
		if(user == null) {
			error = "userNotUthenticated";
			return ResponseEntity.status(401).body(null);
		}
		
		Groups group;
		List<MemberLinks> links;
		List<GroupListProjects> lists;
		
		group = Utils.getGroupById(request.getGroupId().toString(),groupRepository);
		
		if(user.getId() != group.getUseradmin()) {
			error = "userIsNotAdmin";
			return ResponseEntity.status(403).body(null);
		}
		
		try {
			links = memberLinkRepository.findByGroupid(group.getId());
		}catch(Exception e) {
			error = "repositoryCouldNotFind";
			return ResponseEntity.status(404).body(null);
		}
		
		for(MemberLinks link: links) {
			try {
				memberLinkRepository.delete(link);
			}catch(Exception e) {
				error = "repositoryCouldNotDeleteLink";
				return ResponseEntity.status(400).body(null);
			}
		}
		
		try {
			lists = groupListRepository.findByGroupid(group.getId());
		}catch(Exception e) {
			error = "repositoryCouldNotFind";
			return ResponseEntity.status(404).body(null);
		}
		
		for(GroupListProjects link: lists) {
			try {
				groupListRepository.delete(link);
			}catch(Exception e) {
				error = "repositoryCouldNotDeleteList";
				return ResponseEntity.status(400).body(null);
			}
		}
		
		try {
			groupRepository.delete(group);
		}catch(Exception e) {
			error = "repositoryCouldNotDeleteGroup";
			return ResponseEntity.status(400).body(null);
		}
		
		
		ProjectManagerResponse response = ProjectManagerResponse
				.builder()
				.error(error)
				.build();
		
		return ResponseEntity.ok(response);
	}
	
	
	
	
	
	public ResponseEntity<ProjectManagerResponse> updateGroupCalendarDate(HttpServletRequest req, HttpServletResponse res, ProjectManagerRequest request) {
		String error = null;
		
		Users user = (Users) req.getAttribute("user");
		
		if(user == null) {
			error = "userNotUthenticated";
			return ResponseEntity.status(401).body(null);
		}
		
		String listProject = request.getListProject(); 
		String date = request.getDate(); 
		GroupCalendarListProjects list;
		Groups group;	
		

		group = Utils.getGroupById(request.getGroupId().toString(),groupRepository);
		
		try {
			list = groupCalendarListRepository.findByGroupidAndDate(group.getId(),date).orElseThrow();
		}catch(Exception e) {
			GroupCalendarListProjects newList = GroupCalendarListProjects.builder()
					.project(request.getListProject())
					.groupid(group.getId())
					.date(date)
					.build();
			
			groupCalendarListRepository.save(newList);
			
			ProjectManagerResponse response = ProjectManagerResponse.builder().error(error).build();

			return ResponseEntity.ok(response);
		}
		
		
		list.setProject(listProject);
		groupCalendarListRepository.save(list);
		
		ProjectManagerResponse response = ProjectManagerResponse
				.builder()
				.error(error)
				.build();

		return ResponseEntity.ok(response);
		
	}
	
	

	
	public ResponseEntity<ProjectManagerResponse> getGroupCalendarDate(HttpServletRequest req, HttpServletResponse res, ProjectManagerRequest request) {
		String error = null;
		
		Users user = (Users) req.getAttribute("user");
		
		if(user == null) {
			error = "userNotUthenticated";
			return ResponseEntity.status(401).body(null);
		}
		
		String date = request.getDate();
		GroupCalendarListProjects list;
		Groups group = Utils.getGroupById(request.getGroupId().toString(),groupRepository);
		
		try {
			list = groupCalendarListRepository.findByGroupidAndDate(group.getId(),date).orElseThrow();
		}catch(Exception e) {
			error = "couldNotFoundAListForTheSpecifiedDate";
			return ResponseEntity.status(404).body(null);
		}
		
		ProjectManagerResponse response = ProjectManagerResponse
				.builder()
				.listProject(list.getProject())
				.build();

		return ResponseEntity.ok(response);
		
	}
	
	public ResponseEntity<ProjectManagerResponse> leaveGroup(HttpServletRequest req, HttpServletResponse res, ProjectManagerRequest request) {
		String error = null;
		
		
		Users user = (Users) req.getAttribute("user");
		
		if(user == null) {
			error = "userNotUthenticated";
			return ResponseEntity.status(401).body(null);
		}
		
		Groups group = Utils.getGroupById(request.getGroupId().toString(),groupRepository);
		
		if(user.getId() == group.getUseradmin()) {
			error = "userCannotLeaveOwnGroup";
			return ResponseEntity.status(406).body(null);
		}
		
		
		try{
			MemberLinks link = memberLinkRepository.findByGroupidAndUserid(group.getId(), user.getId()).orElseThrow();

			memberLinkRepository.delete(link);
			
		}catch(Exception e) {
			error = "repositoryCouldNotDelete";
			return ResponseEntity.status(400).body(null);
		}
		
		ProjectManagerResponse response = ProjectManagerResponse
				.builder()
				.error(error)
				.build();
		return ResponseEntity.ok(response);
		
	}
	
	
	
	
	

	
	public ResponseEntity<ProjectManagerResponse> joinGroup(HttpServletRequest req, HttpServletResponse res, ProjectManagerRequest request) {
		String error = null;
		Users user = (Users) req.getAttribute("user");
		
		if(user == null) {
			error = "userNotUthenticated";
			return ResponseEntity.status(401).body(null);
		}
		
		String joinlink = request.getJoinlink();
		Groups group;
		List<MemberLinks> links;
		
		
		
		try{
			group = groupRepository.findByJoinlink(joinlink).orElseThrow();
		}catch(Exception e) {
			error = "repositoryCouldNotFindSpecifiedGroup";
			return ResponseEntity.status(404).body(null);
		}
		
		try {
			links = memberLinkRepository.findByUserid(user.getId());
		}catch(Exception e) {
			error = "errorFindingLinks";
			return ResponseEntity.status(400).body(null);
		}

		
		for(MemberLinks link: links) {
			if(group.getId().equals(link.getGroupid())) {
				error = "userAlreadyBelongToThatGroup";
				return ResponseEntity.status(406).body(null);
			}
		}
		
		
		MemberLinks link = MemberLinks.builder()
				.userid(user.getId())
				.groupid(group.getId())
				.permis(1)
				.build();
		
		memberLinkRepository.save(link);
		
		
		ProjectManagerResponse response = ProjectManagerResponse
				.builder()
				.error(error)
				.groupName(group.getGroupname())
				.groupId(group.getId())
				.build();

		return ResponseEntity.ok(response);
		
	}
	
	
	
	
	


	public ResponseEntity<ProjectManagerResponse> getMembers(HttpServletRequest req, HttpServletResponse res, ProjectManagerRequest request) {
		String error = null;
		Users userToAuth = (Users) req.getAttribute("user");
		
		if(userToAuth == null) {
			error = "userNotUthenticated";
			return ResponseEntity.status(401).body(null);
		}
		
		List<MemberLinks> links;
		String membersId;
		String membersName;
		String membersPermis;
		int membersAmount;
		Users admin;
		Groups group = Utils.getGroupById(request.getGroupId().toString(),groupRepository);
		
		
		
		try {
			links = memberLinkRepository.findByGroupid(request.getGroupId());
		}catch(Exception e) {
			error = "errorFindingLinks";
			return ResponseEntity.status(400).body(null);
		}


		try {
			admin = userRepository.findById(group.getUseradmin().toString()).orElseThrow();
		}catch(Exception e) {
			error = "errorFindingUser";
			return ResponseEntity.status(400).body(null);
		}
		
		membersId = admin.getId()+"";
		membersName = admin.getUsername();
		membersPermis = "4";
		membersAmount = 1;
		
		
		for(MemberLinks link: links) {
			Users user;
			try {
				user = userRepository.findById(link.getUserid().toString()).orElseThrow();
				membersId += "/"+user.getId();
				membersName += "/"+user.getUsername();
				membersPermis += "/"+link.getPermis();
			}catch(Exception e) {
				error = "errorFindingUser";
				return ResponseEntity.status(400).body(null);
			}
			membersAmount++;
			
			
		}
		
		
		ProjectManagerResponse response = ProjectManagerResponse
				.builder()
				.error(error)
				.membersId(membersId)
				.membersName(membersName)
				.membersPermis(membersPermis)
				.groupJoinlink(group.getJoinlink())
				.build();

		return ResponseEntity.ok(response);
		
	}
	
	
	
	
	

	public ResponseEntity<ProjectManagerResponse> inviteUser(HttpServletRequest req, HttpServletResponse res, ProjectManagerRequest request) {
		String error = null;

		Users userAdder = (Users) req.getAttribute("user");
		
		if(userAdder == null) {
			error = "userNotUthenticated";
			return ResponseEntity.status(401).body(null);
		}
		
		Groups group = Utils.getGroupById(request.getGroupId().toString(),groupRepository);
		MemberLinks adderLink;
		Users userToAdd;
		
		if(userAdder.getId() != group.getUseradmin()) {
			try {
				adderLink = memberLinkRepository.findByGroupidAndUserid(group.getId(), userAdder.getId()).orElseThrow();
			}catch(Exception e) {
				error = "errorFindingAdderLink";
				return ResponseEntity.status(400).body(null);
			}
			if(!(adderLink.getPermis() >= 3)) {
				error = "adderDoesNotHavePermis";
				return ResponseEntity.status(403).body(null);
			}
		}
		

		try {
			userToAdd = userRepository.findByUsername(request.getUserName()).orElseThrow();
		}catch(Exception e) {
			error = "errorFindingUser";
			return ResponseEntity.status(400).body(null);
		}
		
		
		try {
			adderLink = memberLinkRepository.findByGroupidAndUserid(group.getId(), userToAdd.getId()).orElseThrow();
			
			error = "userAlreadyBelongToTheGroup";
			return ResponseEntity.status(406).body(null);
		}catch(Exception e) {
		}
		
		
		MemberLinks link = MemberLinks.builder()
				.userid(userToAdd.getId())
				.groupid(group.getId())
				.permis(1)
				.build();
		
		try {
			memberLinkRepository.save(link);
		}catch(Exception e) {
			error = "errorSavingLink";
			return ResponseEntity.status(400).body(null);
		}
		
		ProjectManagerResponse response = ProjectManagerResponse
				.builder()
				.error(error)
				.build();

		return ResponseEntity.ok(response);
		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	public ResponseEntity<LinkedMultiValueMap<String, Object>> getGroupImg(HttpServletRequest req, HttpServletResponse res, String id, String imgName, String defaultImg) {
		Groups group = Utils.getGroupById(id,groupRepository);
		LinkedMultiValueMap<String, Object> formData = new LinkedMultiValueMap<String, Object>();

		if (group == null) {
	        formData.add("log", "grupoNoEncontrado");
			return ResponseEntity.ok(formData);
	    }

		
		if((imgName == null || imgName.equals("null")) && (defaultImg == null || defaultImg.equals("null")) && group.getImg().equals("group.jpg")) {
	        formData.add("log", "defaultGroupImgReturned");
			return getImgFromFolder(formData, group.getImg());
		}
		
		if((imgName == null || imgName.equals("null")) && defaultImg.equals("default") && group.getImg().equals("group.jpg")) {
	        formData.add("log", "groupImgIsDefault");
			return ResponseEntity.ok(formData);
		}
		

		if((imgName == null || imgName.equals("null")) && !group.getImg().equals("group.jpg")) {
			return getImgFromFolder(formData, group.getImg());
		}
		
		if(!(imgName == null || imgName.equals("null")) && group.getImg().equals(imgName)) {
			formData.add("log", "imageIsTheSame");
			return ResponseEntity.ok(formData);
		}
		
		return getImgFromFolder(formData, group.getImg());
		
	}
	
	
	
	
	
	
	public ResponseEntity<ProjectManagerResponse> updateMemberPermiss(HttpServletRequest req, HttpServletResponse res, ProjectManagerRequest request) {
		String error = null;
		Users useradmin = (Users) req.getAttribute("user");
		
		if(useradmin == null) {
			error = "userNotUthenticated";
			return ResponseEntity.status(401).body(null);
		}
		
		Groups group = Utils.getGroupById(request.getGroupId().toString(),groupRepository);
		MemberLinks link;
		
		
		if(useradmin.getId() != group.getUseradmin()) {
			error = "userIsNotAdmin";
			return ResponseEntity.status(403).body(null);
		}
		
		
		try {
			link = memberLinkRepository.findByGroupidAndUserid(request.getGroupId(), request.getMemberId()).orElseThrow();
		}catch(Exception e) {
			error = "errorFindingLink";
			return ResponseEntity.status(400).body(null);
		}

		link.setPermis(request.getPermis());

		try {
			memberLinkRepository.save(link);
		}catch(Exception e) {
			error = "errorSavingLink";
			return ResponseEntity.status(400).body(null);
		}
		
		
		ProjectManagerResponse response = ProjectManagerResponse
				.builder()
				.error(error)
				.build();

		return ResponseEntity.ok(response);
		
	}
	
	
	

	
	public ResponseEntity<ProjectManagerResponse> kickMember(HttpServletRequest req, HttpServletResponse res, ProjectManagerRequest request) {
		String error = null;
		Users admin = (Users) req.getAttribute("user");
		
		if(admin == null) {
			error = "userNotUthenticated";
			return ResponseEntity.status(401).body(null);
		}
		
		Groups group = Utils.getGroupById(request.getGroupId().toString(),groupRepository);
		
		if(admin.getId() != group.getUseradmin()) {
			error = "userIsNotAdmin";
			return ResponseEntity.status(403).body(null);
		}
		
		if(request.getMemberId() == group.getUseradmin()) {
			error = "adminCannotLeaveOwnGroup";
			return ResponseEntity.status(406).body(null);
		}
		
		
		try{
			MemberLinks link = memberLinkRepository.findByGroupidAndUserid(group.getId(), request.getMemberId()).orElseThrow();

			memberLinkRepository.delete(link);
			
		}catch(Exception e) {
			error = "repositoryCouldNotDelete";
			return ResponseEntity.status(400).body(null);
		}
		
		
		ProjectManagerResponse response = ProjectManagerResponse
				.builder()
				.error(error)
				.build();

		return ResponseEntity.ok(response);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	public ResponseEntity<LinkedMultiValueMap<String, Object>> getImgFromFolder(LinkedMultiValueMap<String, Object> formData, String img) {
		try {
			File imageFile = new File("src/main/resources/groupImgs/" + img);
	        
			
	        if (!imageFile.exists()) {
	            formData.add("log", "Imagen no encontrada");
	    		return ResponseEntity.ok(formData);
	        }
	        
	        formData.add("file", new FileSystemResource(imageFile));
	        
		}catch(Exception e) {
			formData.add("log", "Error al procesar la imagen");
			return ResponseEntity.status(400).body(null);
		}
		
		return ResponseEntity.ok(formData);
	}
	
	
	


	public String uploadFile(MultipartFile requestFile, String pathFolder ) {
		String error = null;
		String newFileName;
		
		try {
			MultipartFile file = requestFile;
			
			String fileName = UUID.randomUUID().toString();
			byte[] bytes = file.getBytes();
			String fileOgName = file.getOriginalFilename();
			
			long fileSize = file.getSize();
			long maxFileSize = 5 *1024 * 1024;
			
			if(fileSize > maxFileSize) {
				error = "fileMustBeLessThan5Mb";
				return error;
			}
			
			if(!fileOgName.endsWith(".jpg") &&
			   !fileOgName.endsWith(".jpeg") &&
			   !fileOgName.endsWith(".png")){
				error = "fileExtensionNotSupported";
				return error;
			}
			
			
			String fileExtension = fileOgName.substring(fileOgName.lastIndexOf("."));
			newFileName = fileName + fileExtension;
			
			File folder = new File("src/main/resources/"+pathFolder);
			
			if(!folder.exists()) {
				folder.mkdirs();
			}
			
			Path path = Paths.get("src/main/resources/"+pathFolder+"/"+ newFileName);
			Files.write(path, bytes);
			
		}catch(Exception e) {
			error = "errorUploadingImg";
			return error;
		}
		return newFileName;
		
	}
	
	
}
