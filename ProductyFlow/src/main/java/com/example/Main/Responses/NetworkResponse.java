package com.example.Main.Responses;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NetworkResponse {
	String projects;
	String nodeProject;
	String nodeProjectName;
	String linkProject;
	String error;

}
