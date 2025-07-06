# Project Management Tool

A full-stack project management application built with React, Node.js, Express, and MongoDB.

## Features

### 🔐 Authentication
- JWT-based user authentication
- Secure password hashing with bcryptjs
- Protected routes and API endpoints
- Login/Register functionality

### 📋 Project Management
- Create, read, update, and delete projects
- Project fields: title, description, status (active/completed)
- Users can only access their own projects
- Clean project dashboard interface

### ✅ Task Management
- Full CRUD operations for tasks
- Task fields: title, description, status (todo/in-progress/done), priority, due date
- Tasks are linked to projects
- Filter tasks by status
- Responsive task cards with priority indicators

### 🎨 Frontend Features
- **Full TypeScript implementation** with strict type checking
- Comprehensive type definitions for all data models
- Type-safe API calls and form handling
- React Hook Form with Yup validation
- Context API for state management
- Responsive design with Tailwind CSS
- Clean, intuitive user interface

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation

### Frontend
- **React.js** with **TypeScript** (strict mode)
- **Type-safe interfaces** for all data models
- **React Router** for navigation
- **React Hook Form** + **Yup** for form validation
- **Axios** for API calls with typed responses
- **Tailwind CSS** for styling
- **date-fns** for date formatting

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn
- Docker and Docker Compose (optional, for containerized setup)

### Backend Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd Assignment
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Environment Configuration**
Create a `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/project-management
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
JWT_EXPIRES_IN=7d
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod

# If using MongoDB Atlas, ensure your connection string is correct in .env
```

5. **Run the seed script**
```bash
npm run seed
```

6. **Start the backend server**
```bash
npm start
# Server will run on http://localhost:5000
```

### Frontend Setup

1. **Install frontend dependencies**
```bash
cd frontend
npm install
```

2. **Start the development server**
```bash
npm start
# Application will run on http://localhost:3000
```

## Docker Setup (Alternative)

For a containerized setup using Docker:

### 1. **Build and run with Docker Compose**
```bash
# From the root directory (Assignment/)
docker-compose up --build
```

### 2. **Services will be available at:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017

### 3. **Run seed script in Docker:**
```bash
# Execute seed script in the backend container
docker-compose exec backend npm run seed
```

### 4. **Stop the application:**
```bash
docker-compose down
```

## Seed Data

The application includes a seed script that populates the database with test data:

### Running the Seed Script
```bash
cd backend
npm run seed
```

### Test User Credentials
- **Email**: test@example.com
- **Password**: Test@123

### Seed Data Includes
- 1 test user
- 2 sample projects (E-commerce Website, Mobile App Development)
- 6 tasks distributed across the projects with various statuses and priorities

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Projects
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks/project/:projectId` - Get tasks for a project
- `POST /api/tasks/project/:projectId` - Create new task
- `PUT /api/tasks/:taskId` - Update task
- `DELETE /api/tasks/:taskId` - Delete task

## Project Structure

```
Assignment/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── projectController.js
│   │   │   └── taskController.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   └── Task.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── projects.js
│   │   │   └── tasks.js
│   │   └── seedData.js
│   ├── package.json
│   ├── Dockerfile
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   ├── Projects/
│   │   │   └── Tasks/
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── ProjectDetail.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   └── types/
│   │       └── index.ts
│   ├── package.json
│   ├── Dockerfile
│   └── tsconfig.json
├── docker-compose.yml
└── README.md
```

## Features Implemented

### Core Requirements ✅
- [x] JWT-based authentication with bcryptjs password hashing
- [x] Full CRUD operations for projects
- [x] Full CRUD operations for tasks
- [x] Task filtering by status
- [x] User authorization (users only see their own data)
- [x] Seed script with test data

### Frontend Requirements ✅
- [x] Login/register pages
- [x] Dashboard with project list
- [x] Project details page with tasks
- [x] Add/edit forms for projects and tasks
- [x] **Complete TypeScript implementation** with type safety
- [x] Responsive design with Tailwind CSS

### Bonus Features ✅
- [x] Form validation with React Hook Form + Yup
- [x] State management with Context API
- [x] Task priority system
- [x] Due date management
- [x] Clean, modern UI with Tailwind CSS
- [x] **Docker containerization** for easy deployment
- [x] **Comprehensive TypeScript types** for all components and data models

## Known Limitations

1. **No pagination** - All projects and tasks are loaded at once
2. **No search functionality** - Users cannot search through projects or tasks
3. **No real-time updates** - Changes require page refresh to see updates from other sessions
4. **Basic error handling** - Some edge cases may not be gracefully handled
5. **No file attachments** - Tasks cannot have file attachments
6. **No user profile management** - Users cannot update their profile information

## Future Enhancements

- Add pagination for projects and tasks
- Implement search and advanced filtering
- Add real-time updates with WebSockets
- Include file attachment support for tasks
- Add user profile management
- Implement task assignment to multiple users
- Add project templates
- Include time tracking functionality

## TypeScript Implementation

This project showcases comprehensive TypeScript usage:

### Type Safety Features
- **Strict TypeScript configuration** with no implicit any
- **Custom interfaces** for all data models (User, Project, Task)
- **Form data types** for React Hook Form integration
- **API response types** for type-safe HTTP requests
- **Component prop interfaces** for React components
- **Context type definitions** for state management

### Key TypeScript Files
- `frontend/src/types/index.ts` - Central type definitions
- `frontend/tsconfig.json` - Strict TypeScript configuration
- All `.tsx` files use proper typing throughout

## Development

### Running Tests
```bash
# Backend tests (if implemented)
cd backend
npm test

# Frontend tests (if implemented)
cd frontend
npm test
```

### Building for Production
```bash
# Frontend build
cd frontend
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).