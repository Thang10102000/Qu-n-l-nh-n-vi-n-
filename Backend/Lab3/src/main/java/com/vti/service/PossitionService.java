package com.vti.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vti.entity.Position;
import com.vti.repository.IPositionRepository;

@Service
public class PossitionService implements IPossitionService {

	@Autowired
	private IPositionRepository possitionRepository;

	@Override
	public List<Position> getAllPossition() {
		// TODO Auto-generated method stub
		return possitionRepository.findAll();
	}

}
