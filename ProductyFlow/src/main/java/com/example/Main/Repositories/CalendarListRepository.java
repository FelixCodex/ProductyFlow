package com.example.Main.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Main.Models.CalendarLists;
import com.example.Main.Models.ListProjects;

import jakarta.transaction.Transactional;

@org.springframework.stereotype.Repository
public interface CalendarListRepository extends JpaRepository<CalendarLists, String> {

	Optional<CalendarLists> findById(Long id);
	
	Optional<CalendarLists> findByUseridAndDate(Long id, String date);
	
	@Transactional
	Long deleteById(Long id);
	
}
