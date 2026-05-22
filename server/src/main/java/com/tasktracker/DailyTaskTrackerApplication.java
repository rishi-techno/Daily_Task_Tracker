package com.tasktracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Daily Task Tracker - Main Application Entry Point
 * Full-stack task management system with JWT authentication
 */
@SpringBootApplication
public class DailyTaskTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(DailyTaskTrackerApplication.class, args);
        System.out.println("🚀 Daily Task Tracker Backend is running on http://localhost:8080");
    }
}
