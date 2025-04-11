package com.om_capstone1_backend.capstone1_backend.Repository;

import com.om_capstone1_backend.capstone1_backend.Model.ActiveSurveyForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActiveSurveyRepository extends JpaRepository<ActiveSurveyForm, Long> {
    List<ActiveSurveyForm> findByCreatedAtBefore(LocalDateTime threshold);
}
