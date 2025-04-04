const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { query } = require('../services/databaseConfig'); 

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const { user, token } = await authenticateUser(email, password);
    if (!user || !token) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.name,
        email: user.email,
        isAdmin: user.is_admin
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

const authenticateUser = async (email, password) => {
  try {
    // 1. Get user from database
    const result = await query(
      `SELECT id, name, email, user_password, is_admin, created_at, updated_at
       FROM users WHERE email = $1 AND deleted_at IS NULL LIMIT 1`,
      [email.trim()]
    );
    
    const user = result.rows[0];
    if (!user) return { user: null, token: null };

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.user_password);
    if (!isMatch) return { user: null, token: null };

    // 3. Generate new token
    const token = generateToken(user);

    // 4. Update token in database (this will trigger the expiration update)
    await query(
      `UPDATE users SET token = $1 WHERE id = $2`,
      [token, user.id]
    );

    // 5. Return user data without password and the new token
    const { user_password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, isAdmin: user.is_admin },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

module.exports = router;