
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('./databaseConfig'); 

const authenticateUser = async (username, password) => {
  try {
    // 1. Get user from database
    const result = await query(
      `SELECT id, name, email, user_password, is_admin, created_at, updated_at
       FROM users WHERE name = $1 AND deleted_at IS NULL LIMIT 1`,
      [username.trim()]
    );
    
    const user = result.rows[0];
    if (!user) return null;

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.user_password);
    if (!isMatch) return null;

    // 3. Return user data without password
    const { user_password, ...userWithoutPassword } = user;
    return userWithoutPassword;
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

module.exports = { authenticateUser, generateToken };