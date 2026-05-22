package com.tasktracker.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.tasktracker.entity.Task.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for Task data transfer between client and server
 */
@Data
public class TaskDTO {

    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Priority is required")
    private Priority priority;

    // BUG FIX: @JsonFormat ensures Jackson parses "yyyy-MM-dd" strings correctly.
    // The real fix is the frontend sending null instead of "" for empty dates.
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dueDate;

    private boolean completed;

    private LocalDateTime createdAt;

    private Long userId;
}
