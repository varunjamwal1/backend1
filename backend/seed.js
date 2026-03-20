import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';

dotenv.config();

const createOwner = async () => {
  try {
    await connectDB();

    // Check if owner already exists
    const existingUser = await User.findOne({ email: 'admin@varunstore.com' });
    if (existingUser) {
      console.log('⚠️ Owner already exists!');
      process.exit();
    }

    const owner = await User.create({
      name: 'Varun Admin',
      email: 'admin@varunstore.com',
      password: 'admin123',
      role: 'owner'
    });

    console.log('✅ Owner created successfully!');
    console.log(`📧 Email: ${owner.email}`);
    console.log(`🔑 Password: admin123`);
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

createOwner();