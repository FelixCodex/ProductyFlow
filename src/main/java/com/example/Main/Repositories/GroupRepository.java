package com.example.Main.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Main.Models.Groups;
import com.example.Main.Models.ListProjects;
import com.example.Main.Models.Users;

@org.springframework.stereotype.Repository
public interface GroupRepository extends JpaRepository<Groups, String> {

	Optional<Groups> findByJoinlink(String link);
	List<Groups> findByUseradmin(Long id);
}
