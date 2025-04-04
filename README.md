# crud-exemplo-logicbox

## TODO
- [x] Database setup
- [x] Token validation logic
- [x] Backend
    - [x] Routes
        - [x] User Authentication
        - [x] Users
            - [x] POST: Create new user
            - [x] GET: All users list
        - [x] Users:id
            - [x] PUT: Edit user by id
            - [x] DELETE: Delete user by id
- [ ] Frontend
    - [x] Login Screen component
    - [ ] Main Screen component
        - [x] Route protection
        - [x] Header component
        - [x] Sidebar component
        - [x] Content component
            - [x] Home component
            - [x] User list component
            - [x] Register component

## File Structure
```
crud-exemplo-logicbox/
├── frontend/           # React application
│   └── src/            # React source code
│       ├── components/ # Reusable UI components
│       └── App.jsx     # Main app component
│
├── app/               # Express backend
│   ├── controllers/   # Route controllers
│   ├── routes/        # API routes
│   ├── services/      # Backend functions
│   ├── middlewares/   # Express middlewares
│   └── app.js         # Main server file
│
├── database/          # PostgreSQL files
│   ├── migrations/    # Database migrations
│   ├── seeds/         # Seed data
│   ├── backups/       # DB Backups folder
│   ├── backup.sh      # Creates a backup file and cleans old backups (7 days old)
│   └── setup.sh       # Script to setup the database
│
├── .env               # Environment variables
├── .gitignore         # Git ignore file
└── README.md          # Project documentation
```