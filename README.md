# Notes App

A full-stack web application for creating, managing, and organizing personal notes with authentication and real-time synchronization. Built with Django REST Framework, React, TypeScript, and Docker.

## Features

### Authentication & User Management
- User registration and login with email-based authentication
- JWT token-based authentication for secure API access
- User profile management with the ability to update username
- Password hashing and validation
- Superuser/admin account creation

### Note Management
- Create, read, update, and delete notes
- Search and filter notes by title and content
- Organize notes with titles and rich text content
- Track note creation and last updated timestamps
- Support for bulk operations (create, update, delete multiple notes)

### User Interface
- Responsive design with Tailwind CSS
- Dark/Light theme toggle
- Grid and List view modes for notes
- Drag-and-drop reordering of notes
- Real-time search filtering
- Modal-based note creation and editing
- User profile dropdown menu with logout
- Beautiful UI components with shadcn/ui

### Backend Features
- RESTful API with standardized response formatting
- JWT authentication with access and refresh tokens
- CORS support for frontend integration
- Pagination support for note lists (10 items per page)
- Input validation and error handling
- PostgreSQL database with optimized indexes
- Static file serving for frontend build

## Project Structure

```
NotesApp/
├── BACKEND/                 # Django REST Framework backend
│   ├── account/            # User authentication and profile management
│   │   ├── models.py       # User model with UUID and email-based auth
│   │   ├── views.py        # Login, Register, Profile endpoints
│   │   ├── serializers.py  # User data serialization
│   │   └── urls.py         # Account routes
│   ├── note/               # Note management
│   │   ├── models.py       # Note model with user foreign key
│   │   ├── views.py        # CRUD endpoints for notes
│   │   ├── serializers.py  # Note data serialization
│   │   └── urls.py         # Note routes
│   ├── project/            # Django project configuration
│   │   ├── settings.py     # Django settings with JWT, CORS, Database config
│   │   ├── urls.py         # Main URL router
│   │   ├── asgi.py         # ASGI configuration
│   │   └── wsgi.py         # WSGI configuration
│   ├── utils/              # Utility modules
│   │   └── response_wrapper.py  # Standardized API response formatting
│   ├── Dockerfile          # Backend container configuration
│   ├── entrypoint.sh       # Container startup script
│   ├── manage.py           # Django management command
│   └── requirements.txt    # Python dependencies
│
├── FRONTEND/               # React + TypeScript frontend
│   ├── src/
│   │   ├── App.tsx         # Main app component with routing
│   │   ├── main.tsx        # React entry point
│   │   ├── contexts/       # React context providers
│   │   │   ├── AuthContext.tsx    # Authentication state management
│   │   │   └── ThemeContext.tsx   # Theme (dark/light) state
│   │   ├── pages/          # Page components
│   │   │   ├── Index.tsx        # Landing page
│   │   │   ├── Login.tsx        # Login page
│   │   │   ├── Register.tsx     # Registration page
│   │   │   ├── ForgotPassword.tsx
│   │   │   ├── Dashboard.tsx    # Main notes dashboard
│   │   │   ├── Settings.tsx     # User settings page
│   │   │   └── NotFound.tsx     # 404 page
│   │   ├── components/     # Reusable React components
│   │   │   ├── NoteCard.tsx         # Individual note display
│   │   │   ├── NoteModal.tsx        # Create/Edit note modal
│   │   │   ├── ProtectedRoute.tsx   # Auth-protected route wrapper
│   │   │   ├── ThemeToggle.tsx      # Dark/Light theme switcher
│   │   │   └── ui/                  # shadcn/ui components
│   │   ├── hooks/          # Custom React hooks
│   │   │   ├── use-toast.ts    # Toast notifications
│   │   │   └── use-mobile.tsx  # Mobile detection
│   │   ├── lib/            # Utility functions
│   │   │   ├── api.ts         # API client for backend communication
│   │   │   ├── noteStorage.ts # Local storage management for note preferences
│   │   │   └── utils.ts       # Helper utility functions
│   │   ├── types/          # TypeScript type definitions
│   │   │   └── index.ts
│   │   └── data/           # Static data
│   │       └── demoData.ts # Demo colors and initial data
│   ├── Dockerfile         # Frontend container configuration
│   ├── package.json       # Node dependencies and scripts
│   ├── tsconfig.json      # TypeScript configuration
│   ├── tailwind.config.ts # Tailwind CSS configuration
│   ├── vite.config.ts     # Vite build tool configuration
│   └── index.html         # HTML entry point
│
├── nginx/                  # Nginx reverse proxy configuration
│   └── nginx.conf         # Reverse proxy rules and static file serving
│
└── docker-compose.yml     # Docker Compose orchestration file
```

## Technology Stack

### Backend
- **Framework**: Django
- **API**: Django REST Framework
- **Authentication**: djangorestframework-simplejwt, PyJWT
- **Database**: PostgreSQL (psycopg)
- **Server**: Gunicorn
- **CORS**: django-cors-headers

### Frontend
- **Framework**: React
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Form Management**: React Hook Form, Zod
- **State Management**: React Context, TanStack Query
- **Routing**: React Router DOM
- **UI Libraries**: Radix UI, Lucide React, Recharts
- **Drag & Drop**: @hello-pangea/dnd

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx (Alpine)
- **Database**: PostgreSQL (Latest)

## Getting Started

