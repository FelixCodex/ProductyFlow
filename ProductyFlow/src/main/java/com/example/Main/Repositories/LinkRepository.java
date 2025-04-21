package com.example.Main.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Main.Models.LinkProjects;
import com.example.Main.Models.Users;

import jakarta.transaction.Transactional;

@org.springframework.stereotype.Repository
public interface LinkRepository extends JpaRepository<LinkProjects, String> {
	Optional<LinkProjects> findByProjectid(Long id);
	
	@Transactional
	Long deleteByProjectid(Long id);

}