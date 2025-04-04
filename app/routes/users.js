const express = require('express');
const router = express.Router();
const { query } = require('../services/databaseConfig');

const validateToken = require('../middleware/validateToken');
router.use(validateToken);

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


router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Check if user exists
        const userCheck = await query(
            `SELECT id FROM users WHERE id = $1`,
            [id]
        );

        if (userCheck.rows.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // 2. Delete the user
        const result = await query(
            `DELETE FROM users WHERE id = $1 RETURNING *`,
            [id]
        );

        // 3. Successful response
        res.status(200).json({
            message: 'User deleted successfully',
            user: result.rows[0],
            links: {
                all_users: '/api/users'
            }
        });

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack
            } : undefined
        });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, is_admin } = req.body;

        // 1. Input validation
        if (!name && !email && !password && is_admin === undefined) {
            return res.status(400).json({
                message: 'No fields to update',
                required: ['At least one of: name, email, password, is_admin'],
                received: { name, email, password: !!password, is_admin }
            });
        }

        // 2. Check if user exists
        const userCheck = await query(
            `SELECT id FROM users WHERE id = $1`,
            [id]
        );

        if (userCheck.rows.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // 3. Check if new email is already in use by another user
        if (email) {
            const emailCheck = await query(
                `SELECT id FROM users WHERE email = $1 AND id != $2`,
                [email, id]
            );

            if (emailCheck.rows.length > 0) {
                return res.status(409).json({
                    message: 'Email already in use by another user'
                });
            }
        }

        // 4. Build update query based on provided fields
        let queryParts = [];
        let queryParams = [];
        let paramIndex = 1;

        if (name) {
            queryParts.push(`name = $${paramIndex}`);
            queryParams.push(name);
            paramIndex++;
        }

        if (email) {
            queryParts.push(`email = $${paramIndex}`);
            queryParams.push(email);
            paramIndex++;
        }

        if (password) {
            queryParts.push(`user_password = crypt($${paramIndex}, gen_salt('bf'))`);
            queryParams.push(password);
            paramIndex++;
        }

        if (is_admin !== undefined) {
            queryParts.push(`is_admin = $${paramIndex}`);
            queryParams.push(is_admin);
            paramIndex++;
        }

        queryParams.push(id);

        // 5. Execute update
        const result = await query(
            `UPDATE users 
             SET ${queryParts.join(', ')} 
             WHERE id = $${paramIndex}
             RETURNING id, name, email, is_admin`,
            queryParams
        );

        // 6. Successful response
        res.status(200).json({
            message: 'User updated successfully',
            user: result.rows[0],
            links: {
                view: `/api/users/${result.rows[0].id}`,
                all_users: '/api/users'
            }
        });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack
            } : undefined
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Gets the user info for token validation
        const getUser = await query(
            `SELECT id, token, expired_at FROM users WHERE id = $1`,
            [id]
        );

        // 2. Successful response
        res.status(200).json({
            message: 'User updated successfully',
            user: result.rows[0],
            links: {
                view: `/api/users/${result.rows[0].id}`,
                all_users: '/api/users'
            }
        });

    } catch (error) {
        console.error('Error getting user:', error);
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