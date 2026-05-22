package com.tasktracker.service;

import com.tasktracker.dto.TaskDTO;
import com.tasktracker.entity.Task;
import com.tasktracker.entity.Task.Priority;
import com.tasktracker.entity.User;
import com.tasktracker.repository.TaskRepository;
import com.tasktracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * TaskService - Handles all task-related business logic
 */
@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get all tasks for a user
     */
    public List<TaskDTO> getAllTasks(Long userId) {
        return taskRepository.findByUserId(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Create a new task
     */
    public TaskDTO createTask(TaskDTO taskDTO, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = Task.builder()
                .title(taskDTO.getTitle())
                .description(taskDTO.getDescription())
                .priority(taskDTO.getPriority())
                .dueDate(taskDTO.getDueDate())
                .completed(false)
                .user(user)
                .build();

        return toDTO(taskRepository.save(task));
    }

    /**
     * Update an existing task
     */
    public TaskDTO updateTask(Long taskId, TaskDTO taskDTO, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // Verify ownership
        if (!task.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: You can only edit your own tasks");
        }

        // Update fields
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setPriority(taskDTO.getPriority());
        task.setDueDate(taskDTO.getDueDate());
        task.setCompleted(taskDTO.isCompleted());

        return toDTO(taskRepository.save(task));
    }

    /**
     * Delete a task
     */
    public void deleteTask(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // Verify ownership
        if (!task.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: You can only delete your own tasks");
        }

        taskRepository.deleteById(taskId);
    }

    /**
     * Search tasks by title keyword
     */
    public List<TaskDTO> searchTasks(Long userId, String keyword) {
        return taskRepository.searchByTitle(userId, keyword)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Filter tasks by completion status and/or priority
     */
    public List<TaskDTO> filterTasks(Long userId, Boolean completed, String priority) {
        List<Task> tasks;

        if (completed != null && priority != null) {
            Priority p = Priority.valueOf(priority.toUpperCase());
            tasks = taskRepository.findByUserIdAndCompletedAndPriority(userId, completed, p);
        } else if (completed != null) {
            tasks = taskRepository.findByUserIdAndCompleted(userId, completed);
        } else if (priority != null) {
            Priority p = Priority.valueOf(priority.toUpperCase());
            tasks = taskRepository.findByUserIdAndPriority(userId, p);
        } else {
            tasks = taskRepository.findByUserId(userId);
        }

        return tasks.stream().map(this::toDTO).collect(Collectors.toList());
    }

    /**
     * Get dashboard statistics for a user
     */
    public Map<String, Object> getDashboardStats(Long userId) {
        long total = taskRepository.countByUserId(userId);
        long completed = taskRepository.countByUserIdAndCompleted(userId, true);
        long pending = total - completed;
        double progress = total > 0 ? (double) completed / total * 100 : 0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("completed", completed);
        stats.put("pending", pending);
        stats.put("progress", Math.round(progress));

        return stats;
    }

    /**
     * Convert Task entity to TaskDTO
     */
    private TaskDTO toDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setPriority(task.getPriority());
        dto.setDueDate(task.getDueDate());
        dto.setCompleted(task.isCompleted());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUserId(task.getUser().getId());
        return dto;
    }
}
