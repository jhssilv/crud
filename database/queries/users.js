// Find user by email
const getUserByEmail = async (email) => {
    const query = {
      text: 'SELECT id, name, email, user_password, is_admin FROM users WHERE email = $1 AND deleted_at IS NULL',
      values: [email]
    };
    const result = await pool.query(query);
    return result.rows[0] || null;
  };