package com.om_capstone1_backend.capstone1_backend.Others;

import com.om_capstone1_backend.capstone1_backend.Model.FormModel;

import java.time.LocalDateTime;

public class ActiveSurveyResponse {
    private FormModel formModel;
    private LocalDateTime localDateTime;

    ActiveSurveyResponse (FormModel formModel, LocalDateTime localDateTime) {
        this.formModel = formModel;
        this.localDateTime = localDateTime;
    }

    public void setFormModel (FormModel formModel) {
        this.formModel = formModel;
    }
    public FormModel getFormModel () {
        return formModel;
    }

    public void setLocalDateTime (LocalDateTime localDateTime) {
        this.localDateTime = localDateTime;
    }
    public LocalDateTime getLocalDateTime () {
        return localDateTime;
    }


}
