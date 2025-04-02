
const { Pool } = require('pg');
require('dotenv').config({ path: `${__dirname}/../.env` });

// Validate required environment variables
const requiredEnvVars = ['PGUSER', 'PGDATABASE', 'PGPASSWORD'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Database configuration
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE,
  password: String(process.env.PGPASSWORD),
  port: Number(process.env.PGPORT) || 5432,
});

// Immediately test the connection
(async () => {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    console.log(`✅ Database connected at: ${res.rows[0].now}`);
    client.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    console.log('Current configuration:', {
      user: pool.options.user,
      host: pool.options.host,
      database: pool.options.database,
      port: pool.options.port
    });
    process.exit(1);
  }
})();

// Handle connection errors
pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params)
};