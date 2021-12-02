package com.vti.dto;

public class LoginInfoDto {
	private short id;

	private String fullName;

	private String status;
	
	private String department;

	public LoginInfoDto(short id, String fullName, String status) {
		this.id = id;
		this.fullName = fullName;
		this.status = status;
	}

	public short getId() {
		return id;
	}

	public String getFullName() {
		return fullName;
	}

	public String getStatus() {
		return status;
	}

	public LoginInfoDto(short id, String fullName, String status, String department) {
		super();
		this.id = id;
		this.fullName = fullName;
		this.status = status;
		this.department = department;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}



}
