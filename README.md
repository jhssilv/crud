# CRUD Example Project 🚀

A full-stack CRUD application demonstrating user management with authentication, built as a technical assessment for an internship position.

![Main Screen Preview](/images/mainscreen.png) 
*Main Screen Preview*

![New User Modal Preview](/images/newuser.png) 
*New User Modal Preview*

## Features ✅

### Core Functionality
- 🔐 JWT-based Authentication System
- 🛡️ Route Protection Middleware
- 📋 Complete User Management (CRUD Operations)
- ♻️ Automated Database Backups

### Backend (Express.js)
- **Authentication Routes**
  - `POST /auth` - JWT Token Generation & Validation
- **User Management Endpoints**
  - `POST /users` - Create new user
  - `GET /users` - List all users
  - `PUT /users/:id` - Update user by ID
  - `DELETE /users/:id` - Remove user by ID

### Frontend (React)
- 🖥️ Login Screen with Form Validation
- 🛡️ Protected Routes System
- 📊 Dashboard Layout with:
  - 🧭 Navigation Sidebar
  - 🏠 Home Overview
  - 👥 Paginated User List Interface
  - ✍️ Registration Form

## Tech Stack 💻

| Area        | Technologies                                                                 |
|-------------|------------------------------------------------------------------------------|
| **Frontend**| React, React Router, CSS Modules                                     |
| **Backend** | Express.js, PostgreSQL, JWT                           |
| **Tools**   | Postgres, Git, Bash Scripting, Dotenv                                       |

## Installation & Setup ⚙️

### Prerequisites
- Node.js ≥14.x
- PostgreSQL ≥12.x
- npm/yarn

### Configuration
1. Clone repository:
   ```bash
   git clone https://github.com/your-username/crud-exemplo-logicbox.git
   ```
2. Set up environment variables (.env):
   ```env
   PGHOST=localhost
   PGPORT=5432
   PGDATABASE=your_db_name
   PGUSER=your_db_user
   PGPASSWORD=your_db_password
   JWT_SECRET=your_jwt_secret_key
   ```

### Database Setup
```bash
cd database/
./setup.sh  # Creates database structure and seed data
```

### Running the Application
**Backend:**
```bash
cd app/
npm install
npm run start
```

**Frontend:**
```bash
cd frontend/
npm install
npm run start
```

## Backup System 💾
The automated backup script maintains 7-day retention:
```bash
cd database/
./backup.sh  # Creates timestamped dump and cleans old backups
```

## File Structure 📂
```bash
crud-exemplo-logicbox/
├── frontend/           # React client
│   └── src/            # Source code
│       ├── components/ # Reusable UI components
│       └── App.jsx     # Root component
│
├── app/                # Express server
│   ├── controllers/    # Business logic
│   ├── routes/         # API endpoints
│   ├── middlewares/    # Auth handlers
│   └── app.js          # Server entry
│
├── database/           # DB management
│   ├── migrations/     # Schema changes
│   ├── seeds/          # Test data
│   ├── backups/        # Automatic dumps
│   └── *.sh            # Maintenance scripts
│
└── env.example         # Configuration template
```