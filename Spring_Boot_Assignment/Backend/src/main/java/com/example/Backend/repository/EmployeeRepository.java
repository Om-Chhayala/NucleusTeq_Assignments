package com.example.Backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Backend.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

}