/**
 * Initialize Admin User
 * This script creates the default admin user in the database
 * Run once after setting up the database: node init-admin.js
 */

const bcrypt = require('bcryptjs');
const db = require('./backend/config/database');
require('dotenv').config();

async function initAdmin() {
  try {
    console.log('🔐 Initializing admin user...');

    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';

    // Check if admin already exists
    const [existing] = await db.query(
      'SELECT id FROM admin_users WHERE username = ?',
      [username]
    );

    if (existing.length > 0) {
      console.log('⚠️  Admin user already exists!');
      console.log(`   Username: ${username}`);
      console.log('   To create a new admin, delete the existing one first or use a different username.');
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert admin user
    await db.query(
      'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
      [username, passwordHash]
    );

    console.log('✅ Admin user created successfully!');
    console.log('============================================================');
    console.log('📋 Admin Credentials:');
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);
    console.log('============================================================');
    console.log('⚠️  IMPORTANT: Change the password after first login!');
    console.log('🔗 Login at: http://localhost:3000/admin-dashboard.html');
    console.log('============================================================');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
}

initAdmin();
