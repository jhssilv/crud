const express = require('express');
const router = express.Router();
const { query } = require('../services/databaseConfig'); 

router.get('/', async (req, res) => {
    try {
        // Get page number from query params, default to 1 if not provided
        const page = parseInt(req.query.page) || 1;
        const usersPerPage = 20;
        const offset = (page - 1) * usersPerPage;

        // 1. Get paginated users from database
        const users = await query(
            `SELECT id, name, email, is_admin
             FROM users 
             WHERE deleted_at IS NULL 
             ORDER BY id ASC
             LIMIT $1 OFFSET $2`,
            [usersPerPage, offset]
        );

        // 2. Get total count of users for pagination info
        const totalCountResult = await query(
            `SELECT COUNT(*) FROM users WHERE deleted_at IS NULL`
        );
        const totalCount = parseInt(totalCountResult.rows[0].count);
        const totalPages = Math.ceil(totalCount / usersPerPage);

        // 3. Return paginated response
        res.json({
            message: 'User list loaded successfully',
            data: {
                users: users.rows,
                pagination: {
                    current_page: page,
                    total_pages: totalPages,
                    total_users: totalCount,
                    users_per_page: usersPerPage,
                    has_next_page: page < totalPages,
                    has_previous_page: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, email, password, is_admin = false } = req.body;

        // 1. Input validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Missing required fields',
                required: ['name', 'email', 'password'],
                received: { name, email, password: !!password }
            });
        }

        // 2. Check if email already exists
        const existingUser = await query(
            `SELECT id FROM users WHERE email = $1`,
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: 'Email already in use'
            });
        }

        // 3. Insert new user
        const result = await query(
            `INSERT INTO users (name, email, user_password, is_admin) 
             VALUES ($1, $2, crypt($3, gen_salt('bf')), $4)
             RETURNING id, name, email, is_admin`,
            [name, email, password, is_admin]
        );

        // 4. Successful response
        res.status(201).json({
            message: 'User created successfully',
            user: result.rows[0],
            links: {
                view: `/api/users/${result.rows[0].id}`,
                all_users: '/api/users'
            }
        });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack
            } : undefined
        });
    }
});

module.exports = router;