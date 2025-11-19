package com.example.Main.Controllers;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.Main.Requests.ProjectManagerRequest;
import com.example.Main.Responses.ProjectManagerResponse;
import com.example.Main.Services.ProjectManagerService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/pm")
@RequiredArgsConstructor
public class ProjectManagerController {

	
	private final ProjectManagerService projectManagerService;
	

	
	
	
	@PostMapping(value = "createGroupImg")
	public ResponseEntity<ProjectManagerResponse> createGroupImg
	(HttpServletRequest req, HttpServletResponse res, @RequestParam("file") MultipartFile file, @RequestParam("content") String request) {

		return projectManagerService.createNewGroupWithImg(req, res, file,request);
    }
	
	
	@PostMapping(value = "createGroup")
	public ResponseEntity<ProjectManagerResponse> createGroup
	(HttpServletRequest req, HttpServletResponse res, @RequestBody ProjectManagerRequest request) {

		return projectManagerService.createNewGroup(req, res, request);
    }

	
	@PostMapping(value = "updateGroup")
	public ResponseEntity<ProjectManagerResponse> updateGroup
	(HttpServletRequest req, HttpServletResponse res, @RequestBody ProjectManagerRequest request) {

		return projectManagerService.updateGroup(req, res, request);
    }

	
	@PostMapping(value = "updateGroupImg")
	public ResponseEntity<ProjectManagerResponse> updateGroupWithImg
	(HttpServletRequest req, HttpServletResponse res, @RequestParam("file") MultipartFile file, @RequestParam("content") String request) {

		return projectManagerService.updateGroupWithImg(req, res, file,request);
    }
	
	
	@PostMapping(value = "getAllGroups")
	public ResponseEntity<ProjectManagerResponse> allGroups
	(HttpServletRequest req, HttpServletResponse res, @RequestBody ProjectManagerRequest request) {
		
		return projectManagerService.getAllGroups(req, res, request);
    }
	
	
	@PostMapping(value = "changeMemberPermiss")
	public ResponseEntity<ProjectManagerResponse> changeMemberPermiss
	(HttpServletRequest req, HttpServletResponse res, @RequestBody ProjectManagerRequest request) {

		return projectManagerService.changeMemberPermiss(req, res, request);
    }

	
	
	@PostMapping(value = "deleteGroup")
	public ResponseEntity<ProjectManagerResponse> deleteGroup
	(HttpServletRequest req, HttpServletResponse res, @RequestBody ProjectManagerRequest request) {

		return projectManagerService.deleteGroup(req, res, request);
	}

	
	
	@PostMapping(value = "leaveGroup")
	public ResponseEntity<ProjectManagerResponse> leaveGroup
	(HttpServletRequest req, HttpServletResponse res, @RequestBody ProjectManagerRequest request) {

		return projectManagerService.leaveGroup(req, res, request);
	}


	
	
	@PostMapping(value = "createGroupList")
	public ResponseEntity<ProjectManagerResponse> createGroupList
	(HttpServletRequest req, HttpServletResponse res, @RequestBody ProjectManagerRequest request) {

		return projectManagerService.createNewGroupList(req, res, request);
    }

	
	@PostMapping(value = "getGroupListData")
	public ResponseEntity<ProjectManagerResponse> groupListData
	(HttpServletRequest req, HttpServletResponse res, @RequestBody ProjectManagerRequest request) {

		return projectManagerService.getGroupListData(req, res, request);
    }
	
	
	@PostMapping(value = "getAllGroupLists")
	public ResponseEntity<ProjectManagerResponse> allGroupLists
	(HttpServletRequest req, HttpServletResponse res, @RequestBody ProjectManagerRequest request) {

		return projectManagerService.getAllGroupLists(req, res, request);
    }
	
	
	@PostMapping(value = "updateGroupList")
	public ResponseEntity<ProjectManagerResponse> updateGroupList
	(HttpServletRequest req, HttpServletResponse res, @RequestBody ProjectManagerRequest request) {

		return projectManagerService.updateGroupList(req, res, request);
	}

	
	
	@PostMapping(value = "deleteGroupList")
	public ResponseEntity<ProjectManagerResponse> deleteGroupList
	(HttpServletRequest req, HttpServletResponse res, @RequestBody ProjectManagerRequest request) {

		return projectManagerService.deleteGroupList(req, res, request);
	}

	
	
	@PostMapping(value = "getGroupCalendarDate")
	public ResponseEntity<ProjectManagerResponse> getGroupCalendarDate
	(HttpServletRequest req, HttpServletResponse res, @RequestBody ProjectManagerRequest request) {

		return projectManagerService.getGroupCalendarDate(req, res, request);
    }
	
	
	@PostMapping(value = "updateGroupCalendarDate")
	public ResponseEntity<ProjectManagerResponse> updateGroupCalendarDate
	(HttpServletRequest req, HttpServletResponse res, @RequestBody ProjectManagerRequest request) {

		return projectManagerService.updateGroupCalendarDate(req, res, request);
	}
	
	
	@PostMapping(value = "joinGroup")
	public ResponseEntity<ProjectManagerResponse> joinGroup
	(HttpServletRequest req, HttpServletResponse res, @RequestBody ProjectManagerRequest request) {

		return projectManagerService.joinGroup(req, res, request);
	}


	@PostMapping(value = "getGroupImg",produces = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<LinkedMultiValueMap<String, Object>> getGroupImg
	(HttpServletRequest req, HttpServletResponse res, @RequestParam("id") String id, @RequestParam("imgname") String imgName, @RequestParam("defaultImg") String defaultImg) {
		return projectManagerService.getGroupImg(req, res, id, imgName, defaultImg);
	}

	
	@PostMapping(value = "getMembers")
	public ResponseEntity<ProjectManagerResponse> getMembers
	(HttpServletRequest req, HttpServletResponse res, @RequestBody ProjectManagerRequest request) {

		return projectManagerService.getMembers(req, res, request);
	}

	
	@PostMapping(value = "updateMemberPermiss")
	public ResponseEntity<ProjectManagerResponse> updateMemberPermiss
	(HttpServletRequest req, HttpServletResponse res, @RequestBody ProjectManagerRequest request) {

		return projectManagerService.updateMemberPermiss(req, res, request);
	}
	
	
	@PostMapping(value = "kickMember")
	public ResponseEntity<ProjectManagerResponse> kickMember
	(HttpServletRequest req, HttpServletResponse res, @RequestBody ProjectManagerRequest request) {

		return projectManagerService.kickMember(req, res, request);
	}

	
	@PostMapping(value = "inviteUser")
	public ResponseEntity<ProjectManagerResponse> inviteUser
	(HttpServletRequest req, HttpServletResponse res, @RequestBody ProjectManagerRequest request) {

		return projectManagerService.inviteUser(req, res, request);
	}
	
}
