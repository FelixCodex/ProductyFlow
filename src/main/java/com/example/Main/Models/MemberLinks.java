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
@Table(name = "member_link", uniqueConstraints = { @UniqueConstraint(columnNames = { "id" }) })
public class MemberLinks {

	@Id
	@GeneratedValue
	Long id;

	@Column(nullable = false)
	Long userid;
	Long groupid;
	int permis;
}
