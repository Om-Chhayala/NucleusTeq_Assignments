package com.om_capstone1_backend.capstone1_backend.Repository;

import com.om_capstone1_backend.capstone1_backend.Model.EmployeeResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EmployeeResponseRepository extends JpaRepository<EmployeeResponse, Long> {
    List<EmployeeResponse> findByUser_Name(String name);
    List<EmployeeResponse> findByUser_Department(String department);
    List<EmployeeResponse> findBySubmittedAtBetween(LocalDateTime startTime, LocalDateTime endTime);
}
