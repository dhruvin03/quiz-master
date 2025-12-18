# Quiz Master Application – Development Plan

## 1. Overview
The objective of this project is to build a **Quiz Master application** where an administrator can create and publish quizzes, and users can attempt those quizzes and receive a score.  
The application will be built using the **MERN stack** within a **2-hour time constraint**, focusing on core functionality over advanced features.

---

## 2. Assumptions

1. The system will have **a single admin user**.
2. Admin authentication will be **basic and hardcoded** (no full authentication system).
3. Users do not need to create an account to attempt quizzes.
4. Each quiz attempt is completed in **one session only**.
5. Questions will be displayed **one at a time**.
6. Once an answer is submitted, it **cannot be modified**.
7. UI/UX will be minimal and functional.
8. AI tools may be used to accelerate development and reduce boilerplate effort.

---

## 3. Scope

### 3.1 In-Scope (MVP)

#### Admin Features
- Admin login
- Create quizzes
- Add questions to quizzes:
  - Multiple Choice Questions (MCQ)
  - True / False questions
  - Text-based questions
- Publish quizzes for public access

#### User Features
- View list of published quizzes
- Enter basic information:
  - Name
  - Age
  - Gender
  - Email
- Attempt quizzes:
  - Questions shown sequentially
  - No backward navigation
- View final score upon completion

#### Technical Scope
- MERN stack (MongoDB, Express, React, Node.js)
- MongoDB Atlas for database hosting
- REST-based API communication
- Score calculation on quiz completion

---

## 4. Tech Stack

- Frontend - React
- Backend - NodeJs, ExpressJS
- Database - MongoDB Atlas

---

## 5. Approach

1. Define minimal database schemas for quizzes and submissions.
2. Implement backend APIs for admin login, quiz creation, publishing, and submissions.
3. Develop frontend screens for admin and public users.
4. Ensure correct quiz flow:
   - Sequential questions
   - No answer changes
5. Calculate and display quiz results.
6. Prioritize functionality and correctness over styling and optimizations.

---

## 6. Scope Changes During Development



