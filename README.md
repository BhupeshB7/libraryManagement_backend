# 📚 Library Management Backend

A robust and feature-rich backend system for managing library operations, developed using **Node.js**, **Express.js**, and **MongoDB**. This project showcases advanced backend functionalities, including user authentication with email verification, transactional operations, session management, and automated notifications.

---

## 🚀 Features

### 🧑‍💼 User Management

- **Registration & Login**: Secure user registration and authentication mechanisms.
- **Email Verification**: Upon registration, users receive a verification email via **Nodemailer** to activate their accounts.
- **Session Management**: Utilizes sessions to maintain user state across requests.

### 📚 Book Management

- **CRUD Operations**: Create, read, update, and delete book records.
- **File Uploads**: Supports uploading book-related assets, such as cover images, stored in the `uploads/` directory.

### 🔄 Borrowing System

- **Borrow Books**: Users can borrow available books.
- **Return Books**: Handles the return process, updating book availability.
- **Overdue Management**: Implements fines for overdue books and notifies users accordingly.
- **Transactional Operations**: Ensures data consistency during borrow/return operations using **MongoDB transactions**.
- **Email Notifications**: Sends emails to users upon borrowing books, detailing due dates and other relevant information.

### 🛡️ Validation & Error Handling

- **Data Validation**: Employs **Zod** schemas to validate incoming data, ensuring data integrity.
- **Centralized Error Handling**: Captures and manages errors gracefully, providing meaningful feedback to API consumers.

---

## 🛠️ Technologies Used

- **Runtime Environment**: Node.js
- **Web Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Email Service**: Nodemailer
- **Validation Library**: Zod
- **Session Management**: Express-Session

---

## 📁 Project Structure

```bash
├── assets/             # Static assets
├── config/             # Configuration files
├── controllers/        # Route handlers
├── middlewares/        # Custom middleware functions
├── models/             # Mongoose schemas and models
├── routes/             # API route definitions
├── services/           # Business logic
├── uploads/            # Uploaded files
├── utils/              # Utility functions
├── validation/         # Validation logic
├── zodSchemas/         # Zod schemas for data validation
├── api.http            # API testing file
├── index.js            # Entry point of the application
├── package.json        # Project metadata and dependencies
└── .gitignore          # Git ignore file
```

---

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/BhupeshB7/libraryManagement_backend.git
   cd libraryManagement_backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Create a `.env` file in the root directory.
   - Add necessary environment variables as per your configuration.

4. **Start the server**:
   ```bash
   npm start
   ```

---

## 📬 API Endpoints

The application exposes various RESTful API endpoints to manage users, books, and borrowing activities.

### User Routes

- **POST** `/users/register` - Register a new user
- **POST** `/users/login` - Authenticate a user
- **GET** `/users/verify/:token` - Verify user's email
- **GET** `/users/:id` - Retrieve user details

### Book Routes

- **POST** `/books` - Add a new book
- **GET** `/books` - Retrieve all books
- **GET** `/books/:id` - Retrieve a specific book
- **PUT** `/books/:id` - Update book information
- **DELETE** `/books/:id` - Delete a book

### Borrowing Routes

- **POST** `/borrow` - Borrow a book
- **POST** `/return` - Return a borrowed book
- **GET** `/borrow/history/:userId` - View borrowing history of a user

*Note: The exact endpoints and their functionalities are based on standard practices and may vary depending on your implementation. Please refer to your route definitions for precise information.*

---

## 🧪 Testing

You can use the `api.http` file provided in the root directory to test the API endpoints using REST Client extensions in VS Code or other API testing tools like Postman.

---
