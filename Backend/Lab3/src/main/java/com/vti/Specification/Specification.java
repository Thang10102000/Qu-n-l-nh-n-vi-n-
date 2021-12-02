package com.vti.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import com.vti.entity.Account;

public class Specification implements org.springframework.data.jpa.domain.Specification<Account> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String field;
	private String operator;
	private Object value;
	

	@Override
	public Predicate toPredicate(Root<Account> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
		
		if (operator.equalsIgnoreCase("LIKE")) {

			if (field.equalsIgnoreCase("department.name")) {
				return builder.like(root.get("department").get("name"), "%" + value.toString() + "%");
			} else {
				return builder.like(root.get(field), "%" + value.toString() + "%");
			}
		}
		return null;

	}

}
