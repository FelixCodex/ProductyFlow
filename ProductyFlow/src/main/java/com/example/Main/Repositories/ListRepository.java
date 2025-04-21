package com.example.Main.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Main.Models.ListProjects;

import jakarta.transaction.Transactional;

@org.springframework.stereotype.Repository
public interface ListRepository extends JpaRepository<ListProjects, String> {

	Optional<ListProjects> findById(Long id);
	
	List<ListProjects> findByUserid(Long id);
	
	@Transactional
	Long deleteById(Long id);
	
}
