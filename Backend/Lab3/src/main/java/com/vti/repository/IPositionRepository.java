package com.vti.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.vti.entity.*;
public interface IPositionRepository extends JpaRepository<Position, Short> {

}
