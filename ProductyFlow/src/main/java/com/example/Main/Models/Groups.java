package com.example.Main.Models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Table(name = "project_groups", uniqueConstraints = { @UniqueConstraint(columnNames = { "id" }) })
public class Groups {
	@Id
	@GeneratedValue
	@Column(name = "id", unique = true, nullable = false)
	Long id;

	Long useradmin;

	@Column(nullable = false)
	String groupname;
	String joinlink;
	String img;

	public Groups(String groupname, String joinlink, Long useradmin) {
		super();
		this.groupname = groupname;
		this.joinlink = joinlink;
		this.useradmin = useradmin;
	}

}
