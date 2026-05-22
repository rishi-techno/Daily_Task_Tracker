package com.tasktracker.repository;

import com.tasktracker.entity.Task;
import com.tasktracker.entity.Task.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository for Task entity - handles all DB operations for tasks
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Get all tasks for a specific user
    List<Task> findByUserId(Long userId);

    // Search tasks by title (case-insensitive)
    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Task> searchByTitle(@Param("userId") Long userId, @Param("keyword") String keyword);

    // Filter tasks by completed status
    List<Task> findByUserIdAndCompleted(Long userId, boolean completed);

    // Filter tasks by priority
    List<Task> findByUserIdAndPriority(Long userId, Priority priority);

    // Filter tasks by completed status AND priority
    List<Task> findByUserIdAndCompletedAndPriority(Long userId, boolean completed, Priority priority);

    // Count tasks by user and completed status
    long countByUserIdAndCompleted(Long userId, boolean completed);

    // Count all tasks by user
    long countByUserId(Long userId);
}
