package com.tasktracker.repository;

import com.tasktracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository for User entity - handles DB operations for users
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email (used during login and registration)
    Optional<User> findByEmail(String email);

    // Check if email already exists (used during registration)
    boolean existsByEmail(String email);
}
