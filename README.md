# ✦ Daily Task Tracker

A full-stack task management web application built with **React**, **Spring Boot**, and **MySQL** — featuring JWT authentication, CRUD operations, search, filters, and a responsive dashboard.

---

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 18, React Router 6, Axios, CSS3  |
| Backend  | Spring Boot 3.2, Spring Security, JPA  |
| Database | MySQL 8+                                |
| Auth     | JWT (io.jsonwebtoken)                   |
| Build    | Maven (backend), npm (frontend)         |

---

## Project Structure

```
daily-task-tracker/
├── client/               ← React frontend
│   ├── public/
│   └── src/
│       ├── components/   ← Navbar, Sidebar, TaskCard, TaskForm, SearchBar, FilterPanel
│       ├── pages/        ← Login, Register, Dashboard, AddTask, EditTask, Profile
│       ├── services/     ← authService.js, taskService.js
│       ├── context/      ← AuthContext.jsx
│       ├── styles/       ← global.css
│       ├── App.js
│       └── index.js
│
├── server/               ← Spring Boot backend
│   └── src/main/java/com/tasktracker/
│       ├── controller/   ← AuthController, TaskController
│       ├── service/      ← AuthService, TaskService
│       ├── repository/   ← UserRepository, TaskRepository
│       ├── entity/       ← User, Task
│       ├── dto/          ← LoginRequest, RegisterRequest, TaskDTO
│       └── security/     ← JwtUtil, JwtFilter, SecurityConfig
│
├── seed.sql              ← Sample data for MySQL
└── README.md
```

---

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- Maven 3.8+

---

### 1. Database Setup

```sql
CREATE DATABASE daily_task_tracker;
```

Then configure your credentials in:
```
server/src/main/resources/application.properties
```

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/daily_task_tracker?...
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

---

### 2. Run the Backend

```bash
cd server
mvn spring-boot:run
```

Backend runs on: **http://localhost:8080**

---

### 3. Seed Sample Data (optional)

After the backend starts (tables auto-created by Hibernate):

```bash
mysql -u root -p daily_task_tracker < seed.sql
```

Demo credentials: `demo@example.com` / `demo123`

---

### 4. Run the Frontend

```bash
cd client
npm install
npm start
```

Frontend runs on: **http://localhost:3000**

---

## REST API Reference

### Auth Endpoints (Public)

| Method | Endpoint              | Description     |
|--------|-----------------------|-----------------|
| POST   | /api/auth/register    | Register user   |
| POST   | /api/auth/login       | Login user      |

**Register body:**
```json
{ "name": "John", "email": "john@example.com", "password": "secret123" }
```

**Login body:**
```json
{ "email": "john@example.com", "password": "secret123" }
```

**Response:**
```json
{
  "token": "eyJhbGci...",
  "user": { "id": 1, "name": "John", "email": "john@example.com" },
  "message": "Login successful!"
}
```

---

### Task Endpoints (Protected — requires `Authorization: Bearer <token>`)

| Method | Endpoint                   | Description                        |
|--------|----------------------------|------------------------------------|
| GET    | /api/tasks                 | Get all tasks for logged-in user   |
| POST   | /api/tasks                 | Create a new task                  |
| PUT    | /api/tasks/{id}            | Update a task                      |
| DELETE | /api/tasks/{id}            | Delete a task                      |
| GET    | /api/tasks/search?keyword= | Search by title                    |
| GET    | /api/tasks/filter          | Filter by ?completed=&priority=    |
| GET    | /api/tasks/stats           | Dashboard stats                    |

**Task body:**
```json
{
  "title": "Write documentation",
  "description": "Cover all API endpoints",
  "priority": "HIGH",
  "dueDate": "2024-12-31",
  "completed": false
}
```

---

## Features

- ✅ User registration & login with JWT
- ✅ Protected routes (redirect to login if unauthenticated)
- ✅ Create, read, update, delete tasks
- ✅ Mark tasks complete / pending
- ✅ Priority levels: High (red), Medium (orange), Low (green)
- ✅ Due dates with overdue highlighting
- ✅ Real-time search by title (debounced)
- ✅ Filter by status (all/pending/completed) and priority
- ✅ Dashboard stats: total, completed, pending, progress %
- ✅ Progress bar visualization
- ✅ User profile page
- ✅ Responsive design (desktop + mobile)
- ✅ Form validation (frontend + backend)
- ✅ Error handling with user-friendly messages

---

## Environment Notes

- JWT token expires in 24 hours (configurable via `jwt.expiration` in `application.properties`)
- CORS is configured to allow requests from `http://localhost:3000`
- Passwords are stored using BCrypt hashing
- `spring.jpa.hibernate.ddl-auto=update` auto-creates/updates tables on startup
