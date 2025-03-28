package com.om_capstone1_backend.capstone1_backend.Repository;

import com.om_capstone1_backend.capstone1_backend.Model.FormModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormRepository extends JpaRepository<FormModel, Long> {
}
