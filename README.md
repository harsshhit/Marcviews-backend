# Express Backend with JWT Authentication and MongoDB

This is a Node.js Express backend with JWT authentication and MongoDB integration.

## Features

- User registration and login with JWT authentication
- Password hashing with bcrypt
- MongoDB database integration
- Protected routes middleware
- Error handling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/auth-app
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

   Replace `your_jwt_secret_key_here` with a secure random string.

4. Start the server:
   - Development mode: `npm run dev`
   - Production mode: `npm start`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user

  - Body: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`

- `POST /api/auth/login` - Login user

  - Body: `{ "email": "john@example.com", "password": "password123" }`

- `GET /api/auth/me` - Get current user (protected route)
  - Headers: `Authorization: Bearer <token>`

## Error Handling

The API returns appropriate HTTP status codes and error messages in case of failures.

## Security

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Protected routes require a valid JWT token
