package com.om_capstone1_backend.capstone1_backend.Repository;

import com.om_capstone1_backend.capstone1_backend.Model.EmployeeResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EmployeeResponseRepository
        extends JpaRepository<EmployeeResponse, Long>,
        JpaSpecificationExecutor<EmployeeResponse> {
    List<EmployeeResponse> findByUser_Id(Long id);
    List<EmployeeResponse> findByUser_Department(String department);
    List<EmployeeResponse> findByUser_Address(String address);
    List<EmployeeResponse> findBySubmittedAtBetween(LocalDateTime startTime, LocalDateTime endTime);
}