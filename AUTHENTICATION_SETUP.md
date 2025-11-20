# NoteSphere Authentication Implementation Guide

## Overview
Comprehensive JWT-based authentication has been added to your NoteSphere MERN application. Users must now register and login before they can create, view, update, or delete notes.

---

## Backend Changes

### 1. **New Dependencies Added** (`backend/package.json`)
- `bcryptjs`: Password hashing library
- `jsonwebtoken`: JWT token generation and verification

### 2. **New Files Created**

#### `backend/src/models/user.js`
- User schema with username, email, and password fields
- Password hashing before saving using bcryptjs (10 salt rounds)
- `matchPassword()` method to verify passwords during login
- Automatic password encryption on save

#### `backend/src/controller/authController.js`
Contains three main functions:
- **`register()`**: Creates new user account with validation
- **`login()`**: Authenticates user and returns JWT token
- **`getProfile()`**: Fetches authenticated user's profile (protected route)

#### `backend/src/middleware/auth.js`
- **`protect()`**: Middleware that verifies JWT tokens
  - Extracts token from `Authorization: Bearer <token>` header
  - Validates token and attaches `userId` to request
  - Returns 401 if token is missing or invalid

#### `backend/src/routes/authRoutes.js`
Authentication endpoints:
- `POST /api/auth/register`: User registration
- `POST /api/auth/login`: User login
- `GET /api/auth/profile`: Get user profile (protected)

### 3. **Modified Files**

#### `backend/src/models/notes.js`
- Added `userId` field (required, references User model)
- Notes are now tied to specific users

#### `backend/src/controller/notesController.js`
- All functions now filter notes by `userId`
- Authorization checks ensure users can only access/modify their own notes
- Returns 403 Forbidden if unauthorized

#### `backend/src/routes/notesRoutes.js`
- Applied `protect` middleware to all note routes
- Users must be authenticated to perform any note operations

#### `backend/src/server.js`
- Added import for `authRoutes`
- Registered auth routes at `/api/auth`

#### `backend/.env`
- Added `JWT_SECRET` environment variable (change in production!)

---

## Frontend Changes

### 1. **New Files Created**

#### `frontend/src/context/AuthContext.jsx`
React Context for authentication state management:
- Stores: `user`, `isAuthenticated`, `isLoading`
- Methods:
  - `register()`: Call registration endpoint
  - `login()`: Call login endpoint
  - `logout()`: Clear auth state
- Persists token and user data in localStorage
- Provides `useAuth()` hook for consuming components

#### `frontend/src/components/ProtectedRoute.jsx`
- Route wrapper that checks authentication
- Redirects unauthenticated users to login
- Shows loading spinner while checking auth

#### `frontend/src/pages/LoginPage.jsx`
- Email and password login form
- Client-side form validation
- Error messages for invalid inputs
- Redirects to home after successful login

#### `frontend/src/pages/RegisterPage.jsx`
- Username, email, password registration form
- Password confirmation validation
- Email format validation
- Username length validation (minimum 3 characters)
- Error messages for all fields

### 2. **Modified Files**

#### `frontend/src/lib/axios.js`
Enhanced with:
- Request interceptor: Automatically adds JWT token to `Authorization` header
- Response interceptor: Handles 401 errors by clearing auth and redirecting to login

#### `frontend/src/components/Navbar.jsx`
- Shows user info (username, email) and avatar when authenticated
- Login/Register buttons when not authenticated
- Logout button with confirmation
- Dynamic button display based on auth state

#### `frontend/src/App.jsx`
- Wrapped with `AuthProvider`
- All protected routes wrapped with `ProtectedRoute` component
- Added `/login` and `/register` routes
- Navbar moved into App component

---

## Authentication Flow

### User Registration
```
1. User fills registration form
2. Frontend validates form data
3. POST /api/auth/register with { username, email, password, confirmPassword }
4. Backend validates and hashes password
5. User stored in MongoDB
6. JWT token generated
7. Token and user data sent to frontend
8. Frontend stores token in localStorage
9. User redirected to home page
```

### User Login
```
1. User enters email and password
2. POST /api/auth/login with { email, password }
3. Backend finds user and compares passwords
4. JWT token generated if valid
5. Token sent to frontend
6. Frontend stores token and user data
7. User redirected to home page
```

### Protected Routes
```
1. User tries to access protected page (/, /create, /note/:id)
2. ProtectedRoute checks isAuthenticated
3. If not authenticated: redirect to /login
4. If authenticated: render protected component
5. All API calls include Authorization header with token
```

### API Request with Authentication
```
1. Frontend makes API request to protected endpoint
2. axios interceptor adds: Authorization: Bearer <token>
3. Backend protect middleware verifies token
4. If valid: attach userId to request, proceed
5. If invalid: return 401 Unauthorized
6. Frontend interceptor catches 401 and redirects to login
```

---

## Security Features

✅ **Password Hashing**: Passwords are hashed with bcryptjs (10 rounds)
✅ **JWT Tokens**: Secure token-based authentication
✅ **Token Expiration**: Tokens expire after 30 days
✅ **Authorization**: Users can only access their own notes
✅ **Input Validation**: Both frontend and backend validation
✅ **CORS Protection**: Configured for specific origin
✅ **HTTP Headers**: Proper status codes for errors

---

## Setup Instructions

### Backend Setup
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Update `.env` file:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your-strong-secret-key-here
   NODE_ENV=development
   ```

3. Start backend:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start frontend:
   ```bash
   npm run dev
   ```

---

## Testing the Authentication

### Test Registration
1. Go to http://localhost:5173/register
2. Fill in username, email, password
3. Submit form
4. Should be redirected to home page
5. User info should display in navbar

### Test Login
1. Go to http://localhost:5173/login
2. Enter email and password from registration
3. Submit form
4. Should be redirected to home page

### Test Protected Routes
1. Try accessing http://localhost:5173 without logging in
2. Should redirect to login page
3. After login, should access home page

### Test Note Operations
1. After login, create a note
2. Notes should only show for authenticated user
3. Other users cannot see or modify your notes

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (protected)

### Notes (All Protected)
- `GET /api/routes/` - Get user's notes
- `GET /api/routes/:id` - Get specific note
- `POST /api/routes/` - Create note
- `PUT /api/routes/:id` - Update note
- `DELETE /api/routes/:id` - Delete note

---

## Error Handling

### Common Errors

**400 Bad Request**
- Missing required fields
- Invalid email format
- Passwords don't match
- Username/email already exists

**401 Unauthorized**
- Invalid credentials
- Missing or expired token

**403 Forbidden**
- Trying to access/modify another user's note

**404 Not Found**
- Note not found
- User not found

---

## Important Notes

⚠️ **Change JWT_SECRET in Production**: Replace "your-secret-key" with a strong random key
⚠️ **Secure Your Database**: Ensure MongoDB credentials are kept secret
⚠️ **HTTPS in Production**: Always use HTTPS for authentication
⚠️ **Token Storage**: Consider using HttpOnly cookies instead of localStorage for better security

---

## Next Steps (Optional Enhancements)

- Add password reset functionality
- Add email verification
- Implement refresh tokens
- Add role-based access control (admin, user)
- Add two-factor authentication
- Add OAuth integration (Google, GitHub)
- Implement rate limiting on auth endpoints
