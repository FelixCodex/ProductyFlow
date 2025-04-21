package com.example.Main.Requests;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NetworkRequest {
	Long nodeId;
	String nodeProject;
	String nodeProjectName;
	String linkProject;
	String lang;
	String tiempo;

}
