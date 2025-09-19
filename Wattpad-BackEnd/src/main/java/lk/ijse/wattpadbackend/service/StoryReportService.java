package lk.ijse.wattpadbackend.service;

import lk.ijse.wattpadbackend.dto.StoryReportRequestDTO;

public interface StoryReportService {

    void addReport(String name, StoryReportRequestDTO storyReportRequestDTO);
}
