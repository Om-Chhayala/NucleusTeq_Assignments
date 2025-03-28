package com.om_chhayala.backend_java.Repository;

import com.om_chhayala.backend_java.Model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}
