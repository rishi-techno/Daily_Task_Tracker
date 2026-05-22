package com.tasktracker.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * User Entity - Represents a registered user in the system
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
// BUG FIX #1: @Data generates toString/hashCode that traverse the tasks list,
// which references User → causing infinite recursion (StackOverflowError).
@ToString(exclude = "tasks")
@EqualsAndHashCode(exclude = "tasks")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // One user has many tasks
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Task> tasks;

    // Auto-set createdAt before persisting
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
