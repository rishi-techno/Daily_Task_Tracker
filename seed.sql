-- ============================================
-- Daily Task Tracker - Seed Data
-- Run this after the Spring Boot app starts
-- (tables are auto-created by Hibernate)
-- ============================================

USE daily_task_tracker;

-- Seed Users (passwords are BCrypt hashed: "demo123")
INSERT INTO users (name, email, password, created_at) VALUES
('Demo User',  'demo@example.com',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh.X', NOW()),
('Alice Smith','alice@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh.X', NOW()),
('Bob Jones',  'bob@example.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh.X', NOW());

-- Seed Tasks for Demo User (id=1)
INSERT INTO tasks (title, description, priority, due_date, completed, created_at, user_id) VALUES
('Complete project documentation',
 'Write up the full README and API docs for the Daily Task Tracker project.',
 'HIGH', DATE_ADD(CURDATE(), INTERVAL 2 DAY), false, NOW(), 1),

('Review pull requests',
 'Go through the 3 open PRs on GitHub and leave detailed code review comments.',
 'HIGH', CURDATE(), false, NOW(), 1),

('Set up MySQL database',
 'Install MySQL locally, create the database, and run the seed script.',
 'HIGH', CURDATE(), true, NOW(), 1),

('Design dashboard UI wireframes',
 'Sketch out the main dashboard layout including stat cards and task grid.',
 'MEDIUM', DATE_ADD(CURDATE(), INTERVAL 3 DAY), true, NOW(), 1),

('Write unit tests for TaskService',
 'Cover createTask, updateTask, deleteTask, and filterTasks with JUnit tests.',
 'MEDIUM', DATE_ADD(CURDATE(), INTERVAL 5 DAY), false, NOW(), 1),

('Update project dependencies',
 'Bump Spring Boot to latest stable and audit npm packages for vulnerabilities.',
 'MEDIUM', DATE_ADD(CURDATE(), INTERVAL 7 DAY), false, NOW(), 1),

('Read Clean Code book',
 'Finish chapters 6-10 on functions, objects, and error handling.',
 'LOW', DATE_ADD(CURDATE(), INTERVAL 14 DAY), false, NOW(), 1),

('Organize personal notes',
 'Sort and tag Notion notes from last quarter into relevant project folders.',
 'LOW', DATE_ADD(CURDATE(), INTERVAL 10 DAY), false, NOW(), 1),

('Deploy to production server',
 'Configure Nginx, set up SSL certificate, and deploy the Spring Boot JAR and React build.',
 'HIGH', DATE_ADD(CURDATE(), INTERVAL 4 DAY), false, NOW(), 1),

('Create demo video walkthrough',
 'Record a 3-minute screen capture showing all features of the Daily Task Tracker.',
 'LOW', DATE_ADD(CURDATE(), INTERVAL 20 DAY), false, NOW(), 1);

-- Quick verification
SELECT 'Users seeded:' as info, COUNT(*) as count FROM users;
SELECT 'Tasks seeded:' as info, COUNT(*) as count FROM tasks;
