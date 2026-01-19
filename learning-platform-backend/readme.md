# Online Learning Platform - Backend

A comprehensive RESTful API for an online learning platform with GPT-3 integration built using the MERN stack.

## Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Students and Instructors)
  - Secure password hashing with bcryptjs

- **Course Management**
  - Full CRUD operations for courses
  - Instructor-specific course management
  - Course search and filtering
  - Enrolled students tracking

- **Enrollment System**
  - Student course enrollment
  - Progress tracking
  - Enrollment status management

- **GPT-3 Integration**
  - AI-powered course recommendations
  - Intelligent course suggestions based on career goals
  - API request tracking (250 request limit)

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **OpenAI API** - GPT-3 integration
- **bcryptjs** - Password hashing

## Project Structure

```
backend/
├── server.js               # Entry point
├── models/                 # Database models
│   ├── User.js
│   ├── Course.js
│   └── Enrollment.js
├── controllers/            # Business logic
│   ├── authController.js
│   ├── courseController.js
│   ├── enrollmentController.js
│   └── gptController.js
├── routes/                 # API routes
│   ├── auth.js
│   ├── courses.js
│   ├── enrollments.js
│   └── gpt.js
├── middleware/             # Custom middleware
│   ├── auth.js
│   └── roleCheck.js
└── utils/                  # Utility functions
    └── gptService.js
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- OpenAI API key

### Setup Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd learning-platform-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```bash
OPENAI_API_KEY=your_openai_api_key
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

4. **Start the server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |

### Courses

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/courses` | Get all courses | No | - |
| GET | `/api/courses/:id` | Get course by ID | No | - |
| POST | `/api/courses` | Create new course | Yes | Instructor |
| PUT | `/api/courses/:id` | Update course | Yes | Instructor |
| DELETE | `/api/courses/:id` | Delete course | Yes | Instructor |
| GET | `/api/courses/instructor/my-courses` | Get instructor's courses | Yes | Instructor |
| GET | `/api/courses/:id/students` | Get enrolled students | Yes | Instructor |

### Enrollments

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/enrollments` | Enroll in course | Yes | Student |
| GET | `/api/enrollments` | Get my enrollments | Yes | Student |
| GET | `/api/enrollments/:id` | Get enrollment details | Yes | Student |
| PUT | `/api/enrollments/:id/progress` | Update progress | Yes | Student |
| DELETE | `/api/enrollments/:id` | Unenroll from course | Yes | Student |
| GET | `/api/enrollments/check/:courseId` | Check enrollment | Yes | Student |

### GPT Integration

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/gpt/recommendations` | Get course recommendations | Yes |
| POST | `/api/gpt/chat` | Chat with GPT | Yes |
| GET | `/api/gpt/usage` | Get API usage stats | Yes |

## Request/Response Examples

### Register User

**Request:**
```json
POST /api/auth/register
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",
  "fullName": "John Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "student",
    "fullName": "John Doe"
  }
}
```

### Create Course

**Request:**
```json
POST /api/courses
Headers: Authorization: Bearer <token>
{
  "title": "Introduction to JavaScript",
  "description": "Learn JavaScript from scratch",
  "content": "Complete course content here...",
  "duration": "8 weeks",
  "level": "Beginner",
  "category": "Programming",
  "price": 49.99
}
```

### Get Course Recommendations

**Request:**
```json
POST /api/gpt/recommendations
Headers: Authorization: Bearer <token>
{
  "prompt": "I want to be a software engineer, what courses should I follow?"
}
```

**Response:**
```json
{
  "message": "Recommendations generated successfully",
  "prompt": "I want to be a software engineer...",
  "recommendations": [
    {
      "courseTitle": "Introduction to JavaScript",
      "reason": "Essential for web development"
    }
  ],
  "explanation": "These courses provide a solid foundation..."
}
```

## Database Schema

### User
- username (String, unique, required)
- email (String, unique, required)
- password (String, hashed, required)
- role (Enum: 'student', 'instructor')
- fullName (String)
- timestamps

### Course
- title (String, required)
- description (String, required)
- content (String, required)
- instructor (ObjectId, ref: User)
- duration (String)
- level (Enum: 'Beginner', 'Intermediate', 'Advanced')
- category (String)
- price (Number)
- thumbnail (String)
- enrolledStudents (Array of ObjectIds)
- isPublished (Boolean)
- timestamps

### Enrollment
- student (ObjectId, ref: User)
- course (ObjectId, ref: Course)
- enrolledAt (Date)
- status (Enum: 'active', 'completed', 'dropped')
- progress (Number, 0-100)
- completedAt (Date)
- timestamps

## Error Handling

The API uses standard HTTP status codes:

- **200** - Success
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **429** - Too Many Requests (API limit)
- **500** - Internal Server Error

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Role-based access control
- Input validation with express-validator
- Protected routes
- CORS enabled

## GPT API Usage

- Maximum 250 API requests allowed
- Request tracking implemented
- Error handling for rate limits
- Efficient prompt design

## Testing

You can test the API using:
- Postman
- Thunder Client (VS Code)
- cURL commands
- REST Client (VS Code extension)

## Deployment

### Deploy to Render/Railway/Heroku

1. Create account on deployment platform
2. Connect your GitHub repository
3. Add environment variables
4. Deploy

### Deploy to Vercel (Serverless)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License

## Contact

For questions or support, please contact the development team.

---

**Note:** This is the backend API. Frontend implementation required separately.