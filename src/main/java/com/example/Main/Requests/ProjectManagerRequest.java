package com.example.Main.Requests;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectManagerRequest {
	Long groupListId;
	Long groupId;
	Long memberId;
	String userName;
	int permis;
	String groupName;
	String listProject;
	String listProjectName;
	String date;
	String lang;
	String tiempo;
	String userId;
	String joinlink;

}
