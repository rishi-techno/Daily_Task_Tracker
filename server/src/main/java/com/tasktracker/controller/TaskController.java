package com.tasktracker.controller;

import com.tasktracker.dto.TaskDTO;
import com.tasktracker.entity.User;
import com.tasktracker.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

 
@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    @Autowired
    private TaskService taskService;
 
    private Long getCurrentUserId(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return user.getId();
    }
 
    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAllTasks(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(taskService.getAllTasks(userId));
    }

    /**
     * Create a new task
     */
    @PostMapping
    public ResponseEntity<?> createTask(@Valid @RequestBody TaskDTO taskDTO,
                                        Authentication authentication) {
        try {
            Long userId = getCurrentUserId(authentication);
            TaskDTO created = taskService.createTask(taskDTO, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Update an existing task by ID
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id,
                                        @Valid @RequestBody TaskDTO taskDTO,
                                        Authentication authentication) {
        try {
            Long userId = getCurrentUserId(authentication);
            TaskDTO updated = taskService.updateTask(id, taskDTO, userId);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
 
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id,
                                        Authentication authentication) {
        try {
            Long userId = getCurrentUserId(authentication);
            taskService.deleteTask(id, userId);
            return ResponseEntity.ok(Map.of("message", "Task deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

   
    @GetMapping("/search")
    public ResponseEntity<List<TaskDTO>> searchTasks(@RequestParam String keyword,
                                                     Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(taskService.searchTasks(userId, keyword));
    }

     
    @GetMapping("/filter")
    public ResponseEntity<?> filterTasks(
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) String priority,
            Authentication authentication) {
         
        try {
            Long userId = getCurrentUserId(authentication);
            return ResponseEntity.ok(taskService.filterTasks(userId, completed, priority));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid priority. Must be HIGH, MEDIUM, or LOW."));
        }
    }

   
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(taskService.getDashboardStats(userId));
    }
}
