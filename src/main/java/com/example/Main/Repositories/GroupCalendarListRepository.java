package com.example.Main.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Main.Models.CalendarLists;
import com.example.Main.Models.GroupCalendarListProjects;

import jakarta.transaction.Transactional;

@org.springframework.stereotype.Repository
public interface GroupCalendarListRepository extends JpaRepository<GroupCalendarListProjects, String> {

	Optional<GroupCalendarListProjects> findByGroupidAndDate(Long id, String date);
	
	@Transactional
	Long deleteById(Long id);
}
