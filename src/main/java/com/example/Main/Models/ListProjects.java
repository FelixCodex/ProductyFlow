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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Table(name = "list_projects", uniqueConstraints = { @UniqueConstraint(columnNames = { "id" }) })
public class ListProjects {
	@Id
	@GeneratedValue
	Long id;

	@Column(nullable = false)
	Long userid;
	String projectname;

	@Column(columnDefinition = "MEDIUMTEXT")
	String project;
}
