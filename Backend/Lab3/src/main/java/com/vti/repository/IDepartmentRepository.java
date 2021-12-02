package com.vti.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.vti.entity.*;
public interface IDepartmentRepository extends JpaRepository<Department, Short> {
	
	

}
