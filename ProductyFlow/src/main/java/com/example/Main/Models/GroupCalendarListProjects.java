package com.example.Main.Models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "group_calendar_list_projects", uniqueConstraints = { @UniqueConstraint(columnNames = { "id" }) })
public class GroupCalendarListProjects {

	@Id
	@GeneratedValue
	Long id;

	@Column(nullable = false)
	Long groupid;
	String date;

	@Column(columnDefinition = "MEDIUMTEXT")
	String project;

}
