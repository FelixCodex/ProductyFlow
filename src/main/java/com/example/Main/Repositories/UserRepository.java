package com.example.Main.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.Main.Models.Users;

@org.springframework.stereotype.Repository
public interface UserRepository extends JpaRepository<Users, String> {
	Optional<Users> findByUsername(String user_name);

	Optional<Users> findByEmail(String email);

}