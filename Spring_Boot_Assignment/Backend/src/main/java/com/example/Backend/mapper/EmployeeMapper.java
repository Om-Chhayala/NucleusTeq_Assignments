package com.example.Backend.mapper;

import com.example.Backend.dto.EmployeeDto;
import com.example.Backend.entity.Employee;

public class EmployeeMapper {
    public static EmployeeDto mapToEmployeeDto(Employee employee) {
        return new EmployeeDto(
            employee.getId(),
            employee.getName(),
            employee.getDepartment(),
            employee.getEmail(),
            employee.getSalary()
        );
    }
}
