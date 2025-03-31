const express = require('express');
const router = express.Router();
const { authenticateUser, generateToken } = require('../services/authService');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // 1. Authenticate user
    const user = await authenticateUser(username, password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2. Generate JWT token
    const token = generateToken(user);

    // 3. Return single success response
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

module.exports = router;