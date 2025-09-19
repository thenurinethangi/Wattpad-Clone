package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.UserReportRequestDTO;

public interface UserReportService {

    void addReport(String name, UserReportRequestDTO userReportRequestDTO);
}