### Prerequisites
- Docker & Docker Compose (for containerized setup)
- Node.js 18+ & npm/bun (for local frontend development)
- Python 3.10+ & pip (for local backend development)
- PostgreSQL (if running locally without Docker)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hemanggour/Notes-App.git
   cd Notes-App
   ```

2. **Configure environment variables**
   
   Create `.env` file in the `BACKEND` directory:
   ```env
   DEBUG=True
   SECRET_KEY=your-secret-key-here
   ALLOWED_HOSTS=localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost
   
   # Database Configuration
   DB_NAME=notesapp_db
   DB_USER=notesapp_user
   DB_PASSWORD=your-secure-password
   DB_HOST=db
   DB_PORT=5432
   
   # Superuser Configuration
   SUPERUSER_USERNAME=admin
   SUPERUSER_EMAIL=admin@notesapp.com
   SUPERUSER_PASSWORD=admin-password
   
   # Redis
   REDIS_HOST=redis
   REDIS_PORT=6379
   ```

3. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost/api/
   - Django Admin: http://localhost/admin/

### Local Development Setup

#### Backend Setup
```bash
cd BACKEND

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

#### Frontend Setup
```bash
cd FRONTEND

# Install dependencies
npm install
# or with bun
bun install

# Start development server
npm run dev
# or
bun dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `GET /api/auth/profile/` - Get user profile (requires authentication)
- `PATCH /api/auth/profile/` - Update user profile (requires authentication)

### Notes
- `GET /api/notes/` - Fetch all notes for authenticated user (supports query params: `note_uuid`)
- `POST /api/notes/` - Create a new note
  ```json
  {
    "title": "Note Title",
    "content": "Note content"
  }
  ```
- `PATCH /api/notes/` - Update an existing note
  ```json
  {
    "note_uuid": "uuid-string",
    "title": "Updated Title",  // optional
    "content": "Updated content"  // optional
  }
  ```
- `DELETE /api/notes/` - Delete notes
  ```json
  {
    "note_uuid": ["uuid1", "uuid2"]
  }
  ```

## Authentication Flow

1. User registers with email, username, and password
2. Backend creates User object and returns JWT access and refresh tokens
3. Frontend stores tokens (access token in memory, refresh token in secure storage)
4. Subsequent API requests include Bearer token in Authorization header
5. Protected routes check token validity and user authentication status
6. Frontend redirects unauthenticated users to login page

## Database Schema

### User Model
- `user_uuid` - UUID field for external identification
- `email` - Unique email address (used for authentication)
- `username` - User's display name
- `password` - Hashed password
- `is_active` - Account status flag
- `created_at`, `updated_at` - Timestamps

### Note Model
- `note_uuid` - Unique UUID for external reference
- `user` - Foreign key to User model (cascade delete)
- `title` - Note title (max 255 characters)
- `content` - Note content (text field, up to 100,000 characters)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

**Indexes**: 
- Email index on User table for fast lookups
- User and note_uuid indexes on Note table for filtering

## Docker Configuration

### Services
- **db**: PostgreSQL database container
- **backend**: Django REST API container (depends on db)
- **frontend**: React application with Nginx container (depends on backend)
- **nginx**: Reverse proxy container (depends on backend and frontend)

### Volumes
- `postgres_data` - Persists database data
- `static_volume` - Stores Django static files
- `frontend_build` - Stores frontend build output

### Networks
- `notesapp-network` - Shared bridge network for container communication

## Development Guidelines

### Code Structure
- Backend follows Django app-based structure with clear separation of concerns
- Frontend uses React hooks and context for state management
- Components are modular and reusable
- API communication is centralized in `lib/api.ts`

### Styling
- Tailwind CSS for utility-first styling
- shadcn/ui for pre-built accessible components
- Custom theme support with dark/light modes

### Type Safety
- Full TypeScript support for type checking
- Zod for runtime validation of form data
- Typed API responses and requests

## Performance Optimizations

- **Pagination**: API returns 10 notes per page
- **Database Indexes**: Optimized queries with indexes on frequently searched fields
- **Gzip Compression**: Enabled in Nginx for response compression
- **Static File Caching**: 30-day cache headers for static assets
- **JWT Tokens**: 1-day access token lifetime, 7-day refresh token lifetime
- **Local Storage**: Note preferences (colors, positions) cached locally

## Security Features

- JWT-based authentication with token refresh mechanism
- Password hashing with Django's built-in authentication
- CORS configuration to prevent unauthorized cross-origin requests
- CSRF protection in Django middleware
- Environment-based configuration for sensitive data
- Email-based user identification (no usernames for login)

## Contributing

1. Create a feature branch from `main`
2. Make your changes following the existing code structure
3. Test your changes locally
4. Commit with clear commit messages
5. Push to the repository and create a pull request

## Troubleshooting

### Docker Compose Issues
- Ensure Docker daemon is running
- Check port 80 is available
- Run `docker-compose down` and `docker-compose up -d` to restart services

### Database Connection Issues
- Verify PostgreSQL is running in the db container
- Check database credentials in `.env` file
- Run `docker-compose logs db` to view database logs

### Frontend Build Issues
- Clear node_modules: `rm -rf FRONTEND/node_modules`
- Reinstall dependencies: `npm install`
- Check Node.js version compatibility (18+)

### API Connection Issues
- Verify backend is running: `curl http://localhost/api/`
- Check CORS configuration in Django settings
- Verify JWT tokens are being sent correctly in request headers

## License

This project is open source and available under the MIT License.

## Contact & Support

For questions, issues, or suggestions, please create an issue in the GitHub repository.

---
