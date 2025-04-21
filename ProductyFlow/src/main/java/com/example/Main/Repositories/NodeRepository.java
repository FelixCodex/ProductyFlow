package com.example.Main.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Main.Models.LinkProjects;
import com.example.Main.Models.NodeProjects;

import jakarta.transaction.Transactional;


@org.springframework.stereotype.Repository
public interface NodeRepository extends JpaRepository<NodeProjects, String> {

	Optional<NodeProjects> findById(Long id);
	
	List<NodeProjects> findByUserid(Long id);
	
	@Transactional
	Long deleteById(Long id);
	
}
