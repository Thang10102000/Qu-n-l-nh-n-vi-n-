package com.vti.service;
import java.util.List;

import com.vti.entity.*;
public interface IDepartmentService {
	public List<Department> getAllDepartments();
	
	   public Department getDepartmentByID(short id);

	   	public void deleteDepartmentByID(short id);

}
