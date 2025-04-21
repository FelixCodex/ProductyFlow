package com.example.Main.Requests;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskManagerRequest {
	Long listId;
	String listProject;
	String listProjectName;
	String lang;
	String date;
	String tiempo;

}
