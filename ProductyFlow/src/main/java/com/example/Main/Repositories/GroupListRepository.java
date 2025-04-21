package com.example.Main.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Main.Models.GroupListProjects;
import com.example.Main.Models.ListProjects;

import jakarta.transaction.Transactional;

@org.springframework.stereotype.Repository
public interface GroupListRepository extends JpaRepository<GroupListProjects, String> {

	List<GroupListProjects> findByGroupid(Long id);
	
	
	@Transactional
	Long deleteById(Long id);
}
