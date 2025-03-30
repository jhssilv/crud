# crud-exemplo-logicbox

## TODO
- [x] Database setup
- [ ] Backend
    - [ ] Routes
        - [ ] Users
            - [ ] POST: Create new user
            - [ ] GET: All users list
        - [ ] Users:id
            - [ ] PUT: Edit user by id
            - [ ] DELETE: Delete user by id
- [ ] Frontend
    - [ ] Login Screen component
    - [ ] Main Screen component
        - [ ] Route protection
        - [ ] Header component
        - [ ] Sidebar component
        - [ ] Content component
            - [ ] User list component
            - [ ] Register component

## File Structure
```
project-dir/
├── frontend/           # React application
│   ├── public/         # Static files
│   └── src/            # React source code
│       ├── components/ # Reusable UI components
│       ├── pages/      # Page components
│       ├── services/   # API service calls
│       ├── styles/     # CSS/Styling
│       └── App.jsx     # Main app component
│
├── app/               # Express backend
│   ├── controllers/   # Route controllers
│   ├── middleware/    # Custom middleware
│   ├── routes/        # API routes
│   ├── services/      # 
│   └── app.js         # Main server file
│
├── database/          # PostgreSQL files
│   ├── migrations/    # Database migrations
│   ├── seeds/         # Seed data
│   ├── queries/       # SQL queries
│   └── setup.sh       # Script to setup the database
│
├── .env               # Environment variables
├── .gitignore         # Git ignore file
└── README.md          # Project documentation
```