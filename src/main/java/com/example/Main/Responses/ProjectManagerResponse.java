package com.example.Main.Responses;

import org.springframework.web.multipart.MultipartFile;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectManagerResponse {
	String projects;
	String listProject;
	String listProjectName;
	String groups;
	String groupNames;
	String groupName;
	String groupJoinlink;
	Long groupId;
	String admin;
	String membersId;
	String membersName;
	String membersPermis;
	String userId;
	String img;
	String error;
}
