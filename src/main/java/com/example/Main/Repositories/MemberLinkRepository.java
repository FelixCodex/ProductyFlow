package com.example.Main.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Main.Models.Groups;
import com.example.Main.Models.MemberLinks;

@org.springframework.stereotype.Repository
public interface MemberLinkRepository extends JpaRepository<MemberLinks, String> {

	List<MemberLinks> findByUserid(Long id);
	List<MemberLinks> findByGroupid(Long id);
	Optional<MemberLinks> findByGroupidAndUserid(Long gid,Long uid);
}
